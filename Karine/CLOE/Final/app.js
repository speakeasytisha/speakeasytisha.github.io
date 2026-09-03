(() => {
  'use strict';
  window.KARINE_MOCK_VERSION='4.3';

  const STORAGE_KEY = 'karine_cloe_final_mock_v4';
  const CATEGORY_ORDER = ['vocabulary','grammar','expressions','reading','listening'];
  const CATEGORY_LABELS = {
    vocabulary:'Vocabulaire', grammar:'Grammaire & syntaxe', expressions:'Expressions', reading:'Compréhension de textes', listening:'Compréhension orale'
  };
  const LEVEL_LABELS = ['A0/A1','A1','A2','B1','B2','C1','C2'];
  const rubricLevels = ['Non évalué','A1−','A1','A1+','A2−','A2','A2+','B1−','B1','B1+','B2−','B2','B2+','C1','C2'];
  const rubricValue = {'A1−':.7,'A1':1,'A1+':1.25,'A2−':1.7,'A2':2,'A2+':2.25,'B1−':2.7,'B1':3,'B1+':3.25,'B2−':3.7,'B2':4,'B2+':4.25,'C1':5,'C2':6};

  const Q = (id,cat,d,prompt,options,answer,extra={}) => ({id,cat,d,prompt,options,answer,...extra});
  const bank = [
    // VOCABULARY
    Q('v1','vocabulary',1,'A person who comes to a salon for a service is a…',['client','receipt','shift','supplier'],0),
    Q('v2','vocabulary',1,'Please take a ____ while you wait.',['seat','road','price','turn'],0),
    Q('v3','vocabulary',1,'I work five days a week. Friday is my last working ____.',['day','office','hourly','job'],0),
    Q('v4','vocabulary',1,'To make hair shorter, you ____ it.',['cut','book','pay','wash up'],0),
    Q('v5','vocabulary',2,'Could you please ____ your appointment for Thursday at 10?',['confirm','borrow','repair','lend'],0),
    Q('v6','vocabulary',2,'The client would like only a small amount cut off the ends: a ____.',['trim','refund','meeting','delay'],0),
    Q('v7','vocabulary',2,'A product that makes hair softer after shampoo is ____.',['conditioner','schedule','invoice','uniform'],0),
    Q('v8','vocabulary',2,'We are fully booked this afternoon, but I can offer you an alternative ____.',['time slot','receipt book','job title','price tag'],0),
    Q('v9','vocabulary',3,'If a client is unhappy with a service, it is important to handle the ____ professionally.',['complaint','currency','equipment','overtime'],0),
    Q('v10','vocabulary',3,'The salon wants to ____ a new online booking system next month.',['introduce','retire','avoid','cancel out'],0),
    Q('v11','vocabulary',3,'Before colouring hair, we usually discuss the desired ____ and maintenance.',['shade','wage','queue','branch'],0),
    Q('v12','vocabulary',3,'A regular client is someone who comes ____.',['frequently','hardly','suddenly','barely'],0),
    Q('v13','vocabulary',4,'We need to ____ the client’s expectations before recommending a major change.',['assess','dismiss','postpone','refund'],0),
    Q('v14','vocabulary',4,'The manager asked the team to maintain a high ____ of customer care.',['standard','journey','forecast','outcome'],0),
    Q('v15','vocabulary',4,'The new treatment is suitable for fragile hair because it is particularly ____.',['gentle','narrow','brief','plain'],0),
    Q('v16','vocabulary',4,'A good consultation helps prevent misunderstandings and ensures the service is ____ to the client’s needs.',['tailored','borrowed','delayed','crowded'],0),

    // GRAMMAR
    Q('g1','grammar',1,'She ____ at the salon every Tuesday.',['works','work','working','worked'],0),
    Q('g2','grammar',1,'Yesterday, I ____ home at six.',['went','go','going','gone'],0),
    Q('g3','grammar',1,'We ____ a client right now.',['are helping','helped','helps','help'],0),
    Q('g4','grammar',1,'There ____ two appointments this morning.',['are','is','be','has'],0),
    Q('g5','grammar',2,'I have worked here ____ three years.',['for','since','during','from'],0),
    Q('g6','grammar',2,'If it rains tomorrow, we ____ at home.',['will stay','stayed','stay yesterday','would stayed'],0),
    Q('g7','grammar',2,'Have you ever ____ your hair very short?',['had','have','has','having'],0),
    Q('g8','grammar',2,'This colour is ____ than the previous one.',['lighter','more light','lightest','as light'],0),
    Q('g9','grammar',3,'When the client arrived, I ____ another appointment.',['was finishing','finish','have finish','am finished'],0),
    Q('g10','grammar',3,'I’ll call you as soon as I ____ a cancellation.',['have','will have','had','would have'],0),
    Q('g11','grammar',3,'The client asked me ____ the price included the treatment.',['whether','what','which did','that did'],0),
    Q('g12','grammar',3,'I’ve known this client ____ I opened the salon.',['since','for','during','ago'],0),
    Q('g13','grammar',4,'If I ____ more time yesterday, I would have explained the options in more detail.',['had had','would have','have had','would had'],0),
    Q('g14','grammar',4,'The appointment, ____ had been booked online, was moved to Friday.',['which','what','where','who'],0),
    Q('g15','grammar',4,'By the time the client arrived, we ____ the consultation notes.',['had already prepared','already prepare','have already prepare','were already prepare'],0),
    Q('g16','grammar',4,'The manager suggested ____ a short team meeting before opening.',['having','to have had','have','had'],0),

    // EXPRESSIONS
    Q('e1','expressions',1,'Client: “Thank you very much.” You: “____”',['You’re welcome.','Never mind me.','I am agree.','It is nothing for you.'],0),
    Q('e2','expressions',1,'You want to offer help. What do you say?',['How can I help you?','What you want?','You need what?','Why are you here?'],0),
    Q('e3','expressions',1,'You did not understand. What is the best response?',['Could you repeat that, please?','Repeat.','Again you speak.','I don’t hear English.'],0),
    Q('e4','expressions',1,'A client arrives. Which greeting is most appropriate?',['Good morning. How can I help you?','What is it?','Yes? Speak.','You are late.'],0),
    Q('e5','expressions',2,'A client wants 3 p.m., but it is unavailable.',['I’m afraid 3 p.m. is unavailable, but I can offer 4 p.m.','No. Three is impossible.','You must come four.','Three closed.'],0),
    Q('e6','expressions',2,'You want to check what the client means.',['So, if I understand correctly, you’d like to keep the length?','You say length, yes?','I understand all.','You mean what exactly again now?'],0),
    Q('e7','expressions',2,'A client apologises for being five minutes late.',['No problem. We can still see you.','It’s your fault.','You should not.','I don’t care.'],0),
    Q('e8','expressions',2,'You need a moment to check the diary.',['Just a moment, please. I’ll check that for you.','Wait there.','I search it.','Give me time.'],0),
    Q('e9','expressions',3,'A client complains that the colour is darker than expected.',['I’m sorry it isn’t what you expected. Let’s look at what we can do.','That is the colour you chose.','You are wrong about it.','Nothing can be done.'],0),
    Q('e10','expressions',3,'You want to make a polite recommendation.',['You might want to consider a softer shade.','You must take this colour.','I tell you this is better.','You are going to choose this.'],0),
    Q('e11','expressions',3,'You want to explain a delay professionally.',['We’re running about fifteen minutes behind schedule. Thank you for your patience.','We have delay. Wait.','The other client took too long.','You must be patient.'],0),
    Q('e12','expressions',3,'You want to end a phone call politely.',['Thank you for calling. We look forward to seeing you on Friday.','Okay bye then finished.','It’s all. Bye.','You can hang up.'],0),
    Q('e13','expressions',4,'A client is undecided and asks for your opinion.',['If you’d like a natural result, I’d recommend keeping your base colour and adding a few subtle highlights.','Do whatever you want.','Obviously you need highlights.','I don’t know; you decide.'],0),
    Q('e14','expressions',4,'A supplier says an order will be two days late. Which reply is most professional?',['Thanks for letting me know. Could you confirm the revised delivery date in writing?','That’s really bad. Fix it.','I refuse your delay.','You should have known earlier.'],0),
    Q('e15','expressions',4,'You want to disagree politely in a team discussion.',['I see your point, although I think we should also consider the impact on clients.','No, that’s wrong.','I don’t agree at all, end of discussion.','Your idea makes no sense.'],0),
    Q('e16','expressions',4,'A client asks for a service you believe could damage her hair.',['I understand the result you want, but I’d advise against doing it today because your hair is quite fragile.','I won’t do it because I said so.','That service is bad.','You cannot have it.'],0),

    // READING
    Q('r1','reading',1,'What time should the client arrive?',['9:15','9:30','9:45','10:00'],1,{passage:'Appointment reminder: Your appointment is confirmed for Tuesday at 9:30 a.m. Please arrive five minutes early.'}),
    Q('r2','reading',1,'Why is the salon closed?',['Staff training','A holiday','A delivery','A power cut'],0,{passage:'NOTICE: The salon will be closed on Monday morning for staff training. We will reopen at 1:30 p.m.'}),
    Q('r3','reading',1,'What must the client do to cancel?',['Call before 6 p.m. the day before','Send a letter','Come to the salon','Pay first'],0,{passage:'If you need to cancel, please call us before 6 p.m. on the day before your appointment.'}),
    Q('r4','reading',1,'Which service is included?',['A consultation','A haircut','A colour','A manicure'],0,{passage:'New client offer: free 10-minute consultation before any booked hair service.'}),
    Q('r5','reading',2,'What is the main purpose of the message?',['To move an appointment','To sell a product','To recruit staff','To ask for payment'],0,{passage:'Hello Mrs Martin, unfortunately your stylist will be unavailable at 11 a.m. tomorrow. We can see you at 12:30 p.m. with the same stylist or keep 11 a.m. with another member of the team. Please let us know which option you prefer.'}),
    Q('r6','reading',2,'What happens if a client cancels less than 24 hours before the appointment?',['A fee may be charged','The salon closes','The appointment moves automatically','The client receives a discount'],0,{passage:'Cancellation policy: Appointments may be changed free of charge up to 24 hours in advance. Late cancellations may be charged 50% of the booked service.'}),
    Q('r7','reading',2,'What is the client asking for?',['Advice before choosing a colour','A refund','A job interview','A home visit'],0,{passage:'I’m thinking about changing my hair colour but I’m not sure what would suit me. Could I book a consultation before deciding?' }),
    Q('r8','reading',2,'Which statement is true?',['The offer is only available on weekdays','The offer is valid every day','The offer is for children only','The offer ends at noon'],0,{passage:'September offer: 15% off selected treatments from Monday to Friday. Not valid on Saturdays or with other promotions.'}),
    Q('r9','reading',3,'Why did the client write this email?',['To explain a problem and ask for a solution','To book her first appointment','To apply for a job','To praise the new website'],0,{passage:'Dear Salon Team, I had my colour done yesterday and I’m happy with the shade, but I noticed a small area near the front that looks uneven in daylight. Would it be possible to come back this week so you can take a look? Kind regards, Emma.'}),
    Q('r10','reading',3,'What does the salon want employees to do?',['Check details with clients before starting','Finish every service faster','Stop taking online bookings','Sell more products'],0,{passage:'Team note: We have had several booking misunderstandings this month. From today, please confirm the service, expected duration and price with each client before you begin. This should reduce confusion at reception.'}),
    Q('r11','reading',3,'What is implied about the new booking system?',['It should reduce missed appointments','It will increase prices','It replaces all staff','It is only for new clients'],0,{passage:'Starting next week, clients who book online will receive an automatic reminder 48 hours before their appointment and can confirm or request a change directly from the message.'}),
    Q('r12','reading',3,'Why is the manager asking for feedback?',['To decide whether to keep a trial schedule','To evaluate a new product','To plan a holiday','To choose a supplier'],0,{passage:'We have now tested the extended Thursday opening hours for six weeks. Before making the change permanent, please send me your feedback on client demand, staffing and any difficulties you have noticed.'}),
    Q('r13','reading',4,'What is the writer’s main recommendation?',['Combine digital convenience with personal contact','Stop using online systems','Only accept telephone bookings','Reduce appointment reminders'],0,{passage:'Online booking has made scheduling more convenient for many clients, but it should not replace personal communication entirely. Complex services often require a short conversation to clarify expectations. A successful system therefore combines digital convenience with opportunities for direct contact.'}),
    Q('r14','reading',4,'Which problem does the policy mainly address?',['Unclear expectations before technical services','Lack of parking','Staff holidays','Late supplier deliveries'],0,{passage:'Following recent feedback, all major colour changes will now begin with a documented consultation. The stylist should record the client’s desired result, previous treatments and agreed maintenance plan. This is intended to ensure that both the client and stylist have the same expectations before the technical service begins.'}),
    Q('r15','reading',4,'What can be concluded about the complaint response process?',['The salon values both speed and careful investigation','Every complaint gets an immediate refund','Only managers may speak to clients','Complaints are handled only in writing'],0,{passage:'Our aim is to acknowledge complaints within one working day, even when a full answer requires more time. Staff should first listen carefully, record the facts and avoid promising a particular solution until the situation has been reviewed.'}),
    Q('r16','reading',4,'What is the central idea?',['Training can improve consistency as well as technical skill','Experienced staff do not need training','Customer service is less important than technique','Training should be optional for new systems'],0,{passage:'When teams are experienced, training is sometimes seen as unnecessary. However, short refresher sessions can help experienced colleagues agree on common standards, especially when procedures or client expectations change. The objective is not to question expertise but to ensure consistency.'}),

    // LISTENING
    Q('l1','listening',1,'What time is the appointment?',['Two o’clock','Three o’clock','Four o’clock','Five o’clock'],1,{script:'Hello, this is the salon calling to confirm your appointment tomorrow at three o’clock.'}),
    Q('l2','listening',1,'What does the client want?',['A trim','A colour correction','A manicure','A refund'],0,{script:'Hi. I’d like to book a simple trim, please. I don’t want to change the style.'}),
    Q('l3','listening',1,'Why is the client calling?',['To cancel','To complain','To order a product','To apply for a job'],0,{script:'Good morning. I’m calling because I can’t come to my appointment on Friday, so I need to cancel it.'}),
    Q('l4','listening',1,'Who will be late?',['The client','The stylist','The receptionist','The supplier'],0,{script:'Hello. I’m on my way, but there’s a lot of traffic. I think I’ll be about ten minutes late.'}),
    Q('l5','listening',2,'What alternative is offered?',['Thursday at 4:30','Wednesday at 3:00','Friday at 4:30','Thursday at 3:30'],0,{script:'I’m afraid Wednesday afternoon is fully booked. I can offer you Thursday at half past four if that works for you.'}),
    Q('l6','listening',2,'What does the client want to keep?',['Her current length','Her current colour','Her fringe','Her appointment time'],0,{script:'I’d like a fresher shape, but please don’t take too much off. I’d really like to keep the length.'}),
    Q('l7','listening',2,'What is included in the price?',['The treatment','A product to take home','A second appointment','A manicure'],0,{script:'The colour service is sixty-eight euros, and that includes the conditioning treatment at the basin.'}),
    Q('l8','listening',2,'What is the receptionist going to do?',['Check for a cancellation','Change the price','Call a supplier','Close the salon'],0,{script:'We’re fully booked on Saturday morning, but I can check whether we’ve had any cancellations and call you back.'}),
    Q('l9','listening',3,'What is the main concern?',['The client has a sensitive scalp','The client is late','The colour is too expensive','The stylist is unavailable'],0,{script:'Before we choose the colour, I just wanted to mention that my scalp can be quite sensitive, especially after colouring. Is there a gentler option we could use?'}),
    Q('l10','listening',3,'Why is the stylist recommending a consultation first?',['The requested change is significant','The client forgot to pay','The salon is closing','The colour is unavailable'],0,{script:'Going from very dark hair to that shade is quite a big change. I’d prefer to book a consultation first so we can check the condition of your hair and talk through what’s realistic.'}),
    Q('l11','listening',3,'What caused the delay?',['The previous service took longer than expected','A staff member arrived late','The booking system failed','A delivery did not arrive'],0,{script:'I’m sorry for the delay. The previous colour service took a little longer than we expected. Your stylist will be ready in about ten minutes.'}),
    Q('l12','listening',3,'What will happen next?',['The manager will review the situation and contact the client','The client must pay again','The salon will cancel all future appointments','The stylist will ignore the complaint'],0,{script:'Thank you for explaining what happened. I’ve made a note of the details. I’ll ask the manager to review it this afternoon and we’ll get back to you before the end of the day.'}),
    Q('l13','listening',4,'What is the speaker mainly proposing?',['A small trial before making a permanent change','Immediate permanent changes to opening hours','Reducing the number of clients','Closing on Thursdays'],0,{script:'Rather than changing our opening hours permanently, why don’t we test one late evening a week for the next two months? We could then compare demand and staff feedback before deciding.'}),
    Q('l14','listening',4,'What is the client’s priority?',['A natural result that is easy to maintain','The cheapest possible service','A dramatic colour change today','A very short haircut'],0,{script:'I’m open to changing the colour a little, but I don’t want anything that needs constant maintenance. I’d prefer something natural that grows out softly.'}),
    Q('l15','listening',4,'What does the manager want to avoid?',['Staff making promises before checking the facts','Clients sending emails','Appointments being confirmed','Staff writing notes'],0,{script:'If a client raises a complaint, please acknowledge it straight away, but don’t promise a refund or a free service until we’ve checked the booking notes and spoken to the team member involved.'}),
    Q('l16','listening',4,'What is the speaker’s view?',['Experience is valuable, but shared procedures still matter','Experienced staff should work alone','New staff should make all decisions','Procedures are unnecessary'],0,{script:'We have a very experienced team, which is a real strength. At the same time, when we all follow the same consultation process, clients receive a more consistent service regardless of who they see.'})
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
      title:'Partie 1 · Questions d’introduction',
      time:'4–5 minutes',
      objective:'Mettre la candidate à l’aise, puis vérifier qu’elle peut parler d’elle-même, de ses habitudes, d’un événement passé et d’un projet futur.',
      startLine:'Good morning. This interview has three parts. First, I’m going to ask you a few questions about yourself and your everyday life. Please answer as naturally as you can.',
      steps:[
        {ask:'Could you introduce yourself and tell me a little about your work?', follow:['What do you like most about your work?','How long have you worked in this field?']},
        {ask:'What do you usually do during a typical working day?', follow:['What time do you usually start?','What do you usually do when a client arrives?']},
        {ask:'What have you enjoyed most about learning English?', follow:['What has become easier for you?','What would you still like to improve?']},
        {ask:'Tell me about something you did recently outside work.', follow:['Who were you with?','What happened next?','Did you enjoy it? Why?']},
        {ask:'What are you planning to do in the next few weeks?', follow:['Why are you planning that?','Who are you going with?','What are you looking forward to?']}
      ],
      rescue:'If an answer is only one or two words, use one neutral prompt: “Could you tell me a little more?” Do not give vocabulary, grammar or a model sentence.',
      transition:'Thank you. We’ll now move on to a professional role-play.'
    },
    {
      title:'Partie 2 · Mise en situation professionnelle',
      time:'6–7 minutes',
      objective:'Évaluer l’interaction réelle : accueillir, poser des questions, reformuler, conseiller, gérer une inquiétude puis une réclamation et conclure.',
      startLine:'Imagine you are working in the salon and I am an English-speaking client. Please speak to me exactly as you would speak to a real client. You can ask me any questions you need.',
      roleplay:[
        {label:'Client · arrivée', say:'Good morning. It’s my first time here.', expect:'Laisser la candidate prendre l’initiative : saluer, proposer son aide, commencer la consultation.', fallback:'If she does not open the consultation: “I’d like to change my hair, but I’m not completely sure what would suit me.”'},
        {label:'Client · demande', say:'I’d like to go a little lighter, but I want the result to look natural and I don’t want too much maintenance.', expect:'Elle devrait clarifier la couleur actuelle, le résultat souhaité, l’entretien et éventuellement l’historique.', fallback:'If needed: “What would you recommend?”'},
        {label:'Client · information importante', say:'I coloured it myself at home about six weeks ago, and my hair feels a little dry now.', expect:'Observer si elle réagit à l’information, pose des questions et adapte son conseil.'},
        {label:'Client · inquiétude', say:'I’m worried about damaging my hair. Is it safe to make a big change today?', expect:'Attendre une recommandation prudente, une explication et une alternative réaliste.', fallback:'If her answer is very short: “Why would you recommend that?”'},
        {label:'Client · précision', say:'How long would the service take, and what would I need to do at home afterwards?', expect:'Évaluer explication, vocabulaire professionnel et capacité à donner des conseils simples.'},
        {label:'Changement de scénario · réclamation', say:'Now imagine I come back two days later. I say: “I’m sorry, but the colour looks darker than I expected and I’m disappointed.”', expect:'Elle doit reconnaître le problème sans blâmer, poser une ou deux questions et proposer une solution.'},
        {label:'Client · pression', say:'I have an important dinner tomorrow evening. Is there anything you can do before then?', expect:'Tester la gestion d’une contrainte et la capacité à proposer une prochaine étape réaliste.'},
        {label:'Client · clôture', say:'Okay, that sounds reasonable. What happens next?', expect:'La candidate confirme l’action, le rendez-vous ou le suivi puis termine poliment.'}
      ],
      rescue:'Do not correct her during the role-play. If communication breaks down completely, repeat the same client sentence once more slowly. Only reformulate the task if she still cannot continue.',
      stretch:'If she is comfortable, add ONE surprise: “I’m allergic to some products.” / “I can only come after 5 p.m.” / “Could you explain the difference between the two options?”',
      transition:'Thank you. For the final part, I’d like to discuss a few work-related topics with you.'
    },
    {
      title:'Partie 3 · Discussion professionnelle',
      time:'5–7 minutes',
      objective:'Vérifier qu’elle peut donner une opinion, la justifier, comparer des options et donner un exemple.',
      startLine:'For the last part, I’m going to ask you for your opinion about a few professional topics. There is no single correct answer; please explain your ideas and give examples when you can.',
      steps:[
        {ask:'In your opinion, what makes excellent customer service?', follow:['Which quality is the most important? Why?','Can you give me an example from your work?']},
        {ask:'Do you think online booking makes client service better? Why or why not?', follow:['What are the advantages?','Can there also be disadvantages?']},
        {ask:'Is it better for a salon to follow the same procedures with every client, or to adapt to each client?', follow:['Why?','Can you think of a situation where you would need to adapt?']},
        {ask:'How can learning English be useful in your work or when travelling?', follow:['Have you already used English in a real situation?','How would you like to use it in the future?']}
      ],
      rescue:'For A2/B1 probing, use neutral prompts such as “Why?”, “Can you explain?”, “Can you give me an example?” or “What are the advantages and disadvantages?” Avoid supplying the language she needs.',
      closeLine:'Thank you. That is the end of the oral interview.'
    }
  ];

  const writingTasks = [
    {id:'w1',title:'Tâche 1 · Message court',target:'40–60 mots',prompt:'An English-speaking client has an appointment tomorrow at 10:00. You need to move it to 11:30 because the stylist will be unavailable. Write a polite message, apologise, propose the new time and ask the client to confirm.',model:'Hello Mrs Brown,\nI’m sorry, but your stylist will not be available at 10:00 tomorrow. Would it be possible to move your appointment to 11:30? Please let me know if this new time is convenient for you. Thank you for your understanding.\nKind regards,\nKarine'},
    {id:'w2',title:'Tâche 2 · E-mail professionnel',target:'80–110 mots',prompt:'A new client asks for information before booking a colour service. Reply by email. Explain that you recommend a consultation first, give two reasons, propose two appointment times and invite the client to ask questions.',model:'Dear Ms Taylor,\nThank you for your message. Before a major colour service, I would recommend a short consultation. This allows us to discuss the result you would like and to check the condition of your hair so that we can choose the most suitable option.\nI could offer you a consultation on Tuesday at 2:30 p.m. or Thursday at 11:00 a.m. Please let me know which time works best for you.\nIf you have any questions before your appointment, I’ll be happy to help.\nKind regards,\nKarine'},
    {id:'w3',title:'Tâche 3 · Réponse à une réclamation',target:'100–140 mots',prompt:'A client writes that her colour is darker than expected and she is disappointed. Write a professional response. Acknowledge the problem, avoid blaming anyone, explain what you propose to do, and reassure the client.',model:'Dear Emma,\nThank you for contacting us. I’m sorry to hear that the colour looks darker than you expected. I understand that this is disappointing, and I would like us to look at it with you before deciding on the best solution.\nWould you be available to come back to the salon this week for a short consultation? We can check the result in person, review what was agreed during your first consultation and discuss the safest way to adjust the colour if necessary.\nOur priority is to make sure you feel comfortable with the result and with the next steps. Please send us your availability and we will arrange a suitable time.\nKind regards,\nKarine'}
  ];

  const defaultState = () => ({
    mode:'candidate', view:'home', written:{started:false,finished:false,categoryIndex:0,questionInCategory:0,totalIndex:0,currentId:null,currentDiff:2,streak:0,answers:[],categoryTheta:{vocabulary:2,grammar:2,expressions:2,reading:2,listening:2},used:[],remainingTotal:3000,remainingQuestion:45,audioPlays:0},
    oral:{started:false,finished:false,ratings:{},comments:'',remaining:1200,phase:0},
    writing:{answers:{w1:'',w2:'',w3:''},ratings:{},comments:''},
    manualGrades:{
      oral:{score20:'',level:''},
      writing:{score20:'',level:''}
    },
    finalComments:'', finalStatus:'Acquis', qualiopi:{statuses:{}}
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
    $('levelHint').textContent='Questionnaire évolutif';
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
    speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(q.script); u.lang='en-GB';u.rate=.92;
    const voices=speechSynthesis.getVoices(); const v=voices.find(x=>x.lang&&x.lang.toLowerCase().startsWith('en-gb'))||voices.find(x=>x.lang&&x.lang.toLowerCase().startsWith('en'));
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
    const wVals=CATEGORY_ORDER.map(c=>levelToNum(stats[c].level)).filter(Boolean);
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
          <p class="muted">Ces champs permettent de noter les productions après coup <strong>sans effacer les réponses de Karine</strong>. La note /20 et le niveau CECRL sont enregistrés dans le même navigateur et repris dans la synthèse, le rapport JSON et le certificat.</p>
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
    if(!confirm(`Effacer uniquement ${label} ? Les réponses de Karine seront conservées.`)) return;
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
    const r=computeOverall(); $('overallBadge').textContent=r.level;
    const cards=CATEGORY_ORDER.map(cat=>({label:CATEGORY_LABELS[cat],score:r.stats[cat].raw,level:r.stats[cat].level,sub:`${r.stats[cat].correct}/${r.stats[cat].total||10} réponses correctes`}));
    const oa=r.oralAssessment, wa=r.writingAssessment;
    cards.push({label:'Expression orale',score:oa.percent,level:oa.level||'À noter',sub:oa.score20!==null?`${formatManualScore(oa)} · note manuelle`:'Moyenne des 5 critères formateur'});
    cards.push({label:'Production écrite',score:wa.percent,level:wa.level||'À noter',sub:wa.score20!==null?`${formatManualScore(wa)} · note manuelle`:'Extension pédagogique, 5 critères'});
    $('resultsCards').innerHTML=cards.map(c=>`<article class="result-card"><div class="label">${c.label}</div><div class="score-row"><strong>${c.score===null?'—':c.score+'%'}</strong><span class="level">${c.level}</span></div><div class="meter"><span style="width:${c.score||0}%"></span></div><small>${c.sub}</small></article>`).join('');
    const baseline=1; const progress=r.overall?Math.max(0,r.overall-baseline):0;
    let summary=`Niveau pédagogique estimé : ${r.level}.\n\n`;
    if(state.written.finished){ const best=[...CATEGORY_ORDER].sort((a,b)=>r.stats[b].raw-r.stats[a].raw)[0]; const weak=[...CATEGORY_ORDER].sort((a,b)=>r.stats[a].raw-r.stats[b].raw)[0]; summary+=`Épreuve informatisée : point fort actuel — ${CATEGORY_LABELS[best]} (${r.stats[best].raw} %). Axe à consolider — ${CATEGORY_LABELS[weak]} (${r.stats[weak].raw} %).\n`; }
    if(oa.level){ summary+=`Expression orale : ${oa.score20!==null?formatManualScore(oa)+' · ':''}${oa.level}. `; } else summary+='Expression orale : notation formateur à compléter. ';
    if(wa.level){ summary+=`Production écrite : ${wa.score20!==null?formatManualScore(wa)+' · ':''}${wa.level}.\n`; } else if(wa.score20!==null){ summary+=`Production écrite : ${formatManualScore(wa)} · niveau CECRL à sélectionner.\n`; } else summary+='Production écrite : notation formateur à compléter.\n';
    if(r.overall>1.4)summary+=`Par rapport au résultat officiel antérieur A1, cette simulation met en évidence une progression mesurable${progress>=1?' d’au moins un palier CECRL':''}.`;
    $('summaryText').textContent=summary; $('finalComments').value=state.finalComments||''; $('finalStatus').value=state.finalStatus||'Acquis'; renderManualGrades(); renderQualiopi(r);
  }
  function levelPercent(n){ if(!n)return null; return Math.round(clamp((n/6)*100,0,100)); }
  function renderCertificate(){
    const r=computeOverall(); $('certLevel').textContent=r.level; $('certDate').textContent=new Intl.DateTimeFormat('fr-FR',{dateStyle:'long'}).format(new Date());
    const descriptors={A1:'peut communiquer de façon simple dans des situations très familières.',A2:'peut communiquer dans des situations courantes et professionnelles simples avec une autonomie croissante.',B1:'peut faire face à la plupart des situations courantes, expliquer ses choix et maintenir une interaction professionnelle simple.',B2:'peut interagir avec aisance et précision dans de nombreuses situations professionnelles, en développant et justifiant ses idées.',C1:'peut communiquer avec souplesse, précision et autonomie dans des contextes professionnels exigeants.',C2:'peut communiquer avec une maîtrise très fine, spontanée et précise dans pratiquement toute situation.'};
    $('certDescriptor').textContent=descriptors[r.level]||'Niveau en attente de l’évaluation finale.';
    const s=r.stats,oa=r.oralAssessment,wa=r.writingAssessment;
    $('certScores').innerHTML=`<span class="cert-score">Vocabulaire ${s.vocabulary.level}</span><span class="cert-score">Grammaire ${s.grammar.level}</span><span class="cert-score">Expressions ${s.expressions.level}</span><span class="cert-score">Lecture ${s.reading.level}</span><span class="cert-score">Écoute ${s.listening.level}</span>${oa.level?`<span class="cert-score">Oral ${oa.level}${oa.score20!==null?' · '+formatManualScore(oa):''}</span>`:''}${wa.level?`<span class="cert-score">Écrit ${wa.level}${wa.score20!==null?' · '+formatManualScore(wa):''}</span>`:''}`;
    $('certProgress').textContent=r.overall>1.4?`Progression observée depuis le point de départ officiel A1 du 16 avril 2026 : niveau actuel estimé ${r.level}.`:'Point de départ officiel documenté : A1 (27 août 2026).';
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
  function inferStatus(key,r){
    if(key==='oral') return r.oralAssessment.level?'Acquis':'En cours';
    if(key==='writing') return r.writingAssessment.level?'Acquis':'En cours';
    return state.written.finished?'Acquis':'En cours';
  }
  function copySummary(){
    const r=computeOverall(),oa=r.oralAssessment,wa=r.writingAssessment;
    const oralTxt=oa.level?`${oa.score20!==null?formatManualScore(oa)+' · ':''}${oa.level}`:(oa.score20!==null?`${formatManualScore(oa)} · niveau à compléter`:'à compléter');
    const writingTxt=wa.level?`${wa.score20!==null?formatManualScore(wa)+' · ':''}${wa.level}`:(wa.score20!==null?`${formatManualScore(wa)} · niveau à compléter`:'à compléter');
    const txt=`Karine Cormier — Bilan final\nNiveau pédagogique estimé : ${r.level}\nVocabulaire : ${r.stats.vocabulary.raw}% (${r.stats.vocabulary.level})\nGrammaire : ${r.stats.grammar.raw}% (${r.stats.grammar.level})\nExpressions : ${r.stats.expressions.raw}% (${r.stats.expressions.level})\nCompréhension écrite : ${r.stats.reading.raw}% (${r.stats.reading.level})\nCompréhension orale : ${r.stats.listening.raw}% (${r.stats.listening.level})\nExpression orale : ${oralTxt}\nProduction écrite : ${writingTxt}\n\n${state.finalComments||''}`;
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
    const payload={candidate:'Karine Cormier',assessment:'Simulation pédagogique indépendante de type CLOE',date:new Date().toISOString(),priorOfficialResult:{date:'2026-08-27',overall:'A1',oralCriteria:'A1+',listening:'B1',writtenVocabulary:'A1+',writtenGrammar:'A1-',writtenExpressions:'A1-',reading:'A1'},computerTest:r.stats,manualGrades:state.manualGrades,oralAssessment:r.oralAssessment,oralRatings:state.oral.ratings,oralComments:state.oral.comments,writingAssessment:r.writingAssessment,writingAnswers:state.writing.answers,writingRatings:state.writing.ratings,writingComments:state.writing.comments,estimatedLevel:r.level,finalComments:state.finalComments,qualiopiStatus:state.finalStatus,qualiopiCompetencyStatuses:state.qualiopi?.statuses||{},disclaimer:'Private pedagogical assessment; not an official CLOE/CCI France certificate.'};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Karine_CLOE_style_bilan.json';a.click();URL.revokeObjectURL(a.href);
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
    on('downloadResultsBtn','click',downloadResults); on('copySummaryBtn','click',copySummary);
    on('printReportBtn','click',()=>{document.body.classList.add('print-results');window.print();setTimeout(()=>document.body.classList.remove('print-results'),300);});
    on('showCertificateBtn','click',()=>setView('certificate'));
    on('resetWrittenBtn','click',()=>resetSection('written')); on('resetOralBtn','click',()=>resetSection('oral')); on('resetWritingBtn','click',()=>resetSection('writing'));
    on('backResultsBtn','click',()=>setView('results')); on('printCertificateBtn','click',()=>window.print()); on('resetAllBtn','click',resetAll);

    document.addEventListener('keydown',e=>{if(!views.written.classList.contains('active'))return; if(['1','2','3','4'].includes(e.key)){const idx=Number(e.key)-1;if(currentQuestion()?.options[idx])selectOption(idx);} if(e.key==='Enter'&&!$('validateBtn').disabled)submitAnswer(false);});
    if(state.view==='written'&&state.written.started&&!state.written.finished){renderCurrentQuestion();startTotalTimer();startQuestionTimer();}
  }
  init();
})();
