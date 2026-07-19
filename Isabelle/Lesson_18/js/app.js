(function(){
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  const norm=s=>String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();
  function toast(message){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)}
  function speak(text){if(!('speechSynthesis' in window)){toast('Text-to-speech is not available in this browser.');return;}const u=new SpeechSynthesisUtterance(text);const voice=$('#voice');u.lang=voice?voice.value:'en-GB';window.speechSynthesis.cancel();window.speechSynthesis.speak(u)}
  $$('[data-speech]').forEach(button=>button.addEventListener('click',()=>speak(button.dataset.speech)));
  $('#printBtn')?.addEventListener('click',()=>window.print());

  const storageKey=location.pathname+'-done';
  const done=new Set(JSON.parse(localStorage.getItem(storageKey)||'[]'));
  function refresh(){const total=$$('[data-complete]').length;const percent=total?Math.round(done.size/total*100):0;const fill=$('#progressFill');const text=$('#progressText');if(fill)fill.style.width=percent+'%';if(text)text.textContent=percent+'% complete';}
  function complete(id){if(!id)return;done.add(String(id));localStorage.setItem(storageKey,JSON.stringify(Array.from(done)));refresh();if(typeof renderQualiopiEvaluation==='function')renderQualiopiEvaluation();}
  refresh();

  $$('.choices').forEach(box=>{
    $$('button',box).forEach(button=>{
      button.addEventListener('click',()=>{
        if(box.dataset.locked)return;
        const feedback=$('#feedback-'+box.dataset.question);
        const correct=button.dataset.choice===box.dataset.correct;
        if(correct){
          button.classList.add('correct');
          if(feedback){feedback.textContent=box.dataset.success||'✓ Well done.';feedback.className='feedback good';}
          box.dataset.locked='1';
          complete(box.closest('[data-complete]')?.dataset.complete);
        }else{
          button.classList.add('wrong');
          if(feedback){feedback.textContent=box.dataset.hint||'Not quite — try again.';feedback.className='feedback bad';}
          setTimeout(()=>button.classList.remove('wrong'),850);
        }
      });
    });
  });

  $$('.tab').forEach(tab=>tab.addEventListener('click',()=>{
    const root=tab.closest('.playbook');
    $$(' .tab'.trim(),root).forEach(item=>item.classList.toggle('active',item===tab));
    $$('.panel',root).forEach(panel=>panel.classList.toggle('active',panel.id===tab.dataset.panel));
    complete(root.closest('[data-complete]')?.dataset.complete);
  }));

  $$('.vocab-tools input').forEach(input=>input.addEventListener('input',()=>{
    const section=input.closest('.section');const query=norm(input.value);
    $$('.vocab details',section).forEach(item=>item.hidden=Boolean(query)&&!norm(item.innerText).includes(query));
  }));
  $$('.vocab-tools button').forEach(button=>button.addEventListener('click',()=>{
    const section=button.closest('.section');$$('.vocab details',section).forEach(item=>item.open=true);complete(section?.dataset.complete);
  }));

  $$('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
    const source=$('#'+button.dataset.copy);
    if(!source)return;
    try{await navigator.clipboard.writeText(source.innerText);toast('Copied to your clipboard.');}
    catch(error){toast('Select and copy the text manually.');}
  }));

  $$('[data-answer]').forEach(button=>button.addEventListener('click',()=>{
    const input=$('#'+button.dataset.input);const feedback=$('#'+button.dataset.feedback);
    const answers=(button.dataset.answer||'').split('||').map(norm);
    if(answers.includes(norm(input?.value))){
      if(feedback){feedback.textContent='✓ Exactly. That is professional, clear English.';feedback.className='feedback good';}
      complete(button.closest('[data-complete]')?.dataset.complete);
    }else if(feedback){feedback.textContent=button.dataset.hint||'Almost. Check the grammar pattern and try again.';feedback.className='feedback bad';}
  }));

  $$('.builder').forEach(builder=>{
    let selected=[];const output=$('.builder-output',builder);const feedback=$('.feedback',builder);
    $$('[data-piece]',builder).forEach(piece=>piece.addEventListener('click',()=>{
      const value=piece.dataset.piece;const index=selected.indexOf(value);
      if(index>-1){selected.splice(index,1);piece.classList.remove('selected');}
      else{selected.push(value);piece.classList.add('selected');}
      output.textContent=selected.join(' ')||'Click the blocks in a logical order.';
    }));
    $('.check-builder',builder)?.addEventListener('click',()=>{
      if(norm(selected.join(' '))===norm(builder.dataset.target)){
        feedback.textContent='✓ Excellent. Clear, direct and professional.';feedback.className='feedback good';complete(builder.closest('[data-complete]')?.dataset.complete);
      }else{feedback.textContent='Not yet. Read it aloud: who + action + precise purpose.';feedback.className='feedback bad';}
    });
    $('.reset-builder',builder)?.addEventListener('click',()=>{selected=[];$$('[data-piece]',builder).forEach(piece=>piece.classList.remove('selected'));output.textContent='Click the blocks in a logical order.';feedback.textContent='';});
  });

  $$('[data-reveal]').forEach(button=>button.addEventListener('click',()=>{
    const model=$('#'+button.dataset.reveal);if(!model)return;const isHidden=model.hidden;model.hidden=!isHidden;button.textContent=isHidden?'Hide model answer':'Reveal model answer';if(isHidden)complete(button.closest('[data-complete]')?.dataset.complete);
  }));

  $$('.notes textarea').forEach(area=>{const key=location.pathname+'-'+area.id;area.value=localStorage.getItem(key)||'';area.addEventListener('input',()=>localStorage.setItem(key,area.value));});
  $$('.clear-notes').forEach(button=>button.addEventListener('click',()=>{const area=$('#'+button.dataset.clear);if(!area)return;area.value='';localStorage.removeItem(location.pathname+'-'+area.id);toast('Notes cleared.');}));

  let recorder=null,chunks=[];
  const start=$('#recordStart'),stop=$('#recordStop'),clear=$('#recordClear'),audio=$('#recordAudio'),status=$('#recordStatus'),download=$('#recordDownload');
  start?.addEventListener('click',async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];recorder=new MediaRecorder(stream);
      recorder.ondataavailable=event=>chunks.push(event.data);
      recorder.onstop=()=>{const blob=new Blob(chunks,{type:'audio/webm'});const url=URL.createObjectURL(blob);audio.src=url;audio.hidden=false;download.href=url;download.hidden=false;status.textContent='Recording ready. Listen once, then choose one thing to improve.';stream.getTracks().forEach(track=>track.stop());complete(start.closest('[data-complete]')?.dataset.complete);};
      recorder.start();start.disabled=true;stop.disabled=false;status.textContent='Recording… speak naturally.';
    }catch(error){status.textContent='Microphone access was not available. You can use your phone’s Voice Memos app instead.';}
  });
  stop?.addEventListener('click',()=>{if(recorder&&recorder.state!=='inactive')recorder.stop();start.disabled=false;stop.disabled=true;});
  clear?.addEventListener('click',()=>{audio.removeAttribute('src');audio.hidden=true;download.hidden=true;status.textContent='Your recording stays in this browser session.';});

  $('#resetAll')?.addEventListener('click',()=>{if(confirm('Reset the progress and local notes for this lesson?')){localStorage.removeItem(storageKey);$$('.notes textarea').forEach(area=>localStorage.removeItem(location.pathname+'-'+area.id));location.reload();}});

  // Qualiopi evaluation footer
  const evalStorageKey=location.pathname+'-qualiopi-evaluation-v1';
  const lessonSections=[
    {id:'1',objective:'Understand professional networking and identify an appropriate first-contact approach',subject:'Networking mindset and professional relationship building',method:'QCM / interaction'},
    {id:'2',objective:'Respond professionally to Dutch-style direct feedback',subject:'French / Dutch professional culture and clarification',method:'QCM / roleplay preparation'},
    {id:'3',objective:'Build a realistic networking map for the Dutch real-estate market',subject:'Contacts, recruiters, sector connections and introductions',method:'Guided strategy task'},
    {id:'4',objective:'Improve LinkedIn visibility and write a clear professional networking sentence',subject:'Headline, About section and LinkedIn message',method:'Sentence builder / written production'},
    {id:'5',objective:'Present your profile orally in a short networking conversation',subject:'45-second introduction and professional questions',method:'Oral production / recording'},
    {id:'6',objective:'Use key networking vocabulary accurately in job-search communication',subject:'Networking, referrals, introductions, follow-up and market insight',method:'Vocabulary exploration'},
    {id:'7',objective:'Define concrete networking actions for the next stage of the job search',subject:'Weekly action plan and follow-up strategy',method:'Written action plan'}
  ];
  const manualDefinitions=[
    {id:'oral-introduction',objective:'Give a clear 45-second networking introduction without reading a full script',subject:'Oral introduction: profile, project and value',method:'Manual oral assessment'},
    {id:'oral-conversation',objective:'Ask useful questions, clarify points and handle direct feedback professionally',subject:'Networking conversation and clarification strategies',method:'Manual oral assessment'},
    {id:'writing-linkedin',objective:'Write a short, targeted LinkedIn connection message',subject:'LinkedIn outreach / first professional contact',method:'Manual writing assessment'},
    {id:'writing-followup',objective:'Write a practical networking action plan or follow-up message',subject:'Follow-up, next step and job-search organisation',method:'Manual writing assessment'}
  ];
  let manualStatus={};
  let manualComments={};
  function statusLabel(value){return {'achieved':'Objectif atteint','progress':'Objectif en cours d’acquisition','not-achieved':'Objectif non atteint','not-started':'Non commencé'}[value]||value;}
  function autoStatus(sectionId){return done.has(String(sectionId))?'achieved':'not-started';}
  function autoProgress(sectionId){return done.has(String(sectionId))?'Completed':'Not completed yet';}
  function renderQualiopiEvaluation(){
    const rows=$('#evaluationRows');if(!rows)return;
    const autoRows=lessonSections.map(item=>{const st=autoStatus(item.id);return `<tr><td>${item.objective}</td><td>${item.subject}</td><td>${item.method}</td><td class="score-mini">${autoProgress(item.id)}</td><td><span class="status-badge ${st}">${statusLabel(st)}</span></td></tr>`;}).join('');
    const manualRows=manualDefinitions.map(item=>{const st=manualStatus[item.id]||'not-started';return `<tr><td>${item.objective}</td><td>${item.subject}</td><td>${item.method}</td><td class="score-mini">Évaluation manuelle</td><td><span class="status-badge ${st}">${statusLabel(st)}</span></td></tr>`;}).join('');
    rows.innerHTML=autoRows+manualRows;
    const autoCompleted=lessonSections.filter(item=>done.has(String(item.id))).length;
    const manualCompleted=manualDefinitions.filter(item=>(manualStatus[item.id]||'not-started')!=='not-started').length;
    const total=lessonSections.length+manualDefinitions.length;
    const rate=Math.round(((autoCompleted+manualCompleted)/total)*100);
    const completion=$('#completionRate');if(completion)completion.textContent=rate+'%';
    const statuses=[...lessonSections.map(item=>autoStatus(item.id)),...manualDefinitions.map(item=>manualStatus[item.id]||'not-started')];
    let overall='not-started';
    if(statuses.some(st=>st!=='not-started'))overall=statuses.every(st=>st==='achieved')?'achieved':statuses.some(st=>st==='not-achieved')?'not-achieved':'progress';
    const overallEl=$('#overallStatus');if(overallEl){overallEl.textContent=statusLabel(overall);overallEl.className='status-badge '+overall;}
  }
  function collectEvaluationState(){return {learner:$('#learnerName')?.value||'Isabelle Davion',trainer:$('#trainerName')?.value||'',date:$('#evaluationDate')?.value||'',manualStatus,manualComments,generalComments:$('#generalTrainerComments')?.value||'',done:[...done],lastSaved:new Date().toISOString()};}
  function saveEvaluation(showMessage=false){const state=collectEvaluationState();localStorage.setItem(evalStorageKey,JSON.stringify(state));const last=$('#lastSaved');if(last)last.textContent=new Date(state.lastSaved).toLocaleString();if(showMessage)toast('Evaluation saved in this browser.');}
  function loadEvaluation(){try{const raw=localStorage.getItem(evalStorageKey);if(!raw)return;const s=JSON.parse(raw);manualStatus=s.manualStatus||{};manualComments=s.manualComments||{};if(Array.isArray(s.done)){s.done.forEach(id=>done.add(String(id)));localStorage.setItem(storageKey,JSON.stringify([...done]));refresh();}if($('#learnerName')&&s.learner)$('#learnerName').value=s.learner;if($('#trainerName')&&s.trainer)$('#trainerName').value=s.trainer;if($('#evaluationDate')&&s.date)$('#evaluationDate').value=s.date;if($('#generalTrainerComments'))$('#generalTrainerComments').value=s.generalComments||'';if($('#lastSaved')&&s.lastSaved)$('#lastSaved').textContent=new Date(s.lastSaved).toLocaleString();$$('[data-manual-status]').forEach(sel=>sel.value=manualStatus[sel.dataset.manualStatus]||'not-started');$$('[data-manual-comment]').forEach(area=>area.value=manualComments[area.dataset.manualComment]||'');}catch(error){console.warn('Could not load evaluation state',error);}}
  function evaluationRowsForReport(){
    return [...lessonSections.map(item=>[item.objective,item.subject,item.method,autoProgress(item.id),statusLabel(autoStatus(item.id))]),...manualDefinitions.map(item=>[item.objective,item.subject,item.method,'Evaluation manuelle',statusLabel(manualStatus[item.id]||'not-started')])];
  }
  function getReportData(){renderQualiopiEvaluation();return {learner:$('#learnerName')?.value||'Isabelle Davion',trainer:$('#trainerName')?.value||'',date:$('#evaluationDate')?.value||'',completion:$('#completionRate')?.textContent||'0%',overall:$('#overallStatus')?.textContent||'Non commencé',generalComments:$('#generalTrainerComments')?.value||'',manualComments:{...manualComments},rows:evaluationRowsForReport()};}
  function safeFileName(value){return String(value||'report').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'')||'report';}
  function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));}
  function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500);}
  function downloadEvaluationHTML(){saveEvaluation(false);const d=getReportData();const rows=d.rows.map(row=>`<tr>${row.map(cell=>`<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('');const manual=manualDefinitions.map(item=>`<h3>${escapeHtml(item.subject)}</h3><p><b>Result:</b> ${escapeHtml(statusLabel(manualStatus[item.id]||'not-started'))}</p><div class="comments">${escapeHtml(manualComments[item.id]||'No specific comment entered.')}</div>`).join('');const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Bilan Qualiopi - ${escapeHtml(d.learner)}</title><style>body{font-family:Arial,sans-serif;color:#222;max-width:1100px;margin:35px auto;padding:0 24px}h1{color:#10384b}h2{color:#1a6c72}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #aaa;padding:8px;vertical-align:top}th{background:#eee}.meta{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:18px 0}.box{border:1px solid #bbb;padding:10px;border-radius:8px}.comments{white-space:pre-wrap;min-height:55px;border:1px solid #ccc;border-radius:8px;padding:10px;margin-bottom:10px}@media print{body{margin:0;max-width:none}}</style></head><body><h1>Bilan d'évaluation des acquis - Qualiopi</h1><h2>Lesson 18 - Networking & Dutch Professional Culture</h2><div class="meta"><div class="box"><b>Apprenante:</b> ${escapeHtml(d.learner)}</div><div class="box"><b>Formatrice:</b> ${escapeHtml(d.trainer)}</div><div class="box"><b>Date:</b> ${escapeHtml(d.date)}</div><div class="box"><b>Completion:</b> ${escapeHtml(d.completion)}</div><div class="box"><b>Résultat global:</b> ${escapeHtml(d.overall)}</div></div><table><thead><tr><th>Objectif pédagogique</th><th>Support / sujet</th><th>Mode d'évaluation</th><th>Progression</th><th>Résultat</th></tr></thead><tbody>${rows}</tbody></table><h2>Commentaires par activité orale et écrite</h2>${manual}<h2>Commentaire général de la formatrice</h2><div class="comments">${escapeHtml(d.generalComments)||'Aucune observation saisie.'}</div><p><small>Rapport généré depuis la page interactive. Les résultats restent également sauvegardés dans le navigateur utilisé.</small></p></body></html>`;downloadBlob(new Blob([html],{type:'text/html;charset=utf-8'}),`${safeFileName(d.learner)}-Lesson-18-Bilan-Qualiopi.html`);}
  function latinText(value){return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—]/g,'-').replace(/[^\x20-\x7E]/g,'');}
  function pdfEscape(value){return latinText(value).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
  function wrapText(text,max=94){const words=latinText(text).split(/\s+/);const lines=[];let line='';for(const word of words){if(!word)continue;const next=line?line+' '+word:word;if(next.length>max&&line){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines.length?lines:[''];}
  function buildPDF(data){const pageW=595,pageH=842,left=42,top=800,bottom=45,lineH=14;let pages=[[]],y=top;function addLine(text,size=10,bold=false){for(const line of wrapText(text,size>=14?72:94)){if(y<bottom){pages.push([]);y=top;}pages[pages.length-1].push({text:line,x:left,y,size,bold});y-=size>=14?20:lineH;}}function gap(n=8){y-=n;}addLine('BILAN D EVALUATION DES ACQUIS - QUALIOPI',17,true);addLine('Lesson 18 - Networking & Dutch Professional Culture',12,true);gap();addLine(`Apprenante: ${data.learner}`);addLine(`Formatrice: ${data.trainer}`);addLine(`Date: ${data.date}`);addLine(`Completion: ${data.completion} | Resultat global: ${data.overall}`);gap(12);data.rows.forEach((row,index)=>{addLine(`${index+1}. Objectif: ${row[0]}`,10,true);addLine(`Support / sujet: ${row[1]}`);addLine(`Mode d evaluation: ${row[2]}`);addLine(`Progression: ${row[3]} | Resultat: ${row[4]}`);gap(6);});addLine('Commentaires par activite orale et ecrite',12,true);manualDefinitions.forEach(item=>{addLine(`${item.subject}: ${statusLabel(manualStatus[item.id]||'not-started')}`,10,true);addLine(manualComments[item.id]||'Aucun commentaire specifique.');gap(6);});addLine('Commentaire general de la formatrice',12,true);addLine(data.generalComments||'Aucune observation saisie.');const objects=[];function obj(body){objects.push(body);return objects.length;}const font1=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');const font2=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');const pageRefs=[],contentRefs=[];for(const lines of pages){let stream='';for(const l of lines){stream+=`BT /${l.bold?'F2':'F1'} ${l.size} Tf 1 0 0 1 ${l.x} ${l.y} Tm (${pdfEscape(l.text)}) Tj ET\n`;}contentRefs.push(obj(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`));pageRefs.push(obj('PLACEHOLDER'));}const pagesRef=obj('PLACEHOLDER_PAGES');pageRefs.forEach((ref,index)=>{objects[ref-1]=`<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> /Contents ${contentRefs[index]} 0 R >>`;});objects[pagesRef-1]=`<< /Type /Pages /Kids [${pageRefs.map(ref=>ref+' 0 R').join(' ')}] /Count ${pageRefs.length} >>`;const catalog=obj(`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`);let out='%PDF-1.4\n%PDFREPORT\n',offsets=[0];for(let i=0;i<objects.length;i++){offsets.push(out.length);out+=`${i+1} 0 obj\n${objects[i]}\nendobj\n`;}const xref=out.length;out+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;for(let i=1;i<offsets.length;i++)out+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';out+=`trailer\n<< /Size ${objects.length+1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;return new Blob([new TextEncoder().encode(out)],{type:'application/pdf'});}
  function downloadEvaluationPDF(){saveEvaluation(false);const data=getReportData();downloadBlob(buildPDF(data),`${safeFileName(data.learner)}-Lesson-18-Bilan-Qualiopi.pdf`);}
  function resetEvaluation(){if(!confirm('Reset all Qualiopi evaluation data for this lesson?'))return;localStorage.removeItem(evalStorageKey);$$('[data-manual-status]').forEach(sel=>sel.value='not-started');$$('[data-manual-comment]').forEach(area=>area.value='');if($('#generalTrainerComments'))$('#generalTrainerComments').value='';manualStatus={};manualComments={};renderQualiopiEvaluation();toast('Evaluation reset.');}
  function initQualiopiEvaluation(){
    if(!$('#evaluationReport'))return;
    if($('#evaluationDate')&&!$('#evaluationDate').value)$('#evaluationDate').value=new Date().toISOString().slice(0,10);
    loadEvaluation();
    $$('[data-manual-status]').forEach(sel=>sel.addEventListener('change',()=>{manualStatus[sel.dataset.manualStatus]=sel.value;saveEvaluation(false);renderQualiopiEvaluation();}));
    $$('[data-manual-comment]').forEach(area=>area.addEventListener('input',()=>{manualComments[area.dataset.manualComment]=area.value;saveEvaluation(false);}));
    ['learnerName','trainerName','evaluationDate','generalTrainerComments'].forEach(id=>$('#'+id)?.addEventListener('input',()=>saveEvaluation(false)));
    $('#saveProgress')?.addEventListener('click',()=>saveEvaluation(true));
    $('#downloadHtml')?.addEventListener('click',downloadEvaluationHTML);
    $('#downloadPdf')?.addEventListener('click',downloadEvaluationPDF);
    $('#printReport')?.addEventListener('click',()=>{saveEvaluation(false);window.print();});
    $('#resetProgress')?.addEventListener('click',resetEvaluation);
    renderQualiopiEvaluation();
  }
  initQualiopiEvaluation();

})();
