(() => {
  'use strict';

  const state = {
    accent: 'en-AU',
    confidence: null,
    completed: new Set(),
    mcqScore: 0,
    currentSmallTalk: '',
    currentRole: '',
    timerSeconds: 180,
    timerId: null
  };

  const conversationPhrases = [
    {tag:'Buy time', text:"That's a good question. Let me think for a second."},
    {tag:'Clarify', text:"Just to make sure I understand, are you asking about my current situation or my previous role?"},
    {tag:'Give an example', text:"A concrete example would be..."},
    {tag:'Reformulate', text:"What I mean is that..."},
    {tag:'React', text:"That sounds like the kind of environment I'd enjoy working in."},
    {tag:'Continue', text:"And from there, the next step was..."},
    {tag:'Correct yourself', text:"Let me rephrase that."},
    {tag:'Ask back', text:"How does that usually work within your team?"}
  ];

  const vocab = {
    'Job search': [
      ['vacancy','offre / poste vacant','an available position that an employer wants to fill',"I saw a vacancy for a business process analyst in Melbourne."],
      ['shortlist','liste finale de candidats','the small group of candidates selected for the next stage',"I was shortlisted for a first-round interview."],
      ['selection criteria','critères de sélection','the skills and experience used to assess applicants',"I matched my examples to the selection criteria."],
      ['recruiter','recruteur / recruteuse','a person who finds and screens candidates',"A recruiter contacted me after seeing my profile."],
      ['referee','personne de référence','someone who can confirm your experience and work quality',"I can provide two professional referees if needed."],
      ['notice period','préavis','the time between resigning and leaving a job',"My notice period would not be an issue in my current situation."]
    ],
    'Process & analysis': [
      ['workflow','flux de travail','the sequence of steps used to complete a task',"I mapped the workflow to identify unnecessary steps."],
      ['stakeholder','partie prenante','a person or group affected by a project or decision',"I worked with stakeholders from several departments."],
      ['pain point','point de friction','a recurring problem or difficulty in a process',"We identified the main pain points before proposing changes."],
      ['streamline','rationaliser / simplifier','to make a process simpler and more efficient',"My role was to streamline the process without disrupting the teams."],
      ['roll out','déployer','to introduce a new process, tool or system to users',"We rolled out the new process gradually."],
      ['continuous improvement','amélioration continue','ongoing efforts to improve processes over time',"I enjoy roles that involve continuous improvement."]
    ],
    'Conversation': [
      ['follow-up question','question de relance','a question that continues and deepens a conversation',"I asked a follow-up question about the team structure."],
      ['to elaborate','développer','to give more detail or explanation',"I can elaborate on that if you'd like."],
      ['to clarify','clarifier','to make something easier to understand',"Could you clarify what you mean by operational ownership?"],
      ['to rephrase','reformuler','to say the same idea in a different way',"Let me rephrase that more clearly."],
      ['to come across as','donner l’impression de','to create a particular impression',"I want to come across as confident but natural."],
      ['rapport','bon contact / relation','a comfortable and positive connection with someone',"Small talk can help build rapport at the start of an interview."]
    ],
    'Australia workplace': [
      ['keen','motivé / partant','interested and enthusiastic',"I'd be keen to learn more about the role."],
      ['straightforward','direct / simple','clear and uncomplicated',"I prefer a straightforward way of working."],
      ['hands-on','pratique / concret','directly involved in practical work',"I enjoy being hands-on when a process needs to be tested."],
      ['fit','adéquation','how well a person matches a role, team or company',"The conversation helped us see whether there was a good fit."],
      ['work-life balance','équilibre vie pro / perso','the balance between work and personal life',"Work-life balance is one factor I will consider."],
      ['relocate','déménager pour un emploi','to move to a different place for work',"I'm open to relocating for the right opportunity."]
    ]
  };

  const smallTalkQuestions = [
    "So, what made you start looking at Australia?",
    "Have you been to Australia before?",
    "What kind of lifestyle are you hoping to have outside work?",
    "What do you enjoy doing when you're not working?",
    "What type of team do you work best in?",
    "What would make you excited to accept a role?",
    "How do you usually keep yourself productive during a transition?",
    "What have you learned from working in the same organisation for six years?"
  ];

  const roleQuestions = [
    "Hi, thanks for taking the call. Is now still a good time to speak?",
    "Could you give me a quick overview of your background?",
    "What has prompted you to look for opportunities in Australia?",
    "What kind of role are you hoping to find?",
    "Can you tell me about a process you improved and how you approached it?",
    "How do you deal with stakeholders who don't agree on the solution?",
    "You've been out of your previous role for a few months. How have you been using that time?",
    "What would your previous colleagues say you bring to a team?",
    "What questions do you have for me about the role or the company?"
  ];

  const mcqs = [
    {
      q:"Recruiter: ‘Your background looks relevant. Tell me a little more about what you actually did day to day.’",
      answers:[
        {t:"Of course. My role was mainly about understanding how processes worked in practice, identifying problems and working with the teams to improve them.", ok:true},
        {t:"I did many things. It is difficult to explain because it depends.", ok:false},
        {t:"My CV explains all my missions in detail.", ok:false}
      ], why:"Start with a clear summary, then add examples if the recruiter wants more detail."
    },
    {
      q:"Recruiter: ‘Why Australia rather than another country?’",
      answers:[
        {t:"Because France is not good for me anymore.", ok:false},
        {t:"I'm looking for both an international professional experience and a lifestyle change, and Australia is a place I've been seriously considering for both.", ok:true},
        {t:"I don't know exactly. I just want to try.", ok:false}
      ], why:"A forward-looking answer sounds stronger than criticising your current country or situation."
    },
    {
      q:"Recruiter: ‘Would you be comfortable working with people from very different teams?’",
      answers:[
        {t:"Yes, that's actually one of the parts of process work I enjoy most. I like understanding different viewpoints and finding a practical way forward.", ok:true},
        {t:"Yes, no problem.", ok:false},
        {t:"It depends on the people.", ok:false}
      ], why:"Answer the question and add evidence about how you work."
    },
    {
      q:"Recruiter: ‘I’m not sure I understood the last point. Could you explain it differently?’",
      answers:[
        {t:"I already explained it.", ok:false},
        {t:"Sure. Let me rephrase it. What I mean is that I focus on how the process works for the people who actually use it.", ok:true},
        {t:"My English is not perfect, sorry.", ok:false}
      ], why:"Reformulate directly. You do not need to apologise for your English."
    },
    {
      q:"Recruiter: ‘Do you have any questions for me?’",
      answers:[
        {t:"No, everything is clear.", ok:false},
        {t:"Yes. What would you want the person in this role to have achieved after the first six months?", ok:true},
        {t:"How many holidays do I get?", ok:false}
      ], why:"A thoughtful question shows interest in impact, expectations and fit."
    }
  ];

  const reformulations = [
    {from:"I was responsible to make processes better.", to:"I was responsible for improving processes and making them more efficient."},
    {from:"I want to go to Australia because I need change my life.", to:"I'm looking at Australia because I want a meaningful professional and personal change."},
    {from:"I am not working since three months.", to:"I've been between roles for the past three months, and I've been using the time to prepare for my next step."},
    {from:"I can adapt with everybody.", to:"I adapt well to different people, working styles and priorities."},
    {from:"I search a job where I can evolve.", to:"I'm looking for a role where I can keep developing and take on new challenges."},
    {from:"I made meetings with different services.", to:"I worked with different departments and facilitated meetings to align stakeholders."}
  ];

  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  function speak(text){
    if(!('speechSynthesis' in window)) return alert('Speech synthesis is not available in this browser.');
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = state.accent;
    const voices = speechSynthesis.getVoices();
    const exact = voices.find(v => v.lang === state.accent);
    const sameBase = voices.find(v => v.lang && v.lang.startsWith(state.accent.slice(0,2)));
    if(exact || sameBase) u.voice = exact || sameBase;
    u.rate = state.accent === 'en-AU' ? 0.94 : 0.96;
    speechSynthesis.speak(u);
  }

  function renderConversationPhrases(){
    $('#conversationPhrases').innerHTML = conversationPhrases.map(p => `
      <article class="phrase-card">
        <div class="tag">${p.tag}</div>
        <div class="phrase-row"><p>${p.text}</p><button class="listen-chip" type="button" aria-label="Listen" data-speak="${p.text.replaceAll('"','&quot;')}">🔊</button></div>
      </article>`).join('');
  }

  function renderVocab(category){
    $('#vocabCards').innerHTML = vocab[category].map(([word,fr,def,ex]) => `
      <article class="vocab-card">
        <h3>${word}<button class="listen-chip" type="button" aria-label="Listen to ${word}" data-speak="${ex.replaceAll('"','&quot;')}">🔊</button></h3>
        <p class="fr">${fr}</p>
        <p>${def}</p>
        <p class="example">“${ex}”</p>
      </article>`).join('');
  }

  function setupVocab(){
    const select = $('#vocabCategory');
    select.innerHTML = Object.keys(vocab).map(k => `<option>${k}</option>`).join('');
    renderVocab(select.value);
    select.addEventListener('change', e => renderVocab(e.target.value));
  }

  function newSmallTalk(){
    state.currentSmallTalk = smallTalkQuestions[Math.floor(Math.random()*smallTalkQuestions.length)];
    $('#smallTalkDeck').textContent = state.currentSmallTalk;
  }

  function renderMCQs(){
    state.mcqScore = 0;
    $('#mcqContainer').innerHTML = mcqs.map((item,i) => {
      const answers = shuffle(item.answers);
      return `<div class="mcq" data-index="${i}">
        <h3>${i+1}. ${item.q}</h3>
        <div class="answers">${answers.map(a => `<button class="answer" type="button" data-ok="${a.ok}">${a.t}</button>`).join('')}</div>
        <div class="feedback" aria-live="polite"></div>
      </div>`;
    }).join('');
  }

  function renderReformulations(){
    $('#reformulationContainer').innerHTML = reformulations.map((r,i)=>`
      <div class="reform-item">
        <p><strong>${i+1}. Improve this sentence:</strong></p>
        <div class="reform-target">${r.from}</div>
        <textarea placeholder="Your professional reformulation..."></textarea>
        <div class="button-row"><button type="button" class="btn secondary reveal-reform" data-i="${i}">Show model</button><button type="button" class="btn ghost speak-text" data-text="${r.to.replaceAll('"','&quot;')}">🔊 Listen to model</button></div>
        <div class="reveal hidden" id="reform-${i}">${r.to}</div>
      </div>`).join('');
  }

  function updateProgress(){
    const total = $$('[data-track="section"]').length;
    const pct = Math.round((state.completed.size / total) * 100);
    $('#progressBar').style.width = pct + '%';
    $('#progressText').textContent = pct + '%';
  }

  function buildPitch(){
    const parts = ['pitchA','pitchB','pitchC','pitchD'].map(id => $('#'+id).value.trim()).filter(Boolean);
    $('#pitchOutput').textContent = parts.length ? parts.join(' ') : 'Add at least one idea above to build your pitch.';
  }

  function newRoleQuestion(){
    const currentIndex = roleQuestions.indexOf(state.currentRole);
    let next = currentIndex < 0 ? 0 : currentIndex + 1;
    if(next >= roleQuestions.length) next = 0;
    state.currentRole = roleQuestions[next];
    $('#roleQuestion').textContent = state.currentRole;
  }

  function updateTimer(){
    const m = String(Math.floor(state.timerSeconds/60)).padStart(2,'0');
    const s = String(state.timerSeconds%60).padStart(2,'0');
    $('#timerDisplay').textContent = `${m}:${s}`;
  }

  function startTimer(){
    if(state.timerId) return;
    state.timerId = setInterval(()=>{
      state.timerSeconds--;
      updateTimer();
      if(state.timerSeconds <= 0){ clearInterval(state.timerId); state.timerId = null; speak('Time. Finish your final sentence.'); }
    },1000);
  }

  function pauseTimer(){ clearInterval(state.timerId); state.timerId = null; }
  function resetTimer(){ pauseTimer(); state.timerSeconds = 180; updateTimer(); }

  function downloadResults(){
    const total = $$('[data-track="section"]').length;
    const fields = ['transfer1','pitchOutput','careerBreak','smallTalkNotes','roleNotes','finalReflection','evaluationComment'];
    const content = [
      'ANTOINE · AUSTRALIA JOB SEARCH & CONVERSATION',
      'Interactive lesson results',
      '===========================================',
      `Completed sections: ${state.completed.size}/${total}`,
      `MCQ score: ${state.mcqScore}/${mcqs.length}`,
      `Confidence rating: ${state.confidence || 'not selected'}/5`,
      '',
      ...fields.flatMap(id => {
        const el = $('#'+id);
        const value = el ? (el.value ?? el.textContent).trim() : '';
        return [`${id}:`, value || '(blank)', ''];
      })
    ].join('\n');
    const blob = new Blob([content], {type:'text/plain;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Antoine_Australia_Job_Search_results.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function resetAll(){
    if(!confirm('Reset answers, scores and progress?')) return;
    $$('input, textarea').forEach(el=>el.value='');
    $$('.done-btn').forEach(b=>b.classList.remove('completed'));
    $$('.done-btn').forEach(b=>b.textContent='✓ Mark complete');
    $$('.models,.reveal').forEach(el=>el.classList.add('hidden'));
    $$('.rating button').forEach(b=>b.classList.remove('selected'));
    state.completed.clear(); state.confidence=null; state.mcqScore=0;
    $('#pitchOutput').textContent='Your pitch will appear here.';
    renderMCQs(); renderReformulations(); newSmallTalk(); state.currentRole=''; $('#roleQuestion').textContent='Click “Start / next question” when you are ready.';
    resetTimer(); updateProgress();
  }

  document.addEventListener('click', e => {
    const speakBtn = e.target.closest('[data-speak]');
    if(speakBtn) speak(speakBtn.dataset.speak);

    const textBtn = e.target.closest('.speak-text');
    if(textBtn) speak(textBtn.dataset.text);

    const targetBtn = e.target.closest('.speak-target');
    if(targetBtn){ const t = $('#'+targetBtn.dataset.target); if(t) speak(t.textContent); }

    const modelBtn = e.target.closest('.model-toggle');
    if(modelBtn){ const box = $('#'+modelBtn.dataset.model); box.classList.toggle('hidden'); modelBtn.textContent = box.classList.contains('hidden') ? 'Show two model answers' : 'Hide model answers'; }

    const done = e.target.closest('.done-btn');
    if(done){
      const section = done.closest('[data-track="section"]');
      const idx = $$('[data-track="section"]').indexOf(section);
      if(state.completed.has(idx)){ state.completed.delete(idx); done.classList.remove('completed'); done.textContent='✓ Mark complete'; }
      else { state.completed.add(idx); done.classList.add('completed'); done.textContent='✓ Completed'; }
      updateProgress();
    }

    const answer = e.target.closest('.answer');
    if(answer && !answer.closest('.mcq').dataset.answered){
      const mcq = answer.closest('.mcq');
      mcq.dataset.answered='1';
      const idx = Number(mcq.dataset.index);
      const ok = answer.dataset.ok === 'true';
      if(ok){ answer.classList.add('correct'); state.mcqScore++; }
      else { answer.classList.add('wrong'); const correct = $$('.answer',mcq).find(b=>b.dataset.ok==='true'); if(correct) correct.classList.add('correct'); }
      const fb = $('.feedback',mcq); fb.className='feedback '+(ok?'ok':'bad'); fb.textContent=(ok?'Correct. ':'Not quite. ')+mcqs[idx].why;
    }

    const reveal = e.target.closest('.reveal-reform');
    if(reveal) $('#reform-'+reveal.dataset.i).classList.toggle('hidden');

    const rating = e.target.closest('#confidenceRating button');
    if(rating){ $$('#confidenceRating button').forEach(b=>b.classList.remove('selected')); rating.classList.add('selected'); state.confidence=Number(rating.dataset.score); }
  });

  $('#accent').addEventListener('change',e=>state.accent=e.target.value);
  $('#toggleFrench').addEventListener('click',()=>{
    document.body.classList.toggle('show-french');
    const on = document.body.classList.contains('show-french');
    $('#toggleFrench').textContent = `🇫🇷 French help: ${on?'ON':'OFF'}`;
  });
  $('#buildPitch').addEventListener('click',buildPitch);
  $('#listenPitch').addEventListener('click',()=>speak($('#pitchOutput').textContent));
  $('#nextSmallTalk').addEventListener('click',newSmallTalk);
  $('#listenSmallTalk').addEventListener('click',()=>speak(state.currentSmallTalk || $('#smallTalkDeck').textContent));
  $('#nextRoleQuestion').addEventListener('click',newRoleQuestion);
  $('#listenRoleQuestion').addEventListener('click',()=>speak(state.currentRole || $('#roleQuestion').textContent));
  $('#startTimer').addEventListener('click',startTimer);
  $('#pauseTimer').addEventListener('click',pauseTimer);
  $('#resetTimer').addEventListener('click',resetTimer);
  $('#downloadResults').addEventListener('click',downloadResults);
  $('#resetLesson').addEventListener('click',resetAll);

  renderConversationPhrases();
  setupVocab();
  newSmallTalk();
  renderMCQs();
  renderReformulations();
  updateTimer();
  updateProgress();
})();
