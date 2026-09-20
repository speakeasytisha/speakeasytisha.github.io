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
    {q:"So, what made you start looking at Australia?", model:"I’d been thinking about an international move for a while, and Australia gradually became the option that made the most sense to me. Professionally, I’m interested in working in a new environment where I can use my process-analysis experience, and personally I’m also looking for a different lifestyle and a new challenge.", why:"It answers the question directly, gives both a professional and personal reason, and stays positive about the move.", bridge:"I’m still exploring the market, so I’m also interested in understanding which industries value this type of process experience most."},
    {q:"Have you been to Australia before?", model:"Not yet, so I know there will be a lot to discover. I’m trying to prepare seriously rather than idealise the move: I’m researching the job market, improving my English and thinking about the kind of work and lifestyle I want there.", why:"You can say you have not been there without sounding unprepared. The answer quickly shows preparation and realism.", bridge:"From your experience, what tends to surprise international candidates most when they start working in Australia?"},
    {q:"What kind of lifestyle are you hoping to have outside work?", model:"I’d like a lifestyle where work is important but where I can also stay very active. Sport is a big part of my routine, especially running and functional training, so having access to outdoor activities would definitely be part of the attraction for me.", why:"It is personal enough to build rapport but still appropriate for a recruiter conversation. It also gives the recruiter an easy topic to continue with.", bridge:"That balance is one of the things I’m looking forward to exploring in Australia."},
    {q:"What do you enjoy doing when you're not working?", model:"Sport takes up quite a lot of my free time. I train regularly, I run a lot, and I enjoy events that combine endurance and functional exercises. I like having a goal to work towards because it keeps me disciplined and gives me a good routine outside work as well.", why:"The answer gives detail and subtly shows transferable qualities such as discipline and consistency without turning them into a sales pitch.", bridge:"Do people in the team tend to do much together outside work, or is it quite separate?"},
    {q:"What type of team do you work best in?", model:"I work well in teams where people are comfortable sharing information and challenging an idea without making it personal. In process work, different teams often see the same issue differently, so I like an environment where you can discuss those views openly and still move towards a practical decision.", why:"It moves beyond saying 'a good team' and describes the behaviours that help you perform well.", bridge:"How would you describe the way this team works together day to day?"},
    {q:"What would make you excited to accept a role?", model:"I’d be most interested in a role where I can understand how things work, solve practical problems and collaborate with different people. I also want enough scope to keep learning rather than simply repeat what I’ve already done for six years.", why:"The answer focuses on the work itself and development, not only salary or location.", bridge:"What would be the biggest challenge for the person coming into this role?"},
    {q:"How do you usually keep yourself productive during a transition?", model:"I need structure, so I try to keep a routine even when I’m between roles. At the moment that means training, working on my English, researching opportunities and making concrete progress on the Australia project rather than treating the period as just time off.", why:"It addresses the career transition calmly and shows self-management without over-explaining it.", bridge:"It has actually helped me become clearer about what I want from my next role."},
    {q:"What have you learned from working in the same organisation for six years?", model:"One thing I learned is that improving a process is rarely just a technical question. You need to understand the people using it, the constraints they have and why different teams may want different things. Over time I became much better at listening first and then proposing something people could realistically use.", why:"It turns length of service into learning and professional maturity, with a concrete insight relevant to future roles.", bridge:"That’s one of the strengths I’d like to take into a new environment now."}
  ];

  const roleQuestions = [
    {q:"Hi, thanks for taking the call. Is now still a good time to speak?", coach:"Natural interaction. Do not launch into your CV immediately; simply greet, confirm and sound comfortable.", b1:"Hi, yes, absolutely. Thanks for calling. It’s a good time for me.", b2:"Hi, absolutely. Thanks for getting in touch. Now is a good time, and I’m looking forward to hearing a bit more about the opportunity.", upgrade:"Keep the opening short. A warm tone matters more than complicated language."},
    {q:"Could you give me a quick overview of your background?", coach:"A concise professional identity: role, years, type of work and the value you developed. Aim for 40–60 seconds.", b1:"Of course. I spent six years working as a process analyst. My role was to understand how processes worked, identify problems and work with different teams to improve them. I’m now looking for a new challenge where I can use that experience in an international environment.", b2:"Certainly. I spent the last six years in process analysis, mainly looking at how workflows operated in practice and how they could be improved. I worked across different teams to identify friction points, clarify needs and help turn them into workable solutions. I’m now looking to take that experience into a new environment and continue developing internationally.", upgrade:"Move from job title → what you actually did → what you want next."},
    {q:"What has prompted you to look for opportunities in Australia?", coach:"Positive motivation. Combine a credible professional reason with the broader life project; avoid criticising France or sounding like you are escaping something.", b1:"I’m looking for a real change both professionally and personally. Australia gives me the chance to work in an English-speaking environment, discover a different way of working and build a new experience outside France.", b2:"I’ve reached a point where I want the next stage of my career to be genuinely different, not just another version of the same role. Australia appeals to me because it offers an English-speaking professional environment, a new market to learn and a broader lifestyle change that I’ve been considering seriously.", upgrade:"Use 'I’m looking for...' and 'Australia appeals to me because...' rather than negative reasons for leaving."},
    {q:"What kind of role are you hoping to find?", coach:"Show direction without making your search unnecessarily narrow. Name the work you want to do and the environment in which you want to do it.", b1:"I’m mainly looking for roles connected to process improvement, business analysis or operations, where I can understand problems, work with different teams and help improve how things are done.", b2:"I’m particularly interested in roles around process improvement, business analysis or operational transformation. The title can vary, but I’m looking for a position where I can analyse how work is being done, collaborate across teams and turn issues into practical improvements.", upgrade:"Define the role by responsibilities and impact, not only by a job title."},
    {q:"Can you tell me about a process you improved and how you approached it?", coach:"Give evidence. Use a compact Situation → Action → Result structure and make your own contribution clear.", b1:"One example was a process involving several teams where there were too many steps and the handovers were not always clear. I first spoke with the people using the process, then mapped the main steps and identified where the problems were. We simplified the workflow and made responsibilities clearer, which made the process easier to use.", b2:"A good example was a cross-functional workflow that had become difficult to manage because responsibilities and handovers were unclear. I started by mapping the existing process and speaking with the teams involved to understand the pain points from each side. I then helped redesign the workflow around clearer ownership and fewer unnecessary steps. The key for me was making sure the proposed change worked operationally rather than only looking good on paper.", upgrade:"Use specific verbs: mapped, identified, clarified, redesigned, aligned, implemented."},
    {q:"How do you deal with stakeholders who don't agree on the solution?", coach:"The recruiter is testing collaboration, judgement and conflict management. Show that you listen, clarify the real concern and use evidence rather than forcing agreement.", b1:"I first try to understand why they disagree, because different teams often have different constraints. I ask questions, make sure everyone is talking about the same problem and then look for a solution that is realistic for the people involved.", b2:"I try not to treat disagreement as resistance straight away. I first clarify what each stakeholder is concerned about and whether we are actually solving the same problem. From there, I bring the discussion back to evidence, operational constraints and the objective we share. The goal is not to win the argument; it is to find a solution people can realistically support.", upgrade:"A strong line: 'The goal is not to win the argument; it is to find a workable solution.'"},
    {q:"You've been out of your previous role for a few months. How have you been using that time?", coach:"Keep it factual, structured and future-facing. Show activity without sounding defensive about the gap.", b1:"My role ended as part of a reorganisation, so I decided to use the transition carefully. I’ve been working on my English, keeping a strong routine through sport and preparing for the possibility of moving to Australia. I’m now ready for the right next role.", b2:"My previous role ended as part of a wider reorganisation, and I chose to use the transition productively rather than jump into the first available position. I’ve been improving my English, maintaining a disciplined routine and researching the Australian market while becoming clearer about the type of role I want next.", upgrade:"Say 'I’ve been...' for activities that started in the recent past and continue now."},
    {q:"What would your previous colleagues say you bring to a team?", coach:"Choose two or three observable qualities and support them with the way you work. Avoid a list of generic adjectives.", b1:"I think they would say I’m reliable, analytical and easy to work with. I like understanding a problem properly, and I’m comfortable speaking with different people to find a practical way forward.", b2:"I think they would probably mention reliability, structured thinking and the fact that I can work across different viewpoints without making the conversation more complicated than it needs to be. I tend to listen carefully, clarify the real issue and then help move the group towards a practical next step.", upgrade:"Replace 'I am adaptable' with evidence of how adaptability appears in your work."},
    {q:"What questions do you have for me about the role or the company?", coach:"Show curiosity about impact, expectations, stakeholders and the work itself. Ask one or two questions, then react to the answer.", b1:"Yes. What would be the main priorities for the person starting this role? And what type of teams would I work with most often?", b2:"Yes, I’d be interested to understand what success would look like in the first six months. I’d also like to know which stakeholders the role works with most closely and where you see the biggest process challenges at the moment.", upgrade:"Strong recruiter questions focus on success, priorities, challenges, team and next steps before benefits or holidays."}
  ];

  const workplaceSituations = [
    {s:"A colleague proposes a solution you do not think will fix the main problem. Respond without sounding blunt.", model:"I see where you’re coming from. I’m not sure it addresses the main issue we identified, though. Could we look at an option that deals with the handover problem first?", skill:"Disagree with the idea, not the person. Acknowledge first, then state the concern and suggest a next step.", language:"I see where you’re coming from… / I’m not sure… / Could we look at…"},
    {s:"Your manager gives you a task, but you are not sure whether they need a full analysis or a short summary.", model:"Sure. Just to confirm, would you like the full analysis at this stage, or should I focus on the key issues and recommendations first?", skill:"Clarify scope early instead of guessing. This shows ownership, not weakness.", language:"Just to confirm… / Would you like… or should I…?"},
    {s:"You realise on Tuesday that a Friday deadline may be difficult to meet. Give an update.", model:"A quick heads-up on Friday’s deadline: we’re making progress, but one dependency may push the timing. I’ll know more tomorrow morning. If it becomes a problem, I’ll flag it straight away and suggest an alternative plan.", skill:"Raise risk early, explain what is known and show the next action. Do not wait until the deadline has already failed.", language:"A quick heads-up… / may push the timing / I’ll know more… / I’ll flag it…"},
    {s:"A meeting has gone in several directions and nobody has clearly agreed on the next step. Close the discussion.", model:"Before we finish, can we quickly confirm the next steps? I’ll update the process map, Sam will check the operational impact, and we’ll regroup on Thursday. Does that work for everyone?", skill:"Turn discussion into owners, actions and timing. This is a strong process-analysis communication habit.", language:"Before we finish… / confirm the next steps / I’ll… / Does that work for everyone?"},
    {s:"Someone asks for your opinion in a meeting and you need a few seconds to organise your thoughts.", model:"That’s a good question. My first reaction is that the process itself is workable, but the handover between the teams is where I’d look first. Let me explain why.", skill:"Buy a little time while still beginning the answer. Avoid long apologies or saying your English is poor.", language:"That’s a good question… / My first reaction is… / Let me explain why."},
    {s:"You need a colleague to send information you requested two days ago. Follow up without sounding aggressive.", model:"Hi, just checking whether you’ve had a chance to send through the figures we discussed. I’m aiming to finish the analysis this afternoon, so they’d be really helpful when you have a moment.", skill:"Give context and timing. 'Just checking' softens the follow-up without making the request unclear.", language:"Just checking whether… / I’m aiming to… / when you have a moment."},
    {s:"A teammate explains a problem, but you think you may have misunderstood one important point.", model:"Just to make sure I’ve understood: the delay is happening after the approval step, not before it. Is that right?", skill:"Check your understanding by reformulating the key point. This is especially useful in fast English-speaking meetings.", language:"Just to make sure I’ve understood… / Is that right?"},
    {s:"You have completed your part of a task and want to update the team clearly.", model:"A quick update from my side: I’ve finished mapping the current workflow and highlighted the three main pain points. I’ll send the document this afternoon, and the next step will be to validate it with the operational team.", skill:"Use a simple update structure: completed → key information → next step.", language:"A quick update from my side… / I’ve finished… / the next step will be…"}
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
    let idx = Math.floor(Math.random()*smallTalkQuestions.length);
    if(smallTalkQuestions.length > 1 && state.currentSmallTalk && smallTalkQuestions[idx].q === state.currentSmallTalk.q){ idx = (idx + 1) % smallTalkQuestions.length; }
    state.currentSmallTalk = smallTalkQuestions[idx];
    $('#smallTalkDeck').textContent = state.currentSmallTalk.q;
    $('#smallTalkModel').textContent = state.currentSmallTalk.model;
    $('#smallTalkWhy').textContent = state.currentSmallTalk.why;
    $('#smallTalkBridge').textContent = state.currentSmallTalk.bridge;
    $('#smallTalkSupport').classList.add('hidden');
    $('#showSmallTalkModel').textContent = 'Show model answer';
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
    const parts = ['pitchA','pitchB','pitchC','pitchD','pitchE'].map(id => $('#'+id).value.trim()).filter(Boolean);
    $('#pitchOutput').textContent = parts.length ? parts.join(' ') : 'Add at least one idea above to build your pitch.';
  }

  function newRoleQuestion(){
    const currentIndex = roleQuestions.indexOf(state.currentRole);
    let next = currentIndex < 0 ? 0 : currentIndex + 1;
    if(next >= roleQuestions.length) next = 0;
    state.currentRole = roleQuestions[next];
    $('#roleQuestion').textContent = state.currentRole.q;
    $('#roleStep').textContent = `QUESTION ${next + 1} / ${roleQuestions.length}`;
    $('#roleCoach').textContent = state.currentRole.coach;
    $('#roleModelB1').textContent = state.currentRole.b1;
    $('#roleModelB2').textContent = state.currentRole.b2;
    $('#roleUpgrade').textContent = state.currentRole.upgrade;
    $('#roleSupport').classList.add('hidden');
    $('#showRoleModel').textContent = 'Show models for this question';
  }

  function showCurrentSmallTalkModel(){
    const box = $('#smallTalkSupport');
    box.classList.toggle('hidden');
    $('#showSmallTalkModel').textContent = box.classList.contains('hidden') ? 'Show model answer' : 'Hide model answer';
  }

  function showCurrentRoleModel(){
    if(!state.currentRole) newRoleQuestion();
    const box = $('#roleSupport');
    box.classList.toggle('hidden');
    $('#showRoleModel').textContent = box.classList.contains('hidden') ? 'Show models for this question' : 'Hide models';
  }

  let workplaceIndex = 0;
  function renderWorkplaceSituation(){
    const item = workplaceSituations[workplaceIndex];
    $('#workplaceSituation').textContent = item.s;
    $('#workplaceModel').textContent = item.model;
    $('#workplaceSkill').textContent = item.skill;
    $('#workplaceLanguage').textContent = item.language;
    $('#workplaceCounter').textContent = `${workplaceIndex + 1} / ${workplaceSituations.length}`;
    $('#workplaceSupport').classList.add('hidden');
    $('#showWorkplaceModel').textContent = 'Show natural response';
  }

  function nextWorkplace(){
    workplaceIndex = (workplaceIndex + 1) % workplaceSituations.length;
    renderWorkplaceSituation();
  }

  function buildFinalMission(){
    const parts = ['finalA','finalB','finalC','finalD','finalE','finalF'].map(id => $('#'+id).value.trim()).filter(Boolean);
    $('#finalMissionOutput').textContent = parts.length ? parts.join(' ') : 'Add your ideas in the six preparation blocks first.';
  }

  function updateOralTotal(){
    const total = $$('.oral-score').reduce((sum,el)=>sum + Number(el.value || 0),0);
    $('#oralTotal').textContent = `${total} / 20`;
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
    const fields = ['transfer1','pitchOutput','careerBreak','smallTalkNotes','roleNotes','finalMissionOutput','finalReflection','evaluationComment'];
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
    renderMCQs(); renderReformulations(); newSmallTalk(); state.currentRole=''; $('#roleQuestion').textContent='Click “Start / next question” when you are ready.'; $('#roleSupport').classList.add('hidden'); workplaceIndex=0; renderWorkplaceSituation(); $('#finalMissionOutput').textContent='Your connected answer will appear here.'; $$('.oral-score').forEach(el=>el.value='0'); updateOralTotal();
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

    const idea = e.target.closest('.idea-chip');
    if(idea){
      const field = $('#'+idea.dataset.target);
      if(field){
        field.value = idea.dataset.text;
        field.focus();
        field.dispatchEvent(new Event('input', {bubbles:true}));
      }
    }

    const roleListen = e.target.closest('.dynamic-role-listen');
    if(roleListen && state.currentRole) speak(roleListen.dataset.level === 'b2' ? state.currentRole.b2 : state.currentRole.b1);

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
  $('#listenSmallTalk').addEventListener('click',()=>speak(state.currentSmallTalk?.q || $('#smallTalkDeck').textContent));
  $('#showSmallTalkModel').addEventListener('click',showCurrentSmallTalkModel);
  $('#listenSmallTalkModel').addEventListener('click',()=>speak(state.currentSmallTalk?.model || $('#smallTalkModel').textContent));
  $('#nextRoleQuestion').addEventListener('click',newRoleQuestion);
  $('#listenRoleQuestion').addEventListener('click',()=>speak(state.currentRole?.q || $('#roleQuestion').textContent));
  $('#showRoleModel').addEventListener('click',showCurrentRoleModel);
  $('#nextWorkplace').addEventListener('click',nextWorkplace);
  $('#listenWorkplace').addEventListener('click',()=>speak(workplaceSituations[workplaceIndex].s));
  $('#showWorkplaceModel').addEventListener('click',()=>{ const box=$('#workplaceSupport'); box.classList.toggle('hidden'); $('#showWorkplaceModel').textContent=box.classList.contains('hidden')?'Show natural response':'Hide natural response'; });
  $('#listenWorkplaceModel').addEventListener('click',()=>speak(workplaceSituations[workplaceIndex].model));
  $('#buildFinalMission').addEventListener('click',buildFinalMission);
  $('#listenFinalMission').addEventListener('click',()=>speak($('#finalMissionOutput').textContent));
  $$('.oral-score').forEach(el=>el.addEventListener('change',updateOralTotal));
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
  renderWorkplaceSituation();
  updateOralTotal();
  updateTimer();
  updateProgress();
})();
