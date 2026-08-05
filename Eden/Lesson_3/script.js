const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
let voices = [];
const STORAGE_KEY = 'eden_lesson_3_executive_briefing_srird_v1';

const transformations = [
  {
    title:'Validation evidence before a milestone',
    situation:'The validation evidence for a landing-system component is incomplete before the next milestone.',
    technical:'We have reviewed the current validation status, and some evidence is available, but several points still need clarification before we can fully close the requirement. The teams are aligned on the general direction, but the maturity level of the evidence is not sufficient yet to confirm compliance with full confidence.',
    executive:'The key point is evidence maturity. We have some validation evidence, but not enough to close the compliance point with confidence. My recommendation is to secure one focused review before the next milestone so that the decision is technically justified and easier to defend.',
    cue:'<span class="cue cue-energy">Open</span> The key point is evidence maturity. <span class="cue cue-pause">Pause</span> <span class="cue cue-calm">Calm</span> We have some validation evidence, but not enough to close the compliance point with confidence. <span class="cue cue-firm">Firm</span> My recommendation is to secure one focused review before the next milestone.'
  },
  {
    title:'Brainstorming output from the new project',
    situation:'The team has generated several possible directions, but the ideas are not yet organised for management.',
    technical:'During the brainstorming session, different engineers proposed several possible approaches. Some options appear technically interesting, but we need to clarify feasibility, validation effort, interface constraints, compliance implications and impact on the project timeline before we can define the strongest direction.',
    executive:'The brainstorming session produced several promising directions. The next step is to organise them into clear decision criteria so that we can compare feasibility, validation effort and project impact before recommending the strongest option.',
    cue:'<span class="cue cue-energy">Energy up</span> The brainstorming session produced several promising directions. <span class="cue cue-slow">Slow down</span> The next step is to organise them into clear decision criteria. <span class="cue cue-firm">Firm</span> Then we can recommend the strongest option.'
  },
  {
    title:'Requirement interpretation gap',
    situation:'Two teams interpret a customer requirement differently.',
    technical:'The teams are not necessarily in disagreement, but their interpretation of the requirement is not fully aligned. This could affect the way they validate their respective scopes, especially if the interpretation is not clarified before the next review.',
    executive:'The issue is not a technical disagreement yet. It is an alignment risk. My recommendation is to confirm one shared interpretation before the next review so that each team validates against the same expectation.',
    cue:'<span class="cue cue-calm">Calm</span> The issue is not a technical disagreement yet. It is an alignment risk. <span class="cue cue-firm">Firm</span> My recommendation is to confirm one shared interpretation before the next review.'
  }
];

const signposts = [
  ['Separate technical and decision points','Let me separate the technical point from the decision point.','Use this when the discussion is becoming too detailed.'],
  ['Refocus on confidence','The key issue is not the amount of work. It is the level of confidence we need before moving forward.','Use this when people focus only on effort or time.'],
  ['Protect detail for Q&A','I can give the detail if needed, but the main message is this.','Use this when you need to stay concise.'],
  ['Management perspective','From a management perspective, the impact is the decision path and the next milestone.','Use this when shifting from engineering detail to strategic impact.'],
  ['Decision needed','The decision we need today is whether we can move forward with the current evidence or secure one additional validation step first.','Use this when the group needs a clear action.']
];

const details = [
  {
    title:'Someone asks for technical detail too early',
    prompt:'Can you explain the technical part first?',
    model:'Of course. I can give more technical detail. The essential point for today’s decision is that the current evidence does not yet allow us to close the compliance point with full confidence.',
    cue:'<span class="cue cue-calm">Calm</span> Of course. I can give more technical detail. <span class="cue cue-pause">Pause</span> <span class="cue cue-firm">Firm</span> The essential point for today’s decision is that the current evidence does not yet allow us to close the compliance point with full confidence.'
  },
  {
    title:'Someone wants every idea from the brainstorming session',
    prompt:'Can you present all the ideas one by one?',
    model:'I can provide the full list if needed. For this briefing, I suggest grouping the ideas into three main themes so that we can compare them more effectively.',
    cue:'<span class="cue cue-calm">Calm</span> I can provide the full list if needed. <span class="cue cue-pause">Pause</span> <span class="cue cue-firm">Firm</span> For this briefing, I suggest grouping the ideas into three main themes.'
  },
  {
    title:'Management asks if the issue is blocking',
    prompt:'Is this really blocking?',
    model:'Not necessarily. The issue is not that the project must stop. The issue is that the decision should be based on confirmed evidence, not on an assumption that the evidence will be sufficient later.',
    cue:'<span class="cue cue-calm">Calm</span> Not necessarily. <span class="cue cue-slow">Slow down</span> The issue is not that the project must stop. <span class="cue cue-firm">Firm</span> The decision should be based on confirmed evidence.'
  },
  {
    title:'Schedule pressure appears',
    prompt:'We do not have time for another review.',
    model:'I understand the schedule pressure. The reason I recommend a focused review is that a short clarification now could prevent a more serious delay later in the programme.',
    cue:'<span class="cue cue-calm">Calm</span> I understand the schedule pressure. <span class="cue cue-pause">Pause</span> <span class="cue cue-firm">Firm</span> A short clarification now could prevent a more serious delay later.'
  }
];

