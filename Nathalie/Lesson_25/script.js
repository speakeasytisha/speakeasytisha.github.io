(() => {
  'use strict';
  document.body.classList.add('ready');

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const shuffle = arr => {
    const a = [...arr];
    for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  };
  const safeText = s => String(s ?? '');

  const state = {
    score: 0,
    possible: 0,
    answered: {},
    skills: {},
    missionTargets: [],
    pairStats: { i:{correct:0,total:0}, a:{correct:0,total:0} },
    timers: {},
    savedAt: null
  };

  const storageKey = 'nathalie-pronunciation-lab-v1';

  // ---------- Speech synthesis: always manual ----------
  function speak(text){
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = $('#voiceMode').value;
    u.rate = Number($('#speedMode').value || 0.88);
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang === u.lang) || voices.find(v => v.lang.startsWith(u.lang.split('-')[0]));
    if (preferred) u.voice = preferred;
    window.speechSynthesis.speak(u);
  }
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-say]');
    if (btn) speak(btn.dataset.say);
  });

  // ---------- Navigation / global controls ----------
  $$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
    const el = document.getElementById(btn.dataset.scroll);
    if (el) el.scrollIntoView({behavior:'smooth',block:'start'});
  }));

  $('#languageMode').addEventListener('change', e => document.body.classList.toggle('lang-fr', e.target.value === 'fr'));
  $('#trainingMode').addEventListener('change', e => {
    const challenge = e.target.value === 'challenge';
    document.body.classList.toggle('challenge', challenge);
  });
  $('#transcriptToggle').addEventListener('click', e => {
    const next = e.currentTarget.getAttribute('aria-pressed') !== 'false' ? false : true;
    e.currentTarget.setAttribute('aria-pressed', String(next));
    e.currentTarget.textContent = `Transcript: ${next ? 'ON' : 'OFF'}`;
    document.body.classList.toggle('hide-transcripts', !next);
  });

  // ---------- Vocabulary ----------
  const vocab = [
    {cat:'vowels',icon:'🎵',word:'vowel',fr:'voyelle',def:'A speech sound made without blocking the airflow.',ex:'The vowel in “ship” is short.'},
    {cat:'vowels',icon:'↔️',word:'minimal pair',fr:'paire minimale',def:'Two words that differ by only one sound.',ex:'Ship and sheep are a minimal pair.'},
    {cat:'vowels',icon:'〰️',word:'diphthong',fr:'diphtongue',def:'A vowel sound that moves from one mouth position to another.',ex:'The /aɪ/ sound in “time” is a diphthong.'},
    {cat:'vowels',icon:'🫧',word:'schwa',fr:'schwa',def:'The relaxed /ə/ sound often found in unstressed syllables.',ex:'The first sound in “about” is a schwa.'},
    {cat:'mouth',icon:'👄',word:'rounded lips',fr:'lèvres arrondies',def:'Your lips form a small circle.',ex:'Round your lips for English W.'},
    {cat:'mouth',icon:'😁',word:'tense vowel',fr:'voyelle tendue',def:'A vowel produced with more muscular tension.',ex:'/iː/ in “sheep” is tenser than /ɪ/ in “ship”.'},
    {cat:'mouth',icon:'😌',word:'relaxed',fr:'relâché',def:'Produced without unnecessary muscular tension.',ex:'Keep /ɪ/ short and relaxed.'},
    {cat:'mouth',icon:'🫳',word:'voiced',fr:'sonore / voisé',def:'Made with vibration in your vocal cords.',ex:'/d/ is voiced.'},
    {cat:'mouth',icon:'🤫',word:'unvoiced',fr:'sourd / non voisé',def:'Made without vocal-cord vibration.',ex:'/t/ is unvoiced.'},
    {cat:'endings',icon:'🧩',word:'ending',fr:'terminaison',def:'The final sound or group of sounds in a word.',ex:'The -ED ending can sound /t/, /d/ or /ɪd/.'},
    {cat:'endings',icon:'🔚',word:'final consonant',fr:'consonne finale',def:'A consonant sound at the end of a word.',ex:'Keep the final consonant in “worked”.'},
    {cat:'endings',icon:'🪜',word:'extra syllable',fr:'syllabe supplémentaire',def:'An additional beat or syllable in a word.',ex:'“Wanted” has an extra syllable in the -ED ending.'},
    {cat:'rhythm',icon:'🥁',word:'word stress',fr:'accent tonique du mot',def:'The syllable that is stronger than the others.',ex:'The stress is on PORT in “important”.'},
    {cat:'rhythm',icon:'🎚️',word:'sentence stress',fr:'accentuation de la phrase',def:'The important words receive more emphasis.',ex:'Stress NANTES and SUNDAY to carry the message.'},
    {cat:'rhythm',icon:'🔗',word:'linking',fr:'enchaînement',def:'Connecting the end of one word to the beginning of the next.',ex:'Connect “turn off” instead of separating every word.'},
    {cat:'rhythm',icon:'🪶',word:'unstressed',fr:'non accentué',def:'A syllable or word that is lighter and less prominent.',ex:'Small grammar words are often unstressed.'},
    {cat:'silent',icon:'🕵️',word:'silent letter',fr:'lettre muette',def:'A written letter that is not pronounced.',ex:'The W is silent in “wrong”.'},
    {cat:'silent',icon:'✍️',word:'spelling',fr:'orthographe',def:'The written form of a word.',ex:'English spelling does not always predict pronunciation.'},
    {cat:'silent',icon:'👂',word:'sound',fr:'son',def:'What you actually hear and produce in speech.',ex:'Listen to the last sound, not the last letter.'}
  ];
  let activeVocab = 'all';
  const cats = ['all','vowels','mouth','endings','rhythm','silent'];
  function renderVocabChips(){
    const host = $('#vocabChips'); host.innerHTML='';
    cats.forEach(cat => {
      const b=document.createElement('button'); b.type='button'; b.className='chip'+(cat===activeVocab?' active':'');
      b.textContent = cat==='all' ? 'All' : cat[0].toUpperCase()+cat.slice(1);
      b.addEventListener('click',()=>{activeVocab=cat;$('#vocabCategory').value=cat;renderVocabChips();renderVocab();}); host.appendChild(b);
    });
  }
  function renderVocab(){
    const host=$('#vocabGrid'); host.innerHTML='';
    vocab.filter(v=>activeVocab==='all'||v.cat===activeVocab).forEach(v=>{
      const card=document.createElement('article'); card.className='vocab-card';
      card.innerHTML=`<div class="icon">${v.icon}</div><span class="tag">${v.cat}</span><h4>${v.word}</h4><div class="translation">${v.fr}</div><p class="definition">${v.def}</p><p class="example">“${v.ex}”</p><button type="button" class="listen" data-say="${v.word}. ${v.ex.replace(/"/g,'&quot;')}">🔊 Listen</button>`;
      host.appendChild(card);
    });
  }
  $('#vocabCategory').addEventListener('change',e=>{activeVocab=e.target.value;renderVocabChips();renderVocab();});
  renderVocabChips(); renderVocab();

  // ---------- Scoring ----------
  function recordAnswer(id, correct){
    if (state.answered[id]) return false;
    state.answered[id] = {correct:Boolean(correct), at:new Date().toISOString()};
    state.possible += 1; if (correct) state.score += 1;
    updateScore(); saveLocal(); return true;
  }
  function updateScore(){
    $('#score').textContent=state.score; $('#possible').textContent=state.possible;
    const accuracy = state.possible ? Math.round(state.score/state.possible*100) : 0;
    $('#reportScore').textContent=`${state.score}/${state.possible}`; $('#reportAccuracy').textContent=`${accuracy}%`;
    const skillsDone=Object.values(state.skills).filter(Boolean).length; $('#reportSkills').textContent=`${skillsDone}/4`;
    $('#reportTargets').textContent=`${Math.min(state.missionTargets.length,3)}/3`;
    const allUnits = 23; // broad lesson milestones, score + self checks
    const answeredCount = Object.keys(state.answered).length;
    const progress = Math.min(100, Math.round(((answeredCount + skillsDone + Math.min(state.missionTargets.length,3)) / allUnits)*100));
    $('#progressPct').textContent=`${progress}%`;
    renderSkillReport();
  }
  function feedback(el, ok, goodMsg='Correct — well heard!', badMsg='Not this time. Listen again and compare the mouth position.'){
    el.className='feedback '+(ok?'good':'bad'); el.textContent=ok?goodMsg:badMsg;
  }

  // ---------- Minimal pair engines ----------
  const pairData = {
    i: [
      {a:'ship',b:'sheep',hint:'Short /ɪ/ is quick and relaxed. Long /iː/ is stretched and tenser.'},
      {a:'sit',b:'seat',hint:'For /iː/, smile slightly and hold the vowel longer.'},
      {a:'live',b:'leave',hint:'Do not let the short vowel in “live” become a long “ee”.'},
      {a:'fill',b:'feel',hint:'“Fill” is quick. “Feel” is long and tense.'},
      {a:'bit',b:'beat',hint:'Listen to duration and vowel quality together.'},
      {a:'fit',b:'feet',hint:'Keep “fit” short. Stretch “feet”.'},
      {a:'slip',b:'sleep',hint:'The consonants are the same; only the vowel changes.'},
      {a:'chip',b:'cheap',hint:'Focus on the middle sound, not the spelling.'}
    ],
    a: [
      {a:'mad',b:'made',hint:'/æ/ is open and short; /eɪ/ moves and lasts longer.'},
      {a:'hat',b:'hate',hint:'Open wide for “hat”; glide for “hate”.'},
      {a:'plan',b:'plane',hint:'“Plan” has /æ/. “Plane” has the moving /eɪ/ sound.'},
      {a:'tap',b:'tape',hint:'The final silent e changes the vowel here.'},
      {a:'Sam',b:'same',hint:'Short open /æ/ versus moving /eɪ/.'}
    ]
  };
  const pairEngines = {};
  function setupPairEngine(type, prefix){
    let index=0, current=null, locked=false;
    const items=shuffle(pairData[type]);
    const audio=$(`#${prefix}PairAudio`), choices=$(`#${prefix}PairChoices`), fb=$(`#${prefix}PairFeedback`), next=$(`#${prefix}PairNext`), hintBtn=$(`#${prefix}PairHint`), hintBox=$(`#${prefix}PairHintBox`), score=$(`#${prefix}PairScore`);
    function newRound(){
      locked=false; fb.textContent=''; fb.className='feedback'; hintBox.classList.add('hidden'); choices.innerHTML='';
      const p=items[index % items.length]; const target=Math.random()<.5?p.a:p.b; current={...p,target,id:`pair-${type}-${index}-${target}`};
      shuffle([p.a,p.b]).forEach(word=>{
        const b=document.createElement('button');b.type='button';b.textContent=word;
        b.addEventListener('click',()=>{
          if(locked)return; locked=true; const ok=word===target; b.classList.add(ok?'correct':'incorrect');
          $$('button',choices).forEach(x=>{x.disabled=true;if(x.textContent===target)x.classList.add('correct');});
          if(recordAnswer(current.id,ok)){state.pairStats[type].total++;if(ok)state.pairStats[type].correct++;}
          score.textContent=`${state.pairStats[type].correct}/${state.pairStats[type].total}`;
          feedback(fb,ok, ok?'Correct — your ear caught the contrast!':`You heard “${word}”, but the word was “${target}”. Play it again.`);
          updateScore();
        }); choices.appendChild(b);
      });
    }
    audio.addEventListener('click',()=>current&&speak(current.target));
    next.addEventListener('click',()=>{index++;newRound();});
    hintBtn.addEventListener('click',()=>{if($('#trainingMode').value==='challenge'){hintBox.textContent='Hints are hidden in Challenge mode.';}else{hintBox.textContent=current.hint;}hintBox.classList.remove('hidden');});
    pairEngines[type]={newRound}; newRound();
  }
  setupPairEngine('i','i'); setupPairEngine('a','a');

  // ---------- Randomized quick checks ----------
  function initQuickChecks(){
    $$('.quick-check').forEach((box,idx)=>{
      const host=$('.shuffle-options',box), answer=box.dataset.answer, options=host.dataset.options.split('|'), fb=$('.feedback',box);
      host.innerHTML='';
      shuffle(options).forEach(opt=>{
        const b=document.createElement('button');b.type='button';b.textContent=opt;
        b.addEventListener('click',()=>{
          if(box.dataset.done==='1')return; box.dataset.done='1'; const ok=opt===answer; b.classList.add(ok?'correct':'incorrect');
          $$('button',host).forEach(x=>{x.disabled=true;if(x.textContent===answer)x.classList.add('correct');});
          recordAnswer(`quick-${box.dataset.qid||idx}`,ok); feedback(fb,ok,'Correct.',box.dataset.explain||'Try again after reviewing the rule.');
        });host.appendChild(b);
      });
    });
  }
  initQuickChecks();

  // ---------- Quiz stack renderer ----------
  const quizzes = {
    eQuiz:[
      {q:'Which word has /e/?',opts:['bad','bed','bud'],a:'bed',why:'“bed” uses short /e/.'},
      {q:'Which pair contrasts /e/ and /æ/?',opts:['pen / pan','ship / sheep','hat / hate'],a:'pen / pan',why:'“pen” has /e/ and “pan” has /æ/.'},
      {q:'You hear “sad”. Which vowel family is it?',opts:['/æ/','/e/','/iː/'],a:'/æ/',why:'“sad” has the short open /æ/ sound.'}
    ],
    sQuiz:[
      {q:'How does the final S sound in “cats”?',opts:['/s/','/z/','/ɪz/'],a:'/s/',why:'The final sound before S is unvoiced /t/.'},
      {q:'How does the final S sound in “dogs”?',opts:['/ɪz/','/s/','/z/'],a:'/z/',why:'The final sound before S is voiced /g/.'},
      {q:'How does the ending sound in “watches”?',opts:['/z/','/ɪz/','/s/'],a:'/ɪz/',why:'After a CH sound, the ending forms an extra syllable /ɪz/.'},
      {q:'How does the final S sound in “plays”?',opts:['/z/','/s/','/ɪz/'],a:'/z/',why:'The final sound before S is voiced.'}
    ],
    silentQuiz:[
      {q:'Which letter is silent in “wrong”?',opts:['W','R','G'],a:'W',why:'The W is silent before R in “wrong”.'},
      {q:'Which letter is silent in “knife”?',opts:['K','N','F'],a:'K',why:'Initial K is silent before N in “knife”.'},
      {q:'Which letter is silent in “thumb”?',opts:['T','H','B'],a:'B',why:'The final B is silent after M in “thumb”.'},
      {q:'Which word does NOT have silent GH?',opts:['night','light','laugh'],a:'laugh',why:'In “laugh”, GH is pronounced /f/.'}
    ]
  };
  function renderQuizStack(id,data){
    const host=$(`#${id}`); host.innerHTML='';
    shuffle(data).forEach((item,index)=>{
      const div=document.createElement('div');div.className='quiz-item';div.innerHTML=`<p><strong>${item.q}</strong></p><div class="option-row"></div><div class="feedback"></div>`;
      const row=$('.option-row',div), fb=$('.feedback',div); const uid=`${id}-${index}-${item.a}`;
      shuffle(item.opts).forEach(opt=>{
        const b=document.createElement('button');b.type='button';b.textContent=opt;
        b.addEventListener('click',()=>{
          if(div.dataset.done==='1')return;div.dataset.done='1';const ok=opt===item.a;b.classList.add(ok?'correct':'incorrect');
          $$('button',row).forEach(x=>{x.disabled=true;if(x.textContent===item.a)x.classList.add('correct');});
          recordAnswer(uid,ok); feedback(fb,ok,'Correct — good sound logic!',item.why);
        });row.appendChild(b);
      });host.appendChild(div);
    });
  }
  renderQuizStack('eQuiz',quizzes.eQuiz); renderQuizStack('sQuiz',quizzes.sQuiz); renderQuizStack('silentQuiz',quizzes.silentQuiz);

  // ---------- ED sorter ----------
  const edWords=[
    {w:'worked',a:'/t/'},{w:'visited',a:'/ɪd/'},{w:'played',a:'/d/'},{w:'wanted',a:'/ɪd/'},{w:'washed',a:'/t/'},{w:'called',a:'/d/'},
    {w:'started',a:'/ɪd/'},{w:'travelled',a:'/d/'},{w:'helped',a:'/t/'},{w:'needed',a:'/ɪd/'},{w:'opened',a:'/d/'},{w:'watched',a:'/t/'}
  ];
  let edRound=0, edCorrect=0, edTotal=0;
  function renderEd(){
    edRound++; edCorrect=0;edTotal=0;$('#edScore').textContent='0/0'; const host=$('#edSorter');host.innerHTML='';
    shuffle(edWords).slice(0,8).forEach((item,index)=>{
      const row=document.createElement('div');row.className='sort-row'; row.innerHTML=`<div class="sort-word">${item.w} <button class="micro-listen" type="button" data-say="${item.w}">🔊</button></div><div class="sort-options"></div><div class="feedback"></div>`;
      const opts=$('.sort-options',row),fb=$('.feedback',row);shuffle(['/t/','/d/','/ɪd/']).forEach(opt=>{
        const b=document.createElement('button');b.type='button';b.textContent=opt;b.addEventListener('click',()=>{
          if(row.dataset.done==='1')return;row.dataset.done='1';const ok=opt===item.a;b.classList.add(ok?'correct':'incorrect');$$('button:not(.micro-listen)',opts).forEach(x=>{x.disabled=true;if(x.textContent===item.a)x.classList.add('correct');});
          edTotal++;if(ok)edCorrect++;$('#edScore').textContent=`${edCorrect}/${edTotal}`;recordAnswer(`ed-${edRound}-${index}-${item.w}`,ok);feedback(fb,ok,'Correct.',`The correct ending is ${item.a}. Listen to the last sound of the base verb.`);
        });opts.appendChild(b);
      });host.appendChild(row);
    });
  }
  renderEd(); $('#edReset').addEventListener('click',renderEd); $('#edHint').addEventListener('click',()=>$('#edHintBox').classList.toggle('hidden'));

  // ---------- Sentence builders (always scramble) ----------
  const builders=[
    {target:'I went to Nantes with my daughter on Sunday',stress:['went','Nantes','daughter','Sunday']},
    {target:'We watched the mechanical elephant and loved the experience',stress:['watched','mechanical','elephant','loved','experience']},
    {target:'I would like to improve my pronunciation this year',stress:['like','improve','pronunciation','year']}
  ];
  let builderCorrect=0,builderTotal=0;
  function scrambled(tokens){
    let result=shuffle(tokens);let attempts=0;
    while(result.join(' ')===tokens.join(' ')&&attempts<10){result=shuffle(tokens);attempts++;}
    if(result.join(' ')===tokens.join(' ')&&tokens.length>1){[result[0],result[1]]=[result[1],result[0]];}
    return result;
  }
  function renderBuilders(){
    const host=$('#builderHost');host.innerHTML='';builderCorrect=0;builderTotal=0;$('#builderScore').textContent='0/0';
    builders.forEach((item,index)=>{
      const words=item.target.split(' ');const card=document.createElement('div');card.className='builder-card';card.innerHTML=`<div class="builder-answer" aria-label="Your sentence"></div><div class="builder-bank"></div><div class="btn-row left"><button class="btn primary check" type="button">Check</button><button class="btn secondary reset" type="button">↺ Scramble again</button><button class="btn listen-model" type="button">🔊 Model</button></div><div class="feedback"></div><div class="hint-box hidden">Stress: ${item.stress.join(' · ')}</div>`;
      const answer=$('.builder-answer',card),bank=$('.builder-bank',card),fb=$('.feedback',card),hint=$('.hint-box',card);
      function fillBank(){answer.innerHTML='';bank.innerHTML='';scrambled(words).forEach(word=>{const b=document.createElement('button');b.type='button';b.textContent=word;b.addEventListener('click',()=>{answer.appendChild(b);});bank.appendChild(b);});card.dataset.done='0';fb.textContent='';fb.className='feedback';hint.classList.add('hidden');}
      answer.addEventListener('click',e=>{const b=e.target.closest('button');if(b)bank.appendChild(b);});
      $('.reset',card).addEventListener('click',fillBank);$('.listen-model',card).addEventListener('click',()=>speak(item.target));
      $('.check',card).addEventListener('click',()=>{
        const built=$$('button',answer).map(b=>b.textContent).join(' ');const ok=built===item.target;
        if(card.dataset.done!=='1'){card.dataset.done='1';builderTotal++;if(ok)builderCorrect++;$('#builderScore').textContent=`${builderCorrect}/${builderTotal}`;recordAnswer(`builder-${index}`,ok);}
        if(ok){feedback(fb,true,'Correct order. Now read it with stress on the important words.');hint.classList.remove('hidden');}else{feedback(fb,false,'Not yet. Check subject → verb → information. You can move a word back by clicking it.');if($('#trainingMode').value==='guided')hint.classList.remove('hidden');}
      });fillBank();host.appendChild(card);
    });
  }
  renderBuilders();

  // ---------- Timers ----------
  function makeTimer(display,startBtn,resetBtn,seconds){
    let remaining=seconds, interval=null;
    const format=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
    const draw=()=>display.textContent=format(remaining);draw();
    startBtn.addEventListener('click',()=>{
      if(interval)return;startBtn.textContent='⏸ Running…';
      interval=setInterval(()=>{remaining--;draw();if(remaining<=0){clearInterval(interval);interval=null;startBtn.textContent='▶ Start again';speak('Time. Finish your sentence.');}},1000);
    });
    resetBtn.addEventListener('click',()=>{if(interval)clearInterval(interval);interval=null;remaining=seconds;draw();startBtn.textContent=seconds===30?'▶ Start 30 sec':'▶ Start 1 minute';});
    return ()=>{if(interval)clearInterval(interval);};
  }
  makeTimer($('#sprintTimer'),$('#sprintStart'),$('#sprintReset'),30);makeTimer($('#missionTimer'),$('#missionStart'),$('#missionReset'),60);
  $('#sprintAudio').addEventListener('click',()=>{const checked=$('input[name="sprintTarget"]:checked');if(checked)speak(checked.value);});

  // ---------- Recording ----------
  let mediaRecorder=null,chunks=[],stream=null,currentUrl=null;
  $('#recordModel').addEventListener('click',()=>speak($('#recordPrompt').textContent));
  $('#recordStart').addEventListener('click',async()=>{
    const status=$('#recordStatus');
    if(!navigator.mediaDevices || !window.MediaRecorder){status.className='feedback bad';status.textContent='Recording is not supported in this browser. You can still use the model audio and practise aloud.';return;}
    try{
      stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];mediaRecorder=new MediaRecorder(stream);
      mediaRecorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
      mediaRecorder.onstop=()=>{const blob=new Blob(chunks,{type:mediaRecorder.mimeType||'audio/webm'});if(currentUrl)URL.revokeObjectURL(currentUrl);currentUrl=URL.createObjectURL(blob);const audio=$('#recordPlayback');audio.src=currentUrl;audio.classList.remove('hidden');const link=$('#recordDownload');link.href=currentUrl;link.classList.remove('hidden');stream.getTracks().forEach(t=>t.stop());status.className='feedback good';status.textContent='Recording ready. Listen to yourself, then compare with the model.';};
      mediaRecorder.start();$('#recordStart').disabled=true;$('#recordStop').disabled=false;status.className='feedback neutral';status.textContent='Recording… Speak naturally.';
    }catch(err){status.className='feedback bad';status.textContent='Microphone access was not available. You can still practise aloud and compare with the model.';}
  });
  $('#recordStop').addEventListener('click',()=>{if(mediaRecorder&&mediaRecorder.state!=='inactive')mediaRecorder.stop();$('#recordStart').disabled=false;$('#recordStop').disabled=true;});

  // ---------- Self-checks ----------
  $$('.progress-check').forEach(cb=>cb.addEventListener('change',()=>{state.skills[cb.dataset.skill]=cb.checked;updateScore();saveLocal();}));
  function renderSkillReport(){
    const labels={'vowel-contrast':'Vowel contrasts','ed-endings':'-ED endings','final-sounds':'Final consonants','rhythm':'Stress & rhythm'};
    $('#skillReport').innerHTML=Object.entries(labels).map(([k,v])=>`<div class="skill-line"><span>${v}</span><strong>${state.skills[k]?'✓ self-checked':'— not yet checked'}</strong></div>`).join('');
  }

  // ---------- Mission target selection ----------
  $$('.mission-target').forEach(cb=>cb.addEventListener('change',()=>{
    const checked=$$('.mission-target:checked');
    if(checked.length>3){cb.checked=false;return;}
    state.missionTargets=checked.map(x=>x.value);$$('.mission-target').forEach(x=>x.closest('label').classList.toggle('selected',x.checked));
    const status=$('#missionStatus');if(state.missionTargets.length===3){status.textContent=`Ready: ${state.missionTargets.join(' · ')}`;status.classList.add('ready');}else{status.textContent=`Choose ${3-state.missionTargets.length} more target${3-state.missionTargets.length===1?'':'s'}.`;status.classList.remove('ready');}
    updateScore();saveLocal();
  }));

  // ---------- Model tabs ----------
  $$('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.tab-btn').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
    $('#modelA2').classList.toggle('hidden',btn.dataset.model!=='a2');$('#modelB1').classList.toggle('hidden',btn.dataset.model!=='b1');
  }));

  // ---------- Local save / reports ----------
  function saveLocal(){
    state.savedAt=new Date().toISOString();
    const payload={score:state.score,possible:state.possible,answered:state.answered,skills:state.skills,missionTargets:state.missionTargets,pairStats:state.pairStats,savedAt:state.savedAt,comments:$('#trainerComments')?.value||''};
    localStorage.setItem(storageKey,JSON.stringify(payload));
  }
  function loadLocal(){
    try{
      const raw=localStorage.getItem(storageKey);if(!raw)return;const x=JSON.parse(raw);
      Object.assign(state,{score:x.score||0,possible:x.possible||0,answered:x.answered||{},skills:x.skills||{},missionTargets:x.missionTargets||[],pairStats:x.pairStats||state.pairStats,savedAt:x.savedAt||null});
      if($('#trainerComments'))$('#trainerComments').value=x.comments||'';
      $$('.progress-check').forEach(cb=>cb.checked=!!state.skills[cb.dataset.skill]);
      $$('.mission-target').forEach(cb=>{cb.checked=state.missionTargets.includes(cb.value);cb.closest('label').classList.toggle('selected',cb.checked);});
      if(state.missionTargets.length){const status=$('#missionStatus');if(state.missionTargets.length===3){status.textContent=`Ready: ${state.missionTargets.join(' · ')}`;status.classList.add('ready');}else{status.textContent=`Choose ${3-state.missionTargets.length} more target${3-state.missionTargets.length===1?'':'s'}.`;}}
    }catch(e){console.warn('Could not load progress',e);}
  }
  $('#trainerComments').addEventListener('input',()=>saveLocal());
  $('#saveProgress').addEventListener('click',()=>{saveLocal();const b=$('#saveProgress');const old=b.textContent;b.textContent='✓ Saved';setTimeout(()=>b.textContent=old,1300);});

  function reportText(){
    const accuracy=state.possible?Math.round(state.score/state.possible*100):0;
    const skillLines=Object.entries({'vowel-contrast':'Vowel contrasts','ed-endings':'-ED endings','final-sounds':'Final consonants','rhythm':'Stress & rhythm'}).map(([k,v])=>`- ${v}: ${state.skills[k]?'self-checked':'not yet checked'}`).join('\n');
    return `PRONUNCIATION PROGRESS REPORT\n\nDate: ${new Date().toLocaleString()}\nInteractive score: ${state.score}/${state.possible}\nAccuracy: ${accuracy}%\nMission targets: ${state.missionTargets.join(', ')||'not selected'}\n\nSKILLS\n${skillLines}\n\nTEACHER NOTES\n${$('#trainerComments').value||'—'}\n\nFOCUS OF LESSON\nVowels /ɪ/ vs /iː/, /aɪ/, /æ/ vs /eɪ/, /e/ vs /æ/, /ʌ/, /ɑː/, schwa; -ED; -S/-ES; silent letters; H, TH, W/V, R; final consonants; word stress; sentence stress; linking.\n`;
  }
  function download(name,content,type='text/plain'){
    const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  $('#downloadReport').addEventListener('click',()=>download('pronunciation-progress-report.txt',reportText()));
  $('#exportProgress').addEventListener('click',()=>download('pronunciation-progress-data.json',JSON.stringify({exportedAt:new Date().toISOString(),...state,comments:$('#trainerComments').value||''},null,2),'application/json'));
  $('#printReport').addEventListener('click',()=>window.print());
  $('#resetAll').addEventListener('click',()=>{
    if(!confirm('Reset all scores, checks, targets and saved progress for this lesson?'))return;
    localStorage.removeItem(storageKey);location.reload();
  });

  loadLocal(); updateScore();
  $('#iPairScore').textContent=`${state.pairStats.i.correct}/${state.pairStats.i.total}`;$('#aPairScore').textContent=`${state.pairStats.a.correct}/${state.pairStats.a.total}`;

  // Mark voice list when loaded (some browsers load async)
  if('speechSynthesis' in window){window.speechSynthesis.onvoiceschanged=()=>window.speechSynthesis.getVoices();}
})();
