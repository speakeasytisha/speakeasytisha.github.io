const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const state={listen:{},reform:{},follow:{},connector:{},scenario:0,listenTab:0};

const vocab={
 transport:[
  ["service change","changement de service","The app shows a service change on the 1 line."],
  ["skip a stop","ne pas desservir un arrêt","This train is skipping 50th Street."],
  ["local train","métro omnibus","Take the local if you need the next stop."],
  ["express train","métro express","The express skips several local stops."],
  ["transfer","changer / correspondance","Transfer to the A at 59th Street."],
  ["platform","quai","Which platform do I need?"]
 ],
 timing:[
  ["run late","être en retard","We’re running about twenty minutes late."],
  ["ahead of schedule","en avance sur l’horaire","We arrived ahead of schedule."],
  ["time slot","créneau horaire","Our time slot is at 4:30."],
  ["allow enough time","prévoir assez de temps","Allow enough time for security."],
  ["make it on time","arriver à l’heure","Do you think we can make it on time?"],
  ["push back","repousser / décaler","Could we push the reservation back by thirty minutes?"]
 ],
 problem:[
  ["mix-up","petite erreur / confusion","I think there’s been a mix-up with the reservation."],
  ["not showing up","ne pas apparaître","The booking isn’t showing up in the system."],
  ["not going through","ne pas passer / fonctionner","The payment isn’t going through."],
  ["sold out","complet","The evening time slots are sold out."],
  ["closed off","fermé / inaccessible","That entrance is closed off."],
  ["unexpected","imprévu","We had an unexpected delay."]
 ],
 solution:[
  ["another option","une autre option","Is there another option?"],
  ["work around it","contourner le problème","We can work around it."],
  ["leave it here","le laisser ici","Could we leave the luggage here?"],
  ["move it to…","le déplacer à…","Could we move it to tomorrow?"],
  ["switch to…","passer à / changer pour","We can switch to the local train."],
  ["make a new booking","faire une nouvelle réservation","Do we need to make a new booking?"]
 ],
 clarify:[
  ["Just to make sure…","juste pour être sûr(e)…","Just to make sure, I change at 72nd, right?"],
  ["Do you mean…?","vous voulez dire… ?","Do you mean the entrance on Seventh Avenue?"],
  ["Did you say…?","vous avez dit… ?","Did you say 7:50 or 8:15?"],
  ["So if I understand correctly…","donc si je comprends bien…","So if I understand correctly, the ticket is still valid."],
  ["Could you go over that again?","pourriez-vous reprendre ça ?","Could you go over that again a little more slowly?"],
  ["Which part…?","quelle partie… ?","Which part of the reservation needs to change?"]
 ],
 confirm:[
  ["That works for me.","Ça me convient.","Four o’clock? That works for me."],
  ["Perfect, I’ll do that.","Parfait, je vais faire ça.","Perfect, I’ll do that. Thanks."],
  ["So the plan is…","Donc le plan est…","So the plan is to come back after five."],
  ["I’ve got it.","J’ai compris.","Okay, I’ve got it now."],
  ["That should be fine.","Ça devrait aller.","Ten minutes later? That should be fine."],
  ["Thanks for letting me know.","Merci de m’avoir prévenu(e).","Thanks for letting me know about the change."]
 ]
};

