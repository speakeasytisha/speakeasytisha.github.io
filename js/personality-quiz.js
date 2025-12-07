(function () {
  const root = document.getElementById('personalityPage');
  if (!root) return;

  /* ---------- LESSON – CLICKABLE WORDS ---------- */
  const wordPills = root.querySelectorAll('.pers-pill');
  const myWordsBox = root.querySelector('#persMyWordsText');
  const selectedWords = new Set();

  function updateMyWords() {
    if (!myWordsBox) return;
    if (selectedWords.size === 0) {
      myWordsBox.textContent = 'Click on some words above to add them here.';
      return;
    }
    myWordsBox.textContent = Array.from(selectedWords).join(', ');
  }

  wordPills.forEach(p => {
    p.addEventListener('click', () => {
      const word = p.getAttribute('data-pers-word') || p.textContent.trim();
      if (p.classList.contains('pers-selected')) {
        p.classList.remove('pers-selected');
        selectedWords.delete(word);
      } else {
        p.classList.add('pers-selected');
        selectedWords.add(word);
      }
      updateMyWords();
    });
  });

  /* ---------- MINI INTRO BUILDER ---------- */
  const introName = root.querySelector('#persName');
  const introMain = root.querySelector('#persMainTrait');
  const introSecond = root.querySelector('#persSecondTrait');
  const introHobby = root.querySelector('#persHobby');
  const introOutput = root.querySelector('#persIntroOutput');

  function buildIntro() {
    if (!introOutput) return;
    const name = (introName && introName.value.trim()) || 'I';
    const m = introMain ? introMain.value : '';
    const s = introSecond ? introSecond.value : '';
    const h = introHobby ? introHobby.value : '';

    const subject = name === 'I' ? 'I' : 'Hi, I\'m ' + name;
    let text;

    if (name === 'I') {
      text = 'Hi, I\'m ' + name + '. ';
    } else {
      text = subject + '. ';
    }

    if (m || s) {
      text += 'I\'m quite ' + m;
      if (s) text += ' and a bit ' + s;
      text += '. ';
    }
    if (h) {
      text += 'In my free time, I\'m into ' + h + '.';
    }

    introOutput.textContent = text || 'Your introduction will appear here…';
  }

  [introName, introMain, introSecond, introHobby].forEach(el => {
    if (!el) return;
    const evt = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(evt, buildIntro);
  });
  buildIntro();

  /* ---------- QUIZ – ANSWER SELECTION ---------- */
  const questions = root.querySelectorAll('.pers-question');

  questions.forEach(q => {
    const options = q.querySelectorAll('.pers-option');
    options.forEach(btn => {
      btn.addEventListener('click', () => {
        options.forEach(b => b.classList.remove('pers-answer-selected'));
        btn.classList.add('pers-answer-selected');
      });
    });
  });

  /* ---------- PERSONALITY RESULT LOGIC ---------- */
  const seeResultBtn = root.querySelector('#persSeeResultBtn');
  const resultTypeEl = root.querySelector('#persResultType');
  const resultDescEl = root.querySelector('#persResultDesc');
  const resultTagsEl = root.querySelector('#persResultTags');
  const compatTextEl = root.querySelector('#persCompatText');
  const compatTagsEl = root.querySelector('#persCompatTags');

  let userType = '';      // explorer / planner / connector / dreamer
  let lastResultText = ''; // for audio and match section

  function getScores() {
    const scores = {
      explorer: 0,
      planner: 0,
      connector: 0,
      dreamer: 0
    };
    let missing = 0;

    questions.forEach(q => {
      const selected = q.querySelector('.pers-option.pers-answer-selected');
      if (!selected) {
        missing++;
        return;
      }
      const t = selected.getAttribute('data-type');
      if (scores[t] !== undefined) {
        scores[t]++;
      }
    });

    return { scores, missing };
  }

  function describeType(type) {
    switch (type) {
      case 'explorer':
        return {
          label: 'Explorer',
          emoji: '🌍',
          desc:
            'You love new experiences, ideas and places. You enjoy trying different activities, meeting new people and ' +
            'you are often open to last-minute adventures. Routine can feel boring for you.',
          tags: ['curious', 'energetic', 'spontaneous', 'adventurous']
        };
      case 'planner':
        return {
          label: 'Planner',
          emoji: '📋',
          desc:
            'You like to feel prepared and organized. You usually think before you act, and people can count on you. ' +
            'You often plan trips, projects or homework carefully, which helps you feel calm and in control.',
          tags: ['organized', 'reliable', 'practical', 'responsible']
        };
      case 'connector':
        return {
          label: 'Connector',
          emoji: '🤝',
          desc:
            'Relationships are very important for you. You enjoy talking, listening and supporting people. ' +
            'You often notice how others feel and try to create a good atmosphere at home, at work or with friends.',
          tags: ['friendly', 'empathetic', 'supportive', 'sociable']
        };
      case 'dreamer':
        return {
          label: 'Dreamer',
          emoji: '🌙',
          desc:
            'You have a rich inner world. You like to think, imagine and create. You may need quiet time alone to recharge. ' +
            'You often bring original ideas, artistic talent or a different point of view.',
          tags: ['creative', 'thoughtful', 'intuitive', 'imaginative']
        };
      default:
        return null;
    }
  }

  function describeCompat(type) {
    switch (type) {
      case 'explorer':
        return {
          text:
            'Explorers often get along well with Connectors (for fun social adventures) and Planners (who help them stay ' +
            'grounded and safe). Another Explorer can be exciting — but sometimes a bit chaotic!',
          tags: ['Connector 🤝', 'Planner 📋', 'Other Explorers 🌍 (in small doses)']
        };
      case 'planner':
        return {
          text:
            'Planners often appreciate Connectors (who bring warmth and people) and Explorers (who push them to try new ' +
            'things, step by step). A Dreamer can also be inspiring if there is clear communication.',
          tags: ['Connector 🤝', 'Explorer 🌍', 'Dreamer 🌙 (with clear boundaries)']
        };
      case 'connector':
        return {
          text:
            'Connectors usually enjoy people from all types, but they can feel especially comfortable with Planners ' +
            '(for stability) and Dreamers (for deep conversations). Explorers can bring extra fun.',
          tags: ['Planner 📋', 'Dreamer 🌙', 'Explorer 🌍']
        };
      case 'dreamer':
        return {
          text:
            'Dreamers often feel good with Connectors (who understand their feelings) and Planners (who help them turn ' +
            'ideas into reality). Another Dreamer can feel very safe and creative, if you also take action.',
          tags: ['Connector 🤝', 'Planner 📋', 'Other Dreamers 🌙']
        };
      default:
        return {
          text: 'Answer the quiz to see which types you might connect with most easily.',
          tags: []
        };
    }
  }

  if (seeResultBtn) {
    seeResultBtn.addEventListener('click', () => {
      const { scores, missing } = getScores();
      if (missing > 0) {
        alert('Please answer all the questions before seeing your result.');
        return;
      }

      let bestType = '';
      let bestScore = -1;
      for (const t in scores) {
        if (scores[t] > bestScore) {
          bestScore = scores[t];
          bestType = t;
        }
      }

      userType = bestType;

      const info = describeType(bestType);
      if (!info) return;

      const label = info.emoji + ' ' + info.label;
      resultTypeEl.textContent = label;
      resultDescEl.textContent = info.desc;

      resultTagsEl.innerHTML = '';
      info.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'pers-tag';
        span.textContent = tag;
        resultTagsEl.appendChild(span);
      });

      const compat = describeCompat(bestType);
      compatTextEl.textContent = compat.text;
      compatTagsEl.innerHTML = '';
      compat.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'pers-tag';
        span.textContent = tag;
        compatTagsEl.appendChild(span);
      });

      lastResultText =
        'Your main personality profile in this game is: ' +
        info.label +
        '. ' +
        info.desc +
        ' In general, you might get along well with: ' +
        compat.tags.join(', ') +
        '.';
    });
  }

  /* ---------- AUDIO (RESULT + MATCH) ---------- */
  const audioBtns = root.querySelectorAll('[data-pers-audio]');
  let utterance = null;
  let warnedSpeech = false;
  let lastMatchText = '';

  function speak(action) {
    if (!('speechSynthesis' in window)) {
      if (!warnedSpeech) {
        warnedSpeech = true;
        alert('Your browser does not support speech synthesis. The audio buttons may not work.');
      }
      return;
    }
    const synth = window.speechSynthesis;

    const combinedText =
      (lastResultText || 'This is your personality result.') +
      ' ' +
      (lastMatchText || '');

    if (action === 'play') {
      if (synth.paused) {
        synth.resume();
        return;
      }
      synth.cancel();
      utterance = new SpeechSynthesisUtterance(combinedText);
      utterance.lang = 'en-US';
      synth.speak(utterance);
    } else if (action === 'pause') {
      synth.pause();
    } else if (action === 'restart') {
      synth.cancel();
      utterance = new SpeechSynthesisUtterance(combinedText);
      utterance.lang = 'en-US';
      synth.speak(utterance);
    }
  }

  audioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-pers-audio');
      speak(action);
    });
  });

  /* ---------- MATCH QUESTIONNAIRE ---------- */
  const mEnergy = root.querySelector('#persMatchEnergy');
  const mPlans = root.querySelector('#persMatchPlans');
  const mTalk = root.querySelector('#persMatchTalk');
  const mFreeTime = root.querySelector('#persMatchFreeTime');
  const mSupport = root.querySelector('#persMatchSupport');
  const mSelfType = root.querySelector('#persSelfType');
  const mBtn = root.querySelector('#persMatchBtn');

  const mTypeEl = root.querySelector('#persMatchType');
  const mDescEl = root.querySelector('#persMatchDesc');
  const mComboEl = root.querySelector('#persMatchCombo');

  function computeMatchScores() {
    const scores = {
      explorer: 0,
      planner: 0,
      connector: 0,
      dreamer: 0
    };

    [mEnergy, mPlans, mTalk, mFreeTime, mSupport].forEach(sel => {
      if (!sel) return;
      const val = sel.value;
      if (scores[val] !== undefined) scores[val]++;
    });

    let bestType = '';
    let bestScore = -1;
    for (const t in scores) {
      if (scores[t] > bestScore) {
        bestScore = scores[t];
        bestType = t;
      }
    }
    return bestType;
  }

  function describeMatchType(type) {
    switch (type) {
      case 'explorer':
        return {
          label: 'Adventurous partner (Explorer-type)',
          desc:
            'Your ideal match enjoys movement, new experiences and a bit of risk. This person pushes you gently out of your comfort zone and keeps life dynamic. ' +
            'They like spontaneous trips, trying new food or activities, and they usually bring a lot of energy to the relationship.'
        };
      case 'planner':
        return {
          label: 'Calm anchor (Planner-type)',
          desc:
            'Your ideal match is stable, organized and reliable. This person helps you feel safe and supported. ' +
            'They prefer clear plans and practical solutions, and they are often very good at managing money, time or projects.'
        };
      case 'connector':
        return {
          label: 'Warm connector (Connector-type)',
          desc:
            'Your ideal match is social, empathetic and emotionally intelligent. This person cares about people and relationships, ' +
            'loves good conversations and often takes care of the “social side” of life – family, friends, special moments.'
        };
      case 'dreamer':
        return {
          label: 'Creative soul (Dreamer-type)',
          desc:
            'Your ideal match is imaginative and sensitive. This person likes deep conversations, creativity and quiet moments together. ' +
            'They may express themselves through art, ideas, writing or music, and they appreciate someone who respects their inner world.'
        };
      default:
        return {
          label: 'Your ideal match',
          desc: 'Answer the questions above to get a description of your ideal match.'
        };
    }
  }

  function combineTypes(selfT, matchT) {
    if (!selfT && !matchT) {
      return 'When you finish the test and the match questionnaire, you\'ll see how your type and your ideal match can work together.';
    }
    if (!matchT) {
      return 'We know your own type, but not your ideal match yet. Complete the match questionnaire to see the combination.';
    }
    if (!selfT) {
      return 'We know your ideal match, but not your own type yet. Do the personality quiz or choose your type from the dropdown.';
    }

    const pair = selfT + '-' + matchT;

    switch (pair) {
      case 'explorer-planner':
      case 'planner-explorer':
        return 'Explorer + Planner: a classic “adventure and safety” team. One brings ideas and energy, the other brings structure and stability. You just need to communicate about plans and last-minute changes.';
      case 'explorer-connector':
      case 'connector-explorer':
        return 'Explorer + Connector: very social and fun together. You can have great experiences with friends, travel and parties. Remember to also keep some quiet time to rest.';
      case 'planner-connector':
      case 'connector-planner':
        return 'Planner + Connector: warm and stable. One keeps life organized, the other keeps relationships strong. It\'s a good combination for building a home or long-term projects.';
      case 'dreamer-connector':
      case 'connector-dreamer':
        return 'Dreamer + Connector: deep conversations and emotional support. One brings imagination, the other brings empathy. Make sure you also take action on your ideas!';
      case 'dreamer-planner':
      case 'planner-dreamer':
        return 'Dreamer + Planner: ideas and structure. One imagines possibilities, the other helps to organize them. You might need to negotiate between flexibility and planning.';
      case 'dreamer-explorer':
      case 'explorer-dreamer':
        return 'Dreamer + Explorer: inspiration and adventure. One likes to imagine and reflect, the other likes to move and explore. Balance quiet time and activity so both feel comfortable.';
      default:
        return 'Two people with these types can complement each other in different ways. The most important thing is communication, respect and a bit of humour.';
    }
  }

  if (mBtn) {
    mBtn.addEventListener('click', () => {
      const matchType = computeMatchScores();
      const info = describeMatchType(matchType);
      mTypeEl.textContent = info.label;
      mDescEl.textContent = info.desc;

      // Decide self type: dropdown > quiz result
      let selfType = mSelfType && mSelfType.value;
      if (!selfType && userType) selfType = userType;

      const comboText = combineTypes(selfType, matchType);
      mComboEl.textContent = comboText;

      lastMatchText =
        ' Your ideal match in this game is described as: ' +
        info.label +
        '. ' +
        info.desc +
        ' ' +
        comboText;
    });
  }
})();
