const state={voice:'US',autoAudio:false,scoreCorrect:0,scoreTotal:0,currentBuilder:null,builtWords:[],roleplayScenarioKey:null,roleplayIndex:0};
const vocabData={
 time:[
  {icon:'🕒',word:'o’clock',def:'used for exact hours',fr:'heure pile',ex:'It is three o’clock.'},
  {icon:'⏰',word:'half past',def:'30 minutes after the hour',fr:'et demie',ex:'It is half past seven.'},
  {icon:'⌚',word:'quarter past',def:'15 minutes after the hour',fr:'et quart',ex:'It is quarter past nine.'},
  {icon:'🕰️',word:'quarter to',def:'15 minutes before the hour',fr:'moins le quart',ex:'It is quarter to six.'},
  {icon:'🌅',word:'morning',def:'the early part of the day',fr:'matin',ex:'I travel in the morning.'},
  {icon:'🌙',word:'evening',def:'the later part of the day',fr:'soir',ex:'We arrive in the evening.'}
 ],
 week:[
  {icon:'1️⃣',word:'Monday',def:'the first workday of the week',fr:'lundi',ex:'The train leaves on Monday.'},
  {icon:'2️⃣',word:'Tuesday',def:'the day after Monday',fr:'mardi',ex:'I call the hotel on Tuesday.'},
  {icon:'3️⃣',word:'Wednesday',def:'the middle weekday',fr:'mercredi',ex:'We travel on Wednesday.'},
  {icon:'4️⃣',word:'Thursday',def:'the day after Wednesday',fr:'jeudi',ex:'The booking starts on Thursday.'},
  {icon:'5️⃣',word:'Friday',def:'the last workday for many people',fr:'vendredi',ex:'I finish work on Friday.'},
  {icon:'6️⃣',word:'Saturday',def:'a weekend day',fr:'samedi',ex:'We leave on Saturday.'},
  {icon:'7️⃣',word:'Sunday',def:'a weekend day',fr:'dimanche',ex:'The museum is open on Sunday.'},
  {icon:'📆',word:'week',def:'seven days',fr:'semaine',ex:'I travel next week.'},
  {icon:'📋',word:'weekend',def:'Saturday and Sunday',fr:'week-end',ex:'We go away for the weekend.'}
 ],
 months:[
  {icon:'❄️',word:'January',def:'the first month of the year',fr:'janvier',ex:'I travel in January.'},
  {icon:'💘',word:'February',def:'the second month',fr:'février',ex:'The trip is in February.'},
  {icon:'🌱',word:'March',def:'the third month',fr:'mars',ex:'March is often cool.'},
  {icon:'🌷',word:'April',def:'the fourth month',fr:'avril',ex:'We visit Paris in April.'},
  {icon:'🌼',word:'May',def:'the fifth month',fr:'mai',ex:'May is a nice month.'},
  {icon:'☀️',word:'June',def:'the sixth month',fr:'juin',ex:'School ends in June.'},
  {icon:'🏖️',word:'July',def:'the seventh month',fr:'juillet',ex:'I am travelling in July.'},
  {icon:'🍉',word:'August',def:'the eighth month',fr:'août',ex:'Hotels are busy in August.'},
  {icon:'🍂',word:'September',def:'the ninth month',fr:'septembre',ex:'We go back in September.'},
  {icon:'🎃',word:'October',def:'the tenth month',fr:'octobre',ex:'It rains in October.'},
  {icon:'🍁',word:'November',def:'the eleventh month',fr:'novembre',ex:'I stay home in November.'},
  {icon:'🎄',word:'December',def:'the twelfth month',fr:'décembre',ex:'December is festive.'}
 ],
 seasons:[
  {icon:'🌸',word:'spring',def:'the season after winter',fr:'printemps',ex:'I love travelling in spring.'},
  {icon:'☀️',word:'summer',def:'the hottest season',fr:'été',ex:'We go to the coast in summer.'},
  {icon:'🍂',word:'autumn / fall',def:'the season after summer',fr:'automne',ex:'Autumn is beautiful in the countryside.'},
  {icon:'❄️',word:'winter',def:'the coldest season',fr:'hiver',ex:'They ski in winter.'},
  {icon:'📅',word:'year',def:'12 months',fr:'année',ex:'We take one big trip every year.'}
 ],
 travel:[
  {icon:'✈️',word:'travel',def:'go from one place to another',fr:'voyager',ex:'I travel in summer.'},
  {icon:'🏨',word:'book',def:'reserve in advance',fr:'réserver',ex:'I book a hotel online.'},
  {icon:'🛏️',word:'stay',def:'spend time in a place',fr:'séjourner',ex:'We stay in a small hotel.'},
  {icon:'🎒',word:'pack',def:'put things in a bag',fr:'faire sa valise',ex:'I pack my suitcase on Friday.'},
  {icon:'📞',word:'call',def:'telephone someone',fr:'appeler',ex:'I call the hotel today.'},
  {icon:'🗺️',word:'visit',def:'go to see a place',fr:'visiter',ex:'We visit Rome in June.'},
  {icon:'🚗',word:'drive',def:'travel by car',fr:'conduire',ex:'They drive to the coast.'},
  {icon:'🚶',word:'walk',def:'go on foot',fr:'marcher',ex:'We walk in the city centre.'},
  {icon:'🚆',word:'take the train',def:'travel by train',fr:'prendre le train',ex:'I take the train on Monday.'},
  {icon:'🧭',word:'plan',def:'organize in advance',fr:'planifier',ex:'We plan the trip this week.'}
 ]
};
const drills={
 calendar:[
  {prompt:'Which day comes after Tuesday?',options:['Monday','Wednesday','Friday'],answer:'Wednesday',hint:'Think of the order of the week.'},
  {prompt:'Which month comes after June?',options:['July','May','September'],answer:'July',hint:'June → July.'},
  {prompt:'“In summer” refers to…',options:['a day','a season','a month'],answer:'a season',hint:'Summer is one of the four seasons.'},
  {prompt:'Which is correct?',options:['on Monday','in Monday','at Monday'],answer:'on Monday',hint:'Use “on” with days.'},
  {prompt:'A year has…',options:['7 days','12 months','4 weeks'],answer:'12 months',hint:'A year = January to December.'}
 ],
 grammar:[
  {prompt:'Choose the best sentence.',options:['I am travel in July.','I travel in July.','I travelling in July.'],answer:'I travel in July.',hint:'Present simple = subject + base verb.'},
  {prompt:'Choose the best sentence for NOW.',options:['She calls the hotel now.','She is calling the hotel now.','She call the hotel now.'],answer:'She is calling the hotel now.',hint:'Use present continuous for now.'},
  {prompt:'Which sentence is about a routine?',options:['We are packing now.','We pack every Friday.','We are travel every Friday.'],answer:'We pack every Friday.',hint:'Routine = present simple.'},
  {prompt:'Which is correct?',options:['I am booking a room.','I booking a room.','I am book a room.'],answer:'I am booking a room.',hint:'am/is/are + verb-ing'},
  {prompt:'Choose the best sentence.',options:['The train leaves at 9.','The train is leave at 9.','The train leaving at 9.'],answer:'The train leaves at 9.',hint:'Schedules often use present simple.'}
 ],
 travel:[
  {prompt:'You want a room. What do you say?',options:['I would like to book a room.','I book room now.','Where room?'],answer:'I would like to book a room.',hint:'Use a polite phrase.'},
  {prompt:'You want to know the location. What do you say?',options:['How much is the hotel?','Where is the hotel?','I am hotel.'],answer:'Where is the hotel?',hint:'Ask with “Where…?”'},
  {prompt:'You are putting clothes in your suitcase. You…',options:['pack','visit','drive'],answer:'pack',hint:'Suitcase → pack.'},
  {prompt:'You go by car. You…',options:['drive','walk','book'],answer:'drive',hint:'Car → drive.'},
  {prompt:'You go by train. Choose the best phrase.',options:['take the train','visit the train','book the train station'],answer:'take the train',hint:'This is the standard phrase.'}
 ]
};
const dialogues={
 planning:[
  {speaker:'Teacher',role:'teacher',text:'What type of place do you like: the beach, the mountains, the city, or the countryside?'},
  {speaker:'Learner',role:'learner',text:'I like the coast, but I prefer the city.',model:'I like the coast, but I prefer the city.'},
  {speaker:'Teacher',role:'teacher',text:'When do you usually travel?'},
  {speaker:'Learner',role:'learner',text:'I usually travel in summer.',model:'I usually travel in summer.'},
  {speaker:'Teacher',role:'teacher',text:'What are you planning this year?'},
  {speaker:'Learner',role:'learner',text:'I am planning a trip in July.',model:'I am planning a trip in July.'}
 ],
 hotel:[
  {speaker:'Teacher',role:'teacher',text:'Hello. How can I help you?'},
  {speaker:'Learner',role:'learner',text:'Hello. I would like to book a room, please.',model:'Hello. I would like to book a room, please.'},
  {speaker:'Teacher',role:'teacher',text:'For what dates?'},
  {speaker:'Learner',role:'learner',text:'From Friday to Sunday in August.',model:'From Friday to Sunday in August.'},
  {speaker:'Teacher',role:'teacher',text:'How many nights is that?'},
  {speaker:'Learner',role:'learner',text:'That is two nights.',model:'That is two nights.'}
 ],
 dates:[
  {speaker:'Teacher',role:'teacher',text:'What day is your restaurant booking?'},
  {speaker:'Learner',role:'learner',text:'It is on Saturday.',model:'It is on Saturday.'},
  {speaker:'Teacher',role:'teacher',text:'What time is it?'},
  {speaker:'Learner',role:'learner',text:'It is at half past seven.',model:'It is at half past seven.'},
  {speaker:'Teacher',role:'teacher',text:'What are you doing this weekend?'},
  {speaker:'Learner',role:'learner',text:'I am visiting friends this weekend.',model:'I am visiting friends this weekend.'}
 ]
};
const builderTasks=[
 {label:'Present simple: routine',correct:'I travel in August every year',words:['I','travel','in','August','every','year']},
 {label:'Present continuous: now',correct:'I am booking a hotel now',words:['I','am','booking','a','hotel','now']},
 {label:'Day + month',correct:'We leave on Friday in July',words:['We','leave','on','Friday','in','July']},
 {label:'Travel verb',correct:'She packs her suitcase on Thursday',words:['She','packs','her','suitcase','on','Thursday']},
 {label:'Question helper',correct:'Where do you travel in summer',words:['Where','do','you','travel','in','summer']}
];
const roleplays={
 trip:[
  {text:'You want to choose a destination. Ask the learner: What type of place do you like?',model:'I like the mountains, but I prefer the coast.'},
  {text:'Ask: When do you usually travel?',model:'I usually travel in summer.'},
  {text:'Ask: What are you planning this year?',model:'I am planning a trip in September.'}
 ],
 hotel:[
  {text:'Receptionist: Hello. How can I help you?',model:'Hello. I would like to book a room for two nights, please.'},
  {text:'Receptionist: What dates would you like?',model:'From Friday to Sunday in August.'},
  {text:'Receptionist: Would you like one room or two?',model:'One room, please.'}
 ],
 restaurant:[
  {text:'Restaurant: Good evening. How can I help you?',model:'Good evening. I would like to book a table for two, please.'},
  {text:'Restaurant: For what day?',model:'For Saturday evening.'},
  {text:'Restaurant: For what time?',model:'For quarter past eight, please.'}
 ]
};
function updateGlobalScore(){document.getElementById('globalScore').textContent=`${state.scoreCorrect} / ${state.scoreTotal}`}
function addScore(ok){state.scoreTotal+=1;if(ok)state.scoreCorrect+=1;updateGlobalScore()}
function speakText(text){if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=state.voice==='UK'?'en-GB':'en-US';u.rate=.95;window.speechSynthesis.speak(u)}
function maybeSpeak(text){if(state.autoAudio)speakText(text)}
function makeVocabCard(item){const btn=document.createElement('button');btn.className='vocab-card';btn.innerHTML=`<div class="vocab-icon">${item.icon}</div><div class="vocab-word">${item.word}</div><div class="vocab-details"><p><strong>Definition:</strong> ${item.def}</p><p><strong>Français:</strong> ${item.fr}</p><p><strong>Example:</strong> ${item.ex}</p></div>`;btn.addEventListener('click',()=>{btn.classList.toggle('revealed');maybeSpeak(item.word+'. '+item.ex)});return btn}
function renderVocab(){document.getElementById('timeGrid').replaceChildren(...vocabData.time.map(makeVocabCard));document.getElementById('weekGrid').replaceChildren(...vocabData.week.map(makeVocabCard));document.getElementById('monthsGrid').replaceChildren(...vocabData.months.map(makeVocabCard));document.getElementById('seasonsGrid').replaceChildren(...vocabData.seasons.map(makeVocabCard));document.getElementById('travelGrid').replaceChildren(...vocabData.travel.map(makeVocabCard))}
function setupTabs(){document.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));btn.classList.add('active');document.getElementById('tab-'+btn.dataset.tab).classList.add('active')}))}
function loadRandomDrill(){const set=document.getElementById('drillSet').value;const pool=drills[set];const item=pool[Math.floor(Math.random()*pool.length)];document.getElementById('drillPrompt').textContent=item.prompt;const wrap=document.getElementById('drillOptions');wrap.innerHTML='';const fb=document.getElementById('drillFeedback');fb.textContent='';fb.className='feedback';item.options.forEach(opt=>{const b=document.createElement('button');b.className='option-btn';b.textContent=opt;b.addEventListener('click',()=>{const ok=opt===item.answer;addScore(ok);[...wrap.children].forEach(ch=>ch.disabled=true);if(ok){b.classList.add('correct');fb.textContent='✅ Correct!';fb.classList.add('ok')}else{b.classList.add('incorrect');fb.textContent=`❌ Try again next time. Hint: ${item.hint}`;fb.classList.add('no');[...wrap.children].forEach(ch=>{if(ch.textContent===item.answer)ch.classList.add('correct')})}});wrap.appendChild(b)});maybeSpeak(item.prompt)}
function renderDialogue(){const key=document.getElementById('dialogueSelect').value;const lines=dialogues[key];const box=document.getElementById('dialogueLines');box.innerHTML='';let firstModel='Read the learner lines aloud.';lines.forEach(line=>{const div=document.createElement('div');div.className=`line ${line.role}`;div.innerHTML=`<span class="speaker">${line.speaker}</span>${line.text}`;div.addEventListener('click',()=>{if(line.model)document.getElementById('dialogueModel').textContent=line.model;speakText(line.text)});if(line.model&&firstModel==='Read the learner lines aloud.')firstModel=line.model;box.appendChild(div)});document.getElementById('dialogueModel').textContent=firstModel}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function loadBuilderTask(){state.currentBuilder=builderTasks[document.getElementById('builderTask').value];state.builtWords=[];const fb=document.getElementById('builderFeedback');fb.textContent='';fb.className='feedback';renderBuiltWords();const wrap=document.getElementById('builderWords');wrap.innerHTML='';shuffle(state.currentBuilder.words).forEach(word=>{const b=document.createElement('button');b.className='word-chip';b.textContent=word;b.addEventListener('click',()=>{state.builtWords.push(word);b.disabled=true;renderBuiltWords()});wrap.appendChild(b)})}
function renderBuiltWords(){const target=document.getElementById('builderTarget');if(!state.builtWords.length){target.innerHTML='<span class="mini-note">Build your sentence here.</span>';return}target.innerHTML=state.builtWords.map(w=>`<span class="built-chip">${w}</span>`).join(' ')}
function checkBuilder(){const built=state.builtWords.join(' ').trim();const ok=built===state.currentBuilder.correct;addScore(ok);const fb=document.getElementById('builderFeedback');if(ok){fb.textContent='✅ Correct! Now say it aloud.';fb.className='feedback ok'}else{fb.textContent=`❌ Not quite. Model: ${state.currentBuilder.correct}`;fb.className='feedback no'}}
function setupBuilder(){const sel=document.getElementById('builderTask');builderTasks.forEach((task,idx)=>{const opt=document.createElement('option');opt.value=idx;opt.textContent=task.label;sel.appendChild(opt)});sel.addEventListener('change',loadBuilderTask);loadBuilderTask()}
function setupRoleplay(){const sel=document.getElementById('scenarioSelect');Object.keys(roleplays).forEach(key=>{const opt=document.createElement('option');opt.value=key;opt.textContent=key.charAt(0).toUpperCase()+key.slice(1);sel.appendChild(opt)});state.roleplayScenarioKey=sel.value;sel.addEventListener('change',()=>state.roleplayScenarioKey=sel.value)}
function renderRoleplayLine(){const arr=roleplays[state.roleplayScenarioKey];const item=arr[state.roleplayIndex];document.getElementById('roleplayLine').textContent=item.text;document.getElementById('roleplayModel').textContent='Model reply will appear here.';maybeSpeak(item.text)}
function startRoleplay(){state.roleplayScenarioKey=document.getElementById('scenarioSelect').value;state.roleplayIndex=0;renderRoleplayLine()}
function nextRoleplay(){const arr=roleplays[state.roleplayScenarioKey];if(!arr)return;state.roleplayIndex=Math.min(state.roleplayIndex+1,arr.length-1);renderRoleplayLine()}
function showRoleplayModel(){const arr=roleplays[state.roleplayScenarioKey];if(!arr)return;document.getElementById('roleplayModel').textContent=arr[state.roleplayIndex].model}
function startCountdown(elId,start){const el=document.getElementById(elId);let n=start;el.textContent=n;const t=setInterval(()=>{n-=1;el.textContent=n;if(n<=0)clearInterval(t)},1000)}
function resetAll(){state.scoreCorrect=0;state.scoreTotal=0;updateGlobalScore();document.getElementById('drillPrompt').textContent='Click “New prompt” to begin.';document.getElementById('drillOptions').innerHTML='';document.getElementById('drillFeedback').textContent='';document.getElementById('dialogueLines').innerHTML='';document.getElementById('dialogueModel').textContent='Choose a dialogue.';loadBuilderTask();document.getElementById('roleplayLine').textContent='Choose a scenario and click Start.';document.getElementById('roleplayModel').textContent='Model reply will appear here.'}
document.addEventListener('DOMContentLoaded',()=>{renderVocab();setupTabs();setupBuilder();setupRoleplay();updateGlobalScore();document.querySelectorAll('[data-voice]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-voice]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');state.voice=btn.dataset.voice}));document.querySelectorAll('[data-autoaudio]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-autoaudio]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');state.autoAudio=btn.dataset.autoaudio==='on'}));document.getElementById('newDrillBtn').addEventListener('click',loadRandomDrill);document.getElementById('resetDrillsBtn').addEventListener('click',()=>{document.getElementById('drillPrompt').textContent='Click “New prompt” to begin.';document.getElementById('drillOptions').innerHTML='';document.getElementById('drillFeedback').textContent=''});document.getElementById('listenDrillBtn').addEventListener('click',()=>{const txt=document.getElementById('drillPrompt').textContent;if(txt)speakText(txt)});document.getElementById('loadDialogueBtn').addEventListener('click',renderDialogue);document.getElementById('listenDialogueBtn').addEventListener('click',()=>{const first=document.querySelector('#dialogueLines .line');if(first)speakText(first.textContent)});document.getElementById('checkBuilderBtn').addEventListener('click',checkBuilder);document.getElementById('clearBuilderBtn').addEventListener('click',loadBuilderTask);document.getElementById('resetBuilderBtn').addEventListener('click',loadBuilderTask);document.getElementById('listenBuilderBtn').addEventListener('click',()=>speakText(state.currentBuilder.correct));document.getElementById('startRoleplayBtn').addEventListener('click',startRoleplay);document.getElementById('nextRoleplayBtn').addEventListener('click',nextRoleplay);document.getElementById('showModelBtn').addEventListener('click',showRoleplayModel);document.getElementById('listenRoleplayBtn').addEventListener('click',()=>{const txt=document.getElementById('roleplayLine').textContent;if(txt)speakText(txt)});document.getElementById('prepTimerBtn').addEventListener('click',()=>startCountdown('prepSeconds',15));document.getElementById('speakTimerBtn').addEventListener('click',()=>startCountdown('speakSeconds',30));document.getElementById('resetAllBtn').addEventListener('click',resetAll)})
