
document.addEventListener('DOMContentLoaded', () => {
  const speak = (text) => {
    if (!('speechSynthesis' in window)) { alert('Speech is not supported in this browser.'); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-GB';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

  document.querySelectorAll('.speak-btn').forEach(btn => {
    btn.addEventListener('click', () => speak(btn.dataset.speak || btn.textContent.trim()));
  });

  document.getElementById('warmupModel')?.addEventListener('click', () => {
    document.getElementById('warmupBox').value =
      "This summer, you would like to go to Denmark. You are thinking about a calm family visit near the coast. You would prefer a quiet and relaxing stay, and for you the best part would be the time spent together.";
  });

  document.getElementById('warmupSpeak')?.addEventListener('click', () => {
    const text = document.getElementById('warmupBox').value.trim();
    speak(text || 'Please write your warm-up answer first.');
  });
});
