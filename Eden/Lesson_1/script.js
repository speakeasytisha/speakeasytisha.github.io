const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

const STORAGE_KEY='eden_lesson_1_executive_aerospace_communication_v4';
const SURVEY_KEY='eden_lesson_1_survey_v4';
let voices=[];
let mediaRecorders={};

const DATA={
  vocab:[
    ['executive','decision point','point de décision','the exact decision that needs to be made','The decision point is whether to validate now or move forward.'],
    ['executive','key message','message clé','the one idea the audience must remember','The key message is that validation protects the programme.'],
    ['executive','recommendation','recommandation','the position you advise people to accept','My recommendation is to secure the validation before the next milestone.'],
    ['executive','expected impact','impact attendu','the result of the decision','The expected impact is lower downstream risk and stronger customer confidence.'],
    ['executive','decision-oriented','orienté décision','focused on helping people decide','The presentation needs to be decision-oriented, not detail-heavy.'],
    ['aerospace','components','composants','individual technical parts within a system','Each team must verify that its components meet the requirements.'],
    ['aerospace','compliance evidence','preuves de conformité','documentation or data proving that requirements are met','We need stronger compliance evidence before closing the review.'],
    ['aerospace','customer requirements','exigences clients','specific expectations defined by the customer','The system must meet customer requirements before delivery.'],
    ['aerospace','safety-critical','critique pour la sécurité','where failure could affect safety','This is a safety-critical environment, so traceability is essential.'],
    ['aerospace','operational reliability','fiabilité opérationnelle','the ability to perform correctly in operation','The validation step supports operational reliability.'],
    ['aerospace','traceability','traçabilité','the ability to track evidence, decisions and changes','Traceability is essential when several teams are involved.'],
    ['aerospace','propulsion systems','systèmes de propulsion','systems related to engine power and aircraft movement','The propulsion systems team must confirm its validation status.'],
    ['aerospace','landing gear systems','systèmes de train d’atterrissage','systems used for landing, take-off support and ground movement','The landing gear systems team identified one point requiring clarification.'],
    ['persuasion','because','parce que','introduces the reason or evidence','Because the evidence is incomplete, I recommend validating now.'],
    ['persuasion','so that','afin de','introduces the result or intended impact','We should align the teams now so that we avoid gaps later.'],
    ['persuasion','risk reduction','réduction du risque','action that lowers the probability or impact of risk','This validation is a risk reduction measure.'],
    ['persuasion','business impact','impact business','the practical effect on time, cost, risk or customer confidence','The business impact is a lower risk of rework.'],
    ['persuasion','evidence-based','fondé sur des preuves','supported by facts, data or validation results','The recommendation is evidence-based and linked to safety assurance.'],
    ['attention','bring this back to','revenir à','redirects the conversation to the main point','Let me bring this back to the decision point.'],
    ['attention','key point','point clé','the most important idea','The key point is that the compliance evidence is not complete.'],
    ['attention','separate the detail from the decision','séparer le détail de la décision','keeps the discussion focused','Let’s separate the technical detail from the decision we need today.'],
    ['attention','come back to that','revenir à cela','postpones a secondary point politely','I’ll come back to that, but first let me complete the risk picture.'],
    ['attention','stay with the objective','rester sur l’objectif','prevents the conversation from drifting','Let’s stay with the objective of this review.'],
    ['voice','pause','pause','a short silence after an important idea','Pause after the key risk so the audience can process it.'],
    ['voice','pace','débit / rythme','the speed of speech','A slower pace makes the risk sound more controlled.'],
    ['voice','firm','ferme','stable and confident, not aggressive','Use a firm voice when you make your recommendation.'],
    ['voice','calm authority','autorité calme','credible control without excessive energy','Calm authority is useful when discussing safety or risk.'],
    ['voice','energy variation','variation d’énergie','changing vocal energy depending on purpose','Energy variation helps you capture attention and then build trust.']
  ],
  framework:[
    ['Decision','The decision we need today is...','The decision we need today is whether to add an additional validation step.','firm'],
    ['Reason','The reason this matters is...','The reason this matters is that the current evidence is not sufficient.','calm'],
    ['Risk','The main risk is...','The main risk is a compliance gap before the next milestone.','paused'],
    ['Recommendation','My recommendation is...','My recommendation is to secure the validation before the next milestone.','firm'],
    ['Impact','This would allow us to...','This would allow us to protect safety, traceability and customer confidence.','calm'],
    ['Action','What I need from you today is...','What I need from you today is confirmation that we prioritise validation before moving forward.','firm']
  ],
  warmups:[
    {
      q:'When should a speaker be energetic?',
      guide:'Use energy when the audience needs to wake up, notice the importance of the message or refocus on the decision.',
      model:'A speaker should be more energetic at the opening, when introducing a key message, when signalling urgency, or when the audience starts losing attention. Energy should create direction, not speed.'
    },
    {
      q:'When is it more efficient to be calmer?',
      guide:'Calm is more efficient when the topic is complex, sensitive or linked to risk, because it builds credibility and control.',
      model:'It is more efficient to be calmer when explaining safety, risk, uncertainty or objections. Calm energy helps the audience trust the message and gives the impression that the situation is under control.'
    },
    {
      q:'What makes a technical presentation convincing for senior management?',
      guide:'A convincing presentation connects facts to a decision. It does not only describe technical details.',
      model:'A technical presentation is convincing when the issue, the risk, the evidence, the recommendation and the expected impact are easy to follow. Senior management should quickly understand what decision is needed and why it matters.'
    },
    {
      q:'What should the audience remember after your presentation?',
      guide:'The audience should remember one main message, not every detail.',
      model:'The audience should remember the decision point, the main risk and the recommended action. If they remember only one thing, it should be why the decision matters now.'
    },
    {
      q:'How can you avoid a circular explanation?',
      guide:'A circular explanation repeats context. A structured answer moves forward: issue → risk → recommendation → impact.',
      model:'I can avoid a circular explanation by deciding the key message before I speak, using shorter sentences and moving from the issue to the risk, then to the recommendation and the expected impact.'
    },
    {
      q:'How can you recover attention when people start focusing on details?',
      guide:'A strong recovery sentence acknowledges the detail but redirects to the decision.',
      model:'I can recover attention by saying, “Let’s separate the technical detail from the decision we need today.” This keeps the discussion respectful but brings the audience back to the objective.'
    }
  ],
  interruptions:[
    {
      title:'Technical detail interruption',
      interruption:'Can you explain the technical part again?',
      model:'Of course. I’ll clarify the technical point, but first let me keep the focus on the decision we need today.',
      note:'This works because it accepts the request without losing control of the structure.'
    },
    {
      title:'Schedule pressure',
      interruption:'We do not have time for additional validation.',
      model:'I understand the schedule pressure. The key point is that this validation reduces a compliance risk before it becomes a programme issue.',
      note:'This response acknowledges pressure, then returns to risk and impact.'
    },
    {
      title:'Loss of attention',
      interruption:'Someone checks their phone while you are speaking.',
      model:'Let me bring this back to the key decision: we need to choose whether to validate now or accept the downstream risk.',
      note:'This is short, direct and decision-focused.'
    },
    {
      title:'Objection from management',
      interruption:'Is this really a safety issue?',
      model:'At this stage, it is a compliance and assurance issue. The purpose of the validation is to confirm that there is no safety exposure before we move forward.',
      note:'This avoids exaggeration. It is precise and credible.'
    },
    {
      title:'Discussion drifting',
      interruption:'The discussion moves toward a secondary topic.',
      model:'That point is useful, and I suggest we come back to it after we close the decision on validation.',
      note:'This keeps the relationship positive while restoring the frame.'
    },
    {
      title:'A direct challenge',
      interruption:'Why did the team not identify this earlier?',
      model:'That is a fair question. For today, the priority is to decide how we close the compliance evidence before the next milestone.',
      note:'This does not avoid the question, but it prevents the conversation from becoming defensive.'
    }
  ],
  persuasion:[
    {
      topic:'Compliance risk',
      model:'Because the current evidence is not sufficient to close the compliance risk, I recommend adding one validation step so that we protect safety and traceability.',
      why:'Evidence → recommendation → safety impact.'
    },
    {
      topic:'Schedule pressure',
      model:'Because the schedule is under pressure, I recommend clarifying the decision criteria now so that we avoid delays later in the programme.',
      why:'Acknowledges pressure but protects the long-term schedule.'
    },
    {
      topic:'Coordination between teams',
      model:'Because each team is working on a different scope, I recommend aligning the validation status today so that we avoid gaps between systems.',
      why:'Shows cross-team logic and prevents misalignment.'
    },
    {
      topic:'Customer requirements',
      model:'Because the customer requirements are very specific, I recommend confirming the compliance evidence before the next review so that we avoid rework.',
      why:'Links the recommendation to customer expectations and rework prevention.'
    },
    {
      topic:'Safety-critical validation',
      model:'Because this product operates in a safety-critical environment, I recommend prioritising validation over speed so that the decision remains technically and operationally secure.',
      why:'Positions safety and reliability as decision criteria.'
    }
  ],
  missions:[
    {
      title:'Mission 1 — Validation before milestone',
      context:'Several technical teams are involved. One compliance point requires clarification. The schedule is under pressure.',
      task:'Deliver a 2-minute update and ask management to confirm whether validation should happen before the next milestone.',
      steps:['Open with the decision needed.','Explain why it matters now.','State the risk.','Make your recommendation.','Close with the decision expected.'],
      model:'The decision we need today is whether to add an additional validation step before the next project milestone. The reason this matters is that several teams are involved, and each system must be verified against customer requirements and safety standards. The main risk is that we move forward with incomplete compliance evidence, which could create rework, delay or loss of confidence later in the programme. My recommendation is to secure this validation now and align the teams around one clear decision. This would allow us to protect safety, maintain traceability and reduce downstream risk. What I need from you today is confirmation that we prioritise validation before moving to the next milestone.',
      pressure:'We do not have time for this.',
      recovery:'I understand the time constraint. My recommendation is to validate now because the risk reduction is greater than the limited schedule impact.'
    },
    {
      title:'Mission 2 — Cross-team alignment',
      context:'Propulsion, landing gear and equipment teams have different priorities. Management needs one clear status update.',
      task:'Explain the alignment risk and propose a common decision framework.',
      steps:['Start with the coordination issue.','Explain the risk of misalignment.','Recommend a shared framework.','Show the operational impact.','Ask for agreement.'],
      model:'The key issue today is cross-team alignment. Propulsion, landing gear and equipment teams are progressing, but each team is using a slightly different validation rhythm. The risk is that we create gaps between systems even if each individual scope appears under control. My recommendation is to align the validation status around one shared decision framework. This would improve traceability, reduce late surprises and make the next management review more reliable. What I need today is agreement on the common criteria we will use across teams.',
      pressure:'Can each team just manage its own scope?',
      recovery:'Each team can manage its scope, but the decision risk appears at the interfaces. That is why a shared framework is important.'
    },
    {
      title:'Mission 3 — Customer requirement clarification',
      context:'A customer requirement is specific and could be interpreted differently by two teams.',
      task:'Convince management to validate the interpretation before the review.',
      steps:['Name the requirement issue.','Show why interpretation matters.','Explain the risk of rework.','Recommend clarification.','Close with the benefit.'],
      model:'The point I want to clarify today concerns the interpretation of one customer requirement. The requirement is specific, but two teams may apply it differently. The risk is not immediate failure; the risk is rework and weak compliance evidence during the next review. My recommendation is to validate the interpretation with the relevant teams before we close this step. This would give us a clearer position, stronger traceability and a more credible message for the customer.',
      pressure:'Is this level of clarification really necessary?',
      recovery:'Yes, because the cost of clarification is limited now, while the cost of rework after the review could be much higher.'
    },
    {
      title:'Mission 4 — Attention recovery in a senior meeting',
      context:'You are presenting a risk update. The audience starts focusing on a technical sub-detail and the main decision is getting lost.',
      task:'Recover attention and bring the discussion back to the decision point.',
      steps:['Acknowledge the detail.','Pause.','Return to the decision.','State the impact.','Ask for the next step.'],
      model:'That technical point is relevant, and I suggest we come back to it after the decision. The main point for today is whether we accept the current compliance evidence or add one validation step. The impact is clear: validation now reduces downstream risk and strengthens the decision file. What I need from this discussion is a clear direction on how we proceed before the next milestone.',
      pressure:'But the technical detail changes the whole picture.',
      recovery:'If it changes the decision, let’s connect it directly to the risk. Otherwise, I suggest we keep the decision point first and document the detail separately.'
    }
  ]
};

