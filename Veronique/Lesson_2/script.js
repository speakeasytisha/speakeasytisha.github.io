const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

const state={qcm:{},fill:{},listen:{},mode:"practice",scenario:0};
const qcmData=[
 {q:"A receptionist says: “Your room will be ready around three.” What is the best reply?",a:"Great, can I leave my luggage here until then?",o:["Great, can I leave my luggage here until then?","I am room at three.","Where your luggage is?"]},
 {q:"You did not understand a fast speaker. What sounds natural?",a:"Sorry, could you say that a little more slowly?",o:["Sorry, could you say that a little more slowly?","Repeat because your English is fast.","I don't have understanding."]},
 {q:"You want a recommendation in a restaurant.",a:"What would you recommend?",o:["What would you recommend?","What do you recommend me to eat it?","Which food is more good?"]},
 {q:"You are checking directions.",a:"So I go straight and turn left at the traffic lights, right?",o:["So I go straight and turn left at the traffic lights, right?","I left in the traffic?","You said straight because left?"]},
 {q:"Someone asks, “How was your trip?”",a:"It was great, thanks. We visited a lot of places. Have you ever been there?",o:["It was great, thanks. We visited a lot of places. Have you ever been there?","Yes, trip.","It was travel with many."]},
 {q:"You need to change an appointment politely.",a:"Would it be possible to move the appointment to Thursday?",o:["Would it be possible to move the appointment to Thursday?","I want Thursday instead.","You change appointment Thursday?"]}
];

const fillData=[
 {s:"Excuse me, could you _____ me?",a:"help",hint:"verb: assist"},
 {s:"Could you say that a little more _____?",a:"slowly",hint:"opposite of quickly"},
 {s:"I’d _____ a table for two, please.",a:"like",hint:"polite request: I’d ___"},
 {s:"How long does it _____ to get there?",a:"take",hint:"time needed"},
 {s:"Is there a subway station _____ here?",a:"near",hint:"close to"},
 {s:"Would it be _____ to change the appointment?",a:"possible",hint:"polite: would it be ___ to…"}
];

