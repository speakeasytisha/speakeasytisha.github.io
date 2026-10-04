(() => {
  const STORAGE_KEY = 'mireille_gallery_lesson3_fields_v1';
  const TRACKING_KEY = 'mireille_gallery_lesson3_tracking_v1';
  const sections = [...document.querySelectorAll('.lesson-section')];
  const navItems = [...document.querySelectorAll('.nav-item')];
  const title = document.getElementById('sectionTitle');
  const progressBar = document.getElementById('progressBar');
  const progressLabel = document.getElementById('progressLabel');
  const progressPercent = document.getElementById('progressPercent');
  const footerProgress = document.getElementById('footerProgress');
  const prevBtn = document.getElementById('prevSection');
  const nextBtn = document.getElementById('nextSection');
  const saveStatus = document.getElementById('saveStatus');
  const trackables = [...document.querySelectorAll('.trackable')];
  let current = 0;
  let trainerMode = false;
  let fieldState = {};
  let tracking = { exercises: {}, tasks: {} };

  function visibleSections() {
    return sections.filter(sec => trainerMode || !sec.classList.contains('trainer-section'));
  }

  function showSection(index) {
    const available = visibleSections();
    index = Math.max(0, Math.min(index, available.length - 1));
    const target = available[index];
    sections.forEach(s => s.classList.remove('active'));
    target.classList.add('active');
    current = index;
    navItems.forEach(n => n.classList.toggle('active', Number(n.dataset.section) === Number(target.dataset.index)));
    title.textContent = target.dataset.title;
    const pct = Math.round(((index + 1) / available.length) * 100);
    progressBar.style.width = `${pct}%`;
    progressLabel.textContent = `${index + 1} / ${available.length}`;
    progressPercent.textContent = `${pct}%`;
    footerProgress.textContent = `Section ${index + 1} of ${available.length}`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === available.length - 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateMetrics();
  }

  navItems.forEach(item => item.addEventListener('click', () => {
    const sectionIndex = Number(item.dataset.section);
    const available = visibleSections();
    const targetIndex = available.findIndex(sec => Number(sec.dataset.index) === sectionIndex);
    if (targetIndex >= 0) showSection(targetIndex);
  }));
  prevBtn.addEventListener('click', () => showSection(current - 1));
  nextBtn.addEventListener('click', () => showSection(current + 1));

  document.getElementById('frToggle').addEventListener('click', e => {
    document.body.classList.toggle('show-fr');
    const on = document.body.classList.contains('show-fr');
    e.currentTarget.setAttribute('aria-pressed', String(on));
    e.currentTarget.textContent = `FR help: ${on ? 'ON' : 'OFF'}`;
  });

  document.getElementById('trainerToggle').addEventListener('click', e => {
    trainerMode = !trainerMode;
    document.body.classList.toggle('trainer-mode', trainerMode);
    e.currentTarget.setAttribute('aria-pressed', String(trainerMode));
    e.currentTarget.textContent = `Trainer view: ${trainerMode ? 'ON' : 'OFF'}`;
    const activeTrainer = sections.find(s => s.classList.contains('active') && s.classList.contains('trainer-section'));
    if (!trainerMode && activeTrainer) showSection(0);
    else showSection(Math.min(current, visibleSections().length - 1));
  });

  function storageId(el) {
    if (el.id) return `id:${el.id}`;
    if (el.name) return `name:${el.name}:${el.value}`;
    const all = [...document.querySelectorAll('[data-save]')];
    return `idx:${all.indexOf(el)}`;
  }

  function saveFields() {
    fieldState = {};
    document.querySelectorAll('[data-save]').forEach(el => {
      const key = storageId(el);
      fieldState[key] = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fieldState));
    saveStatus.textContent = '● Saved';
    setTimeout(() => { saveStatus.textContent = '● Autosave ready'; }, 900);
    calculateRemaining();
    updateMetrics();
  }

  function loadFields() {
    try { fieldState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { fieldState = {}; }
    document.querySelectorAll('[data-save]').forEach(el => {
      const key = storageId(el);
      if (!(key in fieldState)) return;
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = Boolean(fieldState[key]);
      else el.value = fieldState[key];
    });
  }

  function saveTracking() {
    localStorage.setItem(TRACKING_KEY, JSON.stringify(tracking));
    updateMetrics();
  }

  function loadTracking() {
    try { tracking = JSON.parse(localStorage.getItem(TRACKING_KEY) || '{"exercises":{},"tasks":{}}'); }
    catch { tracking = { exercises: {}, tasks: {} }; }
    if (!tracking.exercises) tracking.exercises = {};
    if (!tracking.tasks) tracking.tasks = {};
    trackables.forEach((el, i) => {
      const saved = tracking.exercises[String(i)];
      if (!saved || !saved.checked) return;
      const fb = el.querySelector('.feedback');
      if (fb) {
        fb.className = `feedback ${saved.correct ? 'correct' : 'incorrect'}`;
        fb.textContent = saved.correct ? '✓ Correct.' : 'Checked — review or try again.';
      }
    });
  }

  document.addEventListener('input', e => { if (e.target.matches('[data-save]')) saveFields(); });
  document.addEventListener('change', e => { if (e.target.matches('[data-save]')) saveFields(); });

  document.getElementById('resetAll').addEventListener('click', () => {
    if (!confirm('Reset all saved lesson answers, progress data and trainer notes?')) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TRACKING_KEY);
    location.reload();
  });

  function trackKey(el) { return String(trackables.indexOf(el)); }
  function recordExercise(el, correct) {
    tracking.exercises[trackKey(el)] = { checked: true, correct: Boolean(correct) };
    saveTracking();
  }

  function normalise(s) {
    return (s || '').toLowerCase().trim().replace(/[’]/g, "'").replace(/\s+/g, ' ').replace(/[.!?]+$/,'');
  }

  document.querySelectorAll('.check-question').forEach(btn => btn.addEventListener('click', () => {
    const q = btn.closest('.quiz-question');
    const chosen = q.querySelector('input[type="radio"]:checked');
    const fb = q.querySelector('.feedback');
    if (!chosen) { fb.className='feedback incorrect'; fb.textContent='Choose an answer first.'; return; }
    const ok = chosen.value === q.dataset.correct;
    recordExercise(q, ok);
    fb.className = `feedback ${ok ? 'correct' : 'incorrect'}`;
    fb.textContent = ok ? '✓ Correct. Keep that structure.' : 'Not quite. Try again — use the hint if you need it.';
  }));

  document.querySelectorAll('.hint-question').forEach(btn => btn.addEventListener('click', () => {
    const q=btn.closest('.quiz-question'); const fb=q.querySelector('.feedback');
    fb.className='feedback hint'; fb.textContent=`Hint: ${q.dataset.hint}`;
  }));

  document.querySelectorAll('.check-select').forEach(btn => btn.addEventListener('click', () => {
    const q=btn.closest('.select-question'), chosen=q.querySelector('select').value, fb=q.querySelector('.feedback');
    if (!chosen) { fb.className='feedback incorrect'; fb.textContent='Choose an answer first.'; return; }
    const ok = chosen === q.dataset.answer;
    recordExercise(q, ok);
    fb.className=`feedback ${ok?'correct':'incorrect'}`;
    fb.textContent=ok?'✓ Correct.':'Not quite. Try again.';
  }));

  document.querySelectorAll('.hint-select').forEach(btn => btn.addEventListener('click', () => {
    const q=btn.closest('.select-question'), fb=q.querySelector('.feedback');
    fb.className='feedback hint'; fb.textContent=`Hint: ${q.dataset.hint}`;
  }));

  document.querySelectorAll('.check-repair').forEach(btn => btn.addEventListener('click', () => {
    const item=btn.closest('.repair-item'), input=item.querySelector('input'), fb=item.querySelector('.feedback');
    if (!input.value.trim()) { fb.className='feedback incorrect'; fb.textContent='Write your correction first.'; return; }
    const ok = normalise(input.value) === normalise(item.dataset.answer);
    recordExercise(item, ok);
    fb.className=`feedback ${ok?'correct':'incorrect'}`;
    fb.textContent=ok?'✓ Excellent — that is the target structure.':`Good attempt. Compare with the model: ${item.dataset.answer}`;
  }));

  document.querySelectorAll('.hint-repair').forEach(btn => btn.addEventListener('click', () => {
    const item=btn.closest('.repair-item'), fb=item.querySelector('.feedback');
    fb.className='feedback hint'; fb.textContent=`Hint: ${item.dataset.hint}`;
  }));

  function speak(text) {
    if (!('speechSynthesis' in window)) { alert('Speech playback is not supported in this browser.'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang='en-GB'; u.rate=.87; u.pitch=1;
    speechSynthesis.speak(u);
  }
  document.querySelectorAll('[data-speak]').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.speak)));

  document.querySelectorAll('.model-toggle').forEach(btn => btn.addEventListener('click', () => {
    const panel=document.getElementById(btn.dataset.target);
    panel.classList.toggle('hidden');
    btn.textContent=panel.classList.contains('hidden')?'Show models':'Hide models';
  }));

  document.getElementById('buildWelcome').addEventListener('click', () => {
    const vals=['welcomeGreeting','welcomeOffer','welcomeNeed','welcomeAnswer'].map(id=>document.getElementById(id).value.trim()).filter(Boolean);
    document.getElementById('welcomeOutput').textContent=vals.length?vals.join(' '):'Add at least one idea above to build your welcome.';
    tracking.tasks.welcome = vals.length >= 3;
    saveTracking();
  });

  document.querySelectorAll('.timer-btn').forEach(btn => btn.addEventListener('click', () => {
    let seconds=Number(btn.dataset.seconds||60);
    const wrap=btn.closest('.speaking-tools') || btn.parentElement;
    const display=wrap.querySelector('.timer-display') || btn.closest('.lilate-task')?.querySelector('.timer-display');
    if(!display) return;
    btn.disabled=true;
    const render=()=>{ const m=String(Math.floor(seconds/60)).padStart(2,'0'), s=String(seconds%60).padStart(2,'0'); display.textContent=`${m}:${s}`; };
    render();
    const interval=setInterval(()=>{ seconds--; render(); if(seconds<=0){clearInterval(interval); btn.disabled=false; display.textContent='Time!';}},1000);
  }));

  function setupRecorder(recordId, stopId, playbackId, taskKey) {
    const recordBtn=document.getElementById(recordId), stopBtn=document.getElementById(stopId), playback=document.getElementById(playbackId);
    if (!recordBtn || !stopBtn || !playback || !navigator.mediaDevices || !window.MediaRecorder) return;
    let recorder, chunks=[], stream;
    recordBtn.addEventListener('click', async () => {
      try {
        stream=await navigator.mediaDevices.getUserMedia({audio:true});
        recorder=new MediaRecorder(stream); chunks=[];
        recorder.ondataavailable=e=>chunks.push(e.data);
        recorder.onstop=()=>{
          const blob=new Blob(chunks,{type:'audio/webm'});
          playback.src=URL.createObjectURL(blob); playback.hidden=false;
          stream.getTracks().forEach(t=>t.stop());
          tracking.tasks[taskKey]=true; saveTracking();
        };
        recorder.start(); recordBtn.disabled=true; stopBtn.disabled=false;
      } catch { alert('Microphone access was not available. You can still complete the speaking task without recording.'); }
    });
    stopBtn.addEventListener('click',()=>{
      if(recorder && recorder.state!=='inactive') recorder.stop();
      recordBtn.disabled=false; stopBtn.disabled=true;
    });
  }
  setupRecorder('recordDirections','stopDirections','directionsPlayback','directionsRecording');
  setupRecorder('recordLILATE','stopLILATE','lilatePlayback','lilateRecording');

  document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    const filter=btn.dataset.filter;
    document.querySelectorAll('.vocab-card').forEach(card=>{ card.style.display=(filter==='all'||card.dataset.category===filter)?'flex':'none'; });
  }));

  function toggleTranscript(buttonId, transcriptId) {
    const btn=document.getElementById(buttonId), tr=document.getElementById(transcriptId);
    btn.addEventListener('click',()=>{
      tr.classList.toggle('hidden');
      btn.textContent=tr.classList.contains('hidden')?'Show transcript':'Hide transcript';
    });
  }
  toggleTranscript('visitorTranscriptToggle','visitorTranscript');
  toggleTranscript('lilateTranscriptToggle','lilateTranscript');

  document.getElementById('generateVisitorCard').addEventListener('click',()=>{
    const get=id=>document.getElementById(id).value.trim();
    const titleVal=get('cardTitle')||'Cultural Exhibition';
    const type=get('cardType')||'a cultural exhibition';
    const hours=get('cardHours')||'—';
    const tour=get('cardTour')||'—';
    const location=get('cardLocation')||'—';
    const feature=get('cardFeature')||'—';
    const recommendation=get('cardRecommendation')||'—';
    document.getElementById('visitorCardOutput').innerHTML=`
      <p class="mini-label">YOUR VISITOR CARD</p>
      <h3>${escapeHtml(titleVal)}</h3>
      <p>Welcome to <strong>${escapeHtml(titleVal)}</strong>. It is ${escapeHtml(type)} featuring ${escapeHtml(feature)}.</p>
      <div class="card-meta"><span><strong>Opening hours</strong><br>${escapeHtml(hours)}</span><span><strong>Guided tour</strong><br>${escapeHtml(tour)}</span><span><strong>Location</strong><br>${escapeHtml(location)}</span><span><strong>Useful phrase</strong><br>How can I help you?</span></div>
      <div class="recommendation"><strong>Recommendation:</strong> ${escapeHtml(recommendation)}</div>`;
    tracking.tasks.visitorCard=true; saveTracking();
  });

  function escapeHtml(str){ return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

  const guided=document.getElementById('guidedMode'), challenge=document.getElementById('challengeMode'), guidedHelp=document.getElementById('guidedHelp');
  guided.addEventListener('click',()=>{guided.classList.add('active');challenge.classList.remove('active');guidedHelp.classList.remove('hidden');});
  challenge.addEventListener('click',()=>{challenge.classList.add('active');guided.classList.remove('active');guidedHelp.classList.add('hidden');});

  document.querySelectorAll('.admin-tab').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.admin-tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    document.querySelectorAll('.admin-pane').forEach(p=>p.classList.toggle('active',p.dataset.adminPane===btn.dataset.adminTab));
    updateMetrics();
  }));

  function val(id){ return (document.getElementById(id)?.value || '').trim(); }
  function calculateRemaining(){
    const total=parseFloat(val('adminTotalHours'))||0, before=parseFloat(val('adminHoursBefore'))||0, duration=parseFloat(val('adminDuration'))||0;
    const remain=Math.max(0,total-before-duration);
    const el=document.getElementById('adminHoursRemaining');
    if(el) el.value=remain.toFixed(2).replace(/\.00$/,'');
  }

  function currentTaskFlags(){
    tracking.tasks.visitorWritten=(val('visitorAnswer').split(/\s+/).filter(Boolean).length>=6);
    tracking.tasks.directionsWritten=(val('directionsResponse').split(/\s+/).filter(Boolean).length>=6);
    tracking.tasks.lilateWritten=(val('lilateResponse').split(/\s+/).filter(Boolean).length>=10);
    return tracking.tasks;
  }

  function metrics(){
    currentTaskFlags();
    const results=Object.values(tracking.exercises).filter(x=>x&&x.checked);
    const checked=results.length, correct=results.filter(x=>x.correct).length;
    const accuracy=checked?Math.round((correct/checked)*100):null;
    const taskKeys=['welcome','visitorWritten','directionsWritten','visitorCard','lilateWritten'];
    const tasksDone=taskKeys.filter(k=>tracking.tasks[k]).length;
    const reflection=[...document.querySelectorAll('[data-task="reflection"]')].filter(x=>x.checked).length;
    return { checked, correct, accuracy, tasksDone, tasksTotal:taskKeys.length, reflection, totalExercises:trackables.length };
  }

  function updateMetrics(){
    calculateRemaining();
    const m=metrics();
    const checkedEl=document.getElementById('metricChecked'); if(checkedEl) checkedEl.textContent=`${m.checked}/${m.totalExercises}`;
    const correctEl=document.getElementById('metricCorrect'); if(correctEl) correctEl.textContent=String(m.correct);
    const accuracyEl=document.getElementById('metricAccuracy'); if(accuracyEl) accuracyEl.textContent=m.accuracy===null?'—':`${m.accuracy}%`;
    const tasksEl=document.getElementById('metricTasks'); if(tasksEl) tasksEl.textContent=`${m.tasksDone}/${m.tasksTotal}`;
    const reflectionEl=document.getElementById('metricReflection'); if(reflectionEl) reflectionEl.textContent=`${m.reflection}/6`;
    const summary=`Interactive exercises: ${m.checked}/${m.totalExercises} checked; ${m.correct} currently correct${m.accuracy===null?'':` (${m.accuracy}% of checked exercises)`}.\nProduction tasks: ${m.tasksDone}/${m.tasksTotal} completed.\nLearner self-check: ${m.reflection}/6 statements selected.\nFocus of session: visitor welcome, practical information, directions, clarification strategies and a short LILATE IA Part 1 transfer task.`;
    const auto=document.getElementById('adminAutoProgress'); if(auto) auto.value=summary;
    const ex=document.getElementById('progressExerciseText'); if(ex) ex.textContent=m.checked?`${m.correct} of ${m.checked} checked exercises are currently correct. ${m.totalExercises-m.checked} exercise(s) have not yet been checked.`:'No exercises checked yet.';
    const task=document.getElementById('progressTaskText'); if(task) task.textContent=`${m.tasksDone} of ${m.tasksTotal} tracked production tasks are completed (welcome builder, visitor response, directions, visitor card, LILATE response).`;
    const refl=document.getElementById('progressReflectionText'); if(refl) refl.textContent=m.reflection?`${m.reflection} of 6 confidence statements selected.`:'No self-checks selected yet.';
  }

  function formatDateFR(dateString){
    if(!dateString) return '';
    const d=new Date(`${dateString}T12:00:00`);
    return new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric'}).format(d);
  }

  async function copyText(text){
    if(!text) return false;
    try { if(navigator.clipboard && window.isSecureContext){ await navigator.clipboard.writeText(text); return true; } } catch {}
    const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.focus(); ta.select();
    let ok=false; try{ok=document.execCommand('copy');}catch{} ta.remove(); return ok;
  }

  document.getElementById('generateEmail').addEventListener('click',()=>{
    const date=formatDateFR(val('adminSessionDate')) || 'notre dernier cours';
    const link=val('adminLessonUrl') || '[AJOUTER LE LIEN ICI]';
    const body=`Bonjour Mireille,\n\nMerci encore pour notre cours du ${date}. Nous avons poursuivi votre progression en anglais à partir de situations directement liées à votre futur environnement professionnel dans la culture et le patrimoine.\n\nPendant cette séance, nous avons travaillé la manière d’accueillir naturellement un visiteur, de lui proposer de l’aide et d’identifier sa demande. Nous avons également revu et utilisé des structures essentielles comme “there is / there are”, “can / can’t” et les questions avec “where”, “what time” et “does”.\n\nNous avons développé le vocabulaire utile pour un lieu culturel ou patrimonial (exposition, visite guidée, point d’information, ascenseur, horaires, collection, site patrimonial, etc.), puis nous l’avons réutilisé dans des exercices de compréhension, d’orientation dans un lieu et de réponse aux questions d’un visiteur. Nous avons aussi travaillé les phrases qui permettent de maintenir la communication lorsque vous ne comprenez pas tout immédiatement : demander de répéter, de parler plus lentement, vérifier une information ou prendre un moment pour la confirmer.\n\nVous avez ensuite créé une fiche pratique d’accueil pour une exposition et utilisé ces informations dans un jeu de rôle. Nous avons terminé avec une courte mise en situation inspirée du LILATE IA afin de transférer progressivement ce que vous apprenez vers une situation professionnelle réelle, sans transformer le cours en examen blanc.\n\n👉 Votre leçon : ${link}\n\nN’hésitez pas à reprendre tranquillement les expressions, les audios et les exercices entre nos séances. L’objectif est de construire des automatismes et de prendre de plus en plus confiance dans des situations concrètes.\n\nÀ très bientôt pour la suite de notre travail !\n\nBien cordialement,\nTisha`;
    document.getElementById('generatedEmail').value=body;
  });

  document.getElementById('copyEmail').addEventListener('click',async()=>{
    const ok=await copyText(document.getElementById('generatedEmail').value);
    document.getElementById('copyStatus').textContent=ok?'Message copied.':'Select the message and copy it manually.';
  });

  function selectedObjectives(){
    return [...document.querySelectorAll('.objective-row')].filter(r=>r.querySelector('.objective-check').checked).map(r=>{
      const label=r.querySelector('label').textContent.trim();
      const priority=r.querySelector('.objective-priority').value;
      const status=r.querySelector('.objective-status').value;
      const comment=r.querySelector('.objective-comment').value.trim();
      return `${label} — ${priority} — ${status}${comment?` — ${comment}`:''}`;
    });
  }

  function autoProgressInline(){
    const m=metrics();
    return `Progression interactive: ${m.checked}/${m.totalExercises} exercices vérifiés, ${m.correct} corrects${m.accuracy===null?'':` (${m.accuracy}%)`}; ${m.tasksDone}/${m.tasksTotal} productions réalisées; auto-évaluation ${m.reflection}/6.`;
  }

  function centreRowValues(){
    const obs=[val('adminObservations'),autoProgressInline()].filter(Boolean).join(' | ');
    return [val('adminSessionNumber'),val('adminDuration'),val('adminHoursRemaining'),val('adminSessionDate'),val('adminObjectives'),val('adminContent'),val('adminSkills'),val('adminEvaluationMode'),val('adminAcquisition'),obs,val('adminLessonUrl')];
  }

  document.getElementById('copyCentreRow').addEventListener('click',async()=>{
    const ok=await copyText(centreRowValues().join('\t'));
    document.getElementById('copyStatus').textContent=ok?'Centre spreadsheet row copied in the requested order.':'Copy was blocked by the browser. Use the CSV download instead.';
  });

  function download(name, content, type='text/plain;charset=utf-8'){
    const blob=new Blob([content],{type}), a=document.createElement('a');
    a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }

  function fullAdminText(){
    updateMetrics();
    return `MIREILLE MAZEY — SESSION FOLLOW-UP\n\nLEARNER PROFILE\nCentre: ${val('adminCentre')}\nTrainer: ${val('adminTrainer')}\nCertification: ${val('adminCertification')}\nInitial level: ${val('adminInitialLevel')}\nTarget level: ${val('adminTargetLevel')}\nFirst course: ${val('adminStartDate')}\nContract end: ${val('adminEndDate')}\nTotal individual hours: ${val('adminTotalHours')}\n\nPROFESSIONAL DIRECTION\n${val('adminDirection')}\n\nSESSION\nNumber: ${val('adminSessionNumber')}\nDate: ${val('adminSessionDate')}\nDuration: ${val('adminDuration')}\nHours completed before: ${val('adminHoursBefore')}\nHours remaining after: ${val('adminHoursRemaining')}\nLesson URL: ${val('adminLessonUrl')}\n\nOBJECTIVES\n${val('adminObjectives')}\n\nCONTENT / ACTIVITIES\n${val('adminContent')}\n\nSKILLS\n${val('adminSkills')}\n\nEVALUATION METHOD\n${val('adminEvaluationMode')}\n\nACQUISITION\n${val('adminAcquisition')}\nEngagement: ${val('adminEngagement')}\nConfidence: ${val('adminConfidence')}\n\nAUTOMATIC PROGRESS\n${val('adminAutoProgress')}\n\nOBSERVATIONS\n${val('adminObservations')}\n\nTRAINER INTERPRETATION\n${val('adminProgressComment')}\n\nSELECTED CENTRE OBJECTIVES\n${selectedObjectives().join('\n') || 'None selected'}\n\nNEXT STEP\n${val('adminNextStep')}\n\nPRIVATE TRAINER NOTES\n${val('adminPrivateNotes')}\n`;
  }

  document.getElementById('downloadAdminTxt').addEventListener('click',()=>download('Mireille_Lesson_3_session_follow_up.txt',fullAdminText()));
  document.getElementById('downloadAdminCsv').addEventListener('click',()=>{
    const esc=v=>`"${String(v).replace(/"/g,'""')}"`;
    const headers=['session','duration','remaining_hours','date','objectives','content_activities','skills','evaluation_mode','acquisition','observations_and_progress','lesson_url'];
    const csv=`${headers.map(esc).join(',')}\n${centreRowValues().map(esc).join(',')}\n`;
    download('Mireille_Lesson_3_admin.csv',csv,'text/csv;charset=utf-8');
  });

  function learnerReport(){
    const answers=[
      ['Welcome script',document.getElementById('welcomeOutput').textContent],
      ['Visitor listening response',val('visitorAnswer')],
      ['Directions response',val('directionsResponse')],
      ['LILATE bridge response',val('lilateResponse')],
      ['What felt easiest',val('easiestToday')],
      ['What to recycle',val('nextFocus')]
    ];
    return `MIREILLE — LESSON 3 · WELCOME TO THE GALLERY\n\n${answers.map(([k,v])=>`${k}:\n${v||'—'}`).join('\n\n')}\n\n${autoProgressInline()}\n`;
  }

  document.getElementById('downloadBtn').addEventListener('click',()=>download('Mireille_Lesson_3_results.txt',learnerReport()));
  document.getElementById('printBtn').addEventListener('click',()=>window.print());

  loadFields();
  loadTracking();
  calculateRemaining();
  updateMetrics();
  showSection(0);
})();
