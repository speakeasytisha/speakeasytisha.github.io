(() => {
"use strict";
const KEY="marine_lesson_5_v1";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let state={answers:{},scores:{grammar:0,sarc:0,reading:0},manual:{}};
const vocabulary={
skills:[
["attentive to detail","attentive aux détails","careful about small but important information","I am attentive to detail when I check contracts."],
["reliable","fiable","someone others can trust to do the work","My colleagues know that I am reliable."],
["adaptable","capable de s’adapter","able to change when a situation changes","I am adaptable when priorities change."],
["organised","organisée","able to plan work clearly and efficiently","I organise urgent and routine tasks carefully."],
["calm under pressure","calme sous pression","able to think clearly in a difficult situation","I remain calm under pressure when a deadline changes."],
["customer-focused","orientée client","concerned with understanding and helping customers","My experience has made me customer-focused."]
],actions:[
["handle a contract","gérer un contrat","manage a contract from beginning to end","I handle insurance contracts for business customers."],
["identify an error","repérer une erreur","notice information that is incorrect","I identified an error before the file was processed."],
["check supporting documents","vérifier les justificatifs","verify documents that support an application or file","I check supporting documents carefully."],
["update a record","mettre à jour un dossier","add new or corrected information to a file","I updated the customer record immediately."],
["coordinate with a department","coordonner avec un service","work with another team to complete a task","I coordinated with the claims department."],
["follow up with a customer","relancer un client","contact a customer again to obtain information","I followed up with the customer the next morning."]
],problems:[
["missing information","informations manquantes","details that should be present but are absent","I noticed that the file contained missing information."],
["discrepancy","écart / incohérence","a difference between two pieces of information","I reported a discrepancy in the timesheet."],
["urgent request","demande urgente","a request that must be handled quickly","I reorganised my tasks after an urgent request."],
["unexpected change","changement imprévu","a change that was not planned","I adapted quickly to an unexpected change."],
["resolve an issue","résoudre un problème","find and apply a solution","I contacted the right department to resolve the issue."],
["prevent a delay","éviter un retard","act before a situation makes work late","My action prevented a delay."]
],results:[
["meet a deadline","respecter un délai","finish the work by the required time","We met the deadline despite the change."],
["process accurately","traiter avec exactitude","complete work without errors","The contract was processed accurately."],
["improve efficiency","améliorer l’efficacité","make a process work better or faster","The new checklist improved efficiency."],
["avoid a mistake","éviter une erreur","stop an error before it happens","A final check helped us avoid a mistake."],
["ensure compliance","garantir la conformité","make sure rules and requirements are respected","I checked the documents to ensure compliance."],
["positive outcome","résultat positif","a successful final result","Clear communication led to a positive outcome."]
],recruitment:[
["give a concrete example","donner un exemple concret","describe one precise event as evidence","Could you give me a concrete example?"],
["transferable skills","compétences transférables","skills useful in a different job or sector","Accuracy is one of my transferable skills."],
["relevant experience","expérience pertinente","experience connected to the position","My administrative work is relevant experience."],
["what was the result?","quel a été le résultat ?","a question asking about the impact of an action","What was the result of your action?"],
["what did you learn?","qu’avez-vous appris ?","a question asking for reflection after an experience","What did you learn from that situation?"],
["how would this help you?","en quoi cela vous aiderait-il ?","a question asking you to connect past skills to a future role","How would this experience help you in Australia?"]
]};
const quizzes={
grammar:[
["I ___ many detailed contracts in my current role.",["have handled","handled last month","have handle"],0,"No finished date: present perfect."],
["Last Tuesday, I ___ an error in a customer file.",["have noticed","noticed","notice"],1,"Last Tuesday is finished: past simple."],
["___ you ever dealt with an urgent request?",["Did","Have","Has"],1,"Ever + experience: Have you ever…?"],
["I ___ the customer yesterday morning.",["have called","called","have call"],1,"Yesterday requires past simple."],
["She has ___ the record already.",["update","updated","updating"],1,"Have/has + past participle."],
["What did you ___ after you found the error?",["did","done","do"],2,"After did, use the base verb."],
["I ___ with contracts for three years and I still do.",["worked","have worked","did work"],1,"For three years + continuing now."],
["In 2025, our team ___ a new procedure.",["introduced","has introduced","has introduce"],0,"In 2025 is a finished time."],
["I have never ___ a deadline.",["miss","missed","missing"],1,"Present perfect needs the past participle."],
["Recently, I ___ more responsibility.",["have taken on","took on yesterday","take on"],0,"Recently can introduce experience linked to now."],
["When the customer called, I ___ the documents immediately.",["have checked","checked","have check"],1,"A completed narrative sequence uses past simple."],
["I ___ many problems. For example, last month I ___ a discrepancy.",["have solved / identified","solved / have identified","have solve / identify"],0,"Experience first; dated evidence second."]
],sarc:[
["Last month, a customer called about an incomplete file.",["Situation","Action","Result","Connection"],0,"This establishes the context."],
["I reviewed the contract and found the missing page.",["Situation","Action","Result","Connection"],1,"This explains what you did."],
["The file was completed before the deadline.",["Situation","Action","Result","Connection"],2,"This states the outcome."],
["This skill would help me check timesheets accurately.",["Situation","Action","Result","Connection"],3,"This connects experience to the future role."],
["During a busy period, two urgent requests arrived together.",["Situation","Action","Result","Connection"],0,"This sets the professional situation."],
["I prioritised the requests and informed my colleague.",["Situation","Action","Result","Connection"],1,"These are your actions."],
["Both customers received an answer that day.",["Situation","Action","Result","Connection"],2,"This is the positive result."],
["It shows that I can remain calm when priorities change.",["Situation","Action","Result","Connection"],3,"This identifies a transferable skill."]
],reading:[
["Which task is part of the role?",["Repairing farm machinery","Checking timesheets","Driving delivery trucks"],1,"The advert explicitly mentions checking timesheets."],
["Who receives reports about discrepancies?",["The site coordinator","The customer","The transport driver"],0,"Discrepancies go to the site coordinator."],
["Which quality is required?",["Advanced agricultural knowledge","Accuracy","Mining experience"],1,"The role requires accuracy."],
["Is previous agricultural experience essential?",["Yes, always","Only for French candidates","No, training is provided"],2,"The advert says it is not essential."],
["What evidence must a candidate provide?",["A workplace problem they solved","A university diploma","A driving test"],0,"A concrete problem-solving example is required."],
["Why could contract experience transfer?",["It proves the candidate can check detailed records","It proves the candidate can harvest fruit","It replaces all training"],0,"Both roles require accurate record checking."]
]};
const followups=[
{q:"What did you learn from that situation?",fr:"Qu’avez-vous appris de cette situation ?",a:"I learned that it is important to check information carefully and communicate quickly. I also learned to ask the right person for help.",b:"I learned that early communication can prevent a small error from becoming a larger problem. The situation also taught me to verify the complete file before processing it and to keep everyone informed."},
{q:"What would you do differently next time?",fr:"Que feriez-vous différemment la prochaine fois ?",a:"Next time, I would use a checklist before I start. This could help me find missing information earlier.",b:"Next time, I would introduce a short checklist at the beginning of the process so that missing information could be identified earlier. I would also confirm the deadline with the customer immediately."},
{q:"How would this experience help you in Australia?",fr:"En quoi cette expérience vous aiderait-elle en Australie ?",a:"It would help me follow procedures and check documents carefully. I could also communicate clearly with my supervisor.",b:"This experience would help me adapt to an Australian workplace because it has taught me to follow procedures, report discrepancies and communicate clearly with different people, even when the sector is new to me."},
{q:"Tell me about a time when your priorities changed.",fr:"Parlez-moi d’une situation où vos priorités ont changé.",a:"One day, I received an urgent request. I changed my schedule and completed the urgent file first. I finished my other work later.",b:"Recently, an urgent customer request changed my planned schedule. I assessed the deadline, informed my colleague and reorganised my task list. I dealt with the urgent file first and still completed my planned work that day."},
{q:"How do you make sure your work is accurate?",fr:"Comment vous assurez-vous que votre travail est exact ?",a:"I check the information twice and follow the procedure. If I am not sure, I ask a colleague.",b:"I use a consistent checking process: I compare the documents, verify key details and review the completed file before submitting it. If information is unclear, I ask for clarification instead of making an assumption."}
];
const audioScripts={listen1:"You mentioned that you are attentive to detail. Could you give me a specific example of a time when you identified an error before it caused a problem? What did you do, and what was the result?",listen2:"Agricultural work can change quickly because of weather, deliveries or staffing. Tell me about a situation when your priorities changed unexpectedly. How did you reorganise your work?"};
const manualMeta={listening:["05 · Listening reformulation","Listening + speaking"],interaction:["06 · Reactive interaction","Speaking"],writing:["07 · Evidence email","Writing"],speaking:["08 · Integrated LILATE mission","Speaking"]};

function speak(text){
 if(!("speechSynthesis" in window)) return alert("Speech synthesis is not available in this browser.");
 speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);
 u.lang=$("#voiceAccent").value; u.rate=Number($("#voiceRate").value);
 const voices=speechSynthesis.getVoices(), lang=u.lang.toLowerCase();
 u.voice=voices.find(v=>v.lang.toLowerCase()===lang)||voices.find(v=>v.lang.toLowerCase().startsWith(lang.slice(0,2)))||null;
 speechSynthesis.speak(u);
}
function renderVocab(){
 const cat=$("#vocabCategory").value, term=$("#vocabSearch").value.trim().toLowerCase();
 const items=vocabulary[cat].filter(x=>x.join(" ").toLowerCase().includes(term));
 $("#vocabCount").textContent=items.length+" words";
 $("#vocabGrid").innerHTML=items.map((x,i)=>`<article class="vocab-card"><div><span class="vocab-index">${String(i+1).padStart(2,"0")}</span><button class="speak-mini" data-vocab="${encodeURIComponent(x[0]+". "+x[3])}">🔊</button></div><h3>${x[0]}</h3><p class="vocab-fr">${x[1]}</p><p><b>Definition:</b> ${x[2]}</p><p class="vocab-example">“${x[3]}”</p></article>`).join("");
 $$("[data-vocab]").forEach(b=>b.onclick=()=>speak(decodeURIComponent(b.dataset.vocab)));
}
function renderQuiz(key){
 const root=$("#"+key+"Quiz"), data=quizzes[key]; root.innerHTML=data.map((q,i)=>`<article class="quiz-card" data-q="${i}"><div class="question-number">${String(i+1).padStart(2,"0")}</div><h3>${q[0]}</h3><div class="option-stack">${q[1].map((o,j)=>`<button type="button" data-choice="${j}">${o}</button>`).join("")}</div><div class="feedback-box"></div></article>`).join("");
 $$("[data-choice]",root).forEach(btn=>btn.onclick=()=>answerQuiz(key,btn.closest("[data-q]"),Number(btn.dataset.choice)));
 restoreQuiz(key);
}
function answerQuiz(key,card,choice){
 const i=Number(card.dataset.q), q=quizzes[key][i]; if(state.answers[key]?.[i]!==undefined)return;
 state.answers[key]??={}; state.answers[key][i]=choice;
 const ok=choice===q[2]; $$("[data-choice]",card).forEach((b,j)=>{b.disabled=true;b.classList.toggle("correct",j===q[2]);b.classList.toggle("incorrect",j===choice&&!ok)});
 $(".feedback-box",card).textContent=(ok?"✓ Correct. ":"✗ Review: ")+q[3]; $(".feedback-box",card).classList.add(ok?"success":"error");
 calculate(key); save();
}
function restoreQuiz(key){
 Object.entries(state.answers[key]||{}).forEach(([i,c])=>{const card=$(`#${key}Quiz [data-q="${i}"]`);if(!card)return;const q=quizzes[key][i],ok=Number(c)===q[2];$$("[data-choice]",card).forEach((b,j)=>{b.disabled=true;b.classList.toggle("correct",j===q[2]);b.classList.toggle("incorrect",j===Number(c)&&!ok)});const f=$(".feedback-box",card);f.textContent=(ok?"✓ Correct. ":"✗ Review: ")+q[3];f.classList.add(ok?"success":"error")}); calculate(key);
}
function calculate(key){const a=state.answers[key]||{};state.scores[key]=Object.entries(a).filter(([i,c])=>Number(c)===quizzes[key][Number(i)][2]).length;$("#"+key+"Score").textContent=state.scores[key]+" / "+quizzes[key].length;renderSummary();}
function resetQuiz(key){delete state.answers[key];state.scores[key]=0;renderQuiz(key);save();}
function renderFollowup(){
 const i=Number($("#followupSelect").value||0),f=followups[i];$("#followupQuestion").textContent=f.q;$("#followupFrench").textContent=f.fr;$("#followupA2").textContent=f.a;$("#followupB1").textContent=f.b;$("#followupModels").classList.add("hidden");
}
function manualCard(key){
 const [title,type]=manualMeta[key],m=state.manual[key]||{observed:false,status:"Pas commencé",note:""};
 return `<aside class="manual-checkpoint" data-manual="${key}"><div class="manual-checkpoint-heading"><div><strong>Trainer checkpoint · ${title}</strong><span>${type}</span></div><span class="exercise-type-tag">${type.toUpperCase()}</span></div><div class="manual-checkpoint-grid"><label class="assessment-check"><input type="checkbox" data-mf="observed" ${m.observed?"checked":""}><span>Observed</span></label><label>Status<select data-mf="status">${["Pas commencé","En cours","Acquis","Non acquis"].map(x=>`<option ${m.status===x?"selected":""}>${x}</option>`).join("")}</select></label><label>Trainer note<textarea data-mf="note" rows="3">${m.note||""}</textarea></label></div></aside>`;
}
function renderManual(){
 $$(".manual-slot").forEach(s=>s.innerHTML=manualCard(s.dataset.key));
 $$(".manual-checkpoint").forEach(card=>$$("[data-mf]",card).forEach(el=>el.oninput=()=>{const k=card.dataset.manual;state.manual[k]??={};state.manual[k][el.dataset.mf]=el.type==="checkbox"?el.checked:el.value;save();renderSummary()})); renderSummary();
}
function renderSummary(){
 if(!$("#autoSummary"))return; const auto=[["Grammar",state.scores.grammar||0,12],["S-A-R-C",state.scores.sarc||0,8],["Reading",state.scores.reading||0,6]];
 $("#autoSummary").innerHTML=auto.map(x=>`<div class="summary-row"><span>${x[0]}</span><strong>${x[1]} / ${x[2]}</strong></div>`).join("");
 const total=auto.reduce((s,x)=>s+x[1],0);$("#totalScore").textContent=total+" / 26";$("#totalPercent").textContent=Math.round(total/26*100)+"%";
 $("#manualSummary").innerHTML=Object.entries(manualMeta).map(([k,v])=>{const m=state.manual[k]||{};return `<div class="summary-row"><span>${v[0]}<small>${v[1]}</small></span><strong>${m.status||"Pas commencé"}</strong></div>`}).join("");
}
function save(){
 $$("[data-save]").forEach(el=>state.answers["field:"+el.dataset.save]=el.value); localStorage.setItem(KEY,JSON.stringify(state));$("#saveBtn").textContent="✓ Saved";setTimeout(()=>$("#saveBtn").textContent="💾 Save",1200);
}
function load(){
 try{state=Object.assign(state,JSON.parse(localStorage.getItem(KEY)||"{}"));state.answers??={};state.scores??={};state.manual??={}}catch(e){}
 $$("[data-save]").forEach(el=>{const v=state.answers["field:"+el.dataset.save];if(v!==undefined)el.value=v});
}
function writingStats(){
 const t=$("#employerEmail").value.trim(),words=t?t.split(/\s+/).length:0,sent=(t.match(/[.!?]+(?=\s|$)/g)||[]).length;$("#writingStats").textContent=`${words} words · ${sent} sentences`;return {t,words,sent};
}
function analyseWriting(){
 const {t,words}=writingStats(),tests=[["a greeting",/hello|dear/i],["current experience",/currently|current|work|position/i],["a precise past example",/last|recently|ago|yesterday|when/i],["an action",/contacted|checked|reviewed|explained|updated|coordinated/i],["a result",/result|therefore|completed|processed|deadline|on time/i],["a connection to the role",/harvest|team|role|transfer|would help|could help/i],["a closing",/kind regards|best regards/i]];
 const found=tests.filter(x=>x[1].test(t)).map(x=>x[0]),missing=tests.filter(x=>!x[1].test(t)).map(x=>x[0]);
 $("#writingFeedback").innerHTML=`<b>${words} words</b> — ${words>=90&&words<=120?"✓ target reached":words<90?"Develop your answer to reach 90 words.":"Try to reduce it to 120 words."}<br><b>Included:</b> ${found.join(", ")||"Start writing."}<br><b>Check:</b> ${missing.join(", ")||"All requested parts are present."}`;
}
function report(){
 const total=(state.scores.grammar||0)+(state.scores.sarc||0)+(state.scores.reading||0);
 return `MARINE HOLY — LESSON 5 · LILATE\nFrom Experience to Evidence\nDate: ${new Date().toLocaleDateString("en-GB")}\n\nAUTOMATIC RESULTS\nGrammar: ${state.scores.grammar||0}/12\nS-A-R-C: ${state.scores.sarc||0}/8\nReading: ${state.scores.reading||0}/6\nTotal: ${total}/26 (${Math.round(total/26*100)}%)\n\nTRAINER OBSERVATIONS\n${Object.entries(manualMeta).map(([k,v])=>`${v[0]}: ${state.manual[k]?.status||"Pas commencé"}\nComment: ${state.manual[k]?.note||"—"}`).join("\n")}\n\nGeneral comments: ${state.answers["field:trainerComments"]||"—"}\nLearner confidence: ${state.answers["field:confidence"]||"—"}\nPractice again: ${state.answers["field:learnerComment"]||"—"}`;
}
let mediaRecorder,chunks=[],timer,startTime;
async function startRecording(){try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>chunks.push(e.data);mediaRecorder.onstop=()=>{const blob=new Blob(chunks,{type:mediaRecorder.mimeType}),url=URL.createObjectURL(blob);$("#recordedAudio").src=url;$("#downloadAudio").href=url;$("#downloadAudio").classList.remove("disabled");stream.getTracks().forEach(t=>t.stop())};mediaRecorder.start();startTime=Date.now();timer=setInterval(()=>{const s=Math.floor((Date.now()-startTime)/1000);$("#recordTimer").textContent=String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")},500);$("#startRecording").disabled=true;$("#stopRecording").disabled=false}catch(e){alert("Microphone access was not available. Please check your browser permission.")}}
function init(){
 load(); renderVocab(); ["grammar","sarc","reading"].forEach(renderQuiz);
 $("#followupSelect").innerHTML=followups.map((f,i)=>`<option value="${i}">${i+1} · ${f.q}</option>`).join("");renderFollowup();renderManual();
 $("#revisionGrid").innerHTML=["I have handled many detailed contracts.","For example, last month I identified an error.","I contacted the customer and updated the file.","As a result, the contract was completed on time.","This experience would help me work accurately in Australia."].map(x=>`<article class="revision-card"><p>${x}</p><button class="speak-mini" data-speak="${x}">🔊</button></article>`).join("");
 $$(".model-toggle,.transcript-toggle").forEach(b=>b.onclick=()=>$("#"+b.dataset.target).classList.toggle("hidden"));
 $$("[data-speak]").forEach(b=>b.onclick=()=>speak(b.dataset.speak)); $$("[data-speak-target]").forEach(b=>b.onclick=()=>speak($("#"+b.dataset.speakTarget).innerText));
 $$(".listen-btn").forEach(b=>b.onclick=()=>speak(audioScripts[b.dataset.audio]));
 $("#vocabCategory").onchange=renderVocab;$("#vocabSearch").oninput=renderVocab;
 $("#translationToggle").onchange=()=>document.body.classList.toggle("hide-fr",!$("#translationToggle").checked);
 $("#lessonMode").onchange=()=>{const challenge=$("#lessonMode").value==="challenge";$("#translationToggle").checked=!challenge;document.body.classList.toggle("hide-fr",challenge)};
 $$("[data-reset]").forEach(b=>b.onclick=()=>resetQuiz(b.dataset.reset));
 $("#readingHint").onclick=()=>$("#readingHintBox").classList.toggle("hidden");
 $("#followupSelect").onchange=renderFollowup;$("#speakFollowup").onclick=()=>speak(followups[Number($("#followupSelect").value)].q);$("#followupModelsBtn").onclick=()=>$("#followupModels").classList.toggle("hidden");
 $$("[data-save]").forEach(el=>el.oninput=()=>{if(el.id==="employerEmail")writingStats();save()});writingStats();$("#analyseWriting").onclick=analyseWriting;
 $("#saveBtn").onclick=save;$("#resumeBtn").onclick=()=>{$("#grammar").scrollIntoView({behavior:"smooth"})};$("#printBtn").onclick=()=>window.print();
 $("#startRecording").onclick=startRecording;$("#stopRecording").onclick=()=>{if(mediaRecorder?.state==="recording"){mediaRecorder.stop();clearInterval(timer);$("#startRecording").disabled=false;$("#stopRecording").disabled=true}};
 $("#copyReport").onclick=async()=>{save();await navigator.clipboard.writeText(report());$("#reportFeedback").textContent="✓ Progress report copied."};
 $("#downloadReport").onclick=()=>{save();const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([report()],{type:"text/plain"}));a.download="Marine-Lesson-5-Qualiopi-Report.txt";a.click()};
 $("#resetLesson").onclick=()=>{if(confirm("Reset all saved work for this lesson?")){localStorage.removeItem(KEY);location.reload()}};
 $("#backToTop").onclick=()=>scrollTo({top:0,behavior:"smooth"});window.addEventListener("scroll",()=>$("#backToTop").classList.toggle("visible",scrollY>700));
 if("speechSynthesis" in window)speechSynthesis.onvoiceschanged=()=>{$("#voiceAvailability").textContent="Voice tools ready · Australian, British and American accents available."};
}
document.addEventListener("DOMContentLoaded",init);
})();
