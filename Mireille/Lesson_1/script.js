(() => {
  const STORAGE_KEY = 'mireille_curator_studio_lesson2_v1';
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
  let current = 0;
  let trainerMode = false;
  let state = {};

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
    if (!trainerMode && sections.find(s => s.classList.contains('active') && s.classList.contains('trainer-section'))) showSection(0);
    else showSection(Math.min(current, visibleSections().length - 1));
  });

  function storageId(el) {
    if (el.id) return `id:${el.id}`;
    if (el.name) return `name:${el.name}:${el.value}`;
    const all = [...document.querySelectorAll('[data-save]')];
    return `idx:${all.indexOf(el)}`;
  }
  function saveAll() {
    state = {};
    document.querySelectorAll('[data-save]').forEach(el => {
      const key = storageId(el);
      if (el.type === 'checkbox' || el.type === 'radio') state[key] = el.checked;
      else state[key] = el.value;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    saveStatus.textContent = '● Saved';
    setTimeout(() => saveStatus.textContent = '● Autosave ready', 1000);
    calculateRemaining();
  }
  function loadAll() {
    try { state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { state = {}; }
    document.querySelectorAll('[data-save]').forEach(el => {
      const key = storageId(el);
      if (!(key in state)) return;
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = Boolean(state[key]);
      else el.value = state[key];
    });
    calculateRemaining();
  }
  document.addEventListener('input', e => { if (e.target.matches('[data-save]')) saveAll(); });
  document.addEventListener('change', e => { if (e.target.matches('[data-save]')) saveAll(); });

  document.getElementById('resetAll').addEventListener('click', () => {
    if (!confirm('Reset all saved lesson answers and trainer notes?')) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });

  function normalise(s) {
    return (s || '').toLowerCase().trim().replace(/[’]/g, "'").replace(/\s+/g, ' ').replace(/[.!?]+$/,'');
  }

  document.querySelectorAll('.check-question').forEach(btn => btn.addEventListener('click', () => {
    const q = btn.closest('.quiz-question');
    const chosen = q.querySelector('input[type="radio"]:checked');
    const fb = q.querySelector('.feedback');
    if (!chosen) { fb.className = 'feedback incorrect'; fb.textContent = 'Choose an answer first.'; return; }
    if (chosen.value === q.dataset.correct) { fb.className='feedback correct'; fb.textContent='✓ Correct. Keep that structure.'; }
    else { fb.className='feedback incorrect'; fb.textContent='Not quite. Try again — use the hint if you need it.'; }
  }));
  document.querySelectorAll('.hint-question').forEach(btn => btn.addEventListener('click', () => {
    const q = btn.closest('.quiz-question'); const fb=q.querySelector('.feedback'); fb.className='feedback hint'; fb.textContent=`Hint: ${q.dataset.hint}`;
  }));
  document.querySelectorAll('.check-select').forEach(btn => btn.addEventListener('click', () => {
    const q = btn.closest('.select-question'), val=q.querySelector('select').value, fb=q.querySelector('.feedback');
    if (!val) { fb.className='feedback incorrect'; fb.textContent='Choose an answer first.'; }
    else if (val === q.dataset.answer) { fb.className='feedback correct'; fb.textContent='✓ Correct.'; }
    else { fb.className='feedback incorrect'; fb.textContent='Not quite. Try again.'; }
  }));
  document.querySelectorAll('.hint-select').forEach(btn => btn.addEventListener('click', () => {
    const q=btn.closest('.select-question'), fb=q.querySelector('.feedback'); fb.className='feedback hint'; fb.textContent=`Hint: ${q.dataset.hint}`;
  }));
  document.querySelectorAll('.check-repair').forEach(btn => btn.addEventListener('click', () => {
    const item=btn.closest('.repair-item'), input=item.querySelector('input'), fb=item.querySelector('.feedback');
    if (!input.value.trim()) { fb.className='feedback incorrect'; fb.textContent='Write your correction first.'; return; }
    if (normalise(input.value) === normalise(item.dataset.answer)) { fb.className='feedback correct'; fb.textContent='✓ Excellent — that is the target structure.'; }
    else { fb.className='feedback incorrect'; fb.textContent=`Good attempt. Compare with the model: ${item.dataset.answer}`; }
  }));
  document.querySelectorAll('.hint-repair').forEach(btn => btn.addEventListener('click', () => {
    const item=btn.closest('.repair-item'), fb=item.querySelector('.feedback'); fb.className='feedback hint'; fb.textContent=`Hint: ${item.dataset.hint}`;
  }));

  function speak(text) {
    if (!('speechSynthesis' in window)) return alert('Speech playback is not supported in this browser.');
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang='en-US'; u.rate=.88; speechSynthesis.speak(u);
  }
  document.querySelectorAll('[data-speak]').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.speak)));

  document.querySelectorAll('.model-toggle').forEach(btn => btn.addEventListener('click', () => {
    const panel=document.getElementById(btn.dataset.target); panel.classList.toggle('hidden'); btn.textContent=panel.classList.contains('hidden')?'Show models':'Hide models';
  }));

  document.getElementById('buildIntro').addEventListener('click', () => {
    const vals=['introNow','introBefore','introBackground','introNext','introEnglish'].map(id=>document.getElementById(id).value.trim()).filter(Boolean);
    document.getElementById('introOutput').textContent = vals.length ? vals.join(' ') : 'Add at least one idea above to build your introduction.';
  });

  document.querySelectorAll('.timer-btn').forEach(btn => btn.addEventListener('click', () => {
    let seconds=Number(btn.dataset.seconds||60); const display=btn.parentElement.querySelector('.timer-display') || btn.closest('.lilate-task')?.querySelector('.timer-display');
    if (!display) return;
    btn.disabled=true;
    const render=()=>{ const m=String(Math.floor(seconds/60)).padStart(2,'0'), s=String(seconds%60).padStart(2,'0'); display.textContent=`${m}:${s}`; };
    render();
    const interval=setInterval(()=>{ seconds--; render(); if(seconds<=0){clearInterval(interval); btn.disabled=false; display.textContent='Time!';} },1000);
  }));

  let recorder, chunks=[];
  const recordBtn=document.getElementById('recordIntro'), stopBtn=document.getElementById('stopIntro'), playback=document.getElementById('introPlayback');
  if (recordBtn && navigator.mediaDevices) {
    recordBtn.addEventListener('click', async () => {
      try {
        const stream=await navigator.mediaDevices.getUserMedia({audio:true});
        recorder=new MediaRecorder(stream); chunks=[];
        recorder.ondataavailable=e=>chunks.push(e.data);
        recorder.onstop=()=>{ const blob=new Blob(chunks,{type:'audio/webm'}); playback.src=URL.createObjectURL(blob); playback.hidden=false; stream.getTracks().forEach(t=>t.stop()); };
        recorder.start(); recordBtn.disabled=true; stopBtn.disabled=false;
      } catch { alert('Microphone access was not available.'); }
    });
    stopBtn.addEventListener('click',()=>{ if(recorder && recorder.state!=='inactive') recorder.stop(); recordBtn.disabled=false; stopBtn.disabled=true; });
  }

  document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    const filter=btn.dataset.filter;
    document.querySelectorAll('.vocab-card').forEach(card => card.style.display=(filter==='all'||card.dataset.category===filter)?'flex':'none');
  }));

  document.getElementById('generateProject').addEventListener('click', () => {
    const type=document.getElementById('projectType').value, titleVal=document.getElementById('projectTitle').value.trim(), audience=document.getElementById('projectAudience').value, purpose=document.getElementById('projectPurpose').value, place=document.getElementById('projectPlace').value.trim(), partner=document.getElementById('projectPartner').value.trim();
    const out=[];
    if(titleVal||type) out.push(`The project is called “${titleVal || 'My Cultural Project'}” and it is ${type || 'a cultural project'}.`);
    if(audience) out.push(`It is for ${audience}.`);
    if(purpose) out.push(`The aim is to ${purpose}.`);
    if(place) out.push(`It will take place at ${place}.`);
    if(partner) out.push(`We would like to work with ${partner}.`);
    document.getElementById('projectOutput').textContent=out.length?out.join(' '):'Choose a few project elements first.';
  });

  const guided=document.getElementById('guidedMode'), challenge=document.getElementById('challengeMode'), guidedHelp=document.getElementById('guidedHelp');
  guided.addEventListener('click',()=>{guided.classList.add('active');challenge.classList.remove('active');guidedHelp.classList.remove('hidden');});
  challenge.addEventListener('click',()=>{challenge.classList.add('active');guided.classList.remove('active');guidedHelp.classList.add('hidden');});
  document.getElementById('transcriptToggle').addEventListener('click', e => {
    const tr=document.getElementById('visitorTranscript'); tr.classList.toggle('hidden'); e.currentTarget.textContent=tr.classList.contains('hidden')?'Show transcript':'Hide transcript';
  });

  document.querySelectorAll('.admin-tab').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.admin-tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    document.querySelectorAll('.admin-pane').forEach(p=>p.classList.toggle('active',p.dataset.adminPane===btn.dataset.adminTab));
  }));

  function val(id){ return (document.getElementById(id)?.value || '').trim(); }
  function calculateRemaining(){
    const total=parseFloat(val('adminTotalHours'))||0, before=parseFloat(val('adminHoursBefore'))||0, duration=parseFloat(val('adminDuration'))||0;
    const remain=Math.max(0,total-before-duration); const el=document.getElementById('adminHoursRemaining'); if(el) el.value=remain.toFixed(2).replace(/\.00$/,'');
  }

  function formatDateFR(dateString){
    if(!dateString) return '';
    const d=new Date(`${dateString}T12:00:00`); return new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric'}).format(d);
  }

  document.getElementById('generateEmail').addEventListener('click',()=>{
    const date=formatDateFR(val('adminSessionDate')) || 'notre dernier cours';
    const url=val('adminLessonUrl');
    const linkLine=url?`\nVoici le lien de la leçon de cette semaine :\n${url}\n`:'';
    const body=`Bonjour,\n\nMerci pour notre cours du ${date}. Nous avons commencé à structurer votre présentation professionnelle en anglais et à remettre en place des bases utiles de grammaire et de vocabulaire autour de votre nouveau projet dans la culture et le patrimoine.\n\nNous avons également travaillé des situations concrètes : rencontrer un partenaire culturel, présenter un petit projet, participer plus facilement à un échange professionnel et découvrir une première micro-situation de préparation au LILATE IA.\n${linkLine}\nL'objectif est d'avancer progressivement, sans chercher à tout maîtriser d'un seul coup. Nous allons continuer à consolider les bases tout en les appliquant à des situations directement liées à vos futurs projets professionnels.\n\nJe vous souhaite une très bonne semaine et je vous dis à bientôt pour la suite.\n\nBien cordialement,\nTisha`;
    document.getElementById('generatedEmail').value=body;
  });
  document.getElementById('copyEmail').addEventListener('click',async()=>{
    const text=document.getElementById('generatedEmail').value; if(!text) return;
    await navigator.clipboard.writeText(text); document.getElementById('copyStatus').textContent='Email copied.';
  });

  function selectedObjectives(){
    return [...document.querySelectorAll('.objective-row')].filter(r=>r.querySelector('.objective-check').checked).map(r=>{
      const label=r.querySelector('label').textContent.trim(); const priority=r.querySelector('.objective-priority').value; const status=r.querySelector('.objective-status').value; const comment=r.querySelector('.objective-comment').value.trim(); return `${label} — ${priority} — ${status}${comment?` — ${comment}`:''}`;
    });
  }
  function centreRowValues(){
    return [val('adminSessionNumber'),val('adminDuration'),val('adminHoursRemaining'),val('adminSessionDate'),val('adminObjectives'),val('adminContent'),val('adminSkills'),val('adminEvaluationMode'),val('adminAcquisition'),val('adminObservations'),val('adminLessonUrl')];
  }
  document.getElementById('copyCentreRow').addEventListener('click',async()=>{
    const row=centreRowValues().join('\t'); await navigator.clipboard.writeText(row); document.getElementById('copyStatus').textContent='Centre spreadsheet row copied in the requested order.';
  });

  function download(name, content, type='text/plain;charset=utf-8'){
    const blob=new Blob([content],{type}), a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  function fullAdminText(){
    return `MIREILLE MAZEY — SESSION FOLLOW-UP\n\nLEARNER PROFILE\nCentre: ${val('adminCentre')}\nTrainer: ${val('adminTrainer')}\nCertification: ${val('adminCertification')}\nInitial level: ${val('adminInitialLevel')}\nTarget level: ${val('adminTargetLevel')}\nContract: ${val('adminStartDate')} to ${val('adminEndDate')}\nTotal individual hours: ${val('adminTotalHours')}\n\nPROFESSIONAL DIRECTION\n${val('adminDirection')}\n\nSESSION\nNumber: ${val('adminSessionNumber')}\nDate: ${val('adminSessionDate')}\nDuration: ${val('adminDuration')}\nHours remaining: ${val('adminHoursRemaining')}\nLesson URL: ${val('adminLessonUrl')}\n\nOBJECTIVES\n${val('adminObjectives')}\n\nCONTENT / ACTIVITIES\n${val('adminContent')}\n\nSKILLS\n${val('adminSkills')}\n\nEVALUATION METHOD\n${val('adminEvaluationMode')}\n\nACQUISITION\n${val('adminAcquisition')}\n\nOBSERVATIONS\n${val('adminObservations')}\n\nSELECTED CENTRE OBJECTIVES\n${selectedObjectives().join('\n') || 'None selected'}\n\nNEXT STEP\n${val('adminNextStep')}\n\nPRIVATE TRAINER NOTES\n${val('adminPrivateNotes')}\n`;
  }
  document.getElementById('downloadAdminTxt').addEventListener('click',()=>download('Mireille_session_follow_up.txt',fullAdminText()));
  document.getElementById('downloadAdminCsv').addEventListener('click',()=>{
    const esc=v=>`"${String(v).replace(/"/g,'""')}"`; const headers=['session','duration','remaining_hours','date','objectives','content_activities','skills','evaluation_mode','acquisition','observations','lesson_url'];
    const csv=`${headers.map(esc).join(',')}\n${centreRowValues().map(esc).join(',')}\n`; download('Mireille_session_admin.csv',csv,'text/csv;charset=utf-8');
  });

  function learnerReport(){
    const answers=[
      ['Professional introduction',document.getElementById('introOutput').textContent],
      ['Mini cultural project',document.getElementById('projectOutput').textContent],
      ['LILATE micro-response',val('lilateResponse')],
      ['What felt easiest',val('easiestToday')],
      ['Next focus',val('nextFocus')]
    ];
    return `MIREILLE — LESSON 2 · THE CURATOR'S STUDIO\n\n${answers.map(([k,v])=>`${k}:\n${v || '—'}`).join('\n\n')}\n`;
  }
  document.getElementById('downloadBtn').addEventListener('click',()=>download('Mireille_Lesson_2_report.txt',learnerReport()));
  document.getElementById('printBtn').addEventListener('click',()=>window.print());

  loadAll();
  showSection(0);
})();