const vocab={
 hotel:[
  ["I have a reservation.","J’ai une réservation.","Use this to begin at reception.","I have a reservation under the name Martin."],
  ["Could I leave my luggage here?","Puis-je laisser mes bagages ici ?","Useful before check-in or after check-out.","Could I leave my luggage here until three?"],
  ["Is breakfast included?","Le petit-déjeuner est-il compris ?","Ask what the room price includes.","Is breakfast included in the room rate?"],
  ["Could you take a look at this?","Pourriez-vous regarder ceci ?","A polite way to report a small problem.","The air conditioning isn’t working. Could you take a look at this?"],
  ["What time is check-out?","À quelle heure faut-il libérer la chambre ?","Ask for the departure time.","What time is check-out tomorrow?"],
  ["Could you recommend somewhere nearby?","Pourriez-vous recommander un endroit à proximité ?","Ask for a local recommendation.","Could you recommend somewhere nearby for dinner?"]
 ],
 restaurant:[
  ["A table for two, please.","Une table pour deux, s’il vous plaît.","Simple restaurant opening.","Hi, a table for two, please."],
  ["What would you recommend?","Qu’est-ce que vous recommandez ?","Ask for the server’s suggestion.","I like fish. What would you recommend?"],
  ["What does this come with?","Avec quoi est-ce servi ?","Ask about sides/accompaniments.","What does the salmon come with?"],
  ["Could we have the check, please?","L’addition, s’il vous plaît.","US restaurant English.","Excuse me, could we have the check, please?"],
  ["I’ll have…","Je vais prendre…","Natural way to order.","I’ll have the chicken, please."],
  ["Could I get this without…?","Puis-je l’avoir sans… ?","Modify an order politely.","Could I get this without onions?"]
 ],
 directions:[
  ["I’m looking for…","Je cherche…","Start a directions question.","I’m looking for the nearest subway station."],
  ["Is it within walking distance?","Est-ce accessible à pied ?","Ask whether it is close enough to walk.","Is Central Park within walking distance?"],
  ["How long does it take?","Combien de temps faut-il ?","Ask about travel time.","How long does it take by subway?"],
  ["Which line do I need?","Quelle ligne dois-je prendre ?","Useful for subway/train travel.","Which line do I need for Times Square?"],
  ["Where should I get off?","Où dois-je descendre ?","Ask for the correct stop.","Where should I get off for the museum?"],
  ["So I turn right after…?","Donc je tourne à droite après… ?","Repeat directions to check understanding.","So I turn right after the bank?"]
 ],
 social:[
  ["How’s your day going?","Comment se passe votre journée ?","Friendly small talk.","Hi! How’s your day going?"],
  ["That sounds interesting.","Ça a l’air intéressant.","Show interest and keep the exchange warm.","That sounds interesting. How did you get into that?"],
  ["What about you?","Et vous / toi ?","Send the conversation back.","I love travelling. What about you?"],
  ["Actually…","En fait…","Correct or add information naturally.","Actually, it’s my first time in New York."],
  ["By the way…","Au fait…","Change topic smoothly.","By the way, do you know a good café nearby?"],
  ["I’ve always wanted to…","J’ai toujours voulu…","Talk about an ambition or travel wish.","I’ve always wanted to see New York in spring."]
 ],
 appointments:[
  ["I’d like to make an appointment.","Je voudrais prendre rendez-vous.","Arrange a new appointment.","I’d like to make an appointment for next week."],
  ["I’m calling to confirm…","J’appelle pour confirmer…","Confirm practical information.","I’m calling to confirm Tuesday’s appointment."],
  ["Would it be possible to move it?","Serait-il possible de le déplacer ?","Change an appointment politely.","Would it be possible to move it to Thursday?"],
  ["Please arrive ten minutes early.","Merci d’arriver dix minutes en avance.","Give clear instructions.","Please arrive ten minutes early and bring your document."],
  ["The appointment has been cancelled.","Le rendez-vous a été annulé.","Explain a change.","The appointment has been cancelled, so we need a new date."],
  ["I’ll check and get back to you.","Je vais vérifier et revenir vers vous.","Useful when you need time.","I’ll check the schedule and get back to you this afternoon."]
 ],
 rescue:[
  ["Could you repeat that, please?","Pouvez-vous répéter, s’il vous plaît ?","The essential repair phrase.","Sorry, could you repeat that, please?"],
  ["Could you say that more slowly?","Pouvez-vous parler plus lentement ?","Use when speed is the problem.","Could you say that a little more slowly?"],
  ["Sorry, I didn’t catch that.","Désolée, je n’ai pas compris / saisi.","Natural spoken English.","Sorry, I didn’t catch the street name."],
  ["Do you mean…?","Vous voulez dire… ?","Check meaning.","Do you mean the entrance on the left?"],
  ["How do you say…?","Comment dit-on… ?","Ask for a missing word.","How do you say this in English?"],
  ["It’s a kind of…","C’est une sorte de…","Explain a word you cannot remember.","It’s a kind of exercise you do in a swimming pool."]
 ]
};

