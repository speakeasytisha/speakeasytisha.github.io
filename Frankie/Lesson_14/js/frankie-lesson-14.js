(()=>{
'use strict';
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const STORAGE='speakeasytisha-frankie-newsroom-lesson14-v1';
const C={correct:'✅ Correct!',wrong:'❌ Not quite yet.'};
let stored={};try{stored=JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{stored={}};
const state={solved:stored.solved||{},notes:stored.notes||'',link:stored.link||'',fields:stored.fields||{},writing:stored.writing||'',checks:stored.checks||[],accent:stored.accent||'en-US',french:stored.french!==false};
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(state))}catch{}}
function toast(message){const t=$('#toast');if(!t)return;t.textContent=message;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2600)}
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function norm(s){return String(s??'').trim().toLowerCase().replace(/[‘’]/g,"'").replace(/\s+/g,' ').replace(/[.!?]$/g,'').trim()}
function sound(s){if(!('speechSynthesis' in window)){toast('⚠️ Your browser does not support spoken audio.');return}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang=state.accent;u.rate=.86;u.pitch=1;const vs=window.speechSynthesis.getVoices();const chosen=vs.find(v=>v.lang===state.accent)||vs.find(v=>v.lang?.toLowerCase().startsWith(state.accent.slice(0,2).toLowerCase()));if(chosen)u.voice=chosen;window.speechSynthesis.speak(u)}
document.addEventListener('click',e=>{const b=e.target.closest('.listen');if(b){sound(b.dataset.say||b.closest('.vocab-card')?.dataset.word||'')}});
$('#stopSpeech')?.addEventListener('click',()=>window.speechSynthesis?.cancel());
$('#printBtn')?.addEventListener('click',()=>window.print());
$$('.accent').forEach(b=>b.addEventListener('click',()=>{state.accent=b.dataset.accent;$$('.accent').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});persist();toast(`🔊 ${state.accent==='en-GB'?'British':'American'} accent selected`)}));
$$('.accent').forEach(x=>{x.classList.toggle('active',x.dataset.accent===state.accent);x.setAttribute('aria-pressed',String(x.dataset.accent===state.accent))});
function applyFrench(){document.body.classList.toggle('hide-french',!state.french);$('#toggleFrench').textContent=`🇫🇷 French help: ${state.french?'ON':'OFF'}`;$('#toggleFrench').setAttribute('aria-pressed',String(state.french))}
$('#toggleFrench')?.addEventListener('click',()=>{state.french=!state.french;applyFrench();persist()});applyFrench();

