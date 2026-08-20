'use strict';

const state = {
  sectionIndex: 0,
  timerSeconds: 60 * 60,
  timerInterval: null,
  grammarCorrect: new Set(),
  trendCorrect: new Set(),
  numberCorrect: new Set(),
  listeningScore: 0,
  meetingSeconds: 60,
  meetingInterval: null
};

const sections = [...document.querySelectorAll('.lesson-section')];
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
const stepDots = document.getElementById('stepDots');
const toast = document.getElementById('toast');

function init() {
  createStepDots();
  bindNavigation();
  bindHeader();
  bindTimer();
  bindSpeechButtons();
  bindRevealButtons();
  bindInstantQuizzes();
  bindGrammarQuiz();
  bindGraphBuilder();
  bindListening();
  bindMeetingTimer();
  bindBilan();
  bindSaveReset();
  setDateStamp();
  restoreSession();
  updateGraphOutput();
  updateScores();
  showSection(0);
}

document.addEventListener('DOMContentLoaded', init);

function createStepDots() {
  stepDots.innerHTML = '';
  sections.forEach((section, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `${index + 1}. ${section.dataset.title}`);
    button.title = section.dataset.title;
    button.innerHTML = `<span>${index + 1}</span>`;
    button.addEventListener('click', () => showSection(index));
    stepDots.appendChild(button);
  });
}

function bindNavigation() {
  document.querySelectorAll('[data-next]').forEach(btn => btn.addEventListener('click', () => showSection(Math.min(state.sectionIndex + 1, sections.length - 1))));
  document.querySelectorAll('[data-prev]').forEach(btn => btn.addEventListener('click', () => showSection(Math.max(state.sectionIndex - 1, 0))));
}

function showSection(index) {
  state.sectionIndex = index;
  sections.forEach((section, i) => section.classList.toggle('active', i === index));
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
  const pct = ((state.sectionIndex + 1) / sections.length) * 100;
  if (progressBar) progressBar.style.width = `${pct}%`;
  if (progressLabel) progressLabel.textContent = sections[state.sectionIndex]?.dataset.title || '';
  [...stepDots.children].forEach((dot, i) => dot.classList.toggle('active', i === state.sectionIndex));
}

function bindHeader() {
  const toggle = document.getElementById('translationToggle');
  if (toggle) toggle.addEventListener('click', () => {
    const show = document.body.classList.toggle('show-fr');
    toggle.classList.toggle('active', show);
    toggle.setAttribute('aria-pressed', String(show));
    toggle.querySelector('span:last-child').textContent = show ? 'Traductions visibles' : 'Afficher les traductions';
  });
}

function bindTimer() {
  document.getElementById('timerStart')?.addEventListener('click', () => {
    if (state.timerInterval) return;
    state.timerInterval = setInterval(() => {
      if (state.timerSeconds <= 0) { pauseTimer(); return; }
      state.timerSeconds -= 1;
      updateTimer();
    }, 1000);
  });
  document.getElementById('timerPause')?.addEventListener('click', pauseTimer);
  document.getElementById('timerReset')?.addEventListener('click', () => {
    pauseTimer(); state.timerSeconds = 60 * 60; updateTimer();
  });
  updateTimer();
}

function pauseTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = null;
}

function updateTimer() {
  const m = String(Math.floor(state.timerSeconds / 60)).padStart(2, '0');
  const s = String(state.timerSeconds % 60).padStart(2, '0');
  const el = document.getElementById('sessionTimer');
  if (el) el.textContent = `${m}:${s}`;
}

function bindSpeechButtons() {
  document.addEventListener('click', event => {
    const btn = event.target.closest('.speak-button[data-speak]');
    if (btn) speak(btn.dataset.speak);
  });
}

