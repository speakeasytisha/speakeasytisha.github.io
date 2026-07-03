(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const storageKey = 'sylvain_lesson3_lisbon_family_future_v1';

  const activityData = {
    grammar: [
      {q:'Choose the correct sentence.', a:['My wife work with me.','My wife works with me.','My wife working with me.'], correct:1, note:'My wife = she, so use works.'},
      {q:'Choose the correct question.', a:['Do you are ready to move?','Are you ready to move?','You are ready to move?'], correct:1, note:'With the verb be, put are before the subject: Are you…?'},
      {q:'Choose the correct future plan.', a:['We are going move to Lisbon in August.','We going to move to Lisbon in August.','We are going to move to Lisbon in August.'], correct:2, note:'Use are going to + base verb.'},
      {q:'Choose the correct sentence.', a:['My daughters are at school.','My daughters is at school.','My daughters am at school.'], correct:0, note:'Daughters = they, so use are.'}
    ],
    family: [
      {q:'Choose the correct sentence.', a:['I have two daughters.','I has two daughters.','I am have two daughters.'], correct:0, note:'I have — not I has.'},
      {q:'Choose the correct sentence.', a:['My eldest daughter are on an apprenticeship programme.','My eldest daughter is on an apprenticeship programme.','My eldest daughter on an apprenticeship programme.'], correct:1, note:'My eldest daughter = she, so use is.'},
      {q:'Choose the correct question.', a:['Does she wants to become a veterinarian?','Does she want to become a veterinarian?','Is she want to become a veterinarian?'], correct:1, note:'After does, use the base verb: want.'},
      {q:'Choose the natural sentence.', a:['My younger daughter is in middle school.','My younger daughter is at the college.','My younger daughter has middle school.'], correct:0, note:'For French collège, say middle school.'}
    ],
    future: [
      {q:'Choose the correct sentence.', a:['We are going to find a home in Lisbon.','We are going find a home in Lisbon.','We going to find a home in Lisbon.'], correct:0, note:'Use are going to + find.'},
      {q:'Choose the best connector.', a:['We are moving because it is a family project.','We are moving but it is a family project.','We are moving so it is a family project.'], correct:0, note:'Because gives a reason.'},
      {q:'Choose the correct negative sentence.', a:['We not going to stay in Savoie.','We are not going to stay in Savoie.','We do not going to stay in Savoie.'], correct:1, note:'Negative: subject + are not + going to + base verb.'},
      {q:'Choose the correct question.', a:['Are you going to travel in August?','Do you going to travel in August?','You are going to travel in August?'], correct:0, note:'Question: Are + subject + going to + base verb?'}
    ],
    listening: [
      {q:'When is Sylvain’s family going to move?', a:['In June','In August','In December'], correct:1, note:'The message says “in August.”'},
      {q:'Where does the family live now?', a:['Lisbon','Savoie','Switzerland'], correct:1, note:'They are moving from Savoie.'},
      {q:'What is the eldest daughter doing?', a:['She is at university.','She is on an apprenticeship programme.','She works for an airline.'], correct:1, note:'She is 17 and on an apprenticeship programme.'},
      {q:'What professional goal is mentioned?', a:['Work directly with airline clients','Sell food in a school','Open a hotel'], correct:0, note:'Sylvain is going to develop his catering business with airline clients.'}
    ]
  };

  const state = {grammar:{},family:{},future:{},listening:{},feeling:''};

  function toggleHint(btn){
    const hint = $('#' + btn.dataset.hintTarget);
    hint.classList.toggle('open');
    btn.textContent = hint.classList.contains('open') ? 'Hide hint' : 'Hint';
  }

  function speak(text, rate=0.9){
    if (!('speechSynthesis' in window)) { alert('Speech is not available in this browser.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB'; utterance.rate = rate; utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => /^en-GB/i.test(v.lang)) || voices.find(v => /^en-US/i.test(v.lang));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }

  function buildQuestions(type, target, status){
    const holder = $('#' + target);
    holder.innerHTML='';
    activityData[type].forEach((item, index) => {
      const card = document.createElement('article'); card.className='question-card';
      card.innerHTML = `<p>${index+1}. ${item.q}</p><div class="options"></div><p class="answer-note" hidden></p>`;
      const opts = $('.options', card);
      item.a.forEach((text, choiceIndex)=>{
        const b=document.createElement('button'); b.type='button'; b.className='option'; b.textContent=text;
        b.addEventListener('click',()=>answer(type,index,choiceIndex,card,status)); opts.appendChild(b);
      });
      holder.appendChild(card);
    });
  }

  function answer(type,index,choice,card,status){
    const item=activityData[type][index]; const correct=choice===item.correct;
    state[type][index]=correct;
    $$('.option',card).forEach((b,i)=>{
      b.disabled=true;
      if(i===item.correct) b.classList.add('correct');
      else if(i===choice) b.classList.add('incorrect');
    });
    const note=$('.answer-note',card); note.hidden=false; note.textContent=(correct?'✓ Correct. ':'✦ Remember: ')+item.note;
    updateScore(type,status); saveProgress(false);
  }

  function updateScore(type,statusId){
    const total=activityData[type].length; const correct=Object.values(state[type]).filter(Boolean).length;
    const answered=Object.keys(state[type]).length;
    const target=$('#'+statusId);
    target.textContent = answered ? `Progress: ${correct}/${total} correct.` : '';
  }

  function setGrammarTab(tab){
    $$('.grammar-tab').forEach(b=>{ const on=b.dataset.tab===tab; b.classList.toggle('active',on); b.setAttribute('aria-selected',String(on));});
    $$('.grammar-panel').forEach(p=>{const on=p.dataset.panel===tab;p.classList.toggle('active',on);p.hidden=!on;});
  }

  function sentenceCap(s){ return s.replace(/\.$/,'').trim(); }

  // After a lead-in such as “Professionally,”, sentence openings usually become lowercase.
  // The pronoun “I” is the exception: it is always written with a capital letter in English.
  function lowerAfterLead(s){
    const clean = sentenceCap(s);
    if(!clean || /^I\b/.test(clean)) return clean;
    return clean.charAt(0).toLowerCase() + clean.slice(1);
  }

  function capitaliseStandaloneI(s){
    return s.replace(/\bi\b/g, 'I');
  }

  function builderText(level){
    const home=sentenceCap($('#bHome').value);
    const family=sentenceCap($('#bFamily').value);
    const work=sentenceCap($('#bWork').value);
    const future=sentenceCap($('#bFuture').value);
    const connector=sentenceCap($('#bConnector').value);
    const connectedFamily=lowerAfterLead(family);
    const connectedWork=lowerAfterLead(work);
    const connectedFuture=lowerAfterLead(future);

    if(level==='a2'){
      return capitaliseStandaloneI(`Hello, my name is Sylvain. ${home}. ${family}. ${work}. ${future} ${connector}.`);
    }
    if(level==='a2b1'){
      return capitaliseStandaloneI(`Hello, my name is Sylvain. ${home}, and ${connectedFamily}. Professionally, ${connectedWork}. Looking ahead, ${connectedFuture} ${connector}. Overall, this move is an important new chapter for my family and my business.`);
    }
    let workDetail='This is a specialised part of the food industry.';
    if(work.startsWith('We prepare')) workDetail='This work is part of a specialised niche market.';
    if(work.startsWith('I work in')) workDetail='It is a specialised niche market with specific professional requirements.';
    return capitaliseStandaloneI(`Hello, my name is Sylvain. ${home}, where my family and professional life are currently based. At home, ${connectedFamily}. Professionally, ${connectedWork}. ${workDetail} Looking ahead, ${connectedFuture} ${connector}. Although there are still practical steps to organise, I am looking forward to this new chapter and to developing the business step by step.`);
  }

  const levelNotes={
    a2:'<b>A2:</b> short, correct sentences. This is the best place to start when speaking.',
    a2b1:'<b>A2+/B1:</b> ideas are grouped with connectors such as <em>and, professionally, looking ahead</em>.',
    b1:'<b>B1:</b> ideas are developed with more detail and varied openings such as <em>at home, professionally, overall, although</em>.'
  };
  let activeLevel='a2';

  function updateBuilder(){
    const output=$('#builderOutput');
    if(!output.dataset.userEdited) output.textContent=builderText(activeLevel);
    $('#levelNote').innerHTML=levelNotes[activeLevel];
    saveProgress(false);
  }

  function copyBuilder(){
    const text=$('#builderOutput').innerText.trim();
    navigator.clipboard?.writeText(text).then(()=>{ const b=$('#copyBuilder'); const old=b.textContent;b.textContent='Copied ✓';setTimeout(()=>b.textContent=old,1800); }).catch(()=>{alert('Select the text and copy it manually.');});
  }

  function collectState(){
    return {
      state, french:document.body.classList.contains('show-french'), activeLevel,
      builder:{home:$('#bHome').value,family:$('#bFamily').value,work:$('#bWork').value,future:$('#bFuture').value,connector:$('#bConnector').value,text:$('#builderOutput').innerText,userEdited:!!$('#builderOutput').dataset.userEdited},
      savedAt:new Date().toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short'})
    };
  }

  function saveProgress(show=true){
    localStorage.setItem(storageKey,JSON.stringify(collectState()));
    if(show){ const el=$('#saveStatus');el.textContent='Saved on this device.';setTimeout(()=>el.textContent='',2400); }
  }

  function restoreProgress(){
    const raw=localStorage.getItem(storageKey); if(!raw) return;
    try{
      const data=JSON.parse(raw);
      if(data.french){document.body.classList.add('show-french');$('#frenchToggle').setAttribute('aria-pressed','true');$('#frenchToggle').textContent='EN only';}
      if(data.builder){
        ['home','family','work','future','connector'].forEach(k=>{if(data.builder[k]) $('#b'+k.charAt(0).toUpperCase()+k.slice(1)).value=data.builder[k];});
        activeLevel=data.activeLevel||'a2';
        if(data.builder.userEdited){ $('#builderOutput').textContent=data.builder.text||''; $('#builderOutput').dataset.userEdited='true'; }
      }
      Object.keys(state).forEach(k=>{ if(k!=='feeling' && data.state?.[k]) Object.assign(state[k],data.state[k]);});
      state.feeling=data.state?.feeling||'';
    }catch{localStorage.removeItem(storageKey);}
  }

  function applyRestoredAnswers(){
    Object.keys(activityData).forEach(type=>{
      const cards=$$(`#${type}Questions .question-card`);
      Object.entries(state[type]).forEach(([idx,wasCorrect])=>{
        const card=cards[Number(idx)];if(!card)return;
        const item=activityData[type][Number(idx)];
        const chosen=wasCorrect?item.correct:null;
        $$('.option',card).forEach((b,i)=>{b.disabled=true;if(i===item.correct)b.classList.add('correct');else if(chosen!==null && i===chosen)b.classList.add('incorrect');});
        const note=$('.answer-note',card);note.hidden=false;note.textContent=(wasCorrect?'✓ Correct. ':'✦ Remember: ')+item.note;
      });
      updateScore(type,type+'Status');
    });
  }

  function downloadNotes(){
    const lines=[
      'SYLVAIN BAILLY — LESSON 3: LISBON, FAMILY & FUTURE', '',
      'CORE LANGUAGE',
      '- I live in Savoie with my wife and our two daughters.',
      '- We run a catering business and prepare food for several airlines.',
      '- We are going to move to Lisbon in August.',
      '- My eldest daughter is on an apprenticeship programme.',
      '- We are looking for a home because this is an important family project.', '',
      'GRAMMAR REMINDER',
      '- Be: I am / you are / he-she is / we are / they are.',
      '- Have: I-we-they have / he-she has.',
      '- Present simple: I-we work / he-she works.',
      '- Future plan: subject + am-is-are going to + base verb.', '',
      'MY PERSONAL INTRODUCTION', $('#builderOutput').innerText.trim(), '',
      'MY SELF-ASSESSMENT', state.feeling || 'Not selected yet.', '',
      'HOME PRACTICE', 'Record a 60-second voice note about your family, move to Lisbon and one professional goal. Use: We are going to… because…'
    ];
    const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Sylvain_Lesson_3_Notes.txt';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(a.href);
  }

  function resetLesson(){ if(!confirm('Reset all answers and saved progress for this lesson?'))return; localStorage.removeItem(storageKey);location.reload(); }

  function init(){
    Object.keys(activityData).forEach(type=>buildQuestions(type,type+'Questions',type+'Status'));
    restoreProgress();
    $$('.grammar-tab').forEach(btn=>btn.addEventListener('click',()=>setGrammarTab(btn.dataset.tab)));
    $$('.hint-button').forEach(btn=>btn.addEventListener('click',()=>toggleHint(btn)));
    $$('.speak-button[data-say]').forEach(btn=>btn.addEventListener('click',()=>speak(btn.dataset.say)));
    $('#playNormal').addEventListener('click',()=>speak('Hello Sylvain. It is great to hear about your family’s move to Lisbon in August. You said that you are coming from Savoie with your wife and your two daughters. Your eldest daughter is seventeen and is on an apprenticeship programme, while your youngest daughter is twelve and is still in middle school. I understand that you are looking for a home near Lisbon, but you have not found one yet. You are also going to develop your catering business and work more directly with airline clients. Please let me know when you know your travel dates.',.92));
    $('#playSlow').addEventListener('click',()=>speak('Hello Sylvain. It is great to hear about your family’s move to Lisbon in August. You said that you are coming from Savoie with your wife and your two daughters. Your eldest daughter is seventeen and is on an apprenticeship programme, while your youngest daughter is twelve and is still in middle school. I understand that you are looking for a home near Lisbon, but you have not found one yet. You are also going to develop your catering business and work more directly with airline clients. Please let me know when you know your travel dates.',.63));
    $('#transcriptToggle').addEventListener('click',()=>{const s=$('#audioScript'),visible=!s.hidden;s.hidden=visible;$('#transcriptToggle').textContent=visible?'Show transcript':'Hide transcript';$('#transcriptToggle').setAttribute('aria-expanded',String(!visible));});
    ['bHome','bFamily','bWork','bFuture','bConnector'].forEach(id=>$('#'+id).addEventListener('change',()=>{delete $('#builderOutput').dataset.userEdited;updateBuilder();}));
    $$('.level-button').forEach(b=>b.addEventListener('click',()=>{activeLevel=b.dataset.level;$$('.level-button').forEach(x=>{const on=x===b;x.classList.toggle('active',on);x.setAttribute('aria-selected',String(on));});delete $('#builderOutput').dataset.userEdited;updateBuilder();}));
    $('#builderOutput').addEventListener('input',()=>{$('#builderOutput').dataset.userEdited='true';saveProgress(false);});
    $('#speakBuilder').addEventListener('click',()=>speak($('#builderOutput').innerText));
    $('#copyBuilder').addEventListener('click',copyBuilder);
    $('#frenchToggle').addEventListener('click',()=>{const on=document.body.classList.toggle('show-french');$('#frenchToggle').setAttribute('aria-pressed',String(on));$('#frenchToggle').textContent=on?'EN only':'FR help';saveProgress(false);});
    $('#saveButton').addEventListener('click',()=>saveProgress(true)); $('#downloadButton').addEventListener('click',downloadNotes); $('#resetButton').addEventListener('click',resetLesson);
    $$('.self-check-buttons button').forEach(btn=>btn.addEventListener('click',()=>{$$('.self-check-buttons button').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');state.feeling=btn.dataset.feel;$('#feelStatus').textContent='Saved: '+state.feeling;saveProgress(false);}));
    if(state.feeling){const b=$(`.self-check-buttons button[data-feel="${CSS.escape(state.feeling)}"]`);if(b){b.classList.add('selected');$('#feelStatus').textContent='Saved: '+state.feeling;}}
    $$('.level-button').forEach(b=>{const on=b.dataset.level===activeLevel;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on));});
    updateBuilder();applyRestoredAnswers();
    if('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged=()=>{};
  }
  document.addEventListener('DOMContentLoaded',init);
})();
