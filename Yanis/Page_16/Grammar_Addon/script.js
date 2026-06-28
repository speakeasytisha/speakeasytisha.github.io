(() => {
  'use strict';

  const exercises = {
    a: [
      { prompt: 'Choose the correct polite offer.', choices: ['Would you like some water?', 'Do you like some water?', 'Would you like some waters?'], correct: 0, say: 'Would you like some water?', explanation: '<strong>Would you like + noun</strong> is a polite offer. Water is usually uncountable, so we say <em>some water</em>.' },
      { prompt: 'Complete the service question: “Would you like ___ seats?”', choices: ['change', 'to change', 'changing'], correct: 1, say: 'Would you like to change seats?', explanation: 'Use <strong>would you like to + verb</strong>: <em>Would you like to change seats?</em>' },
      { prompt: 'Which sentence is correct?', choices: ['Would you like a blanket?', 'Would you like blanket?', 'Would you like to a blanket?'], correct: 0, say: 'Would you like a blanket?', explanation: 'A singular countable noun needs <strong>a / an</strong>: <em>a blanket</em>.' },
      { prompt: 'A passenger has not chosen a drink. What do you say?', choices: ['Would you like something to drink?', 'Would you like drink something?', 'Would you like to drinking?'], correct: 0, say: 'Would you like something to drink?', explanation: '<em>Something to drink</em> is a natural, professional service offer.' },
      { prompt: 'Choose the most natural boarding question.', choices: ['Would you like to board now?', 'Would you like board now?', 'Would you like boarding now?'], correct: 0, say: 'Would you like to board now?', explanation: 'After <strong>would you like</strong>, use <strong>to + verb</strong>: <em>to board</em>.' }
    ],
    b: [
      { prompt: 'You want to offer water. Choose the correct sentence.', choices: ['Can I offer you some water?', 'Can I offer you to water?', 'Can I offer some water you?'], correct: 0, say: 'Can I offer you some water?', explanation: 'Use <strong>Can I offer you + noun?</strong> The thing you offer is <em>some water</em>.' },
      { prompt: 'You want to check a passenger’s need. Choose the correct sentence.', choices: ['Do you need a pillow?', 'Do you need pillow?', 'Do you need to a pillow?'], correct: 0, say: 'Do you need a pillow?', explanation: 'A singular countable noun needs <strong>a / an</strong>: <em>a pillow</em>.' },
      { prompt: 'Which question asks about help with luggage?', choices: ['Do you need help with your bag?', 'Can I offer you help your bag?', 'Do you need to help your bag?'], correct: 0, say: 'Do you need help with your bag?', explanation: '<em>Help</em> is uncountable. We say <em>help with your bag</em>.' },
      { prompt: 'A passenger looks cold. What is the best question?', choices: ['Do you need a blanket?', 'Can I offer you to blanket?', 'Do you need blanket some?'], correct: 0, say: 'Do you need a blanket?', explanation: 'Use <strong>Do you need + noun?</strong> to check what the passenger needs.' },
      { prompt: 'Which sentence is a service offer?', choices: ['Can I offer you some tea?', 'Do you need some tea you?', 'Can I offer to you tea?'], correct: 0, say: 'Can I offer you some tea?', explanation: 'The correct pattern is <strong>Can I offer you + noun?</strong>' }
    ],
    c: [
      { prompt: 'Choose the correct sentence for one blanket.', choices: ['Here is your blanket.', 'Here are your blanket.', 'Here is your blankets.'], correct: 0, say: 'Here is your blanket.', explanation: 'One thing = <strong>Here is</strong>.' },
      { prompt: 'Choose the correct sentence for two headphones.', choices: ['Here is your headphones.', 'Here are your headphones.', 'Here are your headphone.'], correct: 1, say: 'Here are your headphones.', explanation: 'More than one thing = <strong>Here are</strong>.' },
      { prompt: 'A passenger receives one vegetarian meal. What do you say?', choices: ['Here is your vegetarian meal.', 'Here are your vegetarian meal.', 'Here is your vegetarian meals.'], correct: 0, say: 'Here is your vegetarian meal.', explanation: '<em>Meal</em> is singular here, so use <strong>Here is</strong>.' },
      { prompt: 'A family receives three menus. What do you say?', choices: ['Here is your menus.', 'Here are your menus.', 'Here are your menu.'], correct: 1, say: 'Here are your menus.', explanation: '<em>Menus</em> is plural, so use <strong>Here are</strong>.' },
      { prompt: 'Which sentence is correct?', choices: ['Here are your boarding passes.', 'Here is your boarding passes.', 'Here are your boarding pass.'], correct: 0, say: 'Here are your boarding passes.', explanation: 'There are several passes, so use the plural form: <strong>Here are</strong>.' }
    ],
    d: [
      { prompt: 'The passenger says this is necessary: “I ___ water.”', choices: ['need', 'would like', 'would prefer'], correct: 0, say: 'I need water.', explanation: '<strong>Need</strong> expresses something necessary or important.' },
      { prompt: 'The passenger politely asks for tea: “I ___ tea, please.”', choices: ['need', 'would like', 'would prefer'], correct: 1, say: 'I would like tea, please.', explanation: '<strong>Would like</strong> is a polite way to request something.' },
      { prompt: 'The passenger chooses one option: “I ___ an aisle seat.”', choices: ['need', 'would like', 'would prefer'], correct: 2, say: 'I would prefer an aisle seat.', explanation: '<strong>Would prefer</strong> is used when choosing between options.' },
      { prompt: 'Choose the most polite way to ask for a drink.', choices: ['I would like some juice, please.', 'I like some juice, please.', 'I need to some juice, please.'], correct: 0, say: 'I would like some juice, please.', explanation: 'For a polite request, use <strong>I would like + noun</strong>.' },
      { prompt: 'Choose the correct sentence.', choices: ['I would prefer to sit near the window.', 'I would prefer sit near the window.', 'I would prefer near the window sit.'], correct: 0, say: 'I would prefer to sit near the window.', explanation: 'Before a verb, use <strong>would prefer to + verb</strong>.' }
    ],
    e: [
      { prompt: 'Complete the polite offer: “Would you like ___ water?”', choices: ['some', 'many', 'a few'], correct: 0, say: 'Would you like some water?', explanation: 'Use <strong>some</strong> in offers and positive sentences.' },
      { prompt: 'Complete the question: “Do you need ___ help?”', choices: ['any', 'many', 'a few'], correct: 0, say: 'Do you need any help?', explanation: 'Use <strong>any</strong> in questions and negatives. <em>Help</em> is uncountable.' },
      { prompt: 'Complete the question: “How ___ bags do you have?”', choices: ['much', 'many', 'little'], correct: 1, say: 'How many bags do you have?', explanation: 'Bags are countable plural, so use <strong>many</strong>.' },
      { prompt: 'Complete the question: “How ___ juice would you like?”', choices: ['many', 'much', 'few'], correct: 1, say: 'How much juice would you like?', explanation: 'Juice is uncountable, so use <strong>much</strong>.' },
      { prompt: 'Complete the sentence: “There are ___ empty seats.”', choices: ['a few', 'a little', 'much'], correct: 0, say: 'There are a few empty seats.', explanation: 'Seats are countable plural. <strong>A few</strong> means a small number.' },
      { prompt: 'Complete the sentence: “There is ___ coffee left.”', choices: ['a few', 'a little', 'many'], correct: 1, say: 'There is a little coffee left.', explanation: 'Coffee is uncountable. <strong>A little</strong> means a small quantity.' },
      { prompt: 'Which noun is uncountable?', choices: ['water', 'blanket', 'passenger'], correct: 0, say: 'Water is uncountable.', explanation: '<strong>Water</strong> is uncountable: we say <em>some water</em> or <em>much water</em>, not <em>many waters</em>.' },
      { prompt: 'Which noun is countable?', choices: ['assistance', 'luggage', 'meal'], correct: 2, say: 'A meal. Two meals.', explanation: '<strong>Meal</strong> is countable: one meal, two meals, many meals.' }
    ],
    mission: [
      { prompt: 'Passenger: “I’m cold.” Choose the best response.', choices: ['Of course. Would you like a blanket?', 'Of course. Would you like blanket?', 'Of course. Do you like blanket?'], correct: 0, say: 'Of course. Would you like a blanket?', explanation: 'Professional offer: <strong>Would you like + a noun?</strong>' },
      { prompt: 'Passenger: “Can I have water?” Choose the best response.', choices: ['Of course. Here is some water.', 'Of course. Here are some water.', 'Of course. Here is a waters.'], correct: 0, say: 'Of course. Here is some water.', explanation: '<em>Water</em> is uncountable, so we say <strong>some water</strong>.' },
      { prompt: 'A family has three bags. Choose the best question.', choices: ['How many bags do you have?', 'How much bags do you have?', 'How many luggage do you have?'], correct: 0, say: 'How many bags do you have?', explanation: '<em>Bags</em> are countable, so ask <strong>How many…?</strong>' },
      { prompt: 'Passenger: “I want a window seat.” Choose the more polite version.', choices: ['I would prefer a window seat, please.', 'I prefer to a window seat, please.', 'I would prefer window seat please.'], correct: 0, say: 'I would prefer a window seat, please.', explanation: '<strong>Would prefer + noun</strong> is polite. Use <em>a</em> before singular <em>window seat</em>.' },
      { prompt: 'You give two passengers their blankets. Choose the best response.', choices: ['Here are your blankets.', 'Here is your blankets.', 'Here are your blanket.'], correct: 0, say: 'Here are your blankets.', explanation: 'Two blankets = plural. Use <strong>Here are</strong>.' },
      { prompt: 'Passenger: “I need help with my bag.” Choose the best response.', choices: ['Of course. I can help you right away.', 'Of course. I can help to you right away.', 'Of course. I can helping you right away.'], correct: 0, say: 'Of course. I can help you right away.', explanation: 'After <strong>can</strong>, use the base verb: <em>can help</em>.' }
    ]
  };

  const state = {
    answers: new Map(),
    voice: 'en-US',
    total: Object.values(exercises).flat().length
  };

  const scoreCorrect = document.getElementById('scoreCorrect');
  const scoreTotal = document.getElementById('scoreTotal');
  const progressFill = document.getElementById('progressFill');
  const scoreMessage = document.getElementById('scoreMessage');
  const liveRegion = document.getElementById('liveRegion');
  const completionCard = document.getElementById('completionCard');

  function safeId(text) {
    return text.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  }

  function renderQuiz(key, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const fragment = document.createDocumentFragment();

    exercises[key].forEach((item, questionIndex) => {
      const card = document.createElement('article');
      card.className = 'question-card';
      card.dataset.key = `${key}-${questionIndex}`;
      card.innerHTML = `
        <div class="question-meta"><span>${key === 'mission' ? 'Service situation' : 'Practice question'} ${questionIndex + 1}</span><button type="button" class="mini-listen" aria-label="Listen to the correct sentence">🔊</button></div>
        <h3>${item.prompt}</h3>
        <div class="answer-options" role="group" aria-label="Answer choices for question ${questionIndex + 1}"></div>
        <p class="feedback" aria-live="polite">Choose an answer.</p>
      `;
      const answerOptions = card.querySelector('.answer-options');
      item.choices.forEach((choice, optionIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'choice';
        button.textContent = choice;
        button.dataset.optionIndex = String(optionIndex);
        button.addEventListener('click', () => answerQuestion(key, questionIndex, optionIndex, card));
        answerOptions.appendChild(button);
      });
      card.querySelector('.mini-listen').addEventListener('click', () => speak(item.say));
      fragment.appendChild(card);
    });
    container.appendChild(fragment);
  }

  function answerQuestion(key, questionIndex, optionIndex, card) {
    const questionKey = `${key}-${questionIndex}`;
    const item = exercises[key][questionIndex];
    const isCorrect = optionIndex === item.correct;
    const previous = state.answers.get(questionKey);

    // One counted answer per card. Learners can still see the correction without losing the score twice.
    if (!previous) {
      state.answers.set(questionKey, { selected: optionIndex, isCorrect });
    }

    const buttons = [...card.querySelectorAll('.choice')];
    buttons.forEach((button, index) => {
      button.disabled = true;
      if (index === item.correct) button.classList.add('correct');
      if (index === optionIndex && !isCorrect) button.classList.add('wrong');
    });

    const feedback = card.querySelector('.feedback');
    feedback.className = `feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`;
    const start = isCorrect ? '✓ Correct. ' : 'Not quite. ';
    feedback.innerHTML = `${start}${item.explanation} <button type="button" class="feedback-listen">🔊 Repeat</button>`;
    feedback.querySelector('.feedback-listen').addEventListener('click', () => speak(item.say));

    updateScore();
    liveRegion.textContent = isCorrect ? 'Correct answer.' : `The correct answer is: ${item.choices[item.correct]}`;
  }

  function updateScore() {
    const answered = state.answers.size;
    const correct = [...state.answers.values()].filter(answer => answer.isCorrect).length;
    scoreCorrect.textContent = String(correct);
    scoreTotal.textContent = String(state.total);
    const percent = Math.round((answered / state.total) * 100);
    progressFill.style.width = `${percent}%`;

    if (answered === 0) {
      scoreMessage.textContent = 'Choose an answer to begin.';
    } else if (answered < state.total) {
      scoreMessage.textContent = `${answered} of ${state.total} answered · ${correct} correct`;
    } else if (correct === state.total) {
      scoreMessage.textContent = 'Perfect service grammar! ✨';
    } else {
      scoreMessage.textContent = `Finished! ${correct} / ${state.total} correct.`;
    }

    completionCard.hidden = answered !== state.total;
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      liveRegion.textContent = 'Audio is not available in this browser.';
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.voice;
    utterance.rate = 0.86;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => voice.lang.toLowerCase() === state.voice.toLowerCase()) || voices.find(voice => voice.lang.toLowerCase().startsWith(state.voice.slice(0, 2).toLowerCase()));
    if (preferredVoice) utterance.voice = preferredVoice;
    window.speechSynthesis.speak(utterance);
  }

  function resetAll() {
    state.answers.clear();
    document.querySelectorAll('.question-card').forEach(card => {
      card.querySelectorAll('.choice').forEach(button => {
        button.disabled = false;
        button.classList.remove('correct', 'wrong');
      });
      const feedback = card.querySelector('.feedback');
      feedback.className = 'feedback';
      feedback.textContent = 'Choose an answer.';
    });
    completionCard.hidden = true;
    updateScore();
    liveRegion.textContent = 'All grammar exercises have been reset.';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function initializeVoiceControls() {
    document.querySelectorAll('.voice-button').forEach(button => {
      button.addEventListener('click', () => {
        state.voice = button.dataset.voice;
        document.querySelectorAll('.voice-button').forEach(control => control.classList.toggle('active', control === button));
        liveRegion.textContent = `Voice changed to ${state.voice === 'en-US' ? 'US English' : 'UK English'}.`;
      });
    });
  }

  renderQuiz('a', 'quiz-a');
  renderQuiz('b', 'quiz-b');
  renderQuiz('c', 'quiz-c');
  renderQuiz('d', 'quiz-d');
  renderQuiz('e', 'quiz-e');
  renderQuiz('mission', 'quiz-mission');
  scoreTotal.textContent = String(state.total);
  initializeVoiceControls();

  document.querySelectorAll('[data-say]').forEach(button => button.addEventListener('click', () => speak(button.dataset.say)));
  document.getElementById('listenWelcome').addEventListener('click', () => speak('Welcome on board. Today, you will practise polite offers, passenger needs, and service grammar.'));
  document.getElementById('resetAll').addEventListener('click', resetAll);

  // Browsers often load voices after the first call; refresh the list silently when available.
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = () => {};
})();
