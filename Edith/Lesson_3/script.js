const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
let mode='coach';
let answered={};
let hintUsed={};

const quizzes={
  possessiveQuiz:[
    {q:'Choose the natural sentence.',o:['We enjoyed us weekend.','We enjoyed our weekend.','We enjoyed the weekend of us.'],a:1,h:'Use a possessive adjective before the noun.',e:'“Our weekend” is the natural structure. Our = belonging to us.',skill:'language'},
    {q:'Complete: We invited friends to ___ house.',o:['ours','our','us'],a:1,h:'The blank comes directly before a noun.',e:'Use “our house”. “Ours” stands alone: The house is ours.',skill:'language'},
    {q:'Which sentence sounds natural?',o:['The plans of them changed.','Them plans changed.','Their plans changed.'],a:2,h:'my / your / his / her / our / their + noun',e:'“Their plans” is the natural possessive structure.',skill:'language'},
    {q:'Choose the correct form: Is this ___ reservation?',o:['your','yours','you'],a:0,h:'A noun follows the blank.',e:'Use “your reservation”. “Yours” would stand alone: Is this yours?',skill:'language'}
  ],
  readingQuiz:[
    {q:'Why did they plan a simple meal?',o:['Because one friend was on a diet.','Because everyone wanted a quiet afternoon after a busy week.','Because the shops were closed.'],a:1,h:'Look in the first paragraph for “because”.',e:'The text says everyone had had a busy week and wanted a quiet afternoon.',skill:'reading'},
    {q:'What changed their original plan?',o:['The weather was warm, so everyone stayed longer.','The dessert arrived late.','They decided to go to the cinema.'],a:0,h:'Look at the contrast after “but”.',e:'They expected the friends to leave around three, but the warm weather led them to sit outside and stay longer.',skill:'reading'},
    {q:'What does “nobody noticed the time” suggest?',o:['They had forgotten to bring a watch.','They were enjoying the conversation.','They were worried about being late.'],a:1,h:'This answer is implied, not copied word for word.',e:'The conversation was enjoyable enough that they lost track of time.',skill:'reading'},
    {q:'What did the writer decide to do with the house jobs?',o:['Finish them that evening.','Ask the friends to help.','Postpone them until Monday.'],a:2,h:'Find “they could wait”.',e:'The writer decided the jobs could wait until Monday.',skill:'reading'},
    {q:'Why is “However” used in the third paragraph?',o:['To introduce a contrast.','To give a time sequence.','To introduce a reason.'],a:0,h:'Compare “not exciting” with “special”.',e:'“However” links two contrasting ideas: the day was not exciting, but it still felt special.',skill:'reading'},
    {q:'What is the main message of the final paragraph?',o:['The dessert was the best dish.','Simple time together can matter more than the food.','The writer prefers eating in restaurants.'],a:1,h:'The writer says “the best part had not been the food itself”.',e:'The final idea is that time spent together was more important than the meal itself.',skill:'reading'}
  ],
  naturalQuiz:[
    {q:'You mean the whole lunch experience.',o:['We had a lovely dish with friends.','We had a lovely meal with friends.','We had a lovely food occasion.'],a:1,h:'Whole eating occasion = meal.',e:'A meal is breakfast, lunch, dinner, or the whole eating experience.',skill:'language'},
    {q:'You mean one prepared food item.',o:['My favourite meal was the vegetable tart.','My favourite eating was the vegetable tart.','My favourite dish was the vegetable tart.'],a:2,h:'One prepared item = dish.',e:'A tart can be a dish; lunch is the meal.',skill:'language'},
    {q:'You mean “actuellement”.',o:['I’m actually reading a new book.','I’m currently reading a new book.','I current read a new book.'],a:1,h:'Actually usually means “en fait”.',e:'“Currently” or “at the moment” expresses “actuellement”.',skill:'language'},
    {q:'Choose the correct travel preposition.',o:['We travelled to London last year.','We travelled at London last year.','We travelled in London last year.'],a:0,h:'Movement toward a destination → to.',e:'Travel to + destination.',skill:'language'},
    {q:'Choose the natural phrase.',o:['I like this kind of stories.','I like these kind of story.','I like this kind of story.'],a:2,h:'After “this kind of”, use singular.',e:'Correct: this kind of story. Also possible: these kinds of stories.',skill:'language'},
    {q:'Choose the correct phrase before a noun.',o:['others countries','other countries','other of countries'],a:1,h:'“Other” can come before a noun; “others” stands alone.',e:'Use “other countries”. Example with others: Some are large; others are small.',skill:'language'},
    {q:'Choose the correct comparison.',o:['This café is more quieter than the old one.','This café is quieter than the old one.','This café is quieter that the old one.'],a:1,h:'Short adjective: -er + than.',e:'Quiet → quieter than. Do not use “more quieter”.',skill:'language'},
    {q:'Choose the best connector: The café was busy, ___ we found a quiet table outside.',o:['because','however','so'],a:1,h:'The second idea contrasts with the first.',e:'“However” expresses contrast. The café was busy; however, they still found a quiet table.',skill:'language'}
  ],
  brightWrittenQuiz:[
    {q:'The meeting has been moved ___ Friday morning.',o:['in','to','at'],a:1,h:'A change of scheduled time often uses “move to”.',e:'Correct: moved to Friday morning.',skill:'bright'},
    {q:'I’m looking forward ___ hearing from you.',o:['to','for','at'],a:0,h:'Look forward to + noun / -ing.',e:'Correct: looking forward to hearing.',skill:'bright'},
    {q:'We arrived ___ the hotel just before six.',o:['in','on','at'],a:2,h:'Specific place = arrive at.',e:'Arrive at a specific place; arrive in a city or country.',skill:'bright'},
    {q:'Which sentence is correct?',o:['She doesn’t works on Fridays.','She doesn’t work on Fridays.','She not work on Fridays.'],a:1,h:'After does/doesn’t, use the base verb.',e:'Correct: doesn’t work.',skill:'bright'},
    {q:'The new office is ___ than the old one.',o:['more convenient','convenienter','most convenient'],a:0,h:'Long adjective → more + adjective + than.',e:'Correct: more convenient than.',skill:'bright'},
    {q:'Could you ___ the address, please?',o:['repeating','repeat','to repeat'],a:1,h:'Modal + base verb.',e:'Could + repeat.',skill:'bright'},
    {q:'We were tired, ___ we decided to go home early.',o:['so','although','during'],a:0,h:'The second part is a result.',e:'“So” introduces a result.',skill:'bright'},
    {q:'Which is the most natural sentence?',o:['I have two others questions.','I have two other questions.','I have two questions others.'],a:1,h:'Other + noun.',e:'Correct: two other questions.',skill:'bright'},
    {q:'Yesterday, the train ___ twenty minutes late.',o:['arrives','arrived','is arriving'],a:1,h:'Yesterday = past simple.',e:'Correct: arrived.',skill:'bright'},
    {q:'If I understand correctly, you ___ a table for four.',o:['would like','like to','are like'],a:0,h:'Polite request: would like.',e:'“You would like a table for four” is correct and natural.',skill:'bright'}
  ]
};

