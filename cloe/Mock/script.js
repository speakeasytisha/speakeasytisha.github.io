(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const page = document.body.dataset.page;
  const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
  const shuffle = arr => [...arr].sort(() => Math.random() - .5);
  const esc = (s="") => String(s).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));

  function speak(text, lang="en-GB") {
    if (!window.speechSynthesis) return false;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const voices = speechSynthesis.getVoices();
    const exact = voices.find(v => v.lang === lang) || voices.find(v => v.lang?.startsWith(lang.slice(0,2)));
    if (exact) u.voice = exact;
    u.rate = .94;
    speechSynthesis.speak(u);
    return true;
  }

  const vocabRows = `
Meetings & teamwork|agenda|ordre du jour|the list of subjects to discuss in a meeting|Could you add this point to tomorrow's agenda?
Meetings & teamwork|minutes|compte rendu|the written record of what was discussed and decided|I'll send the meeting minutes this afternoon.
Meetings & teamwork|action item|action à réaliser|a task agreed during a meeting|This action item is due by Friday.
Meetings & teamwork|chair a meeting|présider une réunion|to lead and manage a meeting|Could you chair the meeting while I am away?
Meetings & teamwork|reach a consensus|parvenir à un consensus|to achieve general agreement|We need to reach a consensus before the launch.
Meetings & teamwork|raise a point|soulever un point|to introduce an issue for discussion|I'd like to raise a point about the deadline.
Meetings & teamwork|follow up|faire un suivi|to take further action after an exchange|I'll follow up with the supplier tomorrow.
Meetings & teamwork|input|contribution / avis|ideas or information contributed to a discussion|Thank you for your input on the proposal.
Emails & correspondence|attachment|pièce jointe|a file sent with an email|Please find the signed contract in the attachment.
Emails & correspondence|subject line|objet du mail|the title line of an email|Use a clear subject line for urgent requests.
Emails & correspondence|forward|transférer|to send a received message to another person|Could you forward the email to the finance team?
Emails & correspondence|acknowledge receipt|accuser réception|to confirm that something has been received|Please acknowledge receipt of this message.
Emails & correspondence|regarding|concernant|about a particular subject|I'm writing regarding your recent order.
Emails & correspondence|clarify|clarifier|to make information easier to understand|Could you clarify what you mean by “final version”?
Emails & correspondence|inquiry|demande de renseignements|a request for information|We received an inquiry from a new customer.
Emails & correspondence|on behalf of|au nom de|representing another person or organisation|I'm writing on behalf of the project team.
Scheduling & time|deadline|date limite|the latest time by which work must be completed|We cannot miss the client deadline.
Scheduling & time|postpone|reporter|to arrange for something to happen later|We need to postpone the meeting until Thursday.
Scheduling & time|bring forward|avancer|to move an event to an earlier time|Can we bring the appointment forward to 9 a.m.?
Scheduling & time|availability|disponibilité|the times when someone is free|Please send me your availability for next week.
Scheduling & time|time slot|créneau horaire|a particular period available for an activity|The 2 p.m. time slot is still available.
Scheduling & time|on schedule|dans les temps|progressing according to the planned timing|The project is currently on schedule.
Scheduling & time|ahead of schedule|en avance|earlier than planned|The team finished the installation ahead of schedule.
Scheduling & time|delay|retard|a period of waiting or lateness|We apologise for the delivery delay.
Telephone & video calls|put through|mettre en relation|to connect a caller to another person|I'll put you through to customer service.
Telephone & video calls|hold the line|rester en ligne|to wait on the telephone|Could you hold the line for a moment?
Telephone & video calls|cut off|être coupé|to lose a phone or online connection|We were cut off during the call.
Telephone & video calls|mute|mettre en sourdine|to switch off a microphone temporarily|Please mute your microphone when you are not speaking.
Telephone & video calls|connection issue|problème de connexion|a technical problem affecting a call|We had a connection issue during the presentation.
Telephone & video calls|speak up|parler plus fort|to speak more loudly|Could you speak up a little, please?
Telephone & video calls|take a message|prendre un message|to note information for an absent person|Can I take a message for her?
Telephone & video calls|call back|rappeler|to return a phone call|I'll call you back after the meeting.
Projects & deadlines|milestone|jalon|an important stage in a project|The prototype is our next major milestone.
Projects & deadlines|scope|périmètre|the range of work included in a project|This request is outside the project scope.
Projects & deadlines|deliverable|livrable|a result or item that must be delivered|The final report is the main deliverable.
Projects & deadlines|allocate resources|allouer des ressources|to assign people, money or equipment|We need to allocate more resources to testing.
Projects & deadlines|bottleneck|goulot d'étranglement|a point that slows down a process|Approval has become a bottleneck.
Projects & deadlines|on track|sur la bonne voie|progressing as expected|We are on track to finish next month.
Projects & deadlines|roll out|déployer|to introduce a product or system gradually|The new software will roll out in October.
Projects & deadlines|contingency plan|plan de secours|a backup plan for possible problems|We need a contingency plan in case the supplier fails.
Customer service|complaint|réclamation|an expression of dissatisfaction|We received a complaint about the waiting time.
Customer service|refund|remboursement|money returned to a customer|The customer requested a full refund.
Customer service|replacement|remplacement|a new item provided instead of a faulty one|We can send a replacement within 48 hours.
Customer service|resolve an issue|résoudre un problème|to find a satisfactory solution|We aim to resolve the issue today.
Customer service|escalate|faire remonter|to pass a problem to a higher level of authority|I will escalate the case to my manager.
Customer service|satisfaction|satisfaction|the degree to which a customer is pleased|Customer satisfaction has improved this quarter.
Customer service|warranty|garantie|a promise to repair or replace a product|The device is still under warranty.
Customer service|handle a request|traiter une demande|to manage and respond to a customer's need|We can handle your request immediately.
Sales & commercial|quote|devis|a document stating the proposed price|I'll send you a quote by the end of the day.
Sales & commercial|order|commande|a request to buy goods or services|Your order will be dispatched tomorrow.
Sales & commercial|discount|remise|a reduction in price|We can offer a 10% discount for large orders.
Sales & commercial|negotiate|négocier|to discuss terms in order to reach agreement|We still need to negotiate the final price.
Sales & commercial|terms and conditions|conditions générales|the rules and conditions of an agreement|Please read the terms and conditions carefully.
Sales & commercial|prospect|prospect|a potential customer|The sales team contacted three new prospects.
Sales & commercial|turnover|chiffre d'affaires|the total revenue generated by a business|Our turnover increased by 8% last year.
Sales & commercial|place an order|passer une commande|to officially request goods or services|You can place an order through our website.
HR & recruitment|applicant|candidat|a person who applies for a job|We interviewed six applicants for the role.
HR & recruitment|shortlist|présélection|a small group selected from a larger group|Three candidates were added to the shortlist.
HR & recruitment|onboarding|intégration|the process of helping a new employee start a job|The onboarding programme lasts two weeks.
HR & recruitment|probation period|période d'essai|an initial trial period in a job|Her probation period ends next month.
HR & recruitment|performance review|entretien d'évaluation|a formal discussion about an employee's performance|My annual performance review is on Friday.
HR & recruitment|skills gap|manque de compétences|a difference between required and available skills|Training can help close the skills gap.
HR & recruitment|vacancy|poste vacant|an available job|We have a vacancy in the logistics department.
HR & recruitment|salary expectations|prétentions salariales|the amount of pay a candidate hopes to receive|What are your salary expectations?
Travel & accommodation|booking|réservation|an arrangement to reserve travel or accommodation|I need to change my hotel booking.
Travel & accommodation|check-in|enregistrement|the process of registering for a flight or hotel|Online check-in opens 24 hours before departure.
Travel & accommodation|boarding pass|carte d'embarquement|a document allowing a passenger to board a plane|Please have your boarding pass ready.
Travel & accommodation|connecting flight|vol avec correspondance|a second flight needed to reach a destination|Our connecting flight leaves at 6 p.m.
Travel & accommodation|accommodation|hébergement|a place to stay|The conference fee includes accommodation.
Travel & accommodation|receipt|reçu|proof that payment was made|Keep the receipt for your expense claim.
Travel & accommodation|business trip|déplacement professionnel|travel made for work|I'm going on a business trip to Madrid.
Travel & accommodation|itinerary|itinéraire / programme|a detailed travel plan|The updated itinerary is attached.
Transport & logistics|shipment|expédition|goods sent from one place to another|The shipment left the warehouse yesterday.
Transport & logistics|warehouse|entrepôt|a building used to store goods|The products are stored in our central warehouse.
Transport & logistics|dispatch|expédier|to send goods to a destination|The order will be dispatched this afternoon.
Transport & logistics|customs|douane|the authority controlling goods entering a country|The shipment is waiting at customs.
Transport & logistics|lead time|délai d'approvisionnement|the time between order and delivery|The standard lead time is five working days.
Transport & logistics|inventory|stock / inventaire|the goods a company has available|We need to update the inventory records.
Transport & logistics|freight|fret|goods transported in bulk|Air freight is faster but more expensive.
Transport & logistics|track a parcel|suivre un colis|to monitor a package's location|You can track the parcel online.
Finance & numbers|invoice|facture|a document requesting payment|The invoice is payable within 30 days.
Finance & numbers|budget|budget|a plan for income and spending|The project is within budget.
Finance & numbers|expense|dépense|money spent for a business purpose|Travel expenses must be approved.
Finance & numbers|profit|bénéfice|money remaining after costs are paid|The company reported a higher profit this year.
Finance & numbers|loss|perte|money lost when costs exceed income|The division made a small loss last quarter.
Finance & numbers|forecast|prévision|an estimate of future results|The sales forecast is optimistic.
Finance & numbers|outstanding payment|paiement en attente|money that is due but not yet paid|We still have two outstanding payments.
Finance & numbers|break even|atteindre le seuil de rentabilité|to reach a point where income equals costs|The new branch should break even next year.
IT & digital|log in|se connecter|to access a system using credentials|I cannot log in to the portal.
IT & digital|credentials|identifiants|information used to prove identity online|Never share your login credentials.
IT & digital|upload|téléverser|to send a file from a device to a system|Please upload the signed document.
IT & digital|backup|sauvegarde|a copy of data kept for recovery|We run a full backup every night.
IT & digital|downtime|indisponibilité|a period when a system is unavailable|The update may cause ten minutes of downtime.
IT & digital|bug|bogue|an error in software|The developer fixed the login bug.
IT & digital|access rights|droits d'accès|permissions controlling what a user can do|Your access rights need to be updated.
IT & digital|data breach|violation de données|unauthorised access to protected information|The company has procedures for a data breach.
Health & safety|hazard|danger|something that can cause harm|Report any safety hazard immediately.
Health & safety|protective equipment|équipement de protection|clothing or equipment used to reduce risk|Protective equipment is mandatory in this area.
Health & safety|incident|incident|an event that caused or could cause harm|The incident was reported to the safety officer.
Health & safety|procedure|procédure|an official way of doing something|Follow the emergency procedure carefully.
Health & safety|compliance|conformité|the act of following rules or standards|The audit checks compliance with safety rules.
Health & safety|risk assessment|évaluation des risques|a systematic analysis of possible dangers|A risk assessment is required before the work begins.
Health & safety|first aid|premiers secours|immediate basic medical assistance|A first-aid kit is available at reception.
Health & safety|preventive measure|mesure préventive|an action taken to reduce risk|Training is an important preventive measure.
Manufacturing & quality|defect|défaut|a fault in a product|Quality control found a defect in the batch.
Manufacturing & quality|quality control|contrôle qualité|checks used to ensure standards are met|Every unit goes through quality control.
Manufacturing & quality|specification|spécification|a detailed technical requirement|The component does not meet the specification.
Manufacturing & quality|maintenance|maintenance|work done to keep equipment functioning|Preventive maintenance is scheduled for Monday.
Manufacturing & quality|output|production / rendement|the amount produced by a process|Factory output increased this month.
Manufacturing & quality|supplier|fournisseur|a company that provides goods or services|We are reviewing our main suppliers.
Manufacturing & quality|non-conformity|non-conformité|failure to meet a required standard|The audit identified one non-conformity.
Manufacturing & quality|root cause|cause première|the fundamental reason for a problem|We need to identify the root cause of the failure.
Problem-solving & complaints|issue|problème|a matter that needs attention|There is an issue with the latest software update.
Problem-solving & complaints|workaround|solution de contournement|a temporary way around a problem|We found a workaround while the bug is being fixed.
Problem-solving & complaints|root cause|cause racine|the fundamental source of a problem|The team is investigating the root cause.
Problem-solving & complaints|corrective action|action corrective|an action taken to fix a problem and prevent recurrence|A corrective action plan was approved.
Problem-solving & complaints|compromise|compromis|an agreement where both sides make concessions|We reached a compromise on the delivery date.
Problem-solving & complaints|apologise for|s'excuser pour|to express regret about a problem|We apologise for the inconvenience caused.
Problem-solving & complaints|make up for|compenser|to compensate for a negative experience|We offered free delivery to make up for the delay.
Problem-solving & complaints|prevent recurrence|éviter que cela se reproduise|to stop the same problem happening again|We changed the process to prevent recurrence.
Professional social language|introduce yourself|se présenter|to tell someone who you are and what you do|Let me introduce myself: I manage the support team.
Professional social language|make small talk|faire la conversation|to have light social conversation|A little small talk can help build rapport.
Professional social language|network|réseauter|to build professional relationships|The event is a good opportunity to network.
Professional social language|rapport|relation de confiance|a positive relationship based on trust|She quickly built rapport with the client.
Professional social language|host|accueillir|to receive and look after guests|We are hosting a delegation next week.
Professional social language|welcome|accueillir / souhaiter la bienvenue|to greet someone in a friendly way|I'd like to welcome you to our office.
Professional social language|keep in touch|rester en contact|to continue communicating after an event|Let's keep in touch after the conference.
Professional social language|congratulate|féliciter|to express pleasure about someone's success|I congratulated her on the promotion.
Connectors & argumentation|however|cependant|used to introduce a contrast|The solution is effective; however, it is expensive.
Connectors & argumentation|therefore|donc / par conséquent|used to introduce a result|Demand increased; therefore, we hired more staff.
Connectors & argumentation|whereas|tandis que|used to contrast two facts|The first option is cheaper, whereas the second is faster.
Connectors & argumentation|although|bien que|used to introduce an unexpected contrast|Although the deadline was tight, we finished on time.
Connectors & argumentation|in addition|de plus|used to add another point|In addition, the supplier offers free support.
Connectors & argumentation|as a result|en conséquence|used to introduce a consequence|The system failed; as a result, the meeting was delayed.
Connectors & argumentation|on the one hand|d'une part|used to structure one side of an argument|On the one hand, remote work saves commuting time.
Connectors & argumentation|from my point of view|de mon point de vue|used to introduce an opinion|From my point of view, the change is necessary.
Phrasal verbs|set up|mettre en place|to arrange or create something|We need to set up a new client account.
Phrasal verbs|carry out|effectuer|to perform a task or activity|The team will carry out a safety inspection.
Phrasal verbs|look into|examiner|to investigate something|I'll look into the problem and call you back.
Phrasal verbs|deal with|gérer / traiter|to handle a situation|She deals with customer complaints.
Phrasal verbs|take over|reprendre|to assume control or responsibility|He will take over the project next month.
Phrasal verbs|hand over|transmettre|to transfer responsibility to someone else|I'll hand over the file before I leave.
Phrasal verbs|draw up|rédiger|to prepare a formal document|The lawyer drew up the agreement.
Phrasal verbs|point out|signaler|to draw attention to something|She pointed out a mistake in the report.
False friends|actually|en fait|in reality; not actuellement|Actually, the meeting starts at 3 p.m.
False friends|currently|actuellement|at the present time|We are currently testing the new system.
False friends|eventually|finalement|in the end after some time|We eventually reached an agreement.
False friends|assist|aider|to help; not assister à|Can you assist the customer with the form?
False friends|attend|assister à|to be present at an event|I will attend the conference next week.
False friends|sensible|raisonnable / sensé|showing good judgement|That sounds like a sensible solution.
False friends|sensitive|sensible / délicat|easily affected or requiring care|This is sensitive customer information.
False friends|resume|reprendre|to continue after a pause|The meeting will resume after lunch.
Management & leadership|delegate|déléguer|to give responsibility to another person|Good managers know when to delegate.
Management & leadership|set expectations|fixer les attentes|to make required standards clear|We need to set expectations from the start.
Management & leadership|give feedback|faire un retour|to comment on someone's performance or work|Try to give feedback that is specific and constructive.
Management & leadership|empower|responsabiliser|to give people authority and confidence to act|The new process empowers local teams to decide faster.
Management & leadership|prioritise|prioriser|to decide what is most important|We must prioritise the urgent customer cases.
Management & leadership|accountability|responsabilité / redevabilité|responsibility for results and actions|Clear accountability improves project delivery.
Management & leadership|stakeholder|partie prenante|a person or group affected by a project|All key stakeholders approved the plan.
Management & leadership|decision-making|prise de décision|the process of choosing what to do|Data should support effective decision-making.
`.trim().split("\n").map(line => {
    const [category,word,fr,definition,example] = line.split("|");
    return {category,word,fr,definition,example};
  });

  const grammarData = [
    {title:"Present simple vs present continuous",rule:"Use present simple for routines, facts and stable situations. Use present continuous for actions happening now or temporary/current developments.",examples:["I manage three client accounts.","We are reviewing the contract this week."],q:"Right now, the team ___ the final figures.",options:["checks","is checking","has checked"],answer:1,why:"“Right now” points to an action in progress, so use present continuous."},
    {title:"Past simple vs present perfect",rule:"Use past simple with a finished past time. Use present perfect when the past connects to now or the time period is unfinished.",examples:["We signed the contract last Friday.","We have signed three contracts this month."],q:"We ___ this supplier since 2022.",options:["know","knew","have known"],answer:2,why:"“Since 2022” connects a past starting point to the present."},
    {title:"Future forms",rule:"Use will for predictions/spontaneous decisions, going to for intentions/evidence, and present continuous for arranged future plans.",examples:["I’ll call them now.","We’re meeting the client at 10 tomorrow."],q:"The appointment is confirmed. We ___ the assessor at 2 p.m. tomorrow.",options:["meet","are meeting","will have met"],answer:1,why:"A fixed personal arrangement is naturally expressed with present continuous."},
    {title:"Modals: obligation, advice, possibility",rule:"Must/have to express obligation, should gives advice, may/might/could express possibility, and mustn't expresses prohibition.",examples:["You must show your ID.","You should give an example."],q:"You ___ use your phone during a monitored exam.",options:["mustn't","don't have to","might"],answer:0,why:"This is prohibition, so “mustn't” is the correct choice."},
    {title:"Conditionals",rule:"Zero = facts, first = real future possibility, second = hypothetical present/future, third = hypothetical past.",examples:["If the client agrees, we’ll start Monday.","If I had more time, I would revise the proposal."],q:"If we had checked the figures, we ___ the mistake earlier.",options:["notice","would notice","would have noticed"],answer:2,why:"The condition refers to an unreal past, so use the third conditional."},
    {title:"Passive voice",rule:"Use be + past participle when the action/result matters more than the person who performs it.",examples:["The invoice was sent yesterday.","The results will be validated by the jury."],q:"All complaints ___ within 48 hours.",options:["are reviewed","review","have reviewing"],answer:0,why:"Complaints receive the action, so the passive is required."},
    {title:"Gerund vs infinitive",rule:"Some verbs take -ing (avoid, suggest, consider); others take to + infinitive (decide, plan, want). Prepositions are followed by -ing.",examples:["We decided to postpone the launch.","Thank you for taking the time to speak with us."],q:"I look forward to ___ from you.",options:["hear","hearing","have heard"],answer:1,why:"In “look forward to”, “to” is a preposition, so it is followed by -ing."},
    {title:"Prepositions",rule:"Learn common workplace combinations as chunks: responsible for, interested in, depend on, arrive at/in, on time, by Friday.",examples:["She is responsible for recruitment.","Please send it by Friday."],q:"The final decision depends ___ the client's approval.",options:["of","on","at"],answer:1,why:"The fixed combination is “depend on”."},
    {title:"Comparatives & superlatives",rule:"Use -er/more for comparison and the -est/most for the highest degree. Irregular: good → better → best.",examples:["This option is cheaper but less flexible.","It is the most reliable solution."],q:"The second proposal is ___ than the first one.",options:["more practical","practicaller","most practical"],answer:0,why:"“Practical” forms the comparative with “more”."},
    {title:"Relative clauses",rule:"Who = people, which = things, where = places, whose = possession, that can often replace who/which in defining clauses.",examples:["The colleague who called you is in finance.","This is the system that we use for orders."],q:"The warehouse ___ the goods are stored is near the airport.",options:["who","where","whose"],answer:1,why:"The missing word refers to a place."},
    {title:"Articles & determiners",rule:"Use a/an for one non-specific countable noun, the for something specific/known, and no article for general plural or uncountable ideas.",examples:["We need a solution.","The solution you suggested is effective."],q:"Could you send me ___ updated version of the report?",options:["a","an","the"],answer:1,why:"“Updated” begins with a vowel sound, so use “an”."},
    {title:"Linking ideas",rule:"Use because/so for reason-result; although/however for contrast; therefore/as a result for consequence; in addition/moreover for addition.",examples:["Although costs increased, profit remained stable.","The server failed; therefore, the meeting was delayed."],q:"The first option is cheaper, ___ the second is more flexible.",options:["whereas","because","therefore"],answer:0,why:"The sentence contrasts two options, so “whereas” is appropriate."}
  ];

  const demoData = {
    dropdown:{title:"Sentence to fill in · drop-down list",instruction:"Choose the word that best completes the sentence, then validate.",render:()=>`<p class="exam-select-line">We need to <select class="inline-select" id="demoSelect"><option value="">— choose —</option><option>meet</option><option>make</option><option>do</option></select> the deadline by Friday.</p>`,check:()=>[$("#demoSelect")?.value==="meet","The fixed expression is “meet a deadline”."]},
    textorder:{title:"Mixed-order text",instruction:"Click the sentences in the order that creates a logical professional message.",items:["Could you confirm your availability?","I would like to arrange a short meeting next week.","Thank you in advance.","We need to review the final proposal."],answer:[1,3,0,2]},
    wordbank:{title:"Bank of words",instruction:"Choose the correct words. There may be more words than blanks.",bank:["attached","regarding","deadline","although","refund"],sentence:["I'm writing "," your recent complaint. Please find our response ","."],answer:["regarding","attached"]},
    sentenceorder:{title:"Out-of-order sentence",instruction:"Click the words to build a natural professional sentence.",items:["Could","you","please","send","me","the","updated","report","?"],answer:"Could you please send me the updated report ?"},
    typed:{title:"Sentence to fill in · typed answer",instruction:"Type the missing word in the correct form.",render:()=>`<p>We have been working with this client <input id="demoTyped" class="typed-input" autocomplete="off" /> 2024.</p>`,check:()=>[$("#demoTyped")?.value.trim().toLowerCase()==="since","Use “since” with a starting point in time."]},
    mcq:{title:"Multiple-choice question",instruction:"Choose the best answer.",q:"Which sentence is the most appropriate professional request?",options:["Send me the file now.","Could you please send me the file by 3 p.m.?","I want that file."],answer:1},
    listening:{title:"Oral comprehension",instruction:"Read the question, listen to the extract and choose the best answer. You can play the recording twice.",script:"Hello, this is Maya from Northline Logistics. I'm calling about order 4821. The shipment will arrive on Thursday morning instead of Wednesday because of a customs delay. Please call me if Thursday causes any problems.",q:"Why will the shipment arrive later?",options:["The warehouse is closed.","There is a customs delay.","The customer changed the order."],answer:1}
  };

  function initReview(){
    initModal(); initDemos(); initGrammar(); initVocabulary(); initProduction();
  }
  function initModal(){
    const modal=$("#quickPlanModal");
    $("#openQuickPlan")?.addEventListener("click",()=>modal.classList.remove("hidden"));
    $("#closeQuickPlan")?.addEventListener("click",()=>modal.classList.add("hidden"));
    modal?.addEventListener("click",e=>{if(e.target===modal) modal.classList.add("hidden")});
  }
  function initDemos(){
    const stage=$("#demoStage"); if(!stage) return;
    $$(".demo-tab").forEach(btn=>btn.addEventListener("click",()=>{
      $$(".demo-tab").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); renderDemo(btn.dataset.demo);
    }));
    renderDemo("dropdown");
    function renderDemo(key){
      const d=demoData[key]; let body="";
      if(d.render) body=d.render();
      else if(key==="textorder") body=`<div class="demo-answer-row" id="demoSource">${d.items.map((x,i)=>`<button class="order-chip" data-i="${i}">${esc(x)}</button>`).join("")}</div><div class="sequence-build" id="demoBuild"></div>`;
      else if(key==="wordbank") body=`<p class="slot-line">${esc(d.sentence[0])}<span class="answer-slot" data-slot="0"></span>${esc(d.sentence[1])}<span class="answer-slot" data-slot="1"></span>${esc(d.sentence[2])}</p><div class="demo-answer-row">${d.bank.map(w=>`<button class="word-chip" data-word="${esc(w)}">${esc(w)}</button>`).join("")}</div>`;
      else if(key==="sentenceorder") body=`<div class="demo-answer-row" id="demoSource">${shuffle(d.items).map(w=>`<button class="order-chip" data-word="${esc(w)}">${esc(w)}</button>`).join("")}</div><div class="sequence-build" id="demoBuild"></div>`;
      else if(key==="mcq"||key==="listening") body=`${key==="listening"?`<div class="audio-card"><div class="audio-meta"><strong>Audio extract</strong><small id="demoPlays">2 plays remaining</small></div><button class="audio-play" id="demoAudio" type="button">▶</button></div>`:""}<p><b>${esc(d.q)}</b></p><div class="demo-answer-row">${d.options.map((x,i)=>`<button class="option-btn" data-i="${i}">${esc(x)}</button>`).join("")}</div>`;
      stage.innerHTML=`<div class="demo-box"><h3>${esc(d.title)}</h3><p class="demo-instruction">${esc(d.instruction)}</p>${body}<button class="button secondary" id="demoCheck" type="button">Check answer</button><div id="demoFeedback" class="demo-feedback hidden"></div></div>`;
      let selection=[]; let plays=2;
      if(key==="textorder") $$("#demoSource .order-chip",stage).forEach(b=>b.addEventListener("click",()=>{selection.push(+b.dataset.i);$("#demoBuild",stage).insertAdjacentHTML("beforeend",`<button class="order-chip selected" data-i="${b.dataset.i}">${esc(b.textContent)}</button>`);b.disabled=true;}));
      if(key==="sentenceorder") $$("#demoSource .order-chip",stage).forEach(b=>b.addEventListener("click",()=>{selection.push(b.dataset.word);$("#demoBuild",stage).insertAdjacentHTML("beforeend",`<button class="order-chip selected">${esc(b.dataset.word)}</button>`);b.disabled=true;}));
      if(key==="wordbank"){
        $$(".word-chip",stage).forEach(b=>b.addEventListener("click",()=>{const slot=$$(".answer-slot",stage).find(s=>!s.textContent);if(slot){slot.textContent=b.dataset.word;slot.dataset.value=b.dataset.word;slot.classList.add("filled");b.disabled=true;}}));
        $$(".answer-slot",stage).forEach(slot=>slot.addEventListener("click",()=>{if(!slot.dataset.value)return;const word=slot.dataset.value;const source=$$(".word-chip",stage).find(b=>b.dataset.word===word&&b.disabled);if(source)source.disabled=false;slot.textContent="";delete slot.dataset.value;slot.classList.remove("filled");}));
      }
      if(key==="mcq"||key==="listening") $$(".option-btn",stage).forEach(b=>b.addEventListener("click",()=>{$$(".option-btn",stage).forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selection=[+b.dataset.i]}));
      if(key==="listening") $("#demoAudio",stage)?.addEventListener("click",()=>{if(plays<=0)return;speak(d.script,$("#voiceAccent")?.value||"en-GB");plays--;$("#demoPlays",stage).textContent=`${plays} play${plays===1?"":"s"} remaining`;});
      $("#demoCheck",stage).addEventListener("click",()=>{
        let ok=false,msg="";
        if(d.check)[ok,msg]=d.check();
        else if(key==="textorder"){ok=JSON.stringify(selection)===JSON.stringify(d.answer);msg="A logical email flows from purpose → context → request → polite close."}
        else if(key==="wordbank"){const vals=$$(".answer-slot",stage).map(s=>s.dataset.value||"");ok=JSON.stringify(vals)===JSON.stringify(d.answer);msg="The natural combinations are “regarding your complaint” and “response attached”."}
        else if(key==="sentenceorder"){ok=selection.join(" ")===d.answer;msg="Professional requests often use: Could + subject + please + base verb + object."}
        else {ok=selection[0]===d.answer;msg=key==="listening"?"The speaker says the delay is caused by customs.":"The second option is clear, polite and specific."}
        const fb=$("#demoFeedback",stage);fb.className=`demo-feedback ${ok?"correct":"wrong"}`;fb.textContent=`${ok?"Correct.":"Not quite."} ${msg}`;fb.classList.remove("hidden");
      });
    }
  }
  function initGrammar(){
    const grid=$("#grammarGrid"); if(!grid) return;
    grid.innerHTML=grammarData.map((g,i)=>`<article class="grammar-card"><div class="grammar-head" data-grammar="${i}"><h3>${esc(g.title)}</h3><span>＋</span></div><div class="grammar-body hidden" id="grammarBody${i}"><p class="grammar-rule">${esc(g.rule)}</p><div class="example-stack">${g.examples.map(e=>`<div class="example-line">${esc(e)}</div>`).join("")}</div><div class="micro-quiz"><b>${esc(g.q)}</b><div class="micro-options">${g.options.map((o,j)=>`<button type="button" data-grammar-q="${i}" data-choice="${j}">${esc(o)}</button>`).join("")}</div><div class="demo-feedback hidden" id="grammarFb${i}"></div></div></div></article>`).join("");
    $$(".grammar-head",grid).forEach(h=>h.addEventListener("click",()=>{const body=$("#grammarBody"+h.dataset.grammar);body.classList.toggle("hidden");h.querySelector("span").textContent=body.classList.contains("hidden")?"＋":"−";}));
    $$('[data-grammar-q]',grid).forEach(b=>b.addEventListener("click",()=>{const i=+b.dataset.grammarQ,g=grammarData[i],choice=+b.dataset.choice;const fb=$("#grammarFb"+i);b.parentElement.querySelectorAll("button").forEach(x=>x.classList.remove("good","bad"));b.classList.add(choice===g.answer?"good":"bad");fb.className=`demo-feedback ${choice===g.answer?"correct":"wrong"}`;fb.textContent=`${choice===g.answer?"Correct.":"Try again."} ${g.why}`;fb.classList.remove("hidden");}));
  }
  function initVocabulary(){
    const sel=$("#vocabCategory"), search=$("#vocabSearch"), grid=$("#vocabGrid"); if(!sel||!grid)return;
    const cats=["All categories",...new Set(vocabRows.map(v=>v.category))]; sel.innerHTML=cats.map(c=>`<option>${esc(c)}</option>`).join("");
    let randomize=false;
    const render=()=>{const c=sel.value,q=search.value.trim().toLowerCase();let rows=vocabRows.filter(v=>(c==="All categories"||v.category===c)&&(!q||Object.values(v).join(" ").toLowerCase().includes(q)));if(randomize)rows=shuffle(rows);$("#vocabSummary").textContent=`${rows.length} entries shown · ${cats.length-1} professional categories`;grid.innerHTML=rows.map(v=>`<article class="vocab-card"><div class="vocab-word"><strong>${esc(v.word)}</strong><button class="speak-btn" data-speak="${esc(v.word)}" title="Listen" type="button">🔊</button></div><div class="vocab-fr">${esc(v.fr)}</div><p class="vocab-def">${esc(v.definition)}</p><p class="vocab-example"><em>${esc(v.example)}</em></p><span class="vocab-cat">${esc(v.category)}</span></article>`).join("");$$('[data-speak]',grid).forEach(b=>b.addEventListener("click",()=>speak(b.dataset.speak,$("#voiceAccent").value)));randomize=false;};
    sel.addEventListener("change",render);search.addEventListener("input",render);$("#vocabShuffle").addEventListener("click",()=>{randomize=true;render()});render();
  }
  function initProduction(){
    const ta=$("#writingPractice"); if(ta){const count=()=>$("#wordCount").textContent=(ta.value.trim().match(/\b[\w'-]+\b/g)||[]).length;ta.addEventListener("input",count);count();}
    $("#showWritingModel")?.addEventListener("click",()=>{const box=$("#writingFeedback");box.innerHTML=`<b>B1/B2 model</b><p>Subject: Damaged delivery – missing item</p><p>Dear Supplier Team,</p><p>I am writing regarding the delivery we received today. Unfortunately, it arrived two days later than expected and one item is missing from the order. This delay has affected our schedule because we need the complete order before we can begin the next stage of the project.</p><p>Could you please confirm when the missing item can be delivered? If possible, we would appreciate priority shipping at no additional cost.</p><p>Thank you in advance for your quick response.</p><p>Kind regards,</p>`;box.classList.remove("hidden")});
    $("#checkWritingChecklist")?.addEventListener("click",()=>{const text=ta?.value||"",words=(text.match(/\b[\w'-]+\b/g)||[]).length;const checks=[[/dear|hello|hi/i,"opening"],[/regarding|writing|contact/i,"clear purpose"],[/could|please|would|request/i,"professional request"],[/because|therefore|however|as a result/i,"linking language"],[/kind regards|best regards|sincerely|thank/i,"professional close"]];const found=checks.filter(([r])=>r.test(text)).map(([,l])=>l);const box=$("#writingFeedback");box.innerHTML=`<b>Structure check</b><p>${words} words. You show ${found.length}/5 useful features: ${found.length?found.join(", "):"none detected yet"}.</p><p>Remember: purpose → facts → impact → request/solution → next step → close.</p>`;box.classList.remove("hidden")});
    let oralTimer=null,remaining=120;$("#startOralTimer")?.addEventListener("click",()=>{clearInterval(oralTimer);remaining=120;$("#oralTimer").textContent="02:00";oralTimer=setInterval(()=>{remaining--;$("#oralTimer").textContent=`${String(Math.floor(remaining/60)).padStart(2,"0")}:${String(remaining%60).padStart(2,"0")}`;if(remaining<=0){clearInterval(oralTimer);}},1000)});
    $("#showOralModel")?.addEventListener("click",()=>{const box=$("#oralFramework");box.innerHTML=`<b>Speaking framework</b><p><strong>Answer</strong> the question directly → <strong>Explain</strong> why → <strong>Example</strong> from work → <strong>Interact</strong> with a question, clarification or reaction.</p><p>Useful phrases: “The main point is…”, “From my point of view…”, “One example would be…”, “If I understood correctly…”, “Would that solution work for you?”</p>`;box.classList.remove("hidden")});
  }

  // -------------------- EXAM DATA --------------------
  const levelN={A2:1,B1:2,B2:3,C1:4};
  const domains=["Vocabulary","Grammar & syntax","Expressions","Reading","Listening"];
  const Q={
    "Vocabulary":[
      {d:1,type:"mcq",time:40,p:"A customer wants their money back. Which word fits?",c:["refund","agenda","warehouse","forecast"],a:0,h:"Think about money returned to a customer."},
      {d:1,type:"select",time:42,p:"Complete the sentence.",before:"Please send the signed contract as an ",options:["attachment","appointment","attendance"],a:"attachment",after:"."},
      {d:1,type:"typed",time:42,p:"Type the missing word.",before:"The latest date for completing a task is the ",a:"deadline",after:"."},
      {d:2,type:"mcq",time:45,p:"The team needs to investigate the cause of the problem. Which phrase is best?",c:["look into the issue","look after the invoice","turn over the deadline","put through the budget"],a:0,h:"A phrasal verb meaning investigate."},
      {d:2,type:"wordbank",time:50,p:"Complete the message with the best words.",parts:["We received a customer "," this morning. I will "," the case to the service manager because it is urgent."],bank:["complaint","escalate","discount","agenda"],a:["complaint","escalate"]},
      {d:2,type:"mcq",time:45,p:"Which word means an important stage in a project?",c:["milestone","receipt","vacancy","warranty"],a:0},
      {d:2,type:"select",time:45,p:"Choose the most natural verb.",before:"We need to ",options:["meet","make","take"],a:"meet",after:" the client deadline."},
      {d:3,type:"mcq",time:50,p:"A temporary solution used while a problem is being fixed is a…",c:["workaround","turnover","shortlist","shipment"],a:0},
      {d:3,type:"typed",time:50,p:"Type the missing workplace noun.",before:"The range of work included in a project is its ",a:"scope",after:"."},
      {d:3,type:"mcq",time:50,p:"Which phrase means to transfer responsibility to another person?",c:["hand over","bring forward","break even","speak up"],a:0},
      {d:3,type:"mcq",time:50,p:"Which word is the best fit? “All key ___ approved the change.”",c:["stakeholders","attachments","refunds","itineraries"],a:0},
      {d:4,type:"mcq",time:55,p:"Which phrase means to make people responsible and confident to act?",c:["empower the team","postpone the team","dispatch the team","invoice the team"],a:0}
    ],
    "Grammar & syntax":[
      {d:1,type:"mcq",time:42,p:"Choose the correct sentence.",c:["She work in logistics.","She works in logistics.","She working in logistics."],a:1},
      {d:1,type:"typed",time:42,p:"Type the correct preposition.",before:"The meeting starts ",a:"at",after:" 9:30."},
      {d:1,type:"select",time:45,p:"Choose the correct form.",before:"We ",options:["are reviewing","reviewed","have review"],a:"are reviewing",after:" the proposal right now."},
      {d:2,type:"mcq",time:48,p:"We ___ this customer since 2021.",c:["know","knew","have known","are knowing"],a:2},
      {d:2,type:"mcq",time:48,p:"If the client agrees, we ___ the new schedule tomorrow.",c:["confirm","will confirm","would confirm","confirmed"],a:1},
      {d:2,type:"select",time:48,p:"Complete the passive sentence.",before:"The invoice ",options:["was sent","sent","has sending"],a:"was sent",after:" yesterday."},
      {d:2,type:"reorderWords",time:55,p:"Put the words in the correct order.",items:["Could","you","please","confirm","your","availability","?"],a:"Could you please confirm your availability ?"},
      {d:3,type:"mcq",time:52,p:"I look forward to ___ from you.",c:["hear","hearing","heard","be hear"],a:1},
      {d:3,type:"typed",time:52,p:"Type the correct connector.",before:"The first supplier is cheaper, ",a:"whereas",after:" the second offers faster delivery.",alts:["while"]},
      {d:3,type:"mcq",time:55,p:"By the time the client arrived, we ___ the presentation.",c:["finish","had finished","have finished","were finish"],a:1},
      {d:3,type:"mcq",time:55,p:"If we had tested the system earlier, we ___ the bug before launch.",c:["find","would find","would have found","will find"],a:2},
      {d:4,type:"mcq",time:58,p:"Choose the most accurate sentence.",c:["Despite the delay, we managed to meet the deadline.","Despite we were delayed, we managed meeting the deadline.","Although the delay, we managed meet the deadline."],a:0}
    ],
    "Expressions":[
      {d:1,type:"mcq",time:40,p:"Choose the best professional closing.",c:["Bye now.","Kind regards,","See ya!","Later."],a:1},
      {d:1,type:"select",time:42,p:"Complete the fixed expression.",before:"Thank you ",options:["for","to","about"],a:"for",after:" your patience."},
      {d:1,type:"mcq",time:42,p:"Which phrase politely asks for repetition?",c:["What?","Say again.","Could you repeat that, please?","You are wrong."],a:2},
      {d:2,type:"mcq",time:45,p:"Which expression means “I will contact you again with more information”?",c:["I'll follow up with you.","I'll cut you off.","I'll break even with you.","I'll take you over."],a:0},
      {d:2,type:"wordbank",time:50,p:"Complete the professional phrases.",parts:["I'd like to "," a point about the deadline. Could we "," it to next Monday?"],bank:["raise","postpone","attach","refund"],a:["raise","postpone"]},
      {d:2,type:"reorderWords",time:55,p:"Build the natural request.",items:["Would","it","be","possible","to","reschedule","the","meeting","?"],a:"Would it be possible to reschedule the meeting ?"},
      {d:2,type:"mcq",time:46,p:"Which phrase is best for clarifying?",c:["If I understood correctly, you need the final version by Friday.","I don't understand anything.","Your explanation is bad.","Repeat."],a:0},
      {d:3,type:"mcq",time:50,p:"Choose the best phrase for disagreement in a meeting.",c:["That's nonsense.","I see your point, but I have a different concern.","No way.","You are completely wrong."],a:1},
      {d:3,type:"typed",time:50,p:"Complete the collocation with one word.",before:"We need to reach an ",a:"agreement",after:" before the contract can be signed."},
      {d:3,type:"mcq",time:52,p:"Which sentence best introduces a consequence?",c:["As a result, the launch was postponed.","For example, the launch was postponed.","On the one hand, the launch was postponed.","In contrast, because the launch was postponed."],a:0},
      {d:3,type:"mcq",time:52,p:"Which expression most naturally asks for a decision?",c:["Could you let me know which option you prefer?","Tell option.","You choose now.","What you want?"],a:0},
      {d:4,type:"mcq",time:55,p:"Choose the most tactful way to challenge an assumption.",c:["I'm not sure that assumption still holds. Could we check the latest figures?","That assumption is ridiculous.","You didn't think about it.","Wrong assumption."],a:0}
    ],
    "Reading":[
      {d:1,type:"mcq",time:60,p:"Read the message and answer.",ctx:"Hi team, tomorrow's 10 a.m. meeting has moved to 11:30 because the client will arrive later than expected. The room remains the same. Please update your calendars.",q:"What has changed?",c:["The meeting time","The meeting room","The client","The date"],a:0},
      {d:1,type:"mcq",time:60,p:"Read the notice and answer.",ctx:"The reception desk will close at 4 p.m. on Friday. Visitors arriving after that time must use the side entrance and call security.",q:"What should a visitor do after 4 p.m.?",c:["Come back Monday","Use the side entrance and call security","Wait at reception","Send an invoice"],a:1},
      {d:2,type:"reorderSentences",time:75,p:"Put the email in a logical order.",items:["Could you confirm whether Friday morning would suit you?","Dear Ms Harris,","I would like to rearrange our product demonstration because our engineer is unavailable on Thursday.","Kind regards,"],a:[1,2,0,3]},
      {d:2,type:"mcq",time:68,p:"Read the email and answer.",ctx:"Dear Supplier, We received order 884 this morning. The boxes were intact, but two units inside were damaged. Please arrange collection of the damaged items and confirm when replacements will be sent. We need them before 18 September.",q:"What does the sender need before 18 September?",c:["A refund","Replacement units","New boxes","An invoice"],a:1},
      {d:2,type:"mcq",time:68,p:"Read the note and answer.",ctx:"The software update will begin at 6 p.m. and should take around 45 minutes. During this period the ordering platform will be unavailable. Save your work before 5:55 p.m.",q:"Why should employees save their work before 5:55?",c:["The office closes","The ordering platform will be unavailable","The client arrives","The update was cancelled"],a:1},
      {d:2,type:"mcq",time:70,p:"Read the message and infer the purpose.",ctx:"Thanks for the revised quote. The price is now within our budget, but we still need confirmation that installation is included. Could you clarify this point before we approve the order?",q:"What is preventing approval?",c:["The price","The delivery date","Uncertainty about installation","The payment method"],a:2},
      {d:3,type:"mcq",time:75,p:"Read the report extract and answer.",ctx:"Customer satisfaction improved from 78% to 84% this quarter. Complaints about response time fell significantly after the support team introduced a priority queue. However, satisfaction with technical explanations remained unchanged.",q:"Which change appears to have improved satisfaction?",c:["A new technical manual","A priority queue for support","Longer explanations","Fewer support staff"],a:1},
      {d:3,type:"mcq",time:78,p:"Read the memo and answer.",ctx:"Although the new supplier offers prices approximately 7% below our current contract, its standard lead time is twelve working days rather than seven. For urgent projects, this difference could outweigh the saving unless we negotiate an express-delivery option.",q:"What is the main concern about the new supplier?",c:["Product quality","Payment terms","Delivery speed","Price"],a:2},
      {d:3,type:"mcq",time:78,p:"Read the policy excerpt and answer.",ctx:"Employees may work remotely up to two days per week with manager approval. Requests should normally be submitted at least 48 hours in advance. Exceptions may be made for urgent personal circumstances.",q:"Which statement is correct?",c:["Remote work never requires approval.","Employees may normally work remotely five days a week.","Requests should usually be made two days in advance.","Exceptions are not possible."],a:2},
      {d:3,type:"mcq",time:80,p:"Read and identify the implied action.",ctx:"We have noticed that several expense claims are being submitted without receipts. From next month, claims without supporting documents will be returned to the employee and will not be processed until the missing evidence is provided.",q:"What should employees do?",c:["Stop submitting expenses","Attach supporting receipts","Send claims to customers","Wait until next year"],a:1},
      {d:4,type:"mcq",time:85,p:"Read the project update and answer.",ctx:"The pilot met its productivity target but generated a higher-than-expected volume of manual corrections. Management has therefore approved a limited extension rather than full deployment. During the extension, the team will focus on reducing exception handling and collecting data from a wider range of users.",q:"Why was full deployment not approved yet?",c:["Productivity was too low.","The pilot required too many manual corrections.","Users refused to participate.","Management cancelled the project."],a:1},
      {d:4,type:"mcq",time:85,p:"Read and identify the writer's position.",ctx:"Moving all client support to a central team would simplify reporting and staffing. Nevertheless, local teams currently resolve many issues quickly because they understand regional contracts and customer expectations. A hybrid model may preserve this knowledge while still improving consistency.",q:"What does the writer recommend?",c:["Complete centralisation","Keeping everything local","A hybrid approach","Ending client support"],a:2}
    ],
    "Listening":[
      {d:1,type:"listeningMcq",time:70,script:"Hi, this is Ben from reception. Your visitor, Ms Patel, has arrived ten minutes early. She's waiting in meeting room two.",q:"Where is Ms Patel waiting?",c:["At reception","In meeting room two","Outside the building","In the cafeteria"],a:1},
      {d:1,type:"listeningMcq",time:70,script:"The train to Lyon has been delayed by twenty minutes and will now leave from platform seven instead of platform five.",q:"What has changed in addition to the delay?",c:["The destination","The platform","The ticket price","The date"],a:1},
      {d:1,type:"listeningTyped",time:70,script:"Please send the signed form by Friday afternoon so that we can process your request on Monday.",q:"Type the day by which the signed form must be sent.",a:"friday"},
      {d:2,type:"listeningMcq",time:75,script:"Hello, this is Louise from Easton Supplies. I'm calling about invoice 7294. We received your payment, but the amount is fifty euros short. Could you check the transfer and call me back?",q:"Why is Louise calling?",c:["The invoice is missing.","The payment is short by fifty euros.","The order was cancelled.","The customer overpaid."],a:1},
      {d:2,type:"listeningMcq",time:75,script:"Just a quick update: the technician cannot come this morning because his previous appointment is taking longer than expected. He can be with you between two and three this afternoon.",q:"When will the technician probably arrive?",c:["Before noon","Between 2 and 3 p.m.","Tomorrow morning","At 5 p.m."],a:1},
      {d:2,type:"listeningTyped",time:75,script:"Our quarterly review has been moved from Tuesday to Wednesday at half past three. Please bring the updated sales forecast.",q:"Type the item participants should bring.",a:"sales forecast",alts:["updated sales forecast","forecast"]},
      {d:2,type:"listeningMcq",time:78,script:"Thanks for your message. We can replace the damaged product immediately, or we can issue a full refund. If you choose a replacement, delivery should take three working days.",q:"How long should a replacement take to arrive?",c:["One day","Three working days","One week","Immediately"],a:1},
      {d:3,type:"listeningMcq",time:82,script:"The client likes the proposed design, but they are concerned about implementation time. They have asked us to keep the current launch date while reducing the training period from three days to two. I think we should discuss whether that is realistic before we agree.",q:"What is the speaker's main concern?",c:["The design is unacceptable.","The training period may be too short.","The launch date must be cancelled.","The client wants more training."],a:1},
      {d:3,type:"listeningMcq",time:82,script:"We have two options for the conference venue. Riverside is cheaper and close to the station, while Grand Hall has better technical equipment and a larger room. Since we expect more participants than last year, I recommend Grand Hall despite the extra cost.",q:"Why does the speaker prefer Grand Hall?",c:["It is cheaper.","It is closer to the station.","It has more capacity and better equipment.","It has fewer participants."],a:2},
      {d:3,type:"listeningTyped",time:82,script:"The audit found no major safety problems, but it did identify one recurring issue: staff are not consistently recording equipment checks at the end of each shift.",q:"Type the activity that is not being recorded consistently.",a:"equipment checks",alts:["checks"]},
      {d:4,type:"listeningMcq",time:88,script:"Although the initial figures look encouraging, I would avoid presenting them as a confirmed trend. The sample only covers six weeks, and one unusually large order accounts for nearly a quarter of the increase. We should wait for the next reporting cycle before changing the forecast.",q:"Why does the speaker want to wait?",c:["The figures are negative.","The data may not yet represent a stable trend.","The forecast has already been changed.","There were no large orders."],a:1},
      {d:4,type:"listeningMcq",time:88,script:"If we centralise purchasing, we could negotiate better rates and reduce duplicate suppliers. On the other hand, local teams sometimes need specialist materials at very short notice. My suggestion is to centralise standard purchases but keep an exception process for urgent specialist needs.",q:"What solution does the speaker propose?",c:["Centralise every purchase without exceptions.","Keep all purchasing local.","Centralise standard purchases with exceptions for urgent specialist needs.","Stop using specialist materials."],a:2}
    ]
  };

  const oralStages=[
    {name:"Introduction",duration:240,prompts:["Tell me about your current role and your main responsibilities.","What does a typical working day look like for you?","Which part of your work requires the most communication?","What professional project or goal are you currently working towards?"]},
    {name:"Professional role-play",duration:300,prompts:["A client needs a delivery by Friday, but the earliest realistic date is Tuesday. I am the client. Explain the situation, apologise appropriately and negotiate an acceptable solution.","A colleague has sent you an incomplete report that you need for a meeting in one hour. I am the colleague. Explain what is missing, ask for the information and agree on a realistic next step.","A supplier has increased a price unexpectedly. I am the supplier. Ask for clarification, explain the impact and try to negotiate better terms."]},
    {name:"Professional discussion",duration:360,prompts:["Should companies require employees to work in the office several days a week? Explain your view and consider advantages and disadvantages.","What makes communication between a manager and a team effective? Give examples.","When a company introduces new technology, what should it do to help employees adapt successfully?"]}
  ];

  const examState={mode:"exam",startLevel:"B1",ability:2,domainAbility:{},domainIndex:0,answeredInDomain:0,totalAnswered:0,used:{},results:[],current:null,currentAnswer:null,timer:null,timeLeft:0,timeTotal:0,paused:false,plays:0,oralStage:0,oralPrompt:0,oralTimer:null,oralLeft:0};

  function initExam(){
    $("#practiceModeToggle")?.addEventListener("change",e=>{examState.mode=e.target.checked?"practice":"exam";$("#modeBadge").textContent=examState.mode.toUpperCase()+" MODE";});
    $("#startExam")?.addEventListener("click",startExam);
    $("#validateAnswer")?.addEventListener("click",()=>submitCurrent(false));
    $("#hintButton")?.addEventListener("click",()=>showHint());
    $("#pauseExam")?.addEventListener("click",pauseExam);$("#resumeExam")?.addEventListener("click",resumeExam);
    $("#resetExam")?.addEventListener("click",()=>{if(confirm("Reset this mock and lose current progress?")) location.reload();});
    $("#continueToOral")?.addEventListener("click",startOralSection);
    $("#finishExam")?.addEventListener("click",finishExam);
    $("#redoExam")?.addEventListener("click",()=>location.reload());
    $("#downloadResults")?.addEventListener("click",downloadResults);
    $("#startOralStage")?.addEventListener("click",startOralStageTimer);
    $("#nextOralPrompt")?.addEventListener("click",nextOralPrompt);
    $("#showOralHelp")?.addEventListener("click",()=>$("#oralHelp").classList.toggle("hidden"));
    ["examWritingA","examWritingB"].forEach((id,i)=>$("#"+id)?.addEventListener("input",e=>{$("#examWritingCount"+(i?"B":"A")).textContent=`${wordCount(e.target.value)} words`}));
  }
  function wordCount(text){return (text.trim().match(/\b[\w'-]+\b/g)||[]).length}
  function startExam(){
    const ready=[$("#readySound"),$("#readyQuiet"),$("#readyTime")].every(x=>x.checked);
    if(!ready){alert("Please confirm the three readiness checks before starting.");return;}
    examState.startLevel=$("#startLevel").value;examState.ability=levelN[examState.startLevel];domains.forEach(d=>{examState.domainAbility[d]=examState.ability;examState.used[d]=[]});
    $("#examIntro").classList.add("hidden");$("#examWorkspace").classList.remove("hidden");renderDomainList();nextQuestion();
  }
  function renderDomainList(){
    $("#domainList").innerHTML=domains.map((d,i)=>`<div class="domain-row ${i===examState.domainIndex?"current":i<examState.domainIndex?"done":""}"><span>${esc(d)}</span><b>${i<examState.domainIndex?"10/10":i===examState.domainIndex?examState.answeredInDomain+"/10":"0/10"}</b></div>`).join("");
  }
  function estimateLevel(){
    const a=examState.ability; return a<1.5?"A2":a<2.45?"B1":a<3.35?"B2":a<4.15?"C1":"C2";
  }
  function chooseQuestion(domain){
    const forced={
      "Vocabulary":{0:"select",2:"typed",4:"wordbank"},
      "Grammar & syntax":{6:"reorderWords"},
      "Reading":{2:"reorderSentences"},
      "Listening":{0:"listeningMcq",2:"listeningTyped"}
    };
    const pool=Q[domain].filter((_,i)=>!examState.used[domain].includes(i));
    const requiredType=forced[domain]?.[examState.answeredInDomain];
    const required=requiredType?pool.filter(q=>q.type===requiredType):[];
    const candidatePool=required.length?required:pool;
    const target=examState.domainAbility[domain];
    const ranked=candidatePool.map(q=>({q,diff:Math.abs(q.d-target)+Math.random()*.35})).sort((a,b)=>a.diff-b.diff);
    const chosen=ranked[0].q; const idx=Q[domain].indexOf(chosen);examState.used[domain].push(idx);return chosen;
  }
  function nextQuestion(){
    if(examState.answeredInDomain>=10){examState.domainIndex++;examState.answeredInDomain=0;renderDomainList();}
    if(examState.domainIndex>=domains.length){finishCore();return;}
    const domain=domains[examState.domainIndex],q=chooseQuestion(domain);examState.current={...q,domain};examState.currentAnswer=null;examState.plays=0;
    renderQuestion(q,domain);startQuestionTimer(q.time||50);updateProgress();
  }
  function updateProgress(){
    const n=examState.totalAnswered+1;$("#overallProgressText").textContent=`${Math.min(n,50)} / 50`;$("#overallProgressBar").style.width=`${examState.totalAnswered/50*100}%`;$("#questionCount").textContent=`Question ${Math.min(n,50)} / 50`;$("#liveLevel").textContent=estimateLevel();renderDomainList();
  }
  function renderQuestion(q,domain){
    $("#questionDomain").textContent=domain;$("#practiceFeedback").className="practice-feedback hidden";$("#hintButton").classList.toggle("hidden",examState.mode!=="practice"||!q.h);
    const typeNames={mcq:"Multiple choice",select:"Drop-down gap",typed:"Typed gap",wordbank:"Word bank",reorderWords:"Out-of-order sentence",reorderSentences:"Mixed-order text",listeningMcq:"Listening · MCQ",listeningTyped:"Listening · typed gap"};$("#questionTypeBadge").textContent=typeNames[q.type]||q.type;
    let html=`<h2>${esc(q.p||q.q||"Question")}</h2>`;
    if(q.ctx)html+=`<div class="question-context">${esc(q.ctx)}</div>`;
    if(q.q)html+=`<p class="instruction"><b>${esc(q.q)}</b></p>`;else html+=`<p class="instruction">Choose or build the best answer, then validate.</p>`;
    if(q.type==="mcq"||q.type==="listeningMcq") html+=(q.type==="listeningMcq"?audioCard(q):"")+renderOptions(q.c);
    else if(q.type==="select")html+=`<p class="exam-select-line">${esc(q.before||"")}<select id="examSelect"><option value="">— choose —</option>${q.options.map(o=>`<option>${esc(o)}</option>`).join("")}</select>${esc(q.after||"")}</p>`;
    else if(q.type==="typed")html+=`<p class="exam-select-line">${esc(q.before||"")}<input class="exam-typed" id="examTyped" autocomplete="off" />${esc(q.after||"")}</p>`;
    else if(q.type==="listeningTyped")html+=audioCard(q)+`<input class="exam-typed" id="examTyped" autocomplete="off" placeholder="Type your answer" />`;
    else if(q.type==="wordbank")html+=renderWordBank(q);
    else if(q.type==="reorderWords")html+=renderReorderWords(q);
    else if(q.type==="reorderSentences")html+=renderReorderSentences(q);
    $("#questionStage").innerHTML=html;wireQuestion(q);
  }
  function renderOptions(c){return `<div class="exam-options">${c.map((x,i)=>`<button class="exam-option" type="button" data-choice="${i}"><span class="letter">${String.fromCharCode(65+i)}</span><span>${esc(x)}</span></button>`).join("")}</div>`}
  function audioCard(q){return `<div class="audio-card"><div class="audio-meta"><strong>Audio extract</strong><small id="examPlays">2 plays remaining</small></div><button class="audio-play" id="examAudio" type="button" aria-label="Play audio">▶</button></div>`}
  function renderWordBank(q){return `<div class="question-context slot-line">${q.parts.map((p,i)=>`${esc(p)}${i<q.a.length?`<span class="answer-slot" data-slot="${i}"></span>`:""}`).join("")}</div><div class="word-bank-area">${shuffle(q.bank).map(w=>`<button class="word-chip" data-word="${esc(w)}" type="button">${esc(w)}</button>`).join("")}</div>`}
  function renderReorderWords(q){return `<div class="sequence-build" id="examBuild"></div><div class="word-bank-area" id="examSource">${shuffle(q.items).map(w=>`<button class="order-chip" data-word="${esc(w)}" type="button">${esc(w)}</button>`).join("")}</div>`}
  function renderReorderSentences(q){return `<div class="sequence-build" id="examBuild"></div><div class="exam-options" id="examSource">${q.items.map((s,i)=>`<button class="exam-option" data-index="${i}" type="button"><span class="letter">${i+1}</span><span>${esc(s)}</span></button>`).join("")}</div>`}
  function wireQuestion(q){
    const stage=$("#questionStage");
    $$('.exam-option[data-choice]',stage).forEach(b=>b.addEventListener("click",()=>{$$('.exam-option[data-choice]',stage).forEach(x=>x.classList.remove("selected"));b.classList.add("selected");examState.currentAnswer=+b.dataset.choice;}));
    $("#examSelect",stage)?.addEventListener("change",e=>examState.currentAnswer=e.target.value);$("#examTyped",stage)?.addEventListener("input",e=>examState.currentAnswer=e.target.value.trim());
    if(q.type==="wordbank"){
      $$(".word-chip",stage).forEach(b=>b.addEventListener("click",()=>{const slot=$$(".answer-slot",stage).find(s=>!s.textContent);if(slot){slot.textContent=b.dataset.word;slot.dataset.value=b.dataset.word;slot.classList.add("filled");b.disabled=true;examState.currentAnswer=$$(".answer-slot",stage).map(s=>s.dataset.value||"");}}));
      $$(".answer-slot",stage).forEach(slot=>slot.addEventListener("click",()=>{if(!slot.dataset.value)return;const word=slot.dataset.value;const source=$$(".word-chip",stage).find(b=>b.dataset.word===word&&b.disabled);if(source)source.disabled=false;slot.textContent="";delete slot.dataset.value;slot.classList.remove("filled");examState.currentAnswer=$$(".answer-slot",stage).map(s=>s.dataset.value||"");}));
    }
    if(q.type==="reorderWords"){$$("#examSource .order-chip",stage).forEach(b=>b.addEventListener("click",()=>{const newBtn=document.createElement("button");newBtn.className="order-chip selected";newBtn.type="button";newBtn.textContent=b.dataset.word;newBtn.addEventListener("click",()=>{b.disabled=false;newBtn.remove();examState.currentAnswer=$$("#examBuild .order-chip",stage).map(x=>x.textContent).join(" ")});$("#examBuild",stage).appendChild(newBtn);b.disabled=true;examState.currentAnswer=$$("#examBuild .order-chip",stage).map(x=>x.textContent).join(" ");}));}
    if(q.type==="reorderSentences"){$$("#examSource .exam-option",stage).forEach(b=>b.addEventListener("click",()=>{const newBtn=document.createElement("button");newBtn.className="exam-option selected";newBtn.type="button";newBtn.dataset.index=b.dataset.index;newBtn.innerHTML=`<span class="letter">${$("#examBuild",stage).children.length+1}</span><span>${esc(b.innerText.replace(/^\d+/,'').trim())}</span>`;newBtn.addEventListener("click",()=>{b.disabled=false;newBtn.remove();examState.currentAnswer=$$("#examBuild .exam-option",stage).map(x=>+x.dataset.index)});$("#examBuild",stage).appendChild(newBtn);b.disabled=true;examState.currentAnswer=$$("#examBuild .exam-option",stage).map(x=>+x.dataset.index);}));}
    $("#examAudio",stage)?.addEventListener("click",()=>{if(examState.plays>=2)return;let lang=$("#examAccent").value;if(lang==="mix")lang=shuffle(["en-GB","en-US","en-AU"])[0];speak(q.script,lang);examState.plays++;$("#examPlays",stage).textContent=`${2-examState.plays} play${2-examState.plays===1?"":"s"} remaining`;if(examState.plays>=2)$("#examAudio",stage).disabled=true;});
  }
  function showHint(){const fb=$("#practiceFeedback");fb.className="practice-feedback";fb.textContent=examState.current.h||"Look at the whole sentence and eliminate answers that do not fit the context.";fb.classList.remove("hidden")}
  function correctCurrent(){const q=examState.current,a=examState.currentAnswer;if(q.type==="mcq"||q.type==="listeningMcq")return a===q.a;if(q.type==="select")return a===q.a;if(q.type==="typed"||q.type==="listeningTyped"){const val=(a||"").toLowerCase().replace(/[.?!]/g,"").trim();return val===q.a.toLowerCase()||(q.alts||[]).map(x=>x.toLowerCase()).includes(val)}if(q.type==="wordbank")return JSON.stringify(a||[])===JSON.stringify(q.a);if(q.type==="reorderWords")return (a||"").replace(/\s+/g," ").trim()===q.a;if(q.type==="reorderSentences")return JSON.stringify(a||[])===JSON.stringify(q.a);return false}
  function answerLabel(q){if(q.type==="mcq"||q.type==="listeningMcq")return q.c[q.a];if(q.type==="select"||q.type==="typed"||q.type==="listeningTyped")return q.a;if(q.type==="wordbank")return q.a.join(" / ");if(q.type==="reorderWords")return q.a;if(q.type==="reorderSentences")return q.a.map(i=>q.items[i]).join(" → ");return ""}
  function submitCurrent(auto){
    if(!examState.current)return;if(!auto&&(examState.currentAnswer===null||examState.currentAnswer==="")){if(!confirm("No answer selected. Validate as unanswered?"))return;}
    stopQuestionTimer();const ok=correctCurrent();const q=examState.current,domain=q.domain;examState.results.push({domain,correct:ok,difficulty:q.d,type:q.type,answer:examState.currentAnswer,correctAnswer:answerLabel(q)});examState.domainAbility[domain]=clamp(examState.domainAbility[domain]+(ok?.14:-.12),1,4.4);examState.ability=domains.reduce((s,d)=>s+examState.domainAbility[d],0)/domains.length;examState.answeredInDomain++;examState.totalAnswered++;
    if(examState.mode==="practice"&&!auto){const fb=$("#practiceFeedback");fb.className=`practice-feedback ${ok?"correct":"wrong"}`;fb.innerHTML=`<b>${ok?"Correct.":"Not quite."}</b> ${ok?"Good choice.":`Best answer: ${esc(answerLabel(q))}`}`;fb.classList.remove("hidden");$("#validateAnswer").disabled=true;setTimeout(()=>{$("#validateAnswer").disabled=false;transitionNext();},1100);} else transitionNext();
  }
  function transitionNext(){
    $("#examWorkspace").classList.add("hidden");$("#transitionScreen").classList.remove("hidden");let n=3;$("#transitionCount").textContent=n;const t=setInterval(()=>{n--;$("#transitionCount").textContent=n;if(n<=0){clearInterval(t);$("#transitionScreen").classList.add("hidden");$("#examWorkspace").classList.remove("hidden");nextQuestion();}},1000);
  }
  function startQuestionTimer(seconds){stopQuestionTimer();examState.timeLeft=seconds;examState.timeTotal=seconds;updateTimerUI();examState.timer=setInterval(()=>{if(examState.paused)return;examState.timeLeft--;updateTimerUI();if(examState.timeLeft<=0){stopQuestionTimer();submitCurrent(true)}},1000)}
  function updateTimerUI(){const pct=clamp(examState.timeLeft/examState.timeTotal*100,0,100),bar=$("#questionTimerBar");bar.style.width=pct+"%";bar.style.background=pct>50?"var(--green)":pct>20?"var(--yellow)":"var(--red)";$("#questionTimeText").textContent=`${String(Math.floor(examState.timeLeft/60)).padStart(2,"0")}:${String(examState.timeLeft%60).padStart(2,"0")}`}
  function stopQuestionTimer(){clearInterval(examState.timer);examState.timer=null}
  function pauseExam(){examState.paused=true;$("#pauseOverlay").classList.remove("hidden")}
  function resumeExam(){examState.paused=false;$("#pauseOverlay").classList.add("hidden")}
  function finishCore(){stopQuestionTimer();$("#examWorkspace").classList.add("hidden");$("#writingSection").classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"})}
  function startOralSection(){$("#writingSection").classList.add("hidden");$("#oralSection").classList.remove("hidden");renderOralNav();renderOralPrompt();window.scrollTo({top:0,behavior:"smooth"})}
  function renderOralNav(){$("#oralStageNav").innerHTML=oralStages.map((s,i)=>`<button class="oral-nav-btn ${i===examState.oralStage?"active":""}" data-stage="${i}" type="button"><b>${i+1}. ${esc(s.name)}</b><br><small>${Math.round(s.duration/60)} min practice</small></button>`).join("");$$('[data-stage]',$("#oralStageNav")).forEach(b=>b.addEventListener("click",()=>{examState.oralStage=+b.dataset.stage;examState.oralPrompt=0;clearInterval(examState.oralTimer);renderOralNav();renderOralPrompt()}))}
  function renderOralPrompt(){const s=oralStages[examState.oralStage];$("#oralStageLabel").textContent=`Stage ${examState.oralStage+1} of 3`;$("#oralPromptTitle").textContent=s.name;$("#oralPromptBody").innerHTML=`<p class="prompt-main">${esc(s.prompts[examState.oralPrompt])}</p><p>Speak aloud as if the assessor were in front of you. Develop your answer and interact naturally.</p>`;examState.oralLeft=s.duration;updateOralTimer();$("#oralHelp").innerHTML=`<b>Useful framework</b><p>${examState.oralStage===0?"Direct answer → responsibility/example → detail → professional goal.":examState.oralStage===1?"Acknowledge → explain facts → propose solution → negotiate → confirm next step.":"State view → reason 1 + example → reason 2 / counterpoint → balanced conclusion."}</p><p>Interaction phrases: “If I understood correctly…”, “Would that work for you?”, “Could you clarify…?”, “From my point of view…”, “One practical example is…”</p>`;$("#oralHelp").classList.add("hidden")}
  function updateOralTimer(){$("#oralStageTimer").textContent=`${String(Math.floor(examState.oralLeft/60)).padStart(2,"0")}:${String(examState.oralLeft%60).padStart(2,"0")}`}
  function startOralStageTimer(){clearInterval(examState.oralTimer);examState.oralLeft=oralStages[examState.oralStage].duration;updateOralTimer();examState.oralTimer=setInterval(()=>{examState.oralLeft--;updateOralTimer();if(examState.oralLeft<=0)clearInterval(examState.oralTimer)},1000)}
  function nextOralPrompt(){const s=oralStages[examState.oralStage];examState.oralPrompt=(examState.oralPrompt+1)%s.prompts.length;renderOralPrompt()}
  function finishExam(){clearInterval(examState.oralTimer);$("#oralSection").classList.add("hidden");renderResults();$("#resultsSection").classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"})}
  function renderResults(){
    const scores={};domains.forEach(d=>{const r=examState.results.filter(x=>x.domain===d);scores[d]=Math.round((r.filter(x=>x.correct).length/(r.length||1))*100)});const overall=Math.round(domains.reduce((s,d)=>s+scores[d],0)/domains.length);let level=overall<45?"A2":overall<60?"B1":overall<75?"B2":overall<88?"C1":"C2";$("#resultLevel").textContent=level;$("#resultSummary").textContent=`Core score: ${overall}%. This is an independent practice estimate, not an official CLOE result.`;$("#resultCards").innerHTML=domains.map(d=>`<div class="result-skill"><strong>${scores[d]}%</strong><span>${esc(d)}</span></div>`).join("");
    const sorted=[...domains].sort((a,b)=>scores[a]-scores[b]);$("#priorityList").innerHTML=sorted.slice(0,3).map((d,i)=>`<div class="priority-item"><b>${i+1}. ${esc(d)}</b><br><span>${scores[d]}% · ${scores[d]<60?"Priority review recommended":scores[d]<75?"Consolidate for B2 consistency":"Maintain and stretch difficulty"}</span></div>`).join("");
    const wa=$("#examWritingA").value,wb=$("#examWritingB").value;const writingFeatures=(t)=>({words:wordCount(t),opening:/dear|hello|hi/i.test(t),request:/could|please|would|request|need/i.test(t),link:/however|because|therefore|although|as a result|in addition/i.test(t),close:/regards|thank|sincerely/i.test(t)});const A=writingFeatures(wa),B=writingFeatures(wb);$("#writingReport").innerHTML=`<p><b>Task A:</b> ${A.words} words · ${[A.opening,A.request,A.link,A.close].filter(Boolean).length}/4 useful structure signals detected.</p><p><b>Task B:</b> ${B.words} words · ${[B.opening,B.request,B.link,B.close].filter(Boolean).length}/4 useful structure signals detected.</p><p class="section-note">This automatic check only detects structure markers; it does not grade language accuracy like a human evaluator.</p>`;
    const vals=$$('[data-rubric]').map(s=>s.value).filter(Boolean);const strong=vals.filter(v=>v==="Strong").length,functional=vals.filter(v=>v==="Functional").length;$("#oralReport").innerHTML=`<p>${vals.length?`Self-rubric completed: ${strong} strong · ${functional} functional · ${vals.length-strong-functional} needs work.`:"No oral self-rubric ratings were entered."}</p><p>Focus on interaction, development, clarity and controlled pace rather than memorised perfection.</p>`;
    examState.final={scores,overall,level,writing:{A:A.words,B:B.words},oral:vals};
  }
  function downloadResults(){const f=examState.final||{};const lines=["CLOE English Mock · Version 1","Independent practice report",`Date: ${new Date().toLocaleString()}`,`Estimated level: ${f.level||"—"}`,`Core score: ${f.overall??"—"}%`,"",...domains.map(d=>`${d}: ${f.scores?.[d]??"—"}%`),"",`Writing Task A: ${f.writing?.A??0} words`,`Writing Task B: ${f.writing?.B??0} words`,"",`Oral self-ratings: ${(f.oral||[]).join(", ")||"not completed"}`,"","This is a practice estimate and not an official CLOE score."];const blob=new Blob([lines.join("\n")],{type:"text/plain"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="CLOE_Mock_V1_Results.txt";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}

  if(page==="review") initReview();
  if(page==="exam") initExam();
})();