// Every item has category, icon, English, French, plain-language explanation, and model sentence.
const vocabGroups={
'📣 Strikes & demonstrations':[
['✊','strike','grève','When workers stop working to ask for change.','Some employees went on strike.'],
['📣','demonstration','manifestation','A public event where people express a view.','I attended a demonstration yesterday.'],
['📢','protest','manifestation / protestation','An action expressing disagreement or demanding change.','People held a peaceful protest.'],
['🚶','march','défilé / défiler','A group of people walking together to show support or opposition.','The march began in the town centre.'],
['👥','protester','manifestant(e)','A person who takes part in a protest.','Some protesters carried banners.'],
['👷','striking worker','gréviste','A person who stops working as part of a strike.','A striking worker explained the demands.'],
['🤝','trade union','syndicat','An organisation representing workers.','The trade union called for negotiations.'],
['📍','rally','rassemblement','A large public meeting to support a cause.','People met at a rally.'],
['📃','petition','pétition','A written request signed by people.','They signed a petition.'],
['🪧','banner / placard','banderole / pancarte','A sign carrying a message at a demonstration.','I saw a banner about wages.'],
['📣','slogan','slogan','A short message people repeat or display.','People repeated a slogan.'],
['🗣️','chant','scander / chant','Words repeated rhythmically by a crowd.','I heard people chanting.'],
['📢','megaphone','mégaphone','A device that makes your voice louder.','The speaker used a megaphone.'],
['🧑‍🤝‍🧑','crowd','foule','A large group of people in one place.','There was a big crowd.'],
['🛑','blockade','blocage','An action that prevents people or vehicles passing.','There was a blockade near the station.']],
'💶 Reasons & economic issues':[
['💸','cost of living','coût de la vie','The money needed for everyday expenses.','People are worried about the cost of living.'],
['💶','wages','salaires','Money paid regularly for work.','Workers are asking for higher wages.'],
['🛒','purchasing power','pouvoir d’achat','How much people can buy with their income.','Rising prices affect purchasing power.'],
['📈','inflation','inflation','A general increase in prices over time.','Inflation makes everyday life more expensive.'],
['💰','minimum wage','SMIC / salaire minimum','The lowest legal wage for work.','Some unions want a higher minimum wage.'],
['📊','budget cuts','coupes budgétaires','Reductions in money available to a service.','Some people oppose budget cuts.'],
['⚖️','fair pay','rémunération juste','Money considered reasonable for the work done.','People want fair pay.'],
['🔋','energy bills','factures d’énergie','Bills for electricity or heating.','Energy bills have increased.'],
['🏠','rent','loyer','Money paid for living in a home.','Rent is expensive in some cities.'],
['👵','pension','retraite / pension','Regular payments to retired people.','Pensioners are concerned about pensions.'],
['💼','employment','emploi','Paid work and jobs.','The unions want to protect employment.'],
['⚙️','working conditions','conditions de travail','The environment and rules people work under.','Teachers want better working conditions.'],
['📣','demand (noun)','revendication','Something a person or group asks for.','Higher wages are one demand.'],
['🤲','support (verb)','soutenir','To agree with or help a person or idea.','I support peaceful demonstrations.']],
'🏫 Schools, services & society':[
['🏫','education','éducation / enseignement','Teaching and learning in schools or colleges.','Students want more support for education.'],
['🎓','student','étudiant(e) / élève','A person who studies.','Some students joined the demonstration.'],
['👩‍🏫','teacher','enseignant(e)','A person who teaches students.','Teachers are worried about resources.'],
['📚','school resources','moyens scolaires','Staff, equipment and money a school needs.','Schools need resources.'],
['🏥','public services','services publics','Services provided for the community.','Public services include schools and hospitals.'],
['🧑‍⚕️','healthcare','soins de santé','Medical services and treatment.','Healthcare is important to everyone.'],
['🚌','public transport','transports publics','Shared transport such as trains and buses.','Public transport was affected.'],
['🏛️','government','gouvernement','People who lead and administer a country.','The government met union leaders.'],
['📜','policy','politique / mesure','A plan or decision guiding actions.','People disagree about this policy.'],
['🤝','negotiation','négociation','A discussion to try to reach agreement.','Unions want negotiations.'],
['⚖️','rights','droits','Freedoms and protections people have.','People discussed the right to protest.'],
['🧩','solidarity','solidarité','Support and unity with others.','Some people marched in solidarity.']],
'🎭 Atmosphere & feelings':[
['🕊️','peaceful','pacifique','Without violence.','The march was peaceful in my area.'],
['🎉','lively','animé / vivant','Full of energy and activity.','The atmosphere was lively.'],
['😰','tense','tendu','Nervous or uncomfortable.','The mood became tense.'],
['🙌','hopeful','plein(e) d’espoir','Feeling that something good may happen.','I felt hopeful.'],
['😤','frustrated','frustré(e)','Upset because of an unsatisfactory situation.','Some workers felt frustrated.'],
['😟','concerned','inquiet / préoccupé','Worried about something important.','I was concerned about prices.'],
['💪','determined','déterminé(e)','Not ready to give up.','The participants looked determined.'],
['🗨️','noisy','bruyant','Making a lot of sound.','The street was noisy.'],
['🌿','calm','calme','Quiet and not angry.','The crowd remained calm.'],
['🌊','overwhelmed','dépassé(e) / submergé(e)','Feeling that something is too much to handle.','I felt overwhelmed by the crowd.'],
['❤️','proud','fier / fière','Happy about what you did.','I felt proud of taking part.'],
['😕','uncertain','incertain(e)','Not sure what will happen.','People feel uncertain about the future.']],
'🚆 Impact on everyday life':[
['🚆','disruption','perturbation','An interruption to normal activities.','There were transport disruptions.'],
['❌','cancelled train','train annulé','A train that will not run.','My train was cancelled.'],
['🚦','traffic jam','embouteillage','A line of vehicles moving slowly.','There was a traffic jam.'],
['🚧','road closure','fermeture de route','When a road is closed to traffic.','There was a road closure.'],
['🛍️','shopkeeper','commerçant(e)','A person who owns or runs a shop.','A shopkeeper closed early.'],
['🏪','local business','commerce local','A company or shop serving a local area.','Some local businesses were affected.'],
['🚪','close early','fermer plus tôt','Stop business earlier than usual.','The shop had to close early.'],
['⌛','delay','retard','When something happens later than planned.','There was a delay on the train.'],
['🔔','announcement','annonce','Information given publicly.','We heard a transport announcement.'],
['📍','route','itinéraire','The way you travel from one place to another.','The march followed a different route.']],
'⚠️ Safety, shops & incidents':[
['🚓','police officer','policier / policière','A person who helps enforce laws.','Police officers were near the route.'],
['🦺','security','sécurité','Protection against danger.','Security was an important concern.'],
['🛠️','vandalism','vandalisme / dégradations','Intentional damage to property.','Vandalism is different from peaceful protest.'],
['🛒','shoplifting','vol à l’étalage','Taking goods from a shop without paying.','Shoplifting is a crime.'],
['📦','looting','pillage','Stealing goods during a disturbance.','Authorities warned about the risk of looting.'],
['⚔️','clash','affrontement','A violent confrontation between groups.','There were reports of clashes in some areas.'],
['🧱','property damage','dégâts matériels','Damage to buildings or objects.','Some reports mentioned property damage.'],
['✋','arrest','arrestation / interpeller','When police take someone into custody.','The report mentioned arrests.'],
['🚫','isolated incident','incident isolé','One event that is not typical of the whole situation.','An isolated incident does not represent everyone.'],
['📰','unverified claim','affirmation non vérifiée','A statement not yet supported by reliable evidence.','We should not repeat an unverified claim.'],
['❗','alleged','présumé / supposé','Reported but not yet proved.','The article described an alleged incident.'],
['🌈','peaceful protest','manifestation pacifique','A public demonstration without violence.','Most people wanted a peaceful protest.']],
'🕰️ Verbs & actions':[
['🚶','march / marched','défiler / a défilé','Walk together publicly to support a cause.','We marched through the town.'],
['👀','see / saw / seen','voir / a vu','Notice with your eyes.','I saw many signs.'],
['👂','hear / heard / heard','entendre / a entendu','Notice sounds.','I heard loud chants.'],
['📍','attend / attended','assister à / a assisté','Be present at an event.','I attended a demonstration.'],
['🤝','join / joined','rejoindre / a rejoint','Become part of a group or event.','I joined the march.'],
['🗣️','speak / spoke / spoken','parler / a parlé','Use words to communicate.','A speaker spoke to the crowd.'],
['📣','call for / called for','réclamer / a réclamé','Ask publicly for change.','Unions called for higher wages.'],
['🤔','feel / felt / felt','ressentir / a ressenti','Experience an emotion.','I felt hopeful.'],
['🏁','begin / began / begun','commencer / a commencé','Start to happen.','The demonstration began at noon.'],
['📄','carry / carried','porter / a porté','Hold and transport something.','People carried signs.'],
['📰','report / reported','signaler / a signalé','Give information about an event.','The newspaper reported disruptions.'],
['🤝','negotiate / negotiated','négocier / a négocié','Talk to reach an agreement.','The groups negotiated.']],
'📅 Tense signals & dates':[
['⬅️','yesterday','hier','The day before today.','I went to a march yesterday.'],
['🗓️','last week','la semaine dernière','The week before this one.','There was a strike last week.'],
['⏮️','last month','le mois dernier','The month before this one.','People protested last month.'],
['⏳','for several weeks','depuis plusieurs semaines (durée)','A period of several weeks.','People have been protesting for several weeks.'],
['📌','since October','depuis octobre (point de départ)','Starting in October and continuing to now.','The topic has been in the news since October.'],
['🕐','at the moment','en ce moment','Right now or around the present.','People are discussing the issue at the moment.'],
['➡️','next week','la semaine prochaine','The week after this one.','I am going to read more next week.'],
['🌅','tomorrow','demain','The day after today.','I will call you tomorrow.'],
['🕖','on Friday at seven','vendredi à sept heures','A specific day and time.','We are meeting on Friday at seven.'],
['🔁','recently','récemment','A short time ago or over a recent period.','There have been several demonstrations recently.'],
['🎬','while','pendant que','During another continuing action.','I was listening while people were chanting.']],
'💬 Opinions & discussion':[
['💭','in my opinion','à mon avis','A phrase introducing your personal view.','In my opinion, dialogue is important.'],
['📖','according to','selon / d’après','Used to identify who provided information.','According to the report, trains were delayed.'],
['💡','I think…','je pense que…','A simple way to express an opinion.','I think people should be heard.'],
['⚖️','on the other hand','d’un autre côté','A phrase to introduce a different perspective.','On the other hand, shopkeepers were worried.'],
['✅','I agree','je suis d’accord','A polite way to show agreement.','I agree that public services matter.'],
['🙅','I disagree','je ne suis pas d’accord','A polite way to show a different opinion.','I disagree, but I understand your point.'],
['🧩','because','parce que','Links a reason with a full sentence.','I joined because I care about wages.'],
['🔗','because of','à cause de','Introduces a noun as a reason.','Trains were late because of the strike.'],
['↔️','although','bien que / même si','Shows contrast between two ideas.','Although it was crowded, I felt safe.'],
['🤗','I understand your point','je comprends votre point de vue','A respectful reaction to an opinion.','I understand your point, but I think differently.'],
['❓','Could you explain?','Pourriez-vous expliquer ?','A polite request for more information.','Could you explain why you went?']],
'🎙️ Interview & news reporting':[
['📰','headline','titre de presse','The short title of a news story.','The headline mentioned the demonstration.'],
['🎤','reporter','journaliste / reporter','A person who reports news.','The reporter asked three questions.'],
['🎙️','interview','interview / entretien','A conversation with questions and answers.','I gave a short interview.'],
['📸','eyewitness','témoin direct','A person who saw an event happen.','An eyewitness described the atmosphere.'],
['🧐','source','source','Where information comes from.','Always check the source.'],
['❓','What happened?','Que s’est-il passé ?','A question about events.','What happened yesterday?'],
['💬','Why did you join?','Pourquoi avez-vous participé ?','A question asking for reasons.','Why did you join the march?'],
['🧭','What was it like?','Comment c’était ?','A question about an experience.','What was the atmosphere like?'],
['🔮','What will happen next?','Que se passera-t-il ensuite ?','A question about future events.','What will happen next?'],
['🔁','follow-up question','question de relance','A second question asking for more detail.','I asked a follow-up question.'],
['🪞','summary','résumé','A short statement of the main facts.','I gave a short summary.']]
};
const entries=[];Object.entries(vocabGroups).forEach(([category,words])=>words.forEach(([icon,en,fr,definition,example])=>entries.push({category,icon,en,fr,definition,example})));
const categoryEl=$('#vocabCategory'), searchEl=$('#vocabSearch'), grid=$('#vocabGrid');
Object.keys(vocabGroups).forEach(cat=>{const op=document.createElement('option');op.value=cat;op.textContent=cat;categoryEl.append(op)});
function renderVocab(){const cat=categoryEl.value,q=norm(searchEl.value);const visible=entries.filter(w=>(cat==='all'||w.category===cat)&&(!q||norm([w.en,w.fr,w.definition,w.example].join(' ')).includes(q)));$('#vocabCount').textContent=`${visible.length} / ${entries.length} words`;grid.innerHTML=visible.map(w=>`<article class="vocab-card"><div class="vocab-card-head"><div class="vocab-icon" aria-hidden="true">${w.icon}</div><div><h4>${escapeHtml(w.en)}</h4><span class="vocab-fr fr">${escapeHtml(w.fr)}</span></div></div><p>${escapeHtml(w.definition)}</p><div class="vocab-example">“${escapeHtml(w.example)}”</div><button type="button" class="listen-btn listen" data-say="${escapeHtml(w.en+'. '+w.example)}">▶ Listen</button></article>`).join('')||'<p>No words found. Try another spelling or category.</p>'}
categoryEl.addEventListener('change',renderVocab);searchEl.addEventListener('input',renderVocab);renderVocab();

