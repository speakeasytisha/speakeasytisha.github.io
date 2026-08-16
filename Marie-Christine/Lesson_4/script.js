(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const toast = $('#toast');
  let toastTimer;
  const showToast = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  };

  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } },
    remove(key) { try { localStorage.removeItem(key); } catch {} }
  };

  const normalize = (value = '') => value.trim().toLowerCase().replace(/[’']/g, "'").replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ');
  const escapeHtml = (value = '') => String(value).replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));

  const copyText = async text => {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const area = document.createElement('textarea'); area.value = text; area.style.position='fixed'; area.style.opacity='0';
      document.body.appendChild(area); area.select();
      try { document.execCommand('copy'); } catch {}
      area.remove(); return true;
    }
  };
  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 500);
  };
  const downloadText = (text, filename) => downloadBlob(new Blob([text], {type:'text/plain;charset=utf-8'}), filename);

  // ---------- Preferences ----------
  const translationToggle = $('#translationToggle');
  const savedTranslation = storage.get('mc_l4_translation');
  if (translationToggle && savedTranslation !== null) translationToggle.checked = savedTranslation === 'true';
  function applyTranslation() {
    document.body.classList.toggle('hide-fr', translationToggle && !translationToggle.checked);
    if (translationToggle) storage.set('mc_l4_translation', String(translationToggle.checked));
  }
  translationToggle?.addEventListener('change', applyTranslation); applyTranslation();

  const fontStates = ['font-small', '', 'font-large', 'font-xlarge'];
  let fontIndex = Number(storage.get('mc_l4_font') || 1);
  if (!Number.isFinite(fontIndex) || fontIndex < 0 || fontIndex > 3) fontIndex = 1;
  function applyFont() {
    document.body.classList.remove('font-small','font-large','font-xlarge');
    if (fontStates[fontIndex]) document.body.classList.add(fontStates[fontIndex]);
    storage.set('mc_l4_font', String(fontIndex));
  }
  $$('[data-font]').forEach(btn => btn.addEventListener('click', () => {
    if (btn.dataset.font === 'minus') fontIndex = Math.max(0, fontIndex - 1);
    if (btn.dataset.font === 'plus') fontIndex = Math.min(3, fontIndex + 1);
    if (btn.dataset.font === 'reset') fontIndex = 1;
    applyFont();
  })); applyFont();
  $('#printBtn')?.addEventListener('click', () => window.print());

  // ---------- TTS ----------
  let voices = [];
  const loadVoices = () => { voices = speechSynthesis?.getVoices?.() || []; };
  loadVoices(); if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = loadVoices;
  function speak(text) {
    if (!text || !('speechSynthesis' in window)) return showToast('Text-to-speech is not available in this browser.');
    speechSynthesis.cancel();
    const lang = $('#accentSelect')?.value || 'en-GB'; const rate = Number($('#speedSelect')?.value || .86);
    const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = rate; u.pitch = 1;
    const voice = voices.find(v => v.lang.toLowerCase() === lang.toLowerCase()) || voices.find(v => v.lang.toLowerCase().startsWith(lang.slice(0,2).toLowerCase()));
    if (voice) u.voice = voice; speechSynthesis.speak(u);
  }
  $$('.speak-btn').forEach(btn => btn.addEventListener('click', () => {
    const text = btn.dataset.speak || '';
    if (text) speak(text);
  }));

  // ---------- Show/hide ----------
  $$('.hint-btn').forEach(btn => btn.addEventListener('click', () => {
    const content = btn.nextElementSibling; if (!content) return;
    content.classList.toggle('open'); btn.textContent = content.classList.contains('open') ? 'Hide support' : 'Show support';
  }));
  $$('.transcript-btn').forEach(btn => btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target || ''); if (!target) return;
    target.classList.toggle('open');
    const custom = btn.dataset.target === 'fullRescueOral';
    const isOpen = target.classList.contains('open');
    const openLabel = btn.dataset.openLabel || (custom ? 'Show full oral text' : 'Show model / transcript');
    const closeLabel = btn.dataset.closeLabel || (custom ? 'Hide full oral text' : 'Hide model / transcript');
    btn.textContent = isOpen ? closeLabel : openLabel;
  }));
  $$('.wordbank-btn').forEach(btn => btn.addEventListener('click', () => {
    const box = document.getElementById(btn.dataset.target || ''); if (!box) return;
    box.classList.toggle('open'); btn.textContent = box.classList.contains('open') ? 'Hide word bank' : 'Show word bank';
  }));

  // ---------- Vocabulary tabs ----------
  $$('.vocab-tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.vocab-tab').forEach(x => x.classList.remove('active')); $$('.vocab-panel').forEach(x => x.classList.remove('active'));
    tab.classList.add('active'); $(`.vocab-panel[data-panel="${tab.dataset.vocab}"]`)?.classList.add('active');
  }));

  // ---------- Builders ----------
  const vocabControls = [$('#vocabStart'), $('#vocabMiddle'), $('#vocabEnd')];
  function updateVocabSentence() {
    const parts = vocabControls.map(x => x?.value || '').filter(Boolean);
    $('#vocabSentence').textContent = parts.length ? parts.join(' ').replace(/\s+([?.!,])/g,'$1') : 'Choose the parts that make sense together.';
  }
  vocabControls.forEach(x => x?.addEventListener('change', updateVocabSentence));
  $('#speakVocabSentence')?.addEventListener('click', () => { const t=$('#vocabSentence')?.textContent||''; if(!t.startsWith('Choose')) speak(t); });

  const decisionControls = [$('#decisionProblem'),$('#decisionQuestion'),$('#decisionReform'),$('#decisionIf')];
  function buildDecision() {
    const text = decisionControls.map(x => x?.value || '').filter(Boolean).join(' ');
    $('#decisionOutput').textContent = text || 'Choose one sentence from each step.';
  }
  decisionControls.forEach(x => x?.addEventListener('change', buildDecision));
  $('#buildDecision')?.addEventListener('click', buildDecision);
  $('#speakDecision')?.addEventListener('click', () => { const t=$('#decisionOutput')?.textContent||''; if(!t.startsWith('Choose')) speak(t); });

  // ---------- Quiz engine ----------
  // Keep the Final Objective Check genuinely mixed: correct answers are
  // distributed evenly across A/B/C positions instead of always appearing first.
  function distributeFinalQuizAnswers() {
    const root = document.getElementById('finalQuiz');
    if (!root) return;
    const items = $$('.quiz-item', root);
    const basePositions = [];
    const optionCount = 3;
    for (let i = 0; i < items.length; i += 1) basePositions.push(i % optionCount);
    // Fisher-Yates shuffle of the target positions keeps the distribution balanced.
    for (let i = basePositions.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [basePositions[i], basePositions[j]] = [basePositions[j], basePositions[i]];
    }
    items.forEach((item, index) => {
      const holder = $('.choice-column, .choice-row', item);
      if (!holder) return;
      const answer = normalize(item.dataset.answer || '');
      const buttons = $$('button', holder);
      const correct = buttons.find(button => normalize(button.textContent) === answer);
      const distractors = buttons.filter(button => button !== correct);
      // Mix distractors as well.
      for (let i = distractors.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
      }
      if (!correct) return;
      const target = basePositions[index] ?? 0;
      const ordered = [...distractors];
      ordered.splice(Math.min(target, ordered.length), 0, correct);
      ordered.forEach(button => holder.appendChild(button));
    });
  }
  distributeFinalQuizAnswers();

  const quizIds = ['pastTenseQuiz','perfectQuiz','modalQuiz','trainListeningQuiz','hotelListeningQuiz','reformulateQuiz','readingQuiz','finalQuiz'];
  function resultFor(id) {
    const root = document.getElementById(id); if (!root) return {correct:0,total:0};
    const items = $$('.quiz-item', root);
    return {correct:items.filter(i => i.dataset.correct === 'true').length,total:items.length};
  }
  function updateQuizScore(root) {
    if (!root) return;
    const result = resultFor(root.id); const score = $(`[data-score-current="${root.id}"]`); if (score) score.textContent = result.correct;
    updateDashboard();
  }
  quizIds.forEach(id => {
    const root = document.getElementById(id); if (!root) return;
    $$('.quiz-item', root).forEach(item => {
      const answer = item.dataset.answer || '';
      $$('button', item).forEach(button => button.addEventListener('click', () => {
        if (item.dataset.completed === 'true') return;
        const correct = normalize(button.textContent) === normalize(answer);
        item.dataset.completed='true'; item.dataset.correct=String(correct);
        $$('button', item).forEach(choice => { choice.disabled=true; if(normalize(choice.textContent)===normalize(answer)) choice.classList.add('correct'); });
        if (!correct) button.classList.add('incorrect');
        const fb=$('.feedback',item); if(fb){fb.textContent=correct?'✓ Correct — well done.':`The best answer is: ${answer}`;fb.className=`feedback ${correct?'good':'bad'}`;}
        updateQuizScore(root);
      }));
    });
  });
  $$('[data-reset]').forEach(btn => btn.addEventListener('click', () => {
    const root=document.getElementById(btn.dataset.reset); if(!root)return;
    $$('.quiz-item',root).forEach(item=>{delete item.dataset.completed;delete item.dataset.correct;$$('button',item).forEach(b=>{b.disabled=false;b.classList.remove('correct','incorrect')});const fb=$('.feedback',item);if(fb){fb.textContent='';fb.className='feedback';}});
    if (root.id === 'finalQuiz') distributeFinalQuizAnswers();
    updateQuizScore(root);
  }));

  // ---------- Fill exercises ----------
  const fillIds = ['conditionalFill','questionFill'];
  function fillResult(id) {
    const root=document.getElementById(id); if(!root)return{correct:0,total:0}; const inputs=$$('input[data-answer]',root);
    return {correct:inputs.filter(i=>i.dataset.correct==='true').length,total:inputs.length};
  }
  function isFillCorrect(input) {
    const expected=[input.dataset.answer||'', ...(input.dataset.alternatives||'').split('|').filter(Boolean)];
    return expected.some(ans=>normalize(input.value)===normalize(ans));
  }
  // Live support for typed grammar answers: reward correct answers immediately without revealing the answer too soon.
  fillIds.forEach(id => {
    const root=document.getElementById(id); if(!root) return;
    $$('input[data-answer]',root).forEach(input => {
      const updateLive = (revealWrong=false) => {
        const value=input.value.trim();
        const fb=input.parentElement?.querySelector('.inline-feedback');
        if(!value){ delete input.dataset.correct; input.classList.remove('correct','incorrect'); if(fb){fb.textContent='';fb.className='inline-feedback';} return; }
        const correct=isFillCorrect(input);
        input.dataset.correct=String(correct);
        input.classList.toggle('correct',correct);
        input.classList.toggle('incorrect',!correct && revealWrong);
        if(fb){
          fb.textContent=correct?'✓ Correct':(revealWrong?'Try again':'Keep going…');
          fb.className=`inline-feedback ${correct?'live-good':'live-try'}`;
        }
        const r=fillResult(root.id);const score=$(`[data-score-current="${root.id}"]`);if(score)score.textContent=r.correct;updateDashboard();
      };
      input.addEventListener('input',()=>updateLive(false));
      input.addEventListener('blur',()=>updateLive(true));
    });
  });
  $$('.check-fill').forEach(btn=>btn.addEventListener('click',()=>{
    const root=document.getElementById(btn.dataset.fill);if(!root)return;
    $$('input[data-answer]',root).forEach(input=>{
      const correct=isFillCorrect(input);input.dataset.correct=String(correct);input.classList.toggle('correct',correct);input.classList.toggle('incorrect',!correct);
      const fb=input.parentElement?.querySelector('.inline-feedback');if(fb)fb.textContent=correct?' ✓':` → ${input.dataset.answer}`;
    });
    const r=fillResult(root.id);const score=$(`[data-score-current="${root.id}"]`);if(score)score.textContent=r.correct;updateDashboard();
  }));
  $$('.reset-fill').forEach(btn=>btn.addEventListener('click',()=>{
    const root=document.getElementById(btn.dataset.fill);if(!root)return;$$('input[data-answer]',root).forEach(input=>{input.value='';delete input.dataset.correct;input.classList.remove('correct','incorrect');const fb=input.parentElement?.querySelector('.inline-feedback');if(fb)fb.textContent='';});const score=$(`[data-score-current="${root.id}"]`);if(score)score.textContent='0';updateDashboard();
  }));

  // ---------- Writing ----------
  const writingResponse=$('#writingResponse'); if(writingResponse){writingResponse.value=storage.get('mc_l4_writing')||'';writingResponse.addEventListener('input',()=>storage.set('mc_l4_writing',writingResponse.value));}
  $('#copyWriting')?.addEventListener('click',async()=>{await copyText(writingResponse?.value||'');showToast('Your message was copied.');});
  const confidenceResponse=$('#confidenceResponse'); if(confidenceResponse){confidenceResponse.value=storage.get('mc_l4_confidence')||'';confidenceResponse.addEventListener('input',()=>storage.set('mc_l4_confidence',confidenceResponse.value));}

  // ---------- Random scenario ----------
  const scenarios=[
    {title:'A cancelled flight',text:'Your flight to Boston has been cancelled. The airline offers a flight tomorrow morning or a train to another airport tonight.',prompts:['Explain the problem','Ask about the two options','Reformulate the information','Choose and justify a solution'],hint:'Useful: My flight has been cancelled. / Could you tell me what time…? / So, if I understand correctly… / If I take…, I will…',model:'A2+: My flight has been cancelled, so I need another option. Could you tell me what time the flight tomorrow leaves? So, I can either fly tomorrow morning or travel to another airport tonight. Is that right? If the morning flight is confirmed, I will take that one.\n\nB1: My flight to Boston has been cancelled and I have been offered two alternatives. Could you confirm the departure time of tomorrow morning’s flight and explain how I would get to the other airport tonight? If the morning flight is guaranteed, I would prefer that option because it is simpler.'},
    {title:'A missing hotel reservation',text:'You arrive at a hotel, but reception cannot find your booking. You booked three nights and have a confirmation email on your phone.',prompts:['State the problem','Give evidence','Ask what they can do','Confirm the solution'],hint:'Useful: I booked… / I have the confirmation email… / Could you check…? / So, you can offer me… Is that right?',model:'A2+: I booked a room for three nights, but you cannot find my reservation. I have the confirmation email here. Could you check the booking number, please? If the room is not available, is there another room you can offer me?\n\nB1: I made a reservation online for three nights and I have the confirmation email and booking number on my phone. It seems the reservation is not appearing in your system. Could you check under my full name and booking reference? If the original room is unavailable, I would appreciate an equivalent alternative.'},
    {title:'A missed train connection',text:'Your first train arrived 40 minutes late and you missed your connection. You need to reach Dunkirk this evening.',prompts:['Explain what happened','Ask for the next train','Ask about your ticket','Make a plan'],hint:'Useful: My first train arrived… / When is the next…? / Is my ticket still valid? / If…, I will…',model:'A2+: My first train arrived forty minutes late, so I missed my connection. When is the next train to Dunkirk? Can I use the same ticket? If the next train leaves soon, I will take it.\n\nB1: Because my first train was delayed by forty minutes, I missed my connection to Dunkirk. Could you tell me when the next service leaves and whether my current ticket remains valid? If there is a direct service this evening, I will take that rather than changing trains again.'},
    {title:'A visitor cannot find your address',text:'A visitor is coming to see you in northern France. The person calls because the GPS has stopped working and they are near the station.',prompts:['Identify where they are','Give simple directions','Check understanding','Offer a backup solution'],hint:'Useful: Where are you exactly? / Go straight… / So, you are… / If you cannot find it, I will…',model:'A2+: Where are you exactly? If you are near the station, go straight ahead and turn left at the second traffic light. My street is on the right. Could you repeat where you are now? If you cannot find it, I will meet you near the station.\n\nB1: First, tell me exactly what you can see near the station so I can identify your location. From the main entrance, go straight ahead and take the second left. I’ll stay on the phone while you walk. If the GPS still does not work, I can meet you at an easy landmark.'},
    {title:'A room problem',text:'The room is very noisy and the heating is not working. You want to explain the problem and ask for another room.',prompts:['Describe both problems','Say what you have already done','Make a polite request','Confirm the alternative'],hint:'Useful: The room is… / I have already… / Would it be possible…? / So, the other room… Is that right?',model:'A2+: The room is very noisy and the heating is not working. I have already checked the thermostat. Could you send someone to look at it, or could I change rooms?\n\nB1: I’m afraid there are two problems with my room. It is quite noisy and the heating does not seem to be working, although I have already checked the thermostat. Would it be possible to move to a quieter room with working heating? If another room is available, I would prefer to change.'}
  ];
  let currentScenario=scenarios[0];
  function renderScenario(sc) {
    currentScenario=sc; $('#scenarioTitle').textContent=sc.title; $('#scenarioText').textContent=sc.text;
    $('#scenarioPrompts').innerHTML=sc.prompts.map(x=>`<span>${escapeHtml(x)}</span>`).join('');
    $('#scenarioHintBox').classList.remove('open'); $('#scenarioHintBox').textContent=sc.hint;
    $('#scenarioModelBox').classList.remove('open'); $('#scenarioModelBox').innerHTML=sc.model.split('\n\n').map(p=>`<p>${escapeHtml(p)}</p>`).join('');
    $('#scenarioHint').textContent='Show hints'; $('#scenarioModel').textContent='Show A2+/B1 model'; $('#speakScenario').dataset.speak=sc.text;
  }
  $('#newScenario')?.addEventListener('click',()=>{let sc=currentScenario;while(scenarios.length>1&&sc===currentScenario)sc=scenarios[Math.floor(Math.random()*scenarios.length)];renderScenario(sc);});
  $('#scenarioHint')?.addEventListener('click',()=>{const box=$('#scenarioHintBox');box.classList.toggle('open');$('#scenarioHint').textContent=box.classList.contains('open')?'Hide hints':'Show hints';});
  $('#scenarioModel')?.addEventListener('click',()=>{const box=$('#scenarioModelBox');box.classList.toggle('open');$('#scenarioModel').textContent=box.classList.contains('open')?'Hide model':'Show A2+/B1 model';});
  $('#speakScenario')?.addEventListener('click',()=>speak(currentScenario.text));

  // ---------- Recorders ----------
  const recorderStates={};
  function setupRecorder(key) {
    const recordBtn=$(`.record-btn[data-recorder="${key}"]`), stopBtn=$(`.stop-btn[data-recorder="${key}"]`), timer=$(`#${key}Timer`), playback=$(`#${key}Playback`), download=$(`#${key}Download`), note=$(`#${key}Note`);
    if(!recordBtn||!stopBtn)return;
    recorderStates[key]={mediaRecorder:null,chunks:[],seconds:0,interval:null,url:null};
    recordBtn.addEventListener('click',async()=>{
      try {
        const stream=await navigator.mediaDevices.getUserMedia({audio:true}); const state=recorderStates[key]; state.chunks=[];
        const mr=new MediaRecorder(stream); state.mediaRecorder=mr;
        mr.ondataavailable=e=>{if(e.data.size)state.chunks.push(e.data)};
        mr.onstop=()=>{const blob=new Blob(state.chunks,{type:mr.mimeType||'audio/webm'});if(state.url)URL.revokeObjectURL(state.url);state.url=URL.createObjectURL(blob);playback.src=state.url;playback.hidden=false;download.href=state.url;download.download=`Marie-Christine-Lesson-4-${key}-recording.webm`;download.hidden=false;stream.getTracks().forEach(t=>t.stop());};
        mr.start(); state.seconds=0; timer.textContent='00:00'; state.interval=setInterval(()=>{state.seconds++;timer.textContent=`${String(Math.floor(state.seconds/60)).padStart(2,'0')}:${String(state.seconds%60).padStart(2,'0')}`},1000);
        recordBtn.disabled=true;stopBtn.disabled=false;if(note)note.textContent='Recording…';
      } catch { if(note)note.textContent='Microphone access was not granted. Please allow it in your browser settings.'; }
    });
    stopBtn.addEventListener('click',()=>{const state=recorderStates[key];if(state.mediaRecorder?.state==='recording')state.mediaRecorder.stop();clearInterval(state.interval);recordBtn.disabled=false;stopBtn.disabled=true;if(note)note.textContent='Recording ready. Listen or download it.';});
  }
  setupRecorder('mission1');setupRecorder('final');

  // ---------- Notes ----------
  const noteIds=['vocabNotes','proudSentence','nextGoal','speakingComment','writingComment','evaluationComments','speakingStatus','writingStatus'];
  noteIds.forEach(id=>{const el=document.getElementById(id);if(!el)return;const v=storage.get(`mc_l4_${id}`);if(v!==null)el.value=v;el.addEventListener('input',()=>storage.set(`mc_l4_${id}`,el.value));el.addEventListener('change',()=>storage.set(`mc_l4_${id}`,el.value));});
  $('#saveNotes')?.addEventListener('click',()=>{['vocabNotes','proudSentence','nextGoal'].forEach(id=>storage.set(`mc_l4_${id}`,document.getElementById(id)?.value||''));$('#saveMessage').textContent='✓ Saved';showToast('Your notes were saved on this device.');});
  $('#copyNotes')?.addEventListener('click',async()=>{await copyText(notesText());showToast('Your notes were copied.');});
  $('#downloadNotes')?.addEventListener('click',()=>downloadText(notesText(),'Marie-Christine-Lesson-4-Notes.txt'));
  function notesText(){return ['MARIE-CHRISTINE — LESSON 4 NOTES','Travel Rescue Mission','',`NEW WORDS\n${$('#vocabNotes')?.value||'—'}`,`\nA SENTENCE I AM PROUD OF\n${$('#proudSentence')?.value||'—'}`,`\nMY NEXT SPEAKING GOAL\n${$('#nextGoal')?.value||'—'}`,`\nWRITING PRACTICE\n${$('#writingResponse')?.value||'—'}`].join('\n');}

  // ---------- Dashboard ----------
  const combine=results=>results.reduce((a,b)=>({correct:a.correct+b.correct,total:a.total+b.total}),{correct:0,total:0});
  const pct=result=>result.total?Math.round(result.correct/result.total*100):0;
  const statusFor=score=>score>=75?{label:'Acquis',className:'acquired'}:score>=50?{label:'En voie d’acquisition',className:'progress'}:{label:'En cours',className:''};
  function setDash(prefix,result){const score=pct(result),status=statusFor(score);const scoreEl=$(`#${prefix}Score`),statusEl=$(`#${prefix}Status`);if(scoreEl)scoreEl.textContent=`${score}%`;if(statusEl){statusEl.textContent=status.label;statusEl.className=`status-chip ${status.className}`.trim();}return{...result,score,status:status.label};}
  function dashboardData(){
    const grammar=combine([resultFor('pastTenseQuiz'),resultFor('perfectQuiz'),resultFor('modalQuiz'),fillResult('conditionalFill')]);
    const questions=fillResult('questionFill');
    const listening=combine([resultFor('trainListeningQuiz'),resultFor('hotelListeningQuiz'),resultFor('readingQuiz')]);
    const strategy=combine([resultFor('reformulateQuiz'),resultFor('finalQuiz')]);
    const overall=combine([grammar,questions,listening,strategy]);
    return {grammar,questions,listening,strategy,overall};
  }
  function updateDashboard(){const d=dashboardData();setDash('grammar',d.grammar);setDash('question',d.questions);setDash('listening',d.listening);setDash('strategy',d.strategy);setDash('overall',d.overall);}
  updateDashboard();

  // ---------- Ratings ----------
  const ratings={};
  $$('.rating-buttons').forEach(group=>{const name=group.dataset.rating;const saved=storage.get(`mc_l4_rating_${name}`);if(saved){ratings[name]=saved;$$('button',group).forEach(b=>b.classList.toggle('active',b.textContent===saved));}$$('button',group).forEach(btn=>btn.addEventListener('click',()=>{$$('button',group).forEach(b=>b.classList.remove('active'));btn.classList.add('active');ratings[name]=btn.textContent;storage.set(`mc_l4_rating_${name}`,btn.textContent);}));});

  function evaluationData(){
    const d=dashboardData();
    const mk=r=>({score:pct(r),status:statusFor(pct(r)).label,correct:r.correct,total:r.total});
    return {
      generated:new Date().toLocaleString('en-GB'),
      title:'Marie-Christine — Lesson 4 Evaluation & Progress',subtitle:'Travel Rescue Mission · LILATE',
      grammar:mk(d.grammar),questions:mk(d.questions),listening:mk(d.listening),strategy:mk(d.strategy),overall:mk(d.overall),
      speakingStatus:$('#speakingStatus')?.value||'En cours',speakingComment:$('#speakingComment')?.value.trim()||'—',
      writingStatus:$('#writingStatus')?.value||'En cours',writingComment:$('#writingComment')?.value.trim()||'—',
      useful:ratings.useful||'Not rated',clear:ratings.clear||'Not rated',confidence:ratings.confidence||'Not rated',comments:$('#evaluationComments')?.value.trim()||'No comments provided.',
      vocabNotes:$('#vocabNotes')?.value.trim()||'—',proudSentence:$('#proudSentence')?.value.trim()||'—',nextGoal:$('#nextGoal')?.value.trim()||'—'
    };
  }
  function evaluationText(){const e=evaluationData();return [e.title,e.subtitle,`Generated: ${e.generated}`,'','AUTOMATIC RESULTS',`Overall: ${e.overall.score}% — ${e.overall.status} (${e.overall.correct}/${e.overall.total})`,`Grammar accuracy: ${e.grammar.score}% — ${e.grammar.status} (${e.grammar.correct}/${e.grammar.total})`,`Question formation: ${e.questions.score}% — ${e.questions.status} (${e.questions.correct}/${e.questions.total})`,`Listening & reading comprehension: ${e.listening.score}% — ${e.listening.status} (${e.listening.correct}/${e.listening.total})`,`Reformulation & strategy: ${e.strategy.score}% — ${e.strategy.status} (${e.strategy.correct}/${e.strategy.total})`,'','MANUAL SKILLS',`Speaking: ${e.speakingStatus}`,`Speaking comments: ${e.speakingComment}`,`Writing: ${e.writingStatus}`,`Writing comments: ${e.writingComment}`,'','LEARNER FEEDBACK',`Usefulness: ${e.useful}/5`,`Clarity: ${e.clear}/5`,`Confidence: ${e.confidence}/5`,`Comments: ${e.comments}`,'','PERSONAL PROGRESS NOTES',`New words: ${e.vocabNotes}`,`Proud sentence: ${e.proudSentence}`,`Next speaking goal: ${e.nextGoal}`].join('\n');}
  $('#copyEvaluation')?.addEventListener('click',async()=>{await copyText(evaluationText());$('#evaluationMessage').textContent='✓ Complete evaluation copied';showToast('Complete evaluation copied.');});
  $('#downloadEvaluation')?.addEventListener('click',()=>{downloadText(evaluationText(),'Marie-Christine-Lesson-4-Evaluation.txt');$('#evaluationMessage').textContent='✓ TXT downloaded';});

  function reportHtml(e){
    const card=(name,obj)=>`<div class="score"><span>${name}</span><strong>${obj.score}%</strong><small>${obj.status} · ${obj.correct}/${obj.total} validated</small></div>`;
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(e.title)}</title><style>
      :root{--navy:#173a50;--teal:#147976;--gold:#d8b56a;--cream:#f7f0e2;--coral:#cf6b4b;--ink:#26343d}*{box-sizing:border-box}body{margin:0;background:#f7f4ed;color:var(--ink);font-family:Arial,Helvetica,sans-serif;line-height:1.55}.wrap{max-width:920px;margin:0 auto;padding:36px 22px}.hero{background:linear-gradient(135deg,var(--navy),#21566c);color:white;border-radius:26px;padding:34px;box-shadow:0 18px 45px #173a5030}.hero .tag{color:var(--gold);font-weight:800;letter-spacing:.1em}.hero h1{margin:8px 0;font-size:34px}.hero p{margin:0;color:#e8eef1}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin:22px 0}.score{background:white;border-radius:18px;padding:20px;border-top:5px solid var(--teal);box-shadow:0 8px 25px #173a5010}.score strong{display:block;font-size:32px;color:var(--navy)}.score small{color:#67757d}.score.overall{grid-column:1/-1;border-top-color:var(--gold);background:var(--cream)}section{background:white;margin:16px 0;padding:24px;border-radius:20px}h2{color:var(--navy);margin-top:0;border-bottom:2px solid var(--gold);padding-bottom:8px}.pill{display:inline-block;background:#edf8f6;color:var(--teal);font-weight:700;border-radius:999px;padding:6px 10px;margin-right:8px}.comments{white-space:pre-wrap;background:#f8faf9;padding:14px;border-radius:12px;border-left:4px solid var(--coral)}footer{text-align:center;color:#6f7b82;padding:20px}@media(max-width:650px){.grid{grid-template-columns:1fr}.score.overall{grid-column:auto}}@media print{body{background:white}.wrap{padding:0}.hero,.score,section{box-shadow:none;break-inside:avoid}}</style></head><body><div class="wrap"><div class="hero"><div class="tag">LILATE · LESSON 4</div><h1>${escapeHtml(e.title)}</h1><p>${escapeHtml(e.subtitle)} · Generated ${escapeHtml(e.generated)}</p></div><div class="grid">${card('Grammar accuracy',e.grammar)}${card('Question formation',e.questions)}${card('Listening & reading',e.listening)}${card('Reformulation & strategy',e.strategy)}<div class="score overall"><span>Overall objective result</span><strong>${e.overall.score}%</strong><small>${e.overall.status} · ${e.overall.correct}/${e.overall.total} validated</small></div></div><section><h2>Speaking & writing</h2><p><span class="pill">Speaking: ${escapeHtml(e.speakingStatus)}</span><span class="pill">Writing: ${escapeHtml(e.writingStatus)}</span></p><p><strong>Speaking comments</strong></p><div class="comments">${escapeHtml(e.speakingComment)}</div><p><strong>Writing comments</strong></p><div class="comments">${escapeHtml(e.writingComment)}</div></section><section><h2>Your lesson feedback</h2><p>Usefulness: <strong>${escapeHtml(e.useful)}/5</strong> · Clarity: <strong>${escapeHtml(e.clear)}/5</strong> · Confidence: <strong>${escapeHtml(e.confidence)}/5</strong></p><div class="comments">${escapeHtml(e.comments)}</div></section><section><h2>Your progress notes</h2><p><strong>New words</strong></p><div class="comments">${escapeHtml(e.vocabNotes)}</div><p><strong>A sentence you are proud of</strong></p><div class="comments">${escapeHtml(e.proudSentence)}</div><p><strong>Your next speaking goal</strong></p><div class="comments">${escapeHtml(e.nextGoal)}</div></section><footer>Marie-Christine · Travel Rescue Mission · LILATE</footer></div></body></html>`;
  }
  $('#downloadEvaluationHtml')?.addEventListener('click',()=>{const html=reportHtml(evaluationData());downloadBlob(new Blob([html],{type:'text/html;charset=utf-8'}),'Marie-Christine-Lesson-4-Progress-Report.html');$('#evaluationMessage').textContent='✓ HTML report downloaded';});

  // Minimal branded PDF generator (no external library required)
  function latin1Safe(text=''){return String(text).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—]/g,'-').replace(/[^\x20-\xFF]/g,'?');}
  function pdfEscape(text=''){return latin1Safe(text).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
  function wrapText(text,max=82){const words=latin1Safe(text).split(/\s+/);const lines=[];let line='';for(const w of words){const test=line?`${line} ${w}`:w;if(test.length>max){if(line)lines.push(line);line=w}else line=test}if(line)lines.push(line);return lines;}
  function generatePdf(e){
    const W=595,H=842,margin=48; const pages=[]; let ops=[],y=H-54;
    const rgb={navy:'0.090 0.227 0.314',teal:'0.078 0.475 0.463',gold:'0.847 0.710 0.416',cream:'0.969 0.941 0.886',coral:'0.812 0.420 0.294',ink:'0.145 0.204 0.239',white:'1 1 1',muted:'0.420 0.470 0.500'};
    const rect=(x,yy,w,h,c)=>ops.push(`${rgb[c]} rg ${x} ${yy} ${w} ${h} re f`);
    const text=(str,x,yy,size=10,c='ink',font='F1')=>ops.push(`BT /${font} ${size} Tf ${rgb[c]} rg ${x} ${yy} Td (${pdfEscape(str)}) Tj ET`);
    const newPage=()=>{if(ops.length)pages.push(ops.join('\n'));ops=[];y=H-54;rect(0,H-120,W,120,'navy');text('LILATE · LESSON 4',margin,H-50,10,'gold','F2');text('Marie-Christine - Travel Rescue Mission',margin,H-78,20,'white','F2');text('Evaluation & Progress Report',margin,H-98,11,'white');y=H-150;};
    const ensure=(need=50)=>{if(y-need<55){pages.push(ops.join('\n'));ops=[];y=H-54;rect(0,H-48,W,48,'navy');text('Marie-Christine · Lesson 4 Progress',margin,H-30,10,'white','F2');y=H-78;}};
    const heading=str=>{ensure(40);rect(margin,y-5,W-margin*2,25,'cream');text(str,margin+10,y+2,12,'navy','F2');y-=36;};
    const paragraph=(str,c='ink')=>{for(const line of wrapText(str,86)){ensure(16);text(line,margin,y,10,c);y-=14}y-=5;};
    const metric=(label,obj)=>{ensure(42);rect(margin,y-24,W-margin*2,34,'cream');rect(margin,y-24,6,34,obj.score>=75?'teal':obj.score>=50?'gold':'coral');text(label,margin+16,y-2,10,'navy','F2');text(`${obj.score}%`,W-130,y-2,14,'navy','F2');text(`${obj.status} · ${obj.correct}/${obj.total} validated`,margin+16,y-17,8,'muted');y-=45;};
    newPage(); paragraph(`Generated: ${e.generated}`,'muted'); heading('Automatic results'); metric('Overall objective result',e.overall);metric('Grammar accuracy',e.grammar);metric('Question formation',e.questions);metric('Listening & reading comprehension',e.listening);metric('Reformulation & strategy',e.strategy);
    heading('Speaking & writing');paragraph(`Speaking: ${e.speakingStatus}`,'teal');paragraph(`Speaking comments: ${e.speakingComment}`);paragraph(`Writing: ${e.writingStatus}`,'teal');paragraph(`Writing comments: ${e.writingComment}`);
    heading('Lesson feedback');paragraph(`Usefulness: ${e.useful}/5   Clarity: ${e.clear}/5   Confidence: ${e.confidence}/5`);paragraph(`Comments: ${e.comments}`);
    heading('Personal progress notes');paragraph(`New words: ${e.vocabNotes}`);paragraph(`Proud sentence: ${e.proudSentence}`);paragraph(`Next speaking goal: ${e.nextGoal}`);
    if(ops.length)pages.push(ops.join('\n'));
    const objects=[]; const add=s=>{objects.push(s);return objects.length};
    const font1=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    const font2=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    const pageIds=[],contentIds=[];
    const pagesIdPlaceholder=objects.length+1; add('PAGES_PLACEHOLDER');
    pages.forEach(content=>{const cid=add(`<< /Length ${latin1Safe(content).length} >>\nstream\n${content}\nendstream`);contentIds.push(cid);const pid=add(`<< /Type /Page /Parent ${pagesIdPlaceholder} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> /Contents ${cid} 0 R >>`);pageIds.push(pid);});
    objects[pagesIdPlaceholder-1]=`<< /Type /Pages /Kids [${pageIds.map(id=>`${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;
    const catalog=add(`<< /Type /Catalog /Pages ${pagesIdPlaceholder} 0 R >>`);
    let pdf='%PDF-1.4\n%âãÏÓ\n'; const offsets=[0];
    objects.forEach((obj,i)=>{offsets[i+1]=pdf.length;pdf+=`${i+1} 0 obj\n${obj}\nendobj\n`;});
    const xref=pdf.length; pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;for(let i=1;i<=objects.length;i++)pdf+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;pdf+=`trailer\n<< /Size ${objects.length+1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;
    const bytes=new Uint8Array(pdf.length);for(let i=0;i<pdf.length;i++)bytes[i]=pdf.charCodeAt(i)&255;return new Blob([bytes],{type:'application/pdf'});
  }
  $('#downloadEvaluationPdf')?.addEventListener('click',()=>{downloadBlob(generatePdf(evaluationData()),'Marie-Christine-Lesson-4-Progress-Report.pdf');$('#evaluationMessage').textContent='✓ PDF report downloaded';});

  renderScenario(scenarios[0]);
})();
