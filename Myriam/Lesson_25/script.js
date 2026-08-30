const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const state={scores:{modals:0,social:0,tense:0,work:0,ai:0,compare:0,place:0},answered:{},manual:{}};
const vocab={
 society:[
  {w:'age limit',fr:'limite d’âge',d:'a minimum or maximum age allowed for something',e:'Some people support an age limit for social media.'},
  {w:'to protect',fr:'protéger',d:'to keep someone safe from harm',e:'The law is designed to protect children.'},
  {w:'privacy',fr:'vie privée / confidentialité',d:'the right to keep personal information private',e:'Age checks can raise questions about privacy.'},
  {w:'harmful',fr:'nuisible',d:'likely to cause damage or problems',e:'Parents worry about harmful online content.'},
  {w:'freedom of expression',fr:'liberté d’expression',d:'the right to express ideas and opinions',e:'The judges considered freedom of expression.'},
  {w:'to restrict',fr:'restreindre / limiter',d:'to limit what someone can do',e:'A rule may restrict access to a platform.'}
 ],
 work:[
  {w:'to switch off',fr:'décrocher / déconnecter',d:'to stop thinking about work and relax',e:'It can be difficult to switch off after a busy day.'},
  {w:'boundary',fr:'limite',d:'a line that separates two areas or situations',e:'Remote work can blur the boundary between work and home.'},
  {w:'availability',fr:'disponibilité',d:'the state of being ready or able to respond',e:'Flexibility should not mean permanent availability.'},
  {w:'workload',fr:'charge de travail',d:'the amount of work a person has to do',e:'A heavy workload can increase stress.'},
  {w:'right to rest',fr:'droit au repos',d:'protection of personal time away from work',e:'Some countries protect a worker’s right to rest.'},
  {w:'expectation',fr:'attente',d:'a belief about what someone should do',e:'Managers need to make expectations clear.'}
 ],
 digital:[
  {w:'digital inclusion',fr:'inclusion numérique',d:'making sure everyone can use digital services and tools',e:'Training can improve digital inclusion.'},
  {w:'confidence',fr:'confiance / assurance',d:'the feeling that you can do something successfully',e:'Practice can build digital confidence.'},
  {w:'caution',fr:'prudence',d:'care to avoid danger or mistakes',e:'Good digital skills require confidence and caution.'},
  {w:'to adopt',fr:'adopter',d:'to start using a new idea or technology',e:'People adopt new tools at different speeds.'},
  {w:'reliable',fr:'fiable',d:'able to be trusted as accurate or dependable',e:'Important information should come from a reliable source.'},
  {w:'sensitive information',fr:'informations sensibles',d:'private information that needs extra protection',e:'Do not share sensitive information without understanding the risk.'}
 ],
 opinion:[
  {w:'In my view…',fr:'À mon avis…',d:'a clear way to introduce your opinion',e:'In my view, the rule should be more flexible.'},
  {w:'The main reason is…',fr:'La raison principale est…',d:'a phrase that introduces your strongest reason',e:'The main reason is that people need time to rest.'},
  {w:'However,…',fr:'Cependant…',d:'introduces a contrasting idea',e:'The idea is useful. However, it may be difficult to enforce.'},
  {w:'On the other hand,…',fr:'D’un autre côté…',d:'introduces the other side of an argument',e:'Cities are convenient. On the other hand, they can be noisy.'},
  {w:'Overall,…',fr:'Globalement…',d:'introduces your final balanced conclusion',e:'Overall, I think the advantages are greater.'},
  {w:'It depends on…',fr:'Cela dépend de…',d:'shows that there is not one simple answer',e:'It depends on a person’s priorities.'}
 ]
};

