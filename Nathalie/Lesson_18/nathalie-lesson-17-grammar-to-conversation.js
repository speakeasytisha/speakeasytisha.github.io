const KEY='nathalie_l17_grammar_conversation_v2';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
let state={french:true,answers:{},fill:{},toolbox:[],writing:'',manual:{},cando:[],topic:'travel'};
let mediaRecorder=null,chunks=[],audioBlob=null;

const WARMUP=[
 {q:'I ___ African dance every week.',opts:['practise','practised','have practised','am going to practise'],a:'practise',why:'Every week = a routine → present simple.'},
 {q:'Last year, we ___ Scotland.',opts:['visit','have visited','visited','are visiting'],a:'visited',why:'Last year = a finished past time → past simple.'},
 {q:'I ___ never ___ to Ireland.',opts:['have / been','did / go','am / going','was / been'],a:'have / been',why:'Never + life experience → present perfect.'},
 {q:'Next spring, we ___ travel to an English-speaking country.',opts:['are going to','went to','have','usually'],a:'are going to',why:'A future plan → be going to.'},
 {q:'Asia is often ___ than France in winter.',opts:['warmer','more warm','warmest','the warmer'],a:'warmer',why:'Compare two things → comparative: warmer than.'},
 {q:'___ you tell me if breakfast is included, please?',opts:['Could','Did','Have','Are'],a:'Could',why:'Could you…? is a polite request.'}
];

const VOCAB=[
 {cat:'travel',icon:'🧳',en:'a guesthouse',fr:'une maison d’hôtes',ex:'We stayed in a small guesthouse near the coast.'},
 {cat:'travel',icon:'🗺️',en:'a destination',fr:'une destination',ex:'Our next destination may be an English-speaking island.'},
 {cat:'travel',icon:'🥾',en:'to explore',fr:'explorer / découvrir',ex:'I like to explore a place on foot.'},
 {cat:'travel',icon:'🌿',en:'scenery',fr:'les paysages',ex:'The scenery was beautiful and very green.'},
 {cat:'experience',icon:'✨',en:'memorable',fr:'mémorable',ex:'It was one of my most memorable trips.'},
 {cat:'experience',icon:'🧠',en:'an experience',fr:'une expérience',ex:'Living in Senegal was an important experience.'},
 {cat:'experience',icon:'🌍',en:'to discover',fr:'découvrir',ex:'I enjoy discovering new cultures.'},
 {cat:'experience',icon:'🍲',en:'local food',fr:'la cuisine locale',ex:'We always try local food when we travel.'},
 {cat:'conversation',icon:'💬',en:'actually',fr:'en fait',ex:'Actually, I prefer travelling in spring.'},
 {cat:'conversation',icon:'🔗',en:'however',fr:'cependant',ex:'The hotel was beautiful; however, it was noisy.'},
 {cat:'conversation',icon:'🎯',en:'especially',fr:'surtout / particulièrement',ex:'I like wildlife, especially elephants.'},
 {cat:'conversation',icon:'🧩',en:'for example',fr:'par exemple',ex:'I enjoy outdoor activities, for example walking and gardening.'},
 {cat:'useful',icon:'📅',en:'in advance',fr:'à l’avance',ex:'I usually book accommodation in advance.'},
 {cat:'useful',icon:'🛎️',en:'available',fr:'disponible',ex:'Could you tell me if a quiet room is available?'},
 {cat:'useful',icon:'🤝',en:'to recommend',fr:'recommander',ex:'I would recommend the area to nature lovers.'},
 {cat:'useful',icon:'🔄',en:'instead',fr:'à la place',ex:'We took the train instead of driving.'}
];
const VOCAB_QUIZ=[
 {q:'I usually book my hotel ___ so I have more choice.',opts:['in advance','instead','ever','yesterday'],a:'in advance'},
 {q:'The mountains and lake created beautiful ___.',opts:['scenery','available','destination','request'],a:'scenery'},
 {q:'Could you tell me if a double room is ___?',opts:['available','memorable','local','finished'],a:'available'},
 {q:'I enjoy many activities, ___ walking and gardening.',opts:['for example','however','instead','yet'],a:'for example'},
 {q:'I would ___ Grand-Lieu Lake to people who love birds.',opts:['recommend','discovering','available','compare'],a:'recommend'}
];

