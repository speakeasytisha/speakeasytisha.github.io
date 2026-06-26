(() => {
  'use strict';

  const body = document.body;
  const translationToggle = document.getElementById('translationToggle');
  const printBtn = document.getElementById('printBtn');
  const reviewJumpBtn = document.getElementById('reviewJumpBtn');
  const reviewSection = document.getElementById('review');
  const feedbackForm = document.getElementById('feedbackForm');
  const createSummaryBtn = document.getElementById('createSummaryBtn');
  const reviewOutput = document.getElementById('reviewOutput');
  const summaryText = document.getElementById('summaryText');
  const copySummaryBtn = document.getElementById('copySummaryBtn');
  const copyStatus = document.getElementById('copyStatus');
  const resetBtn = document.getElementById('resetBtn');

  function setTranslationState(showFrench) {
    body.classList.toggle('translations-hidden', !showFrench);
    translationToggle.setAttribute('aria-pressed', String(showFrench));
    translationToggle.textContent = showFrench ? 'Français: ON' : 'Français: OFF';
  }

  translationToggle.addEventListener('click', () => {
    const isShowing = !body.classList.contains('translations-hidden');
    setTranslationState(!isShowing);
  });

  printBtn.addEventListener('click', () => window.print());

  reviewJumpBtn.addEventListener('click', () => {
    reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.querySelectorAll('.module-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.module-card');
      const details = card.querySelector('.module-details');
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      details.hidden = isOpen;
      button.setAttribute('aria-expanded', String(!isOpen));
      button.textContent = isOpen ? 'See details' : 'Hide details';
    });
  });

  function getCheckedValues(name) {
    return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((item) => item.value);
  }

  function createSummary() {
    const planFit = document.getElementById('planFit').value || 'No answer selected yet.';
    const priorities = getCheckedValues('priorities');
    const objectives = getCheckedValues('objectives');
    const workContext = document.getElementById('workContext').value.trim();
    const notes = document.getElementById('notes').value.trim();

    const message = [
      'Subject: Review of my English course outline',
      '',
      'Bonjour Tisha,',
      '',
      'J’ai regardé le programme de formation proposé pour ma préparation au LILATE.',
      '',
      `1. Mon avis général : ${planFit}`,
      `2. Objectifs A1.2 retenus : ${objectives.length ? objectives.join(' | ') : 'À valider ensemble.'}`,
      `3. Mes priorités : ${priorities.length ? priorities.join(', ') : 'Aucune priorité sélectionnée pour le moment.'}`,
      `4. Mon intitulé de poste / contexte professionnel : ${workContext || 'Operations manager (à confirmer).'}`,
      `5. Mes remarques : ${notes || 'Pas de remarque supplémentaire pour le moment.'}`,
      '',
      'Merci,',
      'Chaouki'
    ].join('\n');

    summaryText.textContent = message;
    reviewOutput.hidden = false;
    copyStatus.textContent = '';
    reviewOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  createSummaryBtn.addEventListener('click', createSummary);

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textArea);
    return copied;
  }

  copySummaryBtn.addEventListener('click', async () => {
    const text = summaryText.textContent;
    if (!text) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else if (!fallbackCopy(text)) {
        throw new Error('Copy unavailable');
      }
      copyStatus.textContent = 'Copied. You can now paste this into an email to Tisha.';
    } catch (error) {
      copyStatus.textContent = 'Please select the text above and copy it manually.';
    }
  });

  resetBtn.addEventListener('click', () => {
    window.setTimeout(() => {
      reviewOutput.hidden = true;
      copyStatus.textContent = '';
      summaryText.textContent = '';
    }, 0);
  });

  setTranslationState(true);
})();
