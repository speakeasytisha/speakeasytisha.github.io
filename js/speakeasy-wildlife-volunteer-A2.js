(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const norm=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,' ');
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const deepClone=o=>JSON.parse(JSON.stringify(o));

  const STORE_KEY = window.__SE_STORE_KEY__;
  const DATA = window.__SE_DATA__;

  const DEFAULT_STATE={score:0,streak:0,accent:'US',hints:true,solved:{}};
  let state=loadState();
  function loadState(){
    try{
      const raw=localStorage.getItem(STORE_KEY);
      if(!raw) return deepClone(DEFAULT_STATE);
      const p=JSON.parse(raw);
      return {...deepClone(DEFAULT_STATE),...p,solved:p.solved||{}};
    }catch(e){return deepClone(DEFAULT_STATE);}
  }
  function saveState(){localStorage.setItem(STORE_KEY,JSON.stringify(state));}

  // speech
  let voiceCache=[];
  function refreshVoices(){voiceCache=('speechSynthesis'in window)?speechSynthesis.getVoices():[];}
  if('speechSynthesis'in window){refreshVoices();speechSynthesis.onvoiceschanged=refreshVoices;}
  function pickVoice(){
    const want=state.accent==='UK'?['en-GB','en_GB']:['en-US','en_US'];
    return (voiceCache||[]).find(v=>want.includes(v.lang))||(voiceCache||[]).find(v=>(v.lang||'').toLowerCase().startsWith('en'))||null;
  }
  function speak(text){
    if(!('speechSynthesis'in window))return;
    try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);const v=pickVoice();if(v)u.voice=v;u.rate=.95;speechSynthesis.speak(u);}catch(e){}
  }
  function stopSpeak(){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();}

  // hud
  function setHint(t){const b=$('#hintBox');if(b) b.textContent=t;}
  let TOTAL=0;
  function markSolved(id,pts=1){
    if(state.solved[id])return false;
    state.solved[id]=true;state.score+=pts;state.streak+=1;
    saveState();updateHud();return true;
  }
  function markWrong(){state.streak=0;saveState();updateHud();}
  function updateHud(){
    $('#scoreNow').textContent=String(state.score);
    $('#streakNow').textContent=String(state.streak);
    $('#scoreTotal').textContent=String(TOTAL);
    const pct=TOTAL?Math.round((state.score/TOTAL)*100):0;
    $('#progressPct').textContent=pct+'%';
    $('#progressBar').style.width=clamp(pct,0,100)+'%';
  }
  function applyPrefs(){
    $('#accentUS').classList.toggle('is-active',state.accent==='US');
    $('#accentUK').classList.toggle('is-active',state.accent==='UK');
    $('#hintsOn').classList.toggle('is-active',!!state.hints);
    $('#hintsOff').classList.toggle('is-active',!state.hints);
  }
  function hookTopbar(){
    $('#btnPrint').addEventListener('click',()=>window.print());
    $('#btnReset').addEventListener('click',()=>{if(!confirm('Reset score + progress for this lesson?'))return;localStorage.removeItem(STORE_KEY);location.reload();});
    $('#accentUS').addEventListener('click',()=>{state.accent='US';saveState();applyPrefs();setHint('Accent set to US.');});
    $('#accentUK').addEventListener('click',()=>{state.accent='UK';saveState();applyPrefs();setHint('Accent set to UK.');});
    $('#hintsOn').addEventListener('click',()=>{state.hints=true;saveState();applyPrefs();setHint('Hints ON.');});
    $('#hintsOff').addEventListener('click',()=>{state.hints=false;saveState();applyPrefs();setHint('Hints OFF.');});
  }

  // vocab
  function renderVocab(){
    const vocab=DATA.vocab||[];
    const tabs=$('#vTabs'),grid=$('#vocabGrid'),search=$('#vSearch');
    const cats=['All',...Array.from(new Set(vocab.map(v=>v.cat)))];
    tabs.innerHTML=cats.map((c,i)=>`<button class="tab ${i===0?'is-active':''}" type="button" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
    let active='All';
    function show(){
      const cat=active,q=norm(search.value);
      grid.innerHTML=vocab
        .filter(v=>cat==='All'||v.cat===cat)
        .filter(v=>!q||norm(v.en).includes(q)||norm(v.fr).includes(q)||norm(v.ex||'').includes(q))
        .map((v,idx)=>`
          <button class="vcard" type="button" data-en="${esc(v.en)}" aria-label="Vocabulary card ${idx+1}">
            <div class="vcard__top"><div class="vcard__icon" aria-hidden="true">${v.icon}</div><div class="vcard__term">${esc(v.en)}</div></div>
            <div class="vcard__meta"><span class="tag">${esc(v.cat)}</span> • FR: <strong>${esc(v.fr)}</strong> • tap to flip</div>
            <div class="vcard__def">
              <div><strong>FR:</strong> ${esc(v.fr)}</div>
              <div><strong>Meaning:</strong> ${esc(v.def)}</div>
              ${v.ex?`<div style="margin-top:6px;"><strong>Example:</strong> ${esc(v.ex)}</div>`:''}
              <div style="margin-top:8px;color:rgba(247,248,251,.78)"><span class="kbd">Tip</span> Tap again to hide.</div>
            </div>
          </button>
        `).join('');
    }
    show();
    tabs.addEventListener('click',e=>{
      const b=e.target.closest('.tab'); if(!b) return;
      $$('.tab',tabs).forEach(x=>x.classList.remove('is-active'));
      b.classList.add('is-active'); active=b.dataset.cat; show();
    });
    search.addEventListener('input',show);
    grid.addEventListener('click',e=>{
      const c=e.target.closest('.vcard'); if(!c) return;
      c.classList.toggle('is-flipped'); speak(c.dataset.en);
    });
    $('#btnVocabListen').addEventListener('click',()=>{speak(vocab.map(v=>`${v.en}. ${v.def}.`).join(' '));});
    $('#btnVocabStop').addEventListener('click',stopSpeak);
  }

  // MCQ
  function renderMCQ(rootSel, bank, prefix){
    const root=$(rootSel); if(!root) return;
    root.innerHTML = bank.map((q,i)=>{const id=`${prefix}_${i+1}`; return `
      <div class="qItem" data-id="${esc(id)}" data-answer="${esc(q.a)}">
        <div class="qQ">${esc(q.q)}</div>
        <div class="opts">${q.opts.map(o=>`<button class="opt" type="button" data-choice="${esc(o)}">${esc(o)}</button>`).join('')}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
          <button class="btn btn--ghost hintBtn" type="button" data-hint="${esc(q.hint||'Look at meaning + grammar.')}">Hint</button>
          <button class="btn btn--ghost whyBtn" type="button">Why?</button>
          <button class="btn btn--ghost speakBtn" type="button">🔊 Listen</button>
        </div>
        <div class="fb" aria-live="polite"></div>
        <div class="explain" aria-live="polite">${esc(q.why||'')}</div>
      </div>
    `}).join('');
    $$('.qItem',root).forEach(it=>{
      const id=it.dataset.id;
      if(state.solved[id]){
        it.querySelectorAll('.opt').forEach(b=>b.disabled=true);
        const fb=it.querySelector('.fb'); fb.textContent='✅ Already solved'; fb.className='fb good';
      }
    });
    root.addEventListener('click',e=>{
      const it=e.target.closest('.qItem'); if(!it) return;
      const id=it.dataset.id;
      const fb=it.querySelector('.fb');
      const ex=it.querySelector('.explain');
      if(e.target.closest('.speakBtn')){speak(it.querySelector('.qQ')?.textContent||''); return;}
      const why=e.target.closest('.whyBtn'); if(why){ex.classList.toggle('is-on'); return;}
      const hint=e.target.closest('.hintBtn');
      if(hint){
        if(!state.hints){setHint('Hints are OFF. Turn them on in the top bar.'); fb.textContent='Hints are OFF.'; fb.className='fb'; return;}
        const h=hint.dataset.hint||''; setHint(h); fb.textContent='💡 '+h; fb.className='fb'; return;
      }
      const opt=e.target.closest('.opt'); if(!opt || state.solved[id]) return;
      const ans=it.dataset.answer, ch=opt.dataset.choice;
      if(ch===ans){
        opt.classList.add('is-right');
        it.querySelectorAll('.opt').forEach(b=>b.disabled=true);
        fb.textContent='✅ Correct!'; fb.className='fb good';
        markSolved(id,1);
        if((ex.textContent||'').trim()) ex.classList.add('is-on');
      }else{
        opt.classList.add('is-wrong');
        fb.textContent='❌ Not yet. Try again.'; fb.className='fb bad';
        markWrong();
      }
    });
  }

  // FIB
  function hookFIB(){
    $$('input[data-answer]').forEach(inp=>{
      const id=inp.dataset.id, ans=inp.dataset.answer;
      const row=inp.closest('.fibRow');
      const fb=row?row.querySelector('.fb'):null;
      const h=row?row.querySelector('.hintBtn'):null;
      if(state.solved[id]){
        inp.classList.add('is-right'); inp.value=ans; inp.disabled=true;
        if(fb){fb.textContent='✅ Correct'; fb.className='fb good';}
        return;
      }
      if(h){
        h.addEventListener('click',()=>{
          if(!state.hints){setHint('Hints are OFF. Turn them on in the top bar.'); if(fb){fb.textContent='Hints are OFF.'; fb.className='fb';} return;}
          const hh=h.dataset.hint||''; setHint(hh);
          if(fb){fb.textContent='💡 '+hh; fb.className='fb';}
        });
      }
      inp.addEventListener('input',()=>{
        const v=norm(inp.value), a=norm(ans);
        if(v===a){
          inp.classList.remove('is-wrong'); inp.classList.add('is-right'); inp.disabled=true;
          if(fb){fb.textContent='✅ Correct!'; fb.className='fb good';}
          markSolved(id,1); return;
        }
        if(v.length>=Math.max(3,a.length)){
          inp.classList.add('is-wrong');
          if(fb){fb.textContent='❌ Not quite. Try again.'; fb.className='fb bad';}
          markWrong();
        }else{
          inp.classList.remove('is-wrong'); inp.classList.remove('is-right');
          if(fb){fb.textContent=''; fb.className='fb';}
        }
      });
    });
  }

  // DnD + tap
  let selected=null;
  function renderDnD(){
    const tokens=DATA.dnd||[];
    const bank=$('#tokenBank'); if(!bank) return;
    bank.innerHTML=tokens.map((x,i)=>{
      const id=`dnd_${i+1}`; const locked=!!state.solved[id];
      return `<button class="token ${locked?'is-locked':''}" type="button" draggable="${locked?'false':'true'}" data-id="${id}" data-cat="${esc(x.cat)}" data-text="${esc(x.t)}" ${locked?'disabled':''}>${esc(x.t)}</button>`;
    }).join('');
    tokens.forEach((x,i)=>{
      const id=`dnd_${i+1}`;
      if(state.solved[id]){
        const tok=bank.querySelector(`[data-id="${id}"]`);
        const drop=document.querySelector(`.zone__drop[data-cat="${x.cat}"]`);
        if(tok && drop) drop.appendChild(tok);
      }
    });
  }
  function dndFeedback(msg,kind=''){
    const b=$('#dndFeedback'); if(!b) return;
    b.textContent=msg;
    b.style.color = kind==='good' ? 'rgba(52,211,153,.95)' : (kind==='bad' ? 'rgba(251,113,133,.95)' : 'rgba(247,248,251,.78)');
  }
  function lockToken(tok){tok.classList.add('is-locked'); tok.disabled=true; tok.draggable=false; tok.classList.remove('is-selected'); selected=null;}
  function handleTokenToZone(tok,cat,zoneEl){
    const correct=tok.dataset.cat, id=tok.dataset.id;
    const drop=document.querySelector(`.zone__drop[data-cat="${cat}"]`); if(!drop) return;
    if(cat===correct){
      drop.appendChild(tok); lockToken(tok);
      zoneEl.classList.add('is-hot'); setTimeout(()=>zoneEl.classList.remove('is-hot'),250);
      dndFeedback(`✅ Correct: “${tok.dataset.text}” → ${cat}`,'good');
      markSolved(id,1); speak(tok.dataset.text);
    }else{
      zoneEl.classList.add('is-bad'); setTimeout(()=>zoneEl.classList.remove('is-bad'),350);
      dndFeedback('❌ Not correct. Try another box.','bad'); markWrong();
      if(state.hints) setHint('DnD hint: think “meaning + category”.');
    }
  }
  function attachDnD(){
    const bank=$('#tokenBank'); if(!bank) return;
    bank.addEventListener('dragstart',e=>{
      const tok=e.target.closest('.token'); if(!tok||tok.disabled) return;
      e.dataTransfer.setData('text/plain',tok.dataset.id);
      e.dataTransfer.effectAllowed='move';
    });
    $$('.zone').forEach(zone=>{
      const drop=zone.querySelector('.zone__drop');
      zone.addEventListener('dragover',e=>{e.preventDefault(); zone.classList.add('is-hot');});
      zone.addEventListener('dragleave',()=>zone.classList.remove('is-hot'));
      zone.addEventListener('drop',e=>{
        e.preventDefault(); zone.classList.remove('is-hot');
        const id=e.dataTransfer.getData('text/plain');
        const tok=document.querySelector(`.token[data-id="${id}"]`);
        if(!tok) return;
        handleTokenToZone(tok, drop.dataset.cat, zone);
      });
      zone.addEventListener('click',()=>{ if(!selected) return; handleTokenToZone(selected, drop.dataset.cat, zone); });
      zone.addEventListener('keydown',ev=>{
        if(ev.key==='Enter'||ev.key===' '){
          ev.preventDefault(); if(!selected) return;
          handleTokenToZone(selected, drop.dataset.cat, zone);
        }
      });
    });
    bank.addEventListener('click',e=>{
      const tok=e.target.closest('.token'); if(!tok||tok.disabled) return;
      if(selected && selected!==tok) selected.classList.remove('is-selected');
      if(tok.classList.contains('is-selected')){
        tok.classList.remove('is-selected'); selected=null;
        dndFeedback('Tap mode: tap a token → then tap a category box.');
      }else{
        tok.classList.add('is-selected'); selected=tok;
        dndFeedback(`Selected: “${tok.dataset.text}” → now tap a box.`);
      }
    });
  }

  // dialogue
  let dlgIndex=0;
  function renderDialogue(){
    const d=DATA.dialogue||[];
    const s=d[dlgIndex];
    $('#dlgNpc').innerHTML=`<div class="dlgLine"><span class="who">${esc(s.npcWho)}:</span> ${esc(s.npc)}</div>`;
    $('#dlgChoices').innerHTML=s.choices.map((c,i)=>`<button class="choice" type="button" data-i="${i}">${esc(c)}</button>`).join('');
    $('#dlgFb').textContent=''; $('#dlgFb').className='fb';
    $('#dlgWhy').textContent=''; $('#dlgWhy').className='explain';
    $('#dlgCount').textContent=`${dlgIndex+1} / ${d.length}`;
  }
  function hookDialogue(){
    const d=DATA.dialogue||[];
    $('#btnDlgListen').addEventListener('click',()=>{const s=d[dlgIndex]; speak(`${s.npcWho}. ${s.npc}`);});
    $('#btnDlgStop').addEventListener('click',stopSpeak);
    $('#btnDlgHint').addEventListener('click',()=>{
      const s=d[dlgIndex];
      const fb=$('#dlgFb');
      if(!state.hints){setHint('Hints are OFF.'); fb.textContent='Hints are OFF.'; fb.className='fb'; return;}
      const h=s.hint||'Look for the most natural reply.'; setHint(h); fb.textContent='💡 '+h; fb.className='fb';
    });
    $('#btnDlgRestart').addEventListener('click',()=>{dlgIndex=0; renderDialogue(); setHint('Dialogue restarted.');});
    $('#dlgChoices').addEventListener('click',e=>{
      const b=e.target.closest('.choice'); if(!b) return;
      const i=Number(b.dataset.i);
      const s=d[dlgIndex];
      const solvedId=`dlg_${dlgIndex+1}`;
      if(state.solved[solvedId]) return;
      const fb=$('#dlgFb'), why=$('#dlgWhy');
      if(i===s.correct){
        b.classList.add('is-right');
        fb.textContent='✅ Correct. Next line unlocked!'; fb.className='fb good';
        why.textContent=s.why||''; if((why.textContent||'').trim()) why.classList.add('is-on');
        markSolved(solvedId,1);
        setTimeout(()=>{dlgIndex=Math.min(d.length-1,dlgIndex+1); renderDialogue();},650);
      }else{
        b.classList.add('is-wrong');
        fb.textContent='❌ Not quite. Try another answer.'; fb.className='fb bad';
        markWrong();
      }
    });
  }

  function computeTotal(){
    const fib=$$('input[data-answer]').length;
    const mcq=$$('.quiz .qItem').length;
    const dnd=(DATA.dnd||[]).length;
    const dlg=(DATA.dialogue||[]).length;
    return fib+mcq+dnd+dlg;
  }

  function init(){
    hookTopbar(); applyPrefs();
    renderVocab();
    renderMCQ('#mcqLesson1', (DATA.mcq && DATA.mcq.lesson1)||[], 'l1');
    renderMCQ('#mcqLesson2', (DATA.mcq && DATA.mcq.lesson2)||[], 'l2');
    renderMCQ('#mcqPractice', (DATA.mcq && DATA.mcq.practice)||[], 'p');
    hookFIB();
    renderDnD(); attachDnD(); dndFeedback('Tap mode: tap a token → then tap a category box.');
    dlgIndex=0; renderDialogue(); hookDialogue();
    TOTAL=computeTotal(); updateHud();
    setHint('Start with section 2 (Lesson). Then practise with instant feedback + hints.');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();