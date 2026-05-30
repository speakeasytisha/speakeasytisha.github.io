(function () {
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function speakText(text) {
    if (!('speechSynthesis' in window) || !text || !text.trim()) {
      showToast('Speech is not available on this device.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = 'en-GB';
    window.speechSynthesis.speak(utterance);
  }

  document.addEventListener('click', function (e) {
    const speakBtn = e.target.closest('.speak-btn');
    if (speakBtn) {
      const direct = speakBtn.dataset.speak;
      const targetId = speakBtn.dataset.speakTarget;
      if (direct) speakText(direct);
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) speakText(el.value || el.innerText || el.textContent || '');
      }
    }

    const copyBtn = e.target.closest('[data-copy-from]');
    if (copyBtn) {
      const el = document.getElementById(copyBtn.dataset.copyFrom);
      if (!el) return;
      const text = el.value || el.innerText || el.textContent || '';
      navigator.clipboard.writeText(text).then(() => showToast('Copied.'));
    }

    const hintBtn = e.target.closest('.hint-btn');
    if (hintBtn) {
      showToast(hintBtn.dataset.hint || 'Think about the rule and the context.');
    }

    const checkBtn = e.target.closest('.check-btn');
    if (checkBtn) {
      const target = document.getElementById(checkBtn.dataset.target);
      const feedback = document.getElementById(checkBtn.dataset.feedback);
      const answer = checkBtn.dataset.answer;
      if (!target || !feedback) return;
      if (!target.value) {
        feedback.textContent = 'Choose an answer first.';
        feedback.className = 'feedback bad';
        showToast('Choose an answer first.');
        return;
      }
      if (target.value === answer) {
        feedback.textContent = 'Correct ✓';
        feedback.className = 'feedback good';
        showToast('Correct ✓');
      } else {
        const selected = target.options[target.selectedIndex].text;
        const correctText = [...target.options].find(opt => opt.value === answer)?.text || 'the correct answer';
        feedback.textContent = `Not quite. You chose “${selected}”. Correct answer: “${correctText}”.`;
        feedback.className = 'feedback bad';
        showToast('Not quite. Check the explanation and try again.');
      }
    }
  });
})();
