document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  function byId(id) {
    return document.getElementById(id);
  }

  function setButtonFlash(button, message) {
    if (!button) {
      return;
    }
    var original = button.getAttribute('data-original-text') || button.textContent;
    button.setAttribute('data-original-text', original);
    button.textContent = message;
    window.setTimeout(function () {
      button.textContent = original;
    }, 1400);
  }

  function safeCopy(text, button) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        setButtonFlash(button, 'Copied!');
      }).catch(function () {
        setButtonFlash(button, 'Copy failed');
      });
    } else {
      setButtonFlash(button, 'Copy failed');
    }
  }

  function showFeedback(el, kind, message) {
    if (!el) {
      return;
    }
    el.classList.remove('hidden', 'good', 'bad');
    el.classList.add('feedback', kind === 'good' ? 'good' : 'bad', 'visible');
    el.textContent = message;
  }

  function clearOptionStates(name) {
    var options = document.querySelectorAll('input[name="' + name + '"]');
    options.forEach(function (input) {
      var label = input.closest('.option-label');
      if (label) {
        label.classList.remove('is-correct', 'is-wrong');
      }
    });
  }

  var teacherNote = 'Mathieu, your answer is clear and relevant, and your ideas are good. You answer the question well and your grammar is mostly correct. To improve, try to develop your ideas more, use more connectors, and choose more precise vocabulary. You already have a good base, and with a little more detail your writing can quickly become stronger and more natural.';

  var copyTeacherNoteBtn = byId('copy-teacher-note');
  var copyNoteBtn = byId('copy-note-btn');

  if (copyTeacherNoteBtn) {
    copyTeacherNoteBtn.addEventListener('click', function () {
      safeCopy(teacherNote, copyTeacherNoteBtn);
    });
  }

  if (copyNoteBtn) {
    copyNoteBtn.addEventListener('click', function () {
      safeCopy(teacherNote, copyNoteBtn);
    });
  }

  var modelButtons = document.querySelectorAll('[data-model-target]');
  var modelPanels = document.querySelectorAll('.model-panel');

  function showModel(id) {
    modelPanels.forEach(function (panel) {
      panel.classList.toggle('hidden', panel.id !== id);
    });
    modelButtons.forEach(function (button) {
      button.classList.toggle('active', button.getAttribute('data-model-target') === id);
    });
  }

  modelButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      showModel(button.getAttribute('data-model-target'));
    });
  });

  var showAllModelsBtn = byId('show-all-models');
  if (showAllModelsBtn) {
    showAllModelsBtn.addEventListener('click', function () {
      modelPanels.forEach(function (panel) {
        panel.classList.remove('hidden');
      });
      modelButtons.forEach(function (button) {
        button.classList.add('active');
      });
      setButtonFlash(showAllModelsBtn, 'Models shown');
    });
  }

  var copyModelButtons = document.querySelectorAll('.copy-model-btn');
  copyModelButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var targetId = button.getAttribute('data-copy-target');
      var target = byId(targetId);
      if (target) {
        safeCopy(target.value, button);
      }
    });
  });

  var q1Button = byId('check-q1');
  var q1Feedback = byId('feedback-q1');
  if (q1Button && q1Feedback) {
    q1Button.addEventListener('click', function () {
      var selected = document.querySelector('input[name="q1"]:checked');
      clearOptionStates('q1');
      if (!selected) {
        showFeedback(q1Feedback, 'bad', 'Choose one answer first.');
        return;
      }

      var selectedLabel = selected.closest('.option-label');
      var correctInput = document.querySelector('input[name="q1"][value="b"]');
      var correctLabel = correctInput ? correctInput.closest('.option-label') : null;

      if (selected.value === 'b') {
        if (selectedLabel) {
          selectedLabel.classList.add('is-correct');
        }
        showFeedback(q1Feedback, 'good', 'Correct. “Effective way” sounds much more precise and natural.');
      } else {
        if (selectedLabel) {
          selectedLabel.classList.add('is-wrong');
        }
        if (correctLabel) {
          correctLabel.classList.add('is-correct');
        }
        showFeedback(q1Feedback, 'bad', 'Not quite. The best answer is “effective way.”');
      }
    });
  }

  var q2Button = byId('check-q2');
  var q2Select = byId('q2-select');
  var q2Feedback = byId('feedback-q2');
  if (q2Button && q2Select && q2Feedback) {
    q2Button.addEventListener('click', function () {
      if (q2Select.value === 'right') {
        showFeedback(q2Feedback, 'good', 'Correct. “In addition,” adds a second supporting point clearly.');
      } else if (q2Select.value) {
        showFeedback(q2Feedback, 'bad', 'Try again. The best connector here is “In addition,”');
      } else {
        showFeedback(q2Feedback, 'bad', 'Choose an answer first.');
      }
    });
  }

  var rewriteModelBtn = byId('show-rewrite-model');
  var rewriteModel = byId('rewrite-model');
  if (rewriteModelBtn && rewriteModel) {
    rewriteModelBtn.addEventListener('click', function () {
      rewriteModel.classList.remove('hidden');
      rewriteModel.classList.add('revealed');
      rewriteModelBtn.textContent = 'Model sentence shown';
      if (typeof rewriteModel.scrollIntoView === 'function') {
        rewriteModel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
});
