
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const vocab=window.__VOCAB__ || [];
  const oralTasks=window.__ORAL__ || [];
  const writingTasks=window.__WRITING__ || [];

  const state={
    mode:'practice',
    level:'A2',
    oralLevel:'A2',
    writingLevel:'A2',
    accent:'US',
    score:{ok:0,total:0},
    photo:'town',
    oralIndex:0,
    writingIndex:0,
    timer:null
  };

  const photoData={
    town:{
      title:'Nantucket • Historic Main Street',
      tag:'Cobblestones + village charm',
      image:'./images/nantucket-main-street.jpg',
      alt:'Nantucket Main Street with cobblestones, colourful historic buildings and visitors',
      credit:'Bobak Ha’Eri • CC BY-SA 2.5 • Wikimedia Commons',
      link:'https://commons.wikimedia.org/wiki/File:Sum04-118.jpg',
      description:'This inviting photograph shows Nantucket’s historic Main Street. The cobblestones, colourful wooden buildings, leafy trees and small groups of visitors create a relaxed village-centre atmosphere.',
      starter:'This photograph shows Nantucket’s historic Main Street. In the foreground, there is a cobblestone road, while in the background, there are colourful historic buildings, trees and small local shops.'
    },
    shops:{
      title:'Nantucket • Shops and cafés',
      tag:'Leafy lanes + local life',
      image:'./images/nantucket-main-street-shops.jpg',
      alt:'Tree-lined Nantucket Main Street with small shops, cars and a bright blue sky',
      credit:'Andre Carrotflower • CC BY-SA 4.0 • Wikimedia Commons',
      link:'https://commons.wikimedia.org/wiki/File:20180524_-_14_-_Nantucket,_MA_-_%22Convenience_Shopping%22.jpg',
      description:'This sunny view of Nantucket’s town centre shows a tree-lined cobblestone street with independent shops and cafés. It suggests a slower, friendly and walkable holiday experience.',
      starter:'This picture shows a sunny street in Nantucket town centre. There are small shops on both sides, and the trees make the street look peaceful and welcoming.'
    },
    ocean:{
      title:'Miami • Ocean Drive after dark',
      tag:'Art Deco + nightlife energy',
      image:'./images/miami-ocean-drive-night.jpg',
      alt:'Ocean Drive at night in Miami Beach with Art Deco hotels, palm trees, lights and traffic',
      credit:'chensiyuan • CC BY-SA 4.0 / GFDL • Wikimedia Commons',
      link:'https://commons.wikimedia.org/wiki/File:Ocean_drive_south_beach_miami_night.JPG',
      description:'This vibrant night photograph shows Ocean Drive in Miami Beach. Art Deco hotels, palm trees, restaurant terraces, traffic and colourful reflections make Miami feel lively, stylish and exciting.',
      starter:'This photograph shows Ocean Drive in Miami at night. There are Art Deco hotels, palm trees, cars and bright lights, which makes the street look lively and glamorous.'
    },
    vizcaya:{
      title:'Miami • Vizcaya gardens',
      tag:'Tropical garden + culture',
      image:'./images/miami-vizcaya-gardens.jpg',
      alt:'Lush tropical gardens and a water feature at Vizcaya Museum and Gardens in Miami',
      credit:'Leslie Platt • CC BY 2.0 • Wikimedia Commons',
      link:'https://commons.wikimedia.org/wiki/File:Vizcaya_Museum_and_Gardens_060524_DSC6664.jpg',
      description:'This photograph shows a peaceful corner of the Vizcaya gardens in Miami. The water, sculptures, tropical plants and historic details reveal a quieter cultural side of the city.',
      starter:'This picture shows the gardens at Vizcaya in Miami. There is a water feature in the foreground, and there are tropical plants, stone sculptures and tall trees in the background.'
    }
  };
  const quizzes={
    A:[
      {q:'Choose the best sentence.',opts:['Nantucket is more quiet than Miami.','Nantucket is quieter than Miami.','Nantucket is quietter than Miami.'],a:1,why:'For a short adjective, use quieter than.'},
      {q:'Choose the best sentence.',opts:['Miami is cosmopolitaner than Nantucket.','Miami is more cosmopolitan than Nantucket.','Miami is most cosmopolitan than Nantucket.'],a:1,why:'Use more + long adjective + than.'},
      {q:'Choose the best contrast.',opts:['Miami is lively, because Nantucket is quiet.','Miami is lively, whereas Nantucket is quiet.','Miami is lively, quiet Nantucket.'],a:1,why:'Whereas introduces a clear contrast.'}
    ],
    B:[
      {q:'Look at the cobblestone street in a photo near you. Choose the correct word:',opts:['This cobblestone street is historic.','Those cobblestone street is historic.','These cobblestone street is historic.'],a:0,why:'This + singular noun near you.'},
      {q:'Look at several small shops in one photograph. Choose the correct sentence:',opts:['This shops look welcoming.','These shops look welcoming.','That shops look welcoming.'],a:1,why:'These + plural noun.'},
      {q:'Point to a distant Art Deco hotel in a photograph. Choose the correct sentence:',opts:['That Art Deco hotel looks impressive.','These Art Deco hotel looks impressive.','Those Art Deco hotel look impressive.'],a:0,why:'That + singular noun far away.'}
    ]
  };

  const lsKey='myriam_coastal_compare_v1';
  const getSaved=()=>{try{return JSON.parse(localStorage.getItem(lsKey)||'{}')}catch(e){return {}}};
  const save=(data)=>{try{localStorage.setItem(lsKey,JSON.stringify(data))}catch(e){}};

  function updateScore(){ $('#scorePill').textContent=`Score: ${state.score.ok} / ${state.score.total}`; }
  function addScore(ok){ state.score.total++; if(ok)state.score.ok++; updateScore(); }

  function speak(text){
    if(!('speechSynthesis' in window) || !text)return;
    try{
      window.speechSynthesis.cancel();
      const utter=new SpeechSynthesisUtterance(text);
      utter.lang=state.accent==='UK'?'en-GB':'en-US';
      utter.rate=.94;
      const voices=window.speechSynthesis.getVoices();
      const voice=voices.find(v=>v.lang===utter.lang)||voices.find(v=>v.lang.startsWith('en'));
      if(voice)utter.voice=voice;
      window.speechSynthesis.speak(utter);
    }catch(e){}
  }

  function setMode(mode){
    state.mode=mode;
    $$('[data-mode]').forEach(btn=>btn.classList.toggle('active',btn.dataset.mode===mode));
  }
  function setLevel(level){
    state.level=level;
    $$('[data-level]').forEach(btn=>btn.classList.toggle('active',btn.dataset.level===level));
  }

  function renderPhoto(){
    const p=photoData[state.photo];
    $('#photoStage').innerHTML=`
      <article class="destination-card">
        <div class="photo-wrap"><img src="${p.image}" alt="${p.alt}"><span class="photo-label">${p.tag}</span></div>
        <div class="photo-credit">Photo: <a href="${p.link}" target="_blank" rel="noopener">${p.credit}</a></div>
        <div class="destination-body"><h3>${p.title}</h3><p>${p.description}</p><div class="detail-chips"><span class="detail-chip">Visible details first</span><span class="detail-chip">Then compare</span><span class="detail-chip">Then give an opinion</span></div></div>
      </article>
      <article class="destination-card">
        <div class="destination-body">
          <div class="sub-eyebrow">Speak from the image</div>
          <h3>Use this safe starter</h3>
          <div class="model-panel">${p.starter}\n\nCompared with the other destination, this place looks…\n\nI think it would suit people who… because…</div>
          <div class="hero-actions"><button class="mini-btn" id="readPhotoStarter" type="button">🔊 Read starter</button><button class="mini-btn" id="copyPhotoStarter" type="button">Copy starter</button></div>
          <div class="connector-box"><strong>Challenge:</strong> Add one sentence using <em>whereas</em>, <em>unlike</em> or <em>which means that</em>.</div>
        </div>
      </article>`;
    $('#readPhotoStarter').addEventListener('click',()=>speak(p.starter));
    $('#copyPhotoStarter').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(p.starter)}catch(e){}});
  }

  function renderVocab(filter='All'){
    const cats=['All',...Array.from(new Set(vocab.map(v=>v.cat)))];
    $('#vocabFilters').innerHTML=cats.map(c=>`<button type="button" class="filter-btn ${c===filter?'active':''}" data-vocab-filter="${c}">${c}</button>`).join('');
    $$('[data-vocab-filter]').forEach(btn=>btn.addEventListener('click',()=>renderVocab(btn.dataset.vocabFilter)));
    const list=filter==='All'?vocab:vocab.filter(v=>v.cat===filter);
    $('#vocabGrid').innerHTML=list.map(v=>`<article class="vocab-card"><div class="vocab-cat">${v.cat}</div><div class="vocab-word">${v.word}</div><div class="vocab-fr"><strong>FR:</strong> ${v.fr}</div><div class="vocab-def">${v.def}</div><div class="vocab-ex">${v.ex}</div></article>`).join('');
  }

  function renderQuiz(key,host){
    let index=0,choice=null;
    const draw=()=>{
      const item=quizzes[key][index]; choice=null;
      host.innerHTML=`<div class="question">${item.q}</div><div class="options">${item.opts.map((o,i)=>`<button type="button" class="option-btn" data-option="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join('')}</div><div class="hero-actions"><button type="button" class="mini-btn" data-check>Check</button><button type="button" class="mini-btn" data-next>Next</button></div><div class="feedback" data-feedback></div>`;
      $$('[data-option]',host).forEach(btn=>btn.addEventListener('click',()=>{choice=Number(btn.dataset.option);$$('[data-option]',host).forEach(b=>b.classList.remove('selected'));btn.classList.add('selected')}));
      $('[data-check]',host).addEventListener('click',()=>{
        const fb=$('[data-feedback]',host);
        if(choice===null){fb.textContent='Choose an answer first.';fb.classList.add('bad');return;}
        const ok=choice===item.a; addScore(ok);
        fb.textContent= ok ? `✅ Correct! ${item.why}` : `❌ Not quite. ${state.mode==='practice'?item.why:'Try again.'}`;
        fb.classList.toggle('bad',!ok);
      });
      $('[data-next]',host).addEventListener('click',()=>{index=(index+1)%quizzes[key].length;draw()});
    }; draw();
  }

  function initBuilder(){
    $('#buildCheck').addEventListener('click',()=>{
      const s=$('#buildSubject').value, c=$('#buildComp').value, o=$('#buildObject').value;
      const feedback=$('#buildFeedback');
      const sentence=`${s} is ${c} ${o}.`;
      let ok=true;
      if(s===o)ok=false;
      if(s==='Miami'&&c==='quieter than')ok=false;
      if(s==='Nantucket'&&c==='more lively than')ok=false;
      if(s==='Miami'&&c==='less crowded than')ok=false;
      if(s==='Nantucket'&&c==='more lively than')ok=false;
      feedback.textContent=ok?`✅ ${sentence}`:`❌ This comparison is not logical. Try another choice.`;
      feedback.classList.toggle('bad',!ok);addScore(ok);
    });
    $('#showLengthModel').addEventListener('click',()=>{
      const box=$('#lengthModel');
      const models={
        A2:'A2+: I prefer Nantucket because it is quieter than Miami. I can walk near the beach and relax.',
        B1:'B1: I prefer Nantucket because it is quieter and less crowded than Miami. I enjoy walking near the sea, whereas Miami seems busier and more urban.',
        B2:'B2: I would choose Nantucket because its quieter, more traditional atmosphere suits me better. Unlike Miami, it seems less crowded and less commercial, which means that I could relax, stroll along the coast and enjoy the scenery at a slower pace.'
      };
      box.hidden=false;box.textContent=models[state.level];
    });
    $('#readLengthModel').addEventListener('click',()=>{const box=$('#lengthModel');if(!box.hidden)speak(box.textContent)});
  }

  function currentOral(){return oralTasks[state.oralIndex]||oralTasks[0]}
  function renderOral(){
    const t=currentOral();
    $('#oralSelect').innerHTML=oralTasks.map((x,i)=>`<option value="${i}">${x.title}</option>`).join('');
    $('#oralSelect').value=String(state.oralIndex);
    $('#oralTitle').textContent=t.title;
    $('#oralPrompt').textContent=t.prompt;
    $('#oralPlan').innerHTML=t.plan.map(x=>`<li>${x}</li>`).join('');
    $('#oralModel').textContent='Choose “Show model” when you are ready.';
    const saved=getSaved(); $('#oralNotes').value=(saved.oralNotes||{})[t.id]||'';
  }

  function bindOral(){
    $('#oralSelect').addEventListener('change',e=>{state.oralIndex=Number(e.target.value);renderOral()});
    $('#showOralModel').addEventListener('click',()=>{$('#oralModel').textContent=currentOral().models[state.oralLevel]});
    $('#readOralModel').addEventListener('click',()=>speak($('#oralModel').textContent));
    $('#copyOralModel').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#oralModel').textContent)}catch(e){}});
    $('#oralNotes').addEventListener('input',()=>{const s=getSaved();s.oralNotes=s.oralNotes||{};s.oralNotes[currentOral().id]=$('#oralNotes').value;save(s)});
    $$('[data-model-group="oral"] [data-model-level]').forEach(btn=>btn.addEventListener('click',()=>{state.oralLevel=btn.dataset.modelLevel;$$('[data-model-group="oral"] [data-model-level]').forEach(b=>b.classList.toggle('active',b===btn));$('#oralModel').textContent='Choose “Show model” when you are ready.'}));
  }

  function startTimer(seconds){
    if(state.timer)clearInterval(state.timer);let left=seconds;$('#timerDisplay').textContent=`00:${String(left).padStart(2,'0')}`;
    state.timer=setInterval(()=>{left--;$('#timerDisplay').textContent=`${String(Math.floor(Math.max(left,0)/60)).padStart(2,'0')}:${String(Math.max(left,0)%60).padStart(2,'0')}`;if(left<=0){clearInterval(state.timer);state.timer=null;}},1000);
  }
  function bindTimer(){ $('#timer45').addEventListener('click',()=>startTimer(45));$('#timer60').addEventListener('click',()=>startTimer(60));$('#timerStop').addEventListener('click',()=>{if(state.timer)clearInterval(state.timer);state.timer=null;$('#timerDisplay').textContent='00:00'}); }

  function currentWriting(){return writingTasks[state.writingIndex]||writingTasks[0]}
  function renderWriting(){
    const t=currentWriting();
    $('#writingSelect').innerHTML=writingTasks.map((x,i)=>`<option value="${i}">${x.title}</option>`).join('');
    $('#writingSelect').value=String(state.writingIndex);
    $('#writingTitle').textContent=t.title;
    $('#writingPrompt').textContent=t.prompt;
    $('#writingMust').innerHTML='<strong>Include:</strong><div class="connector-row">'+t.must.map(x=>`<span class="connector">${x}</span>`).join('')+'</div>';
    $('#writingModel').textContent='Choose “Show model” when you are ready.';
    const saved=getSaved();$('#writingBox').value=(saved.writing||{})[t.id]||'';updateWordCount();
  }
  function updateWordCount(){
    const n=($('#writingBox').value.trim().match(/\S+/g)||[]).length;$('#wordCount').textContent=n;$('#wordProgress').style.width=Math.min(100,n/125*100)+'%';
    const s=getSaved();s.writing=s.writing||{};s.writing[currentWriting().id]=$('#writingBox').value;save(s);
  }
  function bindWriting(){
    $('#writingSelect').addEventListener('change',e=>{state.writingIndex=Number(e.target.value);renderWriting()});
    $('#writingBox').addEventListener('input',updateWordCount);
    $('#clearWriting').addEventListener('click',()=>{$('#writingBox').value='';updateWordCount()});
    $('#copyWriting').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#writingBox').value)}catch(e){}});
    $('#showWritingModel').addEventListener('click',()=>{$('#writingModel').textContent=currentWriting().models[state.writingLevel]});
    $('#readWritingModel').addEventListener('click',()=>speak($('#writingModel').textContent));
    $('#copyWritingModel').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#writingModel').textContent)}catch(e){}});
    $$('[data-model-group="writing"] [data-model-level]').forEach(btn=>btn.addEventListener('click',()=>{state.writingLevel=btn.dataset.modelLevel;$$('[data-model-group="writing"] [data-model-level]').forEach(b=>b.classList.toggle('active',b===btn));$('#writingModel').textContent='Choose “Show model” when you are ready.'}));
  }

  function bindHeader(){
    $$('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.mode)));
    $$('[data-level]').forEach(btn=>btn.addEventListener('click',()=>setLevel(btn.dataset.level)));
    $('#voiceUS').addEventListener('click',()=>{state.accent='US';$('#voiceUS').classList.add('active');$('#voiceUK').classList.remove('active')});
    $('#voiceUK').addEventListener('click',()=>{state.accent='UK';$('#voiceUK').classList.add('active');$('#voiceUS').classList.remove('active')});
    $('#stopAudio').addEventListener('click',()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel()});
    $('#resetScore').addEventListener('click',()=>{state.score={ok:0,total:0};updateScore()});
    $$('[data-scroll]').forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));
    $$('[data-photo]').forEach(btn=>btn.addEventListener('click',()=>{state.photo=btn.dataset.photo;$$('[data-photo]').forEach(b=>b.classList.toggle('active',b===btn));renderPhoto()}));
  }

  function init(){
    bindHeader();updateScore();renderPhoto();renderVocab();renderQuiz('A',$('#quizA'));renderQuiz('B',$('#quizB'));initBuilder();renderOral();bindOral();bindTimer();renderWriting();bindWriting();
  }
  document.addEventListener('DOMContentLoaded',init);
})();
