const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const norm=s=>String(s??'').trim().toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ');
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const STORAGE='cloe_success_path_lesson04_reading_v1';
const startTime=Date.now();

const state={
  completed:new Set(),fr:false,solo:false,currentGuided:0,guidedDone:new Set(),guidedFirst:0,
  guidedTried:new Set(),guidedMistakes:{},ladderDone:new Set(),examScore:null,examDone:false,
  examIndex:0,examAnswers:[],examTimer:null,totalTimer:null,questionLeft:0,totalLeft:480,transitioning:false
};

const readingMap=[
 ['PURPOSE','Main idea','Why was this written? What is the writer trying to achieve?'],
 ['DETAIL','Specific information','Find the exact date, number, place, condition or fact.'],
 ['PARAPHRASE','Same idea, new words','Recognise when the answer restates the text without copying it.'],
 ['SEQUENCE','Order & timeline','Track what happened first, what changed and what happens next.'],
 ['INFERENCE','Implied meaning','Use evidence to understand what is suggested but not stated word for word.'],
 ['REFERENCE','Pronouns & links','Identify what “it”, “they”, “this” or “these” refers to.'],
 ['VOCAB','Meaning in context','Use the sentence around an unfamiliar word to infer its meaning.'],
 ['ACTION','Next step','Identify what the reader should do after reading the document.']
];

const texts=[
 {level:'A2',type:'Notice',title:'Training room change',purpose:'Inform staff of one changed detail',signals:'moved from · remains · today',text:'TODAY’S TRAINING\nThe customer-service workshop has moved from Room 4 to Room 7. The start time remains 10:30. Please bring your laptop.',fr:'FORMATION DU JOUR : l’atelier service client passe de la salle 4 à la salle 7. L’heure de début reste 10 h 30. Merci d’apporter votre ordinateur.'},
 {level:'A2',type:'Chat message',title:'Shift confirmation',purpose:'Confirm availability and ask for a reply',signals:'can cover · please confirm · by noon',text:'Hi, I can cover the early shift on Friday. Please confirm by noon today so I can organise childcare. Thanks!',fr:'Bonjour, je peux assurer le service du matin vendredi. Merci de confirmer avant midi aujourd’hui afin que je puisse organiser la garde des enfants.'},
 {level:'A2',type:'Email',title:'Appointment confirmation',purpose:'Confirm time and location',signals:'confirmed · at · reception',text:'Subject: Appointment confirmed\nYour appointment is confirmed for Tuesday 6 October at 2:15 p.m. Please report to reception ten minutes early.',fr:'Votre rendez-vous est confirmé pour le mardi 6 octobre à 14 h 15. Merci de vous présenter à l’accueil dix minutes en avance.'},
 {level:'B1',type:'Email',title:'Delivery update',purpose:'Explain a delay and give an action deadline',signals:'instead of · because of · before',text:'Subject: Delivery update\nYour order will arrive on Thursday instead of Wednesday because of a transport delay. Please contact us before 4 p.m. today if Thursday is not suitable.',fr:'Votre commande arrivera jeudi au lieu de mercredi en raison d’un retard de transport. Contactez-nous avant 16 h aujourd’hui si jeudi ne convient pas.'},
 {level:'B1',type:'Internal memo',title:'System maintenance',purpose:'Prepare staff for temporary service interruption',signals:'unavailable · between · save your work',text:'The expenses platform will be unavailable between 6 p.m. and 8 p.m. tonight for scheduled maintenance. Please save any unfinished claims before 5:45 p.m. Drafts that have already been saved will not be affected.',fr:'La plateforme de notes de frais sera indisponible entre 18 h et 20 h pour maintenance. Enregistrez les demandes non terminées avant 17 h 45. Les brouillons déjà enregistrés ne seront pas affectés.'},
 {level:'B1',type:'Customer message',title:'Incorrect invoice',purpose:'Report a billing problem and request correction',signals:'charged twice · attached · corrected invoice',text:'Hello, I was charged twice for the same service on invoice 4582. I have attached the bank statement showing both payments. Could you please send a corrected invoice and confirm when the duplicate payment will be refunded?',fr:'Le client indique avoir été facturé deux fois pour le même service et demande une facture corrigée ainsi que la date du remboursement.'},
 {level:'B1',type:'Travel update',title:'Train disruption',purpose:'Explain a travel change and alternative',signals:'cancelled · instead · valid on',text:'The 17:40 service to Bristol has been cancelled. Passengers may use the 18:10 service instead. Tickets for the cancelled train will remain valid on the later service.',fr:'Le train de 17 h 40 pour Bristol est annulé. Les passagers peuvent prendre celui de 18 h 10 et leurs billets restent valables.'},
 {level:'B1+',type:'Meeting minutes',title:'Project decisions',purpose:'Record decisions, owners and deadlines',signals:'agreed · responsible for · by',text:'The team agreed to delay the public launch by one week. Operations will complete the final supplier checks by Monday, while Marketing will update the customer announcement. The revised launch date is 19 November.',fr:'L’équipe a décidé de repousser le lancement public d’une semaine. Les opérations terminent les vérifications fournisseurs lundi et le marketing met à jour l’annonce client.'},
 {level:'B1+',type:'HR policy',title:'Remote-work request',purpose:'Explain eligibility and approval conditions',signals:'eligible · provided that · subject to approval',text:'Employees who have completed their probation period are eligible to request up to two remote-working days per week, provided that their role can be performed off-site. Requests remain subject to manager approval and team coverage requirements.',fr:'Les salariés ayant terminé leur période d’essai peuvent demander jusqu’à deux jours de télétravail par semaine si le poste le permet. La demande reste soumise à l’accord du manager et aux besoins de couverture de l’équipe.'},
 {level:'B1+',type:'Procedure',title:'Damaged goods procedure',purpose:'Give steps to follow after receiving damaged goods',signals:'first · then · within · do not',text:'If a delivery arrives damaged, first photograph the packaging before opening it. Then record the damage in the delivery portal within 24 hours. Do not return the goods until the supplier has issued a return authorisation number.',fr:'En cas de livraison endommagée, photographiez d’abord l’emballage, puis signalez les dégâts dans le portail sous 24 h. Ne renvoyez rien avant d’avoir reçu un numéro d’autorisation.'},
 {level:'B2',type:'Short report',title:'Pilot programme results',purpose:'Summarise results and recommend a next step',signals:'although · compared with · therefore',text:'The six-week pilot reduced average response time by 18% compared with the previous quarter. Although customer satisfaction remained stable, the number of unresolved cases fell noticeably. The report therefore recommends extending the pilot to two additional teams before making a company-wide decision.',fr:'Le pilote de six semaines a réduit le délai de réponse moyen de 18 %. La satisfaction est restée stable mais les dossiers non résolus ont diminué. Le rapport recommande donc d’étendre le pilote à deux équipes avant une décision générale.'},
 {level:'B2',type:'Supplier email',title:'Price revision conditions',purpose:'Negotiate a price change with conditions',signals:'in light of · provided that · would be prepared to',text:'In light of the higher raw-material costs, we understand your request for a price revision. We would be prepared to accept a 3% increase provided that the new rate remains fixed for twelve months and the current delivery terms are maintained.',fr:'Compte tenu de la hausse des matières premières, l’entreprise accepterait une hausse de 3 % à condition que le tarif soit fixe pendant douze mois et que les conditions de livraison restent inchangées.'},
 {level:'B2',type:'Short article',title:'Hybrid meeting habits',purpose:'Present findings and explain a practical implication',signals:'survey · however · suggests',text:'A recent internal survey found that employees value hybrid meetings for flexibility, but many remote participants report difficulty joining informal discussions before and after the formal agenda. The findings suggest that meeting leaders should deliberately create space for remote colleagues to contribute, rather than assuming equal participation happens automatically.',fr:'Une enquête interne montre que les réunions hybrides offrent de la flexibilité mais que les participants à distance ont du mal à rejoindre les échanges informels. Il est donc conseillé aux animateurs de créer volontairement des occasions de participation.'},
 {level:'B2',type:'Incident update',title:'Service outage update',purpose:'Explain what is known, what is not yet known and what happens next',signals:'initial checks · no evidence · still investigating · next update',text:'Initial checks indicate that the outage was caused by a failure in a third-party authentication service. There is currently no evidence of data loss. Engineers are still investigating why the backup connection did not activate as expected. The next status update will be issued at 14:00.',fr:'Les premières vérifications indiquent une panne d’un service d’authentification tiers. Aucune perte de données n’est constatée pour l’instant. L’équipe cherche encore pourquoi la connexion de secours ne s’est pas activée.'}
];

