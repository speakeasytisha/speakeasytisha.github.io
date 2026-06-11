const vocab = [
  {cat:'cv', term:'Professional title', fr:'titre professionnel', def:'A clear label under your name that shows your professional identity.', ex:'Real Estate Legal & Commercial Professional is a strong professional title.'},
  {cat:'cv', term:'Profile', fr:'profil professionnel', def:'A short paragraph at the top of a CV that summarises your experience, strengths and target.', ex:'Your profile should explain your dual legal and commercial expertise.'},
  {cat:'cv', term:'Core skills', fr:'compétences clés', def:'A short list of the most relevant professional skills for the target job.', ex:'Core skills can include contract drafting, risk analysis and client relations.'},
  {cat:'cv', term:'Reverse chronological order', fr:'ordre antichronologique', def:'Starting with the most recent experience and moving backwards.', ex:'Your most recent legal role should appear before older sales roles.'},
  {cat:'cv', term:'Tailored CV', fr:'CV adapté', def:'A CV adapted to a specific role, sector or country.', ex:'A tailored CV is stronger than a direct translation.'},
  {cat:'verbs', term:'Advised', fr:'a conseillé', def:'Gave professional guidance or recommendations.', ex:'Advised operational teams on real estate law and risk prevention.'},
  {cat:'verbs', term:'Drafted', fr:'a rédigé', def:'Wrote a professional or legal document.', ex:'Drafted real estate development contracts.'},
  {cat:'verbs', term:'Negotiated', fr:'a négocié', def:'Discussed terms to reach an agreement.', ex:'Negotiated sale agreements and contractual terms.'},
  {cat:'verbs', term:'Reviewed', fr:'a examiné / vérifié', def:'Checked a document carefully.', ex:'Reviewed legal deeds and property documents.'},
  {cat:'verbs', term:'Liaised with', fr:'a assuré la liaison avec', def:'Communicated and coordinated with people or organisations.', ex:'Liaised with notaries, lawyers and investors.'},
  {cat:'verbs', term:'Managed', fr:'a géré', def:'Was responsible for a project, budget, team or activity.', ex:'Managed an annual fees budget of approximately €1 million excluding VAT.'},
  {cat:'verbs', term:'Assessed', fr:'a évalué', def:'Analysed a situation in order to understand value, risk or feasibility.', ex:'Assessed legal risks and operational issues.'},
  {cat:'legal', term:'Real Estate Legal Specialist', fr:'juriste immobilier', def:'A safer English title for a real estate legal professional who is not necessarily a qualified lawyer.', ex:'Real Estate Legal Specialist is safer than Real Estate Lawyer in many international contexts.'},
  {cat:'legal', term:'Off-plan sale agreement', fr:'VEFA', def:'A property sale agreement signed before the property is completed.', ex:'You worked on off-plan sale agreements for residential developments.'},
  {cat:'legal', term:'Off-plan lease agreement', fr:'BEFA', def:'A lease signed before the premises are completed.', ex:'An off-plan lease agreement is often used for commercial premises under construction.'},
  {cat:'legal', term:'Reservation agreement', fr:'contrat de réservation', def:'An agreement used before the final sale contract.', ex:'Drafted and reviewed reservation agreements.'},
  {cat:'legal', term:'Real estate development agreement', fr:'contrat de promotion immobilière', def:'A contract related to property development operations.', ex:'Negotiated real estate development agreements.'},
  {cat:'legal', term:'Easement', fr:'servitude', def:'A legal right affecting the use of land or property.', ex:'Reviewed documents related to the creation of easements.'},
  {cat:'legal', term:'Settlement agreement', fr:'protocole transactionnel', def:'An agreement used to settle a dispute.', ex:'Drafted settlement agreements in litigation matters.'},
  {cat:'sales', term:'Property valuation', fr:'valorisation d’immeuble', def:'An estimate or study of a property’s value.', ex:'Prepared property valuation studies and sale proposals.'},
  {cat:'sales', term:'Private clients', fr:'particuliers', def:'Individual clients, not companies or institutions.', ex:'Worked with private clients and professional partners.'},
  {cat:'sales', term:'Social landlord', fr:'bailleur social', def:'An organisation that provides social housing.', ex:'Liaised with social landlords and institutional owners.'},
  {cat:'sales', term:'Annual fees budget', fr:'budget annuel d’honoraires', def:'The yearly amount of fees managed or generated.', ex:'Managed an annual fees budget of approximately €1 million excluding VAT.'},
  {cat:'sales', term:'Client needs analysis', fr:'analyse des besoins clients', def:'Understanding what a client needs before recommending a solution.', ex:'Client needs analysis is useful in real estate agencies.'},
  {cat:'culture', term:'The Netherlands', fr:'les Pays-Bas', def:'The country name in English. Always use “the”.', ex:'You are looking for a professional opportunity in the Netherlands.'},
  {cat:'culture', term:'Amsterdam area', fr:'région d’Amsterdam', def:'Amsterdam and the surrounding area.', ex:'You are looking for a job in the Amsterdam area.'},
  {cat:'culture', term:'Business community', fr:'communauté professionnelle', def:'The network of professionals and companies in a location or sector.', ex:'You would like to integrate into the local business community.'},
  {cat:'culture', term:'Professional network', fr:'réseau professionnel', def:'People and organisations that can help you develop professionally.', ex:'You would like to build a professional network in the Netherlands.'},
  {cat:'culture', term:'International profile', fr:'profil international', def:'A profile that can work across countries, cultures or languages.', ex:'Your international profile combines French real estate expertise and English communication.'},
  {cat:'cover', term:'I am writing to apply for', fr:'je vous écris pour postuler à', def:'A standard opening phrase for a cover letter.', ex:'I am writing to apply for the position of Real Estate Consultant.'},
  {cat:'cover', term:'I would bring', fr:'j’apporterais', def:'A polite way to explain your value to an employer.', ex:'I would bring strong legal knowledge and commercial real estate experience.'},
  {cat:'cover', term:'I am particularly interested in', fr:'je suis particulièrement intéressée par', def:'A phrase used to explain motivation.', ex:'I am particularly interested in your agency because of its international client base.'},
  {cat:'cover', term:'I would welcome the opportunity to', fr:'je serais heureuse de pouvoir', def:'A professional closing phrase.', ex:'I would welcome the opportunity to discuss my profile with you.'}
  ,{cat:'legal', term:'Property Development Legal Specialist', fr:'juriste promotion', def:'A legal specialist who works on real estate development operations.', ex:'Property Development Legal Specialist is clearer than a literal translation of Juriste Promotion.'}
  ,{cat:'legal', term:'Development permit', fr:'permis d’aménager', def:'An official authorisation connected to land development or subdivision.', ex:'Worked on planning permissions, development permits and building permits.'}
  ,{cat:'legal', term:'Building permit', fr:'permis de construire', def:'An official authorisation to build a property or development.', ex:'Monitored building permit challenges and related disputes.'}
  ,{cat:'legal', term:'Environmental impact assessment', fr:'étude d’impact', def:'A study evaluating the possible environmental effects of a project.', ex:'Worked on files involving environmental impact assessments.'}
  ,{cat:'legal', term:'Co-ownership regulations', fr:'règlement de copropriété', def:'Rules governing a co-owned building or property development.', ex:'Reviewed co-ownership regulations and related property documents.'}
  ,{cat:'legal', term:'Land acquisition deed', fr:'acte d’acquisition foncière', def:'A legal document relating to the purchase of land.', ex:'Reviewed land acquisition deeds and preliminary sale agreements.'}
  ,{cat:'legal', term:'Payment delegation', fr:'délégation de paiement', def:'A legal arrangement involving payment through another party.', ex:'Supported legal monitoring on payment delegations and works contracts.'}
  ,{cat:'sales', term:'Call for tenders', fr:'appel d’offres', def:'A process where several buyers or companies are invited to make offers.', ex:'Organised calls for tenders, client viewings and negotiations.'}
  ,{cat:'sales', term:'Sale launch', fr:'mise en vente', def:'The start of the marketing and sale process for a property or asset.', ex:'Managed sale launches and marketing of property assets.'}
  ,{cat:'sales', term:'Financial forecast', fr:'bilan prévisionnel', def:'A projected financial document used to estimate future financial performance.', ex:'Prepared financial forecasts and monitored operational performance.'}
  ,{cat:'sales', term:'First-time buyers', fr:'primo-accédants', def:'People buying their first property.', ex:'Adapted programmes to first-time buyers and affordable home ownership needs.'}
  ,{cat:'sales', term:'Wealth management advisers', fr:'gestionnaires de patrimoine', def:'Professionals who advise clients on investments and assets.', ex:'Monitored networks of wealth management advisers.'}
  ,{cat:'cover', term:'Apply for the position of', fr:'postuler au poste de', def:'Formal structure used when applying for a specific job.', ex:'I am writing to apply for the position of Real Estate Consultant.'}
  ,{cat:'cover', term:'Work in real estate', fr:'travailler dans l’immobilier', def:'Use “in” for the sector or field.', ex:'I would like to work in real estate in the Netherlands.'}
  ,{cat:'cover', term:'Work as a real estate consultant', fr:'travailler comme consultante immobilière', def:'Use “as” before a role or function.', ex:'I would like to work as a real estate consultant.'}
  ,{cat:'cover', term:'Discuss how my experience could support your team', fr:'échanger sur la manière dont mon expérience pourrait soutenir votre équipe', def:'A stronger cover-letter closing than only “discuss my profile”.', ex:'I would welcome the opportunity to discuss how my experience could support your team.'}

];

