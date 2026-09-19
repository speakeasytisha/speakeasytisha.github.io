
const qs = (s, root=document) => root.querySelector(s);
const qsa = (s, root=document) => [...root.querySelectorAll(s)];

let currentLang = localStorage.getItem('yanis-lang') || 'en';

function applyLanguage(lang){
  currentLang = lang;
  localStorage.setItem('yanis-lang', lang);
  document.body.classList.toggle('lang-fr-active', lang === 'fr');
  document.documentElement.lang = lang;

  qsa('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

  qsa('textarea').forEach(t => {
    t.placeholder = lang === 'fr' ? t.dataset.frPlaceholder : t.dataset.enPlaceholder;
  });

  qsa('.status').forEach(s => {
    const current = s.dataset.state || 'notchecked';
    const map = {
      notchecked: {en:'Not checked', fr:'Non vérifié'},
      progress: {en:'In progress', fr:'En cours'},
      good: {en:'Good', fr:'Bien'},
      retry: {en:'Try again', fr:'Réessayez'},
      needs: {en:'Needs one more step', fr:'Encore une étape'}
    };
    s.textContent = map[current]?.[lang] || map.notchecked[lang];
  });
}

qsa('.lang-btn').forEach(btn => btn.addEventListener('click', () => applyLanguage(btn.dataset.lang)));
applyLanguage(currentLang);

qs('#printBtn').addEventListener('click', () => window.print());

qsa('.phrase').forEach(btn => {
  btn.addEventListener('click', () => btn.classList.toggle('open'));
});

qsa('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    qsa('.filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    qsa('.phrase').forEach(p => {
      p.style.display = (f === 'all' || p.dataset.cat === f) ? 'block' : 'none';
    });
  });
});

const normalise = txt => txt.toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim();

function setStatus(statusEl, state){
  statusEl.dataset.state = state;
  const map = {
    notchecked: {en:'Not checked', fr:'Non vérifié'},
    progress: {en:'In progress', fr:'En cours'},
    good: {en:'Good', fr:'Bien'},
    retry: {en:'Try again', fr:'Réessayez'},
    needs: {en:'Needs one more step', fr:'Encore une étape'}
  };
  statusEl.textContent = map[state][currentLang];
}

qsa('.practice-card').forEach((card, idx) => {
  const textarea = qs('textarea', card);
  const feedback = qs('.feedback', card);
  const status = qs('.status', card);
  status.dataset.state = 'notchecked';

  const saved = localStorage.getItem(`yanis-practice-${idx}`);
  if(saved) {
    textarea.value = saved;
    setStatus(status, 'progress');
  }

  textarea.addEventListener('input', () => {
    localStorage.setItem(`yanis-practice-${idx}`, textarea.value);
    setStatus(status, textarea.value.trim() ? 'progress' : 'notchecked');
  });

  qs('.hint-btn', card).addEventListener('click', () => qs('.hint', card).classList.toggle('hidden'));
  qs('.model-btn', card).addEventListener('click', () => qs('.model', card).classList.toggle('hidden'));

  qs('.check-answer', card).addEventListener('click', () => {
    const text = normalise(textarea.value);
    const required = card.dataset.required.split(',');
    const hits = required.filter(k => text.includes(k));
    feedback.classList.remove('hidden','good','partial');

    if(!text){
      feedback.textContent = currentLang === 'fr'
        ? 'Écrivez d’abord une réponse courte. Visez 2 à 3 phrases claires.'
        : 'Write a short answer first. Aim for 2–3 clear sentences.';
      feedback.classList.add('partial');
      setStatus(status, 'retry');
      return;
    }

    if(hits.length >= Math.max(2, required.length - 1)){
      feedback.textContent = currentLang === 'fr'
        ? 'Bonne structure. Vous avez inclus les informations opérationnelles essentielles. Maintenant, dites-la une fois à voix haute sans lire.'
        : 'Good structure. You included the key operational information. Now say it aloud once without reading.';
      feedback.classList.add('good');
      setStatus(status, 'good');
    } else {
      const missing = required.filter(k => !text.includes(k)).join(', ');
      feedback.textContent = currentLang === 'fr'
        ? `Vous y êtes presque. Gardez la réponse simple et ajoutez l’idée clé manquante : ${missing}.`
        : `Almost there. Keep the answer simple and include the missing key idea(s): ${missing}.`;
      feedback.classList.add('partial');
      setStatus(status, 'needs');
    }
  });
});

qs('#resetBtn').addEventListener('click', () => {
  qsa('.practice-card').forEach((card, idx) => {
    qs('textarea', card).value = '';
    const st = qs('.status', card);
    setStatus(st, 'notchecked');
    qs('.feedback', card).className = 'feedback hidden';
    qs('.hint', card).classList.add('hidden');
    qs('.model', card).classList.add('hidden');
    localStorage.removeItem(`yanis-practice-${idx}`);
  });
});

qs('#exportBtn').addEventListener('click', () => {
  const title = currentLang === 'fr'
    ? 'Yanis — Notes d’entraînement du bilan LILATE'
    : 'Yanis — Final LILATE Debrief Practice Notes';
  const lines = [title, '='.repeat(title.length), ''];

  qsa('.practice-card').forEach((card, idx) => {
    const heading = currentLang === 'fr'
      ? qs('h3.lang-fr', card)?.textContent
      : qs('h3.lang-en', card)?.textContent;
    lines.push(`${currentLang === 'fr' ? 'Scénario' : 'Scenario'} ${idx+1}: ${heading}`);
    lines.push(qs('textarea', card).value.trim() || (currentLang === 'fr' ? '(Aucune réponse enregistrée)' : '(No answer saved)'));
    lines.push('');
  });

  const blob = new Blob([lines.join('\n')], {type:'text/plain;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = currentLang === 'fr' ? 'yanis-notes-entrainement-lilate.txt' : 'yanis-lilate-practice-notes.txt';
  a.click();
  URL.revokeObjectURL(a.href);
});
