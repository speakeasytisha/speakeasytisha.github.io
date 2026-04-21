(function () {
  'use strict';

  var currentAccent = 'en-GB';
  var ukBtn = document.getElementById('accentUK');
  var usBtn = document.getElementById('accentUS');
  var stopBtn = document.getElementById('stopAudio');
  var voiceStatus = document.getElementById('voiceStatus');
  var synth = window.speechSynthesis;

  function setAccent(accent) {
    currentAccent = accent;
    var isUK = accent === 'en-GB';
    ukBtn.classList.toggle('active', isUK);
    usBtn.classList.toggle('active', !isUK);
    ukBtn.setAttribute('aria-pressed', String(isUK));
    usBtn.setAttribute('aria-pressed', String(!isUK));
    voiceStatus.textContent = 'Current accent: ' + (isUK ? 'British English' : 'American English') + '. Use the speaker buttons to hear the lesson content.';
  }

  function pickVoice(langPrefix) {
    if (!synth) {
      return null;
    }
    var voices = synth.getVoices();
    if (!voices || !voices.length) {
      return null;
    }
    var exact = voices.find(function (voice) { return voice.lang === langPrefix; });
    if (exact) { return exact; }
    var prefix = voices.find(function (voice) { return voice.lang && voice.lang.indexOf(langPrefix) === 0; });
    if (prefix) { return prefix; }
    var fallback = voices.find(function (voice) { return voice.lang && voice.lang.indexOf('en') === 0; });
    return fallback || null;
  }

  function speakText(text) {
    if (!synth || !text) {
      return;
    }
    synth.cancel();
    var utterance = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').trim());
    var voice = pickVoice(currentAccent);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = currentAccent;
    }
    utterance.rate = 0.95;
    utterance.pitch = 1;
    synth.speak(utterance);
  }

  ukBtn.addEventListener('click', function () { setAccent('en-GB'); });
  usBtn.addEventListener('click', function () { setAccent('en-US'); });
  stopBtn.addEventListener('click', function () {
    if (synth) { synth.cancel(); }
  });
  if (synth && typeof synth.onvoiceschanged !== 'undefined') {
    synth.onvoiceschanged = function () { pickVoice(currentAccent); };
  }

  document.querySelectorAll('.speak-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetSelector = btn.getAttribute('data-speak-target');
      var directText = btn.getAttribute('data-speak-text');
      if (directText) {
        speakText(directText);
        return;
      }
      if (targetSelector) {
        var target = document.querySelector(targetSelector);
        if (target) {
          speakText(target.textContent || target.innerText || '');
        }
      }
    });
  });

  document.querySelectorAll('.accordion-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.nextElementSibling;
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      btn.querySelector('.accordion-symbol').textContent = expanded ? '＋' : '−';
      if (expanded) {
        panel.hidden = true;
      } else {
        panel.hidden = false;
      }
    });
  });

  var checks = Array.prototype.slice.call(document.querySelectorAll('.mission-check'));
  var checklistScore = document.getElementById('checklistScore');
  var checklistScoreFooter = document.getElementById('checklistScoreFooter');

  function updateChecklistScore() {
    var checked = checks.filter(function (box) { return box.checked; }).length;
    var text = checked + ' / ' + checks.length;
    checklistScore.textContent = text;
    checklistScoreFooter.textContent = text;
  }

  checks.forEach(function (box) {
    box.addEventListener('change', updateChecklistScore);
  });
  updateChecklistScore();

  var guideQuizData = [
    {
      q: 'How early should you connect before the LILATE exam?',
      qFr: 'Combien de temps avant l’examen LILATE devez-vous vous connecter ?',
      a: ['10 minutes early', 'Exactly on time', '30 seconds early'],
      aFr: ['10 minutes en avance', 'Exactement à l’heure', '30 secondes en avance'],
      correct: 0,
      explain: 'You should connect 10 minutes early to test your equipment and join the room calmly.',
      explainFr: 'Vous devez vous connecter 10 minutes avant pour tester votre matériel et rejoindre la salle calmement.'
    },
    {
      q: 'What is Part 1 mainly about?',
      qFr: 'Sur quoi porte principalement la partie 1 ?',
      a: ['Welcoming and interacting professionally', 'Writing a long essay', 'Studying complex grammar charts'],
      aFr: ['Accueillir et interagir de façon professionnelle', 'Écrire une longue dissertation', 'Étudier des tableaux de grammaire complexes'],
      correct: 0,
      explain: 'Part 1 focuses on welcoming, introducing yourself, identifying needs, and interacting clearly.',
      explainFr: 'La partie 1 porte sur l’accueil, la présentation de soi, l’identification des besoins et une interaction claire.'
    },
    {
      q: 'In Part 2, what do you need to do well?',
      qFr: 'Dans la partie 2, que devez-vous bien savoir faire ?',
      a: ['Gather key information and reformulate clearly', 'Speak for 20 minutes without stopping', 'Memorize difficult idioms'],
      aFr: ['Recueillir les informations clés et reformuler clairement', 'Parler pendant 20 minutes sans s’arrêter', 'Mémoriser des expressions idiomatiques difficiles'],
      correct: 0,
      explain: 'Part 2 is about understanding requests, collecting details, and checking meaning.',
      explainFr: 'La partie 2 consiste à comprendre des demandes, recueillir des détails et vérifier le sens.'
    },
    {
      q: 'Why is Step 2 in your roadmap important?',
      qFr: 'Pourquoi l’étape 2 de votre feuille de route est-elle importante ?',
      a: ['Because strong basics help you speak more clearly and confidently', 'Because grammar is more important than communication', 'Because you only need to learn spelling'],
      aFr: ['Parce que de bonnes bases vous aident à parler plus clairement et avec plus d’assurance', 'Parce que la grammaire est plus importante que la communication', 'Parce que vous avez seulement besoin d’apprendre l’orthographe'],
      correct: 0,
      explain: 'Strong basics give you control, which helps you respond better in real exam situations.',
      explainFr: 'De bonnes bases vous donnent plus de maîtrise, ce qui vous aide à mieux répondre dans de vraies situations d’examen.'
    },
    {
      q: 'What is the goal in Part 4?',
      qFr: 'Quel est l’objectif dans la partie 4 ?',
      a: ['Understand the main idea of a support and use the information', 'Translate every word perfectly', 'Read silently without answering'],
      aFr: ['Comprendre l’idée principale d’un support et utiliser les informations', 'Traduire chaque mot parfaitement', 'Lire en silence sans répondre'],
      correct: 0,
      explain: 'Part 4 is about extracting the essential information from a text, audio, video, or visual.',
      explainFr: 'La partie 4 consiste à extraire les informations essentielles d’un texte, d’un audio, d’une vidéo ou d’un support visuel.'
    },
    {
      q: 'What kind of English do you need for success?',
      qFr: 'De quel type d’anglais avez-vous besoin pour réussir ?',
      a: ['Clear, useful, professional English', 'Perfect English with no mistakes', 'Only very formal English'],
      aFr: ['Un anglais clair, utile et professionnel', 'Un anglais parfait sans aucune faute', 'Uniquement un anglais très formel'],
      correct: 0,
      explain: 'The goal is clear and effective professional communication, not perfection.',
      explainFr: 'L’objectif est une communication professionnelle claire et efficace, pas la perfection.'
    }
  ];

  var guideQuestion = document.getElementById('guideQuestion');
  var guideQuestionFr = document.getElementById('guideQuestionFr');
  var guideOptions = document.getElementById('guideOptions');
  var guideFeedback = document.getElementById('guideFeedback');
  var guideQuestionNumber = document.getElementById('guideQuestionNumber');
  var nextGuideQuestion = document.getElementById('nextGuideQuestion');
  var resetGuideQuiz = document.getElementById('resetGuideQuiz');
  var listenGuideQuestion = document.getElementById('listenGuideQuestion');
  var guideIndex = 0;
  var guideLocked = false;

  function shuffleAnswers(questionObj) {
    var items = questionObj.a.map(function (answer, index) {
      return { text: answer, textFr: questionObj.aFr[index], isCorrect: index === questionObj.correct };
    });
    for (var i = items.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    return items;
  }

  function renderGuideQuestion() {
    var item = guideQuizData[guideIndex];
    item.shuffled = shuffleAnswers(item);
    guideLocked = false;
    guideQuestionNumber.textContent = 'Question ' + (guideIndex + 1) + ' / ' + guideQuizData.length;
    guideQuestion.textContent = item.q;
    guideQuestionFr.textContent = item.qFr;
    guideOptions.innerHTML = '';
    guideFeedback.textContent = '';
    guideFeedback.className = 'feedback';

    item.shuffled.forEach(function (option) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-btn';
      button.innerHTML = '<span>' + option.text + '</span><span class="fr-note">' + option.textFr + '</span>';
      button.addEventListener('click', function () {
        if (guideLocked) { return; }
        guideLocked = true;
        var correctButton;
        Array.prototype.forEach.call(guideOptions.children, function (child, idx) {
          if (item.shuffled[idx].isCorrect) {
            correctButton = child;
          }
        });
        if (option.isCorrect) {
          button.classList.add('correct');
          guideFeedback.innerHTML = 'Correct! ' + item.explain + '<div class="fr-note">' + item.explainFr + '</div>';
          guideFeedback.className = 'feedback success';
        } else {
          button.classList.add('incorrect');
          if (correctButton) { correctButton.classList.add('correct'); }
          guideFeedback.innerHTML = 'Not quite. ' + item.explain + '<div class="fr-note">' + item.explainFr + '</div>';
          guideFeedback.className = 'feedback error';
        }
      });
      guideOptions.appendChild(button);
    });
  }

  nextGuideQuestion.addEventListener('click', function () {
    guideIndex = (guideIndex + 1) % guideQuizData.length;
    renderGuideQuestion();
  });

  resetGuideQuiz.addEventListener('click', function () {
    guideIndex = 0;
    renderGuideQuestion();
  });

  listenGuideQuestion.addEventListener('click', function () {
    var item = guideQuizData[guideIndex];
    var joined = item.q + ' ' + item.shuffled.map(function (opt, idx) {
      return 'Option ' + (idx + 1) + '. ' + opt.text + '.';
    }).join(' ');
    speakText(joined);
  });

  renderGuideQuestion();

  var copyPromise = document.getElementById('copyPromise');
  var promiseText = document.getElementById('promiseText');
  var copyFeedback = document.getElementById('copyFeedback');

  copyPromise.addEventListener('click', function () {
    var text = promiseText.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        copyFeedback.textContent = 'Copied to clipboard.';
      }).catch(function () {
        copyFeedback.textContent = 'Copy not available on this device.';
      });
    } else {
      copyFeedback.textContent = 'Copy not available on this device.';
    }
  });

  setAccent('en-GB');
})();
