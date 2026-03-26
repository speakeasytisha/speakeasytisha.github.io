(function () {
  'use strict';

  var speakingPrompts = [
    {
      title: 'Speaking prompt 1',
      text: 'Talk about a professional situation where clear communication is important. Explain why it matters, give one example, and finish with a practical conclusion.'
    },
    {
      title: 'Speaking prompt 2',
      text: 'Describe a skill you improved during your English training. Explain how you improved it and why it is useful for you now.'
    },
    {
      title: 'Speaking prompt 3',
      text: 'Give your opinion on learning English through real-life situations. Say why it is effective and mention one concrete benefit.'
    },
    {
      title: 'Speaking prompt 4',
      text: 'Imagine you are discussing a future project. Present the idea, explain one advantage, and end with a positive recommendation.'
    }
  ];

  var writingPrompts = [
    {
      title: 'Writing prompt 1',
      text: 'Write a short professional email to request information. State your purpose clearly, ask two precise questions, and end politely.'
    },
    {
      title: 'Writing prompt 2',
      text: 'Write a short opinion paragraph about why regular English practice is effective. Give at least two reasons and one example.'
    },
    {
      title: 'Writing prompt 3',
      text: 'Write a short progress update. Explain what has already improved, what you want to continue working on, and what your next objective is.'
    },
    {
      title: 'Writing prompt 4',
      text: 'Write 80 to 120 words about a useful communication skill at work. Explain why it is important and how people can improve it.'
    }
  ];

  function animateBars() {
    var bars = document.querySelectorAll('.progress span');
    if (!bars.length) {
      return;
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var fill = entry.target.getAttribute('data-fill') || '0';
            entry.target.style.width = fill + '%';
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });

      bars.forEach(function (bar) {
        observer.observe(bar);
      });
    } else {
      bars.forEach(function (bar) {
        var fill = bar.getAttribute('data-fill') || '0';
        bar.style.width = fill + '%';
      });
    }
  }

  function initTabs() {
    var buttons = document.querySelectorAll('.tab-button');
    var panels = document.querySelectorAll('.tab-panel');

    if (!buttons.length || !panels.length) {
      return;
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var targetId = button.getAttribute('data-tab');

        buttons.forEach(function (btn) {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-selected', 'false');
        });

        panels.forEach(function (panel) {
          panel.classList.remove('is-active');
          panel.hidden = true;
        });

        button.classList.add('is-active');
        button.setAttribute('aria-selected', 'true');

        var target = document.getElementById(targetId);
        if (target) {
          target.hidden = false;
          target.classList.add('is-active');
        }
      });
    });
  }

  function renderPrompt(container, prompt) {
    if (!container || !prompt) {
      return;
    }

    container.innerHTML = '' +
      '<h4>' + prompt.title + '</h4>' +
      '<p>' + prompt.text + '</p>' +
      '<p><strong>Tip:</strong> Use a clear beginning, one developed idea, and a short conclusion.</p>';
  }

  function initPromptBoxes() {
    var speakingBox = document.getElementById('speaking-prompt');
    var writingBox = document.getElementById('writing-prompt');
    var speakingButton = document.getElementById('new-speaking');
    var writingButton = document.getElementById('new-writing');
    var speakingIndex = 0;
    var writingIndex = 0;

    if (speakingBox) {
      renderPrompt(speakingBox, speakingPrompts[speakingIndex]);
    }

    if (writingBox) {
      renderPrompt(writingBox, writingPrompts[writingIndex]);
    }

    if (speakingButton) {
      speakingButton.addEventListener('click', function () {
        speakingIndex = (speakingIndex + 1) % speakingPrompts.length;
        renderPrompt(speakingBox, speakingPrompts[speakingIndex]);
      });
    }

    if (writingButton) {
      writingButton.addEventListener('click', function () {
        writingIndex = (writingIndex + 1) % writingPrompts.length;
        renderPrompt(writingBox, writingPrompts[writingIndex]);
      });
    }
  }

  function initAccordions() {
    var items = document.querySelectorAll('.accordion');

    if (!items.length) {
      return;
    }

    items.forEach(function (item) {
      var button = item.querySelector('.accordion__button');
      var content = item.querySelector('.accordion__content');
      var plus = item.querySelector('.accordion__plus');

      if (!button || !content || !plus) {
        return;
      }

      button.addEventListener('click', function () {
        var expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        content.hidden = expanded;
        plus.textContent = expanded ? '+' : '−';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    animateBars();
    initTabs();
    initPromptBoxes();
    initAccordions();
  });
})();
