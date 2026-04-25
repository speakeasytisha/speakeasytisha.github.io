(function () {
  'use strict';

  var flashcards = [
    {
      term: 'at the front desk',
      translation: 'à la réception',
      definition: 'At your work station in reception.',
      example: 'I work at the front desk every day.',
      speak: 'at the front desk. I work at the front desk every day.'
    },
    {
      term: 'in a hotel',
      translation: 'dans un hôtel',
      definition: 'Inside the hotel building or environment.',
      example: 'I work in a hotel in Schiltigheim.',
      speak: 'in a hotel. I work in a hotel in Schiltigheim.'
    },
    {
      term: 'on the phone',
      translation: 'au téléphone',
      definition: 'Speaking by telephone.',
      example: 'I use English on the phone.',
      speak: 'on the phone. I use English on the phone.'
    },
    {
      term: 'by email',
      translation: 'par e-mail',
      definition: 'Using email as the method of communication.',
      example: 'I often reply by email.',
      speak: 'by email. I often reply by email.'
    },
    {
      term: 'speak to guests',
      translation: 'parler aux clients',
      definition: 'Talk directly to the guests or customers.',
      example: 'I speak to guests at reception.',
      speak: 'speak to guests. I speak to guests at reception.'
    },
    {
      term: 'make reservations for customers',
      translation: 'faire des réservations pour les clients',
      definition: 'Book rooms or services for people.',
      example: 'I make reservations for customers.',
      speak: 'make reservations for customers. I make reservations for customers.'
    },
    {
      term: 'work with people',
      translation: 'travailler avec les gens',
      definition: 'Be in contact with people as part of the job.',
      example: 'I enjoy working with people.',
      speak: 'work with people. I enjoy working with people.'
    },
    {
      term: 'on board',
      translation: 'à bord',
      definition: 'Inside the aircraft as a passenger or crew member.',
      example: 'Cabin crew work on board.',
      speak: 'on board. Cabin crew work on board.'
    }
  ];

  var mcqData = [
    { prompt: 'I work ___ a hotel.', answer: 'at', options: ['at', 'in', 'on', 'by'] },
    { prompt: 'I work ___ reception.', answer: 'at', options: ['with', 'at', 'to', 'for'] },
    { prompt: 'I am ___ the lobby.', answer: 'in', options: ['in', 'on', 'for', 'to'] },
    { prompt: 'I use English ___ the phone.', answer: 'on', options: ['by', 'with', 'on', 'in'] },
    { prompt: 'I reply ___ email.', answer: 'by', options: ['at', 'by', 'for', 'to'] },
    { prompt: 'I speak ___ guests every day.', answer: 'to', options: ['to', 'for', 'with', 'on'] },
    { prompt: 'I make reservations ___ customers.', answer: 'for', options: ['for', 'at', 'on', 'in'] },
    { prompt: 'I like working ___ people.', answer: 'with', options: ['with', 'to', 'by', 'at'] }
  ];

  var bestSentenceData = [
    {
      prompt: 'Which sentence sounds correct and natural for your work English?',
      guide: 'Focus on: on the phone',
      guideFr: 'Focus : on the phone',
      answer: 'I speak English on the phone.',
      options: ['I speak English in the phone.', 'I speak English on the phone.', 'I speak English by the phone.']
    },
    {
      prompt: 'Which sentence sounds correct and natural for your work English?',
      guide: 'Focus on: by email',
      guideFr: 'Focus : by email',
      answer: 'I often reply by email.',
      options: ['I often reply by email.', 'I often reply on email.', 'I often reply in email.']
    },
    {
      prompt: 'Which sentence sounds correct and natural for your work English?',
      guide: 'Focus on: for + person',
      guideFr: 'Focus : for + personne',
      answer: 'I make reservations for guests.',
      options: ['I make reservations to guests.', 'I make reservations with guests.', 'I make reservations for guests.']
    },
    {
      prompt: 'Which sentence sounds correct and natural for your work English?',
      guide: 'Focus on: work with people',
      guideFr: 'Focus : work with people',
      answer: 'I enjoy working with people.',
      options: ['I enjoy working to people.', 'I enjoy working with people.', 'I enjoy working by people.']
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
      heading.innerHTML = '<strong>' + (idx + 1) + '. Complete the sentence with the correct preposition.</strong><br><span class="fr-sub">Complète la phrase avec la bonne préposition.</span>';
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
      mcqWrap.appendChild(createOptions(q, idx, 'mcq'));
    });

    var bestWrap = document.getElementById('bestSentenceWrap');
    Array.prototype.forEach.call(bestSentenceData, function (q, idx) {
      bestWrap.appendChild(createOptions(q, idx, 'best'));
    });
  }

  function bindModel() {
    var btn = document.getElementById('toggleModel');
    var panel = document.getElementById('modelBox');
    btn.addEventListener('click', function () {
      if (panel.hasAttribute('hidden')) {
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
