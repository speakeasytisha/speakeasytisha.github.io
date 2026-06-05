(() => {
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

  const Speech = {
    mode:'en-US',
    getVoices(){ try{return window.speechSynthesis?.getVoices?.()||[]}catch(e){return [];} },
    pickVoice(){
      const voices=this.getVoices();
      return voices.find(v=>v.lang===this.mode)||voices.find(v=>v.lang?.startsWith(this.mode.slice(0,2)))||null;
    },
    say(text){
      if(!window.speechSynthesis||!text) return;
      window.speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(String(text));
      u.lang=this.mode; u.rate=.97; u.pitch=1;
      const v=this.pickVoice(); if(v) u.voice=v;
      window.speechSynthesis.speak(u);
    },
    pause(){try{window.speechSynthesis.pause()}catch(e){}},
    resume(){try{window.speechSynthesis.resume()}catch(e){}},
    stop(){try{window.speechSynthesis.cancel()}catch(e){}}
  };
  if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged = ()=>Speech.getVoices();

  const Score={now:0,max:0,seen:new Set(), setMax(n){this.max=n;renderScore();}, award(key,pts=1){if(this.seen.has(key))return; this.seen.add(key); this.now+=pts; renderScore();}, reset(){this.now=0; this.seen.clear(); renderScore();}};
  function renderScore(){ $('#scoreNow').textContent=Score.now; $('#scoreMax').textContent=Score.max; $('#progressBar').style.width=(Score.max?Math.round(Score.now/Score.max*100):0)+'%'; }

  function shuffle(a){ const x=a.slice(); for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [x[i],x[j]]=[x[j],x[i]];} return x; }
  function normalize(s){ return String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim(); }

  const VOCAB = [
    {cat:'countries', word:'France', fr:'la France', def:'a country in Europe', ex:'She is from France.', emoji:'🇫🇷', say:'France. She is from France.'},
    {cat:'countries', word:'French', fr:'français / française', def:'the nationality of a person from France', ex:'She is French.', emoji:'🗼', say:'French. She is French.'},
    {cat:'countries', word:'Spain', fr:'l’Espagne', def:'a country in Europe', ex:'He is from Spain.', emoji:'🇪🇸', say:'Spain. He is from Spain.'},
    {cat:'countries', word:'Spanish', fr:'espagnol / espagnole', def:'the nationality of a person from Spain', ex:'He is Spanish.', emoji:'💃', say:'Spanish. He is Spanish.'},
    {cat:'countries', word:'Italy', fr:'l’Italie', def:'a country in Europe', ex:'She is from Italy.', emoji:'🇮🇹', say:'Italy. She is from Italy.'},
    {cat:'countries', word:'Italian', fr:'italien / italienne', def:'the nationality of a person from Italy', ex:'She is Italian.', emoji:'🍝', say:'Italian. She is Italian.'},
    {cat:'countries', word:'Portugal', fr:'le Portugal', def:'a country in Europe', ex:'They are from Portugal.', emoji:'🇵🇹', say:'Portugal. They are from Portugal.'},
    {cat:'countries', word:'Portuguese', fr:'portugais / portugaise', def:'the nationality of a person from Portugal', ex:'They are Portuguese.', emoji:'🚋', say:'Portuguese. They are Portuguese.'},
    {cat:'countries', word:'Germany', fr:'l’Allemagne', def:'a country in Europe', ex:'He is from Germany.', emoji:'🇩🇪', say:'Germany. He is from Germany.'},
    {cat:'countries', word:'German', fr:'allemand / allemande', def:'the nationality of a person from Germany', ex:'He is German.', emoji:'🍞', say:'German. He is German.'},
    {cat:'countries', word:'British', fr:'britannique', def:'the nationality of a person from the UK', ex:'The passenger is British.', emoji:'🇬🇧', say:'British. The passenger is British.'},
    {cat:'countries', word:'American', fr:'américain / américaine', def:'the nationality of a person from the USA', ex:'The passenger is American.', emoji:'🇺🇸', say:'American. The passenger is American.'},

    {cat:'family', word:'wife', fr:'épouse / femme', def:'a married woman in relation to her husband', ex:'His wife is travelling with him.', emoji:'👩', say:'wife. His wife is travelling with him.'},
    {cat:'family', word:'husband', fr:'mari / époux', def:'a married man in relation to his wife', ex:'Her husband is waiting at the gate.', emoji:'👨', say:'husband. Her husband is waiting at the gate.'},
    {cat:'family', word:'son', fr:'fils', def:'a male child', ex:'Their son is travelling with them.', emoji:'👦', say:'son. Their son is travelling with them.'},
    {cat:'family', word:'daughter', fr:'fille', def:'a female child', ex:'Her daughter needs assistance.', emoji:'👧', say:'daughter. Her daughter needs assistance.'},
    {cat:'family', word:'child', fr:'enfant', def:'one young person', ex:'The child is sitting next to her mother.', emoji:'🧒', say:'child. The child is sitting next to her mother.'},
    {cat:'family', word:'children', fr:'enfants', def:'more than one child', ex:'The children are tired.', emoji:'👧👦', say:'children. The children are tired.'},
    {cat:'family', word:'mother', fr:'mère', def:'a female parent', ex:'The mother has a question about the seats.', emoji:'👩‍👧', say:'mother. The mother has a question about the seats.'},
    {cat:'family', word:'father', fr:'père', def:'a male parent', ex:'The father is carrying the bags.', emoji:'👨‍👦', say:'father. The father is carrying the bags.'},
    {cat:'family', word:'aunt', fr:'tante', def:'the sister of a parent or the wife of an uncle', ex:'The child is travelling with his aunt.', emoji:'👩‍🦰', say:'aunt. The child is travelling with his aunt.'},
    {cat:'family', word:'uncle', fr:'oncle', def:'the brother of a parent or the husband of an aunt', ex:'The passenger is travelling with her uncle.', emoji:'👨‍🦱', say:'uncle. The passenger is travelling with her uncle.'},
    {cat:'family', word:'cousin', fr:'cousin / cousine', def:'the child of your aunt or uncle', ex:'She is travelling with her cousin.', emoji:'🧑‍🤝‍🧑', say:'cousin. She is travelling with her cousin.'},

    {cat:'profiles', word:'passenger', fr:'passager / passagère', def:'a person who is travelling', ex:'The passenger is travelling to Rome.', emoji:'🧍', say:'passenger. The passenger is travelling to Rome.'},
    {cat:'profiles', word:'travelling alone', fr:'voyage seul', def:'not travelling with another person', ex:'The passenger is travelling alone.', emoji:'🧍‍♂️', say:'travelling alone. The passenger is travelling alone.'},
    {cat:'profiles', word:'family', fr:'famille', def:'parents, children, and close relatives', ex:'The family is waiting near the gate.', emoji:'👨‍👩‍👧‍👦', say:'family. The family is waiting near the gate.'},
    {cat:'profiles', word:'VIP passenger', fr:'passager VIP', def:'an important passenger who may need special service', ex:'The VIP passenger would like quick assistance.', emoji:'⭐', say:'VIP passenger. The VIP passenger would like quick assistance.'},
    {cat:'profiles', word:'special assistance', fr:'assistance spéciale', def:'extra help for a passenger', ex:'The passenger needs special assistance.', emoji:'♿', say:'special assistance. The passenger needs special assistance.'},
    {cat:'profiles', word:'boarding pass', fr:'carte d’embarquement', def:'the document you show before boarding', ex:'Is this your boarding pass?', emoji:'🎫', say:'boarding pass. Is this your boarding pass?'},
    {cat:'profiles', word:'cabin bag', fr:'bagage cabine', def:'a small bag for the cabin', ex:'Is this your cabin bag?', emoji:'🧳', say:'cabin bag. Is this your cabin bag?'},
    {cat:'profiles', word:'seat', fr:'siège', def:'the place where a passenger sits', ex:'Is that your seat?', emoji:'💺', say:'seat. Is that your seat?'},
    {cat:'mixed', word:'gate', fr:'porte d’embarquement', def:'the place where passengers board the plane', ex:'Your gate is B12.', emoji:'🚪', say:'gate. Your gate is B12.'},
    {cat:'mixed', word:'connection', fr:'correspondance', def:'the next flight after the first flight', ex:'She is worried about her connection.', emoji:'🔁', say:'connection. She is worried about her connection.'}
  ];

  const quizzes = {
    countries:[
      {q:'She is from Spain. She is _____.', options:['Spanish','Spain','Portugal'], answer:'Spanish', key:'c1'},
      {q:'He is from Italy. He is _____.', options:['Italian','Italy','British'], answer:'Italian', key:'c2'},
      {q:'They are from Portugal. They are _____.', options:['Portuguese','Portugal','French'], answer:'Portuguese', key:'c3'}
    ],
    pronouns:[
      {q:'Anna is travelling to Madrid. _____ is travelling this afternoon.', options:['She','You','His'], answer:'She', key:'p1'},
      {q:'David has a cabin bag. This is _____ cabin bag.', options:['his','her','your'], answer:'his', key:'p2'},
      {q:'You are at the gate. Is this _____ passport?', options:['your','her','their'], answer:'your', key:'p3'}
    ],
    family:[
      {q:'The passenger is travelling with his _____. They are married.', options:['wife','daughter','aunt'], answer:'wife', key:'f1'},
      {q:'The mother is travelling with her _____. He is eight years old.', options:['son','wife','uncle'], answer:'son', key:'f2'},
      {q:'The child is travelling with her _____. She is her mother’s sister.', options:['aunt','father','cousin'], answer:'aunt', key:'f3'}
    ]
  };

  const sortItems = [
    {word:'French', cat:'countries'},
    {word:'Spain', cat:'countries'},
    {word:'wife', cat:'family'},
    {word:'children', cat:'family'},
    {word:'VIP passenger', cat:'profiles'},
    {word:'special assistance', cat:'profiles'},
    {word:'boarding pass', cat:'mixed'},
    {word:'connection', cat:'mixed'}
  ];

  const scenarios = [
    {
      title:'Seat + husband + nationality',
      prompt:'A Spanish passenger is travelling to Madrid with her husband. She has a question about her seat.',
      questions:['Where are you from?','Are you travelling with your husband?','Is this your seat?','Do you need help with your seat?'],
      model:'The passenger is Spanish. She is travelling to Madrid with her husband. If I understand correctly, you have a question about your seat. Is that right?',
      speak:'A Spanish passenger is travelling to Madrid with her husband. She has a question about her seat.'
    },
    {
      title:'Child + special assistance',
      prompt:'An Italian passenger is travelling with her daughter. The child needs special assistance.',
      questions:['Are you travelling with your daughter?','How old is your child?','Do you need special assistance?','Is this your boarding pass?'],
      model:'The passenger is Italian. She is travelling with her daughter. If I understand correctly, your child needs special assistance. Is that correct?',
      speak:'An Italian passenger is travelling with her daughter. The child needs special assistance.'
    },
    {
      title:'Gate + family + connection',
      prompt:'A Portuguese family is travelling to Lisbon. They have a question about the gate and the connection.',
      questions:['Are you travelling as a family?','Do you have a question about your gate?','Are you worried about your connection?','Would you like clear information?'],
      model:'The passengers are Portuguese. They are travelling to Lisbon as a family. If I understand correctly, you have a question about your gate and your connection. Is that right?',
      speak:'A Portuguese family is travelling to Lisbon. They have a question about the gate and the connection.'
    }
  ];

  const roleplays = [
    {
      title:'Roleplay 1 — Spanish passenger with her husband',
      lines:[
        {who:'Staff', side:'staff', say:'Good afternoon. Can I help you?'},
        {who:'Passenger', side:'yanis', say:'(Your turn)', model:'Good afternoon. Yes, please. I have a question about my seat.'},
        {who:'Staff', side:'staff', say:'Of course. Are you travelling alone?'},
        {who:'Passenger', side:'yanis', say:'(Your turn)', model:'No, I am travelling with my husband.'},
        {who:'Staff', side:'staff', say:'Thank you. If I understand correctly, you are travelling to Madrid with your husband and you have a question about your seat. Is that right?'},
        {who:'Passenger', side:'yanis', say:'(Your turn)', model:'Yes, that is right.'}
      ]
    },
    {
      title:'Roleplay 2 — child and aunt',
      lines:[
        {who:'Staff', side:'staff', say:'Hello. Is this your boarding pass?'},
        {who:'Passenger', side:'yanis', say:'(Your turn)', model:'Yes, it is my boarding pass.'},
        {who:'Staff', side:'staff', say:'Are you travelling with your child?'},
        {who:'Passenger', side:'yanis', say:'(Your turn)', model:'No. I am travelling with my niece and her aunt.'},
        {who:'Staff', side:'staff', say:'If I understand correctly, the child is travelling with her aunt. Is that correct?'},
        {who:'Passenger', side:'yanis', say:'(Your turn)', model:'Yes, that is correct.'}
      ]
    },
    {
      title:'Roleplay 3 — family and special assistance',
      lines:[
        {who:'Staff', side:'staff', say:'Good evening. How can I help you?'},
        {who:'Passenger', side:'yanis', say:'(Your turn)', model:'Good evening. We need special assistance.'},
        {who:'Staff', side:'staff', say:'Are you travelling as a family?'},
        {who:'Passenger', side:'yanis', say:'(Your turn)', model:'Yes, we are travelling as a family.'},
        {who:'Staff', side:'staff', say:'If I understand correctly, your child needs special assistance. Is that right?'},
        {who:'Passenger', side:'yanis', say:'(Your turn)', model:'Yes, that is right.'}
      ]
    }
  ];

  function renderVocab(){
    const filter = $('#vocabFilter').value;
    const grid = $('#vocabGrid');
    const items = VOCAB.filter(v=> filter==='all' || v.cat===filter);
    grid.innerHTML='';
    items.forEach((v, idx)=>{
      const card=document.createElement('div');
      card.className='flashcard';
      card.innerHTML=`<div class="fcTop"><div><div class="fcWord">${v.emoji} ${v.word}</div><div class="badgeRow"><span class="badge">${v.fr}</span><span class="badge">${v.cat}</span></div></div></div><div class="fcDef">${v.def}</div><div class="fcEx">Example: ${v.ex}</div><div class="fcBtns"><button class="iconbtn" type="button">🔊 Listen</button></div>`;
      card.querySelector('button').addEventListener('click',()=>Speech.say(v.say||v.word));
      grid.appendChild(card);
    });
  }

  function renderQuiz(hostId, items){
    const host = $('#'+hostId); host.innerHTML='';
    items.forEach(item=>{
      const card=document.createElement('div'); card.className='qcard';
      const opts = shuffle(item.options);
      card.innerHTML=`<div class="qprompt">${item.q}</div><div class="choiceRow"></div><div class="feedback hidden"></div>`;
      const row = $('.choiceRow', card), fb = $('.feedback', card);
      opts.forEach(opt=>{
        const label=document.createElement('label'); label.className='choice';
        label.innerHTML=`<input type="radio" name="${item.key}"><div>${opt}</div>`;
        label.addEventListener('click',()=>{
          const ok = opt===item.answer;
          fb.className='feedback ' + (ok?'ok':'no');
          fb.classList.remove('hidden');
          fb.innerHTML = ok ? '✅ Correct!' : `❌ Not quite. Correct answer: <strong>${item.answer}</strong>`;
          if(ok) Score.award(item.key,1);
        });
        row.appendChild(label);
      });
      host.appendChild(card);
    });
  }

  let selectedSort = null;
  function renderSort(){
    const bank = $('#sortBank'); bank.innerHTML='';
    ['countries','family','profiles','mixed'].forEach(cat=> $('#placed-'+cat).innerHTML='');
    sortItems.forEach((it, idx)=>{
      const chip=document.createElement('button'); chip.type='button'; chip.className='chip'; chip.textContent=it.word; chip.dataset.cat=it.cat; chip.dataset.idx=idx;
      chip.addEventListener('click',()=>{
        $$('.chip').forEach(c=>c.style.outline='none');
        chip.style.outline='3px solid rgba(14,58,138,.25)';
        selectedSort=chip;
      });
      bank.appendChild(chip);
    });
  }
  function placeSort(target){
    const fb = $('#sortFb');
    if(!selectedSort){ fb.className='feedback no'; fb.classList.remove('hidden'); fb.textContent='❌ Choose a word first.'; return; }
    const word=selectedSort.textContent; const cat=selectedSort.dataset.cat;
    const ok = cat===target;
    const item=document.createElement('div'); item.className='placedItem ' + (ok?'ok':'no'); item.textContent = `${word} — ${ok ? 'correct' : 'wrong'}`;
    $('#placed-'+target).appendChild(item);
    selectedSort.classList.add('placed'); selectedSort.style.outline='none';
    fb.className='feedback ' + (ok?'ok':'no'); fb.classList.remove('hidden');
    fb.innerHTML = ok ? `✅ <strong>${word}</strong> goes in this category.` : `❌ <strong>${word}</strong> does not belong here.`;
    if(ok) Score.award('sort-'+word,1);
    selectedSort=null;
  }

  function renderScenarioSelect(){
    const sel=$('#scenarioSelect'); sel.innerHTML='';
    scenarios.forEach((s,i)=>{const o=document.createElement('option'); o.value=i; o.textContent=s.title; sel.appendChild(o);});
    renderScenario();
  }
  function renderScenario(){
    const s=scenarios[Number($('#scenarioSelect').value)||0];
    $('#scenarioPrompt').textContent=s.prompt;
    const q=$('#scenarioQuestions'); q.innerHTML='';
    s.questions.forEach(line=>{
      const div=document.createElement('div'); div.className='line';
      div.innerHTML=`<div class="ico">❓</div><div><strong>${line}</strong></div>`;
      q.appendChild(div);
    });
    $('#scenarioModel').textContent=s.model;
    $('#scenarioModel').classList.add('hidden');
  }

  let rpIndex=0;
  function renderRoleplaySelect(){
    const sel=$('#roleplaySelect'); sel.innerHTML='';
    roleplays.forEach((r,i)=>{const o=document.createElement('option'); o.value=i; o.textContent=r.title; sel.appendChild(o);});
    clearRoleplay();
  }
  function currentRoleplay(){ return roleplays[Number($('#roleplaySelect').value)||0]; }
  function clearRoleplay(){ rpIndex=0; $('#roleStream').innerHTML=''; $('#roleAnswer').value=''; $('#roleFb').classList.add('hidden'); $('#roleModel').classList.add('hidden'); }
  function addRoleLine(line){
    const div=document.createElement('div'); div.className='roleLine ' + line.side;
    div.innerHTML=`<div class="roleWho">${line.side==='staff'?'🟦 Staff':'🟥 Passenger / Yanis'}</div><div>${line.say}</div>`;
    $('#roleStream').appendChild(div);
  }
  function stepRoleplay(){
    const rp=currentRoleplay(); if(rpIndex>=rp.lines.length) return;
    const line=rp.lines[rpIndex]; addRoleLine(line);
    if(line.say!=='(Your turn)') Speech.say(line.say);
    rpIndex++;
  }
  function showRoleModel(){
    const rp=currentRoleplay();
    for(let i=rpIndex-1;i>=0;i--){ const line=rp.lines[i]; if(line.side==='yanis'){ $('#roleModel').textContent=line.model; $('#roleModel').classList.remove('hidden'); Score.award('rolemodel'+($('#roleplaySelect').value)+'-'+i,1); return; } }
  }
  function checkRole(){
    const text=normalize($('#roleAnswer').value);
    const rp=currentRoleplay();
    let model='';
    for(let i=rpIndex-1;i>=0;i--){ const line=rp.lines[i]; if(line.side==='yanis'){ model=line.model; break; } }
    const fb=$('#roleFb');
    const ok = text && (text.includes('if i understand correctly') || text===normalize(model) || (text.includes('travelling') && text.includes('question')));
    fb.className='feedback ' + (ok?'ok':'no'); fb.classList.remove('hidden');
    fb.innerHTML = ok ? '✅ Good. Your answer is clear and relevant.' : '❌ Try to include: passenger information + the problem/request.';
    if(ok) Score.award('rolecheck'+rp.title+rpIndex,2);
  }

  function init(){
    $('#jsStatus').textContent='JS: ✅ loaded';
    $('#voiceUS').addEventListener('click',()=>{Speech.mode='en-US'; $('#voiceUS').classList.add('is-on'); $('#voiceUK').classList.remove('is-on');});
    $('#voiceUK').addEventListener('click',()=>{Speech.mode='en-GB'; $('#voiceUK').classList.add('is-on'); $('#voiceUS').classList.remove('is-on');});
    $('#btnPause').addEventListener('click',()=>Speech.pause());
    $('#btnResume').addEventListener('click',()=>Speech.resume());
    $('#btnStop').addEventListener('click',()=>Speech.stop());
    $('#btnStart').addEventListener('click',()=>$('#main').scrollIntoView({behavior:'smooth'}));
    $('#btnResetAll').addEventListener('click',()=>{ Score.reset(); renderScore(); renderVocab(); renderQuiz('quizCountries', quizzes.countries); renderQuiz('quizPronouns', quizzes.pronouns); renderQuiz('quizFamily', quizzes.family); renderSort(); renderScenario(); clearRoleplay(); });
    $$('.speak').forEach(b=>b.addEventListener('click',()=>Speech.say(b.dataset.say)));
    $('#vocabFilter').addEventListener('change', renderVocab);
    renderVocab();
    renderQuiz('quizCountries', quizzes.countries);
    renderQuiz('quizPronouns', quizzes.pronouns);
    renderQuiz('quizFamily', quizzes.family);
    renderSort();
    $$('.sortTarget').forEach(btn=>btn.addEventListener('click',()=>placeSort(btn.dataset.target)));
    renderScenarioSelect();
    $('#scenarioSelect').addEventListener('change', renderScenario);
    $('#btnScenarioSpeak').addEventListener('click',()=>Speech.say(scenarios[Number($('#scenarioSelect').value)||0].speak));
    $('#btnToggleScenarioModel').addEventListener('click',()=>$('#scenarioModel').classList.toggle('hidden'));
    renderRoleplaySelect();
    $('#roleplaySelect').addEventListener('change', clearRoleplay);
    $('#btnPlayRole').addEventListener('click',()=>{ clearRoleplay(); stepRoleplay(); });
    $('#btnNextLine').addEventListener('click', stepRoleplay);
    $('#btnShowModel').addEventListener('click', showRoleModel);
    $('#btnSpeakModel').addEventListener('click',()=>{ const txt=$('#roleModel').textContent; if(txt) Speech.say(txt); });
    $('#btnCheckRole').addEventListener('click', checkRole);

    Score.setMax(30);
    renderScore();
  }
  init();
})();
