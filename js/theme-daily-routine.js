document.addEventListener('DOMContentLoaded', function () {
      const lesson = document.querySelector('.routine-lesson');
      if (!lesson) return;

      /* ====== STUDENT PROFILE (NAME + PRONOUNS) ====== */
      const profile = {
        name: 'Thomas',
        pronounKey: 'he', // 'he' | 'she' | 'they'
      };

      const pronounSets = {
        he:  { subj: 'he',   subjCap: 'He',   obj: 'him',  possAdj: 'his' },
        she: { subj: 'she',  subjCap: 'She',  obj: 'her',  possAdj: 'her' },
        they:{ subj: 'they', subjCap: 'They', obj: 'them', possAdj: 'their' }
      };

      const nameInput        = document.getElementById('student-name-input');
      const pronounSelect    = document.getElementById('student-pronoun-select');
      const applyBtn         = document.getElementById('student-apply-btn');
      const pronounDisplay   = document.getElementById('student-pronoun-display');
      const subjectStudentOp = document.getElementById('rb-subject-student');

      function updateNameInDOM() {
        const spans = lesson.querySelectorAll('[data-role="student-name"]');
        spans.forEach(span => {
          span.textContent = profile.name;
        });
        if (subjectStudentOp) {
          subjectStudentOp.textContent = profile.name;
        }
      }

      function updatePronounsInDOM() {
        const set = pronounSets[profile.pronounKey];
        if (!set) return;

        const lowerSpans = lesson.querySelectorAll('[data-role="pronoun-subj-lower"]');
        lowerSpans.forEach(span => {
          span.textContent = set.subj;
        });

        const capSpans = lesson.querySelectorAll('[data-role="pronoun-subj-cap"]');
        capSpans.forEach(span => {
          span.textContent = set.subjCap;
        });

        if (pronounDisplay) {
          pronounDisplay.textContent =
            'Subject: ' + set.subj +
            ' · Object: ' + set.obj +
            ' · Possessive adjective: ' + set.possAdj;
        }
      }

      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          if (nameInput && nameInput.value.trim()) {
            profile.name = nameInput.value.trim();
          }
          if (pronounSelect && pronounSelect.value) {
            profile.pronounKey = pronounSelect.value;
          }
          updateNameInDOM();
          updatePronounsInDOM();
        });
      }

      // Initial sync
      updateNameInDOM();
      updatePronounsInDOM();

      /* ====== QUIZ LOGIC (MCQ WITH FEEDBACK + SCORE) ====== */
      const questions = lesson.querySelectorAll('.routine-question');

      questions.forEach(question => {
        const buttons = question.querySelectorAll('.routine-answers button[data-correct]');
        const feedback = question.querySelector('.routine-feedback');

        buttons.forEach(btn => {
          btn.addEventListener('click', () => {
            // clear previous styles
            buttons.forEach(b => {
              b.classList.remove('correct', 'incorrect', 'chosen');
            });

            const isCorrect = btn.dataset.correct === 'true';
            btn.classList.add('chosen');

            if (isCorrect) {
              btn.classList.add('correct');
              question.dataset.score = '1';
              if (feedback) {
                feedback.textContent = '✅ Correct!';
                feedback.classList.remove('incorrect');
                feedback.classList.add('correct');
              }
            } else {
              btn.classList.add('incorrect');
              question.dataset.score = '0';
              if (feedback) {
                feedback.textContent = '❌ Not quite. Try again.';
                feedback.classList.remove('correct');
                feedback.classList.add('incorrect');
              }
            }
          });
        });
      });

      const scoreBtn = document.getElementById('routine-calc-score');
      const scoreResult = document.getElementById('routine-score-result');
      const resetQuizzesBtn = document.getElementById('routine-reset-quizzes');

      if (scoreBtn && scoreResult) {
        scoreBtn.addEventListener('click', () => {
          let total = 0;
          let answered = 0;
          let correct = 0;

          questions.forEach(q => {
            total += 1;
            const val = q.dataset.score;
            if (val === '1' || val === '0') {
              answered += 1;
              if (val === '1') correct += 1;
            }
          });

          const percent = total ? Math.round((correct / total) * 100) : 0;
          let msg = '';
          if (percent >= 80) {
            msg = '🌟 Excellent! You’re controlling these structures very well.';
          } else if (percent >= 60) {
            msg = '👍 Good job! Review the red questions and try again.';
          } else {
            msg = '🧱 Keep practicing. Go back to the grammar and vocabulary sections.';
          }

          scoreResult.innerHTML = `
            <p><strong>Questions answered:</strong> ${answered} / ${total}</p>
            <p><strong>Correct answers:</strong> ${correct} / ${total} (${percent}%)</p>
            <p>${msg}</p>
          `;
        });
      }

      if (resetQuizzesBtn && scoreResult) {
        resetQuizzesBtn.addEventListener('click', () => {
          questions.forEach(q => {
            delete q.dataset.score;
            const buttons = q.querySelectorAll('.routine-answers button');
            const feedback = q.querySelector('.routine-feedback');
            buttons.forEach(b => b.classList.remove('correct', 'incorrect', 'chosen'));
            if (feedback) {
              feedback.textContent = '';
              feedback.classList.remove('correct', 'incorrect');
            }
          });
          scoreResult.innerHTML = '<p>All quiz answers have been reset.</p>';
        });
      }

      /* ====== PARAGRAPH BUILDER + TTS (LISTEN / PAUSE / RESET) ====== */
      const rbSubject = document.getElementById('rb-subject');
      const rbWakeup = document.getElementById('rb-wakeup');
      const rbFrequency = document.getElementById('rb-frequency');
      const rbWorkstart = document.getElementById('rb-workstart');
      const rbWorkplace = document.getElementById('rb-workplace');
      const rbEvening = document.getElementById('rb-evening');
      const rbActivities = document.querySelectorAll('.rb-activity');
      const rbUseContinuous = document.getElementById('rb-use-continuous');
      const rbUseAdverbs = document.getElementById('rb-use-adverbs');
      const rbUseSequencing = document.getElementById('rb-use-sequencing');

      const rbBuildBtn = document.getElementById('rb-build');
      const rbListenBtn = document.getElementById('rb-listen');
      const rbPauseBtn = document.getElementById('rb-pause');
      const rbResetBtn = document.getElementById('rb-reset');
      const rbOutput = document.getElementById('rb-output');
      const rbLevel = document.getElementById('rb-level');

      let currentUtterance = null;

      function buildParagraph() {
        const subjectChoice = rbSubject ? rbSubject.value : 'I'; // 'I' or 'student'
        const isI = subjectChoice === 'I';
        const name = profile.name || 'the student';

        const wake = rbWakeup ? rbWakeup.value : '7:00';
        const freq = rbFrequency ? rbFrequency.value : 'usually';
        const workStart = rbWorkstart ? rbWorkstart.value : '8:30';
        const workplace = rbWorkplace ? rbWorkplace.value : 'in an office';
        const evening = rbEvening ? rbEvening.value : 'relaxing and watching TV';

        const selectedActivities = [];
        rbActivities.forEach(ch => {
          if (ch.checked) selectedActivities.push(ch.value);
        });

        const useCont = rbUseContinuous && rbUseContinuous.checked;
        const useAdv = rbUseAdverbs && rbUseAdverbs.checked;
        const useSeq = rbUseSequencing && rbUseSequencing.checked;

        let seqWords = [];
        if (useSeq) seqWords = ['First', 'Then', 'After that', 'Finally'];

        let sentences = [];
        let adverbCount = 0;
        let continuousCount = 0;
        let seqCount = 0;

        // Morning sentence
        let s1 = '';
        if (useSeq && seqWords[0]) {
          s1 += seqWords[0] + ', ';
          seqCount++;
        }
        if (isI) {
          s1 += 'I ' + freq + ' wake up at ' + wake + ' in the morning.';
        } else {
          s1 += name + ' ' + freq + ' wakes up at ' + wake + ' in the morning.';
        }
        adverbCount++;
        sentences.push(s1);

        // Activities
        if (selectedActivities.length > 0) {
          let s2 = '';
          if (useSeq && seqWords[1]) {
            s2 += seqWords[1] + ', ';
            seqCount++;
          }
          if (isI) {
            s2 += 'I usually ' + selectedActivities.join(', and ') + '.';
          } else {
            s2 += name + ' usually ' + selectedActivities.join(', and ') + '.';
          }
          adverbCount++;
          sentences.push(s2);
        }

        // Work sentence (present simple)
        let s3 = '';
        if (useSeq && seqWords[2]) {
          s3 += seqWords[2] + ', ';
          seqCount++;
        }
        if (isI) {
          s3 += 'I start work at ' + workStart + ' and work ' + workplace + '.';
        } else {
          s3 += name + ' starts work at ' + workStart + ' and works ' + workplace + '.';
        }
        sentences.push(s3);

        // Present continuous sentence (this week / right now)
        if (useCont) {
          let s4 = '';
          if (useAdv) {
            s4 += 'Right now, ';
            adverbCount++;
          }
          if (isI) {
            s4 += 'I am working on a special project this week.';
          } else {
            s4 += name + ' is working on a special project this week.';
          }
          continuousCount++;
          sentences.push(s4);
        }

        // Evening sentence
        let s5 = '';
        if (useSeq && seqWords[3]) {
          s5 += seqWords[3] + ', ';
          seqCount++;
        }
        if (useAdv) {
          s5 += 'In the evening, ';
          adverbCount++;
        }
        if (isI) {
          s5 += 'I usually spend my evening ' + evening + '.';
        } else {
          s5 += name + ' usually spends the evening ' + evening + '.';
        }
        sentences.push(s5);

        const paragraph = sentences.join(' ');
        if (rbOutput) rbOutput.textContent = paragraph;

        // Determine approximate level
        let levelText = '';
        if (continuousCount >= 1 && adverbCount >= 3 && seqCount >= 3) {
          levelText = 'Estimated level: B1+ — good control of present simple / continuous, adverbs and sequencing.';
        } else if ((continuousCount >= 1 && adverbCount >= 2) || seqCount >= 2) {
          levelText = 'Estimated level: A2–B1 — mix of tenses with some adverbs and sequencing.';
        } else {
          levelText = 'Estimated level: A1–A2 — basic present simple with limited connectors.';
        }
        if (rbLevel) rbLevel.textContent = levelText;
      }

      function speakParagraph() {
        if (!rbOutput) return;
        const text = rbOutput.textContent.trim();
        if (!text) {
          alert('Build your paragraph first.');
          return;
        }
        if (!('speechSynthesis' in window)) {
          alert('Speech synthesis is not supported in this browser.');
          return;
        }
        window.speechSynthesis.cancel();
        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.lang = 'en-US';
        window.speechSynthesis.speak(currentUtterance);
      }

      function togglePauseSpeech() {
        if (!('speechSynthesis' in window)) return;
        if (!window.speechSynthesis.speaking) return;

        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          if (rbPauseBtn) rbPauseBtn.textContent = '⏸ Pause';
        } else {
          window.speechSynthesis.pause();
          if (rbPauseBtn) rbPauseBtn.textContent = '▶ Resume';
        }
      }

      function resetBuilder() {
        if (rbSubject) rbSubject.value = 'I';
        if (rbWakeup) rbWakeup.value = '7:00';
        if (rbFrequency) rbFrequency.value = 'usually';
        if (rbWorkstart) rbWorkstart.value = '8:30';
        if (rbWorkplace) rbWorkplace.value = 'in an office';
        if (rbEvening) rbEvening.value = 'relaxing and watching TV';

        rbActivities.forEach(ch => (ch.checked = false));
        if (rbUseContinuous) rbUseContinuous.checked = false;
        if (rbUseAdverbs) rbUseAdverbs.checked = false;
        if (rbUseSequencing) rbUseSequencing.checked = false;

        if (rbOutput) rbOutput.textContent = '';
        if (rbLevel) rbLevel.textContent = '';

        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        if (rbPauseBtn) rbPauseBtn.textContent = '⏸ Pause';
      }

      if (rbBuildBtn) rbBuildBtn.addEventListener('click', buildParagraph);
      if (rbListenBtn) rbListenBtn.addEventListener('click', speakParagraph);
      if (rbPauseBtn) rbPauseBtn.addEventListener('click', togglePauseSpeech);
      if (rbResetBtn) rbResetBtn.addEventListener('click', resetBuilder);
    });