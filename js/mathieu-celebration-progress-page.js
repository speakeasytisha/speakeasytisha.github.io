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

  function celebrate() {
    var layer = byId('confetti-layer');
    if (!layer) {
      return;
    }

    var colors = ['#ffb84f', '#ff7c88', '#8f67ff', '#2e82d7', '#1e9b64'];
    var count = 60;
    var i;

    for (i = 0; i < count; i += 1) {
      (function (index) {
        var piece = document.createElement('span');
        piece.className = 'confetti' + (index % 4 === 0 ? ' circle' : '');
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (3 + Math.random() * 3) + 's';
        piece.style.animationDelay = (Math.random() * 0.8) + 's';
        piece.style.transform = 'translateY(-20px) rotate(' + Math.floor(Math.random() * 180) + 'deg)';
        layer.appendChild(piece);

        window.setTimeout(function () {
          if (piece.parentNode) {
            piece.parentNode.removeChild(piece);
          }
        }, 7000);
      }(i));
    }
  }

  var celebrateBtn = byId('celebrate-btn');
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', function () {
      celebrate();
      flashButton(celebrateBtn, 'Well done!');
    });
  }

  var replayBtn = byId('replay-confetti');
  if (replayBtn) {
    replayBtn.addEventListener('click', function () {
      celebrate();
      flashButton(replayBtn, 'Celebrating!');
    });
  }

  var printBtn = byId('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      window.print();
    });
  }

  var copyButtons = document.querySelectorAll('.copy-btn');
  var i;
  for (i = 0; i < copyButtons.length; i += 1) {
    copyButtons[i].addEventListener('click', function () {
      var targetId = this.getAttribute('data-copy-target');
      var target = byId(targetId);
      if (target) {
        copyText(target.value || target.textContent, this);
      }
    });
  }

  window.setTimeout(celebrate, 500);
});
