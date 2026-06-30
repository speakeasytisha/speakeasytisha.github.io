(() => {
  const state = { accent: 'en-GB', selectedPhrase: null, draggedPhrase: null };
  const toast = document.getElementById('toast');
  let toastTimer;

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  };

  const speak = (text) => {
    if (!('speechSynthesis' in window)) {
      showToast('Audio is not available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.accent;
    utterance.rate = .88;
    utterance.pitch = 1;
    const selectVoice = () => {
      const voices = speechSynthesis.getVoices();
      const exact = voices.find(v => v.lang === state.accent);
      const regional = voices.find(v => v.lang.toLowerCase().startsWith(state.accent.slice(0, 2).toLowerCase()));
      if (exact || regional) utterance.voice = exact || regional;
      speechSynthesis.speak(utterance);
    };
    if (speechSynthesis.getVoices().length) selectVoice();
    else speechSynthesis.onvoiceschanged = selectVoice;
  };

  document.querySelectorAll('[data-speak]').forEach(button => {
    button.addEventListener('click', () => speak(button.dataset.speak));
  });

  document.querySelectorAll('.accent-button').forEach(button => {
    button.addEventListener('click', () => {
      state.accent = button.dataset.accent;
      document.querySelectorAll('.accent-button').forEach(b => b.classList.toggle('active', b === button));
      document.getElementById('accent-status').textContent = `${button.textContent.trim()} selected`;
      showToast(`${button.textContent.trim()} will be used for listening.`);
    });
  });

  const frenchHelpButton = document.getElementById('fr-help-toggle');
  frenchHelpButton.addEventListener('click', () => {
    const isOn = !document.body.classList.contains('show-fr-help');
    document.body.classList.toggle('show-fr-help', isOn);
    frenchHelpButton.setAttribute('aria-pressed', String(isOn));
    frenchHelpButton.textContent = isOn ? '🇫🇷 Masquer l’aide en français' : '🇫🇷 Afficher l’aide en français';
    showToast(isOn ? 'French help is now visible.' : 'French help is now hidden.');
  });

  const textBits = {
    study: {
      several: {
        fr: 'Je prends des cours d’anglais depuis plusieurs années.',
        a2: 'I have taken English lessons for several years.',
        b1: 'I have been taking English lessons for several years because I enjoy practising the language.',
        b2: 'Having studied English for several years for pleasure, I would now like to turn what I know into more natural, confident communication.'
      },
      returning: {
        fr: 'Je reprends l’anglais après une pause et je souhaite retrouver progressivement confiance.',
        a2: 'I am getting back into English after a break.',
        b1: 'I am getting back into English after a break, and I would like to regain confidence step by step.',
        b2: 'After a break from regular study, I would like to get back into English and use it more naturally in conversation.'
      },
      independent: {
        fr: 'Je pratique souvent l’anglais de manière autonome, mais j’aimerais avoir davantage d’occasions de le parler.',
        a2: 'I often practise English on my own.',
        b1: 'I often practise English independently, and I would now like more opportunities to use it in conversation.',
        b2: 'Although I already practise independently, I would now like structured conversation and feedback to make my English more fluid.'
      }
    },
    motivation: {
      pleasure: {
        fr: 'J’apprends l’anglais avant tout par plaisir.',
        a2: 'I learn English because I enjoy it.',
        b1: 'I learn English mainly for pleasure because I enjoy discovering new words and communicating in another language.',
        b2: 'Personally, I see English not only as a useful skill, but also as a source of pleasure that opens the door to new ideas, cultures and conversations.'
      },
      travel: {
        fr: 'Je souhaite me sentir plus en confiance lorsque je voyage.',
        a2: 'I want to feel more confident when I travel.',
        b1: 'I would like to feel more confident when I travel and understand people more easily in everyday situations.',
        b2: 'My goal is to travel with greater independence, knowing that I can understand, ask questions and respond naturally when situations change.'
      },
      both: {
        fr: 'J’aime l’anglais et j’aimerais voyager avec plus d’aisance.',
        a2: 'I enjoy English and I want to travel more easily.',
        b1: 'I enjoy learning English, and I also want to use it more confidently when I travel abroad.',
        b2: 'Because I enjoy English as much as I enjoy travelling, I would like the language to become a natural part of every journey.'
      }
    },
    travel: {
      husband: {
        fr: 'À l’avenir, je prévois de voyager davantage avec mon mari.',
        a2: 'In the future, I plan to travel more with my husband.',
        b1: 'With more time ahead of us, I would like to travel more with my husband and enjoy each trip without worrying about my English.',
        b2: 'As retirement will give us more freedom, I would like to make the most of our future trips and feel at ease speaking English wherever we go.'
      },
      europe: {
        fr: 'J’aimerais profiter de séjours plus courts à l’étranger, avec davantage de sérénité en anglais.',
        a2: 'I would like to enjoy shorter trips abroad.',
        b1: 'I would like to enjoy shorter trips abroad and feel more comfortable speaking English during the journey.',
        b2: 'I would like to make even short trips abroad richer and more relaxed by feeling able to communicate with ease from arrival to departure.'
      },
      culture: {
        fr: 'J’aimerais découvrir de nouveaux lieux et de nouvelles cultures, tout en me sentant plus à l’aise dans les conversations du quotidien.',
        a2: 'I would like to discover new places and cultures.',
        b1: 'I would like to discover new places and cultures while feeling more confident in everyday conversations.',
        b2: 'I would like to discover new places and cultures more deeply by being able to connect with people, ask questions and understand local recommendations.'
      }
    },
    goal: {
      fluency: {
        fr: 'Je souhaite parler avec plus de fluidité et trouver mes mots plus rapidement.',
        a2: 'I want to speak more easily.',
        b1: 'My next goal is to speak more fluently and find my words more quickly.',
        b2: 'Above all, I want to speak with greater fluency: connecting my ideas naturally instead of translating every sentence in my head.'
      },
      listening: {
        fr: 'Je souhaite comprendre les personnes plus facilement, notamment lorsqu’elles parlent à une vitesse naturelle.',
        a2: 'I want to understand people better.',
        b1: 'My next goal is to understand people more easily, especially when they speak at a natural speed.',
        b2: 'I would like to develop stronger listening confidence, so that natural speech feels less intimidating and more enjoyable.'
      },
      situations: {
        fr: 'Je souhaite gérer les situations de voyage avec calme, même lorsqu’un imprévu survient.',
        a2: 'I want to feel calm in travel situations.',
        b1: 'My next goal is to handle travel situations calmly, even when something does not go exactly as planned.',
        b2: 'I want to feel capable of handling the unexpected with calm, clear English — whether I need information, help or a solution.'
      }
    }
  };

  const buildStory = () => {
    const form = document.getElementById('story-builder');
    const values = Object.fromEntries(new FormData(form));
    const levels = [
      { key: 'a2', label: 'A2 • Clear & simple', caption: 'Strong short sentences, one idea at a time.' },
      { key: 'b1', label: 'B1 • Connected & confident', caption: 'Reasons, links and more natural detail.' },
      { key: 'b2', label: 'B2 • Flexible & fluent', caption: 'Nuance, rhythm and a more personal voice.' }
    ];
    const frenchParagraph = [
      textBits.study[values.study].fr,
      textBits.motivation[values.motivation].fr,
      textBits.travel[values.travel].fr,
      textBits.goal[values.goal].fr
    ].join(' ');
    const output = document.getElementById('level-output');
    output.innerHTML = levels.map(level => {
      const paragraph = [
        textBits.study[values.study][level.key],
        textBits.motivation[values.motivation][level.key],
        textBits.travel[values.travel][level.key],
        textBits.goal[values.goal][level.key]
      ].join(' ');
      return `<article class="level-card"><div class="level-header"><div><div class="level-badge">${level.label}</div><div class="level-heading">${level.caption}</div></div><button class="level-listen" type="button" data-story-speak="${encodeURIComponent(paragraph)}">◖))) Listen</button></div><p>${paragraph}</p><p class="fr-story fr-help">🇫🇷 ${frenchParagraph}</p></article>`;
    }).join('');
    output.querySelectorAll('[data-story-speak]').forEach(btn => btn.addEventListener('click', () => speak(decodeURIComponent(btn.dataset.storySpeak))));
  };
  document.getElementById('story-builder').addEventListener('submit', (event) => {
    event.preventDefault();
    buildStory();
    showToast('Your three-level story is ready.');
  });
  buildStory();

  const vocabulary = {
    hotel: [
      { word: 'hotel booking / hotel reservation', fr: 'réservation d’hôtel', definition: 'An arrangement for a room at a hotel.', frDefinition: 'Une réservation pour une chambre d’hôtel. “Booking” est très fréquent au Royaume-Uni ; “reservation” est très courant aux États-Unis.', example: 'We have a hotel reservation under the name Balidas.', frExample: 'Nous avons une réservation d’hôtel au nom de Balidas.' },
      { word: 'breakfast is served', fr: 'le petit-déjeuner est servi', definition: 'A polite way to ask or state when breakfast is available.', frDefinition: 'Une formulation polie pour demander ou indiquer l’horaire du petit-déjeuner.', example: 'What time is breakfast served?', frExample: 'À quelle heure le petit-déjeuner est-il servi ?' },
      { word: 'quiet room', fr: 'chambre calme', definition: 'A room away from noise, such as traffic, lifts or busy areas.', frDefinition: 'Une chambre éloignée du bruit : circulation, ascenseurs ou zones passantes.', example: 'Could we have a quiet room, please?', frExample: 'Pourrions-nous avoir une chambre calme, s’il vous plaît ?' }
    ],
    restaurant: [
      { word: 'table booking / table reservation', fr: 'réservation de table', definition: 'An arrangement for a table at a restaurant.', frDefinition: 'Une réservation pour une table au restaurant.', example: 'We have a table booked for two at 8 p.m.', frExample: 'Nous avons une table réservée pour deux personnes à 20 h.' },
      { word: 'the bill', fr: 'l’addition', definition: 'The written total that you pay after eating at a restaurant.', frDefinition: 'Le montant total à payer après un repas au restaurant.', example: 'Could we have the bill, please?', frExample: 'Pourrions-nous avoir l’addition, s’il vous plaît ?' },
      { word: 'dietary requirements', fr: 'contraintes alimentaires', definition: 'Food needs connected with health, allergies or personal choices.', frDefinition: 'Des besoins alimentaires liés à la santé, aux allergies ou à des choix personnels.', example: 'I have dietary requirements. Could you tell me what is in this dish?', frExample: 'J’ai des contraintes alimentaires. Pourriez-vous me dire ce qu’il y a dans ce plat ?' }
    ],
    transport: [
      { word: 'platform', fr: 'quai', definition: 'The place at a station where you get on a train.', frDefinition: 'L’endroit dans une gare où l’on monte dans le train.', example: 'Which platform does the train leave from?', frExample: 'De quel quai part le train ?' },
      { word: 'connection', fr: 'correspondance', definition: 'A second train, plane or bus that continues your journey.', frDefinition: 'Un second train, avion ou bus qui permet de poursuivre son trajet.', example: 'Do we have enough time to catch our connection?', frExample: 'Avons-nous assez de temps pour prendre notre correspondance ?' },
      { word: 'one-way ticket', fr: 'billet aller simple', definition: 'A ticket for travel in one direction only.', frDefinition: 'Un billet valable dans un seul sens.', example: 'I would like two one-way tickets to Oxford, please.', frExample: 'Je voudrais deux billets aller simple pour Oxford, s’il vous plaît.' }
    ],
    conversation: [
      { word: 'Have you been here before?', fr: 'Êtes-vous déjà venu(e) ici ?', definition: 'A friendly question used to begin a conversation about a place.', frDefinition: 'Une question amicale pour commencer une conversation au sujet d’un lieu.', example: 'Have you been here before, or is this your first visit?', frExample: 'Êtes-vous déjà venu(e) ici ou est-ce votre première visite ?' },
      { word: 'We are enjoying it', fr: 'Nous apprécions beaucoup', definition: 'A natural way to say that a current experience is pleasant.', frDefinition: 'Une façon naturelle de dire qu’une expérience en cours est agréable.', example: 'We are enjoying the city very much so far.', frExample: 'Nous apprécions beaucoup la ville jusqu’à présent.' },
      { word: 'local advice', fr: 'conseils locaux', definition: 'Helpful recommendations from someone who knows the area.', frDefinition: 'Des recommandations utiles données par une personne qui connaît bien les environs.', example: 'Do you have any local advice for a lovely walk nearby?', frExample: 'Auriez-vous des conseils locaux pour une belle promenade à proximité ?' }
    ],
    unexpected: [
      { word: 'Could you say that again, please?', fr: 'Pourriez-vous répéter, s’il vous plaît ?', definition: 'A clear, polite way to ask someone to repeat what they have said.', frDefinition: 'Une formule simple, polie et très claire pour demander à quelqu’un de répéter.', example: 'I’m sorry, could you say that again, please?', frExample: 'Je suis désolée, pourriez-vous répéter, s’il vous plaît ?' },
      { word: 'Could you clarify?', fr: 'Pourriez-vous préciser ?', definition: 'A polite way to ask for clearer information.', frDefinition: 'Une façon polie de demander une information plus précise ou plus claire.', example: 'Could you clarify which document you need from us?', frExample: 'Pourriez-vous préciser quel document vous avez besoin que nous fournissions ?' },
      { word: 'alternative', fr: 'solution de remplacement', definition: 'Another option when the original plan is not possible.', frDefinition: 'Une autre possibilité lorsque le plan initial n’est pas possible.', example: 'Is there an alternative train later this evening?', frExample: 'Y a-t-il un autre train plus tard ce soir ?' }
    ]
  };

  const renderVocab = (category) => {
    const grid = document.getElementById('vocab-grid');
    grid.innerHTML = vocabulary[category].map(item => `<article class="vocab-card"><div class="word">${item.word}</div><div class="translation">FR • ${item.fr}</div><p class="definition"><strong>Definition:</strong> ${item.definition}</p><p class="fr-definition fr-help"><strong>FR :</strong> ${item.frDefinition}</p><p class="example">“${item.example}”</p><p class="fr-example fr-help">🇫🇷 ${item.frExample}</p><button type="button" data-vocab-speak="${encodeURIComponent(item.word.replace(' / ', '. ') + '. ' + item.example)}">◖))) Listen</button></article>`).join('');
    grid.querySelectorAll('[data-vocab-speak]').forEach(btn => btn.addEventListener('click', () => speak(decodeURIComponent(btn.dataset.vocabSpeak))));
  };
  const vocabSelect = document.getElementById('vocab-category');
  vocabSelect.addEventListener('change', () => renderVocab(vocabSelect.value));
  renderVocab(vocabSelect.value);

  const setFeedback = (element, english, french, className = 'feedback') => {
    element.className = className;
    element.innerHTML = `<span>${english}</span><span class="fr-help">🇫🇷 ${french}</span>`;
  };

  const qcmOptions = document.getElementById('qcm-options');
  const qcmFeedback = document.getElementById('qcm-feedback');
  qcmOptions.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    qcmOptions.querySelectorAll('button').forEach(b => b.classList.remove('correct', 'incorrect'));
    if (button.dataset.correct === 'true') {
      button.classList.add('correct');
      setFeedback(qcmFeedback, 'Exactly. “What time is breakfast served?” is polite, natural and correct.', 'Exactement. La phrase est polie, naturelle et correcte.', 'feedback good');
    } else {
      button.classList.add('incorrect');
      setFeedback(qcmFeedback, 'Almost. In English, we need “What time is…?” before the noun.', 'Presque. En anglais, on utilise « What time is…? » avant le nom.', 'feedback try');
    }
  });

  const fillAnswer = document.getElementById('fill-answer');
  const fillFeedback = document.getElementById('fill-feedback');
  document.getElementById('check-fill').addEventListener('click', () => {
    const answer = fillAnswer.value.trim().toLowerCase();
    if (['show', 'tell', 'direct'].includes(answer)) {
      if (answer === 'show') {
        setFeedback(fillFeedback, 'Perfect: “Could you please show us where the station is?”', 'Parfait : « Pourriez-vous nous indiquer où se trouve la gare ? »', 'feedback good');
      } else {
        setFeedback(fillFeedback, 'This word can work in some contexts, but “show” is the most natural answer here.', 'Ce mot peut fonctionner dans certains contextes, mais « show » est la réponse la plus naturelle ici.', 'feedback try');
      }
    } else {
      setFeedback(fillFeedback, 'Try again. Think of the verb used when someone indicates a place to you.', 'Réessayez. Pensez au verbe utilisé lorsqu’une personne vous indique un endroit.', 'feedback try');
    }
  });
  document.getElementById('fill-hint').addEventListener('click', () => {
    setFeedback(fillFeedback, 'Hint: It begins with “sh…” and means “to indicate something with your hand or words”.', 'Indice : le mot commence par « sh… » et signifie « montrer / indiquer ».');
  });

  const dragFeedback = document.getElementById('drag-feedback');
  const phraseButtons = Array.from(document.querySelectorAll('#drag-phrases button'));
  const zoneButtons = Array.from(document.querySelectorAll('.drop-zone'));
  const choosePhrase = (button) => {
    if (button.classList.contains('placed')) return;
    phraseButtons.forEach(b => b.classList.remove('selected'));
    button.classList.add('selected');
    state.selectedPhrase = button;
  };
  const placePhrase = (zone, phrase) => {
    if (!phrase || phrase.classList.contains('placed')) return;
    zoneButtons.forEach(z => z.classList.remove('correct-drop', 'incorrect-drop'));
    if (phrase.dataset.target === zone.dataset.zone) {
      zone.classList.add('correct-drop');
      phrase.classList.add('placed');
      phrase.classList.remove('selected');
      state.selectedPhrase = null;
      setFeedback(dragFeedback, 'Correct — that phrase belongs there.', 'Correct : cette phrase correspond bien à cette situation.', 'feedback good');
      if (phraseButtons.every(b => b.classList.contains('placed'))) {
        setFeedback(dragFeedback, 'Wonderful — all three phrases are in the right place.', 'Très bien : les trois phrases sont au bon endroit.', 'feedback good');
      }
    } else {
      zone.classList.add('incorrect-drop');
      setFeedback(dragFeedback, 'Not quite. Think about where you would naturally say that sentence.', 'Pas tout à fait. Pensez à l’endroit où vous diriez naturellement cette phrase.', 'feedback try');
    }
  };
  phraseButtons.forEach(button => {
    button.addEventListener('click', () => choosePhrase(button));
    button.addEventListener('dragstart', () => {
      state.draggedPhrase = button;
      choosePhrase(button);
    });
  });
  zoneButtons.forEach(zone => {
    zone.addEventListener('click', () => placePhrase(zone, state.selectedPhrase));
    zone.addEventListener('dragover', (event) => {
      event.preventDefault();
      zone.classList.add('over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('over'));
    zone.addEventListener('drop', (event) => {
      event.preventDefault();
      zone.classList.remove('over');
      placePhrase(zone, state.draggedPhrase);
      state.draggedPhrase = null;
    });
  });
})();
