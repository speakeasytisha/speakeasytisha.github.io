const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

const choices = [
  ['Coffee','Tea','What makes your choice better?'],
  ['Sunrise','Sunset','Which one feels more like you?'],
  ['Dinner out','Dinner at home','What makes a really good evening?'],
  ['Books','Films','What keeps your attention longer?'],
  ['City','Countryside','What do you enjoy about it?'],
  ['Early bird','Night owl','When do you feel most like yourself?'],
  ['Fancy restaurant','Little hidden place','What atmosphere do you prefer?'],
  ['Plan everything','Decide at the last minute','Has your answer always been the same?'],
  ['Sweet','Salty','What is your impossible-to-resist choice?'],
  ['Music','Silence','When do you need one more than the other?'],
  ['Text message','Phone call','Which feels easier?'],
  ['Window open','Blanket on','What is your perfect room temperature?']
];

const pleasures = [
  ['☕','A really good coffee','What makes it really good for you?'],
  ['🛏️','Clean sheets','Why does this feel so ridiculously good?'],
  ['🎵','A song you love','What song instantly changes the atmosphere?'],
  ['☀️','Unexpected sunshine','What do you want to do when the sun appears?'],
  ['🚿','A long shower','Morning or evening?'],
  ['😂','Laughing until it hurts','Who makes you laugh the most?'],
  ['🔎','Finding something you lost','What is the most annoying thing to lose?'],
  ['🍝','Your favourite meal','What meal never disappoints you?'],
  ['📭','No messages to answer','Peaceful or suspicious?'],
  ['🕯️','A calm evening','What makes an evening feel calm?'],
  ['🌧️','Rain when you can stay inside','Cosy or depressing?'],
  ['✅','Cancelling something you didn’t want to do','Relief level: small, medium, enormous?']
];

const opinions = [
  ['Breakfast food is better at dinner.','Give me one breakfast food that proves your point.'],
  ['Dogs are better company than most people.','No names required.'],
  ['Voice messages are annoying.','When is a voice message actually useful?'],
  ['Sundays are better than Saturdays.','What is the best thing about your preferred day?'],
  ['Winter is underrated.','Defend or destroy winter.'],
  ['People take coffee far too seriously.','How seriously should coffee be taken?'],
  ['A nap can solve almost anything.','What can a nap definitely NOT solve?'],
  ['The best plans are the cancelled ones.','When is cancellation secretly excellent news?']
];

const debates = [
  ['Stepping in water with socks on','Your phone battery at 2%'],
  ['A mosquito in your bedroom','Realising you forgot something after leaving home'],
  ['Someone saying “we need to talk”','Hearing your alarm on a day off'],
  ['An itchy label in your shirt','A shopping trolley with one bad wheel'],
  ['A slow walker blocking the pavement','A person stopping at the top of an escalator'],
  ['A fitted sheet','A duvet cover'],
  ['The last bite falling on the floor','The first sip being too hot'],
  ['Forgetting why you walked into a room','Remembering at 3 a.m.']
];

const rather = [
  ['Have a private chef','Have a housekeeper','Luxury has been chosen.'],
  ['Give up chocolate','Give up cheese','This question is unfair by design.'],
  ['Always be 20 minutes early','Always be 10 minutes late','There is no neutral option.'],
  ['Know every language','Play every instrument','Imagine how annoying you would be at parties.'],
  ['Have perfect hair every day','Never do laundry again','Choose your superpower wisely.'],
  ['Only whisper','Only shout','Your neighbours are already concerned.'],
  ['Always find a parking space','Never wait in a queue','A true adult dilemma.'],
  ['Have unlimited restaurant meals','Have unlimited books and films','Both are dangerously tempting.'],
  ['Be able to pause time','Be able to rewind 10 minutes','No responsibility comes with either power.'],
  ['Laugh every time you are nervous','Hiccup every time you are serious','Professional composure has left the chat.']
];

const tellPrompts = [
  'Something that always makes you laugh.',
  'A food you could happily eat every week.',
  'A small thing that annoys you far more than it should.',
  'A song you almost never skip.',
  'Something you were obsessed with as a child.',
  'A completely useless talent you have—or wish you had.',
  'The best smell in the world.',
  'A film or series you can watch more than once.',
  'Something people love that you simply do not understand.',
  'A tiny luxury you really appreciate.',
  'A sentence you say all the time.',
  'Something that instantly makes a place feel cosy.',
  'The funniest thing a child or animal can do.',
  'A food you will never be persuaded to like.',
  'One everyday invention you are very grateful for.',
  'Something that should be easier than it is.',
  'The perfect lazy-day meal.',
  'One thing that is much better in real life than in photos.'
];

