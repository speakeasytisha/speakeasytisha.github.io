(() => {
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let voiceLang='en-GB';

const grammar=[
 {tag:'PRESENT PERFECT',title:'Duration up to now',fr:'Depuis combien de temps…?',formula:'How long have you + past participle…?',examples:[
   'I have studied English for 3 months.',
   'I have lived in Saint-Gilles-Croix-de-Vie for fifty years.',
   'I have worked at the salon for thirteen years.'
 ],trap:'Use "for" + a length of time (for 3 months) and "since" + a starting point (since 2020). "How long" asks about duration, not a clock time.'},
 {tag:'PAST SIMPLE',title:'A finished moment',fr:'Un moment terminé',formula:'When did you + verb? · Did you + verb?',examples:[
   'When did you go to a restaurant for the last time? → I went to a restaurant last week.',
   'Did you enjoy your last holiday? → Yes, I did. / Yes, I enjoyed my last holiday.'
 ],trap:'"When did you go…?" is asking which day/period, so the answer should match — last week, last weekend — not a clock time like "at eight o\'clock".',fix:'Corrected: the answer now matches the question (a time period, not a clock time), and the stray question mark after "eight o\'clock" was removed.'},
 {tag:'PRESENT SIMPLE',title:'Routines and general facts',fr:'Les habitudes',formula:'Do + subject + verb? · question word + do + subject + verb?',examples:[
   'What do you usually do on Mondays? → I go to the beach on Mondays.',
   'When do you go to the supermarket? → I go to the supermarket on Tuesdays.',
   'Do you like seafood? → Yes, I do. / Yes, I like seafood.',
   'Do you like yoga? → Yes, I do. / I love yoga.'
 ],trap:'Don\'t forget "do/does" in the question, and keep the main verb in its base form: What do you do (not What you do).',fix:'Corrected: '},
 {tag:'PRESENT CONTINUOUS',title:'Right now',fr:'En ce moment',formula:'question word + are + subject + verb-ing? · Are you + verb-ing?',examples:[
   'What are you preparing right now? → I\'m preparing for my CLOE exam.',
   'Are you speaking English now? → We\'re speaking English now.',
   'What are you doing at the moment? → I\'m studying English now. I\'m taking the CLOE test now.',
   'Are you preparing for the CLOE exam? → Yes, I am preparing for the CLOE exam.'
 ],trap:'"now / right now / at the moment" signal the present continuous, not the present simple.',fix:'Corrected: '},
 {tag:'GOING TO',title:'Future plans already decided',fr:'Des projets déjà décidés',formula:'question word + are + you + going to + verb? · Are you going to + verb?',examples:[
   'Where are you going to travel in September? → I\'m going to travel to Sardinia in September.',
   'When are you going on holiday? → I\'m going to Sardinia in September.'
 ],trap:'"Going to" is for a plan you have already made — not a spontaneous idea.',fix:'Corrected: '},
 {tag:'COMPARATIVES',title:'Comparing two things',fr:'Comparer deux choses',formula:'short adjective + -er + than · more + long adjective + than',examples:[
   'This room is quieter than the first one.',
   'This room is more comfortable than the first one.'
 ],trap:'Short adjectives (1 syllable, or 2 ending in -y) add -er. Longer adjectives use "more … than".',fix:'Corrected:'},
 {tag:'SOME / ANY',title:'Quantities',fr:'Les quantités',formula:'any → questions & negatives · some → positive sentences',examples:[
   'Are there any towels? → There aren\'t any towels left. / There are some towels in the bathroom.'
 ],trap:'Use "any" in questions and negative sentences, and "some" in positive sentences.'}
];

const answers=[
 {title:'Introducing yourself',fr:'Se présenter',grammar:'Present simple for facts, present perfect for duration ("I have been retired for…").',blocks:[
   'My name is Karine. I\'m 60 years old. I have been retired for [+ duration].',
   'My husband is [name]. He works near [place]. We have a daughter. Her name is [name]. She\'s 29 years old.',
   'What do you do for a living? / What did you do for work? → I worked at a hair salon for many years.',
   'Where do you live? → I live in Saint-Gilles-Croix-de-Vie (SGXV). It\'s a seaside resort and a fishing port. In summer, there are a lot of people and a lot of bike paths. I love SG, so come and enjoy your holiday here!'
 ],fix:'Corrected: made the closing sentence flow as one clear invitation.',vocab:[]},
 {title:'Your typical week',fr:'Une semaine typique',grammar:'Present simple + frequency words + connectors: also, as well, too.',blocks:[
   'What do you usually do during a typical week? → I go to yoga on Mondays. I clean my house on Tuesdays. I go for a bike ride. I study English to prepare for the CLOE exam. I also read a book.',
   'Connector practice: I go to yoga. I also clean my house. I go for a bike ride as well. I study English too.',
   'What book are you reading right now? → I\'m reading a novel by Musso.',
   'What types of books do you like to read? → I like to read thrillers.'
 ],fix:'Corrected: "on Tuesday" → "study my English" → "study English" (no "my" needed).',vocab:[]},
 {title:'Last weekend',fr:'Le week-end dernier',grammar:'Past simple + sequencing (first, then, after that, finally).',blocks:[
   'What did you do yesterday or last weekend? → Yesterday, we went to eat at the Cabane de Luc with friends. Then we went to a birthday party.'
 ],fix:'Corrected: split into two clear sentences with "Then", instead of one long sentence joined by "and".',vocab:[]},
 {title:'A memorable experience',fr:'Un souvenir marquant',grammar:'Present perfect to introduce it ("Have you ever…"), then past simple for the details.',blocks:[
   'Have you ever had a holiday or experience you remember especially well? → Yes, we went to Tunisia with our friends last year for my birthday. It was a special memory. We celebrated my birthday.'
 ],fix:'',vocab:[['to celebrate','fêter'],['a memory','un souvenir']]},
 {title:'Future plans',fr:'Vos projets',grammar:'Going to for plans you have already decided.',blocks:[
   'What are you planning to do in the next few weeks or months? → First, I\'m going to Paris to see my daughter. I\'m also going to travel with my husband to Sardinia in September. This winter, I\'m going to study English. I\'m also going skiing.'
 ],fix:'',vocab:[]}
];

function safe(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function speak(text){if(!('speechSynthesis'in window))return alert('Speech synthesis is not supported in this browser.');speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=voiceLang;u.rate=.92;const vs=speechSynthesis.getVoices();u.voice=vs.find(v=>v.lang===voiceLang)||vs.find(v=>v.lang.startsWith(voiceLang.slice(0,2)))||null;speechSynthesis.speak(u)}

function renderGrammar(){
 $('#grammarGrid').innerHTML=grammar.map(g=>`<article class="grammar-card"><span class="rule-tag">${g.tag}</span><h3>${g.title} <span class="fr" style="display:block;font-size:.72rem;font-weight:400;color:var(--ocean2);text-transform:none;letter-spacing:0">${g.fr}</span></h3><div class="formula">${g.formula}</div><ul class="examples">${g.examples.map(x=>`<li>${x}</li>`).join('')}</ul><p class="trap"><strong>Watch:</strong> ${g.trap}</p>${g.fix?`<div class="fix-note">${g.fix}</div>`:''}<button class="small-btn speak" data-speak="${safe(g.examples.join(' ').replace(/→/g,'.'))}" type="button">▶ Listen to the examples</button></article>`).join('');
}
function renderAnswers(){
 $('#answersGrid').innerHTML=answers.map((a,i)=>`<article class="oral-card"><span class="oral-number">${String(i+1).padStart(2,'0')}</span><h3>${a.title} <span class="fr" style="display:block;font-size:.75rem;font-weight:400;color:var(--ocean2)">${a.fr}</span></h3><div class="grammar-strip"><span>GRAMMAR USED</span>${a.grammar}</div><div class="model-block">${a.blocks.map(b=>`<p>${b}</p>`).join('')}</div>${a.fix?`<div class="fix-note">${a.fix}</div>`:''}${a.vocab.length?`<div class="vocab-row">${a.vocab.map(v=>`<span class="vocab-pair"><b>${v[0]}</b> — ${v[1]}</span>`).join('')}</div>`:''}<div class="oral-actions"><button class="small-btn dark speak" data-speak="${safe(a.blocks.join(' ').replace(/→/g,'.'))}" type="button">▶ Listen to this answer</button></div></article>`).join('');
}

function reportText(){
 let out=`KARINE · LESSON NOTES · L'ATELIER BOISVINET\nDate: ${$('#lessonDate').value||''}\nTrainer: ${$('#trainerName').value||''}\nLesson: ${$('#lessonTitle').value||''}\n\nGRAMMAR REVIEWED\n`;
 grammar.forEach(g=>{out+=`\n${g.tag} — ${g.title}\n${g.formula}\n`+g.examples.map(x=>'- '+x.replace(/→/g,'->')).join('\n')+'\n';});
 out+=`\nYOUR ANSWERS\n`;
 answers.forEach(a=>{out+=`\n${a.title}\n`+a.blocks.map(b=>'- '+b.replace(/→/g,'->')).join('\n')+'\n';});
 out+=`\nTRAINER COMMENTS\n${$('#trainerComments').value||'—'}\n\nNEXT PRIORITIES\n${$('#nextPriorities').value||'—'}\n`;
 return out;
}
async function copyNotes(){try{await navigator.clipboard.writeText(reportText());$('#saveMessage').textContent='✓ Notes copied.';setTimeout(()=>$('#saveMessage').textContent='',2200)}catch(e){$('#saveMessage').textContent='Copy unavailable in this browser.'}}
function downloadNotes(){const b=new Blob([reportText()],{type:'text/plain;charset=utf-8'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='Karine-Lesson-Notes.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),500)}

function initEvents(){
 document.addEventListener('click',e=>{const sp=e.target.closest('.speak');if(sp&&sp.dataset.speak)speak(sp.dataset.speak)});
 $('#translationToggle').addEventListener('click',()=>{const on=document.body.classList.toggle('show-fr');$('#translationToggle').textContent=on?'FR ON':'FR OFF'});
 $('#voiceMode').addEventListener('change',e=>voiceLang=e.target.value);
 $('#printBtn').addEventListener('click',()=>window.print());
 $('#printBottom').addEventListener('click',()=>window.print());
 $('#copyNotes').addEventListener('click',copyNotes);
 $('#downloadNotes').addEventListener('click',downloadNotes);
}

function init(){
 renderGrammar();renderAnswers();
 if(!$('#lessonDate').value)$('#lessonDate').value=new Date().toISOString().slice(0,10);
 initEvents();
 if('speechSynthesis'in window)speechSynthesis.getVoices();
}
document.addEventListener('DOMContentLoaded',init);
})();