const missions = [
  {
    title:'Mission A — Validation issue before milestone',
    tags:['V&V','Milestone','Evidence'],
    scenario:'The teams have made progress, but one compliance point is not fully closed. Management is under schedule pressure and wants to know whether the project can move forward.',
    structure:['Situation: the validation evidence is not mature enough yet.','Risk: moving forward could weaken the compliance position.','Impact: rework, delay or a less defensible decision path.','Recommendation: organise a focused evidence review.','Decision: confirm whether validation is prioritised before the next milestone.'],
    model:'The situation is that the validation evidence is not mature enough to close the point with confidence before the next milestone. The risk is that we move forward before the compliance position is fully secured. The impact could be rework, delay or a weaker decision path later in the programme. My recommendation is to organise a focused evidence review before the next milestone. What I need today is confirmation that we prioritise this validation step before moving forward.',
    question:'Can we move forward anyway?',
    answer:'We could, but the decision would be based on an assumption rather than confirmed evidence. My recommendation is to secure the evidence first because it protects the decision path.'
  },
  {
    title:'Mission B — Brainstorming output for new project',
    tags:['New project','Collective intelligence','Decision criteria'],
    scenario:'A brainstorming session with several engineers created many promising ideas. Management now needs to understand what came out of it and what the next step should be.',
    structure:['Situation: the session generated several promising directions.','Risk: without structure, the ideas remain too broad.','Impact: management cannot compare options confidently.','Recommendation: organise the outcomes into decision criteria.','Decision: align on the criteria before selecting the strongest option.'],
    model:'The situation is that we recently held a brainstorming session with several engineers to explore possible directions for the new project. The risk is that the ideas remain too broad if we do not organise them into clear themes and decision criteria. The impact could be a lack of alignment on feasibility, validation effort and project priorities. My recommendation is to structure the outcomes around decision criteria such as reliability, compliance confidence, validation effort and timeline. What I need now is alignment on the criteria we will use to evaluate the most promising option.',
    question:'Why not choose the most exciting idea now?',
    answer:'The most exciting idea may not be the strongest decision. We need to compare the options against clear criteria before selecting the direction we can defend.'
  },
  {
    title:'Mission C — Requirement interpretation gap',
    tags:['Requirements','Alignment','Customer expectations'],
    scenario:'Two teams interpret a customer requirement differently. The gap is not blocking yet, but it could create rework later.',
    structure:['Situation: two teams interpret one requirement differently.','Risk: each team validates against a different expectation.','Impact: rework or loss of customer confidence.','Recommendation: align interpretation before the next review.','Decision: confirm one shared requirement interpretation.'],
    model:'The situation is that two teams are interpreting the same customer requirement differently. The risk is that each team validates against a different expectation. The impact could be rework, delay or loss of customer confidence later in the programme. My recommendation is to align the interpretation before the next review, using the customer reference as the decision basis. What I need today is confirmation that we use one shared interpretation before moving forward.',
    question:'Can’t the teams solve this without management?',
    answer:'They can work on the technical detail, but we need one shared decision basis before the next review so that all teams validate against the same expectation.'
  }
];

const vocab = [
  ['audience','What does management need to decide?','What does management need to decide today?'],
  ['audience','What level of detail is useful?','What level of technical detail is useful for this audience?'],
  ['audience','The audience needs to understand…','The audience needs to understand the risk, the impact and the decision needed.'],
  ['structure','The situation is…','The situation is that the validation evidence is not mature enough yet.'],
  ['structure','The risk is…','The risk is that we move forward before the compliance position is fully secured.'],
  ['structure','The impact could be…','The impact could be rework, delay or a weaker decision path.'],
  ['structure','My recommendation is…','My recommendation is to organise a focused evidence review.'],
  ['structure','What I need today is…','What I need today is confirmation that we prioritise this validation step.'],
  ['brainstorming','The session brought together…','The session brought together several strong technical perspectives.'],
  ['brainstorming','Several themes emerged…','Several themes emerged: feasibility, validation strategy and project impact.'],
  ['brainstorming','Decision criteria','We need clear decision criteria before selecting the strongest option.'],
  ['transition','Let me separate…','Let me separate the technical point from the decision point.'],
  ['transition','The main message is this…','I can give the detail if needed, but the main message is this.'],
  ['transition','From a management perspective…','From a management perspective, the impact is the next milestone.'],
  ['detail','I can give more detail, but…','I can give more detail, but the essential point for today’s decision is evidence maturity.'],
  ['detail','The detailed explanation is available…','The detailed explanation is available, but for today’s decision, the key point is the impact on the next milestone.']
];