const evalDefs=[
  {id:'baseline',objective:'Present role and responsibilities clearly in English',subject:'60-second professional presentation',method:'Oral production'},
  {id:'structure',objective:'Structure a decision-level executive message',subject:'Decision / reason / risk / recommendation / impact',method:'Guided oral task'},
  {id:'voice',objective:'Use voice, rhythm and pauses intentionally',subject:'Energy variation and delivery styles',method:'Oral drill'},
  {id:'presence',objective:'Use posture and energy shifts to support communication',subject:'Physical presence and authority',method:'Observed oral task'},
  {id:'recovery',objective:'Recover attention and redirect interruptions',subject:'Attention recovery role play',method:'Role play'},
  {id:'persuasion',objective:'Convince without over-explaining',subject:'Because / I recommend / so that',method:'Oral production'},
  {id:'missions',objective:'Defend a recommendation in a senior management scenario',subject:'Aerospace project mission',method:'Simulation'},
  {id:'cloe',objective:'Transfer professional communication skills to CLOE oral tasks',subject:'CLOE-style oral question',method:'Simulation'}
];
let manualStatus={};
evalDefs.forEach(d=>manualStatus[d.id]='not-started');

function populateVoices(){
  voices=speechSynthesis.getVoices()||[];
  const accent=$('#accentSelect').value;
  const select=$('#voiceSelect');
  const filtered=voices.filter(v=>v.lang&&v.lang.toLowerCase().startsWith(accent.toLowerCase()));
  const list=filtered.length?filtered:voices;
  select.innerHTML=list.map((v,i)=>`<option value="${voices.indexOf(v)}">${v.name} — ${v.lang}</option>`).join('')||'<option value="">Default browser voice</option>';
}
function selectedVoice(){
  const idx=Number($('#voiceSelect').value);
  return voices[idx]||voices.find(v=>v.lang&&v.lang.startsWith($('#accentSelect').value))||null;
}
function speakText(text,style='normal'){
  if(!('speechSynthesis' in window)){alert('Audio is not available in this browser.');return;}
  speechSynthesis.cancel();
  const chunks=String(text).split('|').map(s=>s.trim()).filter(Boolean);
  const settings={
    normal:{rate:.92,pitch:1,volume:1},
    energetic:{rate:1.03,pitch:1.12,volume:1},
    fast:{rate:1.22,pitch:1.02,volume:1},
    calm:{rate:.78,pitch:.9,volume:.95},
    firm:{rate:.86,pitch:.86,volume:1},
    paused:{rate:.82,pitch:.88,volume:1}
  }[style]||{rate:.92,pitch:1,volume:1};
  let delay=0;
  chunks.forEach((chunk,i)=>{
    setTimeout(()=>{
      const u=new SpeechSynthesisUtterance(chunk);
      u.lang=$('#accentSelect').value;
      u.voice=selectedVoice();
      u.rate=settings.rate;
      u.pitch=settings.pitch;
      u.volume=settings.volume;
      speechSynthesis.speak(u);
    },delay);
    delay += Math.max(900, chunk.length*48) + (style==='paused'?650:220);
  });
}
function renderVocab(){
  const f=$('#vocabFilter').value;
  const rows=DATA.vocab.filter(v=>f==='all'||v[0]===f);
  $('#vocabGrid').innerHTML=rows.map(v=>`<article class="vocab-card">
    <span class="tag">${v[0]}</span>
    <h3>${v[1]}</h3>
    <p class="translation"><strong>FR:</strong> ${v[2]}</p>
    <p class="definition"><strong>Meaning:</strong> ${v[3]}</p>
    <p class="sentence">${v[4]}</p>
    <div class="audio-row">
      <button class="speak secondary" data-text="${escapeAttr(v[1])}" data-style="firm">🔊 Word / phrase</button>
      <button class="speak" data-text="${escapeAttr(v[4])}" data-style="calm">🔊 Sentence</button>
    </div>
  </article>`).join('');
}
function renderFramework(){
  $('#frameworkGrid').innerHTML=DATA.framework.map((f,i)=>`<article>
    <span>${i+1}</span><h3>${f[0]}</h3><p>${f[1]}</p>
    <div class="model-block"><p>${f[2]}</p><button class="speak" data-text="${escapeAttr(f[2])}" data-style="${f[3]}">🔊 Listen</button></div>
  </article>`).join('');
}
function renderWarmups(){
  $('#warmupGrid').innerHTML=DATA.warmups.map((w,i)=>`<article class="question-card">
    <h3>Question ${i+1}</h3>
    <p class="prompt">${w.q}</p>
    <details class="note-box"><summary>Answer guide and model</summary>
      <p><strong>What a strong answer should include:</strong> ${w.guide}</p>
      <div class="model-answer"><strong>Model:</strong> ${w.model}<br><button class="speak" data-text="${escapeAttr(w.model)}" data-style="calm">🔊 Listen to model</button></div>
    </details>
  </article>`).join('');
}
function renderInterruptions(){
  $('#interruptionGrid').innerHTML=DATA.interruptions.map((it,i)=>`<article class="mission-card">
    <h3>${it.title}</h3>
    <p><span class="pill pressure">Interruption</span></p>
    <p class="script-line">“${it.interruption}”</p>
    <button class="speak secondary" data-text="${escapeAttr(it.interruption)}" data-style="fast">🔊 Listen to interruption</button>
    <button data-toggle="#interrupt${i}">Show / hide model response</button>
    <div id="interrupt${i}" class="model-block hidden">
      <p>${it.model}</p>
      <button class="speak" data-text="${escapeAttr(it.model)}" data-style="firm">🔊 Listen to response</button>
      <p class="definition"><strong>Why this works:</strong> ${it.note}</p>
    </div>
  </article>`).join('');
}
function renderPersuasion(){
  $('#persuasionGrid').innerHTML=DATA.persuasion.map((p,i)=>`<article class="mission-card">
    <h3>${p.topic}</h3>
    <p>Your structure: <strong>Because… I recommend… so that…</strong></p>
    <button data-toggle="#persuasion${i}">Show / hide model answer</button>
    <div id="persuasion${i}" class="model-block hidden">
      <p>${p.model}</p>
      <button class="speak" data-text="${escapeAttr(p.model)}" data-style="firm">🔊 Listen to model</button>
      <p class="definition"><strong>Why it works:</strong> ${p.why}</p>
    </div>
  </article>`).join('');
}
function renderMissions(){
  $('#missionGrid').innerHTML=DATA.missions.map((m,i)=>`<article class="mission-card">
    <h3>${m.title}</h3>
    <p><strong>Context:</strong> ${m.context}</p>
    <p><strong>Task:</strong> ${m.task}</p>
    <div class="mission-meta"><span class="pill">Decision</span><span class="pill">Risk</span><span class="pill">Recommendation</span><span class="pill pressure">Pressure</span></div>
    <ol class="mission-steps">${m.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
    <button data-toggle="#missionModel${i}">Show / hide full model</button>
    <button data-toggle="#missionPressure${i}">Show / hide pressure question</button>
    <div id="missionModel${i}" class="model-block hidden"><p>${m.model}</p><button class="speak" data-text="${escapeAttr(m.model)}" data-style="paused">🔊 Listen to model</button></div>
    <div id="missionPressure${i}" class="model-block hidden"><p><strong>Pressure question:</strong> ${m.pressure}</p><button class="speak secondary" data-text="${escapeAttr(m.pressure)}" data-style="fast">🔊 Listen to pressure</button><p><strong>Recovery model:</strong> ${m.recovery}</p><button class="speak" data-text="${escapeAttr(m.recovery)}" data-style="firm">🔊 Listen to recovery</button></div>
    <div class="recorder" data-recorder="mission-${i+1}"></div>
  </article>`).join('');
}
function initRecorders(){
  $$('.recorder').forEach((box,idx)=>{
    const id=box.dataset.recorder||`rec-${idx}`;
    box.innerHTML=`<h4><span class="recording-light"></span>Record yourself</h4>
      <p class="rec-status" id="status-${id}">Ready to record.</p>
      <div class="rec-controls">
        <button id="start-${id}">● Start</button>
        <button id="stop-${id}" class="secondary" disabled>■ Stop</button>
        <button id="clear-${id}" class="secondary" disabled>↺ Clear</button>
      </div>
      <audio id="audio-${id}" controls class="hidden"></audio>
      <div class="rec-controls"><a id="download-${id}" class="hidden" download="eden-${id}-recording.webm"><button type="button">⬇ Download recording</button></a></div>`;
    let chunks=[];
    const start=document.getElementById(`start-${id}`);
    const stop=document.getElementById(`stop-${id}`);
    const clear=document.getElementById(`clear-${id}`);
    const audio=document.getElementById(`audio-${id}`);
    const dl=document.getElementById(`download-${id}`);
    const status=document.getElementById(`status-${id}`);
    start.onclick=async()=>{
      try{
        const stream=await navigator.mediaDevices.getUserMedia({audio:true});
        const mr=new MediaRecorder(stream);
        mediaRecorders[id]=mr; chunks=[];
        mr.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
        mr.onstop=()=>{
          stream.getTracks().forEach(t=>t.stop());
          const blob=new Blob(chunks,{type:'audio/webm'});
          const url=URL.createObjectURL(blob);
          audio.src=url; audio.classList.remove('hidden');
          dl.href=url; dl.classList.remove('hidden'); clear.disabled=false;
          box.classList.remove('recording'); status.textContent='Recording ready. Listen back or download it.';
        };
        mr.start(); box.classList.add('recording');
        start.disabled=true; stop.disabled=false; clear.disabled=true; dl.classList.add('hidden'); audio.classList.add('hidden');
        status.textContent='Recording...';
      }catch(err){status.textContent='Microphone access was not allowed or is unavailable.';}
    };
    stop.onclick=()=>{const mr=mediaRecorders[id]; if(mr&&mr.state!=='inactive')mr.stop(); start.disabled=false; stop.disabled=true;};
    clear.onclick=()=>{audio.removeAttribute('src'); audio.classList.add('hidden'); dl.classList.add('hidden'); clear.disabled=true; status.textContent='Ready to record again.';};
  });
}
function escapeAttr(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
function surveyText(){return `Lesson 1 feedback — Eden Cohen\n\nOverall relevance: ${$('#surveyRelevance').value}\nAttention capture and recovery: ${$('#surveyAttention').value}\nVoice, accent and rhythm: ${$('#surveyVoice').value}\nPhysical presence and energy variation: ${$('#surveyPresence').value}\nSenior management role plays: ${$('#surveyMissions').value}\nPriority for next lesson: ${$('#surveyPriority').value}\n\nComments or modifications requested:\n${$('#surveyComments').value||'—'}`}
function updateSurveyOutput(){ $('#surveyOutput').textContent=surveyText(); }
function saveSurvey(){localStorage.setItem(SURVEY_KEY,JSON.stringify({relevance:$('#surveyRelevance').value,attention:$('#surveyAttention').value,voice:$('#surveyVoice').value,presence:$('#surveyPresence').value,missions:$('#surveyMissions').value,priority:$('#surveyPriority').value,comments:$('#surveyComments').value,date:new Date().toISOString()}));updateSurveyOutput();}
function loadSurvey(){try{const raw=localStorage.getItem(SURVEY_KEY);if(!raw)return;const s=JSON.parse(raw);$('#surveyRelevance').value=s.relevance||'Excellent';$('#surveyAttention').value=s.attention||'Very useful';$('#surveyVoice').value=s.voice||'Very useful';$('#surveyPresence').value=s.presence||'Very useful';$('#surveyMissions').value=s.missions||'Very useful';$('#surveyPriority').value=s.priority||'High-impact openings';$('#surveyComments').value=s.comments||'';}catch(e){}}
function renderEvaluation(){
  $('#manualGrid').innerHTML=evalDefs.map(d=>`<label>${d.objective}<select data-manual="${d.id}"><option value="not-started">Non commencé</option><option value="progress">Objectif en cours d’acquisition</option><option value="achieved">Objectif atteint</option><option value="not-achieved">Objectif non atteint</option></select></label>`).join('');
  $$('#manualGrid select').forEach(sel=>{sel.value=manualStatus[sel.dataset.manual]||'not-started';sel.onchange=()=>{manualStatus[sel.dataset.manual]=sel.value;saveProgress(false);updateEvaluationRows();};});
  updateEvaluationRows();
}
function statusLabel(s){return {'achieved':'Objectif atteint','progress':'Objectif en cours d’acquisition','not-achieved':'Objectif non atteint','not-started':'Non commencé'}[s]||s}
function updateEvaluationRows(){
  $('#evaluationRows').innerHTML=evalDefs.map(d=>{const st=manualStatus[d.id]||'not-started';return `<tr><td>${d.objective}</td><td>${d.subject}</td><td>${d.method}</td><td><span class="status ${st}">${statusLabel(st)}</span></td></tr>`}).join('');
  const completed=evalDefs.filter(d=>(manualStatus[d.id]||'not-started')!=='not-started').length;
  $('#completionRate').textContent=Math.round(completed/evalDefs.length*100)+'%';
  let overall='not-started';
  const statuses=evalDefs.map(d=>manualStatus[d.id]||'not-started');
  if(statuses.some(s=>s!=='not-started')) overall=statuses.every(s=>s==='achieved')?'achieved':statuses.some(s=>s==='not-achieved')?'not-achieved':'progress';
  const os=$('#overallStatus'); os.textContent=statusLabel(overall); os.className='status '+overall;
}
function collectProgress(){return {learner:$('#learnerName').value,trainer:$('#trainerName').value,date:$('#evaluationDate').value,manualStatus,comments:$('#trainerComments').value,lastSaved:new Date().toISOString()}}
function saveProgress(show=true){const s=collectProgress();localStorage.setItem(STORAGE_KEY,JSON.stringify(s));$('#lastSaved').textContent=new Date(s.lastSaved).toLocaleString();if(show)alert('Progress saved in this browser.');}
function loadProgress(){try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return;const s=JSON.parse(raw);manualStatus={...manualStatus,...(s.manualStatus||{})};$('#learnerName').value=s.learner||'Eden Cohen';$('#trainerName').value=s.trainer||'Tisha DOUTY-DOSIERE';$('#evaluationDate').value=s.date||new Date().toISOString().slice(0,10);$('#trainerComments').value=s.comments||'';if(s.lastSaved)$('#lastSaved').textContent=new Date(s.lastSaved).toLocaleString();}catch(e){}}
function reportText(){
  updateEvaluationRows();
  const rows=evalDefs.map(d=>`- ${d.objective}: ${statusLabel(manualStatus[d.id]||'not-started')} (${d.subject} / ${d.method})`).join('\n');
  return `Learning outcomes tracking — Qualiopi\n\nLearner: ${$('#learnerName').value}\nTrainer: ${$('#trainerName').value}\nDate: ${$('#evaluationDate').value}\nCompletion: ${$('#completionRate').textContent}\nOverall result: ${$('#overallStatus').textContent}\n\nObjectives:\n${rows}\n\nComments:\n${$('#trainerComments').value||'—'}`;
}
function downloadReadableReport(){
  saveProgress(false);
  const rows=evalDefs.map(d=>{const st=manualStatus[d.id]||'not-started';return `<tr><td>${escapeHtml(d.objective)}</td><td>${escapeHtml(d.subject)}</td><td>${escapeHtml(d.method)}</td><td>${escapeHtml(statusLabel(st))}</td></tr>`}).join('');
  const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Qualiopi - Eden Cohen - Lesson 1</title><style>body{font-family:Arial,sans-serif;max-width:1050px;margin:35px auto;padding:0 22px;color:#172033}h1{color:#0b1f3a}table{border-collapse:collapse;width:100%}th,td{border:1px solid #b8c5d3;padding:9px;vertical-align:top}th{background:#0b1f3a;color:white}.box{border:1px solid #b8c5d3;border-radius:10px;padding:12px;margin:10px 0}.comments{white-space:pre-wrap;min-height:90px}</style></head><body><h1>Learning outcomes tracking — Qualiopi</h1><div class="box"><b>Learner:</b> ${escapeHtml($('#learnerName').value)}<br><b>Trainer:</b> ${escapeHtml($('#trainerName').value)}<br><b>Date:</b> ${escapeHtml($('#evaluationDate').value)}<br><b>Completion:</b> ${escapeHtml($('#completionRate').textContent)}<br><b>Overall:</b> ${escapeHtml($('#overallStatus').textContent)}</div><table><thead><tr><th>Learning objective</th><th>Support / subject</th><th>Assessment mode</th><th>Result</th></tr></thead><tbody>${rows}</tbody></table><h2>Comments</h2><div class="box comments">${escapeHtml($('#trainerComments').value)||'—'}</div></body></html>`;
  downloadBlob(new Blob([html],{type:'text/html;charset=utf-8'}),'eden-cohen-lesson-1-qualiopi-report.html');
}
function init(){
  renderVocab();renderFramework();renderWarmups();renderInterruptions();renderPersuasion();renderMissions();initRecorders();
  if($('#evaluationDate')&&!$('#evaluationDate').value)$('#evaluationDate').value=new Date().toISOString().slice(0,10);
  if('speechSynthesis' in window){populateVoices();speechSynthesis.onvoiceschanged=populateVoices;}
  $('#accentSelect').onchange=populateVoices;
  $('#stopAudio').onclick=()=>speechSynthesis.cancel();
  $('#toggleFrench').onclick=()=>{document.body.classList.toggle('all-french');$('#toggleFrench').textContent=document.body.classList.contains('all-french')?'🇫🇷 Hide French support':'🇫🇷 Show French support';};
  $('#toggleModels').onclick=()=>{document.body.classList.toggle('all-models');$('#toggleModels').textContent=document.body.classList.contains('all-models')?'🙈 Hide all models':'👁 Show all models';};
  $('#vocabFilter').onchange=renderVocab;
  document.addEventListener('click',e=>{
    const speakBtn=e.target.closest('.speak'); if(speakBtn){speakText(speakBtn.dataset.text||'',speakBtn.dataset.style||'normal');}
    const tog=e.target.closest('[data-toggle]'); if(tog){const target=$(tog.dataset.toggle); if(target)target.classList.toggle('hidden');}
    const scroll=e.target.closest('[data-scroll]'); if(scroll){const target=$(scroll.dataset.scroll); if(target)target.scrollIntoView({behavior:'smooth'});}
  });
  loadSurvey(); updateSurveyOutput();
  ['surveyRelevance','surveyAttention','surveyVoice','surveyPresence','surveyMissions','surveyPriority','surveyComments'].forEach(id=>$('#'+id).addEventListener('input',updateSurveyOutput));
  $('#saveSurvey').onclick=()=>{saveSurvey();alert('Survey saved in this browser.');};
  $('#copySurvey').onclick=async()=>{updateSurveyOutput();await navigator.clipboard.writeText(surveyText());alert('Survey summary copied.');};
  $('#downloadSurvey').onclick=()=>downloadBlob(new Blob([surveyText()],{type:'text/plain;charset=utf-8'}),'eden-lesson-1-survey.txt');
  loadProgress(); renderEvaluation();
  $('#saveProgress').onclick=()=>saveProgress(true);
  $('#copyQualiopi').onclick=async()=>{await navigator.clipboard.writeText(reportText());alert('Qualiopi report copied.');};
  $('#downloadHtml').onclick=downloadReadableReport;
  $('#printReport').onclick=()=>{saveProgress(false);window.print();};
  $('#resetProgress').onclick=()=>{if(confirm('Reset all saved progress for this lesson?')){localStorage.removeItem(STORAGE_KEY);location.reload();}};
  $('#learnerName').oninput=()=>saveProgress(false);$('#trainerName').oninput=()=>saveProgress(false);$('#evaluationDate').oninput=()=>saveProgress(false);$('#trainerComments').oninput=()=>saveProgress(false);
}

document.addEventListener('DOMContentLoaded',init);
