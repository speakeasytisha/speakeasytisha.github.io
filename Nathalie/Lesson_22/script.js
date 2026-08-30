const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const STORE = 'nathalie_lesson20_storytelling_cloe_v1';

const conjugations = [
  {q:'I ___ (drive) along the coast.',a:'was driving'},
  {q:'You ___ (wait) for the bus.',a:'were waiting'},
  {q:'Nathalie ___ (look) at the map.',a:'was looking'},
  {q:'We ___ (talk) about lunch.',a:'were talking'},
  {q:'They ___ (walk) near the harbour.',a:'were walking'},
  {q:'He ___ (take) photos.',a:'was taking'},
  {q:'Nathalie and her family ___ (travel) by car.',a:'were travelling'},
  {q:'She ___ (sit) outside when it started to rain.',a:'was sitting'}
];

const grammarQuestions = [
  {q:'I ___ dinner when the phone rang.',o:['cooked','was cooking','were cooking'],a:1,e:'The cooking was already in progress when the shorter event happened.',tag:'Past Continuous'},
  {q:'While we ___ through the village, we saw a beautiful church.',o:['were driving','drove','was driving'],a:0,e:'While introduces the ongoing background action.',tag:'while'},
  {q:'The sun ___ when we left the campsite.',o:['was shining','shone suddenly','were shining'],a:0,e:'The weather gives the background at that moment.',tag:'Past Continuous'},
  {q:'I was walking near the sea when I ___ my keys.',o:['was losing','lost','were losing'],a:1,e:'Losing the keys is the completed event that interrupts the walk.',tag:'Past Simple'},
  {q:'As we ___ lunch, it started to rain.',o:['had','were having','was having'],a:1,e:'The meal was in progress when the rain began.',tag:'as'},
  {q:'They ___ TV while I was reading.',o:['watched','were watching','was watching'],a:1,e:'Two actions were happening at the same time.',tag:'simultaneous actions'},
  {q:'We ___ a strange noise and stopped the car.',o:['were hearing','heard','was hearing'],a:1,e:'Hear is normally used here as a completed event.',tag:'Past Simple'},
  {q:'When the waiter arrived, we ___ what to order.',o:['were discussing','discussed suddenly','was discussing'],a:0,e:'The discussion was already in progress.',tag:'Past Continuous'},
  {q:'Which sentence gives the clearest background + event?',o:['I drove when it was raining.','I was driving when it started to rain.','I was drive when rain started.'],a:1,e:'Past Continuous sets the background; Past Simple gives the new event.',tag:'tense contrast'},
  {q:'Which connector best completes: “___ I was looking for my phone, my friend called it.”',o:['While','Yesterday','After'],a:0,e:'While introduces an action in progress.',tag:'while'},
  {q:'At 8 p.m. yesterday, we ___ at a small restaurant.',o:['ate','were eating','was eating'],a:1,e:'A specific time in the middle of an activity often calls for Past Continuous.',tag:'time reference'},
  {q:'The car broke down while we ___ to the hotel.',o:['were driving','drove','was drive'],a:0,e:'Driving was the longer action; the breakdown was the event.',tag:'tense contrast'}
];

const builders = [
  'I was driving home when it started to rain.',
  'While we were walking, we saw a small café.',
  'The children were playing when the lights went out.',
  'As I was leaving, my phone rang.',
  'We were waiting for the repair when the storm started.',
  'I heard a strange noise while I was cooking.',
  'They were taking photos when the bus arrived.',
  'While you were looking at the map, I found the road.'
];

const vocab = [
  ['Actions in progress','🚗','to drive','conduire','to control and move a vehicle','We were driving along the coast.'],
  ['Actions in progress','🚶','to walk','marcher','to move on foot','I was walking near the harbour.'],
  ['Actions in progress','⏳','to wait','attendre','to stay until something happens','We were waiting for assistance.'],
  ['Actions in progress','💬','to chat','discuter','to talk informally','They were chatting when the train arrived.'],
  ['Unexpected events','⚡','suddenly','soudain','quickly and unexpectedly','Suddenly, the lights went out.'],
  ['Unexpected events','🚙','to break down','tomber en panne','to stop working','The car broke down on the motorway.'],
  ['Unexpected events','🧭','to get lost','se perdre','to stop knowing where you are','We got lost near the village.'],
  ['Unexpected events','👀','to notice','remarquer','to become aware of something','I noticed a strange noise.'],
  ['Weather','🌧️','to pour with rain','pleuvoir à verse','to rain very heavily','It was pouring with rain when we arrived.'],
  ['Weather','🌦️','to clear up','se dégager','for the weather to improve','The weather cleared up in the afternoon.'],
  ['Weather','💨','windy','venteux','with a lot of wind','It was very windy near the sea.'],
  ['Weather','🌫️','foggy','brumeux','with thick mist or fog','The road was foggy early in the morning.'],
  ['Travel','🛣️','coastal road','route côtière','a road close to the sea','We were driving along a coastal road.'],
  ['Travel','🚦','traffic jam','embouteillage','a line of slow or stopped vehicles','We were sitting in a traffic jam.'],
  ['Travel','⛺','campsite','camping','a place where people stay in tents or camper vans','We were staying at a quiet campsite.'],
  ['Travel','🧰','roadside assistance','assistance routière','help for a vehicle that has a problem','We called roadside assistance.'],
  ['Reactions','😮','surprised','surpris(e)','feeling something unexpected happened','I was surprised when I saw the damage.'],
  ['Reactions','😟','worried','inquiet / inquiète','feeling concerned about a problem','We were worried about arriving late.'],
  ['Reactions','😌','relieved','soulagé(e)','happy because a problem has ended','I felt relieved when help arrived.'],
  ['Reactions','😊','delighted','ravi(e)','very pleased','We were delighted when the sun came out.'],
  ['Story connectors','🔗','at first','au début','at the beginning of a situation','At first, everything was going well.'],
  ['Story connectors','➡️','after that','après cela','then, following an event','After that, we called the garage.'],
  ['Story connectors','🎬','eventually','finalement','after some time or difficulty','Eventually, we found the hotel.'],
  ['Story connectors','🏁','in the end','à la fin','to introduce the final result','In the end, everything was fine.']
];