function renderQuiz(id){
  const el=document.getElementById(id); if(!el) return; el.innerHTML='';
  quizzes[id].forEach((item,i)=>{
    const card=document.createElement('article'); card.className='quiz-card'; card.dataset.index=i;
    card.innerHTML=`<p><strong>${i+1}. ${item.q}</strong></p>
      <div class="options">${item.o.map((x,j)=>`<button class="option-btn" type="button" data-choice="${j}">${x}</button>`).join('')}</div>
      <div class="quiz-actions"><button class="hint-btn" type="button" data-hint>💡 Hint</button></div>
      <div class="hint-text" hidden>${item.h}</div><div class="feedback"></div><div class="explanation" hidden>${item.e}</div>`;
    el.appendChild(card);
  });
  $$('.option-btn',el).forEach(btn=>btn.addEventListener('click',()=>answerQuiz(id,btn)));
  $$('[data-hint]',el).forEach(btn=>btn.addEventListener('click',()=>{const card=btn.closest('.quiz-card'),idx=+card.dataset.index;hintUsed[`${id}-${idx}`]=true;const h=$('.hint-text',card);h.hidden=!h.hidden;}));
}
function answerQuiz(id,btn){
  const card=btn.closest('.quiz-card'), idx=+card.dataset.index, item=quizzes[id][idx], choice=+btn.dataset.choice;
  $$('.option-btn',card).forEach(b=>b.classList.remove('correct','incorrect'));
  const fb=$('.feedback',card), ex=$('.explanation',card); answered[`${id}-${idx}`]={correct:choice===item.a,skill:item.skill};
  if(choice===item.a){btn.classList.add('correct');fb.className='feedback good';fb.textContent='✓ Correct — keep that pattern.';}else{btn.classList.add('incorrect');$$('.option-btn',card)[item.a].classList.add('correct');fb.className='feedback bad';fb.textContent='✗ Not yet — compare your choice with the correct pattern.';}
  ex.hidden=mode==='exam'; updateProgress();
}
function resetQuiz(id){quizzes[id].forEach((_,i)=>{delete answered[`${id}-${i}`];delete hintUsed[`${id}-${i}`]});renderQuiz(id);updateProgress()}
Object.keys(quizzes).forEach(renderQuiz);

