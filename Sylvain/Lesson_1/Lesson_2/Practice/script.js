'use strict';
const $=(s,el=document)=>el.querySelector(s); const $$=(s,el=document)=>[...el.querySelectorAll(s)];
const storageKey='sylvain_lesson4_grammar_vocab_v1';
const activityData={
  core:[
    {q:'Choose the correct sentence.',a:['My wife work with me.','My wife works with me.','My wife working with me.'],correct:1,note:'My wife = she, so use works in the present simple.'},
    {q:'Choose the correct question.',a:['Do you work with several airlines?','Are you work with several airlines?','Does you work with several airlines?'],correct:0,note:'Use Do + you + base verb: Do you work…?'},
    {q:'Choose the correct sentence.',a:['I am have two daughters.','I have two daughters.','I has two daughters.'],correct:1,note:'Use I have — not I am have and not I has.'},
    {q:'Choose the correct sentence.',a:['Airline catering are a niche market.','Airline catering is a niche market.','Airline catering am a niche market.'],correct:1,note:'Airline catering is one activity, so use is.'},
    {q:'Choose the correct negative.',a:['The logistics company does not handles the food.','The logistics company do not handle the food.','The logistics company does not handle the food.'],correct:2,note:'With does not, use the base verb: handle.'},
    {q:'Choose the correct family sentence.',a:['My daughters are at school.','My daughters is at school.','My daughters am at school.'],correct:0,note:'My daughters = they, so use are.'}
  ],
  present:[
    {q:'At the moment, we ___ for a home in Lisbon.',a:['look','are looking','looking'],correct:1,note:'At the moment signals a current activity: are looking.'},
    {q:'We usually ___ meals for several flights every week.',a:['are preparing','prepare','prepares'],correct:1,note:'Usually and every week describe a routine: prepare.'},
    {q:'I ___ my restaurant at the moment.',a:['am selling','sell','sells'],correct:0,note:'This is a current project: I am selling.'},
    {q:'My wife ___ with me in the business.',a:['is working','works','work'],correct:1,note:'This is her regular role, so use the present simple: works.'},
    {q:'Today, the team ___ a larger order than usual.',a:['prepares','are preparing','prepare'],correct:1,note:'Today describes a current temporary situation: are preparing.'}
  ],
  future:[
    {q:'We ___ to Lisbon in August.',a:['are going to move','going to move','are going move'],correct:0,note:'Use are going to + base verb: move.'},
    {q:'My eldest daughter ___ a veterinarian.',a:['is going to become','is going become','going to become'],correct:0,note:'Use is going to + base verb: become.'},
    {q:'___ you going to work directly with airlines?',a:['Do','Are','Does'],correct:1,note:'Question form: Are + subject + going to + base verb? '},
    {q:'We are moving to Lisbon ___ my wife is Portuguese and we want a new family life.',a:['but','because','so'],correct:1,note:'Because introduces the reason.'},
    {q:'We still need to find a home, ___ we are waiting for the funds.',a:['because','however','so'],correct:2,note:'So introduces the result.'}
  ],
  details:[
    {q:'We are moving ___ August.',a:['at','in','on'],correct:1,note:'Use in with months: in August.'},
    {q:'The delivery arrives ___ 6.30.',a:['at','in','on'],correct:0,note:'Use at with a precise time: at 6.30.'},
    {q:'We work with ___ airline in Switzerland.',a:['a','an','the'],correct:1,note:'Airline begins with a vowel sound, so use an.'},
    {q:'The meals are delivered ___ the airport before boarding.',a:['to','in','on'],correct:0,note:'Deliver something to a place or person.'},
    {q:'We receive ___ orders every week.',a:['much','many','a little'],correct:1,note:'Orders are countable, so use many.'},
    {q:'How  ___ food is in the kitchen today?',a:['many','much','a few'],correct:1,note:'Food is uncountable, so use much.'}
  ],
  vocabulary:[
    {q:'Choose the natural combination.',a:['make a catering business','run a catering business','do a catering business'],correct:1,note:'We run a business.'},
    {q:'Choose the natural combination.',a:['handle the final delivery','drive the final delivery','take the final delivery'],correct:0,note:'Handle means manage or take responsibility for.'},
    {q:'Choose the natural combination.',a:['make out a loan','take out a loan','put out a loan'],correct:1,note:'We take out a loan.'},
    {q:'Choose the natural combination.',a:['move abroad','go abroad house','travel a house'],correct:0,note:'Move abroad = start living in another country.'},
    {q:'Choose the natural combination.',a:['special food requirements','special dietary requirements','special eating requirements'],correct:1,note:'Dietary requirements is the professional expression.'},
    {q:'Choose the best word.',a:['Airline catering is a specialised niche market.','Airline catering is a small job.','Airline catering is a little market.'],correct:0,note:'Niche market = a specialised market for a specific product or service.'}
  ],
  vtest:[
    {q:'My wife ___ Portuguese, so we are going to move to Lisbon.',a:['is','are','has'],correct:0,note:'My wife = she, so use is.'},
    {q:'At the moment, a third-party logistics company ___ the final delivery.',a:['handle','handles','is handle'],correct:1,note:'A regular fact: it handles.'},
    {q:'We are going to work directly ___ airline clients.',a:['at','with','on'],correct:1,note:'Work directly with clients.'},
    {q:'Which sentence is correct?',a:['We are not going to stay in Savoie.','We do not going to stay in Savoie.','We not are going to stay in Savoie.'],correct:0,note:'Negative future: subject + are not + going to + base verb.'},
    {q:'The family is looking for ___ home in Lisbon.',a:['an','a','some'],correct:1,note:'Home starts with a consonant sound, so use a.'},
    {q:'We prepare ___ for several airlines every week.',a:['a meals','meals','much meals'],correct:1,note:'Use meals in the plural for a general routine.'},
    {q:'My daughters ___ currently at school.',a:['are','is','be'],correct:0,note:'Daughters = they, so use are.'},
    {q:'___ your eldest daughter want to become a veterinarian?',a:['Is','Does','Do'],correct:1,note:'With she / your daughter, use Does + base verb.'}
  ]
};
const state={core:{},present:{},future:{},details:{},vocabulary:{},vtest:{},feeling:''};
function shuffle(arr){return arr.map(v=>({v,r:Math.random()})).sort((a,b)=>a.r-b.r).map(x=>x.v)}
function toggleHint(btn){const hint=$('#'+btn.dataset.hintTarget);hint.classList.toggle('open');btn.textContent=hint.classList.contains('open')?'Hide hint':'Hint'}
function speak(text){if(!('speechSynthesis' in window)){alert('Speech is not available in this browser.');return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-GB';u.rate=.88;const voices=speechSynthesis.getVoices();const voice=voices.find(v=>/^en-GB/i.test(v.lang))||voices.find(v=>/^en-US/i.test(v.lang));if(voice)u.voice=voice;speechSynthesis.speak(u)}
function buildQuestions(type,target,status){const holder=$('#'+target);holder.innerHTML='';activityData[type].forEach((item,index)=>{const card=document.createElement('article');card.className='question-card';card.innerHTML=`<p>${index+1}. ${item.q}</p><div class="options"></div><p class="answer-note" hidden></p>`;const opts=$('.options',card);const choices=shuffle(item.a.map((text,i)=>({text,correct:i===item.correct})));choices.forEach((choice)=>{const b=document.createElement('button');b.type='button';b.className='option';b.textContent=choice.text;b.dataset.correct=String(choice.correct);b.addEventListener('click',()=>answer(type,index,choice.correct,card,status,b));opts.appendChild(b)});holder.appendChild(card)})}
function answer(type,index,correct,card,status,selectedBtn){if(Object.hasOwn(state[type],index))return;state[type][index]=correct;$$('.option',card).forEach(b=>{b.disabled=true;if(b.dataset.correct==='true')b.classList.add('correct')});if(!correct && selectedBtn)selectedBtn.classList.add('incorrect');const note=$('.answer-note',card);note.hidden=false;note.textContent=(correct?'✓ Correct. ':'✦ Remember: ')+activityData[type][index].note;updateScore(type,status);saveProgress(false)}
function updateScore(type,statusId){const total=activityData[type].length;const correct=Object.values(state[type]).filter(Boolean).length;const answered=Object.keys(state[type]).length;$('#'+statusId).textContent=answered?`Progress: ${correct}/${total} correct.`:''}
function setGrammarTab(tab){$$('.grammar-tab').forEach(b=>{const on=b.dataset.tab===tab;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on))});$$('.grammar-panel').forEach(p=>{const on=p.dataset.panel===tab;p.classList.toggle('active',on);p.hidden=!on})}
function setVocabTab(tab){$$('.vocab-tab').forEach(b=>b.classList.toggle('active',b.dataset.vocab===tab));$$('.vocab-panel').forEach(p=>{const on=p.dataset.vocabPanel===tab;p.classList.toggle('active',on);p.hidden=!on})}
function capI(t){return t.replace(/\bi\b/g,'I').replace(/\s+/g,' ').trim()}
function subjectVerb(subject,verb){
  const forms={
    'I':{'live in Savoie':'live in Savoie','am looking for a home in Lisbon':'am looking for a home in Lisbon','am going to move to Lisbon in August':'am going to move to Lisbon in August','enjoy spending quality time together':'enjoy spending quality time together'},
    'My wife':{'live in Savoie':'lives in Savoie','am looking for a home in Lisbon':'is looking for a home in Lisbon','am going to move to Lisbon in August':'is going to move to Lisbon in August','enjoy spending quality time together':'enjoys spending quality time together'},
    'My daughters':{'live in Savoie':'live in Savoie','am looking for a home in Lisbon':'are looking for a home in Lisbon','am going to move to Lisbon in August':'are going to move to Lisbon in August','enjoy spending quality time together':'enjoy spending quality time together'},
    'My family and I':{'live in Savoie':'live in Savoie','am looking for a home in Lisbon':'are looking for a home in Lisbon','am going to move to Lisbon in August':'are going to move to Lisbon in August','enjoy spending quality time together':'enjoy spending quality time together'}
  };
  return `${subject} ${(forms[subject]&&forms[subject][verb])||verb}`
}
function workSentence(subject,verb){
  const forms={
    'I':{'run a catering business with my wife':'run a catering business with my wife','prepare meals for several airlines':'prepare meals for several airlines','am going to work directly with airline clients':'am going to work directly with airline clients','handles the final delivery':'handle the final delivery'},
    'We':{'run a catering business with my wife':'run a catering business with my wife','prepare meals for several airlines':'prepare meals for several airlines','am going to work directly with airline clients':'are going to work directly with airline clients','handles the final delivery':'handle the final delivery'},
    'My company':{'run a catering business with my wife':'runs a catering business with my wife','prepare meals for several airlines':'prepares meals for several airlines','am going to work directly with airline clients':'is going to work directly with airline clients','handles the final delivery':'handles the final delivery'},
    'The logistics company':{'run a catering business with my wife':'runs a catering business with my wife','prepare meals for several airlines':'prepares meals for several airlines','am going to work directly with airline clients':'is going to work directly with airline clients','handles the final delivery':'handles the final delivery'}
  };
  return `${subject} ${(forms[subject]&&forms[subject][verb])||verb}`
}
function buildSentences(){const ps=$('#personalSubject').value,pv=$('#personalVerb').value,ws=$('#workSubject').value,wv=$('#workVerb').value,detail=$('#builderDetail').value,type=$('#builderType').value;const first=capI(subjectVerb(ps,pv));const second=capI(workSentence(ws,wv));let text='';if(type==='two'){text=`${first}.\n\n${second} ${detail}.`}else{text=`${first}. ${second} ${detail}. This is an important next step for my family and my business.`}$('#builderOutput').textContent=text;saveProgress(false)}
function copySentences(){const text=$('#builderOutput').innerText.trim();navigator.clipboard?.writeText(text).then(()=>{const b=$('#copySentences');const old=b.textContent;b.textContent='Copied ✓';setTimeout(()=>b.textContent=old,1600)}).catch(()=>alert('Select the text and copy it manually.'))}
function collectState(){return{state,french:document.body.classList.contains('show-french'),builder:{ps:$('#personalSubject').value,pv:$('#personalVerb').value,ws:$('#workSubject').value,wv:$('#workVerb').value,d:$('#builderDetail').value,t:$('#builderType').value,o:$('#builderOutput').innerText},savedAt:new Date().toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short'})}}
function saveProgress(show=true){localStorage.setItem(storageKey,JSON.stringify(collectState()));if(show){const el=$('#saveStatus');el.textContent='Saved on this device.';setTimeout(()=>el.textContent='',2400)}}
function restoreProgress(){try{const saved=JSON.parse(localStorage.getItem(storageKey));if(!saved)return;if(saved.french){document.body.classList.add('show-french');$('#frenchToggle').setAttribute('aria-pressed','true');$('#frenchToggle').textContent='FR help ✓'}Object.entries(saved.state||{}).forEach(([k,v])=>{if(state[k])Object.assign(state[k],v)});if(saved.builder){$('#personalSubject').value=saved.builder.ps||$('#personalSubject').value;$('#personalVerb').value=saved.builder.pv||$('#personalVerb').value;$('#workSubject').value=saved.builder.ws||$('#workSubject').value;$('#workVerb').value=saved.builder.wv||$('#workVerb').value;$('#builderDetail').value=saved.builder.d||$('#builderDetail').value;$('#builderType').value=saved.builder.t||$('#builderType').value;if(saved.builder.o)$('#builderOutput').textContent=saved.builder.o;}if(saved.state?.feeling){state.feeling=saved.state.feeling;const b=$$('[data-feeling]').find(x=>x.dataset.feeling===state.feeling);if(b){b.classList.add('active');$('#feelingFeedback').textContent='Your reflection has been saved.'}}}catch(e){console.warn('Could not restore saved progress',e)}}
function reapplyAnswers(type,target,status){const cards=$$('#'+target+' .question-card');Object.entries(state[type]).forEach(([idx,correct])=>{const card=cards[Number(idx)];if(!card)return;$$('.option',card).forEach(b=>{b.disabled=true;if(b.dataset.correct==='true')b.classList.add('correct')});const note=$('.answer-note',card);note.hidden=false;note.textContent=(correct?'✓ Correct. ':'✦ Remember: ')+activityData[type][Number(idx)].note;});updateScore(type,status)}
function downloadNotes(){const lines=['SYLVAIN BAILLY — LESSON 4','Grammar & Vocabulary Consolidation','', 'KEY GRAMMAR','• I am / we are / she is','• I have / she has','• I work / she works','• Do you work? Does she work?','• We are preparing… (now)','• We are going to move… (future plan)','', 'KEY VOCABULARY','• run a catering business','• airline catering: a specialised niche market','• third-party logistics company','• handle the final delivery','• work directly with airline clients','• move abroad / settle in Lisbon','• find a home / take out a loan','• special dietary requirements','', 'MY SENTENCES',''+$('#builderOutput').innerText.trim(),'','MY REFLECTION',state.feeling||''];const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='Sylvain_Lesson_4_Grammar_Vocabulary_Notes.txt';a.click();URL.revokeObjectURL(url)}
function resetLesson(){if(!confirm('Reset all answers and saved progress for this lesson?'))return;localStorage.removeItem(storageKey);location.reload()}
function init(){buildQuestions('core','coreQuestions','coreScore');buildQuestions('present','presentQuestions','presentScore');buildQuestions('future','futureQuestions','futureScore');buildQuestions('details','detailQuestions','detailScore');buildQuestions('vocabulary','vocabQuestions','vocabScore');buildQuestions('vtest','vtestQuestions','vtestScore');restoreProgress();reapplyAnswers('core','coreQuestions','coreScore');reapplyAnswers('present','presentQuestions','presentScore');reapplyAnswers('future','futureQuestions','futureScore');reapplyAnswers('details','detailQuestions','detailScore');reapplyAnswers('vocabulary','vocabQuestions','vocabScore');reapplyAnswers('vtest','vtestQuestions','vtestScore');$$('.hint-button').forEach(b=>b.addEventListener('click',()=>toggleHint(b)));$$('.grammar-tab').forEach(b=>b.addEventListener('click',()=>setGrammarTab(b.dataset.tab)));$$('.vocab-tab').forEach(b=>b.addEventListener('click',()=>setVocabTab(b.dataset.vocab)));$$('.speak-button').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.say)));$('#frenchToggle').addEventListener('click',()=>{const on=document.body.classList.toggle('show-french');$('#frenchToggle').setAttribute('aria-pressed',String(on));$('#frenchToggle').textContent=on?'FR help ✓':'FR help';saveProgress(false)});$('#saveButton').addEventListener('click',()=>saveProgress(true));$('#buildSentences').addEventListener('click',buildSentences);$('#copySentences').addEventListener('click',copySentences);$$('[data-feeling]').forEach(b=>b.addEventListener('click',()=>{state.feeling=b.dataset.feeling;$$('[data-feeling]').forEach(x=>x.classList.toggle('active',x===b));$('#feelingFeedback').textContent='Thank you. We will use this to plan the next step.';saveProgress(false)}));$('#downloadNotes').addEventListener('click',downloadNotes);$('#resetLesson').addEventListener('click',resetLesson);buildSentences()}
document.addEventListener('DOMContentLoaded',init);
