const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const state={warm:{},imperative:{},prep:{},indirect:{},modal:{},tense:{},directions:{},recap:{},bridge:false,transport:{},conversation:0};

const warmQuiz=[
 {q:"Which photo is most useful if you need to identify the name of a street or avenue?",a:"Fifth Avenue sign",o:["Fifth Avenue sign","Yellow cab","Subway platform"],hint:"Look for written street information."},
 {q:"Before entering a subway train, what is the most useful thing to check?",a:"The line and direction",o:["The color of the seats","The line and direction","The taxi fare"],hint:"You need to know where the train is going."},
 {q:"What information does a taxi driver need first?",a:"Your destination",o:["Your destination","Your hotel room number","Your subway line"],hint:"Where do you want to go?"}
];

const imperativeQuiz=[
 {q:"Choose the correct direction.",a:"Turn left at the lights.",o:["You turn left at the lights.","Turn left at the lights.","Turning left at the lights."],hint:"Directions normally start with the base verb."},
 {q:"Complete: ___ the second street on the right.",a:"Take",o:["Taking","Take","Takes"],hint:"Use the base verb."},
 {q:"Choose the negative instruction.",a:"Don't take the express train.",o:["Not take the express train.","Don't take the express train.","Doesn't take the express train."],hint:"Negative imperative = Don't + base verb."},
 {q:"Which is a correct direction?",a:"Walk past the bank.",o:["Walk past the bank.","Walk passed the bank.","Walk passing the bank."],hint:"Past is a preposition here, not a past-tense verb."}
];

const prepQuiz=[
 {q:"The restaurant is ___ 44th Street.",a:"on",o:["at","on","in"],hint:"Use ON with a street."},
 {q:"Meet me ___ the subway entrance.",a:"at",o:["in","on","at"],hint:"Use AT for a precise point."},
 {q:"The hotel is ___ Midtown.",a:"in",o:["in","on","at"],hint:"Use IN for an area or neighborhood."},
 {q:"The café is ___ the hotel and the theatre.",a:"between",o:["behind","between","near to"],hint:"There is one place on each side."},
 {q:"The bank is on the other side of the street. It is ___ the hotel.",a:"across from",o:["next to","across from","between"],hint:"Other side of the street = across from / opposite."}
];

const indirectQuiz=[
 {q:"Choose the correct direct question.",a:"Where is the subway entrance?",o:["Where the subway entrance is?","Where is the subway entrance?","Where does the subway entrance is?"],hint:"Direct question: question word + verb + subject."},
 {q:"Choose the correct polite question.",a:"Could you tell me where the subway entrance is?",o:["Could you tell me where is the subway entrance?","Could you tell me where the subway entrance is?","Could tell you me where the subway entrance is?"],hint:"After 'Could you tell me', use statement order."},
 {q:"Which is correct?",a:"Do you know which train I need?",o:["Do you know which train do I need?","Do you know which train I need?","Do you know which do I need train?"],hint:"An embedded question returns to statement order."},
 {q:"Turn the direct question 'How long does it take?' into a polite one.",a:"Could you tell me how long it takes?",o:["Could you tell me how long does it take?","Could you tell me how long it takes?","Could you tell how long takes it?"],hint:"No do/does inside the indirect part."}
];

const modalQuiz=[
 {q:"You want a normal everyday request. Which is best?",a:"Can you show me on the map?",o:["Can you show me on the map?","May you show me on the map?","Should you show me on the map?"],hint:"CAN is normal for everyday requests."},
 {q:"You want to soften the request slightly.",a:"Could you show me on the map?",o:["Could you show me on the map?","Should you show me on the map?","May you show me on the map?"],hint:"COULD often makes a request softer."},
 {q:"You want advice about the best route.",a:"Should I take the local or the express?",o:["May I take the local or the express?","Should I take the local or the express?","Could I advice the local or the express?"],hint:"SHOULD asks for advice / recommendation."},
 {q:"Which sentence asks formal permission?",a:"May I leave my bag here?",o:["May I leave my bag here?","Should I leave my bag here?","Could I advice my bag here?"],hint:"MAY I…? is a more formal way to ask permission."},
 {q:"Which form is grammatically correct?",a:"Could you help me?",o:["Could you to help me?","Could you help me?","Could you helped me?"],hint:"Modal + base verb."}
];

