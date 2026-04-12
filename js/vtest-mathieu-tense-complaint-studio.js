(function () {
  'use strict';

  const state = {
    accent: 'us',
    score: 0,
    maxScore: 0,
    scenarioKey: 'car-rental'
  };

  const phraseBank = [
    'The complaint is justified.',
    'The complaint is valid.',
    'We were charged unfairly.',
    'The company handled the situation badly.',
    'We have not received a reply yet.',
    'I would appreciate a prompt response.',
    'I am writing to request a fair solution.',
    'In my opinion, the charge is unreasonable.',
    'The reservation is confirmed.',
    'The payment was taken twice.',
    'We have already submitted the documents.',
    'The flight was canceled unexpectedly.'
  ];

  const adjectiveBank = [
    'justified', 'valid', 'reasonable', 'unfairly', 'incorrectly', 'unexpectedly',
    'politely', 'professionally', 'frustrating', 'disappointing', 'unacceptable', 'helpful',
    'confirmed', 'excessive', 'duplicate', 'misleading', 'damaged', 'delayed', 'unsuitable'
  ];

  const verbs = [
    ['ask', 'asked', 'asked', 'I asked for clarification.'],
    ['book', 'booked', 'booked', 'We booked the room online.'],
    ['charge', 'charged', 'charged', 'The company charged us 300 euros.'],
    ['complain', 'complained', 'complained', 'The customer complained politely.'],
    ['confirm', 'confirmed', 'confirmed', 'Could you confirm the refund?'],
    ['explain', 'explained', 'explained', 'I explained the situation clearly.'],
    ['handle', 'handled', 'handled', 'The staff handled the matter professionally.'],
    ['deny', 'denied', 'denied', 'The airline denied boarding without a clear explanation.'],
    ['damage', 'damaged', 'damaged', 'The parcel was damaged in transit.'],
    ['receive', 'received', 'received', 'We have not received a reply yet.'],
    ['refund', 'refunded', 'refunded', 'The agency refunded the amount.'],
    ['renew', 'renewed', 'renewed', 'The subscription renewed automatically.'],
    ['return', 'returned', 'returned', 'We returned the car yesterday.'],
    ['submit', 'submitted', 'submitted', 'We have already submitted the documents.'],
    ['solve', 'solved', 'solved', 'They solved the issue quickly.'],
    ['write', 'wrote', 'written', 'I wrote to customer service.']
  ];

  const tenseQuestions = [
    {
      stem: 'The complaint is justified.',
      options: ['Present simple with be + adjective', 'Past simple / preterite', 'Present perfect'],
      answer: 0,
      hint: 'Use this for a present judgment or general statement.'
    },
    {
      stem: 'The company charged us unfairly.',
      options: ['Present simple', 'Past simple / preterite', 'Would for a polite request'],
      answer: 1,
      hint: 'This describes a finished action in the past.'
    },
    {
      stem: 'We have not received a reply yet.',
      options: ['Present perfect', 'Past simple / preterite', 'Present continuous'],
      answer: 0,
      hint: 'The situation started before now and still matters now.'
    },
    {
      stem: 'I would appreciate a prompt response.',
      options: ['Would for a polite request', 'Present simple', 'Past simple / preterite'],
      answer: 0,
      hint: 'This structure sounds polite and professional.'
    }
  ];


  const commonPatterns = [
    {
      sentence: 'The reservation is confirmed.',
      label: 'Present simple with be + status adjective',
      note: 'Use this for a current status or official result now.'
    },
    {
      sentence: 'The charge is excessive.',
      label: 'Present simple with be + adjective',
      note: 'Use this for a judgment that is true now.'
    },
    {
      sentence: 'The room is unsuitable for young children.',
      label: 'Present simple with be + adjective',
      note: 'Use this for a general evaluation or warning.'
    },
    {
      sentence: 'The passenger was denied boarding.',
      label: 'Past passive',
      note: 'Someone denied boarding. The focus is on the passenger, not the airline staff.'
    },
    {
      sentence: 'The parcel was damaged in transit.',
      label: 'Past passive',
      note: 'This is common when the object matters more than the person who caused the damage.'
    },
    {
      sentence: 'The payment was taken twice.',
      label: 'Past passive',
      note: 'This is useful for duplicate charges on a bank statement or website.'
    },
    {
      sentence: 'The airline canceled the flight unexpectedly.',
      label: 'Past simple with a main verb + adverb',
      note: 'Use this for a finished action and add an adverb to describe how it happened.'
    },
    {
      sentence: 'The receptionist handled the complaint professionally.',
      label: 'Past simple with a main verb + adverb',
      note: 'Use this when the agent or company did something well or badly.'
    },
    {
      sentence: 'The website displayed the wrong price.',
      label: 'Past simple with a main verb',
      note: 'Use this for a finished event on the site or app.'
    },
    {
      sentence: 'We have not received the refund yet.',
      label: 'Present perfect',
      note: 'Use this when the missing refund still matters now.'
    },
    {
      sentence: 'They have already processed the request.',
      label: 'Present perfect',
      note: 'Use this for a completed action with a result that is important now.'
    },
    {
      sentence: 'We have already submitted the documents.',
      label: 'Present perfect',
      note: 'This often appears in application, visa, or account-verification contexts.'
    }
  ];

  const patternQuestions = [
    {
      stem: 'The booking is confirmed.',
      options: ['Present simple with be + status adjective', 'Past passive', 'Present perfect'],
      answer: 0,
      hint: 'Think about current status now.'
    },
    {
      stem: 'The payment was taken twice.',
      options: ['Past simple with a main verb', 'Past passive', 'Present simple with be + adjective'],
      answer: 1,
      hint: 'Someone took the payment, but the sentence focuses on the payment.'
    },
    {
      stem: 'The company handled the request badly.',
      options: ['Past simple with a main verb + adverb', 'Present perfect', 'Past passive'],
      answer: 0,
      hint: 'The company is the subject and the action is finished.'
    },
    {
      stem: 'We have not received a tracking number yet.',
      options: ['Present perfect', 'Past simple / preterite', 'Would for a polite request'],
      answer: 0,
      hint: 'The missing tracking number matters now.'
    },
    {
      stem: 'The room is unsuitable for a family with a baby.',
      options: ['Present simple with be + adjective', 'Past passive', 'Past simple with a main verb'],
      answer: 0,
      hint: 'This is a present evaluation.'
    },
    {
      stem: 'The parcel was damaged in transit.',
      options: ['Present perfect', 'Past passive', 'Present simple'],
      answer: 1,
      hint: 'The object received the action.'
    }
  ];

  const explainQuestions = [
    {
      stem: 'Why do we use present simple in “The complaint is valid”?',
      options: ['Because it describes a judgment that is true now', 'Because the action finished yesterday', 'Because it shows a future plan'],
      answer: 0,
      hint: 'Think: general statement / present judgment.'
    },
    {
      stem: 'Why do we use past simple in “We returned the car yesterday”?',
      options: ['Because the action is linked to now', 'Because the action is finished in the past', 'Because it is a general truth'],
      answer: 1,
      hint: 'Yesterday is a strong past marker.'
    },
    {
      stem: 'What is the best explanation for “The customer was charged unfairly”?',
      options: ['It is a past passive form', 'It is present perfect', 'It is present simple with an adjective'],
      answer: 0,
      hint: 'Someone charged the customer.'
    },
    {
      stem: 'Why do we use present perfect in “We have still not received a reply”?',
      options: ['Because it is a habitual action', 'Because it links a past situation to the present result', 'Because it describes a finished time'],
      answer: 1,
      hint: 'The lack of reply matters now.'
    }
  ];

  const verbQuestions = [
    {
      stem: 'Choose the correct form: “The company ___ us unfairly last week.”',
      options: ['charge', 'charged', 'has charged'],
      answer: 1,
      hint: 'Last week usually calls for past simple.'
    },
    {
      stem: 'Choose the correct form: “We have not ___ any reply yet.”',
      options: ['receive', 'received', 'receiving'],
      answer: 1,
      hint: 'Present perfect needs a past participle.'
    },
    {
      stem: 'Choose the correct form: “I ___ to customer service yesterday.”',
      options: ['wrote', 'written', 'write'],
      answer: 0,
      hint: 'Yesterday = finished past.'
    },
    {
      stem: 'Choose the correct form: “Could you ___ the refund, please?”',
      options: ['confirmed', 'confirm', 'confirms'],
      answer: 1,
      hint: 'After could, use the base form.'
    },
    {
      stem: 'Choose the correct form: “The airline ___ the flight unexpectedly.”',
      options: ['cancel', 'canceled', 'has canceled'],
      answer: 1,
      hint: 'This is a finished action in the past.'
    },
    {
      stem: 'Choose the correct form: “We have already ___ the documents.”',
      options: ['submit', 'submitted', 'submitting'],
      answer: 1,
      hint: 'Present perfect needs the past participle.'
    }
  ];

  const scenarios = {
    'car-rental': {
      title: 'Car rental damage complaint',
      task: 'Write a professional email to explain the charge, say why you disagree, and request a fair solution.',
      context: [
        'You returned the car yesterday at the airport.',
        'The agency charged you 300 euros for damage.',
        'You believe the complaint is not justified because you did not cause the scratch.',
        'You want a review of the case or a refund.'
      ],
      tenseGuide: [
        'Use past simple / preterite for the sequence of events: returned, checked, charged.',
        'Use present simple for your judgment now: the complaint is not justified.',
        'Use present perfect if there is no reply yet: we have not received any explanation.',
        'Use would / could for your request: I would appreciate a review of the charge.'
      ],
      phrases: [
        'I am writing regarding the 300-euro charge.',
        'In my opinion, the complaint is not justified.',
        'We returned the vehicle yesterday.',
        'We were charged unfairly.',
        'I would appreciate a review of this case.'
      ],
      orderBlocks: [
        'I am writing regarding the 300-euro charge applied after the return of our rental car.',
        'We returned the vehicle yesterday at the airport and the staff then informed us about a scratch.',
        'In my opinion, this complaint is not justified because we do not believe that we caused the damage.',
        'We have not received any clear evidence showing that the scratch was our responsibility.',
        'I would therefore appreciate a review of the case and a refund if the charge was applied incorrectly.'
      ],
      fill: [
        { before: 'We ', answer: 'returned', after: ' the vehicle yesterday at the airport.', options: ['return', 'returned', 'have returned'] },
        { before: 'The complaint ', answer: 'is', after: ' not justified.', options: ['is', 'was', 'has been'] },
        { before: 'We have not ', answer: 'received', after: ' any explanation yet.', options: ['receive', 'received', 'receiving'] },
        { before: 'I would ', answer: 'appreciate', after: ' a review of the charge.', options: ['appreciated', 'appreciate', 'appreciates'] }
      ],
      model: 'Dear Customer Service,\n\nI am writing regarding the 300-euro charge applied after the return of our rental car. We returned the vehicle yesterday at the airport, and the staff then informed us about a scratch. However, in my opinion, this complaint is not justified because we do not believe that we caused the damage. In addition, we have not received any clear evidence showing that the scratch was our responsibility. I would therefore appreciate a review of the case and a refund if the charge was applied incorrectly.\n\nThank you in advance for your help.\nKind regards,\nMathieu'
    },
    'hotel-noise': {
      title: 'Hotel noise complaint',
      task: 'Write to the hotel to explain the problem during your stay and ask for a commercial gesture.',
      context: [
        'You stayed from May 4 to May 6.',
        'Your room was noisy because of the street.',
        'You could not sleep well in the morning.',
        'You want the hotel to improve communication or offer compensation.'
      ],
      tenseGuide: [
        'Use past simple to explain what happened during the stay.',
        'Use present simple for general judgments: the room is unsuitable for light sleepers.',
        'Use would / could for polite requests or recommendations.',
        'Use comparatives if useful: a quieter room would have been more appropriate.'
      ],
      phrases: [
        'I am writing about our recent stay.',
        'The room was extremely noisy.',
        'We were unable to sleep properly.',
        'This situation was very disappointing.',
        'I would appreciate a commercial gesture.'
      ],
      orderBlocks: [
        'I am writing about our recent stay at your hotel from May 4 to May 6.',
        'Unfortunately, the room was extremely noisy because of the street outside.',
        'As a result, we were unable to sleep properly in the morning.',
        'This situation was disappointing, especially because we expected a quiet room.',
        'I would appreciate a commercial gesture and clearer information for future guests.'
      ],
      fill: [
        { before: 'The room ', answer: 'was', after: ' very noisy during our stay.', options: ['is', 'was', 'has been'] },
        { before: 'We ', answer: 'could not', after: ' sleep properly in the morning.', options: ['could not', 'do not', 'have not'] },
        { before: 'This situation ', answer: 'is', after: ' frustrating for guests who request a quiet room.', options: ['is', 'was', 'has'] },
        { before: 'I would ', answer: 'appreciate', after: ' a commercial gesture.', options: ['appreciated', 'appreciate', 'appreciates'] }
      ],
      model: 'Dear Reservation Team,\n\nI am writing about our recent stay at your hotel from May 4 to May 6. Unfortunately, the room was extremely noisy because of the street outside, and we were unable to sleep properly in the morning. This situation was disappointing, especially because we had requested a quiet room. In my opinion, clearer information about possible noise would be helpful for future guests. I would therefore appreciate a commercial gesture or an explanation regarding this issue.\n\nThank you for your attention.\nKind regards,\nMathieu'
    },
    'delivery-delay': {
      title: 'Delivery delay complaint',
      task: 'Write to customer service about a delayed order and ask for an update or solution.',
      context: [
        'You ordered an item two weeks ago.',
        'The website promised delivery within five days.',
        'You still have not received the package.',
        'You want an update, a new date, or a refund.'
      ],
      tenseGuide: [
        'Use past simple for the order and the original promise.',
        'Use present perfect for the current problem: you have not received the package.',
        'Use present simple for judgments: the delay is unacceptable.',
        'Use would / could to request action politely.'
      ],
      phrases: [
        'I am writing regarding my delayed order.',
        'The website promised delivery within five days.',
        'I have still not received the package.',
        'The delay is unacceptable.',
        'Could you please provide an update?' 
      ],
      orderBlocks: [
        'I am writing regarding my delayed order, which I placed two weeks ago.',
        'At the time of purchase, the website promised delivery within five days.',
        'However, I have still not received the package or any clear update.',
        'In my opinion, this delay is unacceptable and has caused unnecessary inconvenience.',
        'Could you please provide a new delivery date or arrange a refund if necessary?' 
      ],
      fill: [
        { before: 'I ', answer: 'placed', after: ' the order two weeks ago.', options: ['place', 'placed', 'have placed'] },
        { before: 'The website ', answer: 'promised', after: ' delivery within five days.', options: ['promise', 'promised', 'has promised'] },
        { before: 'I have still not ', answer: 'received', after: ' the package.', options: ['receive', 'received', 'receiving'] },
        { before: 'Could you please ', answer: 'provide', after: ' an update?', options: ['provided', 'provide', 'provides'] }
      ],
      model: 'Dear Customer Service,\n\nI am writing regarding my delayed order, which I placed two weeks ago. At the time of purchase, the website promised delivery within five days. However, I have still not received the package or any clear update. In my opinion, this delay is unacceptable and has caused unnecessary inconvenience. Could you please provide a new delivery date or arrange a refund if necessary?\n\nThank you in advance for your help.\nBest regards,\nMathieu'
    },
    'duplicate-charge': {
      title: 'Duplicate card charge',
      task: 'Write to a company because your card was charged twice for the same purchase and ask for one charge to be canceled or refunded.',
      context: [
        'You bought one item online yesterday.',
        'Your bank statement now shows two identical charges.',
        'You only made one purchase.',
        'You want the company to investigate and reverse the duplicate payment.'
      ],
      tenseGuide: [
        'Use past simple for the purchase: I placed the order yesterday.',
        'Use a past passive form for the payment problem: my card was charged twice.',
        'Use present simple for your judgment now: this charge is incorrect.',
        'Use would / could for the request: I would appreciate a refund of the duplicate amount.'
      ],
      phrases: [
        'I am writing regarding a duplicate charge on my card.',
        'My card was charged twice for the same order.',
        'This charge is incorrect.',
        'I only completed one purchase.',
        'I would appreciate a refund of the duplicate amount.'
      ],
      orderBlocks: [
        'I am writing regarding a duplicate charge that appears on my card after an online purchase.',
        'I placed one order yesterday, but my bank statement now shows two identical charges.',
        'In my opinion, this charge is incorrect because I only completed one purchase.',
        'I have attached the relevant information from my account for reference.',
        'I would therefore appreciate a refund of the duplicate amount as soon as possible.'
      ],
      fill: [
        { before: 'I ', answer: 'placed', after: ' one order yesterday.', options: ['place', 'placed', 'have placed'] },
        { before: 'My card was ', answer: 'charged', after: ' twice for the same purchase.', options: ['charge', 'charged', 'charging'] },
        { before: 'This charge ', answer: 'is', after: ' incorrect.', options: ['is', 'was', 'has been'] },
        { before: 'I would ', answer: 'appreciate', after: ' a refund of the duplicate amount.', options: ['appreciated', 'appreciate', 'appreciates'] }
      ],
      model: 'Dear Customer Service\n\nI am writing regarding a duplicate charge that appears on my card after an online purchase. I placed one order yesterday, but my bank statement now shows two identical charges. In my opinion, this charge is incorrect because I only completed one purchase. I have attached the relevant information from my account for reference. I would therefore appreciate a refund of the duplicate amount as soon as possible.\n\nThank you in advance for your assistance.\nKind regards,\nMathieu'
    },
    'subscription-renewal': {
      title: 'Automatic subscription renewal',
      task: 'Write to explain that a subscription renewed automatically and ask for the payment to be canceled or refunded.',
      context: [
        'You signed up for a free trial last month.',
        'The subscription renewed automatically this week.',
        'The payment was taken before you noticed it.',
        'You want the renewal to be canceled and the amount refunded.'
      ],
      tenseGuide: [
        'Use past simple for the original action: I signed up last month.',
        'Use a past passive form for the payment problem: the payment was taken automatically.',
        'Use present simple for your position now: this renewal is unclear or misleading.',
        'Use present perfect if you still have no answer: I have not received confirmation yet.'
      ],
      phrases: [
        'I am writing regarding an automatic renewal on my account.',
        'The payment was taken automatically this week.',
        'This renewal is misleading.',
        'I did not intend to continue the subscription.',
        'I would appreciate confirmation that the renewal has been canceled.'
      ],
      orderBlocks: [
        'I am writing regarding an automatic renewal that appeared on my account this week.',
        'I signed up for a free trial last month, but I did not intend to continue the subscription.',
        'Unfortunately, the payment was taken automatically before I noticed the renewal.',
        'In my opinion, this renewal is misleading because the charges were not sufficiently clear.',
        'I would appreciate confirmation that the renewal has been canceled and the amount refunded.'
      ],
      fill: [
        { before: 'I ', answer: 'signed up', after: ' for a free trial last month.', options: ['sign up', 'signed up', 'have signed up'] },
        { before: 'The payment was ', answer: 'taken', after: ' automatically this week.', options: ['take', 'took', 'taken'] },
        { before: 'This renewal ', answer: 'is', after: ' misleading.', options: ['is', 'was', 'has been'] },
        { before: 'I have not ', answer: 'received', after: ' confirmation yet.', options: ['receive', 'received', 'receiving'] }
      ],
      model: 'Dear Support Team\n\nI am writing regarding an automatic renewal that appeared on my account this week. I signed up for a free trial last month, but I did not intend to continue the subscription. Unfortunately, the payment was taken automatically before I noticed the renewal. In my opinion, this renewal is misleading because the charges were not sufficiently clear. I would appreciate confirmation that the renewal has been canceled and the amount refunded.\n\nThank you for your help.\nBest regards,\nMathieu'
    },
    'boarding-denied': {
      title: 'Denied boarding / airline complaint',
      task: 'Write to the airline to explain that you were denied boarding and ask for clarification or compensation.',
      context: [
        'You arrived at the gate on time.',
        'The airline denied boarding even though you had a valid ticket.',
        'No clear explanation was given at the airport.',
        'You want clarification and possible compensation.'
      ],
      tenseGuide: [
        'Use past simple for the sequence at the airport: arrived, showed, asked.',
        'Use a past passive form for the key problem: I was denied boarding.',
        'Use present simple for the current judgment: the situation is unacceptable.',
        'Use would / could for a polite but firm request.'
      ],
      phrases: [
        'I am writing regarding an incident at the airport.',
        'I was denied boarding despite having a valid ticket.',
        'No clear explanation was provided.',
        'This situation is unacceptable.',
        'I would appreciate clarification and compensation if appropriate.'
      ],
      orderBlocks: [
        'I am writing regarding an incident that occurred at the airport during my recent trip.',
        'I arrived at the gate on time, but I was denied boarding despite having a valid ticket.',
        'In addition, no clear explanation was provided by the airline staff at the time.',
        'In my opinion, this situation is unacceptable and caused significant inconvenience.',
        'I would therefore appreciate clarification and compensation if this is applicable in my case.'
      ],
      fill: [
        { before: 'I ', answer: 'arrived', after: ' at the gate on time.', options: ['arrive', 'arrived', 'have arrived'] },
        { before: 'I was ', answer: 'denied', after: ' boarding despite having a valid ticket.', options: ['deny', 'denied', 'denying'] },
        { before: 'This situation ', answer: 'is', after: ' unacceptable.', options: ['is', 'was', 'has been'] },
        { before: 'I would ', answer: 'appreciate', after: ' clarification and compensation if appropriate.', options: ['appreciated', 'appreciate', 'appreciates'] }
      ],
      model: 'Dear Customer Relations\n\nI am writing regarding an incident that occurred at the airport during my recent trip. I arrived at the gate on time, but I was denied boarding despite having a valid ticket. In addition, no clear explanation was provided by the airline staff at the time. In my opinion, this situation is unacceptable and caused significant inconvenience. I would therefore appreciate clarification and compensation if this is applicable in my case.\n\nThank you for your attention to this matter.\nKind regards,\nMathieu'
    }
  };

  const byId = (id) => document.getElementById(id);
  const els = {
    scoreNow: byId('scoreNow'),
    scoreMax: byId('scoreMax'),
    accentToggle: byId('accentToggle'),
    toast: byId('toast'),
    phraseBank: byId('phraseBank'),
    adjBank: byId('adjBank'),
    patternCards: byId('patternCards'),
    patternQuiz: byId('patternQuiz'),
    tenseQuiz: byId('tenseQuiz'),
    explainQuiz: byId('explainQuiz'),
    verbTableBody: byId('verbTableBody'),
    verbQuiz: byId('verbQuiz'),
    scenarioSelect: byId('scenarioSelect'),
    scenarioTitle: byId('scenarioTitle'),
    scenarioTask: byId('scenarioTask'),
    scenarioMeta: byId('scenarioMeta'),
    tenseGuide: byId('tenseGuide'),
    scenarioPhrases: byId('scenarioPhrases'),
    orderBank: byId('orderBank'),
    orderTarget: byId('orderTarget'),
    orderFeedback: byId('orderFeedback'),
    fillBlanksBox: byId('fillBlanksBox'),
    fillFeedback: byId('fillFeedback'),
    modelOutput: byId('modelOutput'),
    draftArea: byId('draftArea'),
    draftFeedback: byId('draftFeedback'),
    reportOutput: byId('reportOutput')
  };

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => els.toast.classList.remove('show'), 1800);
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function shuffle(array) {
    const clone = array.slice();
    for (let i = clone.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
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
    const voice = voices.find((v) => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      return state.accent === 'uk'
        ? lang.includes('en-gb') || name.includes('british') || name.includes('uk')
        : lang.includes('en-us') || name.includes('american') || name.includes('us');
    });
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = state.accent === 'uk' ? 'en-GB' : 'en-US';
    }
    window.speechSynthesis.speak(utterance);
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied.')).catch(() => showToast('Copy failed.'));
  }

  function updateScore(delta, maxDelta) {
    state.score += delta;
    state.maxScore += maxDelta;
    els.scoreNow.textContent = String(state.score);
    els.scoreMax.textContent = String(state.maxScore);
    renderReport();
  }

  function setFeedback(el, message, tone) {
    el.className = `feedback-panel ${tone}`;
    el.textContent = message;
  }

  function renderChipBank(container, items) {
    container.innerHTML = '';
    items.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.textContent = item;
      btn.addEventListener('click', () => copyText(item));
      container.appendChild(btn);
    });
  }

  function renderMCQ(container, questions) {
    container.innerHTML = '';
    questions.forEach((q, index) => {
      const card = document.createElement('article');
      card.className = 'quiz-item';
      card.dataset.done = 'false';
      const title = document.createElement('h5');
      title.textContent = `${index + 1}. ${q.stem}`;
      card.appendChild(title);
      const options = document.createElement('div');
      options.className = 'option-row';
      q.options.forEach((option, optIndex) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ghost option-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => {
          if (card.dataset.done === 'true') return;
          card.dataset.done = 'true';
          const buttons = Array.from(options.querySelectorAll('button'));
          buttons.forEach((b, idx) => {
            b.disabled = true;
            if (idx === q.answer) b.classList.add('correct');
          });
          if (optIndex === q.answer) {
            updateScore(1, 1);
            addLocalFeedback(card, 'Correct. Good tense logic.', 'good');
          } else {
            updateScore(0, 1);
            btn.classList.add('wrong');
            addLocalFeedback(card, `Not quite. ${q.hint}`, 'bad');
          }
        });
        options.appendChild(btn);
      });
      card.appendChild(options);
      container.appendChild(card);
    });
  }

  function addLocalFeedback(container, message, tone) {
    const panel = document.createElement('div');
    panel.className = `feedback-panel ${tone}`;
    panel.textContent = message;
    container.appendChild(panel);
  }

  function renderVerbTable() {
    els.verbTableBody.innerHTML = verbs.map((row) => `
      <tr>
        <td><strong>${escapeHtml(row[0])}</strong></td>
        <td>${escapeHtml(row[1])}</td>
        <td>${escapeHtml(row[2])}</td>
        <td>${escapeHtml(row[3])}</td>
      </tr>
    `).join('');
  }


  function renderPatternCards() {
    els.patternCards.innerHTML = commonPatterns.map((item) => `
      <article class="pattern-card">
        <div class="pattern-tag">${escapeHtml(item.label)}</div>
        <h5>${escapeHtml(item.sentence)}</h5>
        <p class="soft">${escapeHtml(item.note)}</p>
      </article>
    `).join('');
  }

  function shuffleDifferent(array) {
    const original = array.slice();
    let mixed = shuffle(array);
    let attempts = 0;
    while (mixed.every((item, index) => item === original[index]) && attempts < 8) {
      mixed = shuffle(array);
      attempts += 1;
    }
    return mixed;
  }

  function renderScenarioSelect() {
    els.scenarioSelect.innerHTML = Object.keys(scenarios).map((key) => `<option value="${key}">${escapeHtml(scenarios[key].title)}</option>`).join('');
    els.scenarioSelect.value = state.scenarioKey;
  }

  function renderScenario() {
    const s = scenarios[state.scenarioKey];
    els.scenarioTitle.textContent = s.title;
    els.scenarioTask.textContent = s.task;
    els.scenarioMeta.innerHTML = s.context.map((item) => `<div class="meta-item">${escapeHtml(item)}</div>`).join('');
    els.tenseGuide.innerHTML = s.tenseGuide.map((item) => `<div class="meta-item">${escapeHtml(item)}</div>`).join('');
    renderChipBank(els.scenarioPhrases, s.phrases);
    renderOrderLists();
    renderFillBlanks();
    els.modelOutput.textContent = s.model;
    renderReport();
  }

  function renderOrderLists() {
    const s = scenarios[state.scenarioKey];
    const mixed = shuffleDifferent(s.orderBlocks);
    els.orderBank.innerHTML = '';
    els.orderTarget.innerHTML = '';
    mixed.forEach((text) => {
      els.orderBank.appendChild(makeBankItem(text));
    });
    setFeedback(els.orderFeedback, 'Build the order, then check it.', '');
  }

  function makeBankItem(text) {
    const item = document.createElement('div');
    item.className = 'stack-item';
    item.innerHTML = `<div class="stack-text">${escapeHtml(text)}</div>`;
    const actions = document.createElement('div');
    actions.className = 'stack-actions';
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'ghost small';
    add.textContent = '➕';
    add.addEventListener('click', () => {
      els.orderTarget.appendChild(makeTargetItem(text));
      item.remove();
    });
    actions.appendChild(add);
    item.appendChild(actions);
    return item;
  }

  function makeTargetItem(text) {
    const item = document.createElement('div');
    item.className = 'stack-item';
    item.innerHTML = `<div class="stack-text">${escapeHtml(text)}</div>`;
    const actions = document.createElement('div');
    actions.className = 'stack-actions';
    const up = document.createElement('button');
    up.type = 'button';
    up.className = 'ghost small';
    up.textContent = '↑';
    up.addEventListener('click', () => {
      const prev = item.previousElementSibling;
      if (prev) els.orderTarget.insertBefore(item, prev);
    });
    const down = document.createElement('button');
    down.type = 'button';
    down.className = 'ghost small';
    down.textContent = '↓';
    down.addEventListener('click', () => {
      const next = item.nextElementSibling;
      if (next) els.orderTarget.insertBefore(next, item);
    });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'ghost small';
    remove.textContent = '↺';
    remove.addEventListener('click', () => {
      els.orderBank.appendChild(makeBankItem(text));
      item.remove();
    });
    actions.append(up, down, remove);
    item.appendChild(actions);
    return item;
  }

  function checkOrder() {
    const s = scenarios[state.scenarioKey];
    const userOrder = Array.from(els.orderTarget.querySelectorAll('.stack-text')).map((el) => el.textContent.trim());
    if (userOrder.length !== s.orderBlocks.length) {
      setFeedback(els.orderFeedback, 'Add all blocks before checking.', 'warn');
      return;
    }
    const ok = s.orderBlocks.every((text, idx) => text === userOrder[idx]);
    if (ok) {
      updateScore(1, 1);
      setFeedback(els.orderFeedback, 'Excellent. The structure is logical and professional.', 'good');
    } else {
      updateScore(0, 1);
      setFeedback(els.orderFeedback, 'Not yet. Think: reason for writing → past events → judgment → request.', 'bad');
    }
  }

  function renderFillBlanks() {
    const s = scenarios[state.scenarioKey];
    els.fillBlanksBox.innerHTML = '';
    s.fill.forEach((item, index) => {
      const row = document.createElement('article');
      row.className = 'quiz-item';
      row.innerHTML = `
        <label>
          <span>${index + 1}. ${escapeHtml(item.before)}
            <select data-answer="${escapeHtml(item.answer)}" class="gap-select">
              <option value="">Choose...</option>
              ${item.options.map((opt) => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('')}
            </select>
            ${escapeHtml(item.after)}</span>
        </label>
      `;
      els.fillBlanksBox.appendChild(row);
    });
    setFeedback(els.fillFeedback, 'Choose the best tense or verb form for each gap.', '');
  }

  function checkFillBlanks() {
    const selects = Array.from(document.querySelectorAll('.gap-select'));
    const allDone = selects.every((s) => s.value);
    if (!allDone) {
      setFeedback(els.fillFeedback, 'Complete every gap first.', 'warn');
      return;
    }
    const correct = selects.filter((s) => s.value === s.dataset.answer).length;
    const total = selects.length;
    updateScore(correct === total ? 1 : 0, 1);
    if (correct === total) {
      setFeedback(els.fillFeedback, 'Perfect. Your tense choices work well.', 'good');
    } else {
      setFeedback(els.fillFeedback, `You got ${correct}/${total}. Check the time markers and the function of the sentence.`, 'bad');
    }
  }

  function checkDraft() {
    const text = els.draftArea.value.trim();
    if (!text) {
      setFeedback(els.draftFeedback, 'Write something first.', 'warn');
      return;
    }
    const lower = text.toLowerCase();
    const words = text.split(/\s+/).length;
    const strengths = [];
    const issues = [];
    let score = 0;

    if (words >= 90) {
      strengths.push('Good length for a developed answer.');
      score += 1;
    } else {
      issues.push('Add more detail or one more developed sentence.');
    }
    if (/i am writing|i’m writing|regarding|about our recent/i.test(lower)) {
      strengths.push('Clear reason for writing.');
      score += 1;
    } else {
      issues.push('Start more clearly: “I am writing regarding...”');
    }
    if (/justified|valid|unacceptable|unfairly|disappointing|professionally/.test(lower)) {
      strengths.push('Stronger vocabulary than only good / bad.');
      score += 1;
    } else {
      issues.push('Add one stronger adjective or adverb.');
    }
    if (/would appreciate|could you please|i would therefore appreciate/.test(lower)) {
      strengths.push('Polite request included.');
      score += 1;
    } else {
      issues.push('Add a polite request at the end.');
    }
    if (/yesterday|last|have not|has not|is justified|is valid|was charged|were charged/.test(lower)) {
      strengths.push('Useful tense markers are present.');
      score += 1;
    } else {
      issues.push('Show the tense logic more clearly with time markers or stronger forms.');
    }

    updateScore(score >= 4 ? 1 : 0, 1);
    const message = [
      `Self-check: ${score}/5`,
      strengths.length ? `\nStrengths:\n- ${strengths.join('\n- ')}` : '',
      issues.length ? `\nTargets:\n- ${issues.join('\n- ')}` : ''
    ].join('');
    setFeedback(els.draftFeedback, message, score >= 4 ? 'good' : score >= 2 ? 'warn' : 'bad');
    renderReport();
  }

  function renderReport() {
    const s = scenarios[state.scenarioKey];
    const checks = Array.from(document.querySelectorAll('.progress-check'));
    const checked = checks.filter((cb) => cb.checked).length;
    els.reportOutput.textContent = [
      `Lesson: Tense + Complaint Writing Studio`,
      `Scenario: ${s.title}`,
      `Score: ${state.score}/${state.maxScore}`,
      `Checklist complete: ${checked}/${checks.length}`,
      '',
      'Key reminders:',
      '- Present simple = fact / judgment now → The complaint is justified.',
      '- Past simple / preterite = finished past action → The company charged us unfairly.',
      '- Present perfect = past linked to now → We have not received a reply yet.',
      '- Would / could = polite request → I would appreciate a prompt response.',
      '- Common patterns: The booking is confirmed. / The payment was taken twice. / We have not received the refund yet.',
      '',
      'Student draft preview:',
      els.draftArea.value.trim() || '(No draft written yet.)'
    ].join('\n');
  }

  function initEvents() {
    Array.from(document.querySelectorAll('.mini-example')).forEach((el) => {
      el.addEventListener('click', () => copyText(el.dataset.copy || el.textContent));
    });

    els.accentToggle.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-accent]');
      if (!btn) return;
      state.accent = btn.dataset.accent;
      Array.from(els.accentToggle.querySelectorAll('.seg')).forEach((seg) => seg.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Accent set to ${state.accent.toUpperCase()}.`);
    });

    byId('resetScoreBtn').addEventListener('click', () => {
      state.score = 0;
      state.maxScore = 0;
      els.scoreNow.textContent = '0';
      els.scoreMax.textContent = '0';
      renderReport();
      showToast('Score reset.');
    });
    byId('printBtn').addEventListener('click', () => window.print());
    byId('listenTipsBtn').addEventListener('click', () => speakText('State the situation clearly. Use the right tense for the function. Explain what happened and why it matters. Ask for a solution politely. Finish with a professional closing.'));
    byId('listenExplainBtn').addEventListener('click', () => speakText('The complaint is justified. This is best taught as present simple with be plus adjective. The customer was charged unfairly. This is a past passive form. The company handled the situation badly. This is past simple with a main verb and an adverb.'));
    byId('listenPatternsBtn').addEventListener('click', () => speakText(commonPatterns.map((item) => `${item.sentence} ${item.note}`).join(' ')));
    byId('listenVerbSetBtn').addEventListener('click', () => speakText(verbs.map((v) => `${v[0]}, ${v[1]}, ${v[2]}. ${v[3]}`).join(' ')));

    byId('newScenarioBtn').addEventListener('click', () => {
      const keys = Object.keys(scenarios);
      let next = state.scenarioKey;
      while (next === state.scenarioKey) next = keys[Math.floor(Math.random() * keys.length)];
      state.scenarioKey = next;
      els.scenarioSelect.value = next;
      renderScenario();
      showToast('New scenario loaded.');
    });
    byId('loadScenarioBtn').addEventListener('click', () => {
      state.scenarioKey = els.scenarioSelect.value;
      renderScenario();
    });
    byId('scenarioSelect').addEventListener('change', () => {
      state.scenarioKey = els.scenarioSelect.value;
    });

    byId('checkOrderBtn').addEventListener('click', checkOrder);
    byId('resetOrderBtn').addEventListener('click', renderOrderLists);
    byId('checkFillBtn').addEventListener('click', checkFillBlanks);
    byId('resetFillBtn').addEventListener('click', renderFillBlanks);

    byId('copyModelBtn').addEventListener('click', () => copyText(els.modelOutput.textContent));
    byId('listenModelBtn').addEventListener('click', () => speakText(els.modelOutput.textContent));
    byId('checkDraftBtn').addEventListener('click', checkDraft);
    byId('copyDraftBtn').addEventListener('click', () => copyText(els.draftArea.value));
    byId('listenDraftBtn').addEventListener('click', () => speakText(els.draftArea.value));
    byId('clearDraftBtn').addEventListener('click', () => {
      els.draftArea.value = '';
      setFeedback(els.draftFeedback, 'Draft cleared.', '');
      renderReport();
    });
    byId('copyReportBtn').addEventListener('click', () => copyText(els.reportOutput.textContent));

    document.querySelectorAll('.progress-check').forEach((cb) => cb.addEventListener('change', renderReport));
  }

  function init() {
    renderChipBank(els.phraseBank, phraseBank);
    renderChipBank(els.adjBank, adjectiveBank);
    renderPatternCards();
    renderMCQ(els.patternQuiz, shuffle(patternQuestions));
    renderMCQ(els.tenseQuiz, shuffle(tenseQuestions));
    renderMCQ(els.explainQuiz, shuffle(explainQuestions));
    renderVerbTable();
    renderMCQ(els.verbQuiz, shuffle(verbQuestions));
    renderScenarioSelect();
    renderScenario();
    initEvents();
    renderReport();
    setFeedback(els.orderFeedback, 'Build the order, then check it.', '');
    setFeedback(els.fillFeedback, 'Choose the best tense or verb form for each gap.', '');
    setFeedback(els.draftFeedback, 'Write your answer, then click Self-check.', '');
  }

  init();
})();