const listeningStories = [
  {title:'The missed turn',level:'A2+/B1',audio:'Yesterday afternoon, I was driving to meet some friends near the coast. The weather was good and I was listening to music. While I was following the sat nav, I missed an important turn and continued for nearly ten kilometres. I realised my mistake when I saw a sign for a town in the wrong direction. I stopped in a safe place, checked the map and called my friends. In the end, I arrived twenty minutes late, but everyone was still waiting for me.',qs:[
    {q:'What was the speaker doing when the problem happened?',o:['Driving to meet friends','Walking near the coast','Waiting for a train'],a:0,e:'The speaker was driving.'},
    {q:'What caused the delay?',o:['A flat tyre','A missed turn','Heavy rain'],a:1,e:'The speaker missed an important turn.'},
    {q:'How did the speaker realise the mistake?',o:['A friend called','The car stopped','A road sign showed the wrong direction'],a:2,e:'The road sign revealed the mistake.'},
    {q:'How did the story end?',o:['The meeting was cancelled','The speaker arrived twenty minutes late','The speaker went home'],a:1,e:'The speaker arrived late but still met the friends.'}
  ]},
  {title:'A storm at the market',level:'B1',audio:'Last weekend, we were visiting an outdoor market when the sky suddenly became very dark. People were looking at the stalls and children were eating ice cream. As we were choosing some local cheese, a strong wind started blowing and the sellers began covering their products. A few minutes later, it was pouring with rain. We ran into a small café and waited there until the storm passed. While we were drinking coffee, we talked to another couple who recommended a beautiful village nearby. The rain changed our plans, but we discovered a place we had not planned to visit.',qs:[
    {q:'What were people doing before the weather changed?',o:['Looking at stalls','Driving home','Waiting in a garage'],a:0,e:'They were looking at the market stalls.'},
    {q:'What happened while the speakers were choosing cheese?',o:['The market closed permanently','A strong wind started','They lost their car keys'],a:1,e:'A strong wind started blowing.'},
    {q:'Where did they wait?',o:['In a café','In the car','At a campsite'],a:0,e:'They ran into a small café.'},
    {q:'What positive result came from the storm?',o:['They bought a new car','They met people who recommended another village','They went home early'],a:1,e:'The conversation led them to discover another village.'}
  ]},
  {title:'The phone on the train',level:'B1',audio:'I was travelling by train on Monday morning when I noticed that I could not find my phone. I had been reading a message just before the train left the station, so I knew I had it a few minutes earlier. While I was checking my bag, the passenger opposite me pointed under my seat. My phone was lying on the floor. I thanked him and picked it up. I was feeling relieved when the conductor arrived to check our tickets. It was a small problem, but for a few minutes I was very worried.',qs:[
    {q:'When did the speaker notice the phone was missing?',o:['While travelling by train','After arriving home','Before entering the station'],a:0,e:'The speaker was already on the train.'},
    {q:'What was the speaker doing while the other passenger helped?',o:['Checking a bag','Buying a ticket','Calling the conductor'],a:0,e:'The speaker was checking the bag.'},
    {q:'Where was the phone?',o:['In another carriage','Under the seat','At the station'],a:1,e:'It was lying under the seat.'},
    {q:'How did the speaker feel after finding it?',o:['Relieved','Angry','Bored'],a:0,e:'The speaker felt relieved.'}
  ]}
];

const readingQuestions = [
  {q:'What was the family doing when they heard the noise?',o:['Driving along a coastal road','Eating lunch','Walking in a village'],a:0,e:'They were driving.'},
  {q:'What were they discussing before the problem?',o:['Where to stop for lunch','Which hotel to book','A train time'],a:0,e:'They were talking about lunch.'},
  {q:'What did another driver do?',o:['Ignored them','Stopped and offered help','Called the police'],a:1,e:'Another driver stopped and asked if they needed help.'},
  {q:'What was wrong with the car?',o:['A tyre was losing air','The engine was on fire','The battery was missing'],a:0,e:'One tyre was losing air.'},
  {q:'What happened while they were waiting for the repair?',o:['The sun came out','It started to rain heavily','They found a restaurant'],a:1,e:'Heavy rain began while they were waiting.'},
  {q:'Why is “were waiting” Past Continuous?',o:['It was an action in progress when another event happened','It is a future plan','It describes a habit'],a:0,e:'The waiting was already in progress when the rain started.'}
];

const scenes = [
  {icon:'🚲 🌧️ ☕',label:'A cyclist · sudden rain · a café',prompt:'A person was cycling when the weather suddenly changed.',a2:'The person was cycling when it started to rain. They stopped and went into a café.',b1:'The person was cycling through a small town when it suddenly started to rain. Because the rain was getting heavier, they stopped at a café and waited until the weather improved.',b1plus:'The person was cycling through a quiet town when the weather changed unexpectedly. While they were looking for somewhere to shelter, they noticed a small café. They stopped there, ordered a hot drink and waited. Eventually, the rain cleared up and they continued their journey.'},
  {icon:'🍽️ 💡 🌑',label:'Dinner · lights go out · candles',prompt:'A family was having dinner when the lights suddenly went out.',a2:'The family was eating dinner when the lights went out. They found some candles.',b1:'The family was having dinner when the lights suddenly went out. At first they were surprised, but they found some candles and continued eating.',b1plus:'The family was having dinner and talking about their day when the lights suddenly went out. While one person was looking for candles, another used a phone torch. In the end, the power returned, but they enjoyed the unexpected candlelit dinner.'},
  {icon:'🚉 🧳 📣',label:'Station · waiting · platform change',prompt:'Travellers were waiting for a train when an announcement changed their plans.',a2:'They were waiting for the train when they heard an announcement. The platform changed.',b1:'The travellers were waiting on the platform when an announcement said their train would leave from another platform. They picked up their bags and moved quickly.',b1plus:'The travellers were waiting for their train when they heard an unexpected announcement. The departure platform had changed. While everyone was moving towards the stairs, they checked the information screen to make sure they were going in the right direction. They reached the new platform just in time.'},
  {icon:'🏖️ 📱 🌊',label:'Beach · taking photos · phone falls',prompt:'Someone was taking photos near the sea when something went wrong.',a2:'The person was taking photos when the phone fell on the sand. They picked it up quickly.',b1:'The person was taking photos near the water when the phone slipped out of their hand. Fortunately, it landed on the sand and not in the sea.',b1plus:'The person was taking photos while the waves were getting closer. Suddenly, the phone slipped out of their hand and landed on the wet sand. They picked it up immediately and moved farther from the water. In the end, the phone still worked, so they felt very relieved.'}
];

const machine = {
  where:['at a campsite','on a coastal road','in a restaurant','at a train station','on a beach','in a small village'],
  action:['driving to the next town','having dinner','walking near the sea','waiting for a train','taking photos','looking for the hotel'],
  event:['the weather suddenly changed','the car broke down','you realised your phone was missing','someone asked you for help','the lights went out','you took the wrong road'],
  feeling:['surprised','worried','confused','amused','relieved'],
  ending:['someone helped you','you found the right place','the weather improved','everything was solved','you changed your plans','you arrived safely']
};