const GRAMMAR={
 present:{title:'🔁 Present simple — habits, routines & facts',formula:'I/you/we/they + base verb · he/she/it + -s',signals:['usually','often','every week','always','sometimes','never'],examples:['I look after my granddaughter every Wednesday.','My husband and I often travel in winter.'],watch:'Use do/does for questions: How often do you travel?'},
 past:{title:'⬅️ Past simple — a finished moment in the past',formula:'subject + past form / did + base verb',signals:['yesterday','last year','in 2024','when I was…','two years ago'],examples:['I lived in Senegal for two years.','We visited Edinburgh last spring.'],watch:'After did/didn’t, use the base verb: Did you enjoy it? — not “Did you enjoyed?”'},
 perfect:{title:'🌉 Present perfect — experience or a past action connected to now',formula:'have/has + past participle',signals:['ever','never','already','yet','since','for','so far'],examples:['I have visited several countries in Asia.','I have never been to Ireland.'],watch:'Do not use it with a finished time such as “last year”. Say: I went last year.'},
 future:{title:'➡️ Future — plans, intentions & decisions',formula:'be going to + verb · will + verb',signals:['next week','next year','tomorrow','this summer','I think…'],examples:['We are going to travel next spring.','I think I will book the hotel tomorrow.'],watch:'Going to = a plan/intention. Will = a decision, prediction or offer.'},
 compare:{title:'⚖️ Comparatives & superlatives — compare clearly',formula:'short adjective + -er + than · more + adjective + than · the -est / the most',signals:['than','of all','in the group','much','a little'],examples:['Winter in Thailand is warmer than winter in France.','It was the most peaceful place on our trip.'],watch:'Good → better → the best. Bad → worse → the worst.'},
 polite:{title:'🤝 Polite English — requests, problems & advice',formula:'Could you…? · Would it be possible to…? · I would like… · You should…',signals:['please','possible','would like','problem','advice'],examples:['Could you tell me if breakfast is included?','Would it be possible to change rooms?'],watch:'Use “would like + to + verb”: I would like to book — not “I would like booking”.'}
};

const GRAMMAR_QUIZ=[
 {q:'“Usually” tells me I probably need…',opts:['present simple','past simple','present perfect','future'],a:'present simple'},
 {q:'“Last weekend” tells me I probably need…',opts:['past simple','present perfect','present simple','future'],a:'past simple'},
 {q:'“Have you ever…?” asks about…',opts:['life experience','a fixed finished time','a routine','a future plan'],a:'life experience'},
 {q:'“Next spring, we have already decided…” suggests…',opts:['going to','past simple','present perfect only','comparative'],a:'going to'},
 {q:'“than” usually signals…',opts:['a comparative','a superlative','present perfect','a polite request'],a:'a comparative'},
 {q:'“Could you…?” is mainly used for…',opts:['a polite request','a finished past action','a habit','a life experience'],a:'a polite request'},
 {q:'“since 2023” usually works with…',opts:['present perfect','past simple','going to','comparative'],a:'present perfect'},
 {q:'“the most interesting” is…',opts:['a superlative','a comparative','a past participle','a modal'],a:'a superlative'}
];

