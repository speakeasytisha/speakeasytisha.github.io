const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
let voices = [];
const STORAGE_KEY = 'eden_lesson_2_natural_delivery_v4';

const attentionScenarios = [
  {
    title: 'Audience asks for technical detail too early',
    prompt: 'Can you just explain the technical part again?',
    model: 'Of course. I will clarify the technical point, but first let me keep the focus on the decision we need today.',
    cue: '<span class="cue cue-calm">Calm</span> Of course. <span class="cue cue-pause">Pause</span> <span class="cue cue-firm">Firm</span> I will clarify the technical point, but first let me keep the focus on the decision we need today.',
    note: 'Accept the question first. Then guide the audience back to the decision. This avoids sounding defensive.'
  },
  {
    title: 'Management pushes for speed',
    prompt: 'We do not have time for additional validation.',
    model: 'I understand the schedule pressure. The key point is that this validation reduces a compliance risk before it becomes a programme issue.',
    cue: '<span class="cue cue-calm">Calm</span> I understand the schedule pressure. <span class="cue cue-pause">Pause</span> <span class="cue cue-firm">Firm</span> The key point is that this validation reduces a compliance risk before it becomes a programme issue.',
    note: 'Acknowledge the pressure, then return to risk reduction. Do not apologise for raising the issue.'
  },
  {
    title: 'Someone questions the severity',
    prompt: 'Is this really a safety issue?',
    model: 'At this stage, it is a compliance and assurance issue. The purpose of the validation is to confirm that there is no safety exposure before we move forward.',
    cue: '<span class="cue cue-calm">Calm</span> At this stage, it is a compliance and assurance issue. <span class="cue cue-slow">Slow down</span> The purpose of the validation is to confirm that there is no safety exposure before we move forward.',
    note: 'Do not overstate the risk. Stay precise: compliance and assurance first, safety exposure to be confirmed.'
  },
  {
    title: 'The discussion drifts into details',
    prompt: 'The conversation moves away from the decision and becomes too detailed.',
    model: 'Let me bring this back to the decision point. The question is whether we have enough evidence to move forward with confidence.',
    cue: '<span class="cue cue-energy">Energy up</span> Let me bring this back to the decision point. <span class="cue cue-pause">Pause</span> <span class="cue cue-firm">Firm</span> The question is whether we have enough evidence to move forward with confidence.',
    note: 'This sentence recovers attention without blaming anyone. It recentres the room on the decision.'
  },
  {
    title: 'A stakeholder interrupts before the conclusion',
    prompt: 'Can you finish? We need to move on.',
    model: 'Yes. My recommendation is to secure the validation before the next milestone because it reduces downstream risk and protects the decision path.',
    cue: '<span class="cue cue-firm">Firm</span> Yes. <span class="cue cue-pause">Pause</span> My recommendation is to secure the validation before the next milestone because it reduces downstream risk and protects the decision path.',
    note: 'When time is limited, go straight to recommendation and impact. Do not restart from the beginning.'
  }
];

const persuasionTopics = [
  ['Compliance evidence', 'Because the current evidence is not sufficient to close the compliance point with confidence, I recommend securing one additional validation step so that we protect traceability and decision quality.', 'calm'],
  ['Schedule pressure', 'Because the schedule is under pressure, I recommend clarifying the decision criteria now so that we avoid a more serious delay later in the programme.', 'firm'],
  ['Cross-team alignment', 'Because several teams are working on connected scopes, I recommend aligning the validation status today so that we avoid gaps between systems.', 'firm'],
  ['Customer expectations', 'Because the customer expectations are specific and demanding, I recommend confirming the compliance evidence before the review so that we protect customer confidence.', 'calm'],
  ['Decision confidence', 'Because this decision affects the next milestone, I recommend making the risk visible now so that management can decide with full clarity.', 'firm']
];

