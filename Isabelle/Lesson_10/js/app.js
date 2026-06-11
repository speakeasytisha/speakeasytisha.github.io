const state = { score: 0, awarded: new Set(), timerId: null, voices: [] };

const matchItems = [
  {
    need: "Complex lease negotiations",
    answer: "Drafted and negotiated off-plan leases and real estate development contracts",
    options: ["Daily yoga and fitness", "Drafted and negotiated off-plan leases and real estate development contracts", "Beginner Dutch with Assimil"]
  },
  {
    need: "Landlord and broker relationships",
    answer: "Liaised with landlords, notaries, lawyers, investors and external partners",
    options: ["Liaised with landlords, notaries, lawyers, investors and external partners", "Worked in France only", "Prepared hobbies section"]
  },
  {
    need: "Commercial outcomes and cost awareness",
    answer: "Managed an annual fees budget of approximately €1 million excluding VAT",
    options: ["Managed an annual fees budget of approximately €1 million excluding VAT", "Has a LinkedIn profile", "Studied Dutch independently"]
  },
  {
    need: "Risk mitigation and legal due diligence",
    answer: "Analysed legal risks and supported operational teams on real estate law",
    options: ["Analysed legal risks and supported operational teams on real estate law", "Likes interior decoration", "Moved documents into a CV"]
  }
];

const workPatternQuestions = [
  { sentence: "I would like to work ___ real estate.", options: ["in", "as", "of"], answer: "in" },
  { sentence: "I would like to work ___ a real estate consultant.", options: ["in", "as", "for"], answer: "as" },
  { sentence: "I am applying for the position ___ Real Estate Consultant.", options: ["as", "of", "in"], answer: "of" }
];

