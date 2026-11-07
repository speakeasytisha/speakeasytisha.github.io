/* Saved quiz feedback for NEW attempts only. Historical answer choices were not stored. */
(()=>{
 'use strict';
 const KEY='sandrine-hotel-l2-quiz-progress-v1';
 const LIST='.refinedQuestion, .choiceLabExercise, .quiz, .checkpoint';
 let records={};try{records=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){records={}}
 function all(){return [...document.querySelectorAll(LIST)]}
 function identifier(el){const section=el.closest('section')?.id||'unknown';const index=all().filter(e=>e.closest('section')?.id===section).indexOf(el);return section+':'+index;}
 function store(){localStorage.setItem(KEY,JSON.stringify(records));update();}
 function update(){const s=document.getElementById('recoveryProgress');if(!s)return;const vals=Object.values(records);const done=vals.filter(v=>v.status==='correct').length; s.textContent=vals.length?'New quiz attempts saved: '+vals.length+' · currently correct: '+done+'.':'No earlier quiz scores were recorded. New quiz answers will now be saved.';}
 function feedbackOf(el){return el.querySelector('.feedback')}
 function restore(){all().forEach(el=>{const rec=records[identifier(el)];if(!rec)return;const buttons=[...el.querySelectorAll('.choices button')];if(rec.selected!==null&&buttons[rec.selected]){buttons.forEach(b=>b.classList.remove('correct','wrong','chosen'));buttons[rec.selected].classList.add(rec.status==='correct'?'correct':'wrong');}const f=feedbackOf(el);if(f){f.textContent=rec.feedback;f.className='feedback '+(rec.status==='correct'?'good':'bad');}if(el.classList.contains('checkpoint'))el.dataset.correct=rec.status==='correct'?'yes':'no';});if(typeof updateChallengeProgress==='function')updateChallengeProgress();update();}
 // The existing answer handlers run synchronously. Capture their final result after the click.
 document.addEventListener('click',event=>{
   const button=event.target.closest('button');if(!button)return;
   const el=button.closest(LIST);if(!el)return;
   const opts=[...el.querySelectorAll('.choices button')];
   const isChoice=opts.includes(button);
   const retry=/^(reset|retry)$/i.test(button.textContent.trim());
   if(!isChoice&&!retry)return;
   queueMicrotask(()=>{
     const id=identifier(el);
     if(retry){delete records[id];store();return;}
     const selected=opts.findIndex(b=>b.classList.contains('correct')||b.classList.contains('wrong'));
     if(selected<0)return;
     const status=opts[selected].classList.contains('correct')?'correct':'incorrect';
     records[id]={selected,status,feedback:feedbackOf(el)?.textContent||''};store();
   });
 },true);
 const info=document.createElement('div');info.id='recoveryPanel';info.className='recoveryPanel';info.innerHTML='<strong>Recovered lesson · Where to continue</strong><p>Saved work: hotel choice and booking details, two written emails, and four selected hotel amenities. The first two email drafts are preserved exactly as written. No earlier multiple-choice answers or scores were recorded, so these activities are <b>not</b> marked as completed.</p><p id="recoveryProgress"></p><a href="#email">Review saved emails</a> · <a href="#builder">Review hotel preferences</a>';
 const main=document.querySelector('main');const first=main.querySelector('section');main.insertBefore(info,first);restore();
})();