// Exercise data, with varied distractor positions and explanation-style feedback.
const quizData={
reading:[
 ['According to the news briefing, what was a major demand?',['More expensive train tickets','Higher wages','Fewer public services'],1,'Look at the Pay & living costs report.','Wages and purchasing power were among the main issues.'],
 ['Which groups took part in the recent mobilisations?',['Only shopkeepers','Only politicians','Workers, students and other citizens'],2,'Read the news headline again.','The mobilisation included more than one group.'],
 ['What happened to some train journeys?',['Some services were disrupted','Every train stopped for a month','All trains ran normally everywhere'],0,'Look at the transport news card.','Rail services were disrupted in some areas.'],
 ['Do the ministry and trade unions give the same attendance figure?',['Yes, exactly','No, they reported different estimates','No attendance figures were reported'],1,'Look at “Compare sources”.','Different sources can report different estimates.'],
 ['What is the most careful way to describe safety issues?',['All young people were violent','All protesters damaged shops','Some incidents were reported, but marches were broadly peaceful'],2,'Keep specific incidents separate from the overall event.','Describe specific incidents without generalising.'] ],
tense:[
 ['Yesterday, I ___ to a demonstration.',['go','went','have gone'],1,'“Yesterday” signals a finished past time.','Past Simple: went.'],
 ['There ___ several demonstrations over the past few weeks.',['have been','was','are go'],0,'“Over the past few weeks” links past and present.','Present Perfect: have been.'],
 ['Look! People ___ banners in the square.',['carried','have carry','are carrying'],2,'“Look!” tells you something is happening now.','Present Continuous: are carrying.'],
 ['When I arrived, people ___ slogans.',['were chanting','chant','have chanted yesterday'],0,'An ongoing action in the background of a finished event.','Past Continuous: were chanting.'],
 ['Next week, I ___ follow the news.',['followed','am going to','have'],1,'A plan for next week: going to + base verb.','Going to is used for your plan.'],
 ['I think everyone ___ fair pay.',['deserves','are deserving','deserve yesterday'],0,'General opinions use Present Simple; everyone is singular.','Present Simple: deserves.'],
 ['I ___ never seen such a big crowd before.',['am','have','did'],1,'“Never…before” invites life-experience Present Perfect.','I have never seen…'],
 ['Did you ___ the demonstration?',['attended','attending','attend'],2,'After did, use the base verb.','Did you attend?'],
 ['The protest ___ at noon on 5 November.',['began','has began','is began'],0,'A finished event on a specific date: Past Simple.','Begin → began.'],
 ['They ___ protesting for several weeks.',['were','have been','did'],1,'Optional B1 stretch: have been + -ing.','Present Perfect Continuous: have been protesting.'],
 ['Is your teacher ___ the news right now?',['reading','reads','read yesterday'],0,'Is + verb-ing.','Is … reading?'],
 ['Are you going to ___ questions later?',['asking','asked','ask'],2,'Going to + base verb.','Are you going to ask?'] ],
questions:[
 ['“What did you see yesterday?” Which tense do you hear?',['Present Continuous','Past Simple','Future'],1,'Find “did” and “yesterday”.','Did + base form in questions; past form in positive answers.'],
 ['“Do you usually follow the news?” Which tense?',['Present Simple','Past Simple','Past Continuous'],0,'“Do” and “usually” signal a habit.','Present Simple for routines.'],
 ['“What are they doing now?” Which tense?',['Present Perfect','Future','Present Continuous'],2,'Are + -ing / now.','Present Continuous: They are discussing…'],
 ['“Have you ever taken part in a strike?” Which tense?',['Present Perfect','Past Simple','Going to'],0,'Have + past participle / ever.','Present Perfect asks about life experience.'],
 ['“What were people doing when you arrived?” Which tense describes the background?',['Present Simple','Past Continuous','Future'],1,'Were + -ing.','Past Continuous: were chanting, were holding signs.'],
 ['“What are you going to do next week?” Which tense?',['Past Simple','Present Simple','Future plans'],2,'“Going to” and “next week”.','Future plan: I’m going to…'],
 ['“Why did you join?” What information does why ask for?',['A reason','A place','A person'],0,'Why means pourquoi.','Answer with because + a full sentence.'],
 ['“How was the atmosphere?” What information is needed?',['A date','A description or feeling','A place'],1,'How was it? = comment c’était ?','It was calm, lively or tense.'] ],
fact:[
 ['“According to the Interior Ministry, around 575,000 people took part.”',['Attributed report','Personal opinion','Prediction'],0,'“According to” names a source.','This is a claim attributed to the ministry.'],
 ['“I think higher wages are important.”',['Past tense fact','Personal opinion','Official statistic'],1,'“I think” identifies the speaker’s view.','This is an opinion, not a verified number.'],
 ['“The trade unions said more than 1.5 million people took part.”',['Unattributed fact','Promise','Attributed report'],2,'Look for “said”.','This number belongs to the stated source.'],
 ['“All young people damage shops during demonstrations.”',['Responsible neutral wording','Unfair generalisation','A proved fact'],1,'Avoid treating a whole group as one person.','We must avoid unsupported generalisations.'],
 ['“Some stores were affected by transport disruptions.”',['Cautious statement','Guaranteed universal fact','Future plan'],0,'Notice the word “some”.','A cautious statement avoids overclaiming.'],
 ['“In my opinion, dialogue is important.”',['Official measurement','Direct quote from a source','Personal opinion'],2,'“In my opinion” = à mon avis.','Personal views should be presented as views.'] ],
listen1:[
 ['Why did the participant join the march?',['For a music festival','Because of cost-of-living concerns','Because of a football match'],1,'Listen for “cost of living”.','The participant spoke about cost of living and wages.'],
 ['What were people doing?',['Carrying banners and chanting','Painting a house','Waiting at an airport'],0,'Listen after “At first”.','They were carrying banners and chanting.'],
 ['How did the participant feel?',['Bored','Angry with the reporter','Hopeful'],2,'Listen for the emotion near the end.','The participant felt hopeful.'] ],
listen2:[
 ['Why did the shop close early?',['The shopkeeper went on holiday','The streets were blocked','The shop had no products'],1,'Listen for “because”.','The streets were blocked.'],
 ['Was the shop damaged?',['No','Yes','The recording does not say'],0,'Listen carefully to the yes/no answer.','No, it wasn’t. Avoid inventing damage.'],
 ['What does the shopkeeper hope?',['For more traffic','For all shops to close','For peaceful discussion'],2,'Listen to the final sentence.','The shopkeeper wants the problems discussed peacefully.'] ]
};
const fillData=[
 ['Yesterday, I ___ (go) to a demonstration.',['went'],'Use the irregular Past Simple of go.','Go → went.'],
 ['I ___ (see) many banners on the street.',['saw'],'See is irregular.','See → saw.'],
 ['People ___ (chant) when the march started.',['were chanting'],'An activity in progress in the past; plural people.','Past Continuous: were chanting.'],
 ['There ___ (be) many people near the station yesterday.',['were'],'There were + plural people.','There were many people.'],
 ['There ___ (be) a peaceful atmosphere in my area.',['was'],'There was + singular atmosphere.','There was a peaceful atmosphere.'],
 ['They ___ (protest) over the past few weeks.',['have protested','have been protesting'],'Recent period reaching now: Present Perfect, or B1 continuous form.','Have protested / have been protesting.'],
 ['___ (do) you attend the demonstration yesterday?',['did'],'A finished-time question needs Did.','Did you attend…?'],
 ['Did you ___ (hear) the slogans?',['hear'],'After did, use the base form.','Did you hear…?'],
 ['People are ___ (talk) about wages today.',['talking'],'Are + -ing.','Are talking.'],
 ['I went because I ___ (care) about public services.',['care','cared'],'Both can work: care for an ongoing belief, cared for a past viewpoint.','I went because I care / cared about public services.'],
 ['I missed my train because ___ the strike.',['of'],'Because of + a noun.','Because of the strike.'],
 ['Next week, I am going to ___ (read) more about the situation.',['read'],'Going to + base verb.','Going to read.']
];
const orderData=[
 ['What did you see yesterday?','What / did / you / see / yesterday?','Did + subject + base verb.'],
 ['I went because I care about wages.','I / went / because / I / care / about / wages.','Because + complete clause.'],
 ['People were carrying banners.','People / were / carrying / banners.','People + were + -ing.'],
 ['Have you followed the news recently?','Have / you / followed / the / news / recently?','Have + subject + past participle.'],
 ['Why do people go on strike?','Why / do / people / go / on / strike?','Why + do + subject + base verb?'],
 ['There have been several protests.','There / have / been / several / protests.','Present Perfect: have been.'],
 ['Are you going to attend another march?','Are / you / going / to / attend / another / march?','Are you going to + base verb?'],
 ['The atmosphere was lively but peaceful.','The / atmosphere / was / lively / but / peaceful.','Was + adjective; contrast with but.']
];
const matchData=[
 ['strike','Workers stop work to request change.'],['demonstration','People gather publicly to express a view.'],['purchasing power','How much you can buy with your income.'],['banner','A large sign with a message.'],['chant','Repeated words spoken by a crowd.'],['vandalism','Deliberate damage to property.'],['looting','Stealing goods during disorder.'],['shopkeeper','A person who runs a local shop.']
];
const banks={reading:{mount:'readingExercises',type:'choice',data:quizData.reading},tense:{mount:'tenseExercises',type:'choice',data:quizData.tense},fill:{mount:'fillExercises',type:'fill',data:fillData},order:{mount:'orderExercises',type:'order',data:orderData},match:{mount:'matchExercises',type:'match',data:matchData},questions:{mount:'questionExercises',type:'choice',data:quizData.questions},fact:{mount:'factExercises',type:'choice',data:quizData.fact},listen1:{mount:'listenOneExercises',type:'choice',data:quizData.listen1},listen2:{mount:'listenTwoExercises',type:'choice',data:quizData.listen2}};
const records={};Object.entries(banks).forEach(([section,config])=>config.data.forEach((q,i)=>records[section+'-'+i]=true));
function totalProgress(){const total=Object.keys(records).length;const count=Object.keys(state.solved).filter(k=>records[k]).length;$('#progressFill').style.width=`${Math.round(count/total*100)}%`;$('#progressLabel').textContent=`${count} / ${total} correct answers completed`}
function markSolved(section,index,exercise){const id=section+'-'+index;state.solved[id]=true;exercise.classList.remove('incorrect');exercise.classList.add('correct');persist();totalProgress()}
function removeSolved(section,index){delete state.solved[section+'-'+index];persist();totalProgress()}
function answerBox(section,index){return `<div class="feedback" id="fb-${section}-${index}" role="status" aria-live="polite"></div><div class="hint-area" id="hint-${section}-${index}" hidden></div>`}
function setFeedback(section,i,ok,correctText,el){const f=$('#fb-'+section+'-'+i);const e=el||f?.closest('.exercise');if(!f||!e)return;f.className='feedback '+(ok?'good':'bad');f.textContent=(ok?C.correct:C.wrong)+' '+correctText;e.classList.toggle('correct',ok);e.classList.toggle('incorrect',!ok);if(ok)markSolved(section,i,e);else removeSolved(section,i)}
function showHint(section,i,hint){const h=$('#hint-'+section+'-'+i);if(!h)return;h.textContent='💡 Hint: '+hint;h.hidden=false}
function stableShuffle(arr,seed){const out=arr.map((v,i)=>({v,n:((i+3)*41+seed*29)%97}));out.sort((a,b)=>a.n-b.n);return out.map(x=>x.v)}
function choicesMarkup(section,data){return data.map(([question,options,answer,hint,explanation],i)=>`<article class="exercise ${state.solved[section+'-'+i]?'correct':''}" data-section="${section}" data-index="${i}"><span class="qnum">QUESTION ${i+1}</span><h4>${escapeHtml(question)}</h4><div class="choice-row" role="group" aria-label="Choose an answer">${options.map((opt,j)=>`<button type="button" class="choice" data-choice="${j}">${escapeHtml(opt)}</button>`).join('')}</div><div class="exercise-actions"><button type="button" class="hint-btn" data-hint>💡 Hint</button><button type="button" class="answer-btn" data-answer>👀 Show answer</button></div>${answerBox(section,i)}${state.solved[section+'-'+i]?'<div class="fine">✓ Previously completed correctly</div>':''}</article>`).join('')}
function fillMarkup(section,data){return data.map(([question,answers,hint],i)=>`<article class="exercise ${state.solved[section+'-'+i]?'correct':''}" data-section="${section}" data-index="${i}"><span class="qnum">SENTENCE ${i+1}</span><h4>${escapeHtml(question)}</h4><label class="sr-only" for="fill-${i}">Type your missing words</label><input type="text" id="fill-${i}" class="fill-input" autocomplete="off" spellcheck="false" placeholder="Type the missing word(s)…"><div class="exercise-actions"><button type="button" class="check-btn" data-check>✓ Check</button><button type="button" class="hint-btn" data-hint>💡 Hint</button><button type="button" class="answer-btn" data-answer>👀 Show answer</button></div>${answerBox(section,i)}</article>`).join('')}
function orderMarkup(section,data){return data.map(([answer,wordString,hint],i)=>`<article class="exercise ${state.solved[section+'-'+i]?'correct':''}" data-section="${section}" data-index="${i}"><span class="qnum">SENTENCE ${i+1}</span><h4>Build a complete, correct sentence.</h4><div class="order-ui"><div class="order-target" role="group" aria-label="Your selected words"></div><div class="order-bank" role="group" aria-label="Available words"></div></div><div class="order-guide">Select one word at a time; select it again to put it back. The order is mixed on purpose.</div><div class="exercise-actions"><button type="button" class="check-btn" data-check>✓ Check my sentence</button><button type="button" class="hint-btn" data-hint>💡 Hint</button><button type="button" class="answer-btn" data-answer>👀 Show answer</button><button type="button" class="small-button" data-undo>↶ Try again</button></div>${answerBox(section,i)}</article>`).join('')}
function matchMarkup(section,data){return `<div class="exercise" data-section="match" data-index="0"><span class="qnum">DRAG & DROP OR TAP TO MATCH</span><h4>Connect each English word to the correct meaning.</h4><div class="match-layout"><div><div class="match-label">WORDS</div><div id="matchSources"></div></div><div><div class="match-label">DEFINITIONS</div><div id="matchTargets"></div></div></div><div class="exercise-actions"><button type="button" class="hint-btn" id="matchHint">💡 Hint</button><button type="button" class="small-button reset-section" data-reset="match">↻ Start again</button></div><div class="feedback" id="matchFeedback" role="status" aria-live="polite"></div><div class="hint-area" id="matchHintArea" hidden></div></div>`}
function renderBank(section){const conf=banks[section],mount=$('#'+conf.mount);if(!mount)return;if(conf.type==='choice')mount.innerHTML=choicesMarkup(section,conf.data);if(conf.type==='fill')mount.innerHTML=fillMarkup(section,conf.data);if(conf.type==='order'){mount.innerHTML=orderMarkup(section,conf.data);initOrder(section)}if(conf.type==='match'){mount.innerHTML=matchMarkup(section,conf.data);initMatch()}}
function getQ(section,i){return banks[section]?.data[i]}
document.addEventListener('click',e=>{const ex=e.target.closest('.exercise');if(!ex||ex.dataset.section==='match')return;const s=ex.dataset.section,i=Number(ex.dataset.index),q=getQ(s,i);if(!q)return;
if(e.target.closest('[data-choice]')){const b=e.target.closest('[data-choice]'),value=Number(b.dataset.choice),correct=value===q[2];$$('.choice',ex).forEach((x,j)=>{x.classList.toggle('selected',x===b);x.classList.toggle('correct-option',j===q[2]&&correct);x.classList.toggle('incorrect-option',x===b&&!correct)});setFeedback(s,i,correct,correct?q[4]:('Try again. '+(q[3]||'')),ex);return}
if(e.target.closest('[data-hint]')){showHint(s,i,(banks[s].type==='order'?q[2]:q[3]||q[2]));return}
if(e.target.closest('[data-answer]')){let answer;if(banks[s].type==='choice')answer=q[1][q[2]];else if(banks[s].type==='fill')answer=q[1][0];else answer=q[0];showHint(s,i,'Model answer: '+answer);return}
if(e.target.closest('[data-undo]')){if(banks[s].type==='order')resetOneOrder(ex,i);return}
if(e.target.closest('[data-check]')){if(banks[s].type==='fill'){const val=norm($('.fill-input',ex).value);const good=q[1].some(a=>norm(a)===val);setFeedback(s,i,good,good?'Well done. '+q[3]:'Try again. '+q[2],ex)}else if(banks[s].type==='order'){const actual=ex._orderSelected.map(n=>n.word).join(' ');const good=norm(actual.replace(/\s+([.!?])/g,'$1'))===norm(q[0]);setFeedback(s,i,good,good?'Your question or sentence is correctly ordered.':'Check the word order and try again. '+q[2],ex)}return}
});
document.addEventListener('input',e=>{if(!e.target.matches('.fill-input'))return;const ex=e.target.closest('.exercise'),s=ex.dataset.section,i=Number(ex.dataset.index),q=getQ(s,i);if(q[1].some(a=>norm(a)===norm(e.target.value))){setFeedback(s,i,true,'Well done. '+q[3],ex)}else{ex.classList.remove('correct');const f=$('#fb-'+s+'-'+i);f.textContent='';f.className='feedback';removeSolved(s,i)}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('.fill-input')){e.preventDefault();e.target.closest('.exercise')?.querySelector('[data-check]')?.click()}});
function initOrder(section){$$(`.exercise[data-section="${section}"]`).forEach(ex=>{const i=Number(ex.dataset.index),sentence=orderData[i][1].split(' / '),words=sentence.map((word,k)=>({word,id:k}));ex._orderSelected=[];ex._orderBank=stableShuffle(words,i+3);if(ex._orderBank.map(x=>x.word).join(' ')===sentence.join(' '))ex._orderBank.reverse();drawOrder(ex)})}
function drawOrder(ex){const target=$('.order-target',ex),bank=$('.order-bank',ex);const make=(w,place)=>`<button type="button" class="word-chip" data-chip="${w.id}" data-place="${place}">${escapeHtml(w.word)}</button>`;target.innerHTML=ex._orderSelected.map(w=>make(w,'target')).join('')||'<span class="order-guide">Your sentence goes here…</span>';bank.innerHTML=ex._orderBank.map(w=>make(w,'bank')).join('');const i=Number(ex.dataset.index);$$('[data-chip]',ex).forEach(b=>b.addEventListener('click',()=>{const id=Number(b.dataset.chip),from=b.dataset.place;if(from==='bank'){const x=ex._orderBank.find(w=>w.id===id);ex._orderBank=ex._orderBank.filter(w=>w.id!==id);ex._orderSelected.push(x)}else{const x=ex._orderSelected.find(w=>w.id===id);ex._orderSelected=ex._orderSelected.filter(w=>w.id!==id);ex._orderBank.push(x)}drawOrder(ex);const chosen=ex._orderSelected.map(w=>w.word);const expected=orderData[i][1].split(' / ');const okSoFar=chosen.every((w,j)=>w===expected[j]);if(chosen.length){const f=$('#fb-order-'+i);f.className='feedback '+(okSoFar?'good':'bad');f.textContent=okSoFar?'✓ Good order so far. Continue!':'↶ Check the last word. Tap it to return it to the bank.';ex.classList.toggle('incorrect',!okSoFar);if(chosen.length===expected.length&&okSoFar){setFeedback('order',i,true,'Excellent! Your sentence is complete.',ex)}}else{$('#fb-order-'+i).textContent='';ex.classList.remove('incorrect')}if(!okSoFar||chosen.length!==expected.length)removeSolved('order',i)}))}
function resetOneOrder(ex,i){const sentence=orderData[i][1].split(' / ');ex._orderSelected=[];ex._orderBank=stableShuffle(sentence.map((word,k)=>({word,id:k})),i+3);if(ex._orderBank.map(x=>x.word).join(' ')===sentence.join(' '))ex._orderBank.reverse();ex.classList.remove('correct','incorrect');$('#fb-order-'+i).textContent='';$('#hint-order-'+i).hidden=true;removeSolved('order',i);drawOrder(ex)}
let matchSelection=null,matched={};
function initMatch(){matched={};matchSelection=null;const shuffled=stableShuffle(matchData.map((d,i)=>({text:d[0],id:i})),9),defs=stableShuffle(matchData.map((d,i)=>({text:d[1],id:i})),3);$('#matchSources').innerHTML=shuffled.map(w=>`<button type="button" draggable="true" class="match-source" data-match-word="${w.id}">${escapeHtml(w.text)}</button>`).join('');$('#matchTargets').innerHTML=defs.map(w=>`<button type="button" class="match-target" data-match-target="${w.id}">${escapeHtml(w.text)}</button>`).join('');$$('[data-match-word]').forEach(b=>{b.addEventListener('click',()=>{if(matched[b.dataset.matchWord])return;matchSelection=Number(b.dataset.matchWord);$$('.match-source').forEach(x=>x.classList.toggle('selected',x===b));$('#matchFeedback').textContent='Now choose a matching definition.'});b.addEventListener('dragstart',e=>{matchSelection=Number(b.dataset.matchWord);e.dataTransfer.setData('text/plain',b.dataset.matchWord);e.dataTransfer.effectAllowed='move'})});$$('[data-match-target]').forEach(b=>{b.addEventListener('click',()=>attemptMatch(Number(b.dataset.matchTarget)));b.addEventListener('dragover',e=>{e.preventDefault();b.classList.add('over')});b.addEventListener('dragleave',()=>b.classList.remove('over'));b.addEventListener('drop',e=>{e.preventDefault();b.classList.remove('over');const n=Number(e.dataTransfer.getData('text/plain'));if(!Number.isNaN(n))matchSelection=n;attemptMatch(Number(b.dataset.matchTarget))})});const solved=Object.keys(state.solved).filter(k=>k.startsWith('match-'));if(solved.length){$('#matchFeedback').textContent='Previous matches are saved in your progress. Complete all matches again to practise.'}}
function attemptMatch(target){if(matchSelection===null){$('#matchFeedback').textContent='Choose a word first, then its definition.';return}const source=matchSelection;const fb=$('#matchFeedback');if(source===target){matched[source]=true;const s=$(`[data-match-word="${source}"]`),t=$(`[data-match-target="${target}"]`);s?.classList.add('solved');t?.classList.add('solved');s?.setAttribute('disabled','true');t?.setAttribute('disabled','true');markSolved('match',source,$('[data-section="match"]'));fb.className='feedback good';fb.textContent=`✅ Correct! ${matchData[source][0]} = ${matchData[source][1]} (${Object.keys(matched).length}/${matchData.length})`;}else{fb.className='feedback bad';fb.textContent='❌ Not quite. Think about the definition, or click Hint.'}matchSelection=null;$$('.match-source').forEach(x=>x.classList.remove('selected'));}
$('#matchHint')?.addEventListener('click',()=>{const h=$('#matchHintArea');const n=matchSelection??matchData.findIndex((_,i)=>!matched[i]);h.hidden=false;h.textContent=n>=0?`💡 ${matchData[n][0]} means: ${matchData[n][1]}`:'Everything is matched — excellent!'});
function resetBank(section){Object.keys(state.solved).filter(k=>k.startsWith(section+'-')).forEach(k=>delete state.solved[k]);persist();renderBank(section);totalProgress();toast('↻ Section reset. You can practise again.')}
$$('.reset-section').forEach(b=>b.addEventListener('click',()=>resetBank(b.dataset.reset)));
Object.keys(banks).forEach(renderBank);totalProgress();