const vocab = [
  {cat:"cover", term:"apply for", fr:"postuler à", def:"To send an application for a job.", ex:"I am writing to apply for the position of Senior Real Estate Transaction Manager."},
  {cat:"cover", term:"I would welcome the opportunity", fr:"je serais ravie d'avoir l'occasion de", def:"A polite closing phrase to invite discussion.", ex:"I would welcome the opportunity to discuss how my experience could support your team."},
  {cat:"cover", term:"role", fr:"poste / rôle", def:"A job or function in a company.", ex:"This role particularly interests me because it combines legal and commercial skills."},
  {cat:"cover", term:"position", fr:"poste", def:"A formal word for a job.", ex:"I am applying for the position of Real Estate Transaction Manager."},
  {cat:"transaction", term:"transaction strategy", fr:"stratégie de transaction", def:"The plan used to manage property transactions effectively.", ex:"The role requires strong transaction strategy across an international portfolio."},
  {cat:"transaction", term:"portfolio", fr:"portefeuille immobilier", def:"A group of properties managed by a company or investor.", ex:"The company manages a global real estate portfolio."},
  {cat:"transaction", term:"due diligence", fr:"audit préalable / vérifications", def:"The process of checking legal, financial and technical information before a transaction.", ex:"I can contribute to legal and commercial due diligence."},
  {cat:"transaction", term:"risk mitigation", fr:"réduction / maîtrise des risques", def:"Actions taken to reduce potential legal or commercial risks.", ex:"My legal background is useful for risk mitigation."},
  {cat:"lease", term:"lease negotiation", fr:"négociation de bail", def:"Discussing and agreeing the terms of a lease.", ex:"I have experience in lease-related documentation and contract negotiation."},
  {cat:"lease", term:"off-plan lease", fr:"BEFA / bail en l'état futur d'achèvement", def:"A lease signed before the premises are completed.", ex:"I negotiated off-plan lease documentation for commercial property projects."},
  {cat:"lease", term:"rent review", fr:"révision de loyer", def:"A formal review of the rent during a lease.", ex:"The job offer mentions rent review mechanisms."},
  {cat:"lease", term:"service charges", fr:"charges locatives", def:"Costs paid for services related to the building.", ex:"Lease terms may include rent, service charges and break options."},
  {cat:"lease", term:"break option", fr:"clause de sortie / faculté de résiliation", def:"A clause that allows a party to end the lease early under certain conditions.", ex:"The company negotiates favorable break options."},
  {cat:"stakeholders", term:"landlord", fr:"bailleur / propriétaire", def:"The owner who rents out a property.", ex:"The role involves managing landlord relationships."},
  {cat:"stakeholders", term:"broker", fr:"courtier / intermédiaire", def:"A professional who helps find and negotiate property opportunities.", ex:"The transaction manager works closely with brokers."},
  {cat:"stakeholders", term:"stakeholder", fr:"partie prenante / interlocuteur", def:"A person or group involved in or affected by a project.", ex:"I coordinate with internal and external stakeholders."},
  {cat:"stakeholders", term:"operational teams", fr:"équipes opérationnelles", def:"Teams that manage practical project operations.", ex:"I advised operational teams on legal and real estate matters."},
  {cat:"legal", term:"legal advisory work", fr:"conseil juridique", def:"Giving legal guidance and support.", ex:"My experience includes legal advisory work for major real estate developers."},
  {cat:"legal", term:"contract drafting", fr:"rédaction de contrats", def:"Writing legal agreements and contractual documents.", ex:"I have experience in contract drafting and negotiation."},
  {cat:"legal", term:"property development", fr:"promotion immobilière", def:"The process of developing real estate projects.", ex:"I worked in property development for major French developers."},
  {cat:"legal", term:"sales management", fr:"responsabilité commerciale / gestion des ventes", def:"Managing sales activities, budgets and client relationships.", ex:"My profile combines legal advisory work and sales management experience."},
  {cat:"integration", term:"international environment", fr:"environnement international", def:"A workplace involving different countries, cultures or languages.", ex:"I would like to contribute to an international real estate environment."},
  {cat:"integration", term:"cross-cultural competence", fr:"compétence interculturelle", def:"The ability to work effectively with people from different cultures.", ex:"My move to the Netherlands will require cross-cultural competence."},
  {cat:"integration", term:"adaptability", fr:"capacité d'adaptation", def:"The ability to adjust to new situations.", ex:"I can bring adaptability, legal expertise and client-focused communication."}
];

const upgradeCards = [
  {
    before:"I am looking for a new challenge in the Netherlands related to the real estate sector.",
    after:"I am now seeking a real estate opportunity in the Netherlands, with a particular interest in transaction management, lease negotiations and international stakeholder coordination."
  },
  {
    before:"Skilled in sales management responsibilities, transactions, real estate contracts and client relations.",
    after:"Skilled in sales management, real estate transactions, contract negotiation, client relations and coordination with internal and external stakeholders."
  },
  {
    before:"I have experience for major real estate developers.",
    after:"I have over 24 years’ experience working with major French real estate developers."
  },
  {
    before:"I want to discuss my profile with you.",
    after:"I would welcome the opportunity to discuss how my experience could support your team."
  }
];

const speakingCards = [
  {
    q:"Why are you interested in this role?",
    model:"I am interested in this role because it combines real estate transaction strategy, lease negotiation and international stakeholder coordination. These areas match both my legal background and my commercial experience in property development."
  },
  {
    q:"How does your experience match the job offer?",
    model:"My experience matches the role because I have worked in real estate for over 24 years, including legal advisory work, contract negotiation, risk analysis and coordination with external partners such as notaries, lawyers, investors and landlords."
  },
  {
    q:"What can you bring to the team?",
    model:"I can bring a combination of legal precision, commercial awareness and real estate experience. I am used to analysing complex situations, identifying risks and working with different stakeholders to find practical solutions."
  },
  {
    q:"Tell me about your negotiation experience.",
    model:"I have negotiated real estate development contracts, sale-related documents and lease-related documentation. As a sales manager, I also negotiated transaction terms and worked with different types of clients and partners."
  },
  {
    q:"Why do you want to work in the Netherlands?",
    model:"I am looking for a new professional opportunity in the Netherlands because I would like to develop my career in an international environment and use my legal and commercial real estate experience in a new market."
  },
  {
    q:"How would you close your cover letter professionally?",
    model:"I would welcome the opportunity to discuss how my experience could support your team and contribute to your real estate objectives."
  }
];