const vocab = {
  preferences:[
    ['♡','I’m more of a … person.','Je suis plutôt du genre…','A natural way to describe a preference.','I’m more of a coffee person.'],
    ['↔','I’m torn between the two.','J’hésite entre les deux.','Use when both choices appeal to you.','I’m torn between the two, but I’d probably choose the restaurant.'],
    ['✓','I’d go for…','Je choisirais…','A relaxed alternative to “I would choose”.','I’d go for the quiet evening.'],
    ['★','There’s no competition.','Il n’y a pas photo.','Use when your choice is very obvious.','Chocolate or cheese? For me, there’s no competition.'],
    ['≈','It depends on my mood.','Ça dépend de mon humeur.','Useful when your preference changes.','Music or silence? It depends on my mood.']
  ],
  reactions:[
    ['!','Absolutely.','Absolument.','Strong, natural agreement.','Absolutely. I completely agree.'],
    ['☺','Fair enough.','D’accord, je comprends.','A relaxed way to accept someone else’s view.','Fair enough. I can see why you like it.'],
    ['?','Really?','Vraiment ?','Simple surprise that keeps the conversation going.','Really? I would have guessed the opposite.'],
    ['✦','That’s a good one.','Pas mal ! / Bonne question.','Natural reaction to an interesting choice or question.','That’s a good one. I need to think.'],
    ['↻','I’ve never thought about that.','Je n’y ai jamais pensé.','Perfect when a question is unexpected.','I’ve never thought about that, but maybe…']
  ],
  stories:[
    ['→','The first thing that comes to mind is…','La première chose qui me vient à l’esprit, c’est…','A relaxed way to begin an answer.','The first thing that comes to mind is Sunday lunch.'],
    ['…','It reminds me of…','Ça me fait penser à…','Connect a topic to a memory.','It reminds me of something my grandmother used to make.'],
    ['☺','The funny thing is…','Ce qui est drôle, c’est que…','Introduce an amusing detail.','The funny thing is, I used to hate it.'],
    ['↪','For some reason…','Pour une raison quelconque…','Useful when you cannot fully explain a preference.','For some reason, that song always makes me happy.'],
    ['◌','I can’t really explain it, but…','Je ne sais pas vraiment l’expliquer, mais…','Keeps you talking without needing a perfect reason.','I can’t really explain it, but I find it relaxing.']
  ],
  disagreeing:[
    ['≈','I see your point, but…','Je comprends ton point de vue, mais…','Friendly disagreement.','I see your point, but Sundays feel too quiet for me.'],
    ['×','Not a chance.','Pas question.','Playful, strong disagreement.','Give up cheese? Not a chance.'],
    ['↔','I’m not convinced.','Je ne suis pas convaincue.','Calm disagreement without sounding harsh.','I’m not convinced. A nap can make things worse.'],
    ['☺','We’ll have to agree to disagree.','On va devoir accepter de ne pas être d’accord.','Friendly way to end a light disagreement.','Fine—we’ll have to agree to disagree.'],
    ['!','I couldn’t disagree more.','Je ne pourrais pas être moins d’accord.','Strong disagreement; best for playful topics here.','Winter is underrated? I couldn’t disagree more.']
  ]
};

const qualities = ['natural','clear','spontaneous','expressive','funny','thoughtful','curious','relaxed','engaged','warm'];
let currentDebate = 0;
let currentRather = 0;
let usedPrompts = [];

function shuffle(arr){
  const copy=[...arr];
  for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
  return copy;
}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove('show'),1700)}
function speak(text){
  if(!('speechSynthesis' in window)){toast('Audio is not available in this browser.');return;}
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.88;u.pitch=1;speechSynthesis.speak(u);
}

