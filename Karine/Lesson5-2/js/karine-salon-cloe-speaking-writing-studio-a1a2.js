(function(){
  const DATA = {
    vocabCats:["Self-introduction","Salon services","Customer service","Questions & problem-solving","Writing & speaking connectors"],
    vocab:[
      {cat:"Self-introduction",icon:"👋",term:"I’m Karine.",fr:"Je m'appelle Karine.",def:"a simple way to say your name",ex:"Hello, I’m Karine."},
      {cat:"Self-introduction",icon:"📍",term:"I’m from Saint-Gilles-Croix-de-Vie.",fr:"Je viens de Saint-Gilles-Croix-de-Vie.",def:"say where you are from",ex:"I’m from Saint-Gilles-Croix-de-Vie, in Vendée."},
      {cat:"Self-introduction",icon:"💼",term:"I worked in retail.",fr:"J’ai travaillé dans la vente.",def:"talk about your past job",ex:"Before, I worked in retail in a clothing store."},
      {cat:"Self-introduction",icon:"✂️",term:"I worked as a hairdresser.",fr:"J’ai travaillé comme coiffeuse.",def:"talk about salon experience",ex:"Then, I worked as a hairdresser in a salon."},
      {cat:"Self-introduction",icon:"⭐",term:"I’m patient and friendly.",fr:"Je suis patiente et sympathique.",def:"talk about your qualities",ex:"I’m patient and friendly with customers."},
      {cat:"Self-introduction",icon:"🎯",term:"I would like to improve my English.",fr:"J’aimerais améliorer mon anglais.",def:"express your objective",ex:"I would like to improve my English for work and travel."},

      {cat:"Salon services",icon:"📅",term:"an appointment",fr:"un rendez-vous",def:"a planned time to meet",ex:"Do you have an appointment?"},
      {cat:"Salon services",icon:"🧴",term:"a shampoo",fr:"un shampoing",def:"washing the hair",ex:"Would you like a shampoo?"},
      {cat:"Salon services",icon:"✂️",term:"a haircut",fr:"une coupe",def:"cutting the hair",ex:"I would like a haircut, please."},
      {cat:"Salon services",icon:"💨",term:"a blow-dry",fr:"un brushing",def:"drying and styling the hair",ex:"Would you like a blow-dry as well?"},
      {cat:"Salon services",icon:"🎨",term:"a colour",fr:"une couleur",def:"hair colouring service",ex:"Do you want a colour or highlights?"},
      {cat:"Salon services",icon:"✨",term:"highlights",fr:"des mèches",def:"lighter pieces of hair",ex:"I would like highlights, please."},
      {cat:"Salon services",icon:"💶",term:"the price",fr:"le prix",def:"how much something costs",ex:"What is the price of a haircut?"},
      {cat:"Salon services",icon:"🪞",term:"the mirror",fr:"le miroir",def:"glass you look in",ex:"Please look in the mirror."},

      {cat:"Customer service",icon:"🙂",term:"How can I help you?",fr:"Comment puis-je vous aider ?",def:"a polite service question",ex:"Good morning. How can I help you?"},
      {cat:"Customer service",icon:"👂",term:"to listen carefully",fr:"écouter attentivement",def:"pay close attention",ex:"I listen carefully before I give advice."},
      {cat:"Customer service",icon:"💡",term:"to give advice",fr:"donner des conseils",def:"recommend something",ex:"I can give you advice about your haircut."},
      {cat:"Customer service",icon:"🗣️",term:"to explain clearly",fr:"expliquer clairement",def:"make something easy to understand",ex:"I explain the services clearly."},
      {cat:"Customer service",icon:"🤝",term:"customer contact",fr:"le contact client",def:"contact with clients",ex:"I enjoy customer contact."},
      {cat:"Customer service",icon:"🙏",term:"Thank you for your patience.",fr:"Merci pour votre patience.",def:"polite phrase after waiting",ex:"Thank you for your patience. I will check now."},
      {cat:"Customer service",icon:"✅",term:"Let me check.",fr:"Je vérifie.",def:"say you will verify information",ex:"Let me check the schedule for you."},

      {cat:"Questions & problem-solving",icon:"❓",term:"What day would you like?",fr:"Quel jour souhaitez-vous ?",def:"ask for a day",ex:"What day would you like for your appointment?"},
      {cat:"Questions & problem-solving",icon:"❓",term:"What time would you like?",fr:"Quelle heure souhaitez-vous ?",def:"ask for a time",ex:"What time would you like tomorrow?"},
      {cat:"Questions & problem-solving",icon:"❓",term:"Could you spell your name, please?",fr:"Pouvez-vous épeler votre nom, s’il vous plaît ?",def:"ask politely for spelling",ex:"Could you spell your name, please?"},
      {cat:"Questions & problem-solving",icon:"⏰",term:"We are fully booked.",fr:"Nous sommes complets.",def:"there is no free appointment",ex:"I’m sorry, we are fully booked this afternoon."},
      {cat:"Questions & problem-solving",icon:"🔁",term:"I can offer you another time.",fr:"Je peux vous proposer un autre horaire.",def:"offer another solution",ex:"I can offer you another time tomorrow morning."},
      {cat:"Questions & problem-solving",icon:"💬",term:"I understand.",fr:"Je comprends.",def:"show empathy",ex:"I understand. Let me see what I can do."},
      {cat:"Questions & problem-solving",icon:"🧾",term:"a receipt",fr:"un ticket / reçu",def:"proof of payment",ex:"Would you like a receipt?"},

      {cat:"Writing & speaking connectors",icon:"1️⃣",term:"First, …",fr:"D’abord, …",def:"begin a sequence",ex:"First, I worked in retail."},
      {cat:"Writing & speaking connectors",icon:"2️⃣",term:"Then, …",fr:"Ensuite, …",def:"continue a sequence",ex:"Then, I worked as a hairdresser."},
      {cat:"Writing & speaking connectors",icon:"3️⃣",term:"After that, …",fr:"Après cela, …",def:"add the next step",ex:"After that, I helped many customers."},
      {cat:"Writing & speaking connectors",icon:"➕",term:"Also, …",fr:"Aussi / De plus, …",def:"add information",ex:"Also, I like customer contact."},
      {cat:"Writing & speaking connectors",icon:"💭",term:"In my opinion, …",fr:"À mon avis, …",def:"give an opinion",ex:"In my opinion, good service is very important."},
      {cat:"Writing & speaking connectors",icon:"💡",term:"Because …",fr:"Parce que …",def:"give a reason",ex:"I like this job because I help people."},
      {cat:"Writing & speaking connectors",icon:"🏁",term:"Finally, …",fr:"Enfin, …",def:"finish an answer",ex:"Finally, I would like to improve my English."}
    ],
    grammar:[
      {title:"Present simple", content:`<p><strong>Use:</strong> routines, facts, professional habits.</p><p><strong>Affirmative:</strong> I work in a salon. / You help customers.</p><p><strong>Negative:</strong> I do not work on Sundays.</p><p><strong>Question:</strong> Do you have an appointment?</p><div class="example"><strong>Why it matters for CLOE:</strong> you often need to describe what you do now.</div>`, model:`Model:
I work in a salon. I help customers, I listen carefully, and I give advice.`},
      {title:"Past simple", content:`<p><strong>Use:</strong> finished past actions.</p><p><strong>Affirmative:</strong> I worked in retail. / I helped customers.</p><p><strong>Negative:</strong> I did not work in a salon before.</p><p><strong>Question:</strong> Where did you work before?</p><div class="example"><strong>Why it matters for CLOE:</strong> you may need to present your past experience.</div>`, model:`Model:
First, I worked in retail in a clothing store. Then, I worked as a hairdresser in a salon.`},
      {title:"Future: going to / will", content:`<p><strong>Use:</strong> plans, intentions, simple decisions.</p><p><strong>Going to:</strong> I’m going to improve my English.</p><p><strong>Will:</strong> I will call you tomorrow.</p><p><strong>Question:</strong> Are you going to travel this summer?</p><div class="example"><strong>Why it matters for CLOE:</strong> you may need to talk about your goals or future plans.</div>`, model:`Model:
I’m going to continue practising English, and I will use it more confidently.`},
      {title:"Questions and polite requests", content:`<p><strong>Polite questions:</strong> What time would you like? Could you spell your name, please?</p><p><strong>Polite offers:</strong> Would you like a shampoo?</p><p><strong>Polite problem-solving:</strong> I’m sorry. We are fully booked. I can offer you another time.</p><div class="example"><strong>Why it matters for CLOE:</strong> realistic situations often test polite communication.</div>`, model:`Model:
Good morning. How can I help you? Would you like a shampoo and a blow-dry?`},
      {title:"Connectors for better speaking and writing", content:`<p><strong>Sequence:</strong> First, Then, After that, Finally</p><p><strong>Add ideas:</strong> Also</p><p><strong>Give reasons:</strong> Because</p><p><strong>Give opinions:</strong> In my opinion</p><div class="example"><strong>Why it matters for CLOE:</strong> connectors make your answers clearer and more organised.</div>`, model:`Model:
First, I worked in retail. Then, I worked in a salon. Also, I enjoy customer contact because I like helping people.`}
    ],
    mcq:[
      {id:"m1",p:"Choose the best sentence.",choices:["I work in a salon now.","I worked in a salon now.","I working in a salon now."],a:0,h:"Now = present simple."},
      {id:"m2",p:"Choose the best sentence.",choices:["First, I worked in retail.","First, I work yesterday in retail.","First, I worked in retail now."],a:0,h:"Past simple + connector."},
      {id:"m3",p:"Choose the most polite question.",choices:["How can I help you?","What do you want?","You need what?"],a:0,h:"Use a polite service phrase."},
      {id:"m4",p:"Choose the best answer.",choices:["Would you like a shampoo?","Do you like a shampoo yesterday?","You like shampoo now?"],a:0,h:"Would you like…?"},
      {id:"m5",p:"Choose the best problem-solving phrase.",choices:["I can offer you another time.","No. Impossible.","Come back later maybe."],a:0,h:"Be polite and helpful."},
      {id:"m6",p:"Choose the best sentence.",choices:["I like this job because I help people.","I like this job because help people.","I like this job because I helping people."],a:0,h:"Because + full clause."}
    ],
    fill:[
      {id:"f1",p:"I ____ as a hairdresser in a salon.",opts:["worked","work","working"],a:0,h:"Past experience = worked."},
      {id:"f2",p:"How can I ____ you?",opts:["help","helped","helping"],a:0,h:"Base verb after can."},
      {id:"f3",p:"Would you like a shampoo and a ____ ?",opts:["blow-dry","receipt","discount"],a:0,h:"Salon service."},
      {id:"f4",p:"We are fully ____ this afternoon.",opts:["booked","patient","mirror"],a:0,h:"Fully booked = no free time."},
      {id:"f5",p:"Could you ____ your name, please?",opts:["spell","spelling","spelled"],a:0,h:"Could you + base verb."},
      {id:"f6",p:"First, I worked in retail. ____, I worked in a salon.",opts:["Then","Because","Would"],a:0,h:"Use a sequencing connector."}
    ],
    slotSentences:[
      {id:"s1",target:"I worked in retail before.",parts:[["I","You","She"],["worked","work","working"],["in retail","in a salon","in a receipt"],["before.","now.","tomorrow."]],h:"Past simple: I worked in retail before."},
      {id:"s2",target:"Would you like a shampoo?",parts:[["Would you like","Do you have","Are you"],["a shampoo?","an appointment?","a receipt?"]],h:"Polite offer: Would you like…?"},
      {id:"s3",target:"I can offer you another time.",parts:[["I can","I did","I am"],["offer you","offering you","offered you"],["another time.","hairdresser.","carefully."]],h:"After can, use the base form."},
      {id:"s4",target:"Finally, I would like to improve my English.",parts:[["Finally,","Because,","Do,"],["I would like","I like would","I would likes"],["to improve my English.","my English improve.","to English improve."]],h:"Use Finally + I would like + infinitive."}
    ],
    sequences:[
      {id:"q1",title:"Put the self-introduction in order",lines:["Finally, I would like to improve my English.","First, I worked in retail.","Hello, I’m Karine and I’m from Saint-Gilles-Croix-de-Vie.","Then, I worked as a hairdresser in a salon."],order:[3,2,4,1],h:"Start with who you are, then past experience, then your goal."},
      {id:"q2",title:"Put the salon phone call in order",lines:["Could you spell your name, please?","Good morning. How can I help you?","I would like to make an appointment, please.","Yes, I can offer you Friday at 3 p.m."],order:[2,3,4,1],h:"Greeting → request → offer → final detail."}
    ],
    listening:[
      {id:"l1",title:"Salon appointment call",lines:[
        {who:"Customer",say:"Good morning. I would like to make an appointment, please."},
        {who:"You",say:"Good morning. Of course. What day would you like?"},
        {who:"Customer",say:"Do you have anything on Friday afternoon?"},
        {who:"You",say:"Let me check. Yes, I can offer you Friday at three o’clock."},
        {who:"Customer",say:"That is perfect. Thank you."},
        {who:"You",say:"You’re welcome. Could you spell your name, please?"}
      ],q:[
        ["What does the customer want?","an appointment","a train ticket","a hotel room",0],
        ["When is the appointment?","Friday at 3 o’clock","Thursday at 1 o’clock","Monday at 10 o’clock",0],
        ["What do you ask at the end?","to spell the name","to pay now","to choose a colour",0]
      ]},
      {id:"l2",title:"Customer problem in the salon",lines:[
        {who:"Customer",say:"Hello. I have an appointment at two, but I am a little early."},
        {who:"You",say:"Hello. Thank you for coming. Please wait a moment while I check."},
        {who:"Customer",say:"No problem. I would also like to know the price of a haircut and a blow-dry."},
        {who:"You",say:"Of course. The price is thirty-eight euros in total."},
        {who:"Customer",say:"Perfect. Thank you very much."}
      ],q:[
        ["Why does the customer speak to you?","for an appointment and information","to buy a jacket","to ask for directions",0],
        ["What service does the customer ask about?","a haircut and a blow-dry","highlights only","a manicure",0],
        ["How much is the total?","38 euros","28 euros","48 euros",0]
      ]}
    ],
    speaking:[
      {id:"sp1",label:"Present yourself for the CLOE exam",prompt:"Speak for 45 to 60 seconds. Introduce yourself, say where you are from, explain your work experience, and finish with your English goal.",starters:["Hello, I’m Karine.","I’m from Saint-Gilles-Croix-de-Vie.","First, I worked in retail.","Then, I worked as a hairdresser in a salon.","I enjoy customer contact.","Finally, I would like to improve my English."],modelA1:"Hello, I’m Karine. I’m from Saint-Gilles-Croix-de-Vie. First, I worked in retail. Then, I worked as a hairdresser in a salon. I like customer contact. Finally, I would like to improve my English.",modelA2:"Hello, I’m Karine and I’m from Saint-Gilles-Croix-de-Vie, in Vendée. First, I worked in retail in a clothing store. Then, I worked as a hairdresser in a salon. I enjoy customer contact because I like helping people and giving advice. Finally, I would like to improve my English for work and travel."},
      {id:"sp2",label:"Make or confirm an appointment",prompt:"Roleplay: a customer calls the salon. Ask the right questions, give an available time, and end politely.",starters:["Good morning. How can I help you?","What day would you like?","What time would you like?","Let me check.","I can offer you Friday at 3 p.m.","Could you spell your name, please?"],modelA1:"Good morning. How can I help you? What day would you like? Let me check. I can offer you Friday at 3 p.m. Could you spell your name, please?",modelA2:"Good morning. How can I help you? Of course, I can help you make an appointment. What day and time would you prefer? Let me check the schedule. I can offer you Friday at 3 p.m. Is that OK for you? Could you spell your name, please?"},
      {id:"sp3",label:"Advise a customer",prompt:"Roleplay: a customer asks for advice about a haircut or colour. Ask a simple question and give gentle advice.",starters:["How can I help you?","What would you like today?","I can give you some advice.","In my opinion, this style is a good idea.","It is easy to maintain.","Would you like to try it?"],modelA1:"How can I help you? What would you like today? I can give you some advice. In my opinion, this style is a good idea. Would you like to try it?",modelA2:"Good afternoon. What would you like today? I can give you some advice if you want. In my opinion, this style would suit you because it is easy to maintain and it looks natural. Would you like to try it?"},
      {id:"sp4",label:"Solve a small problem politely",prompt:"Roleplay: the salon is fully booked today. Apologise, show empathy, and offer another solution.",starters:["I understand.","I’m sorry, we are fully booked today.","Let me check.","I can offer you another time.","Would tomorrow morning be OK for you?","Thank you for your patience."],modelA1:"I understand. I’m sorry, we are fully booked today. Let me check. I can offer you another time tomorrow. Is that OK for you?",modelA2:"I understand. I’m sorry, but we are fully booked today. Let me check the schedule. I can offer you another appointment tomorrow morning or Thursday afternoon. Would one of those times be OK for you? Thank you for your patience."}
    ],
    writing:[
      {id:"w1",title:"Write about yourself",prompt:"Write 8 to 10 lines to present yourself for the CLOE exam. Include: your name, where you are from, your past work, your qualities, and your English goal.",check:["karine","from","worked","retail","hairdresser","english"],modelA1:"Hello,\n\nI’m Karine. I’m from Saint-Gilles-Croix-de-Vie.\nFirst, I worked in retail.\nThen, I worked as a hairdresser in a salon.\nI am patient and friendly.\nFinally, I would like to improve my English.\n\nThank you.",modelA2:"Hello,\n\nMy name is Karine and I’m from Saint-Gilles-Croix-de-Vie, in Vendée.\nFirst, I worked in retail in a clothing store.\nThen, I worked as a hairdresser in a salon.\nI enjoy customer contact because I like listening carefully and giving advice.\nFinally, I would like to improve my English for work and travel.\n\nKind regards,\nKarine"},
      {id:"w2",title:"Confirm a salon appointment",prompt:"Write a short message to confirm a customer’s appointment. Include the day, time, service and a polite ending.",check:["appointment","friday","haircut","thank"],modelA1:"Hello,\n\nYour appointment is confirmed for Friday at 3 p.m.\nIt is for a haircut and a blow-dry.\nThank you.\n\nKind regards,\nKarine",modelA2:"Hello,\n\nI confirm your appointment for Friday at 3 p.m. at the salon.\nYour appointment is for a haircut and a blow-dry.\nIf you need to change the time, please let us know.\n\nThank you and see you soon.\nKind regards,\nKarine"},
      {id:"w3",title:"Reply to a customer problem",prompt:"A customer wants an appointment today, but the salon is fully booked. Write a polite reply and offer another solution.",check:["sorry","fully booked","offer","another","time"],modelA1:"Hello,\n\nI’m sorry, we are fully booked today.\nI can offer you another time tomorrow.\nIs that OK for you?\n\nThank you,\nKarine",modelA2:"Hello,\n\nI understand. I’m sorry, but we are fully booked today.\nLet me check the schedule. I can offer you another appointment tomorrow morning or Thursday afternoon.\nPlease let me know which time is best for you.\n\nKind regards,\nKarine"},
      {id:"w4",title:"Describe good customer service",prompt:"Write 6 to 8 lines to explain what good customer service means to you in a salon.",check:["customer","help","listen","advice","because"],modelA1:"Good customer service is important.\nI help customers and I listen carefully.\nI am polite and friendly.\nI give advice.\nI think it is important because customers want to feel comfortable.",modelA2:"In my opinion, good customer service is very important in a salon.\nFirst, you need to welcome the customer politely.\nThen, you should listen carefully and understand what the customer wants.\nAlso, you should explain clearly and give helpful advice.\nThis is important because customers want to feel comfortable and confident."}
    ]
  };

  const $ = (s,e=document)=>e.querySelector(s);
  const $$ = (s,e=document)=>Array.from(e.querySelectorAll(s));
  const dbg = $('#debug');
  const log = (m)=>{ try{ dbg.classList.remove('hidden'); dbg.textContent += '\n'+m; }catch(err){} };
  window.addEventListener('error',e=>log('ERROR: '+e.message+' line '+e.lineno));
  const safeOn=(el,ev,fn)=>{ if(el) el.addEventListener(ev,fn); };
  const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const norm=s=>String(s??'').toLowerCase().replace(/[’]/g,"'").replace(/\s+/g,' ').replace(/\s+([,.?!])/g,'$1').trim();
  const shuffle=(arr)=>{ const a=(arr||[]).slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

  const Score = {
    now:0,max:120,done:new Set(),
    award(k,p=1){ if(this.done.has(k)) return; this.done.add(k); this.now += p; updateScore(); },
    reset(){ this.now=0; this.done.clear(); updateScore(); }
  };

  function updateScore(){
    $('#scoreNow').textContent = Score.now;
    $('#scoreMax').textContent = Score.max;
    $('#bar').style.width = Math.min(100, Math.round(Score.now/Score.max*100)) + '%';
  }
  function feed(id,type,msg){ const box = $('#'+id); if(!box) return; box.className='feed '+type; box.innerHTML=msg; box.classList.remove('hidden'); }
  function hideFeed(id){ const el=$('#'+id); if(el) el.classList.add('hidden'); }

  const TTS = {
    lang:'en-US', voiceName:'', voices:[],
    async load(){
      if(!('speechSynthesis' in window)) return;
      this.voices = speechSynthesis.getVoices();
      if(!this.voices.length){
        await new Promise(resolve=>{
          let done = false;
          speechSynthesis.onvoiceschanged = ()=>{ if(done) return; done=true; this.voices = speechSynthesis.getVoices(); resolve(); };
          setTimeout(()=>{ if(done) return; done=true; this.voices = speechSynthesis.getVoices(); resolve(); },700);
        });
      }
      renderVoices();
    },
    voice(){
      const v = this.voices || [];
      return v.find(x=>x.name===this.voiceName) || v.find(x=>(x.lang||'')===this.lang) || v.find(x=>(x.lang||'').startsWith('en')) || null;
    },
    say(t){
      if(!('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(t||''));
      u.lang = this.lang;
      const v=this.voice(); if(v) u.voice=v;
      u.rate=.95;
      speechSynthesis.speak(u);
    },
    stop(){ try{ speechSynthesis.cancel(); }catch(err){} }
  };
  function renderVoices(){
    const sel = $('#voiceSelect');
    if(!sel) return;
    sel.innerHTML = '<option value="">Auto English voice</option>';
    (TTS.voices||[]).filter(v=>(v.lang||'').startsWith('en')).forEach(v=>{
      const o=document.createElement('option');
      o.value=v.name;
      o.textContent=v.name+' — '+v.lang;
      sel.appendChild(o);
    });
  }
  function setLang(l){
    TTS.lang = l;
    $('#usBtn').classList.toggle('on', l==='en-US');
    $('#ukBtn').classList.toggle('on', l==='en-GB');
  }

  const V = { cat: DATA.vocabCats[0], open:new Set() };
  function renderVocabCat(){
    $('#vocabCat').innerHTML = DATA.vocabCats.map(c=>`<option>${esc(c)}</option>`).join('');
    $('#vocabCat').value = V.cat;
  }
  function renderVocab(){
    const grid = $('#vocabGrid');
    grid.innerHTML='';
    DATA.vocab.filter(x=>x.cat===V.cat).forEach(it=>{
      const key = it.cat+'|'+it.term;
      const isOpen = V.open.has(key);
      const card=document.createElement('div');
      card.className='card vcard';
      card.innerHTML = `<div class="vtop"><div class="term">${esc(it.icon)} ${esc(it.term)}</div><div><button class="smallBtn" type="button" data-act="sound">🔊</button> <button class="smallBtn" type="button" data-act="toggle">${isOpen?'Hide':'Reveal'}</button></div></div><div ${isOpen?'':'class="hidden"'} data-box><p><strong>FR:</strong> ${esc(it.fr)}</p><p><strong>Meaning:</strong> ${esc(it.def)}</p><p><strong>Example:</strong> ${esc(it.ex)}</p></div>`;
      safeOn(card.querySelector('[data-act="sound"]'),'click',()=>TTS.say(it.term+'. '+it.ex));
      safeOn(card.querySelector('[data-act="toggle"]'),'click',()=>{ if(V.open.has(key)) V.open.delete(key); else V.open.add(key); renderVocab(); });
      grid.appendChild(card);
    });
  }
  function vocabQuiz(){
    const list=shuffle(DATA.vocab.filter(x=>x.cat===V.cat)).slice(0,5);
    const html = list.map((it,i)=>{
      const opts=shuffle([it.fr,'un avion','une gare']);
      return `<div class="card"><strong>${esc(it.term)}</strong>${opts.map(o=>`<label class="choice"><input type="radio" name="vq${i}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join('')}</div>`;
    }).join('');
    feed('vocabFeed','warn',`<strong>Quick quiz</strong>${html}<button class="btn" id="vocabCheckInline" type="button">Check quiz</button>`);
    safeOn($('#vocabCheckInline'),'click',()=>{
      let good=0;
      list.forEach((it,i)=>{
        const c = $(`input[name="vq${i}"]:checked`);
        if(c && c.value===it.fr) good++;
      });
      feed('vocabFeed', good>=4?'ok':'warn', `Score: <strong>${good}/${list.length}</strong>`);
      Score.award('vocabQuiz'+V.cat, good);
    });
  }

  function renderGrammarPick(){
    $('#grammarPick').innerHTML = DATA.grammar.map((g,i)=>`<option value="${i}">${esc(g.title)}</option>`).join('');
  }
  function renderGrammar(){
    const g = DATA.grammar[Number($('#grammarPick').value||0)];
    $('#grammarBox').innerHTML = g.content;
    $('#grammarMiniModel').classList.add('hidden');
    $('#grammarMiniModel').textContent = g.model;
  }

  function oneByOne(items, hostId, feedId, prefix, points, renderer){
    let idx=0, order=[];
    function cur(){ return items.find(x=>x.id===order[idx]); }
    return {
      start(){ order=shuffle(items.map(x=>x.id)); idx=0; renderer(cur(), $('#'+hostId)); hideFeed(feedId); },
      next(){ if(!order.length) this.start(); else { idx=(idx+1)%order.length; renderer(cur(), $('#'+hostId)); hideFeed(feedId); } },
      check(){ const item=cur(); if(!item) return; const val = $(`#${hostId} input:checked`)?.value ?? $(`#${hostId} select`)?.value; const ok = String(val)===String(item.a); feed(feedId, ok?'ok':'bad', ok?'Correct!':'Not quite.'); if(ok) Score.award(prefix+item.id,points); },
      hint(){ const item=cur(); if(item) feed(feedId,'warn','Hint: '+esc(item.h)); }
    };
  }

  const mcq = oneByOne(DATA.mcq,'mcqHost','mcqFeed','mcq',2,(it,h)=>{
    h.innerHTML = `<strong>${esc(it.p)}</strong>` + it.choices.map((c,i)=>`<label class="choice"><input name="mcqA" type="radio" value="${i}"><span>${esc(c)}</span></label>`).join('');
  });
  const fill = oneByOne(DATA.fill,'fillHost','fillFeed','fill',2,(it,h)=>{
    h.innerHTML = `<strong>${esc(it.p)}</strong><div class="row"><select class="select">${it.opts.map((o,i)=>`<option value="${i}">${esc(o)}</option>`).join('')}</select></div>`;
  });

  const Slot = { idx:0 };
  function renderSlot(){
    const item = DATA.slotSentences[Slot.idx];
    const host = $('#slotHost'); host.innerHTML='';
    item.parts.forEach((part,i)=>{
      host.innerHTML += `<div class="slotrow"><span class="sectionTag">Part ${i+1}</span><select class="select" data-slot="${i}">${part.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select></div>`;
    });
    $$('[data-slot]').forEach(sel=>safeOn(sel,'change',updateSlotOut));
    updateSlotOut();
    hideFeed('slotFeed');
  }
  function updateSlotOut(){
    const sent = $$('[data-slot]').map(s=>s.value).join(' ').replace(/\s+([,.?!])/g,'$1');
    $('#slotOut').textContent = sent;
  }
  function checkSlot(){
    const item = DATA.slotSentences[Slot.idx];
    const ok = norm($('#slotOut').textContent)===norm(item.target);
    feed('slotFeed', ok?'ok':'bad', ok?'Correct sentence!':'Not quite. Check word order.');
    if(ok) Score.award('slot'+item.id,4);
  }
  function nextSlot(){ Slot.idx = (Slot.idx+1)%DATA.slotSentences.length; renderSlot(); }

  function renderSeqPick(){ $('#seqPick').innerHTML = DATA.sequences.map((s,i)=>`<option value="${i}">${esc(s.title)}</option>`).join(''); }
  function renderSeq(){
    const seq = DATA.sequences[Number($('#seqPick').value||0)];
    $('#seqHost').innerHTML = seq.lines.map((line,i)=>`<div class="seqLine"><select class="select" data-seq="${i}"><option value="">?</option><option>1</option><option>2</option><option>3</option><option>4</option></select><div class="card">${esc(line)}</div></div>`).join('');
    hideFeed('seqFeed');
  }
  function checkSeq(){
    const seq = DATA.sequences[Number($('#seqPick').value||0)];
    let good=0;
    seq.order.forEach((n,i)=>{ if($(`[data-seq="${i}"]`).value===String(n)) good++; });
    feed('seqFeed', good===seq.order.length?'ok':'warn', `Score: <strong>${good}/${seq.order.length}</strong>`);
    if(good===seq.order.length) Score.award('seq'+seq.id,8);
  }

  function renderListenPick(){ $('#listenPick').innerHTML = DATA.listening.map((l,i)=>`<option value="${i}">${esc(l.title)}</option>`).join(''); }
  function renderListen(showText){
    const item = DATA.listening[Number($('#listenPick').value||0)];
    const box = $('#listenDialogue'); box.innerHTML='';
    item.lines.forEach((ln,i)=>{
      box.innerHTML += `<div class="bubble ${ln.who==='You'?'b':'a'}"><div class="who">${esc(ln.who)}</div><div>${showText?esc(ln.say):'<span class="sectionTag">Text hidden</span>'}</div><button class="smallBtn" type="button" data-line="${i}">Listen</button></div>`;
    });
    $$('[data-line]').forEach(btn=>safeOn(btn,'click',()=>TTS.say(item.lines[Number(btn.dataset.line)].say)));
    $('#listenQuestions').innerHTML = item.q.map((q,i)=>`<div class="card"><strong>Q${i+1}. ${esc(q[0])}</strong>${[q[1],q[2],q[3]].map((c,ci)=>`<label class="choice"><input type="radio" name="lq${i}" value="${ci}"><span>${esc(c)}</span></label>`).join('')}</div>`).join('');
    hideFeed('listenFeed');
  }
  function playDialogue(){
    const item = DATA.listening[Number($('#listenPick').value||0)];
    let i=0;
    const next = ()=>{
      if(i>=item.lines.length) return;
      TTS.say(item.lines[i].say);
      i++;
      setTimeout(next,1900);
    };
    next();
  }
  function checkListen(){
    const item = DATA.listening[Number($('#listenPick').value||0)];
    let good=0;
    item.q.forEach((q,i)=>{ const c=$(`input[name="lq${i}"]:checked`); if(c && Number(c.value)===q[4]) good++; });
    feed('listenFeed', good===item.q.length?'ok':'warn', `Score: <strong>${good}/${item.q.length}</strong>`);
    if(good===item.q.length) Score.award('listen'+item.id,8);
  }

  function renderSpeakPick(){ $('#speakPick').innerHTML = DATA.speaking.map((s,i)=>`<option value="${i}">${esc(s.label)}</option>`).join(''); }
  function curSpeak(){ return DATA.speaking[Number($('#speakPick').value||0)]; }
  function renderSpeak(){
    const s = curSpeak();
    $('#speakPrompt').textContent = s.prompt;
    $('#starterBox').innerHTML = s.starters.map(st=>`<div class="row"><button class="smallBtn" type="button" data-say="${esc(st)}">🔊</button><span>${esc(st)}</span></div>`).join('');
    $$('[data-say]').forEach(btn=>safeOn(btn,'click',()=>TTS.say(btn.dataset.say)));
    $('#speakModelBox').classList.add('hidden');
    $('#speakModelBox').innerHTML = `<span class="badge pink">Model A1</span><p>${esc(s.modelA1)}</p><span class="badge aqua">Model A2</span><p>${esc(s.modelA2)}</p>`;
    renderOralBuilder();
  }
  function renderOralBuilder(){
    const s = curSpeak();
    $('#oralBuilder').innerHTML = s.starters.map(st=>`<label class="choice"><input type="checkbox" value="${esc(st)}"><span>${esc(st)}</span></label>`).join('');
    $$('#oralBuilder input').forEach(ch=>safeOn(ch,'change',updateOralOut));
    updateOralOut();
    hideFeed('oralFeed');
  }
  function updateOralOut(){
    const txt = $$('#oralBuilder input:checked').map(i=>i.value).join(' ');
    $('#oralOut').textContent = txt || 'Choose useful phrases above.';
  }
  function checkOral(){
    const txt = $('#oralOut').textContent.toLowerCase();
    const ok = txt.length>35 && (txt.includes('help')||txt.includes('worked')||txt.includes('appointment')||txt.includes('english')||txt.includes('advice'));
    feed('oralFeed', ok?'ok':'warn', ok?'Good oral structure. Practise it aloud 3 times.' : 'Choose more phrases and build a more complete answer.');
    if(ok) Score.award('oral'+$('#speakPick').value,6);
  }

  function renderWritePick(){ $('#writePick').innerHTML = DATA.writing.map((w,i)=>`<option value="${i}">${esc(w.title)}</option>`).join(''); }
  function curWrite(){ return DATA.writing[Number($('#writePick').value||0)]; }
  function renderWrite(){
    const w = curWrite();
    $('#writePrompt').textContent = w.prompt;
    $('#writeText').value='';
    $('#writeModel').classList.add('hidden');
    $('#writeModel').textContent = '';
    hideFeed('writeFeed');
  }
  function showWriteModel(){
    const w = curWrite();
    $('#writeModel').classList.remove('hidden');
    $('#writeModel').textContent = `Model A1:\n${w.modelA1}\n\nModel A2:\n${w.modelA2}`;
  }
  function checkWrite(){
    const w = curWrite();
    const low = $('#writeText').value.toLowerCase();
    let good=0;
    w.check.forEach(k=>{ if(low.includes(k)) good++; });
    const threshold = Math.ceil(w.check.length * .65);
    feed('writeFeed', good>=threshold?'ok':'warn', `Self-check: <strong>${good}/${w.check.length}</strong> key ideas included.`);
    if(good>=threshold) Score.award('write'+w.id,8);
  }
  function insertAtCursor(area,text){
    const a = area.selectionStart ?? area.value.length;
    const b = area.selectionEnd ?? area.value.length;
    area.value = area.value.slice(0,a) + text + area.value.slice(b);
    area.focus();
    area.setSelectionRange(a+text.length,a+text.length);
  }

  async function init(){
    Score.max=120; updateScore(); await TTS.load(); $('#jsStatus').textContent='JS ✅ loaded';
    safeOn($('#usBtn'),'click',()=>{ setLang('en-US'); TTS.say('US accent selected.'); });
    safeOn($('#ukBtn'),'click',()=>{ setLang('en-GB'); TTS.say('UK accent selected.'); });
    safeOn($('#voiceSelect'),'change',e=>{ TTS.voiceName = e.target.value; TTS.say('Voice selected.'); });
    safeOn($('#testVoice'),'click',()=>TTS.say('Hello Karine. Welcome to your CLOE speaking and writing studio.'));
    safeOn($('#stopVoice'),'click',()=>TTS.stop());
    safeOn($('#resetAll'),'click',()=>{
      if(confirm('Reset the page?')){
        Score.reset();
        V.open.clear();
        renderVocab();
        renderGrammar();
        renderSlot();
        renderSeq();
        renderListen(false);
        renderSpeak();
        renderWrite();
        hideFeed('vocabFeed'); hideFeed('mcqFeed'); hideFeed('fillFeed'); hideFeed('slotFeed'); hideFeed('seqFeed'); hideFeed('listenFeed'); hideFeed('oralFeed'); hideFeed('writeFeed');
      }
    });
    safeOn($('#startBtn'),'click',()=>$('#vocabSec').scrollIntoView({behavior:'smooth'}));
    safeOn($('#howBtn'),'click',()=>alert('Use the page step by step. Audio is manual only. Practise the speaking and writing activities with your teacher, and use the model answers to compare your work.'));

    renderVocabCat(); renderVocab();
    safeOn($('#vocabCat'),'change',e=>{ V.cat=e.target.value; renderVocab(); hideFeed('vocabFeed'); });
    safeOn($('#revealAll'),'click',()=>{ DATA.vocab.filter(x=>x.cat===V.cat).forEach(x=>V.open.add(x.cat+'|'+x.term)); renderVocab(); });
    safeOn($('#hideAll'),'click',()=>{ DATA.vocab.filter(x=>x.cat===V.cat).forEach(x=>V.open.delete(x.cat+'|'+x.term)); renderVocab(); });
    safeOn($('#vocabQuizBtn'),'click',vocabQuiz);

    renderGrammarPick(); renderGrammar();
    safeOn($('#grammarPick'),'change',renderGrammar);
    safeOn($('#showGrammarMiniModel'),'click',()=>$('#grammarMiniModel').classList.toggle('hidden'));

    safeOn($('#mcqStart'),'click',()=>mcq.start());
    safeOn($('#mcqCheck'),'click',()=>mcq.check());
    safeOn($('#mcqHint'),'click',()=>mcq.hint());
    safeOn($('#mcqNext'),'click',()=>mcq.next());

    safeOn($('#fillStart'),'click',()=>fill.start());
    safeOn($('#fillCheck'),'click',()=>fill.check());
    safeOn($('#fillHint'),'click',()=>fill.hint());
    safeOn($('#fillNext'),'click',()=>fill.next());

    renderSlot();
    safeOn($('#slotNew'),'click',nextSlot);
    safeOn($('#slotCheck'),'click',checkSlot);
    safeOn($('#slotHint'),'click',()=>feed('slotFeed','warn','Hint: '+esc(DATA.slotSentences[Slot.idx].h)));
    safeOn($('#slotListen'),'click',()=>TTS.say($('#slotOut').textContent));

    renderSeqPick(); renderSeq();
    safeOn($('#seqPick'),'change',renderSeq);
    safeOn($('#seqReset'),'click',renderSeq);
    safeOn($('#seqHint'),'click',()=>feed('seqFeed','warn','Hint: '+esc(DATA.sequences[Number($('#seqPick').value||0)].h)));
    safeOn($('#seqCheck'),'click',checkSeq);

    renderListenPick(); renderListen(false);
    safeOn($('#listenPick'),'change',()=>renderListen(false));
    safeOn($('#showTranscript'),'click',()=>renderListen(true));
    safeOn($('#hideTranscript'),'click',()=>renderListen(false));
    safeOn($('#playDialogue'),'click',playDialogue);
    safeOn($('#listenCheck'),'click',checkListen);
    safeOn($('#listenHint'),'click',()=>feed('listenFeed','warn','Hint: Listen for the main words: appointment, day, time, price, haircut.'));

    renderSpeakPick(); renderSpeak();
    safeOn($('#speakPick'),'change',renderSpeak);
    safeOn($('#showSpeakModel'),'click',()=>$('#speakModelBox').classList.remove('hidden'));
    safeOn($('#hideSpeakModel'),'click',()=>$('#speakModelBox').classList.add('hidden'));
    safeOn($('#playSpeakModel'),'click',()=>TTS.say(curSpeak().modelA2));
    safeOn($('#oralListen'),'click',()=>TTS.say($('#oralOut').textContent));
    safeOn($('#oralCheck'),'click',checkOral);
    safeOn($('#oralReset'),'click',renderOralBuilder);

    renderWritePick(); renderWrite();
    safeOn($('#writePick'),'change',renderWrite);
    safeOn($('#showWriteModel'),'click',showWriteModel);
    safeOn($('#hideWriteModel'),'click',()=>$('#writeModel').classList.add('hidden'));
    safeOn($('#writeCheck'),'click',checkWrite);
    safeOn($('#writeListen'),'click',()=>TTS.say($('#writeText').value));
    safeOn($('#writeClear'),'click',()=>{ $('#writeText').value=''; hideFeed('writeFeed'); });
    $$('[data-insert]').forEach(btn=>safeOn(btn,'click',()=>insertAtCursor($('#writeText'), btn.dataset.insert)));
  }

  init();
})();