const gapData=[
  {before:'We had a lovely',after:'with our friends.',answers:['meal'],hint:'The whole eating occasion.'},
  {before:'My favourite',after:'was the vegetable tart.',answers:['dish'],hint:'One prepared food item.'},
  {before:'I’m',after:'watching a new series at the moment.',answers:['currently'],hint:'“Actuellement” in English.'},
  {before:'We travelled',after:'Spain last year.',answers:['to'],hint:'Movement toward a destination.'},
  {before:'I like this kind of',after:'.',answers:['story'],hint:'Singular after “this kind of”.'},
  {before:'We stayed longer',after:'the conversation was interesting.',answers:['because'],hint:'You need a reason connector.'}
];
function renderGaps(){
  const root=$('#gapPractice');root.innerHTML='';
  gapData.forEach((g,i)=>{const c=document.createElement('div');c.className='gap-card';c.innerHTML=`<div class="gap-line"><span>${g.before}</span><input class="gap-input" data-gap="${i}" aria-label="Missing word ${i+1}"><span>${g.after}</span></div><div class="quiz-actions"><button class="primary gap-check" type="button">Check</button><button class="hint-btn gap-hint" type="button">💡 Hint</button></div><div class="hint-text" hidden>${g.hint}</div><div class="feedback"></div>`;root.appendChild(c)});
  $$('.gap-check',root).forEach(b=>b.addEventListener('click',()=>checkGap(b)));
  $$('.gap-hint',root).forEach(b=>b.addEventListener('click',()=>{const card=b.closest('.gap-card'),input=$('.gap-input',card);hintUsed[`gap-${input.dataset.gap}`]=true;$('.hint-text',card).hidden=!$('.hint-text',card).hidden}));
}
function norm(x){return x.trim().toLowerCase().replace(/[.!?,]/g,'')}
function checkGap(btn){const card=btn.closest('.gap-card'),input=$('.gap-input',card),i=+input.dataset.gap,g=gapData[i],ok=g.answers.some(a=>norm(a)===norm(input.value));input.classList.toggle('correct',ok);input.classList.toggle('incorrect',!ok);answered[`gap-${i}`]={correct:ok,skill:'language'};const fb=$('.feedback',card);fb.className='feedback '+(ok?'good':'bad');fb.textContent=ok?'✓ Correct — you produced it yourself.':`✗ Try again. Think about: ${g.hint}`;updateProgress()}
renderGaps();
$('#resetGaps').addEventListener('click',()=>{gapData.forEach((_,i)=>{delete answered[`gap-${i}`];delete hintUsed[`gap-${i}`]});renderGaps();updateProgress()});

