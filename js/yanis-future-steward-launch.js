document.addEventListener('DOMContentLoaded', function () {
  var scoreState = {
    total: 0,
    max: 38,
    vocab: 0,
    prepositions: 0,
    grammar: 0,
    transform: 0
  };

  var flashcards = [
    {
      tag: 'Vocabulary',
      front: 'reception desk',
      back: 'FR: la réception • the place where guests arrive, ask for help, and check in. Example: I work at the reception desk.'
    },
    {
      tag: 'Job title',
      front: 'receptionist',
      back: 'FR: réceptionniste • a person who welcomes guests and helps them. Example: I work as a receptionist in a hotel.'
    },
    {
      tag: 'Task',
      front: 'check-in',
      back: 'FR: enregistrement à l’arrivée • the process of welcoming guests when they arrive. Example: I handle check-in in the evening.'
    },
    {
      tag: 'Task',
      front: 'check-out',
      back: 'FR: départ / règlement • the process of helping guests leave the hotel. Example: I also do check-out in the morning.'
    },
    {
      tag: 'Task',
      front: 'reservation',
      back: 'FR: réservation • a booking made for a room, seat, or service. Example: I deal with reservations by phone and email.'
    },
    {
      tag: 'Task',
      front: 'answer phone calls',
      back: 'FR: répondre aux appels • to speak to customers on the phone. Example: I answer phone calls during my shift.'
    },
    {
      tag: 'Task',
      front: 'reply to emails',
      back: 'FR: répondre aux e-mails • to send an answer by email. Example: I reply to emails every day.'
    },
    {
      tag: 'Expression',
      front: 'welcome guests',
      back: 'FR: accueillir des clients • to receive people in a friendly and professional way. Example: I welcome guests at reception.'
    },
    {
      tag: 'Expression',
      front: 'deal with customer requests',
      back: 'FR: gérer les demandes clients • to answer or solve customer needs. Example: I deal with customer requests during the day.'
    },
    {
      tag: 'Quality',
      front: 'customer contact',
      back: 'FR: contact avec les clients • communication and interaction with customers. Example: I enjoy customer contact.'
    },
    {
      tag: 'Preposition',
      front: 'in a hotel',
      back: 'FR: dans un hôtel • use IN for a place/building. Example: I work in a hotel.'
    },
    {
      tag: 'Preposition',
      front: 'at reception',
      back: 'FR: à la réception • use AT for a point/service desk. Example: I work at reception.'
    },
    {
      tag: 'Preposition',
      front: 'on the phone',
      back: 'FR: au téléphone • use ON for phone communication. Example: I use English on the phone.'
    },
    {
      tag: 'Preposition',
      front: 'by email',
      back: 'FR: par e-mail • use BY for the communication method. Example: I often communicate by email.'
    },
    {
      tag: 'Time expression',
      front: 'during the weekend',
      back: 'FR: pendant le week-end • to talk about actions in that period. Example: During the weekend, I help with breakfast.'
    },
    {
      tag: 'Future goal',
      front: 'become a steward',
      back: 'FR: devenir steward • to work as cabin crew on a plane. Example: I want to become a steward in the future.'
    }
  ];

  var vocabQuiz = [
    {
      question: 'What does “check-in” mean?',
      options: ['serving food on a plane', 'welcoming guests when they arrive', 'cleaning a hotel room', 'driving to the airport'],
      answer: 1,
      explanation: 'Check-in is the arrival process when you welcome guests and complete the formalities.'
    },
    {
      question: 'What does “reservation” mean?',
      options: ['a complaint', 'a delay', 'a booking', 'a suitcase'],
      answer: 2,
      explanation: 'A reservation is a booking for a room, service, or seat.'
    },
    {
      question: 'Choose the best meaning of “reply to emails”.',
      options: ['read emails only', 'delete emails', 'send answers by email', 'print emails'],
      answer: 2,
      explanation: 'Reply to emails means answer written messages by email.'
    },
    {
      question: 'What is a “receptionist”?',
      options: ['a person who welcomes and helps guests', 'a pilot', 'a chef', 'a train driver'],
      answer: 0,
      explanation: 'A receptionist welcomes guests and helps with information or procedures.'
    },
    {
      question: 'What does “deal with customer requests” mean?',
      options: ['ignore guests', 'answer and manage customer needs', 'close the hotel', 'change jobs'],
      answer: 1,
      explanation: 'Deal with customer requests means respond to what customers need.'
    },
    {
      question: 'Which word matches “contact with customers”?',
      options: ['customer contact', 'breakfast service', 'reservation system', 'boarding pass'],
      answer: 0,
      explanation: 'Customer contact means communication and interaction with customers.'
    },
    {
      question: 'What does “become a steward” mean?',
      options: ['work in a train station', 'work as cabin crew', 'manage a hotel reception', 'repair planes'],
      answer: 1,
      explanation: 'A steward works with passengers as cabin crew.'
    },
    {
      question: 'Which activity is close to “welcome guests”?',
      options: ['receive people professionally', 'cook dinner for staff', 'prepare the luggage room', 'write invoices only'],
      answer: 0,
      explanation: 'Welcome guests means receive people in a friendly and professional way.'
    },
    {
      question: 'What does “check-out” mean?',
      options: ['the departure process for guests', 'the hotel bar menu', 'a flight number', 'an airport gate'],
      answer: 0,
      explanation: 'Check-out is the departure process when guests leave.'
    },
    {
      question: 'Which sentence is about a work quality?',
      options: ['I use English by email.', 'I enjoy customer contact.', 'I work in a hotel.', 'I answer phone calls.'],
      answer: 1,
      explanation: 'Enjoying customer contact shows a personal quality or preference for the job.'
    }
  ];

  var prepositionItems = [
    {
      sentence: 'I work ___ a hotel.',
      options: ['in', 'on', 'by'],
      answer: 'in'
    },
    {
      sentence: 'I work ___ reception.',
      options: ['at', 'during', 'with'],
      answer: 'at'
    },
    {
      sentence: 'I use English ___ the phone.',
      options: ['on', 'in', 'to'],
      answer: 'on'
    },
    {
      sentence: 'I often communicate ___ email.',
      options: ['by', 'at', 'for'],
      answer: 'by'
    },
    {
      sentence: 'I speak English ___ international guests.',
      options: ['with', 'during', 'at'],
      answer: 'with'
    },
    {
      sentence: '___ the weekend, I help with breakfast service.',
      options: ['During', 'At', 'By'],
      answer: 'During'
    },
    {
      sentence: 'I am responsible ___ check-in and check-out.',
      options: ['for', 'to', 'on'],
      answer: 'for'
    },
    {
      sentence: 'I would like to work ___ air travel.',
      options: ['in', 'at', 'by'],
      answer: 'in'
    }
  ];

  var grammarItems = [
    {
      sentence: 'I ___ a receptionist in a hotel.',
      options: ['am', 'do', 'are'],
      answer: 'am'
    },
    {
      sentence: 'I ___ guests every day.',
      options: ['welcome', 'welcomes', 'am welcome'],
      answer: 'welcome'
    },
    {
      sentence: 'I ___ phone calls during my shift.',
      options: ['answer', 'am answer', 'answers'],
      answer: 'answer'
    },
    {
      sentence: 'I ___ English every minute of the day.',
      options: ['do not use', 'am not use', 'not use'],
      answer: 'do not use'
    },
    {
      sentence: 'I ___ motivated to improve my English.',
      options: ['am', 'do', 'use'],
      answer: 'am'
    },
    {
      sentence: '___ you use English on the phone?',
      options: ['Do', 'Are', 'Is'],
      answer: 'Do'
    },
    {
      sentence: '___ you comfortable with customer contact?',
      options: ['Do', 'Am', 'Are'],
      answer: 'Are'
    },
    {
      sentence: 'I ___ to become a steward.',
      options: ['want', 'wants', 'am want'],
      answer: 'want'
    },
    {
      sentence: 'I ___ breakfast service during the weekend.',
      options: ['help with', 'am help with', 'helps with'],
      answer: 'help with'
    },
    {
      sentence: 'I ___ in Schiltigheim.',
      options: ['live', 'lives', 'am live'],
      answer: 'live'
    },
    {
      sentence: 'I ___ responsible for reservations.',
      options: ['am', 'do', 'have'],
      answer: 'am'
    },
    {
      sentence: 'I ___ late for work.',
      options: ['am not usually', 'do not usually am', 'usually do not'],
      answer: 'am not usually'
    }
  ];

  var transformItems = [
    {
      prompt: 'Choose the correct NEGATIVE sentence.',
      options: ['I do not answer emails.', 'Do I answer emails?', 'I answer emails.'],
      answer: 0
    },
    {
      prompt: 'Choose the correct QUESTION.',
      options: ['I use English by email.', 'Do you use English by email?', 'I do not use English by email.'],
      answer: 1
    },
    {
      prompt: 'Choose the correct AFFIRMATIVE sentence.',
      options: ['I am motivated.', 'Am I motivated?', 'I am not motivated.'],
      answer: 0
    },
    {
      prompt: 'Choose the correct NEGATIVE sentence with be.',
      options: ['I am not a steward yet.', 'Do I am a steward yet?', 'I a steward yet.'],
      answer: 0
    },
    {
      prompt: 'Choose the correct QUESTION with be.',
      options: ['You are ready?', 'Are you ready?', 'Do you are ready?'],
      answer: 1
    },
    {
      prompt: 'Choose the correct AFFIRMATIVE sentence.',
      options: ['I work in a hotel.', 'Do I work in a hotel?', 'I do not work in a hotel.'],
      answer: 0
    },
    {
      prompt: 'Choose the correct NEGATIVE sentence.',
      options: ['I am not at reception today.', 'Do I not at reception today?', 'I not at reception today.'],
      answer: 0
    },
    {
      prompt: 'Choose the correct QUESTION.',
      options: ['Do you welcome international guests?', 'You welcome international guests?', 'You do welcome international guests.'],
      answer: 0
    }
  ];

  var flashIndex = 0;
  var flashFront = true;
  var vocabIndex = 0;
  var vocabAnswered = new Array(vocabQuiz.length).fill(false);

  var flashTag = document.getElementById('flashTag');
  var flashMain = document.getElementById('flashMain');
  var flashSub = document.getElementById('flashSub');
  var flashCounter = document.getElementById('flashcardCounter');
  var flashFrontView = document.getElementById('flashFrontView');
  var flashBackView = document.getElementById('flashBackView');
  var flashTranslation = document.getElementById('flashTranslation');
  var flashDefinition = document.getElementById('flashDefinition');
  var flashExample = document.getElementById('flashExample');

  var accentState = {
    lang: 'en-GB',
    label: 'British English'
  };

  function cleanSpeechText(text) {
    return String(text || '').replace(/[_•]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function findVoice(targetLang) {
    var voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    var matching = voices.filter(function (voice) {
      return voice.lang && voice.lang.toLowerCase().indexOf(targetLang.toLowerCase()) === 0;
    });

    if (matching.length > 0) {
      return matching[0];
    }

    var fallback = voices.filter(function (voice) {
      return voice.lang && voice.lang.toLowerCase().indexOf('en') === 0;
    });

    return fallback.length > 0 ? fallback[0] : null;
  }

  function updateVoiceStatus() {
    var status = document.getElementById('voiceStatus');
    if (status) {
      status.textContent = 'Current accent: ' + accentState.label + '. Use the speaker buttons throughout the lesson to hear words, texts, and sentences.';
    }
    document.getElementById('accentUK').classList.toggle('active', accentState.lang === 'en-GB');
    document.getElementById('accentUS').classList.toggle('active', accentState.lang === 'en-US');
    document.getElementById('accentUK').setAttribute('aria-pressed', accentState.lang === 'en-GB' ? 'true' : 'false');
    document.getElementById('accentUS').setAttribute('aria-pressed', accentState.lang === 'en-US' ? 'true' : 'false');
  }

  function speakText(text) {
    if (!window.speechSynthesis) {
      return;
    }

    var message = cleanSpeechText(text);
    if (!message) {
      return;
    }

    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = accentState.lang;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    var voice = findVoice(accentState.lang);
    if (voice) {
      utterance.voice = voice;
    }
    window.speechSynthesis.speak(utterance);
  }

  function createSpeakButton(textBuilder, extraClass) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'speak-btn' + (extraClass ? ' ' + extraClass : '');
    button.setAttribute('aria-label', 'Listen');
    button.textContent = '🔊';
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      var text = typeof textBuilder === 'function' ? textBuilder() : textBuilder;
      speakText(text);
    });
    return button;
  }

  function getElementSpeechText(element) {
    if (!element) {
      return '';
    }

    var clone = element.cloneNode(true);
    clone.querySelectorAll('.speak-btn').forEach(function (button) {
      button.remove();
    });

    clone.querySelectorAll('[data-speech-exclude="true"]').forEach(function (item) {
      item.remove();
    });

    return cleanSpeechText(clone.textContent);
  }

  function attachSpeakButtons() {
    var selectors = [
      '.hero-subtitle',
      '.boarding-card li',
      '.map-card p',
      '.tip-card li',
      '.grammar-table td:nth-child(2)',
      '.accent-card li',
      '.bank-card li',
      '.writing-card ol li',
      '#ideaBank p',
      '#modelAnswer p:last-child'
    ];

    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (element) {
        if (element.querySelector('.speak-btn')) {
          return;
        }
        var btn = createSpeakButton(function () {
          return getElementSpeechText(element);
        }, 'inline-speak');
        element.appendChild(btn);
      });
    });
  }

  function updateScore() {
    scoreState.total = scoreState.vocab + scoreState.prepositions + scoreState.grammar + scoreState.transform;
    document.getElementById('scoreDisplay').textContent = scoreState.total + ' / ' + scoreState.max;
    document.getElementById('scoreDisplayBottom').textContent = scoreState.total + ' / ' + scoreState.max;
  }

  function getFlashcardParts(card) {
    var translation = '';
    var definition = '';
    var example = '';
    var parts = String(card.back || '').split('•');

    if (parts.length > 0) {
      translation = parts[0].replace(/^FR:\s*/, '').trim();
    }

    if (parts.length > 1) {
      var detail = parts[1].trim();
      var exampleSplit = detail.split(/Example:\s*/i);
      definition = exampleSplit[0].trim();
      example = exampleSplit[1] ? exampleSplit[1].trim() : '';
    }

    return {
      translation: translation,
      definition: definition,
      example: example
    };
  }

  function renderFlashcard() {
    var card = flashcards[flashIndex];
    var parts = getFlashcardParts(card);
    flashTag.textContent = card.tag;
    flashCounter.textContent = (flashIndex + 1) + ' / ' + flashcards.length;

    if (flashFront) {
      flashFrontView.removeAttribute('hidden');
      flashBackView.setAttribute('hidden', 'hidden');
      flashMain.textContent = card.front;
      flashSub.textContent = 'Tap or click to see the translation, definition, and example.';
    } else {
      flashFrontView.setAttribute('hidden', 'hidden');
      flashBackView.removeAttribute('hidden');
      flashTranslation.textContent = 'FR: ' + parts.translation;
      flashDefinition.textContent = parts.definition;
      flashExample.textContent = parts.example;
    }
  }

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }

  document.getElementById('flashcard').addEventListener('click', function () {
    flashFront = !flashFront;
    renderFlashcard();
  });

  document.getElementById('flipFlashcard').addEventListener('click', function () {
    flashFront = !flashFront;
    renderFlashcard();
  });

  document.getElementById('prevFlashcard').addEventListener('click', function () {
    flashIndex = (flashIndex - 1 + flashcards.length) % flashcards.length;
    flashFront = true;
    renderFlashcard();
  });

  document.getElementById('nextFlashcard').addEventListener('click', function () {
    flashIndex = (flashIndex + 1) % flashcards.length;
    flashFront = true;
    renderFlashcard();
  });

  document.getElementById('shuffleFlashcards').addEventListener('click', function () {
    shuffleArray(flashcards);
    flashIndex = 0;
    flashFront = true;
    renderFlashcard();
  });

  document.getElementById('listenFlashcard').addEventListener('click', function () {
    var card = flashcards[flashIndex];
    var parts = getFlashcardParts(card);
    if (flashFront) {
      speakText(card.front);
    } else {
      speakText(card.front + '. Definition: ' + parts.definition + '. Example: ' + parts.example);
    }
  });

  function renderVocabQuestion() {
    var current = vocabQuiz[vocabIndex];
    var questionNumber = document.getElementById('vocabQuestionNumber');
    var question = document.getElementById('vocabQuestion');
    var optionsBox = document.getElementById('vocabOptions');
    var feedback = document.getElementById('vocabFeedback');

    questionNumber.textContent = 'Question ' + (vocabIndex + 1) + ' / ' + vocabQuiz.length;
    question.textContent = current.question;
    optionsBox.innerHTML = '';
    feedback.className = 'feedback';
    feedback.textContent = 'Choose one answer.';

    current.options.forEach(function (option, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-btn';
      button.textContent = option;
      button.addEventListener('click', function () {
        if (vocabAnswered[vocabIndex]) {
          return;
        }

        vocabAnswered[vocabIndex] = true;
        var allButtons = optionsBox.querySelectorAll('.option-btn');
        allButtons.forEach(function (btn, btnIndex) {
          btn.disabled = true;
          if (btnIndex === current.answer) {
            btn.classList.add('correct');
          }
        });

        if (index === current.answer) {
          button.classList.add('correct');
          feedback.className = 'feedback good';
          feedback.textContent = 'Correct! ' + current.explanation;
          scoreState.vocab += 1;
          updateScore();
        } else {
          button.classList.add('wrong');
          feedback.className = 'feedback bad';
          feedback.textContent = 'Not this time. ' + current.explanation;
        }
      });
      optionsBox.appendChild(button);
    });
  }

  document.getElementById('nextVocabQuestion').addEventListener('click', function () {
    if (vocabIndex < vocabQuiz.length - 1) {
      vocabIndex += 1;
    } else {
      vocabIndex = 0;
    }
    renderVocabQuestion();
  });

  document.getElementById('resetVocabQuiz').addEventListener('click', function () {
    scoreState.vocab = 0;
    vocabIndex = 0;
    vocabAnswered = new Array(vocabQuiz.length).fill(false);
    updateScore();
    renderVocabQuestion();
  });

  document.getElementById('listenVocabQuestion').addEventListener('click', function () {
    var current = vocabQuiz[vocabIndex];
    speakText(current.question + ' ' + current.options.join('. '));
  });

  function createSelectRows(targetId, items) {
    var box = document.getElementById(targetId);
    box.innerHTML = '';

    items.forEach(function (item, index) {
      var row = document.createElement('div');
      row.className = 'practice-row';

      var label = document.createElement('label');
      label.setAttribute('for', targetId + '-select-' + index);
      label.textContent = (index + 1) + '. ' + item.sentence;
      label.appendChild(createSpeakButton(function () {
        return item.sentence + ' Options: ' + item.options.join('. ');
      }, 'inline-speak'));

      var select = document.createElement('select');
      select.id = targetId + '-select-' + index;
      select.innerHTML = '<option value="">Choose...</option>';
      item.options.forEach(function (option) {
        var opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
      });

      var feedback = document.createElement('div');
      feedback.className = 'row-feedback';
      feedback.id = targetId + '-feedback-' + index;

      row.appendChild(label);
      row.appendChild(select);
      row.appendChild(feedback);
      box.appendChild(row);
    });
  }

  function createChoiceRows(targetId, items) {
    var box = document.getElementById(targetId);
    box.innerHTML = '';

    items.forEach(function (item, index) {
      var row = document.createElement('div');
      row.className = 'practice-row';

      var label = document.createElement('label');
      label.setAttribute('for', targetId + '-select-' + index);
      label.textContent = (index + 1) + '. ' + item.prompt;
      label.appendChild(createSpeakButton(function () {
        return item.prompt + ' Options: ' + item.options.join('. ');
      }, 'inline-speak'));

      var select = document.createElement('select');
      select.id = targetId + '-select-' + index;
      select.innerHTML = '<option value="">Choose...</option>';
      item.options.forEach(function (option, optionIndex) {
        var opt = document.createElement('option');
        opt.value = String(optionIndex);
        opt.textContent = option;
        select.appendChild(opt);
      });

      var feedback = document.createElement('div');
      feedback.className = 'row-feedback';
      feedback.id = targetId + '-feedback-' + index;

      row.appendChild(label);
      row.appendChild(select);
      row.appendChild(feedback);
      box.appendChild(row);
    });
  }

  function gradeSelectSection(targetId, items, keyName, summaryId) {
    var sectionScore = 0;

    items.forEach(function (item, index) {
      var select = document.getElementById(targetId + '-select-' + index);
      var feedback = document.getElementById(targetId + '-feedback-' + index);
      var value = select.value;

      if (value === item.answer) {
        sectionScore += 1;
        feedback.className = 'row-feedback good';
        feedback.textContent = '✓ Correct';
      } else {
        feedback.className = 'row-feedback bad';
        feedback.textContent = '✗ Correct answer: ' + item.answer;
      }
    });

    scoreState[keyName] = sectionScore;
    updateScore();

    var summary = document.getElementById(summaryId);
    summary.className = sectionScore === items.length ? 'feedback good' : 'feedback';
    summary.textContent = 'Section score: ' + sectionScore + ' / ' + items.length;
  }

  function gradeChoiceSection(targetId, items, keyName, summaryId) {
    var sectionScore = 0;

    items.forEach(function (item, index) {
      var select = document.getElementById(targetId + '-select-' + index);
      var feedback = document.getElementById(targetId + '-feedback-' + index);
      var value = select.value;

      if (value !== '' && Number(value) === item.answer) {
        sectionScore += 1;
        feedback.className = 'row-feedback good';
        feedback.textContent = '✓ Correct';
      } else {
        feedback.className = 'row-feedback bad';
        feedback.textContent = '✗ Correct answer: ' + item.options[item.answer];
      }
    });

    scoreState[keyName] = sectionScore;
    updateScore();

    var summary = document.getElementById(summaryId);
    summary.className = sectionScore === items.length ? 'feedback good' : 'feedback';
    summary.textContent = 'Section score: ' + sectionScore + ' / ' + items.length;
  }

  function resetSectionSelects(targetId, items, keyName, summaryId) {
    items.forEach(function (item, index) {
      var select = document.getElementById(targetId + '-select-' + index);
      var feedback = document.getElementById(targetId + '-feedback-' + index);
      select.value = '';
      feedback.className = 'row-feedback';
      feedback.textContent = '';
    });
    scoreState[keyName] = 0;
    updateScore();
    var summary = document.getElementById(summaryId);
    summary.className = 'feedback';
    summary.textContent = 'Choose your answers, then check the section.';
  }

  document.getElementById('checkPrepositions').addEventListener('click', function () {
    gradeSelectSection('prepositionList', prepositionItems, 'prepositions', 'prepositionSummary');
  });

  document.getElementById('resetPrepositions').addEventListener('click', function () {
    resetSectionSelects('prepositionList', prepositionItems, 'prepositions', 'prepositionSummary');
  });

  document.getElementById('checkGrammar').addEventListener('click', function () {
    gradeSelectSection('grammarList', grammarItems, 'grammar', 'grammarSummary');
  });

  document.getElementById('resetGrammar').addEventListener('click', function () {
    resetSectionSelects('grammarList', grammarItems, 'grammar', 'grammarSummary');
  });

  document.getElementById('checkTransform').addEventListener('click', function () {
    gradeChoiceSection('transformList', transformItems, 'transform', 'transformSummary');
  });

  document.getElementById('resetTransform').addEventListener('click', function () {
    resetSectionSelects('transformList', transformItems, 'transform', 'transformSummary');
  });

  document.getElementById('toggleIdeas').addEventListener('click', function () {
    var panel = document.getElementById('ideaBank');
    var hidden = panel.hasAttribute('hidden');
    if (hidden) {
      panel.removeAttribute('hidden');
      this.textContent = 'Hide idea bank';
    } else {
      panel.setAttribute('hidden', 'hidden');
      this.textContent = 'Show idea bank';
    }
  });

  document.getElementById('toggleModel').addEventListener('click', function () {
    var panel = document.getElementById('modelAnswer');
    var hidden = panel.hasAttribute('hidden');
    if (hidden) {
      panel.removeAttribute('hidden');
      this.textContent = 'Hide model answer';
    } else {
      panel.setAttribute('hidden', 'hidden');
      this.textContent = 'Reveal model answer';
    }
  });

  document.getElementById('clearWriting').addEventListener('click', function () {
    document.getElementById('introWriting').value = '';
  });

  document.getElementById('listenModelAnswer').addEventListener('click', function () {
    var text = document.querySelector('#modelAnswer p:last-child').textContent;
    speakText(text);
  });

  document.getElementById('accentUK').addEventListener('click', function () {
    accentState.lang = 'en-GB';
    accentState.label = 'British English';
    updateVoiceStatus();
  });

  document.getElementById('accentUS').addEventListener('click', function () {
    accentState.lang = 'en-US';
    accentState.label = 'American English';
    updateVoiceStatus();
  });

  document.getElementById('stopAudio').addEventListener('click', function () {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  });

  if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoiceStatus;
  }

  createSelectRows('prepositionList', prepositionItems);
  createSelectRows('grammarList', grammarItems);
  createChoiceRows('transformList', transformItems);
  document.getElementById('prepositionSummary').textContent = 'Choose your answers, then check the section.';
  document.getElementById('grammarSummary').textContent = 'Choose your answers, then check the section.';
  document.getElementById('transformSummary').textContent = 'Choose your answers, then check the section.';
  updateVoiceStatus();
  updateScore();
  renderFlashcard();
  renderVocabQuestion();
  attachSpeakButtons();
});
