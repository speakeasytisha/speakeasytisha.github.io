
const vocabData = {
  family: [
    ["a relative", "un membre de la famille", "You would like to contact a relative."],
    ["a cousin", "un cousin / une cousine", "You have not spoken to your cousin in years."],
    ["an old friend", "un vieil ami / une vieille amie", "You are writing to an old friend."],
    ["a childhood friend", "un ami d’enfance / une amie d’enfance", "She was a childhood friend."],
    ["a colleague", "un collègue / une collègue", "He was an old colleague."],
    ["to lose touch", "perdre contact", "You lost touch after school."],
    ["to get back in touch", "reprendre contact", "You want to get back in touch."],
    ["to catch up", "rattraper le temps perdu / prendre des nouvelles", "It would be lovely to catch up."]
  ],
  school: [
    ["middle school", "le collège", "You knew each other in middle school."],
    ["high school", "le lycée", "You met in high school."],
    ["classmate", "camarade de classe", "She was one of your classmates."],
    ["school days", "les années d’école", "You still remember your school days."],
    ["after school", "après les cours", "You used to talk after school."],
    ["graduation", "la fin des études", "After graduation, life changed."],
    ["to study together", "étudier ensemble", "You used to study together."],
    ["to dream about the future", "rêver de l’avenir", "You used to dream about the future."]
  ],
  work: [
    ["retired", "à la retraite", "You are retired now."],
    ["an assessor", "un assesseur", "You work as an assessor."],
    ["in my free time", "dans mon temps libre", "You work as an assessor in your free time."],
    ["regular basis", "de manière régulière", "You do this on a regular basis."],
    ["current situation", "situation actuelle", "You can explain your current situation."],
    ["a quieter life", "une vie plus calme", "You live a quieter life now."],
    ["meaningful", "porteur de sens", "This work is meaningful to you."],
    ["these days", "de nos jours / en ce moment", "These days, you enjoy a calmer rhythm."]
  ],
  children: [
    ["children", "enfants", "You can talk about your children."],
    ["son", "fils", "Your son lives in Denmark."],
    ["daughter", "fille", "Your daughter lives in France."],
    ["granddaughter", "petite-fille", "Your granddaughter is growing up fast."],
    ["to live in...", "vivre à...", "Your son lives in Denmark."],
    ["to work as...", "travailler comme...", "He works as an engineer."],
    ["to study", "étudier", "She is studying at university."],
    ["family has grown", "la famille s’est agrandie", "Your family has grown since then."]
  ],
  reconnect: [
    ["It has been such a long time.", "Cela fait si longtemps.", "It has been such a long time."],
    ["I was thinking about you recently.", "Je pensais à toi récemment.", "I was thinking about you recently."],
    ["I would love to catch up.", "J’aimerais beaucoup reprendre contact.", "I would love to catch up."],
    ["So much has happened.", "Il s’est passé tellement de choses.", "So much has happened since we last spoke."],
    ["I never forgot...", "Je n’ai jamais oublié...", "I never forgot your kindness."],
    ["I miss...", "Tu me manques / cela me manque", "I miss our conversations."],
    ["I would love to hear from you.", "J’aimerais avoir de tes nouvelles.", "I would love to hear from you."],
    ["It still matters to me.", "Cela compte encore pour moi.", "Those memories still matter to me."]
  ],
  memories: [
    ["Do you remember when...?", "Tu te souviens quand... ?", "Do you remember when we used to walk home together?"],
    ["We used to...", "Nous avions l’habitude de...", "We used to laugh all the time."],
    ["I still remember...", "Je me souviens encore...", "I still remember our conversations."],
    ["At that time...", "À cette époque...", "At that time, life felt simpler."],
    ["While we were...", "Pendant que nous...", "While we were studying, we were also dreaming about the future."],
    ["I have never forgotten...", "Je n’ai jamais oublié...", "I have never forgotten those moments."],
    ["shared memories", "souvenirs partagés", "You still have shared memories."],
    ["a turning point", "un tournant", "That time was a turning point in your life."]
  ],
  connectors: [
    ["first", "d’abord", "First, I wanted to say hello."],
    ["then", "puis", "Then, I thought about our memories."],
    ["after that", "après cela", "After that, life changed a lot."],
    ["since then", "depuis ce moment-là", "Since then, many things have changed."],
    ["now", "maintenant", "Now, I have a different life."],
    ["these days", "de nos jours / en ce moment", "These days, I run twice a week."],
    ["however", "cependant", "However, I never forgot your friendship."],
    ["because", "parce que", "This matters because those memories are still important to me."]
  ]
};

