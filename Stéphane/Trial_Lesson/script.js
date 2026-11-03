'use strict';

const state = {
  sectionIndex: 0,
  questionIndex: 0,
  goals: [],
  difficulties: [],
  learning: [],
  answers: {},
  mission: 'professional',
  builderSelections: {},
  afterModelLevel: 'natural',
  onlineRating: null,
  planText: '',
  timerSeconds: 30 * 60,
  timerInterval: null
};

const goalLabels = {
  professional: { en: 'professional English', fr: "l'anglais professionnel", card: 'Professional English · Anglais professionnel' },
  travel: { en: 'travelling with confidence', fr: 'voyager avec confiance', card: 'Travel · Voyager avec confiance' },
  conversation: { en: 'everyday conversation', fr: 'la conversation quotidienne', card: 'Conversation · Conversation quotidienne' },
  certification: { en: 'exam or certification preparation', fr: "la préparation à une certification ou un examen", card: 'Certification · Préparation à un examen' },
  listeningGoal: { en: 'understanding people more easily', fr: 'mieux comprendre les autres', card: 'Listening · Mieux comprendre les autres' },
  confidenceGoal: { en: 'speaking with more confidence', fr: 'parler avec davantage de confiance', card: 'Confidence · Parler avec confiance' }
};

const difficultyLabels = {
  speaking: { en: 'speaking spontaneously', fr: 'parler spontanément', card: 'Speaking spontaneously · Parler spontanément' },
  listening: { en: 'understanding spoken English', fr: "comprendre l'anglais oral", card: 'Listening · Comprendre l’anglais oral' },
  grammar: { en: 'building correct sentences', fr: 'construire des phrases correctes', card: 'Sentence structure · Construire des phrases' },
  vocabulary: { en: 'finding the right words', fr: 'trouver les bons mots', card: 'Vocabulary · Trouver les bons mots' },
  pronunciation: { en: 'pronunciation', fr: 'améliorer la prononciation', card: 'Pronunciation · Prononciation' },
  confidence: { en: 'feeling confident', fr: 'se sentir en confiance', card: 'Confidence · Se sentir en confiance' },
  writing: { en: 'writing emails and messages', fr: 'écrire des e-mails et des messages', card: 'Writing · E-mails et messages' },
  unknown: { en: 'identifying the main difficulty', fr: 'identifier les principales difficultés', card: 'Needs analysis · À identifier ensemble' }
};

const learningLabels = {
  listening: { en: 'listening practice', fr: "des activités d'écoute", card: 'Listening · Écouter' },
  speaking: { en: 'speaking practice', fr: "de la pratique orale", card: 'Speaking · Parler' },
  visual: { en: 'visual explanations', fr: 'des supports visuels', card: 'Visual support · Voir et structurer' },
  practice: { en: 'practical role-plays', fr: 'des mises en situation', card: 'Practical tasks · Pratiquer' }
};

const questions = [
  {
    level: 'Warm-up', levelFr: 'Échauffement',
    question: 'What is your name?', translation: 'Comment vous appelez-vous ?',
    support: 'My name is… / I’m…', supportFr: 'Mon nom est… / Je m’appelle…',
    model: 'My name is Stéphane Fromholz.', modelFr: 'Je m’appelle Stéphane Fromholz.'
  },
  {
    level: 'About you', levelFr: 'À propos de vous',
    question: 'Where do you live?', translation: 'Où habitez-vous ?',
    support: 'I live in… / I’m based in…', supportFr: 'J’habite à… / Je suis basé à…',
    model: 'I live in France.', modelFr: 'J’habite en France.'
  },
  {
    level: 'Your work', levelFr: 'Votre activité',
    question: 'What do you do?', translation: 'Que faites-vous dans la vie ?',
    support: 'I work as… / I work in… / I am responsible for…', supportFr: 'Je travaille comme… / dans… / Je suis responsable de…',
    model: 'I am the Area Manager for France. I work in the metal industry.', modelFr: 'Je suis responsable de la France et je travaille dans le secteur de la métallurgie.'
  },
  {
    level: 'Your English', levelFr: 'Votre anglais',
    question: 'When do you currently use English?', translation: 'Quand utilisez-vous actuellement l’anglais ?',
    support: 'I use English when… / I sometimes need English for…', supportFr: 'J’utilise l’anglais quand… / J’ai parfois besoin de l’anglais pour…',
    model: 'I use English with international colleagues, particularly in Germany, and when I travel.', modelFr: 'J’utilise l’anglais avec des collègues internationaux, notamment en Allemagne, et lorsque je voyage.'
  },
  {
    level: 'Your goal', levelFr: 'Votre objectif',
    question: 'Why would you like to improve your English?', translation: 'Pourquoi souhaitez-vous améliorer votre anglais ?',
    support: 'I would like to… because… / My main goal is to…', supportFr: 'J’aimerais… parce que… / Mon objectif principal est de…',
    model: 'I would like to improve my English so that I can communicate more confidently.', modelFr: 'J’aimerais améliorer mon anglais afin de communiquer avec davantage de confiance.'
  },
  {
    level: 'Your future', levelFr: 'Votre avenir',
    question: 'What would you like to do more easily after the training?', translation: 'Que souhaiteriez-vous faire plus facilement après la formation ?',
    support: 'After the training, I would like to be able to…', supportFr: 'Après la formation, j’aimerais être capable de…',
    model: 'After the training, I would like to understand people more easily and speak without overthinking every sentence.', modelFr: 'Après la formation, j’aimerais mieux comprendre les autres et parler sans trop réfléchir à chaque phrase.'
  }
];

