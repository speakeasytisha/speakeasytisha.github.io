/* SpeakEasyTisha — Anniversary & Honeymoon Lesson (A2→B2) */
(() => {
  'use strict';
  try{ window.__SE_AnniversaryLoaded = true; }catch(e){}

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const pad2 = (n)=>String(n).padStart(2,'0');
  const fmtTime = (sec)=>`${pad2(Math.floor(sec/60))}:${pad2(sec%60)}`;
  const shuffle = (arr) => {
    const a = Array.isArray(arr) ? arr.slice() : [];
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  };
  const escapeHtml = (s) => (s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const norm = (s)=> (s||'').trim().replace(/\s+/g,' ').toLowerCase();

  const showErr = (msg) => {
    const box = document.getElementById('errBox');
    if(!box) return;
    box.hidden = false;
    box.textContent = '⚠️ ' + msg;
  };
  window.addEventListener('error', (e) => {
    try{
      const msg = (e && e.message) ? e.message : String(e);
      const where = e && e.filename ? `\n${e.filename}:${e.lineno||''}:${e.colno||''}` : '';
      const st = e && e.error && e.error.stack ? `\n${e.error.stack}` : '';
      showErr(msg + where + st);
    }catch(_){}
  });
  window.addEventListener('unhandledrejection', (e) => {
    try{ showErr((e && e.reason) ? String(e.reason) : 'Unhandled promise rejection'); }catch(_){}
  });

  const safeOn = (id, ev, fn) => {
    const el = document.getElementById(id);
    if(!el){ showErr('Missing element: #' + id); return; }
    el.addEventListener(ev, (evt) => { try{ fn(evt); }catch(err){ showErr(String(err)); } });
  };

  const toast = (msg) => {
    let el = $('#toast');
    if(!el){
      el = document.createElement('div');
      el.id = 'toast';
      el.style.position = 'fixed';
      el.style.left = '16px';
      el.style.bottom = '16px';
      el.style.padding = '10px 12px';
      el.style.background = 'rgba(0,0,0,.72)';
      el.style.border = '1px solid rgba(255,255,255,.14)';
      el.style.borderRadius = '14px';
      el.style.color = 'white';
      el.style.zIndex = '9999';
      el.style.maxWidth = '80vw';
      el.style.boxShadow = '0 14px 30px rgba(0,0,0,.35)';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.display = 'block';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.style.display = 'none'; }, 1700);
  };

  const copyToClipboard = async (txt, okMsg) => {
    try{ await navigator.clipboard.writeText(txt); toast(okMsg || 'Copied.'); }
    catch(e){ toast('Copy blocked. Select and copy manually.'); }
  };

  const state = {
    level:'A2', fr:false, accent:'US', rate:1.0,
    score:{correct:0,total:0},
    timers:{ note:null, sp:null },
    noteTarget:'toHim',
    lastLine:'',
    flash:{ list:[], idx:0, flipped:false }
  };

  // TTS
  let voices=[];
  const loadVoices=()=>{ try{ voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }catch(e){ voices=[]; } };
  const pickVoice=()=>{
    if(!voices || !voices.length) return null;
    const wants = state.accent === 'UK' ? ['en-GB','United Kingdom','UK'] : ['en-US','United States','US'];
    const v = voices.find(x => wants.some(w => (x.lang||'').includes(w) || (x.name||'').includes(w)));
    return v || voices.find(x => (x.lang||'').startsWith('en')) || voices[0];
  };
  const speak=(text)=>{
    if(!('speechSynthesis' in window) || !text) return;
    try{
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = state.rate;
      const v = pickVoice(); if(v) u.voice = v;
      window.speechSynthesis.speak(u);
    }catch(e){}
  };

  // score
  const updateScoreUI=()=>{
    $('#scorePill').textContent = `${state.score.correct} / ${state.score.total}`;
    const acc = state.score.total ? Math.round((state.score.correct/state.score.total)*100) : 0;
    $('#acc').textContent = `${acc}%`;
  };
  const addScore=(ok)=>{ state.score.total += 1; if(ok) state.score.correct += 1; updateScoreUI(); };
  const resetScore=()=>{ state.score.correct=0; state.score.total=0; updateScoreUI(); };

  // timers
  const stopTimer=(t)=>{ if(t) clearInterval(t); return null; };
  const startCountdown=(seconds,onTick,onDone)=>{
    let r=seconds;
    onTick(r);
    const t=setInterval(()=>{
      r -= 1;
      onTick(r);
      if(r<=0){ clearInterval(t); onDone && onDone(); }
    }, 1000);
    return t;
  };

  // content
  const celebrationLines = [
    {en:"Happy anniversary, my love!", fr:"Joyeux anniversaire de mariage, mon amour !"},
    {en:"Thank you for being my best friend.", fr:"Merci d’être mon/ma meilleur(e) ami(e)."},
    {en:"I’m grateful for everything we’ve built together.", fr:"Je suis reconnaissant(e) pour tout ce que nous avons construit ensemble."},
    {en:"Here’s to many more years together.", fr:"À encore beaucoup d’années ensemble."},
    {en:"I still choose you — every day.", fr:"Je te choisis encore — chaque jour."}
  ];

  const vocab = [
    {cat:"Anniversary", icon:"💍", en:"wedding anniversary", fr:"anniversaire de mariage", def:"the date you celebrate your marriage", ex:"Today is our wedding anniversary."},
    {cat:"Anniversary", icon:"🥂", en:"celebrate", fr:"célébrer", def:"to mark a special day", ex:"We’re going to celebrate tonight."},
    {cat:"Anniversary", icon:"💌", en:"a love note", fr:"un mot d’amour", def:"a short romantic message", ex:"I wrote a love note for you."},
    {cat:"Relationship", icon:"❤️", en:"support each other", fr:"se soutenir", def:"help one another", ex:"We always support each other."},
    {cat:"Relationship", icon:"🧡", en:"be grateful", fr:"être reconnaissant(e)", def:"feel thankful", ex:"I’m grateful for you."},
    {cat:"Memories", icon:"📅", en:"the day we met", fr:"le jour où on s’est rencontrés", def:"first meeting day", ex:"I remember the day we met."},
    {cat:"Memories", icon:"📸", en:"a wonderful memory", fr:"un beau souvenir", def:"a positive moment", ex:"One wonderful memory is our first trip."},
    {cat:"Experiences", icon:"🧳", en:"We have travelled", fr:"Nous avons voyagé", def:"present perfect experience", ex:"We have travelled together."},
    {cat:"Experiences", icon:"💪", en:"We have overcome", fr:"Nous avons surmonté", def:"get through difficulties", ex:"We have overcome challenges."},
    {cat:"Today", icon:"💞", en:"still in love", fr:"toujours amoureux(se)", def:"still loving", ex:"We are still in love."},
    {cat:"Future", icon:"🌅", en:"a romantic getaway", fr:"une escapade romantique", def:"short romantic trip", ex:"We booked a romantic getaway."},
    {cat:"Honeymoon", icon:"🕯️", en:"a candlelit dinner", fr:"un dîner aux chandelles", def:"romantic dinner", ex:"We’d like a candlelit dinner."},
    {cat:"Honeymoon", icon:"🌸", en:"a bouquet of flowers", fr:"un bouquet de fleurs", def:"flowers as decoration", ex:"Could you arrange a bouquet of flowers?"},
    {cat:"Honeymoon", icon:"🕒", en:"late check-out", fr:"départ tardif", def:"leave later than usual", ex:"Is late check-out possible?"},
  ];

  const tenseMap = {
    A2:`TENSE MAP (A2+)\n\nPAST SIMPLE: We met in…\nPAST CONTINUOUS: I was… when…\nPRESENT PERFECT: We have…\nPRESENT SIMPLE: Today, I love…\nFUTURE: We’re going to…`,
    B1:`TENSE MAP (B1)\n\nPast simple = key events\nPast continuous = background\nPresent perfect = experiences\nPresent simple = today\nFuture = plans + promises`,
    B2:`TENSE MAP (B2)\n\nAdd development (reason + example).\nAdd contrast: however / compared to.\nAdd promise: I will always…`
  };

  const markers = [
    {k:"Past simple", en:"in 2010 • last year • yesterday", fr:"en 2010 • l’année dernière • hier"},
    {k:"Past continuous", en:"while • when • at that moment", fr:"pendant que • quand • à ce moment-là"},
    {k:"Present perfect", en:"already • never • up to now", fr:"déjà • jamais • jusqu’à maintenant"},
    {k:"Future", en:"tomorrow • next year • soon", fr:"demain • l’an prochain • bientôt"},
  ];

  const exampleChips = [
    {en:"We met when I was …", fr:"Nous nous sommes rencontrés quand j’avais …"},
    {en:"I was … when I first saw you.", fr:"J’étais … quand je t’ai vu(e) pour la première fois."},
    {en:"We have travelled to … together.", fr:"Nous avons voyagé à … ensemble."},
    {en:"Today, I’m grateful for …", fr:"Aujourd’hui, je suis reconnaissant(e) pour …"},
    {en:"We’re going to celebrate by …", fr:"Nous allons célébrer en …"},
  ];

  const tenseMCQBank = [
    {q:"Choose the best tense: 'We ___ in a small café.'", options:["meet","met","have met"], a:1, why:"Past simple."},
    {q:"Choose the best tense: 'We ___ together for many years.'", options:["lived","live","have lived"], a:2, why:"Present perfect."},
    {q:"Choose the best tense: 'I ___ dinner when you arrived.'", options:["cooked","was cooking","have cooked"], a:1, why:"Past continuous."},
  ];

  const fixBank = [
    {bad:"We have meet in 2005.", good:"We met in 2005."},
    {bad:"I cooking when you called me.", good:"I was cooking when you called me."},
    {bad:"We are married since 20 years.", good:"We have been married for 20 years."},
  ];
  let fixIdx=0;

  const gapTemplates = [
    { text:"I’m ______ for you. ______, we have ______ many happy memories.",
      gaps:[
        {opts:["grateful","gratefully","gratitude"], a:0},
        {opts:["Overall","Yesterday","Soon"], a:0},
        {opts:["shared","share","sharing"], a:0},
      ]
    },
    { text:"We ______ (meet) in [place]. Since then, we ______ (travel) together.",
      gaps:[
        {opts:["meet","met","have met"], a:1},
        {opts:["travel","travelled","have travelled"], a:2},
      ]
    }
  ];
  let gapIdx=0;

  const noteBlocks = {
    opening:[{en:"Dear [Name],", fr:"Cher/Chère [Prénom],"}, {en:"My love,", fr:"Mon amour,"}, {en:"To my favourite person,", fr:"À ma personne préférée,"}],
    past:[{en:"I still remember the day we met.", fr:"Je me souviens encore du jour où on s’est rencontrés."}, {en:"We met in [place] and I felt [emotion].", fr:"On s’est rencontrés à [lieu] et j’ai ressenti [émotion]."}],
    experiences:[{en:"We have built a beautiful life together.", fr:"Nous avons construit une belle vie ensemble."}, {en:"We have shared so many memories.", fr:"Nous avons partagé tellement de souvenirs."}],
    today:[{en:"Today, I’m grateful for your love and support.", fr:"Aujourd’hui, je suis reconnaissant(e) pour ton amour et ton soutien."}, {en:"I love our life today.", fr:"J’aime notre vie aujourd’hui."}],
    future:[{en:"We’re going to celebrate tonight.", fr:"Nous allons célébrer ce soir."}, {en:"I hope we will travel again soon.", fr:"J’espère que nous voyagerons bientôt."}, {en:"I will always choose you.", fr:"Je te choisirai toujours."}],
    closing:[{en:"With all my love,", fr:"Avec tout mon amour,"}, {en:"Happy anniversary!", fr:"Joyeux anniversaire !"}]
  };

  const blockTypeLabels = [
    {id:"opening", en:"Opening", fr:"Ouverture"},
    {id:"past", en:"Past (we met)", fr:"Passé (rencontre)"},
    {id:"experiences", en:"Experiences (we have…)", fr:"Expériences (nous avons…)"},
    {id:"today", en:"Today (now)", fr:"Aujourd’hui"},
    {id:"future", en:"Future (plans)", fr:"Futur (projets)"},
    {id:"closing", en:"Closing", fr:"Conclusion"},
  ];

  const noteModels = {
    toHim:{
      A2:"Dear [Name],\n\nHappy anniversary! I still remember the day we met.\nWe have built a beautiful life together. Today, I’m grateful for you.\nTonight, we’re going to celebrate.\n\nWith all my love,\n[Your name]",
      B1:"Dear [Name],\n\nHappy anniversary, my love! I still remember the day we met.\nSince then, we have shared many memories. Today, I’m grateful for your support.\nWe’re going to celebrate tonight.\n\nWith all my love,\n[Your name]",
      B2:"Dear [Name],\n\nHappy anniversary, my love. I still remember the day we met.\nOver the years, we have built a beautiful life together. Today, I’m grateful for your love and the way you support me.\nTonight, we’re going to celebrate, and I hope we will create many more memories.\n\nWith all my love,\n[Your name]"
    },
    toHer:{
      A2:"Dear [Name],\n\nHappy anniversary! I still remember the day we met.\nWe have built a beautiful life together. Today, I’m grateful for you.\nTonight, we’re going to celebrate.\n\nLove,\n[Your name]",
      B1:"Dear [Name],\n\nHappy anniversary, my love! I still remember the day we met.\nSince then, we have shared many memories. Today, I’m grateful for your kindness.\nWe’re going to celebrate tonight.\n\nWith all my love,\n[Your name]",
      B2:"Dear [Name],\n\nHappy anniversary, my love. I still remember the day we met.\nOver the years, we have built a life full of memories. Today, I’m grateful for your love and your energy.\nTonight, we’re going to celebrate, and I hope we will continue to grow together.\n\nWith all my love,\n[Your name]"
    }
  };

  const noteChecklist = [
    "✅ Past (we met…)",
    "✅ Present perfect (we have…)",
    "✅ Today (I’m grateful…)",
    "✅ Future (we’re going to… / I hope we will…)",
    "✅ Short sentences: 1 idea = 1 sentence"
  ];

  const destStyles = [{id:"sea",en:"Sea & sunset",fr:"Mer & coucher de soleil"},{id:"city",en:"City & culture",fr:"Ville & culture"},{id:"nature",en:"Nature & calm",fr:"Nature & calme"}];
  const moods = [{id:"cozy",en:"Cozy and calm",fr:"Cocooning et calme"},{id:"lux",en:"Simple luxury",fr:"Petit luxe"},{id:"adventure",en:"Little adventure",fr:"Petite aventure"}];
  const seqConnectors = [{en:"First,",fr:"D’abord,"},{en:"Then,",fr:"Ensuite,"},{en:"After that,",fr:"Après ça,"},{en:"In the evening,",fr:"Le soir,"},{en:"Finally,",fr:"Enfin,"},{en:"Overall,",fr:"Globalement,"}];

  const hotelReqs = [{id:"surprise",en:"Anniversary surprise",fr:"Surprise anniversaire"},{id:"late",en:"Late check‑out",fr:"Départ tardif"},{id:"dinner",en:"Romantic dinner",fr:"Dîner romantique"}];
  const hotelLines = {
    surprise:[{en:"Could you help us with a small surprise?",fr:"Pouvez-vous nous aider pour une petite surprise ?"},
              {en:"A bouquet of flowers would be perfect.",fr:"Un bouquet de fleurs serait parfait."},
              {en:"Thank you in advance for your help.",fr:"Merci d’avance pour votre aide."}],
    late:[{en:"Would late check-out be possible?",fr:"Un départ tardif est-il possible ?"},
          {en:"Please let us know the fee, if any.",fr:"Merci de nous indiquer le supplément, si besoin."},
          {en:"Could you store our luggage after check-out?",fr:"Pouvez-vous garder nos bagages après le départ ?"}],
    dinner:[{en:"Could we book a candlelit dinner?",fr:"Pouvons-nous réserver un dîner aux chandelles ?"},
            {en:"Please confirm the time and price.",fr:"Merci de confirmer l’heure et le prix."},
            {en:"We have dietary requirements: [details].",fr:"Nous avons des contraintes alimentaires : [détails]."}]
  };

  const hotelModels = {
    surprise:{
      A2:"Subject: Small anniversary surprise\n\nDear Hotel Team,\n\nWe are celebrating our anniversary. Could you help us with a small surprise (flowers)?\n\nThank you in advance.\n\nKind regards,\n[Name]",
      B1:"Subject: Anniversary surprise request\n\nDear Hotel Team,\n\nWe are celebrating our anniversary during our stay. Would it be possible to arrange flowers in the room?\n\nThank you in advance.\n\nKind regards,\n[Name]",
      B2:"Subject: Anniversary surprise request (reference [ref])\n\nDear Hotel Team,\n\nWe are celebrating our anniversary and would like to arrange a small surprise (flowers). Please confirm options and prices.\n\nKind regards,\n[Name]"
    },
    late:{
      A2:"Subject: Late check-out request\n\nDear Hotel Team,\n\nWould late check-out be possible? Please tell us the fee, if any.\n\nKind regards,\n[Name]",
      B1:"Subject: Late check-out request\n\nDear Hotel Team,\n\nCould we check out later (around [time])? Please confirm the fee.\n\nKind regards,\n[Name]",
      B2:"Subject: Late check-out request (reference [ref])\n\nDear Hotel Team,\n\nCould you confirm whether late check-out is possible until [time] and the additional fee, if any?\n\nKind regards,\n[Name]"
    },
    dinner:{
      A2:"Subject: Romantic dinner request\n\nDear Hotel Team,\n\nWe are celebrating our anniversary. Could we book a candlelit dinner on [date]?\n\nThank you.\n\nKind regards,\n[Name]",
      B1:"Subject: Romantic dinner booking — anniversary\n\nDear Hotel Team,\n\nCould we book a candlelit dinner on [date] at [time]? Please confirm the price.\n\nKind regards,\n[Name]",
      B2:"Subject: Anniversary dinner booking (reference [ref])\n\nDear Hotel Team,\n\nWould it be possible to reserve a candlelit dinner on [date] at [time]? Please confirm availability and the total price.\n\nKind regards,\n[Name]"
    }
  };

  const speakingPrompts = [{
    id:"story",
    title:"Tell your love story (past → now → future)",
    prompt:"Tell the story of your relationship: when you met, one memory, what you love today, and one plan for the future.",
    builder:[["Past","We met…"],["Scene","I was… when…"],["Experiences","We have…"],["Today","Today, I love/appreciate…"],["Future","We’re going to… / I hope we will…"]],
    models:{
      A2:"We met in [place]. We have shared many memories. Today, I’m grateful for you. Next weekend, we’re going to celebrate.",
      B1:"We met in [place], and I still remember that day. Since then, we have shared many memories. Today, I’m grateful for your support. We’re going to celebrate our anniversary.",
      B2:"We met in [place], and I still remember that day clearly. Over the years, we have built a beautiful life together. Today, I’m grateful for your love and support. We’re going to celebrate, and I hope we will create many more memories."
    }
  }];

  const roleplays = [
    {id:"rp_anniversary", title:"Anniversary toast", you:"Happy anniversary! I’m grateful for you and for our life together.", teacher:"That’s beautiful. What is one memory you really love?"},
    {id:"rp_hotel", title:"Hotel request", you:"Hello, we are celebrating our anniversary. Could you arrange a small surprise in the room?", teacher:"Of course. Would you like flowers, champagne, or both?"},
    {id:"rp_restaurant", title:"Restaurant booking", you:"Hello, I’d like to book a table for two for our anniversary, please.", teacher:"Certainly. What time would you like, and do you have any dietary requirements?"},
  ];

  const fluencyChips = [
    {en:"Let me think…", fr:"Laissez‑moi réfléchir…"},
    {en:"For example,…", fr:"Par exemple,…"},
    {en:"Overall,…", fr:"Globalement,…"},
    {en:"To be honest,…", fr:"Honnêtement,…"},
  ];

  // rendering toggles
  const setFR = (on) => {
    state.fr = !!on;
    $('#frToggle').setAttribute('aria-pressed', state.fr ? 'true' : 'false');
    $('#frToggle').textContent = state.fr ? 'On' : 'Off';
    $$('.frOnly').forEach(el => el.style.display = state.fr ? 'block' : 'none');
    renderCelebrationChips(); renderVocab(); renderMarkers(); renderExampleChips();
    renderBlockTypeOptions(); renderBlockChips(); renderNoteChecklist();
    renderSeqChips(); renderHotelChips(); renderFluencyChips();
  };
  const setLevel = (lvl) => {
    state.level = lvl;
    $$('.segBtn[data-level]').forEach(b => b.classList.toggle('isOn', b.dataset.level === lvl));
    renderTenseMap(); renderHotelModel(); renderSpeakingPrompt();
  };
  const setAccent = (acc) => {
    state.accent = acc;
    $$('.segBtn[data-accent]').forEach(b => b.classList.toggle('isOn', b.dataset.accent === acc));
  };
  const setNoteTarget = (target) => {
    state.noteTarget = target;
    $$('.segBtn[data-note]').forEach(b => b.classList.toggle('isOn', b.dataset.note === target));
    $('#modelOut').textContent = '';
  };

  // celebration
  const renderCelebrationChips = () => {
    const host = $('#celebrationChips'); host.innerHTML = '';
    celebrationLines.forEach(c => {
      const b = document.createElement('button');
      b.type='button'; b.className='chip';
      b.innerHTML = `${escapeHtml(c.en)}${state.fr ? `<span class="sub">${escapeHtml(c.fr)}</span>` : ''}`;
      b.addEventListener('click', () => {
        state.lastLine = c.en;
        const box = $('#noteBox');
        box.value = (box.value ? (box.value + "\n") : '') + c.en;
        updateNoteWords();
        speak(c.en);
      });
      host.appendChild(b);
    });
  };

  // vocab
  const cats = (() => ['All'].concat(Array.from(new Set(vocab.map(v => v.cat))).sort()))();
  const fillVocabCats = () => {
    const sel = $('#vCat'); sel.innerHTML = '';
    cats.forEach(c => { const o=document.createElement('option'); o.value=c; o.textContent=c; sel.appendChild(o); });
    sel.value='All';
  };
  const getVocabFiltered = () => {
    const cat = $('#vCat').value;
    const q = ($('#vSearch').value||'').trim().toLowerCase();
    return vocab.filter(v => (cat==='All'||v.cat===cat) && (!q || v.en.toLowerCase().includes(q) || (v.fr||'').toLowerCase().includes(q)));
  };
  const renderVocab = () => {
    const list = getVocabFiltered();
    const host = $('#vChips'); host.innerHTML='';
    list.forEach(item=>{
      const b=document.createElement('button');
      b.type='button'; b.className='chip';
      b.innerHTML = `${escapeHtml(item.icon + " " + item.en)}${state.fr ? `<span class="sub">${escapeHtml(item.fr)}</span>` : ''}`;
      b.addEventListener('click', ()=>speak(item.en));
      host.appendChild(b);
    });
    $('#vList').innerHTML = list.map(it => `
      <div class="panel" style="margin-bottom:10px;">
        <div class="miniTitle">${escapeHtml(it.cat)}</div>
        <div style="font-weight:950;">${escapeHtml(it.icon)} ${escapeHtml(it.en)} ${state.fr ? `<span class="muted">— ${escapeHtml(it.fr)}</span>` : ''}</div>
        <div class="tiny muted" style="margin-top:6px; line-height:1.5;"><strong>Definition:</strong> ${escapeHtml(it.def)}</div>
        <div class="tiny muted" style="margin-top:6px; line-height:1.5;"><strong>Example:</strong> ${escapeHtml(it.ex)}</div>
      </div>`).join('') || `<div class="tiny muted">No items found.</div>`;
  };
  const shuffleVocab = () => { const s=shuffle(vocab); vocab.length=0; s.forEach(x=>vocab.push(x)); renderVocab(); };

  // flashcards
  const flashOpen = () => {
    const list=getVocabFiltered();
    state.flash.list = list.length ? list : vocab.slice();
    state.flash.idx=0; state.flash.flipped=false;
    $('#flashModal').hidden=false;
    renderFlashCard();
  };
  const flashClose = () => { const m=$('#flashModal'); if(m) m.hidden=true; };
  const renderFlashCard = () => {
    const list=state.flash.list||[];
    const item=list[state.flash.idx]||list[0];
    if(!item){ $('#flashCard').textContent='No cards.'; return; }
    const front=`${item.icon} ${item.en}`;
    const back=`${item.fr ? item.fr + "\n\n" : ""}${item.ex}`;
    $('#flashCard').textContent = state.flash.flipped ? back : front;
  };
  const flashFlip = () => { state.flash.flipped=!state.flash.flipped; renderFlashCard(); const item=(state.flash.list||[])[state.flash.idx]; if(item) speak(item.en); };
  const flashNext = () => { const list=state.flash.list||[]; if(!list.length) return; state.flash.idx=(state.flash.idx+1)%list.length; state.flash.flipped=false; renderFlashCard(); };
  const flashPrev = () => { const list=state.flash.list||[]; if(!list.length) return; state.flash.idx=(state.flash.idx-1+list.length)%list.length; state.flash.flipped=false; renderFlashCard(); };

  // tense map + markers
  const renderTenseMap = () => { $('#tenseMap').textContent = tenseMap[state.level] || tenseMap.A2; };
  const renderMarkers = () => {
    $('#timeMarkers').innerHTML = markers.map(m => `
      <div class="panel" style="margin-bottom:10px;">
        <div class="miniTitle">${escapeHtml(m.k)}</div>
        <div class="tiny muted">${escapeHtml(m.en)}${state.fr ? `\n${escapeHtml(m.fr)}` : ''}</div>
      </div>`).join('');
  };

  // examples
  const renderExampleChips = () => {
    const host=$('#exampleChips'); host.innerHTML='';
    exampleChips.forEach(c=>{
      const b=document.createElement('button');
      b.type='button'; b.className='chip';
      b.innerHTML = `${escapeHtml(c.en)}${state.fr ? `<span class="sub">${escapeHtml(c.fr)}</span>` : ''}`;
      b.addEventListener('click', ()=>{
        const ta=$('#exampleBox');
        ta.value = (ta.value ? (ta.value + "\n") : '') + c.en;
        speak(c.en.replace('…',''));
      });
      host.appendChild(b);
    });
  };

  // MCQ
  const renderMCQ = (host, qObj) => {
    host.innerHTML='';
    const q=document.createElement('div');
    q.className='prompt';
    q.innerHTML = `<div class="miniTitle">Question</div><div class="promptText">${escapeHtml(qObj.q)}</div>`;
    host.appendChild(q);
    const opts=document.createElement('div');
    opts.className='chips mt10';
    qObj.options.forEach((opt,i)=>{
      const b=document.createElement('button');
      b.type='button'; b.className='chip'; b.textContent=opt;
      b.addEventListener('click', ()=>{
        const ok=i===qObj.a;
        addScore(ok);
        $$('.chip', opts).forEach(x=>x.disabled=true);
        b.style.background = ok ? 'rgba(80,255,140,.18)' : 'rgba(255,100,120,.18)';
        const why=document.createElement('div');
        why.className='tiny muted mt10';
        why.textContent = (ok?'✅ Correct. ':'❌ Not quite. ') + (qObj.why||'');
        host.appendChild(why);
        speak(opt);
      });
      opts.appendChild(b);
    });
    host.appendChild(opts);
  };
  const newTenseMCQ = () => renderMCQ($('#tenseMCQ'), shuffle(tenseMCQBank)[0]);

  // fix sentence
  const loadFix = (idx=null) => {
    if(idx===null) fixIdx=(fixIdx+1)%fixBank.length; else fixIdx=idx%fixBank.length;
    const item=fixBank[fixIdx];
    $('#fixPrompt').textContent = "Fix this: " + item.bad;
    $('#fixInput').value='';
    $('#fixFeedback').textContent='';
  };
  const fixCheck = () => {
    const item=fixBank[fixIdx];
    const ans=norm($('#fixInput').value);
    const good=norm(item.good);
    const ok = ans && ans===good;
    addScore(ok);
    $('#fixFeedback').textContent = ok ? "✅ Great! That’s correct." : ("❌ Not exactly.\nModel: " + item.good);
  };
  const fixShow = () => { $('#fixFeedback').textContent = "Model: " + fixBank[fixIdx].good; };

  // gaps
  const renderGap = () => {
    const tpl=gapTemplates[gapIdx];
    const parts=tpl.text.split('______');
    const preview = parts.reduce((acc,chunk,i)=>{
      if(i===parts.length-1) return acc+escapeHtml(chunk);
      return acc+escapeHtml(chunk)+`<span class="pill mono" style="padding:4px 8px;">[gap ${i+1}]</span>`;
    }, '');
    const selects = tpl.gaps.map((g,i)=>{
      const options=g.opts.map((o,idx)=>`<option value="${idx}">${escapeHtml(o)}</option>`).join('');
      return `<div class="tiny muted" style="margin-top:8px;"><strong>Gap ${i+1}</strong></div><select class="select" data-gap="${i}">${options}</select>`;
    }).join('');
    $('#gapBox').innerHTML = `<div class="prompt"><div class="miniTitle">Text</div><div class="promptText">${preview}</div></div><div class="mt10">${selects}</div>`;
    $('#gapFeedback').textContent='';
  };
  const gapCheck = () => {
    const tpl=gapTemplates[gapIdx];
    const sels=$$('select[data-gap]', $('#gapBox'));
    let okAll=true;
    sels.forEach(sel=>{
      const i=parseInt(sel.dataset.gap,10);
      const expected=tpl.gaps[i].a;
      const chosen=parseInt(sel.value,10);
      const ok=chosen===expected;
      okAll = okAll && ok;
      addScore(ok);
      sel.style.borderColor = ok ? 'rgba(80,255,140,.55)' : 'rgba(255,100,120,.55)';
    });
    $('#gapFeedback').textContent = okAll ? "✅ Great! All correct." : "Some answers are not correct.";
  };
  const gapShow = () => {
    const tpl=gapTemplates[gapIdx];
    const answers=tpl.gaps.map(g=>g.opts[g.a]);
    $('#gapFeedback').textContent = "Answers: " + answers.join(' / ');
  };
  const gapNew = () => { gapIdx=(gapIdx+1)%gapTemplates.length; renderGap(); };

  // note builder
  const renderBlockTypeOptions = () => {
    const sel=$('#blockType'); sel.innerHTML='';
    blockTypeLabels.forEach(x=>{
      const o=document.createElement('option');
      o.value=x.id; o.textContent = state.fr ? `${x.en} / ${x.fr}` : x.en;
      sel.appendChild(o);
    });
    sel.value='opening';
  };
  const currentBlockType = () => $('#blockType').value;
  const renderBlockChips = () => {
    const host=$('#blockChips'); host.innerHTML='';
    const key=currentBlockType();
    const list=noteBlocks[key]||[];
    list.forEach(item=>{
      const b=document.createElement('button');
      b.type='button'; b.className='chip';
      b.innerHTML = `${escapeHtml(item.en)}${state.fr ? `<span class="sub">${escapeHtml(item.fr)}</span>` : ''}`;
      b.addEventListener('click', ()=>{
        state.lastLine=item.en;
        const ta=$('#noteBox');
        ta.value = (ta.value ? (ta.value + "\n") : '') + item.en;
        updateNoteWords();
        speak(item.en.replace('[Name]',''));
      });
      host.appendChild(b);
    });
  };
  const renderNoteChecklist = () => { $('#noteChecklist').innerHTML = `<ul class="bullets">${noteChecklist.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`; };
  const updateNoteWords = () => {
    const txt=($('#noteBox').value||'').trim();
    const words=txt?txt.split(/\s+/).filter(Boolean).length:0;
    $('#noteWords').textContent=String(words);
  };
  const noteClear = () => { $('#noteBox').value=''; updateNoteWords(); };
  const noteRead = () => speak($('#noteBox').value||'');
  const showNoteModel = () => {
    const t = noteModels[state.noteTarget][state.level] || '';
    const box=$('#noteBox');
    box.value = (box.value.trim() ? (box.value.trim() + "\n\n---\nMODEL ("+state.level+")\n" + t) : t);
    updateNoteWords();
  };

  // note timer
  const noteStart = () => {
    state.timers.note = stopTimer(state.timers.note);
    state.timers.note = startCountdown(8*60, (r)=>{ $('#noteTimer').textContent=fmtTime(r); },
      ()=>{ $('#noteTimer').textContent='00:00'; toast('Time! Quick proofread.'); });
  };
  const noteStop = () => { state.timers.note=stopTimer(state.timers.note); $('#noteTimer').textContent='00:00'; };

  // honeymoon
  const fillSelect = (id, items) => {
    const sel=document.getElementById(id);
    sel.innerHTML='';
    items.forEach(it=>{
      const o=document.createElement('option');
      o.value=it.id;
      o.textContent = state.fr ? `${it.en} / ${it.fr}` : it.en;
      sel.appendChild(o);
    });
    sel.value=items[0].id;
  };
  const renderSeqChips = () => {
    const host=$('#seqChips'); host.innerHTML='';
    seqConnectors.forEach(c=>{
      const b=document.createElement('button');
      b.type='button'; b.className='chip';
      b.innerHTML = `${escapeHtml(c.en)}${state.fr ? `<span class="sub">${escapeHtml(c.fr)}</span>` : ''}`;
      b.addEventListener('click', ()=>{
        const ta=$('#itineraryBox');
        ta.value = (ta.value ? (ta.value + " ") : '') + c.en + " ";
        speak(c.en.replace(',',''));
      });
      host.appendChild(b);
    });
  };
  const itineraryModel = () => {
    const lines = [
      "First, we will go for a walk.",
      "Then, we will visit a nice place.",
      "In the evening, we will have a candlelit dinner.",
      "Finally, we will relax together.",
      "Overall, it will be a romantic getaway."
    ];
    $('#itineraryModelOut').textContent = lines.join("\n");
  };
  const itineraryClear = () => { $('#itineraryBox').value=''; $('#itineraryModelOut').textContent=''; };
  const itinerarySay = () => speak((($('#itineraryBox').value||'') + "\n" + ($('#itineraryModelOut').textContent||'')).trim());

  // hotel
  const renderHotelChips = () => {
    const host=$('#hotelChips'); host.innerHTML='';
    const key=$('#hotelReq').value;
    const list=hotelLines[key]||[];
    list.forEach(x=>{
      const b=document.createElement('button');
      b.type='button'; b.className='chip';
      b.innerHTML = `${escapeHtml(x.en)}${state.fr ? `<span class="sub">${escapeHtml(x.fr)}</span>` : ''}`;
      b.addEventListener('click', ()=>{
        const ta=$('#hotelBox');
        ta.value = (ta.value ? (ta.value + "\n") : '') + x.en;
        speak(x.en.replace('[details]',''));
      });
      host.appendChild(b);
    });
  };
  const renderHotelModel = () => {
    const key=$('#hotelReq').value;
    const txt=(hotelModels[key] && hotelModels[key][state.level]) ? hotelModels[key][state.level] : '';
    $('#hotelModelOut').textContent = txt || '—';
  };
  const hotelClear = () => { $('#hotelBox').value=''; };
  const hotelSay = () => speak((($('#hotelBox').value||'') + "\n" + ($('#hotelModelOut').textContent||'')).trim());

  // speaking
  const fillSpeakingPrompts = () => {
    const sel=$('#spPrompt'); sel.innerHTML='';
    speakingPrompts.forEach(p=>{ const o=document.createElement('option'); o.value=p.id; o.textContent=p.title; sel.appendChild(o); });
    sel.value=speakingPrompts[0].id;
  };
  const currentSp = () => speakingPrompts.find(p=>p.id===$('#spPrompt').value) || speakingPrompts[0];
  const renderSpeakingPrompt = () => {
    const p=currentSp();
    $('#spPromptText').textContent=p.prompt;
    const host=$('#spBuilder'); host.innerHTML='';
    (p.builder||[]).forEach(row=>{
      const div=document.createElement('div');
      div.className='builderRow';
      div.innerHTML = `<div class="bLbl">${escapeHtml(row[0])}</div><div class="bBox">${escapeHtml(row[1])}</div>`;
      host.appendChild(div);
    });
    $('#spModelOut').textContent = (p.models && p.models[state.level]) ? p.models[state.level] : '';
  };
  const spListen = () => speak(currentSp().prompt);
  const spShowModel = () => { $('#spModelOut').textContent = currentSp().models[state.level] || ''; };
  const spSayModel = () => speak($('#spModelOut').textContent || '');

  const spStart = () => {
    state.timers.sp = stopTimer(state.timers.sp);
    state.timers.sp = startCountdown(60, (r)=>{ $('#spTimer').textContent=fmtTime(r); },
      ()=>{ $('#spTimer').textContent='00:00'; toast('Time!'); });
  };
  const spStop = () => { state.timers.sp = stopTimer(state.timers.sp); $('#spTimer').textContent='00:00'; };

  // roleplays
  const fillRoleplays = () => {
    const sel=$('#rpScenario'); sel.innerHTML='';
    roleplays.forEach(r=>{ const o=document.createElement('option'); o.value=r.id; o.textContent=r.title; sel.appendChild(o); });
    sel.value=roleplays[0].id;
  };
  const currentRp = () => roleplays.find(r=>r.id===$('#rpScenario').value) || roleplays[0];
  const renderRoleplay = () => { const r=currentRp(); $('#rpYou').textContent=r.you; $('#rpTeacher').textContent=r.teacher; };

  const renderFluencyChips = () => {
    const host=$('#fluencyChips'); host.innerHTML='';
    fluencyChips.forEach(c=>{
      const b=document.createElement('button');
      b.type='button'; b.className='chip';
      b.innerHTML = `${escapeHtml(c.en)}${state.fr ? `<span class="sub">${escapeHtml(c.fr)}</span>` : ''}`;
      b.addEventListener('click', ()=>speak(c.en.replace('…','')));
      host.appendChild(b);
    });
  };

  // New set / reset
  const resetAll = () => {
    state.timers.note = stopTimer(state.timers.note);
    state.timers.sp = stopTimer(state.timers.sp);
    $('#noteTimer').textContent='00:00';
    $('#spTimer').textContent='00:00';
    $('#exampleBox').value='';
    $('#noteBox').value='';
    $('#modelOut').textContent='';
    $('#itineraryBox').value='';
    $('#itineraryModelOut').textContent='';
    $('#hotelBox').value='';
    $('#hotelModelOut').textContent='';
    $('#fixInput').value='';
    $('#fixFeedback').textContent='';
    $('#gapFeedback').textContent='';
    updateNoteWords();
    toast('Reset done.');
  };

  const newSet = () => {
    newTenseMCQ();
    loadFix(null);
    gapNew();
    shuffleVocab();
    toast('✨ New set ready.');
  };

  // init
  const init = () => {
    const ok=$('#jsOk'); if(ok) ok.textContent='JS: ready ✅';
    loadVoices();
    if('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;
    updateScoreUI();

    fillVocabCats();
    renderCelebrationChips();
    renderVocab();
    renderTenseMap();
    renderMarkers();
    renderExampleChips();

    renderBlockTypeOptions();
    renderBlockChips();
    renderNoteChecklist();

    fillSelect('destStyle', destStyles);
    fillSelect('mood', moods);
    renderSeqChips();
    itineraryModel();

    fillSelect('hotelReq', hotelReqs);
    renderHotelChips();
    renderHotelModel();

    fillSpeakingPrompts();
    renderSpeakingPrompt();

    fillRoleplays();
    renderRoleplay();

    renderFluencyChips();

    newTenseMCQ();
    loadFix(0);
    renderGap();

    // controls
    $$('.segBtn[data-level]').forEach(b => b.addEventListener('click', ()=>setLevel(b.dataset.level)));
    $$('.segBtn[data-accent]').forEach(b => b.addEventListener('click', ()=>setAccent(b.dataset.accent)));
    $$('.segBtn[data-note]').forEach(b => b.addEventListener('click', ()=>setNoteTarget(b.dataset.note)));

    safeOn('frToggle','click', ()=>setFR(!state.fr));
    safeOn('rate','input', (e)=>{ state.rate=parseFloat(e.target.value); });

    safeOn('printBtn','click', ()=>window.print());
    safeOn('newSetBtn','click', newSet);
    safeOn('resetAllBtn','click', resetAll);
    safeOn('resetScore','click', resetScore);

    // vocab controls
    safeOn('vCat','change', renderVocab);
    safeOn('vSearch','input', renderVocab);
    safeOn('vShuffle','click', shuffleVocab);
    safeOn('vFlash','click', flashOpen);

    safeOn('flashClose','click', flashClose);
    safeOn('flashFlip','click', flashFlip);
    safeOn('flashNext','click', flashNext);
    safeOn('flashPrev','click', flashPrev);
    safeOn('flashCard','click', flashFlip);

    // click outside modal + ESC closes
    try{
      const modal=document.getElementById('flashModal');
      if(modal) modal.addEventListener('click', (ev)=>{ if(ev.target===modal) flashClose(); });
      document.addEventListener('keydown', (ev)=>{ if(ev.key==='Escape'){ const m=document.getElementById('flashModal'); if(m && !m.hidden) flashClose(); } });
    }catch(e){}

    safeOn('copyTenseMap','click', ()=>copyToClipboard($('#tenseMap').textContent||'', '✅ Rules copied.'));
    safeOn('sayTenseMap','click', ()=>speak($('#tenseMap').textContent||''));

    safeOn('exampleClear','click', ()=>{ $('#exampleBox').value=''; });
    safeOn('exampleSay','click', ()=>speak($('#exampleBox').value||''));

    safeOn('newTenseMCQ','click', newTenseMCQ);
    safeOn('fixCheck','click', fixCheck);
    safeOn('fixShow','click', fixShow);
    safeOn('fixNew','click', ()=>loadFix(null));

    safeOn('gapCheck','click', gapCheck);
    safeOn('gapShow','click', gapShow);
    safeOn('gapNew','click', gapNew);

    safeOn('blockType','change', renderBlockChips);
    safeOn('blockShuffle','click', renderBlockChips);
    safeOn('blockSpeak','click', ()=>speak(state.lastLine||''));

    safeOn('noteBox','input', updateNoteWords);
    safeOn('noteClear','click', noteClear);
    safeOn('noteRead','click', ()=>speak($('#noteBox').value||''));
    safeOn('noteModel','click', showNoteModel);
    safeOn('noteCopy','click', ()=>copyToClipboard($('#noteBox').value||'', '✅ Note copied.'));
    safeOn('note8','click', noteStart);
    safeOn('noteStop','click', noteStop);

    safeOn('modelA2','click', ()=>{ $('#modelOut').textContent = noteModels[state.noteTarget].A2; });
    safeOn('modelB1','click', ()=>{ $('#modelOut').textContent = noteModels[state.noteTarget].B1; });
    safeOn('modelB2','click', ()=>{ $('#modelOut').textContent = noteModels[state.noteTarget].B2; });
    safeOn('modelSay','click', ()=>speak($('#modelOut').textContent||''));

    safeOn('destStyle','change', itineraryModel);
    safeOn('mood','change', itineraryModel);
    safeOn('itineraryModel','click', itineraryModel);
    safeOn('itineraryClear','click', itineraryClear);
    safeOn('itinerarySay','click', itinerarySay);

    safeOn('hotelReq','change', ()=>{ renderHotelChips(); renderHotelModel(); });
    safeOn('hotelModel','click', renderHotelModel);
    safeOn('hotelClear','click', hotelClear);
    safeOn('hotelSay','click', hotelSay);

    safeOn('spPrompt','change', renderSpeakingPrompt);
    safeOn('sp60','click', spStart);
    safeOn('spStop','click', spStop);
    safeOn('spListen','click', spListen);
    safeOn('spShowModel','click', spShowModel);
    safeOn('spSayModel','click', spSayModel);

    safeOn('rpScenario','change', renderRoleplay);
    safeOn('rpSayYou','click', ()=>speak($('#rpYou').textContent||''));
    safeOn('rpSayTeacher','click', ()=>speak($('#rpTeacher').textContent||''));
    safeOn('rpNew','click', ()=>{
      const sel=$('#rpScenario');
      sel.selectedIndex = Math.floor(Math.random()*sel.options.length);
      renderRoleplay();
    });

    updateNoteWords();
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();