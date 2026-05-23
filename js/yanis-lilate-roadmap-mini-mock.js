(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  let voiceLang = 'en-US';
  const speech = window.speechSynthesis;

  function getVoice(lang){
    const voices = speech ? speech.getVoices() : [];
    return voices.find(v => v.lang === lang) || voices.find(v => v.lang.startsWith(lang.slice(0,2))) || null;
  }

  function say(text){
    if(!speech || !text) return;
    speech.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = voiceLang;
    const voice = getVoice(voiceLang);
    if(voice) utt.voice = voice;
    utt.rate = 0.94;
    speech.speak(utt);
  }

  function setVoice(lang){
    voiceLang = lang;
    const us = $('#voiceUS');
    const uk = $('#voiceUK');
    if(lang === 'en-US'){
      us.classList.add('is-on'); uk.classList.remove('is-on');
      us.setAttribute('aria-pressed','true'); uk.setAttribute('aria-pressed','false');
    } else {
      uk.classList.add('is-on'); us.classList.remove('is-on');
      uk.setAttribute('aria-pressed','true'); us.setAttribute('aria-pressed','false');
    }
  }

  function readKey(section){
    const texts = {
      examday: 'Connect about ten minutes early. Prepare your identity card and check your webcam and microphone. The exam usually lasts around sixty minutes. Your result is normally available within twenty four hours.',
      part1model: $('#part1ModelText')?.textContent || '',
      part2model: $('#part2ModelText')?.textContent || ''
    };
    say(texts[section] || '');
  }

  function normalize(s){
    return String(s || '').trim().toLowerCase();
  }


  const part2Scenarios = {
    anna: {
      transcript: 'Hello. My name is Anna Brown. I am travelling to Madrid tomorrow. I have a problem with my cabin bag because I am not sure if it is allowed. I also have a connecting flight, so I am worried about the time between the two flights. Could you please give me clear information?',
      transcriptFr: 'Bonjour. Je m’appelle Anna Brown. Je voyage demain vers Madrid. J’ai un problème avec mon bagage cabine car je ne suis pas sûre qu’il soit autorisé. J’ai aussi un vol de correspondance, donc je suis inquiète à propos du temps entre les deux vols. Pourriez-vous me donner des informations claires ?',
      model: 'The passenger is Anna Brown. She is travelling to Madrid tomorrow. She has a question about her cabin bag, and she is also worried about her connecting flight. She would like clear information.',
      modelFr: 'Le passager s’appelle Anna Brown. Elle voyage demain vers Madrid. Elle a une question sur son bagage cabine et elle est aussi inquiète pour sa correspondance. Elle souhaite des informations claires.',
      answers: {name:'anna brown', dest:'madrid', problem:['bag','cabin bag','cabin baggage','baggage allowance'], concern:['connecting','connection','connecting flight','flight connection']},
      mcq: [
        {text:'You worry? Bag?', correct:false},
        {text:'If I understand correctly, you have a question about the cabin baggage allowance and your flight connection to Madrid. Is that right?', correct:true},
        {text:'Where is your passport bag airline?', correct:false}
      ]
    },
    david: {
      transcript: 'Good afternoon. My name is David Lee. I am flying to Rome this evening. I have a problem with my seat because I would like to sit next to my wife. I also asked for a special meal, and I want to check if it is confirmed. Could you help me, please?',
      transcriptFr: 'Bonjour. Je m’appelle David Lee. Je prends l’avion pour Rome ce soir. J’ai un problème avec mon siège car j’aimerais être assis à côté de ma femme. J’ai aussi demandé un repas spécial et je voudrais vérifier s’il est confirmé. Pouvez-vous m’aider, s’il vous plaît ?',
      model: 'The passenger is David Lee. He is flying to Rome this evening. He has a seat problem because he would like to sit next to his wife. He also wants to check if his special meal is confirmed.',
      modelFr: 'Le passager s’appelle David Lee. Il prend l’avion pour Rome ce soir. Il a un problème de siège car il souhaite s’asseoir à côté de sa femme. Il veut aussi vérifier si son repas spécial est confirmé.',
      answers: {name:'david lee', dest:'rome', problem:['seat','seat problem','sit next to his wife','sit next to'], concern:['meal','special meal','meal confirmed','confirmed meal']},
      mcq: [
        {text:'Seat? Wife? Meal?', correct:false},
        {text:'If I understand correctly, you would like to sit next to your wife and you also want to check your special meal. Is that correct?', correct:true},
        {text:'Do you have a passport in your meal seat?', correct:false}
      ]
    },
    sofia: {
      transcript: 'Hello. My name is Sofia Martinez. I am travelling to Lisbon this afternoon. I saw that my gate has changed, and I am not sure where I need to go now. I am also worried because I do not know the boarding time. Could you give me the correct information?',
      transcriptFr: 'Bonjour. Je m’appelle Sofia Martinez. Je voyage vers Lisbonne cet après-midi. J’ai vu que ma porte d’embarquement a changé et je ne sais pas où je dois aller maintenant. Je suis aussi inquiète parce que je ne connais pas l’heure d’embarquement. Pourriez-vous me donner les bonnes informations ?',
      model: 'The passenger is Sofia Martinez. She is travelling to Lisbon this afternoon. She has a question about a gate change, and she is also worried about the boarding time. She would like the correct information.',
      modelFr: 'Le passager s’appelle Sofia Martinez. Elle voyage vers Lisbonne cet après-midi. Elle a une question sur un changement de porte et elle est aussi inquiète pour l’heure d’embarquement. Elle souhaite les bonnes informations.',
      answers: {name:'sofia martinez', dest:'lisbon', problem:['gate','gate change','changed gate'], concern:['boarding','boarding time','time']},
      mcq: [
        {text:'Gate? Time? Why?', correct:false},
        {text:'If I understand correctly, your gate has changed and you would also like to know the boarding time. Is that right?', correct:true},
        {text:'Is your passport at the gate in Lisbon time?', correct:false}
      ]
    }
  };

  function currentPart2Scenario(){
    return part2Scenarios[$('#part2Scenario')?.value || 'anna'] || part2Scenarios.anna;
  }

  function renderPart2Scenario(){
    const sc = currentPart2Scenario();
    const tr = $('#passengerTranscript');
    const trFr = $('#passengerTranscriptFr');
    const model = $('#part2ModelText');
    const modelFr = $('#part2ModelTextFr');
    if(tr) tr.textContent = sc.transcript;
    if(trFr) trFr.textContent = sc.transcriptFr;
    if(model) model.textContent = sc.model;
    if(modelFr) modelFr.textContent = sc.modelFr;

    const mcqHost = $('#mcqOptions');
    const fb = $('#mcqFeedback');
    if(mcqHost){
      mcqHost.innerHTML = '';
      sc.mcq.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'mcq';
        btn.dataset.correct = item.correct ? 'true' : 'false';
        btn.textContent = item.text;
        btn.addEventListener('click', ()=>{
          $$('#mcqOptions .mcq').forEach(b=>b.classList.remove('correct','wrong'));
          if(btn.dataset.correct === 'true'){
            btn.classList.add('correct');
            fb.textContent = 'Yes. That is the clearest and most professional clarification question.';
          } else {
            btn.classList.add('wrong');
            fb.textContent = 'Not this one. Choose the question that is clear, polite, and professional.';
          }
        });
        mcqHost.appendChild(btn);
      });
    }
    if(fb) fb.textContent = '';
    const infoFb = $('#infoFeedback');
    if(infoFb) infoFb.textContent = '';
    ['ansName','ansDest','ansProblem','ansConcern'].forEach(id=>{ const el = $('#'+id); if(el) el.value=''; });
  }

  $('#voiceUS')?.addEventListener('click',()=>setVoice('en-US'));
  $('#voiceUK')?.addEventListener('click',()=>setVoice('en-GB'));
  $('#readPageIntro')?.addEventListener('click',()=>say('Today you will discover the LILATE exam, connect it to what you already know, and practise a first guided mini mock.'));

  $$('[data-read]').forEach(btn=>{
    btn.addEventListener('click', ()=> readKey(btn.dataset.read));
  });

  $$('[data-copy]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const target = $(btn.dataset.copy);
      if(!target) return;
      navigator.clipboard?.writeText(target.textContent.trim());
      btn.textContent = 'Copied';
      setTimeout(()=> btn.textContent = 'Copy model', 1400);
    });
  });

  $('#buildIntro')?.addEventListener('click', ()=>{
    const name = $('#fName')?.value.trim() || 'My name is Yanis.';
    const job = $('#fJob')?.value.trim() || 'I work as a receptionist.';
    const duties = $('#fDuties')?.value.trim() || 'My main duties are welcoming guests and answering the phone.';
    const goal = $('#fGoal')?.value.trim() || 'My goal is to become a steward.';
    $('#introOutput').textContent = [name, job, duties, goal].join(' ');
  });

  $('#listenIntro')?.addEventListener('click', ()=>{
    say($('#introOutput')?.textContent || '');
  });

  $('#toggleTranscript')?.addEventListener('click', ()=>{
    $('#passengerTranscript')?.classList.toggle('hidden');
    $('#passengerTranscriptFr')?.classList.toggle('hidden');
  });

  $('#listenPassengerMsg')?.addEventListener('click', ()=>{
    say($('#passengerTranscript')?.textContent || '');
  });

  $('#checkInfo')?.addEventListener('click', ()=>{
    const fb = $('#infoFeedback');
    const sc = currentPart2Scenario();
    const problemAns = normalize($('#ansProblem')?.value);
    const concernAns = normalize($('#ansConcern')?.value);
    const checks = [
      normalize($('#ansName')?.value) === sc.answers.name,
      normalize($('#ansDest')?.value) === sc.answers.dest,
      sc.answers.problem.some(p => problemAns.includes(normalize(p))),
      sc.answers.concern.some(c => concernAns.includes(normalize(c)))
    ];
    const score = checks.filter(Boolean).length;
    if(score === 4){
      fb.textContent = 'Excellent. You found the useful information clearly.';
      fb.style.borderColor = '#1ba97f';
      fb.style.background = '#ecfbf6';
    } else {
      fb.textContent = 'Good start. Check the passenger name, destination, the main problem, and the second concern.';
      fb.style.borderColor = '#d9c66d';
      fb.style.background = '#fffaf0';
    }
  });

  $$('.nav-item').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $$('.nav-item').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  $('#part2Scenario')?.addEventListener('change', renderPart2Scenario);
  renderPart2Scenario();

  setVoice('en-US');
  if(speech){ speech.onvoiceschanged = function(){}; }
})();
