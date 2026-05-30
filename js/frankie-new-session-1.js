(function(){
  "use strict";

  var selectedVoice = "en-US";
  var voices = [];
  var currentIntroModel = "a2";
  var introModels = { a2:"", a2plus:"", b1minus:"" };
  var sortIndex = 0;
  var orderIndex = 0;
  var oralIndex = 0;
  var placedWords = [];

  var vocabData = {
    "progress": [
        {
            "icon": "🌟",
            "term": "progress",
            "fr": "les progrès",
            "definition": "an improvement over time",
            "example": "I can see my progress in English."
        },
        {
            "icon": "🎉",
            "term": "achievement",
            "fr": "une réussite",
            "definition": "something good that you worked for and completed",
            "example": "Passing the CLOE exam is a real achievement."
        },
        {
            "icon": "💪",
            "term": "confidence",
            "fr": "la confiance",
            "definition": "the feeling that you can do something",
            "example": "I want to speak with more confidence."
        },
        {
            "icon": "🎯",
            "term": "goal",
            "fr": "un objectif",
            "definition": "something you want to do or improve",
            "example": "My goal is to understand simple conversations."
        },
        {
            "icon": "🚀",
            "term": "improve",
            "fr": "s'améliorer",
            "definition": "to become better",
            "example": "I am going to improve my speaking."
        },
        {
            "icon": "🌱",
            "term": "keep practising",
            "fr": "continuer à pratiquer",
            "definition": "to practise again and again",
            "example": "I do not need to be perfect. I need to keep practising."
        }
    ],
    "learning": [
        {
            "icon": "📚",
            "term": "lesson",
            "fr": "un cours / une leçon",
            "definition": "a period of learning with a teacher",
            "example": "This lesson is the first lesson of my new programme."
        },
        {
            "icon": "🗣️",
            "term": "speaking",
            "fr": "l'expression orale",
            "definition": "using your voice to communicate",
            "example": "Speaking is my priority this year."
        },
        {
            "icon": "🎧",
            "term": "listening",
            "fr": "la compréhension orale",
            "definition": "understanding spoken English",
            "example": "Listening is easier when the person speaks slowly."
        },
        {
            "icon": "✍️",
            "term": "writing",
            "fr": "l'expression écrite",
            "definition": "making sentences or messages in English",
            "example": "I am going to write clearer messages."
        },
        {
            "icon": "📖",
            "term": "reading",
            "fr": "la compréhension écrite",
            "definition": "understanding written texts",
            "example": "Reading is one of my strengths."
        },
        {
            "icon": "🔁",
            "term": "repeat",
            "fr": "répéter",
            "definition": "to say or do something again",
            "example": "Can you repeat, please?"
        }
    ],
    "survival": [
        {
            "icon": "🛟",
            "term": "Can you repeat, please?",
            "fr": "Pouvez-vous répéter, s'il vous plaît ?",
            "definition": "a polite phrase when you did not understand",
            "example": "Sorry, can you repeat, please?"
        },
        {
            "icon": "🐢",
            "term": "Can you speak more slowly, please?",
            "fr": "Pouvez-vous parler plus lentement, s'il vous plaît ?",
            "definition": "a polite phrase to ask for slower speech",
            "example": "Can you speak more slowly, please? I am learning English."
        },
        {
            "icon": "❓",
            "term": "I don't understand this word.",
            "fr": "Je ne comprends pas ce mot.",
            "definition": "a simple way to explain a problem",
            "example": "I don't understand this word. Can you explain it?"
        },
        {
            "icon": "⏳",
            "term": "Let me think.",
            "fr": "Laissez-moi réfléchir.",
            "definition": "a phrase to take time before answering",
            "example": "Let me think. I need a few seconds."
        },
        {
            "icon": "🤔",
            "term": "Do you mean...?",
            "fr": "Vous voulez dire... ?",
            "definition": "a phrase to check meaning",
            "example": "Do you mean today or tomorrow?"
        },
        {
            "icon": "📝",
            "term": "Can you write it down?",
            "fr": "Pouvez-vous l'écrire ?",
            "definition": "a phrase to ask for written help",
            "example": "Can you write it down, please?"
        }
    ],
    "personal": [
        {
            "icon": "👤",
            "term": "introduce myself",
            "fr": "me présenter",
            "definition": "to say who you are",
            "example": "I can introduce myself in simple English."
        },
        {
            "icon": "🏡",
            "term": "I live in...",
            "fr": "J'habite à / en...",
            "definition": "a phrase to say where your home is",
            "example": "I live in France."
        },
        {
            "icon": "👨‍👩‍👧‍👦",
            "term": "family",
            "fr": "la famille",
            "definition": "the people related to you",
            "example": "I have three children in my family."
        },
        {
            "icon": "🧑‍🦱",
            "term": "adults",
            "fr": "des adultes",
            "definition": "people who are not children anymore",
            "example": "My children are adults now."
        },
        {
            "icon": "🐶",
            "term": "dog",
            "fr": "un chien / une chienne",
            "definition": "a common pet",
            "example": "I have a dog."
        },
        {
            "icon": "🥾",
            "term": "walk in the mountains",
            "fr": "marcher à la montagne",
            "definition": "to go for a walk in a mountain area",
            "example": "At the weekend, I like walking in the mountains."
        }
    ],
    "time": [
        {
            "icon": "📅",
            "term": "last month",
            "fr": "le mois dernier",
            "definition": "a time marker for the past",
            "example": "Last month, I passed my exam."
        },
        {
            "icon": "🕘",
            "term": "every week",
            "fr": "chaque semaine",
            "definition": "a time marker for a habit",
            "example": "I practise English every week."
        },
        {
            "icon": "➡️",
            "term": "next lesson",
            "fr": "le prochain cours",
            "definition": "a time marker for the future",
            "example": "Next lesson, I am going to ask more questions."
        },
        {
            "icon": "🌅",
            "term": "this weekend",
            "fr": "ce week-end",
            "definition": "the coming weekend or the current weekend",
            "example": "This weekend, I am going to the mountains."
        },
        {
            "icon": "🗓️",
            "term": "schedule",
            "fr": "un programme / un planning",
            "definition": "a plan with times and activities",
            "example": "What is the schedule for today?"
        },
        {
            "icon": "⏱️",
            "term": "on time",
            "fr": "à l'heure",
            "definition": "not late",
            "example": "The train is on time."
        }
    ],
    "travel": [
        {
            "icon": "✈️",
            "term": "flight",
            "fr": "un vol",
            "definition": "a journey by plane",
            "example": "My flight is to London."
        },
        {
            "icon": "🚪",
            "term": "gate",
            "fr": "une porte d'embarquement",
            "definition": "the place where you board the plane",
            "example": "Where is gate B12?"
        },
        {
            "icon": "🧳",
            "term": "luggage",
            "fr": "les bagages",
            "definition": "bags you take when you travel",
            "example": "I have one piece of luggage."
        },
        {
            "icon": "🛂",
            "term": "customs",
            "fr": "la douane",
            "definition": "the place where officials check travellers and goods",
            "example": "I need to go through customs."
        },
        {
            "icon": "📍",
            "term": "destination",
            "fr": "la destination",
            "definition": "the place where you are going",
            "example": "My destination is London."
        },
        {
            "icon": "🆘",
            "term": "Can you help me?",
            "fr": "Pouvez-vous m'aider ?",
            "definition": "a simple phrase when you need assistance",
            "example": "Can you help me? I can't find my gate."
        }
    ],
    "hotel": [
        {
            "icon": "🏨",
            "term": "reservation",
            "fr": "une réservation",
            "definition": "a booking made before arriving",
            "example": "I have a reservation for tonight."
        },
        {
            "icon": "🔑",
            "term": "check in",
            "fr": "s'enregistrer / arriver à l'hôtel",
            "definition": "to arrive and register at a hotel",
            "example": "I would like to check in, please."
        },
        {
            "icon": "🚪",
            "term": "room",
            "fr": "une chambre",
            "definition": "a place where you sleep in a hotel",
            "example": "My room is on the second floor."
        },
        {
            "icon": "☕",
            "term": "breakfast included",
            "fr": "petit-déjeuner inclus",
            "definition": "breakfast is part of the price",
            "example": "Is breakfast included?"
        },
        {
            "icon": "🕚",
            "term": "check-out",
            "fr": "le départ de l'hôtel",
            "definition": "the time you leave the hotel room",
            "example": "What time is check-out?"
        },
        {
            "icon": "📶",
            "term": "Wi-Fi password",
            "fr": "le mot de passe Wi-Fi",
            "definition": "the code to connect to the internet",
            "example": "Could I have the Wi-Fi password, please?"
        }
    ],
    "restaurant": [
        {
            "icon": "🍽️",
            "term": "a table for two",
            "fr": "une table pour deux",
            "definition": "a phrase to ask for a table for two people",
            "example": "A table for two, please."
        },
        {
            "icon": "📖",
            "term": "menu",
            "fr": "la carte / le menu",
            "definition": "the list of food and drinks",
            "example": "Can I see the menu, please?"
        },
        {
            "icon": "💧",
            "term": "water",
            "fr": "de l'eau",
            "definition": "a drink",
            "example": "Could we have some water, please?"
        },
        {
            "icon": "🧾",
            "term": "bill",
            "fr": "l'addition",
            "definition": "the amount to pay in a restaurant",
            "example": "Could we have the bill, please?"
        },
        {
            "icon": "🥗",
            "term": "I would like...",
            "fr": "Je voudrais...",
            "definition": "a polite way to order or ask for something",
            "example": "I would like a salad, please."
        },
        {
            "icon": "🌤️",
            "term": "inside or outside",
            "fr": "à l'intérieur ou dehors",
            "definition": "a choice of where to sit",
            "example": "Would you like to sit inside or outside?"
        }
    ],
    "transport": [
        {
            "icon": "🚕",
            "term": "taxi",
            "fr": "un taxi",
            "definition": "a car with a driver you pay",
            "example": "Can you take me to the hotel by taxi?"
        },
        {
            "icon": "💳",
            "term": "pay by card",
            "fr": "payer par carte",
            "definition": "to pay with a bank card",
            "example": "Can I pay by card?"
        },
        {
            "icon": "⏰",
            "term": "How long does it take?",
            "fr": "Combien de temps cela prend ?",
            "definition": "a question about duration",
            "example": "How long does it take to get to the hotel?"
        },
        {
            "icon": "💶",
            "term": "How much is it?",
            "fr": "Combien ça coûte ?",
            "definition": "a question about price",
            "example": "How much is it for two tickets?"
        },
        {
            "icon": "⬅️",
            "term": "turn left",
            "fr": "tourner à gauche",
            "definition": "go to the left side",
            "example": "Go straight ahead and turn left."
        },
        {
            "icon": "➡️",
            "term": "go straight ahead",
            "fr": "aller tout droit",
            "definition": "continue forward",
            "example": "Go straight ahead to the reception."
        }
    ],
    "connectors": [
        {
            "icon": "1️⃣",
            "term": "first",
            "fr": "d'abord / premièrement",
            "definition": "introduces the first idea",
            "example": "First, I introduce myself."
        },
        {
            "icon": "2️⃣",
            "term": "then",
            "fr": "ensuite",
            "definition": "introduces the next action",
            "example": "Then, I explain my goal."
        },
        {
            "icon": "⏭️",
            "term": "after that",
            "fr": "après cela",
            "definition": "continues a sequence",
            "example": "After that, I ask a question."
        },
        {
            "icon": "➕",
            "term": "and",
            "fr": "et",
            "definition": "adds information",
            "example": "I live in France and I have three children."
        },
        {
            "icon": "⚖️",
            "term": "but",
            "fr": "mais",
            "definition": "shows a contrast",
            "example": "English is difficult, but I am motivated."
        },
        {
            "icon": "💡",
            "term": "because",
            "fr": "parce que",
            "definition": "gives a reason",
            "example": "I am learning English because I want to travel."
        }
    ]
};

  var $ = function(sel){ return document.querySelector(sel); };
  var $$ = function(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  var toolkitData = {
    repeat: [
      ["Can you repeat, please?", "Pouvez-vous répéter, s’il vous plaît ?"],
      ["Can you speak more slowly, please?", "Pouvez-vous parler plus lentement ?"],
      ["Sorry, I didn’t catch that.", "Désolée, je n’ai pas saisi."],
      ["One more time, please.", "Encore une fois, s’il vous plaît."],
      ["Could you say that again?", "Pourriez-vous répéter ?"],
      ["I need a little more time.", "J’ai besoin d’un peu plus de temps."]
    ],
    help: [
      ["Could you help me, please?", "Pourriez-vous m’aider, s’il vous plaît ?"],
      ["I have a question.", "J’ai une question."],
      ["I don’t understand this word.", "Je ne comprends pas ce mot."],
      ["Can you explain it?", "Pouvez-vous l’expliquer ?"],
      ["Can you write it down?", "Pouvez-vous l’écrire ?"],
      ["Where can I find it?", "Où puis-je le trouver ?"]
    ],
    thinking: [
      ["Let me think.", "Laissez-moi réfléchir."],
      ["I’m not sure.", "Je ne suis pas sûre."],
      ["I think…", "Je pense que…"],
      ["For me, it is…", "Pour moi, c’est…"],
      ["In my opinion…", "À mon avis…"],
      ["That’s a good question.", "C’est une bonne question."]
    ],
    clarify: [
      ["Do you mean…?", "Vous voulez dire… ?"],
      ["Is it for today or tomorrow?", "C’est pour aujourd’hui ou demain ?"],
      ["Is it included?", "Est-ce inclus ?"],
      ["How much is it?", "Combien ça coûte ?"],
      ["What time does it start?", "À quelle heure ça commence ?"],
      ["Where is the meeting point?", "Où est le point de rendez-vous ?"]
    ],
    polite: [
      ["Hello, how are you?", "Bonjour, comment allez-vous ?"],
      ["Nice to meet you.", "Ravie de vous rencontrer."],
      ["Thank you very much.", "Merci beaucoup."],
      ["Have a nice day.", "Bonne journée."],
      ["I would like…", "Je voudrais…"],
      ["That’s very kind of you.", "C’est très gentil de votre part."]
    ]
  };

  var scenarios = {
    hotel: {
      title: "At the hotel reception",
      goal: "Check in and ask for simple information.",
      useful: ["I have a reservation.", "Could you repeat, please?", "Is breakfast included?", "What time is check-out?"],
      lines: [
        ["Receptionist", "Good evening. Welcome to the hotel."],
        ["Frankie", "Good evening. I have a reservation."],
        ["Receptionist", "Of course. What is your name, please?"],
        ["Frankie", "My name is Frankie Dumarquez."],
        ["Receptionist", "Breakfast is from seven to ten."],
        ["Frankie", "Thank you. What time is check-out?" ]
      ],
      prompt: "You arrive at the hotel. Say your name, say you have a reservation, and ask one question.",
      model: "Good evening. My name is Frankie Dumarquez. I have a reservation for tonight. Could you tell me what time breakfast is, please?"
    },
    restaurant: {
      title: "At a restaurant",
      goal: "Book or ask for a table and order politely.",
      useful: ["A table for two, please.", "Can I see the menu?", "I would like…", "Could we have the bill, please?"],
      lines: [
        ["Waiter", "Hello. Do you have a reservation?"],
        ["Frankie", "No, we don’t. A table for two, please."],
        ["Waiter", "Yes, of course. Would you like to sit inside or outside?"],
        ["Frankie", "Outside, please."],
        ["Waiter", "Here is the menu."],
        ["Frankie", "Thank you. Could we have some water, please?" ]
      ],
      prompt: "You are at a restaurant. Ask for a table, choose inside or outside, and ask for water.",
      model: "Hello. A table for two, please. We would like to sit outside if possible. Could we have some water, please?"
    },
    taxi: {
      title: "In a taxi",
      goal: "Say where you want to go and ask about the price or time.",
      useful: ["Can you take me to…?", "How long does it take?", "How much is it?", "Can I pay by card?"],
      lines: [
        ["Driver", "Hello. Where would you like to go?"],
        ["Frankie", "Hello. Can you take me to the hotel, please?"],
        ["Driver", "Of course. It takes about twenty minutes."],
        ["Frankie", "Thank you. Can I pay by card?"],
        ["Driver", "Yes, no problem."],
        ["Frankie", "Great, thank you." ]
      ],
      prompt: "You are in a taxi. Say where you want to go and ask if you can pay by card.",
      model: "Hello. Can you take me to my hotel, please? How long does it take? And can I pay by card?"
    },
    tickets: {
      title: "Buying tickets / paying",
      goal: "Ask for tickets, prices, and payment options.",
      useful: ["Two tickets, please.", "How much is it?", "What time does it start?", "Can I pay by card?"],
      lines: [
        ["Assistant", "Hello. How can I help you?"],
        ["Frankie", "Hello. Two tickets, please."],
        ["Assistant", "For the ten o’clock visit?"],
        ["Frankie", "Yes, please. How much is it?"],
        ["Assistant", "It’s twenty euros."],
        ["Frankie", "Can I pay by card?" ]
      ],
      prompt: "You want to buy two tickets. Ask the price and ask if you can pay by card.",
      model: "Hello. Two tickets, please. What time does it start? How much is it? Can I pay by card?"
    },
    airport: {
      title: "At the airport",
      goal: "Find your gate and ask for help politely.",
      useful: ["Where is gate B12?", "Is this the right queue?", "Can you help me?", "My flight is to London."],
      lines: [
        ["Staff", "Good morning. Can I help you?"],
        ["Frankie", "Yes, please. My flight is to London."],
        ["Staff", "What is your gate number?"],
        ["Frankie", "It is gate B twelve. Where is it?"],
        ["Staff", "Go straight ahead and turn left."],
        ["Frankie", "Thank you very much." ]
      ],
      prompt: "You are at the airport. Say your destination and ask where the gate is.",
      model: "Good morning. Can you help me, please? My flight is to London. Where is gate B twelve?"
    },
    smalltalk: {
      title: "Friendly small talk",
      goal: "Start a simple conversation and answer politely.",
      useful: ["Where are you from?", "I’m from France.", "What do you like doing?", "I like walking and travelling."],
      lines: [
        ["Person", "Hello. Where are you from?"],
        ["Frankie", "Hello. I’m from France."],
        ["Person", "Nice. Do you like travelling?"],
        ["Frankie", "Yes, I do. I like discovering new places."],
        ["Person", "What do you like doing at the weekend?"],
        ["Frankie", "I like walking with my husband and my dog." ]
      ],
      prompt: "You meet someone. Say where you are from and say two things you like.",
      model: "Hello. I’m from France. I like travelling and discovering new places. At the weekend, I like walking with my husband and my dog."
    }
  };

  var listeningTasks = {
    "1": {
      text: "Good evening. I have a reservation for two nights. My name is Frankie Dumarquez. Could you tell me what time breakfast is, please?",
      question: "Where is Frankie?",
      answers: ["At a restaurant", "At a hotel", "In a taxi"],
      correct: 1
    },
    "2": {
      text: "Hello. A table for two, please. We would like to sit outside. Could we have some water and the menu, please?",
      question: "What does Frankie ask for?",
      answers: ["A table for two", "A train ticket", "A hotel room"],
      correct: 0
    },
    "3": {
      text: "This weekend, I am going to the mountains with my husband and my dog. We are going to walk and relax. I am happy because I love nature.",
      question: "What is Frankie going to do this weekend?",
      answers: ["Work all weekend", "Go shopping", "Go to the mountains"],
      correct: 2
    }
  };

  var sortSentences = [
    { text:"Last month, I passed my English exam.", time:"past" },
    { text:"I practise English every week.", time:"present" },
    { text:"I am going to speak with more confidence.", time:"future" },
    { text:"Yesterday, I listened to a dialogue.", time:"past" },
    { text:"Next lesson, I am going to ask more questions.", time:"future" },
    { text:"I sometimes need repetition.", time:"present" }
  ];

  var orderSentences = [
    ["I", "live", "in", "France", "with", "my", "husband."],
    ["Last", "month,", "I", "passed", "my", "English", "exam."],
    ["This", "year,", "I", "am", "going", "to", "speak", "with", "more", "confidence."],
    ["Can", "you", "repeat,", "please?"],
    ["I", "would", "like", "a", "table", "for", "two,", "please." ]
  ];

  var oralQuestions = [
    { cat:"Personal information", q:"Can you introduce yourself?", model:"My name is Frankie. I live in France. I am learning English because I want to communicate more easily. In my free time, I like walking and spending time with my family." },
    { cat:"Family", q:"Can you describe your family?", model:"I have three children: one son and two daughters. My children are adults now. I live with my husband, and we have a dog." },
    { cat:"Free time", q:"What do you like doing at the weekend?", model:"At the weekend, I like walking, relaxing, and spending time with my husband and my dog. Sometimes, we go to the mountains because I love nature." },
    { cat:"Travel", q:"What English do you need when you travel?", model:"When I travel, I need English at the airport, at the hotel, in restaurants, and when I ask for help. I want to speak clearly and understand simple answers." },
    { cat:"Progress", q:"How do you feel after your first English programme?", model:"I feel happy and proud because I passed my exam. English is still difficult, but I am more confident now. I want to continue and improve." },
    { cat:"Future", q:"What are you going to improve in this new session?", model:"In this new session, I am going to practise speaking, listening, and asking questions. I am also going to work on the past and the future." }
  ];

  function init(){
    var warning = $("#jsWarning");
    if(warning){ warning.style.display = "none"; }
    loadVoices();
    bindBasics();
    renderVocab();
    bindVocab();
    bindProgressWords();
    bindSortGame();
    bindIntroBuilder();
    renderToolkit();
    bindToolkit();
    bindScenarios();
    renderScenario();
    bindListening();
    renderListening();
    bindWordOrder();
    renderOrderSentence();
    bindOral();
    renderOralQuestion();
    bindGoals();
    bindSummary();
  }

  function bindBasics(){
    $$('[data-scroll]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var target = document.querySelector(btn.getAttribute('data-scroll'));
        if(target){ target.scrollIntoView({behavior:'smooth', block:'start'}); }
      });
    });

    $$('[data-say]').forEach(function(btn){
      btn.addEventListener('click', function(){ speak(btn.getAttribute('data-say')); });
    });

    $$('.voice-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        selectedVoice = btn.getAttribute('data-voice') || 'en-US';
        $$('.voice-btn').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });

    var stop = $('#stopVoice');
    if(stop){ stop.addEventListener('click', function(){ window.speechSynthesis.cancel(); }); }
    var printBtn = $('#printBtn');
    if(printBtn){ printBtn.addEventListener('click', function(){ window.print(); }); }
  }

  function loadVoices(){
    if(!('speechSynthesis' in window)){ return; }
    voices = window.speechSynthesis.getVoices() || [];
    window.speechSynthesis.onvoiceschanged = function(){ voices = window.speechSynthesis.getVoices() || []; };
  }

  function chooseVoice(lang){
    if(!voices || !voices.length){ voices = window.speechSynthesis.getVoices() || []; }
    var exact = voices.filter(function(v){ return v.lang === lang; });
    var starts = voices.filter(function(v){ return v.lang && v.lang.indexOf(lang.split('-')[0]) === 0; });
    var pool = exact.length ? exact : starts;
    if(!pool.length){ return null; }
    var preferred = pool.find(function(v){ return /Google|Microsoft|Daniel|Samantha|Kate|Serena|Jenny|Aria|Natural/i.test(v.name); });
    return preferred || pool[0];
  }

  function speak(text){
    if(!('speechSynthesis' in window)){
      alert('Speech synthesis is not available in this browser.');
      return;
    }
    if(!text){ return; }
    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedVoice;
    utterance.rate = 0.88;
    utterance.pitch = 1;
    var voice = chooseVoice(selectedVoice);
    if(voice){ utterance.voice = voice; }
    window.speechSynthesis.speak(utterance);
  }

  function escapeHTML(text){
    return String(text).replace(/[&<>"]/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]);
    });
  }


  function bindVocab(){
    var select = $('#vocabCategory');
    if(select){ select.addEventListener('change', renderVocab); }
  }

  function renderVocab(){
    var select = $('#vocabCategory');
    var grid = $('#vocabGrid');
    if(!select || !grid){ return; }
    var category = select.value;
    var items = vocabData[category] || [];
    grid.innerHTML = '';
    items.forEach(function(item){
      var card = document.createElement('article');
      card.className = 'vocab-card';
      card.innerHTML =
        '<div class="vocab-top">' +
          '<div class="vocab-icon" aria-hidden="true">' + escapeHTML(item.icon) + '</div>' +
          '<div><div class="vocab-term">' + escapeHTML(item.term) + '</div>' +
          '<div class="vocab-fr">' + escapeHTML(item.fr) + '</div></div>' +
        '</div>' +
        '<p class="vocab-def"><strong>Definition:</strong> ' + escapeHTML(item.definition) + '</p>' +
        '<p class="vocab-example"><strong>Example:</strong> ' + escapeHTML(item.example) + '</p>' +
        '<div class="vocab-actions"><button class="listen-btn small" type="button">▶ Listen</button></div>';
      card.querySelector('button').addEventListener('click', function(){ speak(item.term + '. ' + item.example); });
      grid.appendChild(card);
    });
  }

  function bindProgressWords(){
    $$('#progressWords .chip').forEach(function(chip){
      chip.addEventListener('click', function(){
        var active = $$('#progressWords .chip.active');
        if(chip.classList.contains('active')){
          chip.classList.remove('active');
        } else if(active.length < 3){
          chip.classList.add('active');
        } else {
          $('#progressSentence').textContent = 'Choose only 3 words. Tap one selected word to change it.';
        }
      });
    });
    $('#makeProgressSentence').addEventListener('click', function(){
      var words = $$('#progressWords .chip.active').map(function(chip){ return chip.getAttribute('data-word'); });
      var box = $('#progressSentence');
      if(words.length < 3){
        box.textContent = 'Choose 3 words first.';
        return;
      }
      var sentence = 'I am ' + words[0] + ', ' + words[1] + ', and ' + words[2] + '. I am ready for my new English programme.';
      box.textContent = sentence;
    });
  }

  function bindSortGame(){
    renderSortSentence();
    $$('.time-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var answer = btn.getAttribute('data-time');
        var item = sortSentences[sortIndex];
        var fb = $('#sortFeedback');
        if(answer === item.time){
          fb.className = 'feedback success';
          fb.textContent = 'Correct. This sentence is about: ' + labelTime(item.time) + '.';
          sortIndex = (sortIndex + 1) % sortSentences.length;
          setTimeout(renderSortSentence, 900);
        } else {
          fb.className = 'feedback error';
          fb.textContent = 'Try again. Look at the time marker: last, every, next, yesterday, sometimes...';
        }
      });
    });
  }

  function labelTime(time){
    if(time === 'past'){ return 'the past'; }
    if(time === 'future'){ return 'the future'; }
    return 'now / habits';
  }

  function renderSortSentence(){
    $('#sortSentence').textContent = sortSentences[sortIndex].text;
  }

  function bindIntroBuilder(){
    $('#generateIntro').addEventListener('click', buildIntro);
    $$('.tab-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        currentIntroModel = btn.getAttribute('data-model');
        $$('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        $('#introOutput').textContent = introModels[currentIntroModel] || 'Click “Generate my introduction”.';
      });
    });
    $('#listenIntro').addEventListener('click', function(){ speak($('#introOutput').textContent); });
    $('#copyIntro').addEventListener('click', function(){
      copyText($('#introOutput').textContent);
      var btn = $('#copyIntro');
      var original = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(function(){ btn.textContent = original; }, 1200);
    });
    buildIntro();
  }

  function buildIntro(){
    var name = $('#studentName').value.trim() || 'Frankie';
    var town = $('#studentTown').value.trim() || 'France';
    var work = $('#studentWork').value;
    var family = $('#studentFamily').value;
    var hobby = $('#studentHobby').value;
    var goal = $('#studentGoal').value;

    introModels.a2 = "Hello. My name is " + name + ".\n" +
      "I live in " + town + ".\n" +
      work + ".\n" +
      family + ".\n" +
      "In my free time, I like " + hobby + ".\n" +
      "I am learning English because I want to " + goal + ".";

    introModels.a2plus = "Hello, my name is " + name + ", and I live in " + town + ".\n" +
      work + ", and English is useful for me in simple everyday situations.\n" +
      family + ".\n" +
      "When I have free time, I like " + hobby + ".\n" +
      "In this new programme, I would like to " + goal + " and feel more comfortable when I speak.";

    introModels.b1minus = "Hello, my name is " + name + ". I live in " + town + ".\n" +
      work + ", and I am continuing English because I want to become more independent in real conversations.\n" +
      family + ", and in my free time I enjoy " + hobby + ".\n" +
      "I passed my first English exam, so I feel proud, but I know I still need practice.\n" +
      "My next goal is to " + goal + ", especially when I travel or when I need to ask questions.";

    $('#introOutput').textContent = introModels[currentIntroModel];
  }

  function bindToolkit(){
    $('#toolkitCategory').addEventListener('change', renderToolkit);
  }

  function renderToolkit(){
    var cat = $('#toolkitCategory').value;
    var grid = $('#phraseGrid');
    grid.innerHTML = '';
    toolkitData[cat].forEach(function(item){
      var card = document.createElement('article');
      card.className = 'phrase-card';
      card.innerHTML = '<div class="en">' + escapeHTML(item[0]) + '</div><div class="fr">' + escapeHTML(item[1]) + '</div>' +
        '<button class="listen-btn small" type="button">▶ Listen</button>';
      card.querySelector('button').addEventListener('click', function(){ speak(item[0]); });
      grid.appendChild(card);
    });
  }

  function bindScenarios(){
    $('#scenarioSelect').addEventListener('change', renderScenario);
    $('#listenDialogue').addEventListener('click', function(){
      var s = scenarios[$('#scenarioSelect').value];
      var text = s.lines.map(function(line){ return line[0] + ': ' + line[1]; }).join(' ');
      speak(text);
    });
    $('#showRoleModel').addEventListener('click', function(){
      var s = scenarios[$('#scenarioSelect').value];
      var fb = $('#roleFeedback');
      fb.className = 'feedback info';
      fb.textContent = 'Model: ' + s.model;
    });
    $('#checkRoleAnswer').addEventListener('click', checkRoleAnswer);
  }

  function renderScenario(){
    var key = $('#scenarioSelect').value;
    var s = scenarios[key];
    $('#dialogueTitle').textContent = s.title;
    $('#scenarioInfo').innerHTML = '<strong>Goal:</strong> ' + escapeHTML(s.goal) + '<ul class="info-list">' + s.useful.map(function(u){ return '<li>' + escapeHTML(u) + '</li>'; }).join('') + '</ul>';
    var lines = $('#dialogueLines');
    lines.innerHTML = '';
    s.lines.forEach(function(line){
      var row = document.createElement('div');
      row.className = 'dialogue-line';
      row.innerHTML = '<div class="speaker">' + escapeHTML(line[0]) + '</div><div class="line-text">' + escapeHTML(line[1]) + '</div><button class="listen-btn small" type="button">▶</button>';
      row.querySelector('button').addEventListener('click', function(){ speak(line[1]); });
      lines.appendChild(row);
    });
    $('#rolePrompt').textContent = s.prompt;
    $('#roleAnswer').value = '';
    $('#roleFeedback').className = 'feedback';
    $('#roleFeedback').textContent = '';
  }

  function checkRoleAnswer(){
    var answer = $('#roleAnswer').value.trim();
    var fb = $('#roleFeedback');
    if(answer.length < 12){
      fb.className = 'feedback error';
      fb.textContent = 'Write at least one complete sentence. Try: Hello. I would like... / Can you...?';
      return;
    }
    var hasPolite = /please|thank you|hello|good morning|good evening|could|can/i.test(answer);
    var hasQuestion = /\?|can|could|what|where|when|how|is|do/i.test(answer);
    if(hasPolite && hasQuestion){
      fb.className = 'feedback success';
      fb.textContent = 'Good structure: you used polite language and a useful question. Now practise saying it slowly.';
    } else if(hasPolite){
      fb.className = 'feedback info';
      fb.textContent = 'Good polite language. Can you add one question? Example: Could you help me, please?';
    } else {
      fb.className = 'feedback info';
      fb.textContent = 'Good start. Add a polite phrase: please, thank you, could you, or can you.';
    }
  }

  function bindListening(){
    $('#listeningSelect').addEventListener('change', renderListening);
    $('#listenTask').addEventListener('click', function(){ speak(listeningTasks[$('#listeningSelect').value].text); });
    $('#showTranscript').addEventListener('click', function(){ $('#transcriptBox').classList.toggle('hidden'); });
    $('#checkListening').addEventListener('click', checkListening);
  }

  function renderListening(){
    var task = listeningTasks[$('#listeningSelect').value];
    $('#listeningQuestion').textContent = task.question;
    var answers = $('#listeningAnswers');
    answers.innerHTML = '';
    task.answers.forEach(function(ans, idx){
      var id = 'answer' + idx;
      var label = document.createElement('label');
      label.className = 'answer-option';
      label.setAttribute('for', id);
      label.innerHTML = '<input type="radio" name="listeningAnswer" id="' + id + '" value="' + idx + '"> <span>' + escapeHTML(ans) + '</span>';
      answers.appendChild(label);
    });
    $('#listeningFeedback').className = 'feedback';
    $('#listeningFeedback').textContent = '';
    $('#transcriptBox').classList.add('hidden');
    $('#transcriptBox').textContent = task.text;
  }

  function checkListening(){
    var selected = document.querySelector('input[name="listeningAnswer"]:checked');
    var fb = $('#listeningFeedback');
    if(!selected){
      fb.className = 'feedback error';
      fb.textContent = 'Choose one answer first.';
      return;
    }
    var task = listeningTasks[$('#listeningSelect').value];
    if(Number(selected.value) === task.correct){
      fb.className = 'feedback success';
      fb.textContent = 'Correct. You understood the key information.';
    } else {
      fb.className = 'feedback error';
      fb.textContent = 'Not yet. Listen again and focus on the situation words.';
    }
  }

  function bindWordOrder(){
    $('#resetOrder').addEventListener('click', renderOrderSentence);
    $('#nextOrder').addEventListener('click', function(){ orderIndex = (orderIndex + 1) % orderSentences.length; renderOrderSentence(); });
    $('#checkOrder').addEventListener('click', checkOrder);
  }

  function renderOrderSentence(){
    placedWords = [];
    var words = orderSentences[orderIndex].slice();
    $('#orderInstruction').textContent = 'Sentence ' + (orderIndex + 1) + ' of ' + orderSentences.length;
    $('#sentenceTarget').innerHTML = '';
    $('#wordBank').innerHTML = '';
    $('#orderFeedback').className = 'feedback';
    $('#orderFeedback').textContent = '';
    shuffle(words).forEach(function(word){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'word-btn';
      btn.textContent = word;
      btn.addEventListener('click', function(){
        placedWords.push(word);
        btn.classList.add('used');
        var placed = document.createElement('button');
        placed.type = 'button';
        placed.className = 'placed-word';
        placed.textContent = word;
        placed.title = 'Tap to remove';
        placed.addEventListener('click', function(){ renderOrderSentence(); });
        $('#sentenceTarget').appendChild(placed);
      });
      $('#wordBank').appendChild(btn);
    });
  }

  function shuffle(arr){
    for(var i = arr.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function checkOrder(){
    var correct = orderSentences[orderIndex].join(' ');
    var answer = placedWords.join(' ');
    var fb = $('#orderFeedback');
    if(answer === correct){
      fb.className = 'feedback success';
      fb.textContent = 'Correct: ' + correct;
    } else {
      fb.className = 'feedback error';
      fb.textContent = 'Try again. Remember: Subject + verb + information. Correct sentence: ' + correct;
    }
  }

  function bindOral(){
    $('#newQuestion').addEventListener('click', function(){ oralIndex = (oralIndex + 1) % oralQuestions.length; renderOralQuestion(); });
    $('#listenQuestion').addEventListener('click', function(){ speak(oralQuestions[oralIndex].q); });
    $('#showOralModel').addEventListener('click', function(){
      var fb = $('#oralModel');
      fb.className = 'feedback info';
      fb.textContent = oralQuestions[oralIndex].model;
    });
  }

  function renderOralQuestion(){
    var item = oralQuestions[oralIndex];
    $('#questionCategory').textContent = item.cat;
    $('#oralQuestion').textContent = item.q;
    $('#oralAnswer').value = '';
    $('#oralModel').className = 'feedback';
    $('#oralModel').textContent = '';
  }

  function bindGoals(){
    $('#generateGoals').addEventListener('click', function(){
      var goals = $$('#goals input[type="checkbox"]:checked').map(function(input){ return input.value; });
      var box = $('#promiseBox');
      if(!goals.length){
        box.textContent = 'Choose 2 or 3 goals first.';
        return;
      }
      var sentence = 'In this new English programme, I am going to ' + goals.slice(0, -1).join(', ');
      if(goals.length > 1){ sentence += ' and ' + goals[goals.length - 1]; }
      else { sentence += goals[0]; }
      sentence += '. I do not need to be perfect. I need to keep practising.';
      box.textContent = sentence;
    });
  }

  function bindSummary(){
    $('#copySummary').addEventListener('click', function(){
      var summary = 'Frankie · Programme 2 · Lesson 1\n' +
        'Objective: celebrate her A2 CLOE result, rebuild confidence, and begin the new session with practical speaking goals.\n' +
        'Work completed: structured step-by-step lesson flow, vocabulary bank by category, progress reflection, grammar compass past/now/future, improved self-introduction, speaking survival phrases, real-life mini-dialogues, listening practice, word order, oral interview questions, and personal goals.\n' +
        'Homework: review one vocabulary category, practise the self-introduction 3 times, repeat the useful phrases, and write 5 simple sentences about herself and her English goal.';
      copyText(summary, $('#copyStatus'));
    });
  }

  function copyText(text, statusEl){
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){
        if(statusEl){ statusEl.textContent = 'Copied.'; }
      }).catch(function(){ fallbackCopy(text, statusEl); });
    } else {
      fallbackCopy(text, statusEl);
    }
  }

  function fallbackCopy(text, statusEl){
    var area = document.createElement('textarea');
    area.value = text;
    document.body.appendChild(area);
    area.select();
    try{ document.execCommand('copy'); if(statusEl){ statusEl.textContent = 'Copied.'; } }
    catch(e){ if(statusEl){ statusEl.textContent = 'Copy failed. Select the text manually.'; } }
    document.body.removeChild(area);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
