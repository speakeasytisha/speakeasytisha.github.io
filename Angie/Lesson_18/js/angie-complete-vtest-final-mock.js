(function(){
"use strict";
const $=id=>document.getElementById(id);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
let score=0,maxScore=0,accent="US",mode="practice",mistakes=[],answersBySkill={grammar:[0,0],particles:[0,0],functions:[0,0],reading:[0,0],listening:[0,0],construction:[0,0],writing:[0,0],speaking:[0,0],photo:[0,0]};

const vocab={
"🏰 Disney & Service":[["guest","visiteur","customer in a park/hotel","The guest needs directions."],["queue","file d’attente","line of people waiting","The queue is thirty minutes long."],["receipt","ticket de caisse","proof of payment","Do you have the receipt?"],["refund","remboursement","money returned","The guest requested a refund."],["supervisor","responsable","person in charge","I contacted my supervisor."]],
"✈ Travel":[["platform","quai","place where a train arrives","The train leaves from platform six."],["boarding pass","carte d’embarquement","document for a flight","Please show your boarding pass."],["luggage","bagages","bags for travel","My luggage is heavy."],["delay","retard","late departure","The flight has a delay."],["reservation","réservation","booking","I have a hotel reservation."]],
"🏠 Daily Life":[["appointment","rendez-vous","planned meeting","I have an appointment tomorrow."],["neighbourhood","quartier","area where you live","I live in a quiet neighbourhood."],["chores","tâches ménagères","household tasks","I do chores at home."],["rent","loyer","money for housing","The rent is expensive."],["schedule","emploi du temps","planned times","My schedule is busy."]],
"💼 Work & Studies":[["deadline","date limite","final date","The deadline is Friday."],["colleague","collègue","person you work with","My colleague helped me."],["training","formation","learning programme","I have completed my training."],["skills","compétences","abilities","I have improved my communication skills."],["teamwork","travail d’équipe","working together","Teamwork is important."]],
"🍽 Food & Health":[["allergy","allergie","reaction to food","I have a nut allergy."],["ingredients","ingrédients","foods used in a dish","Please check the ingredients."],["main course","plat principal","main dish","The main course was delicious."],["healthy","sain","good for health","I try to eat healthy food."],["pain","douleur","physical hurt","I have back pain."]],
"💻 Technology & Environment":[["password","mot de passe","secret login word","I forgot my password."],["download","télécharger","save a digital file","Please download the document."],["connection","connexion","internet link","The connection is slow."],["recycle","recycler","use material again","We should recycle more."],["pollution","pollution","dirty air/water","Pollution is a serious problem."]]
};

const grammar=[
{q:"1. You usually ___ English in the evening.",a:["study","are studying","studied"],good:"study",why:"Usually signals the Present Simple."},
{q:"2. Right now, you ___ for the VTEST.",a:["prepare","are preparing","prepared"],good:"are preparing",why:"Right now signals the Present Continuous."},
{q:"3. Last year, you ___ Disneyland Paris.",a:["have visited","visited","visit"],good:"visited",why:"A finished past time requires the Past Simple."},
{q:"4. You ___ worked with customers before.",a:["have","did","are"],good:"have",why:"Experience until now uses the Present Perfect."},
{q:"5. Have you taken the exam ___?",a:["ago","yet","last"],good:"yet",why:"Yet is common in Present Perfect questions."},
{q:"6. You have studied English ___ several months.",a:["since","for","ago"],good:"for",why:"For introduces a duration."},
{q:"7. You have studied English ___ April.",a:["for","last","since"],good:"since",why:"Since introduces a starting point."},
{q:"8. Next week, you ___ review your notes.",a:["are going to","worked","have"],good:"are going to",why:"A planned intention uses going to."},
{q:"9. The phone is ringing. You say: “I ___ answer it.”",a:["am going to","will","did"],good:"will",why:"Will is natural for a spontaneous decision."},
{q:"10. You ___ stay calm with an upset guest.",a:["should","worked","have"],good:"should",why:"Should gives advice."},
{q:"11. ___ I help you?",a:["Did","May","Have"],good:"May",why:"May I...? is a polite offer."},
{q:"12. If a guest is lost, you ___ help them.",a:["will","would","worked"],good:"will",why:"A real future possibility uses the First Conditional."},
{q:"13. If you worked at Disney, you ___ welcome international guests.",a:["will","did","would"],good:"would",why:"An imaginary situation uses the Second Conditional."},
{q:"14. Choose the correct question.",a:["Where you worked?","Where did you work?","Where did you worked?"],good:"Where did you work?",why:"Did + subject + base verb."},
{q:"15. Choose the correct negative.",a:["I didn't worked.","I didn't work.","I haven't work."],good:"I didn't work.",why:"Did not is followed by the base verb."},
{q:"16. She ___ friendly and patient.",a:["has","does","is"],good:"is",why:"Use be before an adjective."},
{q:"17. You enjoy ___ guests.",a:["helping","help","to helping"],good:"helping",why:"Enjoy is followed by -ing."},
{q:"18. You would like ___ at Disney.",a:["working","to work","work"],good:"to work",why:"Would like is followed by to + verb."},
{q:"19. This is ___ useful map.",a:["an","the","a"],good:"a",why:"Useful begins with a /y/ consonant sound."},
{q:"20. The restaurant is ___ the gift shop and the attraction.",a:["between","under","during"],good:"between",why:"Between describes a position in the middle of two things."},
{q:"21. This queue is ___ than the other one.",a:["long","longer","more long"],good:"longer",why:"Short adjectives normally take -er."},
{q:"22. This is the ___ attraction in the park.",a:["popular","more popular","most popular"],good:"most popular",why:"The superlative of a long adjective uses most."},
{q:"23. There ___ many guests in the park.",a:["is","are","has"],good:"are",why:"Guests is plural."},
{q:"24. How ___ luggage do you have?",a:["many","much","some"],good:"much",why:"Luggage is uncountable."}
];

const particles=[
{q:"1. I am looking ___ my wallet.",a:["after","for","up"],good:"for",why:"Look for means search."},
{q:"2. I will look ___ the problem.",a:["into","off","back"],good:"into",why:"Look into means investigate."},
{q:"3. We have run ___ of this size.",a:["on","in","out"],good:"out",why:"Run out of means have no more."},
{q:"4. Please fill ___ this form.",a:["out","back","over"],good:"out",why:"Fill out means complete a form."},
{q:"5. You can check ___ at reception.",a:["off","in","through"],good:"in",why:"Check in means register on arrival."},
{q:"6. Please turn ___ your phone.",a:["off","into","around"],good:"off",why:"Turn off means deactivate."},
{q:"7. I will call you ___.",a:["around","back","out"],good:"back",why:"Call back means phone again."},
{q:"8. Let’s go ___ the instructions.",a:["over","up","into"],good:"over",why:"Go over means review."},
{q:"9. I am interested ___ working at Disney.",a:["at","for","in"],good:"in",why:"Interested in."},
{q:"10. You are good ___ helping customers.",a:["at","about","of"],good:"at",why:"Good at."},
{q:"11. You are proud ___ your progress.",a:["about","of","for"],good:"of",why:"Proud of."},
{q:"12. You are ready ___ the VTEST.",a:["at","for","in"],good:"for",why:"Ready for."},
{q:"13. Please listen ___ the guest.",a:["for","at","to"],good:"to",why:"Listen to."},
{q:"14. It depends ___ the situation.",a:["on","to","with"],good:"on",why:"Depend on."},
{q:"15. You would like to apply ___ a Disney job.",a:["at","for","about"],good:"for",why:"Apply for a job."}
];

const functions=[
{q:"1. A guest asks for directions.",a:["What do you want?","Of course. I’ll show you on the map.","Go away."],good:"Of course. I’ll show you on the map.",why:"Warm, polite and helpful."},
{q:"2. A guest is angry.",a:["I understand your frustration.","Calm down.","It is not my problem."],good:"I understand your frustration.",why:"Acknowledge feelings before solving."},
{q:"3. You need time to check information.",a:["Wait there.","Would you mind waiting just a moment?","No idea."],good:"Would you mind waiting just a moment?",why:"This is a polite request."},
{q:"4. An item is unavailable.",a:["We don't have it. Bye.","I’m afraid we are out of stock, but I can suggest another item.","Take something else."],good:"I’m afraid we are out of stock, but I can suggest another item.",why:"Apology plus solution."},
{q:"5. A parent cannot find a child.",a:["Do not worry about it.","Please stay calm. I’ll contact my supervisor immediately.","Look alone."],good:"Please stay calm. I’ll contact my supervisor immediately.",why:"Reassure and follow procedure."},
{q:"6. A guest has an allergy.",a:["It is probably fine.","Let me check the ingredients with the kitchen team.","Eat it."],good:"Let me check the ingredients with the kitchen team.",why:"Never guess about safety."},
{q:"7. A ride closes temporarily.",a:["It is closed.","I’m sorry for the inconvenience. Would you like another recommendation?","Not my fault."],good:"I’m sorry for the inconvenience. Would you like another recommendation?",why:"Apology plus alternative."},
{q:"8. A customer wants an exchange.",a:["Do you have the receipt?","Why?","No."],good:"Do you have the receipt?",why:"This is a relevant professional question."},
{q:"9. You do not understand a question.",a:["What?","Could you repeat that a little more slowly, please?","Speak French."],good:"Could you repeat that a little more slowly, please?",why:"Professional clarification strategy."},
{q:"10. You need a moment to answer.",a:["Let me think for a second.","I don't know anything.","Stop."],good:"Let me think for a second.",why:"This keeps communication going."}
];

const reading1=[
{q:"Why will the park be busier?",a:["A special evening event","A transport strike","A restaurant opening"],good:"A special evening event"},
{q:"When should team members arrive?",a:["Thirty minutes late","Fifteen minutes early","At the normal time"],good:"Fifteen minutes early"},
{q:"What should happen after a temporary closure?",a:["Guests should receive another recommendation","The park should close","Guests should wait without information"],good:"Guests should receive another recommendation"},
{q:"Who must be contacted about a lost child?",a:["A customer","A supervisor","A waiter"],good:"A supervisor"}
];
const reading2=[
{q:"What time does the train leave?",a:["8:20 a.m.","8:40 a.m.","9:40 a.m."],good:"8:40 a.m."},
{q:"Which platform is used?",a:["Platform 6","Platform 8","Platform 20"],good:"Platform 6"},
{q:"How early should Angie arrive?",a:["At least twenty minutes early","Exactly five minutes early","One hour late"],good:"At least twenty minutes early"},
{q:"When does the hotel reservation begin?",a:["Thursday morning","Friday afternoon","Saturday evening"],good:"Friday afternoon"}
];
const reading3=[
{q:"What did the customer buy?",a:["A sweatshirt","A suitcase","A ticket"],good:"A sweatshirt"},
{q:"What is wrong with it?",a:["It is too small","It has a tear","It is the wrong colour"],good:"It has a tear"},
{q:"What proof does the customer have?",a:["A passport","The receipt","A map"],good:"The receipt"},
{q:"What does the customer prefer?",a:["An exchange","A voucher only","No solution"],good:"An exchange"}
];

const listening=[
[
{q:"Why is the flight delayed?",a:["Bad weather","A missing passenger","A technical interview"],good:"Bad weather"},
{q:"Where should passengers remain?",a:["Near gate 12","At the restaurant","Outside the airport"],good:"Near gate 12"}
],
[
{q:"What does the server ask about?",a:["Food allergies","Train times","Shop sizes"],good:"Food allergies"},
{q:"Who can check the ingredients?",a:["The kitchen team","The airport team","The hotel guests"],good:"The kitchen team"}
],
[
{q:"Where was the wallet probably left?",a:["Near the gift shop","At the airport gate","In a restaurant kitchen"],good:"Near the gift shop"},
{q:"What colour is it?",a:["Black","Blue","Red"],good:"Black"}
],
[
{q:"What happens first?",a:["Welcome the guests","Start the attraction","Contact a hotel"],good:"Welcome the guests"},
{q:"What happens finally?",a:["Make sure everyone is seated","Sell a sweatshirt","Check a reservation"],good:"Make sure everyone is seated"}
]
];

const builderSentences=[
"I have worked with customers before.",
"If a guest was upset, I would stay calm.",
"Could you repeat the question more slowly, please?",
"Last year, I worked at Carrefour Market.",
"I am interested in working at Disney.",
"First, I listened carefully and then I found a solution.",
"The attraction is temporarily closed for safety reasons.",
"I would like to create magical experiences for international guests."
];

const speakingPrompts=[
{
q:"Tell me about yourself.",
models:"<p><strong>A2:</strong> My name is Angie. I am motivated and friendly.</p><p><strong>B1:</strong> My name is Angie. I have worked with customers before, and I am currently improving my English.</p><p><strong>B1+:</strong> My name is Angie. I am motivated, patient and passionate about customer service. My past experiences have helped me become more confident, and I would like to work in an international environment.</p>"
},
{
q:"Why would you like to work at Disney?",
models:"<p><strong>A2:</strong> I like Disney and helping people.</p><p><strong>B1:</strong> I would like to work at Disney because I enjoy helping guests and creating positive experiences.</p><p><strong>B1+:</strong> I would love to work at Disney because I am passionate about customer service, teamwork and creating memorable experiences for international guests.</p>"
},
{
q:"Describe your last job.",
models:"<p><strong>A2:</strong> I sold fruit at the market.</p><p><strong>B1:</strong> My last job was selling strawberries, and it helped me understand customer service.</p><p><strong>B1+:</strong> My last job involved selling strawberries and communicating with customers. It helped me become more confident, efficient and comfortable in a customer-facing role.</p>"
},
{
q:"What would you do if a guest was angry?",
models:"<p><strong>A2:</strong> I would stay calm and help.</p><p><strong>B1:</strong> I would listen carefully, apologise and try to find a solution.</p><p><strong>B1+:</strong> I would acknowledge the guest’s frustration, apologise politely, clarify the problem and offer the most practical solution available.</p>"
},
{
q:"Have you ever worked with customers?",
models:"<p><strong>A2:</strong> Yes, I have.</p><p><strong>B1:</strong> Yes, I have worked with customers at Carrefour Market.</p><p><strong>B1+:</strong> Yes, I have already gained customer-service experience, especially through my work at Carrefour Market and at the market selling strawberries.</p>"
},
{
q:"Describe a difficult situation you solved.",
models:"<p><strong>A2:</strong> A customer had a problem. I helped them.</p><p><strong>B1:</strong> A customer could not find a product. I listened and suggested another one.</p><p><strong>B1+:</strong> A customer was upset because a product was unavailable. First, I listened carefully. Then, I checked the stock and suggested a similar item. As a result, the customer felt reassured.</p>"
},
{
q:"What are your future goals?",
models:"<p><strong>A2:</strong> I want to improve my English and work at Disney.</p><p><strong>B1:</strong> I am going to continue improving my English because I would like to work at Disney.</p><p><strong>B1+:</strong> My goal is to become more confident in English and eventually work in a guest-facing role at Disney, possibly in retail or attractions.</p>"
},
{
q:"What would you do if a child was lost?",
models:"<p><strong>A2:</strong> I would call my supervisor.</p><p><strong>B1:</strong> I would reassure the parent, ask for a description and contact my supervisor.</p><p><strong>B1+:</strong> I would remain calm, reassure the parent, collect key information about the child and immediately follow the park’s safety procedure.</p>"
}
];

function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function updateScore(n,skill){score+=n;answersBySkill[skill][0]+=n;$("score").textContent=score}
function addPossible(n,skill){maxScore+=n;answersBySkill[skill][1]+=n;$("maxScore").textContent=maxScore}
function speak(text){if(!("speechSynthesis"in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text||"").replace(/\s+/g," ").trim());u.lang=accent==="UK"?"en-GB":"en-US";u.rate=.92;speechSynthesis.speak(u)}

function renderQuiz(hostId,data,skill){
 const host=$(hostId);host.innerHTML="";
 data.forEach((q,index)=>{
   addPossible(2,skill);
   const d=document.createElement("div");d.className="quizItem";
   d.innerHTML=`<strong>${q.q}</strong><div class="choices"></div><p class="feedback"></p>`;
   const options=shuffle(q.a);
   options.forEach(a=>{
     const b=document.createElement("button");b.className="choice";b.type="button";b.textContent=a;
     b.onclick=()=>{
       if(d.dataset.answered)return;
       d.dataset.answered="1";
       const ok=a===q.good;
       if(ok)updateScore(2,skill);else mistakes.push({section:skill,question:q.q,answer:q.good});
       $$(".choice",d).forEach(x=>x.disabled=true);
       const fb=d.querySelector(".feedback");
       if(mode==="practice"){
         b.classList.add(ok?"good":"bad");
         const correct=[...d.querySelectorAll(".choice")].find(x=>x.textContent===q.good);
         if(correct)correct.classList.add("good");
         fb.className="feedback "+(ok?"good":"bad");
         fb.textContent=ok?"✅ Correct. "+(q.why||""):"💡 Correct answer: "+q.good+". "+(q.why||"");
       } else {
         fb.className="feedback exam";fb.textContent="Answer saved.";
       }
     };
     d.querySelector(".choices").appendChild(b);
   });
   host.appendChild(d);
 });
}

function renderVocab(){
 const tabs=$("vocabTabs");
 Object.keys(vocab).forEach((cat,i)=>{
   const b=document.createElement("button");b.className="tab"+(i===0?" active":"");b.type="button";b.textContent=cat;
   b.onclick=()=>{$$(".tab",tabs).forEach(x=>x.classList.remove("active"));b.classList.add("active");showVocab(cat)};
   tabs.appendChild(b);
 });
 showVocab(Object.keys(vocab)[0]);
}
function showVocab(cat){
 const host=$("vocabGrid");host.innerHTML="";
 vocab[cat].forEach(v=>{
   const d=document.createElement("div");d.className="vocab";
   d.innerHTML=`<h3>${v[0]}</h3><p class="hidden"><strong>FR:</strong> ${v[1]}</p><p class="hidden"><strong>Meaning:</strong> ${v[2]}</p><p class="hidden example">${v[3]}</p><button class="btn" type="button">🔊 Listen</button>`;
   d.onclick=e=>{if(e.target.tagName==="BUTTON"){speak(v[0]+". "+v[3]);return}$$(".hidden",d).forEach(x=>x.classList.toggle("hidden"))};
   host.appendChild(d);
 });
}

function renderBuilders(){
 const host=$("builders");
 builderSentences.forEach((target,index)=>{
   addPossible(3,"construction");
   const d=document.createElement("div");d.className="builderCard";
   d.innerHTML=`<h3>Sentence ${index+1}</h3><div class="wordBank"></div><div class="answerBank"></div><button class="btn primary">Check</button><button class="btn ghost">Reset</button><p class="feedback"></p>`;
   let built=[];
   const original=target.split(" ");
   let mixed=shuffle(original);
   while(mixed.join(" ")===original.join(" ")) mixed=shuffle(original);
   const wordBank=d.querySelector(".wordBank"),answerBank=d.querySelector(".answerBank");
   function reset(){
     built=[];wordBank.innerHTML="";answerBank.innerHTML="";
     mixed=shuffle(original);while(mixed.join(" ")===original.join(" "))mixed=shuffle(original);
     mixed.forEach((word,i)=>{
       const b=document.createElement("button");b.className="word";b.type="button";b.textContent=word;b.dataset.i=i;
       b.onclick=()=>{built.push(word);answerBank.appendChild(b)};
       wordBank.appendChild(b);
     });
     d.querySelector(".feedback").textContent="";
   }
   d.querySelector(".btn.primary").onclick=()=>{
     if(d.dataset.answered)return;
     d.dataset.answered="1";
     const ok=built.join(" ")===target;
     if(ok)updateScore(3,"construction");else mistakes.push({section:"construction",question:"Rebuild: "+target,answer:target});
     const fb=d.querySelector(".feedback");fb.className="feedback "+(ok?"good":"bad");
     fb.textContent=mode==="exam"?"Answer saved.":(ok?"✅ Perfect sentence!":"💡 Correct sentence: "+target);
   };
   d.querySelector(".btn.ghost").onclick=reset;
   reset();host.appendChild(d);
 });
}

function textCheck(id,feedbackId,keywords,min,skill,maxPoints){
 addPossible(maxPoints,skill);
 $(id).dataset.max=maxPoints;
 $(id).dataset.checked="0";
 const btnEvent=()=>{
   if($(id).dataset.checked==="1")return;
   $(id).dataset.checked="1";
   const text=$(id).value.toLowerCase();
   let hits=0;keywords.forEach(k=>{if(text.includes(k))hits++});
   const earned=Math.min(maxPoints,Math.round((hits/keywords.length)*maxPoints));
   updateScore(earned,skill);
   if(hits<min)mistakes.push({section:skill,question:"Open task: "+id,answer:"Add: "+keywords.slice(0,min).join(", ")});
   const fb=$(feedbackId);fb.className="feedback "+(hits>=min?"good":"bad");
   fb.textContent=mode==="exam"?"Answer saved.":(hits>=min?`✨ Good answer. You used ${hits} target elements.`:`💡 Develop your answer. Try adding: ${keywords.slice(0,min).join(", ")}.`);
 };
 return btnEvent;
}

function renderSpeaking(){
 const p=speakingPrompts[Math.floor(Math.random()*speakingPrompts.length)];
 $("questionBox").textContent=p.q;$("speakingModel").innerHTML=p.models;$("speakingModel").classList.add("hidden");$("speakingNotes").value="";$("speakingNotes").dataset.checked="0";$("speakingFeedback").textContent="";
}

function skillPercent(skill){const [got,total]=answersBySkill[skill];return total?Math.round((got/total)*100):0}
function levelFromPercent(p){if(p>=80)return"B1-ready performance";if(p>=65)return"Strong A2+ / approaching B1";if(p>=50)return"A2 developing";return"Needs targeted review"}

function init(){
 $("usBtn").onclick=()=>{accent="US";$("usBtn").classList.add("active");$("ukBtn").classList.remove("active")};
 $("ukBtn").onclick=()=>{accent="UK";$("ukBtn").classList.add("active");$("usBtn").classList.remove("active")};
 $("resetBtn").onclick=()=>location.reload();
 $("practiceMode").onclick=()=>{mode="practice";$("practiceMode").classList.add("active");$("examMode").classList.remove("active")};
 $("examMode").onclick=()=>{mode="exam";$("examMode").classList.add("active");$("practiceMode").classList.remove("active")};
 document.addEventListener("click",e=>{if(e.target.dataset.speak)speak(e.target.dataset.speak);if(e.target.dataset.listen)speak($(e.target.dataset.listen).value);if(e.target.dataset.toggle)$(e.target.dataset.toggle).classList.toggle("hidden")});
 renderVocab();
 $("listenVocab").onclick=()=>{const cat=document.querySelector("#vocabTabs .tab.active").textContent;speak(vocab[cat].map(v=>v[0]+". "+v[3]).join(" "))};

 renderQuiz("grammarQuiz",grammar,"grammar");
 renderQuiz("particleQuiz",particles,"particles");
 renderQuiz("functionQuiz",functions,"functions");
 renderBuilders();
 renderQuiz("readingQuiz1",reading1,"reading");
 renderQuiz("readingQuiz2",reading2,"reading");
 renderQuiz("readingQuiz3",reading3,"reading");
 renderQuiz("listenQuiz1",listening[0],"listening");
 renderQuiz("listenQuiz2",listening[1],"listening");
 renderQuiz("listenQuiz3",listening[2],"listening");
 renderQuiz("listenQuiz4",listening[3],"listening");

 $("checkPhoto").onclick=textCheck("photoAnswer","photoFeedback",["picture","foreground","background","people","are","seem","think","because"],4,"photo",10);
 document.querySelectorAll("[data-check-writing]").forEach(btn=>{
   const id=btn.dataset.checkWriting,fb="feedback"+id.charAt(0).toUpperCase()+id.slice(1);
   const keys=id==="write1"?["i","have","worked","am","future","because","disney","motivated","customer","english"]:
              id==="write2"?["dear","sorry","inconvenience","closed","safety","could","app","guest","thank"]:
              ["guest","wallet","shop","description","supervisor","reported","time","lost"];
   btn.onclick=textCheck(id,fb,keys,4,"writing",10);
 });

 $("newQuestion").onclick=renderSpeaking;renderSpeaking();
 $("checkSpeaking").onclick=textCheck("speakingNotes","speakingFeedback",["i","worked","would","because","guest","disney","future","experience","help","customer"],4,"speaking",10);

 let seconds=3600,timerInt=null;
 function showTimer(){const m=String(Math.floor(seconds/60)).padStart(2,"0"),s=String(seconds%60).padStart(2,"0");$("timer").textContent=m+":"+s}
 $("startTimer").onclick=()=>{clearInterval(timerInt);timerInt=setInterval(()=>{seconds--;showTimer();if(seconds<=0)clearInterval(timerInt)},1000)};
 $("resetTimer").onclick=()=>{clearInterval(timerInt);seconds=3600;showTimer()};showTimer();

 $("generateReport").onclick=()=>{
   const assessed=["grammar","particles","functions","construction","reading","listening","photo","writing","speaking"];
   const overall=maxScore?Math.round((score/maxScore)*100):0;
   let bars=assessed.map(s=>`<p><strong>${s.charAt(0).toUpperCase()+s.slice(1)}:</strong> ${skillPercent(s)}%</p><div class="skillBar"><span style="width:${skillPercent(s)}%"></span></div>`).join("");
   let notes=mistakes.length?mistakes.slice(0,15).map(m=>`<div class="mistakeItem"><strong>${m.section}:</strong> ${m.question}<br><span>Review: ${m.answer}</span></div>`).join(""):"<p>No incorrect answers were recorded.</p>";
   $("reportOutput").innerHTML=`<h3>Angie’s Complete Final Mock Report</h3><p><strong>Total score:</strong> ${score}/${maxScore} (${overall}%)</p><p><strong>Estimated practice profile:</strong> ${levelFromPercent(overall)}</p>${bars}<h3>Mistake Notebook</h3>${notes}<h3>Final Priorities</h3><p>Review the weakest skill above, practise one photo description aloud, record two interview answers in Voice Memos, and revise polite clarification phrases before exam day.</p>`;
 };
}

document.addEventListener("DOMContentLoaded",init);
})();