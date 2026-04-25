(function () {
  'use strict';

  var shared = window.YanisShared;
  var maxScore = 24;
  var sectionScores = { vocab: 0, be: 0, present: 0 };

  var flashcards = [
    { tag: 'Job', front: 'receptionist', translation: 'réceptionniste', definition: 'a person who welcomes and helps guests at reception', example: 'I work as a receptionist in a hotel.' },
    { tag: 'Place', front: 'three-star hotel', translation: 'hôtel trois étoiles', definition: 'a hotel with a three-star category', example: 'I work in a three-star hotel.' },
    { tag: 'Task', front: 'welcome guests', translation: 'accueillir les clients', definition: 'receive guests in a professional way', example: 'I welcome guests every day.' },
    { tag: 'Task', front: 'reply to emails', translation: 'répondre aux e-mails', definition: 'send answers by email', example: 'I reply to emails in English.' },
    { tag: 'Task', front: 'answer the phone', translation: 'répondre au téléphone', definition: 'speak to callers on the phone', example: 'I answer the phone at reception.' },
    { tag: 'Task', front: 'make reservations', translation: 'faire des réservations', definition: 'book rooms or services for guests', example: 'I make reservations for customers.' },
    { tag: 'Preposition', front: 'on the phone', translation: 'au téléphone', definition: 'used for phone communication', example: 'I use English on the phone.' },
    { tag: 'Preposition', front: 'by email', translation: 'par e-mail', definition: 'used for the communication method', example: 'I often communicate by email.' },
    { tag: 'Goal', front: 'become a steward', translation: 'devenir steward', definition: 'work as cabin crew on a plane', example: 'I want to become a steward.' },
    { tag: 'Expression', front: 'customer contact', translation: 'contact avec les clients', definition: 'communication and interaction with customers', example: 'I enjoy customer contact.' }
  ];

  var vocabQuiz = [
    { q: 'What does “receptionist” mean?', choices: ['a person who welcomes and helps guests', 'a pilot', 'a passenger'], a: 0, exp: 'A receptionist welcomes and helps guests.' },
    { q: 'Choose the best meaning of “reply to emails”.', choices: ['delete emails', 'send answers by email', 'open a reservation'], a: 1, exp: 'Reply to emails = send answers by email.' },
    { q: 'What does “make reservations” mean?', choices: ['make bookings', 'serve breakfast', 'clean rooms'], a: 0, exp: 'Reservations are bookings.' },
    { q: 'Which expression is correct?', choices: ['in the phone', 'on the phone', 'at the phone'], a: 1, exp: 'We say on the phone.' },
    { q: 'Which expression is correct?', choices: ['with email', 'in email', 'by email'], a: 2, exp: 'We say by email.' },
    { q: 'What does “become a steward” mean?', choices: ['work as cabin crew', 'work at reception', 'become a chef'], a: 0, exp: 'A steward works with passengers as cabin crew.' }
  ];

  var beItems = [
    { sentence: 'I ___ twenty-five years old.', options: ['am', 'is', 'are'], answer: 'am' },
    { sentence: 'You ___ ready.', options: ['am', 'are', 'is'], answer: 'are' },
    { sentence: 'He ___ a receptionist.', options: ['are', 'is', 'am'], answer: 'is' },
    { sentence: 'We ___ not late.', options: ['is', 'are', 'am'], answer: 'are' },
    { sentence: '___ you in Schiltigheim?', options: ['Am', 'Are', 'Do'], answer: 'Are' },
    { sentence: 'I ___ not a steward yet.', options: ['am', 'are', 'do'], answer: 'am' }
  ];

  var presentItems = [
    { sentence: 'I ___ in a hotel.', options: ['work', 'works', 'am work'], answer: 'work' },
    { sentence: 'He ___ guests every day.', options: ['welcome', 'welcomes', 'is welcome'], answer: 'welcomes' },
    { sentence: 'I ___ the phone.', options: ['answer', 'answers', 'am answer'], answer: 'answer' },
    { sentence: 'She ___ by email.', options: ['reply', 'replies', 'is reply'], answer: 'replies' },
    { sentence: 'We ___ reservations.', options: ['make', 'makes', 'making'], answer: 'make' },
    { sentence: 'They ___ English at work.', options: ['use', 'uses', 'are use'], answer: 'use' }
  ];

  var flashIndex = 0;
  var flashFront = true;
  var vocabIndex = 0;
  var vocabDone = new Array(vocabQuiz.length).fill(false);

  function totalScore() {
    return sectionScores.vocab + sectionScores.be + sectionScores.present;
  }

  function updateScore() {
    var text = totalScore() + ' / ' + maxScore;
    document.getElementById('scoreDisplay').textContent = text;
    document.getElementById('scoreDisplayBottom').textContent = text;
  }

  function renderFlashcard() {
    var card = flashcards[flashIndex];
    document.getElementById('flashcardCounter').textContent = (flashIndex + 1) + ' / ' + flashcards.length;
    document.getElementById('flashTag').textContent = card.tag;
    document.getElementById('flashMain').textContent = card.front;
    document.getElementById('flashSub').textContent = flashFront ? 'tap to flip' : 'back side';
    document.getElementById('flashTranslation').textContent = 'FR: ' + card.translation;
    document.getElementById('flashDefinition').textContent = card.definition;
    document.getElementById('flashExample').textContent = card.example;
    document.getElementById('flashFrontView').hidden = !flashFront;
    document.getElementById('flashBackView').hidden = flashFront;
  }

  function toggleFlash() {
    flashFront = !flashFront;
    renderFlashcard();
  }

  function randomizeQuestion(q) {
    var pairs = q.choices.map(function (choice, idx) { return { text: choice, ok: idx === q.a }; });
    pairs = shared.shuffle(pairs);
    return { q: q.q, pairs: pairs, exp: q.exp };
  }

  var currentVocab = randomizeQuestion(vocabQuiz[vocabIndex]);

  function renderVocabQuestion() {
    currentVocab = randomizeQuestion(vocabQuiz[vocabIndex]);
    document.getElementById('vocabQuestionNumber').textContent = 'Question ' + (vocabIndex + 1) + ' / ' + vocabQuiz.length;
    document.getElementById('vocabQuestion').textContent = currentVocab.q;
    var box = document.getElementById('vocabOptions');
    box.innerHTML = '';
    document.getElementById('vocabFeedback').className = 'feedback';
    document.getElementById('vocabFeedback').textContent = '';
    currentVocab.pairs.forEach(function (pair) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.textContent = pair.text;
      btn.addEventListener('click', function () {
        if (box.dataset.locked === 'yes') { return; }
        box.dataset.locked = 'yes';
        var feedback = document.getElementById('vocabFeedback');
        if (pair.ok) {
          btn.classList.add('correct');
          feedback.className = 'feedback show ok';
          feedback.textContent = 'Correct — ' + currentVocab.exp;
          if (!vocabDone[vocabIndex]) {
            vocabDone[vocabIndex] = true;
            sectionScores.vocab += 1;
            updateScore();
          }
        } else {
          btn.classList.add('wrong');
          feedback.className = 'feedback show no';
          feedback.textContent = 'Not this time — ' + currentVocab.exp;
          Array.prototype.slice.call(box.children).forEach(function (child, idx) {
            if (currentVocab.pairs[idx].ok) { child.classList.add('correct'); }
          });
        }
      });
      box.appendChild(btn);
    });
    box.dataset.locked = 'no';
  }

  function renderSelectPractice(targetId, items) {
    var root = document.getElementById(targetId);
    root.innerHTML = '';
    items.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'exercise-row';
      var label = document.createElement('label');
      label.textContent = item.sentence;
      row.appendChild(label);
      var select = document.createElement('select');
      select.setAttribute('data-answer', item.answer);
      var starter = document.createElement('option');
      starter.value = '';
      starter.textContent = 'Choose...';
      select.appendChild(starter);
      shared.shuffle(item.options).forEach(function (optionText) {
        var option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        select.appendChild(option);
      });
      row.appendChild(select);
      root.appendChild(row);
    });
  }

  function checkPractice(targetId, items, feedbackId, scoreKey) {
    var root = document.getElementById(targetId);
    var correct = 0;
    Array.prototype.slice.call(root.querySelectorAll('select')).forEach(function (select) {
      if (select.value === select.getAttribute('data-answer')) {
        correct += 1;
        select.style.borderColor = '#1f8a3b';
      } else {
        select.style.borderColor = '#cc334d';
      }
    });
    sectionScores[scoreKey] = correct;
    updateScore();
    var feedback = document.getElementById(feedbackId);
    feedback.className = 'feedback show ' + (correct === items.length ? 'ok' : 'no');
    feedback.textContent = 'You got ' + correct + ' / ' + items.length + ' correct.';
  }

  function resetPractice(targetId, items, feedbackId, scoreKey) {
    renderSelectPractice(targetId, items);
    sectionScores[scoreKey] = 0;
    updateScore();
    var feedback = document.getElementById(feedbackId);
    feedback.className = 'feedback';
    feedback.textContent = '';
  }

  function initModel() {
    document.getElementById('toggleModel').addEventListener('click', function () {
      var panel = document.getElementById('modelPanel');
      panel.hidden = !panel.hidden;
    });
  }

  function init() {
    shared.init();
    updateScore();
    renderFlashcard();
    renderVocabQuestion();
    renderSelectPractice('bePractice', beItems);
    renderSelectPractice('presentPractice', presentItems);
    initModel();

    document.getElementById('flashcard').addEventListener('click', toggleFlash);
    document.getElementById('flipFlashcard').addEventListener('click', toggleFlash);
    document.getElementById('prevFlashcard').addEventListener('click', function () { flashIndex = (flashIndex - 1 + flashcards.length) % flashcards.length; flashFront = true; renderFlashcard(); });
    document.getElementById('nextFlashcard').addEventListener('click', function () { flashIndex = (flashIndex + 1) % flashcards.length; flashFront = true; renderFlashcard(); });
    document.getElementById('shuffleFlashcards').addEventListener('click', function () { flashcards = shared.shuffle(flashcards); flashIndex = 0; flashFront = true; renderFlashcard(); });
    document.getElementById('listenFlashcard').addEventListener('click', function () { shared.speak(flashcards[flashIndex].front + '. ' + flashcards[flashIndex].example); });

    document.getElementById('listenVocabQuestion').addEventListener('click', function () { shared.speak(document.getElementById('vocabQuestion').textContent); });
    document.getElementById('nextVocabQuestion').addEventListener('click', function () { vocabIndex = (vocabIndex + 1) % vocabQuiz.length; renderVocabQuestion(); });
    document.getElementById('resetVocabQuiz').addEventListener('click', function () {
      vocabDone = new Array(vocabQuiz.length).fill(false);
      sectionScores.vocab = 0;
      updateScore();
      vocabIndex = 0;
      renderVocabQuestion();
    });

    document.getElementById('checkBePractice').addEventListener('click', function () { checkPractice('bePractice', beItems, 'beFeedback', 'be'); });
    document.getElementById('resetBePractice').addEventListener('click', function () { resetPractice('bePractice', beItems, 'beFeedback', 'be'); });
    document.getElementById('checkPresentPractice').addEventListener('click', function () { checkPractice('presentPractice', presentItems, 'presentFeedback', 'present'); });
    document.getElementById('resetPresentPractice').addEventListener('click', function () { resetPractice('presentPractice', presentItems, 'presentFeedback', 'present'); });
  }

  document.addEventListener('DOMContentLoaded', init);
})();