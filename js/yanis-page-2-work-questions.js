
document.addEventListener('DOMContentLoaded', function () {
  var scoreState = {
    max: 28,
    vocab: 0,
    doSection: 0,
    negative: 0,
    questionBuilder: 0
  };

  var currentAccent = 'en-GB';
  var flashIndex = 0;
  var flashFront = true;
  var currentVocabIndex = 0;
  var vocabAnswered = false;

  var flashcards = [
    { tag: 'Work word', front: 'shift', translation: 'FR: service / shift', definition: 'the period of time when you work', example: 'I work the morning shift.', speakText: 'shift. The period of time when you work. Example: I work the morning shift.' },
    { tag: 'Task', front: 'answer phone calls', translation: 'FR: répondre aux appels', definition: 'to speak to customers on the phone', example: 'I answer phone calls at reception.', speakText: 'answer phone calls. To speak to customers on the phone. Example: I answer phone calls at reception.' },
    { tag: 'Task', front: 'reply to emails', translation: 'FR: répondre aux e-mails', definition: 'to send answers by email', example: 'I reply to emails every day.', speakText: 'reply to emails. To send answers by email. Example: I reply to emails every day.' },
    { tag: 'Task', front: 'deal with reservations', translation: 'FR: gérer les réservations', definition: 'to organise or manage bookings', example: 'I deal with reservations in the afternoon.', speakText: 'deal with reservations. To organise or manage bookings. Example: I deal with reservations in the afternoon.' },
    { tag: 'Expression', front: 'customer contact', translation: 'FR: contact avec les clients', definition: 'communication and interaction with customers', example: 'I enjoy customer contact.', speakText: 'customer contact. Communication and interaction with customers. Example: I enjoy customer contact.' },
    { tag: 'Expression', front: 'main duties', translation: 'FR: tâches principales', definition: 'the most important tasks in your job', example: 'My main duties are check-in and customer service.', speakText: 'main duties. The most important tasks in your job. Example: My main duties are check-in and customer service.' },
    { tag: 'Question word', front: 'What do you do?', translation: 'FR: Que faites-vous ?', definition: 'a question to ask about a person’s job', example: 'In an interview, someone can ask: What do you do?', speakText: 'What do you do? A question to ask about a person’s job. Example: In an interview, someone can ask: What do you do?' },
    { tag: 'Question word', front: 'Where do you work?', translation: 'FR: Où travaillez-vous ?', definition: 'a question to ask about the workplace', example: 'You can answer: I work in a hotel.', speakText: 'Where do you work? A question to ask about the workplace. Example: You can answer: I work in a hotel.' },
    { tag: 'Question word', front: 'When do you use English?', translation: 'FR: Quand utilisez-vous l’anglais ?', definition: 'a question to ask about the moment or situation', example: 'I use English on the phone and by email.', speakText: 'When do you use English? A question to ask about the moment or situation. Example: I use English on the phone and by email.' },
    { tag: 'Goal', front: 'I want to become a steward.', translation: 'FR: Je veux devenir steward.', definition: 'a clear way to say your goal', example: 'I want to become a steward because I enjoy service.', speakText: 'I want to become a steward. A clear way to say your goal. Example: I want to become a steward because I enjoy service.' },
    { tag: 'Preposition', front: 'at reception', translation: 'FR: à la réception', definition: 'use at for a point or service desk', example: 'I work at reception.', speakText: 'at reception. Use at for a point or service desk. Example: I work at reception.' },
    { tag: 'Preposition', front: 'in a hotel', translation: 'FR: dans un hôtel', definition: 'use in for a place or building', example: 'I work in a hotel.', speakText: 'in a hotel. Use in for a place or building. Example: I work in a hotel.' },
    { tag: 'Preposition', front: 'on the phone', translation: 'FR: au téléphone', definition: 'use on for phone communication', example: 'I often speak English on the phone.', speakText: 'on the phone. Use on for phone communication. Example: I often speak English on the phone.' },
    { tag: 'Preposition', front: 'by email', translation: 'FR: par e-mail', definition: 'use by for the communication channel', example: 'I often communicate by email.', speakText: 'by email. Use by for the communication channel. Example: I often communicate by email.' }
  ];

  var vocabQuiz = [
    { question: 'What does “main duties” mean?', speakText: 'What does main duties mean?', options: ['your holidays', 'your main tasks', 'your salary only', 'your work uniform'], answer: 1, explanation: 'Main duties means your most important tasks at work.' },
    { question: 'Choose the best meaning of “deal with reservations”.', speakText: 'Choose the best meaning of deal with reservations.', options: ['manage bookings', 'clean the lobby', 'drive to work', 'prepare a meal'], answer: 0, explanation: 'Deal with reservations means manage or organise bookings.' },
    { question: 'What is “customer contact”?', speakText: 'What is customer contact?', options: ['phone batteries', 'contact with customers', 'a hotel computer', 'airport security'], answer: 1, explanation: 'Customer contact means communication and interaction with customers.' },
    { question: 'What does “shift” mean?', speakText: 'What does shift mean?', options: ['a work period', 'a hotel room', 'an email', 'a flight ticket'], answer: 0, explanation: 'A shift is a period of time when you work.' },
    { question: 'Which sentence talks about your goal?', speakText: 'Which sentence talks about your goal?', options: ['I work at reception.', 'I answer phone calls.', 'I want to become a steward.', 'I use English by email.'], answer: 2, explanation: 'A goal tells us what you want in the future.' },
    { question: 'Complete the idea: “Where do you work?” asks about...', speakText: 'Complete the idea. Where do you work asks about...', options: ['your workplace', 'your age', 'your weekend', 'your nationality'], answer: 0, explanation: 'Where do you work? asks about the place where you work.' },
    { question: 'Which expression is about communication method?', speakText: 'Which expression is about communication method?', options: ['customer contact', 'by email', 'main duties', 'work shift'], answer: 1, explanation: 'By email tells us how you communicate.' },
    { question: 'Choose the best meaning of “reply to emails”.', speakText: 'Choose the best meaning of reply to emails.', options: ['delete messages', 'read messages silently', 'send answers by email', 'write hotel rules'], answer: 2, explanation: 'Reply to emails means send an answer by email.' }
  ];

  var doItems = [
    { prompt: '___ you work at reception?', options: ['Do', 'Are', 'Am'], answer: 'Do' },
    { prompt: 'Where ___ you work?', options: ['do', 'are', 'does'], answer: 'do' },
    { prompt: 'I ___ use English every minute.', options: ['do not', 'am not', 'not'], answer: 'do not' },
    { prompt: 'What do you ___ at work?', options: ['do', 'does', 'doing'], answer: 'do' },
    { prompt: 'I don’t ___ in an office.', options: ['work', 'works', 'working'], answer: 'work' },
    { prompt: '___ you answer phone calls?', options: ['Do', 'Does', 'Is'], answer: 'Do' },
    { prompt: 'When do you ___ English?', options: ['use', 'uses', 'using'], answer: 'use' },
    { prompt: 'I ___ work alone all the time.', options: ['do not', 'am not', 'do'], answer: 'do not' }
  ];

  var negativeItems = [
    { prompt: 'Choose the correct negative sentence.', target: 'I use English by email.', options: ['I don’t use English by email.', 'I not use English by email.', 'I am not use English by email.'], answer: 'I don’t use English by email.' },
    { prompt: 'Choose the correct negative sentence.', target: 'I work in an office.', options: ['I don’t work in an office.', 'I not work in an office.', 'I doesn’t work in an office.'], answer: 'I don’t work in an office.' },
    { prompt: 'Choose the correct negative sentence.', target: 'I answer every message in English.', options: ['I don’t answer every message in English.', 'I am not answer every message in English.', 'I don’t answers every message in English.'], answer: 'I don’t answer every message in English.' },
    { prompt: 'Choose the correct negative sentence.', target: 'I work only at night.', options: ['I don’t work only at night.', 'I not work only at night.', 'I am don’t work only at night.'], answer: 'I don’t work only at night.' },
    { prompt: 'Choose the correct negative sentence.', target: 'I use English with every guest.', options: ['I don’t use English with every guest.', 'I am not use English with every guest.', 'I doesn’t use English with every guest.'], answer: 'I don’t use English with every guest.' },
    { prompt: 'Choose the correct negative sentence.', target: 'I deal with baggage at the airport.', options: ['I don’t deal with baggage at the airport.', 'I don’t dealing with baggage at the airport.', 'I not deal with baggage at the airport.'], answer: 'I don’t deal with baggage at the airport.' }
  ];

  var questionBuilderItems = [
    { prompt: 'You want to ask about the job. Choose the best question.', options: ['What you do?', 'What do you do?', 'What are you do?'], answer: 'What do you do?' },
    { prompt: 'You want to ask about the workplace. Choose the best question.', options: ['Where do you work?', 'Where you work?', 'Where are work you?'], answer: 'Where do you work?' },
    { prompt: 'You want to ask about English use. Choose the best question.', options: ['When do you use English?', 'When you use English?', 'When are you use English?'], answer: 'When do you use English?' },
    { prompt: 'You want to ask about customers. Choose the best question.', options: ['Who do you help at work?', 'Who you help at work?', 'Who are you help at work?'], answer: 'Who do you help at work?' },
    { prompt: 'You want to ask about the goal. Choose the best question.', options: ['Why do you want to become a steward?', 'Why you want to become a steward?', 'Why are you want to become a steward?'], answer: 'Why do you want to become a steward?' },
    { prompt: 'You want to ask about weekends. Choose the best question.', options: ['Do you work on weekends?', 'You do work on weekends?', 'Are you work on weekends?'], answer: 'Do you work on weekends?' }
  ];

  var accentUK = document.getElementById('accentUK');
  var accentUS = document.getElementById('accentUS');
  var voiceStatus = document.getElementById('voiceStatus');

  function updateScoreDisplay() {
    var total = scoreState.vocab + scoreState.doSection + scoreState.negative + scoreState.questionBuilder;
    document.getElementById('scoreDisplay').textContent = total + ' / ' + scoreState.max;
    document.getElementById('scoreDisplayBottom').textContent = total + ' / ' + scoreState.max;
  }

  function chooseVoice() {
    var voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    if (!voices || !voices.length) {
      return null;
    }
    var exact = voices.find(function (v) { return v.lang === currentAccent; });
    if (exact) { return exact; }
    var starts = voices.find(function (v) { return v.lang && v.lang.indexOf(currentAccent.slice(0, 2)) === 0; });
    if (starts) { return starts; }
    return voices[0];
  }

  function shuffleArray(array) {
    var copy = array.slice();
    for (var i = copy.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function speakText(text) {
    if (!window.speechSynthesis) {
      return;
    }
    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentAccent;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    var voice = chooseVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    window.speechSynthesis.speak(utterance);
  }

  function setAccent(lang) {
    currentAccent = lang;
    var isUK = lang === 'en-GB';
    accentUK.classList.toggle('active', isUK);
    accentUS.classList.toggle('active', !isUK);
    accentUK.setAttribute('aria-pressed', isUK ? 'true' : 'false');
    accentUS.setAttribute('aria-pressed', !isUK ? 'true' : 'false');
    voiceStatus.textContent = 'Current accent: ' + (isUK ? 'British English' : 'American English') + '. Use the speaker buttons to hear useful words, questions, and model answers.';
  }

  accentUK.addEventListener('click', function () { setAccent('en-GB'); });
  accentUS.addEventListener('click', function () { setAccent('en-US'); });
  document.getElementById('stopAudio').addEventListener('click', function () {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  });
  if (window.speechSynthesis && typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = function () { chooseVoice(); };
  }

  document.querySelectorAll('.speak-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      speakText(btn.getAttribute('data-speak-text') || '');
    });
  });

  function renderFlashcard() {
    var item = flashcards[flashIndex];
    document.getElementById('flashTag').textContent = item.tag;
    document.getElementById('flashMain').textContent = item.front;
    document.getElementById('flashTranslation').textContent = item.translation;
    document.getElementById('flashDefinition').textContent = item.definition;
    document.getElementById('flashExample').textContent = item.example;
    document.getElementById('flashcardCounter').textContent = (flashIndex + 1) + ' / ' + flashcards.length;
    document.getElementById('flashSub').textContent = flashFront ? 'front side' : 'back side';
    document.getElementById('flashFrontView').hidden = !flashFront;
    document.getElementById('flashBackView').hidden = flashFront;
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
    for (var i = flashcards.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = flashcards[i];
      flashcards[i] = flashcards[j];
      flashcards[j] = temp;
    }
    flashIndex = 0;
    flashFront = true;
    renderFlashcard();
  });
  document.getElementById('listenFlashcard').addEventListener('click', function () {
    speakText(flashcards[flashIndex].speakText);
  });
  renderFlashcard();

  function renderVocabQuestion() {
    var item = vocabQuiz[currentVocabIndex];
    vocabAnswered = false;
    document.getElementById('vocabQuestionNumber').textContent = 'Question ' + (currentVocabIndex + 1) + ' / ' + vocabQuiz.length;
    document.getElementById('vocabQuestion').textContent = item.question;
    document.getElementById('vocabFeedback').textContent = '';
    document.getElementById('vocabFeedback').className = 'feedback';
    var box = document.getElementById('vocabOptions');
    box.innerHTML = '';
    var shuffledOptions = shuffleArray(item.options.map(function (opt, index) {
      return { text: opt, correct: index === item.answer };
    }));
    shuffledOptions.forEach(function (optData) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-btn';
      button.textContent = optData.text;
      button.addEventListener('click', function () {
        if (vocabAnswered) {
          return;
        }
        vocabAnswered = true;
        var correct = optData.correct;
        if (correct) {
          scoreState.vocab += 1;
          button.classList.add('correct');
          document.getElementById('vocabFeedback').textContent = '✅ Correct! ' + item.explanation;
          document.getElementById('vocabFeedback').classList.add('correct');
          updateScoreDisplay();
        } else {
          button.classList.add('incorrect');
          document.getElementById('vocabFeedback').textContent = '❌ Not quite. ' + item.explanation;
          document.getElementById('vocabFeedback').classList.add('incorrect');
          Array.from(box.children).forEach(function (child, childIndex) {
            if (shuffledOptions[childIndex].correct) {
              child.classList.add('correct');
            }
          });
        }
      });
      box.appendChild(button);
    });
  }

  document.getElementById('listenVocabQuestion').addEventListener('click', function () {
    speakText(vocabQuiz[currentVocabIndex].speakText);
  });
  document.getElementById('nextVocabQuestion').addEventListener('click', function () {
    if (currentVocabIndex < vocabQuiz.length - 1) {
      currentVocabIndex += 1;
    } else {
      currentVocabIndex = 0;
    }
    renderVocabQuestion();
  });
  document.getElementById('resetVocabQuiz').addEventListener('click', function () {
    scoreState.vocab = 0;
    currentVocabIndex = 0;
    renderVocabQuestion();
    updateScoreDisplay();
  });
  renderVocabQuestion();

  function renderSelectPractice(items, targetId) {
    var holder = document.getElementById(targetId);
    holder.innerHTML = '';
    items.forEach(function (item, index) {
      var wrap = document.createElement('div');
      wrap.className = 'practice-item';
      wrap.innerHTML = '<div class="prompt-top"><strong>Item ' + (index + 1) + '</strong>' + (item.target ? '<span>' + item.target + '</span>' : '') + '</div><div>' + item.prompt + '</div>';
      var select = document.createElement('select');
      select.dataset.answer = item.answer;
      var placeholder = document.createElement('option');
      placeholder.textContent = 'Choose your answer';
      placeholder.value = '';
      placeholder.selected = true;
      placeholder.disabled = true;
      select.appendChild(placeholder);
      shuffleArray(item.options).forEach(function (opt) {
        var option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
      });
      wrap.appendChild(select);
      holder.appendChild(wrap);
    });
  }

  function checkSelectPractice(containerId, summaryId, scoreKey) {
    var selects = document.querySelectorAll('#' + containerId + ' select');
    var correct = 0;
    selects.forEach(function (select) {
      var parent = select.parentElement;
      select.disabled = true;
      if (select.value === select.dataset.answer) {
        correct += 1;
        parent.style.borderColor = '#1a7f37';
        parent.style.background = '#eef9f0';
      } else {
        parent.style.borderColor = '#c8102e';
        parent.style.background = '#fff2f4';
      }
    });
    scoreState[scoreKey] = correct;
    updateScoreDisplay();
    var summary = document.getElementById(summaryId);
    summary.textContent = 'You got ' + correct + ' / ' + selects.length + ' correct.';
    summary.className = 'feedback ' + (correct === selects.length ? 'correct' : 'incorrect');
  }

  function resetSelectPractice(items, containerId, summaryId, scoreKey) {
    scoreState[scoreKey] = 0;
    renderSelectPractice(items, containerId);
    document.getElementById(summaryId).textContent = '';
    document.getElementById(summaryId).className = 'feedback';
    updateScoreDisplay();
  }

  renderSelectPractice(doItems, 'doList');
  renderSelectPractice(negativeItems, 'negativeList');
  document.getElementById('checkDo').addEventListener('click', function () {
    checkSelectPractice('doList', 'doSummary', 'doSection');
  });
  document.getElementById('resetDo').addEventListener('click', function () {
    resetSelectPractice(doItems, 'doList', 'doSummary', 'doSection');
  });
  document.getElementById('checkNegative').addEventListener('click', function () {
    checkSelectPractice('negativeList', 'negativeSummary', 'negative');
  });
  document.getElementById('resetNegative').addEventListener('click', function () {
    resetSelectPractice(negativeItems, 'negativeList', 'negativeSummary', 'negative');
  });

  function renderQuestionBuilder() {
    var holder = document.getElementById('questionBuilderList');
    holder.innerHTML = '';
    questionBuilderItems.forEach(function (item, index) {
      var wrap = document.createElement('div');
      wrap.className = 'practice-item';
      var top = document.createElement('div');
      top.className = 'prompt-top';
      top.innerHTML = '<strong>Question ' + (index + 1) + '</strong>';
      wrap.appendChild(top);
      var p = document.createElement('p');
      p.textContent = item.prompt;
      wrap.appendChild(p);
      var optionBox = document.createElement('div');
      optionBox.className = 'question-options';
      shuffleArray(item.options).forEach(function (opt) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'question-choice';
        button.textContent = opt;
        button.addEventListener('click', function () {
          if (wrap.dataset.done === 'true') {
            return;
          }
          wrap.dataset.done = 'true';
          var correct = opt === item.answer;
          if (correct) {
            button.classList.add('correct');
            scoreState.questionBuilder += 1;
          } else {
            button.classList.add('incorrect');
            Array.from(optionBox.children).forEach(function (child) {
              if (child.textContent === item.answer) {
                child.classList.add('correct');
              }
            });
          }
          updateScoreDisplay();
          updateQuestionBuilderSummary();
        });
        optionBox.appendChild(button);
      });
      wrap.appendChild(optionBox);
      holder.appendChild(wrap);
    });
    updateQuestionBuilderSummary();
  }

  function updateQuestionBuilderSummary() {
    var total = questionBuilderItems.length;
    document.getElementById('questionBuilderSummary').textContent = 'Question builder score: ' + scoreState.questionBuilder + ' / ' + total;
  }

  document.getElementById('resetQuestionBuilder').addEventListener('click', function () {
    scoreState.questionBuilder = 0;
    renderQuestionBuilder();
    updateScoreDisplay();
  });
  renderQuestionBuilder();

  document.querySelectorAll('.toggle-panel').forEach(function (button) {
    button.addEventListener('click', function () {
      var target = document.getElementById(button.getAttribute('data-target'));
      var hidden = target.hasAttribute('hidden');
      if (hidden) {
        target.removeAttribute('hidden');
        button.textContent = 'Hide support';
      } else {
        target.setAttribute('hidden', 'hidden');
        button.textContent = 'Show support';
      }
    });
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
  document.getElementById('listenModelAnswer').addEventListener('click', function () {
    speakText('At the moment, I work as a receptionist in a three-star hotel. I work at reception and I welcome guests, answer phone calls, reply to emails, and deal with reservations. I use English mainly on the phone, by email, and with international guests. In the future, I want to become a steward because I enjoy customer contact, service, and international communication.');
  });
  document.getElementById('clearWriting').addEventListener('click', function () {
    document.getElementById('interviewWriting').value = '';
  });

  updateScoreDisplay();
  setAccent('en-GB');
});
