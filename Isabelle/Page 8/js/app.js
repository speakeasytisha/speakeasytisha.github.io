const vocab = [
  {cat:'structure', term:'Profile', fr:'profil professionnel', def:'A short paragraph at the top of a CV that summarises your experience and target.', ex:'The profile explains your legal and commercial real estate expertise.'},
  {cat:'structure', term:'Core skills', fr:'compétences clés', def:'A short list of your most relevant professional abilities.', ex:'Core skills can include contract drafting, risk analysis and client relations.'},
  {cat:'structure', term:'Reverse chronological order', fr:'ordre antichronologique', def:'Starting with your most recent experience and moving backwards.', ex:'Your most recent legal role should appear before older sales roles.'},
  {cat:'verbs', term:'Advised', fr:'a conseillé', def:'Gave professional guidance or recommendations.', ex:'Advised operational teams on real estate law and risk prevention.'},
  {cat:'verbs', term:'Drafted', fr:'a rédigé', def:'Wrote a professional or legal document.', ex:'Drafted real estate development contracts.'},
  {cat:'verbs', term:'Negotiated', fr:'a négocié', def:'Discussed terms to reach an agreement.', ex:'Negotiated transaction terms and sale conditions.'},
  {cat:'verbs', term:'Reviewed', fr:'a examiné / vérifié', def:'Checked a document carefully.', ex:'Reviewed legal deeds and property documents.'},
  {cat:'verbs', term:'Liaised with', fr:'a échangé / assuré la liaison avec', def:'Communicated and coordinated with people or organisations.', ex:'Liaised with notaries, lawyers and investors.'},
  {cat:'verbs', term:'Managed', fr:'a géré', def:'Was responsible for a project, budget, team or activity.', ex:'Managed an annual fees budget of approximately €1 million excluding VAT.'},
  {cat:'legal', term:'Real Estate Legal Specialist', fr:'juriste immobilier', def:'A safer English title for a legal professional in real estate who is not necessarily a qualified lawyer.', ex:'Real Estate Legal Specialist is safer than Real Estate Lawyer in many international contexts.'},
  {cat:'legal', term:'Off-plan sale', fr:'VEFA', def:'A property sale signed before the property is completed.', ex:'You worked on off-plan sale agreements for residential developments.'},
  {cat:'legal', term:'Off-plan lease', fr:'BEFA', def:'A lease signed before the premises are completed.', ex:'An off-plan lease is often used for commercial premises under construction.'},
  {cat:'legal', term:'Reservation agreement', fr:'contrat de réservation', def:'An agreement used before the final sale contract.', ex:'Drafted and reviewed reservation agreements.'},
  {cat:'legal', term:'Easement', fr:'servitude', def:'A legal right affecting the use of land or property.', ex:'Reviewed documents related to the creation of easements.'},
  {cat:'legal', term:'Settlement agreement', fr:'protocole transactionnel', def:'An agreement used to settle a dispute.', ex:'Drafted settlement agreements in litigation matters.'},
  {cat:'sales', term:'Property valuation', fr:'valorisation d’immeuble', def:'An estimate or study of a property’s value.', ex:'Prepared property valuation studies and sale proposals.'},
  {cat:'sales', term:'Private clients', fr:'particuliers', def:'Individual clients, not companies or institutions.', ex:'Worked with private clients and professional partners.'},
  {cat:'sales', term:'Social landlord', fr:'bailleur social', def:'An organisation that provides social housing.', ex:'Liaised with social landlords and institutional owners.'},
  {cat:'sales', term:'Annual fees budget', fr:'budget annuel d’honoraires', def:'The yearly amount of fees managed or generated.', ex:'Managed an annual fees budget of approximately €1 million excluding VAT.'},
  {cat:'sales', term:'Client needs analysis', fr:'analyse des besoins clients', def:'Understanding what a client needs before recommending a solution.', ex:'Client needs analysis is useful in real estate agencies.'},
  {cat:'dutch', term:'The Netherlands', fr:'les Pays-Bas', def:'The country name in English. Always use “the”.', ex:'You are looking for a professional opportunity in the Netherlands.'},
  {cat:'dutch', term:'Amsterdam area', fr:'région d’Amsterdam', def:'Amsterdam and the surrounding area.', ex:'You are looking for a job in the Amsterdam area.'},
  {cat:'dutch', term:'International profile', fr:'profil international', def:'A profile that can work across countries, cultures or languages.', ex:'Your international profile combines French real estate expertise and English communication.'},
  {cat:'dutch', term:'Tailored CV', fr:'CV adapté', def:'A CV adapted to a specific role or job market.', ex:'A tailored CV is stronger than a direct translation.'}
];