const missions = [
  {
    title: 'Mission A — Requirement interpretation gap',
    tags: ['Requirements', 'Customer alignment'],
    pressure: 'Limited time',
    situation: 'Two teams interpret a customer requirement differently. The difference is not blocking yet, but it could create rework later.',
    steps: ['Open with the decision point.', 'Explain the risk without over-detailing.', 'Recommend one alignment action.', 'Ask for a clear decision.'],
    model: 'The decision we need today is whether to organise a short requirement alignment before the next review. The reason this matters is that two teams are interpreting the customer requirement differently. The risk is not immediate failure, but rework and loss of confidence later in the programme. My recommendation is to align the interpretation now with the customer reference so that we protect compliance and avoid late corrections.',
    q: 'Can’t the teams just resolve this between themselves?',
    a: 'They can work on the technical detail, but we need one shared interpretation before the next milestone so that each team validates against the same expectation.'
  },
  {
    title: 'Mission B — Validation evidence not mature enough',
    tags: ['V&V', 'Evidence'],
    pressure: 'Senior management wants a quick go/no-go',
    situation: 'The validation evidence exists, but it is not mature enough to close the point with confidence.',
    steps: ['State the maturity issue.', 'Separate evidence from opinion.', 'Recommend a controlled next step.', 'Clarify the benefit.'],
    model: 'The key point today is evidence maturity. We do have validation evidence, but it is not strong enough yet to close the point with confidence. The risk is that we move forward based on incomplete assurance rather than confirmed compliance. My recommendation is to secure a focused evidence review before the go/no-go decision so that the decision is technically justified and easier to defend.',
    q: 'Are you saying we cannot move forward?',
    a: 'Not exactly. I am saying that the decision should be based on confirmed evidence, not on an assumption that the evidence will be sufficient later.'
  },
  {
    title: 'Mission C — Cross-team dependency',
    tags: ['Coordination', 'Interfaces'],
    pressure: 'Several teams involved',
    situation: 'The landing systems scope depends on inputs from another equipment team, and the dependency may affect the validation timeline.',
    steps: ['Make the dependency visible.', 'Explain the impact.', 'Avoid blaming another team.', 'Propose a coordination action.'],
    model: 'The main issue is a cross-team dependency that may affect the validation timeline. The landing systems scope depends on inputs from another equipment team, and the current timing creates a risk for the next milestone. This is not a question of responsibility; it is a coordination point. My recommendation is to align ownership and delivery dates today so that each team can validate its scope without creating a gap at system level.',
    q: 'Which team is responsible for the delay?',
    a: 'The immediate need is not to assign blame. The immediate need is to clarify ownership, dates and impact so that we can protect the validation path.'
  },
  {
    title: 'Mission D — Customer satisfaction vs compliance',
    tags: ['Customer', 'Compliance'],
    pressure: 'Customer relationship sensitivity',
    situation: 'A fast solution would satisfy the customer in the short term, but it could weaken compliance confidence.',
    steps: ['Acknowledge the customer need.', 'Protect the compliance message.', 'Recommend a balanced option.', 'Clarify the long-term value.'],
    model: 'I understand the customer expectation and the need to respond quickly. However, the key point is that customer satisfaction must remain aligned with compliance confidence. A fast solution may create short-term reassurance, but it could weaken the decision if the evidence is not complete. My recommendation is to propose a controlled response with clear validation conditions so that we protect both the customer relationship and the safety-critical standard of the programme.',
    q: 'Isn’t this too cautious?',
    a: 'I see the concern. In this context, caution is not a delay strategy; it is a way to keep the decision credible, compliant and defensible.'
  }
];

const vocab = [
  ['self', 'Project Leader', 'I am a Project Leader in the Validation and Verification team.'],
  ['self', 'Validation and Verification team', 'The Validation and Verification team ensures that the right activities are properly performed.'],
  ['self', 'landing systems', 'We work on landing systems for helicopter, aircraft and business jet projects.'],
  ['opening', 'Let me start with the key point.', 'Let me start with the key point: the decision today concerns validation risk.'],
  ['opening', 'The key issue today is…', 'The key issue today is evidence maturity before the next milestone.'],
  ['opening', 'Before going into the details…', 'Before going into the details, let me clarify the impact.'],
  ['attention', 'Let me bring this back to the decision point.', 'Let me bring this back to the decision point: do we have enough evidence to move forward?'],
  ['attention', 'The key point to remember is this.', 'The key point to remember is this: the validation step reduces downstream risk.'],
  ['attention', 'I will come back to that point.', 'I will come back to that point, but first I want to complete the risk picture.'],
  ['decision', 'My recommendation is…', 'My recommendation is to secure the validation now before the next milestone.'],
  ['decision', 'This would allow us to…', 'This would allow us to protect safety, traceability and customer confidence.'],
  ['decision', 'What I need from you today is…', 'What I need from you today is confirmation that we prioritise validation before moving forward.'],
  ['pressure', 'I understand the schedule pressure.', 'I understand the schedule pressure. My concern is the compliance risk.'],
  ['pressure', 'We could, but…', 'We could move forward, but it would increase downstream risk.'],
  ['pressure', 'At this stage…', 'At this stage, it is a compliance and assurance issue.'],
  ['delivery', 'Slow down', 'Slow down when the sentence contains risk, safety or compliance.'],
  ['delivery', 'Pause', 'Pause before the recommendation to make the decision point easier to hear.'],
  ['delivery', 'Firm', 'Use a firm voice when making the recommendation or asking for a decision.'],
  ['delivery', 'Calm', 'Use a calm voice when explaining risk or responding to pressure.']
];

