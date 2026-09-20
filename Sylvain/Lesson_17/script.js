const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const state = JSON.parse(localStorage.getItem('lesson16State') || '{}');
const results = state.results || {};

const vocab = {
  "Settling near Lisbon": [
    ["to settle in", "s'installer / prendre ses marques", "We are settling in near Lisbon."],
    ["temporary rental", "location temporaire", "We found a temporary rental while we look for a house."],
    ["neighbourhood", "quartier", "The neighbourhood is quiet and close to school."],
    ["to get used to", "s'habituer à", "I am getting used to a new routine."],
    ["commute", "trajet domicile-travail", "The commute to Lisbon is important for a job."],
    ["surrounding area", "les environs", "We are discovering the surrounding area."],
    ["paperwork", "démarches administratives", "There is a lot of paperwork after a move."],
    ["daily routine", "routine quotidienne", "Our daily routine has changed."],
    ["to adapt", "s'adapter", "The family is adapting to life in Portugal."]
  ],
  "Housing and family": [
    ["to purchase", "acheter", "We are looking to purchase a new home."],
    ["mortgage", "prêt immobilier", "We need to organise the mortgage."],
    ["estate agent", "agent immobilier", "We spoke to an estate agent yesterday."],
    ["viewing", "visite immobilière", "We have a viewing tomorrow."],
    ["school year", "année scolaire", "The school year has started."],
    ["to enrol", "inscrire", "The girls have been enrolled in school."],
    ["friendship", "amitié", "Friendship is important when you move to a new country."],
    ["support network", "réseau de soutien", "A support network helps a family settle in."],
    ["to keep in touch", "rester en contact", "We keep in touch with friends in France."]
  ],
  "Job search": [
    ["application", "candidature", "I sent an application this morning."],
    ["resume / CV", "CV", "My CV presents my experience clearly."],
    ["cover letter", "lettre de motivation", "A cover letter explains why you are interested."],
    ["interview", "entretien", "I have an interview next week."],
    ["position", "poste", "I am looking for a position near Lisbon."],
    ["skills", "compétences", "My skills include organisation and client service."],
    ["experience", "expérience", "I have experience in catering and logistics."],
    ["responsibility", "responsabilité", "I had many responsibilities in my business."],
    ["availability", "disponibilité", "Could you confirm your availability?"],
    ["to apply for", "postuler à", "I am going to apply for this position."],
    ["to be suitable for", "convenir à / être adapté à", "I think this role is suitable for my profile."]
  ],
  "Problem-solving": [
    ["issue", "problème / point à résoudre", "There was an issue with the delivery time."],
    ["delay", "retard", "The flight had a delay."],
    ["last-minute change", "changement de dernière minute", "The client made a last-minute change."],
    ["to solve", "résoudre", "I solved the problem quickly."],
    ["to manage", "gérer", "I can manage urgent requests."],
    ["to check", "vérifier", "I checked every label carefully."],
    ["to confirm", "confirmer", "I confirmed the delivery point."],
    ["to update", "mettre à jour", "I updated the order form."],
    ["to prevent", "éviter / prévenir", "Clear labels prevent mistakes."],
    ["under pressure", "sous pression", "I can work under pressure."]
  ],
  "Connectors and story words": [
    ["while", "pendant que / alors que", "The client called while I was preparing the order."],
    ["when", "quand / lorsque", "I was working when the client called."],
    ["before", "avant", "I had checked the labels before the driver arrived."],
    ["after", "après", "After I received the update, I changed the order."],
    ["by the time", "au moment où / d'ici à", "By the time the driver arrived, I had finished the order."],
    ["already", "déjà", "I had already checked the quantities."],
    ["at first", "au début", "At first, the situation was difficult."],
    ["then", "ensuite", "Then, I called the client."],
    ["as a result", "par conséquent", "As a result, the delivery was on time."],
    ["fortunately", "heureusement", "Fortunately, we solved the problem."],
    ["however", "cependant", "However, I needed more information."],
    ["overall", "globalement", "Overall, the move is positive."]
  ]
};

