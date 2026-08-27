(() => {
  'use strict';

  const STORE_KEY = 'francoiseCompanion_v1';
  const state = { accent: 'en-GB', french: true, story: '', fillAnswers: {} };

  function loadState(){
    try{ Object.assign(state, JSON.parse(localStorage.getItem(STORE_KEY) || '{}')); }catch(e){}
    if(!['en-US','en-GB','en-AU'].includes(state.accent)) state.accent = 'en-GB';
    if(typeof state.french !== 'boolean') state.french = true;
  }
  function saveState(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const clean = s => String(s ?? '').trim().replace(/\s+/g,' ');
  const norm = s => clean(s).toLowerCase().replace(/[’]/g,"'").replace(/[.!?]$/,'');

  function toast(msg){
    const el = $('#toast'); if(!el) return;
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(()=>el.classList.remove('show'), 1800);
  }

  let voices = [];
  function loadVoices(){ voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }
  function chooseVoice(lang){
    const langLower = lang.toLowerCase();
    let candidates = voices.filter(v => v.lang.toLowerCase() === langLower);
    if(!candidates.length) candidates = voices.filter(v => v.lang.toLowerCase().startsWith(langLower.slice(0,2)));
    const preferred = {
      'en-GB':['Google UK English Female','Microsoft Sonia Online','Daniel','Serena'],
      'en-US':['Google US English','Microsoft Jenny Online','Samantha','Alex'],
      'en-AU':['Microsoft Natasha Online','Karen','Lee']
    }[lang] || [];
    const rank = name => { const i = preferred.indexOf(name); return i === -1 ? 999 : i; };
    return candidates.sort((a,b)=>rank(a.name)-rank(b.name))[0] || candidates[0] || null;
  }
  function speak(text){
    if(!('speechSynthesis' in window)){ toast('Speech is not supported in this browser.'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean(text));
    u.lang = state.accent; u.rate = .94; u.pitch = 1;
    const v = chooseVoice(state.accent); if(v) u.voice = v;
    speechSynthesis.speak(u);
  }

  function initSpeech(){
    loadVoices(); if('speechSynthesis' in window) speechSynthesis.onvoiceschanged = loadVoices;
    document.addEventListener('click', e => {
      const b = e.target.closest('.speak[data-speak]'); if(b) speak(b.dataset.speak);
    });
    $$('.accent-btn').forEach(b => b.addEventListener('click', () => {
      state.accent = b.dataset.accent;
      $$('.accent-btn').forEach(x => x.classList.toggle('active', x === b));
      saveState(); toast(`Accent: ${b.textContent.trim()}`);
    }));
    $$('.accent-btn').forEach(b => b.classList.toggle('active', b.dataset.accent === state.accent));
  }

  function initFrench(){
    const t = $('#frenchToggle'); if(!t) return;
    t.checked = state.french;
    document.body.classList.toggle('french-off', !state.french);
    t.addEventListener('change', () => {
      state.french = t.checked;
      document.body.classList.toggle('french-off', !state.french);
      saveState();
    });
  }

  function initPrint(){
    $$('.print-btn').forEach(b => b.addEventListener('click', () => window.print()));
  }

  function fallbackCopy(text){
    const ta = document.createElement('textarea'); ta.value = text;
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove(); toast('Copied.');
  }
  function initCopy(){
    $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
      const text = b.dataset.copy;
      try{ await navigator.clipboard.writeText(text); toast('Copied.'); }
      catch{ fallbackCopy(text); }
    }));
  }

  function mark(el, isCorrect, explanation){
    const fb = $('.feedback', el.closest('.fill-question'));
    if(!fb) return;
    if(isCorrect){
      fb.textContent = '✓ Correct. ' + (explanation || '');
      fb.className = 'feedback ok';
    } else {
      fb.textContent = '✗ Not yet. ' + (explanation || 'Try again.');
      fb.className = 'feedback bad';
    }
  }

  function initFillQuestions(){
    $$('.fill-question').forEach((q, i) => {
      const input = $('input', q);
      const id = 'fill' + i;
      if(state.fillAnswers[id]) input.value = state.fillAnswers[id];
      const check = () => {
        const v = norm(input.value), a = norm(q.dataset.answer), alt = norm(q.dataset.altAnswer || '__none__');
        const correct = v === a || v === alt;
        mark(q, correct, q.dataset.explanation);
        if(correct){ state.fillAnswers[id] = input.value; saveState(); }
      };
      const btn = $('.check-input', q);
      if(btn) btn.addEventListener('click', check);
      input.addEventListener('keydown', e => { if(e.key === 'Enter') check(); });
    });
  }

  function initStory(){
    const ta = $('#storyDraft');
    if(!ta) return;
    ta.value = state.story || '';
    ta.addEventListener('input', () => { state.story = ta.value; saveState(); });
    const speakBtn = $('#speakStory');
    if(speakBtn) speakBtn.addEventListener('click', () => {
      if(!clean(ta.value)){ toast('Write a few sentences first.'); return; }
      speak(ta.value);
    });
    const copyBtn = $('#copyStory');
    if(copyBtn) copyBtn.addEventListener('click', async () => {
      try{ await navigator.clipboard.writeText(ta.value); toast('Story copied.'); }
      catch{ fallbackCopy(ta.value); }
    });
    const clearBtn = $('#clearStory');
    if(clearBtn) clearBtn.addEventListener('click', () => {
      if(!confirm('Clear your draft?')) return;
      ta.value = ''; state.story = ''; saveState();
    });
  }

  function initSelfCheck(){
    $$('.self-check input[type=checkbox]').forEach((c, i) => {
      const id = 'check' + i;
      c.checked = !!state.fillAnswers['_' + id];
      c.addEventListener('change', () => { state.fillAnswers['_' + id] = c.checked; saveState(); });
    });
  }

  loadState(); initFrench(); initSpeech(); initPrint(); initCopy(); initFillQuestions(); initStory(); initSelfCheck();
})();