const manualObjectives = [
  {
    id:'self',
    objective:'Deliver a clear self-presentation using the corrected structure',
    subject:'Self-presentation: Project Leader, V&V team, landing systems, executive communication',
    method:'Mise en situation orale / validation formatrice'
  },
  {
    id:'cues',
    objective:'Use speaking cues to support natural delivery',
    subject:'Pause, slow down, energy up, calm, firm, emphasis, eye contact',
    method:'Observation orale / exercices guidés'
  },
  {
    id:'cue',
    objective:'Use cue words to speak without memorising every sentence',
    subject:'Cue-word method and structured memory pathway',
    method:'Production orale avec puis sans notes'
  },
  {
    id:'short',
    objective:'Adapt the self-presentation to different time constraints',
    subject:'20-second, 45-second and 90-second versions',
    method:'Chronométrage oral / reformulation'
  },
  {
    id:'voice',
    objective:'Use tone, pauses, posture and energy intentionally',
    subject:'Executive presence, rhythm, voice control and physical positioning',
    method:'Observation orale / enregistrement / feedback'
  },
  {
    id:'opening',
    objective:'Create a high-impact opening for a professional situation',
    subject:'Opening sentence, key point, risk framing, decision framing',
    method:'Exercice oral / modèle + reformulation'
  },
  {
    id:'attention',
    objective:'Recover attention or respond to interruptions calmly',
    subject:'Attention recovery, redirection, pressure management',
    method:'Jeu de rôle / mise en situation'
  },
  {
    id:'persuasion',
    objective:'Convince without over-explaining',
    subject:'Because / I recommend / so that decision logic',
    method:'Production orale guidée / formulation de recommandation'
  },
  {
    id:'mission',
    objective:'Deliver a short senior-management update with a recommendation',
    subject:'Senior management practice: V&V, compliance, evidence, customer expectations',
    method:'Simulation professionnelle orale'
  },
  {
    id:'cloe',
    objective:'Answer CLOE-style professional questions clearly',
    subject:'Professional presentation, interaction, discussion and role-play transfer',
    method:'Simulation orale type CLOE'
  }
];