const scenarios=[
 {icon:"🏨",name:"Hotel",title:"Your room is not ready",prompt:"You arrive at 11:30 a.m. Check-in is at 3 p.m. Ask to leave your luggage, ask when to return, and ask for a lunch recommendation nearby.",phrases:["I have a reservation…","Could I leave…?","What time…?","Could you recommend…?"],m1:"Hi, I have a reservation, but I know check-in is at three. Could I leave my luggage here? What time should I come back? Also, could you recommend a place for lunch nearby?",m2:"Hi, I have a reservation and I’ve arrived a little earlier than expected. Would it be possible to leave my luggage at reception until the room is ready? What time would you suggest coming back? And while I’m waiting, could you recommend a good place for lunch within walking distance?"},
 {icon:"🍽",name:"Restaurant",title:"Order + clarify + solve",prompt:"You want a table for two. Ask what a dish contains. Then explain politely that the meal you received is not what you ordered.",phrases:["A table for two…","What does…come with?","I’m sorry, but…","I ordered…"],m1:"Hi, a table for two, please. What does the chicken come with? Thank you. I’m sorry, but I think this is the wrong dish. I ordered the chicken, not the fish.",m2:"Hi, do you have a table for two? Before I order, could you tell me what the chicken comes with? Thanks. Excuse me, I’m sorry, but I think there’s been a small mix-up. I ordered the chicken, but I was given the fish. Could you change it, please?"},
 {icon:"🧭",name:"Directions",title:"Find the subway and check",prompt:"Ask a passer-by how to get to the nearest subway station. Ask how long it takes, then repeat the directions to check you understood.",phrases:["Excuse me…","I’m looking for…","How long…?","So I…right?"],m1:"Excuse me, could you help me? I’m looking for the nearest subway station. How long does it take to walk there? So I go straight, then turn right after the bank, right?",m2:"Excuse me, sorry to bother you. Could you tell me how to get to the nearest subway station? Is it within walking distance? Great, so if I understood correctly, I go straight for two blocks and turn right just after the bank. Is that right?"},
 {icon:"📅",name:"Appointment",title:"Change a plan politely",prompt:"An appointment has to be changed. Explain the situation, propose Thursday afternoon, and confirm what the person needs to bring.",phrases:["I’m calling about…","Unfortunately…","Would Thursday…?","Please remember to…"],m1:"Hello, I’m calling about your appointment. Unfortunately, we need to change the time. Would Thursday afternoon be possible for you? Please remember to bring your document.",m2:"Hello, I’m calling about your appointment scheduled for Tuesday. Unfortunately, we need to reschedule it. Would Thursday afternoon work for you instead? If that’s convenient, I can confirm it now. Please remember to bring the requested document with you."},
 {icon:"🏛",name:"Outing",title:"Organise a museum visit",prompt:"Explain that you are organising a museum visit for a small group. Ask about opening time, accessibility, group tickets and how long a visit usually takes.",phrases:["I’m organising…","Could you tell me…?","Is it accessible…?","How long…?"],m1:"Hello, I’m organising a museum visit for a small group. What time do you open? Is the museum accessible for people with limited mobility? Do you have group tickets? How long does a visit usually take?",m2:"Hello, I’m organising a museum visit for a small group and I’d like to check a few practical details. Could you tell me your opening time and whether the museum is fully accessible for visitors with limited mobility? Do you offer group rates, and roughly how much time should we allow for the visit?"},
 {icon:"💬",name:"Small talk",title:"Keep the conversation alive",prompt:"Someone tells you they love travelling. React, share one detail about your own travels, and ask two follow-up questions.",phrases:["Me too…","I’ve been to…","What about…?","Which place…?"],m1:"Me too, I really enjoy travelling. I’ve visited several countries in Europe, including Italy and Spain. What about you? Which country did you enjoy the most?",m2:"Me too, travelling is one of the things I really enjoy. I’ve had the chance to visit quite a few places around Europe, including Italy, Spain and Romania. I especially like discovering how people live and communicate in different places. What about you—what’s been your favourite trip so far, and where would you like to go next?"}
];

const dragData=[
 ["Could","you","say","that","a little","more slowly","?"],
 ["What","would","you","recommend","?"],
 ["How long","does","it","take","to get there","?"]
];

