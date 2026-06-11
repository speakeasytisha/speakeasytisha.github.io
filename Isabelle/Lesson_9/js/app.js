const state = { score: 0, done: new Set(), totalActivities: 4 };
const vocab = {
  profile: [
    {term:'real estate legal and commercial professional', fr:'professionnelle juridique et commerciale de l’immobilier', def:'A person with both legal and commercial experience in the property sector.', ex:'I am a real estate legal and commercial professional with over 24 years’ experience.'},
    {term:'property development', fr:'promotion immobilière', def:'The process of planning, building and developing real estate projects.', ex:'I have experience in property development for major French developers.'},
    {term:'legal advisory work', fr:'conseil juridique', def:'Professional support and advice on legal questions.', ex:'My experience includes legal advisory work for operational teams.'},
    {term:'commercial insight', fr:'vision commerciale', def:'The ability to understand sales, clients, prices and business opportunities.', ex:'I can combine legal expertise with commercial insight.'},
    {term:'new professional challenge', fr:'nouveau défi professionnel', def:'A new opportunity that allows you to grow professionally.', ex:'I am now seeking a new professional challenge in the Netherlands.'}
  ],
  transactions: [
    {term:'off-plan sale agreement', fr:'VEFA / vente en l’état futur d’achèvement', def:'A sale agreement signed before a property is completed.', ex:'I worked on off-plan sale agreements for residential property projects.'},
    {term:'off-plan lease agreement', fr:'BEFA / bail en l’état futur d’achèvement', def:'A lease signed before the premises are completed.', ex:'I negotiated off-plan lease agreements with institutional clients.'},
    {term:'lease negotiation', fr:'négociation de bail', def:'The process of negotiating rent, terms, duration and legal obligations in a lease.', ex:'The role requires strong lease negotiation skills.'},
    {term:'transaction support', fr:'accompagnement des transactions', def:'Legal or commercial support during a real estate transaction.', ex:'My experience includes transaction support and risk analysis.'},
    {term:'due diligence', fr:'audit préalable / vérifications avant transaction', def:'A detailed legal, financial or technical review before making a decision.', ex:'I can support legal and commercial due diligence.'},
    {term:'risk analysis', fr:'analyse des risques', def:'The process of identifying and assessing possible legal or commercial risks.', ex:'Risk analysis is an important part of real estate transactions.'}
  ],
  partners: [
    {term:'stakeholders', fr:'parties prenantes', def:'People or organisations involved in a project.', ex:'I coordinate with internal and external stakeholders.'},
    {term:'landlord', fr:'bailleur / propriétaire bailleur', def:'The person or organisation that owns a property and rents it out.', ex:'The job involves managing landlord relationships.'},
    {term:'broker', fr:'courtier / intermédiaire', def:'A professional who helps arrange property transactions.', ex:'The transaction manager works with brokers and landlords.'},
    {term:'notary', fr:'notaire', def:'A legal professional involved in official documents and transactions.', ex:'I liaised with notaries throughout property transactions.'},
    {term:'investor', fr:'investisseur', def:'A person or organisation that invests money in a property project.', ex:'I coordinated with investors and operational teams.'},
    {term:'surveyors', fr:'géomètres / experts', def:'Professionals who measure, inspect or assess property and land.', ex:'I worked with surveyors and external partners.'}
  ],
  skills: [
    {term:'attention to detail', fr:'rigueur / sens du détail', def:'The ability to notice and check small but important details.', ex:'Attention to detail is essential in legal documents.'},
    {term:'adaptability', fr:'capacité d’adaptation', def:'The ability to adjust to new contexts, people or requirements.', ex:'Adaptability is important when working in a new country.'},
    {term:'responsiveness', fr:'réactivité', def:'The ability to respond quickly and appropriately.', ex:'Responsiveness is valuable in client relations.'},
    {term:'analytical thinking', fr:'esprit d’analyse', def:'The ability to understand complex situations and find logical solutions.', ex:'Analytical thinking helps me identify legal risks.'},
    {term:'cross-cultural communication', fr:'communication interculturelle', def:'Communication with people from different countries or cultures.', ex:'I would like to improve my cross-cultural communication skills.'}
  ],
  jobad: [
    {term:'portfolio', fr:'portefeuille immobilier', def:'A group of properties managed by a company.', ex:'The company manages a global real estate portfolio.'},
    {term:'occupancy costs', fr:'coûts d’occupation', def:'Costs related to using premises, such as rent and service charges.', ex:'The role involves annual occupancy costs across the portfolio.'},
    {term:'commercial terms', fr:'conditions commerciales', def:'The financial and contractual conditions of an agreement.', ex:'The goal is to secure favourable commercial terms.'},
    {term:'rent review', fr:'révision du loyer', def:'A process for adjusting rent during a lease.', ex:'The contract includes rent review provisions.'},
    {term:'service charges', fr:'charges locatives / charges de service', def:'Additional costs paid by the tenant for services related to the property.', ex:'Service charges must be reviewed carefully.'},
    {term:'green lease provisions', fr:'clauses vertes / dispositions environnementales du bail', def:'Lease clauses related to sustainability and environmental goals.', ex:'Green lease provisions support ESG commitments.'}
  ],
  integration: [
    {term:'integrate into the community', fr:'s’intégrer dans la communauté', def:'To become part of a local social or professional environment.', ex:'I would like to integrate into the Dutch community.'},
    {term:'international environment', fr:'environnement international', def:'A workplace with people, clients or teams from different countries.', ex:'I would like to work in an international environment.'},
    {term:'professional network', fr:'réseau professionnel', def:'Contacts who can help you professionally.', ex:'I would like to build a professional network in Amsterdam.'},
    {term:'local market', fr:'marché local', def:'The market in a specific area or country.', ex:'I want to learn more about the Dutch real estate market.'},
    {term:'stakeholder expectations', fr:'attentes des parties prenantes', def:'What different people or organisations expect from a project.', ex:'It is important to understand stakeholder expectations.'}
  ]
};