// Listening transcript buttons.
$$('[data-toggle-transcript]').forEach(b=>b.addEventListener('click',()=>{const el=$('#'+b.dataset.toggleTranscript),next=el.hasAttribute('hidden');if(next)el.removeAttribute('hidden');else el.setAttribute('hidden','');b.setAttribute('aria-expanded',String(next));b.textContent=next?'📜 Hide transcript':'📜 Show transcript'}));

// Interview role cards with safe Q/answer patterns and useful follow-ups.
const roles={
worker:{title:'✊ Interview a worker',intro:'Your teacher plays a worker who went on strike. Ask why, what happened and what the worker hopes for.',qs:[['Why did you go on strike?','I went on strike because I want better working conditions.'],['What did you do yesterday?','I joined the march and talked with colleagues.'],['What was the atmosphere like?','It was lively but mostly calm where I was.'],['Have you taken part in other demonstrations?','Yes, I have attended one before.'],['What are you going to do next?','I am going to follow the negotiations.']],follow:'What do you hope will change?',summary:'“You went on strike because you wanted better working conditions.”'},
student:{title:'🎓 Interview a student',intro:'Your teacher plays a student concerned about schools. Listen for reasons, needs and feelings.',qs:[['Why are students protesting?','Some students want more resources for schools.'],['What did you do yesterday?','I attended a demonstration with friends.'],['What were people saying?','They were asking for better education.'],['How did you feel?','I felt nervous at first and hopeful later.'],['What changes would you like?','I would like better support for students.']],follow:'What is the most important issue for you?',summary:'“You want more support and resources for education.”'},
shopkeeper:{title:'🛍️ Interview a shopkeeper',intro:'Your teacher plays a shopkeeper affected by the busy town centre. Show understanding of different viewpoints.',qs:[['How did the march affect your shop?','We closed early because the street was blocked.'],['Do you understand the demands?','Yes, I understand why people want higher wages.'],['Was there any damage to your shop?','No, our shop was not damaged.'],['How did you feel yesterday?','I felt concerned about our customers.'],['What do you hope happens next?','I hope people can talk peacefully.']],follow:'What would make things easier for your business?',summary:'“You understand the demands, but you worry about disruption.”'},
passenger:{title:'🚆 Interview a traveller',intro:'Your teacher plays a train passenger. Find out what happened and how they solved the problem.',qs:[['Where were you going yesterday?','I was going to visit my family.'],['What happened to your train?','My train was cancelled because of the strike.'],['How did you feel?','I felt disappointed, but I understood the situation.'],['How did you get there?','I took a bus instead.'],['What will you do next time?','I will check the timetable before travelling.']],follow:'How long was your journey?',summary:'“Your train was cancelled, so you took a bus.”'},
organiser:{title:'📣 Interview an organiser',intro:'Your teacher plays a march organiser. Ask about demands, preparations and safety.',qs:[['Why did you organise the march?','We wanted people to talk about wages and services.'],['What did people ask for?','They asked for higher wages and more resources.'],['How did you prepare the march?','We planned a route and shared information.'],['What was the atmosphere like?','In my area, it was determined and peaceful.'],['What will you do next?','We will discuss possible next steps.']],follow:'What do you want the public to understand?',summary:'“You organised the march to make people’s concerns heard.”'}
};
function renderRole(){const role=roles[$('#roleSelect').value];$('#roleCards').innerHTML=`<h3>${role.title}</h3><p class="role-intro">${escapeHtml(role.intro)}</p><div class="fine">QUESTIONS YOU CAN ASK · MODEL ANSWERS YOUR TEACHER COULD GIVE</div><ol class="role-questions">${role.qs.map(([q,a])=>`<li><b>${escapeHtml(q)}</b><small>Example answer: ${escapeHtml(a)}</small> <button type="button" class="listen-btn listen" data-say="${escapeHtml(q)}">▶ Listen</button></li>`).join('')}</ol><div class="role-model"><b>🔁 Your follow-up:</b> ${escapeHtml(role.follow)}<br><b>🗞️ Your summary:</b> ${escapeHtml(role.summary)}</div>`}
$('#roleSelect').addEventListener('change',renderRole);renderRole();

