(() => {
  const form = document.getElementById('needsForm');
  const generateBtn = document.getElementById('generateBtn');
  const summaryPanel = document.getElementById('summaryPanel');
  const summaryOutput = document.getElementById('summaryOutput');
  const summaryStatus = document.getElementById('summaryStatus');
  const summaryNotice = document.getElementById('summaryNotice');
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const emailBtn = document.getElementById('emailBtn');
  const resetBtn = document.getElementById('resetBtn');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const toast = document.getElementById('toast');
  const storageKey = 'olivier-peliks-needs-questionnaire-v1';

  function showToast(message){
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function serializeForm(){
    const data = {};
    [...form.elements].forEach(el => {
      if (!el.name) return;
      if (el.type === 'checkbox') {
        if (!Array.isArray(data[el.name])) data[el.name] = [];
        if (el.checked) data[el.name].push(el.value || 'Oui');
      } else if (el.type === 'radio') {
        if (el.checked) data[el.name] = el.value;
      } else {
        data[el.name] = el.value;
      }
    });
    return data;
  }

  function save(){
    try {
      localStorage.setItem(storageKey, JSON.stringify(serializeForm()));
    } catch(e) {}
    updateProgress();
  }

  function restore(){
    let saved;
    try { saved = JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch(e) { saved = null; }
    if (!saved) return;
    [...form.elements].forEach(el => {
      if (!el.name || saved[el.name] === undefined) return;
      if (el.type === 'checkbox') {
        const values = Array.isArray(saved[el.name]) ? saved[el.name] : [];
        el.checked = values.includes(el.value || 'Oui');
      } else if (el.type === 'radio') {
        el.checked = saved[el.name] === el.value;
      } else {
        el.value = saved[el.name] ?? '';
      }
    });
  }

  function updateProgress(){
    const sections = [...document.querySelectorAll('.form-section')];
    let completed = 0;
    sections.forEach(section => {
      const fields = [...section.querySelectorAll('input:not([type="checkbox"]), select, textarea')]
        .filter(el => el.name && el.type !== 'hidden');
      const checks = [...section.querySelectorAll('input[type="checkbox"]')].filter(el => el.name);
      const hasText = fields.some(el => String(el.value || '').trim().length > 0);
      const hasCheck = checks.some(el => el.checked);
      if (hasText || hasCheck) completed++;
    });
    const pct = Math.round((completed / sections.length) * 100);
    progressFill.style.width = `${pct}%`;
    progressText.textContent = `${pct} %`;
  }

  function val(data, key, fallback='Non renseigné'){
    const v = data[key];
    if (Array.isArray(v)) return v.length ? v.join(' ; ') : fallback;
    return String(v || '').trim() || fallback;
  }

  function bullets(value){
    const arr = Array.isArray(value) ? value : [];
    return arr.length ? arr.map(x => `• ${x}`).join('\n') : '• Non renseigné';
  }

  function skillLabel(v){
    if (!v) return 'Non renseigné';
    const map = {
      '1/5 - Très difficile':'1/5 - Très difficile',
      '2/5 - Difficile':'2/5 - Difficile',
      '3/5 - Je me débrouille':'3/5 - Je me débrouille',
      '4/5 - Assez à l’aise':'4/5 - Assez à l’aise',
      '5/5 - Très à l’aise':'5/5 - Très à l’aise'
    };
    return map[v] || v;
  }

  function buildSummary(){
    const d = serializeForm();
    const lines = [
      'QUESTIONNAIRE PRÉPARATOIRE — ANALYSE DES BESOINS',
      'PELIKS Olivier — Anglais appliqué aux métiers de la santé',
      'Formation : 17 h · 31/08/2026 au 26/02/2027',
      `Certification préparée : ${val(d,'exam','CLOE · Compétences Linguistiques Orales et Écrites — Anglais')}`,
      '',
      '1. PROFIL PROFESSIONNEL',
      `Nom : ${val(d,'fullName')}`,
      `E-mail : ${val(d,'email')}`,
      `Fonction : ${val(d,'jobTitle')}`,
      `Spécialité / domaine : ${val(d,'specialty')}`,
      `Structure : ${val(d,'workplace')}`,
      `Expérience : ${val(d,'experience')}`,
      `Responsabilités principales : ${val(d,'responsibilities')}`,
      `Fréquence d’utilisation de l’anglais : ${val(d,'englishAtWork')}`,
      '',
      '2. SITUATIONS OÙ L’ANGLAIS EST UTILE',
      bullets(d.uses),
      `Autre situation : ${val(d,'otherUse')}`,
      '',
      '3. THÉMATIQUES SANTÉ À TRAVAILLER',
      bullets(d.healthTopics),
      `Besoins métier spécifiques : ${val(d,'specificHealthNeeds')}`,
      '',
      '4. AUTOÉVALUATION',
      `Compréhension orale : ${skillLabel(d.skillListening)}`,
      `Expression orale : ${skillLabel(d.skillSpeaking)}`,
      `Lecture : ${skillLabel(d.skillReading)}`,
      `Expression écrite : ${skillLabel(d.skillWriting)}`,
      `Vocabulaire professionnel / santé : ${skillLabel(d.skillVocab)}`,
      `Confiance à l’oral : ${skillLabel(d.skillConfidence)}`,
      '',
      '5. DIFFICULTÉS PRIORITAIRES',
      bullets(d.difficulties),
      `Autre difficulté : ${val(d,'otherDifficulty')}`,
      '',
      '6. OBJECTIFS ET CERTIFICATION',
      `Certification / examen préparé : ${val(d,'exam','CLOE · Compétences Linguistiques Orales et Écrites — Anglais')}`,
      `Objectif n°1 : ${val(d,'mainGoal')}`,
      `Résultat attendu en fin de formation : ${val(d,'successOutcome')}`,
      `Échéance / événement à préparer : ${val(d,'deadline')}`,
      '',
      '7. PRÉFÉRENCES D’APPRENTISSAGE',
      bullets(d.learning),
      `Temps de travail personnel : ${val(d,'homeworkTime')}`,
      `Formation récente : ${val(d,'recentTraining')}`,
      `Remarques sur l’apprentissage : ${val(d,'learningNotes')}`,
      '',
      '8. MINI-ÉCHANTILLON EN ANGLAIS',
      val(d,'englishSample'),
      '',
      '9. ORGANISATION PRATIQUE',
      `Disponibilités pour l’appel cette semaine : ${val(d,'callDays')}`,
      `Créneaux proposés : ${val(d,'callTimes')}`,
      `Disponibilités habituelles pour les cours : ${val(d,'lessonAvailability')}`,
      'Matériel disponible :',
      bullets(d.equipment),
      `Adaptation pédagogique / technique souhaitée : ${val(d,'accessibility')}`,
      '',
      '10. INFORMATION COMPLÉMENTAIRE',
      val(d,'finalNote'),
      '',
      '— Fin du questionnaire —'
    ];
    return lines.join('\n');
  }

  function getMissingRequirements(){
    const missing = [];
    const required = [...form.querySelectorAll('[required]')];

    required.forEach(el => {
      const isMissing = el.type === 'checkbox' ? !el.checked : !String(el.value || '').trim();
      if (!isMissing) return;

      const field = el.closest('.field, .confirm-line');
      const label = field?.querySelector('span, legend')?.textContent?.replace('*','').trim();
      missing.push(label || el.name || 'Champ obligatoire');
    });

    const callDayChecked = [...form.querySelectorAll('input[name="callDays"]')].some(x => x.checked);
    if (!callDayChecked) missing.push('Disponibilités pour l’échange téléphonique');

    return [...new Set(missing)];
  }

  generateBtn.addEventListener('click', () => {
    const missing = getMissingRequirements();
    summaryOutput.value = buildSummary();
    summaryPanel.hidden = false;

    if (missing.length) {
      summaryStatus.textContent = 'À compléter';
      summaryStatus.classList.add('warning');
      summaryNotice.hidden = false;
      summaryNotice.innerHTML = `<strong>Synthèse générée.</strong> Il reste ${missing.length} élément${missing.length > 1 ? 's' : ''} obligatoire${missing.length > 1 ? 's' : ''} à compléter. Les éléments non remplis apparaissent comme « Non renseigné » dans la synthèse.`;
      showToast('Synthèse générée — quelques champs restent à compléter.');
    } else {
      summaryStatus.textContent = 'Complète';
      summaryStatus.classList.remove('warning');
      summaryNotice.hidden = true;
      summaryNotice.textContent = '';
      showToast('Synthèse générée.');
    }

    try {
      summaryPanel.scrollIntoView({behavior:'smooth', block:'start'});
    } catch(e) {
      summaryPanel.scrollIntoView();
    }
  });

  copyBtn.addEventListener('click', async () => {
    if (!summaryOutput.value) summaryOutput.value = buildSummary();
    try {
      await navigator.clipboard.writeText(summaryOutput.value);
      showToast('Synthèse copiée !');
    } catch(e) {
      summaryOutput.select();
      document.execCommand('copy');
      showToast('Synthèse copiée !');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!summaryOutput.value) summaryOutput.value = buildSummary();
    const blob = new Blob([summaryOutput.value], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Questionnaire-Olivier-Peliks-Analyse-Besoins.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Fichier préparé.');
  });

  emailBtn.addEventListener('click', () => {
    if (!summaryOutput.value) summaryOutput.value = buildSummary();
    const subject = encodeURIComponent('Questionnaire préparatoire – Olivier Peliks');
    const intro = 'Bonjour,\n\nVoici mes réponses au questionnaire préparatoire avant notre échange téléphonique.\n\n';
    const closing = '\n\nBien cordialement,\nOlivier Peliks';
    const body = encodeURIComponent(intro + summaryOutput.value + closing);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  });

  resetBtn.addEventListener('click', () => {
    const ok = window.confirm('Voulez-vous vraiment effacer toutes les réponses enregistrées sur cet appareil ?');
    if (!ok) return;
    localStorage.removeItem(storageKey);
    form.reset();
    const nameField = form.querySelector('[name="fullName"]');
    if (nameField) nameField.value = 'Olivier Peliks';
    summaryPanel.hidden = true;
    summaryOutput.value = '';
    summaryStatus.textContent = 'Prête';
    summaryStatus.classList.remove('warning');
    summaryNotice.hidden = true;
    summaryNotice.textContent = '';
    updateProgress();
    window.scrollTo({top:0,behavior:'smooth'});
    showToast('Réponses effacées.');
  });

  form.addEventListener('input', save);
  form.addEventListener('change', save);

  restore();
  updateProgress();
})();