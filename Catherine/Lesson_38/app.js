(() => {
'use strict';

const $ = id => document.getElementById(id);
const $$ = sel => [...document.querySelectorAll(sel)];
const STORAGE_KEY = 'cloe_full_mock_neutral_v1';
const CATS = ['vocabulary','grammar','expressions','reading','listening'];
const CAT_LABELS = {
  vocabulary:'Vocabulaire',
  grammar:'Grammaire & syntaxe',
  expressions:'Expressions',
  reading:'Compréhension de textes',
  listening:'Compréhension orale'
};
const RUBRIC_LEVELS = ['Non évalué','A1','A2','B1','B2','C1','C2'];

const Q = (id,cat,d,type,prompt,answer,extra={}) => ({id,cat,d,type,prompt,answer,...extra});

const bank = [
  // VOCABULARY
  Q('v1','vocabulary',1,'mcq','The opposite of “increase” is…','decrease',{options:['reduce','decrease','develop','improve'],explain:'“Decrease” means become or make smaller.'}),
  Q('v2','vocabulary',1,'dropdown','Please ____ the form before the meeting.','complete',{options:['complete','borrow','miss','avoid'],explain:'You complete or fill in a form.'}),
  Q('v3','vocabulary',1,'fill','A person who buys goods or services is a ____.','customer',{accepted:['customer','client'],hint:'Think of a person receiving a service.',explain:'“Customer” and, in many service contexts, “client” are correct.'}),
  Q('v4','vocabulary',2,'mcq','We need to find a practical ____ to this problem.','solution',{options:['solution','schedule','department','salary'],explain:'A solution resolves a problem.'}),
  Q('v5','vocabulary',2,'wordbank','Complete the sentence: “Please send me the updated ____ by Friday.”','report',{words:['report','delay','branch','wage'],prefix:'Please send me the updated ',suffix:' by Friday.',explain:'A report is a document containing information or findings.'}),
  Q('v6','vocabulary',2,'mcq','If a meeting is moved to a later date, it is…','postponed',{options:['postponed','promoted','delivered','recruited'],explain:'“Postponed” means delayed to a later time or date.'}),
  Q('v7','vocabulary',2,'fill','The amount of money a company receives from sales is its ____.','revenue',{accepted:['revenue','income'],hint:'Business money coming in from sales.',explain:'Revenue is income generated from business activity.'}),
  Q('v8','vocabulary',3,'dropdown','The company wants to ____ customer satisfaction over the next quarter.','improve',{options:['improve','ignore','withdraw','dismiss'],explain:'“Improve” means make something better.'}),
  Q('v9','vocabulary',3,'mcq','A short summary of the main points of a meeting is often called…','minutes',{options:['minutes','wages','premises','stock'],explain:'Meeting minutes record the main points and decisions.'}),
  Q('v10','vocabulary',3,'wordbank','Complete the sentence: “We need to ____ the risks before making a final decision.”','assess',{words:['assess','lend','queue','cancel'],prefix:'We need to ',suffix:' the risks before making a final decision.',explain:'To assess means to evaluate.'}),
  Q('v11','vocabulary',3,'mcq','A deadline is…','the latest time by which something must be completed',{options:['the latest time by which something must be completed','a break during the working day','an optional suggestion','a payment already received'],explain:'A deadline is the final time or date for completion.'}),
  Q('v12','vocabulary',4,'dropdown','The proposal was rejected because the projected costs were not financially ____.','viable',{options:['viable','visible','brief','casual'],explain:'Financially viable means capable of succeeding economically.'}),
  Q('v13','vocabulary',4,'mcq','To “allocate resources” means to…','assign resources for a particular purpose',{options:['assign resources for a particular purpose','remove all resources','sell resources immediately','ignore available resources'],explain:'Allocate means distribute or assign for a purpose.'}),
  Q('v14','vocabulary',4,'fill','A situation in which two priorities compete for the same resources can create a ____.','conflict',{accepted:['conflict','constraint'],hint:'A word for incompatible demands or priorities.',explain:'Conflict is the most direct answer in this sentence.'}),

  // GRAMMAR & SYNTAX
  Q('g1','grammar',1,'dropdown','She ____ in this department since March.','has worked',{options:['has worked','worked','works yesterday','is work'],explain:'Present perfect is used with “since” for a situation continuing to now.'}),
  Q('g2','grammar',1,'mcq','If the train is late, I ____ you.','will call',{options:['will call','called','would called','calling'],explain:'First conditional: if + present, will + base verb.'}),
  Q('g3','grammar',1,'reorder','Put the sentence in the correct order.','could you send me the file please',{tokens:['could','you','send','me','the','file','please'],explain:'Polite question order: modal + subject + base verb.'}),
  Q('g4','grammar',2,'fill','I have lived here ____ 2022.','since',{accepted:['since'],hint:'Use the preposition for a starting point.',explain:'Use “since” with a starting date.'}),
  Q('g5','grammar',2,'dropdown','When I arrived, the meeting ____.','had already started',{options:['had already started','already starts','has already start','was already start'],explain:'Past perfect shows the meeting started before the later past action “arrived”.'}),
  Q('g6','grammar',2,'mcq','The report ____ by the manager yesterday.','was approved',{options:['was approved','approved','is approve','has approving'],explain:'Passive past simple: was/were + past participle.'}),
  Q('g7','grammar',2,'reorder','Put the sentence in the correct order.','we need to discuss this issue tomorrow',{tokens:['we','need','to','discuss','this','issue','tomorrow'],explain:'Subject + need to + verb + object + time expression.'}),
  Q('g8','grammar',3,'dropdown','I’ll let you know as soon as I ____ confirmation.','receive',{options:['receive','will receive','received yesterday','would receive'],explain:'After “as soon as” for a future event, use present simple.'}),
  Q('g9','grammar',3,'fill','The colleague ____ helped me yesterday is from the finance team.','who',{accepted:['who','that'],hint:'Relative pronoun for a person.',explain:'“Who” or “that” can introduce this defining relative clause.'}),
  Q('g10','grammar',3,'mcq','She suggested ____ the meeting until Monday.','postponing',{options:['postponing','to postpone','postpone to','postponed'],explain:'Suggest is followed by a gerund in this structure.'}),
  Q('g11','grammar',3,'dropdown','If we ____ more time, we would review the proposal in greater detail.','had',{options:['had','have','will have','would have'],explain:'Second conditional: if + past simple, would + base verb.'}),
  Q('g12','grammar',4,'mcq','By the end of next month, the team ____ the project.','will have completed',{options:['will have completed','will completed','has complete','would completing'],explain:'Future perfect describes completion before a future point.'}),
  Q('g13','grammar',4,'fill','Had we known about the delay earlier, we ____ have changed the schedule.','would',{accepted:['would'],hint:'Inverted third conditional.',explain:'Had we known…, we would have changed…'}),
  Q('g14','grammar',4,'reorder','Put the sentence in the correct order.','the proposal which was submitted last week has been approved',{tokens:['the','proposal','which','was','submitted','last','week','has','been','approved'],explain:'Relative clause followed by present perfect passive.'}),

  // EXPRESSIONS
  Q('e1','expressions',1,'mcq','You did not understand. What is the most appropriate response?','Could you repeat that, please?',{options:['Could you repeat that, please?','Say again now.','I do not understand you.','Repeat your English.'],explain:'This is polite, natural and professional.'}),
  Q('e2','expressions',1,'dropdown','To offer help politely: “____ I help you?”','How can',{options:['How can','Why do','Where must','When did'],explain:'“How can I help you?” is a standard polite offer.'}),
  Q('e3','expressions',1,'mcq','A colleague thanks you. You reply…','You’re welcome.',{options:['You’re welcome.','You are please.','No thank.','It is welcome you.'],explain:'“You’re welcome” is a standard reply to thanks.'}),
  Q('e4','expressions',2,'wordbank','Complete: “I’m ____ I won’t be able to attend the meeting.”','afraid',{words:['afraid','aware','ready','open'],prefix:"I'm ",suffix:" I won't be able to attend the meeting.",explain:'“I’m afraid…” softens bad news politely.'}),
  Q('e5','expressions',2,'mcq','You want to check understanding. Which phrase is best?','So, if I understand correctly, you need the revised version today.',{options:['So, if I understand correctly, you need the revised version today.','You need it today, yes or no?','I understand what you say maybe.','Tell me again because I forgot.'],explain:'This politely reformulates and confirms the key point.'}),
  Q('e6','expressions',2,'dropdown','To introduce a contrasting point politely: “I see your point, ____ I think we should consider the cost.”','but',{options:['but','because','so that','unless'],explain:'“I see your point, but…” is a polite disagreement frame.'}),
  Q('e7','expressions',2,'mcq','A delivery is delayed. Which reply is most professional?','Thanks for letting me know. Could you confirm the new delivery date?',{options:['Thanks for letting me know. Could you confirm the new delivery date?','This delay is unacceptable. Fix it now.','Why are you always late?','Okay. Whatever.'],explain:'It acknowledges the message and asks for a concrete next step.'}),
  Q('e8','expressions',3,'fill','Complete the phrase: “Would you mind ____ me the updated figures?”','sending',{accepted:['sending'],hint:'Would you mind + verb-ing.',explain:'“Would you mind sending…” is the correct structure.'}),
  Q('e9','expressions',3,'mcq','You need time to check information. What is the best phrase?','Let me check that for you and I’ll get back to you shortly.',{options:['Let me check that for you and I’ll get back to you shortly.','Wait, I need time.','I cannot answer now.','Ask somebody else.'],explain:'This is courteous and gives a clear next step.'}),
  Q('e10','expressions',3,'dropdown','To summarize a decision: “So, we’ve ____ to launch the pilot in October.”','agreed',{options:['agreed','argued','arrived','advised'],explain:'“We’ve agreed to…” summarizes a shared decision.'}),
  Q('e11','expressions',3,'mcq','You want to make a cautious recommendation.','You might want to consider testing the idea on a smaller scale first.',{options:['You might want to consider testing the idea on a smaller scale first.','You must do this immediately.','Your idea is wrong.','Do what I say.'],explain:'“Might want to consider” is diplomatic and appropriately cautious.'}),
  Q('e12','expressions',4,'fill','Complete: “I appreciate your concern; ____, the figures suggest a different conclusion.”','however',{accepted:['however','nevertheless'],hint:'Use a formal connector showing contrast.',explain:'“However” or “nevertheless” introduces a contrast.'}),
  Q('e13','expressions',4,'mcq','Which phrase is best for challenging an assumption diplomatically?','Could we look at that assumption from another angle?',{options:['Could we look at that assumption from another angle?','That assumption is obviously wrong.','No, that makes no sense.','You did not think about this.'],explain:'It questions the assumption without attacking the speaker.'}),
  Q('e14','expressions',4,'dropdown','To invite input from others: “I’d be interested to ____ your perspective on this.”','hear',{options:['hear','listen at','know from','speak'],explain:'The idiomatic phrase is “hear your perspective”.'}),

  // READING
  Q('r1','reading',1,'mcq','Why was the message sent?','To confirm a change of meeting room',{options:['To confirm a change of meeting room','To cancel the meeting','To announce a salary increase','To request a report'],passage:'Subject: Thursday meeting\nPlease note that Thursday’s team meeting will take place in Room 204 instead of Room 118. The time remains 10:30 a.m.',explain:'Only the room changes; the time stays the same.'}),
  Q('r2','reading',1,'fill','What time does the office reopen?','1:00 p.m.',{accepted:['1:00 p.m.','1 pm','13:00','1:00pm'],passage:'NOTICE\nThe reception desk will be closed from 12:00 to 1:00 p.m. today for staff training. Normal service resumes at 1:00 p.m.',hint:'Look at the final sentence.',explain:'Normal service resumes at 1:00 p.m.'}),
  Q('r3','reading',1,'mcq','What should the recipient do before Friday?','Check the attachment and send comments',{options:['Check the attachment and send comments','Call the supplier','Attend a training session','Make a payment'],passage:'Hi,\nI’ve attached the latest version of the presentation. Could you please review slides 6–10 and send me any comments before Friday afternoon?\nThanks.',explain:'The recipient is asked to review specific slides and send comments.'}),
  Q('r4','reading',2,'mcq','What is the purpose of the email?','To propose alternative dates',{options:['To propose alternative dates','To complain about a colleague','To confirm a payment','To recruit a new employee'],passage:'Dear Ms Patel,\nUnfortunately, I am no longer available on 14 October. Would either 16 October at 11 a.m. or 17 October at 3 p.m. be convenient for you? Please let me know which option you prefer.\nKind regards,',explain:'The writer cannot attend the original date and offers two alternatives.'}),
  Q('r5','reading',2,'dropdown','The policy says expenses over €100 must be approved ____ purchase.','before',{options:['before','during','after only','without'],passage:'Travel expenses under €100 may be submitted directly with receipts. Any single expense above €100 requires written manager approval before purchase.',explain:'Approval is required before the purchase.'}),
  Q('r6','reading',2,'mcq','Which statement is true?','The training is optional for experienced staff but required for new starters.',{options:['The training is optional for experienced staff but required for new starters.','The training is cancelled.','Only managers may attend.','All staff must attend twice.'],passage:'The new software workshop is mandatory for employees who joined after 1 June. More experienced users are welcome to attend, but participation is optional for them.',explain:'New starters must attend; experienced users may choose.'}),
  Q('r7','reading',2,'textorder','Put the instructions in the correct order.','open the portal|select expenses|upload receipts|submit the claim',{sentences:['Upload your receipts.','Open the employee portal.','Submit the claim for approval.','Select “Expenses” from the main menu.'],first:'Open the employee portal.',correctOrder:['Open the employee portal.','Select “Expenses” from the main menu.','Upload your receipts.','Submit the claim for approval.'],passage:'Expense claim procedure: first access the employee portal. From the main menu, choose the Expenses section. Add clear images of all receipts, then submit the completed claim to your manager.',explain:'The paragraph gives the exact sequence.'}),
  Q('r8','reading',3,'mcq','Why is the manager asking for feedback?','To decide whether a trial schedule should become permanent',{options:['To decide whether a trial schedule should become permanent','To choose a new office building','To reduce salaries','To cancel all flexible working'],passage:'We have now tested the new flexible start times for eight weeks. Before deciding whether to make the arrangement permanent, please send me your feedback on productivity, team coordination and any practical difficulties you have noticed.',explain:'Feedback will inform the decision about making the trial permanent.'}),
  Q('r9','reading',3,'fill','What is the company trying to reduce?','missed appointments',{accepted:['missed appointments','no-shows','no shows'],passage:'From next month, customers will receive an automatic reminder 48 hours before every appointment. They will be able to confirm or request a new time directly from the message. We expect this to reduce missed appointments and last-minute administrative work.',hint:'Look for the expected benefit of the reminder system.',explain:'The text explicitly says the system should reduce missed appointments.'}),
  Q('r10','reading',3,'mcq','What is implied about the new process?','It aims to improve consistency across teams.',{options:['It aims to improve consistency across teams.','It eliminates the need for managers.','It only applies to external suppliers.','It reduces the number of projects.'],passage:'Each regional team currently records project risks in a slightly different way. The new template will introduce a common structure for risk description, impact, owner and next action. The objective is to make reviews clearer and comparable across regions.',explain:'A common template makes reporting more consistent and comparable.'}),
  Q('r11','reading',3,'dropdown','The writer recommends combining digital tools with ____ communication.','direct',{options:['direct','silent','automatic only','anonymous'],passage:'Digital systems can make routine tasks faster, but complex requests still benefit from direct conversation. The most effective approach is often to automate simple steps while keeping human contact available when clarification or judgement is needed.',explain:'The writer argues for digital efficiency plus direct human communication.'}),
  Q('r12','reading',4,'mcq','What is the central argument?','A successful change process requires explanation, participation and follow-up.',{options:['A successful change process requires explanation, participation and follow-up.','Employees should accept change without questions.','Training alone guarantees successful change.','Managers should avoid collecting feedback.'],passage:'Organisations often focus on announcing a change and underestimate what happens afterwards. Employees need to understand why the change is necessary, how it affects their work and where they can raise concerns. Involving people early and reviewing the implementation after launch can reveal problems before they become entrenched. Communication is therefore not a one-off announcement but an ongoing part of change management.',explain:'The passage stresses explanation, involvement and continued review.'}),
  Q('r13','reading',4,'mcq','What can be inferred about the proposed pilot?','It is designed to test the idea before a wider rollout.',{options:['It is designed to test the idea before a wider rollout.','It will replace the current system immediately.','It has already failed.','It only concerns the finance department.'],passage:'Rather than introducing the new scheduling platform across all sites at once, the project team proposes a six-week pilot in two locations. The pilot will measure user adoption, error rates and support needs before a final rollout decision is made.',explain:'The pilot collects evidence before deciding on full rollout.'}),
  Q('r14','reading',4,'textorder','Put the reasoning in the correct order.','problem|evidence|proposal|benefit',{sentences:['A short pilot would let us test the process with limited risk.','Customer response times have increased by 18% this quarter.','If successful, the change could improve both speed and consistency.','Our current approval process requires too many manual handovers.'],first:'Our current approval process requires too many manual handovers.',correctOrder:['Our current approval process requires too many manual handovers.','Customer response times have increased by 18% this quarter.','A short pilot would let us test the process with limited risk.','If successful, the change could improve both speed and consistency.'],passage:'A coherent recommendation normally moves from the problem, to supporting evidence, to the proposal, then to the expected benefit.',explain:'This order builds a logical business argument.'}),

  // LISTENING
  Q('l1','listening',1,'mcq','What time is the call?','3:30 p.m.',{options:['2:30 p.m.','3:30 p.m.','4:30 p.m.','5:30 p.m.'],script:'Hello. I’m calling to confirm our appointment tomorrow afternoon at half past three.',locale:'en-GB',explain:'“Half past three” means 3:30.'}),
  Q('l2','listening',1,'mcq','Why is the speaker calling?','To cancel an appointment',{options:['To cancel an appointment','To order equipment','To apply for a job','To complain about an invoice'],script:'Good morning. I’m afraid I won’t be able to come to my appointment on Friday, so I need to cancel it.',locale:'en-GB',explain:'The speaker explicitly says they need to cancel.'}),
  Q('l3','listening',1,'fill','How many minutes late will the speaker be?','10',{accepted:['10','ten','10 minutes','ten minutes'],script:'Hi, I’m on my way, but traffic is very heavy. I think I’ll be about ten minutes late.',locale:'en-US',hint:'Listen for a number.',explain:'The speaker says “about ten minutes late”.'}),
  Q('l4','listening',2,'mcq','What alternative is offered?','Thursday at 4:30',{options:['Thursday at 4:30','Wednesday at 4:30','Friday at 3:30','Thursday at 3:00'],script:'I’m afraid Wednesday afternoon is fully booked. I can offer you Thursday at four thirty if that works for you.',locale:'en-GB',explain:'The alternative is Thursday at 4:30.'}),
  Q('l5','listening',2,'dropdown','The revised report is needed by ____ morning.','Monday',{options:['Monday','Tuesday','Thursday','Friday'],script:'Could you update the figures in sections two and three and send me the revised report by Monday morning, please?',locale:'en-US',explain:'The speaker says “by Monday morning”.'}),
  Q('l6','listening',2,'mcq','What is the main problem?','The order has not arrived',{options:['The order has not arrived','The invoice is too high','The product is damaged','The meeting has been cancelled'],script:'I’m calling about order five eight four two. It was due yesterday, but nothing has arrived yet. Could you check the delivery status for me?',locale:'en-GB',explain:'The order was due yesterday but has not arrived.'}),
  Q('l7','listening',2,'fill','Which floor should visitors go to?','second',{accepted:['second','2nd','2'],script:'Visitors for the training session should report to reception and then go directly to the second floor conference room.',locale:'en-US',hint:'Listen for an ordinal number.',explain:'The conference room is on the second floor.'}),
  Q('l8','listening',3,'mcq','What does the speaker recommend doing first?','Testing the new process with one team',{options:['Testing the new process with one team','Rolling it out everywhere immediately','Cancelling the project','Hiring more managers'],script:'Before we change the process across the whole organisation, I suggest we test it with one team for a month. That will give us real feedback without creating too much disruption.',locale:'en-GB',explain:'The speaker proposes a one-team pilot first.'}),
  Q('l9','listening',3,'mcq','Why has the deadline changed?','A supplier delivered critical data late',{options:['A supplier delivered critical data late','The client cancelled the project','The budget was reduced','The team requested more holiday'],script:'We need to move the deadline from Tuesday to Thursday because one of our suppliers sent the final data two days later than expected. The analysis itself is on track.',locale:'en-US',explain:'The delay comes from late supplier data.'}),
  Q('l10','listening',3,'dropdown','The speaker wants the team to focus on ____ rather than blame.','solutions',{options:['solutions','individuals','budgets','history'],script:'We can review what went wrong, but I’d like the discussion to focus on solutions rather than blame. What can we change so the same issue is less likely to happen again?',locale:'en-GB',explain:'The key phrase is “focus on solutions rather than blame”.'}),
  Q('l11','listening',3,'fill','What should the listener confirm in writing?','the revised delivery date',{accepted:['the revised delivery date','revised delivery date','new delivery date','the new delivery date'],script:'Thanks for letting me know about the delay. Could you confirm the revised delivery date in writing and tell me whether the remaining items will arrive together?',locale:'en-US',hint:'Listen for the specific item to confirm.',explain:'The listener is asked to confirm the revised delivery date in writing.'}),
  Q('l12','listening',4,'mcq','What is the speaker’s main concern?','The plan may be efficient but could reduce access to human support',{options:['The plan may be efficient but could reduce access to human support','The software is too expensive to purchase','Employees refuse to use email','Customers prefer longer waiting times'],script:'The proposed self-service system should reduce routine requests, which is positive. My concern is that some customers have complex questions and may still need direct support. We need to make sure efficiency does not come at the expense of accessibility.',locale:'en-GB',explain:'The concern is preserving human support for complex needs.'}),
  Q('l13','listening',4,'mcq','What conclusion does the speaker reach?','The pilot should continue, with one change to training',{options:['The pilot should continue, with one change to training','The pilot should stop immediately','The results are too poor to evaluate','The process should be rolled out unchanged'],script:'The pilot results are encouraging overall. Error rates are down and users are completing tasks faster. However, several new employees struggled in the first week, so I recommend continuing the pilot while adding a short onboarding session.',locale:'en-US',explain:'The speaker supports continuing the pilot with added onboarding.'}),
  Q('l14','listening',4,'fill','Which two qualities does the speaker say the proposal needs to balance?','speed and accuracy',{accepted:['speed and accuracy','accuracy and speed'],script:'The proposal is attractive because it could shorten response times, but we should not measure success by speed alone. The final process needs to balance speed and accuracy, especially for high-risk requests.',locale:'en-GB',hint:'Listen for “balance X and Y”.',explain:'The final process needs to balance speed and accuracy.'})
];

const oralData = [
  {
    title:'Partie 1 · Introduction',
    candidate:'Répondez aux questions sur votre parcours professionnel, vos responsabilités et votre utilisation de l’anglais.',
    hint:'Structure simple : 1) réponse directe, 2) détail concret, 3) exemple ou raison.',
    modelB1:'I work in a team where I coordinate several tasks. I mainly organise priorities, communicate with colleagues and solve day-to-day problems. I use English occasionally, especially for emails and online meetings.',
    modelB2:'In my current role, I coordinate priorities across several people and make sure information is shared clearly. A typical day involves planning, following up on ongoing tasks and resolving unexpected issues. I use English mainly for written communication and occasional meetings, and I am working on becoming more spontaneous when I speak.',
    script:[
      ['ASK','Could you briefly introduce yourself and describe what you do?','Observe: range of vocabulary, control of present tenses, ability to develop.'],
      ['ASK','What are your main responsibilities at work?','Follow-up: Which responsibility requires the most communication?'],
      ['ASK','When do you use English in your professional or everyday life?','Follow-up: Which situation is easiest or most difficult for you?'],
      ['ASK','Tell me about a recent situation where you had to solve a problem.','Observe: past tenses, sequencing, clarity.'],
      ['ASK','What would you like to improve in your English and why?','Observe: ability to justify and explain.']
    ]
  },
  {
    title:'Partie 2 · Mise en situation',
    candidate:'Situation : un fournisseur vous informe qu’une livraison importante aura deux jours de retard. Vous devez comprendre la situation, expliquer l’impact et négocier une solution.',
    hint:'Interaction : acknowledge → clarify → explain impact → propose solution → confirm next step.',
    modelB1:'Thanks for letting me know. Can you tell me why the delivery is late? We need these items for an important project, so a two-day delay is difficult for us. Could you send part of the order earlier? If not, please confirm the new delivery date by email.',
    modelB2:'Thanks for informing me. Before we decide how to proceed, could you clarify what caused the delay and whether the entire order is affected? The two-day delay could create a significant problem for our schedule. Would it be possible to prioritise the most urgent items or arrange a partial delivery? If that is not feasible, I’d like written confirmation of the revised date and any alternative options you can offer.',
    script:[
      ['SAY','Hello, I’m calling from the supplier. I’m afraid your delivery will be two days late.','Wait for the candidate to react and ask questions.'],
      ['SAY','A transport problem affected several orders. At the moment, the whole delivery is delayed.','If needed: “How does this affect you?”'],
      ['SAY','We may be able to send half the order tomorrow, but I need to check with logistics.','Observe: negotiation, clarification, conditional language.'],
      ['ASK','What would you like me to do next?','Candidate should make a clear request and confirm next step.']
    ]
  },
  {
    title:'Partie 3 · Discussion',
    candidate:'Sujet : les entreprises devraient-elles permettre davantage de travail hybride ? Donnez votre opinion, nuancez-la et réagissez aux questions.',
    hint:'Opinion → reason 1 → example → reason 2 / limitation → conclusion.',
    modelB1:'I think hybrid work can be a good solution because people save time on commuting and can concentrate better at home. However, teams still need regular face-to-face contact. In my opinion, a balance of home and office work is better than working remotely all the time.',
    modelB2:'I’m generally in favour of hybrid work because it can improve flexibility and reduce unnecessary commuting. It may also help people organise focused work more efficiently. That said, it is not suitable for every role, and teams can lose informal communication if they rarely meet in person. I therefore think companies should offer flexibility while setting clear expectations about availability, collaboration and regular on-site contact.',
    script:[
      ['ASK','Do you think hybrid work is generally positive or negative? Why?','Observe: opinion language and development.'],
      ['ASK','What are the main advantages for employees and employers?','Follow-up: Can you give an example?'],
      ['ASK','What problems can hybrid work create?','Observe: ability to balance arguments.'],
      ['ASK','Should every employee have the same level of flexibility?','Encourage justification.'],
      ['ASK','What would an effective hybrid-work policy include?','Observe: recommendations, modal verbs, precision.']
    ]
  }
];

const pronData = [
  {phrase:'Could you confirm the revised delivery date?',focus:'Sentence stress',tip:'Stress the content words: confirm, revised, delivery, date.',detail:'Keep “Could you” lighter and faster. The strongest stress normally falls on “date” because it carries the key new information.'},
  {phrase:'I’ve worked here for three years.',focus:'Weak forms & linking',tip:'Link “worked_here” smoothly and keep “for” weak.',detail:'Avoid separating every word. English rhythm groups important words together: worked — three — years.'},
  {phrase:'The project was approved yesterday.',focus:'-ed endings',tip:'“Approved” ends with a voiced /d/ sound.',detail:'Do not add an extra syllable after “approved”. The final sound attaches directly to the word.'},
  {phrase:'I think this is the best option.',focus:'TH sound',tip:'Keep the tongue lightly between the teeth for “think” and “this”.',detail:'“Think” begins with an unvoiced TH; “this” begins with a voiced TH. Avoid replacing both with /s/, /z/ or /d/.'},
  {phrase:'Would you mind sending me the updated figures?',focus:'Connected speech',tip:'Let “would you” connect naturally.',detail:'In normal connected speech, “would you” often blends. Keep the sentence flowing instead of pronouncing every word separately.'},
  {phrase:'Although the results are encouraging, we should remain cautious.',focus:'Intonation',tip:'Use a small rise after “encouraging” and fall at the end.',detail:'The first clause sets up a contrast, so keep it open with a slight rise. Finish the main message with falling intonation.'}
];

const writingData = [
  {
    title:'Tâche 1 · Reprogrammer une réunion',
    prompt:'Vous devez déplacer une réunion prévue demain à 10h. Rédigez un e-mail professionnel : excusez-vous, expliquez brièvement le changement, proposez deux nouveaux créneaux et demandez au destinataire de confirmer son choix.',
    target:'80–120 mots',
    keys:['sorry','apolog','unfortunately','available','could','confirm'],
    hint:'Greeting → brief apology → reason → two alternatives → request confirmation → polite closing.',
    modelB1:`Subject: Change of meeting time

Hello,

I’m sorry, but I’m no longer available for our meeting tomorrow at 10 a.m. because of an urgent appointment.

Could we move the meeting to tomorrow at 3 p.m. or Thursday at 11 a.m.? Please let me know which time is more convenient for you.

I apologise for the change and thank you for your understanding.

Kind regards,`,
    modelB2:`Subject: Request to reschedule tomorrow’s meeting

Dear colleague,

I’m afraid I need to reschedule our meeting planned for tomorrow at 10 a.m. due to an unexpected commitment that I cannot move.

Would tomorrow at 3 p.m. or Thursday at 11 a.m. work for you instead? If neither option is convenient, please let me know your availability and I will do my best to adapt.

I apologise for the short notice and would appreciate it if you could confirm your preferred option.

Kind regards,`
  },
  {
    title:'Tâche 2 · Répondre à une réclamation',
    prompt:'Un client vous écrit parce qu’une commande importante est arrivée avec deux jours de retard. Répondez : reconnaissez le problème, présentez vos excuses, donnez une explication prudente, proposez une solution et invitez le client à vous recontacter si nécessaire.',
    target:'100–140 mots',
    keys:['sorry','apolog','delay','understand','solution','contact'],
    hint:'Acknowledge → apologise → explain without blaming → solution → offer further help.',
    modelB1:`Dear Customer,

Thank you for your message. I’m very sorry that your order arrived two days late. I understand that this delay may have caused difficulties for you.

The delay was caused by an unexpected transport problem. We are reviewing the situation with our delivery partner.

As a solution, we would like to offer priority handling on your next order. Please contact me directly if you need any further information.

We apologise again for the inconvenience.

Kind regards,`,
    modelB2:`Dear Customer,

Thank you for contacting us. I sincerely apologise for the two-day delay to your order and understand the impact this may have had on your schedule.

Our initial review indicates that an unexpected transport disruption affected the final stage of delivery. We are following this up with our logistics partner to reduce the risk of a similar issue.

To make up for the inconvenience, we can offer priority processing on your next order and direct tracking support from our team. Please feel free to contact me if you would like to discuss any additional concerns.

Kind regards,`
  },
  {
    title:'Tâche 3 · Donner un avis argumenté',
    prompt:'Rédigez un court texte : “Should companies offer more hybrid working?” Donnez votre opinion, développez au moins deux arguments, mentionnez une limite ou un contre-argument et concluez.',
    target:'120–170 mots',
    keys:['think','because','however','for example','in conclusion','should'],
    hint:'Clear opinion → reason 1 + example → reason 2 → counterpoint → conclusion.',
    modelB1:`I think companies should offer more hybrid working when the job allows it. First, employees can save time because they do not need to travel to the office every day. This can also help them concentrate on tasks that require quiet time.

Another advantage is flexibility. For example, employees can organise some personal responsibilities more easily.

However, hybrid work also has limits. Teams still need to meet in person to communicate well and build good relationships.

In conclusion, I think hybrid working is positive if companies keep clear rules and regular contact between colleagues.`,
    modelB2:`In my view, companies should offer hybrid working where it is compatible with the role. One major advantage is that employees can reduce commuting time and use part of that time more productively. It can also support focused work by giving people more control over their environment.

A second benefit is flexibility, which may improve motivation and retention. For example, employees can manage occasional personal constraints without losing an entire working day.

However, excessive remote work can weaken informal communication and make collaboration more difficult, especially for new employees.

In conclusion, hybrid work is most effective when flexibility is combined with clear expectations, reliable communication and regular opportunities to meet in person.`
  }
];

const state = loadState() || {
  mode:'practice',
  teacher:false,
  written:{responses:[], currentCat:0, currentId:null, currentDifficulty:2, catCounts:{}, finished:false, assisted:{}},
  oral:{phase:0, ratings:{}, comments:''},
  pron:{index:0, clarity:'', rhythm:''},
  writing:{answers:{}, ratings:{}, comments:''},
  finalComments:'',
  started:false
};

let currentQuestion = null;
let qSeconds = 45, qRemaining = 45, qTimer = null;
let totalRemaining = 50*60, totalTimer = null;
let selectedResponse = null;
let answerLocked = false;
let audioPlays = 0;
let selectedWord = null;
let orderAnswer = [];
let voices = [];
let recorder = null, recChunks = [], recStream = null, recURL = null;
let pronRecorder = null, pronChunks = [], pronStream = null, pronURL = null;
let oralRemaining = 20*60, oralTimerHandle = null;

function saveState(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    $('saveIndicator').textContent='● Sauvegardé';
    setTimeout(()=>{ $('saveIndicator').textContent='● Prêt'; },900);
  }catch(e){}
}
function loadState(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')}catch(e){return null}
}
function toast(msg){
  const t=$('toast'); t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),1800);
}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(s){return String(s??'').toLowerCase().replace(/[’]/g,"'").replace(/[^\w\s'-]/g,'').replace(/\s+/g,' ').trim()}
function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a;
}
function showView(id){
  $$('.view').forEach(v=>v.classList.toggle('active',v.id===id));
  window.scrollTo({top:0,behavior:'smooth'});
  if(id==='resultsView') renderResults();
}
function applyMode(){
  document.body.classList.toggle('exam-mode',state.mode==='exam');
  $('practiceModeBtn').classList.toggle('active',state.mode==='practice');
  $('examModeBtn').classList.toggle('active',state.mode==='exam');
}
function applyTeacher(){
  document.body.classList.toggle('teacher-view',!!state.teacher);
  $('candidateViewBtn').style.display=state.teacher?'inline-flex':'none';
  $('teacherViewBtn').style.display=state.teacher?'none':'inline-flex';
}
function setMode(mode){
  state.mode=mode; applyMode(); saveState();
  toast(mode==='practice'?'Mode entraînement activé':'Mode examen activé');
}
function initVoices(){
  const populate=()=>{
    voices=speechSynthesis.getVoices().filter(v=>/^en(-|_)/i.test(v.lang));
    const sel=$('voiceSelect');
    if(!voices.length){sel.innerHTML='<option value="">Voix du navigateur</option>';return}
    sel.innerHTML=voices.map((v,i)=>`<option value="${i}">${esc(v.name)} · ${esc(v.lang)}</option>`).join('');
    const target=$('accentSelect').value;
    const idx=voices.findIndex(v=>v.lang.toLowerCase().startsWith(target.toLowerCase()));
    if(idx>=0)sel.value=String(idx);
  };
  populate(); speechSynthesis.onvoiceschanged=populate;
}
function speak(text, locale){
  if(!('speechSynthesis' in window))return toast('Synthèse vocale indisponible dans ce navigateur.');
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang=locale||$('accentSelect').value||'en-GB';
  const idx=parseInt($('voiceSelect').value,10);
  if(voices[idx])u.voice=voices[idx];
  u.rate=.94;
  speechSynthesis.speak(u);
}
function formatTime(sec){
  sec=Math.max(0,Math.floor(sec));
  return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;
}
function startTotalTimer(){
  if(totalTimer)return;
  totalTimer=setInterval(()=>{
    totalRemaining--;
    $('totalTimer').textContent=formatTime(totalRemaining);
    if(totalRemaining<=0){clearInterval(totalTimer);totalTimer=null;finishWritten();}
  },1000);
}
function questionTime(q){
  if(q.type==='textorder')return 80;
  if(q.type==='reorder')return 65;
  if(q.type==='wordbank')return 55;
  if(q.cat==='reading')return 75;
  if(q.cat==='listening')return 60;
  return q.d>=4?55:45;
}
function startQuestionTimer(){
  clearInterval(qTimer);
  qSeconds=questionTime(currentQuestion); qRemaining=qSeconds;
  updateQuestionTimer();
  qTimer=setInterval(()=>{
    qRemaining--;
    updateQuestionTimer();
    if(qRemaining<=0){
      clearInterval(qTimer);qTimer=null;
      if(!answerLocked){toast('Temps écoulé. Passage à la question suivante.');submitAnswer(true);}
    }
  },1000);
}
function updateQuestionTimer(){
  $('questionTimer').textContent=formatTime(qRemaining);
  const pct=(qRemaining/qSeconds)*100;
  $('timeStripFill').style.width=pct+'%';
  $('timeStripFill').style.background=pct>50?'var(--green)':pct>25?'var(--yellow)':'var(--red)';
}
function answeredIds(cat){return state.written.responses.filter(r=>r.cat===cat).map(r=>r.id)}
function nextQuestionForCat(cat){
  const used=answeredIds(cat);
  const candidates=bank.filter(q=>q.cat===cat&&!used.includes(q.id));
  if(!candidates.length)return null;
  const diff=state.written.currentDifficulty||2;
  const sorted=candidates.sort((a,b)=>Math.abs(a.d-diff)-Math.abs(b.d-diff));
  const pool=sorted.slice(0,Math.min(4,sorted.length));
  return pool[Math.floor(Math.random()*pool.length)];
}
function catResponseCount(cat){return state.written.responses.filter(r=>r.cat===cat).length}
function startWritten(){
  state.started=true;
  if(state.written.finished){showView('writtenDoneView');renderWrittenPreview();return}
  showView('writtenView');
  startTotalTimer();
  loadNextQuestion();
  saveState();
}
function loadNextQuestion(){
  const cat=CATS[state.written.currentCat];
  if(!cat){finishWritten();return}
  if(catResponseCount(cat)>=10){
    state.written.currentCat++;
    state.written.currentDifficulty=2;
    if(state.written.currentCat>=CATS.length){finishWritten();return}
    saveState();
    return loadNextQuestion();
  }
  if(state.written.currentId){
    currentQuestion=bank.find(q=>q.id===state.written.currentId);
    if(!currentQuestion)state.written.currentId=null;
  }
  if(!currentQuestion || state.written.currentId!==currentQuestion.id){
    currentQuestion=nextQuestionForCat(CATS[state.written.currentCat]);
  }
  if(!currentQuestion){finishWritten();return}
  state.written.currentId=currentQuestion.id;
  answerLocked=false;selectedResponse=null;selectedWord=null;orderAnswer=[];audioPlays=0;
  renderQuestion();
  startQuestionTimer();
  saveState();
}
function renderCategoryDots(){
  $('categoryDots').innerHTML=CATS.map((c,i)=>`<div class="${i<state.written.currentCat?'done':i===state.written.currentCat?'current':''}" title="${CAT_LABELS[c]}"></div>`).join('');
}
function renderQuestion(){
  const q=currentQuestion, cat=q.cat;
  $('categoryTitle').textContent=CAT_LABELS[cat];
  $('progressText').textContent=`Question ${state.written.responses.length+1} / 50`;
  $('progressBar').style.width=`${(state.written.responses.length/50)*100}%`;
  $('levelHint').textContent='Questionnaire évolutif';
  renderCategoryDots();
  $('questionInstruction').textContent=instructionFor(q);
  $('questionPrompt').textContent=q.prompt;
  $('hintBox').classList.add('hidden');
  $('practiceFeedback').className='feedback hidden practice-only';
  $('practiceFeedback').textContent='';
  $('assistFlag').textContent='';
  $('validateBtn').classList.remove('hidden');
  $('nextQuestionBtn').classList.add('hidden');
  $('validateBtn').disabled=false;
  $('readingPassage').classList.toggle('hidden',!q.passage);
  $('readingPassage').textContent=q.passage||'';
  $('listeningPanel').classList.toggle('hidden',q.cat!=='listening');
  $('audioPlays').textContent='2 écoutes disponibles';
  $('playAudioBtn').disabled=false;
  renderQuestionArea(q);
}
function instructionFor(q){
  return ({
    mcq:'Choisissez la meilleure réponse.',
    dropdown:'Sélectionnez le mot ou l’expression qui complète correctement la phrase.',
    fill:'Saisissez le mot ou l’expression manquante.',
    wordbank:'Complétez la phrase avec un mot de la banque.',
    reorder:'Remettez les mots dans le bon ordre.',
    textorder:'Remettez les éléments dans l’ordre logique.'
  })[q.type]||'Répondez à la question.';
}
function renderQuestionArea(q){
  const area=$('questionArea');area.innerHTML='';
  if(q.type==='mcq'){
    const shuffled=shuffle(q.options);
    const wrap=document.createElement('div');wrap.className='option-grid';
    shuffled.forEach((opt,i)=>{
      const b=document.createElement('button');b.type='button';b.className='option';
      b.innerHTML=`<span class="letter">${String.fromCharCode(65+i)}</span><span>${esc(opt)}</span>`;
      b.addEventListener('click',()=>{if(answerLocked)return; selectedResponse=opt; $$('.option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')});
      wrap.appendChild(b);
    });area.appendChild(wrap);
  }else if(q.type==='dropdown'){
    const s=document.createElement('select');s.className='dropdown-input';
    s.innerHTML='<option value="">— Choisissez —</option>'+shuffle(q.options).map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join('');
    s.addEventListener('change',()=>selectedResponse=s.value);area.appendChild(s);
  }else if(q.type==='fill'){
    const inp=document.createElement('input');inp.className='fill-input';inp.type='text';inp.autocomplete='off';inp.placeholder='Votre réponse';
    inp.addEventListener('input',()=>selectedResponse=inp.value);area.appendChild(inp);setTimeout(()=>inp.focus(),50);
  }else if(q.type==='wordbank'){
    const row=document.createElement('div');row.className='blank-row';
    const pre=document.createElement('span');pre.textContent=q.prefix||'';
    const slot=document.createElement('button');slot.type='button';slot.className='blank-slot';slot.textContent='…';
    const suf=document.createElement('span');suf.textContent=q.suffix||'';
    row.append(pre,slot,suf);area.appendChild(row);
    const wb=document.createElement('div');wb.className='wordbank';
    shuffle(q.words).forEach(w=>{
      const b=document.createElement('button');b.type='button';b.className='word-chip';b.textContent=w;
      b.addEventListener('click',()=>{if(answerLocked)return;selectedResponse=w;slot.textContent=w;slot.classList.add('filled');$$('.word-chip').forEach(x=>x.classList.remove('used'));b.classList.add('used')});
      wb.appendChild(b);
    });area.appendChild(wb);
  }else if(q.type==='reorder'){
    const answer=document.createElement('div');answer.className='order-area';answer.id='orderArea';area.appendChild(answer);
    const bankEl=document.createElement('div');bankEl.className='wordbank';
    shuffle(q.tokens).forEach((tok,i)=>{
      const b=document.createElement('button');b.type='button';b.className='order-chip';b.textContent=tok;b.dataset.token=tok;b.dataset.uid=i;
      b.addEventListener('click',()=>toggleOrderToken(b,answer));
      bankEl.appendChild(b);
    });area.appendChild(bankEl);
  }else if(q.type==='textorder'){
    const answer=document.createElement('div');answer.className='order-area';answer.id='orderArea';area.appendChild(answer);
    const bankEl=document.createElement('div');bankEl.className='wordbank';
    shuffle(q.sentences).forEach((s,i)=>{
      const b=document.createElement('button');b.type='button';b.className='order-chip';b.textContent=s;b.dataset.token=s;b.dataset.uid=i;
      b.addEventListener('click',()=>toggleOrderToken(b,answer));
      bankEl.appendChild(b);
    });area.appendChild(bankEl);
  }
}
function toggleOrderToken(btn,answer){
  if(answerLocked)return;
  const token=btn.dataset.token;
  const idx=orderAnswer.findIndex(x=>x.uid===btn.dataset.uid);
  if(idx>=0){orderAnswer.splice(idx,1);btn.classList.remove('used');}
  else{orderAnswer.push({uid:btn.dataset.uid,token});btn.classList.add('used');}
  answer.innerHTML='';
  orderAnswer.forEach(item=>{
    const c=document.createElement('button');c.type='button';c.className='order-chip in-answer';c.textContent=item.token;
    c.addEventListener('click',()=>{const orig=$$(`.order-chip[data-uid="${item.uid}"]`)[0];if(orig)toggleOrderToken(orig,answer)});
    answer.appendChild(c);
  });
  selectedResponse=orderAnswer.map(x=>x.token).join(' ');
}
function showHint(){
  const q=currentQuestion;
  state.written.assisted[q.id]=true;
  $('assistFlag').textContent='Aide utilisée pour cette question';
  const hint=q.hint||genericHint(q);
  $('hintBox').textContent=hint;
  $('hintBox').classList.remove('hidden');
  saveState();
}
function genericHint(q){
  if(q.type==='mcq')return 'Éliminez d’abord les options qui ne conviennent pas au sens ou à la grammaire de la phrase.';
  if(q.type==='reorder'||q.type==='textorder')return 'Cherchez d’abord le sujet / l’idée de départ, puis les éléments qui développent ou concluent.';
  if(q.type==='dropdown')return 'Lisez toute la phrase avant de choisir : le mot doit convenir au sens ET à la structure.';
  return 'Repérez les mots-clés autour du blanc et vérifiez la forme grammaticale attendue.';
}
function isCorrect(q,response){
  if(q.type==='reorder')return norm(response)===norm(q.answer);
  if(q.type==='textorder')return orderAnswer.map(x=>x.token).join('|')===q.correctOrder.join('|');
  const accepted=q.accepted||[q.answer];
  return accepted.some(a=>norm(a)===norm(response));
}
function correctDisplay(q){
  if(q.type==='textorder')return q.correctOrder.join(' → ');
  return q.answer;
}
function submitAnswer(timeout=false){
  if(answerLocked)return;
  clearInterval(qTimer);qTimer=null;
  let response=selectedResponse;
  if((qTypeNeedsAnswer(currentQuestion.type)) && !String(response??'').trim() && !timeout){
    toast('Répondez avant de valider.');startQuestionTimer();return;
  }
  if(currentQuestion.type==='textorder')response=orderAnswer.map(x=>x.token).join('|');
  const correct=isCorrect(currentQuestion,response);
  answerLocked=true;
  const assisted=!!state.written.assisted[currentQuestion.id];
  state.written.responses.push({id:currentQuestion.id,cat:currentQuestion.cat,d:currentQuestion.d,response:response??'',correct,assisted});
  state.written.currentId=null;
  state.written.currentDifficulty=Math.max(1,Math.min(4,(state.written.currentDifficulty||2)+(correct?1:-1)));
  saveState();
  $('validateBtn').classList.add('hidden');
  $('nextQuestionBtn').classList.remove('hidden');
  if(state.mode==='practice'){
    const f=$('practiceFeedback');
    f.className='feedback practice-only '+(correct?'ok':'bad');
    f.innerHTML=`${correct?'✓ Bonne réponse.':'✕ Réponse à revoir.'} <br><span style="font-weight:500">${esc(currentQuestion.explain||'')} ${correct?'':`<br><b>Réponse attendue :</b> ${esc(correctDisplay(currentQuestion))}`}</span>`;
  } else {
    setTimeout(()=>nextQuestion(),500);
  }
}
function qTypeNeedsAnswer(){return true}
function nextQuestion(){
  currentQuestion=null;
  loadNextQuestion();
}
function playListening(){
  if(!currentQuestion||currentQuestion.cat!=='listening')return;
  if(audioPlays>=2)return;
  audioPlays++;
  speak(currentQuestion.script,currentQuestion.locale||$('accentSelect').value);
  const left=2-audioPlays;
  $('audioPlays').textContent=left===0?'Aucune écoute restante':`${left} écoute${left>1?'s':''} restante${left>1?'s':''}`;
  if(left===0)$('playAudioBtn').disabled=true;
}
function finishWritten(){
  clearInterval(qTimer);clearInterval(totalTimer);qTimer=totalTimer=null;
  state.written.finished=true;state.written.currentId=null;
  saveState();renderWrittenPreview();showView('writtenDoneView');
}
function categoryStats(cat){
  const rs=state.written.responses.filter(r=>r.cat===cat);
  const correct=rs.filter(r=>r.correct).length;
  const weightedMax=rs.reduce((s,r)=>s+r.d,0)||1;
  const weighted=rs.reduce((s,r)=>s+(r.correct?r.d:0),0);
  const pct=Math.round(weighted/weightedMax*100);
  return {count:rs.length,correct,pct,assisted:rs.filter(r=>r.assisted).length};
}
function renderWrittenPreview(){
  $('writtenPreview').innerHTML=CATS.map(c=>{const s=categoryStats(c);return `<div><b>${CAT_LABELS[c]}</b><br>${s.correct}/10</div>`}).join('');
}
function renderOral(){
  const phase=oralData[state.oral.phase||0];
  $('oralPhaseTitle').textContent=phase.title;
  $('oralCandidateInstruction').textContent=phase.candidate;
  $('oralCandidatePrompt').textContent=phase.candidate;
  $$('.phase-tab').forEach((b,i)=>b.classList.toggle('active',i===state.oral.phase));
  $('oralHintBox').classList.add('hidden');$('oralModelsBox').classList.add('hidden');
  $('examinerScript').innerHTML=phase.script.map(x=>`<div class="script-block"><div class="say">${esc(x[0])}</div><div>${esc(x[1])}</div><div class="observe">${esc(x[2])}</div></div>`).join('');
}
function oralModels(){
  const p=oralData[state.oral.phase];
  $('oralModelsBox').innerHTML=`<b>Modèle B1</b><p>${esc(p.modelB1)}</p><b>Modèle B2</b><p>${esc(p.modelB2)}</p>`;
  $('oralModelsBox').classList.remove('hidden');
}
function renderOralRubric(){
  const criteria=['Vocabulaire','Grammaire & syntaxe','Aisance & fluidité','Prononciation & intonation','Interaction'];
  $('oralRubric').innerHTML=criteria.map(c=>`<div class="rubric-item"><label>${c}</label><select data-oral-rating="${esc(c)}">${RUBRIC_LEVELS.map(l=>`<option ${state.oral.ratings[c]===l?'selected':''}>${l}</option>`).join('')}</select></div>`).join('');
  $$('[data-oral-rating]').forEach(s=>s.addEventListener('change',()=>{state.oral.ratings[s.dataset.oralRating]=s.value;saveState()}));
  $('oralComments').value=state.oral.comments||'';
}
function startOralTimer(){
  if(oralTimerHandle)return;
  oralTimerHandle=setInterval(()=>{
    oralRemaining--; $('oralTimer').textContent=formatTime(oralRemaining);
    if(oralRemaining<=0){clearInterval(oralTimerHandle);oralTimerHandle=null;toast('20 minutes écoulées.');}
  },1000);
}
async function startRecording(kind='oral'){
  try{
    recStream=await navigator.mediaDevices.getUserMedia({audio:true});
    recChunks=[];
    recorder=new MediaRecorder(recStream);
    recorder.ondataavailable=e=>recChunks.push(e.data);
    recorder.onstop=()=>{
      const blob=new Blob(recChunks,{type:recorder.mimeType||'audio/webm'});
      if(recURL)URL.revokeObjectURL(recURL);
      recURL=URL.createObjectURL(blob);
      $('oralPlayback').src=recURL;$('oralPlayback').classList.remove('hidden');
      $('recordingDownload').href=recURL;$('recordingDownload').classList.remove('hidden');
      recStream.getTracks().forEach(t=>t.stop());
    };
    recorder.start();
    $('recordBtn').classList.add('hidden');$('stopRecordBtn').classList.remove('hidden');
  }catch(e){toast("Permission micro indisponible.");}
}
function stopRecording(){
  if(recorder&&recorder.state!=='inactive')recorder.stop();
  $('recordBtn').classList.remove('hidden');$('stopRecordBtn').classList.add('hidden');
}
function renderPron(){
  const p=pronData[state.pron.index||0];
  $('pronList').innerHTML=pronData.map((x,i)=>`<button class="pron-item ${i===state.pron.index?'active':''}" data-pron="${i}" type="button"><strong>${esc(x.phrase)}</strong><span>${esc(x.focus)}</span></button>`).join('');
  $$('[data-pron]').forEach(b=>b.addEventListener('click',()=>{state.pron.index=+b.dataset.pron;saveState();renderPron()}));
  $('pronFocus').textContent=p.focus;$('pronPhrase').textContent=p.phrase;$('pronTip').textContent=p.tip;
  $('pronDetail').textContent=p.detail;$('pronDetail').classList.add('hidden');
  $('pronClarity').value=state.pron.clarity||'';$('pronRhythm').value=state.pron.rhythm||'';
}
async function startPronRecording(){
  try{
    pronStream=await navigator.mediaDevices.getUserMedia({audio:true});
    pronChunks=[];
    pronRecorder=new MediaRecorder(pronStream);
    pronRecorder.ondataavailable=e=>pronChunks.push(e.data);
    pronRecorder.onstop=()=>{
      const blob=new Blob(pronChunks,{type:pronRecorder.mimeType||'audio/webm'});
      if(pronURL)URL.revokeObjectURL(pronURL);
      pronURL=URL.createObjectURL(blob);
      $('pronPlayback').src=pronURL;$('pronPlayback').classList.remove('hidden');
      pronStream.getTracks().forEach(t=>t.stop());
    };
    pronRecorder.start();
    $('pronStartRecBtn').classList.add('hidden');$('pronStopRecBtn').classList.remove('hidden');
  }catch(e){toast("Permission micro indisponible.");}
}
function stopPronRecording(){
  if(pronRecorder&&pronRecorder.state!=='inactive')pronRecorder.stop();
  $('pronStartRecBtn').classList.remove('hidden');$('pronStopRecBtn').classList.add('hidden');
}
function renderWriting(){
  $('writingTasks').innerHTML=writingData.map((w,i)=>`
    <article class="writing-card">
      <div class="writing-head"><div><div class="eyebrow">PRODUCTION ${i+1}</div><h2>${esc(w.title)}</h2></div><div class="word-count" id="wc-${i}">0 mot</div></div>
      <div class="writing-prompt">${esc(w.prompt)}<div class="writing-meta"><span>Objectif : ${esc(w.target)}</span></div></div>
      <textarea id="write-${i}" rows="9" placeholder="Rédigez votre réponse ici…">${esc(state.writing.answers[i]||'')}</textarea>
      <div class="writing-actions">
        <button class="secondary" data-check-write="${i}" type="button">Auto-vérification</button>
        <button class="support-btn practice-only" data-write-hint="${i}" type="button">Voir le plan</button>
        <button class="support-btn practice-only" data-write-model="${i}" type="button">Voir les modèles</button>
      </div>
      <div id="write-feedback-${i}" class="checklist-result"></div>
      <div id="write-support-${i}" class="models-box hidden practice-only"></div>
    </article>`).join('');
  writingData.forEach((w,i)=>{
    const ta=$(`write-${i}`);updateWordCount(i,ta.value);
    ta.addEventListener('input',()=>{state.writing.answers[i]=ta.value;updateWordCount(i,ta.value);saveState()});
  });
  $$('[data-check-write]').forEach(b=>b.addEventListener('click',()=>checkWriting(+b.dataset.checkWrite)));
  $$('[data-write-hint]').forEach(b=>b.addEventListener('click',()=>showWritingSupport(+b.dataset.writeHint,'hint')));
  $$('[data-write-model]').forEach(b=>b.addEventListener('click',()=>showWritingSupport(+b.dataset.writeModel,'models')));
}
function updateWordCount(i,text){
  const n=(String(text).trim().match(/\b[\w’'-]+\b/g)||[]).length;
  $(`wc-${i}`).textContent=`${n} mot${n>1?'s':''}`;
}
function checkWriting(i){
  const w=writingData[i],txt=norm(state.writing.answers[i]||'');
  const hits=w.keys.filter(k=>txt.includes(norm(k))).length;
  $(`write-feedback-${i}`).innerHTML=`Repères présents : <b>${hits}/${w.keys.length}</b>. Vérifiez aussi : salutation / structure, précision grammaticale, connecteurs, conclusion et ton professionnel.`;
}
function showWritingSupport(i,type){
  const w=writingData[i],box=$(`write-support-${i}`);
  box.innerHTML=type==='hint'?`<b>Plan suggéré</b><p>${esc(w.hint)}</p>`:`<b>Modèle B1</b><pre>${esc(w.modelB1)}</pre><b>Modèle B2</b><pre>${esc(w.modelB2)}</pre>`;
  box.classList.remove('hidden');
}
function renderWritingRubric(){
  const criteria=['Pertinence & réalisation de la tâche','Organisation & cohérence','Grammaire & syntaxe','Vocabulaire & registre'];
  $('writingRubric').innerHTML=criteria.map(c=>`<div class="rubric-item"><label>${c}</label><select data-write-rating="${esc(c)}">${RUBRIC_LEVELS.map(l=>`<option ${state.writing.ratings[c]===l?'selected':''}>${l}</option>`).join('')}</select></div>`).join('');
  $$('[data-write-rating]').forEach(s=>s.addEventListener('change',()=>{state.writing.ratings[s.dataset.writeRating]=s.value;saveState()}));
  $('writingComments').value=state.writing.comments||'';
}
function levelFromPct(pct){
  if(pct>=86)return 'C1';
  if(pct>=72)return 'B2';
  if(pct>=56)return 'B1';
  if(pct>=38)return 'A2';
  return 'A1';
}
function rubricAvg(ratings){
  const map={A1:1,A2:2,B1:3,B2:4,C1:5,C2:6};
  const vals=Object.values(ratings||{}).map(x=>map[x]).filter(Boolean);
  if(!vals.length)return null;
  const avg=vals.reduce((a,b)=>a+b,0)/vals.length;
  return avg;
}
function levelFromNum(n){
  if(n==null)return '—';
  if(n<1.5)return 'A1';if(n<2.5)return 'A2';if(n<3.5)return 'B1';if(n<4.5)return 'B2';if(n<5.5)return 'C1';return 'C2';
}
function computeResults(){
  const stats={};
  CATS.forEach(c=>stats[c]=categoryStats(c));
  const writtenPcts=CATS.map(c=>stats[c].pct).filter(x=>Number.isFinite(x));
  const writtenAvg=writtenPcts.length?Math.round(writtenPcts.reduce((a,b)=>a+b,0)/writtenPcts.length):0;
  const oralNum=rubricAvg(state.oral.ratings);
  const writingNum=rubricAvg(state.writing.ratings);
  const writtenNum=writtenAvg<38?1:writtenAvg<56?2:writtenAvg<72?3:writtenAvg<86?4:5;
  const components=[writtenNum];
  if(oralNum)components.push(oralNum);
  if(writingNum)components.push(writingNum);
  const overallNum=components.reduce((a,b)=>a+b,0)/components.length;
  return {stats,writtenAvg,oralNum,writingNum,overall:levelFromNum(overallNum)};
}
function renderResults(){
  const r=computeResults();
  $('overallBadge').textContent=r.overall;
  const cards=CATS.map(c=>({label:CAT_LABELS[c],score:r.stats[c].pct,level:levelFromPct(r.stats[c].pct),sub:`${r.stats[c].correct}/${r.stats[c].count||10} réponses correctes${r.stats[c].assisted?` · ${r.stats[c].assisted} avec aide`:''}`}));
  cards.push({label:'Expression orale',score:r.oralNum?Math.round(r.oralNum/6*100):null,level:levelFromNum(r.oralNum),sub:'Évaluation manuelle sur 5 critères'});
  cards.push({label:'Production écrite',score:r.writingNum?Math.round(r.writingNum/6*100):null,level:levelFromNum(r.writingNum),sub:'Évaluation manuelle sur 4 critères'});
  $('resultsCards').innerHTML=cards.map(c=>`<article class="result-card"><div class="label">${esc(c.label)}</div><div class="score-row"><strong>${c.score==null?'—':c.score+'%'}</strong><span class="level">${esc(c.level)}</span></div><div class="meter"><span style="width:${c.score||0}%"></span></div><small>${esc(c.sub)}</small></article>`).join('');
  const best=[...CATS].sort((a,b)=>r.stats[b].pct-r.stats[a].pct)[0];
  const weak=[...CATS].sort((a,b)=>r.stats[a].pct-r.stats[b].pct)[0];
  let summary=`Estimation pédagogique globale : ${r.overall}.\n\n`;
  summary+=`Épreuve informatisée : ${r.writtenAvg}% de performance pondérée. Point fort actuel : ${CAT_LABELS[best]} (${r.stats[best].pct}%). Axe à consolider : ${CAT_LABELS[weak]} (${r.stats[weak].pct}%).\n\n`;
  summary+=r.oralNum?`Expression orale : ${levelFromNum(r.oralNum)} selon la grille formateur.\n`:'Expression orale : grille formateur non complétée.\n';
  summary+=r.writingNum?`Production écrite complémentaire : ${levelFromNum(r.writingNum)} selon la grille formateur.\n`:'Production écrite complémentaire : grille formateur non complétée.\n';
  summary+=`\nRappel : cette estimation ne reproduit pas l'algorithme officiel CLOE et ne constitue pas un résultat de certification.`;
  $('summaryText').textContent=summary;
  $('finalComments').value=state.finalComments||'';
}
function renderAnswerReview(){
  const byId=Object.fromEntries(bank.map(q=>[q.id,q]));
  $('answerReview').innerHTML=`<h2>Correction détaillée</h2>`+state.written.responses.map((r,i)=>{
    const q=byId[r.id];
    return `<div class="review-item"><strong>${i+1}. ${esc(q.prompt)}</strong><div class="${r.correct?'correct':'incorrect'}">${r.correct?'✓ Correct':'✕ Incorrect'} · Votre réponse : ${esc(r.response||'—')}</div><div>Réponse attendue : <b>${esc(correctDisplay(q))}</b></div><small>${esc(q.explain||'')}</small></div>`;
  }).join('');
  $('answerReview').classList.remove('hidden');
  $('answerReview').scrollIntoView({behavior:'smooth'});
}
function downloadResults(){
  const r=computeResults();
  const html=`<!doctype html><html lang="fr"><meta charset="utf-8"><title>Bilan simulation CLOE</title><style>body{font-family:Arial;max-width:950px;margin:30px auto;padding:20px;color:#24303a}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:9px;text-align:left}th{background:#203746;color:white}.note{background:#f4f6f7;padding:12px}</style><h1>Bilan · Simulation complète CLOE</h1><p>Date : ${new Intl.DateTimeFormat('fr-FR',{dateStyle:'long'}).format(new Date())}</p><table><tr><th>Compétence</th><th>Score pratique</th><th>Estimation</th></tr>${CATS.map(c=>`<tr><td>${CAT_LABELS[c]}</td><td>${r.stats[c].pct}% (${r.stats[c].correct}/10)</td><td>${levelFromPct(r.stats[c].pct)}</td></tr>`).join('')}<tr><td>Expression orale</td><td>Évaluation manuelle</td><td>${levelFromNum(r.oralNum)}</td></tr><tr><td>Production écrite</td><td>Évaluation manuelle</td><td>${levelFromNum(r.writingNum)}</td></tr></table><h2>Estimation globale</h2><p><b>${r.overall}</b></p><h2>Commentaires</h2><p>${esc(state.finalComments||'')}</p><p class="note">Document pédagogique privé. Cette estimation ne reproduit pas l'algorithme officiel CLOE et ne constitue pas un résultat de certification.</p></html>`;
  const blob=new Blob([html],{type:'text/html'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='bilan-simulation-cloe.html';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);
}
function resetAll(){
  if(!confirm('Réinitialiser toutes les réponses, notes et évaluations de cette session ?'))return;
  localStorage.removeItem(STORAGE_KEY);location.reload();
}
function bind(){
  $('practiceModeBtn').addEventListener('click',()=>setMode('practice'));
  $('examModeBtn').addEventListener('click',()=>setMode('exam'));
  $('teacherViewBtn').addEventListener('click',()=>{state.teacher=true;applyTeacher();saveState();});
  $('candidateViewBtn').addEventListener('click',()=>{state.teacher=false;applyTeacher();saveState();});
  $('startWrittenBtn').addEventListener('click',startWritten);
  $('resumeBtn').addEventListener('click',()=>{if(state.written.finished)showView('writtenDoneView');else startWritten()});
  $('testAudioBtn').addEventListener('click',()=>speak('Audio check. You should be able to hear this sentence clearly.',$('accentSelect').value));
  $('stopAudioBtn').addEventListener('click',()=>speechSynthesis.cancel());
  $('accentSelect').addEventListener('change',initVoices);
  $('hintBtn').addEventListener('click',showHint);
  $('validateBtn').addEventListener('click',()=>submitAnswer(false));
  $('nextQuestionBtn').addEventListener('click',nextQuestion);
  $('playAudioBtn').addEventListener('click',playListening);
  $('goOralBtn').addEventListener('click',()=>{showView('oralView');renderOral();renderOralRubric()});
  $('goResultsEarlyBtn').addEventListener('click',()=>showView('resultsView'));
  $$('[data-nav]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.nav)));
  $$('.phase-tab').forEach((b,i)=>b.addEventListener('click',()=>{state.oral.phase=i;saveState();renderOral()}));
  $('oralHintBtn').addEventListener('click',()=>{const p=oralData[state.oral.phase];$('oralHintBox').textContent=p.hint;$('oralHintBox').classList.remove('hidden')});
  $('oralModelsBtn').addEventListener('click',oralModels);
  $('startOralTimerBtn').addEventListener('click',startOralTimer);
  $('recordBtn').addEventListener('click',()=>startRecording('oral'));
  $('stopRecordBtn').addEventListener('click',stopRecording);
  $('saveOralBtn').addEventListener('click',()=>{state.oral.comments=$('oralComments').value;saveState();toast('Évaluation orale enregistrée')});
  $('oralToPronBtn').addEventListener('click',()=>{showView('pronunciationView');renderPron()});
  $('pronListenBtn').addEventListener('click',()=>speak(pronData[state.pron.index].phrase,$('accentSelect').value));
  $('pronStartRecBtn').addEventListener('click',startPronRecording);
  $('pronStopRecBtn').addEventListener('click',stopPronRecording);
  $('pronRevealBtn').addEventListener('click',()=>$('pronDetail').classList.remove('hidden'));
  $('savePronBtn').addEventListener('click',()=>{state.pron.clarity=$('pronClarity').value;state.pron.rhythm=$('pronRhythm').value;saveState();toast('Auto-évaluation enregistrée')});
  $('pronToWritingBtn').addEventListener('click',()=>{showView('writingView');renderWriting();renderWritingRubric()});
  $('saveWritingBtn').addEventListener('click',()=>{state.writing.comments=$('writingComments').value;saveState();toast('Évaluation écrite enregistrée')});
  $('goResultsBtn').addEventListener('click',()=>showView('resultsView'));
  $('refreshResultsBtn').addEventListener('click',renderResults);
  $('downloadResultsBtn').addEventListener('click',downloadResults);
  $('printReportBtn').addEventListener('click',()=>window.print());
  $('reviewAnswersBtn').addEventListener('click',renderAnswerReview);
  $('resetAllBtn').addEventListener('click',resetAll);
  $('finalComments').addEventListener('input',()=>{state.finalComments=$('finalComments').value;saveState()});
}
function init(){
  applyMode();applyTeacher();initVoices();bind();renderOral();renderOralRubric();renderPron();renderWriting();renderWritingRubric();renderResults();
  if(state.started)$('resumeBtn').classList.remove('hidden');
  if(state.written.finished)renderWrittenPreview();
}
document.addEventListener('DOMContentLoaded',init);
})();