const FILL=[
 {pre:'I usually',ans:'walk',post:'near Grand-Lieu Lake when the weather is nice.',hint:'walk — routine'},
 {pre:'We',ans:'visited',post:'Scotland last spring.',hint:'visit — finished past'},
 {pre:'I have never',ans:'been',post:'to Canada.',hint:'be — life experience'},
 {pre:'My husband and I are going to',ans:'travel',post:'next spring.',hint:'travel — plan'},
 {pre:'Thailand is',ans:'warmer',post:'than France in winter.',hint:'warm — comparative'},
 {pre:'Could you',ans:'tell',post:'me if parking is included?',hint:'tell — polite question'},
 {pre:'I have lived near Nantes',ans:'for',post:'several years.',hint:'for / since'},
 {pre:'I enjoy',ans:'discovering',post:'new cultures and local food.',hint:'discover — after enjoy'}
];
const QUESTIONS=[
 {q:'Answer: “I travel two or three times a year.”',opts:['How often do you travel?','Where did you travel?','Have you travelled?','Why are you travelling?'],a:'How often do you travel?'},
 {q:'Answer: “Yes, I have been to Scotland.”',opts:['Have you ever been to Scotland?','When are you going to Scotland?','How often do you go to Scotland?','Did you live in Scotland?'],a:'Have you ever been to Scotland?'},
 {q:'Answer: “We went there last May.”',opts:['When did you go there?','How long have you lived there?','Where are you going next?','How often do you go there?'],a:'When did you go there?'},
 {q:'Answer: “We are going to visit an island next spring.”',opts:['What are you going to do next spring?','What did you do last spring?','What have you never done?','What do you usually do on Wednesdays?'],a:'What are you going to do next spring?'}
];

const LISTENING_TEXT="Last spring, my husband and I travelled to Scotland for one week. We stayed in a small guesthouse outside Edinburgh because we wanted a quiet place. I had never visited Scotland before, so everything was new to me. We walked a lot, visited the old town and tried local food. The weather was cooler than in France, but the scenery was beautiful. Since that trip, I have become even more interested in English-speaking countries. Next spring, we are going to choose another destination where we can walk, discover nature and practise English.";
const LISTENING_Q=[
 {q:'When did the trip happen?',opts:['Last spring','Next spring','Every spring','This winter'],a:'Last spring'},
 {q:'Why did they choose a guesthouse outside Edinburgh?',opts:['They wanted a quiet place','It was the cheapest place in Europe','They had family there','They did not like cities'],a:'They wanted a quiet place'},
 {q:'Had she visited Scotland before?',opts:['No','Yes, many times','Yes, once as a child','The text does not say'],a:'No'},
 {q:'What comparison does she make?',opts:['The weather was cooler than in France','Scotland was warmer than Asia','Edinburgh was bigger than Paris','The food was cheaper than at home'],a:'The weather was cooler than in France'},
 {q:'What is the future plan?',opts:['Choose another destination next spring','Move to Scotland','Stop travelling','Visit Senegal next week'],a:'Choose another destination next spring'}
];

