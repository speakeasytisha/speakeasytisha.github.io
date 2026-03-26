(function () {
  'use strict';

  var essayOrder = [
    'Answer the topic',
    'Give your opinion',
    'Reason 1',
    'Reason 2 / example',
    'Mini conclusion'
  ];

  var topics = [
    {
      label: 'Remote work',
      title: 'Remote work in companies',
      question: 'Do you think remote work is a good solution for companies? Why or why not?',
      ideas: ['communication', 'stress', 'work-life balance', 'organization'],
      phrases: [
        'Many companies are considering remote work today. ',
        'In my opinion, it can be a positive solution. ',
        'First, it can reduce commuting stress. ',
        'In addition, it can improve work-life balance. ',
        'For example, parents can organize their day more easily. ',
        'Overall, I think remote work works best with clear communication. '
      ],
      model: 'Many companies are considering remote work today. In my opinion, it can be a positive solution when it is well organized.\n\nFirst, remote work can reduce commuting time and daily stress. Employees often feel more relaxed when they do not need to travel for a long time every day. In addition, remote work can improve work-life balance. For example, parents may find it easier to organize family responsibilities.\n\nHowever, good communication is necessary. Teams need clear rules, regular meetings, and clear objectives. Overall, I think remote work is a good solution for companies if communication stays strong.'
    },
    {
      label: 'English training at work',
      title: 'English training for employees',
      question: 'Should companies offer English training to their employees? Explain your opinion.',
      ideas: ['communication', 'confidence', 'career growth', 'international work'],
      phrases: [
        'Today, English is useful in many professional situations. ',
        'I believe companies should offer English training to employees. ',
        'First, it improves communication with clients and colleagues. ',
        'It can also increase professional confidence. ',
        'For example, employees may feel more comfortable in meetings or emails. ',
        'Overall, English training is a practical investment for a company. '
      ],
      model: 'Today, English is useful in many professional situations. I believe companies should offer English training to employees.\n\nFirst, it improves communication with clients, partners, and colleagues. Better communication can reduce misunderstandings and help teams work more efficiently. In addition, English training can increase professional confidence. For example, employees may feel more comfortable speaking during meetings or writing emails.\n\nIt can also support career development inside the company. Overall, I think English training is a practical and useful investment for both employees and employers.'
    },
    {
      label: 'Flexible schedules',
      title: 'Flexible working hours',
      question: 'Are flexible schedules a good idea for employees and companies? Why?',
      ideas: ['family life', 'motivation', 'productivity', 'organization'],
      phrases: [
        'Flexible schedules are becoming more common in the workplace. ',
        'In my opinion, they can be very useful. ',
        'First, they can help employees organize their personal life better. ',
        'In addition, they may improve motivation and productivity. ',
        'For example, some employees work better earlier in the day. ',
        'Overall, flexible schedules can be effective with clear organization. '
      ],
      model: 'Flexible schedules are becoming more common in the workplace. In my opinion, they can be very useful for both employees and companies.\n\nFirst, flexible hours can help employees organize their personal life more easily. This is especially helpful for parents or people with long commutes. In addition, flexible schedules may improve motivation and productivity because some employees work better at different times of the day.\n\nOf course, companies need clear organization and communication. Overall, I think flexible schedules are a good idea when expectations are clear for everyone.'
    }
  ];

  var score = {
    thesis: false,
    connector: false,
    order: false,
    email: false
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function updateGlobalScore() {
    var total = 0;
    var key;

    for (key in score) {
      if (Object.prototype.hasOwnProperty.call(score, key) && score[key]) {
        total += 1;
      }
    }

    if (byId('global-score')) {
      byId('global-score').textContent = total + ' / 4';
    }
  }

  function initChoiceCards() {
    var cards = document.querySelectorAll('.quiz-card[data-task="thesis"], .quiz-card[data-task="connector"], .quiz-card[data-task="email"]');

    Array.prototype.forEach.call(cards, function (card) {
      var task = card.getAttribute('data-task');
      var buttons = card.querySelectorAll('.option-btn');
      var feedback = card.querySelector('.feedback');

      Array.prototype.forEach.call(buttons, function (button) {
        button.addEventListener('click', function () {
          var isCorrect;

          if (card.getAttribute('data-done') === 'true') {
            return;
          }

          isCorrect = button.getAttribute('data-correct') === 'true';

          Array.prototype.forEach.call(buttons, function (item) {
            item.classList.add('is-locked');
            if (item.getAttribute('data-correct') === 'true') {
              item.classList.add('is-correct');
            }
          });

          if (isCorrect) {
            feedback.textContent = 'Excellent. This answer is clear, natural, and well structured.';
            score[task] = true;
            updateGlobalScore();
          } else {
            button.classList.add('is-wrong');
            feedback.textContent = 'Nice try. Look for the answer that is clear, polite, and precise.';
          }

          card.setAttribute('data-done', 'true');
        });
      });
    });
  }

  function shuffle(items) {
    var array = items.slice();
    var i;
    var j;
    var temp;

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  function renderOrderGame() {
    var bank = byId('order-bank');
    var selected = byId('order-selected');
    var feedback = byId('order-feedback');
    var choices;

    if (!bank || !selected || !feedback) {
      return;
    }

    bank.innerHTML = '';
    selected.innerHTML = '';
    feedback.textContent = '';
    choices = shuffle(essayOrder);

    choices.forEach(function (label) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'order-item';
      button.textContent = label;
      bank.appendChild(button);

      button.addEventListener('click', function () {
        var item;

        if (button.disabled) {
          return;
        }

        button.disabled = true;
        item = document.createElement('span');
        item.className = 'bullet-chips__item';
        item.textContent = label;
        selected.appendChild(item);

        if (selected.children.length === essayOrder.length) {
          checkOrderGame();
        }
      });
    });
  }

  function checkOrderGame() {
    var selected = byId('order-selected');
    var feedback = byId('order-feedback');
    var values;
    var correct;

    if (!selected || !feedback) {
      return;
    }

    values = Array.prototype.map.call(selected.children, function (item) {
      return item.textContent;
    });

    correct = values.join('|') === essayOrder.join('|');

    if (correct) {
      feedback.textContent = 'Perfect. This order gives your writing a clear direction.';
      if (!score.order) {
        score.order = true;
        updateGlobalScore();
      }
    } else {
      feedback.textContent = 'Good attempt. A strong short essay often follows this path: answer the topic → opinion → reasons → short conclusion.';
    }
  }

  function initOrderReset() {
    var reset = byId('reset-order');

    if (!reset) {
      return;
    }

    reset.addEventListener('click', function () {
      renderOrderGame();
    });
  }

  function insertAtCursor(textarea, text) {
    var start;
    var end;
    var before;
    var after;

    if (!textarea) {
      return;
    }

    textarea.focus();
    start = textarea.selectionStart || 0;
    end = textarea.selectionEnd || 0;
    before = textarea.value.slice(0, start);
    after = textarea.value.slice(end);
    textarea.value = before + text + after;
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    updateWordCount();
  }

  function updateWordCount() {
    var box = byId('essay-box');
    var count = byId('word-count');
    var words;

    if (!box || !count) {
      return;
    }

    words = box.value.trim() ? box.value.trim().split(/\s+/).length : 0;
    count.textContent = words + ' words';
  }

  function resetEssayFeedback() {
    var feedback = byId('essay-feedback');

    if (feedback) {
      feedback.innerHTML = 'Press <strong>Self-check</strong> to see what is already strong in your text.';
    }
  }

  function setTopic(index) {
    var topic = topics[index];
    var title = byId('topic-title');
    var question = byId('topic-question');
    var ideas = byId('topic-ideas');
    var phrases = byId('topic-phrases');
    var model = byId('model-text');

    if (!topic || !title || !question || !ideas || !phrases || !model) {
      return;
    }

    title.textContent = topic.title;
    question.textContent = topic.question;
    ideas.innerHTML = '';
    phrases.innerHTML = '';
    model.textContent = topic.model;

    topic.ideas.forEach(function (idea) {
      var tag = document.createElement('span');
      tag.textContent = idea;
      ideas.appendChild(tag);
    });

    topic.phrases.forEach(function (phrase) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'tiny-phrase';
      button.textContent = phrase.trim();
      button.setAttribute('data-insert', phrase);
      phrases.appendChild(button);
    });
  }

  function initTopicSelect() {
    var select = byId('topic-select');

    if (!select) {
      return;
    }

    topics.forEach(function (topic, index) {
      var option = document.createElement('option');
      option.value = String(index);
      option.textContent = topic.label;
      select.appendChild(option);
    });

    setTopic(0);

    select.addEventListener('change', function () {
      setTopic(Number(select.value));
      hideModel();
      resetEssayFeedback();
    });
  }

  function initPhraseButtons() {
    var staticButtons = document.querySelectorAll('.phrase-card');
    var essayBox = byId('essay-box');
    var phraseContainer = byId('topic-phrases');

    Array.prototype.forEach.call(staticButtons, function (button) {
      button.addEventListener('click', function () {
        insertAtCursor(essayBox, button.getAttribute('data-insert'));
      });
    });

    if (phraseContainer) {
      phraseContainer.addEventListener('click', function (event) {
        var target = event.target;

        if (target && target.classList.contains('tiny-phrase')) {
          insertAtCursor(essayBox, target.getAttribute('data-insert'));
        }
      });
    }
  }

  function initEssayTools() {
    var essayBox = byId('essay-box');
    var insertPlan = byId('insert-plan');
    var clearButton = byId('clear-essay');
    var checkButton = byId('check-essay');
    var toggleButton = byId('toggle-model');

    if (!essayBox) {
      return;
    }

    essayBox.addEventListener('input', updateWordCount);

    if (insertPlan) {
      insertPlan.addEventListener('click', function () {
        essayBox.value =
          'Introduction: ' + '\n' +
          'In my opinion, ...' + '\n\n' +
          'Reason 1: ' + '\n' +
          'First, ...' + '\n\n' +
          'Reason 2 / example: ' + '\n' +
          'In addition, ... / For example, ...' + '\n\n' +
          'Conclusion: ' + '\n' +
          'Overall, I think that ...';
        updateWordCount();
        resetEssayFeedback();
        essayBox.focus();
      });
    }

    if (clearButton) {
      clearButton.addEventListener('click', function () {
        essayBox.value = '';
        updateWordCount();
        resetEssayFeedback();
      });
    }

    if (checkButton) {
      checkButton.addEventListener('click', function () {
        runEssayCheck();
      });
    }

    if (toggleButton) {
      toggleButton.addEventListener('click', function () {
        toggleModel();
      });
    }
  }

  function runEssayCheck() {
    var essay = byId('essay-box');
    var feedback = byId('essay-feedback');
    var text;
    var words;
    var comments = [];

    if (!essay || !feedback) {
      return;
    }

    text = essay.value.trim();
    words = text ? text.split(/\s+/).length : 0;

    if (!text) {
      feedback.innerHTML = 'Start with 3 to 5 sentences. You can use the essay frame or tap some phrases above.';
      return;
    }

    if (/in my opinion|i believe|i think/i.test(text)) {
      comments.push('✅ You clearly express an opinion.');
    } else {
      comments.push('✨ Add a clear opinion line such as <strong>In my opinion</strong> or <strong>I believe</strong>.');
    }

    if (/first|to begin with/i.test(text)) {
      comments.push('✅ You organize your ideas with a first point.');
    } else {
      comments.push('✨ Add a connector like <strong>First</strong> to guide your reader.');
    }

    if (/for example|for instance/i.test(text)) {
      comments.push('✅ Great: you include an example.');
    } else {
      comments.push('✨ Add one example to make your answer more concrete.');
    }

    if (/overall|to conclude|in conclusion/i.test(text)) {
      comments.push('✅ You have a conclusion.');
    } else {
      comments.push('✨ Finish with a short conclusion such as <strong>Overall, I think...</strong>.');
    }

    if (words >= 90 && words <= 170) {
      comments.push('✅ Your length is in a comfortable range for a short structured answer.');
    } else if (words < 90) {
      comments.push('✨ Try to add a little more development. Aim for around 90–150 words.');
    } else {
      comments.push('✨ Your text is detailed. Now check that every sentence supports your main idea.');
    }

    feedback.innerHTML = comments.join('<br>');
  }

  function hideModel() {
    var box = byId('model-box');

    if (box) {
      box.hidden = true;
    }
  }

  function toggleModel() {
    var box = byId('model-box');

    if (box) {
      box.hidden = !box.hidden;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initChoiceCards();
    renderOrderGame();
    initOrderReset();
    initTopicSelect();
    initPhraseButtons();
    initEssayTools();
    updateGlobalScore();
    updateWordCount();
  });
}());
