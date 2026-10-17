
(() => {
const L = window.LESSON, O = window.PROGRAM_OBJECTIVES || {}, OF = window.PROGRAM_OBJECTIVES_FR || O;
const STORAGE = `aminata-lesson-${L.number}-v1`;
const state = {scores:{}, completed:{}, mode:"practice", saved:{}, timers:{}};

const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];
const esc=(v="")=>String(v).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const norm=(v="")=>String(v).toLowerCase().replace(/[’']/g,"'").replace(/[?.!,;:]/g,"").replace(/\s+/g," ").trim();
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function store(){try{
 const fields={}; $$("[data-save]").forEach(el=>{fields[el.id]=el.type==="checkbox"?el.checked:el.value});
 localStorage.setItem(STORAGE,JSON.stringify({scores:state.scores,completed:state.completed,mode:state.mode,fields,showFr:document.body.classList.contains("show-fr")}));
}catch(e){}}
function restore(){
 try{const raw=localStorage.getItem(STORAGE);if(!raw)return;const p=JSON.parse(raw);state.scores=p.scores||{};state.completed=p.completed||{};state.mode=p.mode||"practice";state.saved=p.fields||{};
 $$("[data-save]").forEach(el=>{if(Object.prototype.hasOwnProperty.call(state.saved,el.id)){if(el.type==="checkbox")el.checked=!!state.saved[el.id];else el.value=state.saved[el.id]}});
 if(p.showFr)document.body.classList.add("show-fr");
 }catch(e){}
}
function registerScore(key,total=1){if(!state.scores[key])state.scores[key]={earned:0,total,answered:false}}
function setScore(key,earned,total=1){state.scores[key]={earned,total,answered:true}; updateDashboard(); store()}
function totals(){return Object.values(state.scores).reduce((a,x)=>({earned:a.earned+(+x.earned||0),total:a.total+(+x.total||0),answered:a.answered+(x.answered?1:0)}),{earned:0,total:0,answered:0})}
function sectionAutoScores(){
 const defs=[
  ["Grammar QCM","Multiple-choice grammar / tense choice",["mcq-"]],
  ["Typed grammar","Conjugation / sentence correction",["typed-"]],
  ["Word order","Sentence building / syntax",["order-"]],
  ["Listening","Listening comprehension QCM",["listen-"]],
  ["Professional document","Reading / document comprehension QCM",["reading-"]]
 ];
 return defs.map(([name,type,prefixes])=>{
   const items=Object.entries(state.scores).filter(([k])=>prefixes.some(p=>k.startsWith(p)));
   const sum=items.reduce((a,[,x])=>({earned:a.earned+(+x.earned||0),total:a.total+(+x.total||0),answered:a.answered+(x.answered?1:0)}),{earned:0,total:0,answered:0});
   return {name,type,...sum};
 }).filter(x=>x.total>0);
}
function manualSectionScores(){
 return [
  {name:"Oral missions",type:"Recorded role-play / professional interaction",result:$("#adminOralScore")?.value.trim()||"Trainer assessment pending"},
  {name:"Writing missions",type:"Professional written production",result:$("#adminWritingScore")?.value.trim()||"Trainer assessment pending"},
  {name:"Final LILATE mission",type:"Integrated exam-style simulation",result:$("#adminFinalScore")?.value.trim()||"Trainer assessment pending"}
 ];
}
function sectionScoresText(){
 const automatic=sectionAutoScores().map(x=>`${x.name} [${x.type}]: ${x.earned}/${x.total}`);
 const manual=manualSectionScores().map(x=>`${x.name} [${x.type}]: ${x.result}`);
 return [...automatic,...manual].join(" | ");
}
function renderSectionScores(){
 const box=$("#sectionScoreSummary"); if(!box)return;
 const rows=[...sectionAutoScores().map(x=>({name:x.name,type:x.type,result:`${x.earned}/${x.total}`})),...manualSectionScores()];
 box.innerHTML=rows.map(x=>`<div class="section-score-row"><span>${esc(x.name)}</span><span class="score-type">${esc(x.type)}</span><span class="score-result">${esc(x.result)}</span></div>`).join("");
}
function updateDashboard(){
 const secs=$$(".lesson-section[data-progress-key]"), done=secs.filter(s=>state.completed[s.dataset.progressKey]).length, pct=Math.round(done/Math.max(1,secs.length)*100);
 const t=totals(); $("#globalProgressText").textContent=`${pct}%`; $("#globalProgressBar").style.width=`${pct}%`; $("#scoreValue").textContent=t.earned; $("#scoreTotal").textContent=t.total;
 $("#adminScore").textContent=`${t.earned} / ${t.total}`; $("#adminCompletion").textContent=`${pct}%`; renderSectionScores(); buildAdminOutput(); buildEmail();
}
function complete(key){state.completed[key]=true;updateDashboard();store()}
function variedOptions(item,index){
 const opts=[...item[1]], ans=item[2], wrong=opts.filter(x=>x!==ans);
 for(let i=wrong.length-1;i>0;i--){const j=(index*7+i*3+L.number)% (i+1);[wrong[i],wrong[j]]=[wrong[j],wrong[i]]}
 const positions=[1,2,0,2,1,0,1,0,2,1,2,0], at=Math.min(positions[index%positions.length],wrong.length); wrong.splice(at,0,ans);return wrong;
}
function shuffled(arr){let a=[...arr], tries=0;do{for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}tries++}while(a.join("|")===arr.join("|")&&tries<8);if(a.join("|")===arr.join("|")&&a.length>1)a=[...a.slice(1),a[0]];return a}
function speak(text,rate=.95){if(!("speechSynthesis" in window))return toast("Audio is not available in this browser.");speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=$("#accentSelect").value;u.rate=rate;const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang===u.lang)||voices.find(v=>v.lang.startsWith(u.lang.slice(0,2)))||null;speechSynthesis.speak(u)}
function download(content,name,type="text/plain"){const b=new Blob([content],{type}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),800)}
function modelBlock(id,b1,b2){
 return `<div class="model-switch"><button class="model-btn" type="button" data-model-target="${id}-b1">Clear model</button><button class="model-btn" type="button" data-model-target="${id}-b2">Stretch B2 model</button></div><div class="model-content" id="${id}-b1">${esc(b1)}</div><div class="model-content stretch" id="${id}-b2">${esc(b2)}</div>`;
}