const guided=[
 {level:'A2',focus:'Purpose',type:'mcq',title:'Find the purpose',passage:'Subject: Appointment confirmed\nYour appointment is confirmed for Tuesday 6 October at 2:15 p.m. Please report to reception ten minutes early.',prompt:'Why was this email sent?',options:['To cancel an appointment','To confirm an appointment and arrival instructions','To ask the reader to choose a date'],answer:1,hint:'Look at the subject line and the first sentence.',evidence:'“Your appointment is confirmed…” and “Please report to reception…”',why:'The message confirms the appointment and tells the reader when to arrive.',model:'Quick model: subject line → “confirmed”; first sentence → date/time; final sentence → arrival instruction.',modelPlus:'B2 habit: identify the document purpose before reading every detail. It narrows the possible answers immediately.',frTip:'Repérez d’abord l’objet du mail : “Appointment confirmed”.'},
 {level:'A2',focus:'Detail',type:'dropdown',title:'Scan for one exact detail',passage:'TODAY’S TRAINING\nThe customer-service workshop has moved from Room 4 to Room 7. The start time remains 10:30.',prompt:'The workshop will now take place in Room ___.',options:['4','7','10:30'],answer:'7',hint:'The word “moved” tells you to compare the old and new location.',evidence:'“moved from Room 4 to Room 7”',why:'Room 4 is the old location; Room 7 is the new one.',model:'Quick model: question asks WHERE → scan for room numbers → “from Room 4 to Room 7”.',modelPlus:'Do not let “10:30” distract you: it is a time, not a room.',frTip:'“from X to Y” = de X vers Y. La deuxième information est la nouvelle.'},
 {level:'A2',focus:'Detail',type:'text',title:'Type the key information',passage:'Please submit your travel receipts by Friday 9 October. Claims received after that date will be processed the following month.',prompt:'What is the deadline date? Type only the date.',answers:['9 October','October 9','9th October','October 9th'],hint:'Look for the phrase “by…”.',evidence:'“by Friday 9 October”',why:'“By” gives the latest acceptable date.',model:'Quick model: deadline question → scan for “by” → copy the date only.',modelPlus:'Notice that “the following month” is a consequence of missing the deadline, not the deadline itself.',frTip:'“by Friday” signifie au plus tard vendredi.'},
 {level:'A2',focus:'Sequence',type:'wordbank',title:'Rebuild the action',passage:'Please contact us before 4 p.m. today if Thursday is not suitable.',prompt:'Build the instruction from the message.',tokens:['Contact','us','before','4 p.m.','today','tomorrow','after'],answer:['Contact','us','before','4 p.m.','today'],hint:'Keep the same order as the instruction in the text.',evidence:'“Please contact us before 4 p.m. today…”',why:'The action and deadline must stay together: contact us before 4 p.m. today.',model:'Quick model: verb → object → deadline marker → time → day.',modelPlus:'Ignore plausible extra words such as “tomorrow” and “after” when they contradict the original text.',frTip:'Gardez l’ordre de la consigne originale.'},
 {level:'A2',focus:'Paraphrase',type:'reorder',title:'Recognise a paraphrase',passage:'The 17:40 service to Bristol has been cancelled. Passengers may use the 18:10 service instead.',prompt:'Reorder the words to express the same meaning.',tokens:['Passengers','can','take','the later train','instead'],answer:['Passengers','can','take','the later train','instead'],hint:'The new sentence should restate “may use the 18:10 service instead.”',evidence:'“Passengers may use the 18:10 service instead.”',why:'“Can take the later train instead” is a natural paraphrase of the original instruction.',model:'Quick model: may use → can take; 18:10 service → later train.',modelPlus:'CLOE reading often rewards synonym recognition rather than exact word matching.',frTip:'Cherchez l’idée équivalente, pas les mêmes mots.'},
 {level:'B1',focus:'Sequence',type:'paragraph',title:'Put an email in logical order',passage:'A professional update usually moves from context → change → action → close.',prompt:'Put these lines in the most logical order.',tokens:['Please let me know by 3 p.m. if this causes a problem.','Best regards,','Today’s client call has been moved to 4:30 p.m.','Hello,'],answer:['Hello,','Today’s client call has been moved to 4:30 p.m.','Please let me know by 3 p.m. if this causes a problem.','Best regards,'],hint:'Start and finish with the email conventions; put information before the requested action.',evidence:'A clear professional message normally introduces the change before asking for a response.',why:'Greeting → information → requested action → closing is the logical reading sequence.',model:'Quick model: greeting first, sign-off last; between them, explain before requesting.',modelPlus:'Text-order tasks test discourse logic as well as grammar.',frTip:'Dans un mail : salutation → information → action demandée → formule de fin.'},
 {level:'B1',focus:'Paraphrase',type:'mcq',title:'Avoid the keyword trap',passage:'The expenses platform will be unavailable between 6 p.m. and 8 p.m. tonight. Please save any unfinished claims before 5:45 p.m.',prompt:'Which statement is correct?',options:['All expense claims must be completed by 5:45 p.m.','Unfinished work should be saved before the maintenance begins.','The platform will reopen at 5:45 p.m.'],answer:1,hint:'Compare what “save” means with what “complete” means.',evidence:'“Please save any unfinished claims before 5:45 p.m.”',why:'The text asks users to save unfinished claims; it does not say they must finish them.',model:'Quick model: option A repeats “claims” and “5:45” but changes “save” into “complete”. Reject it.',modelPlus:'Distractors often recycle exact keywords while altering the relationship between them.',frTip:'Attention : enregistrer ≠ terminer.'},
 {level:'B1',focus:'Detail',type:'mcq',title:'Track the negative condition',passage:'Drafts that have already been saved will not be affected by tonight’s maintenance.',prompt:'What will NOT be affected?',options:['Saved drafts','The maintenance schedule','Unfinished claims that were never saved'],answer:0,hint:'The question contains NOT. Slow down and match it with the negative phrase in the text.',evidence:'“Drafts that have already been saved will not be affected…”',why:'Saved drafts are explicitly protected from the maintenance.',model:'Quick model: circle NOT mentally → find “will not be affected” → identify the noun before it.',modelPlus:'Negative questions are a common source of avoidable errors under time pressure.',frTip:'Repérez le NOT dans la question et le “will not be affected” dans le texte.'},
 {level:'B1',focus:'Reference',type:'dropdown',title:'Follow the pronoun',passage:'The team received the revised contract yesterday. It will be reviewed by Legal before being sent to the client.',prompt:'In the second sentence, “It” refers to the ___.',options:['team','revised contract','client'],answer:'revised contract',hint:'Ask: what singular thing was just mentioned and can logically be reviewed?',evidence:'“the revised contract… It will be reviewed…”',why:'The pronoun “It” refers back to the revised contract.',model:'Quick model: singular noun immediately before “It” + logical action “reviewed” = contract.',modelPlus:'Pronoun reference depends on both grammar and meaning.',frTip:'Le pronom “It” reprend le nom singulier logique juste avant.'},
 {level:'B1',focus:'Inference',type:'text',title:'Infer the next action',passage:'Your order will arrive on Thursday instead of Wednesday. Please contact us before 4 p.m. today if Thursday is not suitable.',prompt:'If Thursday is inconvenient, what should the customer do? Type the action in 2–5 words.',answers:['contact us','contact the company','call us','get in touch','get in touch with us'],hint:'Look at the conditional phrase beginning with “if”.',evidence:'“Please contact us… if Thursday is not suitable.”',why:'The message directly links the condition (Thursday is unsuitable) with the required action (contact us).',model:'Quick model: IF condition → action in the same sentence.',modelPlus:'For “next action” questions, verbs such as contact, confirm, submit, reply and report are strong anchors.',frTip:'Après “if Thursday is not suitable”, l’action demandée est “contact us”.'},
 {level:'B1',focus:'Sequence',type:'wordbank',title:'Read a procedure in order',passage:'If a delivery arrives damaged, first photograph the packaging before opening it. Then record the damage in the delivery portal within 24 hours.',prompt:'Build the first two actions in order.',tokens:['Photograph','the packaging','then','record','the damage','return','the goods'],answer:['Photograph','the packaging','then','record','the damage'],hint:'The text gives explicit sequence markers: “first” and “then”.',evidence:'“first photograph… Then record…”',why:'The procedure requires photographing before recording the damage.',model:'Quick model: first = photo; then = record. Ignore the later return stage.',modelPlus:'Sequence markers can let you answer without rereading the whole procedure.',frTip:'“first” = d’abord ; “then” = ensuite.'},
 {level:'B1+',focus:'Cause & effect',type:'reorder',title:'Connect cause and result',passage:'The public launch was delayed because final supplier checks were still incomplete.',prompt:'Reorder the paraphrase.',tokens:['The launch','was postponed','because','supplier checks','were not finished'],answer:['The launch','was postponed','because','supplier checks','were not finished'],hint:'“Delayed” and “postponed” are synonyms here.',evidence:'“delayed because final supplier checks were still incomplete”',why:'The reordered sentence preserves both the action and its cause.',model:'Quick model: delayed → postponed; incomplete → not finished.',modelPlus:'Paraphrase questions frequently replace both the verb and adjective with synonyms.',frTip:'delayed = postponed ; incomplete = not finished.'},
 {level:'B1+',focus:'Sequence',type:'paragraph',title:'Reconstruct a procedure',passage:'A return cannot be sent immediately when damaged goods arrive. The company first documents the problem and waits for supplier authorisation.',prompt:'Put the procedure in the correct order.',tokens:['Wait for the supplier’s return authorisation number.','Photograph the damaged packaging.','Record the damage in the portal within 24 hours.','Return the goods using the authorised process.'],answer:['Photograph the damaged packaging.','Record the damage in the portal within 24 hours.','Wait for the supplier’s return authorisation number.','Return the goods using the authorised process.'],hint:'Document first, report second, authorisation third, return last.',evidence:'The source procedure says photograph → record → do not return until authorisation.',why:'The order follows the operational sequence in the procedure.',model:'Quick model: evidence → report → permission → action.',modelPlus:'Procedural texts often contain a “do not…until…” condition that fixes the final order.',frTip:'La condition “ne pas renvoyer avant l’autorisation” place le retour à la fin.'},
 {level:'B1+',focus:'Tone',type:'mcq',title:'Read the writer’s tone',passage:'We understand that the delay has caused inconvenience and appreciate your patience while the technical team completes the final checks. We expect service to resume this afternoon.',prompt:'What is the tone of the message?',options:['Critical and impatient','Apologetic and reassuring','Informal and humorous'],answer:1,hint:'Look at “understand”, “appreciate your patience” and the positive update.',evidence:'“We understand… appreciate your patience… expect service to resume…”',why:'The writer acknowledges inconvenience and reassures the reader that work is progressing.',model:'Quick model: acknowledgement + thanks + positive expectation = apologetic/reassuring.',modelPlus:'Tone is inferred from clusters of language, not one isolated word.',frTip:'Le message reconnaît le problème et rassure le lecteur.'},
 {level:'B2',focus:'Inference',type:'mcq',title:'Infer the recommendation',passage:'The six-week pilot reduced average response time by 18%. Customer satisfaction remained stable and unresolved cases fell noticeably. The report recommends extending the pilot to two additional teams before making a company-wide decision.',prompt:'What can we infer about the report’s position?',options:['The pilot should be abandoned immediately.','The results are promising, but broader evidence is still wanted.','The company has already decided to use the system everywhere.'],answer:1,hint:'Focus on the contrast between positive results and “before making a company-wide decision”.',evidence:'Positive results + recommendation to extend to two teams before a company-wide decision.',why:'The report sees enough benefit to continue testing, but not enough evidence for immediate full rollout.',model:'Quick model: positive data = promising; extra pilot before full decision = caution.',modelPlus:'B2 inference often combines two parts of the text rather than relying on one sentence.',frTip:'Résultats positifs + test supplémentaire = encourageant mais pas encore décision finale.'},
 {level:'B2',focus:'Vocabulary in context',type:'dropdown',title:'Use context to decode a phrase',passage:'We would be prepared to accept a 3% increase provided that the new rate remains fixed for twelve months.',prompt:'In this sentence, “provided that” is closest in meaning to ___.',options:['because','on condition that','even though'],answer:'on condition that',hint:'Ask what must be true for the 3% increase to be accepted.',evidence:'Acceptance depends on the new rate remaining fixed for twelve months.',why:'“Provided that” introduces a condition.',model:'Quick model: accept X only if Y happens → “on condition that”.',modelPlus:'Use the logic of the sentence when a connector is unfamiliar.',frTip:'“provided that” = à condition que.'},
 {level:'B2',focus:'Detail',type:'text',title:'Extract a precise figure',passage:'The six-week pilot reduced average response time by 18% compared with the previous quarter.',prompt:'By what percentage did response time fall? Type the number and symbol.',answers:['18%','18 %'],hint:'Scan for the only percentage in the sentence.',evidence:'“reduced average response time by 18%”',why:'The figure is stated directly.',model:'Quick model: percentage question → scan for % → verify what it measures.',modelPlus:'Always confirm that the number belongs to the variable in the question; texts may contain several figures.',frTip:'Vérifiez que le chiffre correspond bien au “response time”.'},
 {level:'B2',focus:'Purpose',type:'mcq',title:'Identify the author’s main purpose',passage:'A recent internal survey found that employees value hybrid meetings for flexibility, but many remote participants report difficulty joining informal discussions. The findings suggest that meeting leaders should deliberately create space for remote colleagues to contribute.',prompt:'What is the main purpose of this text?',options:['To argue that hybrid meetings should be stopped','To present a finding and recommend more inclusive meeting practice','To explain how to install video-conferencing software'],answer:1,hint:'The first sentence gives a finding; the second explains what leaders should do.',evidence:'Survey finding + “The findings suggest that meeting leaders should…”',why:'The text reports an issue and turns it into a practical recommendation.',model:'Quick model: evidence sentence → implication sentence = finding + recommendation.',modelPlus:'For main-purpose questions, choose the option that covers the whole text—not just one detail.',frTip:'Le texte présente un constat puis une recommandation.'}
];

