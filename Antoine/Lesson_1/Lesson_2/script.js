(() => {
  'use strict';
  const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
  const state={score:0,max:0,answered:new Set(),completed:new Set(),played:new Set(),timers:{},voices:[]};
  $('#jsStatus')?.classList.add('loaded');

  const vocab=[
    {c:'Job',w:'hands-on',fr:'pratique / concret',d:'involving practical work rather than only theory or office work',e:'I’m open to a hands-on role while I’m in Australia.'},
    {c:'Job',w:'transferable skills',fr:'compétences transférables',d:'skills that are useful in different jobs or sectors',e:'Problem-solving and reliability are transferable skills.'},
    {c:'Job',w:'learn on the job',fr:'apprendre sur le terrain',d:'learn by doing the work rather than before starting',e:'I’m happy to learn on the job.'},
    {c:'Job',w:'roster',fr:'planning / roulement',d:'a schedule showing when people work, especially shifts',e:'What does a typical roster look like?'},
    {c:'Job',w:'site',fr:'site / lieu de travail',d:'the place where construction, mining or operational work happens',e:'Would I need my own transport to get to the site?'},
    {c:'Australia',w:'a quick heads-up',fr:'un petit avertissement / info rapide',d:'informal advance notice about something useful or important',e:'Just a quick heads-up: the shift starts at 5:30.'},
    {c:'Australia',w:'give someone a lift',fr:'emmener quelqu’un en voiture',d:'take someone somewhere in your car',e:'One of the crew can give you a lift from town.'},
    {c:'Australia',w:'keen to',fr:'avoir envie de / être motivé pour',d:'very interested or willing to do something',e:'I’m keen to try a different working environment.'},
    {c:'Australia',w:'no worries',fr:'pas de souci',d:'informal Australian expression meaning it is fine or not a problem',e:'No worries, I can start early tomorrow.'},
    {c:'Everyday',w:'keep my options open',fr:'garder mes options ouvertes',d:'avoid deciding too early so several possibilities remain',e:'I’m keeping my options open about the type of work.'},
    {c:'Everyday',w:'work out',fr:'bien se passer / fonctionner',d:'develop successfully or have a good result',e:'If everything works out, I’ll stay longer.'},
    {c:'Everyday',w:'settle in',fr:'s’installer / prendre ses marques',d:'become comfortable in a new place or situation',e:'I’d like two weeks to settle in before travelling.'},
    {c:'Everyday',w:'figure out',fr:'trouver / comprendre',d:'find an answer or understand how something works',e:'We’ll figure out the practical details when we arrive.'},
    {c:'Fluency',w:'what I mean is…',fr:'ce que je veux dire, c’est…',d:'a phrase used to reformulate your idea',e:'What I mean is, I’m not looking for the same career immediately.'},
    {c:'Fluency',w:'basically',fr:'en gros / essentiellement',d:'used to give the simplest explanation of something',e:'HYROX is basically running mixed with exercise stations.'},
    {c:'Fluency',w:'in other words',fr:'autrement dit',d:'used to explain an idea in a different way',e:'In other words, I want to be able to react without a script.'},
    {c:'Character',w:'reliable',fr:'fiable',d:'someone people can trust to do what is expected',e:'I’m reliable and used to following important processes.'},
    {c:'Character',w:'resilient',fr:'résilient / solide',d:'able to recover and continue after difficulty',e:'Long-distance training has made me more resilient.'},
    {c:'Character',w:'stamina',fr:'endurance',d:'the ability to continue physical or mental effort for a long time',e:'Regular training has given me good stamina.'},
    {c:'Character',w:'adaptable',fr:'adaptable',d:'able to change effectively when the situation changes',e:'I’m adaptable and comfortable learning new systems.'}
  ];
  const cats=['All',...new Set(vocab.map(v=>v.c))];
  $('#vocabFilters').innerHTML=cats.map(c=>`<button class="filter-btn ${c==='All'?'active':''}" data-cat="${c}" type="button">${c}</button>`).join('');
  const renderVocab=(cat='All')=>{const list=cat==='All'?vocab:vocab.filter(v=>v.c===cat);$('#vocabGrid').innerHTML=list.map(v=>`<article class="vocab-card"><span class="cat">${v.c}</span><h3>${v.w} <button class="icon-listen speak" data-say="${v.w}. ${v.e.replaceAll('"','&quot;')}" type="button">▶</button></h3><span class="translation fr">${v.fr}</span><p>${v.d}</p><p class="example">“${v.e}”</p></article>`).join('');};
  renderVocab();
  $('#vocabFilters').addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;$$('.filter-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderVocab(b.dataset.cat)});

  const tenseQs=[
    ['I ___ in finance for two years before I changed roles.',['worked','have worked','work'],'worked','Finished period before a later change → past simple.'],
    ['I ___ with teams in Portugal and Singapore, so international communication is familiar to me.',['worked','have worked','am working'],'have worked','Life/professional experience connected to the present → present perfect.'],
    ['At the moment, I ___ twice a day because sport gives me structure.',['train','trained','have trained'],'train','Current routine → present simple.'],
    ['Next year, I ___ for work after I arrive in Australia.',["'m going to look",'looked','have looked'],"'m going to look",'A future intention/plan → be going to.'],
    ['Last year, I ___ a presentation in English to an international group.',['gave','have given','give'],'gave','Specific finished time → past simple.'],
    ['I ___ English at work for several years now.',['used','have used','am use'],'have used','An activity that started in the past and connects to now → present perfect.']
  ];
  const questionQs=[
    ['Choose the correct question.',['What time the shift starts?','What time does the shift start?','What time does start the shift?'],'What time does the shift start?','Present simple question: does + subject + base verb.'],
    ['Choose the correct past question.',['Why did you leave your previous role?','Why you left your previous role?','Why did you left your previous role?'],'Why did you leave your previous role?','After did, use the base verb: leave.'],
    ['Choose the correct experience question.',['Have you ever worked outdoors?','Did you ever worked outdoors?','Have you ever work outdoors?'],'Have you ever worked outdoors?','Present perfect: have + subject + past participle.'],
    ['Choose the natural polite question.',['You provide accommodation?','Do you providing accommodation?','Do you provide accommodation?'],'Do you provide accommodation?','Present simple question with do + base verb.']
  ];
  const listenA=[
    ['Why does the shift start early?',['Because the supervisor leaves early','Because it gets warm later','Because tools arrive at 5:30'],'Because it gets warm later','The reason given is the heat later in the day.'],
    ['What does the worker NOT need to bring?',['Water','Closed shoes','Tools'],'Tools','The supervisor says the tools are provided.'],
    ['What should the worker do if there is no car?',['Call tonight','Walk from town','Arrive later'],'Call tonight','The worker should let the supervisor know that evening.']
  ];
  const listenB=[
    ['What was replaced last winter?',['The tyres','The battery','The air conditioning'],'The battery','The seller replaced the battery last winter.'],
    ['What may need checking?',['The rooftop tent','The registration','The air conditioning'],'The air conditioning','It works but takes time to cool down.'],
    ['Until when is registration paid?',['February','Three months','Last winter'],'February','Registration is paid until February.']
  ];
  const rejoinders=[
    ['“Could you start at six tomorrow morning?”',['Yes, I start yesterday.','No worries. I can be there by six.','I am agree for six.'],'No worries. I can be there by six.','Natural acceptance of a proposed start time.'],
    ['“You’ll need your own transport to the site.”',['Okay. How far is it from town?','I have transported many times.','Where transport you?'],'Okay. How far is it from town?','A relevant follow-up question keeps the interaction moving.'],
    ['“Have you done this kind of work before?”',["Not exactly, but I’m used to learning new processes quickly.",'Yes, I do it tomorrow.','I am process analyst since six years.'],"Not exactly, but I’m used to learning new processes quickly.",'Honest answer + transferable skill.']
  ];
  const shuffle=a=>a.map(x=>[Math.random(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
  function makeQuiz(el,qs,prefix){state.max+=qs.length;el.innerHTML=qs.map((q,i)=>`<div class="q-card" data-qid="${prefix}${i}"><p>${i+1}. ${q[0]}</p><div class="option-row">${shuffle(q[1]).map(o=>`<button class="option" data-answer="${encodeURIComponent(o)}" type="button">${o}</button>`).join('')}</div><div class="feedback" aria-live="polite"></div></div>`).join('');el.addEventListener('click',e=>{const b=e.target.closest('.option');if(!b)return;const card=b.closest('.q-card'),qid=card.dataset.qid;if(state.answered.has(qid))return;const qi=Number(qid.replace(prefix,'')),q=qs[qi],ans=decodeURIComponent(b.dataset.answer),ok=ans===q[2];state.answered.add(qid);if(ok)state.score++;$$('.option',card).forEach(x=>{const val=decodeURIComponent(x.dataset.answer);if(val===q[2])x.classList.add('correct');else if(x===b&&!ok)x.classList.add('wrong');x.disabled=true});$('.feedback',card).textContent=(ok?'✓ Correct. ':'✗ Correct answer: '+q[2]+'. ')+q[3];updateScore();save()});}
  makeQuiz($('#tenseQuiz'),tenseQs,'t');makeQuiz($('#questionQuiz'),questionQs,'q');makeQuiz($('#listenQuizA'),listenA,'la');makeQuiz($('#listenQuizB'),listenB,'lb');makeQuiz($('#rejoinderQuiz'),rejoinders,'r');

  const chunks=[
    ['I’m used to + -ing','être habitué à','I’m used to working under pressure.'],
    ['I don’t mind + -ing','ça ne me dérange pas de','I don’t mind doing physical work.'],
    ['I’m looking to + verb','je cherche à / je souhaite','I’m looking to gain experience abroad.'],
    ['I ended up + -ing','j’ai fini par','I ended up staying at the company for six years.'],
    ['I’d rather + verb','je préférerais','I’d rather rent a place than stay in a hostel.'],
    ['It turns out…','il se trouve que','It turns out the timing works quite well.'],
    ['I’m open to + noun/-ing','je suis ouvert à','I’m open to working in a different sector.'],
    ['I’ve always been + adjective','j’ai toujours été','I’ve always been very active.'],
    ['What I’m looking for is…','ce que je recherche, c’est','What I’m looking for is a practical job where I can learn quickly.']
  ];
  $('#chunkGrid').innerHTML=chunks.map(c=>`<div class="chunk"><b>${c[0]}</b><span class="fr">${c[1]}</span><small>${c[2]}</small></div>`).join('');

  const scenarios=[
    ['The farm interview','The manager says: “Your background is very office-based. Why should I believe you can handle physical work?”'],
    ['The mine-site phone call','A recruiter calls unexpectedly and asks you to summarise your experience, your availability and why you are interested in site-support work.'],
    ['The van inspection','You like the van, but it has high mileage. Ask questions, express one concern and negotiate what should be checked before you buy it.'],
    ['The first week','A colleague asks why you left a stable career to come to Australia. Give an honest answer without sounding negative about your previous employer.'],
    ['The accommodation problem','You rented a place for two weeks, but the Wi-Fi does not work and you need it for job applications. Explain the problem and propose a solution.'],
    ['The missing word','Explain what a process analyst does to someone who has never worked in an office. You may not use the words “process”, “analyse”, “software” or “business analyst”.'],
    ['The small-talk test','Someone at the gym asks what brings you to Australia. Keep the conversation going for at least five exchanges and ask two questions back.'],
    ['The safety instruction','You do not understand one instruction on a work site. Clarify it politely, reformulate what you think it means, and confirm what you should do next.']
  ];
  let lastScenario=-1;$('#newScenario').addEventListener('click',()=>{let i;do{i=Math.floor(Math.random()*scenarios.length)}while(scenarios.length>1&&i===lastScenario);lastScenario=i;$('#scenarioCard').innerHTML=`<span>SURPRISE ${String(i+1).padStart(2,'0')}</span><h3>${scenarios[i][0]}</h3><p>${scenarios[i][1]}</p>`;markSection($('#scenarios'))});

  function chooseVoice(lang){const exact=state.voices.find(v=>v.lang===lang);if(exact)return exact;const base=lang.slice(0,2);return state.voices.find(v=>v.lang?.startsWith(base));}
  function speak(text,onceBtn){if(!('speechSynthesis'in window))return alert('Speech synthesis is not supported in this browser.');speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);const lang=$('#accentSelect').value;u.lang=lang;u.rate=Number($('#rateSelect').value);const v=chooseVoice(lang);if(v)u.voice=v;speechSynthesis.speak(u);if(onceBtn&&$('#modeSelect').value==='exam'){onceBtn.disabled=true;onceBtn.textContent='Played';state.played.add(onceBtn.dataset.audioId||text.slice(0,20));}}
  function loadVoices(){state.voices=speechSynthesis.getVoices()||[];} if('speechSynthesis'in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices}
  document.addEventListener('click',e=>{const b=e.target.closest('.speak');if(b)speak(b.dataset.say||'',null);const o=e.target.closest('.listen-once');if(o)speak(o.dataset.say||'',o);const sc=e.target.closest('[data-scroll]');if(sc){const target=$(sc.dataset.scroll);target?.scrollIntoView({behavior:'smooth'})}});

  $('#modeSelect').addEventListener('change',()=>{document.body.classList.toggle('exam-mode',$('#modeSelect').value==='exam');$$('.listen-once').forEach(b=>{if($('#modeSelect').value==='practice')b.disabled=false});save()});
  $('#toggleFrench').addEventListener('click',()=>{const hidden=document.body.classList.toggle('hide-fr');$$('.fr').forEach(x=>x.classList.toggle('hidden',hidden));$('#toggleFrench').textContent='FR help: '+(hidden?'OFF':'ON');save()});
  $('#printBtn').addEventListener('click',()=>window.print());

  $$('.timer-start').forEach(b=>b.addEventListener('click',()=>startTimer(b.dataset.target,Number(b.dataset.seconds))));
  $$('.timer-reset').forEach(b=>b.addEventListener('click',()=>resetTimer(b.dataset.target,Number(b.dataset.seconds))));
  function startTimer(id,sec){if(state.timers[id])clearInterval(state.timers[id]);let remaining=sec;renderTime(id,remaining);state.timers[id]=setInterval(()=>{remaining--;renderTime(id,remaining);if(remaining<=0){clearInterval(state.timers[id]);state.timers[id]=null;const el=$('#'+id);el.textContent='TIME';el.classList.add('time-up')}},1000)}
  function resetTimer(id,sec){if(state.timers[id])clearInterval(state.timers[id]);state.timers[id]=null;const el=$('#'+id);el.classList.remove('time-up');renderTime(id,sec)}
  function renderTime(id,s){const m=Math.floor(s/60),x=s%60;$('#'+id).textContent=`${String(m).padStart(2,'0')}:${String(x).padStart(2,'0')}`}

  const recorders=new Map();$$('.recorder').forEach(box=>{const start=$('.record-start',box),stop=$('.record-stop',box),status=$('.record-status',box),audio=$('.record-playback',box);let media,stream,chunks=[];start.addEventListener('click',async()=>{try{stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];media=new MediaRecorder(stream);media.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};media.onstop=()=>{const blob=new Blob(chunks,{type:media.mimeType||'audio/webm'});audio.src=URL.createObjectURL(blob);audio.classList.remove('hidden');stream.getTracks().forEach(t=>t.stop());status.textContent='Recording ready — listen back.'};media.start();start.disabled=true;stop.disabled=false;status.textContent='Recording…';}catch(err){status.textContent='Microphone unavailable. Check browser permission.'}});stop.addEventListener('click',()=>{if(media&&media.state==='recording')media.stop();start.disabled=false;stop.disabled=true});recorders.set(box.dataset.recorder,{box})});

  $('#writingTask').addEventListener('input',()=>{$('#wordCount').textContent=countWords($('#writingTask').value);save()});
  function countWords(t){return (t.trim().match(/\b[\w’'-]+\b/g)||[]).length}
  $$('.rubric').forEach(r=>r.addEventListener('input',()=>{r.nextElementSibling.textContent=r.value+'/5';updateRubric();save()}));
  function updateRubric(){const vals=$$('.rubric').map(r=>Number(r.value));const avg=vals.reduce((a,b)=>a+b,0)/vals.length;$('#rubricAverage').textContent=avg.toFixed(1)+' / 5'}
  function updateScore(){$('#scoreDisplay').textContent=`${state.score} / ${state.max}`;updateProgress()}

  const sections=$$('section[data-track]');const io=new IntersectionObserver(entries=>{entries.forEach(en=>{if(en.isIntersecting&&en.intersectionRatio>.35){markSection(en.target)}})},{threshold:[.35]});sections.forEach(s=>io.observe(s));
  function markSection(s){state.completed.add(s.id);s.classList.add('complete');updateProgress();save()}
  function updateProgress(){const pct=Math.round((state.completed.size/sections.length)*100);$('#progressBar').style.width=pct+'%';$('#progressPct').textContent=pct+'%';$('#completionDisplay').textContent=pct+'%'}

  const trackedText=['questionNotes','pitchKeywords','writingTask','teacherFeedback','nextVocab'];trackedText.forEach(id=>$('#'+id)?.addEventListener('input',save));$$('.reuse-inputs input').forEach(x=>x.addEventListener('input',save));
  function getData(){return{mode:$('#modeSelect').value,accent:$('#accentSelect').value,rate:$('#rateSelect').value,hideFr:document.body.classList.contains('hide-fr'),score:state.score,max:state.max,answered:[...state.answered],completed:[...state.completed],texts:Object.fromEntries(trackedText.map(id=>[id,$('#'+id)?.value||''])),reuse:$$('.reuse-inputs input').map(x=>x.value),rubrics:$$('.rubric').map(x=>x.value)}}
  function save(){try{localStorage.setItem('st_antoine_l2',JSON.stringify(getData()))}catch{}}
  function restore(){try{const d=JSON.parse(localStorage.getItem('st_antoine_l2')||'null');if(!d)return;$('#modeSelect').value=d.mode||'practice';$('#accentSelect').value=d.accent||'en-AU';$('#rateSelect').value=d.rate||'.96';document.body.classList.toggle('exam-mode',d.mode==='exam');state.score=Number(d.score)||0;state.answered=new Set(d.answered||[]);state.answered.forEach(qid=>{const card=document.querySelector(`[data-qid="${qid}"]`);if(card){$$('.option',card).forEach(x=>x.disabled=true);$('.feedback',card).textContent='Saved answer restored.'}});if(d.hideFr){document.body.classList.add('hide-fr');$$('.fr').forEach(x=>x.classList.add('hidden'));$('#toggleFrench').textContent='FR help: OFF'};Object.entries(d.texts||{}).forEach(([id,v])=>{if($('#'+id))$('#'+id).value=v});(d.reuse||[]).forEach((v,i)=>{if($$('.reuse-inputs input')[i])$$('.reuse-inputs input')[i].value=v});(d.rubrics||[]).forEach((v,i)=>{const r=$$('.rubric')[i];if(r){r.value=v;r.nextElementSibling.textContent=v+'/5'}});(d.completed||[]).forEach(id=>{state.completed.add(id);$('#'+id)?.classList.add('complete')});$('#wordCount').textContent=countWords($('#writingTask').value);updateRubric();updateProgress()}catch{}}
  $('#saveBtn').addEventListener('click',()=>{save();const b=$('#saveBtn'),old=b.textContent;b.textContent='Saved ✓';setTimeout(()=>b.textContent=old,1100)});
  $('#resetAll').addEventListener('click',()=>{if(confirm('Reset all saved progress for this lesson?')){localStorage.removeItem('st_antoine_l2');location.reload()}});

  $('#downloadReport').addEventListener('click',()=>{const rubric=$$('.rubric').map(r=>`<li>${r.dataset.label}: ${r.value}/5</li>`).join('');const html=`<!doctype html><html><meta charset="utf-8"><title>Lesson 2 Progress Report</title><style>body{font-family:Arial;max-width:850px;margin:40px auto;line-height:1.5}h1{color:#1d4f3f}.box{background:#f2f6f3;padding:16px;border-radius:10px;margin:12px 0}pre{white-space:pre-wrap;font-family:Arial}</style><body><h1>Lesson 2 — Progress Report</h1><div class="box"><b>Auto-graded score:</b> ${state.score}/${state.max}<br><b>Completion:</b> ${$('#completionDisplay').textContent}<br><b>Rubric average:</b> ${$('#rubricAverage').textContent}</div><h2>Performance rubric</h2><ul>${rubric}</ul><h2>Trainer feedback</h2><pre>${escapeHtml($('#teacherFeedback').value)}</pre><h2>Vocabulary to recycle</h2><pre>${escapeHtml($('#nextVocab').value)}</pre><h2>Writing practice</h2><p>${countWords($('#writingTask').value)} words</p><pre>${escapeHtml($('#writingTask').value)}</pre><p><small>Generated from SpeakEasy Tisha — personalised English training.</small></p></body></html>`;const blob=new Blob([html],{type:'text/html'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Lesson_2_Progress_Report.html';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
  function escapeHtml(s){return(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

  restore(); updateScore(); updateRubric();
})();
