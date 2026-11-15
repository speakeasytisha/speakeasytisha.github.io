'use strict';
const STORAGE_KEY='se_mc_connect_details_v1';
const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const escapeHtml=(s='')=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
const wordCount=txt=>(String(txt||'').trim().match(/\b[\w’'-]+\b/g)||[]).length;
let state={answers:{},tasks:{},notes:'',personalSentence:'',grammarEval:'',speakingEval:'',professionalEval:'',trainerComments:'',clarityRating:'',easyArea:'',proudSentence:'',fr:true,voice:'en-US',speed:'0.90',mode:'coach',font:1,builder:{context:'Family abroad',main:0,detail:0}};
try{state={...state,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch(e){}
const save=()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch(e){}};
const toast=m=>{const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2200)};

const vocab={
 'Family & relationships':[
  ['👤','the person who…','la personne qui…','identify a person by an action or characteristic','The person who lives abroad calls regularly.'],
  ['🏠','the family member who…','le membre de la famille qui…','add a useful detail about a relative','The family member who lives in Boston teaches at a school.'],
  ['🤝','keep in touch','rester en contact','continue communicating despite distance','We keep in touch with family who live abroad.'],
  ['💬','catch up','prendre des nouvelles','talk after not speaking for a while','I like calls where we can catch up properly.'],
  ['❤️','matter to someone','compter pour quelqu’un','be important to a person','Family conversations that matter to you are worth practising.']
 ],
 'Travel & places':[
  ['📍','a place where…','un endroit où…','describe what happens in a place','I like places where you can walk easily.'],
  ['🗺️','an area that…','un quartier / une zone qui…','identify an area by a characteristic','We visited an area that had beautiful scenery.'],
  ['✨','memorable','mémorable','easy to remember because it was special','The trip, which was very memorable, lasted a week.'],
  ['🌿','scenery','paysages','the natural views of an area','I enjoy places that have dramatic scenery.'],
  ['🚶','easy to explore','facile à explorer','simple to discover by walking or moving around','Boston has neighborhoods that are easy to explore.']
 ],
 'Natural detail words':[
  ['➕','especially','surtout / particulièrement','highlight one part','I especially like places where you can walk.'],
  ['🔎','the part that…','la partie qui…','focus on one element of an experience','The part that I remember most was the boat trip.'],
  ['🧠','what I remember most','ce dont je me souviens le plus','introduce a strong memory','What I remember most is the atmosphere.'],
  ['⭐','one of the places that…','l’un des endroits qui…','identify one item in a group','It is one of the places that I would visit again.'],
  ['🔁','which means that…','ce qui signifie que…','add a result or explanation','The city is compact, which means that walking is practical.']
 ],
 'Professional clarity':[
  ['👔','the colleague who…','le/la collègue qui…','identify a person by responsibility','The colleague who handles the account is available.'],
  ['📄','the document that…','le document qui…','identify the correct file or form','Please use the document that explains the procedure.'],
  ['🏢','the room where…','la salle où…','identify a place by activity','The meeting is in the room where we met yesterday.'],
  ['☎️','the caller who…','la personne qui a appelé…','identify an interlocutor','The caller who contacted us this morning needs a reply.'],
  ['✅','Is that the information you need?','Est-ce bien l’information dont vous avez besoin ?','confirm that your reformulation is correct','I can send the form today. Is that the information you need?']
 ]
};

const q=(id,prompt,options,answer,hint,why)=>({id,prompt,options,answer,hint,why});
const groups={
 relative:{label:'Relative words',container:'relativeQuiz',score:'relativeScore',total:'relativeTotal',items:[
  q('r1','Your daughter, ___ lives in Boston, teaches at an international school.',['who','where','which'],'who','Person → who.','Who refers to your daughter, a person.'),
  q('r2','Boston is a city ___ you can walk between many attractions.',['where','who','which'],'where','Place + activity → where.','Where means in/at that place.'),
  q('r3','I enjoy trips ___ include time outdoors.',['that','where','who'],'that','Thing / type of trip → that.','That can identify a thing with essential information.'),
  q('r4','The trip, ___ lasted a week, was memorable.',['which','who','where'],'which','Extra information about a thing → which.','Which adds extra detail about the trip.'),
  q('r5','People ___ travel often usually have good stories.',['who','where','which'],'who','People → who.','Who is used for people.'),
  q('r6','I like cafés ___ you can sit and talk quietly.',['where','that','who'],'where','Place + what happens there → where.','Where is natural because the café is a place.'),
  q('r7','The document ___ explains the next step is attached.',['that','where','who'],'that','Document → thing.','That identifies which document.'),
  q('r8','The colleague ___ called this morning needs a reply.',['who','which','where'],'who','Colleague → person.','Who identifies the person.')
 ]},
 fragment:{label:'Complete sentences',container:'fragmentQuiz',score:'fragmentScore',total:'fragmentTotal',items:[
  q('f1','Which is a complete sentence?',['My daughter, who lives in Boston, teaches at a school.','My daughter who lives in Boston.'],'My daughter, who lives in Boston, teaches at a school.','Remove the who-clause. Do you still have a sentence?','“My daughter teaches…” is a complete main clause.'),
  q('f2','Which is a fragment?',['The place where we stayed was quiet.','The place where we stayed.'],'The place where we stayed.','Look for the main verb after the detail.','“The place where we stayed” is only a noun group.'),
  q('f3','Which is complete?',['The café where we met was near the station.','The café where we met near the station.'],'The café where we met was near the station.','Main clause needs its own verb: café was…','The relative clause is “where we met”; the main verb is “was”.'),
  q('f4','Which is complete?',['The client who needs the form is waiting.','The client who needs the form.'],'The client who needs the form is waiting.','Ask: what is the client doing?','“is waiting” completes the main message.'),
  q('f5','Which is a fragment?',['A city that I would like to visit again.','A city that I would like to visit again is Boston.'],'A city that I would like to visit again.','A noun group can be long and still not be a sentence.','It needs a main verb, e.g. “is Boston”.'),
  q('f6','Which is complete?',['The part that I remember most was the scenery.','The part that I remember most.'],'The part that I remember most was the scenery.','Find the main verb after the relative clause.','“was” completes the main clause.'),
  q('f7','Which is a fragment?',['The colleague who works with that customer.','The colleague who works with that customer is available.'],'The colleague who works with that customer.','Who works… only describes the colleague.','A main verb is still needed.'),
  q('f8','Which is complete?',['The room where the meeting takes place is upstairs.','The room where the meeting takes place.'],'The room where the meeting takes place is upstairs.','Check for a main message after the place detail.','“is upstairs” completes the sentence.')
 ]},
 agreement:{label:'Agreement & possessives',container:'agreementQuiz',score:'agreementScore',total:'agreementTotal',items:[
  q('a1','Your daughter, who ___ in Boston…',['lives','live'],'lives','One person → lives.','The noun before who is singular.'),
  q('a2','Your sons, who ___ in France…',['live','lives'],'live','Plural people → live.','The noun before who is plural.'),
  q('a3','A colleague who ___ with customers…',['works','work'],'works','One colleague → works.','Third-person singular takes -s.'),
  q('a4','Clients who ___ more information…',['need','needs'],'need','Clients = they.','Plural noun → base verb.'),
  q('a5','Iceland is famous for ___ landscapes.',['its','his','their'],'its','Place / thing → its.','Use its for a singular place or thing.'),
  q('a6','My children enjoy ___ visits together.',['their','its','her'],'their','Children = they.','Use their for plural people.'),
  q('a7','The school where your family member ___ is international.',['works','work'],'works','One family member → works.','The subject of the relative clause is singular.'),
  q('a8','The neighborhoods that ___ easy to explore are popular.',['are','is'],'are','Neighborhoods = plural.','Plural subject → are.'),
  q('a9','The document that ___ the procedure is attached.',['explains','explain'],'explains','Document = it.','Third-person singular takes -s.'),
  q('a10','The forms that ___ the details are in the folder.',['contain','contains'],'contain','Forms = they.','Plural subject → base verb.')
 ]},
 vocab:{label:'Vocabulary',container:'vocabQuiz',score:'vocabScore',total:'vocabTotal',items:[
  q('v1','You want to describe a location by what happens there.',['a place where…','a person who…','the part that…'],'a place where…','Place + activity → where.','This structure is ideal for travel and everyday descriptions.'),
  q('v2','You want to identify a person by responsibility.',['the colleague who…','the room where…','the document that…'],'the colleague who…','Person → who.','Useful for professional identification.'),
  q('v3','You want to highlight the strongest memory.',['the part that I remember most…','the person where…','the place who…'],'the part that I remember most…','Use “the part that…” to focus on one element.','It helps you develop a story naturally.'),
  q('v4','You want to confirm a professional reformulation.',['Is that the information you need?','That is information?','You need this, yes?'],'Is that the information you need?','Use a complete neutral confirmation question.','It is clear and professional without being overly formal.'),
  q('v5','You want to say a trip was special and easy to remember.',['memorable','ordinary','available'],'memorable','Think: easy to remember because it mattered.','Memorable is useful for travel stories.'),
  q('v6','You want to say you continue communicating with family abroad.',['keep in touch','keep a contact','stay the touch'],'keep in touch','This is a standard neutral expression.','It is everyday English, not slang.')
 ]},
 surgery:{label:'Sentence surgery',container:'surgeryQuiz',score:'surgeryScore',total:'surgeryTotal',items:[
  q('surg1','Repair: “My daughter who lives in Boston.”',['My daughter, who lives in Boston, teaches at an international school.','My daughter, where lives in Boston.','My daughter who living Boston.'],'My daughter, who lives in Boston, teaches at an international school.','Keep the who-detail, then add a main verb.','The main clause is “My daughter teaches…”.'),
  q('surg2','Repair: “My two sons who lives in France.”',['My two sons, who live in France, visit regularly.','My two sons, who lives in France, visit regularly.','My two sons where live France.'],'My two sons, who live in France, visit regularly.','Two sons → live.','Plural agreement inside the relative clause.'),
  q('surg3','Repair: “Iceland is special with his landscapes.”',['Iceland is special because of its landscapes.','Iceland is special with his landscapes.','Iceland is special by her landscape.'],'Iceland is special because of its landscapes.','Place → its.','Its is the possessive form for a place or thing.'),
  q('surg4','Repair: “The place where we stayed very quiet.”',['The place where we stayed was very quiet.','The place who we stayed was quiet.','The place where stayed very quiet.'],'The place where we stayed was very quiet.','Add the main verb after the detail clause.','“where we stayed” is only the detail.'),
  q('surg5','Repair: “The client which called this morning…”',['The client who called this morning needs a reply.','The client which called this morning needs a reply.','The client where called this morning.'],'The client who called this morning needs a reply.','Person → who.','Who is the standard choice for a person.'),
  q('surg6','Repair: “The document who explains the procedure…”',['The document that explains the procedure is attached.','The document who explains the procedure is attached.','The document where explains the procedure.'],'The document that explains the procedure is attached.','Thing → that/which.','That identifies the document.'),
  q('surg7','Repair: “Boston is a city which you can walk everywhere.”',['Boston is a city where you can walk to many places.','Boston is a city who you can walk everywhere.','Boston is a city where can walk.'],'Boston is a city where you can walk to many places.','Place + action → where.','Where is natural for the location.'),
  q('surg8','Repair: “The colleague who work with the customer is here.”',['The colleague who works with the customer is here.','The colleague who work with the customer is here.','The colleague which works with the customer is here.'],'The colleague who works with the customer is here.','One colleague → works.','Singular subject agreement.')
 ]},
 listening:{label:'Listening',container:'listeningQuiz',score:'listeningScore',total:'listeningTotal',items:[
  q('l1','What kind of neighborhoods does the speaker want to visit?',['Neighborhoods that are easy to explore on foot.','Neighborhoods where nobody walks.','Neighborhoods that are outside the city.'],'Neighborhoods that are easy to explore on foot.','Listen for “that are easy to explore on foot.”','The relative clause describes the preferred neighborhoods.'),
  q('l2','Which place does the speaker also want to visit?',['The school where a family member works.','The hotel where the family is staying.','The office where a colleague works.'],'The school where a family member works.','Listen for the place introduced with where.','The speaker identifies a school by what happens there.'),
  q('l3','What does the speaker remember well?',['The park.','The airport.','The train station.'],'The park.','Listen for “the park, which I remember very well”.','Which adds extra information about the park.'),
  q('l4','Why does the speaker want a café?',['To sit and talk for a while.','To work on a document.','To buy train tickets.'],'To sit and talk for a while.','Listen for the clause after where.','The café is described by what they can do there.')
 ]},
 professional:{label:'Professional transfer',container:'professionalQuiz',score:'professionalScore',total:'professionalTotal',items:[
  q('p1','You need to identify a caller.',['The caller who contacted us this morning needs a confirmation.','The caller where contacted us needs a confirmation.','The caller which contacted us needs a confirmation.'],'The caller who contacted us this morning needs a confirmation.','Caller = person.','Who identifies the person clearly.'),
  q('p2','You need to identify a specific form.',['Please use the form that is attached to the email.','Please use the form who is attached.','Please use where form attached.'],'Please use the form that is attached to the email.','Form = thing.','That identifies which form.'),
  q('p3','You need to identify the meeting room.',['The meeting is in the room where we met last week.','The meeting is in the room who we met last week.','The meeting is the room which we met last week.'],'The meeting is in the room where we met last week.','Place + event → where.','Where connects the room to the event.'),
  q('p4','You need to reformulate the request.',['So you need the document that explains the procedure, correct?','So you need the document who explains procedure?','You need document where explain, yes?'],'So you need the document that explains the procedure, correct?','Keep the message complete and neutral.','This sentence identifies the document and checks understanding.'),
  q('p5','Which sentence transmits information most clearly?',['The colleague who handles this account is available this afternoon.','The colleague who handles this account.','The colleague where handles account is available.'],'The colleague who handles this account is available this afternoon.','Main clause must survive.','“The colleague is available…” is the complete main message.'),
  q('p6','Which is the clearest confirmation?',['Is that the information you need?','That information you need?','It is what you need, no?'],'Is that the information you need?','Use a full neutral question.','It checks the reformulation professionally.')
 ]},
 final:{label:'Final mixed check',container:'finalQuiz',score:'finalScore',total:'finalTotal',items:[
  q('z1','Choose the complete B1 sentence.',['My daughter, who lives abroad, calls me regularly.','My daughter who lives abroad.'],'My daughter, who lives abroad, calls me regularly.','Remove the detail and check the main clause.','“My daughter calls…” is complete.'),
  q('z2','Choose the correct verb. “My sons, who ___ in France…”',['live','lives'],'live','Sons = they.','Plural subject → live.'),
  q('z3','Choose the natural place clause.',['a café where we can talk','a café who we can talk','a café where can talk'],'a café where we can talk','Place → where + subject + verb.','Where introduces what happens in the place.'),
  q('z4','Choose the professional version.',['the document that explains the procedure','the document who explains the procedure','the document where explains procedure'],'the document that explains the procedure','Thing → that/which.','That identifies the document.'),
  q('z5','Which is a fragment?',['The person who called yesterday.','The person who called yesterday left a message.'],'The person who called yesterday.','Long does not mean complete.','The first option lacks a main verb.'),
  q('z6','Choose the correct possessive. “Boston is known for ___ history.”',['its','his','their'],'its','City = it.','Use its for a singular place.'),
  q('z7','Choose the best travel sentence.',['I like places that are easy to explore on foot.','I like places who are easy walking.','I like places where are easy to explore.'],'I like places that are easy to explore on foot.','Places = things; that + verb.','That describes which places you like.'),
  q('z8','Choose the best family sentence.',['One person who matters to me lives abroad.','One person which matters to me lives abroad.','One person where matters to me.'],'One person who matters to me lives abroad.','Person → who.','Who introduces the detail about the person.'),
  q('z9','Choose the correct agreement. “The client who ___ help is waiting.”',['needs','need'],'needs','One client → needs.','Third-person singular takes -s.'),
  q('z10','Choose the strongest reformulation.',['So you need the form that contains the updated details, correct?','You need form who updated, yes?','So the form where details?'],'So you need the form that contains the updated details, correct?','Identify the thing, then confirm.','This is precise and professional.'),
  q('z11','Which sentence uses which naturally for extra information?',['The trip, which lasted a week, was excellent.','The trip where lasted a week was excellent.','The trip who lasted a week was excellent.'],'The trip, which lasted a week, was excellent.','Trip = thing; the clause is extra information.','Which is natural here.'),
  q('z12','Choose the complete sentence.',['The school where your family member works is near the park.','The school where your family member works.'],'The school where your family member works is near the park.','Look for the main verb after the where-clause.','“is near the park” completes the sentence.')
 ]}
};

function getVoice(){if(!('speechSynthesis' in window))return null;const voices=speechSynthesis.getVoices();const target=state.voice||'en-US';return voices.find(v=>v.lang===target)||voices.find(v=>v.lang?.startsWith(target.slice(0,2)))||voices[0]||null}
function speak(text){if(!('speechSynthesis' in window)){toast('Speech is not supported in this browser.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=state.voice||'en-US';u.rate=Number(state.speed||.90);const v=getVoice();if(v)u.voice=v;speechSynthesis.speak(u)}

function setupToggles(){
 $('#frToggle').checked=state.fr;document.body.classList.toggle('hide-fr',!state.fr);$('#frToggle').onchange=e=>{state.fr=e.target.checked;document.body.classList.toggle('hide-fr',!state.fr);save()};
 $('#voiceSelect').value=state.voice||'en-US';$('#voiceSelect').onchange=e=>{state.voice=e.target.value;save()};$('#speedSelect').value=state.speed||'0.90';$('#speedSelect').onchange=e=>{state.speed=e.target.value;save()};
 $('#modeSelect').value=state.mode||'coach';document.body.classList.toggle('independent',state.mode==='independent');$('#modeSelect').onchange=e=>{state.mode=e.target.value;document.body.classList.toggle('independent',state.mode==='independent');toast(state.mode==='coach'?'Coach mode: hints and models are available.':'Independent mode: support is hidden.');save()};
 const applyFont=()=>{document.body.classList.remove('font-small','font-large','font-xlarge');if(state.font<=.9)document.body.classList.add('font-small');else if(state.font>=1.2)document.body.classList.add('font-xlarge');else if(state.font>=1.08)document.body.classList.add('font-large')};applyFont();
 $('#fontDown').onclick=()=>{state.font=Math.max(.9,state.font-.1);applyFont();save()};$('#fontReset').onclick=()=>{state.font=1;applyFont();save()};$('#fontUp').onclick=()=>{state.font=Math.min(1.2,state.font+.1);applyFont();save()};
}

function renderQuiz(key){const g=groups[key],root=$('#'+g.container);if(!root)return;root.innerHTML='';g.items.forEach((item,i)=>{const saved=state.answers[item.id];const card=document.createElement('article');card.className='exercise-card';card.innerHTML=`<span class="exercise-number">${i+1}</span><p>${escapeHtml(item.prompt)}</p><div class="answer-options"></div><div class="exercise-tools"><button class="hint-button coach-only" type="button">Hint</button><div class="hint-inline">${escapeHtml(item.hint)}</div></div><div class="feedback-line"></div>`;const opts=$('.answer-options',card),fb=$('.feedback-line',card),hint=$('.hint-inline',card);shuffle(item.options).forEach(o=>{const b=document.createElement('button');b.type='button';b.textContent=o;b.onclick=()=>answerQuiz(key,item,b,card);opts.appendChild(b)});$('.hint-button',card).onclick=()=>hint.classList.toggle('open');root.appendChild(card);if(saved)restoreAnswer(item,card,saved)});updateGroupScore(key)}
function answerQuiz(key,item,button,card){if(card.dataset.done==='1')return;const correct=button.textContent===item.answer;card.dataset.done='1';$$('.answer-options button',card).forEach(b=>{b.disabled=true;if(b.textContent===item.answer)b.classList.add('correct')});if(!correct)button.classList.add('incorrect');const fb=$('.feedback-line',card);fb.textContent=correct?`✓ Correct. ${item.why}`:`✗ Best answer: ${item.answer} — ${item.why}`;fb.className='feedback-line '+(correct?'good':'bad');state.answers[item.id]={correct,chosen:button.textContent,group:key};save();updateGroupScore(key);updateDashboard()}
function restoreAnswer(item,card,saved){card.dataset.done='1';$$('.answer-options button',card).forEach(b=>{b.disabled=true;if(b.textContent===item.answer)b.classList.add('correct');if(b.textContent===saved.chosen&&!saved.correct)b.classList.add('incorrect')});const fb=$('.feedback-line',card);fb.textContent=saved.correct?`✓ Correct. ${item.why}`:`✗ Best answer: ${item.answer} — ${item.why}`;fb.className='feedback-line '+(saved.correct?'good':'bad')}
function groupResult(key){const g=groups[key];let c=0;g.items.forEach(it=>{if(state.answers[it.id]?.correct)c++});return{c,t:g.items.length}}
function updateGroupScore(key){const g=groups[key],r=groupResult(key);if(g.score&&$('#'+g.score))$('#'+g.score).textContent=r.c;if(g.total&&$('#'+g.total))$('#'+g.total).textContent=r.t;return r}
function resetQuizByContainer(container){const key=Object.keys(groups).find(k=>groups[k].container===container);if(!key)return;groups[key].items.forEach(x=>delete state.answers[x.id]);save();renderQuiz(key);updateDashboard();toast('Exercise reset.')}

function setupVocab(){const select=$('#vocabCategory');Object.keys(vocab).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=k;select.appendChild(o)});const render=()=>{const rows=vocab[select.value]||[];$('#vocabCount').textContent=rows.length;$('#vocabGrid').innerHTML=rows.map(([icon,word,fr,def,ex])=>`<article class="vocab-card"><div class="vocab-card-top"><div class="vocab-icon">${icon}</div><div><div class="vocab-word">${escapeHtml(word)}</div><div class="vocab-pos">REUSABLE CHUNK</div></div></div><span class="vocab-fr fr">${escapeHtml(fr)}</span><p class="vocab-def">${escapeHtml(def)}</p><p class="vocab-example">${escapeHtml(ex)}</p><button class="vocab-audio" type="button" data-vocab-speak="${escapeHtml(word+'. '+ex)}">🔊 Listen</button></article>`).join('');$$('[data-vocab-speak]').forEach(b=>b.onclick=()=>speak(b.dataset.vocabSpeak))};select.onchange=render;render()}

const builderData={
 'Family abroad':{
   mains:['A family member lives in Boston.','You stay close to relatives who live abroad.','Regular calls are important to you.'],
   details:['The family member teaches at an international school.','Those relatives live in different countries.','The calls help everyone keep in touch.'],
   outputs:[
    ['A family member who lives in Boston teaches at an international school.','who = person; the main clause remains complete.'],
    ['You stay close to relatives who live in different countries.','who describes relatives; the main verb is “stay”.'],
    ['Regular calls, which help everyone keep in touch, are important to you.','which adds extra information; the main clause is “Regular calls are important”.']
   ]
 },
 'Travel memories':{
   mains:['You remember a trip to Ireland.','You enjoy places with beautiful scenery.','You like cities that are easy to explore.'],
   details:['The trip included time in the countryside.','The scenery makes a place memorable.','You can walk between many sights there.'],
   outputs:[
    ['You remember a trip to Ireland that included time in the countryside.','that identifies the trip by an essential detail.'],
    ['You enjoy places that have beautiful scenery.','that describes the kind of places you enjoy.'],
    ['You like cities where you can walk between many sights.','where describes what is possible in the place.']
   ]
 },
 'Everyday English':{
   mains:['You prefer cafés with a calm atmosphere.','You enjoy conversations with time to talk.','You like neighborhoods that feel easy to navigate.'],
   details:['You can sit and talk there.','The conversations let you catch up properly.','The neighborhoods have clear walking routes.'],
   outputs:[
    ['You prefer cafés where you can sit and talk.','where connects a place with what you do there.'],
    ['You enjoy conversations that let you catch up properly.','that describes the kind of conversations.'],
    ['You like neighborhoods that have clear walking routes.','that identifies the neighborhoods by a feature.']
   ]
 },
 'Professional clarity':{
   mains:['A colleague is available this afternoon.','A document is attached to the email.','The meeting is in a specific room.'],
   details:['The colleague handles the customer account.','The document explains the procedure.','You met in the room last week.'],
   outputs:[
    ['The colleague who handles the customer account is available this afternoon.','who identifies the person; “is available” completes the main message.'],
    ['The document that explains the procedure is attached to the email.','that identifies the document.'],
    ['The meeting is in the room where you met last week.','where identifies the place by an event.']
   ]
 }
};
function setupBuilder(){
 const c=$('#builderContext'),m=$('#builderMain');
 Object.keys(builderData).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=k;c.appendChild(o)});
 c.value=builderData[state.builder?.context]?state.builder.context:Object.keys(builderData)[0];
 const refresh=()=>{const data=builderData[c.value];m.innerHTML=data.mains.map((x,i)=>`<option value="${i}">${escapeHtml(x)}</option>`).join('');m.value=String(Math.min(Number(state.builder?.main||0),data.mains.length-1));build()};
 const build=()=>{const data=builderData[c.value];const idx=Number(m.value)||0;const out=data.outputs[idx]||data.outputs[0];$('#builtSentence').textContent=out[0];$('#builtWhy').textContent=out[1];state.builder={context:c.value,main:idx};save()};
 c.onchange=()=>{state.builder={context:c.value,main:0};refresh()};m.onchange=build;
 $('#buildSentence').onclick=build;$('#speakBuilt').onclick=()=>speak($('#builtSentence').textContent);$('#copyBuilt').onclick=async()=>{try{await navigator.clipboard.writeText($('#builtSentence').textContent);toast('Sentence copied.')}catch(e){toast('Copy is unavailable in this browser.')}};
 refresh();const p=$('#personalSentence');p.value=state.personalSentence||'';const count=()=>{$('#personalWords').textContent=wordCount(p.value)};count();p.oninput=()=>{state.personalSentence=p.value;count();save()}
}

const familyListen=`A: Which part of Boston are you most looking forward to seeing? B: I'd like to spend time in neighborhoods that are easy to explore on foot. I also want to visit the school where my family member works. A: That sounds nice. Are there any places you have already chosen? B: Yes. I'd like to go back to the park, which I remember very well, and find a café where we can sit and talk for a while.`;

function setupButtons(){
 $$('.model-toggle').forEach(b=>b.onclick=()=>{const e=$('#'+b.dataset.target);e.hidden=!e.hidden;b.textContent=e.hidden?'Show models':'Hide models'});
 $$('.hint-toggle').forEach(b=>b.onclick=()=>{const e=$('#'+b.dataset.target);e.hidden=!e.hidden;b.textContent=e.hidden?'Hint':'Hide hint'});
 $$('.model-audio').forEach(b=>b.onclick=()=>{const e=$('#'+b.dataset.model);const p=$$('p',e).at(-1);speak((p?.textContent||e.textContent).replace(/^B1:\s*/,'').trim())});
 $$('.speak-inline').forEach(b=>b.onclick=()=>speak(b.dataset.speak));
 $$('.transcript-btn').forEach(b=>b.onclick=()=>{const e=$('#'+b.dataset.target);const open=!e.classList.contains('open');e.classList.toggle('open',open);e.hidden=!open;b.textContent=open?'Hide transcript':'Show transcript'});
 $('#listenFamily').onclick=()=>speak(familyListen);
 $$('.reset-section').forEach(b=>b.onclick=()=>resetQuizByContainer(b.dataset.reset));
 $$('.mark-task').forEach(b=>b.onclick=()=>{const id=b.dataset.task;state.tasks[id]=!state.tasks[id];syncTask(id);save();updateDashboard()});
 ['s1','s2','s3'].forEach(syncTask);
 $('#proHintBtn').onclick=()=>{const e=$('#proHint');e.hidden=!e.hidden;$('#proHintBtn').textContent=e.hidden?'Hint':'Hide hint'};
 $('#proModelBtn').onclick=()=>{const e=$('#proModel');e.hidden=!e.hidden;$('#proModelBtn').textContent=e.hidden?'Show models':'Hide models'};
 $('#proListenBtn').onclick=()=>{const p=$$('p',$('#proModel')).at(-1);speak((p?.textContent||'').replace(/^B1:\s*/,'').trim())};
 $('#printBtn').onclick=$('#printTop').onclick=()=>window.print();
 $('#resetAll').onclick=()=>{if(confirm('Reset the complete lesson, notes and saved progress?')){localStorage.removeItem(STORAGE_KEY);location.reload()}};
}
function syncTask(id){const on=!!state.tasks[id],s=$('#'+id+'Status'),b=$(`[data-task="${id}"]`);if(!s||!b)return;s.textContent=on?'✓ practised':'○ not practised';s.classList.toggle('done',on);b.textContent=on?'↻ Mark not practised':'✓ Mark as practised'}

let timerSeconds=90,timerHandle=null;function drawTimer(){const m=Math.floor(timerSeconds/60),s=timerSeconds%60;$('#timerDisplay').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
function setupTimer(){drawTimer();$('#timerStart').onclick=()=>{if(timerHandle)return;timerHandle=setInterval(()=>{if(timerSeconds<=0){clearInterval(timerHandle);timerHandle=null;toast('Time — finish your last sentence clearly.');return}timerSeconds--;drawTimer()},1000)};$('#timerPause').onclick=()=>{clearInterval(timerHandle);timerHandle=null};$('#timerReset').onclick=()=>{clearInterval(timerHandle);timerHandle=null;timerSeconds=90;drawTimer()}}
function setupRecorder(){let rec=null,chunks=[],stream=null;const start=$('#recordStart'),stop=$('#recordStop'),audio=$('#recordPlayback'),link=$('#recordDownload'),status=$('#recordStatus');if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){start.disabled=true;status.textContent='Voice recording is not supported in this browser. You can still practise aloud.';return}start.onclick=async()=>{try{stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];rec=new MediaRecorder(stream);rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};rec.onstop=()=>{const blob=new Blob(chunks,{type:rec.mimeType||'audio/webm'});const url=URL.createObjectURL(blob);audio.src=url;audio.hidden=false;link.href=url;link.download='Connect-The-Details-Speaking.webm';link.hidden=false;stream?.getTracks().forEach(t=>t.stop());status.textContent='Recording ready. Listen back, then try once more.'};rec.start();start.disabled=true;stop.disabled=false;status.textContent='Recording…'}catch(e){status.textContent='Microphone access was not available. You can still practise aloud.'}};stop.onclick=()=>{if(rec?.state==='recording')rec.stop();start.disabled=false;stop.disabled=true}}

