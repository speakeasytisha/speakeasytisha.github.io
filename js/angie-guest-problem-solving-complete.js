(function(){
const $=id=>document.getElementById(id);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
let score=0, accent='US';
const vocab={
problems:[['😟','upset','contrarié(e)','The guest is upset.'],['🧒','lost child','enfant perdu','A lost child needs help.'],['⏳','delay','retard','There is a delay.'],['🚫','closed','fermé','The attraction is closed.'],['🎟️','lost ticket','billet perdu','The guest lost a ticket.'],['😨','worried','inquiet / inquiète','The family is worried.']],
reassure:[['😊','Don’t worry','Ne vous inquiétez pas','Don’t worry. I can help you.'],['🤝','I can help you','Je peux vous aider','I can help you find the castle.'],['🧘','stay calm','rester calme','I stay calm under pressure.'],['✨','solution','solution','Let me find a solution.'],['👂','listen carefully','écouter attentivement','I listen carefully to guests.'],['💬','speak politely','parler poliment','I speak politely with customers.']],
actions:[['🧭','show the way','montrer le chemin','I will show you the way.'],['🔎','check','vérifier','Let me check for you.'],['📞','call security','appeler la sécurité','I will call security.'],['🗺️','show on the map','montrer sur le plan','I can show you on the map.'],['➡️','follow me','suivez-moi','Please follow me.'],['⏱️','wait here','attendez ici','Please wait here.']],
boutique:[['🛍️','exchange','échange','You can exchange the item.'],['👕','another size','une autre taille','I can help you find another size.'],['🧾','receipt','ticket de caisse','Could you show me your receipt?'],['💳','payment problem','problème de paiement','Let me check the payment machine.'],['🎁','souvenir','souvenir','This is a popular souvenir.'],['💶','refund','remboursement','I will ask my manager about the refund.']]
};
const roleData={
lost:{prompt:'A family is lost and stressed.',choices:['Don’t worry.','I can help you.','Where would you like to go?','I can show you on the map.','Please follow me.'],model:'Don’t worry. I can help you. Where would you like to go? I can show you on the map. Please follow me.'},
closed:{prompt:'An attraction is closed and the guest is unhappy.',choices:['I’m sorry about that.','The attraction is temporarily closed.','I will help you find another attraction.','You can check the app for updates.','Thank you for your patience.'],model:'I’m sorry about that. The attraction is temporarily closed. I will help you find another attraction. You can check the app for updates.'},
child:{prompt:'A child is crying and cannot find their parents.',choices:['Don’t worry. You are safe.','I will stay with you.','I will call security.','Where did you last see your parents?','We will help you.'],model:'Don’t worry. You are safe. I will stay with you and I will call security. Where did you last see your parents?'},
shop:{prompt:'A customer wants an exchange.',choices:['Of course. I can help you.','Could you show me your receipt?','What size do you need?','Let me check for you.','I will ask my manager.'],model:'Of course. I can help you. Could you show me your receipt? What size do you need? Let me check for you.'}
};
function update(n){score+=n;$('score').textContent=score}
function speak(text){if(!('speechSynthesis' in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=accent==='UK'?'en-GB':'en-US';u.rate=.92;speechSynthesis.speak(u)}
document.addEventListener('click',e=>{if(e.target.dataset.speak)speak(e.target.dataset.speak);if(e.target.dataset.listen)speak($(e.target.dataset.listen).value);if(e.target.dataset.model)$(('model'+cap(e.target.dataset.model))).classList.toggle('hidden')});
$('usBtn').onclick=()=>{accent='US';$('usBtn').classList.add('active');$('ukBtn').classList.remove('active')};$('ukBtn').onclick=()=>{accent='UK';$('ukBtn').classList.add('active');$('usBtn').classList.remove('active')};$('resetBtn').onclick=()=>location.reload();
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1)}
function renderVocab(tab='problems'){const host=$('vocabGrid');host.innerHTML='';vocab[tab].forEach(v=>{const d=document.createElement('div');d.className='vocab';d.innerHTML=`<h3>${v[0]} ${v[1]}</h3><p class="hidden"><strong>FR:</strong> ${v[2]}</p><p class="hidden">${v[3]}</p><button class="btn">🔊 Listen</button>`;d.onclick=e=>{if(e.target.tagName==='BUTTON'){speak(v[1]+'. '+v[3]);return}$$('.hidden',d).forEach(x=>x.classList.toggle('hidden'))};host.appendChild(d)})}
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderVocab(b.dataset.tab)});renderVocab();$('listenVocab').onclick=()=>speak(vocab[$('.tab.active').dataset.tab].map(v=>v[1]+'. '+v[3]).join(' '));
function quiz(host,data){host.innerHTML='';data.forEach(q=>{const div=document.createElement('div');div.className='quizItem';div.innerHTML=`<strong>${q.q}</strong><div class="choices"></div><p class="feedback"></p>`;const wrap=div.querySelector('.choices');q.a.forEach(a=>{const b=document.createElement('button');b.className='choice';b.textContent=a;b.onclick=()=>{const ok=a===q.good;b.classList.add(ok?'good':'bad');const fb=div.querySelector('.feedback');fb.className='feedback '+(ok?'good':'bad');fb.textContent=ok?'✅ Great!':'💡 Try again.';if(ok)update(2)};wrap.appendChild(b)});host.appendChild(div)})}
quiz($('continuousQuiz'),[
{q:'Choose the correct sentence:',a:['I am helping a guest.','I helping guest.'],good:'I am helping a guest.'},
{q:'Choose the correct question:',a:['Are you waiting for someone?','You are waiting someone?'],good:'Are you waiting for someone?'},
{q:'Choose the correct sentence:',a:['The attraction is closing.','The attraction closing.'],good:'The attraction is closing.'}
]);
function fixes(host,items){host.innerHTML='';items.forEach((it,i)=>{const div=document.createElement('div');div.className='fixItem';div.innerHTML=`<p><strong>Fix:</strong> ${it.bad}</p><input><button class="btn primary">Check</button><p class="feedback"></p>`;div.querySelector('button').onclick=()=>{const ok=it.ok.some(x=>div.querySelector('input').value.toLowerCase().includes(x));const fb=div.querySelector('.feedback');fb.className='feedback '+(ok?'good':'bad');fb.textContent=ok?'✅ Correct!':'💡 Hint: '+it.hint;if(ok)update(2)};host.appendChild(div)})}
fixes($('continuousFix'),[
{bad:'I helping guest.',ok:['i am helping','i’m helping'],hint:'Use am + verb-ing.'},
{bad:'The family wait.',ok:['family is waiting','family are waiting'],hint:'Use is/are + waiting.'},
{bad:'She looking for castle.',ok:['she is looking'],hint:'Use she is looking.'}
]);
fixes($('imperativeFix'),[
{bad:'You wait here.',ok:['please wait here','wait here'],hint:'Start with the verb or Please + verb.'},
{bad:'You follow me.',ok:['please follow me','follow me'],hint:'Use imperative: Follow me.'},
{bad:'You don’t run.',ok:["don't run",'do not run'],hint:'Use Don’t + verb.'}
]);
function builder(host,target,words){host.innerHTML='<div class="wordBank"></div><div class="answerBank"></div><button class="btn primary">Check</button><button class="btn">Clear</button><p class="feedback"></p>';const bank=host.querySelector('.wordBank'),ans=host.querySelector('.answerBank');words.sort(()=>Math.random()-.5).forEach(w=>{const b=document.createElement('button');b.className='word';b.textContent=w;b.onclick=()=>ans.appendChild(b);bank.appendChild(b)});host.querySelectorAll('button')[words.length].onclick=()=>{const made=$$('.word',ans).map(x=>x.textContent).join(' ');const ok=made===target;const fb=host.querySelector('.feedback');fb.className='feedback '+(ok?'good':'bad');fb.textContent=ok?'✅ Perfect!':'💡 Target: '+target;if(ok)update(3)};host.querySelectorAll('button')[words.length+1].onclick=()=>builder(host,target,words)}
builder($('instructionBuilder'),'Please wait here.',['Please','wait','here.']);
quiz($('connectorQuiz'),[
{q:'The attraction is closed, ___ I will show you another ride.',a:['so','because','if'],good:'so'},
{q:'I can help you ___ I know the park.',a:['because','so','if'],good:'because'},
{q:'___ you need help, I can assist you.',a:['If','Because','So'],good:'If'}
]);
builder($('connectorBuilder'),'If you need help, I can assist you.',['If','you','need','help,','I','can','assist','you.']);
quiz($('reassureQuiz'),[
{q:'A guest is worried. Best answer:',a:["Don't worry. I can help you.",'Why are you worried?','Wait.'],good:"Don't worry. I can help you."},
{q:'A guest is upset about a delay. Best answer:',a:["I'm sorry. I will check for you.",'It is not my problem.','You wait.'],good:"I'm sorry. I will check for you."}
]);
function checkText(id,fbId,need,good,bad){const t=$(id).value.toLowerCase();let pts=0;need.forEach(n=>{if(t.includes(n))pts++});const fb=$(fbId);fb.className='feedback '+(pts>=good?'good':'bad');fb.textContent=pts>=good?bad[0]:bad[1];update(pts)}
window.checkFixes=()=>{};
document.querySelector('[data-check="lost"]').onclick=()=>checkText('scenarioLost','feedbackLost',["don't worry",'help','where'],2,['✅ Great reassuring language!','💡 Add reassurance + help + a question.']);
document.querySelector('[data-check="closed"]').onclick=()=>checkText('scenarioClosed','feedbackClosed',['sorry','closed','will','help'],2,['✨ Professional explanation!','💡 Add apology + explanation + solution.']);
$('checkShopSize').onclick=()=>{const ok=$('shopSize').selectedIndex===1;$('shopSizeFeedback').className='feedback '+(ok?'good':'bad');$('shopSizeFeedback').textContent=ok?'✅ Excellent customer service!':'💡 Choose the professional answer.';if(ok)update(3)};
$('checkShopPayment').onclick=()=>{const ok=$('shopPayment').selectedIndex===1;$('shopPaymentFeedback').className='feedback '+(ok?'good':'bad');$('shopPaymentFeedback').textContent=ok?'✅ Very professional.':'💡 Choose the polite solution.';if(ok)update(3)};
function renderRole(){const r=roleData[$('roleProblem').value];$('rolePrompt').textContent=r.prompt;const h=$('roleChoices');h.innerHTML='';r.choices.forEach(c=>{const d=document.createElement('button');d.className='choiceCard';d.textContent=c;d.onclick=()=>d.classList.toggle('selected');h.appendChild(d)});$('roleOutput').innerHTML=''}
$('roleProblem').onchange=renderRole;renderRole();$('resetRole').onclick=renderRole;$('buildRole').onclick=()=>{const r=roleData[$('roleProblem').value];const chosen=$$('.choiceCard.selected').map(x=>x.textContent).join(' ');$('roleOutput').innerHTML='<strong>Your answer:</strong><br>'+chosen+'<hr><strong>Model:</strong><br>'+r.model;if(chosen)update(3)};$('speakRole').onclick=()=>speak($('roleOutput').textContent);
$('checkInterview').onclick=()=>checkText('interviewAnswer','interviewFeedback',['calm','listen','help','solution'],2,['✨ Excellent interview answer!','💡 Add calm/listen/help/solution.']);
$('checkFinal').onclick=()=>checkText('finalAnswer','finalFeedback',['help','guest','will','can','if'],3,['🏰 Amazing work! You sound more professional.','💡 Add help, guest, will/can, and if.']);
})();