const listening=[
 {name:"Subway",icon:"🚇",text:"Just a heads-up: downtown A trains are skipping 50th Street because of track work. If you need 50th Street, get off at 59th and take an uptown local train one stop.",qs:[
  ["What is the key change?","The A is skipping 50th Street.",["The A is skipping 50th Street.","All A trains are cancelled.","50th Street is closed all day."]],
  ["What action should you take?","Change at 59th and go back one stop.",["Walk from Times Square.","Change at 59th and go back one stop.","Take any downtown train."]]
 ]},
 {name:"Hotel",icon:"🏨",text:"I’m sorry, housekeeping is running behind today, so your room probably won’t be ready until around five. We can store your luggage here, and I can text you as soon as the room is available.",qs:[
  ["Why is the room late?","Housekeeping is behind.",["The room has been cancelled.","Housekeeping is behind.","The hotel is overbooked."]],
  ["What does the hotel offer?","Store the luggage and send a text.",["A different hotel.","A free dinner.","Store the luggage and send a text."]]
 ]},
 {name:"Restaurant",icon:"🍽",text:"I found your booking, but it’s actually for tomorrow at seven-thirty, not tonight. We’re full at the moment, but I can put you on the waitlist. It would probably be about thirty minutes.",qs:[
  ["What is the booking problem?","It is booked for tomorrow.",["It is under another name.","It is booked for tomorrow.","The booking was cancelled."]],
  ["What solution is offered?","A waitlist of about 30 minutes.",["A table immediately.","A waitlist of about 30 minutes.","A takeaway meal."]]
 ]}
];

const reform=[
 {q:"You forget the word “turnstile.” What is the best way to keep speaking?",a:"It’s the gate you go through before you enter the subway.",o:["I don’t know. Stop.","It’s the gate you go through before you enter the subway.","How do you say tourniquet?"]},
 {q:"You cannot remember “receipt.”",a:"I don’t know the exact word, but I mean the paper that shows what I paid.",o:["I don’t know the exact word, but I mean the paper that shows what I paid.","I cannot continue.","Give me the facture."]},
 {q:"Your listener did not understand your first explanation.",a:"Let me put it another way.",o:["No, you don’t understand.","Let me put it another way.","Forget it."]},
 {q:"You want to explain the idea of a ‘time slot’.",a:"It’s the specific time you reserve to enter.",o:["It is a timing square.","It’s the specific time you reserve to enter.","It is an hour thing."]},
];

const follow=[
 {q:"Reception: “Your room will be ready at five.” Which response keeps the interaction moving?",a:"Okay, thanks. Can we leave our bags here until then?",o:["Okay.","Okay, thanks. Can we leave our bags here until then?","Five."]},
 {q:"Local: “Take the uptown C and get off at 81st.” Best continuation?",a:"Great, thanks. Is 81st the stop for the museum?",o:["Thanks.","Great, thanks. Is 81st the stop for the museum?","C train."]},
 {q:"Server: “It’ll be about a 25-minute wait.” Best response?",a:"That’s fine. Could we wait at the bar and keep our place?",o:["No.","That’s fine. Could we wait at the bar and keep our place?","Twenty-five?"]},
];

const connector=[
 {q:"The room isn’t ready, ___ we can leave our bags at reception.",a:"so",o:["because","so","if"]},
 {q:"I’d choose the subway ___ it’s much cheaper.",a:"because",o:["because","however","so"]},
 {q:"The taxi is quicker, ___ it costs much more.",a:"but",o:["because","if","but"]},
 {q:"___ we miss this train, we can take the next one.",a:"If",o:["So","If","Because"]},
];

