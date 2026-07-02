const printBtn = document.getElementById('printBtn');
const jumpFeedbackBtn = document.getElementById('jumpFeedbackBtn');
const feedback = document.getElementById('feedback');

printBtn?.addEventListener('click', () => window.print());
jumpFeedbackBtn?.addEventListener('click', () => feedback?.scrollIntoView({ behavior: 'smooth' }));

document.querySelectorAll('.module-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.module-card');
    const details = card?.querySelector('.module-details');
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    button.textContent = expanded ? 'Details' : 'Hide';
    if (details) details.hidden = expanded;
  });
});

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const targetId = tab.dataset.tab;

    document.querySelectorAll('.tab').forEach((item) => {
      item.classList.toggle('active', item === tab);
      item.setAttribute('aria-selected', item === tab ? 'true' : 'false');
    });

    document.querySelectorAll('.tab-panel').forEach((panel) => {
      const active = panel.id === targetId;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  });
});

const form = document.getElementById('feedbackForm');
const generateSummaryBtn = document.getElementById('generateSummaryBtn');
const summaryOutput = document.getElementById('summaryOutput');
const summaryText = document.getElementById('summaryText');
const copySummaryBtn = document.getElementById('copySummaryBtn');

function selectedModules() {
  return Array.from(document.querySelectorAll('input[name="modules"]:checked'))
    .map((input) => `- ${input.value}`)
    .join('\n') || '- No module selected yet.';
}

function buildSummary() {
  const jobAccuracy = document.getElementById('jobAccuracy')?.value || 'No answer selected.';
  const focusAccuracy = document.getElementById('focusAccuracy')?.value || 'No answer selected.';
  const notes = document.getElementById('notes')?.value.trim() || 'No additional comments.';

  return `Training programme review summary\n\n1. Professional context accuracy:\n${jobAccuracy}\n\n2. Oral communication focus:\n${focusAccuracy}\n\n3. Most useful modules:\n${selectedModules()}\n\n4. Additions, corrections, or priorities:\n${notes}`;
}

generateSummaryBtn?.addEventListener('click', () => {
  summaryText.textContent = buildSummary();
  summaryOutput.hidden = false;
  summaryOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

copySummaryBtn?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(summaryText.textContent);
    copySummaryBtn.textContent = 'Copied';
    setTimeout(() => { copySummaryBtn.textContent = 'Copy'; }, 1400);
  } catch (error) {
    copySummaryBtn.textContent = 'Select text to copy';
    setTimeout(() => { copySummaryBtn.textContent = 'Copy'; }, 1800);
  }
});

form?.addEventListener('reset', () => {
  setTimeout(() => {
    if (summaryOutput) summaryOutput.hidden = true;
    if (summaryText) summaryText.textContent = '';
  }, 0);
});
