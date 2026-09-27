(() => {
  'use strict';

  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
  const normalize = s => (s || '').toLowerCase().replace(/[’‘]/g,"'").replace(/[?.!,;:]/g,'').replace(/\s+/g,' ').trim();

  const state = {
    mode: 'guided',
    accent: 'en-AU',
    completed: new Set(),
    confidence: null,
    correct: 0,
    attempted: 0,
    answeredKeys: new Set(),
    scrambleSeconds: 420,
    scrambleTimerId: null,
    speakingSeconds: 60,
    speakingTimerId: null,
    finalSeconds: 90,
    finalTimerId: null,
    selectedRejoinders: {},
    scrambleResults: {}
  };

  const diagnostics = [
    {
      q:'Last year, I choose to take some time before my next professional step.',
      category:'Tense',
      options:['Last year, I chose to take some time before my next professional step.','Last year, I have chosen to take some time before my next professional step.','Last year, I was choose to take some time before my next professional step.'],
      answer:'Last year, I chose to take some time before my next professional step.',
      hint:'“Last year” is a finished time marker.',
      why:'Use the Past Simple for a finished action at a finished time: choose → chose.'
    },
    {
      q:'What I can bring to this role?',
      category:'Question structure',
      options:['What can I bring to this role?','What do I can bring to this role?','What I could bring to this role?'],
      answer:'What can I bring to this role?',
      hint:'In a direct question, the modal comes before the subject.',
      why:'With a modal, use question word + modal + subject + base verb.'
    },
    {
      q:'A process analyst work with different departments.',
      category:'Agreement',
      options:['A process analyst works with different departments.','A process analyst working with different departments.','A process analyst do work with different departments.'],
      answer:'A process analyst works with different departments.',
      hint:'The subject is third-person singular.',
      why:'In the Present Simple affirmative, he/she/it takes -s: works.'
    },
    {
      q:'I’m looking for role where I can keep developing.',
      category:'Article',
      options:['I’m looking for a role where I can keep developing.','I’m looking for the role where I can keep developing.','I’m looking for role where I can keep developing.'],
      answer:'I’m looking for a role where I can keep developing.',
      hint:'“Role” is singular and countable, and it is not yet specific.',
      why:'Use a/an with one non-specific singular countable noun: a role.'
    },
    {
      q:'I’m interested to work in an international team.',
      category:'Preposition / verb pattern',
      options:['I’m interested in working in an international team.','I’m interested for working in an international team.','I’m interested to working in an international team.'],
      answer:'I’m interested in working in an international team.',
      hint:'Learn the chunk: interested in + noun / -ing.',
      why:'The natural pattern is interested in + gerund: interested in working.'
    },
    {
      q:'I have worked at my previous company for six years, and then my role ended in 2026.',
      category:'Tense choice',
      options:['I worked at my previous company for six years, and then my role ended in 2026.','I have worked at my previous company for six years, and then my role has ended in 2026.','I was working at my previous company since six years, and then my role ended in 2026.'],
      answer:'I worked at my previous company for six years, and then my role ended in 2026.',
      hint:'The six-year period is complete, and the ending date is finished.',
      why:'A completed period in a finished past context takes the Past Simple.'
    }
  ];

  const tenseQuestions = [
    {q:'I ___ as a process analyst for six years before my role ended.', options:['worked','have worked','am working'], answer:'worked', hint:'The six-year period is complete.', why:'Use Past Simple for a completed past period.'},
    {q:'Since the reorganisation, I ___ my English and preparing for Australia.', options:['have been improving','improved','had improved'], answer:'have been improving', hint:'“Since” connects a past starting point to now.', why:'Present Perfect Continuous is natural for an activity continuing through the recent period.'},
    {q:'By the time the service was dismantled, I ___ a lot about cross-functional work.', options:['had learned','have learned','learn'], answer:'had learned', hint:'One past event happened before another past event.', why:'Past Perfect marks the earlier past.'},
    {q:'At the moment, I ___ opportunities that match my experience.', options:['am exploring','explore yesterday','have explored last year'], answer:'am exploring', hint:'“At the moment” describes a current temporary activity.', why:'Use Present Continuous for something happening around now.'},
    {q:'I ___ to Australia when the practical arrangements are ready.', options:['am planning to move','will moving','plan move'], answer:'am planning to move', hint:'This is an intention / plan.', why:'Plan to + base verb or be planning to + base verb are both natural for intentions.'},
    {q:'If a role ___ a good fit, I’d be happy to discuss relocation quickly.', options:['looks','will look','would look'], answer:'looks', hint:'After if in a real future condition, use the present form.', why:'First conditional pattern: if + Present Simple, then will/can/may or another future meaning.'},
    {q:'I ___ with several departments when we redesigned a workflow last year.', options:['worked','have worked','work'], answer:'worked', hint:'“Last year” is finished.', why:'Use Past Simple.'},
    {q:'I ___ this kind of stakeholder discussion many times in my career.', options:['have handled','handled yesterday','had handle'], answer:'have handled', hint:'No finished time is given; this is experience up to now.', why:'Use Present Perfect for life/professional experience with no finished time marker.'}
  ];

  const questionBuilders = [
    {prompt:'Ask about the reason for choosing Australia.', tokens:['Why','did','you','choose','Australia','?'], answer:'Why did you choose Australia?', hint:'Past question: Why + did + subject + base verb.'},
    {prompt:'Ask about experience gained from the previous role.', tokens:['What','have','you','learned','from','your','previous','role','?'], answer:'What have you learned from your previous role?', hint:'Present Perfect question: What + have + subject + past participle.'},
    {prompt:'Ask what the candidate can contribute.', tokens:['What','can','you','bring','to','the','team','?'], answer:'What can you bring to the team?', hint:'Modal question: What + can + subject + base verb.'},
    {prompt:'Ask how the team normally works.', tokens:['How','does','the','team','usually','work','?'], answer:'How does the team usually work?', hint:'Third person question: does + base verb, not works.'}
  ];

  const transformQuestions = [
    {answerLine:'I’m looking for a role that combines analysis and teamwork.', model:'What kind of role are you looking for?', accepted:['what kind of role are you looking for','what type of role are you looking for'], hint:'Use are + you + looking for.'},
    {answerLine:'I left because the organisation was restructured.', model:'Why did you leave your previous role?', accepted:['why did you leave your previous role','why did you leave your last role','why did you leave'], hint:'Finished past question → did + base verb.'},
    {answerLine:'I’ve been preparing for the move for several months.', model:'How long have you been preparing for the move?', accepted:['how long have you been preparing for the move','how long have you been preparing'], hint:'Duration to now → How long have you been + -ing?'}
  ];

  const accuracySets = {
    agreement: {
      intro:'One auxiliary carries the tense. After does/did/modals, return to the base verb.',
      items:[
        {q:'He ___ how the workflow works in practice.', options:['understands','understand','does understands'], answer:'understands', hint:'Affirmative Present Simple with he.', why:'Third-person singular affirmative takes -s.'},
        {q:'She doesn’t ___ the same process every day.', options:['use','uses','using'], answer:'use', hint:'Doesn’t already carries the tense.', why:'After does/doesn’t, use the base verb.'},
        {q:'Did the team ___ the change quickly?', options:['adopt','adopted','adopts'], answer:'adopt', hint:'Did already marks past.', why:'After did, use the base verb.'}
      ]
    },
    articles: {
      intro:'Ask: singular countable? Is it specific? If yes, choose a/an/the deliberately.',
      items:[
        {q:'I worked on ___ cross-functional project involving three departments.', options:['a','the','—'], answer:'a', hint:'First mention, one non-specific project.', why:'Use a with a singular countable noun first mentioned.'},
        {q:'___ project I mentioned earlier reduced duplicated steps.', options:['The','A','—'], answer:'The', hint:'The listener can identify which project.', why:'Use the for a specific already identified noun.'},
        {q:'I have experience in ___ process improvement.', options:['—','a','the'], answer:'—', hint:'Experience/process improvement are being discussed generally.', why:'No article is used for the general uncountable concept here.'}
      ]
    },
    prepositions: {
      intro:'Treat these as vocabulary chunks. Do not translate the French preposition.',
      items:[
        {q:'I’m applying ___ roles in process improvement.', options:['for','to','at'], answer:'for', hint:'apply for + job / role.', why:'The natural chunk is apply for a role.'},
        {q:'I’m used ___ working with different stakeholders.', options:['to','for','at'], answer:'to', hint:'be used to + noun / -ing.', why:'Here “to” is a preposition, so it is followed by working.'},
        {q:'I moved ___ a new team during the reorganisation.', options:['to','in','at'], answer:'to', hint:'Movement toward a destination/team → to.', why:'Use move to a place/team/department.'}
      ]
    },
    patterns: {
      intro:'Certain verbs and adjectives control the next form. Memorise the pattern as one unit.',
      items:[
        {q:'My role involved ___ existing workflows.', options:['analysing','to analyse','analyse'], answer:'analysing', hint:'involve + -ing.', why:'Use involve + gerund.'},
        {q:'I decided ___ the transition productively.', options:['to use','using','use to'], answer:'to use', hint:'decide + to + base verb.', why:'Use decide to do something.'},
        {q:'I’m responsible for ___ processes clearer.', options:['making','to make','make'], answer:'making', hint:'responsible for + noun / -ing.', why:'“For” is a preposition, so use the gerund.'}
      ]
    },
    pronouns: {
      intro:'Check who is doing the action, who receives it, and whether a reflexive form must agree in number.',
      items:[
        {q:'We planned the trip by ___.', options:['ourselves','ourself','us'], answer:'ourselves', hint:'The subject is we, so the reflexive pronoun must be plural.', why:'We → ourselves.'},
        {q:'The manager asked my colleague and ___ to review the workflow.', options:['me','I','myself'], answer:'me', hint:'This pronoun is the object of asked.', why:'Use the object pronoun me after a verb or preposition.'},
        {q:'The candidate explained the process clearly, and ___ gave a concrete example.', options:['he','him','his'], answer:'he', hint:'You need a subject pronoun before the verb gave.', why:'Use he/she/they as a subject, not an object or possessive form.'}
      ]
    }
  };

  const vocab = {
    'Recruitment & fit': [
      {icon:'🎯', term:'apply for a role', fr:'postuler à un poste', def:'submit your candidacy for a position', ex:'I’m applying for roles where I can use my process-analysis experience.'},
      {icon:'📌', term:'selection criteria', fr:'critères de sélection', def:'the skills and experience used to evaluate candidates', ex:'I match my examples to the selection criteria in the job ad.'},
      {icon:'🤝', term:'good fit', fr:'bonne adéquation', def:'a strong match between a person, role and company', ex:'I’m looking for a role that is a good fit for my experience and working style.'},
      {icon:'🧭', term:'next step', fr:'prochaine étape', def:'the next stage in a career or process', ex:'Moving to Australia is the next professional step I’m preparing for.'},
      {icon:'🗓️', term:'availability', fr:'disponibilité', def:'when you are able to start or work', ex:'I can explain my availability clearly during a recruiter call.'},
      {icon:'🔁', term:'transferable skills', fr:'compétences transférables', def:'skills that remain useful in a different role or sector', ex:'Stakeholder communication is one of my transferable skills.'}
    ],
    'Process analysis': [
      {icon:'🧩', term:'workflow', fr:'flux de travail', def:'the sequence of steps in a process', ex:'I mapped the workflow before suggesting any changes.'},
      {icon:'🔍', term:'root cause', fr:'cause profonde', def:'the underlying reason a problem occurs', ex:'I try to identify the root cause instead of treating only the symptom.'},
      {icon:'🚧', term:'bottleneck', fr:'goulot d’étranglement / point de blocage', def:'a stage that slows the whole process', ex:'We found a bottleneck in the approval stage.'},
      {icon:'⚙️', term:'streamline', fr:'simplifier / rationaliser', def:'make a process simpler and more efficient', ex:'The goal was to streamline the process without losing important controls.'},
      {icon:'👥', term:'stakeholder', fr:'partie prenante', def:'a person or group affected by a project or decision', ex:'I spoke with stakeholders before proposing the new workflow.'},
      {icon:'📈', term:'outcome', fr:'résultat / issue', def:'the result produced by an action or process', ex:'We measured the outcome after the new process was rolled out.'}
    ],
    'Australia workplace': [
      {icon:'🧑‍💼', term:'onboarding', fr:'intégration d’un nouveau salarié', def:'the process of integrating a new employee', ex:'A clear onboarding process helps new employees become productive faster.'},
      {icon:'🔄', term:'handover', fr:'passation', def:'the transfer of tasks or information from one person to another', ex:'A structured handover reduces the risk of missing information.'},
      {icon:'🧠', term:'induction', fr:'session / parcours d’intégration', def:'initial workplace information and training for a new employee', ex:'The company provides a safety and workplace induction on the first day.'},
      {icon:'🌏', term:'relocate', fr:'déménager pour un emploi', def:'move to a different place for work', ex:'I’m prepared to relocate for the right opportunity in Australia.'},
      {icon:'🧑‍🤝‍🧑', term:'cross-functional', fr:'transversal / interservices', def:'involving people from different teams or functions', ex:'I’m comfortable working in cross-functional teams.'},
      {icon:'📋', term:'probation period', fr:'période d’essai', def:'an initial employment period used to assess fit and performance', ex:'I would use the probation period to learn the team’s priorities quickly.'}
    ],
    'VTest language': [
      {icon:'💬', term:'clarify', fr:'clarifier', def:'make meaning more precise', ex:'Could you clarify what you mean by operational ownership?'},
      {icon:'🧱', term:'elaborate', fr:'développer', def:'add useful detail to an answer', ex:'I can elaborate on that with a concrete example.'},
      {icon:'✂️', term:'concise', fr:'concis', def:'clear and complete without unnecessary detail', ex:'A concise answer is easier to follow under exam timing.'},
      {icon:'🧾', term:'evidence', fr:'preuve / exemple concret', def:'facts or examples that support a point', ex:'I support my opinion with evidence from my previous experience.'},
      {icon:'⚖️', term:'whereas', fr:'tandis que / alors que', def:'connector used to contrast two facts or ideas', ex:'Remote work offers flexibility, whereas office work can make collaboration easier.'},
      {icon:'➡️', term:'as a result', fr:'par conséquent', def:'connector that introduces a consequence', ex:'The process was simplified; as a result, employees completed it faster.'}
    ],
    'Relocation & daily life': [
      {icon:'🏠', term:'accommodation', fr:'logement', def:'a place to live or stay', ex:'I’ll organise temporary accommodation before looking for a longer-term place.'},
      {icon:'🚆', term:'commute', fr:'trajet domicile-travail', def:'regular travel between home and work', ex:'I would consider the commute when comparing two job opportunities.'},
      {icon:'📄', term:'rental application', fr:'dossier de location', def:'documents submitted to apply to rent a property', ex:'A rental application may require identification and proof of income.'},
      {icon:'💡', term:'utilities', fr:'charges / services (électricité, eau, etc.)', def:'basic household services such as electricity and water', ex:'I would check whether utilities are included in the rent.'},
      {icon:'🚌', term:'public transport', fr:'transports en commun', def:'shared transport such as buses and trains', ex:'Good public transport could make the daily commute easier.'},
      {icon:'🧭', term:'settle in', fr:'prendre ses marques / s’installer', def:'become comfortable in a new place or situation', ex:'I expect it will take a little time to settle in and learn how things work locally.'}
    ]
  };

  const scrambleSentences = [
    {answer:'I have been preparing for the move since the summer.', tokens:['the','I','summer.','move','have','for','since','been','preparing','the'], hint:'Since + starting point → have/has been + -ing can show an ongoing activity.'},
    {answer:'Why did you decide to look for opportunities in Australia?', tokens:['opportunities','did','in','decide','Australia?','you','for','Why','look','to'], hint:'Past direct question: Why + did + subject + base verb.'},
    {answer:'A good process should be clear for the people who use it.', tokens:['for','A','it.','process','who','people','clear','the','good','should','use','be'], hint:'Modal + base verb: should be.'},
    {answer:'I worked with several teams during the reorganisation.', tokens:['reorganisation.','worked','during','teams','I','the','with','several'], hint:'Finished past event → Past Simple.'},
    {answer:'The role I am looking for should combine analysis and teamwork.', tokens:['analysis','role','looking','combine','I','and','for','should','The','teamwork.','am'], hint:'Specific role + relative clause; should + base verb.'},
    {answer:'I am used to working with people from different departments.', tokens:['from','working','I','departments.','used','different','am','to','people','with'], hint:'be used to + -ing.'},
    {answer:'If the position is a good fit, I would be keen to learn more.', tokens:['keen','position','to','fit,','If','more.','would','good','I','learn','the','be','a','is'], hint:'If + present; would can express a polite hypothetical response.'},
    {answer:'Before the project ended, we had already identified the main bottleneck.', tokens:['project','main','identified','Before','already','we','the','had','bottleneck.','ended,','the'], hint:'Earlier past action → had + past participle.'},
    {answer:'What have you learned from working in cross-functional teams?', tokens:['working','What','cross-functional','from','learned','you','in','have','teams?'], hint:'Present Perfect direct question: What + have + subject + participle.'}
  ];

  const rejoinders = [
    {prompt:'Recruiter: “Thanks for joining the call. Is now still a good time?”', transcript:'Thanks for joining the call. Is now still a good time?', options:['Yes, absolutely. Thanks for calling.','Yes, I am still a good time.','I wait your call since one hour.'], answer:'Yes, absolutely. Thanks for calling.', why:'A brief, natural acknowledgement is the best fit.'},
    {prompt:'Recruiter: “Could you tell me a little more about your experience with stakeholders?”', transcript:'Could you tell me a little more about your experience with stakeholders?', options:['Yes. In my previous role, I regularly worked with teams that had different priorities.','Yes, I worked with stakeholders since six years.','Stakeholders are people in project.'], answer:'Yes. In my previous role, I regularly worked with teams that had different priorities.', why:'It answers directly and begins to provide evidence with correct past-time framing.'},
    {prompt:'Manager: “I’m not sure the new process will work for the operations team.”', transcript:'I’m not sure the new process will work for the operations team.', options:['I see what you mean. Could we look at the main concern together?','No, it works.','Why you think it will not work?'], answer:'I see what you mean. Could we look at the main concern together?', why:'It acknowledges the concern and invites clarification professionally.'},
    {prompt:'Colleague: “I’ve sent you the updated document. Can you check it before lunch?”', transcript:'I’ve sent you the updated document. Can you check it before lunch?', options:['Yes, I can check it before lunch and get back to you.','Yes, I check it yesterday.','I am agree.'], answer:'Yes, I can check it before lunch and get back to you.', why:'Can + base verb; “get back to you” naturally signals a follow-up.'},
    {prompt:'Recruiter: “What attracted you to this position?”', transcript:'What attracted you to this position?', options:['The role combines analysis, collaboration and practical improvement, which matches my experience well.','Because I search a job in Australia.','I am attracted by the salary only.'], answer:'The role combines analysis, collaboration and practical improvement, which matches my experience well.', why:'It links motivation to the role and uses precise, natural vocabulary.'},
    {prompt:'Recruiter: “Do you have any questions for me?”', transcript:'Do you have any questions for me?', options:['Yes. What would success look like in the first six months?','No, I don’t have question.','What is your salary for me?'], answer:'Yes. What would success look like in the first six months?', why:'It is a clear, relevant question and uses would naturally.'}
  ];

  function speak(text){
    if(!('speechSynthesis' in window)) { alert('Speech synthesis is not available in this browser.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.accent;
    const voices = window.speechSynthesis.getVoices();
    const exact = voices.find(v => v.lang === state.accent);
    const base = voices.find(v => (v.lang || '').startsWith(state.accent.slice(0,2)));
    if(exact || base) utterance.voice = exact || base;
    utterance.rate = state.accent === 'en-AU' ? 0.93 : 0.95;
    window.speechSynthesis.speak(utterance);
  }

  function registerResult(key, correct){
    if(state.answeredKeys.has(key)) return;
    state.answeredKeys.add(key);
    state.attempted += 1;
    if(correct) state.correct += 1;
    updateScore();
  }

  function updateScore(){
    $('#overallScore').textContent = `${state.correct} / ${state.attempted}`;
  }

  function renderChoiceQuiz(containerId, data, prefix, options={}){
    const container = $('#'+containerId);
    container.innerHTML = data.map((item,i)=>{
      const answers = shuffle(item.options);
      return `<div class="${options.itemClass || 'quiz-item'} exam-hide-feedback" data-quiz-prefix="${prefix}" data-index="${i}">
        <h3>${options.showCategory ? `<span class="mode-badge">${item.category}</span> ` : ''}${i+1}. ${item.q}</h3>
        <div class="answers">${answers.map(a=>`<button class="answer" type="button" data-value="${escapeAttr(a)}">${a}</button>`).join('')}</div>
        <div class="button-row guided-only"><button class="btn ghost hint-btn" type="button" data-hint="${escapeAttr(item.hint || '')}">Hint</button></div>
        <div class="feedback" aria-live="polite"></div>
      </div>`;
    }).join('');
  }

  function escapeAttr(text){
    return String(text).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function handleChoiceAnswer(btn){
    const itemEl = btn.closest('[data-quiz-prefix]');
    if(!itemEl || itemEl.dataset.locked === '1') return;
    const prefix = itemEl.dataset.quizPrefix;
    const index = Number(itemEl.dataset.index);
    const dataset = prefix === 'diag' ? diagnostics : prefix === 'tense' ? tenseQuestions : accuracySets[prefix].items;
    const item = dataset[index];
    const selected = btn.dataset.value;
    const correct = selected === item.answer;
    itemEl.dataset.locked='1';
    $$('.answer',itemEl).forEach(b=>{
      b.classList.add('locked');
      if(b.dataset.value === item.answer) b.classList.add('correct');
    });
    if(!correct) btn.classList.add('wrong');
    const fb = $('.feedback',itemEl);
    fb.className='feedback '+(correct?'ok':'bad');
    fb.textContent=(correct?'Correct. ':'Not quite. ')+item.why;
    registerResult(`${prefix}-${index}`, correct);
  }

  function renderDiagnostics(){ renderChoiceQuiz('diagnosticContainer', diagnostics, 'diag', {itemClass:'diagnostic-item',showCategory:true}); }
  function renderTenses(){ renderChoiceQuiz('tenseQuiz', tenseQuestions, 'tense'); }

  function renderQuestionBuilders(){
    $('#questionBuilders').innerHTML = questionBuilders.map((item,i)=>{
      const shuffled = shuffle(item.tokens);
      return `<div class="builder-item" data-builder="${i}">
        <h3>${i+1}. ${item.prompt}</h3>
        <div class="token-bank">${shuffled.map((t,j)=>`<button class="token" type="button" data-token-index="${j}" data-token="${escapeAttr(t)}">${t}</button>`).join('')}</div>
        <div class="sentence-build"><span class="build-placeholder">Click words to build the question.</span></div>
        <div class="builder-actions"><button class="btn secondary builder-check" type="button">Check</button><button class="btn ghost builder-undo" type="button">Undo</button><button class="btn ghost builder-clear" type="button">Clear</button><button class="btn ghost hint-btn guided-only builder-hint" type="button">Hint</button></div>
        <div class="builder-feedback" aria-live="polite"></div>
      </div>`;
    }).join('');
  }

  function builderWords(el){ return $$('.sentence-build .token',el).map(b=>b.dataset.token).join(' ').replace(/\s+([?.!,])/g,'$1'); }

  function handleBuilderAction(btn){
    const itemEl=btn.closest('.builder-item');
    if(!itemEl) return;
    const idx=Number(itemEl.dataset.builder);
    const item=questionBuilders[idx];
    const build=$('.sentence-build',itemEl);
    if(btn.classList.contains('token')){
      if(btn.closest('.token-bank')){
        btn.classList.add('used');
        const clone=btn.cloneNode(true); clone.classList.remove('used'); clone.dataset.sourceIndex=btn.dataset.tokenIndex; build.querySelector('.build-placeholder')?.remove(); build.appendChild(clone);
      } else {
        const source=$(`.token-bank .token[data-token-index="${btn.dataset.sourceIndex}"]`,itemEl); if(source) source.classList.remove('used'); btn.remove(); if(!$('.token',build)) build.innerHTML='<span class="build-placeholder">Click words to build the question.</span>';
      }
      return;
    }
    if(btn.classList.contains('builder-undo')){
      const placed=$$('.sentence-build .token',itemEl).pop(); if(placed) placed.click(); return;
    }
    if(btn.classList.contains('builder-clear')){
      $$('.sentence-build .token',itemEl).forEach(t=>t.click()); $('.builder-feedback',itemEl).textContent=''; return;
    }
    if(btn.classList.contains('builder-hint')){
      $('.builder-feedback',itemEl).className='builder-feedback neutral'; $('.builder-feedback',itemEl).textContent='Hint: '+item.hint; return;
    }
    if(btn.classList.contains('builder-check')){
      const answer=builderWords(itemEl); const ok=normalize(answer)===normalize(item.answer); const fb=$('.builder-feedback',itemEl); fb.className='builder-feedback '+(ok?'ok':'bad'); fb.textContent=ok?'Correct. Question architecture is secure.':`Not quite. Model: ${item.answer}`; registerResult(`builder-${idx}`,ok);
    }
  }

  function renderTransforms(){
    $('#questionTransform').innerHTML=transformQuestions.map((item,i)=>`<div class="transform-item" data-transform="${i}"><label>${i+1}. Answer: “${item.answerLine}”</label><div class="answer-line"><input type="text" placeholder="Write the recruiter question…"/><button class="btn secondary transform-check" type="button">Check</button></div><div class="button-row guided-only"><button class="btn ghost hint-btn transform-hint" type="button">Hint</button><button class="btn ghost speak-text" data-text="${escapeAttr(item.model)}" type="button">🔊 Model audio</button></div><div class="feedback"></div></div>`).join('');
  }

  function handleTransform(btn){
    const el=btn.closest('.transform-item'); if(!el)return; const idx=Number(el.dataset.transform), item=transformQuestions[idx], fb=$('.feedback',el);
    if(btn.classList.contains('transform-hint')){fb.className='feedback neutral';fb.textContent='Hint: '+item.hint;return;}
    const val=$('input',el).value; const ok=item.accepted.map(normalize).includes(normalize(val)); fb.className='feedback '+(ok?'ok':'bad'); fb.textContent=ok?'Correct.':`Try again. Model: ${item.model}`; registerResult(`transform-${idx}`,ok);
  }

  function renderAccuracy(tab='agreement'){
    $$('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
    const set=accuracySets[tab];
    $('#accuracyContent').innerHTML=`<p class="explain-box">${set.intro}</p><div id="accuracyQuiz"></div>`;
    renderChoiceQuiz('accuracyQuiz',set.items,tab,{itemClass:'accuracy-item'});
  }

  function setupVocab(){
    const select=$('#vocabCategory'); select.innerHTML=Object.keys(vocab).map(k=>`<option>${k}</option>`).join('');
    renderVocab(select.value); select.addEventListener('change',e=>renderVocab(e.target.value));
  }
  function renderVocab(cat){
    $('#vocabCards').innerHTML=vocab[cat].map(v=>`<article class="vocab-card"><h3><span><span class="icon">${v.icon}</span>${v.term}</span><button class="listen-chip" type="button" data-speak="${escapeAttr(v.ex)}" aria-label="Listen to example">🔊</button></h3><p class="fr french-help">${v.fr}</p><p>${v.def}</p><p class="example">“${v.ex}”</p></article>`).join('');
  }

  function renderScrambles(){
    $('#scrambleContainer').innerHTML=scrambleSentences.map((item,i)=>{
      const tokens=shuffle(item.tokens);
      return `<div class="scramble-item" data-scramble="${i}"><div class="scramble-header"><h3>${i+1}. Build the sentence</h3><span class="mini-score">accuracy first</span></div><div class="token-bank">${tokens.map((t,j)=>`<button class="token" type="button" data-token-index="${j}" data-token="${escapeAttr(t)}">${t}</button>`).join('')}</div><div class="sentence-build"><span class="build-placeholder">Click words in order.</span></div><div class="builder-actions"><button class="btn secondary scramble-check guided-only" type="button">Check</button><button class="btn ghost scramble-undo" type="button">Undo</button><button class="btn ghost scramble-clear" type="button">Clear</button><button class="btn ghost hint-btn guided-only scramble-hint" type="button">Hint</button></div><div class="builder-feedback"></div></div>`;
    }).join('');
    state.scrambleResults={};
  }

  function handleScrambleAction(btn){
    const el=btn.closest('.scramble-item'); if(!el)return; const idx=Number(el.dataset.scramble), item=scrambleSentences[idx], build=$('.sentence-build',el);
    if(btn.classList.contains('token')){
      if(btn.closest('.token-bank')){btn.classList.add('used'); const clone=btn.cloneNode(true); clone.classList.remove('used'); clone.dataset.sourceIndex=btn.dataset.tokenIndex; build.querySelector('.build-placeholder')?.remove(); build.appendChild(clone);} else {const source=$(`.token-bank .token[data-token-index="${btn.dataset.sourceIndex}"]`,el); if(source) source.classList.remove('used'); btn.remove(); if(!$('.token',build)) build.innerHTML='<span class="build-placeholder">Click words in order.</span>';}
      return;
    }
    if(btn.classList.contains('scramble-undo')){const placed=$$('.sentence-build .token',el).pop(); if(placed)placed.click();return;}
    if(btn.classList.contains('scramble-clear')){$$('.sentence-build .token',el).forEach(t=>t.click()); $('.builder-feedback',el).textContent='';return;}
    if(btn.classList.contains('scramble-hint')){const fb=$('.builder-feedback',el);fb.className='builder-feedback neutral';fb.textContent='Hint: '+item.hint;return;}
    if(btn.classList.contains('scramble-check')){gradeScramble(idx,true);}
  }

  function builtScramble(idx){const el=$(`.scramble-item[data-scramble="${idx}"]`);return builderWords(el);}
  function gradeScramble(idx,show){
    const item=scrambleSentences[idx], answer=builtScramble(idx), ok=normalize(answer)===normalize(item.answer), el=$(`.scramble-item[data-scramble="${idx}"]`); state.scrambleResults[idx]=ok;
    if(show){const fb=$('.builder-feedback',el);fb.className='builder-feedback '+(ok?'ok':'bad');fb.textContent=ok?'Correct.':`Not quite. Model: ${item.answer}`;}
    registerResult(`scramble-${idx}`,ok); return ok;
  }
  function submitScrambleExam(){
    let score=0; scrambleSentences.forEach((_,i)=>{if(gradeScramble(i,false))score++;}); const box=$('#scrambleSummary');box.classList.remove('hidden');box.textContent=`VTest-style pre-writing result: ${score}/${scrambleSentences.length}. Review the sentences that felt slow: they show which grammar patterns still need automation.`;
    scrambleSentences.forEach((item,i)=>{const el=$(`.scramble-item[data-scramble="${i}"]`),fb=$('.builder-feedback',el),ok=state.scrambleResults[i];fb.className='builder-feedback '+(ok?'ok':'bad');fb.textContent=ok?'Correct.':`Model: ${item.answer}`;});
  }

  function renderRejoinders(){
    $('#rejoinderContainer').innerHTML=rejoinders.map((item,i)=>{const opts=shuffle(item.options);return `<div class="rejoinder-item" data-rejoinder="${i}"><div class="rejoinder-top"><h3>${i+1}. Listen and respond</h3><button class="btn primary speak-rejoinder" type="button">🔊 Play</button></div><div class="button-row guided-only"><button class="btn ghost transcript-toggle" type="button">Transcript</button></div><div class="transcript hidden">${item.transcript}</div><div class="answers">${opts.map(o=>`<button class="answer rejoinder-answer" type="button" data-value="${escapeAttr(o)}">${o}</button>`).join('')}</div><div class="feedback"></div></div>`}).join('');
    state.selectedRejoinders={};
  }
  function selectRejoinder(btn){
    const el=btn.closest('.rejoinder-item'); const idx=Number(el.dataset.rejoinder); $$('.answer',el).forEach(b=>b.classList.remove('selected')); btn.classList.add('selected'); state.selectedRejoinders[idx]=btn.dataset.value;
    if(state.mode==='guided'){gradeRejoinder(idx,true);}
  }
  function gradeRejoinder(idx,show){
    const item=rejoinders[idx], selected=state.selectedRejoinders[idx]||'', ok=selected===item.answer, el=$(`.rejoinder-item[data-rejoinder="${idx}"]`); if(show){$$('.answer',el).forEach(b=>{b.classList.remove('correct','wrong'); if(b.dataset.value===item.answer)b.classList.add('correct'); if(b.dataset.value===selected && !ok)b.classList.add('wrong');}); const fb=$('.feedback',el);fb.className='feedback '+(ok?'ok':'bad');fb.textContent=(ok?'Correct. ':'Not quite. ')+item.why;} registerResult(`rejoinder-${idx}`,ok); return ok;
  }
  function submitRejoinderExam(){let score=0;rejoinders.forEach((_,i)=>{if(gradeRejoinder(i,true))score++;});const box=$('#rejoinderSummary');box.classList.remove('hidden');box.textContent=`VTest-style rejoinder result: ${score}/${rejoinders.length}. The goal is not only grammar: choose the response that best fits meaning, register and situation.`;}

  function setupTimer(startId,resetId,displayId,stateKey,idKey,defaultSeconds){
    const update=()=>{const sec=state[stateKey]; const m=String(Math.floor(sec/60)).padStart(2,'0'),s=String(sec%60).padStart(2,'0'); $('#'+displayId).textContent=`${m}:${s}`;};
    $('#'+startId).addEventListener('click',()=>{if(state[idKey])return; if(state[stateKey]<=0)state[stateKey]=defaultSeconds; update(); state[idKey]=setInterval(()=>{state[stateKey]--;update();if(state[stateKey]<=0){clearInterval(state[idKey]);state[idKey]=null;speak('Time. Finish your current sentence.');}},1000);});
    $('#'+resetId).addEventListener('click',()=>{if(state[idKey])clearInterval(state[idKey]);state[idKey]=null;state[stateKey]=defaultSeconds;update();});
    update();
  }

  function updateProgress(){const total=$$('[data-track="section"]').length;const pct=Math.round((state.completed.size/total)*100);$('#progressBar').style.width=pct+'%';$('#progressText').textContent=pct+'%';}

  function setMode(mode){
    state.mode=mode; document.body.classList.toggle('mode-exam',mode==='exam');
    if(mode==='exam'){
      $('#submitScrambleExam').classList.remove('hidden'); $('#submitRejoinderExam').classList.remove('hidden');
    } else {
      $('#submitScrambleExam').classList.add('hidden'); $('#submitRejoinderExam').classList.add('hidden');
    }
  }

  function checkWriting(){
    const text=$('#writingAnswer').value.trim(), words=text?text.split(/\s+/).filter(Boolean):[], lower=' '+text.toLowerCase()+' ';
    const connectors=['however','although','because','therefore','as a result','in addition','whereas','while','on the other hand'];
    const connectorCount=connectors.filter(c=>lower.includes(c)).length;
    const hasPosition=/\b(i think|in my view|i believe|in my opinion)\b/i.test(text);
    const hasSolution=/\b(could|should|would suggest|recommend|solution|to avoid this)\b/i.test(text);
    const box=$('#writingFeedback');
    const messages=[]; if(words.length<95)messages.push(`Build toward 100 words (currently ${words.length}).`); else messages.push(`Length is on target (${words.length} words).`); if(connectorCount<2)messages.push('Add at least two clear connectors.'); else messages.push('You are using a useful range of connectors.'); if(!hasPosition)messages.push('State your position explicitly.'); if(!hasSolution)messages.push('Add a practical solution or recommendation.');
    const good=words.length>=95 && connectorCount>=2 && hasPosition && hasSolution; box.className='feedback-box '+(good?'ok':'warn'); box.innerHTML=messages.map(m=>`• ${m}`).join('<br>');
  }

  function updateWordCount(){const text=$('#writingAnswer').value.trim();const n=text?text.split(/\s+/).filter(Boolean).length:0;$('#wordCount').textContent=`${n} word${n===1?'':'s'}`;}

  function downloadResults(){
    const total=$$('[data-track="section"]').length;
    const fields=[['Time-envelope answer','timeEnvelopeAnswer'],['Speaking notes','speakingNotes'],['Writing answer','writingAnswer'],['Final reflection','finalNotes'],['Tense error log','logTense'],['Question error log','logQuestion'],['Article/preposition log','logSmallWord'],['Next reflex','logReflex']];
    const content=[
      'ANTOINE · VTEST PRECISION UNDER PRESSURE',
      'Interactive lesson results',
      '=========================================',
      `Mode: ${state.mode}`,
      `Completed sections: ${state.completed.size}/${total}`,
      `Automatically checked score: ${state.correct}/${state.attempted}`,
      `Confidence: ${state.confidence || 'not selected'}/5`,
      '',
      ...fields.flatMap(([label,id])=>[label+':',($('#'+id)?.value||'').trim()||'(blank)',''])
    ].join('\n');
    const blob=new Blob([content],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Antoine_VTest_Precision_Lesson_results.txt';a.click();URL.revokeObjectURL(a.href);
  }

  function resetAll(){
    if(!confirm('Reset all answers, scores, timers and progress?'))return;
    window.speechSynthesis?.cancel();
    [state.scrambleTimerId,state.speakingTimerId,state.finalTimerId].forEach(id=>{if(id)clearInterval(id)});
    state.completed.clear();state.confidence=null;state.correct=0;state.attempted=0;state.answeredKeys.clear();state.scrambleTimerId=null;state.speakingTimerId=null;state.finalTimerId=null;state.scrambleSeconds=420;state.speakingSeconds=60;state.finalSeconds=90;state.selectedRejoinders={};state.scrambleResults={};
    $$('input[type="text"],textarea').forEach(el=>el.value='');$$('input[type="checkbox"]').forEach(el=>el.checked=false);$$('.done-btn').forEach(b=>{b.classList.remove('completed');b.textContent='✓ Mark complete'});$$('.rating button').forEach(b=>b.classList.remove('selected'));$$('.models').forEach(m=>m.classList.add('hidden'));$('#writingFeedback').textContent='';$('#scrambleSummary').classList.add('hidden');$('#rejoinderSummary').classList.add('hidden');
    renderDiagnostics();renderTenses();renderQuestionBuilders();renderTransforms();renderAccuracy('agreement');renderScrambles();renderRejoinders();updateWordCount();updateScore();updateProgress();
    $('#scrambleTimer').textContent='07:00';$('#speakingTimer').textContent='01:00';$('#finalTimer').textContent='01:30';
  }

  document.addEventListener('click',e=>{
    const done=e.target.closest('.done-btn'); if(done){const section=done.closest('[data-track="section"]'),idx=$$('[data-track="section"]').indexOf(section);if(state.completed.has(idx)){state.completed.delete(idx);done.classList.remove('completed');done.textContent='✓ Mark complete'}else{state.completed.add(idx);done.classList.add('completed');done.textContent='✓ Completed'}updateProgress();return;}
    const speakBtn=e.target.closest('[data-speak]'); if(speakBtn){speak(speakBtn.dataset.speak);return;}
    const textBtn=e.target.closest('.speak-text'); if(textBtn){speak(textBtn.dataset.text);return;}
    const targetBtn=e.target.closest('.speak-target'); if(targetBtn){const t=$('#'+targetBtn.dataset.target);if(t)speak(t.textContent);return;}
    const hintBtn=e.target.closest('[data-hint]'); if(hintBtn && !hintBtn.closest('.builder-item')){const parent=hintBtn.closest('[data-quiz-prefix]'); if(parent){const existing=parent.querySelector('.hint-box');if(existing)existing.remove();else{const box=document.createElement('div');box.className='hint-box';box.textContent='Hint: '+hintBtn.dataset.hint;parent.appendChild(box);}return;}}
    const answer=e.target.closest('[data-quiz-prefix] .answer'); if(answer){handleChoiceAnswer(answer);return;}
    const builderAction=e.target.closest('.builder-item .token,.builder-check,.builder-undo,.builder-clear,.builder-hint'); if(builderAction){handleBuilderAction(builderAction);return;}
    const transform=e.target.closest('.transform-check,.transform-hint'); if(transform){handleTransform(transform);return;}
    const tab=e.target.closest('.tab-btn'); if(tab){renderAccuracy(tab.dataset.tab);return;}
    const scramble=e.target.closest('.scramble-item .token,.scramble-check,.scramble-undo,.scramble-clear,.scramble-hint'); if(scramble){handleScrambleAction(scramble);return;}
    const rejPlay=e.target.closest('.speak-rejoinder'); if(rejPlay){const idx=Number(rejPlay.closest('.rejoinder-item').dataset.rejoinder);speak(rejoinders[idx].prompt);return;}
    const transcript=e.target.closest('.transcript-toggle'); if(transcript){transcript.closest('.rejoinder-item').querySelector('.transcript').classList.toggle('hidden');return;}
    const rejAns=e.target.closest('.rejoinder-answer'); if(rejAns){selectRejoinder(rejAns);return;}
    const model=e.target.closest('.model-toggle'); if(model){const box=$('#'+model.dataset.model);box.classList.toggle('hidden');model.textContent=box.classList.contains('hidden')?'Show two models':'Hide models';return;}
    const rating=e.target.closest('#confidenceRating button'); if(rating){$$('#confidenceRating button').forEach(b=>b.classList.remove('selected'));rating.classList.add('selected');state.confidence=Number(rating.dataset.score);return;}
  });

  $('#modeSelect').addEventListener('change',e=>setMode(e.target.value));
  $('#accentSelect').addEventListener('change',e=>state.accent=e.target.value);
  $('#toggleFrench').addEventListener('click',()=>{document.body.classList.toggle('show-french');const on=document.body.classList.contains('show-french');$('#toggleFrench').textContent=`🇫🇷 French help: ${on?'ON':'OFF'}`;renderVocab($('#vocabCategory').value);});
  $('#downloadResults').addEventListener('click',downloadResults);
  $('#resetLesson').addEventListener('click',resetAll);
  $('#submitScrambleExam').addEventListener('click',submitScrambleExam);
  $('#submitRejoinderExam').addEventListener('click',submitRejoinderExam);
  $('#writingAnswer').addEventListener('input',updateWordCount);
  $('#checkWriting').addEventListener('click',checkWriting);
  $('#writingHint').addEventListener('click',()=>{const box=$('#writingFeedback');box.className='feedback-box warn';box.innerHTML='Use a 4-part frame: <strong>position → advantage → difficulty → practical solution</strong>. Try to include <em>however</em> plus one result/solution connector.';});

  renderDiagnostics();
  renderTenses();
  renderQuestionBuilders();
  renderTransforms();
  renderAccuracy('agreement');
  setupVocab();
  renderScrambles();
  renderRejoinders();
  setupTimer('startScrambleTimer','resetScrambleTimer','scrambleTimer','scrambleSeconds','scrambleTimerId',420);
  setupTimer('startSpeakingTimer','resetSpeakingTimer','speakingTimer','speakingSeconds','speakingTimerId',60);
  setupTimer('startFinalTimer','resetFinalTimer','finalTimer','finalSeconds','finalTimerId',90);
  setMode('guided');
  updateWordCount();
  updateScore();
  updateProgress();
})();
