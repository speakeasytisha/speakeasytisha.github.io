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

  function wireToggle(buttonId, selector) {
    var button = byId(buttonId);
    var box = document.querySelector(selector);
    if (!button || !box) {
      return;
    }
    button.addEventListener('click', function () {
      var isHidden = box.style.display === 'none';
      box.style.display = isHidden ? 'block' : 'none';
      flashButton(button, isHidden ? 'Model shown' : 'Model hidden');
    });
  }

  wireToggle('toggle-model-1', '.model-panel:nth-of-type(1) .model-text');
  wireToggle('toggle-model-2', '.model-panel:nth-of-type(2) .model-text');
});
