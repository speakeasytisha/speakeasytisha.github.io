(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const storageKey = 'se_veronique_lesson1_v1';
  let accent = 'en-GB';
  let toastTimer;
  let mediaRecorder = null;
  let mediaStream = null;
  let recordedChunks = [];

  const scoreState = new Map();

  const quizData = [
    {
      q: "C'était vraiment spécial.",
      prompt: 'Choose the correctly spelled English sentence.',
      options: ['It was really especial.', 'It was really spécial.', 'It was really special.'],
      answer: 'It was really special.',
      hint: 'English drops the French accent and changes one letter.',
      explain: '"Special" has no accent and no extra syllable — think "spe-cial", not "spé-cial".'
    },
    {
      q: 'Il pleuvait, donc nous sommes restés à l’hôtel.',
      prompt: 'Choose the correct English pronoun for a general statement.',
      options: ['Il was raining, so we stayed at the hotel.', 'It was raining, so we stayed at the hotel.', 'He was raining, so we stayed at the hotel.'],
      answer: 'It was raining, so we stayed at the hotel.',
      hint: 'English never uses "Il" — think of the weather pronoun.',
      explain: 'For weather, time and general statements, English always uses "it", never "il".'
    },
    {
      q: "L'année dernière, je suis allée à New York et tout était incroyable.",
      prompt: 'Choose the sentence with consistent tenses.',
      options: ['Last year, I went to New York and everything is amazing.', 'Last year, I went to New York and everything was amazing.', 'Last year, I go to New York and everything was amazing.'],
      answer: 'Last year, I went to New York and everything was amazing.',
      hint: 'If the trip is finished, every verb in the story stays in the past.',
      explain: 'Once you start a story in the past ("I went"), keep describing it in the past ("was"), not the present ("is").'
    },
    {
      q: "C'était fantastique parce que tout était fantastique.",
      prompt: 'Choose the sentence with more natural, varied vocabulary.',
      options: ['It was fantastic because everything was fantastic.', 'It was fantastic because everything was incredible.', 'It was fantastic because everything fantastic.'],
      answer: 'It was fantastic because everything was incredible.',
      hint: 'Avoid using the same adjective twice in one sentence — English likes variety.',
      explain: 'Native speakers avoid repeating the same adjective. Swap the second "fantastic" for amazing, wonderful, impressive or incredible.'
    },
    {
      q: "J'ai passé un très bon week-end à l'hôtel.",
      prompt: 'Choose the natural English verb.',
      options: ['I passed a really good weekend at the hotel.', 'I spent a really good weekend at the hotel.', 'I spend a really good weekend at the hotel.'],
      answer: 'I spent a really good weekend at the hotel.',
      hint: '"Passer du temps" is a false friend in English.',
      explain: 'Use "spend time", not "pass time". "Pass" usually means to go past something or to succeed an exam.'
    },
    {
      q: "D'abord je suis arrivée à l'hôtel, puis j'ai déposé mes bagages.",
      prompt: 'Choose the sentence with correct, connected tenses.',
      options: ['First I arrived at the hotel and then I drop my luggage.', 'First, I arrived at the hotel, then I dropped off my luggage.', 'First, I arrive at the hotel, then I dropped off my luggage.'],
      answer: 'First, I arrived at the hotel, then I dropped off my luggage.',
      hint: 'Both actions happened in the past — both verbs need the same tense.',
      explain: 'Use the past simple for both actions: "arrived" and "dropped off". Mixing tenses breaks the timeline.'
    }
  ];

  const vocab = [
    {cat:'Travel', word:'destination', fr:'destination', def:'the place you are travelling to', ex:'New York was an amazing destination for my last trip.'},
    {cat:'Travel', word:'unforgettable', fr:'inoubliable', def:'so special that you will always remember it', ex:'It was an unforgettable experience.'},
    {cat:'Travel', word:'journey', fr:'trajet / voyage', def:'the act of travelling from one place to another', ex:'The journey to the airport took two hours.'},
    {cat:'Travel', word:'sightseeing', fr:'visite touristique', def:'visiting famous or interesting places as a tourist', ex:'We spent the morning sightseeing in the old town.'},
    {cat:'Travel', word:'souvenir', fr:'souvenir (objet)', def:'an object you keep to remember a place or trip', ex:'I bought a small souvenir from the market.'},
    {cat:'Hotel & Restaurant', word:'check-in', fr:'enregistrement / arrivée', def:'the process of arriving and registering at a hotel', ex:'Check-in is from 3 p.m.'},
    {cat:'Hotel & Restaurant', word:'check-out', fr:'départ (hôtel)', def:'the process of leaving a hotel and returning your key', ex:'You have to check out before 11 a.m.'},
    {cat:'Hotel & Restaurant', word:'book a table', fr:'réserver une table', def:'to reserve a table at a restaurant in advance', ex:"I'd like to book a table for two, please."},
    {cat:'Hotel & Restaurant', word:'reception', fr:'réception', def:'the desk where guests arrive and ask for information', ex:'You can leave your luggage at reception.'},
    {cat:'Hotel & Restaurant', word:'bill', fr:'addition / note', def:'the piece of paper showing how much you must pay', ex:'Could I have the bill, please?'},
    {cat:'Hotel & Restaurant', word:'complaint', fr:'réclamation', def:'a statement that something is wrong or not satisfactory', ex:'She made a complaint about the noisy room.'},
    {cat:'Getting Around', word:'get around', fr:'se déplacer', def:'to travel from place to place in an area', ex:'It is easy to get around the city by bus.'},
    {cat:'Getting Around', word:'delayed', fr:'retardé(e)', def:'happening later than planned', ex:'Our flight was delayed by two hours.'},
    {cat:'Getting Around', word:'directions', fr:'indications (chemin)', def:'instructions on how to get somewhere', ex:'Could you give me directions to the station?'},
    {cat:'Getting Around', word:'ticket', fr:'billet / ticket', def:'a piece of paper or code that lets you travel or enter', ex:'I need to buy a ticket for the train.'},
    {cat:'Getting Around', word:'platform', fr:'quai', def:'the area in a station where you get on a train', ex:'The train leaves from platform 4.'},
    {cat:'Reactions', word:'amazing', fr:'incroyable / génial(e)', def:'extremely good or surprising', ex:'The view from the hotel was amazing.'},
    {cat:'Reactions', word:'impressive', fr:'impressionnant(e)', def:'making a strong, positive impression', ex:'The old town was really impressive.'},
    {cat:'Reactions', word:'disappointing', fr:'décevant(e)', def:'not as good as you hoped', ex:'The weather was a bit disappointing.'},
    {cat:'Reactions', word:'worth it', fr:'ça en vaut la peine', def:'good enough to justify the time, money or effort', ex:'The trip was expensive, but it was worth it.'},
    {cat:'Reactions', word:'recommend', fr:'recommander', def:'to say that something is good or worth trying', ex:'I would recommend that restaurant.'},
    {cat:'Everyday', word:'at the moment', fr:'en ce moment', def:'now; during the current period', ex:"I'm learning English at the moment."},
    {cat:'Everyday', word:'confident', fr:'confiant(e)', def:'feeling sure that you can do something', ex:'I want to feel more confident when I travel.'},
    {cat:'Everyday', word:'improve', fr:'améliorer', def:'to make something better', ex:'I want to improve my listening skills.'},
    {cat:'Everyday', word:'notice', fr:'remarquer', def:'to become aware of a detail', ex:'I try to notice small details when I listen.'},
    {cat:'Everyday', word:'reformulate', fr:'reformuler', def:'to say the same idea in a different way', ex:'If I forget a word, I try to reformulate my sentence.'}
  ];

  const grammarItems = [
    {q:'Last year, I ___ to Italy.', options:['go', 'went'], answer:'went', explain:'A finished past action → past simple (went).'},
    {q:'The city ___ absolutely beautiful.', options:['is', 'was'], answer:'was', explain:'Describing a finished trip → keep it in the past (was).'},
    {q:'We ___ dinner at a small restaurant near the hotel.', options:['have', 'had'], answer:'had', explain:'Part of the same past story → had, not have.'},
    {q:'There ___ a lot of tourists that day.', options:['was', 'were'], answer:'were', explain:'"A lot of tourists" is plural → were, not was.'}
  ];

  function shuffle(arr){
    const a = [...arr];
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  function showToast(message){
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function speak(text){
    if(!text || !('speechSynthesis' in window)){
      showToast('Audio is not available in this browser.');
      return;
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\s+/g,' ').trim());
    u.lang = accent;
    u.rate = .9;
    const voices = speechSynthesis.getVoices();
    const exact = voices.find(v => v.lang === accent);
    const regional = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(accent.slice(0,2).toLowerCase()));
    if(exact || regional) u.voice = exact || regional;
    speechSynthesis.speak(u);
  }

  function sentenceCase(text){
    const t = (text || '').trim();
    if(!t) return '';
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  function endSentence(text){
    const t = sentenceCase(text);
    return t && !/[.!?]$/.test(t) ? t + '.' : t;
  }

  // Accent + French support
  $$('.seg-btn').forEach(btn => btn.addEventListener('click', () => {
    $$('.seg-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    accent = btn.dataset.accent;
    showToast(accent === 'en-GB' ? 'British English audio selected.' : 'American English audio selected.');
  }));

  $('#frToggle').addEventListener('click', () => {
    const on = $('#frToggle').getAttribute('aria-pressed') !== 'true';
    $('#frToggle').setAttribute('aria-pressed', String(on));
    $('#frToggle').textContent = on ? 'FR help ✓' : 'FR help';
    $$('.fr-help').forEach(el => el.hidden = !on);
  });

  $$('.speak').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.speak || btn.textContent.replace('🔊',''))));
  $$('.speak-input').forEach(btn => btn.addEventListener('click', () => speak($('#'+btn.dataset.target)?.value || '')));
  $$('.speak-output').forEach(btn => btn.addEventListener('click', () => speak($('#'+btn.dataset.output)?.textContent || '')));

  // Progress based on scroll exploration
  const sections = $$('[data-section]');
  function updateScrollProgress(){
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    const pct = scrollable > 0 ? Math.round((scrollY / scrollable) * 100) : 0;
    $('#progressBar').style.width = `${Math.min(100,Math.max(0,pct))}%`;
    $('#progressPercent').textContent = `${Math.min(100,Math.max(0,pct))}%`;
  }
  addEventListener('scroll', updateScrollProgress, {passive:true});
  updateScrollProgress();

  $('#jumpNext').addEventListener('click', () => {
    const currentY = scrollY + 120;
    const next = sections.find(s => s.offsetTop > currentY + 40);
    (next || sections[0]).scrollIntoView({behavior:'smooth', block:'start'});
  });

  // Multi select reasons
  $$('#whyChoices button').forEach(btn => btn.addEventListener('click', () => btn.classList.toggle('selected')));

  // Hints + model reveals
  $$('.hint-btn').forEach(btn => btn.addEventListener('click', () => {
    const target = $('#'+btn.dataset.hint);
    if(target) target.hidden = !target.hidden;
  }));
  $$('.model-link').forEach(btn => btn.addEventListener('click', () => {
    const target = $('#'+btn.dataset.model);
    if(!target) return;
    target.hidden = !target.hidden;
    btn.textContent = target.hidden ? btn.textContent.replace('Hide','Reveal').replace('Close','See') : btn.textContent.replace('Reveal','Hide').replace('See','Hide').replace('Show','Hide');
  }));

  // Admin checklist
  function updateAdmin(){
    const all = $$('#adminChecklist input');
    const done = all.filter(i => i.checked).length;
    $('#adminCount').textContent = `${done}/${all.length} reviewed`;
    $('#adminBar').style.width = `${done/all.length*100}%`;
  }
  $$('#adminChecklist input').forEach(i => i.addEventListener('change', updateAdmin));
  updateAdmin();

  // Intro builder
  $('#buildIntro').addEventListener('click', () => {
    const parts = ['introPlace','introLife','introInterests','introEnglish','introPriority']
      .map(id => endSentence($('#'+id).value))
      .filter(Boolean);
    if(!parts.length){
      $('#introOutput').textContent = 'Add one or two ideas first, then build your introduction.';
      return;
    }
    $('#introOutput').textContent = parts.join(' ');
    showToast('Introduction built. You can edit your ideas and build again.');
  });
  $('#copyIntro').addEventListener('click', async () => {
    const text = $('#introOutput').textContent;
    try{ await navigator.clipboard.writeText(text); showToast('Introduction copied.'); }
    catch{ showToast('Copy is not available here. Select the text manually.'); }
  });

  // Confidence sliders
  $$('#confidenceGrid input').forEach(input => {
    const out = input.parentElement.querySelector('output');
    const sync = () => out.value = input.value;
    input.addEventListener('input', sync); sync();
  });

  // Learning profile
  $$('.either-or').forEach(group => {
    $$('button', group).forEach(btn => btn.addEventListener('click', () => {
      $$('button', group).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      updateLearningSummary();
    }));
  });
  $$('#learningMethods input').forEach(i => i.addEventListener('change', updateLearningSummary));
  function updateLearningSummary(){
    const methods = $$('#learningMethods input:checked').map(i => i.value);
    const prefs = $$('.either-or button.selected').map(b => b.dataset.value);
    const all = [...methods, ...prefs];
    $('#learningSummary').textContent = all.length
      ? `Your current learning recipe: ${all.slice(0,7).join(', ')}${all.length>7 ? ', and more.' : '.'}`
      : 'Make a few choices and your learning profile will appear here.';
  }

  // Vocabulary explorer
  let activeVocabCat = 'All';
  const cats = ['All', ...new Set(vocab.map(v => v.cat))];
  function renderVocabTabs(){
    $('#vocabTabs').innerHTML = cats.map(c => `<button type="button" class="${c===activeVocabCat?'active':''}" data-cat="${c}">${c}</button>`).join('');
    $$('#vocabTabs button').forEach(btn => btn.addEventListener('click', () => {
      activeVocabCat = btn.dataset.cat;
      renderVocabTabs(); renderVocab();
    }));
  }
  function escapeHtml(value=''){
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }
  function renderVocab(){
    const term = $('#vocabSearch').value.trim().toLowerCase();
    const list = vocab.filter(v => (activeVocabCat==='All' || v.cat===activeVocabCat) && [v.word,v.fr,v.def,v.ex].join(' ').toLowerCase().includes(term));
    $('#vocabGrid').innerHTML = list.map((v,i) => `<article class="vocab-card"><button class="vocab-audio" type="button" data-word="${escapeHtml(v.word)}" aria-label="Listen to ${escapeHtml(v.word)}">🔊</button><h3>${escapeHtml(v.word)}</h3><div class="fr">${escapeHtml(v.fr)}</div><p>${escapeHtml(v.def)}</p><p class="example">"${escapeHtml(v.ex)}"</p></article>`).join('') || '<p>No vocabulary matches your search.</p>';
    $$('.vocab-audio').forEach(b => b.addEventListener('click', () => speak(b.dataset.word)));
  }
  renderVocabTabs(); renderVocab();
  $('#vocabSearch').addEventListener('input', renderVocab);

  // Likes builder
  $('#buildLike').addEventListener('click', () => {
    const starter = $('#likeStarter').value;
    const activity = $('#likeActivity').value.trim();
    const reason = $('#likeReason').value.trim();
    let text = activity ? `${starter} ${activity}` : `${starter}…`;
    if(reason) text += ` ${reason.toLowerCase().startsWith('because') ? reason : 'because ' + reason}`;
    $('#likeOutput').textContent = endSentence(text);
  });

  // Main natural-English quiz
  let quizIndex = 0;
  let quizCorrect = 0;
  let currentQuizOptions = [];
  let quizAnswered = false;
  function renderQuiz(){
    const item = quizData[quizIndex];
    quizAnswered = false;
    currentQuizOptions = shuffle(item.options);
    $('#quizCounter').textContent = `Question ${quizIndex+1} of ${quizData.length}`;
    $('#quizScore').textContent = `${quizCorrect} correct`;
    $('#quizQuestion').innerHTML = `${escapeHtml(item.q)}<small>${escapeHtml(item.prompt)}</small>`;
    $('#quizOptions').innerHTML = currentQuizOptions.map(o => `<button type="button" data-value="${escapeHtml(o)}">${escapeHtml(o)}</button>`).join('');
    $('#quizFeedback').textContent = '';
    $('#quizFeedback').className = 'quiz-feedback';
    $('#quizNext').disabled = true;
    $('#quizNext').textContent = quizIndex === quizData.length-1 ? 'Finish ✓' : 'Next →';
    $$('#quizOptions button').forEach(btn => btn.addEventListener('click', () => answerQuiz(btn, item)));
  }
  function answerQuiz(btn, item){
    if(quizAnswered) return;
    quizAnswered = true;
    const correct = btn.dataset.value === item.answer;
    if(correct) quizCorrect++;
    btn.classList.add(correct ? 'correct' : 'incorrect');
    $$('#quizOptions button').forEach(b => { if(b.dataset.value===item.answer) b.classList.add('correct'); b.disabled=true; });
    $('#quizFeedback').textContent = `${correct ? '✓ Correct.' : '✗ Not quite.'} ${item.explain}`;
    $('#quizFeedback').classList.add(correct ? 'good' : 'bad');
    $('#quizScore').textContent = `${quizCorrect} correct`;
    $('#quizNext').disabled = false;
    recordScore(`main-${quizIndex}`, correct);
  }
  $('#quizHint').addEventListener('click', () => {
    $('#quizFeedback').textContent = `Hint: ${quizData[quizIndex].hint}`;
    $('#quizFeedback').className = 'quiz-feedback';
  });
  $('#quizNext').addEventListener('click', () => {
    if(!quizAnswered) return;
    if(quizIndex < quizData.length-1){ quizIndex++; renderQuiz(); }
    else {
      $('#quizQuestion').innerHTML = `Challenge complete! <small>You scored ${quizCorrect}/${quizData.length}. The goal is to notice the patterns — not to be perfect on day one.</small>`;
      $('#quizOptions').innerHTML = '';
      $('#quizFeedback').textContent = 'We will reuse these structures later so they become automatic.';
      $('#quizFeedback').className = 'quiz-feedback good';
      $('#quizNext').disabled = true;
    }
  });
  renderQuiz();

  // Mini was/were grammar
  function renderGrammarMini(){
    $('#likeGrammarExercises').innerHTML = grammarItems.map((g,i) => `<article class="mini-ex" data-gi="${i}"><p><b>${escapeHtml(g.q)}</b></p><div class="answers">${shuffle(g.options).map(o => `<button type="button" data-value="${escapeHtml(o)}">${escapeHtml(o)}</button>`).join('')}</div><div class="feedback"></div></article>`).join('');
    $$('.mini-ex').forEach(card => {
      const i = Number(card.dataset.gi), g = grammarItems[i];
      $$('button', card).forEach(btn => btn.addEventListener('click', () => {
        if(card.dataset.done) return;
        card.dataset.done='1';
        const correct = btn.dataset.value===g.answer;
        btn.classList.add(correct?'correct':'incorrect');
        $$('button',card).forEach(b => { if(b.dataset.value===g.answer) b.classList.add('correct'); b.disabled=true; });
        $('.feedback',card).textContent = `${correct?'✓ Correct.':'✗ Not quite.'} ${g.explain}`;
        recordScore(`grammar-${i}`,correct);
      }));
    });
  }
  renderGrammarMini();

  // Skill tabs
  $$('.skill-tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.skill-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    $$('.skill-panel').forEach(p => { p.hidden=true; p.classList.remove('active'); });
    const panel = $('#'+tab.dataset.panel);
    panel.hidden=false; panel.classList.add('active');
  }));

  // Micro Qs with first-attempt scoring
  $$('.micro-q').forEach((q, qi) => {
    $$('button', q).forEach(btn => btn.addEventListener('click', () => {
      if(q.dataset.done) return;
      q.dataset.done='1';
      const correct = btn.textContent.trim() === q.dataset.answer;
      btn.classList.add(correct?'correct':'incorrect');
      $$('button',q).forEach(b => { if(b.textContent.trim()===q.dataset.answer) b.classList.add('correct'); b.disabled=true; });
      $('.micro-feedback',q).textContent = correct ? '✓ Correct — precise detail.' : `✗ Not quite. Correct answer: ${q.dataset.answer}`;
      recordScore(`micro-${qi}`,correct);
    }));
  });

  // Writing word count
  function updateWordCount(){
    const words = $('#writingCheckpoint').value.trim().match(/\b[\w’'-]+\b/g) || [];
    $('#writingWords').textContent = words.length;
  }
  $('#writingCheckpoint').addEventListener('input', updateWordCount); updateWordCount();

  // Browser recording
  $('#recordBtn').addEventListener('click', async () => {
    const btn = $('#recordBtn');
    if(mediaRecorder && mediaRecorder.state==='recording'){
      mediaRecorder.stop();
      btn.textContent = '● Start recording';
      $('#recordStatus').textContent = 'Recording stopped. Playback will appear below.';
      return;
    }
    if(!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder){
      $('#recordStatus').textContent = 'Recording is not supported in this browser.';
      return;
    }
    try{
      mediaStream = await navigator.mediaDevices.getUserMedia({audio:true});
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.ondataavailable = e => { if(e.data.size) recordedChunks.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, {type: mediaRecorder.mimeType || 'audio/webm'});
        const audio = $('#recordPlayback');
        audio.src = URL.createObjectURL(blob);
        audio.hidden = false;
        mediaStream?.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      btn.textContent = '■ Stop recording';
      $('#recordStatus').textContent = 'Recording… Speak for about 45–60 seconds.';
    }catch(err){
      $('#recordStatus').textContent = 'Microphone permission was not granted. You can still do the speaking task live.';
    }
  });

  function recordScore(key, correct){
    if(!scoreState.has(key)) scoreState.set(key, !!correct);
    updateAutoScore();
  }
  function updateAutoScore(){
    const vals = [...scoreState.values()];
    const correct = vals.filter(Boolean).length;
    const pct = vals.length ? Math.round(correct/vals.length*100) : 0;
    $('#autoScore').textContent = `${pct}%`;
    $('#autoScoreDetail').textContent = vals.length ? `${correct} correct first attempts out of ${vals.length} completed interactive questions.` : 'Complete the interactive questions to generate a score.';
  }

  // Generic local save/load
  function collectState(){
    const fields = {};
    $$('input[id], textarea[id], select[id]').forEach(el => {
      if(el.type==='checkbox') fields[el.id] = el.checked;
      else if(el.type==='range') fields[el.id] = el.value;
      else fields[el.id] = el.value;
    });
    return {
      fields,
      admin: $$('#adminChecklist input').map(i => i.checked),
      why: $$('#whyChoices button').map(b => b.classList.contains('selected')),
      methods: $$('#learningMethods input').map(i => i.checked),
      prefs: $$('.either-or').map(g => $$('button',g).findIndex(b => b.classList.contains('selected'))),
      objectives: $$('#objectiveChecks input').map(i => i.checked),
      introOutput: $('#introOutput').textContent,
      likeOutput: $('#likeOutput').textContent,
      confidence: $$('#confidenceGrid input').map(i=>i.value),
      savedAt: new Date().toISOString()
    };
  }
  function saveProgress(show=true){
    localStorage.setItem(storageKey, JSON.stringify(collectState()));
    if(show){
      $('#saveStatus').textContent = 'Saved in this browser.';
      showToast('Progress saved in this browser.');
    }
  }
  function loadProgress(){
    try{
      const s = JSON.parse(localStorage.getItem(storageKey));
      if(!s) return;
      Object.entries(s.fields||{}).forEach(([id,val]) => {
        const el = $('#'+CSS.escape(id)); if(!el) return;
        if(el.type==='checkbox') el.checked=!!val; else el.value=val;
      });
      $$('#adminChecklist input').forEach((i,n)=>i.checked=!!s.admin?.[n]);
      $$('#whyChoices button').forEach((b,n)=>b.classList.toggle('selected',!!s.why?.[n]));
      $$('#learningMethods input').forEach((i,n)=>i.checked=!!s.methods?.[n]);
      $$('.either-or').forEach((g,n)=>{ $$('button',g).forEach((b,bi)=>b.classList.toggle('selected',bi===s.prefs?.[n])); });
      $$('#objectiveChecks input').forEach((i,n)=>i.checked=!!s.objectives?.[n]);
      if(s.introOutput) $('#introOutput').textContent=s.introOutput;
      if(s.likeOutput) $('#likeOutput').textContent=s.likeOutput;
      $$('#confidenceGrid input').forEach((i,n)=>{ if(s.confidence?.[n]) i.value=s.confidence[n]; i.dispatchEvent(new Event('input')); });
      updateAdmin(); updateLearningSummary(); updateWordCount();
      $('#saveStatus').textContent = 'Previous browser progress restored.';
    }catch(e){ console.warn('Could not restore saved progress',e); }
  }
  $('#saveLocal').addEventListener('click', () => saveProgress(true));

  function reportHtml(){
    const selectedReasons = $$('#whyChoices button.selected').map(b=>b.dataset.value);
    const learningMethods = $$('#learningMethods input:checked').map(i=>i.value);
    const preferences = $$('.either-or button.selected').map(b=>b.dataset.value);
    const confidence = $$('#confidenceGrid input').map(i=>`${i.dataset.skill}: ${i.value}/5`);
    const objectives = $$('#objectiveChecks input:checked').map(i=>i.value);
    const auto = $('#autoScore').textContent;
    const safe = v => escapeHtml(v || '—');
    const list = a => a.length ? `<ul>${a.map(x=>`<li>${safe(x)}</li>`).join('')}</ul>` : '<p>—</p>';
    return `<!doctype html><html><head><meta charset="utf-8"><title>Lesson 1 Report — Véronique SEROR</title><style>
      body{font-family:Arial,sans-serif;color:#1c2b3a;max-width:900px;margin:40px auto;padding:0 24px;line-height:1.55}h1,h2{color:#1f3a52}h1{border-bottom:4px solid #d9603c;padding-bottom:12px}section{margin:28px 0;padding:18px;border:1px solid #d9d1c1;border-radius:12px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.score{font-size:2.2rem;font-weight:700;color:#b84a2c}.muted{color:#5f7079}.box{background:#faf5e9;padding:12px;border-radius:8px}@media print{body{margin:0;max-width:none}section{break-inside:avoid}}
    </style></head><body>
      <h1>Lesson 1 — Getting to Know Each Other (Véronique SEROR)</h1>
      <p class="muted">First-lesson progress report · generated ${new Date().toLocaleString()}</p>
      <section><h2>Starting point</h2><p><b>Programme:</b> 17h30 · B1.1− → B1.1+ · everyday/travel English · progressive LILATE preparation</p></section>
      <section><h2>Personal reasons & goals</h2><h3>Why English matters</h3>${list(selectedReasons)}<div class="box">${safe($('#whyText').value)}</div><h3>Communication goal</h3><p>${safe($('#goalCommunication').value)}</p><h3>Travel goal</h3><p>${safe($('#goalTravel').value)}</p><h3>English habit</h3><p>${safe($('#goalHabit').value)}</p></section>
      <section><h2>First introduction</h2><div class="box">${safe($('#introOutput').textContent)}</div></section>
      <section><h2>Confidence snapshot</h2>${list(confidence)}<p><b>Biggest difference:</b> ${safe($('#biggestDifference').value)}</p></section>
      <section><h2>Learning profile</h2><h3>Helpful methods</h3>${list(learningMethods)}<h3>Preferences</h3>${list(preferences)}</section>
      <section><h2>Interactive practice</h2><div class="score">${safe(auto)}</div><p>${safe($('#autoScoreDetail').textContent)}</p></section>
      <section><h2>Observed objectives</h2>${list(objectives)}</section>
      <section><h2>Teacher assessment</h2><div class="grid"><div><h3>Oral</h3><p>Fluency: ${safe($('#oralFluency').value)}<br>Range: ${safe($('#oralRange').value)}<br>Interaction: ${safe($('#oralInteraction').value)}</p></div><div><h3>Writing</h3><p>Clarity: ${safe($('#writeClarity').value)}<br>Accuracy: ${safe($('#writeAccuracy').value)}<br>Organisation: ${safe($('#writeOrganisation').value)}</p></div></div></section>
      <section><h2>Teacher notes</h2><div class="box">${safe($('#teacherNotes').value).replace(/\n/g,'<br>')}</div><h2>Learner reflection</h2><div class="box">${safe($('#learnerReflection').value).replace(/\n/g,'<br>')}</div></section>
    </body></html>`;
  }
  function downloadReport(){
    const blob = new Blob([reportHtml()], {type:'text/html;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Veronique_Lesson_1_Report.html';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),500);
  }
  $('#downloadReport').addEventListener('click', downloadReport);
  $('#printReport').addEventListener('click', () => {
    const win = window.open('', '_blank');
    if(!win){ showToast('Pop-ups are blocked. Please allow them to print the report.'); return; }
    win.document.write(reportHtml()); win.document.close();
    setTimeout(()=>{ win.focus(); win.print(); },250);
  });

  $('#resetAll').addEventListener('click', () => {
    if(!confirm('Reset all answers and locally saved progress for this lesson?')) return;
    localStorage.removeItem(storageKey);
    $$('input[type=text], input[type=search], textarea').forEach(el=>el.value='');
    $$('input[type=checkbox]').forEach(el=>el.checked=false);
    $$('input[type=range]').forEach(el=>{el.value='3';el.dispatchEvent(new Event('input'));});
    $$('select').forEach(el=>el.selectedIndex=0);
    $$('.selected').forEach(el=>el.classList.remove('selected'));
    $('#introOutput').textContent='Your introduction will appear here.';
    $('#likeOutput').textContent='Your sentence will appear here.';
    scoreState.clear(); quizIndex=0; quizCorrect=0; renderQuiz(); renderGrammarMini(); updateAutoScore(); updateAdmin(); updateLearningSummary(); renderVocab(); updateWordCount();
    $('#saveStatus').textContent='';
    showToast('Lesson reset.');
    scrollTo({top:0,behavior:'smooth'});
  });

  loadProgress();
})();
