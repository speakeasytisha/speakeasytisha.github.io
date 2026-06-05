(function () {
  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-GB';
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  }

  document.addEventListener('click', function (e) {
    const speakBtn = e.target.closest('[data-speak]');
    if (speakBtn) speak(speakBtn.getAttribute('data-speak'));

    const hintBtn = e.target.closest('.hint-btn');
    if (hintBtn) alert(hintBtn.getAttribute('data-hint'));

    const checkBtn = e.target.closest('.check-btn');
    if (checkBtn) {
      const box = checkBtn.closest('.exercise');
      const select = box.querySelector('select');
      const feedback = box.querySelector('.feedback');
      if (!select.value) {
        feedback.textContent = 'Choose an answer first.';
        feedback.className = 'feedback no';
        return;
      }
      const ok = select.value === select.dataset.answer;
      feedback.textContent = ok
        ? '✅ Correct! Great job.'
        : '❌ Not quite. Try again or use the hint.';
      feedback.className = 'feedback ' + (ok ? 'ok' : 'no');
    }

    const writingBtn = e.target.closest('.check-writing');
    if (writingBtn) {
      const box = writingBtn.closest('.writing-ex');
      const text = box.querySelector('textarea').value.trim();
      const feedback = box.querySelector('.writing-feedback');
      const checks = [
        { label: 'a place', ok: /(denmark|coast|sea|house|village|café)/i.test(text) },
        { label: 'a feeling', ok: /(happy|grateful|wonderful|lovely|special|relaxing|calm)/i.test(text) },
        { label: 'a thank-you idea', ok: /(thank|welcome|kindness|had a wonderful time)/i.test(text) }
      ];
      const html = checks.map(c => `${c.ok ? '✅' : '⬜'} ${c.label}`).join('<br>');
      feedback.innerHTML = html;
      feedback.className = 'feedback ok';
    }
  });

  const checks = Array.from(document.querySelectorAll('.mission-check'));
  const fill = document.getElementById('progress-fill');
  const text = document.getElementById('progress-text');
  function updateProgress() {
    const count = checks.filter(c => c.checked).length;
    fill.style.width = (count / checks.length) * 100 + '%';
    text.textContent = `${count} / ${checks.length} missions completed`;
  }
  checks.forEach(c => c.addEventListener('change', updateProgress));
  updateProgress();
})();
