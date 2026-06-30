(() => {
  'use strict';

  const storageKey = 'speakeasy-sylvain-first-lesson-v4';
  const languageToggle = document.getElementById('languageToggle');
  const saveButton = document.getElementById('saveButton');
  const copyButton = document.getElementById('copyButton');
  const downloadButton = document.getElementById('downloadButton');
  const resetButton = document.getElementById('resetButton');
  const buildButton = document.getElementById('buildParagraphs');
  const saveStatus = document.getElementById('saveStatus');
  const builderStatus = document.getElementById('builderStatus');

  const q = (selector) => document.querySelector(selector);
  const qa = (selector) => [...document.querySelectorAll(selector)];
  const multiFields = ['goals', 'interests', 'learningStyle', 'musicPreferences', 'foodPreferences', 'filmPreferences'];

  function getChecked(name) {
    return qa(`input[name="${name}"]:checked`).map((input) => input.value);
  }

  function getValue(id) {
    return (q(`#${id}`)?.value || '').trim();
  }

  function setStatus(message, target = saveStatus) {
    if (target) target.textContent = message;
  }

  function tidySentence(text) {
    const value = (text || '').trim();
    if (!value) return '';
    const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
    return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
  }

  function withoutEnd(text) {
    return (text || '').trim().replace(/[.!?]+$/, '');
  }

  function sentenceList(items) {
    const clean = items.filter(Boolean);
    if (!clean.length) return '';
    if (clean.length === 1) return clean[0];
    if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
    return `${clean.slice(0, -1).join(', ')}, and ${clean.at(-1)}`;
  }

  function articleFor(phrase) {
    const value = (phrase || '').trim();
    if (!value) return '';
    if (/^(a |an |the )/i.test(value)) return value;
    if (/^(honest|hour|heir)/i.test(value)) return `an ${value}`;
    if (/^(uni([^nmd]|$)|use|user|European|one\b)/i.test(value)) return `a ${value}`;
    if (/^(MBA|FBI|HR|IT\b)/i.test(value)) return `an ${value}`;
    return /^[aeiou]/i.test(value) ? `an ${value}` : `a ${value}`;
  }

  function fullSentenceOnly(value) {
    const text = (value || '').trim();
    return /^(I|My|In my|One of)/i.test(text) ? tidySentence(text) : '';
  }

  function fieldNames() {
    return qa('input[name], textarea[name], select[name]').map((el) => el.name);
  }

  function collectData() {
    const fields = {};
    [...new Set(fieldNames())].forEach((name) => {
      const elements = qa(`[name="${name}"]`);
      if (!elements.length || multiFields.includes(name)) return;
      fields[name] = elements[0].value || '';
    });
    return {
      goals: getChecked('goals'),
      interests: getChecked('interests'),
      learningStyle: getChecked('learningStyle'),
      musicPreferences: getChecked('musicPreferences'),
      foodPreferences: getChecked('foodPreferences'),
      filmPreferences: getChecked('filmPreferences'),
      fields,
      paragraphs: {
        a2: getValue('paragraphA2'),
        a2plus: getValue('paragraphA2Plus'),
        b1: getValue('paragraphB1')
      },
      frenchHelp: document.body.classList.contains('show-french'),
      savedAt: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    };
  }

  function saveData(showMessage = false) {
    const data = collectData();
    localStorage.setItem(storageKey, JSON.stringify(data));
    if (showMessage) setStatus('Your answers have been saved on this device.');
    return data;
  }

  function updateSelectedStates() {
    qa('.goal-card').forEach((card) => card.classList.toggle('selected', card.querySelector('input')?.checked));
  }

  function restoreData() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) { updateSelectedStates(); return; }
    try {
      const data = JSON.parse(raw);
      multiFields.forEach((name) => {
        const selected = new Set(data[name] || []);
        qa(`input[name="${name}"]`).forEach((input) => { input.checked = selected.has(input.value); });
      });
      Object.entries(data.fields || {}).forEach(([name, value]) => {
        const element = q(`[name="${name}"]`);
        if (element) element.value = value || '';
      });
      q('#paragraphA2').value = data.paragraphs?.a2 || '';
      q('#paragraphA2Plus').value = data.paragraphs?.a2plus || '';
      q('#paragraphB1').value = data.paragraphs?.b1 || '';
      document.body.classList.toggle('show-french', Boolean(data.frenchHelp));
      languageToggle.setAttribute('aria-pressed', String(Boolean(data.frenchHelp)));
      updateSelectedStates();
      setStatus('Your saved answers are ready to continue.');
    } catch (error) {
      localStorage.removeItem(storageKey);
      updateSelectedStates();
    }
  }

  function makeFamilySentences() {
    const relationship = getValue('relationshipStatus');
    const children = getValue('childrenCount');
    const household = getValue('household');
    const short = [];
    const high = [];
    if (relationship && relationship !== 'I prefer not to say.') short.push(tidySentence(relationship));
    if (children && children !== 'I prefer not to say.') short.push(tidySentence(children));
    if (household) short.push(tidySentence(household));

    const relationshipClause = relationship && relationship !== 'I prefer not to say.' ? withoutEnd(relationship) : '';
    const childrenClause = children && children !== 'I prefer not to say.' ? withoutEnd(children) : '';
    const householdClause = household ? withoutEnd(household) : '';

    if (relationshipClause || childrenClause) {
      high.push([relationshipClause, childrenClause].filter(Boolean).join(' and ').replace(/^I /, 'At home, I ' ) + '.');
    }
    if (householdClause) {
      const householdDetail = householdClause.replace(/^I live /, 'I live ');
      if (!/I live with my family\.?/i.test(householdDetail) || !/family/i.test(`${relationshipClause} ${childrenClause}`)) {
        high.push(`At home, ${householdDetail.charAt(0).toLowerCase()}${householdDetail.slice(1)}.`.replace('At home, i ', 'At home, I '));
      }
    }
    return { short, high };
  }

  function buildWork() {
    const status = getValue('workStatus');
    const job = getValue('jobTitle');
    const sector = getValue('workSector');
    const short = [];
    if (status) short.push(tidySentence(status));
    if (job) short.push(/^(I |My )/i.test(job) ? tidySentence(job) : `I work as ${articleFor(job)}.`);
    if (sector && sector !== 'My work is in another sector.') short.push(tidySentence(sector));

    const jobPhrase = job ? (/^(I |My )/i.test(job) ? withoutEnd(job) : `work as ${articleFor(job)}`) : '';
    const sectorMap = {
      'I work in the food industry.': 'in the food industry',
      'I work in aeronautics.': 'in aeronautics',
      'I work in hospitality.': 'in hospitality',
      'I work with customers.': 'with customers',
      'I work from home.': 'from home'
    };
    const sectorPhrase = sectorMap[sector] || '';
    let high = '';

    if (status === 'I am self-employed.') {
      high = `Professionally, I am self-employed${jobPhrase ? ` and ${jobPhrase}` : ''}${sectorPhrase ? ` ${sectorPhrase}` : ''}.`;
    } else if (status === 'I run my own business.') {
      high = `Professionally, I run my own business${jobPhrase ? ` and ${jobPhrase}` : ''}${sectorPhrase ? ` ${sectorPhrase}` : ''}.`;
    } else if (status === 'I work for a company.') {
      high = `Professionally, I work for a company${jobPhrase ? ` and ${jobPhrase}` : ''}${sectorPhrase ? ` ${sectorPhrase}` : ''}.`;
    } else if (status === 'I am currently looking for work.') {
      high = `Professionally, I am currently looking for work${job ? ` in a role such as ${articleFor(job)}` : ''}.`;
    } else if (status === 'I am retired.') {
      high = 'Professionally, I am retired.';
    } else if (jobPhrase) {
      high = `Professionally, I ${jobPhrase}${sectorPhrase ? ` ${sectorPhrase}` : ''}.`;
    } else if (sectorPhrase) {
      high = `Professionally, I work ${sectorPhrase}.`;
    }

    high = high.replace(/work as (a |an )?([^.]*) in /, 'work as $1$2 in ')
      .replace(/I work for a company and work as /, 'I work for a company as ')
      .replace(/I run my own business and work as /, 'I run my own business as ');

    return { short, high };
  }

  function buildPreferences() {
    const interests = getChecked('interests');
    const likesSentence = fullSentenceOnly(getValue('likesSentence'));
    const dislike = getValue('dislikeChoice');
    const music = getChecked('musicPreferences');
    const reading = getValue('readingChoice');
    const food = getChecked('foodPreferences');
    const films = getChecked('filmPreferences');

    const short = [];
    if (interests.length) short.push(`In my free time, I enjoy ${sentenceList(interests)}.`);
    if (likesSentence) short.push(likesSentence);
    if (music.length) short.push(`I like ${sentenceList(music)} music.`);
    if (reading) short.push(tidySentence(reading));
    if (food.length) short.push(`I like ${sentenceList(food)}.`);
    if (films.length) short.push(`I enjoy watching ${sentenceList(films)}.`);
    if (dislike) short.push(tidySentence(dislike));

    const high = [];
    if (interests.length) high.push(`Outside work, I particularly enjoy ${sentenceList(interests)}.`);
    if (likesSentence) high.push(`I also ${withoutEnd(likesSentence).replace(/^I\s+/i, '').replace(/^enjoy /i, 'enjoy ')}.`.replace('I also also ', 'I also '));
    if (music.length) high.push(`As for music, I mainly listen to ${sentenceList(music)}.`);
    if (reading) high.push(`When I have time, ${withoutEnd(reading).replace(/^I /, 'I ')}.`);
    if (food.length) high.push(`When it comes to food, I particularly enjoy ${sentenceList(food)}.`);
    if (films.length) high.push(`In the evening, I often watch ${sentenceList(films)}.`);
    if (dislike) high.push(`However, ${withoutEnd(dislike).replace(/^I /, 'I ').toLowerCase()}.`.replace('However, i ', 'However, I '));

    return { short, high };
  }

  function goalSentences() {
    const goals = getChecked('goals');
    const goalMap = {
      'Prepare for the VTEST': 'prepare for the VTEST',
      'Communicate more confidently in English': 'communicate more confidently in English',
      'Understand spoken English more easily': 'understand spoken English more easily',
      'Structure spoken answers more clearly': 'structure my spoken answers more clearly'
    };
    const mapped = goals.map((goal) => goalMap[goal] || goal.toLowerCase());
    const simple = mapped.length
      ? `I am taking this course because I want to ${sentenceList(mapped.slice(0, 2))}.`
      : 'I am taking this course to improve my English step by step.';
    const high = mapped.length
      ? `Overall, this course will help me ${sentenceList(mapped.slice(0, 3))}.`
      : 'Overall, this course will help me improve my English step by step.';
    return { simple, high };
  }

  function makeParagraphs() {
    const home = getValue('homeTown');
    const family = makeFamilySentences();
    const work = buildWork();
    const preferences = buildPreferences();
    const goals = goalSentences();
    const location = home ? `I live in ${home.replace(/^in\s+/i, '')}.` : '';

    const a2 = ['Hello, my name is Sylvain.'];
    if (location) a2.push(location);
    a2.push(...family.short.slice(0, 2));
    a2.push(...work.short.slice(0, 2));
    a2.push(...preferences.short.slice(0, 2));
    a2.push(goals.simple);

    const a2plus = ['Hello, my name is Sylvain.'];
    if (home) a2plus.push(`I live in ${home.replace(/^in\s+/i, '')}, and I am happy to talk a little about myself.`);
    a2plus.push(...family.high.slice(0, 2));
    if (work.high) a2plus.push(work.high);
    a2plus.push(...preferences.high.slice(0, 3));
    a2plus.push(`Finally, ${goals.simple}`);

    const b1 = ['Hello, my name is Sylvain.'];
    if (home) b1.push(`I live in ${home.replace(/^in\s+/i, '')}, which is where my daily life is based.`);
    b1.push(...family.high);
    if (work.high) b1.push(work.high);
    b1.push(...preferences.high);
    b1.push(goals.high);

    q('#paragraphA2').value = a2.filter(Boolean).join(' ');
    q('#paragraphA2Plus').value = a2plus.filter(Boolean).join(' ');
    q('#paragraphB1').value = b1.filter(Boolean).join(' ');
    saveData(false);
    setStatus('Your three introductions are ready. Notice how the higher levels use connectors and varied sentence openings.', builderStatus);
  }

  function formatList(items) {
    return items.length ? items.map((item) => `- ${item}`).join('\n') : '- Not selected yet';
  }

  function createSummary(data = collectData()) {
    const f = data.fields;
    return [
      'SYLVAIN BAILLY — FIRST ENGLISH LESSON PROFILE',
      'Personalised 19-hour English course · VTEST preparation',
      `Saved: ${data.savedAt}`,
      '',
      'COURSE OBJECTIVES', formatList(data.goals), '',
      'PLAN CONFIRMATION', f.planFit || 'Not answered yet', '',
      'MOST IMPORTANT TODAY', f.priorityNote || 'Not added yet', '',
      'ADDITIONAL GOAL', f.personalGoal || 'Not added yet', '',
      'ABOUT SYLVAIN',
      `Home: ${f.homeTown || 'Not added yet'}`,
      `Relationship: ${f.relationshipStatus || 'Not selected'}`,
      `Children: ${f.childrenCount || 'Not selected'}`,
      `Household: ${f.household || 'Not selected'}`,
      `Work situation: ${f.workStatus || 'Not selected'}`,
      `Job title / activity: ${f.jobTitle || 'Not added yet'}`,
      `Work sector: ${f.workSector || 'Not selected'}`,
      `Interests: ${(data.interests || []).join(', ') || 'Not selected yet'}`,
      `Other interest sentence: ${f.likesSentence || 'Not added yet'}`,
      `Dislike: ${f.dislikeChoice || 'Not selected'}`,
      `Music: ${(data.musicPreferences || []).join(', ') || 'Not selected yet'}`,
      `Reading: ${f.readingChoice || 'Not selected'}`,
      `Food: ${(data.foodPreferences || []).join(', ') || 'Not selected yet'}`,
      `Films / series: ${(data.filmPreferences || []).join(', ') || 'Not selected yet'}`,
      '',
      'LEARNING PREFERENCES', formatList(data.learningStyle), '',
      `French support: ${f.languageSupport || 'Not selected yet'}`,
      `Practice rhythm: ${f.practiceRhythm || 'Not selected yet'}`,
      '',
      'A2 INTRODUCTION', data.paragraphs.a2 || 'Not built yet', '',
      'A2+/B1 INTRODUCTION', data.paragraphs.a2plus || 'Not built yet', '',
      'B1 INTRODUCTION', data.paragraphs.b1 || 'Not built yet', '',
      'FINAL MESSAGE', f.finalMessage || 'Not added yet'
    ].join('\n');
  }

  async function copyText(text, message, target = saveStatus) {
    if (!text.trim()) { setStatus('There is no text to copy yet.', target); return; }
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const helper = document.createElement('textarea');
      helper.value = text;
      helper.readOnly = true;
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
    }
    setStatus(message, target);
  }

  function downloadSummary() {
    const content = createSummary(saveData(false));
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'Sylvain_BAILLY_First_Lesson_Profile.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(href);
    setStatus('Your profile has been downloaded as a text file.');
  }

  function speak(text) {
    const content = (text || '').trim();
    if (!content || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = 'en-GB';
    utterance.rate = 0.86;
    window.speechSynthesis.speak(utterance);
  }

  function clearData() {
    if (!window.confirm('Clear all saved answers on this device?')) return;
    localStorage.removeItem(storageKey);
    qa('textarea, input[type="text"], select').forEach((el) => { el.value = ''; });
    qa('input[type="checkbox"]').forEach((el) => { el.checked = false; });
    qa('input[name="goals"]').forEach((el) => { el.checked = true; });
    q('#paragraphA2').value = '';
    q('#paragraphA2Plus').value = '';
    q('#paragraphB1').value = '';
    updateSelectedStates();
    setStatus('Saved answers have been cleared.');
  }

  function setupEvents() {
    qa('input, textarea, select').forEach((element) => {
      element.addEventListener('change', () => { updateSelectedStates(); saveData(false); });
      if (element.tagName === 'TEXTAREA' || element.type === 'text') element.addEventListener('input', () => saveData(false));
    });
    languageToggle.addEventListener('click', () => {
      const active = document.body.classList.toggle('show-french');
      languageToggle.setAttribute('aria-pressed', String(active));
      saveData(false);
    });
    buildButton.addEventListener('click', makeParagraphs);
    saveButton.addEventListener('click', () => saveData(true));
    copyButton.addEventListener('click', () => copyText(createSummary(saveData(false)), 'Your lesson profile has been copied. You can paste it into an email.'));
    downloadButton.addEventListener('click', downloadSummary);
    resetButton.addEventListener('click', clearData);
    qa('.copy-paragraph').forEach((button) => button.addEventListener('click', () => copyText(getValue(button.dataset.target), 'Your introduction has been copied.', builderStatus)));
    qa('.speak-paragraph').forEach((button) => button.addEventListener('click', () => speak(getValue(button.dataset.target))));
    qa('.speak-button').forEach((button) => button.addEventListener('click', () => speak(button.dataset.say || '')));
  }

  function setupReveal() {
    const blocks = qa('.reveal');
    if (!('IntersectionObserver' in window)) { blocks.forEach((block) => block.classList.add('visible')); return; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    blocks.forEach((block) => observer.observe(block));
  }

  restoreData();
  setupEvents();
  setupReveal();
})();