let score = 0;
const completed = new WeakSet();
function updateScore(points=0){
  score = Math.min(180, score + points);
  const scoreEl = document.getElementById('score');
  if(scoreEl) scoreEl.textContent = score;
  const msg = score < 30 ? 'Good start. Keep going.' : score < 90 ? 'Great progress. Continue the CV workshop.' : score < 150 ? 'Excellent. You are building strong international CV skills.' : 'Outstanding. You are ready to use your CV for interviews and cover letters.';
  const progress = document.getElementById('progressText');
  if(progress) progress.textContent = msg;
}

function speakText(text){
  if(!('speechSynthesis' in window)) return alert('Speech is not available in this browser.');
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/\s+/g,' ').trim());
  utterance.lang = document.getElementById('voiceSelect')?.value || 'en-GB';
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
}

document.querySelectorAll('.choice').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const box = btn.closest('.exercise, .mini-practice');
    const choices = box.querySelectorAll('.choice');
    choices.forEach(c=>c.classList.remove('correct','wrong'));
    const ok = btn.dataset.correct === 'true';
    btn.classList.add(ok ? 'correct' : 'wrong');
    const feedback = box.querySelector('.feedback');
    feedback.textContent = ok ? 'Correct — this is the strongest professional choice.' : 'Not the best choice yet. Look for the clearest international CV style.';
    if(ok && !completed.has(box)){
      completed.add(box);
      updateScore(Number(box.dataset.points || 5));
    }
  });
});