const mirrorData = {
  move: [
    ["Present simple", "routine / fact", "I live near Lisbon now."],
    ["Present continuous", "temporary / now", "I am settling into a new routine."],
    ["Past simple", "finished past", "I moved to Portugal recently."],
    ["Present perfect", "result now", "I have found a temporary rental."],
    ["Past continuous", "background past action", "I was looking for a house when we found this rental."],
    ["Past perfect", "before another past event", "I had organised some paperwork before we moved."],
    ["Future", "next step", "I am going to look for a new home."],
  ],
  work: [
    ["Present simple", "routine / fact", "I prepare meals for professional clients."],
    ["Present continuous", "temporary / now", "I am checking an order now."],
    ["Past simple", "finished past", "I developed an airline-catering activity."],
    ["Present perfect", "experience", "I have worked with airline clients."],
    ["Past continuous", "background past action", "I was preparing the order when the client called."],
    ["Past perfect", "before another past event", "I had checked the labels before the driver arrived."],
    ["Future", "next step", "I will send the confirmation today."],
  ],
  job: [
    ["Present simple", "general fact", "I have strong experience in catering."],
    ["Present continuous", "current project", "I am looking for a new job."],
    ["Past simple", "finished past", "I managed a catering business in France."],
    ["Present perfect", "experience/result", "I have updated my CV."],
    ["Past continuous", "background past action", "I was researching companies when I saw the job advert."],
    ["Past perfect", "before another past event", "I had prepared my CV before I applied."],
    ["Future", "objective", "I would like to work near Lisbon."],
  ]
};

