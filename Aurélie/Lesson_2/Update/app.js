'use strict';
const $=id=>document.getElementById(id), KEY='aurelie_official_lesson_02_company_communication_v1';
const V={
'Greetings & small talk':[
['How has your week been?','Comment s’est passée votre semaine ?','A friendly question about someone’s week.','How has your week been so far?'],['It’s nice to meet you.','Enchantée.','Polite phrase when meeting someone for the first time.','It’s nice to meet you, Alex.'],['How are things on your side?','Comment ça se passe de votre côté ?','A question about a colleague’s situation.','The reporting is going well here. How are things on your side?'],['Shall we get started?','On commence ?','Friendly transition from small talk to a meeting.','Shall we get started with the latest report?'],['I’ve had a busy morning.','J’ai eu une matinée chargée.','Present perfect for experience up to now.','I’ve had a busy morning checking invoices.'],['Thanks for asking.','Merci de demander.','Polite response to personal small talk.','Everything is going well, thanks for asking.']],
'Presenting the company':[
['fleet management','gestion de flotte automobile','Managing company vehicle fleets.','We offer fleet management services.'],['mobility management','gestion de la mobilité','Support for employee business travel and mobility.','Our company provides mobility management services.'],['independent provider','prestataire indépendant','An organisation offering services independently.','We are an independent fleet management provider.'],['international clients','clients internationaux','Businesses based or operating in different countries.','We work with international clients.'],['invoice control','contrôle des factures','Verifying invoice information and amounts.','Invoice control is part of our services.'],['global reporting','reporting international / global','Combining reporting information across locations.','Global reporting gives clients a clearer overview.'],['strategic support','accompagnement stratégique','Helping businesses plan better processes.','We provide strategic support for fleet programmes.'],['We help clients to…','Nous aidons les clients à…','A client-benefit introduction.','We help clients to manage their vehicle-related processes.']],
'Teams & divisions':[
['account management','gestion des comptes clients','Managing relationships and coordination with clients.','Our account management team communicates with clients.'],['operations team','équipe opérationnelle','Team managing everyday activities.','The operations team handles daily requests.'],['reporting team','équipe reporting','Team working with data and reports.','I may contact the reporting team for support.'],['IT department','service informatique','Team managing computer systems and technical tools.','I contact IT when there is a system issue.'],['implementation','mise en place / déploiement','Introducing and organising a new service or process.','Implementation supports new client processes.'],['liaise with','échanger / se coordonner avec','Communicate and work with another party.','I liaise with colleagues from other teams.'],['the relevant department','le service concerné','The team best suited to handle the question.','I forward the request to the relevant department.']],
'Fleet lifecycle & procedures':[
['vehicle order','commande de véhicule','Initial request for a vehicle.','The process starts with a vehicle order.'],['vehicle return','restitution du véhicule','Handing back a company vehicle.','We follow the process until the vehicle return.'],['update records','mettre à jour les dossiers','Maintain accurate stored details.','I update vehicle records regularly.'],['verify the details','vérifier les informations','Make sure information is correct.','First, I verify the details.'],['follow up on','assurer le suivi de','Check progress after an initial action.','I follow up on the request with the supplier.'],['download a report','télécharger un rapport','Copy a report from a remote system to your device.','I download a report from the platform.'],['upload a document','téléverser / importer un document','Send a file from your device to a system.','I upload the updated file to the platform.'],['attach a file','joindre un fichier','Add a file to an email.','I attach the report to my email.']],
'Atmosphere & satisfaction':[
['collaborative','collaboratif','People work together.','I find the atmosphere collaborative.'],['supportive','bienveillant / solidaire','Colleagues offer help when needed.','My colleagues are supportive.'],['fast-paced','au rythme soutenu','Things move quickly.','It can be a fast-paced environment.'],['variety of tasks','diversité des tâches','Many different kinds of work.','I enjoy the variety of tasks in my role.'],['I appreciate…','J’apprécie…','Professional way to express what you like.','I appreciate working with international colleagues.'],['One challenge is…','Un défi est…','Neutral way to mention a difficulty.','One challenge is handling urgent requests.']],
'Diplomatic feedback & improvements':[
['time-consuming','chronophage','Taking a lot of time.','This step can be time-consuming.'],['Although…','Bien que…','Introduce a contrast in a sentence.','Although the process is detailed, it is useful.'],['However, …','Cependant, …','Introduce contrasting information in a new sentence.','The system is helpful. However, some steps take time.'],['It might be helpful to…','Il serait peut-être utile de…','Polite suggestion.','It might be helpful to simplify the checklist.'],['Could we…?','Pourrions-nous… ?','Polite proposal to colleagues.','Could we review this procedure together?'],['from my point of view','de mon point de vue','Introduce your own perspective.','From my point of view, clear communication is essential.']],
'Phone, email & clarification':[
['Could you clarify that?','Pourriez-vous préciser cela ?','Ask for clearer details.','Could you clarify which vehicle you mean?'],['Let me check.','Laissez-moi vérifier.','Ask for time to verify.','Let me check the latest invoice.'],['I’ll get back to you.','Je reviendrai vers vous.','Promise to follow up.','I’ll get back to you once I have the figures.'],['Could you send me…?','Pourriez-vous m’envoyer… ?','Polite request.','Could you send me the vehicle reference?'],['Please find the report attached.','Veuillez trouver le rapport en pièce jointe.','Common formal email phrase.','Please find the updated report attached.'],['Thank you for your patience.','Merci de votre patience.','Polite phrase when there has been a delay.','Thank you for your patience while I check this.']],
'Workplace adjectives':[
['supportive','bienveillant / solidaire','Ready to help and encourage others.','My colleagues are supportive when I have a question.'],['approachable','accessible / abordable','Easy to talk to.','My manager is approachable, so I can ask questions easily.'],['reliable','fiable','You can trust it or count on it.','Our reporting system is reliable.'],['rewarding','gratifiant','Giving satisfaction.','It is rewarding when a client thanks us.'],['demanding','exigeant','Needing a lot of effort or attention.','The work is demanding but interesting.'],['well-organised','bien organisé','Planned and structured clearly.','Our department is well-organised.'],['stimulating','stimulant','Interesting and full of new ideas.','I find the variety of tasks stimulating.'],['multicultural','multiculturel','With people from different cultures.','We work in a multicultural team.']],
'Linking words':[
['because','parce que','+ subject + verb.','I like my job because I work with different teams.'],['because of','à cause de','+ noun.','The report is late because of a system update.'],['although','bien que / même si','Two contrasting ideas in one sentence.','Although the work is busy, the team is friendly.'],['however','cependant','New sentence + comma.','The tool is useful. However, it is slow.'],['despite','malgré','+ noun or -ing.','Despite the delay, we sent the report on time.'],['in addition','de plus','Adds a new point.','In addition, I check the contracts.'],['as a result','en conséquence','Introduces a result.','The data was missing. As a result, I called the team.'],['such as','tel que / comme','+ examples (nouns).','We work with partners such as garages.']]
};
const Q={
smalltalkQuiz:[
['A colleague says: “How is your morning going?” Choose a natural response.',['Fine.','It’s going well, thanks. I’m updating a report. And yours?','I am fleet accounting.'],1,'Answer + a detail + a question back.'],
['Which phrase smoothly starts a meeting?',['Shall we get started?','What is your salary?','I must leave.'],0,'Use a polite transition after a friendly exchange.'],
['Which small-talk subject is generally safe at a first business meeting?',['A personal financial question','Criticising a colleague','How the journey went'],2,'A journey or travel question is often suitable.'],
['Choose the correct question.',['How your week has been?','How has your week been?','How has been your week?'],1,'Question order: how + has + subject + past participle.']],
companyQuiz:[
['FIE ___ fleet and mobility management services.',['provide','provides','providing'],1,'FIE = it, so use -s in present simple.'],
['What does “invoice control” mean?',['Checking invoices','Ordering meals','Hiring drivers'],0,'An invoice is a bill; control means checking information.'],
['Choose the correct negative.',['FIE do not manufacture cars.','FIE does not manufactures cars.','FIE does not manufacture cars.'],2,'Does not + base verb.'],
['Right now, our team ___ the latest report.',['is checking','checks always','check now'],0,'Present continuous = is/are + -ing for an action now.'],
['Which sentence explains a client benefit?',['We help clients manage fleet data.','We have many emails.','There is a desk.'],0,'Client-focused: help clients + verb.']],
teamsQuiz:[
['An account manager is someone ___ coordinates client communication.',['which','who','where'],1,'Who introduces a person.'],
['This is the system ___ stores vehicle information.',['who','where','that'],2,'That can refer to a thing.'],
['I am responsible ___ checking invoices.',['for','to','of'],0,'Responsible for + -ing.'],
['Which describes a procedure in a logical order?',['Finally, first, then','First, then, finally','Because, that, who'],1,'Use sequence markers for a process.'],
['Which is appropriately cautious about internal structures?',['Every department has the same tasks in all offices.','In my team, I usually contact the reporting department.','I know everything about every branch.'],1,'Describe your actual experience, not assumptions about the whole company.']],
opinionQuiz:[
['I enjoy the role ___ I communicate with different people.',['because','although','however'],0,'Because gives the reason.'],
['___ some procedures take time, they help us stay organised.',['Because of','Although','So'],1,'Although introduces a contrasting idea.'],
['The system is useful. ___, some steps are complex.',['However','Because','Who'],0,'However contrasts with a previous sentence.'],
['Which is the most diplomatic suggestion?',['This procedure is terrible.','You must change everything.','It might be helpful to simplify this step.'],2,'Polite suggestions help discussions remain constructive.']],
opinionStep1Quiz:[
['Choose the correct adjective position.',['The team supportive is helpful.','The supportive team is helpful.','The team is supportively.'],1,'Adjective before the noun, or after be.'],
['My colleagues are ___ .',['helpfuls','helpfully','helpful'],2,'Adjectives never take a plural -s.'],
['I check the invoices ___ .',['carefully','careful','carefuly'],0,'A verb is described by an adverb: careful + ly = carefully.'],
['My English is improving. I speak it quite ___ now.',['good','goodly','well'],2,'Irregular: good → well.'],
['I am very ___ in fleet reporting.',['interesting','interested','interest'],1,'-ed = the feeling a person has.'],
['The new reporting tool is really ___ .',['interested','interestingly','interesting'],2,'-ing = the thing that causes the feeling.'],
['He answered the client ___ .',['friendly','in a friendly way','friendlily'],1,'Friendly is already an adjective → in a friendly way.'],
['At month-end, we work very ___ .',['hardly','hard','hardy'],1,'Hard stays hard. Hardly = presque pas !'],
['Month-end can be ___ stressful.',['a bit','a little bit of','bit'],0,'A bit + (negative) adjective.'],
['Our new tool is ___ than the old one.',['more good','gooder','better'],2,'Irregular comparative: good → better → the best.']
],
opinionStep2Quiz:[
['I enjoy ___ with different departments.',['work','to work','working'],2,'Enjoy + -ing.'],
['I would like ___ my English.',['to improve','improving','improve to'],0,'Would like + to + verb.'],
['I appreciate ___ accurate information.',['to sharing','sharing','share to'],1,'Appreciate + -ing or + noun.'],
['Before FIE, I ___ in a smaller company.',['use to work','used to working','used to work'],2,'Past habit: used to + base verb.'],
['___ you use to travel for work?',['Did','Do','Were'],0,'Question: Did + subject + use to + verb (no -d).'],
['I am used to ___ with numbers every day.',['work','working','worked'],1,'Be used to + -ing = être habituée à.'],
['I prefer emails ___ phone calls.',['than','that','to'],2,'Prefer X to Y.'],
['I don’t mind ___ late at month-end.',['staying','to stay','stay'],0,'Don’t mind + -ing.']
],
opinionStep3Quiz:[
['I enjoy my role ___ I work with colleagues.',['because of','because','however'],1,'Because + subject + verb.'],
['The delay happened ___ a system issue.',['because','although','because of'],2,'Because of + noun phrase.'],
['Choose the correct sentence.',['Because of the report was late, we checked it.','Because the report was late, we checked it.','Because of it was late, we checked it.'],1,'Because + clause.'],
['The meeting was cancelled ___ the bank holiday.',['due to','because','so'],0,'Due to + noun (more formal).'],
['The invoice was incorrect, ___ I contacted the supplier.',['because','so','because of'],1,'So introduces the RESULT.'],
['___ the figures were incomplete, I called the reporting team.',['Because of','Due to','Since'],2,'Since + clause, often at the start.'],
['___ my colleagues, the problem was solved quickly.',['Because','Thanks to','So'],1,'Thanks to + noun = positive cause (grâce à).']
],
opinionStep4Quiz:[
['___ the work is busy, the team is supportive.',['Although','However','Because of'],0,'Although joins two contrasting clauses.'],
['The system is useful. ___, it can be slow.',['Although','However','Because'],1,'However starts a new sentence, + comma.'],
['Choose the correct structure.',['Although it is slow, but it is reliable.','Although it is slow, it is reliable.','However it is slow, it is reliable.'],1,'Never although + but together.'],
['___ the delay, we sent the report on time.',['Although','However','Despite'],2,'Despite + noun.'],
['The process is useful ___ a bit slow.',['but','however','despite'],0,'But links ideas in the middle of a sentence.'],
['Choose the correct sentence.',['Despite of the delay, we finished.','In spite the delay, we finished.','In spite of the delay, we finished.'],2,'Despite (no “of”) / in spite of.'],
['I check the invoices, ___ my colleague manages the contracts.',['despite','whereas','however'],1,'Whereas compares two facts.'],
['The checks take time. ___, they are essential.',['Nevertheless','Although','Despite'],0,'Nevertheless = néanmoins, + comma.']
],
opinionStep5Quiz:[
['I ___ check invoices and update records.',['also','however','therefore'],0,'Also adds another task.'],
['I am ___ responsible for updating records.',['however','also','because'],1,'Also comes after be.'],
['The data was incomplete. ___, I contacted the team.',['For example','Although','As a result'],2,'As a result introduces a consequence.'],
['Choose the correct position.',['I check also the invoices.','I also check the invoices.','I check the invoices also too.'],1,'Also before the main verb.'],
['I update records. I contact suppliers ___ .',['also','too','in addition'],1,'Too / as well go at the end.'],
['___ checking invoices, I update vehicle records.',['In addition of','In addition to','Also'],1,'In addition to + noun or -ing.'],
['I work with partners ___ leasing companies and garages.',['therefore','for example,','such as'],2,'Such as + noun (no comma after).'],
['First, I check the details. ___, I contact the team. Finally, I reply.',['Finally','Then','Firstly'],1,'Sequence: first → then → finally.']
],
opinionStep6Quiz:[
['We could ___ a checklist.',['to create','create','creates'],1,'Modal + base verb.'],
['It ___ help to review the steps.',['might','might to','mights'],0,'Might + base verb.'],
['Which is the softest suggestion?',['You must change it.','This is wrong.','Perhaps we could review it together.'],2,'Perhaps we could… is diplomatic.'],
['It would be useful ___ the steps.',['that we review','to review','reviewing to'],1,'It would be useful to + verb.'],
['Would you mind ___ me the file?',['to send','send','sending'],2,'Would you mind + -ing.'],
['___ it be possible to receive the figures today?',['Should','Would','Might'],1,'Would it be possible to…? = polite request.'],
['Choose the most polite request.',['Send me the report.','You must send the report.','I was wondering if you could send me the report.'],2,'I was wondering if you could… is very polite.'],
['I suggest ___ the checklist together.',['to review','reviewing','you to review'],1,'Suggest + -ing (or: I suggest that we review).']
],
opinionStep7Quiz:[
['We should ___ the figures first.',['to check','checking','check'],2,'Should + base verb.'],
['We ___ share unverified information.',['shouldn’t','shouldn’t to','shouldn’t sharing'],0,'Shouldn’t + base verb.'],
['Choose a natural suggestion.',['Why not to create a guide?','Why not create a guide?','Why not creating a guide?'],1,'Why not + base verb.'],
['Choose the collaborative option.',['Why don’t we review the procedure?','Why don’t we to review the procedure?','Why don’t we reviewing the procedure?'],0,'Why don’t we + base verb.'],
['How about ___ a shared calendar?',['create','to create','creating'],2,'How about + -ing.'],
['Let’s ___ the procedure next week.',['discuss','to discuss','discussing'],0,'Let’s + base verb.'],
['Which is the strongest?',['You could check it.','You must check it.','You might check it.'],1,'Must = obligation (very strong).'],
['Choose the correct advice.',['You should to double-check the totals.','You must to double-check.','You should double-check the totals.'],2,'Should + base verb.']
],
opinionStep8Quiz:[
['Which phrase introduces an opinion?',['In my opinion,','Because of me,','According me,'],0,'In my opinion is natural.'],
['Which phrase introduces an example?',['However,','For example,','Although,'],1,'For example introduces evidence.'],
['Choose a balanced professional statement.',['The process is useless.','Everything must change.','Although the checks take time, they help accuracy. Perhaps we could simplify one step.'],2,'Contrast + constructive suggestion.'],
['Choose the correct sentence.',['I am agree with you.','I agree with you.','I am agreeing with you.'],1,'Agree is a verb: I agree.'],
['Which phrase is correct?',['In my point of view,','According to me,','From my point of view,'],2,'From my point of view / In my view.'],
['Which reaction disagrees politely?',['No, you are wrong.','I see your point, but I think the checks are useful.','That is stupid.'],1,'Acknowledge, then give your view.'],
['What is the best order for a balanced answer?',['Suggestion → Opinion → Contrast','Contrast → Example → Opinion','Opinion → Reason → Example → Contrast → Suggestion'],2,'O-R-E-C-S.']
],

listeningQuiz:[
['What does the client ask you about?',['A job interview','The reporting process','A holiday request'],1,'Listen for “reporting process”.'],
['What do you do first?',['I check the information.','I send the report immediately.','I call the driver.'],0,'You say: “First, I check the information.”'],
['What do you do if necessary?',['I cancel the request.','I contact the reporting team.','I order a vehicle.'],1,'You say: “Then, if necessary, I contact the reporting team.”']],
finalQuiz:[
['Best opening when meeting an international client:',['Hey, what do you want?','Good morning, it’s a pleasure to meet you.','Give me a report.'],1,'Start warmly and politely.'],
['FIE ___ international fleet services.',['provide','provides','providing'],1,'Company = it; add -s.'],
['The reporting specialist is a person ___ works with data.',['who','which','where'],0,'Use who for people.'],
['Choose the accurate sequence:',['Then → First → Finally','First → Then → Finally','Finally → First → Then'],1,'Use logical order.'],
['Which is a constructive opinion?',['Everything is wrong.','This process is stupid.','The process works, although a checklist could save time.'],2,'Balance an observation with a suggestion.'],
['A document sent from your computer to an online platform is…',['uploaded','downloaded','returned'],0,'Upload = send from device to online service.'],
['Choose the correct polite request:',['Send me now.','Could you send me the latest figures, please?','You sending figures?'],1,'Could you + base verb, please?'],
['We are ___ the monthly invoices at the moment.',['check','checking','checks'],1,'Present continuous + -ing.']]
};
const SC=[
{title:'First meeting with an international client',prompt:'A client says: “Hello, I’m new here. What does your company do, and what is your role?”',help:['It’s a pleasure to meet you.','We provide fleet and mobility management services.','I’m responsible for checking invoices and keeping records up to date.','Would you like to know more about a particular service?'],models:['Hello. I am Aurélie. My company helps clients manage vehicles. I check invoices.','Nice to meet you. We provide fleet management services for international clients. I’m a Fleet Accountant, and I check invoices and update vehicle records.','It’s a pleasure to meet you. FIE supports international businesses with fleet and mobility management. My role focuses on invoice control and accurate vehicle records, and I regularly liaise with colleagues and suppliers. Is there a particular part of our service you’d like me to explain?']},
{title:'Welcoming a new colleague',prompt:'A new colleague asks: “Which teams do you work with, and how does a typical request move forward?”',help:['Welcome to the team.','I work closely with…','First, we check…','If necessary, I contact the relevant department.','Finally, we follow up.'],models:['Welcome. I work with colleagues and suppliers. First, I check the information. Then I answer.','Welcome! I work with colleagues across several functions. When a request arrives, I first check the vehicle details. If needed, I ask the relevant team for help, then follow up.','Welcome aboard! My role involves coordinating information between clients, suppliers and colleagues. Normally, I verify the relevant data first, liaise with the appropriate team if additional checks are required, and then provide the requester with a clear update.']},
{title:'Responding to a report request',prompt:'A colleague says: “Could you send me the latest report? The figures might need checking.”',help:['Of course.','Let me verify the latest figures first.','I’ll download the updated report.','I’ll attach it to my email.','I’ll get back to you shortly.'],models:['Yes. I will check the report and send it.','Of course. I’ll check the figures, download the latest report and attach it to my email.','Certainly. Let me verify the figures against the latest vehicle records first. Once I’ve confirmed that everything is accurate, I’ll download the current report and send it as an attachment.']},
{title:'Sharing constructive feedback',prompt:'Your manager asks: “How do you find our procedures, and is there anything you would improve?”',help:['I appreciate…','One challenge is…','Although the process works…','It might be helpful to…','From my point of view…'],models:['I like my work. Some tasks take time.','I appreciate the variety of tasks. Although the process is useful, some steps take time. Maybe we could use a simple checklist.','Overall, I appreciate the structured approach and the opportunity to work with different teams. One challenge is that certain checks can be time-consuming. It might be useful to review whether a shared checklist could make the process more efficient.']},
{title:'Small talk before a video call',prompt:'A colleague from the German office joins the call: “Hi Aurélie! Can you hear me okay? How is everything in Moselle today?”',help:['Yes, I can hear you perfectly, thanks.','It’s quite cold here today, but it’s sunny.','How about you? How is your week going?','Shall we start with the first point?'],models:['Yes, I can hear you. It is cold today. And you?','Yes, I can hear you perfectly, thanks. It’s a bit cold here, but it’s sunny. How is your week going?','Hi! Yes, the sound is perfect, thank you. It’s quite chilly in Moselle this morning, but at least the sun is out. How has your week been so far? Shall we start with the first point on the agenda?']},
{title:'A supplier invoice does not match',prompt:'A supplier calls: “Hello, we haven’t received payment for our last invoice. Could you check what is happening?”',help:['Thank you for calling. Let me check.','Could you give me the invoice number, please?','I can see that the amount doesn’t match the contract.','Could you send me a corrected invoice?','As soon as I receive it, I’ll process it.'],models:['Hello. Can you give me the invoice number? The amount is not correct. Please send a new invoice.','Thank you for calling. Could you give me the invoice number, please? I can see that the amount doesn’t match the contract. Could you send me a corrected invoice? Then I can process it.','Thank you for getting in touch. Let me check that for you — could you give me the invoice number? I can see that the amount is higher than the rate in the contract, which is why the payment is on hold. Would it be possible to send a corrected invoice? As soon as I receive it, I’ll make sure it is processed.']},
{title:'A client is unhappy with a report',prompt:'A client says: “The figures in last month’s report seem wrong. This is the second time this has happened.”',help:['I’m sorry to hear that.','I understand your concern.','Could you tell me which figures look incorrect?','I’ll check them with the reporting team.','I’ll get back to you by tomorrow.'],models:['I am sorry. Which figures are wrong? I will check and send you an answer.','I’m sorry to hear that, and I understand your concern. Could you tell me which figures look incorrect? I’ll check them with the reporting team and get back to you tomorrow.','I’m very sorry about this, and I completely understand your frustration. Could you tell me which figures seem incorrect so that I can investigate? I’ll verify them with our reporting team today, and I’ll get back to you by tomorrow with an explanation and a corrected version if necessary.']},
{title:'Explaining the vehicle return process',prompt:'A driver asks: “I’m leaving the company next month. What do I need to do with my company car?”',help:['Thank you for letting us know.','First, we need to agree on a return date.','Then, the vehicle is inspected.','Please remember to bring the keys and documents.','I’ll send you an email with all the details.'],models:['Thank you. First, we choose a date. Then we check the car. Please bring the keys and the documents.','Thank you for letting us know. First, we need to agree on a return date. Then the vehicle is inspected. Please remember to bring both keys and the documents. I’ll send you an email with the details.','Thank you for informing us in advance. The first step is to agree on a convenient return date. On that day, the vehicle will be inspected, so please make sure you bring both sets of keys and all the vehicle documents. I’ll confirm everything by email so that you have a clear checklist.']},
{title:'Team meeting: suggesting an improvement',prompt:'Your manager asks in a meeting: “Does anyone have ideas to make month-end faster?”',help:['I have a suggestion, if I may.','Perhaps we could create a shared checklist.','It might reduce repeated questions.','Why don’t we try it for one month?','We could review the results together.'],models:['I have an idea. We could use a checklist. It can help.','I have a suggestion. Perhaps we could create a shared checklist for month-end. It might reduce repeated questions. Why don’t we try it for one month?','If I may, I have one suggestion. Perhaps we could create a shared month-end checklist, because many of the same questions come up every month. It might save time for everyone. Why don’t we test it for one month and then review the results together?']},
{title:'Following up on a late answer',prompt:'You sent an email to a colleague in Germany three days ago and you have no answer. You call them.',help:['Hi, it’s Aurélie from fleet accounting.','I’m just following up on my email from Monday.','I was wondering if you had a chance to look at it.','No problem, I understand you’re busy.','Could you send me the information by Friday?'],models:['Hello, it is Aurélie. I sent you an email on Monday. Can you answer, please?','Hi, it’s Aurélie from fleet accounting. I’m just following up on my email from Monday. Did you have a chance to look at it? Could you send me the information by Friday?','Hi, it’s Aurélie from fleet accounting — I hope you’re well. I’m just following up on the email I sent on Monday about the vehicle records. I was wondering if you’d had a chance to look at it. I understand it’s a busy week; would it be possible to send me the information by Friday?']}
];
let checked={},timer=null,seconds=90,recorder=null,chunks=[],currentAudioUrl=null;
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(t){let e=$('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2600)}
function voice(){const lang=$('accent').value;const voices=speechSynthesis.getVoices();return voices.find(v=>v.lang===lang)||voices.find(v=>v.lang.startsWith(lang.slice(0,2)))||null}
function speak(t){if(!t || !('speechSynthesis' in window)){toast('Audio is not supported in this browser.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang=$('accent').value;u.rate=.86;let v=voice();if(v)u.voice=v;speechSynthesis.speak(u)}
function speakText(id){let n=$(id);if(!n)return;const t=n.value!==undefined?n.value:n.textContent;speak(t)}
function reveal(id){const e=$(id);if(e){e.hidden=!e.hidden;persist()}}
function speakDialogue(type){speak('Hi Aurélie, how has your morning been? Pretty good, thanks. I’ve been checking some reports. How about yours? Busy, but productive! Glad to hear it. Shall we look at the latest fleet figures?')}
function speakModels(type){if(type==='company')speak('We are an international fleet management company. We help companies manage their vehicles and reports. Fleets International Enterprises is an independent fleet and mobility management company based in Germany. We support international clients with vehicle management, reporting and invoice control. FIE provides independent fleet and mobility management services for international organisations. We help clients coordinate vehicle-related processes, manage information and gain a clearer view of their fleet through reporting and account management.')}
function renderQuizzes(){Object.entries(Q).forEach(([id,items])=>{let el=$(id);if(!el)return;el.innerHTML=items.map(([prompt,opts,answer,hint],i)=>`<div class="exercise-card" data-q="${id}_${i}"><p><b>${i+1}. ${esc(prompt)}</b></p><label class="small-muted">Your answer <select id="${id}_${i}" aria-label="Question ${i+1}"><option value="">Choose...</option>${opts.map((o,j)=>`<option value="${j}">${esc(o)}</option>`).join('')}</select></label><p class="feedback" id="${id}_${i}_feedback" aria-live="polite"></p><div class="button-row guided-only"><button class="secondary" type="button" onclick="showHint('${id}',${i})">Hint</button><button class="secondary" type="button" onclick="showAnswer('${id}',${i})">Check / explain</button></div><p class="hint-text" id="${id}_${i}_hint" hidden>💡 ${esc(hint)}</p></div>`).join('');el.querySelectorAll('select').forEach((sel,i)=>sel.addEventListener('change',()=>checkQuiz(id,i)))});updateScore()}
function checkQuiz(id,i){const e=$(`${id}_${i}`),f=$(`${id}_${i}_feedback`);if(e.value===''){delete checked[id+'_'+i];f.textContent='';f.className='feedback'}else{const correct=Number(e.value)===Q[id][i][2];checked[id+'_'+i]=correct;f.textContent=correct?'✓ Correct! '+Q[id][i][3]:'↻ Not quite. Try again or use a hint.';f.className='feedback '+(correct?'ok':'bad')}updateScore();persist()}
function showHint(id,i){if($('mode').value==='exam'){toast('Hints are hidden in Exam practice.');return}$(`${id}_${i}_hint`).hidden=false}
function showAnswer(id,i){if($('mode').value==='exam'){toast('Switch to Guided mode for answers.');return}let [p,opts,a,h]=Q[id][i];const f=$(`${id}_${i}_feedback`);f.textContent='Model: '+opts[a]+' — '+h;f.className='feedback ok'}
function updateScore(){const keys=Object.keys(checked),c=keys.filter(k=>checked[k]).length;$('score').textContent=`${c} correct / ${keys.length} checked`;if($('scoreDetail'))$('scoreDetail').textContent=`${c} correct out of ${keys.length} answered across lesson`;if(typeof updateMastery==='function')updateMastery()}
function resetSection(id){Q[id].forEach((q,i)=>{let e=$(`${id}_${i}`);e.value='';delete checked[id+'_'+i];let f=$(`${id}_${i}_feedback`);f.textContent='';f.className='feedback';$(`${id}_${i}_hint`).hidden=true});updateScore();persist()}
function renderVocab(){const cat=$('vocabCategory').value;$('vocabCards').innerHTML=V[cat].map(([w,fr,def,ex],i)=>`<article class="vocabcard"><h4>${esc(w)}</h4><p class="frhelp"><b>FR:</b> ${esc(fr)}</p><p>${esc(def)}</p><p><i>${esc(ex)}</i></p><button class="secondary" data-vocab-index="${i}">▶ Listen</button></article>`).join('');$('vocabCards').querySelectorAll('button').forEach(b=>b.onclick=()=>{let a=V[cat][Number(b.dataset.vocabIndex)];speak(a[0]+'. '+a[3])});applyVisibility()}
function listenCategory(){speak(V[$('vocabCategory').value].map(v=>v[0]+'. '+v[3]).join('. '))}
function renderScenario(){let s=SC[Number($('scenarioSelect').value)];$('scenarioPrompt').textContent=s.prompt;$('scenarioHelp').hidden=true;$('scenarioModels').hidden=true;$('scenarioHelp').innerHTML=s.help.map(h=>`<p>${esc(h)} <button class="secondary" data-phrase="${esc(h)}">▶</button></p>`).join('');$('scenarioHelp').querySelectorAll('button').forEach((b,i)=>b.onclick=()=>speak(s.help[i]));$('scenarioModels').innerHTML=s.models.map((m,i)=>`<article><strong>${['A2','B1','B1+'][i]}</strong><p>${esc(m)}</p><button class="secondary" data-m="${i}">▶ Listen</button></article>`).join('');$('scenarioModels').querySelectorAll('button').forEach((b,i)=>b.onclick=()=>speak(s.models[i]));applyVisibility()}
function listenScenario(){speak(SC[Number($('scenarioSelect').value)].prompt)}
function listenCheckpoint(){speak([...$('listeningText').querySelectorAll('.line')].map(p=>p.textContent).join(' '))}
function buildOpinion(){let a=$('atmosphere').value,b=$('enjoy').value,c=$('challenge').value;$('opinionOutput').textContent=`I would describe the atmosphere as ${a}. What I appreciate most is ${b}. One challenge can be ${c==='none of these — I will write my own'?'something I would like to discuss in more detail':c}. It might be helpful to discuss ways to improve the process.`;persist()}
function copyField(id){let t=$(id).value;if(!t){toast('Write your response first.');return}copyText(t)}
function copyText(t){if(navigator.clipboard?.writeText)navigator.clipboard.writeText(t).then(()=>toast('Copied!')).catch(()=>fallbackCopy(t));else fallbackCopy(t)}
function fallbackCopy(t){const e=document.createElement('textarea');e.value=t;document.body.append(e);e.select();document.execCommand('copy');e.remove();toast('Copied!')}
function startTimer(n){stopTimer();seconds=n;updateTimer();timer=setInterval(()=>{seconds--;updateTimer();if(seconds<=0){stopTimer();toast('Speaking time finished.')}},1000)}
function updateTimer(){let n=$('timerDisplay');n.textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`}
function stopTimer(){if(timer){clearInterval(timer);timer=null}}
async function toggleRecording(){if(recorder&&recorder.state==='recording'){recorder.stop();$('recordBtn').textContent='● Record speaking practice';return}if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toast('Recording requires browser support and HTTPS or localhost.');return}try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=()=>{const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});if(currentAudioUrl)URL.revokeObjectURL(currentAudioUrl);currentAudioUrl=URL.createObjectURL(blob);$('recorded').innerHTML='';let player=document.createElement('audio');player.controls=true;player.src=currentAudioUrl;$('recorded').append(player);let a=document.createElement('a');a.href=currentAudioUrl;a.download='Aurelie_Lesson02_Speaking.webm';a.textContent='Save my recording';$('recorded').append(a);stream.getTracks().forEach(t=>t.stop());$('recordStatus').textContent=' Recording ready'};recorder.start();$('recordBtn').textContent='■ Stop recording';$('recordStatus').textContent=' Recording...'}catch(e){toast('Microphone unavailable or permission denied.')}}
function collect(){const fields={};document.querySelectorAll('[data-save]').forEach((e,i)=>{fields[e.id||'check_'+i]=e.type==='checkbox'?e.checked:e.value});return {fields,checked,accent:$('accent').value,french:$('french').checked,transcript:$('transcript').checked,mode:$('mode').value,vocabCategory:$('vocabCategory').value,scenario:$('scenarioSelect').value,ui:UI}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(collect()))}catch(e){}}
function restore(obj){if(!obj||typeof obj!=='object')return;const f=obj.fields||{};document.querySelectorAll('[data-save]').forEach((e,i)=>{let k=e.id||'check_'+i;if(Object.prototype.hasOwnProperty.call(f,k)){if(e.type==='checkbox')e.checked=!!f[k];else e.value=String(f[k])}});checked={};for(let [k,v] of Object.entries(obj.checked||{})){if(/^[A-Za-z0-9]+Quiz_\d+$/.test(k)){let [id,idx]=k.split('_');if(Q[id]&&Q[id][Number(idx)]){checked[k]=!!v;let sel=$(k),answer=Q[id][Number(idx)][2];if(sel){sel.value=String(v?answer:(answer+1)%Q[id][Number(idx)][1].length);let fb=$(k+'_feedback');fb.textContent=v?'✓ Correct':'↻ Review this answer';fb.className='feedback '+(v?'ok':'bad')}}}}if(['en-GB','en-US'].includes(obj.accent))$('accent').value=obj.accent;for(let [k,id] of [['french','french'],['transcript','transcript']])if(typeof obj[k]==='boolean')$(id).checked=obj[k];if(['exam','guided'].includes(obj.mode))$('mode').value=obj.mode;if(V[obj.vocabCategory])$('vocabCategory').value=obj.vocabCategory;if(Number.isInteger(Number(obj.scenario))&&SC[Number(obj.scenario)])$('scenarioSelect').value=obj.scenario;renderVocab();renderScenario();setupFlashcards();applyVisibility();updateScore();restoreUI(obj.ui)}
function applyVisibility(){const hideFr=!$('french').checked,hideT=!$('transcript').checked,exam=$('mode').value==='exam';document.body.classList.toggle('hiddenfr',hideFr);document.body.classList.toggle('hidden-transcript',hideT);document.body.classList.toggle('hidden-model',exam);$('mode').title=exam?'Independent exam-style practice: hints and models hidden':'Guided practice: help and models available'}
function resetLesson(){if(!confirm('Reset saved answers and score for Lesson 02?'))return;localStorage.removeItem(KEY);location.reload()}
function download(name,body,type){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([body],{type}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)}
function report(){const c=Object.values(checked).filter(Boolean).length,n=Object.keys(checked).length;return `CFL WELCOME — AURÉLIE — OFFICIAL LESSON 02\nDate: ${$('lessonDate').value}\nHours: ${$('hours').value}\nLesson URL: ${$('lessonURL').value}\nObjectives: ${$('objectives').value}\nContent: Small talk; FIE company presentation; roles & divisions; working procedures; 8 mini-lessons on opinions (adjectives & adverbs, preferences & used to, reasons, contrast, connectors, polite modals, suggestions, balanced opinion); client dialogue; report email; spoken response.\nExercise types: QCM, matching, sorting and sentence-building games, flashcards, connector quick-fire, listening comprehension, sentence practice, role-play, oral presentation, short writing.\nResults: ${c}/${n} correct checked\nSkills: ${$('skills').value}\nAcquisition: ${$('acquisition').value}\nObservations: ${$('trainerNotes').value}\nNext steps: ${$('nextSteps').value}`}
function copyReport(){$('reportPreview').textContent=report();copyText(report())}
function downloadTSV(){const c=Object.values(checked).filter(Boolean).length,n=Object.keys(checked).length;const cols=['Séance','Date','Durée','Lien','Objectifs visés','Contenu abordé','Types d’exercices','Résultats','Compétences','Acquisition','Observations','Prochaines étapes'];const vals=['Aurélie / Leçon 02',$('lessonDate').value,$('hours').value,$('lessonURL').value,$('objectives').value,'Small talk, présentation FIE, équipes et procédures, opinions professionnelles, communication clients','QCM, écoute, jeu de rôle, présentation orale, rédaction',`${c}/${n} vérifiés`,$('skills').value,$('acquisition').value,$('trainerNotes').value,$('nextSteps').value];const clean=x=>String(x).replace(/[\t\r\n]+/g,' ');download('Aurelie_Lesson02_CFL_tracking.tsv','\ufeff'+cols.map(clean).join('\t')+'\n'+vals.map(clean).join('\t'),'text/tab-separated-values;charset=utf-8')}
function exportJSON(){download('Aurelie_Official_Lesson_02_Progress.json',JSON.stringify({...collect(),savedAt:new Date().toISOString()},null,2),'application/json')}
function init(){renderModules();buildSectionNav();Object.keys(V).forEach(c=>$('vocabCategory').add(new Option(c,c)));SC.forEach((s,i)=>$('scenarioSelect').add(new Option(s.title,String(i))));renderQuizzes();renderVocab();renderScenario();setupFlashcards();$('vocabCategory').addEventListener('change',()=>{renderVocab();setupFlashcards();persist()});$('scenarioSelect').addEventListener('change',()=>{renderScenario();persist()});for(let id of ['accent','french','transcript','mode'])$(id).addEventListener('change',()=>{applyVisibility();persist()});document.querySelectorAll('[data-save]').forEach(el=>el.addEventListener(el.type==='checkbox'||el.tagName==='SELECT'?'change':'input',persist));document.addEventListener('click',e=>{const b=e.target.closest('[data-say]');if(b)speak(b.dataset.say)});$('restoreFile').addEventListener('change',async e=>{let f=e.target.files[0];if(!f)return;try{restore(JSON.parse(await f.text()));persist();toast('Answers restored')}catch(err){toast('Could not read this lesson’s JSON file.')}e.target.value=''});try{let raw=localStorage.getItem(KEY);if(raw)restore(JSON.parse(raw))}catch(e){}applyVisibility();updateScore();applyView();updateMastery.ready=true}

/* ================= SECTION 05 · EIGHT MINI-LESSONS (data) ================= */
const MSTEPS=['Learn the rule','Mistakes & words','Practise & play','Use it'];
const M=[
{key:'adj',quiz:'opinionStep1Quiz',title:'Atmosphere adjectives — describing the workplace',fr:'Les adjectifs pour décrire l’ambiance et l’environnement de travail',
rules:[
['📍','Where does the adjective go?',['<b>Before a noun:</b> a <em>supportive</em> team','<b>After a linking verb:</b> be, feel, seem, look, sound, become → The team <em>seems supportive</em>.']],
['🔒','It never changes',['No plural -s: helpful colleague<b>s</b> (not helpful<b>s</b>)','No feminine form: a friendly manager / a friendly colleague']],
['🎚️','Add nuance',['<b>very, really, extremely</b> → stronger','<b>quite, rather, fairly</b> → medium','<b>a bit</b> → only with negative adjectives: a bit stressful']],
['🔄','Adjective or adverb?',['<b>Adjective</b> → describes a person or thing: a <em>careful</em> check','<b>Adverb</b> → describes HOW you do something: I check <em>carefully</em>.']]],
build:[
['a/an + adjective + noun',['We have a supportive team.','It is an international company.','I work in a fast-paced environment.']],
['subject + be / feel / seem + adjective',['The atmosphere is friendly.','The office feels calm in the morning.','My manager seems approachable.']],
['subject + be + very / quite / a bit + adjective',['The work is quite demanding.','My colleagues are really helpful.','Month-end can be a bit stressful.']],
['verb + adverb (-ly)',['I check the invoices carefully.','The team works efficiently.','We communicate regularly with suppliers.']]],
tabs:[
{label:'① Make an adverb (-ly)',intro:'Most adverbs = adjective + -ly. Watch the spelling changes.',head:['Rule','Adjective → adverb','Example'],rows:[
['Most adjectives: + ly','careful → carefully · quick → quickly · regular → regularly','I update the records regularly.'],
['-y → -ily','easy → easily · busy → busily · happy → happily','I can easily find the contract.'],
['-le → -ly','simple → simply · possible → possibly · reliable → reliably','The system works reliably.'],
['-ic → -ically','basic → basically · automatic → automatically','The report is updated automatically.'],
['-l → -lly','usual → usually · final → finally · international → internationally','We usually check the figures twice.'],
['-e stays (except true, due)','polite → politely · complete → completely · true → truly','I answered the client politely.']]},
{label:'② Irregular adverbs',intro:'These do NOT follow the -ly rule. Learn them by heart.',head:['Adjective','Adverb','Example'],rows:[
['good','well','I speak English well.'],
['fast','fast (not fastly)','The team reacts fast.'],
['hard','hard (hardly = presque pas !)','We work hard at month-end.'],
['late','late (lately = récemment)','The supplier paid late.'],
['early','early','I start early on Mondays.'],
['daily / weekly / monthly','daily / weekly / monthly','We send the report monthly.']]},
{label:'③ Tricky -ly adjectives',intro:'These end in -ly but they are ADJECTIVES. To describe an action, use “in a … way”.',head:['Adjective','How to use it with a verb','Example'],rows:[
['friendly','in a friendly way','He answered in a friendly way.'],
['lively','in a lively way','The meeting was lively.'],
['lovely','—','It is a lovely office.'],
['costly','in a costly way','This error was costly.'],
['timely','in a timely manner','Please reply in a timely manner.'],
['likely','probably','A delay is likely this week.']]},
{label:'④ Build adjectives (suffixes)',intro:'Many workplace adjectives come from a noun or a verb + a suffix.',head:['Suffix','Word → adjective','Example'],rows:[
['-ful','help → helpful · use → useful · stress → stressful','The IT team is helpful.'],
['-ive','support → supportive · collaborate → collaborative','We have a collaborative approach.'],
['-able / -ible','rely → reliable · manage → manageable · flex → flexible','The workload is manageable.'],
['-al','profession → professional · nation → international','It is a professional environment.'],
['-ous','vary → various · ambition → ambitious','I have various responsibilities.'],
['un- / in- / dis-','helpful → unhelpful · efficient → inefficient · organised → disorganised','This step is a bit inefficient.']]},
{label:'⑤ -ing or -ed?',intro:'-ING = the thing that causes the feeling. -ED = how a person feels.',head:['-ing (the cause)','-ed (the feeling)','Example'],rows:[
['interesting','interested','The project is interesting. I am interested in it.'],
['motivating','motivated','Clear goals are motivating. I feel motivated.'],
['tiring','tired','Month-end is tiring. I am tired on Friday.'],
['confusing','confused','The new form is confusing. Drivers are confused.'],
['satisfying','satisfied','The result is satisfying. The client is satisfied.']]},
{label:'⑥ Irregular comparatives',intro:'To compare, most short adjectives add -er / the -est, long ones use more / the most. These are irregular:',head:['Adjective','Comparative · superlative','Example'],rows:[
['good','better · the best','The new tool is better than the old one.'],
['bad','worse · the worst','Monday is the worst day for traffic.'],
['far','further · the furthest','Our German office is further away.'],
['little','less · the least','This step takes less time now.'],
['much / many','more · the most','We have more invoices in December.']]}],
mistakes:[
['The team supportive is great.','The team is supportive. / The supportive team…','Adjective before the noun or after be.'],
['My colleagues are helpfuls.','My colleagues are helpful.','No plural -s on adjectives.'],
['I work very good with numbers.','I work very well with numbers.','A verb needs an adverb: good → well.'],
['I am very interesting in reporting.','I am very interested in reporting.','-ed = a person’s feeling.'],
['He answered friendly.','He answered in a friendly way.','Friendly is an adjective, not an adverb.'],
['I work hardly.','I work hard.','Hardly = presque pas.']],
vocab:[
['supportive','bienveillant / solidaire','My colleagues are supportive when I have a question.'],['collaborative','collaboratif','We have a collaborative approach to reporting.'],['welcoming','accueillant','The team was very welcoming when I arrived.'],['approachable','accessible, abordable','My manager is approachable, so I can ask questions easily.'],['helpful','serviable','The IT team is always helpful.'],['respectful','respectueux','The atmosphere is respectful and professional.'],['well-organised','bien organisé','Our department is well-organised.'],['structured','structuré','We follow a structured process for invoices.'],['efficient','efficace','The new tool makes us more efficient.'],['reliable','fiable','Our reporting system is reliable.'],['flexible','flexible, souple','My schedule is quite flexible.'],['dynamic','dynamique','It is a dynamic, international environment.'],['multicultural','multiculturel','We work in a multicultural team.'],['fast-paced','au rythme soutenu','Month-end is a fast-paced period.'],['demanding','exigeant','The work is demanding but interesting.'],['rewarding','gratifiant','It is rewarding when a client thanks us.'],['stimulating','stimulant','I find the variety of tasks stimulating.'],['challenging','qui représente un défi','Some requests are challenging.'],['stressful','stressant','Deadlines can be a bit stressful.'],['calm','calme','The office is calm early in the morning.'],['open-minded','ouvert d’esprit','My colleagues are open-minded and curious.'],['motivating','motivant','Clear objectives are motivating.']],
examples:[
['The atmosphere is friendly and professional.','L’ambiance est conviviale et professionnelle.'],
['We work in a fast-paced, international environment.','Nous travaillons dans un environnement international au rythme soutenu.'],
['My colleagues are really helpful when I need to check an invoice.','Mes collègues sont vraiment serviables quand je dois vérifier une facture.'],
['The office feels quite calm early in the morning.','Le bureau est assez calme tôt le matin.'],
['Month-end can be a bit stressful, but the team stays positive.','La fin de mois peut être un peu stressante, mais l’équipe reste positive.'],
['I check the vehicle records carefully and regularly.','Je vérifie les dossiers véhicules avec soin et régulièrement.'],
['Our manager communicates clearly and is very approachable.','Notre responsable communique clairement et est très accessible.']],
game:{type:'match',title:'🧩 Match the adjectives · English ↔ Français',from:'vocab'},
task:{intro:'Describe your work environment in 3–4 sentences. Use at least <b>two adjectives</b>, <b>one intensifier</b> (very, quite, a bit) and <b>one adverb</b> (-ly or irregular).',prompts:['How would you describe the atmosphere?','What are your colleagues like?','How is your workload at month-end?','How do you work? (carefully, efficiently, well…)'],fr:'Décrivez votre environnement de travail : ambiance, collègues, charge de travail, façon de travailler.',ph:'The atmosphere in my team is… My colleagues are… Month-end can be… I usually work…',
models:[['The atmosphere in my team is friendly and quite relaxed.','My colleagues are helpful and approachable.','Month-end can be a bit stressful, but I organise my tasks carefully.'],
['I would describe the atmosphere as collaborative and genuinely supportive.','My colleagues are approachable, so I can easily ask for clarification.','Month-end is fast-paced and sometimes demanding, yet I find the variety of tasks stimulating.','I always try to check the records carefully and work efficiently.']]}},

{key:'pref',quiz:'opinionStep2Quiz',title:'Talking about preferences — enjoy, like, would like, used to',fr:'Exprimer ses goûts, ses souhaits et ses anciennes habitudes',
rules:[
['❤️','What you like NOW',['<b>enjoy / like / love / appreciate / don’t mind</b> + noun or verb-<b>ing</b>','I enjoy <em>working</em> with clients. I appreciate <em>the variety</em>.']],
['🌟','A wish or a desire',['<b>would like / would love / would prefer</b> + <b>to</b> + base verb','= je voudrais / j’aimerais → I would like <em>to improve</em> my English.']],
['⏳','A past habit (finished)',['<b>used to</b> + base verb = avant, je… / j’avais l’habitude de…','Negative: I <b>didn’t use to</b>… · Question: <b>Did</b> you <b>use to</b>…?']],
['🔁','Don’t confuse!',['<b>be used to + -ing</b> = être habitué(e) à (today)','<b>get used to + -ing</b> = s’habituer à → I’m getting used to <em>speaking</em> English.']],
['⚖️','Comparing two things',['<b>prefer</b> X <b>to</b> Y','I prefer <em>emails</em> to <em>phone calls</em>.']]],
build:[
['subject + enjoy / like / love + verb-ing',['I enjoy working with international colleagues.','I like checking the details.','I love solving problems.']],
['subject + appreciate + noun',['I appreciate the variety of tasks.','I appreciate clear instructions.']],
['subject + would like / ’d love + to + verb',['I would like to improve my spoken English.','I’d love to visit our German office.']],
['subject + used to + base verb',['I used to work in a smaller company.','I didn’t use to speak English at work.','Did you use to travel for work?']],
['subject + be used to + verb-ing',['I am used to working with deadlines.','I’m getting used to speaking English in meetings.']]],
mistakes:[
['I enjoy to work with clients.','I enjoy working with clients.','Enjoy + -ing.'],
['I would like improve my English.','I would like to improve my English.','Would like + to + verb.'],
['Before, I use to work in Metz.','Before, I used to work in Metz.','Past: used to (with -d).'],
['Did you used to travel?','Did you use to travel?','After did → use to (no -d).'],
['I am used to work late.','I am used to working late.','Be used to + -ing.'],
['I like very much my job.','I really like my job. / I like my job very much.','Never put “very much” between the verb and its object.']],
vocab:[
['I enjoy…','J’aime / Je prends plaisir à…','I enjoy coordinating information between teams.'],['I really like…','J’aime beaucoup…','I really like the international side of my job.'],['I love…','J’adore…','I love solving tricky invoice problems.'],['I appreciate…','J’apprécie…','I appreciate the support of my colleagues.'],['I don’t mind…','Ça ne me dérange pas de…','I don’t mind working late at month-end.'],['I’m keen on…','J’aime bien / Je tiens à…','I’m keen on learning new tools.'],['I’m not a big fan of…','Je ne suis pas fan de… (diplomate)','I’m not a big fan of long meetings.'],['I prefer X to Y','Je préfère X à Y','I prefer emails to phone calls for numbers.'],['What I like most is…','Ce que j’aime le plus, c’est…','What I like most is the variety of my tasks.'],['I find it rewarding to…','Je trouve gratifiant de…','I find it rewarding to solve a client’s problem.'],['I would like to… / I’d like to…','Je voudrais / J’aimerais…','I’d like to feel more confident on the phone.'],['I’d love to…','J’adorerais…','I’d love to meet our colleagues in Germany.'],['I used to…','Avant, je… / J’avais l’habitude de…','I used to work in a smaller team.'],['I’m used to…','Je suis habituée à…','I’m used to working with numbers.']],
examples:[
['I enjoy working with colleagues from different countries.','J’aime travailler avec des collègues de différents pays.'],
['What I like most is the variety of my tasks.','Ce que j’aime le plus, c’est la diversité de mes tâches.'],
['I don’t mind working late at month-end.','Ça ne me dérange pas de rester tard en fin de mois.'],
['I prefer checking invoices in the morning to doing it late in the day.','Je préfère vérifier les factures le matin plutôt qu’en fin de journée.'],
['I used to work in a smaller team; now everything is more international.','Avant, je travaillais dans une petite équipe ; maintenant tout est plus international.'],
['I would like to feel more confident during calls in English.','J’aimerais être plus à l’aise pendant les appels en anglais.'],
['I’m used to working with numbers and deadlines.','Je suis habituée à travailler avec des chiffres et des délais.']],
game:{type:'sort',title:'🗂️ Sort it! Which form comes next?',intro:'Click a word, then click the correct box.',bins:['+ verb-ING','+ TO + verb','+ base verb'],items:[['enjoy',0],['appreciate',0],['don’t mind',0],['be used to',0],['how about',0],['would like',1],['would love',1],['want',1],['hope',1],['used to',2],['should',2],['could',2],['let’s',2],['why not',2]]},
task:{intro:'Write 4–5 sentences about you. Use <b>enjoy / appreciate</b>, <b>used to</b>, <b>be used to</b> and <b>would like to</b>.',prompts:['Something you enjoy at work','Something you appreciate','Something you used to do before (another job, another team)','Something you are used to now','Something you would like to do or improve'],fr:'Parlez de ce que vous aimez, de vos anciennes habitudes et de vos souhaits.',ph:'I enjoy… I appreciate… I used to… Now I’m used to… I would like to…',
models:[['I enjoy working with numbers and I appreciate my helpful colleagues.','I used to work in a smaller company.','Now I am used to working with international clients.','I would like to improve my English for phone calls.'],
['What I enjoy most is coordinating information between different teams.','I particularly appreciate the variety of my responsibilities.','I used to work in a more local environment, so I wasn’t used to speaking English every week.','Now I’m getting used to it, and I’d like to feel completely comfortable during calls with international clients.']]}},

{key:'reason',quiz:'opinionStep3Quiz',title:'Giving a reason — because, because of, due to, since, so',fr:'Donner une raison… et une conséquence',
rules:[
['💬','because + full sentence',['<b>because</b> + subject + verb = parce que','I like my job <em>because I work</em> with different teams.']],
['📦','because of / due to + noun',['<b>because of</b> = à cause de · <b>due to</b> = en raison de (more formal, emails)','The report is late <em>because of a system issue</em>.']],
['🧭','since / as at the start',['<b>Since / As</b> + clause = puisque / comme','Often for a reason the listener already knows.']],
['➡️','so / that’s why = the RESULT',['<b>so</b> = donc · <b>that’s why</b> = c’est pour ça que','Reason first, then the result: It was wrong, <em>so</em> I called.']],
['🌟','thanks to = a positive cause',['<b>thanks to</b> + noun = grâce à','Thanks to my colleagues, I learned quickly.']]],
build:[
['result + because + subject + verb',['I like my job because I work with different teams.','I check every line because accuracy is important.']],
['result + because of / due to + noun',['The report is late because of a system update.','The meeting was moved due to the bank holiday.']],
['Since / As + reason, + result',['Since the figures were incomplete, I contacted the reporting team.','As it is month-end, we are very busy.']],
['reason, + so + result',['The invoice was incorrect, so I contacted the supplier.','Accuracy matters. That’s why I check every detail.']]],
mistakes:[
['…because of the system was slow.','…because the system was slow. / …because of the slow system.','Because of + noun only.'],
['I check it because of accuracy is important.','I check it because accuracy is important.','A full sentence follows because.'],
['Because I was busy. (alone)','I replied late because I was busy.','In writing, a because-clause needs a main clause.'],
['…due to the supplier sent it late.','…due to a late delivery from the supplier.','Due to + noun.'],
['I was busy, because I answered late.','I was busy, so I answered late.','So = result; because = reason.']],
vocab:[
['because','parce que','I enjoy my job because it is varied.'],['because of','à cause de','We were late because of the traffic.'],['due to','en raison de (formel)','The delay is due to a technical problem.'],['owing to','en raison de (très formel)','Owing to the strike, deliveries are delayed.'],['since','puisque / étant donné que','Since you need it today, I’ll send it now.'],['as','comme / puisque','As the client is waiting, let’s start.'],['so','donc','It was urgent, so I called the supplier.'],['that’s why','c’est pour ça que','Accuracy is key. That’s why I double-check.'],['the reason is that…','la raison est que…','The reason is that the contract changed.'],['this is because…','c’est parce que…','This is because the data was incomplete.'],['thanks to','grâce à','Thanks to the new tool, we save time.'],['as a result of','à la suite de','As a result of the update, the figures changed.']],
examples:[
['I appreciate the process because it helps us avoid errors.','J’apprécie la procédure parce qu’elle nous aide à éviter les erreurs.'],
['The report was delayed because of a system update.','Le rapport a été retardé à cause d’une mise à jour du système.'],
['Due to the number of invoices, the checks take more time at month-end.','En raison du nombre de factures, les vérifications prennent plus de temps en fin de mois.'],
['Since the client needed the figures quickly, I sent them first.','Comme le client avait besoin des chiffres rapidement, je les ai envoyés en premier.'],
['The vehicle details were missing, so I contacted the driver.','Les informations du véhicule manquaient, donc j’ai contacté le conducteur.'],
['Thanks to my colleagues, I solved the problem quickly.','Grâce à mes collègues, j’ai résolu le problème rapidement.']],
game:{type:'sort',title:'🗂️ Because or because of?',intro:'Which connector fits before each phrase? Click a phrase, then click a box.',bins:['because + subject + verb','because of / due to + noun'],items:[['the system is slow',0],['a system update',1],['the supplier sent it late',0],['the bank holiday',1],['we had many invoices',0],['the number of invoices',1],['my colleague was absent',0],['my colleague’s absence',1]]},
task:{intro:'Give <b>three reasons</b> about your job. Use <b>because</b>, <b>because of / due to</b> and <b>so</b> (or that’s why).',prompts:['Why do you like your job?','Why can a task sometimes be late or difficult?','Why is a check or a procedure important? What is the result?'],fr:'Donnez trois raisons : pourquoi vous aimez votre travail, pourquoi une tâche est parfois difficile, pourquoi une procédure est importante.',ph:'I like my job because… Sometimes… is late because of… Accuracy is important, so…',
models:[['I like my job because I work with different people.','Sometimes the reports are late because of system problems.','Accuracy is important, so I check every invoice.'],
['I enjoy my role because it combines numbers and communication.','Occasionally, reports are delayed due to technical updates, which can be frustrating.','Since our clients rely on accurate data, I always double-check the figures — that’s why the process takes a little longer at month-end.']]}},

{key:'contrast',quiz:'opinionStep4Quiz',title:'Showing contrast — although, however, but, despite, whereas',fr:'Exprimer une opposition ou une nuance',
rules:[
['🔗','although / even though',['+ subject + verb → ONE sentence = bien que / même si','<b>Even though</b> is stronger. Comma after the first clause if it starts the sentence.']],
['🛑','however,',['Starts a NEW sentence = cependant / toutefois','Full stop (or ;) before, <b>comma after</b>.']],
['➖','but',['The simplest link, in the middle of a sentence = mais','It is useful, <em>but</em> slow.']],
['🧱','despite / in spite of',['+ noun or verb-ing = malgré','<b>Never</b> + subject + verb. Never “despite <s>of</s>”.']],
['⚖️','whereas / while',['Compare two different facts = alors que / tandis que','I check invoices, <em>whereas</em> my colleague manages contracts.']]],
build:[
['Although + clause, main clause',['Although the process is detailed, it is useful.','Even though I was busy, I answered the client.']],
['Sentence. However, + sentence.',['The system is reliable. However, some steps are slow.','The tool is new. However, it is easy to use.']],
['clause + but + clause',['The work is demanding, but the team is supportive.']],
['Despite / In spite of + noun or -ing, main clause',['Despite the delay, we sent the report on time.','In spite of being busy, I answered the client.']],
['fact A, whereas + fact B',['I prefer emails, whereas my manager prefers calls.']]],
mistakes:[
['Although it is slow, but it is reliable.','Although it is slow, it is reliable.','One connector per contrast.'],
['The tool is useful. However it is slow.','The tool is useful. However, it is slow.','Comma after however.'],
['Despite of the delay…','Despite the delay… / In spite of the delay…','No “of” after despite.'],
['Despite the system is slow…','Although the system is slow… / Despite the slow system…','Despite + noun, not a clause.'],
['Even if I was busy, I answered.','Even though I was busy, I answered.','Even if = hypothetical; even though = real fact.']],
vocab:[
['although','bien que / même si','Although it was late, I finished the report.'],['even though','même si (plus fort)','Even though it is complex, I enjoy it.'],['though (at the end)','pourtant (oral)','It’s a bit slow, though.'],['however','cependant / toutefois','The tool is useful. However, it crashes sometimes.'],['but','mais','It’s busy but interesting.'],['despite','malgré','Despite the pressure, the team stays calm.'],['in spite of','malgré','In spite of the delay, we met the deadline.'],['nevertheless','néanmoins','The checks are long. Nevertheless, they are necessary.'],['whereas','alors que / tandis que','I work in Moselle, whereas my manager is in Germany.'],['while','tandis que','While some tasks are routine, others are challenging.'],['on the other hand','d’un autre côté','On the other hand, it saves time later.'],['yet','pourtant / et pourtant','The task is simple, yet it takes time.']],
examples:[
['Although our work is sometimes demanding, the team is supportive.','Bien que notre travail soit parfois exigeant, l’équipe est solidaire.'],
['The reporting system is reliable. However, some steps could be simpler.','Le système de reporting est fiable. Cependant, certaines étapes pourraient être plus simples.'],
['Despite the volume of invoices, we meet our deadlines.','Malgré le volume de factures, nous respectons nos délais.'],
['I prefer emails for figures, whereas my colleague prefers phone calls.','Je préfère les e-mails pour les chiffres, alors que ma collègue préfère le téléphone.'],
['The checks take time. Nevertheless, they protect our accuracy.','Les vérifications prennent du temps. Néanmoins, elles garantissent notre précision.']],
game:{type:'scramble',title:'🧱 Sentence builder · put the pieces in order',items:[
[['Although','the work','is demanding,','the team','is supportive.'],'Bien que le travail soit exigeant, l’équipe est solidaire.'],
[['The system','is reliable.','However,','some steps','are slow.'],'Le système est fiable. Cependant, certaines étapes sont lentes.'],
[['Despite','the delay,','we sent','the report','on time.'],'Malgré le retard, nous avons envoyé le rapport à temps.'],
[['I check','the invoices,','whereas','my colleague','manages','the contracts.'],'Je vérifie les factures, alors que ma collègue gère les contrats.'],
[['Even though','I was busy,','I answered','the client','quickly.'],'Même si j’étais occupée, j’ai répondu rapidement au client.']]},
task:{intro:'Write <b>three balanced sentences</b>: something positive + a challenge. Use <b>although</b>, <b>however</b> and <b>despite</b> (or whereas).',prompts:['Your workload vs. the atmosphere','A tool or system: one advantage, one limit','A difficulty you manage despite everything'],fr:'Écrivez trois phrases équilibrées : un point positif + une difficulté.',ph:'Although… , … / … . However, … / Despite…, …',
models:[['Although the work is busy, my team is friendly.','The reporting tool is useful. However, it is sometimes slow.','Despite the deadlines, we stay positive.'],
['Although month-end can be quite demanding, the atmosphere remains supportive.','Our reporting system is generally reliable; however, some steps could be simpler.','Despite the volume of invoices, we manage to meet our deadlines, whereas in my previous job this was more difficult.']]}},

{key:'add',quiz:'opinionStep5Quiz',title:'Adding ideas, examples and sequencing — also, in addition, for example, then',fr:'Ajouter une idée, donner un exemple, une conséquence, un ordre',
rules:[
['➕','ADD an idea',['<b>also</b> → before the main verb, after be','<b>too / as well</b> → at the end','<b>In addition, / Furthermore, / Moreover,</b> → at the start (more formal)']],
['🔍','Give an EXAMPLE',['<b>For example, / For instance,</b> + full sentence','<b>such as</b> + nouns (no comma after): partners such as garages']],
['➡️','Give a CONSEQUENCE',['<b>so</b> (simple) · <b>therefore / as a result / consequently</b> (formal)','= donc / par conséquent']],
['🔢','Put steps in ORDER',['<b>First → Then / Next → After that → Finally</b>','<b>Once</b> + clause = une fois que: Once I have checked, I send it.']]],
build:[
['subject + also + verb · be + also',['I also update vehicle records.','I am also responsible for supplier contacts.']],
['sentence + too / as well',['I contact suppliers too.','I check the contracts as well.']],
['In addition, + sentence · In addition to + noun / -ing',['In addition, I communicate with other departments.','In addition to checking invoices, I update records.']],
['For example, + sentence · such as + nouns',['For example, I compare the mileage on the invoice.','We work with partners such as leasing companies and garages.']],
['First… Then… After that… Finally…',['First, I check the details. Then I compare the records.','After that, I contact the supplier. Finally, I update the file.']]],
mistakes:[
['I check also the invoices.','I also check the invoices.','Also before the main verb.'],
['In addition of my tasks…','In addition to my tasks…','In addition TO + noun.'],
['…partners such as, garages.','…partners such as garages.','No comma after such as.'],
['At the end, I send the report.','Finally, I send the report.','Finally = last step; at the end (of) = at the end of a period.'],
['I also check the contracts too.','I also check the contracts. / I check the contracts too.','Choose one: also OR too.']],
vocab:[
['also','aussi / également','I also handle supplier questions.'],['too / as well','aussi (en fin de phrase)','I speak German a little too.'],['in addition','de plus','In addition, I prepare monthly reports.'],['in addition to','en plus de','In addition to invoices, I check contracts.'],['furthermore','en outre','Furthermore, the tool saves time.'],['moreover','de surcroît','Moreover, it reduces errors.'],['for example / for instance','par exemple','For instance, I check the rental dates.'],['such as','tel que / comme','Costs such as fuel and tolls.'],['in particular','en particulier','I enjoy the reporting part in particular.'],['therefore','par conséquent','The data was complete; therefore, I sent it.'],['as a result','en conséquence','As a result, the client received it on time.'],['first / then / next','d’abord / ensuite / puis','First, I check. Then, I compare.'],['after that','après cela','After that, I contact the supplier.'],['once','une fois que','Once it is verified, I send it.'],['finally','enfin / pour finir','Finally, I update the system.']],
examples:[
['First, I check the invoice details. Then I compare them with the vehicle records.','D’abord, je vérifie les détails de la facture. Ensuite, je les compare aux dossiers véhicules.'],
['I also contact the supplier if something is missing.','Je contacte aussi le fournisseur s’il manque quelque chose.'],
['In addition, I communicate with other departments.','De plus, je communique avec d’autres services.'],
['For example, I contact the reporting team when figures need clarification.','Par exemple, je contacte l’équipe reporting quand des chiffres doivent être clarifiés.'],
['The data was incomplete. As a result, I contacted the team.','Les données étaient incomplètes. En conséquence, j’ai contacté l’équipe.'],
['Once everything is verified, I send the report.','Une fois que tout est vérifié, j’envoie le rapport.']],
game:{type:'quickfire',title:'⚡ Connector quick-fire · 10 questions, build your streak!'},
task:{intro:'Describe a typical request <b>from start to finish</b> (4–6 sentences). Use <b>first / then / finally</b>, <b>also or in addition</b>, <b>for example</b> and <b>as a result</b>.',prompts:['What do you do first when an invoice or request arrives?','What do you do next?','Give one example of a check.','What is the result? What do you do at the end?'],fr:'Décrivez une demande typique du début à la fin.',ph:'First, I… Then… I also… For example,… As a result,… Finally,…',
models:[['First, I check the invoice.','Then I compare it with the vehicle records.','I also contact the supplier if there is a problem. For example, the mileage can be wrong.','Finally, I update the file.'],
['When an invoice arrives, I first verify the details against the vehicle records.','In addition, I check that the contract conditions are respected. For example, I compare the mileage and the rental period.','If something is missing, I contact the supplier; as a result, the records stay accurate.','Finally, I update the system and inform the relevant colleagues.']]}},

{key:'modal',quiz:'opinionStep6Quiz',title:'Polite possibilities — could, might, would, may',fr:'Suggérer et demander poliment avec les modaux',
rules:[
['💡','could = a suggestion',['<b>could</b> + base verb = on pourrait','We could create a checklist.']],
['🤔','might / may = a possibility',['<b>might / may</b> + base verb = ça pourrait…','It might help new colleagues. (may = more formal)']],
['🎩','would = extra polite',['It <b>would</b> be useful <b>to</b>… · <b>Would</b> it be possible <b>to</b>…?','<b>Would you mind</b> + -ing? · I <b>would suggest</b> + -ing']],
['🪶','Softeners',['<b>perhaps, maybe, possibly</b>','<b>I was wondering if</b> we could… (very polite)']],
['🔒','The modal rule',['Modal + <b>base verb</b>: no “to”, no -s, no -ing','could <s>to</s> create · it might<s>s</s> help']]],
build:[
['subject + could + base verb',['We could create a shared checklist.','Perhaps we could review the steps together.']],
['subject + might / may + base verb',['It might reduce repeated questions.','This may take a little longer.']],
['It would be + adjective + to + verb',['It would be useful to review the procedure.','It would be helpful to have one contact person.']],
['Would it be possible to / Would you mind + -ing…?',['Would it be possible to receive the figures by Friday?','Would you mind sending me the file again?']]],
mistakes:[
['We could to create a guide.','We could create a guide.','Modal + base verb, no “to”.'],
['It mights help.','It might help.','No -s on modals.'],
['It would be useful that we review…','It would be useful to review…','It would be + adjective + to + verb.'],
['Would you mind to send it?','Would you mind sending it?','Would you mind + -ing.'],
['I suggest you to check.','I suggest checking. / I suggest that you check.','Suggest + -ing or that-clause.']],
vocab:[
['we could…','nous pourrions…','We could share the template.'],['it might help to…','ça pourrait aider de…','It might help to set a deadline.'],['it may…','il se peut que…','It may take two days.'],['it would be useful to…','il serait utile de…','It would be useful to update the guide.'],['would it be possible to…?','serait-il possible de… ?','Would it be possible to move the meeting?'],['would you mind + -ing?','cela vous dérangerait-il de… ?','Would you mind checking this figure?'],['I would suggest + -ing','je suggérerais de…','I would suggest testing it first.'],['perhaps / maybe','peut-être','Perhaps we could start earlier.'],['possibly','éventuellement','We could possibly automate it.'],['I was wondering if…','je me demandais si…','I was wondering if you could help me.'],['one option would be to…','une option serait de…','One option would be to use a shared folder.']],
examples:[
['Perhaps we could review the invoice checklist together.','Peut-être pourrions-nous revoir ensemble la check-list des factures.'],
['That might reduce repeated checks.','Cela pourrait réduire les vérifications répétées.'],
['It would be helpful to have one contact person per supplier.','Il serait utile d’avoir un seul contact par fournisseur.'],
['Would it be possible to receive the figures by Friday?','Serait-il possible de recevoir les chiffres d’ici vendredi ?'],
['I was wondering if you could send me the updated file.','Je me demandais si vous pourriez m’envoyer le fichier mis à jour.']],
game:{type:'scramble',order:true,title:'🪜 Politeness ladder · from most DIRECT to most POLITE',items:[
[['Send me the file.','Can you send me the file?','Could you send me the file, please?','Would you mind sending me the file?','I was wondering if you could send me the file.'],'Du plus direct au plus poli.'],
[['Change the process.','We should change the process.','We could change the process.','Perhaps we could look at the process.','It might be worth reviewing the process together.'],'Du plus direct au plus diplomate.']]},
task:{intro:'Suggest <b>three polite improvements</b> for your team. Use <b>could</b>, <b>might</b> and <b>would</b> (+ a softener: perhaps, maybe…).',prompts:['An idea to save time at month-end','A possible result of your idea','A polite request to your manager or a colleague'],fr:'Proposez trois améliorations polies pour votre équipe.',ph:'Perhaps we could… It might… Would it be possible to…?',
models:[['We could use a checklist for month-end.','It might help new colleagues.','It would be useful to have a shared calendar.'],
['Perhaps we could create a shared checklist for the month-end checks, as it might reduce repeated questions.','It would also be helpful to centralise supplier contacts in one place.','Would it be possible to discuss these ideas at our next team meeting?']]}},

{key:'should',quiz:'opinionStep7Quiz',title:'Making suggestions — should, why don’t we, how about, let’s',fr:'Conseiller et proposer des idées en réunion',
rules:[
['👉','should / shouldn’t',['+ base verb = devrait / ne devrait pas → advice','We should check the figures first.']],
['🤝','Collaborative',['<b>Why don’t we</b> + base verb? · <b>Let’s</b> + base verb','= Pourquoi ne pas… ensemble ? / Faisons…']],
['😊','Friendly & informal',['<b>Why not</b> + base verb? · <b>How about / What about</b> + -ing?','How about <em>testing</em> it for a month?']],
['📊','How strong is it?',['<b>must / have to</b> → obligation (very strong)','<b>should</b> → advice · <b>could</b> → option · <b>might</b> → possibility']]],
build:[
['subject + should / shouldn’t + base verb',['We should check the figures before sending them.','We shouldn’t share unverified information.']],
['Why don’t we + base verb? · Let’s + base verb',['Why don’t we review the steps together?','Let’s discuss it at the next meeting.']],
['Why not + base verb?',['Why not create a shared guide?']],
['How about / What about + -ing?',['How about having a short meeting every Monday?','What about adding a column for the supplier?']]],
mistakes:[
['We should to check.','We should check.','No “to” after should.'],
['Why not to create a guide?','Why not create a guide?','Why not + base verb.'],
['How about to check?','How about checking?','How about + -ing.'],
['Let’s to start.','Let’s start.','Let’s + base verb.'],
['You must change this procedure!','Perhaps we should change this procedure.','Must sounds like an order to colleagues.']],
vocab:[
['we should…','nous devrions…','We should agree on a deadline.'],['we shouldn’t…','nous ne devrions pas…','We shouldn’t rush the final check.'],['you might want to…','vous pourriez peut-être…','You might want to check the totals.'],['why don’t we…?','pourquoi ne pas… ?','Why don’t we try a new template?'],['why not…?','pourquoi pas… ?','Why not ask the IT team?'],['how about + -ing?','et si on… ?','How about meeting on Tuesday?'],['what about + -ing / noun?','et pour… ? / et si… ?','What about a weekly update?'],['let’s…','faisons… / allons-y','Let’s start with the invoices.'],['I’d recommend + -ing','je recommanderais de…','I’d recommend saving a copy.'],['it might be worth + -ing','ça vaudrait peut-être la peine de…','It might be worth checking again.'],['ought to','devrait (formel)','We ought to inform the client.']],
examples:[
['We should keep the information accurate.','Nous devrions garder des informations exactes.'],
['We shouldn’t rush the final check.','Nous ne devrions pas bâcler la vérification finale.'],
['Why don’t we create a clearer procedure?','Pourquoi ne pas créer une procédure plus claire ?'],
['How about testing the new template for one month?','Et si on testait le nouveau modèle pendant un mois ?'],
['Let’s review the results together next week.','Revoyons les résultats ensemble la semaine prochaine.']],
game:{type:'sort',title:'🎯 Too direct or diplomatic?',intro:'Click a sentence, then click the right box.',bins:['😬 Too direct','🤝 Diplomatic'],items:[['You must change this procedure.',0],['This is wrong.',0],['Do it again.',0],['Send me the figures now.',0],['Your report is bad.',0],['Why don’t we review it together?',1],['Perhaps we could simplify this step.',1],['How about adding a checklist?',1],['It might be worth checking the figures again.',1],['Could you send me the figures when you have a moment?',1]]},
task:{intro:'Your manager asks for ideas in a team meeting. Make <b>three suggestions</b> with <b>three different structures</b>: should, why don’t we, how about / let’s.',prompts:['Advice about checking or sending information','A collaborative idea for the team','A friendly proposal to test something'],fr:'Faites trois suggestions en réunion avec trois structures différentes.',ph:'I think we should… Why don’t we…? How about…?',
models:[['We should check the figures before we send them.','Why don’t we create a shared folder?','How about having a short meeting every Monday?'],
['I think we should agree on a clear deadline for supplier invoices, and we shouldn’t send reports before the final check.','Why don’t we create a shared guide for new colleagues?','How about testing it for one month and then reviewing the results together?']]}},

{key:'opinion',quiz:'opinionStep8Quiz',title:'Expressing a balanced opinion — the O-R-E-C-S method',fr:'Donner un avis nuancé et professionnel',
rules:[
['🗣️','Introduce your opinion',['<b>In my opinion, / In my view, / From my point of view,</b>','<b>I think / I believe / I feel that…</b> · <b>Personally, / Overall,</b>']],
['🧩','The O-R-E-C-S method',['<b>O</b>pinion → <b>R</b>eason → <b>E</b>xample → <b>C</b>ontrast → <b>S</b>uggestion','Each sentence has a job.']],
['🤝','React to others',['Agree: <b>I agree. / That’s a good point.</b>','Partly: <b>I agree to some extent, but…</b> · Disagree: <b>I see your point, but…</b>']],
['🎯','Stay factual',['Speak from your experience: <b>In my experience… / In my team…</b>','Avoid absolute words: everything, never, useless.']]],
build:[
['O · Opinion',['Overall, I find the atmosphere collaborative.']],
['R · Reason',['This is because colleagues share information openly.']],
['E · Example',['For example, the reporting team answers my questions quickly.']],
['C · Contrast',['Although some checks take time, they keep our data accurate.']],
['S · Suggestion',['Perhaps we could create a shared month-end checklist.']]],
mistakes:[
['According to me, …','In my opinion, … / I think…','“According to” is used for other people or sources.'],
['I am agree.','I agree.','Agree is a verb.'],
['In my point of view, …','From my point of view, … / In my view, …','Fixed expression.'],
['I think yes.','I think so.','Fixed expression.'],
['Everything is wrong with this process.','Some steps of this process could be improved.','Absolute words sound aggressive.']],
vocab:[
['in my opinion','à mon avis','In my opinion, the new tool is efficient.'],['from my point of view','de mon point de vue','From my point of view, communication is key.'],['I feel that…','j’ai le sentiment que…','I feel that the team works well together.'],['as far as I’m concerned','en ce qui me concerne','As far as I’m concerned, the process is clear.'],['personally,','personnellement','Personally, I prefer written instructions.'],['overall,','dans l’ensemble','Overall, I’m very satisfied.'],['to be honest,','pour être honnête','To be honest, this step is a bit slow.'],['one advantage is…','un avantage est…','One advantage is the clear structure.'],['one challenge is…','une difficulté est…','One challenge is the volume at month-end.'],['I agree to some extent','je suis d’accord dans une certaine mesure','I agree to some extent, but it takes time.'],['I see your point, but…','je comprends votre point de vue, mais…','I see your point, but the checks are useful.'],['that’s a good point','c’est une bonne remarque','That’s a good point. Let’s try it.'],['one possible improvement would be…','une amélioration possible serait…','One possible improvement would be a shared calendar.']],
examples:[
['Overall, I enjoy the variety of my responsibilities because I work with several teams.','Dans l’ensemble, j’apprécie la diversité de mes responsabilités car je travaille avec plusieurs équipes.'],
['In my experience, the reporting team answers quickly.','D’après mon expérience, l’équipe reporting répond rapidement.'],
['I see your point, but I think the final check is essential.','Je comprends votre point de vue, mais je pense que la vérification finale est essentielle.'],
['Although some reporting tasks are time-consuming, they are important.','Bien que certaines tâches de reporting prennent du temps, elles sont importantes.'],
['One possible improvement would be a shared checklist.','Une amélioration possible serait une check-list partagée.']],
game:{type:'scramble',order:true,title:'🧩 Build a balanced answer · put the sentences in O-R-E-C-S order',items:[
[['Overall, I find the atmosphere collaborative.','This is because colleagues share information openly.','For example, the reporting team answers my questions quickly.','Although some checks take time, they keep our data accurate.','Perhaps we could create a shared checklist.'],'Opinion → Raison → Exemple → Contraste → Suggestion'],
[['In my opinion, our invoice process works well.','The main reason is that every step is clearly defined.','For instance, I always know which supplier to contact.','However, month-end can be very busy.','It might help to start some checks a few days earlier.'],'Opinion → Raison → Exemple → Contraste → Suggestion']]},
task:{intro:'This is your <b>complete answer</b>. Write 5 sentences with the <b>O-R-E-C-S</b> method, then click ➕ to send it to the final speaking section.',prompts:['O — your general opinion of the atmosphere or your work','R — the reason','E — a concrete example','C — a contrast (a challenge)','S — a diplomatic suggestion'],fr:'Votre réponse complète : avis, raison, exemple, contraste, suggestion.',ph:'Overall, I find… This is because… For example,… Although… Perhaps we could…',
models:[['In my opinion, the atmosphere in my team is good because my colleagues help each other.','For example, they explain new procedures.','Although some tasks take time, they are important.','Perhaps we could use a checklist.'],
['Overall, I find the atmosphere collaborative, mainly because information is shared openly.','For instance, I can easily ask the reporting team to clarify a figure.','Although certain checks are time-consuming, they protect the accuracy of our data.','From my point of view, one possible improvement would be a shared month-end checklist, which might help everyone work more efficiently.']]}}
];

const QF=[
['I like my job ___ I work with different teams.',['because','because of','despite'],0],
['The report is late ___ a system issue.',['because','because of','although'],1],
['___ the work is busy, the team is friendly.',['However','Although','Despite'],1],
['The tool is useful. ___, it is slow.',['Although','However','Because'],1],
['___ the delay, we finished on time.',['Although','However','Despite'],2],
['I check invoices. I ___ update records.',['also','too','as well'],0],
['I update records ___ .',['also','as well','in addition'],1],
['The data was wrong. ___, I called the supplier.',['As a result','Although','Such as'],0],
['We work with partners ___ garages and leasing companies.',['for example','such as','therefore'],1],
['___, I check the details. Then I reply.',['Finally','First','However'],1],
['The invoice was incorrect, ___ I contacted the supplier.',['because','although','so'],2],
['___ the figures were missing, I called the team.',['Since','Despite','Due to'],0],
['The meeting was moved ___ the bank holiday.',['because','due to','so'],1],
['I check the invoices, ___ my colleague manages contracts.',['despite','because of','whereas'],2],
['___ checking invoices, I talk to suppliers.',['In addition to','Also','Moreover'],0],
['The checks take time. ___, they are essential.',['Although','Nevertheless','Because'],1],
['___ my colleagues, I learned the procedure quickly.',['Because','Although','Thanks to'],2],
['It’s reliable. It’s a bit slow, ___ .',['although','though','despite'],1],
['___ I have verified everything, I send the report.',['Once','Despite','Such as'],0],
['I enjoy the work ___ it is sometimes stressful.',['even though','because of','in addition'],0]
];
const MANAGER_Q=['How would you describe the atmosphere in your team? What do you appreciate, and what would you improve?','What do you enjoy most about your role, and why?','Is there a procedure that you find time-consuming? What could we do about it?','How do you feel about working with international colleagues?','What was different in your previous job, and what do you prefer now?','If you could change one thing about month-end, what would it be?','How do you usually handle an urgent request from a client?'];

/* ================= helpers ================= */
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const sayBtn=(t,label='▶')=>`<button class="say" type="button" data-say="${esc(t)}" aria-label="Listen">${label}</button>`;
function confetti(){const box=document.createElement('div');box.className='confetti';const em=['🎉','⭐','✨','🎊','💫'];for(let i=0;i<26;i++){const s=document.createElement('span');s.textContent=em[i%em.length];s.style.left=Math.random()*100+'vw';s.style.animationDelay=Math.random()*.6+'s';s.style.fontSize=(16+Math.random()*16)+'px';box.append(s)}document.body.append(box);setTimeout(()=>box.remove(),2800)}

/* ================= render the modules ================= */
function renderModules(){
const host=$('opinionModules');if(!host)return;
$('pathTrack').innerHTML=M.map((m,i)=>`<a href="#mod_${m.key}" class="path-chip" id="path_${m.key}"><span class="star" id="star_${m.key}">☆</span> ${String(i+1).padStart(2,'0')} · ${esc(m.title.split(' — ')[0])}</a>`).join('');
host.innerHTML=M.map((m,i)=>{
const n=String(i+1).padStart(2,'0');
const rules=m.rules.map(([ic,t,pts])=>`<article class="rule-card"><div class="rc-icon">${ic}</div><h5>${t}</h5><ul>${pts.map(p=>`<li>${p}</li>`).join('')}</ul></article>`).join('');
const build=m.build.map(([f,exs])=>`<article class="build-card"><div class="formula-line">${esc(f)}</div>${exs.map(e=>`<div class="ex-line"><span>${esc(e)}</span>${sayBtn(e)}</div>`).join('')}</article>`).join('');
const tabs=m.tabs?`<div class="sub-block"><h4 class="block-title"><span>🧰</span> Grammar toolkit · how to form them</h4><div class="tabbar">${m.tabs.map((t,j)=>`<button type="button" class="tab-btn${j?'':' active'}" data-tabgroup="${m.key}" data-tab="${j}">${esc(t.label)}</button>`).join('')}</div>${m.tabs.map((t,j)=>`<div class="tab-panel" data-panel="${m.key}_${j}" ${j?'hidden':''}><p class="tab-intro">${esc(t.intro)}</p><div class="table-wrap"><table class="g-table"><thead><tr>${t.head.map(h=>`<th>${esc(h)}</th>`).join('')}<th></th></tr></thead><tbody>${t.rows.map(r=>`<tr>${r.map((c,k)=>`<td${k===0?' class="strong"':''}>${esc(c)}</td>`).join('')}<td>${sayBtn(r[r.length-1])}</td></tr>`).join('')}</tbody></table></div></div>`).join('')}</div>`:'';
const mistakes=m.mistakes.map(([w,r,why])=>`<article class="dd-card"><p class="dd-wrong"><b>✗</b> ${esc(w)}</p><p class="dd-right"><b>✓</b> ${esc(r)} ${sayBtn(r)}</p><p class="dd-why">💡 ${esc(why)}</p></article>`).join('');
const vocab=m.vocab.map(([en,fr,ex])=>`<article class="v-card"><div class="v-top"><strong>${esc(en)}</strong>${sayBtn(en+'. '+ex)}</div><p class="frhelp v-fr">🇫🇷 ${esc(fr)}</p><p class="v-ex">“${esc(ex)}”</p></article>`).join('');
const ex=m.examples.map(([en,fr])=>`<li class="ex-card"><div><p class="ex-en">${esc(en)}</p><p class="frhelp">${esc(fr)}</p></div>${sayBtn(en)}</li>`).join('');
const t=m.task;
const mdl=(lv,arr,j)=>`<div class="model-box guided-only" id="mdl_${m.key}_${j}" hidden><strong>${lv} model</strong><ul>${arr.map(s=>`<li>${esc(s)} ${sayBtn(s)}</li>`).join('')}</ul></div>`;
const stepNav=`<div class="mstep-nav">${MSTEPS.map((x,j)=>`<button type="button" class="mstep-btn${j?'':' active'}" data-mod="${m.key}" data-step="${j}"><span class="ms-num" id="msv_${m.key}_${j}">${j+1}</span> ${x}</button>`).join('')}</div>`;
const foot=j=>`<div class="mstep-foot">${j>0?`<button type="button" class="secondary" onclick="openStep('${m.key}',${j-1})">← Previous step</button>`:'<span></span>'}${j<3?`<button type="button" onclick="openStep('${m.key}',${j+1})">Next step: ${MSTEPS[j+1]} ➜</button>`:(i<M.length-1?`<button type="button" onclick="openModule('${M[i+1].key}',true)">Next mini-lesson: ${String(i+2).padStart(2,'0')} ➜</button>`:`<a class="btn-link" href="#speakNaturally">Go to the final speaking task ➜</a>`)}</div>`;
return `<div class="stage grammar-module" id="mod_${m.key}">
<div class="module-top"><div class="module-number">MINI-LESSON ${n} / 08</div><span class="module-badge" id="badge_${m.key}">☆ Complete the practice to earn your star</span></div>
<h3>${n} · ${esc(m.title)}</h3><p class="frhelp module-fr">${esc(m.fr)}</p>
<button type="button" class="mod-open" onclick="openModule('${m.key}',true)">Open this mini-lesson ▾</button>
<div class="mod-body">${stepNav}
<div class="mstep" data-mstep="${m.key}_0"><p class="step-intro">🧭 Read the rules first. Listen to each example and repeat it out loud.</p>
<div class="sub-block"><h4 class="block-title"><span>🧭</span> When and why · the rules</h4><div class="rule-grid">${rules}</div></div>
<div class="sub-block"><h4 class="block-title"><span>🔧</span> How to build it · one formula, several sentences</h4><div class="build-grid">${build}</div></div>
${tabs}${foot(0)}</div>
<div class="mstep" data-mstep="${m.key}_1" hidden><p class="step-intro">⚠️ Learn the traps, then the words you will need.</p>
<div class="sub-block"><h4 class="block-title"><span>⚠️</span> Remember · common mistakes</h4><div class="dd-grid">${mistakes}</div></div>
<details class="sub-block vocab-block" open><summary><span>📚</span> Vocabulary &amp; expressions · ${m.vocab.length} items · English / Français <small>(click to fold)</small></summary><div class="v-grid">${vocab}</div><button type="button" class="secondary" onclick="listenModuleVocab('${m.key}')">▶ Listen to all</button></details>
<div class="sub-block"><h4 class="block-title"><span>💼</span> At work · examples</h4><ul class="ex-list">${ex}</ul></div>${foot(1)}</div>
<div class="mstep" data-mstep="${m.key}_2" hidden><p class="step-intro">✅ Practise with immediate feedback, then play. Use the hints if you need them.</p>
<div class="sub-block"><h4 class="block-title"><span>✅</span> Practise · immediate feedback</h4><div id="${m.quiz}" class="exercise"></div><div class="button-row"><button class="secondary" type="button" onclick="resetSection('${m.quiz}')">↺ Reset these exercises</button></div></div>
<div class="sub-block game-box" id="game_${m.key}"></div>${foot(2)}</div>
<div class="mstep" data-mstep="${m.key}_3" hidden><p class="step-intro">🎭 Now use it! First in three short situations, then in your own sentences.</p>
<div class="sub-block scn-set" id="scnhost_${m.key}"></div>
<div class="your-turn"><h4 class="block-title"><span>✍️</span> Your turn · write your own sentences</h4><p>${t.intro}</p><ul class="prompt-list">${t.prompts.map(p=>`<li>${esc(p)}</li>`).join('')}</ul><p class="frhelp">${esc(t.fr)}</p>
<textarea data-save id="mine_${m.key}" placeholder="${esc(t.ph)}"></textarea>
<div class="button-row"><button type="button" onclick="speakText('mine_${m.key}')">▶ Listen to my sentences</button><button type="button" class="secondary guided-only" onclick="reveal('mdl_${m.key}_0')">Show B1 model</button><button type="button" class="secondary guided-only" onclick="reveal('mdl_${m.key}_1')">Show B1+ model</button><button type="button" class="add-btn" onclick="addToAnswer('${m.key}')">➕ Add to my complete answer</button></div>
<div class="models two">${mdl('B1',t.models[0],0)}${mdl('B1+',t.models[1],1)}</div></div>${foot(3)}</div>
</div></div>`}).join('');
M.forEach(m=>{const g=m.game;if(!g)return;const id='game_'+m.key;
if(g.type==='match')matchGame(id,g.title,m.vocab.map(v=>[v[0],v[1]]));
if(g.type==='sort')sortGame(id,g);
if(g.type==='scramble')scrambleGame(id,g);
if(g.type==='quickfire')quickFire(id,g.title)});
M.forEach(m=>renderScenarioSet('scnhost_'+m.key,m.key));['smalltalk','company','teams'].forEach(k=>renderScenarioSet('scnhost_'+k,k));
document.addEventListener('click',e=>{const b=e.target.closest('.mstep-btn');if(b)openStep(b.dataset.mod,+b.dataset.step,false)});
document.addEventListener('click',e=>{const b=e.target.closest('.tab-btn');if(!b)return;const k=b.dataset.tabgroup;document.querySelectorAll(`[data-tabgroup="${k}"]`).forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll(`[data-panel^="${k}_"]`).forEach(p=>p.hidden=p.dataset.panel!==k+'_'+b.dataset.tab)});
}
function listenModuleVocab(k){const m=M.find(x=>x.key===k);speak(m.vocab.map(v=>v[0]+'. '+v[2]).join(' '))}
function addToAnswer(k){const t=$('mine_'+k).value.trim();if(!t){toast('Write your sentences first ✍️');return}const box=$('opinionText');box.value=(box.value.trim()?box.value.trim()+'\n':'')+t;persist();toast('Added to “Your complete answer” ⬇');box.classList.add('flash');setTimeout(()=>box.classList.remove('flash'),1200)}
function clearAnswer(){if(!$('opinionText').value||confirm('Clear your complete answer?')){$('opinionText').value='';persist()}}
function randomManagerQ(){const cur=$('managerQ').textContent;let q;do{q=MANAGER_Q[Math.floor(Math.random()*MANAGER_Q.length)]}while(q===cur&&MANAGER_Q.length>1);$('managerQ').textContent=q}
function updateMastery(){let done=0;M.forEach(m=>{const n=Q[m.quiz].length;let ok=0;for(let i=0;i<n;i++)if(checked[m.quiz+'_'+i])ok++;const full=ok===n;if(full)done++;const st=$('star_'+m.key),bd=$('badge_'+m.key),ch=$('path_'+m.key);if(!st)return;const was=ch.classList.contains('done');st.textContent=full?'★':'☆';ch.classList.toggle('done',full);bd.textContent=full?'★ Star earned — well done!':`☆ ${ok} / ${n} correct · finish the practice to earn your star`;bd.classList.toggle('done',full);if(full&&!was&&updateMastery.ready){confetti();toast('★ Mini-lesson mastered!')}});if($('masteryCount')){$('masteryCount').textContent=`${done} / ${M.length} mini-lessons mastered`;$('masteryFill').style.width=(done/M.length*100)+'%'}}

/* ================= games ================= */
function matchGame(id,title,allPairs){const host=$(id);if(!host)return;let sel=null,moves=0,found=0,pairs=[];
const start=()=>{pairs=shuffle(allPairs).slice(0,6);sel=null;moves=0;found=0;
host.innerHTML=`<h4 class="block-title"><span>🎮</span> ${esc(title)}</h4><p class="small-muted">Click an English word, then its French translation. Find all 6 pairs!</p><div class="match-board"><div class="match-col">${shuffle(pairs.map((p,i)=>[p[0],i])).map(([t,i])=>`<button type="button" class="tile" data-side="en" data-i="${i}">${esc(t)}</button>`).join('')}</div><div class="match-col">${shuffle(pairs.map((p,i)=>[p[1],i])).map(([t,i])=>`<button type="button" class="tile fr-tile" data-side="fr" data-i="${i}">${esc(t)}</button>`).join('')}</div></div><div class="game-status"><span class="g-moves">Moves: 0</span><span class="g-found">Pairs: 0 / ${pairs.length}</span><button type="button" class="secondary g-new">🔄 New round</button></div>`;
host.querySelector('.g-new').onclick=start;
host.querySelectorAll('.tile').forEach(b=>b.onclick=()=>{if(b.classList.contains('matched'))return;if(!sel||sel.dataset.side===b.dataset.side){host.querySelectorAll('.tile.sel').forEach(x=>x.classList.remove('sel'));sel=b;b.classList.add('sel');if(b.dataset.side==='en')speak(b.textContent);return}
moves++;const a=sel;sel=null;a.classList.remove('sel');
if(a.dataset.i===b.dataset.i){[a,b].forEach(x=>{x.classList.add('matched');x.disabled=true});found++;if(found===pairs.length){confetti();toast(`🏆 All pairs in ${moves} moves!`)}}
else{[a,b].forEach(x=>x.classList.add('wrong'));setTimeout(()=>[a,b].forEach(x=>x.classList.remove('wrong')),600)}
host.querySelector('.g-moves').textContent='Moves: '+moves;host.querySelector('.g-found').textContent=`Pairs: ${found} / ${pairs.length}`})};start()}

function sortGame(id,g){const host=$(id);if(!host)return;let sel=null,score=0,errors=0;
const start=()=>{sel=null;score=0;errors=0;const items=shuffle(g.items.map((it,i)=>[...it,i]));
host.innerHTML=`<h4 class="block-title"><span>🎮</span> ${esc(g.title)}</h4><p class="small-muted">${esc(g.intro)}</p><div class="sort-pool">${items.map(([t,b,i])=>`<button type="button" class="chip" data-bin="${b}" data-i="${i}">${esc(t)}</button>`).join('')}</div><div class="sort-bins" style="--bins:${g.bins.length}">${g.bins.map((b,j)=>`<div class="bin" data-b="${j}"><div class="bin-title">${esc(b)}</div><div class="bin-items"></div></div>`).join('')}</div><div class="game-status"><span class="g-score">Sorted: 0 / ${g.items.length}</span><span class="g-err">Mistakes: 0</span><button type="button" class="secondary g-new">🔄 Restart</button></div>`;
host.querySelector('.g-new').onclick=start;
host.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{host.querySelectorAll('.chip.sel').forEach(x=>x.classList.remove('sel'));sel=c;c.classList.add('sel')});
host.querySelectorAll('.bin').forEach(bin=>bin.onclick=()=>{if(!sel)return;if(sel.dataset.bin===bin.dataset.b){sel.classList.remove('sel');sel.classList.add('ok');sel.disabled=true;bin.querySelector('.bin-items').append(sel);score++;if(score===g.items.length){confetti();toast(errors?`✅ All sorted with ${errors} mistake(s)!`:'🏆 Perfect sorting!')}}else{errors++;const s=sel;s.classList.add('shake');setTimeout(()=>s.classList.remove('shake'),500);bin.classList.add('nope');setTimeout(()=>bin.classList.remove('nope'),500)}sel=null;
host.querySelector('.g-score').textContent=`Sorted: ${score} / ${g.items.length}`;host.querySelector('.g-err').textContent='Mistakes: '+errors})};start()}

function quickFire(id,title){const host=$(id);if(!host)return;let set=[],i=0,score=0,streak=0,best=0;
const start=()=>{set=shuffle(QF).slice(0,10);i=0;score=0;streak=0;best=0;q()};
const q=()=>{if(i>=set.length){host.innerHTML=`<h4 class="block-title"><span>🎮</span> ${esc(title)}</h4><div class="qf-end"><p class="qf-big">${score} / ${set.length}</p><p>Best streak: 🔥 ${best}</p><p>${score>=9?'Outstanding! 🏆':score>=7?'Great work! 💪':'Good practice — play again to improve! 🙂'}</p><button type="button" class="g-new">🔄 Play again</button></div>`;host.querySelector('.g-new').onclick=start;if(score>=8)confetti();return}
const [s,opts,a]=set[i];
host.innerHTML=`<h4 class="block-title"><span>🎮</span> ${esc(title)}</h4><div class="qf-top"><span>Question ${i+1} / ${set.length}</span><span>Score: ${score}</span><span class="streak">🔥 Streak: ${streak}</span></div><div class="qf-bar"><i style="width:${i/set.length*100}%"></i></div><p class="qf-sentence">${esc(s)}</p><div class="qf-opts">${opts.map((o,j)=>`<button type="button" class="qf-opt" data-j="${j}">${esc(o)}</button>`).join('')}</div><p class="feedback"></p>`;
host.querySelectorAll('.qf-opt').forEach(b=>b.onclick=()=>{const ok=+b.dataset.j===a;host.querySelectorAll('.qf-opt').forEach(x=>{x.disabled=true;if(+x.dataset.j===a)x.classList.add('right')});const fb=host.querySelector('.feedback');
if(ok){score++;streak++;best=Math.max(best,streak);fb.textContent=streak>=3?`✓ Correct! 🔥 ${streak} in a row!`:'✓ Correct!';fb.className='feedback ok'}else{streak=0;b.classList.add('wrongopt');fb.textContent='✗ The answer is: '+opts[a];fb.className='feedback bad'}
speak(s.replace('___',opts[a]));setTimeout(()=>{i++;q()},ok?1100:2200)})};
host.innerHTML=`<h4 class="block-title"><span>🎮</span> ${esc(title)}</h4><p class="small-muted">Mixed connectors from mini-lessons 03, 04 and 05: because, although, however, despite, also, such as, so… Can you get 10 / 10?</p><button type="button" class="g-new">▶ Start the challenge</button>`;host.querySelector('.g-new').onclick=start}

/* ================= flashcards (word bank) ================= */
let fc={cards:[],i:0,known:0,flipped:false};
function setupFlashcards(){const cat=$('vocabCategory').value;fc={cards:shuffle(V[cat]),i:0,known:0,flipped:false,total:V[cat].length};drawFlash();matchGame('bankMatch','Match the pairs · '+cat,V[cat].map(v=>[v[0],v[1]]))}
function drawFlash(){const host=$('flashcards');if(!host)return;if(fc.i>=fc.cards.length){host.innerHTML=`<div class="qf-end"><p class="qf-big">🃏 ${fc.known} / ${fc.total}</p><p>cards known in this category.</p><p class="small-muted">Cards marked “review again” came back at the end.</p><button type="button" onclick="setupFlashcards()">🔄 Shuffle & restart</button></div>`;if(fc.known===fc.total)confetti();return}
const [w,fr,def,ex]=fc.cards[fc.i];
host.innerHTML=`<div class="fc-count">Card ${fc.i+1} / ${fc.cards.length} · Known: ${fc.known} / ${fc.total}</div><div class="flashcard ${fc.flipped?'flipped':''}" onclick="flipCard()" role="button" tabindex="0" aria-label="Flip card"><div class="fc-inner"><div class="fc-face fc-front"><small>ENGLISH · click to flip</small><strong>${esc(w)}</strong></div><div class="fc-face fc-back"><small>FRANÇAIS</small><strong>${esc(fr)}</strong><p>${esc(def)}</p><p><i>“${esc(ex)}”</i></p></div></div></div><div class="button-row fc-actions"><button type="button" class="secondary" data-say="${esc(w+'. '+ex)}">▶ Listen</button><button type="button" class="secondary" onclick="flipCard()">↻ Flip</button><button type="button" class="again" onclick="nextCard(false)">🔁 Review again</button><button type="button" class="know" onclick="nextCard(true)">✓ I know it</button></div>`}
function flipCard(){fc.flipped=!fc.flipped;const c=document.querySelector('.flashcard');if(c)c.classList.toggle('flipped',fc.flipped)}
function nextCard(k){if(k)fc.known++;else fc.cards.push(fc.cards[fc.i]);fc.i++;fc.flipped=false;if(!k&&fc.cards.length>V[$('vocabCategory').value].length*3)fc.cards.pop();drawFlash()}


/* ===== Step-by-step real situations: [title, who, situation, what they say, [replies], correct, why, starter, B1 model, B1+ model] ===== */
const SCN={
smalltalk:[
['Coffee machine chat','A colleague from IT','You meet a colleague at the coffee machine on Monday morning.','Morning! How was your weekend?',['Fine.','It was lovely, thanks. I went for a walk with my family. How about yours?','My weekend is good yesterday.'],1,'Answer + one detail + a question back.','It was … , thanks. I … . How about yours?','It was nice, thanks. I stayed at home with my family. And you?','It was really relaxing, thanks. We went for a long walk in the forest. How about you — did you do anything nice?'],
['Starting an online meeting','An international client','The client joins your video call a few minutes late.','Sorry I’m late! My previous meeting ran over.',['No problem at all. Thanks for joining. Shall we get started?','You are late.','It is not a problem for me, I wait always.'],0,'Reassure, thank, then make a transition.','No problem at all. … Shall we …?','No problem. Thank you for joining. Shall we start?','Not a problem at all — these things happen. Thanks for making the time. Shall we get started with the latest figures?'],
['Ending a conversation politely','A supplier at a trade event','You have chatted for a few minutes and you need to go to your next appointment.','So, it was great talking to you!',['Bye.','Yes, I go now.','Likewise! I’m afraid I have to go to another meeting, but let’s stay in touch.'],2,'Agree, give a reason, keep the relationship open.','Likewise! I’m afraid I have to … , but …','Me too! I have a meeting now. Have a nice day!','Likewise, it was a real pleasure. I’m afraid I have to head to another meeting, but let’s stay in touch — I’ll send you an email next week.']],
company:[
['Explaining FIE at a networking event','A business owner','Someone you have just met asks about your company.','So, what does your company do exactly?',['We are making cars.','We provide fleet and mobility management services for international clients.','FIE provide services.'],1,'Present simple for facts: we provide / it provides.','We provide … . We help clients to …','We provide fleet management services. We help companies manage their vehicles.','We’re an independent fleet and mobility management provider. We help international organisations manage their vehicles, control their invoices and get clear reporting on their fleet.'],
['What are you working on right now?','Your manager, by phone','Your manager calls you for a quick update.','What are you working on at the moment?',['I check the monthly invoices at the moment.','I am check the invoices.','I’m checking the monthly invoices and updating some vehicle records.'],2,'At the moment → present continuous (I’m + -ing).','At the moment, I’m … and I’m also …','At the moment, I’m checking the invoices for this month.','Right now, I’m checking this month’s supplier invoices, and I’m also updating a few vehicle records before the reporting deadline.'],
['A client asks about a service','A potential client','The client wants to know if FIE offers reporting.','Does your company provide reporting as well?',['Yes, it does. We provide global reporting, so you get a clear overview of your fleet.','Yes, it do.','Yes, we are providing it always.'],0,'Short answer “Yes, it does.” + a benefit for the client.','Yes, it does. We provide … , so you …','Yes, it does. We provide reports about your vehicles.','Yes, it does. We offer global reporting, so you can see your fleet costs and vehicle information in one place, even across several countries.']],
teams:[
['Who should I contact?','A new colleague','A new colleague has a technical problem with the fleet platform.','The platform isn’t working. Who should I contact?',['You should contact the IT team. They are the people who manage our systems.','Contact the IT which manage the systems.','I don’t know who.'],0,'Who for people + a reason.','You should contact … . They are the people who …','You should contact the IT department. They manage our systems.','The best people to contact are our IT support team — they’re the ones who handle platform access and technical issues. I can send you their email if you like.'],
['Explaining your responsibilities','An auditor visiting the office','The auditor wants to understand your role.','What exactly are you responsible for?',['I am responsible of the invoices.','I’m responsible for checking invoices and keeping vehicle records up to date.','I responsible for check invoices.'],1,'Responsible for + -ing.','I’m responsible for … -ing and …','I’m responsible for checking invoices and updating vehicle records.','I’m responsible for checking supplier invoices against our contracts and for making sure that vehicle records are accurate and up to date.'],
['How does a request move forward?','A client on the phone','The client wants to know what happens after they send you a request.','What happens after I send you a request?',['Finally I check, then I answer, first I send.','I check and answer and finish.','First, I check the details. Then, if necessary, I contact the relevant team. Finally, I get back to you.'],2,'Sequence: first → then → finally.','First, I … . Then … . Finally, I …','First, I check your request. Then I ask my colleagues if necessary. Finally, I answer you.','First, I verify the details of your request. If specialist support is needed, I liaise with the relevant team. Once everything is confirmed, I get back to you with a clear update.']],
adj:[
['Describe your team','A new colleague on their first day','The new colleague wants to know what the team is like.','What’s the team like here?',['The team is very supportive and the atmosphere is quite relaxed.','The team supportive is very.','The team are supportives.'],0,'Subject + be + (very / quite) + adjective.','The team is … and the atmosphere is …','The team is friendly and helpful. The atmosphere is calm.','The team is really supportive — people are approachable and happy to explain things. The atmosphere is quite relaxed, except at month-end, when it becomes a bit more fast-paced.'],
['Talking about your workload','Your manager, during your annual review','Your manager asks how you feel about your work.','How do you find your workload at the moment?',['It is very stressed.','It’s quite demanding, but it’s manageable because I organise my tasks carefully.','It is a bit easy.'],1,'Demanding / manageable describe the work; carefully = HOW you work.','It’s quite … , but …','It is busy, but it is OK. I work carefully.','It’s fairly demanding, especially at month-end, but it’s manageable because I plan my week carefully and prioritise urgent requests.'],
['How did the call go?','A colleague','You have just finished a call in English with a client.','How did the call with the client go?',['It went good. The client was friend.','It was interested.','It went well! The client was very friendly and I explained the figures clearly.'],2,'went well (adverb) · friendly (adjective) · clearly (adverb).','It went … ! The client was … and I … -ly.','It went well. The client was friendly.','It went really well, thanks! The client was very friendly, and I managed to explain the figures clearly. I was a bit nervous at first, but I felt confident by the end.']],
pref:[
['What do you enjoy?','A visitor from another branch','A visitor asks you about your job.','What do you enjoy most about your job?',['I enjoy to work with numbers.','What I enjoy most is working with different teams.','I am enjoy working.'],1,'Enjoy / What I enjoy most is + -ing.','What I enjoy most is … -ing …','I enjoy working with numbers and with my colleagues.','What I enjoy most is coordinating with different teams and solving problems — no two days are exactly the same.'],
['Your previous job','A new colleague at lunch','A colleague wants to know about your background.','Did you always work in fleet accounting?',['No, I used to work in a different sector.','No, I use to working in other job.','No, I am used to work in other job.'],0,'Past habit: used to + base verb.','No, I used to … . Now I …','No, I used to work in a different company. Now I work at FIE.','Not at all — I used to work in a different field, so I wasn’t used to dealing with fleet data. Now I’m used to it, and I really enjoy it.'],
['Your training wishes','Your training manager','You are planning your training for next year.','What would you like to improve this year?',['I would like improving my English.','I would like to feel more confident on the phone in English.','I like to improve my English yesterday.'],1,'Would like + to + base verb.','I would like to … , and I’d love to …','I would like to speak more confidently on the phone.','I’d like to feel more confident during phone calls in English, and I’d love to be able to present our reports to international clients without notes.']],
reason:[
['Why is the report late?','A client','A client calls you about a missing report.','Why haven’t we received the monthly report yet?',['It’s late because of a system update yesterday.','It is late because of the system was updated.','Because update.'],0,'Because of + noun.','I’m sorry, it’s late because of … . I’ll …','I’m sorry. It is late because of a system problem. I will send it today.','I do apologise — the report is slightly delayed due to a system update yesterday. I’ll send it to you by the end of the day.'],
['Why check twice?','A new colleague','A new colleague watches you work.','Why do you check every invoice twice?',['So accuracy is important.','I check them twice because accuracy is very important for our clients.','Because of accuracy is important.'],1,'Because + subject + verb.','I check them twice because … , so …','Because mistakes are expensive, so I check carefully.','Because our clients rely on accurate figures — a small error can cause a payment problem, so I prefer to double-check everything.'],
['Explaining a decision','Your manager','You sent a report one day later than planned.','Why did you send the report on Wednesday instead of Tuesday?',['Because of some figures were missing.','Since some figures were missing, I contacted the reporting team first, so the report was complete.','The figures missing, because I send Wednesday.'],1,'Since + reason, + result with so.','Since … , I … , so …','Some figures were missing, so I asked the reporting team. Then I sent the report.','Since some figures were missing on Tuesday, I contacted the reporting team first. That’s why I sent it on Wednesday — I wanted the client to receive a complete and accurate report.']],
contrast:[
['Feedback on a new tool','Your manager','Your team started using a new reporting tool last month.','What do you think of the new reporting tool?',['Although it is useful, but it is slow.','It’s useful. However, it’s sometimes slow when we export data.','Despite it is useful, it is slow.'],1,'However starts a new sentence + comma.','It’s … . However, …','It is useful. However, it is a bit slow.','Overall, it’s very useful because everything is in one place. However, it’s sometimes slow when we export large files.'],
['A busy period','A colleague from another office','A colleague asks you about month-end.','Isn’t month-end really stressful for you?',['Yes, despite of the team.','It can be, although the team is very supportive.','Although it is stressful, but OK.'],1,'Although + clause — never with but.','It can be, although …','It can be busy, but the team is helpful.','It can be, although the team is very supportive. Despite the pressure, we usually manage to meet all our deadlines.'],
['Comparing two roles','A visitor','A visitor sees you and your colleague working together.','Do you and your colleague do the same job?',['Not exactly. I check the invoices, whereas my colleague manages the contracts.','Not exactly, despite my colleague manages contracts.','Not exactly. However I check, my colleague contracts.'],0,'Whereas compares two facts.','Not exactly. I … , whereas my colleague …','No. I check invoices, but my colleague manages contracts.','Not exactly. I focus on invoice control, whereas my colleague manages the contracts. Even though our roles are different, we work very closely together.']],
add:[
['Explain the invoice process','A new colleague','A new colleague wants to learn your method.','Can you explain how you check an invoice?',['Finally, I compare. First, I update.','First, I check the details. Then I compare them with the contract. Finally, I update the records.','I check, compare, update, also too.'],1,'First → then → finally.','First, I … . Then … . Finally, …','First, I check the invoice. Then I compare it with the contract. Finally, I update the file.','First, I check the invoice details. Then I compare them with the contract and the vehicle records. If something is missing, I contact the supplier. Finally, once everything is correct, I update the system.'],
['Your other tasks','An auditor','The auditor thinks you only check invoices.','Is invoice control your only task?',['No. In addition to checking invoices, I also update vehicle records and contact suppliers.','No. In addition of invoices, I update too also.','No. I also too update.'],0,'In addition to + -ing · also before the verb.','No. In addition to … -ing, I also …','No. I also update vehicle records. I contact suppliers too.','Not at all. In addition to checking invoices, I also update vehicle records and liaise with suppliers. For example, I contact garages when a repair invoice is unclear.'],
['Explaining a consequence','Your manager','A garage sent an invoice with the wrong mileage.','What happened with the garage invoice?',['The mileage was wrong. For example, I asked a new invoice.','The mileage was wrong, such as I asked.','The mileage was wrong. As a result, I asked the garage for a corrected invoice.'],2,'As a result = consequence.','The … was wrong. As a result, I …','The mileage was wrong, so I asked for a new invoice.','The mileage on the invoice didn’t match our records. As a result, I asked the garage for a corrected invoice, and I put the payment on hold until it arrives.']],
modal:[
['Asking for a document','A supplier on the phone','You need a copy of the supplier’s contract.','Is there anything else I can do for you?',['Send me the contract.','Would it be possible to send me a copy of the contract?','You could to send me the contract.'],1,'Would it be possible to + verb? = very polite.','Yes, actually. Would it be possible to …?','Yes. Could you send me the contract, please?','Yes, actually — would it be possible to send me a copy of the signed contract? It would help me check the rates on your last invoice.'],
['Suggesting an idea','Your team leader','Drivers call the team with the same questions every week.','Any ideas to reduce the number of questions from drivers?',['Perhaps we could create a short FAQ for drivers. It might save time.','You must write a FAQ.','We could to create a FAQ.'],0,'Perhaps we could… + it might…','Perhaps we could … . It might …','We could make a document for drivers. It might help.','Perhaps we could create a short FAQ for drivers with the most common questions. It might reduce the number of calls, and it would be useful for new colleagues too.'],
['Asking a colleague for help','A colleague in Germany','You don’t understand a figure in the monthly report and you call a colleague.','Hi! What can I do for you?',['Explain this figure.','Would you mind to explain?','I was wondering if you could help me with a figure in the report.'],2,'I was wondering if you could… = very polite.','Hi! I was wondering if you could …','Hi! Could you help me with a figure in the report, please?','Hi! Sorry to bother you — I was wondering if you could help me with one figure in the monthly report. Would you mind having a quick look?']],
should:[
['Advising a new colleague','A new colleague','A new colleague is preparing their first report.','Is there anything I should know before I send my first report?',['You should to check twice.','You should double-check the totals, and you shouldn’t send it before the final check.','You must to check.'],1,'Should / shouldn’t + base verb.','You should … , and you shouldn’t …','You should check the totals before you send it.','You should always double-check the totals against the vehicle records, and you shouldn’t send anything before the final check. Why don’t we look at the first one together?'],
['Planning a meeting','Your colleagues','You want to organise a short meeting about month-end.','When can we talk about the month-end process?',['Let’s to meet on Tuesday.','How about to meet Tuesday?','How about meeting on Tuesday morning? Let’s keep it short — thirty minutes.'],2,'How about + -ing · let’s + base verb.','How about … -ing …? Let’s …','How about Tuesday morning? Let’s meet for thirty minutes.','How about meeting on Tuesday morning, before the invoices arrive? Let’s keep it short — thirty minutes should be enough.'],
['Reacting to a problem','Your manager','Two people sent the same report to a client by mistake.','How can we avoid this mistake next time?',['You must be more careful!','Why don’t we choose one person to send each report? We could add it to the checklist.','Why not to choose a person?'],1,'Why don’t we… = collaborative, not blaming.','Why don’t we … ? We could …','Why don’t we choose one person for each report?','Why don’t we name one person responsible for sending each report? We could add it to the shared checklist, so everyone knows who is in charge.']],
opinion:[
['Your opinion in a meeting','Your manager','The team has used a new checklist for one month.','What’s your opinion of our new checklist?',['According to me, it is good.','In my opinion, it’s very useful because it saves time. However, one or two steps could be simpler.','I am agree it is good.'],1,'Opinion + reason + contrast.','In my opinion, … because … . However, …','In my opinion, it is useful because it is clear. But some steps are long.','In my opinion, it’s very useful, mainly because we no longer forget steps. For example, the supplier check is now automatic. However, one or two steps could be combined to save time.'],
['Disagreeing politely','A colleague','A colleague wants to stop a check that you think is important.','I think we should stop the double check — it takes too much time.',['No, you are wrong.','I see your point, but I think the double check helps us avoid costly errors.','I am not agree.'],1,'Acknowledge, then give your view + a reason.','I see your point, but I think …','I understand, but the double check is important.','I see your point — it does take time. However, I think it helps us avoid costly errors. Perhaps we could keep it only for high-value invoices?'],
['Your annual review','Your manager','Your manager asks for your general feeling about the year.','Overall, how do you feel about your first months in the team?',['Overall, I feel very positive. I enjoy the variety of tasks, although month-end can be intense. Perhaps we could plan it earlier.','Everything is perfect and nothing to change.','I think yes it is good.'],0,'Overall + opinion + contrast + suggestion.','Overall, I feel … . I enjoy … , although … . Perhaps …','Overall, I am happy. I like my tasks. Month-end is busy. We could start earlier.','Overall, I feel very positive. I really enjoy the variety of my tasks, and my colleagues have been very supportive. Although month-end can be intense, I’m learning to manage it. One possible improvement would be to start some checks a few days earlier.']]
};
function renderScenarioSet(hostId,key){const host=$(hostId),set=SCN[key];if(!host||!set)return;
host.innerHTML=`<h4 class="block-title"><span>🎭</span> Use it · real situations, step by step</h4><p class="small-muted">Three short situations. For each one: ① choose the best reply → ② answer in your own words → ③ compare with the models. You are you: answer with <b>I / we</b>; the other person is <b>you</b>.</p><div class="scn-tabs">${set.map((s,i)=>`<button type="button" class="scn-tab${i?'':' active'}" data-scnset="${key}" data-scn="${i}"><span class="scn-done" id="scnok_${key}_${i}">${i+1}</span> ${esc(s[0])}</button>`).join('')}</div>`+
set.map(([t,who,ctx,line,opts,a,why,starter,b1,b2],i)=>`<div class="scn" data-scnpanel="${key}_${i}" ${i?'hidden':''}>
<div class="scn-head"><div class="scn-ctx"><b>📍 Situation:</b> ${esc(ctx)}</div><div class="scn-who">👤 ${esc(who)}</div></div>
<div class="scn-line"><span class="bubble">“${esc(line)}”</span>${sayBtn(line)}</div>
<div class="scn-step"><div class="snum">1</div><div><p class="scn-q">Choose the best reply.</p><div class="scn-opts">${opts.map((o,j)=>`<button type="button" class="scn-opt" data-scnopt="${key}_${i}_${j}">${esc(o)}</button>`).join('')}</div><p class="feedback" id="scnfb_${key}_${i}"></p></div></div>
<div class="scn-step"><div class="snum">2</div><div><p class="scn-q">Now answer in your own words. Add a detail from your real job.</p><p class="hint-text">🧩 Starter: ${esc(starter)}</p><textarea data-save id="scn_${key}_${i}" placeholder="${esc(starter)}"></textarea><div class="button-row"><button type="button" class="secondary" onclick="useStarter('${key}',${i})">✏️ Use the starter</button><button type="button" class="secondary" onclick="speakText('scn_${key}_${i}')">▶ Listen to my answer</button></div></div></div>
<div class="scn-step"><div class="snum">3</div><div><p class="scn-q">Compare with the models.</p><div class="button-row"><button type="button" class="secondary guided-only" onclick="reveal('scnm_${key}_${i}_0')">Show B1 model</button><button type="button" class="secondary guided-only" onclick="reveal('scnm_${key}_${i}_1')">Show B1+ model</button></div><div class="models two"><div class="model-box guided-only" id="scnm_${key}_${i}_0" hidden><strong>B1</strong><p>${esc(b1)} ${sayBtn(b1)}</p></div><div class="model-box guided-only" id="scnm_${key}_${i}_1" hidden><strong>B1+</strong><p>${esc(b2)} ${sayBtn(b2)}</p></div></div></div></div>
<div class="scn-foot">${i<set.length-1?`<button type="button" onclick="openScenario('${key}',${i+1})">Next situation ➜</button>`:'<span class="small-muted">✅ Last situation — well done! Move on when you feel ready.</span>'}</div></div>`).join('');
host.querySelectorAll('.scn-tab').forEach(b=>b.onclick=()=>openScenario(key,+b.dataset.scn));
host.querySelectorAll('.scn-opt').forEach(b=>b.onclick=()=>{const [k,i,j]=b.dataset.scnopt.split('_');const s=SCN[k][+i],ok=+j===s[5];const fb=$(`scnfb_${k}_${i}`);
host.querySelectorAll(`[data-scnopt^="${k}_${i}_"]`).forEach(x=>x.classList.remove('picked-ok','picked-no'));b.classList.add(ok?'picked-ok':'picked-no');
fb.textContent=ok?'✓ Yes! '+s[6]:'↻ Not quite. Read the other replies again. 💡 '+s[6];fb.className='feedback '+(ok?'ok':'bad');if(ok){$(`scnok_${k}_${i}`).textContent='✓';$(`scnok_${k}_${i}`).classList.add('ok');speak(s[4][s[5]])}})}
function openScenario(key,i){document.querySelectorAll(`[data-scnset="${key}"]`).forEach(b=>b.classList.toggle('active',+b.dataset.scn===i));document.querySelectorAll(`[data-scnpanel^="${key}_"]`).forEach(p=>p.hidden=p.dataset.scnpanel!==key+'_'+i)}
function useStarter(key,i){const t=$(`scn_${key}_${i}`);if(!t.value.trim()){t.value=SCN[key][i][7];persist()}t.focus()}

function scrambleGame(id,g){const host=$(id);if(!host)return;let idx=0,score=0;
const draw=()=>{const [tokens,fr]=g.items[idx];let order;do{order=shuffle(tokens.map((t,i)=>i))}while(order.every((v,i)=>v===i));let done=false,shown=false;
host.innerHTML=`<h4 class="block-title"><span>🎮</span> ${esc(g.title)}</h4><p class="small-muted">${g.order?'Click the sentences in the right order.':'Click the pieces in the right order to build the sentence.'} Changed your mind? <b>Click any piece in the green box to send it back</b>, or use ↩ Undo. <b>${idx+1} / ${g.items.length}</b></p><p class="frhelp">🇫🇷 ${esc(fr)}</p><div class="answer-label">Your answer</div><div class="word-answer ${g.order?'stack':''}"><span class="empty-msg">Click the pieces below ⬇</span></div><div class="word-bank ${g.order?'stack':''}">${order.map(i=>`<button type="button" class="wchip" data-i="${i}">${esc(tokens[i])}</button>`).join('')}</div><p class="feedback"></p><div class="game-status"><button type="button" class="g-check">✓ Check</button><button type="button" class="secondary g-back">↩ Undo last</button><button type="button" class="secondary g-undo">↺ Start again</button><button type="button" class="secondary guided-only g-show">Show answer</button><button type="button" class="secondary g-next">Next ➜</button><span class="g-score">Score: ${score} / ${g.items.length}</span></div>`;
const ans=host.querySelector('.word-answer'),bank=host.querySelector('.word-bank'),fb=host.querySelector('.feedback');
const clearMarks=()=>{host.querySelectorAll('.wchip').forEach(c=>c.classList.remove('pos-ok','pos-no'));fb.textContent='';fb.className='feedback'};
const refresh=()=>{ans.classList.toggle('has',ans.querySelectorAll('.wchip').length>0)};
host.querySelectorAll('.wchip').forEach(c=>c.onclick=()=>{if(done)return;clearMarks();(c.parentElement===bank?ans:bank).append(c);refresh()});
host.querySelector('.g-back').onclick=()=>{if(done)return;const l=[...ans.querySelectorAll('.wchip')].pop();if(l){clearMarks();bank.append(l);refresh()}};
host.querySelector('.g-undo').onclick=()=>{done=false;clearMarks();ans.querySelectorAll('.wchip').forEach(c=>bank.append(c));refresh()};
host.querySelector('.g-check').onclick=()=>{if(done)return;const placed=[...ans.querySelectorAll('.wchip')],got=placed.map(c=>+c.dataset.i);if(got.length<tokens.length){fb.textContent='Use all the pieces first.';fb.className='feedback bad';return}
if(got.every((v,i)=>v===i)){done=true;if(!shown){score++;fb.textContent='✓ Perfect!';confetti()}else fb.textContent='✓ Correct order.';fb.className='feedback ok';speak(tokens.join(' '));host.querySelector('.g-score').textContent=`Score: ${score} / ${g.items.length}`}
else{placed.forEach((c,i)=>c.classList.add(+c.dataset.i===i?'pos-ok':'pos-no'));const n=placed.filter((c,i)=>+c.dataset.i===i).length;fb.textContent=`↻ ${n} / ${tokens.length} in the right place (green). Click the orange ones to send them back, then try again.`;fb.className='feedback bad'}};
host.querySelector('.g-show').onclick=()=>{shown=true;done=false;clearMarks();const all=[...host.querySelectorAll('.wchip')].sort((a,b)=>a.dataset.i-b.dataset.i);all.forEach(c=>ans.append(c));refresh();fb.textContent='Here is the correct order. Click “Start again” to try it yourself.';fb.className='feedback ok'};
host.querySelector('.g-next').onclick=()=>{idx=(idx+1)%g.items.length;if(idx===0)score=0;draw()};
applyVisibility()};draw()}

/* ===== gradual navigation: one section / one mini-lesson / one step at a time ===== */
let UI={view:'step',section:'recap',mod:'adj',steps:{}};
const panels=()=>[...document.querySelectorAll('main > section.panel')];
function applyView(){const step=UI.view==='step';document.body.classList.toggle('view-step',step);
if(!panels().some(p=>p.id===UI.section))UI.section=panels()[0].id;
panels().forEach(p=>p.classList.toggle('active',p.id===UI.section));
document.querySelectorAll('.toc a').forEach(a=>a.classList.toggle('active',step&&a.getAttribute('href')==='#'+UI.section));
document.querySelectorAll('.grammar-module').forEach(m=>m.classList.toggle('collapsed',step&&m.id!=='mod_'+UI.mod));
if($('viewMode'))$('viewMode').value=UI.view}
function goSection(id,scroll=true){UI.section=id;applyView();persist();if(scroll)setTimeout(()=>$(id).scrollIntoView({behavior:'smooth',block:'start'}),30)}
function openModule(key,scroll=false){UI.mod=key;UI.section='opinions';applyView();persist();if(scroll)setTimeout(()=>$('mod_'+key).scrollIntoView({behavior:'smooth',block:'start'}),30)}
function openStep(key,j,scroll=true){UI.mod=key;UI.steps[key]=j;document.querySelectorAll(`.mstep-btn[data-mod="${key}"]`).forEach(b=>b.classList.toggle('active',+b.dataset.step===j));
document.querySelectorAll(`[data-mstep^="${key}_"]`).forEach(p=>p.hidden=p.dataset.mstep!==key+'_'+j);
for(let k=0;k<j;k++){const v=$(`msv_${key}_${k}`);if(v){v.textContent='✓';v.classList.add('ok')}}
applyView();persist();if(scroll)setTimeout(()=>$('mod_'+key).querySelector('.mstep-nav').scrollIntoView({behavior:'smooth',block:'start'}),30)}
function buildSectionNav(){const ps=panels(),label=id=>{const a=document.querySelector(`.toc a[href="#${id}"]`);return a?a.textContent.trim():id};
ps.forEach((p,i)=>{const d=document.createElement('div');d.className='section-nav';d.innerHTML=`${i>0?`<button type="button" class="secondary" onclick="goSection('${ps[i-1].id}')">← ${esc(label(ps[i-1].id))}</button>`:'<span></span>'}<span class="sn-count">Section ${i+1} of ${ps.length}</span>${i<ps.length-1?`<button type="button" onclick="goSection('${ps[i+1].id}')">Next: ${esc(label(ps[i+1].id))} →</button>`:'<span></span>'}`;p.append(d)});
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href').slice(1),el=$(id);if(!el)return;e.preventDefault();
if(el.classList.contains('grammar-module')){openModule(id.replace('mod_',''),true);return}
const sec=el.closest('main > section.panel');if(sec){UI.section=sec.id;applyView();persist()}setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),30)});
$('viewMode').addEventListener('change',()=>{UI.view=$('viewMode').value;applyView();persist();if(UI.view==='step')goSection(UI.section)})}
function restoreUI(u){if(!u||typeof u!=='object')return;if(['step','all'].includes(u.view))UI.view=u.view;if(typeof u.section==='string'&&$(u.section))UI.section=u.section;if(M.some(m=>m.key===u.mod))UI.mod=u.mod;if(u.steps&&typeof u.steps==='object')Object.entries(u.steps).forEach(([k,j])=>{if(M.some(m=>m.key===k)&&[0,1,2,3].includes(+j))openStep(k,+j,false)});UI.mod=M.some(m=>m.key===u.mod)?u.mod:UI.mod;applyView()}

document.addEventListener('DOMContentLoaded',init);