function renderChoices(data=choices){
  const host=$('#choiceGrid');host.innerHTML='';
  data.forEach(([a,b,q],i)=>{
    const card=document.createElement('article');card.className='choice-card';
    card.innerHTML=`<div class="choice-question">Choice ${String(i+1).padStart(2,'0')}</div><div class="choice-options"><button type="button">${a}</button><button type="button">${b}</button></div><div class="choice-followup">If you want: <strong>${q}</strong></div>`;
    $$('.choice-options button',card).forEach(btn=>btn.addEventListener('click',()=>{
      $$('.choice-options button',card).forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');card.classList.add('answered');
    }));host.appendChild(card);
  });
}
function renderPleasures(){
  const host=$('#pleasureGrid');
  pleasures.forEach(([icon,title,prompt])=>{
    const b=document.createElement('button');b.type='button';b.className='pleasure-card';b.innerHTML=`<span class="pleasure-icon">${icon}</span><strong>${title}</strong>`;
    b.addEventListener('click',()=>{b.classList.toggle('selected');$('#pleasurePrompt').innerHTML=`<span class="prompt-label">Your conversation prompt</span><p>${prompt}</p>`;});host.appendChild(b);
  });
}
function renderOpinions(){
  const host=$('#opinionStack');
  opinions.forEach(([statement,follow])=>{
    const card=document.createElement('article');card.className='opinion-card';
    card.innerHTML=`<blockquote>“${statement}”</blockquote><div class="opinion-actions"><button type="button">Agree</button><button type="button">Disagree</button><button type="button">Absolutely not</button></div><p class="opinion-followup">${follow}</p>`;
    $$('.opinion-actions button',card).forEach(btn=>btn.addEventListener('click',()=>{$$('.opinion-actions button',card).forEach(x=>x.classList.remove('selected'));btn.classList.add('selected')}));host.appendChild(card);
  });
}
function showDebate(){
  const [a,b]=debates[currentDebate];$('#debateA').textContent=a;$('#debateB').textContent=b;$('#debateA').classList.remove('selected');$('#debateB').classList.remove('selected');$('#debateResponse').textContent='Your verdict can be as serious—or as silly—as you like.';
}
function showRather(){
  const [a,b,comment]=rather[currentRather];$('#ratherQuestion').textContent=`Would you rather…`;$('#ratherA').textContent=a;$('#ratherB').textContent=b;$('#ratherComment').textContent='Choose one. Regret it immediately.';$('#ratherA').dataset.comment=comment;$('#ratherB').dataset.comment=comment;
}
function drawPrompt(){
  if(usedPrompts.length===tellPrompts.length) usedPrompts=[];
  const available=tellPrompts.map((_,i)=>i).filter(i=>!usedPrompts.includes(i));
  const idx=available[Math.floor(Math.random()*available.length)];usedPrompts.push(idx);
  const card=$('#tellCard');card.classList.remove('animate');void card.offsetWidth;card.classList.add('animate');card.innerHTML=`<div class="card-corner">✦</div><p>${tellPrompts[idx]}</p>`;
}
function renderVocab(cat='preferences'){
  const host=$('#vocabList');host.innerHTML='';
  vocab[cat].forEach(([icon,phrase,fr,definition,example])=>{
    const item=document.createElement('article');item.className='vocab-item';
    item.innerHTML=`<button class="vocab-head" type="button"><span class="vocab-icon">${icon}</span><span class="vocab-phrase">${phrase}</span><span class="vocab-chevron">＋</span></button><div class="vocab-detail"><p><strong>FR:</strong> ${fr}</p><p><strong>Meaning:</strong> ${definition}</p><p><strong>Example:</strong> “${example}”</p><button class="listen-inline" type="button">▶ Listen</button></div>`;
    $('.vocab-head',item).addEventListener('click',()=>{item.classList.toggle('open');$('.vocab-chevron',item).textContent=item.classList.contains('open')?'−':'＋'});
    $('.listen-inline',item).addEventListener('click',()=>speak(`${phrase}. ${example}`));host.appendChild(item);
  });
}
function renderTeacherNotes(){
  const host=$('#teacherNotes');
  for(let i=1;i<=4;i++){
    const a=document.createElement('article');a.className='teacher-note';
    a.innerHTML=`<label for="heard${i}">What you heard</label><input id="heard${i}" data-note="heard${i}" placeholder="A phrase from the conversation"><label for="instead${i}">A little polish</label><input id="instead${i}" data-note="instead${i}" placeholder="A natural alternative">`;host.appendChild(a);
  }
  qualities.forEach(q=>{const b=document.createElement('button');b.type='button';b.className='quality-pill';b.textContent=q;b.addEventListener('click',()=>{b.classList.toggle('selected');updateQualities()});$('#qualityPills').appendChild(b)});
  loadNotes();
}
function updateQualities(){
  const picked=$$('.quality-pill.selected').map(x=>x.textContent);const out=$('#qualitiesOutput');
  if(!picked.length){out.classList.add('hidden');out.innerHTML='';return;}
  out.innerHTML=picked.map(q=>`<span>You sounded ${q}</span>`).join('');out.classList.remove('hidden');
}
function saveNotes(){
  const data={};$$('[data-note]').forEach(i=>data[i.dataset.note]=i.value);localStorage.setItem('mahria-no-goals-notes',JSON.stringify(data));$('#saveStatus').textContent='Saved on this device.';setTimeout(()=>$('#saveStatus').textContent='',1800);
}
function loadNotes(){
  try{const data=JSON.parse(localStorage.getItem('mahria-no-goals-notes')||'{}');Object.entries(data).forEach(([k,v])=>{const el=$(`[data-note="${k}"]`);if(el)el.value=v;});}catch(e){}
}
function clearNotes(){localStorage.removeItem('mahria-no-goals-notes');$$('[data-note]').forEach(i=>i.value='');$('#saveStatus').textContent='Cleared.';setTimeout(()=>$('#saveStatus').textContent='',1200)}
function confetti(){
  const chars=['✦','♡','·','✧','☺'];
  for(let i=0;i<32;i++){const s=document.createElement('span');s.className='confetti';s.textContent=chars[Math.floor(Math.random()*chars.length)];s.style.left=Math.random()*100+'vw';s.style.animationDelay=(Math.random()*.45)+'s';s.style.fontSize=(13+Math.random()*12)+'px';s.style.color=['#d7bd84','#d7a6b7','#8d496f','#fff'][Math.floor(Math.random()*4)];document.body.appendChild(s);setTimeout(()=>s.remove(),2500)}
}