function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function speak(text){
  if(!("speechSynthesis" in window)) return alert("Speech synthesis is not supported in this browser.");
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang=$("#accentSelect").value;
  const voices=speechSynthesis.getVoices();
  const target=voices.find(v=>v.lang===u.lang)||voices.find(v=>v.lang.startsWith(u.lang.slice(0,2)));
  if(target)u.voice=target;
  u.rate=.9;speechSynthesis.speak(u);
}
function renderVocab(){
 const cat=$("#vocabCategory").value;
 $("#vocabGrid").innerHTML=vocab[cat].map(([en,fr,def,ex])=>`<article class="vocab-card"><h3>${en}</h3><div class="vocab-fr">${fr}</div><p class="vocab-def">${def}</p><p class="vocab-example"><b>Example:</b> ${ex}</p><button class="vocab-speak" data-text="${encodeURIComponent(en+" "+ex)}">🔊 Listen</button></article>`).join("");
 $$(".vocab-speak").forEach(b=>b.onclick=()=>speak(decodeURIComponent(b.dataset.text)));
}
function renderQCM(){
 $("#qcmList").innerHTML=qcmData.map((x,i)=>`<article class="quiz-card"><p>${i+1}. ${x.q}</p><div class="options">${shuffle(x.o).map(o=>`<button class="option-btn" data-i="${i}" data-v="${encodeURIComponent(o)}">${o}</button>`).join("")}</div><div class="feedback" id="qf${i}"></div></article>`).join("");
 $$("#qcmList .option-btn").forEach(b=>b.onclick=()=>{
   const i=+b.dataset.i,v=decodeURIComponent(b.dataset.v),ok=v===qcmData[i].a;
   state.qcm[i]=ok; const card=b.closest(".quiz-card");
   $$(".option-btn",card).forEach(x=>{x.disabled=true; if(decodeURIComponent(x.dataset.v)===qcmData[i].a)x.classList.add("correct")});
   if(!ok)b.classList.add("wrong");
   const f=$("#qf"+i);f.textContent=ok?"✓ Natural and clear.":"Not quite. Notice the more natural structure highlighted above.";f.className="feedback "+(ok?"good":"bad");
   updateScores();
 });
}
function renderFill(){
 $("#fillList").innerHTML=fillData.map((x,i)=>`<article class="fill-card"><p>${i+1}. ${x.s}</p><div class="fill-row"><input id="fi${i}" autocomplete="off"><button class="primary fill-check" data-i="${i}">Check</button><button class="secondary practice-only hint-btn" data-i="${i}">Hint</button></div><div class="hint" id="hint${i}">Hint: ${x.hint}</div><div class="feedback" id="ff${i}"></div></article>`).join("");
 $$(".fill-check").forEach(b=>b.onclick=()=>{
   const i=+b.dataset.i, val=$("#fi"+i).value.trim().toLowerCase().replace(/[.!?]/g,""), ok=val===fillData[i].a;
   state.fill[i]=ok; $("#ff"+i).textContent=ok?"✓ Correct.":"Try again. Think of the complete expression.";$("#ff"+i).className="feedback "+(ok?"good":"bad");updateScores();
 });
 $$(".hint-btn").forEach(b=>b.onclick=()=>$("#hint"+b.dataset.i).style.display="block");
}
function renderDrag(){
 $("#dragExercises").innerHTML=dragData.map((parts,i)=>{
   const tokens=shuffle(parts);
   return `<article class="drag-card"><p><b>${i+1}.</b> Build the natural sentence.</p><div class="drop-zone" id="drop${i}" data-i="${i}"></div><div class="token-bank" id="bank${i}">${tokens.map((t,j)=>`<button draggable="true" class="token" data-value="${encodeURIComponent(t)}">${t}</button>`).join("")}</div><button class="secondary drag-check" data-i="${i}">Check sentence</button><button class="secondary drag-reset" data-i="${i}">Reset</button><div class="feedback" id="df${i}"></div></article>`;
 }).join("");
 $$(".token").forEach(t=>{
   t.addEventListener("dragstart",e=>e.dataTransfer.setData("text/plain",t.dataset.value));
   t.onclick=()=>{const z=t.closest(".drag-card").querySelector(".drop-zone");z.appendChild(t)};
 });
 $$(".drop-zone").forEach(z=>{
   z.addEventListener("dragover",e=>e.preventDefault());
   z.addEventListener("drop",e=>{e.preventDefault();const v=e.dataTransfer.getData("text/plain");const t=$(`.token[data-value="${CSS.escape(v)}"]`,z.closest(".drag-card"));if(t)z.appendChild(t)});
 });
 $$(".drag-check").forEach(b=>b.onclick=()=>{
   const i=+b.dataset.i,z=$("#drop"+i),got=$$(".token",z).map(t=>decodeURIComponent(t.dataset.value)).join(" "),expected=dragData[i].join(" ");
   const ok=got===expected;$("#df"+i).textContent=ok?"✓ Perfect order.":"Not yet. Read it aloud and check the question structure.";$("#df"+i).className="feedback "+(ok?"good":"bad");
 });
 $$(".drag-reset").forEach(b=>b.onclick=()=>renderDrag());
}
const listeningText="Hi! Just a quick update: your room isn't ready yet, but we can store your luggage at the front desk. Check-in starts at three, and there's a café around the corner if you'd like to wait nearby. When you come back, just give us your last name.";
const listeningData=[
 {q:"What can the hotel do now?",a:"Store the luggage",o:["Store the luggage","Prepare breakfast"]},
 {q:"What time does check-in start?",a:"3:00 p.m.",o:["11:00 a.m.","3:00 p.m."]},
 {q:"What information should you give when you return?",a:"Your last name",o:["Your last name","Your passport number"]}
];
function renderListening(){
 $("#listeningQuestions").innerHTML=listeningData.map((x,i)=>`<article class="quiz-card"><p>${x.q}</p><div class="options">${shuffle(x.o).map(o=>`<button class="option-btn listen-opt" data-i="${i}" data-v="${encodeURIComponent(o)}">${o}</button>`).join("")}</div><div class="feedback" id="lf${i}"></div></article>`).join("");
 $$(".listen-opt").forEach(b=>b.onclick=()=>{
   const i=+b.dataset.i,v=decodeURIComponent(b.dataset.v),ok=v===listeningData[i].a;state.listen[i]=ok;
   const card=b.closest(".quiz-card");$$(".option-btn",card).forEach(x=>{x.disabled=true;if(decodeURIComponent(x.dataset.v)===listeningData[i].a)x.classList.add("correct")});if(!ok)b.classList.add("wrong");
   $("#lf"+i).textContent=ok?"✓ Yes.":"Not this one. Listen again for the key information.";$("#lf"+i).className="feedback "+(ok?"good":"bad");updateScores();
 });
}
function renderScenarios(){
 $("#scenarioTabs").innerHTML=scenarios.map((s,i)=>`<button class="scenario-tab ${i===state.scenario?"active":""}" data-i="${i}">${s.icon} ${s.name}</button>`).join("");
 const s=scenarios[state.scenario];
 $("#scenarioStage").innerHTML=`<div class="scenario-layout"><div><p class="micro-label">${s.icon} ${s.name}</p><h3>${s.title}</h3><p>${s.prompt}</p><h4>Useful building blocks</h4><div class="phrase-bank">${s.phrases.map(p=>`<span>${p}</span>`).join("")}</div><button class="secondary speak-btn scenario-hear" data-text="${encodeURIComponent(s.prompt)}">▶ Hear the task</button></div><div><label><b>Build your response</b><textarea rows="7" class="scenario-notes" placeholder="Write keywords or your answer here..."></textarea></label><div class="manual-score"><label>Speaking score / 10 <input type="number" min="0" max="10" class="scenario-score"></label></div><div class="model-grid model-practice"><details class="model-box"><summary>Model · Level 1</summary><p>${s.m1}</p><button class="secondary model-speak" data-text="${encodeURIComponent(s.m1)}">🔊 Listen</button></details><details class="model-box"><summary>Model · Level 2</summary><p>${s.m2}</p><button class="secondary model-speak" data-text="${encodeURIComponent(s.m2)}">🔊 Listen</button></details></div></div></div>`;
 $$(".scenario-tab").forEach(b=>b.onclick=()=>{state.scenario=+b.dataset.i;renderScenarios()});
 $$(".scenario-hear,.model-speak").forEach(b=>b.onclick=()=>speak(decodeURIComponent(b.dataset.text)));
}
function updateScores(){
 const qc=Object.values(state.qcm).filter(Boolean).length, fc=Object.values(state.fill).filter(Boolean).length;
 $("#qcmScore").textContent=`${qc} / 6`;$("#fillScore").textContent=`${fc} / 6`;
 const completed=Object.keys(state.qcm).length+Object.keys(state.fill).length+Object.keys(state.listen).length+$$(".mission-check:checked").length+$$(".eval-select").filter(x=>x.value).length;
 const total=6+6+3+3+6; const pct=Math.min(100,Math.round(completed/total*100));
 $("#progressBar").style.width=pct+"%";$("#progressText").textContent=pct+"% complete";
 localStorage.setItem("veroniqueLessonState",JSON.stringify({qcm:state.qcm,fill:state.fill,listen:state.listen,mode:state.mode}));
}
function initTimer(){
 let remaining=60,interval=null;
 function paint(){const m=String(Math.floor(remaining/60)).padStart(2,"0"),s=String(remaining%60).padStart(2,"0");$("#timerDisplay").textContent=`${m}:${s}`}
 $("#timerStart").onclick=()=>{if(interval)return; interval=setInterval(()=>{remaining--;paint();if(remaining<=0){clearInterval(interval);interval=null;speak("Time is up.");}},1000)};
 $("#timerReset").onclick=()=>{clearInterval(interval);interval=null;remaining=60;paint()};paint();
}
function download(name,text,type="text/plain"){
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);
}
function collectReport(){
 const evals=$$(".eval-select").map((x,i)=>`<li>${["Ask for help politely","Ask for repetition / slower speech","Manage a hotel or restaurant exchange","Ask for and check directions","Keep a short conversation going","Respond to a timed speaking task"][i]}: <b>${x.value||"Not completed"}</b></li>`).join("");
 const conf=$('input[name="confidence"]:checked')?.value||"Not completed";
 return `<!doctype html><html><head><meta charset="utf-8"><title>Lesson report</title><style>body{font-family:Arial,sans-serif;max-width:850px;margin:40px auto;line-height:1.5;color:#222}h1{color:#6f2036}section{border:1px solid #ddd;padding:18px;margin:15px 0;border-radius:12px}</style></head><body><h1>Everyday English Confidence Lab · Lesson report</h1><section><h2>Automated practice</h2><p>QCM: ${Object.values(state.qcm).filter(Boolean).length}/6</p><p>Fill in the blank: ${Object.values(state.fill).filter(Boolean).length}/6</p><p>Listening: ${Object.values(state.listen).filter(Boolean).length}/3</p></section><section><h2>Trainer / learner scores</h2><p>Writing A: ${$("#writingAScore").value||"—"}/10</p><p>Writing B: ${$("#writingBScore").value||"—"}/10</p><p>Timed oral: ${$("#oralScore").value||"—"}/10</p><p>Confidence self-rating: ${conf}/4</p></section><section><h2>Learning evaluation</h2><ul>${evals}</ul></section><section><h2>Reflection</h2><p><b>What felt easier today?</b><br>${($("#easyToday").value||"—").replaceAll("<","&lt;")}</p><p><b>What should we practise again?</b><br>${($("#nextFocus").value||"—").replaceAll("<","&lt;")}</p></section></body></html>`;
}
function init(){
 $("#jsWarning").style.display="none";
 $$("[data-scroll]").forEach(b=>b.onclick=()=>$(b.dataset.scroll).scrollIntoView({behavior:"smooth"}));
 $$(".speak-btn").forEach(b=>b.onclick=()=>speak(b.dataset.say||b.textContent));
 $("#vocabCategory").onchange=renderVocab;
 $("#modeSelect").onchange=e=>{state.mode=e.target.value;document.body.classList.toggle("challenge-mode",state.mode==="challenge");updateScores()};
 $("#accentSelect").onchange=()=>speechSynthesis.cancel();
 $("#playListening").onclick=()=>speak(listeningText);
 $("#toggleTranscript").onclick=()=>{const t=$("#transcript");t.classList.toggle("hidden");$("#toggleTranscript").textContent=t.classList.contains("hidden")?"Show transcript":"Hide transcript"};
 $("#downloadObjectives").onclick=()=>download("training-objectives-everyday-english.txt",`TRAINING OBJECTIVES\n\n1. Speak more spontaneously about familiar daily and travel subjects.\n2. Understand the key message from everyday speakers without needing every word.\n3. Travel more independently: hotels, restaurants, transport, directions, shopping and small problems.\n4. Build and reuse practical everyday vocabulary and expressions.\n5. Keep conversations going with reactions, follow-up questions and repair strategies.\n6. Transfer real-life English into certification-style listening, speaking, reading and short writing tasks.\n\nPriority: useful communication first, then accuracy and range.`);
 $("#downloadReport").onclick=()=>download("everyday-english-lesson-report.html",collectReport(),"text/html");
 $("#printBtn").onclick=()=>window.print();
 $("#resetBtn").onclick=()=>{if(confirm("Reset all interactive lesson progress?")){localStorage.removeItem("veroniqueLessonState");location.reload()}};
 $$(".mission-check,.eval-select").forEach(x=>x.addEventListener("change",updateScores));
 renderVocab();renderQCM();renderFill();renderDrag();renderListening();renderScenarios();initTimer();updateScores();
}
document.addEventListener("DOMContentLoaded",init);
