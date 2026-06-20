(function(){
"use strict";
const $=id=>document.getElementById(id);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
let score=0, accent="US", timerInt=null, seconds=1500, mediaRecorder=null, chunks=[];

const vocab={
"Disney & Theme Parks":[["attraction","attraction","A ride or show","The attraction is closed."],["queue","file d’attente","A line of people waiting","The queue is very long."],["guest","visiteur","A customer in a park","The guest needs help."],["parade","défilé","A moving show","The parade starts at five."]],
"Retail & Boutique":[["receipt","ticket de caisse","Proof of payment","Do you have the receipt?"],["refund","remboursement","Money returned","The guest asked for a refund."],["exchange","échange","Change one item for another","Can I exchange this T-shirt?"],["stock","stock","Available products","We have this item in stock."]],
"Travel":[["flight","vol","A plane journey","My flight leaves at seven."],["luggage","bagages","Bags for travel","My luggage is heavy."],["reservation","réservation","A booking","I have a reservation."],["delay","retard","Late departure or arrival","There is a delay."]],
"Work & Studies":[["training","formation","Learning programme","I have English training."],["deadline","date limite","Final date","The deadline is tomorrow."],["skills","compétences","Abilities","I want to improve my skills."],["teamwork","travail d’équipe","Working with others","Teamwork is important."]],
"Connectors":[["because","parce que","Reason","I study because I need English."],["so","donc","Result","I practise, so I improve."],["however","cependant","Contrast","It is difficult. However, I try."],["finally","enfin","Last point","Finally, I thanked the guest."]]
};

function update(n){score+=n;$("score").textContent=score}
function speak(text){if(!("speechSynthesis" in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text||"").replace(/\s+/g," ").trim());u.lang=accent==="UK"?"en-GB":"en-US";u.rate=.92;speechSynthesis.speak(u)}
function quiz(hostId,data){const host=$(hostId); if(!host)return; host.innerHTML="";data.forEach(q=>{const d=document.createElement("div");d.className="quizItem";d.innerHTML=`<strong>${q.q}</strong><div class="choices"></div><p class="feedback"></p>`;const c=d.querySelector(".choices");q.a.forEach(a=>{const b=document.createElement("button");b.type="button";b.className="choice";b.textContent=a;b.onclick=()=>{const ok=a===q.good;b.classList.add(ok?"good":"bad");const fb=d.querySelector(".feedback");fb.className="feedback "+(ok?"good":"bad");fb.textContent=ok?"✅ Correct":"💡 Try again";if(ok&&!d.dataset.done){d.dataset.done=1;update(2)}};c.appendChild(b)});host.appendChild(d)})}
function fill(hostId,data){const host=$(hostId); if(!host)return; host.innerHTML="";data.forEach(q=>{const d=document.createElement("div");d.className="fillItem";d.innerHTML=`<p>${q.q}</p><input><button class="btn primary" type="button">Check</button><p class="feedback"></p>`;d.querySelector("button").onclick=()=>{const val=d.querySelector("input").value.toLowerCase().trim();const ok=q.good.some(x=>val.includes(x));const fb=d.querySelector(".feedback");fb.className="feedback "+(ok?"good":"bad");fb.textContent=ok?"✅ Good":"💡 Suggested: "+q.good[0];if(ok)update(2)};host.appendChild(d)})}
function renderTabs(){const tabs=$("vocabTabs");Object.keys(vocab).forEach((cat,i)=>{const b=document.createElement("button");b.className="tab"+(i===0?" active":"");b.type="button";b.textContent=cat;b.onclick=()=>{$$(".tab",tabs).forEach(x=>x.classList.remove("active"));b.classList.add("active");renderVocab(cat)};tabs.appendChild(b)});renderVocab(Object.keys(vocab)[0])}
function renderVocab(cat){const host=$("vocabGrid");host.innerHTML="";vocab[cat].forEach(v=>{const d=document.createElement("div");d.className="vocab";d.innerHTML=`<h3>${v[0]}</h3><p class="hidden"><strong>FR:</strong> ${v[1]}</p><p class="hidden"><strong>Definition:</strong> ${v[2]}</p><p class="hidden">${v[3]}</p><button class="btn" type="button">🔊 Listen</button>`;d.onclick=e=>{if(e.target.tagName==="BUTTON"){speak(v[0]+". "+v[3]);update(1);return}$$(".hidden",d).forEach(x=>x.classList.toggle("hidden"))};host.appendChild(d)})}
function wordBuilder(){const target="I have worked with customers and I would like to work at Disney.";let built=[];function render(){built=[];$("mockWordBank").innerHTML="";$("mockAnswerBank").innerHTML="";target.split(" ").sort(()=>Math.random()-.5).forEach(w=>{const b=document.createElement("button");b.className="word";b.type="button";b.textContent=w;b.onclick=()=>{built.push(w);$("mockAnswerBank").appendChild(b)};$("mockWordBank").appendChild(b)});$("mockBuilderFeedback").textContent=""} $("checkMockBuilder").onclick=()=>{const ok=built.join(" ")===target;$("mockBuilderFeedback").className="feedback "+(ok?"good":"bad");$("mockBuilderFeedback").textContent=ok?"✅ Perfect sentence!":"💡 Target: "+target;if(ok)update(4)};$("resetMockBuilder").onclick=render;render()}
function setupTimer(){function show(){const m=String(Math.floor(seconds/60)).padStart(2,"0"),s=String(seconds%60).padStart(2,"0");$("timer").textContent=m+":"+s}$("startTimer").onclick=()=>{clearInterval(timerInt);timerInt=setInterval(()=>{seconds--;show();if(seconds<=0)clearInterval(timerInt)},1000)};$("resetTimer").onclick=()=>{clearInterval(timerInt);seconds=1500;show()};show()}
function setupRecorder(){if(!navigator.mediaDevices){$("recStatus").textContent="Recording is not available in this browser.";return}$("startRec").onclick=async()=>{try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>chunks.push(e.data);mediaRecorder.onstop=()=>{const blob=new Blob(chunks,{type:"audio/webm"});const url=URL.createObjectURL(blob);$("audioPlayback").src=url;$("downloadRec").href=url;$("downloadRec").classList.remove("hidden");stream.getTracks().forEach(t=>t.stop())};mediaRecorder.start();$("startRec").disabled=true;$("stopRec").disabled=false;$("recStatus").textContent="Recording..."}catch(e){$("recStatus").textContent="Microphone permission was not granted."}};$("stopRec").onclick=()=>{if(mediaRecorder&&mediaRecorder.state==="recording"){mediaRecorder.stop();$("startRec").disabled=false;$("stopRec").disabled=true;$("recStatus").textContent="Recording saved. You can listen or download it."}}}
function checkText(id,fbId,words,threshold,msgGood,msgBad){const t=$(id).value.toLowerCase();let pts=0;words.forEach(w=>{if(t.includes(w))pts++});const fb=$(fbId);fb.className="feedback "+(pts>=threshold?"good":"bad");fb.textContent=pts>=threshold?msgGood:msgBad;update(pts)}
function init(){
$("usBtn").onclick=()=>{accent="US";$("usBtn").classList.add("active");$("ukBtn").classList.remove("active")};
$("ukBtn").onclick=()=>{accent="UK";$("ukBtn").classList.add("active");$("usBtn").classList.remove("active")};
$("resetBtn").onclick=()=>location.reload();
document.addEventListener("click",e=>{if(e.target.dataset.speak)speak(e.target.dataset.speak);if(e.target.dataset.listen)speak($(e.target.dataset.listen).value);if(e.target.dataset.toggle)$(e.target.dataset.toggle).classList.toggle("hidden")});
renderTabs();
$("listenVocab").onclick=()=>{const cat=$(".tab.active",$("vocabTabs")).textContent;speak(vocab[cat].map(v=>v[0]+". "+v[3]).join(" "))};
quiz("grammarQuiz",[{q:"Yesterday, you ___ English.",a:["practised","have practised","are practising"],good:"practised"},{q:"You ___ worked with customers before.",a:["have","did","are"],good:"have"},{q:"Right now, you ___ improving your English.",a:["are","have","did"],good:"are"}]);
quiz("mockGrammarQuiz",[
{q:"1. Yesterday, you ___ English.",a:["practised","have practised","are practising"],good:"practised"},
{q:"2. You ___ worked with customers before.",a:["have","did","are"],good:"have"},
{q:"3. If a guest is lost, you ___ help them.",a:["will","worked","have"],good:"will"},
{q:"4. You ___ check the app for wait times.",a:["should","did","are"],good:"should"},
{q:"5. Right now, you ___ improving your English.",a:["are","have","did"],good:"are"},
{q:"6. You usually ___ hard during lessons.",a:["work","worked","are work"],good:"work"},
{q:"7. You would like ___ at Disney.",a:["to work","working","work"],good:"to work"},
{q:"8. Have you ___ visited London?",a:["ever","last","ago"],good:"ever"},
{q:"9. Last year, you ___ Disneyland Paris.",a:["visited","have visited","visit"],good:"visited"},
{q:"10. You enjoy ___ people.",a:["helping","to helping","help"],good:"helping"},
{q:"11. She ___ patient with customers.",a:["is","has","does"],good:"is"},
{q:"12. You ___ never worked at Disney before.",a:["have","did","are"],good:"have"}]);
fill("mockFillQuiz",[
{q:"1. You have studied English ___ several months.",good:["for"]},
{q:"2. You have studied English ___ January.",good:["since"]},
{q:"3. Did you ___ at Carrefour last year?",good:["work"]},
{q:"4. You would like ___ work at Disney.",good:["to"]},
{q:"5. You enjoy ___ guests.",good:["helping"]},
{q:"6. Yesterday, you ___ new vocabulary.",good:["learned","learnt"]},
{q:"7. You have never ___ at Disney.",good:["worked"]},
{q:"8. If a customer is upset, you ___ stay calm.",good:["will","should"]}]);
quiz("mockVocabQuiz",[
{q:"1. A receipt is...",a:["proof of payment","a travel bag","a meeting"],good:"proof of payment"},
{q:"2. The best polite sentence is...",a:["May I help you?","You want?","Go there."],good:"May I help you?"},
{q:"3. A queue is...",a:["a line of people waiting","a ticket","a shop"],good:"a line of people waiting"},
{q:"4. If a product is unavailable, it means...",a:["you cannot get it now","it is free","it is expensive"],good:"you cannot get it now"},
{q:"5. A supervisor is...",a:["a person in charge","a child","a souvenir"],good:"a person in charge"},
{q:"6. A delay means...",a:["something is late","something is early","something is broken"],good:"something is late"},
{q:"7. To apologise means...",a:["to say sorry","to buy","to travel"],good:"to say sorry"},
{q:"8. A deadline is...",a:["a final date","a type of food","a family member"],good:"a final date"}]);
wordBuilder();
quiz("mockReadingQuiz",[
{q:"1. Why will the park be busy?",a:["Because of a special event","Because of rain","Because it is closed"],good:"Because of a special event"},
{q:"2. What should you check?",a:["Your uniform","Your hotel","Your passport"],good:"Your uniform"},
{q:"3. How should you help guests with directions?",a:["Show them on the map","Tell them to leave","Ignore them"],good:"Show them on the map"},
{q:"4. What should you do if there is a problem?",a:["Contact your supervisor","Go home","Wait silently"],good:"Contact your supervisor"}]);
quiz("mockListeningQuiz",[
{q:"1. What did the customer buy?",a:["A sweatshirt","A ticket","A meal"],good:"A sweatshirt"},
{q:"2. What is the problem?",a:["It is too small","It is too expensive","It is lost"],good:"It is too small"},
{q:"3. What does the customer want?",a:["An exchange","Directions","A refund only"],good:"An exchange"}]);
$("checkMockWriting").onclick=()=>checkText("mockWriting","mockWritingFeedback",["dear","sorry","inconvenience","closed","because","could","attraction","thank"],4,"✨ Good exam-style email!","💡 Add greeting, apology, explanation and solution.");
$("checkMockSpeaking").onclick=()=>checkText("mockSpeakingNotes","mockSpeakingFeedback",["name","worked","customers","english","future","disney","motivated","experience"],4,"✨ Strong speaking preparation!","💡 Add introduction, experience, quality and future goal.");
$("generateMockReport").onclick=()=>{$("mockReportOutput").innerHTML="<h3>Mini-Mock Complete 🏰✨</h3><p><strong>Practice score:</strong> "+score+"</p><p>You practised grammar, verbs, vocabulary, reading, listening, writing and speaking.</p><p><strong>Next focus:</strong> record your oral answer and compare it with the B1/B1+ models.</p>"};
$("generateReport").onclick=()=>{$("reportOutput").innerHTML="<h3>Congratulations, Angie! 🏰✨</h3><p>You completed a VTest-style practice session.</p><p><strong>Current practice score:</strong> "+score+"</p><p>Grammar ⭐⭐⭐⭐☆<br>Vocabulary ⭐⭐⭐⭐☆<br>Reading ⭐⭐⭐⭐☆<br>Listening ⭐⭐⭐⭐☆<br>Writing ⭐⭐⭐⭐☆<br>Speaking ⭐⭐⭐⭐☆<br>Confidence ⭐⭐⭐⭐⭐</p><p>Communication is more important than perfection.</p>"};
setupTimer();setupRecorder();
}
document.addEventListener("DOMContentLoaded",init);
})();