(() => {
  'use strict';

  const STORAGE_KEY = 'karineAtelierBoisvinetLessonV1';
  const state = { answers: {}, orderAnswers: {}, fills: {}, ttsLang: 'en-GB' };

  const vocab = {
    services: [
      ['a trim','une petite coupe','I’d like a trim, but I want to keep the length.'],
      ['a blow-dry','un brushing','Would you like a blow-dry after the cut?'],
      ['highlights','des mèches','You could add a few soft highlights.'],
      ['a gloss treatment','un soin gloss','A gloss treatment can add shine.'],
      ['a consultation','un diagnostic / échange','The consultation helps us understand what you want.'],
      ['a scalp massage','un massage du cuir chevelu','A scalp massage can feel very relaxing.']
    ],
    hair: [
      ['the fringe / bangs','la frange','The fringe feels a little too short.'],
      ['layers','un dégradé','Layers can add movement.'],
      ['the roots','les racines','My roots are darker than the rest.'],
      ['the ends','les pointes','The ends feel dry.'],
      ['shoulder-length','aux épaules','My hair is shoulder-length.'],
      ['wavy','ondulé','I’d like a soft, wavy finish.']
    ],
    consultation: [
      ['to keep the length','garder la longueur','I’d like to keep the length.'],
      ['easy to style','facile à coiffer','I need something easy to style.'],
      ['natural-looking','d’aspect naturel','I prefer a natural-looking colour.'],
      ['low-maintenance','facile d’entretien','I’d like a low-maintenance style.'],
      ['to suit someone','aller à quelqu’un','What style would suit me?'],
      ['to recommend','recommander','What would you recommend?']
    ],
    problems: [
      ['too dry','trop sec','My hair feels too dry.'],
      ['not shiny enough','pas assez brillant','It isn’t shiny enough.'],
      ['too heavy','trop lourd','This product is too heavy for my hair.'],
      ['difficult to manage','difficile à coiffer','My hair is difficult to manage.'],
      ['to soften','adoucir','We could soften the shape.'],
      ['to add moisture','hydrater','This treatment can add moisture.']
    ]
  };

  const quizzes = {
    vocab: [
      {p:'The ends of my hair are dry. I only want a small amount cut off. I need a…', o:['trim','balayage','fringe'], a:'trim', why:'A trim removes a small amount of length.'},
      {p:'I want a few lighter pieces, not a full colour. I could ask for…', o:['highlights','roots','conditioner'], a:'highlights', why:'Highlights add lighter pieces to selected sections.'},
      {p:'The hair close to my scalp has grown and shows my natural colour. These are my…', o:['ends','roots','layers'], a:'roots', why:'Roots are the hair nearest the scalp.'},
      {p:'I want my hair to have more movement without becoming much shorter. I could add…', o:['layers','a scalp massage','a fringe only'], a:'layers', why:'Layers can add shape and movement.'},
      {p:'I want something simple that does not need a lot of work every morning. I need a ___ style.', o:['low-maintenance','dramatic','temporary'], a:'low-maintenance', why:'Low-maintenance means easy to look after.'},
      {p:'My hair has a gentle S-shape, not tight curls. It is…', o:['wavy','straight','bald'], a:'wavy', why:'Wavy hair has soft waves.'},
      {p:'Before choosing a cut, we discuss my hair, habits and preferences. This is a…', o:['consultation','complaint','delivery'], a:'consultation', why:'A consultation is the discussion before the service.'},
      {p:'I want more shine without a dramatic colour change. A ___ treatment may help.', o:['gloss','root','fringe'], a:'gloss', why:'A gloss treatment is commonly used to add shine and a subtle colour effect.'}
    ],
    modal: [
      {p:'Your hair feels dry. You ___ use a moisturising conditioner.', o:['should','would like','are'], a:'should', why:'Should gives advice.'},
      {p:'___ you like to keep the same length?', o:['Would','Should','Did'], a:'Would', why:'Would you like…? asks about preference politely.'},
      {p:'We ___ check whether there is another appointment available.', o:['can','should to','would liking'], a:'can', why:'Can expresses a real possibility.'},
      {p:'You ___ try a few soft layers if you want more movement.', o:['could','could to','are could'], a:'could', why:'Could + base verb gives a gentle suggestion.'},
      {p:'I’d like ___ the length, please.', o:['to keep','keep','keeping to'], a:'to keep', why:'Would like + to + verb.'},
      {p:'Could you ___ ten minutes earlier?', o:['arrive','to arrive','arriving'], a:'arrive', why:'Could + base verb: no “to”.'},
      {p:'I ___ a small trim, please.', o:['would like','should','can to'], a:'would like', why:'Would like + noun expresses a polite preference.'},
      {p:'You shouldn’t ___ very hot water on dry hair.', o:['use','to use','using'], a:'use', why:'Should/shouldn’t + base verb.'},
      {p:'We could ___ the shape first and then decide.', o:['soften','to soften','softening'], a:'soften', why:'Could + base verb.'},
      {p:'___ you explain the difference between these two options, please?', o:['Could','Should','Would like'], a:'Could', why:'Could you…? is a polite request.'}
    ],
    question: [
      {p:'You want to ask about general routine.', o:['How often do you wash your hair?','When did you wash your hair?','Have you washed your hair yesterday?'], a:'How often do you wash your hair?', why:'Routine → present simple.'},
      {p:'You want to ask about a specific previous haircut.', o:['When did you last have it cut?','When have you last had it cut?','When are you cut it?'], a:'When did you last have it cut?', why:'Specific finished past time → past simple.'},
      {p:'You want to ask about life experience.', o:['Have you ever had highlights?','Did you ever have highlights yesterday?','Are you ever having highlights?'], a:'Have you ever had highlights?', why:'Ever + life experience → present perfect.'},
      {p:'You want to know what is happening now.', o:['Are you using any special product at the moment?','Do you using any special product now?','Did you use any special product now?'], a:'Are you using any special product at the moment?', why:'At the moment → present continuous.'},
      {p:'You want to ask about preference today.', o:['What would you like today?','What should you like today?','What did you would like today?'], a:'What would you like today?', why:'Would like is the natural polite preference question.'},
      {p:'You want to know whether the client liked the last result.', o:['Did you like your last haircut?','Have you like your last haircut?','Do you liked your last haircut?'], a:'Did you like your last haircut?', why:'Last haircut = finished past event.'},
      {p:'You want to ask about an arranged near-future event.', o:['Are you going anywhere special this weekend?','Do you going anywhere special this weekend?','Did you go this weekend?'], a:'Are you going anywhere special this weekend?', why:'Present continuous can ask about an arranged/expected near-future activity.'},
      {p:'You want to know whether this treatment is new for the client.', o:['Have you tried this treatment before?','Did you try this treatment before in your life?','Are you try this treatment before?'], a:'Have you tried this treatment before?', why:'Before + experience with no finished time → present perfect.'}
    ],
    listenA: [
      {p:'What does the client want to keep?', o:['Most of the length','The exact same style','A very dark colour'], a:'Most of the length', why:'She says she wants to keep most of the length.'},
      {p:'Why does she want something easy to style?', o:['She is going to a wedding next month','She is going swimming today','She has a job interview in an hour'], a:'She is going to a wedding next month', why:'The event is a wedding next month.'},
      {p:'What does the hairdresser suggest for shine?', o:['A gloss treatment','A very short fringe','A dramatic colour change'], a:'A gloss treatment', why:'The gloss is suggested to add shine without a dramatic change.'}
    ],
    listenB: [
      {p:'Why can’t the client keep the Friday appointment?', o:['She has a work meeting','She is travelling abroad','The salon is closed'], a:'She has a work meeting', why:'The client says she has a work meeting that afternoon.'},
      {p:'Which option does the client choose?', o:['Saturday at 9:30','Monday at 11:00','Friday after 5:00'], a:'Saturday at 9:30', why:'She says Saturday morning would be perfect.'},
      {p:'What will happen after the appointment is moved?', o:['She will receive a confirmation message','She must call again','She will receive a refund'], a:'She will receive a confirmation message', why:'The salon says a confirmation message will be sent.'}
    ],
    reading: [
      {p:'You only want to tidy the ends and keep the same shape. Which service fits best?', o:['Refresh','Shine','Light & Dimension'], a:'Refresh', why:'Refresh is for a small trim and keeping the shape tidy.'},
      {p:'You want to change the shape of your haircut. Which service fits best?', o:['Shape & Style','Refresh','Shine'], a:'Shape & Style', why:'Shape & Style includes a cut and is described for changing the shape.'},
      {p:'You want shine with only a subtle colour effect. Choose…', o:['Shine','Light & Dimension','Refresh'], a:'Shine', why:'Shine includes a gloss treatment with a subtle colour effect.'},
      {p:'You want lighter pieces and more contrast. Choose…', o:['Light & Dimension','Refresh','Shape & Style'], a:'Light & Dimension', why:'This option mentions highlights or balayage.'},
      {p:'You have only about 30 minutes and do not want a big change. Choose…', o:['Refresh','Shape & Style','Light & Dimension'], a:'Refresh', why:'Refresh is the 30-minute option.'},
      {p:'You want movement and a new shape but no colour service. Choose…', o:['Shape & Style','Shine','Light & Dimension'], a:'Shape & Style', why:'It focuses on consultation, cut and blow-dry.'}
    ],
    cloe: [
      {p:'“I want a polite suggestion.” Choose the best sentence.', o:['You could try a lighter style.','You must do a lighter style.','You can to try lighter.'], a:'You could try a lighter style.', why:'Could gives a soft suggestion.'},
      {p:'Complete: “The water isn’t warm ___.”', o:['enough','too','very enough'], a:'enough', why:'Adjective + enough.'},
      {p:'Choose the correct life-experience question.', o:['Have you ever had highlights?','Did you ever had highlights?','Are you ever have highlights?'], a:'Have you ever had highlights?', why:'Present perfect for life experience.'},
      {p:'Complete: “I’d like ___ the length.”', o:['to keep','keeping to','keep to'], a:'to keep', why:'Would like + to + verb.'},
      {p:'Choose the best response to a complaint.', o:['I understand. Let me see what we can do.','No, it is fine.','You are wrong.'], a:'I understand. Let me see what we can do.', why:'It acknowledges the concern and proposes a realistic next step.'},
      {p:'Complete: “This product is ___ heavy for my fine hair.”', o:['too','enough','not too enough'], a:'too', why:'Too + adjective describes an excessive quality.'}
    ]
  };

  const enoughItems = [
    {before:'The fringe is', blank:'too', after:'short for me.', accepted:['too']},
    {before:'The water isn’t warm', blank:'enough', after:'.', accepted:['enough']},
    {before:'My hair is long', blank:'enough', after:'to tie back.', accepted:['enough']},
    {before:'This product is', blank:'too', after:'heavy for fine hair.', accepted:['too']},
    {before:'The result isn’t natural', blank:'enough', after:'for work.', accepted:['enough']},
    {before:'The colour is', blank:'too', after:'dark for what I wanted.', accepted:['too']},
    {before:'The appointment is', blank:'too', after:'early for me.', accepted:['too']},
    {before:'Is the style easy', blank:'enough', after:'to manage at home?', accepted:['enough']}
  ];

  const orderItems = [
    ['Could','you','arrive','ten','minutes','earlier'],
    ['I’d','like','to','keep','the','length'],
    ['You','should','use','a','gentler','shampoo'],
    ['Would','you','like','to','see','another','option'],
    ['We','can','check','the','appointment','now'],
    ['You','could','try','a','softer','style']
  ];

  const groupMeta = {
    vocab:{label:'Vocabulary · QCM', total:8},
    modal:{label:'Grammar · can/could/should/would like', total:10},
    order:{label:'Grammar · word order', total:6},
    enough:{label:'Grammar · too/enough', total:8},
    question:{label:'Question formation & tense choice', total:8},
    listening:{label:'Listening comprehension', total:6},
    reading:{label:'Reading for action', total:6},
    cloe:{label:'CLOE transfer sprint', total:6}
  };

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  function shuffle(arr){
    const out=[...arr];
    for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
    return out;
  }

  function renderVocab(cat='services'){
    const grid=$('#vocabGrid');
    grid.innerHTML='';
    vocab[cat].forEach(([word,fr,ex])=>{
      const card=document.createElement('article');
      card.className='vocab-card';
      card.innerHTML=`<span class="vocab-word">${word}</span><span class="vocab-fr">${fr}</span><p>${ex}</p><button class="icon-btn speak" type="button" data-speak="${escapeAttr(word+'. '+ex)}">▶ Listen</button>`;
      grid.appendChild(card);
    });
  }

  function escapeAttr(str){return str.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  function renderQuiz(group, selector){
    const root=$(selector); if(!root) return;
    root.innerHTML='';
    quizzes[group].forEach((q,idx)=>{
      const item=document.createElement('div'); item.className='quiz-item';
      const options=shuffle(q.o);
      item.innerHTML=`<div><span class="q-number">${idx+1}</span><span class="q-prompt">${q.p}</span></div><div class="options"></div><div class="feedback" id="fb-${group}-${idx}" aria-live="polite"></div>`;
      const opts=item.querySelector('.options');
      options.forEach(opt=>{
        const b=document.createElement('button'); b.type='button'; b.className='option-btn'; b.textContent=opt;
        b.addEventListener('click',()=>answerQ(group,idx,opt,item)); opts.appendChild(b);
      });
      root.appendChild(item);
      refreshQVisual(group,idx,item);
    });
  }

  function answerQ(group,idx,opt,item){
    state.answers[`${group}:${idx}`]=opt;
    refreshQVisual(group,idx,item);
    persist(false); updateAllScores();
  }

  function refreshQVisual(group,idx,item){
    const key=`${group}:${idx}`; const chosen=state.answers[key]; const q=quizzes[group][idx];
    item.querySelectorAll('.option-btn').forEach(b=>{
      b.classList.remove('correct','wrong');
      if(chosen && b.textContent===chosen) b.classList.add(chosen===q.a?'correct':'wrong');
    });
    const fb=item.querySelector('.feedback');
    if(chosen){
      const ok=chosen===q.a; fb.className=`feedback ${ok?'good':'bad'}`; fb.textContent=(ok?'✓ Correct. ':'✗ Try again. ')+q.why;
    }else{fb.className='feedback';fb.textContent='';}
  }

  function renderEnough(){
    const root=$('#enoughQuiz'); root.innerHTML='';
    enoughItems.forEach((q,idx)=>{
      const item=document.createElement('div'); item.className='fill-item';
      item.innerHTML=`<div class="fill-line"><span class="q-number">${idx+1}</span><span>${q.before}</span><input id="fill-${idx}" aria-label="Answer ${idx+1}" autocomplete="off"><span>${q.after}</span><button class="check-fill" type="button">Check</button></div><div class="feedback" aria-live="polite"></div>`;
      const input=item.querySelector('input'); const fb=item.querySelector('.feedback');
      if(state.fills[idx]) input.value=state.fills[idx];
      const check=()=>{const val=input.value.trim().toLowerCase();state.fills[idx]=val;const ok=q.accepted.includes(val);fb.className=`feedback ${ok?'good':'bad'}`;fb.textContent=ok?'✓ Correct.':`✗ Correct answer: ${q.blank}`;persist(false);updateAllScores();};
      item.querySelector('button').addEventListener('click',check); input.addEventListener('keydown',e=>{if(e.key==='Enter')check();}); input.addEventListener('input',()=>{state.fills[idx]=input.value;persist(false);});
      root.appendChild(item);
      if(state.fills[idx]){const val=state.fills[idx].trim().toLowerCase();const ok=q.accepted.includes(val);fb.className=`feedback ${ok?'good':'bad'}`;fb.textContent=ok?'✓ Correct.':`✗ Correct answer: ${q.blank}`;}
    });
  }

  function renderOrder(){
    const root=$('#orderQuiz'); root.innerHTML='';
    orderItems.forEach((words,idx)=>{
      const target=words.join(' '); const shuffled=shuffle(words.map((w,i)=>({w,id:i}))); const item=document.createElement('div'); item.className='order-item';
      const chosen=(state.orderAnswers[idx]||[]).map(Number);
      item.innerHTML=`<div><span class="q-number">${idx+1}</span><span class="q-prompt">Build the sentence.</span></div><div class="word-bank"></div><div class="sentence-slot" aria-label="Your sentence"></div><div class="order-actions"><button class="small-btn check-order" type="button">Check</button><button class="small-btn clear-order" type="button">Clear</button></div><div class="feedback"></div>`;
      const bank=item.querySelector('.word-bank'); const slot=item.querySelector('.sentence-slot'); const fb=item.querySelector('.feedback');
      function redraw(){
        bank.innerHTML=''; slot.innerHTML='';
        shuffled.forEach(obj=>{if(!chosen.includes(obj.id)){const b=document.createElement('button');b.type='button';b.className='word-chip';b.textContent=obj.w;b.addEventListener('click',()=>{chosen.push(obj.id);sync();});bank.appendChild(b);}});
        chosen.forEach(id=>{const obj=shuffled.find(x=>x.id===id) || words.map((w,i)=>({w,id:i})).find(x=>x.id===id); const b=document.createElement('button');b.type='button';b.className='word-chip selected';b.textContent=obj.w;b.addEventListener('click',()=>{chosen.splice(chosen.indexOf(id),1);sync();});slot.appendChild(b);});
      }
      function sync(){state.orderAnswers[idx]=[...chosen];persist(false);redraw();updateAllScores();}
      item.querySelector('.check-order').addEventListener('click',()=>{const text=chosen.map(id=>words[id]).join(' ');const ok=text===target;fb.className=`feedback ${ok?'good':'bad'}`;fb.textContent=ok?'✓ Correct.':`✗ Try again. Model: ${target}`;updateAllScores();});
      item.querySelector('.clear-order').addEventListener('click',()=>{chosen.splice(0);state.orderAnswers[idx]=[];fb.textContent='';persist(false);redraw();updateAllScores();});
      root.appendChild(item); redraw();
    });
  }

  function scoreQuiz(group){
    let correct=0, attempted=0;
    quizzes[group].forEach((q,idx)=>{const v=state.answers[`${group}:${idx}`];if(v!==undefined){attempted++;if(v===q.a)correct++;}});
    return {correct,attempted,total:quizzes[group].length};
  }
  function scoreEnough(){let correct=0,attempted=0;enoughItems.forEach((q,i)=>{const v=(state.fills[i]||'').trim().toLowerCase();if(v){attempted++;if(q.accepted.includes(v))correct++;}});return {correct,attempted,total:enoughItems.length};}
  function scoreOrder(){let correct=0,attempted=0;orderItems.forEach((words,i)=>{const chosen=state.orderAnswers[i]||[];if(chosen.length){attempted++;const text=chosen.map(id=>words[id]).join(' ');if(text===words.join(' '))correct++;}});return {correct,attempted,total:orderItems.length};}
  function scoreListening(){const a=scoreQuiz('listenA'),b=scoreQuiz('listenB');return {correct:a.correct+b.correct,attempted:a.attempted+b.attempted,total:a.total+b.total};}
  function getScores(){return {vocab:scoreQuiz('vocab'),modal:scoreQuiz('modal'),order:scoreOrder(),enough:scoreEnough(),question:scoreQuiz('question'),listening:scoreListening(),reading:scoreQuiz('reading'),cloe:scoreQuiz('cloe')};}
  function statusFor(s){if(s.attempted===0)return ['Non commencé','status-not'];const pct=s.correct/s.total*100;if(s.attempted===s.total&&pct>=80)return ['Acquis','status-good'];if(s.attempted===s.total&&pct<60)return ['Non acquis','status-bad'];return ['En cours','status-progress'];}

  function updateAllScores(){
    const scores=getScores();
    const ids={vocab:'vocab-score',modal:'modal-score',order:'order-score',enough:'enough-score',question:'question-score',reading:'reading-score',cloe:'cloe-score'};
    Object.entries(ids).forEach(([k,id])=>{const el=$('#'+id);if(el)el.textContent=`${scores[k].correct} / ${scores[k].total}`;});
    $('#listening-score').textContent=`${scores.listening.correct} / ${scores.listening.total}`;
    const total=Object.values(scores).reduce((a,s)=>a+s.total,0);const correct=Object.values(scores).reduce((a,s)=>a+s.correct,0);const attempted=Object.values(scores).reduce((a,s)=>a+s.attempted,0);const pct=total?Math.round(correct/total*100):0;
    $('#globalScore').textContent=pct+'%'; $('#globalDone').textContent=`${attempted} / ${total}`;
    const globalStatus=attempted===0?'Not started':attempted<total?'In progress':pct>=80?'Acquired':pct<60?'Not acquired':'In progress';$('#globalStatus').textContent=globalStatus;
    $('#reportAutoPercent').textContent=pct+'%';$('#reportAutoDetail').textContent=`${correct} / ${total} correct · ${attempted} attempted`;
    renderAutoProgress(scores);updateManualSummary(correct,total);
  }

  function renderAutoProgress(scores){
    const body=$('#autoProgressBody'); body.innerHTML='';
    Object.entries(groupMeta).forEach(([key,meta])=>{const s=scores[key];const [status,cls]=statusFor(s);const tr=document.createElement('tr');tr.innerHTML=`<td><strong>${meta.label}</strong></td><td>${s.correct} / ${s.total} (${Math.round(s.correct/s.total*100)}%)</td><td>${s.attempted} / ${s.total}</td><td><span class="status-pill ${cls}">${status}</span></td>`;body.appendChild(tr);});
  }

  function manualGroup(selector){const inputs=$$(selector);let points=0,max=0,count=0;inputs.forEach(i=>{if(i.value!==''){points+=Math.max(0,Math.min(5,Number(i.value)));max+=5;count++;}});return {points,max,count,pct:max?Math.round(points/max*100):null};}
  function updateManualSummary(autoCorrect,autoTotal){
    const oral=manualGroup('.oral-score'),writing=manualGroup('.writing-score');
    $('#reportOralPercent').textContent=oral.pct===null?'—':oral.pct+'%';$('#reportWritingPercent').textContent=writing.pct===null?'—':writing.pct+'%';
    const manualEarned=oral.points+writing.points,manualMax=oral.max+writing.max;const overallMax=autoTotal+manualMax;const overall=overallMax?Math.round((autoCorrect+manualEarned)/overallMax*100):0;$('#reportOverallPercent').textContent=overall+'%';
  }

  function initTabs(){ $$('.vocab-tab').forEach(b=>b.addEventListener('click',()=>{$$('.vocab-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderVocab(b.dataset.vocab);})); }

  function initTranslation(){const btn=$('#translationToggle');btn.addEventListener('click',()=>{const on=document.body.classList.toggle('show-fr');btn.textContent=on?'FR ON':'FR OFF';btn.setAttribute('aria-pressed',String(on));localStorage.setItem(STORAGE_KEY+':fr',on?'1':'0');});if(localStorage.getItem(STORAGE_KEY+':fr')==='1'){document.body.classList.add('show-fr');btn.textContent='FR ON';btn.setAttribute('aria-pressed','true');}}

  function chooseVoice(lang){const voices=speechSynthesis.getVoices();return voices.find(v=>v.lang===lang)||voices.find(v=>v.lang.startsWith(lang.split('-')[0]))||null;}
  function speak(text){if(!('speechSynthesis'in window)){alert('Speech synthesis is not supported in this browser.');return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=state.ttsLang;const v=chooseVoice(state.ttsLang);if(v)u.voice=v;u.rate=.92;u.pitch=1;speechSynthesis.speak(u);}
  function initTTS(){state.ttsLang=$('#voiceMode').value;$('#voiceMode').addEventListener('change',e=>{state.ttsLang=e.target.value;});document.addEventListener('click',e=>{const b=e.target.closest('.speak');if(b&&b.dataset.speak)speak(b.dataset.speak);});if('speechSynthesis'in window)speechSynthesis.getVoices();}

  function initWordCounts(){['writing1','writing2','writing3'].forEach(id=>{const ta=$('#'+id),out=$('#'+id+'Count');const update=()=>{const n=ta.value.trim()?ta.value.trim().split(/\s+/).length:0;out.textContent=n;};ta.addEventListener('input',()=>{update();persist(false);});update();});}

  function serializeFields(){const fields={};$$('[data-save="true"]').forEach((el,i)=>{const key=el.id||`autoField-${i}`;fields[key]=el.value;});return fields;}
  function restoreFields(fields={}){$$('[data-save="true"]').forEach((el,i)=>{const key=el.id||`autoField-${i}`;if(Object.prototype.hasOwnProperty.call(fields,key))el.value=fields[key];});}
  function persist(show=true){const payload={state,fields:serializeFields(),savedAt:new Date().toISOString()};localStorage.setItem(STORAGE_KEY,JSON.stringify(payload));if(show){$('#saveMessage').textContent='✓ Progress saved in this browser.';setTimeout(()=>$('#saveMessage').textContent='',2500);}}
  function restore(){try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return;const data=JSON.parse(raw);if(data.state){Object.assign(state,data.state);state.answers=state.answers||{};state.orderAnswers=state.orderAnswers||{};state.fills=state.fills||{};}restoreFields(data.fields||{});}catch(e){console.warn('Could not restore saved lesson',e);}}

  function reportText(){
    const scores=getScores();const lines=[];lines.push('KARINE · L’ATELIER BOISVINET · QUALIOPI PROGRESS REPORT');lines.push(`Date: ${$('#lessonDate').value||''}`);lines.push(`Learner: ${$('#learnerName').value}`);lines.push(`Trainer: ${$('#trainerName').value}`);lines.push('');lines.push('AUTOMATIC RESULTS');
    Object.entries(groupMeta).forEach(([k,m])=>{const s=scores[k],status=statusFor(s)[0];lines.push(`- ${m.label}: ${s.correct}/${s.total} · ${s.attempted}/${s.total} attempted · ${status}`);});
    lines.push('');lines.push(`Automatic score: ${$('#reportAutoPercent').textContent}`);lines.push(`Oral manual score: ${$('#reportOralPercent').textContent}`);lines.push(`Writing manual score: ${$('#reportWritingPercent').textContent}`);lines.push(`Overall available score: ${$('#reportOverallPercent').textContent}`);lines.push('');
    lines.push('ORAL COMMENTS');lines.push($('#oralComments').value||'—');lines.push('');lines.push('WRITING COMMENTS');lines.push($('#writingComments').value||'—');lines.push('');lines.push('GENERAL / NEXT STEP');lines.push($('#trainerComments').value||'—');lines.push('');lines.push('LEARNER COMMENTS');lines.push($('#learnerComments').value||'—');
    return lines.join('\n');
  }

  async function copyReport(){try{await navigator.clipboard.writeText(reportText());$('#saveMessage').textContent='✓ Report copied.';}catch(e){const ta=document.createElement('textarea');ta.value=reportText();document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();$('#saveMessage').textContent='✓ Report copied.';}}
  function downloadReport(){const content=`<!doctype html><meta charset="utf-8"><title>Karine Qualiopi Report</title><style>body{font-family:Arial,sans-serif;max-width:900px;margin:40px auto;white-space:pre-wrap;line-height:1.6;color:#222}</style><body>${reportText().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</body>`;const blob=new Blob([content],{type:'text/html'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`karine-qualiopi-report-${$('#lessonDate').value||'lesson'}.html`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

  let mediaRecorder=null,mediaChunks=[],audioUrl=null;
  async function startRecording(){
    const status=$('#recordStatus');
    if(!navigator.mediaDevices||!window.MediaRecorder){status.textContent='Recording is not supported here. Use the lesson on HTTPS in a compatible browser.';return;}
    try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});mediaChunks=[];mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>{if(e.data.size)mediaChunks.push(e.data);};mediaRecorder.onstop=()=>{const blob=new Blob(mediaChunks,{type:mediaRecorder.mimeType||'audio/webm'});if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=URL.createObjectURL(blob);const audio=$('#recordedAudio');audio.src=audioUrl;audio.hidden=false;const dl=$('#downloadRecord');dl.href=audioUrl;dl.download=`karine-${$('#recordMission').value.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.webm`;dl.classList.remove('disabled');stream.getTracks().forEach(t=>t.stop());status.textContent='Recording ready. Listen back before downloading.';};mediaRecorder.start();$('#startRecord').disabled=true;$('#stopRecord').disabled=false;status.textContent='● Recording… Speak naturally.';}catch(e){status.textContent='Microphone permission was not available. Check browser permissions and HTTPS.';}
  }
  function stopRecording(){if(mediaRecorder&&mediaRecorder.state!=='inactive'){mediaRecorder.stop();$('#startRecord').disabled=false;$('#stopRecord').disabled=true;}}

  let timerInterval=null,timerLeft=120;
  function drawTimer(){const m=String(Math.floor(timerLeft/60)).padStart(2,'0'),s=String(timerLeft%60).padStart(2,'0');$('#cloeTimer').textContent=`${m}:${s}`;}
  function startTimer(){if(timerInterval)return;timerInterval=setInterval(()=>{timerLeft--;drawTimer();if(timerLeft<=0){clearInterval(timerInterval);timerInterval=null;$('#cloeTimer').textContent='TIME';}},1000);}
  function resetTimer(){if(timerInterval)clearInterval(timerInterval);timerInterval=null;timerLeft=120;drawTimer();}

  function initManual(){ $$('.manual-score,.manual-status').forEach(el=>el.addEventListener('input',()=>{updateAllScores();persist(false);})); }

  function initDate(){if(!$('#lessonDate').value){const d=new Date();const local=new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);$('#lessonDate').value=local;}}

  function resetAll(){if(!confirm('Reset all answers, writing and evaluation data for this lesson?'))return;localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(STORAGE_KEY+':fr');location.reload();}

  function bindControls(){
    $('#saveProgress').addEventListener('click',()=>persist(true));$('#saveProgressTop').addEventListener('click',()=>persist(true));$('#copyReport').addEventListener('click',copyReport);$('#downloadReport').addEventListener('click',downloadReport);$('#printReport').addEventListener('click',()=>window.print());$('#resetAll').addEventListener('click',resetAll);$('#startRecord').addEventListener('click',startRecording);$('#stopRecord').addEventListener('click',stopRecording);$('#startTimer').addEventListener('click',startTimer);$('#resetTimer').addEventListener('click',resetTimer);
    $$('[data-save="true"]').forEach(el=>el.addEventListener('change',()=>persist(false)));
  }

  function init(){
    restore();initDate();renderVocab('services');initTabs();initTranslation();initTTS();renderQuiz('vocab','#vocabQuiz');renderQuiz('modal','#modalQuiz');renderOrder();renderEnough();renderQuiz('question','#questionQuiz');renderQuiz('listenA','#listenQuizA');renderQuiz('listenB','#listenQuizB');renderQuiz('reading','#readingQuiz');renderQuiz('cloe','#cloeQuiz');initWordCounts();initManual();bindControls();updateAllScores();
  }

  document.addEventListener('DOMContentLoaded',init);
})();
