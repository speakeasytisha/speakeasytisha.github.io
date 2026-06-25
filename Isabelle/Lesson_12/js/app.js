const state = { score: 0, awarded: new Set(), timer: null, remaining: 60, currentParagraph: 0 };

const choiceSets = {
  applicationChoice: {
    feedback: 'applicationFeedback',
    answer: 'Speculative application – Real Estate Legal & Commercial Professional',
    options: [
      'General cover letter – Company internship',
      'Speculative application – Real Estate Legal & Commercial Professional',
      'Application as real estate',
      'My wish to work in Amsterdam'
    ],
    success: 'Exactly. “Speculative application” is clear, professional and suitable for a letter sent without a vacancy.'
  },
  broersmaChoice: {
    feedback: 'broersmaFeedback',
    answer: 'Having explored Broersma’s website, I was particularly interested in your client-focused residential, lettings and new-build services.',
    options: [
      'I like your company very much and I want to work with you.',
      'Having explored Broersma’s website, I was particularly interested in your client-focused residential, lettings and new-build services.',
      'I need a job in Amsterdam, so I am contacting your agency.',
      'Your website is beautiful and I like houses.'
    ],
    success: 'Exactly. This sentence proves that you researched the agency and connects your interest to real services.'
  }
};

const orderItems = [
  {id:'agency', text:'Show why the agency interests you.'},
  {id:'experience', text:'Give the most relevant professional evidence.'},
  {id:'value', text:'Explain the value you can bring to clients or teams.'},
  {id:'next', text:'Close with a confident request for a conversation.'}
];
const correctOrder = ['agency','experience','value','next'];

const vocab = [
  {cat:'application', term:'speculative application', fr:'candidature spontanée', def:'An application sent without responding to a specific vacancy.', ex:'I am sending a speculative application to real estate agencies in Amsterdam.'},
  {cat:'application', term:'unsolicited application', fr:'candidature non sollicitée', def:'An application not requested by an advertised role.', ex:'Please find attached my unsolicited application for future opportunities.'},
  {cat:'application', term:'open application', fr:'candidature ouverte', def:'A broad application; this wording may appear on Dutch careers pages.', ex:'The company invites candidates to submit an open application.'},
  {cat:'application', term:'targeted application', fr:'candidature ciblée', def:'An application adapted to one employer using specific company information.', ex:'A targeted application is stronger than a generic letter.'},
  {cat:'application', term:'future opportunity', fr:'opportunité future', def:'A role that may become available later.', ex:'I would be grateful if you would consider my profile for future opportunities.'},
  {cat:'agency', term:'property letting', fr:'mise en location / location immobilière', def:'The service of renting a property on behalf of an owner.', ex:'The agency provides property letting and property-search services.'},
  {cat:'agency', term:'new-build consultancy', fr:'conseil en immobilier neuf', def:'Professional advice for newly built property projects.', ex:'My property-development experience is relevant to new-build consultancy.'},
  {cat:'agency', term:'project marketing', fr:'marketing de programme immobilier', def:'Marketing a new development or property project.', ex:'The company offers project marketing and sales support.'},
  {cat:'agency', term:'tailored advice', fr:'conseil sur mesure', def:'Advice adapted to a client’s individual needs.', ex:'I value tailored advice and long-term client relationships.'},
  {cat:'agency', term:'property search', fr:'recherche de bien', def:'Helping a client find a suitable property.', ex:'Property-search services require careful listening and local knowledge.'},
  {cat:'profile', term:'legal and commercial background', fr:'double compétence juridique et commerciale', def:'Experience combining legal and business or sales skills.', ex:'My legal and commercial background helps me understand a transaction from two perspectives.'},
  {cat:'profile', term:'property development', fr:'promotion immobilière', def:'The process of developing real estate projects.', ex:'I worked in property development for major French developers.'},
  {cat:'profile', term:'contract negotiation', fr:'négociation de contrats', def:'Discussing and agreeing the terms of a contract.', ex:'I have experience in contract negotiation and risk analysis.'},
  {cat:'profile', term:'urban planning', fr:'urbanisme', def:'The planning and regulation of land and development.', ex:'I later specialised in urban planning and construction law.'},
  {cat:'profile', term:'stakeholder coordination', fr:'coordination des parties prenantes', def:'Working with the people and organisations involved in a project.', ex:'My work required stakeholder coordination with notaries, lawyers and investors.'},
  {cat:'communication', term:'client-focused', fr:'centré sur le client', def:'Designed around the client’s needs and expectations.', ex:'I bring a client-focused approach to real estate projects.'},
  {cat:'communication', term:'listen carefully to', fr:'écouter attentivement', def:'To pay close attention to what a person says.', ex:'I listen carefully to clients before making recommendations.'},
  {cat:'communication', term:'offer appropriate advice', fr:'proposer des conseils adaptés', def:'To give advice that matches the situation or client’s needs.', ex:'I aim to offer appropriate advice based on each client’s needs.'},
  {cat:'communication', term:'make recommendations', fr:'faire des recommandations', def:'To suggest the best option after analysing a situation.', ex:'I make recommendations after assessing clients’ needs and priorities.'},
  {cat:'communication', term:'long-term client relationship', fr:'relation client à long terme', def:'A professional relationship built over time and based on trust.', ex:'I value long-term client relationships built on trust and clear communication.'},
  {cat:'placement', term:'professional immersion placement', fr:'immersion professionnelle', def:'A short placement intended to gain first-hand experience of a professional environment.', ex:'I would be open to a short professional immersion placement as an initial step.'},
  {cat:'placement', term:'work-experience placement', fr:'stage d’observation / expérience professionnelle courte', def:'A temporary placement to observe and gain experience in a workplace.', ex:'A work-experience placement could help me understand the Dutch real estate market.'},
  {cat:'placement', term:'host agency', fr:'agence d’accueil', def:'The organisation that receives someone for a placement.', ex:'The host agency would receive practical details before making a decision.'},
  {cat:'placement', term:'placement agreement', fr:'convention de stage / accord de placement', def:'A formal document setting out the conditions of a placement.', ex:'The exact placement agreement must be confirmed before any arrangement is made.'}
];