const missionData = {
  professional: {
    title: 'Introduce yourself to a new professional contact.',
    context: 'You are meeting someone for the first time. Say who you are, what you do and why English is useful for you.',
    translation: 'Vous rencontrez une personne pour la première fois. Présentez-vous, expliquez ce que vous faites et pourquoi l’anglais vous est utile.',
    audio: 'You are meeting a new professional contact. Introduce yourself, explain what you do, and say why English is useful for you.',
    parts: [
      { label: 'Greeting · Salutation', options: [
        { en: 'Hello, it is nice to meet you.', fr: 'Bonjour, je suis ravi de vous rencontrer.' },
        { en: 'Good morning. Thank you for meeting with me.', fr: 'Bonjour. Merci de me recevoir.' },
        { en: 'Hello. I am pleased to meet you.', fr: 'Bonjour. Je suis heureux de faire votre connaissance.' }
      ]},
      { label: 'Introduction · Présentation', options: [
        { en: 'My name is Stéphane Fromholz.', fr: 'Je m’appelle Stéphane Fromholz.' },
        { en: 'I am Stéphane Fromholz.', fr: 'Je suis Stéphane Fromholz.' },
        { en: 'Let me introduce myself. My name is Stéphane Fromholz.', fr: 'Permettez-moi de me présenter. Je m’appelle Stéphane Fromholz.' }
      ]},
      { label: 'Work · Activité', options: [
        { en: 'I am the Area Manager for France in the metal industry.', fr: 'Je suis responsable de la France dans le secteur de la métallurgie.' },
        { en: 'I manage teams and oversee business results in France.', fr: 'Je dirige des équipes et supervise les résultats de l’activité en France.' },
        { en: 'My responsibilities include sales, marketing and budgets.', fr: 'Mes responsabilités comprennent les ventes, le marketing et les budgets.' }
      ]},
      { label: 'English goal · Objectif', options: [
        { en: 'I would like to improve my English for my work.', fr: 'J’aimerais améliorer mon anglais pour mon travail.' },
        { en: 'English would help me communicate more confidently.', fr: 'L’anglais m’aiderait à communiquer avec davantage de confiance.' },
        { en: 'My goal is to feel more comfortable in professional conversations.', fr: 'Mon objectif est d’être plus à l’aise dans les conversations professionnelles.' }
      ]}
    ],
    model: 'Hello, it is nice to meet you. My name is Stéphane Fromholz. I am the Area Manager for France in the metal industry. I manage teams and oversee sales and business results. I regularly work with international colleagues, and I would like to communicate more confidently in English.',
    modelFr: 'Bonjour, je suis ravi de vous rencontrer. Je m’appelle Stéphane Fromholz. Je suis responsable de la France dans le secteur de la métallurgie. Je dirige des équipes et supervise les ventes et les résultats. Je travaille régulièrement avec des collègues internationaux et j’aimerais communiquer avec davantage de confiance en anglais.',
    after: {
      simple: { en: 'Hello. My name is Stéphane Fromholz. I am the Area Manager for France. I work in the metal industry. I would like to improve my spoken English.', fr: 'Bonjour. Je m’appelle Stéphane Fromholz. Je suis responsable de la France. Je travaille dans la métallurgie. J’aimerais améliorer mon anglais oral.' },
      natural: { en: 'Hello, it is nice to meet you. My name is Stéphane Fromholz. I am the Area Manager for France in the metal industry. I manage teams and work with international colleagues. I would like to speak more confidently.', fr: 'Bonjour, je suis ravi de vous rencontrer. Je m’appelle Stéphane Fromholz. Je suis responsable de la France dans le secteur de la métallurgie. Je dirige des équipes et travaille avec des collègues internationaux. J’aimerais parler avec davantage de confiance.' },
      confident: { en: 'Hello, it is a pleasure to meet you. My name is Stéphane Fromholz. I am the Area Manager for France in the metal industry. I oversee teams, sales performance and technical marketing. I often work with international colleagues, and my goal is to communicate more confidently in meetings and presentations.', fr: 'Bonjour, c’est un plaisir de vous rencontrer. Je m’appelle Stéphane Fromholz. Je suis responsable de la France dans le secteur de la métallurgie. Je supervise les équipes, les résultats commerciaux et le marketing technique. Je travaille souvent avec des collègues internationaux et mon objectif est de communiquer plus aisément en réunion et lors de présentations.' }
    }
  },
  travel: {
    title: 'Ask for information at a hotel.',
    context: 'You have just arrived at a hotel. Ask politely about breakfast, Wi-Fi or check-out time.',
    translation: 'Vous venez d’arriver à l’hôtel. Demandez poliment des informations sur le petit-déjeuner, le Wi-Fi ou l’heure de départ.',
    audio: 'You have just arrived at a hotel. Ask politely for information about breakfast, Wi-Fi, or check-out time.',
    parts: [
      { label: 'Greeting · Salutation', options: [
        { en: 'Good evening.', fr: 'Bonsoir.' }, { en: 'Hello. I have a quick question.', fr: 'Bonjour. J’ai une petite question.' }, { en: 'Excuse me, could you help me, please?', fr: 'Excusez-moi, pourriez-vous m’aider, s’il vous plaît ?' }
      ]},
      { label: 'Situation · Situation', options: [
        { en: 'I have a reservation under the name Fromholz.', fr: 'J’ai une réservation au nom de Fromholz.' }, { en: 'I have just checked in.', fr: 'Je viens de m’enregistrer.' }, { en: 'I would like some information, please.', fr: 'J’aimerais avoir un renseignement, s’il vous plaît.' }
      ]},
      { label: 'Question · Question', options: [
        { en: 'What time is breakfast served?', fr: 'À quelle heure le petit-déjeuner est-il servi ?' }, { en: 'Could you tell me how to connect to the Wi-Fi?', fr: 'Pourriez-vous m’indiquer comment me connecter au Wi-Fi ?' }, { en: 'What time do I need to check out tomorrow?', fr: 'À quelle heure dois-je libérer la chambre demain ?' }
      ]},
      { label: 'Polite ending · Formule de politesse', options: [
        { en: 'Thank you very much.', fr: 'Merci beaucoup.' }, { en: 'That is very helpful. Thank you.', fr: 'C’est très utile. Merci.' }, { en: 'Perfect. Thank you for your help.', fr: 'Parfait. Merci pour votre aide.' }
      ]}
    ],
    model: 'Good evening. I have a reservation under the name Fromholz. Could you tell me what time breakfast is served, please? That is very helpful. Thank you.',
    modelFr: 'Bonsoir. J’ai une réservation au nom de Fromholz. Pourriez-vous me dire à quelle heure le petit-déjeuner est servi, s’il vous plaît ? C’est très utile. Merci.',
    after: {
      simple: { en: 'Hello. I have a reservation under the name Fromholz. What time is breakfast, please? Thank you.', fr: 'Bonjour. J’ai une réservation au nom de Fromholz. À quelle heure est le petit-déjeuner, s’il vous plaît ? Merci.' },
      natural: { en: 'Good evening. I have a reservation under the name Fromholz. Could you tell me what time breakfast is served, please? Thank you very much.', fr: 'Bonsoir. J’ai une réservation au nom de Fromholz. Pourriez-vous me dire à quelle heure le petit-déjeuner est servi, s’il vous plaît ? Merci beaucoup.' },
      confident: { en: 'Good evening. I have just checked in under the name Fromholz, and I would like some information, please. Could you tell me what time breakfast is served and how I can connect to the Wi-Fi? Thank you for your help.', fr: 'Bonsoir. Je viens de m’enregistrer au nom de Fromholz et j’aimerais avoir quelques renseignements. Pourriez-vous me dire à quelle heure le petit-déjeuner est servi et comment me connecter au Wi-Fi ? Merci pour votre aide.' }
    }
  },
  conversation: {
    title: 'Start a friendly conversation with someone new.',
    context: 'You meet someone at an event. Introduce yourself, ask a question and react naturally.',
    translation: 'Vous rencontrez quelqu’un lors d’un événement. Présentez-vous, posez une question et réagissez naturellement.',
    audio: 'You meet someone at an event. Introduce yourself, ask a friendly question, and react naturally.',
    parts: [
      { label: 'Greeting · Salutation', options: [
        { en: 'Hi, I do not think we have met.', fr: 'Bonjour, je ne pense pas que nous nous soyons déjà rencontrés.' }, { en: 'Hello, it is nice to meet you.', fr: 'Bonjour, ravi de vous rencontrer.' }, { en: 'Hi. Is this your first time here?', fr: 'Bonjour. Est-ce votre première fois ici ?' }
      ]},
      { label: 'Introduction · Présentation', options: [
        { en: 'My name is Stéphane.', fr: 'Je m’appelle Stéphane.' }, { en: 'I am Stéphane. What is your name?', fr: 'Je suis Stéphane. Comment vous appelez-vous ?' }, { en: 'Let me introduce myself. I am Stéphane.', fr: 'Permettez-moi de me présenter. Je suis Stéphane.' }
      ]},
      { label: 'Question · Question', options: [
        { en: 'Where are you from?', fr: 'D’où venez-vous ?' }, { en: 'What brings you here today?', fr: 'Qu’est-ce qui vous amène ici aujourd’hui ?' }, { en: 'What do you do?', fr: 'Que faites-vous dans la vie ?' }
      ]},
      { label: 'Reaction · Réaction', options: [
        { en: 'That sounds interesting.', fr: 'Cela semble intéressant.' }, { en: 'Really? Tell me more about that.', fr: 'Vraiment ? Parlez-m’en davantage.' }, { en: 'We have something in common.', fr: 'Nous avons un point commun.' }
      ]}
    ],
    model: 'Hi, I do not think we have met. My name is Stéphane. What brings you here today? That sounds interesting. We may have something in common.',
    modelFr: 'Bonjour, je ne pense pas que nous nous soyons déjà rencontrés. Je m’appelle Stéphane. Qu’est-ce qui vous amène ici aujourd’hui ? Cela semble intéressant. Nous avons peut-être un point commun.',
    after: {
      simple: { en: 'Hello. My name is Stéphane. What is your name? It is nice to meet you.', fr: 'Bonjour. Je m’appelle Stéphane. Comment vous appelez-vous ? Ravi de vous rencontrer.' },
      natural: { en: 'Hi, I do not think we have met. My name is Stéphane. What brings you here today? That sounds interesting.', fr: 'Bonjour, je ne pense pas que nous nous soyons déjà rencontrés. Je m’appelle Stéphane. Qu’est-ce qui vous amène ici aujourd’hui ? Cela semble intéressant.' },
      confident: { en: 'Hi, I do not think we have met. I am Stéphane. What brings you to this event today? That sounds really interesting. I would be pleased to hear more about it.', fr: 'Bonjour, je ne pense pas que nous nous soyons déjà rencontrés. Je suis Stéphane. Qu’est-ce qui vous amène à cet événement aujourd’hui ? Cela semble vraiment intéressant. Je serais ravi d’en savoir plus.' }
    }
  }
};

const rubricItems = [
  'Compréhension orale',
  'Expression orale et interaction',
  'Étendue du vocabulaire',
  'Grammaire et construction des phrases',
  'Prononciation et intelligibilité',
  'Confiance et participation',
  'Aisance avec le format en ligne'
];

const sections = [...document.querySelectorAll('.lesson-section')];
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
const stepDots = document.getElementById('stepDots');
const toast = document.getElementById('toast');
const accentSelect = document.getElementById('accentSelect');
const timerDisplay = document.getElementById('sessionTimer');


