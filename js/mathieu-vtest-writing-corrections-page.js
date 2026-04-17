document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  function byId(id) {
    return document.getElementById(id);
  }

  function flashButton(button, message) {
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

  function copyText(text, button) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      flashButton(button, 'Copy failed');
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      flashButton(button, 'Copied!');
    }).catch(function () {
      flashButton(button, 'Copy failed');
    });
  }

  var copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var targetId = button.getAttribute('data-copy-target');
      var target = byId(targetId);
      if (target) {
        copyText(target.value || target.textContent, button);
      }
    });
  });

  var showAllModelsBtn = byId('show-all-models');
  if (showAllModelsBtn) {
    showAllModelsBtn.addEventListener('click', function () {
      var panels = document.querySelectorAll('.hidden-model');
      panels.forEach(function (panel) {
        panel.style.display = 'block';
      });
      flashButton(showAllModelsBtn, 'Models shown');
    });
  }

  var toggleButtons = document.querySelectorAll('.toggle-model-btn');
  toggleButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var panel = button.closest('.task-card');
      if (!panel) {
        return;
      }
      var textBox = panel.querySelector('.model-text');
      if (!textBox) {
        return;
      }
      var isHidden = textBox.style.display === 'none';
      textBox.style.display = isHidden ? 'block' : 'none';
      button.textContent = isHidden ? 'Hide / show model' : 'Show model again';
    });
  });
});