document.querySelectorAll('.check-fill').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const box = btn.closest('.mini-practice');
    const input = box.querySelector('.fill');
    const expected = input.dataset.answer.toLowerCase();
    const user = input.value.trim().toLowerCase();
    const ok = user === expected;
    input.style.borderColor = ok ? 'rgba(42,143,99,.75)' : 'rgba(184,75,75,.75)';
    box.querySelector('.feedback').textContent = ok ? 'Correct — use “for” with a duration.' : 'Try again. Use “for” with a duration.';
    if(ok && !completed.has(box)){
      completed.add(box);
      updateScore(Number(box.dataset.points || 5));
    }
  });
});

document.querySelectorAll('[data-reveal]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const target = document.getElementById(btn.dataset.reveal);
    target.classList.toggle('show');
    btn.textContent = target.classList.contains('show') ? 'Hide version' : 'Show professional version';
  });
});

document.querySelectorAll('[data-speak]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const target = document.querySelector(btn.dataset.speak);
    speakText(target.innerText || target.textContent);
  });
});

function renderVocab(){
  const grid = document.getElementById('vocabGrid');
  if(!grid) return;
  const cat = document.getElementById('categorySelect').value;
  const q = document.getElementById('vocabSearch').value.toLowerCase();
  const filtered = vocab.filter(v => (cat==='all' || v.cat===cat) && [v.term,v.fr,v.def,v.ex].join(' ').toLowerCase().includes(q));
  grid.innerHTML = filtered.map(v=>`<article class="vocab-card"><span class="cat">${v.cat}</span><h3>${v.term}</h3><p><strong>FR:</strong> ${v.fr}</p><p><strong>Definition:</strong> ${v.def}</p><p><strong>Example:</strong> ${v.ex}</p><button class="small-btn speak-vocab" data-text="${encodeURIComponent(v.term + '. ' + v.def + '. Example: ' + v.ex)}">🔊 Listen</button></article>`).join('');
  document.querySelectorAll('.speak-vocab').forEach(b=>b.addEventListener('click',()=>speakText(decodeURIComponent(b.dataset.text))));
}
document.getElementById('categorySelect')?.addEventListener('change', renderVocab);
document.getElementById('vocabSearch')?.addEventListener('input', renderVocab);
renderVocab();

