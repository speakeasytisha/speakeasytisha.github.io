(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const STORE='karine_final_celebration_v2';
  let state={fr:false,reflection:{},promise:'',habits:[],qualiopi:{},comments:''};
  try{state={...state,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch(e){}
  const save=()=>localStorage.setItem(STORE,JSON.stringify(state));
  const toast=msg=>{const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)};

  function speak(text){
    if(!('speechSynthesis' in window)){toast('Audio is not available in this browser.');return;}
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang=$('#voiceChoice').value||'en-GB';
    const voices=speechSynthesis.getVoices();
    const v=voices.find(v=>v.lang===u.lang)||voices.find(v=>v.lang.startsWith(u.lang.slice(0,2)));
    if(v)u.voice=v;
    speechSynthesis.speak(u);
  }
  $$('[data-say]').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.say)));
  $$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));

  $('#toggleFr').addEventListener('click',()=>{
    state.fr=!state.fr;
    document.body.classList.toggle('show-fr',state.fr);
    $('#toggleFr').textContent=state.fr?'🇫🇷 French help: ON':'🇫🇷 French help';
    save();
  });
  document.body.classList.toggle('show-fr',state.fr);
  if(state.fr)$('#toggleFr').textContent='🇫🇷 French help: ON';

  const memories=[
    {title:'The first confidence steps',front:'Simple answers became full answers.',back:'You learned to answer a question, add one detail, and keep going instead of stopping after one sentence.'},
    {title:'The salon became your English studio',front:'Appointments, advice, colours, products and clients.',back:'You practised greeting clients, checking appointments, recommending products, explaining delays and finding solutions.'},
    {title:'You became a tense detective',front:'Usually? Yesterday? Right now? Next weekend?',back:'You learned to notice time clues and connect them to present, past, continuous and future forms.'},
    {title:'The “Secret of S”',front:'Plural, possession and third-person verbs.',back:'Tiny endings became easier to notice: clients, the client’s appointment, she works.'},
    {title:'Past simple met present perfect',front:'Life experience versus a finished past moment.',back:'You practised ever, never, for, since, and switching to the past simple when the time was finished and named.'},
    {title:'Story Street',front:'Problems, stories and spontaneous reactions.',back:'You worked with shops, pharmacies, petrol stations and difficult customer situations — using English to solve something.'},
    {title:'Travel English became real',front:'Hotels, restaurants, campsites and Sardinia.',back:'You practised reservations, questions, complaints, restaurants, car rental and conversation for a real trip.'},
    {title:'The CLOE work came together',front:'Listening, reading, writing, speaking and useful expressions.',back:'Your private final simulation showed how many separate skills you had built and how much more independently you could communicate.'},
    {title:'You learned to keep talking',front:'React, add, ask and connect.',back:'Instead of searching for one perfect sentence, you learned to build a conversation one useful piece at a time.'},
    {title:'You practised outside the lesson',front:'You looked for English in real life.',back:'Listening, reading, grammar books, notes, exercises — and even going to campsites to hear or speak English. That dedication matters.'}
  ];
  $('#memoryGrid').innerHTML=memories.map((m,i)=>`<article class="memory-card"><div class="memory-inner"><div class="memory-face memory-front"><span class="num">${String(i+1).padStart(2,'0')}</span><h3>${m.title}</h3><p>${m.front}</p><button type="button">See memory →</button></div><div class="memory-face memory-back"><span class="num">✦</span><h3>${m.title}</h3><p>${m.back}</p><button type="button">← Turn back</button></div></div></article>`).join('');
  $$('.memory-card button').forEach(b=>b.addEventListener('click',()=>b.closest('.memory-card').classList.toggle('open')));

  function buildConversation(){
    const parts=$$('.conversation-select').map(s=>s.value);
    $('#conversationOutput').textContent=parts.join(' ');
  }
  $$('.conversation-select').forEach(s=>s.addEventListener('change',buildConversation));
  buildConversation();
  $('#speakConversation').addEventListener('click',()=>speak($('#conversationOutput').textContent));

  const vocab={
    'Conversation openers':[
      ['How’s your day going?','Comment se passe votre journée ?','How’s your day going? Have you been busy?'],
      ['What brings you here?','Qu’est-ce qui vous amène ici ?','What brings you here? Are you on holiday?'],
      ['Have you been here before?','Vous êtes déjà venu(e) ici ?','Have you been here before, or is this your first time?'],
      ['How do you know the area?','Comment connaissez-vous la région ?','How do you know the area so well?'],
      ['Are you staying nearby?','Vous logez dans le coin ?','Are you staying nearby or just visiting for the day?'],
      ['What have you been up to?','Qu’est-ce que vous avez fait dernièrement ?','What have you been up to this week?']
    ],
    'Natural reactions':[
      ['Really?','Ah bon ? / Vraiment ?','Really? I didn’t know that.'],
      ['That sounds lovely.','Ça a l’air très sympa.','That sounds lovely. I’d like to try that.'],
      ['No way!','Sans blague !','No way! That must have been surprising.'],
      ['I know what you mean.','Je vois ce que vous voulez dire.','I know what you mean. It can be difficult at first.'],
      ['That makes sense.','Ça se comprend.','That makes sense. It gets very busy here in August.'],
      ['What a shame.','Quel dommage.','What a shame. I hope the weather improves tomorrow.']
    ],
    'Follow-up questions':[
      ['What was it like?','C’était comment ?','You went to Corsica? What was it like?'],
      ['How long have you…?','Depuis combien de temps… ?','How long have you been coming here?'],
      ['What do you like about it?','Qu’est-ce qui vous plaît ?','What do you like about this area?'],
      ['And how about you?','Et vous ?','I love travelling. How about you?'],
      ['What happened next?','Et ensuite, que s’est-il passé ?','You missed the train? What happened next?'],
      ['Would you do it again?','Vous le referiez ?','Would you do that trip again?']
    ],
    'Clarification & repair':[
      ['Could you say that again?','Pourriez-vous répéter ?','Sorry, could you say that again a little more slowly?'],
      ['What do you mean by…?','Qu’est-ce que vous voulez dire par… ?','What do you mean by “local market”?'],
      ['So, if I understand correctly…','Donc, si je comprends bien…','So, if I understand correctly, you’re staying for one week.'],
      ['I don’t know the word, but…','Je ne connais pas le mot, mais…','I don’t know the word, but it’s something you use for…'],
      ['I didn’t catch the last part.','Je n’ai pas compris la fin.','Sorry, I didn’t catch the last part.'],
      ['Could you show me?','Vous pourriez me montrer ?','I’m not sure which one you mean. Could you show me?']
    ],
    'Directions & recommendations':[
      ['It’s about ten minutes on foot.','C’est à environ dix minutes à pied.','The harbour is about ten minutes on foot.'],
      ['Turn left / right.','Tournez à gauche / à droite.','Turn left after the bakery.'],
      ['You can’t miss it.','Vous ne pouvez pas le rater.','It’s opposite the church. You can’t miss it.'],
      ['I’d recommend…','Je vous conseillerais…','I’d recommend the market if you like local food.'],
      ['It depends what you enjoy.','Ça dépend de ce que vous aimez.','It depends what you enjoy — beach, walking or shopping.'],
      ['If you have time…','Si vous avez le temps…','If you have time, you could walk along the coast.']
    ],
    'Restaurant & café':[
      ['Could we have the menu, please?','Pourrions-nous avoir la carte ?','Could we have the menu, please?'],
      ['What do you recommend?','Qu’est-ce que vous recommandez ?','What do you recommend if I like fish?'],
      ['Could I have this without…?','Je pourrais avoir ceci sans… ?','Could I have this without onions, please?'],
      ['I think there’s a mistake.','Je crois qu’il y a une erreur.','I think there’s a mistake on the bill.'],
      ['Could we have the bill, please?','L’addition, s’il vous plaît.','Could we have the bill, please?'],
      ['Is service included?','Le service est compris ?','Is service included in the price?']
    ],
    'Problems & solutions':[
      ['There seems to be a problem with…','Il semble y avoir un problème avec…','There seems to be a problem with the booking.'],
      ['Is there another option?','Y a-t-il une autre solution ?','That time doesn’t work for me. Is there another option?'],
      ['Could we change…?','Pourrions-nous changer… ?','Could we change the room, please?'],
      ['That’s not quite what I expected.','Ce n’est pas tout à fait ce à quoi je m’attendais.','The colour is darker than I expected.'],
      ['What can we do?','Qu’est-ce qu’on peut faire ?','The car won’t start. What can we do?'],
      ['Thank you for sorting that out.','Merci d’avoir réglé le problème.','Thank you for sorting that out so quickly.']
    ],
    'Plans & invitations':[
      ['Are you free…?','Vous êtes libre… ?','Are you free tomorrow afternoon?'],
      ['Would you like to…?','Vous aimeriez… ?','Would you like to have a coffee later?'],
      ['That works for me.','Ça me va.','Three o’clock? That works for me.'],
      ['I’m afraid I can’t.','J’ai bien peur de ne pas pouvoir.','I’m afraid I can’t on Friday, but Saturday is fine.'],
      ['Shall we meet at…?','On se retrouve à… ?','Shall we meet at the harbour?'],
      ['Let me know what suits you.','Dites-moi ce qui vous convient.','Let me know what suits you best.']
    ],
    'Phone & listening':[
      ['The line is breaking up.','La ligne coupe.','Sorry, the line is breaking up.'],
      ['Could you spell that for me?','Vous pourriez l’épeler ?','Could you spell your surname for me?'],
      ['Let me read that back to you.','Je vous le relis.','Let me read that back to you to make sure it’s correct.'],
      ['Could you speak a little more slowly?','Vous pourriez parler un peu plus lentement ?','Could you speak a little more slowly, please?'],
      ['I’ll put you through.','Je vous passe la personne.','One moment, please. I’ll put you through.'],
      ['Can I take a message?','Je peux prendre un message ?','She isn’t available right now. Can I take a message?']
    ],
    'Opinions & preferences':[
      ['I’d rather…','Je préférerais…','I’d rather stay somewhere quiet near the sea.'],
      ['I’m not really into…','Je ne suis pas très fan de…','I’m not really into crowded places.'],
      ['What I like most is…','Ce que j’aime le plus, c’est…','What I like most is meeting people.'],
      ['It depends.','Ça dépend.','It depends. In summer, I prefer the coast.'],
      ['Personally, I think…','Personnellement, je pense…','Personally, I think smaller towns are more relaxing.'],
      ['I prefer… because…','Je préfère… parce que…','I prefer travelling by car because it gives me more freedom.']
    ],
    'Friendly endings':[
      ['It was lovely talking to you.','C’était très agréable de discuter avec vous.','It was lovely talking to you. Enjoy the rest of your holiday.'],
      ['Maybe I’ll see you around.','On se croisera peut-être.','Maybe I’ll see you around later.'],
      ['Enjoy your stay.','Bon séjour.','Enjoy your stay — I hope the weather stays nice.'],
      ['Take care.','Prenez soin de vous.','Take care. Have a good trip home.'],
      ['Have a lovely afternoon.','Passez un bel après-midi.','Have a lovely afternoon.'],
      ['Safe travels.','Bon voyage.','Safe travels and enjoy the rest of your trip.']
    ],
    'Travel & campsite':[
      ['pitch','emplacement','Our pitch is near the swimming pool.'],
      ['facilities','équipements / installations','What facilities are available on the campsite?'],
      ['nearby','à proximité','Are there any good restaurants nearby?'],
      ['to book ahead','réserver à l’avance','Do we need to book ahead in August?'],
      ['check-in time','heure d’arrivée','What time is check-in?'],
      ['available','disponible','Do you have anything available for two nights?']
    ],
    'Salon & customer service':[
      ['time slot','créneau','I can offer you another time slot tomorrow.'],
      ['trim','couper légèrement les pointes','Would you like a trim or a bigger change?'],
      ['shade','teinte','This shade is slightly warmer.'],
      ['Thank you for your patience.','Merci pour votre patience.','We are running a little late. Thank you for your patience.'],
      ['How would you like it styled?','Comment souhaitez-vous le coiffage ?','How would you like it styled today?'],
      ['Would you like to keep the same length?','Souhaitez-vous garder la même longueur ?','Would you like to keep the same length or go a little shorter?']
    ]
  };
  const vc=$('#vocabCategory');
  Object.keys(vocab).forEach(k=>vc.insertAdjacentHTML('beforeend',`<option>${k}</option>`));
  function renderVocab(cat=vc.value){
    $('#vocabCards').innerHTML=vocab[cat].map(([w,fr,ex])=>`<article class="vocab-card"><h3>${w}</h3><div class="fr">${fr}</div><p class="example">${ex}</p><button data-vocab-say="${w.replace(/"/g,'&quot;')}" type="button">🔊 Listen</button></article>`).join('');
    $$('[data-vocab-say]').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.vocabSay)));
  }
  vc.addEventListener('change',()=>renderVocab());
  renderVocab();
  $('#randomVocab').addEventListener('click',()=>{const ks=Object.keys(vocab);vc.value=ks[Math.floor(Math.random()*ks.length)];renderVocab();});

  const grammar=[
    {q:'You talk about a normal Monday. Which is best?',o:['I usually go for a walk and have a coffee.','I am usually went for a walk.','I will usually went for a walk.'],a:0,why:'A routine → present simple.'},
    {q:'You describe what you are doing at this moment.',o:['I study English yesterday.','I am reviewing my English right now.','I have review English now.'],a:1,why:'Right now → present continuous.'},
    {q:'You talk about last weekend.',o:['I went to Nantes last weekend.','I have gone to Nantes last weekend.','I go to Nantes last weekend.'],a:0,why:'Finished past time (“last weekend”) → past simple.'},
    {q:'You ask about life experience.',o:['Did you ever visit Sardinia?','Have you ever visited Sardinia?','Are you ever visited Sardinia?'],a:1,why:'Ever + life experience → present perfect.'},
    {q:'You explain a plan for next month.',o:['I am going to visit my daughter.','I went to visit my daughter next month.','I have visited my daughter next month.'],a:0,why:'A plan/intention → going to.'},
    {q:'A client has very dry hair. Give advice.',o:['You should use a moisturising conditioner.','You should to use a conditioner.','You should used a conditioner.'],a:0,why:'Modal + base verb: should use.'},
    {q:'You want to compare two options.',o:['This colour is lighter than the other one.','This colour is more light than the other one.','This colour is lightest that the other one.'],a:0,why:'Short adjective → lighter than.'},
    {q:'You have worked on English for several months and it continues now.',o:['I worked on my English for several months.','I have worked on my English for several months.','I am work on my English since months.'],a:1,why:'Past started + continues now → present perfect with for.'},
    {q:'You make a polite request in a hotel.',o:['Could you change our room, please?','Can you to change our room?','Do you could change our room?'],a:0,why:'Could you + base verb is a polite, useful request.'},
    {q:'You want to invite someone for coffee.',o:['Would you like to have a coffee?','Do you like have a coffee?','Would you like having a coffee yesterday?'],a:0,why:'Would you like to + base verb is the natural invitation pattern.'},
    {q:'You did not understand something on the phone.',o:['Sorry, I didn’t catch that. Could you repeat it?','Sorry, I don’t catched that.','Please repeating.'],a:0,why:'A short apology + clear repair request keeps communication moving.'},
    {q:'You recommend something in your town.',o:['If you like seafood, you could try a restaurant near the harbour.','If you like seafood, you can tried a restaurant.','If you liked seafood tomorrow, you could tried.'],a:0,why:'If + present, could + base verb is natural for a friendly recommendation.'}
  ];
  $('#grammarQuiz').innerHTML=grammar.map((g,i)=>`<article class="q-card"><h3>${i+1}. ${g.q}</h3><div class="choices">${g.o.map((o,j)=>`<button class="choice" data-q="${i}" data-c="${j}" type="button">${o}</button>`).join('')}</div><p class="feedback" id="fb${i}"></p></article>`).join('');
  $$('.choice').forEach(b=>b.addEventListener('click',()=>{
    const i=+b.dataset.q,j=+b.dataset.c,g=grammar[i];
    const card=b.closest('.q-card');
    card.querySelectorAll('.choice').forEach(x=>{x.disabled=true;if(+x.dataset.c===g.a)x.classList.add('correct')});
    if(j!==g.a)b.classList.add('wrong');
    const fb=$('#fb'+i);
    fb.textContent=(j===g.a?'✓ Correct. ':'Not quite. ')+g.why;
    fb.className='feedback '+(j===g.a?'ok':'no');
  }));

  const repairs=[
    {q:'“I am agree with you.”',o:['I agree with you.','I am agreeing with you.'],a:0,why:'Agree is a verb: “I agree.”'},
    {q:'“I have visited Sardinia last year.”',o:['I visited Sardinia last year.','I have visited Sardinia last year.'],a:0,why:'Last year is finished time → past simple.'},
    {q:'“I am here since two days.”',o:['I have been here for two days.','I am here since two days.'],a:0,why:'A duration continuing now → present perfect + for.'},
    {q:'“Can you repeat more slowly?”',o:['Could you repeat that a little more slowly?','Could you repeated slowly?'],a:0,why:'Could you + base verb sounds natural and polite.'},
    {q:'“I prefer this one than that one.”',o:['I prefer this one to that one.','I prefer this one than that one.'],a:0,why:'Prefer X to Y.'},
    {q:'“What means this word?”',o:['What does this word mean?','What means this word?'],a:0,why:'Question form: What does + subject + base verb?'}
  ];
  $('#repairQuiz').innerHTML=repairs.map((r,i)=>`<article class="repair-card"><h4>${i+1}. ${r.q}</h4><div class="repair-options">${r.o.map((o,j)=>`<button class="repair-choice" data-rq="${i}" data-rc="${j}" type="button">${o}</button>`).join('')}</div><p class="repair-feedback" id="rfb${i}"></p></article>`).join('');
  $$('.repair-choice').forEach(b=>b.addEventListener('click',()=>{
    const i=+b.dataset.rq,j=+b.dataset.rc,r=repairs[i];
    const card=b.closest('.repair-card');
    card.querySelectorAll('.repair-choice').forEach(x=>{x.disabled=true;if(+x.dataset.rc===r.a)x.classList.add('correct')});
    if(j!==r.a)b.classList.add('wrong');
    const fb=$('#rfb'+i);
    fb.textContent=(j===r.a?'✓ Yes. ':'Try the other version. ')+r.why;
    fb.style.color=j===r.a?'#48784d':'#9f4f59';
  }));

  const roleplays=[
    {tab:'Campsite chat',title:'You meet another couple at a campsite',intro:'They are visiting the Vendée for the first time.',steps:['React to something they say about the area.','Say one thing you like about living near the coast.','Ask where they are from or how long they are staying.','Recommend one simple activity or place.','Finish naturally, not abruptly.'],model:'That sounds lovely. I live near the coast, so I understand why you like it here. How long are you staying? If the weather is nice, you could walk along the coast or visit Saint-Gilles-Croix-de-Vie. It was lovely talking to you. Enjoy your stay!',help:'That sounds… / I also… / How long…? / You could… / Enjoy your stay.',twist:'They say they only have one rainy day left. Change your recommendation.'},
    {tab:'Give directions',title:'A tourist asks you for directions',intro:'They are looking for the harbour and seem a little lost.',steps:['Confirm the place they want.','Give two or three clear steps.','Use a landmark if helpful.','Say approximately how long it takes.','Check whether they understood.'],model:'Yes, the harbour is quite close. Go straight ahead, then turn left after the bakery. Keep going for about five minutes and you’ll see the boats. You can’t miss it. It’s about ten minutes on foot. Does that make sense?',help:'Go straight ahead / turn left / after… / opposite… / about ten minutes on foot / You can’t miss it.',twist:'They ask if the route is easy with a pushchair. Add practical advice.'},
    {tab:'Restaurant problem',title:'There is a mistake with your meal',intro:'You ordered one thing but received something different.',steps:['Get the server’s attention politely.','Explain the problem without sounding aggressive.','Say what you ordered.','Ask what can be done.','Thank the server when a solution is offered.'],model:'Excuse me, I think there’s been a small mistake. I ordered the grilled fish, but this looks like the chicken dish. Would it be possible to change it, please? Thank you, I appreciate it.',help:'Excuse me / I think there’s been a mistake / I ordered… / Would it be possible to…? / Thank you for sorting that out.',twist:'The kitchen has run out of the dish you ordered. Choose another option and ask one question about it.'},
    {tab:'Hotel / booking',title:'Your hotel booking is not quite right',intro:'The room is different from what you expected.',steps:['Explain what you booked.','Describe the problem clearly.','Ask whether another room is available.','Offer one acceptable alternative.','Confirm the new arrangement.'],model:'Hello. I think there may be a problem with our booking. We booked a room with a sea view, but this room faces the car park. Is there another room available? If not, a quieter room would be fine. Could you check, please?',help:'There may be a problem with… / We booked… / Is there another…? / If not… / Could you check?',twist:'There are no other rooms tonight. Ask what they can do for tomorrow.'},
    {tab:'Salon visitor',title:'An English-speaking client walks into the salon',intro:'They want advice but are not sure what service they need.',steps:['Welcome the client and offer help.','Ask what they would like to change.','Clarify length, colour or maintenance.','Recommend an option and explain why.','Check that the client is happy with the plan.'],model:'Good morning. How can I help you? What would you like to change today? Would you like to keep the same length? If you want something easy to maintain, I’d recommend a small trim and a softer shade. How does that sound?',help:'What would you like done? / Would you like…? / I’d recommend… because… / How does that sound?',twist:'The client says the colour from the last salon was much darker than expected. Reassure them and clarify carefully.'},
    {tab:'Phone call',title:'You need information on the phone',intro:'The person speaks quickly and the connection is not perfect.',steps:['Say why you are calling.','Ask for the information you need.','Use a repair phrase when you miss something.','Check one important detail by repeating it.','End politely.'],model:'Hello, I’m calling about a booking for next weekend. Could you tell me what time check-in starts? Sorry, I didn’t catch the last part. Could you say that again a little more slowly? So check-in is from three o’clock, is that right? Perfect, thank you very much.',help:'I’m calling about… / Could you tell me…? / I didn’t catch that / Let me check… / Is that right?',twist:'You need the person to spell a name or email address.'},
    {tab:'Travel story',title:'Someone asks about your last holiday',intro:'Turn a simple travel answer into a real conversation.',steps:['Say where you went and when.','Give two details about what you did.','Say what you liked most and why.','Add one small problem or surprise.','Ask the other person about their travel experience.'],model:'I went to Sardinia in September and stayed near the sea. We rented a car and explored the area. What I liked most was the scenery because the coast was beautiful. We also tried local food. Have you ever been to Sardinia?',help:'I went… / We stayed… / What I liked most was… / The only problem was… / Have you ever…?',twist:'They ask whether you would recommend the trip to someone who does not like crowded places.'},
    {tab:'Make plans',title:'You make plans with someone you have just met',intro:'You both mention that you would like to have a coffee or walk later.',steps:['Make a friendly suggestion.','Ask about availability.','Agree on a time and place.','Change the plan once if necessary.','Confirm before ending.'],model:'Would you like to have a coffee tomorrow afternoon? Are you free around three? Great. Shall we meet near the harbour? Actually, if it rains, we could meet at the café opposite the market instead. Perfect — see you tomorrow at three.',help:'Would you like to…? / Are you free…? / Shall we…? / That works for me / If not, we could…',twist:'The other person cannot do the time you suggested. Find another solution naturally.'}
  ];
  let activeRole=0;
  $('#roleplayTabs').innerHTML=roleplays.map((r,i)=>`<button type="button" data-role="${i}">${r.tab}</button>`).join('');
  function renderRole(){
    const r=roleplays[activeRole];
    $('#roleplayCard').innerHTML=`<div class="roleplay-grid"><div><p class="eyebrow">SCENARIO</p><h3>${r.title}</h3><p>${r.intro}</p><ol class="steps">${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol><div class="role-twist"><strong>Round 2 twist:</strong> ${r.twist}</div></div><div><div class="model-box"><strong>Model</strong><br>${r.model}</div><button class="help-toggle" type="button">Show / hide useful language</button><div class="role-help hidden">${r.help}</div><button class="audio-btn role-say" type="button" style="margin-top:.7rem">🔊 Listen to model</button></div></div>`;
    $$('#roleplayTabs button').forEach((b,i)=>b.classList.toggle('active',i===activeRole));
    $('.help-toggle').onclick=()=>$('.role-help').classList.toggle('hidden');
    $('.role-say').onclick=()=>speak(r.model);
  }
  $$('#roleplayTabs button').forEach(b=>b.addEventListener('click',()=>{activeRole=+b.dataset.role;renderRole()}));
  renderRole();

  const sprints=[
    {title:'You do not understand a word',prompt:'Someone uses a word you do not know in the middle of a conversation.',model:'Sorry, what does that word mean? Could you explain it another way?'},
    {title:'A tourist asks what to do',prompt:'They have only one afternoon in the area.',model:'If you only have one afternoon, I’d recommend walking near the harbour and along the coast. It’s easy and you can stop for a drink afterwards.'},
    {title:'Someone speaks too fast',prompt:'You understand the topic but you are losing details.',model:'Sorry, could you speak a little more slowly? I understand the main idea, but I missed the last part.'},
    {title:'You want to join a conversation',prompt:'Two English-speaking people mention a place you know.',model:'Sorry to interrupt — I heard you mention Saint-Gilles. Do you know the area well?'},
    {title:'You need time to answer',prompt:'Someone asks an unexpected question.',model:'That’s a good question. Let me think for a second… I’d probably say…'},
    {title:'You need to end politely',prompt:'The conversation has been nice, but you need to leave.',model:'It was lovely talking to you. I need to go, but maybe I’ll see you around. Enjoy the rest of your day!'}
  ];
  $('#scenarioSprints').innerHTML=sprints.map((s,i)=>`<article class="sprint-card"><span class="sprint-label">SPRINT ${i+1}</span><h4>${s.title}</h4><p>${s.prompt}</p><button type="button" data-sprint="${i}">See a natural model</button><div class="sprint-model">${s.model}<br><button class="audio-btn sprint-say" data-sprint-say="${i}" type="button" style="margin-top:.55rem">🔊 Listen</button></div></article>`).join('');
  $$('[data-sprint]').forEach(b=>b.addEventListener('click',()=>b.closest('.sprint-card').classList.toggle('open')));
  $$('[data-sprint-say]').forEach(b=>b.addEventListener('click',()=>speak(sprints[+b.dataset.sprintSay].model)));

  $$('.timer').forEach(timer=>{
    const total=+timer.dataset.seconds;
    let left=total,id=null;
    const display=timer.querySelector('strong');
    const render=()=>{display.textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0')};
    render();
    timer.querySelector('.timer-start').onclick=()=>{
      if(id)return;
      id=setInterval(()=>{left--;render();if(left<=0){clearInterval(id);id=null;toast('Time! Well done.')}},1000);
    };
    timer.querySelector('.timer-reset').onclick=()=>{clearInterval(id);id=null;left=total;render()};
  });

  $$('.habit').forEach((cb,i)=>{
    cb.checked=(state.habits||[]).includes(i);
    cb.addEventListener('change',()=>{state.habits=$$('.habit').map((x,j)=>x.checked?j:null).filter(x=>x!==null);save()});
  });
  $('#promiseText').value=state.promise||'';
  $('#promiseText').addEventListener('input',e=>{state.promise=e.target.value;save()});
  $('#speakPromise').onclick=()=>{const t=$('#promiseText').value.trim();if(!t){toast('Write your promise first.');return;}speak(t)};
  $$('[data-reflect]').forEach(t=>{
    t.value=(state.reflection||{})[t.dataset.reflect]||'';
    t.addEventListener('input',()=>{state.reflection[t.dataset.reflect]=t.value;save()});
  });

  const qDefs=[
    ['Use conversation strategies to react, add information and ask a follow-up question','Conversation lab'],
    ['Recall useful vocabulary for everyday, travel and customer-service communication','Vocabulary toolbox'],
    ['Recognise tense clues and choose a useful form','Practical English review'],
    ['Repair common grammar and communication problems','Quick repair lab'],
    ['Handle realistic spoken situations with greater autonomy','Real-life role-play'],
    ['Recover when communication becomes difficult','Reaction sprints'],
    ['Identify a realistic way to continue English after training','Next-chapter plan'],
    ['Reflect on progress and describe future goals','Final reflection']
  ];
  const statuses=['Non commencé','En cours','Acquis','Non acquis'];
  $('#qualiopiRows').innerHTML=qDefs.map((q,i)=>`<tr><td><strong>${q[0]}</strong></td><td>${q[1]}</td><td>${i<4?'Interactive + observation':'Manual observation'}</td><td><select data-qstatus="${i}">${statuses.map(s=>`<option ${((state.qualiopi||{})[i]||'En cours')===s?'selected':''}>${s}</option>`).join('')}</select></td></tr>`).join('');
  $$('[data-qstatus]').forEach(s=>s.addEventListener('change',()=>{state.qualiopi[s.dataset.qstatus]=s.value;save()}));
  $('#trainerComments').value=state.comments||'';
  $('#trainerComments').addEventListener('input',e=>{state.comments=e.target.value;save()});
  $('#saveProgress').onclick=()=>{save();$('#saveStatus').textContent='Saved '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});toast('Progress saved in this browser.')};
  $('#downloadProgress').onclick=()=>{
    const lines=['Karine — Final Celebration Lesson','Final pedagogical trace','',...qDefs.map((q,i)=>`${q[0]} — ${(state.qualiopi||{})[i]||'En cours'}`),'','Trainer comments:',state.comments||'','',`English promise: ${state.promise||''}`];
    const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='Karine-final-session-summary.txt';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),500);
  };

  $('#resetAll').onclick=()=>{
    if(!confirm('Reset the saved answers and progress on this page?'))return;
    localStorage.removeItem(STORE);
    location.reload();
  };
})();
