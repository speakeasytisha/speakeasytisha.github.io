(() => {
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));
  const scoreState = { now:0, max:17, awarded:new Set() };
  window.addEventListener('error', (e) => { const s = document.querySelector('#jsStatus'); if(s) s.textContent = 'JS: ❌ error'; console.error(e.error || e.message); });

  function updateScore(){
    $('#scoreNow').textContent = scoreState.now;
    $('#scoreMax').textContent = scoreState.max;
    $('#progressBar').style.width = `${Math.round((scoreState.now/scoreState.max)*100)}%`;
  }
  function award(key, pts=1){
    if(scoreState.awarded.has(key)) return;
    scoreState.awarded.add(key);
    scoreState.now += pts;
    updateScore();
  }

  // Speech
  const Speech = {
    mode:'en-US',
    getVoices(){ return window.speechSynthesis?.getVoices?.() || []; },
    pickVoice(){
      const voices = this.getVoices();
      const lang = this.mode.toLowerCase();
      return voices.find(v => (v.lang||'').toLowerCase() === lang)
          || voices.find(v => (v.lang||'').toLowerCase().startsWith(lang))
          || voices.find(v => (v.lang||'').toLowerCase().startsWith('en'))
          || null;
    },
    say(text){
      if(!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const voice = this.pickVoice();
      if(voice) u.voice = voice;
      u.lang = this.mode;
      u.rate = 0.96;
      window.speechSynthesis.speak(u);
    },
    pause(){ window.speechSynthesis?.pause?.(); },
    resume(){ window.speechSynthesis?.resume?.(); },
    stop(){ window.speechSynthesis?.cancel?.(); }
  };
  if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged = () => Speech.getVoices();

  function setVoice(mode){
    Speech.mode = mode;
    $('#voiceUS').classList.toggle('is-on', mode === 'en-US');
    $('#voiceUK').classList.toggle('is-on', mode === 'en-GB');
    $('#voiceUS').setAttribute('aria-pressed', mode === 'en-US');
    $('#voiceUK').setAttribute('aria-pressed', mode === 'en-GB');
  }

  const flashcards = [
    {icon:'😌', word:'calm', fr:'calme', def:'not nervous or upset', ex:'You are calm and professional.'},
    {icon:'🗣️', word:'calmly', fr:'calmement', def:'in a calm way', ex:'Please explain the situation calmly.'},
    {icon:'✨', word:'clear', fr:'clair', def:'easy to understand', ex:'It is a clear explanation.'},
    {icon:'🎯', word:'clearly', fr:'clairement', def:'in a clear way', ex:'Please speak clearly.'},
    {icon:'🙏', word:'politely', fr:'poliment', def:'in a respectful way', ex:'You should answer politely.'},
    {icon:'🛄', word:'cabin bag', fr:'bagage cabine', def:'a small bag you take on the plane', ex:'Can I take one extra cabin bag?'},
    {icon:'🔗', word:'connection', fr:'correspondance', def:'your next flight after the first one', ex:'I am worried about my connection.'},
    {icon:'⏰', word:'delay', fr:'retard', def:'a late flight or late departure', ex:'There is a short delay today.'},
    {icon:'❗', word:'request', fr:'demande', def:'something a passenger asks for', ex:'I understand your request.'},
    {icon:'🪑', word:'seat', fr:'siège', def:'the place where you sit on the plane', ex:'I have a problem with my seat.'},
    {icon:'🔍', word:'check', fr:'vérifier', def:'look carefully to confirm information', ex:'Let me check your booking.'},
    {icon:'➡️', word:'next steps', fr:'étapes suivantes', def:'what happens after this', ex:'I will explain the next steps.'}
  ];

  const fillA = [
    {q:'You are ____ and professional.', options:['calm','calmly'], answer:0, explain:'After be, use the adjective: calm.'},
    {q:'Please speak ____.', options:['calm','calmly'], answer:1, explain:'Speak = verb, so use the adverb: calmly.'},
    {q:'Please explain the situation ____.', options:['clear','clearly'], answer:1, explain:'Explain = verb, so use the adverb: clearly.'},
    {q:'It is a ____ message.', options:['clear','clearly'], answer:0, explain:'Message = noun, so use the adjective: clear.'}
  ];

  const fillB = [
    {q:'Could you ____ that, please?', options:['repeat','repeating','repeats'], answer:0, explain:'After could you, use the base verb.'},
    {q:'Could you say that more ____ please?', options:['slow','slowly','slowerly'], answer:1, explain:'You need the adverb: slowly.'},
    {q:'If I understand ____, you have a problem with your seat.', options:['correct','correctly','correctness'], answer:1, explain:'Understand = verb, so use correctly.'},
    {q:'Let me ____ your booking.', options:['check','checking','checks'], answer:0, explain:'After let me, use the base verb.'}
  ];

  const listenItems = [
    {q:'What does the passenger want to know?', options:['If he can take one extra cabin bag','If the bar is open','If the airport is closed'], answer:0, explain:'The message asks about an extra cabin bag.'},
    {q:'What is the second problem?', options:['He is hungry','He is worried about a short connection','He has no passport'], answer:1, explain:'The second issue is the short connection.'},
    {q:'Choose the best reformulation.', options:[
      'If I understand correctly, you would like to know if you can take one extra cabin bag, and you are worried about your connection in Paris.',
      'You have bag and Paris tomorrow.',
      'Connection bag tomorrow is possible maybe.'
    ], answer:0, explain:'This is the clearest professional reformulation.'}
  ];

  const writingModels = {
    basic:`Hello,
There is a delay for your flight. Please wait at the gate. We will give you more information soon.
Thank you.`,
    better:`Hello,
Your flight is delayed. Please stay near the gate and check the information screens. We will give you an update as soon as possible.
Thank you for your patience.`,
    strong:`Hello,
Your flight is currently delayed. Please remain near the gate and check the information screens for updates. Our team will provide the next steps as soon as possible. Thank you for your patience and understanding.
Best regards,`
  };

  const roleplays = [
    {
      title:'Seat problem',
      prompt:'Passenger: Hello. I have a problem with my seat and I do not know what to do.',
      model:'I understand. Could you explain the problem, please? Let me check your booking. I will explain the next steps.',
      modelFr:'Je comprends. Pourriez-vous expliquer le problème, s’il vous plaît ? Laissez-moi vérifier votre réservation. Je vais expliquer les étapes suivantes.',
      checklist:['Did you sound calm?','Did you ask for clarification politely?','Did you say you would check?','Did you mention the next steps?']
    },
    {
      title:'Short connection',
      prompt:'Passenger: I am worried because I have a short connection in Paris.',
      model:'I understand. If I understand correctly, you are worried about your connection in Paris. Let me check the information, and I will explain the next steps clearly.',
      modelFr:'Je comprends. Si je comprends bien, vous êtes inquiet pour votre correspondance à Paris. Laissez-moi vérifier les informations et je vais expliquer clairement les étapes suivantes.',
      checklist:['Did you reformulate the problem?','Did you sound polite and clear?','Did you use let me check?','Did you say clearly what you will do next?']
    },
    {
      title:'Cabin bag question',
      prompt:'Passenger: Can I take one extra cabin bag?',
      model:'Let me check. Could you wait a moment, please? I will check the baggage rules and explain the next steps.',
      modelFr:'Laissez-moi vérifier. Pourriez-vous attendre un moment, s’il vous plaît ? Je vais vérifier les règles sur les bagages et expliquer les étapes suivantes.',
      checklist:['Did you ask the passenger to wait politely?','Did you say you would check?','Did you stay calm and professional?']
    }
  ];

  const finalQuick = [
    {q:'You are ____.', options:['calm','calmly'], answer:0},
    {q:'Please answer ____.', options:['polite','politely'], answer:1},
    {q:'It is a ____ message.', options:['clear','clearly'], answer:0}
  ];

  function renderFlashcards(){
    const host = $('#flashGrid');
    host.innerHTML = '';
    flashcards.forEach(card => {
      const el = document.createElement('div');
      el.className = 'flashcard';
      el.innerHTML = `
        <div class="fcTop"><div class="fcWord">${card.icon} ${card.word}</div><button class="iconbtn" type="button">🔊</button></div>
        <div class="fr tiny">${card.fr}</div>
        <div class="fcDef">${card.def}</div>
        <div class="fcEx">Example: ${card.ex}</div>
      `;
      $('.iconbtn', el).addEventListener('click', () => Speech.say(`${card.word}. ${card.ex}`));
      host.appendChild(el);
    });
  }

  function shuffle(arr){ return arr.map(v=>({v, r:Math.random()})).sort((a,b)=>a.r-b.r).map(x=>x.v); }

  function renderChoiceExercise(hostSelector, data, keyPrefix){
    const host = $(hostSelector);
    if(!host) return;
    host.innerHTML = '';
    data.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'qcard';
      card.innerHTML = `<div class="qprompt">${idx+1}. ${item.q}</div><div class="choiceRow"></div><div class="feedback hidden"></div>`;
      const row = $('.choiceRow', card);
      const fb = $('.feedback', card);
      const choiceData = shuffle(item.options.map((opt, optIdx) => ({ opt, ok: optIdx === item.answer })));
      choiceData.forEach(({opt, ok}) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          fb.classList.remove('hidden','ok','no');
          fb.classList.add(ok ? 'ok' : 'no');
          fb.innerHTML = ok ? `✅ Correct. ${item.explain || ''}` : `❌ Not yet. ${item.explain || ''}`;
          if(ok) award(`${keyPrefix}:${idx}`, 1);
        });
        row.appendChild(btn);
      });
      host.appendChild(card);
    });
  }

  function renderListening(){
    renderChoiceExercise('#listenQs1', listenItems, 'listen1');
  }

  function renderWritingChecklist(){
    const host = $('#writeChecklist');
    const input = $('#studentWrite');
    if(!host || !input) return;
    const checks = [
      'greet the passenger',
      'explain the problem clearly',
      'give the next steps',
      'use polite language',
      'finish professionally'
    ];
    const update = () => {
      const txt = input.value.toLowerCase();
      const rules = [
        txt.includes('hello') || txt.includes('good'),
        txt.includes('delay') || txt.includes('problem'),
        txt.includes('please') || txt.includes('next steps') || txt.includes('remain') || txt.includes('check'),
        txt.includes('thank') || txt.includes('please') || txt.includes('understanding'),
        txt.includes('best regards') || txt.includes('thank you') || txt.includes('regards')
      ];
      host.innerHTML = checks.map((c, i) => `<div class="checkitem ${rules[i] ? 'ok' : 'no'}">${rules[i] ? '✅' : '▫'} ${c}</div>`).join('');
    };
    input.oninput = update;
    update();
  }

  function renderRoleplaySelect(){
    const sel = $('#rpSelect');
    if(!sel) return;
    sel.innerHTML = '';
    roleplays.forEach((rp, i) => {
      const o = document.createElement('option');
      o.value = i;
      o.textContent = rp.title;
      sel.appendChild(o);
    });
    updateRoleplay();
  }
  function updateRoleplay(){
    const sel = $('#rpSelect');
    const rp = roleplays[Number(sel?.value || 0)];
    if(!rp) return;
    $('#rpPrompt').textContent = rp.prompt;
    $('#rpModel').textContent = rp.model;
    $('#rpModelFr').textContent = rp.modelFr;
    $('#rpAnswer').value = '';
    const host = $('#rpChecklist');
    host.innerHTML = rp.checklist.map(c => `<div class="checkitem no">▫ ${c}</div>`).join('');
  }
  function compareRoleplay(){
    const rp = roleplays[Number($('#rpSelect').value || 0)];
    const txt = $('#rpAnswer').value.toLowerCase();
    const rules = [
      txt.includes('understand') || txt.includes('sorry') || txt.includes('calm') || txt.includes('please'),
      txt.includes('could you') || txt.includes('can you') || txt.includes('if i understand correctly'),
      txt.includes('check'),
      txt.includes('next steps') || txt.includes('will explain') || txt.includes('information')
    ];
    $$('.checkitem', $('#rpChecklist')).forEach((el, i) => {
      const ok = (typeof rules[i] === 'boolean') ? rules[i] : (txt.includes('please') || txt.includes('check'));
      el.classList.toggle('ok', ok);
      el.classList.toggle('no', !ok);
      el.textContent = `${ok ? '✅' : '▫'} ${rp.checklist[i]}`;
    });
    if(rules.filter(Boolean).length >= 2) award(`rp:${$('#rpSelect').value}`, 2);
  }

  function renderFinalQuick(){
    renderChoiceExercise('#finalQuick', finalQuick, 'final');
  }

  function resetAll(){
    scoreState.now = 0;
    scoreState.awarded.clear();
    updateScore();
    renderChoiceExercise('#fillHostA', fillA, 'fillA');
    renderChoiceExercise('#fillHostB', fillB, 'fillB');
    renderListening();
    renderFinalQuick();
    $('#studentWrite').value = '';
    renderWritingChecklist();
    $('#basicBox').textContent = 'Click to show.';
    $('#betterBox').textContent = 'Click to show.';
    $('#strongBox').textContent = 'Click to show.';
    updateRoleplay();
    $$('textarea').forEach(t => { if(t.id !== 'studentWrite' && t.id !== 'rpAnswer') t.value = ''; });
    $('#rpAnswer').value = '';
  }

  function on(el, event, handler){ if(el) el.addEventListener(event, handler); }

  function init(){
    try {
      const status = $('#jsStatus');
      if(status) status.textContent = 'JS: ✅ loaded';
    setVoice('en-US');
    updateScore();
    renderFlashcards();
    renderChoiceExercise('#fillHostA', fillA, 'fillA');
    renderChoiceExercise('#fillHostB', fillB, 'fillB');
    renderListening();
    renderWritingChecklist();
    renderRoleplaySelect();
    renderFinalQuick();

    on($('#voiceUS'),'click', () => setVoice('en-US'));
    on($('#voiceUK'),'click', () => setVoice('en-GB'));
    on($('#btnPause'),'click', () => Speech.pause());
    on($('#btnResume'),'click', () => Speech.resume());
    on($('#btnStop'),'click', () => Speech.stop());
    on($('#btnStart'),'click', () => $('#main')?.scrollIntoView({behavior:'smooth'}));
    on($('#btnLessonAudio'),'click', () => Speech.say('In this lesson, you practise how to stay calm, ask for clarification, reformulate information, and write a short professional message.'));
    on($('#btnMsg1'),'click', () => Speech.say($('#msg1Text')?.textContent || ''));
    on($('#btnShowBasic'),'click', () => { $('#basicBox').textContent = writingModels.basic; Speech.say(writingModels.basic); });
    on($('#btnShowBetter'),'click', () => { $('#betterBox').textContent = writingModels.better; Speech.say(writingModels.better); award('writebetter',1); });
    on($('#btnShowStrong'),'click', () => { $('#strongBox').textContent = writingModels.strong; Speech.say(writingModels.strong); award('writestrong',1); });
    on($('#rpSelect'),'change', updateRoleplay);
    on($('#btnPlayPrompt'),'click', () => { const rp = roleplays[Number($('#rpSelect')?.value || 0)]; if(rp) Speech.say(rp.prompt); });
    on($('#btnPlayModel'),'click', () => { const rp = roleplays[Number($('#rpSelect')?.value || 0)]; if(rp) Speech.say(rp.model); });
    on($('#btnCompareAnswer'),'click', compareRoleplay);
    on($('#btnResetAll'),'click', resetAll);
    $$('.speak').forEach(btn => on(btn,'click', () => Speech.say(btn.dataset.say || '')));
    } catch (err) {
      const status = $('#jsStatus');
      if(status) status.textContent = 'JS: ❌ error';
      console.error(err);
    }
  }

  init();
})();
