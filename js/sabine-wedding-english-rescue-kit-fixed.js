(function () {
  'use strict';

  var state = {
    showFr: true,
    voice: 'UK',
    lastBuiltSentence: ''
  };

  var vocabItems = [
    { icon: '💐', en: 'bouquet', fr: 'bouquet', category: 'objects', definition: 'a group of flowers for the wedding', example: 'The florist prepares the bouquet in the morning.' },
    { icon: '🏛️', en: 'venue', fr: 'lieu de réception', category: 'places', definition: 'the place where the event happens', example: 'The venue opens at 9 AM.' },
    { icon: '👰', en: 'bride', fr: 'mariée', category: 'people', definition: 'the woman who is getting married', example: 'The bride arrives at 2:30 PM.' },
    { icon: '🤵', en: 'groom', fr: 'marié', category: 'people', definition: 'the man who is getting married', example: 'The groom waits near the entrance.' },
    { icon: '🪑', en: 'seating plan', fr: 'plan de table', category: 'objects', definition: 'the organisation of where guests sit', example: 'I update the seating plan every week.' },
    { icon: '🍽️', en: 'caterer', fr: 'traiteur', category: 'people', definition: 'the company that prepares and serves food', example: 'I am calling the caterer now.' },
    { icon: '📋', en: 'timeline', fr: 'planning / déroulé', category: 'time', definition: 'the schedule of the day', example: 'The timeline starts with the ceremony.' },
    { icon: '💡', en: 'supplier', fr: 'prestataire', category: 'people', definition: 'a professional service provider', example: 'The supplier arrives at the venue at 10 AM.' },
    { icon: '🕯️', en: 'decoration', fr: 'décoration', category: 'objects', definition: 'visual items used to decorate the event', example: 'The decoration looks elegant.' },
    { icon: '📞', en: 'call', fr: 'appeler', category: 'actions', definition: 'to phone someone', example: 'I call the florist every Monday.' },
    { icon: '✅', en: 'confirm', fr: 'confirmer', category: 'actions', definition: 'to say officially that something is correct or planned', example: 'I confirm the final guest list today.' },
    { icon: '✉️', en: 'quote', fr: 'devis', category: 'objects', definition: 'a document with the price for a service', example: 'I will send the quote this afternoon.' },
    { icon: '👥', en: 'guest list', fr: 'liste des invités', category: 'objects', definition: 'the list of invited people', example: 'We checked the guest list yesterday.' },
    { icon: '⛪', en: 'church', fr: 'église', category: 'places', definition: 'the ceremony place', example: 'The guests go to the church at 2 PM.' },
    { icon: '🏨', en: 'hotel', fr: 'hôtel', category: 'places', definition: 'a place where guests stay', example: 'Some guests come from the hotel.' },
    { icon: '📅', en: 'appointment', fr: 'rendez-vous', category: 'time', definition: 'a planned meeting', example: 'I have an appointment with the florist tomorrow.' },
    { icon: '🚚', en: 'deliver', fr: 'livrer', category: 'actions', definition: 'to bring items to a place', example: 'The team delivers the chairs in the morning.' },
    { icon: '🧾', en: 'invoice', fr: 'facture', category: 'objects', definition: 'a bill for the service', example: 'I sent the invoice last week.' },
    { icon: '🌸', en: 'florist', fr: 'fleuriste', category: 'people', definition: 'the person who prepares flowers', example: 'The florist is preparing the arch today.' },
    { icon: '🧭', en: 'guide', fr: 'guider', category: 'actions', definition: 'to show the way or help people', example: 'I guide the guests to the reception room.' },
    { icon: '⏰', en: 'on time', fr: 'à l’heure', category: 'time', definition: 'not late', example: 'The photographer arrived on time.' },
    { icon: '💒', en: 'ceremony', fr: 'cérémonie', category: 'time', definition: 'the formal part of the wedding', example: 'The ceremony starts at 3 PM.' },
    { icon: '🥂', en: 'cocktail', fr: 'cocktail / vin d’honneur', category: 'time', definition: 'the drinks moment after the ceremony', example: 'The cocktail starts at 4 PM.' },
    { icon: '🍰', en: 'menu', fr: 'menu', category: 'objects', definition: 'the food and meal choices', example: 'I confirmed the menu yesterday.' },
    { icon: '🪄', en: 'set up', fr: 'installer / mettre en place', category: 'actions', definition: 'to prepare the room and materials', example: 'We are setting up the room now.' }
  ];

  var picturePhrases = [
    { title: 'Calling a supplier', en: 'I call the florist about the bouquet.', fr: 'J’appelle la fleuriste au sujet du bouquet.' },
    { title: 'Checking the schedule', en: 'I check the timeline before the ceremony.', fr: 'Je vérifie le planning avant la cérémonie.' },
    { title: 'Welcoming guests', en: 'I guide the guests from the hotel to the venue.', fr: 'Je guide les invités de l’hôtel jusqu’au lieu de réception.' },
    { title: 'Talking about the room', en: 'The seating plan is on the table in the room.', fr: 'Le plan de table est sur la table dans la salle.' },
    { title: 'Speaking to the couple', en: 'I confirm the menu and the guest list.', fr: 'Je confirme le menu et la liste des invités.' },
    { title: 'Sending documents', en: 'I send the quote and the invoice today.', fr: 'J’envoie le devis et la facture aujourd’hui.' }
  ];

  var phraseBanks = {
    prep: [
      { en: 'The ceremony starts at 3 PM.', fr: 'La cérémonie commence à 15 h.' },
      { en: 'The flowers are in the reception hall.', fr: 'Les fleurs sont dans la salle de réception.' },
      { en: 'The name cards are on the table.', fr: 'Les marque-places sont sur la table.' },
      { en: 'The guests go to the garden after the ceremony.', fr: 'Les invités vont au jardin après la cérémonie.' },
      { en: 'The shuttle comes from the hotel.', fr: 'La navette vient de l’hôtel.' }
    ],
    ps: [
      { en: 'I confirm the timeline every week.', fr: 'Je confirme le planning chaque semaine.' },
      { en: 'I organise the guest list and the seating plan.', fr: 'J’organise la liste des invités et le plan de table.' },
      { en: 'The ceremony starts at 3 PM.', fr: 'La cérémonie commence à 15 h.' },
      { en: 'I usually call the suppliers in the morning.', fr: 'J’appelle généralement les prestataires le matin.' }
    ],
    pc: [
      { en: 'I am calling the caterer now.', fr: 'J’appelle le traiteur maintenant.' },
      { en: 'I am checking the final details today.', fr: 'Je vérifie les derniers détails aujourd’hui.' },
      { en: 'The florist is preparing the bouquet this morning.', fr: 'La fleuriste prépare le bouquet ce matin.' },
      { en: 'We are setting up the room at the moment.', fr: 'Nous installons la salle en ce moment.' }
    ],
    past: [
      { en: 'I confirmed the venue yesterday.', fr: 'J’ai confirmé le lieu hier.' },
      { en: 'We checked the guest list last night.', fr: 'Nous avons vérifié la liste des invités hier soir.' },
      { en: 'The photographer arrived on time.', fr: 'Le photographe est arrivé à l’heure.' },
      { en: 'I sent the invoice last week.', fr: 'J’ai envoyé la facture la semaine dernière.' }
    ],
    future: [
      { en: 'I am going to send the quote tomorrow.', fr: 'Je vais envoyer le devis demain.' },
      { en: 'I am going to meet the couple next week.', fr: 'Je vais rencontrer le couple la semaine prochaine.' },
      { en: 'I will call you this afternoon.', fr: 'Je vous appellerai cet après-midi.' },
      { en: 'I will confirm everything today, do not worry.', fr: 'Je vais tout confirmer aujourd’hui, ne vous inquiétez pas.' }
    ]
  };

  var quizzes = {
    prep: [
      { prompt: 'The guests arrive ___ the venue at 2 PM.', choices: ['at', 'in', 'on'], answer: 'at', explain: 'Use at for a point or exact place: at the venue.' },
      { prompt: 'The bouquet is ___ the table.', choices: ['to', 'on', 'from'], answer: 'on', explain: 'Use on for a surface.' }
    ],
    ps: [
      { prompt: 'Routine: “I ___ the guest list every Monday.”', choices: ['check', 'am checking', 'checked'], answer: 'check', explain: 'Routine = Present Simple.' },
      { prompt: 'Schedule: “The reception ___ at 6 PM.”', choices: ['starts', 'is starting now', 'started'], answer: 'starts', explain: 'A fixed schedule often uses Present Simple.' }
    ],
    pc: [
      { prompt: 'Now: “I ___ the florist now.”', choices: ['call', 'am calling', 'called'], answer: 'am calling', explain: 'Action now = Present Continuous.' },
      { prompt: 'Today: “We ___ the room today.”', choices: ['are decorating', 'decorate', 'decorated'], answer: 'are decorating', explain: 'Today / around now = Present Continuous.' }
    ],
    past: [
      { prompt: 'Yesterday: “I ___ the menu yesterday.”', choices: ['confirm', 'am confirming', 'confirmed'], answer: 'confirmed', explain: 'Finished action in the past = Past Simple.' },
      { prompt: 'Last week: “We ___ the invoice last week.”', choices: ['send', 'sent', 'are sending'], answer: 'sent', explain: 'Last week = Past Simple.' }
    ],
    future: [
      { prompt: 'Planned intention: “I ___ the couple tomorrow.”', choices: ['am going to call', 'called', 'call every day'], answer: 'am going to call', explain: 'Planned future = going to.' },
      { prompt: 'Promise: “Don’t worry, I ___ you this afternoon.”', choices: ['called', 'will call', 'am calling every Monday'], answer: 'will call', explain: 'Promise / reassurance = will.' }
    ]
  };

  var builderData = {
    tenses: ['Present Simple', 'Present Continuous', 'Past Simple', 'Future (going to)', 'Future (will)'],
    subjects: ['I', 'We', 'The florist', 'The caterer'],
    actions: ['confirm', 'check', 'prepare', 'send', 'call', 'organise'],
    details: ['the timeline', 'the bouquet', 'the quote', 'the guest list', 'the venue details']
  };

  var dialogues = [
    {
      label: 'Phone call with a client',
      lines: [
        { who: 'Client', en: 'Hello, I have a question about the timeline.', fr: 'Bonjour, j’ai une question sur le planning.' },
        { who: 'Sabine', en: 'Of course. I am checking the timeline now.', fr: 'Bien sûr. Je vérifie le planning maintenant.' },
        { who: 'Sabine', en: 'The ceremony starts at 3 PM and the cocktail starts at 4 PM.', fr: 'La cérémonie commence à 15 h et le cocktail commence à 16 h.' },
        { who: 'Sabine', en: 'I will send you the updated version this afternoon.', fr: 'Je vous enverrai la version mise à jour cet après-midi.' }
      ]
    },
    {
      label: 'Speaking to a supplier',
      lines: [
        { who: 'Sabine', en: 'Hello, I usually confirm deliveries two days before the event.', fr: 'Bonjour, je confirme généralement les livraisons deux jours avant l’événement.' },
        { who: 'Sabine', en: 'I am calling to check the flowers for Saturday.', fr: 'J’appelle pour vérifier les fleurs pour samedi.' },
        { who: 'Supplier', en: 'Yes, we prepared the order yesterday.', fr: 'Oui, nous avons préparé la commande hier.' },
        { who: 'Sabine', en: 'Perfect. Please deliver everything at the venue at 10 AM.', fr: 'Parfait. Merci de tout livrer au lieu de réception à 10 h.' }
      ]
    },
    {
      label: 'Reassuring a stressed couple',
      lines: [
        { who: 'Couple', en: 'We are worried about the seating plan.', fr: 'Nous sommes inquiets pour le plan de table.' },
        { who: 'Sabine', en: 'I understand. I checked the guest list this morning.', fr: 'Je comprends. J’ai vérifié la liste des invités ce matin.' },
        { who: 'Sabine', en: 'I am updating the seating plan now.', fr: 'Je mets à jour le plan de table maintenant.' },
        { who: 'Sabine', en: 'I will confirm the final version before 6 PM.', fr: 'Je confirmerai la version finale avant 18 h.' }
      ]
    }
  ];

  var iconPairs = [
    { pattern: /\bflorist\b/gi, icon: '🌸', word: 'florist' },
    { pattern: /\bcaterer\b/gi, icon: '🍽️', word: 'caterer' },
    { pattern: /\bbouquet\b/gi, icon: '💐', word: 'bouquet' },
    { pattern: /\bvenue\b/gi, icon: '🏛️', word: 'venue' },
    { pattern: /\bguest list\b/gi, icon: '👥', word: 'guest list' },
    { pattern: /\bseating plan\b/gi, icon: '🪑', word: 'seating plan' },
    { pattern: /\btimeline\b/gi, icon: '📋', word: 'timeline' },
    { pattern: /\bquote\b/gi, icon: '✉️', word: 'quote' },
    { pattern: /\binvoice\b/gi, icon: '🧾', word: 'invoice' },
    { pattern: /\bhotel\b/gi, icon: '🏨', word: 'hotel' },
    { pattern: /\bchurch\b/gi, icon: '⛪', word: 'church' },
    { pattern: /\bceremony\b/gi, icon: '💒', word: 'ceremony' },
    { pattern: /\bcocktail\b/gi, icon: '🥂', word: 'cocktail' },
    { pattern: /\bmenu\b/gi, icon: '🍰', word: 'menu' },
    { pattern: /\bcall(?:ing|ed)?\b/gi, icon: '📞', word: null },
    { pattern: /\bconfirm(?:ed|ing|s)?\b/gi, icon: '✅', word: null },
    { pattern: /\bcheck(?:ed|ing|s)?\b/gi, icon: '🔎', word: null },
    { pattern: /\bsend(?:ing|s|sent)?\b/gi, icon: '📨', word: null },
    { pattern: /\bprepare(?:d|ing|s)?\b/gi, icon: '🛠️', word: null },
    { pattern: /\bdeliver(?:ed|ing|s)?\b/gi, icon: '🚚', word: null },
    { pattern: /\bguide(?:d|ing|s)?\b/gi, icon: '🧭', word: null },
    { pattern: /\bset(?:ting)? up\b/gi, icon: '🪄', word: null },
    { pattern: /\bon time\b/gi, icon: '⏰', word: 'on time' }
  ];

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function safeOn(selector, eventName, handler, scope) {
    var element = qs(selector, scope);
    if (element) {
      element.addEventListener(eventName, handler);
    }
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function iconWord(icon, text) {
    return '<span class="icon-word"><span class="emoji">' + icon + '</span><span class="word">' + escapeHtml(text) + '</span></span>';
  }

  function decorateText(text) {
    var decorated = escapeHtml(text);
    iconPairs.forEach(function (pair) {
      decorated = decorated.replace(pair.pattern, function (match) {
        return iconWord(pair.icon, match);
      });
    });
    return decorated;
  }

  function speakText(text) {
    if (!window.speechSynthesis || !text) {
      return;
    }
    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g, ' '));
    utterance.lang = state.voice === 'UK' ? 'en-GB' : 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  function bindSpeakButtons(scope) {
    qsa('.speak-line', scope).forEach(function (button) {
      button.addEventListener('click', function () {
        speakText(button.getAttribute('data-say'));
      });
    });
  }

  function syncFrVisibility() {
    qsa('.fr-text').forEach(function (element) {
      element.classList.toggle('hidden', !state.showFr);
    });
  }

  function renderVocab() {
    var grid = qs('#vocab-grid');
    if (!grid) { return; }

    var searchEl = qs('#vocab-search');
    var filterEl = qs('#vocab-filter');
    var search = searchEl ? searchEl.value.trim().toLowerCase() : '';
    var filter = filterEl ? filterEl.value : 'all';

    var filtered = vocabItems.filter(function (item) {
      var matchesFilter = filter === 'all' || item.category === filter;
      var haystack = [item.en, item.fr, item.definition, item.example].join(' ').toLowerCase();
      var matchesSearch = !search || haystack.indexOf(search) !== -1;
      return matchesFilter && matchesSearch;
    });

    if (!filtered.length) {
      grid.innerHTML = '<div class="empty-state">No vocabulary found.</div>';
      return;
    }

    grid.innerHTML = filtered.map(function (item) {
      return [
        '<article class="vocab-card" tabindex="0">',
          '<div class="vocab-inner">',
            '<div class="vocab-face front">',
              '<div class="vocab-top"><span class="vocab-icon">', item.icon, '</span><span class="tag">', escapeHtml(item.category), '</span></div>',
              '<div>',
                '<h3 class="vocab-word">', escapeHtml(item.en), '</h3>',
                '<p class="vocab-fr fr-text">', escapeHtml(item.fr), '</p>',
              '</div>',
              '<div class="vocab-sentence">', decorateText(item.example), '</div>',
              '<div><button class="btn secondary mini-speak" data-say="', escapeHtml(item.example), '" type="button">🔊 Listen</button></div>',
            '</div>',
            '<div class="vocab-face back">',
              '<div>',
                '<h3>', item.icon, ' ', escapeHtml(item.en), ' <span class="fr-text">= ', escapeHtml(item.fr), '</span></h3>',
                '<p>', escapeHtml(item.definition), '</p>',
                '<p><strong>Example:</strong> <span>', decorateText(item.example), '</span></p>',
              '</div>',
            '</div>',
          '</div>',
        '</article>'
      ].join('');
    }).join('');

    qsa('.vocab-card', grid).forEach(function (card) {
      card.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('mini-speak')) {
          return;
        }
        card.classList.toggle('flipped');
      });
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          card.classList.toggle('flipped');
        }
      });
    });

    qsa('.mini-speak', grid).forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        speakText(button.getAttribute('data-say'));
      });
    });

    syncFrVisibility();
  }

  function renderPicturePhrases() {
    var grid = qs('#picture-phrase-grid');
    if (!grid) { return; }

    grid.innerHTML = picturePhrases.map(function (item) {
      return [
        '<article class="picture-card">',
          '<h3>', escapeHtml(item.title), '</h3>',
          '<p class="phrase-en">', decorateText(item.en), '</p>',
          '<p class="phrase-fr fr-text">', escapeHtml(item.fr), '</p>',
          '<div class="phrase-meta">',
            '<button class="btn secondary speak-line" type="button" data-say="', escapeHtml(item.en), '">🔊 Listen</button>',
          '</div>',
        '</article>'
      ].join('');
    }).join('');

    bindSpeakButtons(grid);
    syncFrVisibility();
  }

  function renderPhraseList(selector, items) {
    var target = qs(selector);
    if (!target) { return; }

    target.innerHTML = items.map(function (item) {
      return [
        '<li>',
          '<span class="phrase-en">', decorateText(item.en), '</span>',
          '<span class="phrase-fr fr-text">— ', escapeHtml(item.fr), '</span>',
          '<div class="phrase-meta">',
            '<button class="btn secondary speak-line" type="button" data-say="', escapeHtml(item.en), '">🔊 Listen</button>',
          '</div>',
        '</li>'
      ].join('');
    }).join('');

    bindSpeakButtons(target);
    syncFrVisibility();
  }

  function renderQuiz(id, items) {
    var target = qs('#' + id);
    if (!target) { return; }

    target.innerHTML = items.map(function (item, index) {
      var choices = item.choices.map(function (choice) {
        return '<button type="button" class="choice-btn" data-answer="' + escapeHtml(item.answer) + '">' + escapeHtml(choice) + '</button>';
      }).join('');

      return [
        '<article class="quiz-item">',
          '<p><strong>', String(index + 1), '.</strong> ', escapeHtml(item.prompt), '</p>',
          '<div class="choice-row">', choices, '</div>',
          '<div class="feedback" aria-live="polite"></div>',
          '<p class="muted fr-text">', escapeHtml(item.explain), '</p>',
        '</article>'
      ].join('');
    }).join('');

    qsa('.quiz-item', target).forEach(function (quizItem) {
      var feedback = qs('.feedback', quizItem);
      qsa('.choice-btn', quizItem).forEach(function (button) {
        button.addEventListener('click', function () {
          var chosen = button.textContent;
          var answer = button.getAttribute('data-answer');

          qsa('.choice-btn', quizItem).forEach(function (btn) {
            btn.disabled = true;
            if (btn.textContent === answer) {
              btn.classList.add('correct');
            }
          });

          if (chosen === answer) {
            button.classList.add('correct');
            feedback.textContent = 'Correct!';
            feedback.className = 'feedback ok';
          } else {
            button.classList.add('wrong');
            feedback.textContent = 'Not quite. Look at the explanation.';
            feedback.className = 'feedback bad';
          }
        });
      });
    });

    syncFrVisibility();
  }

  function fillSelect(selector, items) {
    var select = qs(selector);
    if (!select) { return; }
    select.innerHTML = items.map(function (item) {
      return '<option value="' + escapeHtml(item) + '">' + escapeHtml(item) + '</option>';
    }).join('');
  }

  function populateBuilder() {
    fillSelect('#builder-tense', builderData.tenses);
    fillSelect('#builder-subject', builderData.subjects);
    fillSelect('#builder-action', builderData.actions);
    fillSelect('#builder-detail', builderData.details);
  }

  function translateSubject(subject) {
    if (subject === 'I') { return 'Je'; }
    if (subject === 'We') { return 'Nous'; }
    if (subject === 'The florist') { return 'La fleuriste'; }
    return 'Le traiteur';
  }

  function translateAction(action, mode) {
    var map = {
      confirm: { present: 'confirme', ing: 'suis en train de confirmer', past: 'ai confirmé', base: 'confirmer' },
      check: { present: 'vérifie', ing: 'suis en train de vérifier', past: 'ai vérifié', base: 'vérifier' },
      prepare: { present: 'prépare', ing: 'suis en train de préparer', past: 'ai préparé', base: 'préparer' },
      send: { present: 'envoie', ing: 'suis en train d’envoyer', past: 'ai envoyé', base: 'envoyer' },
      call: { present: 'appelle', ing: 'suis en train d’appeler', past: 'ai appelé', base: 'appeler' },
      organise: { present: 'organise', ing: 'suis en train d’organiser', past: 'ai organisé', base: 'organiser' }
    };
    return map[action][mode || 'base'];
  }

  function translateDetail(detail) {
    var map = {
      'the timeline': 'le planning',
      'the bouquet': 'le bouquet',
      'the quote': 'le devis',
      'the guest list': 'la liste des invités',
      'the venue details': 'les détails du lieu'
    };
    return map[detail] || detail;
  }

  function buildSentence() {
    var tenseEl = qs('#builder-tense');
    var subjectEl = qs('#builder-subject');
    var actionEl = qs('#builder-action');
    var detailEl = qs('#builder-detail');
    var output = qs('#built-output');
    var outputFr = qs('#built-output-fr');

    if (!tenseEl || !subjectEl || !actionEl || !detailEl || !output || !outputFr) {
      return;
    }

    var tense = tenseEl.value;
    var subject = subjectEl.value;
    var action = actionEl.value;
    var detail = detailEl.value;
    var sentence = '';
    var fr = '';

    var actionPast = {
      confirm: 'confirmed',
      check: 'checked',
      prepare: 'prepared',
      send: 'sent',
      call: 'called',
      organise: 'organised'
    };

    var ingMap = {
      confirm: 'confirming',
      check: 'checking',
      prepare: 'preparing',
      send: 'sending',
      call: 'calling',
      organise: 'organising'
    };

    var thirdPerson = subject === 'The florist' || subject === 'The caterer';
    var helper = thirdPerson ? 'is' : (subject === 'I' ? 'am' : 'are');
    var presentMap = {
      confirm: thirdPerson ? 'confirms' : 'confirm',
      check: thirdPerson ? 'checks' : 'check',
      prepare: thirdPerson ? 'prepares' : 'prepare',
      send: thirdPerson ? 'sends' : 'send',
      call: thirdPerson ? 'calls' : 'call',
      organise: thirdPerson ? 'organises' : 'organise'
    };

    if (tense === 'Present Simple') {
      sentence = subject + ' ' + presentMap[action] + ' ' + detail + '.';
      fr = 'Présent simple : ' + translateSubject(subject) + ' ' + translateAction(action, 'present') + ' ' + translateDetail(detail) + '.';
    } else if (tense === 'Present Continuous') {
      sentence = subject + ' ' + helper + ' ' + ingMap[action] + ' ' + detail + ' now.';
      fr = 'Présent continu : ' + translateSubject(subject) + ' ' + translateAction(action, 'ing') + ' ' + translateDetail(detail) + ' maintenant.';
    } else if (tense === 'Past Simple') {
      sentence = subject + ' ' + actionPast[action] + ' ' + detail + ' yesterday.';
      fr = 'Past simple : ' + translateSubject(subject) + ' ' + translateAction(action, 'past') + ' ' + translateDetail(detail) + ' hier.';
    } else if (tense === 'Future (going to)') {
      sentence = subject + ' ' + helper + ' going to ' + action + ' ' + detail + ' tomorrow.';
      fr = 'Futur prévu : ' + translateSubject(subject) + ' va ' + translateAction(action, 'base') + ' ' + translateDetail(detail) + ' demain.';
    } else {
      sentence = subject + ' will ' + action + ' ' + detail + ' this afternoon.';
      fr = 'Futur / promesse : ' + translateSubject(subject) + ' va ' + translateAction(action, 'base') + ' ' + translateDetail(detail) + ' cet après-midi.';
    }

    state.lastBuiltSentence = sentence;
    output.innerHTML = decorateText(sentence);
    outputFr.textContent = fr;
    syncFrVisibility();
  }

  function renderDialogues() {
    var select = qs('#dialogue-select');
    if (!select) { return; }

    select.innerHTML = dialogues.map(function (dialogue, index) {
      return '<option value="' + String(index) + '">' + escapeHtml(dialogue.label) + '</option>';
    }).join('');

    updateDialogue();
  }

  function updateDialogue() {
    var select = qs('#dialogue-select');
    var box = qs('#dialogue-box');
    if (!select || !box) { return; }

    var index = parseInt(select.value, 10);
    if (isNaN(index)) { index = 0; }
    var dialogue = dialogues[index] || dialogues[0];

    box.innerHTML = dialogue.lines.map(function (line) {
      return [
        '<div class="dialogue-line">',
          '<strong>', escapeHtml(line.who), ':</strong> ',
          '<span class="phrase-en">', decorateText(line.en), '</span>',
          '<span class="phrase-fr fr-text">— ', escapeHtml(line.fr), '</span>',
          '<div class="phrase-meta">',
            '<button type="button" class="btn secondary speak-line" data-say="', escapeHtml(line.en), '">🔊 Listen</button>',
          '</div>',
        '</div>'
      ].join('');
    }).join('');

    bindSpeakButtons(box);
    syncFrVisibility();
  }

  function renderAllPhraseLists() {
    renderPhraseList('#prep-phrases', phraseBanks.prep);
    renderPhraseList('#ps-phrases', phraseBanks.ps);
    renderPhraseList('#pc-phrases', phraseBanks.pc);
    renderPhraseList('#past-phrases', phraseBanks.past);
    renderPhraseList('#future-phrases', phraseBanks.future);
  }

  function renderAllQuizzes() {
    renderQuiz('prep-quiz', quizzes.prep);
    renderQuiz('ps-quiz', quizzes.ps);
    renderQuiz('pc-quiz', quizzes.pc);
    renderQuiz('past-quiz', quizzes.past);
    renderQuiz('future-quiz', quizzes.future);
  }

  function resetPage() {
    state.showFr = true;
    state.voice = 'UK';
    state.lastBuiltSentence = '';

    var toggleFr = qs('#toggle-fr');
    var toggleVoice = qs('#toggle-voice');
    var search = qs('#vocab-search');
    var filter = qs('#vocab-filter');
    var out = qs('#built-output');
    var outFr = qs('#built-output-fr');

    if (toggleFr) { toggleFr.textContent = 'FR help: ON'; }
    if (toggleVoice) { toggleVoice.textContent = 'Voice: UK'; }
    if (search) { search.value = ''; }
    if (filter) { filter.value = 'all'; }
    if (out) { out.textContent = 'Your sentence will appear here.'; }
    if (outFr) { outFr.textContent = 'La traduction apparaîtra ici.'; }

    renderVocab();
    renderPicturePhrases();
    renderAllPhraseLists();
    renderAllQuizzes();
    populateBuilder();
    renderDialogues();
    syncFrVisibility();
  }

  function init() {
    renderVocab();
    renderPicturePhrases();
    renderAllPhraseLists();
    renderAllQuizzes();
    populateBuilder();
    renderDialogues();
    syncFrVisibility();

    safeOn('#vocab-search', 'input', renderVocab);
    safeOn('#vocab-filter', 'change', renderVocab);

    safeOn('#toggle-fr', 'click', function () {
      state.showFr = !state.showFr;
      var button = qs('#toggle-fr');
      if (button) {
        button.textContent = state.showFr ? 'FR help: ON' : 'FR help: OFF';
      }
      syncFrVisibility();
    });

    safeOn('#toggle-voice', 'click', function () {
      state.voice = state.voice === 'UK' ? 'US' : 'UK';
      var button = qs('#toggle-voice');
      if (button) {
        button.textContent = 'Voice: ' + state.voice;
      }
    });

    safeOn('#speak-page', 'click', function () {
      speakText('I confirm the timeline every week. I am calling the caterer now. I sent the invoice yesterday. I will send the quote tomorrow.');
    });

    safeOn('#reset-page', 'click', resetPage);
    safeOn('#build-sentence', 'click', buildSentence);
    safeOn('#speak-sentence', 'click', function () {
      speakText(state.lastBuiltSentence);
    });
    safeOn('#dialogue-select', 'change', updateDialogue);
  }

  document.addEventListener('DOMContentLoaded', init);
}());