const objectives = [
  ['flight-plan','Understand the lesson route and the communication-course objective','Executive briefing pathway / lesson route','Guided orientation / trainer validation'],
  ['speaking-cues','Use speaking cues to control delivery','Pause, slow down, energy up, calm, firm, emphasis','Oral delivery / trainer observation'],
  ['warmup','Deliver the 30, 60 and 90-second self-presentation as a warm-up','Self-presentation / delivery under pressure','Oral practice / trainer validation'],
  ['communication-problem','Distinguish technical communication from executive communication','Technical detail vs strategic decision-making','Guided analysis / oral explanation'],
  ['audience-filter','Use an audience filter before presenting complex information','Audience needs, worries, decision and useful detail','Written/oral planning task'],
  ['srird-structure','Build a briefing using Situation, Risk, Impact, Recommendation and Decision','Executive briefing structure','Structured production / trainer validation'],
  ['technical-executive','Transform a technical explanation into an executive message','Validation evidence, requirements, brainstorming output','Technical vs executive comparison'],
  ['brainstorming-briefing','Present the brainstorming session as a strategic project update','New project, engineering ideas, decision criteria','Project briefing / oral production'],
  ['signposting','Use signposting phrases to guide the audience','Transitions and management-level framing','Phrase practice / oral production'],
  ['detail-control','Answer detail questions without losing control of the structure','Q&A, interruptions, pressure and detail control','Roleplay / trainer validation'],
  ['final-mission','Deliver a 90-second senior-management briefing','Validation issue / brainstorming output / requirement gap','Final simulation / trainer validation'],
  ['optional-logic','Use the optional concise logic formula only when it helps','Because / I recommend / so that as a supporting tool','Optional oral micro-structure / trainer validation'],
  ['vocab','Select and reuse strategic briefing language','Audience filter, structure, brainstorming, transitions and detail control','Phrase bank / pronunciation practice'],
  ['cloe-transfer','Connect the lesson to CLOE oral performance','Professional project, role, communication importance','CLOE-style oral answer']
];

