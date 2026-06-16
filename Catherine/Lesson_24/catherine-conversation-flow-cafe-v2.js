
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
      if (!select) return;
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
      setFeedback(btn.dataset.feedback, false, 'Hint: ' + (btn.dataset.hint || 'Think about the rule.'));
    });
  });

  document.getElementById('sampleIntro')?.addEventListener('click', () => {
    const box = document.getElementById('introText');
    box.value = "I enjoy travelling, peaceful places, and meaningful conversations. I am interested in nature, animals, art, and people. I recently visited Denmark and also spent a relaxing stay at a spa.";
  });

  document.getElementById('speakIntro')?.addEventListener('click', () => {
    const text = document.getElementById('introText').value.trim();
    speak(text || 'Please write your introduction first.');
  });

  const spaOutput = document.getElementById('spaOutput');
  document.getElementById('buildSpa')?.addEventListener('click', () => {
    const who = document.getElementById('spaWho').value.trim();
    const where = document.getElementById('spaWhere').value.trim();
    const type = document.getElementById('spaType').value.trim();
    const treat = document.getElementById('spaTreat').value.trim();
    const days = document.getElementById('spaDays').value.trim();
    const feel = document.getElementById('spaFeel').value.trim();

    let text = 'Last week, I went to a spa';
    if (who) text += ' with ' + who;
    text += '. ';
    if (type || where) {
      text += 'It was ';
      if (type) text += type;
      if (type && where) text += ' ';
      if (where) text += where;
      text += '. ';
    }
    if (days) text += 'I stayed there for ' + days + '. ';
    if (treat) text += 'I had ' + treat + '. ';
    if (feel) text += 'I felt ' + feel + '.';
    spaOutput.textContent = text;
  });

  document.getElementById('speakSpa')?.addEventListener('click', () => {
    speak(spaOutput.textContent);
  });
});