// Optional short career demonstration: no assumed employer, role or sector.
const careerVocabulary = {
  professions: [
    ['Area Manager for France','responsable de zone pour la France','I am the Area Manager for France.','A manager responsible for business activities in a particular geographical area.'],
    ['sales representative','commercial / commerciale','I work as a sales representative.'],
    ['sales manager','responsable commercial(e)','I work as a sales manager.'],
    ['account manager','responsable de comptes clients','I work as an account manager.'],
    ['business developer','chargé(e) de développement commercial','I work as a business developer.'],
    ['project manager','chef(fe) de projet','I work as a project manager.'],
    ['technician','technicien(ne)','I work as a technician.'],
    ['engineer','ingénieur(e)','I work as an engineer.'],
    ['administrative assistant','assistant(e) administratif(ve)','I work as an administrative assistant.'],
    ['customer service adviser','conseiller / conseillère clientèle','I work as a customer service adviser.'],
    ['director','directeur / directrice','I work as a director.']
  ],
  sectors: [
    ['the metal industry','industrie métallurgique / métallurgie','I work in the metal industry.','The sector that produces, processes or works with metals.'],
    ['sales','vente / commerce','I work in sales.'],
    ['manufacturing','industrie manufacturière','I work in manufacturing.'],
    ['construction','construction / bâtiment','I work in construction.'],
    ['engineering','ingénierie','I work in engineering.'],
    ['logistics','logistique','I work in logistics.'],
    ['information technology','informatique','I work in information technology.'],
    ['finance','finance','I work in finance.'],
    ['healthcare','santé','I work in healthcare.'],
    ['hospitality','hôtellerie / accueil','I work in hospitality.'],
    ['customer service','service client','I work in customer service.']
  ],
  tasks: [
    ['manage teams','encadrer des équipes','I manage several teams.','To lead and organise the work of a group of people.'],
    ['oversee sales','superviser les ventes','I oversee sales in France.','To monitor and be responsible for sales activities.'],
    ['monitor business results','suivre les résultats de l’activité','I monitor business results in France.','To check how well a business is performing.'],
    ['manage budgets','gérer les budgets','I manage budgets.','To plan and control how money is allocated and spent.'],
    ['work on sales forecasts','travailler sur les prévisions de ventes','I work on sales forecasts.','To estimate future sales using available information.'],
    ['recruit employees','recruter des collaborateurs','I also recruit employees.','To find and hire people for a company.'],
    ['technical marketing','marketing technique','I work on technical marketing.','Marketing focused on explaining technical products and their benefits.'],
    ['manage clients','gérer les clients','I manage clients.'],
    ['prepare quotations','préparer des devis','I prepare quotations.'],
    ['organise deliveries','organiser les livraisons','I organise deliveries.'],
    ['attend meetings','participer à des réunions','I attend meetings.'],
    ['coordinate a team','coordonner une équipe','I coordinate a team.'],
    ['solve problems','résoudre des problèmes','I solve problems.']
  ],
  situations: [
    ['present results','présenter les résultats','I present the results for France.','To explain business performance to other people.'],
    ['explain technical information','expliquer des informations techniques','I explain technical information to colleagues.','To make technical details clear to an audience.'],
    ['speak with international colleagues','échanger avec des collègues internationaux','I regularly speak with colleagues in Germany.','To communicate with people working in other countries.'],
    ['ask someone to repeat','demander de répéter','Could you repeat the last point, please?','To politely ask for information to be said again.'],
    ['speak with a client','parler avec un client','I speak with clients in English.'],
    ['write an email','rédiger un e-mail','I write emails in English.'],
    ['give a presentation','faire une présentation','I give presentations in English.'],
    ['join a video meeting','participer à une visioconférence','I join video meetings in English.'],
    ['explain a product','expliquer un produit','I explain products in English.'],
    ['ask for clarification','demander une précision','Could you clarify that, please?']
  ]
  ,introductions: [
    ['My name is…','Je m’appelle…','My name is Stéphane.','A simple way to say your name.'],
    ['I live in…','J’habite à…','I live in France.','Used to introduce where you live.'],
    ['I work for…','Je travaille pour…','I work for an international company.','Used to name your employer without describing your exact job.'],
    ['I am responsible for…','Je suis responsable de…','I am responsible for customer relationships.','A phrase for describing your main responsibility.'],
    ['I would like to…','J’aimerais…','I would like to speak more confidently.','A polite way to express your goal.'],
    ['in my free time','pendant mon temps libre','In my free time, I enjoy walking.','A useful phrase to talk about interests.']
  ],
  conversation: [
    ['I did not catch that.','Je n’ai pas bien compris / entendu.','Sorry, I did not catch that.','A polite way to explain that you missed part of what someone said.'],
    ['Could you rephrase that?','Pourriez-vous reformuler ?','Could you rephrase that, please?','A request to express the same idea in different words.'],
    ['Could you repeat that, please?','Pourriez-vous répéter, s’il vous plaît ?','Could you repeat that, please?','A polite request when you have not heard or understood.'],
    ['Could you speak more slowly?','Pourriez-vous parler plus lentement ?','Could you speak more slowly, please?','A request to reduce speaking speed.'],
    ['What does … mean?','Que signifie … ?','What does “quotation” mean?','A question for discovering the meaning of a word.'],
    ['How do you say … in English?','Comment dit-on … en anglais ?','How do you say « devis » in English?','A question for finding a translation.'],
    ['Let me think.','Laissez-moi réfléchir.','Let me think for a moment.','A natural expression to gain thinking time.'],
    ['Nice to meet you.','Ravi(e) de vous rencontrer.','Nice to meet you!','A friendly expression when you first meet someone.']
  ],
  learning: [
    ['confidence','confiance en soi','I want to build my confidence.','The feeling of being able to do something successfully.'],
    ['pronunciation','prononciation','I want to improve my pronunciation.','The way a word is spoken aloud.'],
    ['vocabulary','vocabulaire','I need more vocabulary for work.','The words you know and use in a language.'],
    ['to practise','s’entraîner / pratiquer','I want to practise speaking.','To repeat an activity in order to improve.'],
    ['to improve','améliorer / s’améliorer','I would like to improve my English.','To make something better over time.'],
    ['to feel comfortable','se sentir à l’aise','I want to feel comfortable in meetings.','To feel relaxed and not worried in a situation.']
  ],
  travel: [
    ['booking','réservation','I have a booking for tonight.','An arrangement made in advance for a room or service.'],
    ['directions','indications / chemin','Could you give me directions?','Instructions for finding a place.'],
    ['ticket','billet','Where can I buy a ticket?','A document that allows you to travel or enter somewhere.'],
    ['help','aide','Could you help me, please?','Assistance when you need support.'],
    ['appointment','rendez-vous','I have an appointment at ten.','A planned meeting at a particular time.'],
    ['colleague','collègue','I work with international colleagues.','A person you work with.']
  ]
};
const careerDefinitions = {"sales representative": "A person who sells products or services to customers.", "sales manager": "A person who leads or organises sales activities.", "account manager": "A person who manages relationships with assigned customers.", "business developer": "A person who finds new commercial opportunities.", "project manager": "A person who plans and coordinates projects.", "technician": "A person who installs, maintains or repairs technical equipment.", "engineer": "A professional who designs or develops technical solutions.", "administrative assistant": "A person who handles office organisation and administration.", "customer service adviser": "A person who helps customers with questions and problems.", "director": "A person who leads an organisation or department.", "sales": "The activity or business of selling products or services.", "manufacturing": "The industrial production of goods and products.", "construction": "The industry of building structures or infrastructure.", "engineering": "The field of designing and developing technical solutions.", "logistics": "The organisation of storage, transport and deliveries.", "information technology": "The field of computers, networks and digital systems.", "finance": "The field of managing money and financial services.", "healthcare": "Services related to health and medical treatment.", "hospitality": "Services for guests in hotels, restaurants and tourism.", "customer service": "Support provided to customers before or after purchase.", "manage clients": "To take care of relationships and requests from customers.", "prepare quotations": "To create written estimates of costs or prices.", "organise deliveries": "To plan how and when goods reach customers.", "attend meetings": "To be present and participate in business discussions.", "coordinate a team": "To organise the work of several colleagues.", "solve problems": "To find solutions when something does not work.", "speak with a client": "To have a conversation with a customer.", "write an email": "To compose and send a written electronic message.", "give a presentation": "To explain information to an audience.", "join a video meeting": "To participate in an online meeting with sound and video.", "explain a product": "To describe what a product is and how it works.", "ask for clarification": "To request a clearer explanation when something is not understood."};
const careerInfo = { selectedWords: [], quiz: 'Non essayé' };
function setupCareerLab() {
  const category = document.getElementById('careerCategory');
  const roles = document.getElementById('careerRole');
  const sectors = document.getElementById('careerSector');
  const populate = (el, items) => {
    items.forEach(item => {
      const option = document.createElement('option'); option.value = item[0]; option.textContent = `${item[0]} · ${item[1]}`; el.appendChild(option);
    });
  };
  populate(roles,careerVocabulary.professions); populate(sectors,careerVocabulary.sectors);
  category.addEventListener('change', renderCareerWords);
  document.getElementById('careerWordCards').addEventListener('click', e => {
    const btn = e.target.closest('[data-career-word]'); if (!btn) return;
    const word = careerVocabulary[category.value][Number(btn.dataset.careerWord)]; if (!word) return;
    if (e.target.closest('[data-say]')) { speak(word[0]); return; }
    const trigger = e.target.closest('.career-word-reveal');
    if (!trigger) return;
    const detail = btn.querySelector('.career-word-detail');
    const opening = detail.hidden; detail.hidden = !opening;
    trigger.setAttribute('aria-expanded', String(opening));
    if (opening && !careerInfo.selectedWords.includes(word[0])) careerInfo.selectedWords.push(word[0]);
  });
  [roles,sectors,document.getElementById('careerOtherRole'),document.getElementById('careerOtherSector')].forEach(el => el.addEventListener('input', updateCareerSentence));
  document.getElementById('careerSpeak').addEventListener('click', () => speak(buildCareerSentence()));
  document.getElementById('careerUse').addEventListener('click', () => {
    const sentence = buildCareerSentence();
    if (!roles.value && !sectors.value && !document.getElementById('careerOtherRole').value.trim() && !document.getElementById('careerOtherSector').value.trim()) {
      document.getElementById('careerSentence').textContent='Choose your role or field first · Choisissez d’abord un poste ou un secteur.';
      return;
    }
    const job = document.getElementById('jobInput');
    job.value = sentence; job.dispatchEvent(new Event('input',{bubbles:true}));
    showToast('Votre phrase a été ajoutée à « Votre contexte ».');
  });
  document.getElementById('careerQuiz').addEventListener('click', e => {
    const b = e.target.closest('button[data-answer]'); if (!b) return;
    const good = b.dataset.answer==='correct';
    careerInfo.quiz = good ? 'Réussie' : 'À retravailler';
    document.querySelectorAll('#careerQuiz button').forEach(x => { x.classList.remove('correct','incorrect'); x.setAttribute('aria-pressed', String(x === b)); });
    b.classList.add(good?'correct':'incorrect');
    document.getElementById('careerQuizFeedback').textContent = good ? '✓ Correct! “Work in” + a sector. Bravo !' : '↻ Essayez encore. Pour un secteur, on dit “I work IN sales.”';
  });
  document.getElementById('careerHearQuestions').addEventListener('click', () => speak('What do you do? Which field do you work in?'));
  renderCareerWords();updateCareerSentence();
}
function renderCareerWords() {
  const key = document.getElementById('careerCategory').value;
  const holder = document.getElementById('careerWordCards'); holder.replaceChildren();
  careerVocabulary[key].forEach((entry,i) => {
    const card = document.createElement('div');card.className='career-word';card.dataset.careerWord=String(i);
    const top = document.createElement('div');top.className='career-word-top';
    const reveal = document.createElement('button');reveal.type='button';reveal.className='career-word-reveal';reveal.setAttribute('aria-expanded','false');reveal.textContent=entry[0]+'  ⌄';
    const listen = document.createElement('button');listen.type='button';listen.className='career-word-play';listen.dataset.say='true';listen.textContent='▶ Listen';listen.setAttribute('aria-label','Listen to '+entry[0]);
    top.append(reveal,listen);
    const more = document.createElement('div');more.className='career-word-detail';more.hidden=true;
    const fr=document.createElement('span');fr.textContent='🇫🇷 '+entry[1];
    const definition=document.createElement('span');definition.className='career-definition';definition.textContent='Meaning · '+(entry[3] || careerDefinitions[entry[0]] || 'A useful word or phrase for this conversation.');
    const example=document.createElement('em');example.textContent='Example · '+entry[2];more.append(fr,definition,example);
    card.append(top,more);holder.appendChild(card);
  });
}
function buildCareerSentence() {
  const role = document.getElementById('careerOtherRole').value.trim() || document.getElementById('careerRole').value;
  const sector = document.getElementById('careerOtherSector').value.trim() || document.getElementById('careerSector').value;
  if (role === 'Area Manager for France') return sector ? `I am the Area Manager for France. I work in ${sector}.` : 'I am the Area Manager for France.';
  const article = /^[aeiou]/i.test(role)?'an':'a';
  if (role && sector) return `I work as ${article} ${role} in ${sector}.`;
  if (role) return `I work as ${article} ${role}.`;
  if (sector) return `I work in ${sector}.`;
  return 'I work as a … / I work in …';
}
function updateCareerSentence() {
  document.getElementById('careerSentence').textContent=buildCareerSentence();
  const role = document.getElementById('careerOtherRole').value.trim() || document.getElementById('careerRole').value;
  const sector = document.getElementById('careerOtherSector').value.trim() || document.getElementById('careerSector').value;
  const roleFr=careerVocabulary.professions.find(x=>x[0]===role)?.[1] || role;
  const sectorFr=careerVocabulary.sectors.find(x=>x[0]===sector)?.[1] || sector;
  document.getElementById('careerSentenceFr').textContent = role === 'Area Manager for France' ? `Je suis responsable de la France${sector ? ` dans le secteur ${sectorFr}` : ''}.` : role && sector ? `Je travaille comme ${roleFr} dans le domaine ${sectorFr}.` : role ? `Je travaille comme ${roleFr}.` : sector ? `Je travaille dans le secteur ${sectorFr}.` : 'Je travaille comme… / dans le secteur…';
}