const tenseQuiz=[
 {q:"You want to know if this is a normal stop on the route.",a:"Does this train stop at 42nd Street?",o:["Does this train stop at 42nd Street?","Is this train stop at 42nd Street?","Did this train stops at 42nd Street?"],hint:"Routine/fact: DOES + subject + base verb."},
 {q:"You are on the train right now and want to check the direction.",a:"Is this train going uptown?",o:["Does this train going uptown?","Is this train going uptown?","Did this train going uptown?"],hint:"Happening now: IS + -ING."},
 {q:"You think you passed your stop a few minutes ago.",a:"Did we miss our stop?",o:["Did we miss our stop?","Do we missed our stop?","Have we miss our stop?"],hint:"Past event: DID + base verb."},
 {q:"You want to know about a future bus stop.",a:"Will this bus stop near Grand Central?",o:["Does this bus will stop near Grand Central?","Will this bus stop near Grand Central?","Will this bus stops near Grand Central?"],hint:"Future: WILL + base verb."},
 {q:"You are unsure whether the train has already passed 42nd Street.",a:"Have we passed 42nd Street?",o:["Have we passed 42nd Street?","Did we passed 42nd Street?","Have we pass 42nd Street?"],hint:"Present perfect: HAVE + past participle."}
];

const directionsQuiz=[
 {q:"How many blocks?",a:"two",o:["one","two","three"],hint:"Listen to the first instruction."},
 {q:"Which street do you turn onto?",a:"44th Street",o:["42nd Street","43rd Street","44th Street"],hint:"Listen to the second instruction."},
 {q:"Where is the theatre?",a:"On the left, across from the hotel",o:["On the right, next to the bank","On the left, across from the hotel","Behind the subway station"],hint:"Listen to the final location."}
];

const recapQuiz=[
 {q:"Which grammar builds a basic direction?",a:"Base verb / imperative",o:["Past simple","Base verb / imperative","Present perfect"],hint:"Go, turn, take, cross…"},
 {q:"Which preposition normally goes with a street?",a:"on",o:["at","on","in"],hint:"___ Fifth Avenue."},
 {q:"After 'Could you tell me…', what happens to the question order?",a:"It becomes statement order",o:["It becomes statement order","It uses two auxiliaries","The verb always goes first"],hint:"Could you tell me where the station is?"},
 {q:"Which modal asks for advice?",a:"should",o:["may","should","can"],hint:"What is the best choice?"},
 {q:"Which helper builds a past simple question?",a:"did",o:["did","will","does"],hint:"___ we miss our stop?"}
];

const transportTasks=[
 {title:"Subway: hotel → museum",q:"You need a fast route. Which question is most useful?",a:"Could you tell me which subway line I need?",o:["Could you tell me which subway line I need?","May the subway museum?","How subway is museum?"],hint:"Ask for the line you need."},
 {title:"Bus: tired after walking",q:"You want to know about a future stop. Choose the best question.",a:"Will this bus stop near Grand Central?",o:["Will this bus stop near Grand Central?","Does this bus stopped Grand Central?","May this bus Grand Central?"],hint:"Future = WILL + base verb."},
 {title:"Taxi: Broadway theatre",q:"Which is a natural way to give the destination?",a:"Could you take me to 225 West 44th Street, please?",o:["Could you take me to 225 West 44th Street, please?","Take Broadway now.","May you drive theatre?"],hint:"Give a clear destination + polite request."},
 {title:"Walking: Fifth Avenue",q:"You are not sure whether it is far. What do you ask?",a:"Is it within walking distance?",o:["Is it within walking distance?","Is it walking in distance?","Does distance walk?"],hint:"This is a very useful fixed expression."}
];