const ladderItems=[
 {level:'A2',skill:'Direct fact',text:'The office will close at 3 p.m. on Friday.',q:'When will the office close on Friday?',options:['At 3 p.m.','At 5 p.m.','It will stay open'],answer:0,why:'The answer is stated directly.'},
 {level:'B1',skill:'Paraphrase',text:'Please send the revised file no later than Tuesday.',q:'What is the deadline?',options:['Before Tuesday starts','Tuesday at the latest','After Tuesday'],answer:1,why:'“No later than Tuesday” = Tuesday at the latest.'},
 {level:'B1+',skill:'Inference',text:'Sales increased, but returns also rose sharply. The team will review product descriptions before increasing advertising spend.',q:'Why will the team review descriptions?',options:['They suspect unclear descriptions may be contributing to returns.','Advertising has already been cancelled.','Sales have fallen.'],answer:0,why:'The review follows the rise in returns, suggesting a possible link.'},
 {level:'B2',skill:'Nuance',text:'While the trial met its cost target, adoption varied considerably between teams, making a full rollout premature.',q:'What is the writer’s position?',options:['The trial failed completely.','Cost performance was positive, but wider implementation needs more evidence.','Every team adopted the trial successfully.'],answer:1,why:'“While” introduces a positive point; “premature” signals caution about full rollout.'}
];