const quizzes = {
  quizTenseMarker: [
    {q:"Meaning: a daily or regular activity.", options:["Present simple","Past perfect","Past continuous"], answer:"Present simple", hint:"Ask: is it a routine or fact?"},
    {q:"Meaning: an action happening at a specific moment in the past.", options:["Past continuous","Present perfect","Going to"], answer:"Past continuous", hint:"Look for was / were + verb-ing."},
    {q:"Meaning: an experience with a result now.", options:["Past simple","Present perfect","Present simple"], answer:"Present perfect", hint:"Use have / has + past participle."},
    {q:"Meaning: an action before another past action.", options:["Past perfect","Present continuous","Will"], answer:"Past perfect", hint:"Use had + past participle."},
    {q:"Meaning: a plan or intention.", options:["Going to","Past simple","Present perfect"], answer:"Going to", hint:"Use am/is/are going to + verb."}
  ],
  quizWhenWhile: [
    {q:"I was preparing the order ___ the client called.", options:["when","while","already"], answer:"when", hint:"The call is the event/interruption."},
    {q:"The client called ___ I was preparing the order.", options:["while","when","before"], answer:"while", hint:"Use while before the background action."},
    {q:"___ I lived in France, I worked in catering.", options:["When","While","Yet"], answer:"When", hint:"When can introduce a period in your life."},
    {q:"___ I understand the problem, I need more information.", options:["While","When","Then"], answer:"While", hint:"Here, while means although / contrast."},
    {q:"We were looking for a house ___ the girls started school.", options:["when","yet","already"], answer:"when", hint:"The school start is a past event."},
    {q:"___ we were visiting the area, we discovered a quiet neighbourhood.", options:["While","Since","Ever"], answer:"While", hint:"During the visit."}
  ],
  quizWasWere: [
    {q:"I ___ looking for a new job.", options:["was","were","did"], answer:"was", hint:"I + was."},
    {q:"We ___ organising the house.", options:["were","was","had"], answer:"were", hint:"We + were."},
    {q:"The girls ___ starting school.", options:["were","was","did"], answer:"were", hint:"The girls = they."},
    {q:"The client ___ waiting for my confirmation.", options:["was","were","did"], answer:"was", hint:"The client = he/she/it."},
    {q:"___ you working when she called?", options:["Were","Did","Had"], answer:"Were", hint:"Past continuous question: was/were + subject + verb-ing."}
  ],
  quizPastSimpleContinuous: [
    {q:"I ___ dinner when my friend called.", options:["was making","made","have made"], answer:"was making", hint:"The action was in progress."},
    {q:"The client ___ the order yesterday.", options:["changed","was changing","had changed"], answer:"changed", hint:"Finished event + yesterday = past simple."},
    {q:"While we ___ the house, the estate agent arrived.", options:["were visiting","visited","have visited"], answer:"were visiting", hint:"After while, use the background action."},
    {q:"I ___ an application last night.", options:["sent","was sending","have sent"], answer:"sent", hint:"Finished time = last night."},
    {q:"What ___ when the phone rang?", options:["were you doing","did you doing","had you do"], answer:"were you doing", hint:"Ask about background action in progress."}
  ],
  quizPastPerfect: [
    {q:"I ___ the labels before the driver arrived.", options:["had checked","checked","was checking"], answer:"had checked", hint:"The checking happened before the driver arrived."},
    {q:"By the time we moved, we ___ a temporary rental.", options:["had found","were finding","find"], answer:"had found", hint:"Before a past moment: had + past participle."},
    {q:"I ___ the confirmation after I received the new address.", options:["sent","had sent","was sent"], answer:"sent", hint:"After gives clear order; past simple is enough here."},
    {q:"She was tired because she ___ all day.", options:["had been working","has worked","works"], answer:"had been working", hint:"Duration before a past result."},
    {q:"Had you ___ your CV before the interview?", options:["updated","update","updating"], answer:"updated", hint:"Past perfect question: had + subject + past participle."}
  ],
  quizJobSearch: [
    {q:"Choose the strongest sentence for an interview.", options:["I want job.","I am looking for a position where I can use my experience.","I search work Lisbon."], answer:"I am looking for a position where I can use my experience.", hint:"Use a complete professional structure."},
    {q:"Choose the best sentence about experience.", options:["I have experience in catering and client service.","I am experience catering.","I have experienced to catering."], answer:"I have experience in catering and client service.", hint:"Expression: have experience in + noun/verb-ing."},
    {q:"Choose the best sentence about skills.", options:["I can manage urgent requests under pressure.","I can to manage urgent requests.","I am can manage urgent requests."], answer:"I can manage urgent requests under pressure.", hint:"After can, use the base verb."},
    {q:"Choose the best sentence about relocation.", options:["I have recently moved near Lisbon.","I am recently move near Lisbon.","I moved recently near at Lisbon."], answer:"I have recently moved near Lisbon.", hint:"Present perfect is useful for a recent change connected to now."},
    {q:"Choose the best sentence about your objective.", options:["I would like to join a professional team.","I would like join a professional team.","I like joining professional team yesterday."], answer:"I would like to join a professional team.", hint:"would like + to + verb."}
  ],
  quizListening: [
    {q:"Where will the aircraft arrive?", options:["At gate B12","At gate A7","At the hotel"], answer:"At gate B12", hint:"Listen for the gate."},
    {q:"What changed?", options:["The breakfast order","The house viewing","The interview time"], answer:"The breakfast order", hint:"The message is about tomorrow's delivery."},
    {q:"What must have a clear label?", options:["Each meal","Only the driver","The invoice"], answer:"Each meal", hint:"The speaker asks for labels in English."},
    {q:"Which dietary restriction is mentioned?", options:["Gluten-free and no nuts","No tomatoes and vegetarian only","No dairy and no seafood"], answer:"Gluten-free and no nuts", hint:"Listen for passenger needs."}
  ],
  quizReading: [
    {q:"What is the purpose of the email?", options:["To confirm an interview","To cancel an order","To sell a house"], answer:"To confirm an interview", hint:"Look at the subject and main request."},
    {q:"When is the online meeting?", options:["Next Tuesday at 10:30","Friday at 7:45","Tomorrow morning"], answer:"Next Tuesday at 10:30", hint:"Find the exact day and time."},
    {q:"What will the interview focus on?", options:["Experience, move to Portugal and client requests in English","Only salary and holidays","School registration"], answer:"Experience, move to Portugal and client requests in English", hint:"The email lists three topics."},
    {q:"What should you do before Friday?", options:["Confirm availability","Send a delivery label","Call the estate agent"], answer:"Confirm availability", hint:"The final sentence gives the action."}
  ],
  quizIntegrated: [
    {q:"Yesterday, I ___ the labels when the client called.", options:["was checking","had checked","have checked"], answer:"was checking", hint:"Background action in progress."},
    {q:"I ___ the quantities before the driver arrived.", options:["had already confirmed","was already confirming","confirm"], answer:"had already confirmed", hint:"Before another past action."},
    {q:"We ___ near Lisbon recently, so we are adapting to a new routine.", options:["have moved","moved yesterday","were moving when"], answer:"have moved", hint:"Recent change with result now."},
    {q:"The girls started school while we ___ into the rental home.", options:["were settling","had settled","settled"], answer:"were settling", hint:"During the same period."},
    {q:"By the time I sent the application, I ___ my CV.", options:["had updated","was updating","update"], answer:"had updated", hint:"Action completed before another past action."},
    {q:"I am looking for a position because I ___ in Portugal now.", options:["am living","had lived","was lived"], answer:"am living", hint:"Current situation now."}
  ]
};

