(function () {
  'use strict';

  var flashcards = [
    {
      term: 'a receptionist',
      translation: 'un / une réceptionniste',
      definition: 'A person who welcomes guests and helps at reception.',
      example: 'I am a receptionist in a hotel.',
      speak: 'a receptionist. I am a receptionist in a hotel.'
    },
    {
      term: 'a guest',
      translation: 'un client / un hôte',
      definition: 'A person staying at a hotel.',
      example: 'I welcome a guest at the front desk.',
      speak: 'a guest. I welcome a guest at the front desk.'
    },
    {
      term: 'an email',
      translation: 'un e-mail',
      definition: 'A message sent electronically.',
      example: 'I write an email in English.',
      speak: 'an email. I write an email in English.'
    },
    {
      term: 'a reservation',
      translation: 'une réservation',
      definition: 'An arrangement for a room, seat, or service.',
      example: 'I make a reservation for a customer.',
      speak: 'a reservation. I make a reservation for a customer.'
    },
    {
      term: 'the phone',
      translation: 'le téléphone',
      definition: 'The work phone you answer.',
      example: 'I answer the phone every day.',
      speak: 'the phone. I answer the phone every day.'
    },
    {
      term: 'the front desk',
      translation: 'la réception',
      definition: 'The main desk where guests arrive and ask for help.',
      example: 'I work at the front desk.',
      speak: 'the front desk. I work at the front desk.'
    },
    {
      term: 'breakfast',
      translation: 'le petit déjeuner',
      definition: 'The morning meal.',
      example: 'On weekends, I serve breakfast.',
      speak: 'breakfast. On weekends, I serve breakfast.'
    },
    {
      term: 'hospitality',
      translation: 'l’hôtellerie / l’accueil',
      definition: 'The professional world of hotels, service, and guests.',
      example: 'I work in hospitality.',
      speak: 'hospitality. I work in hospitality.'
    }
  ];

  var mcqData = [
    { prompt: 'I am ___ receptionist.', answer: 'a', options: ['a', 'an', 'the', 'Ø'] },
    { prompt: 'I write ___ email in English.', answer: 'an', options: ['a', 'an', 'the', 'Ø'] },
    { prompt: 'I answer ___ phone at work.', answer: 'the', options: ['a', 'an', 'the', 'Ø'] },
    { prompt: 'On weekends, I serve ___ breakfast.', answer: 'Ø', options: ['a', 'an', 'the', 'Ø'] },
    { prompt: 'I work in ___ hotel.', answer: 'a', options: ['a', 'an', 'the', 'Ø'] },
    { prompt: 'He works at ___ airport.', answer: 'an', options: ['a', 'an', 'the', 'Ø'] }
  ];

  var bestSentenceData = [
    {
      prompt: 'Which sentence sounds correct and natural for your work English?',
      guide: 'Focus on: a + singular noun',
      guideFr: 'Focus : a + nom singulier',
      answer: 'I work in a hotel.',
      options: ['I work in hotel.', 'I work in a hotel.', 'I work in the hotel in general.']
    },
    {
      prompt: 'Which sentence sounds correct and natural for your work English?',
      guide: 'Focus on: the + specific thing',
      guideFr: 'Focus : the + chose précise',
      answer: 'I answer the phone.',
      options: ['I answer phone.', 'I answer the phone.', 'I answer a phone every day.']
    },
    {
      prompt: 'Which sentence sounds correct and natural for your work English?',
      guide: 'Focus on: an + vowel sound',
      guideFr: 'Focus : an + son voyelle',
      answer: 'I write an email.',
      options: ['I write a email.', 'I write email.', 'I write an email.']
    },
    {
      prompt: 'Which sentence sounds correct and natural for your work English?',
      guide: 'Focus on: no article for a general plural',
      guideFr: 'Focus : pas d’article pour un pluriel général',
      answer: 'I answer emails.',
      options: ['I answer the emails.', 'I answer emails.', 'I answer an emails.']
    }
  ];

  var score = {
    total: mcqData.length + bestSentenceData.length,
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
      if (window.YanisShared && window.YanisShared.speak) { window.YanisShared.speak(flashcards[flashIndex].speak); }
    });
  }

  function createOptions(question, idx, type) {
    var wrap = document.createElement('div');
    wrap.className = 'exercise-row';

    var heading = document.createElement('div');
    heading.className = 'exercise-heading';
    if (type === 'mcq') {
      heading.innerHTML = '<strong>' + (idx + 1) + '. Complete the sentence with the correct article.</strong><br><span class="fr-sub">Complète la phrase avec le bon article.</span>';
    } else {
      heading.innerHTML = '<strong>' + (idx + 1) + '. ' + question.prompt + '</strong><br><span class="fr-sub">Choisis la phrase correcte et la plus naturelle.</span>';
    }
    wrap.appendChild(heading);

    var sentence = document.createElement('div');
    sentence.className = 'sentence';
    if (type === 'mcq') {
      sentence.innerHTML = question.prompt;
    } else {
      sentence.innerHTML = '<div class="prompt-line">' + question.prompt + '</div><div class="guide-line">' + question.guide + '</div><div class="fr-sub">' + question.guideFr + '</div>';
    }
    wrap.appendChild(sentence);

    var optionsWrap = document.createElement('div');
    optionsWrap.className = 'option-grid';
    Array.prototype.forEach.call(window.YanisShared.shuffle(question.options), function (option) {
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

  function renderExercises() {
    var mcqWrap = document.getElementById('mcqWrap');
    Array.prototype.forEach.call(mcqData, function (q, idx) {
      var card = createOptions(q, idx, 'mcq');
      mcqWrap.appendChild(card);
    });

    var bestWrap = document.getElementById('bestSentenceWrap');
    Array.prototype.forEach.call(bestSentenceData, function (q, idx) {
      var card = createOptions(q, idx, 'best');
      bestWrap.appendChild(card);
    });
  }

  function bindModel() {
    var btn = document.getElementById('toggleModel');
    var panel = document.getElementById('modelBox');
    btn.addEventListener('click', function () {
      var hidden = panel.hasAttribute('hidden');
      if (hidden) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', 'hidden');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (window.YanisShared && window.YanisShared.init) { window.YanisShared.init(); }
    setScore();
    renderFlashcard();
    bindFlashcards();
    renderExercises();
    bindModel();
  });
})();