function updateScore(id, points){
  if(state.done.has(id)) return;
  state.done.add(id);
  state.score += points;
  document.getElementById('score').textContent = state.score;
  document.getElementById('doneCount').textContent = state.done.size;
  document.getElementById('meterFill').style.width = Math.min(100, (state.done.size/state.totalActivities)*100) + '%';
}

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

function speak(text){
  if(!('speechSynthesis' in window)) return alert('Speech synthesis is not available in this browser.');
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const lang = document.getElementById('voiceSelect')?.value || 'en-GB';
  utter.lang = lang;
  utter.rate = .92;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang === lang) || voices.find(v => v.lang.startsWith(lang.slice(0,2)));
  if(preferred) utter.voice = preferred;
  window.speechSynthesis.speak(utter);
}

document.querySelectorAll('.speak').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.speak || btn.closest('.card').innerText)));

let timerId;
document.querySelectorAll('.timer').forEach(btn => {
  btn.addEventListener('click', () => {
    clearInterval(timerId);
    let seconds = parseInt(btn.dataset.seconds, 10);
    const out = btn.parentElement.querySelector('.timer-output');
    out.textContent = `${seconds}s`;
    timerId = setInterval(() => {
      seconds--;
      out.textContent = seconds > 0 ? `${seconds}s` : 'Time!';
      if(seconds <= 0){ clearInterval(timerId); speak('Time. Well done. Now try again with more confidence.'); }
    }, 1000);
  });
});

document.querySelectorAll('.check-radio').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const answer = btn.dataset.answer;
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    const feedback = btn.parentElement.querySelector('.feedback');
    if(!selected){ feedback.textContent = 'Choose an answer first.'; feedback.className = 'feedback try'; return; }
    if(selected.value === answer){
      feedback.textContent = 'Correct. This is the most natural professional English pattern.';
      feedback.className = 'feedback good';
      updateScore(name, parseInt(btn.parentElement.dataset.points || '1',10));
    } else {
      feedback.textContent = 'Try again. Look at the pattern above.';
      feedback.className = 'feedback try';
    }
  });
});

document.querySelectorAll('.check-fill').forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    const wrap = btn.parentElement;
    const input = wrap.querySelector('input');
    const answer = input.dataset.answer.trim().toLowerCase();
    const value = input.value.trim().toLowerCase();
    const feedback = wrap.querySelector('.feedback');
    if(value === answer){
      feedback.textContent = 'Correct. “Skilled in managing client relationships” is natural.';
      feedback.className = 'feedback good';
      updateScore('fill'+idx, parseInt(wrap.dataset.points || '1',10));
    } else {
      feedback.textContent = 'Almost. Use the -ing form after “skilled in”.';
      feedback.className = 'feedback try';
    }
  });
});

function renderVocab(){
  const cat = document.getElementById('categorySelect').value;
  const q = document.getElementById('vocabSearch').value.toLowerCase();
  const grid = document.getElementById('vocabGrid');
  const items = vocab[cat].filter(item => [item.term,item.fr,item.def,item.ex].join(' ').toLowerCase().includes(q));
  grid.innerHTML = items.map(item => `
    <article class="vocab-card">
      <h3>${item.term}</h3>
      <p class="fr">FR: ${item.fr}</p>
      <p>${item.def}</p>
      <p><strong>Example:</strong> ${item.ex}</p>
      <button class="btn mini speak-card" data-text="${item.term}. ${item.ex.replace(/"/g,'&quot;')}">🔊</button>
    </article>
  `).join('') || '<p>No vocabulary found.</p>';
  document.querySelectorAll('.speak-card').forEach(b => b.addEventListener('click', () => speak(b.dataset.text)));
}

document.getElementById('categorySelect').addEventListener('change', renderVocab);
document.getElementById('vocabSearch').addEventListener('input', renderVocab);
renderVocab();

document.querySelectorAll('.reveal').forEach(btn => {
  btn.addEventListener('click', () => {
    const ans = btn.parentElement.querySelector('.hidden-answer');
    ans.classList.toggle('show');
    btn.textContent = ans.classList.contains('show') ? 'Hide model answer' : 'Show model answer';
  });
});

document.getElementById('printBtn').addEventListener('click', () => window.print());
document.getElementById('resetBtn').addEventListener('click', () => {
  localStorage.removeItem('isabelle_cv_alignment_notes');
  window.location.reload();
});
const notes = document.getElementById('notes');
notes.value = localStorage.getItem('isabelle_cv_alignment_notes') || '';
document.getElementById('saveNotes').addEventListener('click', () => {
  localStorage.setItem('isabelle_cv_alignment_notes', notes.value);
  document.querySelector('.saved').textContent = 'Saved on this device.';
});
if('speechSynthesis' in window){ window.speechSynthesis.onvoiceschanged = () => {}; }
