(() => {
  'use strict';
  window.NATHALIE_MOCK_VERSION='4.3';

  const STORAGE_KEY = 'nathalie_gulliver_final_cloe_v1';
  const CATEGORY_ORDER = ['vocabulary','grammar','expressions','reading','listening'];
  const CATEGORY_LABELS = {
    vocabulary:'Vocabulaire', grammar:'Grammaire & syntaxe', expressions:'Expressions', reading:'Compréhension de textes', listening:'Compréhension orale'
  };
  const LEVEL_LABELS = ['A0/A1','A1','A2','B1','B2','C1','C2'];
  const rubricLevels = ['Non évalué','A1−','A1','A1+','A2−','A2','A2+','B1−','B1','B1+','B2−','B2','B2+','C1','C2'];
  const rubricValue = {'A1−':.7,'A1':1,'A1+':1.25,'A2−':1.7,'A2':2,'A2+':2.25,'B1−':2.7,'B1':3,'B1+':3.25,'B2−':3.7,'B2':4,'B2+':4.25,'C1':5,'C2':6};

  const Q = (id,cat,d,prompt,options,answer,extra={}) => ({id,cat,d,prompt,options,answer,...extra});
  const bank = [
  {
    "id": "v1",
    "cat": "vocabulary",
    "d": 1,
    "prompt": "A person who shows visitors around a museum is a…",
    "options": [
      "guide",
      "guest",
      "ticket",
      "receipt"
    ],
    "answer": 0
  },
  {
    "id": "v2",
    "cat": "vocabulary",
    "d": 1,
    "prompt": "You need a ____ to enter the exhibition.",
    "options": [
      "ticket",
      "timetable",
      "suitcase",
      "platform"
    ],
    "answer": 0
  },
  {
    "id": "v3",
    "cat": "vocabulary",
    "d": 1,
    "prompt": "When a train arrives late, there is a…",
    "options": [
      "delay",
      "discount",
      "departure",
      "booking"
    ],
    "answer": 0
  },
  {
    "id": "v4",
    "cat": "vocabulary",
    "d": 1,
    "prompt": "A place where you can borrow books is a…",
    "options": [
      "library",
      "gallery",
      "station",
      "bakery"
    ],
    "answer": 0
  },
  {
    "id": "v5",
    "cat": "vocabulary",
    "d": 2,
    "prompt": "Please ____ the form before your visit.",
    "options": [
      "complete",
      "borrow",
      "depart",
      "arrive"
    ],
    "answer": 0
  },
  {
    "id": "v6",
    "cat": "vocabulary",
    "d": 2,
    "prompt": "The hotel can ____ your booking by email.",
    "options": [
      "confirm",
      "collect",
      "attend",
      "improve"
    ],
    "answer": 0
  },
  {
    "id": "v7",
    "cat": "vocabulary",
    "d": 2,
    "prompt": "A visitor who cannot find the entrance needs…",
    "options": [
      "directions",
      "ingredients",
      "receipt",
      "luggage"
    ],
    "answer": 0
  },
  {
    "id": "v8",
    "cat": "vocabulary",
    "d": 2,
    "prompt": "You need to ____ the appointment until Friday.",
    "options": [
      "postpone",
      "describe",
      "exchange",
      "develop"
    ],
    "answer": 0
  },
  {
    "id": "v9",
    "cat": "vocabulary",
    "d": 3,
    "prompt": "The exhibition is temporarily closed for…",
    "options": [
      "maintenance",
      "admission",
      "permission",
      "arrival"
    ],
    "answer": 0
  },
  {
    "id": "v10",
    "cat": "vocabulary",
    "d": 3,
    "prompt": "The museum provides wheelchair…",
    "options": [
      "access",
      "avoidance",
      "evidence",
      "refund"
    ],
    "answer": 0
  },
  {
    "id": "g1",
    "cat": "grammar",
    "d": 1,
    "prompt": "She ____ in France.",
    "options": [
      "lives",
      "live",
      "living",
      "is live"
    ],
    "answer": 0
  },
  {
    "id": "g2",
    "cat": "grammar",
    "d": 1,
    "prompt": "Yesterday we ____ to Nantes.",
    "options": [
      "went",
      "go",
      "gone",
      "going"
    ],
    "answer": 0
  },
  {
    "id": "g3",
    "cat": "grammar",
    "d": 1,
    "prompt": "They ____ the exhibition now.",
    "options": [
      "are visiting",
      "visited",
      "visits",
      "is visiting"
    ],
    "answer": 0
  },
  {
    "id": "g4",
    "cat": "grammar",
    "d": 1,
    "prompt": "There ____ three floors in the mechanical elephant.",
    "options": [
      "are",
      "is",
      "has",
      "be"
    ],
    "answer": 0
  },
  {
    "id": "g5",
    "cat": "grammar",
    "d": 2,
    "prompt": "I have lived here ____ many years.",
    "options": [
      "for",
      "since",
      "ago",
      "during"
    ],
    "answer": 0
  },
  {
    "id": "g6",
    "cat": "grammar",
    "d": 2,
    "prompt": "Have you ever ____ to Edinburgh?",
    "options": [
      "been",
      "went",
      "go",
      "being"
    ],
    "answer": 0
  },
  {
    "id": "g7",
    "cat": "grammar",
    "d": 2,
    "prompt": "Could you ____ me where the station is?",
    "options": [
      "tell",
      "telling",
      "told",
      "to tell"
    ],
    "answer": 0
  },
  {
    "id": "g8",
    "cat": "grammar",
    "d": 2,
    "prompt": "This museum is ____ than the other one.",
    "options": [
      "more interesting",
      "interestinger",
      "most interesting",
      "the more interesting"
    ],
    "answer": 0
  },
  {
    "id": "g9",
    "cat": "grammar",
    "d": 3,
    "prompt": "While we ____ around Nantes, it started raining.",
    "options": [
      "were walking",
      "walk",
      "have walked",
      "are walking"
    ],
    "answer": 0
  },
  {
    "id": "g10",
    "cat": "grammar",
    "d": 3,
    "prompt": "I will call you when I ____ home.",
    "options": [
      "get",
      "will get",
      "got",
      "getting"
    ],
    "answer": 0
  },
  {
    "id": "e1",
    "cat": "expressions",
    "d": 1,
    "prompt": "A visitor says: “Thank you for your help.”",
    "options": [
      "You’re welcome.",
      "It does not matter you.",
      "I agree.",
      "I am welcome."
    ],
    "answer": 0
  },
  {
    "id": "e2",
    "cat": "expressions",
    "d": 1,
    "prompt": "You cannot hear the examiner clearly.",
    "options": [
      "Could you repeat that, please?",
      "What? Again!",
      "I not understand nothing.",
      "Speak English."
    ],
    "answer": 0
  },
  {
    "id": "e3",
    "cat": "expressions",
    "d": 1,
    "prompt": "You want to ask for a train ticket politely.",
    "options": [
      "Could I have a return ticket, please?",
      "Give me returning.",
      "I need ticket you.",
      "You give me now."
    ],
    "answer": 0
  },
  {
    "id": "e4",
    "cat": "expressions",
    "d": 1,
    "prompt": "Someone asks where you live.",
    "options": [
      "I live near the Atlantic coast.",
      "I am living since twenty years.",
      "I am at France.",
      "I have France."
    ],
    "answer": 0
  },
  {
    "id": "e5",
    "cat": "expressions",
    "d": 2,
    "prompt": "You want to ask whether a hotel has a lift.",
    "options": [
      "Does the hotel have a lift?",
      "Has hotel elevator?",
      "Is lift hotel?",
      "Do the hotel has a lift?"
    ],
    "answer": 0
  },
  {
    "id": "e6",
    "cat": "expressions",
    "d": 2,
    "prompt": "You want to offer two appointment times.",
    "options": [
      "Would Tuesday or Thursday suit you?",
      "Tuesday or Thursday you take.",
      "You want day which?",
      "You have come Tuesday."
    ],
    "answer": 0
  },
  {
    "id": "e7",
    "cat": "expressions",
    "d": 2,
    "prompt": "You want to reassure a worried visitor.",
    "options": [
      "Don’t worry, I’ll help you find your way.",
      "No panic you.",
      "That is not me.",
      "You should know."
    ],
    "answer": 0
  },
  {
    "id": "e8",
    "cat": "expressions",
    "d": 2,
    "prompt": "You need time to check some information.",
    "options": [
      "Just a moment, please. I’ll check that for you.",
      "Waiting because I search.",
      "Hold your words.",
      "I do not have time."
    ],
    "answer": 0
  },
  {
    "id": "e9",
    "cat": "expressions",
    "d": 3,
    "prompt": "You want to disagree politely in a discussion.",
    "options": [
      "I see your point, but I have a different view.",
      "You are simply wrong.",
      "Your opinion is bad.",
      "I refuse what you said."
    ],
    "answer": 0
  },
  {
    "id": "e10",
    "cat": "expressions",
    "d": 3,
    "prompt": "You want to explain why you recommend a guided visit.",
    "options": [
      "I’d recommend the guided tour because it provides more background.",
      "Tour guided is obligated because history.",
      "The guides you must.",
      "Guided only, no questions."
    ],
    "answer": 0
  },
  {
    "id": "r1",
    "cat": "reading",
    "d": 1,
    "prompt": "What time does the museum open?",
    "options": [
      "10 a.m.",
      "9 a.m.",
      "11 a.m.",
      "Noon"
    ],
    "answer": 0,
    "passage": "Museum information: Open Tuesday–Sunday, 10 a.m.–6 p.m. Closed Mondays."
  },
  {
    "id": "r2",
    "cat": "reading",
    "d": 1,
    "prompt": "Where should visitors go first?",
    "options": [
      "The reception desk",
      "The café",
      "The gift shop",
      "The car park"
    ],
    "answer": 0,
    "passage": "WELCOME: Please collect your visitor pass at reception before entering the exhibition."
  },
  {
    "id": "r3",
    "cat": "reading",
    "d": 1,
    "prompt": "Which day is the museum closed?",
    "options": [
      "Monday",
      "Tuesday",
      "Saturday",
      "Sunday"
    ],
    "answer": 0,
    "passage": "Opening hours: Tuesday to Sunday 9:30–17:30. Closed on Mondays."
  },
  {
    "id": "r4",
    "cat": "reading",
    "d": 1,
    "prompt": "What should passengers bring?",
    "options": [
      "Their booking reference",
      "A printed map",
      "A museum ticket",
      "A cash deposit"
    ],
    "answer": 0,
    "passage": "Your train booking is confirmed. Please have your booking reference ready when boarding."
  },
  {
    "id": "r5",
    "cat": "reading",
    "d": 2,
    "prompt": "Why is the tour moving to the afternoon?",
    "options": [
      "The guide is unavailable in the morning",
      "It is free in the afternoon",
      "The museum is closing",
      "Visitors requested refunds"
    ],
    "answer": 0,
    "passage": "Dear visitors, our guide is unavailable at 10:00 tomorrow. The same visit will take place at 14:00. Please reply to confirm you can attend."
  },
  {
    "id": "r6",
    "cat": "reading",
    "d": 2,
    "prompt": "What must visitors do before arriving?",
    "options": [
      "Book a place online",
      "Phone the café",
      "Print their passports",
      "Bring their own headphones"
    ],
    "answer": 0,
    "passage": "The workshop has limited places. Please reserve online at least 24 hours before arrival."
  },
  {
    "id": "r7",
    "cat": "reading",
    "d": 2,
    "prompt": "What is the purpose of the message?",
    "options": [
      "To ask for accessible entrance information",
      "To cancel a school trip",
      "To apply for a job",
      "To request a refund"
    ],
    "answer": 0,
    "passage": "Hello, my mother uses a wheelchair. Could you tell me whether there is a step-free entrance and an accessible toilet? Thank you."
  },
  {
    "id": "r8",
    "cat": "reading",
    "d": 2,
    "prompt": "What is included in the price?",
    "options": [
      "The guided visit and audio guide",
      "Lunch and transport",
      "Hotel accommodation",
      "A second entry ticket"
    ],
    "answer": 0,
    "passage": "Tickets for the heritage tour cost €18 and include the guided visit plus an audio guide. Meals and transport are not included."
  },
  {
    "id": "r9",
    "cat": "reading",
    "d": 3,
    "prompt": "What is the main issue in this message?",
    "options": [
      "A misunderstanding about meeting times",
      "Lost luggage",
      "An incorrect price",
      "An exhibition cancellation"
    ],
    "answer": 0,
    "passage": "We had agreed to meet at 2:30, but several participants received a reminder saying 3:30. Please send a corrected confirmation to everyone by this evening."
  },
  {
    "id": "r10",
    "cat": "reading",
    "d": 3,
    "prompt": "What does the writer recommend?",
    "options": [
      "Offering both digital and personal assistance",
      "Replacing all staff with computers",
      "Closing the ticket desk",
      "Only accepting cash"
    ],
    "answer": 0,
    "passage": "Online booking is useful, but some visitors still need individual support. Museums should provide digital options while keeping staff available to answer more complex questions."
  },
  {
    "id": "l1",
    "cat": "listening",
    "d": 1,
    "prompt": "Where is the speaker going?",
    "options": [
      "Nantes",
      "Lyon",
      "London",
      "Paris"
    ],
    "answer": 0,
    "script": "Tomorrow I am taking the train to Nantes to visit my family."
  },
  {
    "id": "l2",
    "cat": "listening",
    "d": 1,
    "prompt": "What time does the train leave?",
    "options": [
      "Half past nine",
      "Nine o’clock",
      "Half past ten",
      "Quarter past nine"
    ],
    "answer": 0,
    "script": "The next train leaves from platform four at half past nine."
  },
  {
    "id": "l3",
    "cat": "listening",
    "d": 1,
    "prompt": "How many floors does the elephant have?",
    "options": [
      "Three",
      "Two",
      "Four",
      "Five"
    ],
    "answer": 0,
    "script": "The mechanical elephant is enormous. You can go inside, and it has three floors."
  },
  {
    "id": "l4",
    "cat": "listening",
    "d": 1,
    "prompt": "Who is joining the visit?",
    "options": [
      "The speaker’s granddaughter",
      "The speaker’s colleague",
      "The speaker’s brother",
      "The speaker’s manager"
    ],
    "answer": 0,
    "script": "My daughter and my granddaughter are coming with me to visit the Machines de l’Île."
  },
  {
    "id": "l5",
    "cat": "listening",
    "d": 2,
    "prompt": "What is the visitor asking for?",
    "options": [
      "Directions to the entrance",
      "A refund",
      "A job",
      "A meal"
    ],
    "answer": 0,
    "script": "Excuse me, could you tell me where the main entrance is? I think I have come to the wrong side of the building."
  },
  {
    "id": "l6",
    "cat": "listening",
    "d": 2,
    "prompt": "What will happen if it rains?",
    "options": [
      "The visit will move indoors",
      "The visit will be cancelled",
      "The group will leave early",
      "There will be no change"
    ],
    "answer": 0,
    "script": "If the weather turns bad, we will continue the guided visit inside the exhibition hall."
  },
  {
    "id": "l7",
    "cat": "listening",
    "d": 2,
    "prompt": "What is the problem?",
    "options": [
      "The planned tour is fully booked",
      "The guide is late",
      "The ticket is lost",
      "The museum is closed all week"
    ],
    "answer": 0,
    "script": "I am sorry, but the guided tour at two o’clock is fully booked. We still have places at four thirty."
  },
  {
    "id": "l8",
    "cat": "listening",
    "d": 2,
    "prompt": "What should the visitor do next?",
    "options": [
      "Confirm by email",
      "Pay again",
      "Speak to security",
      "Change hotels"
    ],
    "answer": 0,
    "script": "I have reserved two places for Thursday. Could you please confirm by email before tomorrow evening?"
  },
  {
    "id": "l9",
    "cat": "listening",
    "d": 3,
    "prompt": "Why does the speaker prefer a guided tour?",
    "options": [
      "It offers historical explanations",
      "It is always cheaper",
      "It takes less than ten minutes",
      "It has no queues"
    ],
    "answer": 0,
    "script": "I really enjoy guided tours because the explanations help me understand the history behind what I am seeing."
  },
  {
    "id": "l10",
    "cat": "listening",
    "d": 3,
    "prompt": "What is the main point of the announcement?",
    "options": [
      "A temporary change to the meeting location",
      "A permanent closure",
      "An admission price increase",
      "A new restaurant opening"
    ],
    "answer": 0,
    "script": "Due to renovation work at the main entrance, tomorrow’s group will meet beside the north gate rather than at the usual reception area."
  }
];

  // The official-style MCQ bank was intentionally authored with the correct option first
  // for editing reliability. Reposition each correct answer deterministically so that the
  // candidate sees a balanced mix of positions 1–4 without changing the question content.
  bank.forEach(q => {
    const questionNumber = Number((q.id.match(/\d+/)||['1'])[0]);
    const categoryOffset = Math.max(0, CATEGORY_ORDER.indexOf(q.cat));
    const target = (questionNumber - 1 + categoryOffset) % q.options.length;
    if(q.answer !== target){
      const current = q.answer;
      [q.options[current], q.options[target]] = [q.options[target], q.options[current]];
      q.answer = target;
    }
  });

  const oralPhases = [
  {
    "title": "Partie 1 · Présentation et parcours",
    "time": "4–5 minutes",
    "objective": "Décrire la vie actuelle, les habitudes, les expériences et les projets, sans réponses apprises par cœur.",
    "startLine": "Good morning, Nathalie. First, I would like to learn a little about you, your everyday life and your experiences.",
    "steps": [
      {
        "ask": "Could you introduce yourself and tell me where you live?",
        "follow": [
          "What do you like about your area?",
          "How long have you lived there?"
        ]
      },
      {
        "ask": "What did you do in your previous job?",
        "follow": [
          "You worked with children; what were your main responsibilities?",
          "What did you enjoy most about that work?"
        ]
      },
      {
        "ask": "Tell me about a place you visited recently.",
        "follow": [
          "What did you see in Nantes?",
          "Who went with you?",
          "What surprised you about the mechanical elephant?"
        ]
      },
      {
        "ask": "How do you normally spend your weekends?",
        "follow": [
          "What do you enjoy doing with your family?",
          "Do you prefer a quiet or active weekend?"
        ]
      },
      {
        "ask": "What would you like to do with your English in the future?",
        "follow": [
          "What has become easier?",
          "When would you like to use English?"
        ]
      }
    ],
    "rescue": "Relance neutre : “Could you tell me a little more?” Ne pas souffler la réponse.",
    "transition": "Thank you. We will now move on to a role-play."
  },
  {
    "title": "Partie 2 · Situation professionnelle et accueil",
    "time": "6–7 minutes",
    "objective": "Accueillir, interroger, expliquer, réagir à une difficulté et proposer une solution adaptée à un environnement éducatif ou à des visiteurs.",
    "startLine": "Imagine you are helping at a children’s activity centre. I am an English-speaking parent who needs some information.",
    "roleplay": [
      {
        "label": "Parent · premier contact",
        "say": "Hello, I have just arrived with my daughter. Is this the right place for the children’s workshop?",
        "expect": "Saluer et expliquer le lieu sans improviser de détails personnels.",
        "fallback": "Could you tell me where we should go?"
      },
      {
        "label": "Parent · horaires",
        "say": "What time does the activity start, and when should I come back?",
        "expect": "Demander ou expliquer des horaires; si information inconnue, proposer de vérifier."
      },
      {
        "label": "Parent · besoins",
        "say": "She is a little nervous. Is there someone who can help her settle in?",
        "expect": "Rassurer, reformuler et expliquer les étapes."
      },
      {
        "label": "Parent · imprévu",
        "say": "I have just received a message: I may be twenty minutes late collecting her. What should I do?",
        "expect": "Écouter, clarifier, expliquer la procédure sans inventer de règle officielle."
      },
      {
        "label": "Parent · solution",
        "say": "Could you explain the next steps, please?",
        "expect": "Donner une solution claire et vérifier la compréhension."
      },
      {
        "label": "Autre contexte · musée",
        "say": "Now imagine you are assisting visitors at a museum. I have lost my entrance ticket. What can I do?",
        "expect": "Accueillir, demander des informations et proposer de vérifier avec la billetterie."
      },
      {
        "label": "Visiteur · accessibilité",
        "say": "My mother cannot use the stairs. Is there another entrance?",
        "expect": "Répondre prudemment; expliquer ce qu’elle peut vérifier."
      },
      {
        "label": "Clôture",
        "say": "Thank you for your help. Could you summarise what I should do now?",
        "expect": "Résumer les étapes, conclure poliment."
      }
    ],
    "rescue": "Répéter une fois plus lentement uniquement si nécessaire.",
    "stretch": "Si elle est à l’aise : “What would you do if the booking system stopped working?”",
    "transition": "Thank you. Now let us discuss a few general topics."
  },
  {
    "title": "Partie 3 · Opinion, comparaison et argumentation",
    "time": "5–7 minutes",
    "objective": "Donner son opinion, comparer, justifier et illustrer par une expérience.",
    "startLine": "For the last part, there are no right or wrong opinions. Please explain your point of view and give examples.",
    "steps": [
      {
        "ask": "Do you think children learn more through play or formal lessons?",
        "follow": [
          "Why?",
          "Can you give an example from your experience?"
        ]
      },
      {
        "ask": "Would you rather visit a museum or explore a city independently?",
        "follow": [
          "What are the advantages of both choices?",
          "Would your answer change when travelling with children?"
        ]
      },
      {
        "ask": "Do you think technology makes cultural visits better?",
        "follow": [
          "How can technology help?",
          "Could there be disadvantages?"
        ]
      },
      {
        "ask": "Is it better to travel by train or by car?",
        "follow": [
          "What matters most to you?",
          "How does the destination change your decision?"
        ]
      }
    ],
    "rescue": "Relances neutres : “Why?”, “Could you give an example?”, “What about the disadvantages?”",
    "closeLine": "Thank you, Nathalie. That is the end of the interview."
  }
];

  const writingTasks = [
  {
    "id": "w1",
    "title": "Tâche 1 · Message pratique",
    "target": "40–60 mots",
    "prompt": "You arranged to visit a museum with an English-speaking friend on Saturday at 10 a.m., but you cannot arrive before 11 a.m. Write a polite message to explain the change, apologise, propose a new meeting time and ask for confirmation.",
    "model": "Hi Emma,\nI’m sorry, but I can’t arrive at the museum at 10 a.m. on Saturday. Would it be possible to meet at 11 a.m. instead? We could have a coffee before visiting the exhibition. Please let me know if that works for you.\nBest wishes,\nNathalie"
  },
  {
    "id": "w2",
    "title": "Tâche 2 · Réponse à une demande de renseignements",
    "target": "80–110 mots",
    "prompt": "An English-speaking parent asks about a children’s activity you are helping to organise. Write a professional reply. Explain that you will confirm the times and location, ask about the child’s age and needs, describe two reassuring steps, and invite further questions. Avoid inventing confirmed details.",
    "model": "Dear Ms Green,\nThank you for your message about the children’s workshop. I would be happy to help. I will check the exact starting time and meeting point and send you the confirmed information. Could you tell me your child’s age and whether they have any particular needs?\nWhen you arrive, a member of the team will welcome you and explain how the activity is organised. We will also show your child where to go and who they can speak to if they need help.\nPlease do not hesitate to contact me if you have any other questions.\nKind regards,\nNathalie"
  },
  {
    "id": "w3",
    "title": "Tâche 3 · Incident et solution",
    "target": "90–130 mots",
    "prompt": "During a cultural group visit, several visitors received conflicting meeting times. Write a short incident report for the organiser. State what happened, the impact, what you did, and what you recommend for next time.",
    "model": "Incident report – visitor meeting time\nToday, several visitors arrived at different times because two confirmation messages contained conflicting information. Some people waited outside and the visit started late.\nI spoke to the visitors, checked the booking information with reception and explained the correct starting time. I apologised for the confusion and made sure everyone knew where to meet.\nFor future visits, I recommend checking all messages before sending them and using one confirmed meeting time. The organiser could also send a final reminder the day before the visit. This should help avoid similar problems."
  }
];

  const defaultState = () => ({
    mode:'candidate', view:'home', written:{started:false,finished:false,categoryIndex:0,questionInCategory:0,totalIndex:0,currentId:null,currentDiff:2,streak:0,answers:[],categoryTheta:{vocabulary:2,grammar:2,expressions:2,reading:2,listening:2},used:[],remainingTotal:3000,remainingQuestion:45,audioPlays:0},
    oral:{started:false,finished:false,ratings:{},comments:'',remaining:1200,phase:0},
    writing:{answers:{w1:'',w2:'',w3:''},ratings:{},comments:''},
    manualGrades:{
      oral:{score20:'',level:''},
      writing:{score20:'',level:''}
    },
    finalComments:'', finalStatus:'Non commencé', qualiopi:{statuses:{}}
  });
  let state = loadState();
  let totalInterval=null, questionInterval=null, oralInterval=null, selectedOption=null, mediaRecorder=null, audioChunks=[];

  const $ = id => document.getElementById(id);
  const on = (id,event,handler) => { const el=$(id); if(el) el.addEventListener(event,handler); };
  const views = {home:$('homeView'),written:$('writtenView'),writtenDone:$('writtenDoneView'),oral:$('oralView'),writing:$('writingView'),results:$('resultsView'),certificate:$('certificateView')};

  function loadState(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(!raw) return defaultState();
      const saved=JSON.parse(raw);
      const base=defaultState();
      // Keep the original storage key and merge new fields into older saved attempts.
      // This is deliberately non-destructive so a previously completed exam can be
      // reopened with the updated files without losing answers or automatic scores.
      return {
        ...base,
        ...saved,
        manualGrades:{
          oral:{...base.manualGrades.oral,...(saved.manualGrades?.oral||{})},
          writing:{...base.manualGrades.writing,...(saved.manualGrades?.writing||{})}
        },
        qualiopi:{...base.qualiopi,...(saved.qualiopi||{}),statuses:{...base.qualiopi.statuses,...(saved.qualiopi?.statuses||{})}}
      };
    }catch(e){ return defaultState(); }
  }
  function saveState(){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
    const s=$('saveIndicator'); s.textContent='● Sauvegardé';
  }
  function toast(msg){ const t=$('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1800); }
  function setView(name){
    Object.values(views).forEach(v=>v.classList.remove('active')); views[name].classList.add('active'); state.view=name; saveState(); window.scrollTo({top:0,behavior:'smooth'});
    if(name==='results') renderResults(); if(name==='certificate') renderCertificate();
  }
  function setMode(mode){
    state.mode=mode; document.body.classList.toggle('teacher-mode',mode==='teacher'); document.body.classList.toggle('candidate-mode',mode!=='teacher');
    $('teacherViewBtn').classList.toggle('active',mode==='teacher'); $('candidateViewBtn').classList.toggle('active',mode!=='teacher');
    $('oralTeacherPanel').classList.toggle('hidden',mode!=='teacher'); $('writingTeacherPanel').classList.toggle('hidden',mode!=='teacher'); saveState();
  }

  function categoryQuestions(cat){ return bank.filter(q=>q.cat===cat); }
  function pickQuestion(){
    const cat=CATEGORY_ORDER[state.written.categoryIndex];
    let diff=state.written.currentDiff;
    let candidates=categoryQuestions(cat).filter(q=>q.d===diff && !state.written.used.includes(q.id));
    if(!candidates.length){
      candidates=categoryQuestions(cat).filter(q=>!state.written.used.includes(q.id)).sort((a,b)=>Math.abs(a.d-diff)-Math.abs(b.d-diff));
      if(candidates.length){ const nearest=Math.abs(candidates[0].d-diff); candidates=candidates.filter(q=>Math.abs(q.d-diff)===nearest); }
    }
    return candidates[Math.floor(Math.random()*candidates.length)];
  }
  function questionSeconds(d,cat){ if(cat==='reading'||cat==='listening') return [0,50,55,65,75][d]; return [0,35,45,55,65][d]; }
  function startWritten(){
    if(!state.written.started){ state.written=defaultState().written; state.written.started=true; saveState(); }
    setView('written'); if(!state.written.currentId) loadNextQuestion(); else { renderCurrentQuestion(); startQuestionTimer(); } startTotalTimer();
  }
  function loadNextQuestion(){
    if(state.written.totalIndex>=50 || state.written.remainingTotal<=0){ finishWritten(); return; }
    const q=pickQuestion();
    if(!q){ finishWritten(); return; }
    state.written.currentId=q.id; state.written.used.push(q.id); state.written.remainingQuestion=questionSeconds(q.d,q.cat); state.written.audioPlays=0; selectedOption=null; saveState(); renderCurrentQuestion(); startQuestionTimer();
  }
  function currentQuestion(){ return bank.find(q=>q.id===state.written.currentId); }
  function renderCurrentQuestion(){
    const q=currentQuestion(); if(!q){ loadNextQuestion(); return; }
    const catIndex=state.written.categoryIndex;
    $('categoryEyebrow').textContent=`ÉPREUVE ÉCRITE · COMPÉTENCE ${catIndex+1}/5`;
    $('categoryTitle').textContent=CATEGORY_LABELS[q.cat];
    $('progressText').textContent=`Question ${state.written.totalIndex+1} / 50`;
    $('progressBar').style.width=`${(state.written.totalIndex/50)*100}%`;
    $('levelHint').textContent='Simulation pédagogique à difficulté progressive';
    $('questionTimer').textContent=formatTime(state.written.remainingQuestion);
    $('totalTimer').textContent=formatTime(state.written.remainingTotal);
    $('questionInstruction').textContent=q.cat==='listening'?'Écoutez l’enregistrement puis choisissez la meilleure réponse.':'Choisissez la meilleure réponse.';
    $('questionPrompt').textContent=q.prompt;
    $('readingPassage').classList.toggle('hidden',!q.passage); $('readingPassage').textContent=q.passage||'';
    $('listeningPanel').classList.toggle('hidden',q.cat!=='listening'); updateAudioLabel();
    $('options').innerHTML='';
    q.options.forEach((opt,i)=>{
      const b=document.createElement('button'); b.type='button'; b.className='option'; b.innerHTML=`<span class="option-key">${i+1}</span><span>${escapeHtml(opt)}</span>`; b.addEventListener('click',()=>selectOption(i)); $('options').appendChild(b);
    });
    $('validateBtn').disabled=true; $('practiceFeedback').classList.add('hidden');
  }
  function selectOption(i){ selectedOption=i; [...$('options').children].forEach((b,idx)=>b.classList.toggle('selected',idx===i)); $('validateBtn').disabled=false; }
  function submitAnswer(timeout=false){
    const q=currentQuestion(); if(!q) return;
    clearInterval(questionInterval); questionInterval=null;
    const correct=selectedOption===q.answer;
    const theta=state.written.categoryTheta[q.cat] ?? 2;
    const p=1/(1+Math.exp(-(theta-q.d)*1.25));
    state.written.categoryTheta[q.cat]=clamp(theta + .7*((correct?1:0)-p),.35,5.7);
    state.written.answers.push({id:q.id,cat:q.cat,d:q.d,selected:selectedOption,correct,timeout,answer:q.answer});
    if(correct){state.written.streak=Math.max(1,state.written.streak+1)}else{state.written.streak=Math.min(-1,state.written.streak-1)}
    if(state.written.streak>=2){state.written.currentDiff=Math.min(4,state.written.currentDiff+1);state.written.streak=0}
    if(state.written.streak<=-1){state.written.currentDiff=Math.max(1,state.written.currentDiff-1);state.written.streak=0}
    state.written.totalIndex++;
    state.written.questionInCategory++;
    if(state.written.questionInCategory>=10){ state.written.categoryIndex++; state.written.questionInCategory=0; state.written.currentDiff=2; state.written.streak=0; }
    state.written.currentId=null; selectedOption=null; saveState();
    if(state.written.totalIndex>=50 || state.written.categoryIndex>=5){ finishWritten(); } else setTimeout(loadNextQuestion,220);
  }
  function finishWritten(){ clearInterval(totalInterval);clearInterval(questionInterval);state.written.finished=true;state.written.currentId=null;saveState();setView('writtenDone'); }
  function startTotalTimer(){
    clearInterval(totalInterval); if(state.written.finished)return;
    totalInterval=setInterval(()=>{ state.written.remainingTotal=Math.max(0,state.written.remainingTotal-1); $('totalTimer').textContent=formatTime(state.written.remainingTotal); if(state.written.remainingTotal<=300)$('totalTimer').parentElement.classList.add('warning'); if(state.written.remainingTotal<=0){clearInterval(totalInterval);finishWritten();} if(state.written.remainingTotal%10===0)saveState(); },1000);
  }
  function startQuestionTimer(){
    clearInterval(questionInterval); questionInterval=setInterval(()=>{ state.written.remainingQuestion=Math.max(0,state.written.remainingQuestion-1); $('questionTimer').textContent=formatTime(state.written.remainingQuestion); $('questionTimer').parentElement.classList.toggle('warning',state.written.remainingQuestion<=10); if(state.written.remainingQuestion<=0){clearInterval(questionInterval);selectedOption=null;submitAnswer(true);} },1000);
  }
  function updateAudioLabel(){ const left=Math.max(0,2-state.written.audioPlays); $('audioPlays').textContent=`${left} écoute${left===1?'':'s'} disponible${left===1?'':'s'}`; $('playAudioBtn').disabled=left<=0; }
  function playCurrentAudio(){
    const q=currentQuestion(); if(!q || q.cat!=='listening' || state.written.audioPlays>=2)return;
    state.written.audioPlays++;updateAudioLabel();saveState();
    speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(q.script); u.lang=$('accentSelect')?.value||'en-GB';u.rate=.92;
    const voices=speechSynthesis.getVoices(); const v=voices.find(x=>x.lang&&x.lang.toLowerCase().startsWith(($('accentSelect')?.value||'en-GB').toLowerCase()))||voices.find(x=>x.lang&&x.lang.toLowerCase().startsWith('en'));
    if(v)u.voice=v; speechSynthesis.speak(u);
  }

  function renderOral(){
    $('oralPhases').innerHTML=oralPhases.map((p,idx)=>{
      const numbered = p.steps ? p.steps.map((item,i)=>`<div class="script-step"><div class="script-number">${i+1}</div><div><div class="say-this"><span>ASK</span>${escapeHtml(item.ask)}</div><div class="followups"><strong>Possible follow-ups:</strong> ${item.follow.map(x=>escapeHtml(x)).join(' · ')}</div></div></div>`).join('') : '';
      const roleplay = p.roleplay ? p.roleplay.map((item,i)=>`<div class="roleplay-step"><div class="roleplay-head"><span>${escapeHtml(item.label)}</span><small>Step ${i+1}</small></div><div class="say-this client-line"><span>SAY</span>${escapeHtml(item.say)}</div><div class="assess-note"><strong>Observe:</strong> ${escapeHtml(item.expect)}</div>${item.fallback?`<div class="followups"><strong>If needed:</strong> ${escapeHtml(item.fallback)}</div>`:''}</div>`).join('') : '';
      return `<article class="phase-card" id="oralPhase${idx+1}">
        <div class="phase-header"><div><div class="phase-time">${escapeHtml(p.time)}</div><h3>${escapeHtml(p.title)}</h3></div><button class="ghost small phase-jump" data-phase="${idx}" type="button">Afficher cette partie</button></div>
        <p class="phase-objective"><strong>Objectif :</strong> ${escapeHtml(p.objective)}</p>
        <div class="script-callout"><div class="script-label">SCRIPT EXACT · LIRE À VOIX HAUTE</div><p>${escapeHtml(p.startLine)}</p></div>
        ${numbered}${roleplay}
        ${p.rescue?`<div class="examiner-note"><strong>Si elle bloque :</strong> ${escapeHtml(p.rescue)}</div>`:''}
        ${p.stretch?`<div class="examiner-note stretch"><strong>Pour pousser le niveau :</strong> ${escapeHtml(p.stretch)}</div>`:''}
        ${p.transition?`<div class="script-callout transition"><div class="script-label">TRANSITION · LIRE À VOIX HAUTE</div><p>${escapeHtml(p.transition)}</p></div>`:''}
        ${p.closeLine?`<div class="script-callout transition"><div class="script-label">FIN · LIRE À VOIX HAUTE</div><p>${escapeHtml(p.closeLine)}</p></div>`:''}
      </article>`;
    }).join('');
    document.querySelectorAll('.phase-jump').forEach(btn=>btn.addEventListener('click',()=>setOralPhase(Number(btn.dataset.phase),true)));
    renderRubric('oralRubric',['Étendue et maîtrise du vocabulaire','Correction grammaticale et syntaxe','Fluidité et aisance','Prononciation et intonation','Qualité et capacité d’interaction'],state.oral.ratings,'oral');
    $('oralComments').value=state.oral.comments||''; $('oralTimer').textContent=formatTime(state.oral.remaining);
  }
  function setOralPhase(idx,scroll=false){
    idx=clamp(idx,0,oralPhases.length-1); state.oral.phase=idx;
    const label=['Partie 1 · Introduction','Partie 2 · Mise en situation','Partie 3 · Discussion'][idx];
    $('oralPhaseLabel').textContent=label;
    document.querySelectorAll('[data-oral-phase]').forEach(b=>b.classList.toggle('active',Number(b.dataset.oralPhase)===idx));
    saveState();
    if(scroll){ const el=$('oralPhase'+(idx+1)); if(el)el.scrollIntoView({behavior:'smooth',block:'start'}); }
  }
  function renderWriting(){
    $('writingTasks').innerHTML=writingTasks.map(t=>`<article class="writing-task"><div class="writing-task-top"><h2>${t.title}</h2><span class="word-target">${t.target}</span></div><div class="writing-prompt">${escapeHtml(t.prompt)}</div><textarea id="${t.id}" data-writing="${t.id}" placeholder="Write your answer here…">${escapeHtml(state.writing.answers[t.id]||'')}</textarea><div class="writing-meta"><span id="${t.id}Count">0 words</span><button class="ghost small teacher-only model-toggle" data-model="${t.id}" type="button">Afficher le modèle</button></div><div id="${t.id}Model" class="model-answer hidden teacher-only">${escapeHtml(t.model)}</div></article>`).join('');
    document.querySelectorAll('[data-writing]').forEach(el=>{updateWordCount(el.dataset.writing);el.addEventListener('input',()=>{state.writing.answers[el.dataset.writing]=el.value;updateWordCount(el.dataset.writing);saveState();});});
    document.querySelectorAll('.model-toggle').forEach(b=>b.addEventListener('click',()=>$(b.dataset.model+'Model').classList.toggle('hidden')));
    renderRubric('writingRubric',['Maîtrise du vocabulaire et des expressions','Correction grammaticale et structuration','Pertinence et précision','Organisation du message','Autonomie / richesse'],state.writing.ratings,'writing');
    $('writingComments').value=state.writing.comments||'';
  }
  function updateWordCount(id){ const el=$(id); if(!el)return; const words=el.value.trim()?el.value.trim().split(/\s+/).length:0; $(id+'Count').textContent=`${words} word${words===1?'':'s'}`; }
  function renderRubric(containerId,criteria,ratings,prefix){
    $(containerId).innerHTML=criteria.map((c,i)=>`<div class="rubric-item"><label>${c}</label><select data-rubric="${prefix}-${i}">${rubricLevels.map(l=>`<option ${ratings[i]===l?'selected':''}>${l}</option>`).join('')}</select></div>`).join('');
    document.querySelectorAll(`[data-rubric^="${prefix}-"]`).forEach(sel=>sel.addEventListener('change',()=>{const i=sel.dataset.rubric.split('-')[1];ratings[i]=sel.value;saveState();}));
  }
  function startOralTimer(){
    state.oral.started=true;clearInterval(oralInterval);oralInterval=setInterval(()=>{state.oral.remaining=Math.max(0,state.oral.remaining-1);$('oralTimer').textContent=formatTime(state.oral.remaining);if(state.oral.remaining<=0){clearInterval(oralInterval);toast('20 minutes écoulées');}if(state.oral.remaining%10===0)saveState();},1000);saveState();
  }
  async function startRecording(){
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true}); audioChunks=[]; mediaRecorder=new MediaRecorder(stream); mediaRecorder.ondataavailable=e=>audioChunks.push(e.data); mediaRecorder.onstop=()=>{const blob=new Blob(audioChunks,{type:'audio/webm'});const url=URL.createObjectURL(blob);$('recordingDownload').href=url;$('recordingDownload').classList.remove('hidden');stream.getTracks().forEach(t=>t.stop());}; mediaRecorder.start(); $('recordBtn').classList.add('hidden');$('stopRecordBtn').classList.remove('hidden');toast('Enregistrement en cours');
    }catch(e){toast('Microphone indisponible ou autorisation refusée');}
  }
  function stopRecording(){if(mediaRecorder&&mediaRecorder.state==='recording'){mediaRecorder.stop();$('recordBtn').classList.remove('hidden');$('stopRecordBtn').classList.add('hidden');}}

  function writtenStats(){
    const out={};CATEGORY_ORDER.forEach(cat=>{const a=state.written.answers.filter(x=>x.cat===cat);const correct=a.filter(x=>x.correct).length;const raw=a.length?Math.round(correct/a.length*100):0;const theta=state.written.categoryTheta[cat]??0;out[cat]={correct,total:a.length,raw,theta,level:thetaToLevel(theta)};});return out;
  }
  function thetaToLevel(t){ if(t<1.15)return 'A1'; if(t<2.05)return 'A2'; if(t<3.05)return 'B1'; if(t<4.05)return 'B2'; if(t<5.0)return 'C1'; return 'C2'; }
  function levelToNum(l){ const base=(l||'').replace(/[+−-]/g,''); return ({A1:1,A2:2,B1:3,B2:4,C1:5,C2:6}[base]||0)+(l?.includes('+')?.2:l?.includes('−')||l?.includes('-')?-.2:0); }
  function numToLevel(n){ if(!n)return '—'; if(n<1.5)return 'A1'; if(n<2.5)return 'A2'; if(n<3.5)return 'B1'; if(n<4.5)return 'B2'; if(n<5.5)return 'C1'; return 'C2'; }
  function rubricAverage(ratings){ const vals=Object.values(ratings||{}).map(v=>rubricValue[v]).filter(v=>Number.isFinite(v)); return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0; }
  function parseScore20(value){
    if(value===null || value===undefined || value==='') return null;
    const n=Number(value);
    return Number.isFinite(n) ? clamp(n,0,20) : null;
  }
  function manualLevelValue(section){
    const level=state.manualGrades?.[section]?.level||'';
    return rubricValue[level] ?? (level ? levelToNum(level) : 0);
  }
  function sectionAssessment(section,ratings){
    const manual=state.manualGrades?.[section]||{};
    const score20=parseScore20(manual.score20);
    const manualLevel=manual.level||'';
    const rubricNum=rubricAverage(ratings);
    const value=manualLevel ? manualLevelValue(section) : rubricNum;
    const level=manualLevel || (rubricNum ? numToLevel(rubricNum) : '');
    const percent=score20!==null ? Math.round(score20*5) : (rubricNum ? levelPercent(rubricNum) : null);
    return {value,level,score20,percent,isManual:score20!==null||!!manualLevel};
  }
  function computeOverall(){
    const stats=writtenStats();
    const wVals=CATEGORY_ORDER.filter(c=>stats[c].total===10).map(c=>levelToNum(stats[c].level)).filter(Boolean);
    const computer=wVals.length?wVals.reduce((a,b)=>a+b,0)/wVals.length:0;
    const oralAssessment=sectionAssessment('oral',state.oral.ratings);
    const writingAssessment=sectionAssessment('writing',state.writing.ratings);
    const oral=oralAssessment.value;
    const writing=writingAssessment.value;
    // CLOE-style overall prioritises computer + oral. Writing extension supports the pedagogical profile but does not dominate.
    // Manual /20 scores are displayed as scores; the trainer-selected CECRL level is used for the CECRL synthesis.
    let overall=computer; if(oral) overall=(computer+oral)/2; if(writing) overall=(overall*.85)+(writing*.15);
    return {stats,computer,oral,writing,oralAssessment,writingAssessment,overall,level:numToLevel(overall)};
  }
  function ensureManualGradePanel(){
    // Recovery-safe: v4.3 can add the post-exam grading UI even when Phoenix
    // is still serving an older cached index.html. Nothing here resets data.
    if(!document.getElementById('manualGradeInjectedStyles')){
      const style=document.createElement('style');
      style.id='manualGradeInjectedStyles';
      style.textContent=`
        .manual-final-card{border-top:4px solid var(--orange,#f07f22)}
        .manual-final-card .muted strong{color:var(--navy,#171743)}
        .manual-grade-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:18px}
        .manual-grade-box{border:1px solid var(--line,#d9dbe5);border-radius:9px;padding:18px;background:#fafafe}
        .manual-grade-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px}
        .manual-grade-head h3{margin:0;color:var(--navy,#171743);font-size:19px}
        .manual-percent{min-width:72px;padding:9px 10px;border-radius:8px;background:#fff3e8;color:#d96610;font-size:20px;font-weight:900;text-align:center}
        .manual-fields{display:grid;grid-template-columns:.7fr 1.3fr;gap:12px;margin-top:15px}
        .manual-fields label>span{display:block;font-size:11px;font-weight:800;color:var(--navy,#171743);margin-bottom:6px}
        .manual-fields input,.manual-fields select{width:100%;border:1px solid #cfd1dc;border-radius:7px;padding:10px 11px;background:#fff;color:var(--ink,#202235)}
        .manual-grade-box .ghost{margin-top:12px}
        .manual-grade-actions{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-top:18px;padding-top:16px;border-top:1px solid var(--line,#d9dbe5)}
        .manual-safe-note{font-size:12px;font-weight:700;color:var(--green,#2e7d5a)}
        @media(max-width:800px){.manual-grade-grid{grid-template-columns:1fr}.manual-fields{grid-template-columns:1fr}.manual-grade-actions{align-items:stretch;flex-direction:column}}
      `;
      document.head.appendChild(style);
    }
    if(document.querySelector('.manual-final-card')) return;
    const anchor=document.getElementById('resultsCards');
    if(!anchor) return;
    const card=document.createElement('div');
    card.className='rubric-card teacher-only manual-final-card';
    card.innerHTML=`
      <div class="qualiopi-head">
        <div>
          <div class="eyebrow">NOTATION MANUELLE APRÈS L’ÉPREUVE</div>
          <h2>Ajouter ou modifier les notes d’oral et d’écrit</h2>
          <p class="muted">Ces champs permettent de noter les productions après coup <strong>sans effacer les réponses de Nathalie</strong>. La note /20 et le niveau CECRL sont enregistrés dans le même navigateur et repris dans la synthèse, le rapport JSON et le certificat.</p>
        </div>
      </div>
      <div class="manual-grade-grid">
        <section class="manual-grade-box">
          <div class="manual-grade-head"><div><span class="eyebrow">EXPRESSION ORALE</span><h3>Note formateur</h3></div><div id="oralManualPercent" class="manual-percent">—</div></div>
          <div class="manual-fields">
            <label><span>Note /20</span><input id="oralManualScore" type="number" min="0" max="20" step="0.5" inputmode="decimal" placeholder="Ex. 14"></label>
            <label><span>Niveau CECRL observé</span><select id="oralManualLevel"><option value="">Non évalué</option><option>A1−</option><option>A1</option><option>A1+</option><option>A2−</option><option>A2</option><option>A2+</option><option>B1−</option><option>B1</option><option>B1+</option><option>B2−</option><option>B2</option><option>B2+</option><option>C1</option><option>C2</option></select></label>
          </div>
          <label class="field-label" for="oralManualComments">Commentaire oral</label>
          <textarea id="oralManualComments" rows="4" placeholder="Points forts, fluidité, interaction, priorités…"></textarea>
          <button id="clearOralManualBtn" class="ghost small" type="button">Effacer uniquement la note manuelle</button>
        </section>
        <section class="manual-grade-box">
          <div class="manual-grade-head"><div><span class="eyebrow">PRODUCTION ÉCRITE</span><h3>Note formateur</h3></div><div id="writingManualPercent" class="manual-percent">—</div></div>
          <div class="manual-fields">
            <label><span>Note /20</span><input id="writingManualScore" type="number" min="0" max="20" step="0.5" inputmode="decimal" placeholder="Ex. 13"></label>
            <label><span>Niveau CECRL observé</span><select id="writingManualLevel"><option value="">Non évalué</option><option>A1−</option><option>A1</option><option>A1+</option><option>A2−</option><option>A2</option><option>A2+</option><option>B1−</option><option>B1</option><option>B1+</option><option>B2−</option><option>B2</option><option>B2+</option><option>C1</option><option>C2</option></select></label>
          </div>
          <label class="field-label" for="writingManualComments">Commentaire écrit</label>
          <textarea id="writingManualComments" rows="4" placeholder="Correction, respect des consignes, richesse, autonomie…"></textarea>
          <button id="clearWritingManualBtn" class="ghost small" type="button">Effacer uniquement la note manuelle</button>
        </section>
      </div>
      <div class="manual-grade-actions"><span class="manual-safe-note">✓ Les réponses et les scores automatiques restent intacts.</span><button id="saveManualGradesBtn" class="primary" type="button">Enregistrer les notes et recalculer</button></div>`;
    anchor.insertAdjacentElement('afterend',card);
  }

  function renderManualGrades(){
    if(!state.manualGrades) state.manualGrades=defaultState().manualGrades;
    const oral=state.manualGrades.oral||{};
    const writing=state.manualGrades.writing||{};
    if($('oralManualScore')) $('oralManualScore').value=oral.score20??'';
    if($('oralManualLevel')) $('oralManualLevel').value=oral.level||'';
    if($('oralManualComments')) $('oralManualComments').value=state.oral.comments||'';
    if($('writingManualScore')) $('writingManualScore').value=writing.score20??'';
    if($('writingManualLevel')) $('writingManualLevel').value=writing.level||'';
    if($('writingManualComments')) $('writingManualComments').value=state.writing.comments||'';
    updateManualPercent('oral');
    updateManualPercent('writing');
  }
  function updateManualPercent(section){
    const scoreEl=$(section+'ManualScore');
    const percentEl=$(section+'ManualPercent');
    if(!scoreEl || !percentEl) return;
    const score=parseScore20(scoreEl.value);
    percentEl.textContent=score===null?'—':`${Math.round(score*5)}%`;
  }
  function saveManualGrades(){
    if(!state.manualGrades) state.manualGrades=defaultState().manualGrades;
    ['oral','writing'].forEach(section=>{
      const scoreEl=$(section+'ManualScore');
      const levelEl=$(section+'ManualLevel');
      if(!scoreEl || !levelEl) return;
      const score=parseScore20(scoreEl.value);
      state.manualGrades[section]={
        score20:score===null?'':score,
        level:levelEl.value||''
      };
    });
    if($('oralManualComments')) state.oral.comments=$('oralManualComments').value;
    if($('writingManualComments')) state.writing.comments=$('writingManualComments').value;
    saveState();
    renderResults();
    toast('Notes manuelles enregistrées · réponses conservées');
  }
  function clearManualGrade(section){
    const label=section==='oral'?'la note orale':'la note écrite';
    if(!confirm(`Effacer uniquement ${label} ? Les réponses de Nathalie seront conservées.`)) return;
    state.manualGrades[section]={score20:'',level:''};
    saveState();
    renderResults();
    toast('Note manuelle effacée · réponses conservées');
  }
  function formatManualScore(a){
    if(a.score20===null) return null;
    return `${Number.isInteger(a.score20)?a.score20:a.score20.toFixed(1)}/20 · ${a.percent}%`;
  }
  function renderResults(){
    const r=computeOverall(); $('overallBadge').textContent=(state.written.finished&&r.oralAssessment.level)?r.level:'À évaluer';
    const cards=CATEGORY_ORDER.map(cat=>{
      const st=r.stats[cat], completed=st.total===10;
      return {label:CATEGORY_LABELS[cat],score:st.total?st.raw:null,
        level:completed?st.level:'Non évalué',
        sub:completed?`${st.correct}/10 réponses · ${(st.correct*2).toFixed(0)}/20`:`${st.correct}/${st.total}/10 réponses · en cours`};
    });
    const oa=r.oralAssessment, wa=r.writingAssessment;
    cards.push({label:'Expression orale',score:oa.percent,level:oa.level||'À noter',sub:oa.score20!==null?`${formatManualScore(oa)} · note manuelle`:'Évaluation par la formatrice'});
    cards.push({label:'Production écrite',score:wa.percent,level:wa.level||'À noter',sub:wa.score20!==null?`${formatManualScore(wa)} · note manuelle`:'Évaluation par la formatrice'});
    $('resultsCards').innerHTML=cards.map(c=>`<article class="result-card"><div class="label">${c.label}</div><div class="score-row"><strong>${c.score===null?'—':c.score+'%'}</strong><span class="level">${c.level}</span></div><div class="meter"><span style="width:${c.score||0}%"></span></div><small>${c.sub}</small></article>`).join('');
    const gradeRows=CATEGORY_ORDER.map(cat=>{
      const st=r.stats[cat], complete=st.total===10;
      return `<tr><td><strong>${CATEGORY_LABELS[cat]}</strong></td><td>${st.correct}/${st.total} (sur 10 attendues)</td><td>${complete?(st.correct*2)+'/20':'—'}</td><td>${st.total?st.raw+' %':'—'}</td><td>${complete?st.level:'Non évalué'}</td></tr>`;
    });
    gradeRows.push(`<tr><td><strong>Expression orale</strong></td><td>Évaluation formatrice</td><td>${oa.score20!==null?oa.score20+'/20':'—'}</td><td>${oa.percent!==null?oa.percent+' %':'—'}</td><td>${oa.level||'Non évalué'}</td></tr>`);
    gradeRows.push(`<tr><td><strong>Production écrite</strong></td><td>Évaluation formatrice</td><td>${wa.score20!==null?wa.score20+'/20':'—'}</td><td>${wa.percent!==null?wa.percent+' %':'—'}</td><td>${wa.level||'Non évalué'}</td></tr>`);
    $('categoryGradeRows').innerHTML=gradeRows.join('');
    const baseline=0; const progress=r.overall?Math.max(0,r.overall-baseline):0;
    let summary=`Niveau pédagogique estimé : ${r.level}.\n\n`;
    if(state.written.finished){ const best=[...CATEGORY_ORDER].sort((a,b)=>r.stats[b].raw-r.stats[a].raw)[0]; const weak=[...CATEGORY_ORDER].sort((a,b)=>r.stats[a].raw-r.stats[b].raw)[0]; summary+=`Épreuve informatisée : point fort actuel — ${CATEGORY_LABELS[best]} (${r.stats[best].raw} %). Axe à consolider — ${CATEGORY_LABELS[weak]} (${r.stats[weak].raw} %).\n`; }
    if(oa.level){ summary+=`Expression orale : ${oa.score20!==null?formatManualScore(oa)+' · ':''}${oa.level}. `; } else summary+='Expression orale : notation formateur à compléter. ';
    if(wa.level){ summary+=`Production écrite : ${wa.score20!==null?formatManualScore(wa)+' · ':''}${wa.level}.\n`; } else if(wa.score20!==null){ summary+=`Production écrite : ${formatManualScore(wa)} · niveau CECRL à sélectionner.\n`; } else summary+='Production écrite : notation formateur à compléter.\n';
    if(r.overall>0)summary+='Résultat de simulation pédagogique, sans comparaison chiffrée avec un niveau initial officiel non renseigné.';
    $('summaryText').textContent=summary; $('finalComments').value=state.finalComments||''; $('finalStatus').value=state.finalStatus||'Non commencé'; renderManualGrades(); renderQualiopi(r); renderConnectRows(r);
  }
  function levelPercent(n){ if(!n)return null; return Math.round(clamp((n/6)*100,0,100)); }
  function renderCertificate(){
    const r=computeOverall(); $('certLevel').textContent=(state.written.finished&&r.oralAssessment.level)?r.level:'—'; $('certDate').textContent=new Intl.DateTimeFormat('fr-FR',{dateStyle:'long'}).format(new Date());
    const descriptors={A1:'peut communiquer de façon simple dans des situations très familières.',A2:'peut communiquer dans des situations courantes et professionnelles simples avec une autonomie croissante.',B1:'peut faire face à la plupart des situations courantes, expliquer ses choix et maintenir une interaction professionnelle simple.',B2:'peut interagir avec aisance et précision dans de nombreuses situations professionnelles, en développant et justifiant ses idées.',C1:'peut communiquer avec souplesse, précision et autonomie dans des contextes professionnels exigeants.',C2:'peut communiquer avec une maîtrise très fine, spontanée et précise dans pratiquement toute situation.'};
    $('certDescriptor').textContent=descriptors[r.level]||'Niveau en attente de l’évaluation finale.';
    const s=r.stats,oa=r.oralAssessment,wa=r.writingAssessment;
    $('certScores').innerHTML=`<span class="cert-score">Vocabulaire ${s.vocabulary.level}</span><span class="cert-score">Grammaire ${s.grammar.level}</span><span class="cert-score">Expressions ${s.expressions.level}</span><span class="cert-score">Lecture ${s.reading.level}</span><span class="cert-score">Écoute ${s.listening.level}</span>${oa.level?`<span class="cert-score">Oral ${oa.level}${oa.score20!==null?' · '+formatManualScore(oa):''}</span>`:''}${wa.level?`<span class="cert-score">Écrit ${wa.level}${wa.score20!==null?' · '+formatManualScore(wa):''}</span>`:''}`;
    $('certProgress').textContent='Bilan pédagogique final indépendant. Aucun niveau initial officiel renseigné pour Nathalie.';
  }

  function renderQualiopi(r){
    if(!state.qualiopi) state.qualiopi={statuses:{}};
    const rows=[
      ['Vocabulaire','Auto',r.stats.vocabulary.raw+' %',r.stats.vocabulary.level,'vocabulary'],
      ['Grammaire & syntaxe','Auto',r.stats.grammar.raw+' %',r.stats.grammar.level,'grammar'],
      ['Expressions','Auto',r.stats.expressions.raw+' %',r.stats.expressions.level,'expressions'],
      ['Compréhension écrite','Auto',r.stats.reading.raw+' %',r.stats.reading.level,'reading'],
      ['Compréhension orale','Auto',r.stats.listening.raw+' %',r.stats.listening.level,'listening'],
      ['Expression orale','Manuel',r.oralAssessment.score20!==null?formatManualScore(r.oralAssessment):(r.oralAssessment.level||'À noter'),r.oralAssessment.level||'—','oral'],
      ['Production écrite','Manuel',r.writingAssessment.score20!==null?formatManualScore(r.writingAssessment):(r.writingAssessment.level||'À noter'),r.writingAssessment.level||'—','writing']
    ];
    const statuses=['Non commencé','En cours','Acquis','Non acquis'];
    $('qualiopiRows').innerHTML=rows.map(([label,type,score,level,key])=>`<tr><td><strong>${label}</strong><br><small>${type}</small></td><td>${score}</td><td><strong>${level}</strong></td><td><select data-qstatus="${key}">${statuses.map(st=>`<option ${((state.qualiopi.statuses||{})[key]||inferStatus(key,r))===st?'selected':''}>${st}</option>`).join('')}</select></td></tr>`).join('');
    document.querySelectorAll('[data-qstatus]').forEach(sel=>sel.addEventListener('change',()=>{state.qualiopi.statuses[sel.dataset.qstatus]=sel.value;saveState();}));
  }
  function renderConnectRows(r){
    const el=$('connectRows');if(!el)return;
    const mapping=[['vocabulary','Vocabulaire · lexique des visites et quotidien'],['grammar','Grammaire · choix des temps et syntaxe'],['expressions','Expressions · politesse et interaction'],['reading','Compréhension écrite · consignes, courriels et annonces'],['listening','Compréhension orale · annonces et situations'],['oral','Expression orale · entretien en 3 phases'],['writing','Production écrite · extension pédagogique']];
    el.innerHTML=mapping.map(([key,title])=>{
      const a=state.written.answers.filter(x=>x.cat===key);
      const total=a.length,score=a.filter(x=>x.correct).length;
      const grade=key==='oral'?r.oralAssessment:key==='writing'?r.writingAssessment:null;
      const done=grade?Boolean(grade.level):total===10;
      const observed=grade?(grade.score20==null?(grade.level||'À évaluer'):(grade.score20+'/20')):(total?Math.round(score/total*100)+' %':'—');
      const stat=state.qualiopi?.statuses?.[key]|| (done?'En cours':'Non commencé');
      return `<tr><td>${escapeHtml(title)}</td><td>${grade?(done?'Évalué':'À noter'):total+'/10'}</td><td>${grade?'Notation manuelle':score+'/'+total}</td><td>${observed}</td><td>${escapeHtml(stat)}</td></tr>`;
    }).join('');
  }
  function exportConnect(){
    const r=computeOverall();const keys=['vocabulary','grammar','expressions','reading','listening','oral','writing'];
    const labels=['Vocabulaire','Grammaire et syntaxe','Expressions','Compréhension écrite','Compréhension orale','Expression orale','Production écrite'];
    const lines=[['Apprenant','Date séance','Compétence / objectif','Exercices réalisés','Bonnes réponses','Résultat','Statut','Commentaires']];
    keys.forEach((key,i)=>{const a=state.written.answers.filter(x=>x.cat===key);const grade=key==='oral'?r.oralAssessment:key==='writing'?r.writingAssessment:null;lines.push(['Nathalie Le Quec',$('connectDate')?.value||'',labels[i],grade?(grade.level?'Évalué':'À noter'):a.length+'/10',grade?'Manuel':a.filter(x=>x.correct).length+'/'+a.length,grade?(grade.level||'Non évalué'):(a.length?Math.round(a.filter(x=>x.correct).length/a.length*100)+' %':'—'),state.qualiopi?.statuses?.[key]||'Non commencé',$('connectNotes')?.value||'']);});
    const safe=v=>String(v??'').replace(/[\t\r\n]+/g,' ');
    const blob=new Blob([lines.map(row=>row.map(safe).join('\t')).join('\n')],{type:'text/tab-separated-values;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Nathalie_ConnectLearning_bilan_objectifs.tsv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  function inferStatus(key,r){
    if(key==='oral') return r.oralAssessment.level?'En cours':'Non commencé';
    if(key==='writing') return r.writingAssessment.level?'En cours':'Non commencé';
    return state.written.finished?'En cours':'Non commencé';
  }
  function copySummary(){
    const r=computeOverall(),oa=r.oralAssessment,wa=r.writingAssessment;
    const oralTxt=oa.level?`${oa.score20!==null?formatManualScore(oa)+' · ':''}${oa.level}`:(oa.score20!==null?`${formatManualScore(oa)} · niveau à compléter`:'à compléter');
    const writingTxt=wa.level?`${wa.score20!==null?formatManualScore(wa)+' · ':''}${wa.level}`:(wa.score20!==null?`${formatManualScore(wa)} · niveau à compléter`:'à compléter');
    const txt=`Nathalie Le Quec — Bilan final\nNiveau pédagogique estimé : ${r.level}\nVocabulaire : ${r.stats.vocabulary.raw}% (${r.stats.vocabulary.level})\nGrammaire : ${r.stats.grammar.raw}% (${r.stats.grammar.level})\nExpressions : ${r.stats.expressions.raw}% (${r.stats.expressions.level})\nCompréhension écrite : ${r.stats.reading.raw}% (${r.stats.reading.level})\nCompréhension orale : ${r.stats.listening.raw}% (${r.stats.listening.level})\nExpression orale : ${oralTxt}\nProduction écrite : ${writingTxt}\n\n${state.finalComments||''}`;
    navigator.clipboard?.writeText(txt).then(()=>toast('Synthèse copiée')).catch(()=>toast('Copie indisponible dans ce navigateur'));
  }

  function resetSection(which){
    const label=which==='written'?'l’épreuve écrite et toutes ses réponses':which==='oral'?'l’oral, ses notes et commentaires':'la production écrite et les trois réponses rédigées';
    if(!confirm(`ATTENTION : réinitialiser ${label} ? Cette action effacera les données de cette section.`))return;
    const fresh=defaultState();
    if(which==='written') state.written=fresh.written;
    if(which==='oral'){ state.oral=fresh.oral; state.manualGrades.oral=fresh.manualGrades.oral; }
    if(which==='writing'){ state.writing=fresh.writing; state.manualGrades.writing=fresh.manualGrades.writing; }
    saveState(); renderOral(); renderWriting(); renderResults(); toast('Section réinitialisée');
  }

  function downloadResults(){
    const r=computeOverall();
    const payload={candidate:'Nathalie Le Quec',assessment:'Simulation pédagogique indépendante de type CLOE',date:new Date().toISOString(),priorOfficialResult:null,computerTest:r.stats,manualGrades:state.manualGrades,oralAssessment:r.oralAssessment,oralRatings:state.oral.ratings,oralComments:state.oral.comments,writingAssessment:r.writingAssessment,writingAnswers:state.writing.answers,writingRatings:state.writing.ratings,writingComments:state.writing.comments,estimatedLevel:r.level,finalComments:state.finalComments,qualiopiStatus:state.finalStatus,qualiopiCompetencyStatuses:state.qualiopi?.statuses||{},disclaimer:'Private pedagogical assessment; not an official CLOE/CCI France certificate.'};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Nathalie_Gulliver_CLOE_Bilan_Final.json';a.click();URL.revokeObjectURL(a.href);
  }

  function resetAll(){ if(!confirm('Réinitialiser toute l’évaluation ? Cette action effacera les réponses et les notes sauvegardées dans ce navigateur.'))return; localStorage.removeItem(STORAGE_KEY);location.reload(); }
  function formatTime(sec){ const m=Math.floor(sec/60).toString().padStart(2,'0');const s=(sec%60).toString().padStart(2,'0');return `${m}:${s}`; }
  function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
  function escapeHtml(str){return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

  function init(){
    // Render first, then restore the saved page immediately. This prevents a refresh
    // from appearing to send a completed attempt back to the beginning.
    renderOral();
    renderWriting();
    ensureManualGradePanel();
    setMode(state.mode||'candidate');
    setOralPhase(state.oral.phase||0,false);
    setView(state.view&&views[state.view]?state.view:'home');

    if(state.written.started&&!state.written.finished && $('resumeBtn')) $('resumeBtn').classList.remove('hidden');
    if(state.written.finished && $('startWrittenBtn')) $('startWrittenBtn').textContent='Recommencer uniquement après réinitialisation';
    const hasSavedAttempt=state.written.finished || (state.written.answers||[]).length>0 || Object.values(state.writing?.answers||{}).some(v=>String(v||'').trim());
    if(hasSavedAttempt && $('openSavedResultsBtn')) $('openSavedResultsBtn').classList.remove('hidden');

    on('startWrittenBtn','click',()=>{if(state.written.finished){toast('Utilisez Réinitialiser dans le bilan pour recommencer.');return;}startWritten();});
    on('resumeBtn','click',startWritten); on('openSavedResultsBtn','click',()=>{setMode('teacher');setView('results');}); on('validateBtn','click',()=>submitAnswer(false)); on('playAudioBtn','click',playCurrentAudio);
    on('candidateViewBtn','click',()=>setMode('candidate')); on('teacherViewBtn','click',()=>setMode('teacher'));
    on('goOralBtn','click',()=>setView('oral')); on('goWritingBtn','click',()=>setView('writing')); on('oralToWritingBtn','click',()=>setView('writing')); on('goResultsBtn','click',()=>setView('results'));
    document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.nav)));
    on('startOralTimerBtn','click',startOralTimer); on('recordBtn','click',startRecording); on('stopRecordBtn','click',stopRecording);
    document.querySelectorAll('[data-oral-phase]').forEach(b=>b.addEventListener('click',()=>setOralPhase(Number(b.dataset.oralPhase),false)));
    on('showExaminerScriptBtn','click',()=>{setMode('teacher');setOralPhase(state.oral.phase||0,true);});
    on('saveOralBtn','click',()=>{state.oral.comments=$('oralComments')?.value||state.oral.comments;state.oral.finished=true;saveState();toast('Évaluation orale enregistrée');});
    on('saveWritingBtn','click',()=>{state.writing.comments=$('writingComments')?.value||state.writing.comments;saveState();toast('Évaluation écrite enregistrée');});
    on('oralManualScore','input',()=>updateManualPercent('oral'));
    on('writingManualScore','input',()=>updateManualPercent('writing'));
    on('saveManualGradesBtn','click',saveManualGrades);
    on('clearOralManualBtn','click',()=>clearManualGrade('oral'));
    on('clearWritingManualBtn','click',()=>clearManualGrade('writing'));
    on('finalComments','input',()=>{state.finalComments=$('finalComments').value;saveState();});
    on('finalStatus','change',()=>{state.finalStatus=$('finalStatus').value;saveState();});
    on('refreshResultsBtn','click',()=>{renderResults();toast('Bilan recalculé');});
    on('connectExport','click',exportConnect); ['connectDate','connectNotes'].forEach(id=>on(id,'change',()=>{localStorage.setItem('nathalie_connect_'+id,$(id).value);})); ['connectDate','connectNotes'].forEach(id=>{if($(id))$(id).value=localStorage.getItem('nathalie_connect_'+id)||'';}); on('downloadResultsBtn','click',downloadResults); on('copySummaryBtn','click',copySummary);
    on('printReportBtn','click',()=>{document.body.classList.add('print-results');window.print();setTimeout(()=>document.body.classList.remove('print-results'),300);});
    on('showCertificateBtn','click',()=>setView('certificate'));
    on('resetWrittenBtn','click',()=>resetSection('written')); on('resetOralBtn','click',()=>resetSection('oral')); on('resetWritingBtn','click',()=>resetSection('writing'));
    on('backResultsBtn','click',()=>setView('results')); on('printCertificateBtn','click',()=>window.print()); on('resetAllBtn','click',resetAll);

    document.addEventListener('keydown',e=>{if(!views.written.classList.contains('active'))return; if(['1','2','3','4'].includes(e.key)){const idx=Number(e.key)-1;if(currentQuestion()?.options[idx])selectOption(idx);} if(e.key==='Enter'&&!$('validateBtn').disabled)submitAnswer(false);});
    if(state.view==='written'&&state.written.started&&!state.written.finished){renderCurrentQuestion();startTotalTimer();startQuestionTimer();}
  }
  init();
})();
