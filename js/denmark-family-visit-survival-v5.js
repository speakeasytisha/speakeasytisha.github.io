(() => {
  document.addEventListener('DOMContentLoaded', () => {
    let selectedVoice = 'en-GB';
    let timerInt = null;

    const say = (text) => {
      if (!('speechSynthesis' in window) || !text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = selectedVoice;
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find(x => x.lang === selectedVoice || x.lang.startsWith(selectedVoice.split('-')[0]));
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    };

    const getText = (id) => {
      const el = document.getElementById(id);
      return el ? el.innerText.replace(/\s+/g, ' ').trim() : '';
    };

    document.querySelectorAll('[data-voice]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-voice]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedVoice = btn.dataset.voice;
      });
    });

    document.querySelectorAll('.listen-btn').forEach(btn => {
      btn.addEventListener('click', () => say(getText(btn.dataset.sayTarget)));
    });

    document.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.vocab-card').forEach(card => {
          card.style.display = filter === 'all' || card.dataset.cat === filter ? '' : 'none';
        });
      });
    });

    const setFeedback = (el, ok, message) => {
      if (!el) return;
      el.innerHTML = message;
      el.style.color = ok ? '#1f7a4f' : '#b13f45';
    };

    const checkCard = (card) => {
      const feedback = card.querySelector('.feedback');
      const type = card.dataset.type;
      if (type === 'select') {
        const sel = card.querySelector('select');
        const correct = sel.dataset.correct;
        const chosen = sel.value;
        const ok = chosen === correct;
        setFeedback(feedback, ok, ok
          ? `✅ Correct — <strong>${correct}</strong> is right.`
          : `❌ Not quite. You chose <strong>${chosen || 'nothing'}</strong>. The correct answer is <strong>${correct}</strong>.`);
        return ok;
      }
      if (type === 'select-group') {
        const selects = [...card.querySelectorAll('select')];
        const wrong = selects.map((s, i) => ({i:i+1, chosen:s.value || 'nothing', correct:s.dataset.correct, ok:s.value===s.dataset.correct})).filter(x => !x.ok);
        if (!wrong.length) {
          setFeedback(feedback, true, '✅ Correct — all your answers are right.');
          return true;
        }
        setFeedback(feedback, false, `❌ Some answers are wrong — ${wrong.map(w => `blank ${w.i}: you chose <strong>${w.chosen}</strong>, correct = <strong>${w.correct}</strong>`).join(' • ')}.`);
        return false;
      }
      return false;
    };

    document.querySelectorAll('.check-all-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.closest('section');
        section.querySelectorAll('.quiz-card').forEach(checkCard);
      });
    });

    document.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = document.getElementById(btn.dataset.tab);
        if (panel) panel.classList.add('active');
      });
    });

    document.querySelectorAll('.model-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const box = document.getElementById(btn.dataset.target);
        if (box) box.classList.toggle('hidden');
      });
    });

    const buildBtn = document.getElementById('buildBtn');
    const speakBtn = document.getElementById('speakBtn');
    const output = document.getElementById('builderOutput');
    if (buildBtn && output) {
      buildBtn.addEventListener('click', () => {
        const vals = ['a','b','c','d','e'].map(k => document.querySelector(`[data-builder="${k}"]`)?.value.trim()).filter(Boolean);
        output.textContent = vals.join(' ') || 'I live in France. I’m going to Denmark to visit my son and my daughter-in-law. I’d like to visit the coast and a beautiful natural place. I work as an assessor with young people in court. I wanted to volunteer at an animal shelter, but there were already too many volunteers.';
      });
    }
    if (speakBtn && output) speakBtn.addEventListener('click', () => say(output.textContent));

    const timerDisplay = document.getElementById('timerDisplay');
    const startTimer = (secs) => {
      clearInterval(timerInt);
      let left = secs;
      const render = () => {
        const m = String(Math.floor(left / 60)).padStart(2,'0');
        const s = String(left % 60).padStart(2,'0');
        if (timerDisplay) timerDisplay.textContent = `${m}:${s}`;
      };
      render();
      timerInt = setInterval(() => {
        left -= 1;
        render();
        if (left <= 0) {
          clearInterval(timerInt);
          say('Time is up.');
        }
      }, 1000);
    };
    document.querySelectorAll('.timer-btn').forEach(btn => btn.addEventListener('click', () => startTimer(parseInt(btn.dataset.time, 10))));
  });
})();
