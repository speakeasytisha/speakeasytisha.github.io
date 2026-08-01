(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const toast = $('#toast');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2300);
  }

  function normalise(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[.!?;,]+$/g, '')
      .replace(/\s+/g, ' ');
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
  }

  function downloadText(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const storage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); return true; } catch { return false; }
    },
    remove(key) {
      try { window.localStorage.removeItem(key); } catch { /* no-op */ }
    }
  };

  // Display controls
  const translationToggle = $('#translationToggle');
  translationToggle?.addEventListener('change', () => {
    document.body.classList.toggle('hide-translations', !translationToggle.checked);
  });
  $('#printBtn')?.addEventListener('click', () => window.print());

  const storedFont = Number(storage.get('mc_lesson2_reference_font'));
  let fontSize = Number.isFinite(storedFont) && storedFont >= 17 && storedFont <= 25 ? storedFont : 19;

  function applyFontSize() {
    document.documentElement.style.setProperty('--base-size', `${fontSize}px`);
    storage.set('mc_lesson2_reference_font', String(fontSize));
  }
  applyFontSize();

  $$('.font-controls button').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.font;
      if (action === 'minus') fontSize = Math.max(17, fontSize - 1);
      if (action === 'plus') fontSize = Math.min(25, fontSize + 1);
      if (action === 'reset') fontSize = 19;
      applyFontSize();
      showToast(`Text size: ${fontSize}px`);
    });
  });

  // Text-to-speech
  const accentSelect = $('#accentSelect');
  const speedSelect = $('#speedSelect');
  let voices = [];

  function loadVoices() {
    if ('speechSynthesis' in window) voices = window.speechSynthesis.getVoices();
  }
  loadVoices();
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      showToast('Audio is not supported by this browser.');
      return;
    }
    const language = accentSelect?.value || 'en-GB';
    const rate = Number(speedSelect?.value || 0.84);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = 1;
    const exact = voices.find(voice => voice.lang === language);
    const close = voices.find(voice => voice.lang?.toLowerCase().startsWith(language.slice(0, 2).toLowerCase()));
    if (exact || close) utterance.voice = exact || close;
    window.speechSynthesis.speak(utterance);
  }

  document.addEventListener('click', event => {
    const speakButton = event.target.closest('.speak-btn');
    if (speakButton) {
      const text = speakButton.dataset.speak || speakButton.textContent.replace(/^▶\s*/, '').trim();
      if (text) speak(text);
    }

    const copyButton = event.target.closest('[data-copy]');
    if (copyButton) {
      copyText(copyButton.dataset.copy || '').then(() => showToast('Model copied.'));
    }
  });

  // Vocabulary tabs
  $$('[data-tabs]').forEach(tabBlock => {
    const tabs = $$('.tab', tabBlock);
    const panels = $$('.tab-panel', tabBlock);
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(item => item.classList.remove('active'));
        panels.forEach(panel => panel.classList.remove('active'));
        tab.classList.add('active');
        $(`[data-panel="${tab.dataset.tab}"]`, tabBlock)?.classList.add('active');
      });
    });
  });

  // Model level switcher
  $$('[data-model-switcher]').forEach(switcher => {
    const buttons = $$('[data-model]', switcher);
    const panels = $$('[data-model-panel]', switcher);
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        buttons.forEach(item => item.classList.remove('active'));
        panels.forEach(panel => panel.classList.remove('active'));
        button.classList.add('active');
        $(`[data-model-panel="${button.dataset.model}"]`, switcher)?.classList.add('active');
      });
    });
  });

  $$('.copy-model').forEach(button => {
    button.addEventListener('click', async () => {
      const model = button.closest('.long-model')?.querySelector('p:not(.mini-label)');
      if (!model) return;
      await copyText(model.textContent.trim());
      showToast('Model copied.');
    });
  });

  // Quiz
  const quizItems = $$('.quiz-item', $('#referenceQuiz') || document);

  function updateScore() {
    const score = quizItems.filter(item => item.dataset.correct === 'true').length;
    const output = $('#quizScore');
    if (output) output.textContent = String(score);
  }

  quizItems.forEach(item => {
    $$('.choices button', item).forEach(button => {
      button.addEventListener('click', () => {
        if (item.dataset.completed === 'true') return;
        item.dataset.completed = 'true';
        const answer = item.dataset.answer || '';
        const correct = normalise(button.textContent) === normalise(answer);
        item.dataset.correct = correct ? 'true' : 'false';

        $$('.choices button', item).forEach(choice => {
          choice.disabled = true;
          if (normalise(choice.textContent) === normalise(answer)) choice.classList.add('correct');
        });
        if (!correct) button.classList.add('incorrect');

        const feedback = $('.feedback', item);
        if (feedback) {
          feedback.textContent = correct ? '✓ Correct — well done.' : `The best answer is: ${answer}`;
          feedback.className = `feedback ${correct ? 'good' : 'bad'}`;
        }
        updateScore();
      });
    });
  });

  $('#resetQuiz')?.addEventListener('click', () => {
    quizItems.forEach(item => {
      delete item.dataset.completed;
      delete item.dataset.correct;
      $$('.choices button', item).forEach(button => {
        button.disabled = false;
        button.classList.remove('correct', 'incorrect');
      });
      const feedback = $('.feedback', item);
      if (feedback) {
        feedback.textContent = '';
        feedback.className = 'feedback';
      }
    });
    updateScore();
    showToast('Your quick check was reset.');
  });

  // Notes
  const notes = $('#personalNotes');
  const storageMessage = $('#storageMessage');
  if (notes) notes.value = storage.get('mc_lesson2_reference_notes') || '';

  function noteMessage(message) {
    if (!storageMessage) return;
    storageMessage.textContent = message;
    window.setTimeout(() => {
      if (storageMessage.textContent === message) storageMessage.textContent = '';
    }, 2500);
  }

  $('#saveNotes')?.addEventListener('click', () => {
    const saved = storage.set('mc_lesson2_reference_notes', notes?.value || '');
    noteMessage(saved ? 'Your notes were saved on this device.' : 'Your browser could not save these notes.');
  });

  $('#copyNotes')?.addEventListener('click', async () => {
    await copyText(notes?.value || '');
    noteMessage('Your notes were copied.');
  });

  $('#downloadNotes')?.addEventListener('click', () => {
    downloadText(notes?.value || '', 'Marie-Christine-Lesson-2-Reference-Notes.txt');
    noteMessage('Your notes were downloaded.');
  });

  $('#clearNotes')?.addEventListener('click', () => {
    if (notes) notes.value = '';
    storage.remove('mc_lesson2_reference_notes');
    noteMessage('Your notes were cleared.');
  });

  // Progress summary
  function progressSummary() {
    const lines = [
      'MARIE-CHRISTINE — LESSON 2 REFERENCE PROGRESS',
      '',
      `Present your family: ${$('[data-progress="family"]')?.value || 'En cours'}`,
      `Choose the right tense: ${$('[data-progress="tenses"]')?.value || 'En cours'}`,
      `Manage a family call: ${$('[data-progress="calls"]')?.value || 'En cours'}`,
      `Share a travel experience: ${$('[data-progress="travel"]')?.value || 'En cours'}`,
      `Quick reference check: ${$('#quizScore')?.textContent || '0'} / 12`,
      '',
      'Comment / next priority:',
      $('#progressComment')?.value.trim() || 'No comment added.'
    ];
    return lines.join('\n');
  }

  $('#copyProgress')?.addEventListener('click', async () => {
    await copyText(progressSummary());
    showToast('Your progress summary was copied.');
  });

  $('#downloadProgress')?.addEventListener('click', () => {
    downloadText(progressSummary(), 'Marie-Christine-Lesson-2-Reference-Progress.txt');
    showToast('Your progress summary was downloaded.');
  });
})();
