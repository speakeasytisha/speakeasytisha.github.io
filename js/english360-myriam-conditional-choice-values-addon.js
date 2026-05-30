(() => {
  'use strict';
  window.__CondValuesLoaded = true;

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const pad2 = n => String(n).padStart(2,'0');
  const fmt = s => `${pad2(Math.floor(s/60))}:${pad2(s%60)}`;
  const shuffle = (arr) => { const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; };
  const words = (t) => (t||'').trim().split(/\s+/).filter(Boolean).length;
  const norm = (s) => (s||'').toLowerCase().replace(/[^\w\s’'-]/g,' ').replace(/\s+/g,' ').trim();

  // TTS
  const tts = { voices:[], accent:'US', rate:1 };
  const loadVoices = () => { try{ tts.voices = speechSynthesis.getVoices(); }catch(e){ tts.voices=[]; } };
  const pickVoice = () => {
    const v = tts.voices || [];
    if(!v.length) return null;
    const wants = tts.accent==='UK' ? ['en-GB','United Kingdom','UK'] : ['en-US','United States','US'];
    return v.find(x => wants.some(w => (x.lang||'').includes(w) || (x.name||'').includes(w)))
      || v.find(x => (x.lang||'').startsWith('en'))
      || v[0];
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
  const score = { ok:0, total:0 };
  const updateScore = () => {
    $('#scorePill').textContent = `${score.ok} / ${score.total}`;
    $('#acc').textContent = score.total ? `${Math.round(score.ok/score.total*100)}%` : '0%';
  };
  const addScore = (ok) => { score.total++; if(ok) score.ok++; updateScore(); };
  const resetScore = () => { score.ok=0; score.total=0; updateScore(); };

  // State
  const state = { level:'A2', showFR:true, currentQuiz:null, timers:{ speak:null, write:null }, currentLex:null };

  const setLevel = (lvl) => {
    state.level = lvl;
    $$('.segBtn[data-level]').forEach(b => b.classList.toggle('on', b.dataset.level===lvl));
    $('#qModel').textContent = '—';
    $('#sModelOut').textContent = '—';
    $('#wModelOut').textContent = '—';
  };

  const setFR = (on) => {
    state.showFR = !!on;
    $('#frToggle').textContent = state.showFR ? 'On' : 'Off';
    $('#frToggle').setAttribute('aria-pressed', state.showFR ? 'true':'false');
    renderLex();
  };

  const setAccent = (acc) => {
    tts.accent = acc;
    $$('.segBtn[data-accent]').forEach(b => b.classList.toggle('on', b.dataset.accent===acc));
  };

  // Timers
  const timers = {
    start(key, seconds, outId, doneMsg){
      if(state.timers[key]) clearInterval(state.timers[key]);
      let left = seconds;
      $('#' + outId).textContent = fmt(left);
      state.timers[key] = setInterval(() => {
        left--;
        $('#' + outId).textContent = fmt(Math.max(0,left));
        if(left <= 0){
          clearInterval(state.timers[key]);
          state.timers[key] = null;
          const box = document.createElement('div');
          box.textContent = doneMsg;
          box.style.position='fixed'; box.style.left='16px'; box.style.bottom='16px';
          box.style.background='rgba(0,0,0,.75)'; box.style.color='#fff';
          box.style.padding='10px 12px'; box.style.borderRadius='14px';
          box.style.border='1px solid rgba(255,255,255,.14)';
          box.style.zIndex='9999';
          document.body.appendChild(box);
          setTimeout(()=>box.remove(), 1600);
        }
      }, 1000);
    },
    stop(key, outId){
      if(state.timers[key]) clearInterval(state.timers[key]);
      state.timers[key] = null;
      $('#' + outId).textContent = "00:00";
    }
  };

  // Fast chips
  const fastStructures = [
    "I have always tried to be…",
    "It’s important to be…",
    "My parents taught me to…",
    "I was raised to be…",
    "In my opinion,…",
    "For example,…",
    "In addition,…",
    "Overall,…"
  ];
  const renderFastChips = () => {
    const host = $('#fastChips'); host.innerHTML='';
    fastStructures.forEach(t => {
      const b = document.createElement('button');
      b.type='button'; b.className='chip'; b.textContent=t;
      b.addEventListener('click', () => speak(t.replace('…','')));
      host.appendChild(b);
    });
  };

  // Quiz
  const quizItems = [
    { id:"q1", type:"first",
      situation:"Tonight is busy, but maybe you will have free time. You want to practise English.",
      models:{ A2:"If I have time tonight, I will practise my English.", B1:"If I have time this evening, I’ll practise for 20 minutes.", B2:"If I have a bit of time tonight, I’ll do a short English practice session." },
      note:"Real possibility → If + present, will + verb."
    },
    { id:"q2", type:"second",
      situation:"You dream about travelling to the USA, but your English is not very strong right now.",
      models:{ A2:"If I spoke English better, I would visit the USA.", B1:"If I spoke English better, I would visit the USA because I love wide‑open spaces.", B2:"If I spoke English more confidently, I would travel around the USA, especially to enjoy the wide‑open landscapes." },
      note:"Dream / imaginary now → If + past, would + verb."
    },
    { id:"q3", type:"second",
      situation:"Imagine you win a lot of money. What do you do?",
      models:{ A2:"If I won the lottery, I would travel more.", B1:"If I won the lottery, I would travel more because I love discovering new places.", B2:"If I won the lottery, I would travel much more often, as I’m passionate about discovering new places." },
      note:"Imaginary / not true now → would."
    },
    { id:"q4", type:"first",
      situation:"You might feel tired tomorrow. You plan a simple solution.",
      models:{ A2:"If I feel tired tomorrow, I will go to bed early.", B1:"If I feel tired tomorrow, I’ll go to bed early so that I can rest.", B2:"If I feel tired tomorrow, I’ll go to bed earlier so that I can recharge." },
      note:"Possible future → will."
    }
  ];

  const nextQuiz = () => {
    state.currentQuiz = shuffle(quizItems)[0];
    $('#qSituation').textContent = state.currentQuiz.situation;
    $('#qFeedback').textContent = '';
    $('#qModel').textContent = '—';
  };

  const checkQuiz = (pickedType) => {
    if(!state.currentQuiz) return;
    const ok = pickedType === state.currentQuiz.type;
    addScore(ok);
    $('#qFeedback').textContent = ok
      ? `✅ Correct!\n${state.currentQuiz.note}`
      : `❌ Not this time.\nCorrect answer: ${state.currentQuiz.type === 'first' ? 'Real future (will)' : 'Dream (would)'}\n${state.currentQuiz.note}`;
  };

  const showQuizModel = () => {
    if(!state.currentQuiz) return;
    $('#qModel').textContent = state.currentQuiz.models[state.level];
  };

  // Builder
  const ifFirst = ["I have time tonight","I feel tired tomorrow","it rains this weekend","we finish early","my husband is available"];
  const mainFirst = ["I will practise my English","I will go to bed early","we will stay inside","we will go for a walk","we will have dinner out"];
  const ifSecond = ["I spoke English better","I won the lottery","I lived near the sea","I were younger","I had more free time"];
  const mainSecond = ["I would visit the USA","I would travel more","I would buy a small house","I would learn Spanish","I would cook new recipes"];
  const reasons = ["because I love discovering new places","because I want to set a good example","because I enjoy wide‑open spaces","so that I could relax more","because it would make me happy"];

  const fillBuilder = () => {
    const type = $('#bType').value;
    const ifSel = $('#bIf');
    const mainSel = $('#bMain');
    ifSel.innerHTML = '';
    mainSel.innerHTML = '';

    (type === 'first' ? ifFirst : ifSecond).forEach(x => ifSel.insertAdjacentHTML('beforeend', `<option value="${x}">${x}</option>`));
    (type === 'first' ? mainFirst : mainSecond).forEach(x => mainSel.insertAdjacentHTML('beforeend', `<option value="${x}">${x}</option>`));

    $('#bReason').innerHTML = ['(no reason)', ...reasons].map(x => `<option value="${x}">${x}</option>`).join('');
    $('#bReason').value='(no reason)';
    $('#bOut').textContent='—';
  };

  const buildConditional = () => {
    const ifClause = $('#bIf').value;
    const mainClause = $('#bMain').value;
    const reason = $('#bReason').value;

    let sentence = `If ${ifClause}, ${mainClause}.`;
    if(reason && reason !== '(no reason)') sentence = `If ${ifClause}, ${mainClause} ${reason}.`;
    $('#bOut').textContent = sentence;
    return {type: $('#bType').value, sentence};
  };

  const checkConditional = () => {
    const {type, sentence} = buildConditional();
    const s = norm(sentence);
    let ok = true;

    if(type === 'first'){
      if(s.includes("if i will") || s.includes("if we will")) ok = false;
      if(s.includes(" would ")) ok = false;
    } else {
      if(s.includes(" will ")) ok = false;
      if(s.includes("if i was")) ok = false; // teaching 'were'
    }

    addScore(ok);
    $('#bOut').textContent = sentence + (ok ? "\n✅ Great." : "\n⚠️ Check the structure: will vs would.");
  };

  const randomConditional = () => {
    const type = shuffle(["first","second"])[0];
    $('#bType').value = type;
    fillBuilder();
    $('#bIf').value = (type === 'first' ? shuffle(ifFirst)[0] : shuffle(ifSecond)[0]);
    $('#bMain').value = (type === 'first' ? shuffle(mainFirst)[0] : shuffle(mainSecond)[0]);
    $('#bReason').value = shuffle(['(no reason)', ...reasons])[0];
    $('#bOut').textContent = '—';
  };

  // Mistakes
  const mistakes = [
    {bad:"If I will have time, I will practise.", good:"If I have time, I will practise."},
    {bad:"If I would be rich, I would travel.", good:"If I were rich, I would travel."},
    {bad:"If I have more time, I would travel.", good:"If I had more time, I would travel."},
    {bad:"If I was you, I would do it.", good:"If I were you, I would do it."},
    {bad:"If I won the lottery, I will travel.", good:"If I won the lottery, I would travel."}
  ];
  const renderMistakes = () => {
    const host = $('#mistakeChips'); host.innerHTML='';
    mistakes.forEach(m => {
      const b = document.createElement('button');
      b.type='button'; b.className='chip'; b.textContent = m.bad;
      b.addEventListener('click', () => { $('#mistakeBox').textContent = `Fix:\n${m.good}`; speak(m.good); });
      host.appendChild(b);
    });
  };

  // Values builder
  const valueStarters = [
    {id:"always", label:"I have always tried to be", kind:"adj"},
    {id:"important", label:"It’s important to be", kind:"adj"},
    {id:"taught", label:"My parents taught me to", kind:"verb"},
    {id:"raised", label:"I was raised to be", kind:"adj"}
  ];
  const valueAdjs = ["honest","kind","patient","respectful","hardworking","responsible","open-minded"];
  const valueVerbs = ["respect others","help others","work hard","listen carefully","keep my promises","be fair"];
  const connectors = ["because","since","so that"];
  const why = ["it helps build trust","it makes family relationships stronger","I want to set a good example","it helps people feel safe","it creates a peaceful home"];

  const fillValues = () => {
    $('#vStart').innerHTML = valueStarters.map(s => `<option value="${s.id}">${s.label}</option>`).join('');
    $('#vConn').innerHTML = connectors.map(c => `<option value="${c}">${c}</option>`).join('');
    $('#vWhy').innerHTML = why.map(w => `<option value="${w}">${w}</option>`).join('');
    syncValueWord();
  };

  const syncValueWord = () => {
    const starter = valueStarters.find(x => x.id === $('#vStart').value) || valueStarters[0];
    const list = starter.kind === 'verb' ? valueVerbs : valueAdjs;
    $('#vWord').innerHTML = list.map(x => `<option value="${x}">${x}</option>`).join('');
    $('#vOut').textContent = '—';
  };

  const buildValue = () => {
    const starter = valueStarters.find(x => x.id === $('#vStart').value) || valueStarters[0];
    const word = $('#vWord').value;
    const conn = $('#vConn').value;
    const reason = $('#vWhy').value;
    const sentence = `${starter.label} ${word} ${conn} ${reason}.`;
    $('#vOut').textContent = sentence;
    return sentence;
  };

  const checkValue = () => {
    const s = buildValue();
    const t = norm(s);
    let ok = true;
    if(t.includes("taught me to honest")) ok = false;
    if(t.includes("taught me to responsible")) ok = false;
    addScore(ok);
    $('#vOut').textContent = s + (ok ? "\n✅ Great values sentence." : "\n⚠️ Check: 'taught me to' + verb / 'to be' + adjective.");
  };

  const randomValue = () => {
    $('#vStart').value = shuffle(valueStarters.map(x=>x.id))[0];
    syncValueWord();
    $('#vWord').value = shuffle($$('#vWord option').map(o=>o.value))[0];
    $('#vConn').value = shuffle(connectors)[0];
    $('#vWhy').value = shuffle(why)[0];
    $('#vOut').textContent = '—';
  };

  // Paragraph upgrade
  const upgradeTips = ["A2: 2 values + 1 reason.","B1: add 1 example (For example, …).","B2: add contrast (However / Although) + conclusion (Overall, …)."].join("\n");

  const fillParagraph = () => {
    $('#pA2').value = "I have always tried to be honest and respectful.\nIt’s important to be kind because it helps build trust.\nMy parents taught me to work hard.\nOverall, these values are important in my family.";
    $('#pB2').value = "I have always tried to be honest and respectful, because trust is essential.\nIn addition, I believe it’s important to be kind, especially with family.\nFor example, I try to listen carefully before I respond.\nHowever, it can be difficult sometimes, so I remind myself to stay patient.\nOverall, I want to pass down these values because they create strong relationships.";
  };

  // Lexicon
  const lex = [
    {id:"honest", cat:"Values", icon:"🧭", en:"honest", fr:"honnête", def:"telling the truth", ex:"It’s important to be honest."},
    {id:"respectful", cat:"Values", icon:"🤝", en:"respectful", fr:"respectueux(se)", def:"showing respect", ex:"I have always tried to be respectful."},
    {id:"patient", cat:"Values", icon:"🧘", en:"patient", fr:"patient(e)", def:"able to wait calmly", ex:"I try to be patient with my family."},
    {id:"hardworking", cat:"Values", icon:"💪", en:"hardworking", fr:"travailleur(se)", def:"working hard", ex:"My parents taught me to work hard."},
    {id:"responsible", cat:"Values", icon:"✅", en:"responsible", fr:"responsable", def:"reliable; you do your duties", ex:"It’s important to be responsible."},
    {id:"lottery", cat:"Dreams", icon:"🎟️", en:"the lottery", fr:"la loterie", def:"a game where you can win money", ex:"If I won the lottery, I would travel more."},
    {id:"wide-open", cat:"Dreams", icon:"🏜️", en:"wide-open spaces", fr:"de grands espaces", def:"big natural spaces", ex:"I love wide-open spaces."},
    {id:"discover", cat:"Dreams", icon:"🧳", en:"to discover", fr:"découvrir", def:"to find something new", ex:"I love discovering new places."},
    {id:"because", cat:"Connectors", icon:"🔗", en:"because", fr:"parce que", def:"gives a reason", ex:"I travel because I love nature."},
    {id:"so-that", cat:"Connectors", icon:"🔗", en:"so that", fr:"afin que", def:"shows purpose", ex:"I study so that I can improve."},
    {id:"overall", cat:"Connectors", icon:"🔗", en:"overall", fr:"globalement", def:"in general; conclusion", ex:"Overall, these values are important."},
    {id:"however", cat:"Connectors", icon:"🔗", en:"however", fr:"cependant", def:"contrast", ex:"However, it can be difficult sometimes."},
    {id:"for-example", cat:"Connectors", icon:"🔗", en:"for example", fr:"par exemple", def:"gives an example", ex:"For example, I listen carefully."}
  ];
  const lexCats = ["All", ...Array.from(new Set(lex.map(v=>v.cat))).sort((a,b)=>a.localeCompare(b))];

  const fillLexCats = () => { $('#lexCat').innerHTML = lexCats.map(c => `<option value="${c}">${c}</option>`).join(''); $('#lexCat').value='All'; };
  const lexFiltered = () => {
    const cat = $('#lexCat').value;
    const q = ($('#lexSearch').value || '').trim().toLowerCase();
    return lex.filter(v => cat==='All' || v.cat===cat).filter(v => !q || v.en.toLowerCase().includes(q) || v.fr.toLowerCase().includes(q));
  };

  const renderLex = () => {
    const grid = $('#lexGrid'); grid.innerHTML='';
    lexFiltered().forEach(v => {
      const card = document.createElement('button');
      card.type='button'; card.className='vCard';
      card.innerHTML = `
        <div class="vTop">
          <div class="vIcon" aria-hidden="true">${v.icon}</div>
          <div>
            <div class="vEn">${v.en}</div>
            <div class="vFr" style="display:${state.showFR?'block':'none'}">${v.fr}</div>
          </div>
          <div class="vCat"><div class="vTag">${v.cat}</div></div>
        </div>
        <div class="tiny muted">${v.def}</div>`;
      card.addEventListener('click', () => openLexModal(v));
      grid.appendChild(card);
    });
  };

  // Modal
  const overlay = () => $('#modalOverlay');
  const openLexModal = (v) => {
    state.currentLex = v;
    $('#mIcon').textContent = v.icon;
    $('#mEn').textContent = v.en;
    $('#mFr').textContent = v.fr;
    $('#mFr').style.display = state.showFR ? 'block' : 'none';
    $('#mDef').textContent = `Definition: ${v.def}`;
    $('#mEx').textContent = `Example: ${v.ex}`;
    overlay().hidden = false;
    $('#modalClose').focus();
  };
  const closeModal = () => { overlay().hidden = true; state.currentLex = null; };

  // Speaking
  const speakScenarios = [
    { id:"sp1", title:"Dream + value",
      prompt:"Speak: If you spoke English better, what would you do? Then say one important value in your family.",
      chips:["If I spoke…, I would…","I have always tried to be…","It’s important to be…","For example,…","Overall,…"],
      models:{ A2:"If I spoke English better, I would visit the USA. I have always tried to be honest. It’s important to be respectful because it helps build trust.",
        B1:"If I spoke English better, I would travel more, especially in the USA. In addition, I think it’s important to be kind and patient. For example, I try to listen carefully in my family.",
        B2:"If I spoke English more confidently, I would travel around the USA to enjoy the wide‑open landscapes. However, I believe values matter more than travel: I have always tried to be honest and respectful. Overall, these values create strong relationships." } },
    { id:"sp2", title:"Real plan + value",
      prompt:"Speak: If you have time this week, what will you do for your English? Add one value sentence.",
      chips:["If I have time, I will…","My parents taught me to…","It’s important to…","In addition,…"],
      models:{ A2:"If I have time, I will practise my English. My parents taught me to work hard. It’s important to be responsible.",
        B1:"If I have time this week, I’ll practise for 15 minutes a day. In addition, it’s important to be patient because progress takes time.",
        B2:"If I have a bit of time this week, I’ll do short practice sessions every day. In the long run, consistency matters. It’s important to be hardworking, because I want to set a good example." } }
  ];

  const fillSpeaking = () => {
    $('#sSel').innerHTML = speakScenarios.map(s => `<option value="${s.id}">${s.title}</option>`).join('');
    $('#sSel').value = speakScenarios[0].id;
    renderSpeakPrompt();
    renderSpeakChips();
  };
  const currentSpeak = () => speakScenarios.find(x => x.id === $('#sSel').value) || speakScenarios[0];
  const renderSpeakPrompt = () => { $('#sPrompt').textContent = currentSpeak().prompt; $('#sModelOut').textContent='—'; $('#sNotes').value=''; };
  const renderSpeakChips = () => {
    const host = $('#sChips'); host.innerHTML='';
    currentSpeak().chips.forEach(c => {
      const b=document.createElement('button'); b.type='button'; b.className='chip'; b.textContent=c;
      b.addEventListener('click', () => { const ta=$('#sNotes'); ta.value = (ta.value ? ta.value + "\n" : "") + c.replace('…',''); });
      host.appendChild(b);
    });
  };
  const showSpeakModel = () => { $('#sModelOut').textContent = currentSpeak().models[state.level]; };

  // Writing
  const writingPrompts = [
    "Write 8–12 lines: One dream (would) + one real plan (will) + your family values.",
    "Write 8–12 lines: What values did you learn from your parents? Add one conditional sentence.",
    "Write 8–12 lines: Your dream trip + the values you want to pass down."
  ];
  const writingModels = {
    A2:"If I spoke English better, I would visit the USA because I love wide-open spaces.\nIf I have time this week, I will practise my English.\nI have always tried to be honest and respectful.\nIt’s important to be kind because it helps build trust.\nOverall, these values are important for my family.",
    B1:"If I won the lottery, I would travel more because I love discovering new places.\nIf I have time this week, I’ll practise every day.\nIn addition, I think it’s important to be hardworking and patient.\nFor example, I try to listen carefully and stay calm.\nOverall, I want to pass down these values to my family.",
    B2:"If I spoke English more confidently, I would travel around the USA to enjoy the wide-open landscapes.\nHowever, I also have real plans: if I have time this week, I’ll practise a little every day.\nI have always tried to be honest and respectful, because trust is essential.\nIn addition, my parents taught me to work hard and be responsible.\nOverall, these values create strong relationships and I want to pass them down."
  };

  const renderWriting = () => {
    $('#wPrompt').textContent = shuffle(writingPrompts)[0];
    $('#wModelOut').textContent = '—';
    $('#wBox').value = '';
    $('#wWords').textContent = '0';
  };

  const renderWritingChips = () => {
    const phrases = ["If I have time, I will…","If I spoke…, I would…","I have always tried to be…","It’s important to be…","My parents taught me to…","For example,…","In addition,…","However,…","Overall,…"];
    const host = $('#wChips'); host.innerHTML='';
    phrases.forEach(p => {
      const b=document.createElement('button'); b.type='button'; b.className='chip'; b.textContent=p;
      b.addEventListener('click', () => { const ta=$('#wBox'); ta.value = (ta.value ? ta.value + "\n" : "") + p.replace('…',''); $('#wWords').textContent = String(words(ta.value)); });
      host.appendChild(b);
    });
  };

  const showWritingModel = () => { $('#wModelOut').textContent = writingModels[state.level]; };

  // Reset / New set
  const resetAll = () => {
    timers.stop('speak','sTimer');
    timers.stop('write','wTimer');
    $('#qFeedback').textContent='';
    $('#qModel').textContent='—';
    $('#bOut').textContent='—';
    $('#mistakeBox').textContent='Tap a mistake to see the correction.';
    $('#vOut').textContent='—';
    $('#pA2').value=''; $('#pB2').value='';
    $('#sNotes').value=''; $('#sModelOut').textContent='—';
    $('#wBox').value=''; $('#wWords').textContent='0'; $('#wModelOut').textContent='—';
    nextQuiz();
    fillBuilder();
    fillValues();
    renderWriting();
    updateScore();
  };

  const newSet = () => {
    nextQuiz();
    randomConditional();
    randomValue();
    renderWriting();
  };

  const init = () => {
    $('#jsOk').textContent = "JS: ready ✅";
    updateScore();
    loadVoices();
    if('speechSynthesis' in window) speechSynthesis.onvoiceschanged = loadVoices;

    // Controls
    $$('.segBtn[data-level]').forEach(b => b.addEventListener('click', () => setLevel(b.dataset.level)));
    $$('.segBtn[data-accent]').forEach(b => b.classList.contains('segBtn') && b.dataset.accent && b.addEventListener('click', () => setAccent(b.dataset.accent)));
    $('#rate').addEventListener('input', e => tts.rate = parseFloat(e.target.value || '1'));
    $('#frToggle').addEventListener('click', () => setFR(!state.showFR));
    $('#printBtn').addEventListener('click', () => window.print());
    $('#resetAllBtn').addEventListener('click', resetAll);
    $('#newSetBtn').addEventListener('click', newSet);
    $('#resetScore').addEventListener('click', resetScore);

    // Guide
    $('#sayFirstBtn').addEventListener('click', () => speak($('#exFirst').textContent));
    $('#saySecondBtn').addEventListener('click', () => speak($('#exSecond').textContent));
    $('#copyFirstBtn').addEventListener('click', async () => { try{ await navigator.clipboard.writeText("If + present, will + verb"); }catch(e){} });
    $('#copySecondBtn').addEventListener('click', async () => { try{ await navigator.clipboard.writeText("If + past, would + base verb"); }catch(e){} });

    renderFastChips();
    $('#sayFastBtn').addEventListener('click', () => speak(fastStructures.map(x=>x.replace('…','')).join('. ')));

    // Quiz
    nextQuiz();
    $('#pickFirstBtn').addEventListener('click', () => checkQuiz('first'));
    $('#pickSecondBtn').addEventListener('click', () => checkQuiz('second'));
    $('#qNextBtn').addEventListener('click', nextQuiz);
    $('#qSayBtn').addEventListener('click', () => speak($('#qSituation').textContent));
    $('#qShowModelBtn').addEventListener('click', showQuizModel);
    $('#qSayModelBtn').addEventListener('click', () => speak($('#qModel').textContent));

    // Builder
    fillBuilder();
    $('#bType').addEventListener('change', fillBuilder);
    $('#bBuildBtn').addEventListener('click', buildConditional);
    $('#bCheckBtn').addEventListener('click', checkConditional);
    $('#bRandomBtn').addEventListener('click', randomConditional);
    $('#bSayBtn').addEventListener('click', () => speak(buildConditional().sentence));
    renderMistakes();

    // Values
    fillValues();
    $('#vStart').addEventListener('change', syncValueWord);
    $('#vBuildBtn').addEventListener('click', buildValue);
    $('#vCheckBtn').addEventListener('click', checkValue);
    $('#vRandomBtn').addEventListener('click', randomValue);
    $('#vSayBtn').addEventListener('click', () => speak(buildValue()));
    $('#upgradeTips').textContent = upgradeTips;
    $('#pFillBtn').addEventListener('click', fillParagraph);
    $('#pClearBtn').addEventListener('click', () => { $('#pA2').value=''; $('#pB2').value=''; });
    $('#pSayBtn').addEventListener('click', () => speak([$('#pA2').value,$('#pB2').value].filter(Boolean).join(' ')));

    // Lexicon
    fillLexCats();
    renderLex();
    $('#lexCat').addEventListener('change', renderLex);
    $('#lexSearch').addEventListener('input', renderLex);
    $('#lexResetBtn').addEventListener('click', () => { $('#lexCat').value='All'; $('#lexSearch').value=''; renderLex(); });

    $('#modalClose').addEventListener('click', closeModal);
    $('#modalOverlay').addEventListener('click', (e) => { if(e.target.id === 'modalOverlay') closeModal(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && !overlay().hidden) closeModal(); });
    $('#mSayBtn').addEventListener('click', () => { if(state.currentLex) speak(state.currentLex.en); });
    $('#mAddBtn').addEventListener('click', () => {
      if(!state.currentLex) return;
      const ta = $('#wBox');
      ta.value = (ta.value ? ta.value + "\n" : "") + state.currentLex.en;
      $('#wWords').textContent = String(words(ta.value));
    });

    // Speaking
    fillSpeaking();
    $('#sSel').addEventListener('change', () => { renderSpeakPrompt(); renderSpeakChips(); });
    $('#sSayBtn').addEventListener('click', () => speak($('#sPrompt').textContent));
    $('#sModelBtn').addEventListener('click', showSpeakModel);
    $('#sModelSayBtn').addEventListener('click', () => speak($('#sModelOut').textContent));
    $('#s60Btn').addEventListener('click', () => timers.start('speak',60,'sTimer','Time!'));
    $('#s90Btn').addEventListener('click', () => timers.start('speak',90,'sTimer','Time!'));
    $('#sStopBtn').addEventListener('click', () => timers.stop('speak','sTimer'));

    // Writing
    renderWriting();
    renderWritingChips();
    $('#wBox').addEventListener('input', () => $('#wWords').textContent = String(words($('#wBox').value)));
    $('#wSayBtn').addEventListener('click', () => speak($('#wBox').value));
    $('#wModelBtn').addEventListener('click', showWritingModel);
    $('#wClearBtn').addEventListener('click', () => { $('#wBox').value=''; $('#wWords').textContent='0'; $('#wModelOut').textContent='—'; });
    $('#wCopyBtn').addEventListener('click', async () => { try{ await navigator.clipboard.writeText($('#wBox').value); }catch(e){} });
    $('#w8Btn').addEventListener('click', () => timers.start('write',8*60,'wTimer','Writing time finished.'));
    $('#wStopBtn').addEventListener('click', () => timers.stop('write','wTimer'));

    // Defaults
    setFR(true);
    setLevel('A2');
    setAccent('US');
  };

  window.addEventListener('error', (e) => {
    const box = $('#errBox');
    if(box){
      box.hidden = false;
      box.textContent = '⚠️ ' + (e && e.message ? e.message : 'Error');
    }
  });

  document.addEventListener('DOMContentLoaded', init);
})();