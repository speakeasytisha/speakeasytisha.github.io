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

  var toggleModelBtn = byId('toggle-model');
  if (toggleModelBtn) {
    toggleModelBtn.addEventListener('click', function () {
      var model = byId('main-model');
      if (!model) {
        return;
      }
      var isHidden = model.style.display === 'none';
      model.style.display = isHidden ? 'block' : 'none';
      flashButton(toggleModelBtn, isHidden ? 'Model shown' : 'Model hidden');
    });
  }
});
