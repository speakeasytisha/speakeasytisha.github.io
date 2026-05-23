document.addEventListener('DOMContentLoaded', () => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function speakText(text) {
    const cleaned = (text || '').trim();
    if (!cleaned || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(cleaned);
    utter.lang = 'en-GB';
    const voices = speechSynthesis.getVoices();
    const chosen = voices.find(v => /en-GB/i.test(v.lang)) || voices.find(v => /en-US/i.test(v.lang));
    if (chosen) utter.voice = chosen;
    speechSynthesis.speak(utter);
  }

  $$('.speak-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.speakTarget;
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) speakText(el.value || el.innerText || el.textContent || '');
        return;
      }
      speakText(btn.dataset.speak || '');
    });
  });

  $$('[data-copy-from]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const el = document.getElementById(btn.dataset.copyFrom);
      if (!el) return;
      try {
        await navigator.clipboard.writeText(el.value || el.innerText || '');
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1200);
      } catch (_) {
        btn.textContent = 'Copy failed';
      }
    });
  });

  const readingCheckBtn = $('[data-check="reading-quizzes"]');
  if (readingCheckBtn) {
    readingCheckBtn.addEventListener('click', () => {
      let total = 0;
      let score = 0;
      ['reading1_q1', 'reading2_q1'].forEach(name => {
        total += 1;
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        if (checked && checked.value === '1') score += 1;
      });
      const fb = $('#reading-quizzes-feedback');
      fb.style.display = 'block';
      fb.classList.toggle('error', score < total);
      fb.innerHTML = score === total
        ? `<span class="success-text">Great!</span> ${score}/${total} correct.`
        : `<span class="error-text">Keep going.</span> ${score}/${total} correct. Check the text again.`;
    });
  }

  $$('[data-check-dropdown]').forEach(btn => {
    btn.addEventListener('click', () => {
      const setId = btn.dataset.checkDropdown;
      const wrap = $(`[data-set="${setId}"]`);
      const fb = document.getElementById(`${setId}-feedback`);
      if (!wrap || !fb) return;
      const selects = $$('select[data-answer]', wrap);
      let score = 0;
      const lines = [];
      selects.forEach((sel, i) => {
        const user = sel.value;
        const answer = sel.dataset.answer;
        const ok = user === answer;
        if (ok) score += 1;
        lines.push(`${i + 1}. ${ok ? '✅' : '❌'} Your answer: <strong>${user || '(blank)'}</strong> — Correct answer: <strong>${answer}</strong>`);
      });
      fb.style.display = 'block';
      fb.classList.toggle('error', score !== selects.length);
      fb.innerHTML = `<p><strong>Score:</strong> ${score}/${selects.length}</p><div>${lines.join('<br>')}</div>`;
    });
  });

  const prompts = {
    trip: {
      prompt: 'Tell your daughter-in-law about your stay: what you did, what you enjoyed, and how you felt.',
      model: 'I had a wonderful time in Denmark. I loved spending time with you both, walking by the coast, and enjoying the peaceful atmosphere. I felt very happy and grateful during my stay.'
    },
    plan: {
      prompt: 'Ask what you could visit today, suggest a place, and decide what time to leave.',
      model: 'What would you like to do today? I would love to visit the harbour or walk by the sea again. What time should we leave? We could have coffee first and then go out together.'
    },
    work: {
      prompt: 'Explain your former job, your current role, and your interest in animal shelters.',
      model: 'I used to work as a social worker. At the moment, I work as an assessor with young people in court. I also wanted to volunteer at an animal shelter because I love animals, but there were already too many volunteers.'
    }
  };

  const roleplaySelect = $('#roleplaySelect');
  const roleplayPrompt = $('#roleplayPrompt');
  const roleplayModel = $('#roleplayModel');
  const showRoleplayModel = $('#showRoleplayModel');
  function updateRoleplay() {
    const current = prompts[roleplaySelect.value];
    roleplayPrompt.textContent = current.prompt;
    roleplayModel.classList.add('hidden');
    roleplayModel.textContent = current.model;
  }
  if (roleplaySelect) {
    roleplaySelect.addEventListener('change', updateRoleplay);
    updateRoleplay();
  }
  if (showRoleplayModel) {
    showRoleplayModel.addEventListener('click', () => {
      roleplayModel.classList.remove('hidden');
    });
  }

  const starterBtn = $('#insertNoteStarter');
  if (starterBtn) {
    starterBtn.addEventListener('click', () => {
      const area = $('#thankYouNote');
      area.value = `Dear both,\n\nThank you so much for your warm welcome in Denmark. I had a wonderful time with you. I loved spending time together, walking by the coast, and enjoying our conversations. I felt very happy and grateful during my stay. I already miss you both and I love you very much.\n\nWith all my love,`;
    });
  }

  let timer = null;
  let remaining = 60;
  const timerDisplay = $('#timerDisplay');
  function renderTimer() {
    const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
    const ss = String(remaining % 60).padStart(2, '0');
    timerDisplay.textContent = `${mm}:${ss}`;
  }
  $('#startTimer')?.addEventListener('click', () => {
    if (timer) return;
    timer = setInterval(() => {
      remaining -= 1;
      renderTimer();
      if (remaining <= 0) {
        clearInterval(timer);
        timer = null;
        speakText('Time is up. Well done.');
      }
    }, 1000);
  });
  $('#resetTimer')?.addEventListener('click', () => {
    clearInterval(timer);
    timer = null;
    remaining = 60;
    renderTimer();
  });
  renderTimer();

  if ('speechSynthesis' in window) {
    speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }
});
