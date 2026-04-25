(function () {
  'use strict';

  var shared = window.YanisShared;
  var maxScore = 26;
  var sectionScores = { dodoes: 0, negative: 0, interview: 0 };

  var doDoesItems = [
    { sentence: '___ you work in a hotel?', options: ['Do', 'Does', 'Are'], answer: 'Do' },
    { sentence: '___ you use English by email?', options: ['Does', 'Do', 'Is'], answer: 'Do' },
    { sentence: '___ he answer the phone?', options: ['Do', 'Does', 'Is'], answer: 'Does' },
    { sentence: '___ your job include customer contact?', options: ['Do', 'Does', 'Are'], answer: 'Does' },
    { sentence: '___ they work on weekends?', options: ['Do', 'Does', 'Are'], answer: 'Do' },
    { sentence: '___ she use English every day?', options: ['Do', 'Does', 'Is'], answer: 'Does' }
  ];

  var negativeItems = [
    { sentence: 'I ___ work at the airport yet.', options: ['don’t', 'doesn’t', 'am not'], answer: 'don’t' },
    { sentence: 'He ___ use English every day.', options: ['don’t', 'doesn’t', 'isn’t'], answer: 'doesn’t' },
    { sentence: 'We ___ serve breakfast every day.', options: ['don’t', 'doesn’t', 'aren’t'], answer: 'don’t' },
    { sentence: 'She ___ work in a hotel now.', options: ['don’t', 'doesn’t', 'isn’t'], answer: 'doesn’t' },
    { sentence: 'They ___ answer the phone at reception.', options: ['don’t', 'doesn’t', 'aren’t'], answer: 'don’t' },
    { sentence: 'It ___ include customer service.', options: ['don’t', 'doesn’t', 'isn’t'], answer: 'doesn’t' }
  ];

  var interviewItems = [
    {
      q: 'What do you do?',
      choices: [
        'I work as a receptionist in a hotel.',
        'Do you work as a receptionist?',
        'I don’t receptionist.'
      ],
      a: 0,
      exp: 'Use a clear present simple sentence: I work as a receptionist in a hotel.'
    },
    {
      q: 'Where do you work?',
      choices: [
        'I work in a three-star hotel.',
        'Do you work in a hotel?',
        'I am work at a hotel.'
      ],
      a: 0,
      exp: 'Use: I work in a three-star hotel.'
    },
    {
      q: 'Do you use English on the phone?',
      choices: [
        'Yes, I do.',
        'Yes, I am.',
        'Yes, I use.'
      ],
      a: 0,
      exp: 'Short answer with do: Yes, I do.'
    },
    {
      q: 'Do you answer emails in English?',
      choices: [
        'No, I am not.',
        'Yes, I do, especially by email.',
        'Yes, I answering.'
      ],
      a: 1,
      exp: 'A good answer is: Yes, I do, especially by email.'
    },
    {
      q: 'Why do you want to become a steward?',
      choices: [
        'Because I enjoy customer contact and I want to work in air travel.',
        'Do you want to become a steward?',
        'Because steward.'
      ],
      a: 0,
      exp: 'Use because + a real reason.'
    },
    {
      q: 'Do you work on weekends?',
      choices: [
        'Yes, I does.',
        'Yes, I do.',
        'Yes, I am.'
      ],
      a: 1,
      exp: 'Short answer with do: Yes, I do.'
    }
  ];

  var interviewIndex = 0;
  var interviewDone = new Array(interviewItems.length).fill(false);
  var currentInterview = randomizeQuestion(interviewItems[interviewIndex]);

  function totalScore() {
    return sectionScores.dodoes + sectionScores.negative + sectionScores.interview;
  }

  function updateScore() {
    var text = totalScore() + ' / ' + maxScore;
    document.getElementById('scoreDisplay').textContent = text;
    document.getElementById('scoreDisplayBottom').textContent = text;
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

  function randomizeQuestion(q) {
    var pairs = q.choices.map(function (choice, idx) { return { text: choice, ok: idx === q.a }; });
    pairs = shared.shuffle(pairs);
    return { q: q.q, pairs: pairs, exp: q.exp };
  }

  function renderInterviewQuestion() {
    currentInterview = randomizeQuestion(interviewItems[interviewIndex]);
    document.getElementById('interviewNumber').textContent = 'Question ' + (interviewIndex + 1) + ' / ' + interviewItems.length;
    document.getElementById('interviewQuestion').textContent = currentInterview.q;
    var box = document.getElementById('interviewOptions');
    box.innerHTML = '';
    box.dataset.locked = 'no';
    var feedback = document.getElementById('interviewFeedback');
    feedback.className = 'feedback';
    feedback.textContent = '';
    currentInterview.pairs.forEach(function (pair) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.textContent = pair.text;
      btn.addEventListener('click', function () {
        if (box.dataset.locked === 'yes') { return; }
        box.dataset.locked = 'yes';
        if (pair.ok) {
          btn.classList.add('correct');
          feedback.className = 'feedback show ok';
          feedback.textContent = 'Correct — ' + currentInterview.exp;
          if (!interviewDone[interviewIndex]) {
            interviewDone[interviewIndex] = true;
            sectionScores.interview += 1;
            updateScore();
          }
        } else {
          btn.classList.add('wrong');
          feedback.className = 'feedback show no';
          feedback.textContent = 'Try to notice the grammar — ' + currentInterview.exp;
          Array.prototype.slice.call(box.children).forEach(function (child, idx) {
            if (currentInterview.pairs[idx].ok) { child.classList.add('correct'); }
          });
        }
      });
      box.appendChild(btn);
    });
  }

  function init() {
    shared.init();
    updateScore();
    renderSelectPractice('doDoesPractice', doDoesItems);
    renderSelectPractice('negativePractice', negativeItems);
    renderInterviewQuestion();

    document.getElementById('checkDoDoes').addEventListener('click', function () { checkPractice('doDoesPractice', doDoesItems, 'doDoesFeedback', 'dodoes'); });
    document.getElementById('resetDoDoes').addEventListener('click', function () { resetPractice('doDoesPractice', doDoesItems, 'doDoesFeedback', 'dodoes'); });
    document.getElementById('checkNegative').addEventListener('click', function () { checkPractice('negativePractice', negativeItems, 'negativeFeedback', 'negative'); });
    document.getElementById('resetNegative').addEventListener('click', function () { resetPractice('negativePractice', negativeItems, 'negativeFeedback', 'negative'); });

    document.getElementById('listenInterviewQuestion').addEventListener('click', function () {
      shared.speak(document.getElementById('interviewQuestion').textContent);
    });
    document.getElementById('nextInterview').addEventListener('click', function () {
      interviewIndex = (interviewIndex + 1) % interviewItems.length;
      renderInterviewQuestion();
    });
    document.getElementById('resetInterview').addEventListener('click', function () {
      interviewDone = new Array(interviewItems.length).fill(false);
      sectionScores.interview = 0;
      updateScore();
      interviewIndex = 0;
      renderInterviewQuestion();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