const conversations=[
 {name:"Street",icon:"🧭",grammar:"Imperatives + place words",lines:[
   ["You","Excuse me, could you tell me how to get to Grand Central from here?"],
   ["Local","Sure. Go straight for two blocks, then turn left on 42nd Street. It’ll be on your right."],
   ["You","So I go straight for two blocks and turn left on 42nd, right?"],
   ["Local","Exactly."]
 ],task:"Repeat the route in your own words and ask one checking question.",everyday:"Okay, so I go straight for two blocks, turn left on 42nd Street, and it’s on my right. Is that correct?",polished:"Just to make sure I understood: I continue straight for two blocks, turn left on 42nd Street, and Grand Central will be on my right. Is that correct?"},
 {name:"Subway",icon:"🚇",grammar:"Indirect questions + should",lines:[
   ["You","Could you tell me which train I need for Central Park?"],
   ["Staff","You can take the C uptown. Get off at 81st Street."],
   ["You","Should I take the local or the express?"],
   ["Staff","Take the local. The express won’t stop there."]
 ],task:"Ask which train to take, then ask for advice about local vs. express.",everyday:"Could you tell me which train I need for Central Park? And should I take the local or the express?",polished:"Could you tell me which train would be best for Central Park? Also, should I take a local train, or would the express stop there?"},
 {name:"Bus",icon:"🚌",grammar:"Future questions + confirmation",lines:[
   ["You","Will this bus stop near Grand Central?"],
   ["Driver","Yes. Get off at Madison Avenue and 42nd Street."],
   ["You","Did you say Madison and 42nd?"],
   ["Driver","That’s right."]
 ],task:"Check the future stop, then confirm the intersection.",everyday:"Will this bus stop near Grand Central? Great. Did you say Madison Avenue and 42nd Street?",polished:"Will this bus stop close to Grand Central? Thank you. Just to confirm, I should get off at Madison Avenue and 42nd Street, correct?"},
 {name:"Taxi",icon:"🚕",grammar:"Could + addresses + checking",lines:[
   ["You","Hi, could you take me to 225 West 44th Street, please?"],
   ["Driver","Sure. Near Eighth Avenue?"],
   ["You","Yes, that’s right. About how long will it take?"],
   ["Driver","Around fifteen minutes, depending on traffic."]
 ],task:"Give the address, confirm the location and ask about travel time.",everyday:"Hi, could you take me to 225 West 44th Street, please? Yes, near Eighth Avenue. About how long will it take?",polished:"Hello, could you take me to 225 West 44th Street, please? Yes, that’s the one near Eighth Avenue. Could you tell me roughly how long the journey will take?"}
];