const SPEAK_TOPICS=[
 {id:'home',icon:'🏡',title:'Home & area',prompt:'Where do you live and what do you like about your area?',time:'present',keywords:['La Chevrolière','near Nantes','Grand-Lieu Lake','peaceful','nature'],model:'I live in La Chevrolière, near Nantes. One of the things I like most is being close to Grand-Lieu Lake. The area is peaceful and there is a lot of nature, so it is a good place for walking. I would recommend it to people who enjoy birds and quiet places.',follow:['How long have you lived there?','What can visitors do in your area?','How is it different from the Paris area?']},
 {id:'past',icon:'🧭',title:'Past experience',prompt:'Tell me about a memorable place you visited.',time:'past',keywords:['when?','where?','with whom?','what did you do?','why memorable?'],model:'One memorable trip was our visit to Scotland last spring. I travelled with my husband and we stayed for about a week. We walked around Edinburgh, discovered the old town and tried local food. I liked the atmosphere because it was historic and lively.',follow:['What did you enjoy most?','Was anything difficult?','Would you go back? Why?']},
 {id:'experience',icon:'🌍',title:'Life experience',prompt:'What countries or cultures have you discovered in your life?',time:'perfect',keywords:['have visited','have lived','ever/never','Senegal','Asia'],model:'I have had the chance to discover several cultures. I lived in Senegal for two years, and I have also travelled to different countries in Asia. These experiences have helped me become more curious about local traditions, food and ways of life.',follow:['Which experience changed you most?','Have you ever travelled alone?','What country have you not visited yet?']},
 {id:'future',icon:'✈️',title:'Future trip',prompt:'What kind of trip would you like to take next?',time:'future',keywords:['next spring','going to','would like','walking','nature'],model:'Next spring, my husband and I would like to visit another destination where we can walk and enjoy nature. We are going to compare a few places before we decide. I would prefer somewhere with beautiful scenery and opportunities to practise English.',follow:['How will you choose the destination?','What will you book first?','What would make the trip perfect?']},
 {id:'hobby',icon:'🥁',title:'Hobbies',prompt:'What activity is important to you and why?',time:'present',keywords:['African dance','percussion','how often','because','feel'],model:'African dance and percussion are very important to me. I practise them because I love the rhythm, the energy and the group atmosphere. They are different from some of my quieter hobbies, such as reading or sewing, and they help me stay active.',follow:['How often do you practise?','How did you discover this activity?','Which hobby helps you relax most?']},
 {id:'problem',icon:'🛎️',title:'Travel problem',prompt:'Your room is too noisy. Explain the problem and ask for a solution.',time:'polite',keywords:['I’m sorry','problem','too noisy','could','possible'],model:'I’m sorry, but I have a problem with my room. It is very noisy and I could not sleep well last night. Would it be possible to move to a quieter room, please? I would really appreciate your help.',follow:['What if no other room is available?','How would you explain the problem by phone?','What other solution could you accept?']}
];

const WRITING_MODEL=`Hello,\n\nMy husband and I are going to travel next spring, and we would like to stay at your guesthouse for four nights. Could you tell me if breakfast and parking are included in the price? We would prefer a quiet double room because we like to rest after walking during the day.\n\nCould you please confirm the availability and the total price?\n\nKind regards,\nNathalie`;