const sentenceData=[
  {prompt:'Build: “Nous avons apprécié notre week-end.”',words:['our','We','weekend','enjoyed'],answer:'We enjoyed our weekend',hint:'Subject first. Possessive before the noun.'},
  {prompt:'Build: “Nous sommes arrivés à l’hôtel à six heures.”',words:['at six','We','the hotel','arrived','at'],answer:'We arrived at the hotel at six',hint:'arrive at + specific place'},
  {prompt:'Build: “Je regarde actuellement une nouvelle série.”',words:['a new series','currently','watching','I’m'],answer:"I’m currently watching a new series",hint:'currently usually comes before the main -ing verb.'},
  {prompt:'Build: “J’aime ce genre d’histoire parce que c’est émouvant.”',words:['because','this kind of story','I like','it is emotional'],answer:'I like this kind of story because it is emotional',hint:'this kind of + singular noun; because + reason'}
];
function renderBuilders(){const root=$('#sentenceBuilders');root.innerHTML='';sentenceData.forEach((s,i)=>{const c=document.createElement('article');c.className='sentence-builder';c.dataset.i=i;c.innerHTML=`<h3>${s.prompt}</h3><div class="word-bank">${s.words.map((w,j)=>`<button class="word-chip" type="button" data-word="${encodeURIComponent(w)}" data-origin="bank">${w}</button>`).join('')}</div><div class="sentence-zone" aria-label="Your sentence"></div><div class="builder-actions"><button class="primary check-builder" type="button">Check sentence</button><button class="secondary clear-builder" type="button">Clear</button><button class="hint-btn builder-hint" type="button">💡 Hint</button></div><div class="hint-text" hidden>${s.hint}</div><div class="builder-feedback"></div>`;root.appendChild(c)});bindBuilders()}
function bindBuilders(){
  $$('.sentence-builder').forEach(card=>{
    const bank=$('.word-bank',card),zone=$('.sentence-zone',card);
    card.addEventListener('click',e=>{const chip=e.target.closest('.word-chip');if(!chip)return; if(chip.parentElement===bank)zone.appendChild(chip);else bank.appendChild(chip)});
    $('.clear-builder',card).addEventListener('click',()=>{[...zone.children].forEach(ch=>bank.appendChild(ch));$('.builder-feedback',card).textContent=''});
    $('.builder-hint',card).addEventListener('click',e=>{const i=+card.dataset.i;hintUsed[`builder-${i}`]=true;const h=$('.hint-text',card);h.hidden=!h.hidden});
    $('.check-builder',card).addEventListener('click',()=>{const i=+card.dataset.i,s=sentenceData[i],built=[...zone.children].map(ch=>decodeURIComponent(ch.dataset.word)).join(' '),ok=norm(built)===norm(s.answer);answered[`builder-${i}`]={correct:ok,skill:'language'};const f=$('.builder-feedback',card);f.className='builder-feedback '+(ok?'correct-text':'wrong-text');f.textContent=ok?'✓ Perfect order.':`✗ Not yet. Correct model: ${s.answer}.`;updateProgress()})
  })
}
renderBuilders();

