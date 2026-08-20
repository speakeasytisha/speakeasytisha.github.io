(() => {
  'use strict';
  document.documentElement.classList.add('js-ready');
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const STORAGE = 'mahria_lesson3_shoe_metier_interview_v1';

  const saved = (() => { try { return JSON.parse(localStorage.getItem(STORAGE) || '{}'); } catch { return {}; } })();
  const state = {
    answers: saved.answers || {}, attempted: saved.attempted || {}, completed: new Set(saved.completed || []),
    review: saved.review || {}, mode: saved.mode || 'coach', showFrench: !!saved.showFrench,
    writing: saved.writing || '', simNotes: saved.simNotes || ''
  };
  function persist(){
    try{
      let current={}; try{current=JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{}
      localStorage.setItem(STORAGE,JSON.stringify({...current,answers:state.answers,attempted:state.attempted,completed:[...state.completed],review:state.review,mode:state.mode,showFrench:state.showFrench,writing:state.writing,simNotes:state.simNotes}));
    }catch{}
  }

  // ---------- Interview countdown ----------
  const interviewDate = new Date('2026-08-24T09:00:00+02:00');
  const days = Math.max(0, Math.ceil((interviewDate - new Date()) / 86400000));
  if ($('#daysToInterview')) $('#daysToInterview').textContent = days;

  // ---------- Mode + French ----------
  function applyMode(){ document.body.classList.toggle('interview-mode',state.mode==='interview'); $('#modeBtn').textContent=state.mode==='interview'?'Interview mode':'Coach mode'; }
  function applyFrench(){ document.body.classList.toggle('show-fr',state.showFrench); $('#frenchBtn').textContent=state.showFrench?'FR support: on':'FR support: off'; }
  applyMode(); applyFrench();
  $('#modeBtn').addEventListener('click',()=>{state.mode=state.mode==='coach'?'interview':'coach';applyMode();persist()});
  $('#frenchBtn').addEventListener('click',()=>{state.showFrench=!state.showFrench;applyFrench();persist()});
  $('#printBtn').addEventListener('click',()=>window.print());
  $$('[data-scroll]').forEach(btn=>btn.addEventListener('click',()=>{const el=$(btn.dataset.scroll);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}));

  // ---------- Audio ----------
  let voices=[];
  function loadVoices(){ if('speechSynthesis' in window) voices=speechSynthesis.getVoices(); }
  loadVoices(); if('speechSynthesis' in window) speechSynthesis.onvoiceschanged=loadVoices;
  function speak(text){
    if(!('speechSynthesis' in window)||!text)return;
    speechSynthesis.cancel();
    const lang=$('#accentSelect').value||'en-GB'; const u=new SpeechSynthesisUtterance(text); u.lang=lang;u.rate=.93;u.pitch=1;
    const exact=voices.find(v=>v.lang===lang&&/Google|Microsoft|Daniel|Serena|Sonia|Ryan|Samantha/i.test(v.name));
    const fallback=voices.find(v=>v.lang===lang)||voices.find(v=>v.lang.startsWith(lang.slice(0,2))); if(exact||fallback)u.voice=exact||fallback;
    speechSynthesis.speak(u);
  }
  document.addEventListener('click',e=>{const el=e.target.closest('[data-say]');if(el)speak(el.dataset.say)});
  $('#stopAudio').addEventListener('click',()=>{if('speechSynthesis'in window)speechSynthesis.cancel()});

  // ---------- Generic reveals ----------
  $$('[data-reveal]').forEach(btn=>btn.dataset.original=btn.textContent);
  document.addEventListener('click',e=>{
    const btn=e.target.closest('[data-reveal]'); if(!btn||state.mode==='interview')return; const el=document.getElementById(btn.dataset.reveal);if(!el)return;
    el.classList.toggle('show'); btn.textContent=el.classList.contains('show')?'Hide':btn.dataset.original;
  });

  // ---------- Completion ----------
  $$('.complete-btn').forEach(btn=>{
    const key=btn.dataset.complete; const paint=()=>{const done=state.completed.has(key);btn.classList.toggle('done',done);btn.textContent=done?'Done ✓':(key==='final-sprint'?'Mark final sprint done':key==='writing-paragraph'?'Mark writing done':'Mark done')};
    paint();btn.addEventListener('click',()=>{state.completed.has(key)?state.completed.delete(key):state.completed.add(key);paint();persist();updateReport()});
  });

  // ---------- Flow map ----------
  const flowData={
    studio:{title:'Creation / Studio',text:'The creative starting point: design direction, silhouettes, colours, materials and the visual identity of the collection. Your coordination need: protect creative reviews, ensure the right participants and documents are ready, and understand which decisions affect later steps.'},
    collection:{title:'Collection coordination',text:'The range and calendar are organised across models, milestones and presentations. Your coordination need: forward visibility, recurring meeting rhythm, shared documents and clean action tracking.'},
    development:{title:'Development',text:'Ideas become workable products through samples, fittings, technical decisions and exchanges with specialists or suppliers. Your coordination need: meeting preparation, sample/status visibility, travel, follow-up and early warning when timing moves.'},
    industrial:{title:'Industrial / Production',text:'The focus shifts to manufacturing readiness, workshops, capacity, process, timing and constraints. Your coordination need: priorities, dashboards, supplier/atelier meetings, decision points and transparent escalation.'},
    quality:{title:'Quality + Supply',text:'Quality checks standards and consistency; supply chain and purchasing help materials, suppliers and deliveries stay aligned. Your coordination need: reliable information, risk visibility, clear owners and disciplined follow-up.'}
  };
  function paintFlow(key){const d=flowData[key];$('#flowDetail').innerHTML=`<strong>${d.title}</strong><br>${d.text}`;$$('.flow-node').forEach(b=>b.classList.toggle('active',b.dataset.flow===key))}
  $$('.flow-node').forEach(b=>b.addEventListener('click',()=>paintFlow(b.dataset.flow)));paintFlow('studio');

  // ---------- Data helpers ----------
  const shuffle=arr=>{const out=[...arr];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out};
  function setAnswer(id,correct){state.attempted[id]=true;state.answers[id]=!!correct;persist();updateReport()}
  function renderQuiz(containerId,items){
    const root=$(containerId);root.innerHTML='';
    items.forEach(item=>{
      const wrap=document.createElement('article');wrap.className='quiz-item';wrap.dataset.qid=item.id;
      const choices=shuffle(item.choices.map(c=>Array.isArray(c)?{text:c[0],correct:c[1]}:c));
      wrap.innerHTML=`<div class="quiz-q">${item.q}</div><div class="choice-row"></div><div class="feedback" aria-live="polite"></div>`;
      const row=$('.choice-row',wrap),fb=$('.feedback',wrap);
      choices.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='choice-btn';b.textContent=c.text;b.addEventListener('click',()=>{
        $$('.choice-btn',wrap).forEach(x=>x.classList.remove('selected','correct','incorrect','dim')); b.classList.add('selected',c.correct?'correct':'incorrect');
        $$('.choice-btn',wrap).forEach(x=>{if(x!==b)x.classList.add('dim')});wrap.classList.toggle('correct',c.correct);wrap.classList.toggle('incorrect',!c.correct);fb.className='feedback '+(c.correct?'good':'bad');fb.textContent=(c.correct?'✓ Correct. ':'✗ Not quite. ')+item.why;setAnswer(item.id,c.correct)
      });row.appendChild(b)});root.appendChild(wrap)
    })
  }

  const sectorQuestions=[
    {id:'sec1',q:'A designer wants to review the shape, colours and materials of a new model. Which team is the closest starting point?',choices:[['Creation / Studio',true],['Payroll',false],['Customer service',false]],why:'Creation / Studio is the creative starting point for the product.'},
    {id:'sec2',q:'A sample needs a fitting and technical adjustments before it can progress. Which activity is most relevant?',choices:[['Development',true],['Reception',false],['Internal communications only',false]],why:'Development turns the creative idea into a feasible product through samples, fittings and technical choices.'},
    {id:'sec3',q:'The question is whether an atelier can manufacture the model on time and at the required volume. Which lens is central?',choices:[['Industrial / production',true],['Brand social media',false],['Office supplies',false]],why:'Manufacturing readiness, capacity and timing are industrial/production questions.'},
    {id:'sec4',q:'A material delivery may arrive too late and affect several milestones. Which functions are likely involved?',choices:[['Supply chain / purchasing plus the affected development or industrial teams',true],['Only the assistant',false],['Only the studio receptionist',false]],why:'Material availability and delivery timing are cross-functional; the assistant helps connect the right owners.'},
    {id:'sec5',q:'As the Executive Assistant, what is the strongest way to react to a technical problem you do not own?',choices:[['Identify the right owner, clarify impact, keep the directors informed and track follow-up',true],['Give a technical answer yourself even if you are unsure',false],['Wait until someone asks for an update',false]],why:'The assistant creates visibility and coordination without replacing technical specialists.'},
    {id:'sec6',q:'Why is the four-collection rhythm relevant to an Executive Assistant?',choices:[['It creates recurring peaks, milestones, reviews and coordination needs that require forward calendar visibility',true],['It means the assistant must design four shoes',false],['It only matters to retail teams',false]],why:'Collection rhythms affect agendas, meetings, travel, reporting and priorities.'}
  ];
  renderQuiz('#sectorQuiz',sectorQuestions);

  // ---------- Vocabulary ----------
  const vocab={
    parts:[
      ['upper','la tige / partie supérieure','The part of the shoe that covers and holds the foot above the sole.','The upper material may need to be confirmed before the development review.'],
      ['outsole','la semelle extérieure','The bottom part of the shoe that touches the ground.','The team is reviewing the outsole before approving the sample.'],
      ['insole','la semelle intérieure','The layer inside the shoe under the foot.','The insole can affect comfort and fit.'],
      ['lining','la doublure','The material covering the inside of the shoe.','The lining material has changed on the latest sample.'],
      ['heel','le talon','The raised rear part under the shoe or the back part supporting the heel.','The heel height is one of the points in the product review.'],
      ['toe','le bout / l’avant de la chaussure','The front end of the shoe where the toes are.','The toe shape has been adjusted on the new prototype.'],
      ['tongue','la languette','The flexible part under the laces on many shoes.','The logo placement on the tongue needs confirmation.'],
      ['laces','les lacets','Strings used to tighten and fasten a shoe.','The sample arrived with different laces from the approved version.'],
      ['buckle','la boucle','A fastening made with a frame and pin or clasp.','The buckle finish is part of the design specification.'],
      ['stitching','les coutures / surpiqûres','The sewn lines that join or decorate parts of the shoe.','Quality identified an issue with the stitching on several samples.']
    ],
    materials:[
      ['leather','le cuir','A durable material made from animal hide and widely used in luxury footwear.','Leather selection can influence appearance, comfort and durability.'],
      ['full-grain leather','cuir pleine fleur','Leather whose top grain surface remains intact, showing natural characteristics.','Full-grain leather is valued for its natural surface and durability.'],
      ['calfskin','cuir de veau','Leather made from calf hide, often used for fine footwear and linings.','The model combines a calfskin upper with a leather lining.'],
      ['suede','le daim / cuir velours','Leather with a soft, napped surface.','The suede version requires careful handling during production.'],
      ['rubber','le caoutchouc','A flexible material often used for soles or functional components.','The sneaker has a rubber outsole.'],
      ['textile','le textile','A woven or knitted fabric material used for uppers, linings or details.','The development team is testing a textile option for the upper.'],
      ['hardware','les pièces métalliques','Metal components such as buckles, eyelets or decorative fittings.','The hardware colour must match the approved sample.'],
      ['lining material','matière de doublure','The material used on the interior surface of the shoe.','The lining material is being changed to improve comfort.']
    ],
    styles:[
      ['loafer','le mocassin','A slip-on low shoe, usually without laces.','The collection includes a leather loafer for city wear.'],
      ['sandal','la sandale','An open shoe held by straps or a shaped upper.','The sandal is being reviewed for fit and comfort.'],
      ['sneaker / trainer','la basket','A casual or sports-inspired shoe, often with a flexible sole.','The sneaker sample has arrived from the manufacturing partner.'],
      ['pump / court shoe','l’escarpin','A low-cut women’s shoe, often with a heel and no fastening.','The heel height of the pump is part of the fitting discussion.'],
      ['ankle boot','la bottine','A boot that reaches roughly to the ankle.','The ankle boot is scheduled for a development review this afternoon.'],
      ['boot','la botte','A shoe that covers the foot and extends above the ankle.','The boot requires a different fitting session from the low shoe.'],
      ['mule','la mule','A backless shoe that is easy to slip on.','The mule has a new upper material for the next sample.'],
      ['derby shoe','la chaussure derby','A classic lace-up shoe with open lacing.','The derby shoe is part of the men’s formal range.']
    ],
    development:[
      ['sketch','le croquis','An early drawing that communicates a design idea.','The team reviewed the sketch before requesting the first sample.'],
      ['sample','l’échantillon / prototype produit','A physical version made for review before final production.','The sample must arrive before tomorrow’s collection review.'],
      ['prototype','le prototype','An early version used to test design, construction or feasibility.','The prototype revealed a fitting issue that needs adjustment.'],
      ['fitting','l’essayage / séance d’essayage','A session to check how a shoe fits and performs on the foot.','The Development Director has a fitting at 2 p.m.'],
      ['last','la forme (de chaussure)','A foot-shaped form used to develop and manufacture the shape of a shoe.','The team changed the last to improve the fit of the model.'],
      ['pattern','le patron','A template used to cut the pieces that form the upper or other components.','The pattern needs a small adjustment before the next prototype.'],
      ['industrialisation','l’industrialisation','The process of preparing a developed product for reliable manufacturing.','Industrialisation begins once the design is sufficiently stable.'],
      ['production schedule','le planning de production','The planned timing for manufacturing activities and quantities.','The meeting is to review the production schedule and key risks.'],
      ['lead time','le délai de réalisation / d’approvisionnement','The time required between an order or request and completion or delivery.','The supplier has confirmed a longer lead time for the material.'],
      ['time to market','le délai de mise sur le marché','The total time needed to move a product from development toward launch or sale.','A late decision can affect the time to market for the collection.']
    ],
    coordination:[
      ['collection review','revue de collection','A meeting to review the status, choices or readiness of products in a collection.','I would make sure the right documents and participants are ready for the collection review.'],
      ['milestone','un jalon','A key point or deadline in a project or collection calendar.','I would map the main development milestones in the directors’ calendars.'],
      ['dashboard','un tableau de bord','A concise view of important indicators, status or risks.','I would centralise the information before sending the dashboard to both directors.'],
      ['reporting','le reporting / suivi d’activité','Structured information used to monitor activity and support decisions.','The role includes centralising Industrial and Development reporting.'],
      ['stakeholder','une partie prenante / interlocuteur clé','A person or team affected by or involved in a project or decision.','I would identify the key stakeholders before changing the meeting.'],
      ['action point','une action à réaliser','A specific follow-up task agreed during a meeting.','I would circulate the action points with owners and deadlines.'],
      ['meeting minutes','le compte rendu de réunion','A written record of key discussion points, decisions and actions.','I am comfortable preparing concise meeting minutes for senior stakeholders.'],
      ['follow-up','le suivi / relance','The action of checking progress after a request, meeting or decision.','Reliable follow-up is essential when several teams depend on the same deadline.'],
      ['purchase order','un bon de commande','A formal document used to order goods or services from a supplier.','I would check whether the purchase order had been approved before following up with the supplier.'],
      ['invoice','une facture','A document requesting payment for goods or services.','I have experience tracking supplier invoices and budget allocations.']
    ],
    quality:[
      ['quality control','le contrôle qualité','Checks used to confirm that a product or process meets required standards.','A quality control issue may need to be escalated before the review.'],
      ['defect','un défaut','A flaw or problem that means a product does not meet the expected standard.','The team identified a defect on the latest sample.'],
      ['constraint','une contrainte','A limit or condition that affects what is possible.','I would clarify the production constraint before proposing a new time.'],
      ['risk','un risque','Something that may negatively affect timing, quality, cost or delivery.','I would flag the risk early rather than wait for the deadline to be missed.'],
      ['delay','un retard','When something happens later than planned.','The delay affects tomorrow’s fitting and the director needs an early update.'],
      ['deadline','une échéance','The latest time by which something must be completed.','I always clarify the true deadline before moving other priorities.'],
      ['capacity','la capacité de production','The amount that a workshop, team or supplier can produce within a period.','The Industrial Director may need visibility on production capacity.'],
      ['approval','une validation','Formal agreement that something can move to the next step.','The sample cannot progress until the approval is confirmed.']
    ]
  };
  function renderVocab(cat){const root=$('#vocabGrid');root.innerHTML='';vocab[cat].forEach(([word,fr,def,ex])=>{const a=document.createElement('article');a.className='vocab-card';a.innerHTML=`<p class="word">${word}</p><p class="translation">${fr}</p><p class="definition">${def}</p><p class="example">“${ex}”</p><button type="button" data-say="${ex.replace(/"/g,'&quot;')}">Listen</button>`;root.appendChild(a)})}
  renderVocab($('#vocabCategory').value);$('#vocabCategory').addEventListener('change',e=>renderVocab(e.target.value));
  $('#hearVocabCategory').addEventListener('click',()=>{const cat=$('#vocabCategory').value;speak(vocab[cat].map(x=>`${x[0]}. ${x[3]}`).join(' '))});

  const vocabQuestions=[
    {id:'voc1',q:'The physical version arrives before a review so the team can inspect it. What is it?',choices:[['a sample',true],['a dashboard',false],['an invoice',false]],why:'A sample is a physical version used for review before final production.'},
    {id:'voc2',q:'You need the time required for a supplier to deliver a component. Which term is useful?',choices:[['lead time',true],['toe shape',false],['meeting minutes',false]],why:'Lead time is the time required between the request/order and delivery or completion.'},
    {id:'voc3',q:'The bottom surface of the shoe that touches the ground is the…',choices:[['outsole',true],['lining',false],['upper',false]],why:'The outsole is the external bottom of the shoe.'},
    {id:'voc4',q:'A foot-shaped form used to develop the shape of a shoe is called a…',choices:[['last',true],['milestone',false],['buckle',false]],why:'In footwear, a last is the foot-shaped form around which the shoe shape is developed.'},
    {id:'voc5',q:'A concise document showing status, indicators or risks for leaders is a…',choices:[['dashboard',true],['fitting',false],['pattern',false]],why:'A dashboard gives leaders a compact view of important status or indicators.'},
    {id:'voc6',q:'The sewn lines joining or decorating parts of a shoe are called…',choices:[['stitching',true],['capacity',false],['lining',false]],why:'Stitching refers to the sewn lines and joins.'},
    {id:'voc7',q:'A key date or decision point in the collection calendar is a…',choices:[['milestone',true],['mule',false],['hardware',false]],why:'A milestone is a key point or deadline in a process.'},
    {id:'voc8',q:'A product problem that fails to meet the expected standard is a…',choices:[['defect',true],['follow-up',false],['sample',false]],why:'A defect is a flaw or problem affecting expected quality.'}
  ];renderQuiz('#vocabQuiz',vocabQuestions);

  // ---------- Grammar ----------
  const grammarQuestions=[
    {id:'gra1',q:'Choose the natural sentence about your sector experience.',choices:[['I have worked in the luxury industry for more than ten years.',true],['I have worked in luxury industry since more than ten years.',false],['I work on the luxury industry for ten years.',false]],why:'Use the luxury industry, and for + duration.'},
    {id:'gra2',q:'Choose the natural phrase from the Cartier example.',choices:[['I organised a visit to headquarters.',true],['I organised a visit at headquarters.',false],['I organised visit headquarters.',false]],why:'Use organise a visit to + place. “Headquarters” can be used without an article in this expression.'},
    {id:'gra3',q:'A specific meeting already identified by both speakers:',choices:[['I would prepare the collection review carefully.',true],['I would prepare a collection review carefully if we both mean this specific one.',false],['I would prepare collection review carefully.',false]],why:'Use the when the meeting is specific and identifiable.'},
    {id:'gra4',q:'General field — no article:',choices:[['I am learning more about footwear.',true],['I am learning more about the footwear in general.',false],['I am learning more about a footwear.',false]],why:'Use footwear without an article when referring to the field/product category generally.'},
    {id:'gra5',q:'Correct professional collocation:',choices:[['I would coordinate with the Development team.',true],['I would coordinate to the Development team.',false],['I would coordinate about the Development team.',false]],why:'Coordinate with people/teams.'},
    {id:'gra6',q:'Correct responsibility phrase:',choices:[['I was responsible for organising the seminar.',true],['I was responsible to organise the seminar.',false],['I was responsible of organising the seminar.',false]],why:'Be responsible for + noun or -ing form.'},
    {id:'gra7',q:'A hypothetical footwear situation:',choices:[['If a sample were delayed, I would confirm the impact first.',true],['If a sample would be delayed, I confirm the impact first.',false],['If a sample delayed, I will confirmed the impact.',false]],why:'For a hypothetical: if + past form, would + base verb.'},
    {id:'gra8',q:'Choose the sentence that develops the idea clearly.',choices:[['I would learn the key vocabulary so that I could follow meetings more confidently.',true],['I would learn the key vocabulary and I follow meetings and confidence.',false],['I would learn vocabulary because meetings more confident.',false]],why:'So that + subject + modal/verb clearly expresses purpose.'},
    {id:'gra9',q:'Choose the stronger long-answer connector.',choices:[['At Chloé, I coordinated different teams, which means I am already comfortable working across functions.',true],['At Chloé, I coordinated different teams and which I am comfortable.',false],['At Chloé, I coordinated teams because which comfortable.',false]],why:'“which means…” is a useful way to explain the relevance of a fact.'},
    {id:'gra10',q:'Time expression for the real interview:',choices:[['My interview is on Monday at 9 a.m.',true],['My interview is in Monday on 9 a.m.',false],['My interview is at Monday in 9 a.m.',false]],why:'On + day/date; at + clock time.'}
  ];renderQuiz('#grammarQuiz',grammarQuestions);

  const fills=[
    {id:'fil1',before:'I have worked ',after:' the luxury industry for more than ten years.',opts:['in','on','at'],ans:'in',why:'work in an industry'},
    {id:'fil2',before:'At Cartier, I worked ',after:' senior directors.',opts:['for','at','to'],ans:'for',why:'work for a person/company'},
    {id:'fil3',before:'I am comfortable coordinating ',after:' different teams.',opts:['with','to','of'],ans:'with',why:'coordinate with people/teams'},
    {id:'fil4',before:'I was responsible ',after:' organising the onboarding schedule.',opts:['for','to','of'],ans:'for',why:'responsible for + -ing'},
    {id:'fil5',before:'I would prepare ',after:' the collection review by checking the participants and documents.',opts:['for','to','of'],ans:'for',why:'prepare for an event/meeting'},
    {id:'fil6',before:'The director is travelling ',after:' Italy tomorrow.',opts:['to','at','in'],ans:'to',why:'travel to a destination'},
    {id:'fil7',before:'The update is needed ',after:' Friday.',opts:['by','on','at'],ans:'by',why:'by = no later than'},
    {id:'fil8',before:'The fitting starts ',after:' 2:30 p.m.',opts:['at','on','in'],ans:'at',why:'at + clock time'}
  ];
  function renderFills(){const root=$('#fillGrid');root.innerHTML='';fills.forEach(x=>{const a=document.createElement('article');a.className='fill-item';const opts=shuffle(x.opts).map(o=>`<option value="${o}">${o}</option>`).join('');a.innerHTML=`<p>${x.before}<select class="inline-select" aria-label="Choose preposition"><option value="">—</option>${opts}</select>${x.after}</p><div class="feedback"></div>`;const s=$('select',a),fb=$('.feedback',a);s.addEventListener('change',()=>{if(!s.value){s.className='inline-select';fb.textContent='';return}const ok=s.value===x.ans;s.className='inline-select '+(ok?'correct':'incorrect');fb.className='feedback '+(ok?'good':'bad');fb.textContent=(ok?'✓ Correct — ':'✗ Try again — ')+x.why+'.';setAnswer(x.id,ok)});root.appendChild(a)})}
  renderFills();

  const orders=[
    {id:'ord1',prompt:'Explain your learning method.',tokens:['I','would','build','a','glossary','of','key','footwear','terms'],target:'I would build a glossary of key footwear terms'},
    {id:'ord2',prompt:'Connect your Chloé experience.',tokens:['At','Chloé,','I','worked','between','the','studio','and','operational','teams'],target:'At Chloé, I worked between the studio and operational teams'},
    {id:'ord3',prompt:'Handle a delayed sample.',tokens:['I','would','confirm','the','impact','before','changing','the','meeting'],target:'I would confirm the impact before changing the meeting'},
    {id:'ord4',prompt:'Show transparent coordination.',tokens:['I','would','keep','both','directors','informed','of','the','agreed','priority'],target:'I would keep both directors informed of the agreed priority'},
    {id:'ord5',prompt:'Recover from unknown vocabulary.',tokens:['I','would','ask','for','clarification','rather','than','guess'],target:'I would ask for clarification rather than guess'}
  ];
  function renderOrders(){const root=$('#orderGrid');root.innerHTML='';orders.forEach(x=>{const a=document.createElement('article');a.className='order-item';a.innerHTML=`<div class="order-prompt">${x.prompt}</div><div class="token-bank"></div><div class="sentence-build" aria-label="Built sentence"></div><button type="button" class="secondary reset-order">Reset words</button><div class="feedback"></div>`;const bank=$('.token-bank',a),build=$('.sentence-build',a),fb=$('.feedback',a);let built=[];let tokens=[];
      function check(){const text=built.join(' ');if(built.length<x.tokens.length){fb.className='feedback';fb.textContent='Keep going…';a.classList.remove('correct','incorrect');return}const normalize=s=>s.replace(/[.,!?]/g,'').replace(/\s+/g,' ').trim().toLowerCase();const ok=normalize(text)===normalize(x.target);a.classList.toggle('correct',ok);a.classList.toggle('incorrect',!ok);fb.className='feedback '+(ok?'good':'bad');fb.textContent=ok?'✓ Correct sentence.':'✗ The order is not quite right. Reset and try again.';setAnswer(x.id,ok)}
      function paint(){bank.innerHTML='';build.innerHTML='';tokens.forEach((t,i)=>{const b=document.createElement('button');b.type='button';b.className='token'+(t.used?' used':'');b.textContent=t.word;b.disabled=t.used;b.addEventListener('click',()=>{t.used=true;built.push(t.word);paint();check()});bank.appendChild(b)});built.forEach((w,i)=>{const b=document.createElement('button');b.type='button';b.className='built-token';b.textContent=w;b.title='Click to remove from this point';b.addEventListener('click',()=>{const removed=built.splice(i);removed.forEach(word=>{const found=tokens.find(t=>t.word===word&&t.used);if(found)found.used=false});paint();fb.className='feedback';fb.textContent='Keep going…';a.classList.remove('correct','incorrect')});build.appendChild(b)})}
      function reset(){built=[];tokens=shuffle(x.tokens).map(word=>({word,used:false}));paint();fb.textContent='';a.classList.remove('correct','incorrect')}
      $('.reset-order',a).addEventListener('click',reset);reset();root.appendChild(a)})}
  renderOrders();

  // ---------- Adapt models ----------
  const adaptModels={
    safe:'Footwear would be a new technical area for me, so I would need to learn the vocabulary. However, I already have experience in luxury and collection coordination. At Chloé, I worked with the studio and operational teams. I would learn the key words, understand the calendar and ask questions when I need clarification. I am used to learning quickly and supporting different people.',
    interview:'Footwear would be a new technical vocabulary for me, but the working environment is not completely new. At Chloé, I coordinated between the studio and operational teams, so I already understand the importance of collection timing, different stakeholders and precise follow-up. In my first weeks, I would build a practical glossary, map the key contacts and recurring meetings, and make sure I understand the major milestones. I would never guess on a technical point; I would ask the right specialist and learn from the answer.',
    stronger:'I would be transparent that footwear brings a new technical vocabulary, but I see that as a learning curve rather than a barrier. My Chloé experience already placed me at the interface between creative and operational teams, so the logic of collection calendars, cross-functional coordination and changing priorities is familiar. I would accelerate my learning by mapping the métier, building a working glossary from real meetings, identifying the key decision points and understanding how Industrial and Development information flows. My role is not to replace product experts; it is to make their information usable and visible for the directors I support.'
  };
  function paintAdapt(level){$$('.model-tab').forEach(b=>b.classList.toggle('active',b.dataset.level===level));$('#adaptModel').innerHTML=`<p>“${adaptModels[level]}”</p><button class="listen-mini" type="button">Listen</button>`;$('#adaptModel button').addEventListener('click',()=>speak(adaptModels[level]))}
  $$('.model-tab').forEach(b=>b.addEventListener('click',()=>paintAdapt(b.dataset.level)));paintAdapt('safe');

  // ---------- Scenarios ----------
  const scenarioQuestions=[
    {id:'squ1',q:'A sample will not arrive before tomorrow’s Development review. What is the strongest first move?',choices:[['Confirm the exact status and what the review needs before changing anything',true],['Cancel the review immediately',false],['Tell the director the supplier failed without checking',false]],why:'Get the facts and understand the decision need first.'},
    {id:'squ2',q:'Industrial wants an urgent supplier call in a slot already protected for a collection review. What should guide your decision?',choices:[['Real urgency, business impact, constraints and available alternatives',true],['Which director asked first',false],['Which meeting sounds more important to you personally',false]],why:'Prioritisation should be fact-based and transparent.'},
    {id:'squ3',q:'A quality issue is raised one hour before a senior meeting. What should you avoid?',choices:[['Guessing the technical severity yourself',true],['Finding the responsible quality contact',false],['Clarifying whether the meeting decision is affected',false]],why:'Do not replace the technical owner. Connect the owner, the impact and the decision.'},
    {id:'squ4',q:'A dashboard is due today but one team has not provided its data. What is the best response?',choices:[['Follow up, identify whether the missing data is critical, and flag the gap clearly if the report must go out',true],['Invent a reasonable number',false],['Send nothing and wait silently',false]],why:'Protect accuracy while keeping leaders informed about the gap.'},
    {id:'squ5',q:'A director uses a footwear term you do not understand. What is strongest?',choices:[['Ask a short clarifying question, confirm the meaning, then use the term correctly next time',true],['Pretend you understood',false],['Stop the meeting for a long translation search',false]],why:'Short clarification protects accuracy and helps you learn.'},
    {id:'squ6',q:'A trip to Italy changes at the last minute and affects meetings with several teams. What should you do?',choices:[['Map all downstream effects, propose a revised sequence and confirm changes with stakeholders',true],['Change only the flight and leave the rest unchanged',false],['Ask the director to contact everyone personally',false]],why:'Travel changes can affect multiple meetings and need full coordination.'},
    {id:'squ7',q:'You receive confidential information about an unreleased collection. What principle is most important?',choices:[['Share only on a need-to-know basis using the expected internal channels',true],['Mention it casually to build relationships',false],['Forward it to your personal email for convenience',false]],why:'Luxury product development requires disciplined confidentiality.'},
    {id:'squ8',q:'Two teams give you different versions of the same deadline. What is the strongest response?',choices:[['Clarify the source of truth and confirm the agreed deadline before communicating it further',true],['Choose the earlier deadline without telling anyone',false],['Send both dates to the directors with no context',false]],why:'Create one reliable version of the information before it spreads.'}
  ];renderQuiz('#scenarioQuiz',scenarioQuestions);

  const scenarioCards=[
    {tag:'Quality',title:'A defect before a key review',q:'Quality reports a defect on the latest sample two hours before a director review. How would you support the situation?',model:'I would first identify the quality owner and clarify whether the issue affects the purpose of the review. I would gather the confirmed facts, the proposed next step and the expected timing, then brief the director concisely. If the review can still be useful, I would protect it; if the decision depends on the missing quality answer, I would propose an adjustment rather than let the director discover the problem in the meeting.'},
    {tag:'Industrial',title:'Supplier meeting vs collection milestone',q:'A supplier can only meet during a protected collection milestone. How do you decide what to move?',model:'I would clarify why the supplier meeting is urgent, who truly needs to attend and what decision is required. I would then compare that with the collection milestone and look for alternatives: a different supplier time, a delegate, partial attendance or a shorter slot. I would bring the directors a workable option and make the final priority transparent to everyone affected.'},
    {tag:'Development',title:'Fitting moved at the last minute',q:'A fitting is moved and now conflicts with a leadership meeting. What do you do?',model:'I would check whether the fitting requires the director personally and whether the leadership meeting can move or be delegated. Because fittings may depend on samples, specialists and models being available together, I would avoid treating it like a simple calendar item. I would clarify the constraints, propose the least disruptive solution and confirm it quickly.'},
    {tag:'France + Italy',title:'Travel disruption',q:'A flight cancellation affects a day of meetings in Italy. How would you recover the schedule?',model:'I would first identify the meetings that depend on physical presence and those that can move online or be rescheduled. I would secure the new travel option, rebuild the day around the most important decision points and update every affected contact. I would give the director one clear revised itinerary rather than a series of separate problems.'},
    {tag:'Reporting',title:'Missing data',q:'A dashboard is due but Development and Industrial figures do not fully align. What do you send?',model:'I would not merge inconsistent figures silently. I would identify the owners, clarify which version is validated and understand whether the difference affects the decision. If the deadline cannot move, I would send the validated information and flag the unresolved point explicitly, with an owner and expected update time.'},
    {tag:'Confidentiality',title:'Unreleased collection information',q:'A colleague asks you for information that you are not sure they should receive. What do you do?',model:'I would not assume access just because the person works in the same organisation. I would check the expected distribution or confirm with the information owner before sharing. In a confidential product environment, a short verification is better than creating an unnecessary information risk.'}
  ];
  function renderScenarioCards(){const root=$('#scenarioCards');root.innerHTML='';scenarioCards.forEach((s,i)=>{const a=document.createElement('article');a.className='scenario-card';a.innerHTML=`<span class="step">${s.tag}</span><h3>${s.title}</h3><p class="scenario-question">${s.q}</p><div class="tools"><button type="button" class="secondary hear">Hear question</button> <button type="button" class="secondary model-btn">Reveal model</button></div><div class="model-reveal coach-only"><p>${s.model}</p><button class="listen-mini listen" type="button">Listen</button></div>`;$('.hear',a).addEventListener('click',()=>speak(s.q));$('.model-btn',a).addEventListener('click',e=>{if(state.mode==='interview')return;const m=$('.model-reveal',a);m.classList.toggle('show');e.currentTarget.textContent=m.classList.contains('show')?'Hide model':'Reveal model'});$('.listen',a).addEventListener('click',()=>speak(s.model));root.appendChild(a)})}
  renderScenarioCards();

  // ---------- Interview question bank ----------
  const bank={
    sector:[
      ['Development Director','What do you know about the Métier Chaussure and why does it interest you?','Tests preparation, curiosity and whether you can connect the sector to your real strengths.',
       'I understand that the footwear métier works across several teams and four collections each year. What interests me is the combination of a creative luxury environment and strong coordination needs. I already know that I would have technical vocabulary to learn, but I am motivated by the pace and teamwork.',
       'I understand that the Métier Chaussure brings together more than 300 people in France and Italy and works through four collection cycles a year. The role is attractive to me because it sits between Industrial and Development, where good organisation and information flow really matter. I like demanding luxury environments, and I see a strong connection with my experience coordinating senior leaders and collection-related teams.',
       'What attracts me is the operating model around the product: a creative idea has to move through collection, development, industrial, quality and supply realities, and that creates a real need for disciplined coordination. I would be new to some footwear terminology, but the environment of luxury, collection rhythm and cross-functional priorities is familiar from Chloé and Cartier.'],
      ['Industrial Director','Why footwear if you have not worked specifically in shoes before?','Tests whether your motivation is specific or only about the Hermès name.',
       'I am interested because it is a new product area inside an environment I already know: luxury. I like learning, and I also like roles where many teams need to coordinate.',
       'I am interested in footwear because it gives me a new product language to learn while building on experience I already have in luxury and cross-functional coordination. I enjoyed being close to collection activity at Chloé, and I am attracted by a role where creative, development and industrial priorities have to stay aligned.',
       'For me, the attraction is not pretending I already know every technical aspect of footwear. It is the opportunity to bring strong executive support into a product métier where timing, craftsmanship, creative ambition and industrial reality have to coexist. That is exactly the kind of complex environment in which I am most useful.'],
      ['Development Director','What do you think will be different about supporting a product métier compared with a more general corporate function?','Tests whether you understand collection rhythm and product-specific peaks.',
       'I think the calendar will be more closely connected to collection milestones, samples and product reviews. I would need to understand those key moments quickly.',
       'I expect the calendar to be strongly connected to collection milestones, fittings, reviews, supplier or atelier constraints and recurring peaks. That means I would need to understand not only the meeting itself, but what product or decision is behind it so I can prioritise more intelligently.',
       'The biggest difference I anticipate is that the agenda becomes part of a physical product flow. A review may depend on a sample arriving, a fitting may require several scarce participants, and a supplier decision may affect downstream timing. I would therefore learn the milestone logic behind the calendar, not just manage appointments.']
    ],
    learning:[
      ['Industrial Director','You do not know much shoe vocabulary today. How would you become operational quickly?','Tests confidence, honesty and learning method.',adaptModels.safe,adaptModels.interview,adaptModels.stronger],
      ['Development Director','What would you do if you did not understand a technical term in a meeting?','Tests recovery strategy and accuracy.',
       'I would ask for a short clarification. I prefer to check the meaning rather than guess. Then I would note the term and learn it for next time.',
       'I would use a short clarification such as, “Just to make sure I understand, does that refer to the sample construction or to the material?” I would rather confirm the meaning than pretend. After the meeting, I would add the term to my glossary so I can recognise and use it next time.',
       'I would keep the clarification brief and contextual so I do not interrupt the flow: confirm what the term refers to, restate the action if necessary, and move on. Then I would capture the terminology in a working glossary. Accuracy matters more than performing expertise I have not yet acquired.'],
      ['Development Director','How do you learn a new manager, team or business environment?','Links directly to Cartier onboarding and your learning style.',
       'I observe how people work, ask questions and write down the important information. I also learn the recurring meetings and priorities.',
       'I start by understanding the people, the recurring calendar and the information flow. I identify key stakeholders, typical deadlines and the way each leader likes to work. At Cartier, I used that same approach when preparing a new director’s onboarding, so I know how useful a structured map can be.',
       'I learn a new environment by mapping it rather than trying to memorise isolated details: decision-makers, recurring cycles, key documents, vocabulary, interfaces and escalation routes. That gives me a framework into which the technical knowledge can fit, and it helps me become useful quickly without creating noise.']
    ],
    industrial:[
      ['Industrial Director','What would you do if a supplier meeting became urgent and conflicted with another key milestone?','Tests fact-based prioritisation.',
       'I would first understand why both meetings are important. Then I would look for another time or another person who could attend, and I would confirm the decision with the directors.',
       'I would clarify the real urgency, the decision required, the participants and the downstream impact of both commitments. Then I would look for alternatives — another supplier time, partial attendance or delegation — and bring the director a clear option rather than only reporting a conflict.',
       'I would treat the conflict as a business-impact question rather than a calendar question. I would clarify what becomes impossible if either meeting moves, identify the least disruptive alternatives and make the trade-off visible. My aim would be to preserve decision quality and avoid hidden downstream consequences.'],
      ['Industrial Director','How would you help me maintain forward visibility over a six-month calendar?','Directly mirrors the job requirement.',
       'I would identify the recurring meetings and important deadlines, then review the calendar regularly so that conflicts are seen early.',
       'I would build the six-month view around recurring governance, collection milestones, travel, supplier or atelier visits and known decision points. I would then review it regularly against new priorities, flag conflicts early and protect preparation time rather than only reacting to invitations.',
       'I would create a layered calendar: fixed milestones and governance first, then travel and external constraints, then movable operating meetings. I would maintain a forward conflict review so that the diary becomes a decision-support tool, not just a record of appointments.'],
      ['Industrial Director','Speed or accuracy: which matters more when information is moving quickly?','Tests judgement and nuance.',
       'Both matter, but I would not send information I know may be wrong. I would send the confirmed facts quickly and flag what is still being checked.',
       'I try not to choose between them unnecessarily. I move quickly on confirmed facts, but I clearly separate what is validated from what is still being checked. If a director needs an immediate decision, I would state the uncertainty rather than hide it.',
       'The right balance is fast transparency. A late perfect update can be useless, but a fast inaccurate update can damage decisions. I would communicate the validated core quickly, identify the uncertainty, assign an owner and give a precise time for the next update.']
    ],
    development:[
      ['Development Director','A sample is delayed before a collection review. How would you support me?','Tests ability to translate product delay into executive support.',
       'I would confirm when the sample will arrive and what you need for the review. I would look for an alternative and update you early.',
       'I would confirm the exact sample status, what decision the review is meant to support and whether an alternative such as photos, technical information or a revised sequence is possible. I would update you early with the facts and options so there is no last-minute surprise.',
       'I would protect the decision behind the meeting. That means confirming the sample status, identifying what can still be reviewed without it, checking alternative evidence and giving you a concise choice: proceed with a modified objective, reorder the agenda or move the decision.'],
      ['Development Director','How could your Chloé experience help you in footwear development?','Critical transfer question.',
       'At Chloé, I worked with the studio and operational teams, so I learned how to coordinate people with different priorities around a collection.',
       'At Chloé, I was positioned between the studio and operational teams. I supported meetings, planning and presentation materials around collection activity, which taught me how important timing, clear information and different stakeholder perspectives are. The product is different, but that coordination reflex is very transferable.',
       'My Chloé experience is relevant because I worked at an interface between creative and operational priorities. I learned that the same collection can be viewed very differently depending on the team, and my role was to translate that into practical coordination. I would bring the same discipline while learning the specific footwear development language.'],
      ['Development Director','How would you prepare a complex collection review for me?','Tests preparation logic.',
       'I would confirm the objective, participants, documents and products to review. I would check what needs a decision and make sure the information is ready.',
       'I would start with the purpose of the review and the decisions expected. Then I would confirm participants, timing, samples or supporting documents, open points and any dependencies. I would make sure the director sees the agenda and risks early enough to prepare, not five minutes before the meeting.',
       'I would build the meeting backward from the decisions required: what must be physically present, which specialists are needed, what information is validated, what remains open and what should be pre-read. I would also identify any item likely to consume disproportionate time so the agenda remains controlled.']
    ],
    assistant:[
      ['Industrial Director','How would you support two directors whose priorities and working styles are different?','Core role fit.',
       'I would learn how each director works and keep clear priorities for both. When there is a conflict, I would clarify the urgency and propose a solution.',
       'I adapt my support to each leader’s working style while maintaining one reliable view of shared constraints. I would learn their preferences, recurring priorities and decision rhythm, then flag conflicts early. If priorities compete, I would clarify the true deadline and impact and propose an alternative rather than asking them to solve the calendar for me.',
       'I would personalise the support without fragmenting the information system. Each director can have a different communication rhythm, but I would maintain shared visibility over dependencies, conflicts and critical milestones. My role is to absorb complexity and return clear choices.'],
      ['Development Director','What would you bring from day one even before you know the footwear terminology?','Prevents knowledge gap from overshadowing strengths.',
       'I would bring organisation, discretion and experience supporting senior managers in luxury companies.',
       'From day one, I can bring senior executive-support experience, strong organisation, discretion and a habit of anticipating. I already know demanding luxury environments, complex diaries, travel, executive documents and cross-functional coordination. The product vocabulary would be the part I build quickly.',
       'I can contribute immediately on the operating system around the directors: calendar architecture, preparation, information flow, reporting discipline, travel, stakeholder coordination and anticipation. I would learn the footwear layer quickly, but the executive-support discipline is already established.'],
      ['Industrial Director','Tell me about a time you helped people integrate into a new environment.','Uses today’s written example.',
       'At Cartier, I helped new interns feel comfortable by organising visits, informal meetings and explanations about how the company worked.',
       'At Cartier, I was asked to help new interns integrate more successfully into the department. I made it a priority to give them a positive experience, so I organised a visit to headquarters, visits to boutiques and manufacturing sites, and informal lunches. Even though I was not their manager, I helped them understand the organisation and connect with people more easily.',
       'At Cartier, I noticed that successful integration required more than administrative onboarding. For new interns, I structured exposure to the organisation through headquarters, boutique and manufacturing visits, combined with informal meetings and lunches. The objective was to give them context and relationships quickly, even though I had no formal management responsibility.']
    ],
    pressure:[
      ['Industrial Director','A technical problem is escalating, but the specialist is not answering. What do you do?','Tests escalation without overstepping.',
       'I would try another appropriate contact, clarify the urgency and tell the director what is confirmed and what is still missing.',
       'I would not invent the technical answer. I would try the agreed backup contact or manager, clarify how long we can wait before a decision is affected, and update the director with the confirmed facts, the missing point and the next escalation step.',
       'I would manage the information risk and the time risk separately. I would preserve technical accuracy by not guessing, while escalating through the right chain and telling the director exactly what is known, what is not known and when the next reliable answer is expected.'],
      ['Development Director','What would you do if I corrected your English or a technical word during the interview or at work?','Tests ego, resilience and learning attitude.',
       'I would thank you and use the correction. I prefer to learn the right word immediately.',
       'I would take it positively. If you corrected a term, I would repeat or use the correct version so I remember it, then continue the conversation. I do not see clarification as a problem; it is part of learning a new environment.',
       'I would treat the correction as useful data, not as a loss of confidence. I would adopt the correct term, confirm the meaning if needed and move on. My priority is accurate communication, not defending a first formulation.'],
      ['Industrial Director','What is one risk of being very proactive, and how do you control it?','Sophisticated judgement question.',
       'If I act too quickly, I could make assumptions. I control that by checking the important facts before making changes.',
       'Proactivity can become over-assumption if you act before you have the right context. I try to prevent that by clarifying the decision boundary: I anticipate and prepare options, but I confirm when a change affects priorities, budget, confidential information or another leader.',
       'The risk is confusing anticipation with unilateral decision-making. I want to remove friction for leaders, but I also know where authority sits. I prepare, clarify and propose; I do not silently decide across strategic priorities that require leadership judgement.']
    ]
  };
  function renderQuestionBank(){const cat=$('#questionCategory').value,lvl=$('#questionLevel').value;const idx={safe:3,interview:4,stronger:5}[lvl];const root=$('#questionGrid');root.innerHTML='';bank[cat].forEach((q,i)=>{const [who,question,why]=q;const model=q[idx];const a=document.createElement('article');a.className='question-bank-card';a.innerHTML=`<span class="who">${who}</span><h3>${question}</h3><p class="why">Why they may ask: ${why}</p><div class="tools"><button type="button" class="secondary hear">Hear question</button><button type="button" class="secondary reveal-model">Reveal ${lvl==='safe'?'safe':lvl==='interview'?'interview-ready':'stronger'} model</button></div><div class="model coach-only"><p>“${model}”</p><button class="listen-mini listen" type="button">Listen</button></div>`;$('.hear',a).addEventListener('click',()=>speak(question));$('.reveal-model',a).addEventListener('click',e=>{if(state.mode==='interview')return;const m=$('.model',a);m.classList.toggle('show');e.currentTarget.textContent=m.classList.contains('show')?'Hide model':`Reveal ${lvl==='safe'?'safe':lvl==='interview'?'interview-ready':'stronger'} model`});$('.listen',a).addEventListener('click',()=>speak(model));root.appendChild(a)})}
  $('#questionCategory').addEventListener('change',renderQuestionBank);$('#questionLevel').addEventListener('change',renderQuestionBank);renderQuestionBank();

  // ---------- Writing live coach ----------
  const writingText=$('#writingText');writingText.value=state.writing;
  const writingCriteria=[
    ['Clear opening / position',t=>/footwear|technical|vocabulary|new/i.test(t)&&t.trim().length>25,'State clearly that the technical vocabulary is new but manageable.'],
    ['Concrete experience',t=>/chlo[eé]|cartier|studio|operational|experience/i.test(t),'Use a real Chloé or Cartier proof point.'],
    ['Learning method',t=>/glossary|learn|map|key contacts|milestone|ask|clarif/i.test(t),'Explain how you will learn: glossary, contacts, calendar, questions.'],
    ['Professional connector',t=>/because|so that|which means|as a result|therefore|while|however/i.test(t),'Use at least one connector to develop the idea.'],
    ['Relevance / result',t=>/help me|allow me|efficient|effective|quickly|confident|support|value/i.test(t),'Finish with the value or result for the role.']
  ];
  function updateWriting(){const t=writingText.value;state.writing=t;persist();const words=t.trim()?t.trim().split(/\s+/).length:0;const sentences=(t.match(/[.!?]+(?=\s|$)/g)||[]).length;$('#wordCount').textContent=words;$('#sentenceCount').textContent=sentences;const root=$('#writingChecks');root.innerHTML='';writingCriteria.forEach(([name,test,hint])=>{const ok=test(t);const d=document.createElement('div');d.className='live-check '+(ok?'good':'');d.innerHTML=`<span class="status-dot">${ok?'✓':'·'}</span><div><strong>${name}</strong><br><span>${ok?'Present':hint}</span></div>`;root.appendChild(d)})}
  writingText.addEventListener('input',updateWriting);updateWriting();

  // ---------- Simulator ----------
  const exchanges=[
    {a:['Development Director','You have strong luxury experience, but footwear terminology is new to you. How would you close that gap quickly?'],b:['Industrial Director','And what would you do if you still did not understand a technical point in an important meeting?'],models:{safe:adaptModels.safe+' If I still did not understand a technical point, I would ask a short clarification instead of guessing.',interview:adaptModels.interview+' In an important meeting, I would keep the clarification brief, confirm the meaning and continue, then add the term to my glossary afterwards.',stronger:adaptModels.stronger+' When the issue is technical, I would protect accuracy by using a concise contextual clarification and relying on the specialist owner rather than performing expertise I do not yet have.'}},
    {a:['Industrial Director','A supplier meeting becomes urgent at exactly the same time as a Development collection review. What do you do?'],b:['Development Director','How would you make sure I do not feel that my priorities are always the ones being moved?'],models:{safe:'I would clarify why both meetings are urgent and look for another time or another participant. I would explain the solution clearly to both directors so the decision is transparent.',interview:'I would clarify the decision needed, participants, true deadline and downstream impact of both commitments. I would then look for alternatives such as a different supplier time, partial attendance or delegation. I would make the agreed priority transparent to both directors, because supporting two leaders fairly means using facts and impact rather than automatically protecting one side.',stronger:'I would separate urgency from calendar pressure. I would identify the business consequence of moving either commitment, test alternatives and bring a recommendation with the trade-off visible. To maintain trust between two leaders, I would also make the prioritisation logic explicit, so neither side experiences changes as arbitrary or as a hidden hierarchy.'}},
    {a:['Development Director','How is your Chloé experience relevant to footwear development?'],b:['Industrial Director','But the industrial side is different. What could you bring to me from day one?'],models:{safe:'At Chloé, I worked between the studio and operational teams, so I understand collection coordination. For the Industrial side, I can already bring organisation, reporting, complex calendars, travel and follow-up while I learn the technical vocabulary.',interview:'At Chloé, I worked between the studio and operational teams around meetings, planning and presentation support, so I understand the discipline of collection coordination. For the Industrial side, what I bring immediately is executive-support structure: forward calendar visibility, reporting discipline, supplier and travel coordination, action tracking and escalation. I would learn the product-specific industrial vocabulary on top of that strong operating base.',stronger:'Chloé taught me how to operate at an interface where creative priorities and operational reality have to meet. I would transfer that coordination reflex into footwear Development. For Industrial, I would not claim technical expertise; I would contribute the management infrastructure around it — calendar architecture, reliable data flow, decision preparation, stakeholder follow-up and early risk visibility.'}},
    {a:['Industrial Director','The dashboard is due today, but the Industrial and Development numbers do not match. What would you do?'],b:['Development Director','Would you delay the dashboard?'],models:{safe:'I would check which figures are validated and contact the owners. I would not invent a number. If the dashboard must go out, I would send the confirmed information and clearly flag what is still being checked.',interview:'I would first identify the source and owner of each figure and understand whether the discrepancy affects a decision. I would protect accuracy, but I would not create silence around the deadline. If the dashboard must go out, I would send the validated data, flag the unresolved point clearly and state who is checking it and when the update will arrive. I would delay only if the missing figure makes the whole dashboard misleading.',stronger:'I would distinguish a local data gap from a decision-critical integrity issue. I would reconcile the source of truth with the owners, quantify the impact of the discrepancy and communicate transparently. If the report remains useful with one flagged exception, I would issue it with a controlled caveat and update time; if the inconsistency invalidates the decision context, I would recommend a short delay rather than distribute misleading information.'}},
    {a:['Development Director','A fitting is moved at the last minute and now clashes with a senior leadership meeting. How would you handle it?'],b:['Industrial Director','What would you need to know before changing anything?'],models:{safe:'I would check who must attend the fitting and whether it can move. I would also check the importance of the leadership meeting before proposing a solution.',interview:'I would first understand the constraints behind both events. A fitting may depend on a sample, specialists and people being available together, so I would check whether the director must attend and whether another slot is realistically possible. I would also confirm the purpose and flexibility of the leadership meeting, then propose the least disruptive solution with the consequences clear.',stronger:'I would avoid treating the fitting as an ordinary movable appointment. I would identify the scarce dependencies — sample readiness, specialist presence, model availability, decision requirement — and compare them with the leadership meeting’s decision and attendance constraints. I would then redesign the schedule around what is genuinely immovable and communicate the trade-off early.'}},
    {a:['Industrial Director','What do you understand about the role of discretion in a product métier?'],b:['Development Director','Give me a practical example of how that would affect your behaviour.'],models:{safe:'I understand that collection information can be confidential. I would only share documents with the right people and use the expected internal channels.',interview:'In a product métier, discretion can concern unreleased designs, samples, supplier information, budgets and internal decisions. Practically, I would share information only with the people who need it, verify distribution when I am unsure and use the approved internal channels. I would rather ask before forwarding a sensitive document than create an avoidable confidentiality risk.',stronger:'Discretion is operational, not only personal. It affects distribution lists, meeting invitations, file locations, travel conversations, sample information and supplier data. My practical rule is need-to-know plus the correct channel: verify access when uncertain, minimise unnecessary circulation and never trade speed for uncontrolled exposure.'}}
  ];
  let currentExchange=0;
  function renderExchange(){const x=exchanges[currentExchange];$('#dialogueStage').innerHTML=`<article class="interviewer"><span class="role">${x.a[0]}</span><p>“${x.a[1]}”</p></article><article class="interviewer"><span class="role">${x.b[0]}</span><p>“${x.b[1]}”</p></article>`;$('#exchangeModel').innerHTML='';}
  $('#newExchange').addEventListener('click',()=>{let n=currentExchange;while(n===currentExchange&&exchanges.length>1)n=Math.floor(Math.random()*exchanges.length);currentExchange=n;renderExchange()});
  $('#hearExchange').addEventListener('click',()=>{const x=exchanges[currentExchange];speak(`${x.a[0]} asks: ${x.a[1]} ${x.b[0]} follows up: ${x.b[1]}`)});
  $('#showExchangeModel').addEventListener('click',()=>{if(state.mode==='interview')return;const x=exchanges[currentExchange],lvl=$('#simLevel').value,m=x.models[lvl];$('#exchangeModel').innerHTML=`<strong>${lvl==='safe'?'Safe & clear':lvl==='interview'?'Interview-ready':'Stronger professional'}</strong><p>“${m}”</p><button type="button" class="listen-mini" id="listenExchangeModel">Listen</button>`;$('#listenExchangeModel').addEventListener('click',()=>speak(m))});
  $('#simLevel').addEventListener('change',()=>{$('#exchangeModel').innerHTML=''});renderExchange();
  $('#simNotes').value=state.simNotes;$('#simNotes').addEventListener('input',e=>{state.simNotes=e.target.value;persist()});

  // ---------- Timers ----------
  function makeTimer(display,startSeconds,startBtn,pauseBtn,resetBtn){let remaining=startSeconds,id=null,running=false;const paint=()=>{const m=Math.floor(remaining/60),s=remaining%60;$(display).textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`};function tick(){if(remaining<=0){clearInterval(id);id=null;running=false;speak('Time. Finish your final sentence.');return}remaining--;paint()}$(startBtn).addEventListener('click',()=>{if(running)return;running=true;id=setInterval(tick,1000)});$(pauseBtn).addEventListener('click',()=>{if(id)clearInterval(id);id=null;running=false});$(resetBtn).addEventListener('click',()=>{if(id)clearInterval(id);id=null;running=false;remaining=startSeconds;paint()});paint()}
  makeTimer('#answerTimer',90,'#start90','#pause90','#reset90');makeTimer('#finalTimer',900,'#startFinal','#pauseFinal','#resetFinal');

  // ---------- Video recording ----------
  let stream=null,recorder=null,chunks=[];
  const camera=$('#cameraPreview'),recorded=$('#recordedVideo'),download=$('#downloadVideo'),status=$('#recordStatus');
  async function startCamera(){try{stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});camera.srcObject=stream;await camera.play();$('#cameraPlaceholder').style.display='none';camera.style.display='block';$('#recordBtn').disabled=false;status.textContent='Camera ready. Recording stays on this device unless you download it.'}catch(err){status.textContent='Camera/microphone access was not available. You can still use the lesson and rehearse aloud.'}}
  $('#cameraBtn').addEventListener('click',startCamera);camera.style.display='none';
  $('#recordBtn').addEventListener('click',()=>{if(!stream||typeof MediaRecorder==='undefined'){status.textContent='Recording is not supported in this browser.';return}chunks=[];let options={};if(MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus'))options={mimeType:'video/webm;codecs=vp9,opus'};else if(MediaRecorder.isTypeSupported('video/webm'))options={mimeType:'video/webm'};recorder=new MediaRecorder(stream,options);recorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};recorder.onstop=()=>{const blob=new Blob(chunks,{type:recorder.mimeType||'video/webm'});const url=URL.createObjectURL(blob);recorded.src=url;download.href=url;download.hidden=false;status.textContent='Recording complete. Watch content first, delivery second.';state.completed.add('video-rehearsal');persist();updateReport()};recorder.start();$('#recordBtn').disabled=true;$('#stopRecordBtn').disabled=false;status.textContent='Recording… answer naturally.'});
  $('#stopRecordBtn').addEventListener('click',()=>{if(recorder&&recorder.state!=='inactive')recorder.stop();$('#stopRecordBtn').disabled=true;$('#recordBtn').disabled=false});
  $$('[data-review]').forEach(ch=>{const k=ch.dataset.review;ch.checked=!!state.review[k];ch.addEventListener('change',()=>{state.review[k]=ch.checked;persist();updateReport()})});

  // ---------- Report ----------
  const groups=[
    {name:'Sector understanding',desc:'Teams, product flow and Executive Assistant boundaries',ids:sectorQuestions.map(x=>x.id)},
    {name:'Footwear vocabulary',desc:'Parts, process, timing and coordination terminology',ids:vocabQuestions.map(x=>x.id)},
    {name:'Grammar accuracy',desc:'Articles, prepositions, conditionals and longer answer structure',ids:grammarQuestions.map(x=>x.id).concat(fills.map(x=>x.id))},
    {name:'Sentence construction',desc:'Word order in reusable interview sentences',ids:orders.map(x=>x.id)},
    {name:'Situational judgement',desc:'Delays, quality, priorities, confidentiality and reporting',ids:scenarioQuestions.map(x=>x.id)}
  ];
  const totalMax=groups.reduce((n,g)=>n+g.ids.length,0);
  $('#scoreMax').textContent=totalMax;$('#reportMax').textContent=totalMax;
  const correctCount=ids=>ids.filter(id=>state.answers[id]===true).length; const attemptedCount=ids=>ids.filter(id=>state.attempted[id]).length;
  function badgeStatus(correct,max,attempted){if(!attempted)return['Non commencé','noncommence'];if(correct===max)return['Acquis','acquis'];if(correct/max>=.65)return['En cours','encours'];return['Non acquis','nonacquis']}
  function updateReport(){const score=Object.values(state.answers).filter(v=>v===true).length;$('#scoreNow').textContent=score;$('#reportScore').textContent=score;const rows=groups.map(g=>{const c=correctCount(g.ids),a=attemptedCount(g.ids),[label,cls]=badgeStatus(c,g.ids.length,a);return `<tr><td>${g.name}</td><td>${g.desc}</td><td>${c}/${g.ids.length}</td><td><span class="status-badge ${cls}">${label}</span></td></tr>`}).join('');$('#autoReportRows').innerHTML=rows;const attempted=Object.keys(state.attempted).length;const extras=['bridge-pen','writing-paragraph','video-rehearsal','final-sprint'];const extrasDone=extras.filter(x=>state.completed.has(x)).length;const reviewDone=Object.values(state.review).filter(Boolean).length;const denominator=totalMax+extras.length+5;const numerator=Math.min(totalMax,attempted)+extrasDone+reviewDone;const completion=Math.round(numerator/denominator*100);$('#reportCompletion').textContent=`${completion}%`;const pct=totalMax?score/totalMax:0;$('#readinessLabel').textContent=pct>=.85?'Strong':pct>=.65?'Building':'In progress'}
  updateReport();

  // ---------- Manual report fields ----------
  const manualIds=['oralStatus','oralComment','writingStatus','writingComment','usefulRating','clarityRating','confidenceRating','learnerComment','overallStatus','nextPriority'];
  manualIds.forEach(id=>{const el=$('#'+id);if(saved[id]!==undefined)el.value=saved[id];el.addEventListener('input',saveManual);el.addEventListener('change',saveManual)});
  function saveManual(){let current={};try{current=JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{}manualIds.forEach(id=>current[id]=$('#'+id).value);current.answers=state.answers;current.attempted=state.attempted;current.completed=[...state.completed];current.review=state.review;current.mode=state.mode;current.showFrench=state.showFrench;current.writing=state.writing;current.simNotes=state.simNotes;localStorage.setItem(STORAGE,JSON.stringify(current))}
  $('#saveReport').addEventListener('click',()=>{saveManual();$('#reportFeedback').className='feedback good';$('#reportFeedback').textContent='Progress report saved in this browser.'});
  function reportText(){const score=Object.values(state.answers).filter(v=>v===true).length;return [
    'MAHRIA LAKAF — LESSON 3 QUALIOPI PROGRESS REPORT','Inside the Shoe Métier — interview intensive','Target interview: Hermès Métier Chaussure · 24 August 2026','',
    `Automatic score: ${score}/${totalMax} (${Math.round(score/totalMax*100)}%)`,...groups.map(g=>{const c=correctCount(g.ids),a=attemptedCount(g.ids),[label]=badgeStatus(c,g.ids.length,a);return `- ${g.name}: ${c}/${g.ids.length} — ${label}`;}),'',
    `Speaking / interview production: ${$('#oralStatus').value}`,`Speaking comment: ${$('#oralComment').value||'—'}`,'',
    `Written production: ${$('#writingStatus').value}`,`Writing comment: ${$('#writingComment').value||'—'}`,'',
    `Learner usefulness rating: ${$('#usefulRating').value}/5`,`Learner clarity rating: ${$('#clarityRating').value}/5`,`Learner confidence rating: ${$('#confidenceRating').value}/5`,`Learner comment: ${$('#learnerComment').value||'—'}`,'',
    `Overall lesson status: ${$('#overallStatus').value}`,`Priority before interview: ${$('#nextPriority').value||'—'}`,'',
    'Core interview target: UNDERSTAND · CONNECT · CLARIFY · COORDINATE · RECOVER'
  ].join('\n')}
  $('#copyReport').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(reportText());$('#reportFeedback').className='feedback good';$('#reportFeedback').textContent='Report copied.'}catch{$('#reportFeedback').className='feedback bad';$('#reportFeedback').textContent='Copy was not available in this browser. Use Download .txt instead.'}});
  $('#downloadReport').addEventListener('click',()=>{const blob=new Blob([reportText()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Mahria-Lesson-3-Shoe-Metier-Qualiopi-Progress-Report.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
  $('#resetLesson').addEventListener('click',()=>{if(!confirm('Reset all Lesson 3 scores, writing, completion and saved report fields?'))return;localStorage.removeItem(STORAGE);location.reload()});

  // restore manual just in case
  manualIds.forEach(id=>{if(saved[id]!==undefined)$('#'+id).value=saved[id]});
})();
