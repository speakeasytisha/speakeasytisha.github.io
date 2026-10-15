(() => {
  const stateKey = 'mounia-world-ready-lesson1-v4';
  const appState = JSON.parse(localStorage.getItem(stateKey) || '{}');
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  const toast = msg=>{const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1900)};
  const saveState=()=>{try{localStorage.setItem(stateKey,JSON.stringify(appState));}catch(e){}try{window.__wrRefresh&&window.__wrRefresh();}catch(e){}};
  const onAnswer=ok=>{try{window.__wrAnswer&&window.__wrAnswer(ok);}catch(e){}};

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
    if(!silent){toast(ok?'Correct — professional precision.':'Not yet — use the hint, then try again.');onAnswer(ok);}
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
    $$('.grammar-lab-item',c).forEach(el=>{const [ci,qi]=el.dataset.glab.split('-').map(Number);const item=grammarLabCategories[ci].questions[qi];const key=grammarLabKey(ci,qi);const saved=appState[key];if(Number.isInteger(saved))revealGrammarFeedback(el,item,saved,true);$$('.quiz-option',el).forEach(btn=>btn.addEventListener('click',()=>{const choice=Number(btn.dataset.opt);appState[key]=choice;saveState();revealGrammarFeedback(el,item,choice,false);updateGrammarLiveScores();if(grammarLabCategories[ci].questions.every((q,k)=>appState[grammarLabKey(ci,k)]===q.answer)){setTimeout(()=>{toast(`Module ${String(ci+1).padStart(2,'0')} secure — 3/3 ✈`);window.__wrConfetti&&window.__wrConfetti(70);},700);}}));$('.grammar-lab-hint',el)?.addEventListener('click',()=>$('.hint-text',el)?.classList.toggle('show'));});
    applyGrammarLabMode();updateGrammarLiveScores();
  }
  function revealGrammarFeedback(el,item,choice,silent=false){
    $$('.quiz-option',el).forEach((b,j)=>b.classList.toggle('selected',j===choice));const ok=choice===item.answer;el.classList.remove('correct','incorrect');el.classList.add(ok?'correct':'incorrect');$('.quiz-feedback',el).innerHTML=ok?`<strong>✓ Correct.</strong> ${item.explain}`:`<strong>✕ Not yet.</strong> ${item.explain}`;if(!ok)$('.hint-text',el)?.classList.add('show');if(!silent){toast(ok?'Correct — B2 precision.':'Not yet — read the hint and correct it.');onAnswer(ok);}
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
  const sections=$$('[data-progress-section]');function updateProgress(){const done=sections.filter(s=>appState.completed?.includes(s.id)).length,pct=Math.round(done/sections.length*100);if($('#progressPercent'))$('#progressPercent').textContent=pct+'%';if($('#progressBar'))$('#progressBar').style.width=pct+'%';sections.forEach(s=>{const b=$('.complete-btn',s);if(!b)return;const yes=appState.completed?.includes(s.id);b.classList.toggle('done',yes);b.textContent=yes?'✓ Section complete':'Mark section complete';});$$('.nav-list a').forEach(a=>{const id=a.getAttribute('href').slice(1);a.classList.toggle('done',Boolean(appState.completed?.includes(id)));});}$$('.complete-btn').forEach(btn=>btn.addEventListener('click',()=>{const s=btn.closest('[data-progress-section]');appState.completed=appState.completed||[];const fresh=!appState.completed.includes(s.id);if(fresh)appState.completed.push(s.id);saveState();updateProgress();toast(fresh?'Section complete — passport stamped! +50 miles':'Section already complete.');if(fresh)window.__wrConfetti&&window.__wrConfetti(60);}));updateProgress();

  // ---------- Admin ----------
  $('#copyAdminLineBtn')?.addEventListener('click',async()=>{const gs=grammarLabScores(),gtotal=gs.reduce((s,x)=>s+x.correct,0),priorities=gs.filter(x=>x.answered===x.total&&x.correct<2).map(x=>x.name).join(', ')||'none confirmed yet';const line=`Connect Learning | COURCELLE Mounia | Lesson 1 – World Ready | Grammar diagnostic: ${gtotal}/${flatGrammarLab.length} | Grammar priorities: ${priorities} | Focus: ${$('#adminFocus').value.replace(/\n/g,' ')} | Strengths: ${$('#adminStrengths').value.replace(/\n/g,' ')} | Errors/Priorities: ${$('#adminErrors').value.replace(/\n/g,' ')} | Next: ${$('#adminNext').value.replace(/\n/g,' ')}`;try{await navigator.clipboard.writeText(line);$('#adminCopyFeedback').textContent='Copied.';toast('Tracking line copied.');}catch{$('#adminCopyFeedback').textContent=line;}});

  // ---------- Download ----------
  $('#downloadResultsBtn')?.addEventListener('click',()=>{const score=(prefix,data)=>data.map((x,i)=>appState[`${prefix}-${i}`]===x.answer?1:0).reduce((a,b)=>a+b,0),builderText=name=>appState.builders?.[name]?document.querySelector(`[data-builder="${name}"] .builder-output`)?.textContent||'':'';const lines=['Mounia — World Ready | Lesson 1 Results','',`Date: ${new Date().toLocaleDateString()}`,`Progress: ${$('#progressPercent')?.textContent||'0%'}`,`Stop translating: ${score('trans',translationQuestions)}/${translationQuestions.length}`,`B2 grammar diagnostic: ${grammarLabScores().reduce((s,x)=>s+x.correct,0)}/${flatGrammarLab.length}`,...grammarLabScores().map(x=>`  - ${x.name}: ${x.correct}/${x.total}`),`Baggage quiz: ${score('bagQuiz',baggageQuestions)}/${baggageQuestions.length}`,`Assistance quiz: ${score('assist',assistanceQuestions)}/${assistanceQuestions.length}`,'',`Air miles: ${window.__wrMiles?window.__wrMiles():''}`,`Pre-flight check: ${score('warm',window.__wrWarm||[])}/3`,`Grammar arcade — Beat the clock best: ${appState.clockBest||0}`,`Grammar arcade — Spot the mistake: ${(appState.spot?.results||[]).filter(Boolean).length}/${(appState.spot?.results||[]).length} attempted`,`Live encounter best mood: ${appState.encounterBest!=null?appState.encounterBest+'%':'not played'}`,'',`Introduction builder: ${$('#introBuilderOutput')?.textContent||''}`,`Baggage builder: ${builderText('baggage')}`,`Assistance builder: ${builderText('assistance')}`,`Baseline notes: ${$('#baselineNotes')?.value||''}`,`Baggage response: ${$('#baggageResponse')?.value||''}`,`Assistance response: ${$('#assistanceResponse')?.value||''}`,`LILATE listening notes: ${$('#listenWrite')?.value||''}`,`LILATE writing: ${$('#lilateWriting')?.value||''}`,`Professional writing: ${$('#writingTask')?.value||''}`,`Takeaway: ${$('#takeaway')?.value||''}`];const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Mounia_Lesson_1_World_Ready_Results.txt';a.click();URL.revokeObjectURL(a.href);});
  $('#resetLessonBtn')?.addEventListener('click',()=>{if(confirm('Reset all saved answers and progress for this lesson?')){localStorage.removeItem(stateKey);location.reload();}});

  // ===================== V5 ENGAGEMENT LAYER =====================
  function confetti(n=60){const wrap=document.createElement('div');wrap.className='confetti-wrap';const colors=['#f2c56d','#3bd6c6','#93efe5','#ffffff','#156f86','#ff9a5a'];for(let i=0;i<n;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'vw';p.style.background=colors[i%colors.length];p.style.animationDelay=(Math.random()*.45)+'s';p.style.animationDuration=(1.6+Math.random()*1.5)+'s';wrap.appendChild(p);}document.body.appendChild(wrap);setTimeout(()=>wrap.remove(),3600);}
  window.__wrConfetti=confetti;
  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};

  // ---------- Pre-flight warm-up ----------
  const warmupQuestions=[
    {q:'Last time: « Je suis habituée à gérer le stress. »',options:['I’m used to handle stress.','I’m used to handling stress.','I have the habit to manage stress.'],answer:1,explain:'be used to + -ing — and “handle” is the natural verb.',hint:'Two chunks from last lesson: be used to + -ing, and handle.'},
    {q:'I ___ in aviation for three years, and I still love it.',options:['work','have worked','worked'],answer:1,explain:'for + duration up to now → Present Perfect.',hint:'The three years continue until today.'},
    {q:'The passenger’s bag ___ arrived yet.',options:['hasn’t','didn’t','isn’t'],answer:0,explain:'yet + negative → Present Perfect: hasn’t arrived yet.',hint:'Which auxiliary goes with “arrived yet”?'}
  ];
  window.__wrWarm=warmupQuestions;
  renderQuiz('#warmupQuiz',warmupQuestions,'warm');

  // ---------- Next stop / resume ----------
  function nextModuleIndex(){const anyAnswered=grammarLabCategories.some((c,ci)=>c.questions.some((q,qi)=>Number.isInteger(appState[grammarLabKey(ci,qi)])));if(!anyAnswered)return 3;const i=grammarLabCategories.findIndex((c,ci)=>c.questions.some((q,qi)=>!Number.isInteger(appState[grammarLabKey(ci,qi)])));return i;}
  function updateNextStop(){const i=nextModuleIndex();const nm=$('#nextStopName'),gate=$('#bpGate');if(i===-1){if(nm)nm.textContent='Grammar arcade · beat your record';if(gate)gate.textContent='★';}else{if(nm)nm.textContent=`Module ${String(i+1).padStart(2,'0')} · ${grammarLabCategories[i].name}`;if(gate)gate.textContent=String(i+1).padStart(2,'0');}}
  $('#resumeBtn')?.addEventListener('click',()=>{const i=nextModuleIndex();if(i===-1){$('#arcade')?.scrollIntoView({behavior:'smooth'});return;}const d=$(`.grammar-category[data-category="${i}"]`);if(d){$$('.grammar-category').forEach(x=>x.open=false);d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'});}});

  // ---------- Air miles, ranks, stamps, streak ----------
  const ranks=[[0,'Trainee'],[300,'Junior Crew'],[700,'Senior Crew'],[1200,'Purser'],[2000,'Captain of English']];
  function computeMiles(){let m=0;Object.keys(appState).forEach(k=>{const v=appState[k];if(!Number.isInteger(v))return;let item=null;const mm=k.match(/^(trans|bagQuiz|assist|lilateInteract|warm)-(\d+)$/);if(mm){const map={trans:translationQuestions,bagQuiz:baggageQuestions,assist:assistanceQuestions,lilateInteract:lilateInteraction,warm:warmupQuestions};item=map[mm[1]][Number(mm[2])];}const g=k.match(/^glab-(\d+)-(\d+)$/);if(g)item=grammarLabCategories[+g[1]]?.questions[+g[2]];if(item&&v===item.answer)m+=10;});m+=(appState.completed||[]).length*50;m+=(appState.clockBest||0)*10;m+=((appState.spot?.results)||[]).filter(Boolean).length*15;m+=Math.round(appState.encounterBest||0);return m;}
  window.__wrMiles=()=>computeMiles();
  const stampSections=$$('[data-progress-section]');
  function renderStamps(){const g=$('#stampGrid');if(!g)return;g.innerHTML=stampSections.map(s=>{const lab=($(`.nav-list a[href="#${s.id}"] span`)?.textContent||'✈').trim();const done=appState.completed?.includes(s.id);return `<span class="stamp ${done?'done':''}" title="${s.id}${done?' — stamped':''}">${lab}</span>`;}).join('');}
  let shownMiles=null;
  function refreshMiles(){const m=computeMiles();let ri=0;ranks.forEach((r,i)=>{if(m>=r[0])ri=i;});const el=$('#milesValue');if(el){const from=shownMiles??m;shownMiles=m;if(from===m)el.textContent=m;else{const t0=performance.now();const step=t=>{const p=Math.min(1,(t-t0)/600);el.textContent=Math.round(from+(m-from)*p);if(p<1)requestAnimationFrame(step);};requestAnimationFrame(step);}}
    if($('#rankName'))$('#rankName').textContent=ranks[ri][1];const next=ranks[ri+1];if($('#rankBar'))$('#rankBar').style.width=next?Math.round((m-ranks[ri][0])/(next[0]-ranks[ri][0])*100)+'%':'100%';if($('#rankNext'))$('#rankNext').textContent=next?`${next[0]-m} miles to ${next[1]}`:'Top rank reached ✈';
    if(appState.rankIndex!=null&&ri>appState.rankIndex){setTimeout(()=>{toast(`Promotion! You are now ${ranks[ri][1]} ✈`);confetti(110);},900);}
    if(appState.rankIndex!==ri){appState.rankIndex=ri;try{localStorage.setItem(stateKey,JSON.stringify(appState));}catch(e){}}
    renderStamps();updateNextStop();}
  window.__wrRefresh=refreshMiles;
  let streak=0;
  window.__wrAnswer=ok=>{streak=ok?streak+1:0;const v=$('#streakValue');if(v)v.textContent=streak;$('#streakPill')?.classList.toggle('hot',streak>=3);if(ok&&[3,5,10,15,20].includes(streak)){setTimeout(()=>toast(streak>=10?`🔥 ${streak} in a row — unstoppable!`:`🔥 ${streak} in a row!`),950);if(streak>=5)confetti(40);}};

  // ---------- Grammar arcade: Beat the clock ----------
  const clockBank=[
    {q:'She ___ in Dubai since 2022.',options:['has lived','lives','lived'],answer:0,explain:'since + starting point → Present Perfect.'},
    {q:'We ___ the gate five minutes ago.',options:['have closed','closed','close'],answer:1,explain:'ago = finished time → Past Simple.'},
    {q:'Has the replacement crew arrived ___?',options:['already','yet','since'],answer:1,explain:'yet in questions about something expected.'},
    {q:'I’ve ___ checked your booking — everything is fine.',options:['yet','already','ever'],answer:1,explain:'already = done, maybe sooner than expected.'},
    {q:'How long ___ you been waiting at the desk?',options:['have','did','are'],answer:0,explain:'How long + have you been waiting… (Present Perfect Continuous).'},
    {q:'I ___ to Dublin three times this year.',options:['have flown','flew','fly'],answer:0,explain:'this year is not finished → Present Perfect.'},
    {q:'Last summer I ___ on the Paris–Nice route.',options:['have worked','worked','work'],answer:1,explain:'last summer = finished time → Past Simple.'},
    {q:'The flight has been delayed ___ two hours.',options:['since','for','during'],answer:1,explain:'for + duration.'},
    {q:'I’ve worked here ___ March.',options:['for','since','from'],answer:1,explain:'since + starting point.'},
    {q:'This is the first time I ___ a situation like this.',options:['have seen','see','saw'],answer:0,explain:'“the first time” + Present Perfect.'},
    {q:'The supervisor has just ___ the report.',options:['send','sent','sending'],answer:1,explain:'have/has + past participle: sent.'},
    {q:'I have never ___ an emergency landing.',options:['experience','experienced','experiencing'],answer:1,explain:'have never + past participle.'},
    {q:'« Je travaille ici depuis deux ans. »',options:['I work here since two years.','I have worked here for two years.','I am working here since two years.'],answer:1,explain:'depuis + duration → have worked … for.'},
    {q:'The phone is ringing — I ___ answer it.',options:['’ll','’m going to','am'],answer:0,explain:'Decision at the moment of speaking → will.'},
    {q:'According to the timetable, the shuttle ___ at 14:30.',options:['leaves','will leaving','is leave'],answer:0,explain:'Timetables → Present Simple.'},
    {q:'I’ve already decided: I ___ apply for the cabin crew position.',options:['am going to','will to','going'],answer:0,explain:'A plan already decided → be going to.'},
    {q:'You ___ smoke anywhere in the terminal.',options:['mustn’t','don’t have to','needn’t to'],answer:0,explain:'mustn’t = prohibition.'},
    {q:'You ___ print your boarding pass — the mobile version is fine.',options:['mustn’t','don’t have to','can’t'],answer:1,explain:'don’t have to = not necessary.'},
    {q:'___ I see your passport, please?',options:['May','Must','Should'],answer:0,explain:'May / Could I…? = polite request.'},
    {q:'What time ___ boarding start?',options:['does','is','do'],answer:0,explain:'Present Simple question → does + base verb.'},
    {q:'Why ___ the flight delayed?',options:['is','does','has'],answer:0,explain:'be + delayed → Why is the flight delayed?'},
    {q:'She has ___ hour before her connection.',options:['a','an','the'],answer:1,explain:'an + vowel sound: an hour.'},
    {q:'Is there ___ pharmacy in this terminal?',options:['a','an','the'],answer:0,explain:'One, non-specific → a.'},
    {q:'The flight arrives ___ 6 p.m.',options:['at','on','in'],answer:0,explain:'at + clock time.'},
    {q:'We land ___ Monday morning.',options:['at','in','on'],answer:2,explain:'on + day.'},
    {q:'I’m responsible ___ the safety demonstration.',options:['of','for','to'],answer:1,explain:'responsible for.'},
    {q:'I apologise ___ the delay.',options:['for','about','of'],answer:0,explain:'apologise for something.'},
    {q:'She arrived ___ Dubai late last night.',options:['to','in','at'],answer:1,explain:'arrive in + city/country; arrive at + building/point.'},
    {q:'We don’t have ___ time before the gate closes.',options:['many','much','few'],answer:1,explain:'time (uncountable) → much.'},
    {q:'Could you give me some ___ about the delay?',options:['informations','information','an information'],answer:1,explain:'information is uncountable — never “informations”.'},
    {q:'Can I give you ___ advice?',options:['an','some','many'],answer:1,explain:'advice is uncountable → some advice.'},
    {q:'Today’s queue is ___ than yesterday’s.',options:['worse','worst','more bad'],answer:0,explain:'bad → worse → worst.'},
    {q:'This is ___ connection available.',options:['the fastest','the most fast','faster'],answer:0,explain:'short adjective → the + -est.'},
    {q:'The new terminal is ___ the old one.',options:['as big as','as big than','so big than'],answer:0,explain:'as + adjective + as.'},
    {q:'If you ___ your boarding pass, you’ll need a new one.',options:['lose','will lose','lost'],answer:0,explain:'First conditional: if + Present Simple.'},
    {q:'If I ___ more time, I would explain it in detail.',options:['have','had','would have'],answer:1,explain:'Second conditional: if + past, would + verb.'},
    {q:'I’m looking forward to ___ with your team.',options:['work','working','to work'],answer:1,explain:'look forward to + -ing.'},
    {q:'Would you mind ___ your bag on the scale?',options:['put','to put','putting'],answer:2,explain:'mind + -ing.'},
    {q:'I decided ___ my cabin crew training in Paris.',options:['doing','to do','do'],answer:1,explain:'decide + to + verb.'},
    {q:'The crew member ___ helped me was very kind.',options:['who','which','whose'],answer:0,explain:'who for people.'},
    {q:'The passenger ___ bag is missing is at the desk.',options:['who','whose','which'],answer:1,explain:'whose = possession (his/her bag).'},
    {q:'Boarding passes ___ at the gate.',options:['are checked','check','are checking'],answer:0,explain:'Passive: be + past participle.'},
    {q:'The passengers ___ about the delay an hour ago.',options:['were informed','have been informed','informed'],answer:0,explain:'ago → Past Simple passive.'},
    {q:'« J’ai fait une erreur. »',options:['I did a mistake.','I made a mistake.','I have done an error.'],answer:1,explain:'make a mistake.'},
    {q:'« Actuellement, nous vérifions. »',options:['Actually, we are checking.','Currently, we are checking.','Actually we check.'],answer:1,explain:'actuellement = currently. “Actually” means “en fait”.'}
  ];
  const CLOCK_SECS=90;let clockTimer=null,clockLeft=CLOCK_SECS,clockScore=0,clockCombo=0,clockQueue=[],clockMisses=[],clockCurrent=null,clockAnswered=0;
  const fmtT=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  if($('#clockBest'))$('#clockBest').textContent=appState.clockBest||0;
  function clockNext(){if(clockLeft<=0)return;if(!clockQueue.length)clockQueue=shuffle(clockBank);clockCurrent=clockQueue.pop();const order=shuffle(clockCurrent.options.map((o,i)=>i));$('#clockQuestion').textContent=clockCurrent.q;$('#clockFeedback').textContent='';$('#clockOptions').innerHTML=order.map(i=>`<button class="clock-opt" type="button" data-i="${i}">${clockCurrent.options[i]}</button>`).join('');$$('.clock-opt').forEach(b=>b.addEventListener('click',()=>clockPick(b)));}
  function clockPick(btn){if(clockLeft<=0)return;const i=Number(btn.dataset.i),ok=i===clockCurrent.answer;clockAnswered++;$$('.clock-opt').forEach(b=>{b.disabled=true;if(Number(b.dataset.i)===clockCurrent.answer)b.classList.add('right');});if(ok){clockScore++;clockCombo++;$('#clockFeedback').textContent=clockCombo>=3?`✓ Combo ×${clockCombo}!`:'✓ Correct';}else{btn.classList.add('wrong');clockCombo=0;clockMisses.push(clockCurrent);$('#clockFeedback').textContent='✕ '+clockCurrent.explain;}$('#clockScore').textContent=clockScore;$('#clockCombo').textContent=clockCombo;setTimeout(clockNext,ok?550:1700);}
  function clockEnd(){clearInterval(clockTimer);clockTimer=null;clockLeft=0;$$('.clock-opt').forEach(b=>b.disabled=true);const best=appState.clockBest||0,record=clockScore>best;$('#clockQuestion').textContent=record?`🏆 New record: ${clockScore} correct!`:`Time! You scored ${clockScore} / ${clockAnswered}.`;$('#clockOptions').innerHTML='';$('#clockFeedback').textContent=record?`+${(clockScore-best)*10} air miles`:`Your best is ${best}. Try again to beat it.`;if(record){appState.clockBest=clockScore;saveState();$('#clockBest').textContent=clockScore;confetti(90);}const r=$('#clockReview');const uniq=[...new Map(clockMisses.map(m=>[m.q,m])).values()];r.hidden=false;r.innerHTML=uniq.length?`<h5>Review your misses (${uniq.length})</h5><ul>${uniq.map(m=>`<li>${m.q.replace('___','<span class="ans">'+m.options[m.answer]+'</span>')}${m.q.includes('___')?'':' → <span class="ans">'+m.options[m.answer]+'</span>'} <span class="tiny">— ${m.explain}</span></li>`).join('')}</ul>`:'<h5>No misses — perfect round! ✈</h5>';$('#clockStart').textContent='Play again';$('#clockStart').disabled=false;}
  $('#clockStart')?.addEventListener('click',()=>{if(clockTimer)return;clockLeft=CLOCK_SECS;clockScore=0;clockCombo=0;clockMisses=[];clockAnswered=0;clockQueue=shuffle(clockBank);$('#clockScore').textContent=0;$('#clockCombo').textContent=0;$('#clockTime').textContent=fmtT(clockLeft);$('#clockTimebar').style.width='100%';$('#clockReview').hidden=true;$('#clockStart').disabled=true;$('#clockStart').textContent='Running…';clockNext();clockTimer=setInterval(()=>{clockLeft--;$('#clockTime').textContent=fmtT(Math.max(clockLeft,0));$('#clockTimebar').style.width=(Math.max(clockLeft,0)/CLOCK_SECS*100)+'%';if(clockLeft<=0)clockEnd();},1000);});

  // ---------- Grammar arcade: Spot the mistake ----------
  const spotBank=[
    {w:['I','work','here','since','2021','and','I','love','it.'],bad:[1],fix:'I have worked here since 2021 and I love it.',why:'since + starting point → Present Perfect, not Present Simple (French: depuis + présent).'},
    {w:['Can','you','explain','me','the','procedure,','please?'],bad:[3],fix:'Can you explain the procedure to me, please?',why:'explain + thing + to + person.'},
    {w:['The','passenger','is','waiting','on','Gate','12.'],bad:[4],fix:'The passenger is waiting at Gate 12.',why:'at + a precise point such as a numbered gate.'},
    {w:['I','need','some','informations','about','my','flight.'],bad:[3],fix:'I need some information about my flight.',why:'information is uncountable — no -s.'},
    {w:['I','am','agree','with','my','colleague.'],bad:[1],fix:'I agree with my colleague.',why:'agree is a verb — no “be”.'},
    {w:['Did','you','checked','the','booking?'],bad:[2],fix:'Did you check the booking?',why:'After did, use the base verb.'},
    {w:['If','the','flight','will','be','late,','we','will','call','you.'],bad:[3,4],fix:'If the flight is late, we will call you.',why:'No will after if in a first conditional.'},
    {w:['I','have','seen','her','yesterday','at','the','gate.'],bad:[1,2],fix:'I saw her yesterday at the gate.',why:'yesterday = finished time → Past Simple.'},
    {w:['This','is','the','most','cheap','option.'],bad:[3,4],fix:'This is the cheapest option.',why:'Short adjective → the + -est.'},
    {w:['I’m','used','to','work','at','night.'],bad:[3],fix:'I’m used to working at night.',why:'be used to + -ing.'},
    {w:['The','bag','has','been','find','in','Dublin.'],bad:[4],fix:'The bag has been found in Dublin.',why:'Passive: been + past participle (found).'},
    {w:['I’ve','been','a','flight','attendant','during','five','years.'],bad:[5],fix:'I’ve been a flight attendant for five years.',why:'for + duration (French: pendant / depuis).'}
  ];
  if($('#spotTotal'))$('#spotTotal').textContent=spotBank.length;
  appState.spot=appState.spot||{i:0,results:[]};
  function renderSpot(){const st=appState.spot,box=$('#spotSentence'),fb=$('#spotFeedback'),next=$('#spotNext');if(!box)return;$('#spotScore').textContent=st.results.filter(Boolean).length;$('#spotProgress').innerHTML=spotBank.map((_,k)=>`<i class="${st.results[k]===true?'ok':st.results[k]===false?'ko':k===st.i?'now':''}"></i>`).join('');
    if(st.i>=spotBank.length){const sc=st.results.filter(Boolean).length;box.innerHTML=`<div class="spot-done" style="width:100%"><b>${sc} / ${spotBank.length}</b>${sc===spotBank.length?'Perfect — no French traps got past you! ✈':sc>=9?'Excellent eye for detail.':'Good practice — restart to go for a perfect score.'}</div>`;fb.innerHTML='';next.disabled=true;return;}
    const item=spotBank[st.i];const answered=st.results[st.i]!==undefined;box.innerHTML=item.w.map((w,k)=>`<button class="spot-word" type="button" data-k="${k}">${w}</button>`).join('');fb.innerHTML=answered?'':'<span class="tiny">Sentence '+(st.i+1)+' of '+spotBank.length+' — tap the word that is wrong.</span>';next.disabled=!answered;
    if(answered){$$('.spot-word',box).forEach(b=>{b.disabled=true;if(item.bad.includes(+b.dataset.k))b.classList.add(st.results[st.i]?'hit':'reveal');});fb.innerHTML=`${st.results[st.i]?'<strong style="color:var(--good)">✓ Spotted!</strong>':'<strong style="color:var(--danger)">✕ Not that one.</strong>'} ${item.why}<span class="fix">${item.fix}</span>`;return;}
    $$('.spot-word',box).forEach(b=>b.addEventListener('click',()=>{const k=+b.dataset.k,ok=item.bad.includes(k);st.results[st.i]=ok;if(!ok)b.classList.add('miss');saveState();onAnswer(ok);setTimeout(()=>{renderSpot();if(!ok)$$('.spot-word').forEach(x=>{if(+x.dataset.k===k)x.classList.add('miss');});},ok?0:150);}));}
  $('#spotNext')?.addEventListener('click',()=>{appState.spot.i++;saveState();renderSpot();if(appState.spot.i>=spotBank.length&&appState.spot.results.filter(Boolean).length>=9)confetti(80);});
  $('#spotRestart')?.addEventListener('click',()=>{appState.spot={i:0,results:[]};saveState();renderSpot();});
  renderSpot();

  // ---------- Live encounter: baggage ----------
  const encounter=[
    {pax:'I paid for this ticket and nobody told me my bag was too big. I’m not paying another fee. This is ridiculous.',choices:[
      {t:'Calm down, sir. Rules are rules.',d:-15,c:'“Calm down” usually makes people angrier, and “rules are rules” closes the conversation.'},
      {t:'I understand why you’re frustrated. Let me check your booking first.',d:25,c:'Acknowledge + clarify: you lower the temperature and take control.'},
      {t:'It’s not my fault — I don’t make the rules.',d:-20,c:'Defensive. The passenger hears “I don’t care”.'}]},
    {pax:'Fine, check it. But I’m telling you, I’m NOT paying.',choices:[
      {t:'You have to pay. Everybody pays.',d:-15,c:'Correct information, but confrontational, and it ignores the person.'},
      {t:'Maybe it fits… let’s just try and see.',d:-5,c:'False hope. When it doesn’t fit, the conflict comes back stronger.'},
      {t:'Thank you. The bag is about 10 cm over the cabin limit, so unfortunately it can’t go in the overhead locker.',d:20,c:'Neutral facts about the bag, not about the passenger. Firm but fair.'}]},
    {pax:'So what am I supposed to do? My flight boards in thirty minutes!',choices:[
      {t:'What I can do is check it in at the gate — it’s the quickest option, and you collect it on arrival.',d:25,c:'“What I can do is…” moves from problem to solution. Perfect.'},
      {t:'You should have read the conditions.',d:-15,c:'Blaming the passenger, even if it’s true, escalates the conflict.'},
      {t:'I don’t know. You need to decide quickly.',d:-20,c:'Adds pressure and gives no help.'}]},
    {pax:'And how much is that going to cost me?',choices:[
      {t:'Don’t worry, I’ll waive the fee for you.',d:-10,c:'Never promise something you’re not authorised to give. It creates a new problem.'},
      {t:'Let me confirm the exact fee for you now, so there are no more surprises.',d:20,c:'Transparent and reassuring, with no false promise. Excellent close.'},
      {t:'A lot, probably.',d:-15,c:'Vague and unhelpful. The passenger feels lost again.'}]}
  ];
  const moods=[[0,'😡','Furious'],[30,'😠','Angry'],[50,'😕','Unsure'],[70,'🙂','Calmer'],[85,'😌','Calm & satisfied']];
  let encStep=0,encMood=20;
  function setMood(v){encMood=Math.max(0,Math.min(100,v));let m=moods[0];moods.forEach(x=>{if(encMood>=x[0])m=x;});const e=$('#moodEmoji');if(e){e.textContent=m[1];e.classList.add('bump');setTimeout(()=>e.classList.remove('bump'),300);}if($('#moodLabel'))$('#moodLabel').textContent=`${m[2]} · ${encMood}%`;const bar=$('#moodBar');if(bar){bar.style.width=encMood+'%';bar.style.background=encMood>=70?'#31a777':encMood>=40?'#e8b04f':'#cd5b52';}}
  const escAttr=s=>s.replace(/"/g,'&quot;');
  function addBubble(cls,label,text,speakIt){const log=$('#encounterLog');const d=document.createElement('div');d.className='bubble '+cls;d.innerHTML=`<small>${label}</small>${text}${speakIt?` <button class="audio-btn" type="button" data-lang="en-US" data-speak="${escAttr(text)}">🔊</button>`:''}`;log.appendChild(d);log.scrollTop=log.scrollHeight;}
  function addNote(good,text){const log=$('#encounterLog');const d=document.createElement('div');d.className='coach-note '+(good?'good':'bad');d.textContent=(good?'✓ Coach: ':'⚠ Coach: ')+text;log.appendChild(d);log.scrollTop=log.scrollHeight;}
  function encRender(){const box=$('#encounterChoices');if(!box)return;if(encStep>=encounter.length){box.innerHTML='';const cls=encMood>=80?'win':encMood>=50?'mid':'lose';const msg=encMood>=80?['Situation resolved ✈','The passenger is calm, informed and moving towards the gate. That is professional control.']:encMood>=50?['Under control — just','You got there, but one or two replies cost you trust. Play again and find the best path.']:['The situation escalated','No problem — this is the place to make mistakes. Read the coach notes and try again.'];const r=document.createElement('div');r.className='encounter-result '+cls;r.innerHTML=`<b>${msg[0]}</b>${msg[1]}`;$('#encounterLog').appendChild(r);const best=appState.encounterBest;if(best==null||encMood>best){appState.encounterBest=encMood;saveState();}$('#encounterBest').textContent=appState.encounterBest+'%';if(encMood>=80)confetti(90);return;}
    const turn=encounter[encStep];box.innerHTML=shuffle(turn.choices).map(c=>`<button class="encounter-choice" type="button" data-d="${c.d}">${c.t}</button>`).join('');$$('.encounter-choice',box).forEach(b=>b.addEventListener('click',()=>{const c=turn.choices.find(x=>x.t===b.textContent);box.innerHTML='';addBubble('me','YOU',c.t,false);setTimeout(()=>{addNote(c.d>0,c.c);setMood(encMood+c.d);onAnswer(c.d>0);encStep++;setTimeout(()=>{if(encStep<encounter.length)addBubble('pax','PASSENGER',encounter[encStep].pax,true);encRender();},700);},450);}));}
  function encStart(){encStep=0;$('#encounterLog').innerHTML='';setMood(20);addBubble('pax','PASSENGER',encounter[0].pax,true);encRender();}
  $('#encounterRestart')?.addEventListener('click',encStart);
  if($('#encounterBest')&&appState.encounterBest!=null)$('#encounterBest').textContent=appState.encounterBest+'%';
  if($('#encounter'))encStart();

  refreshMiles();

})();