const upgrades = [
  {
    label:'Company connection',
    starter:'By looking at your website, I sincerely like Broersma’s style and values.',
    better:'After reviewing your website, I was particularly impressed by Broersma’s distinctive style and client-focused approach.',
    pro:'Having explored Broersma’s website, I was immediately drawn to its distinctive style, broad range of services and client-focused approach.',
    why:'“Having explored” sounds polished, and the final version adds concrete value instead of only saying that you like the company.'
  },
  {
    label:'Professional motivation',
    starter:'My passion for beautiful houses begun when I was young.',
    better:'My interest in property began at an early age.',
    pro:'My long-standing interest in property led me to study law and later specialise in urban planning and construction law, with the aim of building a career in real estate.',
    why:'The professional version keeps your personal motivation but connects it directly to your education and career choices.'
  },
  {
    label:'Your experience',
    starter:'I worked for 24 years in the real estate sector, successively as a property sales manager and then as a real estate specialist.',
    better:'I have worked in the real estate sector for 24 years, first as a Sales Manager and later as a Real Estate Legal Specialist.',
    pro:'For the past 24 years, I have worked in the French real estate sector, combining sales management, property development and legal advisory work.',
    why:'The final version highlights your rare combination of skills rather than simply listing two job titles.'
  },
  {
    label:'Your client strength',
    starter:'I have a great sense of listening and customer satisfaction.',
    better:'I listen carefully to clients and focus on understanding their needs.',
    pro:'I listen carefully to clients and stakeholders in order to understand their needs, anticipate risks and offer appropriate advice.',
    why:'English uses “listen carefully to”, while “customer satisfaction” is usually a result, not a personal skill.'
  },
  {
    label:'Your language message',
    starter:'I speak and write fluent French, English, Spanish and I have started learning Dutch.',
    better:'I am fluent in French, have conversational Spanish and am currently developing my professional English and Dutch.',
    pro:'My native French, conversational Spanish and continuing development of professional English and Dutch support my integration into an international real estate environment.',
    why:'This version is accurate, professional and consistent with a CV that describes English as a work in progress.'
  },
  {
    label:'Your closing',
    starter:'I stay at your disposal for any further information you may require and for call.',
    better:'I would be pleased to provide any further information you may require and to arrange a call.',
    pro:'I would welcome the opportunity to discuss how my profile could support your team, either in an immediate role or in a future opportunity aligned with my experience.',
    why:'The professional version is active, specific and invites a realistic next step.'
  }
];

