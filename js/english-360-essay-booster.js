
(function () {
  'use strict';

  const state = {
    score: 0,
    maxScore: 0,
    accent: 'us',
    ipadMode: true,
    topicKey: 'customer-compensation',
    timerSeconds: 720,
    timerDefault: 720,
    timerRunning: false,
    timerId: null,
    selectedIdea: '',
    selectedPhrase: '',
    selectedUpgrade: ''
  };

  const topics = {
    'customer-compensation': {
      title: 'Should companies always compensate unhappy customers?',
      prompt: 'Write an opinion essay. Give your opinion and support it with reasons and examples.',
      ideas: [
        'Compensation can rebuild trust.',
        'Not every complaint is legitimate.',
        'A polite response matters as much as money.',
        'Clear company policies prevent conflict.',
        'Fast action can protect the company’s reputation.'
      ],
      phrases: [
        'In my opinion,',
        'First of all,',
        'Moreover,',
        'For example,',
        'To conclude,'
      ],
      upgrades: [
        'respond quickly',
        'handle complaints professionally',
        'maintain customer trust',
        'protect the company’s reputation',
        'offer a fair solution'
      ],
      challenge: [
        'Explain whether compensation should be automatic or case by case.',
        'Use one example from travel, shopping, or a service problem.',
        'Add one sentence about politeness and one about fairness.'
      ],
      model: {
        a2: 'Many customers are unhappy when they have a bad experience. In my opinion, companies should try to help them. First of all, a fast and polite answer can calm the customer. For example, if a hotel room is noisy, the staff can apologize and offer another room. Moreover, a fair solution can make the customer trust the company again. However, I do not think every customer should receive money automatically because some complaints are not serious. To conclude, companies should listen carefully and choose a fair solution for each situation.',
        b1: 'When customers are dissatisfied, companies often have to decide whether they should offer compensation. In my opinion, they should do so when the complaint is justified, but the response should depend on the situation. First of all, compensation can help rebuild trust after a genuine mistake. For instance, if a customer pays for a service that was not provided, offering a refund is both fair and professional. In addition, a quick and respectful response shows that the company values its clients. However, automatic compensation may encourage unfair complaints and create unnecessary costs. For this reason, it is important to examine each case carefully. To conclude, companies should compensate unhappy customers when there is a real problem, but they should do it in a balanced and reasonable way.',
        b2: 'Whether companies should always compensate dissatisfied customers is a question that depends on both fairness and professional responsibility. In my view, compensation should not be automatic, but it should certainly be offered when the company is clearly at fault. To begin with, appropriate compensation can restore trust and prevent long-term damage to a company’s reputation. If a customer receives poor service, misleading information, or a defective product, a refund or a commercial gesture can demonstrate accountability. Furthermore, a thoughtful response often matters just as much as the compensation itself. A clear explanation, a sincere apology, and efficient follow-up can significantly improve the customer’s experience. That said, businesses should avoid rewarding every complaint without investigation, as this may lead to abuse and inconsistency. Ultimately, the best approach is to assess each case individually and provide a solution that is fair, proportionate, and professional.'
      }
    },
    'online-learning': {
      title: 'Is online learning better than face-to-face learning?',
      prompt: 'Write an opinion essay. Compare both options and explain which one is better in your opinion.',
      ideas: [
        'Online learning is flexible.',
        'Face-to-face learning gives more direct interaction.',
        'Technology can save travel time.',
        'Some students need more structure.',
        'Good teachers matter in both formats.'
      ],
      phrases: [
        'Nowadays,',
        'On the one hand,',
        'On the other hand,',
        'As a result,',
        'Overall,'
      ],
      upgrades: [
        'learn at their own pace',
        'benefit from direct feedback',
        'develop stronger concentration',
        'save commuting time',
        'adapt to different learning styles'
      ],
      challenge: [
        'Mention at least one advantage and one drawback of each format.',
        'Use a connector of contrast.',
        'Finish with a clear personal opinion.'
      ],
      model: {
        a2: 'Today, many people study online, but others prefer face-to-face lessons. In my opinion, both systems are useful, but face-to-face learning is often better for many students. On the one hand, online learning is practical because students can study from home and save time. On the other hand, face-to-face classes are more interactive. Students can ask questions easily and teachers can see if they understand. For example, some learners need direct help and motivation in class. To conclude, online learning is convenient, but face-to-face learning is often more effective for communication and support.',
        b1: 'Online learning has become increasingly common in recent years, and many students now have to choose between studying online and attending traditional classes. In my opinion, both methods have advantages, but face-to-face learning is generally more effective. One major advantage of online learning is flexibility. Students can often organize their schedule more easily and avoid spending time travelling. However, studying online can also make learners feel isolated, and it may be harder to stay focused. In contrast, face-to-face learning encourages interaction and allows teachers to give immediate feedback. This is especially useful for language learners who need speaking practice. Overall, online learning is convenient, but face-to-face learning usually offers a richer and more supportive experience.',
        b2: 'The debate over whether online learning is superior to face-to-face education has become increasingly relevant as digital tools continue to expand. Although online learning offers undeniable flexibility, I believe that face-to-face learning remains more effective in most cases. Admittedly, online courses allow students to work from almost anywhere and often make it easier to balance study with professional or personal responsibilities. They can also provide access to a wide range of resources at any time. Nevertheless, this convenience comes with limitations. Many learners struggle with concentration, motivation, and the lack of direct interaction. By contrast, face-to-face learning promotes spontaneous communication, immediate feedback, and a stronger sense of structure. These elements are particularly valuable in subjects that require discussion, guidance, or active participation. In conclusion, while online learning is a useful and modern solution, face-to-face learning generally provides deeper engagement and more effective support.'
      }
    },
    'tourism-balance': {
      title: 'Does tourism bring more advantages than disadvantages?',
      prompt: 'Write an opinion essay about tourism. Give balanced arguments before stating your final opinion.',
      ideas: [
        'Tourism creates jobs.',
        'It supports local businesses.',
        'Too many visitors can damage cities or nature.',
        'Tourism encourages cultural exchange.',
        'Better regulation can reduce problems.'
      ],
      phrases: [
        'It is often argued that',
        'To begin with,',
        'However,',
        'In addition,',
        'In the long run,'
      ],
      upgrades: [
        'generate revenue',
        'put pressure on local infrastructure',
        'preserve cultural heritage',
        'support small businesses',
        'manage visitor numbers effectively'
      ],
      challenge: [
        'Give one economic argument and one environmental argument.',
        'Use a balanced tone before your conclusion.',
        'Mention a realistic solution.'
      ],
      model: {
        a2: 'Tourism is very important in many countries. In my opinion, tourism has more advantages than disadvantages, but it must be well organized. First of all, tourism creates jobs in hotels, restaurants and transport. It also helps local shops and cafés. However, too many tourists can make places noisy and crowded. In some areas, nature can also be damaged. For example, beaches and city centers can become dirty if there are too many visitors. To conclude, tourism is positive because it brings money and activity, but governments should control it carefully.',
        b1: 'Tourism plays an important role in many countries, and its impact can be both positive and negative. In my view, it brings more advantages than disadvantages, provided that it is managed responsibly. To begin with, tourism generates jobs and supports a wide range of businesses, including hotels, restaurants, transport services, and local shops. It can also help visitors discover new cultures and traditions. However, mass tourism can create serious problems. Popular destinations may become overcrowded, and the environment can suffer if visitor numbers are too high. For instance, beaches, historical centers, and natural parks can be damaged by pollution or overuse. In conclusion, tourism is beneficial overall, but authorities need to regulate it properly in order to protect local communities and the environment.',
        b2: 'Tourism is often presented as a major source of economic development, yet it can also create significant social and environmental challenges. In my opinion, it brings more advantages than disadvantages, as long as it is managed in a sustainable and responsible way. On the positive side, tourism generates revenue, creates employment, and supports a wide network of local businesses. It can also promote cultural exchange and encourage the preservation of heritage sites that might otherwise receive less attention. However, the negative consequences of uncontrolled tourism should not be underestimated. Overcrowding can place considerable pressure on infrastructure, raise prices for local residents, and contribute to environmental degradation. Destinations that rely too heavily on tourism may also become vulnerable to sudden economic changes. Even so, these problems can often be reduced through better planning, visitor limits, and investment in sustainable practices. Ultimately, tourism remains a valuable force, but only when growth is balanced with protection and long-term responsibility.'
      }
    },
    'public-transport': {
      title: 'Should public transport be free in cities?',
      prompt: 'Write an opinion essay. Discuss the benefits and drawbacks, then give your own view.',
      ideas: [
        'Free transport can reduce traffic.',
        'It can help low-income residents.',
        'Cities still need money to maintain the service.',
        'Better transport can reduce pollution.',
        'Quality is as important as price.'
      ],
      phrases: [
        'There is a growing debate about',
        'One advantage is that',
        'Nevertheless,',
        'For this reason,',
        'All things considered,'
      ],
      upgrades: [
        'ease financial pressure',
        'encourage sustainable travel',
        'require public funding',
        'improve accessibility',
        'maintain a reliable network'
      ],
      challenge: [
        'Mention one social argument and one financial argument.',
        'Use at least two B2 connectors.',
        'End with a nuanced conclusion.'
      ],
      model: {
        a2: 'Some people think public transport should be free in cities. In my opinion, this idea has many advantages, but it is not simple. First, free buses and trains can help people who do not have a lot of money. It can also reduce traffic because more people may leave their cars at home. However, transport systems cost a lot of money. Cities must pay for drivers, repairs and stations. To conclude, free public transport can be very useful, but cities need a good financial plan to make it possible.',
        b1: 'Whether public transport should be free in cities is an issue that many people are discussing today. In my opinion, it would be a positive change, but only if cities can maintain good service. One important benefit is that free transport would make daily travel easier for people with limited incomes. It could also encourage more residents to use buses, trams, or trains instead of cars, which would reduce traffic and pollution. However, public transport is expensive to run, and somebody still has to pay for it through taxes or other public funding. If the system becomes free but less reliable, people may stop using it. Overall, free public transport is a good idea, but it should be introduced carefully and supported by strong public investment.',
        b2: 'The idea of making public transport free in cities is often presented as a solution to both social inequality and environmental concerns. While I agree that this policy could bring significant benefits, I believe that it would only be successful if service quality remained high. On the one hand, free public transport could ease financial pressure on households and make mobility more accessible to students, workers, and low-income residents. It might also encourage people to abandon private cars, thereby reducing congestion and pollution. On the other hand, transport networks require substantial funding to remain efficient, safe, and reliable. If a city cannot replace ticket revenue with sustainable public investment, the quality of the service may decline. In the end, free public transport can be an excellent policy, but affordability should never come at the expense of reliability and long-term maintenance.'
      }
    }
  };

  const connectors = [
    'To begin with,', 'First of all,', 'Moreover,', 'In addition,', 'However,', 'On the other hand,',
    'For example,', 'As a result,', 'For this reason,', 'In contrast,', 'Overall,', 'To conclude,'
  ];

  const correctionItems = [
    {
      wrong: 'arrived to Majorque in Spain in july 2025',
      right: 'arrived in Mallorca, Spain, in July 2025',
      why: 'Use arrive in with countries, islands, cities, and use English spelling + capital letters for months.'
    },
    {
      wrong: 'picked up the car from Hertz agency',
      right: 'picked up the car from the Hertz agency',
      why: 'Use the article the before a specific agency or desk.'
    },
    {
      wrong: 'there was a damage',
      right: 'there was damage / there was a scratch',
      why: 'Damage is usually uncountable. Use a scratch for one visible mark.'
    },
    {
      wrong: 'after a car control',
      right: 'after inspecting the car / after a vehicle inspection',
      why: 'Car control is not natural here. Inspection is the correct collocation.'
    },
    {
      wrong: 'we didn’t take any pictures from the car before our rent',
      right: 'we hadn’t taken any pictures of the car before renting it',
      why: 'Take pictures of something. Use past perfect for an earlier past action.'
    },
    {
      wrong: 'Hertz demanded us to pay',
      right: 'Hertz asked us to pay / Hertz demanded that we pay',
      why: 'Demand somebody to pay is incorrect. Use ask someone to pay or demand that + clause.'
    },
    {
      wrong: 'the damage which we were not responsible',
      right: 'the damage for which we were not responsible / damage that we do not believe we caused',
      why: 'Responsible must be followed by for. The second version sounds more natural in an essay.'
    },
    {
      wrong: 'we paid the cost of 300 euros',
      right: 'we paid 300 euros / we paid the 300-euro charge',
      why: 'In English, we usually say pay + amount directly.'
    }
  ];

  const quizBank = [
    {
      stem: 'Choose the strongest sentence:',
      options: [
        'We returned the car at the airport and they said there was a problem.',
        'We returned the car to the agency at the airport, where the staff informed us that there was a scratch on the door.',
        'At airport, there was problem with the car when we return it.'
      ],
      answer: 1,
      hint: 'Choose the option with precise vocabulary and correct prepositions.'
    },
    {
      stem: 'Which sentence sounds most natural?',
      options: [
        'We didn’t make photos from the car before the rent.',
        'We did not take any photos of the car before renting it.',
        'We not took pictures of the car before our rent.'
      ],
      answer: 1,
      hint: 'Look for take photos of + before renting it.'
    },
    {
      stem: 'Which connector is best here? “___, we had no proof of the original condition of the vehicle.”',
      options: ['However,', 'As a result,', 'For example,'],
      answer: 1,
      hint: 'The sentence expresses the consequence of not taking photos.'
    },
    {
      stem: 'Choose the best upgrade:',
      options: [
        'It was a big mistake.',
        'This turned out to be a serious mistake.',
        'This mistake was very big and not good.'
      ],
      answer: 1,
      hint: 'Choose the version that sounds more mature and natural.'
    },
    {
      stem: 'Which thesis sentence is clearer?',
      options: [
        'I think this is a problem.',
        'In my opinion, car rental companies should provide clearer evidence before charging customers for damage.',
        'My opinion is that maybe the company is not always correct.'
      ],
      answer: 1,
      hint: 'A good thesis is direct and specific.'
    },
    {
      stem: 'Choose the most natural conclusion:',
      options: [
        'In conclusion, in future we will be more careful and maybe choose insurance.',
        'To conclude, this experience taught us to document the vehicle carefully and to consider full coverage insurance in the future.',
        'In conclusion, it was bad and next time we do differently.'
      ],
      answer: 1,
      hint: 'A strong conclusion sounds clear, complete, and professional.'
    }
  ];

  const challengePrompts = [
    {
      title: 'Quick challenge 1',
      text: 'Write one opening sentence and one thesis sentence in under 2 minutes.'
    },
    {
      title: 'Quick challenge 2',
      text: 'Write a body paragraph with a connector, one reason, and one example.'
    },
    {
      title: 'Quick challenge 3',
      text: 'Rewrite a basic sentence using stronger vocabulary: good / bad / big / small → more precise words.'
    }
  ];

  const byId = (id) => document.getElementById(id);

  const els = {
    scoreNow: byId('scoreNow'),
    scoreMax: byId('scoreMax'),
    progressFill: byId('progressFill'),
    progressText: byId('progressText'),
    toast: byId('toast'),
    connectorBank: byId('connectorBank'),
    errorList: byId('errorList'),
    rewriteQuiz: byId('rewriteQuiz'),
    topicSelect: byId('topicSelect'),
    essayPromptTitle: byId('essayPromptTitle'),
    essayPromptText: byId('essayPromptText'),
    ideaBank: byId('ideaBank'),
    phraseBank: byId('phraseBank'),
    upgradeBank: byId('upgradeBank'),
    planBuilder: byId('planBuilder'),
    draftArea: byId('draftArea'),
    draftFeedback: byId('draftFeedback'),
    challengeCards: byId('challengeCards'),
    reportOutput: byId('reportOutput'),
    levelSelect: byId('levelSelect'),
    contextSelect: byId('contextSelect'),
    studentName: byId('studentName'),
    accentToggle: byId('accentToggle'),
    ipadModeBtn: byId('ipadModeBtn'),
    timerDisplay: byId('timerDisplay')
  };

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
      els.toast.classList.remove('show');
    }, 1800);
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function updateScore(delta, maxDelta) {
    state.score += delta;
    state.maxScore += maxDelta;
    renderProgress();
  }

  function renderScore() {
    els.scoreNow.textContent = String(state.score);
    els.scoreMax.textContent = String(state.maxScore);
  }

  function renderProgress() {
    renderScore();
    const checks = Array.from(document.querySelectorAll('.progress-check'));
    const checked = checks.filter((cb) => cb.checked).length;
    const total = checks.length || 1;
    const quizAnswered = Array.from(document.querySelectorAll('.quiz-item[data-done="true"]')).length;
    const sections = [
      els.draftArea.value.trim().length > 0,
      quizAnswered >= 3,
      checked >= 3,
      document.querySelectorAll('.plan-slot .filled').length >= 3
    ];
    const progress = Math.round(((sections.filter(Boolean).length + checked / total) / 5) * 100);
    els.progressFill.style.width = `${Math.min(progress, 100)}%`;
    els.progressText.textContent = `${Math.min(progress, 100)}%`;
    renderReport();
  }

  function speakText(text) {
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis is not supported on this device.');
      return;
    }
    const content = String(text || '').trim();
    if (!content) {
      showToast('Nothing to read yet.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(content);
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((voice) => {
      const lang = (voice.lang || '').toLowerCase();
      const name = (voice.name || '').toLowerCase();
      if (state.accent === 'uk') {
        return lang.includes('en-gb') || name.includes('uk') || name.includes('british');
      }
      return lang.includes('en-us') || name.includes('us') || name.includes('american');
    });
    if (preferred) {
      utterance.voice = preferred;
      utterance.lang = preferred.lang;
    } else {
      utterance.lang = state.accent === 'uk' ? 'en-GB' : 'en-US';
    }
    window.speechSynthesis.speak(utterance);
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied.')).catch(() => showToast('Copy failed.'));
  }

  function makeChip(text, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function renderConnectors() {
    els.connectorBank.innerHTML = '';
    connectors.forEach((item) => {
      els.connectorBank.appendChild(makeChip(item, () => copyText(item)));
    });
  }

  function renderCorrectionItems() {
    els.errorList.innerHTML = correctionItems.map((item) => `
      <article class="error-card">
        <p class="wrong">✗ ${escapeHtml(item.wrong)}</p>
        <p class="right">✓ ${escapeHtml(item.right)}</p>
        <p>${escapeHtml(item.why)}</p>
      </article>
    `).join('');
  }

  function shuffle(array) {
    const clone = array.slice();
    for (let i = clone.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  }

  function renderQuiz() {
    const subset = shuffle(quizBank).slice(0, 4);
    els.rewriteQuiz.innerHTML = '';
    subset.forEach((q, index) => {
      const item = document.createElement('article');
      item.className = 'quiz-item';
      item.dataset.done = 'false';
      item.innerHTML = `<h5>${index + 1}. ${escapeHtml(q.stem)}</h5>`;
      const options = document.createElement('div');
      options.className = 'option-row';
      q.options.forEach((option, optIndex) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'secondary option-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => {
          if (item.dataset.done === 'true') {
            return;
          }
          item.dataset.done = 'true';
          const buttons = Array.from(options.querySelectorAll('button'));
          buttons.forEach((b, idx) => {
            b.disabled = true;
            if (idx === q.answer) {
              b.classList.add('correct');
            }
          });
          if (optIndex !== q.answer) {
            btn.classList.add('wrong');
            updateScore(0, 1);
            showFeedback(item, `Not quite. Hint: ${q.hint}`, 'bad');
          } else {
            updateScore(1, 1);
            showFeedback(item, 'Excellent. This version is more natural and exam-ready.', 'good');
          }
          renderProgress();
        });
        options.appendChild(btn);
      });
      item.appendChild(options);
      els.rewriteQuiz.appendChild(item);
    });
  }

  function showFeedback(container, message, tone) {
    let panel = container.querySelector('.feedback-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'feedback-panel';
      container.appendChild(panel);
    }
    panel.className = `feedback-panel ${tone}`;
    panel.textContent = message;
  }

  function renderTopicOptions() {
    els.topicSelect.innerHTML = Object.keys(topics).map((key) => `<option value="${key}">${escapeHtml(topics[key].title)}</option>`).join('');
    els.topicSelect.value = state.topicKey;
  }

  function setSelectableChip(container, items, type) {
    container.innerHTML = '';
    items.forEach((item) => {
      const chip = makeChip(item, () => {
        Array.from(container.querySelectorAll('.chip')).forEach((c) => c.classList.remove('selected'));
        chip.classList.add('selected');
        if (type === 'idea') {
          state.selectedIdea = item;
        } else if (type === 'phrase') {
          state.selectedPhrase = item;
        } else {
          state.selectedUpgrade = item;
        }
      });
      container.appendChild(chip);
    });
  }

  function renderPlanBuilder() {
    const slots = [
      ['Opening sentence', 'Introduce the topic clearly.'],
      ['Thesis / opinion', 'State your opinion directly.'],
      ['Reason 1', 'Add one main argument.'],
      ['Example / detail', 'Support the reason.'],
      ['Reason 2', 'Add another strong idea.'],
      ['Conclusion', 'Restate your opinion neatly.']
    ];
    els.planBuilder.innerHTML = slots.map(([title, prompt], index) => `
      <div class="plan-slot" data-slot="${index}">
        <strong>${escapeHtml(title)}</strong>
        <span class="soft">${escapeHtml(prompt)}</span>
        <div class="filled"></div>
      </div>
    `).join('');
  }

  function fillPlanFromTopic(topic) {
    const slots = Array.from(document.querySelectorAll('.plan-slot .filled'));
    const starter = {
      a2: [
        `Many people discuss whether ${topic.title.replace('Should ', '').replace('?', '')}.`,
        'In my opinion, this is a positive idea in many situations.',
        topic.ideas[0],
        'For example, it can make the experience fairer and less stressful.',
        topic.ideas[3] || topic.ideas[1],
        'To conclude, I believe the advantages are stronger than the disadvantages.'
      ],
      b1: [
        `Nowadays, many people wonder whether ${topic.title.charAt(0).toLowerCase()}${topic.title.slice(1)}`,
        'In my opinion, the best answer depends on fairness, efficiency, and real needs.',
        topic.ideas[0],
        'For instance, a quick and reasonable solution can improve trust and satisfaction.',
        topic.ideas[1],
        'Overall, I believe this idea can be effective if it is applied carefully.'
      ],
      b2: [
        `The question of whether ${topic.title.charAt(0).toLowerCase()}${topic.title.slice(1)}`,
        'In my view, the issue should be considered from both a practical and a human perspective.',
        topic.ideas[0],
        'This can have a significant impact on trust, efficiency, or long-term results.',
        topic.ideas[1],
        'Ultimately, a balanced and well-managed approach is far more effective than a simplistic one.'
      ]
    };
    starter[els.levelSelect.value].forEach((text, idx) => {
      if (slots[idx]) {
        slots[idx].textContent = text;
      }
    });
    updateScore(1, 1);
    renderProgress();
    showToast('Plan generated.');
  }

  function renderTopic() {
    const topic = topics[state.topicKey];
    els.essayPromptTitle.textContent = topic.title;
    els.essayPromptText.textContent = topic.prompt;
    setSelectableChip(els.ideaBank, topic.ideas, 'idea');
    setSelectableChip(els.phraseBank, topic.phrases, 'phrase');
    setSelectableChip(els.upgradeBank, topic.upgrades, 'upgrade');
    els.challengeCards.innerHTML = topic.challenge.map((item, idx) => `
      <article class="exam-card">
        <h5>Challenge ${idx + 1}</h5>
        <p>${escapeHtml(item)}</p>
      </article>
    `).join('') + challengePrompts.map((item) => `
      <article class="exam-card">
        <h5>${escapeHtml(item.title)}</h5>
        <p>${escapeHtml(item.text)}</p>
      </article>
    `).join('');
    renderReport();
  }

  function insertIntoDraft(text) {
    const area = els.draftArea;
    const start = area.selectionStart;
    const end = area.selectionEnd;
    const current = area.value;
    const before = current.slice(0, start);
    const after = current.slice(end);
    const prefix = before && !before.endsWith(' ') && !before.endsWith('\n') ? ' ' : '';
    area.value = `${before}${prefix}${text}${after}`;
    area.focus();
    const cursor = (before + prefix + text).length;
    area.setSelectionRange(cursor, cursor);
    renderProgress();
  }

  function getDraftStats(text) {
    const clean = text.trim();
    const words = clean ? clean.split(/\s+/).length : 0;
    const paragraphs = clean ? clean.split(/\n+/).filter(Boolean).length : 0;
    const lower = clean.toLowerCase();
    const connectorCount = connectors.filter((c) => lower.includes(c.toLowerCase().replace(',', ''))).length;
    const preciseWords = ['however', 'moreover', 'therefore', 'furthermore', 'ultimately', 'professional', 'fair', 'efficient', 'reputation', 'reasonable'];
    const upgradeCount = preciseWords.filter((w) => lower.includes(w)).length;
    return { words, paragraphs, connectorCount, upgradeCount };
  }

  function checkDraft() {
    const text = els.draftArea.value;
    const stats = getDraftStats(text);
    const topic = topics[state.topicKey];
    const issues = [];
    const strengths = [];
    let points = 0;
    let max = 5;

    if (stats.words >= 120) {
      strengths.push('Good length for a developed exam answer.');
      points += 1;
    } else {
      issues.push('Add more detail. Aim for at least 120 words for stronger development.');
    }

    if (stats.paragraphs >= 3) {
      strengths.push('Your text is divided into clear parts.');
      points += 1;
    } else {
      issues.push('Use clear paragraphs: introduction, body, conclusion.');
    }

    if (stats.connectorCount >= 4) {
      strengths.push('You used several connectors, which helps coherence.');
      points += 1;
    } else {
      issues.push('Use more connectors such as however, moreover, for example, and to conclude.');
    }

    if (/in my opinion|i believe|i think/i.test(text)) {
      strengths.push('Your opinion is clear.');
      points += 1;
    } else {
      issues.push('State your opinion clearly in the introduction.');
    }

    if (stats.upgradeCount >= 2 || /for example|for instance/i.test(text)) {
      strengths.push('You added detail and stronger language.');
      points += 1;
    } else {
      issues.push('Add one example or more precise vocabulary to gain points.');
    }

    updateScore(points, max);

    const level = els.levelSelect.value;
    const tone = points >= 4 ? 'good' : points >= 2 ? 'warn' : 'bad';
    const nextStep = level === 'a2'
      ? 'Next step: add one connector and one example sentence.'
      : level === 'b1'
        ? 'Next step: improve precision with stronger verbs and clearer topic sentences.'
        : 'Next step: add nuance, contrast, and one more sophisticated connector.';

    els.draftFeedback.className = `feedback-panel ${tone}`;
    els.draftFeedback.innerHTML = `
      <strong>Self-check result:</strong><br>
      Score for this draft: <strong>${points} / ${max}</strong><br><br>
      ${strengths.length ? `<strong>Strengths</strong><br>• ${strengths.join('<br>• ')}<br><br>` : ''}
      ${issues.length ? `<strong>To improve</strong><br>• ${issues.join('<br>• ')}<br><br>` : ''}
      <strong>Topic reminder:</strong> ${escapeHtml(topic.title)}<br>
      <strong>${nextStep}</strong>
    `;
    renderProgress();
  }

  function loadModelAnswer() {
    const topic = topics[state.topicKey];
    const text = topic.model[els.levelSelect.value];
    els.draftArea.value = text;
    showToast('Model answer inserted.');
    renderProgress();
  }

  function renderReport() {
    const topic = topics[state.topicKey];
    const stats = getDraftStats(els.draftArea.value);
    const checks = Array.from(document.querySelectorAll('.progress-check'));
    const checked = checks.filter((cb) => cb.checked).length;
    const slots = Array.from(document.querySelectorAll('.plan-slot .filled')).map((el) => el.textContent.trim()).filter(Boolean);
    els.reportOutput.textContent = [
      `Student: ${els.studentName.value.trim() || '—'}`,
      `Level target: ${els.levelSelect.options[els.levelSelect.selectedIndex].text}`,
      `Context: ${els.contextSelect.options[els.contextSelect.selectedIndex].text}`,
      `Topic: ${topic.title}`,
      `Global score: ${state.score} / ${state.maxScore}`,
      `Draft length: ${stats.words} words`,
      `Paragraphs: ${stats.paragraphs}`,
      `Connectors used: ${stats.connectorCount}`,
      `Checklist completed: ${checked} / ${checks.length}`,
      '',
      'Plan notes:',
      slots.length ? slots.map((line, idx) => `${idx + 1}. ${line}`).join('\n') : 'No plan yet.',
      '',
      'Next lesson focus:',
      '• stronger thesis sentence',
      '• clearer examples and details',
      '• more precise vocabulary',
      '• cleaner conclusion'
    ].join('\n');
  }

  function saveProgress() {
    const payload = {
      state,
      name: els.studentName.value,
      level: els.levelSelect.value,
      context: els.contextSelect.value,
      draft: els.draftArea.value,
      checks: Array.from(document.querySelectorAll('.progress-check')).map((cb) => cb.checked),
      plan: Array.from(document.querySelectorAll('.plan-slot .filled')).map((el) => el.textContent)
    };
    localStorage.setItem('speakeasy-essay-booster', JSON.stringify(payload));
    showToast('Progress saved.');
  }

  function loadProgress() {
    const raw = localStorage.getItem('speakeasy-essay-booster');
    if (!raw) {
      showToast('No saved progress found.');
      return;
    }
    try {
      const payload = JSON.parse(raw);
      Object.assign(state, payload.state || {});
      els.studentName.value = payload.name || '';
      els.levelSelect.value = payload.level || 'a2';
      els.contextSelect.value = payload.context || 'general';
      renderScore();
      renderTopicOptions();
      renderPlanBuilder();
      renderTopic();
      els.draftArea.value = payload.draft || '';
      Array.from(document.querySelectorAll('.progress-check')).forEach((cb, idx) => {
        cb.checked = Boolean((payload.checks || [])[idx]);
      });
      Array.from(document.querySelectorAll('.plan-slot .filled')).forEach((slot, idx) => {
        slot.textContent = (payload.plan || [])[idx] || '';
      });
      syncAccentUi();
      syncIpadMode();
      renderProgress();
      showToast('Progress loaded.');
    } catch (error) {
      showToast('Saved data could not be loaded.');
    }
  }

  function syncAccentUi() {
    Array.from(els.accentToggle.querySelectorAll('.seg')).forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.accent === state.accent);
    });
  }

  function syncIpadMode() {
    document.body.classList.toggle('ipad-mode', state.ipadMode);
    els.ipadModeBtn.textContent = `iPad friendly: ${state.ipadMode ? 'On' : 'Off'}`;
  }

  function setTimerDisplay() {
    const m = String(Math.floor(state.timerSeconds / 60)).padStart(2, '0');
    const s = String(state.timerSeconds % 60).padStart(2, '0');
    els.timerDisplay.textContent = `${m}:${s}`;
  }

  function stopTimer() {
    if (state.timerId) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
    state.timerRunning = false;
  }

  function startTimer() {
    if (state.timerRunning) {
      return;
    }
    state.timerRunning = true;
    state.timerId = window.setInterval(() => {
      if (state.timerSeconds <= 0) {
        stopTimer();
        showToast('Time is up. Read your conclusion and check connectors.');
        return;
      }
      state.timerSeconds -= 1;
      setTimerDisplay();
    }, 1000);
  }

  function addEvents() {
    document.querySelectorAll('.mini-example').forEach((el) => {
      el.addEventListener('click', () => copyText(el.dataset.copy || el.textContent || ''));
    });

    byId('copyConnectorsBtn').addEventListener('click', () => copyText(connectors.join(' ')));
    byId('newQuizBtn').addEventListener('click', renderQuiz);
    byId('loadTopicBtn').addEventListener('click', () => {
      state.topicKey = els.topicSelect.value;
      renderTopic();
      renderReport();
      showToast('Topic loaded.');
    });
    byId('newTopicBtn').addEventListener('click', () => {
      const keys = Object.keys(topics);
      const currentIndex = keys.indexOf(state.topicKey);
      state.topicKey = keys[(currentIndex + 1) % keys.length];
      els.topicSelect.value = state.topicKey;
      renderTopic();
      showToast('New topic ready.');
    });
    byId('insertIdeaBtn').addEventListener('click', () => {
      if (!state.selectedIdea) { showToast('Select one idea first.'); return; }
      insertIntoDraft(state.selectedIdea);
    });
    byId('insertPhraseBtn').addEventListener('click', () => {
      if (!state.selectedPhrase) { showToast('Select one phrase first.'); return; }
      insertIntoDraft(state.selectedPhrase);
    });
    byId('insertUpgradeBtn').addEventListener('click', () => {
      if (!state.selectedUpgrade) { showToast('Select one upgrade first.'); return; }
      insertIntoDraft(state.selectedUpgrade);
    });
    byId('autoPlanBtn').addEventListener('click', () => fillPlanFromTopic(topics[state.topicKey]));
    byId('clearPlanBtn').addEventListener('click', () => {
      Array.from(document.querySelectorAll('.plan-slot .filled')).forEach((el) => { el.textContent = ''; });
      renderProgress();
    });
    byId('checkDraftBtn').addEventListener('click', checkDraft);
    byId('modelBtn').addEventListener('click', loadModelAnswer);
    byId('listenDraftBtn').addEventListener('click', () => speakText(els.draftArea.value));
    byId('listenRecipeBtn').addEventListener('click', () => speakText(document.querySelector('#recipe').innerText));
    byId('copyDraftBtn').addEventListener('click', () => copyText(els.draftArea.value));
    byId('clearDraftBtn').addEventListener('click', () => {
      els.draftArea.value = '';
      els.draftFeedback.className = 'feedback-panel';
      els.draftFeedback.innerHTML = '';
      renderProgress();
    });
    byId('copyReportBtn').addEventListener('click', () => copyText(els.reportOutput.textContent));
    byId('saveProgressBtn').addEventListener('click', saveProgress);
    byId('loadProgressBtn').addEventListener('click', loadProgress);
    byId('printBtn').addEventListener('click', () => window.print());
    byId('resetScoreBtn').addEventListener('click', () => {
      state.score = 0;
      state.maxScore = 0;
      renderProgress();
      showToast('Score reset.');
    });
    els.draftArea.addEventListener('input', renderProgress);
    els.studentName.addEventListener('input', renderReport);
    els.levelSelect.addEventListener('change', () => {
      renderTopic();
      renderReport();
    });
    els.contextSelect.addEventListener('change', renderReport);
    Array.from(document.querySelectorAll('.progress-check')).forEach((cb) => cb.addEventListener('change', renderProgress));

    Array.from(els.accentToggle.querySelectorAll('.seg')).forEach((btn) => {
      btn.addEventListener('click', () => {
        state.accent = btn.dataset.accent;
        syncAccentUi();
        showToast(`Accent set to ${state.accent.toUpperCase()}.`);
      });
    });

    els.ipadModeBtn.addEventListener('click', () => {
      state.ipadMode = !state.ipadMode;
      syncIpadMode();
    });

    byId('timerStartBtn').addEventListener('click', startTimer);
    byId('timerPauseBtn').addEventListener('click', () => {
      stopTimer();
      showToast('Timer paused.');
    });
    byId('timerResetBtn').addEventListener('click', () => {
      stopTimer();
      state.timerSeconds = state.timerDefault;
      setTimerDisplay();
    });
    Array.from(document.querySelectorAll('[data-time]')).forEach((btn) => {
      btn.addEventListener('click', () => {
        stopTimer();
        state.timerDefault = Number(btn.dataset.time);
        state.timerSeconds = state.timerDefault;
        setTimerDisplay();
      });
    });
  }

  function init() {
    renderConnectors();
    renderCorrectionItems();
    renderQuiz();
    renderTopicOptions();
    renderPlanBuilder();
    renderTopic();
    syncAccentUi();
    syncIpadMode();
    setTimerDisplay();
    addEvents();
    renderProgress();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = function () {
        window.speechSynthesis.getVoices();
      };
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
