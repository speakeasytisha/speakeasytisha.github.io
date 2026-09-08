(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const storageKey = 'se_edith_lesson1_v1';
  let accent = 'en-GB';
  let toastTimer;
  let mediaRecorder = null;
  let mediaStream = null;
  let recordedChunks = [];

  const scoreState = new Map();

  const quizData = [
    {
      q: 'Je regarde actuellement une série.',
      prompt: 'Choose the most natural English sentence.',
      options: ['I actually watch a series.', "I'm currently watching a series.", 'I current watch a series.'],
      answer: "I'm currently watching a series.",
      hint: '“Actually” usually means “en fait / en réalité”.',
      explain: 'Use “currently” or “at the moment” for “actuellement”.'
    },
    {
      q: "J'ai voyagé en Chine l'année dernière.",
      prompt: 'Choose the sentence that focuses on the destination.',
      options: ['I travelled in China last year.', 'I travelled to China last year.', 'I travelled at China last year.'],
      answer: 'I travelled to China last year.',
      hint: 'Think: movement + destination.',
      explain: 'Use “travel to + destination”. “Travel in China” can mean travelling around inside China.'
    },
    {
      q: "D'autres pays",
      prompt: 'Choose the correct noun phrase.',
      options: ['others countries', 'another countries', 'other countries'],
      answer: 'other countries',
      hint: 'One form goes before a noun; the other replaces the noun.',
      explain: 'Use “other + noun”. “Others” is a pronoun: Some countries are large; others are small.'
    },
    {
      q: "J'aime ce genre d'histoire.",
      prompt: 'Choose the natural structure.',
      options: ['I like this kind of story.', 'I like this kind of stories.', 'I like these kind of story.'],
      answer: 'I like this kind of story.',
      hint: 'After “this kind of”, keep the noun singular.',
      explain: 'Use “this kind of + singular noun”. You can also say “these kinds of stories”.'
    },
    {
      q: "La France n'est pas au même niveau que ce pays.",
      prompt: 'Choose the correct comparison.',
      options: ['France is not at the same level as this country.', 'France is not as the same level as this country.', 'France is not in the same level than this country.'],
      answer: 'France is not at the same level as this country.',
      hint: 'The structure is: at the same level + ___',
      explain: 'Use “at the same level as”.'
    },
    {
      q: 'Je voudrais parler anglais avec plus d’aisance.',
      prompt: 'Choose the best structure for a goal.',
      options: ["I'd like speaking English more easily.", "I'd like to speak English more easily.", 'I like to speak English more easily.'],
      answer: "I'd like to speak English more easily.",
      hint: 'A goal or wish uses “would like…”.',
      explain: 'Use “would like to + base verb” for something you want to do.'
    }
  ];

  const vocab = [
    {cat:'Goals', word:'confident', fr:'confiant(e)', def:'feeling sure that you can do something', ex:'I want to feel more confident when I speak English.'},
    {cat:'Goals', word:'independent', fr:'autonome', def:'able to do things without needing much help', ex:'I would like to be more independent when I travel.'},
    {cat:'Goals', word:'improve', fr:'améliorer', def:'to make something better', ex:'I want to improve my listening skills.'},
    {cat:'Goals', word:'fluency', fr:'fluidité / aisance', def:'the ability to speak smoothly and with fewer pauses', ex:'My goal is to develop more fluency.'},
    {cat:'Goals', word:'accurate', fr:'précis(e) / exact(e)', def:'correct and precise', ex:'I want my English to become more accurate.'},
    {cat:'Learning', word:'repeat', fr:'répéter', def:'to say or do something again', ex:'Could you repeat that, please?'},
    {cat:'Learning', word:'notice', fr:'remarquer', def:'to become aware of a detail', ex:'I learn better when I notice patterns in examples.'},
    {cat:'Learning', word:'correct', fr:'corriger', def:'to change something that is wrong', ex:'I like to correct my mistakes after speaking.'},
    {cat:'Learning', word:'remember', fr:'se souvenir / retenir', def:'to keep information in your memory', ex:'Writing examples helps me remember new words.'},
    {cat:'Learning', word:'practice', fr:"s'entraîner / pratiquer", def:'to repeat an activity in order to improve', ex:'Short practice activities help me progress.'},
    {cat:'Conversation', word:'follow-up question', fr:'question de relance', def:'a question that continues a conversation', ex:'A follow-up question can make a conversation more natural.'},
    {cat:'Conversation', word:'explain', fr:'expliquer', def:'to make an idea clear by giving details', ex:'Could you explain what you mean?'},
    {cat:'Conversation', word:'recommend', fr:'recommander', def:'to say that something is good or worth trying', ex:'I would recommend this city because it is easy to explore.'},
    {cat:'Conversation', word:'opinion', fr:'avis / opinion', def:'what you think or believe about something', ex:'In my opinion, travelling is a good way to learn.'},
    {cat:'Conversation', word:'at the moment', fr:'en ce moment / actuellement', def:'now; during the current period', ex:"I'm watching a new series at the moment."},
    {cat:'Travel', word:'destination', fr:'destination', def:'the place you are travelling to', ex:'Japan is one of my dream destinations.'},
    {cat:'Travel', word:'accommodation', fr:'hébergement', def:'a place where you stay during a trip', ex:'We need to book accommodation near the city centre.'},
    {cat:'Travel', word:'get around', fr:'se déplacer', def:'to travel from place to place in an area', ex:'It is easy to get around the city by tram.'},
    {cat:'Travel', word:'book', fr:'réserver', def:'to arrange and reserve something in advance', ex:"I'd like to book a table for two."},
    {cat:'Travel', word:'local', fr:'local(e)', def:'connected with the area where you are', ex:'I like discovering local food when I travel.'},
    {cat:'Preferences', word:'enjoy', fr:'aimer / apprécier', def:'to take pleasure in something', ex:'I enjoy discovering new cultures.'},
    {cat:'Preferences', word:"don't mind", fr:'ne pas être dérangé(e) par', def:'to have no strong objection to something', ex:"I don't mind travelling by train."},
    {cat:'Preferences', word:'interested in', fr:'intéressé(e) par', def:'wanting to know more about something', ex:"I'm interested in history and architecture."},
    {cat:'Preferences', word:'prefer', fr:'préférer', def:'to like one thing more than another', ex:'I prefer small towns to very busy cities.'},
    {cat:'Preferences', word:'would love to', fr:'adorerais / aimerais beaucoup', def:'to strongly want to do something', ex:'I would love to visit New Zealand one day.'}
  ];

  const grammarItems = [
    {q:'I ___ travelling.', options:['like', 'would like to'], answer:'like', explain:'General enjoyment → like + -ing.'},
    {q:'I ___ visit Canada one day.', options:['like', 'would like to'], answer:'would like to', explain:'A future wish → would like to + verb.'},
    {q:'I ___ learn more vocabulary during this programme.', options:['like', 'would like to'], answer:'would like to', explain:'A goal → would like to + verb.'},
    {q:'I ___ discovering new cultures.', options:['like', 'would like to'], answer:'like', explain:'General enjoyment → like + -ing.'}
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
    $('#vocabGrid').innerHTML = list.map((v,i) => `<article class="vocab-card"><button class="vocab-audio" type="button" data-word="${escapeHtml(v.word)}" aria-label="Listen to ${escapeHtml(v.word)}">🔊</button><h3>${escapeHtml(v.word)}</h3><div class="fr">${escapeHtml(v.fr)}</div><p>${escapeHtml(v.def)}</p><p class="example">“${escapeHtml(v.ex)}”</p></article>`).join('') || '<p>No vocabulary matches your search.</p>';
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

  // Mini like/would like grammar
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
    return `<!doctype html><html><head><meta charset="utf-8"><title>Lesson 1 Report — Getting to Know Each Other</title><style>
      body{font-family:Arial,sans-serif;color:#183431;max-width:900px;margin:40px auto;padding:0 24px;line-height:1.55}h1,h2{color:#173c3a}h1{border-bottom:4px solid #d96b52;padding-bottom:12px}section{margin:28px 0;padding:18px;border:1px solid #d9d1c1;border-radius:12px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.score{font-size:2.2rem;font-weight:700;color:#bd4f3a}.muted{color:#687873}.box{background:#faf5e9;padding:12px;border-radius:8px}@media print{body{margin:0;max-width:none}section{break-inside:avoid}}
    </style></head><body>
      <h1>Lesson 1 — Getting to Know Each Other</h1>
      <p class="muted">First-lesson progress report · generated ${new Date().toLocaleString()}</p>
      <section><h2>Starting point</h2><p><b>Programme:</b> 19 hours · A2.2+ → B1.1− · everyday/travel English · progressive Bright preparation</p></section>
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
    a.download = 'Lesson_1_Getting_to_Know_Each_Other_Report.html';
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
