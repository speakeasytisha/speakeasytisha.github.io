const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const STORAGE_KEY = 'eden_lesson_9_wow_v1';
let voices = [];
let currentRecorder = null;
let recorderChunks = [];
let recorderTarget = null;
let genericTimer = null;
let finalTimer = null;
let finalRemaining = 360;
const vocab = [
  {cat:"respect",term:"I want to use your experience here.",fr:"Je veux m’appuyer sur votre expérience ici.",def:"Signals respect for expertise before redirecting or challenging.",ex:"I want to use your experience here. What specifically failed last time?"},
  {cat:"respect",term:"That context is useful.",fr:"Ce contexte est utile.",def:"Acknowledges background without committing to a long discussion.",ex:"That context is useful. For now, can we isolate the current decision?"},
  {cat:"respect",term:"I see why that matters.",fr:"Je vois pourquoi c’est important.",def:"Validates the relevance of a concern without automatically agreeing.",ex:"I see why that matters. Which risk is the most critical today?"},
  {cat:"narrow",term:"Can we separate X from Y?",fr:"Pouvons-nous séparer X de Y ?",def:"Creates a boundary between background and the immediate operational question.",ex:"Can we separate the history from what I need to take over now?"},
  {cat:"narrow",term:"For today, I need to focus on…",fr:"Pour aujourd’hui, je dois me concentrer sur…",def:"Narrows the scope using a practical time frame.",ex:"For today, I need to focus on the current validation process."},
  {cat:"narrow",term:"Before we move on…",fr:"Avant de passer à la suite…",def:"Returns to an unanswered point.",ex:"Before we move on, I need to close one point: who owns the final approval?"},
  {cat:"evidence",term:"What specifically led to that conclusion?",fr:"Qu’est-ce qui vous a précisément conduit à cette conclusion ?",def:"Moves a strong opinion toward reasoning and evidence.",ex:"What specifically led to that conclusion?"},
  {cat:"evidence",term:"Which constraint still applies today?",fr:"Quelle contrainte s’applique encore aujourd’hui ?",def:"Tests whether past experience remains relevant in the current situation.",ex:"Which of those constraints still applies today?"},
  {cat:"evidence",term:"What would change your view?",fr:"Qu’est-ce qui vous ferait changer d’avis ?",def:"Clarifies the evidence threshold behind a position.",ex:"What evidence would change your view?"},
  {cat:"boundary",term:"I’m comfortable with disagreement; I’m not comfortable with…",fr:"Le désaccord me convient ; ce qui ne me convient pas, c’est…",def:"Separates legitimate debate from unacceptable behaviour.",ex:"I’m comfortable with disagreement; I’m not comfortable with dismissing a colleague."},
  {cat:"boundary",term:"I’m going to pause you there.",fr:"Je vais vous arrêter un instant.",def:"A controlled interruption used to protect the purpose of the meeting.",ex:"I’m going to pause you there so we can protect the decision time."},
  {cat:"boundary",term:"Keep the challenge on the technical point.",fr:"Restez sur le point technique.",def:"Redirects a personal exchange back to the work.",ex:"Keep the challenge on the technical point and explain the evidence."},
  {cat:"close",term:"So the decision is…",fr:"Donc la décision est…",def:"Makes the conclusion explicit.",ex:"So the decision is to run the additional test before release."},
  {cat:"close",term:"You own X; I’ll own Y.",fr:"Vous prenez X ; je prends Y.",def:"Makes responsibility explicit.",ex:"You own the technical review; I’ll own the customer communication."},
  {cat:"close",term:"We’ll review this on…",fr:"Nous ferons le point le…",def:"Creates a follow-up point.",ex:"We’ll review this on Thursday after the test results."}
];
const rapid = [
  {p:"Your boss says, “You should already know this if you’re taking over the role.”",hint:"STATUS → NEED → RISK → NEXT STEP",m:"That responsibility has not transferred to me yet. Before I take it over, I need the current reference and the open risks so I can move independently without relying on assumptions."},
  {p:"A senior engineer says, “We tried that years ago. It doesn’t work.”",hint:"RESPECT EXPERIENCE → ASK WHAT FAILED → TEST WHETHER THE CONDITIONS STILL APPLY",m:"I want to use that experience. What specifically failed last time, and which of those conditions are still true today?"},
  {p:"Your boss begins another long historical explanation.",hint:"VALUE → BOUNDARY → PRECISE QUESTION",m:"That context is useful. For the handover today, I need to isolate the current process. Which document is now the reference version?"},
  {p:"A senior expert says, “You don’t have enough technical experience to make that decision.”",hint:"DO NOT DEFEND YOUR CV → VALIDATE TECHNICAL INPUT → DEFINE YOUR MANAGEMENT ROLE → ASK FOR CRITERIA",m:"I agree that the technical input needs to come from the strongest expertise in the room. My role is to make sure the evidence and risks are explicit so we can decide. What criteria should drive that decision?"},
  {p:"The new colleague says, “I’m not wasting time explaining something obvious.”",hint:"BOUNDARY → RETURN TO TECHNICAL POINT → PROTECT THE OTHER VOICE",m:"I’m comfortable with strong disagreement; I’m not comfortable with dismissing a colleague. Explain the technical point and the evidence, then we’ll hear the other view before we decide."},
  {p:"Two experts keep reopening a decision that was already made.",hint:"ACKNOWLEDGE → STATE DECISION STATUS → DEFINE WHAT WOULD JUSTIFY REOPENING",m:"I’ve heard both positions, and the decision remains X. We’ll reopen it only if new evidence changes the risk assessment."}
];
const classifications = [
  {text:"“I disagree with that calculation. The assumptions are wrong.”",type:"debate",why:"This is a direct challenge to the work. Ask for the assumptions and evidence before treating it as a behaviour problem."},
  {text:"“You clearly don’t understand this system.”",type:"behaviour",why:"This moves from challenging the idea to judging the person. Set a behavioural boundary and redirect to the technical point."},
  {text:"“Show me the data behind that conclusion.”",type:"debate",why:"This is probing and evidence-focused. It can feel direct, but it is still professional debate."},
  {text:"“I’m not explaining this to him again. He never understands.”",type:"behaviour",why:"This dismisses a colleague rather than challenging a technical argument. Address the behaviour."}
];
const objectives = [
  ["culture","Distinguishes cultural communication tendencies from individual behaviour"],
  ["boss","Redirects long explanations while preserving respect"],
  ["gap","Names a knowledge-transfer gap without apologising or blaming"],
  ["transition","Structures ownership and handover with the current role-holder"],
  ["experts","Uses evidence and decision criteria with highly experienced experts"],
  ["feedback","Gives behaviour-based feedback with a clear expectation"],
  ["new","Sets a fair but explicit frame with a new colleague"],
  ["close","Closes difficult discussions with ownership and a review point"]
];
function populateVoices(){
  if(!('speechSynthesis' in window)) return;
  voices = speechSynthesis.getVoices();
  const accent = $('#accentSelect')?.value || 'en-GB';
  const select = $('#voiceSelect');
  if(!select) return;
  let list = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(accent.toLowerCase()));
  if(!list.length) list = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  select.innerHTML = '';
  list.forEach(v => {
    const o = document.createElement('option');
    o.value = v.name;
    o.textContent = `${v.name} (${v.lang})`;
    select.appendChild(o);
  });
  if(!list.length) select.innerHTML = '<option>Default system voice</option>';
}
function speakText(text){
  if(!('speechSynthesis' in window)) return alert('Speech synthesis is not available in this browser.');
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = $('#accentSelect')?.value || 'en-GB';
  const selected = $('#voiceSelect')?.value;
  const match = voices.find(v => v.name === selected);
  if(match) u.voice = match;
  u.rate = 0.92;
  speechSynthesis.speak(u);
}
function getText(id){
  const el = document.getElementById(id);
  return el ? (el.value || el.textContent || '').trim() : '';
}
function downloadText(filename,text){
  const blob = new Blob([text],{type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),500);
}
async function copyText(text){
  try{await navigator.clipboard.writeText(text); alert('Copied.');}
  catch(e){alert('Copy is not available in this browser.');}
}
function startGenericTimer(seconds){
  clearInterval(genericTimer);
  let left = seconds;
  const box = $('#floatingTimer'), txt = $('#floatingTimerText');
  box.classList.remove('hidden');
  const tick = () => {
    const m = String(Math.floor(left/60)).padStart(2,'0');
    const s = String(left%60).padStart(2,'0');
    txt.textContent = `${m}:${s}`;
    if(left <= 0){
      clearInterval(genericTimer);
      txt.textContent = 'TIME';
      try{
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.connect(ctx.destination);
        osc.frequency.value = 660;
        osc.start();
        osc.stop(ctx.currentTime + .18);
      }catch(e){}
      return;
    }
    left--;
  };
  tick();
  genericTimer = setInterval(tick,1000);
}
function stopGenericTimer(){ clearInterval(genericTimer); $('#floatingTimer').classList.add('hidden'); }
async function startRecording(target){
  if(!navigator.mediaDevices?.getUserMedia) return alert('Audio recording is not supported in this browser.');
  try{
    if(currentRecorder && currentRecorder.state === 'recording') currentRecorder.stop();
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    recorderChunks = [];
    recorderTarget = target;
    currentRecorder = new MediaRecorder(stream);
    currentRecorder.ondataavailable = e => { if(e.data.size) recorderChunks.push(e.data); };
    currentRecorder.onstop = () => {
      const blob = new Blob(recorderChunks,{type:currentRecorder.mimeType || 'audio/webm'});
      const audio = $(`#audio-${recorderTarget}`);
      if(audio) audio.src = URL.createObjectURL(blob);
      stream.getTracks().forEach(t => t.stop());
    };
    currentRecorder.start();
  }catch(e){ alert('Microphone permission is required to record.'); }
}
function stopRecording(){ if(currentRecorder && currentRecorder.state === 'recording') currentRecorder.stop(); }
function quizMessage(id, good){
  const messages = {
    culture1: good ? "Exactly. First interpret the challenge as a test of the idea, then ask for the reasoning or evidence." : "Try again. In a debate-oriented technical culture, a strong challenge does not automatically mean a personal attack.",
    boss1: good ? "Strong. You value the context, give the reason for narrowing, and ask a precise operational question." : "Try again. The strongest response protects expertise while still controlling the scope.",
    handover2: good ? "Strong. The sentence states the transition fact and the information need without apology or blame." : "Try again. Avoid apologising for an information gap or accusing the other person. Describe the operational reality."
  };
  return messages[id] || '';
}
function initQuizzes(){
  $$('[data-quiz]').forEach(box => {
    box.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if(!btn) return;
      box.querySelectorAll('button').forEach(b => b.classList.remove('correct','wrong'));
      const good = btn.dataset.value === 'b';
      btn.classList.add(good ? 'correct' : 'wrong');
      const fb = $(`#feedback-${box.dataset.quiz}`);
      fb.textContent = quizMessage(box.dataset.quiz, good);
      fb.style.color = good ? 'var(--green)' : 'var(--red)';
    });
  });
}
function joinValues(ids){ return ids.map(getText).filter(Boolean).join(' '); }
function bindBuilders(){
  $('#buildBoss').onclick = () => $('#bossOutput').textContent = joinValues(['bossValue','bossBoundary','bossQuestion']);
  $('#speakBoss').onclick = () => { $('#buildBoss').click(); speakText(getText('bossOutput')); };
  $('#buildFeedback').onclick = () => $('#feedbackOutput').textContent = joinValues(['fbObs','fbImpact','fbExpect','fbCheck']);
  $('#speakFeedback').onclick = () => { $('#buildFeedback').click(); speakText(getText('feedbackOutput')); };
  $('#buildNew').onclick = () => $('#newOutput').textContent = joinValues(['new1','new2','new3','new4']);
  $('#speakNew').onclick = () => { $('#buildNew').click(); speakText(getText('newOutput')); };
  $('#buildBoss').click();
  $('#buildNew').click();
}
function renderClassifications(){
  const grid = $('#classificationGrid');
  grid.innerHTML = '';
  classifications.forEach((item,i) => {
    const row = document.createElement('div');
    row.className = 'classification-row';
    row.innerHTML = `<p><strong>${i+1}.</strong> ${item.text}</p><button data-answer="debate">Professional debate</button><button data-answer="behaviour">Behaviour problem</button><div class="classification-feedback"></div>`;
    const fb = row.querySelector('.classification-feedback');
    row.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => {
        row.querySelectorAll('button').forEach(b => b.classList.remove('correct','wrong'));
        const good = btn.dataset.answer === item.type;
        btn.classList.add(good ? 'correct' : 'wrong');
        fb.textContent = (good ? 'Correct. ' : 'Try again. ') + item.why;
        fb.style.color = good ? 'var(--green)' : 'var(--red)';
      };
    });
    grid.appendChild(row);
  });
}
function renderVocab(){
  const cat = $('#vocabFilter').value;
  const grid = $('#vocabGrid');
  grid.innerHTML = '';
  vocab.filter(v => cat === 'all' || v.cat === cat).forEach(v => {
    const card = document.createElement('article');
    card.className = 'vocab-card';
    card.innerHTML = `<div class="vocab-top"><div><span class="vocab-cat">${v.cat}</span><h3>${v.term}</h3></div><button type="button">🔊</button></div><p class="translation"><strong>FR:</strong> ${v.fr}</p><p class="definition">${v.def}</p><p class="example">“${v.ex}”</p>`;
    card.querySelector('button').onclick = () => speakText(`${v.term}. ${v.def}. Example: ${v.ex}`);
    grid.appendChild(card);
  });
}
function initRapid(){
  let current = 0;
  const setPrompt = () => {
    current = Math.floor(Math.random() * rapid.length);
    $('#rapidPrompt').textContent = rapid[current].p;
    $('#rapidHint').textContent = rapid[current].hint;
    $('#rapidModel').textContent = rapid[current].m;
    $('#rapidHint').classList.add('hidden');
    $('#rapidModel').classList.add('hidden');
  };
  $('#newRapid').onclick = setPrompt;
  $('#rapidHintBtn').onclick = () => $('#rapidHint').classList.toggle('hidden');
  $('#rapidModelBtn').onclick = () => $('#rapidModel').classList.toggle('hidden');
  setPrompt();
}
function drawFinal(){
  const m = String(Math.floor(finalRemaining/60)).padStart(2,'0');
  const s = String(finalRemaining%60).padStart(2,'0');
  $('#timerDisplay').textContent = `${m}:${s}`;
}
function startFinal(){
  if(finalTimer) return;
  finalTimer = setInterval(() => {
    finalRemaining--;
    drawFinal();
    if(finalRemaining <= 0){ clearInterval(finalTimer); finalTimer = null; $('#timerDisplay').textContent = 'MISSION COMPLETE'; }
  },1000);
}
function pauseFinal(){ clearInterval(finalTimer); finalTimer = null; }
function resetFinal(){ pauseFinal(); finalRemaining = 360; drawFinal(); }
function renderObjectives(){
  const grid = $('#objectiveGrid');
  grid.innerHTML = '';
  objectives.forEach(([id,label]) => {
    const row = document.createElement('label');
    row.className = 'field-card';
    row.innerHTML = `<span>${label}</span><select data-manual="${id}"><option value="not-started">Not started</option><option value="progress">In progress</option><option value="achieved">Achieved</option><option value="not-achieved">Not achieved</option></select>`;
    grid.appendChild(row);
  });
}
function statusLabel(s){ return {'achieved':'Achieved','progress':'In progress','not-achieved':'Not achieved','not-started':'Not started'}[s] || s; }
function collectProgress(){
  const statuses = {};
  $$('[data-manual]').forEach(s => statuses[s.dataset.manual] = s.value);
  return { learner: $('#learnerName').value, trainer: $('#trainerName').value, date: $('#evaluationDate').value, comments: $('#trainerComments').value, statuses, lastSaved: new Date().toISOString() };
}
function updateOverall(){
  const statuses = $$('[data-manual]').map(s => s.value);
  const started = statuses.filter(s => s !== 'not-started').length;
  $('#completionRate').textContent = (Math.round(started/statuses.length*100) || 0) + '%';
  let overall = 'not-started';
  if(started > 0){ overall = statuses.every(s => s === 'achieved') ? 'achieved' : statuses.some(s => s === 'not-achieved') ? 'not-achieved' : 'progress'; }
  const el = $('#overallStatus');
  el.textContent = statusLabel(overall);
  el.className = 'status ' + overall;
}
function saveProgress(show=false){
  const p = collectProgress();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  $('#lastSaved').textContent = new Date(p.lastSaved).toLocaleString();
  updateOverall();
  if(show) alert('Progress saved.');
}
function loadProgress(){
  try{
    const p = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); if(!p) return;
    $('#learnerName').value = p.learner || 'Eden Cohen';
    $('#trainerName').value = p.trainer || 'Tisha DOUTY-DOSIERE';
    $('#evaluationDate').value = p.date || new Date().toISOString().slice(0,10);
    $('#trainerComments').value = p.comments || '';
    Object.entries(p.statuses || {}).forEach(([k,v]) => { const s = document.querySelector(`[data-manual="${k}"]`); if(s) s.value = v; });
    if(p.lastSaved) $('#lastSaved').textContent = new Date(p.lastSaved).toLocaleString();
  }catch(e){}
}
function reportText(){
  const p = collectProgress();
  const lines = ['Eden — Lesson 9 — Guided Communication',`Learner: ${p.learner}`,`Trainer: ${p.trainer}`,`Date: ${p.date}`,`Completion: ${$('#completionRate').textContent}`,`Overall result: ${$('#overallStatus').textContent}`,'','Objectives:'];
  objectives.forEach(([id,label]) => lines.push(`- ${label}: ${statusLabel(p.statuses[id] || 'not-started')}`));
  lines.push('', 'Trainer observations:', p.comments || '—', '', 'Self-assessment:');
  $$('[data-score]').forEach(r => lines.push(`- ${r.dataset.score}: ${r.value}/5`));
  return lines.join('\n');
}
function initProgress(){
  renderObjectives();
  $('#evaluationDate').value = new Date().toISOString().slice(0,10);
  loadProgress(); updateOverall();
  $$('[data-manual],#learnerName,#trainerName,#evaluationDate,#trainerComments').forEach(el => {
    el.addEventListener('input',()=>saveProgress(false));
    el.addEventListener('change',()=>saveProgress(false));
  });
  $('#saveProgress').onclick = () => saveProgress(true);
  $('#copyReport').onclick = () => { const r = reportText(); $('#reportPreview').textContent = r; copyText(r); };
  $('#downloadReport').onclick = () => downloadText('Eden_Lesson_9_Communication_Progress.txt', reportText());
  $('#resetProgress').onclick = () => { if(confirm('Reset saved progress for this lesson?')){ localStorage.removeItem(STORAGE_KEY); location.reload(); } };
}
function takeawayText(){
  return `EDEN — MANAGEMENT COMMUNICATION CARD\n\n1. Do not confuse direct debate with personal conflict. First test the reasoning.\n2. Respect expertise and hierarchy without becoming passive.\n3. When an explanation is too broad, value the context before narrowing the question.\n4. A knowledge-transfer gap should be described as an operational risk, not a personal failure.\n5. Manage difficult people through observable behaviour, explicit expectations and regular feedback.\n6. Your role is not to know everything. Your role is to make expertise, risk, ownership and decisions clear.\n\nCORE SYSTEM:\nFRAME → FOCUS → EVIDENCE → CLOSE`;
}
function surveyText(){
  return ['Eden — Lesson 9 feedback',`French workplace communication lens: ${$('#surveyCulture').value}`,`Boss / handover strategy: ${$('#surveyBoss').value}`,`Expert-team strategy: ${$('#surveyExperts').value}`,`New colleague / feedback: ${$('#surveyNew').value}`,'','What should we practise again?',$('#surveyComments').value || '—'].join('\n');
}
function bindCommon(){
  document.addEventListener('click', e => {
    const scroll = e.target.closest('[data-scroll]'); if(scroll){ $(scroll.dataset.scroll)?.scrollIntoView({behavior:'smooth'}); return; }
    const toggle = e.target.closest('[data-toggle]'); if(toggle){ $(toggle.dataset.toggle)?.classList.toggle('hidden'); return; }
    const speak = e.target.closest('[data-speak-id]'); if(speak){ speakText(getText(speak.dataset.speakId)); return; }
    const timer = e.target.closest('.timer-btn'); if(timer){ startGenericTimer(Number(timer.dataset.seconds)); return; }
    const rec = e.target.closest('[data-record]'); if(rec){ startRecording(rec.dataset.record); return; }
    const stop = e.target.closest('[data-stop-record]'); if(stop){ stopRecording(); return; }
  });
  $('#audioTest').onclick = () => speakText('Audio test. If you can hear this sentence, the listening controls are working.');
  $('#refreshVoices').onclick = populateVoices;
  $('#accentSelect').onchange = populateVoices;
  $('#toggleFrench').onclick = () => { document.body.classList.toggle('all-french'); $('#toggleFrench').textContent = document.body.classList.contains('all-french') ? '🇫🇷 Hide French support' : '🇫🇷 Show French support'; };
  $('#toggleModels').onclick = () => { document.body.classList.toggle('all-models'); $('#toggleModels').textContent = document.body.classList.contains('all-models') ? 'Hide all models' : '👁 Show all models'; };
  $('#stopAudio').onclick = () => window.speechSynthesis?.cancel();
  $('#printPage').onclick = () => window.print();
  $('#vocabFilter').onchange = renderVocab;
  $('#floatingStop').onclick = stopGenericTimer;
  $('#startFinal').onclick = startFinal;
  $('#pauseFinal').onclick = pauseFinal;
  $('#resetFinal').onclick = resetFinal;
  $('#downloadTakeaway').onclick = () => downloadText('Eden_Management_Communication_Card.txt', takeawayText());
  $('#downloadSurvey').onclick = () => downloadText('Eden_Lesson_9_Feedback.txt', surveyText());
  $('#copySurvey').onclick = () => copyText(surveyText());
  $$('[data-score]').forEach(r => r.oninput = () => r.nextElementSibling.textContent = r.value);
}
function init(){
  if('speechSynthesis' in window){ populateVoices(); window.speechSynthesis.onvoiceschanged = populateVoices; setTimeout(populateVoices, 700); }
  initQuizzes(); bindBuilders(); renderClassifications(); renderVocab(); initRapid(); initProgress(); bindCommon(); drawFinal();
}
document.addEventListener('DOMContentLoaded', init);