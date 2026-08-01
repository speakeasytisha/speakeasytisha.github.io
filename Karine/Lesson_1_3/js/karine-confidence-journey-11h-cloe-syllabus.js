(function(){
  'use strict';

  const sessions = [
    {
      n:'1', time:'2h', title:'Speaking Confidence Reset',
      goal:'Speak again without feeling overwhelmed. You reuse what you already know in short, clear answers.',
      tags:['routine','past','future','confidence'],
      speaking:'Answer everyday questions: typical day, Mondays, last weekend, this week, future plans.',
      writing:'Write one short personal message about your day or week.',
      challenge:'Answer 10 questions aloud with: answer + detail + time expression.'
    },
    {
      n:'2', time:'2h', title:'Question Detective',
      goal:'Learn to spot the key words that tell you which tense to use.',
      tags:['tense clues','questions','automatic answers'],
      speaking:'Hear a question, find the clue, choose the tense, answer aloud.',
      writing:'Transform clues into short answers: usually, now, yesterday, tomorrow, ever, for, since.',
      challenge:'Explain why you chose the tense in simple English or French.'
    },
    {
      n:'3', time:'2h', title:'Ask Me Questions',
      goal:'Become more active in conversation by asking the teacher questions.',
      tags:['role reversal','do/does/did','have you ever'],
      speaking:'Ask questions about routines, past activities, future plans, preferences and experiences.',
      writing:'Write 8 useful questions, then ask them without reading.',
      challenge:'Be the examiner for 5 minutes.'
    },
    {
      n:'4', time:'2h', title:'Real-Life Messages',
      goal:'Write short practical SMS and emails, then say them aloud as roleplays.',
      tags:['SMS','emails','hotel','restaurant','salon'],
      speaking:'Turn a written message into a real conversation.',
      writing:'Confirm an appointment, change a time, book a table, ask for hotel/campsite information.',
      challenge:'Choose one scenario, write it, say it, then answer follow-up questions.'
    },
    {
      n:'5', time:'2h', title:'Listen & Repair',
      goal:'Feel safer when you do not understand everything.',
      tags:['listening','repeat','spell','confirm'],
      speaking:'Use repair phrases: repeat, slow down, spell, confirm, check information.',
      writing:'Write a short confirmation after listening to details.',
      challenge:'Handle a phone call, ask for repetition, and confirm the appointment.'
    },
    {
      n:'6', time:'1h', title:'Final CLOE Confidence Practice',
      goal:'Put everything together in a mini oral and written mock.',
      tags:['mini mock','feedback','next steps'],
      speaking:'Personal introduction, questions, roleplay, opinion and final confidence recording.',
      writing:'One short CLOE-style message with a model and correction.',
      challenge:'Finish with your personal success plan for the exam.'
    }
  ];

  const clueQuestions = [
    {q:'What do you usually do on Mondays?', answer:'Present simple', clue:'usually / on Mondays', hint:'This is a routine or habit. Look for “usually” and “on Mondays”.'},
    {q:'What are you doing now?', answer:'Present continuous', clue:'now', hint:'The action is happening now.'},
    {q:'What did you do last weekend?', answer:'Past simple', clue:'last weekend', hint:'This is a finished past action.'},
    {q:'What are you doing on Friday at 10 a.m.?', answer:'Present continuous for arrangement', clue:'on Friday at 10 a.m.', hint:'This sounds like an organised appointment.'},
    {q:'What are you going to do this summer?', answer:'Going to', clue:'this summer + plan', hint:'This asks about a plan or intention.'},
    {q:'Do you think it will rain tomorrow?', answer:'Will', clue:'Do you think / tomorrow', hint:'“I think...” for a prediction uses will.'},
    {q:'Have you ever stayed in a hotel in England?', answer:'Present perfect', clue:'Have you ever', hint:'“Ever” asks about life experience.'},
    {q:'How long have you lived in Saint-Gilles-Croix-de-Vie?', answer:'Present perfect', clue:'How long / have you lived', hint:'It started in the past and continues now.'}
  ];
  const tenseOptions = ['Present simple','Present continuous','Past simple','Present continuous for arrangement','Going to','Will','Present perfect'];
  let clueIndex = 0;

  const scenarios = [
    {
      category:'Work / salon',
      title:'Confirm an appointment',
      task:'A customer has an appointment at the salon on Friday at 10 a.m. Write a short confirmation, then practise saying it aloud.',
      phrases:['I confirm your appointment...','Please let us know...','What would you like done?','Kind regards'],
      questions:['When are you available?','What would you like done?','Could you spell your name, please?'],
      a1:'Hello,\nI confirm your appointment at the salon on Friday at 10 a.m.\nSee you soon.\nKarine',
      a2:'Hello,\nI confirm your appointment at the salon on Friday at 10 a.m. with Ophélie.\nPlease let us know what you would like done.\nKind regards,\nKarine',
      fr:'Objectif : confirmer clairement le rendez-vous.\nPhrase utile : “What would you like done?” = Qu’est-ce que vous souhaitez faire ?'
    },
    {
      category:'Work / salon',
      title:'The salon is fully booked',
      task:'A customer wants an appointment tomorrow, but there is no availability. Apologise and offer another day.',
      phrases:['Unfortunately, we are fully booked.','However, I can offer you...','Please let me know what is best for you.'],
      questions:['Are you available on Thursday?','Would Friday morning be possible?','Do you prefer morning or afternoon?'],
      a1:'Hello,\nI’m sorry, but we are fully booked tomorrow.\nI can offer you an appointment on Thursday at 3 p.m.\nKind regards,\nKarine',
      a2:'Hello,\nThank you for your message. Unfortunately, we are fully booked tomorrow.\nHowever, I can offer you an appointment on Thursday at 3 p.m. or Friday morning.\nPlease let me know what is best for you.\nKind regards,\nKarine',
      fr:'Objectif : rester polie et proposer une solution.\n“fully booked” = complet / plus de disponibilité.'
    },
    {
      category:'Daily routine',
      title:'Explain your Monday',
      task:'Write and say what you usually do on Mondays. Use present simple because it is a routine.',
      phrases:['On Mondays...','We usually...','After that...','We take the opportunity to...'],
      questions:['What do you usually do on Mondays?','Does your husband work on Mondays?','Where do you usually go?'],
      a1:'On Mondays, my husband has the day off.\nWe usually go for a walk on the beach.\nThen, we have a coffee at a café.',
      a2:'On Mondays, my husband has the day off, so we usually enjoy our day together.\nWe go for a walk on the beach, have a coffee at a café, and sometimes do things we do not usually have time to do.',
      fr:'Indice : “usually / on Mondays” = routine → présent simple.\n“to have the day off” = avoir sa journée de repos.'
    },
    {
      category:'Vacation / hotel',
      title:'Confirm a hotel booking',
      task:'You booked a hotel room for three nights. Ask them to confirm check-in time and breakfast information.',
      phrases:['I would like to confirm my booking...','Could you please confirm...?','Is breakfast included?','Thank you in advance.'],
      questions:['What time is check-in?','Is breakfast included?','Is bottled water included in the room?'],
      a1:'Hello,\nI would like to confirm my booking for Friday night.\nCould you please confirm the check-in time?\nThank you,\nKarine',
      a2:'Dear Reservation Team,\nI would like to confirm my booking for three nights from Friday.\nCould you please confirm the check-in time and breakfast information?\nThank you in advance for your help.\nKind regards,\nKarine',
      fr:'Objectif : demander une confirmation poliment.\n“booking” = réservation. “check-in time” = heure d’arrivée.'
    },
    {
      category:'Vacation / restaurant',
      title:'Book a table with a sea view',
      task:'You want to book a table for two people at 8 p.m. Ask if a table with a sea view is possible.',
      phrases:['I would like to book a table...','for two people','at 8 p.m.','with a sea view','Could you please confirm...?'],
      questions:['Do you have a table for two?','Is a table with a sea view possible?','What time is available?'],
      a1:'Hello,\nI would like to book a table for two people tonight at 8 p.m.\nIs a table with a sea view possible?\nThank you,\nKarine',
      a2:'Hello,\nI would like to book a table for two people tonight at 8 p.m., if possible.\nCould we have a table with a sea view?\nThank you for your help.\nKind regards,\nKarine',
      fr:'Attention : “sea view” s’écrit en deux mots.\n“to book a table” = réserver une table.'
    },
    {
      category:'Vacation / campsite',
      title:'Ask about a mobile home',
      task:'You want a mobile home for six people in September. Ask about price and availability.',
      phrases:['I would like to stay...','for six people','from 15 September to 25 September','Could you please tell me the price and availability?'],
      questions:['Do you have availability in September?','What is the price?','Is there a quiet area of the campsite?'],
      a1:'Hello,\nI would like to stay at your campsite in September for six people.\nDo you have a mobile home available?\nThank you,\nKarine',
      a2:'Dear Reservation Team,\nI would like to stay at your campsite from 15 September to 25 September for six people.\nI would like to book a mobile home in a quiet area of the campsite.\nCould you please tell me the price and availability?\nKind regards,\nKarine',
      fr:'Attention : from 15 September to 25 September = environ 10 nuits.\n“availability” = disponibilité.'
    },
    {
      category:'Pharmacy',
      title:'Ask for advice at the pharmacy',
      task:'You have a headache or a sore throat. Ask for advice and say what you need.',
      phrases:['I have a headache.','I have a sore throat.','Could you recommend something?','How often should I take it?'],
      questions:['What can I take?','How often should I take it?','Do you have something without sugar?'],
      a1:'Hello,\nI have a headache.\nWhat can I take, please?\nThank you,\nKarine',
      a2:'Hello,\nI have a sore throat and I do not feel very well.\nCould you please recommend something?\nHow often should I take it?\nThank you,\nKarine',
      fr:'Objectif : demander de l’aide simplement.\n“Could you recommend something?” = Pourriez-vous me conseiller quelque chose ?'
    }
  ];

  const roleSets = {
    Routine:['What do you usually do in the morning?','Do you work on Mondays?','Where do you usually have coffee?','What do you do when it is very hot?'],
    Past:['What did you do last weekend?','Where did you go last week?','Did you go shopping recently?','What did you eat at the restaurant?'],
    Future:['What are you doing tomorrow?','Are you going to travel this summer?','What are you doing on Friday at 10 a.m.?','Do you think it will be sunny tomorrow?'],
    Experience:['Have you ever visited England?','How long have you lived in Saint-Gilles-Croix-de-Vie?','Have you ever stayed at a campsite?','Have you ever worked with English-speaking customers?'],
    Service:['When are you available?','What would you like done?','Could you spell your name, please?','Would you like another appointment?']
  };

  function $(sel){return document.querySelector(sel)}
  function $all(sel){return Array.from(document.querySelectorAll(sel))}

  function initScroll(){
    $all('[data-scroll]').forEach(btn=>btn.addEventListener('click',()=>{
      const target = document.querySelector(btn.getAttribute('data-scroll'));
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
    }));
  }

  function initToggles(){
    document.addEventListener('click', (e)=>{
      const btn = e.target.closest('.hint-toggle');
      if(!btn) return;
      const target = document.getElementById(btn.dataset.target);
      if(target) target.classList.toggle('open');
    });
  }

  function speakText(text){
    if(!('speechSynthesis' in window)) return alert('Speech is not available in this browser.');
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.replace(/\s+/g,' ').trim());
    utter.lang = $('#voiceSelect')?.value || 'en-GB';
    utter.rate = 0.86;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }

  function initSpeak(){
    document.addEventListener('click', (e)=>{
      const btn = e.target.closest('.speak');
      if(!btn) return;
      let text = btn.dataset.speak || '';
      if(btn.id === 'speakQuestion') text = $('#clueQuestion').textContent;
      if(btn.id === 'speakMission') text = $('#missionTitle').textContent + '. ' + $('#missionTask').textContent;
      speakText(text);
    });
  }

  function renderSessions(){
    const wrap = $('#sessionCards');
    if(!wrap) return;
    wrap.innerHTML = sessions.map(s=>`
      <article class="session-card">
        <div class="session-number"><div><span>${s.n}</span><small>${s.time}</small></div></div>
        <div class="session-body">
          <h3>${s.title}</h3>
          <p>${s.goal}</p>
          <div class="session-tags">${s.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
          <div class="session-details">
            <div class="detail-box"><strong>Speaking</strong><span>${s.speaking}</span></div>
            <div class="detail-box"><strong>Writing</strong><span>${s.writing}</span></div>
            <div class="detail-box"><strong>Final challenge</strong><span>${s.challenge}</span></div>
          </div>
        </div>
      </article>
    `).join('');
  }

  function renderClue(){
    const item = clueQuestions[clueIndex % clueQuestions.length];
    $('#clueQuestion').textContent = item.q;
    $('#clueFeedback').textContent = '';
    $('#clueFeedback').className = 'feedback';
    $('#clueHint').classList.remove('open');
    $('#clueHint').textContent = item.hint;
    const choices = shuffle([item.answer, ...shuffle(tenseOptions.filter(o=>o!==item.answer)).slice(0,3)]);
    $('#tenseChoices').innerHTML = choices.map(c=>`<button class="choice" data-choice="${escapeHtml(c)}">${c}</button>`).join('');
  }

  function initClue(){
    const choices = $('#tenseChoices');
    choices?.addEventListener('click', (e)=>{
      const btn = e.target.closest('.choice');
      if(!btn) return;
      const item = clueQuestions[clueIndex % clueQuestions.length];
      const selected = btn.dataset.choice;
      $all('.choice').forEach(b=>{b.disabled=true; if(b.dataset.choice===item.answer) b.classList.add('correct');});
      if(selected === item.answer){
        $('#clueFeedback').textContent = `Correct. Clue: ${item.clue}.`;
        $('#clueFeedback').classList.add('good');
      } else {
        btn.classList.add('wrong');
        $('#clueFeedback').textContent = `Not this time. The clue is: ${item.clue}. The best tense is: ${item.answer}.`;
        $('#clueFeedback').classList.add('bad');
      }
    });
    $('#showClueHint')?.addEventListener('click',()=>$('#clueHint').classList.toggle('open'));
    $('#nextClue')?.addEventListener('click',()=>{clueIndex++; renderClue();});
    renderClue();
  }

  function renderMissions(){
    const select = $('#scenarioSelect');
    if(!select) return;
    select.innerHTML = scenarios.map((s,i)=>`<option value="${i}">${s.category} · ${s.title}</option>`).join('');
    select.addEventListener('change',()=>renderMission(Number(select.value)));
    renderMission(0);
  }

  function renderMission(index){
    const s = scenarios[index] || scenarios[0];
    $('#missionCategory').textContent = s.category;
    $('#missionTitle').textContent = s.title;
    $('#missionTask').textContent = s.task;
    $('#missionPhrases').innerHTML = s.phrases.map(p=>`<li>${escapeHtml(p)}</li>`).join('');
    $('#missionQuestions').innerHTML = s.questions.map(q=>`<li>${escapeHtml(q)}</li>`).join('');
    $('#modelA1').textContent = s.a1;
    $('#modelA2').textContent = s.a2;
    $('#modelFr').textContent = s.fr;
    ['modelA1','modelA2','modelFr'].forEach(id=>document.getElementById(id).classList.remove('open'));
  }

  function renderRoleTabs(){
    const tabWrap = $('#roleTabs');
    if(!tabWrap) return;
    const keys = Object.keys(roleSets);
    tabWrap.innerHTML = keys.map((k,i)=>`<button class="tab-btn ${i===0?'active':''}" data-role="${k}">${k}</button>`).join('');
    tabWrap.addEventListener('click', (e)=>{
      const btn = e.target.closest('.tab-btn');
      if(!btn) return;
      $all('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderRoleCard(btn.dataset.role);
    });
    renderRoleCard(keys[0]);
  }

  function renderRoleCard(key){
    const qs = roleSets[key] || [];
    $('#roleCard').innerHTML = `<p><strong>${key} questions:</strong> Ask your teacher, then answer the same questions yourself.</p><ol>${qs.map(q=>`<li>${escapeHtml(q)} <button class="secondary-btn speak" data-speak="${escapeAttr(q)}">▶</button></li>`).join('')}</ol>`;
  }

  function initRecorder(){
    const start = $('#startRec'), stop = $('#stopRec'), status = $('#recStatus'), audio = $('#audioPlayback'), link = $('#downloadRec');
    if(!start || !stop) return;
    let recorder, chunks = [];
    if(!navigator.mediaDevices || !window.MediaRecorder){
      status.textContent = 'Browser recording is not available here. Use Voice Memos on iPhone/iPad or another recording app.';
      start.disabled = true;
      return;
    }
    start.addEventListener('click', async()=>{
      try{
        const stream = await navigator.mediaDevices.getUserMedia({audio:true});
        chunks = [];
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => { if(e.data.size) chunks.push(e.data); };
        recorder.onstop = () => {
          const blob = new Blob(chunks, {type:'audio/webm'});
          const url = URL.createObjectURL(blob);
          audio.src = url;
          audio.hidden = false;
          link.href = url;
          link.hidden = false;
          status.textContent = 'Recording ready. Listen, download, or record again.';
          stream.getTracks().forEach(t=>t.stop());
        };
        recorder.start();
        start.disabled = true;
        stop.disabled = false;
        link.hidden = true;
        audio.hidden = true;
        status.textContent = 'Recording... Speak clearly and keep going.';
      }catch(err){
        status.textContent = 'Microphone permission was not available. Use Voice Memos on iPhone/iPad.';
      }
    });
    stop.addEventListener('click',()=>{
      if(recorder && recorder.state !== 'inactive') recorder.stop();
      start.disabled = false;
      stop.disabled = true;
    });
  }

  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function escapeHtml(str){return String(str).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function escapeAttr(str){return escapeHtml(str).replace(/`/g,'&#96;');}

  document.addEventListener('DOMContentLoaded',()=>{
    initScroll();
    initToggles();
    initSpeak();
    renderSessions();
    initClue();
    renderMissions();
    renderRoleTabs();
    initRecorder();
  });
})();
