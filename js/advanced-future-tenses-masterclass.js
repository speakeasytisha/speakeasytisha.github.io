(() => {
  'use strict';

  // Prevent double-init if both ./ and /js/ scripts load
  if (window.__SE_ADV_FUTURE_LOADED) return;
  window.__SE_ADV_FUTURE_LOADED = true;

  const state = {
    level: 'B1',
    voice: 'US',
    teacher: false,
    score: 0,
    selectedKeyword: null,
    lastDetectText: '',
    lastForgeText: '',
  };

  const els = {
    jsStatus: document.getElementById('jsStatus'),
    voicePill: document.getElementById('voicePill'),
    scorePill: document.getElementById('scorePill'),
    missionBox: document.getElementById('missionBox'),

    btnTeacher: document.getElementById('btnTeacher'),
    btnReset: document.getElementById('btnReset'),
    btnPrint: document.getElementById('btnPrint'),

    toolkitCards: document.getElementById('toolkitCards'),
    btnCollapseCards: document.getElementById('btnCollapseCards'),

    keywordChips: document.getElementById('keywordChips'),
    situationSel: document.getElementById('situationSel'),
    registerSel: document.getElementById('registerSel'),
    btnDetect: document.getElementById('btnDetect'),
    btnSayDetect: document.getElementById('btnSayDetect'),
    btnCopyDetect: document.getElementById('btnCopyDetect'),
    detectOut: document.getElementById('detectOut'),

    btnCopyCheat: document.getElementById('btnCopyCheat'),
    btnShowCheat: document.getElementById('btnShowCheat'),
    cheatBox: document.getElementById('cheatBox'),
    cheatResult: document.getElementById('cheatResult'),

    btnNewSet: document.getElementById('btnNewSet'),
    btnResetArena: document.getElementById('btnResetArena'),
    arenaQuiz: document.getElementById('arenaQuiz'),
    gapBox: document.getElementById('gapBox'),

    forgeTense: document.getElementById('forgeTense'),
    forgeSubj: document.getElementById('forgeSubj'),
    forgeVerb: document.getElementById('forgeVerb'),
    forgeObj: document.getElementById('forgeObj'),
    forgeTime: document.getElementById('forgeTime'),
    forgeStyle: document.getElementById('forgeStyle'),
    btnForge: document.getElementById('btnForge'),
    btnForgeSay: document.getElementById('btnForgeSay'),
    btnForgeCopy: document.getElementById('btnForgeCopy'),
    forgeOut: document.getElementById('forgeOut'),

    microQuiz: document.getElementById('microQuiz'),

    btnNewTap: document.getElementById('btnNewTap'),
    btnResetTap: document.getElementById('btnResetTap'),
    tapBox: document.getElementById('tapBox'),

    dialogueBox: document.getElementById('dialogueBox'),

    btnResetTest: document.getElementById('btnResetTest'),
    testQuiz: document.getElementById('testQuiz'),
  };

  // ---------- helpers ----------
  const clamp = (n,a,b)=>Math.max(a, Math.min(b,n));
  const norm = (s)=>(s??'').toString().trim().toLowerCase().replace(/\s+/g,' ').replace(/[’]/g,"'");
  function escapeHtml(s){
    const str = (s ?? '').toString();
    return str
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/\"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }
  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function setResult(el, html, kind){
    if(!el) return;
    el.classList.remove('good','bad','warn');
    if(kind) el.classList.add(kind);
    el.innerHTML = html;
  }
  function bumpScore(n){
    state.score += n;
    if(els.scorePill) els.scorePill.textContent = String(state.score);
  }
  function copyToClipboard(text){
    navigator.clipboard?.writeText(text).catch(()=>{});
  }

  // ---------- speech ----------
  let cachedVoices = [];
  function loadVoices(){
    cachedVoices = window.speechSynthesis?.getVoices?.() || [];
  }
  function pickVoice(){
    const voices = cachedVoices.length ? cachedVoices : (window.speechSynthesis?.getVoices?.() || []);
    const want = state.voice === 'UK' ? ['en-GB','en_GB'] : ['en-US','en_US'];
    // prefer exact locale
    let v = voices.find(x => want.includes((x.lang||'').replace('-','-')));
    if(!v){
      // fallback to English voice
      v = voices.find(x => (x.lang||'').toLowerCase().startsWith('en'));
    }
    return v || null;
  }
  function speak(text){
    try{
      if(!window.speechSynthesis) return;
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice();
      if(v) u.voice = v;
      u.rate = 1.0;
      u.pitch = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }catch(_){}
  }

  // ---------- data ----------
  const TENSES = [
    {
      key:'futCont',
      name:'Future continuous',
      form:'will be + V‑ing',
      focus:'Action in progress at a specific future time',
      keywords:['at this time tomorrow','this time next week','when you call','at 6 pm tomorrow'],
      examples:[
        'At 6 pm tomorrow, I will be meeting the client.',
        'This time next week, we’ll be flying to New York.'
      ],
      tip:'French tip: use it for “action in progress” in the future (like “pendant que…”).'
    },
    {
      key:'futPerf',
      name:'Future perfect',
      form:'will have + past participle',
      focus:'Completed by a future deadline',
      keywords:['by Friday','by 6 pm','by the time','before + time'],
      examples:[
        'By Friday, I will have finished the report.',
        'By the time you arrive, we’ll have set everything up.'
      ],
      tip:'Keyword hack: “BY + time” almost screams future perfect.'
    },
    {
      key:'futPerfCont',
      name:'Future perfect continuous',
      form:'will have been + V‑ing',
      focus:'Duration up to a future point',
      keywords:['for 2 years by 2030','for 3 hours by 6 pm','since + past point (by future time)'],
      examples:[
        'By June, I will have been working here for two years.',
        'By 6 pm, she will have been studying for three hours.'
      ],
      tip:'If you say “for + duration” AND a deadline, this tense is your best friend.'
    },
    {
      key:'aboutTo',
      name:'Be about to',
      form:'am/is/are about to + V',
      focus:'Immediate future (seconds/minutes)',
      keywords:['right now','any second','just about to'],
      examples:[
        'I’m about to leave — call me now.',
        'The meeting is about to start.'
      ],
      tip:'Think “sur le point de”.'
    },
    {
      key:'dueTo',
      name:'Be due to',
      form:'am/is/are due to + V',
      focus:'Scheduled / expected (often formal)',
      keywords:['due to','scheduled to','expected to'],
      examples:[
        'The plane is due to land at 8:15.',
        'The new policy is due to start next month.'
      ],
      tip:'Great for announcements and timetables.'
    },
    {
      key:'setTo',
      name:'Be set to',
      form:'am/is/are set to + V',
      focus:'Strong expectation / likely change (news style)',
      keywords:['set to','likely to','poised to'],
      examples:[
        'Prices are set to rise next year.',
        'The company is set to launch a new app.'
      ],
      tip:'Sounds “journalistic” and confident.'
    },
    {
      key:'politeQ',
      name:'Polite future questions',
      form:'Will you be …ing? / Will you have …?',
      focus:'Polite requests about plans',
      keywords:['will you be','will you have time','would you be able to'],
      examples:[
        'Will you be using the car tomorrow?',
        'Will you have finished by 5 pm?'
      ],
      tip:'Polite + soft. Useful at work.'
    }
  ];

  const KEYWORDS = [
    {id:'by', label:'by Friday / by 6 pm', tense:'futPerf', why:'Deadline → completed by then.'},
    {id:'bytime', label:'by the time + clause', tense:'futPerf', why:'One future action is completed before another.'},
    {id:'atTime', label:'at this time tomorrow', tense:'futCont', why:'Action in progress at a specific future moment.'},
    {id:'whenCall', label:'when you call / when you arrive', tense:'futCont', why:'Sets a background action in progress.'},
    {id:'forBy', label:'for 3 hours by 6 pm', tense:'futPerfCont', why:'Duration up to a future point.'},
    {id:'aboutTo', label:'about to (any second)', tense:'aboutTo', why:'Immediate future.'},
    {id:'due', label:'due to (scheduled)', tense:'dueTo', why:'Formal schedule/expectation.'},
    {id:'set', label:'set to (likely)', tense:'setTo', why:'Strong prediction/expectation.'},
    {id:'willBe', label:'Will you be …ing? (polite)', tense:'politeQ', why:'Polite question about someone’s plans.'},
  ];

  const FORGE = {
    verbs: [
      {v:'finish', pp:'finished', ing:'finishing'},
      {v:'send', pp:'sent', ing:'sending'},
      {v:'meet', pp:'met', ing:'meeting'},
      {v:'book', pp:'booked', ing:'booking'},
      {v:'work', pp:'worked', ing:'working'},
      {v:'study', pp:'studied', ing:'studying'},
      {v:'drive', pp:'driven', ing:'driving'},
      {v:'arrive', pp:'arrived', ing:'arriving'},
      {v:'update', pp:'updated', ing:'updating'},
      {v:'prepare', pp:'prepared', ing:'preparing'},
    ],
    objects: [
      'the report',
      'the email',
      'the appointment',
      'the tickets',
      'the budget',
      'the presentation',
      'the kids’ schedule',
      'the insurance forms',
      'the project plan',
      'the final draft',
    ],
    times: [
      'by Friday',
      'by 6 pm',
      'by the time you arrive',
      'at this time tomorrow',
      'this time next week',
      'for two hours by 6 pm',
      'any second now',
      'next month',
      'tomorrow morning',
      'in two hours',
    ]
  };

  // Scenario bank changes by level
  const BANK = {
    B1: {
      mission: 'Target: ✅ 10 points. Master: future continuous vs future perfect + “about to”.',
      arenaCount: 6,
      arena: [
        {prompt:'(Deadline) You promise the report is complete before Friday.', hint:'BY + time', answer:'Future perfect', options:['Future continuous','Future perfect','Going to'] ,
          explain:'By Friday → completed by then → “I will have finished the report by Friday.”'},
        {prompt:'(In progress) At 6 pm tomorrow, you are in a meeting.', hint:'at this time', answer:'Future continuous', options:['Future perfect','Future continuous','Present simple'],
          explain:'Specific future time + action in progress → “will be meeting”.'},
        {prompt:'(Immediate) The taxi is outside. You leave right now.', hint:'any second', answer:'Be about to', options:['Be due to','Be about to','Future perfect'],
          explain:'Immediate future → “I’m about to leave.”'},
        {prompt:'(Polite) Ask a colleague if they are busy tomorrow morning (polite).', hint:'Will you be…?', answer:'Polite future question', options:['Polite future question','Going to','Future perfect'],
          explain:'Polite question → “Will you be working tomorrow morning?”'},
        {prompt:'(Deadline) By the time your family arrives, dinner is ready.', hint:'by the time', answer:'Future perfect', options:['Future continuous','Future perfect','Present continuous'],
          explain:'Completed before another future event → “will have cooked / will have prepared”.'},
        {prompt:'(Background) When you call me later, I’m driving.', hint:'when you call', answer:'Future continuous', options:['Future continuous','Future perfect','Will (simple)'],
          explain:'Background action in progress → “I’ll be driving when you call.”'},
      ],
      gaps: [
        {before:'By Friday, we', after:' the final draft.', ans:'will have finished', tip:'BY + deadline'},
        {before:'At this time tomorrow, I', after:' the client.', ans:'will be meeting', tip:'specific future time'},
        {before:'I’m', after:' leave. Call me now.', ans:'about to', tip:'immediate future'},
      ],
      tap: [
        'By 6 pm, she will have finished the insurance forms.',
        'At 7 tonight, we will be preparing the presentation.',
        'I’m about to send the email.',
      ],
      dialogue: [
        {
          speaker:'Manager',
          line:'Can you confirm the deadline?',
          choices:[
            {t:'Yes — I will have finished by Friday.', ok:true, tip:'✅ Deadline + future perfect.'},
            {t:'Yes — I am finished by Friday.', ok:false, tip:'❌ Use “will have finished”.'},
            {t:'Yes — I will finishing by Friday.', ok:false, tip:'❌ Form error.'},
          ]
        },
        {
          speaker:'Colleague',
          line:'Can I call you at 6?',
          choices:[
            {t:'I’ll be driving at 6, but I can call you at 7.', ok:true, tip:'✅ Future continuous for “in progress”.'},
            {t:'I’ll have driven at 6.', ok:false, tip:'❌ Wrong focus.'},
            {t:'I am drive at 6.', ok:false, tip:'❌ Form error.'},
          ]
        }
      ],
      testCount: 6
    },
    B2: {
      mission: 'Target: ✅ 12 points. Add: future perfect continuous + “due to / set to”.',
      arenaCount: 7,
      arena: [
        {prompt:'(Duration) By June, you have a job here for two years.', hint:'for + duration + by', answer:'Future perfect continuous',
          options:['Future perfect','Future perfect continuous','Future continuous'],
          explain:'Duration up to deadline → “will have been working here for two years.”'},
        {prompt:'(Deadline) By the time we land, you complete the online form.', hint:'by the time', answer:'Future perfect',
          options:['Future continuous','Future perfect','Going to'],
          explain:'Completed before another future event → “will have completed”.'},
        {prompt:'(Schedule) The plane lands at 8:15 (formal).', hint:'due to', answer:'Be due to',
          options:['Be due to','Be about to','Present continuous'],
          explain:'Formal timetable → “is due to land”.'},
        {prompt:'(Prediction) Prices rise next year (news style).', hint:'set to', answer:'Be set to',
          options:['Be set to','Be due to','Future perfect'],
          explain:'Strong expectation (news) → “are set to rise”.'},
        {prompt:'(In progress) This time next week, you fly to NYC.', hint:'this time', answer:'Future continuous',
          options:['Future perfect','Future continuous','Present simple'],
          explain:'In progress at a future time → “will be flying”.'},
        {prompt:'(Immediate) The meeting starts now.', hint:'any second', answer:'Be about to',
          options:['Be about to','Future perfect','Be due to'],
          explain:'Immediate future → “is about to start”.'},
        {prompt:'(Polite) Ask if a colleague will be available after lunch.', hint:'Will you be…?', answer:'Polite future question',
          options:['Polite future question','Future perfect','Going to'],
          explain:'Polite question → “Will you be free after lunch?”'},
      ],
      gaps: [
        {before:'By June, I', after:' here for two years.', ans:'will have been working', tip:'for + duration + by'},
        {before:'The flight is', after:' land at 8:15.', ans:'due to', tip:'formal schedule'},
        {before:'Prices are', after:' rise next year.', ans:'set to', tip:'strong expectation'},
      ],
      tap: [
        'By June, I will have been working here for two years.',
        'The plane is due to land at 8:15.',
        'Prices are set to rise next year.',
      ],
      dialogue: [
        {
          speaker:'HR / Benefits',
          line:'When will the documents be ready?',
          choices:[
            {t:'By tomorrow morning, I will have sent everything.', ok:true, tip:'✅ Future perfect + deadline.'},
            {t:'By tomorrow morning, I will be sent everything.', ok:false, tip:'❌ Passive confusion.'},
            {t:'By tomorrow morning, I have sent everything.', ok:false, tip:'❌ Wrong tense for future deadline.'},
          ]
        },
        {
          speaker:'Project Lead',
          line:'How long will you have been working on it by Friday?',
          choices:[
            {t:'By Friday, I’ll have been working on it for three days.', ok:true, tip:'✅ Future perfect continuous.'},
            {t:'By Friday, I’ll be working on it for three days.', ok:false, tip:'❌ Missing “have been”.'},
            {t:'By Friday, I’ll have worked for three days.', ok:false, tip:'❌ Focus not duration-in-progress.'},
          ]
        }
      ],
      testCount: 7
    },
    C1: {
      mission: 'Target: ✅ 14 points. Add: “be to / be on the verge of” + nuanced polite forecasting.',
      arenaCount: 8,
      arena: [
        {prompt:'(Duration) By 6 pm, you study for three hours.', hint:'for + duration + by', answer:'Future perfect continuous',
          options:['Future perfect','Future perfect continuous','Future continuous'],
          explain:'Duration up to a deadline → “will have been studying for three hours.”'},
        {prompt:'(Deadline) By the time the call starts, you send the deck.', hint:'by the time', answer:'Future perfect',
          options:['Future perfect','Future continuous','Present perfect'],
          explain:'Completed before another future event → “will have sent”.'},
        {prompt:'(Immediate) The train is about to depart.', hint:'about to', answer:'Be about to',
          options:['Be about to','Be due to','Future perfect'],
          explain:'Immediate future → “is about to depart”.'},
        {prompt:'(Formal schedule) The CEO is due to arrive at noon.', hint:'due to', answer:'Be due to',
          options:['Be set to','Be due to','Will (simple)'],
          explain:'Formal schedule → “is due to arrive”.'},
        {prompt:'(News style) The company is set to announce layoffs.', hint:'set to', answer:'Be set to',
          options:['Be about to','Be set to','Future continuous'],
          explain:'Strong expectation → “is set to announce”.'},
        {prompt:'(Polite) Ask if someone will have finished before the meeting.', hint:'Will you have…?', answer:'Polite future question',
          options:['Polite future question','Future perfect','Going to'],
          explain:'Polite question uses future perfect form → “Will you have finished…?”'},
        {prompt:'(C1 nuance) A rule/timetable: “The new policy is to take effect on April 1.”', hint:'be to', answer:'Be to (formal)',
          options:['Be to (formal)','Be set to','Future perfect'],
          explain:'“Be to” = formal plan/order/schedule (often official tone).'},
        {prompt:'(C1 nuance) “We are on the verge of closing the deal.”', hint:'on the verge', answer:'On the verge of',
          options:['On the verge of','Be due to','Future perfect continuous'],
          explain:'Very close to happening (strong “almost”).'},
      ],
      gaps: [
        {before:'By 6 pm, I', after:' studying for three hours.', ans:'will have been', tip:'future perfect continuous core'},
        {before:'The new policy is', after:' take effect on April 1.', ans:'to', tip:'be to (formal)'},
        {before:'We are on the', after:' of closing the deal.', ans:'verge', tip:'on the verge of'},
      ],
      tap: [
        'Will you have finished by 5 pm?',
        'The new policy is to take effect on April 1.',
        'By 6 pm, I will have been studying for three hours.',
      ],
      dialogue: [
        {
          speaker:'Executive Assistant',
          line:'Is the CEO arriving today?',
          choices:[
            {t:'She is due to arrive at noon.', ok:true, tip:'✅ Formal schedule.'},
            {t:'She will arriving at noon.', ok:false, tip:'❌ Form error.'},
            {t:'She has arrived at noon.', ok:false, tip:'❌ Wrong tense.'},
          ]
        },
        {
          speaker:'Client',
          line:'Will you have completed the onboarding by Friday?',
          choices:[
            {t:'Yes, we will have completed it by Friday.', ok:true, tip:'✅ Future perfect.'},
            {t:'Yes, we will be completed it by Friday.', ok:false, tip:'❌ Wrong structure.'},
            {t:'Yes, we complete it by Friday.', ok:false, tip:'❌ Present simple sounds like timetable, not promise.'},
          ]
        }
      ],
      testCount: 8
    }
  };

  // C1 extras in toolkit only at C1
  const C1_EXTRA_TOOLKIT = [
    {
      key:'beTo',
      name:'Be to (formal)',
      form:'am/is/are to + V',
      focus:'Official plan/order/schedule (formal)',
      keywords:['is to','are to','be to take effect'],
      examples:[
        'The new policy is to take effect on April 1.',
        'All employees are to complete the training by Monday.'
      ],
      tip:'Sounds official (press release / policy).'
    },
    {
      key:'verge',
      name:'On the verge of',
      form:'am/is/are on the verge of + V‑ing',
      focus:'Very close to happening',
      keywords:['on the verge of','about to (but more dramatic)'],
      examples:[
        'We are on the verge of signing the contract.',
        'The system is on the verge of crashing.'
      ],
      tip:'Strong “almost”. Great for dramatic situations.'
    }
  ];

  // ---------- UI builders ----------
  function updateMission(){
    els.missionBox.textContent = BANK[state.level].mission;
  }

  function buildToolkit(){
    els.toolkitCards.innerHTML = '';
    const list = state.level === 'C1' ? TENSES.concat(C1_EXTRA_TOOLKIT) : TENSES.slice();

    list.forEach(t => {
      const card = document.createElement('div');
      card.className = 'tcard';
      card.setAttribute('tabindex','0');
      card.setAttribute('role','button');

      const kws = t.keywords.map(k=>`<span class="tag">${escapeHtml(k)}</span>`).join(' ');

      card.innerHTML = `
        <div class="top">
          <div>
            <div class="name">${escapeHtml(t.name)}</div>
            <div class="mini">${escapeHtml(t.focus)}</div>
          </div>
          <div class="tag">${escapeHtml(t.form)}</div>
        </div>
        <div class="body">
          <div class="formula">${escapeHtml(t.form)} • <span class="muted">${escapeHtml(t.focus)}</span></div>
          <div class="chips" style="margin-top:10px">${kws}</div>
          <div style="margin-top:10px">
            <div class="label">Model sentences</div>
            <div class="result">
              <div>• ${escapeHtml(t.examples[0])}</div>
              <div>• ${escapeHtml(t.examples[1])}</div>
            </div>
          </div>
          <div class="warn" style="margin-top:10px"><strong>Tip:</strong> ${escapeHtml(t.tip)}</div>
        </div>
      `;

      const toggle = () => card.classList.toggle('open');
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); }});

      els.toolkitCards.appendChild(card);
    });
  }

  function collapseCards(){
    document.querySelectorAll('.tcard.open').forEach(c=>c.classList.remove('open'));
  }

  function buildKeywordChips(){
    els.keywordChips.innerHTML = '';
    KEYWORDS.forEach(k=>{
      const b = document.createElement('button');
      b.className = 'chip' + (state.selectedKeyword===k.id?' active':'');
      b.type='button';
      b.textContent = k.label;
      b.addEventListener('click', ()=>{
        state.selectedKeyword = k.id;
        document.querySelectorAll('#keywordChips .chip').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
      });
      els.keywordChips.appendChild(b);
    });
  }

  function tenseNameByKey(key){
    const all = TENSES.concat(C1_EXTRA_TOOLKIT);
    const found = all.find(t=>t.key===key);
    return found ? found.name : key;
  }

  function recommendFromKeyword(keywordId){
    const kw = KEYWORDS.find(x=>x.id===keywordId);
    if(!kw) return null;
    // map to internal tense key
    const map = {
      futPerf:'futPerf',
      futCont:'futCont',
      futPerfCont:'futPerfCont',
      aboutTo:'aboutTo',
      dueTo:'dueTo',
      setTo:'setTo',
      politeQ:'politeQ'
    };
    return {
      keyword: kw.label,
      tenseKey: map[kw.tense] || kw.tense,
      why: kw.why
    };
  }

  function modelSentence(rec, situation, register){
    const tenseKey = rec.tenseKey;
    // Build a simple, situation-flavored sentence
    const templates = {
      work: {
        futCont: 'At this time tomorrow, we will be reviewing the final draft.',
        futPerf: 'By Friday, we will have sent the updated proposal.',
        futPerfCont: 'By 6 pm, I will have been working on this for three hours.',
        aboutTo: 'I’m about to send the email — can you check it quickly?',
        dueTo: 'The meeting is due to start at 2:00.',
        setTo: 'The team is set to announce the results next week.',
        politeQ: 'Will you be available after lunch to discuss the timeline?'
      },
      travel: {
        futCont: 'This time next week, we’ll be flying to New York.',
        futPerf: 'By the time we land, we will have completed the online form.',
        futPerfCont: 'By arrival time, we will have been traveling for 10 hours.',
        aboutTo: 'We’re about to board — talk to you soon.',
        dueTo: 'The flight is due to depart at 9:15.',
        setTo: 'Flights are set to be busy this weekend.',
        politeQ: 'Will you be checking in online today?'
      },
      family: {
        futCont: 'At 7 tonight, we’ll be putting the kids to bed.',
        futPerf: 'By the time they arrive, we’ll have prepared dinner.',
        futPerfCont: 'By bedtime, she’ll have been practicing for two hours.',
        aboutTo: 'I’m about to pick them up from school.',
        dueTo: 'The appointment is due to begin at 4:30.',
        setTo: 'The schedule is set to change next month.',
        politeQ: 'Will you be using the car tomorrow morning?'
      },
      study: {
        futCont: 'At this time tomorrow, I will be studying for the exam.',
        futPerf: 'By Friday, I will have finished the revision plan.',
        futPerfCont: 'By 6 pm, I will have been studying for three hours.',
        aboutTo: 'I’m about to start a practice test.',
        dueTo: 'The exam is due to start at 9:00.',
        setTo: 'The course is set to finish next month.',
        politeQ: 'Will you have finished the assignment by tonight?'
      },
      health: {
        futCont: 'At 3 pm tomorrow, we’ll be seeing the specialist.',
        futPerf: 'By the time we arrive, we will have filled out the forms.',
        futPerfCont: 'By the appointment, I will have been fasting for 12 hours.',
        aboutTo: 'I’m about to call the clinic now.',
        dueTo: 'The appointment is due to begin at 10:15.',
        setTo: 'Prices are set to rise next year.',
        politeQ: 'Will you be taking any medication before the test?'
      }
    };

    let s = (templates[situation] && templates[situation][tenseKey]) ? templates[situation][tenseKey] : 'By Friday, we will have finished.';
    if(register==='formal'){
      // make it slightly more formal
      s = s.replace("we'll","we will").replace("I’m","I am").replace("We’re","We are");
      if(!s.endsWith('.')) s += '.';
    } else if(register==='polite'){
      // soften with please in some cases
      if(tenseKey==='politeQ' && !/please/i.test(s)) s = s.replace('?', ' please?');
    }
    return s;
  }

  function detect(){
    if(!state.selectedKeyword){
      setResult(els.detectOut, 'Pick a keyword chip first.', 'warn');
      return;
    }
    const rec = recommendFromKeyword(state.selectedKeyword);
    if(!rec){
      setResult(els.detectOut, 'No recommendation found.', 'bad');
      return;
    }
    // gate for B1 (hide some advanced tense explanations but still allow)
    if(state.level==='B1' && (rec.tenseKey==='futPerfCont' || rec.tenseKey==='dueTo' || rec.tenseKey==='setTo')){
      setResult(els.detectOut,
        `✅ Best choice: <strong>${escapeHtml(tenseNameByKey(rec.tenseKey))}</strong><br/>
         <span class="muted">Why:</span> ${escapeHtml(rec.why)}<br/>
         <div class="warn" style="margin-top:10px"><strong>Level note:</strong> This is B2+ material. You can still use it, but focus first on future perfect vs future continuous.</div>`,
        'good'
      );
    } else {
      const situation = els.situationSel.value;
      const register = els.registerSel.value;
      const model = modelSentence(rec, situation, register);
      state.lastDetectText = model;

      setResult(els.detectOut,
        `✅ Best choice: <strong>${escapeHtml(tenseNameByKey(rec.tenseKey))}</strong><br/>
         <span class="muted">Keyword:</span> <span class="kbd">${escapeHtml(rec.keyword)}</span><br/>
         <span class="muted">Why:</span> ${escapeHtml(rec.why)}<br/>
         <div class="result" style="margin-top:10px"><strong>Model:</strong> ${escapeHtml(model)}</div>`,
        'good'
      );
    }
    bumpScore(1);
  }

  function buildCheatsheet(){
    const text = [
      'ADVANCED FUTURE TENSES — MINI CHEATSHEET',
      '',
      '1) Future continuous = will be + V-ing',
      '   Use: action in progress at a future moment.',
      '   Keywords: at this time…, this time next…, when you call/arrive',
      '   Example: At 6 pm, I will be meeting the client.',
      '',
      '2) Future perfect = will have + past participle',
      '   Use: completed by a deadline.',
      '   Keywords: by Friday, by 6 pm, by the time…, before + time',
      '   Example: By Friday, I will have finished the report.',
      '',
      '3) Future perfect continuous = will have been + V-ing',
      '   Use: duration up to a deadline.',
      '   Keywords: for + duration + by + time',
      '   Example: By June, I will have been working here for 2 years.',
      '',
      '4) Be about to = am/is/are about to + V',
      '   Use: immediate future (seconds/minutes).',
      '   Example: I’m about to leave.',
      '',
      '5) Be due to / be set to (formal/news)',
      '   due to = scheduled/expected (timetables)',
      '   set to = strong expectation (news style)',
      '',
      '6) Polite future questions',
      '   Will you be …ing? / Will you have …?',
      '   Example: Will you have finished by 5 pm?',
    ].join('\n');
    return text;
  }

  // ---------- arena quiz ----------
  function renderQuiz(container, items){
    container.innerHTML = '';
    items.forEach((q,idx)=>{
      const div = document.createElement('div');
      div.className = 'q';
      div.dataset.tries='0';
      div.innerHTML = `
        <div class="qhead">
          <div>
            <div class="qtitle">${escapeHtml(q.prompt)}</div>
            <div class="qhint">Hint: <span class="kbd">${escapeHtml(q.hint)}</span></div>
          </div>
          <div class="tag">Q${idx+1}</div>
        </div>
        <div class="opts"></div>
        <div class="explain">${escapeHtml(q.explain)}</div>
      `;
      const optsEl = div.querySelector('.opts');
      q.options.forEach(optText=>{
        const b = document.createElement('button');
        b.className = 'opt';
        b.type = 'button';
        b.textContent = optText;
        b.addEventListener('click', ()=>{
          if(div.dataset.done==='1') return;
          let tries = parseInt(div.dataset.tries,10) || 0;
          tries += 1;
          div.dataset.tries = String(tries);

          const ok = norm(optText) === norm(q.answer);
          b.classList.add(ok ? 'correct' : 'wrong');

          if(ok){
            div.dataset.done='1';
            Array.from(optsEl.querySelectorAll('.opt')).forEach(x=>x.disabled=true);
            div.querySelector('.explain').style.display='block';
            bumpScore(2);
          } else {
            // after 2 tries reveal
            if(tries >= 2){
              div.querySelector('.explain').style.display='block';
            }
          }
        });
        optsEl.appendChild(b);
      });
      if(state.teacher) div.querySelector('.explain').style.display='block';
      container.appendChild(div);
    });
  }

  function buildArena(){
    const data = BANK[state.level];
    const set = shuffle(data.arena).slice(0, data.arenaCount);
    renderQuiz(els.arenaQuiz, set);
  }

  function buildGaps(){
    const items = BANK[state.level].gaps;
    els.gapBox.innerHTML = '';
    items.forEach(it=>{
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `
        <div class="row" style="justify-content:space-between">
          <div class="tag">${escapeHtml(it.tip)}</div>
          <button class="btn small ghost" data-act="show">Show answer</button>
        </div>
        <div class="gapline" style="margin-top:10px">
          <span>${escapeHtml(it.before)}</span>
          <input class="input" placeholder="…" autocomplete="off"/>
          <span>${escapeHtml(it.after)}</span>
        </div>
        <div class="feedback" aria-live="polite"></div>
        <div class="explain">Answer: ${escapeHtml(it.ans)}</div>
      `;
      const inp = div.querySelector('input');
      const fb = div.querySelector('.feedback');
      const exp = div.querySelector('.explain');
      const btn = div.querySelector('button');

      const check = ()=>{
        const v = norm(inp.value);
        if(!v){ fb.textContent=''; fb.classList.remove('good','bad'); return; }
        const ok = v === norm(it.ans);
        fb.textContent = ok ? '✅ Correct' : '❌ Try again';
        fb.classList.toggle('good', ok);
        fb.classList.toggle('bad', !ok);
        if(ok){ bumpScore(1); }
      };
      inp.addEventListener('input', check);

      btn.addEventListener('click', ()=>{
        exp.style.display = (exp.style.display==='block') ? 'none':'block';
      });

      if(state.teacher) exp.style.display='block';
      els.gapBox.appendChild(div);
    });
  }

  // ---------- forge ----------
  function fillForgeSelects(){
    // tenses shown in forge depend on level
    const base = [
      {key:'futCont', label:'Future continuous (will be + ing)'},
      {key:'futPerf', label:'Future perfect (will have + pp)'},
      {key:'aboutTo', label:'Be about to (am/is/are about to + V)'},
      {key:'politeQ', label:'Polite question (Will you be…?)'},
    ];
    const extraB2 = [
      {key:'futPerfCont', label:'Future perfect continuous (will have been + ing)'},
      {key:'dueTo', label:'Be due to (scheduled)'},
      {key:'setTo', label:'Be set to (likely)'},
    ];
    const extraC1 = [
      {key:'beTo', label:'Be to (formal)'},
      {key:'verge', label:'On the verge of (…of + ing)'},
    ];

    let list = base.slice();
    if(state.level!=='B1') list = list.concat(extraB2);
    if(state.level==='C1') list = list.concat(extraC1);

    els.forgeTense.innerHTML = list.map(x=>`<option value="${x.key}">${escapeHtml(x.label)}</option>`).join('');
    // verbs
    els.forgeVerb.innerHTML = FORGE.verbs.map(v=>`<option value="${v.v}">${escapeHtml(v.v)}</option>`).join('');
    // objects and times
    els.forgeObj.innerHTML = FORGE.objects.map(o=>`<option>${escapeHtml(o)}</option>`).join('');
    els.forgeTime.innerHTML = FORGE.times.map(t=>`<option>${escapeHtml(t)}</option>`).join('');
  }

  function contract(s){
    // light contractions for friendly style
    return s
      .replace(/\bI will\b/g,"I'll")
      .replace(/\bWe will\b/g,"We'll")
      .replace(/\bYou will\b/g,"You'll")
      .replace(/\bThey will\b/g,"They'll")
      .replace(/\bHe will\b/g,"He'll")
      .replace(/\bShe will\b/g,"She'll")
      .replace(/\bI am\b/g,"I'm")
      .replace(/\bWe are\b/g,"We're")
      .replace(/\bYou are\b/g,"You're")
      .replace(/\bThey are\b/g,"They're")
      .replace(/\bHe is\b/g,"He's")
      .replace(/\bShe is\b/g,"She's");
  }

  function conjBe(subj){
    const s = subj.toLowerCase();
    if(s==='i') return 'am';
    if(s==='he'||s==='she'||s==='it') return 'is';
    return 'are';
  }

  function buildForge(){
    const tense = els.forgeTense.value;
    const subj = els.forgeSubj.value;
    const verb = els.forgeVerb.value;
    const obj = els.forgeObj.value;
    const time = els.forgeTime.value;
    const style = els.forgeStyle.value;

    const v = FORGE.verbs.find(x=>x.v===verb) || {v:verb, pp:verb+'ed', ing:verb+'ing'};
    const be = conjBe(subj);
    const subjCap = subj;

    let aff='', neg='', q='';

    switch(tense){
      case 'futCont':
        aff = `${subjCap} will be ${v.ing} ${obj} ${time}.`;
        neg = `${subjCap} will not be ${v.ing} ${obj} ${time}.`;
        q   = `Will ${subjCap.toLowerCase()==='i'?'I':subjCap} be ${v.ing} ${obj} ${time}?`;
        break;
      case 'futPerf':
        aff = `${subjCap} will have ${v.pp} ${obj} ${time}.`;
        neg = `${subjCap} will not have ${v.pp} ${obj} ${time}.`;
        q   = `Will ${subjCap.toLowerCase()==='i'?'I':subjCap} have ${v.pp} ${obj} ${time}?`;
        break;
      case 'futPerfCont':
        aff = `${subjCap} will have been ${v.ing} ${obj} ${time}.`;
        neg = `${subjCap} will not have been ${v.ing} ${obj} ${time}.`;
        q   = `Will ${subjCap.toLowerCase()==='i'?'I':subjCap} have been ${v.ing} ${obj} ${time}?`;
        break;
      case 'aboutTo':
        aff = `${subjCap} ${be} about to ${v.v} ${obj} ${time==='any second now'?'any second now':''}.`.replace(/\s+/g,' ').trim();
        neg = `${subjCap} ${be} not about to ${v.v} ${obj}.`;
        q   = `${be[0].toUpperCase()+be.slice(1)} ${subjCap.toLowerCase()==='i'?'I':subjCap} about to ${v.v} ${obj}?`;
        break;
      case 'dueTo':
        // make it more natural with "is due to" (subject can be a thing)
        aff = `The ${obj} is due to start ${time}.`;
        neg = `The ${obj} is not due to start ${time}.`;
        q   = `Is the ${obj} due to start ${time}?`;
        break;
      case 'setTo':
        aff = `The ${obj} is set to change ${time}.`;
        neg = `The ${obj} is not set to change ${time}.`;
        q   = `Is the ${obj} set to change ${time}?`;
        break;
      case 'politeQ':
        aff = `Will you be ${v.ing} ${obj} ${time}?`;
        neg = `I’m not sure if you’ll be ${v.ing} ${obj} ${time}.`;
        q   = `Will you have ${v.pp} ${obj} ${time}?`;
        break;
      case 'beTo':
        aff = `The ${obj} is to begin ${time}.`;
        neg = `The ${obj} is not to begin ${time}.`;
        q   = `Is the ${obj} to begin ${time}?`;
        break;
      case 'verge':
        aff = `${subjCap} ${be} on the verge of ${v.ing} ${obj}.`;
        neg = `${subjCap} ${be} not on the verge of ${v.ing} ${obj}.`;
        q   = `${be[0].toUpperCase()+be.slice(1)} ${subjCap.toLowerCase()==='i'?'I':subjCap} on the verge of ${v.ing} ${obj}?`;
        break;
      default:
        aff = `${subjCap} will ${v.v} ${obj} ${time}.`;
        neg = `${subjCap} will not ${v.v} ${obj} ${time}.`;
        q   = `Will ${subjCap.toLowerCase()==='i'?'I':subjCap} ${v.v} ${obj} ${time}?`;
    }

    if(style==='friendly'){
      aff = contract(aff);
      neg = contract(neg).replace('will not','won’t');
      q = contract(q);
    }
    if(style==='formal'){
      // remove contractions
      aff = aff.replace(/\bI'll\b/g,'I will').replace(/\bWe'll\b/g,'We will').replace(/\bI’m\b/g,'I am').replace(/\bWe’re\b/g,'We are');
      neg = neg.replace(/\bwon’t\b/g,'will not').replace(/\bI’m\b/g,'I am').replace(/\bWe’re\b/g,'We are');
      q = q.replace(/\bI'll\b/g,'I will').replace(/\bWe’ll\b/g,'We will').replace(/\bI’m\b/g,'I am');
    }

    const out = [
      `<div><span class="tag">Affirmative</span> <span class="kbd">${escapeHtml(aff)}</span></div>`,
      `<div style="margin-top:8px"><span class="tag">Negative</span> <span class="kbd">${escapeHtml(neg)}</span></div>`,
      `<div style="margin-top:8px"><span class="tag">Question</span> <span class="kbd">${escapeHtml(q)}</span></div>`,
    ].join('');

    state.lastForgeText = `${aff}\n${neg}\n${q}`;

    setResult(els.forgeOut, out, 'good');
    bumpScore(1);
  }

  // ---------- micro quiz ----------
  function buildMicroQuiz(){
    const items = [
      {
        prompt:'Pick the best: “_____ tomorrow at 10, so I can’t answer.”',
        hint:'in progress at a specific time',
        answer:'I’ll be driving',
        options: shuffle(['I’ll have driven','I’ll be driving','I drive']),
        explain:'At a specific future time + in progress → future continuous.'
      },
      {
        prompt:'Pick the best: “By 5 pm, _____ the forms.”',
        hint:'deadline',
        answer:'we’ll have completed',
        options: shuffle(['we’ll be completing','we’ll have completed','we complete']),
        explain:'By + time → future perfect.'
      },
      {
        prompt:'Pick the best: “By 6 pm, _____ for three hours.”',
        hint:'duration + deadline',
        answer:'I’ll have been studying',
        options: shuffle(['I’ll be studying','I’ll have studied','I’ll have been studying']),
        explain:'For + duration + by + time → future perfect continuous.'
      },
    ];
    // gate: remove item 3 for B1
    const list = state.level==='B1' ? items.slice(0,2) : items;
    renderQuiz(els.microQuiz, list.map(q=>({
      prompt:q.prompt, hint:q.hint, answer:q.answer,
      options:q.options, explain:q.explain
    })));
  }

  // ---------- tap order ----------
  function tokenize(sentence){
    return sentence
      .replace(/([.,!?;:])/g,' $1 ')
      .replace(/\s+/g,' ')
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(t=>({text:t, used:false, order:null}));
  }
  function buildTapOrder(){
    const sentences = shuffle(BANK[state.level].tap).slice(0,3);
    els.tapBox.innerHTML = '';

    sentences.forEach((s, idx)=>{
      const correct = tokenize(s);
      const bank = shuffle(correct.map(t=>({text:t.text, used:false, ref:t})));

      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `
        <div class="qhead">
          <div>
            <div class="qtitle">Sentence ${idx+1}</div>
            <div class="muted2">Build: <span class="kbd">${escapeHtml(s)}</span></div>
          </div>
          <div class="row">
            <button class="btn small ghost" data-act="hint">Hint</button>
            <button class="btn small ghost" data-act="reset">Reset</button>
          </div>
        </div>
        <div class="muted2" style="margin-top:10px"><span class="tag">BANK</span></div>
        <div class="bank"></div>
        <div class="muted2" style="margin-top:10px"><span class="tag">BUILD</span></div>
        <div class="built"></div>
        <div class="row" style="margin-top:10px">
          <button class="btn" data-act="check">Check</button>
        </div>
        <div class="result" aria-live="polite">Tap words to build, then check.</div>
      `;

      const bankEl = div.querySelector('.bank');
      const builtEl = div.querySelector('.built');
      const resEl = div.querySelector('.result');

      function render(){
        bankEl.innerHTML = '';
        builtEl.innerHTML = '';
        const chosen = correct.filter(t=>t.order!=null).sort((a,b)=>a.order-b.order);
        chosen.forEach(t=>{
          const tok=document.createElement('span');
          tok.className='token';
          tok.textContent=t.text;
          tok.addEventListener('click', ()=>{
            t.used=false; t.order=null;
            const left = correct.filter(x=>x.order!=null).sort((a,b)=>a.order-b.order);
            left.forEach((x,i)=>x.order=i);
            // also free bank ref
            const b = bank.find(x=>x.ref===t);
            if(b) b.used=false;
            render();
          });
          builtEl.appendChild(tok);
        });

        bank.forEach(b=>{
          if(b.used) return;
          const tok=document.createElement('span');
          tok.className='token';
          tok.textContent=b.text;
          tok.addEventListener('click', ()=>{
            b.used=true;
            const max = Math.max(-1, ...correct.map(x=>x.order==null?-1:x.order));
            b.ref.order = max+1;
            b.ref.used = true;
            render();
          });
          bankEl.appendChild(tok);
        });
      }

      function builtSentence(){
        const chosen=correct.filter(t=>t.order!=null).sort((a,b)=>a.order-b.order).map(t=>t.text).join(' ');
        return chosen.replace(/\s+([.,!?;:])/g,'$1');
      }
      function reset(){
        correct.forEach(t=>{t.used=false; t.order=null;});
        bank.forEach(b=>{b.used=false;});
        setResult(resEl, 'Tap words to build, then check.', null);
        render();
      }
      function hint(){
        const first = correct[0].text;
        setResult(resEl, `Hint: first word is <span class="kbd">${escapeHtml(first)}</span>`, 'warn');
      }
      function check(){
        const built = builtSentence();
        const ok = norm(built) === norm(s);
        if(ok){
          setResult(resEl, '✅ Correct!', 'good');
          bumpScore(2);
        } else {
          setResult(resEl, `❌ Not yet. You built: <span class="kbd">${escapeHtml(built||'—')}</span>`, 'bad');
        }
      }

      div.querySelectorAll('[data-act]').forEach(btn=>{
        const act = btn.getAttribute('data-act');
        btn.addEventListener('click', ()=>{
          if(act==='reset') reset();
          if(act==='hint') hint();
          if(act==='check') check();
        });
      });

      reset();
      els.tapBox.appendChild(div);
    });
  }

  // ---------- dialogue ----------
  function buildDialogue(){
    const turns = BANK[state.level].dialogue;
    els.dialogueBox.innerHTML = '';
    let idx = 0;

    function render(){
      els.dialogueBox.innerHTML = '';
      for(let i=0;i<=idx;i++){
        const t = turns[i];
        const card = document.createElement('div');
        card.className = 'dcard';
        card.innerHTML = `
          <div class="bubble">
            <div class="role">${escapeHtml(t.speaker)}</div>
            <div>${escapeHtml(t.line)}</div>
          </div>
        `;

        if(i===idx){
          const opts = document.createElement('div');
          opts.className = 'opts';
          t.choices.forEach(ch=>{
            const b = document.createElement('button');
            b.className='opt';
            b.textContent = ch.t;
            b.addEventListener('click', ()=>{
              Array.from(opts.querySelectorAll('.opt')).forEach(x=>x.disabled=true);
              b.classList.add(ch.ok ? 'correct':'wrong');
              const you = document.createElement('div');
              you.className = 'bubble you';
              you.style.marginTop='10px';
              you.innerHTML = `<div class="role">You</div><div>${escapeHtml(ch.t)}</div><div class="muted2" style="margin-top:6px">${escapeHtml(ch.tip)}</div>`;
              card.appendChild(you);
              if(ch.ok) bumpScore(2);
              setTimeout(()=>{
                if(idx < turns.length-1){ idx++; render(); }
                else{
                  const done = document.createElement('div');
                  done.className='result good';
                  done.textContent='✅ Dialogue complete.';
                  els.dialogueBox.appendChild(done);
                }
              }, 240);
            });
            opts.appendChild(b);
          });
          card.appendChild(opts);
        }

        els.dialogueBox.appendChild(card);
      }
    }
    render();
  }

  // ---------- mini test ----------
  function buildTest(){
    const data = BANK[state.level];
    const pool = shuffle(data.arena).slice(0, data.testCount).map(x=>{
      // convert to quiz structure with 2 tries behavior already in renderQuiz
      return {
        prompt: x.prompt,
        hint: x.hint,
        answer: x.answer,
        options: shuffle(x.options),
        explain: x.explain
      };
    });
    renderQuiz(els.testQuiz, pool);
  }

  // ---------- events ----------
  function wireToggles(){
    // level
    document.querySelectorAll('.segbtn[data-level]').forEach(b=>{
      b.addEventListener('click', ()=>{
        document.querySelectorAll('.segbtn[data-level]').forEach(x=>{x.classList.remove('active'); x.setAttribute('aria-selected','false');});
        b.classList.add('active'); b.setAttribute('aria-selected','true');
        state.level = b.dataset.level;
        hardReset(false);
      });
    });
    // voice
    document.querySelectorAll('.segbtn[data-voice]').forEach(b=>{
      b.addEventListener('click', ()=>{
        document.querySelectorAll('.segbtn[data-voice]').forEach(x=>{x.classList.remove('active'); x.setAttribute('aria-selected','false');});
        b.classList.add('active'); b.setAttribute('aria-selected','true');
        state.voice = b.dataset.voice;
        els.voicePill.textContent = state.voice;
      });
    });
  }

  function hardReset(scrollTop=true){
    state.score = 0;
    els.scorePill.textContent = '0';
    state.selectedKeyword = null;
    state.lastDetectText = '';
    state.lastForgeText = '';
    updateMission();

    buildToolkit();
    buildKeywordChips();

    // reset detect UI
    setResult(els.detectOut, 'Choose a keyword chip, then click Detect.', null);

    // cheat
    els.cheatBox.value = buildCheatsheet();
    els.cheatBox.classList.add('hide');
    setResult(els.cheatResult, 'Ready.', null);

    fillForgeSelects();
    setResult(els.forgeOut, 'Ready.', null);

    buildArena();
    buildGaps();
    buildMicroQuiz();
    buildTapOrder();
    buildDialogue();
    buildTest();

    if(scrollTop) window.scrollTo({top:0, behavior:'smooth'});
  }

  function wireButtons(){
    els.btnTeacher.addEventListener('click', ()=>{
      state.teacher = !state.teacher;
      document.body.classList.toggle('teacher', state.teacher);
      els.btnTeacher.textContent = `Teacher: ${state.teacher?'ON':'OFF'}`;
      // rebuild quizzes to show explanations if needed
      buildArena(); buildGaps(); buildMicroQuiz(); buildTest();
    });

    els.btnReset.addEventListener('click', ()=>hardReset(true));
    els.btnPrint.addEventListener('click', ()=>window.print());

    els.btnCollapseCards.addEventListener('click', collapseCards);

    els.btnDetect.addEventListener('click', detect);
    els.btnSayDetect.addEventListener('click', ()=>{
      const t = state.lastDetectText || els.detectOut.textContent || '';
      speak(t);
    });
    els.btnCopyDetect.addEventListener('click', ()=>{
      const t = state.lastDetectText || els.detectOut.textContent || '';
      copyToClipboard(t);
      setResult(els.detectOut, els.detectOut.innerHTML + `<div class="muted2" style="margin-top:8px">✅ Copied.</div>`, 'good');
    });

    els.btnCopyCheat.addEventListener('click', ()=>{
      const t = buildCheatsheet();
      copyToClipboard(t);
      setResult(els.cheatResult, '✅ Cheatsheet copied.', 'good');
    });
    els.btnShowCheat.addEventListener('click', ()=>{
      els.cheatBox.value = buildCheatsheet();
      els.cheatBox.classList.toggle('hide');
      els.btnShowCheat.textContent = els.cheatBox.classList.contains('hide') ? 'Show' : 'Hide';
    });

    els.btnNewSet.addEventListener('click', buildArena);
    els.btnResetArena.addEventListener('click', buildArena);

    els.btnForge.addEventListener('click', buildForge);
    els.btnForgeSay.addEventListener('click', ()=>{ if(state.lastForgeText) speak(state.lastForgeText.split('\n')[0]); });
    els.btnForgeCopy.addEventListener('click', ()=>{ if(state.lastForgeText){ copyToClipboard(state.lastForgeText); setResult(els.forgeOut, els.forgeOut.innerHTML + `<div class="muted2" style="margin-top:8px">✅ Copied.</div>`, 'good'); } });

    els.btnNewTap.addEventListener('click', buildTapOrder);
    els.btnResetTap.addEventListener('click', buildTapOrder);

    els.btnResetTest.addEventListener('click', buildTest);
  }

  function init(){
    if(els.jsStatus) els.jsStatus.textContent = 'Interactive: ON';
    // voice display
    els.voicePill.textContent = state.voice;
    // voices
    loadVoices();
    if(window.speechSynthesis){
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    wireToggles();
    wireButtons();
    hardReset(false);
  }

  init();
})();