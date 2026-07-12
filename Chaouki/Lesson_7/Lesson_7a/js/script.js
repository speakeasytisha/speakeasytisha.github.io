(function () {
  'use strict';

  const progressTotal = 8;
  const completed = new Set();
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');

  const normalise = (text) => text.replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
  const shuffle = (items) => {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  };
  const setFeedback = (exercise, message, type) => {
    const box = exercise.querySelector('.feedback');
    if (!box) return;
    box.textContent = message;
    box.className = `feedback ${type}`;
  };
  const markComplete = (number) => {
    completed.add(String(number));
    const count = completed.size;
    progressFill.style.width = `${(count / progressTotal) * 100}%`;
    progressText.textContent = `${count} / ${progressTotal}`;
  };

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      window.alert('Audio is not available in this browser. Please read the model aloud.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.82;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find(v => /^en-GB/i.test(v.lang));
    if (britishVoice) utterance.voice = britishVoice;
    window.speechSynthesis.speak(utterance);
  }

  document.querySelectorAll('[data-say]').forEach(button => {
    button.addEventListener('click', () => speak(button.dataset.say));
  });

  const frToggle = document.getElementById('frToggle');
  let frenchOn = true;
  frToggle.addEventListener('click', () => {
    frenchOn = !frenchOn;
    document.body.classList.toggle('hide-french', !frenchOn);
    frToggle.textContent = frenchOn ? '🇫🇷 French help: ON' : '🇫🇷 French help: OFF';
    frToggle.setAttribute('aria-pressed', String(frenchOn));
  });

  document.querySelectorAll('.model-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const translation = button.parentElement.querySelector('.model-fr');
      const open = !translation.hidden;
      translation.hidden = open;
      button.textContent = open ? 'Show French help' : 'Hide French help';
    });
  });

  document.querySelectorAll('.show-inline-model').forEach(button => {
    button.addEventListener('click', () => {
      const model = button.parentElement.querySelector('.inline-model');
      model.hidden = !model.hidden;
      button.textContent = model.hidden ? 'Show model' : 'Hide model';
    });
  });

  // Shuffle options inside each question so correct answers do not occupy a predictable position.
  document.querySelectorAll('.mini-question').forEach(question => {
    const labels = Array.from(question.querySelectorAll('label'));
    shuffle(labels).forEach(label => question.appendChild(label));
  });

  document.querySelectorAll('.check-radios').forEach(button => {
    button.addEventListener('click', () => {
      const exercise = button.closest('.exercise');
      const questions = Array.from(exercise.querySelectorAll('.mini-question'));
      let correct = 0;
      let unanswered = 0;
      questions.forEach(question => {
        const selected = question.querySelector('input:checked');
        question.classList.remove('correct-card', 'wrong-card');
        if (!selected) { unanswered += 1; return; }
        if (selected.value === question.dataset.answer) {
          correct += 1;
          question.classList.add('correct-card');
        } else {
          question.classList.add('wrong-card');
        }
      });
      if (unanswered) {
        setFeedback(exercise, `Please answer all ${questions.length} questions before checking.`, 'neutral');
        return;
      }
      if (correct === questions.length) {
        setFeedback(exercise, `Excellent — ${correct}/${questions.length} correct.`, 'good');
        markComplete(exercise.dataset.exercise);
      } else {
        setFeedback(exercise, `${correct}/${questions.length} correct. Read the grammar box, then try again.`, 'bad');
      }
    });
  });

  document.querySelectorAll('.check-inputs').forEach(button => {
    button.addEventListener('click', () => {
      const exercise = button.closest('.exercise');
      const inputs = Array.from(exercise.querySelectorAll('input[data-answer]'));
      let correct = 0;
      inputs.forEach(input => {
        const isCorrect = normalise(input.value) === normalise(input.dataset.answer);
        input.style.borderColor = isCorrect ? '#0d7f65' : '#ad2e38';
        if (isCorrect) correct += 1;
      });
      if (correct === inputs.length) {
        setFeedback(exercise, 'Excellent — every line is correct.', 'good');
        markComplete(exercise.dataset.exercise);
      } else {
        setFeedback(exercise, `${correct}/${inputs.length} correct. Use the model and try again.`, 'bad');
      }
    });
  });

  function createBuildExercise(exercise) {
    const bank = exercise.querySelector('[data-bank]');
    const answerLine = exercise.querySelector('[data-answer-line]');
    const template = exercise.querySelector('template[data-words]');
    if (!bank || !answerLine || !template) return;
    const words = JSON.parse(template.content.textContent.trim());
    const renderWords = () => {
      bank.innerHTML = '';
      answerLine.innerHTML = '';
      shuffle([...words]).forEach(word => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'word-chip';
        chip.textContent = word;
        chip.dataset.word = word;
        chip.addEventListener('click', () => {
          if (chip.parentElement === bank) {
            answerLine.appendChild(chip); // preserves exact user tap order
          } else {
            bank.appendChild(chip);
          }
        });
        bank.appendChild(chip);
      });
    };
    renderWords();
    exercise.querySelector('.clear-build').addEventListener('click', renderWords);
    exercise.querySelector('.check-build').addEventListener('click', () => {
      const answer = Array.from(answerLine.querySelectorAll('.word-chip')).map(chip => chip.textContent).join(' ');
      if (normalise(answer) === normalise(exercise.dataset.answer)) {
        setFeedback(exercise, 'Excellent — your word order is correct.', 'good');
        markComplete(exercise.dataset.exercise);
      } else {
        setFeedback(exercise, 'Not quite yet. Check the first word, question order, and punctuation — then try again.', 'bad');
      }
    });
    exercise.querySelector('.show-model').addEventListener('click', (event) => {
      const model = exercise.querySelector('.model-answer');
      model.hidden = !model.hidden;
      event.currentTarget.textContent = model.hidden ? 'Show model' : 'Hide model';
    });
  }

  document.querySelectorAll('.build-exercise').forEach(createBuildExercise);

  document.querySelectorAll('.confidence-box').forEach((box, index) => {
    box.addEventListener('change', () => {
      if (box.checked) markComplete(`confidence-${index}`);
    });
  });

  document.getElementById('resetLesson').addEventListener('click', () => {
    if (!window.confirm('Reset your answers and progress?')) return;
    window.location.reload();
  });
})();