const exam=[
 {focus:'Purpose',type:'mcq',time:40,passage:'Subject: Updated agenda\nTomorrow’s supplier meeting will begin with the quality review rather than the pricing discussion. The start time is unchanged. Please use the revised agenda attached to this email.',prompt:'Why was this email sent?',options:['To cancel the supplier meeting','To explain a change in the order of agenda items','To change the meeting start time'],answer:1,why:'The order of agenda items changed; the start time did not.',evidence:'“will begin with the quality review rather than the pricing discussion” + “start time is unchanged”'},
 {focus:'Detail',type:'dropdown',time:38,passage:'Visitors must sign in at reception and wear a temporary badge at all times. Badges should be returned before leaving the building.',prompt:'Visitors must return the badge ___.',options:['when they arrive','before they leave','the next day'],answer:'before they leave',why:'The notice explicitly says badges should be returned before leaving.',evidence:'“Badges should be returned before leaving the building.”'},
 {focus:'Paraphrase',type:'mcq',time:42,passage:'The revised quotation is valid until 30 November. Orders confirmed after that date may be subject to new pricing.',prompt:'Which statement means the same thing?',options:['The quoted price is guaranteed for orders confirmed by 30 November.','All orders after 30 November will be refused.','The price will definitely fall after 30 November.'],answer:0,why:'The quotation remains valid through 30 November; later orders may have different prices.',evidence:'“valid until 30 November” + “after that date may be subject to new pricing”'},
 {focus:'Sequence',type:'wordbank',time:45,passage:'Before restarting the machine, check that the safety guard is locked and confirm that no tools remain inside the work area.',prompt:'Build the correct sequence phrase.',tokens:['Check','the safety guard','then','confirm','the work area is clear','restart','immediately'],answer:['Check','the safety guard','then','confirm','the work area is clear'],why:'The safety checks come before restarting.',evidence:'“Before restarting… check… and confirm…”'},
 {focus:'Reference',type:'dropdown',time:38,passage:'The finance team sent the revised forecast to the directors on Monday. They requested two additional scenarios before approving it.',prompt:'“They” refers to the ___.',options:['finance team','directors','scenarios'],answer:'directors',why:'The directors received the forecast and then requested extra scenarios before approving it.',evidence:'“to the directors… They requested…”'},
 {focus:'Vocabulary in context',type:'mcq',time:40,passage:'The replacement parts are currently on hold pending final customs clearance.',prompt:'What does “pending” mean here?',options:['while waiting for','because they failed','immediately after'],answer:0,why:'The parts are paused while final customs clearance is awaited.',evidence:'“on hold pending final customs clearance”'},
 {focus:'Next action',type:'text',time:42,passage:'If you cannot attend the safety briefing on Monday, notify your supervisor by Friday so another session can be arranged.',prompt:'Who should you contact if you cannot attend? Type 1–3 words.',answers:['your supervisor','supervisor','the supervisor'],why:'The instruction explicitly says to notify your supervisor.',evidence:'“notify your supervisor by Friday”'},
 {focus:'Sequence',type:'paragraph',time:48,passage:'A customer return is processed in four stages: verify the order, inspect the returned item, issue the approved refund, then close the case.',prompt:'Put the stages in order.',tokens:['Close the case.','Inspect the returned item.','Verify the order.','Issue the approved refund.'],answer:['Verify the order.','Inspect the returned item.','Issue the approved refund.','Close the case.'],why:'The passage states the four stages in that order.',evidence:'“verify… inspect… issue… then close”'},
 {focus:'Inference',type:'mcq',time:45,passage:'The new booking tool has reduced manual data entry, but several teams still keep separate spreadsheets because some reporting features are missing. Management will review the missing functions before deciding whether to retire the old process.',prompt:'What can be inferred?',options:['The old process has already been removed.','The new tool is useful but does not yet meet every team’s needs.','The new tool has increased manual data entry.'],answer:1,why:'It reduced manual work, but teams still need spreadsheets because features are missing.',evidence:'“reduced manual data entry” + “still keep separate spreadsheets because some reporting features are missing”'},
 {focus:'Tone & purpose',type:'mcq',time:45,passage:'We appreciate the effort teams have made during the transition. The first month has identified several areas where instructions need to be clearer, and these will be updated before the next rollout phase. Please continue to report any recurring issues through the support form.',prompt:'What is the best description of the message?',options:['It criticises staff for causing the transition problems.','It acknowledges progress, identifies improvements and asks for continued feedback.','It announces that the rollout has been cancelled.'],answer:1,why:'The message thanks teams, notes improvements needed and asks them to keep reporting issues.',evidence:'“appreciate the effort” + “instructions need to be clearer” + “continue to report”'}
];

