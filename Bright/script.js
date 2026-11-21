/* =========================================================
   Bright English Prep · Lesson 01 · SpeakEasyTisha
   All content + interactive engines. No external libraries.
   Authoring note: in every question, the FIRST option is the
   correct one. Options are shuffled automatically on screen.
   ========================================================= */
'use strict';
(() => {

/* ---------------------------------------------------------
   1. CONTENT
--------------------------------------------------------- */
const D = {};

D.examQuiz = [
  {q:'How many multiple-choice questions are there in the written + listening parts?', o:['120 (60 + 60)','60','200'], exp:'60 written questions + 60 listening questions = 120.', fr:'60 questions écrites + 60 questions d\'écoute.'},
  {q:'How much time do you have for each written question?', o:['45 seconds','60 seconds','2 minutes'], exp:'45 seconds for each written question.', fr:'45 secondes par question écrite.'},
  {q:'How many answer options do you usually see in the listening part?', o:['3 (A, B, C)','4 (A, B, C, D)','2 (true / false)'], exp:'Listening questions usually have 3 options.', fr:'Généralement 3 options à l\'écoute.'},
  {q:'Can you replay a listening recording?', o:['Yes, but the 60-second clock keeps running','No, you hear it only once','Yes, and the clock stops while it plays'], exp:'You can replay, but the time limit still applies.', fr:'On peut réécouter, mais le chrono continue.'},
  {q:'What happens if you do not answer before the time ends?', o:['The test moves on and it counts as wrong','You get 10 extra seconds','You can come back to it at the end'], exp:'The software moves on automatically and a blank answer counts as wrong.', fr:'Passage automatique ; une absence de réponse compte comme fausse.'},
  {q:'You are not sure of the answer. What should you do?', o:['Choose the most likely answer anyway','Leave it blank to avoid losing points','Wait for the time to end'], exp:'There is no penalty for a wrong guess, so always answer.', fr:'Pas de pénalité : répondez toujours.'},
  {q:'Bright results are given on a scale of…', o:['0 to 5','0 to 990','0 to 100'], exp:'Bright uses a 0–5 scale, linked to CEFR levels.', fr:'Échelle de 0 à 5, reliée au CECRL.'},
  {q:'The speaking part of your pathway is…', o:['a live conversation with an examiner by video','a recording you send by email','a written multiple-choice test'], exp:'Speaking is live, by videoconference, with an examiner.', fr:'L\'oral se fait en direct, en visio, avec un examinateur.'}
];

D.vocab = [
  // Meetings & schedules
  {w:'schedule', fr:'planning / programmer', ex:'The schedule for next week is on the shared drive.', c:'Meetings & schedules', i:'📅'},
  {w:'agenda', fr:'ordre du jour', ex:'The first point on the agenda is the budget.', c:'Meetings & schedules', i:'📋'},
  {w:'deadline', fr:'date limite', ex:'The deadline for the report is Friday.', c:'Meetings & schedules', i:'⏰'},
  {w:'to postpone', fr:'reporter', ex:'We had to postpone the meeting until Monday.', c:'Meetings & schedules', i:'⏭️'},
  {w:'to reschedule', fr:'reprogrammer', ex:'Can we reschedule our call?', c:'Meetings & schedules', i:'🔁'},
  {w:'to attend', fr:'assister à', ex:'Twenty people attended the training.', c:'Meetings & schedules', i:'🪑'},
  {w:'available', fr:'disponible', ex:'Are you available on Thursday morning?', c:'Meetings & schedules', i:'✅'},
  {w:'the minutes', fr:'le compte rendu', ex:'Who is taking the minutes today?', c:'Meetings & schedules', i:'📝'},
  {w:'to chair a meeting', fr:'présider une réunion', ex:'The director will chair the meeting.', c:'Meetings & schedules', i:'🎙️'},
  {w:'to bring forward', fr:'avancer (une date)', ex:'They brought the launch forward to May.', c:'Meetings & schedules', i:'⏪'},
  // Office & HR
  {w:'staff', fr:'le personnel', ex:'All staff must attend the safety training.', c:'Office & HR', i:'👥'},
  {w:'colleague', fr:'collègue', ex:'My colleague is in charge of the project.', c:'Office & HR', i:'🤝'},
  {w:'to hire', fr:'embaucher', ex:'We are hiring two new sales assistants.', c:'Office & HR', i:'🧑‍💼'},
  {w:'to lay off', fr:'licencier (raisons économiques)', ex:'The factory laid off 50 workers.', c:'Office & HR', i:'📉'},
  {w:'to apply for', fr:'postuler à', ex:'She applied for the manager position.', c:'Office & HR', i:'📨'},
  {w:'salary', fr:'salaire', ex:'The salary is paid at the end of the month.', c:'Office & HR', i:'💼'},
  {w:'training', fr:'formation', ex:'The company offers English training.', c:'Office & HR', i:'🎓'},
  {w:'to be in charge of', fr:'être responsable de', ex:'Who is in charge of recruitment?', c:'Office & HR', i:'🧭'},
  {w:'a promotion', fr:'une promotion (poste)', ex:'He got a promotion last year.', c:'Office & HR', i:'⬆️'},
  {w:'a day off', fr:'un jour de congé', ex:'I am taking a day off on Friday.', c:'Office & HR', i:'🏖️'},
  // Money & sales
  {w:'invoice', fr:'facture', ex:'Please pay the invoice within 30 days.', c:'Money & sales', i:'🧾'},
  {w:'quote', fr:'devis', ex:'Could you send us a quote for 100 chairs?', c:'Money & sales', i:'📄'},
  {w:'discount', fr:'remise', ex:'We offer a 10% discount on large orders.', c:'Money & sales', i:'🏷️'},
  {w:'refund', fr:'remboursement', ex:'The customer asked for a refund.', c:'Money & sales', i:'💸'},
  {w:'budget', fr:'budget', ex:'We are over budget this quarter.', c:'Money & sales', i:'📊'},
  {w:'an increase', fr:'une augmentation', ex:'There was an increase in sales.', c:'Money & sales', i:'📈'},
  {w:'figures', fr:'chiffres', ex:'The sales figures are very good this month.', c:'Money & sales', i:'🔢'},
  {w:'overdrawn', fr:'à découvert', ex:'My account is overdrawn.', c:'Money & sales', i:'🏦'},
  {w:'profit', fr:'bénéfice', ex:'The company made a profit last year.', c:'Money & sales', i:'💰'},
  {w:'a target', fr:'un objectif', ex:'We reached our sales target.', c:'Money & sales', i:'🎯'},
  // Customers & service
  {w:'customer', fr:'client', ex:'The customer is always our priority.', c:'Customers & service', i:'🙋'},
  {w:'supplier', fr:'fournisseur', ex:'We changed our paper supplier.', c:'Customers & service', i:'🏭'},
  {w:'order', fr:'commande', ex:'Your order will arrive tomorrow.', c:'Customers & service', i:'📦'},
  {w:'delivery', fr:'livraison', ex:'Delivery is free for orders over €50.', c:'Customers & service', i:'🚚'},
  {w:'complaint', fr:'réclamation', ex:'We received a complaint about the noise.', c:'Customers & service', i:'😠'},
  {w:'out of stock', fr:'en rupture de stock', ex:'This model is out of stock.', c:'Customers & service', i:'🚫'},
  {w:'warranty', fr:'garantie', ex:'The printer has a two-year warranty.', c:'Customers & service', i:'🛡️'},
  {w:'feedback', fr:'retour, avis', ex:'Thank you for your feedback.', c:'Customers & service', i:'💬'},
  {w:'to deal with', fr:'traiter, s\'occuper de', ex:'I deal with customer complaints.', c:'Customers & service', i:'🛠️'},
  {w:'a booking', fr:'une réservation', ex:'I would like to change my booking.', c:'Customers & service', i:'🗓️'}
];

D.vocabQuiz = [
  {q:'Please send me the ___ so I can pay it today.', o:['invoice','quote','discount','refund'], exp:'You pay an invoice (facture).', hint:'You pay it.'},
  {q:'Before we order, could you send us a ___ for 50 chairs?', o:['quote','invoice','refund','warranty'], exp:'A quote (devis) gives the price before you order.', hint:'You receive it BEFORE ordering.'},
  {q:'The meeting has been ___ until next week.', o:['postponed','attended','hired','ordered'], exp:'Postpone = move to a later date (reporter).', hint:'It moved to a later date.'},
  {q:'Twenty people will ___ the training session.', o:['attend','assist','wait','postpone'], exp:'Attend = assister à. “Assist” means “help” (faux ami).', hint:'Careful, a false friend!'},
  {q:'The customer made a ___ about the late delivery.', o:['complaint','feedback','warranty','supplier'], exp:'Make a complaint = faire une réclamation.', hint:'The customer is not happy.'},
  {q:'Sorry, this model is ___. We will have more next month.', o:['out of stock','overdrawn','available','laid off'], exp:'Out of stock = there are none left in the shop.', hint:'There are none left.'},
  {q:'We need to ___ three new sales assistants.', o:['hire','lay off','apply','attend'], exp:'Hire = recruit, give a job to someone.', hint:'They are NEW assistants.'},
  {q:'The ___ for the report is Friday at noon.', o:['deadline','agenda','minutes','salary'], exp:'Deadline = the last date to finish something.', hint:'The last possible moment.'},
  {q:'Can you take the ___ during the meeting and send them to everyone?', o:['minutes','agenda','figures','training'], exp:'The minutes = the written record of a meeting (compte rendu).', hint:'A written record.'},
  {q:'We offer a 10% ___ for orders over €500.', o:['discount','refund','increase','profit'], exp:'Discount = a reduction in price (remise).', hint:'The price is lower.'}
];

D.g1 = [
  {q:'We agreed ___ the price by 5%.', o:['to reduce','reducing','reduce','reduced'], exp:'agree + to + verb.', fr:'agree est suivi de to + verbe.', hint:'Is “agree” a “to” verb or an “-ing” verb?'},
  {q:'I enjoy ___ with international clients.', o:['working','to work','work','worked'], exp:'enjoy + -ing.', fr:'enjoy est suivi de -ing.', hint:'enjoy → -ing'},
  {q:'She suggested ___ the meeting online.', o:['holding','to hold','hold','held'], exp:'suggest + -ing.', fr:'suggest + -ing (jamais suggest to do).', hint:'suggest is in the “-ing” list.'},
  {q:'They asked me ___ the presentation.', o:['to prepare','preparing','prepare','prepared'], exp:'ask + person + to + verb.', fr:'ask quelqu\'un to + verbe.', hint:'verb + person + …'},
  {q:'I\'m interested in ___ more about this position.', o:['learning','to learn','learn','learned'], exp:'After a preposition (in), use -ing.', fr:'Après une préposition : -ing.', hint:'“in” is a preposition.'},
  {q:'We can\'t afford ___ this client.', o:['to lose','losing','lose','lost'], exp:'afford + to + verb.', fr:'afford + to.', hint:'afford is in the “to” list.'},
  {q:'Would you mind ___ the door?', o:['closing','to close','close','closed'], exp:'mind + -ing.', fr:'mind + -ing.', hint:'mind → -ing'},
  {q:'I look forward to ___ from you.', o:['hearing','hear','to hear','heard'], exp:'“to” is a preposition here, so -ing.', fr:'look forward to + -ing.', hint:'Remember the trap!'},
  {q:'The manager refused ___ the contract.', o:['to sign','signing','sign','signed'], exp:'refuse + to + verb.', fr:'refuse + to.', hint:'refuse is in the “to” list.'},
  {q:'Have you finished ___ the report?', o:['writing','to write','write','wrote'], exp:'finish + -ing.', fr:'finish + -ing.', hint:'finish → -ing'}
];

D.g2 = [
  {q:'I ___ the report yesterday.', o:['sent','have sent','send','have send'], exp:'“yesterday” = finished time → past simple.', fr:'yesterday → prétérit.', hint:'Find the time word.'},
  {q:'We ___ here since 2019.', o:['have worked','worked','work','are working'], exp:'“since” + still true now → present perfect.', fr:'since → present perfect.', hint:'since 2019 = depuis 2019'},
  {q:'Have you ever ___ to the USA?', o:['been','went','go','going'], exp:'have + past participle (been).', fr:'have + participe passé.', hint:'have + past participle'},
  {q:'The client called two hours ___.', o:['ago','since','for','yet'], exp:'ago = finished time → past simple.', fr:'ago = il y a.', hint:'il y a deux heures'},
  {q:'I haven\'t received your email ___.', o:['yet','already','ago','since'], exp:'yet at the end of negative sentences/questions.', fr:'yet = pas encore (phrase négative).', hint:'pas encore'},
  {q:'She ___ the company in 2015.', o:['joined','has joined','joins','have joined'], exp:'“in 2015” = finished time → past simple.', fr:'en 2015 → prétérit.', hint:'A precise year in the past.'},
  {q:'We have already ___ the new prices.', o:['published','publish','publishing','to publish'], exp:'have + past participle.', fr:'have + participe passé.', hint:'have already + …'},
  {q:'How long ___ this position?', o:['have you had','did you have','do you have','are you having'], exp:'How long + still true now → present perfect.', fr:'Depuis combien de temps → present perfect.', hint:'You still have the position.'},
  {q:'Last month, our sales ___ by 10%.', o:['increased','have increased','increase','are increasing'], exp:'“Last month” = finished time → past simple.', fr:'last month → prétérit.', hint:'Finished time word.'},
  {q:'I\'ve just ___ the meeting room.', o:['booked','book','booking','to book'], exp:'have just + past participle.', fr:'have just + participe passé = venir de.', hint:'I have just… = je viens de…'}
];

D.g2sort = {
  columns:['Past simple ⏮️','Present perfect 🔗'],
  items:[
    {t:'yesterday',c:0},{t:'last week',c:0},{t:'in 2020',c:0},{t:'two days ago',c:0},{t:'when I was a student',c:0},{t:'on Monday',c:0},
    {t:'since January',c:1},{t:'for three years',c:1},{t:'already',c:1},{t:'yet',c:1},{t:'ever',c:1},{t:'just',c:1},{t:'never',c:1},{t:'so far',c:1}
  ]
};

D.preps = [
  ['an increase','in','une augmentation de'],['a decrease','in','une baisse de'],['the reason','for','la raison de'],
  ['responsible','for','responsable de'],['interested','in','intéressé par'],['good','at','doué en'],
  ['in charge','of','responsable de'],['depend','on','dépendre de'],['apply','for','postuler à'],
  ['agree','with','être d\'accord avec'],['deal','with','s\'occuper de'],['wait','for','attendre'],
  ['ask','for','demander'],['pay','for','payer'],['focus','on','se concentrer sur'],
  ['involved','in','impliqué dans'],['familiar','with','familier de'],['look forward','to','avoir hâte de']
];

D.g3 = [
  {q:'There has been an increase ___ prices.', o:['in','of','on','at'], exp:'an increase in…', fr:'une augmentation des prix = an increase in prices.'},
  {q:'Who is responsible ___ the budget?', o:['for','of','to','with'], exp:'responsible for…', fr:'responsable de = responsible for.'},
  {q:'I\'m very interested ___ this project.', o:['in','on','for','by'], exp:'interested in…', fr:'intéressé par = interested in.'},
  {q:'It depends ___ the client.', o:['on','of','from','to'], exp:'depend on… (never “depend of”).', fr:'dépendre de = depend on.'},
  {q:'She\'s in charge ___ marketing.', o:['of','for','on','with'], exp:'in charge of…', fr:'responsable de = in charge of.'},
  {q:'I\'d like to apply ___ the job.', o:['for','to','at','on'], exp:'apply for a job.', fr:'postuler à un poste = apply for a job.'},
  {q:'He\'s very good ___ negotiating.', o:['at','in','on','for'], exp:'good at + -ing.', fr:'doué pour = good at.'},
  {q:'Can you deal ___ this complaint?', o:['with','of','about','on'], exp:'deal with…', fr:'s\'occuper de = deal with.'},
  {q:'We\'re waiting ___ the delivery.', o:['for','to','at','of'], exp:'wait for… (attendre: no preposition in French!)', fr:'attendre quelque chose = wait FOR something.'},
  {q:'What\'s the reason ___ the delay?', o:['for','of','to','about'], exp:'the reason for…', fr:'la raison du retard = the reason for the delay.'}
];

D.g4 = [
  {q:'The project was a great ___.', o:['success','succeed','successful','successfully'], exp:'After “a great” → noun.', fr:'Après a + adjectif → nom.'},
  {q:'We hope to ___ in this new market.', o:['succeed','success','successful','successfully'], exp:'After “to” → verb.', fr:'Après to → verbe.'},
  {q:'She is a very ___ manager.', o:['efficient','efficiency','efficiently','efficience'], exp:'Before a noun (manager) → adjective.', fr:'Devant un nom → adjectif.'},
  {q:'He works very ___.', o:['efficiently','efficient','efficiency','efficience'], exp:'Describes the verb “works” → adverb.', fr:'Décrit le verbe → adverbe (-ly).'},
  {q:'We need to make a ___ quickly.', o:['decision','decide','decisive','decisively'], exp:'After “a” → noun. (make a decision)', fr:'make a decision = prendre une décision.'},
  {q:'Our prices are very ___.', o:['competitive','compete','competition','competitively'], exp:'After “be” → adjective.', fr:'Après be → adjectif.'},
  {q:'There has been a big ___ in quality.', o:['improvement','improve','improved','improving'], exp:'After “a big” → noun.', fr:'Après a + adjectif → nom.'},
  {q:'This supplier is very ___: always on time.', o:['reliable','rely','reliability','reliably'], exp:'After “is very” → adjective.', fr:'Après is very → adjectif.'}
];

D.expressions = [
  {e:'to be tied up', m:'to be very busy', fr:'être pris, occupé', ex:'I\'m afraid she\'s tied up in a meeting.'},
  {e:'to get back to someone', m:'to contact someone again later', fr:'recontacter quelqu\'un', ex:'I\'ll get back to you tomorrow.'},
  {e:'to put back / push back', m:'to move to a later time', fr:'repousser', ex:'The launch has been pushed back to June.'},
  {e:'to bring forward', m:'to move to an earlier time', fr:'avancer', ex:'Can we bring the meeting forward?'},
  {e:'to talk shop', m:'to talk about work', fr:'parler boulot', ex:'Let\'s not talk shop at dinner.'},
  {e:'short-staffed', m:'without enough employees', fr:'en sous-effectif', ex:'We\'re short-staffed this week.'},
  {e:'behind schedule', m:'late compared to the plan', fr:'en retard sur le planning', ex:'The project is behind schedule.'},
  {e:'out of order', m:'not working', fr:'en panne', ex:'The lift is out of order.'},
  {e:'to put someone through', m:'to connect a phone call', fr:'passer quelqu\'un (au téléphone)', ex:'I\'ll put you through to sales.'},
  {e:'to touch base', m:'to talk briefly again', fr:'faire un point rapide', ex:'Let\'s touch base on Monday.'},
  {e:'at stake', m:'at risk, could be lost', fr:'en jeu', ex:'A big contract is at stake.'},
  {e:'in the red', m:'losing money', fr:'dans le rouge, en déficit', ex:'The company is in the red.'},
  {e:'to run out of', m:'to have none left', fr:'être à court de', ex:'We\'ve run out of paper.'},
  {e:'on hold', m:'paused, waiting', fr:'en attente', ex:'The project is on hold.'},
  {e:'to lay off', m:'to dismiss workers', fr:'licencier', ex:'They laid off 50 people.'},
  {e:'ASAP', m:'as soon as possible', fr:'dès que possible', ex:'Please reply ASAP.'}
];

D.l1 = D.expressions.slice(0,10).map(x => ({term:x.e, answer:x.m}));

D.l2 = [
  {say:'The meeting is in room thirteen.', q:'Which room?', o:['13','30','33'], exp:'thir-TEEN: stress at the end = 13.'},
  {say:'We need fifty copies, please.', q:'How many copies?', o:['50','15','55'], exp:'FIF-ty: stress at the start = 50.'},
  {say:'The train leaves at four fifteen.', q:'What time?', o:['4:15','4:50','5:15'], exp:'four fifteen = 4:15.'},
  {say:'The price is eighteen ninety-nine.', q:'What is the price?', o:['€18.99','€80.99','€18.90'], exp:'eighteen ninety-nine = 18.99.'},
  {say:'Our office is on the fourteenth floor.', q:'Which floor?', o:['14th','40th','4th'], exp:'four-TEENTH = 14th.'},
  {say:'The conference is on the twenty-third of May.', q:'What date?', o:['23 May','22 May','13 May'], exp:'twenty-third = 23rd.'}
];

D.l3 = [
  {say:'Can we bring the meeting forward to Tuesday?', o:['The speaker wants to have the meeting earlier.','The speaker wants to have the meeting later.','The speaker wants to cancel the meeting.'], exp:'bring forward = make earlier.', fr:'avancer la réunion.'},
  {say:'I\'m afraid we\'ve run out of brochures.', o:['There are no brochures left.','The brochures have been posted.','There are too many brochures.'], exp:'run out of = have none left.', fr:'il n\'y a plus de brochures.'},
  {say:'Please hold the line, I\'ll put you through.', o:['The caller will be transferred.','The caller should hang up.','The caller should call back later.'], exp:'put through = connect to another person.', fr:'on va transférer l\'appel.'},
  {say:'The contract is still on hold.', o:['No decision has been made yet.','The contract has been signed.','The contract has been cancelled.'], exp:'on hold = paused, waiting.', fr:'le contrat est en attente.'},
  {say:'Mr Davies will get back to you this afternoon.', o:['Mr Davies will contact you later today.','Mr Davies will come back to the office.','Mr Davies met you this afternoon.'], exp:'get back to someone = contact them again.', fr:'il vous recontactera.'},
  {say:'Our biggest client is at stake if we miss this deadline.', o:['We could lose an important client.','We will win a new client.','The client missed the deadline.'], exp:'at stake = at risk.', fr:'notre plus gros client est en jeu.'},
  {say:'The company laid off two hundred workers.', o:['Two hundred people lost their jobs.','Two hundred people were hired.','Two hundred workers went on holiday.'], exp:'lay off = dismiss.', fr:'200 personnes ont été licenciées.'},
  {say:'We\'re in the red this month.', o:['The company is losing money.','The company is making a big profit.','The office has been painted red.'], exp:'in the red = losing money. Watch the “same word” trap: red!', fr:'nous sommes dans le rouge.'}
];

D.phrases = [
  {h:'1 · Greeting', l:[['Dear Ms Carter,','formal · nom connu'],['Dear Sir or Madam,','formal · nom inconnu'],['Hello Alex, / Hi Alex,','informal · collègue']]},
  {h:'2 · Purpose', l:[['I am writing to ask about…','Je vous écris pour demander…'],['I am writing regarding…','Je vous écris au sujet de…'],['Following our phone call, …','Suite à notre appel, …']]},
  {h:'3 · Details', l:[['Please find attached…','Veuillez trouver ci-joint…'],['As requested, …','Comme demandé, …'],['The meeting will take place on…','La réunion aura lieu le…']]},
  {h:'4 · Request', l:[['Could you please…?','Pourriez-vous… ?'],['Would it be possible to…?','Serait-il possible de… ?'],['I would be grateful if you could…','Je vous serais reconnaissant(e) de…']]},
  {h:'5 · Closing', l:[['I look forward to hearing from you.','Dans l\'attente de votre réponse.'],['Please let me know if you have any questions.','N\'hésitez pas si vous avez des questions.'],['Kind regards, / Best regards,','Cordialement,']]}
];

D.w1 = [
  'Subject: Change of date for our meeting',
  'Dear Ms Carter,',
  'I am writing about our meeting planned for Tuesday 14 May.',
  'Unfortunately, I have to travel to Lyon that day for an urgent client visit.',
  'Would it be possible to meet on Thursday at 10 a.m. instead?',
  'I apologise for any inconvenience and look forward to hearing from you.',
  'Kind regards,',
  'Julien Moreau'
];

D.w2 = {
  columns:['Formal 🎩','Informal 👋'],
  items:[
    {t:'Dear Mr Lee,',c:0},{t:'I would be grateful if you could…',c:0},{t:'Please do not hesitate to contact me.',c:0},{t:'Yours sincerely,',c:0},{t:'I am writing to inform you that…',c:0},{t:'Please find attached…',c:0},
    {t:'Hi Sam!',c:1},{t:'Thanks a lot!',c:1},{t:'Can you…?',c:1},{t:'Cheers,',c:1},{t:'Just a quick note to say…',c:1},{t:'Here\'s the file.',c:1}
  ]
};

D.w3 = [
  {q:'The train was late. ___, I missed the meeting.', o:['As a result','However','Although','For example'], exp:'Result → As a result.', fr:'Conséquence → As a result.'},
  {q:'The product is excellent. ___, it is quite expensive.', o:['However','Therefore','Because','In addition'], exp:'Contrast → However.', fr:'Opposition → However.'},
  {q:'___ it was raining, the event was a success.', o:['Although','However','Despite','Because'], exp:'Although + subject + verb. (Despite + noun.)', fr:'Although + sujet + verbe ; despite + nom.'},
  {q:'We chose this supplier ___ their prices are lower.', o:['because','although','however','despite'], exp:'Reason → because.', fr:'Cause → because.'},
  {q:'The hotel is near the station. ___, it has free parking.', o:['In addition','However','Although','As a result'], exp:'Adding information → In addition.', fr:'Ajout → In addition.'},
  {q:'We offer many services. ___, we provide training and translation.', o:['For example','However','Although','Therefore'], exp:'Example → For example.', fr:'Exemple → For example.'},
  {q:'___, we cannot accept your request.', o:['Unfortunately','Fortunately','Although','Because'], exp:'Bad news → Unfortunately.', fr:'Mauvaise nouvelle → Unfortunately.'},
  {q:'Sales were low. ___, we are reducing costs.', o:['Therefore','However','Although','For example'], exp:'Result → Therefore.', fr:'Conséquence → Therefore.'}
];

D.w4 = [
  {q:'I ___ your email yesterday.', o:['received','have received','receive','am receiving'], exp:'yesterday → past simple.'},
  {q:'We ___ the client next Monday at 10 a.m. (it\'s in the diary).', o:['are meeting','met','have met','were meeting'], exp:'Fixed arrangement → present continuous.'},
  {q:'Don\'t worry, I ___ the documents today.', o:['will send','sent','send','was sending'], exp:'Promise → will.'},
  {q:'I have just ___ the invoice.', o:['paid','pay','paying','pays'], exp:'have just + past participle.'},
  {q:'___ you send me the price list, please?', o:['Could','Must','Shall','Are'], exp:'Polite request → Could you…?'},
  {q:'I ___ be grateful if you could reply by Friday.', o:['would','will','am','can'], exp:'I would be grateful if you could…'},
  {q:'Next year, we ___ open a new office in Madrid (it\'s our plan).', o:['are going to','have','did','were'], exp:'Plan / intention → be going to.'},
  {q:'Thank you for your email. I\'m sorry I ___ sooner.', o:['didn\'t reply','don\'t reply','won\'t reply','am not replying'], exp:'I\'m sorry I didn\'t reply sooner (finished past).'}
];

D.tasks1 = [
  {t:'Reschedule a meeting', task:'You need to move a meeting with your colleague Alex from Tuesday to Thursday.', points:['Explain why you cannot come on Tuesday','Suggest a day and a time','Ask Alex to confirm'], key:/tuesday|thursday|meeting/i,
   A2:'Subject: Our meeting\n\nHello Alex,\n\nI can\'t come to our meeting on Tuesday because I have a doctor\'s appointment. Can we meet on Thursday at 10 a.m.? Please tell me if this is OK for you.\n\nThanks,\nSam',
   B1:'Subject: Request to reschedule our meeting\n\nDear Alex,\n\nI hope you are well. I am writing to ask whether we could move our meeting on Tuesday to Thursday, as I have an unexpected commitment that I cannot change.\n\nWould 10:30 a.m. on Thursday work for you? If not, I would be happy to find another time.\n\nCould you please confirm your availability? Thank you for your understanding.\n\nKind regards,\nSam',
   B2:'Subject: Rescheduling Tuesday\'s project meeting\n\nDear Alex,\n\nI hope this email finds you well. Unfortunately, I need to reschedule our project meeting on Tuesday, as I have been asked to attend an urgent client visit in Lyon that day.\n\nWould Thursday morning suit you instead? I am available from 9:30 onwards and could book Meeting Room 2 if that is convenient. In the meantime, I will send you the updated figures so that we can make the most of our time.\n\nCould you let me know by Wednesday whether this works for you? I apologise for any inconvenience.\n\nKind regards,\nSam'},
  {t:'Problem with an order', task:'You received an order from a supplier, but 10 items are missing.', points:['Give the order number','Explain the problem','Ask for a solution and a date'], key:/order|missing|deliver/i,
   A2:'Subject: Problem with my order\n\nDear Sir or Madam,\n\nI received my order today (number 4521). There is a problem: 10 items are missing. I ordered 50 boxes but I have only 40. Can you send the 10 boxes, please?\n\nThank you,\nSam Martin',
   B1:'Subject: Missing items – order no. 4521\n\nDear Sir or Madam,\n\nI am writing about order no. 4521, which arrived this morning. Unfortunately, the delivery was incomplete: we ordered 50 boxes of paper, but we only received 40.\n\nCould you please send the 10 missing boxes as soon as possible? We need them for an event next week.\n\nThank you in advance for your help.\n\nKind regards,\nSam Martin',
   B2:'Subject: Incomplete delivery – order no. 4521\n\nDear Ms Green,\n\nI am writing regarding order no. 4521, which was delivered to our office this morning. On checking the delivery, we noticed that 10 of the 50 boxes we ordered were missing, although the delivery note lists the full quantity.\n\nAs we need the complete order for a client event on 12 June, I would be grateful if you could arrange for the remaining boxes to be sent by Friday at the latest. Alternatively, please let me know whether a partial refund would be possible.\n\nI look forward to your prompt reply.\n\nYours sincerely,\nSam Martin\nOffice Manager'},
  {t:'Ask for information', task:'You want to attend a Business English course. Write to the organiser.', points:['Say what you saw / why you are writing','Ask about dates and price','Ask if the course is online'], key:/course|date|price|online/i,
   A2:'Subject: English course\n\nHello,\n\nI would like to do your English course. When does it start? How much does it cost? Is it online? I work during the day, so I prefer evening classes.\n\nThank you,\nSam',
   B1:'Subject: Information about your English course\n\nDear Sir or Madam,\n\nI saw your advertisement for the Business English course and I am very interested. Could you please tell me when the next session starts and how much it costs? I would also like to know if the course is available online, because I travel a lot for work.\n\nI look forward to hearing from you.\n\nBest regards,\nSam Martin',
   B2:'Subject: Enquiry – Business English course\n\nDear Course Coordinator,\n\nI came across your Business English programme on your website and I would like some further information before registering.\n\nFirstly, could you tell me the dates of the next session and the total cost, including materials? Secondly, as my schedule changes frequently, I would like to know whether the course can be followed online and whether recordings are available. Finally, does the course include preparation for a certification such as Bright?\n\nThank you in advance for your help. I look forward to hearing from you.\n\nKind regards,\nSam Martin'}
];

D.tasks2 = [
  {t:'Working from home', task:'Is working from home a good idea? Give your opinion with reasons and examples.',
   B1:'In my opinion, working from home is a good idea, but not every day.\n\nFirst of all, people save time because they do not need to travel to the office. For example, my colleague lives one hour from our office, so working from home gives her two extra hours each day. She feels less tired and she is more productive.\n\nHowever, working from home can also be lonely. It is more difficult to share ideas and to ask quick questions. Some people also find it hard to stop working in the evening.\n\nAs a result, I think the best solution is a mix: two or three days at home and the other days in the office. This way, employees can be efficient and still keep a good relationship with their team.\n\nIn conclusion, working from home is positive if it is well organised.',
   B2:'Working from home has become common since 2020, and in my view it is a positive change, provided that it is well managed.\n\nThe main advantage is flexibility. Employees save time and money on commuting, which often leads to better concentration and a healthier work-life balance. For instance, in my company, people who work remotely twice a week say they feel less stressed and more productive.\n\nOn the other hand, remote work can weaken team spirit. Informal conversations, which often generate new ideas, are much less frequent online, and new employees may struggle to learn from more experienced colleagues.\n\nTherefore, I believe a hybrid model is the most effective approach. Companies should define clear rules, such as fixed office days for meetings and collaboration.\n\nTo sum up, working from home is beneficial as long as it does not replace human contact completely.'},
  {t:'English at work', task:'Why is it important to speak English at work today? Give reasons and examples.',
   B1:'Today, English is very important at work for several reasons.\n\nFirst, many companies work with international clients and suppliers. If you speak English, you can write emails, answer the phone and take part in meetings without help. For example, in my job I often receive emails from partners in Germany and Spain, and we always communicate in English.\n\nSecond, English can help you find a better job. Many job advertisements ask for a good level of English, and a certificate like Bright shows your level to an employer.\n\nFinally, English is useful when you travel for business or attend training courses.\n\nHowever, learning a language takes time and practice, so it is a good idea to practise a little every day.\n\nIn conclusion, English opens many doors in your professional life.',
   B2:'In today\'s global economy, English has become the common language of business, and I believe that speaking it well is no longer optional.\n\nFirstly, English allows professionals to communicate directly with international partners. When there is no need for a translator, negotiations are faster and misunderstandings are less likely. In my own experience, being able to explain a technical problem in English during a video call saved our team several days.\n\nSecondly, English has a significant impact on career prospects. Employers increasingly expect candidates to prove their level with a recognised certification.\n\nAdmittedly, not every job requires daily use of English. Nevertheless, even occasional tasks, such as reading documentation or attending a webinar, are much easier for confident speakers.\n\nFor these reasons, investing in English is one of the most valuable decisions a professional can make.'}
];

D.s1 = [
  {q:'I usually ___ my day by checking my emails.', o:['start','am starting','started','have started'], exp:'Routine (usually) → present simple.'},
  {q:'At the moment, I ___ on a new project.', o:['am working','work','worked','have worked'], exp:'At the moment → present continuous.'},
  {q:'I ___ for this company for six years, and I still enjoy it.', o:['have worked','worked','work','am working'], exp:'for + still true → present perfect.'},
  {q:'Last year, I ___ to a conference in Berlin.', o:['went','have gone','go','am going'], exp:'Last year → past simple.'},
  {q:'Next month, I ___ start a new training course (it\'s planned).', o:['am going to','went to','have','was'], exp:'Plan → be going to.'},
  {q:'Today, my team ___ eight people.', o:['has','is having','have','having'], exp:'Fact / possession → present simple (has).'},
  {q:'When I was a student, I ___ in a restaurant.', o:['worked','have worked','work','am working'], exp:'When I was… → past simple.'},
  {q:'I would like ___ my English for my career.', o:['to improve','improving','improve','improved'], exp:'would like + to + verb.'}
];

D.speakBank = [
  {h:'Introducing yourself', l:[['My name is… and I work as a…','Je m\'appelle… et je travaille comme…'],['I\'m based in…','Je travaille / vis à…'],['I\'ve been in this position for… years.','J\'occupe ce poste depuis… ans.']]},
  {h:'Describing your job', l:[['I\'m responsible for…','Je suis responsable de…'],['My main tasks include…','Mes principales missions sont…'],['On a typical day, I…','Une journée type, je…']]},
  {h:'Giving your opinion', l:[['In my opinion, …','À mon avis, …'],['From my experience, …','D\'après mon expérience, …'],['I think that… because…','Je pense que… parce que…']]},
  {h:'Buying time', l:[['That\'s a good question. Let me think…','Bonne question. Laissez-moi réfléchir…'],['How can I put it?','Comment dire ?'],['Well, it depends.','Eh bien, ça dépend.']]},
  {h:'Asking for help', l:[['Could you repeat the question, please?','Pourriez-vous répéter la question ?'],['Sorry, do you mean…?','Pardon, vous voulez dire… ?'],['What I mean is…','Ce que je veux dire, c\'est…']]},
  {h:'Examples & conclusion', l:[['For instance, last month…','Par exemple, le mois dernier…'],['That\'s why…','C\'est pour ça que…'],['To sum up, …','Pour résumer, …']]}
];

D.prompts = [
  {t:'Introduce yourself', q:'Could you introduce yourself, please?', fr:'Pouvez-vous vous présenter ?',
   A2:'My name is Claire. I live in Nantes with my husband and my two children. I work in a bank. I am an assistant. I like my job because I talk to many people. In my free time, I like walking and cooking.',
   B1:'My name is Claire Dubois and I live near Nantes. I work for a regional bank, where I\'m an administrative assistant. I\'ve been in this job for about five years. I really enjoy it because I\'m in contact with customers every day. Outside work, I like hiking at the weekend and I\'m learning to cook Italian food.',
   B2:'I\'m Claire Dubois and I\'m based just outside Nantes. I\'ve been working for a regional bank for about five years now, currently as an administrative assistant in the customer service department. What I appreciate most about my role is the variety: no two days are the same. At the moment, I\'m also preparing for an English certification, because our bank is developing partnerships abroad and I\'d like to be involved.'},
  {t:'Your job and a typical day', q:'What do you do, and what is a typical day like for you?', fr:'Que faites-vous, et comment se passe une journée type ?',
   A2:'I work in an office. I start at 8:30. First, I read my emails. Then I answer the phone and I help clients. I have lunch at 12:30. In the afternoon, I prepare documents. I finish at 5 p.m.',
   B1:'I\'m responsible for customer orders in a small company. On a typical day, I start by checking new orders and emails. After that, I contact suppliers to make sure deliveries are on time. I often have short meetings with my manager. The best part of my job is solving problems for customers, but it can be stressful when we\'re busy.',
   B2:'My main role is to manage customer orders from start to finish. A typical day begins with a quick review of incoming orders and any urgent issues. I then liaise with our suppliers and the logistics team to make sure everything is delivered on schedule. Part of my job also involves analysing delays so that we can improve our processes. It\'s demanding, but I find it rewarding when a difficult situation ends with a satisfied client.'},
  {t:'A challenge you faced', q:'Can you tell me about a problem you had to solve at work?', fr:'Parlez-moi d\'un problème que vous avez dû résoudre au travail.',
   A2:'Last month, we had a problem. A client was angry because his order was late. I called him and I said sorry. I found a new delivery date. In the end, he was happy.',
   B1:'Recently, an important client called because his delivery was two weeks late. First, I listened to him and apologised. Then I contacted the warehouse and found the problem: the address was wrong. We sent the order again by express delivery. The client was satisfied, and I learned that it\'s important to stay calm and keep the client informed.',
   B2:'A few months ago, we were about to lose a major client after a series of late deliveries. I organised a call with the client to understand exactly what had gone wrong, and then worked with our logistics team to identify the cause, which turned out to be a data-entry error. We introduced a double-check system and offered the client a discount on the next order. As a result, we kept the account, and the procedure is now used across the department.'},
  {t:'Your goals and English', q:'Why are you learning English, and what are your plans?', fr:'Pourquoi apprenez-vous l\'anglais et quels sont vos projets ?',
   A2:'I want to improve my English because I need it for my job. Sometimes I write emails to clients in England. Next year, I would like to travel to London. I am going to practise every week.',
   B1:'I\'d like to improve my English for two reasons. First, I use it more and more at work, especially for emails and phone calls. Second, I\'d like to get a certificate to show my level to my employer. In the future, I\'m hoping to work on international projects, so I\'m going to practise a little every day.',
   B2:'English has become essential in my role, since more and more of our partners are based abroad. In the short term, my goal is to obtain a recognised certification, which would support my application for an international position. In the longer term, I\'d like to feel completely comfortable leading meetings in English. To get there, I\'m planning to combine regular lessons with reading and listening practice every day.'}
];

/* ---------- Exams ---------- */
D.discoveryWritten = [
  {q:'Could you remind me ___ the report before Friday?', o:['to send','sending','send','sent'], exp:'remind someone + to + verb.'},
  {q:'I\'m looking forward ___ you next week.', o:['to meeting','to meet','meeting','meet'], exp:'look forward to + -ing.'},
  {q:'We ___ three new clients since January.', o:['have signed','signed','sign','are signing'], exp:'since → present perfect.'},
  {q:'The meeting was postponed ___ the director was ill.', o:['because','despite','although','so'], exp:'Reason → because.'},
  {q:'There has been a sharp increase ___ sales this quarter.', o:['in','of','at','on'], exp:'an increase in…'},
  {q:'She is responsible ___ the training budget.', o:['for','of','to','with'], exp:'responsible for…'},
  {q:'The presentation was very ___.', o:['successful','success','succeed','successfully'], exp:'After “was very” → adjective.'},
  {q:'If the delivery ___ late, we will contact the supplier.', o:['is','will be','was','would be'], exp:'If + present, will + verb (first conditional).'},
  {q:'Please ___ the attached document and send me your comments.', o:['review','reviewing','to review','reviewed'], exp:'Please + base verb (imperative).'},
  {q:'I ___ to the London office last year.', o:['went','have gone','go','was going'], exp:'last year → past simple.'},
  {q:'How long ___ here?', o:['have you worked','do you work','are you working','did you work'], exp:'How long + still true → present perfect.'},
  {q:'Our flight was ___ because of the storm, so we left the next day.', o:['cancelled','booked','boarded','landed'], exp:'cancelled = annulé.'}
];
D.discoveryListening = [
  {say:'I\'m afraid Mr Patel is tied up in a meeting until three.', o:['Mr Patel is busy until 3 p.m.','Mr Patel has left the office.','The meeting starts at three.'], exp:'tied up = busy.'},
  {say:'Could you get back to me by the end of the week?', o:['Please reply before the end of the week.','Please come back to the office this week.','Please return it at the end of the month.'], exp:'get back to me = reply / contact me.'},
  {say:'Our sales figures are well below target this quarter.', o:['The company sold less than expected.','The company reached its target.','Sales are the same as last quarter.'], exp:'below target = less than the objective.'},
  {say:'The flight to Madrid has been put back by two hours.', o:['The flight will leave later.','The flight has been cancelled.','The flight will leave two hours earlier.'], exp:'put back = postponed.'},
  {say:'Let\'s not talk shop during lunch, shall we?', o:['Let\'s not discuss work during lunch.','Let\'s go shopping after lunch.','Let\'s discuss work during lunch.'], exp:'talk shop = talk about work.'},
  {say:'We\'re short-staffed this week, so deliveries may run late.', o:['There are not enough employees, so deliveries may be delayed.','There are too many employees this week.','Deliveries will arrive early this week.'], exp:'short-staffed = not enough staff.'}
];
D.finalWritten = [
  {q:'The manager suggested ___ the deadline by one week.', o:['extending','to extend','extend','extended'], exp:'suggest + -ing.'},
  {q:'We decided ___ a new supplier.', o:['to choose','choosing','choose','chosen'], exp:'decide + to + verb.'},
  {q:'I ___ for this company for five years now.', o:['have worked','work','worked','am working'], exp:'for + now → present perfect.'},
  {q:'When ___ the contract?', o:['did you sign','have you signed','do you signed','you signed'], exp:'When…? → past simple.'},
  {q:'Our team is in charge ___ customer complaints.', o:['of','for','about','on'], exp:'in charge of…'},
  {q:'It depends ___ the budget.', o:['on','of','from','at'], exp:'depend on…'},
  {q:'She applied ___ the position of sales manager.', o:['for','to','at','on'], exp:'apply for a job.'},
  {q:'The new process has improved our ___.', o:['efficiency','efficient','efficiently','efficience'], exp:'After “our” → noun.'},
  {q:'He answered the client\'s questions very ___.', o:['professionally','professional','profession','professionalism'], exp:'Describes the verb → adverb.'},
  {q:'___ the bad weather, the conference took place as planned.', o:['Despite','Although','Because','However'], exp:'Despite + noun.'},
  {q:'We haven\'t received the invoice ___.', o:['yet','already','still','ever'], exp:'Negative + yet.'},
  {q:'Have you ___ been to our Lyon office?', o:['ever','yet','since','ago'], exp:'Have you ever…? = experience.'},
  {q:'The shipment arrived two days ___.', o:['ago','since','for','during'], exp:'two days ago.'},
  {q:'I would appreciate it if you ___ me a quote.', o:['could send','can sent','will send','sending'], exp:'I would appreciate it if you could…'},
  {q:'We need to ___ a decision before the end of the day.', o:['make','do','put','give'], exp:'make a decision.'}
];
D.finalListening = [
  {say:'The printer on the second floor is out of order again.', o:['The printer is not working.','The printer needs more paper.','The printer has been moved.'], exp:'out of order = not working.'},
  {say:'I\'ll be working from home on Friday.', o:['She won\'t be in the office on Friday.','She is taking Friday off.','She will work late on Friday.'], exp:'working from home = not in the office, but still working.'},
  {say:'We\'re running behind schedule on the Hamilton project.', o:['The project is late.','The project finished early.','The project has been cancelled.'], exp:'behind schedule = late.'},
  {say:'Could you put me through to the accounts department?', o:['The caller wants to be transferred.','The caller wants to visit the department.','The caller wants to send the accounts.'], exp:'put me through = transfer my call.'},
  {say:'The price includes delivery but not installation.', o:['Installation costs extra.','Delivery costs extra.','Everything is included.'], exp:'not installation = you pay extra for it.'},
  {say:'Sorry, I didn\'t catch your name.', o:['The speaker didn\'t hear the name.','The speaker forgot to give his name.','The speaker doesn\'t like the name.'], exp:'didn\'t catch = didn\'t hear / understand.'},
  {say:'Sales went up by fifteen percent last year.', o:['Sales increased by 15%.','Sales decreased by 15%.','Sales increased by 50%.'], exp:'went up = increased; fifTEEN = 15.'},
  {say:'Let\'s touch base again next Monday.', o:['Let\'s talk again next Monday.','Let\'s meet at the base on Monday.','Let\'s finish the project on Monday.'], exp:'touch base = talk briefly again.'}
];
D.exams = {
  discovery:{title:'Discovery test', parts:[
    {name:'Part 1 · Written expression', type:'written', seconds:45, items:D.discoveryWritten, instr:'Choose the word or phrase that best completes the sentence.'},
    {name:'Part 2 · Listening', type:'listening', seconds:60, items:D.discoveryListening, instr:'Listen to the sentence. Choose the answer that best matches its meaning.'}]},
  final:{title:'Final mock · Lesson 01', parts:[
    {name:'Part 1 · Written expression', type:'written', seconds:45, items:D.finalWritten, instr:'Choose the word or phrase that best completes the sentence.'},
    {name:'Part 2 · Listening', type:'listening', seconds:60, items:D.finalListening, instr:'Listen to the sentence. Choose the answer that best matches its meaning.'}]}
};

D.checklist = [
  'I have my ID document ready.',
  'I have read my convocation and the centre\'s instructions.',
  'My computer, headset and microphone work.',
  'My internet connection is stable.',
  'I will be in a quiet room, alone, without notes.',
  'I know: 45 s per written question, 60 s per listening question, no going back, never leave a blank.'
];
D.survey = [
  'The explanations were clear.',
  'The exercises were useful.',
  'The games were fun.',
  'I understand the test format.',
  'I feel more confident for the exam.'
];

/* Activities per section (for progress) */
const SECTIONS = {
  home:[], exam:['examQuiz'], lab:['discovery'], vocab:['vocabQuiz'], g1:['g1'], g2:['g2sort','g2'], g3:['g3'], g4:['g4'],
  listen:['l1','l2','l3'], write:['w1','w2','w3','w4','task1','task2'], speak:['s1','speak'], arcade:['sprint','match'], final:['final']
};
const ALL = Object.values(SECTIONS).flat();
const LABELS = {examQuiz:'Exam rules quiz',discovery:'Discovery test',vocabQuiz:'Vocabulary quiz',g1:'Verb + to / -ing',g2sort:'Time words sorting',g2:'Present perfect vs past simple',g3:'Prepositions',g4:'Word families',l1:'Listening expressions',l2:'Number traps',l3:'Listening practice',w1:'Email order',w2:'Formal / informal',w3:'Linking words',w4:'Tenses in emails',task1:'Writing task 1 (email)',task2:'Writing task 2 (140 words)',s1:'Speaking tenses',speak:'Speaking studio',sprint:'Grammar Sprint',match:'Word Match',final:'Final mock'};

/* ---------------------------------------------------------
   2. STATE & HELPERS
--------------------------------------------------------- */
const KEY = 'set_bright_l01_v3';
let S = {name:'', xp:0, fr:true, accent:'en-GB', rate:0.95, done:{}, scores:{}, exams:{}, best:{}, drafts:{}, checks:[], survey:{}, comments:'', notes:'', page:'home'};
function load(){ try{ const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if(s) S = Object.assign(S, s); }catch(e){} }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }

const $ = id => document.getElementById(id);
function el(tag, attrs, ...kids){
  const e = document.createElement(tag);
  for(const [k,v] of Object.entries(attrs || {})){
    if(v == null || v === false) continue;
    if(k === 'class') e.className = v;
    else if(k === 'text') e.textContent = v;
    else if(k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  kids.flat().forEach(c => { if(c == null || c === false) return; e.append(c.nodeType ? c : document.createTextNode(c)); });
  return e;
}
function shuffle(a){ a = a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
/* shuffle so the correct answer is not always in the same place */
function shuffleOpts(o){ let s = shuffle(o); if(o.length > 2 && s[0] === o[0] && Math.random() < .75) s = shuffle(o); return s; }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
function gap(text, fill){
  const span = el('span');
  const parts = String(text).split('___');
  parts.forEach((p,i) => { span.append(p); if(i < parts.length-1) span.append(el('span',{class:'blank'+(fill?' filled':'')}, fill || '    ')); });
  return span;
}
const PRAISE = ['✓ Excellent!','✓ Well done!','✓ Perfect!','✓ Great job!','✓ Spot on!','✓ Brilliant!'];
const OOPS = ['Not quite.','Almost!','Careful!','Not this time.'];
function toast(msg){ const t=$('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('show'),2200); }
function confetti(){
  const box=$('confetti'), colors=['#ffb703','#fb8500','#219ebc','#8ecae6','#6c5ce7','#e85d75','#1f9d72'];
  for(let i=0;i<90;i++){
    const c=el('i'); c.style.left=Math.random()*100+'vw'; c.style.background=pick(colors);
    c.style.animationDuration=(1.6+Math.random()*1.6)+'s'; c.style.animationDelay=(Math.random()*.4)+'s';
    c.style.transform='rotate('+Math.random()*360+'deg)'; box.append(c); setTimeout(()=>c.remove(),3800);
  }
}
function level(xp){ return xp>=1500?'Bright Star':xp>=900?'Shining':xp>=450?'Rising':xp>=150?'Warming up':'Starter'; }
function addXP(n){ if(n<=0) return; S.xp += n; $('xpCount').textContent=S.xp; $('xpLevel').textContent=level(S.xp); const x=document.querySelector('.xp'); x.classList.remove('bump'); void x.offsetWidth; x.classList.add('bump'); toast('+'+n+' ☀️ Bright points'); save(); }
function complete(id, c, t){
  const first = !S.done[id];
  const prev = S.scores[id];
  S.done[id] = true;
  if(t != null && (!prev || c >= prev.c)) S.scores[id] = {c, t};
  if(first) addXP(t ? Math.max(10, c*10) : 30);
  if(t && c === t) confetti();
  save(); progress();
}

/* ---------------------------------------------------------
   3. SPEECH (UK / US, never autoplay)
--------------------------------------------------------- */
let VOICES = [];
function loadVoices(){ try{ VOICES = speechSynthesis.getVoices() || []; }catch(e){ VOICES = []; } }
if('speechSynthesis' in window){ loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function pickVoice(lang){
  const norm = v => (v.lang || '').replace('_','-').toLowerCase();
  const en = VOICES.filter(v => norm(v).startsWith('en'));
  const exact = en.filter(v => norm(v) === lang.toLowerCase());
  const pref = lang === 'en-GB' ? /(Google UK|Daniel|Serena|Kate|Libby|Sonia|Ryan|Arthur|Martha|Hazel|George)/i : /(Google US|Samantha|Alex|Aria|Jenny|Guy|Allison|Ava|Zira|David)/i;
  return exact.find(v => pref.test(v.name)) || exact[0] || en.find(v => pref.test(v.name)) || en[0] || null;
}
let speakingBtn = null;
function speak(text, btn, onend){
  if(!('speechSynthesis' in window)){ toast('Audio is not available in this browser.'); return; }
  speechSynthesis.cancel();
  if(speakingBtn) speakingBtn.classList.remove('playing');
  if(!VOICES.length) loadVoices();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = S.accent;                         // forces English even on iOS
  const v = pickVoice(S.accent); if(v) u.voice = v;
  u.rate = Number(S.rate) || .95;
  speakingBtn = btn || null;
  if(btn) btn.classList.add('playing');
  const done = () => { if(btn) btn.classList.remove('playing'); if(onend) onend(); };
  u.onend = done; u.onerror = done;
  speechSynthesis.speak(u);
}
function stopSpeech(){ if('speechSynthesis' in window) speechSynthesis.cancel(); if(speakingBtn) speakingBtn.classList.remove('playing'); }
document.addEventListener('click', e => { const b = e.target.closest('[data-say]'); if(b){ e.preventDefault(); speak(b.dataset.say, b); } });
function sayBtn(text){ return el('button',{class:'say','data-say':text,title:'Listen','aria-label':'Listen',type:'button'},'🔊'); }

/* ---------------------------------------------------------
   4. EXERCISE ENGINES
--------------------------------------------------------- */
/* 4a · Multiple choice (gap-fill / meaning / listening) */
function mcq(rootId, id, items, opt){
  opt = opt || {};
  const root = $(rootId); if(!root) return;
  function build(){
    root.innerHTML = '';
    let answered = 0, correct = 0;
    const scoreTxt = el('span',{}, '0 / '+items.length), mini = el('div');
    root.append(el('div',{class:'ex-head'}, el('div',{class:'ex-title'}, opt.title || (items.length+' questions · instant feedback')), el('div',{class:'ex-score'}, el('div',{class:'mini'}, mini), scoreTxt)));
    const doneBox = el('div',{class:'ex-done',hidden:true});
    items.forEach((it, n) => {
      const card = el('div',{class:'q'});
      const qt = el('div',{class:'qtext'});
      if(it.q) qt.append(gap(it.q)); else qt.append(el('span',{class:'small'}, 'Listen and choose the best meaning.'));
      card.append(el('div',{class:'qtop'}, el('span',{class:'qnum'}, n+1), qt));
      let transcript = null;
      if(it.say){
        let plays = 0;
        const cnt = el('span',{class:'small'}, '');
        const pb = el('button',{class:'playbtn',type:'button'}, '▶ Play');
        pb.onclick = () => { plays++; pb.textContent='↻ Replay'; cnt.textContent='played '+plays+'×'; speak(it.say, pb); };
        transcript = el('div',{class:'transcript',hidden:true}, '📄 ', el('i',{}, it.say));
        const tb = el('button',{class:'linkbtn',type:'button'}, 'Show transcript');
        tb.onclick = () => { transcript.hidden = !transcript.hidden; tb.textContent = transcript.hidden ? 'Show transcript' : 'Hide transcript'; };
        card.append(el('div',{class:'qaux'}, pb, cnt, tb), transcript);
      }
      const opts = el('div',{class:'opts'+(it.o.length===3 && it.o.some(x=>x.length>22)?' three':'')});
      const fb = el('div',{class:'fb'});
      const ans = it.o[0];
      shuffleOpts(it.o).forEach((o,i) => {
        const b = el('button',{class:'opt',type:'button'}, el('span',{class:'L'}, 'ABCD'[i]), el('span',{}, o));
        b.onclick = () => choose(o, b);
        opts.append(b);
      });
      function choose(o, b){
        if(card.dataset.done) return;
        card.dataset.done = '1';
        const ok = o === ans;
        [...opts.children].forEach(x => { x.disabled = true; if(x.lastChild.textContent === ans) x.classList.add('right'); });
        if(!ok && b) b.classList.add('wrong');
        card.classList.add(ok ? 'ok' : 'ko');
        if(it.q){ qt.innerHTML=''; qt.append(gap(it.q, ans)); }
        fb.className = 'fb ' + (ok ? 'good' : 'bad');
        fb.innerHTML = '';
        fb.append(el('b',{}, b ? (ok ? pick(PRAISE) : pick(OOPS)+' The answer is “'+ans+'”.') : 'Answer: “'+ans+'”.'), ' ', it.exp || '');
        if(it.fr) fb.append(el('span',{class:'fr'}, it.fr));
        if(transcript) transcript.hidden = false;
        answered++; if(ok && b) correct++;
        update();
      }
      card._reveal = () => choose(null, null);
      card.append(opts);
      if(it.hint){
        const hb = el('button',{class:'linkbtn',type:'button'}, '💡 Hint');
        hb.onclick = () => { if(card.dataset.done) return; fb.className='fb hint'; fb.textContent='💡 '+it.hint; };
        card.append(el('div',{class:'qaux'}, hb));
      }
      card.append(fb);
      root.append(card);
    });
    function update(){
      scoreTxt.textContent = correct+' / '+items.length;
      mini.style.width = (answered/items.length*100)+'%';
      if(answered === items.length){
        doneBox.hidden = false;
        doneBox.textContent = (correct===items.length ? '🏆 Perfect score! ' : correct >= items.length*.7 ? '👏 Great work! ' : '💪 Good effort! Try again to improve. ') + 'You scored '+correct+' / '+items.length+'.';
        complete(id, correct, items.length);
      }
    }
    const reset = el('button',{class:'btn ghost small',type:'button'}, '↻ Try again (new order)');
    reset.onclick = build;
    const reveal = el('button',{class:'btn ghost small',type:'button'}, '👁 Show all answers');
    reveal.onclick = () => root.querySelectorAll('.q').forEach(c => { if(!c.dataset.done) c._reveal(); });
    root.append(doneBox, el('div',{class:'ex-tools'}, reset, reveal));
  }
  build();
}

/* 4b · Dropdown matching */
function matchDrop(rootId, id, pairs, opt){
  opt = opt || {};
  const root = $(rootId); if(!root) return;
  function build(){
    root.innerHTML = '';
    const answers = shuffle(pairs.map(p => p.answer));
    const scoreTxt = el('span',{}, '– / '+pairs.length);
    root.append(el('div',{class:'ex-head'}, el('div',{class:'ex-title'}, opt.title || 'Choose the meaning from each list, then press “Check”.'), el('div',{class:'ex-score'}, scoreTxt)));
    const rows = shuffle(pairs).map(p => {
      const sel = el('select',{}, el('option',{value:''}, '— choose —'), answers.map(a => el('option',{value:a}, a)));
      const mark = el('span',{class:'mark'});
      const row = el('div',{class:'mrow'}, el('b',{}, sayBtn(p.term), p.term), sel, mark);
      sel.onchange = () => { row.classList.remove('ok','ko'); mark.textContent=''; };
      row._check = () => { const ok = sel.value === p.answer; row.classList.toggle('ok', ok); row.classList.toggle('ko', !ok); mark.textContent = ok ? '✓' : '✗'; return ok; };
      row._show = () => { sel.value = p.answer; row._check(); };
      root.append(row);
      return row;
    });
    const doneBox = el('div',{class:'ex-done',hidden:true});
    const check = el('button',{class:'btn primary small',type:'button'}, '✓ Check');
    check.onclick = () => {
      const c = rows.filter(r => r._check()).length;
      scoreTxt.textContent = c+' / '+pairs.length;
      doneBox.hidden = false;
      doneBox.textContent = c===pairs.length ? '🏆 All correct!' : 'You have '+c+' / '+pairs.length+'. Change the red ones and check again.';
      if(c===pairs.length || rows.every(r => r.querySelector('select').value)) complete(id, c, pairs.length);
    };
    const reset = el('button',{class:'btn ghost small',type:'button'}, '↻ Reset');
    reset.onclick = build;
    const show = el('button',{class:'btn ghost small',type:'button'}, '👁 Show answers');
    show.onclick = () => rows.forEach(r => r._show());
    root.append(doneBox, el('div',{class:'ex-tools'}, check, reset, show));
  }
  build();
}

/* 4c · Sorting game (click or drag; many items per column) */
function sorter(rootId, id, data){
  const root = $(rootId); if(!root) return;
  function build(){
    root.innerHTML = '';
    let selected = null;
    const scoreTxt = el('span',{}, '– / '+data.items.length);
    root.append(el('div',{class:'ex-head'}, el('div',{class:'ex-title'}, 'Sort every card into the right column'), el('div',{class:'ex-score'}, scoreTxt)));
    root.append(el('p',{class:'sorthelp'}, '👆 Click a card, then click a column (or drag and drop). Click a placed card to send it back.'));
    const pool = el('div',{class:'pool'});
    const cols = data.columns.map((name, ci) => {
      const items = el('div',{class:'items'});
      const count = el('small',{}, '0');
      const col = el('div',{class:'col'}, el('h4',{}, name, count), items);
      col.dataset.ci = ci;
      col.onclick = e => { if(e.target.closest('.chipx')) return; if(selected){ place(selected, col); } };
      col.ondragover = e => { e.preventDefault(); col.classList.add('over'); };
      col.ondragleave = () => col.classList.remove('over');
      col.ondrop = e => { e.preventDefault(); col.classList.remove('over'); const c = root.querySelector('.chipx[data-k="'+e.dataTransfer.getData('text/plain')+'"]'); if(c) place(c, col); };
      col._items = items; col._count = count;
      return col;
    });
    pool.ondragover = e => e.preventDefault();
    pool.ondrop = e => { e.preventDefault(); const c = root.querySelector('.chipx[data-k="'+e.dataTransfer.getData('text/plain')+'"]'); if(c) back(c); };
    shuffle(data.items).forEach((it, k) => {
      const c = el('span',{class:'chipx',draggable:'true','data-k':String(k),tabindex:'0'}, it.t);
      c._c = it.c;
      c.ondragstart = e => e.dataTransfer.setData('text/plain', String(k));
      c.onclick = () => {
        if(c.parentElement !== pool){ back(c); return; }
        if(selected === c){ c.classList.remove('sel'); selected = null; cols.forEach(x=>x.classList.remove('target')); return; }
        if(selected) selected.classList.remove('sel');
        selected = c; c.classList.add('sel'); cols.forEach(x=>x.classList.add('target'));
      };
      c.onkeydown = e => { if(e.key==='Enter') c.click(); };
      pool.append(c);
    });
    function counts(){ cols.forEach(col => col._count.textContent = col._items.children.length); pool.classList.toggle('empty', !pool.children.length); }
    function place(c, col){ c.classList.remove('sel','ok','ko'); col._items.append(c); selected = null; cols.forEach(x=>x.classList.remove('target')); counts(); }
    function back(c){ c.classList.remove('sel','ok','ko'); pool.append(c); counts(); }
    root.append(pool, el('div',{class:'cols'}, cols));
    const doneBox = el('div',{class:'ex-done',hidden:true});
    const check = el('button',{class:'btn primary small',type:'button'}, '✓ Check');
    check.onclick = () => {
      let c = 0;
      cols.forEach((col, ci) => [...col._items.children].forEach(ch => { const ok = ch._c === ci; ch.classList.toggle('ok', ok); ch.classList.toggle('ko', !ok); if(ok) c++; }));
      scoreTxt.textContent = c+' / '+data.items.length;
      doneBox.hidden = false;
      if(pool.children.length) doneBox.textContent = c+' correct so far. Place the remaining cards, then check again.';
      else { doneBox.textContent = c===data.items.length ? '🏆 Perfect sorting!' : c+' / '+data.items.length+' correct. Click the red cards to move them, then check again.'; complete(id, c, data.items.length); }
    };
    const reset = el('button',{class:'btn ghost small',type:'button'}, '↻ Reset');
    reset.onclick = build;
    const show = el('button',{class:'btn ghost small',type:'button'}, '👁 Show answers');
    show.onclick = () => { [...root.querySelectorAll('.chipx')].forEach(ch => cols[ch._c]._items.append(ch)); counts(); check.onclick(); };
    root.append(doneBox, el('div',{class:'ex-tools'}, check, reset, show));
    counts();
  }
  build();
}

/* 4d · Put in order (click the next line) */
function orderer(rootId, id, lines){
  const root = $(rootId); if(!root) return;
  function build(){
    root.innerHTML = '';
    let next = 0, mistakes = 0;
    const scoreTxt = el('span',{}, '0 / '+lines.length);
    root.append(el('div',{class:'ex-head'}, el('div',{class:'ex-title'}, 'Click the lines in the correct order to build the email.'), el('div',{class:'ex-score'}, scoreTxt)));
    const left = el('div',{class:'olines'}), right = el('div',{class:'oresult'});
    shuffle(lines.map((t,i)=>({t,i}))).forEach(l => {
      const b = el('button',{type:'button'}, l.t);
      b.onclick = () => {
        if(l.i === next || lines[l.i] === lines[next]){
          right.append(el('div',{}, l.t)); b.remove(); next++; scoreTxt.textContent = next+' / '+lines.length;
          if(next === lines.length){ doneBox.hidden=false; doneBox.textContent = mistakes===0 ? '🏆 Perfect order, first time!' : '✓ Email complete! Mistakes on the way: '+mistakes+'.'; complete(id, Math.max(0, lines.length - mistakes), lines.length); }
        } else { mistakes++; b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); toast('Not yet. Think: which step comes next?'); }
      };
      left.append(b);
    });
    root.append(el('div',{class:'orderbox'}, el('div',{}, el('h4',{}, 'Lines'), left), el('div',{}, el('h4',{}, 'Your email'), right)));
    const doneBox = el('div',{class:'ex-done',hidden:true});
    const reset = el('button',{class:'btn ghost small',type:'button'}, '↻ Start again');
    reset.onclick = build;
    root.append(doneBox, el('div',{class:'ex-tools'}, reset));
  }
  build();
}

/* ---------------------------------------------------------
   5. PAGE BUILDERS
--------------------------------------------------------- */
function buildVocab(){
  const cats = ['All categories', ...new Set(D.vocab.map(v => v.c))];
  const sel = $('vocabCat');
  cats.forEach(c => sel.append(el('option',{value:c}, c)));
  const grid = $('vocabGrid');
  function render(){
    grid.innerHTML = '';
    D.vocab.filter(v => sel.value === 'All categories' || v.c === sel.value).forEach(v => {
      const fr = el('span',{class:'vfr',title:'Click to reveal'}, '🇫🇷 '+v.fr);
      fr.onclick = () => fr.classList.toggle('show');
      grid.append(el('div',{class:'vcard'}, el('span',{class:'cat'}, v.c), el('div',{class:'vtop'}, el('span',{class:'ico'}, v.i), el('b',{}, v.w), sayBtn(v.w)), fr, el('span',{class:'vex'}, '“'+v.ex+'” '), el('div',{}, sayBtn(v.ex))));
    });
  }
  sel.onchange = render; render();
  $('vocabHideFr').onclick = () => { grid.classList.toggle('selftest'); $('vocabHideFr').textContent = grid.classList.contains('selftest') ? '👀 Show translations' : '🙈 Hide translations (self-test)'; };
}
function buildPreps(){
  const g = $('prepGrid');
  D.preps.forEach(([w,p,fr]) => g.append(el('div',{}, sayBtn(w+' '+p), el('span',{}, w+' ', el('u',{}, p), el('small',{}, fr)))));
}
function buildExpr(){
  const g = $('exprGrid');
  D.expressions.forEach(x => g.append(el('div',{class:'expr'}, sayBtn(x.ex), el('b',{}, x.e), el('span',{}, '= '+x.m+' · ', el('i',{class:'fr'}, x.fr)), el('em',{}, '“'+x.ex+'”'))));
}
function buildBank(rootId, data){
  const r = $(rootId);
  data.forEach(g => r.append(el('div',{class:'pgroup'}, el('h4',{}, g.h), g.l.map(([en,fr]) => el('div',{class:'pline'}, sayBtn(en.replace(/\s*\/.*$/,'').replace(/…/g,'')), el('div',{}, el('b',{}, en), el('small',{class:'fr'}, fr)))))));
}

/* Writing workspaces */
const wc = t => (t.trim().match(/[A-Za-zÀ-ÿ0-9’'-]+/g) || []).length;
function buildTask1(){
  const r = $('task1');
  const sel = el('select',{}, D.tasks1.map((t,i)=>el('option',{value:i}, t.t)));
  const box = el('div',{class:'taskbox'});
  const ta = el('textarea',{rows:'10',placeholder:'Subject: …\n\nDear …,\n\n'});
  const count = el('span',{class:'wcount'}, '0 words');
  const checks = el('div',{class:'checks'});
  const model = el('div',{class:'model',hidden:true});
  const lv = el('div',{class:'levels'});
  const cur = () => D.tasks1[sel.value];
  function showTask(){
    const t = cur();
    box.innerHTML=''; box.append(el('b',{}, '📌 Situation: '), t.task, el('ul',{}, t.points.map(p => el('li',{}, p))), el('p',{class:'small'}, 'Aim for about 60–120 words.'));
    ta.value = S.drafts['t1_'+sel.value] || ''; upd(); model.hidden = true; checks.innerHTML=''; lv.querySelectorAll('button').forEach(b=>b.classList.remove('on'));
  }
  function upd(){ const n = wc(ta.value); count.textContent = n+' words'; count.classList.toggle('ok', n>=60 && n<=130); S.drafts['t1_'+sel.value] = ta.value; save(); }
  ['A2','B1','B2'].forEach(L => { const b = el('button',{class:'btn chip',type:'button'}, 'Show '+L+' model'); b.onclick = () => {
    const on = b.classList.contains('on'); lv.querySelectorAll('button').forEach(x=>x.classList.remove('on'));
    if(on){ model.hidden = true; return; } b.classList.add('on'); model.hidden=false; model.innerHTML=''; model.append(el('span',{class:'mlabel'}, L+' MODEL'), cur()[L]); }; lv.append(b); });
  const check = el('button',{class:'btn primary small',type:'button'}, '✓ Check my email');
  check.onclick = () => {
    const t = ta.value, n = wc(t);
    if(n < 15){ checks.innerHTML=''; checks.append(el('div',{class:'ko'}, '✍️ Write your email first (at least a few sentences).')); return; }
    const list = [
      [/^\s*subject\s*:/im, 'Subject line'],
      [/\b(dear|hello|hi|good morning)\b/i, 'Greeting'],
      [/\b(writing (to|about|regarding)|regarding|following|i would like to|concerning)\b/i, 'Purpose of the email'],
      [cur().key, 'Details of the situation'],
      [/\b(could you|would it be possible|i would be grateful|please|can you|would you)\b/i, 'Polite request'],
      [/\b(because|as|unfortunately|however|so|since)\b/i, 'A linking word'],
      [/\b(regards|sincerely|best wishes|thank you|thanks|look forward)\b/i, 'Polite closing'],
      [() => n >= 60 && n <= 130, 'Length (60–130 words)']
    ];
    checks.innerHTML='';
    let ok = 0;
    list.forEach(([test, label]) => { const pass = typeof test === 'function' ? test() : test.test(t); if(pass) ok++; checks.append(el('div',{class: pass?'ok':'ko'}, (pass?'✓ ':'✗ ')+label)); });
    checks.append(el('div',{}, '🧑‍🏫 This checks structure, not grammar. Compare with a model, then send it to your trainer.'));
    complete('task1', ok, list.length);
  };
  sel.onchange = showTask; ta.oninput = upd;
  r.append(el('label',{class:'selectlabel'}, 'Choose a situation ', sel), box, ta, el('div',{class:'wbar'}, count, check, lv), checks, model);
  showTask();
}
function buildTask2(){
  const r = $('task2');
  const sel = el('select',{}, D.tasks2.map((t,i)=>el('option',{value:i}, t.t)));
  const box = el('div',{class:'taskbox'});
  const ta = el('textarea',{rows:'12',placeholder:'In my opinion, …\n\nFirst, …\n\nFor example, …\n\nIn conclusion, …'});
  const count = el('span',{class:'wcount'}, '0 / 140 words');
  const checks = el('div',{class:'checks'});
  const model = el('div',{class:'model',hidden:true});
  const lv = el('div',{class:'levels'});
  const cur = () => D.tasks2[sel.value];
  function showTask(){ box.innerHTML=''; box.append(el('b',{}, '📌 Topic: '), cur().task, el('p',{class:'small'}, 'About 140 words · 3–5 short paragraphs · use PREP.')); ta.value = S.drafts['t2_'+sel.value] || ''; upd(); model.hidden=true; checks.innerHTML=''; lv.querySelectorAll('button').forEach(b=>b.classList.remove('on')); }
  function upd(){ const n = wc(ta.value); count.textContent = n+' / 140 words'; count.classList.toggle('ok', n>=120 && n<=165); S.drafts['t2_'+sel.value]=ta.value; save(); }
  ['B1','B2'].forEach(L => { const b = el('button',{class:'btn chip',type:'button'}, 'Show '+L+' model'); b.onclick = () => {
    const on = b.classList.contains('on'); lv.querySelectorAll('button').forEach(x=>x.classList.remove('on'));
    if(on){ model.hidden=true; return; } b.classList.add('on'); model.hidden=false; model.innerHTML=''; model.append(el('span',{class:'mlabel'}, L+' MODEL · '+wc(cur()[L])+' words'), cur()[L]); }; lv.append(b); });
  const check = el('button',{class:'btn primary small',type:'button'}, '✓ Check my text');
  check.onclick = () => {
    const t = ta.value, n = wc(t);
    if(n < 30){ checks.innerHTML=''; checks.append(el('div',{class:'ko'}, '✍️ Write at least a few sentences first.')); return; }
    const conns = (t.match(/\b(however|therefore|for example|for instance|in addition|moreover|firstly|first of all|secondly|finally|in conclusion|to sum up|as a result|although|because|on the other hand|nevertheless|such as)\b/gi) || []);
    const uniq = [...new Set(conns.map(x=>x.toLowerCase()))];
    const paras = t.split(/\n\s*\n/).filter(p=>p.trim()).length;
    const list = [
      [/\b(in my opinion|i think|i believe|in my view|personally|from my point of view)\b/i.test(t), 'Clear opinion'],
      [/\b(because|as|since|the main reason)\b/i.test(t), 'A reason'],
      [/\b(for example|for instance|such as|in my company|in my job|in my experience)\b/i.test(t), 'An example'],
      [/\b(in conclusion|to sum up|to conclude|for these reasons|overall)\b/i.test(t), 'A conclusion'],
      [uniq.length >= 4, 'At least 4 different linking words ('+uniq.length+' found'+(uniq.length?': '+uniq.join(', '):'')+')'],
      [paras >= 3, 'At least 3 paragraphs ('+paras+')'],
      [n >= 120 && n <= 165, 'Length about 140 words ('+n+')']
    ];
    checks.innerHTML=''; let ok = 0;
    list.forEach(([pass,label]) => { if(pass) ok++; checks.append(el('div',{class: pass?'ok':'ko'}, (pass?'✓ ':'✗ ')+label)); });
    complete('task2', ok, list.length);
  };
  sel.onchange = showTask; ta.oninput = upd;
  r.append(el('label',{class:'selectlabel'}, 'Choose a topic ', sel), box, ta, el('div',{class:'wbar'}, count, check, lv), checks, model);
  showTask();
}

/* Speaking studio */
function buildStudio(){
  const r = $('studio');
  const sel = el('select',{}, D.prompts.map((p,i)=>el('option',{value:i}, p.t)));
  const qEl = el('div',{class:'question'}), qFr = el('p',{class:'fr'});
  const qSay = el('button',{class:'btn sun small',type:'button'}, '🔊 Hear the examiner');
  const cur = () => D.prompts[sel.value];
  qSay.onclick = () => speak(cur().q, qSay);
  // timer
  const dur = el('select',{}, [60,90,120].map(s=>el('option',{value:s}, s+' seconds')));
  const big = el('div',{class:'bigtimer'}, '1:00');
  const status = el('div',{class:'small',style:'color:#cfd9e8'}, 'Press start, then speak until the end.');
  let tInt = null, left = 60;
  const fmt = s => Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
  const startT = el('button',{class:'btn sun small',type:'button'}, '▶ Start speaking');
  const resetT = el('button',{class:'btn ghost small',type:'button'}, '↺ Reset');
  function resetTimer(){ clearInterval(tInt); tInt=null; left = Number(dur.value); big.textContent = fmt(left); startT.textContent='▶ Start speaking'; status.textContent='Press start, then speak until the end.'; }
  startT.onclick = () => {
    if(tInt){ clearInterval(tInt); tInt=null; startT.textContent='▶ Continue'; return; }
    startT.textContent='⏸ Pause'; status.textContent='🗣️ Answer → Reason → Example → Result';
    tInt = setInterval(() => { left--; big.textContent = fmt(Math.max(0,left)); if(left<=0){ clearInterval(tInt); tInt=null; startT.textContent='▶ Start again'; left=Number(dur.value); status.textContent='✓ Time! Did you give a reason and an example?'; complete('speak'); } }, 1000);
  };
  resetT.onclick = resetTimer; dur.onchange = resetTimer;
  // recorder
  const recBtn = el('button',{class:'btn sun small',type:'button'}, '⏺ Record');
  const recInfo = el('span',{class:'small',style:'color:#cfd9e8'}, '');
  const audio = el('audio',{controls:'',hidden:true});
  const dl = el('a',{class:'btn ghost small',hidden:true,download:'my-answer.webm'}, '⬇ Download recording');
  let rec = null, chunks = [], stream = null, recStart = 0, recTick = null;
  recBtn.onclick = async () => {
    if(rec && rec.state === 'recording'){ rec.stop(); return; }
    if(!navigator.mediaDevices || !window.MediaRecorder){ recInfo.textContent = 'Recording is not supported in this browser. Try Chrome or Edge.'; return; }
    try{
      stream = await navigator.mediaDevices.getUserMedia({audio:true});
      const mime = ['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg'].find(m => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m));
      rec = new MediaRecorder(stream, mime ? {mimeType:mime} : undefined);
      chunks = [];
      rec.ondataavailable = e => { if(e.data.size) chunks.push(e.data); };
      rec.onstop = () => {
        clearInterval(recTick);
        const type = rec.mimeType || mime || 'audio/webm';
        const blob = new Blob(chunks, {type});
        const url = URL.createObjectURL(blob);
        audio.src = url; audio.hidden = false;
        const ext = type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : 'webm';
        dl.href = url; dl.download = 'speaking-'+cur().t.toLowerCase().replace(/[^a-z]+/g,'-')+'.'+ext; dl.hidden = false;
        recBtn.textContent = '⏺ Record again'; recInfo.textContent = '✓ Listen to yourself below.';
        stream.getTracks().forEach(t => t.stop());
        complete('speak');
      };
      rec.start(); recStart = Date.now();
      recBtn.textContent = '⏹ Stop';
      recInfo.innerHTML = ''; recInfo.append(el('span',{class:'recdot'}), 'Recording… 0 s');
      recTick = setInterval(() => { recInfo.lastChild.textContent = 'Recording… '+Math.round((Date.now()-recStart)/1000)+' s'; }, 500);
    }catch(err){ recInfo.textContent = 'Microphone not available or permission refused.'; }
  };
  // models
  const model = el('div',{class:'model',hidden:true});
  const lv = el('div',{class:'levels'});
  let modelText = '';
  const mSay = el('button',{class:'btn ghost small',type:'button',hidden:true}, '🔊 Listen to the model');
  mSay.onclick = () => speak(modelText, mSay);
  ['A2','B1','B2'].forEach(L => { const b = el('button',{class:'btn chip',type:'button'}, L+' model'); b.onclick = () => {
    const on = b.classList.contains('on'); lv.querySelectorAll('button').forEach(x=>x.classList.remove('on'));
    if(on){ model.hidden = true; mSay.hidden = true; return; }
    b.classList.add('on'); modelText = cur()[L]; model.hidden=false; mSay.hidden=false; model.innerHTML=''; model.append(el('span',{class:'mlabel'}, L+' MODEL ANSWER'), modelText); }; lv.append(b); });
  // self check
  const self = el('div',{}, ['I answered the question directly.','I gave a reason (because…).','I gave a concrete example.','I used at least two different tenses.','I kept speaking until the end of the timer.'].map(t => el('label',{class:'chk'}, el('input',{type:'checkbox'}), t)));
  function showPrompt(){ qEl.textContent = '“'+cur().q+'”'; qFr.textContent = cur().fr; model.hidden=true; mSay.hidden=true; lv.querySelectorAll('button').forEach(x=>x.classList.remove('on')); self.querySelectorAll('input').forEach(i=>i.checked=false); }
  sel.onchange = showPrompt;
  r.append(
    el('label',{class:'selectlabel'}, '🎯 Question ', sel),
    qEl, qFr, qSay,
    el('div',{class:'studiogrid'},
      el('div',{class:'panel'}, el('h4',{}, '⏱ Timer'), el('div',{class:'ring'}, big, el('div',{}, dur)), el('div',{class:'wbar'}, startT, resetT), status),
      el('div',{class:'panel'}, el('h4',{}, '🎙️ Record yourself'), el('div',{class:'wbar'}, recBtn, recInfo), audio, el('div',{class:'wbar'}, dl))
    ),
    el('div',{class:'panel'}, el('h4',{}, '💡 Model answers (read, listen, then try again)'), el('div',{class:'wbar'}, lv, mSay), model),
    el('div',{class:'panel'}, el('h4',{}, '✅ Self-check'), self)
  );
  showPrompt(); resetTimer();
}

/* ---------------------------------------------------------
   6. EXAM CONSOLE (realistic simulation)
--------------------------------------------------------- */
let EX = null;
function runExam(key){
  const cfg = D.exams[key];
  stopSpeech();
  EX = {key, cfg, p:0, i:-1, results:cfg.parts.map(()=>[]), timer:null, deadline:0, sel:null, quitArmed:false};
  $('examConsole').hidden = false; document.body.classList.add('locked');
  $('cTitle').textContent = cfg.title;
  partIntro();
}
function cBody(...kids){ const b = $('cBody'); b.innerHTML=''; b.append(el('div',{class:'cpanel'}, kids)); b.scrollTop = 0; }
function partIntro(){
  const part = EX.cfg.parts[EX.p];
  clearInterval(EX.timer);
  $('cPart').textContent = part.name; $('cCounter').textContent = part.items.length+' questions'; $('cClock').textContent = '0:'+String(part.seconds).padStart(2,'0'); $('cClock').classList.remove('low'); $('cBar').style.width='100%'; $('cBar').classList.remove('low');
  const rules = part.type === 'written'
    ? ['Read the sentence and choose the best option (A–D).', part.seconds+' seconds per question.', 'When the time is up, the test moves on automatically.', 'You cannot go back to a previous question.']
    : ['Press ▶ to hear a sentence. Choose the answer that has the same meaning (A–C).', part.seconds+' seconds per question.', 'You can replay the audio, but the clock keeps running.', 'You cannot go back to a previous question.'];
  cBody(el('div',{class:'cinstr'}, part.name), el('h2',{}, part.type==='written' ? '✍️ Written expression' : '🎧 Listening comprehension'),
    el('ul',{}, rules.map(t=>el('li',{}, t))),
    part.type==='listening' ? el('p',{class:'small'}, '🎧 Put on your headphones. Check the accent and speed at the top of the lesson before you start.') : null,
    el('div',{class:'cactions'}, el('span',{class:'small'}, 'Answer every question: a blank counts as wrong.'), el('button',{class:'btn primary big',type:'button',onclick:() => { EX.i=-1; nextQ(); }}, 'Start '+(EX.p===0?'the test':'Part '+(EX.p+1))+' →')));
}
function nextQ(){
  const part = EX.cfg.parts[EX.p];
  EX.i++;
  stopSpeech();
  if(EX.i >= part.items.length){
    EX.p++;
    if(EX.p < EX.cfg.parts.length) return partIntro();
    return finishExam();
  }
  const it = part.items[EX.i];
  EX.sel = null;
  $('cCounter').textContent = 'Question '+(EX.i+1)+' / '+part.items.length;
  const options = shuffleOpts(it.o);
  const nextBtn = el('button',{class:'btn primary',type:'button',disabled:''}, EX.i === part.items.length-1 ? 'Validate ✓' : 'Validate & next →');
  const opts = el('div',{class:'copts'}, options.map((o,k) => {
    const b = el('button',{class:'copt',type:'button'}, el('span',{class:'radio'}), el('span',{class:'L'}, 'ABCD'[k]+'.'), el('span',{}, o));
    b.onclick = () => { opts.querySelectorAll('.copt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); EX.sel = o; nextBtn.disabled = false; };
    return b;
  }));
  nextBtn.onclick = () => record(false);
  let player = null;
  if(part.type === 'listening'){
    let plays = 0;
    const pc = el('div',{class:'small',style:'color:#cfd9e8'}, 'Press play to listen');
    const pb = el('button',{class:'bigplay',type:'button','aria-label':'Play'}, '▶');
    player = el('div',{class:'audioplayer'}, pb, el('div',{class:'wave'}, Array.from({length:22},()=>el('i'))), pc);
    pb.onclick = () => { plays++; pc.textContent = 'Played '+plays+'× · you can replay'; pb.textContent='↻'; player.classList.add('on'); speak(it.say, pb, () => player.classList.remove('on')); };
  }
  cBody(el('div',{class:'cinstr'}, part.instr), player, it.q ? el('div',{class:'cq'}, gap(it.q)) : el('div',{class:'cq'}, 'What does the speaker mean?'), opts, el('div',{class:'cactions'}, el('span',{class:'small'}, 'You cannot come back to this question.'), nextBtn));
  // timer
  clearInterval(EX.timer);
  EX.deadline = Date.now() + part.seconds*1000;
  const tick = () => {
    const ms = Math.max(0, EX.deadline - Date.now()), s = Math.ceil(ms/1000);
    $('cClock').textContent = Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
    const low = s <= 10; $('cClock').classList.toggle('low', low); $('cBar').classList.toggle('low', low);
    $('cBar').style.width = (ms/(part.seconds*1000)*100)+'%';
    if(ms <= 0) record(true);
  };
  tick(); EX.timer = setInterval(tick, 200);
}
function record(timedOut){
  clearInterval(EX.timer);
  const part = EX.cfg.parts[EX.p], it = part.items[EX.i];
  EX.results[EX.p].push({it, given: EX.sel, ok: EX.sel === it.o[0], timedOut: timedOut && !EX.sel});
  nextQ();
}
function band(p){ return p>=90?'Advanced · around C1+':p>=75?'Confident · around B2–C1':p>=55?'Independent · around B1–B2':p>=30?'Developing · around A2–B1':'Foundation · around A1–A2'; }
function finishExam(){
  clearInterval(EX.timer); stopSpeech();
  $('cCounter').textContent = 'Results'; $('cPart').textContent = 'Test complete'; $('cClock').textContent = '✓'; $('cClock').classList.remove('low'); $('cBar').style.width='100%'; $('cBar').classList.remove('low');
  const parts = EX.cfg.parts.map((p,k) => ({name:p.name, c:EX.results[k].filter(r=>r.ok).length, t:p.items.length}));
  const c = parts.reduce((a,p)=>a+p.c,0), t = parts.reduce((a,p)=>a+p.t,0), pct = Math.round(c/t*100);
  const res = {date:new Date().toLocaleString('en-GB'), parts, c, t, pct, band:band(pct)};
  S.exams[EX.key] = res; save();
  complete(EX.key, c, t);
  const review = el('div',{class:'review'}, EX.cfg.parts.map((p,k) => el('div',{}, el('h3',{}, p.name),
    EX.results[k].map((r,n) => el('details',{},
      el('summary',{}, el('span',{class:r.ok?'ok':'ko'}, r.ok?'✓ ':'✗ '), (n+1)+'. ', r.it.q ? r.it.q.replace('___','_____') : '🎧 “'+r.it.say+'”'),
      el('p',{}, 'Your answer: ', el('b',{class:r.ok?'ok':'ko'}, r.given || (r.timedOut ? '(no answer: time ran out)' : '(no answer)'))),
      el('p',{}, 'Correct answer: ', el('b',{class:'ok'}, r.it.o[0])),
      r.it.exp ? el('p',{}, '💡 '+r.it.exp) : null)))));
  cBody(el('div',{class:'cinstr'}, 'Your practice result'), el('h2',{}, pct>=75?'🏆 Excellent work!':pct>=50?'👏 Good job!':'💪 A great starting point!'),
    resultBars(res), el('p',{class:'small'}, 'Practice estimate only, based on a short sample. It is not an official Bright score.'),
    el('h3',{}, '🔎 Review every question'), review,
    el('div',{class:'cactions'}, el('span'), el('button',{class:'btn primary big',type:'button',onclick:closeExam}, 'Back to the lesson →')));
  if(pct >= 75) confetti();
}
function resultBars(res){
  return el('div',{},
    el('div',{class:'rbars'}, res.parts.map(p => el('div',{class:'rbar'}, el('span',{}, p.name.replace(/^Part \d · /,'')), el('div',{class:'track'}, el('div',{style:'width:'+Math.round(p.c/p.t*100)+'%'})), el('b',{}, p.c+' / '+p.t))),
      el('div',{class:'rbar'}, el('span',{}, el('b',{}, 'Total')), el('div',{class:'track'}, el('div',{style:'width:'+res.pct+'%'})), el('b',{}, res.pct+'%'))),
    el('span',{class:'band'}, '☀️ '+res.band));
}
function closeExam(){
  clearInterval(EX && EX.timer); stopSpeech();
  $('examConsole').hidden = true; document.body.classList.remove('locked'); EX = null;
  showResults();
}
$('cQuit').onclick = () => {
  if(!EX) return;
  if(!EX.quitArmed){ EX.quitArmed = true; $('cQuit').textContent = 'Click again to quit'; setTimeout(()=>{ if(EX){ EX.quitArmed=false; } $('cQuit').textContent='✕ Quit test'; }, 3000); return; }
  $('cQuit').textContent='✕ Quit test'; closeExam();
};
function showResults(){
  [['discovery','labResult'],['final','finalResult']].forEach(([k,id]) => {
    const r = S.exams[k], box = $(id);
    if(!r){ box.hidden = true; return; }
    box.hidden = false; box.innerHTML='';
    box.append(el('h3',{}, (k==='discovery'?'Your discovery test':'Your final mock')+' · '+r.date), resultBars(r));
  });
  const cmp = $('compare'); cmp.innerHTML='';
  const a = S.exams.discovery, b = S.exams.final;
  if(a || b){
    cmp.append(el('div',{}, el('small',{}, 'Discovery test'), el('strong',{}, a ? a.pct+'%' : '–')),
               el('div',{}, el('small',{}, 'Final mock'), el('strong',{}, b ? b.pct+'%' : '–'), a && b ? el('span',{class:'up'}, (b.pct-a.pct>=0?'▲ +':'▼ ')+(b.pct-a.pct)+' points') : null));
  }
}

/* ---------------------------------------------------------
   7. GAMES
--------------------------------------------------------- */
function buildSprint(){
  const r = $('sprint');
  const pool = [...D.g1, ...D.g2, ...D.g3, ...D.g4, ...D.vocabQuiz, ...D.w3, ...D.discoveryWritten];
  const body = el('div',{class:'gbody'});
  r.append(el('div',{class:'ghead sprint'}, el('span',{class:'gicon'}, '⚡'), el('div',{}, el('h3',{}, 'Grammar Sprint'), el('p',{}, '60 seconds. As many correct answers as possible. 3 in a row = streak bonus!'))), body);
  function intro(){
    body.innerHTML='';
    body.append(el('div',{class:'ghud'}, el('div',{class:'hot'}, '🏆 Best: '+(S.best.sprint||0))), el('p',{}, '+10 points per correct answer · +5 bonus for every answer in a streak of 3 or more · wrong answer = streak lost.'),
      el('button',{class:'btn sun big',type:'button',onclick:play}, '▶ Start the sprint'));
  }
  function play(){
    let score=0, streak=0, right=0, total=0, end=Date.now()+60000, timer, mistakes=[];
    const bag = shuffle(pool);
    const hudS = el('div',{}, 'Score 0'), hudT = el('div',{}, '60 s'), hudK = el('div',{class:'hot'}, '🔥 0');
    const bar = el('div'), q = el('div',{class:'sprintq'}), opts = el('div',{class:'opts',style:'margin-left:0'});
    body.innerHTML=''; body.append(el('div',{class:'ghud'}, hudS, hudT, hudK), el('div',{class:'gtimer'}, bar), q, opts);
    let k = 0, locked = false;
    function next(){
      locked = false;
      const it = bag[k++ % bag.length];
      q.innerHTML=''; q.append(gap(it.q));
      opts.innerHTML='';
      shuffleOpts(it.o).forEach((o,i) => { const b = el('button',{class:'opt',type:'button'}, el('span',{class:'L'}, 'ABCD'[i]), el('span',{}, o)); b.onclick = () => {
        if(locked) return; locked = true; total++;
        const ok = o === it.o[0];
        if(ok){ right++; streak++; score += 10 + (streak>=3?5:0); b.classList.add('right'); q.innerHTML=''; q.append(gap(it.q, it.o[0])); setTimeout(next, 350); }
        else { streak=0; b.classList.add('wrong'); mistakes.push(it); [...opts.children].forEach(x=>{ if(x.lastChild.textContent===it.o[0]) x.classList.add('right'); }); setTimeout(next, 1100); }
        hudS.textContent='Score '+score; hudK.textContent='🔥 '+streak;
      }; opts.append(b); });
    }
    timer = setInterval(() => { const s = Math.max(0, Math.ceil((end-Date.now())/1000)); hudT.textContent = s+' s'; bar.style.width = (s/60*100)+'%'; if(s<=0){ clearInterval(timer); over(); } }, 250);
    function over(){
      const best = Math.max(S.best.sprint||0, score), record = score > (S.best.sprint||0);
      S.best.sprint = best; save();
      body.innerHTML='';
      body.append(el('div',{class:'gover'}, el('p',{}, record && score>0 ? '🎉 NEW RECORD!' : 'Time!'), el('strong',{}, score+' pts'), el('p',{}, right+' correct out of '+total+' · best: '+best),
        el('button',{class:'btn sun',type:'button',onclick:play}, '↻ Play again'), ' ',
        el('button',{class:'btn ghost',type:'button',onclick:intro}, 'Back'),
        mistakes.length ? el('div',{class:'reviewlist'}, el('b',{}, 'Review your mistakes:'), [...new Set(mistakes)].map(m => el('div',{}, gap(m.q, m.o[0]), ' · ', el('i',{class:'small'}, m.exp||'')))) : null));
      if(record && score>0) confetti();
      complete('sprint', Math.min(right,10), 10);
    }
    next();
  }
  intro();
}
function buildMatch(){
  const r = $('match');
  const body = el('div',{class:'gbody'});
  r.append(el('div',{class:'ghead match'}, el('span',{class:'gicon'}, '🧠'), el('div',{}, el('h3',{}, 'Word Match'), el('p',{}, 'Find the pairs: English word ↔ French meaning. Fewer moves = more stars!'))), body);
  function intro(){
    body.innerHTML='';
    const cat = el('select',{}, el('option',{value:''}, 'All categories'), [...new Set(D.vocab.map(v=>v.c))].map(c=>el('option',{value:c}, c)));
    body.append(el('div',{class:'ghud'}, el('div',{class:'hot'}, '🏆 Best: '+(S.best.match ? S.best.match+' moves' : '–'))),
      el('label',{class:'selectlabel'}, 'Words from ', cat), el('p'), el('button',{class:'btn sun big',type:'button',onclick:()=>play(cat.value)}, '▶ New game'));
  }
  function play(cat){
    const words = shuffle(D.vocab.filter(v => !cat || v.c === cat)).slice(0,6);
    const cards = shuffle(words.flatMap((w,k) => [{k, txt:w.w, fr:false}, {k, txt:w.fr, fr:true}]));
    let first = null, lock = false, moves = 0, found = 0;
    const hudM = el('div',{}, 'Moves 0'), hudF = el('div',{class:'hot'}, 'Pairs 0 / 6');
    const board = el('div',{class:'board'});
    body.innerHTML=''; body.append(el('div',{class:'ghud'}, hudM, hudF), board);
    cards.forEach(c => {
      const b = el('button',{class:'card',type:'button'}, el('span',{class:'face back'}, '☀'), el('span',{class:'face front'+(c.fr?' isfr':'')}, c.txt));
      b.onclick = () => {
        if(lock || b.classList.contains('flip') || b.classList.contains('found')) return;
        b.classList.add('flip');
        if(!c.fr) speak(c.txt);
        if(!first){ first = {b,c}; return; }
        moves++; hudM.textContent = 'Moves '+moves;
        if(first.c.k === c.k){ first.b.classList.add('found'); b.classList.add('found'); found++; hudF.textContent = 'Pairs '+found+' / 6'; first = null;
          if(found === 6) setTimeout(win, 500);
        } else { lock = true; const f = first; first = null; setTimeout(() => { f.b.classList.remove('flip'); b.classList.remove('flip'); lock = false; }, 900); }
      };
      board.append(b);
    });
    function win(){
      const stars = moves<=8?'⭐⭐⭐':moves<=12?'⭐⭐':'⭐';
      const record = !S.best.match || moves < S.best.match;
      if(record) S.best.match = moves; save();
      body.innerHTML='';
      body.append(el('div',{class:'gover'}, el('p',{}, record?'🎉 NEW RECORD!':'All pairs found!'), el('strong',{}, stars), el('p',{}, moves+' moves'),
        el('div',{class:'reviewlist'}, words.map(w => el('div',{}, sayBtn(w.w), ' ', el('b',{}, w.w), ' = ', el('i',{}, w.fr)))),
        el('p'), el('button',{class:'btn sun',type:'button',onclick:()=>play(cat)}, '↻ Play again'), ' ', el('button',{class:'btn ghost',type:'button',onclick:intro}, 'Back')));
      confetti();
      complete('match', moves<=8?6:moves<=12?5:4, 6);
    }
  }
  intro();
}

/* ---------------------------------------------------------
   8. FINAL PAGE: checklist, survey, export
--------------------------------------------------------- */
function buildFinal(){
  const cl = $('checklist');
  D.checklist.forEach((t,i) => { const cb = el('input',{type:'checkbox'}); cb.checked = S.checks.includes(i); cb.onchange = () => { S.checks = cb.checked ? [...new Set([...S.checks,i])] : S.checks.filter(x=>x!==i); save(); }; cl.append(el('label',{}, cb, t)); });
  const sv = $('survey');
  D.survey.forEach((t,i) => {
    const stars = el('div',{class:'stars'});
    for(let n=1;n<=5;n++){ const b = el('button',{type:'button','aria-label':n+' stars'}, '★'); b.onclick = () => { S.survey[i] = n; save(); paint(); }; stars.append(b); }
    const paint = () => [...stars.children].forEach((b,k) => b.classList.toggle('on', k < (S.survey[i]||0)));
    paint(); sv.append(el('div',{class:'srow'}, el('span',{}, t), stars));
  });
  $('comments').value = S.comments || ''; $('notes').value = S.notes || '';
  $('comments').oninput = e => { S.comments = e.target.value; save(); };
  $('notes').oninput = e => { S.notes = e.target.value; save(); };
  $('dlBtn').onclick = () => {
    const blob = new Blob([report()], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = el('a',{href:url,download:'Bright_Lesson01_Results_'+(S.name||'learner').replace(/[^A-Za-zÀ-ÿ0-9]+/g,'_')+'.txt'});
    document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url), 1500);
  };
  $('copyBtn').onclick = async () => {
    try{ await navigator.clipboard.writeText(report()); toast('📋 Results copied. Paste them into an email.'); }
    catch(e){ const ta = el('textarea'); ta.value = report(); document.body.append(ta); ta.select(); try{ document.execCommand('copy'); toast('📋 Results copied.'); }catch(_){ toast('Copy not available. Use Download instead.'); } ta.remove(); }
  };
  const rb = $('resetAll');
  rb.onclick = () => {
    if(!rb.dataset.armed){ rb.dataset.armed='1'; rb.textContent='⚠️ Click again to erase everything'; setTimeout(()=>{ delete rb.dataset.armed; rb.textContent='↺ Reset the whole lesson'; }, 3500); return; }
    try{ localStorage.removeItem(KEY); }catch(e){}
    location.reload();
  };
}
function report(){
  const L = [];
  L.push('BRIGHT ENGLISH PREP · LESSON 01 · DISCOVERY & FOUNDATIONS');
  L.push('SpeakEasyTisha · Independent training (not affiliated with Bright Language)');
  L.push('Learner: '+(S.name||'—')+'   ·   Date: '+new Date().toLocaleString('en-GB'));
  L.push('Bright points: '+S.xp+' ('+level(S.xp)+')   ·   Activities completed: '+ALL.filter(a=>S.done[a]).length+' / '+ALL.length);
  L.push('');
  L.push('PRACTICE TESTS (indicative only)');
  ['discovery','final'].forEach(k => { const r = S.exams[k]; L.push('  '+(k==='discovery'?'Discovery test':'Final mock')+': '+(r ? r.pct+'% ('+r.c+'/'+r.t+') · '+r.parts.map(p=>p.name.replace(/^Part \d · /,'')+' '+p.c+'/'+p.t).join(' · ')+' · '+r.band+' · '+r.date : 'not taken')); });
  L.push('');
  L.push('ACTIVITIES');
  ALL.filter(a=>!['discovery','final'].includes(a)).forEach(a => { const s = S.scores[a]; L.push('  '+(S.done[a]?'[x] ':'[ ] ')+LABELS[a]+(s ? ': '+s.c+' / '+s.t : '')); });
  L.push('  Grammar Sprint best: '+(S.best.sprint||0)+' pts · Word Match best: '+(S.best.match ? S.best.match+' moves' : '—'));
  L.push('');
  L.push('TEST-DAY CHECKLIST');
  D.checklist.forEach((t,i) => L.push('  '+(S.checks.includes(i)?'[x] ':'[ ] ')+t));
  L.push('');
  L.push('SATISFACTION (1–5)');
  D.survey.forEach((t,i) => L.push('  '+t+' '+(S.survey[i] ? '★'.repeat(S.survey[i])+'☆'.repeat(5-S.survey[i])+' ('+S.survey[i]+'/5)' : '—')));
  L.push('');
  L.push('COMMENTS'); L.push('  '+(S.comments||'—'));
  L.push(''); L.push('MY NOTES'); L.push('  '+(S.notes||'—'));
  const d1 = Object.keys(S.drafts).filter(k=>S.drafts[k] && S.drafts[k].trim());
  if(d1.length){ L.push(''); L.push('MY WRITING'); d1.forEach(k => { const t = k.startsWith('t1_') ? 'Task 1 · '+D.tasks1[k.slice(3)].t : 'Task 2 · '+D.tasks2[k.slice(3)].t; L.push('--- '+t+' ('+wc(S.drafts[k])+' words) ---'); L.push(S.drafts[k]); L.push(''); }); }
  return L.join('\n');
}

/* ---------------------------------------------------------
   9. NAVIGATION, PROGRESS, SETTINGS
--------------------------------------------------------- */
function go(id){
  if(!$(id)) id = 'home';
  stopSpeech();
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === id));
  document.querySelectorAll('.nav').forEach(n => n.classList.toggle('active', n.dataset.go === id));
  if(id === 'home') S.done.__home = true;
  S.page = id; save(); progress();
  $('sidebar').classList.remove('open');
  window.scrollTo({top:0, behavior:'smooth'});
}
function progress(){
  const n = ALL.filter(a => S.done[a]).length;
  $('progCount').textContent = n+' / '+ALL.length;
  $('progFill').style.width = (n/ALL.length*100)+'%';
  document.querySelectorAll('.nav').forEach(b => {
    const acts = SECTIONS[b.dataset.go] || [];
    b.classList.toggle('done', acts.length ? acts.every(a => S.done[a]) : !!S.done.__home);
  });
}
function names(){ document.querySelectorAll('.learnerName').forEach(e => e.textContent = S.name || 'there'); }
function fr(){ document.body.classList.toggle('hide-fr', !S.fr); $('frBtn').textContent = '🇫🇷 French: '+(S.fr?'ON':'OFF'); }

function init(){
  load();
  // settings
  $('accent').value = S.accent; $('rate').value = String(S.rate);
  $('accent').onchange = e => { S.accent = e.target.value; save(); speak(S.accent==='en-GB'?'This is the British accent.':'This is the American accent.'); };
  $('rate').onchange = e => { S.rate = Number(e.target.value); save(); };
  $('frBtn').onclick = () => { S.fr = !S.fr; fr(); save(); };
  $('printBtn').onclick = () => window.print();
  $('menuBtn').onclick = e => { e.stopPropagation(); $('sidebar').classList.toggle('open'); };
  document.addEventListener('click', e => { const sb = $('sidebar'); if(sb.classList.contains('open') && !e.target.closest('#sidebar')) sb.classList.remove('open'); });
  $('xpCount').textContent = S.xp; $('xpLevel').textContent = level(S.xp);
  // welcome
  $('learnerName').value = S.name || '';
  if(S.intro) $('disclaimer').classList.add('hide');
  $('enter').onclick = () => { S.name = $('learnerName').value.trim(); S.intro = true; save(); names(); $('disclaimer').classList.add('hide'); go(S.page || 'home'); };
  $('learnerName').onkeydown = e => { if(e.key === 'Enter') $('enter').click(); };
  // nav
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if(g){ go(g.dataset.go); return; }
    const x = e.target.closest('[data-exam]'); if(x){ runExam(x.dataset.exam); }
  });
  document.addEventListener('keydown', e => {
    if(!EX || $('examConsole').hidden) return;
    const k = e.key.toUpperCase(), btns = [...document.querySelectorAll('.copt')];
    const idx = 'ABCD'.indexOf(k); if(idx > -1 && btns[idx]) btns[idx].click();
    if(e.key === 'Enter'){ const nb = document.querySelector('.cpanel .cactions .btn.primary'); if(nb && !nb.disabled) nb.click(); }
  });
  // build everything
  mcq('ex-examQuiz','examQuiz', D.examQuiz, {title:'8 questions about the test'});
  buildVocab();
  mcq('ex-vocabQuiz','vocabQuiz', D.vocabQuiz);
  mcq('ex-g1','g1', D.g1);
  sorter('ex-g2sort','g2sort', D.g2sort);
  mcq('ex-g2','g2', D.g2);
  buildPreps(); mcq('ex-g3','g3', D.g3);
  mcq('ex-g4','g4', D.g4);
  buildExpr();
  matchDrop('ex-l1','l1', D.l1);
  mcq('ex-l2','l2', D.l2, {title:'Press ▶, listen, choose the number'});
  mcq('ex-l3','l3', D.l3, {title:'Press ▶, listen, choose the meaning (transcript available after you answer)'});
  buildBank('phraseBank', D.phrases);
  orderer('ex-w1','w1', D.w1);
  sorter('ex-w2','w2', D.w2);
  mcq('ex-w3','w3', D.w3);
  mcq('ex-w4','w4', D.w4);
  buildTask1(); buildTask2();
  mcq('ex-s1','s1', D.s1);
  buildBank('speakBank', D.speakBank);
  buildStudio();
  buildSprint(); buildMatch();
  buildFinal();
  showResults(); names(); fr(); progress();
  go(S.page || 'home');
  window.addEventListener('beforeunload', stopSpeech);
}
document.addEventListener('DOMContentLoaded', init);
})();
