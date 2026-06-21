(() => {
  'use strict';

  const vocab = [
    { category: 'identity', icon: '👋', fr: 'Bonjour', en: 'Hello / good morning', exampleFr: 'Bonjour, je m’appelle David.', exampleEn: 'Hello, my name is David.' },
    { category: 'identity', icon: '🪪', fr: 'Je m’appelle…', en: 'My name is…', exampleFr: 'Je m’appelle David.', exampleEn: 'My name is David.' },
    { category: 'identity', icon: '🎂', fr: 'J’ai … ans', en: 'I am … years old', exampleFr: 'J’ai soixante et onze ans.', exampleEn: 'I am seventy-one years old.' },
    { category: 'identity', icon: '👨', fr: 'Je suis retraité', en: 'I am retired', exampleFr: 'Je suis retraité depuis peu.', exampleEn: 'I have only recently retired.' },
    { category: 'identity', icon: '🤝', fr: 'Ravi de vous rencontrer', en: 'Nice to meet you', exampleFr: 'Ravi de vous rencontrer.', exampleEn: 'Nice to meet you.' },
    { category: 'places', icon: '🗺️', fr: 'J’habite à…', en: 'I live in / at…', exampleFr: 'J’habite à Nantucket.', exampleEn: 'I live in Nantucket.' },
    { category: 'places', icon: '↔️', fr: 'entre… et…', en: 'between… and…', exampleFr: 'Je partage mon temps entre Nantucket et Cape Cod.', exampleEn: 'I split my time between Nantucket and Cape Cod.' },
    { category: 'places', icon: '🏠', fr: 'une maison', en: 'a house', exampleFr: 'J’ai une maison près de la mer.', exampleEn: 'I have a house near the sea.' },
    { category: 'places', icon: '🌊', fr: 'la mer', en: 'the sea', exampleFr: 'J’aime regarder la mer.', exampleEn: 'I like looking at the sea.' },
    { category: 'places', icon: '⚓', fr: 'le port', en: 'the harbour', exampleFr: 'Le port est très agréable.', exampleEn: 'The harbour is very pleasant.' },
    { category: 'places', icon: '🗼', fr: 'un phare', en: 'a lighthouse', exampleFr: 'Il y a un phare près de la côte.', exampleEn: 'There is a lighthouse near the coast.' },
    { category: 'places', icon: '🏖️', fr: 'la côte', en: 'the coast', exampleFr: 'La côte est magnifique au coucher du soleil.', exampleEn: 'The coast is magnificent at sunset.' },
    { category: 'life', icon: '👨‍👧', fr: 'une fille', en: 'a daughter', exampleFr: 'J’ai des filles merveilleuses.', exampleEn: 'I have wonderful daughters.' },
    { category: 'life', icon: '❤️', fr: 'la famille', en: 'family', exampleFr: 'Ma famille compte beaucoup pour moi.', exampleEn: 'My family means a lot to me.' },
    { category: 'life', icon: '🧡', fr: 'prendre soin de', en: 'to take care of', exampleFr: 'J’aime prendre soin des personnes que j’aime.', exampleEn: 'I like taking care of the people I love.' },
    { category: 'life', icon: '🤍', fr: 'être là pour quelqu’un', en: 'to be there for someone', exampleFr: 'J’ai toujours été là pour ma famille.', exampleEn: 'I have always been there for my family.' },
    { category: 'life', icon: '🌟', fr: 'être fier de', en: 'to be proud of', exampleFr: 'Je suis fier de ma famille.', exampleEn: 'I am proud of my family.' },
    { category: 'life', icon: '🫶', fr: 'Je t’aime très fort', en: 'I love you so much', exampleFr: 'Je t’aime très fort, ma chérie.', exampleEn: 'I love you so much, sweetheart.' },
    { category: 'life', icon: '☀️', fr: 'être heureux', en: 'to be happy', exampleFr: 'Je suis heureux près de la mer.', exampleEn: 'I am happy near the sea.' },
    { category: 'work', icon: '➗', fr: 'un professeur de mathématiques', en: 'a maths teacher', exampleFr: 'J’ai été professeur de mathématiques.', exampleEn: 'I was a maths teacher.' },
    { category: 'work', icon: '🏫', fr: 'enseigner', en: 'to teach', exampleFr: 'J’ai enseigné les mathématiques.', exampleEn: 'I taught maths.' },
    { category: 'work', icon: '🎓', fr: 'l’université', en: 'university', exampleFr: 'J’ai travaillé à l’université.', exampleEn: 'I worked at university.' },
    { category: 'work', icon: '🏙️', fr: 'l’assurance-vie', en: 'life insurance', exampleFr: 'J’ai travaillé dans l’assurance-vie.', exampleEn: 'I worked in life insurance.' },
    { category: 'work', icon: '💻', fr: 'un développeur de logiciels', en: 'a software developer', exampleFr: 'Je suis devenu développeur de logiciels.', exampleEn: 'I became a software developer.' },
    { category: 'work', icon: '⌨️', fr: 'programmer', en: 'to program', exampleFr: 'Je sais programmer en plusieurs langages.', exampleEn: 'I can program in several languages.' },
    { category: 'work', icon: '🧩', fr: 'créer une plateforme en ligne', en: 'to create an online platform', exampleFr: 'J’ai créé des plateformes en ligne.', exampleEn: 'I created online platforms.' },
    { category: 'work', icon: '🛠️', fr: 'résoudre un problème', en: 'to solve a problem', exampleFr: 'J’aime résoudre des problèmes complexes.', exampleEn: 'I like solving complex problems.' },
    { category: 'work', icon: '🧠', fr: 'apprendre seul', en: 'to teach oneself', exampleFr: 'J’ai appris à programmer seul.', exampleEn: 'I taught myself how to program.' },
    { category: 'work', icon: '🤝', fr: 'travailler avec des collègues', en: 'to work with colleagues', exampleFr: 'J’ai travaillé avec des collègues formidables.', exampleEn: 'I worked with wonderful colleagues.' },
    { category: 'work', icon: '📈', fr: 'une entreprise', en: 'a company / business', exampleFr: 'J’ai créé une entreprise avec mes collègues.', exampleEn: 'I created a company with my colleagues.' },
    { category: 'hobbies', icon: '🍳', fr: 'cuisiner', en: 'to cook', exampleFr: 'J’aime cuisiner pour ma famille.', exampleEn: 'I like cooking for my family.' },
    { category: 'hobbies', icon: '📖', fr: 'une recette', en: 'a recipe', exampleFr: 'J’essaie une nouvelle recette.', exampleEn: 'I am trying a new recipe.' },
    { category: 'hobbies', icon: '🪵', fr: 'travailler le bois', en: 'to do woodworking', exampleFr: 'J’aime travailler le bois dans mon atelier.', exampleEn: 'I like woodworking in my workshop.' },
    { category: 'hobbies', icon: '🔨', fr: 'fabriquer', en: 'to make / craft', exampleFr: 'Je fabrique quelque chose en bois.', exampleEn: 'I am making something out of wood.' },
    { category: 'hobbies', icon: '🏡', fr: 'rénover une maison', en: 'to renovate a house', exampleFr: 'Je sais rénover une maison.', exampleEn: 'I know how to renovate a house.' },
    { category: 'hobbies', icon: '🌱', fr: 'jardiner', en: 'to garden', exampleFr: 'J’aime jardiner au printemps.', exampleEn: 'I like gardening in spring.' },
    { category: 'hobbies', icon: '🥾', fr: 'faire de la randonnée', en: 'to go hiking', exampleFr: 'J’aime faire de la randonnée dans la nature.', exampleEn: 'I like hiking in nature.' },
    { category: 'hobbies', icon: '🚶', fr: 'faire une promenade', en: 'to go for a walk', exampleFr: 'Je vais faire une promenade près de la mer.', exampleEn: 'I am going for a walk near the sea.' },
    { category: 'hobbies', icon: '🎿', fr: 'faire du ski de fond', en: 'to cross-country ski', exampleFr: 'Quand j’étais jeune, je faisais du ski de fond.', exampleEn: 'When I was young, I used to cross-country ski.' },
    { category: 'hobbies', icon: '☕', fr: 'un chocolat chaud', en: 'a hot chocolate', exampleFr: 'Nous emportions du chocolat chaud.', exampleEn: 'We took hot chocolate with us.' },
    { category: 'hobbies', icon: '🧭', fr: 'découvrir', en: 'to discover', exampleFr: 'J’aime découvrir de nouvelles choses.', exampleEn: 'I like discovering new things.' },
    { category: 'qualities', icon: '✨', fr: 'brillant', en: 'brilliant', exampleFr: 'David est brillant.', exampleEn: 'David is brilliant.' },
    { category: 'qualities', icon: '💪', fr: 'travailleur', en: 'hard-working', exampleFr: 'Je suis très travailleur.', exampleEn: 'I am very hard-working.' },
    { category: 'qualities', icon: '🔍', fr: 'méticuleux', en: 'meticulous', exampleFr: 'Je suis méticuleux dans mon travail.', exampleEn: 'I am meticulous in my work.' },
    { category: 'qualities', icon: '🧰', fr: 'débrouillard', en: 'resourceful', exampleFr: 'Je suis très débrouillard.', exampleEn: 'I am very resourceful.' },
    { category: 'qualities', icon: '🎨', fr: 'créatif', en: 'creative', exampleFr: 'Je suis créatif et patient.', exampleEn: 'I am creative and patient.' },
    { category: 'qualities', icon: '🔭', fr: 'curieux', en: 'curious', exampleFr: 'Je suis curieux et j’aime apprendre.', exampleEn: 'I am curious and I like learning.' },
    { category: 'qualities', icon: '🧡', fr: 'généreux', en: 'generous', exampleFr: 'Je suis généreux avec mon temps.', exampleEn: 'I am generous with my time.' },
    { category: 'qualities', icon: '🪨', fr: 'fiable', en: 'reliable', exampleFr: 'Je suis quelqu’un de fiable.', exampleEn: 'I am a reliable person.' },
    { category: 'qualities', icon: '🌿', fr: 'patient', en: 'patient', exampleFr: 'Je suis patient et calme.', exampleEn: 'I am patient and calm.' },
    { category: 'qualities', icon: '🧭', fr: 'courageux', en: 'brave', exampleFr: 'Je suis courageux quand la vie est difficile.', exampleEn: 'I am brave when life is difficult.' },
    { category: 'qualities', icon: '🏆', fr: 'perfectionniste', en: 'a perfectionist', exampleFr: 'Je suis un peu perfectionniste.', exampleEn: 'I am a bit of a perfectionist.' },
    { category: 'nature', icon: '🌲', fr: 'la nature', en: 'nature', exampleFr: 'Je me sens bien dans la nature.', exampleEn: 'I feel good in nature.' },
    { category: 'nature', icon: '🌳', fr: 'la forêt', en: 'the forest', exampleFr: 'Nous partions dans la forêt.', exampleEn: 'We would head off into the forest.' },
    { category: 'nature', icon: '🐚', fr: 'la plage', en: 'the beach', exampleFr: 'La plage est magnifique le matin.', exampleEn: 'The beach is beautiful in the morning.' },
    { category: 'nature', icon: '🌅', fr: 'le coucher du soleil', en: 'the sunset', exampleFr: 'J’aime le coucher du soleil sur la mer.', exampleEn: 'I like the sunset over the sea.' },
    { category: 'nature', icon: '🌬️', fr: 'le vent', en: 'the wind', exampleFr: 'Il y a du vent sur la côte.', exampleEn: 'There is wind on the coast.' },
    { category: 'nature', icon: '🦢', fr: 'les oiseaux', en: 'birds', exampleFr: 'J’aime observer les oiseaux.', exampleEn: 'I like watching birds.' },
    { category: 'nature', icon: '🌊', fr: 'une aventure', en: 'an adventure', exampleFr: 'Chaque promenade est une aventure.', exampleEn: 'Every walk is an adventure.' },
    { category: 'nature', icon: '🧥', fr: 's’habiller chaudement', en: 'to dress warmly', exampleFr: 'On s’habillait chaudement pour le ski.', exampleEn: 'We dressed warmly for skiing.' }
  ];

  const labels = {
    all: 'all words',
    identity: 'identity words',
    places: 'place words',
    life: 'life and family words',
    work: 'work and skill words',
    hobbies: 'hobby words',
    qualities: 'quality words',
    nature: 'nature words'
  };

  const vocabGrid = document.getElementById('vocabGrid');
  const searchInput = document.getElementById('wordSearch');
  const resultsLabel = document.getElementById('wordResultsLabel');
  const clearSearch = document.getElementById('clearSearch');
  const allCount = document.getElementById('allCount');
  let activeCategory = 'all';

  const escapeHtml = (value) => value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));

  function renderVocabulary() {
    const query = searchInput.value.trim().toLowerCase();
    const visible = vocab.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const searchable = `${item.fr} ${item.en} ${item.exampleFr} ${item.exampleEn}`.toLowerCase();
      const matchesQuery = !query || searchable.includes(query);
      return matchesCategory && matchesQuery;
    });

    allCount.textContent = vocab.length;
    resultsLabel.textContent = `Showing ${visible.length} ${labels[activeCategory]}${query ? ` for “${searchInput.value.trim()}”` : ''}.`;

    if (!visible.length) {
      vocabGrid.innerHTML = '<div class="empty-results">No matching words yet. Try “wood”, “family”, “patient”, or “Cape Cod”.</div>';
      return;
    }

    vocabGrid.innerHTML = visible.map((item, index) => `
      <details class="vocab-item" data-vocab-index="${index}">
        <summary>
          <span class="vocab-icon" aria-hidden="true">${item.icon}</span>
          <span><span class="vocab-term">${escapeHtml(item.fr)}</span><span class="vocab-meaning">${escapeHtml(item.en)}</span></span>
          <span class="vocab-chevron" aria-hidden="true">＋</span>
        </summary>
        <div class="vocab-details">
          <div class="vocab-example"><strong>${escapeHtml(item.exampleFr)}</strong><span>${escapeHtml(item.exampleEn)}</span></div>
          <div class="vocab-detail-actions"><button class="audio-chip speak-button" type="button" data-speak="${escapeHtml(item.exampleFr)}">🔊 Listen to example</button></div>
        </div>
      </details>
    `).join('');
  }

  document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.filter;
      document.querySelectorAll('.filter-button').forEach(btn => btn.classList.toggle('active', btn === button));
      renderVocabulary();
    });
  });

  searchInput.addEventListener('input', renderVocabulary);
  clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    renderVocabulary();
  });

  function speechReady(callback) {
    if (!('speechSynthesis' in window)) {
      showToast('French audio is not available in this browser.');
      return;
    }
    const run = () => {
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => /^fr(-|_)/i.test(voice.lang)) || voices.find(voice => /french|français/i.test(voice.name));
      callback(frenchVoice);
    };
    if (window.speechSynthesis.getVoices().length) run();
    else {
      window.speechSynthesis.onvoiceschanged = run;
      setTimeout(run, 250);
    }
  }

  function speak(text) {
    speechReady((voice) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.82;
      utterance.pitch = 1;
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    });
  }

  document.addEventListener('click', (event) => {
    const speakButton = event.target.closest('.speak-button');
    if (speakButton) {
      const target = speakButton.dataset.speakTarget ? document.getElementById(speakButton.dataset.speakTarget) : null;
      const text = target ? target.innerText.trim() : speakButton.dataset.speak;
      if (text) speak(text);
      speakButton.classList.add('speaking');
      window.setTimeout(() => speakButton.classList.remove('speaking'), 750);
    }
  });

  document.querySelectorAll('.reveal-chip').forEach(button => {
    button.addEventListener('click', () => {
      const text = button.dataset.reveal;
      const container = button.closest('.profile-card');
      const target = container.querySelector('.reveal-copy');
      const isOpen = target.textContent.trim().length > 0;
      target.textContent = isOpen ? '' : text;
      button.textContent = isOpen ? (button.dataset.defaultLabel || button.textContent) : 'Hide note';
      if (!button.dataset.defaultLabel) button.dataset.defaultLabel = button.textContent === 'Hide note' ? 'Why?' : button.textContent;
    });
  });

  document.querySelectorAll('.choice-list').forEach(list => {
    list.addEventListener('click', (event) => {
      const selected = event.target.closest('.choice-button');
      if (!selected) return;
      const feedback = list.parentElement.querySelector('.practice-feedback');
      list.querySelectorAll('.choice-button').forEach(button => {
        button.classList.remove('correct', 'incorrect');
      });
      if (selected.dataset.correct === 'true') {
        selected.classList.add('correct');
        feedback.className = 'practice-feedback feedback-success';
        feedback.textContent = 'Exactly right — in French, you have an age: J’ai 71 ans.';
      } else {
        selected.classList.add('incorrect');
        feedback.className = 'practice-feedback feedback-error';
        feedback.textContent = 'Almost — use J’ai for age, never Je suis.';
      }
    });
  });

  const builderWords = ['J’aime', 'cuisiner', '.'];
  const expectedBuilder = 'J’aime cuisiner.';
  const wordBank = document.getElementById('wordBank');
  const sentenceBuilder = document.getElementById('sentenceBuilder');
  const builderFeedback = document.getElementById('builderFeedback');
  let builtWords = [];

  function renderBuilder() {
    wordBank.innerHTML = builderWords.map((word, index) => `
      <button type="button" class="word-token ${builtWords.includes(index) ? 'used' : ''}" data-word-index="${index}">${word}</button>
    `).join('');
    sentenceBuilder.innerHTML = builtWords.length
      ? builtWords.map(index => `<span class="builder-token">${builderWords[index]}</span>`).join('')
      : '<span class="builder-placeholder">Your sentence will appear here.</span>';
  }

  wordBank.addEventListener('click', (event) => {
    const token = event.target.closest('.word-token');
    if (!token) return;
    const index = Number(token.dataset.wordIndex);
    if (!builtWords.includes(index)) builtWords.push(index);
    builderFeedback.textContent = '';
    renderBuilder();
  });

  document.getElementById('checkBuilder').addEventListener('click', () => {
    const actual = builtWords.map(index => builderWords[index]).join(' ');
    if (actual === expectedBuilder) {
      builderFeedback.className = 'practice-feedback dark-feedback feedback-success';
      builderFeedback.textContent = 'Très bien! J’aime cuisiner. is exactly right.';
    } else {
      builderFeedback.className = 'practice-feedback dark-feedback feedback-error';
      builderFeedback.textContent = 'Try this order: J’aime + cuisiner + .';
    }
  });

  document.getElementById('resetBuilder').addEventListener('click', () => {
    builtWords = [];
    builderFeedback.textContent = '';
    renderBuilder();
  });

  document.getElementById('checkProfile').addEventListener('click', () => {
    const selects = [...document.querySelectorAll('#profileForm select')];
    let score = 0;
    selects.forEach(select => {
      const correct = select.value === select.dataset.answer;
      select.classList.toggle('correct-select', correct);
      select.classList.toggle('incorrect-select', !correct && select.value !== '');
      if (correct) score++;
    });
    const feedback = document.getElementById('profileFeedback');
    if (score === selects.length) {
      feedback.className = 'practice-feedback feedback-success';
      feedback.textContent = 'Perfect, Dad — every sentence is correct. You have the building blocks of your profile.';
    } else {
      feedback.className = 'practice-feedback feedback-error';
      feedback.textContent = `${score} of ${selects.length} correct. Look again at the first word: Je m’appelle, entre… et…, J’aime + infinitive, and Je sais + infinitive.`;
    }
  });

  document.getElementById('resetProfile').addEventListener('click', () => {
    document.querySelectorAll('#profileForm select').forEach(select => {
      select.value = '';
      select.classList.remove('correct-select', 'incorrect-select');
    });
    document.getElementById('profileFeedback').textContent = '';
  });

  const toggleTranslation = document.getElementById('toggleTranslation');
  const modelEnglish = document.querySelector('.model-english');
  toggleTranslation.addEventListener('click', () => {
    const isHidden = modelEnglish.classList.toggle('hidden');
    toggleTranslation.textContent = isHidden ? 'Show English translation' : 'Hide English translation';
  });

  const fullIntro = "Bonjour, je m'appelle David. J'ai soixante et onze ans. Je partage mon temps entre Nantucket et Cape Cod. Je suis retraité, mais j'ai eu plusieurs métiers : j'ai enseigné les mathématiques, j'ai travaillé dans l'assurance-vie et j'ai créé des logiciels. J'aime cuisiner, travailler le bois, jardiner, faire de la randonnée et découvrir de nouvelles choses. Je suis créatif, curieux, méticuleux et très attaché à ma famille.";
  document.getElementById('copyIntroduction').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(fullIntro);
      document.getElementById('copyStatus').textContent = 'Copied — ready for a French-speaking adventure.';
      showToast('French introduction copied.');
    } catch (error) {
      document.getElementById('copyStatus').textContent = 'Select and copy the French text above — some browsers block automatic copying.';
    }
  });

  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  renderVocabulary();
  renderBuilder();
})();
