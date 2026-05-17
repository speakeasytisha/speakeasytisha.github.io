
(function(){

const $=id=>document.getElementById(id);

let score=0;
let accent='US';

function updateScore(n){
score+=n;
$('score').textContent=score;
}

function speak(text){
if(!('speechSynthesis' in window)) return;
speechSynthesis.cancel();
const u=new SpeechSynthesisUtterance(text);
u.lang=accent==='UK'?'en-GB':'en-US';
u.rate=.92;
speechSynthesis.speak(u);
}

$('usBtn').onclick=()=>{
accent='US';
$('usBtn').classList.add('active');
$('ukBtn').classList.remove('active');
};

$('ukBtn').onclick=()=>{
accent='UK';
$('ukBtn').classList.add('active');
$('usBtn').classList.remove('active');
};

document.addEventListener('click',e=>{
if(e.target.dataset.speak){
speak(e.target.dataset.speak);
}
});

function quiz(host,data){

host.innerHTML='';

data.forEach(q=>{

const div=document.createElement('div');
div.className='quizItem';

div.innerHTML='<strong>'+q.q+'</strong><div class="choices"></div><p class="feedback"></p>';

const c=div.querySelector('.choices');

q.a.forEach(ans=>{

const b=document.createElement('button');
b.className='choice';
b.textContent=ans;

b.onclick=()=>{

const ok=ans===q.good;

b.classList.add(ok?'good':'bad');

div.querySelector('.feedback').className='feedback '+(ok?'good':'bad');

div.querySelector('.feedback').textContent=ok?'✅ Great!':'💡 Try again.';

if(ok) updateScore(2);

};

c.appendChild(b);

});

host.appendChild(div);

});

}

quiz($('quiz'),[
{
q:'I ____ improve my English next year.',
a:['am going to','will to','going'],
good:'am going to'
},
{
q:'I think your English ____ improve quickly.',
a:['will','going to','am'],
good:'will'
},
{
q:'I ____ work at Disney one day.',
a:['am going to','going','am'],
good:'am going to'
}
]);

$('checkGuest').onclick=()=>{

const ok=
$('guest1').selectedIndex===1 &&
$('guest2').selectedIndex===1;

$('guestFeedback').className='feedback '+(ok?'good':'bad');

$('guestFeedback').textContent=ok?
'✅ Excellent future guest communication!':
'💡 Choose the professional future answers.';

if(ok) updateScore(6);

};

$('checkFuture').onclick=()=>{

const t=$('futureAnswer').value.toLowerCase();

let pts=0;

if(t.includes('going to')) pts++;
if(t.includes('will')) pts++;
if(t.includes('would like')) pts++;

$('futureFeedback').className='feedback '+(pts>=2?'good':'bad');

$('futureFeedback').textContent=pts>=2?
'✨ Great future communication!':
'💡 Add more future structures.';

updateScore(pts);

};

$('speakFuture').onclick=()=>{
speak($('futureAnswer').value);
};

$('buildRole').onclick=()=>{

const txt=
$('roleStart').value+' '+
$('roleMiddle').value+' '+
$('roleEnd').value;

$('roleOutput').textContent=txt;

updateScore(3);

};

$('speakRole').onclick=()=>{
speak($('roleOutput').textContent);
};

$('checkFinal').onclick=()=>{

const t=$('finalAnswer').value.toLowerCase();

let pts=0;

if(t.includes('will')) pts++;
if(t.includes('going to')) pts++;
if(t.includes('would like')) pts++;
if(t.includes('disney')) pts++;

$('finalFeedback').className='feedback '+(pts>=3?'good':'bad');

$('finalFeedback').textContent=pts>=3?
'✨ Excellent future communication!':
'💡 Add more future grammar structures.';

updateScore(pts);

};

})();
