
(function(){
  'use strict';

  const scenes = window.__SCENES || [];
  const storyScenes = window.__STORY_SCENES || [];

  const state = {
    teacherMode: false,
    sceneIndex: 0,
    vocabFilter: 'all',
    timerId: null,
    storyIndex: 0
  };

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function createSVG(kind){
    const map = {
      hotel: `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" aria-label="Hotel reception illustration">
        <rect x="0" y="0" width="360" height="240" fill="#eef6ff"/>
        <rect x="0" y="170" width="360" height="70" fill="#dde7f2"/>
        <rect x="45" y="90" width="180" height="85" rx="12" fill="#b9d4f6"/>
        <rect x="60" y="104" width="150" height="58" rx="10" fill="#f9fcff"/>
        <rect x="240" y="45" width="70" height="38" rx="8" fill="#1a73e8"/>
        <text x="275" y="69" text-anchor="middle" font-size="16" fill="#fff" font-family="Arial">HOTEL</text>
        <rect x="80" y="140" width="150" height="28" rx="6" fill="#8cb4ea"/>
        <circle cx="120" cy="132" r="13" fill="#f1c7a0"/>
        <rect x="107" y="145" width="28" height="30" rx="10" fill="#335b88"/>
        <circle cx="262" cy="118" r="15" fill="#f1c7a0"/>
        <rect x="248" y="134" width="30" height="40" rx="10" fill="#6b8db3"/>
        <rect x="286" y="146" width="20" height="26" rx="4" fill="#6f5c50"/>
        <rect x="291" y="138" width="10" height="8" rx="2" fill="#44352d"/>
      </svg>`,
      airport: `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" aria-label="Airport baggage claim illustration">
        <rect width="360" height="240" fill="#eef6ff"/>
        <rect y="175" width="360" height="65" fill="#dde7f2"/>
        <rect x="25" y="52" width="90" height="38" rx="8" fill="#1a73e8"/>
        <text x="70" y="76" text-anchor="middle" font-size="14" fill="#fff" font-family="Arial">BAGGAGE</text>
        <ellipse cx="180" cy="170" rx="135" ry="26" fill="#8ea7bd"/>
        <ellipse cx="180" cy="170" rx="115" ry="15" fill="#5f7489"/>
        <circle cx="258" cy="118" r="15" fill="#f0c6a2"/>
        <rect x="244" y="132" width="28" height="42" rx="10" fill="#527aa7"/>
        <rect x="278" y="141" width="18" height="22" rx="4" fill="#7898ba"/>
        <circle cx="65" cy="120" r="13" fill="#f0c6a2"/>
        <rect x="53" y="133" width="24" height="36" rx="10" fill="#335b88"/>
        <rect x="47" y="150" width="40" height="26" rx="4" fill="#6f5c50"/>
      </svg>`,
      market: `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" aria-label="Street market illustration">
        <rect width="360" height="240" fill="#eef6ff"/>
        <rect y="175" width="360" height="65" fill="#dce7f0"/>
        <rect x="40" y="90" width="100" height="70" rx="10" fill="#fff" stroke="#b7cae0"/>
        <rect x="36" y="78" width="108" height="18" rx="6" fill="#ff8b6b"/>
        <rect x="180" y="90" width="100" height="70" rx="10" fill="#fff" stroke="#b7cae0"/>
        <rect x="176" y="78" width="108" height="18" rx="6" fill="#59b88d"/>
        <circle cx="70" cy="115" r="8" fill="#ff5b5b"/>
        <circle cx="92" cy="116" r="8" fill="#f7c948"/>
        <circle cx="114" cy="116" r="8" fill="#78c850"/>
        <circle cx="205" cy="115" r="8" fill="#ff9f43"/>
        <circle cx="227" cy="116" r="8" fill="#5da7f2"/>
        <circle cx="249" cy="116" r="8" fill="#78c850"/>
        <circle cx="315" cy="120" r="13" fill="#f0c6a2"/>
        <rect x="302" y="133" width="26" height="36" rx="10" fill="#527aa7"/>
      </svg>`,
      restaurant: `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" aria-label="Restaurant scene illustration">
        <rect width="360" height="240" fill="#eef6ff"/>
        <rect y="170" width="360" height="70" fill="#dde7f2"/>
        <rect x="58" y="54" width="18" height="116" fill="#d0dbe8"/>
        <rect x="286" y="54" width="18" height="116" fill="#d0dbe8"/>
        <rect x="70" y="54" width="230" height="18" fill="#f0b56c"/>
        <ellipse cx="160" cy="150" rx="54" ry="28" fill="#fff" stroke="#c8d6e6"/>
        <rect x="155" y="150" width="10" height="30" fill="#8ca4ba"/>
        <circle cx="122" cy="124" r="13" fill="#f0c6a2"/>
        <rect x="110" y="137" width="24" height="32" rx="10" fill="#9b7cd1"/>
        <circle cx="198" cy="124" r="13" fill="#f0c6a2"/>
        <rect x="186" y="137" width="24" height="32" rx="10" fill="#6db39a"/>
        <circle cx="270" cy="108" r="13" fill="#f0c6a2"/>
        <rect x="258" y="121" width="24" height="48" rx="10" fill="#335b88"/>
        <rect x="248" y="134" width="14" height="8" fill="#fff"/>
      </svg>`,
      beach: `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" aria-label="Beach illustration">
        <rect width="360" height="240" fill="#cfeaff"/>
        <rect y="120" width="360" height="60" fill="#63c4e6"/>
        <rect y="180" width="360" height="60" fill="#efd9a7"/>
        <circle cx="300" cy="50" r="28" fill="#ffd45b"/>
        <rect x="82" y="135" width="6" height="56" fill="#8b6b4b"/>
        <path d="M85 135 L145 150 Q128 98 85 105 Z" fill="#ff7d73"/>
        <rect x="210" y="138" width="6" height="53" fill="#8b6b4b"/>
        <path d="M213 138 L270 154 Q255 106 213 111 Z" fill="#6db39a"/>
        <circle cx="120" cy="170" r="12" fill="#f0c6a2"/>
        <rect x="108" y="182" width="24" height="18" rx="8" fill="#527aa7"/>
      </svg>`,
      train: `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" aria-label="Train station illustration">
        <rect width="360" height="240" fill="#eef6ff"/>
        <rect y="176" width="360" height="64" fill="#dde7f2"/>
        <rect x="38" y="86" width="244" height="62" rx="16" fill="#7aa7d8"/>
        <rect x="58" y="100" width="42" height="24" rx="6" fill="#eaf4ff"/>
        <rect x="112" y="100" width="42" height="24" rx="6" fill="#eaf4ff"/>
        <rect x="166" y="100" width="42" height="24" rx="6" fill="#eaf4ff"/>
        <rect x="220" y="100" width="42" height="24" rx="6" fill="#eaf4ff"/>
        <rect x="290" y="58" width="52" height="26" rx="8" fill="#1a73e8"/>
        <text x="316" y="76" text-anchor="middle" font-size="12" fill="#fff" font-family="Arial">Platform</text>
        <circle cx="302" cy="152" r="13" fill="#f0c6a2"/>
        <rect x="290" y="165" width="24" height="30" rx="10" fill="#335b88"/>
        <rect x="320" y="171" width="18" height="20" rx="4" fill="#6f5c50"/>
      </svg>`
    };
    return map[kind] || '<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="240" fill="#eef6ff"/></svg>';
  }

  const vocabAll = scenes.flatMap(scene => scene.vocab.map(v => ({cat:v[0], word:v[1], fr:v[2], def:v[3], scene:scene.title})));
  const vocabCategories = ['all', ...Array.from(new Set(vocabAll.map(item => item.cat)))];

  const grammarQuizzes = {
    q1: {
      question: 'Choose the correct sentence.',
      options: ['There are a receptionist behind the desk.', 'There is a receptionist behind the desk.', 'There is two customers in the restaurant.'],
      correct: 1,
      feedback: 'Use “There is” with a singular noun.'
    },
    q2: {
      question: 'Choose the best description.',
      options: ['The passenger waits for her bag.', 'The passenger is waiting for her bag.', 'The passenger waiting for her bag.'],
      correct: 1,
      feedback: 'For actions happening now, use am/is/are + verb‑ing.'
    },
    q3: {
      question: 'Fill the gap: The departure board is ___ the background.',
      options: ['in', 'on', 'at'],
      correct: 0,
      feedback: 'We say “in the background”.'
    },
    q4: {
      question: 'Choose the best hypothesis.',
      options: ['She may be asking for help.', 'She asks for help now maybe.', 'She helping could.'],
      correct: 0,
      feedback: 'Use may / might / could + base structure.'
    }
  };

  function setupButtons(){
    const teacherBtn = $('#teacherModeBtn');
    const resetBtn = $('#resetPageBtn');
    teacherBtn.addEventListener('click', () => {
      state.teacherMode = !state.teacherMode;
      teacherBtn.textContent = `Teacher mode: ${state.teacherMode ? 'on' : 'off'}`;
      if(state.teacherMode){
        $('#framesCard').hidden = false;
        $('#sceneVocabCard').hidden = false;
        $('#modelsCard').hidden = false;
      }
    });
    resetBtn.addEventListener('click', () => location.reload());
    $$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
      const el = document.getElementById(btn.dataset.scroll);
      if(el) el.scrollIntoView({behavior:'smooth'});
    }));
  }

  function renderSceneSelects(){
    const sceneSelect = $('#sceneSelect');
    const oralSelect = $('#oralSceneSelect');
    const options = scenes.map((scene, i) => `<option value="${i}">${scene.title}</option>`).join('');
    sceneSelect.innerHTML = options;
    oralSelect.innerHTML = options;
    sceneSelect.addEventListener('change', (e) => { state.sceneIndex = Number(e.target.value); renderScene(); });
    oralSelect.addEventListener('change', renderOralTask);
    sceneSelect.value = String(state.sceneIndex);
    oralSelect.value = '0';
  }

  function renderScene(){
    const scene = scenes[state.sceneIndex];
    $('#sceneVisual').innerHTML = createSVG(scene.svg);
    $('#sceneTag').textContent = scene.tag;
    $('#sceneTitle').textContent = scene.title;
    $('#scenePrompt').textContent = scene.prompt;
    $('#focusPills').innerHTML = scene.focus.map(item => `<span class="tag-pill">${item}</span>`).join('');
    $('#framesList').innerHTML = scene.frames.map(frame => `<li>${frame}</li>`).join('');
    $('#sceneVocabList').innerHTML = scene.vocab.map(item => `
      <div class="mini-vocab-item">
        <strong>${item[1]}</strong>
        <span><strong>FR:</strong> ${item[2]}</span>
        <em>${item[3]}</em>
      </div>
    `).join('');
    $('#modelA2').textContent = scene.modelA2;
    $('#modelB1').textContent = scene.modelB1;

    if(!state.teacherMode){
      $('#framesCard').hidden = true;
      $('#sceneVocabCard').hidden = true;
      $('#modelsCard').hidden = true;
    }
  }

  function setupSceneButtons(){
    $('#showFramesBtn').addEventListener('click', () => { $('#framesCard').hidden = !$('#framesCard').hidden; });
    $('#showVocabBtn').addEventListener('click', () => { $('#sceneVocabCard').hidden = !$('#sceneVocabCard').hidden; });
    $('#showModelsBtn').addEventListener('click', () => { $('#modelsCard').hidden = !$('#modelsCard').hidden; });
    $('#speakPromptBtn').addEventListener('click', () => speakText($('#scenePrompt').textContent));
  }

  function speakText(text){
    if(!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.97;
    window.speechSynthesis.speak(utter);
  }

  function renderVocabFilters(){
    $('#vocabFilters').innerHTML = vocabCategories.map(cat => `
      <button class="filter-btn ${cat === state.vocabFilter ? 'active' : ''}" type="button" data-cat="${cat}">${cat === 'all' ? 'All' : cat}</button>
    `).join('');
    $$('#vocabFilters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.vocabFilter = btn.dataset.cat;
        renderVocabFilters();
        renderVocabCards();
      });
    });
  }

  function renderVocabCards(){
    const filtered = state.vocabFilter === 'all' ? vocabAll : vocabAll.filter(item => item.cat === state.vocabFilter);
    $('#vocabCards').innerHTML = filtered.map(item => `
      <article class="vocab-item">
        <span class="cat-chip">${item.cat}</span>
        <strong class="vocab-word">${item.word}</strong>
        <div class="vocab-meta"><strong>FR:</strong> ${item.fr}</div>
        <div class="vocab-def">${item.def}</div>
        <div class="vocab-meta"><strong>Scene:</strong> ${item.scene}</div>
      </article>
    `).join('');
  }

  function renderGrammar(){
    $$('.quiz-box').forEach(box => {
      const quiz = grammarQuizzes[box.dataset.quiz];
      if(!quiz) return;
      box.innerHTML = `
        <div class="quiz-question">${quiz.question}</div>
        <div class="quiz-options">
          ${quiz.options.map((option, index) => `<button class="quiz-option" type="button" data-index="${index}">${option}</button>`).join('')}
        </div>
        <div class="quiz-feedback" aria-live="polite"></div>
      `;
      const feedback = $('.quiz-feedback', box);
      $$('.quiz-option', box).forEach(btn => {
        btn.addEventListener('click', () => {
          const index = Number(btn.dataset.index);
          $$('.quiz-option', box).forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if(index === quiz.correct){
            feedback.textContent = '✅ Correct! ' + quiz.feedback;
            feedback.classList.remove('bad');
          } else {
            feedback.textContent = '❌ Try again. ' + quiz.feedback;
            feedback.classList.add('bad');
          }
        });
      });
    });
  }

  function startTimer(seconds){
    clearInterval(state.timerId);
    let remaining = seconds;
    updateTimer(remaining);
    state.timerId = setInterval(() => {
      remaining -= 1;
      updateTimer(remaining);
      if(remaining <= 0){
        clearInterval(state.timerId);
        state.timerId = null;
      }
    }, 1000);
  }

  function updateTimer(value){
    const min = String(Math.floor(value / 60)).padStart(2, '0');
    const sec = String(value % 60).padStart(2, '0');
    $('#timerDisplay').textContent = `${min}:${sec}`;
  }

  function setupTimer(){
    $('#timer45').addEventListener('click', () => startTimer(45));
    $('#timer60').addEventListener('click', () => startTimer(60));
    $('#timerStop').addEventListener('click', () => {
      clearInterval(state.timerId);
      state.timerId = null;
      updateTimer(0);
    });
  }

  function renderOralTask(){
    const index = Number($('#oralSceneSelect').value || 0);
    const scene = scenes[index];
    $('#oralPrompt').textContent = scene.prompt + ' Use the P.A.C.E. method and speak for around 45–60 seconds.';
    $('#oralModel').hidden = true;
    $('#oralChecklist').hidden = true;
    $('#oralModel p').textContent = scene.modelB1;
  }

  function setupOralButtons(){
    $('#oralModelBtn').addEventListener('click', () => { $('#oralModel').hidden = !$('#oralModel').hidden; });
    $('#oralTipsBtn').addEventListener('click', () => { $('#oralChecklist').hidden = !$('#oralChecklist').hidden; });
  }

  function renderStoryTasks(){
    const select = $('#storySelect');
    select.innerHTML = storyScenes.map((story, i) => `<option value="${i}">${story.title}</option>`).join('');
    select.addEventListener('change', () => {
      state.storyIndex = Number(select.value);
      updateStoryTask();
    });
    updateStoryTask();
  }

  function updateStoryTask(){
    const story = storyScenes[state.storyIndex];
    $('#storySteps').innerHTML = story.steps.map((step, i) => `<div class="story-step"><strong>${i+1}.</strong> ${step}</div>`).join('');
    $('#storyModelCard').hidden = true;
    $('#storyModelText').textContent = story.model;
  }

  function setupWritingButtons(){
    const storyText = $('#storyText');
    storyText.addEventListener('input', () => {
      $('#wordCount').textContent = String(countWords(storyText.value));
    });
    $('#storyModelBtn').addEventListener('click', () => { $('#storyModelCard').hidden = !$('#storyModelCard').hidden; });
    $('#storyClearBtn').addEventListener('click', () => {
      storyText.value = '';
      $('#wordCount').textContent = '0';
    });
  }

  function countWords(text){
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }

  function init(){
    setupButtons();
    renderSceneSelects();
    renderScene();
    setupSceneButtons();
    renderVocabFilters();
    renderVocabCards();
    renderGrammar();
    setupTimer();
    renderOralTask();
    setupOralButtons();
    renderStoryTasks();
    setupWritingButtons();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
