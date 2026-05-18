/* SpeakEasyTisha · Isabelle CLOE Realty Quest · Lessons 1 & 2 */
(() => {
  'use strict';

  const state = {
    accent: 'en-GB',
    voices: [],
    scores: {
      vocab: 0,
      grammar: 0,
      career: 0,
      oral: 0
    },
    answered: new Set(),
    builderIndex: 0,
    builderAnswer: [],
    timer: {
      total: 60,
      remaining: 60,
      id: null
    },
    currentQuestion: null,
    currentRoleplay: null
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const vocab = [
    {
      icon: '⚖️', category: 'career', term: 'legal background', fr: 'formation / expérience juridique',
      definition: 'Knowledge or professional experience connected to law and legal issues.',
      example: 'My legal background helps me understand property documents and client files.'
    },
    {
      icon: '🎓', category: 'career', term: 'law degree', fr: 'diplôme de droit',
      definition: 'A university qualification in law.',
      example: 'I studied law and my law degree gave me a strong analytical approach.'
    },
    {
      icon: '💼', category: 'career', term: 'commercial experience', fr: 'expérience commerciale',
      definition: 'Experience in sales, business development, clients, and negotiation.',
      example: 'I have strong commercial experience in real estate sales.'
    },
    {
      icon: '👩‍💼', category: 'career', term: 'sales manager', fr: 'responsable des ventes',
      definition: 'A person responsible for leading sales activities or a sales team.',
      example: 'I worked as a sales manager in the real estate sector.'
    },
    {
      icon: '🧭', category: 'career', term: 'career path', fr: 'parcours professionnel',
      definition: 'The different jobs and professional steps in someone’s working life.',
      example: 'My career path combines legal knowledge and real estate sales.'
    },
    {
      icon: '🌍', category: 'career', term: 'international clients', fr: 'clients internationaux',
      definition: 'Clients who come from different countries or use another language.',
      example: 'In Amsterdam, I may need to work with international clients.'
    },
    {
      icon: '🏢', category: 'realty', term: 'real estate agency', fr: 'agence immobilière',
      definition: 'A business that helps people buy, sell, or rent properties.',
      example: 'I would like to work in a real estate agency in Amsterdam.'
    },
    {
      icon: '🏠', category: 'realty', term: 'property', fr: 'bien immobilier',
      definition: 'A house, apartment, office, shop, or land that can be bought, sold, or rented.',
      example: 'This property is located near public transport and local shops.'
    },
    {
      icon: '🏘️', category: 'realty', term: 'housing market', fr: 'marché immobilier résidentiel',
      definition: 'The market for buying, selling, or renting homes.',
      example: 'The housing market in Amsterdam is competitive.'
    },
    {
      icon: '🏢', category: 'realty', term: 'commercial property', fr: 'local commercial / immobilier d’entreprise',
      definition: 'A property used for business, such as an office, shop, or warehouse.',
      example: 'She would also like to work with commercial properties such as offices and shops.'
    },
    {
      icon: '🛋️', category: 'realty', term: 'layout', fr: 'agencement / disposition',
      definition: 'The way rooms and spaces are arranged inside a property.',
      example: 'The layout is practical because the bedrooms are separated from the living area.'
    },
    {
      icon: '☀️', category: 'realty', term: 'natural light', fr: 'luminosité naturelle',
      definition: 'Light that comes into a room from the sun through windows.',
      example: 'The apartment gets a lot of natural light in the afternoon.'
    },
    {
      icon: '📍', category: 'realty', term: 'surroundings', fr: 'alentours / environs',
      definition: 'The area around a place.',
      example: 'I would like to work in Amsterdam or its surroundings.'
    },
    {
      icon: '🚋', category: 'realty', term: 'transport links', fr: 'liaisons de transport',
      definition: 'Connections to public transport such as tram, metro, train, or bus.',
      example: 'The transport links are excellent, with a tram stop nearby.'
    },
    {
      icon: '📐', category: 'realty', term: 'surface area', fr: 'surface',
      definition: 'The size of a property, usually measured in square metres.',
      example: 'The surface area is 82 square metres.'
    },
    {
      icon: '🤝', category: 'client', term: 'client needs analysis', fr: 'analyse des besoins du client',
      definition: 'Questions used to understand what a client wants and needs.',
      example: 'A good client needs analysis helps match the buyer with the right property.'
    },
    {
      icon: '📅', category: 'client', term: 'to arrange a viewing', fr: 'organiser une visite',
      definition: 'To schedule a time for a client to visit a property.',
      example: 'Would you like me to arrange a viewing for next Tuesday?'
    },
    {
      icon: '🚪', category: 'client', term: 'property viewing', fr: 'visite d’un bien',
      definition: 'An appointment where a client visits a property before deciding.',
      example: 'During the property viewing, I can explain the main features.'
    },
    {
      icon: '🗣️', category: 'client', term: 'to communicate fluently', fr: 'communiquer avec aisance',
      definition: 'To speak smoothly and naturally without long pauses.',
      example: 'My goal is to communicate fluently with clients and colleagues.'
    },
    {
      icon: '☎️', category: 'client', term: 'to pick up the phone', fr: 'décrocher le téléphone',
      definition: 'To answer a phone call.',
      example: 'I want to feel confident enough to pick up the phone in English.'
    },
    {
      icon: '🔁', category: 'client', term: 'to ask for clarification', fr: 'demander une clarification',
      definition: 'To ask someone to explain or repeat something more clearly.',
      example: 'If I do not understand an accent, I can ask for clarification politely.'
    },
    {
      icon: '📄', category: 'legal', term: 'property document', fr: 'document immobilier',
      definition: 'A written document connected to a property transaction or rental.',
      example: 'I need to understand property documents in English.'
    },
    {
      icon: '🏗️', category: 'legal', term: 'property developer', fr: 'promoteur immobilier',
      definition: 'A company or person who builds or renovates properties to sell or rent.',
      example: 'I worked with property developers for many years.'
    },
    {
      icon: '📑', category: 'legal', term: 'sale contract', fr: 'contrat de vente',
      definition: 'A legal agreement for the sale of a property.',
      example: 'The sale contract must include the price and key conditions.'
    },
    {
      icon: '🏗️', category: 'legal', term: 'off-plan sale', fr: 'vente en état futur d’achèvement / VEFA',
      definition: 'A sale where the buyer purchases a property before construction is finished.',
      example: 'In France, I worked with off-plan sales and property developers.'
    },
    {
      icon: '🧾', category: 'legal', term: 'client file', fr: 'dossier client',
      definition: 'All the documents and information related to a client.',
      example: 'I managed client files and followed each transaction carefully.'
    },
    {
      icon: '⚖️', category: 'legal', term: 'real estate lawyer', fr: 'juriste immobilier / avocat en droit immobilier',
      definition: 'A legal professional who specialises in property law.',
      example: 'I am also considering a position as a real estate lawyer.'
    },
    {
      icon: '🏛️', category: 'legal', term: 'notary', fr: 'notaire',
      definition: 'A legal professional who authenticates documents and oversees certain transactions.',
      example: 'In some transactions, the notary checks the official documents.'
    },
    {
      icon: '💬', category: 'client', term: 'to negotiate', fr: 'négocier',
      definition: 'To discuss terms such as price or conditions in order to reach an agreement.',
      example: 'I need to negotiate professionally with buyers and sellers.'
    },
    {
      icon: '🏷️', category: 'numbers', term: 'asking price', fr: 'prix demandé / prix affiché',
      definition: 'The price requested by the seller for a property.',
      example: 'The asking price is six hundred and twenty-five thousand euros.'
    },
    {
      icon: '💶', category: 'numbers', term: 'rental yield', fr: 'rendement locatif',
      definition: 'The income from rent compared with the cost or value of the property.',
      example: 'The rental yield could be attractive for an investor.'
    },
    {
      icon: '📈', category: 'numbers', term: 'return on investment', fr: 'retour sur investissement',
      definition: 'The profit or benefit received from an investment compared with its cost.',
      example: 'Investors often ask about the return on investment.'
    },
    {
      icon: '🧮', category: 'numbers', term: 'profitability', fr: 'rentabilité',
      definition: 'The ability of an investment or activity to make a profit.',
      example: 'I want to explain the profitability of a property clearly.'
    },
    {
      icon: '📞', category: 'numbers', term: 'phone number', fr: 'numéro de téléphone',
      definition: 'The number used to call a person or company.',
      example: 'Could you repeat your phone number more slowly, please?'
    },
    {
      icon: '🏙️', category: 'numbers', term: 'address', fr: 'adresse',
      definition: 'The exact location of a house, apartment, office, or company.',
      example: 'Let me check the address: 24 Keizersgracht, Amsterdam.'
    }
  ];

  const quizData = {
    intro: [
      {
        q: 'Choose the most natural sentence.',
        choices: ['I am interested by beautiful houses.', 'I am interested in beautiful houses.', 'I have interested in beautiful houses.'],
        answer: 1,
        explain: 'In English, we say “interested in”, not “interested by”.'
      },
      {
        q: 'Choose the best professional sentence.',
        choices: ['I chosed to study law.', 'I chose to study law.', 'I have chose to study law.'],
        answer: 1,
        explain: 'The past simple of “choose” is “chose”.'
      },
      {
        q: 'Choose the most precise sentence for your project.',
        choices: ['I want to work in a real estate agency in the Netherlands.', 'I want work in agency at Netherlands.', 'I want working in the realty agency on Netherlands.'],
        answer: 0,
        explain: 'Use “want to + verb” and “in the Netherlands”.'
      }
    ],
    grammar: [
      {
        q: 'Which sentence correctly explains your experience?',
        choices: ['I have worked in real estate for twenty-four years.', 'I worked in real estate since twenty-four years.', 'I work in real estate during twenty-four years.'],
        answer: 0,
        explain: 'Use present perfect + for + duration: “I have worked… for twenty-four years.”'
      },
      {
        q: 'Which sentence correctly uses “ago”?',
        choices: ['I stopped it for one year ago.', 'I stopped one year ago.', 'I have stopped during one year ago.'],
        answer: 1,
        explain: 'Use past simple + time + ago: “I stopped one year ago.”'
      },
      {
        q: 'Which question is correct?',
        choices: ['What kind of property are you looking for?', 'What kind property you are looking?', 'What property are looking you for?'],
        answer: 0,
        explain: 'Question word + auxiliary + subject + verb: “What kind of property are you looking for?”'
      },
      {
        q: 'Which sentence sounds professional?',
        choices: ['I haven’t any contacts in Amsterdam.', 'I don’t have any contacts in Amsterdam yet.', 'I am not have contacts in Amsterdam.'],
        answer: 1,
        explain: 'For possession in modern English, use “I don’t have…”'
      }
    ],
    upgrade: [
      {
        q: 'Original idea: “J’ai une double expérience juridique et commerciale.”',
        choices: ['I have a dual legal and commercial background.', 'I have a double juridical and commercial experience.', 'I am with two experiences legal and commercial.'],
        answer: 0,
        explain: '“Legal background” is more natural than “juridical experience” in this context.'
      },
      {
        q: 'Original idea: “Je cherche un poste aux Pays-Bas.”',
        choices: ['I am looking a job in the Netherlands.', 'I am looking for a position in the Netherlands.', 'I search a work at Netherlands.'],
        answer: 1,
        explain: 'Use “look for” and “a position” for professional English.'
      },
      {
        q: 'Original idea: “Je voudrais gérer une visite pour une vente ou une location.”',
        choices: ['I would like to manage a property viewing for a sale or a rental.', 'I would like to manage a visit for a sale or rental house.', 'I want to do a visit about sale and rent.'],
        answer: 0,
        explain: '“Property viewing” is the professional phrase for a real estate visit.'
      },
      {
        q: 'Original idea: “Je veux m’entraîner à comprendre les numéros et les adresses.”',
        choices: ['I want to train me to understand numbers and addresses.', 'I want to practise understanding phone numbers and addresses.', 'I want to exercise myself for phone numbers and addresses.'],
        answer: 1,
        explain: 'Use “practise + -ing” in British English: “practise understanding…”'
      }
    ],
    miniMock: [
      {
        q: 'A client asks: “What is the asking price?” What does this mean?',
        choices: ['The size of the property', 'The price requested by the seller', 'The number of bedrooms'],
        answer: 1,
        explain: 'The asking price is the seller’s requested price.'
      },
      {
        q: 'Choose the best sentence for a CLOE introduction.',
        choices: ['I have worked with property developers for many years.', 'I work during property developers since many years.', 'I worked with promoters during many years and now.'],
        answer: 0,
        explain: 'Use present perfect for experience connected to now.'
      },
      {
        q: 'You do not understand a client’s address. What can you say?',
        choices: ['Repeat.', 'Could you repeat the address more slowly, please?', 'You speak bad.'],
        answer: 1,
        explain: 'This is polite, clear, and professional.'
      },
      {
        q: 'Which phrase is best for presenting a property?',
        choices: ['It is composed by two bedrooms.', 'It has two bedrooms and a bright living room.', 'There are two bedrooms into the apartment.'],
        answer: 1,
        explain: '“It has…” is simple, correct, and natural.'
      },
      {
        q: 'Which term means “vente en état futur d’achèvement”?',
        choices: ['off-plan sale', 'asking price', 'property viewing'],
        answer: 0,
        explain: '“Off-plan sale” describes a property purchased before completion.'
      }
    ]
  };

  const builderSentences = [
    ['I', 'have', 'worked', 'in', 'real', 'estate', 'for', 'twenty-four', 'years.'],
    ['I', 'am', 'looking', 'for', 'a', 'position', 'in', 'Amsterdam.'],
    ['My', 'legal', 'background', 'helps', 'me', 'understand', 'property', 'documents.'],
    ['Could', 'you', 'repeat', 'the', 'address', 'more', 'slowly,', 'please?']
  ];

  const powerPhrases = [
    'I have a legal and commercial background.',
    'I have worked in real estate for twenty-four years.',
    'I worked closely with property developers.',
    'I can explain property documents and client files.',
    'I would like to work with international clients.',
    'I need to improve my fluency on the phone.',
    'I want to present properties clearly and professionally.',
    'My goal is to use precise real estate vocabulary.'
  ];

  const propertySnippets = {
    location: 'This bright two-bedroom apartment is located in Amsterdam South, close to tram links and local shops. ',
    features: 'It offers 82 square metres, two bedrooms, a balcony, a renovated kitchen and excellent natural light. ',
    clientFit: 'It would be ideal for a couple, a small family, or an international buyer looking for a comfortable home in a convenient neighbourhood. ',
    nextStep: 'If you are interested, I would be happy to arrange a viewing and answer any questions about the asking price or the area. '
  };

  const oralQuestions = [
    {
      q: 'Can you introduce yourself and explain your professional background?',
      model: 'Of course. I studied law and I have worked in real estate for twenty-four years. I have a strong legal and commercial background, especially in sales and property development. I would now like to move to the Netherlands and use my experience in an international real estate agency.'
    },
    {
      q: 'Why would you like to work in the Netherlands?',
      model: 'I would like to move to the Netherlands for personal and professional reasons. Amsterdam is an international city, and I think my real estate experience could be useful there. I need English to communicate with clients, colleagues, notaries, lawyers and other professionals.'
    },
    {
      q: 'What are your strengths as a real estate professional?',
      model: 'My main strengths are my experience, my legal knowledge and my ability to understand clients’ needs. I always listen carefully to clients before speaking, so that I can better understand their expectations and offer appropriate advice. I have worked in sales and with property developers, so I understand both the commercial and legal sides of real estate transactions.'
    },
    {
      q: 'What is difficult for you in English at the moment?',
      model: 'The most difficult part for me is speaking spontaneously, especially on the phone. I sometimes translate from French into English, and I need more vocabulary. I also want to practise understanding numbers, addresses and different accents.'
    },
    {
      q: 'How would you present a property to an international client?',
      model: 'First, I would explain the location and the type of property. Then I would describe the surface area, the layout, the main features and the asking price. I would also ask questions to understand the client’s needs and suggest a viewing if the property matches their project.'
    },
    {
      q: 'What makes communication important in real estate?',
      model: 'Communication is essential because clients need clear information before making an important decision. A real estate professional must explain the property, the price, the documents and the next steps clearly. Good communication also creates trust.'
    }
  ];

  const roleplays = [
    {
      title: 'First contact with an international buyer',
      situation: 'A client calls the agency. They are looking for a two-bedroom apartment in Amsterdam with good transport links. Ask questions and propose the next step.',
      help: ['What type of property are you looking for?', 'What is your budget?', 'Which neighbourhood are you interested in?', 'Would you like me to arrange a viewing?']
    },
    {
      title: 'Explaining your career to an agency manager',
      situation: 'You are in an interview with a real estate agency in Amsterdam. Explain your legal and commercial background and why it is useful for the agency.',
      help: ['I studied law.', 'I have worked in real estate for twenty-four years.', 'I worked with property developers.', 'I can support clients with both legal and commercial questions.']
    },
    {
      title: 'Presenting a property during a viewing',
      situation: 'You are showing a bright apartment to a client. Present the property, highlight advantages, and ask if the client has questions.',
      help: ['Let me show you the living room.', 'The apartment gets a lot of natural light.', 'The main advantage is the location.', 'Do you have any questions so far?']
    },
    {
      title: 'Clarifying numbers on the phone',
      situation: 'A client gives you a phone number, address, and budget very quickly. Ask for repetition and confirm the information politely.',
      help: ['Could you repeat that more slowly, please?', 'Could you spell the street name?', 'Let me check I understood correctly.', 'So your budget is six hundred thousand euros, correct?']
    }
  ];

  function loadScores() {
    try {
      const saved = JSON.parse(localStorage.getItem('isabelleRealtyScores') || '{}');
      if (saved && typeof saved === 'object') {
        Object.assign(state.scores, saved.scores || {});
        state.answered = new Set(saved.answered || []);
      }
    } catch (err) {
      console.warn('Could not load scores', err);
    }
  }

  function saveScores() {
    localStorage.setItem('isabelleRealtyScores', JSON.stringify({
      scores: state.scores,
      answered: Array.from(state.answered)
    }));
  }

  function addScore(key, amount, id) {
    if (state.answered.has(id)) return;
    state.answered.add(id);
    state.scores[key] = (state.scores[key] || 0) + amount;
    saveScores();
    updateDashboard();
  }

  function updateDashboard() {
    const total = Object.values(state.scores).reduce((a, b) => a + b, 0);
    const possible = 46;
    $('#totalScore').textContent = total;
    $('#totalPossible').textContent = possible;
    $('#vocabScore').textContent = state.scores.vocab || 0;
    $('#grammarScore').textContent = state.scores.grammar || 0;
    $('#careerScore').textContent = state.scores.career || 0;
    $('#oralScore').textContent = state.scores.oral || 0;
    $('#progressFill').style.width = `${Math.min(100, Math.round((total / possible) * 100))}%`;
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
    }[ch]));
  }

  function setVoiceStatus(text) {
    const status = $('#voiceStatus');
    if (status) status.textContent = text;
  }

  function loadVoices() {
    if (!('speechSynthesis' in window)) {
      setVoiceStatus('Speech synthesis is not available in this browser.');
      return;
    }
    state.voices = window.speechSynthesis.getVoices();
    const matching = state.voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(state.accent.toLowerCase()));
    if (matching.length) {
      setVoiceStatus(`Ready: ${state.accent} voice available (${matching[0].name}).`);
    } else {
      setVoiceStatus(`Ready: ${state.accent} selected. Device may use its closest English voice.`);
    }
  }

  function getVoice() {
    const voices = state.voices.length ? state.voices : window.speechSynthesis.getVoices();
    return voices.find(v => v.lang === state.accent) ||
      voices.find(v => v.lang && v.lang.toLowerCase().startsWith(state.accent.toLowerCase())) ||
      voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en')) ||
      null;
  }

  function speak(text) {
    if (!text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').trim());
    utterance.lang = state.accent;
    const voice = getVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 0.92;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function renderVocab(filter = 'all') {
    const grid = $('#vocabGrid');
    const items = filter === 'all' ? vocab : vocab.filter(item => item.category === filter);
    grid.innerHTML = items.map((item, index) => `
      <article class="vocab-card" data-category="${item.category}">
        <div class="vocab-top">
          <div>
            <span class="category-pill">${escapeHTML(item.category)}</span>
            <h3>${escapeHTML(item.term)}</h3>
            <div class="translation">FR: ${escapeHTML(item.fr)}</div>
          </div>
          <div class="vocab-icon" aria-hidden="true">${item.icon}</div>
        </div>
        <p class="definition"><strong>Definition:</strong> ${escapeHTML(item.definition)}</p>
        <p class="example" id="vocabExample-${index}"><strong>Example:</strong> ${escapeHTML(item.example)}</p>
        <button class="secondary-btn" data-speak-text="${escapeHTML(item.example)}">Listen to example</button>
      </article>
    `).join('');
  }

  function renderQuiz(containerId, feedbackId, items, scoreKey, prefix) {
    const container = $(containerId);
    container.innerHTML = items.map((item, idx) => `
      <div class="quiz-item" data-quiz-id="${prefix}-${idx}">
        <p>${idx + 1}. ${escapeHTML(item.q)}</p>
        <div class="choice-grid">
          ${item.choices.map((choice, cidx) => `<button class="choice-btn" data-choice="${cidx}" data-answer="${item.answer}" data-score-key="${scoreKey}" data-quiz-id="${prefix}-${idx}" data-explain="${escapeHTML(item.explain)}">${escapeHTML(choice)}</button>`).join('')}
        </div>
      </div>
    `).join('');

    container.addEventListener('click', event => {
      const btn = event.target.closest('.choice-btn');
      if (!btn || btn.disabled) return;
      const quizId = btn.dataset.quizId;
      const parent = btn.closest('.quiz-item');
      const buttons = $$('.choice-btn', parent);
      const selected = Number(btn.dataset.choice);
      const answer = Number(btn.dataset.answer);
      buttons.forEach(button => {
        button.disabled = true;
        if (Number(button.dataset.choice) === answer) button.classList.add('correct');
      });
      if (selected === answer) {
        btn.classList.add('correct');
        addScore(btn.dataset.scoreKey, 1, quizId);
        $(feedbackId).textContent = `Correct! ${btn.dataset.explain}`;
      } else {
        btn.classList.add('wrong');
        $(feedbackId).textContent = `Not quite. ${btn.dataset.explain}`;
      }
    }, { once: false });
  }

  function makeVocabChallenge() {
    const sample = [...vocab].sort(() => Math.random() - 0.5).slice(0, 6);
    const items = sample.map((item, idx) => {
      const distractors = vocab
        .filter(v => v.term !== item.term)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map(v => v.term);
      const choices = [...distractors, item.term].sort(() => Math.random() - 0.5);
      return {
        q: `FR: ${item.fr}`,
        choices,
        answer: choices.indexOf(item.term),
        explain: `${item.term}: ${item.definition}`
      };
    });
    $('#vocabChallenge').replaceWith($('#vocabChallenge').cloneNode(false));
    $('#vocabChallengeFeedback').textContent = '';
    renderQuiz('#vocabChallenge', '#vocabChallengeFeedback', items, 'vocab', `vocab-${Date.now()}`);
  }

  function renderPowerPhrases() {
    $('#powerPhrases').innerHTML = powerPhrases.map((phrase, idx) => `
      <div class="phrase">
        <span id="powerPhrase-${idx}">${escapeHTML(phrase)}</span>
        <button class="secondary-btn" data-speak-target="powerPhrase-${idx}">Listen</button>
      </div>
    `).join('');
  }

  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function renderBuilder() {
    const sentence = builderSentences[state.builderIndex];
    state.builderAnswer = [];
    $('#builderTarget').textContent = `Sentence ${state.builderIndex + 1}/${builderSentences.length}`;
    $('#wordBank').innerHTML = shuffle(sentence).map((word, idx) => `<button class="word-chip" data-word="${escapeHTML(word)}" data-idx="${idx}">${escapeHTML(word)}</button>`).join('');
    $('#answerBank').innerHTML = '';
    $('#builderFeedback').textContent = '';
  }

  function updateBuilderAnswer() {
    $('#answerBank').innerHTML = state.builderAnswer.map((word, idx) => `<button class="answer-chip" data-answer-idx="${idx}">${escapeHTML(word)}</button>`).join('');
  }

  function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateTimer() {
    $('#timerDisplay').textContent = formatTime(state.timer.remaining);
  }

  function newOralQuestion() {
    state.currentQuestion = oralQuestions[Math.floor(Math.random() * oralQuestions.length)];
    $('#oralQuestion').textContent = state.currentQuestion.q;
    $('#modelAnswer').classList.add('hidden');
    $('#modelAnswer').textContent = state.currentQuestion.model;
  }

  function newRoleplay() {
    state.currentRoleplay = roleplays[Math.floor(Math.random() * roleplays.length)];
    $('#roleplayCard').innerHTML = `<h4>${escapeHTML(state.currentRoleplay.title)}</h4><p>${escapeHTML(state.currentRoleplay.situation)}</p>`;
    $('#roleplayHelp').classList.add('hidden');
    $('#roleplayHelp').innerHTML = '';
  }

  function updateWritingStats() {
    const text = $('#writingBox').value.trim();
    const words = text ? text.split(/\s+/).filter(Boolean) : [];
    $('#wordCount').textContent = `${words.length} word${words.length === 1 ? '' : 's'}`;
    const lower = text.toLowerCase();
    const terms = vocab.filter(v => lower.includes(v.term.toLowerCase())).map(v => v.term);
    $('#realtyWordCount').textContent = `${new Set(terms).size} real estate term${new Set(terms).size === 1 ? '' : 's'}`;
  }

  function initEvents() {
    document.addEventListener('click', event => {
      const scrollBtn = event.target.closest('[data-scroll]');
      if (scrollBtn) {
        const target = $(scrollBtn.dataset.scroll);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      const speakTarget = event.target.closest('[data-speak-target]');
      if (speakTarget) {
        const target = document.getElementById(speakTarget.dataset.speakTarget);
        if (target) speak(target.textContent);
      }

      const speakText = event.target.closest('[data-speak-text]');
      if (speakText) speak(speakText.dataset.speakText);

      const copyTarget = event.target.closest('[data-copy-target]');
      if (copyTarget) {
        const target = document.getElementById(copyTarget.dataset.copyTarget);
        if (target && navigator.clipboard) navigator.clipboard.writeText(target.textContent.trim());
      }
    });

    $$('[data-accent]').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('[data-accent]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.accent = btn.dataset.accent;
        loadVoices();
      });
    });

    $$('.filter').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderVocab(btn.dataset.filter);
      });
    });

    $('#newVocabChallenge').addEventListener('click', makeVocabChallenge);

    $('#resetAllBtn').addEventListener('click', () => {
      if (!confirm('Reset all scores for this lesson?')) return;
      state.scores = { vocab: 0, grammar: 0, career: 0, oral: 0 };
      state.answered.clear();
      saveScores();
      updateDashboard();
      location.reload();
    });

    $('#wordBank').addEventListener('click', event => {
      const chip = event.target.closest('.word-chip');
      if (!chip) return;
      state.builderAnswer.push(chip.dataset.word);
      chip.remove();
      updateBuilderAnswer();
    });

    $('#answerBank').addEventListener('click', event => {
      const chip = event.target.closest('.answer-chip');
      if (!chip) return;
      const idx = Number(chip.dataset.answerIdx);
      const [word] = state.builderAnswer.splice(idx, 1);
      const btn = document.createElement('button');
      btn.className = 'word-chip';
      btn.dataset.word = word;
      btn.textContent = word;
      $('#wordBank').appendChild(btn);
      updateBuilderAnswer();
    });

    $('#checkBuilder').addEventListener('click', () => {
      const expected = builderSentences[state.builderIndex].join(' ');
      const actual = state.builderAnswer.join(' ');
      if (actual === expected) {
        $('#builderFeedback').textContent = 'Excellent sentence!';
        addScore('grammar', 1, `builder-${state.builderIndex}`);
        speak(expected);
      } else {
        $('#builderFeedback').textContent = `Almost. Correct sentence: ${expected}`;
      }
    });

    $('#undoBuilder').addEventListener('click', () => {
      const word = state.builderAnswer.pop();
      if (!word) return;
      const btn = document.createElement('button');
      btn.className = 'word-chip';
      btn.dataset.word = word;
      btn.textContent = word;
      $('#wordBank').appendChild(btn);
      updateBuilderAnswer();
    });

    $('#nextBuilder').addEventListener('click', () => {
      state.builderIndex = (state.builderIndex + 1) % builderSentences.length;
      renderBuilder();
    });

    $$('[data-fill-property]').forEach(btn => {
      btn.addEventListener('click', () => {
        $('#propertyDraft').value += propertySnippets[btn.dataset.fillProperty] || '';
        $('#propertyDraft').focus();
      });
    });

    $('#listenPropertyDraft').addEventListener('click', () => speak($('#propertyDraft').value));
    $('#clearPropertyDraft').addEventListener('click', () => { $('#propertyDraft').value = ''; });

    $('#startTimer').addEventListener('click', () => {
      if (state.timer.id) return;
      state.timer.id = setInterval(() => {
        state.timer.remaining -= 1;
        updateTimer();
        if (state.timer.remaining <= 0) {
          clearInterval(state.timer.id);
          state.timer.id = null;
          speak('Time is up. Well done.');
        }
      }, 1000);
    });

    $('#pauseTimer').addEventListener('click', () => {
      clearInterval(state.timer.id);
      state.timer.id = null;
    });

    $('#resetTimer').addEventListener('click', () => {
      clearInterval(state.timer.id);
      state.timer.id = null;
      state.timer.remaining = state.timer.total;
      updateTimer();
    });

    $('#newQuestion').addEventListener('click', newOralQuestion);
    $('#showModelAnswer').addEventListener('click', () => {
      if (!state.currentQuestion) newOralQuestion();
      $('#modelAnswer').classList.toggle('hidden');
    });
    $('#listenModelAnswer').addEventListener('click', () => {
      if (!state.currentQuestion) newOralQuestion();
      speak(state.currentQuestion.model);
    });
    $('#markOralPractice').addEventListener('click', () => {
      if (!state.currentQuestion) return;
      addScore('oral', 1, `oral-${state.currentQuestion.q}`);
      $('#modelAnswer').classList.remove('hidden');
      $('#modelAnswer').textContent = 'Practice logged. Now try the same answer again with fewer pauses and one extra real estate word.';
    });

    $('#newRoleplay').addEventListener('click', newRoleplay);
    $('#showRoleplayHelp').addEventListener('click', () => {
      if (!state.currentRoleplay) newRoleplay();
      $('#roleplayHelp').classList.toggle('hidden');
      $('#roleplayHelp').innerHTML = `<strong>Useful phrases:</strong><ul>${state.currentRoleplay.help.map(h => `<li>${escapeHTML(h)}</li>`).join('')}</ul>`;
      addScore('oral', 1, `roleplay-${state.currentRoleplay.title}`);
    });

    $('#writingBox').addEventListener('input', updateWritingStats);
    $('#checkWriting').addEventListener('click', () => {
      const text = $('#writingBox').value.trim();
      const lower = text.toLowerCase();
      const words = text ? text.split(/\s+/).filter(Boolean) : [];
      const realtyTerms = vocab.filter(v => lower.includes(v.term.toLowerCase()));
      const checks = [];
      checks.push(words.length >= 130 && words.length <= 180 ? '✅ Word count is in the target range.' : '⚠️ Aim for 130–180 words.');
      checks.push(/have worked|has worked|have been|has been/i.test(text) ? '✅ You used a present perfect structure.' : '⚠️ Add present perfect for experience: “I have worked…”');
      checks.push(/studied|worked|decided|chose|moved|started/i.test(text) ? '✅ You used past simple for finished events.' : '⚠️ Add past simple for studies or finished events: “I studied law.”');
      checks.push(realtyTerms.length >= 6 ? '✅ You included 6+ real estate terms.' : `⚠️ Include more real estate terms. Found: ${new Set(realtyTerms.map(t => t.term)).size}.`);
      checks.push(/netherlands|amsterdam/i.test(text) ? '✅ You mentioned the Netherlands/Amsterdam project.' : '⚠️ Mention the Netherlands or Amsterdam project.');
      $('#writingFeedback').innerHTML = checks.join('<br>');
      if (checks.every(c => c.startsWith('✅'))) addScore('career', 3, 'writing-checklist');
    });
    $('#listenWriting').addEventListener('click', () => speak($('#writingBox').value));
    $('#copyWriting').addEventListener('click', () => {
      if (navigator.clipboard) navigator.clipboard.writeText($('#writingBox').value);
      $('#writingFeedback').textContent = 'Text copied.';
    });
  }

  function init() {
    loadScores();
    renderVocab();
    renderQuiz('#introQuiz', '#introQuizFeedback', quizData.intro, 'grammar', 'intro');
    renderQuiz('#grammarChallenge', '#grammarFeedback', quizData.grammar, 'grammar', 'grammar');
    renderQuiz('#upgradeChallenge', '#upgradeFeedback', quizData.upgrade, 'career', 'upgrade');
    renderQuiz('#miniMock', '#miniMockFeedback', quizData.miniMock, 'grammar', 'mini');
    makeVocabChallenge();
    renderPowerPhrases();
    renderBuilder();
    newOralQuestion();
    newRoleplay();
    updateTimer();
    updateWritingStats();
    updateDashboard();
    initEvents();
    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