const vocab={
  'Weekend & social time':[
    ['☕','get together','se retrouver','We often get together for coffee at the weekend.'],['🌿','relaxed','détendu(e)','It was a relaxed afternoon with friends.'],['📅','make plans','faire des projets','We are making plans for next weekend.'],['✨','spontaneous','spontané(e)','Sometimes spontaneous plans are the most memorable.'],['🕰️','lose track of time','ne plus voir le temps passer','We were talking and lost track of time.']
  ],
  'Food & meals':[
    ['🍽️','meal','repas','We had a lovely meal together.'],['🥘','dish','plat','This vegetable dish is delicious.'],['🍰','homemade','fait maison','She brought a homemade apple tart.'],['🥗','starter','entrée','We had a salad as a starter.'],['☕','after lunch','après le déjeuner','We had coffee after lunch.']
  ],
  'Connectors & structure':[
    ['🔗','because','parce que','We stayed outside because it was sunny.'],['➡️','so','donc / alors','It was warm, so we sat outside.'],['↔️','however','cependant','The day was simple. However, it felt special.'],['⏭️','after that','après cela','After that, we made coffee.'],['✅','finally','finalement / enfin','Finally, we went home.']
  ],
  'Natural English':[
    ['🕰️','currently','actuellement','I’m currently working on my English.'],['🌍','other countries','d’autres pays','I enjoy learning about other countries.'],['📚','this kind of story','ce genre d’histoire','I like this kind of story.'],['👥','our weekend','notre week-end','Our weekend was very relaxing.'],['⚖️','at the same level as','au même niveau que','The two options are not at the same level.']
  ],
  'Bright survival phrases':[
    ['🔁','Could you repeat that, please?','Pourriez-vous répéter ?','Could you repeat that, please?'],['🐢','Could you speak more slowly?','Pourriez-vous parler plus lentement ?','Could you speak more slowly, please?'],['💭','Let me think for a moment.','Laissez-moi réfléchir un instant.','Let me think for a moment.'],['✅','If I understand correctly…','Si je comprends bien…','If I understand correctly, the meeting starts at two.'],['💬','What I mean is…','Ce que je veux dire, c’est…','What I mean is that clear communication is important.']
  ],
  'Professional conversation':[
    ['🤝','work with customers','travailler avec des clients','I worked with customers for many years.'],['🧩','solve a problem','résoudre un problème','We worked together to solve the problem.'],['📋','be responsible for','être responsable de','I was responsible for several daily tasks.'],['💡','learn from experience','apprendre de l’expérience','I learned a lot from that experience.'],['🎯','current objective','objectif actuel','My current objective is to speak more confidently.']
  ]
};
function initVocab(){const sel=$('#vocabSelect');Object.keys(vocab).forEach(cat=>{const o=document.createElement('option');o.value=cat;o.textContent=cat;sel.appendChild(o)});sel.addEventListener('change',()=>renderVocab(sel.value));renderVocab(Object.keys(vocab)[0])}
function renderVocab(cat){const d=$('#vocabDisplay');d.innerHTML=vocab[cat].map(v=>`<article class="vocab-item"><span class="vocab-icon">${v[0]}</span><div><strong>${v[1]}</strong><span class="vocab-fr">${v[2]}</span></div><button class="audio-mini" type="button" data-say="${v[1].replaceAll('"','&quot;')}" aria-label="Listen to ${v[1]}">▶</button><div class="vocab-example">${v[3]}</div></article>`).join('');bindAudio(d)}
initVocab();

