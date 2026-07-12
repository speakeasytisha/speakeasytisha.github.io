(() => {
  'use strict';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const storagePrefix = 'sylvain_lesson6_past_';

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      alert('Audio is not available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.88;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => /^en-GB/i.test(v.lang)) || voices.find(v => /^en-US/i.test(v.lang));
    if (preferredVoice) utterance.voice = preferredVoice;
    window.speechSynthesis.speak(utterance);
  }

  function hydrateAudio() {
    $$('[data-say]').forEach(button => button.addEventListener('click', () => speak(button.dataset.say)));
  }

  function hydrateFrenchToggle() {
    const button = $('#frenchToggle');
    if (!button) return;
    const saved = localStorage.getItem(storagePrefix + 'fr') === 'true';
    function apply(on) {
      document.body.classList.toggle('show-fr', on);
      button.setAttribute('aria-pressed', String(on));
      button.textContent = on ? 'FR help: on' : 'FR help';
    }
    apply(saved);
    button.addEventListener('click', () => {
      const on = !document.body.classList.contains('show-fr');
      localStorage.setItem(storagePrefix + 'fr', String(on));
      apply(on);
    });
  }

  function hydrateQuizzes() {
    $$('.question').forEach(question => {
      const correct = question.dataset.answer;
      const explanation = question.dataset.explanation || '';
      const feedback = $('.feedback', question);
      $$('.option', question).forEach(button => {
        button.addEventListener('click', () => {
          const chosen = button.dataset.value;
          $$('.option', question).forEach(option => option.classList.remove('correct', 'incorrect'));
          if (chosen === correct) {
            button.classList.add('correct');
            feedback.className = 'feedback good';
            feedback.textContent = `✓ Correct. ${explanation}`;
          } else {
            button.classList.add('incorrect');
            feedback.className = 'feedback bad';
            feedback.textContent = `Try again. ${explanation}`;
          }
        });
      });
    });
  }

  function hydrateHints() {
    $$('.hint-button').forEach(button => {
      button.addEventListener('click', () => {
        const hint = $('#' + button.dataset.hintTarget);
        if (!hint) return;
        hint.classList.toggle('open');
        button.textContent = hint.classList.contains('open') ? 'Hide hint' : 'Hint';
      });
    });
  }

  function hydrateTranscripts() {
    $$('.transcript-toggle').forEach(button => {
      button.addEventListener('click', () => {
        const transcript = $('#' + button.dataset.target);
        if (!transcript) return;
        transcript.classList.toggle('open');
        button.textContent = transcript.classList.contains('open') ? 'Hide transcript' : 'Show transcript';
      });
    });
  }

  function hydrateChecks() {
    $$('[data-check-key]').forEach(check => {
      const key = storagePrefix + check.dataset.checkKey;
      check.checked = localStorage.getItem(key) === 'true';
      check.addEventListener('change', () => localStorage.setItem(key, String(check.checked)));
    });
  }

  function subjectPronoun(subject) {
    const map = {
      'I': {subject:'I', object:'me', be:'was'},
      'You': {subject:'You', object:'you', be:'were'},
      'He': {subject:'He', object:'him', be:'was'},
      'She': {subject:'She', object:'her', be:'was'},
      'It': {subject:'It', object:'it', be:'was'},
      'We': {subject:'We', object:'us', be:'were'},
      'They': {subject:'They', object:'them', be:'were'},
      'My wife and I': {subject:'My wife and I', object:'us', be:'were'},
      'The airline': {subject:'The airline', object:'it', be:'was'},
      'The client': {subject:'The client', object:'them', be:'was'},
      'The company': {subject:'The company', object:'it', be:'was'},
      'My daughters': {subject:'My daughters', object:'them', be:'were'}
    };
    return map[subject] || {subject, object:'them', be:'was'};
  }

  function buildPersonalSentence() {
    const sentence = $('#personalSentence')?.value || 'I learned English after middle school.';
    const output = $('#personalOutput');
    if (output) output.textContent = sentence;
  }

  function buildProfessionalSentence() {
    const sentence = $('#professionalSentence')?.value || 'We prepared three crew meals for the flight yesterday.';
    const output = $('#professionalOutput');
    if (output) output.textContent = sentence;
  }

  function buildReviewSentence() {
    const sentence = $('#reviewSentence')?.value || 'The airline contacted us last week.';
    const output = $('#reviewOutput');
    if (output) output.textContent = sentence;
  }

  function hydrateBuilders() {
    const configs = [
      {button:'#buildPersonal', ids:['personalSentence'], fn:buildPersonalSentence, out:'#personalOutput'},
      {button:'#buildProfessional', ids:['professionalSentence'], fn:buildProfessionalSentence, out:'#professionalOutput'},
      {button:'#buildReview', ids:['reviewSentence'], fn:buildReviewSentence, out:'#reviewOutput'}
    ];
    configs.forEach(config => {
      const button = $(config.button);
      if (!button) return;
      button.addEventListener('click', config.fn);
      config.ids.forEach(id => $('#' + id)?.addEventListener('change', config.fn));
      config.fn();
      const copyButton = $(config.button.replace('#build', '#copy'));
      if (copyButton) {
        copyButton.addEventListener('click', async () => {
          const text = $(config.out)?.textContent || '';
          try {
            await navigator.clipboard.writeText(text);
            copyButton.textContent = 'Copied ✓';
            setTimeout(() => { copyButton.textContent = 'Copy sentence'; }, 1400);
          } catch {
            alert('Please select and copy the sentence manually.');
          }
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    hydrateAudio();
    hydrateFrenchToggle();
    hydrateQuizzes();
    hydrateHints();
    hydrateTranscripts();
    hydrateChecks();
    hydrateBuilders();
  });
})();
