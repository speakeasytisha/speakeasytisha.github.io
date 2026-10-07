(() => {
  'use strict';
  const KEY = 'thomas_lesson4_impact_v1';
  const sections = [...document.querySelectorAll('.lesson-section')];
  const state = { sectionIndex: 0, sessionSeconds: 75 * 60, sessionTimer: null, quizCorrect: {}, seqCorrect: false, speakToken: 0 };
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const DAYS = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  /* ---------- INIT ---------- */
  function init() {
    makeStepDots(); bindNav(); bindHeader(); bindSessionTimer(); bindSpeech();
    bindVocab(); bindBoard(); bindQuizzes(); bindBuilders(); drawCharts(); bindKpiTool();
    buildSequence(); bindMiniTimers(); bindRecorders(); bindScenario(); buildTalk();
    bindManualChecks(); bindSaveFields(); bindResets(); bindReport();
    restore(); setDate(); updateBuilders(); updateKpiTool(); renderTalk(); newScenario(false);
    updateScores(); showSection(state.sectionIndex, false);
  }
  document.addEventListener('DOMContentLoaded', init);

  /* ---------- NAVIGATION ---------- */
  function makeStepDots() {
    const nav = $('#stepDots');
    sections.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = String(i + 1); b.title = s.dataset.title || `Section ${i + 1}`;
      b.addEventListener('click', () => showSection(i)); nav.appendChild(b);
    });
  }
  function bindNav() {
    $$('[data-next]').forEach(b => b.addEventListener('click', () => showSection(Math.min(state.sectionIndex + 1, sections.length - 1))));
    $('#backTop')?.addEventListener('click', () => showSection(0));
  }
  function showSection(i, scroll = true) {
    state.sectionIndex = i;
    sections.forEach((s, idx) => s.classList.toggle('active', idx === i));
    $('#progressBar').style.width = `${((i + 1) / sections.length) * 100}%`;
    $('#progressLabel').textContent = sections[i]?.dataset.title || '';
    $$('#stepDots button').forEach((b, idx) => b.classList.toggle('active', idx === i));
    save();
    if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- HEADER ---------- */
  function bindHeader() {
    $('#translationToggle')?.addEventListener('click', () => {
      const on = document.body.classList.toggle('show-fr');
      setFrButton(on); save();
    });
    $('#printButton')?.addEventListener('click', () => window.print());
  }
  function setFrButton(on) {
    const b = $('#translationToggle'); if (!b) return;
    b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on));
    b.textContent = on ? 'FR help · ON' : 'FR help · OFF';
  }
  function bindSessionTimer() {
    $('#timerStart')?.addEventListener('click', () => {
      if (state.sessionTimer) return;
      state.sessionTimer = setInterval(() => {
        state.sessionSeconds = Math.max(0, state.sessionSeconds - 1); updateSessionTimer();
        if (state.sessionSeconds === 0) pauseSessionTimer();
      }, 1000);
    });
    $('#timerPause')?.addEventListener('click', () => { pauseSessionTimer(); save(); });
    $('#timerReset')?.addEventListener('click', () => { pauseSessionTimer(); state.sessionSeconds = 75 * 60; updateSessionTimer(); save(); });
    updateSessionTimer();
  }
  function pauseSessionTimer() { if (state.sessionTimer) { clearInterval(state.sessionTimer); state.sessionTimer = null; } }
  function updateSessionTimer() { $('#sessionTimer').textContent = fmt(state.sessionSeconds); }
  const fmt = sec => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  /* ---------- SPEECH ---------- */
  function bindSpeech() {
    document.addEventListener('click', e => {
      const b = e.target.closest('.speak-button[data-speak]'); if (b) speak(b.dataset.speak);
      const p = e.target.closest('.speak-pauses[data-pause-speak]'); if (p) speakWithPauses(p.dataset.pauseSpeak);
      const f = e.target.closest('.speak-flat[data-text]'); if (f) speak(f.dataset.text, 1.12);
      const gen = e.target.closest('.speak-generated'); if (gen) speak($('#' + gen.dataset.output)?.textContent || '');
      const copy = e.target.closest('.copy-generated'); if (copy) copyText($('#' + copy.dataset.output)?.textContent || '');
    });
    if ('speechSynthesis' in window) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); }
  }
  function makeUtterance(text, rate) {
    const u = new SpeechSynthesisUtterance(text);
    const lang = $('#accentSelect')?.value || 'en-US';
    u.lang = lang; u.rate = rate || Number($('#rateSelect')?.value || 0.92); u.pitch = 1;
    const voices = speechSynthesis.getVoices();
    const norm = v => (v.lang || '').replace('_', '-').toLowerCase();
    // Never fall back to a non-English voice (avoids the French voice on iOS)
    u.voice = voices.find(v => norm(v) === lang.toLowerCase()) || voices.find(v => norm(v).startsWith('en')) || null;
    return u;
  }
  function speak(text, rate) {
    if (!('speechSynthesis' in window)) { toast('Speech is not available in this browser.'); return; }
    state.speakToken++; speechSynthesis.cancel();
    const clean = String(text).replace(/\/\/|\//g, ' ').replace(/\s+/g, ' ').trim();
    if (clean) speechSynthesis.speak(makeUtterance(clean, rate));
  }
  // Speaks chunk by chunk with real silences: "/" = short pause, "//" = long pause
  function speakWithPauses(text) {
    if (!('speechSynthesis' in window)) { toast('Speech is not available in this browser.'); return; }
    state.speakToken++; const token = state.speakToken; speechSynthesis.cancel();
    const parts = String(text).split(/(\/\/|\/)/);
    const queue = [];
    parts.forEach(p => {
      if (p === '//') queue.push({ gap: 1100 });
      else if (p === '/') queue.push({ gap: 420 });
      else if (p.trim()) queue.push({ say: p.trim() });
    });
    const next = () => {
      if (token !== state.speakToken || !queue.length) return;
      const item = queue.shift();
      if (item.gap) { setTimeout(next, item.gap); return; }
      const u = makeUtterance(item.say, Math.min(Number($('#rateSelect')?.value || 0.92), 0.95));
      u.onend = next; u.onerror = next;
      speechSynthesis.speak(u);
    };
    setTimeout(next, 120);
  }

  /* ---------- VOCABULARY ---------- */
  function bindVocab() {
    const sel = $('#vocabSelect'); if (!sel) return;
    const apply = () => {
      const f = sel.value; let n = 0;
      $$('#vocabGrid .vocab-card').forEach(c => { const show = f === 'all' || c.dataset.cat === f; c.hidden = !show; if (show) n++; });
      $('#vocabCount').textContent = `${n} expressions`;
    };
    sel.addEventListener('change', apply); apply();
  }

  /* ---------- 4-BLOCK BOARD ---------- */
  function bindBoard() {
    $$('#fourBoard .block').forEach(b => b.addEventListener('click', () => {
      b.classList.toggle('open');
      const t = $('.block-detail', b)?.textContent.replace('Say:', '').trim();
      if (b.classList.contains('open') && t) speak(t);
    }));
  }

  /* ---------- QUIZZES (answers shuffled on every load) ---------- */
  function bindQuizzes() {
    $$('.quiz-item').forEach((item, idx) => {
      item.dataset.qid = `q${idx}`;
      const wrap = $('div', item);
      shuffle($$('button[data-choice]', wrap)).forEach(btn => wrap.appendChild(btn));
      $$('button[data-choice]', item).forEach(btn => btn.addEventListener('click', () => {
        const good = btn.dataset.choice === item.dataset.answer;
        $$('button[data-choice]', item).forEach(x => x.classList.remove('correct', 'wrong'));
        btn.classList.add(good ? 'correct' : 'wrong');
        const fb = $('.feedback', item);
        fb.textContent = good ? '✓ Correct — well done!' : '✗ Not quite — try again.';
        fb.className = `feedback ${good ? 'good' : 'bad'}`;
        if (good) state.quizCorrect[item.dataset.qid] = true; else delete state.quizCorrect[item.dataset.qid];
        save(); updateScores();
      }));
    });
  }

  /* ---------- BUILDERS ---------- */
  const CONV_ANSWERS = {
    conv1: 'We closed out three NNC items.',
    conv2: 'We trained a new operator on the inspection process.',
    conv3: 'We fixed the conveyor jam at 10:30, so the line restarted quickly.',
    conv4: 'We cleared the backlog on initial handling.'
  };
  function bindBuilders() {
    $$('[data-builder]').forEach(s => s.addEventListener('change', () => { updateBuilders(); save(); updateScores(); }));
  }
  function convScore() { return Object.keys(CONV_ANSWERS).filter(k => $(`[data-builder="${k}"]`)?.value === CONV_ANSWERS[k]).length; }
  function updateBuilders() {
    // sticky note converter
    let answered = 0;
    Object.keys(CONV_ANSWERS).forEach(k => {
      const el = $(`[data-builder="${k}"]`); if (!el) return;
      el.style.borderColor = ''; el.style.background = '';
      if (el.value) { answered++; const ok = el.value === CONV_ANSWERS[k]; el.style.borderColor = ok ? '#7ebd98' : '#dca5a0'; el.style.background = ok ? '#e9f7ef' : '#fff0ef'; }
    });
    const fb = $('#convFeedback');
    if (fb) { const n = convScore(); fb.textContent = answered ? `${n} / 4 correct${n === 4 ? ' — excellent! 🎉' : ''}` : ''; fb.className = `feedback ${n === 4 ? 'good' : answered ? 'bad' : ''}`; }
    // action builder with automatic agreement
    const act = $$('[data-builder="act"]').map(x => x.value);
    if ($('#actOutput') && act.length) {
      let verb = act[1];
      if (act[0].endsWith(' I')) verb = verb.replace(/^is going to/, 'am going to');
      if (act[0].includes('quality team') || act[0].endsWith(' I')) verb = verb.replace(/^will/, 'will');
      $('#actOutput').textContent = `${act[0]} ${verb} ${act[2]}`;
    }
    const emo = $$('[data-builder="emo"]').map(x => x.value);
    if ($('#emoOutput')) $('#emoOutput').textContent = emo.join(' ');
    const hook = $('[data-builder="hook"]');
    if ($('#hookOutput') && hook) $('#hookOutput').textContent = hook.value;
  }

  /* ---------- SVG KPI CHARTS ---------- */
  function drawCharts() {
    drawChart('#chartPicks', { cats: ['JOP', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'], vals: [25, 25, 30, 40, 50, 50], max: 80, ticks: [0, 20, 40, 60, 80], target: 50, stretch: 75 });
    drawChart('#chartScrap', { cats: ['JOP', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'], vals: [258, 258, 200, 150, 129, 129], max: 300, ticks: [0, 100, 200, 300], target: 129, stretch: 0 });
  }
  function drawChart(sel, c) {
    const svg = $(sel); if (!svg) return;
    const W = 420, H = 230, L = 42, R = 12, T = 16, B = 30, pw = W - L - R, ph = H - T - B;
    const y = v => T + ph - (v / c.max) * ph;
    const step = pw / c.cats.length, bw = step * 0.42;
    let s = '';
    c.ticks.forEach(t => { s += `<line x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}" stroke="#ece6da"/><text x="${L - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#6b665e">${t}</text>`; });
    c.cats.forEach((cat, i) => {
      const cx = L + step * i + step / 2, v = c.vals[i], x = cx - bw / 2;
      if (i === 0) s += `<rect x="${x}" y="${y(v)}" width="${bw}" height="${y(0) - y(v)}" fill="#1f5f8b" rx="2"/>`;
      else s += `<rect x="${x + 1}" y="${y(v)}" width="${bw - 2}" height="${y(0) - y(v)}" fill="#fff" stroke="#7fb4d8" stroke-width="2" rx="2"/>`;
      s += `<text x="${cx}" y="${y(v) - 5}" text-anchor="middle" font-size="11" font-weight="700" fill="#242322">${v}</text>`;
      s += `<text x="${cx}" y="${H - 10}" text-anchor="middle" font-size="11" font-weight="700" fill="#242322">${cat}</text>`;
    });
    const x0 = L + step / 2 - bw / 2, x1 = L + step * (c.cats.length - 0.5) + bw / 2;
    s += `<line x1="${x0}" x2="${x1}" y1="${y(c.target)}" y2="${y(c.target)}" stroke="#d43a3a" stroke-width="2.5"/>`;
    s += `<text x="${x0}" y="${y(c.target) - 5}" font-size="10" font-weight="700" fill="#d43a3a">${c.target}</text>`;
    s += `<line x1="${x0}" x2="${x1}" y1="${y(c.stretch)}" y2="${y(c.stretch)}" stroke="#d43a3a" stroke-width="2"/>`;
    for (let i = 1; i < c.cats.length; i++) s += `<circle cx="${L + step * i + step / 2}" cy="${y(c.stretch)}" r="3.5" fill="#d43a3a"/>`;
    s += `<text x="${x0}" y="${y(c.stretch) - 5}" font-size="10" font-weight="700" fill="#d43a3a">${c.stretch}</text>`;
    svg.innerHTML = s;
  }

  /* ---------- OWN KPI GENERATOR ---------- */
  function bindKpiTool() { ['#kpiName', '#kpiActual', '#kpiTarget', '#kpiUnit', '#kpiDir'].forEach(id => $(id)?.addEventListener('input', updateKpiTool)); $('#kpiDir')?.addEventListener('change', updateKpiTool); }
  function updateKpiTool() {
    const out = $('#kpiOutput'); if (!out) return;
    const name = ($('#kpiName').value || 'Our KPI').trim();
    const a = Number($('#kpiActual').value), t = Number($('#kpiTarget').value);
    const unit = $('#kpiUnit').value.trim(); const u = unit ? ` ${unit}` : '';
    const higher = $('#kpiDir').value === 'higher';
    if (!Number.isFinite(a) || !Number.isFinite(t) || $('#kpiActual').value === '' || $('#kpiTarget').value === '') { out.textContent = 'Enter today\'s value and the target.'; return; }
    const diff = Math.round(Math.abs(a - t) * 10) / 10;
    const good = higher ? a >= t : a <= t;
    const cap = name.charAt(0).toUpperCase() + name.slice(1);
    let compare, meaning;
    if (a === t) { compare = `That's exactly on target.`; meaning = `So we're right where we need to be. Great work by the team.`; }
    else if (good) { compare = `That's ${diff}${u} ${a > t ? 'above' : 'below'} the target of ${t}${u}.`; meaning = `So we're ahead of target — that's really good news, and I'm proud of the team.`; }
    else { compare = `That's ${diff}${u} ${a > t ? 'above' : 'below'} the target of ${t}${u}.`; meaning = `So we're not there yet — but we know where to focus, and closing that gap is our priority.`; }
    out.textContent = `${cap} is at ${a}${u} today. ${compare} ${meaning}`;
  }

  /* ---------- SEQUENCE (transitions order) ---------- */
  const SEQ = [
    'Good morning, everyone. Here\'s today\'s update from Team 3.',
    'Let\'s start with our KPIs.',
    'Moving on to today\'s accomplishments…',
    'Looking ahead to tomorrow…',
    'Finally, here\'s where we need support.',
    'That\'s it from our team. Any questions?'
  ];
  function buildSequence() {
    const pool = $('#seqPool'), ans = $('#seqAnswer'); if (!pool) return;
    const reset = () => {
      pool.innerHTML = ''; ans.innerHTML = ''; $('#seqFeedback').textContent = '';
      let order = shuffle(SEQ); if (order.join() === SEQ.join()) order = shuffle(SEQ);
      order.forEach(t => { const b = document.createElement('button'); b.type = 'button'; b.className = 'seq-chip'; b.textContent = t; pool.appendChild(b); });
    };
    pool.addEventListener('click', e => { const b = e.target.closest('.seq-chip'); if (b) { b.classList.remove('correct', 'wrong'); ans.appendChild(b); } });
    ans.addEventListener('click', e => { const b = e.target.closest('.seq-chip'); if (b) { b.classList.remove('correct', 'wrong'); pool.appendChild(b); } });
    $('#seqCheck').addEventListener('click', () => {
      const chips = $$('.seq-chip', ans); const fb = $('#seqFeedback');
      if (chips.length < SEQ.length) { fb.textContent = 'Place all six phrases first.'; fb.className = 'feedback bad'; return; }
      let ok = 0; chips.forEach((c, i) => { const good = c.textContent === SEQ[i]; c.classList.toggle('correct', good); c.classList.toggle('wrong', !good); if (good) ok++; });
      state.seqCorrect = ok === SEQ.length;
      fb.textContent = state.seqCorrect ? '✓ Perfect order! Now say it out loud with pauses.' : `${ok} / 6 in the right place. Click the red ones to move them back.`;
      fb.className = `feedback ${state.seqCorrect ? 'good' : 'bad'}`;
      save(); updateScores();
    });
    $('#seqReset').addEventListener('click', reset);
    reset();
  }

  /* ---------- MINI TIMERS ---------- */
  function bindMiniTimers() {
    $$('.timer-inline').forEach(box => {
      const base = Number(box.dataset.seconds || 60); const display = $('strong', box);
      let remaining = base, interval = null;
      const render = () => { display.textContent = fmt(remaining); };
      $('.timer-start', box)?.addEventListener('click', () => {
        if (interval) clearInterval(interval); remaining = base; render();
        interval = setInterval(() => { remaining = Math.max(0, remaining - 1); render(); if (remaining === 0) { clearInterval(interval); interval = null; toast('Time! Finish with your key message — and a smile. 🙂'); } }, 1000);
      });
      $('.timer-reset', box)?.addEventListener('click', () => { if (interval) clearInterval(interval); interval = null; remaining = base; render(); });
      render();
    });
  }

  /* ---------- RECORDERS ---------- */
  function bindRecorders() {
    $$('[data-recorder]').forEach(box => {
      const start = $('.rec-start', box), stop = $('.rec-stop', box), audio = $('.rec-audio', box), dl = $('.rec-download', box), status = $('.rec-status', box), dot = $('.rec-dot', box);
      let rec = null, chunks = [], stream = null;
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { status.textContent = 'Recording is not supported in this browser — try Chrome or Edge.'; start.disabled = true; return; }
      start.addEventListener('click', async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const type = ['audio/webm', 'audio/mp4', 'audio/ogg'].find(t => MediaRecorder.isTypeSupported?.(t)) || '';
          rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined); chunks = [];
          rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
          rec.onstop = () => {
            const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
            const url = URL.createObjectURL(blob);
            audio.src = url; audio.hidden = false; dl.href = url; dl.hidden = false;
            const ext = (rec.mimeType || '').includes('mp4') ? 'm4a' : (rec.mimeType || '').includes('ogg') ? 'ogg' : 'webm';
            dl.download = dl.download.replace(/\.\w+$/, '.' + ext);
            stream.getTracks().forEach(t => t.stop());
            status.textContent = 'Listen back: where did you pause? Which words did you stress?';
          };
          rec.start(); dot.classList.add('live'); start.disabled = true; stop.disabled = false; status.textContent = 'Recording…';
        } catch (e) { status.textContent = 'Microphone access was refused or is unavailable.'; }
      });
      stop.addEventListener('click', () => { if (rec && rec.state !== 'inactive') rec.stop(); dot.classList.remove('live'); start.disabled = false; stop.disabled = true; });
    });
  }

  /* ---------- DAILY REHEARSAL GENERATOR ---------- */
  const ACC = [
    { note: '3 NNC items closed ✔', s: 'closed out three NNC items' },
    { note: 'Rework batch 12 done', s: 'completed the rework on batch 12' },
    { note: 'Action plan updated w/ workshop', s: 'updated the action plan with the workshop' },
    { note: 'New operator trained', s: 'trained a new operator on the inspection process' },
    { note: 'Backlog cleared – initial handling', s: 'cleared the backlog on initial handling' },
    { note: 'Tooling issue solved', s: 'solved a tooling issue with maintenance' },
    { note: 'Conveyor jam fixed', s: 'fixed the conveyor jam in the morning' },
    { note: 'Drawings sent to engineering', s: 'sent the updated drawings to engineering' }
  ];
  const ACT = [
    { note: 'Workshop follow-up · 2 open items · 10am', s: 'follow up with the workshop on the two open items by 10 a.m.' },
    { note: 'Check scanner w/ IT', s: 'check the scanners with IT first thing in the morning' },
    { note: 'Review scrap w/ operators', s: 'review the scrap with the operators before the shift change' },
    { note: 'Root cause – rework batch', s: 'look into the root cause of the rework on the latest batch' },
    { note: 'Update KPI board', s: 'update the KPI board by the end of the day' },
    { note: 'Focus: 50 picks/h', s: 'focus on reaching 50 picks per hour' }
  ];
  const SUP = [
    { note: 'IT – 2 scanners down', s: 'we need support from IT to repair two scanners before the morning shift' },
    { note: 'Engineering – missing drawing', s: 'our main blocker is a missing drawing — we need it from engineering by tomorrow noon' },
    { note: 'Extra inspector Thu?', s: 'could we get an extra inspector on Thursday to absorb the peak?' },
    { note: 'Decision – rework priority', s: 'we need a decision from management on the rework priority' },
    { note: '—', s: 'no support needed today — thank you' }
  ];
  const OWNERS = ['Julie', 'Marc', 'I', 'we'];
  let currentScenario = null;
  function bindScenario() {
    $('#newScenario')?.addEventListener('click', () => newScenario(true));
    $('#scenarioDay')?.addEventListener('change', () => newScenario(true));
    $('#showScenarioModel')?.addEventListener('click', () => {
      const m = $('#scenarioModel'), a = $('#scenarioModelActions'); const show = m.hidden;
      m.hidden = !show; a.hidden = !show; $('#showScenarioModel').textContent = show ? 'Hide model' : 'Reveal model';
    });
  }
  function ownerSentence(owner, s) {
    if (owner === 'I') return `I'll ${s}`;
    if (owner === 'we') return `we're going to ${s}`;
    return `${owner} will ${s}`;
  }
  function newScenario(hideModel) {
    const box = $('#scenarioBoard'); if (!box) return;
    const d = Number($('#scenarioDay')?.value || 3), day = DAYS[d];
    const pe = [25, 30, 40, 50, 50][d - 1], se = [258, 200, 150, 129, 129][d - 1];
    const pa = Math.max(10, pe + rand(-6, 6)), sa = Math.max(80, se + rand(-30, 25));
    const acc = shuffle(ACC).slice(0, 3), acts = shuffle(ACT).slice(0, 2), sup = Math.random() < 0.2 ? SUP[4] : pick(SUP.slice(0, 4));
    const owners = shuffle(OWNERS).slice(0, 2);
    currentScenario = { day, pe, se, pa, sa, acc, acts, sup, owners };
    const pill = (good, mid, txt) => `<span class="kpi-pill ${good ? 'good' : mid ? 'mid' : 'bad'}">${txt}</span>`;
    box.innerHTML = `
      <div class="scenario-box"><h4>1 · KPIs · ${day}</h4>
        <p><strong>Picks per hour:</strong> ${pa} &nbsp;(estimate ${pe} · target 50 · stretch 75)<br>${pill(pa >= 50, pa >= pe, pa >= 50 ? 'at / above target' : pa >= pe ? 'on or above plan' : 'behind plan')}</p>
        <p><strong>Scrap:</strong> ${sa} pcs &nbsp;(estimate ${se} · target 129 · stretch 0)<br>${pill(sa <= 129, sa <= se, sa <= 129 ? 'at / below target' : sa <= se ? 'on or better than plan' : 'above plan')}</p></div>
      <div class="scenario-box"><h4>2 · Today's Accomplishment</h4><div class="stickies">${acc.map(a => `<div class="sticky">${a.note}</div>`).join('')}</div></div>
      <div class="scenario-box"><h4>3 · Tomorrow's Actions</h4><div class="stickies">${acts.map((a, i) => `<div class="sticky">${a.note}<br><strong>→ ${owners[i] === 'I' ? 'me' : owners[i] === 'we' ? 'team' : owners[i]}</strong></div>`).join('')}</div></div>
      <div class="scenario-box"><h4>4 · Support Needed</h4><div class="stickies"><div class="sticky">${sup.note === '—' ? 'Nothing today 👍' : sup.note}</div></div></div>`;
    // model text
    const pd = pa - pe;
    const pEst = pd === 0 ? `exactly in line with our estimate for ${day}` : `${Math.abs(pd)} ${pd > 0 ? 'above' : 'below'} our estimate for ${day}`;
    const pTar = pa === 50 ? 'right on the target of 50' : pa > 50 ? `${pa - 50} above the target of 50` : `still ${50 - pa} below the target of 50`;
    const pJoin = (pd >= 0) !== (pa >= 50) ? ', but ' : ', and ';
    const pMean = pa >= 50 ? 'That\'s a great result for the team.' : pd >= 0 ? 'So we\'re on plan and getting closer.' : 'So we\'re slightly behind plan today, and that\'s our focus for tomorrow.';
    const sd = sa - se;
    const sEst = sd === 0 ? 'exactly on our estimate' : `${Math.abs(sd)} pieces ${sd < 0 ? 'below' : 'above'} our estimate`;
    const sTar = sa === 129 ? 'right on target' : sa < 129 ? `${129 - sa} pieces below the target` : `${sa - 129} above the target of 129`;
    const sJoin = (sd <= 0) !== (sa <= 129) ? ', but ' : ', and ';
    const sMean = sa <= 129 ? 'That\'s excellent news.' : sd <= 0 ? 'So scrap is moving in the right direction.' : 'So scrap needs our attention tomorrow.';
    const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
    const a1 = ownerSentence(owners[0], acts[0].s), a2 = ownerSentence(owners[1], acts[1].s);
    const model = `Good morning, everyone. Here's today's update from our team.\n\n` +
      `Let's start with our KPIs. Picks per hour reached ${pa}, ${pEst}${pJoin}${pTar}. ${pMean} Scrap was ${sa} pieces, ${sEst}${sJoin}${sTar}. ${sMean}\n\n` +
      `Moving on to today's accomplishments: we ${acc[0].s}, ${acc[1].s}, and ${acc[2].s}.\n\n` +
      `Looking ahead to tomorrow, ${a1}, and ${a2}.\n\n` +
      `Finally, ${sup.s.startsWith('no support') ? sup.s : 'here\'s where we need support: ' + sup.s}.\n\n` +
      `That's it from our team. Any questions?`;
    $('#scenarioModel').textContent = model.replace(/\?\./g, '?').replace(/\. \./g, '.');
    if (hideModel) { $('#scenarioModel').hidden = true; $('#scenarioModelActions').hidden = true; $('#showScenarioModel').textContent = 'Reveal model'; }
  }

  /* ---------- SMALL TALK ---------- */
  const TALK = [
    { t: 'Before the meeting · arriving', lines: ['Hey Thomas! Welcome! How was your flight?'], fr: 'Avant la réunion : on vous demande comment s\'est passé le vol.',
      model: 'Hi! It was long, but pretty smooth, thanks. I\'m still a little jet-lagged, but it\'s great to be here. How\'s your week going so far?' },
    { t: 'Coffee break · after your presentation', lines: ['That was a really clear presentation. Nice job!'], fr: 'Pause café : on vous félicite pour votre présentation.',
      model: 'Thanks, I really appreciate it! I\'m glad the numbers made sense. Was there anything you\'d like me to go into in more detail?' },
    { t: 'Coffee break · a follow-up question', lines: ['Quick question — that follow-up time in the workshop, is that the same on every shift?'], fr: 'Pause café : une question de suivi sur vos données.',
      model: 'Good question. From what we\'ve seen, it\'s higher on the afternoon shift, but I\'d like to double-check before I give you a firm answer. Can I get back to you after lunch?' },
    { t: 'Lunch · getting to know each other', lines: ['So, what do you like to do when you\'re not at work?'], fr: 'Déjeuner : on vous demande ce que vous aimez faire en dehors du travail.',
      model: 'I like spending time outdoors and with my family — and good food, of course, I\'m French! What about you? Any recommendations for this weekend around here?' },
    { t: 'You didn\'t understand', lines: ['We\'re gonna circle back on the RCA after the offsite, yeah?'], fr: 'Vous n\'avez pas compris : demandez une clarification, sans stress.',
      model: 'Sorry, could you say that again a bit more slowly? Just to make sure I understand — you mean we\'ll come back to the root cause analysis after the offsite meeting?' },
    { t: 'End of the day · saying goodbye', lines: ['Great working with you today, Thomas. See you tomorrow?'], fr: 'Fin de journée : on vous dit au revoir.',
      model: 'Likewise — it was a great day, thanks for the warm welcome! Yes, see you tomorrow. Have a good evening!' }
  ];
  function buildTalk() {
    const sel = $('#talkSelect'); if (!sel) return;
    TALK.forEach((s, i) => { const o = document.createElement('option'); o.value = String(i); o.textContent = s.t; sel.appendChild(o); });
    sel.addEventListener('change', renderTalk);
    $('#talkScene').addEventListener('click', e => {
      if (e.target.closest('.talk-reveal')) { const m = $('.talk-model', $('#talkScene')); m.hidden = !m.hidden; }
    });
  }
  function renderTalk() {
    const sel = $('#talkSelect'), box = $('#talkScene'); if (!sel || !box) return;
    const s = TALK[Number(sel.value) || 0];
    box.innerHTML = `${s.lines.map(l => `<div class="talk-bubble"><small>American colleague</small>${esc(l)}</div>`).join('')}
      <p class="fr">${esc(s.fr)}</p>
      <div class="output-actions"><button class="mini-button speak-button" data-speak="${esc(s.lines.join(' '))}" type="button">🔊 Hear the colleague</button><button class="mini-button talk-reveal" type="button">Reveal model answer</button></div>
      <div class="talk-model" hidden><div class="talk-bubble you"><small>You</small>${esc(s.model)}</div><button class="mini-button speak-button" data-speak="${esc(s.model)}" type="button">🔊 Listen to the model</button></div>`;
  }

  /* ---------- MANUAL CHECKS + SAVE FIELDS ---------- */
  function bindManualChecks() { $$('input[data-check-score]').forEach(cb => cb.addEventListener('change', () => { save(); updateScores(); })); }
  function bindSaveFields() {
    $$('[data-save]').forEach(el => {
      el.addEventListener('input', () => { save(); updateReportPreview(); });
      el.addEventListener('change', () => { save(); if (el.id === 'confidenceSlider') updateConfidence(); updateReportPreview(); });
    });
    updateConfidence();
  }

  /* ---------- RESETS ---------- */
  function bindResets() {
    $$('.reset-section').forEach(btn => btn.addEventListener('click', () => {
      const section = btn.closest('.lesson-section'); if (!section) return;
      $$('input,textarea,select', section).forEach(el => {
        if (el.matches('[type="checkbox"]')) el.checked = false;
        else if (el.matches('[type="range"]')) el.value = el.defaultValue || 5;
        else if (el.tagName === 'SELECT') { const def = [...el.options].findIndex(o => o.defaultSelected); el.selectedIndex = def >= 0 ? def : 0; }
        else el.value = el.defaultValue || '';
      });
      $$('.quiz-item', section).forEach(item => {
        $$('button[data-choice]', item).forEach(x => x.classList.remove('correct', 'wrong'));
        const fb = $('.feedback', item); fb.textContent = ''; fb.className = 'feedback';
        delete state.quizCorrect[item.dataset.qid];
      });
      if (section.id === 'transitions') { state.seqCorrect = false; $('#seqReset')?.click(); }
      $$('.block.open', section).forEach(b => b.classList.remove('open'));
      updateBuilders(); updateKpiTool(); renderTalk(); updateConfidence(); save(); updateScores(); toast('Section reset.');
    }));
    $('#resetAll')?.addEventListener('click', () => {
      if (!confirm('Reset the whole lesson and delete saved progress?')) return;
      try { localStorage.removeItem(KEY); } catch (e) { }
      location.reload();
    });
  }

  /* ---------- SCORES + REPORT ---------- */
  const SKILLS = ['board', 'kpi', 'done', 'next', 'help', 'voice', 'connect', 'talk'];
  function scoresBySkill() {
    const out = {}; SKILLS.forEach(k => out[k] = [0, 0]);
    $$('.quiz-item').forEach(item => {
      const k = item.dataset.skill; if (!out[k]) return;
      out[k][1]++; if (state.quizCorrect[item.dataset.qid]) out[k][0]++;
    });
    out.done[0] += convScore(); out.done[1] += 4;
    out.seq = [state.seqCorrect ? 1 : 0, 1];
    out.manual = [$$('input[data-check-score]:checked').length, $$('input[data-check-score]').length];
    return out;
  }
  const IDS = { board: 'scoreBoard', kpi: 'scoreKpi', done: 'scoreDone', next: 'scoreNext', help: 'scoreHelp', voice: 'scoreVoice', connect: 'scoreConnect', talk: 'scoreTalk', seq: 'scoreSeq', manual: 'scoreManual' };
  function updateScores() {
    const by = scoresBySkill(); let c = 0, t = 0;
    Object.entries(IDS).forEach(([k, id]) => { const [a, b] = by[k]; setText(id, `${a} / ${b}`); c += a; t += b; });
    setText('scoreTop', `${c} / ${t}`);
    updateReportPreview();
  }
  function setText(id, text) { const el = $('#' + id); if (el) el.textContent = text; }
  function bindReport() {
    $('#confidenceSlider')?.addEventListener('input', () => { updateConfidence(); save(); updateReportPreview(); });
    $('#copyReport')?.addEventListener('click', () => copyText(buildReportText()));
    $('#downloadReport')?.addEventListener('click', downloadReport);
    $('#printReport')?.addEventListener('click', () => window.print());
  }
  function updateConfidence() { if ($('#confidenceValue') && $('#confidenceSlider')) $('#confidenceValue').textContent = `${$('#confidenceSlider').value} / 10`; }
  function buildReportText() {
    const by = scoresBySkill(); const f = k => `${by[k][0]} / ${by[k][1]}`;
    const val = k => $(`[data-save="${k}"]`)?.value.trim() || '—';
    const statuses = $$('.manual-evaluation select').map(s => `${s.parentElement.childNodes[0].textContent.trim()}: ${s.value}`);
    return `THOMAS BECCARDI — LESSON 4 — PRESENT WITH IMPACT
${$('#dateStamp')?.textContent || ''}

OBJECTIVES
• Present the daily 4-block Team Leader slide in English (KPIs, accomplishments, actions, support).
• Use transitions to guide the audience from block to block.
• Use pauses, word stress and falling intonation to deliver key messages.
• Connect with an American audience: hook, before → after, emotion, call to action.
• Deliver the October kickoff with stage cues; handle questions and small talk naturally.

AUTOMATIC / OBSERVABLE EVIDENCE
Identifying the 4 blocks: ${f('board')}
Block 1 · KPI language: ${f('kpi')}
Block 2 · Accomplishments (past simple): ${f('done')}
Block 3 · Actions (future forms): ${f('next')}
Block 4 · Support requests: ${f('help')}
Transition order: ${f('seq')}
Voice · pausing & stress: ${f('voice')}
Connecting & convincing: ${f('connect')}
Small talk: ${f('talk')}
Manual speaking checkpoints: ${f('manual')}

TRAINER STATUS
${statuses.join('\n')}

STRENGTHS
${val('report-strengths')}

POINTS TO REINFORCE
${val('report-focus')}

NEXT LESSON PRIORITY
${val('report-next')}

CONFIDENCE PRESENTING IN ENGLISH
${$('#confidenceSlider')?.value || '5'} / 10

REAL PROFESSIONAL TRANSFER
Daily 4-block Team Leader meeting in English from the week of 12 October 2026.
October kickoff with American colleagues · performance script with stage cues.

CFL Welcome · SpeakEasyTisha · Suivi pédagogique Qualiopi`;
  }
  function updateReportPreview() { const p = $('#reportPreview'); if (p) p.textContent = buildReportText(); }
  function downloadReport() {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Thomas Lesson 4 Report</title><style>body{font-family:Arial,sans-serif;background:#fffaf0;color:#222;line-height:1.55;margin:0}.page{max-width:900px;margin:28px auto;background:#fff;border:1px solid #e9e2d5;border-radius:20px;overflow:hidden}.head{background:#111;color:#fff;padding:26px;border-bottom:6px solid #f2b822}.head small{color:#f2b822;font-weight:bold;letter-spacing:.1em}.body{padding:26px}pre{white-space:pre-wrap;font:14px/1.6 Arial,sans-serif}.foot{padding:18px 26px;background:#111;color:#ddd;font-size:12px}@media print{.page{margin:0;max-width:none;border:0;border-radius:0}}</style></head><body><div class="page"><div class="head"><small>CFL WELCOME · LESSON 4</small><h1>Thomas Beccardi</h1><p>Present With Impact · 4-Block Update &amp; Kickoff</p></div><div class="body"><pre>${esc(buildReportText())}</pre></div><div class="foot">SpeakEasyTisha · Tisha Douty-Dosiere · Qualiopi progress evidence</div></div></body></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'Thomas-Lesson-4-Progress-Report.html'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 800); toast('HTML report downloaded.');
  }

  /* ---------- PERSISTENCE ---------- */
  function save() {
    const data = { sectionIndex: state.sectionIndex, sessionSeconds: state.sessionSeconds, showFr: document.body.classList.contains('show-fr'), quizCorrect: state.quizCorrect, seqCorrect: state.seqCorrect, fields: {}, checks: {}, builders: [] };
    $$('[data-save]').forEach(el => data.fields[el.dataset.save] = el.value);
    $$('input[data-check-score]').forEach((el, i) => data.checks[i] = el.checked);
    $$('[data-builder]').forEach(el => data.builders.push(el.value));
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { }
  }
  function restore() {
    let d = null; try { d = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { }
    if (!d) return;
    state.sectionIndex = Math.min(Number(d.sectionIndex) || 0, sections.length - 1);
    state.sessionSeconds = Number.isFinite(d.sessionSeconds) ? d.sessionSeconds : 75 * 60;
    state.quizCorrect = d.quizCorrect || {}; state.seqCorrect = !!d.seqCorrect;
    document.body.classList.toggle('show-fr', d.showFr !== false); setFrButton(d.showFr !== false);
    $$('[data-save]').forEach(el => { if (d.fields && d.fields[el.dataset.save] !== undefined) el.value = d.fields[el.dataset.save]; });
    $$('input[data-check-score]').forEach((el, i) => { el.checked = !!(d.checks && d.checks[i]); });
    if (Array.isArray(d.builders)) $$('[data-builder]').forEach((el, i) => { if (d.builders[i] !== undefined && [...el.options].some(o => o.value === d.builders[i])) el.value = d.builders[i]; });
    $$('.quiz-item').forEach(item => {
      if (!state.quizCorrect[item.dataset.qid]) return;
      $(`button[data-choice="${item.dataset.answer}"]`, item)?.classList.add('correct');
      const fb = $('.feedback', item); if (fb) { fb.textContent = '✓ Correct — well done!'; fb.className = 'feedback good'; }
    });
    if (state.seqCorrect) { const fb = $('#seqFeedback'); if (fb) { fb.textContent = '✓ Order already completed correctly.'; fb.className = 'feedback good'; } }
    updateSessionTimer(); updateConfidence();
  }

  /* ---------- UTILITIES ---------- */
  function copyText(text) {
    if (!text.trim()) { toast('Nothing to copy.'); return; }
    const fallback = () => { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) { } ta.remove(); toast('Copied.'); };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => toast('Copied.')).catch(fallback); else fallback();
  }
  function setDate() { const el = $('#dateStamp'); if (el) el.textContent = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date()); }
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._to); t._to = setTimeout(() => t.classList.remove('show'), 2200); }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
})();
