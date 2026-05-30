
(function(){
"use strict";

const $=id=>document.getElementById(id);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

let score=0;
let accent="US";
let selectedDrag=null;

function update(n){
score+=n;
$("score").textContent=score;
}

function speak(text){
if(!("speechSynthesis" in window))return;
speechSynthesis.cancel();
const u=new SpeechSynthesisUtterance(String(text||""));
u.lang=accent==="UK"?"en-GB":"en-US";
u.rate=.92;
speechSynthesis.speak(u);
}

$("usBtn").onclick=()=>{
accent="US";
$("usBtn").classList.add("active");
$("ukBtn").classList.remove("active");
};

$("ukBtn").onclick=()=>{
accent="UK";
$("ukBtn").classList.add("active");
$("usBtn").classList.remove("active");
};

$("resetBtn").onclick=()=>location.reload();

document.addEventListener("click",e=>{
if(e.target.dataset.speak)speak(e.target.dataset.speak);
if(e.target.dataset.listen)speak($(e.target.dataset.listen).value);
if(e.target.dataset.check)checkPrompt(e.target.dataset.check);
});

function quiz(host,data){
const el=$(host);
data.forEach(q=>{
const div=document.createElement("div");
div.className="quizItem";
div.innerHTML=`<p><strong>${q.q}</strong></p>`;
q.a.forEach(a=>{
const b=document.createElement("button");
b.className="choice";
b.textContent=a;
b.onclick=()=>{
const ok=a===q.good;
b.classList.add(ok?"good":"bad");
if(ok&&!div.dataset.done){
div.dataset.done=1;
update(2);
}
};
div.appendChild(b);
});
el.appendChild(div);
});
}

quiz("missionQuiz",[
{
q:"Choose the future sentence:",
a:["I am going to work at Disney.","I worked at Disney.","I am worked."],
good:"I am going to work at Disney."
},
{
q:"Choose the present sentence:",
a:["I enjoy teamwork.","I enjoyed teamwork yesterday.","I will teamwork."],
good:"I enjoy teamwork."
},
{
q:"Choose the past sentence:",
a:["I worked at Carrefour.","I work at Carrefour last year.","I am working yesterday."],
good:"I worked at Carrefour."
}
]);

const fixHost=$("fixes");

[
["I have 21 years old.","I am 21 years old."],
["I love cook.","I love cooking."],
["I wish work at Disney.","I wish to work at Disney."],
["I am motivate.","I am motivated."]
].forEach(it=>{
const div=document.createElement("div");
div.className="fixItem";
div.innerHTML=`<p><strong>Correct:</strong> ${it[0]}</p>
<input>
<button class="btn primary">Check</button>
<p class="feedback"></p>`;
div.querySelector("button").onclick=()=>{
const val=div.querySelector("input").value.toLowerCase();
const ok=val.includes(it[1].toLowerCase());
const fb=div.querySelector(".feedback");
fb.textContent=ok?"✅ Great!":"💡 "+it[1];
fb.className="feedback "+(ok?"good":"bad");
if(ok&&!div.dataset.done){
div.dataset.done=1;
update(3);
}
};
fixHost.appendChild(div);
});

quiz("verbQuiz",[
{
q:"Choose the correct sentence:",
a:["I enjoy helping guests.","I enjoy to help guests.","I enjoy help guests."],
good:"I enjoy helping guests."
},
{
q:"Choose the correct sentence:",
a:["I would like to work at Disney.","I would like work at Disney.","I would like working at Disney."],
good:"I would like to work at Disney."
}
]);

const items=[
["I worked at Carrefour.","past"],
["I enjoy teamwork.","present"],
["I am going to improve my English.","future"]
];

const bank=$("dragBank");

items.forEach((it,i)=>{
const d=document.createElement("div");
d.className="dragItem";
d.draggable=true;
d.id="drag"+i;
d.dataset.answer=it[1];
d.textContent=it[0];
d.ondragstart=e=>e.dataTransfer.setData("text/plain",d.id);
d.onclick=()=>selectedDrag=d;
bank.appendChild(d);
});

$$(".dropZone").forEach(z=>{
z.ondragover=e=>e.preventDefault();
z.ondrop=e=>{
e.preventDefault();
const el=$(e.dataTransfer.getData("text/plain"));
place(el,z);
};
z.onclick=()=>{
if(selectedDrag)place(selectedDrag,z);
};
});

function place(el,z){
z.appendChild(el);
const ok=el.dataset.answer===z.dataset.answer;
el.classList.add(ok?"good":"bad");
$("dragFeedback").textContent=ok?"✅ Correct!":"💡 Try again.";
if(ok&&!el.dataset.done){
el.dataset.done=1;
update(2);
}
}

$("buildFluency").onclick=()=>{
$("fluencyOutput").textContent=
$("timeSelect").value+" "+
$("expSelect").value+" "+
$("actionSelect").value+". "+
$("resultSelect").value;
update(4);
};

$("listenFluency").onclick=()=>{
speak($("fluencyOutput").textContent);
};

function checkPrompt(id){
const val=$(id).value.toLowerCase();
let pts=0;
["disney","english","guests","experience","motivated","confident"].forEach(w=>{
if(val.includes(w))pts++;
});
const fb=$("feedback"+id.charAt(0).toUpperCase()+id.slice(1));
fb.textContent=pts>=2?"✨ Great answer!":"💡 Add more details.";
fb.className="feedback "+(pts>=2?"good":"bad");
update(pts);
}

const models={
a2:{
title:"🟢 A2 Model",
text:"I would like to work at Disney because I enjoy helping guests and creating magical experiences.",
notes:"Simple and clear."
},
b1:{
title:"🟣 B1 Model",
text:"Working at Disney would be a wonderful opportunity because I enjoy teamwork and communication.",
notes:"Longer and more professional."
},
b1plus:{
title:"⭐ B1+ Model",
text:"Working at Disney would be an amazing opportunity because I am passionate about customer service and international communication.",
notes:"Professional interview style."
}
};

function setModel(k){
$("modelTitle").textContent=models[k].title;
$("modelText").textContent=models[k].text;
$("modelNotes").textContent=models[k].notes;
}

$$(".modelBtn").forEach(b=>{
b.onclick=()=>{
$$(".modelBtn").forEach(x=>x.classList.remove("active"));
b.classList.add("active");
setModel(b.dataset.model);
};
});

setModel("a2");

$("listenModel").onclick=()=>{
speak($("modelText").textContent);
};

$("checkFinal").onclick=()=>{
const val=$("finalAnswer").value.toLowerCase();
let pts=0;
["disney","english","experience","future","guests","motivated","teamwork"].forEach(w=>{
if(val.includes(w))pts++;
});
$("finalFeedback").textContent=
pts>=5?
"🏰 Excellent Disney interview answer!":
"💡 Add more professional vocabulary.";
$("finalFeedback").className="feedback "+(pts>=5?"good":"bad");
update(pts);
};

})();