const guidedListening=[
  {text:'Hi, just a quick message. Lunch is now at one thirty instead of one o’clock. We’re still meeting on Thursday, but the café has changed. It’s the small café opposite the station.',q:'What changed?',o:['Only the day.','The time and the café.','Only the number of people.'],a:1,h:'Listen for “instead of” and “but”.',e:'Lunch moved from 1:00 to 1:30, and the café changed.',skill:'listening'},
  {text:'I’m sorry, but the restaurant is fully booked tonight. We do have a table available tomorrow at seven fifteen, or Friday at eight.',q:'What is the earliest available option?',o:['Tomorrow at 7:15.','Tonight at 7:15.','Friday at 7:00.'],a:0,h:'You need the first available time after tonight.',e:'The earliest available table is tomorrow at 7:15.',skill:'listening'},
  {text:'The meeting room is on the second floor. Take the lift, turn right, walk past the kitchen, and it is the second door on your left.',q:'Where is the meeting room?',o:['First door on the right.','Second door on the left after the kitchen.','Beside the lift on the first floor.'],a:1,h:'Follow the directions in order.',e:'Second floor → turn right → past the kitchen → second door on the left.',skill:'listening'},
  {text:'The 10:20 train to Bordeaux is delayed by twenty minutes because of a technical problem. Passengers should remain on platform four.',q:'What should passengers do?',o:['Go to platform twenty.','Stay on platform four and wait.','Take the 10:20 train immediately.'],a:1,h:'Do not confuse the delay length with the platform number.',e:'The train is delayed by 20 minutes, but passengers should remain on platform 4.',skill:'listening'},
  {text:'I wanted to call you because I won’t be in the office this morning. I have a medical appointment, but I should be back by two. Could you send the report to Maya before lunch?',q:'What does the speaker ask the listener to do?',o:['Cancel the appointment.','Send a report before lunch.','Come back to the office at two.'],a:1,h:'Listen for “Could you…?”',e:'The requested action is to send the report to Maya before lunch.',skill:'listening'}
];
const brightListening=[
  {text:'Good morning. Your appointment was originally scheduled for Tuesday afternoon, but the doctor is unavailable. We can offer Wednesday at nine thirty instead.',q:'When is the new appointment?',o:['Tuesday at 9:30.','Wednesday at 9:30.','Wednesday afternoon.'],a:1,h:'Listen for the corrected date and time.',e:'The new appointment is Wednesday at 9:30.',skill:'bright'},
  {text:'Please remember that the main entrance is closed this week. Visitors should use the side entrance next to the car park.',q:'Where should visitors enter?',o:['Through the main entrance.','Beside the reception desk.','Through the side entrance near the car park.'],a:2,h:'The first location is unavailable; listen for the alternative.',e:'Visitors should use the side entrance next to the car park.',skill:'bright'},
  {text:'We received your order this morning. Most items will arrive on Friday, but the blue chairs will be delivered separately next Monday.',q:'Which item arrives later?',o:['The blue chairs.','All the items.','The Friday order.'],a:0,h:'Listen after “but”.',e:'The blue chairs arrive separately on Monday.',skill:'bright'},
  {text:'The presentation itself was clear, but it started late because the previous meeting finished fifteen minutes behind schedule.',q:'Why did the presentation start late?',o:['The presenter arrived late.','The previous meeting overran.','The presentation was unclear.'],a:1,h:'Listen for “because”.',e:'The previous meeting finished late, causing the delay.',skill:'bright'},
  {text:'Could you bring the signed document to my office before three? If I’m not there, please leave it with reception.',q:'What should the listener do if the speaker is absent?',o:['Return after three.','Email the document.','Leave it at reception.'],a:2,h:'Listen for the conditional instruction after “If”.',e:'If the speaker is absent, the document should be left with reception.',skill:'bright'}
];
function renderListening(rootId,data,examStyle=false){
  const root=document.getElementById(rootId);root.innerHTML='';
  data.forEach((x,i)=>{const c=document.createElement('article');c.className='listening-card';c.dataset.i=i;c.innerHTML=`<div class="listen-row"><button class="primary listen-one" type="button">▶ Listen</button>${examStyle?'':'<button class="secondary transcript-btn" type="button">Show transcript</button>'}<span class="soft-tag">Listen for the key detail</span></div>${examStyle?'':`<div class="transcript" hidden>${x.text}</div>`}<p><strong>${i+1}. ${x.q}</strong></p><div class="options">${x.o.map((o,j)=>`<button class="option-btn" type="button" data-choice="${j}">${o}</button>`).join('')}</div><div class="quiz-actions"><button class="hint-btn" type="button" data-lhint>💡 Hint</button></div><div class="hint-text" hidden>${x.h}</div><div class="feedback"></div><div class="explanation" hidden>${x.e}</div>`;root.appendChild(c)});
  $$('.listen-one',root).forEach((b,i)=>b.addEventListener('click',()=>speak(data[i].text)));
  $$('.transcript-btn',root).forEach(b=>b.addEventListener('click',()=>{const t=$('.transcript',b.closest('.listening-card'));t.hidden=!t.hidden;b.textContent=t.hidden?'Show transcript':'Hide transcript'}));
  $$('[data-lhint]',root).forEach(b=>b.addEventListener('click',()=>{const c=b.closest('.listening-card'),i=+c.dataset.i;hintUsed[`${rootId}-${i}`]=true;const h=$('.hint-text',c);h.hidden=!h.hidden}));
  $$('.option-btn',root).forEach(b=>b.addEventListener('click',()=>{const c=b.closest('.listening-card'),i=+c.dataset.i,x=data[i],ch=+b.dataset.choice;$$('.option-btn',c).forEach(z=>z.classList.remove('correct','incorrect'));answered[`${rootId}-${i}`]={correct:ch===x.a,skill:x.skill};const fb=$('.feedback',c),ex=$('.explanation',c);if(ch===x.a){b.classList.add('correct');fb.className='feedback good';fb.textContent='✓ Correct — you caught the key information.'}else{b.classList.add('incorrect');$$('.option-btn',c)[x.a].classList.add('correct');fb.className='feedback bad';fb.textContent='✗ Not yet — replay and focus on the detail that separates the answers.'}ex.hidden=mode==='exam';updateProgress()}));
}
renderListening('listeningQuiz',guidedListening,false);renderListening('brightListeningQuiz',brightListening,true);
function resetListeningSet(prefix,data,examStyle){data.forEach((_,i)=>{delete answered[`${prefix}-${i}`];delete hintUsed[`${prefix}-${i}`]});renderListening(prefix,data,examStyle);updateProgress()}
$('#resetListening').addEventListener('click',()=>resetListeningSet('listeningQuiz',guidedListening,false));
$('#resetBrightListening').addEventListener('click',()=>resetListeningSet('brightListeningQuiz',brightListening,true));