function initialise() {
  setupCareerLab();
  createStepDots();
  buildQuestionRail();
  buildRubric();
  renderQuestion(0);
  renderMission('professional');
  updateAfterModel();
  updateProgress();
  updateTimer();
  setDateStamp();
  bindEvents();
  restoreSession();
  updateAdaptiveBanner();
  updateSuccessCard(false);
}

function bindEvents() {
  document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => navigate(1)));
  document.querySelectorAll('[data-prev]').forEach(button => button.addEventListener('click', () => navigate(-1)));

  document.getElementById('translationToggle').addEventListener('click', toggleTranslations);
  document.addEventListener('click', event => {
    const button = event.target.closest('.speak-button[data-speak]');
    if (button) speak(button.dataset.speak);
  });

  document.getElementById('timerStart').addEventListener('click', startTimer);
  document.getElementById('timerPause').addEventListener('click', pauseTimer);
  document.getElementById('timerReset').addEventListener('click', resetTimer);

  setupMultiSelect('goalChoices', 'goals');
  setupMultiSelect('difficultyChoices', 'difficulties');
  setupMultiSelect('learningChoices', 'learning');

  ['jobInput', 'situationInput', 'wishInput'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      updateAdaptiveBanner();
      syncTeacherObjectives();
    });
  });

  document.getElementById('previousQuestion').addEventListener('click', () => moveQuestion(-1));
  document.getElementById('nextQuestion').addEventListener('click', () => moveQuestion(1));
  document.getElementById('saveAnswer').addEventListener('click', saveCurrentAnswer);
  document.getElementById('showSupport').addEventListener('click', () => document.getElementById('supportBox').classList.toggle('hidden'));
  document.getElementById('showModel').addEventListener('click', () => document.getElementById('modelBox').classList.toggle('hidden'));
  document.getElementById('hearQuestion').addEventListener('click', () => speak(questions[state.questionIndex].question));
  document.getElementById('hearAnswer').addEventListener('click', () => speak(questions[state.questionIndex].model));
  document.getElementById('hearBoth').addEventListener('click', () => speak(`${questions[state.questionIndex].question} ... ${questions[state.questionIndex].model}`));

  document.getElementById('missionTabs').addEventListener('click', event => {
    const tab = event.target.closest('[data-mission]');
    if (tab) renderMission(tab.dataset.mission);
  });
  document.getElementById('missionAudio').addEventListener('click', () => speak(missionData[state.mission].audio));
  document.getElementById('personalDetail').addEventListener('input', updateAnswerPreview);
  document.getElementById('speakPreview').addEventListener('click', () => speak(document.getElementById('answerPreview').dataset.english || missionData[state.mission].model));
  document.getElementById('copyPreview').addEventListener('click', () => copyText(document.getElementById('answerPreview').dataset.english || '', 'Réponse copiée.'));
  document.getElementById('clearBuilder').addEventListener('click', resetBuilder);
  document.getElementById('speakMissionModel').addEventListener('click', () => speak(missionData[state.mission].model));

  document.querySelector('.model-levels').addEventListener('click', event => {
    const button = event.target.closest('[data-after-model]');
    if (!button) return;
    state.afterModelLevel = button.dataset.afterModel;
    document.querySelectorAll('[data-after-model]').forEach(item => item.classList.toggle('active', item === button));
    updateAfterModel();
  });
  document.getElementById('hearAfterModel').addEventListener('click', () => speak(currentAfterModel().en));
  document.getElementById('useAfterModel').addEventListener('click', () => {
    document.getElementById('afterAnswer').value = currentAfterModel().en;
    showToast('Le modèle a été placé dans la version améliorée. Vous pouvez maintenant le personnaliser.');
    updateSuccessCard(false);
  });
  document.getElementById('afterAnswer').addEventListener('input', () => updateSuccessCard(false));
  setupRecorders();

  setupRating();
  document.getElementById('confidenceSlider').addEventListener('input', updateConfidence);
  document.getElementById('likedInput').addEventListener('input', () => updateSuccessCard(false));
  document.getElementById('changeInput').addEventListener('input', () => updateSuccessCard(false));
  document.getElementById('moreOfSelect').addEventListener('change', () => updateSuccessCard(false));
  document.getElementById('generatePlan').addEventListener('click', generatePlan);
  document.getElementById('copyPlan').addEventListener('click', () => copyText(state.planText, 'Parcours copié.'));
  document.getElementById('copyEvaluation').addEventListener('click', () => copyText(buildEvaluationText(), 'Évaluation copiée.'));
  document.getElementById('downloadEvaluation').addEventListener('click', downloadEvaluation);

  document.getElementById('refreshFinalText').addEventListener('click', () => updateSuccessCard(true));
  document.getElementById('hearFinalText').addEventListener('click', () => speak(document.getElementById('finalSuccessText').value));
  document.getElementById('copyFinalText').addEventListener('click', () => copyText(document.getElementById('finalSuccessText').value, 'Texte final copié.'));
  document.getElementById('downloadSuccess').addEventListener('click', downloadSuccess);
  document.getElementById('printSuccess').addEventListener('click', () => window.print());
  document.getElementById('saveSession').addEventListener('click', saveSession);

  ['teacherPanelButton', 'footerTeacherButton'].forEach(id => document.getElementById(id)?.addEventListener('click', openTeacherModal));
  document.querySelectorAll('[data-close-modal]').forEach(element => element.addEventListener('click', closeTeacherModal));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !document.getElementById('teacherModal').hidden) closeTeacherModal();
  });
  document.getElementById('generateReport').addEventListener('click', generateReport);
  document.getElementById('copyReport').addEventListener('click', () => copyText(document.getElementById('teacherReport').value, 'Message CFL copié.'));
  document.getElementById('downloadReport').addEventListener('click', downloadReport);
  document.getElementById('printReport').addEventListener('click', printReport);
  document.getElementById('resetSession').addEventListener('click', resetSession);
}