const speakingPrompts = [
  {q:'You are travelling when something unexpected happens. Explain where you were, what you were doing, what happened, what you did next and how it ended.',models:{a2:'I was travelling by car. I was going to a small town when the car made a strange noise. I stopped. I called for help. In the end, someone repaired the car and I continued my journey.',b1:'I was travelling by car to a small town when I suddenly heard a strange noise. I was driving on a quiet road, so I stopped in a safe place and checked the car. I could not see the problem, so I called roadside assistance. While I was waiting, I phoned the hotel to explain that I might arrive late. In the end, the mechanic fixed the problem and I continued my journey.',b1plus:'I was driving towards a small coastal town when I suddenly heard an unusual noise coming from the back of the car. Because I was on a quiet road, I slowed down and stopped safely. While I was checking the tyres, I realised one of them was losing air. I called roadside assistance and informed the hotel that my arrival might be delayed. Fortunately, help arrived quite quickly. In the end, I reached the hotel later than planned, but the situation was resolved calmly.'}},
  {q:'Tell a story about a time when the weather changed your plans.',models:{a2:'I was walking near the sea when it started to rain. I went into a café and waited. Later, the weather improved and I continued my walk.',b1:'I was walking near the sea when the weather suddenly changed. It started to rain heavily, so I went into a café. While I was waiting, I looked at the map and changed my plans. About an hour later, the rain stopped and I visited a nearby village instead.',b1plus:'I was spending the afternoon near the coast when the weather changed much faster than expected. While I was walking along the seafront, dark clouds appeared and it suddenly started pouring with rain. I took shelter in a café and used the time to reorganise the rest of the day. Eventually, the weather cleared up, but instead of continuing along the coast, I visited a small village nearby. The change of plan actually made the day more interesting.'}},
  {q:'Tell a story about losing or nearly losing something important.',models:{a2:'I was travelling by train when I could not find my phone. I looked in my bag. Another passenger saw it under my seat. I was very relieved.',b1:'I was travelling by train when I suddenly realised that I could not find my phone. While I was checking my bag, another passenger pointed under my seat. The phone was on the floor. I thanked the passenger and felt very relieved.',b1plus:'I was travelling by train and reading messages when I suddenly realised my phone was no longer in my hand. At first, I thought I had put it in my bag, so I checked every pocket. While I was looking, the passenger opposite me noticed something under my seat. My phone had slipped onto the floor. I was extremely relieved because I had imagined leaving it at the station.'}}
];

const writingTasks = [
  {q:'Write a short message to a friend explaining why you arrived late after an unexpected travel problem.',models:{a2:'Hi, I arrived late because my car had a problem. I was driving to the hotel when I heard a strange noise. I stopped and called for help. I arrived about one hour late, but everything is fine now.',b1:'Hi, sorry I arrived late. I was driving towards the hotel when I suddenly heard a strange noise from the car. I stopped in a safe place and called roadside assistance. While I was waiting, I sent a message to the hotel. The mechanic arrived quite quickly, but the problem delayed me by about an hour. Everything is fine now.',b1plus:'Hi, just a quick message to explain the delay. I was driving towards the hotel when I suddenly heard an unusual noise from the rear of the car. I pulled over safely and discovered that one tyre was losing air. While I was waiting for roadside assistance, I contacted the hotel to let them know I would be late. Fortunately, the repair did not take too long, although I eventually arrived about an hour behind schedule. Everything has been sorted out now.'}},
  {q:'Write a short travel diary entry about a day when the weather changed your plans.',models:{a2:'We were walking near the sea when it started to rain. We went into a café. We waited there for one hour. Later, the sun came out and we visited a small village.',b1:'We were walking along the coast when it suddenly started to rain heavily. We had planned to stay outside all afternoon, but we went into a café instead. While we were having coffee, we looked at the map and decided to visit a nearby village. In the end, the weather improved and we had a very good day.',b1plus:'We were spending the afternoon on the coast when the weather changed without warning. While we were walking along the seafront, dark clouds appeared and heavy rain began. Instead of continuing our walk, we took shelter in a café. While we were there, we studied the map and decided to change our plans. Eventually, the sky cleared, and we visited a nearby village that we had not originally intended to see. The unexpected change actually became one of the best parts of the day.'}}
];

const diagnosticQuestions = [
  {q:'I ___ to the hotel when the car broke down.',o:['drove','was driving','were driving'],a:1,tag:'Past Continuous'},
  {q:'While we ___ lunch, the phone rang.',o:['were having','had','was having'],a:0,tag:'while'},
  {q:'The lights ___ out while everyone was eating.',o:['were going','went','was going'],a:1,tag:'Past Simple'},
  {q:'At 9 p.m. last night, I ___ a book.',o:['read','was reading','were reading'],a:1,tag:'time reference'},
  {q:'Which sentence is correct?',o:['I was walking when I saw him.','I walked when I was seeing him.','I were walking when I saw him.'],a:0,tag:'tense contrast'},
  {q:'___ we were leaving, the rain started.',o:['While','Ago','Last'],a:0,tag:'while/as'},
  {q:'They ___ photos when the bus arrived.',o:['were taking','took suddenly','was taking'],a:0,tag:'Past Continuous'},
  {q:'I ___ a strange noise and stopped.',o:['was hearing','heard','were hearing'],a:1,tag:'Past Simple'},
  {q:'Choose the best meaning: “We were waiting when it started to rain.”',o:['The waiting started after the rain.','The waiting was already in progress.','The rain was a habit.'],a:1,tag:'meaning'},
  {q:'Which connector is best for two simultaneous actions?',o:['while','yesterday','finally'],a:0,tag:'connector'},
  {q:'We were looking at the map when we ___ the mistake.',o:['noticed','were noticing','was noticing'],a:0,tag:'Past Simple'},
  {q:'Which ending is most natural?',o:['In the end, everything was fine.','While everything was fine yesterday.','Was fine in the end everything.'],a:0,tag:'story connector'}
];

const fresh = () => ({
  correct:{},answers:{},builderOrders:{},builderSelected:{},listeningIndex:0,vocabCategory:'All categories',
  machineNotes:'',speakingPrompt:0,speakingNotes:'',oralGrammar:'',oralOrganisation:'',oralFluency:'',oralPronunciation:'',oralComment:'',
  writingTask:0,writingText:'',writeChecks:{},writingStatus:'',writingComment:'',
  diag:{started:false,submitted:false,answers:{},score:null,tags:{},remaining:480},
  sceneNotes:{},notes:{vocab:'',proud:'',goal:''},meta:{learner:'Nathalie',trainer:'Tisha DOUTY-DOSIERE',date:'',target:'B1',self:'',overall:'En cours',conclusion:''},
  french:true,accent:'en-GB',sessionRemaining:5400,sessionRunning:false
});
let state = load();
let sessionInt=null, diagInt=null, machineInt=null, recorder=null, chunks=[];

