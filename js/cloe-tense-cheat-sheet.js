/* CLOE Verb Tense Decoder — One‑Stop Cheat Sheet (A1→B1) — FIXED
   - Modal: always closable; also not relied on for model answers (inline panels).
   - Conditional (would): included for A2 (polite) + B1 (hypothetical / second conditional).
   - Model answers: step‑by‑step panels with highlighted structure.
   - Answers never reveal unless user clicks a "Show" button.
*/
(() => {
  'use strict';

  const $ = (s, r=document)=>r.querySelector(s);
  const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
  const LS = 'SET_cloe_tense_decoder_v4';

  const levelRank = {A1:1, A2:2, B1:3};
  const canUse = (itemMin)=> !itemMin || (levelRank[state.level] >= levelRank[itemMin]);

  const state = {
    level: 'A2',
    mode: 'tap',
    score: 0,
    streak: 0,
    mastery: {},
    tapId: null,
    tapEl: null,
    mini: null,
    mission: null
  };

  const esc = (s)=>String(s ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pick = (arr)=>arr[Math.floor(Math.random()*arr.length)];
  const shuffle = (arr)=>{
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  };
  const sample = (arr, n)=>shuffle(arr).slice(0, Math.min(n, arr.length));
  const norm = (s)=>String(s ?? '').trim().toLowerCase()
    .replace(/[“”]/g,'"').replace(/[’]/g,"'")
    .replace(/\s+/g,' ')
    .replace(/\s+([.,!?])/g,'$1');

  function save(){ try{ localStorage.setItem(LS, JSON.stringify(state)); }catch(e){} }
  function load(){
    try{
      const raw = localStorage.getItem(LS);
      if(!raw) return;
      const d = JSON.parse(raw);
      ['level','mode','score','streak','mastery'].forEach(k=>{
        if(d[k]!==undefined) state[k]=d[k];
      });
    }catch(e){}
  }

  // Toast (no /*modal*/ overlays)
  function toast(msg){
    const tip = $('#tipBox');
    if(!tip) return;
    tip.textContent = msg;
    tip.classList.add('flash');
    setTimeout(()=>tip.classList.remove('flash'), 550);
  }

  async function copyText(txt){
    try{
      await navigator.clipboard.writeText(txt);
      toast('✅ Copied to clipboard.');
    }catch(e){
      // Fallback: select the text so the user can copy manually
      toast('⚠️ Clipboard blocked. Select text and copy manually.');
    }
  }

  function setText(el, t){ if(el) el.textContent=t; }
  function setResult(el, kind, html){
    if(!el) return;
    el.classList.remove('result--good','result--bad','result--hint');
    if(kind==='good') el.classList.add('result--good');
    if(kind==='bad') el.classList.add('result--bad');
    if(kind==='hint') el.classList.add('result--hint');
    el.innerHTML = html;
  }

  function updateHUD(){
    setText($('#score'), String(state.score));
    setText($('#streak'), String(state.streak));
    const items = Object.values(state.mastery || {});
    let pct = 0;
    if(items.length){
      const ratios = items.map(m => m.a ? (m.c/m.a) : 0);
      pct = Math.round(ratios.reduce((a,b)=>a+b,0) / ratios.length * 100);
    }
    setText($('#mastery'), String(pct));
  }

  function bump(points){
    state.score = Math.max(0, state.score + points);
    if(points>0) state.streak += 1; else state.streak = 0;
    updateHUD(); save();
  }

  function track(tenseId, ok){
    if(!state.mastery[tenseId]) state.mastery[tenseId] = {c:0,a:0};
    state.mastery[tenseId].a += 1;
    if(ok) state.mastery[tenseId].c += 1;
    save(); updateHUD();
  }

  // Tap/Drag helpers
  function clearTap(){
    state.tapId=null;
    if(state.tapEl){
      state.tapEl.setAttribute('aria-pressed','false');
      state.tapEl=null;
    }
  }

  function makeTile({id,label,emoji}){
    const b=document.createElement('button');
    b.type='button';
    b.className='tile';
    b.dataset.id=id;
    b.dataset.label=label;
    b.setAttribute('aria-pressed','false');
    b.innerHTML = `${emoji?`<span aria-hidden="true">${emoji}</span> `:''}${esc(label)}`;

    b.addEventListener('click', ()=>{
      if(state.mode!=='tap' || b.disabled) return;
      if(state.tapId===id){
        b.setAttribute('aria-pressed','false');
        state.tapId=null; state.tapEl=null; return;
      }
      clearTap();
      state.tapId=id; state.tapEl=b;
      b.setAttribute('aria-pressed','true');
    });

    b.addEventListener('dragstart', (e)=>{
      if(state.mode!=='drag' || b.disabled){ e.preventDefault(); return; }
      e.dataTransfer.setData('text/plain', id);
    });
    b.draggable = (state.mode==='drag');
    return b;
  }

  function makeSlot({index,label,onDrop}){
    const wrap=document.createElement('div');
    wrap.className='slot';
    wrap.dataset.index=String(index);
    wrap.innerHTML = `
      <div class="slot__label">${esc(label)}</div>
      <div class="slot__drop" role="button" tabindex="0">
        <div class="slot__text" data-slottext>(empty)</div>
        <div class="slot__hint">${state.mode==='tap'?'tap':'drag'}</div>
      </div>`;
    const drop = $('.slot__drop', wrap);

    const place = (id)=>{
      if(!id) return;
      onDrop(id, wrap);
      clearTap();
    };

    drop.addEventListener('click', ()=>{
      if(state.mode!=='tap' || !state.tapId) return;
      place(state.tapId);
    });
    drop.addEventListener('keydown', (e)=>{
      if((e.key==='Enter' || e.key===' ') && state.mode==='tap' && state.tapId){
        e.preventDefault();
        place(state.tapId);
      }
    });

    drop.addEventListener('dragover', (e)=>{
      if(state.mode!=='drag') return;
      e.preventDefault();
      drop.style.outline='3px solid rgba(124,219,255,.55)';
      drop.style.outlineOffset='2px';
    });
    drop.addEventListener('dragleave', ()=>{ drop.style.outline=''; drop.style.outlineOffset=''; });
    drop.addEventListener('drop', (e)=>{
      if(state.mode!=='drag') return;
      e.preventDefault();
      drop.style.outline=''; drop.style.outlineOffset='';
      const id=e.dataTransfer.getData('text/plain');
      place(id);
    });

    return wrap;
  }

  // --------- Tenses ----------
  const TENSES = [
    {
      id:'ps', icon:'🟢', name:'Present Simple', levels:['A1','A2','B1'],
      when:['routine / habits','facts / general truths','regular schedules'],
      keywords:['every day','usually','often','always','sometimes','never','on Mondays','at 8:30'],
      form:{aff:'I/you/we/they work • He/she works',neg:"I don't work • He doesn't work",ques:'Do you work? • Does he work?'},
      examples:['I check emails every morning.','She works in Quality.','The meeting starts at 10.'],
      practice:{
        mcq:[
          {q:'Every week, we ____ a report.', opts:['write','are writing','wrote','have written'], a:'write', hint:'Routine → Present Simple.'},
          {q:'He ____ in the Quality Department.', opts:['works','is working','worked','has worked'], a:'works', hint:'Fact/job → Present Simple (+s).'},
          {q:'The meeting ____ at 10:00.', opts:['starts','is starting','started','will start'], a:'starts', hint:'Schedule → Present Simple.'},
          {q:'My manager usually ____ me feedback.', opts:['gives','is giving','gave','has given'], a:'gives', hint:'Usually → Present Simple.'},
          {q:'I always ____ in at 8:30.', opts:['badge','am badging','badged','have badged'], a:'badge', hint:'Always → Present Simple.'},
          {q:'They ____ with suppliers every month.', opts:['work','are working','worked','have worked'], a:'work', hint:'Every month → routine.'},
          {q:'She ____ on site twice a month.', opts:['go','goes','is going','went'], a:'goes', hint:'She + -s.'},
          {q:'The process ____ safe.', opts:['is','was','has been','will be'], a:'is', hint:'General truth.'}
        ],
        fill:[
          {q:'She ____ (not / work) on Sundays.', a:["doesn't work","does not work"], hint:"Negative: doesn't + base verb."},
          {q:'____ you ____ (check) supplier documents?', a:["do you check"], hint:'Question: Do + subject + base.'},
          {q:'He ____ (not / like) delays.', a:["doesn't like","does not like"], hint:"He → doesn't + base."},
          {q:'What time ____ the meeting ____ (start)?', a:["does the meeting start","what time does the meeting start"], hint:'Does + subject + base.'}
        ],
        order:[
          {q:'Put the question in order:', words:['you','do','work','where','?'], answer:'where do you work?', hint:'Question word + do + subject + verb.'},
          {q:'Put in order:', words:['does','he','work','in','quality','?'], answer:'does he work in quality?', hint:'Does + he + work…'},
          {q:'Put in order:', words:['often','do','you','visit','suppliers','?'], answer:'do you often visit suppliers?', hint:'Do + you + often + verb.'}
        ]
      }
    },

    {
      id:'pc', icon:'🟠', name:'Present Continuous', levels:['A1','A2','B1'],
      when:['now / in progress','temporary situation (this week)','future arrangement (A2+)'],
      keywords:['now','right now','today','this week','currently','at the moment','tomorrow (arrangement)'],
      form:{aff:'am/is/are + V‑ing',neg:'am not / isn’t / aren’t + V‑ing',ques:'Am/Is/Are + subject + V‑ing?'},
      examples:['I am inspecting the parts right now.','They are working on a prototype this week.','I’m meeting the supplier tomorrow at 2.'],
      practice:{
        mcq:[
          {q:'Right now, I ____ the parts.', opts:['inspect','am inspecting','inspected','have inspected'], a:'am inspecting', hint:'Right now → be + -ing.'},
          {q:'This week, we ____ on a new process.', opts:['work','are working','worked','have worked'], a:'are working', hint:'Temporary → Present Continuous.'},
          {q:'At the moment, the supplier ____ the tests.', opts:['runs','is running','ran','has run'], a:'is running', hint:'At the moment → -ing.'},
          {q:'We ____ the prototype this afternoon (arrangement).', opts:['test','are testing','tested','have tested'], a:'are testing', hint:'Arrangement → present continuous.'},
          {q:'She ____ with a technician right now.', opts:['speaks','is speaking','spoke','has spoken'], a:'is speaking', hint:'Right now.'}
        ],
        fill:[
          {q:'He ____ (not / call) the supplier right now.', a:["isn't calling","is not calling"], hint:'is not + calling.'},
          {q:'____ they ____ (test) the prototype at the moment?', a:["are they testing"], hint:'Are + subject + testing?' },
          {q:'I ____ (work) on a corrective action plan today.', a:["am working","i am working"], hint:'am + working.'}
        ],
        order:[
          {q:'Put in order:', words:['are','you','doing','what','now','?'], answer:'what are you doing now?', hint:'What + are + you + doing…'},
          {q:'Put in order:', words:['i','am','meeting','them','tomorrow','.'], answer:'i am meeting them tomorrow.', hint:'Arrangement: am/is/are + -ing.'}
        ]
      }
    },

    {
      id:'past', icon:'🔵', name:'Past Simple', levels:['A1','A2','B1'],
      when:['finished time in the past','completed action','sequence in the past'],
      keywords:['yesterday','last week','two days ago','then','after that','on Monday'],
      form:{aff:'V2 / -ed',neg:"didn't + base verb",ques:'Did + subject + base verb?'},
      examples:['Yesterday, I called the supplier.','We visited the site last week.','Then we wrote a short report.'],
      practice:{
        mcq:[
          {q:'Yesterday, we ____ on site.', opts:['are','were','have been','will be'], a:'were', hint:'Yesterday → Past Simple.'},
          {q:'Last week, I ____ the report.', opts:['finish','finished','have finished','am finishing'], a:'finished', hint:'Last week.'},
          {q:'Two days ago, the supplier ____ the file.', opts:['sends','sent','has sent','is sending'], a:'sent', hint:'Ago → past.'},
          {q:'Then, I ____ a follow‑up email.', opts:['write','wrote','have written','am writing'], a:'wrote', hint:'Sequence.'}
        ],
        fill:[
          {q:'She ____ (not / send) the email yesterday.', a:["didn't send","did not send"], hint:"didn't + base verb."},
          {q:'____ you ____ (meet) the supplier last Friday?', a:["did you meet"], hint:'Did + subject + base verb.'},
          {q:'What time ____ you ____ (arrive) yesterday?', a:["did you arrive","what time did you arrive"], hint:'Did + you + arrive?' }
        ],
        order:[
          {q:'Put in order:', words:['did','you','call','when','the','supplier','?'], answer:'when did you call the supplier?', hint:'When + did + you + call…'},
          {q:'Put in order:', words:['yesterday','i','sent','the','report','.'], answer:'i sent the report yesterday.', hint:'Subject + verb + object + time.'}
        ]
      }
    },

    {
      id:'pcont', icon:'🟤', name:'Past Continuous', levels:['A2','B1'],
      when:['action in progress in the past','background action + interruption'],
      keywords:['while','when','at 5pm','at that moment','during the meeting'],
      form:{aff:'was/were + V‑ing',neg:"wasn't/weren't + V‑ing",ques:'Was/Were + subject + V‑ing?'},
      examples:['At 5pm yesterday, I was working.','I was inspecting parts when the supplier called.'],
      practice:{
        mcq:[
          {q:'At 3pm yesterday, I ____ a test.', opts:['ran','was running','have run','am running'], a:'was running', hint:'At 3pm yesterday → was/were + -ing.'},
          {q:'While we ____ the parts, the phone rang.', opts:['inspected','were inspecting','have inspected','inspect'], a:'were inspecting', hint:'While → past continuous.'}
        ],
        fill:[
          {q:'I ____ (inspect) parts when the supplier called.', a:["was inspecting","i was inspecting"], hint:'was + -ing + when…'},
          {q:'____ he ____ (drive) to the site at 9am?', a:["was he driving"], hint:'Was + he + driving?'}
        ],
        order:[
          {q:'Put in order:', words:['i','was','checking','emails','when','he','called','.'], answer:'i was checking emails when he called.', hint:'Was + -ing + when + past.'}
        ]
      }
    },

    {
      id:'pp', icon:'🟣', name:'Present Perfect', levels:['A2','B1'],
      when:['result now (no finished time)','experience (ever/never)','unfinished time period (this week/today)'],
      keywords:['already','yet','just','ever','never','since','for','this week','today','so far'],
      form:{aff:'have/has + V3',neg:"haven't/hasn't + V3",ques:'Have/Has + subject + V3?'},
      examples:['I have finished the report.','Have you ever visited the site?','We haven’t received the document yet.'],
      practice:{
        mcq:[
          {q:'I ____ the report. You can read it now.', opts:['finished','have finished','am finishing','finish'], a:'have finished', hint:'Result now → Present Perfect.'},
          {q:'We haven’t received the document ____.', opts:['yesterday','yet','last week','ago'], a:'yet', hint:'yet + present perfect negative.'},
          {q:'She has ____ sent the file.', opts:['already','yesterday','ago','last'], a:'already', hint:'already + present perfect.'},
          {q:'So far, we ____ two tests.', opts:['run','ran','have run','are running'], a:'have run', hint:'So far → present perfect.'}
        ],
        fill:[
          {q:'____ you ever ____ (work) with this supplier?', a:["have you ever worked"], hint:'Have + you + worked.'},
          {q:'We ____ (not / receive) the report yet.', a:["haven't received","have not received"], hint:'have not + V3.'}
        ],
        order:[
          {q:'Put in order:', words:['i','have','already','sent','it','.'], answer:'i have already sent it.', hint:'have + already + V3.'}
        ]
      }
    },

    {
      id:'future', icon:'🟡', name:'Future (will / going to / arrangement)', levels:['A1','A2','B1'],
      when:['will: decision now / promise / prediction','going to: plan already decided','present continuous: fixed arrangement (A2+)'],
      keywords:['tomorrow','next week','soon','I think','probably','plan','decide now'],
      form:{aff:'will + base • be going to + base • am/is/are + V‑ing',neg:"won't + base • not going to + base • not + V‑ing",ques:'Will + subject + base? • Are you going to…?'},
      examples:['No problem — I will send it today.','We are going to visit the supplier next week.','I’m meeting the supplier tomorrow at 2.'],
      practice:{
        mcq:[
          {q:'I think it ____ rain tomorrow.', opts:['will','am','did','have'], a:'will', hint:'Prediction → will.'},
          {q:'We ____ visit the supplier next week. It’s planned.', opts:['will','are going to','have','were'], a:'are going to', hint:'Plan → going to.'},
          {q:'I ____ the supplier at 14:00. It’s in my calendar.', opts:['meet','am meeting','met','have met'], a:'am meeting', hint:'Arrangement → present continuous.'},
          {q:'Don’t worry — I ____ call them now.', opts:['will','am going to','am calling','called'], a:'will', hint:'Decision now → will.'}
        ],
        fill:[
          {q:'I ____ (send) it this afternoon, I promise.', a:["will send","i will send"], hint:'Promise → will.'},
          {q:'We ____ (meet) them tomorrow at 2 (calendar).', a:["are meeting","we are meeting"], hint:'Fixed plan → present continuous.'}
        ],
        order:[
          {q:'Put in order:', words:['are','you','going','to','visit','them','next','week','?'], answer:'are you going to visit them next week?', hint:'Are you going to…?'}
        ]
      }
    },

    // Conditional (A2 polite + B1 hypothetical)
    // Conditional (A1 polite wish + A2 polite requests + B1 hypothetical)
    {
      id:'cond', icon:'🌦️', name:'Conditional (would)', levels:['A1','A2','B1'],
      when:[
        'A1: polite wish (would like)',
        'A2: polite requests / soft language (would you…? / could you…?)',
        'B1: hypothetical planning (If + past, would + base)'
      ],
      keywords:['would like','would you…?','could you…?','if','what if','otherwise','if I were'],
      form:{
        aff:'A1: I would like… • A2: Would you…? / I would appreciate… • B1: If + past, would + base',
        neg:"A1/A2: I wouldn't… / I would not… • B1: If + past, wouldn't + base",
        ques:'A2: Would you…? / Could you…? • B1: What would you do if…?'
      },
      examples:[
        'A1: I would like a coffee, please.',
        'A2: Would you please send the test results?',
        'B1: If the supplier was late, I would ask for an update.'
      ],
      practice:{
        mcq:[
          {min:'A1', q:'I ____ like a coffee, please.', opts:['would','will','am','did'], a:'would', hint:'Polite wish: would like.'},
          {min:'A1', q:'I would like ____ meet you.', opts:['to','-','at','for'], a:'to', hint:'would like + to + verb.'},

          {min:'A2', q:'____ you please send the test results?', opts:['Would','Do','Did','Have'], a:'Would', hint:'Polite request → Would you…?'},
          {min:'A2', q:'I ____ like to schedule a short meeting.', opts:['would','will','am','did'], a:'would', hint:'Would like = polite.'},
          {min:'A2', q:'Could you ____ the document today?', opts:['send','sent','sending','sends'], a:'send', hint:'Could + base verb.'},

          {min:'B1', q:'If the supplier ____ late, I ____ ask for an update.', opts:['is / will','was / would','was / will','were / will'], a:'was / would', hint:'Hypothetical → If + past, would + base.'},
          {min:'B1', q:'What ____ you do if the test failed?', opts:['will','would','do','did'], a:'would', hint:'Hypothetical question → would.'},
          {min:'B1', q:'If I ____ you, I would email them.', opts:['am','were','was','be'], a:'were', hint:'If I were you…'}
        ],
        fill:[
          {min:'A1', q:'I would like ____ (have) a call.', a:["to have"], hint:'would like + to + verb.'},
          {min:'A2', q:'Would you ____ (send) the test results today?', a:["send"], hint:'Would + base verb.'},
          {min:'A2', q:'I would like ____ (schedule) a call.', a:["to schedule"], hint:'would like + to + verb.'},
          {min:'B1', q:'If we ____ (have) more time, we ____ (visit) the site.', a:["if we had more time, we would visit the site","if we had more time we would visit the site"], hint:'If + had, would + visit.'}
        ],
        order:[
          {min:'A1', q:'Put in order:', words:['i','would','like','a','coffee','.'], answer:'i would like a coffee.', hint:'Polite wish.'},
          {min:'A2', q:'Put in order:', words:['would','you','please','send','it','today','?'], answer:'would you please send it today?', hint:'Polite request.'},
          {min:'B1', q:'Put in order:', words:['what','would','you','do','if','it','failed','?'], answer:'what would you do if it failed?', hint:'Hypothetical question.'}
        ]
      }
    }
  ];

  function tensesForLevel(level){ return TENSES.filter(t => t.levels.includes(level)); }
  function prettyName(name){ return name.startsWith('Future') ? 'Future' : name; }

  function renderNav(list){
    const nav = $('#navTop');
    nav.innerHTML='';
    list.forEach(t=>{
      const a=document.createElement('a');
      a.href = `#t-${t.id}`;
      a.dataset.tense = t.id;
      a.innerHTML = `<span>${esc(t.icon)} ${esc(prettyName(t.name))}</span><span class="tag">${esc(state.level)}</span>`;
      a.addEventListener('click', (e)=>{ e.preventDefault(); openTense(t.id); });
      nav.appendChild(a);
    });
    const a2=document.createElement('a');
    a2.href='#decoder';
    a2.addEventListener('click', (e)=>{ e.preventDefault(); document.getElementById('decoder').scrollIntoView({behavior:'smooth'}); });
    a2.innerHTML = `<span>🎯 Mini Decoder</span><span class="tag">fast</span>`;
    nav.appendChild(a2);

    const a3=document.createElement('a');
    a3.href='#mission';
    a3.addEventListener('click', (e)=>{ e.preventDefault(); document.getElementById('mission').scrollIntoView({behavior:'smooth'}); });
    a3.innerHTML = `<span>✉️🗣️ Mission</span><span class="tag">model</span>`;
    nav.appendChild(a3);

    const a4=document.createElement('a');
    a4.href='#finale';
    a4.addEventListener('click', (e)=>{ e.preventDefault(); document.getElementById('finale').scrollIntoView({behavior:'smooth'}); });
    a4.innerHTML = `<span>🏁 Finale (Mixed)</span><span class="tag">20</span>`;
    nav.appendChild(a4);
  }


  function openTense(id){
    const sec = document.getElementById(`t-${id}`);
    if(!sec) return;
    // Open accordion body
    const head = sec.querySelector('.acc__head');
    const body = sec.querySelector('.acc__body');
    if(body && body.hidden){
      body.hidden = false;
      if(head) head.setAttribute('aria-expanded','true');
    }
    // Highlight in map
    $$('#navTop a').forEach(a=>a.classList.remove('active'));
    const link = document.querySelector(`#navTop a[data-tense="${id}"]`);
    if(link) link.classList.add('active');

    // Scroll to tense
    sec.scrollIntoView({behavior:'smooth', block:'start'});
  }
  function renderTenses(list){
    const root = $('#tenseList');
    root.innerHTML='';

    list.forEach(t=>{
      const sec=document.createElement('section');
      sec.className='accordion';
      sec.id=`t-${t.id}`;

      const m = state.mastery[t.id];
      const mastery = (m && m.a) ? `${Math.round(m.c/m.a*100)}%` : '—';

      sec.innerHTML = `
        <div class="acc__head" role="button" tabindex="0" aria-expanded="false">
          <div style="display:flex; gap:12px; align-items:center;">
            <div class="acc__icon" aria-hidden="true">${esc(t.icon)}</div>
            <div>
              <div class="acc__title">${esc(prettyName(t.name))}</div>
              <div class="muted small">${esc(t.when[0]||'')}</div>
            </div>
          </div>
          <div class="acc__meta">
            <span class="pill2">Level: ${esc(t.levels.join(' / '))}</span>
            <span class="pill2">Mastery: ${esc(mastery)}</span>
            <span class="pill2">Keywords: ${esc(t.keywords.slice(0,4).join(', '))}${t.keywords.length>4?'…':''}</span>
          </div>
        </div>
        <div class="acc__body" hidden>
          <div class="grid2">
            <div class="card" style="padding:12px">
              <div class="row">
                <h3 style="margin:0">Cheat sheet</h3>
                <div class="btnrow">
                  <button class="btn btn--ghost" type="button" data-action="newSet">New set</button>
                  <button class="btn btn--ghost" type="button" data-action="hint">💡 Hint</button>
                  <button class="btn btn--ghost" type="button" data-action="reset">Reset</button>
                </div>
              </div>

              <div class="note">
                <div class="label">When to use</div>
                <ul class="muted">${t.when.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
              </div>

              <div class="note">
                <div class="label">Keywords / time signals</div>
                <div class="klist">${t.keywords.map(k=>`<span class="k">${esc(k)}</span>`).join('')}</div>
              </div>

              <div class="note">
                <div class="label">Form recipe (affirmative / negative / question)</div>
                <div class="formGrid">
                  <div class="formRow"><strong>✅ Affirmative</strong><div>${esc(t.form.aff)}</div></div>
                  <div class="formRow"><strong>🚫 Negative</strong><div>${esc(t.form.neg)}</div></div>
                  <div class="formRow"><strong>❓ Question</strong><div>${esc(t.form.ques)}</div></div>
                </div>
                <div class="example" style="margin-top:10px">
                  <div class="label">Examples</div>
                  ${t.examples.map(ex=>`<div>• <code>${esc(ex)}</code></div>`).join('')}
                </div>
              </div>
            </div>

            <div class="card" style="padding:12px">
              <h3 style="margin:0 0 8px">Practice</h3>

              <div class="tabs" role="tablist">
                <button class="tab" role="tab" aria-selected="true" data-tab="mcq">🧠 Choose</button>
                <button class="tab" role="tab" aria-selected="false" data-tab="fill">✍️ Fill</button>
                <button class="tab" role="tab" aria-selected="false" data-tab="order">🧩 Order</button>
              </div>

              <div class="tabpan" data-pan="mcq"></div>
              <div class="tabpan" data-pan="fill" hidden></div>
              <div class="tabpan" data-pan="order" hidden></div>

              <div class="result" data-result>Try without “Show” first 🙂</div>
            </div>
          </div>
        </div>
      `;
      root.appendChild(sec);

      // Accordion
      const head=$('.acc__head', sec);
      const body=$('.acc__body', sec);
      const toggle=()=>{
        const open = !body.hidden;
        body.hidden = open;
        head.setAttribute('aria-expanded', String(!open));
      };
      head.addEventListener('click', toggle);
      head.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggle(); } });

      // Tabs
      const tabs = $$('.tab', sec);
      const pans = $$('[data-pan]', sec);
      tabs.forEach(tab=>{
        tab.addEventListener('click', ()=>{
          tabs.forEach(x=>x.setAttribute('aria-selected','false'));
          tab.setAttribute('aria-selected','true');
          const key=tab.dataset.tab;
          pans.forEach(p=>p.hidden=(p.dataset.pan!==key));
        });
      });

      const resultEl = $('[data-result]', sec);

      function refreshMastery(){
        const m = state.mastery[t.id];
        const pill = $$('.pill2', sec).find(p=>p.textContent.startsWith('Mastery:'));
        if(pill){
          pill.textContent = `Mastery: ${(m && m.a) ? Math.round(m.c/m.a*100)+'%' : '—'}`;
        }
        updateHUD();
      }

      function filterByLevel(arr){ return (arr||[]).filter(it => canUse(it.min)); }

      function renderMCQ(items){
        const pan = $('[data-pan="mcq"]', sec);
        pan.innerHTML='';
        items.forEach((it, i)=>{
          const q=document.createElement('div');
          q.className='q';
          q.innerHTML=`
            <div class="q__head">
              <div class="q__title">${esc(t.icon)} Q${i+1}: ${esc(it.q)}</div>
              <div class="q__hint">${esc(it.hint||'')}</div>
            </div>
            <div class="choices"></div>
            <div class="inlineActions">
              <button class="btn btn--ghost" type="button" data-show>Show answer</button>
            </div>
          `;
          const choices = $('.choices', q);
          const btnShow = $('[data-show]', q);
          btnShow.addEventListener('click', ()=> setResult(resultEl,'hint', `✅ Answer: <strong>${esc(it.a)}</strong>`));

          shuffle(it.opts).forEach(opt=>{
            const b=document.createElement('button');
            b.type='button';
            b.className='choice';
            b.textContent=opt;
            b.addEventListener('click', ()=>{
              const ok = (opt===it.a);
              if(ok){
                $$('.choice', q).forEach(x=>x.disabled=true);
                setResult(resultEl,'good', `✅ Correct! <strong>${esc(it.hint||'')}</strong>`);
                bump(1); track(t.id,true);
              }else{
                b.disabled=true;
                setResult(resultEl,'bad', `❌ Not yet. Hint: <strong>${esc(it.hint||'')}</strong> <span class="muted">(Use “Show answer” only if needed.)</span>`);
                bump(-1); track(t.id,false);
              }
              refreshMastery();
            });
            choices.appendChild(b);
          });

          pan.appendChild(q);
        });
      }

      function renderFill(items){
        const pan = $('[data-pan="fill"]', sec);
        pan.innerHTML='';
        items.forEach((it, i)=>{
          const q=document.createElement('div');
          q.className='q';
          q.innerHTML=`
            <div class="q__head">
              <div class="q__title">${esc(t.icon)} Q${i+1}: ${esc(it.q)}</div>
              <div class="q__hint">${esc(it.hint||'')}</div>
            </div>
            <div class="inputRow">
              <input class="textIn" placeholder="Type your answer…" autocomplete="off" />
              <button class="btn" type="button">Check</button>
              <button class="btn btn--ghost" type="button">Show</button>
            </div>
          `;
          const input=$('.textIn', q);
          const btnCheck=$$('.btn', q)[0];
          const btnShow=$$('.btn', q)[1];
          const accepted=(it.a||[]).map(norm);

          const check=()=>{
            const val=norm(input.value);
            const ok=accepted.includes(val);
            if(ok){
              setResult(resultEl,'good', `✅ Correct! <strong>${esc(it.hint||'')}</strong>`);
              bump(2); track(t.id,true);
            }else{
              setResult(resultEl,'bad', `❌ Not yet. Hint: <strong>${esc(it.hint||'')}</strong> <span class="muted">(Use “Show” only if needed.)</span>`);
              bump(-1); track(t.id,false);
            }
            refreshMastery();
          };
          btnCheck.addEventListener('click', check);
          input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') check(); });
          btnShow.addEventListener('click', ()=> setResult(resultEl,'hint', `✅ Example answer: <strong>${esc(it.a[0])}</strong>`));
          pan.appendChild(q);
        });
      }

      function renderOrder(it){
        const pan = $('[data-pan="order"]', sec);
        pan.innerHTML='';
        clearTap();

        const q=document.createElement('div');
        q.className='q';
        q.innerHTML=`
          <div class="q__head">
            <div class="q__title">${esc(t.icon)} ${esc(it.q)}</div>
            <div class="q__hint">${esc(it.hint||'')}</div>
          </div>
          <div class="muted small">Tap a word → tap a slot (or drag). Answers appear only if you click “Show”.</div>
          <div class="bank" data-bank></div>
          <div class="targets" data-slots></div>
          <div class="inlineActions">
            <button class="btn" type="button">Check</button>
            <button class="btn btn--ghost" type="button">Reset</button>
            <button class="btn btn--ghost" type="button">💡 Hint</button>
            <button class="btn btn--ghost" type="button">Show</button>
          </div>
        `;

        const bank=$('[data-bank]', q);
        const slots=$('[data-slots]', q);
        const btns=$$('.inlineActions .btn', q);
        const btnCheck=btns[0], btnReset=btns[1], btnHint=btns[2], btnShow=btns[3];

        const words=it.words.slice();
        const answer=it.answer;

        shuffle(words).forEach((w, idx)=> bank.appendChild(makeTile({id:String(idx),label:w,emoji:'🧩'})));

        const slotEls=[];
        for(let i=0;i<words.length;i++){
          const slot=makeSlot({
            index:i,
            label:`${i+1}`,
            onDrop:(id, wrap)=>{
              const tile=bank.querySelector(`.tile[data-id="${id}"]`);
              if(!tile) return;
              $('[data-slottext]', wrap).textContent=tile.dataset.label;
              wrap.dataset.placed=tile.dataset.label;
              tile.disabled=true;
            }
          });
          slots.appendChild(slot);
          slotEls.push(slot);
        }

        const reset=()=> renderOrder(it);

        const check=()=>{
          const placed=slotEls.map(s=>s.dataset.placed||'').join(' ');
          const cleaned=norm(placed).replace(' ?', '?');
          const ok = cleaned===norm(answer);
          if(ok){
            slotEls.forEach(s=>{ s.classList.remove('bad'); s.classList.add('good'); });
            setResult(resultEl,'good', `✅ Perfect word order! <strong>${esc(it.hint||'')}</strong>`);
            bump(2); track(t.id,true);
          }else{
            slotEls.forEach(s=>{ s.classList.remove('good'); if(s.dataset.placed) s.classList.add('bad'); });
            setResult(resultEl,'bad', `❌ Not yet. Hint: <strong>${esc(it.hint||'')}</strong>`);
            bump(-1); track(t.id,false);
          }
          refreshMastery();
        };

        btnCheck.addEventListener('click', check);
        btnReset.addEventListener('click', reset);
        btnHint.addEventListener('click', ()=> setResult(resultEl,'hint', `💡 ${esc(it.hint||'')}`));
        btnShow.addEventListener('click', ()=> setResult(resultEl,'hint', `✅ Example answer: <strong>${esc(answer)}</strong>`));

        pan.appendChild(q);
      }

      const btnNewSet = $('[data-action="newSet"]', sec);
      const btnHint = $('[data-action="hint"]', sec);
      const btnReset = $('[data-action="reset"]', sec);

      const newSet = ()=>{
        const mcq = sample(filterByLevel(t.practice.mcq), 5);
        const fill = sample(filterByLevel(t.practice.fill), 4);
        const orders = filterByLevel(t.practice.order);
        const order = orders.length ? pick(orders) : null;
        renderMCQ(mcq);
        renderFill(fill);
        if(order) renderOrder(order);
        setResult(resultEl,'', 'New set loaded. Try without “Show” first 🙂');
      };

      btnNewSet?.addEventListener('click', newSet);
      btnReset?.addEventListener('click', ()=>{ newSet(); setResult(resultEl,'', 'Reset done.'); });
      btnHint?.addEventListener('click', ()=> setResult(resultEl,'hint', `💡 Keywords: <strong>${esc(t.keywords.slice(0,10).join(', '))}${t.keywords.length>10?'…':''}</strong><br>Form: <strong>${esc(t.form.aff)}</strong>`));

      newSet();
    });
  }

  function applySearch(q, list){
    const val = norm(q);
    if(!val){
      setText($('#tipBox'), 'Search a keyword to highlight matching tenses.');
      $$('.accordion').forEach(a=>a.style.opacity='1');
      return;
    }
    const hits=[];
    list.forEach(t=>{
      const bag = `${t.name} ${(t.when||[]).join(' ')} ${(t.keywords||[]).join(' ')}`;
      const ok = norm(bag).includes(val);
      const el = $(`#t-${t.id}`);
      if(el) el.style.opacity = ok ? '1' : '.35';
      if(ok) hits.push(prettyName(t.name));
    });
    setText($('#tipBox'), hits.length ? `Matches: ${hits.join(', ')}` : 'No match. Try “yesterday”, “already”, “now”…');
  }

  // Mini decoder
  function buildMiniPool(list){
    const pool=[];
    const add=(id,prompt,answer,hint)=>pool.push({id,prompt,answer,hint});

    add('ps','Every day, I ____ emails before the meeting.','Present Simple','Routine signal: every day.');
    add('pc','Right now, I ____ a call with the supplier.','Present Continuous','Right now → be + -ing.');
    add('past','Yesterday, we ____ the site.','Past Simple','Yesterday = finished past.');
    add('future','No worries — I ____ send it today.','Future','Decision now → will.');
    if(list.find(t=>t.id==='pp')) add('pp','We haven’t received it ____.','Present Perfect','yet + present perfect negative.');
    if(list.find(t=>t.id==='cond')){
      add('cond','____ you please send the report?','Conditional (would)','Polite request: Would you…?');
      if(state.level==='B1') add('cond','If the test failed, I ____ escalate.','Conditional (would)','Hypothetical: would.');
    }
    const ids = new Set(list.map(t=>t.id));
    return pool.filter(p=>ids.has(p.id));
  }

  function renderMini(list){
    const pool = buildMiniPool(list);
    const promptEl = $('#miniPrompt');
    const choicesEl = $('#miniChoices');
    const resEl = $('#miniResult');

    function options(){
      const names = list.map(t=>prettyName(t.name));
      const uniq=[];
      names.forEach(n=>{ if(!uniq.includes(n)) uniq.push(n); });
      return uniq;
    }

    function newQ(){
      state.mini = pick(pool);
      setText(promptEl, state.mini.prompt);
      choicesEl.innerHTML='';

      let opts = shuffle(options()).slice(0,5);
      if(!opts.includes(state.mini.answer)) opts = shuffle(opts.slice(0,4).concat([state.mini.answer]));
      opts.forEach(opt=>{
        const b=document.createElement('button');
        b.type='button';
        b.className='choice';
        b.textContent=opt;
        b.addEventListener('click', ()=>{
          const ok = (opt===state.mini.answer);
          if(ok){
            setResult(resEl,'good', `✅ Correct! ${esc(state.mini.hint)}`);
            bump(1);
            $$('.choice', choicesEl).forEach(x=>x.disabled=true);
          }else{
            b.disabled=true;
            setResult(resEl,'bad', `❌ Not yet. Hint: <strong>${esc(state.mini.hint)}</strong>`);
            bump(-1);
          }
        });
        choicesEl.appendChild(b);
      });

      setResult(resEl,'', 'Choose the tense.');
    }

    $('#btnMiniNew').onclick = newQ;
    $('#btnMiniHint').onclick = ()=> setResult(resEl,'hint', `💡 ${esc(state.mini ? state.mini.hint : 'Click New first.')}`);
    newQ();
  }

  // Mission (more scenarios)
  const writingScenarios = [
    {tag:'Documents', who:'a supplier', goal:'request test results and a quick report', details:'You have finished your internal report and need the data.'},
    {tag:'Follow‑up', who:'a supplier', goal:'ask for an update and confirm the deadline', details:'The delivery is late and you need a new date.'},
    {tag:'Reminder', who:'a supplier', goal:'send a polite reminder about missing documents', details:'You need the file by the end of the day.'},
    {tag:'Quality', who:'a supplier', goal:'request a corrective action plan (CAPA) and a timeline', details:'A defect was found on a part.'},
    {tag:'Phone recap', who:'a supplier', goal:'summarize a phone call and confirm what you agreed', details:'Confirm actions + owners + dates.'},
    {tag:'Site visit', who:'a colleague', goal:'summarize yesterday’s site visit and next actions', details:'You inspected parts and spoke with a technician.'},
    {tag:'Escalation', who:'a manager', goal:'escalate a critical issue with clear impact', details:'A shipment issue is blocking production.'},
    {tag:'Request photos', who:'a supplier', goal:'request photos of the defect and measurement results', details:'You need evidence for your file.'},
    {tag:'New test', who:'a supplier', goal:'request a re-test and an updated report', details:'The first test result is not acceptable.'},
    {tag:'Appointment', who:'a supplier', goal:'confirm a site visit date and agenda', details:'You will visit next week.'},
    {tag:'Risk note', who:'your team', goal:'summarize a risk and propose mitigation', details:'At B1 add “If…, we would…”'}
  ];

  const speakingScenarios = [
    {tag:'Daily routine', prompts:['Describe a typical morning at work.','Mention the time you arrive and what you do first.','Use Present Simple + first/then.']},
    {tag:'Right now', prompts:['Explain what you are doing right now.','Add one detail about a temporary task this week.','Use Present Continuous.']},
    {tag:'Past day', prompts:['Describe what you did yesterday.','Add a sequence: first → then → finally.','Use Past Simple.']},
    {tag:'Experience', prompts:['Explain what you have done so far on a project.','Use already / yet / since / for.','Use Present Perfect.']},
    {tag:'Future plan', prompts:['Describe what you are going to do next week.','Add one promise with will.','Use Future.']},
    {tag:'What‑if (B1)', prompts:['Imagine a test fails tomorrow. What would you do?','Propose two actions and a backup plan.','Use If…, I would… (Conditional).']}
  ];

  function newMissionScenario(){
    const w = pick(writingScenarios);
    const s = pick(speakingScenarios);

    // If not B1, avoid the B1-only speaking scenario
    const finalS = (state.level==='B1') ? s : (s.tag.includes('(B1)') ? pick(speakingScenarios.filter(x=>!x.tag.includes('(B1)'))) : s);

    state.mission = {w, s: finalS};
    $('#missionEmail').value = '';
    setText($('#missionScenario'), `${w.tag}: Write to ${w.who} to ${w.goal}. (${w.details})`);
    const ul = $('#speakPrompts');
    ul.innerHTML='';
    finalS.prompts.forEach(p=>{
      const li=document.createElement('li');
      li.textContent=p;
      ul.appendChild(li);
    });

    // Close model panels on new scenario (so user chooses to open)
    $('#modelEmailDetails').open = false;
    $('#modelSpeechDetails').open = false;
    $('#modelEmailBox').innerHTML = '';
    $('#modelSpeechBox').innerHTML = '';

    setResult($('#emailResult'), 'hint', 'New scenario loaded. Use at least 3 tenses.');
  }

  function buildModelEmail(w){
    const subjectMap = {
      'Documents':'Request for test results',
      'Follow‑up':'Follow‑up and deadline confirmation',
      'Reminder':'Reminder: missing documents',
      'Quality':'Corrective action plan (CAPA) request',
      'Phone recap':'Summary of our call and next steps',
      'Site visit':'Site visit recap and next steps',
      'Escalation':'Escalation: critical issue',
      'Request photos':'Request for photos and measurements',
      'New test':'Request for re-test and updated report',
      'Appointment':'Site visit confirmation and agenda',
      'Risk note':'Risk note and mitigation'
    };
    const subject = subjectMap[w.tag] || 'Follow‑up / Next steps';

    const purpose = (() => {
      switch(w.tag){
        case 'Documents': return 'I’m writing to request the test results and any related documents.';
        case 'Reminder': return 'I’m writing to remind you about the documents we are still missing.';
        case 'Quality': return 'I’m writing regarding a quality issue identified on the part.';
        case 'Phone recap': return 'I’m writing to summarize our phone call and confirm what we agreed.';
        case 'Site visit': return 'I’m writing to summarize the site visit and confirm the next steps.';
        case 'Escalation': return 'I’m escalating a critical issue that needs immediate attention.';
        case 'Request photos': return 'I’m writing to request additional evidence for our file.';
        case 'New test': return 'I’m writing to request a re-test and an updated report.';
        case 'Appointment': return 'I’m writing to confirm the site visit details.';
        case 'Risk note': return 'I’m writing to highlight a risk and propose mitigation actions.';
        default: return 'I’m writing to follow up and confirm the next steps.';
      }
    })();

    const request = (() => {
      switch(w.tag){
        case 'Documents': return 'Could you please send the test results and the quick report as soon as possible?';
        case 'Reminder': return 'Could you please send the missing documents today?';
        case 'Quality': return 'Could you please send your corrective action plan (CAPA) with a clear timeline?';
        case 'Phone recap': return 'Please confirm that the summary below is correct and that you agree with the dates.';
        case 'Site visit': return 'Please confirm the actions, owners, and dates for the next steps.';
        case 'Escalation': return 'Please treat this issue as a priority and confirm your immediate actions.';
        case 'Request photos': return 'Could you please send photos of the defect and the measurement results?';
        case 'New test': return 'Could you please run a re-test and send an updated report?';
        case 'Appointment': return 'Could you please confirm the date, time, and agenda for the site visit?';
        case 'Risk note': return (state.level==='B1')
          ? 'If the risk increases, we would need to escalate. Could you please confirm your mitigation plan?'
          : 'Could you please confirm your mitigation plan and the timeline?';
        default: return 'Could you please provide an update and confirm the next steps?';
      }
    })();

    const deadline = 'If possible, please reply by the end of the day.';
    const closing = 'Thank you in advance for your support.\nBest regards,';

    return {subject, purpose, request, deadline, closing};
  }

  function renderModelEmail(w){
    const m = buildModelEmail(w);
    const box = $('#modelEmailBox');
    if(!box) return;

    const parts = [
      {step:'Step 1 — Subject', content:`Subject: ${m.subject}`},
      {step:'Step 2 — Greeting', content:`Dear Sir or Madam,`},
      {step:'Step 3 — Purpose', content:m.purpose},
      {step:'Step 4 — Request', content:m.request},
      {step:'Step 5 — Deadline', content:m.deadline},
      {step:'Step 6 — Closing', content:m.closing}
    ];

    box.innerHTML = parts.map(p=>`
      <div class="step">${esc(p.step)}</div>
      <div class="code">${esc(p.content)}</div>
    `).join('');

    // Highlight grammar signals
    // (simple inline note)
    box.innerHTML += `
      <div class="step">Checklist</div>
      <div class="muted small">
        Use: <span class="hi">Past</span> (yesterday…), <span class="hi">Present Perfect</span> (already/yet/so far), <span class="hi">Future</span> (will/going to). 
        ${state.level==='B1' ? `Add: <span class="hi">If…, we would…</span> for a hypothetical risk.` : `At A2: use polite requests: <span class="hi">Would you…?</span>`}
      </div>
    `;
  }

  function renderModelSpeaking(){
    const box = $('#modelSpeechBox');
    if(!box) return;

    const lines = [
      {step:'Step 1 — Context (1 sentence)', text:'First, I will give the context of the project and where we are today.'},
      {step:'Step 2 — Issue + impact', text:'Then, I will explain the main issue and the impact on quality or timing.'},
      {step:'Step 3 — Actions (past)', text:'Yesterday / last week, I inspected the parts and spoke with the technician.'},
      {step:'Step 4 — Progress (present perfect)', text:'So far, I have reviewed the documents and I have sent a follow‑up email.'},
      {step:'Step 5 — Next steps (future)', text:'Next, I will contact the supplier and we are going to run a new test.'}
    ];
    if(state.level==='B1'){
      lines.push({step:'Step 6 — Hypothetical (conditional)', text:'If the test failed again, I would escalate the issue and propose a backup plan.'});
    }else{
      lines.push({step:'Step 6 — Polite close', text:'Finally, I would like to confirm the deadline and the next actions.'});
    }

    box.innerHTML = lines.map(l=>`
      <div class="step">${esc(l.step)}</div>
      <div class="code">${esc(l.text)}</div>
    `).join('');

    box.innerHTML += `
      <div class="step">Connectors to use</div>
      <div class="muted small">
        <span class="hi">First</span>, <span class="hi">then</span>, <span class="hi">after that</span>, <span class="hi">because</span>, <span class="hi">however</span>, <span class="hi">so</span>, <span class="hi">finally</span>
      </div>
    `;
  }

  function checkTenseVariety(text){
    const found = [];
    const checks = [
      {name:'Conditional (would)', re:/\bwould\b|\bwould like\b|\bwould you\b|\bcould you\b|\bif\s+\w+\s+(was|were|had)\b/i},
      {name:'Past Simple', re:/\b(yesterday|last|ago)\b|\b(didn't|did not)\b/i},
      {name:'Present Perfect', re:/\b(have|has)\s+\w+(ed|en)\b|\b(already|yet|since|for|so far|recently)\b/i},
      {name:'Future', re:/\bwill\b|\bgoing to\b|\bam meeting\b|\bare meeting\b|\bis meeting\b/i},
      {name:'Present Continuous', re:/\b(am|is|are)\s+\w+ing\b/i},
      {name:'Present Simple', re:/\b(every|usually|often|always|never|on\s+mondays)\b/i}
    ];
    checks.forEach(c=>{ if(c.re.test(text)) found.push(c.name); });
    return found;
  }

  // Finale
  function buildFinalPool(list){
    const pool=[];
    list.forEach(t=>{
      (t.practice.mcq||[]).filter(it=>canUse(it.min)).forEach(it=>pool.push({type:'mcq', tenseId:t.id, tenseName:t.name, it}));
      (t.practice.fill||[]).filter(it=>canUse(it.min)).forEach(it=>pool.push({type:'fill', tenseId:t.id, tenseName:t.name, it}));
    });
    return pool;
  }

  function renderFinal(list){
    const pool = buildFinalPool(list);
    const mix = shuffle(pool).slice(0,20);
    const root = $('#finalList');
    const resEl = $('#finalResult');
    root.innerHTML='';

    const mistakes = new Map();
    const recordMistake=(id)=>mistakes.set(id,(mistakes.get(id)||0)+1);

    let answered=0, correct=0;

    const update=()=>{
      if(answered<20){
        resEl.innerHTML = `Progress: <strong>${answered}/20</strong> • Correct: <strong>${correct}</strong>`;
        return;
      }
      const pct = Math.round(correct/20*100);
      const review = Array.from(mistakes.entries())
        .sort((a,b)=>b[1]-a[1])
        .map(([id,c])=>{
          const t = list.find(x=>x.id===id);
          return `${t ? prettyName(t.name) : id} (${c})`;
        });

      const reviewHtml = review.length
        ? `<div style="margin-top:8px"><strong>Review these tenses:</strong><ul>${review.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></div>`
        : `<div style="margin-top:8px"><strong>Excellent:</strong> no tense needs review.</div>`;

      const kind = pct>=80 ? 'good' : (pct>=60 ? 'hint' : 'bad');
      setResult(resEl, kind, `🏁 Final score: <strong>${correct}/20</strong> (${pct}%)${reviewHtml}`);
    };

    mix.forEach((q, idx)=>{
      const box=document.createElement('div');
      box.className='q';
      box.innerHTML=`
        <div class="q__head">
          <div class="q__title">Q${idx+1} • <span class="muted">${esc(prettyName(q.tenseName))}</span> — ${esc(q.it.q)}</div>
          <div class="q__hint">${esc(q.it.hint||'')}</div>
        </div>
        <div class="qa"></div>
        <div class="inlineActions">
          <button class="btn btn--ghost" type="button" data-show>Show answer</button>
        </div>
        <div class="result" data-r>Answer to see feedback.</div>
      `;
      const qa = $('.qa', box);
      const r = $('[data-r]', box);
      const btnShow = $('[data-show]', box);

      btnShow.addEventListener('click', ()=>{
        const ans = q.type==='mcq' ? q.it.a : q.it.a[0];
        setResult(r,'hint', `✅ Answer: <strong>${esc(ans)}</strong>`);
      });

      const lock=()=>{
        if(box.dataset.answered) return true;
        box.dataset.answered='1';
        answered += 1;
        update();
        return false;
      };

      if(q.type==='mcq'){
        const ch=document.createElement('div');
        ch.className='choices';
        shuffle(q.it.opts).forEach(opt=>{
          const b=document.createElement('button');
          b.type='button'; b.className='choice'; b.textContent=opt;
          b.addEventListener('click', ()=>{
            if(lock()) return;
            $$('.choice', ch).forEach(x=>x.disabled=true);
            const ok = (opt===q.it.a);
            if(ok){
              correct += 1;
              setResult(r,'good','✅ Correct!');
              bump(1); track(q.tenseId,true);
            }else{
              recordMistake(q.tenseId);
              setResult(r,'bad', `❌ Not quite. Hint: <strong>${esc(q.it.hint||'')}</strong> <span class="muted">(Use “Show answer” if needed.)</span>`);
              bump(-1); track(q.tenseId,false);
            }
            update();
          });
          ch.appendChild(b);
        });
        qa.appendChild(ch);
      }else{
        const row=document.createElement('div');
        row.className='inputRow';
        row.innerHTML = `
          <input class="textIn" placeholder="Type your answer…" autocomplete="off"/>
          <button class="btn" type="button">Check</button>
        `;
        const input=$('.textIn', row);
        const btn=$('.btn', row);
        const accepted=(q.it.a||[]).map(norm);

        btn.addEventListener('click', ()=>{
          if(lock()) return;
          const val=norm(input.value);
          const ok=accepted.includes(val);
          if(ok){
            correct += 1;
            setResult(r,'good','✅ Correct!');
            bump(2); track(q.tenseId,true);
          }else{
            recordMistake(q.tenseId);
            setResult(r,'bad', `❌ Not yet. Hint: <strong>${esc(q.it.hint||'')}</strong> <span class="muted">(Use “Show answer” if needed.)</span>`);
            bump(-1); track(q.tenseId,false);
          }
          update();
        });
        input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') btn.click(); });
        qa.appendChild(row);
      }

      root.appendChild(box);
    });

    setResult(resEl,'', `Progress: <strong>0/20</strong> • Correct: <strong>0</strong>`);
  }

  function resetAll(){
    state.score=0;
    state.streak=0;
    state.mastery={};
    clearTap();
    save();
    apply();
    toast('✅ Reset done. Scroll and choose a tense from the Map.');
  }

  function apply(){
    $('#level').value = state.level;
    $('#mode').value = state.mode;

    const list = tensesForLevel(state.level);
    renderNav(list);
    renderTenses(list);
    renderMini(list);
    renderFinal(list);

    applySearch($('#search').value, list);
    updateHUD();

    if(!state.mission) newMissionScenario();


    // Render models when the learner opens the <details> by clicking the summary (not only via toggle buttons)
    const emailDet = $('#modelEmailDetails');
    const speechDet = $('#modelSpeechDetails');
    if(emailDet && !emailDet.dataset.bound){
      emailDet.dataset.bound = '1';
      emailDet.addEventListener('toggle', ()=>{
        if(emailDet.open){
          if(!state.mission) newMissionScenario();
          renderModelEmail(state.mission.w);
        }
      });
    }
    if(speechDet && !speechDet.dataset.bound){
      speechDet.dataset.bound = '1';
      speechDet.addEventListener('toggle', ()=>{
        if(speechDet.open){
          renderModelSpeaking();
        }
      });
    }
    // Mission buttons
    $('#btnMissionNew').onclick = ()=>{
      newMissionScenario();
    };

    $('#btnModelEmail').onclick = ()=>{
      if(!state.mission) newMissionScenario();
      const det = $('#modelEmailDetails');
      det.open = !det.open;
      if(det.open){
        renderModelEmail(state.mission.w);
        det.scrollIntoView({behavior:'smooth', block:'start'});
      }
    };

    $('#btnModelSpeech').onclick = ()=>{
      const det = $('#modelSpeechDetails');
      det.open = !det.open;
      if(det.open){
        renderModelSpeaking();
        det.scrollIntoView({behavior:'smooth', block:'start'});
      }
    };

    $('#btnEmailCopy').onclick = ()=> copyText($('#missionEmail').value || '');

    $('#btnEmailCheck').onclick = ()=>{
      const text = $('#missionEmail').value || '';
      const found = checkTenseVariety(text);
      const msg = found.length
        ? `✅ Tense variety detected: <strong>${esc(found.join(', '))}</strong>`
        : '⚠️ I did not detect clear tense signals. Add: yesterday / already / next week / right now / would you… / if…, I would…';
      setResult($('#emailResult'), found.length ? 'good' : 'hint', msg);

    // If the URL has a hash like #t-ps, open that tense
    const h = (location.hash || '').replace('#','');
    if(h.startsWith('t-')){
      const id = h.slice(2);
      setTimeout(()=>openTense(id), 50);
    }
    };
  }

  function init(){
    load();

    $('#btnStart').addEventListener('click', ()=> $('#cheat').scrollIntoView({behavior:'smooth'}));
    $('#btnHow').addEventListener('click', ()=>{ const h=$('#how'); h.hidden = !h.hidden; });
    $('#btnPrint').addEventListener('click', ()=> window.print());
    $('#btnResetAll').addEventListener('click', resetAll);

    $('#level').addEventListener('change', (e)=>{ state.level=e.target.value; save(); state.mission=null; apply(); });
    $('#mode').addEventListener('change', (e)=>{ state.mode=e.target.value; save(); apply(); });
    $('#search').addEventListener('input', (e)=> applySearch(e.target.value, tensesForLevel(state.level)));

    $('#btnFinalNew').addEventListener('click', ()=>{ renderFinal(tensesForLevel(state.level)); });
    $('#btnFinalReset').addEventListener('click', ()=>{ renderFinal(tensesForLevel(state.level)); });

    // Safety: if /*modal*/ ever gets stuck, clicking background closes it
    // and user can run window.__closeModal() from console.
    apply();
  }

  window.addEventListener('DOMContentLoaded', init);
})();