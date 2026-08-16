(() => {
  'use strict';

  const STORAGE_KEY = 'karineSardiniaTravelStudioSession3V1';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const norm = s => String(s ?? '').trim().toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shuffle = arr => { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };

  const state = {
    answers: {}, fills: {}, fillChecked: {}, sort: {}, sortChecked:false,
    builder: [], ttsLang:'en-GB', selectedSort:null
  };

  const vocab = {
    hotel:[
      ['half board','demi-pension','Our booking includes half board.'],
      ['a sea-view room','une chambre avec vue sur mer','Could you confirm that we have a sea-view room?'],
      ['check-in / check-out','arrivée / départ','What time is check-in?'],
      ['a refundable deposit','une caution remboursable','There is a refundable deposit for the beach towels.'],
      ['a double room','une chambre double','We booked a double room for seven nights.'],
      ['to be included','être compris / inclus','Are drinks included at dinner?'],
      ['on-site parking','parking sur place','Is there on-site parking?'],
      ['a room key / key card','clé / carte de chambre','Could I have another key card, please?']
    ],
    car:[
      ['an eight-seater','un véhicule 8 places','We reserved an eight-seater vehicle.'],
      ['an additional driver','un conducteur supplémentaire','Can we add an additional driver?'],
      ['the deposit','la caution','How much is the deposit?'],
      ['the excess / deductible','la franchise','What is the insurance excess?'],
      ['full-to-full','plein à plein','Is the fuel policy full-to-full?'],
      ['roadside assistance','assistance routière','Does the insurance include roadside assistance?'],
      ['existing damage','dégâts existants','Could you note this existing damage, please?'],
      ['the drop-off point','le lieu de restitution','Where is the drop-off point?']
    ],
    restaurant:[
      ['a table for six','une table pour six','Could I book a table for six?'],
      ['sparkling water','eau gazeuse','Could we have some sparkling water?'],
      ['still water','eau plate','We’d like a bottle of still water.'],
      ['a local speciality','une spécialité locale','What local speciality would you recommend?'],
      ['to contain','contenir','Does this dish contain nuts?'],
      ['the bill / check','l’addition','Could we have the bill, please?'],
      ['a side dish','un accompagnement','What side dishes are available?'],
      ['well done / medium / rare','bien cuit / à point / saignant','I’d like it medium, please.']
    ],
    explore:[
      ['a boat trip','une excursion en bateau','We’d like to take a boat trip.'],
      ['a cove','une crique','Is there a quiet cove nearby?'],
      ['a viewpoint','un point de vue','Is the viewpoint easy to reach by car?'],
      ['the old town','la vieille ville','We’re going to walk around the old town.'],
      ['a market','un marché','What day is the local market?'],
      ['to snorkel','faire du snorkeling','Can we snorkel there?'],
      ['a day trip','une excursion à la journée','Could you recommend a day trip from Olbia?'],
      ['to book in advance','réserver à l’avance','Do we need to book in advance?']
    ],
    problems:[
      ['There seems to be a problem.','Il semble y avoir un problème.','There seems to be a problem with our room.'],
      ['Could you check…?','Pourriez-vous vérifier… ?','Could you check the reservation, please?'],
      ['We booked…, but…','Nous avons réservé…, mais…','We booked a sea-view room, but this room faces the car park.'],
      ['Would it be possible to…?','Serait-il possible de… ?','Would it be possible to change rooms?'],
      ['I think there may be a mistake.','Je pense qu’il y a peut-être une erreur.','I think there may be a mistake with the booking.'],
      ['Could you explain…?','Pourriez-vous expliquer… ?','Could you explain this extra charge, please?'],
      ['I’m afraid…','Malheureusement / je crains que…','I’m afraid the air conditioning isn’t working.'],
      ['What can we do?','Que pouvons-nous faire ?','The tyre is flat. What can we do?']
    ]
  };

  const quizzes = {
    trip:[
      {p:'You want to say “demi-pension”.',o:['full pension','half board','half pension'],a:'half board',why:'Half board normally means breakfast plus one main meal, often dinner.',hint:'Do not translate “pension” literally.'},
      {p:'You want to describe “un hôtel sur une falaise”.',o:['a hotel under a cliff','a hotel on a cliff','a cliff hotel inside'],a:'a hotel on a cliff',why:'“On a cliff” is the natural basic form; “perched on a cliff” is a more descriptive option.',hint:'Use on for position on the cliff.'},
      {p:'Your room has “vue sur mer”.',o:['a sea view room','a sea-view room','a room sea viewing'],a:'a sea-view room',why:'Sea-view works as a compound adjective before room.',hint:'Think: type of room.'},
      {p:'You have “un véhicule 8 places”.',o:['an eight-seater vehicle','an eight places car','a vehicle of eight chairs'],a:'an eight-seater vehicle',why:'An eight-seater is a vehicle with seating for eight people.',hint:'The noun is “seater”.'},
      {p:'You are travelling for pleasure, not for work.',o:['I’m on a business trip.','I’m travelling for pleasure.','I’m making a professional voyage.'],a:'I’m travelling for pleasure.',why:'This naturally communicates a leisure/private trip.',hint:'“Voyage” is rarely used for a normal holiday.'},
      {p:'You stay from 20 to 27 September.',o:['We’re staying seven nights.','We stay during seven nights.','We’re staying since seven nights.'],a:'We’re staying seven nights.',why:'Use “for seven nights” or simply “seven nights”.',hint:'Duration → for + period.'},
      {p:'You want a more elegant description of the hotel.',o:['The hotel is perched on a cliff overlooking the sea.','The hotel is planted at a cliff seeing sea.','The hotel sits in a cliff and watches the sea.'],a:'The hotel is perched on a cliff overlooking the sea.',why:'“Perched on a cliff overlooking the sea” is natural descriptive English.',hint:'Look for “overlooking”.'},
      {p:'You want to state your travel dates naturally.',o:['We’re staying from September 20th to 27th.','We stay between September 20 until 27.','We are there since 20 to 27 September.'],a:'We’re staying from September 20th to 27th.',why:'Use from … to … for a date range.',hint:'from + start + to + end'}
    ],
    question:[
      {p:'You want to know if the hotel has parking.',o:['Is there parking at the hotel?','Does there parking at the hotel?','Have there parking at the hotel?'],a:'Is there parking at the hotel?',why:'Parking is uncountable here, so “Is there…?” works.',hint:'One service / uncountable.'},
      {p:'You want to know if there are restaurants near the hotel.',o:['Is there any restaurants nearby?','Are there any restaurants nearby?','Do there have restaurants nearby?'],a:'Are there any restaurants nearby?',why:'Restaurants is plural → Are there…?',hint:'Plural → are.'},
      {p:'Ask the rental company if an automatic vehicle is available.',o:['Do you have an automatic eight-seater?','Are you have an automatic eight-seater?','Have you an automatic eight-seater?'],a:'Do you have an automatic eight-seater?',why:'Do you have…? is the standard service question.',hint:'Ask the company directly.'},
      {p:'Check whether dinner is included.',o:['Does the price includes dinner?','Does the price include dinner?','Do the price include dinner?'],a:'Does the price include dinner?',why:'After does, use the base verb: include.',hint:'Does + subject + base verb.'},
      {p:'Make “Confirm the room type” polite.',o:['Could you confirm the room type, please?','Could you to confirm the room type?','Do you could confirm the room type?'],a:'Could you confirm the room type, please?',why:'Could you + base verb is a polite request.',hint:'No “to” after could.'},
      {p:'Ask if early check-in is possible.',o:['Would it be possible to check in early?','Would it possible check in early?','Is possible we to check in early?'],a:'Would it be possible to check in early?',why:'Would it be possible to + verb is a useful polite frame.',hint:'Would it be possible to…?'},
      {p:'Ask about beach towels.',o:['Are there beach towels available?','Is there beach towels available?','Does there have beach towels?'],a:'Are there beach towels available?',why:'Towels is plural.',hint:'Plural noun.'},
      {p:'Ask if insurance includes roadside assistance.',o:['Does the insurance include roadside assistance?','Does the insurance includes roadside assistance?','Is the insurance include roadside assistance?'],a:'Does the insurance include roadside assistance?',why:'Does + singular subject + base verb.',hint:'Watch the verb after does.'},
      {p:'Ask the restaurant for a table for six.',o:['Do you have a table for six at eight?','Are there you a table for six?','Does you have a table for six?'],a:'Do you have a table for six at eight?',why:'Do you have…? is direct and natural.',hint:'Speak to the restaurant as “you”.'},
      {p:'Ask a receptionist to recommend a day trip.',o:['Could you recommend a day trip from Olbia?','Could you to recommend a day trip from Olbia?','Do you can recommend a day trip from Olbia?'],a:'Could you recommend a day trip from Olbia?',why:'Could you + base verb.',hint:'Could + base verb.'}
    ],
    future:[
      {p:'The hotel is already booked.',o:['We’re staying near Olbia for seven nights.','We’re stay near Olbia for seven nights.','We would stay near Olbia now.'],a:'We’re staying near Olbia for seven nights.',why:'Present continuous works for a fixed arrangement.',hint:'Booked arrangement.'},
      {p:'You have decided to explore the coast, but not every detail is fixed.',o:['We’re going to explore the coast by car.','We explore going the coast by car.','We would like explored the coast.'],a:'We’re going to explore the coast by car.',why:'Be going to + base verb expresses a plan/intention.',hint:'Plan/intention.'},
      {p:'Tavolara interests you, but you have not booked anything.',o:['I’d like to visit Tavolara.','I’m visiting Tavolara yesterday.','I would like visit Tavolara.'],a:'I’d like to visit Tavolara.',why:'Would like to + base verb expresses a preference.',hint:'Preference, not fixed.'},
      {p:'The rental car collection is reserved for arrival day.',o:['We’re picking up the car at the airport.','We pick up going the car.','We would picking up the car.'],a:'We’re picking up the car at the airport.',why:'Present continuous is natural for an arranged future action.',hint:'Reservation / arrangement.'},
      {p:'Choose the correct “going to” form.',o:['We’re going to rent an eight-seater.','We going to rent an eight-seater.','We’re going rent an eight-seater.'],a:'We’re going to rent an eight-seater.',why:'be + going to + base verb.',hint:'am/is/are + going to + verb.'},
      {p:'Choose the correct preference.',o:['We’d like a table outside.','We’d like to a table outside.','We like would a table outside.'],a:'We’d like a table outside.',why:'Would like + noun; no “to” before a noun.',hint:'Noun after would like.'},
      {p:'Choose the correct preference with a verb.',o:['I’d like to try a local dish.','I’d like try a local dish.','I’d like trying to a local dish.'],a:'I’d like to try a local dish.',why:'Would like + to + base verb.',hint:'Verb → to + verb.'},
      {p:'A boat tour is already booked for Tuesday.',o:['We’re taking a boat tour on Tuesday.','We’re going take a boat tour Tuesday.','We would taking a boat tour on Tuesday.'],a:'We’re taking a boat tour on Tuesday.',why:'Present continuous is natural for a fixed arrangement.',hint:'Fixed date + booking.'}
    ],
    quantity:[
      {p:'Do you have ___ vegetarian dishes?',o:['some','any','much'],a:'any',why:'Any is common in questions.',hint:'Question → usually any.'},
      {p:'There is ___ bottled water in the room.',o:['some','many','any'],a:'some',why:'Some is common in positive statements.',hint:'Positive statement.'},
      {p:'How ___ people is the reservation for?',o:['much','many','some'],a:'many',why:'People are countable plural.',hint:'Countable plural.'},
      {p:'How ___ is the deposit?',o:['many','much','any'],a:'much',why:'How much asks about an amount or price.',hint:'Amount / price.'},
      {p:'Would you like ___ bread?',o:['some','any','many'],a:'some',why:'Some is natural in offers.',hint:'Offer.'},
      {p:'There aren’t ___ shops near the hotel.',o:['some','any','much'],a:'any',why:'Any is common in negatives.',hint:'Negative sentence.'},
      {p:'How ___ bags do you have?',o:['many','much','some'],a:'many',why:'Bags are countable.',hint:'You can count bags.'},
      {p:'How ___ water would you like?',o:['many','much','any'],a:'much',why:'Water is uncountable.',hint:'Uncountable noun.'}
    ],
    hotel:[
      {p:'How long is the stay?',o:['Five nights','Seven nights','Ten nights'],a:'Seven nights',why:'The guest says the stay is from the 20th to the 27th: seven nights.'},
      {p:'What room type is confirmed?',o:['A garden-view single room','A sea-view double room','A family suite with no view'],a:'A sea-view double room',why:'The receptionist confirms a sea-view double room.'},
      {p:'What does half board include in the dialogue?',o:['Breakfast and dinner','Breakfast and lunch','All meals and drinks'],a:'Breakfast and dinner',why:'Breakfast and dinner are included.'},
      {p:'Are drinks at dinner included?',o:['Yes, all drinks','No','Only coffee'],a:'No',why:'The receptionist says drinks at dinner are not included.'},
      {p:'How much is the beach-towel deposit?',o:['€10','€50','There is no deposit'],a:'€10',why:'A €10 refundable deposit is required.'},
      {p:'Is parking free for hotel guests?',o:['Yes','No','Not mentioned'],a:'Yes',why:'The receptionist confirms free parking.'}
    ],
    car:[
      {p:'What vehicle was reserved?',o:['A two-seater sports car','An eight-seater vehicle','A motorbike'],a:'An eight-seater vehicle',why:'The customer reserved an eight-seater.'},
      {p:'Is the vehicle automatic?',o:['Yes','No','The agent does not know'],a:'Yes',why:'The agent confirms it is automatic.'},
      {p:'What driver is included?',o:['One main driver','Three drivers','No driver is allowed'],a:'One main driver',why:'The booking includes one main driver.'},
      {p:'Can an additional driver be added?',o:['No','Yes, for an additional charge','Yes, always free'],a:'Yes, for an additional charge',why:'The agent says a second driver costs extra.'},
      {p:'What is the fuel policy?',o:['Empty-to-empty','Full-to-full','Fuel is included'],a:'Full-to-full',why:'Return the vehicle with a full tank.'},
      {p:'How much is the deposit?',o:['€60','€600','€6,000'],a:'€600',why:'The dialogue gives a €600 deposit.'}
    ],
    discover:[
      {p:'You want a culture break in town, with a basilica and museum.',o:['Olbia','Tavolara','La Maddalena only'],a:'Olbia',why:'The Olbia card mentions San Simplicio and the archaeological museum.'},
      {p:'You want a beach day with the possibility of a boat trip and snorkelling.',o:['Porto Istana / Tavolara','Olbia old town','San Pantaleo market only'],a:'Porto Istana / Tavolara',why:'This option combines beach, water and island activities.'},
      {p:'You enjoy artisan villages and dramatic granite scenery.',o:['San Pantaleo','Olbia Airport','The rental desk'],a:'San Pantaleo',why:'San Pantaleo is known for its village atmosphere and Gallura granite setting.'},
      {p:'You want luxury-coast scenery and places such as Porto Cervo.',o:['Costa Smeralda','Caprera only','Olbia museum'],a:'Costa Smeralda',why:'Porto Cervo is a key Costa Smeralda destination.'},
      {p:'You want an archipelago day with nature, coves and history.',o:['La Maddalena / Caprera','San Simplicio','Corso Umberto only'],a:'La Maddalena / Caprera',why:'The national park offers islands, nature, hiking and historical sites.'},
      {p:'Which question is best before a park or boat excursion?',o:['Do we need to book in advance?','Do we must booking before?','Are we need reservation previous?'],a:'Do we need to book in advance?',why:'Do we need to + verb is natural and practical.'}
    ],
    restaurant:[
      {p:'Book a table politely.',o:['I want table six people.','Could I book a table for six, please?','Give us table for six.'],a:'Could I book a table for six, please?',why:'Could I…? is polite and natural.',hint:'Use “table for + number”.'},
      {p:'Ask for a local recommendation.',o:['What would you recommend?','What you recommend me?','What do you advice?'],a:'What would you recommend?',why:'This is a natural restaurant question.',hint:'Would + subject + base verb.'},
      {p:'Order a dish politely.',o:['I’d like the grilled fish, please.','I like to the grilled fish.','I will want grilled fish.'],a:'I’d like the grilled fish, please.',why:'I’d like + noun is a standard polite order.',hint:'Would like + noun.'},
      {p:'Ask about nuts.',o:['Does this dish contain nuts?','Is this dish contains nuts?','Does this dish contains nuts?'],a:'Does this dish contain nuts?',why:'After does, use base verb “contain”.',hint:'Does + subject + base verb.'},
      {p:'Ask for the bill.',o:['Could we have the bill, please?','Could we to have bill?','We can bill now?'],a:'Could we have the bill, please?',why:'Could we have…? is polite and natural.',hint:'Could + base verb.'},
      {p:'Ask for water for the table.',o:['Could we have some sparkling water?','Could we have any sparkling waters?','Give sparkling water us.'],a:'Could we have some sparkling water?',why:'Some is natural in a polite request/offer context.',hint:'Polite request.'},
      {p:'You want to try something typical.',o:['We’d like to try a local speciality.','We’d like try a speciality local.','We like tasting something typical local.'],a:'We’d like to try a local speciality.',why:'Would like to + verb; adjective before noun.',hint:'would like to try'},
      {p:'Ask if there are vegetarian choices.',o:['Are there any vegetarian options?','Is there any vegetarian options?','Does there vegetarian options?'],a:'Are there any vegetarian options?',why:'Options is plural → Are there…?',hint:'Plural.'}
    ],
    challenge:[
      {p:'At hotel reception: confirm half board.',o:['Could you confirm what half board includes?','Could you confirm what includes half board?','Can you to confirm half board?'],a:'Could you confirm what half board includes?',why:'Embedded question order is “what half board includes”.'},
      {p:'At the rental desk: ask about deposit.',o:['How much is the deposit?','How many is the deposit?','What many costs the deposit?'],a:'How much is the deposit?',why:'Price/amount → how much.'},
      {p:'Your fixed hotel arrangement.',o:['We’re staying near Olbia for seven nights.','We going to staying near Olbia.','We would stay near Olbia booked.'],a:'We’re staying near Olbia for seven nights.',why:'Present continuous fits a fixed arrangement.'},
      {p:'Ask about nearby restaurants.',o:['Are there any restaurants nearby?','Is there some restaurants nearby?','Do there have restaurants nearby?'],a:'Are there any restaurants nearby?',why:'Plural + question → Are there any…?'},
      {p:'Ask for a recommendation.',o:['What would you recommend?','What do you would recommend?','What you could recommend me?'],a:'What would you recommend?',why:'Would + subject + base verb.'},
      {p:'Report the room-view problem.',o:['We booked a sea-view room, but this room faces the car park.','We reserved sea viewing but we see parking.','We have booked view sea and this faces cars park.'],a:'We booked a sea-view room, but this room faces the car park.',why:'Clear contrast and natural room vocabulary.'},
      {p:'Ask about additional driver cost.',o:['How much does it cost to add another driver?','How much it costs add another driver?','How many cost another driver?'],a:'How much does it cost to add another driver?',why:'How much does it cost to + verb?'},
      {p:'Ask if advance booking is necessary.',o:['Do we need to book in advance?','Do we need booking in before?','Are we need to reserve before?'],a:'Do we need to book in advance?',why:'Need to + base verb.'}
    ]
  };

  const fills = {
    questionFill:[
      {before:'___ there parking at the hotel?',answers:['is'],display:'Is',why:'Parking is uncountable here → Is there…?'},
      {before:'___ there any restaurants nearby?',answers:['are'],display:'Are',why:'Restaurants is plural → Are there…?'},
      {before:'___ you have an automatic eight-seater?',answers:['do'],display:'Do',why:'Do you have…?'},
      {before:'___ the price include dinner?',answers:['does'],display:'Does',why:'Does + singular subject + base verb.'},
      {before:'Could you ___ the booking, please?',answers:['confirm','check'],display:'confirm / check',why:'Could + base verb.'},
      {before:'Would it be possible to ___ in early?',answers:['check'],display:'check',why:'check in is the phrasal verb.'},
      {before:'How ___ is the deposit?',answers:['much'],display:'much',why:'Amount/price → how much.'},
      {before:'Do we need to book in ___?',answers:['advance'],display:'advance',why:'The phrase is “in advance”.'}
    ]
  };

  const sortItems = [
    {t:'sea-view room',c:'Hotel'}, {t:'half board',c:'Hotel'}, {t:'key card',c:'Hotel'},
    {t:'fuel policy',c:'Car rental'}, {t:'additional driver',c:'Car rental'}, {t:'deposit',c:'Car rental'},
    {t:'table for six',c:'Restaurant'}, {t:'sparkling water',c:'Restaurant'}, {t:'the bill',c:'Restaurant'},
    {t:'boat trip',c:'Explore'}, {t:'viewpoint',c:'Explore'}, {t:'book in advance',c:'Explore'}
  ];
  const sortCats=['Hotel','Car rental','Restaurant','Explore'];

  const groupMeta = {
    trip:{label:'Trip language QCM',type:'QCM',total:8},
    sort:{label:'Vocabulary sorting',type:'Drag / click sort',total:12},
    question:{label:'Polite questions QCM',type:'QCM',total:10},
    questionFill:{label:'Question frames',type:'Fill in',total:8},
    future:{label:'Future plans & arrangements',type:'QCM',total:8},
    quantity:{label:'Some / any / much / many',type:'QCM',total:8},
    hotel:{label:'Hotel listening',type:'Listening QCM',total:6},
    car:{label:'Car-rental listening',type:'Listening QCM',total:6},
    discover:{label:'Sardinia travel reading',type:'Reading QCM',total:6},
    restaurant:{label:'Restaurant English',type:'QCM',total:8},
    challenge:{label:'Travel confidence challenge',type:'Mixed QCM',total:8}
  };

  const quizTargets = {
    trip:'tripQuiz',question:'questionQuiz',future:'futureQuiz',quantity:'quantityQuiz',hotel:'hotelQuiz',car:'carQuiz',discover:'discoverQuiz',restaurant:'restaurantQuiz',challenge:'challengeQuiz'
  };

  function renderVocab(cat='hotel'){
    const grid=$('#vocabGrid'); if(!grid) return;
    grid.innerHTML=vocab[cat].map(([word,fr,ex])=>`<article class="vocab-card"><span class="vocab-word">${esc(word)}</span><span class="vocab-fr fr">${esc(fr)}</span><p>${esc(ex)}</p><button class="icon-btn speak" type="button" data-speak="${esc(ex)}">▶ Listen</button></article>`).join('');
    $$('.vocab-tab').forEach(b=>b.classList.toggle('active',b.dataset.vocab===cat));
  }

  function renderQuiz(group){
    const root=$('#'+quizTargets[group]); if(!root) return;
    root.innerHTML='';
    quizzes[group].forEach((q,i)=>{
      const key=`${group}:${i}`;
      const selected=state.answers[key];
      const choices=shuffle(q.o);
      const item=document.createElement('article'); item.className='quiz-item';
      item.innerHTML=`<div><span class="q-number">${i+1}</span><span class="q-prompt">${esc(q.p)}</span></div>${q.hint?`<span class="q-hint">Hint: ${esc(q.hint)}</span>`:''}<div class="options"></div><p class="feedback" aria-live="polite"></p>`;
      const opts=$('.options',item), fb=$('.feedback',item);
      choices.forEach(choice=>{
        const b=document.createElement('button'); b.type='button'; b.className='option-btn'; b.textContent=choice;
        if(selected!==undefined){
          if(choice===q.a) b.classList.add('correct');
          if(choice===selected && selected!==q.a) b.classList.add('wrong');
        }
        b.addEventListener('click',()=>{
          state.answers[key]=choice;
          $$('.option-btn',item).forEach(x=>{x.classList.remove('correct','wrong'); if(x.textContent===q.a)x.classList.add('correct'); if(x.textContent===choice&&choice!==q.a)x.classList.add('wrong');});
          fb.textContent=(choice===q.a?'✓ Correct. ':'✗ Not quite. ')+q.why; fb.className='feedback '+(choice===q.a?'good':'bad');
          updateAll(); persist(false);
        });
        opts.appendChild(b);
      });
      if(selected!==undefined){fb.textContent=(selected===q.a?'✓ Correct. ':'✗ Not quite. ')+q.why;fb.className='feedback '+(selected===q.a?'good':'bad');}
      root.appendChild(item);
    });
    updateAll();
  }

  function renderFills(group='questionFill'){
    const root=$('#questionFill'); if(!root) return;
    root.innerHTML='';
    fills[group].forEach((q,i)=>{
      const key=`${group}:${i}`;
      const val=state.fills[key]||'';
      const checked=!!state.fillChecked[key];
      const good=q.answers.includes(norm(val));
      const item=document.createElement('article'); item.className='fill-item';
      const parts=q.before.split('___');
      item.innerHTML=`<div class="fill-line"><span class="q-number">${i+1}</span><span>${esc(parts[0])}</span><input aria-label="Answer ${i+1}" value="${esc(val)}" /><span>${esc(parts[1]||'')}</span><button class="check-fill" type="button">Check</button></div><p class="feedback ${checked?(good?'good':'bad'):''}">${checked?(good?'✓ Correct. ':'✗ Answer: '+q.display+'. ')+q.why:''}</p>`;
      const input=$('input',item), fb=$('.feedback',item);
      input.addEventListener('input',()=>{state.fills[key]=input.value; state.fillChecked[key]=false; fb.textContent=''; fb.className='feedback'; updateAll(); persist(false);});
      $('.check-fill',item).addEventListener('click',()=>{state.fills[key]=input.value;state.fillChecked[key]=true;const ok=q.answers.includes(norm(input.value));fb.textContent=(ok?'✓ Correct. ':'✗ Answer: '+q.display+'. ')+q.why;fb.className='feedback '+(ok?'good':'bad');updateAll();persist(false);});
      root.appendChild(item);
    });
    updateAll();
  }

  function renderSort(){
    const bank=$('#sortBank'), zones=$('#sortZones'); if(!bank||!zones) return;
    bank.innerHTML=''; zones.innerHTML='';
    sortCats.forEach(cat=>{
      const z=document.createElement('div');z.className='sort-zone';z.dataset.cat=cat;z.innerHTML=`<h4>${esc(cat)}</h4><div class="zone-items"></div>`;
      z.addEventListener('click',e=>{if(e.target.closest('.sort-chip'))return;if(state.selectedSort){state.sort[state.selectedSort]=cat;state.selectedSort=null;renderSort();updateAll();persist(false);}});
      z.addEventListener('dragover',e=>e.preventDefault());
      z.addEventListener('drop',e=>{e.preventDefault();const t=e.dataTransfer.getData('text/plain');if(t){state.sort[t]=cat;state.selectedSort=null;renderSort();updateAll();persist(false);}});
      zones.appendChild(z);
    });
    sortItems.forEach(it=>{
      const b=document.createElement('button');b.type='button';b.className='sort-chip';b.draggable=true;b.textContent=it.t;b.dataset.item=it.t;
      if(state.selectedSort===it.t)b.classList.add('selected');
      b.addEventListener('click',e=>{e.stopPropagation();state.selectedSort=state.selectedSort===it.t?null:it.t;renderSort();});
      b.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',it.t));
      const cat=state.sort[it.t]; const destination=cat?$(`.sort-zone[data-cat="${CSS.escape(cat)}"] .zone-items`):bank; destination.appendChild(b);
    });
    if(state.sortChecked){
      sortCats.forEach(cat=>{
        const z=$(`.sort-zone[data-cat="${CSS.escape(cat)}"]`);
        const inCat=sortItems.filter(x=>state.sort[x.t]===cat); if(inCat.length&&inCat.every(x=>x.c===cat))z.classList.add('correct');
      });
      const s=getGroupScore('sort'); $('#sortFeedback').textContent=`${s.correct}/${s.total} correct. ${s.correct===s.total?'Excellent — every phrase is in the right travel pocket.':'Move the phrases that do not fit, then check again.'}`; $('#sortFeedback').className='feedback '+(s.correct===s.total?'good':'bad');
    } else { $('#sortFeedback').textContent=''; $('#sortFeedback').className='feedback'; }
  }

  function renderBuilder(){
    const root=$('#questionBuilder'); if(!root) return;
    const target=['Could','you','confirm','that','breakfast','and','dinner','are','included','?'];
    const current=state.builder||[];
    const remaining=[]; const usedCounts={}; current.forEach(w=>usedCounts[w]=(usedCounts[w]||0)+1);
    const all=target.slice(0,-1).concat(['?']);
    const allShuffled=['included','Could','breakfast','confirm','you','dinner','that','are','and','?'];
    const remCounts={...usedCounts};
    allShuffled.forEach(w=>{if(remCounts[w])remCounts[w]--;else remaining.push(w);});
    root.innerHTML=`<div class="word-bank"></div><div class="sentence-slot"></div><div class="builder-actions"><button class="small-btn" data-act="check" type="button">Check sentence</button><button class="small-btn" data-act="reset" type="button">Reset</button></div><p class="feedback" id="builderFeedback"></p>`;
    const bank=$('.word-bank',root), slot=$('.sentence-slot',root);
    remaining.forEach(w=>{const b=document.createElement('button');b.type='button';b.className='word-chip';b.textContent=w;b.addEventListener('click',()=>{state.builder.push(w);renderBuilder();persist(false)});bank.appendChild(b)});
    current.forEach((w,idx)=>{const b=document.createElement('button');b.type='button';b.className='word-chip';b.textContent=w;b.addEventListener('click',()=>{state.builder.splice(idx,1);renderBuilder();persist(false)});slot.appendChild(b)});
    $('[data-act="check"]',root).addEventListener('click',()=>{const ok=current.join(' ')===target.join(' ');const f=$('#builderFeedback');f.textContent=ok?'✓ Perfect: Could you confirm that breakfast and dinner are included?':'Not yet. Start with “Could you…?” and keep normal statement order after “confirm that…”.';f.className='feedback '+(ok?'good':'bad');});
    $('[data-act="reset"]',root).addEventListener('click',()=>{state.builder=[];renderBuilder();persist(false)});
  }

  function getGroupScore(group){
    if(group==='sort'){
      let correct=0,attempted=0;sortItems.forEach(it=>{if(state.sort[it.t]){attempted++;if(state.sort[it.t]===it.c)correct++;}});return{correct,attempted,total:sortItems.length};
    }
    if(group==='questionFill'){
      let correct=0,attempted=0;fills.questionFill.forEach((q,i)=>{const k=`questionFill:${i}`;if(state.fillChecked[k]){attempted++;if(q.answers.includes(norm(state.fills[k])))correct++;}});return{correct,attempted,total:qTotal(group)};
    }
    const qs=quizzes[group]||[];let correct=0,attempted=0;qs.forEach((q,i)=>{const k=`${group}:${i}`;if(state.answers[k]!==undefined){attempted++;if(state.answers[k]===q.a)correct++;}});return{correct,attempted,total:qs.length};
  }
  function qTotal(group){return groupMeta[group]?.total||0;}
  function getScores(){const out={};Object.keys(groupMeta).forEach(g=>out[g]=getGroupScore(g));return out;}
  function autoTotals(){const scores=getScores();let correct=0,attempted=0,total=0;Object.values(scores).forEach(s=>{correct+=s.correct;attempted+=s.attempted;total+=s.total});return{correct,attempted,total};}
  function statusFor(s){
    if(!s.attempted)return['Non commencé','none'];
    const pct=s.correct/s.total*100;
    if(s.attempted===s.total && pct>=75)return['Acquis','done'];
    if(s.attempted===s.total && pct<50)return['Non acquis','low'];
    return['En cours','progress'];
  }

  function updateAll(){
    const scores=getScores();
    Object.entries(groupMeta).forEach(([g,m])=>{const el=$('#'+g+'-score');if(el){const s=scores[g];el.textContent=`${s.correct} / ${s.total}`;}});
    const a=autoTotals();const pct=a.total?Math.round(a.correct/a.total*100):0;
    $('#globalScore').textContent=pct+'%'; $('#globalDone').textContent=`${a.attempted} / ${a.total}`;
    $('#globalStatus').textContent=a.attempted===0?'Not started':a.attempted<a.total?'In progress':pct>=75?'Acquired':'Review needed';
    $('#reportAutoPercent').textContent=pct+'%';
    const body=$('#autoReportBody');if(body){body.innerHTML=Object.entries(groupMeta).map(([g,m])=>{const s=scores[g],st=statusFor(s);return`<tr><td><strong>${esc(m.label)}</strong><br><small>${esc(m.type)}</small></td><td>${s.correct} / ${s.total}</td><td>${s.attempted} / ${s.total}</td><td><span class="status-pill ${st[1]}">${st[0]}</span></td></tr>`}).join('');}
    updateManualScores();
  }

  function manualStats(prefix,count){
    let sum=0,n=0;for(let i=1;i<=count;i++){const el=$(`#${prefix}Score${i}`);if(el&&el.value!==''){sum+=Number(el.value);n++;}}
    return{sum,n,max:n*4,pct:n?Math.round(sum/(n*4)*100):null};
  }
  function updateManualScores(){
    const oral=manualStats('oral',4), writing=manualStats('writing',3), auto=autoTotals();
    $('#reportOralPercent').textContent=oral.pct===null?'—':oral.pct+'%'; $('#reportWritingPercent').textContent=writing.pct===null?'—':writing.pct+'%';
    const sum=auto.correct+oral.sum+writing.sum; const max=auto.total+oral.max+writing.max; const overall=max?Math.round(sum/max*100):0; $('#reportOverallPercent').textContent=overall+'%';
  }

  function initSelects(){
    const statuses=['','En cours','Acquis','Non acquis','Non commencé'];
    $$('.status-select').forEach(s=>{if(!s.options.length){statuses.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v||'—';s.appendChild(o);});}});
    $$('.manual-score').forEach(s=>{if(!s.options.length){['',0,1,2,3,4].forEach(v=>{const o=document.createElement('option');o.value=String(v);o.textContent=v===''?'—':`${v} / 4`;s.appendChild(o);});}s.addEventListener('change',()=>{updateAll();persist(false)});});
  }

  function initTranslation(){const btn=$('#translationToggle');btn.addEventListener('click',()=>{const on=document.body.classList.toggle('show-fr');btn.textContent=on?'FR ON':'FR OFF';btn.setAttribute('aria-pressed',String(on));localStorage.setItem(STORAGE_KEY+':fr',on?'1':'0');});if(localStorage.getItem(STORAGE_KEY+':fr')==='1'){document.body.classList.add('show-fr');btn.textContent='FR ON';btn.setAttribute('aria-pressed','true');}}
  function initHints(){const b=$('#practiceToggle');const saved=localStorage.getItem(STORAGE_KEY+':hints');const on=saved!=='0';document.body.classList.toggle('hints-off',!on);b.textContent=on?'Hints ON':'Hints OFF';b.setAttribute('aria-pressed',String(on));b.addEventListener('click',()=>{const now=document.body.classList.toggle('hints-off');const hintsOn=!now;b.textContent=hintsOn?'Hints ON':'Hints OFF';b.setAttribute('aria-pressed',String(hintsOn));localStorage.setItem(STORAGE_KEY+':hints',hintsOn?'1':'0');});}

  function chooseVoice(lang){const voices=speechSynthesis.getVoices();return voices.find(v=>v.lang===lang)||voices.find(v=>v.lang.startsWith(lang.split('-')[0]))||null;}
  function speak(text){if(!('speechSynthesis'in window)){alert('Speech synthesis is not supported in this browser.');return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=state.ttsLang;const v=chooseVoice(state.ttsLang);if(v)u.voice=v;u.rate=.92;u.pitch=1;speechSynthesis.speak(u);}
  function initTTS(){const sel=$('#voiceMode');if(sel){sel.value=state.ttsLang;sel.addEventListener('change',e=>{state.ttsLang=e.target.value;persist(false);});}document.addEventListener('click',e=>{const b=e.target.closest('.speak');if(b&&b.dataset.speak)speak(b.dataset.speak);});if('speechSynthesis'in window)speechSynthesis.getVoices();}

  function initVocabTabs(){$$('.vocab-tab').forEach(b=>b.addEventListener('click',()=>renderVocab(b.dataset.vocab)));}
  function initSortButtons(){$('#gradeSort').addEventListener('click',()=>{state.sortChecked=true;renderSort();updateAll();persist(false)});$('#resetSort').addEventListener('click',()=>{state.sort={};state.sortChecked=false;state.selectedSort=null;renderSort();updateAll();persist(false)});}

  function initWordCounts(){['writingHotel','writingCar','writingReview'].forEach(id=>{const ta=$('#'+id), out=$('#'+id+'Count');const u=()=>{const n=ta.value.trim()?ta.value.trim().split(/\s+/).length:0;out.textContent=n;};ta.addEventListener('input',()=>{u();persist(false)});u();});}

  function serializeFields(){const fields={};$$('[data-save="true"]').forEach((el,i)=>{fields[el.id||`auto-${i}`]=el.value;});return fields;}
  function restoreFields(fields={}){$$('[data-save="true"]').forEach((el,i)=>{const k=el.id||`auto-${i}`;if(Object.prototype.hasOwnProperty.call(fields,k))el.value=fields[k];});}
  function persist(show=true){const payload={state,fields:serializeFields(),savedAt:new Date().toISOString()};localStorage.setItem(STORAGE_KEY,JSON.stringify(payload));if(show){$('#saveMessage').textContent='✓ Progress saved in this browser.';setTimeout(()=>$('#saveMessage').textContent='',2600);}}
  function restore(){try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return;const data=JSON.parse(raw);if(data.state){Object.assign(state,data.state);state.answers=state.answers||{};state.fills=state.fills||{};state.fillChecked=state.fillChecked||{};state.sort=state.sort||{};state.builder=state.builder||[];}restoreFields(data.fields||{});}catch(e){console.warn('Could not restore lesson progress',e);}}

  function reportText(){
    const scores=getScores(), a=autoTotals(), oral=manualStats('oral',4), writing=manualStats('writing',3); const lines=[];
    lines.push('KARINE · SARDEGNA TRAVEL ENGLISH STUDIO · SESSION 3');
    lines.push('QUALIOPI PROGRESS REPORT');
    lines.push(`Date: ${$('#lessonDate').value||''}`);lines.push(`Learner: ${$('#learnerName').value}`);lines.push(`Trainer: ${$('#trainerName').value}`);lines.push(`Lesson: ${$('#lessonTitle').value}`);lines.push('');
    lines.push('AUTOMATIC EXERCISES');
    Object.entries(groupMeta).forEach(([g,m])=>{const s=scores[g],st=statusFor(s)[0];lines.push(`- ${m.label} [${m.type}]: ${s.correct}/${s.total} correct · ${s.attempted}/${s.total} attempted · ${st}`);});
    lines.push(`Automatic score: ${$('#reportAutoPercent').textContent} (${a.correct}/${a.total})`);lines.push('');
    lines.push('SPEAKING · MANUAL ASSESSMENT');
    ['Hotel check-in','Car pick-up','Restaurant booking','Hotel problem'].forEach((name,idx)=>{const i=idx+1;lines.push(`- ${name}: status=${$(`#oralStatus${i}`).value||'—'} · score=${$(`#oralScore${i}`).value===''?'—':$(`#oralScore${i}`).value+'/4'} · note=${$(`#oralNote${i}`).value||'—'}`);});
    lines.push(`Speaking manual score: ${oral.pct===null?'—':oral.pct+'%'}`);lines.push(`Oral comments: ${$('#oralComments').value||'—'}`);lines.push('');
    lines.push('WRITING · MANUAL ASSESSMENT');
    ['Hotel confirmation email','Car-rental message','Restaurant review'].forEach((name,idx)=>{const i=idx+1;lines.push(`- ${name}: status=${$(`#writingStatus${i}`).value||'—'} · score=${$(`#writingScore${i}`).value===''?'—':$(`#writingScore${i}`).value+'/4'} · note=${$(`#writingNote${i}`).value||'—'}`);});
    lines.push(`Writing manual score: ${writing.pct===null?'—':writing.pct+'%'}`);lines.push(`Writing comments: ${$('#writingComments').value||'—'}`);lines.push('');
    lines.push(`Overall available score: ${$('#reportOverallPercent').textContent}`);lines.push('');
    lines.push('LEARNER FEEDBACK');lines.push(`Usefulness: ${$('#satUseful').value||'—'}`);lines.push(`Difficulty: ${$('#satDifficulty').value||'—'}`);lines.push(`Confidence after lesson: ${$('#satConfidence').value||'—'}`);lines.push(`Travel relevance: ${$('#satRelevance').value||'—'}`);lines.push(`Learner comments: ${$('#learnerComments').value||'—'}`);lines.push('');
    lines.push('TRAINER / NEXT STEP');lines.push($('#trainerComments').value||'—');
    return lines.join('\n');
  }
  async function copyReport(){try{await navigator.clipboard.writeText(reportText());$('#saveMessage').textContent='✓ Report copied.';}catch(e){const ta=document.createElement('textarea');ta.value=reportText();document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();$('#saveMessage').textContent='✓ Report copied.';}}
  function downloadReport(){const txt=esc(reportText()).replace(/\n/g,'<br>');const html=`<!doctype html><meta charset="utf-8"><title>Karine Sardinia Qualiopi Report</title><style>body{font-family:Arial,sans-serif;max-width:920px;margin:40px auto;line-height:1.6;color:#222}h1{font-family:Georgia,serif}</style><body><h1>Karine · Sardegna Travel English Studio</h1><div>${txt}</div></body>`;const blob=new Blob([html],{type:'text/html'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`karine-sardinia-qualiopi-report-${$('#lessonDate').value||'session-3'}.html`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

  let mediaRecorder=null, mediaChunks=[], audioUrl=null;
  async function startRecording(){const status=$('#recordStatus');if(!navigator.mediaDevices||!window.MediaRecorder){status.textContent='Recording is not supported here. Open the lesson over HTTPS in a compatible browser.';return;}try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});mediaChunks=[];mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>{if(e.data.size)mediaChunks.push(e.data)};mediaRecorder.onstop=()=>{const blob=new Blob(mediaChunks,{type:mediaRecorder.mimeType||'audio/webm'});if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=URL.createObjectURL(blob);const audio=$('#recordedAudio');audio.src=audioUrl;audio.hidden=false;const dl=$('#downloadRecord');dl.href=audioUrl;dl.download=`karine-sardinia-${$('#recordMission').value.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.webm`;dl.classList.remove('disabled');stream.getTracks().forEach(t=>t.stop());status.textContent='Recording ready. Listen back once, then note one success and one next step.';};mediaRecorder.start();$('#startRecord').disabled=true;$('#stopRecord').disabled=false;status.textContent='● Recording… Speak naturally. Keep going if you make a small mistake.';}catch(e){status.textContent='Microphone permission was not available. Check browser permissions and make sure the page is served over HTTPS.';}}
  function stopRecording(){if(mediaRecorder&&mediaRecorder.state!=='inactive'){mediaRecorder.stop();$('#startRecord').disabled=false;$('#stopRecord').disabled=true;}}

  let timerInt=null,remaining=180;
  function drawTimer(){const m=Math.floor(remaining/60),s=remaining%60;$('#challengeTimer').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}
  function startTimer(){if(timerInt)return;timerInt=setInterval(()=>{remaining--;drawTimer();if(remaining<=0){clearInterval(timerInt);timerInt=null;speak('Time is up. Finish the sentence you are on, then stop.');}},1000);}
  function resetTimer(){clearInterval(timerInt);timerInt=null;remaining=180;drawTimer();}

  function initActions(){
    $('#saveProgressTop').addEventListener('click',()=>persist(true));$('#saveProgress').addEventListener('click',()=>persist(true));
    $('#copyReport').addEventListener('click',copyReport);$('#downloadReport').addEventListener('click',downloadReport);$('#printReport').addEventListener('click',()=>window.print());
    $('#resetAll').addEventListener('click',()=>{if(confirm('Reset all answers, writing and evaluation fields for this lesson?')){localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(STORAGE_KEY+':fr');localStorage.removeItem(STORAGE_KEY+':hints');location.reload();}});
    $('#startRecord').addEventListener('click',startRecording);$('#stopRecord').addEventListener('click',stopRecording);$('#startTimer').addEventListener('click',startTimer);$('#resetTimer').addEventListener('click',resetTimer);
    $$('[data-save="true"]').forEach(el=>el.addEventListener('input',()=>{updateAll();persist(false)}));
  }

  function setDefaultDate(){const el=$('#lessonDate');if(el&&!el.value){const d=new Date(),pad=n=>String(n).padStart(2,'0');el.value=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;}}

  function init(){
    initSelects();restore();setDefaultDate();initTranslation();initHints();initTTS();initVocabTabs();renderVocab('hotel');
    Object.keys(quizTargets).forEach(renderQuiz);renderFills();renderSort();renderBuilder();initSortButtons();initWordCounts();initActions();updateAll();drawTimer();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