function load(){try{return {...fresh(),...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch(e){return fresh()}}
function save(msg=false){localStorage.setItem(STORE,JSON.stringify(state));updateProgress();renderReportPreview();if(msg)toast('Progress saved locally')}
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1400)}
function shuffle(a){return a.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1])}
function norm(s){return String(s||'').toLowerCase().trim().replace(/[’']/g,"'").replace(/[.,!?]/g,'').replace(/\s+/g,' ')}
function score(){return Object.values(state.correct).filter(Boolean).length}
function scoreMax(){return conjugations.length+grammarQuestions.length+builders.length+listeningStories.reduce((n,s)=>n+s.qs.length,0)+readingQuestions.length+diagnosticQuestions.length}
function pct(a,b){return b?Math.round(a/b*100):0}
function setCorrect(key,v=true){if(v)state.correct[key]=true;else delete state.correct[key];save()}
function statusFrom(p,done=true){if(!done)return 'Non commencé';if(p>=80)return 'Acquis';if(p>=60)return 'En cours';return 'À renforcer'}
function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

function speak(text,rate=.92){if(!('speechSynthesis' in window))return toast('Audio is not supported in this browser');speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=state.accent;u.rate=rate;const voices=speechSynthesis.getVoices();const exact=voices.find(v=>v.lang&&v.lang.toLowerCase()===state.accent.toLowerCase());const family=voices.find(v=>v.lang&&v.lang.toLowerCase().startsWith(state.accent.slice(0,2).toLowerCase()));u.voice=exact||family||null;speechSynthesis.speak(u)}

function renderConjugation(){
  const box=$('#conjugationGrid');box.innerHTML=conjugations.map((x,i)=>{const k='conj'+i;const saved=state.answers[k]||'';const ok=!!state.correct[k];return `<article class="quiz-card"><p><b>${i+1}.</b> ${x.q}</p><input type="text" data-conj="${i}" value="${escapeHtml(saved)}" placeholder="was / were + verb-ing"><button class="small-btn check-conj" data-i="${i}" type="button">Check</button><div class="feedback ${ok?'good':''}" id="fb-${k}">${ok?'✓ Correct':''}</div></article>`}).join('');
  $$('[data-conj]').forEach(inp=>inp.oninput=()=>{state.answers['conj'+inp.dataset.conj]=inp.value;save()});
  $$('.check-conj').forEach(b=>b.onclick=()=>{const i=+b.dataset.i,k='conj'+i,inp=$(`[data-conj="${i}"]`),fb=$('#fb-'+k);state.answers[k]=inp.value;if(norm(inp.value)===norm(conjugations[i].a)){setCorrect(k);fb.textContent='✓ Correct';fb.className='feedback good'}else{delete state.correct[k];save();fb.textContent='Try again. Remember: was/were + verb-ing.';fb.className='feedback bad'}})
}

function renderMCQ(container,items,prefix){
  container.innerHTML=items.map((x,i)=>{const k=prefix+i,ans=state.answers[k],ok=!!state.correct[k];return `<article class="quiz-card"><p><b>${i+1}.</b> ${x.q}</p><div class="options">${x.o.map((o,j)=>`<button class="option-btn ${ans===j?'selected':''} ${ok&&j===x.a?'correct':''}" data-mcq="${prefix}" data-i="${i}" data-j="${j}" type="button">${o}</button>`).join('')}</div><div class="feedback ${ok?'good':ans!==undefined?'bad':''}" id="fb-${prefix}${i}">${ok?'✓ '+x.e:ans!==undefined?'Not yet. '+x.e:''}</div></article>`}).join('');
  container.querySelectorAll('[data-mcq]').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.i,j=+b.dataset.j,k=prefix+i,x=items[i];state.answers[k]=j;
    if(j===x.a)state.correct[k]=true;else delete state.correct[k];save();renderMCQ(container,items,prefix);
  });
}

function renderBuilders(){
  const g=$('#builderGrid');
  g.innerHTML=builders.map((sentence,i)=>{
    const k='build'+i,tokens=sentence.split(' ');
    if(!state.builderOrders[k])state.builderOrders[k]=shuffle(tokens.map((_,idx)=>idx));
    const selected=state.builderSelected[k]||[];
    const pool=state.builderOrders[k].filter(idx=>!selected.includes(idx));
    return `<article class="builder-card"><p><b>${i+1}.</b> Build the sentence.</p><div class="builder-pool">${pool.map(idx=>`<button class="token" data-pool="${i}" data-idx="${idx}" type="button">${tokens[idx]}</button>`).join('')}</div><div class="builder-answer">${selected.map(idx=>`<button class="token" data-answer="${i}" data-idx="${idx}" type="button">${tokens[idx]}</button>`).join('')}</div><button class="check-builder" data-checkbuilder="${i}" type="button">Check sentence</button><div class="feedback ${state.correct[k]?'good':''}" id="fb-${k}">${state.correct[k]?'✓ Correct':''}</div></article>`
  }).join('');
  $$('[data-pool]').forEach(b=>b.onclick=()=>{const k='build'+b.dataset.pool;state.builderSelected[k]=[...(state.builderSelected[k]||[]),+b.dataset.idx];save();renderBuilders()});
  $$('[data-answer]').forEach(b=>b.onclick=()=>{const k='build'+b.dataset.answer,idx=+b.dataset.idx;state.builderSelected[k]=(state.builderSelected[k]||[]).filter(x=>x!==idx);delete state.correct[k];save();renderBuilders()});
  $$('[data-checkbuilder]').forEach(b=>b.onclick=()=>{const i=+b.dataset.checkbuilder,k='build'+i,tokens=builders[i].split(' '),selected=state.builderSelected[k]||[];const built=selected.map(idx=>tokens[idx]).join(' ');if(norm(built)===norm(builders[i])){setCorrect(k);renderBuilders()}else{delete state.correct[k];save();const fb=$('#fb-'+k);fb.textContent='Not yet. Check the order and punctuation.';fb.className='feedback bad'}});
  save();
}

function renderVocab(){
  const cats=['All categories',...new Set(vocab.map(v=>v[0]))];const sel=$('#vocabCategory');sel.innerHTML=cats.map(c=>`<option ${state.vocabCategory===c?'selected':''}>${c}</option>`).join('');
  const rows=vocab.filter(v=>state.vocabCategory==='All categories'||v[0]===state.vocabCategory);
  $('#vocabGrid').innerHTML=rows.map((v,i)=>`<article class="vocab-card"><div class="vtop"><span class="pill">${v[0]}</span><span class="icon">${v[1]}</span></div><h3>${v[2]}</h3><p class="fr help-text">${v[3]}</p><p class="definition">${v[4]}</p><p class="vexample">${v[5]}</p><button type="button" data-vsay="${encodeURIComponent(v[2]+'. '+v[5])}">🔊 Listen</button></article>`).join('');
  $$('[data-vsay]').forEach(b=>b.onclick=()=>speak(decodeURIComponent(b.dataset.vsay)));
  sel.onchange=()=>{state.vocabCategory=sel.value;save();renderVocab()}
}

function renderListening(){
  $('#listeningTabs').innerHTML=listeningStories.map((s,i)=>`<button type="button" data-ltab="${i}" class="${state.listeningIndex===i?'active':''}">${i+1}. ${s.title}</button>`).join('');
  const s=listeningStories[state.listeningIndex];$('#listeningTitle').textContent=s.title;$('#listeningLevel').textContent=s.level;$('#listeningTranscript').textContent=s.audio;$('#listeningTranscript').classList.add('hidden');$('#toggleTranscript').textContent='📄 Transcript';
  renderMCQ($('#listeningQuestions'),s.qs,'listen'+state.listeningIndex+'-');
  $$('[data-ltab]').forEach(b=>b.onclick=()=>{state.listeningIndex=+b.dataset.ltab;save();renderListening()});
}

function renderScenes(){
  $('#sceneGrid').innerHTML=scenes.map((s,i)=>`<article class="scene-card"><div class="scene-visual">${s.icon}<small>${s.label}</small></div><div class="scene-body"><h3>Scene ${i+1}</h3><p>${s.prompt}</p><textarea rows="4" data-scene-note="${i}" placeholder="Key words or your sentence...">${escapeHtml(state.sceneNotes?.[i]||'')}</textarea><div class="model-buttons"><button type="button" data-scene-model="${i}" data-level="a2">A2</button><button type="button" data-scene-model="${i}" data-level="b1">B1</button><button type="button" data-scene-model="${i}" data-level="b1plus">B1+</button><button type="button" data-scene-speak="${i}">🔊 Prompt</button></div><div class="model-answer hidden" id="sceneModel${i}"></div></div></article>`).join('');
  $$('[data-scene-model]').forEach(b=>b.onclick=()=>{const i=+b.dataset.sceneModel,level=b.dataset.level,out=$('#sceneModel'+i);out.textContent=scenes[i][level];out.classList.remove('hidden')});
  $$('[data-scene-speak]').forEach(b=>b.onclick=()=>speak(scenes[+b.dataset.sceneSpeak].prompt));
  $$('[data-scene-note]').forEach(t=>t.oninput=()=>{state.sceneNotes[t.dataset.sceneNote]=t.value;save()});
}

function fillSelect(sel,arr){sel.innerHTML=arr.map((x,i)=>`<option value="${i}">${x}</option>`).join('')}
function renderMachine(){
  fillSelect($('#machineWhere'),machine.where);fillSelect($('#machineAction'),machine.action);fillSelect($('#machineEvent'),machine.event);fillSelect($('#machineFeeling'),machine.feeling);fillSelect($('#machineEnding'),machine.ending);
  $('#machineNotes').value=state.machineNotes||'';updateMachinePrompt();
  $$('#machine .machine-controls select').forEach(s=>s.onchange=updateMachinePrompt);$('#machineNotes').oninput=e=>{state.machineNotes=e.target.value;save()};
}
function updateMachinePrompt(){const w=machine.where[+$('#machineWhere').value],a=machine.action[+$('#machineAction').value],e=machine.event[+$('#machineEvent').value],f=machine.feeling[+$('#machineFeeling').value],end=machine.ending[+$('#machineEnding').value];$('#machinePrompt').textContent=`You were ${a} ${w} when ${e}. You felt ${f}. Tell the complete story and explain how ${end}.`}
function randomMachine(){['Where','Action','Event','Feeling','Ending'].forEach(k=>{const sel=$('#machine'+k),len=sel.options.length;sel.selectedIndex=Math.floor(Math.random()*len)});updateMachinePrompt()}
function countdown(el,seconds,labelEnd='Time'){clearInterval(machineInt);let r=seconds;el.textContent=fmt(r);machineInt=setInterval(()=>{r--;el.textContent=fmt(Math.max(0,r));if(r<=0){clearInterval(machineInt);el.textContent=labelEnd;toast(labelEnd)}},1000)}

function renderSpeaking(){
  const sel=$('#speakingPrompt');sel.innerHTML=speakingPrompts.map((x,i)=>`<option value="${i}" ${state.speakingPrompt===i?'selected':''}>Prompt ${i+1}</option>`).join('');$('#speakingQuestion').textContent=speakingPrompts[state.speakingPrompt].q;$('#speakingNotes').value=state.speakingNotes||'';
  ['Grammar','Organisation','Fluency','Pronunciation'].forEach(k=>$('#oral'+k).value=state['oral'+k]||'');$('#oralComment').value=state.oralComment||'';
  sel.onchange=()=>{state.speakingPrompt=+sel.value;save();$('#speakingQuestion').textContent=speakingPrompts[state.speakingPrompt].q;$('#speakingModel').classList.add('hidden')};
  $('#speakingNotes').oninput=e=>{state.speakingNotes=e.target.value;save()};
  $$('[data-model]').forEach(b=>b.onclick=()=>{const out=$('#speakingModel');out.textContent=speakingPrompts[state.speakingPrompt].models[b.dataset.model];out.classList.remove('hidden')});
  ['Grammar','Organisation','Fluency','Pronunciation'].forEach(k=>$('#oral'+k).onchange=e=>{state['oral'+k]=e.target.value;save()});$('#oralComment').oninput=e=>{state.oralComment=e.target.value;save()};
}

function renderWriting(){
  const sel=$('#writingTask');sel.innerHTML=writingTasks.map((x,i)=>`<option value="${i}" ${state.writingTask===i?'selected':''}>Task ${i+1}</option>`).join('');$('#writingPrompt').textContent=writingTasks[state.writingTask].q;$('#writingText').value=state.writingText||'';$('#writingStatus').value=state.writingStatus||'';$('#writingComment').value=state.writingComment||'';
  $$('[data-writecheck]').forEach(c=>c.checked=!!state.writeChecks[c.dataset.writecheck]);updateWordCount();
  sel.onchange=()=>{state.writingTask=+sel.value;save();$('#writingPrompt').textContent=writingTasks[state.writingTask].q;$('#writingModel').classList.add('hidden')};
  $('#writingText').oninput=e=>{state.writingText=e.target.value;save();updateWordCount()};
  $$('[data-writecheck]').forEach(c=>c.onchange=()=>{state.writeChecks[c.dataset.writecheck]=c.checked;save()});
  $$('[data-writing-model]').forEach(b=>b.onclick=()=>{const out=$('#writingModel');out.textContent=writingTasks[state.writingTask].models[b.dataset.writingModel];out.classList.remove('hidden')});
  $('#writingStatus').onchange=e=>{state.writingStatus=e.target.value;save()};$('#writingComment').oninput=e=>{state.writingComment=e.target.value;save()};
}
function updateWordCount(){const t=($('#writingText').value||'').trim();$('#wordCount').textContent=(t?t.split(/\s+/).length:0)+' words'}

function renderDiagnostic(){
  const d=state.diag;if(d.submitted)return renderDiagnosticResult();
  $('#diagnosticIntro').classList.toggle('hidden',d.started);$('#diagnosticTest').classList.toggle('hidden',!d.started);$('#diagnosticResult').classList.add('hidden');
  if(d.started){$('#diagnosticQuestions').innerHTML=diagnosticQuestions.map((x,i)=>`<article class="diagnostic-q"><p><b>${i+1}.</b> ${x.q}</p><div class="diag-options">${x.o.map((o,j)=>`<label><input type="radio" name="diag${i}" value="${j}" ${d.answers[i]===j?'checked':''}> ${o}</label>`).join('')}</div></article>`).join('');$$('#diagnosticQuestions input').forEach(inp=>inp.onchange=()=>{state.diag.answers[+inp.name.replace('diag','')]=+inp.value;save()});$('#diagnosticTimer').textContent=fmt(d.remaining)}
}
function startDiagnostic(){state.diag={started:true,submitted:false,answers:{},score:null,tags:{},remaining:480};save();renderDiagnostic();startDiagTimer()}
function startDiagTimer(){clearInterval(diagInt);if(!state.diag.started||state.diag.submitted)return;diagInt=setInterval(()=>{state.diag.remaining=Math.max(0,state.diag.remaining-1);$('#diagnosticTimer').textContent=fmt(state.diag.remaining);if(state.diag.remaining%5===0)save();if(state.diag.remaining<=0){clearInterval(diagInt);submitDiagnostic()}},1000)}
function submitDiagnostic(){
  clearInterval(diagInt);let s=0,tags={};diagnosticQuestions.forEach((x,i)=>{const ok=state.diag.answers[i]===x.a;if(ok){s++;state.correct['diag'+i]=true}else{delete state.correct['diag'+i];tags[x.tag]=(tags[x.tag]||0)+1}});state.diag.submitted=true;state.diag.score=s;state.diag.tags=tags;save();renderDiagnosticResult()
}
function renderDiagnosticResult(){
  $('#diagnosticIntro').classList.add('hidden');$('#diagnosticTest').classList.add('hidden');const out=$('#diagnosticResult');out.classList.remove('hidden');out.className='diagnostic-result';const s=state.diag.score??0,p=pct(s,diagnosticQuestions.length),tags=Object.entries(state.diag.tags||{}).sort((a,b)=>b[1]-a[1]);
  out.innerHTML=`<div class="result-hero"><div class="result-score">${s}/12</div><div><p class="eyebrow">FOCUSED RESULT</p><h3>${statusFrom(p)}</h3><p>${p}% correct. ${p>=80?'The contrast is becoming reliable.':p>=60?'The main idea is present; a few contrasts still need repetition.':'Return to the background/event contrast before moving on.'}</p></div></div><h4>Priority tags</h4><div class="tag-list">${tags.length?tags.map(([k,v])=>`<span>${k}: ${v}</span>`).join(''):'<span>No recurring error tag.</span>'}</div><div class="diagnostic-review">${diagnosticQuestions.map((x,i)=>{const a=state.diag.answers[i];return `<p><b>${i+1}. ${a===x.a?'✓':'✕'}</b> ${x.q}<br><small>Your answer: ${a===undefined?'No answer':x.o[a]} · Correct: ${x.o[x.a]}</small></p>`}).join('')}</div>`;
}

function resetSection(name){
  const prefixes={grammar:['conj','grammar'],builders:['build'],listening:['listen'],reading:['read'],diagnostic:['diag']}[name]||[];
  Object.keys(state.correct).forEach(k=>{if(prefixes.some(p=>k.startsWith(p)))delete state.correct[k]});Object.keys(state.answers).forEach(k=>{if(prefixes.some(p=>k.startsWith(p)))delete state.answers[k]});
  if(name==='builders'){state.builderOrders={};state.builderSelected={}}
  if(name==='diagnostic')state.diag=fresh().diag;
  if(name==='scenes')state.sceneNotes={};
  if(name==='machine')state.machineNotes='';
  if(name==='speaking'){state.speakingNotes='';state.oralGrammar='';state.oralOrganisation='';state.oralFluency='';state.oralPronunciation='';state.oralComment=''}
  if(name==='writing'){state.writingText='';state.writeChecks={};state.writingStatus='';state.writingComment=''}
  save();renderAll();toast('Section reset')
}

function getSectionStats(){
  const count=(prefix,max)=>{const c=Object.keys(state.correct).filter(k=>k.startsWith(prefix)&&state.correct[k]).length;return {c,max,p:pct(c,max)}};
  const grammar={c:Object.keys(state.correct).filter(k=>(k.startsWith('conj')||k.startsWith('grammar'))&&state.correct[k]).length,max:conjugations.length+grammarQuestions.length};grammar.p=pct(grammar.c,grammar.max);
  return {grammar,builders:count('build',builders.length),listening:count('listen',12),reading:count('read',readingQuestions.length),diagnostic:count('diag',diagnosticQuestions.length)}
}
function updateProgress(){
  const s=score(),m=scoreMax(),p=pct(s,m);$('#scoreNow').textContent=s;$('#scoreMax').textContent=m;$('#scorePct').textContent=p+'%';$('#progressBar').style.width=p+'%';
  const labels=p===0?'Ready to begin':p<25?'Building the foundation':p<50?'Connecting ideas':p<75?'Telling complete stories':p<100?'CLOE transfer in progress':'Lesson complete';$('#progressLabel').textContent=labels;
}
function renderReportPreview(){
  const st=getSectionStats(),oral=[state.oralGrammar,state.oralOrganisation,state.oralFluency,state.oralPronunciation].filter(Boolean).length,write=state.writingStatus||'Not rated';
  $('#reportPreview').innerHTML=`<article class="preview-card"><span>Grammar</span><strong>${st.grammar.c}/${st.grammar.max} · ${st.grammar.p}%</strong></article><article class="preview-card"><span>Comprehension</span><strong>${st.listening.c+st.reading.c}/18</strong></article><article class="preview-card"><span>Speaking</span><strong>${oral}/4 rated</strong></article><article class="preview-card"><span>Writing</span><strong>${write}</strong></article>`;
}

function renderReport(){
  const st=getSectionStats(),m=state.meta;$('#learnerName').value=m.learner||'Nathalie';$('#trainerName').value=m.trainer||'Tisha DOUTY-DOSIERE';$('#evaluationDate').value=m.date||new Date().toISOString().slice(0,10);$('#targetLevel').value=m.target||'B1';$('#selfAssessment').value=m.self||'';$('#overallStatus').value=m.overall||'En cours';$('#trainerConclusion').value=m.conclusion||'';
  const total=score(),max=scoreMax(),global=pct(total,max);$('#reportSummary').innerHTML=`<div class="summary-box"><span>Interactive score</span><strong>${total}/${max} · ${global}%</strong></div><div class="summary-box"><span>Mini diagnostic</span><strong>${state.diag.submitted?(state.diag.score+'/12'):'Not completed'}</strong></div><div class="summary-box"><span>Oral observation</span><strong>${[state.oralGrammar,state.oralOrganisation,state.oralFluency,state.oralPronunciation].filter(Boolean).length}/4 rated</strong></div><div class="summary-box"><span>Writing</span><strong>${state.writingStatus||'Not rated'}</strong></div>`;
  const rows=[
    ['Past Continuous formation','Conjugation practice',`${Object.keys(state.correct).filter(k=>k.startsWith('conj')).length}/${conjugations.length}`,statusFrom(pct(Object.keys(state.correct).filter(k=>k.startsWith('conj')).length,conjugations.length))],
    ['Past Simple vs Past Continuous','Grammar contrast exercises',`${Object.keys(state.correct).filter(k=>k.startsWith('grammar')).length}/${grammarQuestions.length}`,statusFrom(pct(Object.keys(state.correct).filter(k=>k.startsWith('grammar')).length,grammarQuestions.length))],
    ['Word order & connectors','Click-to-build sentences',`${st.builders.c}/${st.builders.max}`,statusFrom(st.builders.p)],
    ['Listening comprehension','Three narrative listenings',`${st.listening.c}/${st.listening.max}`,statusFrom(st.listening.p)],
    ['Reading comprehension','Narrative reading',`${st.reading.c}/${st.reading.max}`,statusFrom(st.reading.p)],
    ['Independent tense choice','Mini CLOE diagnostic',state.diag.submitted?`${state.diag.score}/12`:'Not completed',state.diag.submitted?statusFrom(st.diagnostic.p):'Non commencé']
  ];
  $('#objectiveRows').innerHTML=rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="${r[3]==='Acquis'?'status-good':r[3]==='À renforcer'?'status-low':'status-mid'}">${r[3]}</td></tr>`).join('');
  $('#speakingReport').innerHTML=`<p>Past tense control: <b>${state.oralGrammar||'Not rated'}</b></p><p>Story organisation: <b>${state.oralOrganisation||'Not rated'}</b></p><p>Fluency: <b>${state.oralFluency||'Not rated'}</b></p><p>Pronunciation: <b>${state.oralPronunciation||'Not rated'}</b></p><p>Note: ${escapeHtml(state.oralComment||'—')}</p>`;
  $('#writingReport').innerHTML=`<p>Status: <b>${state.writingStatus||'Not rated'}</b></p><p>Word count: <b>${($('#writingText').value||'').trim()?($('#writingText').value.trim().split(/\s+/).length):0}</b></p><p>Self-check: <b>${Object.values(state.writeChecks||{}).filter(Boolean).length}/5</b></p><p>Note: ${escapeHtml(state.writingComment||'—')}</p>`;
}
function persistMeta(){state.meta={learner:$('#learnerName').value,trainer:$('#trainerName').value,date:$('#evaluationDate').value,target:$('#targetLevel').value,self:$('#selfAssessment').value,overall:$('#overallStatus').value,conclusion:$('#trainerConclusion').value};save()}
function reportText(){
  persistMeta();const st=getSectionStats(),m=state.meta,tags=Object.entries(state.diag.tags||{}).sort((a,b)=>b[1]-a[1]);return [
    'QUALIOPI · LESSON 20 · PAST CONTINUOUS & STORYTELLING','Learner: '+m.learner,'Trainer: '+m.trainer,'Date: '+m.date,'Target: '+m.target,'',
    'INTERACTIVE EVIDENCE',`Global interactive score: ${score()}/${scoreMax()} (${pct(score(),scoreMax())}%)`,`Grammar: ${st.grammar.c}/${st.grammar.max} (${st.grammar.p}%)`,`Word order: ${st.builders.c}/${st.builders.max} (${st.builders.p}%)`,`Listening: ${st.listening.c}/${st.listening.max} (${st.listening.p}%)`,`Reading: ${st.reading.c}/${st.reading.max} (${st.reading.p}%)`,`Mini diagnostic: ${state.diag.submitted?state.diag.score+'/12':'not completed'}`,'',
    'DIAGNOSTIC PRIORITIES',...(tags.length?tags.map(x=>'- '+x[0]+': '+x[1]):['- No recurring diagnostic error tag recorded.']),'',
    'SPEAKING OBSERVATION','Past tense control: '+(state.oralGrammar||'not rated'),'Story organisation: '+(state.oralOrganisation||'not rated'),'Fluency: '+(state.oralFluency||'not rated'),'Pronunciation: '+(state.oralPronunciation||'not rated'),'Teacher note: '+(state.oralComment||''),'',
    'WRITING OBSERVATION','Status: '+(state.writingStatus||'not rated'),'Teacher note: '+(state.writingComment||''),'Writing response:',state.writingText||'','',
    'LEARNER NOTES','New words: '+(state.notes.vocab||''),'Proud sentence: '+(state.notes.proud||''),'Next speaking goal: '+(state.notes.goal||''),'',
    'FINAL EVALUATION','Learner self-assessment: '+(m.self||'not selected'),'Overall status: '+m.overall,'Trainer conclusion: '+(m.conclusion||''),'','Training evidence only — not an official CLOE result.'
  ].join('\n')
}
function reportHtml(){const text=escapeHtml(reportText()).replace(/\n/g,'<br>');return `<!doctype html><html><head><meta charset="utf-8"><title>Lesson 20 Qualiopi Report</title><style>body{font-family:Arial,sans-serif;max-width:900px;margin:40px auto;line-height:1.55;color:#2c2118}h1{color:#563a27}div{background:#fff8ec;border:1px solid #ddc9aa;border-radius:16px;padding:24px}</style></head><body><h1>Lesson 20 · Qualiopi Progress Report</h1><div>${text}</div></body></html>`}
function download(name,content,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}

function initTimer(){
  $('#sessionTimer').textContent=fmt(state.sessionRemaining);if(state.sessionRunning)startSessionTimer();
  $('#timerStart').onclick=()=>{state.sessionRunning=true;save();startSessionTimer()};$('#timerPause').onclick=()=>{state.sessionRunning=false;clearInterval(sessionInt);save()};$('#timerReset').onclick=()=>{state.sessionRemaining=5400;state.sessionRunning=false;clearInterval(sessionInt);$('#sessionTimer').textContent='90:00';save()}
}
function startSessionTimer(){clearInterval(sessionInt);sessionInt=setInterval(()=>{state.sessionRemaining=Math.max(0,state.sessionRemaining-1);$('#sessionTimer').textContent=fmt(state.sessionRemaining);if(state.sessionRemaining%10===0)save();if(state.sessionRemaining<=0){clearInterval(sessionInt);state.sessionRunning=false;save();toast('Session timer finished')}},1000)}
function fmt(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}

function initRecording(){
  $('#startRecord').onclick=async()=>{try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>chunks.push(e.data);recorder.onstop=()=>{const blob=new Blob(chunks,{type:'audio/webm'});$('#recordPlayback').src=URL.createObjectURL(blob);$('#recordPlayback').classList.remove('hidden');stream.getTracks().forEach(t=>t.stop());$('#recordStatus').textContent='Recording ready to replay.'};recorder.start();$('#startRecord').disabled=true;$('#stopRecord').disabled=false;$('#recordStatus').textContent='Recording…'}catch(e){toast('Microphone permission is required.')}};
  $('#stopRecord').onclick=()=>{if(recorder&&recorder.state!=='inactive')recorder.stop();$('#startRecord').disabled=false;$('#stopRecord').disabled=true};
}

function initControls(){
  document.body.classList.toggle('hide-fr',!state.french);document.body.classList.toggle('show-fr',state.french);$('#frenchToggle').classList.toggle('active',state.french);$('#frenchToggle').setAttribute('aria-pressed',String(state.french));
  $$('.accent-btn').forEach(b=>{b.classList.toggle('active',b.dataset.accent===state.accent);b.setAttribute('aria-pressed',String(b.dataset.accent===state.accent));b.onclick=()=>{state.accent=b.dataset.accent;save();initControls()}});
  $('#frenchToggle').onclick=()=>{state.french=!state.french;save();document.body.classList.toggle('hide-fr',!state.french);document.body.classList.toggle('show-fr',state.french);$('#frenchToggle').classList.toggle('active',state.french);$('#frenchToggle').setAttribute('aria-pressed',String(state.french))};
  $$('.help-btn').forEach(b=>b.onclick=()=>$('#'+b.dataset.help).classList.toggle('show'));
  $$('.speak-btn').forEach(b=>b.onclick=()=>speak(b.dataset.speak));
  $('.reset-section') && $$('.reset-section').forEach(b=>b.onclick=()=>{if(confirm('Reset only this section?'))resetSection(b.dataset.reset)});
  $('#resetAll').onclick=()=>{if(confirm('Reset the whole lesson? This clears saved progress in this browser.')){localStorage.removeItem(STORE);location.reload()}};
  $('#backTop').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});window.addEventListener('scroll',()=>$('#backTop').classList.toggle('show',window.scrollY>700));
  const sections=$$('main section[data-title]');const obs=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible)$('#progressLabel').textContent=visible.target.dataset.title},{threshold:[.25,.5,.75]});sections.forEach(s=>obs.observe(s));
}

