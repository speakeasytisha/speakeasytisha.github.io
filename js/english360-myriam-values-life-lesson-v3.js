
(() => {
  'use strict';
  window.__ValuesLessonLoaded = true;

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const pad2 = n => String(n).padStart(2,'0');
  const fmt = s => `${pad2(Math.floor(s/60))}:${pad2(s%60)}`;
  const shuffle = (arr) => { const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; };
  const norm = (s) => (s||'').toLowerCase().replace(/[^\w\s’'-]/g,' ').replace(/\s+/g,' ').trim();
  const wordCount = (t) => (t||'').trim().split(/\s+/).filter(Boolean).length;


  // Pretty formatting for grammar boxes (clean layout)
  function escapeHtml(s){
    return (s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  }
  function prettyBlock(text){
    const lines = (text||"").split("\n");
    let html = '<div class="gBlock">';
    let inList = false;
    for(const raw of lines){
      const line = raw.trimEnd();
      if(!line){
        if(inList){ html += '</ul>'; inList=false; }
        html += '<div class="gSpacer"></div>';
        continue;
      }
      if(line.startsWith("✅")){
        if(inList){ html += '</ul>'; inList=false; }
        html += `<div class="gHead">${escapeHtml(line)}</div>`;
        continue;
      }
      if(line.startsWith("•")){
        if(!inList){ html += '<ul class="gList">'; inList=true; }
        html += `<li>${escapeHtml(line.replace(/^•\s*/,""))}</li>`;
        continue;
      }
      if(inList){ html += '</ul>'; inList=false; }
      html += `<div class="gLine">${escapeHtml(line)}</div>`;
    }
    if(inList){ html += '</ul>'; }
    html += '</div>';
    return html;
  }
  // Toast
  const toast = (msg) => {
    let t = $('#toast');
    if(!t){
      t = document.createElement('div');
      t.id='toast';
      Object.assign(t.style,{
        position:'fixed',left:'16px',bottom:'16px',padding:'10px 12px',
        background:'rgba(0,0,0,.72)',color:'#fff',borderRadius:'14px',
        border:'1px solid rgba(255,255,255,.14)',zIndex:9999,maxWidth:'80vw'
      });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.display='block';
    clearTimeout(toast._t);
    toast._t = setTimeout(()=> t.style.display='none', 1600);
  };

  // TTS
  const tts = { voices:[], accent:'US', rate:1 };
  const loadVoices = () => { try{ tts.voices = speechSynthesis.getVoices(); }catch(e){ tts.voices=[]; } };
  const pickVoice = () => {
    const v = tts.voices || [];
    if(!v.length) return null;
    const wants = tts.accent==='UK' ? ['en-GB','United Kingdom','UK'] : ['en-US','United States','US'];
    return v.find(x => wants.some(w => (x.lang||'').includes(w) || (x.name||'').includes(w)))
      || v.find(x => (x.lang||'').startsWith('en'))
      || v[0];
  };
  const speak = (text) => {
    if(!('speechSynthesis' in window) || !text) return;
    try{
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = tts.rate;
      const v = pickVoice();
      if(v) u.voice = v;
      speechSynthesis.speak(u);
    }catch(e){}
  };

  // Score
  const score = { ok:0, total:0 };
  const updateScore = () => {
    $('#scorePill').textContent = `${score.ok} / ${score.total}`;
    $('#acc').textContent = score.total ? `${Math.round(score.ok/score.total*100)}%` : '0%';
  };
  const addScore = (ok) => { score.total++; if(ok) score.ok++; updateScore(); };
  const resetScore = () => { score.ok=0; score.total=0; updateScore(); };

  // State
  const state = {
    level:'A2',
    showFR:true,
    vCat:'All',
    vSearch:'',
    currentV:null,
    timers:{ speak:null, write:null },
    mcq:null, mcqChoice:null,
    fix:null,
    conn:null
  };

  // Grammar
  const gImportant = [
    "✅ Pattern 1: It’s important to + VERB",
    "Examples:",
    "• It’s important to respect other people.",
    "• It’s important to help others when you can.",
    "",
    "✅ Pattern 2: It’s important to be + ADJECTIVE",
    "Examples:",
    "• It’s important to be honest and respectful.",
    "• It’s important to be patient with children.",
    "",
    "✅ Pattern 3: I believe in + NOUN / -ING",
    "Examples:",
    "• I believe in honesty.",
    "• I believe in working hard.",
    "",
    "Common mistakes:",
    "• It’s important be… → It’s important TO BE…",
    "• I believe honesty → I believe IN honesty",
].join("\n");
const gAlways = [
    "✅ Present perfect for long‑term values",
    "Form: have/has + past participle",
    "",
    "Use it when it started in the past and is still true now:",
    "• I have always tried to be honest.",
    "• I have always believed in hard work.",
    "",
    "Word order tip:",
    "• I have ALWAYS tried… (always goes after have/has)",
].join("\n");
const gRaised = [
    "✅ Family patterns",
    "• I was raised to + VERB",
    "  I was raised to respect my elders.",
    "",
    "• I was raised to be + ADJECTIVE",
    "  I was raised to be polite.",
    "",
    "• My parents taught me to + VERB",
    "  My parents taught me to tell the truth.",
    "",
    "• I learned from my parents that + CLAUSE",
    "  I learned from my parents that family comes first.",
].join("\n");
const patterns = [
    "I have always tried to be…",
    "It’s important to be…",
    "It’s important to…",
    "My parents taught me to…",
    "I was raised to…",
    "I learned from my parents that…",
    "I want my children to…",
    "In my opinion,…"
  ];

  // Vocabulary
  const vocab = [
    {id:"honest",cat:"Values",icon:"🧭",en:"honest",fr:"honnête",def:"telling the truth; not lying",ex:"I have always tried to be honest, even when it is difficult."},
    {id:"respectful",cat:"Values",icon:"🤝",en:"respectful",fr:"respectueux(se)",def:"showing respect to others",ex:"It’s important to be respectful to everyone."},
    {id:"kind",cat:"Values",icon:"💛",en:"kind",fr:"gentil(le)",def:"friendly and caring",ex:"My parents taught me to be kind to others."},
    {id:"patient",cat:"Values",icon:"🧘",en:"patient",fr:"patient(e)",def:"able to wait calmly",ex:"I have always tried to be patient with my children."},
    {id:"responsible",cat:"Values",icon:"✅",en:"responsible",fr:"responsable",def:"doing your duties; reliable",ex:"It’s important to be responsible at work and at home."},
    {id:"hardworking",cat:"Values",icon:"💪",en:"hardworking",fr:"travailleur(se)",def:"working hard; making effort",ex:"I learned from my parents that being hardworking helps you succeed."},
    {id:"generous",cat:"Values",icon:"🎁",en:"generous",fr:"généreux(se)",def:"happy to give or share",ex:"Generous people help others without expecting something back."},
    {id:"grateful",cat:"Values",icon:"🙏",en:"grateful",fr:"reconnaissant(e)",def:"thankful",ex:"I try to be grateful for the little things."},
    {id:"loyal",cat:"Values",icon:"🫶",en:"loyal",fr:"loyal(e)",def:"faithful; you support people you love",ex:"Family relationships are stronger with loyalty and trust."},
    {id:"open-minded",cat:"Values",icon:"🌍",en:"open-minded",fr:"ouvert(e) d’esprit",def:"accepting new ideas and differences",ex:"It’s important to be open-minded when you meet new people."},
    {id:"fair",cat:"Values",icon:"⚖️",en:"fair",fr:"juste",def:"treating people equally",ex:"A fair person listens to both sides."},
    {id:"integrity",cat:"Values",icon:"🏛️",en:"integrity",fr:"intégrité",def:"strong moral principles; doing the right thing",ex:"Integrity means doing the right thing when nobody is watching."},
    {id:"family_first",cat:"Family",icon:"👨‍👩‍👧‍👦",en:"family comes first",fr:"la famille avant tout",def:"family is the top priority",ex:"I learned from my parents that family comes first."},
    {id:"role_model",cat:"Family",icon:"⭐",en:"a role model",fr:"un modèle",def:"someone you admire and learn from",ex:"Parents are role models for their children."},
    {id:"raise",cat:"Family",icon:"🌱",en:"to raise (children)",fr:"élever (des enfants)",def:"to take care of children as they grow",ex:"They raised their children with love and discipline."},
    {id:"pass_down",cat:"Family",icon:"🧬",en:"to pass down",fr:"transmettre",def:"to give values/traditions to the next generation",ex:"I want to pass down respect and kindness to my children."},
    {id:"set_example",cat:"Family",icon:"🪞",en:"to set an example",fr:"montrer l’exemple",def:"to show the right behaviour",ex:"I try to set a good example for my grandchildren."},
    {id:"support",cat:"Family",icon:"🤗",en:"support",fr:"soutien",def:"help and encouragement",ex:"Family support is important in difficult moments."},
    {id:"listen",cat:"Relationships",icon:"👂",en:"to listen carefully",fr:"écouter attentivement",def:"to pay full attention",ex:"It’s important to listen carefully before you respond."},
    {id:"apologize",cat:"Relationships",icon:"🕊️",en:"to apologize",fr:"s’excuser",def:"to say sorry",ex:"A respectful person can apologize when necessary."},
    {id:"communicate",cat:"Relationships",icon:"💬",en:"to communicate clearly",fr:"communiquer clairement",def:"to express ideas in a clear way",ex:"Good relationships need clear communication."},
  ];

  const cats = ["All", ...Array.from(new Set(vocab.map(v=>v.cat))).sort((a,b)=>a.localeCompare(b))];

  // Warmups & chips
  const warmups = [
    "What values are important to you? Give two examples.",
    "What did you learn from your parents?",
    "What values do you want to pass down to your children?",
    "Describe one person you admire and explain why.",
    "What is more important: honesty or kindness? Why?"];

  const starters = [
    "In my opinion,…",
    "I have always tried to be…",
    "It’s important to be…",
    "It’s important to…",
    "My parents taught me to…",
    "I was raised to…",
    "I learned from my parents that…",
    "I want my children to…"
  ];

  const fluency = [
    "Let me think…",
    "To be honest,…",
    "In my opinion,…",
    "For example,…",
    "Overall,…",
    "The main reason is…",
    "In addition,…",
    "However,…"
  ];

  // Exercise banks
  const mcqBank = [
    {q:"It’s important ___ respectful.", opts:["to be","be","being"], a:"to be", tip:"Use: It’s important to be + adjective."},
    {q:"I have always ___ to be honest.", opts:["try","tried","trying"], a:"tried", tip:"Present perfect: have/has + past participle (tried)."},
    {q:"My parents taught me ___ tell the truth.", opts:["to","for","-"], a:"to", tip:"Teach someone to + verb."},
    {q:"I want my children ___ responsible.", opts:["to be","be","being"], a:"to be", tip:"Want someone to + verb."},
    {q:"I was raised ___ respect my elders.", opts:["to","for","-"], a:"to", tip:"Raised to + verb."},
    {q:"I learned from my parents ___ family comes first.", opts:["that","to","because"], a:"that", tip:"Learned that + clause."},
  ];

  const fixBank = [
    {bad:"It’s important be honest.", good:"It’s important to be honest.", why:"Use: It’s important to be + adjective."},
    {bad:"I have always try to be patient.", good:"I have always tried to be patient.", why:"Present perfect: have + past participle (tried)."},
    {bad:"My parents taught me respect others.", good:"My parents taught me to respect others.", why:"Teach someone to + verb."},
    {bad:"I want my children be kind.", good:"I want my children to be kind.", why:"Want someone to + verb."},
    {bad:"I was raised for be respectful.", good:"I was raised to be respectful.", why:"Raised to + verb."},
  ];

  // Builder
  const bStarts = [
    "I have always tried to be",
    "It’s important to be",
    "It’s important to",
    "My parents taught me to",
    "I was raised to",
    "I want my children to be"
  ];
  const bMids = [
    "honest","respectful","kind","patient","responsible","hardworking","open-minded","fair",
    "listen carefully","help others","communicate clearly","apologize"
  ];
  const bReasons = [
    "it helps build trust",
    "it makes relationships stronger",
    "family is important to me",
    "it shows respect",
    "it creates a peaceful home",
    "it helps people feel safe",
    "I want to set a good example",
    "I learned it from my parents"
  ];

  // Connector exercise
  const connBank = [
    {textParts:["I have always tried to be honest. ",{opts:["For example,","However,","Yesterday,"], a:"For example,"}," I tell the truth even when it is difficult. ",{opts:["In addition,","Because,","Unless,"], a:"In addition,"}," I want to pass down this value to my children."]},
    {textParts:["It’s important to be respectful. ",{opts:["Overall,","On Monday,","Although,"], a:"Overall,"}," respect makes family relationships stronger. ",{opts:["For example,","Despite,","Where,"], a:"For example,"}," listening carefully helps avoid conflict."]}
  ];

  // Speaking scenarios
  const speakingScenarios = [
    {id:"values",title:"My top values",prompt:"Speak (60–90s): What are your 2–3 most important values? Give one example from your life.",models:{
      A2:"My most important values are honesty and kindness. I have always tried to be honest. For example, I tell the truth. It is important to be kind because it helps people feel safe. I want to pass down these values to my children.",
      B1:"For me, respect and responsibility are very important. I was raised to respect others, and I have always tried to be responsible. For example, I keep my promises and I help my family. In addition, I want my children to be respectful and open-minded.",
      B2:"I would say integrity, respect, and empathy are the most important values for me. I learned from my parents that family comes first, but also that you should treat people fairly. For example, I try to listen carefully before I speak. Overall, I want to pass down these values because they create trust and strong relationships."
    }},
    {id:"parents",title:"What I learned from my parents",prompt:"Speak: What did your parents teach you? How do you use it today?",models:{
      A2:"My parents taught me to work hard and be respectful. I try to do this today. It is important to be responsible.",
      B1:"My parents taught me to help others and to tell the truth. Today, I use these values in my family life. For example, I try to be patient and supportive.",
      B2:"My parents taught me that respect and honesty matter more than appearances. Today, I apply this by being consistent and fair. In the long run, these values help create a peaceful family environment."
    }},
    {id:"children",title:"Values I want to pass down",prompt:"Speak: What values do you want to pass down to your children or grandchildren? Why?",models:{
      A2:"I want my children to be kind and respectful. It is important because family is important to me.",
      B1:"I want to pass down responsibility and gratitude. For example, I want them to help others and be grateful for what they have.",
      B2:"I want to pass down integrity, open-mindedness, and gratitude. Although life can be stressful, these values help people make good decisions and keep strong relationships."
    }}
  ];

  // Writing prompts & models
  const writingPrompts = [
    "Write 8–12 lines: What values are important to you? What did you learn from your parents?",
    "Write 8–12 lines: What values do you want to pass down to your children or grandchildren? Give examples.",
    "Write 8–12 lines: Describe a role model in your family and explain what you learned from them."
  ];

  const writingModels = {
    A2:"Values are important in life. I have always tried to be honest and kind. My parents taught me to respect other people. For example, I listen carefully and I try to be patient. It’s important to be responsible because it helps family life. I want to pass down respect and kindness to my children.",
    B1:"For me, respect, responsibility, and gratitude are important values. I was raised to respect others and to work hard. I have always tried to be honest, even in difficult situations. For example, I keep my promises and I try to support my family. In addition, I want my children to be open-minded and respectful.",
    B2:"The values I care about most are integrity, respect, and empathy. I learned from my parents that family comes first, but also that you should treat people fairly and communicate clearly. For example, I try to listen carefully before reacting. However, I also believe it’s important to apologize when necessary. Overall, I want to pass down these values because they build trust and create strong relationships."
  };

  // Teacher compare stats
  const stats = (txt) => {
    const t = (txt||'').trim();
    const words = t ? t.split(/\s+/).filter(Boolean) : [];
    const sentences = t ? t.split(/[.!?]+/).map(x=>x.trim()).filter(Boolean) : [];
    const uniq = new Set(words.map(w=>w.toLowerCase().replace(/[^\w’-]/g,''))).size;
    const connectors = ["because","however","overall","for example","although","whereas","in addition","to be honest"];
    const connCount = connectors.reduce((acc,c)=> acc + (norm(t).includes(c) ? 1 : 0), 0);
    return {w:words.length, s:sentences.length, avg: sentences.length ? (words.length/sentences.length) : 0, u:uniq, c:connCount};
  };

  // UI helpers
  const setLevel = (lvl) => {
    state.level = lvl;
    $$('.segBtn[data-level]').forEach(b => b.classList.toggle('on', b.dataset.level === lvl));
    $('#sModelOut').textContent = '';
    $('#wModelOut').textContent = '';
  };

  const setFR = (on) => {
    state.showFR = !!on;
    $('#frToggle').textContent = state.showFR ? 'On' : 'Off';
    $('#frToggle').setAttribute('aria-pressed', state.showFR ? 'true' : 'false');
    renderVocab();
  };

  const setAccent = (acc) => {
    tts.accent = acc;
    $$('.segBtn[data-accent]').forEach(b => b.classList.toggle('on', b.dataset.accent === acc));
  };

  // Timers
  const timers = {
    start(key, seconds, outId, doneMsg){
      if(state.timers[key]) clearInterval(state.timers[key]);
      let left = seconds;
      $('#' + outId).textContent = fmt(left);
      state.timers[key] = setInterval(() => {
        left--;
        $('#' + outId).textContent = fmt(Math.max(0,left));
        if(left <= 0){
          clearInterval(state.timers[key]);
          state.timers[key] = null;
          toast(doneMsg);
        }
      }, 1000);
    },
    stop(key, outId){
      if(state.timers[key]) clearInterval(state.timers[key]);
      state.timers[key] = null;
      $('#' + outId).textContent = "00:00";
    }
  };

  // Warm-up
  const renderWarmPrompt = () => { $('#warmPrompt').textContent = shuffle(warmups)[0]; };
  const renderStarterChips = () => {
    const host = $('#starterChips'); host.innerHTML='';
    starters.forEach(s=>{
      const b=document.createElement('button');
      b.type='button'; b.className='chip'; b.textContent=s;
      b.addEventListener('click', () => {
        $('#warmNotes').value = ($('#warmNotes').value ? $('#warmNotes').value + "\n" : "") + s.replace('…','');
      });
      host.appendChild(b);
    });
  };

  // Grammar
  const renderGrammar = () => {
    // Pretty HTML (better aesthetics) + plain text for TTS
    $('#gImportant').innerHTML = prettyBlock(gImportant);
    $('#gAlways').innerHTML = prettyBlock(gAlways);
    $('#gRaised').innerHTML = prettyBlock(gRaised);

    const host = $('#patternChips'); host.innerHTML='';
    patterns.forEach(p=>{
      const b=document.createElement('button');
      b.type='button'; b.className='chip'; b.textContent=p;
      b.addEventListener('click', () => speak(p.replace('…','')));
      host.appendChild(b);
    });
  };

  // Vocab rendering
  const fillCatSelect = () => {
    const sel = $('#vCat');
    sel.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
    sel.value = state.vCat;
  };

  const vocabFiltered = () => {
    const cat = state.vCat;
    const q = state.vSearch.trim().toLowerCase();
    return vocab
      .filter(v => (cat === 'All' || v.cat === cat))
      .filter(v => !q || v.en.toLowerCase().includes(q) || v.fr.toLowerCase().includes(q))
      .sort((a,b) => (a.cat.localeCompare(b.cat) || a.en.localeCompare(b.en)));
  };

  const renderVocab = () => {
    fillCatSelect();
    const grid = $('#vGrid'); grid.innerHTML='';
    vocabFiltered().forEach(v=>{
      const card=document.createElement('button');
      card.type='button'; card.className='vCard';
      card.innerHTML = `
        <div class="vTop">
          <div class="vIcon" aria-hidden="true">${v.icon}</div>
          <div>
            <div class="vEn">${v.en}</div>
            <div class="vFr" style="display:${state.showFR ? 'block':'none'}">${v.fr}</div>
          </div>
          <div class="vCat"><div class="vTag">${v.cat}</div></div>
        </div>
        <div class="tiny muted">${v.def}</div>
      `;
      card.addEventListener('click', () => openModal(v));
      grid.appendChild(card);
    });
  };

  // Modal
  const overlay = () => $('#modalOverlay');
  const openModal = (v) => {
    state.currentV = v;
    $('#mIcon').textContent = v.icon;
    $('#mEn').textContent = v.en;
    $('#mFr').textContent = v.fr;
    $('#mFr').style.display = state.showFR ? 'block' : 'none';
    $('#mDef').textContent = `Definition: ${v.def}`;
    $('#mEx').textContent  = `Example: ${v.ex}`;
    overlay().hidden = false;
    $('#modalClose').focus();
  };
  const closeModal = () => { overlay().hidden = true; state.currentV = null; };

  // MCQ
  const renderMCQ = () => {
    state.mcq = shuffle(mcqBank)[0];
    state.mcqChoice = null;
    $('#mcqPrompt').textContent = state.mcq.q;
    $('#mcqFeedback').textContent = '';
    const host = $('#mcqOptions'); host.innerHTML='';
    shuffle(state.mcq.opts).forEach(opt=>{
      const b=document.createElement('button');
      b.type='button'; b.className='pill'; b.textContent=opt;
      b.addEventListener('click', () => {
        state.mcqChoice = opt;
        $$('#mcqOptions .pill').forEach(x=>x.classList.remove('on'));
        b.classList.add('on');
      });
      host.appendChild(b);
    });
  };

  const checkMCQ = () => {
    if(!state.mcqChoice){
      $('#mcqFeedback').textContent = "Choose an option first.";
      return;
    }
    const ok = state.mcqChoice === state.mcq.a;
    addScore(ok);
    $('#mcqFeedback').textContent = ok ? "✅ Correct!" : `❌ Not quite.\nAnswer: ${state.mcq.a}\nTip: ${state.mcq.tip}`;
  };

  // Fix
  const renderFix = () => {
    state.fix = shuffle(fixBank)[0];
    $('#fixPrompt').textContent = "Fix this sentence:\n" + state.fix.bad;
    $('#fixInput').value = '';
    $('#fixFeedback').textContent = '';
  };
  const checkFix = () => {
    const user = norm($('#fixInput').value);
    if(!user){ $('#fixFeedback').textContent="Write your corrected sentence first."; return; }
    const ok = user === norm(state.fix.good);
    addScore(ok);
    $('#fixFeedback').textContent = ok ? "✅ Perfect!" : `❌ Close.\nCorrect: ${state.fix.good}\nWhy: ${state.fix.why}`;
  };

  // Builder
  const fillSelect = (id, items) => {
    const sel = $('#' + id);
    sel.innerHTML = items.map(x => `<option value="${x}">${x}</option>`).join('');
  };
  const randomBuilder = () => {
    $('#bStart').value = shuffle(bStarts)[0];
    $('#bMid').value = shuffle(bMids)[0];
    $('#bReason').value = shuffle(bReasons)[0];
    $('#bOut').textContent = '';
  };
  const isAdj = (mid) => {
    const adj = ["honest","respectful","kind","patient","responsible","hardworking","open-minded","fair"];
    return adj.includes(mid);
  };

  const buildSentence = () => {
    const start = $('#bStart').value;
    const mid = $('#bMid').value;
    const reason = $('#bReason').value;

    // Auto-add "be" when structure is "to + adjective"
    const needsBe = (start === "I was raised to" || start === "My parents taught me to" || start === "It’s important to") && isAdj(mid);
    const core = needsBe ? `${start} be ${mid}` : `${start} ${mid}`;

    const s = `${core} because ${reason}.`;
    $('#bOut').textContent = s;
    return s;
  };
  const checkBuilder = () => {
    const start = $('#bStart').value;
    const mid = $('#bMid').value;

    const verbish = ["listen","help","communicate","apologize"].some(v => mid.startsWith(v));
    const adjish = isAdj(mid);

    let ok = true;
    if(start === "It’s important to" && adjish) ok = false;
    if((start === "It’s important to be" || start === "I want my children to be") && verbish) ok = false;

    addScore(ok);
    $('#bOut').textContent = buildSentence() + (ok ? "\n✅ Good structure." : "\n⚠️ Check: use TO + VERB or TO BE + ADJECTIVE.");
  };

  // Connector exercise
  const renderConn = () => {
    state.conn = shuffle(connBank)[0];
    const host = $('#connBox'); host.innerHTML='';
    state.conn.textParts.forEach(p=>{
      if(typeof p === 'string'){
        const span=document.createElement('span'); span.textContent=p; host.appendChild(span);
      }else{
        const sel=document.createElement('select');
        sel.className='select';
        sel.style.width='auto';
        sel.style.minWidth='160px';
        sel.dataset.answer=p.a;
        sel.innerHTML = p.opts.map(o=>`<option value="${o}">${o}</option>`).join('');
        host.appendChild(sel);
      }
    });
    $('#connFeedback').textContent='';
  };
  const checkConn = () => {
    const sels = $$('#connBox select');
    let okCount = 0;
    sels.forEach(s=>{
      const ok = s.value === s.dataset.answer;
      s.style.borderColor = ok ? 'rgba(120,255,170,.55)' : 'rgba(255,120,120,.55)';
      if(ok) okCount++;
    });
    const okAll = okCount === sels.length;
    addScore(okAll);
    $('#connFeedback').textContent = okAll ? "✅ Perfect!" : `❌ ${okCount}/${sels.length} correct. Fix the red ones.`;
  };

  // Speaking
  const fillSpeaking = () => {
    const sel = $('#sSel');
    sel.innerHTML = speakingScenarios.map(s => `<option value="${s.id}">${s.title}</option>`).join('');
    sel.value = speakingScenarios[0].id;
    renderSpeakingPrompt();
  };
  const currentScenario = () => speakingScenarios.find(x => x.id === $('#sSel').value) || speakingScenarios[0];
  const renderSpeakingPrompt = () => {
    $('#sPrompt').textContent = currentScenario().prompt;
    $('#sModelOut').textContent = '';
    $('#sCheck').textContent = [
      "• Mention 2–3 values",
      "• Give 1 personal example",
      "• Use 2 key patterns (I have always tried… / It’s important to…)",
      "• Use 1 connector (for example / in addition / however / overall)"
    ].join("\n");
  };
  const renderFluency = () => {
    const host = $('#fluencyChips'); host.innerHTML='';
    fluency.forEach(line=>{
      const b=document.createElement('button');
      b.type='button'; b.className='chip'; b.textContent=line;
      b.addEventListener('click', () => {
        const ta=$('#sNotes');
        ta.value = (ta.value ? ta.value + "\n" : "") + line.replace('…','');
      });
      host.appendChild(b);
    });
  };
  const showSpeakModel = () => { $('#sModelOut').textContent = currentScenario().models[state.level]; };

  // Writing
  const renderWriting = () => { $('#wPrompt').textContent = shuffle(writingPrompts)[0]; $('#wModelOut').textContent=''; };
  const renderWritingChips = () => {
    const host = $('#wChips'); host.innerHTML='';
    const phrases = [
      "I have always tried to be…",
      "It’s important to be…",
      "My parents taught me to…",
      "I was raised to…",
      "I learned from my parents that…",
      "In addition,…",
      "For example,…",
      "Overall,…"
    ];
    phrases.forEach(p=>{
      const b=document.createElement('button');
      b.type='button'; b.className='chip'; b.textContent=p;
      b.addEventListener('click', () => {
        const ta=$('#wBox');
        ta.value = (ta.value ? ta.value + "\n" : "") + p.replace('…','');
        $('#wWords').textContent = String(wordCount(ta.value));
      });
      host.appendChild(b);
    });
  };
  const showWritingModel = () => { $('#wModelOut').textContent = writingModels[state.level]; };

  // Compare
  const compareStats = () => {
    const a = stats($('#tStudent').value);
    const b = stats($('#tCorrected').value);
    const c = stats($('#tHigher').value);
    $('#tOut').textContent = [
      `Student: Words ${a.w} | Sentences ${a.s} | Avg ${a.avg.toFixed(1)} | Unique ${a.u} | Connectors ${a.c}`,
      `Corrected: Words ${b.w} | Sentences ${b.s} | Avg ${b.avg.toFixed(1)} | Unique ${b.u} | Connectors ${b.c}`,
      `Higher-level: Words ${c.w} | Sentences ${c.s} | Avg ${c.avg.toFixed(1)} | Unique ${c.u} | Connectors ${c.c}`,
      "",
      "Teacher focus:",
      "• Fix missing 'to' / 'to be'",
      "• Use 2 connectors (for example, in addition, however)",
      "• Add 1 concrete example"
    ].join("\n");
  };

  // Reset & New set
  const resetAll = () => {
    timers.stop('speak','sTimer');
    timers.stop('write','wTimer');
    $('#warmNotes').value='';
    $('#mcqFeedback').textContent='';
    $('#fixFeedback').textContent='';
    $('#bOut').textContent='';
    $('#connFeedback').textContent='';
    $('#sNotes').value='';
    $('#sModelOut').textContent='';
    $('#wBox').value='';
    $('#wWords').textContent='0';
    $('#wModelOut').textContent='';
    $('#tStudent').value=''; $('#tCorrected').value=''; $('#tHigher').value=''; $('#tOut').textContent='';
    renderWarmPrompt(); renderMCQ(); renderFix(); randomBuilder(); renderConn(); renderSpeakingPrompt(); renderWriting();
    toast("Reset done.");
  };

  const newSet = () => {
    renderWarmPrompt(); renderMCQ(); renderFix(); randomBuilder(); renderConn(); renderWriting();
    toast("✨ New prompts loaded.");
  };

  // Init
  const init = () => {
    $('#jsOk').textContent = "JS: ready ✅";
    updateScore();
    loadVoices();
    if('speechSynthesis' in window) speechSynthesis.onvoiceschanged = loadVoices;

    renderGrammar();
    renderWarmPrompt();
    renderStarterChips();
    renderVocab();

    // Controls
    $$('.segBtn[data-level]').forEach(b => b.addEventListener('click', () => setLevel(b.dataset.level)));
    $$('.segBtn[data-accent]').forEach(b => b.addEventListener('click', () => setAccent(b.dataset.accent)));
    $('#rate').addEventListener('input', e => tts.rate = parseFloat(e.target.value || '1'));
    $('#frToggle').addEventListener('click', () => setFR(!state.showFR));
    $('#printBtn').addEventListener('click', () => window.print());
    $('#newSetBtn').addEventListener('click', newSet);
    $('#resetAllBtn').addEventListener('click', resetAll);
    $('#resetScore').addEventListener('click', resetScore);

    // Warmup
    $('#warmNewBtn').addEventListener('click', renderWarmPrompt);
    $('#warmSayBtn').addEventListener('click', () => speak($('#warmPrompt').textContent));
    $('#warmClearBtn').addEventListener('click', () => $('#warmNotes').value='');
    $('#warmNotesSayBtn').addEventListener('click', () => speak($('#warmNotes').value));

    // Grammar TTS
    $('#sayImportantBtn').addEventListener('click', () => speak($('#gImportant').textContent));
    $('#sayAlwaysBtn').addEventListener('click', () => speak($('#gAlways').textContent));

    // Vocab filters
    $('#vCat').addEventListener('change', e => { state.vCat = e.target.value; renderVocab(); });
    $('#vSearch').addEventListener('input', e => { state.vSearch = e.target.value; renderVocab(); });
    $('#vResetBtn').addEventListener('click', () => { state.vCat='All'; state.vSearch=''; $('#vSearch').value=''; renderVocab(); });
    $('#vAdd3Btn').addEventListener('click', () => {
      const list = vocabFiltered().slice(0,3);
      const add = list.map(v => v.en).join(', ');
      const ta = $('#warmNotes');
      ta.value = (ta.value ? ta.value + "\n" : "") + "Vocabulary: " + add;
      toast("Added 3 words to notes.");
    });

    // Modal
    $('#modalClose').addEventListener('click', closeModal);
    $('#modalOverlay').addEventListener('click', (e) => { if(e.target.id === 'modalOverlay') closeModal(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && !overlay().hidden) closeModal(); });
    $('#mSayBtn').addEventListener('click', () => { if(state.currentV) speak(state.currentV.en); });
    $('#mAddBtn').addEventListener('click', () => {
      if(!state.currentV) return;
      const ta = $('#warmNotes');
      ta.value = (ta.value ? ta.value + "\n" : "") + state.currentV.en;
      toast("Added to notes.");
    });

    // MCQ
    renderMCQ();
    $('#mcqCheckBtn').addEventListener('click', checkMCQ);
    $('#mcqNextBtn').addEventListener('click', renderMCQ);
    $('#mcqSayBtn').addEventListener('click', () => speak($('#mcqPrompt').textContent));

    // Fix
    renderFix();
    $('#fixCheckBtn').addEventListener('click', checkFix);
    $('#fixShowBtn').addEventListener('click', () => $('#fixFeedback').textContent = `Answer: ${state.fix.good}\nWhy: ${state.fix.why}`);
    $('#fixNextBtn').addEventListener('click', renderFix);
    $('#fixSayBtn').addEventListener('click', () => speak(state.fix.bad));

    // Builder
    fillSelect('bStart', bStarts);
    fillSelect('bMid', bMids);
    fillSelect('bReason', bReasons);
    randomBuilder();
    $('#bRandomBtn').addEventListener('click', randomBuilder);
    $('#bBuildBtn').addEventListener('click', buildSentence);
    $('#bCheckBtn').addEventListener('click', checkBuilder);
    $('#bSayBtn').addEventListener('click', () => speak(buildSentence()));

    // Connectors
    renderConn();
    $('#connNewBtn').addEventListener('click', renderConn);
    $('#connCheckBtn').addEventListener('click', checkConn);

    // Speaking
    fillSpeaking();
    renderFluency();
    $('#sSel').addEventListener('change', renderSpeakingPrompt);
    $('#sSayBtn').addEventListener('click', () => speak($('#sPrompt').textContent));
    $('#sModelBtn').addEventListener('click', showSpeakModel);
    $('#sModelSayBtn').addEventListener('click', () => speak($('#sModelOut').textContent));
    $('#sNotesClearBtn').addEventListener('click', () => $('#sNotes').value='');
    $('#sNotesSayBtn').addEventListener('click', () => speak($('#sNotes').value));
    $('#s60Btn').addEventListener('click', () => timers.start('speak',60,'sTimer','Time!'));
    $('#s90Btn').addEventListener('click', () => timers.start('speak',90,'sTimer','Time!'));
    $('#sStopBtn').addEventListener('click', () => timers.stop('speak','sTimer'));

    // Writing
    renderWriting();
    renderWritingChips();
    $('#wBox').addEventListener('input', () => $('#wWords').textContent = String(wordCount($('#wBox').value)));
    $('#wSayBtn').addEventListener('click', () => speak($('#wBox').value));
    $('#wModelBtn').addEventListener('click', showWritingModel);
    $('#wClearBtn').addEventListener('click', () => { $('#wBox').value=''; $('#wWords').textContent='0'; $('#wModelOut').textContent=''; });
    $('#wCopyBtn').addEventListener('click', async () => {
      try{ await navigator.clipboard.writeText($('#wBox').value); toast("✅ Copied."); }
      catch(e){ toast("Copy blocked."); }
    });
    $('#w8Btn').addEventListener('click', () => timers.start('write',8*60,'wTimer','Writing time finished.'));
    $('#wStopBtn').addEventListener('click', () => timers.stop('write','wTimer'));

    // Compare
    $('#tCompareBtn').addEventListener('click', compareStats);
    $('#tClearBtn').addEventListener('click', () => { $('#tStudent').value=''; $('#tCorrected').value=''; $('#tHigher').value=''; $('#tOut').textContent=''; });

    // Default FR on
    setFR(true);
  };

  window.addEventListener('error', (e) => {
    const box = $('#errBox');
    if(box){
      box.hidden = false;
      box.textContent = '⚠️ ' + (e && e.message ? e.message : 'Error');
    }
  });

  document.addEventListener('DOMContentLoaded', init);
})();
