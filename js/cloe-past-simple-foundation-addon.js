(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  let accent = 'US';
  let voices = [];

  function loadVoices() {
    try {
      voices = speechSynthesis.getVoices() || [];
    } catch {
      voices = [];
    }
  }

  function pickVoice() {
    const lang = accent === 'UK' ? 'en-GB' : 'en-US';
    return voices.find(v => (v.lang || '').toLowerCase() === lang.toLowerCase())
      || voices.find(v => (v.lang || '').toLowerCase().startsWith('en-'))
      || null;
  }

  function speakText(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = accent === 'UK' ? 'en-GB' : 'en-US';
    const voice = pickVoice();
    if (voice) utter.voice = voice;
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  }

  function normalise(text) {
    return (text || '')
      .toLowerCase()
      .replace(/[’']/g, "'")
      .replace(/[?.!,]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function checkGroup(key) {
    const section = document.querySelector(`[data-feedback="${key}"]`)?.closest('.practice-card');
    if (!section) return;
    const inputs = $$('input[data-answer]', section);
    let correct = 0;
    const wrongItems = [];

    inputs.forEach((input, index) => {
      const answers = (input.dataset.answer || '').split('|').map(a => normalise(a));
      const value = normalise(input.value);
      const ok = answers.includes(value);
      const lineFeedback = input.closest('.exercise-item')?.querySelector('.mini-feedback');

      input.classList.remove('good', 'bad');
      input.classList.add(ok ? 'good' : 'bad');

      if (ok) {
        correct += 1;
        if (lineFeedback) {
          lineFeedback.className = 'mini-feedback good';
          lineFeedback.textContent = '✓ Correct';
        }
      } else {
        wrongItems.push(index + 1);
        if (lineFeedback) {
          const hint = input.dataset.hint || 'Check the form carefully.';
          const expected = input.dataset.correctDisplay || answers[0] || '';
          lineFeedback.className = 'mini-feedback bad';
          lineFeedback.textContent = `Try this: ${expected}. ${hint}`;
        }
      }
    });

    const feedback = $(`[data-feedback="${key}"]`);
    if (!feedback) return;
    feedback.className = 'feedback ' + (correct === inputs.length ? 'good' : 'bad');
    if (correct === inputs.length) {
      feedback.textContent = `Excellent! ${correct}/${inputs.length} correct.`;
    } else {
      const itemText = wrongItems.length ? `Check item${wrongItems.length > 1 ? 's' : ''} ${wrongItems.join(', ')}.` : '';
      feedback.textContent = `${correct}/${inputs.length} correct. ${itemText}`;
    }
  }

  const builderItems = [
    'First, I prepared the documents.',
    'Then, I welcomed the guests.',
    'After that, I solved a small problem.',
    'Finally, I wrote a follow-up email.'
  ];

  function renderBuilder() {
    const pool = $('#builderPool');
    const drop = $('#builderDrop');
    if (!pool || !drop) return;
    pool.innerHTML = '';
    drop.innerHTML = '';
    $('#builderFeedback').textContent = '';
    shuffle(builderItems).forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.textContent = item;
      btn.addEventListener('click', () => {
        drop.appendChild(btn);
      });
      pool.appendChild(btn);
    });
  }

  function checkBuilder() {
    const chosen = $$('#builderDrop .chip').map(chip => chip.textContent.trim());
    const feedback = $('#builderFeedback');
    const ok = chosen.length === builderItems.length && chosen.every((item, index) => item === builderItems[index]);
    feedback.className = 'feedback ' + (ok ? 'good' : 'bad');
    feedback.textContent = ok
      ? 'Great order! The sequence is logical and easy to use in the exam.'
      : 'Try again: start with First, then use Then, After that, and Finally.';
  }

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function bindEvents() {
    $('#frToggle')?.addEventListener('click', () => {
      document.body.classList.toggle('show-fr');
      $('#frToggle').textContent = document.body.classList.contains('show-fr')
        ? '🇫🇷 Hide French help'
        : '🇫🇷 Show French help';
    });

    $('#voiceToggle')?.addEventListener('click', () => {
      accent = accent === 'US' ? 'UK' : 'US';
      $('#voiceToggle').textContent = `🎙️ Accent: ${accent}`;
    });

    $$('[data-check]').forEach(btn => {
      btn.addEventListener('click', () => checkGroup(btn.dataset.check));
    });

    $$('[data-toggle-hints]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.toggleHints;
        const panel = document.querySelector(`[data-hints="${key}"]`);
        if (!panel) return;
        const isHidden = panel.hasAttribute('hidden');
        if (isHidden) {
          panel.removeAttribute('hidden');
          btn.textContent = '💡 Hide hints';
        } else {
          panel.setAttribute('hidden', '');
          btn.textContent = '💡 Show hints';
        }
      });
    });

    $('[data-check-builder]')?.addEventListener('click', checkBuilder);
    $('#resetBuilder')?.addEventListener('click', renderBuilder);

    $$('[data-speak]').forEach(btn => {
      btn.addEventListener('click', () => speakText(btn.dataset.speak || btn.textContent));
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    if ('speechSynthesis' in window) {
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    bindEvents();
    renderBuilder();
  });
})();
