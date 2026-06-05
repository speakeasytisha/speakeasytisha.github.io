(function(){
  function speak(text){
    if(!('speechSynthesis' in window)){ alert('Speech is not supported on this device/browser.'); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-GB';
    utter.rate = 0.96;
    window.speechSynthesis.speak(utter);
  }

  function showFeedback(el, ok, message){
    el.textContent = message;
    el.className = 'feedback show ' + (ok ? 'good' : 'bad');
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.speak-btn').forEach(btn => {
      btn.addEventListener('click', () => speak(btn.dataset.speak || btn.textContent));
    });

    document.querySelectorAll('.hint-btn').forEach(btn => {
      btn.addEventListener('click', () => alert(btn.dataset.hint || 'Try again.'));
    });

    document.querySelectorAll('.check-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const select = document.getElementById(btn.dataset.target);
        const fb = document.getElementById(btn.dataset.feedback);
        const selected = select ? select.value : '';
        if(!select || !fb){ return; }
        if(!selected){ showFeedback(fb, false, 'Choose an answer first.'); return; }
        const ok = selected === btn.dataset.answer;
        const base = btn.dataset.explain || '';
        showFeedback(fb, ok, (ok ? '✅ Correct! ' : '❌ Not quite. ') + base);
      });
    });

    const copyBtn = document.getElementById('copyPrompt');
    if(copyBtn){
      copyBtn.addEventListener('click', async () => {
        const text = 'Writing prompts:\n1. When did you go?\n2. Where did you go?\n3. Who were you with?\n4. What did you do?\n5. How did you feel?\n6. What would you like to do next time?';
        try {
          await navigator.clipboard.writeText(text);
          alert('Writing prompts copied.');
        } catch(err){
          alert(text);
        }
      });
    }

    const checklistBtn = document.getElementById('showChecklist');
    const checklist = document.getElementById('checklist');
    if(checklistBtn && checklist){
      checklistBtn.addEventListener('click', () => checklist.classList.toggle('hidden'));
    }
  });
})();