function renderHeader(){
 $("#heroGrammar").textContent=L.grammar.name; $("#heroElearning").textContent=L.elearning.split("·")[0].trim();
 $("#briefingTitle").textContent=L.title; $("#briefingText").textContent=L.subtitle; $("#examFocus").textContent=L.exam_focus;
 $("#examFocusFr").textContent="Conseil examen : entraînez la compétence ciblée avec une structure stable, puis retirez progressivement l’aide afin de répondre de façon autonome.";
 $("#methodTitle").textContent=`The ${L.method} method`;
 $("#scheduleGrid").innerHTML=L.schedule.map(([a,b])=>`<div class="timing-card"><strong>${esc(b)} min</strong><span>${esc(a)}</span></div>`).join("");
 $("#objectiveGrid").innerHTML=L.objective_codes.map((c,i)=>`<article class="objective-card"><span>${String(i+1).padStart(2,"0")}</span><h3>${esc(c)}</h3><p>${esc(O[c])}</p></article>`).join("");
 $("#methodGrid").innerHTML=L.method_steps.map(x=>`<article><span class="letter">${esc(x[0])}</span><div><h3>${esc(x[1])}</h3><p>${esc(x[2])}</p></div></article>`).join("");
 $("#elearningText").textContent=L.elearning;
}
function renderVocab(){
 const sel=$("#vocabCategory"); sel.innerHTML=Object.keys(L.vocab).map(k=>`<option>${esc(k)}</option>`).join("");
 const draw=()=>{const cat=sel.value,items=L.vocab[cat]||[];$("#vocabGrid").innerHTML=items.map((x,i)=>`<article class="vocab-card2"><button class="speak-mini" type="button" data-say="${esc(x[0])}. ${esc(x[2])}">▶ Audio</button><h3>${esc(x[0])}</h3><div class="translation fr-support">${esc(x[1])}</div><p class="example">${esc(x[2])}</p></article>`).join("");wireSpeak()};
 sel.addEventListener("change",()=>{draw();complete("vocabulary")}); draw(); $("#speakVocabSet").addEventListener("click",()=>speak((L.vocab[sel.value]||[]).map(x=>`${x[0]}. ${x[2]}`).join(" "),.9));
}
function renderGrammar(){
 $("#grammarTitle").textContent=L.grammar.name;$("#grammarWhy").textContent=L.grammar.why;$("#grammarFr").textContent=L.grammar.fr;
 $("#ruleStack").innerHTML=L.grammar.rules.map(r=>`<article class="rule-card"><h3>${esc(r.label)}</h3><div class="formula">${esc(r.formula)}</div><p>${esc(r.use)}</p><div class="rule-meta"><div><strong>French meaning</strong><span class="fr-support">${esc(r.fr)}</span><span class="fr-support-off">Use the FR button for conceptual support.</span></div><div><strong>Signal / decision clues</strong><span>${esc(r.keywords)}</span></div></div><ul class="example-list">${r.examples.map(e=>`<li>${esc(e)} <button class="mini-btn" type="button" data-say="${esc(e)}">▶</button></li>`).join("")}</ul></article>`).join("");
 $("#exceptionList").innerHTML=(L.grammar.exceptions||[]).map(x=>`<div class="exception-card"><strong>Watch out</strong><p>${esc(x)}</p></div>`).join("");wireSpeak();
}
function renderMcq(){
 const box=$("#mcqList");box.innerHTML="";
 L.grammar.mcq.forEach((it,i)=>{const key=`mcq-${i}`;registerScore(key);const el=document.createElement("article");el.className="quiz-item";el.innerHTML=`<strong>${i+1}. ${esc(it[0])}</strong><div class="quiz-options">${variedOptions(it,i).map(o=>`<button class="quiz-option" type="button" data-value="${esc(o)}">${esc(o)}</button>`).join("")}</div><button class="hint-btn" type="button">Hint</button><div class="hint">Focus: ${esc(it[3])}</div><div class="feedback neutral">Choose one answer.</div>`;box.appendChild(el);
 $$(".quiz-option",el).forEach(btn=>btn.addEventListener("click",()=>{const ok=btn.dataset.value===it[2];$$(".quiz-option",el).forEach(b=>b.classList.remove("selected"));btn.classList.add("selected");el.classList.toggle("correct",ok);el.classList.toggle("incorrect",!ok);$(".feedback",el).className=`feedback ${ok?"ok":"no"}`;$(".feedback",el).innerHTML=ok?`✓ Correct. ${esc(it[3])}`:`✗ Not yet. Correct answer: <strong>${esc(it[2])}</strong>. ${esc(it[3])}`;setScore(key,ok?1:0);}));
 $(".hint-btn",el).addEventListener("click",()=>$(".hint",el).classList.toggle("show"));
 });
}
function renderTyped(){
 const box=$("#typedList");box.innerHTML="";
 L.grammar.typed.forEach((it,i)=>{const key=`typed-${i}`;registerScore(key);const el=document.createElement("article");el.className="quiz-item";el.innerHTML=`<strong>${i+1}. ${esc(it[0])}</strong><div class="typed-row"><input type="text" data-save="typed-${i}" placeholder="Type your answer…"><button class="hint-btn" type="button">Hint</button></div><div class="hint">${esc(it[2])}</div><div class="feedback neutral">Type the complete answer. Correct answers validate immediately; press Enter or leave the field to check an incomplete/wrong answer.</div>`;box.appendChild(el);
 const input=$("input",el), answer=it[1];
 const check=(final=false)=>{if(!input.value.trim())return;const ok=norm(input.value)===norm(answer);if(ok||final){el.classList.toggle("correct",ok);el.classList.toggle("incorrect",!ok);$(".feedback",el).className=`feedback ${ok?"ok":"no"}`;$(".feedback",el).innerHTML=ok?`✓ Correct. ${esc(it[2])}`:`✗ Check the structure. Model answer: <strong>${esc(answer)}</strong>. ${esc(it[2])}`;setScore(key,ok?1:0)}};
 input.addEventListener("input",()=>{check(false);store()});input.addEventListener("blur",()=>check(true));input.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();check(true)}});$(".hint-btn",el).addEventListener("click",()=>$(".hint",el).classList.toggle("show"));
 });
}
function renderWordOrder(){
 const box=$("#wordOrderList");box.innerHTML="";
 L.grammar.wordorder.forEach((it,i)=>{const key=`order-${i}`;registerScore(key);let source=shuffled(it[0]),chosen=[];const el=document.createElement("article");el.className="quiz-item";el.innerHTML=`<strong>${i+1}. Build the sentence.</strong><div class="word-bank"></div><div class="word-answer"></div><button class="hint-btn" type="button">Hint</button><div class="hint">Start by identifying the subject and auxiliary / main verb.</div><div class="feedback neutral">Build the complete sentence.</div>`;box.appendChild(el);
 const bank=$(".word-bank",el),ans=$(".word-answer",el);
 const draw=()=>{bank.innerHTML=source.map((w,j)=>`<button type="button" class="word-token" data-i="${j}">${esc(w)}</button>`).join("");ans.innerHTML=chosen.map((w,j)=>`<button type="button" class="word-token" data-i="${j}">${esc(w)}</button>`).join("");
 $$(".word-token",bank).forEach(b=>b.onclick=()=>{chosen.push(source.splice(+b.dataset.i,1)[0]);draw();if(source.length===0)check()});$$(".word-token",ans).forEach(b=>b.onclick=()=>{source.push(chosen.splice(+b.dataset.i,1)[0]);draw()})};
 const check=()=>{const made=chosen.join(" "),ok=norm(made)===norm(it[1]);el.classList.toggle("correct",ok);el.classList.toggle("incorrect",!ok);$(".feedback",el).className=`feedback ${ok?"ok":"no"}`;$(".feedback",el).innerHTML=ok?`✓ Correct: ${esc(it[1])}`:`✗ Try again. Target structure: <strong>${esc(it[1])}</strong>`;setScore(key,ok?1:0)};
 $(".hint-btn",el).onclick=()=>$(".hint",el).classList.toggle("show");draw();
 });
}
function renderChoiceQuestions(container,questions,prefix){
 container.innerHTML="";
 questions.forEach((it,i)=>{const key=`${prefix}-${i}`;registerScore(key);const el=document.createElement("article");el.className="quiz-item";el.innerHTML=`<strong>${i+1}. ${esc(it[0])}</strong><div class="quiz-options">${variedOptions(it,i+3).map(o=>`<button class="quiz-option" type="button" data-value="${esc(o)}">${esc(o)}</button>`).join("")}</div><button class="hint-btn" type="button">Hint</button><div class="hint">Return to the source and identify the exact fact that changes the professional action.</div><div class="feedback neutral">Choose one answer.</div>`;container.appendChild(el);
 $$(".quiz-option",el).forEach(btn=>btn.onclick=()=>{const ok=btn.dataset.value===it[2];$$(".quiz-option",el).forEach(b=>b.classList.remove("selected"));btn.classList.add("selected");el.classList.toggle("correct",ok);el.classList.toggle("incorrect",!ok);$(".feedback",el).className=`feedback ${ok?"ok":"no"}`;$(".feedback",el).innerHTML=ok?`✓ Correct.`:`✗ Correct answer: <strong>${esc(it[2])}</strong>.`;setScore(key,ok?1:0)});
 $(".hint-btn",el).onclick=()=>$(".hint",el).classList.toggle("show");
 });
}
function renderListening(){
 const wrap=$("#listeningList");wrap.innerHTML="";
 L.listening.forEach((s,si)=>{const id=`listen-${si}`,b2=`${s.reform} A stronger B2 response would also state the professional next step or limitation clearly, without adding facts that were not given.`;const card=document.createElement("div");card.className="activity-panel";card.innerHTML=`<h3>${si+1}. ${esc(s.title)}</h3><p class="fr-support">Aide FR : écoutez une première fois pour comprendre la situation générale, puis une deuxième fois pour noter uniquement les informations qui changent votre réponse professionnelle.</p><div class="audio-controls"><button class="button primary small listen-normal" type="button">▶ Listen</button><button class="button secondary small listen-slow" type="button">▶ Slower</button><button class="button ghost small transcript-toggle" type="button">Transcript</button></div><div class="transcript">${esc(s.text)}</div><div class="note-grid"><label>Main need<textarea data-save="${id}-need" placeholder="keywords only"></textarea></label><label>Important details<textarea data-save="${id}-details"></textarea></label><label>Next action<textarea data-save="${id}-action"></textarea></label></div><div class="quiz-list listen-questions"></div><h4>Reformulate in your own words</h4><textarea data-save="${id}-reform" placeholder="Let me make sure I understood…"></textarea>${modelBlock(`${id}-model`,s.reform,b2)}`;wrap.appendChild(card);
 $(".listen-normal",card).onclick=()=>speak(s.text,.95);$(".listen-slow",card).onclick=()=>speak(s.text,.78);$(".transcript-toggle",card).onclick=()=>$(".transcript",card).classList.toggle("show");renderChoiceQuestions($(".listen-questions",card),s.questions,`listen-${si}`);
 });
 wireModels();
}
function renderReading(){ $("#readingTitle").textContent=L.reading.title;$("#readingText").textContent=L.reading.text;renderChoiceQuestions($("#readingQuestions"),L.reading.questions,"reading");}
function recorderHtml(id){return `<div class="record-box" data-recorder="${id}"><button class="button primary small record-start" type="button">Record</button><button class="button secondary small record-stop" type="button" disabled>Stop</button><span class="record-status">Ready</span><audio controls></audio><a class="button ghost small record-download" hidden>Download audio</a></div>`}
function timerHtml(id,seconds=90){return `<div class="record-box"><button class="mini-btn timer-start" type="button" data-seconds="${seconds}" data-timer="${id}">Start ${seconds}s timer</button><strong class="timer-display" id="timer-${id}">${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}</strong></div>`}
function renderSpeaking(){
 const box=$("#oralList");box.innerHTML="";
 L.oral.forEach((x,i)=>{const id=`oral-${i}`,card=document.createElement("div");card.className="activity-panel";card.innerHTML=`<h3>${i+1}. ${esc(x.title)}</h3><div class="prompt-card"><p>${esc(x.prompt)}</p><p class="fr-support">Aide FR : donnez d’abord une réponse directe, puis développez avec la méthode de la leçon, un exemple ou une justification, et terminez par le résultat ou la prochaine étape.</p></div>${timerHtml(id,90)}<label><strong>Your preparation keywords</strong><textarea data-save="${id}-notes"></textarea></label>${recorderHtml(id)}${modelBlock(`${id}-model`,x.b1,x.b2)}`;box.appendChild(card)});
 wireModels();wireRecorders();wireTimers();
}
function renderWriting(){
 const box=$("#writingList");box.innerHTML="";
 L.writing.forEach((x,i)=>{const id=`write-${i}`,card=document.createElement("div");card.className="activity-panel write-box";card.innerHTML=`<h3>${i+1}. ${esc(x.title)}</h3><div class="prompt-card"><p>${esc(x.prompt)}</p><p class="fr-support">Aide FR : organisez d’abord les informations essentielles, utilisez des phrases courtes et professionnelles, puis relisez les temps, articles, prépositions et connecteurs avant de comparer avec les modèles.</p></div><textarea id="${id}" data-save="${id}" placeholder="Write here…"></textarea><div class="write-tools"><span><strong class="word-count">0</strong> words</span><span><button class="copy-btn" type="button">Copy</button> <button class="copy-btn download-writing" type="button">Download</button></span></div>${modelBlock(`${id}-model`,x.b1,x.b2)}`;box.appendChild(card);const ta=$("textarea",card),wc=$(".word-count",card);const upd=()=>{wc.textContent=ta.value.trim()?ta.value.trim().split(/\s+/).length:0;store()};ta.addEventListener("input",upd);upd();$(".copy-btn",card).onclick=async()=>{try{await navigator.clipboard.writeText(ta.value);toast("Writing copied.")}catch{toast("Copy unavailable.")}};$(".download-writing",card).onclick=()=>download(ta.value,`aminata_lesson_${L.number}_${id}.txt`)});
 wireModels();
}
function renderFinal(){
 $("#finalTitle").textContent=L.final.title;$("#finalPrompt").textContent=L.final.prompt;$("#final-b1").textContent=L.final.b1;$("#final-b2").textContent=L.final.b2;
 if(L.mock_parts && L.mock_parts.length){
   const mount=document.createElement("div"); mount.id="mockParts"; $("#finalMission .activity-panel").before(mount);
   mount.innerHTML=L.mock_parts.map((p,i)=>{const id=`mock-${i}`;const work=p.type==="oral"?recorderHtml(id):`<textarea data-save="${id}-response" style="width:100%;min-height:160px" placeholder="Complete this part independently…"></textarea>`;
     return `<div class="activity-panel"><span class="badge">TIMED MOCK</span><h3>${esc(p.title)}</h3><div class="source-card"><strong>Source / scenario</strong><p>${esc(p.source)}</p></div><div class="prompt-card"><strong>Your task</strong><p>${esc(p.task)}</p></div>${timerHtml(id,900)}${work}${modelBlock(`${id}-model`,p.b1,p.b2)}</div>`}).join("");
 }
 const panel=$("#finalReflection");panel.insertAdjacentHTML("afterbegin",timerHtml("final",L.mock_parts?300:120));wireModels();wireRecorders();wireTimers();
}
function renderObjectiveEval(){
 const supportMap={O1:"Integrated quiz, role-play, writing and LILATE mission",O2:"Professional role-play / interaction",O3:"Listening, note-taking and information-collection task",O4:"Oral/written reformulation task",O5:"Procedure / handover transmission task",O6:"Listening and professional-document comprehension"};
 const modeMap={O1:"Mixed formative assessment + final mission",O2:"Mise en situation + grille d’observation",O3:"Questions orales + QCM + prise de notes",O4:"Reformulation orale/écrite",O5:"Exercice pratique + simulation",O6:"QCM de compréhension + exploitation de document"};
 $("#objectiveEvalBody").innerHTML=L.objective_codes.map(c=>`<tr data-code="${c}"><td><strong>${c}</strong></td><td>${esc(OF[c])}</td><td><input data-save="support-${c}" id="support-${c}" value="${esc(supportMap[c])}"></td><td><input data-save="mode-${c}" id="mode-${c}" value="${esc(modeMap[c])}"></td><td><select data-save="result-${c}" id="result-${c}"><option>Objectif en cours d’acquisition</option><option>Objectif atteint</option><option>Objectif non atteint</option></select></td><td><input data-save="evidence-${c}" id="evidence-${c}" placeholder="Score / recording / observation"></td></tr>`).join("");
}
function buildAdminOutput(){
 if(!$("#adminOutput"))return;const t=totals(), pct=t.total?Math.round(t.earned/t.total*100):0;
 const supports=L.objective_codes.map(c=>`${c}:${$(`#support-${c}`)?.value||""}`).join(" | ");
 const modes=L.objective_codes.map(c=>`${c}:${$(`#mode-${c}`)?.value||""}`).join(" | ");
 const results=L.objective_codes.map(c=>`${c}:${$(`#result-${c}`)?.value||""}`).join(" | ");
 const content=`${L.title} — ${L.grammar.name}; ${L.exam_focus}`;
 const exercises=`Interactive QCM; typed grammar; word order; listening; professional document; speaking recordings; writing; final LILATE mission`;
 const line=[
 $("#adminDate")?.value||"",`Lesson ${L.number} — ${L.title}`,$("#adminLive")?.value||"",$("#adminElearning")?.value||"",L.objective_codes.join(", "),
 content,`${exercises} | ${supports}`,modes,results,`${sectionScoresText()} | Overall auto score: ${t.earned}/${t.total} (${pct}%). Observation: ${$("#adminObservation")?.value||""} Next: ${$("#adminNext")?.value||""}`,$("#adminEvidence")?.value||""
 ].join("\t");
 $("#adminOutput").textContent=line;
}
function buildEmail(){
 if(!$("#emailOutput"))return;const t=totals(),pct=t.total?Math.round(t.earned/t.total*100):0,link=$("#lessonLink")?.value||"[lesson link]",notes=$("#notesLink")?.value||"[reference/notes link]";
 const next=$("#adminNext")?.value||"continue consolidating this skill in the next lesson";
 $("#emailOutput").textContent=`Hi,\n\nHere is your Lesson ${L.number}: ${L.title}.\n\nToday we worked on ${L.grammar.name.toLowerCase()} and ${L.exam_focus.toLowerCase()}. Your current interactive score is ${t.earned}/${t.total} (${pct}%).\n\nYour next focus is to ${next}.\n\nLesson: ${link}\nReference / notes: ${notes}\n\nKeep using the recordings and corrections to practise without looking at the models first.\n\nSee you soon!\nTisha`;
}

function objectiveReportTable(){
 return `<table><thead><tr><th>Code</th><th>Programme objective</th><th>Support</th><th>Evaluation mode</th><th>Result</th><th>Evidence / comment</th></tr></thead><tbody>${L.objective_codes.map(c=>`<tr><td>${esc(c)}</td><td>${esc(OF[c])}</td><td>${esc($(`#support-${c}`)?.value||"")}</td><td>${esc($(`#mode-${c}`)?.value||"")}</td><td>${esc($(`#result-${c}`)?.value||"")}</td><td>${esc($(`#evidence-${c}`)?.value||"")}</td></tr>`).join("")}</tbody></table>`;
}

function wireAdmin(){
 $$("[data-save]").forEach(el=>{el.addEventListener("input",()=>{store();renderSectionScores();buildAdminOutput();buildEmail()});el.addEventListener("change",()=>{store();renderSectionScores();buildAdminOutput();buildEmail()})});
 $("#copyAdminLine").onclick=async()=>{try{await navigator.clipboard.writeText($("#adminOutput").textContent);toast("Spreadsheet row copied with detailed section scores.")}catch{toast("Copy unavailable.")}};
 $("#copyEmail").onclick=async()=>{try{await navigator.clipboard.writeText($("#emailOutput").textContent);toast("Email copied.")}catch{toast("Copy unavailable.")}};
 $("#downloadReport").onclick=()=>{const html=`<!doctype html><html><head><meta charset="utf-8"><title>Aminata Lesson ${L.number} evaluation</title><style>body{font-family:Arial,sans-serif;max-width:1000px;margin:40px auto;color:#17233a}h1,h2{color:#071b3a}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccd5e1;padding:8px;vertical-align:top}th{background:#071b3a;color:white}.box{border:1px solid #ccd5e1;border-radius:10px;padding:12px;margin:12px 0;white-space:pre-wrap}</style></head><body><h1>Lesson ${L.number} — ${esc(L.title)}</h1><p><strong>Date:</strong> ${esc($("#adminDate").value)} | <strong>Live duration:</strong> ${esc($("#adminLive").value)} | <strong>E-learning:</strong> ${esc($("#adminElearning").value)}</p><h2>Objective evaluation</h2>${objectiveReportTable()}<h2>Trainer observation</h2><div class="box">${esc($("#adminObservation").value)}</div><h2>Scores by section & exercise type</h2><div class="box">${esc(sectionScoresText())}</div><h2>Score & next step</h2><div class="box">${esc($("#adminScore").textContent)} | ${esc($("#adminCompletion").textContent)} completed\nNext: ${esc($("#adminNext").value)}</div><h2>Spreadsheet / Digiforma line</h2><div class="box">${esc($("#adminOutput").textContent)}</div></body></html>`;download(html,`aminata_lesson_${L.number}_connect_learning_report.html`,"text/html")};
}
function wireSpeak(){$$("[data-say]").forEach(b=>b.onclick=()=>speak(b.dataset.say))}
function wireModels(){$$(".model-btn").forEach(b=>{b.onclick=()=>{const el=document.getElementById(b.dataset.modelTarget);if(el)el.classList.toggle("show")}})}
function wireTimers(){$$(".timer-start").forEach(b=>{if(b.dataset.wired)return;b.dataset.wired="1";b.onclick=()=>{const id=b.dataset.timer,initial=+b.dataset.seconds;clearInterval(state.timers[id]);let remain=initial,display=$(`#timer-${id}`);const draw=()=>display.textContent=`${String(Math.floor(remain/60)).padStart(2,"0")}:${String(remain%60).padStart(2,"0")}`;draw();state.timers[id]=setInterval(()=>{remain--;draw();if(remain<=0){clearInterval(state.timers[id]);toast("Time. Finish your sentence and stop.")}},1000)}})}
function wireRecorders(){
 $$("[data-recorder]").forEach(box=>{if(box.dataset.wired)return;box.dataset.wired="1";const start=$(".record-start",box),stop=$(".record-stop",box),status=$(".record-status",box),audio=$("audio",box),dl=$(".record-download",box);let rec,chunks=[];
 start.onclick=async()=>{try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];rec=new MediaRecorder(stream);rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};rec.onstop=()=>{const blob=new Blob(chunks,{type:rec.mimeType||"audio/webm"}),url=URL.createObjectURL(blob);audio.src=url;dl.href=url;dl.download=`aminata_lesson_${L.number}_${box.dataset.recorder}.webm`;dl.hidden=false;status.textContent="Recorded — listen and retry if needed.";stream.getTracks().forEach(t=>t.stop());complete("speaking")};rec.start();start.disabled=true;stop.disabled=false;status.textContent="Recording…"}catch(e){status.textContent="Microphone permission is required.";toast("Allow microphone access to record.")}};
 stop.onclick=()=>{if(rec&&rec.state!=="inactive")rec.stop();start.disabled=false;stop.disabled=true};
 });
}
function restoreFields(){Object.entries(state.saved||{}).forEach(([id,v])=>{const el=document.getElementById(id);if(el){if(el.type==="checkbox")el.checked=!!v;else el.value=v}})}
function setupModes(){
 const apply=()=>{document.body.classList.toggle("exam-mode",state.mode==="exam");$("#practiceModeBtn").classList.toggle("active",state.mode==="practice");$("#examModeBtn").classList.toggle("active",state.mode==="exam")};
 $("#practiceModeBtn").onclick=()=>{state.mode="practice";apply();store()};$("#examModeBtn").onclick=()=>{state.mode="exam";apply();store();window.scrollTo({top:document.querySelector("#finalMission").offsetTop-30,behavior:"smooth"})};apply();
}
function setupTop(){
 $("#translationToggle").onclick=()=>{document.body.classList.toggle("show-fr");$("#translationToggle").setAttribute("aria-pressed",document.body.classList.contains("show-fr"));store()};
 $("#focusToggle").onclick=()=>{document.body.classList.toggle("focus-mode");$("#focusToggle").setAttribute("aria-pressed",document.body.classList.contains("focus-mode"))};
 $("#saveAllBtn").onclick=()=>{store();toast("Progress saved in this browser.")};
 $("#resetBtn").onclick=()=>{if(confirm("Reset this lesson in this browser?")){localStorage.removeItem(STORAGE);location.reload()}};
}
function observeSections(){const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>.25){complete(e.target.dataset.progressKey)}}),{threshold:[.25]});$$(".lesson-section[data-progress-key]").forEach(s=>ob.observe(s))}
function init(){
 renderHeader();renderVocab();renderGrammar();renderMcq();renderTyped();renderWordOrder();renderListening();renderReading();renderSpeaking();renderWriting();renderFinal();renderObjectiveEval();
 restore();restoreFields();setupModes();setupTop();wireSpeak();wireModels();wireTimers();wireRecorders();wireAdmin();observeSections();updateDashboard();
 $("#adminDate").value=$("#adminDate").value||new Date().toISOString().slice(0,10);
 $$("textarea[data-save],input[data-save],select[data-save]").forEach(el=>{el.addEventListener("input",store);el.addEventListener("change",store)});
 buildAdminOutput();buildEmail();
}
document.addEventListener("DOMContentLoaded",init);
})();
