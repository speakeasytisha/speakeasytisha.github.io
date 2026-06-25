
(()=>{
  const D = window.KARINE_DATA;
  const $=(s,e=document)=>e.querySelector(s);
  const $$=(s,e=document)=>Array.from(e.querySelectorAll(s));
  const dbg=$('#debug');
  const log=m=>{try{dbg.classList.remove('hidden');dbg.textContent+='\n'+m}catch(e){}};
  window.addEventListener('error',e=>log('ERROR: '+e.message+' line '+e.lineno));
  const safeOn=(el,ev,fn)=>{if(el) el.addEventListener(ev,fn)};
  const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const norm=s=>String(s??'').toLowerCase().replace(/[’]/g,"'").replace(/\s+/g,' ').replace(/\s+([,.?!])/g,'$1').trim();
  const shuffle=a=>{a=(a||[]).slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a};
  const Score={now:0,max:100,done:new Set(),award(k,p=1){if(this.done.has(k))return;this.done.add(k);this.now+=p;upd()},reset(){this.now=0;this.done.clear();upd()}};
  function upd(){ $('#scoreNow').textContent=Score.now; $('#scoreMax').textContent=Score.max; $('#bar').style.width=Math.min(100,Math.round(Score.now/Score.max*100))+'%';}
  function feed(id,type,msg){const f=$('#'+id);f.className='feed '+type;f.innerHTML=msg;f.classList.remove('hidden')}
  function hideFeed(id){$('#'+id)?.classList.add('hidden')}

  const TTS={lang:'en-US',voiceName:'',voices:[],async load(){if(!('speechSynthesis' in window))return;this.voices=speechSynthesis.getVoices(); if(!this.voices.length){await new Promise(r=>{speechSynthesis.onvoiceschanged=()=>{this.voices=speechSynthesis.getVoices();r()}; setTimeout(r,700)})} renderVoices()}, voice(){let v=this.voices||[];return v.find(x=>x.name===this.voiceName)||v.find(x=>(x.lang||'')===this.lang)||v.find(x=>(x.lang||'').startsWith('en'))||null},say(t){if(!('speechSynthesis' in window))return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(String(t||'')); u.lang=this.lang; const v=this.voice(); if(v)u.voice=v; u.rate=.95; speechSynthesis.speak(u)},stop(){try{speechSynthesis.cancel()}catch(e){}}};
  function renderVoices(){const sel=$('#voiceSelect'); sel.innerHTML='<option value="">Auto English voice</option>'; (TTS.voices||[]).filter(v=>(v.lang||'').startsWith('en')).forEach(v=>{const o=document.createElement('option'); o.value=v.name; o.textContent=v.name+' — '+v.lang; sel.appendChild(o)});}
  function setLang(l){TTS.lang=l; $('#usBtn').classList.toggle('on',l==='en-US'); $('#ukBtn').classList.toggle('on',l==='en-GB');}

  // Vocab
  const V={cat:D.VOCAB_CATS[0],open:new Set()};
  function renderVocabCat(){ $('#vocabCat').innerHTML=D.VOCAB_CATS.map(c=>`<option>${esc(c)}</option>`).join(''); $('#vocabCat').value=V.cat;}
  function renderVocab(){const g=$('#vocabGrid'); g.innerHTML=''; D.VOCAB.filter(x=>x.cat===V.cat).forEach(it=>{const key=it.cat+'|'+it.term; const open=V.open.has(key); const c=document.createElement('div'); c.className='card vcard'; c.innerHTML=`<div class="vtop"><div class="term">${esc(it.icon)} ${esc(it.term)}</div><div><button class="smallBtn" data-a="sound">🔊</button> <button class="smallBtn" data-a="reveal">${open?'Hide':'Reveal'}</button></div></div><div class="${open?'':'hidden'}" data-box><p><strong>FR:</strong> ${esc(it.fr)}</p><p><strong>Meaning:</strong> ${esc(it.def)}</p><p><strong>Example:</strong> ${esc(it.ex)}</p></div>`; safeOn(c.querySelector('[data-a=sound]'),'click',()=>TTS.say(it.term+'. '+it.ex)); safeOn(c.querySelector('[data-a=reveal]'),'click',()=>{if(V.open.has(key))V.open.delete(key);else V.open.add(key);renderVocab()}); g.appendChild(c)});}
  function vocabQuiz(){const list=shuffle(D.VOCAB.filter(x=>x.cat===V.cat)).slice(0,5); const q=list.map((it,i)=>{const opts=shuffle([it.fr,'un avion','une gare']); return `<div class="card"><strong>${esc(it.term)}</strong>${opts.map(o=>`<label class="choice"><input type="radio" name="vq${i}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join('')}</div>`}); $('#vocabFeed').className='feed warn'; $('#vocabFeed').innerHTML='<strong>Quick quiz</strong>'+q.join('')+'<button class="btn" id="vCheck">Check quiz</button>'; $('#vocabFeed').classList.remove('hidden'); safeOn($('#vCheck'),'click',()=>{let good=0;list.forEach((it,i)=>{const c=$(`input[name=vq${i}]:checked`); if(c&&c.value===it.fr)good++}); feed('vocabFeed',good>=4?'ok':'warn',`Score: <strong>${good}/${list.length}</strong>`); Score.award('vquiz'+V.cat,good)})}

  function oneByOne(items, hostId, feedId, prefix, pts, renderer){let idx=0, order=[];function cur(){return items.find(x=>x.id===order[idx])} return {start(){order=shuffle(items.map(x=>x.id));idx=0;renderer(cur(),$('#'+hostId));hideFeed(feedId)},next(){if(!order.length)this.start();else{idx=(idx+1)%order.length;renderer(cur(),$('#'+hostId));hideFeed(feedId)}},check(){const item=cur(); if(!item)return; const val=$(`#${hostId} input:checked`)?.value ?? $(`#${hostId} select`)?.value; const ok=String(val)===String(item.a); feed(feedId,ok?'ok':'bad',ok?'Correct!':'Not quite.'); if(ok)Score.award(prefix+item.id,pts)},hint(){const item=cur(); if(item)feed(feedId,'warn','Hint: '+esc(item.h))}}}
  const mcq=oneByOne(D.MCQ,'mcqHost','mcqFeed','mcq',2,(it,h)=>{h.innerHTML=`<strong>${esc(it.p)}</strong>`+it.choices.map((c,i)=>`<label class="choice"><input name="mcqA" type="radio" value="${i}"><span>${esc(c)}</span></label>`).join('')});
  const fill=oneByOne(D.FILL,'fillHost','fillFeed','fill',2,(it,h)=>{h.innerHTML=`<strong>${esc(it.p)}</strong><div class="row"><select class="select">${it.opts.map((o,i)=>`<option value="${i}">${esc(o)}</option>`).join('')}</select></div>`});
  function renderMatch(){const h=$('#matchHost'); h.innerHTML=''; D.MATCH.forEach((it,i)=>{const opts=shuffle([it.right,...it.distr]); h.innerHTML+=`<div class="slotrow"><strong>${esc(it.left)}</strong><select class="select" data-match="${i}"><option value="">Choose</option>${opts.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select></div>`})}
  function checkMatch(){let good=0; D.MATCH.forEach((it,i)=>{const v=$(`[data-match="${i}"]`).value; if(v===it.right)good++}); feed('matchFeed',good>=5?'ok':'warn',`Score: <strong>${good}/${D.MATCH.length}</strong>`); if(good===D.MATCH.length)Score.award('matchAll',10)}

  const Slot={idx:0};
  function renderSlot(){const it=D.SLOT_SENTENCES[Slot.idx]; const host=$('#slotHost'); host.innerHTML=''; it.parts.forEach((part,i)=>{host.innerHTML+=`<div class="slotrow"><span class="badge">Part ${i+1}</span><select class="select" data-slot="${i}">${part.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select></div>`}); $$('[data-slot]').forEach(s=>safeOn(s,'change',updateSlot)); updateSlot(); hideFeed('slotFeed')}
  function updateSlot(){const sentence=$$('[data-slot]').map(s=>s.value).join(' ').replace(/\s+([,.?!])/g,'$1'); $('#slotOut').textContent=sentence}
  function checkSlot(){const it=D.SLOT_SENTENCES[Slot.idx]; const ok=norm($('#slotOut').textContent)===norm(it.target); feed('slotFeed',ok?'ok':'bad',ok?'Correct sentence!':'Not quite. Check word order.'); if(ok)Score.award('slot'+it.id,4)}
  function nextSlot(){Slot.idx=(Slot.idx+1)%D.SLOT_SENTENCES.length; renderSlot()}

  function renderSeqPick(){ $('#seqPick').innerHTML=D.SEQUENCE.map((s,i)=>`<option value="${i}">${esc(s.title)}</option>`).join('')}
  function renderSeq(){const seq=D.SEQUENCE[Number($('#seqPick').value||0)]; $('#seqHost').innerHTML=seq.lines.map((l,i)=>`<div class="seqLine"><select class="select" data-seq="${i}"><option value="">?</option><option>1</option><option>2</option><option>3</option><option>4</option></select><div class="card">${esc(l)}</div></div>`).join(''); hideFeed('seqFeed')}
  function checkSeq(){const seq=D.SEQUENCE[Number($('#seqPick').value||0)]; let good=0; seq.order.forEach((n,i)=>{if($(`[data-seq="${i}"]`).value===String(n))good++}); feed('seqFeed',good===seq.order.length?'ok':'warn',`Score: <strong>${good}/${seq.order.length}</strong>`); if(good===seq.order.length)Score.award('seq'+seq.id,8)}

  // Listening
  function renderListenPick(){ $('#listenPick').innerHTML=D.LISTENING.map((l,i)=>`<option value="${i}">${esc(l.title)}</option>`).join('')}
  function renderListen(show=false){const l=D.LISTENING[Number($('#listenPick').value||0)]; const box=$('#listenDialogue'); box.innerHTML=''; l.lines.forEach((ln,i)=>{box.innerHTML+=`<div class="bubble ${ln.who==='You'?'b':'a'}"><div class="who">${esc(ln.who)}</div><div>${show?esc(ln.say):'<span class="badge">Text hidden</span>'}</div><button class="smallBtn" data-line="${i}">Listen</button></div>`}); $$('[data-line]').forEach(btn=>safeOn(btn,'click',()=>TTS.say(l.lines[Number(btn.dataset.line)].say))); $('#listenQuestions').innerHTML=l.q.map((q,i)=>`<div class="card"><strong>Q${i+1}. ${esc(q[0])}</strong>${[q[1],q[2],q[3]].map((c,ci)=>`<label class="choice"><input type="radio" name="lq${i}" value="${ci}"><span>${esc(c)}</span></label>`).join('')}</div>`).join(''); hideFeed('listenFeed')}
  function playDialogue(){const l=D.LISTENING[Number($('#listenPick').value||0)]; let i=0; const next=()=>{if(i>=l.lines.length)return; TTS.say(l.lines[i].say); i++; setTimeout(next,1900)}; next()}
  function checkListen(){const l=D.LISTENING[Number($('#listenPick').value||0)]; let good=0; l.q.forEach((q,i)=>{const c=$(`input[name=lq${i}]:checked`); if(c&&Number(c.value)===q[4])good++}); feed('listenFeed',good===l.q.length?'ok':'warn',`Score: <strong>${good}/${l.q.length}</strong>`); if(good===l.q.length)Score.award('listen'+l.id,8)}

  // Speaking
  function renderSpeakPick(){ $('#speakPick').innerHTML=D.SPEAKING.map((s,i)=>`<option value="${i}">${esc(s.label)}</option>`).join('')}
  function curSpeak(){return D.SPEAKING[Number($('#speakPick').value||0)]}
  function renderSpeak(){const s=curSpeak(); $('#speakPrompt').textContent=s.prompt; $('#starterBox').innerHTML=s.starters.map(x=>`<div class="row"><button class="smallBtn" data-say="${esc(x)}">🔊</button><span>${esc(x)}</span></div>`).join(''); $$('[data-say]').forEach(b=>safeOn(b,'click',()=>TTS.say(b.dataset.say))); $('#modelBox').classList.add('hidden'); $('#modelBox').innerHTML=`<span class="badge rose">Model A1</span><p>${esc(s.modelA1)}</p><span class="badge teal">Model A2</span><p>${esc(s.modelA2)}</p>`; renderOralBuilder();}
  function renderOralBuilder(){const s=curSpeak(); const options=s.starters; $('#oralBuilder').innerHTML=options.map((o,i)=>`<label class="choice"><input type="checkbox" value="${esc(o)}"><span>${esc(o)}</span></label>`).join(''); $$(`#oralBuilder input`).forEach(i=>safeOn(i,'change',updateOral)); updateOral(); hideFeed('oralFeed')}
  function updateOral(){const txt=$$('#oralBuilder input:checked').map(i=>i.value).join(' '); $('#oralOut').textContent=txt || 'Choose useful phrases above.'}
  function checkOral(){const txt=$('#oralOut').textContent.toLowerCase(); const ok=txt.length>40 && (txt.includes('work')||txt.includes('worked')||txt.includes('appointment')||txt.includes('help')); feed('oralFeed',ok?'ok':'warn',ok?'Good oral structure. Practise it aloud 3 times.':'Choose more phrases and make a complete answer.'); if(ok)Score.award('oral'+$('#speakPick').value,6)}

  // Writing
  function renderWritePick(){ $('#writePick').innerHTML=D.WRITING.map((w,i)=>`<option value="${i}">${esc(w.title)}</option>`).join('')}
  function curWrite(){return D.WRITING[Number($('#writePick').value||0)]}
  function renderWrite(){const w=curWrite(); $('#writePrompt').textContent=w.prompt; $('#writeModel').classList.add('hidden'); $('#writeText').value=''; hideFeed('writeFeed')}
  function showWriteModel(){const w=curWrite(); $('#writeModel').classList.remove('hidden'); $('#writeModel').innerHTML=`<span class="badge rose">Model A1</span>\n${esc(w.modelA1)}\n\n<span class="badge teal">Model A2</span>\n${esc(w.modelA2)}`}
  function checkWrite(){const w=curWrite(); const low=$('#writeText').value.toLowerCase(); let good=0; w.check.forEach(k=>{if(low.includes(k))good++}); feed('writeFeed',good>=Math.ceil(w.check.length*.65)?'ok':'warn',`Self-check: <strong>${good}/${w.check.length}</strong> key ideas included.`); if(good>=Math.ceil(w.check.length*.65))Score.award('write'+w.id,8)}
  function insertAtCursor(area,text){const a=area.selectionStart??area.value.length,b=area.selectionEnd??area.value.length;area.value=area.value.slice(0,a)+text+area.value.slice(b);area.focus();area.setSelectionRange(a+text.length,a+text.length)}

  async function init(){Score.max=100; upd(); await TTS.load(); $('#jsStatus').textContent='JS ✅ loaded';
    safeOn($('#usBtn'),'click',()=>{setLang('en-US'); TTS.say('US accent selected.')}); safeOn($('#ukBtn'),'click',()=>{setLang('en-GB'); TTS.say('UK accent selected.')});
    safeOn($('#voiceSelect'),'change',e=>{TTS.voiceName=e.target.value; TTS.say('Voice selected.')}); safeOn($('#testVoice'),'click',()=>TTS.say('Hello Karine. This is your professional English lesson.')); safeOn($('#stopVoice'),'click',()=>TTS.stop());
    safeOn($('#resetAll'),'click',()=>{if(confirm('Reset the page?')){Score.reset(); renderVocab(); renderMatch(); renderSlot(); renderSeq(); renderListen(false); renderSpeak(); renderWrite();}});
    safeOn($('#startBtn'),'click',()=>$('#vocabSec').scrollIntoView({behavior:'smooth'})); safeOn($('#howBtn'),'click',()=>alert('Use the page step by step. Audio is manual. There is no drag-and-drop; all activities use buttons, dropdowns, checkboxes or numbered choices.'));
    renderVocabCat(); renderVocab(); safeOn($('#vocabCat'),'change',e=>{V.cat=e.target.value; renderVocab(); hideFeed('vocabFeed')}); safeOn($('#revealAll'),'click',()=>{D.VOCAB.filter(x=>x.cat===V.cat).forEach(x=>V.open.add(x.cat+'|'+x.term)); renderVocab()}); safeOn($('#hideAll'),'click',()=>{D.VOCAB.filter(x=>x.cat===V.cat).forEach(x=>V.open.delete(x.cat+'|'+x.term)); renderVocab()}); safeOn($('#vocabQuiz'),'click',vocabQuiz);
    safeOn($('#mcqStart'),'click',()=>mcq.start()); safeOn($('#mcqCheck'),'click',()=>mcq.check()); safeOn($('#mcqHint'),'click',()=>mcq.hint()); safeOn($('#mcqNext'),'click',()=>mcq.next());
    safeOn($('#fillStart'),'click',()=>fill.start()); safeOn($('#fillCheck'),'click',()=>fill.check()); safeOn($('#fillHint'),'click',()=>fill.hint()); safeOn($('#fillNext'),'click',()=>fill.next());
    renderMatch(); safeOn($('#matchCheck'),'click',checkMatch); safeOn($('#matchReset'),'click',()=>{renderMatch(); hideFeed('matchFeed')});
    renderSlot(); safeOn($('#slotNew'),'click',nextSlot); safeOn($('#slotCheck'),'click',checkSlot); safeOn($('#slotHint'),'click',()=>feed('slotFeed','warn','Hint: '+D.SLOT_SENTENCES[Slot.idx].h)); safeOn($('#slotListen'),'click',()=>TTS.say($('#slotOut').textContent));
    renderSeqPick(); renderSeq(); safeOn($('#seqPick'),'change',renderSeq); safeOn($('#seqReset'),'click',renderSeq); safeOn($('#seqHint'),'click',()=>feed('seqFeed','warn','Hint: '+D.SEQUENCE[Number($('#seqPick').value||0)].h)); safeOn($('#seqCheck'),'click',checkSeq);
    renderListenPick(); renderListen(false); safeOn($('#listenPick'),'change',()=>renderListen(false)); safeOn($('#showTranscript'),'click',()=>renderListen(true)); safeOn($('#hideTranscript'),'click',()=>renderListen(false)); safeOn($('#playDialogue'),'click',playDialogue); safeOn($('#listenCheck'),'click',checkListen); safeOn($('#listenHint'),'click',()=>feed('listenFeed','warn','Listen for the main words: appointment, size, time, help.'));
    renderSpeakPick(); renderSpeak(); safeOn($('#speakPick'),'change',renderSpeak); safeOn($('#showModel'),'click',()=>$('#modelBox').classList.remove('hidden')); safeOn($('#hideModel'),'click',()=>$('#modelBox').classList.add('hidden')); safeOn($('#playModel'),'click',()=>TTS.say(curSpeak().modelA2)); safeOn($('#oralListen'),'click',()=>TTS.say($('#oralOut').textContent)); safeOn($('#oralCheck'),'click',checkOral); safeOn($('#oralReset'),'click',renderOralBuilder);
    renderWritePick(); renderWrite(); safeOn($('#writePick'),'change',renderWrite); safeOn($('#showWriteModel'),'click',showWriteModel); safeOn($('#hideWriteModel'),'click',()=>$('#writeModel').classList.add('hidden')); safeOn($('#writeCheck'),'click',checkWrite); safeOn($('#writeListen'),'click',()=>TTS.say($('#writeText').value)); safeOn($('#writeClear'),'click',()=>{$('#writeText').value='';hideFeed('writeFeed')}); $$('[data-insert]').forEach(b=>safeOn(b,'click',()=>insertAtCursor($('#writeText'),b.dataset.insert)));
  }
  function startSafely(){
    Promise.resolve(init()).catch(err=>{
      try{ log('INIT ERROR: '+(err && err.message ? err.message : String(err))); }catch(e){}
      const status=$('#jsStatus');
      if(status) status.textContent='JS ⚠️ reload needed';
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', startSafely, {once:true});
  else startSafely();
})();
