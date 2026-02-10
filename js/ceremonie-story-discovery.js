/* SpeakEasyTisha • Ceremonie Story Discovery
   Fully client-side, touch-friendly (no drag & drop needed).
*/
(() => {
  'use strict';

  // ---------- tiny helpers ----------
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ---------- persistent state ----------
  const KEY = 'set_ceremonie_story_discovery_v1';
  const state = {
    score: 0,
    checked: 0,
    accent: 'en-US',
    showFR: false
  };

  function loadState(){
    try{
      const raw = localStorage.getItem(KEY);
      if(raw){
        const s = JSON.parse(raw);
        if(typeof s.score === 'number') state.score = s.score;
        if(typeof s.checked === 'number') state.checked = s.checked;
        if(typeof s.accent === 'string') state.accent = s.accent;
        if(typeof s.showFR === 'boolean') state.showFR = s.showFR;
      }
    }catch(_e){}
  }
  function saveState(){
    try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(_e){}
  }

  function setScore(delta, checkedDelta=0){
    state.score = Math.max(0, state.score + delta);
    state.checked = Math.max(0, state.checked + checkedDelta);
    updateHUD();
    saveState();
  }
  function updateHUD(){
    $('#score').textContent = String(state.score);
    $('#checked').textContent = String(state.checked);
    const targetChecks = 18; // a soft goal, not strict
    const pct = Math.max(0, Math.min(100, Math.round((state.checked / targetChecks) * 100)));
    $('#progressBar').style.width = pct + '%';
  }

  // ---------- speech synthesis (US/UK) ----------
  function getVoice(lang){
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    const prefers = lang === 'en-GB'
      ? [/en-GB/i, /British/i]
      : [/en-US/i, /American/i];

    // 1) best match
    for(const rx of prefers){
      const v = voices.find(vv => rx.test(vv.lang) || rx.test(vv.name));
      if(v) return v;
    }
    // 2) any English
    return voices.find(v => /en/i.test(v.lang)) || null;
  }

  function speak(text){
    if(!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = state.accent;
    const v = getVoice(state.accent);
    if(v) utter.voice = v;
    utter.rate = 0.95;
    utter.pitch = 1.0;
    try{
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
    }catch(_e){}
  }

  // iOS needs a user gesture before voices load
  function primeVoices(){
    if(!window.speechSynthesis) return;
    try { speechSynthesis.getVoices(); } catch(_e){}
  }
  document.addEventListener('click', primeVoices, { once: true, passive: true });

  // ---------- data ----------
  const services = [
    {
      key:'planner',
      icon:'🗓️',
      name:'Wedding planner',
      tag:'Plan • organise • coordinate',
      body:`They plan the event step by step: budget, timeline, suppliers, logistics, and the day‑of schedule.`,
      fr:`Ils organisent l’évènement : budget, planning, prestataires, logistique, déroulé du jour J.`
    },
    {
      key:'officiant',
      icon:'🎤',
      name:'Ceremony officiant',
      tag:'Write • guide • celebrate',
      body:`They write and lead a personalised ceremony, help with speeches, and create an emotional flow.`,
      fr:`Ils écrivent et animent une cérémonie personnalisée, aident aux discours, créent un déroulé émouvant.`
    },
    {
      key:'design',
      icon:'🌸',
      name:'Décor & floral design',
      tag:'Style • staging • flowers',
      body:`They imagine a visual universe: colours, materials, flowers, table settings, and scenography.`,
      fr:`Ils créent l’univers visuel : couleurs, matières, fleurs, tables, scénographie.`
    },
    {
      key:'pro',
      icon:'🤝',
      name:'Professional events',
      tag:'Brand • experience • hospitality',
      body:`They organise and decorate corporate events: launches, receptions, seminars, team moments.`,
      fr:`Ils organisent et décorent des évènements pro : lancements, réceptions, séminaires, team‑building.`
    },
    {
      key:'training',
      icon:'🎓',
      name:'Training & coaching',
      tag:'Teach • mentor • practice',
      body:`They share know‑how through training/coaching: methods, tools, and real‑world practice.`,
      fr:`Ils proposent formation/coaching : méthodes, outils, entraînement concret.`
    },
    {
      key:'venue',
      icon:'🏰',
      name:'Venue / location',
      tag:'Where it happens',
      body:`They work in Strasbourg and the region, sometimes in venues such as the Château de Pourtalès.`,
      fr:`Ils travaillent à Strasbourg et dans la région, parfois dans des lieux comme le Château de Pourtalès.`
    },
    {
      key:'mission',
      icon:'🎯',
      name:'Mission',
      tag:'A promise',
      body:`Create a wedding that feels true to the couple, with calm coordination and elegant details.`,
      fr:`Créer un mariage fidèle au couple, avec une coordination sereine et des détails élégants.`
    },
    {
      key:'team',
      icon:'🌿',
      name:'The team',
      tag:'Human • creative • rigorous',
      body:`A passionate team that listens, guides, reassures, and turns ideas into a clear plan.`,
      fr:`Une équipe passionnée : écoute, guide, rassure, et transforme des idées en plan clair.`
    }
  ];

  const vocab = [
    {icon:'💍', term:'wedding', pos:'noun', fr:'mariage', def:'the ceremony and celebration when two people get married', ex:'They plan a wedding in Strasbourg.'},
    {icon:'🗓️', term:'timeline', pos:'noun', fr:'planning / chronologie', def:'a schedule of key moments and deadlines', ex:'The timeline includes suppliers and timings.'},
    {icon:'🤝', term:'supplier', pos:'noun', fr:'prestataire', def:'a company or person who provides a service', ex:'They coordinate suppliers (DJ, caterer, florist).'},
    {icon:'🎤', term:'officiant', pos:'noun', fr:'officiant(e)', def:'the person who leads a ceremony', ex:'The officiant welcomes the guests and tells the story.'},
    {icon:'🌸', term:'floral design', pos:'noun', fr:'design floral', def:'the art of creating flower arrangements', ex:'Floral design can match the colour theme.'},
    {icon:'🕯️', term:'atmosphere', pos:'noun', fr:'ambiance', def:'the mood or feeling of a place', ex:'Candles create a warm atmosphere.'},
    {icon:'🎯', term:'mission', pos:'noun', fr:'mission', def:'the main purpose of a person or organisation', ex:'Their mission is to reduce stress for clients.'},
    {icon:'🧩', term:'on‑site coordination', pos:'noun', fr:'coordination sur place', def:'managing the event directly at the venue', ex:'On‑site coordination avoids last‑minute surprises.'},
    {icon:'📍', term:'based in', pos:'phrase', fr:'basé à', def:'located in (home city)', ex:'They are based in Strasbourg.'},
    {icon:'🏰', term:'venue', pos:'noun', fr:'lieu de réception', def:'the place where an event happens', ex:'The venue can be a castle or a villa.'},
    {icon:'🎨', term:'scenography', pos:'noun', fr:'scénographie', def:'the design of the visual setting', ex:'Scenography includes lights, tables, and flowers.'},
    {icon:'🧠', term:'tailor‑made', pos:'adjective', fr:'sur‑mesure', def:'made for one person’s needs', ex:'They create a tailor‑made experience.'},
    {icon:'🗣️', term:'speech', pos:'noun', fr:'discours', def:'a short formal talk in front of people', ex:'They help you write a speech.'},
    {icon:'🧾', term:'budget', pos:'noun', fr:'budget', def:'the amount of money planned for something', ex:'They build a realistic budget.'},
    {icon:'⏱️', term:'timing', pos:'noun', fr:'timing', def:'the exact time something happens', ex:'Timing matters during the ceremony.'},
    {icon:'✅', term:'to ensure', pos:'verb', fr:'s’assurer', def:'to make sure that something happens', ex:'They ensure everything runs smoothly.'},
  ];

  const readingTexts = {
    A2: {
      title: 'Text A2 — Simple',
      meta: 'Short sentences • simple present • basic vocabulary',
      html: `
        <p><strong>Ceremonie Story is a wedding and event team.</strong> They are based in Strasbourg, in Alsace.</p>
        <p>They help couples plan their wedding. They also create decoration and flowers. Sometimes, they work in beautiful venues, like the Château de Pourtalès.</p>
        <p>Their mission is simple: make the day easy and special. They listen, they organise, and they guide the couple step by step.</p>
      `
    },
    B1: {
      title: 'Text B1 — Clear & connected',
      meta: 'More detail • connectors (because, so, however) • purpose',
      html: `
        <p><strong>Ceremonie Story is a team that supports weddings and events in Strasbourg and the region.</strong> They work with couples who want an elegant celebration that truly fits their personality.</p>
        <p>They can plan the wedding, coordinate suppliers, and design the decor and flowers. In addition, they can lead a personalised ceremony, so the day feels meaningful, not generic.</p>
        <p>Their mission is to reduce stress because timing and details matter. They listen carefully, transform ideas into a clear plan, and stay present on the day of the event.</p>
      `
    },
    B2: {
      title: 'Text B2 — Polished & nuanced',
      meta: 'Passive voice • richer vocabulary • nuance and promise',
      html: `
        <p><strong>Ceremonie Story is an experienced wedding and event team based in Strasbourg (Alsace–Lorraine).</strong> Each celebration is designed around the couple’s story and translated into a coherent plan, from the first meeting to the final moments.</p>
        <p>Depending on the needs, the day can be planned, styled, and coordinated: suppliers are briefed, timelines are refined, and the atmosphere is crafted through scenography and floral design. A personalised ceremony may also be written and led to create an authentic emotional flow.</p>
        <p>Their goal is to deliver elegance without losing authenticity, so clients can enjoy the experience with confidence. They are known for attentive communication, creative solutions, and rigorous organisation—even in prestigious venues such as the Château de Pourtalès.</p>
      `
    }
  };

  // ---------- renderers ----------
  function renderServices(){
    const grid = $('#serviceGrid');
    grid.innerHTML = services.map(s => `
      <article class="service" tabindex="0" role="button" aria-expanded="false" data-key="${s.key}">
        <div class="service__top">
          <div class="service__icon" aria-hidden="true">${s.icon}</div>
          <div>
            <p class="service__name">${escapeHtml(s.name)}</p>
            <p class="service__tag">${escapeHtml(s.tag)}</p>
          </div>
        </div>
        <div class="service__body">
          <p>${escapeHtml(s.body)}</p>
          <p class="fr fr-hide" data-fr="${escapeHtml(s.fr)}">${escapeHtml(s.fr)}</p>
          <p class="fine">Tap again to close.</p>
        </div>
      </article>
    `).join('');

    const toggle = (el) => {
      const open = el.classList.toggle('is-open');
      el.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    $$('.service', grid).forEach(card => {
      card.addEventListener('click', () => toggle(card));
      card.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          toggle(card);
        }
      });
    });
  }

  function renderVocab(list){
    const grid = $('#vocabGrid');
    const items = list ?? vocab;

    grid.innerHTML = items.map((v, idx) => `
      <article class="vcard" data-idx="${idx}" tabindex="0" role="button" aria-label="Vocabulary card: ${escapeHtml(v.term)}">
        <div class="vcard__btns">
          <button class="iconBtn" type="button" data-action="speak" title="Listen" aria-label="Listen to ${escapeHtml(v.term)}">🔊</button>
          <button class="iconBtn" type="button" data-action="flip" title="Flip card" aria-label="Flip card">↺</button>
        </div>

        <div class="vcard__face vcard__front">
          <div class="vcard__top">
            <div class="vicon" aria-hidden="true">${v.icon}</div>
            <div>
              <p class="vterm">${escapeHtml(v.term)}</p>
              <p class="vpos">${escapeHtml(v.pos)}</p>
            </div>
          </div>
          <div class="vmeta">
            <div><strong>Definition:</strong> ${escapeHtml(v.def)}</div>
            <div class="fr fr-hide" data-fr="Traduction : ${escapeHtml(v.fr)}">Traduction: ${escapeHtml(v.fr)}</div>
          </div>
        </div>

        <div class="vcard__face vcard__back">
          <div class="vcard__top">
            <div class="vicon" aria-hidden="true">${v.icon}</div>
            <div>
              <p class="vterm">${escapeHtml(v.term)} <span class="badge">FR: ${escapeHtml(v.fr)}</span></p>
              <p class="vpos">Example</p>
            </div>
          </div>
          <div class="vmeta">
            <div>${escapeHtml(v.ex)}</div>
            <div class="fine">Tap card to flip back.</div>
          </div>
        </div>
      </article>
    `).join('');

    function flip(card){
      card.classList.toggle('is-flipped');
    }

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      const card = e.target.closest('.vcard');
      if(!card) return;

      if(btn){
        const action = btn.dataset.action;
        const idx = parseInt(card.dataset.idx, 10);
        const item = items[idx];
        if(action === 'speak') speak(`${item.term}. ${item.ex}`);
        if(action === 'flip') flip(card);
        e.stopPropagation();
        return;
      }
      flip(card);
    });

    grid.addEventListener('keydown', (e) => {
      if(e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.vcard');
      if(card){
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
  }

  function renderWarmup(){
    const el = $('#warmupQuiz');
    const q = {
      id: 'warm',
      prompt: 'What do you think Ceremonie Story does?',
      small: 'Pick 2 ideas (then check).',
      answer: ['plans weddings','designs decor']
    };
    const opts = shuffle([
      'sells cars',
      'plans weddings',
      'builds houses',
      'designs decor',
      'teaches maths',
      'repairs phones'
    ]);

    el.innerHTML = `
      <div class="q" data-id="${q.id}">
        <div class="qhead">
          <div>
            <p class="qtitle">${escapeHtml(q.prompt)}</p>
            <p class="qsmall">${escapeHtml(q.small)}</p>
            <p class="qsmall fr fr-hide" data-fr="Choisis 2 réponses.">Choisis 2 réponses.</p>
          </div>
          <span class="badge" id="warmBadge">Not checked</span>
        </div>
        <div class="opts">${opts.map(o => `<button class="opt" type="button" data-v="${escapeHtml(o)}">${escapeHtml(o)}</button>`).join('')}</div>
        <div class="row">
          <button class="btn btn--primary" type="button" id="warmCheck">Check</button>
          <button class="btn" type="button" id="warmClear">Clear</button>
        </div>
      </div>
    `;

    const chosen = new Set();
    el.addEventListener('click', (e) => {
      const opt = e.target.closest('.opt');
      if(opt){
        const v = opt.dataset.v;
        if(chosen.has(v)){ chosen.delete(v); opt.classList.remove('is-picked'); }
        else {
          if(chosen.size >= 2) return;
          chosen.add(v);
          opt.classList.add('is-picked');
        }
        return;
      }
    });

    $('#warmClear').addEventListener('click', () => {
      chosen.clear();
      $$('.opt', el).forEach(b => b.classList.remove('is-picked','is-correct','is-wrong'));
      const b = $('#warmBadge'); b.textContent = 'Not checked'; b.className = 'badge';
    });

    $('#warmCheck').addEventListener('click', () => {
      const picks = Array.from(chosen);
      const ok = q.answer.every(a => chosen.has(a)) && chosen.size === 2;
      $$('.opt', el).forEach(b => {
        if(q.answer.includes(b.dataset.v)) b.classList.add('is-correct');
        if(picks.includes(b.dataset.v) && !q.answer.includes(b.dataset.v)) b.classList.add('is-wrong');
      });
      const badge = $('#warmBadge');
      badge.textContent = ok ? 'Great!' : 'Try again';
      badge.className = 'badge ' + (ok ? 'ok' : 'no');
      setScore(ok ? 2 : 0, 1);
    });
  }

  // quiz components
  function mcq(el, items){
    el.innerHTML = items.map((it, i) => `
      <div class="q" data-q="${i}">
        <div class="qhead">
          <div>
            <p class="qtitle">${escapeHtml(it.prompt)}</p>
            ${it.small ? `<p class="qsmall">${escapeHtml(it.small)}</p>` : ``}
            ${it.fr ? `<p class="qsmall fr fr-hide" data-fr="${escapeHtml(it.fr)}">${escapeHtml(it.fr)}</p>` : ``}
          </div>
          <span class="badge" data-badge>Not checked</span>
        </div>
        <div class="opts">
          ${it.options.map(o => `<button class="opt" type="button" data-opt="${escapeHtml(o)}">${escapeHtml(o)}</button>`).join('')}
        </div>
      </div>
    `).join('');

    el.addEventListener('click', (e) => {
      const btn = e.target.closest('.opt');
      if(!btn) return;

      const qEl = btn.closest('.q');
      if(!qEl || qEl.dataset.locked === '1') return;

      const idx = parseInt(qEl.dataset.q, 10);
      const it = items[idx];
      const chosen = btn.dataset.opt;

      // lock, mark
      qEl.dataset.locked = '1';
      $$('.opt', qEl).forEach(b => {
        if(b.dataset.opt === it.answer) b.classList.add('is-correct');
        if(b.dataset.opt === chosen && chosen !== it.answer) b.classList.add('is-wrong');
      });

      const ok = chosen === it.answer;
      const badge = $('[data-badge]', qEl);
      badge.textContent = ok ? 'Correct' : 'Not quite';
      badge.classList.add(ok ? 'ok' : 'no');

      if(it.say) speak(it.say);
      setScore(ok ? 2 : 0, 1);
    });
  }

  function matchSelect(el, items){
    // items: {prompt, options[], answer, fr?}
    const allOptions = items[0]?.options || [];
    el.innerHTML = items.map((it, i) => `
      <div class="q" data-q="${i}">
        <div class="qhead">
          <div>
            <p class="qtitle">${escapeHtml(it.prompt)}</p>
            ${it.fr ? `<p class="qsmall fr fr-hide" data-fr="${escapeHtml(it.fr)}">${escapeHtml(it.fr)}</p>` : ``}
          </div>
          <span class="badge" data-badge>Not checked</span>
        </div>
        <div class="row">
          <select class="input" data-sel aria-label="Choose an answer">
            <option value="">Choose…</option>
            ${allOptions.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join('')}
          </select>
          <button class="btn btn--primary" type="button" data-check>Check</button>
          <button class="btn" type="button" data-show>Show</button>
        </div>
      </div>
    `).join('');

    el.addEventListener('click', (e) => {
      const qEl = e.target.closest('.q');
      if(!qEl) return;
      const idx = parseInt(qEl.dataset.q, 10);
      const it = items[idx];

      const sel = $('[data-sel]', qEl);
      const badge = $('[data-badge]', qEl);

      if(e.target.matches('[data-show]')){
        sel.value = it.answer;
        badge.textContent = 'Shown';
        badge.className = 'badge';
        return;
      }
      if(e.target.matches('[data-check]')){
        const ok = sel.value === it.answer;
        badge.textContent = ok ? 'Correct' : 'Try again';
        badge.className = 'badge ' + (ok ? 'ok' : 'no');
        setScore(ok ? 2 : 0, 1);
      }
    });
  }

  // ---------- reading ----------
  let activeText = 'A2';
  let compareMode = false;

  function renderReading(){
    const wrap = $('#readingWrap');
    if(compareMode){
      wrap.innerHTML = `
        <div class="compare">
          <div class="col">
            <h4>Text A2</h4>
            <div class="meta">${escapeHtml(readingTexts.A2.meta)}</div>
            ${readingTexts.A2.html}
          </div>
          <div class="col">
            <h4>Text B2</h4>
            <div class="meta">${escapeHtml(readingTexts.B2.meta)}</div>
            <p><mark>Notice</mark>: longer sentences, passive voice, richer vocabulary, nuance.</p>
            ${readingTexts.B2.html}
          </div>
        </div>
      `;
      return;
    }
    const t = readingTexts[activeText];
    wrap.innerHTML = `
      <div class="meta">${escapeHtml(t.meta)}</div>
      <h3 class="h3" style="margin-top:10px">${escapeHtml(t.title)}</h3>
      ${t.html}
      <div class="row">
        <button class="btn" type="button" data-say-reading>🔊 Listen</button>
        <button class="btn" type="button" data-copy-reading>Copy</button>
      </div>
    `;
    $('[data-say-reading]', wrap).addEventListener('click', () => {
      const plain = wrap.innerText.replace(/\s+/g,' ').trim();
      speak(plain);
    });
    $('[data-copy-reading]', wrap).addEventListener('click', async () => {
      try{
        await navigator.clipboard.writeText(wrap.innerText.trim());
      }catch(_e){}
    });
  }

  // ---------- practice activities ----------
  function renderReadingChecks(){
    // key info MCQ
    const check1 = [
      {
        prompt: 'Where are they based?',
        options: shuffle(['Strasbourg','London','New York','Madrid']),
        answer: 'Strasbourg',
        fr: 'Où sont-ils basés ?',
        say: 'They are based in Strasbourg.'
      },
      {
        prompt: 'Which service is mentioned?',
        options: shuffle(['wedding planning','car repair','language tutoring','house painting']),
        answer: 'wedding planning',
        fr: 'Quel service est mentionné ?',
        say: 'Wedding planning.'
      },
      {
        prompt: 'A venue example is…',
        options: shuffle(['Château de Pourtalès','Eiffel Tower','Big Ben','Times Square']),
        answer: 'Château de Pourtalès',
        fr: 'Un exemple de lieu est…',
        say: 'The Château de Pourtalès.'
      }
    ];
    mcq($('#readingCheck'), check1);

    // connectors
    const conn = [
      {
        prompt: 'Their mission is to reduce stress ____ timing and details matter.',
        options: shuffle(['because','but','although','unless']),
        answer: 'because',
        fr: 'Choisis le bon connecteur.'
      },
      {
        prompt: 'They organise the day ____ you can enjoy every moment.',
        options: shuffle(['so','yet','unless','whereas']),
        answer: 'so',
        fr: 'Choisis le bon connecteur.'
      },
      {
        prompt: 'They aim for elegance ____ they keep authenticity.',
        options: shuffle(['while','since','because','therefore']),
        answer: 'while',
        fr: 'Choisis le bon connecteur.'
      }
    ];
    mcq($('#connectorCheck'), conn);
  }

  function renderVocabMini(){
    // Match meaning (dropdown)
    const opts = ['timeline','officiant','venue','supplier'];
    const items = [
      { prompt: 'The person who leads the ceremony', answer: 'officiant', options: opts, fr: 'La personne qui anime la cérémonie' },
      { prompt: 'The place where the event happens', answer: 'venue', options: opts, fr: 'Le lieu où se passe l’évènement' },
      { prompt: 'A company/person who provides a service', answer: 'supplier', options: opts, fr: 'Un prestataire' },
      { prompt: 'The schedule of moments and deadlines', answer: 'timeline', options: opts, fr: 'Le planning' },
    ];
    matchSelect($('#vocabMatch'), items);

    // MCQ choose best word
    const items2 = [
      { prompt: 'They ____ everything runs smoothly.', options: shuffle(['ensure','decorate','forget','break']), answer:'ensure', fr:'Ils s’assurent que tout se passe bien.' },
      { prompt: 'Candles create a warm ____.', options: shuffle(['atmosphere','budget','supplier','speech']), answer:'atmosphere', fr:'Les bougies créent une ambiance.' },
      { prompt: 'They coordinate the day‑of ____.', options: shuffle(['timing','shoes','weather','traffic']), answer:'timing', fr:'Ils coordonnent le timing du jour J.' },
    ];
    mcq($('#vocabMCQ'), items2);
  }

  function renderGaps(){
    const box = $('#gapBox');
    const tpl = `
      Our <strong>mission</strong> is to <input class="gap" data-a="create" aria-label="gap 1" /> elegant weddings that fit the couple’s story.
      We <input class="gap" data-a="coordinate" aria-label="gap 2" /> suppliers and manage the <input class="gap" data-a="timeline" aria-label="gap 3" />.
      We are <input class="gap" data-a="based" aria-label="gap 4" /> in Strasbourg and we sometimes work in a <input class="gap" data-a="venue" aria-label="gap 5" /> such as the Château de Pourtalès.
    `;
    box.innerHTML = tpl;
  }

  function checkGaps(show=false){
    const gaps = $$('.gap', $('#gapBox'));
    let allOk = true;
    gaps.forEach(g => {
      const ans = g.dataset.a;
      if(show){
        g.value = ans;
        g.classList.remove('ok','no');
        return;
      }
      const v = (g.value || '').trim().toLowerCase();
      const ok = v === ans.toLowerCase();
      g.classList.toggle('ok', ok);
      g.classList.toggle('no', !ok);
      if(!ok) allOk = false;
    });
    if(!show){
      setScore(allOk ? 3 : 0, 1);
    }
  }

  function renderWordOrder(){
    const el = $('#wordOrder');
    const sentences = [
      { s: 'We help couples plan their wedding in Strasbourg.', fr:'Nous aidons les couples à organiser leur mariage à Strasbourg.' },
      { s: 'Our mission is to reduce stress and create a beautiful atmosphere.', fr:'Notre mission est de réduire le stress et de créer une belle ambiance.' },
      { s: 'Suppliers are briefed and the timeline is refined.', fr:'Les prestataires sont briefés et le planning est affiné.' }
    ];
    const pick = sentences[Math.floor(Math.random()*sentences.length)];
    const words = shuffle(pick.s.replace(/[.]/g,'').split(' '));
    el.innerHTML = `
      <div class="q">
        <div class="qhead">
          <div>
            <p class="qtitle">Build the sentence</p>
            <p class="qsmall">${escapeHtml(pick.s)}</p>
            <p class="qsmall fr fr-hide" data-fr="${escapeHtml(pick.fr)}">${escapeHtml(pick.fr)}</p>
          </div>
          <span class="badge" data-badge>Not checked</span>
        </div>

        <div class="tray" data-tray>
          ${words.map(w => `<button class="word" type="button" data-w="${escapeHtml(w)}">${escapeHtml(w)}</button>`).join('')}
        </div>

        <div class="slot" aria-label="Your sentence">
          <div class="tray" data-slot></div>
        </div>

        <div class="row">
          <button class="btn btn--primary" type="button" data-check>Check</button>
          <button class="btn" type="button" data-reset>Reset</button>
          <button class="btn" type="button" data-say>🔊 Speak</button>
        </div>
      </div>
    `;

    const tray = $('[data-tray]', el);
    const slot = $('[data-slot]', el);
    const badge = $('[data-badge]', el);
    const target = pick.s.replace(/\s+/g,' ').trim();

    function sentenceFromSlot(){
      const ws = $$('.word', slot).map(b => b.dataset.w);
      return ws.join(' ') + '.';
    }

    function move(btn, to){
      btn.classList.add('is-picked');
      to.appendChild(btn);
    }

    el.addEventListener('click', (e) => {
      const btn = e.target.closest('.word');
      if(btn){
        if(btn.parentElement === tray) move(btn, slot);
        else { btn.classList.remove('is-picked'); tray.appendChild(btn); }
      }
      if(e.target.matches('[data-reset]')){
        // move all back
        $$('.word', slot).forEach(b => { b.classList.remove('is-picked'); tray.appendChild(b); });
        badge.textContent = 'Not checked';
        badge.className = 'badge';
      }
      if(e.target.matches('[data-say]')){
        speak(sentenceFromSlot());
      }
      if(e.target.matches('[data-check]')){
        const built = sentenceFromSlot().replace(/\s+/g,' ').trim();
        const ok = built === target;
        badge.textContent = ok ? 'Correct' : 'Try again';
        badge.className = 'badge ' + (ok ? 'ok' : 'no');
        setScore(ok ? 3 : 0, 1);
      }
    });
  }

  function renderRoleMatch(){
    const roles = [
      { role: 'Wedding planner', fn: 'Builds the plan, budget, and timeline.' },
      { role: 'Officiant', fn: 'Writes and leads the ceremony.' },
      { role: 'Designer / florist', fn: 'Creates decor, scenography, and flowers.' },
      { role: 'On‑site coordinator', fn: 'Manages timing and solves problems on the day.' },
    ];

    const options = roles.map(r => r.role);
    const items = roles.map(r => ({
      prompt: r.fn,
      answer: r.role,
      options,
      fr: 'Associe la fonction au bon rôle.'
    }));
    matchSelect($('#roleMatch'), items);
  }

  function renderRolePlay(){
    const el = $('#rolePlay');
    const items = [
      {
        prompt: 'Client: “What exactly do you do?”',
        small: 'Choose the best reply.',
        options: shuffle([
          'We plan the wedding, coordinate suppliers, and design the decor so you can enjoy the day.',
          'We sell wedding dresses and rent cars.',
          'We only take photos and edit videos.',
          'We write legal contracts for companies.'
        ]),
        answer: 'We plan the wedding, coordinate suppliers, and design the decor so you can enjoy the day.',
        fr: 'Client : “Que faites-vous exactement ?”'
      },
      {
        prompt: 'Client: “Where do you work?”',
        small: 'Choose the best reply.',
        options: shuffle([
          'We are based in Strasbourg and we work in venues across Alsace, sometimes in places like the Château de Pourtalès.',
          'We work only online and never meet clients.',
          'We work in New York every weekend.',
          'We do not work with venues.'
        ]),
        answer: 'We are based in Strasbourg and we work in venues across Alsace, sometimes in places like the Château de Pourtalès.',
        fr: 'Client : “Où travaillez-vous ?”'
      },
      {
        prompt: 'Client: “What is your mission?”',
        small: 'Choose the best reply.',
        options: shuffle([
          'Our mission is to reduce stress and create an elegant event that feels authentic.',
          'Our mission is to finish quickly, no matter what.',
          'Our mission is to copy other weddings.',
          'Our mission is to be late but funny.'
        ]),
        answer: 'Our mission is to reduce stress and create an elegant event that feels authentic.',
        fr: 'Client : “Quelle est votre mission ?”'
      }
    ];
    mcq(el, items);
  }

  // ---------- builder ----------
  let builderLevel = 'A2';

  function setLevel(lvl){
    builderLevel = lvl;
    const ids = ['A2','B1','B2'];
    ids.forEach(id => {
      const b = $('#lvl' + id);
      const on = (id === lvl);
      b.classList.toggle('chip--on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function buildPitch(){
    const name = ($('#bName').value || 'Alex').trim();
    const title = ($('#bTitle').value || 'event coordinator').trim();
    const place = ($('#bPlace').value || 'Strasbourg').trim();
    const mission = ($('#bMission').value || 'create elegant events • reduce stress • coordinate suppliers').trim();

    const pieces = mission.split(/[•,;]+/).map(s => s.trim()).filter(Boolean);
    const m1 = pieces[0] || 'create elegant events';
    const m2 = pieces[1] || 'reduce stress';
    const m3 = pieces[2] || 'coordinate suppliers';

    let out = '';
    if(builderLevel === 'A2'){
      out = `Hello, my name is ${name}.\nI am a ${title}.\nI work in ${place}.\nMy mission is to ${m1}.\nI help clients to ${m2} and ${m3}.`;
    } else if(builderLevel === 'B1'){
      out = `Hi, I’m ${name}, a ${title} based in ${place}.\nMy mission is to ${m1}, so clients can enjoy their event without stress.\nI coordinate suppliers and timing, and I guide clients step by step from planning to the day itself.`;
    } else {
      out = `Hello, I’m ${name}. I work as a ${title} in ${place}.\nMy role is to translate ideas into a coherent plan: suppliers are briefed, timelines are refined, and the atmosphere is crafted with care.\nUltimately, my mission is to ${m1} while helping clients ${m2}—so the experience feels both elegant and authentic.`;
    }
    $('#pitchBox').value = out;
    setScore(1, 1);
  }

  function surprise(){
    const names = ['Alex','Sam','Camille','Jordan','Tisha','Louise'];
    const titles = ['wedding planner','event coordinator','ceremony officiant','wedding designer','project manager'];
    const places = ['Strasbourg','in Alsace','at a château venue','near Strasbourg','in the region'];
    const missions = [
      'create elegant weddings • reduce stress • coordinate suppliers',
      'design a coherent atmosphere • manage timing • support clients',
      'write a personalised ceremony • guide speeches • create emotion'
    ];
    $('#bName').value = names[Math.floor(Math.random()*names.length)];
    $('#bTitle').value = titles[Math.floor(Math.random()*titles.length)];
    $('#bPlace').value = places[Math.floor(Math.random()*places.length)];
    $('#bMission').value = missions[Math.floor(Math.random()*missions.length)];
    buildPitch();
  }

  // ---------- email generator ----------
  function generateEmail(){
    const name = ($('#clientName').value || 'Marie').trim();
    const event = ($('#clientEvent').value || 'wedding').trim();
    const venue = ($('#clientVenue').value || '').trim();

    const placeLine = venue ? `We can also work in venues such as ${venue}.` : `We work in Strasbourg and across the region.`;
    const out = `Subject: Your ${event} — introduction\n\nHello ${name},\n\nThank you for your message. We are a wedding & event team based in Strasbourg. We can plan the ${event}, coordinate suppliers, and design the decor to match your style.\n${placeLine}\n\nOur mission is to make the experience smooth and elegant, so you can enjoy every moment.\n\nBest regards,\nCeremonie Story (training version)`;
    $('#emailOut').value = out;
    setScore(1, 1);
  }

  // ---------- FR help toggle ----------
  function applyFR(){
    const on = state.showFR;
    $$('.fr').forEach(el => {
      if(on) el.classList.remove('fr-hide');
      else el.classList.add('fr-hide');
    });
    $('#toggleFR').classList.toggle('chip--on', on);
    $('#toggleFR').setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  // ---------- accent buttons ----------
  function applyAccent(){
    const isUS = state.accent === 'en-US';
    $('#accentUS').classList.toggle('chip--on', isUS);
    $('#accentUK').classList.toggle('chip--on', !isUS);
    $('#accentUS').setAttribute('aria-pressed', isUS ? 'true' : 'false');
    $('#accentUK').setAttribute('aria-pressed', !isUS ? 'true' : 'false');
  }

  // ---------- init ----------
  function init(){
    loadState();
    updateHUD();
    applyFR();
    applyAccent();

    renderWarmup();
    renderServices();
    renderVocab(vocab);
    renderVocabMini();
    renderReading();
    renderReadingChecks();
    renderGaps();
    renderWordOrder();
    renderRoleMatch();
    renderRolePlay();

    // Buttons that have data-say
    document.body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-say]');
      if(b){
        speak(b.dataset.say);
      }
    });

    // Start button = scroll
    $('#btnStart').addEventListener('click', () => {
      const sec = $('#discover');
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      speak('Let’s start. Who are they, what do they do, and where do they work?');
    });

    // FR help toggle
    $('#toggleFR').addEventListener('click', () => {
      state.showFR = !state.showFR;
      applyFR();
      saveState();
    });

    // Accent toggles
    $('#accentUS').addEventListener('click', () => { state.accent = 'en-US'; applyAccent(); saveState(); });
    $('#accentUK').addEventListener('click', () => { state.accent = 'en-GB'; applyAccent(); saveState(); });

    // Reset
    $('#btnReset').addEventListener('click', () => {
      if(window.speechSynthesis) speechSynthesis.cancel();
      state.score = 0;
      state.checked = 0;
      updateHUD();
      // clear inputs
      $$('.gap').forEach(g => { g.value = ''; g.classList.remove('ok','no'); });
      $('#pitchBox').value = '';
      $('#emailOut').value = '';
      renderWordOrder(); // fresh
      renderWarmup();
      renderVocabMini();
      renderReadingChecks();
      renderRoleMatch();
      renderRolePlay();
      saveState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Vocab search
    $('#vocabSearch').addEventListener('input', (e) => {
      const q = (e.target.value || '').trim().toLowerCase();
      const filtered = !q ? vocab : vocab.filter(v =>
        [v.term, v.fr, v.def, v.ex, v.pos].some(x => String(x).toLowerCase().includes(q))
      );
      renderVocab(filtered);
    });

    // Vocab shuffle
    $('#btnVocabShuffle').addEventListener('click', () => {
      renderVocab(shuffle(vocab));
      setScore(0, 1);
    });

    // Vocab quiz button: jumps down
    $('#btnVocabQuiz').addEventListener('click', () => {
      $('#vocabMatch').scrollIntoView({ behavior: 'smooth', block: 'start' });
      speak('Quick quiz. Match the meaning.');
    });

    // Builder buttons
    $('#lvlA2').addEventListener('click', () => setLevel('A2'));
    $('#lvlB1').addEventListener('click', () => setLevel('B1'));
    $('#lvlB2').addEventListener('click', () => setLevel('B2'));

    $('#btnBuild').addEventListener('click', buildPitch);
    $('#btnRandom').addEventListener('click', surprise);

    $('#btnSpeakPitch').addEventListener('click', () => {
      const t = ($('#pitchBox').value || '').trim();
      if(t) speak(t);
    });
    $('#btnCopyPitch').addEventListener('click', async () => {
      try{ await navigator.clipboard.writeText($('#pitchBox').value || ''); }catch(_e){}
    });

    // Reading level buttons
    $('#txtA2').addEventListener('click', () => { compareMode=false; activeText='A2'; syncTextButtons(); renderReading(); setScore(0,1); });
    $('#txtB1').addEventListener('click', () => { compareMode=false; activeText='B1'; syncTextButtons(); renderReading(); setScore(0,1); });
    $('#txtB2').addEventListener('click', () => { compareMode=false; activeText='B2'; syncTextButtons(); renderReading(); setScore(0,1); });
    $('#btnCompare').addEventListener('click', () => {
      compareMode = !compareMode;
      $('#btnCompare').classList.toggle('chip--on', compareMode);
      $('#btnCompare').setAttribute('aria-pressed', compareMode ? 'true' : 'false');
      renderReading();
      setScore(0,1);
    });

    function syncTextButtons(){
      const map = {A2:'#txtA2',B1:'#txtB1',B2:'#txtB2'};
      Object.keys(map).forEach(k => {
        const b = $(map[k]);
        const on = (k === activeText) && !compareMode;
        b.classList.toggle('chip--on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    // Gap fill check/show
    $('#btnCheckGaps').addEventListener('click', () => checkGaps(false));
    $('#btnShowGaps').addEventListener('click', () => checkGaps(true));

    // Email generation
    $('#btnMakeEmail').addEventListener('click', generateEmail);
    $('#btnSpeakEmail').addEventListener('click', () => {
      const t = ($('#emailOut').value || '').trim();
      if(t) speak(t);
    });
    $('#btnCopyEmail').addEventListener('click', async () => {
      try{ await navigator.clipboard.writeText($('#emailOut').value || ''); }catch(_e){}
    });

    // Timer
    initTimer();

    // Initial builder level based on saved maybe
    setLevel(builderLevel);

    // Apply FR to dynamic elements
    applyFR();
  }

  // ---------- timer ----------
  let timerId = null;
  let remaining = 30;

  function fmt(n){
    const mm = String(Math.floor(n/60)).padStart(2,'0');
    const ss = String(n%60).padStart(2,'0');
    return `${mm}:${ss}`;
  }
  function renderTimer(){ $('#timerNum').textContent = fmt(remaining); }

  function initTimer(){
    renderTimer();
    $('#timerStart').addEventListener('click', () => {
      if(timerId) return;
      timerId = setInterval(() => {
        remaining--;
        renderTimer();
        if(remaining <= 0){
          stopTimer();
          speak('Time. Great job.');
          setScore(1, 1);
        }
      }, 1000);
    });
    $('#timerStop').addEventListener('click', stopTimer);
    $('#timerReset').addEventListener('click', () => {
      stopTimer();
      remaining = 30;
      renderTimer();
    });
  }
  function stopTimer(){
    if(timerId){
      clearInterval(timerId);
      timerId = null;
    }
  }

  // ---------- ready ----------
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
