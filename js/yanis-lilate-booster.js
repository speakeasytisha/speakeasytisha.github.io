(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const scoreNow = $('#scoreNow');
  const scoreMax = $('#scoreMax');
  let score = 0;
  const awarded = new Set();
  function setScoreMax(n){ if(scoreMax) scoreMax.textContent = String(n); }
  function award(key, points=1){
    if(awarded.has(key)) return;
    awarded.add(key);
    score += points;
    if(scoreNow) scoreNow.textContent = String(score);
  }
  function resetScore(){
    score = 0;
    awarded.clear();
    if(scoreNow) scoreNow.textContent = '0';
  }
  setScoreMax(30);

  const Speech = {
    mode:'en-US',
    getVoices(){ return window.speechSynthesis ? window.speechSynthesis.getVoices() : []; },
    pickVoice(){
      const voices = this.getVoices();
      const lang = this.mode.toLowerCase();
      return voices.find(v => (v.lang||'').toLowerCase() === lang)
        || voices.find(v => (v.lang||'').toLowerCase().startsWith(lang))
        || voices.find(v => (v.lang||'').toLowerCase().startsWith('en'))
        || null;
    },
    say(text){
      if(!window.speechSynthesis || !text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      const voice = this.pickVoice();
      if(voice) u.voice = voice;
      u.lang = this.mode;
      u.rate = 0.95;
      u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    },
    pause(){ try{ window.speechSynthesis.pause(); }catch(e){} },
    resume(){ try{ window.speechSynthesis.resume(); }catch(e){} },
    stop(){ try{ window.speechSynthesis.cancel(); }catch(e){} }
  };

  function setVoice(mode){
    Speech.mode = mode;
    $('#voiceUS')?.classList.toggle('is-on', mode === 'en-US');
    $('#voiceUK')?.classList.toggle('is-on', mode === 'en-GB');
    $('#voiceUS')?.setAttribute('aria-pressed', String(mode === 'en-US'));
    $('#voiceUK')?.setAttribute('aria-pressed', String(mode === 'en-GB'));
  }

  $('#voiceUS')?.addEventListener('click', () => setVoice('en-US'));
  $('#voiceUK')?.addEventListener('click', () => setVoice('en-GB'));
  $('#pauseAudio')?.addEventListener('click', () => Speech.pause());
  $('#resumeAudio')?.addEventListener('click', () => Speech.resume());
  $('#stopAudio')?.addEventListener('click', () => Speech.stop());
  $('#listenIntro')?.addEventListener('click', () => {
    Speech.say('This lesson helps you listen better, identify useful information, reformulate simply, and answer calmly in professional situations.');
  });

  $$('.inline-audio').forEach(btn => {
    btn.addEventListener('click', () => {
      const line = btn.closest('[data-speak]');
      if(line) Speech.say(line.getAttribute('data-speak'));
    });
  });

  $$('button[data-say]').forEach(btn => {
    btn.addEventListener('click', () => Speech.say(btn.getAttribute('data-say')));
  });

  $$('.transcript-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = $('#' + btn.dataset.target);
      if(!target) return;
      target.classList.toggle('hidden');
      btn.textContent = target.classList.contains('hidden') ? 'Show transcript' : 'Hide transcript';
    });
  });

  function markButtons(container, okIndex, chosenIndex){
    const buttons = $$('.choice-btn', container);
    buttons.forEach((b, i) => {
      b.disabled = true;
      if(i === okIndex) b.classList.add('good');
      if(i === chosenIndex && i !== okIndex) b.classList.add('bad');
    });
  }

  $$('.exercise').forEach((block, idx) => {
    const buttons = $$('.choice-btn', block);
    const fb = $('.feedback', block);
    if(buttons.length){
      buttons.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          const okIndex = buttons.findIndex(b => b.dataset.correct === '1');
          const chosenIndex = i;
          const correct = btn.dataset.correct === '1';
          markButtons(block, okIndex, chosenIndex);
          fb.classList.remove('hidden');
          fb.classList.toggle('ok', correct);
          fb.classList.toggle('no', !correct);
          fb.innerHTML = correct ? '✅ Correct. Good choice.' : `❌ Not quite. The best answer is: <strong>${buttons[okIndex].textContent}</strong>`;
          if(correct) award('exercise-' + idx, 2);
        });
      });
    }
  });

  $$('.check-fill').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.exercise');
      const fb = $('.feedback', block);
      const inputs = $$('input', block);
      let good = 0;
      inputs.forEach(input => {
        const ans = (input.dataset.answer || '').trim().toLowerCase().replace(/\s+/g,' ');
        const val = (input.value || '').trim().toLowerCase().replace(/\s+/g,' ');
        if(val === ans) {
          good++;
          input.style.borderColor = '#8ed4b4';
          input.style.background = '#f4fff9';
        } else {
          input.style.borderColor = '#efb1bb';
          input.style.background = '#fff8f8';
        }
      });
      const allCorrect = good === inputs.length;
      fb.classList.remove('hidden');
      fb.classList.toggle('ok', allCorrect);
      fb.classList.toggle('no', !allCorrect);
      fb.innerHTML = allCorrect ? '✅ Great. You identified the useful information.' : `❌ You have ${good} correct out of ${inputs.length}.`;
      if(allCorrect) award('fill-' + idx, 3);
    });
  });

  $$('.check-selects').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.fill-block');
      const answers = JSON.parse(btn.dataset.answer || '[]');
      const selects = $$('select', block);
      const fb = $('.feedback', block);
      let good = 0;
      selects.forEach((sel, i) => {
        const ok = (sel.value || '').trim().toLowerCase() === String(answers[i] || '').trim().toLowerCase();
        if(ok){
          good++;
          sel.style.borderColor = '#8ed4b4';
          sel.style.background = '#f4fff9';
        }else{
          sel.style.borderColor = '#efb1bb';
          sel.style.background = '#fff8f8';
        }
      });
      const allCorrect = good === selects.length;
      fb.classList.remove('hidden');
      fb.classList.toggle('ok', allCorrect);
      fb.classList.toggle('no', !allCorrect);
      fb.innerHTML = allCorrect ? '✅ Correct.' : `❌ You have ${good} correct out of ${selects.length}.`;
      if(allCorrect) award('select-' + idx, 2);
    });
  });

  $$('.check-text').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.fill-block');
      const input = $('input', block);
      const answer = (btn.dataset.answer || '').trim().toLowerCase();
      const value = (input.value || '').trim().toLowerCase();
      const fb = $('.feedback', block);
      const ok = value === answer;
      input.style.borderColor = ok ? '#8ed4b4' : '#efb1bb';
      input.style.background = ok ? '#f4fff9' : '#fff8f8';
      fb.classList.remove('hidden');
      fb.classList.toggle('ok', ok);
      fb.classList.toggle('no', !ok);
      fb.innerHTML = ok ? '✅ Correct.' : `❌ Try again. Expected word: <strong>${answer}</strong>`;
      if(ok) award('text-' + idx, 2);
    });
  });

  const roleplays = [
    {
      title: 'Role-play 1 — A stressed passenger at the gate',
      prompt: 'Passenger: “I think I am at the wrong gate. Can you help me?”',
      model: 'Yes, of course. Please stay calm. Let me check your boarding pass.',
      stronger: 'Yes, of course. Please stay calm. Let me check your boarding pass carefully, and I will show you the correct gate.',
      promptAudio: 'I think I am at the wrong gate. Can you help me?',
      modelAudio: 'Yes, of course. Please stay calm. Let me check your boarding pass.',
      strongerAudio: 'Yes, of course. Please stay calm. Let me check your boarding pass carefully, and I will show you the correct gate.'
    },
    {
      title: 'Role-play 2 — A delay announcement',
      prompt: 'Passenger: “What is happening with this flight?”',
      model: 'The flight is delayed by twenty minutes. Boarding will start later.',
      stronger: 'The flight is delayed by twenty minutes, so boarding will start later. Please stay near the gate and keep your boarding pass ready.',
      promptAudio: 'What is happening with this flight?',
      modelAudio: 'The flight is delayed by twenty minutes. Boarding will start later.',
      strongerAudio: 'The flight is delayed by twenty minutes, so boarding will start later. Please stay near the gate and keep your boarding pass ready.'
    },
    {
      title: 'Role-play 3 — Hotel transfer request',
      prompt: 'Customer: “I need a shuttle from the airport tomorrow.”',
      model: 'Of course. I can confirm the pick-up point by email.',
      stronger: 'Of course. I can confirm the pick-up point by email, and I will send the information clearly this afternoon.',
      promptAudio: 'I need a shuttle from the airport tomorrow.',
      modelAudio: 'Of course. I can confirm the pick-up point by email.',
      strongerAudio: 'Of course. I can confirm the pick-up point by email, and I will send the information clearly this afternoon.'
    }
  ];

  const host = $('#roleplayHost');
  if(host){
    roleplays.forEach((rp, idx) => {
      const card = document.createElement('article');
      card.className = 'roleplay-card';
      card.innerHTML = `
        <h3>${rp.title}</h3>
        <div class="prompt-box">
          <div class="block-label">Prompt</div>
          <p>${rp.prompt}</p>
          <button class="primary-btn small rp-prompt" type="button">🔊 Listen to the prompt</button>
        </div>
        <div class="model-box">
          <div class="block-label">Model answer</div>
          <p>${rp.model}</p>
          <button class="ghost-btn small rp-model" type="button">🔊 Listen to the model</button>
        </div>
        <div class="stronger-box">
          <div class="block-label">Stronger answer</div>
          <p>${rp.stronger}</p>
          <button class="ghost-btn small rp-stronger" type="button">🔊 Listen to the stronger answer</button>
        </div>
        <div class="notes-card" style="margin-top:.75rem">
          <label class="notes-label" for="rpNote${idx}">Your answer</label>
          <textarea id="rpNote${idx}" class="notes-area" placeholder="Write your version here."></textarea>
        </div>
      `;
      host.appendChild(card);
      $('.rp-prompt', card).addEventListener('click', () => Speech.say(rp.promptAudio));
      $('.rp-model', card).addEventListener('click', () => { Speech.say(rp.modelAudio); award('rp-model-' + idx, 1); });
      $('.rp-stronger', card).addEventListener('click', () => { Speech.say(rp.strongerAudio); award('rp-stronger-' + idx, 1); });
    });
  }

  $('#resetAll')?.addEventListener('click', () => {
    Speech.stop();
    setVoice('en-US');
    resetScore();

    $$('textarea').forEach(t => t.value = '');
    $$('input[type="text"]').forEach(i => {
      i.value = '';
      i.style.borderColor = '';
      i.style.background = '';
    });
    $$('select').forEach(s => {
      s.selectedIndex = 0;
      s.style.borderColor = '';
      s.style.background = '';
    });
    $$('.feedback').forEach(f => {
      f.className = 'feedback hidden';
      f.innerHTML = '';
    });
    $$('.choice-btn').forEach(b => {
      b.disabled = false;
      b.classList.remove('good','bad');
    });
    $$('.transcript').forEach(t => t.classList.add('hidden'));
    $$('.transcript-toggle').forEach(b => b.textContent = 'Show transcript');
  });

  setVoice('en-US');
})();
