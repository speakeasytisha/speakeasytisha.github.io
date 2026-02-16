/* SpeakEasyTisha • Future Tenses Power Lesson (v2)
   Fixes:
   - Reset no longer breaks Core cards
   - Will vs Going to + Mini test now give instant correct/wrong + hint
*/
(() => {
  'use strict';

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const esc = (s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));

  // ---------------------------
  // Conjugation helpers
  // ---------------------------
  const IRREG = {
    be:{past:'was', pp:'been'},
    have:{past:'had', pp:'had'},
    do:{past:'did', pp:'done'},
    go:{past:'went', pp:'gone'},
    eat:{past:'ate', pp:'eaten'},
    meet:{past:'met', pp:'met'},
    see:{past:'saw', pp:'seen'},
    come:{past:'came', pp:'come'},
    take:{past:'took', pp:'taken'},
    make:{past:'made', pp:'made'},
    get:{past:'got', pp:'gotten'},
    give:{past:'gave', pp:'given'},
    say:{past:'said', pp:'said'},
    buy:{past:'bought', pp:'bought'},
    bring:{past:'brought', pp:'brought'},
    think:{past:'thought', pp:'thought'},
    teach:{past:'taught', pp:'taught'},
    write:{past:'wrote', pp:'written'},
    read:{past:'read', pp:'read'},
    leave:{past:'left', pp:'left'},
    begin:{past:'began', pp:'begun'}
  };
  const VOWELS = new Set(['a','e','i','o','u']);
  function isConsonant(ch){ return /[a-z]/i.test(ch||'') && !VOWELS.has(String(ch).toLowerCase()); }
  function isVowel(ch){ return VOWELS.has(String(ch||'').toLowerCase()); }
  function isCVC(verb){
    const v = String(verb||'').toLowerCase();
    if (v.length < 3) return false;
    const a=v[v.length-3], b=v[v.length-2], c=v[v.length-1];
    if (!isConsonant(a) || !isVowel(b) || !isConsonant(c)) return false;
    if (['w','x','y'].includes(c)) return false;
    return true;
  }
  function pastForm(verb){
    const raw = String(verb||'');
    const v = raw.toLowerCase();
    if (IRREG[v]) return IRREG[v].past;
    if (v.endsWith('e')) return raw + 'd';
    if (v.endsWith('y') && raw.length>1 && isConsonant(v[v.length-2])) return raw.slice(0,-1) + 'ied';
    if (v.endsWith('c')) return raw + 'ked';
    if (isCVC(v)) return raw + raw[raw.length-1] + 'ed';
    return raw + 'ed';
  }
  function ppForm(verb){
    const raw = String(verb||'');
    const v = raw.toLowerCase();
    if (IRREG[v]) return IRREG[v].pp;
    return pastForm(raw);
  }
  function ingForm(verb){
    const raw = String(verb||'');
    const v = raw.toLowerCase();
    if (v.endsWith('ie')) return raw.slice(0,-2) + 'ying';
    if (v.endsWith('e') && !v.endsWith('ee')) return raw.slice(0,-1) + 'ing';
    if (isCVC(v)) return raw + raw[raw.length-1] + 'ing';
    return raw + 'ing';
  }

  // ---------------------------
  // Progress (simple)
  // ---------------------------
  const KEY = 'SET_future_tenses_v2';
  const state = { voice:'US', score:0, max: 100, done:{} };

  function load(){
    try{ Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); }catch{}
    if (!state.max) state.max = 100;
  }
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }

  function setScoreUI(){
    $('#score').textContent = String(state.score || 0);
    const pct = state.max ? (state.score / state.max) * 100 : 0;
    $('#bar').style.width = clamp(pct, 0, 100).toFixed(1) + '%';
  }
  function award(id, pts){
    if (state.done[id]) return;
    state.done[id] = true;
    state.score += pts;
    save(); setScoreUI();
  }
  function setPill(el, text, kind=''){
    if (!el) return;
    el.textContent = text;
    el.classList.remove('is-good','is-bad','is-warn');
    if (kind==='good') el.classList.add('is-good');
    if (kind==='bad') el.classList.add('is-bad');
    if (kind==='warn') el.classList.add('is-warn');
  }

  function resetAll(){
    state.score = 0;
    state.done = {};
    save(); setScoreUI();

    // Clear markings + feedback blocks we created (without breaking core cards)
    $$('.pillLine').forEach(p=>p.classList.remove('is-good','is-bad','is-warn'));
    $$('.choice').forEach(c=>c.classList.remove('is-correct','is-wrong'));
    $$('[data-feedback="1"]').forEach(e=>e.remove());

    // reset tries
    $$('#willQuiz .q, #mixQuiz .q, #corePractice .q').forEach(card=>{
      card.dataset.tries = '0';
    });

    const markerOut = $('#markerOut'); if (markerOut) markerOut.value = '';
    setPill($('#corePracticeMsg'), 'Reset done. Tap an answer.', '');
    setPill($('#willQuizMsg'), 'Reset done. Tap answers for instant feedback.', '');
    setPill($('#mixMsg'), 'Reset done. Tap answers for instant feedback.', '');
    setPill($('#arrangeMsg'), 'Reset done.', '');
  }

  // ---------------------------
  // Speech (US/UK)
  // ---------------------------
  let voices = [];
  let currentVoice = null;

  function pickVoice(){
    voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    const wantUK = state.voice === 'UK';
    const pref = wantUK ? ['en-GB','en_IE'] : ['en-US'];
    currentVoice = voices.find(v=>pref.includes(v.lang)) || voices.find(v=>v.lang && v.lang.startsWith('en')) || null;
  }
  function speak(text){
    if (!('speechSynthesis' in window)) return;
    const t = String(text||'').trim();
    if (!t) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    if (currentVoice) u.voice = currentVoice;
    u.rate = 0.95; u.pitch = 1;
    speechSynthesis.speak(u);
  }
  function setVoiceUI(){
    const us = $('#voiceUS'); const uk = $('#voiceUK');
    if (state.voice === 'UK'){
      uk.classList.add('is-active'); uk.setAttribute('aria-pressed','true');
      us.classList.remove('is-active'); us.setAttribute('aria-pressed','false');
    } else {
      us.classList.add('is-active'); us.setAttribute('aria-pressed','true');
      uk.classList.remove('is-active'); uk.setAttribute('aria-pressed','false');
    }
  }

  // ---------------------------
  // Data
  // ---------------------------
  const CORE = [
    { id:'will', title:'Future with “will”', tag:'instant / promise / prediction',
      use:['Instant decision: “Okay, I’ll do it.”','Offer/promise: “I’ll help you.”','Prediction/opinion: “It’ll be amazing.”'],
      ex:['I’ll call you later.','I think it will rain.','Don’t worry — I’ll fix it.'],
      fr:'Souvent = décision maintenant, promesse, prédiction (pas un plan déjà décidé).'
    },
    { id:'going', title:'“(be) going to”', tag:'plan / evidence',
      use:['Plan decided before now: “I’m going to visit NYC.”','Evidence now: “It’s going to rain.”'],
      ex:['I’m going to book tickets tonight.','She’s going to start a new job.'],
      fr:'Plan déjà décidé OU évidence (je le vois).'
    },
    { id:'arr', title:'Present Continuous (future)', tag:'arrangement / schedule',
      use:['A real arrangement: tickets, meeting, appointment','Often the most natural for schedules'],
      ex:['I’m meeting Anna at 6.','We’re flying on Friday.','He’s seeing the dentist tomorrow.'],
      fr:'Quand c’est “prévu / organisé”. Très courant à l’oral.'
    }
  ];

  const CORE_PRACTICE = [
    {stem:'“Okay!” You decide now: I ___ call you back.', opts:['will','am going to','am calling'], ans:0, hint:'Instant decision / offer → will.'},
    {stem:'Plan decided earlier: I ___ visit NYC next month.', opts:['will','am going to','am visiting'], ans:1, hint:'Plan decided before now → going to.'},
    {stem:'Arranged appointment: I ___ my doctor at 3pm tomorrow.', opts:['will see','am seeing','am going to see'], ans:1, hint:'Scheduled arrangement → present continuous.'},
    {stem:'Evidence now (look!): It ___ rain.', opts:['will','is going to','is raining'], ans:1, hint:'Evidence right now → going to.'},
    {stem:'Tickets + schedule: We ___ on Friday at 10am.', opts:['are flying','will fly','are going to fly'], ans:0, hint:'Arrangement/schedule → present continuous.'}
  ];

  const DECISIONS = {
    promise: {tense:'will', sentence:"Don’t worry — I’ll help you tomorrow.", reason:"Promise/offer → will."},
    instant: {tense:'will', sentence:"Okay, I’ll call them now.", reason:"Instant decision → will."},
    evidence: {tense:'going', sentence:"Look at the sky — it’s going to rain.", reason:"Evidence now → going to."},
    plan: {tense:'going', sentence:"I’m going to visit NYC next month.", reason:"Plan decided before now → going to."},
    arrangement: {tense:'arr', sentence:"I’m meeting a friend at 7pm.", reason:"Scheduled arrangement → present continuous."},
    deadline: {tense:'perf', sentence:"By 6pm, I’ll have finished the report.", reason:"Deadline “by…” → future perfect."},
    duration: {tense:'perfcont', sentence:"By 2030, I’ll have been living in France for 25 years.", reason:"Duration “for…” by a time → future perfect continuous."}
  };

  const WILL_QUIZ = [
    { stem:'I can’t carry these bags. I ___ help you.', choices:['will','am going to'], answer:0,
      why:'Instant offer → will.',
      hint:'Hint: Is this a promise/offer right now, or a plan decided earlier?',
      fr:'Offre / décision maintenant → will.'
    },
    { stem:'Look at that traffic. We ___ be late.', choices:['will','are going to'], answer:1,
      why:'Evidence now → going to.',
      hint:'Hint: Do you SEE evidence right now?',
      fr:'Évidence → going to.'
    },
    { stem:'I bought tickets yesterday. I ___ see a show on Broadway.', choices:['am going to','will'], answer:0,
      why:'Plan decided before now → going to.',
      hint:'Hint: Did you decide earlier (plan already made)?',
      fr:'Plan déjà décidé → going to.'
    },
    { stem:'Okay, I ___ call you after class.', choices:['will','am going to'], answer:0,
      why:'Decision now → will.',
      hint:'Hint: Is it an instant decision (okay!)?',
      fr:'Décision prise maintenant → will.'
    },
    { stem:'Careful! You ___ drop your phone!', choices:['are going to','will'], answer:0,
      why:'Evidence right now → going to.',
      hint:'Hint: Something is happening NOW — evidence!',
      fr:'Je le vois → going to.'
    }
  ];

  const MIX = [
    {stem:'By Friday, I ___ (finish) the project.', options:['will finish','will have finished','will be finishing'], answer:1, hint:'Hint: “By + time” = deadline → future perfect.'},
    {stem:'This time tomorrow, we ___ (fly) to NYC.', options:['will fly','will be flying','are going to fly'], answer:1, hint:'Hint: “This time tomorrow” = in progress → future continuous.'},
    {stem:'I bought tickets. I ___ (see) a show tonight.', options:['will','am going to','will have'], answer:1, hint:'Hint: Plan already made → going to.'},
    {stem:'Okay, I ___ (call) you later.', options:['am going to call','will call','am calling'], answer:1, hint:'Hint: Decision now (“Okay!”) → will.'},
    {stem:'I ___ (meet) my friend at 7. It’s scheduled.', options:['meet','am meeting','will meet'], answer:1, hint:'Hint: Arrangement/schedule → present continuous.'},
    {stem:'By 2030, she ___ (live) here for 10 years.', options:['will live','will have lived','will have been living'], answer:2, hint:'Hint: “for + duration” by a time → future perfect continuous.'},
  ];

  // ---------------------------
  // Build: Core cards
  // ---------------------------
  function buildCore(){
    const grid = $('#coreGrid');
    grid.innerHTML = '';
    CORE.forEach((t)=>{
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'q';
      el.innerHTML = `
        <div class="q__top">
          <div>
            <div class="q__stem">${esc(t.title)}</div>
            <div class="q__meta">${esc(t.tag)}</div>
          </div>
          <div class="pill pill--accent">tap</div>
        </div>
        <div class="explain" data-core="1">${esc(t.fr)}</div>
      `;
      el.addEventListener('click', ()=>{
        // If Reset ever removes the explain block, recreate it safely.
        let exp = el.querySelector('.explain');
        if (!exp){
          exp = document.createElement('div');
          exp.className = 'explain';
          exp.dataset.core = '1';
          el.appendChild(exp);
        }
        exp.innerHTML = `<strong>Use it for:</strong><br>${t.use.map(x=>'• '+esc(x)).join('<br>')}<br><br><strong>Examples:</strong><br>${t.ex.map(x=>'• '+esc(x)).join('<br>')}`;
        award('core_'+t.id, 2);
      });
      grid.appendChild(el);
    });
  }

  // ---------------------------
  // Core practice (instant)
  // ---------------------------
  function buildCorePractice(){
    const host = $('#corePractice');
    host.innerHTML = '';
    CORE_PRACTICE.forEach((q, idx)=>{
      const card = document.createElement('div');
      card.className = 'q';
      card.dataset.tries = '0';
      card.innerHTML = `
        <div class="q__top">
          <div>
            <div class="q__stem">${idx+1}. ${esc(q.stem)}</div>
            <div class="q__meta">Tap</div>
          </div>
        </div>
        <div class="q__choices">
          ${q.opts.map((c,i)=>`<button type="button" class="choice" data-q="${idx}" data-i="${i}">${esc(c)}</button>`).join('')}
        </div>
      `;
      host.appendChild(card);
    });

    host.onclick = (e)=>{
      const btn = e.target.closest('.choice');
      if (!btn) return;
      const qIndex = Number(btn.dataset.q);
      const i = Number(btn.dataset.i);
      const q = CORE_PRACTICE[qIndex];
      const card = btn.closest('.q');

      $$('.choice', card).forEach(b=>b.classList.remove('is-correct','is-wrong'));
      const old = card.querySelector('[data-feedback="1"]'); if (old) old.remove();

      const tries = Number(card.dataset.tries || '0') + 1;
      card.dataset.tries = String(tries);

      if (i === q.ans){
        btn.classList.add('is-correct');
        const exp = document.createElement('div');
        exp.className = 'explain';
        exp.dataset.feedback = '1';
        exp.textContent = '✅ Correct! ' + q.hint;
        card.appendChild(exp);
        setPill($('#corePracticeMsg'), '✅ Great — keep going.', 'good');
        award('coretap_'+qIndex, 2);
      } else {
        btn.classList.add('is-wrong');
        const exp = document.createElement('div');
        exp.className = 'explain';
        exp.dataset.feedback = '1';
        exp.textContent = '❌ ' + q.hint;
        card.appendChild(exp);
        setPill($('#corePracticeMsg'), 'Hint shown below the question.', 'warn');
        if (tries >= 2){
          const correctBtn = card.querySelector(`.choice[data-i="${q.ans}"]`);
          if (correctBtn) correctBtn.classList.add('is-correct');
        }
      }
    };

    $('#corePracticeReset').onclick = ()=>{
      buildCorePractice();
      setPill($('#corePracticeMsg'), 'Reset done. Tap an answer.', '');
    };
  }

  // ---------------------------
  // Markers
  // ---------------------------
  function buildMarkers(){
    const list = [
      'tomorrow','tonight','next week','in 2 hours','in a minute',
      'this weekend','on Friday','by 6pm','by next year','at this time tomorrow',
      'by the time you arrive','for two years (by 2030)'
    ];
    const wrap = $('#markers');
    const out = $('#markerOut');
    wrap.innerHTML = '';
    list.forEach(txt=>{
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent=txt;
      b.addEventListener('click', ()=>{
        const current = out.value.trim();
        out.value = (current ? (current + ' • ' + txt) : txt);
      });
      wrap.appendChild(b);
    });

    $('#copyMarker').onclick = async ()=>{
      try{ await navigator.clipboard.writeText(out.value.trim()); award('markers_copy', 1); }catch{}
    };
    $('#sayMarker').onclick = ()=> speak(out.value);
  }

  // ---------------------------
  // Decision helper (no auto-award)
  // ---------------------------
  function initDecision(){
    const sel = $('#decideSel');
    const box = $('#decideBox');

    function render(givePoints=false){
      const v = DECISIONS[sel.value];
      const nameMap = { will:'Future with “will”', going:'“(be) going to”', arr:'Present Continuous (future)',
                        perf:'Future Perfect', perfcont:'Future Perfect Continuous' };
      const tenseName = nameMap[v.tense] || v.tense;
      box.innerHTML = `<strong>Best tense:</strong> ${esc(tenseName)}<br><strong>Model:</strong> ${esc(v.sentence)}<br><span class="muted">${esc(v.reason)}</span>`;
      box.dataset.text = v.sentence;
      if (givePoints) award('decision_'+sel.value, 1);
    }

    sel.onchange = ()=>render(true);
    render(false);

    $('#decideSay').onclick = ()=> speak(box.dataset.text || '');
    $('#decideCopy').onclick = async ()=>{ try{ await navigator.clipboard.writeText(box.dataset.text || ''); award('decision_copy', 1); }catch{} };
  }

  // ---------------------------
  // Will vs Going to (instant)
  // ---------------------------
  function buildWillQuiz(){
    const host = $('#willQuiz');
    host.innerHTML = '';
    WILL_QUIZ.forEach((q, idx)=>{
      const card = document.createElement('div');
      card.className = 'q';
      card.dataset.tries = '0';
      card.innerHTML = `
        <div class="q__top">
          <div>
            <div class="q__stem">${idx+1}. ${esc(q.stem)}</div>
            <div class="q__meta">Tap an option (instant feedback)</div>
          </div>
        </div>
        <div class="q__choices">
          ${q.choices.map((c,i)=>`<button type="button" class="choice" data-q="${idx}" data-i="${i}">${esc(c)}</button>`).join('')}
        </div>
      `;
      host.appendChild(card);
    });

    host.onclick = (e)=>{
      const btn = e.target.closest('.choice');
      if (!btn) return;

      const qIndex = Number(btn.dataset.q);
      const i = Number(btn.dataset.i);
      const q = WILL_QUIZ[qIndex];
      const card = btn.closest('.q');

      $$('.choice', card).forEach(b=>b.classList.remove('is-correct','is-wrong'));
      const old = card.querySelector('[data-feedback="1"]'); if (old) old.remove();

      const tries = Number(card.dataset.tries || '0') + 1;
      card.dataset.tries = String(tries);

      if (i === q.answer){
        btn.classList.add('is-correct');
        const exp = document.createElement('div');
        exp.className = 'explain';
        exp.dataset.feedback = '1';
        exp.innerHTML = `<strong>✅ Correct.</strong> ${esc(q.why)}<br><span class="tiny muted">🇫🇷 ${esc(q.fr)}</span>`;
        card.appendChild(exp);
        setPill($('#willQuizMsg'), '✅ Nice! Keep going.', 'good');
        award('willq_'+qIndex, 2);
      } else {
        btn.classList.add('is-wrong');
        const exp = document.createElement('div');
        exp.className = 'explain';
        exp.dataset.feedback = '1';
        exp.innerHTML = `<strong>❌ Not this one.</strong> ${esc(q.hint)}<br><span class="tiny muted">Try again.</span>`;
        card.appendChild(exp);
        setPill($('#willQuizMsg'), 'Hint shown below the question.', 'warn');

        if (tries >= 2){
          const correctBtn = card.querySelector(`.choice[data-i="${q.answer}"]`);
          if (correctBtn) correctBtn.classList.add('is-correct');
          const more = document.createElement('div');
          more.className = 'explain';
          more.dataset.feedback = '1';
          more.innerHTML = `<strong>Answer:</strong> ${esc(q.choices[q.answer])} — ${esc(q.why)}`;
          card.appendChild(more);
        }
      }
    };

    $('#resetWillQuiz').onclick = ()=>{
      buildWillQuiz();
      setPill($('#willQuizMsg'), 'Reset done. Tap answers.', '');
    };
  }

  // ---------------------------
  // Arrangements MCQ + NYC planner
  // ---------------------------
  const ARR_MCQ = [
    { stem:'(arrangement) I ____ Anna at 6pm.', choices:['meet','am meeting','will meet'], answer:1, explain:'Scheduled arrangement → present continuous.' },
    { stem:'(plan) I ____ visit the Met next week.', choices:['am going to','am visiting','will'], answer:0, explain:'Plan decided before now → going to.' },
    { stem:'(instant) Oh! I ____ text him now.', choices:['am going to','will','am texting'], answer:1, explain:'Decision now → will.' }
  ];

  function buildArrMCQ(){
    const host = $('#arrangeMCQ');
    host.innerHTML = '';
    ARR_MCQ.forEach((q, idx)=>{
      const card = document.createElement('div');
      card.className = 'q';
      card.innerHTML = `
        <div class="q__stem">${idx+1}. ${esc(q.stem)}</div>
        <div class="q__choices">
          ${q.choices.map((c,i)=>`<button type="button" class="choice" data-q="${idx}" data-i="${i}">${esc(c)}</button>`).join('')}
        </div>
      `;
      host.appendChild(card);
    });

    host.onclick = (e)=>{
      const btn = e.target.closest('.choice');
      if (!btn) return;
      const qIndex = Number(btn.dataset.q);
      const i = Number(btn.dataset.i);
      const q = ARR_MCQ[qIndex];
      const card = btn.closest('.q');

      $$('.choice', card).forEach(b=>b.classList.remove('is-correct','is-wrong'));
      if (i === q.answer){
        btn.classList.add('is-correct');
        setPill($('#arrangeMsg'), `✅ ${q.explain}`, 'good');
        award('arr_'+qIndex, 2);
      } else {
        btn.classList.add('is-wrong');
        setPill($('#arrangeMsg'), `❌ Hint: ${q.explain}`, 'warn');
      }
    };
  }

  function initNYC(){
    const day = $('#nycDay'), act = $('#nycAct'), time = $('#nycTime');
    const out = $('#nycOut');

    function gen(givePoints=false){
      const parts = act.value.split(' ');
      const verb = parts.shift();
      const rest = parts.join(' ');
      const sent = `${day.value}, I’m ${ingForm(verb)} ${rest} ${time.value}.`;
      out.textContent = sent.replace(/\s+/g,' ').replace(' .','.');
      if (givePoints) award('nyc_plan', 2);
    }

    $('#nycGen').onclick = ()=>gen(true);
    $('#nycSay').onclick = ()=> speak(out.textContent);
    $('#nycCopy').onclick = async ()=>{ try{ await navigator.clipboard.writeText(out.textContent.trim()); award('nyc_copy', 1);}catch{} };

    gen(false);
  }

  // ---------------------------
  // Advanced grid + matching + NY phrases
  // ---------------------------
  const ADV = [
    {title:'Future Continuous', tag:'in progress at a time', ex:'This time tomorrow, I’ll be walking in Central Park.'},
    {title:'Future Perfect', tag:'deadline (by + time)', ex:'By 6pm, I’ll have finished the report.'},
    {title:'Future Perfect Continuous', tag:'duration by a time', ex:'By 2030, I’ll have been living here for 10 years.'},
    {title:'Polite questions', tag:'will you be…?', ex:'Will you be using the car tonight?'}
  ];

  function buildAdvanced(){
    const grid = $('#advGrid');
    grid.innerHTML = '';
    ADV.forEach((a)=>{
      const el = document.createElement('div');
      el.className = 'q';
      el.innerHTML = `
        <div class="q__top">
          <div>
            <div class="q__stem">${esc(a.title)}</div>
            <div class="q__meta">${esc(a.tag)}</div>
          </div>
          <button class="chip" type="button" data-say="${esc(a.ex)}">Say</button>
        </div>
        <div class="explain" data-core="1"><strong>Example:</strong> ${esc(a.ex)}</div>
      `;
      grid.appendChild(el);
    });

    grid.onclick = (e)=>{
      const b = e.target.closest('[data-say]');
      if (!b) return;
      speak(b.getAttribute('data-say')||'');
      award('adv_say', 1);
    };
  }

  const MATCH = [
    {phrase:'By 6pm…', tense:'Future Perfect'},
    {phrase:'At this time tomorrow…', tense:'Future Continuous'},
    {phrase:'By 2030, for 10 years…', tense:'Future Perfect Continuous'},
    {phrase:'A decision right now…', tense:'Will'},
    {phrase:'A plan decided earlier…', tense:'Going to'},
    {phrase:'Tickets/appointment…', tense:'Present Continuous (future)'}
  ];
  const MATCH_OPTS = ['Will','Going to','Present Continuous (future)','Future Continuous','Future Perfect','Future Perfect Continuous'];

  function buildMatch(){
    const host = $('#matchZone');
    host.innerHTML = '';
    MATCH.forEach((m, idx)=>{
      const row = document.createElement('div');
      row.className = 'matchRow';
      row.innerHTML = `
        <div class="q__stem">${idx+1}. ${esc(m.phrase)}</div>
        <select class="select" data-idx="${idx}">
          <option value="">— choose —</option>
          ${MATCH_OPTS.map(o=>`<option>${esc(o)}</option>`).join('')}
        </select>
      `;
      host.appendChild(row);
    });
  }

  function checkMatch(){
    let ok = 0;
    $$('#matchZone select').forEach(sel=>{
      const idx = Number(sel.dataset.idx);
      const correct = MATCH[idx].tense;
      if (sel.value === correct){
        ok++;
        sel.style.borderColor = 'rgba(134,239,172,.55)';
      } else {
        sel.style.borderColor = 'rgba(252,165,165,.55)';
      }
    });
    if (ok === MATCH.length){
      setPill($('#matchMsg'), `Perfect! ${ok}/${MATCH.length} ✅`, 'good');
      award('match_full', 4);
    } else {
      setPill($('#matchMsg'), `Score: ${ok}/${MATCH.length}. Fix red ones.`, 'warn');
    }
  }

  function resetMatch(){
    buildMatch();
    $$('#matchZone select').forEach(sel=> sel.style.borderColor = '');
    setPill($('#matchMsg'), 'Reset done.', '');
  }

  const NY_PHRASES = [
    {p:"I’m gonna grab coffee.", note:"going to → gonna (speaking)"},
    {p:"I’ll be there in a sec.", note:"I will → I’ll"},
    {p:"We’re gonna head out soon.", note:"going to"},
    {p:"You’ll love it.", note:"you will → you’ll"},
    {p:"I’m meeting them at 7.", note:"arrangement"}
  ];
  function initNYPhrases(){
    const chips = $('#nyChips');
    const out = $('#nyPhraseOut');
    chips.innerHTML = '';
    NY_PHRASES.forEach((x, i)=>{
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent=x.p;
      b.addEventListener('click', ()=>{
        out.innerHTML = `<strong>${esc(x.p)}</strong><br><span class="muted">${esc(x.note)}</span>`;
        out.dataset.text = x.p;
        award('nyphrase_'+i, 1);
      });
      chips.appendChild(b);
    });

    $('#nySay').onclick = ()=> speak(out.dataset.text || '');
    $('#nyCopy').onclick = async ()=>{ try{ await navigator.clipboard.writeText(out.dataset.text || ''); award('ny_copy', 1);}catch{} };
  }

  // ---------------------------
  // Sentence lab
  // ---------------------------
  const LAB_TENSES = [
    {id:'will', label:'Will (decision/promise/prediction)'},
    {id:'going', label:'Going to (plan/evidence)'},
    {id:'arr', label:'Present Continuous (arrangement)'},
    {id:'fcont', label:'Future Continuous (will be + -ing)'},
    {id:'fperf', label:'Future Perfect (will have + pp)'},
    {id:'fperfcont', label:'Future Perfect Continuous (will have been + -ing)'}
  ];

  function initLab(){
    const tenseSel = $('#labTense');
    tenseSel.innerHTML = LAB_TENSES.map(t=>`<option value="${esc(t.id)}">${esc(t.label)}</option>`).join('');

    function buildForms(){
      const tense = tenseSel.value;
      const S = $('#labSubj').value;
      const v = $('#labVerb').value;
      const obj = $('#labObj').value.trim();
      const time = $('#labTime').value.trim();
      const style = $('#labStyle').value;

      const isHeSheIt = (S==='He'||S==='She'||S==='It');
      const be = (S==='I') ? 'am' : (isHeSheIt ? 'is' : 'are');

      const extra = (obj ? (' ' + obj) : '') + (time ? (' ' + time) : '');

      function contract(s){
        if (style !== 'friendly') return s;
        return s
          .replace(/\bI will\b/g, "I'll")
          .replace(/\bYou will\b/g, "You'll")
          .replace(/\bHe will\b/g, "He'll")
          .replace(/\bShe will\b/g, "She'll")
          .replace(/\bWe will\b/g, "We'll")
          .replace(/\bThey will\b/g, "They'll")
          .replace(/\bwill not\b/g, "won't")
          .replace(/\bI am\b/g, "I'm")
          .replace(/\bYou are\b/g, "You're")
          .replace(/\bHe is\b/g, "He's")
          .replace(/\bShe is\b/g, "She's")
          .replace(/\bWe are\b/g, "We're")
          .replace(/\bThey are\b/g, "They're");
      }

      let aff='', neg='', que='';

      switch(tense){
        case 'will':
          aff = `${S} will ${v}${extra}.`;
          neg = `${S} will not ${v}${extra}.`;
          que = `Will ${S.toLowerCase()} ${v}${extra}?`;
          break;
        case 'going':
          aff = `${S} ${be} going to ${v}${extra}.`;
          neg = `${S} ${be} not going to ${v}${extra}.`;
          que = `${be[0].toUpperCase()+be.slice(1)} ${S.toLowerCase()} going to ${v}${extra}?`;
          break;
        case 'arr':
          aff = `${S} ${be} ${ingForm(v)}${extra}.`;
          neg = `${S} ${be} not ${ingForm(v)}${extra}.`;
          que = `${be[0].toUpperCase()+be.slice(1)} ${S.toLowerCase()} ${ingForm(v)}${extra}?`;
          break;
        case 'fcont':
          aff = `${S} will be ${ingForm(v)}${extra}.`;
          neg = `${S} will not be ${ingForm(v)}${extra}.`;
          que = `Will ${S.toLowerCase()} be ${ingForm(v)}${extra}?`;
          break;
        case 'fperf':
          aff = `${S} will have ${ppForm(v)}${extra}.`;
          neg = `${S} will not have ${ppForm(v)}${extra}.`;
          que = `Will ${S.toLowerCase()} have ${ppForm(v)}${extra}?`;
          break;
        case 'fperfcont':
          aff = `${S} will have been ${ingForm(v)}${extra}.`;
          neg = `${S} will not have been ${ingForm(v)}${extra}.`;
          que = `Will ${S.toLowerCase()} have been ${ingForm(v)}${extra}?`;
          break;
        default:
          aff = `${S} will ${v}${extra}.`;
          neg = `${S} will not ${v}${extra}.`;
          que = `Will ${S.toLowerCase()} ${v}${extra}?`;
      }

      const clean = (s)=>s.replace(/\s+/g,' ').replace(' .','.').replace(' ?','?');
      aff = clean(contract(aff));
      neg = clean(contract(neg));
      que = clean(contract(que));
      return {aff, neg, que};
    }

    function render(){
      const {aff, neg, que} = buildForms();
      $('#outAff').textContent = aff;
      $('#outNeg').textContent = neg;
      $('#outQ').textContent = que;
    }

    $('#labGen').onclick = ()=>{
      render();
      setPill($('#labMsg'), '✅ Generated. Say them out loud!', 'good');
      award('lab_gen', 4);
    };
    $('#labClear').onclick = ()=>{
      $('#labObj').value = '';
      $('#labTime').value = '';
      render();
      setPill($('#labMsg'), 'Cleared.', '');
    };

    $('#lab').addEventListener('click', async (e)=>{
      const sayBtn = e.target.closest('[data-say]');
      const copyBtn = e.target.closest('[data-copy]');
      if (sayBtn){
        const target = sayBtn.getAttribute('data-say');
        speak($(target)?.textContent || '');
        award('lab_say', 1);
      }
      if (copyBtn){
        const target = copyBtn.getAttribute('data-copy');
        const txt = $(target)?.textContent || '';
        try{ await navigator.clipboard.writeText(txt.trim()); award('lab_copy', 1); }catch{}
      }
    });

    render();
  }

  // ---------------------------
  // Mini test (instant + hint)
  // ---------------------------
  function buildMix(){
    const host = $('#mixQuiz');
    host.innerHTML = '';
    MIX.forEach((q, idx)=>{
      const card = document.createElement('div');
      card.className = 'q';
      card.dataset.tries = '0';
      card.innerHTML = `
        <div class="q__top">
          <div>
            <div class="q__stem">${idx+1}. ${esc(q.stem)}</div>
            <div class="q__meta">Tap an option (instant feedback)</div>
          </div>
        </div>
        <div class="q__choices">
          ${q.options.map((c,i)=>`<button type="button" class="choice" data-q="${idx}" data-i="${i}">${esc(c)}</button>`).join('')}
        </div>
      `;
      host.appendChild(card);
    });

    host.onclick = (e)=>{
      const btn = e.target.closest('.choice');
      if (!btn) return;

      const qIndex = Number(btn.dataset.q);
      const i = Number(btn.dataset.i);
      const q = MIX[qIndex];
      const card = btn.closest('.q');

      $$('.choice', card).forEach(b=>b.classList.remove('is-correct','is-wrong'));
      const old = card.querySelector('[data-feedback="1"]'); if (old) old.remove();

      const tries = Number(card.dataset.tries || '0') + 1;
      card.dataset.tries = String(tries);

      if (i === q.answer){
        btn.classList.add('is-correct');
        const exp = document.createElement('div');
        exp.className = 'explain';
        exp.dataset.feedback = '1';
        exp.innerHTML = `<strong>✅ Correct.</strong> ${esc(q.hint).replace('Hint: ','')}`;
        card.appendChild(exp);
        setPill($('#mixMsg'), '✅ Nice! Keep going.', 'good');
        award('mixq_'+qIndex, 2);
      } else {
        btn.classList.add('is-wrong');
        const exp = document.createElement('div');
        exp.className = 'explain';
        exp.dataset.feedback = '1';
        exp.innerHTML = `<strong>❌ Not this one.</strong> ${esc(q.hint)}<br><span class="tiny muted">Try again.</span>`;
        card.appendChild(exp);
        setPill($('#mixMsg'), 'Hint shown below the question.', 'warn');

        if (tries >= 2){
          const correctBtn = card.querySelector(`.choice[data-i="${q.answer}"]`);
          if (correctBtn) correctBtn.classList.add('is-correct');
        }
      }
    };

    $('#mixReset').onclick = ()=>{
      buildMix();
      setPill($('#mixMsg'), 'Reset done. Tap answers.', '');
    };
  }

  // ---------------------------
  // Init
  // ---------------------------
  function init(){
    load(); setScoreUI();

    if ('speechSynthesis' in window){
      pickVoice();
      speechSynthesis.onvoiceschanged = () => { pickVoice(); };
    }

    $('#voiceUS').onclick = ()=>{ state.voice='US'; save(); setVoiceUI(); pickVoice(); };
    $('#voiceUK').onclick = ()=>{ state.voice='UK'; save(); setVoiceUI(); pickVoice(); };
    setVoiceUI();

    $('#resetAll').onclick = ()=>{
      if (!confirm('Reset score and feedback?')) return;
      resetAll();
    };
    $('#printBtn').onclick = ()=> window.print();

    buildCore();
    buildCorePractice();
    buildMarkers();
    initDecision();
    buildWillQuiz();
    buildArrMCQ();
    initNYC();
    buildAdvanced();
    buildMatch();
    $('#matchCheck').onclick = checkMatch;
    $('#matchReset').onclick = resetMatch;
    initNYPhrases();
    initLab();
    buildMix();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
