
(function(){
  'use strict';

  const scenes = window.REAL_IMAGE_SCENES || [];
  const demoQuestions = window.DEMO_QUESTIONS || [];
  const relativeQuestions = window.RELATIVE_QUESTIONS || [];
  const lengthenPrompts = window.LENGTHEN_PROMPTS || [];
  const writingTasks = window.WRITING_TASKS || [];

  const state = { sceneIndex: 0, teacher: false, timer: null };
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

  function init(){
    fillSelects();
    renderScene();
    renderQuizzes();
    renderLengthen();
    renderWritingTask();
    bindEvents();
  }

  function bindEvents(){
    $('#teacherBtn').addEventListener('click', toggleTeacher);
    $('#resetBtn').addEventListener('click', () => location.reload());
    $$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
      const el = document.getElementById(btn.dataset.scroll);
      if(el) el.scrollIntoView({behavior:'smooth'});
    }));
    $('#sceneSelect').addEventListener('change', e => {
      state.sceneIndex = Number(e.target.value);
      $('#oralSelect').value = e.target.value;
      renderScene();
      renderOral();
    });
    $('#showFrames').addEventListener('click', () => toggleHidden('#framesBox'));
    $('#showVocab').addEventListener('click', () => toggleHidden('#vocabBox'));
    $('#showModels').addEventListener('click', () => toggleHidden('#modelsBox'));
    $('#oralSelect').addEventListener('change', renderOral);
    $('#oralFramesBtn').addEventListener('click', addOralFrames);
    $('#oralModelBtn').addEventListener('click', showOralModel);
    $('#timer45').addEventListener('click', () => startTimer(45));
    $('#timer60').addEventListener('click', () => startTimer(60));
    $('#timerStop').addEventListener('click', stopTimer);
    $('#writingSelect').addEventListener('change', renderWritingTask);
    $('#writingBox').addEventListener('input', updateWordCount);
    $('#writingModelBtn').addEventListener('click', showWritingModel);
    $('#clearWritingBtn').addEventListener('click', () => {
      $('#writingBox').value = '';
      updateWordCount();
      $('#writingModelBox').hidden = true;
    });
  }

  function toggleTeacher(){
    state.teacher = !state.teacher;
    $('#teacherBtn').textContent = 'Teacher mode: ' + (state.teacher ? 'on' : 'off');
    if(state.teacher){
      ['#framesBox','#vocabBox','#modelsBox'].forEach(sel => $(sel).hidden = false);
    }
  }

  function toggleHidden(sel){
    const el = $(sel);
    el.hidden = !el.hidden;
  }

  function fillSelects(){
    const options = scenes.map((s, i) => `<option value="${i}">${s.title}</option>`).join('');
    $('#sceneSelect').innerHTML = options;
    $('#oralSelect').innerHTML = options;
    $('#writingSelect').innerHTML = writingTasks.map((t, i) => `<option value="${i}">${t.title}</option>`).join('');
  }

  function currentScene(){
    return scenes[state.sceneIndex] || scenes[0];
  }

  function renderScene(){
    const s = currentScene();
    $('#sceneImage').src = s.src;
    $('#sceneImage').alt = s.title;
    $('#sceneTitle').textContent = s.title;
    $('#sceneSub').textContent = s.subtitle;
    $('#sceneCredit').href = s.page;
    $('#sceneCredit').textContent = s.credit + ' ↗';
    $('#sceneBadge').textContent = s.examType;
    $('#scenePersonality').textContent = s.personality;
    $('#scenePrompt').textContent = s.prompt;
    $('#focusPills').innerHTML = s.focus ? s.focus.map(x => `<span class="tag-pill">${x}</span>`).join('') : '';
    $('#framesList').innerHTML = s.frames.map(x => `<li>${x}</li>`).join('');
    $('#vocabList').innerHTML = s.vocab.map(v => `<div><strong>${v[1]}</strong><span><b>FR:</b> ${v[2]}</span><em>${v[3]}</em></div>`).join('');
    $('#modelA2').textContent = s.models.A2;
    $('#modelB1').textContent = s.models.B1;
    $('#modelB2').textContent = s.models.B2;
    if(!state.teacher){
      $('#framesBox').hidden = true;
      $('#vocabBox').hidden = true;
      $('#modelsBox').hidden = true;
    }
  }

  function renderQuizzes(){
    renderQuiz('#demoQuiz', demoQuestions);
    renderQuiz('#relativeQuiz', relativeQuestions);
  }

  function renderQuiz(target, questions){
    const host = $(target);
    host.innerHTML = questions.map((q, qi) => `
      <div class="quiz-card" data-q="${qi}">
        <p>${qi+1}. ${q.q}</p>
        <div class="options">
          ${q.options.map((opt, oi) => `<button class="option" type="button" data-o="${oi}">${opt}</button>`).join('')}
        </div>
        <div class="feedback" aria-live="polite"></div>
      </div>
    `).join('');
    $$('.quiz-card', host).forEach(card => {
      const qi = Number(card.dataset.q);
      const question = questions[qi];
      const feedback = $('.feedback', card);
      $$('.option', card).forEach(btn => btn.addEventListener('click', () => {
        $$('.option', card).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const ok = Number(btn.dataset.o) === question.answer;
        feedback.textContent = (ok ? '✅ Correct. ' : '❌ Not yet. ') + question.explain;
        feedback.className = 'feedback ' + (ok ? 'good' : 'bad');
      }));
    });
  }

  function renderLengthen(){
    $('#lengthenList').innerHTML = lengthenPrompts.map(item => `
      <article class="lengthen-card">
        <div class="levels">
          <div class="level"><b>Basic</b>${item.basic}</div>
          <div class="level"><b>Better</b>${item.better}</div>
          <div class="level"><b>Strong</b>${item.strong}</div>
        </div>
      </article>
    `).join('');
  }

  function renderOral(){
    const idx = Number($('#oralSelect').value || 0);
    const s = scenes[idx];
    $('#oralPrompt').textContent = s.prompt + ' Try to speak for 45–60 seconds. Use one demonstrative and one relative clause.';
    $('#oralModelBox').hidden = true;
    $('#oralModelBox p').textContent = s.models.B1;
  }

  function addOralFrames(){
    const idx = Number($('#oralSelect').value || 0);
    const s = scenes[idx];
    $('#oralNotes').value = s.frames.join('\n');
  }

  function showOralModel(){
    $('#oralModelBox').hidden = !$('#oralModelBox').hidden;
  }

  function startTimer(sec){
    clearInterval(state.timer);
    let left = sec;
    updateTimer(left);
    state.timer = setInterval(() => {
      left -= 1;
      updateTimer(left);
      if(left <= 0){
        clearInterval(state.timer);
        state.timer = null;
      }
    }, 1000);
  }

  function updateTimer(sec){
    const m = String(Math.floor(sec/60)).padStart(2,'0');
    const s = String(Math.max(0, sec%60)).padStart(2,'0');
    $('#timerDisplay').textContent = `${m}:${s}`;
  }

  function stopTimer(){
    clearInterval(state.timer);
    state.timer = null;
    updateTimer(0);
  }

  function renderWritingTask(){
    const i = Number($('#writingSelect').value || 0);
    const task = writingTasks[i];
    $('#writingInstruction').textContent = task.instruction;
    $('#writingModelBox p').textContent = task.model;
    $('#writingModelBox').hidden = true;
  }

  function showWritingModel(){
    $('#writingModelBox').hidden = !$('#writingModelBox').hidden;
  }

  function updateWordCount(){
    const text = $('#writingBox').value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    $('#wordCount').textContent = words;
  }

  document.addEventListener('DOMContentLoaded', init);
})();