const scenarios=[
 {name:"Wrong platform",icon:"🚇",audio:"No, this platform is downtown only. For uptown trains, cross the street and use the entrance on the other side.",prompt:"You realize you are at the wrong entrance. Confirm where to go and ask whether you need to pay again.",bank:["So I need to cross the street…","Is the entrance on the other side?","Do I need to tap again?","Just to make sure…"],model:"Okay, thanks. So I need to cross the street and use the entrance on the other side for uptown trains, right? Do I need to tap again when I go in?"},
 {name:"Late check-in",icon:"🏨",audio:"That’s no problem. The front desk is staffed all night, but after eleven you’ll need to use the intercom by the main entrance.",prompt:"You will arrive after 11 p.m. Confirm how to enter and what information you should give.",bank:["We’ll arrive after eleven.","How do we get in?","Should I give my name?","So we use the intercom…"],model:"Great, thank you. We’ll probably arrive around 11:30. So we use the intercom at the main entrance—do I just give my name and reservation number?"},
 {name:"Table unavailable",icon:"🍽",audio:"I’m sorry, the terrace is closed because of the weather. I can seat you inside now, or I can keep the terrace request and move your booking to tomorrow.",prompt:"Choose one option, explain why, and confirm the new plan.",bank:["That’s okay.","We’d rather…","because…","So the reservation stays…"],model:"That’s okay. We’d rather eat inside tonight because tomorrow we already have plans. So the reservation stays at the same time, but the table will be inside, right?"},
 {name:"Ticket problem",icon:"🎟",audio:"Your ticket is valid, but the barcode on the screenshot won’t scan. Open the original email and tap the link to load the live ticket.",prompt:"Explain what you understood and ask what to do if the link does not work.",bank:["So the ticket is still valid…","I need to open…","What if…?","Would the booking number work?"],model:"Okay, so the ticket is still valid, but I need to open the original email and use the live ticket. What should I do if the link still doesn’t load? Would the booking number be enough?"},
 {name:"Ride pickup",icon:"🚕",audio:"Your driver can’t stop directly in front of the theatre. Walk to the corner of Eighth Avenue and 45th Street. The car will be there in about four minutes.",prompt:"Repeat the pickup point, ask which corner, and confirm the timing.",bank:["Eighth Avenue and 45th…","Which corner exactly?","about four minutes","I’ll head there now."],model:"Okay, the pickup is at Eighth Avenue and 45th Street. Which corner exactly? And the driver should be there in about four minutes, right? I’ll head there now."},
 {name:"Changed appointment",icon:"📅",audio:"The appointment has been moved from two-thirty to three-fifteen. If that’s too late, we can offer eleven-thirty tomorrow morning instead.",prompt:"Say which option works better and explain why.",bank:["Three-fifteen works…","Tomorrow would be better…","because…","Can you confirm…?"],model:"Three-fifteen should be fine because we don’t have anything planned until the evening. Could you confirm that the appointment is now at 3:15 today?"}
];