function toggleTranslations() {
  const visible = !document.body.classList.contains('show-fr');
  document.body.classList.toggle('show-fr', visible);
  const button = document.getElementById('translationToggle');
  button.classList.toggle('active', visible);
  button.setAttribute('aria-pressed', String(visible));
  button.lastElementChild.textContent = visible ? 'Traductions visibles' : 'Afficher le français';
}

function createStepDots() {
  sections.forEach((section, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Aller à : ${section.dataset.title}`);
    button.addEventListener('click', () => showSection(index));
    stepDots.appendChild(button);
  });
}

function navigate(direction) {
  showSection(Math.min(Math.max(state.sectionIndex + direction, 0), sections.length - 1));
}

function showSection(index) {
  sections[state.sectionIndex].classList.remove('active');
  state.sectionIndex = index;
  sections[index].classList.add('active');
  if (sections[index].id === 'success') updateSuccessCard(true);
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
  const percent = ((state.sectionIndex + 1) / sections.length) * 100;
  progressBar.style.width = `${percent}%`;
  progressLabel.textContent = sections[state.sectionIndex].dataset.title;
  [...stepDots.children].forEach((dot, index) => dot.classList.toggle('active', index === state.sectionIndex));
}

function startTimer() {
  if (state.timerInterval) return;
  state.timerInterval = window.setInterval(() => {
    if (state.timerSeconds <= 0) {
      pauseTimer();
      showToast('Les 30 minutes sont terminées. Vous pouvez poursuivre tranquillement si nécessaire.');
      return;
    }
    state.timerSeconds -= 1;
    updateTimer();
  }, 1000);
}
function pauseTimer() { window.clearInterval(state.timerInterval); state.timerInterval = null; }
function resetTimer() { pauseTimer(); state.timerSeconds = 30 * 60; updateTimer(); }
function updateTimer() {
  const minutes = String(Math.floor(state.timerSeconds / 60)).padStart(2, '0');
  const seconds = String(state.timerSeconds % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function setupMultiSelect(containerId, stateKey) {
  const container = document.getElementById(containerId);
  container.addEventListener('click', event => {
    const card = event.target.closest('[data-value]');
    if (!card) return;
    const value = card.dataset.value;
    const values = state[stateKey];
    const index = values.indexOf(value);
    if (index >= 0) values.splice(index, 1);
    else values.push(value);
    card.classList.toggle('selected', index < 0);
    updateAdaptiveBanner();
    updateSuccessCard(false);
    syncTeacherObjectives();
  });
}

function updateAdaptiveBanner() {
  const banner = document.getElementById('adaptiveBanner');
  const goalFr = labelsFor(state.goals, goalLabels, 'fr');
  const difficultyFr = labelsFor(state.difficulties, difficultyLabels, 'fr');
  const learningFr = labelsFor(state.learning, learningLabels, 'fr');
  const tags = [...state.goals.map(v => goalLabels[v]?.card), ...state.difficulties.map(v => difficultyLabels[v]?.card), ...state.learning.map(v => learningLabels[v]?.card)].filter(Boolean);

  let message = 'Sélectionnez vos objectifs, vos difficultés et vos préférences pour voir votre profil personnalisé.';
  if (state.goals.length || state.difficulties.length || state.learning.length) {
    const parts = [];
    if (goalFr.length) parts.push(`vos objectifs : ${joinNatural(goalFr)}`);
    if (difficultyFr.length) parts.push(`un accompagnement renforcé pour ${joinNatural(difficultyFr)}`);
    if (learningFr.length) parts.push(`davantage de ${joinNatural(learningFr)}`);
    message = `Votre parcours pourra intégrer ${parts.join(', ')}. Les aides seront progressivement réduites à mesure que votre confiance augmente.`;
  }
  banner.innerHTML = `<span class="adaptive-icon">✦</span><div><strong>Votre séance s'adapte en direct.</strong><p>${escapeHtml(message)}</p>${tags.length ? `<div class="summary-tags">${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>` : ''}</div>`;
}

function buildQuestionRail() {
  const rail = document.getElementById('questionRail');
  questions.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = `<span>${index + 1}</span><strong>${item.level}<em>${item.levelFr}</em></strong>`;
    button.addEventListener('click', () => renderQuestion(index));
    rail.appendChild(button);
  });
}

function renderQuestion(index) {
  state.questionIndex = Math.min(Math.max(index, 0), questions.length - 1);
  const item = questions[state.questionIndex];
  document.getElementById('questionLevel').textContent = `${item.level} · ${item.levelFr}`;
  document.getElementById('questionCounter').textContent = `${state.questionIndex + 1} / ${questions.length}`;
  document.getElementById('currentQuestion').textContent = item.question;
  document.getElementById('questionTranslation').textContent = item.translation;
  document.getElementById('supportBox').innerHTML = `<strong>Useful structure · Structure utile</strong><p>${escapeHtml(item.support)}</p><small>${escapeHtml(item.supportFr)}</small>`;
  document.getElementById('modelBox').innerHTML = `<strong>Possible answer · Réponse possible</strong><p>${escapeHtml(item.model)}</p><small>${escapeHtml(item.modelFr)}</small><button class="mini-button model-listen" type="button">🔊 Écouter cette réponse</button>`;
  document.getElementById('modelBox').querySelector('.model-listen').addEventListener('click', () => speak(item.model));
  document.getElementById('supportBox').classList.add('hidden');
  document.getElementById('modelBox').classList.add('hidden');
  document.getElementById('conversationAnswer').value = state.answers[state.questionIndex] || '';
  document.getElementById('answerSaved').textContent = '';
  [...document.getElementById('questionRail').children].forEach((button, i) => button.classList.toggle('active', i === state.questionIndex));
  document.getElementById('previousQuestion').disabled = state.questionIndex === 0;
  document.getElementById('nextQuestion').disabled = state.questionIndex === questions.length - 1;
}

function moveQuestion(direction) {
  saveCurrentAnswer(false);
  renderQuestion(state.questionIndex + direction);
}
function saveCurrentAnswer(showMessage = true) {
  state.answers[state.questionIndex] = document.getElementById('conversationAnswer').value.trim();
  if (showMessage) document.getElementById('answerSaved').textContent = 'Réponse enregistrée. Vous pouvez la modifier à tout moment.';
}