function speak(text) {
  if (!('speechSynthesis' in window)) { showToast('La synthèse vocale n’est pas disponible dans ce navigateur.'); return; }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const lang = document.getElementById('accentSelect')?.value || 'en-US';
  utterance.lang = lang;
  const voices = speechSynthesis.getVoices();
  const exact = voices.find(v => v.lang === lang);
  const partial = voices.find(v => v.lang?.startsWith(lang.slice(0, 2)));
  if (exact || partial) utterance.voice = exact || partial;
  utterance.rate = 0.93;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

function bindRevealButtons() {
  document.querySelectorAll('.reveal-recall,.model-pressure').forEach(btn => btn.addEventListener('click', () => document.getElementById(btn.dataset.target)?.classList.toggle('hidden')));
  document.getElementById('showSmallTalkModel')?.addEventListener('click', () => document.getElementById('smallTalkModel')?.classList.toggle('hidden'));
}

function bindInstantQuizzes() {
  bindQuizGroup('trendQuiz', 'trend');
  bindQuizGroup('numberQuiz', 'number');
  document.querySelectorAll('.audio-choice').forEach(item => {
    const play = document.createElement('button');
    play.type = 'button';
    play.className = 'mini-button';
    play.textContent = '🔊 Listen';
    play.addEventListener('click', () => speak(item.dataset.audio || ''));
    item.insertBefore(play, item.querySelector('div'));
  });
}

function bindQuizGroup(id, kind) {
  const root = document.getElementById(id);
  if (!root) return;
  [...root.querySelectorAll('.quiz-item')].forEach((item, idx) => {
    item.querySelectorAll('button[data-answer]').forEach(btn => btn.addEventListener('click', () => {
      const correct = btn.dataset.answer === item.dataset.correct;
      item.querySelectorAll('button[data-answer]').forEach(b => b.classList.remove('is-correct','is-wrong'));
      btn.classList.add(correct ? 'is-correct' : 'is-wrong');
      const feedback = item.querySelector('.quiz-feedback');
      if (feedback) { feedback.classList.remove('correct','wrong'); feedback.classList.add(correct ? 'correct' : 'wrong'); feedback.textContent = correct ? '✓ Correct' : '✗ Try again'; }
      const set = kind === 'trend' ? state.trendCorrect : state.numberCorrect;
      if (correct) set.add(idx); else set.delete(idx);
      updateScores();
    }));
  });
}

function bindGrammarQuiz() {
  const root = document.getElementById('grammarQuiz');
  if (!root) return;
  [...root.querySelectorAll('.grammar-question')].forEach((item, idx) => {
    item.querySelectorAll('button[data-answer]').forEach(btn => btn.addEventListener('click', () => {
      const correct = btn.dataset.answer === item.dataset.correct;
      item.querySelectorAll('button[data-answer]').forEach(b => b.classList.remove('is-correct','is-wrong'));
      btn.classList.add(correct ? 'correct' : 'wrong');
      const fb = item.querySelector('.explain-feedback');
      if (fb) fb.textContent = correct ? `✓ Correct. ${item.dataset.explain}` : `✗ Not yet. Hint: ${item.dataset.explain}`;
      if (correct) state.grammarCorrect.add(idx); else state.grammarCorrect.delete(idx);
      updateScores();
    }));
  });
}

function bindGraphBuilder() {
  document.querySelectorAll('#graphBuilder select').forEach(select => select.addEventListener('change', updateGraphOutput));
  document.getElementById('speakGraphOutput')?.addEventListener('click', () => speak(document.getElementById('graphOutput')?.textContent || ''));
  document.getElementById('copyGraphOutput')?.addEventListener('click', () => copyText(document.getElementById('graphOutput')?.textContent || '', 'Commentaire copié.'));
}

function updateGraphOutput() {
  const values = [...document.querySelectorAll('#graphBuilder select')].map(s => s.value);
  const out = document.getElementById('graphOutput');
  if (out) out.textContent = values.join(' ');
}

function bindListening() {
  document.getElementById('playListening')?.addEventListener('click', () => speak('Hi Thomas, just a quick update. Since the beginning of the quarter, output has improved by twenty-four percent. We still need to validate three remaining items. Could you send the revised figures by Wednesday the twenty-sixth? If we receive them in time, we can include them in the final presentation.'));
  document.getElementById('revealTranscript')?.addEventListener('click', () => document.getElementById('listenTranscript')?.classList.toggle('hidden'));
  document.getElementById('checkListening')?.addEventListener('click', checkListening);
}

function normalise(value) {
  return String(value || '').toLowerCase().trim().replace(/[%.,]/g,'').replace(/\s+/g,' ');
}

function checkListening() {
  let score = 0;
  const percent = normalise(document.getElementById('listenPercent')?.value);
  const date = normalise(document.getElementById('listenDate')?.value);
  const qty = normalise(document.getElementById('listenQuantity')?.value);
  const action = normalise(document.getElementById('listenAction')?.value);
  if (['24','twenty-four','twenty four'].includes(percent)) score++;
  if (date.includes('26') || date.includes('twenty sixth') || date.includes('wednesday')) score++;
  if (['3','three'].includes(qty)) score++;
  if ((action.includes('send') || action.includes('email')) && (action.includes('figure') || action.includes('revised'))) score++;
  state.listeningScore = score;
  const result = document.getElementById('listenResult');
  if (result) result.textContent = `${score} / 4 details correct. ${score === 4 ? 'Excellent — you captured every key detail.' : 'Listen again with the four targets in mind.'}`;
  updateScores();
}

function bindMeetingTimer() {
  document.getElementById('startMeetingTimer')?.addEventListener('click', () => {
    if (state.meetingInterval) { clearInterval(state.meetingInterval); state.meetingInterval = null; }
    state.meetingSeconds = 60;
    updateMeetingTimer();
    state.meetingInterval = setInterval(() => {
      state.meetingSeconds -= 1;
      updateMeetingTimer();
      if (state.meetingSeconds <= 0) {
        clearInterval(state.meetingInterval); state.meetingInterval = null; showToast('60 seconds — mission complete.');
      }
    }, 1000);
  });
}

function updateMeetingTimer() {
  const el = document.getElementById('meetingTimer');
  if (!el) return;
  el.textContent = `00:${String(Math.max(0,state.meetingSeconds)).padStart(2,'0')}`;
}

function updateScores() {
  setScore('scoreGrammar', state.grammarCorrect.size, 9);
  setScore('scoreTrend', state.trendCorrect.size, 4);
  setScore('scoreListening', state.listeningScore, 4);
  setScore('scoreNumbers', state.numberCorrect.size, 3);
  autoStatus('Grammar', state.grammarCorrect.size, 9);
  autoStatus('Vocabulary', state.trendCorrect.size, 4);
  autoStatus('Listening', state.listeningScore, 4);
  autoStatus('Numbers', state.numberCorrect.size, 3);
}

function setScore(id, score, total) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = `${score} / ${total}`;
  el.classList.remove('good','mid');
  if (score === total) el.classList.add('good');
  else if (score > 0) el.classList.add('mid');
}

