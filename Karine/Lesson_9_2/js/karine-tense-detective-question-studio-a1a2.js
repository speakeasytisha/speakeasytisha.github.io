/* Karine's Tense Detective Salon Studio - no autoplay; touch-friendly and iOS-safe */
(() => {
  'use strict';
  const $ = (sel, root=document) => root.querySelector(sel);
  const norm = (v) => String(v || '').toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9 ?.,!'-]/g,'').replace(/\s+/g,' ').trim();

  function toggleFrench(){
    document.querySelectorAll('.fr-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const box = btn.parentElement.querySelector('.fr-box');
        if(!box) return;
        box.textContent = btn.dataset.fr || '';
        const isHidden = box.hidden;
        box.hidden = !isHidden;
        btn.textContent = isHidden ? '🇫🇷 Hide French help' : '🇫🇷 French help';
      });
    });
  }

  function speak(text){
    if(!('speechSynthesis' in window)) { alert('Audio is not available in this browser.'); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = $('#voiceChoice')?.value || 'en-GB';
    utter.rate = 0.88;
    const voices = window.speechSynthesis.getVoices();
    const exact = voices.find(v => v.lang === utter.lang) || voices.find(v => v.lang.startsWith(utter.lang.slice(0,2)));
    if(exact) utter.voice = exact;
    window.speechSynthesis.speak(utter);
  }
  function setupSpeech(){ document.querySelectorAll('[data-say]').forEach(btn => btn.addEventListener('click', ()=>speak(btn.dataset.say))); }

  const state = { answers: {}, scores: {} };
  const scoreDefs = {};
  function optionOrder(q, idx){
    const wrong = q.options.filter(o=>o!==q.answer);
    const pos = (q.position ?? idx) % 3;
    const copy = wrong.slice();
    copy.splice(pos,0,q.answer);
    return copy;
  }
  function updateScore(key){
    const el = $(`#${scoreDefs[key].scoreId}`);
    const answers = state.answers[key] || {};
    const total = scoreDefs[key].items.length;
    const correct = Object.values(answers).filter(Boolean).length;
    if(el) el.textContent = `Score: ${correct} / ${total}`;
  }
  function renderQuiz(key, target, scoreId, items){
    scoreDefs[key] = {items,scoreId}; state.answers[key] = {};
    const container = $(target); if(!container) return;
    container.innerHTML = '';
    items.forEach((q,idx) => {
      const card = document.createElement('article'); card.className='question-card'; card.dataset.questionKey = key+':'+idx;
      card.innerHTML = `<div><span class="q-num">${idx+1}</span><span class="prompt">${q.prompt}</span></div><div class="options"></div><div class="q-actions"><button class="mini hint-btn" type="button">💡 Hint</button></div><div class="hint">${q.hint}</div><div class="feedback"></div>`;
      const options = $('.options', card);
      optionOrder(q,idx).forEach(opt => {
        const b = document.createElement('button'); b.type='button'; b.className='option'; b.textContent=opt;
        b.addEventListener('click', () => {
          if(card.dataset.done === '1') return;
          const correct = opt === q.answer;
          card.dataset.done='1'; state.answers[key][idx]=correct;
          [...options.children].forEach(o=>{o.disabled=true; if(o.textContent===q.answer) o.classList.add('correct');});
          if(!correct) b.classList.add('wrong');
          const feedback = $('.feedback',card); feedback.className='feedback show '+(correct?'good':'bad');
          feedback.innerHTML = correct ? `✓ Correct. ${q.explain || ''}` : `✗ Not this time. <strong>Correct answer:</strong> ${q.answer}. ${q.explain || ''}`;
          updateScore(key);
        });
        options.appendChild(b);
      });
      $('.hint-btn',card).addEventListener('click',()=>$('.hint',card).classList.toggle('show'));
      container.appendChild(card);
    });
    updateScore(key);
  }

  const clueQuiz = [
    {prompt:'I usually study English in the morning. Which tense?', options:['Present continuous','Past simple','Present simple'], answer:'Present simple',position:2,hint:'Look at “usually”. It shows a habit.',explain:'“Usually” = routine → present simple.'},
    {prompt:'Look! The customer ___ for her appointment. Which form?', options:['waits','is waiting','waited'], answer:'is waiting',position:1,hint:'“Look!” shows an action happening now.',explain:'Action now → is + verb-ing.'},
    {prompt:'We went to a restaurant last weekend. Which tense?', options:['Past simple','Present simple','Future with will'], answer:'Past simple',position:0,hint:'“Last weekend” is a finished past time.',explain:'Finished past time → past simple.'},
    {prompt:'I’m going to visit my daughter next month. What does this express?', options:['A past habit','A plan / intention','An action now'], answer:'A plan / intention',position:1,hint:'“Going to” often expresses a plan.',explain:'Going to = plan or intention.'},
    {prompt:'The salon is meeting a supplier at 10 a.m. tomorrow. Why present continuous?', options:['It is a fixed arrangement','It is a routine','It is a completed past action'], answer:'It is a fixed arrangement',position:2,hint:'There is a future day/time: “tomorrow at 10 a.m.”',explain:'Present continuous can describe a planned arrangement.'},
    {prompt:'I’ll check the booking for you. Why use will?', options:['A quick offer','A routine','A past action'], answer:'A quick offer',position:0,hint:'The speaker decides at the moment of speaking.',explain:'Will is useful for an offer or immediate decision.'}
  ];
  const presentSimpleQuiz = [
    {prompt:'My husband ___ the day off on Mondays.',options:['have','has','is having'],answer:'has',position:1,hint:'He / she / it → usually add -s.',explain:'My husband = he → has.'},
    {prompt:'___ you usually go for a walk on Mondays?',options:['Are','Did','Do'],answer:'Do',position:2,hint:'“Usually” = present simple question.',explain:'Present simple question → Do + subject + base verb.'},
    {prompt:'She ___ in a salon.',options:['works','is work','worked'],answer:'works',position:0,hint:'This is her regular job.',explain:'Regular job/fact → present simple; she works.'},
    {prompt:'I ___ coffee at a café after our walk.',options:['have','am having','had'],answer:'have',position:1,hint:'It is part of a regular Monday routine.',explain:'Routine → present simple.'}
  ];
  const presentContinuousQuiz = [
    {prompt:'I ___ my English lesson at the moment.',options:['study','studied','am studying'],answer:'am studying',position:2,hint:'“At the moment” = now.',explain:'I + am + verb-ing.'},
    {prompt:'___ she waiting for the customer now?',options:['Does','Is','Did'],answer:'Is',position:1,hint:'Question with verb-ing needs am/is/are.',explain:'Is she waiting...?'},
    {prompt:'We ___ friends on Saturday at 7 p.m.',options:['are meeting','meet','met'],answer:'are meeting',position:0,hint:'It is an arranged future plan with a day and time.',explain:'Present continuous can describe a fixed future arrangement.'},
    {prompt:'They ___ the swimming pool today.',options:['clean','are cleaning','cleaned'],answer:'are cleaning',position:1,hint:'“Today” can describe a temporary action in progress.',explain:'They are cleaning it today.'}
  ];
  const pastSimpleQuiz = [
    {prompt:'Last week, I ___ apricot jam.',options:['make','made','am making'],answer:'made',position:1,hint:'“Last week” = finished past.',explain:'Make → made in the past.'},
    {prompt:'___ you go to Les Sables-d’Olonne yesterday?',options:['Did','Do','Are'],answer:'Did',position:0,hint:'Past question = Did + base verb.',explain:'Did you go...? Not “Did you went?”'},
    {prompt:'We ___ home in the evening.',options:['come','came','are coming'],answer:'came',position:2,hint:'The action finished last weekend.',explain:'Come → came in the past.'},
    {prompt:'She ___ the house because it was very hot.',options:['cleaned','cleans','is cleaning'],answer:'cleaned',position:0,hint:'A finished action in a past story.',explain:'Past simple regular verb: cleaned.'}
  ];
  const futureQuiz = [
    {prompt:'I have a plan. I ___ visit my daughter next month.',options:['will','am going to','visited'],answer:'am going to',position:1,hint:'It is a plan already in your mind.',explain:'Going to = intention or plan.'},
    {prompt:'The phone is ringing. I ___ answer it.',options:['am going to','am answering','will'],answer:'will',position:2,hint:'This is a decision now.',explain:'Will = quick decision.'},
    {prompt:'We ___ at the salon on Tuesday at 3 p.m.',options:['are meeting','will meet','met'],answer:'are meeting',position:0,hint:'A confirmed arrangement with a day and time.',explain:'Present continuous is common for arrangements.'},
    {prompt:'I think it ___ be hot tomorrow.',options:['is going to','will','was'],answer:'will',position:1,hint:'“I think” often introduces a prediction.',explain:'Will = prediction/opinion about the future.'},
    {prompt:'___ you going to travel this summer?',options:['Are','Do','Did'],answer:'Are',position:0,hint:'Question with going to needs am/is/are.',explain:'Are you going to travel...?'},
    {prompt:'The customer has decided. She ___ try a shorter hairstyle.',options:['is going to','went to','does'],answer:'is going to',position:2,hint:'She has an intention.',explain:'Going to = plan / intention.'}
  ];
  const modalQuiz = [
    {prompt:'You ___ bring your appointment card, please.',options:['should','shoulds','should to'],answer:'should',position:1,hint:'Modal + base verb.',explain:'After should, use bring (not brings / to bring).'},
    {prompt:'___ you repeat that, please?',options:['Could','Could to','Coulds'],answer:'Could',position:0,hint:'Polite request = Could + subject + base verb.',explain:'Could you repeat...?'},
    {prompt:'Customers ___ arrive on time for their appointment.',options:['must','must to','musts'],answer:'must',position:2,hint:'Obligation = must + base verb.',explain:'Must arrive.'},
    {prompt:'I ___ check the booking for you.',options:['can','can to','cans'],answer:'can',position:0,hint:'Ability / possibility = can + base verb.',explain:'Can check.'}
  ];
  const fullTestQuiz = [
    {prompt:'Every evening, I ___ my English notes.',options:['review','am reviewing','reviewed'],answer:'review',position:0,hint:'“Every evening” = routine.',explain:'Present simple: I review.'},
    {prompt:'My daughter ___ in Paris.',options:['live','lives','is live'],answer:'lives',position:1,hint:'A fact about her life; she = third person singular.',explain:'She lives in Paris.'},
    {prompt:'What ___ you usually do after lunch?',options:['are','do','did'],answer:'do',position:2,hint:'“Usually” = present simple.',explain:'What do you usually do...?'},
    {prompt:'At the moment, the hairdresser ___ a customer.',options:['helps','is helping','helped'],answer:'is helping',position:1,hint:'“At the moment” = now.',explain:'Present continuous: is helping.'},
    {prompt:'___ they cleaning the salon now?',options:['Do','Are','Did'],answer:'Are',position:1,hint:'Action now → are + -ing.',explain:'Are they cleaning...?'},
    {prompt:'Yesterday, we ___ for a walk on the beach.',options:['go','went','are going'],answer:'went',position:0,hint:'Yesterday = finished past.',explain:'Go → went.'},
    {prompt:'Did she ___ a book last week?',options:['read','reads','reading'],answer:'read',position:2,hint:'After Did, use the base verb.',explain:'Did she read...?'},
    {prompt:'Last weekend, I ___ at a friend’s house.',options:['ate','eat','am eating'],answer:'ate',position:0,hint:'Past of eat = ate.',explain:'I ate at a friend’s house.'},
    {prompt:'I ___ call the customer later; I have already decided.',options:['am going to','will','called'],answer:'am going to',position:1,hint:'The plan exists before you speak.',explain:'Going to = existing intention.'},
    {prompt:'I’ll get the towels. What does “I’ll” show?',options:['A past story','An offer / decision now','A routine'],answer:'An offer / decision now',position:2,hint:'The speaker decides in the moment.',explain:'Will = offer / quick decision.'},
    {prompt:'We ___ our friends at the café on Friday at 4 p.m.',options:['meet','are meeting','met'],answer:'are meeting',position:1,hint:'Day + time = arranged future plan.',explain:'Present continuous arrangement.'},
    {prompt:'___ you going to work tomorrow?',options:['Are','Do','Did'],answer:'Are',position:0,hint:'Going to question → Are you...? ',explain:'Are you going to work...?'},
    {prompt:'Could you ___ your name, please?',options:['spell','spells','to spell'],answer:'spell',position:1,hint:'Could + base verb.',explain:'Could you spell...?'},
    {prompt:'You should ___ this product for dry hair.',options:['use','uses','to use'],answer:'use',position:2,hint:'Should + base verb.',explain:'You should use...'},
    {prompt:'Which sentence is correct?',options:['Does she works on Mondays?','Does she work on Mondays?','Is she work on Mondays?'],answer:'Does she work on Mondays?',position:0,hint:'Does + base verb, not works.',explain:'Does she work...?'},
    {prompt:'Which answer matches: “What did you do last weekend?”',options:['I go to the beach.','I went to the beach.','I am going to the beach.'],answer:'I went to the beach.',position:1,hint:'The question says did + last weekend.',explain:'Answer in past simple.'}
  ];
  const questionMatchQuiz = [
    {prompt:'Answer: “I usually prepare lunch after my lesson.” Which question?',options:['What do you usually do after your lesson?','What are you doing after your lesson?','What did you do after your lesson?'],answer:'What do you usually do after your lesson?',position:2,hint:'“Usually” in the answer = present simple.',explain:'Use Do + subject + base verb.'},
    {prompt:'Answer: “I am cleaning the swimming pool now.” Which question?',options:['What do you clean now?','What are you cleaning now?','What did you clean now?'],answer:'What are you cleaning now?',position:1,hint:'“Now” + am cleaning = present continuous.',explain:'Are + subject + verb-ing.'},
    {prompt:'Answer: “We went to Bretignolles-sur-Mer last weekend.” Which question?',options:['Where did you go last weekend?','Where do you go last weekend?','Where are you going last weekend?'],answer:'Where did you go last weekend?',position:0,hint:'“Last weekend” = past simple.',explain:'Did + base verb go.'},
    {prompt:'Answer: “I am going to visit my daughter next month.” Which question?',options:['What are you going to do next month?','What did you do next month?','What do you usually do next month?'],answer:'What are you going to do next month?',position:2,hint:'“Going to” in the answer = plan.',explain:'Are you going to...?'}
  ];
  const questionErrorQuiz = [
    {prompt:'Choose the correct question.',options:['Where did you went last weekend?','Where do you went last weekend?','Where did you go last weekend?'],answer:'Where did you go last weekend?',position:2,hint:'Did + base verb.',explain:'Use go after did.'},
    {prompt:'Choose the correct question.',options:['What are you doing now?','What do you doing now?','What are you do now?'],answer:'What are you doing now?',position:0,hint:'Present continuous = are + verb-ing.',explain:'Are you doing...?'},
    {prompt:'Choose the correct question.',options:['Does she works on Mondays?','Does she work on Mondays?','Is she work on Mondays?'],answer:'Does she work on Mondays?',position:1,hint:'Does + base verb.',explain:'Does she work...?'},
    {prompt:'Choose the correct question.',options:['Are you going to visit Paris?','Do you going to visit Paris?','Did you going to visit Paris?'],answer:'Are you going to visit Paris?',position:0,hint:'Going to needs am/is/are.',explain:'Are you going to...?'}
  ];
  const answerQuiz = [
    {prompt:'Question: “Do you usually go to the beach on Mondays?”',options:['Yes, I do. We often go for a walk there.','Yes, I am.','Yes, I went.'],answer:'Yes, I do. We often go for a walk there.',position:0,hint:'Do question → Yes, I do / No, I don’t.',explain:'Present simple answer + extra detail.'},
    {prompt:'Question: “Are you studying English now?”',options:['Yes, I study English now.','Yes, I am. I am reviewing my lesson.','Yes, I did.'],answer:'Yes, I am. I am reviewing my lesson.',position:1,hint:'Are question → Yes, I am / No, I’m not.',explain:'Present continuous in question and answer.'},
    {prompt:'Question: “What did you do last weekend?”',options:['I went to a restaurant with friends.','I go to a restaurant with friends.','I am going to a restaurant with friends.'],answer:'I went to a restaurant with friends.',position:2,hint:'Did / last weekend = past simple.',explain:'Went is the past of go.'},
    {prompt:'Question: “What are you going to do tomorrow?”',options:['I went to the salon.','I am going to review my notes.','I review my notes every day.'],answer:'I am going to review my notes.',position:1,hint:'Going to question → answer with going to.',explain:'Plan for tomorrow.'},
    {prompt:'Question: “Will you check the appointment?”',options:['Yes, I will.','Yes, I do.','Yes, I am going.'],answer:'Yes, I will.',position:0,hint:'Will question → Yes, I will / No, I won’t.',explain:'Repeat will in a short answer.'},
    {prompt:'Question: “Could you repeat that, please?”',options:['Yes, I can.','Yes, I coulds.','Yes, I repeat.'],answer:'Yes, I can.',position:2,hint:'Could asks politely. The short positive answer is often “Yes, I can.”',explain:'Can is natural in the answer.'}
  ];

  const builders = [
    {prompt:'Answer: “I usually study English in the evening.” Build the question.',tokens:['do','what','you','usually','do','in','the','evening','?'],answer:'what do you usually do in the evening ?',hint:'Routine → What + do + you + base verb...?'},
    {prompt:'Answer: “I am cleaning the swimming pool now.” Build the question.',tokens:['are','what','you','cleaning','now','?'],answer:'what are you cleaning now ?',hint:'Now → What + are + you + verb-ing...?'},
    {prompt:'Answer: “We went to Givrand last weekend.” Build the question.',tokens:['where','did','you','go','last','weekend','?'],answer:'where did you go last weekend ?',hint:'Past → Where + did + you + base verb...?'},
    {prompt:'Answer: “I am going to visit my daughter next month.” Build the question.',tokens:['what','are','you','going','to','do','next','month','?'],answer:'what are you going to do next month ?',hint:'Plan → What + are + you + going to + base verb...?'}
  ];
  const written = [
    {label:'Question: What do you usually do on Mondays?',model:'On Mondays, my husband has the day off, so we often go for a walk on the beach. Then, we have a coffee at a café.',hint:'Use present simple + a sequence word: Then / After that / Finally.'},
    {label:'Question: What are you doing this week?',model:'This week, I am reviewing my English lessons and practising my speaking.',hint:'Use am/is/are + verb-ing.'},
    {label:'Question: What did you do last weekend?',model:'Last weekend, I cycled to Bretignolles-sur-Mer and ate at a restaurant on the beach.',hint:'Use past simple and a past time expression.'},
    {label:'Question: What are you going to do next weekend?',model:'Next weekend, I am going to relax, see my family and practise English.',hint:'Use am/is/are going to + base verb.'}
  ];
  const oralCards = [
    {title:'Routine question',prompt:'Ask Tisha about a regular habit.',hint:'Use “What do you usually...?” or “Do you often...?”',model:'What do you usually do on Sundays? Then ask: Where do you usually go?'},
    {title:'Action now',prompt:'Ask Tisha what she is doing now or this week.',hint:'Use “What are you ...ing?”',model:'What are you doing this week? Then ask: Are you preparing a new lesson?'},
    {title:'Past question',prompt:'Ask Tisha about last weekend.',hint:'Use “What did you do...?” Remember: Did + base verb.',model:'What did you do last weekend? Then ask: Where did you go?'},
    {title:'Future plan',prompt:'Ask Tisha about a future intention.',hint:'Use “What are you going to do...?”',model:'What are you going to do next weekend? Then ask: Who are you going to see?'},
    {title:'Future arrangement',prompt:'Ask Tisha about a confirmed appointment.',hint:'Use present continuous with a date/time.',model:'Are you meeting a student this week? Then ask: What time are you meeting them?'},
    {title:'Helpful modal question',prompt:'Ask Tisha a polite professional question.',hint:'Use “Could you...?” or “Can you...?”',model:'Could you repeat that, please? Then ask: Could you spell the name, please?'}
  ];

  function renderBuilders(){
    const target = $('#questionBuilders'); if(!target) return;
    builders.forEach((b,i)=>{
      const card = document.createElement('article'); card.className='builder-card';
      card.innerHTML = `<p><strong>${i+1}. ${b.prompt}</strong></p><button type="button" class="mini b-hint">💡 Hint</button><div class="hint">${b.hint}</div><div class="build-zone" aria-live="polite"></div><div class="token-bank"></div><div class="q-actions"><button type="button" class="mini b-clear">Clear</button><button type="button" class="mini b-check">Check</button></div><p class="builder-feedback" aria-live="polite"></p>`;
      const zone = $('.build-zone',card), bank=$('.token-bank',card), feedback=$('.builder-feedback',card); let chosen=[];
      b.tokens.forEach((token,ti)=>{
        const btn=document.createElement('button'); btn.type='button';btn.className='token';btn.textContent=token;btn.dataset.idx=ti;
        btn.addEventListener('click',()=>{ if(btn.classList.contains('used'))return; chosen.push({token,ti});btn.classList.add('used');zone.textContent=chosen.map(x=>x.token).join(' ');});bank.appendChild(btn);
      });
      $('.b-hint',card).addEventListener('click',()=>$('.hint',card).classList.toggle('show'));
      $('.b-clear',card).addEventListener('click',()=>{chosen=[];zone.textContent='';feedback.textContent='';bank.querySelectorAll('.token').forEach(t=>t.classList.remove('used'));});
      $('.b-check',card).addEventListener('click',()=>{ const got=norm(chosen.map(x=>x.token).join(' '));const ans=norm(b.answer); if(got===ans){feedback.innerHTML='<span style="color:#08765a;font-weight:800">✓ Correct. Excellent question!</span>';}else{feedback.innerHTML=`<span style="color:#a41c44;font-weight:800">✗ Not yet.</span> Model: <strong>${b.answer.replace(' ?','?')}</strong>`;} });
      target.appendChild(card);
    });
  }
  function renderWritten(){
    const target=$('#writtenAnswers');if(!target)return;
    written.forEach((w,i)=>{
      const card=document.createElement('article');card.className='write-card';
      card.innerHTML=`<label for="write${i}">${i+1}. ${w.label}</label><textarea id="write${i}" placeholder="Write one complete answer..."></textarea><div class="q-actions"><button type="button" class="mini w-hint">💡 Hint</button><button type="button" class="mini w-check">Check my answer</button><button type="button" class="mini w-model">Show model</button></div><div class="hint">${w.hint}</div><p class="write-result" aria-live="polite"></p>`;
      $('.w-hint',card).addEventListener('click',()=>$('.hint',card).classList.toggle('show'));
      $('.w-check',card).addEventListener('click',()=>{const val=$('textarea',card).value.trim();const res=$('.write-result',card);if(!val){res.innerHTML='<span style="color:#a41c44">Please write an answer first.</span>';return;}const wc=val.split(/\s+/).length;res.innerHTML=`<span style="color:#08765a;font-weight:800">✓ Good attempt.</span> You wrote ${wc} word${wc===1?'':'s'}. Check that your answer uses the same tense as the question, then compare it with the model.`;});
      $('.w-model',card).addEventListener('click',()=>{$('.write-result',card).innerHTML=`<strong>Model answer:</strong> ${w.model}`;});
      target.appendChild(card);
    });
  }
  function renderOral(){
    const target=$('#oralCards');if(!target)return;
    oralCards.forEach((o,i)=>{
      const card=document.createElement('article'); card.className='oral-card';
      card.innerHTML=`<h3>${i+1}. ${o.title}</h3><p>${o.prompt}</p><div class="actions"><button class="mini o-hint" type="button">💡 Hint</button><button class="mini o-model" type="button">Show model</button><button class="mini o-listen" type="button">🔊 Hear model</button></div><div class="hint">${o.hint}</div><div class="model"><strong>Model:</strong> ${o.model}</div>`;
      $('.o-hint',card).addEventListener('click',()=>$('.hint',card).classList.toggle('show'));
      $('.o-model',card).addEventListener('click',()=>$('.model',card).classList.toggle('show'));
      $('.o-listen',card).addEventListener('click',()=>speak(o.model.replace('Model: ','')));
      target.appendChild(card);
    });
  }

  function setupTimer(){
    let remaining=15*60, interval=null; const el=$('#testTimer');
    const show=()=>{const m=Math.floor(remaining/60),s=remaining%60;el.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;};show();
    $('#startTestTimer').addEventListener('click',()=>{if(interval)return;interval=setInterval(()=>{if(remaining<=0){clearInterval(interval);interval=null;return;}remaining--;show();},1000)});
    $('#pauseTestTimer').addEventListener('click',()=>{clearInterval(interval);interval=null;});
    $('#resetTestTimer').addEventListener('click',()=>{clearInterval(interval);interval=null;remaining=15*60;show();});
  }
  function setupReview(){
    $('#reviewTenseTest').addEventListener('click',()=>{
      const box=$('#testReview'), items=fullTestQuiz, answers=state.answers.fullTest||{};
      const list=items.map((q,i)=>`<li><strong>${i+1}.</strong> ${q.prompt.replace(/<[^>]+>/g,'')}<br><span>${answers[i]?'✓ Correct':'↳ Model: '+q.answer}</span></li>`).join('');
      box.innerHTML=`<h3>Your tense-test review</h3><ul>${list}</ul>`;box.hidden=!box.hidden;
      $('#reviewTenseTest').textContent=box.hidden?'Show your answer review':'Hide your answer review';
    });
  }

  function storageOpen(){return new Promise((resolve,reject)=>{if(!('indexedDB' in window))return reject(new Error('IndexedDB unavailable'));const req=indexedDB.open('karineTenseDetectiveAudio',1);req.onupgradeneeded=()=>req.result.createObjectStore('audio');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
  async function saveAudio(blob){try{const db=await storageOpen();const tx=db.transaction('audio','readwrite');tx.objectStore('audio').put(blob,'latest');await new Promise((res,rej)=>{tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});db.close();}catch(e){console.warn(e);}}
  async function loadAudio(){try{const db=await storageOpen();const tx=db.transaction('audio','readonly');const req=tx.objectStore('audio').get('latest');const blob=await new Promise((res,rej)=>{req.onsuccess=()=>res(req.result);req.onerror=()=>rej(req.error)});db.close();return blob||null;}catch(e){return null;}}
  async function clearAudio(){try{const db=await storageOpen();const tx=db.transaction('audio','readwrite');tx.objectStore('audio').delete('latest');db.close();}catch(e){}}
  function setupRecorder(){
    const start=$('#startRecord'),stop=$('#stopRecord'),clear=$('#clearRecord'),status=$('#recordStatus'),player=$('#recordingPlayer'),file=$('#audioFile'); let recorder=null,chunks=[];
    const setBlob=async(blob,text)=>{ if(!blob)return; player.src=URL.createObjectURL(blob);player.hidden=false; status.textContent=text; await saveAudio(blob);};
    loadAudio().then(blob=>{if(blob){player.src=URL.createObjectURL(blob);player.hidden=false;status.textContent='A recording is saved in this browser on this device.';}});
    start.addEventListener('click',async()=>{try{if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){status.textContent='This browser does not support the in-page recorder. Please use Voice Memos.';return;}const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=async()=>{const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});await setBlob(blob,'Recording saved in this browser on this device.');stream.getTracks().forEach(t=>t.stop());};recorder.start();start.disabled=true;stop.disabled=false;status.textContent='Recording… speak clearly, then press Stop.';}catch(err){status.textContent='Microphone access was not available. Please use Voice Memos on your phone.';}});
    stop.addEventListener('click',()=>{if(recorder&&recorder.state!=='inactive')recorder.stop();start.disabled=false;stop.disabled=true;});
    clear.addEventListener('click',async()=>{await clearAudio();player.pause();player.removeAttribute('src');player.hidden=true;status.textContent='Saved recording cleared from this browser.';});
    file.addEventListener('change',()=>{const chosen=file.files?.[0];if(chosen){player.src=URL.createObjectURL(chosen);player.hidden=false;status.textContent='Selected audio file ready to play in this session.';}});
  }

  document.addEventListener('DOMContentLoaded',()=>{
    toggleFrench();setupSpeech();
    renderQuiz('clue','#clueQuiz','clueScore',clueQuiz);
    renderQuiz('presentSimple','#presentSimpleQuiz','presentSimpleScore',presentSimpleQuiz);
    renderQuiz('presentContinuous','#presentContinuousQuiz','presentContinuousScore',presentContinuousQuiz);
    renderQuiz('pastSimple','#pastSimpleQuiz','pastSimpleScore',pastSimpleQuiz);
    renderQuiz('future','#futureQuiz','futureScore',futureQuiz);
    renderQuiz('modal','#modalQuiz','modalScore',modalQuiz);
    renderQuiz('fullTest','#fullTestQuiz','fullTestScore',fullTestQuiz);
    renderQuiz('questionMatch','#questionMatchQuiz','questionMatchScore',questionMatchQuiz);
    renderQuiz('questionError','#questionErrorQuiz','questionErrorScore',questionErrorQuiz);
    renderQuiz('answer','#answerQuiz','answerScore',answerQuiz);
    renderBuilders();renderWritten();renderOral();setupTimer();setupReview();setupRecorder();
  });
})();