function renderMission(key) {
  state.mission = key;
  state.builderSelections = {};
  const data = missionData[key];
  document.querySelectorAll('[data-mission]').forEach(tab => tab.classList.toggle('active', tab.dataset.mission === key));
  document.getElementById('missionTitle').textContent = data.title;
  document.getElementById('missionContext').textContent = data.context;
  document.getElementById('missionTranslation').textContent = data.translation;
  document.getElementById('missionModel').textContent = data.model;
  document.getElementById('missionModelFr').textContent = data.modelFr;
  document.getElementById('personalDetail').value = '';

  const container = document.getElementById('sentenceParts');
  container.innerHTML = '';
  data.parts.forEach((part, partIndex) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'sentence-part';
    wrapper.innerHTML = `<span>${escapeHtml(part.label)}</span>`;
    const chips = document.createElement('div');
    chips.className = 'option-chips';
    part.options.forEach(option => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'option-chip';
      chip.innerHTML = `<strong>${escapeHtml(option.en)}</strong><small>${escapeHtml(option.fr)}</small>`;
      chip.addEventListener('click', () => {
        state.builderSelections[partIndex] = option;
        [...chips.children].forEach(child => child.classList.toggle('selected', child === chip));
        updateAnswerPreview();
      });
      chips.appendChild(chip);
    });
    wrapper.appendChild(chips);
    container.appendChild(wrapper);
  });
  updateAnswerPreview();
  updateAfterModel();
  updateSuccessCard(false);
}

function updateAnswerPreview() {
  const selections = Object.keys(state.builderSelections).sort((a, b) => Number(a) - Number(b)).map(key => state.builderSelections[key]);
  const personal = document.getElementById('personalDetail').value.trim();
  const english = [...selections.map(item => item.en), personal].filter(Boolean).join(' ');
  const french = selections.map(item => item.fr).filter(Boolean).join(' ');
  const preview = document.getElementById('answerPreview');
  preview.dataset.english = english;
  preview.innerHTML = english ? `<strong>${escapeHtml(english)}</strong>${french ? `<span class="preview-fr">${escapeHtml(french)}</span>` : ''}` : 'Choisissez une phrase dans chaque catégorie.';
}

function resetBuilder() {
  state.builderSelections = {};
  document.querySelectorAll('.option-chip').forEach(chip => chip.classList.remove('selected'));
  document.getElementById('personalDetail').value = '';
  updateAnswerPreview();
}

function currentAfterModel() { return missionData[state.mission].after[state.afterModelLevel]; }
function updateAfterModel() {
  const model = currentAfterModel();
  document.getElementById('afterModelText').textContent = model.en;
  document.getElementById('afterModelFr').textContent = model.fr;
}