function populateVoices(){
  if(!('speechSynthesis' in window)) return;
  voices = speechSynthesis.getVoices ? speechSynthesis.getVoices() : [];
  const accent = $('#accentSelect').value;
  const filtered = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(accent.toLowerCase()));
  const list = filtered.length ? filtered : voices;
  $('#voiceSelect').innerHTML = list.map(v=>`<option value="${voices.indexOf(v)}">${v.name} (${v.lang})</option>`).join('') || '<option value="">Default voice</option>';
}
function getVoice(){const idx=Number($('#voiceSelect').value);return voices[idx]||null;}
function styleSettings(style){
  const base={rate:0.9,pitch:1,volume:1};
  if(style==='energetic') return {rate:1.02,pitch:1.08,volume:1};
  if(style==='fast') return {rate:1.22,pitch:1.02,volume:1};
  if(style==='calm') return {rate:0.76,pitch:0.92,volume:1};
  if(style==='firm') return {rate:0.84,pitch:0.94,volume:1};
  if(style==='paused') return {rate:0.72,pitch:0.95,volume:1};
  return base;
}
function applyPauses(text,style){
  const clean=String(text).replace(/<[^>]*>/g,' ');
  if(style!=='paused') return clean;
  return clean.replace(/\. /g,'. ... ').replace(/, /g,', ... ').replace(/ easy to understand, easy to trust and easy to act on/g,' easy to understand ... easy to trust ... and easy to act on');
}
function speakText(text,style='natural'){
  if(!('speechSynthesis' in window)){ alert('Audio is not available in this browser.'); return; }
  try{ speechSynthesis.cancel(); speechSynthesis.resume(); }catch(e){}
  const u=new SpeechSynthesisUtterance(applyPauses(text,style));
  u.lang=$('#accentSelect')?.value || 'en-GB';
  const v=getVoice(); if(v) u.voice=v;
  const s=styleSettings(style); u.rate=s.rate; u.pitch=s.pitch; u.volume=s.volume;
  u.onerror=()=>console.warn('Speech synthesis error. Try another voice or refresh voices.');
  setTimeout(()=>speechSynthesis.speak(u),60);
}
function textFromId(id){ const el=$('#'+id); return el ? el.textContent.trim() : ''; }
function copyText(text){navigator.clipboard?.writeText(text).then(()=>alert('Copied.')).catch(()=>{const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();alert('Copied.');});}
function downloadText(name,text){const blob=new Blob([text],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function safe(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}


function cueHighlight(text){
  let h=safe(text);
  const rules=[
    [/(The decision we need today|The decision|decision point|What I need from you today)/g,'word-firm'],
    [/(Let me start with the key point|The key point|The main issue|key issue)/g,'word-energy'],
    [/(risk|compliance|assurance|evidence|safety|safety exposure|customer confidence|traceability)/gi,'word-calm'],
    [/(validation|verification|landing systems|requirements|milestone|programme)/gi,'word-emphasis'],
    [/(My recommendation is|I recommend|recommendation)/g,'word-firm'],
    [/(easy to understand|easy to trust|easy to act on|with confidence|full clarity)/g,'word-slow']
  ];
  rules.forEach(([re,cls])=>{h=h.replace(re,m=>`<span class="${cls}">${m}</span>`)});
  return h;
}
function cuePersuasionLine(text){
  let h=cueHighlight(text);
  h=h.replace(/^<span class="word-calm">Because<\/span>|^Because/, '<span class="cue cue-calm">Because</span>');
  h=h.replace(/I recommend/g, '<span class="cue cue-firm">I recommend</span>');
  h=h.replace(/so that/g, '<span class="cue cue-pause">so that</span>');
  return h;
}
function cueMissionModel(text){
  const sentences = safe(text).split(/\.\s+/).filter(Boolean);
  return sentences.map((s,i)=>{
    const clean=s.replace(/\.$/,'');
    let tag=i===0?'<span class="cue cue-energy">Open</span>':(clean.toLowerCase().includes('recommend')?'<span class="cue cue-firm">Recommend</span>':(clean.toLowerCase().includes('risk')?'<span class="cue cue-calm">Risk</span>':'<span class="cue cue-slow">Explain</span>'));
    return `<p class="cue-model-line">${tag} ${cueHighlight(clean)}${i<sentences.length-1?' <span class="cue cue-pause">Pause</span>':''}</p>`;
  }).join('');
}
function cueMiniKey(){
  return `<div class="cue-mini-key in-card"><span class="cue cue-pause">Pause</span><span class="cue cue-slow">Slow down</span><span class="cue cue-energy">Energy up</span><span class="cue cue-calm">Calm</span><span class="cue cue-firm">Firm</span><span class="cue cue-emphasis">Emphasise</span></div>`;
}

function renderAttention(){
  $('#attentionCards').innerHTML=attentionScenarios.map((s,i)=>`
    <article class="question-card">
      <h3>${safe(s.title)}</h3>
      ${cueMiniKey()}
      <p class="prompt">${safe(s.prompt)}</p>
      <button data-speak-text="${encodeURIComponent(s.prompt)}" data-style="natural">Listen to prompt</button>
      <button class="secondary" data-toggle="#attModel${i}">Show model answer</button>
      <button class="secondary" data-toggle="#attCue${i}">Show colour-coded cues</button>
      <button class="secondary" data-toggle="#attNote${i}">Show note</button>
      <div id="attModel${i}" class="model-block hidden"><div class="cue-model-line"><strong>Model:</strong> ${cueHighlight(s.model)}</div><div class="model-actions"><button data-speak-text="${encodeURIComponent(s.model)}" data-style="firm">Listen to model</button></div></div>
      <div id="attCue${i}" class="cue-script hidden">${s.cue}</div>
      <div id="attNote${i}" class="note-box hidden">${safe(s.note)}</div>
      <div class="recorder small" data-recorder="attention-${i}"><h4>Record your response</h4><p class="rec-status"><span class="recording-light"></span>Ready</p><div class="rec-controls"><button class="startRec">Start</button><button class="stopRec secondary" disabled>Stop</button><a class="downloadRec hidden" download="eden-attention-${i+1}.webm">Download</a></div><audio controls class="playback hidden"></audio></div>
    </article>`).join('');
}
function renderPersuasion(){
  $('#persuasionCards').innerHTML=persuasionTopics.map((p,i)=>`
    <article class="model-card">
      <h3>${safe(p[0])}</h3>
      ${cueMiniKey()}
      <p>Complete the structure orally: <strong>Because… I recommend… so that…</strong></p>
      <button class="secondary" data-toggle="#persModel${i}">Show model</button>
      <div id="persModel${i}" class="mini-model hidden"><p class="cue-model-line">${cuePersuasionLine(p[1])}</p><div class="model-actions"><button data-speak-text="${encodeURIComponent(p[1])}" data-style="${p[2]}">Listen</button></div></div>
      <div class="recorder small" data-recorder="persuasion-${i}"><h4>Record this structure</h4><p class="rec-status"><span class="recording-light"></span>Ready</p><div class="rec-controls"><button class="startRec">Start</button><button class="stopRec secondary" disabled>Stop</button><a class="downloadRec hidden" download="eden-persuasion-${i+1}.webm">Download</a></div><audio controls class="playback hidden"></audio></div>
    </article>`).join('');
}
function renderMissions(){
  $('#missionGrid').innerHTML=missions.map((m,i)=>`
    <article class="mission-card">
      <h3>${safe(m.title)}</h3>
      ${cueMiniKey()}
      <div class="mission-meta">${m.tags.map(t=>`<span class="pill">${safe(t)}</span>`).join('')}<span class="pill pressure">${safe(m.pressure)}</span></div>
      <p><strong>Situation:</strong> ${safe(m.situation)}</p>
      <ol class="mission-steps">${m.steps.map(s=>`<li>${safe(s)}</li>`).join('')}</ol>
      <button class="secondary" data-toggle="#missionModel${i}">Show model update</button>
      <button class="secondary" data-toggle="#missionQuestion${i}">Show pressure question</button>
      <div id="missionModel${i}" class="model-block hidden">${cueMissionModel(m.model)}<div class="model-actions"><button data-speak-text="${encodeURIComponent(m.model)}" data-style="paused">Listen to model</button></div></div>
      <div id="missionQuestion${i}" class="model-block hidden"><div class="cue-model-line"><strong>Question:</strong> ${cueHighlight(m.q)}</div><div class="cue-model-line"><strong>Model answer:</strong> ${cueHighlight(m.a)}</div><div class="model-actions"><button data-speak-text="${encodeURIComponent(m.q)}" data-style="natural">Listen to question</button><button data-speak-text="${encodeURIComponent(m.a)}" data-style="firm">Listen to answer</button></div></div>
      <div class="recorder" data-recorder="mission-${i}"><h4>Record your mission response</h4><p class="rec-status"><span class="recording-light"></span>Ready</p><div class="rec-controls"><button class="startRec">Start recording</button><button class="stopRec secondary" disabled>Stop</button><a class="downloadRec hidden" download="eden-mission-${i+1}.webm">Download recording</a></div><audio controls class="playback hidden"></audio></div>
    </article>`).join('');
}
function renderVocab(){
  const f=$('#vocabFilter').value;
  const rows=vocab.filter(v=>f==='all'||v[0]===f);
  $('#vocabGrid').innerHTML=rows.map(v=>`
    <article class="vocab-card">
      <span class="tag">${safe(v[0])}</span>
      <h3>${safe(v[1])}</h3>
      <p class="sentence">${safe(v[2])}</p>
      <div class="audio-row">
        <button data-speak-text="${encodeURIComponent(v[1])}" data-style="natural">Listen to phrase</button>
        <button data-speak-text="${encodeURIComponent(v[2])}" data-style="natural">Listen to sentence</button>
      </div>
    </article>`).join('');
}

function initRecorders(){
  $$('.recorder').forEach(box=>{
    let mediaRecorder=null, chunks=[];
    const start=$('.startRec',box), stop=$('.stopRec',box), status=$('.rec-status',box), audio=$('.playback',box), link=$('.downloadRec',box);
    if(!start||!stop) return;
    start.addEventListener('click', async()=>{
      try{
        const stream=await navigator.mediaDevices.getUserMedia({audio:true});
        chunks=[]; mediaRecorder=new MediaRecorder(stream);
        mediaRecorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
        mediaRecorder.onstop=()=>{const blob=new Blob(chunks,{type:'audio/webm'}); const url=URL.createObjectURL(blob); audio.src=url; audio.classList.remove('hidden'); link.href=url; link.classList.remove('hidden'); box.classList.remove('recording'); status.innerHTML='<span class="recording-light"></span>Recording saved. You can listen or download it.'; stream.getTracks().forEach(t=>t.stop());};
        mediaRecorder.start(); box.classList.add('recording'); status.innerHTML='<span class="recording-light"></span>Recording…'; start.disabled=true; stop.disabled=false;
      }catch(e){alert('Microphone access was not allowed or is not available in this browser.');}
    });
    stop.addEventListener('click',()=>{if(mediaRecorder&&mediaRecorder.state!=='inactive')mediaRecorder.stop(); start.disabled=false; stop.disabled=true;});
  });
}

function collectCheckpoints(){
  return $$('.checkpoint').map(box=>{
    const id=box.dataset.section;
    const done=$('[data-field="done"]',box)?.checked||false;
    const version=$('[data-field="version"]',box)?.value||'';
    const notes=$('[data-field="notes"]',box)?.value||'';
    return {id,done,version,notes};
  });
}
function checkpointsText(){
  return collectCheckpoints().map(c=>`Section: ${c.id}\nCompleted: ${c.done?'Yes':'No'}\nVersion / answer:\n${c.version||'—'}\nNotes:\n${c.notes||'—'}`).join('\n\n---\n\n');
}
function saveCheckpoints(){localStorage.setItem(STORAGE_KEY+'_checkpoints', JSON.stringify(collectCheckpoints()));}
function loadCheckpoints(){
  try{
    const data=JSON.parse(localStorage.getItem(STORAGE_KEY+'_checkpoints')||'[]');
    data.forEach(c=>{const box=$(`.checkpoint[data-section="${c.id}"]`); if(!box)return; const done=$('[data-field="done"]',box), version=$('[data-field="version"]',box), notes=$('[data-field="notes"]',box); if(done)done.checked=!!c.done; if(version)version.value=c.version||''; if(notes)notes.value=c.notes||'';});
  }catch(e){}
}
function initCheckpoints(){
  loadCheckpoints();
  $$('.checkpoint input,.checkpoint textarea').forEach(el=>el.addEventListener('input',saveCheckpoints));
  $$('.checkpoint input[type="checkbox"]').forEach(el=>el.addEventListener('change',saveCheckpoints));
  $('#copyCheckpoints')?.addEventListener('click',()=>copyText(checkpointsText()));
  $('#downloadCheckpoints')?.addEventListener('click',()=>downloadText('eden-lesson-2-section-notes.txt', checkpointsText()));
}

function renderEvaluationRows(){
  const rows = $('#evaluationRows');
  if(!rows) return;
  rows.innerHTML = manualObjectives.map(o=>`
    <tr>
      <td>${safe(o.objective)}</td>
      <td>${safe(o.subject)}</td>
      <td>${safe(o.method)}</td>
      <td>
        <select data-status="${o.id}" aria-label="Status for ${safe(o.objective)}">
          <option value="not-started">Non commencé</option>
          <option value="progress">En cours d’acquisition</option>
          <option value="achieved">Objectif atteint</option>
          <option value="not-achieved">Objectif non atteint</option>
        </select>
      </td>
      <td><span id="result-${o.id}" class="status not-started">Non commencé</span></td>
      <td><textarea data-comment="${o.id}" rows="3" placeholder="Commentaire, exemple observé, point à retravailler..."></textarea></td>
    </tr>`).join('');
}
function statusLabel(s){return {'achieved':'Objectif atteint','progress':'En cours d’acquisition','not-achieved':'Objectif non atteint','not-started':'Non commencé'}[s]||s;}
function statusClass(s){return s||'not-started';}
function collectProgress(){
  const statuses={}; $$('[data-status]').forEach(sel=>statuses[sel.dataset.status]=sel.value);
  const objectiveComments={}; $$('[data-comment]').forEach(t=>objectiveComments[t.dataset.comment]=t.value);
  return {
    learner:$('#learnerName')?.value || 'Eden Cohen',
    trainer:$('#trainerName')?.value || 'Tisha DOUTY-DOSIERE',
    date:$('#evaluationDate')?.value || '',
    comments:$('#trainerComments')?.value || '',
    statuses,
    objectiveComments,
    lastSaved:new Date().toISOString()
  };
}
function applyProgressState(p){
  if(!p) return;
  if($('#learnerName')) $('#learnerName').value=p.learner||'Eden Cohen';
  if($('#trainerName')) $('#trainerName').value=p.trainer||'Tisha DOUTY-DOSIERE';
  if($('#evaluationDate')) $('#evaluationDate').value=p.date||new Date().toISOString().slice(0,10);
  if($('#trainerComments')) $('#trainerComments').value=p.comments||'';
  Object.entries(p.statuses||{}).forEach(([k,v])=>{const sel=$(`[data-status="${k}"]`); if(sel) sel.value=v;});
  Object.entries(p.objectiveComments||{}).forEach(([k,v])=>{const t=$(`[data-comment="${k}"]`); if(t) t.value=v;});
  if(p.lastSaved && $('#lastSaved')) $('#lastSaved').textContent=new Date(p.lastSaved).toLocaleString();
}
function saveProgress(show=false){
  const p=collectProgress();
  localStorage.setItem(STORAGE_KEY,JSON.stringify(p));
  if($('#lastSaved')) $('#lastSaved').textContent=new Date(p.lastSaved).toLocaleString();
  updateOverall();
  if(show) alert('Progress saved.');
}
function loadProgress(){
  try{applyProgressState(JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'));}catch(e){console.warn('Could not load progress',e);}
}
function updateOverall(){
  const statuses=$$('[data-status]').map(s=>s.value);
  statuses.forEach((value,i)=>{
    const id=manualObjectives[i]?.id;
    const badge=$(`#result-${id}`);
    if(badge){badge.textContent=statusLabel(value); badge.className='status '+statusClass(value);}
  });
  const started=statuses.filter(s=>s!=='not-started').length;
  const completion=Math.round((started/(statuses.length||1))*100)||0;
  if($('#completionRate')) $('#completionRate').textContent=completion+'%';
  let overall='not-started';
  if(started>0){
    overall=statuses.every(s=>s==='achieved')?'achieved':statuses.some(s=>s==='not-achieved')?'not-achieved':'progress';
  }
  const os=$('#overallStatus');
  if(os){os.textContent=statusLabel(overall); os.className='status '+statusClass(overall);}
}
function reportRows(){
  const p=collectProgress();
  return manualObjectives.map(o=>[
    o.objective,
    o.subject,
    o.method,
    'Validation formatrice',
    statusLabel(p.statuses[o.id]||'not-started'),
    p.objectiveComments[o.id]||''
  ]);
}
function reportText(){
  updateOverall();
  const p=collectProgress();
  const lines=[
    'Bilan d’évaluation des acquis - Qualiopi',
    'Eden Cohen — Lesson 2: Natural Executive Delivery Under Pressure',
    `Apprenante: ${p.learner}`,
    `Formatrice: ${p.trainer}`,
    `Date: ${p.date}`,
    `Completion: ${$('#completionRate')?.textContent||'0%'}`,
    `Résultat global: ${$('#overallStatus')?.textContent||'Non commencé'}`,
    '',
    'Objectifs pédagogiques:'
  ];
  reportRows().forEach((r,i)=>{
    lines.push('', `${i+1}. ${r[0]}`, `Support / sujet: ${r[1]}`, `Mode d’évaluation: ${r[2]}`, `Score / validation: ${r[3]}`, `Résultat: ${r[4]}`, `Commentaires: ${r[5]||'—'}`);
  });
  lines.push('', 'Observations générales de la formatrice:', p.comments||'—', '', 'Notes de section:', checkpointsText());
  return lines.join('\n');
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function safeFileName(s){return String(s||'report').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'')||'report';}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500);}
function buildReportHTML(){
  updateOverall();
  const p=collectProgress();
  const rows=reportRows().map(r=>`<tr>${r.map(c=>`<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('');
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Bilan Qualiopi - ${escapeHtml(p.learner)}</title><style>body{font-family:Arial,sans-serif;color:#222;max-width:1100px;margin:35px auto;padding:0 24px}h1{color:#0b1f3a}h2{color:#1c5f9f}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #aaa;padding:8px;vertical-align:top}th{background:#eee}.meta{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:18px 0}.box{border:1px solid #bbb;padding:10px;border-radius:8px}.comments{white-space:pre-wrap;min-height:70px}@media print{body{margin:0;max-width:none}}</style></head><body><h1>Bilan d'évaluation des acquis - Qualiopi</h1><h2>Eden Cohen Lesson 2 - Natural Executive Delivery Under Pressure</h2><div class="meta"><div class="box"><b>Apprenante:</b> ${escapeHtml(p.learner)}</div><div class="box"><b>Formatrice:</b> ${escapeHtml(p.trainer)}</div><div class="box"><b>Date:</b> ${escapeHtml(p.date)}</div><div class="box"><b>Completion:</b> ${escapeHtml($('#completionRate')?.textContent||'0%')}</div><div class="box"><b>Résultat global:</b> ${escapeHtml($('#overallStatus')?.textContent||'Non commencé')}</div></div><table><thead><tr><th>Objectif pédagogique</th><th>Support / sujet</th><th>Mode d'évaluation</th><th>Score / validation</th><th>Résultat</th><th>Commentaires</th></tr></thead><tbody>${rows}</tbody></table><h2>Observations générales de la formatrice</h2><div class="box comments">${escapeHtml(p.comments)||'Aucune observation saisie.'}</div><h2>Notes de section</h2><div class="box comments">${escapeHtml(checkpointsText())}</div><p><small>Rapport généré depuis la page interactive. Les résultats sont aussi sauvegardés dans le navigateur utilisé.</small></p></body></html>`;
}
function downloadReadableHTML(){saveProgress(false);downloadBlob(new Blob([buildReportHTML()],{type:'text/html;charset=utf-8'}),`${safeFileName($('#learnerName')?.value||'Eden-Cohen')}-Lesson-2-Bilan-Qualiopi.html`);}
function latinText(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—]/g,'-').replace(/[^\x20-\x7E]/g,'');}
function pdfEscape(s){return latinText(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
function wrapText(text,max=90){const words=latinText(text).split(/\s+/);const lines=[];let line='';for(const w of words){if(!w)continue;const next=line?line+' '+w:w;if(next.length>max&&line){lines.push(line);line=w}else line=next}if(line)lines.push(line);return lines.length?lines:[''];}
function buildSimplePDF(){
  const p=collectProgress(); updateOverall();
  const pageW=595,pageH=842,left=42,top=800,bottom=45,lineH=14; let pages=[[]],y=top;
  function addLine(text,size=10,bold=false){const wrapped=wrapText(text,size>=14?68:92);for(const ln of wrapped){if(y<bottom){pages.push([]);y=top}pages[pages.length-1].push({text:ln,x:left,y,size,bold});y-=size>=14?20:lineH}}
  function gap(n=8){y-=n}
  addLine('BILAN D EVALUATION DES ACQUIS - QUALIOPI',17,true);
  addLine('Eden Cohen Lesson 2 - Natural Executive Delivery Under Pressure',12,true); gap();
  addLine(`Apprenante: ${p.learner}`); addLine(`Formatrice: ${p.trainer}`); addLine(`Date: ${p.date}`); addLine(`Completion: ${$('#completionRate')?.textContent||'0%'} | Resultat global: ${$('#overallStatus')?.textContent||'Non commence'}`); gap(12);
  reportRows().forEach((r,i)=>{addLine(`${i+1}. Objectif: ${r[0]}`,11,true); addLine(`Support / sujet: ${r[1]}`); addLine(`Mode d evaluation: ${r[2]}`); addLine(`Validation: ${r[3]} | Resultat: ${r[4]}`); if(r[5]) addLine(`Commentaires: ${r[5]}`); gap(7);});
  addLine('Observations generales de la formatrice',12,true); addLine(p.comments||'Aucune observation saisie.');
  const objs=[];function obj(body){objs.push(body);return objs.length}
  const font1=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const font2=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  const pageRefs=[],contentRefs=[];
  for(const lines of pages){let stream='';for(const l of lines){stream+=`BT /${l.bold?'F2':'F1'} ${l.size} Tf 1 0 0 1 ${l.x} ${l.y} Tm (${pdfEscape(l.text)}) Tj ET\n`;}contentRefs.push(obj(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`));pageRefs.push(obj('PLACEHOLDER'));}
  const pagesRef=obj('PLACEHOLDER_PAGES');
  pageRefs.forEach((ref,i)=>{objs[ref-1]=`<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> /Contents ${contentRefs[i]} 0 R >>`;});
  objs[pagesRef-1]=`<< /Type /Pages /Kids [${pageRefs.map(r=>r+' 0 R').join(' ')}] /Count ${pageRefs.length} >>`;
  const catalog=obj(`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`);
  let out='%PDF-1.4\n%PDFREPORT\n',offsets=[0];for(let i=0;i<objs.length;i++){offsets.push(out.length);out+=`${i+1} 0 obj\n${objs[i]}\nendobj\n`;}const xref=out.length;out+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`;for(let i=1;i<offsets.length;i++)out+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';out+=`trailer\n<< /Size ${objs.length+1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([new TextEncoder().encode(out)],{type:'application/pdf'});
}
function downloadPDFReport(){saveProgress(false);downloadBlob(buildSimplePDF(),`${safeFileName($('#learnerName')?.value||'Eden-Cohen')}-Lesson-2-Bilan-Qualiopi.pdf`);}
function initProgress(){
  renderEvaluationRows();
  if($('#evaluationDate')&&!$('#evaluationDate').value) $('#evaluationDate').value=new Date().toISOString().slice(0,10);
  loadProgress(); updateOverall();
  $$('[data-status],[data-comment],#learnerName,#trainerName,#evaluationDate,#trainerComments').forEach(el=>el.addEventListener('input',()=>saveProgress(false)));
  $$('[data-status]').forEach(el=>el.addEventListener('change',()=>saveProgress(false)));
  $('#saveProgress').onclick=()=>saveProgress(true);
  $('#copyReport').onclick=()=>{const r=reportText(); $('#reportPreview').textContent=r; copyText(r);};
  $('#downloadHtml').onclick=downloadReadableHTML;
  $('#downloadPdf').onclick=downloadPDFReport;
  $('#printReport').onclick=()=>{saveProgress(false); window.print();};
  $('#resetProgress').onclick=()=>{if(confirm('Reset saved progress for this lesson?')){localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(STORAGE_KEY+'_checkpoints');location.reload();}};
}
function surveyText(){
  return `Eden Cohen — Lesson 2 feedback\nSelf-presentation usefulness: ${$('#surveySelf').value}\nCue-word method: ${$('#surveyCue').value}\nVoice and energy work: ${$('#surveyVoice').value}\nSenior management practice: ${$('#surveyMission').value}\n\nComments:\n${$('#surveyComments').value||'—'}`;
}
function initSurvey(){
  const update=()=>{$('#surveyPreview').textContent=surveyText();};
  ['#surveySelf','#surveyCue','#surveyVoice','#surveyMission','#surveyComments'].forEach(s=>$(s).addEventListener('input',update));
  $('#copySurvey').onclick=()=>copyText(surveyText());
  $('#downloadSurvey').onclick=()=>downloadText('eden-lesson-2-feedback.txt', surveyText());
  update();
}
function bindCommon(){
  document.addEventListener('click',e=>{
    const speakBtn=e.target.closest('[data-speak-text],[data-speak-id]');
    if(speakBtn){const text=speakBtn.dataset.speakText?decodeURIComponent(speakBtn.dataset.speakText):textFromId(speakBtn.dataset.speakId); speakText(text,speakBtn.dataset.style||'natural'); return;}
    const copyBtn=e.target.closest('[data-copy-id]');
    if(copyBtn){copyText(textFromId(copyBtn.dataset.copyId)); return;}
    const toggle=e.target.closest('[data-toggle]');
    if(toggle){$(toggle.dataset.toggle)?.classList.toggle('hidden'); return;}
    const scroll=e.target.closest('[data-scroll]');
    if(scroll){$(scroll.dataset.scroll)?.scrollIntoView({behavior:'smooth'}); return;}
  });
  $('#toggleFrench').onclick=()=>{document.body.classList.toggle('all-french'); $('#toggleFrench').textContent=document.body.classList.contains('all-french')?'Hide French support':'Show French support';};
  $('#toggleModels').onclick=()=>{document.body.classList.toggle('all-models'); $('#toggleModels').textContent=document.body.classList.contains('all-models')?'Hide all models':'Show all models';};
  $('#stopAudio').onclick=()=>speechSynthesis?.cancel();
  $('#audioTest').onclick=()=>speakText('Audio test. If you can hear this sentence, the listen buttons are working on this device.', 'natural');
  $('#refreshVoices').onclick=populateVoices;
  $('#accentSelect').onchange=populateVoices;
  $('#vocabFilter').onchange=renderVocab;
}
function init(){
  if('speechSynthesis' in window){populateVoices(); window.speechSynthesis.onvoiceschanged=populateVoices; setTimeout(populateVoices,600);}
  renderAttention(); renderPersuasion(); renderMissions(); renderVocab();
  bindCommon(); initRecorders(); initCheckpoints(); initProgress(); initSurvey();
}
document.addEventListener('DOMContentLoaded', init);
