const completed=new Set(); let vocabFR=false, timerInt=null, practice=true;
document.querySelectorAll('[data-save]').forEach(x=>{x.value=localStorage.getItem('sandrine_'+x.dataset.save)||'';x.addEventListener('input',()=>localStorage.setItem('sandrine_'+x.dataset.save,x.value))});
function go(id){document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));document.getElementById(id).classList.add('active');window.scrollTo({top:document.querySelector('.app').offsetTop,behavior:'smooth'})}
function complete(a,b){completed.add(a);updateProgress();go(b)}
function updateProgress(){let n=completed.size;document.getElementById('bar').style.width=Math.min(100,n/11*100)+'%';document.getElementById('progressText').textContent=Math.round(Math.min(100,n/11*100))+'% explored'}
function toggleModel(btn){if(!practice)return;btn.nextElementSibling.classList.toggle('show')}
function toggleMode(){practice=!practice;document.getElementById('modeBtn').textContent=practice?'Practice mode':'Challenge mode';document.querySelectorAll('.model').forEach(b=>b.style.display=practice?'inline-block':'none')}
document.querySelectorAll('[data-quiz] button').forEach(b=>b.addEventListener('click',()=>{let q=b.closest('[data-quiz]'),f=q.querySelector('.feedback');if(b.dataset.correct){f.textContent='✓ Exactly.';f.style.color='#26734d'}else{f.textContent='Not quite — think about the meaning in context.';f.style.color='#b02a37'}}));
function checkFill(btn){let box=btn.closest('[data-fill]'),els=[...box.querySelectorAll('select')],ok=els.filter(x=>x.value===x.dataset.answer).length;let f=box.querySelector('.feedback');f.textContent=`${ok}/${els.length} correct`+(ok===els.length?' — excellent.':' — check the examples above and try again.');f.style.color=ok===els.length?'#26734d':'#b06b16'}
function toggleVocab(){vocabFR=!vocabFR;document.querySelectorAll('#vocabList>div').forEach(d=>{let b=d.querySelector('b');if(!d.dataset.en)d.dataset.en=b.textContent;b.textContent=vocabFR?d.dataset.fr:d.dataset.en})}
function speak(t){if('speechSynthesis'in window){speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(t);u.lang='en-GB';speechSynthesis.speak(u)}}
function pick(b){b.classList.toggle('picked');b.textContent=b.classList.contains('picked')?'♥ On your shortlist':'♡ Add to shortlist';updateShortlist()}
function startTimer(){clearInterval(timerInt);let s=180;const el=document.getElementById('timer');el.textContent='03:00';timerInt=setInterval(()=>{s--;el.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');if(s<=0){clearInterval(timerInt);el.textContent='TIME'}},1000)}
function val(id){return document.getElementById(id).value.trim()}
function generateAdmin(){let t=`SESSION — LONDON CALLING · LESSON 1
Date: ${val('aDate')||'[date]'}
Duration: ${val('aDuration')||'[duration]'}
Observed level: ${val('aLevel')}
Engagement: ${val('aEng')}

OBJECTIFS DE LA SÉANCE
${val('aObjectives')}

CONTENU / MODALITÉS PÉDAGOGIQUES
${val('aMethods')}

VOCABULAIRE / GRAMMAIRE
${val('aLang')}

POINTS FORTS OBSERVÉS
${val('aStrength')||'[à compléter après le cours]'}

POINTS À REVOIR / CONSOLIDER
${val('aNext')||'[à compléter après le cours]'}

PROCHAINE ÉTAPE
${val('aDirection')}`;document.getElementById('adminOutput').value=t}
function generateEmail(){let strengths=val('aStrength'),next=val('aNext');document.getElementById('emailOutput').value=`Objet : Ton cours d’anglais – London Calling 🇬🇧

Bonjour Sandrine,

Merci pour ce très bon moment aujourd’hui !

Nous avons commencé notre voyage vers Londres en réactivant ton anglais à travers des situations très concrètes : les différentes façons de rejoindre Londres depuis la France, l’arrivée et les transports, les questions utiles pour demander de l’aide, ainsi que la préparation d’un itinéraire en famille.

Nous avons également comparé plusieurs différences entre l’anglais britannique et l’anglais américain — vocabulaire, expressions et orthographe — avec l’idée importante qu’il ne s’agit pas d’un anglais « juste » ou « faux », mais de deux usages qu’il est très utile de reconnaître.

Côté grammaire, nous avons réactivé plusieurs structures essentielles en contexte : “going to” pour les projets, “would like to” pour exprimer une envie, le present perfect pour parler de son expérience, les comparatifs, ainsi que les questions polies avec “could”.

${strengths?`Points forts observés : ${strengths}\n\n`:''}${next?`Pour la suite, nous continuerons à consolider : ${next}\n\n`:''}Lors du prochain cours, nous pourrons poursuivre le voyage avec les déplacements dans Londres — métro, bus, marche, directions et situations réelles — tout en continuant à faire revenir naturellement le vocabulaire et la grammaire.

📘 Ta leçon :
[LIEN DE LA LEÇON]

À très bientôt pour la suite de notre aventure londonienne !

Tisha` }
async function copyText(id){let e=document.getElementById(id);e.select();try{await navigator.clipboard.writeText(e.value)}catch{document.execCommand('copy')}}
function downloadResults(){generateAdmin();generateEmail();let txt=document.getElementById('adminOutput').value+'\n\n----------------\nFOLLOW-UP EMAIL\n----------------\n'+document.getElementById('emailOutput').value;let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download='Sandrine_Lesson_01_notes.txt';a.click()}
function resetAll(){if(confirm('Reset saved learner answers and progress?')){Object.keys(localStorage).filter(k=>k.startsWith('sandrine_')).forEach(k=>localStorage.removeItem(k));location.reload()}}

function makeTripBrief(){const f=document.getElementById('tripFrom').value,s=document.getElementById('tripSeason').value,o=document.getElementById('tripOut').value||'[choose date]',b=document.getElementById('tripBack').value||'[choose date]',a=document.getElementById('tripAdults').value,k=document.getElementById('tripKids').value,t=document.getElementById('tripTime').value,p=document.getElementById('tripPriority').value;document.getElementById('tripBrief').innerHTML=`<b>Your enquiry:</b> ${a} adult(s) + ${k} child/teen passenger(s) · ${f} → London · ${o} to ${b} · ${s} · ${t.toLowerCase()} · priority: ${p.toLowerCase()}.<br><br><b>Say it:</b> “We’re looking for a family trip to London from ${o} to ${b}. There will be ${a} adult(s) and ${k} children/teenagers. We’d prefer a ${t.toLowerCase()} departure, and our main priority is the ${p.toLowerCase()}.”`;}

function normSmart(s){return s.trim().toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ')}
function smartCheck(btn){let b=btn.closest('.smart-ex'),i=b.querySelector('.smartinput'),f=b.querySelector('.smartfeedback'),ok=normSmart(i.value)===normSmart(b.dataset.answer);f.textContent=ok?'✓ Correct — well done.':'✗ Not quite. Try again or use the hint.';f.style.color=ok?'#26734d':'#b02a37';i.style.borderColor=ok?'#26734d':'#b02a37'}
function smartHint(btn){let b=btn.closest('.smart-ex'),x=b.querySelector('.smarthint');x.textContent='Hint: '+b.dataset.hint;x.style.display='block'}
function smartReset(btn){let b=btn.closest('.smart-ex');b.querySelector('.smartinput').value='';b.querySelector('.smartfeedback').textContent='';b.querySelector('.smarthint').style.display='none'}
function filterVocab(){let sel=document.getElementById('vocabCategory');if(!sel)return;let cat=sel.value,q=(document.getElementById('vocabSearch').value||'').toLowerCase();document.querySelectorAll('.vocabcat').forEach(x=>x.style.display=x.dataset.cat===cat?'block':'none');document.querySelectorAll('.vocabcat[data-cat="'+cat+'"] .vocabrow:not(.head)').forEach(x=>x.style.display=x.dataset.search.includes(q)?'grid':'none')}

function updateShortlist(){let picked=[...document.querySelectorAll('.places button.picked')].map(b=>b.dataset.place||b.closest('article').querySelector('h3').textContent.trim()),tray=document.getElementById('shortlistTray');if(!tray)return;tray.innerHTML=picked.length?picked.map(x=>'<span class="short-chip">'+x+'</span>').join(''):'<span class="emptyshort">No places shortlisted yet.</span>';['dayMorning','dayAfternoon','dayEvening'].forEach(id=>{let s=document.getElementById(id),old=s.value;s.innerHTML='<option value="">Choose from shortlist…</option>'+picked.map(x=>'<option>'+x+'</option>').join('');if(picked.includes(old))s.value=old})}
function buildDayText(){let m=document.getElementById('dayMorning').value,a=document.getElementById('dayAfternoon').value,e=document.getElementById('dayEvening').value,p=document.getElementById('dayPreview'),t=document.getElementById('day1Text');if(!m||!a||!e){p.style.display='block';p.textContent='Choose a morning, afternoon and evening place from your shortlist first.';return}let txt=`In the morning, we're going to visit ${m}. In the afternoon, we're going to explore ${a}. In the evening, I'd like to go to ${e}.`;p.style.display='block';p.innerHTML='<b>Your Day 1:</b> '+m+' → '+a+' → '+e;t.value=txt;t.dispatchEvent(new Event('input'))}
function addOpenChecks(){document.querySelectorAll('.scenario textarea,.mission textarea,.transfer textarea,.challenge textarea,.roleplay textarea,.vocabpractice textarea').forEach(t=>{if(t.nextElementSibling&&t.nextElementSibling.classList.contains('open-check'))return;let w=document.createElement('div');w.className='open-check';w.innerHTML='<button class="checkopen" type="button">Check response</button><button class="openhintbtn" type="button">Hint</button><button class="openreset" type="button">Reset</button><div class="open-feedback" style="flex-basis:100%"></div><div class="open-hint">Include the key information requested above and at least one complete, polite sentence. Then compare with the model.</div>';t.insertAdjacentElement('afterend',w);w.querySelector('.checkopen').onclick=()=>{let f=w.querySelector('.open-feedback'),n=t.value.trim().split(/\s+/).filter(Boolean).length;if(n>=6){f.textContent='✓ Task achieved — now compare your language with the model.';f.style.color='#26734d'}else{f.textContent='✗ Not complete yet — add the information requested in the task.';f.style.color='#b02a37'}};w.querySelector('.openhintbtn').onclick=()=>w.querySelector('.open-hint').style.display='block';w.querySelector('.openreset').onclick=()=>{t.value='';w.querySelector('.open-feedback').textContent='';w.querySelector('.open-hint').style.display='none'}})}
document.addEventListener('DOMContentLoaded',()=>{updateShortlist();addOpenChecks()});