function award(key, points){
  if(!state.awarded.has(key)){
    state.awarded.add(key);
    state.score = Math.min(100, state.score + points);
    document.getElementById('score').textContent = state.score;
    document.getElementById('progressBar').style.width = state.score + '%';
  }
}

function populateMatch(){
  const wrap = document.getElementById('matchExercise');
  matchItems.forEach((item, idx)=>{
    const row = document.createElement('div');
    row.className = 'match-row';
    const label = document.createElement('label');
    label.textContent = item.need;
    const select = document.createElement('select');
    select.dataset.answer = item.answer;
    select.innerHTML = '<option value="">Choose evidence…</option>' + item.options.map(o=>`<option>${o}</option>`).join('');
    row.append(label, select);
    wrap.append(row);
  });
}

function populateWorkQuiz(){
  const wrap = document.getElementById('workPatternQuiz');
  workPatternQuestions.forEach((item, idx)=>{
    const div = document.createElement('div');
    div.className = 'quiz-line';
    div.innerHTML = `<strong>${item.sentence}</strong><select data-answer="${item.answer}"><option value="">Choose…</option>${item.options.map(o=>`<option>${o}</option>`).join('')}</select>`;
    const select = div.querySelector('select');
    select.addEventListener('change',()=>{
      if(select.value === item.answer){ select.style.borderColor = '#4f7d5a'; award('work'+idx,4); }
      else { select.style.borderColor = '#c94f64'; }
    });
    wrap.append(div);
  });
}

function populateVocab(){
  const grid = document.getElementById('vocabGrid');
  const cat = document.getElementById('vocabCategory').value;
  const q = document.getElementById('vocabSearch').value.toLowerCase();
  grid.innerHTML = '';
  vocab.filter(v => (cat==='all'||v.cat===cat) && (v.term.toLowerCase().includes(q)||v.fr.toLowerCase().includes(q)||v.ex.toLowerCase().includes(q))).forEach(v=>{
    const card = document.createElement('div');
    card.className = 'vocab-card';
    card.innerHTML = `<span class="tag">${v.cat}</span><h3>${v.term}</h3><div class="fr">FR: ${v.fr}</div><p><strong>Definition:</strong> ${v.def}</p><p><strong>Example:</strong> ${v.ex}</p><button class="speak" data-speak="${v.term}. ${v.ex.replaceAll('"','&quot;')}">🔊 Listen</button>`;
    grid.append(card);
  });
}

function populateUpgrades(){
  const wrap = document.getElementById('upgradeCards');
  upgradeCards.forEach((u, idx)=>{
    const card = document.createElement('div');
    card.className='upgrade-card';
    card.innerHTML = `<h3>Upgrade ${idx+1}</h3><p class="before"><strong>Before:</strong><br>${u.before}</p><p class="after" id="after${idx}"><strong>Professional version:</strong><br>${u.after}</p><button class="toggle-model" data-target="after${idx}">Reveal professional version</button>`;
    wrap.append(card);
  });
}

function populateSpeaking(){
  const wrap = document.getElementById('speakingCards');
  speakingCards.forEach((s, idx)=>{
    const card = document.createElement('div');
    card.className='speaking-card';
    card.innerHTML = `<h3>${s.q}</h3><p>Try answering without reading. Then reveal the model answer.</p><button class="toggle-model" data-target="model${idx}">Show model answer</button><button class="speak" data-speak="${s.q.replaceAll('"','&quot;')}">🔊 Question</button><div class="model-answer" id="model${idx}"><p>${s.model}</p><button class="speak" data-speak="${s.model.replaceAll('"','&quot;')}">🔊 Listen to model</button></div>`;
    wrap.append(card);
  });
}

