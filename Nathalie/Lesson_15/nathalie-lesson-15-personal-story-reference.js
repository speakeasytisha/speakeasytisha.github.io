const comparisons=[
['I leave near Nantes.','I live near Nantes.','Live means habiter. Leave means partir.'],
['I borned in north France.','I was born in northern France.','Use was/were born. Born is not a regular past verb.'],
['I left two years in Senegal.','I lived in Senegal for two years.','Use lived for a place and for + a duration.'],
['I stopped my job for to travel.','I stopped working so that I could travel more.','Stop + -ing; use so that to explain your purpose.'],
['We are often going to Asia.','We often go to Asia.','Use the present simple for a regular habit.'],
['I like much the animals.','I really like animals. / I love animals.','Much does not normally follow like in this structure.'],
['three sheeps','three sheep','Sheep has the same singular and plural form.'],
['Very Wednesday','Every Wednesday','Every introduces a repeated day or routine.'],
['before to discovering','before discovering','Before is followed by a noun or an -ing form.'],
['My dream will feel more confident.','My dream is to feel more confident.','Use My dream is to + base verb.']
];
const pronunciation=[
['nature reserve','NAY-chuh ri-ZURV','a protected natural area'],
['great egret','great EE-gret','a large white wading bird'],
['childcare assistant','CHYLD-kair uh-SIS-tuhnt','your former profession'],
['granddaughter','GRAN-daw-tuh','your child’s daughter'],
['peaceful','PEESS-fuhl','calm and quiet'],
['percussion','puh-KUSH-uhn','instruments played by hitting'],
['sanctuary','SANGK-choo-uh-ree','a protected place for animals'],
['English-speaking','ING-glish SPEE-king','where English is commonly spoken'],
['confident','KON-fi-duhnt','sure of yourself'],
['understand','un-duh-STAND','know the meaning']
];
const questions=[
['Where do you live, and what is special about it?','I live in La Chevrolière, near Nantes. It is close to Lake Grand-Lieu, a beautiful nature reserve with many birds.'],
['What did you do before you stopped working?','I worked as a childcare assistant in a hospital, a nursery and in people’s homes.'],
['Why did you stop working?','I stopped working when I was 60 so that I could travel more.'],
['Tell me about your family.','I’m married and have three children and one five-year-old granddaughter.'],
['What do you enjoy doing in your free time?','I enjoy walking, gardening, creative activities, African dance, percussion and travelling.'],
['Why do you like travelling to Asia?','I like the warm weather, the peaceful atmosphere and the kindness of the people.'],
['What do you like about British culture?','I enjoy the friendly atmosphere in pubs, where people meet, sing and spend time together.'],
['What animals do you have?','I have two cats, some chickens and three sheep because we have a large garden.'],
['What is your English goal?','My goal is to feel more confident speaking English and to understand spoken English more easily.']
];

document.querySelectorAll('[data-scroll]').forEach(b=>b.addEventListener('click',()=>document.querySelector(b.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));

document.getElementById('comparisonGrid').innerHTML=comparisons.map(x=>`<article class="comparison-card"><div class="before"><div class="label">Original</div>${x[0]}</div><div class="after"><div class="label">Natural English</div>${x[1]}</div><div class="why"><strong>Why?</strong> ${x[2]}</div></article>`).join('');
document.getElementById('pronunciationGrid').innerHTML=pronunciation.map((x,i)=>`<article class="pronunciation-card"><h3>${x[0]}</h3><p class="sound">${x[1]}</p><p>${x[2]}</p><button class="word-audio" data-word="${x[0]}">🔊 Listen</button></article>`).join('');
document.getElementById('questionGrid').innerHTML=questions.map(x=>`<article class="question-card"><h3>${x[0]}</h3><details><summary>Show model answer</summary><p>${x[1]}</p><button class="inline-speak" data-text="${x[1].replace(/"/g,'&quot;')}">🔊 Listen</button></details></article>`).join('');

function speak(text){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=document.getElementById('accent').value;u.rate=.9;const voices=speechSynthesis.getVoices();const exact=voices.find(v=>v.lang===u.lang)||voices.find(v=>v.lang.startsWith(u.lang.slice(0,2)));if(exact)u.voice=exact;speechSynthesis.speak(u)}
document.addEventListener('click',e=>{if(e.target.matches('.speak-btn')){const el=document.getElementById(e.target.dataset.speak);speak(el.innerText)}if(e.target.matches('.word-audio'))speak(e.target.dataset.word);if(e.target.matches('.inline-speak'))speak(e.target.dataset.text);if(e.target.matches('.copy-btn'))copyText(document.getElementById(e.target.dataset.copy).innerText,e.target)});
document.getElementById('stopAudio').onclick=()=>speechSynthesis.cancel();

function copyText(text,button){navigator.clipboard.writeText(text).then(()=>{const old=button.textContent;button.textContent='✅ Copied';setTimeout(()=>button.textContent=old,1400)}).catch(()=>alert('Copy was not available. Please select the text manually.'))}

document.querySelectorAll('.model-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.model-tab').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.model-card').forEach(c=>c.classList.remove('active'));btn.classList.add('active');document.getElementById('model-'+btn.dataset.model).classList.add('active')}));

document.getElementById('frenchMode').addEventListener('change',e=>document.body.classList.toggle('hidden-fr',e.target.value==='hide'));
document.getElementById('printTop').onclick=()=>window.print();
document.getElementById('printQuick').onclick=()=>{document.body.classList.add('print-quick');window.print();setTimeout(()=>document.body.classList.remove('print-quick'),500)};

document.getElementById('copyQuick').onclick=e=>copyText(document.getElementById('quickReference').innerText,e.target);

function evaluationText(){return `NATHALIE — LESSON 15 PERSONAL STORY REFERENCE\nDate: ${new Date().toLocaleDateString('fr-FR')}\n\nI can identify my main corrections: ${document.getElementById('evalCorrections').value}\nI can present myself at A2 level: ${document.getElementById('evalA2').value}\nI can add B1 details: ${document.getElementById('evalB1').value}\nI feel more confident: ${document.getElementById('evalConfidence').value}\n\nComments:\n${document.getElementById('evalComments').value||'No comments.'}`}
document.getElementById('copyEvaluation').onclick=e=>{copyText(evaluationText(),e.target);document.getElementById('evalFeedback').textContent='Your evaluation has been copied.'};
document.getElementById('downloadEvaluation').onclick=()=>{const blob=new Blob([evaluationText()],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Nathalie-Lesson-15-Reference-Evaluation.txt';a.click();URL.revokeObjectURL(a.href);document.getElementById('evalFeedback').textContent='Your evaluation file has been downloaded.'};