function populateVoices(){
  if(!('speechSynthesis' in window)) return;
  voices = speechSynthesis.getVoices ? speechSynthesis.getVoices() : [];
  const accent = $('#accentSelect')?.value || 'en-GB';
  const filtered = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(accent.toLowerCase()));
  const list = filtered.length ? filtered : voices;
  const select = $('#voiceSelect');
  if(!select) return;
  select.innerHTML = list.map(v=>`<option value="${voices.indexOf(v)}">${v.name} (${v.lang})</option>`).join('') || '<option value="">Default voice</option>';
}
function getVoice(){const idx=Number($('#voiceSelect')?.value);return voices[idx]||null;}
function styleSettings(style){const base={rate:.9,pitch:1,volume:1}; if(style==='energetic')return{rate:1.02,pitch:1.08,volume:1}; if(style==='fast')return{rate:1.22,pitch:1.02,volume:1}; if(style==='calm')return{rate:.76,pitch:.92,volume:1}; if(style==='firm')return{rate:.84,pitch:.94,volume:1}; if(style==='paused')return{rate:.72,pitch:.95,volume:1}; return base;}
function applyPauses(text,style){const clean=String(text||'').replace(/<[^>]*>/g,' '); if(style!=='paused') return clean; return clean.replace(/\. /g,'. ... ').replace(/, /g,', ... ');}
function speakText(text,style='natural'){if(!('speechSynthesis' in window)){alert('Audio is not available in this browser.');return;} try{speechSynthesis.cancel();speechSynthesis.resume();}catch(e){} const u=new SpeechSynthesisUtterance(applyPauses(text,style)); u.lang=$('#accentSelect')?.value||'en-GB'; const v=getVoice(); if(v) u.voice=v; const s=styleSettings(style); u.rate=s.rate; u.pitch=s.pitch; u.volume=s.volume; u.onerror=()=>console.warn('Speech synthesis error. Try another voice or refresh voices.'); setTimeout(()=>speechSynthesis.speak(u),60);}
function textFromId(id){
  const el = $('#'+id);
  if(!el) return '';
  // Clone the node and strip delivery-cue labels (Pause, Calm, Firm, Look up, etc.)
  // so the text-to-speech audio doesn't read the cue words out loud.
  const clone = el.cloneNode(true);
  clone.querySelectorAll('.cue').forEach(c => c.remove());
  return clone.textContent.trim().replace(/\s+/g,' ');
}
function safe(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function copyText(text){navigator.clipboard?.writeText(text).then(()=>toast('Copied.')).catch(()=>{const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();toast('Copied.');});}
function downloadText(name,text,type='text/plain;charset=utf-8'){const blob=new Blob([text],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function toast(msg){let old=$('.toast');if(old)old.remove();const t=document.createElement('div');t.className='toast';t.textContent=msg;Object.assign(t.style,{position:'fixed',bottom:'22px',left:'50%',transform:'translateX(-50%)',background:'#071a30',color:'#fff',padding:'12px 18px',borderRadius:'999px',zIndex:9999,boxShadow:'0 12px 30px rgba(0,0,0,.22)',fontWeight:850});document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}

function renderTransformations(){
  const root=$('#transformationCards'); if(!root) return;
  root.innerHTML=transformations.map((t,i)=>`<article class="trans-card model-card"><h3>${safe(t.title)}</h3><p class="prompt"><strong>Situation:</strong> ${safe(t.situation)}</p><div class="compare-grid"><div><h4>Technical version</h4><p class="script-line">${safe(t.technical)}</p></div><div><h4>Executive version</h4><p class="script-line">${safe(t.executive)}</p></div></div><button data-speak-text="${encodeURIComponent(t.executive)}" data-style="firm">Listen to executive version</button><button data-toggle="#transCue${i}" class="secondary">Show delivery cues</button><div id="transCue${i}" class="model-block hidden">${t.cue}</div><div class="recorder small" data-recorder="transform-${i}"><h4>Record your executive version</h4><p class="rec-status"><span class="recording-light"></span>Ready</p><div class="rec-controls"><button class="startRec">Start</button><button class="stopRec secondary" disabled>Stop</button><a class="downloadRec hidden" download="eden-transform-${i+1}.webm">Download</a></div><audio controls class="playback hidden"></audio></div></article>`).join('');
}
function renderSignposts(){const root=$('#signpostCards'); if(!root)return; root.innerHTML=signposts.map((p,i)=>`<article class="vocab-card"><span class="category">${safe(p[0])}</span><h3>${safe(p[1])}</h3><p>${safe(p[2])}</p><button data-speak-text="${encodeURIComponent(p[1])}" data-style="firm">Listen</button></article>`).join('');}
function renderDetails(){const root=$('#detailCards'); if(!root)return; root.innerHTML=details.map((d,i)=>`<article class="question-card"><h3>${safe(d.title)}</h3><p class="prompt">${safe(d.prompt)}</p><button data-speak-text="${encodeURIComponent(d.prompt)}">Listen to question</button><button data-toggle="#detailModel${i}" class="secondary">Show model</button><button data-toggle="#detailCue${i}" class="secondary">Show delivery cues</button><div id="detailModel${i}" class="model-block hidden"><p>${safe(d.model)}</p><button data-speak-text="${encodeURIComponent(d.model)}" data-style="firm">Listen to model</button></div><div id="detailCue${i}" class="model-block hidden">${d.cue}</div><div class="recorder small" data-recorder="detail-${i}"><h4>Record your answer</h4><p class="rec-status"><span class="recording-light"></span>Ready</p><div class="rec-controls"><button class="startRec">Start</button><button class="stopRec secondary" disabled>Stop</button><a class="downloadRec hidden" download="eden-detail-${i+1}.webm">Download</a></div><audio controls class="playback hidden"></audio></div></article>`).join('');}
function renderMissions(){const root=$('#missionCards'); if(!root)return; root.innerHTML=missions.map((m,i)=>`<article class="mission-card"><h3>${safe(m.title)}</h3><div class="tag-list">${m.tags.map(t=>`<span class="tag">${safe(t)}</span>`).join('')}</div><p><strong>Scenario:</strong> ${safe(m.scenario)}</p><h4>Use this structure</h4><ul>${m.structure.map(s=>`<li>${safe(s)}</li>`).join('')}</ul><button data-toggle="#missionModel${i}" class="secondary">Show model briefing</button><button data-toggle="#missionQuestion${i}" class="secondary">Show pressure question</button><div id="missionModel${i}" class="model-block hidden"><p>${safe(m.model)}</p><button data-speak-text="${encodeURIComponent(m.model)}" data-style="paused">Listen to model</button></div><div id="missionQuestion${i}" class="model-block hidden"><p><strong>Question:</strong> ${safe(m.question)}</p><p><strong>Model answer:</strong> ${safe(m.answer)}</p><button data-speak-text="${encodeURIComponent(m.answer)}" data-style="firm">Listen to answer</button></div></article>`).join('');}
function renderVocab(){const root=$('#vocabGrid'); if(!root)return; const filter=$('#vocabFilter')?.value||'all'; const search=($('#vocabSearch')?.value||'').toLowerCase(); const rows=vocab.filter(v=>(filter==='all'||v[0]===filter)&&(!search||v.join(' ').toLowerCase().includes(search))); root.innerHTML=rows.map(v=>`<article class="vocab-card"><span class="category">${safe(v[0])}</span><h3>${safe(v[1])}</h3><p class="example-line">${safe(v[2])}</p><button data-speak-text="${encodeURIComponent(v[2])}">Listen</button></article>`).join('')||'<p>No matching phrase.</p>';}
function statusLabel(s){return {'achieved':'Acquis','progress':'En cours d’acquisition','not-achieved':'Non acquis','not-started':'Non commencé'}[s]||s;}
function statusOptionsHTML(selected='not-started'){
  const opts=[['not-started','Non commencé'],['progress','En cours d’acquisition'],['achieved','Acquis'],['not-achieved','Non acquis']];
  return opts.map(([v,l])=>`<option value="${v}" ${v===selected?'selected':''}>${l}</option>`).join('');
}
function checkpointFor(id){return $(`.checkpoint[data-section="${id}"]`);}
function rowFor(id){return $(`#evaluationRows tr[data-obj="${id}"]`);}
function checkpointData(id){
  const c=checkpointFor(id); const row=rowFor(id);
  const status=$('[data-field="status"]',c)?.value || $('.eval-status',row)?.value || 'not-started';
  const notes=$('[data-field="notes"]',c)?.value || $('.eval-comment',row)?.value || '';
  const version=$('[data-field="version"]',c)?.value || '';
  const done=$('[data-field="done"]',c)?.checked || false;
  return {status,notes,version,done};
}
function commentFromCheckpoint(id){
  const d=checkpointData(id); let parts=[];
  if(d.notes) parts.push(d.notes.trim());
  if(d.version) parts.push('Learner version / useful production:\n'+d.version.trim());
  return parts.join('\n\n');
}
function renderEvaluation(){
  const root=$('#evaluationRows'); if(!root)return;
  root.innerHTML=objectives.map(o=>`<tr data-obj="${o[0]}"><td>${safe(o[1])}</td><td>${safe(o[2])}</td><td>${safe(o[3])}</td><td><select class="eval-status">${statusOptionsHTML()}</select></td><td><textarea class="eval-comment" rows="2" placeholder="Comments from the section checkpoint..."></textarea></td></tr>`).join('');
  syncEvaluationFromCheckpoints(false);
}
function syncRowFromCheckpoint(id, save=false){
  const row=rowFor(id), cp=checkpointFor(id); if(!row || !cp) return;
  const d=checkpointData(id);
  const st=$('.eval-status',row), cm=$('.eval-comment',row);
  if(st) st.value=d.status;
  if(cm) cm.value=commentFromCheckpoint(id);
  updateCompletion(false);
  if(save) saveState(false);
}
function syncCheckpointFromRow(id, save=false){
  const row=rowFor(id), cp=checkpointFor(id); if(!row || !cp) return;
  const st=$('.eval-status',row), cm=$('.eval-comment',row);
  const cst=$('[data-field="status"]',cp), cnotes=$('[data-field="notes"]',cp);
  if(cst && st) cst.value=st.value;
  if(cnotes && cm) cnotes.value=cm.value;
  updateCompletion(false);
  if(save) saveState(false);
}
function syncEvaluationFromCheckpoints(save=false){
  objectives.forEach(o=>syncRowFromCheckpoint(o[0],false));
  updateCompletion(false);
  if(save) saveState(false);
}
function updateCompletion(){
  const statuses=objectives.map(o=>checkpointData(o[0]).status);
  const nonStart=statuses.filter(s=>s!=='not-started').length;
  const completion=Math.round((nonStart/(statuses.length||1))*100);
  if($('#completionRate')) $('#completionRate').value=completion+'%';
  let overall='not-started';
  if(statuses.length && statuses.every(s=>s==='achieved')) overall='achieved';
  else if(statuses.some(s=>s==='not-achieved')) overall='not-achieved';
  else if(statuses.some(s=>s==='progress'||s==='achieved')) overall='progress';
  const el=$('#overallStatus'); if(el){el.className='status '+overall; el.textContent=statusLabel(overall);}
  buildReportPreview(false);
}
function collectState(){
  const state={checkpoints:{},notes:{},eval:{},meta:{},survey:{}};
  $$('.checkpoint').forEach(c=>{const id=c.dataset.section; state.checkpoints[id]={}; $$('[data-field]',c).forEach(f=>{state.checkpoints[id][f.dataset.field]=f.type==='checkbox'?f.checked:f.value;});});
  $$('.practice-note').forEach(n=>state.notes[n.dataset.note]=n.value);
  state.meta={learner:$('#learnerName')?.value,trainer:$('#trainerName')?.value,date:$('#evaluationDate')?.value,comments:$('#trainerComments')?.value,lastSaved:new Date().toISOString()};
  $$('#evaluationRows tr').forEach(tr=>{state.eval[tr.dataset.obj]={status:$('.eval-status',tr)?.value||'not-started',comment:$('.eval-comment',tr)?.value||''};});
  ['surveyTransformation','surveyStructure','surveyBrainstorm','surveyQA','surveyComments'].forEach(id=>{const el=$('#'+id); if(el) state.survey[id]=el.value;});
  return state;
}
function applyState(state){
  if(!state)return;
  $$('.checkpoint').forEach(c=>{
    const id=c.dataset.section; const d=state.checkpoints?.[id]||{}; const legacy=state.eval?.[id]||{};
    $$('[data-field]',c).forEach(f=>{
      let val=d[f.dataset.field];
      if(val===undefined && f.dataset.field==='status') val=legacy.status;
      if(val===undefined && f.dataset.field==='notes') val=legacy.comment;
      if(val!==undefined){if(f.type==='checkbox') f.checked=!!val; else f.value=val;}
    });
  });
  $$('.practice-note').forEach(n=>{if(state.notes?.[n.dataset.note]!==undefined)n.value=state.notes[n.dataset.note];});
  if(state.meta){
    if($('#learnerName'))$('#learnerName').value=state.meta.learner||'Eden Cohen';
    if($('#trainerName'))$('#trainerName').value=state.meta.trainer||'Tisha DOUTY-DOSIERE';
    if($('#evaluationDate'))$('#evaluationDate').value=state.meta.date||today();
    if($('#trainerComments'))$('#trainerComments').value=state.meta.comments||'';
    if($('#lastSaved')&&state.meta.lastSaved)$('#lastSaved').textContent=new Date(state.meta.lastSaved).toLocaleString();
  }
  Object.entries(state.survey||{}).forEach(([id,v])=>{const el=$('#'+id); if(el) el.value=v;});
  syncEvaluationFromCheckpoints(false);
}
function saveState(show=true){localStorage.setItem(STORAGE_KEY,JSON.stringify(collectState())); if($('#lastSaved'))$('#lastSaved').textContent=new Date().toLocaleString(); if(show)toast('Progress saved.');}
function loadState(){try{applyState(JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'));}catch(e){console.warn('Could not load saved progress',e)}}
function today(){return new Date().toISOString().slice(0,10);}
function reportRowsData(){
  return objectives.map(o=>{const d=checkpointData(o[0]);return {id:o[0],objective:o[1],support:o[2],mode:o[3],status:d.status,label:statusLabel(d.status),comments:commentFromCheckpoint(o[0])};});
}
function reportText(){
  const state=collectState();
  const rows=reportRowsData().map(r=>`- ${r.objective}\n  Support: ${r.support}\n  Mode: ${r.mode}\n  Status: ${r.label}\n  Comments: ${r.comments||''}`).join('\n');
  return `Bilan d'évaluation des acquis - Qualiopi\nEden Lesson 3 - Executive Briefing: From Technical Detail to Strategic Message\n\nLearner: ${state.meta.learner||''}\nTrainer: ${state.meta.trainer||''}\nDate: ${state.meta.date||''}\nCompletion: ${$('#completionRate')?.value||'0%'}\nOverall result: ${$('#overallStatus')?.textContent||''}\n\nObjectives\n${rows}\n\nGeneral observations\n${state.meta.comments||'No observations entered.'}`;
}
function reportHtml(){
  const state=collectState();
  const trs=reportRowsData().map(r=>`<tr><td>${safe(r.objective)}</td><td>${safe(r.support)}</td><td>${safe(r.mode)}</td><td><span class="status ${safe(r.status)}">${safe(r.label)}</span></td><td>${safe(r.comments||'').replace(/\n/g,'<br>')}</td></tr>`).join('');
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Bilan Qualiopi - Eden Cohen</title><style>:root{--ink:#101827;--muted:#526277;--deep:#061322;--navy:#0b1f3a;--blue:#1c5f9f;--cyan:#38d7ff;--teal:#12b6bc;--gold:#f6c65b;--orange:#ff9d4d;--green:#15834b;--red:#ba2437;--amber:#9d6900}*{box-sizing:border-box}body{margin:0;font-family:Inter,Segoe UI,Arial,sans-serif;color:var(--ink);line-height:1.55;background:radial-gradient(circle at 0% 0%,rgba(56,215,255,.14),transparent 30%),radial-gradient(circle at 100% 10%,rgba(246,198,91,.16),transparent 28%),linear-gradient(135deg,#eef8ff,#f7fbff 47%,#eaf3fb)}header{padding:34px 40px;color:white;background:linear-gradient(135deg,var(--deep),var(--navy) 58%,var(--blue));border-bottom:5px solid var(--gold)}main{max-width:1180px;margin:24px auto;padding:0 24px}.kicker{text-transform:uppercase;letter-spacing:.14em;color:var(--gold);font-weight:900;font-size:.8rem}h1{font-family:Georgia,serif;font-size:2.4rem;margin:.2rem 0}h2{font-family:Georgia,serif;color:var(--navy);margin-top:30px}.meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:22px 0}.box{background:#fff;border:1px solid rgba(28,95,159,.18);border-radius:18px;padding:12px;box-shadow:0 8px 22px rgba(6,19,34,.06)}table{border-collapse:separate;border-spacing:0;width:100%;background:#fff;border:1px solid rgba(28,95,159,.18);border-radius:20px;overflow:hidden;font-size:13px}th,td{padding:10px;border-bottom:1px solid rgba(28,95,159,.13);vertical-align:top;text-align:left}th{background:#eef8ff;color:var(--navy)}.comments{white-space:pre-wrap;min-height:80px}.status{display:inline-block;border-radius:999px;padding:6px 9px;font-weight:900;font-size:.8rem}.achieved{background:#daf7e8;color:var(--green)}.progress{background:#fff1c4;color:var(--amber)}.not-achieved{background:#ffe2e7;color:var(--red)}.not-started{background:#e8eef5;color:var(--muted)}.note{color:var(--muted);font-size:.9rem}@media print{body{background:#fff}main{max-width:none;margin:0}header{padding:20px}.box,table{box-shadow:none}}</style></head><body><header><div class="kicker">Aerospace Communication · Executive Briefing · Qualiopi</div><h1>Bilan d'évaluation des acquis</h1><p>Eden Lesson 3 - Executive Briefing: From Technical Detail to Strategic Message</p></header><main><div class="meta"><div class="box"><b>Apprenante:</b> ${safe(state.meta.learner||'')}</div><div class="box"><b>Formatrice:</b> ${safe(state.meta.trainer||'')}</div><div class="box"><b>Date:</b> ${safe(state.meta.date||'')}</div><div class="box"><b>Completion:</b> ${safe($('#completionRate')?.value||'0%')}</div><div class="box"><b>Résultat global:</b> ${safe($('#overallStatus')?.textContent||'')}</div></div><h2>Objectifs pédagogiques et résultats</h2><table><thead><tr><th>Objectif pédagogique</th><th>Support / sujet</th><th>Mode d'évaluation</th><th>Résultat</th><th>Commentaires</th></tr></thead><tbody>${trs}</tbody></table><h2>Observations générales de la formatrice</h2><div class="box comments">${safe(state.meta.comments||'Aucune observation saisie.')}</div><p class="note">Rapport généré depuis la page interactive. Les résultats sont sauvegardés dans le navigateur utilisé.</p></main></body></html>`;
}
function buildReportPreview(){if($('#reportPreview')) $('#reportPreview').textContent=reportText();}
function checkpointText(){const state=collectState(); return Object.entries(state.checkpoints).map(([id,d])=>`${id}\nProgress: ${statusLabel(d.status||'not-started')}\nCompleted: ${d.done?'yes':'no'}\nVersion: ${d.version||''}\nNotes: ${d.notes||''}`).join('\n\n');}
function openReportForPrint(){const w=window.open('', '_blank'); if(!w){alert('The printable report could not open. Please allow pop-ups for this page.'); return;} w.document.open(); w.document.write(reportHtml()); w.document.close(); setTimeout(()=>{w.focus(); w.print();},350);}
function sanitizePdfText(text){return String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—]/g,'-').replace(/[^\x09\x0A\x0D\x20-\x7E]/g,'');}
function wrapLine(line, width=92){const out=[]; let current=''; String(line).split(/\s+/).forEach(word=>{if((current+' '+word).trim().length>width){out.push(current.trim()); current=word;}else current=(current+' '+word).trim();}); out.push(current); return out;}
function pdfEscape(s){return sanitizePdfText(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
function buildSimplePdf(text){
  const raw=sanitizePdfText(text).split('\n').flatMap(l=>wrapLine(l,92));
  const linesPerPage=44; const pages=[]; for(let i=0;i<raw.length;i+=linesPerPage) pages.push(raw.slice(i,i+linesPerPage));
  const objects=[]; const add=o=>{objects.push(o); return objects.length;};
  const catalog=add('<< /Type /Catalog /Pages 2 0 R >>');
  objects.push('PAGES_PLACEHOLDER');
  const pageIds=[];
  pages.forEach((lines,idx)=>{
    const content=[
      'q 0.043 0.102 0.188 rg 0 790 595 52 re f Q',
      'q 0.965 0.776 0.357 rg 0 786 595 4 re f Q',
      `BT /F1 16 Tf 1 1 1 rg 42 816 Td (${pdfEscape(idx===0?'Bilan Qualiopi - Eden Cohen':'Bilan Qualiopi - Eden Cohen (continued)')}) Tj ET`,
      'BT /F1 9 Tf 0.06 0.09 0.14 rg 42 760 Td'
    ];
    lines.forEach((line,i)=>{content.push(`(${pdfEscape(line)}) Tj`); if(i<lines.length-1) content.push('0 -14 Td');});
    content.push('ET');
    const stream=content.join('\n');
    const contentId=add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    const pageId=add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${0} 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageIds.push(pageId);
  });
  const fontId=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  // patch font refs
  for(let i=0;i<objects.length;i++) objects[i]=objects[i].replace('/F1 0 0 R', `/F1 ${fontId} 0 R`);
  objects[1]=`<< /Type /Pages /Kids [${pageIds.map(id=>id+' 0 R').join(' ')}] /Count ${pageIds.length} >>`;
  let pdf='%PDF-1.4\n'; const offsets=[0];
  objects.forEach((obj,i)=>{offsets[i+1]=pdf.length; pdf+=`${i+1} 0 obj\n${obj}\nendobj\n`;});
  const xref=pdf.length; pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n ').join('\n')+'\n';
  pdf+=`trailer << /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return pdf;
}
function downloadPdfReport(){const pdf=buildSimplePdf(reportText()); const blob=new Blob([pdf],{type:'application/pdf'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='Eden-Cohen-Lesson-3-Bilan-Qualiopi.pdf'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function setupQualiopiSync(){
  document.addEventListener('change',e=>{const cp=e.target.closest('.checkpoint'); if(cp){syncRowFromCheckpoint(cp.dataset.section,true);} const row=e.target.closest('#evaluationRows tr'); if(row){syncCheckpointFromRow(row.dataset.obj,true);}});
  document.addEventListener('input',e=>{const cp=e.target.closest('.checkpoint'); if(cp){syncRowFromCheckpoint(cp.dataset.section,true);} const row=e.target.closest('#evaluationRows tr'); if(row){syncCheckpointFromRow(row.dataset.obj,true);}});
  $('#downloadReportPdf')?.addEventListener('click',downloadPdfReport);
  const pr=$('#printReport'); if(pr){pr.replaceWith(pr.cloneNode(true)); $('#printReport')?.addEventListener('click',openReportForPrint);}
  syncEvaluationFromCheckpoints(false);
}
function surveyText(){return `Eden Lesson 3 feedback\n\nTechnical-to-executive transformation: ${$('#surveyTransformation')?.value||''}\nSRIRD structure: ${$('#surveyStructure')?.value||''}\nBrainstorming case study: ${$('#surveyBrainstorm')?.value||''}\nQ&A and detail control: ${$('#surveyQA')?.value||''}\n\nComments:\n${$('#surveyComments')?.value||''}`;}
function generateBriefing(){const s=$('#bSituation')?.value.trim()||'The situation is that we recently held a brainstorming session to explore possible directions for the new project.'; const r=$('#bRisk')?.value.trim()||'The risk is that the ideas remain too broad if we do not organise them into clear themes and decision criteria.'; const i=$('#bImpact')?.value.trim()||'The impact could be a lack of alignment on feasibility, validation effort and project priorities.'; const rec=$('#bRecommendation')?.value.trim()||'My recommendation is to structure the outcomes around decision criteria such as reliability, compliance confidence, validation effort and timeline.'; const d=$('#bDecision')?.value.trim()||'What I need now is alignment on the criteria we will use to evaluate the most promising option.'; const text=`${s}\n\n${r}\n\n${i}\n\n${rec}\n\n${d}`; $('#briefingPreview').textContent=text; saveState(false); return text;}
function setupRecorders(){ $$('.recorder').forEach((box,idx)=>{let recorder,chunks=[]; const start=$('.startRec',box), stop=$('.stopRec',box), audio=$('.playback',box), link=$('.downloadRec',box), status=$('.rec-status',box); if(!start||!stop)return; start.addEventListener('click',async()=>{try{const stream=await navigator.mediaDevices.getUserMedia({audio:true}); recorder=new MediaRecorder(stream); chunks=[]; recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)}; recorder.onstop=()=>{const blob=new Blob(chunks,{type:'audio/webm'}); const url=URL.createObjectURL(blob); if(audio){audio.src=url; audio.classList.remove('hidden')} if(link){link.href=url; link.classList.remove('hidden')} stream.getTracks().forEach(t=>t.stop()); box.classList.remove('recording'); if(status)status.innerHTML='<span class="recording-light"></span>Recording ready';}; recorder.start(); box.classList.add('recording'); start.disabled=true; stop.disabled=false; if(status)status.innerHTML='<span class="recording-light"></span>Recording...';}catch(e){alert('Microphone recording is not available. Please check browser permissions or use another recorder.');}}); stop.addEventListener('click',()=>{if(recorder&&recorder.state!=='inactive') recorder.stop(); start.disabled=false; stop.disabled=true;}); });}
function initEvents(){document.addEventListener('click',e=>{const scroll=e.target.closest('[data-scroll]'); if(scroll){$(scroll.dataset.scroll)?.scrollIntoView({behavior:'smooth'});} const sp=e.target.closest('[data-speak-text]'); if(sp){speakText(decodeURIComponent(sp.dataset.speakText), sp.dataset.style||'natural');} const sid=e.target.closest('[data-speak-id]'); if(sid){speakText(textFromId(sid.dataset.speakId), sid.dataset.style||'natural');} const cp=e.target.closest('[data-copy-id]'); if(cp){copyText(textFromId(cp.dataset.copyId));} const tog=e.target.closest('[data-toggle]'); if(tog){$(tog.dataset.toggle)?.classList.toggle('hidden');} const choice=e.target.closest('[data-choice]'); if(choice){const fb=$('#quizFeedback'); $$('#quizPanel [data-choice]').forEach(b=>b.classList.remove('correct-choice','wrong-choice')); if(choice.dataset.ok==='true'){choice.classList.add('correct-choice'); fb.textContent='Correct. This sentence gives management the key point and the decision logic.'; fb.className='feedback correct';}else{choice.classList.add('wrong-choice'); fb.textContent='This is not the strongest executive sentence. It is too vague or too detailed.'; fb.className='feedback incorrect';}} });
 $('#audioTest')?.addEventListener('click',()=>speakText('Audio test. If you can hear this, the listen buttons are working.','natural'));
 $('#refreshVoices')?.addEventListener('click',()=>{populateVoices();toast('Voices refreshed.');}); $('#accentSelect')?.addEventListener('change',populateVoices); $('#stopAudio')?.addEventListener('click',()=>speechSynthesis?.cancel()); $('#printPage')?.addEventListener('click',()=>window.print()); $('#toggleFrench')?.addEventListener('click',e=>{$$('.fr-support').forEach(el=>el.classList.toggle('hidden')); e.target.textContent=$('.fr-support.hidden')?'Show French support':'Hide French support';}); $('#toggleModels')?.addEventListener('click',e=>{const hidden=$$('.model-block.hidden,.mini-model.hidden'); const any=hidden.length>0; $$('.model-block,.mini-model').forEach(el=>el.classList.toggle('hidden',!any)); e.target.textContent=any?'Hide all models':'Show all models';}); $('#vocabFilter')?.addEventListener('change',renderVocab); $('#vocabSearch')?.addEventListener('input',renderVocab); $('#generateBriefing')?.addEventListener('click',generateBriefing); $('#copyBriefing')?.addEventListener('click',()=>copyText($('#briefingPreview')?.textContent||generateBriefing())); $('#downloadBriefing')?.addEventListener('click',()=>downloadText('eden-lesson-3-srird-briefing.txt',$('#briefingPreview')?.textContent||generateBriefing())); ['bSituation','bRisk','bImpact','bRecommendation','bDecision'].forEach(id=>$('#'+id)?.addEventListener('input',()=>saveState(false))); $('#copySurvey')?.addEventListener('click',()=>copyText(surveyText())); $('#downloadSurvey')?.addEventListener('click',()=>downloadText('eden-lesson-3-feedback.txt',surveyText())); $('#saveProgress')?.addEventListener('click',()=>saveState(true)); $('#copyReport')?.addEventListener('click',()=>copyText(reportText())); $('#downloadReportTxt')?.addEventListener('click',()=>downloadText('eden-cohen-lesson-3-qualiopi-report.txt',reportText())); $('#downloadReportHtml')?.addEventListener('click',()=>downloadText('Eden-Cohen-Lesson-3-Bilan-Qualiopi.html',reportHtml(),'text/html;charset=utf-8')); $('#printReport')?.addEventListener('click',()=>window.print()); $('#resetProgress')?.addEventListener('click',()=>{if(confirm('Reset saved progress for this lesson?')){localStorage.removeItem(STORAGE_KEY);location.reload();}}); $('#copyCheckpoints')?.addEventListener('click',()=>copyText(checkpointText())); $('#downloadCheckpoints')?.addEventListener('click',()=>downloadText('eden-lesson-3-section-notes.txt',checkpointText())); document.addEventListener('change',e=>{if(e.target.matches('.eval-status,input[type="checkbox"],select')){updateCompletion();saveState(false);}}); document.addEventListener('input',e=>{if(e.target.matches('textarea,input')){if(e.target.id==='surveyComments'||e.target.closest('.survey')) $('#surveyPreview').textContent=surveyText(); updateCompletion(); saveState(false);}});}
function init(){renderTransformations();renderSignposts();renderDetails();renderMissions();renderVocab();renderEvaluation();if($('#evaluationDate'))$('#evaluationDate').value=today();populateVoices(); if('speechSynthesis' in window){speechSynthesis.onvoiceschanged=populateVoices;} setupRecorders();initEvents();loadState();$('#surveyPreview').textContent=surveyText();buildReportPreview();}
init();
setupQualiopiSync();