function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function speak(text,rate){
 if(!("speechSynthesis" in window)){alert("Audio is not supported in this browser.");return}
 speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);u.lang="en-US";u.rate=rate||parseFloat($("#speedSelect").value);
 const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang==="en-US")||voices.find(v=>v.lang.startsWith("en"))||null;
 speechSynthesis.speak(u);
}
function bindSpeak(root=document){$$(".speak",root).forEach(b=>b.onclick=()=>speak(b.dataset.text))}
function hintText(x){return x.hint||"Look at the grammar rule immediately above this exercise."}
function makeQuiz(data,root,stateObj,prefix){
 $(root).innerHTML=data.map((x,i)=>`<article class="quiz-card"><p><b>${i+1}.</b> ${x.q}</p><div class="options">${shuffle(x.o).map(o=>`<button class="option" data-i="${i}" data-v="${encodeURIComponent(o)}">${o}</button>`).join("")}</div><button class="hint-btn practice-support quiz-hint" data-i="${i}">Hint</button><div class="hint hidden" id="${prefix}h${i}">${hintText(x)}</div><div class="feedback" id="${prefix}${i}"></div></article>`).join("");
 $$(`${root} .option`).forEach(b=>b.onclick=()=>{
   const i=+b.dataset.i,v=decodeURIComponent(b.dataset.v),ok=v===data[i].a;stateObj[i]=ok;
   const card=b.closest(".quiz-card");$$(".option",card).forEach(x=>{x.disabled=true;if(decodeURIComponent(x.dataset.v)===data[i].a)x.classList.add("correct")});if(!ok)b.classList.add("wrong");
   $("#"+prefix+i).textContent=ok?"✓ Correct.":"Not quite. The correct answer is highlighted.";$("#"+prefix+i).className="feedback "+(ok?"good":"bad");
   updateAll();
 });
 $$(`${root} .quiz-hint`).forEach(b=>b.onclick=()=>$("#"+prefix+"h"+b.dataset.i).classList.toggle("hidden"));
}
function renderTransport(){
 $("#transportChoice").innerHTML=transportTasks.map((x,i)=>`<article class="transport-task"><p class="micro">${x.title}</p><p><b>${x.q}</b></p><div class="options">${shuffle(x.o).map(o=>`<button class="option topt" data-i="${i}" data-v="${encodeURIComponent(o)}">${o}</button>`).join("")}</div><button class="hint-btn practice-support thint" data-i="${i}">Hint</button><div class="hint hidden" id="th${i}">${x.hint}</div><div class="feedback" id="tf${i}"></div></article>`).join("");
 $$(".thint").forEach(b=>b.onclick=()=>$("#th"+b.dataset.i).classList.toggle("hidden"));
 $$(".topt").forEach(b=>b.onclick=()=>{
   const i=+b.dataset.i,v=decodeURIComponent(b.dataset.v),ok=v===transportTasks[i].a;state.transport[i]=ok;
   const card=b.closest(".transport-task");$$(".topt",card).forEach(x=>{x.disabled=true;if(decodeURIComponent(x.dataset.v)===transportTasks[i].a)x.classList.add("correct")});if(!ok)b.classList.add("wrong");
   $("#tf"+i).textContent=ok?"✓ Exactly.":"Not quite. The best travel question is highlighted.";$("#tf"+i).className="feedback "+(ok?"good":"bad");updateAll();
 });
}
function renderConversations(){
 $("#conversationTabs").innerHTML=conversations.map((c,i)=>`<button class="conversation-tab ${i===state.conversation?"active":""}" data-i="${i}">${c.icon} ${c.name}</button>`).join("");
 const c=conversations[state.conversation];
 $("#conversationStage").innerHTML=`<div class="conversation-stage"><div class="grammar-badge">Grammar reused: ${c.grammar}</div>${c.lines.map(x=>`<div class="dialogue-line"><b>${x[0]}</b><p>${x[1]}</p></div>`).join("")}<div class="dialogue-actions"><button class="primary cplay">▶ Natural audio</button><button class="secondary cslow">▶ Clear audio</button></div><div class="speak-task"><h3>Your turn</h3><p>${c.task}</p><textarea rows="5" class="conversation-answer"></textarea><details class="model practice-support"><summary>Model · Everyday natural</summary><p>${c.everyday}</p></details><details class="model practice-support"><summary>Model · Polished but usable</summary><p>${c.polished}</p></details></div></div>`;
 const full=c.lines.map(x=>x[1]).join(" ");
 $(".cplay").onclick=()=>speak(full,.92);$(".cslow").onclick=()=>speak(full,.76);
 $$(".conversation-tab").forEach(b=>b.onclick=()=>{state.conversation=+b.dataset.i;renderConversations()});
}
function checkBridge(){
 const b=$("#bridgeBlocks").value.trim().toLowerCase(),a=$("#bridgeAvenue").value.trim().toLowerCase(),p=$("#bridgePlace").value.trim().toLowerCase();
 const okB=/2|two/.test(b),okA=/6|sixth/.test(a),okP=/across|opposite|bank/.test(p);
 state.bridge=okB&&okA&&okP;
 $("#bridgeFeedback").textContent=state.bridge?"✓ Perfect. You extracted all three pieces of information.":"Almost. Check the number of blocks, the avenue and the final position.";
 $("#bridgeFeedback").className="feedback "+(state.bridge?"good":"bad");updateAll();
}
function correct(obj){return Object.values(obj).filter(Boolean).length}
function status(done,corr,total){if(done===0)return"Pas commencé";if(done<total)return"En cours";return corr/total>=.7?"Acquis":"À renforcer"}
function percent(c,t){return t?Math.round(c/t*100):0}
function autoRows(){
 return [
  {name:"Warm-up",scope:"Read useful transport/location information",obj:state.warm,total:3},
  {name:"Grammar 1 · Imperatives",scope:"Give clear directions",obj:state.imperative,total:4},
  {name:"Grammar 2 · Place words",scope:"AT / ON / IN + relationships",obj:state.prep,total:5},
  {name:"Grammar 3 · Question order",scope:"Direct vs indirect questions",obj:state.indirect,total:4},
  {name:"Grammar 4 · Modals",scope:"Can / could / should / may",obj:state.modal,total:5},
  {name:"Grammar 5 · Tense questions",scope:"Present / now / past / perfect / future",obj:state.tense,total:5},
  {name:"Transport application",scope:"Subway / bus / taxi / walking",obj:state.transport,total:4},
  {name:"Three-step listening",scope:"Understand walking directions",obj:state.directions,total:3},
  {name:"Grammar recap",scope:"Name and reuse today’s rules",obj:state.recap,total:5},
  {name:"Certification bridge",scope:"Extract and reformulate directions",obj:state.bridge?{x:true}:{},total:1}
 ].map(r=>({...r,done:Object.keys(r.obj).length,corr:correct(r.obj)}));
}
function manualStatus(i){
 const cards=$$("#manualGrid article");if(!cards[i])return"Pas commencé";
 return $(".manual-observed",cards[i]).checked?$(".manual-status",cards[i]).value:"Pas commencé";
}
function renderAdmin(){
 const rows=autoRows();
 $("#autoTable").innerHTML=rows.map(r=>{const st=status(r.done,r.corr,r.total),cls=st==="Acquis"?"status-good":st==="À renforcer"?"status-bad":st==="En cours"?"status-progress":"status-none";return`<tr><td>${r.name}</td><td>${r.scope}</td><td>${r.corr}/${r.total}</td><td>${percent(r.corr,r.total)}%</td><td><span class="status-pill ${cls}">${st}</span></td></tr>`}).join("");
 const objectives=[
  ["Give simple walking directions","Imperative exercises + oral route","Auto + trainer observation",status(Object.keys(state.imperative).length,correct(state.imperative),4)],
  ["Use place prepositions correctly","AT / ON / IN + map work","Auto QCM",status(Object.keys(state.prep).length,correct(state.prep),5)],
  ["Ask direct and polite indirect questions","Question-order exercises + conversations","Auto + oral observation",status(Object.keys(state.indirect).length,correct(state.indirect),4)],
  ["Choose can/could/should/may appropriately","Modal grammar exercises","Auto QCM",status(Object.keys(state.modal).length,correct(state.modal),5)],
  ["Build questions across time","Tense question exercises","Auto QCM",status(Object.keys(state.tense).length,correct(state.tense),5)],
  ["Navigate realistic NYC situations","Transport choices + conversations","Auto + trainer observation",status(Object.keys(state.transport).length,correct(state.transport),4)],
  ["Complete one gentle certification transfer","Directions bridge","Auto extraction + oral observation",state.bridge?"Acquis":manualStatus(2)]
 ];
 $("#objectiveTable").innerHTML=objectives.map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td><td>${x[3]}</td></tr>`).join("");
 if(!$("#adminContent").value)$("#adminContent").value="New York orientation warm-up; imperatives for directions; AT/ON/IN and location prepositions; direct and polite indirect question formation; can/could/should/may; question formation across present, present continuous, past, present perfect and future; realistic subway/bus/taxi/walking vocabulary; four guided role-plays; three-step listening; giving directions; grammar recap; one short certification bridge.";
 if(!$("#adminCompetencies").value)$("#adminCompetencies").value="Give and understand simple directions; locate places accurately; ask for information using correct question order; adapt modal verbs to function and politeness; form questions across several common tenses; clarify and confirm information; interact in realistic travel situations.";
 if(!$("#adminMethods").value)$("#adminMethods").value="Immediate-feedback QCM; guided grammar practice; visual map work; listening comprehension; realistic role-play; trainer observation; recap quiz; one short certification-style transfer task.";
 $("#centrePreview").textContent=buildCentreSummary();
}
function buildCentreSummary(){
 const rows=autoRows();
 return `N° de séance : ${$("#sessionNumber").value||"—"}
Durée du cours : ${$("#sessionDuration").value||"—"}
Heures restantes : ${$("#hoursRemaining").value||"—"}
Date : ${$("#lessonDate").value||"—"}

OBJECTIFS DE LA SÉANCE
Donner et comprendre des indications simples ; utiliser correctement AT/ON/IN et les prépositions de lieu ; construire des questions directes et indirectes ; employer can/could/should/may selon la fonction ; construire des questions dans plusieurs temps ; se déplacer dans des situations réalistes à New York ; transférer les acquis dans une courte tâche de certification.

CONTENU / ACTIVITÉS
${$("#adminContent").value}

COMPÉTENCES TRAVAILLÉES
${$("#adminCompetencies").value}

MODES D’ÉVALUATION
${$("#adminMethods").value}

RÉSULTATS AUTOMATIQUES
${rows.map(r=>`- ${r.name} : ${r.corr}/${r.total} (${percent(r.corr,r.total)}%) — ${status(r.done,r.corr,r.total)}`).join("\n")}

ÉVALUATIONS MANUELLES
- Oral / directions : ${manualStatus(0)}${$(".manual-note",$$("#manualGrid article")[0]).value?" — "+$(".manual-note",$$("#manualGrid article")[0]).value:""}
- Transfert grammatical : ${manualStatus(1)}${$(".manual-note",$$("#manualGrid article")[1]).value?" — "+$(".manual-note",$$("#manualGrid article")[1]).value:""}
- Passerelle certification : ${manualStatus(2)}${$(".manual-note",$$("#manualGrid article")[2]).value?" — "+$(".manual-note",$$("#manualGrid article")[2]).value:""}

NIVEAU D’ACQUISITION GLOBAL
${$("#overallLevel").value}

OBSERVATIONS
${$("#adminObservations").value||"—"}`;
}
function saveAdmin(){
 const ids=["sessionNumber","sessionDuration","hoursRemaining","lessonDate","adminContent","adminCompetencies","adminMethods","adminObservations","overallLevel","learnedToday","nextPractice"];
 const d={};ids.forEach(id=>d[id]=$("#"+id).value);localStorage.setItem("veronique_getting_around_admin",JSON.stringify(d));
}
function restoreAdmin(){
 try{const d=JSON.parse(localStorage.getItem("veronique_getting_around_admin")||"{}");Object.entries(d).forEach(([k,v])=>{if($("#"+k))$("#"+k).value=v})}catch(e){}
}
function updateAll(){
 const sets=[state.warm,state.imperative,state.prep,state.indirect,state.modal,state.tense,state.transport,state.directions,state.recap];
 const done=sets.reduce((n,o)=>n+Object.keys(o).length,0)+(state.bridge?1:0);
 const total=3+4+5+4+5+5+4+3+5+1;
 const p=Math.round(done/total*100);$("#progressBar").style.width=p+"%";$("#progressText").textContent=p+"% complete";renderAdmin();saveAdmin();
}
function localDate(){const d=new Date(),p=n=>String(n).padStart(2,"0");return`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`}
function download(name,text,type="text/plain"){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function reportHTML(){return`<!doctype html><html><head><meta charset="utf-8"><title>Training report</title><style>body{font-family:Arial;max-width:900px;margin:35px auto;line-height:1.5}h1{color:#9f1d2b}pre{white-space:pre-wrap;background:#f5f2eb;padding:18px;border-radius:12px}</style></head><body><h1>New York Real Talk · Getting Around</h1><pre>${buildCentreSummary().replaceAll("<","&lt;")}</pre></body></html>`}
function init(){
 $("#jsWarning").style.display="none";bindSpeak();
 $$("[data-scroll]").forEach(b=>b.onclick=()=>$(b.dataset.scroll).scrollIntoView({behavior:"smooth"}));
 $("#modeSelect").onchange=e=>document.body.classList.toggle("challenge-mode",e.target.value==="challenge");
 $("#resetBtn").onclick=()=>{if(confirm("Reset lesson progress and trainer fields?")){localStorage.removeItem("veronique_getting_around_admin");location.reload()}};
 $$("[data-hint]").forEach(b=>b.onclick=()=>$("#"+b.dataset.hint).classList.toggle("hidden"));
 makeQuiz(warmQuiz,"#warmQuiz",state.warm,"w");
 makeQuiz(imperativeQuiz,"#imperativeQuiz",state.imperative,"i");
 makeQuiz(prepQuiz,"#prepositionQuiz",state.prep,"p");
 makeQuiz(indirectQuiz,"#indirectQuiz",state.indirect,"q");
 makeQuiz(modalQuiz,"#modalQuiz",state.modal,"m");
 makeQuiz(tenseQuiz,"#tenseQuiz",state.tense,"t");
 makeQuiz(directionsQuiz,"#directionsQuiz",state.directions,"d");
 makeQuiz(recapQuiz,"#recapQuiz",state.recap,"r");
 renderTransport();renderConversations();
 $("#directionsAudio").onclick=()=>speak("Go straight for two blocks. Turn right on Forty-fourth Street. The theatre is on your left, across from the hotel.");
 $("#directionsTranscriptBtn").onclick=()=>{const t=$("#directionsTranscript");t.classList.toggle("hidden");$("#directionsTranscriptBtn").textContent=t.classList.contains("hidden")?"Show transcript":"Hide transcript"};
 $("#bridgeAudio").onclick=()=>speak("Walk two blocks along Forty-fifth Street, turn left on Sixth Avenue, and the entrance is across from the bank.");
 $("#bridgeTranscriptBtn").onclick=()=>{const t=$("#bridgeTranscript");t.classList.toggle("hidden");$("#bridgeTranscriptBtn").textContent=t.classList.contains("hidden")?"Show transcript":"Hide transcript"};
 $("#bridgeCheck").onclick=checkBridge;
 $("#refreshAdmin").onclick=renderAdmin;
 $("#copyCentre").onclick=async()=>{const txt=buildCentreSummary();$("#centrePreview").textContent=txt;try{await navigator.clipboard.writeText(txt);$("#copyFeedback").textContent="✓ Centre summary copied.";$("#copyFeedback").className="feedback good"}catch(e){$("#copyFeedback").textContent="Select the preview and copy it manually.";$("#copyFeedback").className="feedback bad"}};
 $("#downloadReport").onclick=()=>download("Veronique_Getting_Around_Training_Report.html",reportHTML(),"text/html");
 $("#printBtn").onclick=()=>window.print();
 ["sessionNumber","sessionDuration","hoursRemaining","lessonDate","adminContent","adminCompetencies","adminMethods","adminObservations","overallLevel","learnedToday","nextPractice"].forEach(id=>$("#"+id).addEventListener("input",()=>{renderAdmin();saveAdmin()}));
 $$(".manual-observed,.manual-status,.manual-note").forEach(x=>x.addEventListener("input",renderAdmin));
 if(!$("#lessonDate").value)$("#lessonDate").value=localDate();restoreAdmin();if(!$("#lessonDate").value)$("#lessonDate").value=localDate();
 renderAdmin();updateAll();
}
document.addEventListener("DOMContentLoaded",init);