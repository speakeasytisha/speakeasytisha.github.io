
(() => {
  'use strict';
  window.__HopesDreamsLoaded = true;

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const pad2 = n => String(n).padStart(2,'0');
  const fmt = s => `${pad2(Math.floor(s/60))}:${pad2(s%60)}`;

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  };

  const norm = (s) => (s||'').toLowerCase().replace(/[^\w\s’'-]/g,' ').replace(/\s+/g,' ').trim();

  // TTS
  const tts = { accent:'US', rate:1, voices:[] };
  const loadVoices = () => { try{ tts.voices = speechSynthesis.getVoices(); }catch(e){ tts.voices=[]; } };
  const pickVoice = () => {
    const v = tts.voices || [];
    if(!v.length) return null;
    const wants = tts.accent==='UK' ? ['en-GB','United Kingdom','UK'] : ['en-US','United States','US'];
    return v.find(x => wants.some(w => (x.lang||'').includes(w) || (x.name||'').includes(w)))
      || v.find(x => (x.lang||'').startsWith('en')) || v[0];
  };
  const speak = (text) => {
    if(!('speechSynthesis' in window) || !text) return;
    try{
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = tts.rate;
      const v = pickVoice();
      if(v) u.voice = v;
      speechSynthesis.speak(u);
    }catch(e){}
  };

  // Score
  const score = {ok:0,total:0};
  const updateScore = () => {
    $('#scorePill').textContent = `${score.ok} / ${score.total}`;
    $('#acc').textContent = score.total ? `${Math.round(score.ok/score.total*100)}%` : '0%';
  };
  const addScore = (ok) => { score.total++; if(ok) score.ok++; updateScore(); };
  const resetScore = () => { score.ok=0; score.total=0; updateScore(); };

  // Timer
  const timers = { speak:null, write:null };
  const startTimer = (key, seconds, outId, doneMsg) => {
    if(timers[key]) clearInterval(timers[key]);
    let left = seconds;
    $('#' + outId).textContent = fmt(left);
    timers[key] = setInterval(() => {
      left--;
      $('#' + outId).textContent = fmt(Math.max(0,left));
      if(left<=0){
        clearInterval(timers[key]);
        timers[key]=null;
        alert(doneMsg);
      }
    },1000);
  };
  const stopTimer = (key, outId) => {
    if(timers[key]) clearInterval(timers[key]);
    timers[key]=null;
    $('#' + outId).textContent = "00:00";
  };

  // Content
  const levels = ["A2","B1","B2"];
  let level = "A2";
  let fr = false;

  const warmups = [
    "What is your dream for next year? (Use: I would like to…)",
    "If you had one extra hour every day, what would you do?",
    "If you had more money, what would you change in your life?",
    "If you were younger, what would you learn?",
    "If you could travel anywhere, where would you go and why?"
  ];

  const starters = [
    "I would like to…",
    "I hope to…",
    "My dream is to…",
    "If I had more time, I would…",
    "If I were younger, I would…",
    "In the future, I would like to…",
    "To be honest, I would…",
    "Overall, I think…"
  ];

  const grammarHope = [
    "• WOULD LIKE TO + base verb (polite goal)",
    "  Example: I would like to travel more.",
    "",
    "• HOPE TO + base verb (realistic wish)",
    "  Example: I hope to visit the USA one day.",
    "",
    "• DREAM OF + -ing / noun (big dream)",
    "  Example: I dream of living by the sea."
  ].join("\n");

  const grammarCond = [
    "✅ 2nd conditional (unreal / imaginary now)",
    "",
    "Form:",
    "  If + past simple, would + base verb",
    "",
    "Examples:",
    "  If I had more time, I would travel more.",
    "  If I won the lottery, I would buy a house near the ocean.",
    "",
    "Key rule: no WOULD inside the IF clause."
  ].join("\n");

  const grammarWere = [
    "Formal / exam English often uses:",
    "  If I were…, If he were…, If she were…",
    "",
    "Example:",
    "  If I were rich, I would travel every month.",
    "",
    "More formal:",
    "  If I were to + base verb, I would…",
    "  If I were to move abroad, I would choose Canada."
  ].join("\n");

  const irregular = [
    ["be","was/were"],["have","had"],["go","went"],["do","did"],["get","got"],
    ["make","made"],["take","took"],["see","saw"],["come","came"],["buy","bought"],
    ["say","said"],["give","gave"],["find","found"],["feel","felt"],["think","thought"]
  ];

  const dreamVerbs = ["travel","learn","visit","spend","save","relax","volunteer","cook","walk","paint","write","meet","improve","explore","enjoy"];

  const mcqBank = [
    {q:"If I ____ more time, I would travel more.", opts:["have","had","will have"], a:"had", tip:"If-clause = past simple."},
    {q:"If I were rich, I ____ buy a house by the sea.", opts:["would","will","am"], a:"would", tip:"Main clause = would + base verb."},
    {q:"I would like ____ improve my English.", opts:["to","for","-"], a:"to", tip:"Would like to + base verb."},
    {q:"If she ____ younger, she would learn Spanish.", opts:["is","was/were","will be"], a:"was/were", tip:"Past simple in if-clause."},
    {q:"If I won the lottery, I would ____ more often.", opts:["travel","traveled","traveling"], a:"travel", tip:"Would + base verb."},
  ];

  const fixBank = [
    {bad:"If I have more time, I would travel more.", good:"If I had more time, I would travel more.", why:"2nd conditional: If + past simple."},
    {bad:"If I would have money, I would travel.", good:"If I had money, I would travel.", why:"No would in the if‑clause."},
    {bad:"If I were rich, I will buy a house.", good:"If I were rich, I would buy a house.", why:"Would + base verb."},
    {bad:"I would like travel more.", good:"I would like to travel more.", why:"Would like + to + base verb."},
  ];

  const ddSubjects = ["I","you","he","she","we","they"];
  const ddPast = ["had more time","had more money","were younger","lived near the sea","spoke English better","won the lottery","had a bigger house","were more confident"];
  const ddWould = ["I would","you would","he would","she would","we would","they would"];
  const ddBase = ["travel more","visit the USA","learn Spanish","buy a small house","walk every day","cook new recipes","spend more time with family","volunteer more often"];

  const upgradeExamples = [
    {
      A2:"If I had more time, I would travel more.",
      B1:"If I had more time, I would travel more because I love discovering new places.",
      B2:"If I had more time, I would travel more, although I would still keep a healthy routine at home. Overall, it would help me feel more relaxed and inspired."
    },
    {
      A2:"If I spoke English better, I would feel more confident.",
      B1:"If I spoke English better, I would feel more confident, especially when travelling.",
      B2:"If I spoke English better, I would feel more confident in real situations, whereas now I sometimes hesitate. In the long run, it would give me more freedom."
    }
  ];

  const tileSets = [
    ["If","I","had","more time",",","I","would","travel","more","."],
    ["If","I","were","younger",",","I","would","learn","Spanish","."],
    ["If","we","won","the lottery",",","we","would","visit","the USA","."],
    ["If","I","were to","move abroad",",","I","would","choose","Canada","."]
  ];

  const scenarios = [
    {
      id:"travel",
      title:"Dream trip",
      prompt:"Talk about your dream trip. Use 2 conditionals.",
      models:{
        A2:"I would like to travel more. If I had more time, I would visit the USA. If I had more money, I would travel with my husband. Overall, it would be amazing.",
        B1:"My dream is to travel more often. If I had more time, I would visit several states in the USA. If I were more confident in English, I would speak to more people. Overall, it would be unforgettable.",
        B2:"I would love to plan a long trip across the USA. If I had more time, I would explore national parks and big cities. If I were to spend a month there, I would build a flexible itinerary and focus on local experiences."
      }
    },
    {
      id:"retirement",
      title:"Retirement goals",
      prompt:"Talk about your hopes for the next year: health, family, hobbies, travel.",
      models:{
        A2:"I hope to stay healthy. If I had more time, I would walk every day. If I had more money, I would travel. I would like to spend time with my family.",
        B1:"Next year, I would like to focus on health and family. If I were more organised, I would plan small trips more often. If I had more time, I would develop hobbies like cooking and crafts.",
        B2:"Looking ahead, I would like to keep improving my quality of life. If I were to choose one priority, it would be health and meaningful time with my family. If I had more time, I would invest in hobbies and travel experiences."
      }
    },
    {
      id:"english",
      title:"English confidence",
      prompt:"Talk about English learning and confidence. Use: If I spoke… / If I were…",
      models:{
        A2:"I want to improve my English. If I spoke English better, I would feel more confident. If I had more practice, I would speak more easily.",
        B1:"I would like to improve my English because it helps me when I travel. If I spoke English better, I would ask questions more easily. If I had more speaking practice, I would improve faster.",
        B2:"Improving my English is a real goal for me. If I were more confident, I would take more risks and speak spontaneously. If I had more regular practice, I would progress faster."
      }
    }
  ];

  const writingPrompts = [
    "Write 8–12 lines: your hopes for next year. Use 2 conditionals.",
    "Write 8–12 lines: a dream trip (big budget). Use 3 conditionals.",
    "Write 8–12 lines: one change you would make in your life. Explain why."
  ];

  const writingModels = {
    A2:"I would like to travel more. If I had more time, I would visit the USA. If I had more money, I would travel with my husband. I hope to improve my English. Overall, I think it would make me very happy.",
    B1:"In the future, I would like to travel more and spend time with my family. If I had more time, I would plan small trips and enjoy my hobbies. If I were more confident in English, I would speak to people more easily when travelling. Overall, these goals are motivating.",
    B2:"Looking ahead, I would like to focus on meaningful experiences. If I had more time, I would travel more often and explore both nature and culture. If I were to spend a month abroad, I would create a flexible plan and challenge myself to speak English every day. Overall, I believe these changes would improve my confidence."
  };

  const fluency = ["Let me think…","To be honest,…","In my opinion,…","For example,…","Overall,…","Compared to…,","The main reason is…"];

  // Rendering helpers
  const setLevelUI = (lvl) => {
    level = lvl;
    $$('.segBtn[data-level]').forEach(b => b.classList.toggle('on', b.dataset.level === lvl));
    renderSpeakingModel(); // clears model
    renderWritingModel(); // clears model
  };

  const renderWarmup = () => {
    $('#warmupPrompt').textContent = shuffle(warmups)[0];
  };

  const renderStarters = () => {
    const host = $('#starterChips');
    host.innerHTML = '';
    starters.forEach(s => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent = s;
      b.addEventListener('click', () => speak(s.replace('…','')));
      host.appendChild(b);
    });
  };

  const renderGrammar = () => {
    $('#hopeBox').textContent = grammarHope;
    $('#condBox').textContent = grammarCond;
    $('#wereBox').textContent = grammarWere;
  };

  const renderVerbChips = () => {
    const host = $('#irregChips');
    host.innerHTML = '';
    irregular.forEach(([b,p]) => {
      const btn = document.createElement('button');
      btn.type='button';
      btn.className='chip';
      btn.textContent = `${b} → ${p}`;
      btn.addEventListener('click', () => speak(`${b}. Past: ${p}.`));
      host.appendChild(btn);
    });
    const host2 = $('#dreamVerbChips');
    host2.innerHTML = '';
    dreamVerbs.forEach(v => {
      const btn = document.createElement('button');
      btn.type='button';
      btn.className='chip';
      btn.textContent = v;
      btn.addEventListener('click', () => speak(v));
      host2.appendChild(btn);
    });
  };

  // MCQ
  let mcq = null;
  let mcqChoice = null;

  const renderMCQ = () => {
    mcq = shuffle(mcqBank)[0];
    mcqChoice = null;
    $('#mcqPrompt').textContent = mcq.q;
    $('#mcqFeedback').textContent = '';
    const host = $('#mcqOptions');
    host.innerHTML = '';
    shuffle(mcq.opts).forEach(opt => {
      const b = document.createElement('button');
      b.type='button';
      b.className='pill';
      b.textContent = opt;
      b.addEventListener('click', () => {
        mcqChoice = opt;
        $$('#mcqOptions .pill').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
      });
      host.appendChild(b);
    });
  };

  const checkMCQ = () => {
    if(!mcqChoice){
      $('#mcqFeedback').textContent = "Choose an option first.";
      return;
    }
    const ok = (mcqChoice === mcq.a);
    addScore(ok);
    $('#mcqFeedback').textContent = ok ? "✅ Correct!" : `❌ Not quite.\nAnswer: ${mcq.a}\nTip: ${mcq.tip}`;
  };

  // Fix
  let fix = null;
  const renderFix = () => {
    fix = shuffle(fixBank)[0];
    $('#fixPrompt').textContent = "Fix this sentence:\n" + fix.bad;
    $('#fixInput').value = '';
    $('#fixFeedback').textContent = '';
  };

  const checkFix = () => {
    const user = norm($('#fixInput').value);
    if(!user){ $('#fixFeedback').textContent = "Write your corrected sentence first."; return; }
    const ok = user === norm(fix.good);
    addScore(ok);
    $('#fixFeedback').textContent = ok ? "✅ Perfect!" : `❌ Close.\nCorrect: ${fix.good}\nWhy: ${fix.why}`;
  };

  // Dropdown builder
  const fillSelect = (id, items) => {
    const sel = $('#' + id);
    sel.innerHTML = items.map(x => `<option value="${x}">${x}</option>`).join('');
  };

  const randomDD = () => {
    $('#ddSubject').value = shuffle(ddSubjects)[0];
    $('#ddPast').value = shuffle(ddPast)[0];
    $('#ddWould').value = shuffle(ddWould)[0];
    $('#ddBase').value = shuffle(ddBase)[0];
    $('#ddOut').textContent = '';
  };

  const buildDD = () => {
    const s = $('#ddSubject').value;
    const past = $('#ddPast').value;
    const w = $('#ddWould').value;
    const base = $('#ddBase').value;
    const sent = `If ${s} ${past}, ${w} ${base}.`;
    $('#ddOut').textContent = sent;
    return sent;
  };

  const checkDD = () => {
    const s = $('#ddSubject').value.toLowerCase();
    const w = $('#ddWould').value.split(' ')[0].toLowerCase();
    const ok = (s === w);
    addScore(ok);
    $('#ddOut').textContent = buildDD() + (ok ? "\n✅ Looks good." : "\n⚠️ Check subject agreement (I/you/he/she/we/they).");
  };

  // Upgrade
  const fillUpgrade = () => {
    const ex = shuffle(upgradeExamples)[0];
    $('#upgradeA2').value = ex.A2;
    $('#upgradeB1').value = ex.B1;
    $('#upgradeB2').value = ex.B2;
  };

  // Tiles
  let tileBuilt = [];
  const renderTiles = () => {
    tileBuilt = [];
    $('#tileOutput').textContent = "—";
    $('#tilesFeedback').textContent = "";
    const bank = $('#tileBank');
    bank.innerHTML = '';
    const set = shuffle(tileSets)[0].slice();
    set.forEach(tok => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent = tok;
      b.addEventListener('click', () => {
        tileBuilt.push(tok);
        bank.removeChild(b);
        $('#tileOutput').textContent = tileBuilt.join(' ').replace(/\s([,\.])/g,'$1') || '—';
      });
      bank.appendChild(b);
    });
  };

  const tilesUndo = () => {
    if(!tileBuilt.length) return;
    tileBuilt.pop();
    $('#tileOutput').textContent = tileBuilt.join(' ').replace(/\s([,\.])/g,'$1') || '—';
  };

  const tilesCheck = () => {
    const s = $('#tileOutput').textContent;
    const ok = s.startsWith("If ") && s.includes(" would ");
    addScore(ok);
    $('#tilesFeedback').textContent = ok ? "✅ Nice conditional sentence!" : "❌ Try to include: If + past, would + base.";
  };

  // Speaking
  const renderSpeakSelect = () => {
    const sel = $('#speakSelect');
    sel.innerHTML = scenarios.map(x => `<option value="${x.id}">${x.title}</option>`).join('');
    sel.value = scenarios[0].id;
  };

  const currentScenario = () => scenarios.find(x => x.id === $('#speakSelect').value) || scenarios[0];

  const renderSpeaking = () => {
    $('#sPrompt').textContent = currentScenario().prompt;
    $('#sModelOut').textContent = '';
    $('#sCheck').textContent = [
      "• Use at least 2 conditionals",
      "• Add 1 reason (because…)",
      "• Use 1 connector (overall / for example / to be honest)"
    ].join("\n");
  };

  const renderFluency = () => {
    const host = $('#fluencyChips');
    host.innerHTML = '';
    fluency.forEach(line => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent = line;
      b.addEventListener('click', () => {
        const ta = $('#sNotes');
        ta.value = (ta.value ? ta.value + '\n' : '') + line.replace('…','');
      });
      host.appendChild(b);
    });
  };

  const renderSpeakingModel = () => {
    // clear model when level changes
    $('#sModelOut').textContent = '';
  };

  const showSpeakingModel = () => {
    const sc = currentScenario();
    $('#sModelOut').textContent = sc.models[level];
  };

  // Writing
  const renderWritingPrompt = () => {
    $('#wPrompt').textContent = shuffle(writingPrompts)[0];
    $('#wModelOut').textContent = '';
  };

  const renderWritingChips = () => {
    const host = $('#wChips');
    host.innerHTML = '';
    const phrases = ["I would like to…","I hope to…","If I had…, I would…","If I were…, I would…","To be honest,…","For example,…","Overall,…"];
    phrases.forEach(p => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent = p;
      b.addEventListener('click', () => {
        const ta = $('#wBox');
        ta.value = (ta.value ? ta.value + '\n' : '') + p.replace('…','');
        $('#wWords').textContent = String((ta.value||'').trim().split(/\s+/).filter(Boolean).length);
      });
      host.appendChild(b);
    });
  };

  const renderWritingModel = () => {
    $('#wModelOut').textContent = '';
  };

  const showWritingModel = () => {
    $('#wModelOut').textContent = writingModels[level];
  };

  // Teacher compare
  const stats = (txt) => {
    const t = (txt||'').trim();
    const words = t ? t.split(/\s+/).filter(Boolean) : [];
    const sentences = t ? t.split(/[.!?]+/).map(x=>x.trim()).filter(Boolean) : [];
    const uniq = new Set(words.map(w=>w.toLowerCase().replace(/[^\w’-]/g,''))).size;
    const connectors = ["because","however","overall","for example","although","whereas","in addition","to be honest"];
    const connCount = connectors.reduce((acc,c)=> acc + (norm(t).includes(c) ? 1 : 0), 0);
    return {w:words.length, s:sentences.length, avg: sentences.length ? (words.length/sentences.length) : 0, u:uniq, c:connCount};
  };

  const compareStats = () => {
    const a = stats($('#tStudent').value);
    const b = stats($('#tCorrected').value);
    const c = stats($('#tHigher').value);
    $('#tOut').textContent = [
      `Student: Words ${a.w} | Sentences ${a.s} | Avg ${a.avg.toFixed(1)} | Unique ${a.u} | Connectors ${a.c}`,
      `Corrected: Words ${b.w} | Sentences ${b.s} | Avg ${b.avg.toFixed(1)} | Unique ${b.u} | Connectors ${b.c}`,
      `Higher-level: Words ${c.w} | Sentences ${c.s} | Avg ${c.avg.toFixed(1)} | Unique ${c.u} | Connectors ${c.c}`,
      "",
      "Quick teacher focus:",
      "• verb forms + missing 'to'",
      "• add connectors + reasons",
      "• add contrast (although / whereas) + richer detail"
    ].join("\n");
  };

  const clearCompare = () => {
    $('#tStudent').value=''; $('#tCorrected').value=''; $('#tHigher').value=''; $('#tOut').textContent='';
  };

  // French toggle (minimal)
  const applyFR = () => {
    $$('.frOnly').forEach(el => el.style.display = fr ? 'block' : 'none');
    $('#frToggle').textContent = fr ? 'On' : 'Off';
    $('#frToggle').setAttribute('aria-pressed', fr ? 'true' : 'false');
  };

  // Init
  const init = () => {
    $('#jsOk').textContent = "JS: ready ✅";
    loadVoices();
    if('speechSynthesis' in window) speechSynthesis.onvoiceschanged = loadVoices;

    renderGrammar();
    renderWarmup();
    renderStarters();
    renderVerbChips();
    renderMCQ();
    renderFix();

    fillSelect('ddSubject', ddSubjects);
    fillSelect('ddPast', ddPast);
    fillSelect('ddWould', ddWould);
    fillSelect('ddBase', ddBase);
    randomDD();

    renderTiles();

    renderSpeakSelect();
    renderSpeaking();
    renderFluency();

    renderWritingPrompt();
    renderWritingChips();
    updateScore();
    applyFR();

    // Level buttons
    $$('.segBtn[data-level]').forEach(b => b.addEventListener('click', () => {
      setLevelUI(b.dataset.level);
    }));

    // Accent buttons
    $$('.segBtn[data-accent]').forEach(b => b.addEventListener('click', () => {
      tts.accent = b.dataset.accent;
      $$('.segBtn[data-accent]').forEach(x => x.classList.toggle('on', x.dataset.accent === tts.accent));
    }));

    $('#rate').addEventListener('input', e => tts.rate = parseFloat(e.target.value||'1'));
    $('#printBtn').addEventListener('click', () => window.print());
    $('#resetScore').addEventListener('click', resetScore);

    $('#frToggle').addEventListener('click', () => { fr = !fr; applyFR(); });

    // Warmup
    $('#newWarmupBtn').addEventListener('click', renderWarmup);
    $('#sayWarmupBtn').addEventListener('click', () => speak($('#warmupPrompt').textContent));

    // Grammar TTS + copy
    $('#sayHopeBtn').addEventListener('click', () => speak($('#hopeBox').textContent));
    $('#sayCondBtn').addEventListener('click', () => speak($('#condBox').textContent));
    $('#copyCondBtn').addEventListener('click', async () => {
      try{ await navigator.clipboard.writeText("If + past simple, would + base verb"); alert("Copied!"); }catch(e){ alert("Copy blocked."); }
    });

    // MCQ
    $('#mcqCheckBtn').addEventListener('click', checkMCQ);
    $('#mcqNextBtn').addEventListener('click', renderMCQ);

    // Fix
    $('#fixCheckBtn').addEventListener('click', checkFix);
    $('#fixShowBtn').addEventListener('click', () => $('#fixFeedback').textContent = `Answer: ${fix.good}\nWhy: ${fix.why}`);
    $('#fixNextBtn').addEventListener('click', renderFix);

    // Dropdown
    $('#ddRandomBtn').addEventListener('click', randomDD);
    $('#ddBuildBtn').addEventListener('click', buildDD);
    $('#ddCheckBtn').addEventListener('click', checkDD);
    $('#ddSayBtn').addEventListener('click', () => speak(buildDD()));

    // Upgrade
    $('#upgradeFillBtn').addEventListener('click', fillUpgrade);
    $('#upgradeSayBtn').addEventListener('click', () => speak([$('#upgradeA2').value,$('#upgradeB1').value,$('#upgradeB2').value].filter(Boolean).join(' ')));
    $('#upgradeClearBtn').addEventListener('click', () => { $('#upgradeA2').value=''; $('#upgradeB1').value=''; $('#upgradeB2').value=''; });

    // Tiles
    $('#tilesRandomBtn').addEventListener('click', renderTiles);
    $('#tilesClearBtn').addEventListener('click', renderTiles);
    $('#tilesUndoBtn').addEventListener('click', tilesUndo);
    $('#tilesCheckBtn').addEventListener('click', tilesCheck);
    $('#tilesSayBtn').addEventListener('click', () => speak($('#tileOutput').textContent));

    // Speaking
    $('#speakSelect').addEventListener('change', renderSpeaking);
    $('#sSayPromptBtn').addEventListener('click', () => speak($('#sPrompt').textContent));
    $('#sModelBtn').addEventListener('click', showSpeakingModel);
    $('#sModelSayBtn').addEventListener('click', () => speak($('#sModelOut').textContent));
    $('#sNotesClearBtn').addEventListener('click', () => $('#sNotes').value='');
    $('#s60Btn').addEventListener('click', () => startTimer('speak',60,'sTimer','Time!'));
    $('#s90Btn').addEventListener('click', () => startTimer('speak',90,'sTimer','Time!'));
    $('#sStopBtn').addEventListener('click', () => stopTimer('speak','sTimer'));

    // Writing
    $('#wBox').addEventListener('input', () => {
      $('#wWords').textContent = String(($('#wBox').value||'').trim().split(/\s+/).filter(Boolean).length);
    });
    $('#wSayBtn').addEventListener('click', () => speak($('#wBox').value));
    $('#wModelBtn').addEventListener('click', showWritingModel);
    $('#wClearBtn').addEventListener('click', () => { $('#wBox').value=''; $('#wWords').textContent='0'; $('#wModelOut').textContent=''; });
    $('#wCopyBtn').addEventListener('click', async () => {
      try{ await navigator.clipboard.writeText($('#wBox').value); alert("Copied!"); }catch(e){ alert("Copy blocked."); }
    });
    $('#w8Btn').addEventListener('click', () => startTimer('write',8*60,'wTimer','Writing time finished.'));
    $('#wStopBtn').addEventListener('click', () => stopTimer('write','wTimer'));

    // Compare
    $('#tCompareBtn').addEventListener('click', compareStats);
    $('#tClearBtn').addEventListener('click', clearCompare);

    // Reset all
    $('#newSetBtn').addEventListener('click', () => {
      renderWarmup();
      renderWritingPrompt();
      renderMCQ();
      renderFix();
      randomDD();
      renderTiles();
      renderSpeaking();
      $('#sNotes').value='';
      $('#wBox').value=''; $('#wWords').textContent='0'; $('#wModelOut').textContent='';
      alert("New prompts loaded!");
    });

    $('#resetAllBtn').addEventListener('click', () => {
      resetScore();
      renderWarmup();
      renderWritingPrompt();
      renderMCQ();
      renderFix();
      randomDD();
      renderTiles();
      renderSpeaking();
      $('#sNotes').value='';
      $('#wBox').value=''; $('#wWords').textContent='0'; $('#wModelOut').textContent='';
      clearCompare();
      $('#ddOut').textContent='';
      $('#upgradeA2').value=''; $('#upgradeB1').value=''; $('#upgradeB2').value='';
      stopTimer('speak','sTimer');
      stopTimer('write','wTimer');
      alert("Reset done.");
    });
  };

  document.addEventListener('DOMContentLoaded', init);
})();
