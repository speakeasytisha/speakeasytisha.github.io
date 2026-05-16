(() => {
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => [...el.querySelectorAll(sel)];

  const vocab = [
    {cat:'procedure', icon:'🧾', word:'boarding pass', fr:'carte d’embarquement', def:'the document you show before boarding', ex:'Please show your boarding pass at the gate.'},
    {cat:'procedure', icon:'🛂', word:'passport', fr:'passeport', def:'the official document for international travel', ex:'May I see your passport, please?'},
    {cat:'procedure', icon:'🧍', word:'check in', fr:'s’enregistrer', def:'to register for your flight before boarding', ex:'Passengers check in before they go through security.'},
    {cat:'procedure', icon:'🧪', word:'security', fr:'contrôle de sécurité', def:'the place where bags and passengers are checked', ex:'Please go through security first.'},
    {cat:'procedure', icon:'🚪', word:'gate', fr:'porte d’embarquement', def:'the place where passengers wait to board the plane', ex:'Your flight leaves from gate 12.'},
    {cat:'procedure', icon:'🛫', word:'board the plane', fr:'embarquer dans l’avion', def:'to get on the plane', ex:'Passengers can board the plane now.'},
    {cat:'service', icon:'🙋', word:'Can I help you?', fr:'Puis-je vous aider ?', def:'a polite way to offer help', ex:'Can I help you with your bag?'},
    {cat:'service', icon:'👀', word:'May I see...?', fr:'Puis-je voir... ?', def:'a polite way to ask for a document', ex:'May I see your boarding pass, please?'},
    {cat:'service', icon:'🔎', word:'Let me check.', fr:'Laissez-moi vérifier.', def:'a polite way to say you will verify information', ex:'Let me check the gate number for you.'},
    {cat:'service', icon:'⏳', word:'Please wait here.', fr:'Veuillez attendre ici.', def:'a polite instruction to stay in one place', ex:'Please wait here for a moment.'},
    {cat:'service', icon:'💺', word:'Please take your seat.', fr:'Veuillez prendre votre siège.', def:'a polite instruction on the plane', ex:'Please take your seat now.'},
    {cat:'service', icon:'🔒', word:'Fasten your seat belt.', fr:'Attachez votre ceinture.', def:'an instruction for safety on the plane', ex:'Please fasten your seat belt before take-off.'},
  ];

  const mcqs = [
    {q:'A passenger is at the gate. What document do you ask for?', fr:'Un passager est à la porte. Quel document demandez-vous ?', choices:['May I see your boarding pass, please?','Please board the plane now.','Go through security again.'], a:0},
    {q:'A passenger looks lost. What is the best first sentence?', fr:'Un passager a l’air perdu. Quelle est la meilleure première phrase ?', choices:['Can I help you?','Passport. Gate 4.','Sit there now.'], a:0},
    {q:'You need to verify information. What do you say?', fr:'Vous devez vérifier une information. Que dites-vous ?', choices:['Let me check.','Fasten your seat belt.','Board the plane.'], a:0},
    {q:'You want a passenger to stay in one place. What do you say?', fr:'Vous voulez qu’un passager reste à un endroit. Que dites-vous ?', choices:['Please wait here.','Please take your seat belt.','Show me gate 8.'], a:0}
  ];

  const fills = [
    {sentence:'Please show your ______ pass at the gate.', fr:'Veuillez montrer votre ______ pass à la porte.', options:['boarding','security','waiting'], a:'boarding'},
    {sentence:'First, check in. Then, go through ______.', fr:'D’abord, enregistrez-vous. Ensuite, passez par la ______.', options:['security','seat belt','passport'], a:'security'},
    {sentence:'Your flight leaves from ______ 12.', fr:'Votre vol part de la ______ 12.', options:['gate','aisle','window'], a:'gate'},
    {sentence:'Please ______ your seat belt.', fr:'Veuillez ______ votre ceinture.', options:['fasten','board','show'], a:'fasten'}
  ];

  const sequenceTask = {
    prompt:'Put the airport steps in the correct order.',
    fr:'Mettez les étapes de l’aéroport dans le bon ordre.',
    target:['Check in','Go through security','Wait at the gate','Board the plane']
  };

  const buildTasks = [
    {prompt:'Build a polite question for a passenger.', fr:'Construisez une question polie pour un passager.', target:'May I see your passport, please?', tokens:['May','I','see','your','passport,','please?']},
    {prompt:'Build a clear instruction.', fr:'Construisez une instruction claire.', target:'Please go to gate 12 and wait there.', tokens:['Please','go','to','gate','12','and','wait','there.']}
  ];

  const scenarios = [
    {title:'Check-in desk', prompt:'A passenger arrives at the check-in desk. Ask for the passport and boarding pass politely.', promptFr:'Un passager arrive au comptoir d’enregistrement. Demandez le passeport et la carte d’embarquement poliment.', model:'Good morning. May I see your passport and boarding pass, please?', modelFr:'Bonjour. Puis-je voir votre passeport et votre carte d’embarquement, s’il vous plaît ?'},
    {title:'At the gate', prompt:'A passenger asks, “Where do I go now?” Guide the passenger clearly.', promptFr:'Un passager demande : « Où est-ce que je vais maintenant ? » Guidez le passager clairement.', model:'Please go to gate 8 and wait there. Boarding will start soon.', modelFr:'Veuillez aller à la porte 8 et attendre là. L’embarquement commencera bientôt.'},
    {title:'On the plane', prompt:'A passenger is standing with a bag. Tell the passenger what to do.', promptFr:'Un passager est debout avec un sac. Dites au passager quoi faire.', model:'Please put your bag in the overhead bin and take your seat.', modelFr:'Veuillez mettre votre sac dans le compartiment au-dessus et prendre votre siège.'},
    {title:'Small problem', prompt:'A passenger says, “I think I am at the wrong gate.” Reply politely and help.', promptFr:'Un passager dit : « Je pense que je suis à la mauvaise porte. » Répondez poliment et aidez.', model:'Let me check for you. Please wait here for a moment.', modelFr:'Laissez-moi vérifier pour vous. Veuillez attendre ici un moment.'}
  ];

  let score = 0;
  let scoreMax = mcqs.length + fills.length + 1 + buildTasks.length + 2;
  let usedMcq = 0;
  let usedFill = 0;
  let currentBuild = 0;
  let currentScenario = 0;
  const awarded = new Set();
  let voiceLang = 'en-US';

  function updateScore(){
    $('#scoreNow').textContent = score;
    $('#scoreMax').textContent = scoreMax;
    $('#progressBar').style.width = `${Math.round((score/scoreMax)*100)}%`;
  }

  function award(key, pts=1){
    if(awarded.has(key)) return;
    awarded.add(key);
    score += pts;
    updateScore();
  }

  function speak(text){
    if(!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voiceLang;
    const voices = speechSynthesis.getVoices();
    const pick = voices.find(v => v.lang === voiceLang) || voices.find(v => v.lang.startsWith('en'));
    if(pick) u.voice = pick;
    u.rate = 0.95;
    speechSynthesis.speak(u);
  }

  function stopAudio(){ if(window.speechSynthesis) speechSynthesis.cancel(); }

  function renderCards(filter='all'){
    const host = $('#cardGrid');
    host.innerHTML = '';
    vocab.filter(v => filter === 'all' || v.cat === filter).forEach(v => {
      const card = document.createElement('article');
      card.className = 'vcard';
      card.innerHTML = `
        <div class="vcard__inner">
          <div class="vface">
            <div>
              <div class="vtop">
                <div class="vicon">${v.icon}</div>
                <div class="vcat">${v.cat === 'procedure' ? 'Procedure' : 'Service'}</div>
              </div>
              <div class="vword">${v.word}</div>
              <div class="vfr">${v.fr}</div>
            </div>
            <div class="vtools">
              <button class="iconbtn speak-btn" type="button">🔊 Listen</button>
              <button class="iconbtn flip-btn" type="button">↺ Flip</button>
            </div>
          </div>
          <div class="vface vface--back">
            <div>
              <div class="vword">${v.word}</div>
              <div class="vdef">${v.def}</div>
              <div class="vexample">Example: ${v.ex}</div>
            </div>
            <div class="vtools">
              <button class="iconbtn speak-example" type="button">🔊 Example</button>
              <button class="iconbtn flip-btn" type="button">↺ Back</button>
            </div>
          </div>
        </div>`;
      card.addEventListener('click', e => {
        if(e.target.closest('button')) return;
        card.classList.toggle('is-flipped');
      });
      $('.speak-btn', card).addEventListener('click', e => { e.stopPropagation(); speak(v.word); });
      $('.speak-example', card).addEventListener('click', e => { e.stopPropagation(); speak(v.ex); });
      $$('.flip-btn', card).forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); card.classList.toggle('is-flipped'); }));
      host.appendChild(card);
    });
  }

  function renderMcq(){
    const item = mcqs[usedMcq % mcqs.length];
    const host = $('#mcqHost');
    host.innerHTML = `<h3>${item.q}</h3><p class="fr muted">${item.fr}</p>`;
    item.choices.forEach((c, i) => {
      const row = document.createElement('label');
      row.className = 'choice';
      row.innerHTML = `<input type="radio" name="mcq"><div>${c}</div>`;
      row.addEventListener('click', () => {
        const fb = document.createElement('div');
        fb.className = 'feedback ' + (i === item.a ? 'ok' : 'no');
        fb.innerHTML = i === item.a ? '✅ Correct!' : `❌ Better answer: <strong>${item.choices[item.a]}</strong>`;
        const old = $('.feedback', host); if(old) old.remove();
        host.appendChild(fb);
        if(i === item.a) award('mcq'+usedMcq);
      });
      host.appendChild(row);
    });
    const next = document.createElement('button');
    next.className = 'btn top-gap';
    next.textContent = 'Next situation';
    next.addEventListener('click', () => { usedMcq++; renderMcq(); });
    host.appendChild(next);
  }

  function renderFill(){
    const item = fills[usedFill % fills.length];
    const host = $('#fillHost');
    host.innerHTML = `<h3>${item.sentence}</h3><p class="fr muted">${item.fr}</p>`;
    item.options.forEach(opt => {
      const row = document.createElement('button');
      row.className = 'choice';
      row.type = 'button';
      row.innerHTML = `<div>${opt}</div>`;
      row.addEventListener('click', () => {
        const fb = document.createElement('div');
        fb.className = 'feedback ' + (opt === item.a ? 'ok' : 'no');
        fb.innerHTML = opt === item.a ? '✅ Correct!' : `❌ Correct answer: <strong>${item.a}</strong>`;
        const old = $('.feedback', host); if(old) old.remove();
        host.appendChild(fb);
        if(opt === item.a) award('fill'+usedFill);
      });
      host.appendChild(row);
    });
    const next = document.createElement('button');
    next.className = 'btn top-gap';
    next.textContent = 'Next sentence';
    next.addEventListener('click', () => { usedFill++; renderFill(); });
    host.appendChild(next);
  }

  function renderSequence(){
    const host = $('#sequenceHost');
    host.innerHTML = `<h3>${sequenceTask.prompt}</h3><p class="fr muted">${sequenceTask.fr}</p><div class="sequence-bank"></div><div class="answer-line" id="sequenceAnswer"></div><div class="smallrow top-gap"><button class="btn" id="btnCheckSequence" type="button">✅ Check order</button><button class="btn btn--ghost" id="btnResetSequence" type="button">↺ Reset</button></div><div class="feedback hidden" id="sequenceFeedback"></div>`;
    const bank = $('.sequence-bank', host);
    const answer = $('#sequenceAnswer', host);
    const shuffled = [...sequenceTask.target].sort(() => Math.random() - 0.5);
    shuffled.forEach(text => {
      const t = document.createElement('button');
      t.className = 'token';
      t.type = 'button';
      t.textContent = text;
      t.addEventListener('click', () => {
        if(t.classList.contains('used')) return;
        t.classList.add('used');
        const clone = document.createElement('span');
        clone.className = 'token';
        clone.textContent = text;
        clone.dataset.text = text;
        clone.addEventListener('click', () => {
          clone.remove();
          t.classList.remove('used');
        });
        answer.appendChild(clone);
      });
      bank.appendChild(t);
    });
    $('#btnResetSequence', host).addEventListener('click', () => renderSequence());
    $('#btnCheckSequence', host).addEventListener('click', () => {
      const built = $$('.token', answer).map(x => x.dataset.text || x.textContent);
      const ok = JSON.stringify(built) === JSON.stringify(sequenceTask.target);
      const fb = $('#sequenceFeedback', host);
      fb.className = 'feedback ' + (ok ? 'ok':'no');
      fb.classList.remove('hidden');
      fb.innerHTML = ok ? '✅ Correct order!' : `❌ Correct order: <strong>${sequenceTask.target.join(' → ')}</strong>`;
      if(ok) award('sequence');
    });
  }

  function renderBuild(){
    const task = buildTasks[currentBuild % buildTasks.length];
    const host = $('#builderHost');
    host.innerHTML = `<h3>${task.prompt}</h3><p class="fr muted">${task.fr}</p><div class="builder-bank"></div><div class="answer-line" id="buildAnswer"></div><div class="smallrow top-gap"><button class="btn" id="btnCheckBuild" type="button">✅ Check sentence</button><button class="btn btn--ghost" id="btnResetBuild" type="button">↺ Reset</button><button class="btn btn--ghost" id="btnNextBuild" type="button">➡️ Next task</button></div><div class="feedback hidden" id="buildFeedback"></div>`;
    const bank = $('.builder-bank', host);
    const answer = $('#buildAnswer', host);
    const shuffled = [...task.tokens].sort(() => Math.random() - 0.5);
    shuffled.forEach(text => {
      const t = document.createElement('button');
      t.className = 'token';
      t.type = 'button';
      t.textContent = text;
      t.addEventListener('click', () => {
        if(t.classList.contains('used')) return;
        t.classList.add('used');
        const clone = document.createElement('span');
        clone.className = 'token';
        clone.textContent = text;
        clone.dataset.text = text;
        clone.addEventListener('click', () => { clone.remove(); t.classList.remove('used'); });
        answer.appendChild(clone);
      });
      bank.appendChild(t);
    });
    $('#btnResetBuild', host).addEventListener('click', renderBuild);
    $('#btnNextBuild', host).addEventListener('click', () => { currentBuild++; renderBuild(); });
    $('#btnCheckBuild', host).addEventListener('click', () => {
      const built = $$('.token', answer).map(x => x.dataset.text || x.textContent).join(' ').replace(/\s+([,.!?])/g,'$1');
      const ok = built === task.target;
      const fb = $('#buildFeedback', host);
      fb.className = 'feedback ' + (ok ? 'ok' : 'no');
      fb.classList.remove('hidden');
      fb.innerHTML = ok ? `✅ Correct! <strong>${task.target}</strong>` : `❌ Better sentence: <strong>${task.target}</strong>`;
      if(ok) award('build'+currentBuild);
    });
  }

  function renderScenarios(){
    const select = $('#scenarioSelect');
    select.innerHTML = '';
    scenarios.forEach((s, i) => {
      const o = document.createElement('option');
      o.value = i;
      o.textContent = `${i+1}. ${s.title}`;
      select.appendChild(o);
    });
    function show(){
      const s = scenarios[currentScenario];
      $('#scenarioTitle').textContent = s.title;
      $('#scenarioPrompt').textContent = s.prompt;
      $('#scenarioPromptFr').textContent = s.promptFr;
      $('#modelText').textContent = s.model;
      $('#modelTextFr').textContent = s.modelFr;
    }
    select.addEventListener('change', e => { currentScenario = Number(e.target.value); show(); $('#modelBox').classList.add('hidden'); });
    $('#btnScenarioPlay').addEventListener('click', () => speak(scenarios[currentScenario].prompt));
    $('#btnShowModel').addEventListener('click', () => { $('#modelBox').classList.remove('hidden'); award('modelShown',1); });
    $('#btnPlayModel').addEventListener('click', () => speak(scenarios[currentScenario].model));
    show();
  }

  function setupWriting(){
    $('#btnShowWritingTips').addEventListener('click', () => {
      const fb = $('#writingFeedback');
      fb.className = 'feedback ok';
      fb.classList.remove('hidden');
      fb.innerHTML = '💡 Use 2 or 3 short sentences. Start with <strong>Please...</strong> or <strong>Can I...?</strong> Add one useful detail at the end.';
    });
    $('#btnCheckWriting').addEventListener('click', () => {
      const text = $('#writingBox').value.trim();
      const fb = $('#writingFeedback');
      let points = [];
      if(/please|can i|may i|let me/i.test(text)) points.push('polite phrase ✅');
      if(/gate|passport|boarding pass|seat|wait|security/i.test(text)) points.push('useful airport word ✅');
      if(/\.|!/g.test(text)) points.push('sentence punctuation ✅');
      const ok = points.length >= 2;
      fb.className = 'feedback ' + (ok ? 'ok' : 'no');
      fb.classList.remove('hidden');
      fb.innerHTML = ok ? `✅ Good start! You included: ${points.join(' · ')}` : '❌ Try to add a polite phrase and one airport word.';
      if(ok) award('writing',2);
    });
  }

  function attachUI(){
    $('#btnSpeakGoals').addEventListener('click', () => speak('Today you will learn airport procedures, passenger interactions, polite service language, and short airport roleplays.'));
    $('#btnStopAudio').addEventListener('click', stopAudio);
    $('#btnReset').addEventListener('click', () => location.reload());
    $('#voiceUS').addEventListener('click', () => { voiceLang='en-US'; $('#voiceUS').classList.add('is-on'); $('#voiceUK').classList.remove('is-on'); });
    $('#voiceUK').addEventListener('click', () => { voiceLang='en-GB'; $('#voiceUK').classList.add('is-on'); $('#voiceUS').classList.remove('is-on'); });
    $$('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(btn.dataset.filter);
    }));
  }

  attachUI();
  renderCards();
  renderMcq();
  renderFill();
  renderSequence();
  renderBuild();
  renderScenarios();
  setupWriting();
  updateScore();
})();