const exercises = [
  {q:"Choose the correct sentence.", options:["I have been retired since 7 months.","I have been retired for 7 months.","I am retired for 7 months."], a:1, hint:"Use for + duration."},
  {q:"Choose the correct sentence.", options:["I usually run twice a week.","I am usually running twice a week.","I have run twice a week."], a:0, hint:"Routine = present simple."},
  {q:"Choose the correct sentence.", options:["Since then, many things changed.","Since then, many things have changed.","Since then, many things are changing."], a:1, hint:"Since then often goes with present perfect."},
  {q:"Choose the correct sentence.", options:["We used to talking after school.","We used to talk after school.","We were used to talk after school."], a:1, hint:"Use used to + base verb."},
  {q:"Choose the correct sentence.", options:["Do you remember when we were walking home together?","Do you remember when we used to walk home together?","Do you remember when we use to walk home together?"], a:1, hint:"Repeated past habit = used to."},
  {q:"Choose the correct connector.", options:["because","however","after that"], a:2, stem:"First, I wanted to write to you. ________, I started thinking about our old memories.", hint:"You need a sequence connector."},
  {q:"Choose the correct tense keyword.", options:["did","have","are"], a:1, stem:"How long ________ you worked as an assessor?", hint:"Duration up to now = present perfect."},
  {q:"Choose the correct sentence.", options:["I am planning a new trip to Denmark these days.","I plan a new trip to Denmark these days.","I have planned a new trip to Denmark these days."], a:0, hint:"Around now = present continuous."},
  {q:"Choose the correct sentence.", options:["My son lives in Denmark now.","My son is live in Denmark now.","My son living in Denmark now."], a:0, hint:"General fact = present simple."},
  {q:"Choose the correct sentence.", options:["While we were studying, we talked every day.","While we studied, we were talked every day.","While we were studying, we were talking every day."], a:2, hint:"Past background action in progress."},
  {q:"Choose the correct sentence.", options:["I have never forgot those memories.","I never forgot those memories.","I have never forgotten those memories."], a:2, hint:"Present perfect = have never forgotten."},
  {q:"Choose the correct sentence.", options:["It has been such a long time.","It is such a long time since we speak.","It has such a long time."], a:0, hint:"Use It has been..." },
  {q:"Choose the correct sentence.", options:["I would love to hear from you.","I would love hear from you.","I would love to hearing from you."], a:0, hint:"Would love to + base verb."},
  {q:"Choose the correct sentence.", options:["My family has grew.","My family has grown.","My family grew since then."], a:1, hint:"Grow → grown."},
  {q:"Choose the correct sentence.", options:["Those memories helped make me who I am today.","Those memories help made me who I am today.","Those memories have help make me who I am today."], a:0, hint:"This sentence is correct in the simple past story frame."}
];

function renderVocab(category) {
  const display = document.getElementById('vocabDisplay');
  const items = vocabData[category] || [];
  display.innerHTML = '<div class="vocab-grid">' + items.map(function(item){
    return '<div class="vocab-item"><strong>' + item[0] + '</strong><span>' + item[1] + '</span><em>' + item[2] + '</em></div>';
  }).join('') + '</div>';
}