// Guided final speaking mission with ready-made subjects, models, and tense clues.
const missions={
experience:{title:'📣 Your day at the demonstration',starter:'Talk about what actually happened in your town yesterday. Use Past Simple and Past Continuous.',questions:['Where did you go?','Why did you take part?','What did you see or hear?','What were people doing?','How did you feel?'],wordbank:'joined · saw · heard · carried · banners · peaceful · lively · concerned',model:'“Yesterday, I joined a demonstration. I went because I care about public services. People were carrying signs and chanting. I felt hopeful. In my opinion, it was important to be heard.”',ask:'“Have you ever attended a demonstration?”'},
wages:{title:'💶 The cost of living',starter:'Explain why some people are worried about wages and prices. Use Present Simple for general reasons and Present Perfect for recent events.',questions:['What does cost of living mean?','Why do some people want higher wages?','What has happened over the past few weeks?','Do you agree with their concerns? Why?','What might help?'],wordbank:'wages · inflation · purchasing power · bills · demand · fair pay · because',model:'“Some people are worried about the cost of living because prices are high. There have been several protests recently. I think wages should be fair. I hope employers and unions can talk.”',ask:'“What do you think is the biggest problem?”'},
schools:{title:'🏫 Students, teachers and schools',starter:'Talk about education and explain a reason, without needing to agree with every protest.',questions:['Why are some students protesting?','What do schools need?','What have students asked for?','Why are public services important?','What is your opinion?'],wordbank:'students · teachers · education · public services · resources · budget cuts',model:'“Some students are protesting because they want more resources for education. Schools need teachers and equipment. In my opinion, education is important for everyone. I hope the situation improves.”',ask:'“Do you think education is an important issue?”'},
shop:{title:'🛍️ Peaceful protests and local shops',starter:'Describe two sides of an issue without generalising. Use but / although / in my opinion.',questions:['Why do people protest?','How might a busy march affect a shop?','What is the difference between a protest and looting?','What can you say without knowing every fact?','What would be a peaceful solution?'],wordbank:'shopkeeper · closed early · blockade · vandalism · looting · peaceful · however',model:'“People may protest because they want change. Some shops can be affected if streets are blocked. A peaceful protest is different from looting or vandalism. I understand both the right to protest and the worries of shopkeepers.”',ask:'“How would you feel if your shop had to close early?”'},
transport:{title:'🚆 When transport is disrupted',starter:'Describe a practical problem during a strike. Use Past Simple for the event and because of + noun for the cause.',questions:['Where were you going?','What happened to your train or bus?','What did you do next?','How did you feel?','What will you do if there is another disruption?'],wordbank:'cancelled · delayed · timetable · road closure · because of · take a bus',model:'“Yesterday, my train was cancelled because of the strike. I needed to visit family, so I took a bus. I was disappointed, but I arrived later. Next time, I will check the timetable.”',ask:'“Have you ever missed a train?”'},
future:{title:'🤝 What will happen next?',starter:'Give a careful opinion about the future, using plans, hopes and respectful language.',questions:['What have people been asking for?','What is the government doing?','What do you hope will happen?','Are people going to discuss the issues?','What can different groups do?'],wordbank:'negotiate · government · unions · discuss · agreement · I hope · going to',model:'“People have been asking for changes to wages and public services. I hope the different groups will continue to talk. In my opinion, peaceful discussion is important. I am going to follow the news.”',ask:'“What do you think will happen next?”'}
};
function renderMission(){const m=missions[$('#missionSelect').value];$('#missionCard').innerHTML=`<div class="mission-card-head"><div><span class="level">YOUR TOPIC CARD</span><h3>${m.title}</h3></div><button type="button" class="listen-btn listen" data-say="${escapeHtml(m.starter)}">▶ Listen to the task</button></div><p>${escapeHtml(m.starter)}</p><div class="mission-columns"><div><h4>❓ Your guided questions</h4><ol>${m.questions.map(q=>`<li>${escapeHtml(q)}</li>`).join('')}</ol></div><div><h4>🧠 Your vocabulary</h4><p>${escapeHtml(m.wordbank)}</p><h4>🎤 Your question back to the teacher</h4><p>${escapeHtml(m.ask)}</p></div></div><div class="mission-example"><b>🗣️ Visible model answer</b><p>${escapeHtml(m.model)}</p><button type="button" class="listen-btn listen" data-say="${escapeHtml(m.model.replace(/^[“]|[”]$/g,''))}">▶ Listen to the model</button></div><p class="fine">Your answer can be different. Use the model as a structure, not as a fact about your own experience.</p>`}
$('#missionSelect').addEventListener('change',renderMission);$('#missionNew').addEventListener('click',()=>{const select=$('#missionSelect');select.selectedIndex=(select.selectedIndex+1)%select.options.length;renderMission();toast('🔄 Here is another subject to practise.')});renderMission();