function objectiveSummary(){let c=0,t=0;Object.keys(groups).forEach(k=>{const r=groupResult(k);c+=r.c;t+=r.t});return{c,t,p:t?Math.round(c/t*100):0}}
function updateDashboard(){const o=objectiveSummary(),sp=['s1','s2','s3'].filter(x=>state.tasks[x]).length;$('#objectivePercent').textContent=o.p+'%';$('#objectiveBar').style.width=o.p+'%';$('#speakingCount').textContent=sp+' / 3';$('#speakingBar').style.width=(sp/3*100)+'%';const control=Math.round((o.p+(sp/3*100))/2);$('#controlBar').style.width=control+'%';$('#controlText').textContent=control>=82?'ready to transfer':control>=60?'becoming reliable':'building';const rows=Object.keys(groups).map(k=>{const r=groupResult(k);return[groupLabel(k),`${r.c} / ${r.t}`]});$('#exerciseDetailGrid').innerHTML=rows.map(([a,b])=>`<div class="exercise-detail"><strong>${escapeHtml(a)}</strong><span>${escapeHtml(b)}</span></div>`).join('')}
function groupLabel(k){return groups[k]?.label||k}

function setupPersistence(){const fields=['lessonNotes','grammarEval','speakingEval','professionalEval','trainerComments','clarityRating','easyArea','proudSentence'];fields.forEach(id=>{const el=$('#'+id);const key=id==='lessonNotes'?'notes':id;el.value=state[key]||'';const fn=()=>{state[key]=el.value;save()};el.addEventListener('input',fn);el.addEventListener('change',fn)});$('#saveNotes').onclick=()=>{state.notes=$('#lessonNotes').value;save();toast('Notes saved on this device.')};$('#copyNotes').onclick=async()=>{try{await navigator.clipboard.writeText($('#lessonNotes').value);toast('Notes copied.')}catch(e){toast('Copy is unavailable in this browser.')}};$('#downloadResults').onclick=downloadResults}
function downloadResults(){const o=objectiveSummary(),sp=['s1','s2','s3'].filter(x=>state.tasks[x]).length;const lines=['CONNECT THE DETAILS — B1 GRAMMAR BRIDGE','','CORE TARGET','Relative clauses: who / which / that / where','Complete sentences + subject-verb agreement + possessives','','AUTOMATIC RESULTS',`Objective exercises: ${o.c} / ${o.t} (${o.p}%)`,`Speaking missions practised: ${sp} / 3`,'','TRAINER ASSESSMENT',`Grammar control: ${state.grammarEval||'—'}`,`Speaking / interaction: ${state.speakingEval||'—'}`,`Professional transfer: ${state.professionalEval||'—'}`,`Comments: ${state.trainerComments||'—'}`,'','LEARNER REFLECTION',`Clarity: ${state.clarityRating||'—'}`,`Easiest area: ${state.easyArea||'—'}`,`Sentence I am proud of: ${state.proudSentence||'—'}`,'','PERSONALISED PRACTICE',state.personalSentence||'—','','NOTES',state.notes||'—'];const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Connect_The_Details_Results.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);toast('Results downloaded.')}

function init(){setupToggles();setupVocab();Object.keys(groups).forEach(renderQuiz);setupBuilder();setupButtons();setupTimer();setupRecorder();setupPersistence();updateDashboard();if('speechSynthesis' in window)window.speechSynthesis.onvoiceschanged=()=>{}}
document.addEventListener('DOMContentLoaded',init);
