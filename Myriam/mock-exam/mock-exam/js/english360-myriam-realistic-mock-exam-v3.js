(() => {
  'use strict';
  window.__E360Loaded = true;

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const pad2 = (n) => (n < 10 ? '0' + n : '' + n);
  const fmtTime = (s) => pad2(Math.floor(s / 60)) + ':' + pad2(s % 60);
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9\s’'\-]/g, ' ').replace(/\s+/g, ' ').trim();
  const wc = (t) => (t || '').trim().split(/\s+/).filter(Boolean).length;

  const state = {
    mode: 'exam',
    teacher: false,
    level: 'A2',
    accent: 'US',
    rate: 1,
    showFR: true,
    timers: { exam: null, sp: null, wr: null },
    score: { ok: 0, total: 0 },
    current: { lis: 0, read: 0, g: 0, fx: 0 },
    drafts: { writing: {}, speaking: {} },
    ui: { spPromptVisible: false, lisScriptVisible: false },
    currentV: null
  };

  // TTS
  const tts = { voices: [] };
  const loadVoices = () => { try { tts.voices = speechSynthesis.getVoices(); } catch (e) { tts.voices = []; } };
  const pickVoice = () => {
    const v = tts.voices || [];
    if (!v.length) return null;
    const wants = state.accent === 'UK' ? ['en-GB', 'United Kingdom', 'UK'] : ['en-US', 'United States', 'US'];
    for (let i = 0; i < v.length; i++) {
      const x = v[i];
      for (let k = 0; k < wants.length; k++) {
        const w = wants[k];
        if ((x.lang || '').indexOf(w) >= 0 || (x.name || '').indexOf(w) >= 0) return x;
      }
    }
    for (let i2 = 0; i2 < v.length; i2++) if ((v[i2].lang || '').indexOf('en') === 0) return v[i2];
    return v[0];
  };
  const speak = (text) => {
    if (!('speechSynthesis' in window) || !text) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = state.rate;
      const v = pickVoice();
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) {}
  };

  // Score
  const updateScore = () => {
    $('#scorePill').textContent = state.score.ok + ' / ' + state.score.total;
    $('#acc').textContent = state.score.total ? Math.round(state.score.ok / state.score.total * 100) + '%' : '0%';
  };
  const addScore = (ok) => { state.score.total++; if (ok) state.score.ok++; updateScore(); };
  const resetScore = () => { state.score.ok = 0; state.score.total = 0; updateScore(); };

  // Timers
  const startTimer = (key, seconds, outEl) => {
    if (state.timers[key]) clearInterval(state.timers[key]);
    let left = seconds;
    outEl.textContent = fmtTime(left);
    state.timers[key] = setInterval(() => {
      left--;
      outEl.textContent = fmtTime(Math.max(0, left));
      if (left <= 0) { clearInterval(state.timers[key]); state.timers[key] = null; }
    }, 1000);
  };
  const stopTimer = (key, outEl) => {
    if (state.timers[key]) clearInterval(state.timers[key]);
    state.timers[key] = null;
    outEl.textContent = '00:00';
  };

  const isPractice = () => state.mode === 'practice' || state.teacher;

  // Mode/Teacher/Level/Accent
  const setMode = (mode) => {
    state.mode = mode;
    $$('.segBtn[data-mode]').forEach(btn => btn.classList.toggle('on', btn.getAttribute('data-mode') === mode));
    applyVisibility();
    setSpeakingPromptVisible(isPractice());
  };
  const setTeacher = (on) => {
    state.teacher = !!on;
    const b = $('#teacherToggle');
    b.textContent = 'Teacher mode: ' + (state.teacher ? 'On' : 'Off');
    b.setAttribute('aria-pressed', state.teacher ? 'true' : 'false');
    applyVisibility();
    setSpeakingPromptVisible(isPractice());
  };
  const setLevel = (lvl) => {
    state.level = lvl;
    $$('.segBtn[data-level]').forEach(btn => btn.classList.toggle('on', btn.getAttribute('data-level') === lvl));
    $('#spModel').textContent = '—';
    $('#wrModel').textContent = '—';
  };
  const setAccent = (acc) => {
    state.accent = acc;
    $$('.segBtn[data-accent]').forEach(btn => btn.classList.toggle('on', btn.getAttribute('data-accent') === acc));
  };

  // Templates
  const emailTemplates = [
    'Subject: Request for information — reservation [DATES]',
    '',
    'Dear Reservations Team,',
    '',
    'I’m writing to ask about availability and prices.',
    'Could you please confirm availability and the total price including taxes?',
    'Could you also clarify what is included (breakfast, Wi‑Fi, parking)?',
    'If possible, I’d appreciate a quiet room away from the street.',
    '',
    'Thank you in advance for your assistance.',
    'Kind regards,',
    'Myriam'
  ];
  const showTemplates = () => {
    $('#templateBox').textContent =
      'Email skeleton:\n' + emailTemplates.join('\n') +
      '\n\nMini speaking skeleton:\n' +
      '1) Hello / Excuse me.\n2) Problem.\n3) Request (Could you… please?).\n4) Detail.\n5) Thank you.';
  };
  const copyTemplates = async () => {
    try{
      await navigator.clipboard.writeText(emailTemplates.join('\n'));
      $('#templateBox').textContent = 'Copied ✓\n\n' + emailTemplates.join('\n');
    }catch(e){
      showTemplates();
    }
  };

  // Listening
  const listening = [
    {prompt:'Announcement: choose the correct information.',
     audio:'Attention please. Flight 567 to Tenerife will now depart from gate B twelve. Boarding starts in ten minutes.',
     opts:[
      'The flight is delayed until tomorrow.',
      'The gate is B12 and boarding starts in 10 minutes.',
      'The flight number is 765 and the gate is A12.',
      'Boarding starts in two hours.'
     ],
     a:1, hint:'Listen for: flight number + gate + time.'},
    {prompt:'Hotel reception: choose the correct option.',
     audio:'Good evening. Breakfast is served from seven to ten. Wi‑Fi is included. Parking is ten euros per night.',
     opts:[
      'Breakfast is 7–10 and Wi‑Fi is included.',
      'Parking is free and breakfast starts at 6.',
      'Wi‑Fi costs 10 euros per night.',
      'Breakfast is all day.'
     ],
     a:0, hint:'Listen for times and what is included.'},
    {prompt:'Shop assistant: choose the correct option.',
     audio:'You can exchange the jacket within fourteen days if you have the receipt. Refunds are only possible within seven days.',
     opts:[
      'You can exchange within 14 days with a receipt.',
      'Refunds are possible anytime.',
      'You can exchange without a receipt.',
      'Refunds are possible within 14 days.'
     ],
     a:0, hint:'Listen for exchange vs refund.'},
    {prompt:'Restaurant server: choose the correct option.',
     audio:'The soup is not spicy, but the sauce contains nuts. Would you like a different dish?',
     opts:[
      'The soup is spicy and the sauce is nut‑free.',
      'The soup is not spicy, but the sauce contains nuts.',
      'Everything is nut‑free.',
      'The server cannot change the dish.'
     ],
     a:1, hint:'Listen for: spicy / nuts.'}
  ];
  let lisChoice = null;
  let lisPlayedOnce = false;

  const renderListening = () => {
    const item = listening[state.current.lis];
    $('#lisPrompt').textContent = 'Q' + (state.current.lis+1) + '/' + listening.length + ' — ' + item.prompt;
    $('#lisFb').textContent = '—';
    lisChoice = null;
    lisPlayedOnce = false;

    const host = $('#lisOpts');
    host.innerHTML = '';
    item.opts.forEach((opt, idx) => {
      const b = document.createElement('button');
      b.type='button'; b.className='optBtn';
      b.textContent = String.fromCharCode(65+idx) + ') ' + opt;
      b.addEventListener('click', () => {
        lisChoice = idx;
        $$('#lisOpts .optBtn').forEach(x=>x.classList.remove('on'));
        b.classList.add('on');
      });
      host.appendChild(b);
    });

    // script (show only when user clicks)
    state.ui.lisScriptVisible = false;
    const sb = $('#lisScriptBox');
    if(sb){ sb.textContent = item.audio; sb.style.display = 'none'; }
    const tb = $('#lisToggleScript');
    if(tb) tb.textContent = 'Show script';

    $('#lisTips').textContent =
      '• Read the options first.\n' +
      '• Listen for numbers (gate, time, price).\n' +
      '• Choose the option that matches ALL details.\n' +
      '• Exam mode: listen once.';

    applyVisibility();
  };

  const playListening = (replay) => {
    const item = listening[state.current.lis];
    if(state.mode==='exam' && lisPlayedOnce && !state.teacher) return;
    if(state.mode==='exam' && replay && !state.teacher) return;
    lisPlayedOnce = true;
    speak(item.audio);
  };

  const checkListening = () => {
    const item = listening[state.current.lis];
    if(lisChoice===null){ $('#lisFb').textContent='Choose an option first.'; return; }
    const ok = lisChoice===item.a;
    addScore(ok);

    let msg = ok ? '✅ Correct.' : '❌ Incorrect.';
    if(isPractice()){
      if(!ok) msg += `
Answer: ${String.fromCharCode(65+item.a)}`;
      msg += `
Hint: ${item.hint}`;
    }
    $('#lisFb').textContent = msg;
  };

  const nextListening = () => { state.current.lis = (state.current.lis+1) % listening.length; renderListening(); };

  // Reading
  const readingTexts = [
    {title:'Hotel email',
     text:`Subject: Your reservation

Dear Guest,
Thank you for your message. We confirm availability for a double room from May 4 to May 6.
The rate is €120 per night, including taxes. Breakfast and Wi‑Fi are included.
Parking costs €10 per night.

Kind regards,
Reservations Team`,
     qs:[
      {q:'What is the price per night?', answers:['120','€120','120 euros'], hint:'Look for: The rate is…'},
      {q:'Is breakfast included?', answers:['yes','yes it is','yes, breakfast is included'], hint:'Look for: Breakfast and Wi‑Fi are…'},
      {q:'How much is parking per night?', answers:['10','€10','10 euros'], hint:'Look for: Parking costs…'}
     ]},
    {title:'Lost luggage notice',
     text:`Dear Passenger,
We are sorry your bag did not arrive.
Please complete the online form with your flight number and baggage tag.
If we locate the bag, we will deliver it to your hotel within 24 hours.

Sincerely,
Baggage Services`,
     qs:[
      {q:'What should the passenger complete?', answers:['the online form','online form'], hint:'Look for: Please complete…'},
      {q:'What information is needed?', answers:['flight number and baggage tag','flight number','baggage tag'], hint:'Look for: with your… and…'},
      {q:'Where will they deliver the bag?', answers:['to your hotel','your hotel','hotel'], hint:'Look for: deliver it to…'}
     ]},
    {title:'Short article',
     text:`Many adults prefer online lessons because they save travel time and can study at home.
One-to-one lessons also allow personalised feedback.
However, some learners prefer face-to-face classes for social interaction.`,
     qs:[
      {q:'Why do many adults prefer online lessons?', answers:['they save travel time','save travel time','save time'], hint:'Look for: because…'},
      {q:'What is an advantage of one-to-one lessons?', answers:['personalised feedback','feedback'], hint:'Look for: allow…'},
      {q:'Why do some prefer face-to-face?', answers:['social interaction','interaction'], hint:'Look for: for…'}
     ]}
  ];

  const renderReading = () => {
    const item = readingTexts[state.current.read];
    $('#readText').textContent = item.title + '\n\n' + item.text;
    $('#readFb').textContent = '—';

    const host = $('#readQs');
    host.innerHTML = '';
    item.qs.forEach((q, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'panel mt10';
      wrap.innerHTML =
        '<div class="row" style="justify-content:space-between">' +
          '<div class="tiny muted">' + (i+1) + ') ' + q.q + '</div>' +
          '<div class="row">' +
            '<span class="pill mono" id="rm'+i+'">—</span>' +
            '<button class="pill ghost" type="button" data-h="'+i+'">Hint</button>' +
          '</div>' +
        '</div>' +
        '<input class="input mt10" data-i="'+i+'" placeholder="Your answer…">' +
        '<div class="tiny muted mt6" id="rh'+i+'" style="display:none"></div>';
      host.appendChild(wrap);
    });

    host.querySelectorAll('button[data-h]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-h'), 10);
        const el = $('#rh'+idx);
        el.textContent = '💡 ' + item.qs[idx].hint;
        el.style.display = (el.style.display==='none') ? 'block' : 'none';
      });
    });

    applyVisibility();
  };

  const checkReading = () => {
    const item = readingTexts[state.current.read];
    const inputs = $$('#readQs input');
    let okCount = 0;

    inputs.forEach(inp => {
      const idx = parseInt(inp.getAttribute('data-i'), 10);
      const ans = norm(inp.value);
      const targets = (item.qs[idx].answers || []).map(norm);
      let good = false;
      if(ans){
        for(let t=0;t<targets.length;t++){
          const tar = targets[t];
          if(ans===tar || ans.indexOf(tar)>=0 || tar.indexOf(ans)>=0){ good=true; break; }
        }
      }
      inp.style.borderColor = good ? 'rgba(120,255,170,.55)' : 'rgba(255,120,120,.55)';
      const mark = $('#rm'+idx);
      mark.textContent = good ? '✅' : '❌';
      mark.classList.toggle('ok', good);
      if(good) okCount++;
    });

    addScore(okCount >= 2);
    $('#readFb').textContent = 'Result: ' + okCount + '/' + item.qs.length;
  };

  const showReadingAnswers = () => {
    if(!isPractice()) return;
    const item = readingTexts[state.current.read];
    $('#readFb').textContent = 'Answer key:\n' + item.qs.map((q,i)=> (i+1)+') '+(q.answers[0]||'')).join('\n');
  };

  const nextReading = () => { state.current.read = (state.current.read+1) % readingTexts.length; renderReading(); };

  // Language Use
  const grammarMCQ = [
    {q:'Choose the correct sentence:', opts:['If I will have time, I will practise.','If I have time, I will practise.','If I would have time, I practise.'], a:1, hint:'No “will” in the IF clause.'},
    {q:'Choose the correct sentence:', opts:['If I spoke English better, I will visit the USA.','If I spoke English better, I would visit the USA.','If I speak English better, I would visit the USA.'], a:1, hint:'Dream: If + past, would.'},
    {q:'Choose the best option:', opts:['I have been to Paris yesterday.','I went to Paris yesterday.','I have went to Paris yesterday.'], a:1, hint:'Yesterday → past simple.'},
    {q:'Polite request:', opts:['Give me the bill.','Could we have the bill, please?','I want the bill now.'], a:1, hint:'Use “Could… please?”'}
  ];
  let gChoice = null;

  const renderGrammar = () => {
    const item = grammarMCQ[state.current.g];
    $('#gQ').textContent = 'Q' + (state.current.g+1) + '/' + grammarMCQ.length + ' — ' + item.q;
    $('#gFb').textContent = '—';
    gChoice = null;

    const host = $('#gOpts');
    host.innerHTML = '';
    item.opts.forEach((opt, idx) => {
      const b = document.createElement('button');
      b.type='button'; b.className='optBtn';
      b.textContent = String.fromCharCode(65+idx) + ') ' + opt;
      b.addEventListener('click', () => {
        gChoice = idx;
        $$('#gOpts .optBtn').forEach(x=>x.classList.remove('on'));
        b.classList.add('on');
      });
      host.appendChild(b);
    });

    applyVisibility();
  };

  const checkGrammar = () => {
    const item = grammarMCQ[state.current.g];
    if(gChoice===null){ $('#gFb').textContent='Choose an option first.'; return; }
    const ok = gChoice===item.a;
    addScore(ok);

    let msg = ok ? '✅ Correct.' : '❌ Incorrect.';
    if(isPractice() && !ok){
      msg += `
Answer: ${String.fromCharCode(65+item.a)}
Hint: ${item.hint}`;
    }
    $('#gFb').textContent = msg;
  };

  const nextGrammar = () => { state.current.g = (state.current.g+1) % grammarMCQ.length; renderGrammar(); };

  const fixBank = [
    {bad:'If I will have time, I will practise my English.', good:'If I have time, I will practise my English.', why:'No “will” in the IF clause.'},
    {bad:'If I would be rich, I would travel more.', good:'If I were rich, I would travel more.', why:'Second conditional uses “were”.'},
    {bad:'It’s important be respectful.', good:'It’s important to be respectful.', why:'Add “to be”.'},
    {bad:'I have been to London last year.', good:'I went to London last year.', why:'Finished time → past simple.'}
  ];

  const renderFix = () => {
    const item = fixBank[state.current.fx];
    $('#fxQ').textContent = 'Fix this sentence:\n' + item.bad;
    $('#fxBox').value = '';
    $('#fxFb').textContent = '—';
  };

  const checkFix = () => {
    const item = fixBank[state.current.fx];
    const user = norm($('#fxBox').value);
    if(!user){ $('#fxFb').textContent='Write your corrected sentence first.'; return; }
    const ok = user === norm(item.good);
    addScore(ok);

    let msg = ok ? '✅ Correct.' : '❌ Incorrect.';
    if(isPractice() && !ok){
      msg += `
Correct: ${item.good}
Why: ${item.why}`;
    }
    $('#fxFb').textContent = msg;
  };

  const showFix = () => { if(isPractice()) $('#fxFb').textContent = 'Answer: ' + fixBank[state.current.fx].good; };
  const nextFix = () => { state.current.fx = (state.current.fx+1) % fixBank.length; renderFix(); };

  // Speaking
  const speaking = [
    {id:'sp1', label:'Hotel — noisy room', prompt:'You are at a hotel. Your room is noisy. Ask politely for a solution and mention one preference (quiet / away from elevator).',
     plan:['Greeting','Problem','Request','Detail','Thank you'],
     models:{
       A2:"Hello. My room is noisy. Could I change rooms, please? If possible, I would like a quiet room. Thank you.",
       B1:"Hello, my room is very noisy at night. Would it be possible to change rooms? If possible, I’d like a quiet room away from the elevator. Thank you.",
       B2:"Hello, I’m calling because my room is very noisy at night. Would it be possible to move to a quieter room, ideally away from the elevator and the street? Thank you very much."
     }},
    {id:'sp2', label:'Airport — gate change', prompt:'You heard a gate change announcement. Ask for confirmation and the boarding time.',
     plan:['Excuse me','Explain','Confirm gate','Ask boarding time','Close'],
     models:{
       A2:"Excuse me, is it gate B12? What time is boarding? Thank you.",
       B1:"Excuse me, I heard there was a gate change for flight 567. Could you confirm the gate and the boarding time, please?",
       B2:"Excuse me, I heard an announcement about a gate change for flight 567. Could you please confirm the correct gate and the boarding time?"
     }},
    {id:'sp3', label:'Restaurant — allergy + complaint', prompt:'Order politely, ask about nuts, then complain about a cold dish.',
     plan:['Order','Allergy question','Problem','Request','Thank you'],
     models:{
       A2:"Could I have the chicken salad, please? Does it contain nuts? Excuse me, my soup is cold. Could you warm it up, please?",
       B1:"Could I have the chicken salad, please? Does it contain nuts? Excuse me, my soup is cold. Could you heat it up or change it, please?",
       B2:"Could I have the chicken salad, please? Could you confirm whether it contains nuts? Excuse me, my soup is cold. Would it be possible to heat it up or replace it?"
     }},
    {id:'sp4', label:'Lost luggage — delivery request', prompt:'Your luggage didn’t arrive. Explain flight/date and ask for delivery to your hotel.',
     plan:['Missing luggage','Flight/date','Request delivery','Contact','Close'],
     models:{
       A2:"Hello. My luggage is lost on flight 567 on May 4. Can you send it to my hotel, please? You can contact me at 06… Thank you.",
       B1:"Hello, my luggage didn’t arrive from flight 567 on May 4. Could you explain the next steps? If possible, could it be delivered to my hotel? I can be reached at 06…",
       B2:"Hello, I’m calling to report missing luggage from flight 567 on May 4. Could you confirm the next steps and whether it can be delivered to my hotel as soon as possible? Thank you."
     }},
    {id:'sp5', label:'Opinion — online vs face-to-face', prompt:'Give your opinion: online learning vs face-to-face. Give 2 reasons and a conclusion.',
     plan:['Opinion','Reason 1','Reason 2','However','Conclusion'],
     models:{
       A2:"In my opinion, online learning is better for me. It saves time and I can learn at home. Overall, it helps me progress.",
       B1:"In my opinion, online learning is better for me because it saves time and is flexible. Also, one‑to‑one lessons help me speak more. Overall, I progress faster.",
       B2:"In my opinion, online learning can be more effective, especially for adults. It saves time and offers flexibility. In addition, one‑to‑one lessons give personalised feedback. However, face‑to‑face learning can be more social. Overall, it depends on the learner."
     }}
  ];

  const fillSpeaking = () => {
    const sel = $('#spSel');
    sel.innerHTML = speaking.map(s => '<option value="'+s.id+'">'+s.label+'</option>').join('');
    sel.value = speaking[0].id;
    renderSpeaking();
  };
  const curSpeaking = () => speaking.find(s => s.id === $('#spSel').value) || speaking[0];

  const setSpeakingPromptVisible = (visible) => {
    state.ui.spPromptVisible = !!visible;
    const ph = $('#spPromptPlaceholder');
    const p  = $('#spPrompt');
    const btn = $('#spTogglePrompt');
    if(!ph || !p || !btn) return;
    if(state.ui.spPromptVisible){
      ph.style.display = 'none';
      p.style.display  = 'block';
      btn.textContent  = 'Hide prompt';
    } else {
      ph.style.display = 'block';
      p.style.display  = 'none';
      btn.textContent  = 'Show prompt';
    }
  };

  const renderSpeaking = () => {
    const s = curSpeaking();
    $('#spPrompt').textContent = s.prompt;
    setSpeakingPromptVisible(isPractice());

    $('#spModel').textContent = '—';

    const chips = $('#spPlan');
    chips.innerHTML = '';
    s.plan.forEach(p => {
      const b = document.createElement('button');
      b.type='button'; b.className='chip'; b.textContent=p;
      b.addEventListener('click', () => {
        const ta=$('#spNotes');
        ta.value = (ta.value ? ta.value + '\n' : '') + p + ': ';
        state.drafts.speaking[s.id] = ta.value;
      });
      chips.appendChild(b);
    });

    const saved = state.drafts.speaking[s.id];
    $('#spNotes').value = (saved !== undefined) ? saved : '';

    $('#spRubric').textContent =
      'Speaking checklist:\n' +
      '• Polite opener\n' +
      '• Clear problem + clear request\n' +
      '• One detail\n' +
      '• One connector\n' +
      '• Polite closing';
  };

  const showSpeakingModel = () => {
        const s = curSpeaking();
    $('#spModel').textContent = s.models[state.level];
  };

  // Writing
  const writing = [
    {id:'wr1', label:'Email — request information (hotel)',
     prompt:'Write an email to a hotel asking for availability, total price (including taxes), what is included, and a quiet room request. (8–12 lines)',
     chips:['Subject:','Dear …,','I’m writing to…','Could you please…','Could you also…','If possible,…','Thank you…','Kind regards,'],
     models:{
       A2:`Subject: Request for information

Dear Reservations Team,
I would like to book a double room from May 4 to May 6.
Could you please confirm availability and the total price including taxes?
Is breakfast included? Is Wi‑Fi included?
If possible, I would like a quiet room.
Please confirm by email.
Thank you.
Kind regards,
Myriam`,
       B1:`Subject: Request for information — reservation May 4–6

Dear Reservations Team,
I’m writing to ask about availability for a double room from May 4 to May 6.
Could you confirm the total price per night including taxes and any extra fees?
Could you also clarify what is included in the rate (breakfast, Wi‑Fi, parking)?
If possible, I would like a quiet room.
Thank you in advance.
Kind regards,
Myriam`,
       B2:`Subject: Request for information — reservation May 4–6

Dear Reservations Team,
I’m writing to request details before confirming a reservation for a double room from May 4 to May 6.
Could you please confirm availability and the total rate including taxes and any additional fees (e.g., city tax)?
Could you also clarify what is included (breakfast, Wi‑Fi, and any other services)?
If possible, I’d appreciate a quiet room away from the street.
Many thanks.
Sincerely,
Myriam`
     }},
    {id:'wr2', label:'Email — change dates (hotel)',
     prompt:'Write an email to change your reservation dates. Explain briefly and ask for confirmation.',
     chips:['Subject:','Dear …,','I’m writing to…','Unfortunately,…','Would it be possible…','Please confirm…','Thank you…','Kind regards,'],
     models:{
       A2:`Subject: Change of reservation dates

Dear Reservations Team,
I would like to change my reservation.
I can’t come from May 4 to May 10.
Could I change the dates to May 12 to May 14?
Please confirm by email.
Thank you.
Kind regards,
Myriam`,
       B1:`Subject: Request to reschedule reservation

Dear Reservations Team,
I’m writing to ask if it is possible to change my reservation dates.
Unfortunately, we are unable to come from May 4 to May 10.
Would it be possible to move the booking to May 12–14?
Please confirm by email.
Thank you in advance.
Kind regards,
Myriam`,
       B2:`Subject: Request to reschedule reservation (May 4–10)

Dear Reservations Team,
I’m writing regarding our reservation from May 4 to May 10. Unfortunately, we are no longer able to travel on those dates.
Would it be possible to reschedule the booking to May 12–14 (two nights)?
Please let me know if there are any price differences or conditions.
Thank you for your assistance.
Sincerely,
Myriam`
     }},
    {id:'wr3', label:'Email — complaint (noise + service)',
     prompt:'Write a complaint email about a noisy room and one service issue. Ask for a solution/compensation.',
     chips:['Subject: Complaint — …','To whom it may concern,','I’m writing to…','Unfortunately,…','In addition,…','Could you please…','Thank you…','Sincerely,'],
     models:{
       A2:`Subject: Noise complaint

To whom it may concern,
I’m writing because our room was very noisy.
We couldn’t sleep because of street noise.
Also, the fitness centre was not included.
Could you help me, please?
Thank you.
Kind regards,
Myriam`,
       B1:`Subject: Complaint — noisy room

To whom it may concern,
I’m writing to complain about the noise in our room during our stay.
We were unable to sleep because the street was very noisy.
In addition, we were told the fitness centre was included, but it was not.
Could you please propose a solution or compensation?
Thank you in advance.
Kind regards,
Myriam`,
       B2:`Subject: Complaint — noisy room and service issue

To whom it may concern,
I’m writing to raise a complaint regarding our stay. Unfortunately, our room was extremely noisy due to street traffic, and we were unable to sleep.
In addition, we were told the fitness centre was included in the rate, but it was not.
Could you please review the situation and propose appropriate compensation?
Thank you for your assistance.
Sincerely,
Myriam`
     }},
    {id:'wr4', label:'Email — lost luggage (airline)',
     prompt:'Write an email to the airline about lost luggage. Include flight number/date and request delivery to your hotel.',
     chips:['Subject: Lost luggage','To whom it may concern,','I’m writing to…','Flight number/date','Could you please…','Deliver to hotel','Contact','Best regards,'],
     models:{
       A2:`Subject: Lost luggage

To whom it may concern,
My luggage was lost on flight 567 on May 4.
Could you please tell me what to do?
Can you send my luggage to my hotel?
You can contact me at 06 00 00 00 00.
Thank you.
Best regards,
Myriam`,
       B1:`Subject: Lost luggage — flight 567 (May 4)

To whom it may concern,
I’m writing to report that my luggage did not arrive from flight 567 on May 4.
Could you please confirm if it has been found and explain the next steps?
If possible, could it be delivered to my hotel as soon as possible?
You can reach me at 06 00 00 00 00.
Thank you in advance.
Kind regards,
Myriam`,
       B2:`Subject: Lost luggage — flight 567 (May 4)

To whom it may concern,
I’m writing to report missing luggage from flight 567 on May 4. The bag did not arrive at baggage claim.
Could you please confirm whether it has been located and provide an estimated delivery time?
If possible, I would appreciate delivery to my hotel as soon as possible.
I can be reached at 06 00 00 00 00.
Thank you for your assistance.
Sincerely,
Myriam`
     }},
    {id:'wr5', label:'Mini opinion — online vs face‑to‑face',
     prompt:'Write 8–12 lines: Is online learning better than face‑to‑face learning? Give your opinion + 2 reasons + conclusion.',
     chips:['In my opinion,…','First,…','In addition,…','However,…','For example,…','Overall,…'],
     models:{
       A2:`In my opinion, online learning is better for me. It saves time because I don’t travel. Also, I can learn at home and feel relaxed. I think I progress faster. Overall, online learning is a good solution.`,
       B1:`In my opinion, online learning is better for me because it saves time and is flexible. I don’t need to travel, and I can plan lessons easily. Also, I feel more comfortable speaking one‑to‑one. Overall, it helps me progress faster.`,
       B2:`In my opinion, online learning can be more effective than face‑to‑face learning, especially for adults. First, it saves time and offers flexibility, which makes it easier to stay consistent. In addition, one‑to‑one lessons allow personalised feedback and faster progress. However, face‑to‑face learning can be more social. Overall, the best choice depends on the learner, but online learning works very well for me.`
     }}
  ];

  const fillWriting = () => {
    const sel = $('#wrSel');
    sel.innerHTML = writing.map(w => '<option value="'+w.id+'">'+w.label+'</option>').join('');
    sel.value = writing[0].id;
    renderWriting();
  };
  const curWriting = () => writing.find(w => w.id === $('#wrSel').value) || writing[0];

  const renderWriting = () => {
    const w = curWriting();
    $('#wrPrompt').textContent = w.prompt;
    $('#wrModel').textContent = '—';

    const saved = state.drafts.writing[w.id];
    $('#wrBox').value = (saved !== undefined) ? saved : '';
    $('#wrWords').textContent = '' + wc($('#wrBox').value);

    const chips = $('#wrChips');
    chips.innerHTML = '';
    w.chips.forEach(c => {
      const b = document.createElement('button');
      b.type='button'; b.className='chip'; b.textContent=c;
      b.addEventListener('click', () => {
        const ta=$('#wrBox');
        ta.value = (ta.value ? ta.value + '\n' : '') + c.replace('…','');
        state.drafts.writing[w.id] = ta.value;
        $('#wrWords').textContent = '' + wc(ta.value);
      });
      chips.appendChild(b);
    });

    $('#wrRubric').textContent =
      'Writing checklist:\n' +
      '• Subject line\n' +
      '• Greeting\n' +
      '• Purpose sentence (I’m writing to…)\n' +
      '• 2 polite requests\n' +
      '• 1 connector\n' +
      '• Closing + name';
  };

  const showWritingModel = () => {
        const w = curWriting();
    $('#wrModel').textContent = w.models[state.level];
  };

  // Vocab
  const vocab = [
    {cat:'Hotel', icon:'🏨', en:'reservation', fr:'réservation', def:'a booking', ex:'I would like to confirm my reservation.'},
    {cat:'Hotel', icon:'🛏️', en:'availability', fr:'disponibilité', def:'if a room is free', ex:'Could you confirm availability?'},
    {cat:'Hotel', icon:'💶', en:'rate', fr:'tarif', def:'price per night', ex:'What is the rate per night?'},
    {cat:'Hotel', icon:'🧾', en:'taxes', fr:'taxes', def:'money added to the price', ex:'Is the price including taxes?'},
    {cat:'Hotel', icon:'✅', en:'included', fr:'inclus', def:'part of the price', ex:'Is breakfast included?'},
    {cat:'Hotel', icon:'🤫', en:'quiet room', fr:'chambre calme', def:'not noisy', ex:'I’d like a quiet room.'},
    {cat:'Airport', icon:'🚪', en:'gate', fr:'porte', def:'where you board', ex:'Which gate is it?'},
    {cat:'Airport', icon:'🎫', en:'boarding', fr:'embarquement', def:'getting on the plane', ex:'Boarding starts in 10 minutes.'},
    {cat:'Airport', icon:'🧳', en:'carry-on bag', fr:'bagage cabine', def:'bag you take on the plane', ex:'Is my carry-on bag allowed?'},
    {cat:'Airport', icon:'❗', en:'lost luggage', fr:'bagage perdu', def:'missing bag', ex:'I need to report lost luggage.'},
    {cat:'Airport', icon:'🚚', en:'deliver', fr:'livrer', def:'bring to a place', ex:'Could you deliver it to my hotel?'},
    {cat:'Restaurant', icon:'💳', en:'bill / check', fr:'addition', def:'paper with the price', ex:'Could we have the bill, please?'},
    {cat:'Restaurant', icon:'🥗', en:'ingredient', fr:'ingrédient', def:'part of a recipe', ex:'Does it contain nuts?'},
    {cat:'Restaurant', icon:'⚠️', en:'allergy', fr:'allergie', def:'bad reaction to food', ex:'I have a nut allergy.'},
    {cat:'Shopping', icon:'🔁', en:'exchange', fr:'échanger', def:'change for another item', ex:'Can I exchange it?'},
    {cat:'Shopping', icon:'💶', en:'refund', fr:'remboursement', def:'money returned', ex:'Can I get a refund?'},
    {cat:'Shopping', icon:'🧾', en:'receipt', fr:'ticket de caisse', def:'proof you paid', ex:'Do you have the receipt?'},
    {cat:'Connectors', icon:'🔗', en:'because', fr:'parce que', def:'gives a reason', ex:'I’m calling because…'},
    {cat:'Connectors', icon:'🔗', en:'however', fr:'cependant', def:'contrast', ex:'It’s expensive; however, it’s comfortable.'},
    {cat:'Connectors', icon:'🔗', en:'in addition', fr:'en plus', def:'adds info', ex:'In addition, Wi‑Fi is included.'},
    {cat:'Connectors', icon:'🔗', en:'overall', fr:'globalement', def:'conclusion', ex:'Overall, I was satisfied.'}
  ];

  const vocabCats = (() => {
    const set = {};
    vocab.forEach(v => set[v.cat] = true);
    const cats = Object.keys(set).sort((a,b)=>a.localeCompare(b));
    cats.unshift('All');
    return cats;
  })();

  const fillVocabCats = () => {
    const sel = $('#vCat');
    sel.innerHTML = vocabCats.map(c => '<option value="'+c+'">'+c+'</option>').join('');
    sel.value = 'All';
  };

  const vocabFiltered = () => {
    const cat = $('#vCat').value;
    const q = ($('#vSearch').value || '').toLowerCase().trim();
    return vocab.filter(v => {
      if(cat !== 'All' && v.cat !== cat) return false;
      if(!q) return true;
      const hay = (v.en + ' ' + v.fr + ' ' + v.def).toLowerCase();
      return hay.indexOf(q) >= 0;
    });
  };

  const openModal = (v) => {
    state.currentV = v;
    $('#mIcon').textContent = v.icon;
    $('#mEn').textContent = v.en;
    $('#mFr').textContent = v.fr;
    $('#mFr').style.display = state.showFR ? 'block' : 'none';
    $('#mDef').textContent = 'Definition: ' + v.def;
    $('#mEx').textContent = 'Example: ' + v.ex;
    $('#modalOverlay').hidden = false;
    $('#modalClose').focus();
  };
  const closeModal = () => { $('#modalOverlay').hidden = true; state.currentV = null; };

  const renderVocab = () => {
    const grid = $('#vGrid');
    grid.innerHTML = '';
    const showFR = state.showFR;
    vocabFiltered().forEach(v => {
      const card = document.createElement('button');
      card.type='button'; card.className='vCard';
      card.innerHTML =
        '<div class="vTop">' +
          '<div class="vIcon" aria-hidden="true">' + v.icon + '</div>' +
          '<div>' +
            '<div class="vEn">' + v.en + '</div>' +
            '<div class="vFr" style="display:' + (showFR ? 'block' : 'none') + '">' + v.fr + '</div>' +
          '</div>' +
          '<div class="vCat"><div class="vTag">' + v.cat + '</div></div>' +
        '</div>' +
        '<div class="tiny muted">' + v.def + '</div>';
      card.addEventListener('click', () => openModal(v));
      grid.appendChild(card);
    });
  };

  // Visibility rules
  const toggleListeningScript = () => {
    const box = $('#lisScriptBox');
    const btn = $('#lisToggleScript');
    if(!box || !btn) return;
    state.ui.lisScriptVisible = !state.ui.lisScriptVisible;
    box.style.display = state.ui.lisScriptVisible ? 'block' : 'none';
    btn.textContent = state.ui.lisScriptVisible ? 'Hide script' : 'Show script';
  };

  const applyVisibility = () => {
    $('#lisReplay').style.opacity = isPractice() ? '1' : '.55';
    $('#lisReplay').style.pointerEvents = isPractice() ? 'auto' : 'none';
    $('#lisHint').style.display = isPractice() ? 'inline-flex' : 'none';

    $$('#readQs button[data-h]').forEach(btn => btn.style.display = isPractice() ? 'inline-flex' : 'none');
    $('#readShow').style.display = isPractice() ? 'inline-flex' : 'none';

    $('#gHint').style.display = isPractice() ? 'inline-flex' : 'none';
  };

  // Report
  const updateReport = () => {
    const lines = [];
    lines.push('Auto‑graded parts:');
    lines.push('• Listening: Q' + (state.current.lis+1) + '/' + listening.length);
    lines.push('• Reading: Text ' + (state.current.read+1) + '/' + readingTexts.length);
    lines.push('• Grammar: Q' + (state.current.g+1) + '/' + grammarMCQ.length);
    lines.push('• Fix: ' + (state.current.fx+1) + '/' + fixBank.length);
    lines.push('');
    lines.push('Score: ' + state.score.ok + ' / ' + state.score.total + ' (' + (state.score.total ? Math.round(state.score.ok/state.score.total*100) : 0) + '%)');
    $('#reportBox').textContent = lines.join('\n');
  };

  const genTeacherNote = () => {
    $('#teacherNote').value =
      'English 360° mock exam (realistic scenarios)\n' +
      '- Strengths: clear message, polite requests, improving connectors.\n' +
      '- Focus: tense accuracy (past simple vs present perfect), conditionals (if + present/will vs if + past/would), and email structure.\n' +
      '- Next step: repeat in Exam mode and upgrade 2 writing tasks to B1/B2 models.\n';
  };

  // Init
  const init = () => {
    $('#jsOk').textContent = 'JS: ready ✅';
    updateScore();

    loadVoices();
    if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = loadVoices;

    $$('.segBtn[data-mode]').forEach(btn => btn.addEventListener('click', () => setMode(btn.getAttribute('data-mode'))));
    $$('.segBtn[data-level]').forEach(btn => btn.addEventListener('click', () => setLevel(btn.getAttribute('data-level'))));
    $$('.segBtn[data-accent]').forEach(btn => btn.addEventListener('click', () => setAccent(btn.getAttribute('data-accent'))));
    $('#rate').addEventListener('input', (e) => { state.rate = parseFloat(e.target.value || '1'); });

    $('#teacherToggle').addEventListener('click', () => setTeacher(!state.teacher));

    $('#startExam').addEventListener('click', () => startTimer('exam', 45*60, $('#examClock')));
    $('#stopExam').addEventListener('click', () => stopTimer('exam', $('#examClock')));
    $('#resetScore').addEventListener('click', resetScore);

    $('#ttsTest').addEventListener('click', () => speak('Hello Myriam. This is your English mock exam. Good luck!'));
    $('#copyTemplates').addEventListener('click', copyTemplates);
    showTemplates();

    renderListening();
    $('#lisPlay').addEventListener('click', () => playListening(false));
    $('#lisReplay').addEventListener('click', () => playListening(true));
    $('#lisNext').addEventListener('click', nextListening);
    $('#lisCheck').addEventListener('click', checkListening);
    $('#lisHint').addEventListener('click', () => { if(isPractice()) $('#lisFb').textContent = '💡 ' + listening[state.current.lis].hint; });
    $('#lisSayTips').addEventListener('click', () => speak($('#lisTips').textContent));
    $('#lisToggleScript').addEventListener('click', toggleListeningScript);
    $('#lisSayScript').addEventListener('click', () => { const sb=$('#lisScriptBox'); if(sb && sb.style.display!=='none') speak(sb.textContent); });

    renderReading();
    $('#readNew').addEventListener('click', nextReading);
    $('#readCheck').addEventListener('click', checkReading);
    $('#readShow').addEventListener('click', showReadingAnswers);
    $('#readSay').addEventListener('click', () => speak($('#readText').textContent));

    renderGrammar();
    $('#gCheck').addEventListener('click', checkGrammar);
    $('#gNext').addEventListener('click', nextGrammar);
    $('#gHint').addEventListener('click', () => { if(isPractice()) $('#gFb').textContent = '💡 ' + grammarMCQ[state.current.g].hint; });

    renderFix();
    $('#fxCheck').addEventListener('click', checkFix);
    $('#fxShow').addEventListener('click', showFix);
    $('#fxNext').addEventListener('click', nextFix);

    fillSpeaking();
    $('#spSel').addEventListener('change', renderSpeaking);
    $('#spNotes').addEventListener('input', () => { const s=curSpeaking(); state.drafts.speaking[s.id] = $('#spNotes').value; });
    $('#spTogglePrompt').addEventListener('click', () => setSpeakingPromptVisible(!state.ui.spPromptVisible));
    $('#spSay').addEventListener('click', () => speak($('#spPrompt').textContent));
    $('#spModelBtn').addEventListener('click', showSpeakingModel);
    $('#spModelSay').addEventListener('click', () => speak($('#spModel').textContent === '—' ? '' : $('#spModel').textContent));
    $('#sp60').addEventListener('click', () => startTimer('sp', 60, $('#spClock')));
    $('#sp90').addEventListener('click', () => startTimer('sp', 90, $('#spClock')));
    $('#spStop').addEventListener('click', () => stopTimer('sp', $('#spClock')));

    fillWriting();
    $('#wrSel').addEventListener('change', renderWriting);
    $('#wrBox').addEventListener('input', () => { const w=curWriting(); state.drafts.writing[w.id] = $('#wrBox').value; $('#wrWords').textContent = '' + wc($('#wrBox').value); });
    $('#wrSay').addEventListener('click', () => speak($('#wrBox').value));
    $('#wr15').addEventListener('click', () => startTimer('wr', 15*60, $('#wrClock')));
    $('#wrStop').addEventListener('click', () => stopTimer('wr', $('#wrClock')));
    $('#wrModelBtn').addEventListener('click', showWritingModel);
    $('#wrCopyBtn').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('#wrBox').value); } catch (e) {} });
    $('#wrClearBtn').addEventListener('click', () => { const w=curWriting(); state.drafts.writing[w.id]=''; $('#wrBox').value=''; $('#wrWords').textContent='0'; $('#wrModel').textContent='—'; });

    fillVocabCats();
    renderVocab();
    $('#vCat').addEventListener('change', renderVocab);
    $('#vSearch').addEventListener('input', renderVocab);
    $('#vReset').addEventListener('click', () => { $('#vCat').value='All'; $('#vSearch').value=''; renderVocab(); });
    $('#vFrToggle').addEventListener('click', () => {
      state.showFR = !state.showFR;
      $('#vFrToggle').textContent = state.showFR ? 'On' : 'Off';
      $('#vFrToggle').setAttribute('aria-pressed', state.showFR ? 'true' : 'false');
      renderVocab();
    });

    $('#modalClose').addEventListener('click', closeModal);
    $('#modalOverlay').addEventListener('click', (e) => { if(e.target && e.target.id==='modalOverlay') closeModal(); });
    document.addEventListener('keydown', (e) => { if(e.key==='Escape' && !$('#modalOverlay').hidden) closeModal(); });
    $('#mSay').addEventListener('click', () => { if(state.currentV) speak(state.currentV.en); });
    $('#mAdd').addEventListener('click', () => {
      if(!state.currentV) return;
      const w=curWriting();
      const ta=$('#wrBox');
      ta.value = (ta.value ? ta.value + '\n' : '') + state.currentV.en;
      state.drafts.writing[w.id] = ta.value;
      $('#wrWords').textContent = '' + wc(ta.value);
      closeModal();
    });

    $('#updateReport').addEventListener('click', updateReport);
    $('#genNote').addEventListener('click', genTeacherNote);
    $('#copyNote').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('#teacherNote').value); } catch (e) {} });
    $('#resetAll').addEventListener('click', () => {
      state.score.ok=0; state.score.total=0; updateScore();
      state.current = { lis:0, read:0, g:0, fx:0 };
      state.drafts = { writing:{}, speaking:{} };
      renderListening(); renderReading(); renderGrammar(); renderFix(); renderSpeaking(); renderWriting();
      $('#reportBox').textContent = 'Reset complete.';
    });

    // defaults
    setMode('exam');
    setTeacher(false);
    setLevel('A2');
    setAccent('US');
    applyVisibility();
    setSpeakingPromptVisible(isPractice());
  };

  window.addEventListener('error', (e) => {
    const box = $('#errBox');
    if (box) { box.hidden = false; box.textContent = '⚠️ ' + (e && e.message ? e.message : 'Error'); }
  });

  document.addEventListener('DOMContentLoaded', init);
})();