(() => {
  'use strict';

  const STORE_KEY = 'francoiseLesson2CorsicaStudio_v1';
  const state = {
    accent: 'en-GB',
    french: true,
    solved: {},
    tracker: {},
    score: 0,
    max: 0,
    currentMission: 'intro'
  };

  const vocab = [
    {cat:'Introductions',emoji:'👋',word:'confident',fr:'à l’aise / confiant(e)',def:'able to speak or act without too much doubt',ex:'I’d like to feel more confident when I speak English.'},
    {cat:'Introductions',emoji:'💬',word:'to introduce yourself',fr:'se présenter',def:'to tell someone who you are and give basic information about yourself',ex:'Let me introduce myself. I live in Corsica.'},
    {cat:'Introductions',emoji:'🎯',word:'goal',fr:'objectif',def:'something you want to achieve',ex:'My main goal is to speak more spontaneously.'},
    {cat:'Introductions',emoji:'🧩',word:'background',fr:'parcours / contexte',def:'your experience, education or history',ex:'I have an international background.'},
    {cat:'Introductions',emoji:'🤝',word:'to be part of',fr:'faire partie de',def:'to belong to a group or organisation',ex:'I’m part of an international volleyball association.'},
    {cat:'Place & Corsica',emoji:'🏝️',word:'island',fr:'île',def:'land completely surrounded by water',ex:'Corsica is an island in the Mediterranean.'},
    {cat:'Place & Corsica',emoji:'🌊',word:'coast',fr:'côte / littoral',def:'the land next to the sea',ex:'Many towns are located on the coast.'},
    {cat:'Place & Corsica',emoji:'⛰️',word:'mountainous',fr:'montagneux / montagneuse',def:'having many mountains',ex:'Corsica is a very mountainous island.'},
    {cat:'Place & Corsica',emoji:'🧭',word:'located',fr:'situé(e)',def:'in a particular position or place',ex:'Corsica is located south-east of mainland France.'},
    {cat:'Place & Corsica',emoji:'🌿',word:'inland',fr:'à l’intérieur des terres',def:'away from the coast, toward the centre of a country or island',ex:'The landscape becomes more mountainous inland.'},
    {cat:'Travel & Experience',emoji:'🇦🇺',word:'abroad',fr:'à l’étranger',def:'in or to another country',ex:'Living abroad taught me to adapt.'},
    {cat:'Travel & Experience',emoji:'🧳',word:'to get by',fr:'se débrouiller',def:'to manage with the knowledge or resources you have',ex:'I could get by in English, but I wanted to say more.'},
    {cat:'Travel & Experience',emoji:'😣',word:'frustrated',fr:'frustré(e)',def:'annoyed or disappointed because you cannot do what you want',ex:'I felt frustrated when I could not express my ideas.'},
    {cat:'Travel & Experience',emoji:'🛫',word:'to travel',fr:'voyager',def:'to go from one place to another, especially over a distance',ex:'I want English to feel easier when I travel.'},
    {cat:'Travel & Experience',emoji:'🌱',word:'experience',fr:'expérience / vécu',def:'knowledge or skill gained by doing or living through something',ex:'Living in Australia was an important experience.'},
    {cat:'Association & Volleyball',emoji:'🏐',word:'member',fr:'membre',def:'a person who belongs to a group or organisation',ex:'Our association has members from different countries.'},
    {cat:'Association & Volleyball',emoji:'🌐',word:'international',fr:'international(e)',def:'involving more than one country',ex:'It is an international sports association.'},
    {cat:'Association & Volleyball',emoji:'✉️',word:'correspondence',fr:'correspondance / échanges écrits',def:'letters or emails exchanged with someone',ex:'Sometimes I have to write correspondence in English.'},
    {cat:'Association & Volleyball',emoji:'📅',word:'event',fr:'événement',def:'an organised activity or occasion',ex:'We sometimes organise international events.'},
    {cat:'Association & Volleyball',emoji:'🤝',word:'to coordinate',fr:'coordonner',def:'to organise people or activities so they work well together',ex:'English helps us coordinate with international members.'},
    {cat:'Learning & Communication',emoji:'👀',word:'visual learner',fr:'apprenant(e) visuel(le)',def:'someone who learns well by seeing and reading information',ex:'I’m quite a visual learner, so examples help me.'},
    {cat:'Learning & Communication',emoji:'📖',word:'to read aloud',fr:'lire à voix haute',def:'to say written words so they can be heard',ex:'Reading aloud helps me connect spelling and pronunciation.'},
    {cat:'Learning & Communication',emoji:'🔁',word:'to repeat',fr:'répéter',def:'to say or do something again',ex:'I listen, repeat and then use the phrase in my own answer.'},
    {cat:'Learning & Communication',emoji:'🧠',word:'to remember',fr:'se souvenir / retenir',def:'to keep information in your mind or bring it back to mind',ex:'I remember vocabulary better when I see it in context.'},
    {cat:'Learning & Communication',emoji:'🗣️',word:'spontaneously',fr:'spontanément',def:'naturally, without preparing everything in advance',ex:'My goal is to speak more spontaneously.'}
  ];

  const missions = {
    intro:{title:'Mission 1 · Introduce yourself',prompt:'Introduce yourself to someone you have just met. Aim for 5–7 connected sentences.',cues:'Corsica · volleyball · Australia/Germany · English goal',a2:'Hi, I’m Françoise. I live in Corsica. I’m part of an international volleyball association. I lived in Australia for a year and I also worked in Germany. English is important to me because I like travelling and communicating with people. At the moment, I’m taking lessons to speak more confidently.',b1:'Hi, I’m Françoise and I live in Corsica. I’m involved in an international volleyball association, so I sometimes need English to communicate or write to people from other countries. I’ve had several international experiences, including a year in Australia and some time working in Germany. Living abroad made me realise how useful English is, but also how frustrating it can be when you cannot express yourself freely. That’s why I’m now focusing mainly on speaking and becoming more spontaneous.'},
    corsica:{title:'Mission 2 · Explain where you live',prompt:'Imagine someone has never been to Corsica. Explain where it is and what kind of place it is.',cues:'island · Mediterranean · coast · mountains · north/south/east/west',a2:'I live in Corsica. It is an island in the Mediterranean, south of mainland France. There are mountains inland and many towns on the coast. It is a beautiful place with the sea and nature.',b1:'I live in Corsica, a mountainous island in the Mediterranean. It lies south-east of mainland France and west of Italy. A lot of life is concentrated along the coast, while the centre of the island is much more mountainous. What I like is the contrast between the sea, the villages and the landscapes inland.'},
    now:{title:'Mission 3 · Your usual life vs now',prompt:'Use present simple for your normal life and present continuous for what is happening in your life now.',cues:'usually · sometimes · at the moment · currently',a2:'I usually live and work in French, but I sometimes use English in my volleyball association. At the moment, I’m taking English lessons. I’m working on speaking because I want to feel more confident.',b1:'In my everyday life, I mainly use French, although English sometimes comes up through my international volleyball association. At the moment, I’m taking an English course and focusing much more on speaking. I’m also trying to listen to different accents and turn the vocabulary I recognise into sentences I can use spontaneously.'},
    australia:{title:'Mission 4 · Australia: what you remember',prompt:'Tell a short story about living in Australia for a year. Keep the past tense stable.',cues:'lived · spent · felt · learned · travelled',a2:'I lived in Australia for one year. I wanted to improve my English and experience life abroad. I could get by, but sometimes I felt frustrated because I could not say everything I wanted. It was still an important experience for me.',b1:'I spent a year living in Australia, and it was an experience that stayed with me. I could manage everyday situations, but I often felt frustrated because my English was not strong enough to express more complex ideas. Even so, living there made me more independent and reinforced my desire to speak English properly one day.'},
    association:{title:'Mission 5 · English in your association',prompt:'Explain when and why English can be useful in an international volleyball association.',cues:'members · email · event · coordinate · communicate',a2:'I’m part of an international volleyball association. Sometimes we have members or contacts from other countries. I may need to write an email in English or communicate about an event. English helps us understand each other.',b1:'Because I’m involved in an international volleyball association, English is sometimes genuinely useful rather than just theoretical. I may need to write to an international contact, coordinate information or communicate about an event. I can often manage the written side, but I’d like the same confidence when the conversation becomes spontaneous.'}
  };

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const clean = s => String(s ?? '').trim().replace(/\s+/g,' ');
  const norm = s => clean(s).toLowerCase().replace(/[’]/g,"'").replace(/[.!?]$/,'');

  function toast(msg){
    const el = $('#toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(()=>el.classList.remove('show'),1800);
  }

  function loadState(){
    try{
      const saved = JSON.parse(localStorage.getItem(STORE_KEY)||'{}');
      Object.assign(state,saved);
    }catch(e){}
    if(!['en-US','en-GB','en-AU'].includes(state.accent)) state.accent='en-GB';
    if(typeof state.french!=='boolean') state.french=true;
  }

  function saveState(){
    localStorage.setItem(STORE_KEY,JSON.stringify(state));
    const el=$('#saveState'); if(el){el.textContent='Saved locally ✓'; setTimeout(()=>el.textContent='Saved locally',1200)}
  }

  function shuffleChildren(parent){
    const nodes=[...parent.children];
    for(let i=nodes.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[nodes[i],nodes[j]]=[nodes[j],nodes[i]];}
    nodes.forEach(n=>parent.appendChild(n));
  }

  function initQuestions(){
    const qs=$$('.question');
    state.max=qs.length;
    $('#scoreMax').textContent=state.max;
    $$('.mcq .options').forEach(shuffleChildren);
    qs.forEach((q,i)=>{
      q.dataset.qid='q'+(i+1);
      const saved=state.solved[q.dataset.qid];
      if(saved && saved.correct){restoreCorrect(q,saved.answer);}
    });
    recalcScore();
  }

  function restoreCorrect(q,answer){
    q.dataset.solved='1';
    if(q.classList.contains('mcq')){
      $$('.options button',q).forEach(b=>{if(norm(b.textContent)===norm(answer))b.classList.add('correct')});
    } else if(q.classList.contains('select-question')) {
      $('select',q).value=answer;
    } else if(q.classList.contains('input-question')) {
      $('input',q).value=answer;
    }
    const fb=$('.feedback',q); fb.textContent='✓ Completed'; fb.className='feedback ok';
  }

  function mark(q,isCorrect,answer){
    const fb=$('.feedback',q);
    if(isCorrect){
      q.dataset.solved='1';
      state.solved[q.dataset.qid]={correct:true,answer};
      fb.textContent='✓ Correct. '+(q.dataset.explanation||''); fb.className='feedback ok';
      saveState();recalcScore();
    }else{
      fb.textContent='✗ Not yet. '+(q.dataset.explanation||'Try again.'); fb.className='feedback bad';
    }
  }

  function initQuestionEvents(){
    $$('.mcq').forEach(q=>{
      $$('.options button',q).forEach(btn=>btn.addEventListener('click',()=>{
        const correct=norm(btn.textContent)===norm(q.dataset.answer);
        $$('.options button',q).forEach(b=>b.classList.remove('incorrect'));
        btn.classList.add(correct?'correct':'incorrect');
        if(correct) $$('.options button',q).forEach(b=>{if(b!==btn)b.classList.remove('incorrect')});
        mark(q,correct,btn.textContent);
      }));
    });
    $$('.select-question').forEach(q=>{
      $('select',q).addEventListener('change',e=>{if(!e.target.value)return; mark(q,norm(e.target.value)===norm(q.dataset.answer),e.target.value)});
    });
    $$('.input-question').forEach(q=>{
      const check=()=>{
        const v=norm($('input',q).value), a=norm(q.dataset.answer), alt=norm(q.dataset.altAnswer||'__none__');
        mark(q,v===a||v===alt,$('input',q).value);
      };
      $('.check-input',q).addEventListener('click',check);
      $('input',q).addEventListener('keydown',e=>{if(e.key==='Enter')check()});
    });
  }

  function recalcScore(){
    state.score=Object.values(state.solved||{}).filter(x=>x&&x.correct).length;
    $('#scoreNow').textContent=state.score; $('#scoreMax').textContent=state.max;
    $('#trackerScore').textContent=`${state.score} / ${state.max}`;
    $('#trackerPercent').textContent=state.max?`${Math.round(state.score/state.max*100)}%`:'—';
    updateProgress();
  }

  function updateProgress(){
    const solvedPart=state.max?state.score/state.max:.0;
    const checks=$$('.oral-check');
    const checked=checks.filter(c=>c.checked).length;
    const trackerComplete=$$('.tracker-status').filter(s=>s.value==='Acquis').length;
    const trackerPart=$$('.tracker-status').length?trackerComplete/$$('.tracker-status').length:0;
    const p=Math.round((solvedPart*.6+(checked/(checks.length||1))*.2+trackerPart*.2)*100);
    $('#progressBar').style.width=p+'%';
    $('#oralPercent').textContent=Math.round(checked/(checks.length||1)*100)+'%';
  }

  let voices=[];
  function loadVoices(){voices=window.speechSynthesis?window.speechSynthesis.getVoices():[]}
  function chooseVoice(lang){
    const langLower=lang.toLowerCase();
    let candidates=voices.filter(v=>v.lang.toLowerCase()===langLower);
    if(!candidates.length)candidates=voices.filter(v=>v.lang.toLowerCase().startsWith(langLower.slice(0,2)));
    const preferred={
      'en-GB':['Google UK English Female','Microsoft Sonia Online','Daniel','Serena'],
      'en-US':['Google US English','Microsoft Jenny Online','Samantha','Alex'],
      'en-AU':['Microsoft Natasha Online','Karen','Lee']
    }[lang]||[];
    const rank=name=>{const i=preferred.indexOf(name);return i===-1?999:i};
    return candidates.sort((a,b)=>rank(a.name)-rank(b.name))[0]||candidates[0]||null;
  }
  function speak(text){
    if(!('speechSynthesis'in window)){toast('Speech is not supported in this browser.');return;}
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(clean(text));u.lang=state.accent;u.rate=.94;u.pitch=1;
    const v=chooseVoice(state.accent);if(v)u.voice=v;
    speechSynthesis.speak(u);
  }
  function initSpeech(){
    loadVoices(); if('speechSynthesis'in window)speechSynthesis.onvoiceschanged=loadVoices;
    document.addEventListener('click',e=>{
      const b=e.target.closest('.speak[data-speak]');if(b){speak(b.dataset.speak)}
      const vb=e.target.closest('[data-vocab-speak]');if(vb){speak(vb.dataset.vocabSpeak)}
    });
    $$('.accent-btn').forEach(b=>b.addEventListener('click',()=>{
      state.accent=b.dataset.accent;$$('.accent-btn').forEach(x=>x.classList.toggle('active',x===b));saveState();toast(`Accent: ${b.textContent.trim()}`);
    }));
    $$('.accent-btn').forEach(b=>b.classList.toggle('active',b.dataset.accent===state.accent));
  }

  function initFrench(){
    const t=$('#frenchToggle');t.checked=state.french;
    document.body.classList.toggle('french-off',!state.french);
    t.addEventListener('change',()=>{state.french=t.checked;document.body.classList.toggle('french-off',!state.french);saveState()});
  }

  function renderVocab(){
    const select=$('#vocabCategory');
    const cats=['All categories',...new Set(vocab.map(v=>v.cat))];
    select.innerHTML=cats.map(c=>`<option>${c}</option>`).join('');
    const draw=()=>{
      const cat=select.value||'All categories', q=norm($('#vocabSearch').value);
      const items=vocab.filter(v=>(cat==='All categories'||v.cat===cat)&&(!q||norm([v.word,v.fr,v.def,v.ex].join(' ')).includes(q)));
      $('#vocabGrid').innerHTML=items.map(v=>`<article class="vocab-card"><div class="vocab-word-row"><div class="vocab-word"><span class="vocab-emoji">${v.emoji}</span><div><h3>${v.word}</h3><span class="vocab-fr">${v.fr}</span></div></div><button class="mini-btn" type="button" data-vocab-speak="${escAttr(v.word+'. '+v.ex)}">🔊</button></div><p class="vocab-def">${v.def}</p><p class="vocab-example"><b>Example:</b> ${v.ex}</p></article>`).join('')||'<p>No vocabulary matches your search.</p>';
    };
    select.addEventListener('change',draw);$('#vocabSearch').addEventListener('input',draw);draw();
  }
  function escAttr(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

  function introText(){
    const place=clean($('#introPlace').value)||'Corsica';
    const act=clean($('#introActivity').value);
    let past=clean($('#introPast').value).replace(/[.!?]+$/,'');
    const goal=$('#introGoal').value, learn=$('#introLearning').value;
    let parts=[`Hi, I’m Françoise and I live in ${place}.`];
    if(act)parts.push(`I’m part of ${act}.`);
    if(past)parts.push(past[0].toUpperCase()+past.slice(1)+'.');
    parts.push(`I’d like to ${goal} because English is useful for travel and international communication.`);
    parts.push(`I learn best by ${learn}, so I like to see clear examples before I use them in conversation.`);
    return parts.join(' ');
  }
  function initBuilder(){
    const update=()=>$('#introOutput').textContent=introText();
    $$('#introPlace,#introActivity,#introPast,#introGoal,#introLearning').forEach(el=>el.addEventListener(el.tagName==='SELECT'?'change':'input',update));update();
    $('#speakIntro').addEventListener('click',()=>speak(introText()));
    $('#copyIntro').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(introText());toast('Introduction copied.')}catch{fallbackCopy(introText())}});
  }
  function fallbackCopy(text){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast('Copied.')}

  function renderMission(){
    const key=$('#missionSelect').value;state.currentMission=key;const m=missions[key];
    $('#missionCard').innerHTML=`<h3>${m.title}</h3><p>${m.prompt}</p><p class="mission-cues"><b>Useful cues:</b> ${m.cues}</p><button class="mini-btn mission-hear" type="button">🔊 Hear prompt</button>`;
    $('.mission-hear').addEventListener('click',()=>speak(m.prompt));
    $('#missionModels').innerHTML=`<div><span class="level-tag">A2+/B1−</span><p>${m.a2}</p><button class="mini-btn model-hear" data-model="a2" type="button">🔊 Listen</button></div><div><span class="level-tag strong">B1</span><p>${m.b1}</p><button class="mini-btn model-hear" data-model="b1" type="button">🔊 Listen</button></div>`;
    $$('.model-hear').forEach(b=>b.addEventListener('click',()=>speak(m[b.dataset.model])));
    saveState();
  }

  let timerInt=null;
  function startTimer(seconds){
    clearInterval(timerInt);let remaining=seconds;const txt=$('#timerText');
    const draw=()=>{const used=seconds-remaining;txt.textContent=`${String(Math.floor(used/60)).padStart(2,'0')}:${String(used%60).padStart(2,'0')}`};draw();
    timerInt=setInterval(()=>{remaining--;draw();if(remaining<=0){clearInterval(timerInt);txt.textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;toast('Time — finish your sentence.');}},1000);
  }

  let mediaRecorder=null,chunks=[],recordUrl=null;
  async function startRecording(){
    if(!navigator.mediaDevices?.getUserMedia){$('#recordStatus').textContent='Recording is not supported in this browser. You can still do the speaking mission aloud.';return;}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];
      mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
      mediaRecorder.onstop=()=>{
        const blob=new Blob(chunks,{type:mediaRecorder.mimeType||'audio/webm'});if(recordUrl)URL.revokeObjectURL(recordUrl);recordUrl=URL.createObjectURL(blob);
        const audio=$('#recordingPlayback');audio.src=recordUrl;audio.hidden=false;
        const dl=$('#downloadRecording');dl.href=recordUrl;dl.download=`francoise-speaking-${Date.now()}.webm`;dl.hidden=false;
        mediaRecorder.stream.getTracks().forEach(t=>t.stop());
        $('#recordStatus').textContent='Recording ready. Listen once, choose one thing to improve, then speak again.';
      };
      mediaRecorder.start();$('#recordBtn').disabled=true;$('#stopBtn').disabled=false;$('#micOrb').classList.add('recording');$('#recordStatus').textContent='Recording… keep going. Communication first.';
    }catch(e){$('#recordStatus').textContent='Microphone access was not available. You can still practise aloud without recording.';toast('Microphone unavailable.')}
  }
  function stopRecording(){if(mediaRecorder&&mediaRecorder.state!=='inactive'){mediaRecorder.stop();$('#recordBtn').disabled=false;$('#stopBtn').disabled=true;$('#micOrb').classList.remove('recording')}}
  function initStudio(){
    $('#missionSelect').value=state.currentMission in missions?state.currentMission:'intro';$('#missionSelect').addEventListener('change',renderMission);renderMission();
    $('#timer45').addEventListener('click',()=>startTimer(45));$('#timer90').addEventListener('click',()=>startTimer(90));
    $('#recordBtn').addEventListener('click',startRecording);$('#stopBtn').addEventListener('click',stopRecording);
    $$('.oral-check').forEach((c,i)=>{c.checked=!!state.tracker['oral'+i];c.addEventListener('change',()=>{state.tracker['oral'+i]=c.checked;saveState();updateProgress()})});updateProgress();
  }

  function trackerData(){
    return $$('#trackerBody tr').map(tr=>({
      objective:tr.cells[0].textContent.trim(),evidence:tr.cells[1].textContent.trim(),status:$('.tracker-status',tr).value,note:$('.tracker-note',tr).value.trim()
    }));
  }
  function trackerSummaryText(){
    const lines=[
      'FRANÇOISE — LESSON 2 · CORSICA SPEAKING STUDIO',
      `Interactive score: ${state.score}/${state.max} (${state.max?Math.round(state.score/state.max*100):0}%)`,
      `Speaking self-check: ${$('#oralPercent').textContent}`,'',
      ...trackerData().map(r=>`• ${r.objective} — ${r.status}${r.note?' — '+r.note:''}`),'',
      `Trainer comments: ${$('#trainerComments').value.trim()||'—'}`,
      `Learner reflection: ${$('#learnerComments').value.trim()||'—'}`,
      `Next focus: ${$('#nextLessonFocus').value}`
    ];return lines.join('\n');
  }
  function saveTrackerInputs(){
    state.tracker.rows=trackerData();state.tracker.trainer=$('#trainerComments').value;state.tracker.learner=$('#learnerComments').value;state.tracker.next=$('#nextLessonFocus').value;saveState();updateProgress();
  }
  function restoreTracker(){
    const rows=state.tracker.rows||[];
    $$('#trackerBody tr').forEach((tr,i)=>{if(rows[i]){$('.tracker-status',tr).value=rows[i].status||'En cours';$('.tracker-note',tr).value=rows[i].note||''}});
    $('#trainerComments').value=state.tracker.trainer||'';$('#learnerComments').value=state.tracker.learner||'';if(state.tracker.next)$('#nextLessonFocus').value=state.tracker.next;
    $$('.tracker-status,.tracker-note,#trainerComments,#learnerComments,#nextLessonFocus').forEach(el=>el.addEventListener(el.tagName==='SELECT'?'change':'input',saveTrackerInputs));updateProgress();
  }
  function reportHtml(){
    const date=new Date().toLocaleDateString('fr-FR');const rows=trackerData().map(r=>`<tr><td>${html(r.objective)}</td><td>${html(r.evidence)}</td><td><b>${html(r.status)}</b></td><td>${html(r.note||'—')}</td></tr>`).join('');
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Françoise — Lesson 2 Qualiopi Report</title><style>body{font-family:Arial,sans-serif;color:#213431;max-width:1000px;margin:40px auto;padding:0 24px}h1{font-family:Georgia,serif;color:#174f56}h2{color:#b76246}header{border-bottom:4px solid #65744c;padding-bottom:16px}.meta{display:flex;gap:12px;flex-wrap:wrap}.pill{background:#eef3ed;padding:7px 10px;border-radius:999px}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{border:1px solid #d9d9d9;padding:9px;text-align:left;vertical-align:top}th{background:#174f56;color:white}.note{background:#f7f1e8;border-left:4px solid #b76246;padding:12px;margin:10px 0}small{color:#667}</style></head><body><header><h1>Françoise · Lesson 2 · Corsica Speaking Studio</h1><div class="meta"><span class="pill">Date: ${html(date)}</span><span class="pill">Interactive score: ${state.score}/${state.max}</span><span class="pill">Accuracy: ${state.max?Math.round(state.score/state.max*100):0}%</span><span class="pill">Speaking self-check: ${html($('#oralPercent').textContent)}</span></div></header><h2>Skills & evidence</h2><table><thead><tr><th>Objective</th><th>Evidence</th><th>Status</th><th>Trainer note</th></tr></thead><tbody>${rows}</tbody></table><h2>Session comments</h2><div class="note"><b>Trainer</b><p>${html($('#trainerComments').value.trim()||'—')}</p></div><div class="note"><b>Learner reflection</b><p>${html($('#learnerComments').value.trim()||'—')}</p></div><div class="note"><b>Recommended next focus</b><p>${html($('#nextLessonFocus').value)}</p></div><p><small>Generated locally from the interactive lesson tracker. No data was transmitted automatically.</small></p></body></html>`;
  }
  function html(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  function initTrackerExport(){
    $('#copyTracker').addEventListener('click',async()=>{const t=trackerSummaryText();try{await navigator.clipboard.writeText(t);toast('Tracker summary copied.')}catch{fallbackCopy(t)}});
    $('#downloadTracker').addEventListener('click',()=>{saveTrackerInputs();const blob=new Blob([reportHtml()],{type:'text/html;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='francoise-lesson-2-qualiopi-report.html';document.body.appendChild(a);a.click();const href=a.href;a.remove();setTimeout(()=>URL.revokeObjectURL(href),2000);toast('HTML report created.')});
  }

  function initReset(){
    $('#resetLesson').addEventListener('click',()=>{
      if(!confirm('Reset score, tracker and saved lesson data for this page?'))return;
      localStorage.removeItem(STORE_KEY);location.reload();
    });
  }

  loadState();initFrench();renderVocab();initBuilder();initQuestions();initQuestionEvents();initSpeech();initStudio();restoreTracker();initTrackerExport();initReset();
})();