const quizzes={
 modals:[
  {q:'Parents ___ talk to children about online safety.',a:'should',o:['should','might','mustn’t']},
  {q:'A platform ___ remove illegal content; it is not optional.',a:'must',o:['could','must','might']},
  {q:'A strict ban ___ create privacy problems.',a:'might',o:['has to','shouldn’t','might']},
  {q:'Schools ___ offer workshops as one possible solution.',a:'could',o:['could','must','has to']},
  {q:'You ___ share sensitive passwords with an AI service.',a:'shouldn’t',o:['shouldn’t','could','have to']}
 ],
 social:[
  {q:'What did French lawmakers approve in 2026?',a:'A plan to stop under-15s using social media',o:['A plan to stop under-15s using social media','A ban on all smartphones','A new school exam']},
  {q:'Why did supporters want stronger rules?',a:'They were worried about harmful design and content',o:['They wanted more advertising','They were worried about harmful design and content','They wanted teenagers to spend more money online']},
  {q:'Why did the Constitutional Council block the measure?',a:'It could restrict freedom and privacy too much',o:['It could restrict freedom and privacy too much','It was too expensive for families','It only applied to adults']},
  {q:'What alternative do some critics prefer?',a:'Regulate harmful platform features',o:['Remove the internet from schools','Regulate harmful platform features','Let platforms make all the rules']},
  {q:'What is the central question of the text?',a:'How to protect children without removing too much freedom',o:['How to make social media more profitable','How to protect children without removing too much freedom','How to make teenagers use phones more']}
 ],
 tense:[
  {q:'Remote work ___ working habits in recent years.',a:'has changed',o:['changed in 2010','has changed','did change yesterday']},
  {q:'France ___ its first right-to-disconnect rules years ago.',a:'introduced',o:['has introduced yesterday','introduced','has introducing']},
  {q:'I ___ work emails after 8 p.m. since January.',a:'haven’t answered',o:['didn’t answer since January','haven’t answered','haven’t answer']},
  {q:'___ you ever ___ an AI tool for language learning?',a:'Have / used',o:['Did / used','Have / used','Have / use']},
  {q:'She ___ the app for the first time last week.',a:'tried',o:['has tried last week','tried','has try']},
  {q:'Technology ___ much faster recently.',a:'has developed',o:['developed tomorrow','has developed','has develop']}
 ],
 work:[
  {q:'What problem does the text describe?',a:'Work often enters personal time',o:['People have too many holidays','Work often enters personal time','Remote work has disappeared']},
  {q:'Why can remote workers be contacted more often?',a:'The boundary between work and home is less clear',o:['They have no internet','The boundary between work and home is less clear','They always work in offices']},
  {q:'What is one benefit of flexible work?',a:'It can make family organisation easier',o:['It can make family organisation easier','It removes all stress','It guarantees shorter working days']},
  {q:'Why are laws not always enough?',a:'Workplace culture may still reward late replies',o:['The laws ban email completely','Workplace culture may still reward late replies','Managers never use phones']},
  {q:'What solution does the writer suggest?',a:'Clear rules plus healthier habits',o:['No more technology','Clear rules plus healthier habits','Longer working hours']}
 ],
 ai:[
  {q:'What does the text say about AI use by age?',a:'Younger adults use it more than older adults',o:['All age groups use it equally','Younger adults use it more than older adults','Only people over 55 use it']},
  {q:'What can influence whether someone tries AI?',a:'Confidence, training, trust and usefulness',o:['Only the price of a phone','Confidence, training, trust and usefulness','The weather']},
  {q:'What is one possible advantage for a learner?',a:'You can ask the same question more than once',o:['AI never makes mistakes','You can ask the same question more than once','You do not need to think']},
  {q:'What does “caution” mean in this text?',a:'Being careful about risks and mistakes',o:['Being very fast','Being careful about risks and mistakes','Being completely against technology']},
  {q:'What is the main message?',a:'Digital inclusion requires access plus skills and confidence',o:['Everyone should use AI every day','Digital inclusion requires access plus skills and confidence','Older people should avoid online services']}
 ],
 place:[
  {q:'What advantage can rural areas offer?',a:'More space and easier access to nature',o:['More space and easier access to nature','More underground trains','More crowded streets']},
  {q:'Why might a car be essential?',a:'Services and transport may be farther away',o:['Services and transport may be farther away','Cities do not allow cars','Rural houses have no doors']},
  {q:'What city advantage does the text mention?',a:'Services and activities are usually easier to reach',o:['Services and activities are usually easier to reach','Housing is always larger','There is never traffic']},
  {q:'What does the text say about quiet?',a:'It is important, but convenience matters too',o:['It is the only important priority','It is important, but convenience matters too','It is impossible outside cities']},
  {q:'What determines the best place to live?',a:'A person’s priorities',o:['A person’s priorities','Only house prices','Only the weather']}
 ],
 connectors:[
  {q:'Cities are convenient. ___, they can be noisy and expensive.',a:'However',o:['For example','However','Therefore']},
  {q:'Some people work late ___ they receive messages outside normal hours.',a:'because',o:['because','whereas','overall']},
  {q:'AI can save time. ___, it can help explain difficult information.',a:'For example',o:['Although','For example','Whereas']},
  {q:'Rural life may be quieter, ___ city life can offer easier access to services.',a:'whereas',o:['therefore','whereas','because']},
  {q:'The rule may protect children. ___, I think it needs clear privacy safeguards.',a:'Therefore',o:['Therefore','For example','Because']}
 ]
};
const fills=[
 {q:'A village can be ___ (quiet) than a city.',a:['quieter']},
 {q:'Public transport is often ___ (convenient) in a big city.',a:['more convenient']},
 {q:'A medium-sized town can be ___ (stressful) than a capital city.',a:['less stressful']},
 {q:'For some people, access to nature is ___ (good) than nightlife.',a:['better']},
 {q:'A rural bus service may be ___ (bad) than an urban one.',a:['worse']}
];
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function speak(text,lang){if(!('speechSynthesis'in window))return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.lang=lang||$('#voiceAccent').value;u.rate=.92; const voices=speechSynthesis.getVoices(); const match=voices.find(v=>v.lang===u.lang)||voices.find(v=>v.lang.startsWith(u.lang.slice(0,2)));if(match)u.voice=match;speechSynthesis.speak(u)}
function renderVocab(cat){const grid=$('#vocabGrid');grid.innerHTML='';vocab[cat].forEach(x=>{const c=document.createElement('article');c.className='vocab-card';c.innerHTML=`<div class="vtop"><div><h3>${x.w}</h3><div class="fr">${x.fr}</div></div><button class="listen-word" type="button">▶ Listen</button></div><div class="vocab-detail"><p>${x.d}</p><p><em>“${x.e}”</em></p></div>`; c.addEventListener('click',e=>{if(e.target.closest('.listen-word'))return;c.classList.toggle('open')});$('.listen-word',c).addEventListener('click',e=>{e.stopPropagation();speak(`${x.w}. ${x.e}`)});grid.append(c)})}
function renderQuiz(id,items,scoreKey,scoreEl){const box=$(`#${id}Quiz`); if(!box)return; box.innerHTML='';items.forEach((item,i)=>{const q=document.createElement('div');q.className='question';q.innerHTML=`<p>${i+1}. ${item.q}</p><div class="options"></div><div class="feedback"></div>`;const opts=$('.options',q);shuffle(item.o).forEach(opt=>{const b=document.createElement('button');b.className='option';b.type='button';b.textContent=opt;b.addEventListener('click',()=>{const key=`${id}-${i}`;if(state.answered[key])return;state.answered[key]=opt;$$('.option',q).forEach(x=>x.disabled=true);const ok=opt===item.a;b.classList.add(ok?'correct':'wrong');if(!ok){[...opts.children].find(x=>x.textContent===item.a)?.classList.add('correct')}const fb=$('.feedback',q);fb.textContent=ok?'Correct ✓':`Not quite. Correct answer: ${item.a}`;fb.className=`feedback ${ok?'good':'bad'}`;if(ok && Object.prototype.hasOwnProperty.call(state.scores,scoreKey))state.scores[scoreKey]++;updateScores();save();});opts.append(b)});box.append(q)})}
function renderFills(){const box=$('#compareQuiz');fills.forEach((item,i)=>{const row=document.createElement('div');row.className='fill-row';row.innerHTML=`<label>${i+1}. ${item.q}</label><input class="fill-input" aria-label="Comparison answer ${i+1}" placeholder="Type your answer…"><span class="feedback"></span>`;const input=$('input',row),fb=$('.feedback',row);let timer;const check=()=>{const key=`fill-${i}`;if(state.answered[key])return;const val=input.value.trim().toLowerCase().replace(/\s+/g,' ');if(!val)return;const ok=item.a.includes(val);state.answered[key]=val;input.classList.add(ok?'correct':'wrong');fb.textContent=ok?'Correct ✓':`Not quite — answer: ${item.a[0]}`;fb.className=`feedback ${ok?'good':'bad'}`;if(ok)state.scores.compare++;input.disabled=true;updateScores();save()};input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(check,950)});input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();clearTimeout(timer);check()}});input.addEventListener('blur',()=>{clearTimeout(timer);check()});box.append(row)})}
function rehydrateAnswered(){
  Object.entries(state.answered||{}).forEach(([key,val])=>{
    if(key.startsWith('fill-')) return;
    const cut=key.lastIndexOf('-'); if(cut<0)return;
    const id=key.slice(0,cut), idx=Number(key.slice(cut+1));
    const box=$(`#${id}Quiz`); if(!box||!Number.isInteger(idx))return;
    const q=$$('.question',box)[idx]; if(!q)return;
    const items=quizzes[id]; if(!items||!items[idx])return;
    const correct=items[idx].a;
    $$('.option',q).forEach(b=>{b.disabled=true;if(b.textContent===correct)b.classList.add('correct');if(b.textContent===val && val!==correct)b.classList.add('wrong')});
    const fb=$('.feedback',q); if(fb){const ok=val===correct;fb.textContent=ok?'Correct ✓':`Not quite. Correct answer: ${correct}`;fb.className=`feedback ${ok?'good':'bad'}`}
  });
  fills.forEach((item,i)=>{const key=`fill-${i}`;if(!(key in (state.answered||{})))return;const row=$$('.fill-row')[i];if(!row)return;const input=$('input',row),fb=$('.feedback',row);const val=String(state.answered[key]||'');const ok=item.a.includes(val);input.value=val;input.disabled=true;input.classList.add(ok?'correct':'wrong');fb.textContent=ok?'Correct ✓':`Answer: ${item.a[0]}`;fb.className=`feedback ${ok?'good':'bad'}`});
}
function updateScores(){const map={modals:['modalsScore','reportModals',5],social:['socialScore','reportSocial',5],tense:['tenseScore','reportTense',6],work:['workScore','reportWork',5],ai:['aiScore','reportAI',5],compare:['compareScore','reportCompare',5],place:['placeScore','reportPlace',5]};Object.entries(map).forEach(([k,[a,b,total]])=>{if($(`#${a}`))$(`#${a}`).textContent=state.scores[k];if($(`#${b}`))$(`#${b}`).textContent=`${state.scores[k]}/${total}`})}
function reportText(){const wc=$('#wordCount').textContent;return `READ · THINK · DISCUSS — LESSON PROGRESS\nDate: ${new Date().toLocaleDateString('en-GB')}\n\nAUTOMATIC SCORES\nModals: ${state.scores.modals}/5\nReading — social media: ${state.scores.social}/5\nPresent perfect vs past simple: ${state.scores.tense}/6\nReading — work-life balance: ${state.scores.work}/5\nReading — AI & digital inclusion: ${state.scores.ai}/5\nComparatives: ${state.scores.compare}/5\nReading — quality of life: ${state.scores.place}/5\n\nSPEAKING: ${$('#speakingStatus').value} — ${$('#speakingManual').value||'—'}/10\nWRITING: ${$('#writingStatus').value} — ${$('#writingManual').value||'—'}/10\nFinal writing word count: ${wc}\n\nCOMMENTS / NEXT FOCUS\n${$('#teacherComments').value||'—'}\n`}
function save(){state.manual.reflection=$('#reflectionNotes')?.value||'';state.manual.finalWriting=$('#finalWriting')?.value||'';state.manual.speakingStatus=$('#speakingStatus')?.value||'Not started';state.manual.writingStatus=$('#writingStatus')?.value||'Not started';state.manual.speakingManual=$('#speakingManual')?.value||'';state.manual.writingManual=$('#writingManual')?.value||'';state.manual.teacherComments=$('#teacherComments')?.value||'';state.manual.manualAnswers=$$('.manual-answer').map(x=>({label:x.dataset.label||'',value:x.value}));localStorage.setItem('myriamReadingLab',JSON.stringify(state))}
function load(){try{const s=JSON.parse(localStorage.getItem('myriamReadingLab'));if(!s)return;Object.assign(state.scores,s.scores||{});state.answered=s.answered||{};state.manual=s.manual||{};$('#reflectionNotes').value=state.manual.reflection||'';$('#finalWriting').value=state.manual.finalWriting||'';$('#speakingStatus').value=state.manual.speakingStatus||'Not started';$('#writingStatus').value=state.manual.writingStatus||'Not started';$('#speakingManual').value=state.manual.speakingManual||'';$('#writingManual').value=state.manual.writingManual||'';$('#teacherComments').value=state.manual.teacherComments||'';const vals=state.manual.manualAnswers||[];$$('.manual-answer').forEach(x=>{const found=vals.find(v=>v.label===(x.dataset.label||''));if(found)x.value=found.value||''});updateWritingStats();updateScores();rehydrateAnswered()}catch(e){console.warn(e)}}
function updateWritingStats(){const t=$('#finalWriting').value.trim();const words=t? t.split(/\s+/).length:0;$('#wordCount').textContent=words;const list=['however','therefore','because','although','overall','for example','on the other hand','whereas','so','in my view'];let n=0;const low=t.toLowerCase();list.forEach(x=>{if(low.includes(x))n++});$('#connectorCount').textContent=n}

