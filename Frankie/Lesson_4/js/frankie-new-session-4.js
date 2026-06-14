(function(){
  'use strict';
  const $ = (s)=>document.querySelector(s);
  const $$ = (s)=>Array.from(document.querySelectorAll(s));
  let selectedVoice = 'en-US';
  let voices = [];

  const problemSentences = [
    {label:'Hotel room', sentence:'There is a problem with my room.', say:'There is a problem with my room.'},
    {label:'Wi-Fi', sentence:'The Wi-Fi doesn’t work.', say:"The Wi-Fi doesn't work."},
    {label:'Key card', sentence:'My key card doesn’t work.', say:"My key card doesn't work."},
    {label:'Restaurant bill', sentence:'There is a mistake on the bill.', say:'There is a mistake on the bill.'},
    {label:'Train delay', sentence:'My train is late.', say:'My train is late.'},
    {label:'Lost place', sentence:'I can’t find the taxi rank.', say:"I can't find the taxi rank."}
  ];

  const categories = {
    general:'General help', hotel:'Hotel problems', restaurant:'Restaurant problems', transport:'Transport problems', shop:'Shopping', feelings:'Feelings', questions:'Questions', solutions:'Solutions'
  };

  const models = {
    general:[
      ['open','Excuse me, could you help me, please?','Excusez-moi, pourriez-vous m’aider, s’il vous plaît ?'],
      ['problem','I have a problem.','J’ai un problème.'],
      ['repeat','Could you repeat more slowly, please?','Pourriez-vous répéter plus lentement, s’il vous plaît ?'],
      ['understand','I’m sorry, I don’t understand.','Je suis désolée, je ne comprends pas.'],
      ['confirm','Do you mean this one?','Vous voulez dire celui-ci ?'],
      ['thanks','Thank you for your help.','Merci pour votre aide.']
    ],
    hotel:[
      ['room','There is a problem with my room.','Il y a un problème avec ma chambre.'],
      ['key','My key card doesn’t work.','Ma carte-clé ne fonctionne pas.'],
      ['wifi','The Wi-Fi doesn’t work.','Le Wi-Fi ne fonctionne pas.'],
      ['noise','The room is very noisy.','La chambre est très bruyante.'],
      ['towels','There are no towels in the bathroom.','Il n’y a pas de serviettes dans la salle de bain.'],
      ['request','Could you check it, please?','Pourriez-vous vérifier, s’il vous plaît ?']
    ],
    restaurant:[
      ['bill','There is a mistake on the bill.','Il y a une erreur sur l’addition.'],
      ['order','This is not my order.','Ce n’est pas ma commande.'],
      ['cold','The food is cold.','Le plat est froid.'],
      ['water','I asked for still water, not sparkling water.','J’ai demandé de l’eau plate, pas de l’eau gazeuse.'],
      ['allergy','I have an allergy. Does this dish contain nuts?','J’ai une allergie. Est-ce que ce plat contient des noix ?'],
      ['polite','Could you help me, please?','Pourriez-vous m’aider, s’il vous plaît ?']
    ],
    transport:[
      ['late','My train is late.','Mon train est en retard.'],
      ['lost','I can’t find platform 3.','Je ne trouve pas le quai 3.'],
      ['ticket','I have a problem with my ticket.','J’ai un problème avec mon billet.'],
      ['destination','Does this bus go to the city centre?','Est-ce que ce bus va au centre-ville ?'],
      ['time','How long does it take?','Combien de temps cela prend-il ?'],
      ['price','How much is a ticket, please?','Combien coûte un billet, s’il vous plaît ?']
    ],
    shop:[
      ['size','Do you have this in another size?','Avez-vous ceci dans une autre taille ?'],
      ['price','How much is it, please?','Combien ça coûte, s’il vous plaît ?'],
      ['card','Can I pay by card?','Puis-je payer par carte ?'],
      ['receipt','Can I have a receipt, please?','Puis-je avoir un reçu, s’il vous plaît ?'],
      ['return','Can I return it if there is a problem?','Puis-je le rapporter s’il y a un problème ?'],
      ['help','I’m looking for a small gift.','Je cherche un petit cadeau.']
    ]
  };

  const vocab = [
    ['general','🙏','help','aide','Support when you have a problem.','Could you help me, please?'],
    ['general','⚠️','problem','problème','Something that is not correct or not working.','I have a problem.'],
    ['general','✅','solution','solution','The answer to a problem.','Thank you for the solution.'],
    ['general','🔁','repeat','répéter','Say something again.','Could you repeat, please?'],
    ['general','🐢','slowly','lentement','Not fast.','Could you speak slowly, please?'],
    ['general','🤔','understand','comprendre','Know the meaning.','I don’t understand.'],
    ['hotel','🗝️','key card','carte-clé','A card to open a hotel room.','My key card doesn’t work.'],
    ['hotel','📶','Wi-Fi','Wi-Fi','Internet connection.','The Wi-Fi doesn’t work.'],
    ['hotel','🚪','room','chambre','A place to sleep in a hotel.','There is a problem with my room.'],
    ['hotel','🛁','towel','serviette','Something to dry your body.','There are no towels.'],
    ['hotel','🔊','noisy','bruyant','With a lot of noise.','The room is noisy.'],
    ['hotel','🛎️','reception','réception','The desk in a hotel.','I need to go to reception.'],
    ['restaurant','🧾','bill','addition','The paper with the price.','There is a mistake on the bill.'],
    ['restaurant','🍽️','order','commande','The food or drink you ask for.','This is not my order.'],
    ['restaurant','🥶','cold','froid','Not hot.','The food is cold.'],
    ['restaurant','🌰','nuts','noix','Food that can cause allergies.','Does this dish contain nuts?'],
    ['restaurant','💧','still water','eau plate','Water without bubbles.','I asked for still water.'],
    ['restaurant','🫧','sparkling water','eau gazeuse','Water with bubbles.','I don’t want sparkling water.'],
    ['transport','🚆','train','train','A vehicle on rails.','My train is late.'],
    ['transport','🛤️','platform','quai','Where you wait for a train.','I can’t find platform 3.'],
    ['transport','🎟️','ticket','billet','A document to travel.','I have a problem with my ticket.'],
    ['transport','🚌','bus','bus','A large road vehicle.','Does this bus go to the centre?'],
    ['transport','⏰','late','en retard','After the planned time.','The train is late.'],
    ['transport','📍','city centre','centre-ville','The middle of a city.','I need to go to the city centre.'],
    ['shop','💳','pay by card','payer par carte','Pay with a bank card.','Can I pay by card?'],
    ['shop','🧾','receipt','reçu / ticket','Proof that you paid.','Can I have a receipt, please?'],
    ['shop','📏','size','taille','How big or small clothes are.','Do you have another size?'],
    ['shop','🔄','return','rapporter / retourner','Take something back to a shop.','Can I return it?'],
    ['feelings','😟','worried','inquiet / inquiète','A little anxious.','I am worried because I am late.'],
    ['feelings','😕','confused','perdu / confus','Not sure you understand.','I am confused. Can you repeat?'],
    ['feelings','😌','relieved','soulagé(e)','Happy because a problem is finished.','I am relieved. Thank you.'],
    ['questions','❓','What is the problem?','Quel est le problème ?','Ask about the problem.','What is the problem?'],
    ['questions','📍','Where is...?','Où est... ?','Ask for a place.','Where is reception?'],
    ['questions','⏱️','How long...?','Combien de temps... ?','Ask about time duration.','How long does it take?'],
    ['solutions','🔧','check','vérifier','Look to find the problem.','Could you check it, please?'],
    ['solutions','🆕','change','changer','Give another one.','Can I change rooms?'],
    ['solutions','📞','call','appeler','Phone someone.','Could you call a taxi?'],
    ['solutions','📝','write down','écrire / noter','Put information on paper.','Could you write it down, please?']
  ];

  const scenarios = {
    hotelKey:{title:'Hotel · Key card problem', place:'At hotel reception', problem:'Your key card doesn’t work.', student:['Good evening. Could you help me, please?','My key card doesn’t work.','I can’t open the door.','My room number is 214.','Thank you very much.'], questions:['What is your room number?','Do you have your key card?','Would you like a new card?']},
    restaurantBill:{title:'Restaurant · Mistake on the bill', place:'At a restaurant', problem:'There is a mistake on the bill.', student:['Excuse me, could you help me, please?','There is a mistake on the bill.','We did not order this dessert.','Could you check it, please?','Thank you for your help.'], questions:['What is the problem?','Which item is wrong?','Would you like to pay by card?']},
    station:{title:'Train station · Platform problem', place:'At the train station', problem:'You cannot find the platform.', student:['Excuse me, could you help me, please?','I can’t find platform 3.','My train is to Nantes.','Does it leave from this platform?','Thank you. That’s very helpful.'], questions:['Where are you going?','What time is your train?','Can I see your ticket?']},
    shop:{title:'Shop · Return an item', place:'In a shop', problem:'You bought the wrong size.', student:['Hello. I have a problem with this item.','It is the wrong size.','Can I change it, please?','Do you have another size?','Thank you.'], questions:['Do you have the receipt?','What size do you need?','Would you like a refund or an exchange?']}
  };

  const matchItems = [
    {fr:'Ma carte-clé ne fonctionne pas.', ok:"My key card doesn't work.", options:["My key card doesn't work.",'My room is delicious.','My ticket is noisy.']},
    {fr:'Il y a une erreur sur l’addition.', ok:'There is a mistake on the bill.', options:['There is a mistake on the bill.','There are towels on the train.','I am a reservation.']},
    {fr:'Je ne trouve pas le quai 3.', ok:"I can't find platform 3.", options:["I can't find platform 3.",'I can platform three.','I am late the bill.']}
  ];
  const politeItems = [
    {q:'Ask for help', ok:'Could you help me, please?', options:['Help me now.','Could you help me, please?','You help me.']},
    {q:'Ask someone to check', ok:'Could you check it, please?', options:['Check it.','Could you check it, please?','You must check.']},
    {q:'Ask someone to repeat', ok:'Could you repeat, please?', options:['Again!','Repeat.','Could you repeat, please?']}
  ];
  const orderWords = ['Excuse','me,','could','you','help','me,','please?'];
  const formItems = [
    {text:'There ___ a problem with my room.', ok:'is', options:['is','are','doesn’t','don’t']},
    {text:'There ___ no towels in the bathroom.', ok:'are', options:['is','are','doesn’t','don’t']},
    {text:'The Wi-Fi ___ work.', ok:'doesn’t', options:['is','are','doesn’t','don’t']},
    {text:'I ___ understand.', ok:'don’t', options:['is','are','doesn’t','don’t']}
  ];

  function populateVoices(){ voices = speechSynthesis.getVoices ? speechSynthesis.getVoices() : []; }
  function speak(text){ if(!('speechSynthesis' in window)) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); const v = voices.find(x=>x.lang===selectedVoice) || voices.find(x=>x.lang && x.lang.startsWith(selectedVoice.split('-')[0])) || voices[0]; if(v) u.voice=v; u.lang=selectedVoice; u.rate=.86; speechSynthesis.speak(u); }
  function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function setFeedback(el,msg,type){ el.className='feedback '+(type||''); el.innerHTML=msg; }

  function initNav(){ $$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>{ const t=$(b.dataset.scroll); if(t)t.scrollIntoView({behavior:'smooth',block:'start'}); })); $('#printBtn')?.addEventListener('click',()=>window.print()); $('#jsWarning')?.classList.add('hidden'); }
  function initAudio(){ populateVoices(); if('speechSynthesis' in window) speechSynthesis.onvoiceschanged=populateVoices; $$('.voice-btn').forEach(b=>b.addEventListener('click',()=>{ selectedVoice=b.dataset.voice; $$('.voice-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); })); $('#stopVoice')?.addEventListener('click',()=>speechSynthesis.cancel()); document.addEventListener('click',e=>{ const b=e.target.closest('[data-say]'); if(b) speak(b.dataset.say); }); }

  function initWarmup(){ const box=$('#problemChips'), out=$('#problemResult'); problemSentences.forEach((p,i)=>{ const b=document.createElement('button'); b.type='button'; b.className='chip'; b.textContent=p.label; b.addEventListener('click',()=>{ $$('#problemChips .chip').forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); out.innerHTML=`<strong>Model:</strong> ${esc(p.sentence)} <button class="listen-btn compact" type="button" data-say="${esc(p.say)}">▶ Listen</button>`; }); box.appendChild(b); }); }

  function initModels(){ const sel=$('#modelCategory'), bank=$('#sentenceBank'); Object.keys(models).forEach(k=>{ const o=document.createElement('option'); o.value=k; o.textContent=categories[k] || k; sel.appendChild(o); }); function render(){ bank.innerHTML=''; models[sel.value].forEach(m=>{ const card=document.createElement('article'); card.className='sentence-card'; card.innerHTML=`<span class="tag">${esc(m[0])}</span><div class="en">${esc(m[1])}</div><div class="fr">${esc(m[2])}</div><button class="listen-btn compact" type="button" data-say="${esc(m[1])}">▶ Listen</button>`; bank.appendChild(card); }); } sel.addEventListener('change',render); render(); }

  function initVocab(){ const sel=$('#vocabCategory'), grid=$('#vocabGrid'), search=$('#vocabSearch'); Object.keys(categories).forEach(k=>{ const o=document.createElement('option'); o.value=k; o.textContent=categories[k]; sel.appendChild(o); }); function render(){ const q=search.value.trim().toLowerCase(); grid.innerHTML=''; vocab.filter(v=>v[0]===sel.value).filter(v=>!q || v.join(' ').toLowerCase().includes(q)).forEach(v=>{ const card=document.createElement('article'); card.className='vocab-card'; card.innerHTML=`<div class="vocab-icon">${v[1]}</div><h3>${esc(v[2])}</h3><p class="fr">${esc(v[3])}</p><p class="def">${esc(v[4])}</p><p class="ex"><strong>Example:</strong> ${esc(v[5])}</p><button class="listen-btn compact" type="button" data-say="${esc(v[2]+'. '+v[5])}">▶ Listen</button>`; grid.appendChild(card); }); if(!grid.innerHTML) grid.innerHTML='<p class="muted">No vocabulary found. Try another word.</p>'; } sel.addEventListener('change',render); search.addEventListener('input',render); render(); }

  function initPractice(){ const matchBox=$('#matchBox'); matchItems.forEach((it,i)=>{ const div=document.createElement('div'); div.className='choice-row'; div.innerHTML=`<p><strong>${i+1}. ${esc(it.fr)}</strong></p>` + it.options.map(o=>`<label><input type="radio" name="match${i}" value="${esc(o)}"> ${esc(o)}</label>`).join(''); matchBox.appendChild(div); }); $('#checkMatch').addEventListener('click',()=>{ let ok=0; matchItems.forEach((it,i)=>{ const c=$(`input[name="match${i}"]:checked`); if(c && c.value===it.ok) ok++; }); setFeedback($('#matchFeedback'),`${ok}/${matchItems.length} correct. ${ok===matchItems.length?'Excellent!':'Look at the visible model sentences above and try again.'}`, ok===matchItems.length?'good':'try'); });
    const politeBox=$('#politeBox'); politeItems.forEach((it,i)=>{ const div=document.createElement('div'); div.className='choice-row'; div.innerHTML=`<p><strong>${i+1}. ${esc(it.q)}</strong></p>` + it.options.map(o=>`<label><input type="radio" name="polite${i}" value="${esc(o)}"> ${esc(o)}</label>`).join(''); politeBox.appendChild(div); }); $('#checkPolite').addEventListener('click',()=>{ let ok=0; politeItems.forEach((it,i)=>{ const c=$(`input[name="polite${i}"]:checked`); if(c && c.value===it.ok) ok++; }); setFeedback($('#politeFeedback'),`${ok}/${politeItems.length} correct. Remember: Could you + verb + please?`, ok===politeItems.length?'good':'try'); });
    renderOrder(); $('#resetOrder').addEventListener('click',renderOrder); $('#checkOrder').addEventListener('click',()=>{ const ans=$$('#wordOrder .answer-pool .word').map(b=>b.textContent).join(' '); const correct=orderWords.join(' '); setFeedback($('#orderFeedback'), ans===correct ? 'Perfect: Excuse me, could you help me, please?' : `Not yet. Hint: <strong>Excuse me, could you + verb + please?</strong>`, ans===correct?'good':'try'); });
    const formBox=$('#formBox'); formItems.forEach((it,i)=>{ const div=document.createElement('p'); div.innerHTML=esc(it.text).replace('___',`<select class="blank-choice" data-ok="${it.ok}">${it.options.map(o=>`<option>${o}</option>`).join('')}</select>`); formBox.appendChild(div); }); $('#checkForms').addEventListener('click',()=>{ let ok=0; $$('#formBox select').forEach(s=>{ if(s.value===s.dataset.ok) ok++; }); setFeedback($('#formFeedback'),`${ok}/${formItems.length} correct. ${ok===formItems.length?'Great grammar control!':'Check: There is + singular / There are + plural / doesn’t work / I don’t understand.'}`, ok===formItems.length?'good':'try'); });
  }
  function renderOrder(){ const box=$('#wordOrder'); box.innerHTML='<p><strong>Target:</strong> Excuse me, could you help me, please?</p><div class="word-pool"></div><p class="muted">Your answer:</p><div class="answer-pool"></div>'; const pool=box.querySelector('.word-pool'), answer=box.querySelector('.answer-pool'); orderWords.slice().sort(()=>Math.random()-0.5).forEach(w=>{ const b=document.createElement('button'); b.type='button'; b.className='word'; b.textContent=w; b.addEventListener('click',()=>{ if(b.classList.contains('used'))return; const c=b.cloneNode(true); c.addEventListener('click',()=>{ c.remove(); b.classList.remove('used'); }); answer.appendChild(c); b.classList.add('used'); }); pool.appendChild(b); }); }

  function initListening(){ $('#showTranscript').addEventListener('click',()=>$('#transcript').classList.toggle('hidden')); const qs=[['What is the problem?', 'The key card doesn’t work.', ['The key card doesn’t work.','The bill is wrong.','The taxi is late.']], ['What is the room number?', 'Room 214.', ['Room 214.','Room 204.','Room 114.']], ['What is the solution?', 'A new key card.', ['A new key card.','A new room.','A taxi.']]]; const box=$('#listeningQuestions'); qs.forEach((q,i)=>{ const div=document.createElement('div'); div.className='choice-row'; div.innerHTML=`<p><strong>${i+1}. ${q[0]}</strong></p>`+q[2].map(o=>`<label><input type="radio" name="listen${i}" value="${esc(o)}"> ${esc(o)}</label>`).join(''); box.appendChild(div); }); $('#checkListening').addEventListener('click',()=>{ let ok=0; qs.forEach((q,i)=>{ const c=$(`input[name="listen${i}"]:checked`); if(c && c.value===q[1]) ok++; }); setFeedback($('#listeningFeedback'),`${ok}/3 correct. ${ok===3?'Excellent listening!':'Listen again, then reveal the transcript if needed.'}`, ok===3?'good':'try'); }); }

  function initSpeaking(){ const sel=$('#scenarioSelect'); Object.keys(scenarios).forEach(k=>{ const o=document.createElement('option'); o.value=k; o.textContent=scenarios[k].title; sel.appendChild(o); }); function render(){ const s=scenarios[sel.value]; $('#scenarioCard').innerHTML=`<h3>${esc(s.title)}</h3><p><strong>Place:</strong> ${esc(s.place)}</p><p><strong>Problem:</strong> ${esc(s.problem)}</p><p class="model-strip"><strong>Frankie can say:</strong></p><ul>${s.student.map(x=>`<li>${esc(x)} <button class="listen-btn compact" type="button" data-say="${esc(x)}">▶</button></li>`).join('')}</ul>`; $('#followUps').innerHTML=s.questions.map(q=>`<button class="listen-row" type="button" data-say="${esc(q)}"><span>${esc(q)}</span><strong>▶ Listen</strong></button>`).join(''); } sel.addEventListener('change',render); render(); }

  function initWriting(){ $('#buildMessage').addEventListener('click',()=>{ const p=$('#writeProblem').value, d=$('#writeDetail').value || 'Room 214'; $('#messageOutput').value=`Hello,\n\nI have a problem. ${p.charAt(0).toUpperCase()+p.slice(1)}. Could you help me, please? My detail is: ${d}.\n\nThank you,\nFrankie`; }); $('#listenMessage').addEventListener('click',()=>{ const t=$('#messageOutput').value.trim(); if(t) speak(t.replace(/\n+/g,'. ')); }); }

  document.addEventListener('DOMContentLoaded',()=>{ initNav(); initAudio(); initWarmup(); initModels(); initVocab(); initPractice(); initListening(); initSpeaking(); initWriting(); });
})();
