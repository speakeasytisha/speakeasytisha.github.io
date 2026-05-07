(function () {
  'use strict';

  var flashcards = [
    {
      term: 'friendly',
      translation: 'aimable / sympathique',
      definition: 'kind and pleasant with people',
      example: 'I am a friendly receptionist.',
      speak: 'friendly. I am a friendly receptionist.'
    },
    {
      term: 'professional',
      translation: 'professionnel',
      definition: 'serious, organised, and appropriate at work',
      example: 'I want to sound professional in English.',
      speak: 'professional. I want to sound professional in English.'
    },
    {
      term: 'clearly',
      translation: 'clairement',
      definition: 'in a way that is easy to understand',
      example: 'I explain things clearly.',
      speak: 'clearly. I explain things clearly.'
    },
    {
      term: 'quickly',
      translation: 'rapidement',
      definition: 'in a fast way',
      example: 'I answer emails quickly.',
      speak: 'quickly. I answer emails quickly.'
    },
    {
      term: 'politely',
      translation: 'poliment',
      definition: 'in a respectful and courteous way',
      example: 'I speak politely to guests.',
      speak: 'politely. I speak politely to guests.'
    },
    {
      term: 'usually',
      translation: 'habituellement',
      definition: 'most of the time',
      example: 'I usually answer the phone.',
      speak: 'usually. I usually answer the phone.'
    },
    {
      term: 'often',
      translation: 'souvent',
      definition: 'many times or regularly',
      example: 'I often use English by email.',
      speak: 'often. I often use English by email.'
    },
    {
      term: 'calm',
      translation: 'calme',
      definition: 'not stressed or aggressive',
      example: 'I stay calm with customers.',
      speak: 'calm. I stay calm with customers.'
    },
    {
      term: 'helpful',
      translation: 'serviable / utile',
      definition: 'ready to help other people',
      example: 'A good steward is helpful and calm.',
      speak: 'helpful. A good steward is helpful and calm.'
    },
    {
      term: 'How can I help you today?',
      translation: 'Comment puis-je vous aider aujourd’hui ?',
      definition: 'a useful and professional sentence to welcome someone',
      example: 'How can I help you today?',
      speak: 'How can I help you today?'
    }
  ];

  var bestSentenceData = [
    {
      prompt: 'Choose the sentence with the best English word order.',
      guide: 'Focus on: subject + verb + object + place + time',
      guideFr: 'Focus : sujet + verbe + complément + lieu + temps',
      answer: 'I answer customer emails at the hotel every day.',
      options: [
        'I answer customer emails at the hotel every day.',
        'At the hotel I answer every day customer emails.',
        'I every day answer customer emails at the hotel.'
      ]
    },
    {
      prompt: 'Choose the sentence that sounds natural for work.',
      guide: 'Focus on: adjective before noun',
      guideFr: 'Focus : adjectif avant le nom',
      answer: 'I am a friendly and professional receptionist.',
      options: [
        'I am a receptionist friendly and professional.',
        'I am a friendly and professional receptionist.',
        'I am friendly a professional receptionist.'
      ]
    },
    {
      prompt: 'Choose the sentence that sounds natural for the exam.',
      guide: 'Focus on: frequency before the main verb',
      guideFr: 'Focus : fréquence avant le verbe principal',
      answer: 'I often use English by email.',
      options: [
        'I use often English by email.',
        'I often use English by email.',
        'Often I use English by email.'
      ]
    },
    {
      prompt: 'Choose the best welcome sentence.',
      guide: 'Focus on: professional help language',
      guideFr: 'Focus : langage professionnel pour aider',
      answer: 'Good afternoon. How can I help you today?',
      options: [
        'Good afternoon. How can I help you today?',
        'Good afternoon. How I can help you today?',
        'Good afternoon. Help you today how can I?'
      ]
    },
    {
      prompt: 'Choose the best sentence to describe your routine.',
      guide: 'Focus on: adverb + clear place information',
      guideFr: 'Focus : adverbe + information claire sur le lieu',
      answer: 'I usually speak to guests at reception.',
      options: [
        'I speak usually to guests at reception.',
        'Usually I speak guests at reception.',
        'I usually speak to guests at reception.'
      ]
    },
    {
      prompt: 'Choose the best sentence to talk about your goal.',
      guide: 'Focus on: clear and simple professional English',
      guideFr: 'Focus : anglais professionnel clair et simple',
      answer: 'My goal is to become a steward.',
      options: [
        'My goal is to become a steward.',
        'My goal become steward is.',
        'I goal is become a steward.'
      ]
    }
  ];

  var adjAdvData = [
    { prompt: 'I am a ____ receptionist.', answer: 'friendly', options: ['friendly', 'friendlyly', 'friendlily'] },
    { prompt: 'I answer emails ____.', answer: 'quickly', options: ['quick', 'quickly', 'quickness'] },
    { prompt: 'I speak to guests ____.', answer: 'politely', options: ['polite', 'politely', 'politness'] },
    { prompt: 'I am a ____ person under pressure.', answer: 'calm', options: ['calm', 'calmly', 'calmness'] },
    { prompt: 'I explain the procedure ____.', answer: 'clearly', options: ['clear', 'clearly', 'clearness'] },
    { prompt: 'She is a ____ customer service agent.', answer: 'helpful', options: ['helpful', 'helpfully', 'helpfulness'] }
  ];

  var frequencyData = [
    { prompt: 'I ____ answer the phone in English.', answer: 'often' },
    { prompt: 'I am ____ polite with customers.', answer: 'always' },
    { prompt: 'I ____ use English by email.', answer: 'usually' },
    { prompt: 'I am ____ stressed, but I stay calm.', answer: 'sometimes' },
    { prompt: 'I ____ ignore a customer.', answer: 'never' }
  ];

  var introLineData = [
    {
      prompt: 'Choose the best sentence to start your introduction.',
      guide: 'Focus on: simple and professional self-introduction',
      guideFr: 'Focus : présentation simple et professionnelle',
      answer: 'My name is Yanis. I work as a receptionist in a three-star hotel.',
      options: [
        'My name is Yanis. I work as a receptionist in a three-star hotel.',
        'My name Yanis and I work receptionist in hotel three stars.',
        'I am Yanis and work a receptionist in a hotel three stars.'
      ]
    },
    {
      prompt: 'Choose the best sentence to describe your strength.',
      guide: 'Focus on: adjective order and job style',
      guideFr: 'Focus : ordre des adjectifs et style professionnel',
      answer: 'I am friendly, calm, and professional with customers.',
      options: [
        'I am friendly, calm, and professional with customers.',
        'I am with customers friendly, calm, and professional.',
        'I am professional and calm with friendly customers.'
      ]
    },
    {
      prompt: 'Choose the best sentence to describe when you use English.',
      guide: 'Focus on: frequency + place',
      guideFr: 'Focus : fréquence + lieu',
      answer: 'I often use English by email and on the phone.',
      options: [
        'I use often English by email and on the phone.',
        'I often use English by email and on the phone.',
        'By email and on the phone I use often English.'
      ]
    },
    {
      prompt: 'Choose the best sentence to explain your goal.',
      guide: 'Focus on: simple goal language',
      guideFr: 'Focus : langage simple pour l’objectif',
      answer: 'My goal is to become a steward.',
      options: [
        'My goal is to become a steward.',
        'My goal to become steward is.',
        'I have goal for become steward.'
      ]
    }
  ];

  var helpLineData = [
    {
      prompt: 'Choose the best sentence to welcome a passenger.',
      guide: 'Focus on: polite and simple welcome',
      guideFr: 'Focus : accueil poli et simple',
      answer: 'Good afternoon. Welcome. How can I help you today?',
      options: [
        'Good afternoon. Welcome. How can I help you today?',
        'Good afternoon. Welcome. How I help you today?',
        'Welcome. Today I can help you how?'
      ]
    },
    {
      prompt: 'Choose the best sentence to ask about the problem.',
      guide: 'Focus on: clear help question',
      guideFr: 'Focus : question claire pour aider',
      answer: 'What seems to be the problem?',
      options: [
        'What seems to be the problem?',
        'What problem it seems?',
        'Which is the problem for you are?'
      ]
    },
    {
      prompt: 'Choose the best sentence to ask for repetition.',
      guide: 'Focus on: clarification language',
      guideFr: 'Focus : langage de clarification',
      answer: 'Could you repeat that, please?',
      options: [
        'Could you repeat that, please?',
        'Can you repeat me that?',
        'Repeat that me please.'
      ]
    },
    {
      prompt: 'Choose the best sentence to reassure someone.',
      guide: 'Focus on: calm and professional support',
      guideFr: 'Focus : soutien calme et professionnel',
      answer: 'I am here to help you.',
      options: [
        'I am here to help you.',
        'I here help you.',
        'I am here for helping you now.'
      ]
    }
  ];

  var score = {
    total: bestSentenceData.length + adjAdvData.length + frequencyData.length + introLineData.length + helpLineData.length,
    current: 0,
    done: {}
  };

  var flashIndex = 0;
  var flashFlipped = false;

  function setScore() {
    document.getElementById('scoreNow').textContent = String(score.current);
    document.getElementById('scoreTotal').textContent = String(score.total);
    document.getElementById('scoreBottom').textContent = String(score.current);
    document.getElementById('scoreBottomTotal').textContent = String(score.total);
  }

  function addPointOnce(key) {
    if (!score.done[key]) {
      score.done[key] = true;
      score.current += 1;
      setScore();
    }
  }

  function renderFlashcard() {
    var card = flashcards[flashIndex];
    var shell = document.getElementById('flashCard');
    document.getElementById('flashIndex').textContent = String(flashIndex + 1);
    document.getElementById('flashTotal').textContent = String(flashcards.length);

    if (!flashFlipped) {
      shell.innerHTML = '' +
        '<div class="flash-topline">Vocabulary</div>' +
        '<div class="flash-main">' + card.term + '</div>' +
        '<div class="flash-sub">Tap to flip the card.<br><span class="fr-sub">Appuie pour retourner la carte.</span></div>';
    } else {
      shell.innerHTML = '' +
        '<div class="flash-topline">Vocabulary</div>' +
        '<div class="flash-main" style="font-size:1.8rem;">' + card.term + '</div>' +
        '<div class="flash-translation">' + card.translation + '</div>' +
        '<div class="flash-definition">' + card.definition + '</div>' +
        '<div class="flash-example-label">Example</div>' +
        '<div class="flash-example">' + card.example + '</div>';
    }
  }

  function bindFlashcards() {
    document.getElementById('flashCard').addEventListener('click', function () {
      flashFlipped = !flashFlipped;
      renderFlashcard();
    });
    document.getElementById('flashPrev').addEventListener('click', function () {
      flashIndex = (flashIndex - 1 + flashcards.length) % flashcards.length;
      flashFlipped = false;
      renderFlashcard();
    });
    document.getElementById('flashNext').addEventListener('click', function () {
      flashIndex = (flashIndex + 1) % flashcards.length;
      flashFlipped = false;
      renderFlashcard();
    });
    document.getElementById('flashSpeak').addEventListener('click', function () {
      if (window.YanisShared && window.YanisShared.speak) {
        window.YanisShared.speak(flashcards[flashIndex].speak);
      }
    });
  }

  function createMCQ(question, idx, type, instructions, frInstructions) {
    var wrap = document.createElement('div');
    wrap.className = 'exercise-row';

    var heading = document.createElement('div');
    heading.className = 'exercise-heading';
    heading.innerHTML = '<strong>' + (idx + 1) + '. ' + instructions + '</strong><br><span class="fr-sub">' + frInstructions + '</span>';
    wrap.appendChild(heading);

    var sentence = document.createElement('div');
    sentence.className = 'sentence';
    sentence.innerHTML = '<div class="prompt-line">' + question.prompt + '</div>' +
      '<div class="guide-line">' + question.guide + '</div>' +
      '<div class="fr-sub">' + question.guideFr + '</div>';
    wrap.appendChild(sentence);

    var optionsWrap = document.createElement('div');
    optionsWrap.className = 'option-grid';
    var shuffled = window.YanisShared.shuffle(question.options);

    shuffled.forEach(function (option) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.textContent = option;
      btn.addEventListener('click', function () {
        if (btn.classList.contains('correct') || btn.classList.contains('wrong')) {
          return;
        }
        if (option === question.answer) {
          btn.classList.add('correct');
          addPointOnce(type + '-' + idx);
          feedback.className = 'feedback ok show';
          feedback.innerHTML = 'Correct ✅<br><span class="fr-sub">Bonne réponse.</span>';
        } else {
          btn.classList.add('wrong');
          feedback.className = 'feedback no show';
          feedback.innerHTML = 'Try again. The correct answer is <strong>' + question.answer + '</strong>.<br><span class="fr-sub">Réessaie. La bonne réponse est <strong>' + question.answer + '</strong>.</span>';
          Array.prototype.forEach.call(optionsWrap.querySelectorAll('.option-btn'), function (b) {
            if (b.textContent === question.answer) {
              b.classList.add('correct');
            }
          });
        }
      });
      optionsWrap.appendChild(btn);
    });

    wrap.appendChild(optionsWrap);

    var feedback = document.createElement('div');
    feedback.className = 'feedback';
    wrap.appendChild(feedback);
    return wrap;
  }

  function createAdjAdv(question, idx) {
    var wrap = document.createElement('div');
    wrap.className = 'exercise-row';

    var heading = document.createElement('div');
    heading.className = 'exercise-heading';
    heading.innerHTML = '<strong>' + (idx + 1) + '. Choose the correct word.</strong><br><span class="fr-sub">Choisis le bon mot.</span>';
    wrap.appendChild(heading);

    var sentence = document.createElement('div');
    sentence.className = 'sentence';
    sentence.innerHTML = question.prompt;
    wrap.appendChild(sentence);

    var optionsWrap = document.createElement('div');
    optionsWrap.className = 'option-grid';
    window.YanisShared.shuffle(question.options).forEach(function (option) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.textContent = option;
      btn.addEventListener('click', function () {
        if (btn.classList.contains('correct') || btn.classList.contains('wrong')) {
          return;
        }
        if (option === question.answer) {
          btn.classList.add('correct');
          addPointOnce('adjadv-' + idx);
          feedback.className = 'feedback ok show';
          feedback.innerHTML = 'Correct ✅<br><span class="fr-sub">Bonne réponse.</span>';
        } else {
          btn.classList.add('wrong');
          feedback.className = 'feedback no show';
          feedback.innerHTML = 'Try again. The correct answer is <strong>' + question.answer + '</strong>.<br><span class="fr-sub">Réessaie. La bonne réponse est <strong>' + question.answer + '</strong>.</span>';
          Array.prototype.forEach.call(optionsWrap.querySelectorAll('.option-btn'), function (b) {
            if (b.textContent === question.answer) {
              b.classList.add('correct');
            }
          });
        }
      });
      optionsWrap.appendChild(btn);
    });
    wrap.appendChild(optionsWrap);
    var feedback = document.createElement('div');
    feedback.className = 'feedback';
    wrap.appendChild(feedback);
    return wrap;
  }

  function frequencyOptions(question) {
    if (question.prompt.indexOf('I am ____') === 0) {
      return [
        'I am ' + question.answer + ' polite with customers.',
        'I ' + question.answer + ' am polite with customers.',
        question.answer + ' I am polite with customers.'
      ];
    }
    if (question.prompt.indexOf('I ____ use English') === 0) {
      return [
        'I use English ' + question.answer + ' by email.',
        'I ' + question.answer + ' use English by email.',
        question.answer + ' I use English by email.'
      ];
    }
    if (question.prompt.indexOf('I ____ answer') === 0) {
      return [
        'I answer the phone ' + question.answer + ' in English.',
        'I ' + question.answer + ' answer the phone in English.',
        question.answer + ' I answer the phone in English.'
      ];
    }
    if (question.prompt.indexOf('I ____ ignore') === 0) {
      return [
        'I ignore a customer ' + question.answer + '.',
        'I ' + question.answer + ' ignore a customer.',
        question.answer + ' I ignore a customer.'
      ];
    }
    return [
      'I am stressed ' + question.answer + ', but I stay calm.',
      'I am ' + question.answer + ' stressed, but I stay calm.',
      question.answer + ' I am stressed, but I stay calm.'
    ];
  }

  function frequencyAnswer(question) {
    if (question.prompt.indexOf('I am ____') === 0) {
      return 'I am ' + question.answer + ' polite with customers.';
    }
    if (question.prompt.indexOf('I ____ use English') === 0) {
      return 'I ' + question.answer + ' use English by email.';
    }
    if (question.prompt.indexOf('I ____ answer') === 0) {
      return 'I ' + question.answer + ' answer the phone in English.';
    }
    if (question.prompt.indexOf('I ____ ignore') === 0) {
      return 'I ' + question.answer + ' ignore a customer.';
    }
    return 'I am ' + question.answer + ' stressed, but I stay calm.';
  }

  function createFrequency(question, idx) {
    var wrap = document.createElement('div');
    wrap.className = 'exercise-row';

    var heading = document.createElement('div');
    heading.className = 'exercise-heading';
    heading.innerHTML = '<strong>' + (idx + 1) + '. Choose the best place for the frequency word.</strong><br><span class="fr-sub">Choisis la meilleure place pour le mot de fréquence.</span>';
    wrap.appendChild(heading);

    var sentence = document.createElement('div');
    sentence.className = 'sentence';
    sentence.innerHTML = question.prompt;
    wrap.appendChild(sentence);

    var optionsWrap = document.createElement('div');
    optionsWrap.className = 'option-grid';
    var patterns = frequencyOptions(question);
    var answer = frequencyAnswer(question);

    window.YanisShared.shuffle(patterns).forEach(function (option) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.textContent = option;
      btn.addEventListener('click', function () {
        if (btn.classList.contains('correct') || btn.classList.contains('wrong')) {
          return;
        }
        if (option === answer) {
          btn.classList.add('correct');
          addPointOnce('freq-' + idx);
          feedback.className = 'feedback ok show';
          feedback.innerHTML = 'Correct ✅<br><span class="fr-sub">Bonne place pour le mot de fréquence.</span>';
        } else {
          btn.classList.add('wrong');
          feedback.className = 'feedback no show';
          feedback.innerHTML = 'Try again. The best sentence is <strong>' + answer + '</strong>.<br><span class="fr-sub">Réessaie. La meilleure phrase est <strong>' + answer + '</strong>.</span>';
          Array.prototype.forEach.call(optionsWrap.querySelectorAll('.option-btn'), function (b) {
            if (b.textContent === answer) {
              b.classList.add('correct');
            }
          });
        }
      });
      optionsWrap.appendChild(btn);
    });

    wrap.appendChild(optionsWrap);

    var feedback = document.createElement('div');
    feedback.className = 'feedback';
    wrap.appendChild(feedback);
    return wrap;
  }

  function renderAll() {
    var bestWrap = document.getElementById('bestSentenceWrap');
    bestSentenceData.forEach(function (item, idx) {
      bestWrap.appendChild(createMCQ(item, idx, 'best', 'Choose the best sentence.', 'Choisis la meilleure phrase.'));
    });

    var adjWrap = document.getElementById('adjAdvWrap');
    adjAdvData.forEach(function (item, idx) {
      adjWrap.appendChild(createAdjAdv(item, idx));
    });

    var freqWrap = document.getElementById('frequencyWrap');
    frequencyData.forEach(function (item, idx) {
      freqWrap.appendChild(createFrequency(item, idx));
    });

    var introWrap = document.getElementById('introWrap');
    introLineData.forEach(function (item, idx) {
      introWrap.appendChild(createMCQ(item, idx, 'intro', 'Choose the best introduction line.', 'Choisis la meilleure phrase pour ta présentation.'));
    });

    var helpWrap = document.getElementById('helpWrap');
    helpLineData.forEach(function (item, idx) {
      helpWrap.appendChild(createMCQ(item, idx, 'help', 'Choose the best help line.', 'Choisis la meilleure phrase pour aider ou clarifier.'));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (window.YanisShared && window.YanisShared.init) {
      window.YanisShared.init();
    }
    setScore();
    renderFlashcard();
    bindFlashcards();
    renderAll();
  });
})();