// Personal report builder, keeps real facts editable and does not invent the user's views.
const reportIDs=['reportParticipation','reportPlace','reportReason','reportOwnReason','reportSaw','reportAtmosphere','reportFeeling','reportOpinion'];
const trackedInputs=[...reportIDs,'freeWriting','trainerNotes','lessonUrl'];
trackedInputs.forEach(id=>{const el=$('#'+id);if(!el)return;const val=(id==='freeWriting'?state.writing:id==='trainerNotes'?state.notes:id==='lessonUrl'?state.link:state.fields[id]);if(val!==undefined&&val!==null)el.value=val;el.addEventListener('input',()=>{if(id==='freeWriting')state.writing=el.value;else if(id==='trainerNotes')state.notes=el.value;else if(id==='lessonUrl')state.link=el.value;else state.fields[id]=el.value;persist()})});
function buildReport(){const p=$('#reportParticipation').value,place=$('#reportPlace').value.trim(),reason=$('#reportReason').value==='other'?$('#reportOwnReason').value.trim():$('#reportReason').value,what=$('#reportSaw').value.trim(),atmos=$('#reportAtmosphere').value,feeling=$('#reportFeeling').value,op=$('#reportOpinion').value.trim();const action={demonstration:'I attended a demonstration',strike:'I went on strike',both:'I went on strike and attended a demonstration',observed:'I followed the news about a demonstration'}[p];const parts=[`On 5 November 2026, ${action}${place?' in '+place:''}.`];if(reason){parts.push(`I ${p==='observed'?'followed the issue':'took part'} because I care about ${reason}.`)}if(what){parts.push(`I ${p==='observed'?'read about':'saw'} ${what}.`)}else{parts.push(p==='observed'?'I learned about different views and concerns.':'I listened to people talking about their concerns.')}if(p!=='observed')parts.push(`In my experience, the atmosphere was ${atmos}.`);parts.push(`I felt ${feeling}.`);if(op)parts.push(op.replace(/[.!?]$/,'')+'.');const report=parts.join(' ');const el=$('#reportOutput');el.textContent=report;el.dataset.report=report;$('#reportFeedback').textContent='✅ Your paragraph is ready. Edit any detail that is not true, then build it again.';toast('📰 Your report is ready!')}
$('#buildReport').addEventListener('click',buildReport);
function copyText(text,feedback){if(!text?.trim()){toast('Nothing to copy yet.');return}if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(()=>{if(feedback)feedback.textContent='✅ Copied!';toast('📋 Copied to clipboard')}).catch(()=>fallbackCopy(text,feedback))}else fallbackCopy(text,feedback)}
function fallbackCopy(text,feedback){const a=document.createElement('textarea');a.value=text;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();const ok=document.execCommand('copy');a.remove();if(feedback)feedback.textContent=ok?'✅ Copied!':'Please select and copy manually.';toast(ok?'📋 Copied to clipboard':'Please copy the text manually.')}
$('#copyReport').addEventListener('click',()=>{const report=$('#reportOutput').dataset.report;if(!report){toast('Build your report before copying it.');return}copyText(report,$('#reportFeedback'))});
$('#resetReport').addEventListener('click',()=>{reportIDs.forEach(id=>{$('#'+id).selectedIndex!==undefined&&$('#'+id).tagName==='SELECT'?$('#'+id).selectedIndex=0:$('#'+id).value='';state.fields[id]=$('#'+id).value});$('#reportOutput').textContent='Fill in the form and click Build my report to see your model paragraph.';delete $('#reportOutput').dataset.report;$('#reportFeedback').textContent='';persist();toast('↻ Report fields cleared.')});
$('#copyWriting').addEventListener('click',()=>copyText($('#freeWriting').value,$('#writingFeedback')));
$('#writingModelBtn').addEventListener('click',()=>{const d=$('#writingModel');d.hidden=!d.hidden;$('#writingModelBtn').textContent=d.hidden?'👀 Show an A2+ writing model':'🙈 Hide the writing model'});
$$('.selfcheck').forEach((el,i)=>{el.checked=Boolean(state.checks[i]);el.addEventListener('change',()=>{state.checks[i]=el.checked;persist()})});
$('#copySummary').addEventListener('click',()=>{const bySection=Object.entries(banks).map(([k,v])=>`${k}: ${v.data.filter((_,i)=>state.solved[k+'-'+i]).length}/${v.data.length}`).join('; ');const s=`Lesson 14 | France in the Headlines — Strikes & Protests\nContent: news vocabulary, reasons/demands, past simple, present perfect, present continuous, past continuous, future forms, linkers, questions, listening, reading, speaking, writing.\nExercise results: ${bySection}\nCLOE speaking checklist: ${$$('.selfcheck').filter(x=>x.checked).length}/6\nSkills: reading, listening, spoken interaction, oral production, writing.\nLesson URL: ${$('#lessonUrl').value.trim()||'Not supplied'}\nTrainer notes / next steps: ${$('#trainerNotes').value.trim()||'Not supplied'}`;copyText(s,$('#summaryFeedback'))});
$('#resetAll').addEventListener('click',()=>{if(!confirm('Reset all exercise results, written answers and trainer notes for this lesson?'))return;try{localStorage.removeItem(STORAGE)}catch{}location.reload()});
// A visible helper class for keyboard-only labels; kept inline to avoid external dependency.
const util=document.createElement('style');util.textContent='.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.hide-french .fr{display:none!important}';document.head.appendChild(util);
})();
