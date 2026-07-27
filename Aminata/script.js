(() => {
  'use strict';

  const STORAGE_KEY = 'aminata-needs-analysis-v1';
  const form = document.getElementById('needsForm');
  const toast = document.getElementById('toast');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const progressMessage = document.getElementById('progressMessage');
  const summaryPreview = document.getElementById('summaryPreview');
  const summaryPreviewWrap = document.getElementById('summaryPreviewWrap');
  const copySummaryBtn = document.getElementById('copySummary');
  const downloadSummaryBtn = document.getElementById('downloadSummary');
  const prepareEmailBtn = document.getElementById('prepareEmail');
  const emailReminder = document.getElementById('emailReminder');

  const ratingItems = [
    ['understandConversation', 'Comprendre une conversation courante'],
    ['understandFastSpeech', 'Comprendre lorsque la personne parle vite'],
    ['speakSpontaneously', 'Parler spontanément sans préparer'],
    ['introduceSelf', 'Me présenter et parler de mon parcours'],
    ['answerRecruiter', 'Répondre aux questions d’un recruteur'],
    ['handlePassenger', 'Gérer une demande de passager'],
    ['differentAccents', 'Comprendre différents accents'],
    ['professionalEmail', 'Rédiger un e-mail professionnel'],
    ['grammarUse', 'Construire des phrases grammaticalement correctes'],
    ['pronunciation', 'Prononcer clairement et être comprise'],
    ['unexpectedSituation', 'Réagir dans une situation imprévue']
  ];

  const ratingOptions = [
    'Très difficile',
    'Difficile',
    'En cours d’acquisition',
    'Assez à l’aise',
    'À l’aise'
  ];

  const priorities = [
    'Réussir le LILATE',
    'Progresser vers le niveau B2',
    'Préparer un entretien Air France',
    'Présenter mon parcours et mes motivations',
    'Améliorer ma compréhension orale',
    'Parler plus spontanément',
    'Développer le vocabulaire du personnel navigant',
    'Accueillir et renseigner les passagers',
    'Gérer une réclamation ou un passager inquiet',
    'Donner des consignes et informations de sécurité',
    'Faire des annonces à bord',
    'Comprendre différents accents',
    'Améliorer ma prononciation',
    'Revoir la grammaire essentielle',
    'Rédiger des e-mails professionnels',
    'M’entraîner avec des examens blancs'
  ];

  const recordingTasks = [
    {
      id: 'oral1',
      title: 'Personal and professional introduction',
      target: '1 à 2 minutes',
      prompt: 'Please introduce yourself. Talk about where you live, your professional experience and your current project.',
      help: [
        'My name is…',
        'I live in…',
        'I have worked in…',
        'I have … years of experience.',
        'I would like to…',
        'I am preparing for…'
      ]
    },
    {
      id: 'oral2',
      title: 'Professional experience',
      target: '1 à 2 minutes',
      prompt: 'Describe one of your previous jobs. Explain your responsibilities and the contact you had with customers, passengers or colleagues.',
      help: [
        'Where did you work?',
        'What was your position?',
        'What were your main responsibilities?',
        'Did you use English?',
        'What did you enjoy about the job?'
      ]
    },
    {
      id: 'oral3',
      title: 'Passenger situation',
      target: '1 minute environ',
      prompt: 'A passenger is worried because their flight is delayed. Welcome the passenger, explain the situation and offer a solution.',
      help: [
        'I understand your concern.',
        'Let me check the information.',
        'The flight has been delayed because…',
        'I can offer you…',
        'Thank you for your patience.'
      ]
    }
  ];

  const recorderState = new Map();

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2700);
  }

  function sanitizeFilename(value) {
    return value.replace(/[^a-z0-9_\-]/gi, '_').replace(/_+/g, '_');
  }

  function renderRatings() {
    const grid = document.getElementById('ratingGrid');
    grid.innerHTML = ratingItems.map(([name, label]) => `
      <div class="rating-row">
        <label for="${name}">${label}</label>
        <select id="${name}" name="${name}" data-track>
          <option value="">Sélectionner</option>
          ${ratingOptions.map(option => `<option>${option}</option>`).join('')}
        </select>
      </div>
    `).join('');
  }

  function renderPriorities() {
    const fieldset = document.getElementById('priorityChoices');
    fieldset.innerHTML = '<legend>Priorités de formation</legend>' + priorities.map((item, index) => `
      <label>
        <input type="checkbox" name="priorities" value="${item}" data-track />
        <span><strong>${String(index + 1).padStart(2, '0')}</strong><br>${item}</span>
      </label>
    `).join('');
  }

  function renderRecordingTasks() {
    const container = document.getElementById('recordingTasks');
    container.innerHTML = recordingTasks.map((task, index) => `
      <article class="recording-card" data-recorder="${task.id}">
        <div class="recording-card__top">
          <div class="task-title-row">
            <div>
              <span class="task-label">Oral task ${index + 1}</span>
              <h3>${task.title}</h3>
            </div>
            <span class="target-badge">${task.target}</span>
          </div>
          <p class="prompt-en">${task.prompt}</p>
        </div>
        <div class="recording-card__body">
          <details class="help-box">
            <summary>Afficher les idées et expressions utiles</summary>
            <ul>${task.help.map(item => `<li>${item}</li>`).join('')}</ul>
          </details>
          <div class="recording-controls">
            <button type="button" class="btn btn--record" data-action="start" data-id="${task.id}">● Commencer</button>
            <button type="button" class="btn btn--stop" data-action="stop" data-id="${task.id}" disabled>■ Arrêter</button>
            <button type="button" class="btn btn--ghost" data-action="reset" data-id="${task.id}" disabled>Recommencer</button>
            <button type="button" class="btn btn--accent" data-action="download" data-id="${task.id}" disabled>Télécharger</button>
            <span class="recording-status" id="status-${task.id}">Prêt à enregistrer</span>
          </div>
          <audio id="audio-${task.id}" controls hidden></audio>
          <p class="prompt-help">Nom conseillé du fichier : <code>Aminata_Toure_${task.id.toUpperCase()}</code></p>
        </div>
      </article>
    `).join('');
  }

  function getSupportedMimeType() {
    if (!window.MediaRecorder) return '';
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
    return candidates.find(type => MediaRecorder.isTypeSupported(type)) || '';
  }

  function extensionForMime(mime) {
    if (mime.includes('mp4')) return 'm4a';
    if (mime.includes('ogg')) return 'ogg';
    return 'webm';
  }

  async function startRecording(id) {
    const card = document.querySelector(`[data-recorder="${id}"]`);
    const startBtn = card.querySelector('[data-action="start"]');
    const stopBtn = card.querySelector('[data-action="stop"]');
    const status = document.getElementById(`status-${id}`);
    const audio = document.getElementById(`audio-${id}`);

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      showToast('Votre navigateur ne permet pas l’enregistrement audio. Essayez avec Chrome, Edge ou Firefox.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;
      const recorder = new MediaRecorder(stream, options);
      const chunks = [];
      const startedAt = Date.now();
      let timer = null;

      recorder.addEventListener('dataavailable', event => {
        if (event.data.size > 0) chunks.push(event.data);
      });

      recorder.addEventListener('stop', () => {
        const actualMime = recorder.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(chunks, { type: actualMime });
        const url = URL.createObjectURL(blob);
        const previous = recorderState.get(id);
        if (previous?.url) URL.revokeObjectURL(previous.url);
        recorderState.set(id, { blob, url, mimeType: actualMime });
        audio.src = url;
        audio.hidden = false;
        card.querySelector('[data-action="reset"]').disabled = false;
        card.querySelector('[data-action="download"]').disabled = false;
        status.textContent = 'Enregistrement prêt';
        status.classList.remove('is-recording');
        clearInterval(timer);
        stream.getTracks().forEach(track => track.stop());
        updateProgress();
      });

      recorder.start();
      recorderState.set(id, { recorder, stream, startedAt });
      startBtn.disabled = true;
      stopBtn.disabled = false;
      status.classList.add('is-recording');
      status.textContent = 'Enregistrement : 00:00';
      timer = setInterval(() => {
        const seconds = Math.floor((Date.now() - startedAt) / 1000);
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
        const ss = String(seconds % 60).padStart(2, '0');
        status.textContent = `Enregistrement : ${mm}:${ss}`;
      }, 500);
      recorderState.set(id, { recorder, stream, startedAt, timer });
    } catch (error) {
      console.error(error);
      showToast('Le microphone n’a pas pu être utilisé. Vérifiez l’autorisation du navigateur.');
    }
  }

  function stopRecording(id) {
    const state = recorderState.get(id);
    if (!state?.recorder || state.recorder.state === 'inactive') return;
    state.recorder.stop();
    const card = document.querySelector(`[data-recorder="${id}"]`);
    card.querySelector('[data-action="start"]').disabled = false;
    card.querySelector('[data-action="stop"]').disabled = true;
  }

  function resetRecording(id) {
    const state = recorderState.get(id);
    if (state?.url) URL.revokeObjectURL(state.url);
    recorderState.delete(id);
    const card = document.querySelector(`[data-recorder="${id}"]`);
    const audio = document.getElementById(`audio-${id}`);
    audio.pause();
    audio.removeAttribute('src');
    audio.hidden = true;
    card.querySelector('[data-action="reset"]').disabled = true;
    card.querySelector('[data-action="download"]').disabled = true;
    document.getElementById(`status-${id}`).textContent = 'Prêt à enregistrer';
    updateProgress();
  }

  function downloadRecording(id) {
    const state = recorderState.get(id);
    if (!state?.blob) return;
    const extension = extensionForMime(state.mimeType || 'audio/webm');
    downloadBlob(state.blob, `Aminata_Toure_${id.toUpperCase()}.${extension}`);
    showToast('Enregistrement téléchargé. Pensez à le joindre à votre e-mail.');
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function getFieldValue(name) {
    const elements = form.elements[name];
    if (!elements) return '';
    if (elements instanceof RadioNodeList) {
      const type = elements[0]?.type;
      if (type === 'checkbox') return [...elements].filter(el => el.checked).map(el => el.value).join(', ');
      return elements.value || '';
    }
    if (elements.type === 'checkbox') return elements.checked ? 'Oui' : 'Non';
    return elements.value?.trim?.() || '';
  }

  function escapeLine(value) {
    return value || 'Non renseigné';
  }

  function buildSummary() {
    const ratingLines = ratingItems.map(([name, label]) => `- ${label} : ${escapeLine(getFieldValue(name))}`).join('\n');
    const recordingLines = recordingTasks.map(task => `- ${task.title} : ${recorderState.get(task.id)?.blob ? 'enregistré sur cet appareil' : 'non enregistré'}`).join('\n');

    return `ANALYSE DES BESOINS — AMINATA TOURÉ\nPréparation à l’anglais professionnel du personnel navigant et au LILATE\n\n1. INFORMATIONS GÉNÉRALES\nNom : ${escapeLine(getFieldValue('fullName'))}\nE-mail : ${escapeLine(getFieldValue('email'))}\nTéléphone : ${escapeLine(getFieldValue('phone'))}\nDate de réalisation : ${escapeLine(getFieldValue('completionDate'))}\n\n2. PARCOURS PROFESSIONNEL\nExpérience et postes occupés :\n${escapeLine(getFieldValue('careerHistory'))}\n\nResponsabilités principales :\n${escapeLine(getFieldValue('responsibilities'))}\n\nEnvironnement international : ${escapeLine(getFieldValue('internationalEnvironment'))}\nFréquence d’utilisation de l’anglais : ${escapeLine(getFieldValue('englishFrequency'))}\nSituations d’utilisation de l’anglais : ${escapeLine(getFieldValue('englishSituations'))}\n\n3. PROJET PROFESSIONNEL\nPoste visé : ${escapeLine(getFieldValue('targetRole'))}\nÉtat de la candidature : ${escapeLine(getFieldValue('applicationStatus'))}\nNiveau ou résultat demandé : ${escapeLine(getFieldValue('requiredLevel'))}\nÉchéance : ${escapeLine(getFieldValue('deadline'))}\nMotivation :\n${escapeLine(getFieldValue('projectMotivation'))}\n\n4. AUTOÉVALUATION\n${ratingLines}\n\nDifficultés principales :\n${escapeLine(getFieldValue('mainDifficulties'))}\n\n5. PRIORITÉS DE FORMATION\n${escapeLine(getFieldValue('priorities'))}\nAutre priorité : ${escapeLine(getFieldValue('otherPriority'))}\n\n6. ORGANISATION ET MATÉRIEL\nDate de début souhaitée : ${escapeLine(getFieldValue('desiredStart'))}\nDurée de séance préférée : ${escapeLine(getFieldValue('sessionLength'))}\nDisponibilités :\n${escapeLine(getFieldValue('availability'))}\nContraintes :\n${escapeLine(getFieldValue('constraints'))}\nMatériel : ${escapeLine(getFieldValue('equipment'))}\nAccompagnement souhaité : ${escapeLine(getFieldValue('support'))}\nSituation de handicap : ${escapeLine(getFieldValue('disability'))}\nAménagement nécessaire : ${escapeLine(getFieldValue('accommodation'))}\n\n7. CERTIFICATION LILATE\nConnaissance du LILATE : ${escapeLine(getFieldValue('lilateKnowledge'))}\nCertification déjà passée : ${escapeLine(getFieldValue('previousCertification'))}\nPréoccupations :\n${escapeLine(getFieldValue('examConcerns'))}\nEngagement à se présenter à la certification : ${getFieldValue('certificationCommitment')}\n\n8. DIAGNOSTIC ORAL\n${recordingLines}\n\n9. DIAGNOSTIC ÉCRIT\n\nWriting task 1 — Professional introduction\n${escapeLine(getFieldValue('writing1'))}\n\nWriting task 2 — Professional email\n${escapeLine(getFieldValue('writing2'))}\n\n10. COMMENTAIRE SUPPLÉMENTAIRE\n${escapeLine(getFieldValue('additionalComment'))}\n\nIMPORTANT : les fichiers audio doivent être joints manuellement à l’e-mail.\n`;
  }

  function generateSummary() {
    const summary = buildSummary();
    summaryPreview.value = summary;
    summaryPreviewWrap.hidden = false;
    copySummaryBtn.disabled = false;
    downloadSummaryBtn.disabled = false;
    prepareEmailBtn.disabled = false;
    emailReminder.hidden = false;
    summaryPreviewWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Votre synthèse a été générée.');
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const temp = document.createElement('textarea');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      const ok = document.execCommand('copy');
      temp.remove();
      return ok;
    }
  }

  function serializeForm() {
    const data = {};
    [...form.elements].forEach(element => {
      if (!element.name) return;
      if (element.type === 'radio') {
        if (element.checked) data[element.name] = element.value;
      } else if (element.type === 'checkbox') {
        if (!Array.isArray(data[element.name])) data[element.name] = [];
        if (element.checked) data[element.name].push(element.value || 'Oui');
      } else {
        data[element.name] = element.value;
      }
    });
    return data;
  }

  function restoreForm() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      [...form.elements].forEach(element => {
        if (!element.name || !(element.name in data)) return;
        const value = data[element.name];
        if (element.type === 'radio') element.checked = value === element.value;
        else if (element.type === 'checkbox') element.checked = Array.isArray(value) && value.includes(element.value || 'Oui');
        else element.value = value;
      });
    } catch (error) {
      console.warn('Sauvegarde locale illisible', error);
    }
  }

  function saveForm() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeForm()));
    updateProgress();
    updateWordCounts();
  }

  function updateWordCounts() {
    document.querySelectorAll('[data-counter-for]').forEach(counter => {
      const target = document.getElementById(counter.dataset.counterFor);
      const count = target.value.trim() ? target.value.trim().split(/\s+/).length : 0;
      counter.textContent = `${count} word${count === 1 ? '' : 's'}`;
    });
  }

  function updateProgress() {
    const tracked = [...document.querySelectorAll('[data-track]')];
    const meaningful = tracked.filter(el => {
      if (el.type === 'checkbox' || el.type === 'radio') return el.checked;
      return String(el.value || '').trim().length > 0;
    });
    const audioCount = recordingTasks.filter(task => recorderState.get(task.id)?.blob).length;
    const base = Math.min(82, Math.round((meaningful.length / Math.max(tracked.length * 0.56, 1)) * 82));
    const audioBonus = Math.round((audioCount / recordingTasks.length) * 18);
    const progress = Math.min(100, base + audioBonus);
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress} %`;
    progressMessage.textContent = progress < 25
      ? 'Commencez par confirmer vos informations et votre parcours.'
      : progress < 55
        ? 'Votre analyse prend forme. Continuez avec vos priorités et disponibilités.'
        : progress < 82
          ? 'Très bien. Pensez maintenant aux activités orales et écrites.'
          : progress < 100
            ? 'Presque terminé : vérifiez vos réponses et préparez votre envoi.'
            : 'Analyse complétée. Vous pouvez générer et envoyer votre synthèse.';
  }

  function setDefaultDate() {
    const dateField = form.elements.completionDate;
    if (!dateField.value) {
      const now = new Date();
      const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      dateField.value = localDate;
    }
  }

  function resetAll() {
    if (!confirm('Voulez-vous vraiment effacer toutes les réponses enregistrées sur cet appareil ?')) return;
    localStorage.removeItem(STORAGE_KEY);
    recordingTasks.forEach(task => resetRecording(task.id));
    form.reset();
    form.elements.fullName.value = 'Aminata Touré';
    form.elements.email.value = 'aminata.aisse.toure22@gmail.com';
    form.elements.requiredLevel.value = 'Objectif B2';
    form.elements.desiredStart.value = '2026-07-27';
    setDefaultDate();
    summaryPreview.value = '';
    summaryPreviewWrap.hidden = true;
    copySummaryBtn.disabled = true;
    downloadSummaryBtn.disabled = true;
    prepareEmailBtn.disabled = true;
    emailReminder.hidden = true;
    saveForm();
    showToast('Toutes les réponses ont été réinitialisées.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderRatings();
  renderPriorities();
  renderRecordingTasks();
  restoreForm();
  setDefaultDate();
  updateWordCounts();
  updateProgress();

  form.addEventListener('input', saveForm);
  form.addEventListener('change', saveForm);

  document.addEventListener('click', async event => {
    const recorderButton = event.target.closest('[data-action]');
    if (recorderButton) {
      const { action, id } = recorderButton.dataset;
      if (action === 'start') startRecording(id);
      if (action === 'stop') stopRecording(id);
      if (action === 'reset') resetRecording(id);
      if (action === 'download') downloadRecording(id);
      return;
    }

    const copyButton = event.target.closest('[data-copy]');
    if (copyButton) {
      const target = document.getElementById(copyButton.dataset.copy);
      if (!target.value.trim()) return showToast('Il n’y a pas encore de texte à copier.');
      const success = await copyText(target.value);
      showToast(success ? 'Texte copié.' : 'Impossible de copier automatiquement.');
      return;
    }

    const downloadTextButton = event.target.closest('[data-download-text]');
    if (downloadTextButton) {
      const target = document.getElementById(downloadTextButton.dataset.downloadText);
      if (!target.value.trim()) return showToast('Il n’y a pas encore de texte à télécharger.');
      downloadBlob(new Blob([target.value], { type: 'text/plain;charset=utf-8' }), downloadTextButton.dataset.filename);
      showToast('Texte téléchargé.');
      return;
    }

    const clearButton = event.target.closest('[data-clear]');
    if (clearButton) {
      const target = document.getElementById(clearButton.dataset.clear);
      if (target.value && confirm('Effacer ce texte ?')) {
        target.value = '';
        saveForm();
      }
    }
  });

  document.getElementById('generateSummary').addEventListener('click', generateSummary);

  copySummaryBtn.addEventListener('click', async () => {
    const success = await copyText(summaryPreview.value || buildSummary());
    showToast(success ? 'Synthèse copiée.' : 'Impossible de copier automatiquement.');
  });

  downloadSummaryBtn.addEventListener('click', () => {
    const name = sanitizeFilename(getFieldValue('fullName') || 'Aminata_Toure');
    downloadBlob(new Blob([summaryPreview.value || buildSummary()], { type: 'text/plain;charset=utf-8' }), `${name}_Analyse_des_besoins.txt`);
    showToast('Synthèse téléchargée.');
  });

  prepareEmailBtn.addEventListener('click', () => {
    if (!document.getElementById('dataConsent').checked) {
      showToast('Merci de confirmer la notice de transmission avant de préparer l’e-mail.');
      document.getElementById('dataConsent').focus();
      return;
    }
    const recipient = document.getElementById('trainerEmail').value.trim();
    const subject = 'Analyse des besoins et diagnostic initial LILATE — Aminata Touré';
    const intro = 'Bonjour,\n\nVeuillez trouver ci-dessous ma synthèse d’analyse des besoins. Je joins également mes enregistrements audio à ce message.\n\n';
    const body = `${intro}${summaryPreview.value || buildSummary()}\nBien cordialement,\nAminata Touré`;
    const mailto = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    emailReminder.hidden = false;
    window.location.href = mailto;
  });

  document.getElementById('resetAll').addEventListener('click', resetAll);
})();