function persist(){
  localStorage.setItem(STORAGE,JSON.stringify({
    completed:[...state.completed],guidedDone:[...state.guidedDone],guidedFirst:state.guidedFirst,
    guidedTried:[...state.guidedTried],guidedMistakes:state.guidedMistakes,ladderDone:[...state.ladderDone],
    examScore:state.examScore,examDone:state.examDone,examAnswers:state.examAnswers
  }));
}
function restore(){
  try{
    const d=JSON.parse(localStorage.getItem(STORAGE)||'{}');
    (d.completed||[]).forEach(x=>state.completed.add(Number(x)));
    (d.guidedDone||[]).forEach(x=>state.guidedDone.add(Number(x)));
    state.guidedFirst=d.guidedFirst||0;(d.guidedTried||[]).forEach(x=>state.guidedTried.add(Number(x)));
    state.guidedMistakes=d.guidedMistakes||{};(d.ladderDone||[]).forEach(x=>state.ladderDone.add(Number(x)));
    state.examScore=Number.isFinite(d.examScore)?d.examScore:null;state.examDone=!!d.examDone;state.examAnswers=d.examAnswers||[];
  }catch(e){}
}
restore();

function renderReadingMap(){
  $('#readingMap').innerHTML=readingMap.map(([k,t,p])=>`<article><span>${esc(k)}</span><h3>${esc(t)}</h3><p>${esc(p)}</p></article>`).join('');
}
function populateFilters(){
  const types=['All',...new Set(texts.map(x=>x.type))];
  $('#typeFilter').innerHTML=types.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
}
function filteredTexts(){
  const level=$('#levelFilter').value,type=$('#typeFilter').value,q=norm($('#textSearch').value);
  return texts.filter(x=>(level==='All'||x.level===level)&&(type==='All'||x.type===type)&&(!q||norm([x.title,x.purpose,x.signals,x.text,x.type].join(' ')).includes(q)));
}
function renderTexts(items=filteredTexts()){
  $('#textCount').textContent=items.length;
  $('#textLibrary').innerHTML=items.map((x,i)=>`<article class="reading-card">
    <button class="reading-summary" type="button" aria-expanded="false">
      <span class="reading-level">${esc(x.level)}</span><span><strong>${esc(x.title)}</strong><small>${esc(x.type)} · ${esc(x.purpose)}</small></span><span class="reading-arrow">＋</span>
    </button>
    <div class="reading-detail hidden">
      <div class="text-purpose"><span>${esc(x.type)}</span><span>${esc(x.purpose)}</span></div>
      <div class="sample-document"><div class="doc-head">Professional text model</div><p>${esc(x.text)}</p></div>
      <div class="signal-box"><b>SCAN signals:</b> ${esc(x.signals)}</div>
      <div class="fr-help"><b>FR support:</b> ${esc(x.fr)}</div>
      <div class="text-actions"><button class="speak-btn" type="button" data-speak="${esc(x.text)}">🔊 Read text aloud</button></div>
    </div>
  </article>`).join('') || '<p>No text matches these filters.</p>';
  $$('.reading-summary').forEach(btn=>btn.addEventListener('click',()=>{const d=btn.nextElementSibling;const open=!d.classList.contains('hidden');d.classList.toggle('hidden',open);btn.setAttribute('aria-expanded',String(!open));$('.reading-arrow',btn).textContent=open?'＋':'−';}));
  $$('.speak-btn').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.speak)));
}
function speak(text){
  if(!('speechSynthesis' in window)) return alert('Audio is not available in this browser.');
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=$('#accentFilter')?.value||'en-GB';u.rate=.88;speechSynthesis.speak(u);
}
function setFrench(on){
  state.fr=on;document.body.classList.toggle('fr-mode',on);document.body.classList.toggle('fr-hidden',!on);
  $('#toggleFrench').setAttribute('aria-pressed',String(on));$('#toggleFrench').textContent=on?'FR Coach ✓':'FR Coach';
}
function setMode(solo){
  state.solo=solo;document.body.classList.toggle('solo-mode',solo);$('#guidedMode').classList.toggle('active',!solo);$('#soloMode').classList.toggle('active',solo);
}
function typeLabel(type){return ({mcq:'SINGLE-ANSWER MULTIPLE CHOICE',dropdown:'DROP-DOWN GAP',text:'TYPED GAP',reorder:'SCRAMBLED SENTENCE',wordbank:'WORD BANK',paragraph:'SCRAMBLED TEXT'})[type]||'READING PRACTICE';}
function renderPassage(q,where,examMode=false){
  if(!q.passage)return;
  const wrap=document.createElement('div');wrap.className=examMode?'exam-passage':'reading-passage';
  wrap.innerHTML=`${examMode?'':'<span class="doc-label">Professional text</span>'}<p>${esc(q.passage)}</p>`;
  where.appendChild(wrap);
  if(!examMode){
    const b=document.createElement('button');b.type='button';b.className='button ghost small model-audio';b.textContent='🔊 Read text aloud';b.addEventListener('click',()=>speak(q.passage));where.appendChild(b);
  }
}
function renderInteractive(q,where,mode='guided'){
  where.innerHTML='';renderPassage(q,where,mode==='exam');
  const qbox=document.createElement('div');qbox.className='question-box';
  qbox.innerHTML=`<span class="question-focus">${esc(q.focus||'Reading')}</span><div>${esc(q.prompt)}</div>`;where.appendChild(qbox);
  const inputArea=document.createElement('div');inputArea.className='input-area';where.appendChild(inputArea);
  if(q.type==='mcq') inputArea.innerHTML=`<div class="answer-options">${q.options.map((o,i)=>`<button class="answer-option" data-choice="${i}" type="button">${esc(o)}</button>`).join('')}</div>`;
  if(q.type==='dropdown') inputArea.innerHTML=`<div class="dropdown-line"><select class="select-answer"><option value="">Choose…</option>${q.options.map(o=>`<option>${esc(o)}</option>`).join('')}</select></div>`;
  if(q.type==='text') inputArea.innerHTML=`<input class="typed-answer" type="text" autocomplete="off" placeholder="Type your answer" />`;
  if(q.type==='reorder'||q.type==='wordbank') inputArea.innerHTML=`<div class="sequence-area" aria-label="Your answer"></div><div class="word-bank">${shuffle(q.tokens).map((t,i)=>`<button class="word-chip" data-token="${esc(t)}" data-id="${i}" type="button">${esc(t)}</button>`).join('')}</div><div class="micro-tip">Click words to build the answer. Click a word in your answer to remove it.</div>`;
  if(q.type==='paragraph') inputArea.innerHTML=`<div class="sequence-area text-order-lines" aria-label="Your ordered text"></div><div class="word-bank text-order-lines">${shuffle(q.tokens).map((t,i)=>`<button class="order-chip" data-token="${esc(t)}" data-id="${i}" type="button">${esc(t)}</button>`).join('')}</div><div class="micro-tip">Click each line in the order you want it to appear.</div>`;
  where.dataset.seq=JSON.stringify([]);delete where.dataset.choice;
  $$('.answer-option',where).forEach(b=>b.addEventListener('click',()=>{$$('.answer-option',where).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');where.dataset.choice=b.dataset.choice;if(mode==='guided'&&!state.solo)setTimeout(validateGuided,120);}));
  const sel=$('.select-answer',where);if(sel)sel.addEventListener('change',()=>{if(mode==='guided'&&!state.solo&&sel.value)setTimeout(validateGuided,120);});
  const input=$('.typed-answer',where);if(input)input.addEventListener('keydown',e=>{if(e.key==='Enter'&&mode==='guided')validateGuided();});
  $$('.word-chip,.order-chip',where).forEach(b=>b.addEventListener('click',()=>{if(b.classList.contains('used'))return;let seq=JSON.parse(where.dataset.seq);seq.push({id:b.dataset.id,token:b.dataset.token});where.dataset.seq=JSON.stringify(seq);b.classList.add('used');renderSequence(where,q,mode);}));
}
function renderSequence(where,q,mode){
  const area=$('.sequence-area',where),seq=JSON.parse(where.dataset.seq);area.innerHTML=seq.map((x,i)=>`<button class="word-chip" data-seq-index="${i}" type="button">${esc(x.token)}</button>`).join('');
  $$('[data-seq-index]',area).forEach(b=>b.addEventListener('click',()=>{let s=JSON.parse(where.dataset.seq);const [removed]=s.splice(Number(b.dataset.seqIndex),1);where.dataset.seq=JSON.stringify(s);const source=$(`[data-id="${CSS.escape(removed.id)}"]`,where);if(source)source.classList.remove('used');renderSequence(where,q,mode);}));
  if(mode==='guided'&&!state.solo&&seq.length===q.answer.length)setTimeout(validateGuided,120);
}
function readAnswer(q,where){
  if(q.type==='mcq')return where.dataset.choice===undefined?null:Number(where.dataset.choice);
  if(q.type==='dropdown')return $('.select-answer',where)?.value||'';
  if(q.type==='text')return $('.typed-answer',where)?.value||'';
  return JSON.parse(where.dataset.seq||'[]').map(x=>x.token);
}
function isCorrect(q,a){
  if(q.type==='mcq')return a===q.answer;
  if(q.type==='dropdown')return norm(a)===norm(q.answer);
  if(q.type==='text')return (q.answers||[]).some(x=>norm(a)===norm(x));
  return Array.isArray(a)&&a.length===q.answer.length&&a.every((x,i)=>norm(x)===norm(q.answer[i]));
}
function answerDisplay(q){
  if(q.type==='mcq')return q.options[q.answer];if(q.type==='dropdown')return q.answer;if(q.type==='text')return q.answers[0];return q.answer.join(q.type==='paragraph'?' → ':' ');
}
function hasAnswer(q,a){return q.type==='mcq'?a!==null:q.type==='text'||q.type==='dropdown'?!!String(a).trim():Array.isArray(a)&&a.length>0;}
function lockInputs(where){$$('button.answer-option,button.word-chip,button.order-chip,select,input',where).forEach(x=>x.disabled=true);}

function renderGuided(){
  const i=state.currentGuided,q=guided[i];
  $('#guidedStage').innerHTML=`<div class="exercise-head"><div class="exercise-meta"><span>GUIDED READING · ${esc(q.level)} · ${esc(q.focus)}</span><b>${i+1} of ${guided.length}</b></div><div class="guided-dots">${guided.map((_,j)=>`<i class="${state.guidedDone.has(j)?'done':j===i?'current':''}"></i>`).join('')}</div></div>
  <div class="exercise-main"><span class="exercise-type">${typeLabel(q.type)}</span><h3>${esc(q.title)}</h3><p class="instruction">Use S.C.A.N. and prove your answer from the text.</p><div id="guidedQuestion"></div><div id="guidedFeedback"></div>
  <div class="exercise-actions"><button class="button ghost small hint-action" id="showHint" type="button">Hint</button><button class="button ghost small evidence-action" id="showEvidence" type="button">Find evidence</button><button class="button ghost small model-action" id="showModel" type="button">Model thinking</button><button class="button ghost small" id="checkAnswer" type="button">Check answer</button>${i>0?'<button class="button ghost small" id="prevGuided" type="button">← Previous</button>':''}<button class="button primary small next-btn" id="nextGuided" type="button">${i===guided.length-1?'Finish lab':'Next →'}</button></div></div>`;
  renderInteractive(q,$('#guidedQuestion'),'guided');
  $('#showHint').addEventListener('click',()=>showSupport('hint',q));
  $('#showEvidence').addEventListener('click',()=>showSupport('evidence',q));
  $('#showModel').addEventListener('click',()=>showSupport('model',q));
  $('#checkAnswer').addEventListener('click',validateGuided);
  $('#nextGuided').addEventListener('click',()=>{if(i<guided.length-1){state.currentGuided++;renderGuided();}else{state.completed.add(4);persist();updateProgress();document.querySelector('#ladder').scrollIntoView({behavior:'smooth',block:'center'});}});
  $('#prevGuided')?.addEventListener('click',()=>{state.currentGuided--;renderGuided();});
}
function showSupport(kind,q){
  if(state.solo)return;
  const f=$('#guidedFeedback');
  if(kind==='hint')f.innerHTML=`<div class="hint-box"><b>Hint</b><br>${esc(q.hint)}<div class="fr-inline">FR: ${esc(q.frTip||'')}</div></div>`;
  if(kind==='evidence')f.innerHTML=`<div class="evidence-note"><b>Evidence to look for:</b> ${esc(q.evidence)}</div>`;
  if(kind==='model')f.innerHTML=`<div class="model-box"><b>Model route</b><br>${esc(q.model)}<hr><b>Stronger-reader habit</b><br>${esc(q.modelPlus)}</div>`;
}
function validateGuided(){
  const i=state.currentGuided,q=guided[i],where=$('#guidedQuestion'),a=readAnswer(q,where);if(!hasAnswer(q,a))return;
  const ok=isCorrect(q,a),first=!state.guidedTried.has(i);state.guidedTried.add(i);
  if(first&&ok)state.guidedFirst++;
  if(first&&!ok)state.guidedMistakes[q.focus]=(state.guidedMistakes[q.focus]||0)+1;
  if(ok)state.guidedDone.add(i);
  const f=$('#guidedFeedback');
  f.innerHTML=`<div class="feedback-box ${ok?'good':'bad'}"><b>${ok?'✓ Correct':'✗ Not yet'}</b><br>${esc(q.why)}${ok?`<br><b>Evidence:</b> ${esc(q.evidence)}`:`<br><b>Try again.</b> ${esc(q.hint)}`}<div class="fr-inline">FR Coach: ${esc(q.frTip||'')}</div></div>`;
  if(q.type==='mcq'){$$('.answer-option',where).forEach((b,j)=>{b.classList.toggle('correct',j===q.answer);if(b.classList.contains('selected')&&j!==q.answer)b.classList.add('wrong');});}
  if(ok){lockInputs(where);persist();updateResults();updateProgress();}
}

function renderLadder(){
  $('#ladder').innerHTML=ladderItems.map((x,i)=>`<article class="ladder-card"><div class="ladder-level"><b>${esc(x.level)}</b><span>${esc(x.skill)}</span></div><div class="reading-ladder-text"><b>Text:</b> ${esc(x.text)}</div><h3>${esc(x.q)}</h3><div class="ladder-options">${x.options.map((o,j)=>`<button type="button" data-ladder="${i}" data-choice="${j}">${esc(o)}</button>`).join('')}</div><div class="ladder-explain" id="ladderExplain${i}"></div></article>`).join('');
  $$('[data-ladder]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.ladder),j=Number(b.dataset.choice),x=ladderItems[i],wrap=b.closest('.ladder-card');$$('button',wrap).forEach((btn,k)=>{btn.disabled=true;btn.classList.toggle('right',k===x.answer);if(k===j&&k!==x.answer)btn.classList.add('wrong');});$(`#ladderExplain${i}`).textContent=x.why;state.ladderDone.add(i);persist();updateProgress();}));
}

function markExamDot(i,status='active'){
  $$('#examDots i').forEach((d,j)=>{d.classList.remove('active');if(j===i)d.classList.add(status);});
}
function setupExamDots(){$('#examDots').innerHTML=exam.map(()=>'<i></i>').join('');}
function formatTime(s){s=Math.max(0,Math.ceil(s));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
function startExam(){
  clearInterval(state.examTimer);clearInterval(state.totalTimer);state.examIndex=0;state.examAnswers=[];state.examScore=null;state.examDone=false;state.totalLeft=480;state.transitioning=false;
  state.totalTimer=setInterval(()=>{state.totalLeft--;$('#examTotalTime').textContent=formatTime(state.totalLeft);if(state.totalLeft<=0){clearInterval(state.totalTimer);finishExam(true);}},1000);
  renderExamQuestion();
}
function renderExamQuestion(){
  clearInterval(state.examTimer);state.transitioning=false;const i=state.examIndex,q=exam[i];if(!q)return finishExam();
  $('#examCounter').textContent=`Question ${i+1} / ${exam.length}`;$('#examQuestionLabel').textContent=`READING · ${q.focus.toUpperCase()}`;markExamDot(i,'active');
  state.questionLeft=q.time;$('#examQuestionTime').textContent=`${state.questionLeft}s`;updateTimerBar(q.time);
  $('#examContent').innerHTML=`<div class="exam-question"><small>${typeLabel(q.type)}</small><h3>Read, scan, prove.</h3><div id="examQuestion"></div><div class="exercise-actions"><button class="button primary" id="validateExam" type="button">VALIDATE</button></div><div id="examTransition"></div></div>`;
  renderInteractive(q,$('#examQuestion'),'exam');$('#validateExam').addEventListener('click',submitExam);
  state.examTimer=setInterval(()=>{state.questionLeft--;$('#examQuestionTime').textContent=`${Math.max(0,state.questionLeft)}s`;updateTimerBar(q.time);if(state.questionLeft<=0){clearInterval(state.examTimer);submitExam(true);}},1000);
}
function updateTimerBar(max){
  const pct=Math.max(0,state.questionLeft/max*100),bar=$('#examTimerBar');bar.style.width=`${pct}%`;bar.style.background=pct>50?'var(--green)':pct>25?'var(--yellow)':'var(--red)';
}
function submitExam(timeout=false){
  if(state.transitioning)return;state.transitioning=true;clearInterval(state.examTimer);const i=state.examIndex,q=exam[i],where=$('#examQuestion'),a=timeout?null:readAnswer(q,where);
  const ok=!timeout&&hasAnswer(q,a)&&isCorrect(q,a);state.examAnswers[i]={ok,answer:a,focus:q.focus};
  lockInputs(where);$('#validateExam').disabled=true;markExamDot(i,'answered');
  let c=3;$('#examTransition').innerHTML=`<div class="model-box">${timeout?'Time is up.':'Answer recorded.'} Next question in <b id="count3">${c}</b>…</div>`;
  const t=setInterval(()=>{c--;const n=$('#count3');if(n)n.textContent=c;if(c<=0){clearInterval(t);state.examIndex++;if(state.examIndex>=exam.length)finishExam();else renderExamQuestion();}},1000);
}
function finishExam(totalTimeout=false){
  if(state.examDone)return;clearInterval(state.examTimer);clearInterval(state.totalTimer);state.examDone=true;
  if(totalTimeout){for(let i=state.examAnswers.length;i<exam.length;i++)state.examAnswers[i]={ok:false,answer:null,focus:exam[i].focus};}
  state.examScore=state.examAnswers.filter(x=>x&&x.ok).length;state.completed.add(5);persist();updateProgress();updateResults();
  $('#examCounter').textContent='Complete';$('#examQuestionTime').textContent='--';$('#examTimerBar').style.width='100%';$('#examTimerBar').style.background='var(--navy)';
  $('#examContent').innerHTML=`<div class="exam-start-card"><div class="ready-ring">${state.examScore}</div><h3>${state.examScore} / 10</h3><p>${scoreMessage(state.examScore)}</p><div class="result-review">${exam.map((q,i)=>{const r=state.examAnswers[i]||{ok:false,answer:null};return `<details><summary><span class="${r.ok?'ok':'no'}">${r.ok?'✓':'✗'}</span> Q${i+1} · ${esc(q.focus)}</summary><p><b>Correct answer:</b> ${esc(answerDisplay(q))}<br><b>Why:</b> ${esc(q.why)}<br><b>Evidence:</b> ${esc(q.evidence)}</p></details>`;}).join('')}</div><button class="button ghost" id="retryExam" type="button">Retry mini-test</button></div>`;
  $('#retryExam').addEventListener('click',startExam);document.querySelector('#results').scrollIntoView({behavior:'smooth',block:'start'});
}
function scoreMessage(s){if(s>=9)return 'Excellent evidence control. Keep the same discipline when the texts become longer.';if(s>=7)return 'Strong result. Review the few question types that caused hesitation.';if(s>=5)return 'Good foundation. Slow down on distractors and prove each answer from the text.';return 'Return to S.C.A.N. and the guided lab before repeating the timed test.';}

function updateProgress(){
  const major=[1,2,3,4,5].filter(x=>state.completed.has(x)).length;const guidedPart=state.guidedDone.size/guided.length*20;const base=[1,2,3].filter(x=>state.completed.has(x)).length*15;const lab=state.completed.has(4)?20:guidedPart;const examP=state.completed.has(5)?15:0;const pct=Math.min(100,Math.round(base+lab+examP+state.ladderDone.size/ladderItems.length*20));
  $('#progressLabel').textContent=`${pct}% complete`;$('#headerProgress').style.width=`${pct}%`;$('#pathScore').textContent=`${pct}%`;
  $$('.section-done').forEach(b=>b.classList.toggle('done',state.completed.has(Number(b.dataset.complete))));
}
function updateResults(){
  $('#guidedScore').textContent=`${state.guidedFirst} / ${guided.length}`;$('#examScore').textContent=state.examScore===null?'— / 10':`${state.examScore} / 10`;
  const counts={...state.guidedMistakes};
  if(state.examDone)state.examAnswers.forEach((r,i)=>{if(r&&!r.ok){const f=exam[i].focus;counts[f]=(counts[f]||0)+1;}});
  const ranked=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  if(!ranked.length){$('#priorityTitle').textContent=(state.guidedDone.size||state.examDone)?'Strong balance so far. Keep practising timed evidence-finding.':'Complete the guided lab and mini-test to unlock priorities.';$('#priorityPills').innerHTML=state.guidedDone.size?'<span>Timing discipline</span><span>Longer B2 texts</span>':'';return;}
  $('#priorityTitle').textContent='Focus first on the reading skills that caused the most errors.';$('#priorityPills').innerHTML=ranked.slice(0,5).map(([k,v])=>`<span>${esc(k)} · ${v} ${v===1?'error':'errors'}</span>`).join('');
}
function toggleComplete(n){state.completed.add(n);persist();updateProgress();}
function download(filename,text,type='text/plain'){const b=new Blob([text],{type});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},100);}
function makeReport(){
  const priorities=[...Object.entries(state.guidedMistakes).sort((a,b)=>b[1]-a[1]).slice(0,5).map(x=>x[0])];
  return `CLOE SUCCESS PATH · LESSON 04 · READING COMPREHENSION\n\nTraining resource — not an official CLOE score.\n\nGuided first-attempt score: ${state.guidedFirst}/${guided.length}\nTimed mini-test: ${state.examScore===null?'Not completed':state.examScore+'/10'}\nGuided activities completed: ${state.guidedDone.size}/${guided.length}\nAdaptive ladder completed: ${state.ladderDone.size}/${ladderItems.length}\n\nRevision priorities: ${priorities.length?priorities.join(', '):'Continue timed evidence practice.'}\n\nCore method: S.C.A.N. = Situation · Command · Anchors · Nail the evidence.\n`;
}
function resetAll(){
  if(!confirm('Reset all Lesson 4 progress?'))return;localStorage.removeItem(STORAGE);location.reload();
}

function wire(){
  $$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>document.querySelector(b.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));
  $$('.section-done').forEach(b=>b.addEventListener('click',()=>toggleComplete(Number(b.dataset.complete))));
  $('#toggleFrench').addEventListener('click',()=>setFrench(!state.fr));
  $('#guidedMode').addEventListener('click',()=>setMode(false));$('#soloMode').addEventListener('click',()=>setMode(true));
  ['levelFilter','typeFilter','textSearch'].forEach(id=>$('#'+id).addEventListener(id==='textSearch'?'input':'change',()=>renderTexts()));
  $('#clearFilters').addEventListener('click',()=>{$('#levelFilter').value='All';$('#typeFilter').value='All';$('#textSearch').value='';renderTexts();});
  $('#openCoach').addEventListener('click',()=>$('#coachModal').classList.remove('hidden'));$('#closeCoach').addEventListener('click',()=>$('#coachModal').classList.add('hidden'));$('#coachModal').addEventListener('click',e=>{if(e.target.id==='coachModal')$('#coachModal').classList.add('hidden');});
  $('#startExam').addEventListener('click',startExam);$('#downloadReport').addEventListener('click',()=>download('CLOE_Lesson_04_Reading_Report.txt',makeReport()));
  $('#exportProgress').addEventListener('click',()=>download('CLOE_Lesson_04_Reading_Progress.json',JSON.stringify({lesson:4,title:'Reading Comprehension',guidedFirst:state.guidedFirst,guidedCompleted:state.guidedDone.size,examScore:state.examScore,completedSections:[...state.completed],revision:state.guidedMistakes},null,2),'application/json'));
  $('#resetAll').addEventListener('click',resetAll);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#coachModal').classList.add('hidden');});
}
function tickClock(){const s=Math.floor((Date.now()-startTime)/1000);$('#lessonClock').textContent=formatTime(s);}

renderReadingMap();populateFilters();renderTexts();renderGuided();renderLadder();setupExamDots();wire();updateProgress();updateResults();setFrench(false);setMode(false);tickClock();setInterval(tickClock,1000);
