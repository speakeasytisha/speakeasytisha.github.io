(() => {
  'use strict';
  document.documentElement.classList.add('js-ready');
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const STORAGE = 'mahria_lesson2_executive_interview_atelier_v1';

  const saved = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE) || '{}'); } catch { return {}; }
  })();
  const state = {
    answers: saved.answers || {},
    attempted: saved.attempted || {},
    completed: new Set(saved.completed || []),
    review: saved.review || {},
    mode: saved.mode || 'coach',
    showFrench: !!saved.showFrench
  };
  const persist = () => {
    try {
      let current = {};
      try { current = JSON.parse(localStorage.getItem(STORAGE) || '{}'); } catch {}
      localStorage.setItem(STORAGE, JSON.stringify({
        ...current,
        answers: state.answers,
        attempted: state.attempted,
        completed: [...state.completed],
        review: state.review,
        mode: state.mode,
        showFrench: state.showFrench
      }));
    } catch {}
  };

  // ---------- Interview date ----------
  const interviewDate = new Date('2026-08-24T09:00:00+02:00');
  const days = Math.max(0, Math.ceil((interviewDate - new Date()) / 86400000));
  $('#daysToInterview').textContent = days;

  // ---------- Mode + French support ----------
  const applyMode = () => {
    document.body.classList.toggle('interview-mode', state.mode === 'interview');
    $('#modeBtn').textContent = state.mode === 'interview' ? 'Interview mode' : 'Coach mode';
  };
  const applyFrench = () => {
    document.body.classList.toggle('show-fr', state.showFrench);
    $('#frenchBtn').textContent = state.showFrench ? 'FR support: on' : 'FR support: off';
  };
  applyMode(); applyFrench();
  $('#modeBtn').addEventListener('click', () => { state.mode = state.mode === 'coach' ? 'interview' : 'coach'; applyMode(); persist(); });
  $('#frenchBtn').addEventListener('click', () => { state.showFrench = !state.showFrench; applyFrench(); persist(); });
  $('#printBtn').addEventListener('click', () => window.print());

  // ---------- Smooth scroll ----------
  $$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
    const target = $(btn.dataset.scroll); if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
  }));

  // ---------- TTS ----------
  let voices = [], utterance = null;
  const loadVoices = () => { voices = speechSynthesis.getVoices(); };
  loadVoices();
  if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = loadVoices;
  function speak(text) {
    if (!('speechSynthesis' in window) || !text) return;
    speechSynthesis.cancel();
    const lang = $('#accentSelect').value || 'en-GB';
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    const exact = voices.find(v => v.lang === lang && /Google|Microsoft|Samantha|Daniel|Serena|Sonia|Ryan/i.test(v.name));
    const fallback = voices.find(v => v.lang === lang) || voices.find(v => v.lang.startsWith(lang.slice(0,2)));
    if (exact || fallback) utterance.voice = exact || fallback;
    utterance.rate = .94; utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-say]');
    if (el) speak(el.dataset.say);
  });
  $('#stopAudio').addEventListener('click', () => speechSynthesis?.cancel());

  // ---------- Generic reveals ----------
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-reveal]');
    if (!btn || state.mode === 'interview') return;
    const el = document.getElementById(btn.dataset.reveal);
    if (!el) return;
    el.classList.toggle('show');
    btn.textContent = el.classList.contains('show') ? 'Hide' : (btn.dataset.original || btn.textContent);
  });
  $$('[data-reveal]').forEach(btn => btn.dataset.original = btn.textContent);

  // ---------- Completion buttons ----------
  $$('.complete-btn').forEach(btn => {
    const key = btn.dataset.complete;
    const paint = () => {
      const done = state.completed.has(key);
      btn.classList.toggle('done', done);
      btn.textContent = done ? 'Done ✓' : 'Mark done';
    };
    paint();
    btn.addEventListener('click', () => {
      state.completed.has(key) ? state.completed.delete(key) : state.completed.add(key);
      paint(); persist(); updateReport();
    });
  });

  // ---------- Quiz data ----------
  const naturalQuestions = [
    {id:'nat1', q:'You want to explain how you support different leaders.', choices:[
      ['I adapt to them because every leader is different.', false],
      ["I adapt my support to each leader’s working style.", true]
    ], why:'Name what you adapt: your support.'},
    {id:'nat2', q:'You are describing your Cartier responsibilities aloud.', choices:[
      ['The onboarding of my director, organisation of two seminars and executive documentation.', false],
      ["I onboarded my director, organised two seminars and prepared executive documentation.", true]
    ], why:'Spoken answers are stronger with I + action verbs.'},
    {id:'nat3', q:'You are explaining the reason for your second Cartier assignment.', choices:[
      ['I joined to cover a woman who was on maternity leave.', false],
      ["I joined to cover a colleague’s maternity leave.", true]
    ], why:'Name the professional situation, not “a woman”.'},
    {id:'nat4', q:'You are clarifying the duration of two six-month assignments.', choices:[
      ['Both were for one year and each of them lasted six months.', false],
      ['Together, the two contracts totalled about one year — six months each.', true]
    ], why:'State the total once, then the breakdown.'},
    {id:'nat5', q:'You are explaining how you learn a new director’s needs.', choices:[
      ["It’s important to get to know them so I can respond effectively.", false],
      ["I make it a priority to understand each leader’s needs and working style.", true]
    ], why:'English sounds more direct when you lead with the person and the action.'}
  ];

  const grammarQuestions = [
    {id:'gram1', q:'Career experience connected to now, no finished time stated:', choices:[
      ['I worked in demanding luxury environments for more than ten years.', false],
      ['I have worked in demanding luxury environments for more than ten years.', true],
      ['I am working in demanding luxury environments since ten years.', false]
    ], why:'Use present perfect with for + duration when the experience is connected to now.'},
    {id:'gram2', q:'A specific finished Cartier assignment:', choices:[
      ['During that assignment, I organised two seminars.', true],
      ['During that assignment, I have organised two seminars.', false],
      ['During that assignment, I organise two seminars.', false]
    ], why:'A finished time frame calls for the past simple.'},
    {id:'gram3', q:'Hypothetical question: “What would you do if both directors needed the same slot?”', choices:[
      ['I first clarify the real urgency.', false],
      ['I would first clarify the real urgency.', true],
      ['I will first clarified the real urgency.', false]
    ], why:'Use would + base verb for a hypothetical response.'},
    {id:'gram4', q:'Real working method: “How do you manage competing priorities?”', choices:[
      ['I would usually start by clarifying the deadline.', false],
      ['I usually start by clarifying the deadline and business impact.', true],
      ['I usually started by clarify the deadline.', false]
    ], why:'Use present simple for the way you genuinely work.'},
    {id:'gram5', q:'Choose the correct duration phrase:', choices:[
      ['I have worked as an Executive Assistant since more than ten years.', false],
      ['I have worked as an Executive Assistant for more than ten years.', true],
      ['I work as an Executive Assistant for more than ten years ago.', false]
    ], why:'for + duration; since + starting point.'},
    {id:'gram6', q:'A completed action in the budget story:', choices:[
      ['I prepared a precise summary and asked my director to intervene.', true],
      ['I have prepared a precise summary five months ago.', false],
      ['I prepare a precise summary and asked my director.', false]
    ], why:'Use past simple for a finished story.'},
    {id:'gram7', q:'Your accumulated professional skill, still relevant today:', choices:[
      ['I developed strong coordination skills at Chloé and Cartier, and I never use them now.', false],
      ['I have developed strong coordination skills through my experience at Chloé and Cartier.', true],
      ['I am develop strong coordination skills since Cartier.', false]
    ], why:'Present perfect links accumulated experience to the present.'},
    {id:'gram8', q:'A professional hypothetical with a clear sequence:', choices:[
      ['If priorities conflicted, I would assess the impact and propose alternatives.', true],
      ['If priorities would conflict, I assess the impact and proposed alternatives.', false],
      ['If priorities conflicted, I will assessed the impact.', false]
    ], why:'If + past, would + base verb is a useful interview conditional.'}
  ];

  const repairQuestions = [
    {id:'rep1', original:'I am a personal assistant since 10 years.', model:'I have worked as an Executive Assistant for more than ten years.', keys:['have','worked','for','ten']},
    {id:'rep2', original:'I adapt to them.', model:'I adapt my support to each leader’s style.', keys:['adapt','my','support']},
    {id:'rep3', original:'It’s important to get to know them.', model:'I make it a priority to understand each leader’s working style.', keys:['priority','understand','working']},
    {id:'rep4', original:'The onboarding of my last director. Organized two seminars.', model:'I onboarded my most recent director and organised two seminars.', keys:['i','onboarded','organis']},
    {id:'rep5', original:'Both were for one year and each lasted six months.', model:'Together, the two contracts totalled about one year — six months each.', keys:['together','contracts','six','months']},
    {id:'rep6', original:'I worked at Cartier twice. The second time was to cover a woman on maternity leave.', model:'I worked at Cartier twice — the second time to cover a colleague’s maternity leave.', keys:['cover','colleague','maternity']}
  ];

  const priorityQuestions = [
    {id:'pri1', q:'Both leaders say their request is urgent. What should you do first?', choices:[
      ['Choose the more senior title and move the other meeting.', false],
      ['Clarify the real deadline, constraints and business impact behind both requests.', true],
      ['Ask both leaders to solve the conflict themselves.', false]
    ], why:'Prioritise from facts and impact, not hierarchy alone.'},
    {id:'pri2', q:'A conflict cannot be avoided. What sounds most executive?', choices:[
      ['There is a conflict in your calendars. What do you want me to do?', false],
      ['I have identified a conflict. I can protect the collection review if we move the supplier call to 11:30; would that work for you?', true],
      ['I moved the meeting because it seemed less important.', false]
    ], why:'Bring a clear option, then confirm the decision.'},
    {id:'pri3', q:'One director changes a priority at the last minute. What should you avoid?', choices:[
      ['Updating the other affected stakeholders quickly.', false],
      ['Checking what downstream meetings or deliverables are affected.', false],
      ['Treating the change as isolated and updating only one calendar.', true]
    ], why:'Executive support requires visibility across the consequences of a change.'},
    {id:'pri4', q:'How can you avoid sounding reactive when supporting two leaders?', choices:[
      ['Wait for both directors to tell you exactly what to do.', false],
      ['Maintain forward visibility, flag conflicts early and communicate prioritisation transparently.', true],
      ['Keep separate information so each director sees only their own requests.', false]
    ], why:'Forward visibility and early communication are the key ideas.'},
    {id:'pri5', q:'A request is urgent but unclear. What is the best professional response?', choices:[
      ['I can take care of that. Before I move anything, can I confirm the deadline and who needs to attend?', true],
      ['Okay, I will cancel the other meeting now.', false],
      ['I do not have enough information, so I cannot help.', false]
    ], why:'Acknowledge the request, then clarify what you need to act safely.'}
  ];

  const shuffle = arr => {
    const out = [...arr];
    for (let i=out.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [out[i],out[j]]=[out[j],out[i]]; }
    return out;
  };
  const totalMax = naturalQuestions.length + grammarQuestions.length + repairQuestions.length + priorityQuestions.length;
  $('#scoreMax').textContent = totalMax;

  function mark(id, correct) {
    state.attempted[id] = true;
    if (correct) state.answers[id] = true;
    else if (!state.answers[id]) state.answers[id] = false;
    persist(); updateScore(); updateReport();
  }

  function renderMC(containerId, questions) {
    const root = document.getElementById(containerId);
    root.innerHTML = '';
    questions.forEach(item => {
      const card = document.createElement('div'); card.className = 'quiz-item'; card.dataset.id = item.id;
      const q = document.createElement('div'); q.className='quiz-q'; q.textContent=item.q; card.appendChild(q);
      const row = document.createElement('div'); row.className='choice-row';
      const feedback = document.createElement('div'); feedback.className='feedback';
      shuffle(item.choices).forEach(([text,correct]) => {
        const btn=document.createElement('button'); btn.type='button'; btn.className='choice-btn'; btn.textContent=text;
        if (state.answers[item.id] === true) btn.disabled = true;
        btn.addEventListener('click', () => {
          if (state.answers[item.id] === true) return;
          $$('.choice-btn', row).forEach(b => b.classList.remove('selected','correct','incorrect'));
          btn.classList.add('selected', correct?'correct':'incorrect');
          card.classList.toggle('correct', correct); card.classList.toggle('incorrect', !correct);
          feedback.className = 'feedback ' + (correct?'good':'bad');
          feedback.textContent = correct ? `Correct. ${item.why}` : `Not yet. ${item.why}`;
          mark(item.id, correct);
          if (correct) $$('.choice-btn', row).forEach(b => b.disabled=true);
        });
        row.appendChild(btn);
      });
      if (state.answers[item.id] === true) { card.classList.add('correct'); feedback.className='feedback good'; feedback.textContent=`Completed correctly. ${item.why}`; }
      card.append(row, feedback); root.appendChild(card);
    });
  }
  renderMC('naturalDrill', naturalQuestions);
  renderMC('grammarQuiz', grammarQuestions);
  renderMC('priorityQuiz', priorityQuestions);

  // ---------- Repair exercises ----------
  const repairRoot = $('#repairQuiz');
  repairQuestions.forEach(item => {
    const wrap = document.createElement('div'); wrap.className='repair-item';
    wrap.innerHTML = `<label>Rewrite this as natural interview English</label><div class="original">${item.original}</div>`;
    const input=document.createElement('input'); input.type='text'; input.placeholder='Type your stronger version…';
    if (state.answers[item.id]) input.value=item.model;
    const actions=document.createElement('div'); actions.className='repair-actions';
    const check=document.createElement('button'); check.type='button'; check.className='check-repair'; check.textContent='Check';
    const hint=document.createElement('button'); hint.type='button'; hint.className='hint-repair'; hint.textContent='Hint';
    const fb=document.createElement('div'); fb.className='feedback';
    const model=document.createElement('div'); model.className='repair-model'; model.textContent='Model: '+item.model;
    check.addEventListener('click',()=>{
      const value=input.value.toLowerCase().replace(/[’']/g,"'");
      const ok=item.keys.every(k=>value.includes(k));
      mark(item.id,ok);
      fb.className='feedback '+(ok?'good':'bad');
      fb.textContent=ok?'Strong structure. Say it aloud once.':'Try again. Focus on the recurring pattern rather than copying every word.';
      if(ok){model.classList.add('show'); input.disabled=true; check.disabled=true; hint.disabled=true;}
    });
    hint.addEventListener('click',()=>model.classList.toggle('show'));
    if(state.answers[item.id]){fb.className='feedback good';fb.textContent='Completed correctly.';model.classList.add('show');input.disabled=true;check.disabled=true;hint.disabled=true;}
    actions.append(check,hint); wrap.append(input,actions,fb,model); repairRoot.appendChild(wrap);
  });

  // ---------- Evidence builder ----------
  $('#buildEvidence').addEventListener('click', () => {
    const value=$('#evidenceInput').value.trim(); const quality=$('#qualitySelect').value; const fb=$('#evidenceFeedback');
    const hasI=/\bI\b/.test(value); const hasVerb=/\b(organis|coordinat|prepar|anticipat|onboard|manag|resolv|support|create|structur|follow|escalat|align|work)/i.test(value);
    const specific=value.split(/\s+/).length>=10;
    if(hasI&&hasVerb&&specific){fb.className='feedback good';fb.textContent=`Strong: you have a verb-led example for ${quality}. Now add the value or result aloud.`;state.completed.add('evidence-builder');}
    else{fb.className='feedback bad';fb.textContent='Strengthen it: start with “I…”, use an action verb, and add one concrete detail.';}
    persist(); updateReport();
  });

  // ---------- STAR stories ----------
  const stories = {
    director:{
      title:'Onboarding a new director at Cartier',
      question:'“Tell us about a time you anticipated a senior leader’s needs.”',
      cells:[
        ['Situation','The previous director left and the team spent two to three months without a director while a replacement was recruited.'],
        ['Task','Prepare a smooth arrival and give the new director immediate visibility over priorities and key stakeholders.'],
        ['Action','Structure the agenda before arrival; organise key meetings, training, workshop visits, travel and onboarding steps; connect her to the right information.'],
        ['Result','The director became operational quickly; HR highlighted that she was in good hands and the role holder praised the quality of the preparation.']
      ],
      models:{
        interview:'“At Cartier, our team had been without a director for a few months when the new director was appointed. My role was to make her arrival as smooth as possible. Before she started, I structured her agenda, identified the key people she needed to meet and organised training, visits and travel. This meant she had a clear view of the organisation from the beginning and could become operational quickly.”',
        stronger:'“One example of anticipation was the arrival of a new director at Cartier after the team had spent several months without leadership. I wanted her first weeks to give her immediate visibility rather than a long period of discovery. I prepared the agenda in advance, mapped the key stakeholders, organised meetings, training, workshop visits and travel, and made sure she was connected to the right information. The onboarding was very smooth, and HR specifically commented that she was in good hands.”',
        executive:'“A good example is a director transition I supported at Cartier. After several months without a permanent director, continuity was important, so I treated the onboarding as an executive handover rather than an administrative welcome. I structured the first weeks around priorities, stakeholders, key meetings, training, workshop exposure and travel, and ensured the information flow was already in place before she arrived. The result was a fast, controlled transition and a director who could become operational very quickly.”'
      }
    },
    budget:{
      title:'Resolving a budget allocation issue',
      question:'“Tell us about a difficult situation and what you learned from it.”',
      cells:[
        ['Situation','A finance seminar was split across three cost centres, but all expenses were allocated to one centre by mistake.'],
        ['Task','Get the allocation corrected so the other budgets were restored and the file could be closed accurately.'],
        ['Action','Follow up with accounting repeatedly; when the issue remained blocked, prepare a precise summary and ask the director to intervene with all facts available.'],
        ['Result','The issue was resolved immediately after escalation. Learning: escalate earlier when a blockage has moved beyond your scope.']
      ],
      models:{
        interview:'“I once had a budget allocation issue after a finance seminar. The costs should have been divided between three cost centres, but everything was charged to one. I followed up with accounting several times, but the issue remained open. Eventually, I prepared all the facts for my director and asked her to intervene. It was resolved immediately, and I learned that when a blockage is clearly outside my scope, I should escalate earlier.”',
        stronger:'“A useful example is a cost-allocation error after a finance seminar. The whole expense had been charged to one cost centre instead of three. I was responsible for getting the budgets corrected, so I followed up persistently with accounting over several months. When I realised the issue was no longer moving, I prepared a concise factual summary for my director so she could intervene immediately. The correction was then made straight away. The experience reinforced an important judgement point for me: persistence is valuable, but so is recognising when timely escalation is the more efficient action.”',
        executive:'“One situation that sharpened my judgement involved a seminar budget incorrectly allocated to a single cost centre instead of three. I initially tried to resolve it directly with accounting and followed up consistently, but the issue remained blocked. Once I recognised that the operational route had reached its limit, I prepared the complete factual background for my director and enabled her to escalate it cleanly. The matter was resolved immediately. My main learning was to distinguish persistence from over-ownership: when a blockage exceeds my authority, early, well-prepared escalation protects time and budget.”'
      }
    },
    seminar:{
      title:'Explaining the seminar activity that once felt “too difficult” in English',
      question:'“Can you describe an activity you organised during a seminar?”',
      cells:[
        ['Situation','A seminar included a creative team-building activity based on a short animated clip.'],
        ['Task','Explain the activity clearly without needing specialist vocabulary.'],
        ['Action','Describe the category, what participants did and the purpose: small groups created new dialogue for characters and performed it while the clip played.'],
        ['Result','You can communicate the full idea with simple language and move on confidently.']
      ],
      models:{
        interview:'“One activity was a creative team-building exercise using a short animated video. Participants worked in small groups, created a new dialogue for the characters and performed it while the video played. The aim was to encourage creativity and teamwork.”',
        stronger:'“During one seminar, we used a short animated clip for a creative team-building exercise. In small groups, participants invented new dialogue for the characters and then performed it over the video. It was a simple way to encourage creativity, teamwork and a more relaxed interaction between colleagues.”',
        executive:'“One of the seminar activities used an animated clip as a collaborative creativity exercise. Teams had to reinterpret the scene, write new dialogue and perform it in sync with the video. What mattered was not the technical format itself, but the fact that it gave people a playful way to collaborate, communicate and create something together.”'
      }
    }
  };
  let activeStory='director';
  function renderStory(){
    const s=stories[activeStory]; const stage=$('#storyStage'); stage.className='story-stage';
    stage.innerHTML=`<div class="story-title-row"><div><p class="mini-label">Reusable interview story</p><h3>${s.title}</h3></div><button class="secondary" id="hearStoryQuestion">Hear question</button></div><div class="story-question">${s.question}</div><div class="star-grid">${s.cells.map(([k,v])=>`<div class="star-cell"><b>${k}</b><p>${v}</p></div>`).join('')}</div><div class="model-levels coach-only">${Object.entries(s.models).map(([key,text])=>`<article class="model-level"><h4>${key==='interview'?'Interview-ready':key==='stronger'?'Stronger professional':'Executive polish'}</h4><p>${text}</p><button type="button" data-story-say="${key}">Listen</button></article>`).join('')}</div>`;
    $('#hearStoryQuestion').addEventListener('click',()=>speak(s.question.replace(/[“”]/g,'')));
    $$('[data-story-say]',stage).forEach(b=>b.addEventListener('click',()=>speak(s.models[b.dataset.storySay].replace(/[“”]/g,''))));
  }
  renderStory();
  $$('.story-tab').forEach(btn=>btn.addEventListener('click',()=>{activeStory=btn.dataset.story;$$('.story-tab').forEach(b=>b.classList.toggle('active',b===btn));renderStory();}));

  // ---------- Simulation ----------
  const exchanges = [
    {
      a:['Industrial Director','This role supports two directors with different priorities. How would you organise your support so that neither person feels it is reactive?'],
      b:['Development Director','And how would you handle a situation where our priorities genuinely conflict?'],
      models:{
        interview:'I understand that every leader has different needs and working preferences, so I adapt my support to each person’s style. I would maintain clear visibility across both calendars, flag conflicts early and clarify urgency before moving priorities. If there were a genuine conflict, I would assess the business impact, propose realistic alternatives and confirm the agreed solution with both directors.',
        stronger:'I would begin by understanding each director’s working style, decision rhythm and non-negotiable priorities, then create forward visibility across both calendars rather than treating requests one by one. When I see a conflict developing, I would raise it early with the facts and possible options. If priorities genuinely conflicted, I would clarify urgency and impact, propose a solution and communicate the decision transparently so that both directors understand the trade-off.',
        executive:'For me, effective support to two senior leaders is based on visibility and judgement, not simply calendar management. I would learn each director’s operating style, maintain a forward view of both agendas and identify pressure points before they become conflicts. When a genuine trade-off is required, I would clarify the decision criteria, assess impact, bring one or two workable options and make sure the final prioritisation is visible to both leaders. That keeps support proactive and trusted.'
      }, elaborate:['Name one real Cartier example.','Add what you would track weekly.','Finish with the value: visibility, continuity or trust.']
    },
    {
      a:['Development Director','At Chloé, you worked between the studio and operational teams. What did that coordination actually involve?'],
      b:['Industrial Director','How would that experience transfer to a role connecting Industrial and Development teams?'],
      models:{
        interview:'At Chloé, I supported meetings, collection planning and presentation materials while coordinating between the design studio and operational teams. The important part was making sure information moved between people with different priorities. That experience is relevant here because the role also requires coordination across functions rather than support to only one person.',
        stronger:'At Chloé, I was positioned between the design studio and operational teams, so part of my role was to keep meetings, planning and presentation support aligned across people who were focused on different aspects of the collection. It taught me to translate priorities into practical coordination. I see a direct link with supporting Industrial and Development teams, where visibility and reliable information flow are essential.',
        executive:'My Chloé experience was valuable because it placed me at an interface: the studio had creative and collection priorities, while operational teams needed timing, coordination and usable information. My role was to help keep those streams aligned through meetings, planning and support materials. That is directly transferable to a dual-director environment, because I am comfortable creating structure where stakeholders are looking at the same business from different angles.'
      }, elaborate:['Use “interface” only if it feels natural.','Add a concrete type of meeting or planning item if asked.','Connect explicitly to Industrial + Development.']
    },
    {
      a:['Industrial Director','Tell us about a time you anticipated what a senior leader would need before they asked.'],
      b:['Development Director','How did you know what to prepare if the new director had not started yet?'],
      models:{
        interview:stories.director.models.interview,
        stronger:stories.director.models.stronger,
        executive:stories.director.models.executive
      }, elaborate:['Explain how you identified key stakeholders.','Mention the agenda was structured before arrival.','End with the fast transition / operational value.']
    },
    {
      a:['Development Director','Can you tell us about a difficult situation where persistence alone was not enough?'],
      b:['Industrial Director','What would you do differently today?'],
      models:{
        interview:stories.budget.models.interview,
        stronger:stories.budget.models.stronger,
        executive:stories.budget.models.executive
      }, elaborate:['Keep the accounting detail short.','Make your learning explicit.','Avoid sounding as though escalation is a failure.']
    },
    {
      a:['Industrial Director','Can you describe one seminar activity you organised?'],
      b:['Development Director','What was the purpose of that activity for the participants?'],
      models:{
        interview:stories.seminar.models.interview,
        stronger:stories.seminar.models.stronger,
        executive:stories.seminar.models.executive
      }, elaborate:['Use category → action → purpose.','Do not search for the perfect technical word.','If needed: “I don’t know the exact term in English, but…”']
    },
    {
      a:['Development Director','Why should we hire you for this position rather than another experienced Executive Assistant?'],
      b:['Industrial Director','What would you be able to bring from day one?'],
      models:{
        interview:'I can bring directly relevant executive-support experience together with a working style based on anticipation, discretion and reliability. At Chloé, I coordinated between the studio and operational teams, and at Cartier I supported senior leadership, complex agendas and executive coordination. I would therefore arrive with both luxury-sector experience and a strong understanding of how to create structure around demanding priorities.',
        stronger:'What differentiates my profile is the combination of senior executive support and cross-functional luxury experience. At Chloé, I coordinated between creative and operational teams; at Cartier, I worked around senior leadership, complex calendars, travel, executive documents and director transitions. I can therefore bring immediate operational credibility, but also a habit of anticipating, connecting stakeholders and creating continuity when priorities move quickly.',
        executive:'I would bring a combination that is very close to the reality of this role: senior-level executive support, luxury-sector culture and cross-functional coordination. My experience is not limited to calendar management — I have supported director transitions, CODIR interaction, international travel, executive documentation, seminars and coordination between very different stakeholders. From day one, I would bring structure, discretion and forward visibility, while taking the time to learn how each director wants to operate.'
      }, elaborate:['Use only details that are truly yours.','Do not repeat three adjectives without proof.','Finish by linking to the two-director environment.']
    },
    {
      a:['Industrial Director','What is one professional habit you have changed because experience taught you something?'],
      b:['Development Director','How has that changed the way you work now?'],
      models:{
        interview:'I have learned to escalate earlier when a blockage clearly goes beyond my scope. In one budget issue, I followed up for too long before involving my director. Once I prepared the facts and escalated it, the issue was resolved immediately. Today, I still try to solve problems independently, but I also assess earlier when escalation is the more efficient action.',
        stronger:'One habit I have refined is knowing when persistence needs to become escalation. I naturally like to solve problems myself, but a budget issue taught me that continuing to chase the same route can sometimes cost more time than a well-prepared escalation. Now I set clearer checkpoints: if the issue has exceeded my authority or is affecting other teams, I prepare the facts and escalate earlier.',
        executive:'A judgement point I have developed is the boundary between ownership and over-ownership. I am naturally persistent, but experience has taught me that a blocked issue should not stay with me simply because I want to solve it independently. I now look at authority, impact and delay: when the problem has moved beyond my scope, I escalate with a concise factual brief so the right person can act quickly.'
      }, elaborate:['This is a strong development-area answer.','Show the new behaviour, not only the old mistake.','Keep the tone constructive.']
    },
    {
      a:['Development Director','Why does this position feel like the right next step for you?'],
      b:['Industrial Director','And what are you hoping to develop over the next few years?'],
      models:{
        interview:'This position is a logical next step because it combines the parts of executive support I enjoy most: complex coordination, senior stakeholders, events, travel and a demanding luxury environment. Supporting two directors is also attractive because it requires strong prioritisation and adaptability. Over the next few years, I would like to deepen my expertise as an Executive Assistant while taking on broader coordination responsibilities and becoming fully confident operating in English with international stakeholders.',
        stronger:'I see this role as a strong continuation of what I have already built at Chloé and Cartier, but with a broader coordination challenge. The combination of Industrial and Development priorities means the assistant has to create continuity across two leadership perspectives, which is exactly the type of environment where I enjoy working. In the longer term, I would like to strengthen my executive-support expertise, take on broader coordination responsibilities and operate confidently in English across international stakeholders.',
        executive:'What attracts me is that the role sits at the intersection of executive support and cross-functional coordination. My background has progressively moved in that direction — from operational and project support to luxury environments, CODIR exposure and director transitions. Supporting both Industrial and Development leadership would allow me to use that experience while continuing to grow in scope. Over the next few years, I would like to become an even stronger strategic support partner, with broader coordination responsibility and full confidence in international English communication.'
      }, elaborate:['Connect past → role → future.','Keep the five-year answer as your own voice.','Avoid “challenging” repeated as a generic adjective.']
    }
  ];
  let exchangeIndex = Math.floor(Math.random()*exchanges.length);
  function renderExchange(){
    const ex=exchanges[exchangeIndex];
    $('#dialogueStage').innerHTML = `
      <div class="dialogue-line"><div class="speaker-avatar">ID</div><div class="speech-bubble"><small>${ex.a[0]}</small><p>${ex.a[1]}</p></div></div>
      <div class="dialogue-line"><div class="speaker-avatar development">DD</div><div class="speech-bubble"><small>${ex.b[0]} · follow-up</small><p>${ex.b[1]}</p></div></div>`;
    $('#modelPanel').classList.remove('show'); $('#modelPanel').innerHTML='';
  }
  renderExchange();
  $('#newQuestion').addEventListener('click',()=>{let next; do{next=Math.floor(Math.random()*exchanges.length)}while(next===exchangeIndex&&exchanges.length>1);exchangeIndex=next;renderExchange();});
  $('#hearQuestion').addEventListener('click',()=>{const ex=exchanges[exchangeIndex];speak(`${ex.a[0]} asks: ${ex.a[1]} ${ex.b[0]} follows up: ${ex.b[1]}`);});
  $('#showModel').addEventListener('click',()=>{
    if(state.mode==='interview') return;
    const ex=exchanges[exchangeIndex], level=$('#supportLevel').value, text=ex.models[level];
    const panel=$('#modelPanel');
    panel.innerHTML=`<h4>${level==='interview'?'Interview-ready':level==='stronger'?'Stronger professional':'Executive polish'} model</h4><p>${text}</p><p><strong>Elaborate if needed:</strong> ${ex.elaborate.join(' · ')}</p><button type="button" class="secondary" id="listenSimModel">Listen to model</button>`;
    panel.classList.add('show'); $('#listenSimModel').addEventListener('click',()=>speak(text));
  });

  // ---------- Unexpected questions ----------
  const unexpected = [
    ['Why did your Cartier assignments end?','Keep it factual: the assignments were temporary; one included maternity cover. Then pivot to what you gained from them.','I worked at Cartier on two separate temporary assignments — one of them was maternity cover. Together, they gave me substantial exposure to senior executive support in an international luxury environment, and that experience is one of the reasons I now want to continue in this sector.'],
    ['What would your previous director say you still need to improve?','Choose a real development point with a new behaviour. Your budget story gives you one.','She would probably say that I am very persistent and independent, but that I have learned to escalate earlier when a blockage is clearly outside my scope. I now set clearer checkpoints so that ownership does not become unnecessary delay.'],
    ['What do you need from a manager in order to work well?','Do not describe a “perfect manager.” Explain how you adapt, and name the information that helps you anticipate.','I adapt to different management styles, so I do not need one specific personality. What helps me work at my best is clarity on priorities, decision-making preferences and how the manager likes information to be communicated. Once I understand that, I can anticipate much more effectively.'],
    ['Tell us about a time you had to say no or push back.','Use calm judgement language: clarify, explain impact, propose alternative. Do not make it a confrontation story.','I try not to frame it as simply saying no. If a request creates a conflict or risk, I explain the constraint clearly and propose an alternative. My role is to protect the priority while still helping the manager reach the objective.'],
    ['How do you handle confidential information?','Give behaviours, not only “I am discreet.” Mention access, audience, channel and judgement.','For me, discretion is practical. I pay attention to who needs access to information, which channel is appropriate and what should or should not be shared in a broader group. I also avoid making assumptions — if the confidentiality level is unclear, I confirm before circulating anything.'],
    ['What would you do if you made a mistake in a director’s calendar?','Own it, assess impact, correct fast, communicate and prevent recurrence.','I would first assess the impact and correct what can be corrected immediately. If the mistake affects the director or other stakeholders, I would communicate it clearly rather than hide it. Then I would identify why it happened and adjust my process so that the same type of error is less likely to happen again.'],
    ['Why the luxury sector?','Do not rely on prestige. Talk about standards, pace, detail, international coordination and the environments you already know.','I enjoy environments where the standard of execution is high and details matter. My experience at Chloé and Cartier showed me that I am comfortable with the pace, discretion and coordination required in luxury, and I would like to continue developing in that type of environment.'],
    ['What is not on your CV that would help you in this role?','Choose a working habit, learning method or interaction strength that adds something new — not another duty already listed.','One thing that is difficult to show on a CV is how quickly I learn the working style of the person I support. I pay close attention to how they make decisions, how much detail they want and what tends to create pressure for them. That helps me become more anticipatory over time.']
  ];
  $('#unexpectedGrid').innerHTML=unexpected.map((x,i)=>`<article class="unexpected-card"><span class="step">Question ${String(i+1).padStart(2,'0')}</span><h3>${x[0]}</h3><div class="unexpected-actions"><button class="hear" type="button" data-uhear="${i}">Hear question</button><button class="hint" type="button" data-uhint="${i}">Strategy</button><button class="hint coach-only" type="button" data-umodel="${i}">Model</button></div><div class="unexpected-model" id="ustrategy${i}"><strong>Strategy:</strong> ${x[1]}</div><div class="unexpected-model coach-only" id="umodel${i}"><strong>Model:</strong> ${x[2]}</div></article>`).join('');
  $$('[data-uhear]').forEach(b=>b.addEventListener('click',()=>speak(unexpected[+b.dataset.uhear][0])));
  $$('[data-uhint]').forEach(b=>b.addEventListener('click',()=>$('#ustrategy'+b.dataset.uhint).classList.toggle('show')));
  $$('[data-umodel]').forEach(b=>b.addEventListener('click',()=>$('#umodel'+b.dataset.umodel).classList.toggle('show')));

  // ---------- Timers ----------
  function makeTimer(displayEl, totalSeconds, onEndText='Time') {
    let remaining=totalSeconds, timer=null;
    const paint=()=>{const m=Math.floor(remaining/60),s=remaining%60;displayEl.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;};
    const start=()=>{if(timer)return;timer=setInterval(()=>{remaining--;paint();if(remaining<=0){clearInterval(timer);timer=null;speak(onEndText);}},1000);};
    const pause=()=>{clearInterval(timer);timer=null;};
    const reset=()=>{pause();remaining=totalSeconds;paint();}; paint();
    return {start,pause,reset};
  }
  const answerTimer=makeTimer($('#answerTimer'),90,'Ninety seconds. Finish your last sentence.');
  $('#start90').addEventListener('click',answerTimer.start); $('#pause90').addEventListener('click',answerTimer.pause); $('#reset90').addEventListener('click',answerTimer.reset);
  const finalTimer=makeTimer($('#finalTimer'),720,'Twelve minutes. Interview sprint complete.');
  $('#startFinal').addEventListener('click',()=>{state.completed.add('final-sprint');persist();updateReport();finalTimer.start();}); $('#pauseFinal').addEventListener('click',finalTimer.pause); $('#resetFinal').addEventListener('click',finalTimer.reset);

  // ---------- Video recorder ----------
  let mediaStream=null, recorder=null, chunks=[], videoURL=null;
  const preview=$('#cameraPreview'), placeholder=$('#cameraPlaceholder'), recorded=$('#recordedVideo');
  async function startCamera(){
    try{
      mediaStream=await navigator.mediaDevices.getUserMedia({video:true,audio:true}); preview.srcObject=mediaStream; await preview.play(); placeholder.classList.add('hidden');
      $('#recordBtn').disabled=false; $('#cameraBtn').textContent='Camera ready'; $('#cameraBtn').disabled=true; $('#recordStatus').textContent='Camera and microphone ready. Nothing is uploaded.';
    }catch(err){$('#recordStatus').textContent='Camera/microphone access was not available. You can still use the rest of the lesson and record with your phone if preferred.';}
  }
  $('#cameraBtn').addEventListener('click',startCamera);
  $('#recordBtn').addEventListener('click',()=>{
    if(!mediaStream)return;chunks=[];
    try{recorder=new MediaRecorder(mediaStream,{mimeType:MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')?'video/webm;codecs=vp9,opus':'video/webm'});}catch{recorder=new MediaRecorder(mediaStream);}
    recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
    recorder.onstop=()=>{
      const blob=new Blob(chunks,{type:recorder.mimeType||'video/webm'}); if(videoURL)URL.revokeObjectURL(videoURL); videoURL=URL.createObjectURL(blob);recorded.src=videoURL;
      const dl=$('#downloadVideo');dl.href=videoURL;dl.hidden=false; state.completed.add('video-rehearsal');persist();updateReport();$('#recordStatus').textContent='Rehearsal ready. Watch once for content, then once for delivery.';
    };
    recorder.start();$('#recordBtn').disabled=true;$('#stopRecordBtn').disabled=false;$('#recordStatus').textContent='Recording… speak naturally and keep going after small errors.';
  });
  $('#stopRecordBtn').addEventListener('click',()=>{if(recorder&&recorder.state!=='inactive')recorder.stop();$('#recordBtn').disabled=false;$('#stopRecordBtn').disabled=true;});
  window.addEventListener('beforeunload',()=>{mediaStream?.getTracks().forEach(t=>t.stop());if(videoURL)URL.revokeObjectURL(videoURL);});

  $$('[data-review]').forEach(cb=>{
    cb.checked=!!state.review[cb.dataset.review]; cb.addEventListener('change',()=>{state.review[cb.dataset.review]=cb.checked;persist();updateReport();});
  });

  // ---------- Score + report ----------
  const groups = [
    {name:'Natural, less French-influenced phrasing', desc:'Personal error clinic', ids:naturalQuestions.map(x=>x.id)},
    {name:'Choose interview grammar accurately', desc:'Tense / conditional lab', ids:grammarQuestions.map(x=>x.id)},
    {name:'Repair recurring sentence patterns', desc:'Written accuracy lab', ids:repairQuestions.map(x=>x.id)},
    {name:'Prioritise for two senior leaders', desc:'Decision lab', ids:priorityQuestions.map(x=>x.id)}
  ];
  function correctCount(ids){return ids.filter(id=>state.answers[id]===true).length;}
  function attemptedCount(ids){return ids.filter(id=>state.attempted[id]).length;}
  function updateScore(){
    const score=Object.values(state.answers).filter(v=>v===true).length;
    $('#scoreNow').textContent=score;
    $('#reportAuto').textContent=`${score} / ${totalMax}`;
    $('#reportPercent').textContent=`${Math.round(score/totalMax*100)}%`;
  }
  function badgeStatus(correct,max,attempted){
    if(attempted===0)return ['Non commencé','noncommence'];
    if(correct===max)return ['Acquis','acquis'];
    if(correct/max>=.6)return ['En cours','encours'];
    return ['Non acquis','nonacquis'];
  }
  function updateReport(){
    updateScore();
    const rows=groups.map(g=>{const c=correctCount(g.ids),a=attemptedCount(g.ids),[label,cls]=badgeStatus(c,g.ids.length,a);return `<tr><td>${g.name}</td><td>${g.desc}</td><td>${c}/${g.ids.length}</td><td><span class="status-badge ${cls}">${label}</span></td></tr>`}).join('');
    $('#autoReportRows').innerHTML=rows;
    const attempted=Object.keys(state.attempted).length;
    const extras=['pen-verbs','star-cues','evidence-builder','video-rehearsal','final-sprint'];
    const extrasDone=extras.filter(x=>state.completed.has(x)).length;
    const reviewDone=Object.values(state.review).filter(Boolean).length;
    const denominator=totalMax+extras.length+5;
    const numerator=Math.min(totalMax,attempted)+extrasDone+reviewDone;
    $('#reportCompletion').textContent=`${Math.round(numerator/denominator*100)}%`;
  }
  updateReport();

  // ---------- Qualiopi manual fields ----------
  const manualIds=['oralStatus','oralComment','writingStatus','writingComment','overallStatus','nextPriority'];
  manualIds.forEach(id=>{const el=$('#'+id);if(saved[id]!==undefined)el.value=saved[id];el.addEventListener('input',saveManual);el.addEventListener('change',saveManual);});
  function saveManual(){
    const current=(()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{return {}}})();
    manualIds.forEach(id=>current[id]=$('#'+id).value);
    current.answers=state.answers;current.attempted=state.attempted;current.completed=[...state.completed];current.review=state.review;current.mode=state.mode;current.showFrench=state.showFrench;
    localStorage.setItem(STORAGE,JSON.stringify(current));
  }
  $('#saveReport').addEventListener('click',()=>{saveManual();const fb=$('#reportFeedback');fb.className='feedback good';fb.textContent='Progress report saved in this browser.';});

  function reportText(){
    const score=Object.values(state.answers).filter(v=>v===true).length;
    const lines=[
      'MAHRIA LAKAF — LESSON 2 QUALIOPI PROGRESS REPORT',
      'Executive interview evidence under pressure',
      'Target interview: 24 August 2026', '',
      `Automatic score: ${score}/${totalMax} (${Math.round(score/totalMax*100)}%)`,
      ...groups.map(g=>{const c=correctCount(g.ids),a=attemptedCount(g.ids),[label]=badgeStatus(c,g.ids.length,a);return `- ${g.name}: ${c}/${g.ids.length} — ${label}`;}), '',
      `Oral production: ${$('#oralStatus').value}`,
      `Oral comment: ${$('#oralComment').value || '—'}`, '',
      `Written / preparation production: ${$('#writingStatus').value}`,
      `Written comment: ${$('#writingComment').value || '—'}`, '',
      `Overall lesson status: ${$('#overallStatus').value}`,
      `Next-session priority: ${$('#nextPriority').value || '—'}`, '',
      'Personal targets: CLEAR · RELEVANT · STRUCTURED · SPECIFIC · NATURAL'
    ]; return lines.join('\n');
  }
  $('#copyReport').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(reportText());$('#reportFeedback').className='feedback good';$('#reportFeedback').textContent='Report copied.';}catch{$('#reportFeedback').className='feedback bad';$('#reportFeedback').textContent='Copy was not available in this browser. Use Download .txt instead.';}});
  $('#downloadReport').addEventListener('click',()=>{const blob=new Blob([reportText()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Mahria-Lesson-2-Qualiopi-Progress-Report.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  $('#resetLesson').addEventListener('click',()=>{if(!confirm('Reset all Lesson 2 scores, completion and saved report fields?'))return;localStorage.removeItem(STORAGE);location.reload();});

  // Restore manual values after saved object load (because state persistence may have overwritten earlier)
  manualIds.forEach(id=>{if(saved[id]!==undefined)$('#'+id).value=saved[id];});
})();
