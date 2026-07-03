(() => {
  const state = { score: 0, answered: new Set(), stream: null, recorder: null, chunks: [], audioUrl: null, sprint: null };
  const scoreEl = document.getElementById('score');
  const progressEl = document.getElementById('progressBar');
  const voiceSelect = document.getElementById('voiceSelect');

  function addScore(key, points = 10) {
    if (!state.answered.has(key)) {
      state.answered.add(key);
      state.score = Math.min(100, state.score + points);
      scoreEl.textContent = state.score;
      progressEl.style.width = `${state.score}%`;
    }
  }
  function normalize(value) {
    return value.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceSelect.value;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang === voiceSelect.value) || voices.find(v => v.lang.startsWith(voiceSelect.value.slice(0, 2)));
    if (preferred) utterance.voice = preferred;
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }
  document.querySelectorAll('.speak').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.speak || btn.textContent)));

  document.getElementById('checkMatches').addEventListener('click', () => {
    const selects = [...document.querySelectorAll('.match-select')];
    const correct = selects.filter(select => select.value === select.dataset.answer).length;
    const feedback = document.getElementById('matchFeedback');
    if (correct === selects.length) {
      feedback.textContent = 'Excellent. You have identified the strongest evidence for this role.';
      feedback.style.color = 'var(--green)';
      addScore('matches', 12);
    } else {
      feedback.textContent = `You have ${correct} of ${selects.length}. Look for evidence that combines transactions, stakeholders and commercial responsibility.`;
      feedback.style.color = 'var(--rose)';
    }
  });

  document.getElementById('buildStory').addEventListener('click', () => {
    const answer = [document.getElementById('storyNow').value, document.getElementById('storyEvidence').value, document.getElementById('storyNext').value].join(' ');
    const output = document.getElementById('storyOutput');
    output.textContent = answer;
    output.classList.add('show');
    addScore('story', 10);
  });

  document.querySelectorAll('.quick-check').forEach((block, index) => {
    const input = block.querySelector('input');
    const button = block.querySelector('button');
    const result = block.querySelector('span');
    const answers = block.dataset.answers.split('|').map(normalize);
    button.addEventListener('click', () => {
      const value = normalize(input.value);
      if (answers.includes(value)) {
        result.textContent = '✓ Correct — natural professional English.';
        result.style.color = 'var(--green)';
        addScore(`grammar${index}`, 7);
      } else {
        result.textContent = 'Try again. Read the model pattern above, then check the verb form carefully.';
        result.style.color = 'var(--rose)';
      }
    });
  });

  const vocab = [
    {cat:'Transactions', term:'acquisition', fr:'acquisition', def:'the purchase of a property or asset', ex:'The role includes supporting property acquisitions.'},
    {cat:'Transactions', term:'disposal', fr:'cession / vente d’un actif', def:'the sale of a property or asset', ex:'I have experience in transactions involving disposals.'},
    {cat:'Transactions', term:'due diligence', fr:'audit préalable / vérifications', def:'a structured review of legal, financial and practical risks before a transaction', ex:'Due diligence helps identify transaction risks before completion.'},
    {cat:'Investment', term:'portfolio management', fr:'gestion de portefeuille', def:'the management of a group of investments or properties', ex:'The role includes portfolio management and investor reporting.'},
    {cat:'Investment', term:'investor relations', fr:'relations investisseurs', def:'communication and relationship management with investors', ex:'Investor relations require clear and accurate communication.'},
    {cat:'Investment', term:'financing', fr:'financement', def:'the process of obtaining money for a project or transaction', ex:'Financing experience is an advantage for this position.'},
    {cat:'Stakeholders', term:'stakeholder', fr:'partie prenante', def:'a person or group affected by or involved in a project', ex:'I coordinated with internal and external stakeholders.'},
    {cat:'Stakeholders', term:'external adviser', fr:'conseil externe', def:'an outside specialist who provides professional advice', ex:'I worked closely with external advisers and notaries.'},
    {cat:'Stakeholders', term:'liaise with', fr:'faire le lien avec / coordonner avec', def:'to communicate and work closely with people or organisations', ex:'I liaised with lawyers, investors and operational teams.'},
    {cat:'Working style', term:'proactive', fr:'proactif / proactive', def:'taking action before problems develop', ex:'I take a proactive approach to risk prevention.'},
    {cat:'Working style', term:'pragmatic', fr:'pragmatique', def:'focused on practical and realistic solutions', ex:'I aim to provide pragmatic legal advice.'},
    {cat:'Working style', term:'business-oriented', fr:'orienté business', def:'focused on commercial objectives and practical value', ex:'My legal approach is business-oriented and client-focused.'}
  ];
  const category = document.getElementById('vocabCategory');
  const search = document.getElementById('vocabSearch');
  [...new Set(vocab.map(v=>v.cat))].forEach(cat => { const opt=document.createElement('option'); opt.value=cat; opt.textContent=cat; category.appendChild(opt); });
  function renderVocab(){
    const cat=category.value, q=normalize(search.value);
    const grid=document.getElementById('vocabGrid');
    const items=vocab.filter(v=>(cat==='all'||v.cat===cat)&&normalize(`${v.term} ${v.fr} ${v.def} ${v.ex}`).includes(q));
    grid.innerHTML=items.map(v=>`<article class="vocab-card"><span class="tag">${v.cat}</span><h3>${v.term}</h3><p class="fr">FR: ${v.fr}</p><p><strong>Meaning:</strong> ${v.def}</p><p><strong>Example:</strong> ${v.ex}</p><button class="speak" data-speak="${v.term}. ${v.ex.replace(/"/g,'&quot;')}">🔊 Listen</button></article>`).join('');
    grid.querySelectorAll('.speak').forEach(btn=>btn.addEventListener('click',()=>speak(btn.dataset.speak)));
  }
  category.addEventListener('change',renderVocab); search.addEventListener('input',renderVocab); renderVocab();

  const dutchOptions = [
    {text:'I do not speak Dutch, but I hope it will not be a problem.', correct:false},
    {text:'I am currently learning Dutch and I am committed to developing professional Dutch skills. In the meantime, I can contribute through my legal and commercial real estate experience and my English communication skills.', correct:true},
    {text:'I will only use French and English in the role.', correct:false}
  ];
  const dutchGrid = document.getElementById('dutchChoice');
  dutchOptions.forEach(opt=>{const b=document.createElement('button');b.className='choice-btn';b.textContent=opt.text;b.addEventListener('click',()=>{dutchGrid.querySelectorAll('button').forEach(x=>x.disabled=true);b.classList.add(opt.correct?'correct':'wrong');const fb=document.getElementById('dutchFeedback');fb.textContent=opt.correct?'✓ Exactly. It is honest, forward-looking and focused on your immediate value.':'Not quite. Choose an answer that is realistic, professional and focused on what you can contribute now.';fb.style.color=opt.correct?'var(--green)':'var(--rose)';if(opt.correct)addScore('dutch',8);});dutchGrid.appendChild(b);});

  const speaking = [
    {q:'Tell me about yourself.', b1:'I have worked in real estate for many years. I studied law and I have experience in legal work and sales management. I would like to work in the Netherlands.', b1p:'I am a real estate legal and commercial professional with over 24 years of experience in the French property sector. My background includes legal advisory work, contracts, risk analysis and sales management. I am now looking for a role in the Netherlands.', b2:'I am a real estate legal and commercial professional with over 24 years of experience in the French property sector. My background combines legal advisory work for major property developers, contract negotiation, risk analysis and sales management. I am now looking to bring this dual perspective to an international investment environment in the Netherlands.'},
    {q:'Why are you interested in this role?', b1:'I am interested because it is a real estate role with legal and business responsibilities.', b1p:'I am interested in this role because it combines real estate transactions, legal expertise and business responsibilities. These areas are close to my experience.', b2:'I am particularly interested in this role because it brings together real estate transactions, business strategy and stakeholder coordination. My legal and commercial background means I can contribute a practical perspective to both contractual and business decisions.'},
    {q:'How do you work with stakeholders?', b1:'I work with clients, lawyers and notaries. I listen and try to find solutions.', b1p:'I have worked with notaries, lawyers, investors and operational teams. I listen carefully, clarify priorities and try to find practical solutions.', b2:'I work best through clear communication, active listening and structured follow-up. I have coordinated with notaries, lawyers, investors and operational teams, and I aim to understand each stakeholder’s priorities while keeping the transaction objective clear.'}
  ];
  const speakingGrid = document.getElementById('speakingGrid');
  speaking.forEach((item,i)=>{
    const card=document.createElement('article');card.className='speaking-card';
    card.innerHTML=`<h3>${item.q}</h3><p>Choose a level, listen, then use the ideas — not every word.</p><div class="level-tabs"><button class="active" data-level="b1">B1</button><button data-level="b1p">B1+</button><button data-level="b2">B2</button></div><div class="speaking-model show">${item.b1}</div><button class="speak" data-speak="${item.b1}">🔊 Listen</button>`;
    const model=card.querySelector('.speaking-model'); const audio=card.querySelector('.speak');
    card.querySelectorAll('.level-tabs button').forEach(btn=>btn.addEventListener('click',()=>{card.querySelectorAll('.level-tabs button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const text=item[btn.dataset.level];model.textContent=text;audio.dataset.speak=text;addScore(`speaking${i}${btn.dataset.level}`,3);}));
    audio.addEventListener('click',()=>speak(audio.dataset.speak)); speakingGrid.appendChild(card);
  });

  document.querySelectorAll('.toggle-model').forEach(btn=>btn.addEventListener('click',()=>{const target=document.getElementById(btn.dataset.target);target.classList.toggle('show');btn.textContent=target.classList.contains('show')?'Hide model':'Show model';}));

  const startBtn=document.getElementById('startRecording'),stopBtn=document.getElementById('stopRecording'),clearBtn=document.getElementById('clearRecording'),status=document.getElementById('recordingStatus'),audio=document.getElementById('recordedAudio'),download=document.getElementById('downloadRecording');
  async function startRecording(){
    if(!navigator.mediaDevices||!window.MediaRecorder){status.textContent='Recording is not supported in this browser. You can still practise aloud with the timer.';return;}
    try{state.stream=await navigator.mediaDevices.getUserMedia({audio:true});state.chunks=[];state.recorder=new MediaRecorder(state.stream);state.recorder.ondataavailable=e=>{if(e.data.size)state.chunks.push(e.data)};state.recorder.onstop=()=>{const blob=new Blob(state.chunks,{type:'audio/webm'});if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);state.audioUrl=URL.createObjectURL(blob);audio.src=state.audioUrl;audio.hidden=false;download.href=state.audioUrl;download.hidden=false;clearBtn.disabled=false;status.textContent='Recording ready. Listen back, then try again with fewer cues.';status.className='recording-status';state.stream.getTracks().forEach(t=>t.stop());addScore('record',10);};state.recorder.start();startBtn.disabled=true;stopBtn.disabled=false;status.textContent='Recording… speak for 60–90 seconds.';status.className='recording-status recording';}catch(err){status.textContent='Please allow microphone access, then try again.';}}
  startBtn.addEventListener('click',startRecording);stopBtn.addEventListener('click',()=>{if(state.recorder&&state.recorder.state!=='inactive')state.recorder.stop();startBtn.disabled=false;stopBtn.disabled=true;});clearBtn.addEventListener('click',()=>{audio.hidden=true;audio.removeAttribute('src');download.hidden=true;clearBtn.disabled=true;if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);state.audioUrl=null;status.textContent='Recording cleared. Ready when you are.';});

  let sprintSeconds=480; const sprintTimer=document.getElementById('sprintTimer');
  function updateTimer(){const m=Math.floor(sprintSeconds/60).toString().padStart(2,'0');const s=(sprintSeconds%60).toString().padStart(2,'0');sprintTimer.textContent=`${m}:${s}`;}
  document.getElementById('startSprint').addEventListener('click',e=>{if(state.sprint){clearInterval(state.sprint);state.sprint=null;e.target.textContent='⏱ Start 8-minute sprint';return;}e.target.textContent='⏸ Pause sprint';state.sprint=setInterval(()=>{if(sprintSeconds>0){sprintSeconds--;updateTimer();}else{clearInterval(state.sprint);state.sprint=null;e.target.textContent='⏱ Start 8-minute sprint';alert('Time is up. Read your answer aloud once and underline your strongest sentence.');}},1000);}); updateTimer();

  document.getElementById('printBtn').addEventListener('click',()=>window.print());
  document.getElementById('resetBtn').addEventListener('click',()=>{if(confirm('Reset your progress and clear your writing?')) location.reload();});
})();
