/* =========================================================
   Present Perfect page JS
   - Fixes drag & drop (desktop + mobile tap-to-move)
   - Forces US voice when available (avoids French default)
   - Makes MCQ quizzes robust (won't crash if elements missing)
   ========================================================= */

(function () {
  'use strict';

  // -----------------------------
  // US TTS helper
  // -----------------------------
  const ttsNote = document.getElementById('pp-tts-note');

  function pickVoice(preferredLang) {
    const synth = window.speechSynthesis;
    if (!synth || !synth.getVoices) return null;
    const voices = synth.getVoices() || [];
    const exact = voices.find(v => v.lang === preferredLang);
    const starts = voices.find(v => (v.lang || '').startsWith(preferredLang));
    const anyEnUS = voices.find(v => (v.lang || '').startsWith('en-US'));
    const anyEn = voices.find(v => (v.lang || '').startsWith('en'));
    return exact || starts || anyEnUS || anyEn || null;
  }

  let US_VOICE = null;

  function ensureVoiceReady() {
    if (!('speechSynthesis' in window)) return;

    const trySet = () => {
      US_VOICE = pickVoice('en-US');
      if (ttsNote) {
        if (US_VOICE && (US_VOICE.lang || '').startsWith('en-US')) {
          ttsNote.textContent = 'US voice ready ✅';
        } else if (US_VOICE) {
          ttsNote.textContent = 'English voice ready (US not available on this device) ✅';
        } else {
          ttsNote.textContent = 'Voice not available on this browser.';
        }
      }
    };

    trySet();
    // Voices can load async (especially Chrome)
    window.speechSynthesis.addEventListener('voiceschanged', trySet, { once: true });
  }

  function speakUS(text) {
    if (!text) return;
    const synth = window.speechSynthesis;
    if (!synth) return;

    synth.cancel(); // stop anything already speaking
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 1;
    u.pitch = 1;
    if (US_VOICE) u.voice = US_VOICE;
    synth.speak(u);
  }

  function pauseSpeech() {
    const synth = window.speechSynthesis;
    if (synth && synth.speaking) synth.pause();
  }

  function resumeSpeech() {
    const synth = window.speechSynthesis;
    if (synth && synth.paused) synth.resume();
  }

  // -----------------------------
  // MCQ quiz (button-based)
  // -----------------------------
  function initQuiz(quizEl) {
    if (!quizEl) return;

    const questions = Array.from(quizEl.querySelectorAll('.pp-q'));
    const scoreEl = quizEl.querySelector('[data-score]');
    const totalEl = quizEl.querySelector('[data-total]');
    const finalEl = quizEl.querySelector('.pp-final');
    const showBtn = quizEl.querySelector('[data-action="show-score"]');
    const resetBtn = quizEl.querySelector('[data-action="reset"]');

    if (totalEl) totalEl.textContent = String(questions.length);

    let correctCount = 0;

    questions.forEach((q) => {
      const correct = (q.getAttribute('data-correct') || '').trim();
      const hint = (q.getAttribute('data-hint') || '').trim();
      const feedback = q.querySelector('.pp-feedback');
      const buttons = Array.from(q.querySelectorAll('button[data-option]'));

      let answered = false;

      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;

          const chosen = (btn.getAttribute('data-option') || '').trim();

          buttons.forEach(b => b.disabled = true);

          if (chosen === correct) {
            correctCount += 1;
            btn.classList.add('is-correct');
            if (feedback) {
              feedback.classList.remove('is-wrong');
              feedback.classList.add('is-correct');
              feedback.textContent = '✅ Correct!';
            }
          } else {
            btn.classList.add('is-wrong');
            const rightBtn = buttons.find(b => (b.getAttribute('data-option') || '').trim() === correct);
            if (rightBtn) rightBtn.classList.add('is-correct');

            if (feedback) {
              feedback.classList.remove('is-correct');
              feedback.classList.add('is-wrong');
              feedback.textContent = hint ? `❌ Not quite. Hint: ${hint}` : '❌ Not quite.';
            }
          }

          if (scoreEl) scoreEl.textContent = String(correctCount);
        });
      });
    });

    if (showBtn) {
      showBtn.addEventListener('click', () => {
        const total = questions.length || 1;
        const pct = Math.round((correctCount / total) * 100);
        if (finalEl) {
          finalEl.textContent = `Score: ${correctCount}/${total} (${pct}%).`;
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        correctCount = 0;
        if (scoreEl) scoreEl.textContent = '0';
        if (finalEl) finalEl.textContent = '';

        questions.forEach((q) => {
          const feedback = q.querySelector('.pp-feedback');
          if (feedback) {
            feedback.textContent = '';
            feedback.classList.remove('is-correct', 'is-wrong');
          }

          q.querySelectorAll('button[data-option]').forEach((btn) => {
            btn.disabled = false;
            btn.classList.remove('is-correct', 'is-wrong');
          });
        });
      });
    }
  }

  // -----------------------------
  // Drag & Drop + tap-to-move
  // -----------------------------
  function initDnD() {
    const bank = document.getElementById('pp-dnd-bank');
    const zonePP = document.getElementById('pp-zone-pp');
    const zonePS = document.getElementById('pp-zone-ps');
    const checkBtn = document.getElementById('pp-dnd-check');
    const resetBtn = document.getElementById('pp-dnd-reset');
    const result = document.getElementById('pp-dnd-result');

    if (!bank || !zonePP || !zonePS) return;

    const allZones = [zonePP, zonePS];

    // Assign ids if missing
    Array.from(bank.querySelectorAll('.pp-dnd-item')).forEach((item) => {
      if (!item.id) item.id = `pp-item-${item.getAttribute('data-id') || Math.random().toString(16).slice(2)}`;
      item.setAttribute('draggable', 'true');
    });

    let selectedItem = null;

    function clearSelection() {
      if (selectedItem) selectedItem.classList.remove('is-selected');
      selectedItem = null;
    }

    // DRAG START
    function onDragStart(e) {
      const item = e.currentTarget;
      clearSelection();
      e.dataTransfer.setData('text/plain', item.id);
      e.dataTransfer.effectAllowed = 'move';
    }

    // DRAG OVER / DROP
    function onDragOver(e) {
      e.preventDefault();
      e.currentTarget.classList.add('is-over');
      e.dataTransfer.dropEffect = 'move';
    }

    function onDragLeave(e) {
      e.currentTarget.classList.remove('is-over');
    }

    function onDrop(e) {
      e.preventDefault();
      e.currentTarget.classList.remove('is-over');
      const id = e.dataTransfer.getData('text/plain');
      const item = id ? document.getElementById(id) : null;
      if (item) e.currentTarget.appendChild(item);
    }

    // CLICK fallback (mobile)
    function onItemClick(e) {
      const item = e.currentTarget;
      if (selectedItem === item) {
        clearSelection();
        return;
      }
      clearSelection();
      selectedItem = item;
      item.classList.add('is-selected');
    }

    function onZoneClick(e) {
      const drop = e.currentTarget;
      if (!selectedItem) return;
      drop.appendChild(selectedItem);
      clearSelection();
    }

    // Wire events
    Array.from(document.querySelectorAll('.pp-dnd-item')).forEach((item) => {
      item.addEventListener('dragstart', onDragStart);
      item.addEventListener('click', onItemClick);
    });

    allZones.forEach((zone) => {
      zone.addEventListener('dragover', onDragOver);
      zone.addEventListener('dragleave', onDragLeave);
      zone.addEventListener('drop', onDrop);
      zone.addEventListener('click', onZoneClick);
    });

    // Also allow dropping back to bank
    bank.addEventListener('dragover', onDragOver);
    bank.addEventListener('dragleave', onDragLeave);
    bank.addEventListener('drop', onDrop);
    bank.addEventListener('click', () => { if (selectedItem) { bank.appendChild(selectedItem); clearSelection(); } });

    function scoreDnD() {
      // Clear old marks
      document.querySelectorAll('.pp-dnd-item').forEach((it) => it.classList.remove('is-correct', 'is-wrong'));

      const items = Array.from(document.querySelectorAll('.pp-dnd-item'));
      const placed = items.filter(it => it.parentElement === zonePP || it.parentElement === zonePS);

      let correct = 0;
      placed.forEach((it) => {
        const answer = (it.getAttribute('data-answer') || '').trim();
        const inPP = it.parentElement === zonePP;
        const ok = (answer === 'pp' && inPP) || (answer === 'ps' && !inPP);
        it.classList.add(ok ? 'is-correct' : 'is-wrong');
        if (ok) correct += 1;
      });

      const total = items.length;
      const pct = Math.round((correct / total) * 100);
      if (result) result.textContent = `Score: ${correct}/${total} (${pct}%).`;
    }

    function resetDnD() {
      if (result) result.textContent = '';
      clearSelection();
      // Move all items back to bank
      const items = Array.from(document.querySelectorAll('.pp-dnd-item'));
      items.forEach((it) => {
        it.classList.remove('is-correct', 'is-wrong', 'is-selected');
        bank.appendChild(it);
      });
    }

    if (checkBtn) checkBtn.addEventListener('click', scoreDnD);
    if (resetBtn) resetBtn.addEventListener('click', resetDnD);
  }

  // -----------------------------
  // Dialogue builder
  // -----------------------------
  function initDialogueBuilder() {
    const form = document.getElementById('pp-dialogue-form');
    const output = document.getElementById('pp-dialogue-output');
    const clearBtn = document.getElementById('pp-dialogue-clear');

    if (!form || !output) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const yourName = (form.yourName.value || 'You').trim();
      const colleagueName = (form.colleagueName.value || 'Alex').trim();
      const topic = form.topic.value || 'work';
      const tone = form.tone.value || 'friendly';

      let openLine = 'Hi! How have you been?';
      let mid = '';
      let close = 'Anyway, it’s been great catching up. Let’s talk again soon.';

      if (tone === 'professional') {
        openLine = 'Hello. How have you been?';
        close = 'Thank you for the update. Speak soon.';
      } else if (tone === 'excited') {
        openLine = 'Hey! How have you been?!';
        close = 'Amazing. Let’s celebrate soon!';
      }

      if (topic === 'work') {
        mid = [
          `I’ve just finished a big task, and I’ve already sent the main documents.`,
          `We’ve had a few changes this week, so far the project has gone well.`,
          `Have you ever worked with that new system? I’ve never used it before.`
        ].join(' ');
      } else if (topic === 'travel') {
        mid = [
          `I’ve been to a few places recently, but I haven’t travelled abroad yet this year.`,
          `I’ve already booked a trip, and I’ve just checked the hotel details.`,
          `Have you ever been to New York? I’ve never been, but I’d love to go.`
        ].join(' ');
      } else {
        mid = [
          `This week has been busy, but I’ve managed to get everything done.`,
          `I’ve already made a few plans, but I haven’t decided on Saturday night yet.`,
          `Have you ever tried a new restaurant at the last minute? I’ve done that a lot lately.`
        ].join(' ');
      }

      const text =
        `${colleagueName}: ${openLine}\n` +
        `${yourName}: Pretty good, thanks. And you?\n` +
        `${colleagueName}: Not bad. What’s new?\n` +
        `${yourName}: ${mid}\n` +
        `${colleagueName}: Nice! I’ve had a similar week.\n` +
        `${yourName}: ${close}`;

      output.value = text;
      output.classList.add('ldn-fade-in'); // if your global css includes this, it will animate; harmless if not
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        form.reset();
        output.value = '';
      });
    }

    // TTS controls
    const ttsWrap = document.querySelector('.pp-tts');
    if (ttsWrap) {
      const play = ttsWrap.querySelector('[data-tts="play"]');
      const pause = ttsWrap.querySelector('[data-tts="pause"]');
      const restart = ttsWrap.querySelector('[data-tts="restart"]');

      if (play) play.addEventListener('click', () => {
        ensureVoiceReady();
        // If paused, resume; otherwise speak from start
        const synth = window.speechSynthesis;
        if (synth && synth.paused) {
          resumeSpeech();
          return;
        }
        speakUS(output.value || 'Type or generate a dialogue first.');
      });

      if (pause) pause.addEventListener('click', () => pauseSpeech());
      if (restart) restart.addEventListener('click', () => speakUS(output.value || 'Type or generate a dialogue first.'));
    }
  }

  // -----------------------------
  // Init all
  // -----------------------------
  ensureVoiceReady();

  document.querySelectorAll('.pp-quiz').forEach(initQuiz);
  initDnD();
  initDialogueBuilder();

})();