function save(){
  state.french=!$('#toggleFrench').textContent.includes('OFF');
  state.writing=$('#writingText')?.value||state.writing;
  state.cando=$$('.cando:checked').map(x=>x.value);
  ['speakGrammar','speakFluency','speakVocab','speakPron','speakingTeacherNote','writeTask','writeGrammar','writeVocab','writeOrg','writingTeacherNote','overallStatus','nextPriority','trainerComments','learnerUnderstanding','learnerConfidence','learnerPace','learnerActivities','learnerBest','learnerMore'].forEach(id=>{if($('#'+id))state.manual[id]=$('#'+id).value});
  localStorage.setItem(KEY,JSON.stringify(state));
}
function load(){try{state={...state,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){}}
function escapeHTML(s){return String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
function shuffle(arr,seedText=''){let a=[...arr],seed=[...seedText].reduce((n,c)=>n+c.charCodeAt(0),0)+17;for(let i=a.length-1;i>0;i--){seed=(seed*9301+49297)%233280;let j=Math.floor(seed/233280*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function speak(text,rate=.92){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=$('#accent').value;u.rate=rate;speechSynthesis.speak(u)}
function pct(n,d){return d?Math.round(n/d*100):0}
function statusFromPct(p){return p>=85?'Acquis':p>=60?'En cours d’acquisition':p>0?'À renforcer':'Non commencé'}

function renderQuiz(containerId,data,key,scoreId){
 const root=$('#'+containerId); if(!root)return;
 root.innerHTML=data.map((it,i)=>{
   const shuffled=shuffle(it.opts,it.q);
   const saved=state.answers[key+i];
   return `<div class="quiz-card"><p><strong>${i+1}.</strong> ${it.q}</p><div class="options">${shuffled.map(o=>`<button data-quiz="${key}" data-i="${i}" data-opt="${escapeHTML(o)}" class="${saved===o?(o===it.a?'correct':'wrong'):''}">${o}</button>`).join('')}</div><div class="feedback ${saved?(saved===it.a?'good':'bad'):''}" id="fb-${key}-${i}">${saved?(saved===it.a?'✓ Correct. ':'✗ Try again. ')+(it.why||''):''}</div></div>`
 }).join('');
 $$(`[data-quiz="${key}"]`).forEach(b=>b.onclick=()=>{
   const i=+b.dataset.i,opt=b.dataset.opt,it=data[i];state.answers[key+i]=opt;
   $$(`[data-quiz="${key}"][data-i="${i}"]`).forEach(x=>x.classList.remove('correct','wrong'));
   b.classList.add(opt===it.a?'correct':'wrong');
   const fb=$(`#fb-${key}-${i}`);fb.textContent=(opt===it.a?'✓ Correct. ':'✗ Not yet. ')+(it.why||'');fb.className='feedback '+(opt===it.a?'good':'bad');
   save();updateScores();
 });
 updateQuizScore(data,key,scoreId);
}
function quizCorrect(data,key){return data.reduce((n,it,i)=>n+(state.answers[key+i]===it.a),0)}
function updateQuizScore(data,key,scoreId){if($('#'+scoreId))$('#'+scoreId).textContent=`${quizCorrect(data,key)} / ${data.length}`}

function renderVocab(filter='all'){
 const cats=[['all','All'],['travel','Travel'],['experience','Experience'],['conversation','Connectors'],['useful','Useful English']];
 $('#vocabFilters').innerHTML=cats.map(([id,label])=>`<button data-vf="${id}" class="${filter===id?'active':''}">${label}</button>`).join('');
 const list=filter==='all'?VOCAB:VOCAB.filter(v=>v.cat===filter);
 $('#vocabGrid').innerHTML=list.map(v=>`<article class="vocab-card"><span class="icon">${v.icon}</span><strong>${v.en}</strong><span class="translation ${state.french?'':'hidden-fr'}">${v.fr}</span><p class="example">${v.ex}</p><button data-speak="${escapeHTML(v.en+'. '+v.ex)}">🔊 Listen</button></article>`).join('');
 $$('[data-vf]').forEach(b=>b.onclick=()=>renderVocab(b.dataset.vf));
 $$('[data-speak]').forEach(b=>b.onclick=()=>speak(b.dataset.speak));
}

function renderGrammar(which='present'){
 $$('.tense-card').forEach(b=>b.classList.toggle('active',b.dataset.tense===which));
 const g=GRAMMAR[which];
 $('#grammarDetail').innerHTML=`<h3>${g.title}</h3><div class="rule-formula">${g.formula}</div><div class="signal-list">${g.signals.map(x=>`<span>${x}</span>`).join('')}</div>${g.examples.map(e=>`<div class="example-line">${e} <button data-gsay="${escapeHTML(e)}">🔊</button></div>`).join('')}<p class="watch">⚠ Watch out: ${g.watch}</p>`;
 $$('[data-gsay]').forEach(b=>b.onclick=()=>speak(b.dataset.gsay));
}

function renderFill(){
 $('#fillTasks').innerHTML=FILL.map((it,i)=>`<div class="fill-card"><div class="fill-line"><strong>${i+1}.</strong><span>${it.pre}</span><input id="fill-${i}" value="${escapeHTML(state.fill[i]||'')}" placeholder="${escapeHTML(it.hint)}"><span>${it.post}</span><button data-checkfill="${i}">Check</button></div><div class="fill-feedback" id="fillfb-${i}"></div></div>`).join('');
 $$('[data-checkfill]').forEach(b=>b.onclick=()=>{let i=+b.dataset.checkfill,v=$('#fill-'+i).value.trim().toLowerCase();state.fill[i]=$('#fill-'+i).value.trim();let ok=v===FILL[i].ans.toLowerCase();$('#fillfb-'+i).innerHTML=ok?`<span class="correct-text">✓ Correct</span>`:`<span class="wrong-text">Try again.</span> <button data-revealfill="${i}" class="secondary">Show answer</button>`;$$(`[data-revealfill="${i}"]`).forEach(x=>x.onclick=()=>{$('#fill-'+i).value=FILL[i].ans;state.fill[i]=FILL[i].ans;$('#fillfb-'+i).innerHTML=`<span class="correct-text">Answer: ${FILL[i].ans}</span>`;save();updateScores()});save();updateScores()});
}
function fillCorrect(){return FILL.reduce((n,it,i)=>n+((state.fill[i]||'').trim().toLowerCase()===it.ans.toLowerCase()),0)}

function renderSpeaking(){
 $('#topicList').innerHTML=SPEAK_TOPICS.map(t=>`<button data-topic="${t.id}" class="${state.topic===t.id?'active':''}">${t.icon} ${t.title}</button>`).join('');
 $$('[data-topic]').forEach(b=>b.onclick=()=>{state.topic=b.dataset.topic;save();renderSpeaking()});
 const t=SPEAK_TOPICS.find(x=>x.id===state.topic)||SPEAK_TOPICS[0],g=GRAMMAR[t.time];
 $('#speakingStudio').innerHTML=`<p class="speaking-prompt">${t.prompt}</p><div class="buttons left"><button id="listenPrompt">🔊 Listen to question</button></div><div class="keyword-row">${t.keywords.map(k=>`<span>${k}</span>`).join('')}</div><div class="ladder-grid"><div class="ladder-box"><strong>1 · Short answer</strong><span>2 complete sentences</span></div><div class="ladder-box"><strong>2 · Expand</strong><span>Add because / example / comparison</span></div><div class="ladder-box"><strong>3 · Conversation</strong><span>Answer a follow-up without a script</span></div></div><div class="teacher-note"><strong>Grammar reminder:</strong> ${g.formula}</div><textarea id="speakNotes" placeholder="Keywords only — do not write a full script unless you need support."></textarea><div class="buttons left"><button id="showSpeakModel">👁 Show model answer</button><button id="listenSpeakModel" class="secondary">🔊 Listen to model</button></div><div id="speakModel" class="model hidden">${t.model}</div><h3>Follow-up questions</h3><div class="follow-grid">${t.follow.map(q=>`<div class="follow-card">${q}<br><button data-fsay="${escapeHTML(q)}">🔊</button></div>`).join('')}</div>`;
 $('#listenPrompt').onclick=()=>speak(t.prompt);$('#showSpeakModel').onclick=()=>$('#speakModel').classList.toggle('hidden');$('#listenSpeakModel').onclick=()=>speak(t.model);$$('[data-fsay]').forEach(b=>b.onclick=()=>speak(b.dataset.fsay));
}

function updateWriting(){
 const text=$('#writingText').value;state.writing=text;const words=text.trim()?text.trim().split(/\s+/).length:0;$('#wordCount').textContent=words+' words';
 const signals=[/going to/i,/would like/i,/could you/i,/because/i,/prefer/i,/confirm/i,/included/i];let found=signals.reduce((n,r)=>n+(r.test(text)?1:0),0);$('#writingSignals').textContent=found+' useful structures detected';save();
}

function autoSections(){
 const warm=quizCorrect(WARMUP,'w'),vocab=quizCorrect(VOCAB_QUIZ,'v'),gram=quizCorrect(GRAMMAR_QUIZ,'g'),fill=fillCorrect(),quest=quizCorrect(QUESTIONS,'q'),listen=quizCorrect(LISTENING_Q,'l');
 return [
  ['Warm-up',warm,WARMUP.length],['Vocabulary',vocab,VOCAB_QUIZ.length],['Grammar recognition',gram,GRAMMAR_QUIZ.length],['Accuracy',fill,FILL.length],['Questions',quest,QUESTIONS.length],['Listening',listen,LISTENING_Q.length]
 ];
}
function updateScores(){
 updateQuizScore(WARMUP,'w','warmupScore');updateQuizScore(VOCAB_QUIZ,'v','vocabScore');updateQuizScore(GRAMMAR_QUIZ,'g','grammarScore');updateQuizScore(LISTENING_Q,'l','listeningScore');$('#controlledScore').textContent=`${fillCorrect()} / ${FILL.length}`;
 const sections=autoSections();let got=sections.reduce((n,x)=>n+x[1],0),total=sections.reduce((n,x)=>n+x[2],0),p=pct(got,total);$('#scoreTop').textContent=p+'%';$('#overallPercent').textContent=p+'%';
 $('#qualRows').innerHTML=sections.map(([name,n,d])=>{let pp=pct(n,d);return `<tr><td>${name}</td><td>${n}/${d} (${pp}%)</td><td>${statusFromPct(pp)}</td></tr>`}).join('');
}
function restoreManual(){Object.entries(state.manual||{}).forEach(([id,v])=>{if($('#'+id))$('#'+id).value=v});$$('.cando').forEach(c=>c.checked=(state.cando||[]).includes(c.value));}
function toggleFrench(force){state.french=typeof force==='boolean'?force:!state.french;$('#toggleFrench').textContent=`🇫🇷 French help: ${state.french?'ON':'OFF'}`;$$('.fr,.translation').forEach(el=>el.classList.toggle('hidden-fr',!state.french));save();}

async function startRecording(){
 const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>chunks.push(e.data);mediaRecorder.onstop=()=>{audioBlob=new Blob(chunks,{type:'audio/webm'});$('#playback').src=URL.createObjectURL(audioBlob);$('#playback').classList.remove('hidden');$('#downloadRec').disabled=false;stream.getTracks().forEach(t=>t.stop())};mediaRecorder.start();$('#startRec').disabled=true;$('#stopRec').disabled=false;
}
function reportText(){
 const sections=autoSections();let got=sections.reduce((n,x)=>n+x[1],0),total=sections.reduce((n,x)=>n+x[2],0);const m=state.manual||{};
 return `Nathalie — Lesson 17: From Grammar to Conversation\nDate: ${new Date().toLocaleDateString('fr-FR')}\n\nAUTOMATIC PRACTICE\n${sections.map(([n,a,b])=>`${n}: ${a}/${b} — ${statusFromPct(pct(a,b))}`).join('\n')}\nOverall: ${pct(got,total)}%\n\nSPEAKING\nGrammar: ${m.speakGrammar||'—'}\nFluency: ${m.speakFluency||'—'}\nVocabulary: ${m.speakVocab||'—'}\nPronunciation: ${m.speakPron||'—'}\nTeacher note: ${m.speakingTeacherNote||'—'}\n\nWRITING\nTask completion: ${m.writeTask||'—'}\nGrammar: ${m.writeGrammar||'—'}\nVocabulary: ${m.writeVocab||'—'}\nOrganisation: ${m.writeOrg||'—'}\nTeacher note: ${m.writingTeacherNote||'—'}\n\nOVERALL ACQUISITION: ${m.overallStatus||'—'}\nPriority next lesson: ${m.nextPriority||'—'}\nTrainer comments: ${m.trainerComments||'—'}\n\nLEARNER FEEDBACK\nUnderstanding: ${m.learnerUnderstanding||'—'}\nConfidence: ${m.learnerConfidence||'—'}\nPace: ${m.learnerPace||'—'}\nActivities: ${m.learnerActivities||'—'}\nMost helpful: ${m.learnerBest||'—'}\nPractise more: ${m.learnerMore||'—'}\n\nCAN-DO\n${(state.cando||[]).map(x=>'✓ '+x).join('\n')||'—'}`;
}
function bind(){
 $$('[data-scroll]').forEach(b=>b.onclick=()=>$(b.dataset.scroll).scrollIntoView({behavior:'smooth'}));
 $('#toggleFrench').onclick=()=>toggleFrench();$('#stopSpeech').onclick=()=>speechSynthesis.cancel();$('#saveProgress').onclick=()=>{save();$('#copyStatus').textContent='Progress saved on this device.'};
 $('#resetLesson').onclick=()=>{if(confirm('Reset all saved Lesson 17 progress?')){localStorage.removeItem(KEY);location.reload()}};
 $$('.tense-card').forEach(b=>b.onclick=()=>renderGrammar(b.dataset.tense));
 $('#playListening').onclick=()=>speak(LISTENING_TEXT,.9);$('#playSlow').onclick=()=>speak(LISTENING_TEXT,.72);$('#toggleTranscript').onclick=()=>{$('#transcript').classList.toggle('hidden');$('#toggleTranscript').textContent=$('#transcript').classList.contains('hidden')?'👁 Show transcript':'🙈 Hide transcript'};
 $('#randomTopic').onclick=()=>{let choices=SPEAK_TOPICS.filter(t=>t.id!==state.topic);state.topic=choices[Math.floor(Math.random()*choices.length)].id;save();renderSpeaking()};
 $('#startRec').onclick=()=>startRecording().catch(()=>alert('Microphone permission is required. If you are opening the file locally, Chrome may require permission for this page.'));$('#stopRec').onclick=()=>{if(mediaRecorder&&mediaRecorder.state!=='inactive')mediaRecorder.stop();$('#startRec').disabled=false;$('#stopRec').disabled=true};$('#downloadRec').onclick=()=>{if(!audioBlob)return;let a=document.createElement('a');a.href=URL.createObjectURL(audioBlob);a.download='Nathalie-Lesson-17-speaking.webm';a.click()};
 $('#writingText').oninput=updateWriting;$('#showWritingModel').onclick=()=>$('#writingModel').classList.toggle('hidden');$('#listenWritingModel').onclick=()=>speak(WRITING_MODEL.replace(/\n/g,' '));
 $('#addToolbox').onclick=()=>{let bad=$('#wrongText').value.trim(),good=$('#betterText').value.trim();if(!bad||!good)return;state.toolbox.push({bad,good});$('#wrongText').value='';$('#betterText').value='';save();renderToolbox()};
 $$('select,textarea').forEach(el=>{if(!['writingText','speakNotes'].includes(el.id))el.addEventListener('change',save)});$$('.cando').forEach(c=>c.addEventListener('change',save));
 $('#copyReport').onclick=async()=>{save();try{await navigator.clipboard.writeText(reportText());$('#copyStatus').textContent='Evaluation copied to clipboard.'}catch(e){$('#copyStatus').textContent='Copy was blocked by the browser. Use Download evaluation instead.'}};
 $('#downloadReport').onclick=()=>{save();const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([reportText()],{type:'text/plain;charset=utf-8'}));a.download='Nathalie-Lesson-17-Evaluation-Qualiopi.txt';a.click()};$('#printLesson').onclick=()=>window.print();
}
function renderToolbox(){
 $('#toolboxList').innerHTML=(state.toolbox||[]).map((x,i)=>`<div class="tool-item"><div><small>My sentence</small>❌ ${escapeHTML(x.bad)}<small>Better English</small>✅ ${escapeHTML(x.good)}</div><button data-deltool="${i}" class="danger-soft">Delete</button></div>`).join('');
 $$('[data-deltool]').forEach(b=>b.onclick=()=>{state.toolbox.splice(+b.dataset.deltool,1);save();renderToolbox()});
}
function init(){
 load();
 $('#transcript').textContent=LISTENING_TEXT;$('#writingModel').innerHTML=WRITING_MODEL.replace(/\n/g,'<br>');$('#writingText').value=state.writing||'';
 renderQuiz('warmupQuiz',WARMUP,'w','warmupScore');renderVocab();renderQuiz('vocabQuiz',VOCAB_QUIZ,'v','vocabScore');renderGrammar('present');renderQuiz('grammarQuiz',GRAMMAR_QUIZ,'g','grammarScore');renderFill();renderQuiz('questionQuiz',QUESTIONS,'q','questionScore');renderQuiz('listeningQuiz',LISTENING_Q,'l','listeningScore');renderSpeaking();renderToolbox();restoreManual();bind();toggleFrench(state.french);updateWriting();updateScores();
}
document.addEventListener('DOMContentLoaded',init);