function speak(text) {
  if (!text) return;
  if (!('speechSynthesis' in window)) {
    showToast("La lecture audio n'est pas disponible dans ce navigateur.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = accentSelect.value;
  utterance.rate = 0.88;
  utterance.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(voice => voice.lang === accentSelect.value) || voices.find(voice => voice.lang.startsWith(accentSelect.value.split('-')[0]));
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

function setupRecorders() {
  document.querySelectorAll('.record-panel').forEach(panel => {
    const recordButton = panel.querySelector('[data-record]');
    const stopButton = panel.querySelector('[data-stop]');
    const audio = panel.querySelector('audio');
    const download = panel.querySelector('.download-recording');
    const status = panel.querySelector('.record-status');
    let recorder;
    let chunks = [];
    let stream;

    recordButton.addEventListener('click', async () => {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        status.textContent = "L'enregistrement n'est pas pris en charge dans ce navigateur. Le dictaphone du téléphone peut être utilisé.";
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        chunks = [];
        recorder = new MediaRecorder(stream);
        recorder.addEventListener('dataavailable', event => { if (event.data.size > 0) chunks.push(event.data); });
        recorder.addEventListener('stop', () => {
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          const url = URL.createObjectURL(blob);
          audio.src = url;
          audio.hidden = false;
          download.href = url;
          download.classList.remove('hidden');
          status.textContent = 'Enregistrement prêt : écoutez, recommencez ou téléchargez-le.';
          stream?.getTracks().forEach(track => track.stop());
        });
        recorder.start();
        recordButton.classList.add('recording');
        recordButton.disabled = true;
        stopButton.disabled = false;
        status.textContent = 'Enregistrement en cours… Parlez naturellement.';
      } catch (error) {
        status.textContent = "Le microphone n'est pas disponible. Vérifiez l'autorisation du navigateur ou utilisez un téléphone.";
      }
    });

    stopButton.addEventListener('click', () => {
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      recordButton.classList.remove('recording');
      recordButton.disabled = false;
      stopButton.disabled = true;
    });
  });
}

function setupRating() {
  document.querySelector('.emoji-rating').addEventListener('click', event => {
    const button = event.target.closest('[data-value]');
    if (!button) return;
    state.onlineRating = Number(button.dataset.value);
    document.querySelectorAll('.emoji-rating button').forEach(item => item.classList.toggle('selected', item === button));
    const labels = ['', 'Très inconfortable', 'Un peu inconfortable', 'Neutre', 'À l’aise', 'Très à l’aise'];
    document.getElementById('onlineRatingLabel').textContent = labels[state.onlineRating];
  });
}

function updateConfidence() {
  const value = document.getElementById('confidenceSlider').value;
  document.getElementById('confidenceValue').textContent = `${value} / 10`;
  document.getElementById('cardConfidence').textContent = `${value} / 10`;
}

function generatePlan() {
  const goals = labelsFor(state.goals, goalLabels, 'fr');
  const difficulties = labelsFor(state.difficulties, difficultyLabels, 'fr');
  const learning = labelsFor(state.learning, learningLabels, 'fr');
  const situation = document.getElementById('situationInput').value.trim();
  const moreOf = document.getElementById('moreOfSelect').selectedOptions[0].textContent;
  const liked = document.getElementById('likedInput').value.trim();

  const steps = [
    { title: '1 · Objectif réel', text: goals.length ? `Chaque séance travaillera un objectif concret lié à ${joinNatural(goals)}.` : 'Chaque séance commencera par un objectif concret défini avec vous.' },
    { title: '2 · Méthode adaptée', text: learning.length ? `Les activités privilégieront ${joinNatural(learning)}, sans négliger les autres compétences.` : "Un équilibre entre écoute, oral, supports visuels et pratique permettra d'identifier ce qui vous aide le plus." },
    { title: '3 · Soutien ciblé', text: difficulties.length ? `Des modèles et des étapes guidées seront prévus pour ${joinNatural(difficulties)}, puis l'aide diminuera progressivement.` : 'Les besoins prioritaires seront précisés progressivement, sans vous mettre en difficulté.' },
    { title: '4 · Ajustement continu', text: `Votre retour après chaque séance permettra de conserver ce qui fonctionne${liked ? `, notamment « ${liked} »` : ''}, et de proposer davantage de ${moreOf.toLowerCase()}.` }
  ];
  if (situation) steps.splice(1, 0, { title: 'Situation prioritaire', text: `Une mise en situation sera préparée autour de : « ${situation} ».` });

  const content = document.getElementById('planContent');
  content.innerHTML = steps.map(step => `<article><strong>${escapeHtml(step.title)}</strong><p>${escapeHtml(step.text)}</p></article>`).join('');
  document.getElementById('planTitle').textContent = 'Un parcours clair, progressif et construit autour de vous.';
  state.planText = `PARCOURS PERSONNALISÉ — STÉPHANE BECCARDI\n\n${steps.map(step => `${step.title}\n${step.text}`).join('\n\n')}`;
  document.getElementById('copyPlan').disabled = false;
  updateSuccessCard(false);
}

function buildEvaluationText() {
  const rating = state.onlineRating ? ['', 'Très inconfortable', 'Un peu inconfortable', 'Neutre', 'À l’aise', 'Très à l’aise'][state.onlineRating] : 'Non renseigné';
  return `ÉVALUATION DE FIN DE SÉANCE — STÉPHANE BECCARDI\n\nRessenti sur le format en ligne : ${rating}\nConfiance : ${document.getElementById('confidenceSlider').value}/10\n\nCe que j'ai le plus aimé :\n${document.getElementById('likedInput').value.trim() || 'Non renseigné'}\n\nCe que j'ai moins aimé ou souhaite changer :\n${document.getElementById('changeInput').value.trim() || 'Non renseigné'}\n\nCe que j'aimerais davantage :\n${document.getElementById('moreOfSelect').selectedOptions[0].textContent}\n\nCe retour sera utilisé pour adapter la prochaine séance.`;
}

function downloadEvaluation() { downloadText('evaluation-stephane-fromholz.txt', buildEvaluationText()); }

function buildFinalSuccessText() {
  const base = document.getElementById('afterAnswer').value.trim() || document.getElementById('answerPreview').dataset.english || missionData[state.mission].after.natural.en;
  const goalEn = labelsFor(state.goals, goalLabels, 'en');
  const difficultyEn = labelsFor(state.difficulties, difficultyLabels, 'en');
  const learningEn = labelsFor(state.learning, learningLabels, 'en');

  const sentence2 = goalEn.length
    ? `My English training can be built around my real goals, especially ${joinEnglish(goalEn)}.`
    : 'My English training can be built around my real goals and the situations that matter to me.';
  const sentence3 = difficultyEn.length
    ? `I will receive clear, progressive support for ${joinEnglish(difficultyEn)}.`
    : 'I will receive clear, progressive support whenever I need it.';
  const sentence4 = learningEn.length
    ? `Activities such as ${joinEnglish(learningEn)} will help me understand, remember and communicate.`
    : 'A balanced mix of listening, speaking, visual support and practical activities will help me progress.';

  return `${base}\n\nToday, I completed my first personalised online English lesson with CFL Welcome. ${sentence2} ${sentence3} ${sentence4} After every lesson, I can explain what helped me, what was difficult and what I would like to change. I do not need to be perfect before I speak: I can prepare, practise, receive feedback and try again. I am proud of this first step, and I now know that I can progress step by step.`;
}

function updateSuccessCard(refreshText = false) {
  document.getElementById('cardGoal').textContent = state.goals.length ? state.goals.map(value => goalLabels[value].card).join(' · ') : 'À compléter pendant la séance';
  document.getElementById('cardLearning').textContent = state.learning.length ? state.learning.map(value => learningLabels[value].card).join(' · ') : 'À compléter pendant la séance';
  document.getElementById('cardFocus').textContent = state.difficulties.length ? state.difficulties.map(value => difficultyLabels[value].card).join(' · ') : 'À identifier ensemble';
  updateConfidence();

  const selectedAchievements = [...document.querySelectorAll('#microFeedback input:checked')].map(input => input.value);
  const achievement = selectedAchievements.length
    ? `I improved my answer with ${joinEnglish(selectedAchievements.map(item => item.toLowerCase()))}.`
    : 'I completed my first personalised online English lesson and communicated in English.';
  document.getElementById('achievementText').textContent = achievement;

  const finalField = document.getElementById('finalSuccessText');
  if (refreshText || !finalField.value.trim()) finalField.value = buildFinalSuccessText();
}

function downloadSuccess() {
  updateSuccessCard(false);
  const text = `PERSONAL ENGLISH SUCCESS CARD\nSTÉPHANE FROMHOLZ\n${document.getElementById('dateStamp').textContent}\n\nMY GOALS\n${document.getElementById('cardGoal').textContent}\n\nMY LEARNING STRENGTHS\n${document.getElementById('cardLearning').textContent}\n\nMY PRIORITY AREAS\n${document.getElementById('cardFocus').textContent}\n\nMY CONFIDENCE\n${document.getElementById('cardConfidence').textContent}\n\nMY FINAL ENGLISH MESSAGE\n${document.getElementById('finalSuccessText').value}\n\nCFL WELCOME METHOD\nI am supported. I practise useful English. My feedback changes my lessons. I progress step by step.`;
  downloadText('reussite-anglais-stephane-fromholz.txt', text);
}

function setDateStamp() {
  document.getElementById('dateStamp').textContent = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date());
}

function collectSessionData() {
  return {
    goals: state.goals,
    difficulties: state.difficulties,
    learning: state.learning,
    answers: state.answers,
    mission: state.mission,
    job: document.getElementById('jobInput').value,
    career: {
      category: document.getElementById('careerCategory').value,
      role: document.getElementById('careerRole').value,
      sector: document.getElementById('careerSector').value,
      otherRole: document.getElementById('careerOtherRole').value,
      otherSector: document.getElementById('careerOtherSector').value,
      words: careerInfo.selectedWords,
      quiz: careerInfo.quiz
    },
    situation: document.getElementById('situationInput').value,
    wish: document.getElementById('wishInput').value,
    beforeAnswer: document.getElementById('beforeAnswer').value,
    afterAnswer: document.getElementById('afterAnswer').value,
    liked: document.getElementById('likedInput').value,
    change: document.getElementById('changeInput').value,
    moreOf: document.getElementById('moreOfSelect').value,
    confidence: document.getElementById('confidenceSlider').value,
    onlineRating: state.onlineRating,
    finalText: document.getElementById('finalSuccessText').value,
    planText: state.planText
  };
}

function saveSession() {
  try {
    localStorage.setItem('cflFromholzTrial2026', JSON.stringify(collectSessionData()));
    document.getElementById('saveStatus').textContent = 'Séance enregistrée dans ce navigateur.';
    showToast('Séance enregistrée.');
  } catch (error) {
    document.getElementById('saveStatus').textContent = "L'enregistrement local n'est pas disponible dans ce mode de navigation.";
  }
}

function restoreSession() {
  try {
    const raw = localStorage.getItem('cflFromholzTrial2026');
    if (!raw) return;
    const data = JSON.parse(raw);
    state.goals = Array.isArray(data.goals) ? data.goals : [];
    state.difficulties = Array.isArray(data.difficulties) ? data.difficulties : [];
    state.learning = Array.isArray(data.learning) ? data.learning : [];
    state.answers = data.answers || {};
    state.onlineRating = data.onlineRating || null;
    state.planText = data.planText || '';

    markSelections('goalChoices', state.goals);
    markSelections('difficultyChoices', state.difficulties);
    markSelections('learningChoices', state.learning);
    document.getElementById('jobInput').value = data.job || '';
    if (data.career) {
      document.getElementById('careerCategory').value = data.career.category || 'professions';
      document.getElementById('careerRole').value = data.career.role || '';
      document.getElementById('careerSector').value = data.career.sector || '';
      document.getElementById('careerOtherRole').value = data.career.otherRole || '';
      document.getElementById('careerOtherSector').value = data.career.otherSector || '';
      careerInfo.selectedWords = data.career.words || [];
      careerInfo.quiz = data.career.quiz || 'Non essayé';
      renderCareerWords(); updateCareerSentence();
    }
    document.getElementById('situationInput').value = data.situation || '';
    document.getElementById('wishInput').value = data.wish || '';
    document.getElementById('beforeAnswer').value = data.beforeAnswer || '';
    document.getElementById('afterAnswer').value = data.afterAnswer || '';
    document.getElementById('likedInput').value = data.liked || '';
    document.getElementById('changeInput').value = data.change || '';
    document.getElementById('moreOfSelect').value = data.moreOf || 'speaking practice';
    document.getElementById('confidenceSlider').value = data.confidence || 5;
    document.getElementById('finalSuccessText').value = data.finalText || '';
    if (state.onlineRating) {
      const button = document.querySelector(`.emoji-rating [data-value="${state.onlineRating}"]`);
      button?.classList.add('selected');
      document.getElementById('onlineRatingLabel').textContent = ['', 'Très inconfortable', 'Un peu inconfortable', 'Neutre', 'À l’aise', 'Très à l’aise'][state.onlineRating];
    }
    if (data.mission && missionData[data.mission]) renderMission(data.mission);
    updateConfidence();
    updateAdaptiveBanner();
    updateSuccessCard(false);
  } catch (error) {
    console.warn('Impossible de restaurer la séance enregistrée.', error);
  }
}

function markSelections(containerId, values) {
  values.forEach(value => document.querySelector(`#${containerId} [data-value="${value}"]`)?.classList.add('selected'));
}

function resetSession() {
  if (!window.confirm('Réinitialiser toutes les informations de cette séance ?')) return;
  try { localStorage.removeItem('cflFromholzTrial2026'); } catch (error) { console.warn(error); }
  window.location.reload();
}

function openTeacherModal() {
  syncTeacherObjectives();
  document.getElementById('teacherModal').hidden = false;
  document.body.classList.add('modal-open');
}
function closeTeacherModal() {
  document.getElementById('teacherModal').hidden = true;
  document.body.classList.remove('modal-open');
}

function buildRubric() {
  const grid = document.getElementById('rubricGrid');
  rubricItems.forEach((item, index) => {
    const label = document.createElement('label');
    label.className = 'rubric-row';
    label.innerHTML = `<span>${escapeHtml(item)}</span><select data-rubric-index="${index}"><option value="Non observé">Non observé</option><option value="À renforcer">À renforcer</option><option value="En cours d'acquisition">En cours d'acquisition</option><option value="Fonctionnel">Fonctionnel</option><option value="Point fort">Point fort</option></select>`;
    grid.appendChild(label);
  });
}

function syncTeacherObjectives() {
  const goals = labelsFor(state.goals, goalLabels, 'fr');
  const difficulties = labelsFor(state.difficulties, difficultyLabels, 'fr');
  const learning = labelsFor(state.learning, learningLabels, 'fr');
  const job = document.getElementById('jobInput').value.trim();
  const situation = document.getElementById('situationInput').value.trim();
  const wish = document.getElementById('wishInput').value.trim();
  const lines = [
    goals.length ? `Objectifs sélectionnés : ${joinNatural(goals)}.` : '',
    difficulties.length ? `Difficultés déclarées : ${joinNatural(difficulties)}.` : '',
    learning.length ? `Préférences d'apprentissage : ${joinNatural(learning)}.` : '',
    job ? `Métier / secteur : ${job}.` : '',
    situation ? `Situation utile : ${situation}.` : '',
    wish ? `Souhait principal : ${wish}.` : ''
  ].filter(Boolean);
  const field = document.getElementById('teacherObjectives');
  if (!field.dataset.manuallyEdited) field.value = lines.join('\n');
}

function generateReport() {
  const rubric = [...document.querySelectorAll('[data-rubric-index]')].map((select, index) => ({ label: rubricItems[index], value: select.value }));
  const strengths = document.getElementById('teacherStrengths').value.trim() || inferStrengths(rubric);
  const priorities = document.getElementById('teacherPriorities').value.trim() || inferPriorities(rubric);
  const objectives = document.getElementById('teacherObjectives').value.trim() || 'Ses objectifs précis restent à confirmer lors de l’analyse complète des besoins.';
  const notes = document.getElementById('teacherNotes').value.trim();
  const technical = document.getElementById('technicalComfort').value;
  const level = document.getElementById('cefrLevel').value;
  const interest = document.getElementById('continuationInterest').value;
  const rhythm = document.getElementById('recommendedRhythm').value.trim();
  const rating = state.onlineRating ? ['', 'très inconfortable', 'un peu inconfortable', 'neutre', 'à l’aise', 'très à l’aise'][state.onlineRating] : 'non renseigné';
  const liked = document.getElementById('likedInput').value.trim();
  const change = document.getElementById('changeInput').value.trim();
  const moreOf = document.getElementById('moreOfSelect').selectedOptions[0].textContent;
  const learning = labelsFor(state.learning, learningLabels, 'fr');
  const difficulties = labelsFor(state.difficulties, difficultyLabels, 'fr');

  const report = `Objet : Retour sur le cours d'essai de M. Fromholz\n\nBonjour,\n\nComme convenu, voici mon retour à la suite du cours d’essai réalisé avec M. Stéphane Fromholz. Le compte rendu ci-dessous rassemble les observations de la séance pour faciliter le suivi du centre.\n\n${technical}. La séance a volontairement été présentée comme une découverte progressive et rassurante du format à distance, et non comme un test formel. M. Fromholz a pu utiliser un support interactif personnalisé, écouter les questions et les réponses modèles, bénéficier de traductions françaises, construire une réponse étape par étape, observer une progression avant/après et découvrir la possibilité d’enregistrer sa production orale.\n\nÀ la fin de la séance, son ressenti déclaré concernant le format en ligne était : ${rating}.\n\nConcernant son niveau d’anglais, je l’estimerais actuellement à ${level}. Cette première estimation devra naturellement être confirmée par une analyse plus complète de ses besoins et par l’observation de plusieurs compétences sur une durée plus longue.\n\nPoints forts observés :\n${formatBullets(strengths)}\n\nAxes de travail prioritaires :\n${formatBullets(priorities)}\n\nObjectifs, besoins et situations évoqués :\n${objectives}\n\n${learning.length ? `Les activités correspondant le mieux à ses préférences semblent être : ${joinNatural(learning)}. ` : ''}${difficulties.length ? `Il a indiqué avoir besoin d’un accompagnement particulier pour ${joinNatural(difficulties)}. ` : ''}Le principe d’une aide importante au début, puis progressivement réduite, semble adapté afin de renforcer son autonomie sans le décourager.\n\n${liked ? `Il a particulièrement apprécié : ${liked}. ` : ''}${change ? `Il souhaiterait toutefois modifier ou limiter : ${change}. ` : ''}Pour la suite, il aimerait davantage de : ${moreOf.toLowerCase()}.\n\n${interest}. Mon impression générale est qu’un accompagnement personnalisé, concret et progressif pourrait lui permettre de gagner en confiance. Je lui ai expliqué que chaque séance serait préparée à partir des informations qu’il communique, de ses objectifs réels et de sa façon d’apprendre, et qu’un court retour lui serait demandé après chaque cours afin d’ajuster les activités suivantes.\n\nJe recommanderais le rythme suivant : ${rhythm || 'à définir selon ses disponibilités et ses objectifs'}.\n\n${notes ? `Observations complémentaires :\n${notes}\n\n` : ''}Je reste bien entendu disponible si vous avez besoin d’informations complémentaires avant de le recontacter.\n\nBien cordialement,\n\nTisha`;

  const checklist = [...document.querySelectorAll('[data-rubric-index]')].map((el,i)=>`${rubricItems[i]} : ${el.value || 'Non observé'}`).join('\n');
  const checked = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(el=>el.closest('label')?.innerText?.trim() || el.value).filter(Boolean);
  const context = collectSessionData();
  const questionNotes = questions.map((q,i) => `${i+1}. ${q.question} — ${context.answers[i] || 'Aucune réponse enregistrée'}`).join('\n');
  const careerSummary = `Phrase professionnelle : ${buildCareerSentence()}\nPoste : ${context.career.role || context.career.otherRole || 'Non précisé'}\nSecteur : ${context.career.sector || context.career.otherSector || 'Non précisé'}\nMots découverts : ${careerInfo.selectedWords.join(', ') || 'Non relevés'}\nMini-exercice : ${careerInfo.quiz}`;
  const detailedReport = report + `\n\n--- ANNEXE : GRILLE COMPLÈTE D’OBSERVATION ---\n${checklist}\n\n--- EXPÉRIENCE DE LA SÉANCE ---\n${careerSummary}\n\nRéponses enregistrées aux questions :\n${questionNotes}\n\nObjectifs sélectionnés : ${state.goals.map(v=>goalLabels[v]?.fr||v).join(', ') || 'Non précisés'}\nPréférences de pratique : ${state.learning.map(v=>learningLabels[v]?.fr||v).join(', ') || 'Non précisées'}\nSituation souhaitée : ${context.situation || 'Non précisée'}\nSouhait principal : ${context.wish || 'Non précisé'}\n\nÉléments cochés pendant la séance :\n${checked.length ? checked.join('\n') : 'Aucun élément coché'}\n\nRéponses initiales :\n${document.getElementById('beforeAnswer')?.value || 'Non renseignées'}\n\nRéponses après accompagnement :\n${document.getElementById('afterAnswer')?.value || 'Non renseignées'}\n\nDate du compte rendu : ${new Date().toLocaleDateString('fr-FR')}\n`; 
  document.getElementById('teacherReport').value = detailedReport.replace(/ +\n/g, '\n');
  document.getElementById('reportStatus').textContent = 'Message généré. Relisez-le et personnalisez-le avant envoi.';
}

function inferStrengths(rubric) {
  const good = rubric.filter(item => ['Fonctionnel', 'Point fort'].includes(item.value)).map(item => item.label);
  return good.length ? good.join('\n') : 'Participation volontaire\nBonne réceptivité aux aides proposées\nImplication positive dans les activités personnalisées';
}
function inferPriorities(rubric) {
  const needs = rubric.filter(item => ['À renforcer', "En cours d'acquisition"].includes(item.value)).map(item => item.label);
  return needs.length ? needs.join('\n') : 'Développer progressivement la spontanéité à l’oral\nConsolider le vocabulaire et la construction des phrases\nRenforcer la confiance par des mises en situation régulières';
}
function formatBullets(text) { return text.split(/\n|;/).map(item => item.trim()).filter(Boolean).map(item => `• ${item}`).join('\n'); }
function downloadReport() {
  const text = document.getElementById('teacherReport').value.trim();
  if (!text) { showToast('Générez ou rédigez le message avant de le télécharger.'); return; }
  downloadText('retour-cours-essai-stephane-fromholz.txt', text);
}
function printReport() {
  document.body.classList.add('print-report');
  window.print();
  window.setTimeout(() => document.body.classList.remove('print-report'), 400);
}

async function copyText(text, successMessage) {
  if (!text?.trim()) { showToast('Aucun texte à copier pour le moment.'); return; }
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const temporary = document.createElement('textarea');
    temporary.value = text;
    temporary.style.position = 'fixed';
    temporary.style.opacity = '0';
    document.body.appendChild(temporary);
    temporary.select();
    document.execCommand('copy');
    temporary.remove();
  }
  showToast(successMessage);
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2800);
}

function labelsFor(values, dictionary, key) { return values.map(value => dictionary[value]?.[key]).filter(Boolean); }
function joinNatural(items) {
  if (items.length <= 1) return items[0] || '';
  if (items.length === 2) return `${items[0]} et ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} et ${items.at(-1)}`;
}
function joinEnglish(items) {
  if (items.length <= 1) return items[0] || '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
}
function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character]);
}

document.addEventListener('DOMContentLoaded', initialise);
