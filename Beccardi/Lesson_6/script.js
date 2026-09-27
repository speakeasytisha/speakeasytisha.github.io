(() => {
  'use strict';
  const KEY = 'thomas_kaizen_updated_v1';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const sections = $$('.lesson-section');
  const state = { sectionIndex:0, sessionSeconds:75*60, sessionTimer:null, quizCorrect:{}, orderDone:false };

  const vocab = [
    {cat:'kpi',icon:'🎯',en:'P90 lead time',fr:'délai P90',ex:'Our current P90 NNC lead time is 12 days.'},
    {cat:'kpi',icon:'⏱️',en:'lead time',fr:'délai / temps de traversée',ex:'The target lead time is 48 hours.'},
    {cat:'kpi',icon:'📍',en:'current state',fr:'état actuel',ex:'The current state is 288 hours.'},
    {cat:'kpi',icon:'🏁',en:'target / objective',fr:'objectif',ex:'Our target is to reach 48 hours.'},
    {cat:'kpi',icon:'↔️',en:'gap to target',fr:"écart par rapport à l'objectif",ex:'We need to close the gap to target.'},
    {cat:'kpi',icon:'⬇️',en:'reduce from … to …',fr:'réduire de … à …',ex:'We need to reduce the lead time from 12 days to 2 days.'},
    {cat:'kpi',icon:'➖',en:'reduce by',fr:'réduire de (quantité)',ex:'The lead time needs to decrease by 240 hours.'},
    {cat:'kpi',icon:'📦',en:'on-time delivery',fr:'livraison dans les délais',ex:'The long processing time can affect on-time delivery.'},
    {cat:'kpi',icon:'🔁',en:'reworked part',fr:'pièce retouchée / reprise',ex:'The expected lead time for reworked parts is 31 days.'},

    {cat:'scope',icon:'✅',en:'in scope',fr:'dans le périmètre',ex:'Nozzle and blade parts are in scope.'},
    {cat:'scope',icon:'⛔',en:'out of scope',fr:'hors périmètre',ex:'GE Engineering analysis cases are out of scope.'},
    {cat:'scope',icon:'🧭',en:'project boundary',fr:'limite du périmètre projet',ex:'Let me clarify the project boundary.'},
    {cat:'scope',icon:'🌀',en:'nozzle',fr:'distributeur / tuyère selon le contexte',ex:'The scope includes nozzle and blade parts.'},
    {cat:'scope',icon:'🛠️',en:'blade',fr:'aube',ex:'The project covers the specified blade population.'},
    {cat:'scope',icon:'🧩',en:'parts oriented scrap / PNR',fr:'terme interne — conserver la terminologie approuvée',ex:'The in-scope population includes parts oriented scrap / PNR as stated in the deck.'},
    {cat:'scope',icon:'🧪',en:'GE Engineering analysis case / CSC case',fr:"cas d'analyse GE Engineering / CSC",ex:'CSC cases are excluded from this Kaizen.'},

    {cat:'roles',icon:'👤',en:'Kaizen Leader',fr:'pilote / leader Kaizen',ex:'I am leading the Kaizen project.'},
    {cat:'roles',icon:'👥',en:'deputy',fr:'adjoint(e)',ex:'I am supported by the deputy.'},
    {cat:'roles',icon:'🧭',en:'facilitator',fr:'facilitateur / facilitatrice',ex:'The facilitators support the improvement method.'},
    {cat:'roles',icon:'🌱',en:'fresh eye',fr:'regard neuf',ex:'Fresh-eye contributors bring an external perspective.'},
    {cat:'roles',icon:'🔀',en:'cross-functional team',fr:'équipe transverse / pluridisciplinaire',ex:'This is a cross-functional team.'},
    {cat:'roles',icon:'📊',en:'data leader',fr:'référent données',ex:'The data leader supports measurement and analysis.'},
    {cat:'roles',icon:'🏭',en:'production supervisor',fr:'superviseur de production',ex:'Production is represented in the team.'},
    {cat:'roles',icon:'📦',en:'procurement manager',fr:'responsable achats / approvisionnement',ex:'Procurement is represented in the team.'},
    {cat:'roles',icon:'🔎',en:'inspector',fr:'inspecteur / contrôle',ex:'Inspection is represented in the project team.'},
    {cat:'roles',icon:'🔗',en:'supply chain leader',fr:'responsable supply chain',ex:'The supply chain function brings an end-to-end view.'},

    {cat:'process',icon:'🚨',en:'detect a non-conformity',fr:'détecter une non-conformité',ex:'First, the non-conformity is detected.'},
    {cat:'process',icon:'📝',en:'create an NNC',fr:'créer une NNC',ex:'An NNC is then created.'},
    {cat:'process',icon:'🏷️',en:'characterize',fr:'caractériser',ex:'The NNC is characterized before analysis.'},
    {cat:'process',icon:'🔬',en:'analyse',fr:'analyser',ex:'Next, the NNC is analysed.'},
    {cat:'process',icon:'🧰',en:'handle an NNC',fr:'traiter / prendre en charge une NNC',ex:'The NNC is handled before production restarts.'},
    {cat:'process',icon:'▶️',en:'production restart',fr:'redémarrage de la production',ex:'Finally, production restarts.'},
    {cat:'process',icon:'🤝',en:'handoff',fr:'passage de relais / transfert entre fonctions',ex:'The map makes cross-functional handoffs visible.'},
    {cat:'process',icon:'⌛',en:'waiting time',fr:"temps d'attente",ex:'We need to understand where waiting time accumulates.'},
    {cat:'process',icon:'🗺️',en:'current-state map',fr:"cartographie de l'état actuel",ex:'The current-state map visualizes the end-to-end flow.'},
    {cat:'process',icon:'📏',en:'measurement gap',fr:'manque de mesure / donnée manquante',ex:'Some measurement gaps still need to be closed.'},
    {cat:'process',icon:'🚧',en:'bottleneck',fr:"goulot d'étranglement",ex:'We should confirm the timing data before naming the bottleneck.'},

    {cat:'kaizen',icon:'🚀',en:'kick-off',fr:'lancement',ex:'The kick-off took place on 26 June.'},
    {cat:'kaizen',icon:'📐',en:'Define',fr:'Définir',ex:'The Define milestone is part of the project plan.'},
    {cat:'kaizen',icon:'📏',en:'Measure',fr:'Mesurer',ex:'Measure and Analyse are scheduled for 30 September.'},
    {cat:'kaizen',icon:'🔍',en:'Analyse',fr:'Analyser',ex:'The team will use the data to analyse the delays.'},
    {cat:'kaizen',icon:'🛠️',en:'Improve / Shinweek',fr:'Améliorer / Shinweek',ex:'Improve / Shinweek is scheduled for 16 October.'},
    {cat:'kaizen',icon:'🛡️',en:'Control',fr:'Contrôler / pérenniser',ex:'Results will be controlled at +30, +60 and +90 days.'},
    {cat:'kaizen',icon:'📅',en:'milestone',fr:'jalon',ex:'The next milestone is Measure / Analyse.'},

    {cat:'presentation',icon:'💡',en:'the key point is…',fr:'le point essentiel est…',ex:'The key point is the gap between 12 days and 2 days.'},
    {cat:'presentation',icon:'🧱',en:'in terms of scope…',fr:'en ce qui concerne le périmètre…',ex:'In terms of scope, we are focusing on the specified turbine population.'},
    {cat:'presentation',icon:'🔁',en:'coming back to…',fr:'pour revenir à…',ex:'Coming back to the target, our objective is 48 hours.'},
    {cat:'presentation',icon:'🧾',en:'based on the slide…',fr:"d'après la diapositive…",ex:'Based on the slide, CSC cases represent about 2%.'},
    {cat:'presentation',icon:'⚖️',en:'the slide does not show…',fr:'la diapositive ne montre pas…',ex:'The slide does not show the root cause yet.'},
    {cat:'presentation',icon:'🛑',en:'I would avoid speculating',fr:"j'éviterais de spéculer",ex:'I would avoid speculating until the timing data is confirmed.'},
    {cat:'presentation',icon:'➡️',en:'the next step is…',fr:"l'étape suivante est…",ex:'The next step is to close the measurement gaps.'}
  ];

  const catLabels={kpi:'KPI & performance',scope:'Scope & parts',roles:'Team & roles',process:'NNC process',kaizen:'Kaizen timeline',presentation:'Presentation & Q&A'};
  const processSteps=['Detect and create NNC','Characterize NNC','Analyse NNC','Handle NNC','Production re-start'];
  let orderSelected=[];

  function init(){
    makeStepDots(); bindNav(); bindHeader(); bindSessionTimer(); bindSpeech(); renderVocab(); bindVocab(); bindQuizzes(); bindHints(); bindMiniTimers(); bindManualChecks(); bindSaveFields(); bindBuilders(); bindOrder(); bindResets(); bindReport(); restore(); setDate(); updateBuilders(); updateScores(); showSection(state.sectionIndex,false);
  }
  document.addEventListener('DOMContentLoaded',init);

  function makeStepDots(){const nav=$('#stepDots');sections.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.textContent=i+1;b.title=s.dataset.title||`Section ${i+1}`;b.addEventListener('click',()=>showSection(i));nav.appendChild(b)})}
  function bindNav(){$$('[data-next]').forEach(b=>b.addEventListener('click',()=>showSection(Math.min(state.sectionIndex+1,sections.length-1))));$('#backTop')?.addEventListener('click',()=>showSection(0))}
  function showSection(i,scroll=true){state.sectionIndex=i;sections.forEach((s,idx)=>s.classList.toggle('active',idx===i));$('#progressBar').style.width=`${((i+1)/sections.length)*100}%`;$('#progressLabel').textContent=sections[i]?.dataset.title||'';$$('#stepDots button').forEach((b,idx)=>b.classList.toggle('active',idx===i));save();if(scroll)window.scrollTo({top:0,behavior:'smooth'})}

  function bindHeader(){
    $('#translationToggle')?.addEventListener('click',()=>{const on=document.body.classList.toggle('show-fr');const b=$('#translationToggle');b.classList.toggle('active',on);b.setAttribute('aria-pressed',on);b.textContent=on?'FR help · ON':'FR help · OFF';save()});
    $('#coachToggle')?.addEventListener('click',()=>{const coach=document.body.classList.toggle('coach-mode');document.body.classList.toggle('rehearsal-mode',!coach);const b=$('#coachToggle');b.classList.toggle('active',coach);b.setAttribute('aria-pressed',coach);b.textContent=coach?'Coach mode':'Rehearsal mode';toast(coach?'Coach mode: hints and models available.':'Rehearsal mode: hints and models hidden.');save()});
    $('#transcriptToggle')?.addEventListener('click',()=>{const on=document.body.classList.toggle('show-transcript');const b=$('#transcriptToggle');b.classList.toggle('active',on);b.setAttribute('aria-pressed',on);b.textContent=on?'Transcript · ON':'Transcript · OFF';save()});
    $('#stopAudio')?.addEventListener('click',()=>{if('speechSynthesis'in window)speechSynthesis.cancel()});
    $('#printButton')?.addEventListener('click',()=>window.print());
  }

  function bindSessionTimer(){
    $('#timerStart')?.addEventListener('click',()=>{if(state.sessionTimer)return;state.sessionTimer=setInterval(()=>{state.sessionSeconds=Math.max(0,state.sessionSeconds-1);updateSessionTimer();if(state.sessionSeconds===0)pauseSessionTimer()},1000)});
    $('#timerPause')?.addEventListener('click',pauseSessionTimer);$('#timerReset')?.addEventListener('click',()=>{pauseSessionTimer();state.sessionSeconds=75*60;updateSessionTimer();save()});updateSessionTimer()
  }
  function pauseSessionTimer(){if(state.sessionTimer){clearInterval(state.sessionTimer);state.sessionTimer=null}}
  function updateSessionTimer(){const m=String(Math.floor(state.sessionSeconds/60)).padStart(2,'0');const s=String(state.sessionSeconds%60).padStart(2,'0');$('#sessionTimer').textContent=`${m}:${s}`}

  function bindSpeech(){document.addEventListener('click',e=>{const b=e.target.closest('.speak-button[data-speak]');if(b)speak(b.dataset.speak);const g=e.target.closest('.speak-generated');if(g)speak($('#'+g.dataset.output)?.textContent||'');const c=e.target.closest('.copy-generated');if(c)copyText($('#'+c.dataset.output)?.textContent||'')})}
  function speak(text){if(!('speechSynthesis'in window)){toast('Speech synthesis is not available in this browser.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);const lang=$('#accentSelect')?.value||'en-US';u.lang=lang;u.rate=.9;u.pitch=1;const choose=()=>{const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang===lang)||voices.find(v=>v.lang?.startsWith(lang.slice(0,2)))||null;speechSynthesis.speak(u)};if(speechSynthesis.getVoices().length)choose();else{speechSynthesis.onvoiceschanged=()=>{speechSynthesis.onvoiceschanged=null;choose()};setTimeout(()=>{if(!speechSynthesis.speaking)choose()},250)}}

  function renderVocab(filter='all'){const grid=$('#vocabGrid');if(!grid)return;const items=vocab.filter(v=>filter==='all'||v.cat===filter);grid.innerHTML=items.map(v=>`<article class="vocab-card"><div class="vocab-head"><span class="icon">${v.icon}</span><h3>${escapeHtml(v.en)}</h3></div><p class="fr-term">${escapeHtml(v.fr)}</p><p class="example">“${escapeHtml(v.ex)}”</p><button class="mini-button speak-button" data-speak="${escapeAttr(v.en+'. '+v.ex)}" type="button">🔊 Listen</button><span class="cat-pill">${escapeHtml(catLabels[v.cat])}</span></article>`).join('');$('#vocabCount').textContent=`${items.length} terms`}
  function bindVocab(){$('#vocabCategory')?.addEventListener('change',e=>renderVocab(e.target.value))}

  function bindQuizzes(){$$('.quiz-item').forEach((item,idx)=>{item.dataset.qid=`q${idx}`;$$('button[data-choice]',item).forEach(btn=>btn.addEventListener('click',()=>{const good=btn.dataset.choice===item.dataset.answer;$$('button[data-choice]',item).forEach(x=>x.classList.remove('correct','wrong'));btn.classList.add(good?'correct':'wrong');const fb=$('.feedback',item);fb.textContent=good?`✓ Correct — ${item.dataset.why||'Good choice.'}`:`✗ Not yet — ${item.dataset.why||'Try again.'}`;fb.className=`feedback ${good?'good':'bad'}`;if(good)state.quizCorrect[item.dataset.qid]=true;else delete state.quizCorrect[item.dataset.qid];save();updateScores()}))})}
  function bindHints(){document.addEventListener('click',e=>{const b=e.target.closest('.hint-button');if(!b)return;if(b.hasAttribute('data-order-hint')){$('#orderHint')?.classList.toggle('show');return}const h=b.parentElement.querySelector('.hint');h?.classList.toggle('show')})}

  function bindMiniTimers(){$$('.timer-inline').forEach(box=>{const base=Number(box.dataset.seconds||60),display=$('strong',box),start=$('.timer-start',box),reset=$('.timer-reset',box);let remaining=base,interval=null;const render=()=>{display.textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`};start?.addEventListener('click',()=>{if(interval)clearInterval(interval);remaining=base;render();interval=setInterval(()=>{remaining=Math.max(0,remaining-1);render();if(remaining===0){clearInterval(interval);interval=null;toast('Time — finish with one clear takeaway.')}},1000)});reset?.addEventListener('click',()=>{if(interval)clearInterval(interval);interval=null;remaining=base;render()});render()})}

  function bindManualChecks(){$$('input[data-check-score]').forEach(cb=>cb.addEventListener('change',()=>{save();updateScores()}))}
  function bindSaveFields(){$$('[data-save]').forEach(el=>{el.addEventListener('input',save);el.addEventListener('change',()=>{save();if(el.id==='confidenceSlider')updateConfidence()})});updateConfidence()}
  function bindBuilders(){$$('[data-builder]').forEach(s=>s.addEventListener('change',()=>{updateBuilders();save()}))}
  function updateBuilders(){const text=$$('[data-builder="deck"]').map(x=>x.value).join('\n\n');if($('#deckOutput'))$('#deckOutput').textContent=text}

  function bindOrder(){renderOrder();$('#checkOrder')?.addEventListener('click',()=>{const good=orderSelected.join('|')===processSteps.join('|');const f=$('#orderFeedback');f.textContent=good?'✓ Correct — you have the five-step macro process in the right order.':'✗ Not yet — check what must happen before analysis and what happens last.';f.className=`feedback ${good?'good':'bad'}`;state.orderDone=good;save();updateScores()});$('#resetOrder')?.addEventListener('click',()=>{orderSelected=[];state.orderDone=false;renderOrder();$('#orderFeedback').textContent='';save();updateScores()})}
  function renderOrder(){const pool=$('.order-pool'),out=$('.order-output>div');if(!pool||!out)return;const shuffled=['Analyse NNC','Production re-start','Detect and create NNC','Handle NNC','Characterize NNC'];pool.innerHTML=shuffled.map(s=>`<button class="order-chip ${orderSelected.includes(s)?'used':''}" data-step="${escapeAttr(s)}" type="button">${escapeHtml(s)}</button>`).join('');out.innerHTML=orderSelected.map((s,i)=>`<button class="order-chip" data-remove="${i}" type="button">${i+1}. ${escapeHtml(s)}</button>`).join('');$$('[data-step]',pool).forEach(b=>b.addEventListener('click',()=>{if(!orderSelected.includes(b.dataset.step)){orderSelected.push(b.dataset.step);renderOrder()}}));$$('[data-remove]',out).forEach(b=>b.addEventListener('click',()=>{orderSelected.splice(Number(b.dataset.remove),1);renderOrder()}))}

  function bindResets(){$$('.reset-section').forEach(btn=>btn.addEventListener('click',()=>{const section=btn.closest('.lesson-section');if(!section)return;$$('input,textarea,select',section).forEach(el=>{if(el.matches('[type="checkbox"]'))el.checked=false;else if(el.matches('[type="range"]'))el.value=el.defaultValue||5;else if(el.tagName==='SELECT')el.selectedIndex=0;else el.value=''});$$('.quiz-item',section).forEach(item=>{$$('button[data-choice]',item).forEach(x=>x.classList.remove('correct','wrong'));const fb=$('.feedback',item);if(fb){fb.textContent='';fb.className='feedback'}delete state.quizCorrect[item.dataset.qid]});$$('.hint',section).forEach(h=>h.classList.remove('show'));if(section.id==='process'){orderSelected=[];state.orderDone=false;renderOrder();if($('#orderFeedback'))$('#orderFeedback').textContent=''}if(section.id==='vocabulary'){renderVocab('all')}updateBuilders();updateConfidence();save();updateScores();toast('Section reset.')}));$('#resetAll')?.addEventListener('click',()=>{if(!confirm('Reset the whole lesson and delete saved progress?'))return;localStorage.removeItem(KEY);location.reload()})}

  function scoresBySkill(){const keys=['update','kpi','roles','scope','timeline','process','evidence'];const out=Object.fromEntries(keys.map(k=>[k,[0,0]]));$$('.quiz-item').forEach(item=>{const skill=item.dataset.skill;if(out[skill]){out[skill][1]++;if(state.quizCorrect[item.dataset.qid])out[skill][0]++}});if(out.process){out.process[1]++;if(state.orderDone)out.process[0]++}return out}
  function updateScores(){const by=scoresBySkill(),manual=$$('input[data-check-score]:checked').length,manualTotal=$$('input[data-check-score]').length;const ids={update:'scoreUpdate',kpi:'scoreKpi',roles:'scoreRoles',scope:'scoreScope',timeline:'scoreTimeline',process:'scoreProcess',evidence:'scoreEvidence'};Object.entries(ids).forEach(([k,id])=>setText(id,`${by[k][0]} / ${by[k][1]}`));setText('scoreManual',`${manual} / ${manualTotal}`);const autoCorrect=Object.values(by).reduce((a,x)=>a+x[0],0),autoTotal=Object.values(by).reduce((a,x)=>a+x[1],0);setText('scoreTop',`${autoCorrect+manual} / ${autoTotal+manualTotal}`);updateReportPreview()}
  function setText(id,text){if($('#'+id))$('#'+id).textContent=text}

  function bindReport(){$('#confidenceSlider')?.addEventListener('input',()=>{updateConfidence();save();updateReportPreview()});$('#copyReport')?.addEventListener('click',()=>copyText(buildReportText()));$('#downloadReport')?.addEventListener('click',downloadReport);$('#printReport')?.addEventListener('click',()=>window.print())}
  function updateConfidence(){if($('#confidenceValue')&&$('#confidenceSlider'))$('#confidenceValue').textContent=`${$('#confidenceSlider').value} / 10`}
  function buildReportText(){const by=scoresBySkill(),manual=$$('input[data-check-score]:checked').length,manualTotal=$$('input[data-check-score]').length,statuses=$$('.manual-evaluation select').map(s=>`${s.parentElement.childNodes[0].textContent.trim()}: ${s.value}`);return `THOMAS BECCARDI — UPDATED KAIZEN #3 PRESENTATION LAB\n${$('#dateStamp')?.textContent||''}\n\nOBJECTIVES\n• Present the updated P90 NNC lead-time KPI accurately.\n• Explain team structure and project scope without reading the slide.\n• Present the five-step NNC macro process using clear sequence language and passive voice.\n• Describe the current-state map while separating evidence from assumptions.\n• Deliver a structured 5-minute presentation and handle follow-up questions.\n\nAUTOMATIC EVIDENCE\nCritical update: ${by.update[0]} / ${by.update[1]}\nKPI & numbers: ${by.kpi[0]} / ${by.kpi[1]}\nTeam & roles: ${by.roles[0]} / ${by.roles[1]}\nScope: ${by.scope[0]} / ${by.scope[1]}\nTimeline: ${by.timeline[0]} / ${by.timeline[1]}\nProcess / passive: ${by.process[0]} / ${by.process[1]}\nEvidence vs assumption: ${by.evidence[0]} / ${by.evidence[1]}\nManual speaking checkpoints: ${manual} / ${manualTotal}\n\nTRAINER STATUS\n${statuses.join('\n')}\n\nSTRENGTHS\n${$('[data-save="report-strengths"]')?.value.trim()||'—'}\n\nPOINTS TO REINFORCE\n${$('[data-save="report-focus"]')?.value.trim()||'—'}\n\nNEXT REHEARSAL PRIORITY\n${$('[data-save="report-next"]')?.value.trim()||'—'}\n\nCONFIDENCE PRESENTING THE UPDATED DECK\n${$('#confidenceSlider')?.value||5} / 10\n\nSOURCE-DECK TRANSFER\n• P90 NNC lead time: 288 h / 12 days → target 48 h / 2 days.\n• Expected lead time for reworked parts in the problem statement: 31 days.\n• Scope: specified nozzle and blade population for CFM56 & LEAP; GE Engineering analysis / CSC cases excluded.\n• Macro process: detect/create → characterize → analyse → handle → production restart.\n• Planning: Kick-off 26/06/2026; Define 30/07/2026; Measure/Analyse 30/09/2026; Improve/Shinweek 16/10/2026; Control +30/+60/+90.\n\nC2 CONFIDENTIAL — keep this training material private.\nCFL Welcome · SpeakEasyTisha · Progression visible`;}
  function updateReportPreview(){if($('#reportPreview'))$('#reportPreview').textContent=buildReportText()}
  function downloadReport(){const text=buildReportText();const html=`<!doctype html><html><head><meta charset="utf-8"><title>Thomas Updated Kaizen Report</title><style>body{font-family:Arial,sans-serif;background:#fffaf0;color:#222;line-height:1.55;margin:0}.page{max-width:900px;margin:28px auto;background:#fff;border:1px solid #e9e2d5;border-radius:20px;overflow:hidden}.head{background:#111;color:#fff;padding:26px;border-bottom:6px solid #f2b822}.head small{color:#f2b822;font-weight:bold;letter-spacing:.1em}.body{padding:26px}pre{white-space:pre-wrap;font:14px/1.6 Arial,sans-serif}.warn{padding:12px 26px;background:#fff3c8;font-weight:bold}.foot{padding:18px 26px;background:#111;color:#ddd;font-size:12px}@media print{.page{margin:0;max-width:none;border:0;border-radius:0}}</style></head><body><div class="page"><div class="head"><small>CFL WELCOME · UPDATED KAIZEN #3</small><h1>Thomas Beccardi</h1><p>Presentation English Progress Report</p></div><div class="warn">C2 Confidential — keep private.</div><div class="body"><pre>${escapeHtml(text)}</pre></div><div class="foot">SpeakEasyTisha · Qualiopi progress evidence</div></div></body></html>`;const blob=new Blob([html],{type:'text/html;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Thomas-Updated-Kaizen-Progress-Report.html';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),800);toast('HTML report downloaded.')}

  function save(){const data={sectionIndex:state.sectionIndex,sessionSeconds:state.sessionSeconds,showFr:document.body.classList.contains('show-fr'),coach:document.body.classList.contains('coach-mode'),transcript:document.body.classList.contains('show-transcript'),quizCorrect:state.quizCorrect,orderDone:state.orderDone,orderSelected,fields:{},checks:{}};$$('[data-save]').forEach(el=>data.fields[el.dataset.save]=el.value);$$('input[data-check-score]').forEach((el,i)=>data.checks[i]=el.checked);try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}}
  function restore(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(!d)return;state.sectionIndex=Math.min(Number(d.sectionIndex)||0,sections.length-1);state.sessionSeconds=Number.isFinite(d.sessionSeconds)?d.sessionSeconds:75*60;state.quizCorrect=d.quizCorrect||{};state.orderDone=!!d.orderDone;orderSelected=Array.isArray(d.orderSelected)?d.orderSelected:[];document.body.classList.toggle('show-fr',d.showFr!==false);document.body.classList.toggle('coach-mode',d.coach!==false);document.body.classList.toggle('rehearsal-mode',d.coach===false);document.body.classList.toggle('show-transcript',!!d.transcript);const tr=$('#translationToggle');if(tr){tr.classList.toggle('active',d.showFr!==false);tr.textContent=d.showFr===false?'FR help · OFF':'FR help · ON'}const co=$('#coachToggle');if(co){co.classList.toggle('active',d.coach!==false);co.textContent=d.coach===false?'Rehearsal mode':'Coach mode'}const tt=$('#transcriptToggle');if(tt){tt.classList.toggle('active',!!d.transcript);tt.textContent=d.transcript?'Transcript · ON':'Transcript · OFF'}$$('[data-save]').forEach(el=>{if(d.fields&&d.fields[el.dataset.save]!==undefined)el.value=d.fields[el.dataset.save]});$$('input[data-check-score]').forEach((el,i)=>el.checked=!!(d.checks&&d.checks[i]));$$('.quiz-item').forEach(item=>{if(state.quizCorrect[item.dataset.qid]){const btn=$(`button[data-choice="${item.dataset.answer}"]`,item);btn?.classList.add('correct');const fb=$('.feedback',item);if(fb){fb.textContent=`✓ Correct — ${item.dataset.why||'Good choice.'}`;fb.className='feedback good'}}});renderOrder();updateSessionTimer();updateConfidence()}catch(e){}}

  function copyText(text){if(!text.trim()){toast('Nothing to copy.');return}navigator.clipboard?.writeText(text).then(()=>toast('Copied.')).catch(()=>{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast('Copied.')})}
  function setDate(){if($('#dateStamp'))$('#dateStamp').textContent=new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'long',year:'numeric'}).format(new Date())}
  function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(t._to);t._to=setTimeout(()=>t.classList.remove('show'),1900)}
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function escapeAttr(s){return escapeHtml(s).replace(/\n/g,' ')}
})();
