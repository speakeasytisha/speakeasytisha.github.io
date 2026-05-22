/* SpeakEasyTisha · Isabelle Job Abroad Realty Lab */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const state = {
    accent: 'en-GB',
    voices: [],
    scores: { vocab: 0, grammar: 0, interview: 0, phone: 0 },
    answered: new Set(),
    currentQuestion: null,
    currentCall: null,
    currentMission: null,
    timerId: null,
    timerRemaining: 60
  };

  const vocab = [
    { icon:'🧭', category:'job', term:'career move', fr:'évolution professionnelle / changement de carrière', definition:'A professional change or step toward a new role or country.', example:'Moving to the Netherlands is an important career move for you.' },
    { icon:'🏢', category:'job', term:'real estate agency', fr:'agence immobilière', definition:'A company that sells, rents or manages properties for clients.', example:'You would like to work in a real estate agency in or around Amsterdam.' },
    { icon:'🌐', category:'job', term:'international profile', fr:'profil international', definition:'A professional profile suitable for work with different countries or cultures.', example:'Your legal and commercial background can become a strong international profile.' },
    { icon:'🤝', category:'job', term:'professional network', fr:'réseau professionnel', definition:'People and contacts who can help with work opportunities.', example:'You would like to build a professional network with real estate agencies.' },
    { icon:'📄', category:'job', term:'to apply for a position', fr:'postuler à un poste', definition:'To send your CV or contact an employer because you want a job.', example:'You may apply for a position as a real estate legal specialist.' },
    { icon:'📞', category:'job', term:'to contact potential employers', fr:'contacter des employeurs potentiels', definition:'To call or write to companies that may be interested in your profile.', example:'You want to feel confident contacting potential employers in English.' },

    { icon:'💼', category:'profile', term:'dual expertise', fr:'double compétence', definition:'Strong experience in two professional areas.', example:'You have dual expertise in legal and commercial real estate.' },
    { icon:'⚖️', category:'profile', term:'legal expertise', fr:'expertise juridique', definition:'Specialized legal knowledge used in professional situations.', example:'Your legal expertise helps you understand risks and contracts.' },
    { icon:'📈', category:'profile', term:'commercial experience', fr:'expérience commerciale', definition:'Experience related to sales, clients, negotiation and business activity.', example:'Your commercial experience helps you understand client expectations.' },
    { icon:'🎯', category:'profile', term:'strength', fr:'point fort / force', definition:'A professional quality or skill that helps you succeed.', example:'One of your strengths is your ability to listen carefully to clients.' },
    { icon:'🔄', category:'profile', term:'adaptability', fr:'capacité d’adaptation', definition:'The ability to adjust to different people, situations or environments.', example:'Adaptability is important when working with different clients abroad.' },
    { icon:'🧩', category:'profile', term:'to combine', fr:'combiner / associer', definition:'To bring two or more skills or experiences together.', example:'You combine legal expertise with commercial experience.' },

    { icon:'🏗️', category:'legal', term:'property developer', fr:'promoteur immobilier', definition:'A company or person that develops property projects for sale or rent.', example:'You have worked with property developers for many years.' },
    { icon:'📑', category:'legal', term:'contract drafting', fr:'rédaction de contrats', definition:'The process of writing legal contracts.', example:'Contract drafting is part of your legal real estate experience.' },
    { icon:'🔍', category:'legal', term:'to identify risks', fr:'identifier les risques', definition:'To find possible legal, financial or practical problems before they happen.', example:'Your role involved identifying risks and giving practical advice.' },
    { icon:'🧾', category:'legal', term:'legal advice', fr:'conseil juridique', definition:'Professional guidance about legal questions.', example:'You can give legal advice related to real estate operations.' },
    { icon:'🏛️', category:'legal', term:'urban planning', fr:'urbanisme', definition:'Rules and decisions about how land and buildings can be used or developed.', example:'Your experience in urban planning could help clients with renovation projects.' },
    { icon:'📝', category:'legal', term:'sale before completion', fr:'vente en état futur d’achèvement / VEFA', definition:'A property sale where the buyer purchases before construction is completed.', example:'You can explain sale before completion using simple professional English.' },

    { icon:'🏷️', category:'sales', term:'sales manager', fr:'responsable des ventes', definition:'A person responsible for sales activity, clients, targets and sometimes a team.', example:'As a sales manager, you worked with different types of clients.' },
    { icon:'💶', category:'sales', term:'annual sales budget', fr:'budget annuel des ventes', definition:'The amount of sales revenue or fees managed over one year.', example:'You were responsible for an annual sales budget of one million euros.' },
    { icon:'🏡', category:'sales', term:'to sell properties', fr:'vendre des biens immobiliers', definition:'To help clients buy or sell houses, flats, offices or land.', example:'You have experience in selling different types of properties across France.' },
    { icon:'🧑‍💼', category:'sales', term:'private individual', fr:'particulier', definition:'A person acting for themselves, not for a company.', example:'You worked with professionals and private individuals.' },
    { icon:'💬', category:'sales', term:'to negotiate', fr:'négocier', definition:'To discuss price or conditions in order to reach an agreement.', example:'You have experience in negotiating real estate transactions.' },
    { icon:'👍', category:'sales', term:'to recommend', fr:'recommander / conseiller', definition:'To suggest the best option for a person’s needs.', example:'You can recommend the right property to the right client.' },

    { icon:'👂', category:'client', term:'to listen carefully', fr:'écouter attentivement', definition:'To pay close attention before answering or advising.', example:'You listen carefully before speaking so that you can understand the client’s needs.' },
    { icon:'🎯', category:'client', term:'client needs', fr:'besoins du client', definition:'What a client wants, expects or needs from a property or service.', example:'Understanding client needs is essential in real estate.' },
    { icon:'🌟', category:'client', term:'expectations', fr:'attentes', definition:'What someone hopes to receive or achieve.', example:'You ask questions to understand the client’s expectations.' },
    { icon:'🗣️', category:'client', term:'to advise clients', fr:'conseiller les clients', definition:'To give guidance, recommendations or professional opinions.', example:'You would like to advise clients clearly in English.' },
    { icon:'🧠', category:'client', term:'to analyse a situation', fr:'analyser une situation', definition:'To study a situation carefully to understand the problem and solution.', example:'Your legal background helps you analyse complex situations.' },
    { icon:'✅', category:'client', term:'appropriate solution', fr:'solution adaptée / appropriée', definition:'A solution that fits the client’s needs and situation.', example:'You can help clients find an appropriate solution.' },

    { icon:'📞', category:'phone', term:'May I speak to…?', fr:'Puis-je parler à… ?', definition:'A polite phrase when you call a company and want to speak to someone.', example:'May I speak to the recruitment manager, please?' },
    { icon:'❓', category:'phone', term:'I am calling to ask about…', fr:'J’appelle pour me renseigner sur…', definition:'A clear way to explain the purpose of a call.', example:'I am calling to ask about job opportunities in your agency.' },
    { icon:'🔁', category:'phone', term:'Could you repeat that, please?', fr:'Pouvez-vous répéter, s’il vous plaît ?', definition:'A polite way to ask someone to say something again.', example:'Could you repeat the email address, please?' },
    { icon:'🔤', category:'phone', term:'Could you spell that for me?', fr:'Pouvez-vous l’épeler pour moi ?', definition:'A polite way to ask for the spelling of a name, street or email.', example:'Could you spell the name of the agency for me?' },
    { icon:'📨', category:'phone', term:'I will send you my CV', fr:'Je vous enverrai mon CV', definition:'A useful phrase after a professional phone call.', example:'Thank you. I will send you my CV by email today.' },
    { icon:'🙏', category:'phone', term:'Thank you for your time', fr:'Merci pour votre temps', definition:'A polite phrase to end a professional conversation.', example:'Thank you for your time. I hope to hear from you soon.' }
  ];

  const vocabQuizBank = [
    { key:'vq1', q:'Which phrase means “double compétence”?', options:['dual expertise','double experience','two knowledges'], answer:0, tip:'“Dual expertise” is natural and professional.' },
    { key:'vq2', q:'Which word means “particulier” in a client context?', options:['particular person','private individual','personal client only'], answer:1, tip:'A “private individual” is a person acting for themselves.' },
    { key:'vq3', q:'Which phrase is best for “responsable d’un budget annuel”?', options:['responsible for an annual budget','responsible of a year budget','in charge to budget'], answer:0, tip:'Use “responsible for”.' },
    { key:'vq4', q:'Which phrase means “conseiller les clients”?', options:['advice clients','advise clients','advices clients'], answer:1, tip:'“Advise” is the verb; “advice” is the noun.' },
    { key:'vq5', q:'Which phrase is best for calling an agency?', options:['I call for know jobs.','I am calling to ask about job opportunities.','I phone to ask work.'], answer:1, tip:'“I am calling to ask about…” is clear and polite.' },
    { key:'vq6', q:'Which phrase means “identifier les risques”?', options:['identify risks','see dangers','make risks'], answer:0, tip:'“Identify risks” is strong professional vocabulary.' }
  ];

  const warmups = [
    { title:'Your background', cues:['24 years','real estate','legal + commercial'], model:'I have worked in real estate for 24 years, with both legal and commercial responsibilities.' },
    { title:'Your client style', cues:['listen carefully','understand needs','advise'], model:'I listen carefully to clients before speaking so that I can understand their needs and offer appropriate advice.' },
    { title:'Your sales responsibility', cues:['sales manager','annual budget','one million euros'], model:'As a sales manager, I was responsible for an annual sales budget of one million euros.' },
    { title:'Your Netherlands goal', cues:['Amsterdam','real estate agency','international profile'], model:'I would like to find a job in or around Amsterdam and use my experience in an international real estate environment.' }
  ];

  const grammar = [
    {
      id:'present-perfect', title:'1. Present perfect + for: your experience is connected to now', badge:'Career profile',
      rule:'Use the present perfect when your past experience is part of your current professional profile. Use “for” with a duration.',
      formula:'I have worked + in/with/as + for + duration',
      examples:['I have worked in real estate for 24 years.','I have worked with property developers.','I have developed legal and commercial expertise.'],
      practice:{ type:'selects', key:'g1', items:[
        { before:'I ___ in real estate for 24 years.', answer:'have worked', options:['worked','have worked','am working'] },
        { before:'I have worked in legal departments ___ 14 years.', answer:'for', options:['during','for','since'] },
        { before:'I ___ with property developers in France.', answer:'have worked', options:['have worked','have work','worked since'] }
      ]}
    },
    {
      id:'past-simple', title:'2. Past simple: specific past roles and dates', badge:'Career timeline',
      rule:'Use the past simple for a specific finished job, period or responsibility in the past.',
      formula:'I worked / I managed / I coordinated / I was responsible for',
      examples:['I worked as a sales manager for ten years.','I coordinated a small sales team.','I was responsible for an annual sales budget of one million euros.'],
      practice:{ type:'mcq', key:'g2', question:'Which sentence is the most professional?', options:['I was responsible for an annual sales budget of one million euros.','I was responsible of one million euros budget.','I had charge for one million budget.'], answer:0, tip:'Use “responsible for + noun”.' }
    },
    {
      id:'gerund', title:'3. Experience in + -ing', badge:'Natural structure',
      rule:'After “experience in”, use a noun or the -ing form of a verb.',
      formula:'I have experience in + noun / -ing',
      examples:['I have experience in selling properties.','I have experience in negotiating contracts.','I have experience in advising clients.'],
      practice:{ type:'order', key:'g3', answer:['I','have','experience','in','selling','different','types','of','properties'], tip:'Pattern: I have experience in + -ing.' }
    },
    {
      id:'purpose', title:'4. Explain your goals: so that / in order to', badge:'Project abroad',
      rule:'Use “so that” or “in order to” when you explain why you want to improve your English or move abroad.',
      formula:'I would like to… so that I can…',
      examples:['I would like to improve my English so that I can advise clients confidently.','I am building my network in order to find opportunities in Amsterdam.','I want to practise phone calls so that I can contact agencies.'],
      practice:{ type:'selects', key:'g4', items:[
        { before:'I would like to improve my English ___ I can contact agencies.', answer:'so that', options:['because to','so that','for to'] },
        { before:'I am building my network ___ find opportunities.', answer:'in order to', options:['in order to','in the goal to','for to'] },
        { before:'I want to practise phone calls ___ I can feel more confident.', answer:'so that', options:['so that','for','with the goal'] }
      ]}
    },
    {
      id:'advice-advise', title:'5. Advice vs advise', badge:'Professional accuracy',
      rule:'“Advice” is the noun. “Advise” is the verb. This is useful for legal and client communication.',
      formula:'I give advice. / I advise clients.',
      examples:['I give legal advice to clients.','I advise clients on real estate matters.','I would like to advise clients clearly in English.'],
      practice:{ type:'mcq', key:'g5', question:'Choose the correct sentence.', options:['I can advice clients professionally.','I can advise clients professionally.','I can give advices to clients.'], answer:1, tip:'Use “advise” as the verb. “Advice” has no plural “s”.' }
    },
    {
      id:'polite-questions', title:'6. Polite questions for employers', badge:'Phone + interview',
      rule:'Use polite question forms when you contact a company or ask about opportunities.',
      formula:'Could you tell me…? / I would like to know whether…',
      examples:['Could you tell me whether your agency is recruiting?','I would like to know whether you are open to international profiles.','May I send you my CV by email?'],
      practice:{ type:'order', key:'g6', answer:['Could','you','tell','me','whether','your','agency','is','recruiting'], tip:'Polite question pattern: Could you tell me whether…' }
    }
  ];

  const questions = [
    { q:'Can you tell me about your professional background?', cues:['24 years','legal + commercial','real estate'], model:'I have worked in real estate for 24 years, combining legal expertise with commercial experience. I have worked in sales and in legal departments, which gives me a complete view of real estate transactions.' },
    { q:'What are your main strengths?', cues:['experience','legal knowledge','listening to clients'], model:'My main strengths are my experience, my legal knowledge and my ability to understand clients’ needs. I listen carefully before speaking so that I can offer appropriate advice.' },
    { q:'Why would you like to work in the Netherlands?', cues:['Amsterdam','partner','international challenge'], model:'I would like to work in the Netherlands because I am planning to move to Amsterdam and take on a new professional challenge in an international environment.' },
    { q:'What can you bring to a real estate agency?', cues:['client needs','sales','legal risk'], model:'I can bring strong real estate experience, a client-focused approach and legal knowledge. I can understand client needs, recommend suitable properties and help identify risks.' },
    { q:'How did your sales experience help you?', cues:['different clients','properties','annual budget'], model:'My sales experience helped me adapt to different clients and properties. As a sales manager, I was responsible for an annual sales budget of one million euros.' },
    { q:'Why is English important for your project?', cues:['clients','employers','phone calls'], model:'English is important because I need to contact potential employers, answer phone calls, communicate with clients and explain my experience clearly.' }
  ];

  const upgrades = [
    { title:'Professional headline', before:'I worked in law and sales.', after:'I combine legal expertise with commercial experience in real estate.' },
    { title:'Sales responsibility', before:'I had a budget of one million euros.', after:'I was responsible for an annual sales budget of one million euros.' },
    { title:'Client communication', before:'I can understand clients.', after:'I listen carefully to clients before speaking so that I can understand their expectations.' },
    { title:'Job search', before:'I want to find a job in Amsterdam.', after:'I am looking for opportunities in or around Amsterdam in the real estate sector.' },
    { title:'Legal role', before:'I worked as a lawyer in companies.', after:'I worked as a real estate legal specialist in legal departments.' },
    { title:'Professional goal', before:'I want to improve my English.', after:'I would like to improve my English so that I can communicate confidently with clients and employers.' }
  ];

  const phonePhrases = [
    { phrase:'Good morning, my name is Isabelle Davion.', fr:'Bonjour, je m’appelle Isabelle Davion.' },
    { phrase:'I am calling to ask about job opportunities.', fr:'J’appelle pour me renseigner sur les opportunités d’emploi.' },
    { phrase:'Could I speak to the recruitment manager, please?', fr:'Puis-je parler à la personne chargée du recrutement ?' },
    { phrase:'Could you repeat the email address, please?', fr:'Pouvez-vous répéter l’adresse e-mail, s’il vous plaît ?' },
    { phrase:'May I send you my CV by email?', fr:'Puis-je vous envoyer mon CV par e-mail ?' },
    { phrase:'Thank you for your time. I hope to hear from you soon.', fr:'Merci pour votre temps. J’espère avoir bientôt de vos nouvelles.' }
  ];

  const callScenarios = [
    { title:'Call A · First contact with an agency', situation:'You call a real estate agency in Amsterdam. You want to know if they are recruiting.', tasks:['Introduce yourself.','Explain your legal and commercial background.','Ask if they are recruiting.','Ask if you can send your CV.'], support:['Good morning, my name is Isabelle Davion.','I have 24 years of experience in real estate.','I combine legal expertise with commercial experience.','May I send you my CV by email?'] },
    { title:'Call B · The person speaks quickly', situation:'The agency gives you an email address and a name, but the person speaks quickly.', tasks:['Ask them to repeat.','Ask them to spell the name.','Repeat the email address back.','Thank them politely.'], support:['Could you repeat that, please?','Could you spell the name for me?','Let me repeat that back to you.','Thank you for your time.'] },
    { title:'Call C · Networking call', situation:'You call an agency to build a professional connection, not to ask directly for a job.', tasks:['Introduce your project.','Explain that you are moving to Amsterdam.','Ask for advice about the real estate market.','Offer to send your profile.'], support:['I am planning to move to Amsterdam.','I would like to build my professional network.','Could you give me some advice about the market?','I would be happy to send you my profile.'] },
    { title:'Call D · Follow-up after sending a CV', situation:'You sent your CV last week and you call to follow up politely.', tasks:['Say why you are calling.','Mention your CV.','Ask if they need more information.','End politely.'], support:['I am calling to follow up on my CV.','I sent it last week by email.','Please let me know if you need any further information.','Thank you again for your time.'] }
  ];

  const achievementQuiz = [
    { key:'a1', question:'How should you say “1 000 000 € per year” professionally?', options:['one million euros per year','one thousand thousand euros by year','one million of euros every year'], answer:0 },
    { key:'a2', question:'Which sentence is best?', options:['I was in charge of sales and client relations.','I was charged of sales.','I was the charge for sales.'], answer:0 },
    { key:'a3', question:'Which sentence is best for CV/interview English?', options:['I coordinated a small sales team.','I coordinated with small team sales.','I made coordination for team.'], answer:0 }
  ];

  const missions = [
    { title:'Mission 1 · Introduce your professional profile', prompt:'Speak for 60 seconds. Explain who you are professionally and what makes your profile strong.', keywords:['24 years','legal expertise','commercial experience','real estate'], support:['I have worked in real estate for…','I combine… with…','My main strengths are…','I would like to…'] },
    { title:'Mission 2 · Explain your Netherlands project', prompt:'Speak for 60 seconds. Explain why you want to work in the Netherlands and what type of role you are looking for.', keywords:['Amsterdam','real estate agency','legal role','international environment'], support:['I am planning to move to…','I am looking for opportunities…','I would like to work in…','This project is important because…'] },
    { title:'Mission 3 · Contact an employer', prompt:'You are calling a real estate agency. Introduce yourself and ask whether they are open to international profiles.', keywords:['Good morning','opportunities','CV','recruiting'], support:['I am calling to ask about…','Could you tell me whether…','May I send you…','Thank you for your time.'] },
    { title:'Mission 4 · Talk about client communication', prompt:'Explain how you communicate with clients and why listening is important in real estate.', keywords:['listen carefully','client needs','expectations','appropriate advice'], support:['I always listen carefully…','This helps me…','I ask questions so that…','Then I can recommend…'] }
  ];

  function sample(array, count) {
    return [...array].sort(() => Math.random() - 0.5).slice(0, count);
  }

  function score(area, key, points = 1) {
    if (state.answered.has(key)) return;
    state.answered.add(key);
    state.scores[area] += points;
    updateScores();
  }

  function totalPossible() {
    return vocabQuizBank.length + grammar.length + 1 + achievementQuiz.length;
  }

  function updateScores() {
    $('#vocabScore').textContent = state.scores.vocab;
    $('#grammarScore').textContent = state.scores.grammar;
    $('#interviewScore').textContent = state.scores.interview;
    $('#phoneScore').textContent = state.scores.phone;
    const total = Object.values(state.scores).reduce((a,b) => a + b, 0);
    $('#totalScore').textContent = total;
    $('#totalPossible').textContent = totalPossible();
    $('#progressFill').style.width = `${Math.min(100, Math.round((total / totalPossible()) * 100))}%`;
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.accent;
    utterance.rate = 0.88;
    utterance.pitch = 1;
    const voice = state.voices.find(v => v.lang === state.accent) || state.voices.find(v => v.lang && v.lang.startsWith(state.accent.slice(0,2)));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }

  function loadVoices() {
    state.voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    const hasGB = state.voices.some(v => v.lang === 'en-GB');
    const hasUS = state.voices.some(v => v.lang === 'en-US');
    $('#voiceStatus').textContent = `Voices detected: ${hasGB ? 'British ✓' : 'British not guaranteed'} · ${hasUS ? 'American ✓' : 'American not guaranteed'}`;
  }

  function renderWarmups() {
    $('#warmupGrid').innerHTML = warmups.map((item, index) => `
      <article class="cue-card">
        <h3>${item.title}</h3>
        <div class="cue-chips">${item.cues.map(c => `<span class="chip">${c}</span>`).join('')}</div>
        <div class="btn-row wrap">
          <button class="secondary-btn" type="button" data-reveal="warm${index}">Reveal model</button>
          <button class="primary-btn" type="button" data-speak="${escapeAttr(item.model)}">Listen</button>
        </div>
        <p id="warm${index}" class="hidden reveal-box">${item.model}</p>
      </article>
    `).join('');
  }

  function renderVocab() {
    const category = $('#vocabCategory').value;
    const search = $('#vocabSearch').value.trim().toLowerCase();
    const filtered = vocab.filter(v => (category === 'all' || v.category === category) && (!search || `${v.term} ${v.fr} ${v.definition} ${v.example}`.toLowerCase().includes(search)));
    $('#vocabGrid').innerHTML = filtered.map(v => `
      <article class="vocab-card">
        <div class="vocab-top">
          <span class="vocab-icon">${v.icon}</span>
          <div>
            <div class="term">${v.term}</div>
            <span class="fr">${v.fr}</span>
            <span class="tag">${labelForCategory(v.category)}</span>
          </div>
        </div>
        <p class="definition">${v.definition}</p>
        <p class="example" id="ex-${slug(v.term)}">${v.example}</p>
        <button class="secondary-btn" type="button" data-speak-target="ex-${slug(v.term)}">Listen</button>
      </article>
    `).join('') || '<p>No vocabulary found. Try another category or search.</p>';
  }

  function labelForCategory(category) {
    const labels = { job:'Job search', profile:'Profile', legal:'Legal', sales:'Sales', client:'Client', phone:'Phone' };
    return labels[category] || category;
  }

  function renderVocabQuiz() {
    const questions = sample(vocabQuizBank, 3);
    $('#vocabQuiz').innerHTML = questions.map((q, index) => quizHtml(q, index, 'vocab')).join('');
    $('#vocabFeedback').textContent = '';
  }

  function quizHtml(q, index, area) {
    return `
      <article class="quiz-item" data-quiz-key="${q.key}" data-area="${area}" data-answer="${q.answer}">
        <div class="quiz-question">${index + 1}. ${q.q || q.question}</div>
        <div class="option-grid">
          ${q.options.map((opt, i) => `<button type="button" class="option-btn" data-option="${i}">${opt}</button>`).join('')}
        </div>
        <div class="feedback" aria-live="polite"></div>
      </article>
    `;
  }

  function renderGrammar() {
    const select = $('#grammarSelect');
    select.innerHTML = '<option value="all">Show all grammar points</option>' + grammar.map(g => `<option value="${g.id}">${g.title}</option>`).join('');
    drawGrammar();
  }

  function drawGrammar() {
    const chosen = $('#grammarSelect').value;
    const items = grammar.filter(g => chosen === 'all' || g.id === chosen);
    $('#grammarGrid').innerHTML = items.map(g => `
      <article class="rule-card" data-grammar="${g.id}">
        <span class="tag">${g.badge}</span>
        <h3>${g.title}</h3>
        <div class="rule-grid">
          <div>
            <p>${g.rule}</p>
            <p class="formula">${g.formula}</p>
            <div class="rule-examples">${g.examples.map(ex => `<p>${ex}</p>`).join('')}</div>
          </div>
          <div>
            <h4>Mini-practice</h4>
            ${practiceHtml(g.practice)}
            <div class="feedback" aria-live="polite"></div>
          </div>
        </div>
      </article>
    `).join('');
  }

  function practiceHtml(practice) {
    if (practice.type === 'mcq') {
      return quizHtml({ key:practice.key, question:practice.question, q:practice.question, options:practice.options, answer:practice.answer }, 0, 'grammar') + `<p class="definition">Tip: ${practice.tip}</p>`;
    }
    if (practice.type === 'selects') {
      return `<div class="select-practice" data-key="${practice.key}">${practice.items.map((item, idx) => `
        <label class="select-row"><span>${item.before.replace('___','<strong>___</strong>')}</span>
          <select data-answer="${escapeAttr(item.answer)}"><option value="">Choose…</option>${item.options.map(opt => `<option>${opt}</option>`).join('')}</select>
        </label>`).join('')}
        <button class="primary-btn" type="button" data-check-selects>Check</button>
      </div>`;
    }
    if (practice.type === 'order') {
      const shuffled = sample(practice.answer, practice.answer.length);
      return `<div class="order-practice" data-key="${practice.key}" data-answer="${escapeAttr(practice.answer.join(' '))}">
        <p class="definition">Tap words to build the sentence.</p>
        <div class="word-bank">${shuffled.map(w => `<button type="button" class="word-chip">${w}</button>`).join('')}</div>
        <div class="answer-bank" aria-label="Your answer"></div>
        <div class="btn-row wrap"><button class="primary-btn" type="button" data-check-order>Check order</button><button class="secondary-btn" type="button" data-reset-order>Reset</button></div>
        <p class="definition">Tip: ${practice.tip}</p>
      </div>`;
    }
    return '';
  }

  function pickQuestion() {
    state.currentQuestion = sample(questions, 1)[0];
    $('#questionCard').innerHTML = `
      <h4>${state.currentQuestion.q}</h4>
      <div class="cue-chips">${state.currentQuestion.cues.map(c => `<span class="chip">${c}</span>`).join('')}</div>
      <p class="definition">Try to speak for 45–60 seconds before revealing the model.</p>
    `;
    $('#questionModel').classList.add('hidden');
    $('#questionModel').textContent = state.currentQuestion.model;
  }

  function renderUpgrades() {
    $('#upgradeGrid').innerHTML = upgrades.map((u, index) => `
      <article class="cue-card">
        <h3>${u.title}</h3>
        <p><strong>Good idea:</strong><br>${u.before}</p>
        <button class="secondary-btn" type="button" data-reveal="up${index}">Reveal professional upgrade</button>
        <div id="up${index}" class="hidden reveal-box">
          <strong>More professional:</strong><br>${u.after}
          <div class="btn-row wrap"><button class="primary-btn" type="button" data-speak="${escapeAttr(u.after)}">Listen</button></div>
        </div>
      </article>
    `).join('');
  }

  function renderPhonePhrases() {
    $('#phonePhraseGrid').innerHTML = phonePhrases.map(p => `
      <div class="phrase-card">
        <strong>${p.phrase}</strong>
        <small>${p.fr}</small>
        <div class="btn-row wrap"><button class="secondary-btn" type="button" data-speak="${escapeAttr(p.phrase)}">Listen</button></div>
      </div>
    `).join('');
  }

  function pickCallScenario() {
    state.currentCall = sample(callScenarios, 1)[0];
    $('#callScenario').innerHTML = `
      <h4>${state.currentCall.title}</h4>
      <p>${state.currentCall.situation}</p>
      <ul>${state.currentCall.tasks.map(t => `<li>${t}</li>`).join('')}</ul>
    `;
    $('#callSupport').classList.add('hidden');
    $('#callSupport').innerHTML = `<strong>Support phrases</strong><ul>${state.currentCall.support.map(s => `<li>${s}</li>`).join('')}</ul>`;
  }

  function renderAchievementQuiz() {
    $('#achievementQuiz').innerHTML = achievementQuiz.map((q, index) => quizHtml(q, index, 'phone')).join('');
  }

  function pickMission() {
    state.currentMission = sample(missions, 1)[0];
    $('#missionTitle').textContent = state.currentMission.title;
    $('#missionCard').innerHTML = `
      <p>${state.currentMission.prompt}</p>
      <div class="cue-chips">${state.currentMission.keywords.map(k => `<span class="chip">${k}</span>`).join('')}</div>
    `;
    $('#missionSupport').classList.add('hidden');
    $('#missionSupport').innerHTML = `<strong>Support phrases</strong><ul>${state.currentMission.support.map(s => `<li>${s}</li>`).join('')}</ul>`;
  }

  function checkInterviewAnswer() {
    const text = $('#interviewAnswer').value.toLowerCase();
    const checks = [
      { label:'years of experience', test:/24|twenty-four|worked in real estate|years/.test(text) },
      { label:'legal expertise', test:/legal|law|risk|advice|advise/.test(text) },
      { label:'commercial or sales experience', test:/commercial|sales|selling|sell|clients/.test(text) },
      { label:'client communication style', test:/listen|needs|expectations|understand/.test(text) },
      { label:'Netherlands / Amsterdam goal', test:/netherlands|amsterdam|dutch/.test(text) },
      { label:'professional goal or opportunity', test:/job|position|opportunity|agency|work/.test(text) }
    ];
    const passed = checks.filter(c => c.test).length;
    $('#interviewChecklist').innerHTML = checks.map(c => `<span class="${c.test ? 'ok' : 'missing'}">${c.test ? '✓' : '○'} ${c.label}</span>`).join('') + `<p class="feedback ${passed >= 4 ? 'good' : 'warn'}">${passed}/6 key ideas included. ${passed >= 4 ? 'Strong structure — now practise it orally.' : 'Add a few more key ideas, then try again.'}</p>`;
    if (passed >= 4) score('interview', 'interview-structure');
  }

  function handleQuizClick(button) {
    const item = button.closest('.quiz-item');
    if (!item || item.dataset.done === 'true') return;
    const chosen = Number(button.dataset.option);
    const answer = Number(item.dataset.answer);
    const area = item.dataset.area;
    const isCorrect = chosen === answer;
    item.dataset.done = 'true';
    $$('.option-btn', item).forEach(btn => {
      const option = Number(btn.dataset.option);
      btn.disabled = true;
      if (option === answer) btn.classList.add('correct');
      if (option === chosen && !isCorrect) btn.classList.add('wrong');
    });
    const feedback = $('.feedback', item);
    feedback.textContent = isCorrect ? 'Correct. Excellent professional English.' : 'Good try. Notice the more natural professional pattern.';
    feedback.className = `feedback ${isCorrect ? 'good' : 'warn'}`;
    if (isCorrect) score(area, item.dataset.quizKey);
  }

  function checkSelects(container) {
    const key = container.dataset.key;
    const selects = $$('select', container);
    let correct = 0;
    selects.forEach(sel => {
      const ok = sel.value === sel.dataset.answer;
      if (ok) correct += 1;
      sel.style.borderColor = ok ? '#86efac' : '#ffb4a8';
      sel.style.background = ok ? '#edfff5' : '#fff6f4';
    });
    const feedback = container.closest('.rule-card').querySelector('.feedback');
    feedback.textContent = `${correct}/${selects.length} correct. ${correct === selects.length ? 'Great — this pattern is ready for speaking practice.' : 'Check the model examples and try again.'}`;
    feedback.className = `feedback ${correct === selects.length ? 'good' : 'warn'}`;
    if (correct === selects.length) score('grammar', key);
  }

  function checkOrder(container) {
    const key = container.dataset.key;
    const target = normalize(container.dataset.answer);
    const answer = normalize($$('.answer-bank .word-chip', container).map(btn => btn.textContent).join(' '));
    const ok = answer === target;
    const feedback = container.closest('.rule-card').querySelector('.feedback');
    feedback.textContent = ok ? 'Correct. This is a strong sentence for your professional profile.' : 'Almost. Check the word order and try again.';
    feedback.className = `feedback ${ok ? 'good' : 'warn'}`;
    if (ok) score('grammar', key);
  }

  function resetOrder(container) {
    const answerBank = $('.answer-bank', container);
    const wordBank = $('.word-bank', container);
    $$('.word-chip', answerBank).forEach(btn => wordBank.appendChild(btn));
  }

  function startTimer(seconds) {
    clearInterval(state.timerId);
    state.timerRemaining = seconds;
    updateTimerDisplay();
    state.timerId = setInterval(() => {
      state.timerRemaining -= 1;
      updateTimerDisplay();
      if (state.timerRemaining <= 0) {
        clearInterval(state.timerId);
        state.timerId = null;
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const m = String(Math.floor(state.timerRemaining / 60)).padStart(2, '0');
    const s = String(state.timerRemaining % 60).padStart(2, '0');
    $('#timerDisplay').textContent = `${m}:${s}`;
  }

  function copyText(text, button) {
    navigator.clipboard?.writeText(text).then(() => {
      const old = button.textContent;
      button.textContent = 'Copied ✓';
      setTimeout(() => button.textContent = old, 1100);
    }).catch(() => alert('Copy is not available in this browser.'));
  }

  function saveNotes() {
    localStorage.setItem('isabelle-job-abroad-notes', $('#notes').value);
    $('#notesStatus').textContent = 'Notes saved.';
    $('#notesStatus').className = 'feedback good';
  }

  function loadNotes() {
    $('#notes').value = localStorage.getItem('isabelle-job-abroad-notes') || '';
  }

  function slug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }

  function normalize(text) {
    return text.toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9€' -]/g,'').replace(/\s+/g,' ').trim();
  }

  function escapeAttr(text) {
    return String(text).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function bindEvents() {
    document.addEventListener('click', (e) => {
      const scrollBtn = e.target.closest('[data-scroll]');
      if (scrollBtn) $(scrollBtn.dataset.scroll)?.scrollIntoView({ behavior:'smooth', block:'start' });

      const accentBtn = e.target.closest('[data-accent]');
      if (accentBtn) {
        state.accent = accentBtn.dataset.accent;
        $$('[data-accent]').forEach(btn => btn.classList.remove('active'));
        accentBtn.classList.add('active');
      }

      const speakTarget = e.target.closest('[data-speak-target]');
      if (speakTarget) speak($(`#${speakTarget.dataset.speakTarget}`).textContent);

      const speakBtn = e.target.closest('[data-speak]');
      if (speakBtn) speak(speakBtn.dataset.speak);

      const copyTarget = e.target.closest('[data-copy-target]');
      if (copyTarget) copyText($(`#${copyTarget.dataset.copyTarget}`).textContent, copyTarget);

      const revealBtn = e.target.closest('[data-reveal]');
      if (revealBtn) $(`#${revealBtn.dataset.reveal}`)?.classList.toggle('hidden');

      const option = e.target.closest('.option-btn');
      if (option) handleQuizClick(option);

      const wordChip = e.target.closest('.word-chip');
      if (wordChip && wordChip.closest('.order-practice')) {
        const area = wordChip.parentElement.classList.contains('word-bank') ? wordChip.closest('.order-practice').querySelector('.answer-bank') : wordChip.closest('.order-practice').querySelector('.word-bank');
        area.appendChild(wordChip);
      }

      const checkSelect = e.target.closest('[data-check-selects]');
      if (checkSelect) checkSelects(checkSelect.closest('.select-practice'));

      const checkOrderBtn = e.target.closest('[data-check-order]');
      if (checkOrderBtn) checkOrder(checkOrderBtn.closest('.order-practice'));

      const resetOrderBtn = e.target.closest('[data-reset-order]');
      if (resetOrderBtn) resetOrder(resetOrderBtn.closest('.order-practice'));

      const timerBtn = e.target.closest('[data-timer]');
      if (timerBtn) startTimer(Number(timerBtn.dataset.timer));
    });

    $('#vocabCategory').addEventListener('change', renderVocab);
    $('#vocabSearch').addEventListener('input', renderVocab);
    $('#newVocabQuiz').addEventListener('click', renderVocabQuiz);
    $('#grammarSelect').addEventListener('change', drawGrammar);
    $('#newQuestion').addEventListener('click', pickQuestion);
    $('#showQuestionModel').addEventListener('click', () => $('#questionModel').classList.toggle('hidden'));
    $('#checkInterviewAnswer').addEventListener('click', checkInterviewAnswer);
    $('#clearInterviewAnswer').addEventListener('click', () => { $('#interviewAnswer').value = ''; $('#interviewChecklist').innerHTML = ''; });
    $('#newCallScenario').addEventListener('click', pickCallScenario);
    $('#showCallSupport').addEventListener('click', () => $('#callSupport').classList.toggle('hidden'));
    $('#newMission').addEventListener('click', pickMission);
    $('#showMissionSupport').addEventListener('click', () => $('#missionSupport').classList.toggle('hidden'));
    $('#stopTimer').addEventListener('click', () => { clearInterval(state.timerId); state.timerId = null; });
    $('#saveNotes').addEventListener('click', saveNotes);
    $('#copyNotes').addEventListener('click', () => copyText($('#notes').value, $('#copyNotes')));
    $('#clearNotes').addEventListener('click', () => { $('#notes').value = ''; localStorage.removeItem('isabelle-job-abroad-notes'); $('#notesStatus').textContent = 'Notes cleared.'; });
    $('#resetAll').addEventListener('click', () => {
      state.scores = { vocab: 0, grammar: 0, interview: 0, phone: 0 };
      state.answered.clear();
      renderVocabQuiz();
      drawGrammar();
      renderAchievementQuiz();
      $('#interviewChecklist').innerHTML = '';
      updateScores();
    });
  }

  function init() {
    updateScores();
    renderWarmups();
    renderVocab();
    renderVocabQuiz();
    renderGrammar();
    pickQuestion();
    renderUpgrades();
    renderPhonePhrases();
    pickCallScenario();
    renderAchievementQuiz();
    pickMission();
    loadNotes();
    bindEvents();
    if ('speechSynthesis' in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      $('#voiceStatus').textContent = 'Speech synthesis is not available in this browser.';
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
