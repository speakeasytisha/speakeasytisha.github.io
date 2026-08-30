(() => {
  'use strict';
  const KEY = 'thomas_lesson3_realdata_v1';
  const sections = [...document.querySelectorAll('.lesson-section')];
  const state = {
    sectionIndex: 0,
    sessionSeconds: 75 * 60,
    sessionTimer: null,
    quizCorrect: {},
    timers: new Map()
  };

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  function init(){
    makeStepDots();
    bindNav();
    bindHeader();
    bindSessionTimer();
    bindSpeech();
    bindVocabFilters();
    bindQuizzes();
    bindBuilders();
    bindMiniTimers();
    bindManualChecks();
    bindSaveFields();
    bindResets();
    bindReport();
    restore();
    setDate();
    updateBuilders();
    updateScores();
    showSection(state.sectionIndex, false);
  }

  document.addEventListener('DOMContentLoaded', init);

  function makeStepDots(){
    const nav = $('#stepDots');
    sections.forEach((s,i)=>{
      const b=document.createElement('button');
      b.type='button'; b.textContent=String(i+1);
      b.title=s.dataset.title || `Section ${i+1}`;
      b.addEventListener('click',()=>showSection(i));
      nav.appendChild(b);
    });
  }

  function bindNav(){
    $$('[data-next]').forEach(b=>b.addEventListener('click',()=>showSection(Math.min(state.sectionIndex+1,sections.length-1))));
    $('#backTop')?.addEventListener('click',()=>showSection(0));
  }

  function showSection(i, scroll=true){
    state.sectionIndex=i;
    sections.forEach((s,idx)=>s.classList.toggle('active',idx===i));
    const pct=((i+1)/sections.length)*100;
    $('#progressBar').style.width=`${pct}%`;
    $('#progressLabel').textContent=sections[i]?.dataset.title || '';
    $$('#stepDots button').forEach((b,idx)=>b.classList.toggle('active',idx===i));
    save();
    if(scroll) window.scrollTo({top:0,behavior:'smooth'});
  }

  function bindHeader(){
    $('#translationToggle')?.addEventListener('click',()=>{
      const on=document.body.classList.toggle('show-fr');
      const b=$('#translationToggle');
      b.classList.toggle('active',on); b.setAttribute('aria-pressed',String(on));
      b.textContent=on?'FR help · ON':'FR help · OFF';
      save();
    });
    $('#printButton')?.addEventListener('click',()=>window.print());
  }

  function bindSessionTimer(){
    $('#timerStart')?.addEventListener('click',()=>{
      if(state.sessionTimer) return;
      state.sessionTimer=setInterval(()=>{
        state.sessionSeconds=Math.max(0,state.sessionSeconds-1);
        updateSessionTimer();
        if(state.sessionSeconds===0) pauseSessionTimer();
      },1000);
    });
    $('#timerPause')?.addEventListener('click',pauseSessionTimer);
    $('#timerReset')?.addEventListener('click',()=>{pauseSessionTimer();state.sessionSeconds=75*60;updateSessionTimer();save();});
    updateSessionTimer();
  }
  function pauseSessionTimer(){if(state.sessionTimer){clearInterval(state.sessionTimer);state.sessionTimer=null}}
  function updateSessionTimer(){
    const m=String(Math.floor(state.sessionSeconds/60)).padStart(2,'0');
    const s=String(state.sessionSeconds%60).padStart(2,'0');
    $('#sessionTimer').textContent=`${m}:${s}`;
  }

  function bindSpeech(){
    document.addEventListener('click',e=>{
      const b=e.target.closest('.speak-button[data-speak]');
      if(b) speak(b.dataset.speak);
      const gen=e.target.closest('.speak-generated');
      if(gen) speak($('#'+gen.dataset.output)?.textContent || '');
      const copy=e.target.closest('.copy-generated');
      if(copy) copyText($('#'+copy.dataset.output)?.textContent || '');
    });
  }
  function speak(text){
    if(!('speechSynthesis' in window)){toast('Speech synthesis is not available.');return}
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    const lang=$('#accentSelect')?.value || 'en-US';
    u.lang=lang; u.rate=.92; u.pitch=1;
    const voices=speechSynthesis.getVoices();
    u.voice=voices.find(v=>v.lang===lang) || voices.find(v=>v.lang?.startsWith(lang.slice(0,2))) || null;
    speechSynthesis.speak(u);
  }

  function bindVocabFilters(){
    $('#vocabFilters')?.addEventListener('click',e=>{
      const b=e.target.closest('[data-filter]'); if(!b) return;
      $$('#vocabFilters .filter').forEach(x=>x.classList.toggle('active',x===b));
      const f=b.dataset.filter;
      $$('#vocabGrid .vocab-card').forEach(c=>c.hidden=!(f==='all'||c.dataset.cat===f));
    });
  }

  function bindQuizzes(){
    $$('.quiz-item').forEach((item,idx)=>{
      item.dataset.qid=`q${idx}`;
      $$('button[data-choice]',item).forEach(btn=>btn.addEventListener('click',()=>{
        const good=btn.dataset.choice===item.dataset.answer;
        $$('button[data-choice]',item).forEach(x=>x.classList.remove('correct','wrong'));
        btn.classList.add(good?'correct':'wrong');
        const fb=$('.feedback',item);
        fb.textContent=good?'✓ Correct':'✗ Try again';
        fb.className=`feedback ${good?'good':'bad'}`;
        if(good) state.quizCorrect[item.dataset.qid]=true;
        else delete state.quizCorrect[item.dataset.qid];
        save(); updateScores();
      }));
    });
  }

  function bindBuilders(){
    $$('[data-builder]').forEach(s=>s.addEventListener('change',()=>{updateBuilders();save()}));
  }
  function updateBuilders(){
    const g1=$$('[data-builder="g1"]').map(x=>x.value).join(' ');
    if($('#g1Output')) $('#g1Output').textContent=g1;
  }

  function bindMiniTimers(){
    $$('.timer-inline').forEach((box,idx)=>{
      const base=Number(box.dataset.seconds||60);
      box.dataset.timerId=`timer-${idx}`;
      const display=$('strong',box);
      const start=$('.timer-start',box);
      const reset=$('.timer-reset',box);
      let remaining=base, interval=null;
      const render=()=>{
        const m=String(Math.floor(remaining/60)).padStart(2,'0');
        const s=String(remaining%60).padStart(2,'0');
        display.textContent=`${m}:${s}`;
      };
      start?.addEventListener('click',()=>{
        if(interval) clearInterval(interval);
        remaining=base; render();
        interval=setInterval(()=>{
          remaining=Math.max(0,remaining-1);render();
          if(remaining===0){clearInterval(interval);interval=null;toast('Time — finish with one clear takeaway.')}
        },1000);
      });
      reset?.addEventListener('click',()=>{if(interval)clearInterval(interval);interval=null;remaining=base;render()});
      render();
    });
  }

  function bindManualChecks(){
    $$('input[data-check-score]').forEach(cb=>cb.addEventListener('change',()=>{save();updateScores()}));
  }

  function bindSaveFields(){
    $$('[data-save]').forEach(el=>{
      el.addEventListener('input',save);
      el.addEventListener('change',()=>{save(); if(el.id==='confidenceSlider') updateConfidence()});
    });
    updateConfidence();
  }

  function bindResets(){
    $$('.reset-section').forEach(btn=>btn.addEventListener('click',()=>{
      const section=btn.closest('.lesson-section'); if(!section)return;
      $$('input,textarea,select',section).forEach(el=>{
        if(el.matches('[type="checkbox"]')) el.checked=false;
        else if(el.matches('[type="range"]')) el.value=el.defaultValue || 5;
        else if(el.tagName==='SELECT') el.selectedIndex=0;
        else el.value='';
      });
      $$('.quiz-item',section).forEach(item=>{
        $$('button[data-choice]',item).forEach(x=>x.classList.remove('correct','wrong'));
        $('.feedback',item).textContent=''; $('.feedback',item).className='feedback';
        delete state.quizCorrect[item.dataset.qid];
      });
      updateBuilders(); updateConfidence(); save(); updateScores(); toast('Section reset.');
    }));
    $('#resetAll')?.addEventListener('click',()=>{
      if(!confirm('Reset the whole lesson and delete saved progress?')) return;
      localStorage.removeItem(KEY); location.reload();
    });
  }

  function scoresBySkill(){
    const out={technical:[0,0],graphlang:[0,0],graph1:[0,0],graph2:[0,0]};
    $$('.quiz-item').forEach(item=>{
      const skill=item.dataset.skill;
      if(out[skill]){
        out[skill][1]+=1;
        if(state.quizCorrect[item.dataset.qid]) out[skill][0]+=1;
      }
    });
    return out;
  }
  function updateScores(){
    const by=scoresBySkill();
    const manual=$$('input[data-check-score]:checked').length;
    const manualTotal=$$('input[data-check-score]').length;
    setText('scoreTechnical',`${by.technical[0]} / ${by.technical[1]}`);
    setText('scoreGraphlang',`${by.graphlang[0]} / ${by.graphlang[1]}`);
    setText('scoreGraph1',`${by.graph1[0]} / ${by.graph1[1]}`);
    setText('scoreGraph2',`${by.graph2[0]} / ${by.graph2[1]}`);
    setText('scoreManual',`${manual} / ${manualTotal}`);
    const autoCorrect=Object.values(by).reduce((a,x)=>a+x[0],0);
    const autoTotal=Object.values(by).reduce((a,x)=>a+x[1],0);
    setText('scoreTop',`${autoCorrect+manual} / ${autoTotal+manualTotal}`);
    updateReportPreview();
  }
  function setText(id,text){if($('#'+id)) $('#'+id).textContent=text}

  function bindReport(){
    $('#confidenceSlider')?.addEventListener('input',()=>{updateConfidence();save();updateReportPreview()});
    $('#copyReport')?.addEventListener('click',()=>copyText(buildReportText()));
    $('#downloadReport')?.addEventListener('click',downloadReport);
    $('#printReport')?.addEventListener('click',()=>window.print());
  }
  function updateConfidence(){if($('#confidenceValue')&&$('#confidenceSlider'))$('#confidenceValue').textContent=`${$('#confidenceSlider').value} / 10`}
  function buildReportData(){
    const by=scoresBySkill();
    const manual=$$('input[data-check-score]:checked').length;
    const manualTotal=$$('input[data-check-score]').length;
    return {
      date:$('#dateStamp')?.textContent||'',
      technical:`${by.technical[0]} / ${by.technical[1]}`,
      graphlang:`${by.graphlang[0]} / ${by.graphlang[1]}`,
      graph1:`${by.graph1[0]} / ${by.graph1[1]}`,
      graph2:`${by.graph2[0]} / ${by.graph2[1]}`,
      manual:`${manual} / ${manualTotal}`,
      statuses:$$('.manual-evaluation select').map(s=>`${s.parentElement.childNodes[0].textContent.trim()}: ${s.value}`),
      strengths:$('[data-save="report-strengths"]')?.value.trim()||'—',
      focus:$('[data-save="report-focus"]')?.value.trim()||'—',
      next:$('[data-save="report-next"]')?.value.trim()||'—',
      confidence:$('#confidenceSlider')?.value||'5'
    };
  }
  function buildReportText(){
    const d=buildReportData();
    return `THOMAS BECCARDI — LESSON 3 — TECHNICAL ENGLISH & REAL DATA
${d.date}

OBJECTIVES
• Explain an HPT component using location → function → importance.
• Analyse a stacked bar chart and identify the main contributor.
• Compare actual results with targets on a multi-series line graph.
• Deliver a structured 5-minute October kickoff.
• Handle follow-up questions with evidence and a next step.

AUTOMATIC / OBSERVABLE EVIDENCE
Technical system language: ${d.technical}
Graph structures (from / to / by / at): ${d.graphlang}
Real Graph 1 analysis: ${d.graph1}
Real Graph 2 analysis: ${d.graph2}
Manual speaking checkpoints: ${d.manual}

TRAINER STATUS
${d.statuses.join('\n')}

STRENGTHS
${d.strengths}

POINTS TO REINFORCE
${d.focus}

NEXT LESSON PRIORITY
${d.next}

CONFIDENCE PRESENTING PROFESSIONAL DATA
${d.confidence} / 10

REAL PROFESSIONAL TRANSFER
Graph 1: Average NNC processing time — stacked bar chart.
Graph 2: SPT DHP CFM Hors 5A — actual vs target.
October milestone: 5-minute kickoff + Q&A.

CFL Welcome · SpeakEasyTisha · Progression visible`;
  }
  function updateReportPreview(){if($('#reportPreview'))$('#reportPreview').textContent=buildReportText()}
  function downloadReport(){
    const text=buildReportText();
    const html=`<!doctype html><html><head><meta charset="utf-8"><title>Thomas Lesson 3 Report</title><style>body{font-family:Arial,sans-serif;background:#fffaf0;color:#222;line-height:1.55;margin:0}.page{max-width:900px;margin:28px auto;background:#fff;border:1px solid #e9e2d5;border-radius:20px;overflow:hidden}.head{background:#111;color:#fff;padding:26px;border-bottom:6px solid #f2b822}.head small{color:#f2b822;font-weight:bold;letter-spacing:.1em}.body{padding:26px}pre{white-space:pre-wrap;font:14px/1.6 Arial,sans-serif}.foot{padding:18px 26px;background:#111;color:#ddd;font-size:12px}@media print{.page{margin:0;max-width:none;border:0;border-radius:0}}</style></head><body><div class="page"><div class="head"><small>CFL WELCOME · LESSON 3</small><h1>Thomas Beccardi</h1><p>Technical English & Real Data</p></div><div class="body"><pre>${escapeHtml(text)}</pre></div><div class="foot">SpeakEasyTisha · Qualiopi progress evidence</div></div></body></html>`;
    const blob=new Blob([html],{type:'text/html;charset=utf-8'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Thomas-Lesson-3-Progress-Report.html';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),800);
    toast('HTML report downloaded.');
  }

  function save(){
    const data={
      sectionIndex:state.sectionIndex,
      sessionSeconds:state.sessionSeconds,
      showFr:document.body.classList.contains('show-fr'),
      quizCorrect:state.quizCorrect,
      fields:{},
      checks:{}
    };
    $$('[data-save]').forEach(el=>data.fields[el.dataset.save]=el.value);
    $$('input[data-check-score]').forEach((el,i)=>data.checks[i]=el.checked);
    try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}
  }
  function restore(){
    try{
      const d=JSON.parse(localStorage.getItem(KEY)||'null'); if(!d)return;
      state.sectionIndex=Math.min(Number(d.sectionIndex)||0,sections.length-1);
      state.sessionSeconds=Number.isFinite(d.sessionSeconds)?d.sessionSeconds:75*60;
      state.quizCorrect=d.quizCorrect||{};
      document.body.classList.toggle('show-fr',d.showFr!==false);
      const tb=$('#translationToggle'); if(tb){tb.classList.toggle('active',d.showFr!==false);tb.textContent=d.showFr===false?'FR help · OFF':'FR help · ON'}
      $$('[data-save]').forEach(el=>{if(d.fields && d.fields[el.dataset.save]!==undefined)el.value=d.fields[el.dataset.save]});
      $$('input[data-check-score]').forEach((el,i)=>{el.checked=!!(d.checks&&d.checks[i])});
      $$('.quiz-item').forEach(item=>{
        if(state.quizCorrect[item.dataset.qid]){
          const btn=$(`button[data-choice="${item.dataset.answer}"]`,item);
          btn?.classList.add('correct');
          const fb=$('.feedback',item); if(fb){fb.textContent='✓ Correct';fb.className='feedback good'}
        }
      });
      updateSessionTimer(); updateConfidence();
    }catch(e){}
  }

  function copyText(text){
    if(!text.trim()){toast('Nothing to copy.');return}
    navigator.clipboard?.writeText(text).then(()=>toast('Copied.')).catch(()=>{
      const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast('Copied.');
    });
  }
  function setDate(){
    if($('#dateStamp')) $('#dateStamp').textContent=new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'long',year:'numeric'}).format(new Date());
  }
  function toast(msg){
    const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._to);t._to=setTimeout(()=>t.classList.remove('show'),1800);
  }
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
})();