function initReport(){
  const open=()=>{renderReport();$('#reportOverlay').classList.remove('hidden');document.body.style.overflow='hidden'};$('#openReportTop').onclick=open;$('#openReportSection').onclick=open;$('#closeReport').onclick=()=>{$('#reportOverlay').classList.add('hidden');document.body.style.overflow=''};
  ['learnerName','trainerName','evaluationDate','targetLevel','selfAssessment','overallStatus','trainerConclusion'].forEach(id=>$('#'+id).addEventListener(id==='trainerConclusion'?'input':'change',persistMeta));
  $('#saveReport').onclick=()=>{persistMeta();toast('Report saved locally')};$('#copyReport').onclick=async()=>{try{await navigator.clipboard.writeText(reportText());toast('Report copied')}catch(e){toast('Copy unavailable — use Download TXT')}};
  $('#downloadTxt').onclick=()=>download('Nathalie-Lesson-20-Qualiopi.txt',reportText(),'text/plain;charset=utf-8');$('#downloadHtml').onclick=()=>download('Nathalie-Lesson-20-Qualiopi.html',reportHtml(),'text/html;charset=utf-8');
  $('#printReport').onclick=()=>{persistMeta();document.body.classList.add('report-printing');window.print();setTimeout(()=>document.body.classList.remove('report-printing'),300)};
}