let score = 0;
const completed = new WeakSet();
function updateScore(points=0){
  score = Math.min(100, score + points);
  document.getElementById('score').textContent = score;
  const msg = score < 30 ? 'Good start. Keep going.' : score < 70 ? 'Great progress. Continue the workshop.' : 'Excellent. You are ready for the final model.';
  document.getElementById('progressText').textContent = msg;
}

document.querySelectorAll('.choice').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const box = btn.closest('.exercise, .mini-practice');
    const choices = box.querySelectorAll('.choice');
    choices.forEach(c=>c.classList.remove('correct','wrong'));
    const ok = btn.dataset.correct === 'true';
    btn.classList.add(ok ? 'correct' : 'wrong');
    box.querySelector('.feedback').textContent = ok ? 'Correct — this is the most professional choice.' : 'Not the best choice yet. Try again and look for the clearest international CV style.';
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
    btn.textContent = target.classList.contains('show') ? 'Hide' : 'Show CV version';
  });
});

function speakText(text){
  if(!('speechSynthesis' in window)) return alert('Speech is not available in this browser.');
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/\s+/g,' ').trim());
  utterance.lang = document.getElementById('voiceSelect').value;
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
}

document.querySelectorAll('[data-speak]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const target = document.querySelector(btn.dataset.speak);
    speakText(target.innerText || target.textContent);
  });
});

function renderVocab(){
  const grid = document.getElementById('vocabGrid');
  const cat = document.getElementById('categorySelect').value;
  const q = document.getElementById('vocabSearch').value.toLowerCase();
  const filtered = vocab.filter(v => (cat==='all' || v.cat===cat) && [v.term,v.fr,v.def,v.ex].join(' ').toLowerCase().includes(q));
  grid.innerHTML = filtered.map(v=>`<article class="vocab-card"><span class="cat">${v.cat}</span><h3>${v.term}</h3><p><strong>FR:</strong> ${v.fr}</p><p><strong>Definition:</strong> ${v.def}</p><p><strong>Example:</strong> ${v.ex}</p><button class="small-btn speak-vocab" data-text="${encodeURIComponent(v.term + '. ' + v.def + '. Example: ' + v.ex)}">🔊 Listen</button></article>`).join('');
  document.querySelectorAll('.speak-vocab').forEach(b=>b.addEventListener('click',()=>speakText(decodeURIComponent(b.dataset.text))));
}

document.getElementById('categorySelect').addEventListener('change', renderVocab);
document.getElementById('vocabSearch').addEventListener('input', renderVocab);
renderVocab();

const answer = [];
document.querySelectorAll('#orderBank button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    if(btn.classList.contains('used')) return;
    btn.classList.add('used');
    answer.push({order:Number(btn.dataset.order), text:btn.textContent});
    renderOrder();
  });
});
function renderOrder(){
  const box = document.getElementById('orderAnswer');
  box.innerHTML = answer.map(item=>`<span class="order-chip">${item.text}</span>`).join('');
}
document.getElementById('clearOrder').addEventListener('click',()=>{
  answer.length = 0;
  document.querySelectorAll('#orderBank button').forEach(b=>b.classList.remove('used'));
  renderOrder();
  document.getElementById('orderFeedback').textContent = '';
});
document.getElementById('checkOrder').addEventListener('click',()=>{
  const ok = answer.length === 7 && answer.every((item, i)=>item.order === i+1);
  const fb = document.getElementById('orderFeedback');
  fb.textContent = ok ? 'Excellent — this is a clear international CV structure.' : 'Almost. Try this order: contact, title, profile, skills, experience, education, languages/interests.';
  if(ok && !completed.has(fb)){completed.add(fb); updateScore(10);}
});

let timer = null;
let remaining = 90;
function showTime(){
  const m = Math.floor(remaining/60).toString().padStart(2,'0');
  const s = (remaining%60).toString().padStart(2,'0');
  document.getElementById('timerDisplay').textContent = `${m}:${s}`;
}
document.getElementById('startTimer').addEventListener('click',()=>{
  clearInterval(timer); remaining = 90; showTime();
  timer = setInterval(()=>{
    remaining--;
    showTime();
    if(remaining<=0){clearInterval(timer); speakText('Time is up. Well done.');}
  },1000);
});
document.getElementById('stopTimer').addEventListener('click',()=>clearInterval(timer));

document.getElementById('printBtn').addEventListener('click',()=>window.print());
document.getElementById('resetBtn').addEventListener('click',()=>{
  score = 0; updateScore(0);
  document.querySelectorAll('.choice').forEach(c=>c.classList.remove('correct','wrong'));
  document.querySelectorAll('.feedback').forEach(f=>f.textContent='');
  document.querySelectorAll('.reveal').forEach(r=>r.classList.remove('show'));
  document.getElementById('clearOrder').click();
  window.scrollTo({top:0,behavior:'smooth'});
});
