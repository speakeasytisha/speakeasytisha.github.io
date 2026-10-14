(() => {
  const stateKey = 'mounia-world-ready-lesson1-v4';
  const appState = JSON.parse(localStorage.getItem(stateKey) || '{}');
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  const toast = msg=>{const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1900)};
  const saveState=()=>localStorage.setItem(stateKey,JSON.stringify(appState));

  // ---------- Data ----------
  const translationQuestions = [
    {q:'You want to say: « Je gère les situations difficiles. »', options:['I manage difficult situations.','I handle difficult situations.','I manage with difficult situations.'], answer:1, explain:'“Handle” is the natural verb for dealing with a difficult situation.', hint:'Think: deal with / handle — not a word-for-word translation of gérer.'},
    {q:'You want to say: « Je suis habituée à travailler sous pression. »', options:['I am used to working under pressure.','I have the habit to work under pressure.','I am used to work under pressure.'], answer:0, explain:'After “be used to”, use a noun or -ing form.', hint:'be used to + noun / verb-ing'},
    {q:'You want to say: « Je passe un entretien demain. »', options:['I pass an interview tomorrow.','I have an interview tomorrow.','I make an interview tomorrow.'], answer:1, explain:'In English, you “have an interview”.', hint:'You have an appointment; you also have an interview.'},
    {q:'You want to say: « Je suis d’accord. »', options:['I am agree.','I agree.','I am agreeing.'], answer:1, explain:'“Agree” is a verb: I agree.', hint:'No “be” before the verb agree.'},
    {q:'You want to say: « Je vais vérifier pour vous. »', options:['I will control for you.','I’m going to verify you.','Let me check that for you.'], answer:2, explain:'“Let me check that for you” is natural and service-oriented.', hint:'A customer-service chunk beginning with “Let me…”'},
    {q:'You want to say: « Il faut trouver une solution. »', options:['We need to find a solution.','It is necessary to find a solution.','We must search a solution.'], answer:0, explain:'“We need to find a solution” is direct and natural in professional English.', hint:'Use need to + find.'},
    {q:'You want to say: « Je vais vous expliquer la procédure. »', options:['I explain you the procedure.','I’ll explain the procedure to you.','I’ll explain you how is the procedure.'], answer:1, explain:'Explain something to someone.', hint:'explain + thing + to + person'},
    {q:'You want to say: « Je veux m’assurer que vous avez compris. »', options:['I want to assure that you understood.','I want to make sure you understood.','I want to be sure if you understanded.'], answer:1, explain:'“Make sure” is the natural chunk here.', hint:'make sure + clause'}
  ];

  const grammarQuestions = [
    {q:'I am ___ qualified cabin crew member.', options:['a','the','—'], answer:0, explain:'Use “a” when naming a profession or role.', hint:'One role, mentioned generally.'},
    {q:'I worked ___ the airport for one year.', options:['at','on','in'], answer:0, explain:'Use “at the airport” for the location/workplace.', hint:'at = point/location'},
    {q:'The passenger left a passport ___ the aircraft.', options:['at','on','to'], answer:1, explain:'We say “on the aircraft / on the plane / on the flight”.', hint:'Transport surface/context → on.'},
    {q:'Please go to ___ gate shown on your boarding pass.', options:['a','the','—'], answer:1, explain:'The gate is specific: the one shown on the boarding pass.', hint:'Specific/identified noun.'},
    {q:'She is waiting ___ the terminal.', options:['at','in','on'], answer:1, explain:'Use “in the terminal” when inside the building.', hint:'Inside an enclosed place.'},
    {q:'We need ___ solution that works for the passenger.', options:['a','the','—'], answer:0, explain:'First mention of one non-specific solution → “a”.', hint:'One possible solution, not identified yet.'},
    {q:'I spoke to ___ passenger who reported the missing bag.', options:['a','the','—'], answer:1, explain:'This passenger is identified by the relative clause/context.', hint:'A specific passenger already identifiable.'},
    {q:'There was ___ problem with the baggage system.', options:['a','the','—'], answer:0, explain:'First mention of one countable problem → “a”.', hint:'One problem, introduced for the first time.'},
    {q:'The customer is ___ Gate 12.', options:['at','in','on'], answer:0, explain:'Use “at Gate 12” for a specific point/location.', hint:'Gate number = point.'},
    {q:'There are several passengers ___ the boarding area.', options:['at','in','on'], answer:1, explain:'Use “in the boarding area”.', hint:'Within an area → in.'}
  ];


  const grammarLabCategories = [{"name": "Present Simple vs Present Continuous", "questions": [{"q": "I usually ___ passenger complaints at the service desk.", "options": ["handle", "am handling", "have handled"], "answer": 0, "explain": "Use Present Simple for routines and regular responsibilities.", "hint": "Usually is a strong signal for Present Simple."}, {"q": "Please wait a moment. I ___ your booking now.", "options": ["check", "am checking", "have checked"], "answer": 1, "explain": "Use Present Continuous for an action happening now.", "hint": "The word now points to an action in progress."}, {"q": "Our team ___ special-assistance requests every day.", "options": ["is coordinating", "coordinates", "has coordinated"], "answer": 1, "explain": "Use Present Simple for repeated work processes.", "hint": "Every day = routine."}]}, {"name": "Past Simple vs Present Perfect", "questions": [{"q": "I ___ as an airport agent in 2024.", "options": ["have worked", "worked", "have been working"], "answer": 1, "explain": "Use Past Simple with a finished, specific past time.", "hint": "A finished year such as 2024 normally takes Past Simple."}, {"q": "I ___ several difficult passenger situations during my career.", "options": ["handled", "have handled", "am handling"], "answer": 1, "explain": "Use Present Perfect for life/work experience when no finished time is given.", "hint": "No specific finished date; the experience is relevant now."}, {"q": "She ___ the incident report yesterday.", "options": ["has completed", "completed", "completes"], "answer": 1, "explain": "Yesterday requires Past Simple.", "hint": "Finished past-time marker = Past Simple."}]}, {"name": "Present Perfect details", "questions": [{"q": "I have worked in aviation ___ three years.", "options": ["since", "for", "during"], "answer": 1, "explain": "Use for + a duration.", "hint": "Three years is a length of time."}, {"q": "The passenger hasn’t received the bag ___ .", "options": ["already", "yet", "ever"], "answer": 1, "explain": "Use yet in negatives and questions for something expected up to now.", "hint": "Negative sentence + expected result."}, {"q": "Have you ___ dealt with a medical emergency?", "options": ["ever", "since", "yet"], "answer": 0, "explain": "Use ever to ask about experience at any time up to now.", "hint": "Experience question = ever."}]}, {"name": "Future forms", "questions": [{"q": "I ___ check the latest flight information for you.", "options": ["am going", "will", "am"], "answer": 1, "explain": "Will is natural for a decision/offer made at the moment of speaking.", "hint": "A spontaneous service offer often uses will."}, {"q": "We ___ the recruiter tomorrow at 10 a.m.", "options": ["meet", "are meeting", "will meeting"], "answer": 1, "explain": "Present Continuous is common for a fixed personal arrangement.", "hint": "A scheduled arrangement already organised."}, {"q": "Look at those queues. Boarding ___ take longer than expected.", "options": ["is going to", "will to", "is"], "answer": 0, "explain": "Be going to is used for a prediction based on present evidence.", "hint": "You can see evidence now."}]}, {"name": "Modals: ability, advice, obligation", "questions": [{"q": "Passengers ___ show a valid boarding pass before entering this area.", "options": ["must", "could", "might"], "answer": 0, "explain": "Must expresses a strong rule or obligation.", "hint": "This is a requirement, not a suggestion."}, {"q": "You ___ speak to the baggage desk if you need a written report.", "options": ["should", "mustn’t", "can’t"], "answer": 0, "explain": "Should gives advice or a recommended next step.", "hint": "Recommendation = should."}, {"q": "___ you tell me what happened first, please?", "options": ["Could", "Must", "Should to"], "answer": 0, "explain": "Could makes a polite professional request.", "hint": "Polite request to a passenger."}]}, {"name": "Questions & auxiliaries", "questions": [{"q": "How long ___ you worked in aviation?", "options": ["did", "have", "are"], "answer": 1, "explain": "Present Perfect question: How long have you worked…?", "hint": "Experience continuing to now → have."}, {"q": "___ the passenger report the bag yesterday?", "options": ["Has", "Did", "Does"], "answer": 1, "explain": "Use did for a Past Simple question.", "hint": "Yesterday = Past Simple; question auxiliary = did."}, {"q": "What ___ you do if a passenger became aggressive?", "options": ["would", "do", "are"], "answer": 0, "explain": "Use would in a hypothetical interview question.", "hint": "If + past form often pairs with would in the result/question."}]}, {"name": "Articles", "questions": [{"q": "She is ___ experienced airport agent.", "options": ["a", "an", "the"], "answer": 1, "explain": "Use an before a vowel sound: an experienced agent.", "hint": "Listen to the first sound of experienced."}, {"q": "Please return to ___ gate on your boarding pass.", "options": ["a", "the", "—"], "answer": 1, "explain": "The gate is specific and identified by the boarding pass.", "hint": "Specific/identified noun = the."}, {"q": "___ safety is our first priority.", "options": ["A", "The", "—"], "answer": 2, "explain": "Abstract/general nouns often take no article when used generally.", "hint": "Safety here is a general concept."}]}, {"name": "Prepositions", "questions": [{"q": "The passenger is waiting ___ Gate 18.", "options": ["at", "in", "on"], "answer": 0, "explain": "Use at for a precise point such as a numbered gate.", "hint": "Gate number = point."}, {"q": "I left my notebook ___ the aircraft.", "options": ["at", "on", "to"], "answer": 1, "explain": "Use on with aircraft/plane/flight.", "hint": "Transport context = on."}, {"q": "The family is waiting ___ the terminal.", "options": ["in", "at", "on"], "answer": 0, "explain": "Use in when inside an enclosed building/area.", "hint": "Inside the terminal."}]}, {"name": "Countable / uncountable & quantifiers", "questions": [{"q": "How ___ luggage does the passenger have?", "options": ["many", "much", "few"], "answer": 1, "explain": "Luggage is uncountable, so use much.", "hint": "You cannot normally say one luggage/two luggages."}, {"q": "There are only ___ seats left on the flight.", "options": ["a little", "a few", "much"], "answer": 1, "explain": "Seats are countable plural, so use a few.", "hint": "Countable plural → few/a few."}, {"q": "We have ___ information about the delay at the moment.", "options": ["a few", "many", "little"], "answer": 2, "explain": "Information is uncountable; little means not much.", "hint": "Information is uncountable."}]}, {"name": "Comparatives & superlatives", "questions": [{"q": "This solution is ___ than asking the passenger to wait for another hour.", "options": ["more efficient", "efficienter", "most efficient"], "answer": 0, "explain": "Use more + adjective for longer adjectives such as efficient.", "hint": "Long adjective → more + adjective."}, {"q": "That was the ___ situation I handled that week.", "options": ["more stressful", "most stressful", "stressfullest"], "answer": 1, "explain": "Use the + superlative for the highest degree in a group/time period.", "hint": "The + most + adjective."}, {"q": "The new process is slightly ___ than the old one.", "options": ["clearer", "clearest", "more clear than"], "answer": 0, "explain": "Clear commonly forms the comparative with -er: clearer.", "hint": "Short adjective → -er is natural."}]}, {"name": "Conditionals", "questions": [{"q": "If the flight ___ delayed, we’ll inform passengers immediately.", "options": ["is", "will be", "was"], "answer": 0, "explain": "First conditional: if + Present Simple, will + base verb.", "hint": "Do not normally put will after if in a first conditional."}, {"q": "If I ___ in that situation, I would speak to the supervisor first.", "options": ["am", "were", "will be"], "answer": 1, "explain": "Second conditional commonly uses were for hypothetical situations.", "hint": "Hypothetical interview answer → If I were…"}, {"q": "If a passenger needs assistance, I ___ the request before boarding.", "options": ["would confirm", "confirm", "will confirmed"], "answer": 1, "explain": "For a general procedure/routine, use Present Simple in both clauses (zero conditional idea).", "hint": "General rule/process, not one future event."}]}, {"name": "Gerund vs infinitive", "questions": [{"q": "I am used to ___ under pressure.", "options": ["work", "working", "to work"], "answer": 1, "explain": "Be used to + noun or -ing form.", "hint": "Here to is a preposition, not an infinitive marker."}, {"q": "We need ___ the passenger before the gate closes.", "options": ["contact", "to contact", "contacting"], "answer": 1, "explain": "Need is followed by to + infinitive.", "hint": "need to + base verb."}, {"q": "Try to avoid ___ with an angry passenger.", "options": ["argue", "to argue", "arguing"], "answer": 2, "explain": "Avoid is followed by the -ing form.", "hint": "avoid + verb-ing."}]}, {"name": "Relative clauses", "questions": [{"q": "The passenger ___ reported the bag is waiting outside.", "options": ["who", "which", "where"], "answer": 0, "explain": "Use who for people.", "hint": "Passenger = person."}, {"q": "The suitcase ___ was left at security has been found.", "options": ["who", "that", "where"], "answer": 1, "explain": "Use that/which for things.", "hint": "Suitcase = thing."}, {"q": "This is the desk ___ passengers report missing baggage.", "options": ["who", "where", "which person"], "answer": 1, "explain": "Use where for a place in which an action happens.", "hint": "Desk/location → where."}]}, {"name": "Passive voice", "questions": [{"q": "Your bag ___ and will be delivered to your hotel.", "options": ["has located", "has been located", "was locate"], "answer": 1, "explain": "Present Perfect passive: has/have been + past participle.", "hint": "The bag receives the action."}, {"q": "The flight ___ by 40 minutes because of weather conditions.", "options": ["has been delayed", "has delayed", "is delaying"], "answer": 0, "explain": "Use the passive because the flight receives the delay action.", "hint": "has been + past participle."}, {"q": "Passengers ___ to remain near the gate.", "options": ["have asked", "have been asked", "are ask"], "answer": 1, "explain": "Present Perfect passive: have been asked.", "hint": "Passengers receive the instruction."}]}, {"name": "French interference & natural English", "questions": [{"q": "Choose the natural English: « J’assiste à une réunion demain. »", "options": ["I assist a meeting tomorrow.", "I’m attending a meeting tomorrow.", "I attend to a meeting tomorrow."], "answer": 1, "explain": "Attend means be present at a meeting. Assist means help someone.", "hint": "French assister ≠ English assist in this context."}, {"q": "Choose the natural English: « Je vais vous expliquer la situation. »", "options": ["I’ll explain you the situation.", "I’ll explain the situation to you.", "I’ll explain to you about the situation."], "answer": 1, "explain": "Explain something to someone.", "hint": "Thing first, then to + person."}, {"q": "Choose the natural English: « Je cherche une solution. »", "options": ["I’m searching a solution.", "I’m looking for a solution.", "I’m researching for a solution."], "answer": 1, "explain": "Look for is the natural everyday/professional phrase for trying to find something.", "hint": "chercher → look for, not search + object in this context."}]}];

  const vocab = [
    {title:'Conflict & de-escalation', icon:'🧯', rows:[
      ['to de-escalate','désamorcer','We need to de-escalate the situation before it becomes more stressful.'],
      ['to acknowledge a concern','reconnaître une inquiétude','Start by acknowledging the passenger’s concern.'],
      ['to remain calm','rester calme','I remain calm even when the passenger is upset.'],
      ['to set a clear boundary','poser une limite claire','We can be polite while setting a clear boundary.'],
      ['to reach a solution','aboutir à une solution','Let’s see if we can reach a solution together.']
    ]},
    {title:'Baggage & airport operations', icon:'🧳', rows:[
      ['baggage allowance','franchise bagage','Let me check the baggage allowance on your booking.'],
      ['oversized baggage','bagage hors gabarit','Oversized baggage may need to be checked in.'],
      ['delayed baggage','bagage retardé','The passenger has reported delayed baggage.'],
      ['baggage tracing','traçage des bagages','I’ll check the baggage tracing status.'],
      ['overhead locker / bin','compartiment à bagages','Your bag needs to fit in the overhead locker.']
    ]},
    {title:'Stress & crisis language', icon:'🚨', rows:[
      ['to assess the situation','évaluer la situation','First, I would assess the situation and identify the immediate risk.'],
      ['to prioritise','prioriser','We need to prioritise safety and urgent passenger needs.'],
      ['to follow procedure','suivre la procédure','I would remain calm and follow the appropriate procedure.'],
      ['to keep someone informed','tenir quelqu’un informé','I’ll keep you informed as soon as I have confirmed information.'],
      ['to escalate the issue','faire remonter le problème','If necessary, I would escalate the issue to a supervisor.']
    ]},
    {title:'Special assistance & passenger needs', icon:'♿', rows:[
      ['special assistance','assistance particulière','Let me confirm the special assistance request.'],
      ['reduced mobility','mobilité réduite','The passenger has reduced mobility and needs support at the gate.'],
      ['to accommodate a need','répondre à un besoin','We will do our best to accommodate the passenger’s needs.'],
      ['medical requirement','besoin médical','Is there any medical requirement we should be aware of?'],
      ['to make arrangements','prendre des dispositions','I’ll make the necessary arrangements with the ground team.']
    ]},
    {title:'Diplomatic solution language', icon:'🤝', rows:[
      ['What I can do is…','Ce que je peux faire, c’est…','What I can do is check the next available option.'],
      ['Let me look into that.','Je vais vérifier cela.','Let me look into that and see what happened.'],
      ['Here are the options available.','Voici les options possibles.','Here are the options available at the moment.'],
      ['Just to make sure I understood…','Juste pour vérifier que j’ai bien compris…','Just to make sure I understood, you need assistance for your mother as well.'],
      ['Would that work for you?','Est-ce que cela vous conviendrait ?','I can request a new seat. Would that work for you?']
    ]}
  ];

  const dialectRows = [
    ['hand luggage','carry-on bag','Cabin baggage carried by the passenger'],
    ['overhead locker','overhead bin','Storage above the seats'],
    ['queue','line','People waiting'],
    ['timetable','schedule','Planned times'],
    ['single / return ticket','one-way / round-trip ticket','Ticket type'],
    ['holiday','vacation','Time away from work'],
    ['ground floor','first floor','Floor numbering differs — important!']
  ];

  const assistanceQuestions = [
    {q:'Which reply is safest and most professional?', options:['Don’t worry. You will definitely make the connection.','I can’t promise the connection yet, but I can check the latest information and the assistance arrangements.','You need to speak to someone else.'], answer:1, explain:'B2 professional language reassures without making an unverified promise.', hint:'Avoid guarantees when you do not have confirmed information.'},
    {q:'Which question best clarifies the assistance need?', options:['Why is your mother in a wheelchair?','Has wheelchair assistance already been booked for your mother?','Is your mother old?'], answer:1, explain:'It gathers operationally useful information in a respectful way.', hint:'Ask what you need to act, not unnecessary personal details.'},
    {q:'Which phrase checks understanding naturally?', options:['You understand me?','Is it clear or not?','Just to make sure, you need assistance at arrival and for the connection, correct?'], answer:2, explain:'It reformulates the need and invites confirmation.', hint:'Use “Just to make sure…” + a concise reformulation.'}
  ];

  const lilateInteraction = [
    {q:'Choose the best first question.', options:['Why did you put medication in your bag?','Can you tell me what medication you need and whether you have any with you now?','You should wait until tomorrow.'], answer:1, explain:'Clarify the urgent need first, then check baggage tracing and escalation options.', hint:'Gather the information that affects urgency and next action.'}
  ];


  const baggageQuestions = [
    {q:'Which opening is most professional?', options:['Calm down. The rules are the rules.','I understand why you’re frustrated. Let me check the allowance on your booking first.','You have to pay because your bag is too big.'], answer:1, explain:'Acknowledge the emotion and clarify the facts before explaining the rule.', hint:'A strong first sentence lowers the temperature before giving information.'},
    {q:'Which explanation sounds firm but not confrontational?', options:['Your bag is wrong.','The bag exceeds the permitted cabin dimensions, so it cannot travel in the overhead locker.','You didn’t read the rules.'], answer:1, explain:'It states the rule neutrally and focuses on the bag, not on blaming the passenger.', hint:'Describe the confirmed fact, not the passenger’s mistake.'},
    {q:'Which next step keeps you solution-focused?', options:['There is nothing I can do.','What I can do is explain the available options and help you choose the quickest one.','You need to decide now.'], answer:1, explain:'B2 professional communication moves from the problem to an actionable solution.', hint:'Use “What I can do is…” to regain control of the interaction.'}
  ];

  // ---------- Quiz rendering ----------
  function renderQuiz(containerId, data, keyPrefix){
    const c=$(containerId); if(!c) return;
    c.innerHTML=data.map((item,i)=>`<div class="quiz-item" data-quiz="${keyPrefix}-${i}"><div class="quiz-q">${i+1}. ${item.q}</div><div class="quiz-options">${item.options.map((o,j)=>`<button class="quiz-option" type="button" data-opt="${j}">${o}</button>`).join('')}</div><div class="quiz-feedback">Choose an answer.</div><button class="hint-btn" type="button">💡 Hint</button><div class="hint-text">${item.hint}</div></div>`).join('');
    $$('.quiz-item',c).forEach((el,i)=>{
      const saved=appState[`${keyPrefix}-${i}`];
      if(Number.isInteger(saved)) markQuiz(el,data[i],saved,true);
      $$('.quiz-option',el).forEach(btn=>btn.addEventListener('click',()=>{const choice=Number(btn.dataset.opt);appState[`${keyPrefix}-${i}`]=choice;saveState();markQuiz(el,data[i],choice,false);}));
      $('.hint-btn',el)?.addEventListener('click',()=>$('.hint-text',el)?.classList.toggle('show'));
    });
  }
  function markQuiz(el,item,choice,silent=false){
    el.classList.remove('correct','incorrect');$$('.quiz-option',el).forEach((b,j)=>b.classList.toggle('selected',j===choice));
    const ok=choice===item.answer;el.classList.add(ok?'correct':'incorrect');$('.quiz-feedback',el).innerHTML=ok?`<strong>✓ Correct.</strong> ${item.explain}`:`<strong>✕ Not yet.</strong> ${item.explain}`;
    if(!ok) $('.hint-text',el)?.classList.add('show');
    if(!silent) toast(ok?'Correct — professional precision.':'Not yet — use the hint, then try again.');
  }
  renderQuiz('#translationQuiz',translationQuestions,'trans');
  renderQuiz('#baggageQuiz',baggageQuestions,'bagQuiz');
  renderQuiz('#assistanceQuiz',assistanceQuestions,'assist');
  renderQuiz('#lilateInteractionQuiz',lilateInteraction,'lilateInteract');

  const grammarGuides = {
    'Present Simple vs Present Continuous': {
      rule:'Use the Present Simple for routines, permanent responsibilities and facts. Use the Present Continuous for an action happening now or a temporary situation around now.',
      affirmative:'I usually handle passenger complaints. / I am checking your booking now.',
      negative:'I do not usually work at this gate. / I am not checking the baggage system at the moment.',
      question:'Do you usually work with passengers? / Are you dealing with this case now?',
      keywords:'Present Simple: usually, often, always, every day, normally. Present Continuous: now, at the moment, currently, today, this week.',
      traps:['Do not use the continuous just because the sentence is happening in the present: routines still use Present Simple.','Stative verbs such as know, understand, need and believe are normally not used in the continuous.'],
      model:'I usually deal with passengers at the service desk, but today I am helping the boarding team.'
    },
    'Past Simple vs Present Perfect': {
      rule:'Use the Past Simple for a finished action at a finished past time. Use the Present Perfect for experience or a past action connected to now when the finished time is not stated.',
      affirmative:'I worked as an airport agent in 2024. / I have handled many difficult situations.',
      negative:'I did not work in cabin crew in 2024. / I have not dealt with that situation before.',
      question:'Did you work at the airport last year? / Have you ever handled a medical emergency?',
      keywords:'Past Simple: yesterday, last week, in 2024, two years ago. Present Perfect: ever, never, already, yet, recently, so far.',
      traps:['Never use Present Perfect with a finished past marker such as yesterday or in 2024.','French often uses the passé composé where English needs Past Simple.'],
      model:'I worked in airport services for one year, and I have since handled a wide range of passenger situations.'
    },
    'Present Perfect details': {
      rule:'Use Present Perfect to connect past and present. FOR gives a duration; SINCE gives the starting point. Use YET mainly in negatives/questions, ALREADY for earlier-than-expected actions, and EVER/NEVER for experience.',
      affirmative:'I have worked in aviation for three years. / I have already checked the file.',
      negative:'The passenger has not received the bag yet. / I have never worked on that route.',
      question:'How long have you worked in aviation? / Have you ever dealt with this type of emergency?',
      keywords:'for + duration · since + starting point · already · yet · ever · never · recently · so far.',
      traps:['FOR = three years; SINCE = 2023 / Monday / I started.','Do not say “since three years”.'],
      model:'I have worked with passengers for several years, and I have already dealt with many stressful situations.'
    },
    'Future forms': {
      rule:'Use WILL for spontaneous decisions, offers and neutral predictions; BE GOING TO for plans or predictions based on present evidence; Present Continuous for a fixed personal arrangement.',
      affirmative:'I will check that for you. / I am going to review the procedure. / I am meeting the recruiter tomorrow.',
      negative:'I will not give you incorrect information. / I am not going to ignore the problem. / I am not meeting them today.',
      question:'Will you need assistance? / Are you going to apply? / Are you meeting the recruiter tomorrow?',
      keywords:'will: I think, probably, I’ll… now. going to: plan, intention, visible evidence. Present Continuous: tomorrow at 10, on Monday, arranged.',
      traps:['Do not use “will” automatically for every future sentence.','After will, use the base verb: will check, not will checking / will to check.'],
      model:'I’ll check the latest information now. I’m going to prepare for the grammar test tonight, and I’m meeting the recruiter next week.'
    },
    'Modals: ability, advice, obligation': {
      rule:'Modal verbs express ability, permission, advice, possibility or obligation. A modal is followed by the base verb without TO.',
      affirmative:'You must show your boarding pass. / You should speak to baggage services. / I can help you.',
      negative:'You must not enter this area. / You should not leave the gate. / I cannot confirm that yet.',
      question:'Could you show me your boarding pass? / Can I help you? / Should I contact the ground team?',
      keywords:'can/could = ability or request · should = advice · must/have to = obligation · may/might = possibility.',
      traps:['Must not = prohibition; do not have to = no obligation. They are not the same.','No -s and no “to” after a modal: she can help, not she can helps / can to help.'],
      model:'You must remain in the boarding area, but you can speak to the service desk if you need further assistance.'
    },
    'Questions & auxiliaries': {
      rule:'Most English questions need an auxiliary before the subject. Use DO/DOES for Present Simple, DID for Past Simple, HAVE/HAS for Present Perfect, and BE for continuous forms.',
      affirmative:'You work at the airport. / She handled the complaint. / You have worked in aviation.',
      negative:'You do not work here. / She did not handle that case. / You have not worked on this route.',
      question:'Do you work here? / Did she handle the complaint? / Have you worked in aviation? / Are you waiting for assistance?',
      keywords:'how long, how often, when, where, why, what, which + correct auxiliary.',
      traps:['After DID, use the base verb: Did you work? not Did you worked?','Do not translate French word order directly: “You work where?” is not the normal neutral question form.'],
      model:'How long have you worked in aviation, and what did you learn from your previous role?'
    },
    'Articles': {
      rule:'Use A/AN for one non-specific countable noun or a profession; THE for something specific/identified; use no article for general plural or uncountable ideas.',
      affirmative:'I am a qualified cabin crew member. / Please go to the gate on your boarding pass. / Safety is our priority.',
      negative:'I am not a supervisor. / This is not the gate on your boarding pass. / Safety is not optional.',
      question:'Are you a cabin crew member? / Is this the correct gate? / Is safety your first priority?',
      keywords:'a/an = one, first mention, profession · the = specific, known, already identified · Ø = general idea/plural/uncountable.',
      traps:['Choose A or AN by sound, not spelling: an experienced agent; a university.','Professions normally need an article: I am an agent, not I am agent.'],
      model:'I am a qualified cabin crew member, and I always check the information before I give a passenger an answer.'
    },
    'Prepositions': {
      rule:'Prepositions show place, time and relationships. Learn them in chunks rather than translating them word for word.',
      affirmative:'I work at the airport. / The passenger is in the terminal. / The bag is on the aircraft.',
      negative:'I am not at Gate 12. / The passenger is not in the boarding area. / The bag is not on the aircraft.',
      question:'Are you at the gate? / Is the passenger in the terminal? / Is the bag on the aircraft?',
      keywords:'AT = point/place (at the airport, at Gate 12) · IN = inside/area (in the terminal) · ON = transport/surface (on the aircraft).',
      traps:['Say on the plane / on the aircraft, but in the car.','Many verb + preposition combinations must be learned together: apologise for, explain to, responsible for.'],
      model:'I was at the airport when I learned that the passenger’s bag was still on the aircraft.'
    },
    'Countable / uncountable & quantifiers': {
      rule:'Countable nouns can be counted individually; uncountable nouns normally cannot. Choose the quantifier to match the noun and the meaning.',
      affirmative:'There are many passengers. / We have a little time. / There is some information available.',
      negative:'There are not many seats left. / We do not have much time. / There is not any confirmed information yet.',
      question:'How many passengers are waiting? / How much time do we have? / Is there any new information?',
      keywords:'many/few/a few + countable plural · much/little/a little + uncountable · some usually affirmative · any often negative/question.',
      traps:['Information, advice, luggage and baggage are normally uncountable in standard English.','A few = some, positive; few = almost none. A little = some; little = almost none.'],
      model:'There are many passengers waiting, but we only have a little confirmed information at the moment.'
    },
    'Comparatives & superlatives': {
      rule:'Use comparatives to compare two things and superlatives to identify the highest/lowest within a group.',
      affirmative:'This option is quicker. / This is the safest solution.',
      negative:'This route is not faster than the other one. / This is not the most practical option.',
      question:'Is this connection shorter? / Which option is the safest?',
      keywords:'than with comparatives · the with superlatives · much/far/a little + comparative for degree.',
      traps:['Short adjectives: fast → faster → fastest. Longer adjectives: practical → more practical → most practical.','Irregular: good → better → best; bad → worse → worst.'],
      model:'The direct route is faster, but the later connection may be the safest option for a passenger requiring assistance.'
    },
    'Conditionals': {
      rule:'Use the first conditional for a real possible future result. Use the second conditional for hypothetical or less likely situations, including interview scenarios.',
      affirmative:'If the flight is delayed, we will update the passengers. / If I were in that situation, I would remain calm.',
      negative:'If the bag is not found, we will open a report. / If I did not know the answer, I would not invent one.',
      question:'What will you do if the passenger misses the connection? / What would you do if a passenger became aggressive?',
      keywords:'First: if + present, will + base verb. Second: if + past, would + base verb.',
      traps:['Do not normally use WILL directly after IF in the condition clause.','For formal/hypothetical advice, “If I were…” is the standard form for all persons.'],
      model:'If a passenger becomes aggressive, I will keep my voice calm; if the situation became unsafe, I would ask for support.'
    },
    'Gerund vs infinitive': {
      rule:'Some verbs/expressions are followed by -ING; others by TO + infinitive. Learn the verb pattern as a complete chunk.',
      affirmative:'I enjoy helping passengers. / I need to check the details. / I am used to working under pressure.',
      negative:'I avoid arguing with passengers. / I do not want to give incorrect information.',
      question:'Do you enjoy working with passengers? / Do you need to check the booking? / Are you used to working under pressure?',
      keywords:'enjoy/avoid/finish + -ing · want/need/plan/decide + to + verb · be used to + -ing/noun.',
      traps:['“Be used to” contains TO as a preposition, so use -ING: used to working.','“Used to + base verb” is different: I used to work there = past habit.'],
      model:'I enjoy helping passengers, I avoid arguing, and I am used to working calmly under pressure.'
    },
    'Relative clauses': {
      rule:'Relative clauses identify or describe a person/thing without starting a new sentence. Use WHO for people, WHICH for things, and THAT for people or things in many defining clauses.',
      affirmative:'The passenger who reported the bag is waiting. / The suitcase that was delayed has arrived.',
      negative:'The passenger who did not receive assistance is at the desk. / The bag that was not loaded is being traced.',
      question:'Is this the passenger who requested assistance? / Is that the bag that was missing?',
      keywords:'who = people · which = things · that = people/things in defining information · where = places.',
      traps:['Do not repeat the pronoun: “the passenger who he called” is wrong in a standard defining clause.','Use commas for extra/non-essential information; do not normally use THAT in a non-defining clause.'],
      model:'The passenger who requested wheelchair assistance is waiting near the desk that handles special services.'
    },
    'Passive voice': {
      rule:'Use the passive when the action/result is more important than the person who performs it, or when the agent is unknown/obvious.',
      affirmative:'The flight has been delayed. / The bag will be transferred. / The passenger was informed.',
      negative:'The bag has not been located yet. / The passenger was not informed in time.',
      question:'Has the bag been located? / Was the passenger informed? / Will the baggage be transferred automatically?',
      keywords:'BE in the correct tense + past participle: is delayed, was delayed, has been delayed, will be delayed.',
      traps:['Keep the tense on BE; the main verb stays in the past participle.','Use BY only when the agent matters: The passenger was assisted by the ground team.'],
      model:'The flight has been delayed, but all affected passengers have been informed and the connections are being checked.'
    },
    'French interference & natural English': {
      rule:'Do not translate individual French words. Learn the natural English verb + noun or verb + preposition combination as one professional chunk.',
      affirmative:'I handle difficult situations. / I have an interview tomorrow. / I agree. / I’ll explain the procedure to you.',
      negative:'I do not make literal translations when a natural chunk exists. / I do not give information before I check it.',
      question:'How do you handle difficult situations? / Could you explain the procedure to me?',
      keywords:'handle a situation · have an interview · agree · check information · find a solution · explain something to someone · make sure.',
      traps:['gérer ≠ always manage; contrôler ≠ always control; passer un entretien ≠ pass an interview.','When a phrase sounds “French in English words”, stop and search for the complete English chunk.'],
      model:'I handle difficult situations by checking the facts first, explaining the options clearly and making sure the passenger understands the next step.'
    }
  };

  // ---------- B2 Grammar Test Lab ----------
  let grammarLabMode=appState.grammarLabMode||'practice';
  const flatGrammarLab=grammarLabCategories.flatMap((cat,categoryIndex)=>cat.questions.map((q,questionIndex)=>({...q,category:cat.name,categoryIndex,questionIndex})));
  const grammarLabKey=(ci,qi)=>`glab-${ci}-${qi}`;
  function renderGrammarLab(){
    const c=$('#grammarLab');if(!c)return;
    const esc=s=>String(s||'').replace(/[&<>]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]));
    c.innerHTML=grammarLabCategories.map((cat,ci)=>{const g=grammarGuides[cat.name]||{};return `<details class="grammar-category" data-category="${ci}" ${ci===0?'open':''}><summary class="grammar-category-head"><div><span class="category-number">${String(ci+1).padStart(2,'0')}</span><div><span class="module-label">GRAMMAR MODULE</span><h4>${cat.name}</h4></div></div><span class="category-live-score" id="glabLive-${ci}">— / 3</span></summary><div class="grammar-module-body"><div class="grammar-teach"><div class="rule-core"><span>MAIN RULE</span><p>${esc(g.rule)}</p></div><div class="grammar-form-table"><div class="form-row form-head"><b>FORM</b><b>MODEL</b></div><div class="form-row"><span>AFFIRMATIVE</span><p>${esc(g.affirmative)}</p></div><div class="form-row"><span>NEGATIVE</span><p>${esc(g.negative)}</p></div><div class="form-row"><span>INTERROGATIVE</span><p>${esc(g.question)}</p></div></div><div class="grammar-support-grid"><article class="keywords-card"><span>KEY WORDS / SIGNALS</span><p>${esc(g.keywords)}</p></article><article class="traps-card"><span>EXCEPTIONS & TRAPS</span><ul>${(g.traps||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article><article class="aviation-model-card"><span>AVIATION MODEL</span><p>${esc(g.model)}</p><button class="audio-btn" type="button" data-speak="${esc(g.model).replace(/&quot;/g,'&quot;')}">🔊 Listen</button></article></div><div class="practice-bridge"><span>NOW PRACTISE</span><p>Answer the three questions below. You get immediate feedback. If an answer is wrong, the hint opens automatically so you can correct yourself.</p></div></div><div class="quiz-stack grammar-category-questions">${cat.questions.map((item,qi)=>`<div class="quiz-item grammar-lab-item" data-glab="${ci}-${qi}"><div class="quiz-q">${qi+1}. ${item.q}</div><div class="quiz-options">${item.options.map((o,oi)=>`<button class="quiz-option" type="button" data-opt="${oi}">${o}</button>`).join('')}</div><div class="quiz-feedback">Choose an answer.</div><button class="hint-btn grammar-lab-hint" type="button">💡 Hint</button><div class="hint-text">${item.hint}</div></div>`).join('')}</div></div></details>`}).join('');
    $$('.grammar-lab-item',c).forEach(el=>{const [ci,qi]=el.dataset.glab.split('-').map(Number);const item=grammarLabCategories[ci].questions[qi];const key=grammarLabKey(ci,qi);const saved=appState[key];if(Number.isInteger(saved))revealGrammarFeedback(el,item,saved,true);$$('.quiz-option',el).forEach(btn=>btn.addEventListener('click',()=>{const choice=Number(btn.dataset.opt);appState[key]=choice;saveState();revealGrammarFeedback(el,item,choice,false);updateGrammarLiveScores();}));$('.grammar-lab-hint',el)?.addEventListener('click',()=>$('.hint-text',el)?.classList.toggle('show'));});
    applyGrammarLabMode();updateGrammarLiveScores();
  }
  function revealGrammarFeedback(el,item,choice,silent=false){
    $$('.quiz-option',el).forEach((b,j)=>b.classList.toggle('selected',j===choice));const ok=choice===item.answer;el.classList.remove('correct','incorrect');el.classList.add(ok?'correct':'incorrect');$('.quiz-feedback',el).innerHTML=ok?`<strong>✓ Correct.</strong> ${item.explain}`:`<strong>✕ Not yet.</strong> ${item.explain}`;if(!ok)$('.hint-text',el)?.classList.add('show');if(!silent)toast(ok?'Correct — B2 precision.':'Not yet — read the hint and correct it.');
  }
  function applyGrammarLabMode(){const guided=grammarLabMode==='practice';$('#grammarPracticeBtn')?.classList.toggle('active',guided);$('#grammarTestBtn')?.classList.toggle('active',!guided);$('#grammar-lab')?.classList.toggle('grammar-test-mode',!guided);if($('#grammarLabStatus'))$('#grammarLabStatus').textContent=guided?'Guided: immediate feedback + live category score.':'Quick Test: immediate feedback stays on; category score is discreet until submit.';updateGrammarLiveScores();}
  function updateGrammarLiveScores(){grammarLabCategories.forEach((cat,ci)=>{let answered=0,correct=0;cat.questions.forEach((q,qi)=>{const v=appState[grammarLabKey(ci,qi)];if(Number.isInteger(v)){answered++;if(v===q.answer)correct++;}});const el=$(`#glabLive-${ci}`);if(el)el.textContent=grammarLabMode==='practice'?`${correct} / 3`:`${answered} / 3 answered`;});}
  function grammarLabScores(){return grammarLabCategories.map((cat,ci)=>{let correct=0,answered=0;cat.questions.forEach((q,qi)=>{const v=appState[grammarLabKey(ci,qi)];if(Number.isInteger(v)){answered++;if(v===q.answer)correct++;}});return{name:cat.name,correct,answered,total:cat.questions.length};});}
  function showGrammarResults(){const scores=grammarLabScores(),totalCorrect=scores.reduce((s,x)=>s+x.correct,0),totalAnswered=scores.reduce((s,x)=>s+x.answered,0);const result=$('#grammarLabResults');if(!result)return;result.hidden=false;$('#grammarTotalScore').textContent=`${totalCorrect} / ${flatGrammarLab.length}`;const pct=Math.round(totalCorrect/flatGrammarLab.length*100);$('#grammarResultMessage').textContent=totalAnswered<flatGrammarLab.length?`You answered ${totalAnswered}/${flatGrammarLab.length}. Complete the remaining questions for a full diagnostic.`:pct>=85?'Strong B2 grammar profile. Focus only on the categories below 3/3.':pct>=70?'Good B1+/B2 pathway. Review the categories marked as priorities before the recruitment test.':'Excellent diagnostic value: work category by category, then retest.';$('#grammarCategoryScores').innerHTML=scores.map(s=>{const cls=s.correct===3?'score-strong':s.correct===2?'score-watch':'score-priority';return`<div class="category-score ${cls}"><span>${s.name}</span><strong>${s.correct}/${s.total}</strong><small>${s.answered}/${s.total} answered</small></div>`}).join('');appState.grammarLabSubmitted=true;saveState();result.scrollIntoView({behavior:'smooth',block:'nearest'});}
  $('#grammarPracticeBtn')?.addEventListener('click',()=>{grammarLabMode='practice';appState.grammarLabMode=grammarLabMode;saveState();applyGrammarLabMode();});$('#grammarTestBtn')?.addEventListener('click',()=>{grammarLabMode='test';appState.grammarLabMode=grammarLabMode;saveState();applyGrammarLabMode();});$('#submitGrammarTestBtn')?.addEventListener('click',showGrammarResults);$('#resetGrammarLabBtn')?.addEventListener('click',()=>{if(confirm('Reset all 45 grammar answers?')){grammarLabCategories.forEach((cat,ci)=>cat.questions.forEach((q,qi)=>delete appState[grammarLabKey(ci,qi)]));delete appState.grammarLabSubmitted;saveState();$('#grammarLabResults').hidden=true;renderGrammarLab();toast('Grammar lab reset.');}});renderGrammarLab();if(appState.grammarLabSubmitted)showGrammarResults();

  // ---------- Vocabulary + dialect ----------
  const vacc=$('#vocabAccordion');if(vacc){vacc.innerHTML=vocab.map(cat=>`<div class="accordion-item"><button class="accordion-head" type="button"><span>${cat.icon} ${cat.title}</span><span>＋</span></button><div class="accordion-body">${cat.rows.map(r=>`<div class="vocab-row"><div class="vocab-term">${r[0]}</div><div class="vocab-fr">${r[1]}</div><div class="vocab-example">${r[2]}</div><button class="audio-btn" type="button" data-speak="${r[0].replace(/"/g,'&quot;')}. ${r[2].replace(/"/g,'&quot;')}">🔊</button></div>`).join('')}</div></div>`).join('');$$('.accordion-head',vacc).forEach(b=>b.addEventListener('click',()=>{const item=b.closest('.accordion-item');item.classList.toggle('open');b.lastElementChild.textContent=item.classList.contains('open')?'−':'＋';}));}
  const dtable=$('#dialectTable');if(dtable)dtable.innerHTML=`<div class="dialect-row head"><div>🇬🇧 UK</div><div>🇺🇸 US</div><div>Meaning</div></div>`+dialectRows.map(r=>`<div class="dialect-row"><div>${r[0]}</div><div>${r[1]}</div><div>${r[2]}</div></div>`).join('');

  // ---------- Audio ----------
  function speak(text,lang='en-GB'){if(!text)return;if(!('speechSynthesis'in window)){toast('Audio is not supported in this browser.');return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=.93;const voices=speechSynthesis.getVoices();const v=voices.find(x=>x.lang?.toLowerCase().startsWith(lang.toLowerCase()))||voices.find(x=>x.lang?.toLowerCase().startsWith(lang.slice(0,2).toLowerCase()));if(v)u.voice=v;speechSynthesis.speak(u);}
  document.addEventListener('click',e=>{const b=e.target.closest('[data-speak]');if(b)speak(b.dataset.speak,b.dataset.lang||'en-GB');});

  // ---------- Smart builders ----------
  const builderSets={
    control:{clear:{labels:['Acknowledge','Clarify','Explain','Offer','Check'],parts:[['I understand your concern.','I can see why this is frustrating.'],['Let me check exactly what happened.','Can I confirm a few details first?'],['Here is what I can confirm at the moment.','The information I have right now is this.'],['What I can do is check the available options.','Let me see what I can arrange for you.'],['Would that work for you?','Does that answer your question?']]},stretch:{labels:['Acknowledge','Clarify','Explain','Offer','Check'],parts:[['I completely understand why you’re concerned.','I can appreciate why this situation is frustrating.'],['Before I advise you, let me make sure I have the full picture.','Let me confirm a couple of details so I can give you accurate information.'],['Based on the information currently available, this is what I can confirm.','At this stage, the confirmed information is as follows.'],['What I can do immediately is look at the available alternatives and identify the quickest solution.','Let me talk you through the options so we can decide on the most practical next step.'],['Would that solution work for you, or is there anything else I should take into account?','Does that clarify the situation, or would you like me to explain any part in more detail?']]}},
    baggage:{clear:{labels:['Acknowledge','Check','Explain','Offer','Close'],parts:[['I understand why you’re frustrated.','I can see why this is frustrating.'],['Let me check the baggage allowance on your booking first.','Let me confirm the permitted cabin size for your ticket.'],['Your bag is above the permitted cabin dimensions, so it cannot travel in the overhead locker.','The bag exceeds the cabin size limit, so it needs a different handling option.'],['What I can do is explain the available options and help you find the quickest solution.','I can show you the available options and help you choose the most practical one.'],['Let’s see which option works best for you.','Would you like me to explain the options now?']]},stretch:{labels:['Acknowledge','Check','Explain','Offer','Close'],parts:[['I completely understand why this feels frustrating, especially if you were not expecting an extra charge.','I can appreciate why you’re upset if this requirement was not clear beforehand.'],['Let me check your booking and the baggage allowance before we decide on the next step.','I’d like to verify the allowance on your booking first so I can give you accurate information.'],['The bag exceeds the permitted cabin dimensions, so unfortunately it cannot be accepted in the overhead compartment.','Based on the dimensions, the bag is outside the cabin allowance and will need to be handled differently.'],['I’ll talk you through the available options so we can resolve this as smoothly as possible.','Let me explain the alternatives and see which one will cause the least disruption for you.'],['We’ll take this one step at a time.','Once we choose the option, I’ll explain exactly what happens next.']]}},
    assistance:{clear:{labels:['Reassure','Check connection','Check assistance','Set expectation','Next step'],parts:[['I understand this is stressful.','I understand why you’re concerned.'],['Let me first check your connection time.','I’ll check the latest arrival and connection information.'],['I’ll also confirm the wheelchair assistance for your mother.','Let me make sure the assistance request is correctly booked.'],['I can’t guarantee the connection yet, but I can give you the latest confirmed information.','I don’t want to promise anything before I have checked the details.'],['Then I can explain the next steps and coordinate with the ground team if needed.','Once I have the information, I’ll tell you the best next step.']]},stretch:{labels:['Reassure','Check connection','Check assistance','Set expectation','Next step'],parts:[['I completely understand why you’re concerned, especially with a short connection and an assistance request.','I can appreciate that this is a stressful situation for both you and your mother.'],['Let me check the latest arrival information and the time available for your onward connection.','I’ll first verify the arrival gate, terminal and connection window.'],['At the same time, I’ll make sure the wheelchair assistance is correctly arranged and visible to the ground team.','I’ll also confirm that the special-assistance request is active for the connection.'],['I don’t want to give you a guarantee until I have confirmed information, but I can give you a realistic picture of the options.','I can’t promise the connection at this stage, but I can make sure you have accurate information and the right support in place.'],['If necessary, I’ll coordinate the next step with the ground team so you know exactly what to do on arrival.','Once everything is confirmed, I’ll talk you through the plan and make sure you know where to go.']]}},
    gate:{clear:{labels:['Gate change','Delay','Assistance'],parts:[['Your gate has changed from 42 to 18.','You now need to go to Gate 18 instead of Gate 42.'],['Boarding will start about 20 minutes later than planned.','Boarding has been delayed by around 20 minutes.'],['If you need assistance, please stay near the information desk.','Passengers requiring assistance should remain close to the information desk.']]},stretch:{labels:['Gate change','Delay','Assistance'],parts:[['There has been a gate change, so you’ll now need to go to Gate 18 instead of Gate 42.','Please note that your departure gate has been changed from Gate 42 to Gate 18.'],['Boarding is expected to begin around 20 minutes later than originally planned.','Boarding will take place approximately 20 minutes later than the original schedule.'],['If you require assistance, please remain close to the information desk so the team can support you.','Anyone requiring special assistance should stay near the information desk until boarding begins.']]}},
    medication:{clear:{labels:['Situation','Confirmed facts','Action taken','Request'],parts:[['A passenger needs urgent assistance because essential medication is inside a delayed suitcase.'],['I have confirmed the baggage reference, but the bag has not yet been located.'],['I have checked the latest tracing status.'],['Could you please contact baggage services and confirm the fastest possible next step?']]},stretch:{labels:['Situation','Confirmed facts','Action taken','Request'],parts:[['A passenger requires urgent support because essential medication is packed inside a delayed suitcase.'],['The baggage reference has been confirmed, but there is still no confirmed location for the suitcase.'],['I have already reviewed the latest tracing information and explained the current situation to the passenger.'],['Could you please liaise with baggage services urgently and advise us of the quickest available solution so we can update the passenger promptly?']]}},
    writing:{clear:{labels:['Opening','Problem','Request','Deadline','Close'],parts:[['Hi Alex,'],['A passenger’s suitcase was sent to the wrong airport this morning.'],['Could you please check the current tracing status and confirm whether the bag has been located?'],['The passenger needs an update before 18:00.'],['Please contact the passenger as soon as you have confirmed information. Thanks.']]},stretch:{labels:['Opening','Problem','Request','Deadline','Close'],parts:[['Hi Alex,'],['A passenger’s suitcase was mistakenly routed to the wrong airport this morning.'],['Could you please check the latest tracing status and confirm the expected recovery arrangements?'],['The passenger is waiting for an update and needs to be contacted before 18:00.'],['Once you have confirmed information, please update the passenger directly and let me know the expected delivery arrangements. Many thanks.']]}}
  };


  // ---------- Professional introduction builder ----------
  function naturalList(items){
    if(items.length===0)return '';
    if(items.length===1)return items[0];
    if(items.length===2)return `${items[0]} and ${items[1]}`;
    return `${items.slice(0,-1).join(', ')}, and ${items[items.length-1]}`;
  }
  function initIntroBuilder(){
    const box=$('#introBuilder');if(!box)return;
    const name=$('#introName'),background=$('#introBackground'),qualification=$('#introQualification'),goal=$('#introGoal'),strength=$('#introStrength'),value=$('#introValue'),out=$('#introBuilderOutput'),status=$('#introBuilderStatus');
    let level=appState.introLevel||'clear';
    const taskInputs=$$('#introTasks input[type="checkbox"]');
    const defaults=['baggage issues','special-assistance requests','passenger complaints and conflict situations','stressful and emergency situations'];
    const strengthText={
      clear:{calm:'I am comfortable staying calm and solution-focused under pressure.',conflict:'I am comfortable de-escalating conflict while remaining professional.',clarity:'I am confident explaining information clearly to passengers who are stressed.',adapt:'I can adapt quickly to different passengers and situations.'},
      stretch:{calm:'That experience has taught me to remain calm under pressure and focus quickly on practical solutions.',conflict:'One of my strengths is de-escalating conflict while maintaining a calm and professional approach.',clarity:'I have learned how important it is to turn complex information into clear, reassuring explanations for passengers.',adapt:'My experience has made me highly adaptable when priorities, passengers or operational conditions change unexpectedly.'}
    };
    const goalText={
      clear:{airport:'I am now working towards a secure B2 level so I can work confidently in an international airport environment.',recruitment:'My current goal is to strengthen my English so I can succeed in recruitment tests and interviews.',precision:'I want my English to be as precise and professional as the work I already know how to do.',lilate:'I am working towards a secure B2 level and preparing for the LILATE certification.'},
      stretch:{airport:'My objective now is to reach a secure B2 level so I can operate confidently in a fully international airport environment.',recruitment:'I am now refining my English so I can demonstrate my professional experience accurately and confidently throughout the recruitment process.',precision:'My priority is to make my English reflect the same level of precision, control and professionalism as my aviation experience.',lilate:'My immediate objective is to secure B2-level performance and prepare strategically for the LILATE certification.'}
    };
    const valueText={
      clear:{people:'What I enjoy most is helping people feel supported when travel becomes stressful.',international:'I also enjoy working with people and cultures from around the world.',responsibility:'I value the combination of responsibility, service and teamwork in aviation.',solutions:'I particularly enjoy turning difficult situations into practical solutions.'},
      stretch:{people:'What motivates me most is being able to make a difficult journey feel more manageable for the passenger.',international:'The international dimension of aviation is especially motivating to me because I enjoy communicating across cultures.',responsibility:'I am particularly drawn to roles that combine responsibility, passenger service and close teamwork.',solutions:'I find it rewarding when calm communication can turn a difficult situation into a clear and workable solution.'}
    };
    function selectedTasks(){return taskInputs.filter(i=>i.checked).map(i=>i.value);}
    function qualificationSentence(){return qualification.value==='qualification'?'I also hold a cabin crew qualification.':'I am also a qualified cabin crew member.';}
    function build(){
      const tasks=selectedTasks();
      const nm=(name.value||'Mounia').trim();
      let text='';
      if(level==='clear'){
        text=`Hello, my name is ${nm}. I have experience in aviation, particularly in ${background.value}. ${qualificationSentence()} `;
        if(tasks.length) text+=`In my previous roles, I have handled ${naturalList(tasks)}. `;
        text+=`${strengthText.clear[strength.value]} ${goalText.clear[goal.value]} ${valueText.clear[value.value]}`;
      }else{
        text=`I’m ${nm}, and my professional background is firmly rooted in aviation, particularly in ${background.value}. ${qualificationSentence()} `;
        if(tasks.length) text+=`Over the course of my airport experience, I have handled ${naturalList(tasks)}. These experiences have strengthened my ability to communicate clearly and respond calmly when situations become demanding. `;
        text+=`${strengthText.stretch[strength.value]} ${goalText.stretch[goal.value]} ${valueText.stretch[value.value]}`;
      }
      out.textContent=text.replace(/\s+/g,' ').trim();
      $('#introTaskCount').textContent=`${tasks.length} selected`;
      status.textContent=tasks.length>=2?`✓ Strong profile: ${tasks.length} real tasks selected. Practise it aloud, then personalise the wording.`:'Choose at least two tasks for a strong professional introduction.';
      status.classList.toggle('ready',tasks.length>=2);
      appState.introLevel=level;appState.introProfile={name:nm,background:background.value,qualification:qualification.value,goal:goal.value,strength:strength.value,value:value.value,tasks};saveState();
      $$('.intro-level-btn',box).forEach(b=>b.classList.toggle('active',b.dataset.level===level));
    }
    const saved=appState.introProfile;
    if(saved){name.value=saved.name||'Mounia';background.value=saved.background||background.value;qualification.value=saved.qualification||qualification.value;goal.value=saved.goal||goal.value;strength.value=saved.strength||strength.value;value.value=saved.value||value.value;taskInputs.forEach(i=>i.checked=(saved.tasks||[]).includes(i.value));}
    else taskInputs.forEach(i=>i.checked=defaults.includes(i.value));
    [name,background,qualification,goal,strength,value,...taskInputs].forEach(el=>el.addEventListener(el.matches('input[type="text"]')?'input':'change',build));
    $$('.intro-level-btn',box).forEach(b=>b.addEventListener('click',()=>{level=b.dataset.level;build();}));
    $('#introListenBtn')?.addEventListener('click',()=>speak(out.textContent));
    $('#introCopyBtn')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(out.textContent);toast('Introduction copied.');}catch{toast('Copy is not available in this browser.');}});
    $('#introResetBtn')?.addEventListener('click',()=>{name.value='Mounia';background.selectedIndex=0;qualification.selectedIndex=0;goal.selectedIndex=0;strength.selectedIndex=0;value.selectedIndex=0;taskInputs.forEach(i=>i.checked=defaults.includes(i.value));level='clear';build();toast('Introduction builder reset.');});
    build();
  }
  initIntroBuilder();

  function initBuilders(){
    $$('.smart-builder').forEach((box,idx)=>{const name=box.dataset.builder,data=builderSets[name];if(!data)return;box.dataset.instance=idx;const controls=$('.builder-controls',box),out=$('.builder-output',box);let saved=appState.builders?.[name]||{level:'clear',values:[]};let level=saved.level||'clear';
      function populate(keep=true){const conf=data[level];controls.innerHTML=conf.labels.map((label,i)=>`<label>${label}<select class="builder-select" data-part="${i}"><option value="">Choose…</option>${conf.parts[i].map((v,j)=>`<option value="${j}">${v}</option>`).join('')}</select></label>`).join('');$$('.builder-level-btn',box).forEach(b=>b.classList.toggle('active',b.dataset.level===level));$$('.builder-select',box).forEach((s,i)=>{if(keep&&saved.level===level&&saved.values?.[i]!==undefined)s.value=saved.values[i];s.addEventListener('change',update);});update(false);}
      function update(store=true){const conf=data[level],vals=$$('.builder-select',box).map(s=>s.value),parts=vals.map((v,i)=>v===''?'':conf.parts[i][Number(v)]).filter(Boolean);let text=parts.join(' ');if(name==='writing'||name==='medication')text=parts.join('\n\n');out.textContent=text||'Choose one option in each step to build your response.';if(store){appState.builders=appState.builders||{};appState.builders[name]={level,values:vals};saveState();saved=appState.builders[name];}}
      $$('.builder-level-btn',box).forEach(b=>b.addEventListener('click',()=>{level=b.dataset.level;saved={level,values:[]};populate(false);update(true);}));$('.builder-clear',box)?.addEventListener('click',()=>{$$('.builder-select',box).forEach(s=>s.value='');update(true);});$('.builder-listen',box)?.addEventListener('click',()=>speak(out.textContent));$('.builder-copy',box)?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(out.textContent);toast('Builder text copied.');}catch{toast('Copy is not available in this browser.');}});populate(true);
    });
  }
  initBuilders();

  // ---------- Model tabs ----------
  $$('.model-tab').forEach(tab=>tab.addEventListener('click',()=>{const wrap=tab.closest('.model-switcher');$$('.model-tab',wrap).forEach(x=>x.classList.remove('active'));$$('.model-content',wrap).forEach(x=>x.classList.remove('active'));tab.classList.add('active');$('#'+tab.dataset.target)?.classList.add('active');}));

  // ---------- Timers ----------
  $$('.timer-widget').forEach(widget=>{const initial=Number(widget.dataset.timer||60);let remaining=initial,interval=null;const display=$('.timer-value',widget);const fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;display.textContent=fmt(remaining);$('.timer-start',widget)?.addEventListener('click',()=>{if(interval)return;interval=setInterval(()=>{remaining--;display.textContent=fmt(Math.max(remaining,0));if(remaining<=0){clearInterval(interval);interval=null;toast('Time — finish your sentence and stop.');}},1000);});$('.timer-reset',widget)?.addEventListener('click',()=>{clearInterval(interval);interval=null;remaining=initial;display.textContent=fmt(remaining);});});

  // ---------- Recording ----------
  $$('.recorder').forEach(rec=>{let mediaRecorder=null,chunks=[],stream=null;const rbtn=$('.record-btn',rec),sbtn=$('.stop-btn',rec),status=$('.record-status',rec),audio=$('.record-playback',rec);rbtn?.addEventListener('click',async()=>{try{stream=await navigator.mediaDevices.getUserMedia({audio:true});mediaRecorder=new MediaRecorder(stream);chunks=[];mediaRecorder.ondataavailable=e=>chunks.push(e.data);mediaRecorder.onstop=()=>{const blob=new Blob(chunks,{type:mediaRecorder.mimeType||'audio/webm'});audio.src=URL.createObjectURL(blob);audio.hidden=false;stream.getTracks().forEach(t=>t.stop());status.textContent='Recording saved in this page';};mediaRecorder.start();rec.classList.add('recording');status.textContent='Recording…';rbtn.disabled=true;sbtn.disabled=false;}catch(e){status.textContent='Microphone unavailable';toast('Microphone access was not available.');}});sbtn?.addEventListener('click',()=>{if(mediaRecorder&&mediaRecorder.state!=='inactive')mediaRecorder.stop();rec.classList.remove('recording');rbtn.disabled=false;sbtn.disabled=true;});});

  // ---------- Save fields ----------
  $$('.save-field').forEach(el=>{if(appState.fields?.[el.id]!==undefined)el.value=appState.fields[el.id];el.addEventListener('input',()=>{appState.fields=appState.fields||{};appState.fields[el.id]=el.value;saveState();updateWordCounts();});});
  const countWords=v=>v.trim()?v.trim().split(/\s+/).length:0;function updateWordCounts(){if($('#lilateWriting'))$('#lilateWordCount').textContent=countWords($('#lilateWriting').value);if($('#writingTask'))$('#writingWordCount').textContent=countWords($('#writingTask').value);}updateWordCounts();

  // ---------- Open-answer checks ----------
  $$('.check-open-answer').forEach(btn=>btn.addEventListener('click',()=>{const value=$('#'+btn.dataset.target).value.toLowerCase(),keys=btn.dataset.keywords.split(',').map(x=>x.trim().toLowerCase()),hits=keys.filter(k=>value.includes(k));const fb=$('#'+btn.dataset.target+'Feedback');const ok=hits.length>=3;fb.innerHTML=ok?`<strong>✓ Good capture.</strong> You included ${hits.length}/${keys.length} essential points.`:`<strong>Not complete yet.</strong> You included ${hits.length}/${keys.length}. <br><b>Hint:</b> listen for destination, delay length, passenger instruction and next update time.`;fb.style.color=ok?'var(--good)':'var(--warn)';}));

  // ---------- Mode ----------
  function setMode(mode){appState.mode=mode;saveState();document.body.classList.toggle('exam-mode',mode==='exam');$('#practiceModeBtn')?.classList.toggle('active',mode==='practice');$('#examModeBtn')?.classList.toggle('active',mode==='exam');if($('#modeHelp'))$('#modeHelp').textContent=mode==='practice'?'Practice mode keeps models visible.':'Challenge mode hides models, but feedback and hints stay available.';}
  $('#practiceModeBtn')?.addEventListener('click',()=>setMode('practice'));$('#examModeBtn')?.addEventListener('click',()=>setMode('exam'));setMode(appState.mode||'practice');
  function setTranscripts(show){appState.transcripts=show;saveState();document.body.classList.toggle('show-transcripts',show);if($('#transcriptToggleBtn'))$('#transcriptToggleBtn').textContent=`Transcripts: ${show?'on':'off'}`;}$('#transcriptToggleBtn')?.addEventListener('click',()=>setTranscripts(!document.body.classList.contains('show-transcripts')));setTranscripts(Boolean(appState.transcripts));

  // ---------- Progress ----------
  const sections=$$('[data-progress-section]');function updateProgress(){const done=sections.filter(s=>appState.completed?.includes(s.id)).length,pct=Math.round(done/sections.length*100);if($('#progressPercent'))$('#progressPercent').textContent=pct+'%';if($('#progressBar'))$('#progressBar').style.width=pct+'%';sections.forEach(s=>{const b=$('.complete-btn',s);if(!b)return;const yes=appState.completed?.includes(s.id);b.classList.toggle('done',yes);b.textContent=yes?'✓ Section complete':'Mark section complete';});}$$('.complete-btn').forEach(btn=>btn.addEventListener('click',()=>{const s=btn.closest('[data-progress-section]');appState.completed=appState.completed||[];if(!appState.completed.includes(s.id))appState.completed.push(s.id);saveState();updateProgress();toast('Section complete.');}));updateProgress();

  // ---------- Admin ----------
  $('#copyAdminLineBtn')?.addEventListener('click',async()=>{const gs=grammarLabScores(),gtotal=gs.reduce((s,x)=>s+x.correct,0),priorities=gs.filter(x=>x.answered===x.total&&x.correct<2).map(x=>x.name).join(', ')||'none confirmed yet';const line=`Connect Learning | COURCELLE Mounia | Lesson 1 – World Ready | Grammar diagnostic: ${gtotal}/${flatGrammarLab.length} | Grammar priorities: ${priorities} | Focus: ${$('#adminFocus').value.replace(/\n/g,' ')} | Strengths: ${$('#adminStrengths').value.replace(/\n/g,' ')} | Errors/Priorities: ${$('#adminErrors').value.replace(/\n/g,' ')} | Next: ${$('#adminNext').value.replace(/\n/g,' ')}`;try{await navigator.clipboard.writeText(line);$('#adminCopyFeedback').textContent='Copied.';toast('Tracking line copied.');}catch{$('#adminCopyFeedback').textContent=line;}});

  // ---------- Download ----------
  $('#downloadResultsBtn')?.addEventListener('click',()=>{const score=(prefix,data)=>data.map((x,i)=>appState[`${prefix}-${i}`]===x.answer?1:0).reduce((a,b)=>a+b,0),builderText=name=>appState.builders?.[name]?document.querySelector(`[data-builder="${name}"] .builder-output`)?.textContent||'':'';const lines=['Mounia — World Ready | Lesson 1 Results','',`Date: ${new Date().toLocaleDateString()}`,`Progress: ${$('#progressPercent')?.textContent||'0%'}`,`Stop translating: ${score('trans',translationQuestions)}/${translationQuestions.length}`,`B2 grammar diagnostic: ${grammarLabScores().reduce((s,x)=>s+x.correct,0)}/${flatGrammarLab.length}`,...grammarLabScores().map(x=>`  - ${x.name}: ${x.correct}/${x.total}`),`Baggage quiz: ${score('bagQuiz',baggageQuestions)}/${baggageQuestions.length}`,`Assistance quiz: ${score('assist',assistanceQuestions)}/${assistanceQuestions.length}`,'',`Introduction builder: ${builderText('intro')}`,`Baggage builder: ${builderText('baggage')}`,`Assistance builder: ${builderText('assistance')}`,`Baseline notes: ${$('#baselineNotes')?.value||''}`,`Baggage response: ${$('#baggageResponse')?.value||''}`,`Assistance response: ${$('#assistanceResponse')?.value||''}`,`LILATE listening notes: ${$('#listenWrite')?.value||''}`,`LILATE writing: ${$('#lilateWriting')?.value||''}`,`Professional writing: ${$('#writingTask')?.value||''}`,`Takeaway: ${$('#takeaway')?.value||''}`];const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Mounia_Lesson_1_World_Ready_Results.txt';a.click();URL.revokeObjectURL(a.href);});
  $('#resetLessonBtn')?.addEventListener('click',()=>{if(confirm('Reset all saved answers and progress for this lesson?')){localStorage.removeItem(stateKey);location.reload();}});
})();
