(() => {
  'use strict';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      alert('Audio is not available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';
    u.rate = 0.88;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => /^en-GB/i.test(v.lang)) || voices.find(v => /^en-US/i.test(v.lang));
    if (preferred) u.voice = preferred;
    window.speechSynthesis.speak(u);
  }

  function hydrateAudio() {
    $$('[data-say]').forEach(button => button.addEventListener('click', () => speak(button.dataset.say)));
  }

  function hydrateFrenchToggle() {
    const toggle = $('#frenchToggle');
    if (!toggle) return;
    const stored = localStorage.getItem('sylvain-future-fr-help') === 'true';
    document.body.classList.toggle('show-fr', stored);
    toggle.setAttribute('aria-pressed', String(stored));
    toggle.textContent = stored ? 'FR help: on' : 'FR help';
    toggle.addEventListener('click', () => {
      const now = !document.body.classList.contains('show-fr');
      document.body.classList.toggle('show-fr', now);
      toggle.setAttribute('aria-pressed', String(now));
      toggle.textContent = now ? 'FR help: on' : 'FR help';
      localStorage.setItem('sylvain-future-fr-help', String(now));
    });
  }

  function hydrateQuiz() {
    // Answer positions are mixed permanently in the HTML (2nd → 3rd → 1st).
    // This means the exercises remain mixed even if JavaScript is unavailable.
    $$('.question').forEach(question => {
      const answer = question.dataset.answer;
      const explanation = question.dataset.explanation || '';
      const feedback = $('.feedback', question);
      $$('.option', question).forEach(option => {
        option.addEventListener('click', () => {
          const chosen = option.dataset.value;
          $$('.option', question).forEach(btn => btn.classList.remove('correct', 'incorrect'));
          if (chosen === answer) {
            option.classList.add('correct');
            feedback.className = 'feedback good';
            feedback.textContent = `✓ Correct. ${explanation}`;
          } else {
            option.classList.add('incorrect');
            feedback.className = 'feedback bad';
            feedback.textContent = `Try again. ${explanation}`;
          }
        });
      });
    });
  }

  function hydrateTranscript() {
    $$('.transcript-toggle').forEach(button => {
      button.addEventListener('click', () => {
        const target = $('#' + button.dataset.target);
        if (!target) return;
        target.classList.toggle('open');
        button.textContent = target.classList.contains('open') ? 'Hide transcript' : 'Show transcript';
      });
    });
  }

  function futureAux(subject, type) {
    const isI = subject === 'I';
    const isThirdSingular = ['The team', 'The driver', 'The flight', 'My wife'].includes(subject);
    if (type === 'going') return `${isI ? 'am' : (isThirdSingular ? 'is' : 'are')} going to`;
    if (type === 'arrangement') return isI ? 'am' : (isThirdSingular ? 'is' : 'are');
    return 'will';
  }

  function personalSentence() {
    const subject = $('#personalSubject')?.value || 'We';
    const type = $('#personalFuture')?.value || 'going';
    const action = $('#personalAction')?.value || 'move to Lisbon';
    const time = $('#personalTime')?.value || 'in August';
    const reason = $('#personalReason')?.value || '';
    const aux = futureAux(subject, type);
    const verb = type === 'arrangement'
      ? action.replace(/^to\s+/, '').replace(/^(move|meet|look|create)\b/, m => ({move:'moving',meet:'meeting',look:'looking',create:'creating'}[m]))
      : action.replace(/^to\s+/, '');
    const sentence = `${subject} ${aux} ${verb} ${time}${reason ? ` ${reason}` : ''}.`;
    const output = $('#personalOutput');
    if (output) output.textContent = sentence.replace(/\s+/g, ' ').replace(' .', '.');
  }

  function professionalSentence() {
    const subject = $('#professionalSubject')?.value || 'We';
    const type = $('#professionalFuture')?.value || 'going';
    const action = $('#professionalAction')?.value || 'prepare the revised order';
    const time = $('#professionalTime')?.value || 'tomorrow morning';
    const detail = $('#professionalDetail')?.value || '';
    const aux = futureAux(subject, type);
    const verb = type === 'arrangement'
      ? action.replace(/^(prepare|deliver|send|check)\b/, m => ({prepare:'preparing',deliver:'delivering',send:'sending',check:'checking'}[m]))
      : action;
    const sentence = `${subject} ${aux} ${verb} ${time}${detail ? ` ${detail}` : ''}.`;
    const output = $('#professionalOutput');
    if (output) output.textContent = sentence.replace(/\s+/g, ' ').replace(' .', '.');
  }

  function hydrateBuilder() {
    const personalButton = $('#buildPersonal');
    const professionalButton = $('#buildProfessional');
    if (personalButton) {
      personalButton.addEventListener('click', personalSentence);
      ['personalSubject','personalFuture','personalAction','personalTime','personalReason'].forEach(id => $('#' + id)?.addEventListener('change', personalSentence));
      personalSentence();
    }
    if (professionalButton) {
      professionalButton.addEventListener('click', professionalSentence);
      ['professionalSubject','professionalFuture','professionalAction','professionalTime','professionalDetail'].forEach(id => $('#' + id)?.addEventListener('change', professionalSentence));
      professionalSentence();
    }
  }

  function hydrateChecks() {
    $$('[data-check-key]').forEach(box => {
      const key = 'sylvain-future-' + box.dataset.checkKey;
      box.checked = localStorage.getItem(key) === 'true';
      box.addEventListener('change', () => localStorage.setItem(key, String(box.checked)));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    hydrateFrenchToggle();
    hydrateAudio();
    hydrateQuiz();
    hydrateTranscript();
    hydrateBuilder();
    hydrateChecks();
  });
})();
