/* SpeakEasyTisha • English Tenses Power Lesson
   - Tap-friendly
   - US/UK voice
   - Quizzes + builders
   - Local progress
*/
(() => {
  'use strict';

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const shuffle = (arr)=>{ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; };
  const esc = (s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const attr = (s)=>esc(s).replace(/"/g,'&quot;');

  // Speech
  let currentVoicePref = 'US';
  let voiceCache = [];
  function refreshVoices(){ voiceCache = speechSynthesis.getVoices ? speechSynthesis.getVoices() : []; }
  refreshVoices();
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = refreshVoices;

  function pickVoice(){
    if (!voiceCache || !voiceCache.length) return null;
    const want = currentVoicePref === 'UK' ? ['en-GB','en_GB'] : ['en-US','en_US'];
    let v = voiceCache.find(vo => want.some(w => (vo.lang||'').includes(w)));
    if (!v) v = voiceCache.find(vo => (vo.lang||'').toLowerCase().startsWith('en'));
    return v || null;
  }
  function speak(text){
    if (!('speechSynthesis' in window)) return;
    const t = (text||'').trim();
    if (!t) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = 1.0; u.pitch = 1.0;
    speechSynthesis.speak(u);
  }
  function pauseOrResume(){
    if (!('speechSynthesis' in window)) return;
    if (speechSynthesis.speaking && !speechSynthesis.paused) speechSynthesis.pause();
    else if (speechSynthesis.paused) speechSynthesis.resume();
  }
  function stopSpeak(){ if ('speechSynthesis' in window) speechSynthesis.cancel(); }

  // Score
  const score = { now:0, max:0, earned:new Set() };
  const scoreNow = () => $('#scoreNow').textContent = String(score.now);
  const scoreMax = () => $('#scoreMax').textContent = String(score.max);
  function bumpMax(points){ score.max += points; scoreMax(); }
  function award(taskId, points){
    if (score.earned.has(taskId)) return false;
    score.earned.add(taskId);
    score.now += points;
    scoreNow();
    return true;
  }
  function resetTask(taskId, points){
    if (!score.earned.has(taskId)) return;
    score.earned.delete(taskId);
    score.now = Math.max(0, score.now - points);
    scoreNow();
  }
  function resetAllScore(){ score.now=0; score.max=0; score.earned.clear(); scoreNow(); scoreMax(); }

  // Data
  const CORE_ORDER = ['pres_simple','pres_cont','past_simple','past_cont','pres_perf','past_perf','future_will','future_going'];
  const RARE_IDS = ['pres_perf_cont','future_cont','future_perf','past_perf_cont','future_perf_cont'];

  const TENSES = [
    {id:'pres_simple', core:true, icon:'🧭', group:'Present', aspect:'Simple', label:'Present Simple',
      fr:'Présent simple (habitudes, faits, états)',
      when:['routines & habits (every day, usually)','facts & permanent truths','states (like, know, want)','timetables (The train leaves at 6.)'],
      form:{aff:'I/you/we/they work. • He/she works.', neg:'I don’t work. • He doesn’t work.', q:'Do you work? • Does she work?'},
      signal:['usually','often','every day','never','always','on Mondays'],
      examples:[{en:'I usually drink coffee in the morning.', fr:'Je bois généralement du café le matin.'},{en:'She works in marketing.', fr:'Elle travaille dans le marketing.'}],
      pitfall:'French often uses present for “right now”. In English: present continuous for “now”.',
      miniQuiz:[
        {id:'ps1', q:'Choose the best for a routine:', opts:['I am going to work every day.','I work every day.','I have worked every day.'], a:1, why:'Routine → present simple.'},
        {id:'ps2', q:'Choose the best for a fact:', opts:['Water is boiling at 100°C.','Water boils at 100°C.','Water has boiled at 100°C.'], a:1, why:'Facts/truths → present simple.'}
      ]
    },
    {id:'pres_cont', core:true, icon:'📍', group:'Present', aspect:'Continuous', label:'Present Continuous',
      fr:'Présent continu (action en cours / temporaire)',
      when:['now / at the moment','temporary situations (this week, these days)','annoying habits with always','future arrangements (I’m meeting him tomorrow.)'],
      form:{aff:'am/is/are + V‑ing (I am working.)', neg:'am/is/are not + V‑ing', q:'Am/Is/Are + subject + V‑ing?'},
      signal:['now','right now','at the moment','today','this week'],
      examples:[{en:'I’m studying right now.', fr:'Je suis en train d’étudier.'},{en:'She’s working from home this week.', fr:'Elle travaille à la maison cette semaine.'}],
      pitfall:'“I am agree” ❌ → “I agree.” (state verb = simple).',
      miniQuiz:[
        {id:'pc1', q:'Choose the best for “now”:', opts:['I watch TV.','I’m watching TV.','I’ve watched TV.'], a:1, why:'Now → present continuous.'},
        {id:'pc2', q:'Choose the best for a temporary situation:', opts:['He lives in Paris this month.','He is living in Paris this month.','He has lived in Paris this month.'], a:1, why:'Temporary → present continuous.'}
      ]
    },
    {id:'past_simple', core:true, icon:'📌', group:'Past', aspect:'Simple', label:'Past Simple',
      fr:'Prétérit (action terminée dans le passé)',
      when:['finished actions (yesterday, last week)','a series of events in a story','past facts (when the time is finished)'],
      form:{aff:'V2 / -ed (I worked, I went.)', neg:'did not + base (I didn’t work.)', q:'Did + subject + base?'},
      signal:['yesterday','last night','in 2019','two days ago','when I was…'],
      examples:[{en:'I met her yesterday.', fr:'Je l’ai rencontrée hier.'},{en:'We went to London in 2019.', fr:'Nous sommes allés à Londres en 2019.'}],
      pitfall:'No “did” in affirmative: “I did went” ❌ → “I went” ✅.',
      miniQuiz:[
        {id:'pa1', q:'Choose the correct:', opts:['I meet him yesterday.','I met him yesterday.','I have met him yesterday.'], a:1, why:'Finished past time → past simple.'},
        {id:'pa2', q:'Choose the correct negative:', opts:['I didn’t went.','I didn’t go.','I don’t went.'], a:1, why:'didn’t + base form.'}
      ]
    },
    {id:'past_cont', core:true, icon:'🎥', group:'Past', aspect:'Continuous', label:'Past Continuous',
      fr:'Imparfait/continu (action en cours dans le passé)',
      when:['an action in progress at a past time','background + interruption (I was cooking when you called.)','two actions in progress (while)'],
      form:{aff:'was/were + V‑ing', neg:'was/were not + V‑ing', q:'Was/Were + subject + V‑ing?'},
      signal:['while','when','at 8pm','all day'],
      examples:[{en:'I was driving when she texted.', fr:'Je conduisais quand elle a envoyé un message.'},{en:'They were talking while we were eating.', fr:'Ils parlaient pendant que nous mangions.'}],
      pitfall:'Use past simple for the interruption.',
      miniQuiz:[
        {id:'pac1', q:'Choose the best:', opts:['I cooked when you called.','I was cooking when you called.','I have been cooking when you called.'], a:1, why:'Background action in progress.'},
        {id:'pac2', q:'Pick the interruption event:', opts:['was walking','walked','was walking'], a:1, why:'Interruption → past simple.'}
      ]
    },
    {id:'pres_perf', core:true, icon:'🔗', group:'Present', aspect:'Perfect', label:'Present Perfect',
      fr:'Present perfect (lien passé → présent)',
      when:['life experience (ever/never)','recent past with result (already, just)','unfinished time (today, this week)','duration up to now (for/since)'],
      form:{aff:'have/has + past participle', neg:'haven’t/hasn’t + past participle', q:'Have/Has + subject + past participle?'},
      signal:['already','just','yet','ever','never','today','this week','for','since'],
      examples:[{en:'I’ve never been to Japan.', fr:'Je ne suis jamais allé(e) au Japon.'},{en:'She has just finished her report.', fr:'Elle vient de finir son rapport.'}],
      pitfall:'Don’t use with finished past time: “yesterday”.',
      miniQuiz:[
        {id:'pp1', q:'Choose the best for life experience:', opts:['I went to Rome.','I have been to Rome.','I was going to Rome.'], a:1, why:'Experience (no date) → present perfect.'},
        {id:'pp2', q:'Choose the best for unfinished time:', opts:['Today I saw her.','Today I have seen her.','Today I see her.'], a:1, why:'Today is unfinished → present perfect.'}
      ]
    },
    {id:'past_perf', core:true, icon:'⏮️', group:'Past', aspect:'Perfect', label:'Past Perfect',
      fr:'Plus-que-parfait (antériorité dans le passé)',
      when:['one past action before another past action','storytelling: “before that…”','reported past with sequence'],
      form:{aff:'had + past participle', neg:'hadn’t + past participle', q:'Had + subject + past participle?'},
      signal:['before','already','by the time','when (past)'],
      examples:[{en:'When I arrived, they had already left.', fr:'Quand je suis arrivé(e), ils étaient déjà partis.'},{en:'She had never flown before that day.', fr:'Elle n’avait jamais pris l’avion avant ce jour-là.'}],
      pitfall:'Don’t overuse. Use it when sequence matters.',
      miniQuiz:[
        {id:'pperf1', q:'Choose the best sequence:', opts:['When I arrived, they left.','When I arrived, they had left.','When I arrived, they were leaving.'], a:1, why:'Leaving happened before arriving.'},
        {id:'pperf2', q:'Choose the best:', opts:['I didn’t eat because I had eaten.','I didn’t eat because I ate.','I didn’t eat because I was eat.'], a:0, why:'Earlier action explains later result.'}
      ]
    },
    {id:'future_will', core:true, icon:'🔮', group:'Future', aspect:'Modal', label:'Future with WILL',
      fr:'Futur avec will (décision, prédiction, promesse)',
      when:['instant decision','prediction/opinion','promise/offer'],
      form:{aff:'will + base', neg:'won’t + base', q:'Will + subject + base?'},
      signal:['I think','probably','soon','tomorrow (prediction)'],
      examples:[{en:'I’ll text you in a minute.', fr:'Je te texte dans une minute.'},{en:'I think it will be great.', fr:'Je pense que ce sera super.'}],
      pitfall:'Will ≠ plan by default. For plans, often “going to”.',
      miniQuiz:[
        {id:'fw1', q:'You decide now:', opts:['I’m going to open the window.','I’ll open the window.','I open the window.'], a:1, why:'Decision now → will.'},
        {id:'fw2', q:'Prediction:', opts:['It will snow tomorrow.','It is snowing tomorrow.','It snows tomorrow.'], a:0, why:'Prediction → will.'}
      ]
    },
    {id:'future_going', core:true, icon:'🗓️', group:'Future', aspect:'Plan', label:'Be going to',
      fr:'Futur proche (plan/intention, preuve visible)',
      when:['plans/intentions','prediction based on evidence'],
      form:{aff:'am/is/are going to + base', neg:'am/is/are not going to + base', q:'Am/Is/Are + subject + going to + base?'},
      signal:['tonight','next week','this weekend','look!'],
      examples:[{en:'I’m going to cook tonight.', fr:'Je vais cuisiner ce soir.'},{en:'It’s going to rain — look at the sky.', fr:'Il va pleuvoir — regarde le ciel.'}],
      pitfall:'“I go to cook” ❌ → “I’m going to cook” ✅.',
      miniQuiz:[
        {id:'fg1', q:'A plan for this weekend:', opts:['I will visit my parents.','I’m going to visit my parents.','I visit my parents.'], a:1, why:'Plan → going to.'},
        {id:'fg2', q:'Evidence prediction:', opts:['It’s going to rain.','It rains.','It was raining.'], a:0, why:'Evidence → going to.'}
      ]
    },

    {id:'pres_perf_cont', core:false, icon:'⏱️', group:'Present', aspect:'Perfect continuous', label:'Present Perfect Continuous',
      fr:'Present perfect continu (durée + action récente)',
      when:['activity continuing or just stopped with present result','emphasis on duration'],
      form:{aff:'have/has been + V‑ing', neg:'haven’t/hasn’t been + V‑ing', q:'Have/Has + subject + been + V‑ing?'},
      signal:['for','since','lately','recently'],
      examples:[{en:'I’ve been studying for two hours.', fr:'J’étudie depuis deux heures.'},{en:'She’s tired because she’s been working all day.', fr:'Elle est fatiguée parce qu’elle a travaillé toute la journée.'}],
      pitfall:'Less common; use when duration/activity is the focus.', miniQuiz:[]
    },
    {id:'future_cont', core:false, icon:'🛰️', group:'Future', aspect:'Continuous', label:'Future Continuous',
      fr:'Futur continu (action en cours à un moment futur)',
      when:['future in progress at a specific time','polite questions'],
      form:{aff:'will be + V‑ing', neg:'won’t be + V‑ing', q:'Will + subject + be + V‑ing?'},
      signal:['this time tomorrow','at 8pm tomorrow','later'],
      examples:[{en:'This time tomorrow, I’ll be flying to NYC.', fr:'Demain à cette heure-ci, je serai en train de voler vers NYC.'}],
      pitfall:'Less common; use for “future in progress”.', miniQuiz:[]
    },
    {id:'future_perf', core:false, icon:'🏁', group:'Future', aspect:'Perfect', label:'Future Perfect',
      fr:'Futur antérieur (deadline)',
      when:['by a deadline','looking back from the future'],
      form:{aff:'will have + past participle', neg:'won’t have + past participle', q:'Will + subject + have + past participle?'},
      signal:['by Friday','by the time','in two weeks'],
      examples:[{en:'By next month, I’ll have finished the project.', fr:'D’ici le mois prochain, j’aurai fini le projet.'}],
      pitfall:'Needs a deadline (“by…”).', miniQuiz:[]
    },
    {id:'past_perf_cont', core:false, icon:'🧵', group:'Past', aspect:'Perfect continuous', label:'Past Perfect Continuous',
      fr:'Plus-que-parfait continu (durée avant un point passé)',
      when:['duration up to a past moment','explaining a past result'],
      form:{aff:'had been + V‑ing', neg:'hadn’t been + V‑ing', q:'Had + subject + been + V‑ing?'},
      signal:['for','since','before'],
      examples:[{en:'She had been waiting for 20 minutes when he arrived.', fr:'Elle attendait depuis 20 minutes quand il est arrivé.'}],
      pitfall:'Rare; use when duration is key.', miniQuiz:[]
    },
    {id:'future_perf_cont', core:false, icon:'🧪', group:'Future', aspect:'Perfect continuous', label:'Future Perfect Continuous',
      fr:'Futur antérieur continu (durée jusqu’à une date)',
      when:['duration up to a deadline'],
      form:{aff:'will have been + V‑ing', neg:'won’t have been + V‑ing', q:'Will + subject + have been + V‑ing?'},
      signal:['by June','for five years'],
      examples:[{en:'By June, I’ll have been living here for five years.', fr:'En juin, cela fera cinq ans que je vivrai ici.'}],
      pitfall:'Very rare; useful in formal contexts.', miniQuiz:[]
    },
  ];

  const WHY_REASONS = [
    {title:'English likes “aspect” choices', txt:'Simple vs continuous vs perfect adds meaning. We choose how we “see” the action.'},
    {title:'Modals reduce heavy tense forms', txt:'can/could/would/might/should express ability, politeness, possibility, advice — without complex tense endings.'},
    {title:'“Shall” became less common', txt:'Will became the default future marker, especially in American English. “Shall we…?” survives as a polite suggestion.'},
    {title:'Informal speech prefers shorter forms', txt:'Daily English favors efficient forms (I’ll, I’ve, I’m) and context.'},
    {title:'Some forms are “niche”', txt:'Future perfect continuous is useful, but only when you need a deadline + duration emphasis.'}
  ];

  const WHY_QUIZ = [
    {id:'w1', q:'Why is “will” more common than “shall” today?', opts:['Because “shall” is illegal.','Because “will” became the default future marker in modern English.','Because “shall” means past.'], a:1, why:'Will became the main future modal in modern usage.'},
    {id:'w2', q:'What do modals help English do?', opts:['Avoid meaning.','Express ability/possibility/politeness without long tense forms.','Remove verbs.'], a:1, why:'Modals carry meaning efficiently.'},
    {id:'w3', q:'Why is future perfect continuous rare?', opts:['It is wrong grammar.','It needs a deadline + duration emphasis, which is not needed often.','It only exists in British English.'], a:1, why:'It’s correct, just niche.'}
  ];

  const MIX_QUIZ = [
    {id:'m1', prompt:'Right now I ____ dinner. (now)', opts:['cook','am cooking','have cooked'], a:1, explain:'Now → present continuous.'},
    {id:'m2', prompt:'I ____ here for 10 years. (duration up to now)', opts:['live','lived','have lived'], a:2, explain:'For/since → present perfect.'},
    {id:'m3', prompt:'Yesterday we ____ to the cinema.', opts:['go','went','have gone'], a:1, explain:'Finished past time → past simple.'},
    {id:'m4', prompt:'When you called, I ____.', opts:['was driving','drove','have driven'], a:0, explain:'Background in progress → past continuous.'},
    {id:'m5', prompt:'By Friday, I ____ the report.', opts:['will finish','will have finished','have finished'], a:1, explain:'Deadline → future perfect.'},
    {id:'m6', prompt:'Look at those clouds! It ____.', opts:['will rain','is raining','is going to rain'], a:2, explain:'Evidence prediction → going to.'},
    {id:'m7', prompt:'When I arrived, they ____ already ____.', opts:['have / left','had / left','were / leaving'], a:1, explain:'Earlier past action → past perfect.'},
    {id:'m8', prompt:'I usually ____ up at 7.', opts:['get','am getting','have gotten'], a:0, explain:'Routine → present simple.'}
  ];

  const FIX_ITEMS = [
    {wrong:'I am agree with you.', correct:'I agree with you.', hint:'State verb “agree” → simple present, not continuous.'},
    {wrong:'I have met him yesterday.', correct:'I met him yesterday.', hint:'Finished past time (yesterday) → past simple.'},
    {wrong:'Since 3 years, I live in France.', correct:'I have lived in France for 3 years.', hint:'Use present perfect for duration up to now. For + duration, since + starting point.'},
    {wrong:'I didn’t went to work.', correct:'I didn’t go to work.', hint:'didn’t + base form.'},
    {wrong:'I go to cook tonight.', correct:'I’m going to cook tonight.', hint:'Plan → be going to.'},
    {wrong:'When I arrived, they left already.', correct:'When I arrived, they had already left.', hint:'Sequence: leaving happened before arriving → past perfect.'}
  ];

  const TRANS_BASE = [
    {id:'b1', base:'I work in the city.', verb:'work', obj:'in the city'},
    {id:'b2', base:'She travels a lot.', verb:'travel', obj:'a lot', subj:'She'},
    {id:'b3', base:'We eat at home.', verb:'eat', obj:'at home', subj:'We'},
    {id:'b4', base:'They go to the gym.', verb:'go', obj:'to the gym', subj:'They'}
  ];
  const IRREG = { go:{past:'went', pp:'gone'}, eat:{past:'ate', pp:'eaten'}, travel:{past:'traveled', pp:'traveled'}, work:{past:'worked', pp:'worked'} };
  const TRANS_TARGETS = [
    {id:'past_simple', label:'Past simple'},
    {id:'pres_cont', label:'Present continuous'},
    {id:'pres_perf', label:'Present perfect'},
    {id:'future_will', label:'Future (will)'},
    {id:'future_going', label:'Future (going to)'},
    {id:'past_perf', label:'Past perfect (context)'}
  ];

  const STORY = {
    start:'s1',
    nodes:{
      s1:{who:'Narrator', text:'You are telling your friend about your week.', choices:[
        {text:'This week, I have worked a lot.', next:'s2', ok:true, explain:'Unfinished time (this week) → present perfect.', points:3},
        {text:'This week, I worked a lot.', next:'s2', ok:false, explain:'Possible, but “this week” is unfinished; present perfect is more natural.', points:1}
      ]},
      s2:{who:'Friend', text:'What are you doing right now?', choices:[
        {text:'I’m studying English right now.', next:'s3', ok:true, explain:'Now → present continuous.', points:3},
        {text:'I study English right now.', next:'s3', ok:false, explain:'For “now”, use present continuous.', points:1}
      ]},
      s3:{who:'Friend', text:'And yesterday?', choices:[
        {text:'Yesterday, I met a friend for coffee.', next:'s4', ok:true, explain:'Finished past time → past simple.', points:3},
        {text:'Yesterday, I have met a friend for coffee.', next:'s4', ok:false, explain:'No present perfect with yesterday.', points:1}
      ]},
      s4:{who:'Friend', text:'What happened before you arrived?', choices:[
        {text:'When I arrived, they had already started.', next:'end', ok:true, explain:'Earlier past action → past perfect.', points:3},
        {text:'When I arrived, they started already.', next:'end', ok:false, explain:'Past perfect makes the sequence clear.', points:1}
      ]},
      end:{who:'Narrator', text:'Nice! You used tenses to show time and meaning. 🎉', choices:[]}
    }
  };

  // UI helpers
  function setPill(el, text, kind=''){
    el.textContent = text || '';
    el.className = 'pill' + (kind ? ' ' + kind : '');
  }

  function renderQuiz(host, items, pointsPer=2, prefix='q'){
    host.innerHTML = '';
    bumpMax(items.length * pointsPer);
    items.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'qCard';
      card.dataset.answered = '0';
      card.innerHTML = `
        <div class="qPrompt">${esc(q.prompt || q.q)}</div>
        <div class="qOptions"></div>
        <div class="qFeedback"></div>
      `;
      const optsWrap = $('.qOptions', card);
      const fb = $('.qFeedback', card);

      const opts = (q.opts || []).map((t, i) => ({t, i}));
      const shuffled = shuffle(opts);
      shuffled.forEach(o => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'opt';
        b.textContent = o.t;
        b.addEventListener('click', () => {
          if (card.dataset.answered === '1') return;
          card.dataset.answered = '1';
          $$('.opt', optsWrap).forEach(x => x.disabled = true);

          const correctIndex = q.a;
          const isCorrect = o.i === correctIndex;
          b.classList.add(isCorrect ? 'correct' : 'wrong');

          const correctText = q.opts[correctIndex];
          const correctBtn = $$('.opt', optsWrap).find(x => x.textContent === correctText);
          if (correctBtn) correctBtn.classList.add('correct');

          fb.textContent = (isCorrect ? '✅ ' : '❌ ') + (q.explain || q.why || '');
          if (isCorrect) award(`${prefix}_${q.id||idx}`, pointsPer);
        });
        optsWrap.appendChild(b);
      });

      host.appendChild(card);
    });
  }

  function badgeFor(t){
    const a = (t.aspect || '').toLowerCase();
    if (a.includes('continuous') && a.includes('perfect')) return `<span class="badge badge--mix">Perfect continuous</span>`;
    if (a.includes('continuous')) return `<span class="badge badge--cont">Continuous</span>`;
    if (a.includes('perfect')) return `<span class="badge badge--perf">Perfect</span>`;
    return `<span class="badge badge--simple">Simple</span>`;
  }

  // Map
  function initMap(){
    const grid = $('#mapGrid');
    const filter = $('#mapFilter');
    const showFR = $('#mapFR');
    const msg = $('#mapMsg');

    function mapItems(){
      const mode = filter.value;
      if (mode === 'core') return TENSES.filter(t => t.core).sort((a,b)=>CORE_ORDER.indexOf(a.id)-CORE_ORDER.indexOf(b.id));
      return shuffle(TENSES);
    }

    function render(){
      grid.innerHTML = '';
      mapItems().forEach(t => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'card cardBtn';
        btn.innerHTML = `
          <div class="card__top">
            <div>
              <div class="card__title">${esc(t.label)}</div>
              <div class="card__meta">${esc(t.group)} · ${esc(t.aspect)}</div>
            </div>
            <div class="card__icon" aria-hidden="true">${t.icon}</div>
          </div>
          <div class="card__body">
            ${badgeFor(t)}
            <div style="margin-top:10px; color: rgba(255,255,255,.72); line-height: 1.45;">
              <strong>Meaning:</strong> ${esc(t.when[0])}
              ${showFR.checked ? `<div class="fr" style="margin-top:8px;"><strong>FR:</strong> ${esc(t.fr || '')}</div>` : ''}
            </div>
          </div>
          <div class="card__footer">
            <span class="kbd">Tap to open</span>
            <button class="chip speak" data-say="${attr(t.label + '. ' + (t.when||[]).slice(0,2).join('. '))}" type="button">🔊</button>
          </div>
        `;
        btn.addEventListener('click', (e) => {
          const chip = e.target.closest('.speak');
          if (chip) return;
          $('#tenseSelect').value = t.id;
          renderTense();
          setPill(msg, `Opened: ${t.label}`, 'good');
          document.getElementById('core').scrollIntoView({behavior:'smooth', block:'start'});
        });
        grid.appendChild(btn);
      });

      setPill(msg, filter.value === 'core' ? 'Core map: 8 main forms.' : 'All map: core + less frequent forms.');
    }

    filter.addEventListener('change', render);
    showFR.addEventListener('change', render);
    $('#mapShuffle').addEventListener('click', () => { filter.value = 'all'; render(); award('map_shuffle', 2); });
    $('#mapListen').addEventListener('click', () => { speak('English tenses are time plus aspect. Time: past, present, future. Aspect: simple, continuous, perfect, and perfect continuous. Choose the meaning you want, then the tense.'); award('map_listen', 2); });

    bumpMax(2); bumpMax(2);
    render();
  }

  // Core selector + view
  function fillSelect(sel, items){
    sel.innerHTML = '';
    items.forEach(t => {
      const o = document.createElement('option');
      o.value = t.id;
      o.textContent = t.label + (t.core ? '' : ' (less common)');
      sel.appendChild(o);
    });
  }

  function renderTense(){
    const sel = $('#tenseSelect');
    const showFR = $('#showFR').checked;
    const t = TENSES.find(x => x.id === sel.value) || TENSES[0];
    const host = $('#tenseView');
    const msg = $('#tenseMsg');

    const pills = (t.signal||[]).slice(0,8).map(s=>`<span class="pillTag">${esc(s)}</span>`).join('');
    const ex = (t.examples||[]).map(e => `
      <div class="card" style="padding:12px;">
        <div class="card__top">
          <div>
            <div class="card__title">${esc(e.en)}</div>
            <div class="card__meta">${esc(t.label)}</div>
          </div>
          <div class="card__icon">🔊</div>
        </div>
        <div class="card__body">
          ${showFR ? `<div class="fr"><strong>FR:</strong> ${esc(e.fr||'')}</div>` : ''}
        </div>
        <div class="card__footer">
          <span class="kbd">Example</span>
          <button class="chip speak" data-say="${attr(e.en)}" type="button">🔊 Listen</button>
        </div>
      </div>
    `).join('');

    const qId = `tenseQuiz_${t.id}`;
    host.innerHTML = `
      <div class="kit">
        <div class="kitBox">
          <div class="kitTitle">${esc(t.icon)} ${esc(t.label)} ${badgeFor(t)}</div>
          <div class="kitText">
            <p><strong>Meaning (when we use it):</strong></p>
            <ul class="bullets">${t.when.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
            ${showFR && t.fr ? `<p class="muted"><strong>FR help:</strong> ${esc(t.fr)}</p>` : ''}
            <p class="muted"><strong>Common pitfall:</strong> ${esc(t.pitfall || '—')}</p>
          </div>
          <div class="listPills">${pills || '<span class="muted">No signals; context matters.</span>'}</div>

          <div class="miniRow" style="margin-top:12px;">
            <button class="btn" id="tenseExplainBtn" type="button">🔊 Explain</button>
            <button class="btn btn--ghost" id="tenseExampleBtn" type="button">🔊 Read examples</button>
            <div class="pill" id="tenseLocalMsg"></div>
          </div>
        </div>

        <div class="kitBox">
          <div class="kitTitle">Form (how to build it)</div>
          <div class="kitText">
            <p><strong>Affirmative:</strong> ${esc(t.form.aff)}</p>
            <p><strong>Negative:</strong> ${esc(t.form.neg)}</p>
            <p><strong>Question:</strong> ${esc(t.form.q)}</p>
          </div>

          <div class="note">
            <strong>Tense Coach (build a sentence)</strong>
            <div class="toolbar" style="margin-top:10px;">
              <label class="field" style="min-width:210px;">
                <span class="field__label">Subject</span>
                <select class="select" id="coachSubj">
                  <option>I</option><option>You</option><option>He</option><option>She</option><option>We</option><option>They</option>
                </select>
              </label>
              <label class="field" style="min-width:210px;">
                <span class="field__label">Verb idea</span>
                <select class="select" id="coachVerb">
                  <option value="work">work</option>
                  <option value="study">study</option>
                  <option value="go">go</option>
                  <option value="eat">eat</option>
                  <option value="live">live</option>
                  <option value="meet">meet</option>
                </select>
              </label>
              <label class="field" style="min-width:210px;">
                <span class="field__label">Extra</span>
                <select class="select" id="coachExtra">
                  <option value="">(none)</option>
                  <option value="right now">right now</option>
                  <option value="every day">every day</option>
                  <option value="this week">this week</option>
                  <option value="yesterday">yesterday</option>
                  <option value="for 3 years">for 3 years</option>
                  <option value="tomorrow">tomorrow</option>
                  <option value="when you called">when you called</option>
                  <option value="by Friday">by Friday</option>
                </select>
              </label>
              <button class="btn" id="coachGen" type="button">Generate</button>
              <button class="chip" id="coachSay" type="button">🔊</button>
              <button class="chip" id="coachCopy" type="button">Copy</button>
            </div>
            <div class="output" id="coachOut"></div>
            <div class="pill" id="coachMsg"></div>
          </div>
        </div>
      </div>

      <div class="grid grid--two">
        <div class="kitBox">
          <div class="kitTitle">Examples (tap 🔊)</div>
          <div class="grid grid--two">${ex || '<div class="muted">No examples.</div>'}</div>
        </div>
        <div class="kitBox">
          <div class="kitTitle">Quick check</div>
          <div class="quiz__body" id="${qId}"></div>
          <div class="miniRow">
            <button class="chip" data-reset-tense="${attr(t.id)}" type="button">Reset quiz</button>
            <div class="pill" id="${qId}_msg"></div>
          </div>
        </div>
      </div>
    `;

    $('#tenseExplainBtn').addEventListener('click', () => { speak(`${t.label}. We use it for: ${t.when.slice(0,3).join('. ')}.`); setPill($('#tenseLocalMsg'),'Listening…',''); award(`listen_${t.id}`, 2); bumpMax(2); });
    $('#tenseExampleBtn').addEventListener('click', () => { speak((t.examples||[]).map(e=>e.en).join(' ')); setPill($('#tenseLocalMsg'),'Examples read aloud.','good'); award(`examples_${t.id}`, 2); bumpMax(2); });

    // mini quiz (first 2)
    const quizHost = document.getElementById(qId);
    const items = (t.miniQuiz || []).slice(0,2);
    if (items.length){
      renderQuiz(quizHost, items.map(x=>({id:x.id, q:x.q, opts:x.opts, a:x.a, why:x.why})), 2, `t_${t.id}`);
      setPill(document.getElementById(`${qId}_msg`), 'Answer both questions.', '');
    } else {
      quizHost.innerHTML = '<div class="muted">No quiz for this tense yet. Use Practice Zone below.</div>';
      setPill(document.getElementById(`${qId}_msg`), '', '');
    }

    // coach
    wireCoach(t);
    setPill(msg, `Loaded: ${t.label}`, 'good');
  }

    function wireCoach(tense){
    const out = $('#coachOut');
    const msg = $('#coachMsg');

    function build(){
      const S = $('#coachSubj').value;
      const v = $('#coachVerb').value;
      const extraRaw = $('#coachExtra').value;
      const extra = extraRaw ? (' ' + extraRaw) : '';

      const isHeSheIt = (S==='He'||S==='She'||S==='It');
      const be = (S==='I') ? 'am' : (isHeSheIt ? 'is' : 'are');
      const have = isHeSheIt ? 'has' : 'have';
      const wasWere = (S==='I'||isHeSheIt) ? 'was' : 'were';

      let s = '';

      switch (tense.id){
        case 'pres_simple':
          s = `${S} ${isHeSheIt ? thirdPersonS(v) : v}${extra}.`;
          break;
        case 'pres_cont':
          s = `${S} ${be} ${ingForm(v)}${extra}.`;
          break;
        case 'past_simple':
          s = `${S} ${pastForm(v)}${extra}.`;
          break;
        case 'past_cont':
          s = `${S} ${wasWere} ${ingForm(v)}${extra}.`;
          break;
        case 'pres_perf':
          s = `${S} ${have} ${ppForm(v)}${extra}.`;
          break;
        case 'pres_perf_cont':
          s = `${S} ${have} been ${ingForm(v)}${extra}.`;
          break;
        case 'past_perf':
          s = `${S} had ${ppForm(v)}${extra}.`;
          break;
        case 'past_perf_cont':
          s = `${S} had been ${ingForm(v)}${extra}.`;
          break;
        case 'future_will':
          s = `${S} will ${v}${extra}.`;
          break;
        case 'future_going':
          s = `${S} ${be} going to ${v}${extra}.`;
          break;
        case 'future_cont':
          s = `${S} will be ${ingForm(v)}${extra}.`;
          break;
        case 'future_perf':
          s = `${S} will have ${ppForm(v)}${extra}.`;
          break;
        case 'future_perf_cont':
          s = `${S} will have been ${ingForm(v)}${extra}.`;
          break;
        default:
          s = `${S} ${isHeSheIt ? thirdPersonS(v) : v}${extra}.`;
      }

      return s.replace(/\s+/g,' ').replace(' .','.');
    }

    function generate(){
      out.textContent = build();
      setPill(msg,'Generated. Read it out loud!','good');
      award(`coach_${tense.id}`, 3);
    }

    // Overwrite handlers (no stacking, stable after re-render)
    $('#coachGen').onclick = generate;
    $('#coachSay').onclick = () => speak(out.textContent);
    $('#coachCopy').onclick = async () => {
      try{
        await navigator.clipboard.writeText(out.textContent.trim());
        setPill(msg,'Copied ✔','good');
        award(`coach_copy_${tense.id}`, 2);
      }catch{ setPill(msg,'Copy failed (browser).','warn'); }
    };

    bumpMax(3); bumpMax(2);
    out.textContent = '';
    setPill(msg, 'Pick options → Generate.', '');
  }


  function wireTenseQuizReset(){
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-reset-tense]');
      if (!btn) return;
      const id = btn.getAttribute('data-reset-tense');
      const t = TENSES.find(x=>x.id===id);
      if (!t) return;
      (t.miniQuiz||[]).slice(0,2).forEach(q => resetTask(`t_${t.id}_${q.id}`, 2));
      renderTense();
    });
  }

  // Rare
  function initRare(){
    const grid = $('#rareGrid');
    grid.innerHTML = '';
    const rares = TENSES.filter(t => !t.core && RARE_IDS.includes(t.id));
    rares.forEach(t => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card__top">
          <div>
            <div class="card__title">${esc(t.icon)} ${esc(t.label)} ${badgeFor(t)}</div>
            <div class="card__meta">${esc(t.group)} · ${esc(t.aspect)}</div>
          </div>
          <div class="card__icon">🧩</div>
        </div>
        <div class="card__body">
          <p class="muted"><strong>When to use it:</strong> ${esc(t.when[0] || '')}</p>
          <p><strong>Example:</strong> ${esc((t.examples[0]||{}).en || '')}</p>
          <p class="muted"><strong>Why it’s less common:</strong> ${esc(t.pitfall || 'It’s niche—use it when you need the extra meaning.')}</p>
        </div>
        <div class="card__footer">
          <button class="btn btn--ghost" data-open="${attr(t.id)}" type="button">Open in Core view</button>
          <button class="chip speak" data-say="${attr((t.examples[0]||{}).en || t.label)}" type="button">🔊</button>
        </div>
      `;
      grid.appendChild(card);
    });

    grid.addEventListener('click', (e) => {
      const open = e.target.closest('[data-open]');
      if (!open) return;
      $('#tenseSelect').value = open.getAttribute('data-open');
      renderTense();
      document.getElementById('core').scrollIntoView({behavior:'smooth', block:'start'});
    });
  }

  // Why
  function initWhy(){
    const list = $('#whyList');
    list.innerHTML = '';
    [
      {title:'English likes “aspect” choices', txt:'Simple vs continuous vs perfect adds meaning. We choose how we “see” the action.'},
      {title:'Modals reduce heavy tense forms', txt:'can/could/would/might/should express ability, politeness, possibility, advice — without complex tense endings.'},
      {title:'“Shall” became less common', txt:'Will became the default future marker, especially in American English. “Shall we…?” survives as a polite suggestion.'},
      {title:'Informal speech prefers shorter forms', txt:'Daily English favors efficient forms (I’ll, I’ve, I’m) and context.'},
      {title:'Some forms are “niche”', txt:'Future perfect continuous is useful, but only when you need a deadline + duration emphasis.'}
    ].forEach(r => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${esc(r.title)}:</strong> <span class="muted">${esc(r.txt)}</span>`;
      list.appendChild(li);
    });

    const quizHost = $('#whyQuiz');
    renderQuiz(quizHost, [
      {id:'w1', q:'Why is “will” more common than “shall” today?', opts:['Because “shall” is illegal.','Because “will” became the default future marker in modern English.','Because “shall” means past.'], a:1, why:'Will became the main future modal in modern usage.'},
      {id:'w2', q:'What do modals help English do?', opts:['Avoid meaning.','Express ability/possibility/politeness without long tense forms.','Remove verbs.'], a:1, why:'Modals carry meaning efficiently.'},
      {id:'w3', q:'Why is future perfect continuous rare?', opts:['It is wrong grammar.','It needs a deadline + duration emphasis, which is not needed often.','It only exists in British English.'], a:1, why:'It’s correct, just niche.'}
    ], 2, 'why');
    setPill($('#whyMsg'), 'Answer the questions.', '');

    $('#whyQuizReset').addEventListener('click', () => {
      ['w1','w2','w3'].forEach(id => resetTask(`why_${id}`, 2));
      initWhy();
      setPill($('#whyMsg'), 'Reset.', '');
    });
  }

  // Mix quiz
  function initMixQuiz(){
    const host = $('#mixQuiz');
    const msg = $('#mixMsg');
    function render(){
      renderQuiz(host, [
        {id:'m1', q:'Right now I ____ dinner. (now)', opts:['cook','am cooking','have cooked'], a:1, why:'Now → present continuous.'},
        {id:'m2', q:'I ____ here for 10 years. (duration up to now)', opts:['live','lived','have lived'], a:2, why:'For/since → present perfect.'},
        {id:'m3', q:'Yesterday we ____ to the cinema.', opts:['go','went','have gone'], a:1, why:'Finished past time → past simple.'},
        {id:'m4', q:'When you called, I ____.', opts:['was driving','drove','have driven'], a:0, why:'Background in progress → past continuous.'},
        {id:'m5', q:'By Friday, I ____ the report.', opts:['will finish','will have finished','have finished'], a:1, why:'Deadline → future perfect.'},
        {id:'m6', q:'Look at those clouds! It ____.', opts:['will rain','is raining','is going to rain'], a:2, why:'Evidence prediction → going to.'},
        {id:'m7', q:'When I arrived, they ____ already ____.', opts:['have / left','had / left','were / leaving'], a:1, why:'Earlier past action → past perfect.'},
        {id:'m8', q:'I usually ____ up at 7.', opts:['get','am getting','have gotten'], a:0, why:'Routine → present simple.'}
      ], 2, 'mix');
      setPill(msg, 'Tip: meaning first (routine / now / finished past / duration / plan / deadline).', '');
    }
    $('#mixQuizReset').addEventListener('click', () => { ['m1','m2','m3','m4','m5','m6','m7','m8'].forEach(id => resetTask(`mix_${id}`, 2)); render(); setPill(msg,'Reset.',''); });
    $('#mixQuizListen').addEventListener('click', () => { const first = $('.qPrompt', host); if (first) speak(first.textContent); award('mix_listen', 2); bumpMax(2); });
    render();
  }

  // Fix
  function initFix(){
    const promptEl = $('#fixPrompt');
    const input = $('#fixInput');
    const hint = $('#fixHint');
    const msg = $('#fixMsg');
    const items = [
      {wrong:'I am agree with you.', correct:'I agree with you.', hint:'State verb “agree” → simple present, not continuous.'},
      {wrong:'I have met him yesterday.', correct:'I met him yesterday.', hint:'Finished past time (yesterday) → past simple.'},
      {wrong:'Since 3 years, I live in France.', correct:'I have lived in France for 3 years.', hint:'Use present perfect for duration up to now. For + duration, since + starting point.'},
      {wrong:'I didn’t went to work.', correct:'I didn’t go to work.', hint:'didn’t + base form.'},
      {wrong:'I go to cook tonight.', correct:'I’m going to cook tonight.', hint:'Plan → be going to.'},
      {wrong:'When I arrived, they left already.', correct:'When I arrived, they had already left.', hint:'Sequence: leaving happened before arriving → past perfect.'}
    ];
    let idx = 0;

    function load(i){
      idx = (i + items.length) % items.length;
      const item = items[idx];
      promptEl.textContent = `❌ ${item.wrong}`;
      hint.textContent = item.hint;
      input.value = '';
      setPill(msg, 'Type the correct sentence, then click Check.', '');
    }
    function norm(s){ return (s||'').trim().replace(/\s+/g,' ').toLowerCase(); }

    $('#fixCheck').addEventListener('click', () => {
      const item = items[idx];
      const ok = norm(input.value) === norm(item.correct);
      if (ok){ setPill(msg,'✅ Correct!','good'); award(`fix_${idx}`, 3); }
      else setPill(msg,'Not quite. Try again (use the hint).','warn');
    });
    $('#fixReveal').addEventListener('click', () => { input.value = items[idx].correct; setPill(msg,'Revealed. Now read it out loud.','warn'); award(`fix_reveal_${idx}`, 1); });
    $('#fixSpeak').addEventListener('click', () => { speak(items[idx].correct); award(`fix_speak_${idx}`, 1); });
    $('#fixNext').addEventListener('click', () => load(idx+1));
    $('#fixReset').addEventListener('click', () => { items.forEach((_,i)=>{ resetTask(`fix_${i}`,3); resetTask(`fix_reveal_${i}`,1); resetTask(`fix_speak_${i}`,1); }); load(0); });

    bumpMax(items.length*3);
    bumpMax(items.length*1);
    bumpMax(items.length*1);
    load(0);
  }

  // Transformer
    function initTransformer(){
    const baseSel = $('#transBase');
    const targetSel = $('#transTarget');
    const out = $('#transOut');
    const msg = $('#transMsg');

    const bases = [
      {id:'b1', base:'I work in the city.', verb:'work', obj:'in the city', subj:'I'},
      {id:'b2', base:'She travels a lot.', verb:'travel', obj:'a lot', subj:'She'},
      {id:'b3', base:'We eat at home.', verb:'eat', obj:'at home', subj:'We'},
      {id:'b4', base:'They go to the gym.', verb:'go', obj:'to the gym', subj:'They'},
      {id:'b5', base:'I meet clients every week.', verb:'meet', obj:'clients every week', subj:'I'},
      {id:'b6', base:'He lives in France.', verb:'live', obj:'in France', subj:'He'},
      {id:'b7', base:'She studies English.', verb:'study', obj:'English', subj:'She'}
    ];

    const targets = [
      {id:'past_simple', label:'Past simple'},
      {id:'pres_cont', label:'Present continuous'},
      {id:'pres_perf', label:'Present perfect'},
      {id:'pres_perf_cont', label:'Present perfect continuous'},
      {id:'future_will', label:'Future (will)'},
      {id:'future_going', label:'Future (going to)'},
      {id:'future_cont', label:'Future continuous'},
      {id:'future_perf', label:'Future perfect'},
      {id:'future_perf_cont', label:'Future perfect continuous'},
      {id:'past_perf', label:'Past perfect'},
      {id:'past_perf_cont', label:'Past perfect continuous'}
    ];

    baseSel.innerHTML='';
    bases.forEach(b=>{ const o=document.createElement('option'); o.value=b.id; o.textContent=b.base; baseSel.appendChild(o); });

    targetSel.innerHTML='';
    targets.forEach(t=>{ const o=document.createElement('option'); o.value=t.id; o.textContent=t.label; targetSel.appendChild(o); });
    targetSel.value='pres_perf';

    function build(){
      const b = bases.find(x=>x.id===baseSel.value) || bases[0];
      const subj = b.subj || 'I';
      const isHeSheIt = (subj==='He'||subj==='She'||subj==='It');
      const be = (subj==='I') ? 'am' : (isHeSheIt?'is':'are');
      const have = isHeSheIt ? 'has' : 'have';
      const v = b.verb;
      const obj = b.obj ? (' ' + b.obj) : '';

      switch (targetSel.value){
        case 'past_simple': return `${subj} ${pastForm(v)}${obj}.`;
        case 'pres_cont': return `${subj} ${be} ${ingForm(v)}${obj}.`;
        case 'pres_perf': return `${subj} ${have} ${ppForm(v)}${obj}.`;
        case 'pres_perf_cont': return `${subj} ${have} been ${ingForm(v)}${obj}.`;
        case 'future_will': return `${subj} will ${v}${obj}.`;
        case 'future_going': return `${subj} ${be} going to ${v}${obj}.`;
        case 'future_cont': return `${subj} will be ${ingForm(v)}${obj}.`;
        case 'future_perf': return `${subj} will have ${ppForm(v)}${obj}.`;
        case 'future_perf_cont': return `${subj} will have been ${ingForm(v)}${obj}.`;
        case 'past_perf': return `${subj} had ${ppForm(v)}${obj}.`;
        case 'past_perf_cont': return `${subj} had been ${ingForm(v)}${obj}.`;
        default: return `${subj} ${v}${obj}.`;
      }
    }

    function generate(givePoints){
      out.textContent = build().replace(/\s+/g,' ').replace(' .','.');
      setPill(msg,'Generated. Explain why the meaning changes.','good');
      if (givePoints) award('trans_gen', 4);
    }

    // Buttons
    $('#transGenerate').onclick = () => generate(true);
    $('#transSpeak').onclick = () => speak(out.textContent);
    $('#transCopy').onclick = async () => {
      try{
        await navigator.clipboard.writeText(out.textContent.trim());
        setPill(msg,'Copied ✔','good');
        award('trans_copy', 2);
      }catch{ setPill(msg,'Copy failed.','warn'); }
    };
    $('#transReset').onclick = () => { resetTask('trans_gen',4); resetTask('trans_copy',2); generate(false); };

    // Auto-update on dropdown change (no points)
    baseSel.onchange = () => generate(false);
    targetSel.onchange = () => generate(false);

    bumpMax(4); bumpMax(2);
    generate(false);
  }


  // Story
  function initStory(){
    const log = $('#storyLog');
    const choices = $('#storyChoices');
    const msg = $('#storyMsg');
    let nodeId = 's1';
    let lastLine = '';

    function bubble(who, text, isYou=false){
      const b = document.createElement('div');
      b.className = 'bubble' + (isYou ? ' you' : '');
      b.innerHTML = `<span class="who">${esc(who)}</span><span class="txt">${esc(text)}</span>`;
      return b;
    }

    const nodes = {
      s1:{who:'Narrator', text:'You are telling your friend about your week.', choices:[
        {text:'This week, I have worked a lot.', next:'s2', ok:true, explain:'Unfinished time (this week) → present perfect.', points:3},
        {text:'This week, I worked a lot.', next:'s2', ok:false, explain:'Possible, but “this week” is unfinished; present perfect is more natural.', points:1}
      ]},
      s2:{who:'Friend', text:'What are you doing right now?', choices:[
        {text:'I’m studying English right now.', next:'s3', ok:true, explain:'Now → present continuous.', points:3},
        {text:'I study English right now.', next:'s3', ok:false, explain:'For “now”, use present continuous.', points:1}
      ]},
      s3:{who:'Friend', text:'And yesterday?', choices:[
        {text:'Yesterday, I met a friend for coffee.', next:'s4', ok:true, explain:'Finished past time → past simple.', points:3},
        {text:'Yesterday, I have met a friend for coffee.', next:'s4', ok:false, explain:'No present perfect with yesterday.', points:1}
      ]},
      s4:{who:'Friend', text:'What happened before you arrived?', choices:[
        {text:'When I arrived, they had already started.', next:'end', ok:true, explain:'Earlier past action → past perfect.', points:3},
        {text:'When I arrived, they started already.', next:'end', ok:false, explain:'Past perfect makes the sequence clear.', points:1}
      ]},
      end:{who:'Narrator', text:'Nice! You used tenses to show time and meaning. 🎉', choices:[]}
    };

    function renderNode(){
      const node = nodes[nodeId];
      if (!node) return;
      log.appendChild(bubble(node.who, node.text, false));
      lastLine = node.text;
      log.scrollTop = log.scrollHeight;

      choices.innerHTML = '';
      const cs = node.choices || [];
      if (!cs.length){
        setPill(msg,'✅ Story complete. Replay and try other options.','good');
        award('story_complete', 6);
        return;
      }
      cs.forEach((c, i) => {
        const btn = document.createElement('button');
        btn.type='button';
        btn.className='opt';
        btn.textContent=c.text;
        btn.addEventListener('click', () => {
          log.appendChild(bubble('You', c.text, true));
          lastLine = c.text;
          log.scrollTop = log.scrollHeight;
          if (c.ok) award(`story_${nodeId}_${i}`, c.points || 2);
          setPill(msg,(c.ok?'✅ ':'❌ ')+c.explain, c.ok?'good':'warn');
          nodeId = c.next;
          renderNode();
        });
        choices.appendChild(btn);
      });
    }

    function restart(){
      log.innerHTML='';
      choices.innerHTML='';
      nodeId = 's1';
      setPill(msg,'Choose your line. Focus on meaning!','');
      renderNode();
    }

    $('#storyRestart').addEventListener('click', () => { resetTask('story_complete',6); restart(); });
    $('#storyRead').addEventListener('click', () => speak(lastLine));

    bumpMax(6);
    restart();
  }

  // Final
  function initFinal(){
    const txt = $('#finalText');
    const msg = $('#finalMsg');
    const chipsHost = $('#finalChips');

    const chips = [
      'I usually… (present simple — routine)',
      'Right now, I’m… (present continuous — now)',
      'Yesterday, I… (past simple — finished past)',
      'When you called, I was… (past continuous — background)',
      'I’ve … for/since … (present perfect — duration)',
      'By Friday, I’ll have… (future perfect — deadline)',
      'I’m going to… (plan)',
      'I’ll… (decision / promise)',
      'I had … before… (past perfect — sequence)'
    ];

    chipsHost.innerHTML='';
    chips.forEach(text => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent=text;
      b.addEventListener('click', () => {
        const cur = txt.value.trim();
        txt.value = (cur ? cur + '\n' : '') + text.replace(/\s*\(.*\)/,'');
        award('final_chip', 2);
      });
      chipsHost.appendChild(b);
    });

    function check(){
      const t = (txt.value||'').toLowerCase();
      const hasRoutine = /\busually\b|\bevery day\b/.test(t);
      const hasNow = /\bright now\b|\bam .*ing\b/.test(t);
      const hasPast = /\byesterday\b|\blast\b|\bago\b/.test(t);
      const hasPerf = /\bhave\b|\bhas\b/.test(t) && (/\bfor\b|\bsince\b|\bever\b|\bnever\b/.test(t));
      const hasFuture = /\bgoing to\b|\bwill\b/.test(t);
      const hasWhy = /\bbecause\b|\bi used\b|\bi chose\b/.test(t);

      let ok = 0; [hasRoutine,hasNow,hasPast,hasPerf,hasFuture,hasWhy].forEach(x=>{ if(x) ok++; });

      if (ok >= 4){
        setPill(msg,`✅ Great! You included ${ok}/6 ingredients. Add explanations (because / I chose…) to reach B2.`,'good');
        award('final_check', 8);
      } else setPill(msg,`Almost: ${ok}/6. Add routine, now, finished past, present perfect (for/since), future, and “because”.`,'warn');
    }

    $('#finalCheck').addEventListener('click', check);
    $('#finalClear').addEventListener('click', () => { txt.value=''; setPill(msg,'',''); });
    $('#finalSpeak').addEventListener('click', () => speak(txt.value));
    $('#finalCopy').addEventListener('click', async () => { try{ await navigator.clipboard.writeText(txt.value); setPill(msg,'Copied ✔','good'); award('final_copy', 3); }catch{ setPill(msg,'Copy failed.','warn'); } });

    bumpMax(2); bumpMax(8); bumpMax(3);
  }

  // Voice wiring
  function wireVoice(){
    const us = $('#voiceUS');
    const uk = $('#voiceUK');

    function set(v){
      currentVoicePref = v;
      us.classList.toggle('is-active', v==='US');
      uk.classList.toggle('is-active', v==='UK');
      us.setAttribute('aria-pressed', v==='US' ? 'true' : 'false');
      uk.setAttribute('aria-pressed', v==='UK' ? 'true' : 'false');
      speak(v==='US' ? 'US voice selected.' : 'UK voice selected.');
    }
    us.addEventListener('click', () => set('US'));
    uk.addEventListener('click', () => set('UK'));

    $('#btnPause').addEventListener('click', pauseOrResume);
    $('#btnStop').addEventListener('click', stopSpeak);

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.speak');
      if (!btn) return;
      speak(btn.getAttribute('data-say') || btn.textContent);
    });

    $('#btnListenMission').addEventListener('click', () => { speak('Today we learn the most common English tenses. We choose tenses for time and meaning: routine, now, finished past, experience, plans, and deadlines.'); award('mission_listen', 2); bumpMax(2); });
    $('#btnQuickDrill').addEventListener('click', () => { speak('Routine: I usually work. Now: I am working. Finished past: I worked yesterday. Experience: I have worked here for years. Plan: I am going to work tomorrow. Deadline: By Friday, I will have finished.'); award('quick_drill', 2); bumpMax(2); });
  }

  function wirePrint(){ $('#btnPrintCheat').addEventListener('click', () => window.print()); }

  function wireProgress(){
    const key = 'speakeasy_english_tenses_power_v1';
    $('#btnSaveProgress').addEventListener('click', () => {
      const data = { scoreNow:score.now, scoreMax:score.max, earned:Array.from(score.earned), voice:currentVoicePref, tense:$('#tenseSelect').value, finalText:$('#finalText').value };
      try{ localStorage.setItem(key, JSON.stringify(data)); speak('Progress saved.'); }catch{}
    });
    $('#btnLoadProgress').addEventListener('click', () => {
      try{
        const raw = localStorage.getItem(key); if (!raw) return;
        const data = JSON.parse(raw);
        score.now = Number(data.scoreNow)||0;
        score.max = Number(data.scoreMax)||score.max;
        score.earned = new Set(Array.isArray(data.earned)?data.earned:[]);
        scoreNow(); scoreMax();
        currentVoicePref = data.voice==='UK' ? 'UK' : 'US';
        $('#voiceUS').classList.toggle('is-active', currentVoicePref==='US');
        $('#voiceUK').classList.toggle('is-active', currentVoicePref==='UK');
        $('#voiceUS').setAttribute('aria-pressed', currentVoicePref==='US' ? 'true' : 'false');
        $('#voiceUK').setAttribute('aria-pressed', currentVoicePref==='UK' ? 'true' : 'false');
        if (data.tense) $('#tenseSelect').value = data.tense;
        renderTense();
        if (typeof data.finalText === 'string') $('#finalText').value = data.finalText;
        speak('Progress loaded.');
      }catch{}
    });
    $('#btnClearProgress').addEventListener('click', () => { try{ localStorage.removeItem(key); }catch{} speak('Saved progress cleared.'); });
  }

  function wireResetAll(){
    $('#btnResetAll').addEventListener('click', () => {
      stopSpeak();
      resetAllScore();
      initMap(); initRare(); initWhy(); initMixQuiz(); initFix(); initTransformer(); initStory(); initFinal();
      $('#tenseSelect').value = 'pres_simple';
      renderTense();
      speak('Lesson reset.');
    });
  }

  function initCoreSelector(){
    const sel = $('#tenseSelect');
    fillSelect(sel, TENSES);
    sel.value = 'pres_simple';
    sel.addEventListener('change', renderTense);

    $('#btnTenseListen').addEventListener('click', () => {
      const t = TENSES.find(x=>x.id===sel.value);
      if (t) speak(`${t.label}. We use it for ${t.when.slice(0,3).join(', ')}.`);
      award('tense_listen', 2); bumpMax(2);
    });
    $('#btnTenseRandom').addEventListener('click', () => {
      const pool = $('#mapFilter').value==='core' ? TENSES.filter(x=>x.core) : TENSES;
      const t = pool[Math.floor(Math.random()*pool.length)];
      sel.value = t.id;
      renderTense();
      award('tense_random', 2); bumpMax(2);
    });

    $('#showFR').addEventListener('change', renderTense);
    renderTense();
  }

  function init(){
    document.documentElement.style.scrollBehavior = 'smooth';
    wireVoice(); wirePrint(); wireProgress(); wireResetAll(); wireTenseQuizReset();
    initMap(); initCoreSelector(); initRare(); initWhy(); initMixQuiz(); initFix(); initTransformer(); initStory(); initFinal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();