(() => {
  'use strict';
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => [...el.querySelectorAll(s)];
  const pageKey = document.body.dataset.page || 'sylvain-tense-questions';
  const storageKey = `speakeasy-${pageKey}-v1`;
  const state = { answered: 0, correct: 0 };

  function updateProgress(){
    const total = $$('.answers button[data-correct]').length ? $$('.question').length : 0;
    const answeredQuestions = $$('.question.answered').length;
    const pct = total ? Math.round(answeredQuestions / total * 100) : 0;
    $$('.progress span').forEach(bar => bar.style.width = pct + '%');
    $$('.progress-text').forEach(el => el.textContent = `${answeredQuestions}/${total} exercises answered`);
  }

  function initFrenchToggle(){
    const btn = $('#frenchToggle');
    if(!btn) return;
    const saved = localStorage.getItem(`${storageKey}-fr`) === '1';
    document.body.classList.toggle('show-fr', saved);
    btn.setAttribute('aria-pressed', saved ? 'true' : 'false');
    btn.textContent = saved ? 'Hide FR help' : 'FR help';
    btn.addEventListener('click', () => {
      const show = !document.body.classList.contains('show-fr');
      document.body.classList.toggle('show-fr', show);
      localStorage.setItem(`${storageKey}-fr`, show ? '1' : '0');
      btn.setAttribute('aria-pressed', show ? 'true' : 'false');
      btn.textContent = show ? 'Hide FR help' : 'FR help';
    });
  }

  function speak(text, rate = .88){
    if(!('speechSynthesis' in window)){ alert('Speech is not available in this browser.'); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-GB'; utter.rate = rate; utter.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => /^en-GB/i.test(v.lang)) || voices.find(v => /^en-US/i.test(v.lang));
    if(voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  }

  function initSpeech(){
    $$('.speak-button,[data-say]').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.say || btn.closest('.card,.question,.section')?.innerText || btn.innerText;
        speak(text.replace(/🔊|Listen|Show model/g,'').trim());
      });
    });
  }

  function initQuizzes(){
    $$('.answers button').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.closest('.question');
        if(!q) return;
        const feedback = $('.feedback', q);
        const buttons = $$('.answers button', q);
        buttons.forEach(b => { b.classList.remove('correct','wrong'); b.disabled = true; });
        const isCorrect = btn.dataset.correct === 'true';
        if(isCorrect){
          btn.classList.add('correct');
          if(feedback){ feedback.className = 'feedback good'; feedback.innerHTML = `✅ Correct. ${btn.dataset.note || ''}`; }
        }else{
          btn.classList.add('wrong');
          const correct = buttons.find(b => b.dataset.correct === 'true');
          if(correct) correct.classList.add('correct');
          if(feedback){ feedback.className = 'feedback bad'; feedback.innerHTML = `❌ Not yet. ${btn.dataset.note || correct?.dataset.note || 'Look at the structure again.'}`; }
        }
        q.classList.add('answered');
        updateProgress();
      });
    });
    $$('.reset-button[data-reset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sel = btn.dataset.reset;
        $$(sel).forEach(q => {
          q.classList.remove('answered');
          $$('.answers button', q).forEach(b => { b.disabled = false; b.classList.remove('correct','wrong'); });
          const fb = $('.feedback', q); if(fb){ fb.textContent = ''; fb.className='feedback'; }
        });
        updateProgress();
      });
    });
    updateProgress();
  }

  const questionRules = {
    be: ({subject, info}) => `${beVerb(subject, true)} ${subject} ${info}?`,
    have: ({subject, info}) => `${doAux(subject)} ${subject} have ${info}?`,
    present: ({subject, verb, info}) => `${doAux(subject)} ${subject} ${baseVerb(verb)} ${info}?`,
    continuous: ({subject, verb, info}) => `${beVerb(subject, true)} ${subject} ${ingVerb(verb)} ${info}?`,
    goingto: ({subject, verb, info}) => `${beVerb(subject, true)} ${subject} going to ${baseVerb(verb)} ${info}?`,
    will: ({subject, verb, info}) => `Will ${subject} ${baseVerb(verb)} ${info}?`
  };
  function beVerb(subject, cap=false){
    const lower = subject.toLowerCase();
    let v = 'are';
    if(lower === 'i') v = 'am';
    if(['he','she','it','my wife','my daughter','the order','the aircraft','the flight','the company','the client'].includes(lower)) v = 'is';
    return cap ? v.charAt(0).toUpperCase()+v.slice(1) : v;
  }
  function doAux(subject){
    const lower = subject.toLowerCase();
    return ['he','she','it','my wife','my daughter','the order','the aircraft','the flight','the company','the client'].includes(lower) ? 'Does' : 'Do';
  }
  function baseVerb(v='work'){ return v.replace(/\s+/g,' ').trim(); }
  function ingVerb(v='work'){
    v = baseVerb(v);
    const irregular = { move:'moving', make:'making', have:'having', write:'writing', take:'taking', prepare:'preparing', work:'working', check:'checking', meet:'meeting', look:'looking', send:'sending', deliver:'delivering', label:'labelling', confirm:'confirming', call:'calling'};
    return irregular[v] || (v.endsWith('e') ? v.slice(0,-1)+'ing' : v+'ing');
  }

  function initQuestionBuilders(){
    $$('.question-builder').forEach(builder => {
      const output = $('.builder-output', builder);
      const notes = $('.builder-notes', builder);
      const build = () => {
        const tense = $('[data-field="tense"]', builder)?.value || 'present';
        const subject = $('[data-field="subject"]', builder)?.value || 'you';
        const verb = $('[data-field="verb"]', builder)?.value || 'work';
        const info = $('[data-field="info"]', builder)?.value || 'with airlines';
        const text = (questionRules[tense] || questionRules.present)({subject, verb, info}).replace(/\s+/g,' ').replace(' ?', '?').trim();
        if(output) output.innerHTML = `<small>YOUR QUESTION</small>${text}`;
        return text;
      };
      $$('select,input', builder).forEach(el => el.addEventListener('input', build));
      $('.build-question', builder)?.addEventListener('click', build);
      $('.listen-question', builder)?.addEventListener('click', () => speak(build()));
      $('.add-question', builder)?.addEventListener('click', () => {
        if(notes){ notes.textContent += (notes.textContent ? '\n' : '') + '• ' + build(); }
      });
      $('.copy-questions', builder)?.addEventListener('click', async () => {
        const text = notes?.textContent || build();
        try{ await navigator.clipboard.writeText(text); alert('Copied.'); }
        catch(e){ prompt('Copy this text:', text); }
      });
      $('.clear-questions', builder)?.addEventListener('click', () => { if(notes) notes.textContent = ''; });
      $('.download-questions', builder)?.addEventListener('click', () => {
        const text = notes?.textContent || build();
        downloadText('sylvain-question-bank.txt', text);
      });
      build();
    });
  }

  function downloadText(filename, text){
    const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  function initBankButtons(){
    $$('.bank-buttons button[data-question]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = $(btn.dataset.target || '#questionNotes');
        if(target) target.textContent += (target.textContent ? '\n' : '') + '• ' + btn.dataset.question;
      });
    });
  }

  function initShowModels(){
    $$('[data-toggle-model]').forEach(btn => {
      btn.addEventListener('click', () => {
        const box = $(btn.dataset.toggleModel);
        if(!box) return;
        const hidden = box.hasAttribute('hidden');
        if(hidden){ box.removeAttribute('hidden'); btn.textContent = 'Hide model'; }
        else{ box.setAttribute('hidden',''); btn.textContent = 'Show model'; }
      });
    });
  }

  function initSave(){
    $('#saveButton')?.addEventListener('click', () => {
      const notes = $$('textarea,.notes-box').map((el,i)=>`Notes ${i+1}:\n${el.value || el.textContent}`).join('\n\n');
      localStorage.setItem(`${storageKey}-notes`, notes);
      alert('Progress saved on this browser.');
    });
    $('#downloadPageNotes')?.addEventListener('click', () => {
      const notes = $$('textarea,.notes-box,.output').map((el,i)=>`Section ${i+1}:\n${el.value || el.textContent}`).join('\n\n');
      downloadText(`${pageKey}-notes.txt`, notes);
    });
  }

  function init(){
    initFrenchToggle(); initSpeech(); initQuizzes(); initQuestionBuilders(); initBankButtons(); initShowModels(); initSave(); updateProgress();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
