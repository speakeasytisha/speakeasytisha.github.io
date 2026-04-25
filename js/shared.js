(function () {
  'use strict';

  window.YanisShared = {
    accent: { lang: 'en-GB', label: 'British English' },
    setAccent: function (lang, label) {
      this.accent.lang = lang;
      this.accent.label = label;
      var status = document.getElementById('voiceStatus');
      if (status) {
        status.textContent = 'Current accent: ' + label + '. Use the speaker buttons to hear the English only.';
      }
      var uk = document.getElementById('accentUK');
      var us = document.getElementById('accentUS');
      if (uk && us) {
        var isUK = lang === 'en-GB';
        uk.classList.toggle('active', isUK);
        us.classList.toggle('active', !isUK);
        uk.setAttribute('aria-pressed', String(isUK));
        us.setAttribute('aria-pressed', String(!isUK));
      }
    },
    cleanText: function (text) {
      return String(text || '')
        .replace(/\s+/g, ' ')
        .replace(/[•]/g, ' ')
        .trim();
    },
    findVoice: function (targetLang) {
      if (!window.speechSynthesis) {
        return null;
      }
      var voices = window.speechSynthesis.getVoices();
      var exact = voices.filter(function (v) {
        return v.lang && v.lang.toLowerCase().indexOf(targetLang.toLowerCase()) === 0;
      });
      if (exact.length) {
        return exact[0];
      }
      return voices[0] || null;
    },
    speak: function (text) {
      if (!window.speechSynthesis) {
        return;
      }
      window.speechSynthesis.cancel();
      var utterance = new SpeechSynthesisUtterance(this.cleanText(text));
      utterance.lang = this.accent.lang;
      var voice = this.findVoice(this.accent.lang);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = 0.94;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    },
    stop: function () {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    },
    bindAudioButtons: function () {
      Array.prototype.forEach.call(document.querySelectorAll('[data-speak-text]'), function (btn) {
        btn.addEventListener('click', function () {
          window.YanisShared.speak(btn.getAttribute('data-speak-text'));
        });
      });
    },
    setupAccentControls: function () {
      var uk = document.getElementById('accentUK');
      var us = document.getElementById('accentUS');
      var stop = document.getElementById('stopAudio');
      if (uk) {
        uk.addEventListener('click', function () {
          window.YanisShared.setAccent('en-GB', 'British English');
        });
      }
      if (us) {
        us.addEventListener('click', function () {
          window.YanisShared.setAccent('en-US', 'American English');
        });
      }
      if (stop) {
        stop.addEventListener('click', function () {
          window.YanisShared.stop();
        });
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = function () {};
      }
    },
    setupNotes: function () {
      Array.prototype.forEach.call(document.querySelectorAll('textarea[data-notes-key]'), function (area) {
        var key = area.getAttribute('data-notes-key');
        try {
          area.value = localStorage.getItem(key) || '';
        } catch (e) {}

        area.addEventListener('input', function () {
          try {
            localStorage.setItem(key, area.value);
          } catch (e) {}
        });
      });
      Array.prototype.forEach.call(document.querySelectorAll('[data-clear-notes]'), function (btn) {
        btn.addEventListener('click', function () {
          var key = btn.getAttribute('data-clear-notes');
          var area = document.querySelector('textarea[data-notes-key="' + key + '"]');
          if (area) {
            area.value = '';
            try {
              localStorage.removeItem(key);
            } catch (e) {}
          }
        });
      });
    },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i -= 1) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }
      return a;
    },
    init: function () {
      this.setupAccentControls();
      this.bindAudioButtons();
      this.setupNotes();
      this.setAccent('en-GB', 'British English');
    }
  };
})();
