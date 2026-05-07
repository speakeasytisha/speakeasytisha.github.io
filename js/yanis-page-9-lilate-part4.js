(() => {
  const $ = (s, e=document) => e.querySelector(s);
  const $$ = (s, e=document) => Array.from(e.querySelectorAll(s));

  const state = { voice: 'en-US', score: 0, max: 20, awarded: new Set() };

  const flashcards = [
    {word:'departure', fr:'départ', def:'the moment a flight leaves', ex:'The departure time is 18:20.'},
    {word:'arrival', fr:'arrivée', def:'the moment a flight arrives', ex:'The arrival time is 20:05.'},
    {word:'boarding time', fr:'heure d’embarquement', def:'the time passengers start boarding', ex:'The boarding time is 17:40.'},
    {word:'gate', fr:'porte d’embarquement', def:'the place where you board the aircraft', ex:'Please go to gate C4.'},
    {word:'delay', fr:'retard', def:'extra waiting time before departure', ex:'There is a delay of twenty minutes.'},
    {word:'connection', fr:'correspondance', def:'the next flight after the first one', ex:'The passenger has a short connection.'},
    {word:'notice', fr:'notice / information', def:'a short text with important information', ex:'Please read the passenger notice carefully.'},
    {word:'allowance', fr:'franchise / autorisation', def:'the amount that is permitted', ex:'The cabin bag allowance is one small bag.'},
    {word:'aisle seat', fr:'siège côté allée', def:'a seat next to the aisle', ex:'The passenger prefers an aisle seat.'},
    {word:'window seat', fr:'siège côté fenêtre', def:'a seat next to the window', ex:'There is one window seat available.'},
    {word:'document', fr:'document', def:'a written support with information', ex:'This document explains the next steps.'},
    {word:'available', fr:'disponible', def:'ready to use or possible to get', ex:'There are no seats available now.'}
  ];

  const fillA = [
    {prompt:'_______ is the new gate?', choices:['Where','Why','Who'], answer:'Where', key:'fa1'},
    {prompt:'There ______ a twenty-minute delay.', choices:['is','are','be'], answer:'is', key:'fa2'},
    {prompt:'The passenger has a short connection, ______ he must go to desk B2.', choices:['so','but','who'], answer:'so', key:'fa3'},
    {prompt:'_______ is the passenger worried? Because he may miss the next flight.', choices:['Why','When','Where'], answer:'Why', key:'fa4'}
  ];

  const fillB = [
    {prompt:'There ______ two important details in this message.', choices:['are','is','am'], answer:'are', key:'fb1'},
    {prompt:'The gate has changed ______ of the delay.', choices:['because','so','who'], answer:'because', key:'fb2'},
    {prompt:'What should the passenger do ______?', choices:['next','careful','there'], answer:'next', key:'fb3'},
    {prompt:'The passenger is worried, ______ the instructions are clear.', choices:['but','where','when'], answer:'but', key:'fb4'}
  ];

  const readQs = [
    {prompt:'What is the destination?', choices:['Paris','London','Rome'], answer:'Paris', key:'r1'},
    {prompt:'What is the new gate?', choices:['C4','B2','A1'], answer:'C4', key:'r2'},
    {prompt:'How long is the delay?', choices:['20 minutes','10 minutes','40 minutes'], answer:'20 minutes', key:'r3'},
    {prompt:'Where should passengers with a short connection go?', choices:['desk B2','gate C4','security A1'], answer:'desk B2', key:'r4'}
  ];

  const listenQs = [
    {prompt:'What is the gate now?', choices:['C4','A9','B12'], answer:'C4', key:'l1'},
    {prompt:'Why is the flight delayed?', choices:['weather conditions','a strike','technical work'], answer:'weather conditions', key:'l2'},
    {prompt:'What must passengers keep ready?', choices:['passport and boarding pass','meal voucher and ticket','phone and coat'], answer:'passport and boarding pass', key:'l3'}
  ];

  const roleplays = [
    {
      title:'Scenario 1 — Explain a notice to a passenger',
      prompt:'Read the notice and explain the main information to the passenger.',
      promptFr:'Lisez la notice et expliquez les informations principales au passager.',
      model:'Your flight to Paris is delayed by twenty minutes because of the weather. Please go to gate C4 and keep your passport and boarding pass ready.',
      modelFr:'Votre vol pour Paris a vingt minutes de retard à cause de la météo. Veuillez aller à la porte C4 et garder votre passeport et votre carte d’embarquement prêts.',
      words:['delay','because of the weather','gate C4','passport','boarding pass']
    },
    {
      title:'Scenario 2 — Help a passenger with a short connection',
      prompt:'A passenger says: “I am worried about my connection.” Read the support and answer clearly.',
      promptFr:'Un passager dit : « Je suis inquiet pour ma correspondance. » Lisez le support et répondez clairement.',
      model:'I understand. You have a short connection, so please go to desk B2 now. They will help you with the next steps.',
      modelFr:'Je comprends. Vous avez une correspondance courte, donc veuillez aller maintenant au comptoir B2. Ils vous aideront pour la suite.',
      words:['short connection','go to desk B2','next steps','help you']
    },
    {
      title:'Scenario 3 — Describe the support like a future steward',
      prompt:'Describe the document using there is / there are and then explain what the passenger should do.',
      promptFr:'Décrivez le document avec there is / there are puis expliquez ce que le passager doit faire.',
      model:'There is a delay and there is a new gate. There are two important actions: go to gate C4 and keep your documents ready.',
      modelFr:'Il y a un retard et une nouvelle porte. Il y a deux actions importantes : aller à la porte C4 et garder vos documents prêts.',
      words:['there is','there are','important actions','go to gate C4','documents ready']
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
        || voices.find(x => (x.lang||'').toLowerCase().startsWith(state.voice.toLowerCase().slice(0,2)))
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

  function shuffled(arr){ return [...arr].sort(() => Math.random() - 0.5); }

  function renderChoiceSet(items, hostId){
    const host = $(hostId);
    host.innerHTML = '';
    items.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'qcard';
      const opts = shuffled(q.choices);
      card.innerHTML = `<div class="qprompt">${idx+1}. ${q.prompt}</div><div class="choiceRow"></div><div class="feedback hidden"></div>`;
      const row = $('.choiceRow', card);
      const fb = $('.feedback', card);
      opts.forEach(choice => {
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
      host.appendChild(card);
    });
  }

  function renderRoleplays(){
    const host = $('#roleplayHost');
    host.innerHTML = '';
    roleplays.forEach((r, idx) => {
      const card = document.createElement('div');
      card.className = 'roleCard';
      card.innerHTML = `
        <div class="card__head"><h3>${idx+1}. ${r.title}</h3><button class="iconbtn" type="button">🔊 Prompt</button></div>
        <div class="promptBox">${r.prompt}<div class="fr tiny topSpace">${r.promptFr}</div></div>
        <div class="roleWords">${r.words.map(w => `<span class="chip">${w}</span>`).join('')}</div>
        <div class="topSpace smallBtns">
          <button class="btn btn--ghost showModel" type="button">👀 Show model answer</button>
          <button class="btn btn--ghost playModel" type="button">🔊 Listen model</button>
        </div>
        <div class="modelBox hidden">${r.model}<div class="fr tiny topSpace">${r.modelFr}</div></div>
      `;
      card.querySelector('.iconbtn').addEventListener('click', () => Speech.speak(r.prompt));
      card.querySelector('.showModel').addEventListener('click', (e) => {
        const box = $('.modelBox', card);
        box.classList.toggle('hidden');
        box.classList.toggle('visible');
        e.currentTarget.textContent = box.classList.contains('hidden') ? '👀 Show model answer' : '🙈 Hide model answer';
        if(!box.classList.contains('hidden')) award(`role:${idx}`, 1);
      });
      card.querySelector('.playModel').addEventListener('click', () => Speech.speak(r.model));
      host.appendChild(card);
    });
  }

  function resetAll(){
    state.score = 0;
    state.awarded.clear();
    updateScore();
    setVoice('en-US');
    renderChoiceSet(fillA, '#fillA');
    renderChoiceSet(fillB, '#fillB');
    renderChoiceSet(readQs, '#readQs');
    renderChoiceSet(listenQs, '#listenQs');
    renderRoleplays();
    $$('.textarea').forEach(t => t.value = '');
    Speech.stop();
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function init(){
    $('#jsStatus').textContent = 'JS: ready';
    updateScore();
    wireSpeakButtons();
    renderFlashcards();
    renderChoiceSet(fillA, '#fillA');
    renderChoiceSet(fillB, '#fillB');
    renderChoiceSet(readQs, '#readQs');
    renderChoiceSet(listenQs, '#listenQs');
    renderRoleplays();

    $('#voiceUS').addEventListener('click', () => setVoice('en-US'));
    $('#voiceUK').addEventListener('click', () => setVoice('en-GB'));
    $('#btnPause').addEventListener('click', () => Speech.pause());
    $('#btnResume').addEventListener('click', () => Speech.resume());
    $('#btnStop').addEventListener('click', () => Speech.stop());
    $('#btnResetAll').addEventListener('click', resetAll);
    $('#btnStart').addEventListener('click', () => document.querySelector('.shell').scrollIntoView({behavior:'smooth'}));
    $('#btnAnnounce').addEventListener('click', () => {
      Speech.speak('Attention please. Flight AF 438 to Paris is delayed by twenty minutes because of the weather. Boarding will now begin at gate C4. Passengers with a short connection should go to desk B2. Please keep your passport and boarding pass ready.');
    });
    $('#btnShowTranscript').addEventListener('click', () => {
      const box = $('#announceTranscript');
      if(!box) return;
      box.classList.toggle('hidden');
      box.classList.toggle('visible');
      $('#btnShowTranscript').textContent = box.classList.contains('hidden') ? '👀 Show transcript' : '🙈 Hide transcript';
    });
  }

  window.addEventListener('DOMContentLoaded', init);
})();
