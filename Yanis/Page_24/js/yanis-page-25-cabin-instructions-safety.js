(() => {
"use strict";
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const state = {
  mode:"practice", voice:"en-GB", score:{}, max:{}, vocabCategory:"All",
  selectedOrder:[], listeningIndex:0, mediaRecorder:null, chunks:[], recordingUrl:null
};
const STORE="yanis-page25-safety-v1";

const quizGroups = {
  warmup:{label:"Warm-up · clear instruction",type:"QCM",items:[
    {q:"A bag is blocking the aisle. Which instruction is clearest?",fr:"Un bagage bloque l’allée. Quelle consigne est la plus claire ?",a:"Please place your bag under the seat.",opts:["Your bag, it is maybe necessary for you to do something with it.","Please place your bag under the seat.","The aisle has a bag and there is a situation.","Could your bag under the seat?"]},
    {q:"A passenger is standing during turbulence. Which sentence gives one clear action?",a:"Please return to your seat and fasten your seat belt.",opts:["Please return to your seat and fasten your seat belt.","The turbulence situation means perhaps sitting would be better.","You are standing, yes?","Because turbulence and seat belt and safety."]}
  ]},
  form:{label:"Grammar · correct form",type:"QCM",items:[
    {q:"Choose the correct negative imperative.",a:"Do not open the overhead locker.",opts:["Do not to open the overhead locker.","Do not open the overhead locker.","Not open the overhead locker.","Don’t opens the overhead locker."]},
    {q:"Choose the correct polite request.",a:"Could you fasten your seat belt, please?",opts:["Could you to fasten your seat belt, please?","Could you fastened your seat belt, please?","Could you fasten your seat belt, please?","Could you fastens your seat belt, please?"]},
    {q:"Choose the correct obligation form.",a:"You must remain seated.",opts:["You must to remain seated.","You must remaining seated.","You must remain seated.","You must remains seated."]},
    {q:"Choose the correct form with have to.",a:"You have to switch your phone to flight mode.",opts:["You have switch your phone to flight mode.","You have to switch your phone to flight mode.","You have to switching your phone to flight mode.","You has to switch your phone to flight mode."]},
    {q:"Choose the correct form with need to.",a:"You need to keep the exit clear.",opts:["You need keep the exit clear.","You need to keeping the exit clear.","You need to keep the exit clear.","You needs to keep the exit clear."]},
    {q:"Which sentence is the strongest professional instruction?",a:"Please keep your seat belt fastened until the sign is off.",opts:["Seat belt, yes, until sign off.","Please keep your seat belt fastened until the sign is off.","You maybe keep seat belt.","Please you to keep your seat belt."]}
  ]},
  meaning:{label:"Grammar · prohibition vs optional",type:"QCM",items:[
    {q:"Smoking is prohibited on board.",a:"You mustn’t smoke on board.",opts:["You don’t have to smoke on board.","You mustn’t smoke on board.","You needn’t smoking on board.","You mustn’t to smoke on board."]},
    {q:"Removing your shoes is not necessary.",a:"You don’t have to remove your shoes.",opts:["You mustn’t remove your shoes.","You don’t have to remove your shoes.","You must not to remove your shoes.","You don’t have remove your shoes."]},
    {q:"The exit must stay clear. Which sentence means ‘prohibited’?",a:"You mustn’t leave your bag in front of the exit.",opts:["You don’t have to leave your bag in front of the exit.","You mustn’t leave your bag in front of the exit.","You mustn’t to leave your bag in front of the exit.","You no have to leave your bag."]},
    {q:"You may keep your jacket on. Removing it is optional.",a:"You don’t have to remove your jacket.",opts:["You mustn’t remove your jacket.","You don’t have to remove your jacket.","You don’t have to removing your jacket.","You must remove your jacket."]},
    {q:"Electronic cigarettes are not allowed.",a:"You mustn’t use an electronic cigarette.",opts:["You don’t have to use an electronic cigarette.","You mustn’t use an electronic cigarette.","You mustn’t to use an electronic cigarette.","You not have to use an electronic cigarette."]}
  ]},
  error:{label:"Grammar · error clinic",type:"QCM",items:[
    {q:"Which sentence is correct?",a:"Could you place your bag under the seat?",opts:["Could you to place your bag under the seat?","Could you places your bag under the seat?","Could you place your bag under the seat?","Could you placing your bag under the seat?"]},
    {q:"Which sentence is correct?",a:"Please remain seated until the sign is switched off.",opts:["Please remaining seated until the sign is switched off.","Please to remain seated until the sign is switched off.","Please remain seated until the sign is switched off.","Please remains seated until the sign is switched off."]},
    {q:"Which sentence correctly expresses a prohibition?",a:"You mustn’t block the aisle.",opts:["You don’t have to block the aisle.","You mustn’t to block the aisle.","You mustn’t block the aisle.","You must not blocking the aisle."]},
    {q:"Which sentence has the correct sequence punctuation?",a:"First, fasten your seat belt. Then, check the tray table.",opts:["First fasten, your seat belt. Then check, the tray table.","First, fasten your seat belt. Then, check the tray table.","First fasten your seat belt then, check the tray table.","First, to fasten your seat belt."]},
    {q:"Which sentence is professional and concise?",a:"For safety reasons, please keep the aisle clear.",opts:["You are making a problem in the aisle.","For safety reasons, please keep the aisle clear.","It would be a thing that maybe the aisle should be clear.","Aisle clear because safety thing."]}
  ]},
  scenario:{label:"Professional application · cabin scenarios",type:"QCM",items:[
    {q:"A passenger wants to stand while the seat belt sign is on.",a:"For safety reasons, please remain seated with your seat belt fastened.",opts:["Sit down now.","For safety reasons, please remain seated with your seat belt fastened.","You don’t have to stand.","Maybe you can sit if you want."]},
    {q:"A cabin bag is in front of an emergency exit.",a:"This exit must remain clear. Please move your bag now.",opts:["This exit must remain clear. Please move your bag now.","Your bag is not very good here.","You don’t have to leave your bag here.","Maybe the bag can move."]},
    {q:"A passenger tries to open a locker during turbulence.",a:"Please keep the locker closed until the turbulence has passed.",opts:["Don’t that.","Please keep the locker closed until the turbulence has passed.","You don’t have to open.","Locker closed perhaps."]},
    {q:"A passenger is using a laptop during final approach.",a:"Please stow your laptop now and keep it away until after landing.",opts:["Laptop no.","Please stow your laptop now and keep it away until after landing.","You mustn’t have a laptop.","You don’t have to laptop now."]},
    {q:"A passenger asks if they must remove a light jacket.",a:"You don’t have to remove your jacket.",opts:["You mustn’t remove your jacket.","You don’t have to remove your jacket.","You needn’t to remove jacket.","You have not to remove your jacket."]},
    {q:"A passenger’s tray table is down before take-off.",a:"Could you fold your tray table away, please?",opts:["Could you fold your tray table away, please?","You must to fold your tray.","Tray table needs folded.","Could you to fold it?"]}
  ]},
  reading:{label:"Reading comprehension · procedure",type:"Reading",items:[
    {q:"What should passengers do during light turbulence?",a:"Remain seated when possible and keep seat belts fastened.",opts:["Stand in the aisle.","Remain seated when possible and keep seat belts fastened.","Open the overhead lockers.","Remove all shoes."]},
    {q:"What must remain clear?",a:"The aisle and exits.",opts:["The windows.","The galley only.","The aisle and exits.","Every seat pocket."]},
    {q:"What should you do if a passenger needs assistance?",a:"Assess the situation and inform the cabin supervisor when necessary.",opts:["Ignore the passenger.","Ask another passenger to decide.","Assess the situation and inform the cabin supervisor when necessary.","Open an exit."]},
    {q:"Which sentence best summarizes the procedure?",a:"Keep passengers seated, secure bags, keep access clear and escalate when necessary.",opts:["Continue normal service at all times.","Keep passengers seated, secure bags, keep access clear and escalate when necessary.","Ask all passengers to stand.","Move every bag into the aisle."]}
  ]}
};

const conjugationItems = [
  {prompt:"He ___ keep the exit clear. (have to)",answer:"has to",hint:"he + have to → has to"},
  {prompt:"They ___ remain seated. (must)",answer:"must",hint:"must never changes"},
  {prompt:"She ___ move the bag. (need to)",answer:"needs to",hint:"she + need → needs"},
  {prompt:"You ___ open the door. (must not)",answer:"must not",alts:["mustn't"],hint:"prohibition = must not / mustn’t"},
  {prompt:"The passenger ___ remove the jacket. It is optional. (not have to)",answer:"doesn't have to",alts:["does not have to"],hint:"he/she/passenger → doesn’t have to"},
  {prompt:"We ___ check the cabin before departure. (have to)",answer:"have to",hint:"we + have to"},
  {prompt:"She ___ use her phone during the safety demonstration. (must not)",answer:"must not",alts:["mustn't"],hint:"must + not + base verb"},
  {prompt:"They ___ fasten their seat belts now. (need to)",answer:"need to",hint:"they + need to"}
];

const vocabulary = [
  {cat:"Seat & position",icon:"🔒",en:"fasten",fr:"attacher",def:"to close and secure something",ex:"Please fasten your seat belt."},
  {cat:"Seat & position",icon:"🪑",en:"remain seated",fr:"rester assis",def:"to stay in your seat",ex:"Please remain seated until the sign is off."},
  {cat:"Seat & position",icon:"↗️",en:"recline",fr:"incliner",def:"to move a seat back",ex:"Please return your seat to the upright position."},
  {cat:"Seat & position",icon:"⬆️",en:"upright",fr:"en position verticale",def:"straight, not reclined",ex:"Your seat must be in the upright position."},
  {cat:"Baggage",icon:"🧳",en:"stow",fr:"ranger / arrimer",def:"to put something safely away",ex:"Please stow your bag in the overhead locker."},
  {cat:"Baggage",icon:"🗄️",en:"overhead locker",fr:"coffre à bagages",def:"storage space above passenger seats",ex:"The overhead locker must close completely."},
  {cat:"Baggage",icon:"⬇️",en:"under the seat",fr:"sous le siège",def:"the storage area below the seat in front",ex:"Place your small bag under the seat."},
  {cat:"Baggage",icon:"🚫",en:"keep clear",fr:"laisser dégagé",def:"to prevent an area from being blocked",ex:"You must keep the aisle clear."},
  {cat:"Cabin safety",icon:"🚪",en:"exit",fr:"issue / sortie",def:"a door or route used to leave the aircraft",ex:"Do not block the emergency exit."},
  {cat:"Cabin safety",icon:"↔️",en:"aisle",fr:"allée",def:"the passage between rows of seats",ex:"Please keep the aisle clear."},
  {cat:"Cabin safety",icon:"💡",en:"seat belt sign",fr:"voyant ceinture",def:"the illuminated sign requiring seat belts",ex:"The seat belt sign is still on."},
  {cat:"Cabin safety",icon:"🌬️",en:"turbulence",fr:"turbulences",def:"unstable air causing aircraft movement",ex:"We are experiencing some turbulence."},
  {cat:"Cabin safety",icon:"📱",en:"flight mode",fr:"mode avion",def:"a device setting that disables wireless transmission",ex:"Switch your phone to flight mode."},
  {cat:"Service actions",icon:"📥",en:"fold away",fr:"replier / ranger",def:"to close and store a folding object",ex:"Please fold your tray table away."},
  {cat:"Service actions",icon:"🛑",en:"suspend",fr:"suspendre",def:"to stop temporarily",ex:"We have to suspend the service."},
  {cat:"Service actions",icon:"✅",en:"confirm",fr:"confirmer",def:"to check or state that something is correct",ex:"Let me confirm that your seat belt is fastened."},
  {cat:"Service actions",icon:"🧭",en:"follow",fr:"suivre",def:"to do what an instruction says",ex:"Please follow the crew instructions."},
  {cat:"Service actions",icon:"🤝",en:"cooperate",fr:"coopérer",def:"to work with someone to achieve a safe result",ex:"Thank you for your cooperation."}
];

const listening = [
 {type:"BAGGAGE",title:"Exit row bag",context:"Listen for the safety problem and the immediate action.",text:"Excuse me. I was told I could keep my backpack by my feet, but I am sitting in an exit row. Is it okay if I leave it here until after take-off?",model:"Because you are seated in an exit row, the area must remain completely clear. Please place your backpack in the overhead locker for take-off. I can help you find a safe space for it.",questions:[
   {q:"What is the key safety issue?",a:"The exit row must remain clear.",opts:["The passenger wants a drink.","The exit row must remain clear.","The passenger lost a passport.","The overhead locker is broken."]},
   {q:"What should you ask the passenger to do?",a:"Place the backpack in the overhead locker.",opts:["Leave the backpack by their feet.","Place the backpack in the overhead locker.","Stand in the aisle.","Open the exit."]}
 ]},
 {type:"TURBULENCE",title:"Passenger wants the toilet",context:"Choose a response that is clear but calm.",text:"I really need to use the toilet. I know the seat belt sign is on, but can I go quickly? The aircraft is moving quite a lot.",model:"We are experiencing turbulence, so for your safety you need to remain seated with your seat belt fastened. Please wait until the seat belt sign is switched off. I will let you know when it is safe to stand.",questions:[
   {q:"What is happening?",a:"The aircraft is experiencing turbulence.",opts:["The aircraft is boarding.","The aircraft is experiencing turbulence.","The passenger is changing flights.","The service is finished."]},
   {q:"What is the correct immediate instruction?",a:"Remain seated with the seat belt fastened.",opts:["Go quickly to the toilet.","Remain seated with the seat belt fastened.","Stand near the galley.","Remove the seat belt."]}
 ]},
 {type:"DEVICE",title:"Laptop before landing",context:"Identify the prohibited action and give the next step.",text:"Do I really have to put my laptop away? I just need another two minutes to finish this email before we land.",model:"Yes. We are preparing for landing, so you have to stow your laptop now. Please keep it safely stored until after landing. Thank you for your cooperation.",questions:[
   {q:"What does the passenger want?",a:"Two more minutes to use the laptop.",opts:["A new laptop.","Two more minutes to use the laptop.","A seat change.","A meal."]},
   {q:"What action is required?",a:"Stow the laptop now.",opts:["Continue using it.","Stow the laptop now.","Put it in the aisle.","Give it to another passenger."]}
 ]},
 {type:"SEAT",title:"Reclined seat",context:"Give a short instruction suitable for final approach.",text:"The passenger in 22C still has the seat fully reclined and the tray table is down. We are starting final approach.",model:"Please return your seat to the upright position and fold your tray table away now. We are preparing for landing. Thank you.",questions:[
   {q:"Which two things need to change?",a:"The seat position and tray table.",opts:["The passenger’s shoes and jacket.","The seat position and tray table.","The overhead lights and window.","The meal and drink."]},
   {q:"Which instruction is best?",a:"Please return your seat upright and fold your tray table away.",opts:["Maybe sit different.","Please return your seat upright and fold your tray table away.","You don’t have to move anything.","Please to upright seat."]}
 ]}
];

const writingTasks = [
 {title:"1 · Passenger instruction",tag:"BAGGAGE",prompt:"A passenger has placed a medium suitcase in the aisle while looking for space. Write 3–4 professional sentences. Give the required action and explain why.",hint:"Try: Please + base verb / must remain clear / I can…",a2:"Please move your suitcase out of the aisle. The aisle must remain clear. I can help you find space in an overhead locker. Thank you.",b1:"For safety reasons, the aisle must remain clear during boarding. Please move your suitcase away from the aisle while I check the overhead lockers. I can help you store it safely. Thank you for your cooperation."},
 {title:"2 · Crew procedure note",tag:"TURBULENCE",prompt:"Write a short 4-step procedure for light turbulence. Use sequencing words and at least two obligation forms.",hint:"First / Then / Next / Finally + must / have to / need to",a2:"First, ask passengers to remain seated. Then, they must fasten their seat belts. Next, you have to check the aisle. Finally, suspend the service if necessary.",b1:"First, ask passengers to remain seated and keep their seat belts fastened. Then, you need to secure any loose service items. Next, check that the aisle and exits remain clear. Finally, inform the cabin supervisor if the turbulence becomes stronger."}
];

const oralMissions = [
 {title:"Exit-row baggage",prompt:"A passenger in an exit row has a backpack under the seat in front. Give a clear safety instruction, explain the rule and offer help.",a2:"This exit row must remain clear. Please place your backpack in the overhead locker. I can help you find space. Thank you.",b1:"For safety reasons, the exit row must remain completely clear for take-off. Please place your backpack in the overhead locker. I can help you find a safe space for it, and I’ll confirm when everything is secure. Thank you for your cooperation."},
 {title:"Turbulence",prompt:"The seat belt sign is on because of turbulence. A passenger wants to stand. Respond professionally and explain what happens next.",a2:"Please remain seated and keep your seat belt fastened. We are experiencing turbulence. You need to wait until the seat belt sign is off. I will let you know when it is safe.",b1:"We are experiencing turbulence, so for your safety you need to remain seated with your seat belt securely fastened. Please do not stand while the seat belt sign is on. I will let you know as soon as it is safe to move around the cabin."},
 {title:"Electronic device",prompt:"A passenger is still using a laptop during final approach. Give the instruction and a short reason.",a2:"Please stow your laptop now. We are preparing for landing. You have to keep it stored until after landing. Thank you.",b1:"We are now preparing for landing, so all larger electronic devices have to be stowed safely. Please put your laptop away now and keep it stored until after landing. Thank you for your cooperation."},
 {title:"Blocked aisle",prompt:"A passenger has left a bag in the aisle. Give one clear action, state the safety rule and offer a solution.",a2:"Please move your bag out of the aisle. The aisle must remain clear. You can place it under the seat. I can help you.",b1:"For safety reasons, the aisle must remain completely clear. Please move your bag now and place it under the seat in front of you if it fits. If not, I can help you find space in an overhead locker."}
];

const announcementData = {
 context:["Ladies and gentlemen, we are experiencing some turbulence.","Ladies and gentlemen, we are now preparing for landing.","For your safety, we need to pause the cabin service."],
 action:["Please remain seated and keep your seat belt fastened.","Please return your seat to the upright position and fold your tray table away.","Please keep the aisle clear and follow the crew instructions."],
 limit:["Do not stand in the aisle while the seat belt sign is on.","Please do not open the overhead lockers at this time.","Do not place any baggage in front of an exit."],
 next:["The cabin crew will continue the service when it is safe to do so.","We will let you know when you may move around the cabin again.","Thank you for your cooperation."]
};

function shuffle(arr){ return [...arr].sort(()=>Math.random()-.5); }
function norm(s){return String(s||"").trim().toLowerCase().replace(/[’']/g,"'").replace(/\s+/g," ");}
function speak(text,rate=.92){
  if(!("speechSynthesis" in window)) return alert("Speech synthesis is not available in this browser.");
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang=state.voice; u.rate=rate;
  const voices=speechSynthesis.getVoices();
  const wanted=voices.find(v=>v.lang===state.voice)||voices.find(v=>v.lang.startsWith(state.voice.slice(0,2)));
  if(wanted) u.voice=wanted;
  speechSynthesis.speak(u);
}
function setGroupMax(id,n){state.max[id]=n; if(!(id in state.score)) state.score[id]=0; updateScore();}
function mark(id,key,correct){
  const markKey=`${id}:${key}`;
  if(state.score[markKey]!==undefined) return;
  state.score[markKey]=correct?1:0;
  updateScore(); updateEvaluation();
}
function calcScore(){
  const earned=Object.entries(state.score).filter(([k])=>k.includes(":")).reduce((a,[,v])=>a+Number(v||0),0);
  const max=Object.values(state.max).reduce((a,v)=>a+Number(v||0),0);
  return {earned,max};
}
function updateScore(){
  const {earned,max}=calcScore();
  $("#score").textContent=earned; $("#maxScore").textContent=max;
  const attempts=Object.keys(state.score).filter(k=>k.includes(":")).length;
  $("#progressBar").style.width=max?`${Math.min(100,attempts/max*100)}%`:"0%";
}
function renderQuiz(groupId, target){
  const g=quizGroups[groupId], box=$(target); box.innerHTML=""; setGroupMax(groupId,g.items.length);
  g.items.forEach((item,i)=>{
    const card=document.createElement("article"); card.className="quiz-card";
    card.innerHTML=`<h4>${i+1}. ${item.q}</h4>${item.fr?`<p class="fr">${item.fr}</p>`:""}<div class="option-list"></div><button class="hint-btn supportOnly" type="button">💡 Hint</button><div class="feedback"></div>`;
    const list=card.querySelector(".option-list"), fb=card.querySelector(".feedback");
    shuffle(item.opts).forEach(opt=>{
      const b=document.createElement("button");b.type="button";b.className="option-btn";b.textContent=opt;
      b.addEventListener("click",()=>{
        const correct=opt===item.a;
        card.querySelectorAll(".option-btn").forEach(x=>{x.disabled=true;if(x.textContent===item.a)x.classList.add("correct")});
        if(!correct)b.classList.add("wrong");
        fb.textContent=correct?"✓ Correct.":"✗ Not quite. Compare with the green answer.";
        fb.className=`feedback ${correct?"good":"bad"}`; mark(groupId,i,correct);
      }); list.appendChild(b);
    });
    card.querySelector(".hint-btn").addEventListener("click",()=>{
      fb.textContent = item.a.includes("mustn’t")||item.a.includes("mustn't") ? "Hint: prohibited = mustn’t + base verb." :
        item.a.includes("don’t have to") ? "Hint: not necessary = don’t have to + base verb." :
        item.a.startsWith("Could you") ? "Hint: Could you + base verb…?" :
        item.a.startsWith("Please") ? "Hint: Please + base verb." : "Hint: look for the base verb after the modal.";
      fb.className="feedback";
    });
    box.appendChild(card);
  });
}
function renderConjugation(){
 const box=$("#conjugationGrid"); box.innerHTML=""; setGroupMax("conjugation",conjugationItems.length);
 conjugationItems.forEach((it,i)=>{
   const d=document.createElement("div");d.className="fill-card";
   d.innerHTML=`<p><strong>${i+1}.</strong> ${it.prompt}</p><span class="verb-hint supportOnly hidden">${it.hint}</span><input aria-label="Grammar answer ${i+1}" placeholder="Type the missing form…"><div class="fill-actions"><button class="btn check" type="button">Check</button><button class="hint-btn supportOnly hint" type="button">Hint</button></div><div class="feedback"></div>`;
   const input=d.querySelector("input"),fb=d.querySelector(".feedback");
   d.querySelector(".hint").onclick=()=>d.querySelector(".verb-hint").classList.toggle("hidden");
   d.querySelector(".check").onclick=()=>{
     const accepted=[it.answer,...(it.alts||[])].map(norm), ok=accepted.includes(norm(input.value));
     fb.textContent=ok?"✓ Correct.":`✗ Correct form: ${it.answer}`;
     fb.className=`feedback ${ok?"good":"bad"}`; input.disabled=true; d.querySelector(".check").disabled=true; mark("conjugation",i,ok);
   }; box.appendChild(d);
 });
}
function renderVocab(){
 const cats=["All",...new Set(vocabulary.map(v=>v.cat))], tabs=$("#vocabTabs");tabs.innerHTML="";
 cats.forEach(c=>{const b=document.createElement("button");b.textContent=c;b.className=c===state.vocabCategory?"active":"";b.onclick=()=>{state.vocabCategory=c;renderVocab()};tabs.appendChild(b)});
 const grid=$("#vocabGrid");grid.innerHTML="";
 vocabulary.filter(v=>state.vocabCategory==="All"||v.cat===state.vocabCategory).forEach(v=>{
   const b=document.createElement("button");b.type="button";b.className="vocab-card";
   b.innerHTML=`<div class="vocab-icon">${v.icon}</div><div class="vocab-word">${v.en}</div><div class="vocab-fr fr">${v.fr}</div>`;
   b.onclick=()=>openVocab(v);grid.appendChild(b);
 });
}
function openVocab(v){
 $("#modalIcon").textContent=v.icon;$("#modalWord").textContent=v.en;$("#modalFr").textContent=v.fr;$("#modalDef").textContent=v.def;$("#modalExample").textContent=v.ex;
 $("#vocabModal").classList.remove("hidden");$("#modalListen").onclick=()=>speak(`${v.en}. ${v.ex}`);
}
function renderOrder(){
 const steps=["First, check that the aisle and exits are clear.","Then, ask passengers to fasten their seat belts.","Next, ask passengers to return seats and tray tables to the correct position.","Finally, complete your cabin check and report when ready."];
 state.orderSteps=steps;
 const source=$("#takeoffOrderSource"),target=$("#takeoffOrderTarget");source.innerHTML="";target.innerHTML="<small>Selected steps will appear here.</small>";state.selectedOrder=[];
 shuffle(steps).forEach(s=>{
   const b=document.createElement("button");b.type="button";b.className="order-chip";b.textContent=s;b.onclick=()=>{state.selectedOrder.push(s);b.remove();renderTarget()};source.appendChild(b)
 });
 setGroupMax("order",1);
 function renderTarget(){target.innerHTML="";state.selectedOrder.forEach((s,i)=>{const d=document.createElement("div");d.className="order-chip";d.textContent=`${i+1}. ${s}`;target.appendChild(d)});if(!state.selectedOrder.length)target.innerHTML="<small>Selected steps will appear here.</small>"}
 $("#undoTakeoffOrder").onclick=()=>{if(!state.selectedOrder.length)return;const s=state.selectedOrder.pop();const b=document.createElement("button");b.type="button";b.className="order-chip";b.textContent=s;b.onclick=()=>{state.selectedOrder.push(s);b.remove();renderTarget()};source.appendChild(b);renderTarget()};
 $("#checkTakeoffOrder").onclick=()=>{const ok=JSON.stringify(state.selectedOrder)===JSON.stringify(steps);const fb=$("#takeoffOrderFeedback");fb.textContent=ok?"✓ Correct sequence. The procedure is clear and logical.":"✗ Not yet. Think: check cabin → passenger actions → final check.";fb.className=`feedback ${ok?"good":"bad"}`;mark("order",0,ok)};
 $("#hintTakeoffOrder").onclick=()=>{$("#takeoffOrderFeedback").textContent="Hint: start by checking access routes. Finish by reporting the cabin ready."};
}
function renderTurbulenceBuilder(){
 const sets=[
  ["Context",["We are experiencing some turbulence.","We are preparing for landing.","Boarding is almost complete."]],
  ["Action",["Please remain seated and keep your seat belt fastened.","Please open the overhead locker.","Please stand in the aisle."]],
  ["Rule",["You must keep the aisle clear.","You don’t have to fasten your seat belt.","You mustn’t remain seated."]],
  ["Next",["I will let you know when it is safe to stand.","Please stand immediately.","You don’t have to wait."]]
 ];
 const box=$("#turbulenceBuilder");box.innerHTML="";
 sets.forEach(([lab,opts],idx)=>{const d=document.createElement("div");d.className="builder-line";d.innerHTML=`<label>${lab}</label><select id="tb${idx}">${opts.map(o=>`<option>${o}</option>`).join("")}</select>`;box.appendChild(d)});
 $("#buildTurbulence").onclick=()=>{$("#turbulenceOutput").textContent=[0,1,2,3].map(i=>$(`#tb${i}`).value).join(" ")};
}
function renderListening(){
 const menu=$("#listeningMenu");menu.innerHTML="";
 listening.forEach((x,i)=>{const b=document.createElement("button");b.type="button";b.textContent=`${i+1}. ${x.title}`;b.className=i===state.listeningIndex?"active":"";b.onclick=()=>{state.listeningIndex=i;renderListening()};menu.appendChild(b)});
 const x=listening[state.listeningIndex];$("#listenType").textContent=x.type;$("#listenTitle").textContent=x.title;$("#listenContext").textContent=x.context;$("#listenAttempt").textContent="Not attempted";
 $("#transcript").textContent=x.text;$("#actionModel").textContent=x.model;$("#transcript").classList.add("hidden");$("#actionModel").classList.add("hidden");
 const qbox=$("#listenQuestions");qbox.innerHTML=""; setGroupMax(`listening${state.listeningIndex}`,x.questions.length);
 x.questions.forEach((it,j)=>{
  const card=document.createElement("article");card.className="quiz-card";card.innerHTML=`<h4>${j+1}. ${it.q}</h4><div class="option-list"></div><div class="feedback"></div>`;
  shuffle(it.opts).forEach(opt=>{const b=document.createElement("button");b.type="button";b.className="option-btn";b.textContent=opt;b.onclick=()=>{const ok=opt===it.a;card.querySelectorAll(".option-btn").forEach(z=>{z.disabled=true;if(z.textContent===it.a)z.classList.add("correct")});if(!ok)b.classList.add("wrong");const fb=card.querySelector(".feedback");fb.textContent=ok?"✓ Correct.":"✗ Not quite.";fb.className=`feedback ${ok?"good":"bad"}`;$("#listenAttempt").textContent="Attempted";mark(`listening${state.listeningIndex}`,j,ok)};card.querySelector(".option-list").appendChild(b)});qbox.appendChild(card)
 });
 $("#playMessage").onclick=()=>speak(x.text,.92);$("#playSlow").onclick=()=>speak(x.text,.73);
 $("#showTranscript").onclick=()=>$("#transcript").classList.toggle("hidden");$("#showActionModel").onclick=()=>$("#actionModel").classList.toggle("hidden");
}
function renderAnnouncement(){
 Object.entries(announcementData).forEach(([key,arr])=>{const id={context:"#annContext",action:"#annAction",limit:"#annLimit",next:"#annNext"}[key];$(id).innerHTML=arr.map(v=>`<option>${v}</option>`).join("")});
 $("#buildAnnouncement").onclick=()=>{$("#announcementOutput").textContent=[$("#annContext").value,$("#annAction").value,$("#annLimit").value,$("#annNext").value].join(" ")};
 $("#listenAnnouncement").onclick=()=>speak($("#announcementOutput").textContent);
}
function renderWriting(){
 const box=$("#writingTasks");box.innerHTML="";
 writingTasks.forEach((w,i)=>{
   const a=document.createElement("article");a.className="writing-card";
   a.innerHTML=`<span class="scenario-tag">${w.tag}</span><h3>${w.title}</h3><p>${w.prompt}</p><textarea rows="8" id="writing${i}" placeholder="Write your response here…"></textarea><div class="button-row"><button class="btn btn--ghost supportOnly hint" type="button">💡 Hint</button><button class="btn btn--ghost supportOnly a2" type="button">👁 A2+ model</button><button class="btn btn--ghost supportOnly b1" type="button">👁 B1 model</button><button class="btn btn--ghost listen" type="button">🔊 Listen B1</button></div><div class="model hidden"></div>`;
   const model=a.querySelector(".model");a.querySelector(".hint").onclick=()=>{model.innerHTML=`<strong>Hint:</strong> ${w.hint}`;model.classList.remove("hidden")};a.querySelector(".a2").onclick=()=>{model.innerHTML=`<strong>A2+ model:</strong> ${w.a2}`;model.classList.remove("hidden")};a.querySelector(".b1").onclick=()=>{model.innerHTML=`<strong>B1 model:</strong> ${w.b1}`;model.classList.remove("hidden")};a.querySelector(".listen").onclick=()=>speak(w.b1);box.appendChild(a)
 });
}
function renderOral(){
 const sel=$("#oralSelect");sel.innerHTML=oralMissions.map((o,i)=>`<option value="${i}">${i+1}. ${o.title}</option>`).join("");
 const load=()=>{const o=oralMissions[Number(sel.value)||0];$("#oralInstruction").textContent="Respond as cabin crew. Give the instruction first, then explain the rule or reason and confirm the next step.";$("#oralPromptText").textContent=o.prompt;$("#oralPromptText").classList.add("hidden");$("#oralModels").classList.add("hidden");$("#oralModels").innerHTML=`<div class="model"><strong>A2+ model:</strong> ${o.a2}</div><div class="model"><strong>B1 model:</strong> ${o.b1}</div>`};
 sel.onchange=load;load();
 $("#playOralPrompt").onclick=()=>speak(oralMissions[Number(sel.value)||0].prompt);
 $("#showOralPrompt").onclick=()=>$("#oralPromptText").classList.toggle("hidden");
 $("#showOralModels").onclick=()=>$("#oralModels").classList.toggle("hidden");
}
async function setupRecording(){
 const start=$("#startRecording"),stop=$("#stopRecording"),down=$("#downloadRecording"),audio=$("#recordedAudio"),status=$("#recordingStatus");
 if(!navigator.mediaDevices?.getUserMedia){start.disabled=true;status.textContent="Recording is not supported in this browser.";return}
 start.onclick=async()=>{
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});state.chunks=[];
    const rec=new MediaRecorder(stream);state.mediaRecorder=rec;
    rec.ondataavailable=e=>{if(e.data.size)state.chunks.push(e.data)};
    rec.onstop=()=>{
      const blob=new Blob(state.chunks,{type:rec.mimeType||"audio/webm"});
      if(state.recordingUrl)URL.revokeObjectURL(state.recordingUrl);state.recordingUrl=URL.createObjectURL(blob);
      audio.src=state.recordingUrl;audio.classList.remove("hidden");down.disabled=false;down.onclick=()=>{const a=document.createElement("a");a.href=state.recordingUrl;a.download="yanis-page25-oral-recording.webm";a.click()};
      stream.getTracks().forEach(t=>t.stop());status.textContent="✓ Recording ready. Listen, then download if needed.";status.className="feedback good";
    };
    rec.start();start.disabled=true;stop.disabled=false;status.textContent="● Recording…";status.className="feedback";
  }catch(e){status.textContent="Microphone permission was not granted.";status.className="feedback bad"}
 };
 stop.onclick=()=>{if(state.mediaRecorder?.state==="recording"){state.mediaRecorder.stop();start.disabled=false;stop.disabled=true}}
}
function mode(mode){
 state.mode=mode;document.body.classList.toggle("exam-mode",mode==="exam");$("#practiceMode").classList.toggle("is-on",mode==="practice");$("#examMode").classList.toggle("is-on",mode==="exam");
 $("#unlockSupport").classList.toggle("hidden",mode!=="exam");
}
function buildEvaluationRows(){
 const defs=[
  ["warmup","Clarté des consignes","QCM"],["form","Impératif + modaux","QCM"],["conjugation","Conjugaison des formes d’obligation","Texte à trous"],["meaning","mustn’t / don’t have to","QCM"],["error","Correction grammaticale","QCM"],["order","Séquençage d’une procédure","Ordre logique"],["scenario","Consignes en situation cabine","QCM"],["reading","Compréhension d’une procédure","Lecture"],
  ...listening.map((x,i)=>[`listening${i}`,`Écoute · ${x.title}`,"Compréhension orale"])
 ];
 const body=$("#evaluationRows");body.innerHTML="";
 defs.forEach(([id,label,type])=>{const tr=document.createElement("tr");tr.dataset.eval=id;tr.innerHTML=`<td>${label}</td><td>${type}</td><td class="eval-score">0/${state.max[id]||0}</td><td><span class="status not-started">Non commencé</span></td>`;body.appendChild(tr)});
}
function groupResult(id){
 const total=state.max[id]||0, entries=Object.entries(state.score).filter(([k])=>k.startsWith(id+":"));
 if(!entries.length)return {done:0,earned:0,total,status:"not-started",label:"Non commencé"};
 const earned=entries.reduce((a,[,v])=>a+v,0),done=entries.length,rate=earned/Math.max(1,done);
 if(done<total)return {done,earned,total,status:"progress-status",label:"En cours"};
 if(rate>=.75)return {done,earned,total,status:"achieved",label:"Acquis"};
 if(rate>=.5)return {done,earned,total,status:"progress-status",label:"En cours"};
 return {done,earned,total,status:"not-achieved",label:"Non acquis"};
}
function updateEvaluation(){
 $$("#evaluationRows tr").forEach(tr=>{const r=groupResult(tr.dataset.eval);tr.querySelector(".eval-score").textContent=`${r.earned}/${r.total}`;const s=tr.querySelector(".status");s.className=`status ${r.status}`;s.textContent=r.label});
 const {earned,max}=calcScore(),attempts=Object.keys(state.score).filter(k=>k.includes(":")).length;
 $("#autoRate").textContent=max?`${Math.round(earned/max*100)}%`:"0%";$("#completionRate").textContent=max?`${Math.round(attempts/max*100)}%`:"0%";
 const allManual=$$("[data-manual]").map(s=>s.value),autoComplete=max&&attempts>=max;
 let label="Non commencé",cl="not-started";
 if(attempts||allManual.some(v=>v!=="not-started")){label="En cours";cl="progress-status"}
 if(autoComplete && earned/max>=.75 && allManual.filter(v=>v==="achieved").length>=3){label="Acquis";cl="achieved"}
 if(autoComplete && earned/max<.5){label="Non acquis";cl="not-achieved"}
 $("#overallStatus").textContent=label;$("#overallStatus").className=`status ${cl}`;
}
function reportText(){
 const {earned,max}=calcScore();
 let out=`Yanis Deschasset — Page 25 — Cabin Instructions & Safety Communication\nDate: ${$("#evaluationDate").value||"—"}\nAutomatic score: ${earned}/${max} (${max?Math.round(earned/max*100):0}%)\n\nAUTOMATIC ACTIVITIES\n`;
 $$("#evaluationRows tr").forEach(tr=>{const c=tr.children;out+=`- ${c[0].textContent}: ${c[2].textContent} — ${c[3].textContent}\n`});
 out+=`\nMANUAL EVALUATION\n`;$$("[data-manual]").forEach(s=>out+=`- ${s.closest("label").childNodes[0].textContent.trim()}: ${s.options[s.selectedIndex].text}\n`);
 out+=`\nTrainer comments: ${$("#trainerComments").value||"—"}\nLearner comments: ${$("#learnerComments").value||"—"}\n`;
 return out;
}
function serialize(){
 const inputs={}; $$("textarea,input,select").forEach(el=>{if(el.id)inputs[el.id]=el.value});
 const manual={};$$("[data-manual]").forEach(el=>manual[el.dataset.manual]=el.value);
 return {score:state.score,mode:state.mode,voice:state.voice,inputs,manual,ts:new Date().toISOString()};
}
function save(){
 localStorage.setItem(STORE,JSON.stringify(serialize()));$("#lastSaved").textContent=new Date().toLocaleString();updateEvaluation()
}
function load(){
 try{
  const x=JSON.parse(localStorage.getItem(STORE)||"null");if(!x)return;
  state.score=x.score||{};state.voice=x.voice||"en-GB";mode(x.mode||"practice");
  Object.entries(x.inputs||{}).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.value=v});
  $$("[data-manual]").forEach(el=>{if(x.manual?.[el.dataset.manual])el.value=x.manual[el.dataset.manual]});
  $("#lastSaved").textContent=x.ts?new Date(x.ts).toLocaleString():"—";updateScore();updateEvaluation()
 }catch(e){}
}
function downloadReport(){
 const text=reportText().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\n/g,"<br>");
 const html=`<!doctype html><meta charset="utf-8"><title>Yanis Page 25 report</title><style>body{font-family:Arial;max-width:900px;margin:40px auto;line-height:1.55;color:#183049}h1{color:#081726}</style><h1>Yanis Deschasset — Page 25 Report</h1><p>${text}</p>`;
 const blob=new Blob([html],{type:"text/html"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="yanis-page25-qualiopi-report.html";a.click();setTimeout(()=>URL.revokeObjectURL(url),5000)
}
function setup(){
 $("#jsWarning").remove();
 renderQuiz("warmup","#warmupQuiz");renderQuiz("form","#formQuiz");renderConjugation();renderQuiz("meaning","#meaningQuiz");renderQuiz("error","#errorQuiz");renderQuiz("scenario","#scenarioQuiz");renderQuiz("reading","#readingQuiz");
 listening.forEach((x,i)=>setGroupMax(`listening${i}`,x.questions.length));
 renderVocab();renderOrder();renderTurbulenceBuilder();renderListening();renderAnnouncement();renderWriting();renderOral();setupRecording();
 buildEvaluationRows();updateEvaluation();
 $("#practiceMode").onclick=()=>mode("practice");$("#examMode").onclick=()=>mode("exam");
 $("#unlockSupport").onclick=()=>{document.body.classList.remove("exam-mode");$$(".supportOnly").forEach(x=>x.style.display="");};
 $("#voiceUK").onclick=()=>{state.voice="en-GB";$("#voiceUK").classList.add("is-on");$("#voiceUS").classList.remove("is-on")};$("#voiceUS").onclick=()=>{state.voice="en-US";$("#voiceUS").classList.add("is-on");$("#voiceUK").classList.remove("is-on")};
 $("#toggleFrench").onclick=()=>{document.body.classList.toggle("hide-fr");$("#toggleFrench").textContent=document.body.classList.contains("hide-fr")?"FR: hidden":"FR: visible"};
 $("#stopAudio").onclick=()=>speechSynthesis?.cancel();
 $("#startLesson").onclick=()=>$("#bridge").scrollIntoView({behavior:"smooth"});$("#listenIntro").onclick=()=>speak("You can already listen, clarify and relay professional information. Your next mission is to turn information into clear action: give instructions, explain what is required, state what is prohibited, and organise procedures step by step.");
 $$(".speak").forEach(b=>b.onclick=()=>speak(b.dataset.say));$$("[data-scroll]").forEach(b=>b.onclick=()=>document.getElementById(b.dataset.scroll)?.scrollIntoView({behavior:"smooth"}));
 $("#grammarCheatBtn").onclick=()=>$("#grammarCheat").classList.toggle("hidden");
 $("#listenVocabSet").onclick=()=>speak("Fasten your seat belt. Remain seated. Stow your bag. Keep the aisle clear. Fold your tray table away. Switch your phone to flight mode. Follow the crew instructions.");
 $("#modalClose").onclick=()=>$("#vocabModal").classList.add("hidden");$("#vocabModal").addEventListener("click",e=>{if(e.target===$("#vocabModal"))$("#vocabModal").classList.add("hidden")});
 $("#showAnnouncementModel").onclick=()=>$("#announcementModel").classList.toggle("hidden");
 $("#showFinalHint").onclick=()=>$("#finalHint").classList.toggle("hidden");$("#showFinalModel").onclick=()=>$("#finalModel").classList.toggle("hidden");
 $("#saveProgress").onclick=save;$("#copyResults").onclick=async()=>{try{await navigator.clipboard.writeText(reportText());alert("Results copied.")}catch(e){alert("Copy is not available. Select the report text manually.")}};
 $("#downloadHtml").onclick=downloadReport;$("#printReport").onclick=()=>window.print();$("#prepareEmail").onclick=()=>{location.href=`mailto:?subject=${encodeURIComponent("Yanis — Page 25 progress report")}&body=${encodeURIComponent(reportText())}`};
 $("#resetProgress").onclick=()=>{if(confirm("Reset saved Qualiopi progress and manual evaluation?")){localStorage.removeItem(STORE);location.reload()}};
 $("#resetLesson").onclick=()=>{if(confirm("Reset the complete lesson on this page?")){localStorage.removeItem(STORE);location.reload()}};
 $$("[data-manual],#trainerComments,#learnerComments,#satGrammar,#satSpeaking,#satPace,#satUseful").forEach(el=>el.addEventListener("change",updateEvaluation));
 if(!$("#evaluationDate").value)$("#evaluationDate").value=new Date().toISOString().slice(0,10);
 load();
}
document.addEventListener("DOMContentLoaded",setup);
})();