renderVocab('society');
$$('.chip').forEach(b=>b.addEventListener('click',()=>{$$('.chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderVocab(b.dataset.vcat)}));
renderQuiz('modals',quizzes.modals,'modals');renderQuiz('social',quizzes.social,'social');renderQuiz('tense',quizzes.tense,'tense');renderQuiz('work',quizzes.work,'work');renderQuiz('ai',quizzes.ai,'ai');renderQuiz('place',quizzes.place,'place');renderQuiz('connector',quizzes.connectors,'noop');renderFills();
$$('[data-speak-target]').forEach(b=>b.addEventListener('click',()=>{const el=$(`#${b.dataset.speakTarget}`);speak(el.innerText.replace(/Adapted learning text[\s\S]*/,'').trim())}));
$$('.stretchToggle').forEach(t=>t.addEventListener('change',()=>{const sec=t.closest('.reading');$('.stretch',sec)?.classList.toggle('hidden',!t.checked)}));
$$('.reveal-model').forEach(b=>b.addEventListener('click',()=>{$(`#${b.dataset.model}`).classList.toggle('hidden');b.textContent=$(`#${b.dataset.model}`).classList.contains('hidden')?'Show a model':'Hide model'}));
$$('.position-btn').forEach(b=>b.addEventListener('click',()=>{const wrap=b.parentElement;$$('.position-btn',wrap).forEach(x=>x.classList.remove('selected'));b.classList.add('selected')}));
const sentence=['I','think','employees','should','be','able','to','disconnect','after','work','.'];let built=[];const bank=$('#wordBank'),ans=$('#wordAnswer');function renderWords(){bank.innerHTML='';ans.innerHTML='';shuffle(sentence).forEach((w,i)=>{const b=document.createElement('button');b.className='word-token';b.type='button';b.textContent=w;b.dataset.token=i;b.addEventListener('click',()=>{built.push(w);b.remove();const x=document.createElement('button');x.className='word-token';x.type='button';x.textContent=w;ans.append(x);if(built.length===sentence.length){const ok=built.join(' ')===sentence.join(' ');$('#wordFeedback').textContent=ok?'Excellent — correct word order ✓':'Almost. Reset and try again.';$('#wordFeedback').className=`feedback ${ok?'good':'bad'}`}});bank.append(b)})}renderWords();$('#wordReset').addEventListener('click',()=>{built=[];$('#wordFeedback').textContent='';renderWords()});
$('#finalWriting').addEventListener('input',()=>{updateWritingStats();save()});$$('textarea, select, .manual-score').forEach(el=>el.addEventListener('change',save));$('#saveNow').addEventListener('click',()=>{save();const old=$('#saveNow').textContent;$('#saveNow').textContent='Saved ✓';setTimeout(()=>$('#saveNow').textContent=old,1200)});
$('#copyReport').addEventListener('click',async()=>{try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(reportText())}else{const ta=document.createElement('textarea');ta.value=reportText();document.body.append(ta);ta.select();document.execCommand('copy');ta.remove()}$('#reportFeedback').textContent='Report copied ✓';$('#reportFeedback').className='feedback good'}catch(e){$('#reportFeedback').textContent='Copy was blocked by the browser. Use Download instead.';$('#reportFeedback').className='feedback bad'}});
$('#downloadReport').addEventListener('click',()=>{const blob=new Blob([reportText()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='reading-discussion-progress-report.txt';a.click();URL.revokeObjectURL(url);$('#reportFeedback').textContent='Report downloaded ✓';$('#reportFeedback').className='feedback good'});
$('#resetAll').addEventListener('click',()=>{if(confirm('Reset all saved progress for this lesson?')){localStorage.removeItem('myriamReadingLab');location.reload()}});
load();
