(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const state = {
    accent: 'en-GB',
    voice: null,
    scores: { vocab: 0, grammar: 0, email: 0, speaking: 0 },
    answered: new Set(),
    timer: { seconds: 60, interval: null },
    currentSpeaking: 0
  };

  const warmups = [
    {
      title: 'Client follow-up',
      question: 'What do you say after a property viewing?',
      cues: ['thank you', 'follow up', 'questions'],
      model: 'Thank you for visiting the property today. I am following up to answer any questions and discuss the next step.'
    },
    {
      title: 'Confirming details',
      question: 'How can you confirm a price politely?',
      cues: ['let me confirm', '€625,000', 'correct'],
      model: 'Let me confirm the price: it is six hundred and twenty-five thousand euros, correct?'
    },
    {
      title: 'Arranging a viewing',
      question: 'How can you offer a visit?',
      cues: ['would you like', 'arrange', 'viewing'],
      model: 'Would you like to arrange a viewing next week? I can check the available time slots for you.'
    },
    {
      title: 'Listening first',
      question: 'How do you show your client approach?',
      cues: ['listen carefully', 'needs', 'advice'],
      model: 'I listen carefully to clients before speaking so that I can understand their needs and offer appropriate advice.'
    },
    {
      title: 'Asking for clarification',
      question: 'What can you say if you miss a number?',
      cues: ['could you repeat', 'number', 'please'],
      model: 'Could you repeat the phone number, please? I would like to make sure I have it correctly.'
    },
    {
      title: 'Sending documents',
      question: 'How do you say you will send property information?',
      cues: ['send', 'property details', 'email'],
      model: 'I will send you the property details by email, including the price, surface area and available viewing times.'
    }
  ];

  const vocab = [
    { term:'to follow up', fr:'faire un suivi / relancer', cat:'email', def:'To contact someone again after a meeting, call or email.', ex:'I am following up on your enquiry about the apartment.' },
    { term:'an enquiry', fr:'une demande de renseignements', cat:'email', def:'A request for information about a product, service or property.', ex:'Thank you for your enquiry about the two-bedroom flat.' },
    { term:'a subject line', fr:'un objet d’e-mail', cat:'email', def:'The title of an email that tells the reader what the message is about.', ex:'A clear subject line helps the client understand the purpose of the email.' },
    { term:'to attach', fr:'joindre', cat:'email', def:'To add a document or file to an email.', ex:'I have attached the property brochure to this email.' },
    { term:'please find attached', fr:'veuillez trouver ci-joint', cat:'email', def:'A formal phrase used when you include a document in an email.', ex:'Please find attached the property details and floor plan.' },
    { term:'available', fr:'disponible', cat:'email', def:'Free or possible at a certain time.', ex:'The apartment is still available for viewing next week.' },
    { term:'availability', fr:'disponibilités', cat:'email', def:'The times when someone or something is available.', ex:'Could you let me know your availability for a viewing?' },
    { term:'to arrange a viewing', fr:'organiser une visite', cat:'viewing', def:'To schedule a visit to see a property.', ex:'Would you like to arrange a viewing on Friday afternoon?' },
    { term:'a property viewing', fr:'une visite de bien', cat:'viewing', def:'A visit to a house, apartment or commercial property.', ex:'The property viewing will take about thirty minutes.' },
    { term:'a follow-up email', fr:'un e-mail de suivi', cat:'viewing', def:'An email sent after a visit, call or meeting.', ex:'I will send a follow-up email after the viewing.' },
    { term:'the next step', fr:'la prochaine étape', cat:'viewing', def:'What should happen after the current action.', ex:'The next step would be to make an offer.' },
    { term:'to make an offer', fr:'faire une offre', cat:'viewing', def:'To propose a price to buy or rent a property.', ex:'The client would like to make an offer below the asking price.' },
    { term:'the asking price', fr:'le prix demandé', cat:'figures', def:'The price requested by the seller.', ex:'The asking price is six hundred and twenty-five thousand euros.' },
    { term:'monthly rent', fr:'loyer mensuel', cat:'figures', def:'The amount paid every month to rent a property.', ex:'The monthly rent is two thousand five hundred euros.' },
    { term:'service charges', fr:'charges', cat:'figures', def:'Additional costs paid for building services or maintenance.', ex:'The service charges are included in the monthly rent.' },
    { term:'surface area', fr:'surface', cat:'figures', def:'The size of a property, usually in square metres.', ex:'The surface area is eighty-five square metres.' },
    { term:'square metres', fr:'mètres carrés', cat:'figures', def:'A unit used to describe area in real estate.', ex:'It is a bright 85-square-metre apartment.' },
    { term:'on the fourth floor', fr:'au quatrième étage', cat:'figures', def:'Used to describe the floor level of a property.', ex:'The flat is on the fourth floor with a lift.' },
    { term:'to advise', fr:'conseiller', cat:'client', def:'To give professional advice to someone.', ex:'I advise clients on legal and commercial aspects of real estate.' },
    { term:'advice', fr:'conseil / avis', cat:'client', def:'A recommendation or professional opinion. It is uncountable in English.', ex:'I give advice to clients before they make a decision.' },
    { term:'to guide', fr:'guider / accompagner', cat:'client', def:'To help someone through a process.', ex:'I guide clients throughout their real estate project.' },
    { term:'to support', fr:'accompagner / soutenir', cat:'client', def:'To help someone with information, practical support or reassurance.', ex:'I support clients from the first enquiry to the final decision.' },
    { term:'client expectations', fr:'attentes du client', cat:'client', def:'What the client hopes to receive or achieve.', ex:'I listen carefully to understand the client’s expectations.' },
    { term:'suitable', fr:'adapté / approprié', cat:'client', def:'Appropriate for a person, situation or need.', ex:'This property could be suitable for an investor.' },
    { term:'off-plan sale', fr:'vente sur plan / VEFA', cat:'technical', def:'A sale of a property before construction is completed.', ex:'A VEFA can often be explained as an off-plan sale.' },
    { term:'sale before completion', fr:'vente en état futur d’achèvement', cat:'technical', def:'A more explanatory phrase for a property sold before it is completed.', ex:'In simple English, we can call it a sale before completion.' },
    { term:'off-plan lease', fr:'bail en état futur d’achèvement / BEFA', cat:'technical', def:'A lease agreed before the building or premises are completed.', ex:'A BEFA can be described as an off-plan lease in a commercial context.' },
    { term:'pre-let agreement', fr:'accord de pré-location', cat:'technical', def:'A commercial lease agreed before the premises are ready.', ex:'The company signed a pre-let agreement for offices under construction.' },
    { term:'lease', fr:'bail / contrat de location', cat:'technical', def:'A legal contract for renting property, especially in professional contexts.', ex:'The lease will start when the premises are completed.' },
    { term:'rent', fr:'loyer / louer', cat:'technical', def:'The money paid to use a property, or the action of renting.', ex:'The rent is paid monthly by the tenant.' },
    { term:'premises', fr:'locaux', cat:'technical', def:'A building or part of a building used by a business.', ex:'The lease concerns commercial premises under construction.' },
    { term:'clear and concise', fr:'clair et concis', cat:'tone', def:'Easy to understand and not too long.', ex:'A professional email should be clear and concise.' },
    { term:'polite but direct', fr:'poli mais direct', cat:'tone', def:'Professional, respectful and easy to understand.', ex:'Your message can be polite but direct.' },
    { term:'I am writing to…', fr:'je vous écris pour…', cat:'tone', def:'A standard formal opening for an email.', ex:'I am writing to confirm our appointment.' },
    { term:'Could you please…?', fr:'pourriez-vous… ?', cat:'tone', def:'A polite request form.', ex:'Could you please confirm your availability?' },
    { term:'I look forward to hearing from you', fr:'dans l’attente de votre retour', cat:'tone', def:'A polite closing phrase in English emails.', ex:'I look forward to hearing from you.' }
  ];

  const vocabQuizBank = [
    { q:'“faire un suivi / relancer” in professional email English:', options:['to follow up','to follow after','to continue back'], answer:0 },
    { q:'Best phrase for “organiser une visite”: ', options:['to arrange a viewing','to make a visit','to do a property seeing'], answer:0 },
    { q:'Best professional term for “loyer mensuel”: ', options:['monthly rent','monthly rental money','each month price'], answer:0 },
    { q:'Best phrase for “accompagner les clients”: ', options:['guide and support clients','accompany clients every time','follow clients around'], answer:0 },
    { q:'Best phrase for “BEFA” in simple professional English:', options:['off-plan lease','off-plan rent','rentability lease'], answer:0 },
    { q:'Best closing phrase:', options:['I look forward to hearing from you.','I wait your answer.','I hope your comeback.'], answer:0 },
    { q:'Best phrase for “surface”: ', options:['surface area','surface size meters','area surface'], answer:0 },
    { q:'Best phrase for “pièces jointes”: ', options:['attachments','attached things','joined files'], answer:0 }
  ];

  const grammar = [
    {
      id:'email-purpose', title:'1. Opening an email: I am writing to…', badge:'Email structure',
      rule:'Use “I am writing to + verb” to explain the purpose of a professional email.',
      formula:'I am writing to + verb + complement.',
      examples:['I am writing to confirm our appointment.','I am writing to follow up on your enquiry.','I am writing to send you the property details.'],
      practice:{ type:'selects', key:'g1', items:[
        { before:'I am writing ___ our appointment.', answer:'to confirm', options:['for confirm','to confirm','confirming to'] },
        { before:'I am writing ___ on your enquiry.', answer:'to follow up', options:['to follow up','for follow','follow up to'] },
        { before:'I am writing ___ the floor plan.', answer:'to send you', options:['to send you','for send you','sending to you'] }
      ]}
    },
    {
      id:'polite-requests', title:'2. Polite requests: Could you please…?', badge:'Client-friendly English',
      rule:'Use polite questions when you ask for information, availability or confirmation.',
      formula:'Could you please + verb…? / Would it be possible to + verb…?',
      examples:['Could you please confirm your availability?','Could you please send me your phone number?','Would it be possible to arrange a viewing next week?'],
      practice:{ type:'order', key:'g2', answer:['Could','you','please','confirm','your','availability'], tip:'Polite request pattern: Could you please + verb…?' }
    },
    {
      id:'follow-up-on', title:'3. Follow up on / about / with', badge:'After a call or visit',
      rule:'Use “follow up on” for a specific previous action, file, visit, request or conversation. Use “follow up about” for a general topic or issue. Use “follow up with” when the object is a person.',
      formula:'follow up on + action/document · follow up about + topic · follow up with + person',
      examples:['I am writing to follow up on our property viewing yesterday.','I am writing to follow up about the rental conditions.','I will follow up with the client tomorrow.'],
      practice:{ type:'selects', key:'g3', items:[
        { before:'I am writing to follow up ___ our phone conversation.', answer:'on', options:['on','about','with'] },
        { before:'I wanted to follow up ___ the rental conditions.', answer:'about', options:['on','about','with'] },
        { before:'I will follow up ___ the client tomorrow.', answer:'with', options:['on','about','with'] }
      ]}
    },
    {
      id:'sale-rent-lease', title:'4. Sale, rent and lease', badge:'Real estate precision',
      rule:'A “sale” is when a property is sold. “Rent” is the money paid or the action of renting. A “lease” is the legal rental contract.',
      formula:'sale = vente · rent = loyer/louer · lease = bail/contrat',
      examples:['The asking price is €625,000.','The monthly rent is €2,500.','The commercial lease will start after completion.'],
      practice:{ type:'selects', key:'g4', items:[
        { before:'The monthly ___ is €2,500.', answer:'rent', options:['sale','rent','lease contract money'] },
        { before:'The ___ will start when the premises are completed.', answer:'lease', options:['lease','rentability','sale price'] },
        { before:'The asking price concerns the ___ of the property.', answer:'sale', options:['rent','sale','lease monthly'] }
      ]}
    },
    {
      id:'figures', title:'5. Figures in property descriptions', badge:'Numbers + clarity',
      rule:'Put the number before the unit or detail: 85 square metres, €625,000, on the fourth floor.',
      formula:'number + unit/detail',
      examples:['The flat is 85 square metres.','The price is €625,000.','It is on the fourth floor.'],
      practice:{ type:'mcq', key:'g5', question:'Choose the best sentence.', options:['The apartment is 85 square metres.','The apartment is square metres 85.','The apartment has 85 metres squared for realty.'], answer:0, tip:'For property descriptions, use “square metres”.' }
    },
    {
      id:'so-that', title:'6. So that + can', badge:'Explaining purpose',
      rule:'Use “so that + subject + can” to explain why you do something.',
      formula:'I listen carefully so that I can understand the client’s needs.',
      examples:['I ask questions so that I can recommend the right property.','I repeat the number so that I can avoid mistakes.','I take notes so that I can follow up clearly.'],
      practice:{ type:'selects', key:'g6', items:[
        { before:'I listen carefully ___ understand the client’s needs.', answer:'so that I can', options:['for to','so that I can','in the goal to'] },
        { before:'I repeat the address ___ avoid mistakes.', answer:'so that I can', options:['so that I can','because to','for'] },
        { before:'I send a follow-up email ___ the client has the details.', answer:'so that', options:['for','so that','to because'] }
      ]}
    },
    {
      id:'advice-advise', title:'7. Advice vs advise', badge:'Legal + client English',
      rule:'“Advice” is the noun. “Advise” is the verb. This distinction is very useful for your professional profile.',
      formula:'I give advice. / I advise clients.',
      examples:['I give legal advice to clients.','I advise clients on real estate matters.','I would like to advise clients in English.'],
      practice:{ type:'mcq', key:'g7', question:'Choose the correct sentence.', options:['I advise clients professionally.','I advice clients professionally.','I give advices to clients.'], answer:0, tip:'Use “advise” as the verb. “Advice” has no plural “s”.' }
    }
  ];

  const terms = [
    { title:'VEFA', label:'Sale before completion', fr:'vente en l’état futur d’achèvement', avoid:'Do not overuse a literal translation with every client.', simple:'off-plan sale / sale before completion', example:'The property is sold before completion, so we can describe it as an off-plan sale.' },
    { title:'BEFA', label:'Lease before completion', fr:'bail en l’état futur d’achèvement', avoid:'Avoid “off-plan rent” for the contract.', simple:'off-plan lease / lease in a future state of completion / pre-let agreement', example:'The company signs an off-plan lease before the commercial premises are completed.' },
    { title:'Rent', label:'Monthly payment', fr:'loyer / louer', avoid:'Rent is not the same as the lease contract.', simple:'rent = the money paid each month', example:'The monthly rent is €2,500, excluding service charges.' },
    { title:'Lease', label:'Legal contract', fr:'bail', avoid:'Do not use “rent” for the legal document.', simple:'lease = legal rental contract', example:'The lease starts when the premises are ready for occupation.' },
    { title:'Pre-let', label:'Commercial agreement before completion', fr:'pré-location / accord avant livraison', avoid:'Usually more commercial than residential.', simple:'pre-let agreement', example:'The tenant signed a pre-let agreement for offices under construction.' },
    { title:'Premises', label:'Business property', fr:'locaux', avoid:'Use “premises” mainly for business/commercial property.', simple:'commercial premises', example:'The premises will be delivered in the second quarter of next year.' }
  ];

  const termQuiz = [
    { q:'A VEFA can be explained simply as:', options:['an off-plan sale','an off-plan rent','a rentability contract'], answer:0 },
    { q:'A BEFA is better explained as:', options:['an off-plan lease','an off-plan rent','a monthly rent before sale'], answer:0 },
    { q:'For “bail”, the professional English noun is:', options:['lease','rentability','tenanting'], answer:0 },
    { q:'For “loyer”, use:', options:['rent','lease','sale'], answer:0 }
  ];

  const emailScenarios = [
    {
      title:'After a property viewing',
      context:'You visited an apartment with a client. Send a follow-up email with the main details and the next step.',
      subject:'Follow-up after today’s property viewing',
      parts:[
        { label:'Greeting', answer:'Dear Mr Smith,' },
        { label:'Purpose', answer:'I am writing to follow up on today’s property viewing.' },
        { label:'Details', answer:'As discussed, the apartment is 85 square metres, located close to the metro, and the asking price is €625,000.' },
        { label:'Next step', answer:'Please let me know if you would like to arrange a second viewing or make an offer.' },
        { label:'Closing', answer:'I look forward to hearing from you. Kind regards, Isabelle Davion' }
      ],
      model:'Subject: Follow-up after today’s property viewing\n\nDear Mr Smith,\n\nI am writing to follow up on today’s property viewing. As discussed, the apartment is 85 square metres, located close to the metro, and the asking price is €625,000.\n\nPlease let me know if you would like to arrange a second viewing or make an offer. I would be happy to answer any further questions.\n\nKind regards,\nIsabelle Davion',
      speaking:'Thank you for visiting the apartment today. It is 85 square metres, close to the metro, and the asking price is €625,000. Would you like to arrange a second viewing?'
    },
    {
      title:'Confirm a viewing appointment',
      context:'A client wants to visit a property. Confirm the appointment politely.',
      subject:'Confirmation of your property viewing',
      parts:[
        { label:'Greeting', answer:'Dear Ms Brown,' },
        { label:'Purpose', answer:'I am writing to confirm your property viewing.' },
        { label:'Details', answer:'The viewing is scheduled for Tuesday 21 May at 3 p.m. at 24 Canal Street, Amsterdam.' },
        { label:'Request', answer:'Could you please confirm that this time is still convenient for you?' },
        { label:'Closing', answer:'I look forward to meeting you. Kind regards, Isabelle Davion' }
      ],
      model:'Subject: Confirmation of your property viewing\n\nDear Ms Brown,\n\nI am writing to confirm your property viewing. The viewing is scheduled for Tuesday 21 May at 3 p.m. at 24 Canal Street, Amsterdam.\n\nCould you please confirm that this time is still convenient for you?\n\nI look forward to meeting you.\n\nKind regards,\nIsabelle Davion',
      speaking:'I am calling to confirm your property viewing on Tuesday 21 May at 3 p.m. Could you please confirm that this time is still convenient for you?'
    },
    {
      title:'Send property details',
      context:'A client asked for more information about a commercial property.',
      subject:'Property details and floor plan',
      parts:[
        { label:'Greeting', answer:'Dear Mr Johnson,' },
        { label:'Purpose', answer:'I am writing to send you the property details you requested.' },
        { label:'Attachment', answer:'Please find attached the brochure, the floor plan and the main financial information.' },
        { label:'Next step', answer:'I would be happy to arrange a call to discuss the property in more detail.' },
        { label:'Closing', answer:'I look forward to hearing from you. Kind regards, Isabelle Davion' }
      ],
      model:'Subject: Property details and floor plan\n\nDear Mr Johnson,\n\nI am writing to send you the property details you requested. Please find attached the brochure, the floor plan and the main financial information.\n\nI would be happy to arrange a call to discuss the property in more detail and answer any questions you may have.\n\nI look forward to hearing from you.\n\nKind regards,\nIsabelle Davion',
      speaking:'I have sent you the property details by email, including the brochure, floor plan and financial information. Would you like to arrange a call to discuss it?'
    },
    {
      title:'Contact a real estate agency',
      context:'You contact an agency in Amsterdam to introduce your profile and ask about opportunities.',
      subject:'Real estate legal and commercial profile',
      parts:[
        { label:'Greeting', answer:'Dear Sir or Madam,' },
        { label:'Introduction', answer:'I am a real estate legal and commercial professional with 24 years of experience in France.' },
        { label:'Purpose', answer:'I am writing to ask whether your agency is open to international profiles.' },
        { label:'Request', answer:'May I send you my CV and arrange a short call to introduce myself?' },
        { label:'Closing', answer:'Thank you for your time. Kind regards, Isabelle Davion' }
      ],
      model:'Subject: Real estate legal and commercial profile\n\nDear Sir or Madam,\n\nI am a real estate legal and commercial professional with 24 years of experience in France. I combine legal expertise with commercial experience, and I am planning to move to Amsterdam.\n\nI am writing to ask whether your agency is open to international profiles. May I send you my CV and arrange a short call to introduce myself?\n\nThank you for your time. I look forward to hearing from you.\n\nKind regards,\nIsabelle Davion',
      speaking:'Good morning, my name is Isabelle Davion. I have 24 years of experience in real estate in France. May I send you my CV and arrange a short call?'
    },
    {
      title:'Explain an off-plan lease simply',
      context:'A client asks what an off-plan lease means for commercial premises.',
      subject:'Explanation of the off-plan lease',
      parts:[
        { label:'Greeting', answer:'Dear Mr Parker,' },
        { label:'Purpose', answer:'I am writing to clarify the meaning of an off-plan lease.' },
        { label:'Explanation', answer:'It is a lease signed before the premises are completed, usually for a commercial property under construction.' },
        { label:'Client-friendly detail', answer:'The lease generally starts when the premises are completed and ready for occupation.' },
        { label:'Closing', answer:'Please let me know if you would like to discuss this point in more detail.' }
      ],
      model:'Subject: Explanation of the off-plan lease\n\nDear Mr Parker,\n\nI am writing to clarify the meaning of an off-plan lease. It is a lease signed before the premises are completed, usually for a commercial property under construction.\n\nThe lease generally starts when the premises are completed and ready for occupation. I would be happy to discuss the main points with you in more detail.\n\nKind regards,\nIsabelle Davion',
      speaking:'An off-plan lease is a lease signed before the premises are completed. It is often used for commercial property under construction.'
    }
  ];

  const upgrades = [
    { before:'I send you the informations.', after:'I am sending you the information you requested.' },
    { before:'Can you give me your availabilities?', after:'Could you please let me know your availability?' },
    { before:'I wait your answer.', after:'I look forward to hearing from you.' },
    { before:'I want to make a follow.', after:'I am writing to follow up on our call.' },
    { before:'The rent is 2,500 euros by month.', after:'The monthly rent is €2,500.' },
    { before:'Can I propose you a visit?', after:'Would you like to arrange a viewing?' }
  ];

  const speakingScenarios = [
    {
      title:'Client call · Confirm a viewing',
      role:'You are the real estate professional. The client wants to confirm the appointment.',
      cues:['confirm appointment','Tuesday at 3 p.m.','address','ask for confirmation'],
      support:['I am calling to confirm your property viewing.','The appointment is scheduled for Tuesday at 3 p.m.','Could you please confirm that this time is still convenient for you?','Let me repeat the address for you.']
    },
    {
      title:'Client call · The client asks about price',
      role:'The client asks about the price, charges and negotiation.',
      cues:['asking price','service charges','room for negotiation','next step'],
      support:['The asking price is €625,000.','The service charges are included / not included.','There may be some room for negotiation.','The next step would be to make an offer.']
    },
    {
      title:'Client call · Explain an off-plan sale',
      role:'The client asks what an off-plan sale means.',
      cues:['property not completed','sold before completion','plans','delivery date'],
      support:['An off-plan sale means the property is sold before it is completed.','The client usually buys based on plans and technical documents.','It is important to check the delivery date and guarantees.']
    },
    {
      title:'Client call · Explain an off-plan lease',
      role:'A professional client asks about a lease for premises under construction.',
      cues:['lease before completion','commercial premises','start date','ready for occupation'],
      support:['An off-plan lease is a lease signed before the premises are completed.','It is often used for commercial premises under construction.','The lease generally starts when the premises are ready for occupation.']
    },
    {
      title:'Agency call · Ask about opportunities',
      role:'You call an agency in Amsterdam to introduce your profile.',
      cues:['24 years','legal + commercial','moving to Amsterdam','CV'],
      support:['My name is Isabelle Davion.','I have 24 years of experience in real estate.','I combine legal expertise with commercial experience.','May I send you my CV?']
    },
    {
      title:'CLOE roleplay · Follow-up after an email',
      role:'The examiner plays a client who has received your email but wants more information.',
      cues:['thank client','clarify details','offer call','arrange next step'],
      support:['Thank you for your reply.','I would be happy to clarify the details.','Would you like to arrange a call?','The next step would be…']
    }
  ];

  function sample(array, count) {
    return [...array].sort(() => Math.random() - 0.5).slice(0, count);
  }

  function score(area, key, points = 1) {
    if (state.answered.has(key)) return;
    state.answered.add(key);
    state.scores[area] += points;
    updateScores();
  }

  function totalPossible() {
    return vocabQuizBank.length + grammar.length + termQuiz.length + emailScenarios.length + 6;
  }

  function updateScores() {
    $('#vocabScore').textContent = state.scores.vocab;
    $('#grammarScore').textContent = state.scores.grammar;
    $('#emailScore').textContent = state.scores.email;
    $('#speakingScore').textContent = state.scores.speaking;
    const total = Object.values(state.scores).reduce((a,b) => a + b, 0);
    $('#totalScore').textContent = total;
    $('#totalPossible').textContent = totalPossible();
    $('#progressFill').style.width = `${Math.min(100, Math.round(total / totalPossible() * 100))}%`;
  }

  function pickVoice() {
    const voices = speechSynthesis.getVoices();
    const langVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(state.accent.toLowerCase()));
    state.voice = langVoices.find(v => /Google|Microsoft|Samantha|Daniel|Karen|Moira|Arthur|Libby|Jenny|Aria/i.test(v.name)) || langVoices[0] || voices.find(v => v.lang && v.lang.startsWith('en')) || null;
    const label = state.voice ? `${state.voice.name} (${state.voice.lang})` : 'Default English voice';
    $('#voiceStatus').textContent = `Selected: ${label}`;
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const clean = (text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return;
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = state.accent;
    if (state.voice) u.voice = state.voice;
    u.rate = 0.92;
    speechSynthesis.speak(u);
  }

  function renderWarmups() {
    $('#warmupGrid').innerHTML = warmups.map((w, i) => `
      <article class="cue-card">
        <h3>${w.title}</h3>
        <p><strong>${w.question}</strong></p>
        <div class="pill-row">${w.cues.map(c => `<span class="pill">${c}</span>`).join('')}</div>
        <details>
          <summary>Reveal model</summary>
          <p id="warmModel${i}" class="model-box">${w.model}</p>
          <div class="btn-row wrap"><button class="primary-btn" type="button" data-speak-target="warmModel${i}">Listen</button></div>
        </details>
      </article>
    `).join('');
  }

  function renderVocab() {
    const cat = $('#vocabCategory').value;
    const search = $('#vocabSearch').value.trim().toLowerCase();
    const filtered = vocab.filter(v => (cat === 'all' || v.cat === cat) && [v.term, v.fr, v.def, v.ex].join(' ').toLowerCase().includes(search));
    $('#vocabGrid').innerHTML = filtered.map((v, i) => `
      <article class="vocab-card">
        <span class="category">${categoryLabel(v.cat)}</span>
        <h3>${v.term}</h3>
        <dl>
          <dt>FR</dt><dd>${v.fr}</dd>
          <dt>Definition</dt><dd>${v.def}</dd>
        </dl>
        <p class="example" id="vocabEx${i}">${v.ex}</p>
        <button class="secondary-btn" type="button" data-speak-target="vocabEx${i}">Listen</button>
      </article>
    `).join('') || '<p>No vocabulary found. Try another search.</p>';
  }

  function categoryLabel(cat) {
    const labels = { email:'Email', client:'Client', viewing:'Viewing', technical:'Technical', figures:'Numbers', tone:'Tone' };
    return labels[cat] || cat;
  }

  function renderVocabQuiz() {
    const items = sample(vocabQuizBank, 4);
    $('#vocabQuiz').innerHTML = items.map((item, idx) => `
      <div class="quiz-item" data-answer="${item.answer}" data-key="vq-${idx}-${item.q.slice(0,8)}">
        <strong>${item.q}</strong>
        <div class="option-grid">
          ${item.options.map((op, oi) => `<button type="button" data-idx="${oi}">${op}</button>`).join('')}
        </div>
      </div>
    `).join('');
    $('#vocabFeedback').textContent = '';
  }

  function renderGrammar() {
    const select = $('#grammarSelect');
    if (select.options.length === 1) {
      grammar.forEach(g => select.insertAdjacentHTML('beforeend', `<option value="${g.id}">${g.title}</option>`));
    }
    const focus = select.value;
    const list = grammar.filter(g => focus === 'all' || g.id === focus);
    $('#grammarGrid').innerHTML = list.map(g => grammarCard(g)).join('');
  }

  function grammarCard(g) {
    return `
      <article class="grammar-card" id="${g.id}">
        <div class="grammar-top">
          <div><h3>${g.title}</h3><p>${g.rule}</p></div>
          <span class="badge">${g.badge}</span>
        </div>
        <p class="formula">${g.formula}</p>
        <ul class="examples">${g.examples.map(ex => `<li>${ex}</li>`).join('')}</ul>
        ${practiceHtml(g.practice)}
      </article>
    `;
  }

  function practiceHtml(p) {
    if (p.type === 'mcq') {
      return `<div class="inline-practice" data-practice="mcq" data-key="${p.key}" data-answer="${p.answer}" data-tip="${p.tip || ''}">
        <strong>Mini-practice</strong><p>${p.question}</p>
        <div class="option-grid">${p.options.map((op, i) => `<button type="button" data-idx="${i}">${op}</button>`).join('')}</div>
        <div class="feedback"></div>
      </div>`;
    }
    if (p.type === 'selects') {
      return `<div class="inline-practice" data-practice="selects" data-key="${p.key}">
        <strong>Mini-practice</strong>
        ${p.items.map((it, i) => `<p>${it.before.replace('___', `<select data-answer="${it.answer}"><option value="">Choose…</option>${it.options.map(op => `<option value="${op}">${op}</option>`).join('')}</select>`)}</p>`).join('')}
        <button class="secondary-btn" type="button" data-check-selects>Check</button>
        <div class="feedback"></div>
      </div>`;
    }
    if (p.type === 'order') {
      const shuffled = sample(p.answer, p.answer.length);
      return `<div class="inline-practice" data-practice="order" data-key="${p.key}" data-answer="${p.answer.join(' ')}" data-tip="${p.tip}">
        <strong>Mini-practice</strong><p>Put the words in order.</p>
        <div class="word-bank">${shuffled.map(w => `<button type="button" class="word-chip">${w}</button>`).join('')}</div>
        <p><strong>Your sentence:</strong> <span class="sentence-output"></span></p>
        <button class="secondary-btn" type="button" data-reset-order>Reset</button>
        <div class="feedback"></div>
      </div>`;
    }
    return '';
  }

  function renderTerms() {
    $('#termGrid').innerHTML = terms.map((t, i) => `
      <article class="term-card">
        <span class="category">${t.label}</span>
        <h3>${t.title}</h3>
        <p><strong>FR:</strong> ${t.fr}</p>
        <p><strong>Use:</strong> ${t.simple}</p>
        <p class="avoid">Careful: ${t.avoid}</p>
        <p class="example" id="termEx${i}">${t.example}</p>
        <button class="secondary-btn" type="button" data-speak-target="termEx${i}">Listen</button>
      </article>
    `).join('');

    $('#termQuiz').innerHTML = termQuiz.map((item, idx) => `
      <div class="quiz-item" data-answer="${item.answer}" data-key="tq-${idx}">
        <strong>${item.q}</strong>
        <div class="option-grid">${item.options.map((op, oi) => `<button type="button" data-idx="${oi}">${op}</button>`).join('')}</div>
      </div>
    `).join('');
  }

  function renderEmails() {
    const select = $('#emailScenario');
    select.innerHTML = emailScenarios.map((s, i) => `<option value="${i}">${s.title}</option>`).join('');
    updateEmailScenario();
  }

  function updateEmailScenario() {
    const scenario = emailScenarios[Number($('#emailScenario').value) || 0];
    $('#emailTask').innerHTML = `<p><strong>Context:</strong> ${scenario.context}</p><p><strong>Subject:</strong> ${scenario.subject}</p>`;
    $('#emailBuilder').innerHTML = scenario.parts.map((p, i) => `
      <div class="builder-row">
        <label>${p.label}</label>
        <select data-answer="${p.answer}">
          <option value="">Choose the best phrase…</option>
          ${sample([...scenario.parts.map(x => x.answer), 'I wait your answer.', 'Can you give me informations?', 'I make a follow of the visit.'], scenario.parts.length + 3).map(op => `<option value="${op}">${op}</option>`).join('')}
        </select>
      </div>
    `).join('');
    $('#emailModel').textContent = 'Try the structure first. Then click “Reveal model”.';
    $('#emailModel').classList.add('muted');
    $('#emailBuilderFeedback').textContent = '';
    $('#emailBuilderFeedback').className = 'feedback';
  }

  function renderUpgrades() {
    $('#upgradeGrid').innerHTML = upgrades.map((u, i) => `
      <article class="upgrade-card">
        <strong>Upgrade ${i + 1}</strong>
        <div class="before"><small>Good idea, less natural:</small><br>${u.before}</div>
        <div class="after"><small>More professional:</small><br><span id="upgradeAfter${i}">${u.after}</span></div>
        <div class="btn-row wrap">
          <button class="secondary-btn" type="button" data-reveal-upgrade>Reveal upgrade</button>
          <button class="primary-btn" type="button" data-speak-target="upgradeAfter${i}">Listen</button>
        </div>
      </article>
    `).join('');
  }

  function renderSpeaking() {
    state.currentSpeaking = Math.floor(Math.random() * speakingScenarios.length);
    updateSpeakingCard();
  }

  function updateSpeakingCard() {
    const s = speakingScenarios[state.currentSpeaking];
    $('#speakingCard').innerHTML = `
      <h3>${s.title}</h3>
      <p>${s.role}</p>
      <div class="pill-row">${s.cues.map(c => `<span class="pill">${c}</span>`).join('')}</div>
    `;
    $('#speakingSupport').classList.add('hidden');
    $('#speakingSupport').innerHTML = `<strong>Support phrases</strong><ul>${s.support.map(x => `<li>${x}</li>`).join('')}</ul>`;
  }

  function checkQuizItem(item, btn, area) {
    if (item.dataset.done === 'true') return;
    const answer = Number(item.dataset.answer);
    const idx = Number(btn.dataset.idx);
    const buttons = $$('button[data-idx]', item);
    buttons.forEach(b => b.disabled = true);
    buttons[answer].classList.add('correct');
    if (idx !== answer) btn.classList.add('wrong');
    item.dataset.done = 'true';
    if (idx === answer) score(area, item.dataset.key || Math.random().toString(36));
  }

  function bindEvents() {
    $$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => $(btn.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));
    $$('.segmented button').forEach(btn => btn.addEventListener('click', () => {
      $$('.segmented button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.accent = btn.dataset.accent;
      pickVoice();
    }));

    document.addEventListener('click', e => {
      const speakBtn = e.target.closest('[data-speak-target]');
      if (speakBtn) {
        const target = $('#' + speakBtn.dataset.speakTarget);
        speak(target?.textContent || '');
      }
      const copyBtn = e.target.closest('[data-copy-target]');
      if (copyBtn) {
        const target = $('#' + copyBtn.dataset.copyTarget);
        navigator.clipboard?.writeText(target?.textContent || '');
        copyBtn.textContent = 'Copied ✓';
        setTimeout(() => copyBtn.textContent = 'Copy model', 1200);
      }
      const quizBtn = e.target.closest('.quiz-item .option-grid button');
      if (quizBtn) {
        const item = quizBtn.closest('.quiz-item');
        const parent = item.closest('#vocabQuiz') ? 'vocab' : item.closest('#termQuiz') ? 'vocab' : 'grammar';
        checkQuizItem(item, quizBtn, parent);
        const fb = parent === 'vocab' ? (item.closest('#termQuiz') ? $('#termFeedback') : $('#vocabFeedback')) : null;
        if (fb) { fb.textContent = Number(quizBtn.dataset.idx) === Number(item.dataset.answer) ? 'Great choice!' : 'Look at the green answer and try to repeat it aloud.'; fb.className = 'feedback neutral'; }
      }
      const mcqBtn = e.target.closest('.inline-practice[data-practice="mcq"] .option-grid button');
      if (mcqBtn) {
        const box = mcqBtn.closest('.inline-practice');
        if (box.dataset.done === 'true') return;
        const answer = Number(box.dataset.answer);
        const idx = Number(mcqBtn.dataset.idx);
        const buttons = $$('button[data-idx]', box);
        buttons.forEach(b => b.disabled = true);
        buttons[answer].classList.add('correct');
        if (idx !== answer) mcqBtn.classList.add('wrong');
        $('.feedback', box).textContent = idx === answer ? 'Correct. Try saying the sentence aloud.' : box.dataset.tip || 'Review the pattern above.';
        $('.feedback', box).className = idx === answer ? 'feedback good' : 'feedback bad';
        box.dataset.done = 'true';
        if (idx === answer) score('grammar', box.dataset.key);
      }
      const checkSelects = e.target.closest('[data-check-selects]');
      if (checkSelects) {
        const box = checkSelects.closest('.inline-practice');
        const selects = $$('select[data-answer]', box);
        const correct = selects.filter(s => s.value === s.dataset.answer).length;
        selects.forEach(s => { s.style.borderColor = s.value === s.dataset.answer ? '#107c41' : '#b42318'; });
        $('.feedback', box).textContent = `${correct}/${selects.length} correct.`;
        $('.feedback', box).className = correct === selects.length ? 'feedback good' : 'feedback bad';
        if (correct === selects.length) score('grammar', box.dataset.key);
      }
      const chip = e.target.closest('.inline-practice[data-practice="order"] .word-chip');
      if (chip) {
        const box = chip.closest('.inline-practice');
        const output = $('.sentence-output', box);
        output.textContent = `${output.textContent} ${chip.textContent}`.trim();
        chip.disabled = true;
        const done = output.textContent === box.dataset.answer;
        if (done) { $('.feedback', box).textContent = 'Perfect sentence!'; $('.feedback', box).className = 'feedback good'; score('grammar', box.dataset.key); }
        else if ($$('.word-chip:not(:disabled)', box).length === 0) { $('.feedback', box).textContent = box.dataset.tip; $('.feedback', box).className = 'feedback bad'; }
      }
      const resetOrder = e.target.closest('[data-reset-order]');
      if (resetOrder) {
        const box = resetOrder.closest('.inline-practice');
        $('.sentence-output', box).textContent = '';
        $$('.word-chip', box).forEach(c => c.disabled = false);
        $('.feedback', box).textContent = '';
      }
      const revealUp = e.target.closest('[data-reveal-upgrade]');
      if (revealUp) {
        const card = revealUp.closest('.upgrade-card');
        card.classList.add('revealed');
        revealUp.textContent = 'Revealed ✓';
      }
    });

    $('#vocabCategory').addEventListener('change', renderVocab);
    $('#vocabSearch').addEventListener('input', renderVocab);
    $('#newVocabQuiz').addEventListener('click', renderVocabQuiz);
    $('#grammarSelect').addEventListener('change', renderGrammar);
    $('#emailScenario').addEventListener('change', updateEmailScenario);

    $('#checkEmailBuilder').addEventListener('click', () => {
      const selects = $$('#emailBuilder select[data-answer]');
      const correct = selects.filter(s => s.value === s.dataset.answer).length;
      selects.forEach(s => { s.style.borderColor = s.value === s.dataset.answer ? '#107c41' : '#b42318'; });
      const fb = $('#emailBuilderFeedback');
      fb.textContent = `${correct}/${selects.length} sections are in place.`;
      fb.className = correct === selects.length ? 'feedback good' : 'feedback bad';
      if (correct === selects.length) score('email', `email-${$('#emailScenario').value}`);
    });

    $('#revealEmailModel').addEventListener('click', () => {
      const scenario = emailScenarios[Number($('#emailScenario').value) || 0];
      $('#emailModel').textContent = scenario.model;
      $('#emailModel').classList.remove('muted');
      score('email', `email-reveal-${$('#emailScenario').value}`, 1);
    });

    $('#newSpeakingScenario').addEventListener('click', () => {
      state.currentSpeaking = (state.currentSpeaking + 1 + Math.floor(Math.random() * (speakingScenarios.length - 1))) % speakingScenarios.length;
      updateSpeakingCard();
    });
    $('#revealSpeakingSupport').addEventListener('click', () => $('#speakingSupport').classList.toggle('hidden'));
    $('#speakingDone').addEventListener('click', () => score('speaking', `speak-${state.currentSpeaking}-${Date.now()}`, 1));

    $('#startTimer').addEventListener('click', startTimer);
    $('#pauseTimer').addEventListener('click', pauseTimer);
    $('#resetTimer').addEventListener('click', resetTimer);

    $('#resetAll').addEventListener('click', () => {
      state.scores = { vocab: 0, grammar: 0, email: 0, speaking: 0 };
      state.answered.clear();
      updateScores();
      renderVocabQuiz();
      renderGrammar();
      renderTerms();
      updateEmailScenario();
    });
  }

  function startTimer() {
    if (state.timer.interval) return;
    state.timer.interval = setInterval(() => {
      state.timer.seconds = Math.max(0, state.timer.seconds - 1);
      updateTimerDisplay();
      if (state.timer.seconds === 0) pauseTimer();
    }, 1000);
  }
  function pauseTimer() {
    clearInterval(state.timer.interval);
    state.timer.interval = null;
  }
  function resetTimer() {
    pauseTimer();
    state.timer.seconds = 60;
    updateTimerDisplay();
  }
  function updateTimerDisplay() {
    const m = String(Math.floor(state.timer.seconds / 60)).padStart(2, '0');
    const s = String(state.timer.seconds % 60).padStart(2, '0');
    $('#timerDisplay').textContent = `${m}:${s}`;
  }

  function init() {
    renderWarmups();
    renderVocab();
    renderVocabQuiz();
    renderGrammar();
    renderTerms();
    renderEmails();
    renderUpgrades();
    renderSpeaking();
    bindEvents();
    updateScores();
    updateTimerDisplay();
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = pickVoice;
      pickVoice();
      setTimeout(pickVoice, 500);
    } else {
      $('#voiceStatus').textContent = 'Speech synthesis is not supported in this browser.';
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