function autoStatus(skill, score, total) {
  const select = document.querySelector(`.status-select[data-skill="${skill}"]`);
  if (!select || select.dataset.manual === 'true') return;
  if (score === 0) select.value = 'Non commencé';
  else if (score / total >= .8) select.value = 'Acquis';
  else select.value = 'En cours';
}

function bindBilan() {
  document.querySelectorAll('.status-select').forEach(s => s.addEventListener('change', () => { s.dataset.manual = 'true'; }));
  const slider = document.getElementById('confidenceSlider');
  slider?.addEventListener('input', () => { document.getElementById('confidenceValue').textContent = `${slider.value} / 10`; });
  document.getElementById('copyBilan')?.addEventListener('click', () => copyText(buildBilanText(), 'Bilan copié.'));
  document.getElementById('downloadBilanHtml')?.addEventListener('click', downloadBilanHtml);
  document.getElementById('printBilanPdf')?.addEventListener('click', printBilanPdf);
}

function collectStatuses() {
  return [...document.querySelectorAll('.status-select')].map(s => ({ skill: s.dataset.skill, status: s.value }));
}

function buildBilanData() {
  return {
    date: document.getElementById('dateStamp')?.textContent || '',
    grammar: `${state.grammarCorrect.size} / 9`,
    trend: `${state.trendCorrect.size} / 4`,
    listening: `${state.listeningScore} / 4`,
    numbers: `${state.numberCorrect.size} / 3`,
    statuses: collectStatuses(),
    strengths: document.getElementById('strengthsInput')?.value.trim() || 'Non renseigné',
    focus: document.getElementById('focusInput')?.value.trim() || 'Non renseigné',
    next: document.getElementById('nextLessonInput')?.value.trim() || 'Non renseigné',
    confidence: document.getElementById('confidenceSlider')?.value || '5'
  };
}