$$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.scroll)?.scrollIntoView({behavior:'smooth',block:'start'})));
$$('[data-toggle]').forEach(b=>b.addEventListener('click',()=>$('#'+b.dataset.toggle)?.classList.toggle('hidden')));
$$('[data-say]').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.say)));
$$('.permission-card').forEach(b=>b.addEventListener('click',()=>{b.classList.toggle('selected');$('#permissionMessage').textContent=b.classList.contains('selected')?b.dataset.permission:'No problem. You can change your mind.'}));
$$('#moodRow button').forEach(b=>b.addEventListener('click',()=>{$$('#moodRow button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');$('#moodFollowup').innerHTML=`Today feels <strong>${b.dataset.mood}</strong>. That is enough information for now. If you want: <strong>What would make today 5% nicer?</strong>`}));
$('#shuffleChoices').addEventListener('click',()=>renderChoices(shuffle(choices)));
$('#newDebate').addEventListener('click',()=>{currentDebate=(currentDebate+1)%debates.length;showDebate()});
[$('#debateA'),$('#debateB')].forEach(b=>b.addEventListener('click',()=>{$('#debateA').classList.remove('selected');$('#debateB').classList.remove('selected');b.classList.add('selected');$('#debateResponse').textContent=`Verdict accepted. Now defend “${b.textContent}” as if civilization depends on it.`}));
[$('#ratherA'),$('#ratherB')].forEach(b=>b.addEventListener('click',()=>$('#ratherComment').textContent=b.dataset.comment));
$('#nextRather').addEventListener('click',()=>{currentRather=(currentRather+1)%rather.length;showRather()});
$('#drawPrompt').addEventListener('click',drawPrompt);
$$('.vocab-tab').forEach(t=>t.addEventListener('click',()=>{$$('.vocab-tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');renderVocab(t.dataset.vocab)}));
$('#teacherToggle').addEventListener('click',()=>{$('#teacherCorner').classList.toggle('hidden');$('#teacherToggle').classList.toggle('active');if(!$('#teacherCorner').classList.contains('hidden'))$('#teacherCorner').scrollIntoView({behavior:'smooth',block:'start'})});
$('#saveNotes').addEventListener('click',saveNotes);$('#clearNotes').addEventListener('click',clearNotes);
$('#noHomework').addEventListener('click',()=>{confetti();$('#finalMessage').textContent='Nothing else to do. Go enjoy the rest of your day. ♡';toast('No homework. Promise.')});

renderChoices();renderPleasures();renderOpinions();showDebate();showRather();renderVocab();renderTeacherNotes();
