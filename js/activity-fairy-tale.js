(function () {
  const root = document.getElementById('fairyTaleActivity');
  if (!root) return;

    /* ---------- SUMMARY AUDIO (ENGLISH / US VOICE) ---------- */
  const summaryTextEl = document.getElementById('ftSummaryText');
  const summaryButtons = root.querySelectorAll('[data-ft-summary-audio]');
  let summaryUtterance = null;
  let summaryWarned = false;
  let ftVoice = null;

  // Try to pick an American English voice
  function pickFtVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || !voices.length) return;

    // 1) Prefer explicit en-US
    ftVoice =
      voices.find(v => v.lang === 'en-US') ||
      // 2) Any English voice
      voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en-')) ||
      null;
  }

  if ('speechSynthesis' in window) {
    pickFtVoice();
    window.speechSynthesis.onvoiceschanged = pickFtVoice;
  }

  function handleSummaryAudio(action) {
    if (!('speechSynthesis' in window)) {
      if (!summaryWarned) {
        summaryWarned = true;
        alert('Your browser does not support speech synthesis. The audio buttons may not work.');
      }
      return;
    }
    const synth = window.speechSynthesis;

    if (action === 'play') {
      if (synth.paused && synth.speaking) {
        synth.resume();
        return;
      }
      if (!summaryTextEl) return;
      const text = summaryTextEl.textContent || '';
      if (!text.trim()) return;
      synth.cancel();
      summaryUtterance = new SpeechSynthesisUtterance(text);
      summaryUtterance.lang = 'en-US'; // make sure
      if (ftVoice) summaryUtterance.voice = ftVoice;
      synth.speak(summaryUtterance);
    } else if (action === 'pause') {
      synth.pause();
    } else if (action === 'restart') {
      if (!summaryTextEl) return;
      const text = summaryTextEl.textContent || '';
      if (!text.trim()) return;
      synth.cancel();
      summaryUtterance = new SpeechSynthesisUtterance(text);
      summaryUtterance.lang = 'en-US';
      if (ftVoice) summaryUtterance.voice = ftVoice;
      synth.speak(summaryUtterance);
    }
  }

  summaryButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const action = btn.getAttribute('data-ft-summary-audio');
      handleSummaryAudio(action);
    });
  });


  /* ---------- GENERIC QUIZ HANDLER ---------- */

  function setupQuiz(quizId) {
    const quiz = document.getElementById(quizId);
    if (!quiz) return;
    const questions = quiz.querySelectorAll('.ft-question');

    questions.forEach(function (q) {
      const buttons = q.querySelectorAll('.ft-answers button');
      const select = q.querySelector('select');
      const feedback = q.querySelector('.ft-feedback');
      const explanation = q.getAttribute('data-explanation') || '';

      if (buttons.length) {
        // Multiple-choice with buttons
        buttons.forEach(function (btn) {
          btn.addEventListener('click', function () {
            buttons.forEach(function (b) {
              b.classList.remove('correct', 'incorrect');
            });
            if (feedback) {
              feedback.classList.remove('correct', 'incorrect');
            }

            const isCorrect = btn.getAttribute('data-correct') === 'true';
            q.dataset.isCorrect = isCorrect ? 'true' : 'false';

            if (isCorrect) {
              btn.classList.add('correct');
              if (feedback) {
                feedback.textContent = '✅ Correct! ' + explanation;
                feedback.classList.add('correct');
              }
            } else {
              btn.classList.add('incorrect');
              if (feedback) {
                feedback.textContent = '❌ Not quite. ' + explanation;
                feedback.classList.add('incorrect');
              }
            }
          });
        });
      } else if (select) {
        // Dropdown questions
        select.addEventListener('change', function () {
          if (feedback) {
            feedback.classList.remove('correct', 'incorrect');
          }
          select.classList.remove('correct', 'incorrect');

          const correctValue = select.getAttribute('data-correct');
          const value = select.value;

          if (!value) {
            q.dataset.isCorrect = '';
            if (feedback) {
              feedback.textContent = '';
            }
            return;
          }

          const isCorrect = value === correctValue;
          q.dataset.isCorrect = isCorrect ? 'true' : 'false';

          if (isCorrect) {
            select.classList.add('correct');
            if (feedback) {
              feedback.textContent = '✅ Correct! ' + explanation;
              feedback.classList.add('correct');
            }
          } else {
            select.classList.add('incorrect');
            if (feedback) {
              feedback.textContent = '❌ Not quite. ' + explanation;
              feedback.classList.add('incorrect');
            }
          }
        });
      }
    });
  }

  function checkQuizScore(quizId) {
    const quiz = document.getElementById(quizId);
    if (!quiz) return;
    const questions = quiz.querySelectorAll('.ft-question');
    const scoreBox = quiz.querySelector('.ft-score');
    let total = questions.length;
    let correct = 0;

    questions.forEach(function (q) {
      if (q.dataset.isCorrect === 'true') correct++;
    });

    if (scoreBox) {
      scoreBox.textContent = 'Your score: ' + correct + ' / ' + total;
    }
  }

  function resetQuiz(quizId) {
    const quiz = document.getElementById(quizId);
    if (!quiz) return;
    const questions = quiz.querySelectorAll('.ft-question');
    const scoreBox = quiz.querySelector('.ft-score');

    questions.forEach(function (q) {
      q.dataset.isCorrect = '';
      const buttons = q.querySelectorAll('.ft-answers button');
      const select = q.querySelector('select');
      const feedback = q.querySelector('.ft-feedback');

      buttons.forEach(function (b) {
        b.classList.remove('correct', 'incorrect');
      });

      if (select) {
        select.value = '';
        select.classList.remove('correct', 'incorrect');
      }
      if (feedback) {
        feedback.textContent = '';
        feedback.classList.remove('correct', 'incorrect');
      }
    });

    if (scoreBox) {
      scoreBox.textContent = '';
    }
  }

  setupQuiz('ft-quiz-summary');
  setupQuiz('ft-quiz-characters');

  root.querySelectorAll('[data-quiz-check]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const quizId = btn.getAttribute('data-quiz-check');
      checkQuizScore(quizId);
    });
  });

  root.querySelectorAll('[data-quiz-reset]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const quizId = btn.getAttribute('data-quiz-reset');
      resetQuiz(quizId);
    });
  });

  /* ---------- OPINION PARAGRAPH BUILDER ---------- */

  const nameInput = root.querySelector('#ftStudentName');
  const progressSelect = root.querySelector('#ftReadingProgress');
  const feelingSelect = root.querySelector('#ftOverallFeeling');
  const favCharacterSelect = root.querySelector('#ftFavoriteCharacter');
  const favReasonInput = root.querySelector('#ftFavoriteReason');
  const favReasonSuggest = root.querySelector('#ftFavoriteReasonSuggestions');
  const notLikeInput = root.querySelector('#ftNotLike');
  const notLikeSuggest = root.querySelector('#ftNotLikeSuggestions');
  const recommendSelect = root.querySelector('#ftRecommendTo');
  const adjectiveCheckboxes = root.querySelectorAll('[data-ft-adjective]');

  const basicOutput = root.querySelector('#ftOutputBasic');
  const midOutput = root.querySelector('#ftOutputMid');
  const advOutput = root.querySelector('#ftOutputAdvanced');

  function clean(text) {
    return (text || '').trim();
  }

  function joinAdjectives(list) {
    if (!list.length) return '';
    if (list.length === 1) return list[0];
    if (list.length === 2) return list[0] + ' and ' + list[1];
    const last = list[list.length - 1];
    return list.slice(0, -1).join(', ') + ' and ' + last;
  }

  // Turn "he is nice." or "Because he is nice" into "because he is nice"
  function normalizeReasonFragment(text) {
    let t = clean(text);
    if (!t) return '';

    // Remove "because" if student wrote it
    t = t.replace(/^[Bb]ecause\s+/, '');
    // Remove final punctuation
    t = t.replace(/[.!?]+$/, '');
    if (!t) return '';

    // Start with lowercase (we put "because" before)
    t = t.charAt(0).toLowerCase() + t.slice(1);

    return 'because ' + t;
  }

  // Turn "some things are boring." into a fragment for "I don't like that ..."
  function normalizeIssueFragment(text) {
    let t = clean(text);
    if (!t) return '';
    // Remove final punctuation
    t = t.replace(/[.!?]+$/, '');
    if (!t) return '';
    // Lowercase first letter because we add our own sentence beginning
    t = t.charAt(0).toLowerCase() + t.slice(1);
    return t;
  }

  function buildOpinionParagraphs() {
    if (!basicOutput || !midOutput || !advOutput) return;

    const name = clean(nameInput && nameInput.value);
    const progress = clean(progressSelect && progressSelect.value);
    const feeling = clean(feelingSelect && feelingSelect.value);
    const favCharacter = clean(favCharacterSelect && favCharacterSelect.value);
    const favReasonRaw = clean(favReasonInput && favReasonInput.value);
    const notLikeRaw = clean(notLikeInput && notLikeInput.value);
    const recommend = clean(recommendSelect && recommendSelect.value);

    const adjectives = [];
    adjectiveCheckboxes.forEach(function (ch) {
      if (ch.checked) {
        const word = ch.getAttribute('data-ft-adjective') || ch.value;
        if (word) adjectives.push(word);
      }
    });

    const favReason = normalizeReasonFragment(favReasonRaw);
    const issue = normalizeIssueFragment(notLikeRaw);

    /* BASIC VERSION – short & clear */
    const basicSentences = [];

    if (name) {
      basicSentences.push("Hi, I'm " + name + ".");
    }
    basicSentences.push("I'm reading Fairy Tale by Stephen King.");

    if (progress) basicSentences.push(progress);
    if (feeling) basicSentences.push(feeling);

    if (favCharacter && favCharacter !== 'none') {
      let sentence = 'My favorite character is ' + favCharacter;
      if (favReason) {
        sentence += ' ' + favReason;
      }
      sentence += '.';
      basicSentences.push(sentence);
    }

    if (adjectives.length) {
      basicSentences.push('For me, the story is ' + joinAdjectives(adjectives) + '.');
    }

    if (issue) {
      basicSentences.push("I don't like that " + issue + '.');
    }

    if (recommend) {
      basicSentences.push('I would recommend this book to ' + recommend + '.');
    }

    const basicText = basicSentences.join(' ');
    basicOutput.textContent =
      basicText || 'Fill in the form above to create a simple paragraph about the book.';

    /* INTERMEDIATE VERSION – more natural */
    const midSentences = [];

    if (name) {
      midSentences.push(
        "Hi, I'm " + name + " and I'm reading Fairy Tale by Stephen King at the moment."
      );
    } else {
      midSentences.push("I'm reading Fairy Tale by Stephen King at the moment.");
    }

    if (progress) midSentences.push('Right now, ' + progress);
    if (feeling) midSentences.push('Overall, ' + feeling);

    if (favCharacter && favCharacter !== 'none') {
      if (favReason) {
        midSentences.push('My favorite character is ' + favCharacter + ' ' + favReason + '.');
      } else {
        midSentences.push('My favorite character is ' + favCharacter + '.');
      }
    }

    if (adjectives.length) {
      midSentences.push('The story feels ' + joinAdjectives(adjectives) + ' to me.');
    }

    if (issue) {
      midSentences.push("However, I don't really like the fact that " + issue + '.');
    }

    if (recommend) {
      midSentences.push('In the end, I would recommend this book to ' + recommend + '.');
    }

    const midText = midSentences.join(' ');
    midOutput.textContent =
      midText || 'Your intermediate paragraph will appear here when you add more information.';

    /* ADVANCED VERSION – rich & fluid */
    const advSentences = [];

    if (name) {
      advSentences.push(
        "Hi, I'm " +
          name +
          ", and over the last few weeks I've been reading Fairy Tale by Stephen King, a dark fantasy novel."
      );
    } else {
      advSentences.push(
        "Over the last few weeks I've been reading Fairy Tale by Stephen King, a dark fantasy novel."
      );
    }

    if (progress) {
      advSentences.push('At the moment, ' + progress.toLowerCase());
    }

    if (feeling) {
      advSentences.push('So far, ' + feeling.toLowerCase());
    }

    if (adjectives.length) {
      advSentences.push(
        'For me, the story is ' +
          joinAdjectives(adjectives) +
          ', and the atmosphere is very strong from the first chapters.'
      );
    }

    if (favCharacter && favCharacter !== 'none') {
      let reasonPart = favReason || 'because I find this character interesting and believable';
      advSentences.push(
        'My favorite character at the moment is ' +
          favCharacter +
          ', mainly ' +
          reasonPart +
          '.'
      );
    }

    if (issue) {
      advSentences.push(
        "On the other hand, I don't enjoy the fact that " + issue + ', especially when I am tired.'
      );
    }

    if (recommend) {
      advSentences.push(
        'In conclusion, I would especially recommend this book to ' +
          recommend +
          ' who enjoy long, imaginative stories.'
      );
    }

    const advText = advSentences.join(' ');
    advOutput.textContent =
      advText || 'Your advanced paragraph will appear here with more details and connectors.';
  }

  const builderInputs = [
    nameInput,
    progressSelect,
    feelingSelect,
    favCharacterSelect,
    favReasonInput,
    notLikeInput,
    recommendSelect
  ];
  builderInputs.forEach(function (el) {
    if (!el) return;
    const eventName = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(eventName, buildOpinionParagraphs);
  });
  adjectiveCheckboxes.forEach(function (ch) {
    ch.addEventListener('change', buildOpinionParagraphs);
  });

  // When student chooses a suggestion, copy it into the textarea
  if (favReasonSuggest && favReasonInput) {
    favReasonSuggest.addEventListener('change', function () {
      if (!favReasonSuggest.value) return;
      favReasonInput.value = favReasonSuggest.value;
      buildOpinionParagraphs();
    });
  }

  if (notLikeSuggest && notLikeInput) {
    notLikeSuggest.addEventListener('change', function () {
      if (!notLikeSuggest.value) return;
      notLikeInput.value = notLikeSuggest.value;
      buildOpinionParagraphs();
    });
  }

  buildOpinionParagraphs();

})();