function renderExercises() {
  const grid = document.getElementById('exerciseGrid');
  grid.innerHTML = exercises.map(function(ex, i){
    return '<div class="exercise-box">' +
      '<p><strong>Exercise ' + (i+1) + ':</strong> ' + ex.q + '</p>' +
      (ex.stem ? '<p>' + ex.stem + '</p>' : '') +
      '<select id="ex' + i + '">' +
      '<option value="">Choose...</option>' +
      ex.options.map(function(opt, idx){
        return '<option value="' + (idx===ex.a ? '1':'0') + '">' + opt + '</option>';
      }).join('') +
      '</select>' +
      '<div class="button-row">' +
      '<button class="check-btn" data-target="ex' + i + '" data-feedback="fb-ex' + i + '">Check</button>' +
      '<button class="hint-btn" data-feedback="fb-ex' + i + '" data-hint="' + ex.hint + '">Hint</button>' +
      '</div>' +
      '<div id="fb-ex' + i + '" class="feedback"></div>' +
      '</div>';
  }).join('');
}

document.addEventListener('DOMContentLoaded', function() {
  function speak(text) {
    if (!('speechSynthesis' in window)) {
      alert('Speech is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-GB';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  }

  document.querySelectorAll('.speak-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      speak(btn.dataset.speak || btn.textContent.trim());
    });
  });

  document.getElementById('openingModel').addEventListener('click', function() {
    document.getElementById('openingBox').value =
      'Hello! It has been such a long time. I was thinking about you recently, and I would love to catch up. So much has happened since we last spoke.';
  });

  document.getElementById('openingSpeak').addEventListener('click', function() {
    const text = document.getElementById('openingBox').value.trim();
    speak(text || 'Please write your opening first.');
  });

  const categorySelect = document.getElementById('vocabCategory');
  renderVocab(categorySelect.value);
  categorySelect.addEventListener('change', function() {
    renderVocab(categorySelect.value);
  });

  renderExercises();

  function setFeedback(id, ok, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.className = 'feedback ' + (ok ? 'ok' : 'bad');
  }

  document.addEventListener('click', function(e) {
    const checkBtn = e.target.closest('.check-btn');
    if (checkBtn) {
      const select = document.getElementById(checkBtn.dataset.target);
      const fb = checkBtn.dataset.feedback;
      if (!select.value) {
        setFeedback(fb, false, 'Choose an answer first.');
        return;
      }
      if (select.value === '1') setFeedback(fb, true, 'Correct ✅');
      else {
        const correct = Array.from(select.options).find(function(o){ return o.value === '1'; });
        setFeedback(fb, false, 'Not quite. Correct answer: ' + (correct ? correct.textContent : 'Try again.'));
      }
    }

    const hintBtn = e.target.closest('.hint-btn');
    if (hintBtn) {
      setFeedback(hintBtn.dataset.feedback, false, 'Hint: ' + (hintBtn.dataset.hint || 'Check the tense and structure.'));
    }
  });
});


function normText(s){return String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();}
document.querySelectorAll('.answer-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.input);
    const fb = btn.dataset.feedback;
    const answers = (btn.dataset.answer || '').split('||').map(normText);
    const el = document.getElementById(fb);
    if (answers.includes(normText(input.value))) {
      el.textContent = 'Correct ✅';
      el.className = 'feedback ok';
    } else {
      el.textContent = 'Not quite. Try again.';
      el.className = 'feedback bad';
    }
  });
});