function speak(text){if(!('speechSynthesis'in window)){alert('Audio is not supported in this browser.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-GB';u.rate=.88;speechSynthesis.speak(u)}
function bindAudio(root=document){$$('[data-say]',root).forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',()=>speak(b.dataset.say))})}bindAudio();

$$('[data-toggle]').forEach(b=>b.addEventListener('click',()=>{const x=document.getElementById(b.dataset.toggle);if(x)x.hidden=!x.hidden}));
$$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>document.querySelector(b.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));
$$('[data-reset]').forEach(b=>b.addEventListener('click',()=>resetQuiz(b.dataset.reset)));
$('#printBtn').addEventListener('click',()=>window.print());

$$('.mode-btn').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;$$('.mode-btn').forEach(x=>x.classList.toggle('active',x===b));document.body.classList.toggle('exam',mode==='exam');$('#modeDescription').textContent=mode==='coach'?'Coach mode keeps hints, explanations and gentle strategy reminders visible.':'Exam mode keeps the same instant right/wrong feedback, but hides explanations and strategy reminders until you return to Coach mode.';$$('.quiz-card,.listening-card').forEach(card=>{const fb=$('.feedback',card),ex=$('.explanation',card);if(ex&&fb&&fb.textContent.trim())ex.hidden=mode==='exam';});}));

function makeTimer(displayId,startId,resetId,seconds){let int=null,left=seconds;const paint=()=>{const m=String(Math.floor(left/60)).padStart(2,'0'),s=String(left%60).padStart(2,'0');$(displayId).textContent=`${m}:${s}`};$(startId).addEventListener('click',()=>{clearInterval(int);left=seconds;paint();int=setInterval(()=>{left--;paint();if(left<=0){clearInterval(int);$(displayId).textContent='Time!'}},1000)});$(resetId).addEventListener('click',()=>{clearInterval(int);left=seconds;paint()});paint()}
makeTimer('#writtenTimerDisplay','#writtenTimerStart','#writtenTimerReset',45);
makeTimer('#listenTimerDisplay','#listenTimerStart','#listenTimerReset',60);
makeTimer('#oralTimerDisplay','#oralTimerStart','#oralTimerReset',90);

$('#buildSpeakingPlan').addEventListener('click',()=>{const vals=[$('#speakExperience').value,$('#speakRole').value,$('#speakSkill').value,$('#speakGoal').value];if(vals.every(v=>!v.trim())){$('#speakingPlan').textContent='Add a few keywords first — they can be very short.';return}$('#speakingPlan').textContent=`1. Experience: ${vals[0]||'…'}\n2. What you did: ${vals[1]||'…'}\n3. What you learned: ${vals[2]||'…'}\n4. Objective now: ${vals[3]||'…'}\n\nSpeak from these keywords. Add: “What I learned most was…” and “At the moment…”`});
$('#clearSpeakingPlan').addEventListener('click',()=>{$$('#speakExperience,#speakRole,#speakSkill,#speakGoal').forEach(x=>x.value='');$('#speakingPlan').textContent='Your keyword plan will appear here.'});