function bindNotes(){
  $('#vocabNotes').value=state.notes.vocab||'';$('#proudSentence').value=state.notes.proud||'';$('#nextGoal').value=state.notes.goal||'';
  $('#vocabNotes').oninput=e=>{state.notes.vocab=e.target.value;save()};$('#proudSentence').oninput=e=>{state.notes.proud=e.target.value;save()};$('#nextGoal').oninput=e=>{state.notes.goal=e.target.value;save()};
}

function renderAll(){
  renderConjugation();renderMCQ($('#grammarQuiz'),grammarQuestions,'grammar');renderBuilders();renderVocab();renderListening();renderMCQ($('#readingQuiz'),readingQuestions,'read');renderScenes();renderMachine();renderSpeaking();renderWriting();renderDiagnostic();bindNotes();updateProgress();renderReportPreview();
}

function init(){
  if(!state.meta.date)state.meta.date=new Date().toISOString().slice(0,10);renderAll();initControls();initTimer();initRecording();initReport();
  $('#playListening').onclick=()=>speak(listeningStories[state.listeningIndex].audio,.9);$('#stopAudio').onclick=()=>speechSynthesis.cancel();$('#toggleTranscript').onclick=()=>{const t=$('#listeningTranscript');t.classList.toggle('hidden');$('#toggleTranscript').textContent=t.classList.contains('hidden')?'📄 Transcript':'📄 Hide transcript'};
  $('#randomStory').onclick=randomMachine;$('#prep30').onclick=()=>countdown($('#machineTimer'),30,'Start speaking');$('#speak90').onclick=()=>countdown($('#machineTimer'),90,'Time');$('#speakingTimerBtn').onclick=()=>countdown($('#speakingCountdown'),90,'Time');
  $('#startDiagnostic').onclick=startDiagnostic;$('#submitDiagnostic').onclick=submitDiagnostic;if(state.diag.started&&!state.diag.submitted)startDiagTimer();
}

document.addEventListener('DOMContentLoaded',init);