function buildBilanText() {
  const d = buildBilanData();
  return `BILAN DE PROGRESSION — THOMAS BECCARDI — LEÇON 2\n${d.date}\n\nOBJECTIF DE LA SÉANCE\nPasser naturellement de la conversation quotidienne à des mises à jour professionnelles claires, présenter des tendances et gérer des questions de suivi.\n\nRÉSULTATS AUTOMATIQUES\nGrammaire / time frames + keywords : ${d.grammar}\nVocabulaire des tendances + banque professionnelle : ${d.trend}\nCompréhension orale précise : ${d.listening}\nDiscrimination des nombres : ${d.numbers}\n\nSTATUTS\n${d.statuses.map(x => `${x.skill} : ${x.status}`).join('\n')}\n\nPOINTS FORTS\n${d.strengths}\n\nAXES À RENFORCER\n${d.focus}\n\nPRIORITÉ DU PROCHAIN COURS\n${d.next}\n\nCONFIANCE EN FIN DE SÉANCE\n${d.confidence} / 10\n\nCFL Welcome — Formation personnalisée · Communication réelle · Progression visible`;
}

function standaloneBilanHtml() {
  const d = buildBilanData();
  const statusRows = d.statuses.map(x => `<tr><td>${escapeHtml(x.skill)}</td><td>${escapeHtml(x.status)}</td></tr>`).join('');
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bilan Thomas Beccardi — Leçon 2</title><style>
  :root{--gold:#f2b822;--ink:#222;--muted:#6a665f;--line:#e9e2d5}*{box-sizing:border-box}body{margin:0;background:#fffaf0;color:var(--ink);font-family:Arial,sans-serif;line-height:1.5}.page{width:min(100% - 32px,960px);margin:32px auto;background:white;border:1px solid var(--line);border-radius:22px;overflow:hidden;box-shadow:0 18px 50px rgba(31,25,12,.10)}header{padding:30px 34px;background:#111;color:white;border-bottom:6px solid var(--gold)}header small{color:#d8d0c2;text-transform:uppercase;letter-spacing:.12em;font-weight:700}h1{margin:8px 0 4px;font-family:Georgia,serif;font-size:34px}header p{margin:0;color:#ddd}.section{padding:26px 34px;border-bottom:1px solid var(--line)}h2{margin:0 0 14px;font-family:Georgia,serif;font-size:22px}.scores{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.score{padding:15px;border-radius:14px;background:#fff6d3;border:1px solid #ead17c}.score strong{display:block;font-size:21px}.score small{color:var(--muted)}table{width:100%;border-collapse:collapse}td{padding:9px 8px;border-bottom:1px solid var(--line)}td:last-child{font-weight:700}.note{padding:15px;border-radius:12px;background:#faf7f1;white-space:pre-wrap}.confidence{display:inline-block;padding:8px 13px;border-radius:999px;background:var(--gold);font-weight:900}footer{padding:18px 34px;background:#111;color:#ddd;font-size:12px}@media print{body{background:white}.page{width:100%;margin:0;border:0;border-radius:0;box-shadow:none}}@media(max-width:700px){.scores{grid-template-columns:1fr 1fr}}
  </style></head><body><article class="page"><header><small>CFL Welcome · Lesson 2 Progress Report</small><h1>Thomas Beccardi</h1><p>${escapeHtml(d.date)}</p></header><section class="section"><h2>Objectif de la séance</h2><p>Passer naturellement de la conversation quotidienne à des mises à jour professionnelles claires, présenter des tendances et gérer des questions de suivi.</p></section><section class="section"><h2>Résultats automatiques</h2><div class="scores"><div class="score"><small>Grammar + keywords</small><strong>${d.grammar}</strong></div><div class="score"><small>Trend vocabulary + professional bank</small><strong>${d.trend}</strong></div><div class="score"><small>Listening</small><strong>${d.listening}</strong></div><div class="score"><small>Numbers</small><strong>${d.numbers}</strong></div></div></section><section class="section"><h2>Évaluation des compétences</h2><table>${statusRows}</table></section><section class="section"><h2>Points forts</h2><div class="note">${escapeHtml(d.strengths)}</div><h2 style="margin-top:20px">Axes à renforcer</h2><div class="note">${escapeHtml(d.focus)}</div><h2 style="margin-top:20px">Priorité du prochain cours</h2><div class="note">${escapeHtml(d.next)}</div></section><section class="section"><h2>Confiance en fin de séance</h2><span class="confidence">${escapeHtml(d.confidence)} / 10</span></section><footer>Formation personnalisée · Communication réelle · Progression visible</footer></article></body></html>`;
}

function downloadBilanHtml() {
  downloadBlob('bilan-thomas-beccardi-lecon-2.html', standaloneBilanHtml(), 'text/html;charset=utf-8');
  setBilanStatus('Bilan HTML téléchargé.');
}

function printBilanPdf() {
  const win = window.open('', '_blank');
  if (!win) { setBilanStatus('La fenêtre PDF a été bloquée par le navigateur. Autorisez les pop-ups puis réessayez.'); return; }
  win.document.open();
  win.document.write(standaloneBilanHtml());
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 350);
  setBilanStatus('Version PDF prête : choisissez « Enregistrer au format PDF » dans la fenêtre d’impression.');
}

function setBilanStatus(message) {
  const el = document.getElementById('bilanStatus');
  if (el) el.textContent = message;
  showToast(message);
}

function bindSaveReset() {
  document.getElementById('saveSession')?.addEventListener('click', saveSession);
  document.getElementById('resetSession')?.addEventListener('click', () => {
    if (!confirm('Réinitialiser la Leçon 2 ?')) return;
    localStorage.removeItem('cflBeccardiLesson2');
    location.reload();
  });
}

function saveSession() {
  const fields = {};
  document.querySelectorAll('input[type="text"],textarea').forEach(el => fields[el.id] = el.value);
  const data = {
    fields,
    confidence: document.getElementById('confidenceSlider')?.value,
    statuses: collectStatuses(),
    grammar: [...state.grammarCorrect], trend: [...state.trendCorrect], number: [...state.numberCorrect], listening: state.listeningScore
  };
  try { localStorage.setItem('cflBeccardiLesson2', JSON.stringify(data)); setBilanStatus('Séance enregistrée dans ce navigateur.'); }
  catch(e) { setBilanStatus('Enregistrement local indisponible dans ce mode de navigation.'); }
}

function restoreSession() {
  try {
    const raw = localStorage.getItem('cflBeccardiLesson2');
    if (!raw) return;
    const data = JSON.parse(raw);
    Object.entries(data.fields || {}).forEach(([id,value]) => { const el = document.getElementById(id); if (el) el.value = value; });
    if (data.confidence) { document.getElementById('confidenceSlider').value = data.confidence; document.getElementById('confidenceValue').textContent = `${data.confidence} / 10`; }
    (data.statuses || []).forEach(item => { const sel = document.querySelector(`.status-select[data-skill="${item.skill}"]`); if (sel) { sel.value = item.status; sel.dataset.manual='true'; } });
    state.grammarCorrect = new Set(data.grammar || []); state.trendCorrect = new Set(data.trend || []); state.numberCorrect = new Set(data.number || []); state.listeningScore = Number(data.listening || 0);
    updateScores();
  } catch(e) {}
}

function setDateStamp() {
  const el = document.getElementById('dateStamp');
  if (el) el.textContent = new Intl.DateTimeFormat('fr-FR', { dateStyle:'long' }).format(new Date());
}

function copyText(text, message) {
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => showToast(message)).catch(() => fallbackCopy(text,message));
  else fallbackCopy(text,message);
}

function fallbackCopy(text, message) {
  const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); showToast(message);
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 500);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove('show'), 2200);
}