function wordCounter(input,output){input.addEventListener('input',()=>{const n=input.value.trim()?input.value.trim().split(/\s+/).length:0;output.textContent=`${n} words`})}
wordCounter($('#emailBox'),$('#emailWordCount'));

function totalInteractive(){return Object.values(quizzes).reduce((n,a)=>n+a.length,0)+gapData.length+sentenceData.length+guidedListening.length+brightListening.length}
function skillTotals(){return {reading:quizzes.readingQuiz.length,language:quizzes.possessiveQuiz.length+quizzes.naturalQuiz.length+gapData.length+sentenceData.length,listening:guidedListening.length,bright:quizzes.brightWrittenQuiz.length+brightListening.length}}
function skillStats(skill){const vals=Object.values(answered).filter(v=>v.skill===skill);return {attempted:vals.length,correct:vals.filter(v=>v.correct).length}}
function updateProgress(){
  const total=totalInteractive(),vals=Object.values(answered),attempted=vals.length,correct=vals.filter(v=>v.correct).length;
  const completion=total?Math.round(attempted/total*100):0;$('#progressFill').style.width=`${completion}%`;
  $('#scoreText').textContent=attempted?`${correct} successful answers out of ${attempted} attempted · ${total-attempted} activities still available.`:'Complete the interactive activities to grow your progress garden.';
  const totals=skillTotals();let detail='';['reading','language','listening','bright'].forEach(skill=>{const st=skillStats(skill),pct=st.attempted?Math.round(st.correct/totals[skill]*100):0,practicePct=st.attempted?Math.round(st.attempted/totals[skill]*100):0;const fill=$(`#skill-${skill}`),label=$(`#skill-${skill}-label`);if(fill)fill.style.width=`${pct}%`;if(label)label.textContent=st.attempted?`${st.correct}/${totals[skill]} secure`:'Not started';detail+=`<div class="result-chip"><span>${skill==='reading'?'📖':skill==='language'?'🧠':skill==='listening'?'🎧':'🎯'}</span><strong>${skill[0].toUpperCase()+skill.slice(1)}</strong><small>${st.correct}/${st.attempted||0} correct${st.attempted?` · ${practicePct}% practised`:''}</small></div>`});
  $('#resultDetail').innerHTML=detail;$('#overallFlower').textContent=completion<20?'🌱':completion<50?'🌿':completion<80?'🌷':'🌸';
}
updateProgress();

$('#downloadResults').addEventListener('click',()=>{const totals=skillTotals();const lines=['LESSON 2 · PROGRESS NOTE','Building confidence step by step','',`Practice mode: ${mode}`,''];['reading','language','listening','bright'].forEach(skill=>{const st=skillStats(skill);lines.push(`${skill.toUpperCase()}: ${st.correct} correct / ${st.attempted} attempted (out of ${totals[skill]} available)`) });const hinted=Object.keys(hintUsed).length;lines.push('',`Hints used: ${hinted}`,'','What this lesson trained:','• reading for exact evidence and logical connectors','• natural English: possessives, meal/dish, currently/actually, prepositions, comparisons','• listening for time, place, changes and reasons','• Bright-style written and listening comprehension','• fuller oral answers: answer + detail + reason','• structured professional writing','','Reminder: progress is not one score. Keep the corrections that become easier to use naturally.');const blob=new Blob([lines.join('\n')],{type:'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='lesson-2-progress-note.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});

$('#resetAll').addEventListener('click',()=>{if(!confirm('Reset all interactive answers and writing on this page?'))return;answered={};hintUsed={};Object.keys(quizzes).forEach(renderQuiz);renderGaps();renderBuilders();renderListening('listeningQuiz',guidedListening,false);renderListening('brightListeningQuiz',brightListening,true);$$('textarea').forEach(x=>x.value='');$$('input[type="text"]').forEach(x=>x.value='');$$('input[type="checkbox"]').forEach(x=>x.checked=false);$('#emailWordCount').textContent='0 words';$('#speakingPlan').textContent='Your keyword plan will appear here.';updateProgress();window.scrollTo({top:0,behavior:'smooth'})});