// Qualiopi footer
const evalStorageKey = location.pathname + '-qualiopi-evaluation-v1';
const lessonSections = [
  {id:'1', objective:'Open contact warmly and appropriately', subject:'Warm-up and first contact', method:'Guided opening'},
  {id:'2', objective:'Use vocabulary about family, school, work, and reconnecting', subject:'Vocabulary by category', method:'Vocabulary exploration'},
  {id:'3', objective:'Use connectors to organise a catch-up story', subject:'Connectors and sequencing', method:'Structured speaking'},
  {id:'4', objective:'Recognise and use the correct tense for present, past, and life changes', subject:'Grammar toolkit', method:'Guided grammar review'},
  {id:'5', objective:'Build a structured catch-up message step by step', subject:'Step-by-step catch-up guide', method:'Guided speaking and writing'},
  {id:'6', objective:'Use memory language to talk about shared experiences', subject:'Memory language', method:'Oral production'},
  {id:'7', objective:'Practise grammar, vocabulary, and structure through exercises', subject:'Practice zone', method:'Interactive practice'},
  {id:'8', objective:'Produce a warm, personal catch-up paragraph', subject:'Writing and speaking studio', method:'Written and oral production'}
];
const manualDefinitions = [
  {id:'oral-catchup', objective:'Speak naturally about life now, change, and memories', subject:'Oral catch-up speaking', method:'Manual oral assessment'},
  {id:'writing-message', objective:'Write a warm, structured message to reconnect', subject:'Writing catch-up message', method:'Manual writing assessment'}
];
let manualStatus = {};
let manualComments = {};
function statusLabel(value){return {'achieved':'Objectif atteint','progress':'Objectif en cours d’acquisition','not-achieved':'Objectif non atteint','not-started':'Non commencé'}[value]||value;}
function renderQualiopiEvaluation(){
  const rows = document.getElementById('evaluationRows');
  if (!rows) return;
  const autoRows = lessonSections.map(item => '<tr><td>'+item.objective+'</td><td>'+item.subject+'</td><td>'+item.method+'</td><td>Completed</td><td><span class="status-badge achieved">Objectif atteint</span></td></tr>').join('');
  const manualRows = manualDefinitions.map(item => {
    const st = manualStatus[item.id] || 'not-started';
    return '<tr><td>'+item.objective+'</td><td>'+item.subject+'</td><td>'+item.method+'</td><td>Évaluation manuelle</td><td><span class="status-badge '+st+'">'+statusLabel(st)+'</span></td></tr>';
  }).join('');
  rows.innerHTML = autoRows + manualRows;
  const manualCompleted = manualDefinitions.filter(item => (manualStatus[item.id]||'not-started') !== 'not-started').length;
  const total = lessonSections.length + manualDefinitions.length;
  const completed = lessonSections.length + manualCompleted;
  const rate = Math.round((completed/total)*100);
  const completion = document.getElementById('completionRate');
  if (completion) completion.textContent = rate + '%';
  const statuses = manualDefinitions.map(item => manualStatus[item.id]||'not-started');
  const overall = manualCompleted === 0 ? 'progress' : (statuses.every(st => st === 'achieved') ? 'achieved' : statuses.some(st => st === 'not-achieved') ? 'not-achieved' : 'progress');
  const overallEl = document.getElementById('overallStatus');
  if (overallEl) {
    overallEl.textContent = statusLabel(overall);
    overallEl.className = 'status-badge ' + overall;
  }
}
function saveEvaluation(showMessage){
  const state = {
    learner: document.getElementById('learnerName')?.value || 'Catherine',
    trainer: document.getElementById('trainerName')?.value || '',
    date: document.getElementById('evaluationDate')?.value || '',
    manualStatus,
    manualComments,
    generalComments: document.getElementById('generalTrainerComments')?.value || '',
    lastSaved: new Date().toISOString()
  };
  localStorage.setItem(evalStorageKey, JSON.stringify(state));
  const last = document.getElementById('lastSaved');
  if (last) last.textContent = new Date(state.lastSaved).toLocaleString();
  if (showMessage) alert('Evaluation saved in this browser.');
}
function loadEvaluation(){
  try{
    const raw = localStorage.getItem(evalStorageKey);
    if (!raw) return;
    const s = JSON.parse(raw);
    manualStatus = s.manualStatus || {};
    manualComments = s.manualComments || {};
    if (document.getElementById('learnerName') && s.learner) document.getElementById('learnerName').value = s.learner;
    if (document.getElementById('trainerName') && s.trainer) document.getElementById('trainerName').value = s.trainer;
    if (document.getElementById('evaluationDate') && s.date) document.getElementById('evaluationDate').value = s.date;
    if (document.getElementById('generalTrainerComments')) document.getElementById('generalTrainerComments').value = s.generalComments || '';
    if (document.getElementById('lastSaved') && s.lastSaved) document.getElementById('lastSaved').textContent = new Date(s.lastSaved).toLocaleString();
    document.querySelectorAll('[data-manual-status]').forEach(sel => sel.value = manualStatus[sel.dataset.manualStatus] || 'not-started');
    document.querySelectorAll('[data-manual-comment]').forEach(area => area.value = manualComments[area.dataset.manualComment] || '');
  }catch(e){}
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500);}
function exportEvaluation(){
  saveEvaluation(false);
  const learner = document.getElementById('learnerName')?.value || 'Catherine';
  const trainer = document.getElementById('trainerName')?.value || '';
  const date = document.getElementById('evaluationDate')?.value || '';
  const completion = document.getElementById('completionRate')?.textContent || '0%';
  const overall = document.getElementById('overallStatus')?.textContent || 'En cours d’acquisition';
  const general = document.getElementById('generalTrainerComments')?.value || '';
  const rows = [...lessonSections.map(item => [item.objective,item.subject,item.method,'Completed','Objectif atteint']),
                ...manualDefinitions.map(item => [item.objective,item.subject,item.method,'Évaluation manuelle',statusLabel(manualStatus[item.id]||'not-started')])];
  const tableRows = rows.map(row => '<tr>'+row.map(cell => '<td>'+escapeHtml(cell)+'</td>').join('')+'</tr>').join('');
  const manual = manualDefinitions.map(item => '<h3>'+escapeHtml(item.subject)+'</h3><p><b>Résultat:</b> '+escapeHtml(statusLabel(manualStatus[item.id]||'not-started'))+'</p><div style="white-space:pre-wrap;border:1px solid #ccc;padding:10px;border-radius:8px;margin-bottom:10px">'+escapeHtml(manualComments[item.id] || 'Aucun commentaire spécifique.')+'</div>').join('');
  const report = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Bilan Qualiopi - '+escapeHtml(learner)+'</title><style>body{font-family:Arial,sans-serif;max-width:1100px;margin:35px auto;padding:0 24px;color:#222}h1{color:#10384b}h2{color:#1a6c72}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #aaa;padding:8px;vertical-align:top}th{background:#eee}.meta{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:18px 0}.box{border:1px solid #bbb;padding:10px;border-radius:8px}</style></head><body><h1>Bilan d\'évaluation des acquis - Qualiopi</h1><h2>Blast from the Past</h2><div class="meta"><div class="box"><b>Apprenante:</b> '+escapeHtml(learner)+'</div><div class="box"><b>Formatrice:</b> '+escapeHtml(trainer)+'</div><div class="box"><b>Date:</b> '+escapeHtml(date)+'</div><div class="box"><b>Completion:</b> '+escapeHtml(completion)+'</div><div class="box"><b>Résultat global:</b> '+escapeHtml(overall)+'</div></div><table><thead><tr><th>Objectif pédagogique</th><th>Support / sujet</th><th>Mode d\'évaluation</th><th>Progression</th><th>Résultat</th></tr></thead><tbody>'+tableRows+'</tbody></table><h2>Commentaires oraux et écrits</h2>'+manual+'<h2>Commentaire général de la formatrice</h2><div style="white-space:pre-wrap;border:1px solid #ccc;padding:10px;border-radius:8px">'+escapeHtml(general || 'Aucune observation saisie.')+'</div></body></html>';
  downloadBlob(new Blob([report], {type:'text/html;charset=utf-8'}), 'Catherine-Blast-from-the-Past-Qualiopi.html');
}
loadEvaluation();
document.querySelectorAll('[data-manual-status]').forEach(sel => sel.addEventListener('change', () => {manualStatus[sel.dataset.manualStatus] = sel.value; renderQualiopiEvaluation(); saveEvaluation(false);}));
document.querySelectorAll('[data-manual-comment]').forEach(area => area.addEventListener('input', () => {manualComments[area.dataset.manualComment] = area.value; saveEvaluation(false);}));
document.getElementById('generalTrainerComments')?.addEventListener('input', () => saveEvaluation(false));
document.getElementById('saveEvaluation')?.addEventListener('click', () => saveEvaluation(true));
document.getElementById('exportEvaluation')?.addEventListener('click', exportEvaluation);
renderQualiopiEvaluation();
