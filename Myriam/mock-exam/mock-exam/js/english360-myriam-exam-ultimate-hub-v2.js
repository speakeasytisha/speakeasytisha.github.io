(function(){
'use strict';
window.__E360Loaded = true;

const $=(s,r)=>(r||document).querySelector(s);
const $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const pad2=n=>(n<10?'0'+n:''+n);
const fmt=s=>pad2(Math.floor(s/60))+':'+pad2(s%60);
const norm=s=>(s||'').toLowerCase().replace(/[^a-z0-9\s’'\-]/g,' ').replace(/\s+/g,' ').trim();
const wc=t=>(t||'').trim().split(/\s+/).filter(Boolean).length;

const state={
  mode:'practice',
  teacher:false,
  level:'A2',
  accent:'US',
  rate:1,
  score:{ok:0,total:0},
  timers:{sp:null},
  ui:{spPromptVisible:false, lisScriptVisible:false},
  lis:{idx:0, choice:null},
  read:{idx:0},
  gram:{idx:0, choice:null},
  fix:{idx:0},
  lib:{limit:20}
};

const isPractice=()=>state.mode==='practice'||state.teacher;

const setScore=()=>{
  $('#scorePill').textContent=`${state.score.ok} / ${state.score.total}`;
  $('#accPill').textContent= state.score.total ? Math.round(state.score.ok/state.score.total*100)+'%' : '0%';
};
const addScore=(ok)=>{ state.score.total++; if(ok) state.score.ok++; setScore(); };
const resetScore=()=>{ state.score.ok=0; state.score.total=0; setScore(); };

const setMode=(m)=>{
  state.mode=m;
  $$('.segBtn[data-mode]').forEach(b=>b.classList.toggle('on', b.dataset.mode===m));
  setSpeakingPromptVisible(isPractice());
  $('#drillHint').style.display = isPractice() ? 'inline-flex' : 'none';
  $('#gHint').style.display = isPractice() ? 'inline-flex' : 'none';
};
const setTeacher=(on)=>{
  state.teacher=!!on;
  const b=$('#teacherToggle');
  b.textContent='Teacher mode: '+(state.teacher?'On':'Off');
  b.setAttribute('aria-pressed', state.teacher?'true':'false');
  setSpeakingPromptVisible(isPractice());
  $('#drillHint').style.display = isPractice() ? 'inline-flex' : 'none';
  $('#gHint').style.display = isPractice() ? 'inline-flex' : 'none';
};
const setLevel=(lvl)=>{
  state.level=lvl;
  $$('.segBtn[data-level]').forEach(b=>b.classList.toggle('on', b.dataset.level===lvl));
  $('#spModel').textContent='—';
  $('#wrModel').textContent='—';
};
const setAccent=(acc)=>{
  state.accent=acc;
  $$('.segBtn[data-accent]').forEach(b=>b.classList.toggle('on', b.dataset.accent===acc));
};

// TTS
const tts={voices:[]};
const loadVoices=()=>{ try{ tts.voices=speechSynthesis.getVoices(); }catch(e){ tts.voices=[]; } };
const pickVoice=()=>{
  const v=tts.voices||[];
  if(!v.length) return null;
  const wants=state.accent==='UK'?['en-GB','United Kingdom','UK']:['en-US','United States','US'];
  for(const x of v) for(const w of wants) if((x.lang||'').includes(w) || (x.name||'').includes(w)) return x;
  for(const x of v) if((x.lang||'').startsWith('en')) return x;
  return v[0];
};
const speak=(text)=>{
  if(!('speechSynthesis' in window) || !text) return;
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.rate=state.rate;
    const v=pickVoice(); if(v) u.voice=v;
    speechSynthesis.speak(u);
  }catch(e){}
};

// Blueprint
const blueprintText=`English 360° exam — structure (official)

1) Listening (Compréhension orale)
• 3 sequences
• 25 questions total
• 4 choices per question

2) Reading (Compréhension écrite)
• 4 texts
• 16 questions total
• varied question types

3) Grammar
• 20 questions total
• varied formats (fill blanks / drag-drop / etc.)

4) Speaking — Interaction
• 6 questions
• 30 seconds to 1 minute per answer

5) Speaking — Production
• 2 questions
• 1 minute per answer

6) Writing
• 2 scenarios
• 125 words required for each
• email reply / professional situation / story from images

Scoring
• Listening/Reading/Grammar: algorithm
• Speaking/Writing: scored by certified native English evaluators

Certificate threshold
• To receive the certificate, the overall grade must be at least A2`;

const emailTemplate=`EMAIL TEMPLATE\nSubject: …\n\nDear …,\n\nI’m writing regarding …\nCould you please …?\nCould you also …?\nIf possible, I would like …\n\nThank you in advance for your assistance.\n\nKind regards,\nMyriam`;
const speakingTemplate=`SPEAKING TEMPLATE (45–60s)\n1) Hello / Excuse me.\n2) Situation / problem.\n3) Polite request (Could you…? Would it be possible…?).\n4) One detail (date/price/preference).\n5) Thank you + closing.`;

// Drills
const drills={
  tenses:[
    {q:'Choose the correct sentence:', opts:['I have been to London yesterday.','I went to London yesterday.','I have went to London yesterday.'], a:1, hint:'Yesterday → past simple.'},
    {q:'Choose the correct sentence:', opts:['I am cooking every Sunday.','I cook every Sunday.','I am cook every Sunday.'], a:1, hint:'Habit → present simple.'},
    {q:'Choose the correct sentence:', opts:['She is going to visit her grandchildren next week.','She went to visit her grandchildren next week.','She visiting next week.'], a:0, hint:'Plan → going to.'}
  ],
  conditionals:[
    {q:'Choose the correct sentence:', opts:['If I will have time, I will practise.','If I have time, I will practise.','If I would have time, I practise.'], a:1, hint:'No “will” in the IF clause.'},
    {q:'Choose the correct sentence:', opts:['If I was rich, I would travel.','If I were rich, I would travel.','If I am rich, I would travel.'], a:1, hint:'Second conditional often uses “were”.'},
    {q:'Choose the correct sentence:', opts:['If I spoke English better, I would visit the USA.','If I speak English better, I would visit.','If I spoke English better, I will visit.'], a:0, hint:'Imaginary now → would.'}
  ],
  requests:[
    {q:'Choose the most polite request:', opts:['Give me a refund.','Could you please refund my ticket?','I want my money.'], a:1, hint:'Use “Could you please…?”'},
    {q:'Choose the best connector:', opts:['because','banana','beautiful'], a:0, hint:'Connector = link ideas.'},
    {q:'Choose the best closing:', opts:['Bye.','Kind regards,','Give me an answer.'], a:1, hint:'Email closing.'}
  ]
};
let activeDrill='tenses', drillIdx=0, drillChoice=null;

const renderDrill=()=>{
  const item=drills[activeDrill][drillIdx];
  $('#drillQ').textContent=`Q${drillIdx+1}/${drills[activeDrill].length} — ${item.q}`;
  $('#drillFb').textContent='—';
  drillChoice=null;
  const host=$('#drillOpts'); host.innerHTML='';
  item.opts.forEach((opt, idx)=>{
    const b=document.createElement('button');
    b.type='button'; b.className='optBtn';
    b.textContent=String.fromCharCode(65+idx)+') '+opt;
    b.addEventListener('click', ()=>{
      drillChoice=idx;
      $$('#drillOpts .optBtn').forEach(x=>x.classList.remove('on'));
      b.classList.add('on');
    });
    host.appendChild(b);
  });
  $('#drillHint').style.display=isPractice()?'inline-flex':'none';
};

const checkDrill=()=>{
  const item=drills[activeDrill][drillIdx];
  if(drillChoice===null){ $('#drillFb').textContent='Choose an option first.'; return; }
  const ok=drillChoice===item.a;
  $('#drillFb').textContent=(ok?'✅ Correct.':'❌ Incorrect.') + (isPractice()?(`\nHint: ${item.hint}\nAnswer: ${String.fromCharCode(65+item.a)}`):'');
  addScore(ok);
};
const nextDrill=()=>{ drillIdx=(drillIdx+1)%drills[activeDrill].length; renderDrill(); };

// Listening
const listening=[
  {prompt:'Announcement: choose the correct information.',
   script:'Attention please. Flight 567 to Tenerife will now depart from gate B twelve. Boarding starts in ten minutes.',
   opts:['The flight is delayed until tomorrow.','The gate is B12 and boarding starts in 10 minutes.','The flight number is 765 and the gate is A12.','Boarding starts in two hours.'], a:1},
  {prompt:'Hotel reception: choose the correct option.',
   script:'Good evening. Breakfast is served from seven to ten. Wi‑Fi is included. Parking is ten euros per night.',
   opts:['Breakfast is 7–10 and Wi‑Fi is included.','Parking is free and breakfast starts at 6.','Wi‑Fi costs 10 euros per night.','Breakfast is all day.'], a:0},
  {prompt:'Shop assistant: choose the correct option.',
   script:'You can exchange the jacket within fourteen days if you have the receipt. Refunds are only possible within seven days.',
   opts:['You can exchange within 14 days with a receipt.','Refunds are possible anytime.','You can exchange without a receipt.','Refunds are possible within 14 days.'], a:0},
  {prompt:'Restaurant: choose the correct option.',
   script:'The sauce contains nuts. Would you like a different dish?',
   opts:['The sauce is nut‑free.','The sauce contains nuts.','There is no alternative dish.','The restaurant is closed.'], a:1}
];

const renderListening=()=>{
  const item=listening[state.lis.idx];
  $('#lisPrompt').textContent=`Q${state.lis.idx+1}/${listening.length} — ${item.prompt}`;
  $('#lisFb').textContent='—';
  state.lis.choice=null;
  state.ui.lisScriptVisible=false;
  $('#lisScript').style.display='none';
  $('#lisScript').textContent=item.script;
  $('#lisScriptBtn').textContent='Show script';
  const host=$('#lisOpts'); host.innerHTML='';
  item.opts.forEach((opt, idx)=>{
    const b=document.createElement('button');
    b.type='button'; b.className='optBtn';
    b.textContent=String.fromCharCode(65+idx)+') '+opt;
    b.addEventListener('click', ()=>{
      state.lis.choice=idx;
      $$('#lisOpts .optBtn').forEach(x=>x.classList.remove('on'));
      b.classList.add('on');
    });
    host.appendChild(b);
  });
};
const toggleLisScript=()=>{
  state.ui.lisScriptVisible=!state.ui.lisScriptVisible;
  $('#lisScript').style.display=state.ui.lisScriptVisible?'block':'none';
  $('#lisScriptBtn').textContent=state.ui.lisScriptVisible?'Hide script':'Show script';
};
const lisPlay=()=>speak(listening[state.lis.idx].script);
const lisNext=()=>{ state.lis.idx=(state.lis.idx+1)%listening.length; renderListening(); };
const lisCheck=()=>{
  const item=listening[state.lis.idx];
  if(state.lis.choice===null){ $('#lisFb').textContent='Choose an option first.'; return; }
  const ok=state.lis.choice===item.a;
  $('#lisFb').textContent= ok ? '✅ Correct.' : `❌ Incorrect. Answer: ${String.fromCharCode(65+item.a)}`;
  addScore(ok);
};

// Reading
const readingTexts=[
  {title:'Hotel email',
   text:`Subject: Your reservation\n\nDear Guest,\nThank you for your message. We confirm availability for a double room from May 4 to May 6.\nThe rate is €120 per night, including taxes. Breakfast and Wi‑Fi are included.\nParking costs €10 per night.\n\nKind regards,\nReservations Team`,
   qs:[{q:'What is the price per night?', answers:['€120','120','120 euros']},
       {q:'Is breakfast included?', answers:['yes','yes it is','yes, breakfast is included']},
       {q:'How much is parking per night?', answers:['€10','10','10 euros']}]},
  {title:'Lost luggage notice',
   text:`Dear Passenger,\nWe are sorry your bag did not arrive.\nPlease complete the online form with your flight number and baggage tag.\nIf we locate the bag, we will deliver it to your hotel within 24 hours.\n\nSincerely,\nBaggage Services`,
   qs:[{q:'What should the passenger complete?', answers:['the online form','online form']},
       {q:'What information is needed?', answers:['flight number and baggage tag','flight number','baggage tag']},
       {q:'Where will they deliver the bag?', answers:['to your hotel','your hotel','hotel']}]},
  {title:'Short article',
   text:`Many adults prefer online lessons because they save travel time and can study at home.\nOne-to-one lessons also allow personalised feedback.\nHowever, some learners prefer face-to-face classes for social interaction.`,
   qs:[{q:'Why do many adults prefer online lessons?', answers:['they save travel time','save travel time','save time']},
       {q:'What is an advantage of one-to-one lessons?', answers:['personalised feedback','feedback']},
       {q:'Why do some prefer face-to-face?', answers:['social interaction','interaction']}]}
];

const renderReading=()=>{
  const item=readingTexts[state.read.idx];
  $('#readText').textContent=item.title+'\n\n'+item.text;
  $('#readFb').textContent='—';
  const host=$('#readQs'); host.innerHTML='';
  item.qs.forEach((q, i)=>{
    const d=document.createElement('div');
    d.className='itemCard';
    d.innerHTML=`<div class="itemTop"><div class="itemTitle">${i+1}) ${q.q}</div><span class="badge small" id="rm${i}">—</span></div>
      <input class="input" data-i="${i}" placeholder="Your answer…"/>`;
    host.appendChild(d);
  });
};
const readNew=()=>{ state.read.idx=(state.read.idx+1)%readingTexts.length; renderReading(); };
const readCheck=()=>{
  const item=readingTexts[state.read.idx];
  const inputs=$$('#readQs input');
  let okCount=0;
  inputs.forEach(inp=>{
    const i=parseInt(inp.dataset.i,10);
    const ans=norm(inp.value);
    const targets=item.qs[i].answers.map(norm);
    let ok=false;
    if(ans) for(const t of targets) if(ans===t || ans.includes(t) || t.includes(ans)){ ok=true; break; }
    $('#rm'+i).textContent=ok?'✅':'❌';
    inp.style.borderColor= ok ? 'rgba(120,255,170,.55)' : 'rgba(255,120,120,.55)';
    if(ok) okCount++;
  });
  $('#readFb').textContent=`Result: ${okCount}/${item.qs.length}`;
  addScore(okCount>=2);
};
const readShow=()=>{
  if(!isPractice()) return;
  const item=readingTexts[state.read.idx];
  $('#readFb').textContent='Answer key:\n'+item.qs.map((q,i)=>`${i+1}) ${q.answers[0]}`).join('\n');
};

// Grammar MCQ
const grammarMCQ=[
  {q:'Choose the correct sentence:', opts:['If I will have time, I will practise.','If I have time, I will practise.','If I would have time, I practise.'], a:1, hint:'No “will” in the IF clause.'},
  {q:'Choose the correct sentence:', opts:['If I spoke English better, I will visit the USA.','If I spoke English better, I would visit the USA.','If I speak English better, I would visit the USA.'], a:1, hint:'Imaginary now → would.'},
  {q:'Choose the correct sentence:', opts:['I have been to Paris yesterday.','I went to Paris yesterday.','I have went to Paris yesterday.'], a:1, hint:'Yesterday → past simple.'},
  {q:'Polite request:', opts:['Give me the bill.','Could we have the bill, please?','I want the bill now.'], a:1, hint:'Use “Could… please?”'},
  {q:'Choose the correct preposition:', opts:['I arrived to the hotel.','I arrived at the hotel.','I arrived on the hotel.'], a:1, hint:'arrive at + place'}
];

const renderGrammar=()=>{
  const item=grammarMCQ[state.gram.idx];
  $('#gQ').textContent=`Q${state.gram.idx+1}/${grammarMCQ.length} — ${item.q}`;
  $('#gFb').textContent='—';
  state.gram.choice=null;
  const host=$('#gOpts'); host.innerHTML='';
  item.opts.forEach((opt, idx)=>{
    const b=document.createElement('button');
    b.type='button'; b.className='optBtn';
    b.textContent=String.fromCharCode(65+idx)+') '+opt;
    b.addEventListener('click', ()=>{
      state.gram.choice=idx;
      $$('#gOpts .optBtn').forEach(x=>x.classList.remove('on'));
      b.classList.add('on');
    });
    host.appendChild(b);
  });
  $('#gHint').style.display=isPractice()?'inline-flex':'none';
};
const gCheck=()=>{
  const item=grammarMCQ[state.gram.idx];
  if(state.gram.choice===null){ $('#gFb').textContent='Choose an option first.'; return; }
  const ok=state.gram.choice===item.a;
  $('#gFb').textContent=(ok?'✅ Correct.':`❌ Incorrect. Answer: ${String.fromCharCode(65+item.a)}`) + (isPractice()?(`\nHint: ${item.hint}`):'');
  addScore(ok);
};
const gNext=()=>{ state.gram.idx=(state.gram.idx+1)%grammarMCQ.length; renderGrammar(); };
const gHint=()=>{ if(isPractice()) $('#gFb').textContent='💡 '+grammarMCQ[state.gram.idx].hint; };

// Fix the sentence
const fixBank=[
  {bad:'If I will have time, I will practise my English.', good:'If I have time, I will practise my English.', why:'No “will” in the IF clause.'},
  {bad:'If I would be rich, I would travel more.', good:'If I were rich, I would travel more.', why:'Second conditional uses “were”.'},
  {bad:'It’s important be responsible.', good:'It’s important to be responsible.', why:'Add “to be”.'},
  {bad:'I have been to London last year.', good:'I went to London last year.', why:'Finished time → past simple.'}
];
const renderFix=()=>{
  const item=fixBank[state.fix.idx];
  $('#fxQ').textContent='Fix this sentence:\n'+item.bad;
  $('#fxBox').value='';
  $('#fxFb').textContent='—';
};
const fxCheck=()=>{
  const item=fixBank[state.fix.idx];
  const user=norm($('#fxBox').value);
  if(!user){ $('#fxFb').textContent='Write your corrected sentence first.'; return; }
  const ok=user===norm(item.good);
  $('#fxFb').textContent= ok ? '✅ Correct.' : `❌ Incorrect.\nCorrect: ${item.good}\nWhy: ${item.why}`;
  addScore(ok);
};
const fxShow=()=>{ if(isPractice()) $('#fxFb').textContent='Answer: '+fixBank[state.fix.idx].good; };
const fxNext=()=>{ state.fix.idx=(state.fix.idx+1)%fixBank.length; renderFix(); };

// Speaking
const speaking=[
  {id:'sp_intro', tag:'Review', title:'Introduce yourself (retired)', prompt:'Introduce yourself: who you are, where you live, your past job, and one personal detail.',
   plan:['Greeting','Name','Where you live','Past job','Personal detail','Close'],
   models:{A2:'Hello. My name is Myriam. I am retired. I live near Strasbourg. Before retiring, I worked in technical support. I enjoy walking and cooking. Thank you.',
           B1:'Hello. My name is Myriam and I’m retired. I live in a small village near Strasbourg. Before retiring, I worked in technical support, helping users solve problems. In my free time, I enjoy walking and spending time with my family. Thank you.',
           B2:'Hello. My name is Myriam and I’ve been retired for a few years. I live in a quiet village near Strasbourg. Before retiring, I worked in technical support, which required patience and clear communication. Nowadays, I enjoy walking in nature, travelling, and spending time with my family. Thank you.'}},
  {id:'sp_train', tag:'New', title:'Train cancelled (options + refund)', prompt:'Your train is cancelled. Ask staff for options and ask about a refund or exchange.',
   plan:['Excuse me','Explain','Ask options','Ask refund/exchange','Close'],
   models:{A2:'Excuse me. My train is cancelled. What can I do? Is there another train today? Can I have a refund, please?',
           B1:'Excuse me, my train was cancelled. Could you tell me what my options are? Is there another train later today? Also, could you explain the refund or exchange policy, please?',
           B2:'Excuse me, I’ve just been informed that my train has been cancelled. Could you please tell me my options—another train, a different route, or an exchange? And could you also explain whether I’m entitled to a refund?'}},
  {id:'sp_pharmacy', tag:'New', title:'Pharmacy (cold + allergy)', prompt:'At a pharmacy, describe symptoms and ask for advice. Ask how to take the medicine.',
   plan:['Greeting','Symptoms','Allergy','Ask advice','Dosage','Close'],
   models:{A2:'Hello. I have a cold and a sore throat. I am allergic to peanuts. What do you recommend? How many times a day should I take it?',
           B1:'Hello, I have a cold with a sore throat and a headache. I also have an allergy, so I need something safe. Could you recommend something and tell me how to take it, please?',
           B2:'Hello, I think I’m coming down with a cold—sore throat, headache, and congestion. I also have an allergy, so I need to be careful. Could you recommend something suitable and explain the dosage and any precautions?'}},
  {id:'sp_hotel_noise', tag:'Review', title:'Hotel (noisy room complaint)', prompt:'Your hotel room is noisy. Explain the problem and ask politely for a solution.',
   plan:['Greeting','Problem','Request','Preference','Close'],
   models:{A2:'Hello. My room is noisy. Could I change rooms, please? If possible, I would like a quiet room. Thank you.',
           B1:'Hello, my room is very noisy at night. Would it be possible to change rooms? If possible, I’d like a quiet room away from the street. Thank you.',
           B2:'Hello, I’m calling because my room is very noisy at night. Would it be possible to move to a quieter room, ideally away from the elevator and the street? Thank you very much.'}},
  {id:'sp_online', tag:'Review', title:'Opinion (online vs face-to-face)', prompt:'Give your opinion: online learning vs face-to-face. Give 2 reasons and a conclusion.',
   plan:['Opinion','Reason 1','Reason 2','However','Conclusion'],
   models:{A2:'In my opinion, online learning is better for me. It saves time and I can learn at home. Overall, it helps me progress.',
           B1:'In my opinion, online learning is better for me because it saves time and is flexible. Also, one‑to‑one lessons help me speak more. Overall, I progress faster.',
           B2:'In my opinion, online learning can be more effective, especially for adults. It saves time and offers flexibility. In addition, one‑to‑one lessons give personalised feedback. However, face‑to‑face learning can be more social. Overall, it depends on the learner.'}}
];

const setSpeakingPromptVisible=(visible)=>{
  state.ui.spPromptVisible=!!visible;
  if(state.ui.spPromptVisible){
    $('#spPh').style.display='none';
    $('#spPrompt').style.display='block';
    $('#spToggle').textContent='Hide prompt';
  }else{
    $('#spPh').style.display='block';
    $('#spPrompt').style.display='none';
    $('#spToggle').textContent='Show prompt';
  }
};

const curSpeaking=()=>speaking.find(s=>s.id===$('#spSel').value) || speaking[0];
const renderSpeaking=()=>{
  const s=curSpeaking();
  $('#spPrompt').textContent=s.prompt;
  setSpeakingPromptVisible(isPractice());
  $('#spModel').textContent='—';
  const host=$('#spChips'); host.innerHTML='';
  s.plan.forEach(p=>{
    const b=document.createElement('button');
    b.type='button'; b.className='chip'; b.textContent=p;
    b.addEventListener('click', ()=>{
      const ta=$('#spNotes');
      ta.value=(ta.value?ta.value+'\n':'') + p + ': ';
    });
    host.appendChild(b);
  });
};

// Speaking timer
const spTimer=(sec)=>{
  if(state.timers.sp) clearInterval(state.timers.sp);
  let left=sec;
  $('#spClock').textContent=fmt(left);
  state.timers.sp=setInterval(()=>{
    left--;
    $('#spClock').textContent=fmt(Math.max(0,left));
    if(left<=0){ clearInterval(state.timers.sp); state.timers.sp=null; }
  },1000);
};
const spStop=()=>{ if(state.timers.sp) clearInterval(state.timers.sp); state.timers.sp=null; $('#spClock').textContent='00:00'; };
const spModel=()=>{ const s=curSpeaking(); $('#spModel').textContent=s.models[state.level]; };

// Writing
const writing=[
  {id:'wr_hotel_info', tag:'Covered', type:'Email reply / request', title:'Hotel — request information',
   prompt:'Write an email to a hotel asking for availability, total price including taxes, what is included, and a quiet room request.',
   must:['Subject line','Greeting','I’m writing…','2 polite requests','Quiet room preference','Closing + name'],
   models:{
     A2:`Subject: Request for information — reservation May 4–6\n\nDear Reservations Team,\n\nI would like to book a double room from May 4 to May 6, 2026.\nCould you please confirm availability and the total price including taxes?\nCould you also tell me what is included (breakfast, Wi‑Fi, parking)?\nIf possible, I would like a quiet room.\n\nThank you in advance for your help.\n\nKind regards,\nMyriam`,
     B1:`Subject: Request for information — reservation May 4–6\n\nDear Reservations Team,\n\nI’m writing to request details before confirming a reservation for a double room from May 4 to May 6, 2026.\nCould you confirm availability and the total price per night including taxes and any extra fees?\nCould you also clarify what is included in the rate (breakfast, Wi‑Fi, parking)?\nIf possible, I’d appreciate a quiet room away from the street.\n\nThank you in advance for your assistance.\n\nKind regards,\nMyriam`,
     B2:`Subject: Request for information — reservation May 4–6\n\nDear Reservations Team,\n\nI’m writing to request details before confirming a reservation for a double room from May 4 to May 6, 2026 (two nights).\nCould you please confirm availability and the total rate including taxes and any additional fees (e.g., city tax or parking)?\nCould you also clarify what is included in the rate (breakfast, Wi‑Fi, and any other services)?\nIf possible, I’d appreciate a quiet room away from the elevator and not facing the street.\n\nThank you for your assistance. I look forward to your confirmation by email.\n\nSincerely,\nMyriam`
   }},
  {id:'wr_train_refund', tag:'New', type:'Email reply / complaint', title:'Train cancelled — refund or exchange',
   prompt:'Write an email asking for a refund or exchange because your train was cancelled. Include ticket details and ask for options.',
   must:['Explain cancellation','Ticket details','Ask options','Request refund/exchange','Polite close'],
   models:{
     A2:`Subject: Request for refund — cancelled train\n\nDear Customer Service,\n\nI am writing because my train was cancelled today.\nMy ticket is from Paris to Strasbourg at 14:30.\nCould you please tell me what I can do? Is there another train today?\nIf it is not possible, could I have a refund, please?\n\nThank you.\n\nKind regards,\nMyriam`,
     B1:`Subject: Cancelled train — refund or exchange request\n\nDear Customer Service,\n\nI’m writing regarding my ticket for the Paris–Strasbourg train today at 14:30. Unfortunately, the train was cancelled.\nCould you please confirm my options? I would like to take the next available train or exchange my ticket for another time.\nIf an exchange is not possible, could you please process a refund and confirm the timeline?\n\nThank you in advance.\n\nKind regards,\nMyriam`,
     B2:`Subject: Cancelled train — request for exchange or refund\n\nDear Customer Service,\n\nI’m writing regarding my Paris–Strasbourg ticket for today (departure 14:30). I was informed that the train was cancelled.\nCould you please confirm the available options (rebooking on the next service, an alternative route, or an exchange for another date)?\nIf rebooking is not possible, I would appreciate a refund. Could you also confirm the procedure and expected processing time?\n\nThank you for your assistance.\n\nSincerely,\nMyriam`
   }},
  {id:'wr_story', tag:'New', type:'Story from images', title:'Story — missed connection (≈125 words)',
   prompt:'Write a short story (≈125 words): travel problem → what you did → how it ended.',
   must:['Past simple','Connectors','Problem → solution → ending','≈125 words'],
   models:{
     A2:`Last weekend, my husband and I travelled by plane. At the airport, our first flight was delayed. Because of the delay, we missed our connection. We felt stressed and we didn’t know what to do. We went to the information desk and explained the situation. The staff helped us and booked us on the next flight. We also received meal vouchers. In the end, we arrived late, but we were relieved.`,
     B1:`Last weekend, my husband and I were travelling and our first flight was delayed. As a result, we missed our connection. At first, we felt stressed because we didn’t know if we would reach our hotel on time. We went to the information desk and explained our situation clearly. The staff rebooked us on the next available flight. In addition, they gave us meal vouchers. In the end, we arrived later than planned, but everything worked out.`,
     B2:`Last weekend, my husband and I were travelling when our first flight was delayed, which caused us to miss our connection. At first, we panicked because we had a hotel reservation and a planned activity. However, we went straight to the airline desk and explained the situation calmly. The agent rebooked us on the next flight and provided meal vouchers. We also informed our hotel about our late arrival. In the end, we arrived late but felt relieved because we managed the situation efficiently.`
   }}
];

const LS='e360_ultimatehub_wr_drafts';
const loadDrafts=()=>{ try{ return JSON.parse(localStorage.getItem(LS)||'{}'); }catch(e){ return {}; } };
const saveDrafts=(d)=>{ try{ localStorage.setItem(LS, JSON.stringify(d)); }catch(e){} };

const curWriting=()=>writing.find(w=>w.id===$('#wrSel').value) || writing[0];
const renderWriting=()=>{
  const w=curWriting();
  $('#wrTag').textContent=w.tag;
  $('#wrType').textContent=w.type;
  $('#wrPrompt').textContent=w.prompt;
  $('#wrMust').textContent='Must include:\n'+w.must.map(x=>'• '+x).join('\n');
  $('#wrModel').textContent='—';
  const d=loadDrafts();
  $('#wrBox').value=d[w.id]||'';
  updateWrCount();
};
const updateWrCount=()=>{
  const n=wc($('#wrBox').value);
  $('#wrWords').textContent=String(n);
  const pct=Math.max(0, Math.min(100, (n/125)*100));
  $('#wrBar').style.width=pct.toFixed(0)+'%';
  const w=curWriting();
  const d=loadDrafts();
  d[w.id]=$('#wrBox').value;
  saveDrafts(d);
};
const wrModel=()=>{ const w=curWriting(); $('#wrModel').textContent=w.models[state.level]; };

// Library
const library = [{"num": "1", "date": "14/10/2025", "title": "Introduction", "tags": "", "urls": ["https://docs.google.com/presentation/d/16wN3gX5CTXnX95Q6oyS3rBiMDfaIce7J/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true"], "desc": "", "cat": "Other"}, {"num": "2", "date": "16/10/2025", "title": "Airport - San Francisco", "tags": "Grammar, Dialogue, Role Play, Vocabulary, Pronunciation", "urls": ["https://docs.google.com/presentation/d/17aCbbGUk17nmmBQtcZEKMh8BHOeYDvQx/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true"], "desc": "\"A2.2 Comprendre : - Écouter : Est capable de comprendre des échanges simples sur des thèmes familiers et suivre des consignes plus complexes.\"", "cat": "Pronunciation & numbers"}, {"num": "3", "date": "21/10/2025", "title": "Car Rental - San Francisco", "tags": "Vocabulary, Comprehension, Comparison", "urls": ["https://docs.google.com/presentation/d/15rFwsI5_OabNY4Fe2S6UtWqL5SZc1HId/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true"], "desc": "\"A2.2 Parler : - S'exprimer oralement en continu : Est capable de faire des descriptions plus précises et raconter des expériences personnelles.\"", "cat": "Travel & service situations"}, {"num": "4", "date": "23/10/2025", "title": "Car Issues, Driving", "tags": "Grammar, Dialogue, Role Play, Vocabulary, Pronunciation,Reading comprehension", "urls": ["https://docs.google.com/presentation/d/1eHXjEAasdu82kMtD9wf2N2sJO8317abk/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true"], "desc": "\"A2.2 Comprendre : - Écouter : Est capable de comprendre des échanges simples sur des thèmes familiers et suivre des consignes plus complexes.\"", "cat": "Pronunciation & numbers"}, {"num": "5", "date": "28/10/2025", "title": "Hotel", "tags": "Grammar, Dialogue, Role Play, Vocabulary, Pronunciation,Reading comprehension", "urls": ["https://docs.google.com/presentation/d/1-QToJfWoRhO9azoeDacgCnRCk3tYu_-O/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true"], "desc": "\"A2.2 Parler : - Prend part à une conversation : Est capable de poser des questions et répondre sur des sujets quotidiens avec plus d’aisance.\"", "cat": "Pronunciation & numbers"}, {"num": "6", "date": "04/11/2025", "title": "Hotel - Check-in/Issues/Where am I?", "tags": "Check-in, room description, there is/there are, prepositions of place, present simple, future simple, issues with the room", "urls": ["https://docs.google.com/presentation/d/1J00yboy0pY6MsedJL_CN4W1aa0jx_Vo9/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true"], "desc": "\"A2.2 Comprendre : - Écouter : Est capable de comprendre des échanges simples sur des thèmes familiers et suivre des consignes plus complexes.\"", "cat": "Travel & service situations"}, {"num": "7", "date": "06/11/2025", "title": "Hotel restaurant/room service", "tags": "Decisions & Choices, CLARIFICATION, CONFIRMING & CHECKING , PRACTICE QUESTIONS , FOOD CATEGORIES , vocabulary", "urls": ["https://docs.google.com/presentation/d/1J00yboy0pY6MsedJL_CN4W1aa0jx_Vo9/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true"], "desc": "\"A2.2 Parler : - Prend part à une conversation : Est capable de poser des questions et répondre sur des sujets quotidiens avec plus d’aisance.\"", "cat": "Speaking & topics"}, {"num": "8", "date": "13/11/2025", "title": "Write a review", "tags": "Dialogue, Check-out, Past Simple, Exercises, Adjectives, Transition words, writing task", "urls": ["https://docs.google.com/presentation/d/18hMNoUH6WlcjSPmIINsRq1kxbub_6L3I/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true"], "desc": "\"A2.2 Ecrire: - Esst capable de rédiger des textes courts plus structurés (e-mails, petites histoires, descriptions).\"", "cat": "Exam prep"}, {"num": "9", "date": "18/11/2025", "title": "Review correction", "tags": "Dialogue, Check-out, Past Simple, Exercises, Adjectives, Transition words, writing task", "urls": ["https://docs.google.com/presentation/d/13tP9l0g9zVtSIVnK01Qx_15mN5F7CNGG/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true"], "desc": "\"A2.2 Ecrire: - Esst capable de rédiger des textes courts plus structurés (e-mails, petites histoires, descriptions).\"", "cat": "Exam prep"}, {"num": "10", "date": "25/11/2025", "title": "Restaurant", "tags": "vocabulary, grammar, exercises, dialogues, role-play", "urls": ["https://sites.google.com/view/speakeasytisha/theme/restaurant-of-the-year?authuser=0"], "desc": "\"A2.2 Parler : - Prend part à une conversation : Est capable de poser des questions et répondre sur des sujets quotidiens avec plus d’aisance.\"", "cat": "Speaking & topics"}, {"num": "11", "date": "27/11/2025", "title": "Thanksgiving", "tags": "vocabulary, reading comprehension, recipes, meals", "urls": ["https://sites.google.com/view/speakeasytisha/theme/thanksgiving?authuser=0"], "desc": "\"A2.2 Comprendre : - Lire : Est capable de comprendre des textes plus détaillés (articles courts, dialogues structurés).\"", "cat": "Other"}, {"num": "12", "date": "02/12/2025", "title": "Restaurant 2", "tags": "dialogue, reading comprehension, vocabulary, writing tasks, role-play", "urls": ["https://sites.google.com/view/speakeasytisha/theme/restaurant-of-the-year?authuser=0"], "desc": "\"A2.2 Ecrire: - Esst capable de rédiger des textes courts plus structurés (e-mails, petites histoires, descriptions).\"", "cat": "Writing"}, {"num": "13", "date": "04/12/2025", "title": "ENGLISH 360°", "tags": "", "urls": [], "desc": "2- Préparation au test", "cat": "Other"}, {"num": "14", "date": "09/12/2025", "title": "Reading Comprehension - Discussions", "tags": "Reading exercises, discussions", "urls": ["https://speakeasytisha.github.io/myriam-reading.html"], "desc": "\"A2.2 Comprendre : - Lire : Est capable de comprendre des textes plus détaillés (articles courts, dialogues structurés).\"", "cat": "Other"}, {"num": "15", "date": "16/12/2025", "title": "ENGLISH 360°", "tags": "Exercises, dialogue, writing, speaking", "urls": ["https://speakeasytisha.github.io/english-360-prep.html"], "desc": "2- Préparation au test", "cat": "Writing"}, {"num": "16", "date": "06/01/2026", "title": "New Year", "tags": "", "urls": ["https://speakeasytisha.github.io/new-year.html"], "desc": "\"B1.1  Parler - Prendre part à une conversation : Discute de manière simple sur des sujets d’intérêt personnel ou professionnel.\"", "cat": "Speaking & topics"}, {"num": "17", "date": "08/01/2026", "title": "Shopping Spree", "tags": "\"✅ Ask for sizes, prices, and help ✅ Use how much / how many ✅ Use polite requests (Could I…?) ✅ Understand UK/US differences\"", "urls": ["https://speakeasytisha.github.io/shopping-spree"], "desc": "1- Atteindre une autonomie fonctionnelle en anglais général dans les situations de communication quotidienne (voyage, vie sociale, échanges simples)", "cat": "Travel & service situations"}, {"num": "18", "date": "13/01/2026", "title": "Shopping Spree", "tags": "1- Atteindre une autonomie fonctionnelle en anglais général dans les situations de communication quotidienne (voyage, vie sociale, échanges simples)", "urls": ["https://speakeasytisha.github.io/shopping-spree-followup-stores"], "desc": "1- Atteindre une autonomie fonctionnelle en anglais général dans les situations de communication quotidienne (voyage, vie sociale, échanges simples)", "cat": "Travel & service situations"}, {"num": "19", "date": "15/01/2026", "title": "Cooking Quest", "tags": "", "urls": ["https://speakeasytisha.github.io/cooking-quest.html"], "desc": "\"B1.1  Parler - Prendre part à une conversation : Discute de manière simple sur des sujets d’intérêt personnel ou professionnel.\"", "cat": "Speaking & topics"}, {"num": "20", "date": "20/01/2026", "title": "Movies", "tags": "", "urls": ["https://speakeasytisha.github.io/movies-lesson"], "desc": "\"B1.1 Comprendre - Lire : Comprend des textes narratifs simples ou des informations pratiques comme des consignes.\"", "cat": "Other"}, {"num": "21", "date": "29/01/2026", "title": "TV Series", "tags": "", "urls": ["https://speakeasytisha.github.io/tv-series-lesson"], "desc": "\"B1.1 Comprendre - Écouter : Comprend des informations essentielles dans des messages clairs et des discussions simples sur des thèmes familiers.\"", "cat": "Other"}, {"num": "22", "date": "03/02/2026", "title": "Entertainment Final", "tags": "", "urls": ["https://speakeasytisha.github.io/people-profile-match", "https://speakeasytisha.github.io/famous-people-describe.html", "https://speakeasytisha.github.io/entertainment-final-wrapup"], "desc": "\"B1.1  Parler - Prendre part à une conversation : Discute de manière simple sur des sujets d’intérêt personnel ou professionnel.\"", "cat": "Speaking & topics"}, {"num": "23", "date": "05/02/2026", "title": "I like doing/I like to do", "tags": "1- Atteindre une autonomie fonctionnelle en anglais général dans les situations de communication quotidienne (voyage, vie sociale, échanges simples)", "urls": ["https://speakeasytisha.github.io/pronunciation-sounds-masterclass#sEs", "https://speakeasytisha.github.io/like-to-vs-like-doing"], "desc": "1- Atteindre une autonomie fonctionnelle en anglais général dans les situations de communication quotidienne (voyage, vie sociale, échanges simples)", "cat": "Other"}, {"num": "24", "date": "10/02/2026", "title": "Numbers-Masterclass", "tags": "numbers-masterclass: phone numbers, room numbers, codes, emails, names, addresses, and cash", "urls": ["https://speakeasytisha.github.io/numbers-masterclass-addon"], "desc": "1- Atteindre une autonomie fonctionnelle en anglais général dans les situations de communication quotidienne (voyage, vie sociale, échanges simples)", "cat": "Pronunciation & numbers"}, {"num": "25", "date": "12/02/2026", "title": "NY Trip Planner", "tags": "build a simple itinerary, and practise requests, suggestions, obligation, and polite disagreement — with NYC‑specific vocabulary and “New York vibe” language.", "urls": ["https://speakeasytisha.github.io/nyc-trip-planner-compare.html"], "desc": "1- Atteindre une autonomie fonctionnelle en anglais général dans les situations de communication quotidienne (voyage, vie sociale, échanges simples)", "cat": "Other"}, {"num": "26", "date": "17/02/2026", "title": "Valentine's Day/Discussion", "tags": "", "urls": ["https://speakeasytisha.github.io/valentines-day-sweet-notes.html"], "desc": "\"B1.1  Parler - Prendre part à une conversation : Discute de manière simple sur des sujets d’intérêt personnel ou professionnel.\"", "cat": "Speaking & topics"}, {"num": "27", "date": "19/02/2026", "title": "ENGLISH 360°", "tags": "Listening → Reading → Grammar → Speaking → Writing. Focus spécial : Speaking + Writing (structure + richesse + vocab pro).", "urls": ["https://speakeasytisha.github.io/english-360-next-step-pack2.html"], "desc": "2- Préparation au test", "cat": "Writing"}, {"num": "28", "date": "24/02/2026", "title": "Professions + Company Titles", "tags": "1- Atteindre une autonomie fonctionnelle en anglais général dans les situations de communication quotidienne (voyage, vie sociale, échanges simples)", "urls": ["https://speakeasytisha.github.io/professions-fun-titles"], "desc": "1- Atteindre une autonomie fonctionnelle en anglais général dans les situations de communication quotidienne (voyage, vie sociale, échanges simples)", "cat": "Other"}, {"num": "29", "date": "03/03/2026", "title": "Newsflash", "tags": "Current events, vocabulary, and the timeline tenses (Present / Past / Past Continuous)", "urls": ["https://speakeasytisha.github.io/newsflash_v2.html"], "desc": "\"B1.1  Parler - Prendre part à une conversation : Discute de manière simple sur des sujets d’intérêt personnel ou professionnel.\"", "cat": "Speaking & topics"}, {"num": "30", "date": "05/03/2026", "title": "ENGLISH 360°", "tags": "Listening • Reading • Grammar • Speaking • Writing", "urls": ["https://speakeasytisha.github.io/english360-travel-exam-success-hub.html"], "desc": "2- Préparation au test", "cat": "Writing"}, {"num": "31", "date": "09/03/2026", "title": "Read the News. Analyse It. React Like a Journalist.", "tags": "", "urls": ["https://speakeasytisha.github.io/newsflash-pro-v2"], "desc": "\"B1.1  Parler - S'exprimer oralement en continu : Raconte des événements passés en liant des phrases claires.\"", "cat": "Other"}, {"num": "32", "date": "24/03/2026", "title": "Writing ENGLISH 360°", "tags": "Email 1 — Request for information (hotel), Email 2 — Reschedule (change dates),", "urls": ["https://speakeasytisha.github.io/english360-miriam-email-speaking-masterclass.html"], "desc": "2- Préparation au test", "cat": "Writing"}, {"num": "33", "date": "26/03/2026", "title": "Writing ENGLISH 360°", "tags": "1) Email — Request for information (reservation), 2) Email — Noise complaint, 3) Email — Lost luggage", "urls": ["https://speakeasytisha.github.io/english360-miriam-email-speaking-masterclass.html"], "desc": "2- Préparation au test", "cat": "Writing"}, {"num": "34", "date": "31/03/2026", "title": "Essay Writing", "tags": "Write essay: tips, vocabulary, connectors, sequencing, tenses", "urls": ["https://docs.google.com/document/d/16a6cDhldMUKpUv_BOtFxP-0FuILcUGoq/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true"], "desc": "\"A2.2 Ecrire: - Esst capable de rédiger des textes courts plus structurés (e-mails, petites histoires, descriptions).\"", "cat": "Writing"}, {"num": "35", "date": "02/04/2026", "title": "Self Introduction Writing/Speaking", "tags": "Introduce yourself: Write essay: tips, vocabulary, connectors, sequencing, tenses", "urls": ["https://docs.google.com/document/d/1lS4cuppy3dP0gdaft0J4vujwKTPdi_U4/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true"], "desc": "\"B1.1 Écrire - Rédige un texte court et structuré sur un sujet familier.\"", "cat": "Writing"}, {"num": "36", "date": "07/04/2026", "title": "Self Introduction (cont)", "tags": "", "urls": ["https://docs.google.com/document/d/1LZLM-LKAQJ3bDr7ZMBjckNG9O88DSud9/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "https://speakeasytisha.github.io/english-360-essay-booster"], "desc": "\"B1.1 Écrire - Rédige un texte court et structuré sur un sujet familier.\"", "cat": "Other"}, {"num": "37", "date": "21/04/2026", "title": "Essay Booster", "tags": "VOCABULARY • CONNECTORS • GUIDED WRITING FRAME • 3 MODEL VERSIONS,  Is online learning better than face-to-face learning?", "urls": ["https://drive.google.com/file/d/1aMkgBlKllyH2cBQx1eo3vIiyuTfuXDel/view?usp=sharing"], "desc": "\"B1.1 Écrire - Rédige un texte court et structuré sur un sujet familier.\"", "cat": "Writing"}, {"num": "38", "date": "28/04/2026", "title": "Hobbies Writing", "tags": "Hobbies Writing", "urls": ["https://cdn.filestackcontent.com/0ohOL122S1S9TLOdIsdc", "https://speakeasytisha.github.io/english360-myriam-hobbies-essay-booster-v2.html"], "desc": "\"B1.1 Écrire - Rédige un texte court et structuré sur un sujet familier.\"", "cat": "Writing"}, {"num": "39", "date": "05/05/2026", "title": "Happy Anniversary ✨", "tags": "", "urls": ["https://speakeasytisha.github.io/english360-myriam-anniversary-honeymoon-lesson.html"], "desc": "\"B1.1 Écrire - Rédige un texte court et structuré sur un sujet familier.\"", "cat": "Other"}, {"num": "40", "date": "07/05/2026", "title": "To die for Places", "tags": "", "urls": ["https://speakeasytisha.github.io/english360-myriam-dream-usa-to-die-for-places-v2.html"], "desc": "\"B1.1  Parler - Prendre part à une conversation : Discute de manière simple sur des sujets d’intérêt personnel ou professionnel.\"", "cat": "Speaking & topics"}, {"num": "41", "date": "19/05/2026", "title": "Hopes and Dreams", "tags": "", "urls": ["https://speakeasytisha.github.io/english360-myriam-hopes-dreams-conditionals-v2.html"], "desc": "\"B1.1  Parler - Prendre part à une conversation : Discute de manière simple sur des sujets d’intérêt personnel ou professionnel.\"", "cat": "Speaking & topics"}, {"num": "42", "date": "21/05/2026", "title": "Values", "tags": "", "urls": ["https://docs.google.com/document/d/12NxBncHbA38i-TIjVJULqyJPcpcHb4BegblJ52XZicM/edit?usp=sharing\"", "https://speakeasytisha.github.io/english360-myriam-values-life-lesson-v3.html"], "desc": "\"B1.1 Écrire - Rédige un texte court et structuré sur un sujet familier.\"", "cat": "Speaking & topics"}, {"num": "43", "date": "26/05/2026", "title": "Midterm Practice", "tags": "", "urls": ["https://speakeasytisha.github.io/english360-myriam-conditional-choice-values-addon.html", "https://speakeasytisha.github.io/english360-myriam-midterm-review-v5.html"], "desc": "2- Préparation au test", "cat": "Exam prep"}, {"num": "44", "date": "", "title": "PREPARATION AU TEST", "tags": "", "urls": [], "desc": "2- Préparation au test", "cat": "Other"}, {"num": "—", "date": "", "title": "English 360° Realistic Mock Exam (Myriam) v3", "tags": "Exam simulation", "urls": ["https://speakeasytisha.github.io/english360-myriam-realistic-mock-exam-v3.html"], "desc": "Full mock exam page (Listening/Reading/Language Use/Speaking/Writing)", "cat": "Exam prep"}, {"num": "—", "date": "", "title": "English 360° Oral Sprint Pack (Myriam)", "tags": "Speaking practice", "urls": ["https://speakeasytisha.github.io/english360-myriam-oral-sprint-pack.html"], "desc": "Oral sprint + models", "cat": "Speaking & topics"}, {"num": "—", "date": "", "title": "English 360° Writing 125-Word Challenge (Myriam)", "tags": "Writing practice", "urls": ["https://speakeasytisha.github.io/english360-myriam-writing-125word-challenge.html"], "desc": "Writing tasks + models + word count", "cat": "Writing"}];
const libCats = (()=>{ const s=new Set(library.map(x=>x.cat)); return ['All', ...Array.from(s).sort((a,b)=>a.localeCompare(b))]; })();
const fillLibCats=()=>{ $('#libCat').innerHTML=libCats.map(c=>`<option value="${c}">${c}</option>`).join(''); $('#libCat').value='All'; };

const linkLabel=(u)=>{
  if(u.includes('docs.google.com/presentation')) return 'Open slides';
  if(u.includes('docs.google.com/document')) return 'Open doc';
  if(u.includes('drive.google.com')) return 'Open file';
  if(u.includes('speakeasytisha.github.io')) return 'Open lesson';
  return 'Open';
};

const renderLib=()=>{
  const cat=$('#libCat').value;
  const q=($('#libSearch').value||'').toLowerCase().trim();
  let list=library.filter(it=>{
    if(cat!=='All' && it.cat!==cat) return false;
    const hay=(it.num+' '+(it.date||'')+' '+it.title+' '+(it.tags||'')+' '+(it.desc||'')).toLowerCase();
    if(q && !hay.includes(q)) return false;
    return true;
  });
  const total=list.length;
  $('#libCount').textContent=`${total} result(s)`;
  const shown=list.slice(0, state.lib.limit);
  const host=$('#libList'); host.innerHTML='';
  shown.forEach(it=>{
    const card=document.createElement('div');
    card.className='itemCard';
    const meta=[it.cat, it.date?('Date: '+it.date):'', it.tags?('Tags: '+it.tags):''].filter(Boolean).join(' • ');
    card.innerHTML=`<div class="itemTop">
      <div>
        <div class="itemTitle">${it.num && it.num!=='—' ? ('Lesson '+it.num+' — ') : ''}${it.title}</div>
        <div class="itemMeta">${meta}</div>
      </div>
      <span class="badge small">${it.cat}</span>
    </div>
    <div class="linkRow"></div>`;
    const lr=card.querySelector('.linkRow');
    (it.urls||[]).slice(0,6).forEach(u=>{
      const a=document.createElement('a');
      a.className='pill pillLink ghost';
      a.href=u; a.target='_blank'; a.rel='noopener';
      a.textContent=linkLabel(u);
      lr.appendChild(a);
    });
    host.appendChild(card);
  });
  const moreBtn=$('#libMore');
  moreBtn.style.display = total>state.lib.limit ? 'inline-flex' : 'none';
};

const showMore=()=>{ state.lib.limit += 20; renderLib(); };
const resetLib=()=>{ state.lib.limit=20; $('#libCat').value='All'; $('#libSearch').value=''; renderLib(); };

const init=()=>{
  $('#jsOk').textContent='JS: ready ✅';
  setScore();

  loadVoices();
  if('speechSynthesis' in window) speechSynthesis.onvoiceschanged = loadVoices;

  // controls
  $$('.segBtn[data-mode]').forEach(b=>b.addEventListener('click', ()=>setMode(b.dataset.mode)));
  $$('.segBtn[data-level]').forEach(b=>b.addEventListener('click', ()=>setLevel(b.dataset.level)));
  $$('.segBtn[data-accent]').forEach(b=>b.addEventListener('click', ()=>setAccent(b.dataset.accent)));
  $('#rate').addEventListener('input', e=>state.rate=parseFloat(e.target.value||'1'));
  $('#teacherToggle').addEventListener('click', ()=>setTeacher(!state.teacher));
  $('#resetScore').addEventListener('click', resetScore);

  // blueprint
  $('#blueprintBox').textContent=blueprintText;
  $('#templateBox').textContent=emailTemplate+'\n\n'+speakingTemplate;

  $('#bpCopy').addEventListener('click', async()=>{ try{ await navigator.clipboard.writeText(blueprintText); }catch(e){} });
  $('#ttsTest').addEventListener('click', ()=>speak('Hello Myriam. This is your English 360 exam preparation hub.'));
  $('#copyTemplates').addEventListener('click', async()=>{ try{ await navigator.clipboard.writeText(emailTemplate+'\n\n'+speakingTemplate); }catch(e){} });

  // drills
  $$('button[data-drill]').forEach(b=>b.addEventListener('click', ()=>{ activeDrill=b.dataset.drill; drillIdx=0; renderDrill(); }));
  $('#drillCheck').addEventListener('click', checkDrill);
  $('#drillNext').addEventListener('click', nextDrill);
  $('#drillHint').addEventListener('click', ()=>{ if(isPractice()) $('#drillFb').textContent='💡 '+drills[activeDrill][drillIdx].hint; });
  renderDrill();

  // listening
  renderListening();
  $('#lisPlay').addEventListener('click', lisPlay);
  $('#lisNext').addEventListener('click', lisNext);
  $('#lisScriptBtn').addEventListener('click', toggleLisScript);
  $('#lisCheck').addEventListener('click', lisCheck);

  // reading
  renderReading();
  $('#readNew').addEventListener('click', readNew);
  $('#readCheck').addEventListener('click', readCheck);
  $('#readShow').addEventListener('click', readShow);

  // grammar/fix
  renderGrammar();
  $('#gCheck').addEventListener('click', gCheck);
  $('#gNext').addEventListener('click', gNext);
  $('#gHint').addEventListener('click', gHint);

  renderFix();
  $('#fxCheck').addEventListener('click', fxCheck);
  $('#fxShow').addEventListener('click', fxShow);
  $('#fxNext').addEventListener('click', fxNext);

  // speaking
  const spSel=$('#spSel');
  spSel.innerHTML=speaking.map(s=>`<option value="${s.id}">[${s.tag}] ${s.title}</option>`).join('');
  spSel.addEventListener('change', renderSpeaking);
  renderSpeaking();

  $('#spToggle').addEventListener('click', ()=>setSpeakingPromptVisible(!state.ui.spPromptVisible));
  $('#spRead').addEventListener('click', ()=>speak($('#spPrompt').textContent));
  $('#sp45').addEventListener('click', ()=>spTimer(45));
  $('#sp60').addEventListener('click', ()=>spTimer(60));
  $('#sp90').addEventListener('click', ()=>spTimer(90));
  $('#spStop').addEventListener('click', spStop);
  $('#spModelBtn').addEventListener('click', spModel);
  $('#spCopyModel').addEventListener('click', async()=>{ try{ await navigator.clipboard.writeText($('#spModel').textContent); }catch(e){} });

  // writing
  const wrSel=$('#wrSel');
  wrSel.innerHTML=writing.map(w=>`<option value="${w.id}">[${w.tag}] ${w.title}</option>`).join('');
  wrSel.addEventListener('change', renderWriting);
  renderWriting();
  $('#wrBox').addEventListener('input', updateWrCount);
  $('#wrClear').addEventListener('click', ()=>{ $('#wrBox').value=''; updateWrCount(); $('#wrModel').textContent='—'; });
  $('#wrModelBtn').addEventListener('click', wrModel);
  $('#wrCopyModel').addEventListener('click', async()=>{ try{ await navigator.clipboard.writeText($('#wrModel').textContent); }catch(e){} });
  $('#wrCopyText').addEventListener('click', async()=>{ try{ await navigator.clipboard.writeText($('#wrBox').value); }catch(e){} });

  // library
  fillLibCats();
  renderLib();
  $('#libCat').addEventListener('change', ()=>{ state.lib.limit=20; renderLib(); });
  $('#libSearch').addEventListener('input', ()=>{ state.lib.limit=20; renderLib(); });
  $('#libMore').addEventListener('click', showMore);
  $('#libReset').addEventListener('click', resetLib);

  // defaults
  setMode('practice');
  setTeacher(false);
  setLevel('A2');
  setAccent('US');
};

window.addEventListener('error', (e)=>{
  const box=$('#errBox');
  if(box){ box.hidden=false; box.textContent='⚠️ '+(e && e.message ? e.message : 'Error'); }
});

document.addEventListener('DOMContentLoaded', init);
})();