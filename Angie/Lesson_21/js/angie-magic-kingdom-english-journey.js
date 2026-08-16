(function(){
"use strict";
const $=id=>document.getElementById(id);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
let accent="US";

const lessons=[
{icon:"🌱",land:"Main Street",title:"Introduction",date:"27/04/2026",learn:"Your first steps: introduction, needs analysis and first VTEST awareness.",url:"https://speakeasytisha.github.io/intro-session-fixed"},
{icon:"🎤",land:"Adventureland",title:"Interview Practice",date:"29/04/2026",learn:"Tell your story, STAR method, professional introduction, habits, pronouns, would like and can.",url:"https://speakeasytisha.github.io/angie-disney-interview-simulator.html"},
{icon:"📋",land:"VTEST Gateway",title:"Introduction to the Test",date:"07/05/2026",learn:"Exam awareness plus interview practice and first professional communication strategies.",url:"https://speakeasytisha.github.io/angie-disney-interview-simulator.html"},
{icon:"🛍",land:"Retail Avenue",title:"Shops & Attractions",date:"11/05/2026",learn:"Guest communication, shops, attractions, common phrases and customer-service vocabulary.",url:"https://speakeasytisha.github.io/angie-attractions-shop-final-premium-working.html"},
{icon:"🪄",land:"Tomorrowland",title:"Difficult Situations + Future & Modals",date:"14/05/2026",learn:"Future forms, questions, can/could/may/should and difficult guest situations.",url:"https://speakeasytisha.github.io/angie-difficult-situations-disney-full.html"},
{icon:"🏰",land:"Dream Castle",title:"Professional Ambitions",date:"19/05/2026",learn:"Qualities, strengths, future goals, interview vocabulary, fluency connectors and Why Disney?",url:"https://speakeasytisha.github.io/angie-disney-professional-ambitions-masterclass.html"},
{icon:"🕰",land:"Storybook Square",title:"Past Experience Speaking Studio",date:"21/05/2026",learn:"Past Simple speaking, sequencing words, result language, sentence order and VTEST speaking prompts.",url:"https://speakeasytisha.github.io/angie-disney-professional-ambitions-masterclass.html"},
{icon:"🌟",land:"Confidence Cove",title:"Build Confidence & Fluency",date:"26/05/2026",learn:"Grammar connections, tense choice, Disney missions, interview rapid fire and model answers by level.",url:"https://speakeasytisha.github.io/angie-disney-review-fluency-masterclass.html"},
{icon:"⏳",land:"Time Travel Castle",title:"Past Simple Masterclass",date:"02/06/2026",learn:"Signal words, regular/irregular verbs, pronunciation, negatives, questions and past storytelling.",url:"https://speakeasytisha.github.io/Angie/Lesson_7/angie-disney-time-travel-past-simple-masterclass.html"},
{icon:"📖",land:"Storytelling Theatre",title:"Disney Storytelling Adventure",date:"10/06/2026",learn:"Past + present + future, tense review, word order, story generation, interview formula and upgrade lab.",url:"https://speakeasytisha.github.io/Angie/Lesson_11/angie-disney-storytelling-adventure.html"},
{icon:"🎯",land:"Assessment Center",title:"VTEST Preparation",date:"17/06/2026",learn:"VTEST format, vocabulary, grammar arena, speaking studio and mini-simulation.",url:"https://speakeasytisha.github.io/Angie/Lesson_13/angie-disney-vtest-assessment-center-fixed.html"},
{icon:"✨",land:"Present Perfect Tower",title:"Present Perfect Masterclass",date:"23/06/2026",learn:"Experience, progress, achievements, have/has, past participles and Present Perfect vs Past Simple.",url:"https://speakeasytisha.github.io/Angie/Lesson_12/angie-disney-present-perfect-masterclass.html"},
{icon:"🔗",land:"Problem Solving Pier",title:"Storytelling & Problem Solving",date:"02/07/2026",learn:"Connectors, second conditional, problem solving, photo description and Disney communication.",url:"https://speakeasytisha.github.io/Angie/Lesson_15/angie-disney-storytelling-problem-solving-masterclass-updated.html"},
{icon:"🧩",land:"Mystery Mountain",title:"Magic Particles",date:"08/07/2026",learn:"Phrasal verbs, particles, verb + preposition and adjective + preposition combinations.",url:"https://speakeasytisha.github.io/Angie/Lesson_16/angie-disney-phrasal-verbs-magic-particles-masterclass.html"},
{icon:"🏆",land:"Final Challenge Arena",title:"VTEST Final Mock",date:"16/07/2026",learn:"Complete grammar, vocabulary, listening, reading, writing, speaking, photo description and customer-service review.",url:"https://speakeasytisha.github.io/Angie/Lesson_18/angie-complete-vtest-final-mock.html"},
{icon:"📝",land:"Writing Academy",title:"VTEST Format & Essay Masterclass",date:"Final preparation",learn:"Official test structure, scrambled sentences, picture writing, essay organisation and exam strategy.",url:"https://speakeasytisha.github.io/Angie/Lesson_19/angie-vtest-format-essay-masterclass.html"}
];

const grammar={
"Tenses":[["Present Simple","habits and facts"],["Present Continuous","what is happening now"],["Past Simple","finished past experiences"],["Present Perfect","life experience and progress"],["Future","will / going to"],["Conditionals","real and hypothetical situations"]],
"Sentence Building":[["Questions","auxiliary + subject + base verb"],["Negatives","do/did/have + not"],["Word Order","subject + verb + complement"],["Pronouns","he / she / his / her / their"],["Verb Patterns","enjoy + -ing / would like + to"],["Storytelling","situation → action → result"]],
"Accuracy":[["Prepositions","at / in / on / for / to / about"],["Articles","a / an / the / no article"],["Connectors","first / then / however / as a result"],["Comparisons","comparatives and superlatives"],["Modals","can / could / may / should"],["Phrasal Verbs","look for / find out / give back / run out of"]]
};

const vocab=[
["🏰 Disney","guest, attraction, queue, parade, castle, safety, cast member"],
["🛍 Retail","receipt, refund, exchange, stock, size, product, boutique"],
["🍽 Restaurant","allergy, ingredients, reservation, menu, waiting time"],
["✈ Travel","airport, luggage, hotel, directions, platform, ticket"],
["🎤 Interview","motivated, patient, teamwork, strengths, ambitions, experience"],
["🤝 Customer Service","apologise, reassure, recommend, solve, supervisor, patience"],
["📍 Directions","straight ahead, turn left, turn right, next to, opposite, between"],
["🔗 Connectors","first, then, after that, however, because, as a result"],
["🧩 Particles","up, out, in, on, off, back, over, through, into"]
];

const badges=[
["🌱","First English Conversation"],["🎤","Interview Explorer"],["🛍","Disney Guest Helper"],["🧠","Grammar Builder"],
["⏳","Past Simple Time Traveller"],["✨","Present Perfect Star"],["🔗","Connector Master"],["📸","Photo Detective"],
["🧩","Magic Particle Solver"],["🤝","Problem Solver"],["🏰","Disney Dream Builder"],["🏆","VTEST Graduate"]
];

const quiz=[
{q:"Which tense tells a finished story from last year?",a:["Present Perfect","Past Simple","Future"],good:"Past Simple"},
{q:"Complete: I am interested ___ working at Disney.",a:["for","in","at"],good:"in"},
{q:"What does “look for” mean?",a:["chercher","s’occuper de","éteindre"],good:"chercher"},
{q:"Best polite reaction to a complaint?",a:["I understand your frustration.","Calm down.","Not my problem."],good:"I understand your frustration."},
{q:"Which connector introduces a result?",a:["Although","As a result","First"],good:"As a result"},
{q:"If a guest was upset, I ___ stay calm.",a:["will","would","worked"],good:"would"}
];

function speak(text){
 if(!("speechSynthesis" in window)) return;
 speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(String(text||""));
 u.lang=accent==="UK"?"en-GB":"en-US";
 u.rate=.92;
 speechSynthesis.speak(u);
}
function renderMap(){
 const host=$("parkMap");
 lessons.forEach(l=>{
   const d=document.createElement("article");
   d.className="land";
   d.innerHTML=`<div class="landIcon">${l.icon}</div><h3>${l.land}</h3><p><strong>${l.title}</strong><br><span class="muted">${l.date}</span></p><button class="btn ghost" type="button">Open memory</button><div class="landDetail">${l.learn}<br><a href="${l.url}" target="_blank" rel="noopener">Revisit lesson ↗</a></div>`;
   d.querySelector("button").onclick=()=>d.classList.toggle("open");
   host.appendChild(d);
 });
}
function renderGrammar(){
 const tabs=$("grammarTabs");
 Object.keys(grammar).forEach((cat,i)=>{
   const b=document.createElement("button");
   b.className="tab"+(i===0?" active":"");
   b.type="button";
   b.textContent=cat;
   b.onclick=()=>{
     $$(".tab",tabs).forEach(x=>x.classList.remove("active"));
     b.classList.add("active");
     showGrammar(cat);
   };
   tabs.appendChild(b);
 });
 showGrammar(Object.keys(grammar)[0]);
}
function showGrammar(cat){
 $("grammarGrid").innerHTML=grammar[cat].map(x=>`<div class="skillCard"><h3>✅ ${x[0]}</h3><p>${x[1]}</p></div>`).join("");
}
function renderVocab(){
 $("vocabChests").innerHTML=vocab.map(x=>`<div class="chest"><h3>${x[0]}</h3><p>Open treasure chest</p><div class="chestDetail">${x[1]}</div></div>`).join("");
 $$(".chest").forEach(c=>c.onclick=()=>c.classList.toggle("open"));
}
function renderBadges(){
 $("badges").innerHTML=badges.map(b=>`<div class="badge"><div class="emoji">${b[0]}</div><strong>${b[1]}</strong><span>Unlocked</span></div>`).join("");
}
function renderQuiz(){
 const host=$("memoryQuiz");
 quiz.forEach(q=>{
   const d=document.createElement("div");
   d.className="quizItem";
   d.innerHTML=`<strong>${q.q}</strong><div class="choices"></div><p class="feedback"></p>`;
   [...q.a].sort(()=>Math.random()-.5).forEach(a=>{
     const b=document.createElement("button");
     b.className="choice";
     b.type="button";
     b.textContent=a;
     b.onclick=()=>{
       const ok=a===q.good;
       b.classList.add(ok?"good":"bad");
       d.querySelector(".feedback").textContent=ok?"✨ You remembered!":"💡 Correct answer: "+q.good;
     };
     d.querySelector(".choices").appendChild(b);
   });
   host.appendChild(d);
 });
}
function renderLibrary(){
 $("library").innerHTML=lessons.map(l=>`<div class="libraryCard"><h3>${l.icon} ${l.title}</h3><p>${l.learn}</p><a href="${l.url}" target="_blank" rel="noopener">Open lesson ↗</a></div>`).join("");
}
function init(){
 $("usBtn").onclick=()=>{accent="US";$("usBtn").classList.add("active");$("ukBtn").classList.remove("active")};
 $("ukBtn").onclick=()=>{accent="UK";$("ukBtn").classList.add("active");$("usBtn").classList.remove("active")};
 $("printBtn").onclick=()=>window.print();
 $("resetBtn").onclick=()=>location.reload();
 document.addEventListener("click",e=>{if(e.target.dataset.speak)speak(e.target.dataset.speak)});
 renderMap();
 renderGrammar();
 renderVocab();
 renderBadges();
 renderQuiz();
 renderLibrary();
}
document.addEventListener("DOMContentLoaded",init);
})();