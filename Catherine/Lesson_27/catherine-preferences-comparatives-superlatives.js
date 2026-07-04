document.addEventListener('DOMContentLoaded', () => {
  const speak = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-GB';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

  document.querySelectorAll('.speak-btn').forEach(btn => {
    btn.addEventListener('click', () => speak(btn.dataset.speak || btn.textContent.trim()));
  });

  const setFeedback = (id, ok, message) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.className = 'feedback ' + (ok ? 'ok' : 'bad');
  };

  document.querySelectorAll('.check-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const select = document.getElementById(btn.dataset.target);
      const feedbackId = btn.dataset.feedback;
      if (!select || !feedbackId) return;
      if (!select.value) {
        setFeedback(feedbackId, false, 'Choose an answer first.');
        return;
      }
      if (select.value === '1') {
        setFeedback(feedbackId, true, 'Correct ✅');
      } else {
        const correct = [...select.options].find(o => o.value === '1');
        setFeedback(feedbackId, false, 'Not quite. Correct answer: ' + (correct ? correct.textContent : 'Try again.'));
      }
    });
  });

  document.querySelectorAll('.hint-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setFeedback(btn.dataset.feedback, false, 'Hint: ' + (btn.dataset.hint || 'Check the grammar pattern.'));
    });
  });
});
