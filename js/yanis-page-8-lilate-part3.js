(() => {
  const $ = (s, e=document) => e.querySelector(s);
  const $$ = (s, e=document) => Array.from(e.querySelectorAll(s));

  const state = { voice: 'en-US', score: 0, max: 24, awarded: new Set() };

  const flashcards = [
    {word:'boarding pass', fr:'carte d’embarquement', def:'the document you show before boarding', ex:'Please have your boarding pass ready.'},
    {word:'overhead bin', fr:'compartiment au-dessus des sièges', def:'the space above the seats for bags', ex:'Please place your bag in the overhead bin.'},
    {word:'seat belt', fr:'ceinture de sécurité', def:'the belt you fasten in your seat', ex:'You must fasten your seat belt.'},
    {word:'gate', fr:'porte d’embarquement', def:'the place where passengers board the aircraft', ex:'Please go to gate C4 now.'},
    {word:'connection', fr:'correspondance', def:'the next flight after the first flight', ex:'The passenger has a short connection.'},
    {word:'delay', fr:'retard', def:'extra waiting time before departure or arrival', ex:'I am sorry for the delay.'},
    {word:'follow', fr:'suivre', def:'to go behind a person or to do what they say', ex:'Please follow me.'},
    {word:'remain seated', fr:'rester assis', def:'to stay in your seat', ex:'Please remain seated.'},
    {word:'immediately', fr:'immédiatement', def:'right now, without waiting', ex:'Please go to the gate immediately.'},
    {word:'procedure', fr:'procédure', def:'the steps you must follow', ex:'I will explain the procedure.'},
    {word:'assist', fr:'aider / assister', def:'to help a person in a professional way', ex:'I can assist you if you need help.'},
    {word:'announcement', fr:'annonce', def:'official spoken information', ex:'Please wait for the next announcement.'}
  ];

  const fillA = [
    {prompt:'You ______ fasten your seat belt during take-off.', choices:['must','can','usually'], answer:'must', key:'fa1'},
    {prompt:'Please ______ your boarding pass ready.', choices:['have','having','has'], answer:'have', key:'fa2'},
    {prompt:'You ______ keep this large bag in the cabin.', choices:["can't",'can','must'], answer:"can't", key:'fa3'},
    {prompt:'First, show your passport. ______, go to the gate.', choices:['Then','Because','Sometimes'], answer:'Then', key:'fa4'}
  ];

  const fillB = [
    {prompt:'Complete the best instruction: Please ______ your bag under the seat.', choices:['place','placing','placed'], answer:'place', key:'fb1'},
    {prompt:'Complete the best procedure word: ______, listen to the crew instructions.', choices:['Finally','First','Often'], answer:'First', key:'fb2'},
    {prompt:'Complete the best obligation: You ______ follow the crew instructions.', choices:['have to','are have to','having to'], answer:'have to', key:'fb3'},
    {prompt:'Complete the best support sentence: If you need help, I can ______ you.', choices:['assist','assisting','assists'], answer:'assist', key:'fb4'}
  ];

  const listenQs = [
    {prompt:'What is the new gate?', choices:['C4','B12','A7'], answer:'C4', key:'l1'},
    {prompt:'What is the passenger worried about?', choices:['a short connection','a meal','a taxi'], answer:'a short connection', key:'l2'},
    {prompt:'What must the passenger keep ready?', choices:['passport and boarding pass','luggage and coffee','phone and money'], answer:'passport and boarding pass', key:'l3'}
  ];

  const roleplays = [
    {
      title:'Scenario 1 — Gate change',
      prompt:'A passenger is worried because the gate has changed. Explain what the passenger has to do.',
      promptFr:'Un passager est inquiet parce que la porte d’embarquement a changé. Expliquez ce qu’il doit faire.',
      model:'Please go to gate C4 immediately. You have a short connection, so please keep your passport and boarding pass ready. If you need help, I can assist you.',
      modelFr:'Veuillez aller immédiatement à la porte C4. Vous avez une correspondance courte, donc veuillez garder votre passeport et votre carte d’embarquement prêts. Si vous avez besoin d’aide, je peux vous aider.',
      words:['please','go to the gate','immediately','passport','boarding pass','short connection']
    },
    {
      title:'Scenario 2 — Cabin bag problem',
      prompt:'A passenger has a cabin bag that is too large. Explain the next steps politely.',
      promptFr:'Un passager a un bagage cabine trop grand. Expliquez poliment les étapes suivantes.',
      model:'I understand. This bag is too large for the cabin. First, please come with me. Then, we will check the bag. After that, you can keep your passport and boarding pass with you.',
      modelFr:'Je comprends. Ce bagage est trop grand pour la cabine. D’abord, veuillez venir avec moi. Ensuite, nous allons enregistrer le bagage. Après cela, vous pouvez garder votre passeport et votre carte d’embarquement avec vous.',
      words:['too large','please come with me','check the bag','keep with you']
    },
    {
      title:'Scenario 3 — Boarding procedure',
      prompt:'A passenger asks: “What do I do now?” Explain the boarding procedure in a simple order.',
      promptFr:'Un passager demande : « Que dois-je faire maintenant ? » Expliquez la procédure d’embarquement dans un ordre simple.',
      model:'First, show your boarding pass. Then, go to the gate. After that, place your bag in the overhead bin. Finally, take your seat and fasten your seat belt.',
      modelFr:'D’abord, montrez votre carte d’embarquement. Puis allez à la porte. Après cela, placez votre sac dans le compartiment au-dessus des sièges. Enfin, prenez votre place et attachez votre ceinture.',
      words:['first','then','after that','finally','fasten your seat belt']
    }
  ];

  function updateScore() {
    $('#scoreNow').textContent = state.score;
    $('#scoreMax').textContent = state.max;
    $('#progressBar').style.width = `${Math.round((state.score / state.max) * 100)}%`;
  }

  function award(key, points=1){
    if(state.awarded.has(key)) return;
    state.awarded.add(key);
    state.score += points;
    updateScore();
  }

  const Speech = {
    speak(text){
      if(!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text||''));
      u.lang = state.voice;
      const voices = window.speechSynthesis.getVoices();
      let v = voices.find(x => (x.lang||'').toLowerCase() === state.voice.toLowerCase())
        || voices.find(x => (x.lang||'').toLowerCase().startsWith(state.voice.toLowerCase()))
        || voices.find(x => (x.lang||'').toLowerCase().startsWith('en'));
      if(v) u.voice = v;
      u.rate = 0.96;
      window.speechSynthesis.speak(u);
    },
    pause(){ if('speechSynthesis' in window) window.speechSynthesis.pause(); },
    resume(){ if('speechSynthesis' in window) window.speechSynthesis.resume(); },
    stop(){ if('speechSynthesis' in window) window.speechSynthesis.cancel(); }
  };

  function setVoice(mode){
    state.voice = mode;
    $('#voiceUS').classList.toggle('is-on', mode==='en-US');
    $('#voiceUK').classList.toggle('is-on', mode==='en-GB');
    $('#voiceUS').setAttribute('aria-pressed', mode==='en-US');
    $('#voiceUK').setAttribute('aria-pressed', mode==='en-GB');
  }

  function wireSpeakButtons(){
    $$('.speak').forEach(btn => btn.addEventListener('click', () => Speech.speak(btn.dataset.say || btn.textContent.trim())));
  }

  function renderFlashcards(){
    const host = $('#flashGrid');
    host.innerHTML = '';
    flashcards.forEach(card => {
      const el = document.createElement('article');
      el.className = 'flashcard';
      el.innerHTML = `
        <div class="fcTop"><div class="fcWord">${card.word}</div><button class="iconbtn" type="button">🔊</button></div>
        <div class="fcDef"><strong>FR:</strong> ${card.fr}</div>
        <div class="fcDef"><strong>Definition:</strong> ${card.def}</div>
        <div class="fcEx"><strong>Example:</strong> ${card.ex}</div>
      `;
      el.querySelector('button').addEventListener('click', () => Speech.speak(`${card.word}. ${card.ex}`));
      host.appendChild(el);
    });
  }

  function renderChoiceSet(items, hostId){
    const host = $(hostId);
    host.innerHTML = '<div class="choiceBlock"></div>';
    const block = $('.choiceBlock', host);
    items.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'qcard';
      const shuffled = [...q.choices].sort(() => Math.random() - 0.5);
      card.innerHTML = `<div class="qprompt">${idx+1}. ${q.prompt}</div><div class="choiceRow"></div><div class="feedback hidden"></div>`;
      const row = $('.choiceRow', card);
      const fb = $('.feedback', card);
      shuffled.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice';
        btn.type = 'button';
        btn.textContent = choice;
        btn.addEventListener('click', () => {
          const ok = choice === q.answer;
          fb.classList.remove('hidden','ok','no');
          fb.classList.add(ok ? 'ok' : 'no');
          fb.innerHTML = ok ? '✅ Correct!' : `❌ Not quite. Best answer: <strong>${q.answer}</strong>`;
          if(ok) award(q.key, 1);
        });
        row.appendChild(btn);
      });
      block.appendChild(card);
    });
  }

  function initSequenceWrite(){
    $('#btnSeqCheck').addEventListener('click', () => {
      const txt = ($('#seqWrite').value || '').toLowerCase();
      const fb = $('#seqFb');
      const ok = txt.includes('first') && txt.includes('after that') && txt.includes('finally');
      fb.classList.remove('hidden','ok','no');
      fb.classList.add(ok ? 'ok' : 'no');
      fb.innerHTML = ok ? '✅ Good! You used the key sequence markers.' : '❌ You need the missing sequence words: <strong>First / After that / Finally</strong>.';
      if(ok) award('seqwrite', 2);
    });
    $('#btnSeqModel').addEventListener('click', () => {
      const fb = $('#seqFb');
      fb.classList.remove('hidden','ok','no');
      fb.classList.add('ok');
      fb.innerHTML = '<strong>Model:</strong> First, show your boarding pass. Then, go to the gate. After that, take your seat. Finally, fasten your seat belt.';
    });
  }

  function renderListenQuestions(){
    const host = $('#listenQs1');
    host.innerHTML = '<div class="choiceBlock"></div>';
    const block = $('.choiceBlock', host);
    listenQs.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'qcard';
      const shuffled = [...q.choices].sort(() => Math.random() - 0.5);
      card.innerHTML = `<div class="qprompt">${idx+1}. ${q.prompt}</div><div class="choiceRow"></div><div class="feedback hidden"></div>`;
      const row = $('.choiceRow', card);
      const fb = $('.feedback', card);
      shuffled.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice';
        btn.type = 'button';
        btn.textContent = choice;
        btn.addEventListener('click', () => {
          const ok = choice === q.answer;
          fb.classList.remove('hidden','ok','no');
          fb.classList.add(ok ? 'ok' : 'no');
          fb.innerHTML = ok ? '✅ Correct!' : `❌ Best answer: <strong>${q.answer}</strong>`;
          if(ok) award(q.key, 1);
        });
        row.appendChild(btn);
      });
      block.appendChild(card);
    });
  }

  function initWriting(){
    $('#btnWriteCheck').addEventListener('click', () => {
      const text = ($('#writeOwn').value || '').toLowerCase();
      const fb = $('#writeFb');
      const checks = [
        {ok: text.includes('please'), msg:'Use <strong>please</strong> for a polite instruction.'},
        {ok: /gate|passport|boarding pass/.test(text), msg:'Add an important detail such as <strong>gate / passport / boarding pass</strong>.'},
        {ok: /can|need|must|have to/.test(text), msg:'Add a support or instruction verb such as <strong>can / need / must / have to</strong>.'}
      ];
      const score = checks.filter(x => x.ok).length;
      fb.classList.remove('hidden','ok','no');
      if(score >= 2){
        fb.classList.add('ok');
        fb.innerHTML = '✅ Good direction!<br>' + checks.map(x => `${x.ok ? '✔️' : '➕'} ${x.msg}`).join('<br>');
        award('writing', 3);
      } else {
        fb.classList.add('no');
        fb.innerHTML = '❌ Add more key elements.<br>' + checks.map(x => `${x.ok ? '✔️' : '➕'} ${x.msg}`).join('<br>');
      }
    });
    $('#btnWriteModel').addEventListener('click', () => {
      const fb = $('#writeFb');
      fb.classList.remove('hidden','ok','no');
      fb.classList.add('ok');
      fb.innerHTML = '<strong>Stronger model:</strong> Please go to gate C4 immediately. You have a short connection, so please keep your passport and boarding pass ready. If you need help, I can assist you.';
    });
  }

  function initRoleplays(){
    const sel = $('#roleSelect');
    roleplays.forEach((r, i) => {
      const o = document.createElement('option');
      o.value = String(i);
      o.textContent = r.title;
      sel.appendChild(o);
    });
    function renderRole(){
      const r = roleplays[Number(sel.value) || 0];
      $('#rolePrompt').textContent = r.prompt;
      $('#rolePromptFr').textContent = r.promptFr;
      $('#roleModelBox').textContent = 'Click “Show model answer” to compare.';
      $('#roleModelFr').textContent = '';
      $('#roleAnswer').value = '';
      $('#roleFb').classList.add('hidden');
    }
    sel.addEventListener('change', renderRole);
    $('#btnRolePrompt').addEventListener('click', () => {
      const r = roleplays[Number(sel.value) || 0];
      Speech.speak(r.prompt);
    });
    $('#btnRoleModel').addEventListener('click', () => {
      const r = roleplays[Number(sel.value) || 0];
      Speech.speak(r.model);
    });
    $('#btnRoleShowModel').addEventListener('click', () => {
      const r = roleplays[Number(sel.value) || 0];
      $('#roleModelBox').textContent = r.model;
      $('#roleModelBox').classList.add('visible');
      $('#roleModelFr').textContent = r.modelFr;
    });
    $('#btnRoleCheck').addEventListener('click', () => {
      const r = roleplays[Number(sel.value) || 0];
      const txt = ($('#roleAnswer').value || '').toLowerCase();
      const fb = $('#roleFb');
      const found = r.words.filter(w => txt.includes(w.toLowerCase()));
      fb.classList.remove('hidden','ok','no');
      if(found.length >= 2){
        fb.classList.add('ok');
        fb.innerHTML = `✅ Good! You used some key ideas: <strong>${found.join(', ')}</strong>.`;
        award('role'+sel.value, 3);
      } else {
        fb.classList.add('no');
        fb.innerHTML = `❌ Add more key ideas: <strong>${r.words.join(', ')}</strong>.`;
      }
    });
    renderRole();
  }

  function resetAll(){
    state.score = 0;
    state.awarded.clear();
    updateScore();
    $$('.feedback').forEach(x => { x.className = 'feedback hidden'; x.innerHTML = ''; });
    $$('textarea').forEach(t => t.value = '');
    $('#roleModelBox').textContent = 'Click “Show model answer” to compare.';
    $('#roleModelBox').classList.remove('visible');
    $('#roleModelFr').textContent = '';
    renderChoiceSet(fillA, '#fillHostA');
    renderChoiceSet(fillB, '#fillHostB');
    renderListenQuestions();
  }

  function init(){
    $('#jsStatus').textContent = 'JS: ✅ loaded';
    updateScore();
    setVoice('en-US');
    $('#voiceUS').addEventListener('click', () => setVoice('en-US'));
    $('#voiceUK').addEventListener('click', () => setVoice('en-GB'));
    $('#btnPause').addEventListener('click', () => Speech.pause());
    $('#btnResume').addEventListener('click', () => Speech.resume());
    $('#btnStop').addEventListener('click', () => Speech.stop());
    $('#btnResetAll').addEventListener('click', resetAll);
    $('#btnStart').addEventListener('click', () => $('#main').scrollIntoView({behavior:'smooth'}));
    $('#btnMsg1').addEventListener('click', () => Speech.speak($('#msg1Text').textContent));

    wireSpeakButtons();
    renderFlashcards();
    renderChoiceSet(fillA, '#fillHostA');
    renderChoiceSet(fillB, '#fillHostB');
    initSequenceWrite();
    renderListenQuestions();
    initWriting();
    initRoleplays();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
