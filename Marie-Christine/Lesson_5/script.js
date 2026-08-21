(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const norm=s=>String(s??'').replace(/[’]/g,"'").replace(/\s+/g,' ').trim().toLowerCase();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
  const store={get:k=>{try{return localStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{localStorage.setItem(k,v);return true}catch{return false}}};
  function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2200)}
  function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},600)}
  function downloadText(text,name){downloadBlob(new Blob([text],{type:'text/plain;charset=utf-8'}),name)}
  async function copyText(text){try{await navigator.clipboard.writeText(text);return true}catch{return false}}

  // UI controls
  const translation=$('#translationToggle'); translation?.addEventListener('change',()=>document.body.classList.toggle('hide-fr',!translation.checked));
  let fontIndex=1; const fontClasses=['font-small','','font-large','font-xlarge'];
  $$('[data-font]').forEach(btn=>btn.addEventListener('click',()=>{if(btn.dataset.font==='minus')fontIndex=Math.max(0,fontIndex-1);if(btn.dataset.font==='plus')fontIndex=Math.min(3,fontIndex+1);if(btn.dataset.font==='reset')fontIndex=1;document.body.classList.remove('font-small','font-large','font-xlarge');if(fontClasses[fontIndex])document.body.classList.add(fontClasses[fontIndex]);}));
  $('#printBtn')?.addEventListener('click',()=>window.print());

  // Speech
  const Speech={lang:'en-GB',rate:.88,voices:[],load(){this.voices=speechSynthesis?.getVoices?.()||[]},pick(){return this.voices.find(v=>(v.lang||'').toLowerCase()===this.lang.toLowerCase())||this.voices.find(v=>(v.lang||'').toLowerCase().startsWith(this.lang.slice(0,2).toLowerCase()))||null},say(text){if(!text)return;if(!('speechSynthesis'in window))return toast('Speech is not supported in this browser.');speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);this.load();const v=this.pick();if(v)u.voice=v;u.lang=this.lang;u.rate=this.rate;speechSynthesis.speak(u)}};
  if('speechSynthesis'in window)speechSynthesis.onvoiceschanged=()=>Speech.load();
  $('#accentSelect')?.addEventListener('change',e=>Speech.lang=e.target.value); $('#speedSelect')?.addEventListener('change',e=>Speech.rate=Number(e.target.value));
  document.addEventListener('click',e=>{const b=e.target.closest('.speak-btn');if(!b)return;if(b.dataset.speakTarget){const el=document.getElementById(b.dataset.speakTarget);Speech.say(el?.value||el?.innerText||'')}else Speech.say(b.dataset.speak||'')});

  // preference
  $$('.preference-buttons button').forEach(btn=>btn.addEventListener('click',()=>{$$('.preference-buttons button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');$('#preferenceModel').innerHTML=`Try: <strong>I’m particularly looking forward to ${esc(btn.dataset.pref)} because…</strong>`;}));

  // Vocabulary data
  const vocab={
    compare:[
      {i:'⚖️',w:'similar',fr:'similaire',pos:'adjective',d:'almost the same, but not exactly identical',e:'The two trips are similar in length, but the atmosphere will be different.'},
      {i:'↔️',w:'different',fr:'différent(e)',pos:'adjective',d:'not the same as another person or thing',e:'Ireland and Italy will offer very different experiences.'},
      {i:'🌟',w:'memorable',fr:'mémorable',pos:'adjective',d:'special enough to be remembered for a long time',e:'I hope every trip will be memorable for a different reason.'},
      {i:'🧘',w:'relaxing',fr:'reposant(e)',pos:'adjective',d:'helping you feel calm and less tired',e:'A short coastal break can be more relaxing than a busy city visit.'},
      {i:'🎭',w:'lively',fr:'animé(e)',pos:'adjective',d:'full of activity, energy or people',e:'A city centre may be livelier than a quiet village.'},
      {i:'🧩',w:'convenient',fr:'pratique',pos:'adjective',d:'easy and suitable for your situation',e:'A direct train is more convenient than several connections.'}
    ],
    verbs:[
      {i:'📅',w:'book',fr:'réserver',pos:'verb',d:'to arrange and reserve something in advance',e:'I usually book my accommodation before I travel.'},
      {i:'🧳',w:'pack',fr:'faire sa valise',pos:'verb',d:'to put clothes and other things into a bag or suitcase',e:'I pack warmer clothes when I expect cooler weather.'},
      {i:'🚆',w:'leave',fr:'partir / quitter',pos:'verb',d:'to go away from a place',e:'The train leaves early in the morning.'},
      {i:'📍',w:'arrive',fr:'arriver',pos:'verb',d:'to reach a place at the end of a journey',e:'We are going to arrive in the afternoon.'},
      {i:'🗺️',w:'explore',fr:'explorer / découvrir',pos:'verb',d:'to travel around a place in order to discover it',e:'I would like to explore the countryside in Ireland.'},
      {i:'🍽️',w:'try',fr:'essayer / goûter',pos:'verb',d:'to experience, use or taste something to see what it is like',e:'I want to try some local dishes in Italy.'}
    ],
    experience:[
      {i:'🌄',w:'scenery',fr:'paysage / décor',pos:'noun',d:'the natural features and views of a place',e:'I am looking forward to seeing the scenery in Ireland.'},
      {i:'🎨',w:'atmosphere',fr:'ambiance',pos:'noun',d:'the feeling or mood of a place',e:'The winter atmosphere in Alsace may be very festive.'},
      {i:'🏛️',w:'heritage',fr:'patrimoine',pos:'noun',d:'history, traditions and important cultural features passed down over time',e:'I enjoy discovering the heritage of the places I visit.'},
      {i:'🥾',w:'walking route',fr:'itinéraire de randonnée',pos:'noun phrase',d:'a planned path or route for walking',e:'A shorter walking route may be better if the weather changes.'},
      {i:'🛍️',w:'local product',fr:'produit local',pos:'noun phrase',d:'something made or produced in the area you are visiting',e:'I like discovering local products when I travel.'},
      {i:'📸',w:'viewpoint',fr:'point de vue / belvédère',pos:'noun',d:'a place where you can see a wide or beautiful view',e:'We may stop at a viewpoint to take photos.'}
    ],
    weather:[
      {i:'🌧️',w:'changeable',fr:'changeant(e)',pos:'adjective',d:'likely to change often, especially when talking about weather',e:'If the weather is changeable, I will take a waterproof jacket.'},
      {i:'💨',w:'windy',fr:'venteux / venteuse',pos:'adjective',d:'with a lot of wind',e:'A coastal destination can feel windier than an inland town.'},
      {i:'🍂',w:'autumnal',fr:'automnal(e)',pos:'adjective',d:'typical of autumn in colour, weather or atmosphere',e:'The November trip may have a very autumnal atmosphere.'},
      {i:'❄️',w:'wintry',fr:'hivernal(e)',pos:'adjective',d:'typical of winter, often cold or snowy',e:'Alsace may feel more wintry in December.'},
      {i:'☁️',w:'mild',fr:'doux / douce',pos:'adjective',d:'not very hot and not very cold',e:'Mild weather can make sightseeing more comfortable.'},
      {i:'🧥',w:'layer',fr:'couche de vêtement',pos:'noun',d:'one item of clothing worn over or under another',e:'I prefer to wear several layers when the temperature changes.'}
    ]
  };
  let currentCat='compare';
  function renderVocab(){const arr=vocab[currentCat];$('#vocabGrid').innerHTML=arr.map(v=>`<article class="vocab-card" data-cat="${currentCat}"><div class="vocab-card-top"><div class="vocab-icon">${v.i}</div><div><div class="vocab-word">${esc(v.w)}</div><div class="vocab-pos">${esc(v.pos)}</div></div></div><span class="vocab-fr">${esc(v.fr)}</span><p class="vocab-def">${esc(v.d)}</p><p class="vocab-example">“${esc(v.e)}”</p><button class="vocab-audio" data-vocab-speak="${esc(v.w)}. ${esc(v.e)}">▶ Word + sentence</button></article>`).join('');}
  renderVocab();
  $('#vocabTabs')?.addEventListener('click',e=>{const b=e.target.closest('button[data-cat]');if(!b)return;currentCat=b.dataset.cat;$$('#vocabTabs button').forEach(x=>x.classList.toggle('active',x===b));renderVocab();});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-vocab-speak]');if(b)Speech.say(b.dataset.vocabSpeak)});
  $('#vocabListenAll')?.addEventListener('click',()=>Speech.say(vocab[currentCat].map(v=>`${v.w}. ${v.e}`).join(' ')));

  // generic exercise engine
  const results={};
  function hintHtml(h){return `<div class="hint-inline">💡 ${esc(h)}</div>`}
  function mcqCard(item,index,group){const opts=shuffle(item.options.map(x=>({text:x,correct:norm(x)===norm(item.answer)})));return `<article class="exercise-card" data-group="${group}" data-key="${group}-${index}" data-answer="${esc(item.answer)}"><span class="exercise-number">${String(index+1).padStart(2,'0')}</span><p>${item.q}</p><div class="answer-options">${opts.map((o,i)=>`<button type="button" data-correct="${o.correct}"><strong>${String.fromCharCode(65+i)}.</strong> ${esc(o.text)}</button>`).join('')}</div><div class="exercise-tools"><button type="button" class="hint-button">💡 Hint</button></div>${hintHtml(item.hint)}<div class="feedback-line"></div></article>`}
  function fillCard(item,index,group){return `<article class="exercise-card fill-card" data-group="${group}" data-key="${group}-${index}" data-answer="${esc(item.answer)}" data-alts="${esc((item.alts||[]).join('|'))}"><span class="exercise-number">${String(index+1).padStart(2,'0')}</span><p>${item.q}</p><div class="fill-row"><input type="text" aria-label="Your answer" autocomplete="off"><button type="button" class="check-button">Check</button></div><div class="exercise-tools"><button type="button" class="hint-button">💡 Hint</button></div>${hintHtml(item.hint)}<div class="feedback-line"></div></article>`}
  function renderExerciseSet(host,items,group,scoreId,totalId){const el=$(host);if(!el)return;el.innerHTML=items.map((it,i)=>it.type==='fill'?fillCard(it,i,group):mcqCard(it,i,group)).join('');const totalEl=$(totalId);if(totalEl)totalEl.textContent=items.length;results[group]={correct:0,total:items.length,done:new Map(),scoreId};}
  function recompute(group){const r=results[group];if(!r)return;r.correct=[...r.done.values()].filter(Boolean).length;const scoreEl=$(r.scoreId);if(scoreEl)scoreEl.textContent=r.correct;updateDashboard();}
  document.addEventListener('click',e=>{
    const hint=e.target.closest('.hint-button');if(hint){hint.closest('.exercise-card')?.querySelector('.hint-inline')?.classList.toggle('open');return;}
    const option=e.target.closest('.answer-options button');if(option){const card=option.closest('.exercise-card'),group=card.dataset.group,key=card.dataset.key,correct=option.dataset.correct==='true';$$('.answer-options button',card).forEach(b=>{b.disabled=true;if(b.dataset.correct==='true')b.classList.add('correct')});if(!correct)option.classList.add('incorrect');const fb=$('.feedback-line',card);fb.textContent=correct?'✓ Correct — well done.':`✗ Not quite. The best answer is: ${card.dataset.answer}`;fb.className=`feedback-line ${correct?'good':'bad'}`;results[group].done.set(key,correct);recompute(group);return;}
    const check=e.target.closest('.check-button');if(check){const card=check.closest('.exercise-card'),input=$('input',card),group=card.dataset.group,key=card.dataset.key;const accepted=[card.dataset.answer,...(card.dataset.alts||'').split('|').filter(Boolean)];const correct=accepted.some(a=>norm(a)===norm(input.value));input.classList.toggle('correct',correct);input.classList.toggle('incorrect',!correct);const fb=$('.feedback-line',card);fb.textContent=correct?'✓ Correct — well done.':`✗ Not quite. Answer: ${card.dataset.answer}`;fb.className=`feedback-line ${correct?'good':'bad'}`;results[group].done.set(key,correct);recompute(group);return;}
  });

  const vocabQ=[
    {q:'Which word means “easy and suitable for your situation”?',options:['convenient','windy','memorable'],answer:'convenient',hint:'Think about transport that makes your trip easier.'},
    {q:'Which word describes natural views and landscapes?',options:['scenery','heritage','layer'],answer:'scenery',hint:'You can admire this from a viewpoint.'},
    {q:'Which verb means “to reserve in advance”?',options:['book','arrive','explore'],answer:'book',hint:'You do this before a hotel stay.'},
    {q:'Which adjective means “full of activity and energy”?',options:['lively','mild','similar'],answer:'lively',hint:'Think of a busy city centre.'},
    {q:'Which word means history and traditions passed down over time?',options:['heritage','atmosphere','viewpoint'],answer:'heritage',hint:'Museums and historic buildings are part of it.'},
    {q:'If the weather changes often, it is…',options:['changeable','convenient','memorable'],answer:'changeable',hint:'It may be sunny, then rainy, then windy.'},
    {q:'Which verb means “to reach a place at the end of a journey”?',options:['arrive','leave','pack'],answer:'arrive',hint:'The opposite is leave.'},
    {q:'Which adjective means “calm and helping you feel less tired”?',options:['relaxing','lively','wintry'],answer:'relaxing',hint:'A quiet spa weekend could be this.'}
  ];

  const compQ=[
    {q:'Complete: A direct train is ___ than three connections. (easy)',type:'fill',answer:'easier',hint:'Adjectives ending in consonant + y change y → i + er.'},
    {q:'Choose: Italy may be ___ than Ireland in autumn.',options:['warmer','more warm','warmest'],answer:'warmer',hint:'Warm is a short adjective.'},
    {q:'Complete: This hotel is ___ than the other one. (expensive)',type:'fill',answer:'more expensive',hint:'Long adjective → more + adjective.'},
    {q:'Choose: A morning departure is ___ for me than a very late one.',options:['better','gooder','best'],answer:'better',hint:'Good has an irregular comparative.'},
    {q:'Complete: A short break may be ___ than a full week. (practical)',type:'fill',answer:'more practical',hint:'Practical has several syllables.'},
    {q:'Choose the correct sentence.',options:['Ireland may be greener than Italy.','Ireland may be more greener than Italy.','Ireland may be greenest than Italy.'],answer:'Ireland may be greener than Italy.',hint:'Do not use more + -er together.'},
    {q:'Complete: A coastal town can be ___ than an inland city. (windy)',type:'fill',answer:'windier',hint:'Windy → y changes to i.'},
    {q:'Choose: A missed connection is ___ than a ten-minute delay.',options:['worse','badder','more bad'],answer:'worse',hint:'Bad has an irregular comparative.'},
    {q:'Complete: This route is ___ than the first one. (short)',type:'fill',answer:'shorter',hint:'Short adjective → add -er.'},
    {q:'Choose: A museum visit may be ___ than waiting at the airport.',options:['more interesting','interestinger','most interesting'],answer:'more interesting',hint:'Interesting is a long adjective.'},
    {q:'Complete: The second hotel is ___ from the station. (far)',type:'fill',answer:'farther',alts:['further'],hint:'Far → farther or further.'},
    {q:'Choose the missing word: Italy may be warmer ___ Ireland.',options:['than','that','as'],answer:'than',hint:'Comparatives normally use this word before the second item.'}
  ];

  const richQ=[
    {q:'Choose: A weekend is ___ a full week.',options:['not as long as','not longer as','less long than as'],answer:'not as long as',hint:'Use not as + adjective + as.'},
    {q:'Complete: This route is ___ easier than the first one. (large difference)',type:'fill',answer:'much',alts:['far'],hint:'Use much or far before a comparative for a big difference.'},
    {q:'Choose: Of the four trips, December may be ___ one.',options:['the coldest','colder','the more cold'],answer:'the coldest',hint:'Compare three or more → superlative.'},
    {q:'Complete: Italy may be ___ cultural as Ireland is scenic.',type:'fill',answer:'as',hint:'Equal comparison: as + adjective + as.'},
    {q:'Choose the best B1 sentence.',options:['Ireland may be cooler, whereas Italy may be warmer.','Ireland cooler but Italy warm.','Ireland is cool than Italy.'],answer:'Ireland may be cooler, whereas Italy may be warmer.',hint:'Use whereas to contrast two complete ideas.'},
    {q:'Complete: Saint-Malo may be a ___ shorter trip than Italy. (small difference)',type:'fill',answer:'little',alts:['bit'],hint:'A little / a bit + comparative = small difference.'},
    {q:'Choose: This could be one of ___ memorable trips of the year.',options:['the most','more','the more'],answer:'the most',hint:'The fixed structure is one of the most + adjective.'},
    {q:'Complete: My October trip is not ___ short as my November break.',type:'fill',answer:'as',hint:'not as + adjective + as.'},
    {q:'Choose: A direct flight is ___ more convenient than two changes.',options:['much','many','most'],answer:'much',hint:'Much can intensify a comparative.'},
    {q:'Choose the strongest contrast.',options:['Ireland may suit walking, while Italy may suit city visits.','Ireland walking, Italy cities.','Ireland is more walk than Italy.'],answer:'Ireland may suit walking, while Italy may suit city visits.',hint:'Use while/whereas between two complete ideas.'}
  ];

  // Verb grid
  const verbs=[
    ['🧭','go','went','gone','aller','to move or travel from one place to another','I have gone abroad many times.'],
    ['🚆','leave','left','left','partir / quitter','to go away from a place','The train left on time.'],
    ['📍','arrive','arrived','arrived','arriver','to reach a place at the end of a journey','We arrived in the afternoon.'],
    ['🧳','take','took','taken','prendre','to use or travel by a particular form of transport','I have taken this train before.'],
    ['👀','see','saw','seen','voir','to notice or experience something with your eyes','I saw beautiful scenery in Scotland.'],
    ['✅','choose','chose','chosen','choisir','to decide which person or thing you want','I have chosen a quieter hotel.'],
    ['💶','spend','spent','spent','dépenser / passer','to use money or to pass time somewhere','We spent three days there.'],
    ['🏨','stay','stayed','stayed','séjourner','to live or remain somewhere for a limited time','We are staying for four nights.'],
    ['🗺️','visit','visited','visited','visiter','to go to a place in order to see or experience it','I have visited Ireland before.'],
    ['🥾','walk','walked','walked','marcher','to move on foot','We walked along the coast.'],
    ['🍝','eat','ate','eaten','manger','to have food as a meal','I have eaten Italian food many times.'],
    ['🛍️','buy','bought','bought','acheter','to get something by paying money for it','I bought a local product.'],
    ['🎒','bring','brought','brought','apporter','to take something with you to a place','I brought a waterproof jacket.'],
    ['🔎','find','found','found','trouver','to discover or locate something','We found a lovely café.'],
    ['📅','plan','planned','planned','planifier','to decide in advance what you are going to do','We planned the trip carefully.']
  ];
  $('#verbGrid').innerHTML=verbs.map(v=>`<article class="verb-card"><div class="verb-icon">${v[0]}</div><h3>${v[1]}</h3><div class="verb-forms"><span><small>BASE</small>${v[1]}</span><span><small>PAST</small>${v[2]}</span><span><small>PP</small>${v[3]}</span></div><div class="verb-fr">${v[4]}</div><p class="verb-def">${v[5]}</p><p class="verb-example">${v[6]}</p><button data-verb-speak="${esc(`${v[1]}. ${v[6]}`)}">▶ Word + sentence</button></article>`).join('');
  document.addEventListener('click',e=>{const b=e.target.closest('[data-verb-speak]');if(b)Speech.say(b.dataset.verbSpeak)});

  const verbQ=[
    {q:'Yesterday, we ___ a small town near the coast. (visit)',type:'fill',answer:'visited',hint:'Finished time yesterday → past simple.'},
    {q:'I have ___ Scotland before. (visit)',type:'fill',answer:'visited',hint:'Present perfect = have + past participle.'},
    {q:'Last year, we ___ a beautiful viewpoint. (find)',type:'fill',answer:'found',hint:'Find is irregular: find → found → found.'},
    {q:'Choose: I have ___ this train before.',options:['taken','took','take'],answer:'taken',hint:'After have, use the past participle.'},
    {q:'We ___ three nights there last summer. (spend)',type:'fill',answer:'spent',hint:'Spend → spent → spent.'},
    {q:'Choose: She ___ the earlier train yesterday.',options:['chose','chosen','choose'],answer:'chose',hint:'Past simple of choose = chose.'},
    {q:'I have never ___ that museum. (see)',type:'fill',answer:'seen',hint:'See → saw → seen.'},
    {q:'Choose: The train ___ at 7:40 this morning.',options:['left','leave','leaved'],answer:'left',hint:'Leave is irregular.'},
    {q:'We have ___ our hotel already. (book)',type:'fill',answer:'booked',hint:'Regular verb: book + ed.'},
    {q:'Choose: I ___ some local products during my last trip.',options:['bought','buyed','brought'],answer:'bought',hint:'Buy → bought. Bring → brought.'},
    {q:'Last weekend, we ___ along the coast. (walk)',type:'fill',answer:'walked',hint:'Regular verb: walk + ed.'},
    {q:'Choose: I have ___ a warm coat for December.',options:['brought','bringed','bring'],answer:'brought',hint:'Bring → brought → brought.'}
  ];

  const futureQ=[
    {q:'I ___ to Ireland in September. It is my plan.',options:['am going to travel','will travelled','travelled'],answer:'am going to travel',hint:'Plan/intention → be going to + base verb.'},
    {q:'I ___ to Italy in October. The trip is already arranged.',options:['am travelling','will travelling','travels'],answer:'am travelling',hint:'Arranged future → present continuous.'},
    {q:'I think the December trip ___ very festive.',options:['will be','is being to','was'],answer:'will be',hint:'Prediction → will + base verb.'},
    {q:'The train ___ at 8:15 tomorrow morning.',options:['leaves','will leaving','is leave'],answer:'leaves',hint:'Official timetable → present simple.'},
    {q:'Complete: We ___ Saint-Malo in November. (visit / arrangement)',type:'fill',answer:'are visiting',hint:'Use present continuous: are + verb-ing.'},
    {q:'Complete: I ___ pack a waterproof jacket for Ireland. (plan)',type:'fill',answer:'am going to',alts:["I'm going to"],hint:'Plan → am going to + base verb.'},
    {q:'Choose: Don’t worry, I ___ the hotel now.',options:['will call','called','am call'],answer:'will call',hint:'Decision made now → will.'},
    {q:'The museum ___ at ten tomorrow.',options:['opens','will opening','opened'],answer:'opens',hint:'Public opening time → present simple.'},
    {q:'Complete: I think Italy ___ warmer than Ireland. (prediction)',type:'fill',answer:'will be',hint:'Prediction → will be.'},
    {q:'Choose: We ___ in Alsace for several days. The hotel is booked.',options:['are staying','stay yesterday','will stayed'],answer:'are staying',hint:'A fixed arrangement can use present continuous.'}
  ];

  const listen1=[
    {q:'What comparison is made about Ireland?',options:['It may be cooler and greener.','It will definitely be hotter.','It is described as more urban.'],answer:'It may be cooler and greener.',hint:'Listen for the two adjectives after “Ireland may be…”'},
    {q:'What may Italy offer more opportunities for?',options:['Museums, cafés and city visits.','Long mountain walks only.','Winter sports.'],answer:'Museums, cafés and city visits.',hint:'Listen for “Italy may offer more opportunities for…”'},
    {q:'Does the speaker say one trip is definitely better?',options:['No, they are different experiences.','Yes, Ireland is definitely better.','Yes, Italy is definitely better.'],answer:'No, they are different experiences.',hint:'Listen to the final two sentences.'}
  ];
  const listen2=[
    {q:'What is important about Saint-Malo in the dialogue?',options:['The sea is part of the experience.','It is described as an inland destination.','The trip is in September.'],answer:'The sea is part of the experience.',hint:'Listen for “coastal destination”.'},
    {q:'How may Alsace feel in December?',options:['More festive and wintry.','More tropical.','Less seasonal.'],answer:'More festive and wintry.',hint:'Two adjectives are used together.'},
    {q:'Which trip will probably be shorter?',options:['Saint-Malo.','Alsace.','Italy.'],answer:'Saint-Malo.',hint:'Listen for “The Saint-Malo trip will probably…”'}
  ];
  const readingQ=[
    {q:'When is the Ireland trip?',options:['September','October','December'],answer:'September',hint:'Look at the first travel sentence.'},
    {q:'Which destination is compared as probably warmer?',options:['Italy','Ireland','Saint-Malo'],answer:'Italy',hint:'The text contrasts Ireland and Italy.'},
    {q:'Which trip is described as shorter?',options:['Saint-Malo','Alsace','Ireland'],answer:'Saint-Malo',hint:'Look for “shorter break”.'},
    {q:'Which trip may be the most festive?',options:['Alsace','Italy','Ireland'],answer:'Alsace',hint:'It is the December trip.'},
    {q:'What tense is used in “I’ve already visited different parts of France”?',options:['Present perfect','Past continuous','Future simple'],answer:'Present perfect',hint:'Have + past participle.'},
    {q:'What is the final idea?',options:['Each journey will offer something different.','All trips will be identical.','Only one trip matters.'],answer:'Each journey will offer something different.',hint:'Read the last sentence.'}
  ];

  const finalQ=[
    {q:'Choose the correct comparative of “easy”.',options:['easier','more easy','easiest'],answer:'easier',hint:'y → i + er.'},
    {q:'Choose: This journey is ___ than the other one.',options:['more convenient','convenienter','most convenient'],answer:'more convenient',hint:'Long adjective → more.'},
    {q:'Choose the correct form after “have”: I have ___ Italy before.',options:['visited','visit','visiting'],answer:'visited',hint:'have + past participle.'},
    {q:'Which form is correct? go → went → ___',options:['gone','goed','going'],answer:'gone',hint:'This is an irregular verb.'},
    {q:'Choose the strongest comparison.',options:['Ireland may be greener, whereas Italy may be warmer.','Ireland green and Italy warm.','Ireland is more greenest.'],answer:'Ireland may be greener, whereas Italy may be warmer.',hint:'Look for two complete contrasted ideas.'},
    {q:'Choose: The train ___ at 7:20 tomorrow.',options:['leaves','left','is leave'],answer:'leaves',hint:'Official schedule → present simple.'},
    {q:'Which word means “the natural views of a place”?',options:['scenery','heritage','layer'],answer:'scenery',hint:'You can admire it from a viewpoint.'},
    {q:'Choose: A weekend is ___ a full week.',options:['not as long as','not longer as','not as longer'],answer:'not as long as',hint:'not as + adjective + as.'},
    {q:'Choose the correct past form of “buy”.',options:['bought','buyed','brought'],answer:'bought',hint:'Do not confuse buy and bring.'},
    {q:'Which sentence gives a reason?',options:['I prefer this trip because it is easier to organise.','This trip is easier.','Which trip do you prefer?'],answer:'I prefer this trip because it is easier to organise.',hint:'Look for because.'},
    {q:'Choose: This may be one of ___ memorable trips of the year.',options:['the most','more','most than'],answer:'the most',hint:'Fixed phrase: one of the most.'},
    {q:'LILATE strategy: you do not understand a detail. What is strongest?',options:['Could you repeat the last detail more slowly, please?','I don’t know.','Yes.'],answer:'Could you repeat the last detail more slowly, please?',hint:'Clarify politely instead of guessing.'},
    {q:'Choose: I ___ to Saint-Malo in November; the trip is arranged.',options:['am travelling','travelled','will travelled'],answer:'am travelling',hint:'Fixed arrangement → present continuous.'},
    {q:'What is the best B1 connector for contrast?',options:['whereas','and then','because of'],answer:'whereas',hint:'It contrasts two clauses.'},
    {q:'Choose the correct sentence.',options:['Italy may be much warmer than Ireland.','Italy may be much more warmer than Ireland.','Italy may warmer as Ireland.'],answer:'Italy may be much warmer than Ireland.',hint:'Much + comparative; do not use more + -er.'}
  ];

  renderExerciseSet('#vocabQuiz',vocabQ,'vocab','#vocabScore','#vocabTotal');
  renderExerciseSet('#comparativeQuiz',compQ,'comparatives','#compScore','#compTotal');
  renderExerciseSet('#richComparisonQuiz',richQ,'rich','#richScore','#richTotal');
  renderExerciseSet('#verbQuiz',verbQ,'verbs','#verbScore','#verbTotal');
  renderExerciseSet('#futureQuiz',futureQ,'future','#futureScore','#futureTotal');
  renderExerciseSet('#listeningQuiz1',listen1,'listen1','#dummy1','#dummy1Total');
  renderExerciseSet('#listeningQuiz2',listen2,'listen2','#dummy2','#dummy2Total');
  renderExerciseSet('#readingQuiz',readingQ,'reading','#readingScore','#readingTotal');
  function renderFinal(){renderExerciseSet('#finalQuiz',finalQ,'final','#finalScore','#finalTotal')}
  renderFinal();
  // hidden dummy score holders for listening results engine
  ['dummy1','dummy1Total','dummy2','dummy2Total'].forEach(id=>{if(!document.getElementById(id)){const s=document.createElement('span');s.id=id;s.hidden=true;document.body.appendChild(s)}});
  $('#resetFinal')?.addEventListener('click',()=>{renderFinal();updateDashboard();toast('Final check reshuffled.');});

  // transcripts
  $$('.transcript-btn').forEach(btn=>btn.addEventListener('click',()=>{const t=$(`#${btn.dataset.target}`);t.classList.toggle('open');btn.textContent=t.classList.contains('open')?'Hide transcript':'Show transcript'}));

  // builder
  $('#buildSpeaking')?.addEventListener('click',()=>{const a=$('#builderTrip1').value,b=$('#builderTrip2').value,c=$('#builderCompare').value,r=$('#builderReason').value;$('#speakingOutput').value=`Compared with ${b}, ${a} seems ${c} to me ${r}. However, I think both trips will offer different experiences, and I’m looking forward to discovering them for different reasons.`;updateProduction($('#speakingOutput'),$('#speakingFeedback'),'speaking')});
  $('#showSpeakingModels')?.addEventListener('click',()=>{const box=$('#speakingModels');box.classList.toggle('open');$('#showSpeakingModels').textContent=box.classList.contains('open')?'Hide models':'👁 Show A2 / A2+ / B1 models'});
  function updateProduction(area,fb,type){const t=area.value;const hasComp=/(than|as .* as|more |less |better|worse|whereas|while)/i.test(t);const hasReason=/(because|so |therefore|reason|which)/i.test(t);const hasQuestion=/\?/.test(t);let score=(hasComp?1:0)+(hasReason?1:0)+(type==='mission'&&hasQuestion?1:0);fb.className='production-feedback '+(score>=(type==='mission'?3:2)?'good':'progress');fb.textContent=type==='mission'?(score===3?'✓ Strong structure: comparison + reason + interaction question.':'Keep building: include a comparison, a reason and a question back.'):(score>=2?'✓ Good: you included a comparison and a reason.':'Add a clear comparison and explain why.');}
  $('#speakingOutput')?.addEventListener('input',e=>updateProduction(e.target,$('#speakingFeedback'),'speaking'));

  // Mission scenarios
  const missions=[
    {icon:'☘️',label:'MISSION 1',title:'A friend asks about Ireland and Italy',text:'Your English-speaking friend asks which trip you think will be more enjoyable and why. Compare the two trips, explain your expectations, and ask your friend which destination they would prefer.',hint:'Useful: Compared with… / … may be more… / whereas… / I’m looking forward to… because… / Which would you prefer?',model:'A2+: I think Ireland and Italy will be very different. Ireland may be cooler and greener, whereas Italy may be warmer and more cultural for me. I’m looking forward to both, but Ireland may be better for walking. Which trip would you prefer?\n\nB1: I don’t think one destination will necessarily be better than the other because they should offer very different experiences. Ireland may be cooler and greener, which could make it ideal for walking, whereas Italy may offer more city visits, food and cultural activities. At the moment I’m slightly more curious about Ireland. Which one would appeal to you most?',oral:'Friend: You have several trips planned. Which do you think will be more enjoyable, Ireland or Italy?\nYou: Compare the two destinations and explain your preference.\nFriend: What makes that destination more attractive to you?\nYou: Give one reason and ask the friend a question back.'},
    {icon:'🌊',label:'MISSION 2',title:'Help someone choose between Saint-Malo and Alsace',text:'A visitor has time for only one French trip in late autumn or winter. Explain how the two experiences may differ and recommend one based on what the visitor enjoys.',hint:'Ask first: Do you prefer the coast or a winter atmosphere? Then compare: quieter, more festive, shorter, more convenient.',model:'A2+: Saint-Malo and Alsace are both interesting, but they are different. Saint-Malo may be better if you like the sea, while Alsace may be more festive in December. If you enjoy winter atmosphere, I would recommend Alsace.\n\nB1: Before recommending one, I would ask what kind of experience you prefer. Saint-Malo may suit you better if you enjoy coastal scenery and a shorter break, whereas Alsace in December may feel more festive and seasonal. If winter atmosphere and several towns appeal to you, I would probably recommend Alsace.',oral:'Visitor: I can only take one trip. Should I go to Saint-Malo or Alsace?\nYou: Ask one question to understand the visitor’s preferences.\nVisitor: I like atmosphere, local traditions and walking.\nYou: Compare the two options, recommend one and explain why.'},
    {icon:'🧳',label:'MISSION 3',title:'Compare two travel arrangements',text:'You are offered two ways to reach your destination: a cheaper journey with two changes, or a more expensive direct journey. Compare the options and explain which you would choose.',hint:'Useful: cheaper than / much more convenient / not as tiring as / I would choose… because…',model:'A2+: The journey with two changes is cheaper, but the direct journey is easier and more convenient. I would choose the direct journey because it is less tiring.\n\nB1: Although the journey with two changes is cheaper, the direct option is much more convenient and probably less tiring. I would be willing to pay a little more if it reduced the risk of delays and missed connections. How much more expensive is the direct option?',oral:'Agent: The first option costs less but has two changes. The second is direct but more expensive.\nYou: Compare the options.\nAgent: Which one would you like?\nYou: Choose, justify and ask one practical question.'},
    {icon:'🏨',label:'MISSION 4',title:'Compare two hotel rooms',text:'A hotel offers a smaller quiet room or a larger room facing a busy street. Compare the advantages and choose the best room for you.',hint:'Useful: larger than / quieter than / not as noisy as / more important to me / I would rather…',model:'A2+: The second room is larger, but the first room is quieter. I would prefer the quiet room because sleeping well is more important to me than having extra space.\n\nB1: The street-facing room is larger, but it may also be much noisier. The smaller room sounds quieter and probably more relaxing. For me, a good night’s sleep is more important than extra space, so I would choose the smaller room. Is breakfast included with both options?',oral:'Receptionist: I can offer you a larger room facing the street or a smaller quiet room at the back.\nYou: Compare the rooms.\nReceptionist: Which would you prefer?\nYou: Choose, justify and ask one question.'}
  ];
  let missionIndex=0;
  function renderMission(){const m=missions[missionIndex];$('#missionIcon').textContent=m.icon;$('#missionLabel').textContent=m.label;$('#missionTitle').textContent=m.title;$('#missionText').textContent=m.text;$('#missionHint').textContent=m.hint;$('#missionModel').innerHTML=m.model.split('\n\n').map(x=>`<p>${esc(x)}</p>`).join('');$('#missionOral').innerHTML=m.oral.split('\n').map(x=>`<p>${esc(x)}</p>`).join('');$('#missionHint').classList.remove('open');$('#missionModel').classList.remove('open');$('#missionOral').classList.remove('open');$('#showMissionModel').textContent='👁 Show A2+/B1 model';$('#toggleMissionOral').textContent='📖 Show full oral text';$('#missionAnswer').value='';updateProduction($('#missionAnswer'),$('#missionFeedback'),'mission')}
  renderMission();
  $('#newMission')?.addEventListener('click',()=>{let next=missionIndex;while(missions.length>1&&next===missionIndex)next=Math.floor(Math.random()*missions.length);missionIndex=next;renderMission()});
  $('#showMissionModel')?.addEventListener('click',()=>{const x=$('#missionModel');x.classList.toggle('open');$('#showMissionModel').textContent=x.classList.contains('open')?'Hide model':'👁 Show A2+/B1 model'});
  $('#toggleMissionOral')?.addEventListener('click',()=>{const x=$('#missionOral');x.classList.toggle('open');$('#toggleMissionOral').textContent=x.classList.contains('open')?'Hide full oral text':'📖 Show full oral text'});
  $('#playMission')?.addEventListener('click',()=>Speech.say(missions[missionIndex].text));
  $('#missionAnswer')?.addEventListener('input',e=>updateProduction(e.target,$('#missionFeedback'),'mission'));

  // generic hint toggles
  $$('.hint-toggle').forEach(btn=>btn.addEventListener('click',()=>{const x=$(`#${btn.dataset.target}`);x?.classList.toggle('open');}));

  // writing
  const writing=$('#writingResponse'); writing.value=store.get('mc_l5_writing')||''; writing.addEventListener('input',()=>{store.set('mc_l5_writing',writing.value);$('#wordCount').textContent=writing.value.trim()?writing.value.trim().split(/\s+/).length:0}); writing.dispatchEvent(new Event('input'));
  $('#showWritingModel')?.addEventListener('click',()=>$('#writingModel').classList.toggle('open'));
  $('#checkWriting')?.addEventListener('click',()=>{const t=writing.value,n=t.trim()?t.trim().split(/\s+/).length:0;const checks=[['90–140 words',n>=90&&n<=140],['At least 2 comparisons',(t.match(/\b(than|whereas|while|as\b.*\bas|more\s+\w+|less\s+\w+|better|worse|easier|warmer|cooler|shorter|longer)\b/gi)||[]).length>=2],['At least 3 useful verbs',(t.match(/\b(am|are|is|will|visit|travel|go|stay|see|explore|try|book|leave|arrive|look|enjoy|prefer)\b/gi)||[]).length>=3],['A future form',/\b(will|going to|am travelling|are travelling|am visiting|are visiting)\b/i.test(t)],['A connector',/\b(because|whereas|although|however|while)\b/i.test(t)],['A question',/\?/.test(t)]];$('#writingChecklist').innerHTML=checks.map(([l,ok])=>`<div class="check-item ${ok?'ok':'no'}">${ok?'✓':'✗'} ${esc(l)}</div>`).join('');toast(`${checks.filter(x=>x[1]).length}/${checks.length} writing criteria met.`)});

  // recorders
  const recs={};
  function setupRecorder(key){const rec=$(`.record-btn[data-recorder="${key}"]`),stop=$(`.stop-btn[data-recorder="${key}"]`),timer=$(`#${key}Timer`),audio=$(`#${key}Playback`),dl=$(`#${key}Download`),note=$(`#${key}Note`);if(!rec||!stop)return;recs[key]={mr:null,chunks:[],secs:0,int:null,url:null};rec.addEventListener('click',async()=>{try{const stream=await navigator.mediaDevices.getUserMedia({audio:true}),s=recs[key],mr=new MediaRecorder(stream);s.chunks=[];s.mr=mr;mr.ondataavailable=e=>{if(e.data.size)s.chunks.push(e.data)};mr.onstop=()=>{const blob=new Blob(s.chunks,{type:mr.mimeType||'audio/webm'});if(s.url)URL.revokeObjectURL(s.url);s.url=URL.createObjectURL(blob);audio.src=s.url;audio.hidden=false;dl.href=s.url;dl.download=`Marie-Christine-Lesson-5-${key}.webm`;dl.hidden=false;stream.getTracks().forEach(t=>t.stop())};mr.start();s.secs=0;timer.textContent='00:00';s.int=setInterval(()=>{s.secs++;timer.textContent=`${String(Math.floor(s.secs/60)).padStart(2,'0')}:${String(s.secs%60).padStart(2,'0')}`},1000);rec.disabled=true;stop.disabled=false;note.textContent='Recording…'}catch{note.textContent='Microphone access was not granted.'}});stop.addEventListener('click',()=>{const s=recs[key];if(s.mr?.state==='recording')s.mr.stop();clearInterval(s.int);rec.disabled=false;stop.disabled=true;note.textContent='Recording ready. Listen and choose one thing to improve.'})}
  setupRecorder('speaking');setupRecorder('mission');

  // notes
  ['vocabNotes','proudSentence','nextGoal','speakingStatus','writingStatus','speakingComment','writingComment','evaluationComments'].forEach(id=>{const el=$(`#${id}`);if(!el)return;const v=store.get(`mc_l5_${id}`);if(v!==null)el.value=v;['input','change'].forEach(ev=>el.addEventListener(ev,()=>store.set(`mc_l5_${id}`,el.value)))});
  function notesText(){return `MARIE-CHRISTINE — LESSON 5 NOTES\nTravel Comparisons & Verb Power\n\nNEW WORDS\n${$('#vocabNotes').value||'—'}\n\nA COMPARISON I AM PROUD OF\n${$('#proudSentence').value||'—'}\n\nMY NEXT SPEAKING GOAL\n${$('#nextGoal').value||'—'}\n\nWRITING\n${writing.value||'—'}`}
  $('#saveNotes')?.addEventListener('click',()=>{$('#saveMessage').textContent='✓ Saved';toast('Your notes were saved on this device.')});$('#copyNotes')?.addEventListener('click',async()=>{await copyText(notesText());toast('Notes copied.')});$('#downloadNotes')?.addEventListener('click',()=>downloadText(notesText(),'Marie-Christine-Lesson-5-Notes.txt'));

  // ratings
  const ratings={}; $$('.rating-buttons').forEach(group=>{const name=group.dataset.rating;const saved=store.get(`mc_l5_rating_${name}`);if(saved){ratings[name]=saved;$$('button',group).forEach(b=>b.classList.toggle('active',b.textContent===saved))}$$('button',group).forEach(btn=>btn.addEventListener('click',()=>{$$('button',group).forEach(b=>b.classList.remove('active'));btn.classList.add('active');ratings[name]=btn.textContent;store.set(`mc_l5_rating_${name}`,btn.textContent)}))});

  // dashboard helpers
  const combine=groups=>groups.reduce((a,g)=>{const r=results[g]||{correct:0,total:0};return{correct:a.correct+r.correct,total:a.total+r.total}},{correct:0,total:0});
  const pct=r=>r.total?Math.round(r.correct/r.total*100):0; const status=s=>s>=75?['Acquis','acquired']:s>=50?['En voie d’acquisition','progress']:['En cours',''];
  function dash(prefix,r){const s=pct(r),[lab,cls]=status(s);$(`#${prefix}Score`).textContent=`${s}%`;const chip=$(`#${prefix}Status`);chip.textContent=lab;chip.className=`status-chip ${cls}`;return{score:s,status:lab,correct:r.correct,total:r.total}}
  function dashboardData(){const comparatives=combine(['comparatives','rich']);const verbsR=combine(['verbs','future']);const vocabulary=combine(['vocab']);const comprehension=combine(['listen1','listen2','reading']);const strategy=combine(['final']);const overall=combine(['comparatives','rich','verbs','future','vocab','listen1','listen2','reading','final']);return{comparatives,verbs:verbsR,vocabulary,comprehension,strategy,overall}}
  function updateDashboard(){const d=dashboardData();dash('comparatives',d.comparatives);dash('verbs',d.verbs);dash('vocabulary',d.vocabulary);dash('comprehension',d.comprehension);dash('strategy',d.strategy);dash('overall',d.overall)}
  updateDashboard();

  function evaluationData(){const d=dashboardData(),mk=r=>{const s=pct(r),st=status(s)[0];return{score:s,status:st,correct:r.correct,total:r.total}};return{generated:new Date().toLocaleString('en-GB'),title:'Marie-Christine — Lesson 5 Evaluation & Progress',subtitle:'Travel Comparisons & Verb Power · LILATE',comparatives:mk(d.comparatives),verbs:mk(d.verbs),vocabulary:mk(d.vocabulary),comprehension:mk(d.comprehension),strategy:mk(d.strategy),overall:mk(d.overall),speakingStatus:$('#speakingStatus').value,speakingComment:$('#speakingComment').value.trim()||'—',writingStatus:$('#writingStatus').value,writingComment:$('#writingComment').value.trim()||'—',useful:ratings.useful||'Not rated',clear:ratings.clear||'Not rated',confidence:ratings.confidence||'Not rated',comments:$('#evaluationComments').value.trim()||'No comments provided.',vocabNotes:$('#vocabNotes').value.trim()||'—',proudSentence:$('#proudSentence').value.trim()||'—',nextGoal:$('#nextGoal').value.trim()||'—'}}
  function evaluationText(){const e=evaluationData();return [e.title,e.subtitle,`Generated: ${e.generated}`,'','AUTOMATIC RESULTS',`Overall: ${e.overall.score}% — ${e.overall.status} (${e.overall.correct}/${e.overall.total})`,`Comparatives: ${e.comparatives.score}% — ${e.comparatives.status} (${e.comparatives.correct}/${e.comparatives.total})`,`Verb control: ${e.verbs.score}% — ${e.verbs.status} (${e.verbs.correct}/${e.verbs.total})`,`Vocabulary: ${e.vocabulary.score}% — ${e.vocabulary.status} (${e.vocabulary.correct}/${e.vocabulary.total})`,`Listening & reading: ${e.comprehension.score}% — ${e.comprehension.status} (${e.comprehension.correct}/${e.comprehension.total})`,`LILATE strategy: ${e.strategy.score}% — ${e.strategy.status} (${e.strategy.correct}/${e.strategy.total})`,'','MANUAL SKILLS',`Speaking: ${e.speakingStatus}`,`Speaking comments: ${e.speakingComment}`,`Writing: ${e.writingStatus}`,`Writing comments: ${e.writingComment}`,'','LEARNER FEEDBACK',`Usefulness: ${e.useful}/5`,`Clarity: ${e.clear}/5`,`Confidence: ${e.confidence}/5`,`Comments: ${e.comments}`,'','PERSONAL NOTES',`New words: ${e.vocabNotes}`,`Proud comparison: ${e.proudSentence}`,`Next speaking goal: ${e.nextGoal}`].join('\n')}
  $('#copyEvaluation')?.addEventListener('click',async()=>{await copyText(evaluationText());$('#evaluationMessage').textContent='✓ Copied';toast('Complete evaluation copied.')});$('#downloadEvaluation')?.addEventListener('click',()=>{downloadText(evaluationText(),'Marie-Christine-Lesson-5-Evaluation.txt');$('#evaluationMessage').textContent='✓ TXT downloaded'});
  function reportHtml(e){const card=(n,o)=>`<div class="score"><span>${esc(n)}</span><strong>${o.score}%</strong><small>${esc(o.status)} · ${o.correct}/${o.total} validated</small></div>`;return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(e.title)}</title><style>:root{--navy:#173b57;--teal:#267f7b;--gold:#d7a94a;--cream:#f7f1e8;--coral:#d77b67;--ink:#18304a}*{box-sizing:border-box}body{margin:0;background:#f7f4ed;color:var(--ink);font-family:Arial,sans-serif;line-height:1.55}.wrap{max-width:920px;margin:auto;padding:36px 22px}.hero{background:linear-gradient(135deg,var(--navy),#245e67);color:white;border-radius:26px;padding:34px}.hero .tag{color:var(--gold);font-weight:800;letter-spacing:.1em}.hero h1{margin:8px 0}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin:22px 0}.score,section{background:white;border-radius:18px;padding:20px;border-top:5px solid var(--teal)}.score strong{display:block;font-size:32px;color:var(--navy)}.overall{grid-column:1/-1;border-top-color:var(--gold);background:var(--cream)}section{margin:16px 0;border-top:0}h2{color:var(--navy);border-bottom:2px solid var(--gold);padding-bottom:8px}.comments{white-space:pre-wrap;background:#f8faf9;padding:14px;border-radius:12px;border-left:4px solid var(--coral)}@media(max-width:650px){.grid{grid-template-columns:1fr}.overall{grid-column:auto}}@media print{body{background:white}.wrap{padding:0}}</style></head><body><div class="wrap"><div class="hero"><div class="tag">LILATE · LESSON 5</div><h1>${esc(e.title)}</h1><p>${esc(e.subtitle)} · ${esc(e.generated)}</p></div><div class="grid">${card('Comparatives',e.comparatives)}${card('Verb control',e.verbs)}${card('Vocabulary',e.vocabulary)}${card('Listening & reading',e.comprehension)}${card('LILATE strategy',e.strategy)}<div class="score overall"><span>Overall objective result</span><strong>${e.overall.score}%</strong><small>${esc(e.overall.status)} · ${e.overall.correct}/${e.overall.total} validated</small></div></div><section><h2>Speaking & writing</h2><p><strong>Speaking:</strong> ${esc(e.speakingStatus)}</p><div class="comments">${esc(e.speakingComment)}</div><p><strong>Writing:</strong> ${esc(e.writingStatus)}</p><div class="comments">${esc(e.writingComment)}</div></section><section><h2>Learner feedback</h2><p>Usefulness ${esc(e.useful)}/5 · Clarity ${esc(e.clear)}/5 · Confidence ${esc(e.confidence)}/5</p><div class="comments">${esc(e.comments)}</div></section><section><h2>Personal progress notes</h2><p><strong>New words</strong></p><div class="comments">${esc(e.vocabNotes)}</div><p><strong>Proud comparison</strong></p><div class="comments">${esc(e.proudSentence)}</div><p><strong>Next speaking goal</strong></p><div class="comments">${esc(e.nextGoal)}</div></section></div></body></html>`}
  $('#downloadEvaluationHtml')?.addEventListener('click',()=>{downloadBlob(new Blob([reportHtml(evaluationData())],{type:'text/html;charset=utf-8'}),'Marie-Christine-Lesson-5-Progress-Report.html');$('#evaluationMessage').textContent='✓ HTML downloaded'});

  function latin1Safe(text=''){return String(text).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—]/g,'-').replace(/[^\x20-\xFF]/g,'?')}
  function pdfEscape(text=''){return latin1Safe(text).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)')}
  function wrapText(text,max=82){const words=latin1Safe(text).split(/\s+/),lines=[];let line='';for(const w of words){const test=line?`${line} ${w}`:w;if(test.length>max){if(line)lines.push(line);line=w}else line=test}if(line)lines.push(line);return lines}
  function generatePdf(e){const W=595,H=842,m=48,pages=[];let ops=[],y=H-54;const rgb={navy:'0.090 0.227 0.341',teal:'0.149 0.498 0.482',gold:'0.843 0.663 0.290',cream:'0.969 0.945 0.910',coral:'0.843 0.482 0.404',ink:'0.094 0.188 0.290',white:'1 1 1',muted:'0.38 0.44 0.51'};const rect=(x,yy,w,h,c)=>ops.push(`${rgb[c]} rg ${x} ${yy} ${w} ${h} re f`);const text=(s,x,yy,sz=10,c='ink',f='F1')=>ops.push(`BT /${f} ${sz} Tf ${rgb[c]} rg ${x} ${yy} Td (${pdfEscape(s)}) Tj ET`);const header=()=>{rect(0,H-120,W,120,'navy');text('LILATE · LESSON 5',m,H-50,10,'gold','F2');text('Marie-Christine - Travel Comparisons & Verb Power',m,H-78,17,'white','F2');text('Evaluation & Progress Report',m,H-99,10,'white');y=H-150};const flush=()=>{if(ops.length){pages.push(ops.join('\n'));ops=[]}};const ensure=n=>{if(y-n<55){flush();rect(0,H-48,W,48,'navy');text('Marie-Christine · Lesson 5 Progress',m,H-30,10,'white','F2');y=H-78}};const heading=s=>{ensure(38);rect(m,y-5,W-m*2,24,'cream');text(s,m+10,y+2,11,'navy','F2');y-=35};const para=(s,c='ink')=>{for(const line of wrapText(s,86)){ensure(15);text(line,m,y,9,c);y-=13}y-=4};const metric=(label,o)=>{ensure(40);rect(m,y-23,W-m*2,32,'cream');rect(m,y-23,6,32,o.score>=75?'teal':o.score>=50?'gold':'coral');text(label,m+15,y-1,9,'navy','F2');text(`${o.score}%`,W-120,y-1,13,'navy','F2');text(`${o.status} · ${o.correct}/${o.total} validated`,m+15,y-16,8,'muted');y-=42};header();para(`Generated: ${e.generated}`,'muted');heading('Automatic results');metric('Overall',e.overall);metric('Comparatives',e.comparatives);metric('Verb control',e.verbs);metric('Vocabulary',e.vocabulary);metric('Listening & reading',e.comprehension);metric('LILATE strategy',e.strategy);heading('Speaking & writing');para(`Speaking: ${e.speakingStatus}`,'teal');para(e.speakingComment);para(`Writing: ${e.writingStatus}`,'teal');para(e.writingComment);heading('Lesson feedback');para(`Usefulness: ${e.useful}/5   Clarity: ${e.clear}/5   Confidence: ${e.confidence}/5`);para(e.comments);heading('Personal progress notes');para(`New words: ${e.vocabNotes}`);para(`Proud comparison: ${e.proudSentence}`);para(`Next speaking goal: ${e.nextGoal}`);flush();const objs=[],add=s=>{objs.push(s);return objs.length};const f1=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'),f2=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'),pagesId=objs.length+1;add('PAGES');const ids=[];pages.forEach(c=>{const cid=add(`<< /Length ${latin1Safe(c).length} >>\nstream\n${c}\nendstream`);ids.push(add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${cid} 0 R >>`))});objs[pagesId-1]=`<< /Type /Pages /Kids [${ids.map(id=>`${id} 0 R`).join(' ')}] /Count ${ids.length} >>`;const cat=add(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);let pdf='%PDF-1.4\n%âãÏÓ\n',offs=[0];objs.forEach((o,i)=>{offs[i+1]=pdf.length;pdf+=`${i+1} 0 obj\n${o}\nendobj\n`});const xref=pdf.length;pdf+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`;for(let i=1;i<=objs.length;i++)pdf+=`${String(offs[i]).padStart(10,'0')} 00000 n \n`;pdf+=`trailer\n<< /Size ${objs.length+1} /Root ${cat} 0 R >>\nstartxref\n${xref}\n%%EOF`;const bytes=new Uint8Array(pdf.length);for(let i=0;i<pdf.length;i++)bytes[i]=pdf.charCodeAt(i)&255;return new Blob([bytes],{type:'application/pdf'})}
  $('#downloadEvaluationPdf')?.addEventListener('click',()=>{downloadBlob(generatePdf(evaluationData()),'Marie-Christine-Lesson-5-Progress-Report.pdf');$('#evaluationMessage').textContent='✓ PDF downloaded'});
})();
