(() => {
  'use strict';

  const STORAGE_KEY = 'mahria-lakaf-analyse-besoins-v1';
  const form = document.getElementById('needsForm');
  const steps = [...document.querySelectorAll('.form-step')];
  const totalQuestionSteps = steps.length - 1;
  const nav = document.getElementById('stepNav');
  const progressLabel = document.getElementById('progressLabel');
  const progressPercent = document.getElementById('progressPercent');
  const progressFill = document.getElementById('progressFill');
  const saveIndicator = document.getElementById('saveIndicator');
  const validationMessage = document.getElementById('validationMessage');
  const prevButton = document.getElementById('prevStep');
  const nextButton = document.getElementById('nextStep');
  const summaryOutput = document.getElementById('summaryOutput');
  const summaryStatus = document.getElementById('summaryStatus');
  const toast = document.getElementById('toast');
  const pageShell = document.querySelector('.page-shell');
  const sidebar = document.querySelector('.step-sidebar');

  let currentStep = 1;
  let toastTimer;
  let autoSaveTimer;

  const labels = {
    fullName: 'Nom et prénom', completionDate: 'Date de réalisation', email: 'E-mail', phone: 'Téléphone',
    currentStatus: 'Situation actuelle', currentRole: 'Poste ou métier actuel', currentSector: 'Secteur actuel',
    targetRole: 'Poste visé', targetCompany: 'Entreprise visée', targetLocation: 'Lieu du poste', careerProject: 'Projet professionnel',
    englishPurpose: 'Rôle de l’anglais dans le projet', successDefinition: 'Définition de la réussite',
    interviewStatus: 'Avancement du recrutement', interviewDate: 'Date de l’entretien', interviewFormat: 'Format de l’entretien',
    interviewLanguage: 'Langue de l’entretien', interviewKnowledge: 'Informations connues sur le recrutement',
    interviewTopics: 'Sujets d’entretien à préparer', hardestInterviewQuestion: 'Question d’entretien la plus difficile',
    professionalBackground: 'Parcours professionnel', mainResponsibilities: 'Responsabilités principales',
    mainAchievement: 'Réussite professionnelle', challengeExample: 'Situation difficile gérée', strengths: 'Qualités à valoriser',
    otherStrengths: 'Autres compétences', englishFrequency: 'Fréquence d’utilisation de l’anglais', englishContexts: 'Contextes d’utilisation',
    englishEasy: 'Points faciles en anglais', englishDifficult: 'Difficultés en anglais', immersionExperience: 'Expérience en environnement anglophone',
    skillListening: 'Compréhension d’une conversation', skillSpontaneous: 'Réponse spontanée', skillPresentation: 'Présentation du parcours',
    skillGrammar: 'Grammaire', skillVocabulary: 'Vocabulaire professionnel', skillPronunciation: 'Prononciation',
    skillReading: 'Compréhension écrite', skillWriting: 'Expression écrite', speakingBarriers: 'Freins à l’oral',
    cloeDate: 'Date prévue du CLOE', cloeTarget: 'Niveau CLOE visé', cloeExperience: 'Expérience du CLOE',
    cloePriorities: 'Priorités CLOE', otherTests: 'Autres certifications ou tests', cloeQuestions: 'Attentes avant le CLOE',
    diagnosticIntroduction: 'Diagnostic — présentation', diagnosticMotivation: 'Diagnostic — motivation', diagnosticEmail: 'Diagnostic — e-mail',
    grammarPriorities: 'Priorités grammaticales', communicationPriorities: 'Priorités de communication', vocabularyNeeds: 'Vocabulaire professionnel nécessaire',
    learningPreferences: 'Préférences d’apprentissage', selfStudyTime: 'Temps de travail personnel', lessonRhythm: 'Rythme de cours souhaité',
    pastLearningExperience: 'Expériences d’apprentissage précédentes', availabilityDays: 'Jours disponibles', preferredTimes: 'Horaires préférés',
    scheduleConstraints: 'Contraintes de planning', equipment: 'Matériel disponible', accessibilityNeed: 'Besoin d’aménagement',
    accessibilityDetails: 'Aménagements ou conditions à prévoir', firstPriority: 'Priorité des premières séances',
    additionalInformation: 'Informations complémentaires', accuracyConsent: 'Validation des informations', contactConsent: 'Accord pour être recontactée'
  };

  const sectionMap = [
    ['1. INFORMATIONS GÉNÉRALES', ['fullName', 'email', 'phone', 'completionDate', 'currentStatus', 'currentRole', 'currentSector']],
    ['2. PROJET PROFESSIONNEL', ['targetRole', 'targetCompany', 'targetLocation', 'careerProject', 'englishPurpose', 'successDefinition']],
    ['3. ENTRETIEN D’EMBAUCHE', ['interviewStatus', 'interviewDate', 'interviewFormat', 'interviewLanguage', 'interviewKnowledge', 'interviewTopics', 'hardestInterviewQuestion']],
    ['4. PARCOURS ET COMPÉTENCES', ['professionalBackground', 'mainResponsibilities', 'mainAchievement', 'challengeExample', 'strengths', 'otherStrengths']],
    ['5. EXPÉRIENCE DE L’ANGLAIS', ['englishFrequency', 'englishContexts', 'englishEasy', 'englishDifficult', 'immersionExperience']],
    ['6. AUTOÉVALUATION', ['skillListening', 'skillSpontaneous', 'skillPresentation', 'skillGrammar', 'skillVocabulary', 'skillPronunciation', 'skillReading', 'skillWriting', 'speakingBarriers']],
    ['7. PRÉPARATION AU CLOE', ['cloeDate', 'cloeTarget', 'cloeExperience', 'cloePriorities', 'otherTests', 'cloeQuestions']],
    ['8. DIAGNOSTIC ÉCRIT EN ANGLAIS', ['diagnosticIntroduction', 'diagnosticMotivation', 'diagnosticEmail']],
    ['9. PRIORITÉS LINGUISTIQUES', ['grammarPriorities', 'communicationPriorities', 'vocabularyNeeds']],
    ['10. MÉTHODE D’APPRENTISSAGE', ['learningPreferences', 'selfStudyTime', 'lessonRhythm', 'pastLearningExperience']],
    ['11. ORGANISATION ET ACCESSIBILITÉ', ['availabilityDays', 'preferredTimes', 'scheduleConstraints', 'equipment', 'accessibilityNeed', 'accessibilityDetails']],
    ['12. ATTENTES FINALES', ['firstPriority', 'additionalInformation', 'accuracyConsent', 'contactConsent']]
  ];

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[char]);
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
  }

  function initializeDate() {
    const dateInput = document.getElementById('completionDate');
    if (!dateInput.value) dateInput.value = new Date().toISOString().slice(0, 10);
  }

  function createNavigation() {
    nav.innerHTML = '';
    steps.forEach(step => {
      const number = Number(step.dataset.step);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'step-nav-button';
      button.dataset.targetStep = String(number);
      button.innerHTML = `<span class="step-number">${escapeHtml(step.dataset.icon)}</span><span class="step-title">${escapeHtml(step.dataset.title)}</span><span class="step-check">✓</span>`;
      button.addEventListener('click', () => goToStep(number));
      nav.appendChild(button);
    });
  }

  function fieldsForStep(stepNumber) {
    const step = steps.find(item => Number(item.dataset.step) === stepNumber);
    return step ? [...step.querySelectorAll('input, textarea, select')].filter(el => !['button', 'submit'].includes(el.type)) : [];
  }

  function isFieldFilled(field) {
    if (field.type === 'checkbox' || field.type === 'radio') {
      return form.querySelectorAll(`[name="${CSS.escape(field.name)}"]:checked`).length > 0;
    }
    return String(field.value || '').trim().length > 0;
  }

  function stepCompletion(stepNumber) {
    if (stepNumber === 13) return Boolean(summaryOutput.value.trim());
    const fields = fieldsForStep(stepNumber).filter((field, index, all) => all.findIndex(item => item.name === field.name) === index);
    if (!fields.length) return false;
    const meaningful = fields.filter(field => field.type !== 'range');
    const filled = meaningful.filter(isFieldFilled).length;
    return filled >= Math.max(1, Math.ceil(meaningful.length * 0.35));
  }

  function updateNavigation() {
    [...nav.querySelectorAll('.step-nav-button')].forEach(button => {
      const stepNumber = Number(button.dataset.targetStep);
      button.classList.toggle('active', stepNumber === currentStep);
      button.classList.toggle('completed', stepCompletion(stepNumber));
      button.setAttribute('aria-current', stepNumber === currentStep ? 'step' : 'false');
    });
  }

  function getCompletionPercentage() {
    const relevant = [...form.elements].filter(el => el.name && !['hidden', 'button', 'submit', 'range'].includes(el.type));
    const grouped = new Map();
    relevant.forEach(el => {
      if (!grouped.has(el.name)) grouped.set(el.name, []);
      grouped.get(el.name).push(el);
    });
    let points = 0;
    grouped.forEach(group => {
      const filled = group.some(isFieldFilled);
      if (filled) points += 1;
    });
    return Math.round((points / Math.max(grouped.size, 1)) * 100);
  }

  function updateProgress() {
    const percent = getCompletionPercentage();
    const visibleStep = Math.min(currentStep, totalQuestionSteps);
    progressLabel.textContent = currentStep === 13 ? 'Synthèse finale' : `Étape ${visibleStep} sur ${totalQuestionSteps}`;
    progressPercent.textContent = `${percent} % complété`;
    progressFill.style.width = `${percent}%`;
    updateNavigation();
  }

  function clearValidation() {
    validationMessage.classList.remove('show');
    validationMessage.textContent = '';
    [...form.querySelectorAll('.invalid')].forEach(el => el.classList.remove('invalid'));
  }

  function validateStep(stepNumber) {
    clearValidation();
    const requiredFields = fieldsForStep(stepNumber).filter(field => field.required);
    const invalid = [];
    const processedGroups = new Set();

    requiredFields.forEach(field => {
      if ((field.type === 'radio' || field.type === 'checkbox') && processedGroups.has(field.name)) return;
      if (field.type === 'radio' || field.type === 'checkbox') {
        processedGroups.add(field.name);
        const group = [...form.querySelectorAll(`[name="${CSS.escape(field.name)}"]`)];
        if (!group.some(item => item.checked)) invalid.push(group[0]);
      } else if (!field.checkValidity() || !String(field.value).trim()) {
        invalid.push(field);
      }
    });

    if (invalid.length) {
      invalid.forEach(el => el.classList.add('invalid'));
      validationMessage.textContent = 'Merci de compléter les champs obligatoires signalés avant de continuer.';
      validationMessage.classList.add('show');
      invalid[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      invalid[0].focus({ preventScroll: true });
      return false;
    }
    return true;
  }

  function goToStep(stepNumber, { validateCurrent = false } = {}) {
    if (stepNumber < 1 || stepNumber > steps.length) return;
    if (validateCurrent && currentStep <= totalQuestionSteps && stepNumber > currentStep && !validateStep(currentStep)) return;
    clearValidation();
    currentStep = stepNumber;
    steps.forEach(step => step.classList.toggle('active', Number(step.dataset.step) === currentStep));
    prevButton.disabled = currentStep === 1;
    nextButton.style.display = currentStep === steps.length ? 'none' : '';
    prevButton.textContent = currentStep === steps.length ? '← Modifier mes réponses' : '← Étape précédente';
    nextButton.textContent = currentStep === totalQuestionSteps ? 'Générer ma synthèse →' : 'Étape suivante →';
    updateProgress();
    saveState(false);
    document.querySelector('.form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (currentStep === steps.length) generateSummary();
  }

  function getFormData() {
    const data = {};
    [...new Set([...form.elements].filter(el => el.name).map(el => el.name))].forEach(name => {
      const elements = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
      const first = elements[0];
      if (!first) return;
      if (first.type === 'checkbox') data[name] = elements.filter(el => el.checked).map(el => el.value);
      else if (first.type === 'radio') data[name] = elements.find(el => el.checked)?.value || '';
      else data[name] = first.value;
    });
    return data;
  }

  function applyFormData(data = {}) {
    Object.entries(data).forEach(([name, value]) => {
      const elements = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
      if (!elements.length) return;
      const first = elements[0];
      if (first.type === 'checkbox') {
        const values = Array.isArray(value) ? value : [value];
        elements.forEach(el => { el.checked = values.includes(el.value); });
      } else if (first.type === 'radio') {
        elements.forEach(el => { el.checked = el.value === value; });
      } else {
        first.value = value ?? '';
      }
    });
    updateRangeOutputs();
    updateWordCounts();
    updateProgress();
  }

  function saveState(showConfirmation = true) {
    const payload = { data: getFormData(), currentStep, savedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    const savedTime = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date());
    saveIndicator.textContent = `Brouillon enregistré à ${savedTime}`;
    saveIndicator.classList.add('saved');
    if (showConfirmation) showToast('Votre brouillon a été enregistré sur cet appareil.');
  }

  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    try {
      const payload = JSON.parse(raw);
      applyFormData(payload.data || {});
      currentStep = Number(payload.currentStep) || 1;
      const date = payload.savedAt ? new Date(payload.savedAt) : null;
      saveIndicator.textContent = date && !Number.isNaN(date.getTime())
        ? `Brouillon du ${new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date)}`
        : 'Brouillon retrouvé';
      saveIndicator.classList.add('saved');
      return true;
    } catch (error) {
      console.error('Impossible de charger le brouillon', error);
      return false;
    }
  }

  function resetAll() {
    const confirmed = window.confirm('Voulez-vous réellement effacer toutes les réponses enregistrées sur cet appareil ?');
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEY);
    form.reset();
    initializeDate();
    form.querySelector('[name="fullName"]').value = 'Mahria LAKAF';
    updateRangeOutputs();
    updateWordCounts();
    saveIndicator.textContent = 'Brouillon non enregistré';
    saveIndicator.classList.remove('saved');
    goToStep(1);
    showToast('Le questionnaire a été réinitialisé.');
  }

  function valueForSummary(data, key) {
    const value = data[key];
    if (Array.isArray(value)) return value.length ? value.join(' ; ') : 'Non renseigné';
    if (key.toLowerCase().includes('date') && value) return formatDate(value);
    if (key.startsWith('skill') && value) return `${value}/5`;
    return String(value || '').trim() || 'Non renseigné';
  }

  function generateSummaryText() {
    const data = getFormData();
    const header = [
      'ANALYSE DES BESOINS — MAHRIA LAKAF',
      'Préparation à un entretien d’embauche et à la certification CLOE',
      '',
      `Document généré le : ${new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date())}`,
      `Taux de complétion : ${getCompletionPercentage()} %`,
      ''
    ];

    const body = [];
    sectionMap.forEach(([title, keys]) => {
      body.push(title);
      keys.forEach(key => body.push(`${labels[key] || key} : ${valueForSummary(data, key)}`));
      body.push('');
    });

    body.push('SYNTHÈSE POUR L’ÉCHANGE TÉLÉPHONIQUE');
    body.push(`Objectif professionnel prioritaire : ${valueForSummary(data, 'targetRole')}`);
    body.push(`Échéance entretien : ${valueForSummary(data, 'interviewDate')}`);
    body.push(`Échéance CLOE : ${valueForSummary(data, 'cloeDate')}`);
    body.push(`Priorité des premières séances : ${valueForSummary(data, 'firstPriority')}`);
    body.push(`Points d’entretien à préparer : ${valueForSummary(data, 'interviewTopics')}`);
    body.push(`Difficultés principales déclarées : ${valueForSummary(data, 'englishDifficult')}`);
    body.push(`Freins à l’oral : ${valueForSummary(data, 'speakingBarriers')}`);
    body.push(`Préférences pédagogiques : ${valueForSummary(data, 'learningPreferences')}`);
    body.push('');
    body.push('Document préparatoire destiné à personnaliser le parcours de formation.');
    body.push('Formatrice : Tisha DOUTY-DOSIERE — SpeakEasy Tisha / Connect Learning');
    return [...header, ...body].join('\n');
  }

  function generateSummary() {
    const summary = generateSummaryText();
    summaryOutput.value = summary;
    const percent = getCompletionPercentage();
    summaryStatus.className = `summary-status${percent < 55 ? ' warning' : ''}`;
    summaryStatus.textContent = percent >= 80
      ? `Votre analyse est complétée à ${percent} %. La synthèse est prête à être copiée ou téléchargée.`
      : `Votre analyse est complétée à ${percent} %. Vous pouvez envoyer cette version ou revenir compléter certaines étapes.`;
    saveState(false);
    updateNavigation();
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast('La synthèse a été copiée.');
    } catch {
      summaryOutput.focus();
      summaryOutput.select();
      document.execCommand('copy');
      showToast('La synthèse a été copiée.');
    }
  }

  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function buildHtmlSummary() {
    const text = generateSummaryText();
    return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Analyse des besoins — Mahria LAKAF</title><style>body{font-family:Arial,sans-serif;max-width:900px;margin:40px auto;padding:0 22px;color:#172433;line-height:1.55}header{background:#0c2134;color:white;padding:28px;border-radius:18px;margin-bottom:24px}h1{margin:0 0 8px;font-size:28px}pre{white-space:pre-wrap;font:14px/1.65 Arial,sans-serif;border:1px solid #dbe5eb;border-radius:14px;padding:24px;background:#f7fafb}footer{margin-top:20px;color:#627181;font-size:12px}</style></head><body><header><h1>Analyse des besoins — Mahria LAKAF</h1><div>Entretien d’embauche · Anglais professionnel · Certification CLOE</div></header><pre>${escapeHtml(text)}</pre><footer>Formatrice : Tisha DOUTY-DOSIERE · SpeakEasy Tisha / Connect Learning</footer></body></html>`;
  }

  function updateRangeOutputs() {
    document.querySelectorAll('.skill-rating input[type="range"]').forEach(input => {
      const output = input.parentElement.querySelector('output');
      output.value = input.value;
      output.textContent = input.value;
    });
  }

  function updateWordCounts() {
    document.querySelectorAll('[data-count-for]').forEach(counter => {
      const field = form.elements[counter.dataset.countFor];
      const text = String(field?.value || '').trim();
      counter.textContent = text ? text.split(/\s+/).filter(Boolean).length : 0;
    });
  }

  function scheduleAutoSave() {
    saveIndicator.textContent = 'Modifications non enregistrées…';
    saveIndicator.classList.remove('saved');
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => saveState(false), 900);
  }

  createNavigation();
  initializeDate();
  const hasSavedState = loadState();
  goToStep(hasSavedState ? currentStep : 1);

  form.addEventListener('input', event => {
    if (event.target.matches('input[type="range"]')) updateRangeOutputs();
    updateWordCounts();
    updateProgress();
    scheduleAutoSave();
    event.target.classList.remove('invalid');
  });
  form.addEventListener('change', event => {
    updateProgress();
    scheduleAutoSave();
    event.target.classList.remove('invalid');
  });

  nextButton.addEventListener('click', () => {
    if (currentStep === totalQuestionSteps) {
      if (!validateStep(currentStep)) return;
      goToStep(13);
    } else {
      goToStep(currentStep + 1, { validateCurrent: true });
    }
  });
  prevButton.addEventListener('click', () => goToStep(currentStep === 13 ? 12 : currentStep - 1));

  document.querySelectorAll('[data-go-step]').forEach(button => button.addEventListener('click', () => goToStep(Number(button.dataset.goStep))));
  document.getElementById('resumeButton').addEventListener('click', () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { showToast('Aucun brouillon précédent n’a été trouvé.'); goToStep(1); return; }
    loadState();
    goToStep(currentStep);
    showToast('Votre brouillon a été restauré.');
  });
  document.getElementById('saveDraft').addEventListener('click', () => saveState(true));
  document.getElementById('resetForm').addEventListener('click', resetAll);
  document.getElementById('generateSummary').addEventListener('click', generateSummary);
  document.getElementById('copySummary').addEventListener('click', () => { generateSummary(); copyText(summaryOutput.value); });
  document.getElementById('downloadSummary').addEventListener('click', () => {
    generateSummary();
    downloadFile(summaryOutput.value, 'Mahria-LAKAF-analyse-des-besoins.txt', 'text/plain;charset=utf-8');
    showToast('La synthèse texte a été téléchargée.');
  });
  document.getElementById('downloadHtmlSummary').addEventListener('click', () => {
    generateSummary();
    downloadFile(buildHtmlSummary(), 'Mahria-LAKAF-analyse-des-besoins.html', 'text/html;charset=utf-8');
    showToast('La synthèse HTML a été téléchargée.');
  });
  document.getElementById('printSummary').addEventListener('click', () => { generateSummary(); window.print(); });
  document.getElementById('toggleSidebar').addEventListener('click', event => {
    const collapsed = sidebar.classList.toggle('collapsed');
    pageShell.classList.toggle('sidebar-collapsed', collapsed);
    event.currentTarget.textContent = collapsed ? '+' : '−';
    event.currentTarget.setAttribute('aria-expanded', String(!collapsed));
  });

  updateRangeOutputs();
  updateWordCounts();
  updateProgress();
})();