const speakingPrompts = [
  {
    q:'Why are you sending a speculative application to Broersma?',
    models:{
      B1:'I am sending a speculative application because I am interested in working in real estate in Amsterdam. I like Broersma’s style and I would like to learn more about the company.',
      B1plus:'I am sending a speculative application because I am interested in Broersma’s client-focused approach and its work in residential property, lettings and new-build projects. My legal and commercial background could be relevant to future opportunities.',
      B2:'Having explored Broersma’s services, I was particularly interested in the combination of residential property, lettings and new-build consultancy. My 24 years of legal and commercial real estate experience could allow me to contribute to a client-focused team and to support future opportunities aligned with my profile.'
    }
  },
  {
    q:'How would you describe your professional profile to an agency manager?',
    models:{
      B1:'I have worked in real estate for 24 years. I have experience in sales and legal work. I studied law and I like working with clients.',
      B1plus:'I have worked in the French real estate sector for 24 years, first as a Sales Manager and later as a Real Estate Legal Specialist. I have experience in property development, contracts and client relations.',
      B2:'I am a real estate legal and commercial professional with 24 years of experience in the French property sector. My profile combines sales management, legal advisory work, contract negotiation, property-development expertise and coordination with clients and external partners.'
    }
  },
  {
    q:'What is your approach to client communication?',
    models:{
      B1:'I listen to clients before I speak. I want to understand what they need.',
      B1plus:'I listen carefully to clients before making recommendations. This helps me understand their needs and give them appropriate advice.',
      B2:'I listen carefully to clients and stakeholders in order to understand their priorities, anticipate potential issues and offer practical, appropriate advice. This client-focused approach has been important throughout my sales and legal experience.'
    }
  },
  {
    q:'How could you mention a short placement without sounding junior?',
    models:{
      B1:'I am open to a short work-experience placement to learn about the Dutch real estate market.',
      B1plus:'If relevant, I would be open to a short professional immersion placement as an initial opportunity to gain experience of the Dutch real estate market.',
      B2:'If relevant, I would also be open to a short professional immersion placement supported by a French employment programme, as an initial opportunity to gain first-hand experience of the Dutch real estate market. I would be pleased to provide practical details once the relevant arrangement has been confirmed.'
    }
  }
];

function award(key, points){
  if(!state.awarded.has(key)){
    state.awarded.add(key);
    state.score = Math.min(100, state.score + points);
    document.getElementById('score').textContent = state.score;
    document.getElementById('progressBar').style.width = `${state.score}%`;
  }
}

