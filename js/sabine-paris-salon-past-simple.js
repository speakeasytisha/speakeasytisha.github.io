(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const regularVerbs = [
    { icon: '📅', base: 'organise', past: 'organised', fr: 'organiser', example: 'I organised the stand before the visitors arrived.' },
    { icon: '📞', base: 'call', past: 'called', fr: 'appeler', example: 'I called the venue manager in the morning.' },
    { icon: '📝', base: 'plan', past: 'planned', fr: 'planifier', example: 'We planned the schedule carefully.' },
    { icon: '✅', base: 'check', past: 'checked', fr: 'vérifier', example: 'I checked the guest list and the table plan.' },
    { icon: '🤝', base: 'welcome', past: 'welcomed', fr: 'accueillir', example: 'I welcomed visitors at the stand.' },
    { icon: '💬', base: 'answer', past: 'answered', fr: 'répondre', example: 'I answered many questions during the day.' },
    { icon: '📦', base: 'prepare', past: 'prepared', fr: 'préparer', example: 'I prepared brochures and samples.' },
    { icon: '📧', base: 'email', past: 'emailed', fr: 'envoyer un e-mail', example: 'I emailed suppliers after the event.' }
  ];

  const irregularVerbs = [
    { icon: '🗣️', base: 'speak', past: 'spoke', fr: 'parler', example: 'I spoke with many future clients.' },
    { icon: '👥', base: 'meet', past: 'met', fr: 'rencontrer', example: 'I met suppliers and wedding designers.' },
    { icon: '🚶', base: 'go', past: 'went', fr: 'aller', example: 'I went to Paris for the salon.' },
    { icon: '🕗', base: 'come', past: 'came', fr: 'venir', example: 'Many visitors came to our stand.' },
    { icon: '📥', base: 'get', past: 'got', fr: 'obtenir / recevoir', example: 'We got useful feedback from visitors.' },
    { icon: '🧠', base: 'think', past: 'thought', fr: 'penser', example: 'I thought the event was productive.' },
    { icon: '✍️', base: 'write', past: 'wrote', fr: 'écrire', example: 'I wrote notes after the salon.' },
    { icon: '🎁', base: 'give', past: 'gave', fr: 'donner', example: 'I gave brochures to potential clients.' }
  ];

  const connectors = [
    { icon: '1️⃣', en: 'first', fr: 'd’abord', use: 'First, I arrived at the venue.' },
    { icon: '2️⃣', en: 'then', fr: 'puis / ensuite', use: 'Then, I checked the stand.' },
    { icon: '➡️', en: 'after that', fr: 'après cela', use: 'After that, I spoke with visitors.' },
    { icon: '⏭️', en: 'next', fr: 'ensuite', use: 'Next, I met a supplier.' },
    { icon: '🎯', en: 'finally', fr: 'finalement / enfin', use: 'Finally, I wrote my notes.' },
    { icon: '➕', en: 'also', fr: 'aussi', use: 'I also answered questions about our services.' },
    { icon: '🤝', en: 'because', fr: 'parce que', use: 'I stayed calm because the day was busy.' },
    { icon: '💡', en: 'so', fr: 'donc', use: 'The salon was busy, so I took quick notes.' }
  ];

  const ex1 = [
    {
      prompt: 'Choose the correct sentence.',
      question: '📝 Yesterday, ______ the brochures for the stand.',
      options: ['I prepared', 'I prepare', 'I didn’t prepared'],
      answer: 0,
      explain: 'Past simple affirmative: <strong>I prepared</strong>.'
    },
    {
      prompt: 'Choose the correct negative sentence.',
      question: '📞 Yesterday, ______ the florist in the evening.',
      options: ['I didn’t called', 'I did not call', 'I not called'],
      answer: 1,
      explain: 'Negative = <strong>did not / didn’t + base verb</strong>: I did not call.'
    },
    {
      prompt: 'Choose the correct question.',
      question: '✅ ______ the guest list before the salon?',
      options: ['Did I checked', 'Did I check', 'Checked I'],
      answer: 1,
      explain: 'Question = <strong>Did + subject + base verb</strong>: Did I check...?' 
    },
    {
      prompt: 'Choose the correct sentence.',
      question: '📦 In Paris, ______ the welcome gifts early in the morning.',
      options: ['I prepared', 'I preparing', 'I did prepareed'],
      answer: 0,
      explain: 'Regular verb: prepare → prepared.'
    },
    {
      prompt: 'Choose the correct negative sentence.',
      question: '📧 ______ all the suppliers before breakfast.',
      options: ['I didn’t email', 'I didn’t emailed', 'I not email'],
      answer: 0,
      explain: 'After didn’t, use the base verb: email.'
    },
    {
      prompt: 'Choose the correct question.',
      question: '🤝 ______ visitors at the entrance?',
      options: ['Did I welcomed', 'Did I welcome', 'Did welcomed I'],
      answer: 1,
      explain: 'Question = Did I welcome... ?'
    }
  ];

  const ex2 = [
    {
      prompt: 'Choose the correct sentence.',
      question: '👥 Sabine and her assistant ______ the suppliers at 9:00.',
      options: ['met', 'meeted', 'did met'],
      answer: 0,
      explain: 'Irregular verb: meet → met.'
    },
    {
      prompt: 'Choose the correct sentence.',
      question: '💬 He ______ many questions from visitors.',
      options: ['answered', 'answer', 'did answered'],
      answer: 0,
      explain: 'Past simple affirmative: he answered.'
    },
    {
      prompt: 'Choose the correct negative sentence.',
      question: '🚚 They ______ late to the venue.',
      options: ['didn’t arrived', 'didn’t arrive', 'not arrived'],
      answer: 1,
      explain: 'Negative = didn’t + base verb: arrive.'
    },
    {
      prompt: 'Choose the correct question.',
      question: '📝 ______ she organise the brochure table?',
      options: ['Did', 'Does', 'Was'],
      answer: 0,
      explain: 'Past simple question starts with <strong>Did</strong>.'
    },
    {
      prompt: 'Choose the correct sentence.',
      question: '📍 We ______ in Paris for two days.',
      options: ['stayed', 'stayed', 'did stayed'],
      answer: 0,
      explain: 'Regular verb: stay → stayed.'
    },
    {
      prompt: 'Choose the correct question.',
      question: '📞 ______ you call the venue manager after lunch?',
      options: ['Did', 'Do', 'Are'],
      answer: 0,
      explain: 'Use Did for past simple questions.'
    }
  ];

  const ex3 = [
    {
      prompt: 'Choose the correct past form.',
      question: '🗣️ speak → ?',
      options: ['speaked', 'spoke', 'spoken'],
      answer: 1,
      explain: 'Irregular verb: speak → spoke.'
    },
    {
      prompt: 'Choose the correct sentence.',
      question: '🚶 Yesterday, I ______ to Paris by train.',
      options: ['goed', 'went', 'go'],
      answer: 1,
      explain: 'Irregular verb: go → went.'
    },
    {
      prompt: 'Choose the correct sentence.',
      question: '👥 At the salon, we ______ many potential clients.',
      options: ['met', 'meeted', 'meet'],
      answer: 0,
      explain: 'Irregular verb: meet → met.'
    },
    {
      prompt: 'Choose the correct negative sentence.',
      question: '✍️ I ______ long emails during the salon because I was busy.',
      options: ['didn’t wrote', 'didn’t write', 'not wrote'],
      answer: 1,
      explain: 'After didn’t, use the base verb: write.'
    },
    {
      prompt: 'Choose the correct sentence.',
      question: '📥 We ______ useful feedback from visitors.',
      options: ['got', 'getted', 'get'],
      answer: 0,
      explain: 'Irregular verb: get → got.'
    },
    {
      prompt: 'Choose the correct question.',
      question: '🎁 ______ you give brochures to the visitors?',
      options: ['Gave', 'Did', 'Do'],
      answer: 1,
      explain: 'Question = Did you give... ?'
    }
  ];

  const roleplays = {
    debrief: {
      title: '📋 Debrief with a client after the salon',
      situation: 'A client asks you what happened at the salon in Paris and what the results were.',
      checklist: [
        'Say when the event happened.',
        'Use at least 3 past simple verbs.',
        'Use one connector: first / then / after that / finally.',
        'Say one positive result.'
      ],
      model: 'Last week, I went to Paris for the salon. First, I arrived early and organised the stand. Then, I met suppliers and spoke with many visitors. After that, I answered questions about our services. Finally, I wrote notes and contacted the most interested clients. The salon went well, and we got good feedback.'
    },
    supplier: {
      title: '🌸 Talk to a supplier about what happened',
      situation: 'You call a supplier after the salon to explain how the day went.',
      checklist: [
        'Say hello politely.',
        'Explain what happened during the day.',
        'Use one irregular verb.',
        'Say what you need for the next event.'
      ],
      model: 'Hello, this is Sabine calling. I wanted to tell you about the salon in Paris. It went well. We met many visitors and we got useful feedback. Your flowers looked beautiful and many people noticed them. For the next event, I would like a similar style, but I also need more small arrangements.'
    },
    team: {
      title: '👩‍💼 Tell your team about the day in Paris',
      situation: 'You speak to your team after you come back from the salon.',
      checklist: [
        'Use first / then / finally.',
        'Use we + past simple.',
        'Mention visitors, suppliers, and feedback.',
        'Finish with a short conclusion.'
      ],
      model: 'First, we arrived at the venue and checked the stand. Then, we welcomed visitors and spoke with suppliers. We answered many questions and we gave brochures to future clients. Finally, we wrote notes and discussed the best contacts. Overall, the day was busy but successful.'
    }
  };

  let verbTab = 'regular';
  let accent = 'en-GB';

  function renderVerbs() {
    const data = verbTab === 'regular' ? regularVerbs : irregularVerbs;
    const html = data.map(item => `
      <article class="sps-verbcard">
        <h3>${item.icon} ${item.base} → ${item.past}</h3>
        <p><strong>FR:</strong> <span class="fr">${item.fr}</span></p>
        <p><strong>Example:</strong> ${item.example}</p>
        <button class="sps-listen" type="button" data-speak="${escapeAttr(item.example)}">🔊 Listen</button>
      </article>
    `).join('');
    $('#verbCards').innerHTML = html;
  }

  function renderConnectors() {
    $('#connectorCards').innerHTML = connectors.map(item => `
      <article class="sps-connect">
        <h3>${item.icon} ${item.en}</h3>
        <p><span class="fr">${item.fr}</span></p>
        <p>${item.use}</p>
        <button class="sps-listen" type="button" data-speak="${escapeAttr(item.use)}">🔊 Listen</button>
      </article>
    `).join('');
  }

  function renderExerciseSet(containerId, items) {
    const root = $(containerId);
    root.innerHTML = items.map((item, index) => `
      <article class="sps-ex" data-answer="${item.answer}">
        <p class="sps-ex__prompt">${item.prompt}</p>
        <p>${item.question}</p>
        <div class="sps-choices">
          ${item.options.map((opt, optIndex) => `
            <button class="sps-choice" type="button" data-index="${optIndex}">${opt}</button>
          `).join('')}
        </div>
        <div class="sps-answer">${item.explain}</div>
      </article>
    `).join('');

    $$('.sps-ex', root).forEach(card => {
      const answer = Number(card.dataset.answer);
      const reveal = $('.sps-answer', card);
      $$('.sps-choice', card).forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = Number(btn.dataset.index);
          $$('.sps-choice', card).forEach(b => b.disabled = true);
          btn.classList.add(selected === answer ? 'is-correct' : 'is-wrong');
          const correctBtn = $(`.sps-choice[data-index="${answer}"]`, card);
          if (correctBtn) correctBtn.classList.add('is-correct');
          reveal.classList.add('is-visible');
        });
      });
    });
  }

  function renderRoleplay(key = 'debrief') {
    const item = roleplays[key];
    $('#roleplayCard').innerHTML = `
      <h3>${item.title}</h3>
      <p class="sps-roleplay__scenario">${item.situation}</p>
      <p class="sps-small">Try to speak alone first. Then check the model answer.</p>
      <ul class="sps-checklist">
        ${item.checklist.map(line => `<li>${line}</li>`).join('')}
      </ul>
      <div class="sps-controls">
        <button class="sps-btn" type="button" id="showModelBtn">Show model answer</button>
        <button class="sps-listen" type="button" data-speak="${escapeAttr(item.model)}">🔊 Listen to model</button>
      </div>
      <div class="sps-model" id="roleplayModel" hidden>
        <strong>Model answer:</strong> ${item.model}<br>
        <span class="fr block">${translateRoleplayKey(key)}</span>
      </div>
    `;

    $('#showModelBtn').addEventListener('click', () => {
      const box = $('#roleplayModel');
      const hidden = box.hasAttribute('hidden');
      if (hidden) {
        box.removeAttribute('hidden');
        $('#showModelBtn').textContent = 'Hide model answer';
      } else {
        box.setAttribute('hidden', 'hidden');
        $('#showModelBtn').textContent = 'Show model answer';
      }
    });
  }

  function translateRoleplayKey(key) {
    const map = {
      debrief: 'La semaine dernière, je suis allée à Paris pour le salon. D’abord, je suis arrivée tôt et j’ai organisé le stand. Ensuite, j’ai rencontré des prestataires et j’ai parlé avec beaucoup de visiteurs. Après cela, j’ai répondu aux questions sur nos services. Enfin, j’ai écrit des notes et contacté les clients les plus intéressés. Le salon s’est bien passé et nous avons reçu de bons retours.',
      supplier: 'Bonjour, c’est Sabine à l’appareil. Je voulais vous parler du salon à Paris. Cela s’est bien passé. Nous avons rencontré beaucoup de visiteurs et nous avons reçu des retours utiles. Vos fleurs étaient magnifiques et beaucoup de personnes les ont remarquées. Pour le prochain événement, j’aimerais un style similaire, mais j’ai aussi besoin de plus de petites compositions.',
      team: 'D’abord, nous sommes arrivés sur le lieu et avons vérifié le stand. Ensuite, nous avons accueilli les visiteurs et parlé avec les prestataires. Nous avons répondu à de nombreuses questions et donné des brochures à de futurs clients. Enfin, nous avons écrit des notes et discuté des meilleurs contacts. Dans l’ensemble, la journée a été chargée mais réussie.'
    };
    return map[key] || '';
  }

  function escapeAttr(text) {
    return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  function pickVoice(lang) {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    return voices.find(v => (v.lang || '').toLowerCase() === lang.toLowerCase())
      || voices.find(v => (v.lang || '').toLowerCase().startsWith(lang.split('-')[0].toLowerCase()))
      || null;
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = accent;
    const voice = pickVoice(accent);
    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  function bindGlobalActions() {
    $('#frToggle').addEventListener('click', () => {
      document.body.classList.toggle('show-fr');
    });

    $$('.sps-btn[data-accent]').forEach(btn => {
      btn.addEventListener('click', () => {
        accent = btn.dataset.accent;
        $$('.sps-btn[data-accent]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });

    $('#printBtn').addEventListener('click', () => window.print());

    $$('.sps-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        verbTab = tab.dataset.verbTab;
        $$('.sps-tab').forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        renderVerbs();
      });
    });

    document.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-speak]');
      if (!btn) return;
      speak(btn.dataset.speak);
    });

    $('#checkStoryBtn').addEventListener('click', () => {
      const selects = $$('select[data-answer]', $('#storyForm'));
      let correct = 0;
      selects.forEach(select => {
        if (select.value === select.dataset.answer) correct += 1;
      });
      const fb = $('#storyFeedback');
      fb.className = 'sps-feedback is-visible ' + (correct === selects.length ? 'good' : 'bad');
      if (correct === selects.length) {
        fb.innerHTML = 'Excellent! Your mini story is correct. <span class="fr">Bravo ! Ton mini-récit est correct.</span>';
      } else {
        fb.innerHTML = `You have ${correct} / ${selects.length} correct. Check the incorrect verbs and try again. <span class="fr">Tu as ${correct} / ${selects.length}. Vérifie les verbes incorrects et réessaie.</span>`;
      }
    });

    $('#showStoryBtn').addEventListener('click', () => {
      const answers = ['arrived', 'met', 'checked', 'spoke', 'answered', 'went', 'wrote'];
      $$('select[data-answer]', $('#storyForm')).forEach((select, index) => {
        select.value = answers[index];
      });
      const fb = $('#storyFeedback');
      fb.className = 'sps-feedback is-visible good';
      fb.innerHTML = 'Model story shown. Read it aloud with the sequencing words. <span class="fr">Le modèle est affiché. Lis-le à voix haute avec les connecteurs.</span>';
    });

    $('#roleplaySelect').addEventListener('change', (e) => {
      renderRoleplay(e.target.value);
    });
  }

  function init() {
    renderVerbs();
    renderConnectors();
    renderExerciseSet('#exercise1', ex1);
    renderExerciseSet('#exercise2', ex2);
    renderExerciseSet('#exercise3', ex3);
    renderRoleplay();
    bindGlobalActions();
  }

  init();
})();