const orderAnswer = [];
document.querySelectorAll('#orderBank button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    if(btn.classList.contains('used')) return;
    btn.classList.add('used');
    orderAnswer.push({order:Number(btn.dataset.order), text:btn.textContent});
    renderOrder();
  });
});
function renderOrder(){
  const box = document.getElementById('orderAnswer');
  if(box) box.innerHTML = orderAnswer.map(item=>`<span class="order-chip">${item.text}</span>`).join('');
}
document.getElementById('checkOrder')?.addEventListener('click',()=>{
  const good = orderAnswer.length === 8 && orderAnswer.every((item, idx)=> item.order === idx + 1);
  const fb = document.getElementById('orderFeedback');
  fb.textContent = good ? 'Excellent — this is a clear international CV order.' : 'Almost. A good order is: Contact details, title, profile, core skills, experience, selected achievements, education, languages & interests.';
  if(good && !document.getElementById('checkOrder').dataset.done){
    document.getElementById('checkOrder').dataset.done = 'true';
    updateScore(10);
  }
});
document.getElementById('clearOrder')?.addEventListener('click',()=>{
  orderAnswer.splice(0, orderAnswer.length);
  document.querySelectorAll('#orderBank button').forEach(btn=>btn.classList.remove('used'));
  renderOrder();
  document.getElementById('orderFeedback').textContent = '';
});

const builderParts = [];
document.querySelectorAll('#builderBank button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    if(btn.classList.contains('used')) return;
    btn.classList.add('used');
    builderParts.push(btn.dataset.text);
    renderBuilder();
  });
});
function renderBuilder(){
  const out = document.getElementById('builderOutput');
  if(out) out.textContent = builderParts.length ? builderParts.join(' ') : 'Click blocks to build your sentence.';
}
document.getElementById('listenBuilder')?.addEventListener('click',()=>speakText(document.getElementById('builderOutput').textContent));
document.getElementById('clearBuilder')?.addEventListener('click',()=>{
  builderParts.splice(0, builderParts.length);
  document.querySelectorAll('#builderBank button').forEach(btn=>btn.classList.remove('used'));
  renderBuilder();
});

let timer = 60;
let interval = null;
function showTimer(){
  const m = String(Math.floor(timer/60)).padStart(2,'0');
  const s = String(timer%60).padStart(2,'0');
  document.getElementById('timerDisplay').textContent = `${m}:${s}`;
}
document.getElementById('startTimer')?.addEventListener('click',()=>{
  clearInterval(interval);
  interval = setInterval(()=>{
    timer--;
    showTimer();
    if(timer <= 0){
      clearInterval(interval);
      speakText('Well done. Your sixty second speaking practice is finished.');
    }
  },1000);
});
document.getElementById('resetTimer')?.addEventListener('click',()=>{
  clearInterval(interval);
  timer = 60;
  showTimer();
});
showTimer();

document.getElementById('printBtn')?.addEventListener('click',()=>window.print());
document.getElementById('resetBtn')?.addEventListener('click',()=>{
  localStorage.removeItem('isabelle-cv-masterclass-notes');
  location.reload();
});
const notes = document.getElementById('notes');
if(notes){
  notes.value = localStorage.getItem('isabelle-cv-masterclass-notes') || '';
  notes.addEventListener('input',()=>localStorage.setItem('isabelle-cv-masterclass-notes', notes.value));
}