function normalize(value){ return value.trim().toLowerCase().replace(/[’']/g, "'").replace(/\s+/g,' '); }

function makeChoices(id, config){
  const host=document.getElementById(id);
  config.options.forEach(opt=>{
    const btn=document.createElement('button');
    btn.type='button'; btn.className='choice-btn'; btn.textContent=opt;
    btn.addEventListener('click',()=>{
      host.querySelectorAll('button').forEach(b=>b.classList.remove('correct','wrong'));
      const feedback=document.getElementById(config.feedback);
      if(opt===config.answer){btn.classList.add('correct'); feedback.textContent=config.success; feedback.style.color='#2b7658'; award(id,8);}
      else{btn.classList.add('wrong'); feedback.textContent='Good try. Look for the option that names the application or agency detail clearly and professionally.'; feedback.style.color='#a34352';}
    });
    host.appendChild(btn);
  });
}

function populateOrder(){
  const host=document.getElementById('orderTask');
  const shuffled=[...orderItems].sort(()=>Math.random()-.5);
  shuffled.forEach(item=>{
    const row=document.createElement('div'); row.className='order-item';
    row.innerHTML=`<select data-id="${item.id}" aria-label="Choose order for ${item.text}"><option value="">Order</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select><span>${item.text}</span>`;
    host.appendChild(row);
  });
  document.getElementById('checkOrder').addEventListener('click',()=>{
    const selects=[...host.querySelectorAll('select')];
    const right=selects.every(s=>Number(s.value)===correctOrder.indexOf(s.dataset.id)+1);
    const fb=document.getElementById('orderFeedback');
    if(right){fb.textContent='Perfect. The order is: 1. Agency connection → 2. Relevant experience → 3. Value you bring → 4. Clear next step.';fb.style.color='#2b7658';award('order',8);}else{fb.textContent='Use this order: 1. Agency connection → 2. Relevant experience → 3. Value you bring → 4. Clear next step.';fb.style.color='#a34352';}
  });
}

function setupQuickChecks(){
  document.querySelectorAll('.quick-check').forEach((block,index)=>{
    const input=block.querySelector('input'); const btn=block.querySelector('button'); const out=block.querySelector('span'); const answer=normalize(block.dataset.answer);
    btn.addEventListener('click',()=>{
      if(normalize(input.value)===answer){out.textContent='✓ Excellent';out.style.color='#2b7658';input.style.borderColor='#3d8064';award(`grammar${index}`,4);}
      else{out.textContent='Try again — use the pattern just above.';out.style.color='#a34352';input.style.borderColor='#bd5c6c';}
    });
  });
}

function populateVocab(){
  const grid=document.getElementById('vocabGrid');
  const cat=document.getElementById('vocabCategory').value;
  const term=document.getElementById('vocabSearch').value.toLowerCase();
  grid.innerHTML='';
  vocab.filter(v=>(cat==='all'||v.cat===cat) && `${v.term} ${v.fr} ${v.def} ${v.ex}`.toLowerCase().includes(term)).forEach(v=>{
    const card=document.createElement('article'); card.className='vocab-card';
    card.innerHTML=`<span class="tag">${v.cat}</span><h3>${v.term}</h3><div class="fr">FR: ${v.fr}</div><p><strong>Definition:</strong> ${v.def}</p><p><strong>Example:</strong> ${v.ex}</p><button class="speak" type="button" data-speak="${escapeAttr(`${v.term}. ${v.ex}`)}">🔊 Listen</button>`;
    grid.appendChild(card);
  });
}

function escapeAttr(text){ return text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

function populateUpgrades(){
  const host=document.getElementById('upgradeGrid');
  upgrades.forEach((u,index)=>{
    const card=document.createElement('article'); card.className='upgrade-card';
    card.innerHTML=`<h3>${u.label}</h3><p class="before"><strong>Your starting idea</strong><br>${u.starter}</p><p><strong>Clearer version</strong><br>${u.better}</p><p class="after" id="upgrade${index}"><strong>Professional version</strong><br>${u.pro}<br><br><em>Why it works:</em> ${u.why}</p><button class="toggle-model" type="button" data-target="upgrade${index}">Reveal professional version</button>`;
    host.appendChild(card);
  });
}

function populateSpeaking(){
  const host=document.getElementById('speakingGrid');
  speakingPrompts.forEach((item,index)=>{
    const card=document.createElement('article'); card.className='speaking-card';
    card.innerHTML=`<h3>${item.q}</h3><p>Speak first. Then choose a level and compare your answer.</p><div class="level-tabs"><button type="button" data-level="B1" class="active">B1 foundation</button><button type="button" data-level="B1plus">B1+ stronger</button><button type="button" data-level="B2">B2 professional</button></div><div class="speaking-model show" id="smodel${index}">${item.models.B1}</div><div class="writing-actions"><button class="speak" type="button" data-speak="${escapeAttr(item.q)}">🔊 Question</button><button class="speak" type="button" data-model-speak="smodel${index}">🔊 Listen to model</button></div>`;
    card.querySelectorAll('.level-tabs button').forEach(btn=>{
      btn.addEventListener('click',()=>{
        card.querySelectorAll('.level-tabs button').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const model=card.querySelector(`#smodel${index}`); model.textContent=item.models[btn.dataset.level];
        award(`speak${index}`,3);
      });
    });
    host.appendChild(card);
  });
}

function speak(text){
  if(!('speechSynthesis' in window)){ alert('Text-to-speech is not available in this browser.'); return; }
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  const desired=document.getElementById('voiceSelect').value;
  utterance.lang=desired;
  const voices=speechSynthesis.getVoices();
  const voice=voices.find(v=>v.lang===desired)||voices.find(v=>v.lang.startsWith(desired.split('-')[0]));
  if(voice) utterance.voice=voice;
  utterance.rate=.93;
  speechSynthesis.speak(utterance);
}

function setupSpeech(){
  document.addEventListener('click',event=>{
    const btn=event.target.closest('[data-speak]');
    if(btn){ speak(btn.dataset.speak.replaceAll('&quot;','"')); }
    const modelBtn=event.target.closest('[data-model-speak]');
    if(modelBtn){ const target=document.getElementById(modelBtn.dataset.modelSpeak); if(target) speak(target.textContent); }
    const toggle=event.target.closest('.toggle-model');
    if(toggle){ const target=document.getElementById(toggle.dataset.target); if(target){target.classList.toggle('show'); toggle.textContent=target.classList.contains('show')?'Hide professional version':'Reveal professional version';award(`upgrade${toggle.dataset.target}`,2);} }
  });
}

function setupLetter(){
  const letter=document.getElementById('letterModel');
  document.getElementById('revealLetter').addEventListener('click',()=>{letter.classList.toggle('hidden'); document.getElementById('revealLetter').textContent=letter.classList.contains('hidden')?'Reveal the model letter':'Hide the model letter'; award('letter',6);});
  document.getElementById('listenLetter').addEventListener('click',()=>{
    const paragraphs=[...letter.querySelectorAll('p')].filter(p=>p.textContent.trim() && !p.querySelector('strong'));
    if(!paragraphs.length) return;
    const text=paragraphs[state.currentParagraph % paragraphs.length].textContent;
    speak(text); state.currentParagraph=(state.currentParagraph+1)%paragraphs.length;
  });
}

function setupTimer(){
  const output=document.getElementById('timer');
  function render(){ const m=Math.floor(state.remaining/60); const s=state.remaining%60; output.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
  document.getElementById('startTimer').addEventListener('click',()=>{
    if(state.timer) return;
    state.timer=setInterval(()=>{state.remaining--; render(); if(state.remaining<=0){clearInterval(state.timer);state.timer=null;state.remaining=60;render();award('timer',5); alert('Time! Take one breath and now try a stronger version.');}},1000);
  });
  document.getElementById('stopTimer').addEventListener('click',()=>{if(state.timer){clearInterval(state.timer);state.timer=null;} state.remaining=60;render();});
  render();
}

function setupRecording(){
  const start=document.getElementById('startRecording');
  const stop=document.getElementById('stopRecording');
  const clear=document.getElementById('clearRecording');
  const status=document.getElementById('recordingStatus');
  const player=document.getElementById('recordedAudio');
  const download=document.getElementById('downloadRecording');
  if(!start || !stop || !clear || !status || !player || !download) return;

  let recorder=null;
  let stream=null;
  let chunks=[];
  let recordingUrl='';

  const setStatus=(message, tone='')=>{
    status.textContent=message;
    status.dataset.tone=tone;
  };
  const releaseStream=()=>{
    if(stream){ stream.getTracks().forEach(track=>track.stop()); stream=null; }
  };
  const clearSavedRecording=()=>{
    player.pause();
    player.removeAttribute('src');
    player.load();
    player.hidden=true;
    download.removeAttribute('href');
    download.hidden=true;
    clear.disabled=true;
    if(recordingUrl){ URL.revokeObjectURL(recordingUrl); recordingUrl=''; }
  };

  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder){
    start.disabled=true;
    setStatus('Recording is not available in this browser. You can still use the speaking timer and model answers.', 'warning');
    return;
  }

  start.addEventListener('click', async()=>{
    if(recorder && recorder.state==='recording') return;
    try{
      clearSavedRecording();
      setStatus('Requesting microphone access…');
      stream=await navigator.mediaDevices.getUserMedia({audio:true});
      chunks=[];
      const preferredTypes=['audio/webm;codecs=opus','audio/mp4','audio/webm'];
      const supported=preferredTypes.find(type=>!MediaRecorder.isTypeSupported || MediaRecorder.isTypeSupported(type));
      recorder=supported ? new MediaRecorder(stream,{mimeType:supported}) : new MediaRecorder(stream);
      recorder.addEventListener('dataavailable', event=>{ if(event.data && event.data.size>0) chunks.push(event.data); });
      recorder.addEventListener('stop', ()=>{
        const type=recorder.mimeType || 'audio/webm';
        const blob=new Blob(chunks,{type});
        if(blob.size===0){
          setStatus('No audio was captured. Please try again and check your microphone permission.', 'warning');
          releaseStream();
          return;
        }
        recordingUrl=URL.createObjectURL(blob);
        player.src=recordingUrl;
        player.hidden=false;
        download.href=recordingUrl;
        download.download=`isabelle-speaking-practice.${type.includes('mp4') ? 'm4a' : 'webm'}`;
        download.hidden=false;
        clear.disabled=false;
        start.disabled=false;
        stop.disabled=true;
        setStatus('Recording ready. Listen back, then try a stronger version.', 'success');
        award('recording',5);
        releaseStream();
      });
      recorder.start();
      start.disabled=true;
      stop.disabled=false;
      setStatus('Recording… speak naturally and press Stop when you finish.', 'recording');
    }catch(error){
      console.error(error);
      releaseStream();
      start.disabled=false;
      stop.disabled=true;
      setStatus('Microphone access was not granted. Please allow microphone access in your browser settings and try again.', 'warning');
    }
  });

  stop.addEventListener('click',()=>{
    if(recorder && recorder.state==='recording'){
      recorder.stop();
      stop.disabled=true;
      setStatus('Finishing your recording…');
    }
  });

  clear.addEventListener('click',()=>{
    clearSavedRecording();
    setStatus('Recording cleared. You can record a new answer.', '');
  });

  window.addEventListener('beforeunload', ()=>{
    if(recorder && recorder.state==='recording') recorder.stop();
    releaseStream();
    if(recordingUrl) URL.revokeObjectURL(recordingUrl);
  });
}

function setupWriting(){
  const writing=document.getElementById('writingBox'); const notes=document.getElementById('notes');
  writing.value=localStorage.getItem('isabelleSpeculativeDraft')||'';
  notes.value=localStorage.getItem('isabelleSpeculativeNotes')||'';
  document.getElementById('saveWriting').addEventListener('click',()=>{localStorage.setItem('isabelleSpeculativeDraft',writing.value);document.getElementById('saveNote').textContent='Saved on this device ✓';award('draft',5);});
  document.getElementById('clearWriting').addEventListener('click',()=>{if(confirm('Clear your draft?')){writing.value='';localStorage.removeItem('isabelleSpeculativeDraft');document.getElementById('saveNote').textContent='Draft cleared.';}});
  document.getElementById('saveNotes').addEventListener('click',()=>{localStorage.setItem('isabelleSpeculativeNotes',notes.value);document.getElementById('notesStatus').textContent='Notes saved ✓';award('notes',3);});
}

function setupControls(){
  document.getElementById('printBtn').addEventListener('click',()=>window.print());
  document.getElementById('resetBtn').addEventListener('click',()=>{if(confirm('Reset your score and saved notes on this page?')){localStorage.removeItem('isabelleSpeculativeDraft');localStorage.removeItem('isabelleSpeculativeNotes');location.reload();}});
  document.getElementById('vocabCategory').addEventListener('change',populateVocab);
  document.getElementById('vocabSearch').addEventListener('input',populateVocab);
}

function init(){
  makeChoices('applicationChoice',choiceSets.applicationChoice);
  makeChoices('broersmaChoice',choiceSets.broersmaChoice);
  populateOrder(); setupQuickChecks(); populateVocab(); populateUpgrades(); populateSpeaking(); setupSpeech(); setupLetter(); setupTimer(); setupRecording(); setupWriting(); setupControls();
  speechSynthesis?.getVoices?.();
}

document.addEventListener('DOMContentLoaded',init);