function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function speak(text,rate){
 if(!("speechSynthesis" in window)){alert("Audio is not supported in this browser.");return}
 speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);u.lang="en-US";u.rate=rate||parseFloat($("#speedSelect").value);
 const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang==="en-US")||voices.find(v=>v.lang.startsWith("en"))||null;speechSynthesis.speak(u);
}
function bindSpeak(r=document){$$(".speak",r).forEach(b=>b.onclick=()=>speak(b.dataset.text))}
function renderVocab(){
 const c=$("#vocabCategory").value;
 $("#vocabGrid").innerHTML=vocab[c].map(x=>`<article class="vocab-card"><h3>${x[0]}</h3><div class="fr">${x[1]}</div><p>${x[2]}</p><button class="secondary v-audio" data-t="${encodeURIComponent(x[0]+". "+x[2])}">🔊 Listen</button></article>`).join("");
 $$(".v-audio").forEach(b=>b.onclick=()=>speak(decodeURIComponent(b.dataset.t)));
}
function makeQuiz(data,root,prefix,stateObj){
 $(root).innerHTML=data.map((x,i)=>`<article class="quiz-card"><p><b>${i+1}.</b> ${x.q}</p><div class="options">${shuffle(x.o).map(o=>`<button class="option" data-i="${i}" data-v="${encodeURIComponent(o)}">${o}</button>`).join("")}</div><div id="${prefix}${i}" class="feedback"></div></article>`).join("");
 $$(`${root} .option`).forEach(b=>b.onclick=()=>{
   const i=+b.dataset.i,v=decodeURIComponent(b.dataset.v),ok=v===data[i].a; stateObj[i]=ok;
   const card=b.closest(".quiz-card");$$(".option",card).forEach(x=>{x.disabled=true;if(decodeURIComponent(x.dataset.v)===data[i].a)x.classList.add("correct")});if(!ok)b.classList.add("wrong");
   $("#"+prefix+i).textContent=ok?"✓ Correct.":"Not quite. The best answer is highlighted.";$("#"+prefix+i).className="feedback "+(ok?"good":"bad");update();
 });
}
function renderListening(){
 $("#listenTabs").innerHTML=listening.map((x,i)=>`<button class="listen-tab ${i===state.listenTab?"active":""}" data-i="${i}">${x.icon} ${x.name}</button>`).join("");
 const L=listening[state.listenTab];
 $("#listenStage").innerHTML=`<div class="listen-card"><div class="listen-actions"><button class="primary play-listen">▶ Play once</button><button class="secondary transcript-btn">Show transcript</button></div><div class="transcript hidden">${L.text}</div><div class="quiz-stack">${L.qs.map((q,j)=>`<article class="quiz-card"><p>${q[0]}</p><div class="options">${shuffle(q[2]).map(o=>`<button class="option lopt" data-j="${j}" data-v="${encodeURIComponent(o)}">${o}</button>`).join("")}</div><div class="feedback lf${j}"></div></article>`).join("")}</div></div>`;
 $(".play-listen").onclick=()=>speak(L.text);
 $(".transcript-btn").onclick=()=>{const t=$(".transcript");t.classList.toggle("hidden");$(".transcript-btn").textContent=t.classList.contains("hidden")?"Show transcript":"Hide transcript"};
 $$(".lopt").forEach(b=>b.onclick=()=>{
   const j=+b.dataset.j,v=decodeURIComponent(b.dataset.v),ok=v===L.qs[j][1];state.listen[state.listenTab+"-"+j]=ok;
   const card=b.closest(".quiz-card");$$(".option",card).forEach(x=>{x.disabled=true;if(decodeURIComponent(x.dataset.v)===L.qs[j][1])x.classList.add("correct")});if(!ok)b.classList.add("wrong");
   $(".lf"+j,card).textContent=ok?"✓ Yes.":"Listen again for the action that changes.";$(".lf"+j,card).className="feedback "+(ok?"good":"bad");update();
 });
 $$(".listen-tab").forEach(b=>b.onclick=()=>{state.listenTab=+b.dataset.i;renderListening()});
}
function renderScenarios(){
 $("#scenarioTabs").innerHTML=scenarios.map((s,i)=>`<button class="scenario-tab ${i===state.scenario?"active":""}" data-i="${i}">${s.icon} ${s.name}</button>`).join("");
 const s=scenarios[state.scenario];
 $("#scenarioStage").innerHTML=`<div class="scenario-layout"><div><p class="micro">${s.icon} ${s.name}</p><h3>${s.prompt}</h3><button class="primary scenario-audio">▶ Hear new information</button><h4>Useful building blocks</h4><div class="phrase-bank">${s.bank.map(x=>`<span>${x}</span>`).join("")}</div></div><div><textarea rows="7" placeholder="Build your response in your own words..."></textarea><details class="model practice-support"><summary>Natural model</summary><p>${s.model}</p></details><label class="score-line">Speaking score / 10 <input type="number" min="0" max="10"></label></div></div>`;
 $(".scenario-audio").onclick=()=>speak(s.audio);
 $$(".scenario-tab").forEach(b=>b.onclick=()=>{state.scenario=+b.dataset.i;renderScenarios()});
}
function timer(){
 let n=90,id=null;const paint=()=>$("#timer").textContent=`${String(Math.floor(n/60)).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`;
 $("#timerStart").onclick=()=>{if(id)return;id=setInterval(()=>{n--;paint();if(n<=0){clearInterval(id);id=null;speak("Time is up.",.9)}},1000)};
 $("#timerReset").onclick=()=>{clearInterval(id);id=null;n=90;paint()};paint();
}
function update(){
 const textIds=["warm1","warm2","warm3","writeA","writeB","sprint1","sprint2","sprint3","sprint4","finalAnswer","easier","again"];
 const doneText=textIds.filter(id=>$("#"+id)?.value.trim()).length;
 const evals=$$(".eval").filter(x=>x.value).length;
 const doneQuiz=Object.keys(state.listen).length+Object.keys(state.reform).length+Object.keys(state.follow).length+Object.keys(state.connector).length;
 const total=12+6+4+3+4;const pct=Math.min(100,Math.round((doneText+evals+doneQuiz)/total*100));
 $("#progressBar").style.width=pct+"%";$("#progressText").textContent=pct+"% complete";
}
function download(name,text,type="text/plain"){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function toolkit(){
 return `NEW YORK REAL TALK · THINK FAST, SPEAK CLEARLY

LISTEN FOR:
• What changed?
• What action do I need?
• What time / place / number matters?

REFORMULATE:
• What I mean is…
• I don't know the exact word, but…
• It's the thing you use to…
• It's a place where…
• Let me put it another way.
• Basically…

KEEP THE INTERACTION MOVING:
Answer → Detail → Return
• Okay, that works for me. Do I need to…?
• I understand. So if I understand correctly…
• No problem. Would it be possible to…?
• Great. Just to make sure…

CONNECT YOUR IDEAS:
because = reason
so = result
but / however = contrast
if = condition / possible solution
`;
}
function report(){
 const evals=$$(".eval").map(e=>e.value||"Not completed");
 return `<!doctype html><html><head><meta charset="utf-8"><title>Lesson Results</title><style>body{font-family:Arial;max-width:850px;margin:40px auto;line-height:1.5}h1{color:#a91422}section{border:1px solid #ddd;padding:15px;border-radius:10px;margin:12px 0}</style></head><body><h1>New York Real Talk · Think Fast, Speak Clearly</h1><section><h2>Final score</h2><p>${$("#finalScore").value||"—"}/10</p></section><section><h2>Self-evaluation</h2><ul>${evals.map(x=>`<li>${x}</li>`).join("")}</ul></section><section><h2>Reflection</h2><p><b>Easier:</b> ${($("#easier").value||"—").replaceAll("<","&lt;")}</p><p><b>Practise again:</b> ${($("#again").value||"—").replaceAll("<","&lt;")}</p></section></body></html>`;
}
function init(){
 $("#jsWarning").style.display="none"; bindSpeak();
 $$("[data-scroll]").forEach(b=>b.onclick=()=>$(b.dataset.scroll).scrollIntoView({behavior:"smooth"}));
 $("#vocabCategory").onchange=renderVocab;
 $("#modeSelect").onchange=e=>document.body.classList.toggle("exam-mode",e.target.value==="exam");
 $$(".hint-btn").forEach(b=>b.onclick=()=>$("#"+b.dataset.hint).classList.toggle("hidden"));
 $("#resetBtn").onclick=()=>{if(confirm("Reset the lesson?"))location.reload()};
 ["warm1","warm2","warm3","writeA","writeB","sprint1","sprint2","sprint3","sprint4","finalAnswer","easier","again"].forEach(id=>$("#"+id).addEventListener("input",update));
 $$(".eval").forEach(e=>e.addEventListener("change",update));
 $$(".exam-audio").forEach(b=>b.onclick=()=>speak(b.dataset.text));
 $("#downloadToolkit").onclick=()=>download("NY_Think_Fast_Survival_Toolkit.txt",toolkit());
 $("#downloadReport").onclick=()=>download("NY_Think_Fast_Results.html",report(),"text/html");
 $("#printBtn").onclick=()=>window.print();
 renderVocab();renderListening();makeQuiz(reform,"#reformQuiz","rf",state.reform);makeQuiz(follow,"#followQuiz","ff",state.follow);makeQuiz(connector,"#connectorQuiz","cf",state.connector);renderScenarios();timer();update();
}
document.addEventListener("DOMContentLoaded",init);
