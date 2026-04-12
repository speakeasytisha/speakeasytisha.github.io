(function () {
  'use strict';

  const state = {
    score: 0,
    maxScore: 0,
    accent: 'us',
    ipadMode: true,
    scenarioKey: 'hotel-booking',
    timerSeconds: 900,
    timerDefault: 900,
    timerRunning: false,
    timerId: null,
    selectedPhrase: '',
    selectedUpgrade: '',
    awards: {}
  };

  const connectors = [
    'To begin with,', 'First of all,', 'At the moment,', 'For this reason,', 'In addition,', 'Moreover,',
    'However,', 'As a result,', 'Could you please...?', 'I would appreciate it if...', 'Thank you in advance for your help.', 'Best regards,'
  ];

  const transitions = [
    'First of all,', 'Then,', 'After that,', 'As a result,', 'For this reason,', 'However,', 'In addition,', 'Overall,'
  ];

  const writingVerbs = [
    { icon: '✉️', base: 'ask', past: 'asked', participle: 'asked', use: 'make a request or ask for information' },
    { icon: '📘', base: 'book', past: 'booked', participle: 'booked', use: 'reserve a room, ticket, or service' },
    { icon: '✅', base: 'confirm', past: 'confirmed', participle: 'confirmed', use: 'check or validate a detail' },
    { icon: '📣', base: 'inform', past: 'informed', participle: 'informed', use: 'give information clearly' },
    { icon: '🧾', base: 'explain', past: 'explained', participle: 'explained', use: 'describe a situation or problem' },
    { icon: '🙏', base: 'apologize', past: 'apologized', participle: 'apologized', use: 'say sorry politely' },
    { icon: '📦', base: 'receive', past: 'received', participle: 'received', use: 'talk about what arrived or was obtained' },
    { icon: '🛠️', base: 'solve', past: 'solved', participle: 'solved', use: 'describe a solution to a problem' },
    { icon: '🌟', base: 'recommend', past: 'recommended', participle: 'recommended', use: 'give advice or a suggestion' },
    { icon: '⚖️', base: 'compare', past: 'compared', participle: 'compared', use: 'contrast two options in an opinion task' }
  ];

  const correctionItems = [
    {
      wrong: 'I would like information about your hotel',
      right: 'I would like some information about your hotel',
      why: 'Information is usually uncountable, so some information sounds more natural.'
    },
    {
      wrong: 'I make a reservation',
      right: 'I make a booking / I book a room',
      why: 'Book a room or make a booking are the natural collocations.'
    },
    {
      wrong: 'I am agree with this solution',
      right: 'I agree with this solution',
      why: 'Agree is a verb, not an adjective.'
    },
    {
      wrong: 'There was a damage on the machine',
      right: 'There was damage to the machine / There was a problem with the machine',
      why: 'Damage is usually uncountable.'
    },
    {
      wrong: 'Could you to confirm the price?',
      right: 'Could you confirm the price?',
      why: 'After could, use the base verb.'
    },
    {
      wrong: 'I write to you for ask details',
      right: 'I’m writing to ask for details',
      why: 'Use be + writing to + verb, and ask for details.'
    }
  ];

  const tenseQuizItems = [
    {
      stem: 'Choose the best tense: “I ___ to ask whether a double room is available next Friday.”',
      options: ['am writing', 'wrote', 'have write'],
      answer: 0,
      hint: 'In a professional email, “I am writing to...” is a safe opener.'
    },
    {
      stem: 'Choose the best tense: “Yesterday, the machine ___ after the second customer.”',
      options: ['breaks down', 'broke down', 'has broken down'],
      answer: 1,
      hint: 'Use past simple for a finished event yesterday.'
    },
    {
      stem: 'Choose the best tense: “We ___ the problem yet, so we still need support.”',
      options: ['did not solve', 'have not solved', 'are not solving'],
      answer: 1,
      hint: 'Use present perfect for a past action with a present result.'
    },
    {
      stem: 'Choose the best form: “Could you please ___ me know if breakfast is included?”',
      options: ['to let', 'let', 'letting'],
      answer: 1,
      hint: 'After could you please, use the base verb.'
    },
    {
      stem: 'Choose the best phrase: “This option is ___ than the first one because it is cheaper and closer.”',
      options: ['practical', 'more practical', 'the most practical'],
      answer: 1,
      hint: 'You are comparing two options.'
    }
  ];

  const verbQuizBank = [
    {
      stem: 'Choose the correct past simple / preterite form: “Yesterday, I ___ the hotel to confirm my booking.”',
      options: ['call', 'called', 'calling'],
      answer: 1,
      hint: 'Use the past simple for a finished action yesterday.'
    },
    {
      stem: 'Choose the best form: “I have already ___ the confirmation email.”',
      options: ['receive', 'received', 'receiving'],
      answer: 1,
      hint: 'After have, use the past participle.'
    },
    {
      stem: 'Choose the correct form after could: “Could you please ___ whether breakfast is included?”',
      options: ['confirm', 'confirmed', 'confirming'],
      answer: 0,
      hint: 'After could, use the base verb.'
    },
    {
      stem: 'Choose the best verb: “In this email, I would like to ___ the situation clearly.”',
      options: ['explain', 'explained', 'explaining'],
      answer: 0,
      hint: 'After would like to, use the base verb.'
    },
    {
      stem: 'Choose the correct verb for advice: “I would definitely ___ this option to a colleague.”',
      options: ['recommend', 'recommended', 'recommending'],
      answer: 0,
      hint: 'After would, use the base verb.'
    },
    {
      stem: 'Choose the correct participle: “The issue has not been ___ yet.”',
      options: ['solve', 'solved', 'solving'],
      answer: 1,
      hint: 'Use the past participle after has been.'
    }
  ];

  const rewriteQuizBank = [
    {
      stem: 'Choose the strongest opener:',
      options: [
        'Hello, I want information.',
        'I’m writing to ask for some information about your services.',
        'Please give me information quickly.'
      ],
      answer: 1,
      hint: 'Look for a polite and professional opener.'
    },
    {
      stem: 'Which sentence sounds most natural?',
      options: [
        'Could you please confirm if parking is available?',
        'Can you say me if parking is available?',
        'Please confirm me parking.'
      ],
      answer: 0,
      hint: 'Confirm if / let me know if are good professional patterns.'
    },
    {
      stem: 'Choose the best complaint sentence:',
      options: [
        'I had a bad surprise and I am not happy.',
        'Unfortunately, the room was much noisier than expected.',
        'The hotel was not good and it was bad.'
      ],
      answer: 1,
      hint: 'Precise vocabulary scores better than very basic adjectives.'
    },
    {
      stem: 'Choose the best closing sentence:',
      options: [
        'Answer me soon.',
        'Thank you in advance for your help. I look forward to your reply.',
        'I wait your answer.'
      ],
      answer: 1,
      hint: 'A polite closing is better than a direct command.'
    },
    {
      stem: 'Which request is more professional?',
      options: [
        'I want another date.',
        'Would it be possible to reschedule the meeting for next Tuesday?',
        'Change the date, please.'
      ],
      answer: 1,
      hint: 'Would it be possible to... is a safe upgrade.'
    },
    {
      stem: 'Choose the better opinion sentence:',
      options: [
        'In my opinion, online meetings are often more convenient for short updates.',
        'I think online meetings are good because yes.',
        'Online meetings are more better.'
      ],
      answer: 0,
      hint: 'Choose the option with clear logic and correct comparative form.'
    }
  ];

  const scenarios = {
    'hotel-booking': {
      category: 'Travel / service',
      title: 'Hotel reservation request',
      task: 'Write a professional email to ask about availability, price, breakfast, and parking for a short stay.',
      target: 'Professional email',
      audience: 'Reservation team',
      purpose: 'Ask for information and make a polite request',
      details: '2-night stay, quiet room if possible',
      purposeOptions: ['Request information', 'Booking request', 'Availability check', 'Price confirmation'],
      topicOptions: ['room reservation', 'double room', 'weekend stay', 'hotel facilities'],
      detailOptions: ['May 4–6', 'breakfast included', 'parking available', 'quiet room'],
      phrases: [
        'I’m writing to ask about...',
        'Could you please confirm whether...?',
        'If possible, I would also like...',
        'I would appreciate it if you could...',
        'Thank you in advance for your help.',
        'I look forward to your reply.'
      ],
      upgrades: [
        'availability', 'including taxes', 'quiet room', 'confirm the total price', 'suitable for our stay', 'convenient location'
      ],
      vocabulary: [
        { icon: '🏨', en: 'double room', fr: 'chambre double', ex: 'I would like to book a double room.' },
        { icon: '📅', en: 'availability', fr: 'disponibilité', ex: 'Could you confirm your availability for these dates?' },
        { icon: '💶', en: 'including taxes', fr: 'taxes comprises', ex: 'Could you tell me the total price including taxes?' },
        { icon: '🥐', en: 'breakfast included', fr: 'petit-déjeuner compris', ex: 'I would like to know whether breakfast is included.' },
        { icon: '🚗', en: 'parking available', fr: 'parking disponible', ex: 'Could you please let me know if parking is available?' },
        { icon: '😴', en: 'quiet room', fr: 'chambre calme', ex: 'If possible, I would like a quiet room.' }
      ],
      tenses: [
        { name: 'Present simple', why: 'for neutral facts and hotel details: breakfast is included, parking is available' },
        { name: 'Present continuous', why: 'for the current purpose: I’m writing to ask...' },
        { name: 'Would / could', why: 'for polite requests: Could you confirm...? I would like...' }
      ],
      orderBlocks: [
        'Greeting', 'Reason for writing', 'Dates and room type', 'Specific questions', 'Polite extra request', 'Closing'
      ],
      fillBlanks: [
        {
          prompt: 'I’m writing to ___ about the availability of a double room from May 4 to May 6.',
          options: ['ask', 'asking', 'asked'],
          answer: 'ask'
        },
        {
          prompt: 'Could you please confirm the total price, ___ taxes?',
          options: ['include', 'including', 'included'],
          answer: 'including'
        },
        {
          prompt: 'If possible, I would also like a ___ room.',
          options: ['quiet', 'quietly', 'quieter'],
          answer: 'quiet'
        }
      ],
      model: {
        a2: 'Subject: Request for information about a room\n\nDear Reservation Team,\n\nI’m writing to ask about the availability of a double room from May 4 to May 6. Could you please confirm the total price, including taxes? I would also like to know if breakfast is included and if parking is available. If possible, I would like a quiet room.\n\nThank you in advance for your help.\n\nBest regards,\nMathieu',
        b1: 'Subject: Reservation request for May 4 to May 6\n\nDear Reservation Team,\n\nI’m writing to ask whether you have a double room available for 2 nights from May 4 to May 6. Could you please confirm the total price, including taxes? I would also like to know whether breakfast is included and if parking is available.\n\nIf possible, I would prefer a quiet room, as I will need to rest after travelling.\n\nThank you in advance for your help. I look forward to your reply.\n\nBest regards,\nMathieu',
        b2: 'Subject: Reservation enquiry for a double room — May 4 to May 6\n\nDear Reservation Team,\n\nI am writing to enquire about the availability of a double room for a two-night stay from May 4 to May 6. Could you please confirm the total price, including taxes, and let me know whether breakfast is included in the rate? I would also appreciate it if you could tell me whether parking is available on site.\n\nIf possible, I would prefer a quiet room, as I will be travelling and would like to rest in good conditions.\n\nThank you in advance for your assistance. I look forward to hearing from you.\n\nBest regards,\nMathieu'
      },
      challenges: [
        'Add one extra question about check-in time or cancellation policy.',
        'Use one polite request with Could you please...?',
        'Mention one preference clearly.'
      ]
    },
    'hotel-complaint': {
      category: 'Travel / complaint',
      title: 'Noise complaint after a hotel stay',
      task: 'Write a polite but firm complaint email after a noisy stay and ask for a solution or explanation.',
      target: 'Complaint email',
      audience: 'Hotel manager',
      purpose: 'Explain a problem and request a fair response',
      details: 'Street noise, poor sleep, ask for explanation / gesture',
      purposeOptions: ['Complaint', 'Follow-up complaint', 'Request for explanation', 'Compensation request'],
      topicOptions: ['noisy room', 'street noise', 'poor sleep', 'room problem'],
      detailOptions: ['May 4–6', 'room 214', 'unable to sleep', 'possible commercial gesture'],
      phrases: [
        'I’m writing regarding my recent stay...',
        'Unfortunately, we were unable to...',
        'In my opinion, guests should be informed that...',
        'I would appreciate an explanation regarding...',
        'I hope you will consider an appropriate solution.',
        'Thank you for your attention to this matter.'
      ],
      upgrades: [
        'much noisier than expected', 'unable to sleep properly', 'inform guests in advance', 'commercial gesture', 'negative experience', 'appropriate solution'
      ],
      vocabulary: [
        { icon: '🔊', en: 'street noise', fr: 'bruit de la rue', ex: 'There was a lot of street noise during the night.' },
        { icon: '😴', en: 'unable to sleep', fr: 'incapable de dormir', ex: 'We were unable to sleep properly.' },
        { icon: '⚠️', en: 'unexpected', fr: 'inattendu', ex: 'The room was much noisier than expected.' },
        { icon: '📝', en: 'inform guests in advance', fr: 'informer les clients à l’avance', ex: 'Guests should be informed in advance about possible noise.' },
        { icon: '🤝', en: 'commercial gesture', fr: 'geste commercial', ex: 'I hope you will consider a small commercial gesture.' },
        { icon: '📣', en: 'explanation', fr: 'explication', ex: 'I would appreciate an explanation regarding this issue.' }
      ],
      tenses: [
        { name: 'Past simple', why: 'to explain what happened during the stay' },
        { name: 'Modal verbs', why: 'to make polite requests: could, would' },
        { name: 'Present simple', why: 'to express a general opinion: guests should be informed' }
      ],
      orderBlocks: [
        'Greeting', 'Reason for writing', 'What happened', 'Effect on the customer', 'Request for explanation / solution', 'Closing'
      ],
      fillBlanks: [
        {
          prompt: 'Unfortunately, our room was much ___ than expected.',
          options: ['noisier', 'noise', 'noisy'],
          answer: 'noisier'
        },
        {
          prompt: 'We were unable to sleep ___ during our stay.',
          options: ['properly', 'proper', 'more proper'],
          answer: 'properly'
        },
        {
          prompt: 'I would appreciate an ___ regarding this issue.',
          options: ['explain', 'explanation', 'explaining'],
          answer: 'explanation'
        }
      ],
      model: {
        a2: 'Subject: Complaint about our stay\n\nDear Sir or Madam,\n\nI’m writing regarding our stay from May 4 to May 6. Unfortunately, our room was very noisy because of the street outside. We were unable to sleep properly in the morning.\n\nIn my opinion, guests should be informed if a room may be noisy. I would appreciate an explanation, and I hope you will consider a solution.\n\nThank you for your attention.\n\nBest regards,\nMathieu',
        b1: 'Subject: Complaint regarding our stay from May 4 to May 6\n\nDear Sir or Madam,\n\nI’m writing regarding our recent stay at your hotel from May 4 to May 6. Unfortunately, our room was much noisier than expected because of the street outside, and we were unable to sleep properly in the morning.\n\nIn my opinion, guests should be informed in advance if a room may be affected by this kind of noise. For this reason, I would appreciate an explanation regarding the room allocation and I hope you will consider an appropriate commercial gesture.\n\nThank you for your attention to this matter. I look forward to your reply.\n\nBest regards,\nMathieu',
        b2: 'Subject: Complaint concerning our stay from May 4 to May 6\n\nDear Sir or Madam,\n\nI am writing to express my dissatisfaction regarding our recent stay at your hotel from May 4 to May 6. Unfortunately, the room we were given was much noisier than expected due to street noise, and as a result we were unable to sleep properly, particularly in the morning.\n\nIn my view, guests should be informed in advance when a room may be affected by this type of disturbance. I would therefore appreciate an explanation regarding the room assignment, and I hope you will consider an appropriate gesture in response to this negative experience.\n\nThank you for your attention to this matter. I look forward to hearing from you.\n\nBest regards,\nMathieu'
      },
      challenges: [
        'Mention the exact dates of the stay.',
        'Explain the effect on sleep or comfort.',
        'Ask for an explanation or a gesture politely.'
      ]
    },
    'meeting-reschedule': {
      category: 'Work / office',
      title: 'Reschedule a meeting',
      task: 'Write to a colleague or client to change a meeting time, explain why, and suggest another slot.',
      target: 'Professional email',
      audience: 'Client or colleague',
      purpose: 'Explain a change and propose a practical solution',
      details: 'Polite apology + new date/time',
      purposeOptions: ['Reschedule request', 'Change of plan', 'New appointment', 'Meeting confirmation'],
      topicOptions: ['meeting', 'online call', 'training session', 'project review'],
      detailOptions: ['next Tuesday', 'Thursday morning', '2:30 p.m.', 'Teams meeting'],
      phrases: [
        'I’m sorry, but I need to...',
        'Unfortunately, something has come up.',
        'Would it be possible to reschedule...?',
        'I’m available on...',
        'Please let me know which option suits you best.',
        'Thank you for your understanding.'
      ],
      upgrades: [
        'something urgent has come up', 'reschedule the meeting', 'alternative time slot', 'suits you best', 'thank you for your flexibility', 'remain available'
      ],
      vocabulary: [
        { icon: '📆', en: 'reschedule', fr: 'reprogrammer', ex: 'Would it be possible to reschedule the meeting?' },
        { icon: '⏰', en: 'time slot', fr: 'créneau horaire', ex: 'I can suggest another time slot.' },
        { icon: '🙏', en: 'apologize', fr: 'présenter ses excuses', ex: 'I apologize for the inconvenience.' },
        { icon: '💻', en: 'online call', fr: 'appel en ligne', ex: 'We can also keep the same format for the online call.' },
        { icon: '✅', en: 'available', fr: 'disponible', ex: 'I’m available on Thursday morning.' },
        { icon: '🤝', en: 'flexibility', fr: 'souplesse', ex: 'Thank you for your flexibility.' }
      ],
      tenses: [
        { name: 'Present continuous', why: 'for the current need: I’m writing because I need to reschedule...' },
        { name: 'Present perfect', why: 'for something that has just happened and affects the plan now' },
        { name: 'Would / could', why: 'for polite suggestions and requests' }
      ],
      orderBlocks: [
        'Greeting', 'Reason for writing', 'Brief explanation', 'New proposal', 'Ask for confirmation', 'Closing'
      ],
      fillBlanks: [
        {
          prompt: 'Unfortunately, something urgent has ___ up.',
          options: ['came', 'come', 'coming'],
          answer: 'come'
        },
        {
          prompt: 'Would it be possible to ___ our meeting?',
          options: ['reschedule', 'rescheduled', 'rescheduling'],
          answer: 'reschedule'
        },
        {
          prompt: 'Please let me know which option ___ you best.',
          options: ['suit', 'suits', 'suited'],
          answer: 'suits'
        }
      ],
      model: {
        a2: 'Subject: Change of meeting date\n\nDear Alex,\n\nI’m sorry, but I need to change our meeting. Unfortunately, something urgent has come up. Would it be possible to reschedule it for next Tuesday at 2:30 p.m.?\n\nPlease let me know if this time is convenient for you. Thank you for your understanding.\n\nBest regards,\nMathieu',
        b1: 'Subject: Request to reschedule our meeting\n\nDear Alex,\n\nI’m sorry, but I need to reschedule our meeting planned for tomorrow afternoon. Unfortunately, something urgent has come up and I will not be available at the original time.\n\nWould it be possible to meet next Tuesday at 2:30 p.m. instead? If that does not suit you, I am also available on Thursday morning.\n\nPlease let me know which option works best for you. Thank you for your understanding.\n\nBest regards,\nMathieu',
        b2: 'Subject: Request to reschedule our meeting\n\nDear Alex,\n\nI am writing to let you know that I need to reschedule our meeting that was originally planned for tomorrow afternoon. Unfortunately, something urgent has come up, and I will therefore be unable to attend at the scheduled time.\n\nWould it be possible to move the meeting to next Tuesday at 2:30 p.m.? If that is not convenient, I would also be available on Thursday morning, and I would be happy to adapt to the option that suits you best.\n\nI apologize for any inconvenience and thank you for your flexibility. I look forward to your confirmation.\n\nBest regards,\nMathieu'
      },
      challenges: [
        'Offer two possible new time slots.',
        'Apologize briefly but clearly.',
        'End with a request for confirmation.'
      ]
    },
    'product-problem': {
      category: 'Customer service / work',
      title: 'Report a product or service problem',
      task: 'Write to explain a problem with a product or service and request support, repair, or replacement.',
      target: 'Problem report email',
      audience: 'Customer service team',
      purpose: 'Explain the situation and ask for a clear solution',
      details: 'Faulty item / service issue + solution',
      purposeOptions: ['Problem report', 'Technical support request', 'Replacement request', 'Complaint'],
      topicOptions: ['faulty product', 'service issue', 'vending machine', 'incorrect order'],
      detailOptions: ['stopped working', 'wrong item', 'repair needed', 'replacement requested'],
      phrases: [
        'I’m contacting you regarding...',
        'Unfortunately, the product stopped working...',
        'As a result, we were unable to...',
        'Could you please advise us on the next steps?',
        'We would appreciate a repair or replacement.',
        'I look forward to your prompt response.'
      ],
      upgrades: [
        'faulty', 'stopped working properly', 'as a result', 'prompt response', 'repair or replacement', 'resolve the issue quickly'
      ],
      vocabulary: [
        { icon: '🛠️', en: 'faulty', fr: 'défectueux', ex: 'The device appears to be faulty.' },
        { icon: '🧾', en: 'reference number', fr: 'numéro de référence', ex: 'The reference number is VM-214.' },
        { icon: '🚫', en: 'stopped working', fr: 'a cessé de fonctionner', ex: 'The machine stopped working after two hours.' },
        { icon: '📦', en: 'replacement', fr: 'remplacement', ex: 'We would like to request a replacement.' },
        { icon: '🔧', en: 'repair', fr: 'réparation', ex: 'A repair would also be acceptable.' },
        { icon: '⚡', en: 'prompt response', fr: 'réponse rapide', ex: 'We would appreciate a prompt response.' }
      ],
      tenses: [
        { name: 'Past simple', why: 'to describe what happened' },
        { name: 'As a result + past / present', why: 'to explain the consequence of the problem' },
        { name: 'Could / would', why: 'to ask for support politely' }
      ],
      orderBlocks: [
        'Greeting', 'Reason for writing', 'Description of problem', 'Consequence', 'Request for solution', 'Closing'
      ],
      fillBlanks: [
        {
          prompt: 'Unfortunately, the machine stopped ___ properly yesterday afternoon.',
          options: ['work', 'working', 'worked'],
          answer: 'working'
        },
        {
          prompt: 'As a ___, we were unable to serve several customers.',
          options: ['result', 'reason', 'conclusion'],
          answer: 'result'
        },
        {
          prompt: 'Could you please advise us on the next ___?',
          options: ['step', 'steps', 'stepping'],
          answer: 'steps'
        }
      ],
      model: {
        a2: 'Subject: Problem with a product\n\nDear Customer Service Team,\n\nI’m contacting you regarding a problem with one of our machines. Unfortunately, it stopped working properly yesterday afternoon. As a result, we were unable to serve several customers.\n\nCould you please tell us what to do next? We would appreciate a repair or a replacement.\n\nThank you for your help.\n\nBest regards,\nMathieu',
        b1: 'Subject: Problem report — faulty machine\n\nDear Customer Service Team,\n\nI’m contacting you regarding a problem with one of our vending machines, reference VM-214. Unfortunately, the machine stopped working properly yesterday afternoon after several customers had already used it. As a result, we were unable to continue serving customers normally.\n\nCould you please advise us on the next steps? We would appreciate either a prompt repair or a replacement, depending on what is possible.\n\nThank you in advance for your help. I look forward to your response.\n\nBest regards,\nMathieu',
        b2: 'Subject: Problem report — faulty vending machine VM-214\n\nDear Customer Service Team,\n\nI am contacting you regarding a technical issue affecting one of our vending machines, reference VM-214. Unfortunately, the machine stopped working properly yesterday afternoon after several transactions, and as a result we were unable to continue serving customers under normal conditions.\n\nCould you please advise us on the next steps and let us know whether a repair can be arranged quickly? If this is not possible, we would appreciate a replacement in order to resolve the issue without further delay.\n\nThank you in advance for your assistance. I look forward to your prompt response.\n\nBest regards,\nMathieu'
      },
      challenges: [
        'Mention a reference number or one specific detail.',
        'Explain the consequence clearly.',
        'Ask for repair or replacement.'
      ]
    },
    'online-vs-face': {
      category: 'Opinion / professional context',
      title: 'Short opinion task: online meetings vs face-to-face meetings',
      task: 'Write a short structured answer comparing two options and giving your opinion with reasons.',
      target: 'Structured opinion answer',
      audience: 'Examiner / general reader',
      purpose: 'Compare options and justify a preference',
      details: 'comparatives + connectors + conclusion',
      purposeOptions: ['Opinion answer', 'Comparison task', 'Advantages / disadvantages', 'Recommendation'],
      topicOptions: ['online meetings', 'face-to-face meetings', 'team communication', 'working methods'],
      detailOptions: ['more practical', 'more efficient', 'less flexible', 'best option'],
      phrases: [
        'On the one hand,',
        'On the other hand,',
        'In my opinion,',
        'For example,',
        'Overall,',
        'I would recommend...'
      ],
      upgrades: [
        'more practical', 'more efficient', 'easier to organize', 'stronger interaction', 'save commuting time', 'the most suitable option'
      ],
      vocabulary: [
        { icon: '💻', en: 'online meeting', fr: 'réunion en ligne', ex: 'An online meeting is often easier to organize.' },
        { icon: '🏢', en: 'face-to-face', fr: 'en présentiel', ex: 'Face-to-face meetings can create stronger interaction.' },
        { icon: '⚡', en: 'efficient', fr: 'efficace', ex: 'This format is more efficient for short updates.' },
        { icon: '🤝', en: 'interaction', fr: 'interaction', ex: 'Face-to-face meetings allow more natural interaction.' },
        { icon: '🕒', en: 'save time', fr: 'gagner du temps', ex: 'Online meetings can save commuting time.' },
        { icon: '🎯', en: 'suitable', fr: 'adapté', ex: 'It is the most suitable option for quick discussions.' }
      ],
      tenses: [
        { name: 'Present simple', why: 'to express general truths and opinions' },
        { name: 'Comparatives / superlatives', why: 'to compare the two options clearly' },
        { name: 'Modal verbs', why: 'to give suggestions or recommendations' }
      ],
      orderBlocks: [
        'Opening sentence', 'Option 1 advantage', 'Option 2 advantage', 'Comparison', 'Personal opinion', 'Conclusion'
      ],
      fillBlanks: [
        {
          prompt: 'Online meetings are often more ___ for short updates.',
          options: ['practical', 'practically', 'most practical'],
          answer: 'practical'
        },
        {
          prompt: 'Face-to-face meetings usually create ___ interaction.',
          options: ['strong', 'stronger', 'strongest'],
          answer: 'stronger'
        },
        {
          prompt: 'Overall, I think the best option depends ___ the objective.',
          options: ['of', 'on', 'at'],
          answer: 'on'
        }
      ],
      model: {
        a2: 'Online meetings and face-to-face meetings both have advantages. On the one hand, online meetings are more practical because they save time. On the other hand, face-to-face meetings are often better for communication because people can interact more easily. In my opinion, online meetings are good for short updates, but face-to-face meetings are better for important discussions. Overall, the best option depends on the situation.',
        b1: 'Online meetings and face-to-face meetings are both useful in professional life, but they are not suitable for the same situations. On the one hand, online meetings are often more practical because they save commuting time and are easier to organize quickly. On the other hand, face-to-face meetings usually create stronger interaction and make communication more natural. In my opinion, online meetings are more efficient for short updates, while face-to-face meetings are better for important discussions or teamwork. Overall, the best choice depends on the goal of the meeting.',
        b2: 'Both online meetings and face-to-face meetings offer clear advantages, but their effectiveness depends largely on the purpose of the exchange. On the one hand, online meetings are generally more practical and time-efficient, especially for short updates or routine coordination, since they eliminate travel and are easier to organize at short notice. On the other hand, face-to-face meetings usually encourage stronger interaction, more spontaneous discussion, and better team cohesion. In my view, online meetings are the most suitable option for brief and functional communication, whereas face-to-face meetings remain more effective when discussion, negotiation, or collaboration is essential. Overall, the most efficient format is the one that matches the objective of the meeting.'
      },
      challenges: [
        'Use one comparative and one superlative.',
        'Give one reason for each option.',
        'Finish with a balanced conclusion.'
      ]
    },
    'customer-compensation': {
      category: 'Opinion / service',
      title: 'Opinion task: should companies always compensate unhappy customers?',
      task: 'Write a structured opinion answer. Give your point of view and support it with reasons and one example.',
      target: 'Structured opinion answer',
      audience: 'Examiner / general reader',
      purpose: 'Express an opinion and justify it clearly',
      details: 'fairness + customer service + conclusion',
      purposeOptions: ['Opinion answer', 'Advantages / disadvantages', 'Balanced argument', 'Recommendation'],
      topicOptions: ['customer complaints', 'compensation', 'refund policy', 'customer service'],
      detailOptions: ['fair solution', 'case by case', 'protect trust', 'avoid abuse'],
      phrases: [
        'In my opinion,',
        'First of all,',
        'For example,',
        'However,',
        'For this reason,',
        'To conclude,'
      ],
      upgrades: [
        'restore customer trust', 'offer a fair solution', 'respond professionally', 'protect the company’s reputation', 'examine each case carefully', 'balanced approach'
      ],
      vocabulary: [
        { icon: '💬', en: 'complaint', fr: 'réclamation', ex: 'The company received a complaint from a customer.' },
        { icon: '💶', en: 'refund', fr: 'remboursement', ex: 'A refund may be the best solution in some cases.' },
        { icon: '⚖️', en: 'fair', fr: 'juste / équitable', ex: 'The final decision should be fair.' },
        { icon: '🤝', en: 'trust', fr: 'confiance', ex: 'A quick response can rebuild trust.' },
        { icon: '🏢', en: 'reputation', fr: 'réputation', ex: 'Poor handling can damage a company’s reputation.' },
        { icon: '🔍', en: 'case by case', fr: 'au cas par cas', ex: 'Each complaint should be examined case by case.' }
      ],
      tenses: [
        { name: 'Present simple', why: 'to state general arguments and opinions' },
        { name: 'Modal verbs', why: 'to suggest what companies should do' },
        { name: 'Present simple / condition of result', why: 'to explain consequences such as trust or reputation' }
      ],
      orderBlocks: [
        'Opening sentence', 'Clear opinion', 'Reason 1', 'Example or support', 'Counterpoint', 'Conclusion'
      ],
      fillBlanks: [
        {
          prompt: 'Companies should handle complaints in a ___ and professional way.',
          options: ['fair', 'fairly', 'fairest'],
          answer: 'fair'
        },
        {
          prompt: 'A quick response can help ___ customer trust.',
          options: ['restore', 'restored', 'restoring'],
          answer: 'restore'
        },
        {
          prompt: 'Each complaint should be examined case ___ case.',
          options: ['for', 'by', 'with'],
          answer: 'by'
        }
      ],
      model: {
        a2: 'Some customers are unhappy when they have a bad experience. In my opinion, companies should help them when the complaint is real. First of all, a quick and polite answer can calm the customer. For example, if a service was poor, the company can offer a refund or another solution. However, I do not think all customers should receive compensation automatically. To conclude, companies should listen carefully and choose a fair solution in each case.',
        b1: 'When customers are dissatisfied, companies have to decide whether they should offer compensation. In my opinion, they should do so when the complaint is justified, but the decision should depend on the situation. First of all, compensation can restore trust after a real mistake. For example, if a customer pays for a service that was not provided correctly, a refund may be appropriate. However, automatic compensation may encourage unfair complaints. To conclude, the best approach is to examine each case carefully and offer a fair, professional solution.',
        b2: 'Whether companies should always compensate unhappy customers is a question of both fairness and professional responsibility. In my view, compensation should not be automatic, but it should certainly be offered when the company is clearly at fault. To begin with, an appropriate refund or commercial gesture can restore customer trust and prevent long-term damage to the company’s reputation. For instance, if a client receives poor service or misleading information, compensation demonstrates accountability. However, rewarding every complaint without verification may lead to abuse and inconsistency. Ultimately, the most effective policy is to assess each case individually and provide a solution that is fair, proportionate, and professional.'
      },
      challenges: [
        'State your opinion clearly in the introduction.',
        'Give one realistic example from business or travel.',
        'Add one counter-argument before your conclusion.'
      ]
    },
    'tourism-balance': {
      category: 'Opinion / general',
      title: 'Opinion task: does tourism bring more advantages than disadvantages?',
      task: 'Write a balanced answer about tourism, then give your final opinion with reasons.',
      target: 'Structured opinion answer',
      audience: 'Examiner / general reader',
      purpose: 'Discuss advantages and disadvantages before concluding',
      details: 'jobs + environment + balanced conclusion',
      purposeOptions: ['Opinion answer', 'Balanced argument', 'Advantages / disadvantages', 'Conclusion task'],
      topicOptions: ['tourism', 'local economy', 'popular destinations', 'environmental impact'],
      detailOptions: ['creates jobs', 'supports businesses', 'can damage nature', 'needs better control'],
      phrases: [
        'It is often argued that',
        'To begin with,',
        'However,',
        'In addition,',
        'In my opinion,',
        'Overall,'
      ],
      upgrades: [
        'generate revenue', 'support local businesses', 'put pressure on infrastructure', 'damage the environment', 'manage visitor numbers', 'sustainable tourism'
      ],
      vocabulary: [
        { icon: '💼', en: 'create jobs', fr: 'créer des emplois', ex: 'Tourism can create jobs in many sectors.' },
        { icon: '🏪', en: 'local businesses', fr: 'commerces locaux', ex: 'Visitors often support local businesses.' },
        { icon: '🌿', en: 'environment', fr: 'environnement', ex: 'Too many visitors can damage the environment.' },
        { icon: '🏙️', en: 'infrastructure', fr: 'infrastructures', ex: 'Mass tourism can put pressure on local infrastructure.' },
        { icon: '📈', en: 'revenue', fr: 'revenus', ex: 'Tourism generates revenue for cities and regions.' },
        { icon: '♻️', en: 'sustainable', fr: 'durable', ex: 'Sustainable tourism is better for the future.' }
      ],
      tenses: [
        { name: 'Present simple', why: 'to describe general effects of tourism' },
        { name: 'Modal verbs', why: 'to suggest solutions: governments should...' },
        { name: 'Comparatives', why: 'to weigh advantages against disadvantages' }
      ],
      orderBlocks: [
        'Opening sentence', 'Advantage 1', 'Advantage 2', 'Disadvantage', 'Personal opinion', 'Conclusion'
      ],
      fillBlanks: [
        {
          prompt: 'Tourism can ___ jobs and support local businesses.',
          options: ['create', 'created', 'creating'],
          answer: 'create'
        },
        {
          prompt: 'However, mass tourism can also ___ the environment.',
          options: ['damage', 'damaged', 'damaging'],
          answer: 'damage'
        },
        {
          prompt: 'In my opinion, tourism is positive if it is well ___.',
          options: ['manage', 'managed', 'managing'],
          answer: 'managed'
        }
      ],
      model: {
        a2: 'Tourism is important in many countries. It creates jobs and helps local shops, hotels, and restaurants. In addition, tourists can discover new places and cultures. However, too many visitors can make places noisy and crowded, and nature can be damaged. In my opinion, tourism has more advantages than disadvantages if it is controlled well. Overall, tourism is positive, but it needs clear rules.',
        b1: 'Tourism plays an important role in many countries, and it has both positive and negative effects. To begin with, it creates jobs and supports a wide range of local businesses, such as hotels, restaurants, and transport services. It can also bring more revenue to cities and regions. However, mass tourism can create serious problems. Popular places may become overcrowded, and the environment can suffer if visitor numbers are too high. In my opinion, tourism brings more advantages than disadvantages, provided that it is managed responsibly. Overall, better control is the key to making tourism more sustainable.',
        b2: 'Tourism is often presented as a major source of economic development, yet it can also create significant social and environmental problems. On the positive side, it generates revenue, creates employment, and supports a broad network of local businesses. It may also encourage cultural exchange and investment in heritage sites. However, uncontrolled tourism can place considerable pressure on infrastructure, increase pollution, and damage natural areas. In my view, tourism brings more advantages than disadvantages, but only when it is managed in a sustainable way. Ultimately, the challenge is not tourism itself, but the way destinations prepare for and regulate it.'
      },
      challenges: [
        'Give one economic argument and one environmental argument.',
        'Use one contrast connector such as however or on the other hand.',
        'Finish with a clear final opinion.'
      ]
    },
    'public-transport': {
      category: 'Opinion / society',
      title: 'Opinion task: should public transport be free in cities?',
      task: 'Write a short opinion answer discussing benefits and drawbacks before giving your view.',
      target: 'Structured opinion answer',
      audience: 'Examiner / general reader',
      purpose: 'Discuss a public issue and justify a position',
      details: 'cost + pollution + social benefit',
      purposeOptions: ['Opinion answer', 'Balanced argument', 'Advantages / disadvantages', 'Recommendation'],
      topicOptions: ['public transport', 'city life', 'daily travel', 'urban policy'],
      detailOptions: ['reduce traffic', 'help low-income residents', 'cost money to run', 'reduce pollution'],
      phrases: [
        'There is a growing debate about',
        'One advantage is that',
        'Nevertheless,',
        'For this reason,',
        'All things considered,',
        'In my opinion,'
      ],
      upgrades: [
        'reduce congestion', 'ease financial pressure', 'require public funding', 'improve accessibility', 'encourage sustainable travel', 'maintain a reliable network'
      ],
      vocabulary: [
        { icon: '🚌', en: 'public transport', fr: 'transports en commun', ex: 'Public transport is essential in large cities.' },
        { icon: '🚦', en: 'traffic congestion', fr: 'embouteillages', ex: 'Better buses can reduce traffic congestion.' },
        { icon: '💸', en: 'financial pressure', fr: 'pression financière', ex: 'Free transport can reduce financial pressure on families.' },
        { icon: '🌍', en: 'pollution', fr: 'pollution', ex: 'More public transport use can reduce pollution.' },
        { icon: '🏛️', en: 'public funding', fr: 'financement public', ex: 'The system still needs public funding.' },
        { icon: '✅', en: 'reliable network', fr: 'réseau fiable', ex: 'Cities must maintain a reliable network.' }
      ],
      tenses: [
        { name: 'Present simple', why: 'to state general arguments and consequences' },
        { name: 'Modal verbs', why: 'to explain what cities should do' },
        { name: 'Comparatives', why: 'to compare transport options and effects' }
      ],
      orderBlocks: [
        'Opening sentence', 'Advantage', 'Second advantage', 'Drawback', 'Personal opinion', 'Conclusion'
      ],
      fillBlanks: [
        {
          prompt: 'Free transport can help ___ traffic in cities.',
          options: ['reduce', 'reduced', 'reducing'],
          answer: 'reduce'
        },
        {
          prompt: 'However, the system still ___ public funding.',
          options: ['require', 'requires', 'required'],
          answer: 'requires'
        },
        {
          prompt: 'In my opinion, quality is just as important ___ price.',
          options: ['of', 'than', 'as'],
          answer: 'as'
        }
      ],
      model: {
        a2: 'Some people think public transport should be free in cities. One advantage is that it can help people who do not have a lot of money. It can also reduce traffic and pollution because more people may leave their cars at home. However, buses and trains cost money to run. In my opinion, free public transport is a good idea, but cities need a clear financial plan. Overall, quality is also very important.',
        b1: 'Whether public transport should be free in cities is an issue that many people are discussing today. One advantage is that it would make daily travel easier for people with limited incomes. It could also encourage more residents to use buses or trams instead of cars, which would reduce traffic and pollution. Nevertheless, public transport is expensive to operate, and somebody still has to pay for it through taxes or public funding. In my opinion, free public transport is a positive idea, but only if cities can maintain a reliable service. All things considered, affordability should not reduce quality.',
        b2: 'The idea of making public transport free in cities is often presented as a solution to both social inequality and environmental concerns. On the one hand, it could ease financial pressure on households and encourage more sustainable travel, thereby reducing congestion and pollution. On the other hand, transport networks require substantial funding to remain efficient, safe, and reliable. If ticket revenue disappears without a strong replacement strategy, service quality may decline. In my view, free public transport can be an excellent policy, but only if cities are able to protect long-term reliability. Ultimately, accessibility should improve without weakening the network itself.'
      },
      challenges: [
        'Mention one social argument and one financial argument.',
        'Use at least one strong connector of contrast.',
        'Give a nuanced conclusion, not just yes or no.'
      ]
    }
  };

  const byId = (id) => document.getElementById(id);

  const els = {
    scoreNow: byId('scoreNow'),
    scoreMax: byId('scoreMax'),
    progressFill: byId('progressFill'),
    progressText: byId('progressText'),
    toast: byId('toast'),
    studentName: byId('studentName'),
    levelSelect: byId('levelSelect'),
    writingTargetSelect: byId('writingTargetSelect'),
    accentToggle: byId('accentToggle'),
    ipadModeBtn: byId('ipadModeBtn'),
    connectorBank: byId('connectorBank'),
    transitionBank: byId('transitionBank'),
    errorList: byId('errorList'),
    tenseQuiz: byId('tenseQuiz'),
    rewriteQuiz: byId('rewriteQuiz'),
    verbCards: byId('verbCards'),
    verbQuiz: byId('verbQuiz'),
    scenarioSelect: byId('scenarioSelect'),
    scenarioTitle: byId('scenarioTitle'),
    scenarioTask: byId('scenarioTask'),
    scenarioMeta: byId('scenarioMeta'),
    phraseBank: byId('phraseBank'),
    upgradeBank: byId('upgradeBank'),
    vocabCards: byId('vocabCards'),
    tenseGuide: byId('tenseGuide'),
    orderBank: byId('orderBank'),
    orderTarget: byId('orderTarget'),
    orderFeedback: byId('orderFeedback'),
    fillBlanksBox: byId('fillBlanksBox'),
    fillFeedback: byId('fillFeedback'),
    purposeSelect: byId('purposeSelect'),
    topicSelect: byId('topicSelect'),
    detailSelect: byId('detailSelect'),
    builderOutput: byId('builderOutput'),
    draftArea: byId('draftArea'),
    draftFeedback: byId('draftFeedback'),
    modelCard: byId('modelCard'),
    modelOutput: byId('modelOutput'),
    timerDisplay: byId('timerDisplay'),
    challengeCards: byId('challengeCards'),
    reportOutput: byId('reportOutput')
  };

  function showToast(message) {
    if (!els.toast) {
      return;
    }
    els.toast.textContent = message;
    els.toast.classList.add('show');
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
      els.toast.classList.remove('show');
    }, 1800);
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function copyText(text) {
    navigator.clipboard.writeText(String(text || '')).then(() => showToast('Copied.')).catch(() => showToast('Copy failed.'));
  }

  function speakText(text) {
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis is not supported on this device.');
      return;
    }
    const content = String(text || '').trim();
    if (!content) {
      showToast('Nothing to read yet.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(content);
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((voice) => {
      const lang = (voice.lang || '').toLowerCase();
      const name = (voice.name || '').toLowerCase();
      if (state.accent === 'uk') {
        return lang.includes('en-gb') || name.includes('british') || name.includes('uk');
      }
      return lang.includes('en-us') || name.includes('american') || name.includes('us');
    });
    if (preferred) {
      utterance.voice = preferred;
      utterance.lang = preferred.lang;
    } else {
      utterance.lang = state.accent === 'uk' ? 'en-GB' : 'en-US';
    }
    window.speechSynthesis.speak(utterance);
  }

  function updateScore(delta, maxDelta) {
    state.score += delta;
    state.maxScore += maxDelta;
    renderScore();
    renderProgress();
  }

  function award(key, points, maxDelta) {
    const previous = state.awards[key] || { points: 0, max: 0 };
    state.score += points - previous.points;
    state.maxScore += maxDelta - previous.max;
    state.awards[key] = { points, max: maxDelta };
    renderScore();
    renderProgress();
  }

  function renderScore() {
    els.scoreNow.textContent = String(state.score);
    els.scoreMax.textContent = String(state.maxScore);
  }

  function renderProgress() {
    const checks = Array.from(document.querySelectorAll('.progress-check'));
    const checked = checks.filter((cb) => cb.checked).length;
    const targetItems = Array.from(els.orderTarget.querySelectorAll('.order-item')).length;
    const fillSelected = Array.from(document.querySelectorAll('.fill-select')).filter((el) => el.value).length;
    const hasDraft = els.draftArea.value.trim().length > 0;
    const shownModel = !els.modelCard.hidden;
    const completedParts = [
      checked >= 3,
      targetItems >= 4,
      fillSelected >= 3,
      hasDraft,
      shownModel
    ].filter(Boolean).length;
    const progress = Math.round((completedParts / 5) * 100);
    els.progressFill.style.width = `${progress}%`;
    els.progressText.textContent = `${progress}%`;
    renderReport();
  }

  function makeChip(text, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function renderConnectorBanks() {
    els.connectorBank.innerHTML = '';
    connectors.forEach((item) => {
      els.connectorBank.appendChild(makeChip(item, () => copyText(item)));
    });
    els.transitionBank.innerHTML = '';
    transitions.forEach((item) => {
      els.transitionBank.appendChild(makeChip(item, () => insertIntoDraft(item)));
    });
  }

  function renderCorrectionItems() {
    els.errorList.innerHTML = correctionItems.map((item) => `
      <article class="error-card">
        <p class="wrong">✗ ${escapeHtml(item.wrong)}</p>
        <p class="right">✓ ${escapeHtml(item.right)}</p>
        <p>${escapeHtml(item.why)}</p>
      </article>
    `).join('');
  }

  function shuffle(array) {
    const clone = array.slice();
    for (let i = clone.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  }

  function shuffleDifferent(array) {
    if (array.length < 2) {
      return array.slice();
    }
    let attempt = array.slice();
    let tries = 0;
    do {
      attempt = shuffle(array);
      tries += 1;
    } while (tries < 8 && attempt.every((item, idx) => item === array[idx]));
    if (attempt.every((item, idx) => item === array[idx])) {
      attempt.push(attempt.shift());
    }
    return attempt;
  }

  function showFeedback(container, message, tone) {
    if (!container) {
      return;
    }
    container.className = `feedback-panel ${tone}`;
    container.textContent = message;
  }

  function renderQuizList(container, items, options) {
    container.innerHTML = '';
    items.forEach((q, index) => {
      const item = document.createElement('article');
      item.className = 'quiz-item';
      item.dataset.done = 'false';
      item.innerHTML = `<h5>${index + 1}. ${escapeHtml(q.stem)}</h5>`;
      const optionRow = document.createElement('div');
      optionRow.className = 'option-row';
      q.options.forEach((option, optIndex) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'secondary option-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => {
          if (item.dataset.done === 'true') {
            return;
          }
          item.dataset.done = 'true';
          Array.from(optionRow.querySelectorAll('button')).forEach((b, idx) => {
            b.disabled = true;
            if (idx === q.answer) {
              b.classList.add('correct');
            }
          });
          if (optIndex === q.answer) {
            award(`${container.id}-${index}`, 1, 1);
            appendInlineFeedback(item, 'Excellent. That answer is clearer and more natural.', 'good');
          } else {
            award(`${container.id}-${index}`, 0, 1);
            btn.classList.add('wrong');
            appendInlineFeedback(item, `Not quite. Hint: ${q.hint}`, 'bad');
          }
        });
        optionRow.appendChild(btn);
      });
      item.appendChild(optionRow);
      container.appendChild(item);
    });
  }

  function appendInlineFeedback(item, message, tone) {
    let panel = item.querySelector('.feedback-panel');
    if (!panel) {
      panel = document.createElement('div');
      item.appendChild(panel);
    }
    panel.className = `feedback-panel ${tone}`;
    panel.textContent = message;
  }

  function renderVerbCards() {
    els.verbCards.innerHTML = writingVerbs.map((item) => `
      <button type="button" class="verb-card" data-say="${escapeHtml(item.base)}. Past simple or preterite: ${escapeHtml(item.past)}. Past participle: ${escapeHtml(item.participle)}. ${escapeHtml(item.use)}.">
        <span class="vocab-icon">${item.icon}</span>
        <strong>${escapeHtml(item.base)}</strong>
        <span class="verb-line">past simple / preterite: ${escapeHtml(item.past)}</span>
        <span class="verb-line">past participle: ${escapeHtml(item.participle)}</span>
        <span class="verb-use">${escapeHtml(item.use)}</span>
      </button>
    `).join('');
    Array.from(els.verbCards.querySelectorAll('.verb-card')).forEach((card) => {
      card.addEventListener('click', () => speakText(card.dataset.say));
    });
  }

  function renderQuizzes() {
    renderQuizList(els.tenseQuiz, tenseQuizItems, { type: 'tense' });
    renderQuizList(els.rewriteQuiz, shuffle(rewriteQuizBank).slice(0, 4), { type: 'rewrite' });
    renderQuizList(els.verbQuiz, shuffle(verbQuizBank).slice(0, 4), { type: 'verb' });
  }

  function renderScenarioOptions() {
    els.scenarioSelect.innerHTML = Object.keys(scenarios).map((key) => `<option value="${key}">${escapeHtml(scenarios[key].title)}</option>`).join('');
    els.scenarioSelect.value = state.scenarioKey;
  }

  function setSelectableChip(container, items, keyName) {
    container.innerHTML = '';
    items.forEach((item) => {
      const chip = makeChip(item, () => {
        Array.from(container.querySelectorAll('.chip')).forEach((c) => c.classList.remove('selected'));
        chip.classList.add('selected');
        if (keyName === 'phrase') {
          state.selectedPhrase = item;
        } else {
          state.selectedUpgrade = item;
        }
      });
      container.appendChild(chip);
    });
  }

  function renderVocabCards(scenario) {
    els.vocabCards.innerHTML = scenario.vocabulary.map((item) => `
      <button type="button" class="vocab-card" data-say="${escapeHtml(item.en)}. ${escapeHtml(item.ex)}">
        <span class="vocab-icon">${item.icon}</span>
        <strong>${escapeHtml(item.en)}</strong>
        <span class="vocab-fr">${escapeHtml(item.fr)}</span>
        <span class="vocab-ex">${escapeHtml(item.ex)}</span>
      </button>
    `).join('');
    Array.from(els.vocabCards.querySelectorAll('.vocab-card')).forEach((card) => {
      card.addEventListener('click', () => speakText(card.dataset.say));
    });
  }

  function renderTenseGuide(scenario) {
    els.tenseGuide.innerHTML = scenario.tenses.map((item) => `
      <div class="info-row">
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(item.why)}</span>
      </div>
    `).join('');
  }

  function renderMeta(scenario) {
    els.scenarioMeta.innerHTML = `
      <div class="meta-row"><strong>Category:</strong> <span>${escapeHtml(scenario.category)}</span></div>
      <div class="meta-row"><strong>Audience:</strong> <span>${escapeHtml(scenario.audience)}</span></div>
      <div class="meta-row"><strong>Goal:</strong> <span>${escapeHtml(scenario.purpose)}</span></div>
      <div class="meta-row"><strong>Useful detail:</strong> <span>${escapeHtml(scenario.details)}</span></div>
      <div class="meta-row"><strong>Target text:</strong> <span>${escapeHtml(scenario.target)}</span></div>
    `;
  }

  function renderOrderBank(scenario) {
    els.orderBank.innerHTML = '';
    els.orderTarget.innerHTML = '';
    shuffleDifferent(scenario.orderBlocks).forEach((block) => {
      const item = document.createElement('div');
      item.className = 'order-item';
      item.dataset.value = block;
      item.innerHTML = `<span>${escapeHtml(block)}</span>`;
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'secondary small';
      addBtn.textContent = '➕ Add';
      addBtn.addEventListener('click', () => addOrderItem(block));
      item.appendChild(addBtn);
      els.orderBank.appendChild(item);
    });
    showFeedback(els.orderFeedback, 'Build the structure, then check it.', 'warn');
  }

  function addOrderItem(text) {
    const current = Array.from(els.orderTarget.querySelectorAll('.target-item')).map((el) => el.dataset.value);
    if (current.includes(text)) {
      showToast('This block is already in your order.');
      return;
    }
    const item = document.createElement('div');
    item.className = 'order-item target-item';
    item.dataset.value = text;
    item.innerHTML = `<span>${escapeHtml(text)}</span>`;

    const controls = document.createElement('div');
    controls.className = 'mini-actions';

    const up = document.createElement('button');
    up.type = 'button';
    up.className = 'secondary small';
    up.textContent = '↑';
    up.addEventListener('click', () => {
      const prev = item.previousElementSibling;
      if (prev) {
        els.orderTarget.insertBefore(item, prev);
      }
    });

    const down = document.createElement('button');
    down.type = 'button';
    down.className = 'secondary small';
    down.textContent = '↓';
    down.addEventListener('click', () => {
      const next = item.nextElementSibling;
      if (next) {
        els.orderTarget.insertBefore(next, item);
      }
    });

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'secondary small';
    remove.textContent = '✕';
    remove.addEventListener('click', () => item.remove());

    controls.appendChild(up);
    controls.appendChild(down);
    controls.appendChild(remove);
    item.appendChild(controls);
    els.orderTarget.appendChild(item);
    renderProgress();
  }

  function checkOrder() {
    const correct = scenarios[state.scenarioKey].orderBlocks;
    const current = Array.from(els.orderTarget.querySelectorAll('.target-item')).map((el) => el.dataset.value);
    if (!current.length) {
      showFeedback(els.orderFeedback, 'Add some blocks first.', 'bad');
      return;
    }
    const isPerfect = current.length === correct.length && current.every((item, idx) => item === correct[idx]);
    if (isPerfect) {
      award('order-check', 1, 1);
      showFeedback(els.orderFeedback, 'Excellent. The order is clear and logical.', 'good');
    } else {
      award('order-check', 0, 1);
      showFeedback(els.orderFeedback, `Almost there. Try a clearer structure: ${correct.join(' → ')}.`, 'warn');
    }
  }

  function renderFillBlanks(scenario) {
    els.fillBlanksBox.innerHTML = '';
    scenario.fillBlanks.forEach((item, index) => {
      const wrapper = document.createElement('article');
      wrapper.className = 'quiz-item';
      const select = document.createElement('select');
      select.className = 'fill-select';
      select.innerHTML = `<option value="">Choose...</option>${item.options.map((opt) => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('')}`;
      wrapper.innerHTML = `<p><strong>${index + 1}.</strong> ${escapeHtml(item.prompt.replace('___', '_____'))}</p>`;
      wrapper.appendChild(select);
      els.fillBlanksBox.appendChild(wrapper);
    });
    showFeedback(els.fillFeedback, 'Choose the best words, then check.', 'warn');
  }

  function checkFillBlanks() {
    const scenario = scenarios[state.scenarioKey];
    const selects = Array.from(document.querySelectorAll('.fill-select'));
    let good = 0;
    selects.forEach((select, idx) => {
      const expected = scenario.fillBlanks[idx].answer;
      if (select.value === expected) {
        good += 1;
      }
    });
    award('fill-check', good === scenario.fillBlanks.length ? 1 : 0, 1);
    if (good === scenario.fillBlanks.length) {
      showFeedback(els.fillFeedback, 'Great job. The expressions are accurate and natural.', 'good');
    } else {
      showFeedback(els.fillFeedback, `${good} / ${scenario.fillBlanks.length} correct. Try again and watch the tense or collocation.`, 'warn');
    }
  }

  function resetFillBlanks() {
    Array.from(document.querySelectorAll('.fill-select')).forEach((select) => {
      select.value = '';
    });
    showFeedback(els.fillFeedback, 'Selections cleared.', 'warn');
    renderProgress();
  }

  function renderBuilderOptions(scenario) {
    els.purposeSelect.innerHTML = scenario.purposeOptions.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join('');
    els.topicSelect.innerHTML = scenario.topicOptions.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join('');
    els.detailSelect.innerHTML = scenario.detailOptions.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join('');
    els.builderOutput.textContent = 'Build a subject or an opener here.';
  }

  function buildSubject() {
    const subject = `${els.purposeSelect.value} — ${els.topicSelect.value} — ${els.detailSelect.value}`;
    els.builderOutput.textContent = `Subject: ${subject}`;
  }

  function buildOpener() {
    const scenario = scenarios[state.scenarioKey];
    let opener = '';
    if (scenario.target.toLowerCase().includes('opinion')) {
      opener = `In my opinion, ${els.topicSelect.value} is worth discussing because ${els.detailSelect.value} can make a real difference.`;
    } else {
      opener = `I’m writing regarding ${els.topicSelect.value}. I would like to ask about ${els.detailSelect.value}.`;
    }
    els.builderOutput.textContent = opener;
  }

  function insertIntoDraft(text) {
    const area = els.draftArea;
    const start = area.selectionStart;
    const end = area.selectionEnd;
    const current = area.value;
    const before = current.slice(0, start);
    const after = current.slice(end);
    const prefix = before && !before.endsWith(' ') && !before.endsWith('\n') ? ' ' : '';
    area.value = `${before}${prefix}${text}${after}`;
    area.focus();
    const cursor = (before + prefix + text).length;
    area.setSelectionRange(cursor, cursor);
    renderProgress();
  }

  function getDraftStats(text) {
    const clean = text.trim();
    const words = clean ? clean.split(/\s+/).length : 0;
    const paragraphs = clean ? clean.split(/\n+/).filter(Boolean).length : 0;
    const lower = clean.toLowerCase();
    const connectorCount = transitions.filter((item) => lower.includes(item.toLowerCase().replace(',', ''))).length + connectors.filter((item) => lower.includes(item.toLowerCase().replace(',', ''))).length;
    return { words, paragraphs, connectorCount, lower };
  }

  function getWordTarget(level) {
    if (level === 'a2') {
      return 80;
    }
    if (level === 'b1') {
      return 150;
    }
    return 200;
  }

  function checkDraft() {
    const text = els.draftArea.value;
    const stats = getDraftStats(text);
    const scenario = scenarios[state.scenarioKey];
    const target = getWordTarget(els.levelSelect.value);
    const issues = [];
    const strengths = [];
    let points = 0;

    if (stats.words >= target) {
      strengths.push(`Good length for the selected level (${stats.words} words).`);
      points += 1;
    } else {
      issues.push(`Try to reach at least ${target} words for this level.`);
    }

    if (scenario.target.toLowerCase().includes('email')) {
      if (/dear|hello|hi/i.test(text) && /best regards|kind regards|sincerely|thank you/i.test(text)) {
        strengths.push('Your opening and closing fit an email format.');
        points += 1;
      } else {
        issues.push('Add a suitable greeting and a polite closing.');
      }
    } else {
      if (/in my opinion|overall|to conclude|on the one hand|on the other hand/i.test(text)) {
        strengths.push('Your opinion structure is visible.');
        points += 1;
      } else {
        issues.push('Add a clear opinion and a short conclusion.');
      }
    }

    if (stats.connectorCount >= 3) {
      strengths.push('You used several connectors to organize the answer.');
      points += 1;
    } else {
      issues.push('Use more connectors such as however, moreover, for this reason, or overall.');
    }

    if (scenario.upgrades.some((word) => stats.lower.includes(word.toLowerCase()))) {
      strengths.push('You used more precise vocabulary.');
      points += 1;
    } else {
      issues.push('Try to reuse one or two upgrade expressions from the bank.');
    }

    if (/could you|would it be possible|i would appreciate|for example|as a result|please let me know/i.test(text)) {
      strengths.push('The tone is suitably polite or well-supported.');
      points += 1;
    } else {
      issues.push('Add a polite request or a supporting detail/example.');
    }

    award('draft-check', points, 5);
    const tone = points >= 4 ? 'good' : points >= 2 ? 'warn' : 'bad';
    const lines = [
      strengths.length ? `✅ Strengths:\n• ${strengths.join('\n• ')}` : '✅ Strengths:\n• Keep going — the structure is starting to build.',
      issues.length ? `\n\n🔧 Improve next:\n• ${issues.join('\n• ')}` : '\n\n🔧 Improve next:\n• Very solid answer. Now try to make it even more natural.'
    ];
    showFeedback(els.draftFeedback, lines.join(''), tone);
  }

  function toggleModel() {
    if (els.modelCard.hidden) {
      const scenario = scenarios[state.scenarioKey];
      const model = scenario.model[els.levelSelect.value];
      els.modelOutput.textContent = model;
      els.modelCard.hidden = false;
      showToast('Model shown.');
    } else {
      els.modelCard.hidden = true;
      showToast('Model hidden.');
    }
    renderProgress();
  }

  function setDraftToModel() {
    const scenario = scenarios[state.scenarioKey];
    els.draftArea.value = scenario.model[els.levelSelect.value];
    renderProgress();
    showToast('Model inserted into the draft zone.');
  }

  function renderChallenges(scenario) {
    const base = [
      'Write a clear reason in the first sentence.',
      'Add one useful detail, date, or example.',
      'Finish with a professional closing or conclusion.'
    ];
    const cards = scenario.challenges.concat(base);
    els.challengeCards.innerHTML = cards.map((item, idx) => `
      <article class="exam-card">
        <h5>Challenge ${idx + 1}</h5>
        <p>${escapeHtml(item)}</p>
      </article>
    `).join('');
  }

  function renderScenario() {
    const scenario = scenarios[state.scenarioKey];
    els.scenarioTitle.textContent = scenario.title;
    els.scenarioTask.textContent = scenario.task;
    renderMeta(scenario);
    setSelectableChip(els.phraseBank, scenario.phrases, 'phrase');
    setSelectableChip(els.upgradeBank, scenario.upgrades, 'upgrade');
    renderVocabCards(scenario);
    renderTenseGuide(scenario);
    renderOrderBank(scenario);
    renderFillBlanks(scenario);
    renderBuilderOptions(scenario);
    renderChallenges(scenario);
    els.modelCard.hidden = true;
    els.modelOutput.textContent = '';
    showFeedback(els.draftFeedback, 'Write your own answer, then use Self-check.', 'warn');
    renderReport();
  }

  function renderReport() {
    const scenario = scenarios[state.scenarioKey];
    const stats = getDraftStats(els.draftArea.value);
    const checks = Array.from(document.querySelectorAll('.progress-check'));
    const checked = checks.filter((cb) => cb.checked).length;
    const target = getWordTarget(els.levelSelect.value);
    const currentOrder = Array.from(els.orderTarget.querySelectorAll('.target-item')).map((item) => item.dataset.value);
    els.reportOutput.textContent = [
      `Student: ${els.studentName.value.trim() || '—'}`,
      `Level target: ${els.levelSelect.options[els.levelSelect.selectedIndex].text}`,
      `Writing target: ${els.writingTargetSelect.options[els.writingTargetSelect.selectedIndex].text}`,
      `Scenario: ${scenario.title}`,
      `Global score: ${state.score} / ${state.maxScore}`,
      `Draft length: ${stats.words} words (target: ${target}+)`,
      `Paragraphs: ${stats.paragraphs}`,
      `Connector count: ${stats.connectorCount}`,
      `Checklist completed: ${checked} / ${checks.length}`,
      '',
      'Current structure:',
      currentOrder.length ? currentOrder.map((line, idx) => `${idx + 1}. ${line}`).join('\n') : 'No structure built yet.',
      '',
      'Next focus:',
      '• clearer opener',
      '• stronger detail or example',
      '• more precise professional vocabulary',
      '• cleaner closing or conclusion'
    ].join('\n');
  }

  function saveProgress() {
    const payload = {
      state,
      name: els.studentName.value,
      level: els.levelSelect.value,
      writingTarget: els.writingTargetSelect.value,
      draft: els.draftArea.value,
      builder: els.builderOutput.textContent,
      checks: Array.from(document.querySelectorAll('.progress-check')).map((cb) => cb.checked),
      order: Array.from(els.orderTarget.querySelectorAll('.target-item')).map((item) => item.dataset.value),
      fill: Array.from(document.querySelectorAll('.fill-select')).map((select) => select.value),
      modelVisible: !els.modelCard.hidden
    };
    localStorage.setItem('speakeasy-vtest-writing-lab', JSON.stringify(payload));
    showToast('Progress saved.');
  }

  function loadProgress() {
    const raw = localStorage.getItem('speakeasy-vtest-writing-lab');
    if (!raw) {
      showToast('No saved progress found.');
      return;
    }
    try {
      const payload = JSON.parse(raw);
      Object.assign(state, payload.state || {});
      els.studentName.value = payload.name || '';
      els.levelSelect.value = payload.level || 'b1';
      els.writingTargetSelect.value = payload.writingTarget || 'email';
      renderScore();
      renderScenarioOptions();
      renderScenario();
      els.draftArea.value = payload.draft || '';
      els.builderOutput.textContent = payload.builder || 'Build a subject or an opener here.';
      Array.from(document.querySelectorAll('.progress-check')).forEach((cb, idx) => {
        cb.checked = Boolean((payload.checks || [])[idx]);
      });
      if (Array.isArray(payload.order)) {
        els.orderTarget.innerHTML = '';
        payload.order.forEach((block) => addOrderItem(block));
      }
      Array.from(document.querySelectorAll('.fill-select')).forEach((select, idx) => {
        select.value = (payload.fill || [])[idx] || '';
      });
      if (payload.modelVisible) {
        const model = scenarios[state.scenarioKey].model[els.levelSelect.value];
        els.modelOutput.textContent = model;
        els.modelCard.hidden = false;
      }
      syncAccentUi();
      syncIpadMode();
      updateTimerDisplay();
      renderProgress();
      showToast('Progress loaded.');
    } catch (error) {
      showToast('Saved data could not be loaded.');
    }
  }

  function syncAccentUi() {
    Array.from(els.accentToggle.querySelectorAll('.seg')).forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.accent === state.accent);
    });
  }

  function syncIpadMode() {
    document.body.classList.toggle('ipad-mode', state.ipadMode);
    els.ipadModeBtn.textContent = `iPad friendly: ${state.ipadMode ? 'On' : 'Off'}`;
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(state.timerSeconds / 60);
    const seconds = state.timerSeconds % 60;
    els.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function startTimer() {
    if (state.timerRunning) {
      return;
    }
    state.timerRunning = true;
    state.timerId = window.setInterval(() => {
      if (state.timerSeconds <= 0) {
        pauseTimer();
        showToast('Time is up.');
        return;
      }
      state.timerSeconds -= 1;
      updateTimerDisplay();
    }, 1000);
  }

  function pauseTimer() {
    state.timerRunning = false;
    window.clearInterval(state.timerId);
  }

  function resetTimer() {
    pauseTimer();
    state.timerSeconds = state.timerDefault;
    updateTimerDisplay();
  }

  function bindEvents() {
    Array.from(document.querySelectorAll('.mini-example')).forEach((box) => {
      box.addEventListener('click', () => {
        copyText(box.dataset.copy || box.textContent);
      });
    });

    byId('listenTipsBtn').addEventListener('click', () => speakText('Write clearly, explain the situation, make a request or give an opinion, and finish politely.'));
    byId('copyConnectorsBtn').addEventListener('click', () => copyText(connectors.join(' ')));
    byId('newQuizBtn').addEventListener('click', renderQuizzes);
    byId('newVerbQuizBtn').addEventListener('click', () => renderQuizList(els.verbQuiz, shuffle(verbQuizBank).slice(0, 4), { type: 'verb' }));
    byId('listenVerbsBtn').addEventListener('click', () => {
      speakText(writingVerbs.map((item) => `${item.base}. Past simple or preterite: ${item.past}. Past participle: ${item.participle}.`).join(' '));
    });
    byId('listenVocabBtn').addEventListener('click', () => {
      const scenario = scenarios[state.scenarioKey];
      speakText(scenario.vocabulary.map((item) => `${item.en}. ${item.ex}`).join(' '));
    });

    byId('newScenarioBtn').addEventListener('click', () => {
      const keys = Object.keys(scenarios);
      const available = keys.filter((key) => key !== state.scenarioKey);
      state.scenarioKey = available[Math.floor(Math.random() * available.length)];
      els.scenarioSelect.value = state.scenarioKey;
      renderScenario();
      renderProgress();
    });
    byId('loadScenarioBtn').addEventListener('click', () => {
      state.scenarioKey = els.scenarioSelect.value;
      renderScenario();
      renderProgress();
    });

    byId('insertPhraseBtn').addEventListener('click', () => {
      if (!state.selectedPhrase) {
        showToast('Select a phrase first.');
        return;
      }
      insertIntoDraft(state.selectedPhrase);
    });

    byId('insertUpgradeBtn').addEventListener('click', () => {
      if (!state.selectedUpgrade) {
        showToast('Select an upgrade word first.');
        return;
      }
      insertIntoDraft(state.selectedUpgrade);
    });

    byId('checkOrderBtn').addEventListener('click', checkOrder);
    byId('resetOrderBtn').addEventListener('click', () => {
      els.orderTarget.innerHTML = '';
      showFeedback(els.orderFeedback, 'Order cleared.', 'warn');
      renderProgress();
    });

    byId('checkFillBtn').addEventListener('click', checkFillBlanks);
    byId('resetFillBtn').addEventListener('click', resetFillBlanks);

    byId('buildSubjectBtn').addEventListener('click', buildSubject);
    byId('buildOpenerBtn').addEventListener('click', buildOpener);
    byId('copyBuilderBtn').addEventListener('click', () => copyText(els.builderOutput.textContent));

    byId('checkDraftBtn').addEventListener('click', checkDraft);
    byId('modelBtn').addEventListener('click', toggleModel);
    byId('copyModelBtn').addEventListener('click', () => copyText(els.modelOutput.textContent));
    byId('listenModelBtn').addEventListener('click', () => speakText(els.modelOutput.textContent));
    byId('copyDraftBtn').addEventListener('click', () => copyText(els.draftArea.value));
    byId('listenDraftBtn').addEventListener('click', () => speakText(els.draftArea.value));
    byId('clearDraftBtn').addEventListener('click', () => {
      els.draftArea.value = '';
      showFeedback(els.draftFeedback, 'Draft cleared.', 'warn');
      renderProgress();
    });

    byId('copyReportBtn').addEventListener('click', () => copyText(els.reportOutput.textContent));
    byId('printBtn').addEventListener('click', () => window.print());

    byId('saveProgressBtn').addEventListener('click', saveProgress);
    byId('loadProgressBtn').addEventListener('click', loadProgress);

    byId('timerStartBtn').addEventListener('click', startTimer);
    byId('timerPauseBtn').addEventListener('click', pauseTimer);
    byId('timerResetBtn').addEventListener('click', resetTimer);
    Array.from(document.querySelectorAll('[data-time]')).forEach((btn) => {
      btn.addEventListener('click', () => {
        state.timerDefault = Number(btn.dataset.time);
        state.timerSeconds = state.timerDefault;
        updateTimerDisplay();
        Array.from(document.querySelectorAll('[data-time]')).forEach((b) => b.classList.remove('primary'));
        btn.classList.add('primary');
      });
    });

    Array.from(document.querySelectorAll('.progress-check')).forEach((cb) => {
      cb.addEventListener('change', renderProgress);
    });

    els.draftArea.addEventListener('input', renderProgress);
    els.levelSelect.addEventListener('change', () => {
      if (!els.modelCard.hidden) {
        els.modelOutput.textContent = scenarios[state.scenarioKey].model[els.levelSelect.value];
      }
      renderReport();
    });
    els.writingTargetSelect.addEventListener('change', renderReport);
    els.studentName.addEventListener('input', renderReport);

    Array.from(els.accentToggle.querySelectorAll('.seg')).forEach((btn) => {
      btn.addEventListener('click', () => {
        state.accent = btn.dataset.accent;
        syncAccentUi();
      });
    });

    els.ipadModeBtn.addEventListener('click', () => {
      state.ipadMode = !state.ipadMode;
      syncIpadMode();
    });

    byId('resetScoreBtn').addEventListener('click', () => {
      state.score = 0;
      state.maxScore = 0;
      state.awards = {};
      renderScore();
      showToast('Score reset.');
    });
  }

  function init() {
    renderScore();
    renderConnectorBanks();
    renderCorrectionItems();
    renderVerbCards();
    renderQuizzes();
    renderScenarioOptions();
    renderScenario();
    updateTimerDisplay();
    syncAccentUi();
    syncIpadMode();
    bindEvents();
    renderProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