function speak(text){
  if(!('speechSynthesis' in window)) return alert('Text-to-speech is not available in this browser.');
  window.speechSynthesis.cancel();
  const lang = document.getElementById('voiceSelect').value;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  const voice = state.voices.find(v => v.lang === lang) || state.voices.find(v => v.lang.startsWith(lang.slice(0,2)));
  if(voice) utter.voice = voice;
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

function bindEvents(){
  document.addEventListener('click', e=>{
    const speakBtn = e.target.closest('.speak');
    if(speakBtn){ speak(speakBtn.dataset.speak || speakBtn.textContent); award('speak',2); }
    const toggle = e.target.closest('.toggle-model');
    if(toggle){
      const target = document.getElementById(toggle.dataset.target);
      if(target){ target.classList.toggle('show'); target.classList.toggle('open'); award('reveal'+toggle.dataset.target,3); }
    }
  });

  document.querySelectorAll('.accordion__btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const panel = btn.nextElementSibling;
      panel.classList.toggle('open');
      award('accordion'+btn.textContent,2);
    });
  });

  document.querySelectorAll('.quick-check').forEach((box, idx)=>{
    const input = box.querySelector('input');
    const btn = box.querySelector('button');
    const out = box.querySelector('span');
    btn.addEventListener('click',()=>{
      const ans = (input.value||'').trim().toLowerCase();
      const ok = ans === box.dataset.answer.toLowerCase();
      out.textContent = ok ? '✅ Correct' : `💡 Try: ${box.dataset.answer}`;
      out.style.color = ok ? '#4f7d5a' : '#c94f64';
      if(ok) award('quick'+idx,5);
    });
  });

  document.getElementById('checkMatch').addEventListener('click',()=>{
    let correct = 0;
    document.querySelectorAll('#matchExercise select').forEach(s=>{
      if(s.value === s.dataset.answer){correct++; s.style.borderColor = '#4f7d5a';}
      else{s.style.borderColor = '#c94f64';}
    });
    const fb = document.getElementById('matchFeedback');
    fb.textContent = correct === matchItems.length ? '✅ Excellent. You connected the job offer to your evidence.' : `${correct}/${matchItems.length} correct. Look for the strongest professional evidence.`;
    fb.style.color = correct === matchItems.length ? '#4f7d5a' : '#c94f64';
    if(correct === matchItems.length) award('match',12);
  });

  document.getElementById('vocabCategory').addEventListener('change',()=>{ populateVocab(); award('vocabCat',2); });
  document.getElementById('vocabSearch').addEventListener('input',populateVocab);

  document.getElementById('printBtn').addEventListener('click',()=>window.print());
  document.getElementById('resetBtn').addEventListener('click',()=>{ localStorage.removeItem('isabelleCoverNotes'); window.location.reload(); });

  document.getElementById('teacherNotes').addEventListener('input', e=>localStorage.setItem('isabelleCoverNotes', e.target.value));
  document.getElementById('teacherNotes').value = localStorage.getItem('isabelleCoverNotes') || '';

  document.getElementById('startTimer').addEventListener('click',()=>{
    clearInterval(state.timerId);
    let t=30;
    const out = document.getElementById('timer');
    out.textContent = '00:30';
    state.timerId = setInterval(()=>{
      t--;
      out.textContent = `00:${String(t).padStart(2,'0')}`;
      if(t<=0){ clearInterval(state.timerId); out.textContent='Speak!'; award('timer',5); }
    },1000);
  });
}

function loadVoices(){ state.voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }

document.addEventListener('DOMContentLoaded',()=>{
  populateMatch();
  populateWorkQuiz();
  populateVocab();
  populateUpgrades();
  populateSpeaking();
  bindEvents();
  if('speechSynthesis' in window){
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
});
