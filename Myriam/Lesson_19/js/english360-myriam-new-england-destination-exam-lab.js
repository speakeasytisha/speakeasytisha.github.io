
(() => {
  'use strict';
  const data = window.LESSON_DATA;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const state = { photo: 0, imgLevel: 'B1', buildLevel: 'B1', oralLevel: 'B1', writingLevel: 'B1', oralIndex: 0, writingIndex: 0, timer: null };

  function renderExamModules(){
    $('#examModules').innerHTML = data.exam.modules.map(m => `<article class="module-card"><h3>${m.skill}</h3><p><strong>${m.count}</strong></p><p><strong>Exercise types:</strong> ${m.types}</p><p><strong>Watch out:</strong> ${m.watch}</p></article>`).join('');
  }

  function renderDestinations(){
    $('#destinationGrid').innerHTML = data.destinations.map(d => `<article class="destination-card"><img src="${d.image}" alt="${d.alt}"><div class="destination-body"><span class="tagline">${d.state} • ${d.region}</span><h3>${d.name}</h3><p><strong>Location:</strong> ${d.location}</p><div class="facts"><div class="fact"><strong>Population</strong><br>${d.population}</div><div class="fact"><strong>How to get there</strong><br>${d.how}</div><div class="fact"><strong>Near</strong><br>${d.near}</div><div class="fact"><strong>Atmosphere</strong><br>${d.atmosphere}</div></div><p><strong>Known for:</strong> ${d.known}</p><p><strong>History:</strong> ${d.history}</p><div class="things">${d.things.map(x=>`<span>${x}</span>`).join('')}</div></div></article>`).join('');
  }

  function renderPhotoTabs(){
    $('#photoTabs').innerHTML = data.destinations.map((d,i)=>`<button type="button" class="${i===state.photo?'active':''}" data-photo="${i}">${d.name}</button>`).join('');
    $$('[data-photo]').forEach(btn => btn.addEventListener('click', () => { state.photo = Number(btn.dataset.photo); renderPhotoTabs(); renderPhoto(); }));
  }
  function renderPhoto(){
    const d = data.destinations[state.photo];
    $('#photoImage').src = d.image; $('#photoImage').alt = d.alt;
    $('#photoTitle').textContent = d.name;
    $('#photoPrompt').textContent = `Describe this image. Say where ${d.name} is, what you can see, what the atmosphere is like and why a visitor might enjoy it.`;
    $('#photoChips').innerHTML = ['This picture shows…','In the foreground…','It is known for…','Compared with…','I would recommend it because…'].map(x=>`<span>${x}</span>`).join('');
    renderPhotoModel();
  }
  function renderPhotoModel(){
    const d = data.destinations[state.photo];
    $('#photoModel').textContent = d['model'+state.imgLevel];
  }

  function renderVocab(){
    const cats = ['All', ...Array.from(new Set(data.vocab.map(v=>v[0])))];
    $('#vocabFilters').innerHTML = cats.map((c,i)=>`<button type="button" class="${i===0?'active':''}" data-vocab="${c}">${c}</button>`).join('');
    const draw = cat => {
      $$('[data-vocab]').forEach(b=>b.classList.toggle('active', b.dataset.vocab===cat));
      const list = cat==='All' ? data.vocab : data.vocab.filter(v=>v[0]===cat);
      $('#vocabGrid').innerHTML = list.map(v=>`<article class="vocab-card"><div class="cat">${v[0]}</div><h3>${v[1]}</h3><p><strong>FR:</strong> ${v[2]}</p><p>${v[3]}</p><p><em>${v[4]}</em></p></article>`).join('');
    };
    $$('[data-vocab]').forEach(btn=>btn.addEventListener('click',()=>draw(btn.dataset.vocab)));
    draw('All');
  }

  function renderQuiz(){
    let idx=0, choice=null;
    const draw=()=>{
      const q=data.quiz[idx]; choice=null;
      $('#quizBox').innerHTML = `<div class="question">${idx+1}. ${q.q}</div><div class="options">${q.opts.map((o,i)=>`<button type="button" class="option-btn" data-opt="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join('')}</div><button type="button" class="btn primary" id="checkQuiz">Check</button><button type="button" class="btn ghost" id="nextQuiz" style="color:var(--ocean);border-color:var(--line);background:#fff;margin-left:8px">Next</button><div id="quizFeedback" class="feedback"></div>`;
      $$('[data-opt]').forEach(b=>b.addEventListener('click',()=>{choice=Number(b.dataset.opt);$$('[data-opt]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');}));
      $('#checkQuiz').addEventListener('click',()=>{const fb=$('#quizFeedback'); if(choice===null){fb.textContent='Choose an answer first.';fb.className='feedback bad';return;} const ok=choice===q.a; fb.textContent=(ok?'✅ Correct. ':'❌ Not quite. ')+q.why; fb.className='feedback '+(ok?'good':'bad');});
      $('#nextQuiz').addEventListener('click',()=>{idx=(idx+1)%data.quiz.length;draw();});
    }; draw();
  }

  function renderFill(){
    const items = [
      ['Nantucket is ____ the coast of Massachusetts.','off','near','at'],
      ['Provincetown is ____ the tip of Cape Cod.','at','in','off'],
      ['Boston is ____ than Provincetown.','larger','largest','more large'],
      ['Martha’s Vineyard is ____ by ferry from Woods Hole.','accessible','access','accessing']
    ];
    $('#fillBox').innerHTML = items.map((it,i)=>`<div class="fill-line"><label>${i+1}. ${it[0]}</label><select data-fill="${i}"><option value="">Choose…</option>${it.slice(1).map(x=>`<option>${x}</option>`).join('')}</select><div class="feedback" data-fillfb="${i}"></div></div>`).join('');
    $$('[data-fill]').forEach(sel=>sel.addEventListener('change',()=>{const i=Number(sel.dataset.fill); const ok=sel.value===items[i][1]; const fb=$(`[data-fillfb="${i}"]`); fb.textContent=ok?'✅ Correct.':'❌ Try again.'; fb.className='feedback '+(ok?'good':'bad');}));
  }

  function renderBuild(){
    const models={
      history:{A2:'I like Boston because it is historic. It is bigger than Nantucket and visitors can walk the Freedom Trail.',B1:'I like Boston because it is one of the most historic cities in the United States. It is larger and more urban than the island destinations, so it is a good place for museums, walking tours and cultural visits.',B2:'I would choose Boston for a history-focused trip because it offers the richest urban and revolutionary heritage in this lesson. Compared with the smaller coastal destinations, Boston is more dynamic and more practical, which means that visitors can combine museums, neighbourhoods and the Freedom Trail in one trip.'},
      calm:{A2:'I prefer Nantucket because it is calm. It is quieter than Boston and it has beautiful streets and a lighthouse.',B1:'I prefer Nantucket because it seems quieter and more traditional than Boston or Provincetown. It would suit people who enjoy calm walks, maritime history and elegant streets.',B2:'I would prefer Nantucket because its calm, traditional atmosphere feels more relaxing than the energy of Boston or Provincetown. Its cobblestone streets, lighthouse and whaling history create a refined island experience, which is why it would suit travellers seeking peace and heritage.'},
      art:{A2:'I would visit Provincetown because it is artistic. It is more lively than Nantucket and it has beaches and galleries.',B1:'I would visit Provincetown because it is artistic, open-minded and lively. It is known for galleries, beaches, whale watching and the Pilgrim Monument, which makes it different from the other places.',B2:'I would recommend Provincetown to creative travellers because it combines history, art, beaches and a strong culture of openness. Compared with Nantucket, it is more expressive and more inclusive, while still offering a beautiful Cape Cod setting.'}
    };
    const draw=()=>{$('#buildModel').textContent=models[$('#answerBuilder').value][state.buildLevel];};
    $('#answerBuilder').addEventListener('change',draw); $$('[data-build-level]').forEach(b=>b.addEventListener('click',()=>{state.buildLevel=b.dataset.buildLevel;$$('[data-build-level]').forEach(x=>x.classList.toggle('active',x===b));draw();})); draw();
  }

  function renderOral(){
    $('#oralSelect').innerHTML = data.oral.map((o,i)=>`<option value="${i}">${o.title}</option>`).join('');
    $('#oralSelect').addEventListener('change',()=>{state.oralIndex=Number($('#oralSelect').value); $('#oralPrompt').textContent=data.oral[state.oralIndex].prompt; $('#oralModel').textContent='Click “Show model”.';});
    $('#oralPrompt').textContent=data.oral[0].prompt;
    $$('[data-oral-level]').forEach(b=>b.addEventListener('click',()=>{state.oralLevel=b.dataset.oralLevel;$$('[data-oral-level]').forEach(x=>x.classList.toggle('active',x===b));$('#oralModel').textContent='Click “Show model”.';}));
    $('#showOral').addEventListener('click',()=>{$('#oralModel').textContent=data.oral[state.oralIndex].models[state.oralLevel];});
    $('#readOral').addEventListener('click',()=>speak($('#oralModel').textContent));
  }

  function renderWriting(){
    $('#writingSelect').innerHTML = data.writing.map((w,i)=>`<option value="${i}">${w.title}</option>`).join('');
    $('#writingSelect').addEventListener('change',()=>{state.writingIndex=Number($('#writingSelect').value); $('#writingPrompt').textContent=data.writing[state.writingIndex].prompt; $('#writingModel').textContent='Click “Show model”.';});
    $('#writingPrompt').textContent=data.writing[0].prompt;
    $$('[data-writing-level]').forEach(b=>b.addEventListener('click',()=>{state.writingLevel=b.dataset.writingLevel;$$('[data-writing-level]').forEach(x=>x.classList.toggle('active',x===b));$('#writingModel').textContent='Click “Show model”.';}));
    $('#showWriting').addEventListener('click',()=>{$('#writingModel').textContent=data.writing[state.writingIndex].models[state.writingLevel];});
    $('#readWriting').addEventListener('click',()=>speak($('#writingModel').textContent));
    $('#writingText').addEventListener('input',()=>{const n=($('#writingText').value.match(/\S+/g)||[]).length;$('#wordCount').textContent=n;$('#wordBar').style.width=Math.min(100,n/125*100)+'%';});
    $('#clearWriting').addEventListener('click',()=>{$('#writingText').value='';$('#wordCount').textContent='0';$('#wordBar').style.width='0%';});
  }

  function speak(text){
    if(!('speechSynthesis' in window)||!text||text.includes('Click')) return;
    speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='en-US'; u.rate=.94; speechSynthesis.speak(u);
  }
  function timer(sec){ if(state.timer) clearInterval(state.timer); let left=sec; $('#timer').textContent=`00:${String(left).padStart(2,'0')}`; state.timer=setInterval(()=>{left--; $('#timer').textContent=`${String(Math.floor(Math.max(0,left)/60)).padStart(2,'0')}:${String(Math.max(0,left)%60).padStart(2,'0')}`; if(left<=0){clearInterval(state.timer);state.timer=null;}},1000); }

  document.addEventListener('DOMContentLoaded',()=>{
    renderExamModules(); renderDestinations(); renderPhotoTabs(); renderPhoto(); renderVocab(); renderQuiz(); renderFill(); renderBuild(); renderOral(); renderWriting();
    $$('[data-img-level]').forEach(b=>b.addEventListener('click',()=>{state.imgLevel=b.dataset.imgLevel;$$('[data-img-level]').forEach(x=>x.classList.toggle('active',x===b));renderPhotoModel();}));
    $('#speakPhoto').addEventListener('click',()=>speak($('#photoPrompt').textContent));
    $('#t45').addEventListener('click',()=>timer(45)); $('#t60').addEventListener('click',()=>timer(60)); $('#tStop').addEventListener('click',()=>{if(state.timer)clearInterval(state.timer);state.timer=null;$('#timer').textContent='00:00';});
  });
})();
