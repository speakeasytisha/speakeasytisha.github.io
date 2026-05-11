
function speak(text,lang='en-US'){
if(!text)return;

const utterance=new SpeechSynthesisUtterance(text);

utterance.lang=lang;
utterance.rate=0.92;

speechSynthesis.cancel();
speechSynthesis.speak(utterance);
}

function check(btn,correct){

const feedback=btn.parentElement.querySelector('.feedback');

if(correct){
feedback.innerHTML='✅ Excellent!';
feedback.style.color='#8fffd8';
}else{
feedback.innerHTML='💡 Try again!';
feedback.style.color='#ffd76a';
}

}

function normalize(text){
return text.toLowerCase().replace(/[.!?]/g,'').trim();
}

function checkSentence(inputId,expected){

const input=document.getElementById(inputId).value;
const feedback=document.getElementById('feedback-'+inputId);

if(normalize(input)===normalize(expected.toLowerCase())){
feedback.innerHTML='✅ Perfect!';
feedback.style.color='#8fffd8';
}else{
feedback.innerHTML='💡 Example: '+expected;
feedback.style.color='#ffd76a';
}

}

function checkInterview(){

const answer=document.getElementById('interview').value.toLowerCase();

const feedback=document.getElementById('interviewFeedback');

let score=0;

if(answer.includes('would like'))score++;
if(answer.includes('going to'))score++;
if(answer.includes('disney'))score++;
if(answer.length>100)score++;

if(score>=3){

feedback.innerHTML=`
<h3>✨ Great job!</h3>

<p>
Your answer sounds much more professional and organised.
You are beginning to sound more natural and confident.
</p>

<ul>
<li>✔ future goals</li>
<li>✔ professional vocabulary</li>
<li>✔ complete ideas</li>
<li>✔ better interview structure</li>
</ul>
`;

feedback.style.color='#8fffd8';

}else{

feedback.innerHTML=`
<h3>💡 Good start!</h3>

<p>
Try to:
</p>

<ul>
<li>use would like</li>
<li>talk about your future</li>
<li>describe your qualities</li>
<li>give reasons</li>
</ul>
`;

feedback.style.color='#ffd76a';

}

}
