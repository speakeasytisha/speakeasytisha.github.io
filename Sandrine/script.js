(() => {
  const STORAGE_KEY = "welcome_sandrine_roadmap_v4";
  let currentStep = 0;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  const differenceData = {
    transport:{
      uk:{label:"UK ENGLISH",term:"return ticket · platform",example:"Could I have a return ticket to London, please?"},
      us:{label:"US ENGLISH",term:"round-trip ticket · track",example:"Could I get a round-trip ticket, please?"}
    },
    hotel:{
      uk:{label:"UK ENGLISH",term:"holiday · ground floor",example:"We are on holiday and we booked a family room."},
      us:{label:"US ENGLISH",term:"vacation · first floor",example:"We are on vacation and we booked a family room."}
    },
    car:{
      uk:{label:"UK ENGLISH",term:"car hire · petrol",example:"Where is the car hire desk? Does the car take petrol?"},
      us:{label:"US ENGLISH",term:"car rental · gas",example:"Where is the car rental desk? Does the car take gas?"}
    },
    restaurant:{
      uk:{label:"UK ENGLISH",term:"bill · takeaway",example:"Could we have the bill, please? Is takeaway possible?"},
      us:{label:"US ENGLISH",term:"check · takeout",example:"Could we have the check, please? Is takeout possible?"}
    },
    everyday:{
      uk:{label:"UK ENGLISH",term:"toilet · queue",example:"Excuse me, where are the toilets? Is this the queue?"},
      us:{label:"US ENGLISH",term:"restroom · line",example:"Excuse me, where is the restroom? Is this the line?"}
    }
  };

  const vocab = {
    airport:[
      ["✈","boarding pass","carte d’embarquement","Could you show me where I can download my boarding pass?"],
      ["🧳","checked baggage","bagage en soute","Is checked baggage included in the ticket?"],
      ["→","departure gate","porte d’embarquement","Has the departure gate changed?"],
      ["⏱","delay","retard","Do you know how long the delay will be?"]
    ],
    train:[
      ["🚆","platform","quai","Which platform does the train leave from?"],
      ["↔","connection","correspondance","Do I have enough time for my connection?"],
      ["🎟","return ticket","billet aller-retour","I’d like a return ticket to London, please."],
      ["⚠","cancelled","annulé","Has the train been cancelled?"]
    ],
    accommodation:[
      ["⌂","booking","réservation","I have a booking under the name…"],
      ["🔑","check in","s’enregistrer / prendre la chambre","What time can we check in?"],
      ["🛏","family room","chambre familiale","Do you have a family room available?"],
      ["?","available","disponible","Is the room available for three nights?"]
    ],
    car:[
      ["🚗","car hire","location de voiture","Where can I pick up the hire car?"],
      ["⛽","petrol / gas","essence","Should I return the car with a full tank?"],
      ["🛡","insurance","assurance","What does the insurance cover?"],
      ["📋","damage","dégât","There is a small scratch on the door."]
    ],
    restaurant:[
      ["🍽","book a table","réserver une table","I’d like to book a table for four."],
      ["🥗","dish","plat","What is the most popular dish?"],
      ["✓","recommend","recommander","What would you recommend?"],
      ["💳","bill / check","addition","Could we have the bill, please?"]
    ],
    problems:[
      ["!","There seems to be a problem…","Il semble y avoir un problème…","There seems to be a problem with our booking."],
      ["↺","Could you check again?","Pourriez-vous vérifier à nouveau ?","Could you check the reservation again, please?"],
      ["?","What are our options?","Quelles sont nos options ?","The train is cancelled. What are our options?"],
      ["✓","That would be perfect.","Ce serait parfait.","A later room would be fine. That would be perfect."]
    ]
  };

  const interestData = {
    films:["Films can help you describe stories, give opinions and compare characters.","Possible language: past tenses · adjectives · recommendations · because / although"],
    music:["Music gives you an easy way to talk about taste, memories and emotions.","Possible language: preferences · comparisons · present perfect · descriptive vocabulary"],
    hiking:["Hiking is ideal for storytelling, directions, landscape vocabulary and planning.","Possible language: past experiences · directions · weather · should / need to / have to"],
    environment:["Environment topics can develop opinion language and practical vocabulary.","Possible language: cause & effect · agree/disagree · habits · comparatives"],
    space:["Space gives us a motivating way to work on facts, possibility and imagination.","Possible language: future · may / might · facts vs predictions · question forms"],
    ocean:["Oceans can combine science, travel, nature and environmental discussion.","Possible language: description · quantities · change over time · opinion phrases"],
    podcasts:["Podcasts fit your listen-first preference and give us authentic short listening tasks.","Possible language: key-word listening · paraphrasing · useful expressions · pronunciation"],
    travel:["Travel lets us combine planning, problem-solving, interaction and storytelling.","Possible language: requests · questions · past trips · future plans · polite clarification"]
  };

  function toast(message){
    const t=$("#toast"); t.textContent=message; t.classList.add("show");
    clearTimeout(toast.timer); toast.timer=setTimeout(()=>t.classList.remove("show"),1700);
  }

  function saveState(){
    const fields={};
    $$('[data-save]').forEach((el,i)=>{ const key=el.id||`field_${i}`; fields[key]=el.type==='checkbox'?el.checked:el.value; });
    localStorage.setItem(STORAGE_KEY,JSON.stringify({fields,currentStep,trainerMode:document.body.classList.contains('trainer-mode')}));
    $("#saveState").textContent="Saved"; clearTimeout(saveState.timer); saveState.timer=setTimeout(()=>$("#saveState").textContent="Ready",850);
  }

  function loadState(){
    try{
      const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'); if(!data) return;
      currentStep=Number.isInteger(data.currentStep)?data.currentStep:0;
      $$('[data-save]').forEach((el,i)=>{ const key=el.id||`field_${i}`; if(key in data.fields){ if(el.type==='checkbox') el.checked=!!data.fields[key]; else el.value=data.fields[key]; } });
      document.body.classList.toggle('trainer-mode',!!data.trainerMode);
    }catch(e){ console.warn(e); }
  }

  function showStep(n){
    currentStep=Math.max(0,Math.min(7,Number(n)));
    $$('.step-panel').forEach(p=>p.classList.toggle('is-active',Number(p.dataset.panel)===currentStep));
    $$('.step-link').forEach(b=>b.classList.toggle('is-active',Number(b.dataset.step)===currentStep));
    const panel=$(`.step-panel[data-panel="${currentStep}"]`); $("#topTitle").textContent=panel?.dataset.title||"Your English roadmap";
    const pct=Math.round((currentStep+1)/8*100); $("#progressLabel").textContent=`Section ${currentStep+1} of 8`; $("#progressPercent").textContent=pct+'%'; $("#progressFill").style.width=pct+'%';
    window.scrollTo({top:0,behavior:'smooth'}); saveState();
  }

  function speak(text,lang='en-GB'){
    if(!('speechSynthesis' in window)){toast('Audio is not available in this browser'); return;}
    speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang=lang; u.rate=.9; speechSynthesis.speak(u);
  }

  function renderDifference(){
    const key=$("#differenceSelect").value; const d=differenceData[key];
    $("#differenceCard").innerHTML=[d.uk,d.us].map((x,i)=>`<div class="difference-side"><span>${x.label}</span><strong>${x.term}</strong><p>${x.example}</p><button type="button" class="audio-btn" data-say="${escapeAttr(x.example)}" data-lang="${i===0?'en-GB':'en-US'}">▶ Listen</button></div>`).join('');
  }

  function renderVocab(){
    const rows=vocab[$("#vocabCategory").value]||[];
    $("#vocabList").innerHTML=rows.map(r=>`<div class="vocab-row"><span class="icon">${r[0]}</span><b>${r[1]}</b><em>${r[2]}</em><p>${r[3]}</p><button type="button" class="audio-btn" aria-label="Listen" data-say="${escapeAttr(r[3])}" data-lang="en-GB">▶</button></div>`).join('');
  }

  function escapeAttr(s){ return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function roadmapSummary(){
    return `YOUR ENGLISH ROADMAP\n\nTRAINING FRAMEWORK\n- General English\n- 30 hours\n- Current rhythm: 1 hour per week during work time, with the possibility of increasing later\n- Reference level communicated: A2.2\n- Direction: stronger A2+ / B1 communication and greater autonomy\n\nWHAT YOU WANT\n- Speak with more confidence and spontaneity\n- Become more autonomous in real-life situations\n- Strengthen useful vocabulary and practical grammar\n- Understand spoken English more comfortably\n- Recognise British and American vocabulary and expressions\n- Use English confidently when travelling\n\nYOUR ENGLISH EXPERIENCE\n- About three years in Scotland around age 20\n- Hotel and restaurant work with international communication\n- Travel around Scotland including the countryside, Loch Ness, islands, Glasgow and castles\n- Later experience living in Germany and working on a military base\n- English is something to reactivate, not something completely new\n\nHOW YOU LEARN BEST\n- Listen first, then read\n- See a model/example before speaking\n- Use another English example when possible\n- Correction can vary: immediate, reformulation or grammar explanation depending on the activity\n- Short writing homework is welcome\n- Support first, then progressively more autonomy\n\nTRAVEL PRIORITIES\n- Airport and train\n- Hotel and accommodation rentals\n- Car hire\n- Restaurants\n- Asking for information\n- Handling simple problems\n- Future London family trip as a practical project\n\nINTERESTS WE CAN USE\nFilms · music · hiking · environment · space · oceans · travel · podcasts · BBC Learning English\n\nTENTATIVE 30-HOUR PROGRAMME\n1. Hours 1–4: Reconnect & build confidence\n2. Hours 5–10: Travel essentials\n3. Hours 11–15: Understand real spoken English\n4. Hours 16–20: Grammar & vocabulary that transfer\n5. Hours 21–26: Broader conversation & London project\n6. Hours 27–30: Autonomy, consolidation & final preparation\n\nThis sequence is intentionally flexible and can be adapted according to progress, priorities and the final assessment once confirmed.${$("#learnerFinalNote").value.trim()?`\n\nYOUR NOTE\n${$("#learnerFinalNote").value.trim()}`:''}`;
  }

  function downloadText(name,text){ const blob=new Blob([text],{type:'text/plain;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),300); }

  async function copyText(text){
    try{await navigator.clipboard.writeText(text);}catch(e){ const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove(); }
    toast('Roadmap summary copied');
  }

  function bind(){
    $$('.step-link').forEach(b=>b.addEventListener('click',()=>showStep(b.dataset.step)));
    $$('[data-next]').forEach(b=>b.addEventListener('click',()=>showStep(b.dataset.next)));
    $$('[data-back]').forEach(b=>b.addEventListener('click',()=>showStep(b.dataset.back)));
    $("#frToggle").addEventListener('click',()=>{ document.body.classList.toggle('show-fr'); $("#frToggle").textContent=document.body.classList.contains('show-fr')?'Hide FR':'FR support'; });
    $("#trainerToggle").addEventListener('click',()=>{ document.body.classList.toggle('trainer-mode'); $("#trainerToggle").textContent=document.body.classList.contains('trainer-mode')?'Hide trainer notes':'Trainer notes'; saveState(); });
    $("#printBtn").addEventListener('click',()=>window.print());
    document.addEventListener('input',e=>{if(e.target.matches('[data-save]')) saveState();});
    document.addEventListener('change',e=>{if(e.target.matches('[data-save]')) saveState();});
    $("#differenceSelect").addEventListener('change',renderDifference);
    $("#vocabCategory").addEventListener('change',renderVocab);
    document.addEventListener('click',e=>{
      const audio=e.target.closest('[data-say]'); if(audio){speak(audio.dataset.say,audio.dataset.lang||'en-GB'); return;}
      const interest=e.target.closest('[data-interest]'); if(interest){
        $$('.interest-cloud button').forEach(b=>b.classList.remove('active')); interest.classList.add('active');
        const d=interestData[interest.dataset.interest]; $("#interestDetail").innerHTML=`<span>HOW WE CAN USE THIS</span><h3>${interest.querySelector('b').textContent}</h3><p>${d[0]}</p><p style="margin-top:7px;color:#d8bd96">${d[1]}</p>`;
      }
      const toggle=e.target.closest('.module-toggle'); if(toggle){ const card=toggle.closest('.module-card'); card.classList.toggle('collapsed'); const open=!card.classList.contains('collapsed'); toggle.textContent=open?'−':'+'; toggle.setAttribute('aria-expanded',String(open)); }
    });
    $("#copySummary").addEventListener('click',()=>copyText(roadmapSummary()));
    $("#downloadSummary").addEventListener('click',()=>downloadText('English_Roadmap_First_Session.txt',roadmapSummary()));
    $("#finishBtn").addEventListener('click',()=>{ $("#agreeDirection").checked=true; saveState(); toast('Roadmap reviewed — ready for the next lesson'); });
  }

  loadState(); bind(); renderDifference(); renderVocab(); showStep(currentStep);
  $("#trainerToggle").textContent=document.body.classList.contains('trainer-mode')?'Hide trainer notes':'Trainer notes';
})();