function save(){ localStorage.setItem('lesson16State', JSON.stringify({results})); }
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2300); }
function shuffle(arr){ return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(v=>v[1]); }
function renderVocab(){
  const sel=$('#vocabSelect'); if(!sel) return;
  sel.innerHTML = Object.keys(vocab).map(k=>`<option>${k}</option>`).join('');
  const draw=()=>{
    const cards=vocab[sel.value].map(([en,fr,ex])=>`<article class="vocab-card"><h3>${en}</h3><div class="fr">${fr}</div><p class="ex">${ex}</p><button class="btn ghost speak" data-speak="${ex.replace(/"/g,'&quot;')}">🔊</button></article>`).join('');
    $('#vocabCards').innerHTML=cards; bindSpeak();
  };
  sel.addEventListener('change',draw); draw();
}
function renderMirror(type='move'){
  $('#mirrorContent').innerHTML = mirrorData[type].map(([tense,meaning,sentence])=>`<div class="mirror-row"><strong>${tense}</strong><em>${meaning}</em><span>${sentence}</span></div>`).join('');
}
function renderQuiz(id, items){
  const root=$('#'+id); if(!root) return;
  root.innerHTML = items.map((item,i)=>{
    const key=`${id}_${i}`;
    const opts=shuffle(item.options);
    return `<div class="q-item" data-key="${key}" data-answer="${encodeURIComponent(item.answer)}"><h4>${i+1}. ${item.q}</h4><div class="options">${opts.map(o=>`<button class="option" type="button">${o}</button>`).join('')}</div><button class="btn hint" type="button">Hint</button><div class="hint-text">${item.hint}</div><div class="feedback"></div></div>`;
  }).join('');
}
function bindQuizzes(){
  $$('.q-item').forEach(q=>{
    const key=q.dataset.key;
    const answer=decodeURIComponent(q.dataset.answer);
    const saved=results[key];
    const buttons=$$('.option',q);
    const feedback=$('.feedback',q);
    if(saved){
      buttons.forEach(b=>{
        if(b.textContent===answer) b.classList.add('correct');
        if(b.textContent===saved.choice && !saved.correct) b.classList.add('wrong');
        b.disabled=true;
      });
      feedback.textContent=saved.correct?'Correct ✓':'Review this point.';
    }
    buttons.forEach(btn=>btn.addEventListener('click',()=>{
      const correct=btn.textContent===answer;
      results[key]={choice:btn.textContent, correct}; save();
      buttons.forEach(b=>{ b.disabled=true; if(b.textContent===answer) b.classList.add('correct'); });
      if(!correct) btn.classList.add('wrong');
      feedback.textContent= correct ? 'Correct ✓' : `Not quite. Correct answer: ${answer}`;
      updateAllScores();
    }));
    $('.btn.hint',q)?.addEventListener('click',()=> $('.hint-text',q).classList.toggle('show'));
  });
}
function updateAllScores(){
  const sections = {
    'same-subject':['quizTenseMarker'],
    'when-while':['quizWhenWhile'],
    'grammar':['quizWasWere','quizPastSimpleContinuous','quizPastPerfect'],
    'joblab':['quizJobSearch'],
    'listening-reading':['quizListening','quizReading'],
    'integrated':['quizIntegrated']
  };
  let total=0, correct=0;
  Object.entries(sections).forEach(([name,ids])=>{
    let t=0,c=0;
    ids.forEach(id=>{
      (quizzes[id]||[]).forEach((_,i)=>{ const r=results[`${id}_${i}`]; if(r){t++; if(r.correct)c++;} });
    });
    total += t; correct += c;
    const pct=t?Math.round(c/t*100):0;
    $$(`.section-eval[data-section="${name}"]`).forEach(el=>{el.textContent=`Objective practice score: ${c}/${t} (${pct}%).`;});
  });
  const gpct=total?Math.round(correct/total*100):0;
  $('#globalScore').textContent=gpct+'%';
  $('.score-ring').style.background=`conic-gradient(var(--teal) ${gpct*3.6}deg, var(--line) 0deg)`;
  $('#sectionScores').innerHTML = Object.entries(sections).map(([name,ids])=>{
    let t=0,c=0; ids.forEach(id=>(quizzes[id]||[]).forEach((_,i)=>{const r=results[`${id}_${i}`]; if(r){t++; if(r.correct)c++;}}));
    return `<div class="score-line"><span>${name.replace('-', ' ')}</span><strong>${c}/${t}</strong></div>`;
  }).join('');
}
function bindSpeak(){
  $$('.speak').forEach(btn=>{
    if(btn.dataset.bound) return; btn.dataset.bound='1';
    btn.addEventListener('click',()=>{
      if(!('speechSynthesis' in window)){ toast('Audio is not supported on this device.'); return; }
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(btn.dataset.speak || btn.textContent);
      u.lang='en-GB'; u.rate=.9; speechSynthesis.speak(u);
    });
  });
}
function bindModelsAndHints(){
  $$('.btn.model').forEach(btn=>btn.addEventListener('click',()=>$('#'+btn.dataset.modelTarget)?.classList.toggle('show')));
  $$('.open-task .btn.hint').forEach(btn=>btn.addEventListener('click',()=>toast(btn.dataset.hint || 'Think about the rule first.')));
  $$('.manual-eval').forEach((el,i)=>{
    el.innerHTML = ['Non acquis','En cours','Acquis','Maîtrisé'].map(v=>`<label><input type="radio" name="manual_${i}" value="${v}"> ${v}</label>`).join('');
  });
}
let mediaRecorder, chunks=[];
function bindRecorder(){
  const start=$('#startRec'), stop=$('#stopRec'), status=$('#recStatus'), recs=$('#recordings'); if(!start) return;
  start.addEventListener('click',async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      chunks=[]; mediaRecorder=new MediaRecorder(stream);
      mediaRecorder.ondataavailable=e=>chunks.push(e.data);
      mediaRecorder.onstop=()=>{
        const blob=new Blob(chunks,{type:'audio/webm'}); const url=URL.createObjectURL(blob);
        const a=document.createElement('a'); a.href=url; a.download='speaking-practice.webm'; a.textContent='Download recording'; a.className='btn secondary';
        const audio=document.createElement('audio'); audio.controls=true; audio.src=url;
        const wrap=document.createElement('div'); wrap.className='recording-item'; wrap.append(audio,a); recs.prepend(wrap);
        stream.getTracks().forEach(t=>t.stop()); status.textContent='Recording saved.';
      };
      mediaRecorder.start(); start.disabled=true; stop.disabled=false; status.textContent='Recording... speak clearly.';
    }catch(e){status.textContent='Microphone permission was not accepted.';}
  });
  stop.addEventListener('click',()=>{ if(mediaRecorder && mediaRecorder.state==='recording'){mediaRecorder.stop(); start.disabled=false; stop.disabled=true;} });
}
function bindDownload(){
  $('#downloadResults')?.addEventListener('click',()=>{
    const text = `Lesson 16 results\nDate: ${new Date().toLocaleString()}\nObjective score: ${$('#globalScore').textContent}\n\nManual writing/speaking assessment can be completed by the trainer on the page.\n`;
    const blob=new Blob([text],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='lesson-16-results.txt'; a.click(); URL.revokeObjectURL(url);
  });
}
function init(){
  renderVocab(); renderMirror();
  Object.entries(quizzes).forEach(([id,items])=>renderQuiz(id,items));
  bindQuizzes(); bindSpeak(); bindModelsAndHints(); bindRecorder(); bindDownload(); updateAllScores();
  $$('.tab').forEach(t=>t.addEventListener('click',()=>{ $$('.tab').forEach(x=>x.classList.remove('active')); t.classList.add('active'); renderMirror(t.dataset.tab); }));
  $('#toggleFr')?.addEventListener('click',()=>document.body.classList.toggle('show-fr'));
  $('#resetAll')?.addEventListener('click',()=>{ if(confirm('Reset all objective answers?')){ localStorage.removeItem('lesson16State'); location.reload(); } });
}
document.addEventListener('DOMContentLoaded',init);
