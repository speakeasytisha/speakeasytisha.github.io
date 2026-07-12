const frToggle=document.getElementById('frToggle');
frToggle.setAttribute('aria-pressed','true');
frToggle.addEventListener('click',()=>{
  const isOn=frToggle.classList.toggle('active');
  document.querySelectorAll('.fr').forEach(x=>x.classList.toggle('hidden',!isOn));
  frToggle.textContent=isOn?'🇫🇷 French help: ON':'🇫🇷 French help: OFF';
  frToggle.setAttribute('aria-pressed',String(isOn));
});
function speak(text){if(!('speechSynthesis'in window))return alert('Audio is not available in this browser.');speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-GB';u.rate=.82;u.pitch=1;const voices=speechSynthesis.getVoices();const gb=voices.find(v=>/^en-GB/i.test(v.lang)); if(gb) u.voice=gb; speechSynthesis.speak(u)}
document.querySelectorAll('[data-say]').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.say)));
document.getElementById('playCall').addEventListener('click',()=>speak('Hello. This is the Club South manager. We have eleven new memberships this week and seven cancellations. Thank you. Is there a problem at the club? Yes. One treadmill is not working. I need to contact maintenance today. OK. Please send me an update tomorrow morning.'));
const shuffle=a=>{let b=[...a];for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
const choiceData={
 ps1:{correct:'The club manager checks the weekly figures on Friday.',options:['The club manager check the weekly figures on Friday.','The club manager checks the weekly figures on Friday.','The club manager is check the weekly figures on Friday.'],why:'With “the club manager” (he/she), use checks.'},
 hto1:{correct:'need to',options:['need to','needs to','need'],why:'After I, use “need to + base verb”: I need to call.'},
 many1:{correct:'There are 18 new memberships.',options:['There are 18 new memberships.','There is 18 new memberships.','There are 18 new membership.'],why:'“Memberships” is plural, so use “There are”.'},
 report1:{correct:'Club South has eleven new memberships and seven cancellations.',options:['Club South have eleven new memberships and seven cancellations.','Club South has eleven new memberships and seven cancellations.','Club South is having eleven new memberships and seven cancellations.'],why:'Club South = it, so use “has”.'},
 listen1:{correct:'11',options:['18','7','11'],why:'The manager says: “We have eleven new memberships.”'},
 listen2:{correct:'Contact maintenance today.',options:['Contact maintenance today.','Check the evening rota.','Prepare a new gym class.'],why:'One treadmill is not working, so the manager needs to contact maintenance.'}
};
Object.entries(choiceData).forEach(([id,data])=>{const ex=document.querySelector(`[data-choice="${id}"]`);const opt=ex.querySelector('.options');shuffle(data.options).forEach(o=>{let b=document.createElement('button');b.type='button';b.className='choice';b.textContent=o;b.addEventListener('click',()=>{if(ex.dataset.done)return;ex.dataset.done='1';const fb=ex.querySelector('.feedback');if(o===data.correct){b.classList.add('good');fb.textContent='✓ Correct. '+data.why;fb.className='feedback good'}else{b.classList.add('bad');[...opt.children].find(x=>x.textContent===data.correct).classList.add('good');fb.textContent='Try again mentally: '+data.why;fb.className='feedback bad'}});opt.appendChild(b)})});
const builders={
 b1:{answer:['I','manage','two','fitness','clubs.'],words:['clubs.','two','I','fitness','manage']},
 b2:{answer:['How','many','cancellations','are','there?'],words:['there?','many','cancellations','How','are']}
};
Object.entries(builders).forEach(([id,d])=>{const ex=document.querySelector(`[data-builder="${id}"]`),pool=ex.querySelector('.chips'),zone=ex.querySelector('.answer-zone'),fb=ex.querySelector('.feedback');function chip(t,inZone=false){const c=document.createElement('button');c.type='button';c.className='chip';c.textContent=t;c.addEventListener('click',()=>{(c.parentElement===pool?zone:pool).appendChild(c)});return c}shuffle(d.words).forEach(w=>pool.appendChild(chip(w)));ex.querySelector('.check').addEventListener('click',()=>{const built=[...zone.children].map(x=>x.textContent);const ok=built.join(' ')===d.answer.join(' ');fb.textContent=ok?'✓ Excellent! '+d.answer.join(' '):'Not yet. Read the sentence slowly and check the word order.';fb.className=ok?'feedback good':'feedback bad'});ex.querySelector('.clear').addEventListener('click',()=>{[...zone.children].forEach(c=>pool.appendChild(c));fb.textContent='';fb.className='feedback'})});
const checks=[...document.querySelectorAll('#checklist input')];checks.forEach(c=>c.addEventListener('change',()=>{document.getElementById('pbar').style.width=(checks.filter(x=>x.checked).length/checks.length*100)+'%'}));