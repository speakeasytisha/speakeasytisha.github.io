(() => {
  'use strict';
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => [...el.querySelectorAll(s)];
  const storageKey = 'sylvain_culinary_journey_v1';
  const state = {answers:{}, selfCheck:{}, builder:'', french:false};

  const stories = {
    start:{num:'01 · FOUNDATION',title:'A professional beginning in Savoie',body:'Sylvain began his career near Lake Aiguebelette, where he trained with Christophe Rochard at Le Chalet du Lac and completed his professional qualification. This is the foundation of a career rooted in Savoie, precise technique and quality ingredients.',model:'I began my career near Lake Aiguebelette, where I completed my professional training.'},
    ducasse:{num:'02 · HIGH GASTRONOMY',title:'From Paris to Provence and Monaco',body:'At 18, he joined Alain Ducasse’s prestigious culinary world. His route included the Plaza Athénée in Paris, the Abbaye de la Celle in Provence and Le Louis XV in Monaco. The website describes seven formative years in this high-gastronomy environment.',model:'At 18, I joined a prestigious culinary brigade and developed my experience in Paris, Provence and Monaco.'},
    geneva:{num:'03 · LEADERSHIP',title:'Leading a kitchen in Geneva',body:'After those formative years, Sylvain led the kitchen of the Hotel Le Richemond in Geneva, a luxury hotel. This chapter gives him powerful language for responsibility, leadership and service standards.',model:'After several years in high gastronomy, I led the kitchen of a luxury hotel in Geneva.'},
    savoie:{num:'04 · RETURN & BUILD',title:'Back to Savoie: creating a multi-business story',body:'Sylvain later returned to Savoie and took on Le Bistrot in Chambéry. Since 2016, Carla and Sylvain have welcomed guests there. Their current world also includes the seasonal restaurant L’Éphémère and ENJOY, an inflight-catering activity.',model:'Later, I returned to Savoie, where my wife and I developed restaurant and catering activities.'}
  };

  const quizzes = {
    past:[
      {q:'Choose the correct sentence about a completed career step.',a:['At 18, I join a prestigious culinary brigade.','At 18, I joined a prestigious culinary brigade.','At 18, I did joined a prestigious culinary brigade.'],correct:1,note:'At 18 is a finished past time. Use joined, the past form.'},
      {q:'Choose the correct negative sentence.',a:['I did not led the kitchen in Geneva.','I did not lead the kitchen in Geneva.','I not lead the kitchen in Geneva.'],correct:1,note:'After did not / didn’t, use the base verb: lead.'},
      {q:'Choose the correct question.',a:['Where did you worked before you returned to Savoie?','Where you did work before you returned to Savoie?','Where did you work before you returned to Savoie?'],correct:2,note:'Question: question word + did + subject + base verb.'}
    ],
    now:[
      {q:'Today, we ___ three complementary activities.',a:['run','are running','runs'],correct:0,note:'This describes a regular business fact. Use the present simple: run.'},
      {q:'At the moment, we ___ our relocation plans.',a:['review','are reviewing','reviews'],correct:1,note:'At the moment shows a current temporary activity: are reviewing.'},
      {q:'L’Éphémère ___ from May to September.',a:['is operating','operate','operates'],correct:2,note:'A regular seasonal fact: L’Éphémère operates.'}
    ],
    future:[
      {q:'This is a plan: “We ___ to Lisbon in August.”',a:['are going to move','will moving','are move'],correct:0,note:'Plan/intention: be going to + base verb.'},
      {q:'This is an arranged meeting: “I ___ an airline contact next Tuesday.”',a:['will meet','am meeting','meet'],correct:1,note:'An arranged appointment: present continuous.'},
      {q:'This is an official time: “The flight ___ at 07:45.”',a:['is leaving','will leave','leaves'],correct:2,note:'Timetables and schedules use the present simple: leaves.'}
    ],
    vtest:[
      {q:'Where did Sylvain lead a luxury-hotel kitchen?',a:['In Chambéry','In Geneva','In Lisbon'],correct:1,note:'The text says he later led the kitchen of a luxury hotel in Geneva.'},
      {q:'Which activity is seasonal?',a:['Le Bistrot','L’Éphémère','ENJOY'],correct:1,note:'L’Éphémère operates seasonally from May to September.'},
      {q:'What is the family’s next planned move?',a:['Lisbon','Monaco','Paris'],correct:0,note:'Their next planned move is to Lisbon.'}
    ]
  };

  function toast(message){const t=$('#toast'); t.textContent=message;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2600)}
  function speak(text, rate=.9){ if(!('speechSynthesis' in window)){toast('Speech is not available in this browser.');return;} speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.lang='en-GB';u.rate=rate;const voices=speechSynthesis.getVoices();const v=voices.find(x=>/^en-GB/i.test(x.lang))||voices.find(x=>/^en-US/i.test(x.lang));if(v)u.voice=v;speechSynthesis.speak(u);}
  function makeQuestions(type,target,status){const holder=$('#'+target);holder.innerHTML='';quizzes[type].forEach((item,i)=>{const card=document.createElement('article');card.className='question-card';card.innerHTML=`<p>${i+1}. ${item.q}</p><div class="options"></div><p class="answer-feedback" aria-live="polite"></p>`;const opts=$('.options',card);const shuffled=item.a.map((text,index)=>({text,index})).sort(()=>Math.random()-.5);shuffled.forEach(opt=>{const b=document.createElement('button');b.type='button';b.className='option-button';b.textContent=opt.text;b.addEventListener('click',()=>answer(type,i,opt.index,b,card,item));opts.appendChild(b)});holder.appendChild(card)});updateScore(type,status)}
  function answer(type,q,choice,button,card,item){if(state.answers[type]?.[q]!==undefined)return;state.answers[type]??={};state.answers[type][q]=choice;$$('.option-button',card).forEach(b=>b.disabled=true);const good=choice===item.correct;button.classList.add(good?'correct':'wrong');if(!good){$$('.option-button',card).find(b=>b.textContent===item.a[item.correct])?.classList.add('correct')}$('.answer-feedback',card).textContent=(good?'✓ Correct. ':'Not quite. ')+item.note;updateScore(type,type+'Score');saveState()}
  function updateScore(type,status){const el=$('#'+status);if(!el)return;const done=Object.keys(state.answers[type]||{}).length;const correct=Object.values(state.answers[type]||{}).filter((v,i)=>v===quizzes[type][i]?.correct).length;el.textContent=done?`Score: ${correct}/${quizzes[type].length}. ${done<quizzes[type].length?'Continue to complete the practice.':'Well done — review the notes, then say the model aloud.'}`:''}
  function renderStory(key){const s=stories[key];$('#storyPanel').innerHTML=`<p class="story-number">${s.num}</p><h3>${s.title}</h3><p>${s.body}</p><p class="model-line">“${s.model}”</p><button class="speak-button" type="button" data-say="${s.model}">🔊 Listen</button>`;$('.speak-button',$('#storyPanel')).addEventListener('click',e=>speak(e.currentTarget.dataset.say))}
  function normalizeStory(parts){return parts.join(' ').replace(/\s+/g,' ').trim()}
  function buildStory(){const past=$$('input[name="past"]:checked').map(x=>x.value);const now=$$('input[name="now"]:checked').map(x=>x.value);const future=$('input[name="futureChoice"]:checked')?.value||'';const parts=[]; if(past.length)parts.push(past.join(' ')); if(now.length)parts.push(now.join(' ')); if(future)parts.push(future); const output=parts.length?normalizeStory(parts):'Select at least one part of your past or present story, then build it again.';$('#storyOutput').textContent=output;state.builder=output;saveState();toast('Your professional story is ready.')}
  function clearStory(){ $$('input[name="past"], input[name="now"]').forEach(x=>x.checked=false);const first=$('input[name="futureChoice"]');if(first)first.checked=true;$('#storyOutput').textContent='Select the parts of your journey, then build your professional story.';state.builder='';saveState(); }
  async function copyText(text){try{await navigator.clipboard.writeText(text);toast('Copied to clipboard.')}catch{toast('Copy is not available in this browser.')}}
  function downloadText(name,content){const b=new Blob([content],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.click();URL.revokeObjectURL(a.href)}
  function collectNotes(){return `SYLVAIN BAILLY — MY CULINARY JOURNEY\n\n${state.builder||$('#storyOutput').textContent}\n\nSELF-CHECK\n${$$('.self-check input').map((x,i)=>`${x.checked?'[x]':'[ ]'} ${x.parentElement.textContent.trim()}`).join('\n')}\n\nProgress saved locally in this browser.`}
  function saveState(){localStorage.setItem(storageKey,JSON.stringify(state))}
  function loadState(){try{const saved=JSON.parse(localStorage.getItem(storageKey));if(saved&&typeof saved==='object'){Object.assign(state,saved);if(state.builder)$('#storyOutput').textContent=state.builder;if(state.french){document.body.classList.add('show-french');$('#frenchToggle').setAttribute('aria-pressed','true');$('#frenchToggle').textContent='FR help on'}$$('.self-check input').forEach((x,i)=>x.checked=!!state.selfCheck[i])}}catch{}}
  function initTimer(){let left=60,interval=null;const read=$('#timerReadout'),btn=$('.timer-button');function show(){read.textContent=`00:${String(left).padStart(2,'0')}`}show();btn.addEventListener('click',()=>{if(interval){clearInterval(interval);interval=null;btn.classList.remove('active');btn.textContent='Resume 60 sec';return} if(left===0)left=60;btn.classList.add('active');btn.textContent='Pause';interval=setInterval(()=>{left--;show();if(left<=0){clearInterval(interval);interval=null;btn.classList.remove('active');btn.textContent='Start again';toast('Time! Great job.')}},1000)})}
  function init(){
    renderStory('start');
    $$('.timeline-step').forEach(btn=>btn.addEventListener('click',()=>{$$('.timeline-step').forEach(x=>x.classList.remove('active'));btn.classList.add('active');renderStory(btn.dataset.story)}));
    makeQuestions('past','pastQuestions','pastScore');makeQuestions('now','nowQuestions','nowScore');makeQuestions('future','futureQuestions','futureScore');makeQuestions('vtest','vtestQuestions','vtestScore');
    $$('.hint-button').forEach(b=>b.addEventListener('click',()=>{const h=$('#'+b.dataset.hint);h.hidden=!h.hidden;b.textContent=h.hidden?'Hint':'Hide hint'}));
    $$('.speak-button').forEach(b=>{if(b.id!=='speakStory')b.addEventListener('click',()=>speak(b.dataset.say))});
    $('#frenchToggle').addEventListener('click',()=>{document.body.classList.toggle('show-french');state.french=document.body.classList.contains('show-french');$('#frenchToggle').setAttribute('aria-pressed',String(state.french));$('#frenchToggle').textContent=state.french?'FR help on':'FR help';saveState()});
    $('#saveButton').addEventListener('click',()=>{saveState();toast('Progress saved in this browser.')});
    $('#buildStory').addEventListener('click',buildStory);$('#clearStory').addEventListener('click',clearStory);$('#speakStory').addEventListener('click',()=>speak($('#storyOutput').textContent));$('#copyStory').addEventListener('click',()=>copyText($('#storyOutput').textContent));$('#downloadStory').addEventListener('click',()=>downloadText('sylvain-professional-story.txt',$('#storyOutput').textContent));
    $$('.level-tab').forEach(t=>t.addEventListener('click',()=>{$$('.level-tab').forEach(x=>x.classList.remove('active'));$$('.level-panel').forEach(x=>x.classList.remove('active'));t.classList.add('active');$(`[data-level-panel="${t.dataset.level}"]`).classList.add('active')}));
    $$('.self-check input').forEach((x,i)=>x.addEventListener('change',()=>{state.selfCheck[i]=x.checked;saveState()}));$('#downloadNotes').addEventListener('click',()=>downloadText('sylvain-culinary-journey-notes.txt',collectNotes()));
    initTimer();loadState();
    ['past','now','future','vtest'].forEach(type=>updateScore(type,type+'Score'));
  }
  document.addEventListener('DOMContentLoaded',init);
})();
