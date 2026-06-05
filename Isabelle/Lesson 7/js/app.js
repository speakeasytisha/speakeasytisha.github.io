(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const state = {
    accent: 'en-GB',
    voice: null,
    score: 0,
    answered: new Set(),
    timer: { seconds: 60, interval: null },
    promptIndex: 0
  };

  const warmups = [
    {
      title: 'Your double competence',
      question: 'How can you describe your profile in one sentence?',
      cues: ['legal expertise', 'commercial experience', 'real estate'],
      model: 'I have a dual legal and commercial profile in real estate, with over twenty-four years of experience in the French property sector.'
    },
    {
      title: 'Your client approach',
      question: 'What do you do before advising a client?',
      cues: ['listen carefully', 'understand needs', 'appropriate advice'],
      model: 'I listen carefully to clients before speaking so that I can understand their needs and offer appropriate advice.'
    },
    {
      title: 'Your sales responsibility',
      question: 'How can you explain your sales management role?',
      cues: ['annual budget', 'one million euros', 'sales team'],
      model: 'As a sales manager, I was responsible for an annual sales budget of approximately one million euros and coordinated a small sales team.'
    },
    {
      title: 'Your Netherlands project',
      question: 'What kind of opportunity are you looking for in the Netherlands?',
      cues: ['Amsterdam', 'real estate agency', 'legal role'],
      model: 'I am looking for a professional opportunity in or around Amsterdam, ideally in a real estate agency or a property-related legal position.'
    }
  ];

  const vocab = [
    {
      category: 'Professional identity',
      word: 'real estate legal and commercial professional',
      fr: 'professionnelle de l’immobilier avec une double compétence juridique et commerciale',
      definition: 'A person with both legal and commercial expertise in the property sector.',
      example: 'I am a real estate legal and commercial professional with over 24 years’ experience.'
    },
    {
      category: 'Professional identity',
      word: 'property sector',
      fr: 'secteur immobilier',
      definition: 'The professional field of buying, selling, renting, developing and managing property.',
      example: 'I have worked in the property sector for over 24 years.'
    },
    {
      category: 'Professional identity',
      word: 'professional opportunity',
      fr: 'opportunité professionnelle',
      definition: 'A possible job, role or career opening.',
      example: 'I am seeking a new professional opportunity in the Netherlands.'
    },
    {
      category: 'Legal work',
      word: 'legal advisory work',
      fr: 'conseil juridique',
      definition: 'Work that involves giving legal guidance and support.',
      example: 'My experience includes legal advisory work for major property developers.'
    },
    {
      category: 'Legal work',
      word: 'risk prevention',
      fr: 'prévention des risques',
      definition: 'Identifying and reducing possible legal or operational risks.',
      example: 'I advised operational teams on risk prevention.'
    },
    {
      category: 'Legal work',
      word: 'drafted and negotiated',
      fr: 'rédigé et négocié',
      definition: 'Prepared documents and discussed terms until agreement was reached.',
      example: 'I drafted and negotiated real estate development contracts.'
    },
    {
      category: 'Legal work',
      word: 'legal monitoring',
      fr: 'veille juridique',
      definition: 'Following legal and regulatory changes.',
      example: 'I carried out legal monitoring and updated standard documents.'
    },
    {
      category: 'Legal work',
      word: 'settlement agreement',
      fr: 'protocole transactionnel',
      definition: 'A legal agreement used to settle a dispute.',
      example: 'I drafted settlement agreements in litigation matters.'
    },
    {
      category: 'Real estate development',
      word: 'property developer',
      fr: 'promoteur immobilier',
      definition: 'A company or person that develops real estate projects.',
      example: 'I worked with major French property developers.'
    },
    {
      category: 'Real estate development',
      word: 'planning permission',
      fr: 'autorisation d’urbanisme / permis',
      definition: 'Official permission to build, change or develop property.',
      example: 'I worked on files involving planning permissions and building permits.'
    },
    {
      category: 'Real estate development',
      word: 'building permit',
      fr: 'permis de construire',
      definition: 'Official authorization to construct a building.',
      example: 'I monitored building permit appeals.'
    },
    {
      category: 'Real estate development',
      word: 'environmental impact assessment',
      fr: 'étude d’impact',
      definition: 'A study of the possible effects of a project on the environment.',
      example: 'Some projects required an environmental impact assessment.'
    },
    {
      category: 'Sales and clients',
      word: 'private clients',
      fr: 'particuliers',
      definition: 'Individual clients who are not acting as companies.',
      example: 'I worked with both professional clients and private clients.'
    },
    {
      category: 'Sales and clients',
      word: 'client needs analysis',
      fr: 'analyse des besoins clients',
      definition: 'Understanding what a client wants before giving advice.',
      example: 'Client needs analysis is essential before recommending a property.'
    },
    {
      category: 'Sales and clients',
      word: 'annual sales budget',
      fr: 'budget annuel des ventes',
      definition: 'The amount of sales or fees managed during one year.',
      example: 'I was responsible for an annual sales budget of approximately one million euros.'
    },
    {
      category: 'Sales and clients',
      word: 'liaised with',
      fr: 'assuré les relations avec / travaillé en lien avec',
      definition: 'Communicated and coordinated with professional contacts.',
      example: 'I liaised with notaries, lawyers, investors and operational teams.'
    },
    {
      category: 'Technical translations',
      word: 'off-plan sale',
      fr: 'VEFA / vente en l’état futur d’achèvement',
      definition: 'A sale signed before the property is completed.',
      example: 'An off-plan sale allows a buyer to purchase a property before completion.'
    },
    {
      category: 'Technical translations',
      word: 'off-plan lease',
      fr: 'BEFA / bail en l’état futur d’achèvement',
      definition: 'A lease signed before the premises are completed.',
      example: 'An off-plan lease is often used for commercial premises under construction.'
    },
    {
      category: 'Technical translations',
      word: 'reservation agreement',
      fr: 'contrat de réservation',
      definition: 'A preliminary agreement used to reserve a property before final signing.',
      example: 'I reviewed reservation agreements for property development projects.'
    },
    {
      category: 'Technical translations',
      word: 'co-ownership regulations',
      fr: 'règlement de copropriété',
      definition: 'Rules governing a building owned by several owners.',
      example: 'I reviewed co-ownership regulations and related legal documents.'
    },
    {
      category: 'CV soft skills',
      word: 'adaptability',
      fr: 'capacité d’adaptation',
      definition: 'The ability to adjust to new situations and different people.',
      example: 'My adaptability helps me work with different clients and professional contexts.'
    },
    {
      category: 'CV soft skills',
      word: 'responsiveness',
      fr: 'réactivité',
      definition: 'The ability to respond quickly and effectively.',
      example: 'Responsiveness is important when working with clients and legal deadlines.'
    },
    {
      category: 'CV soft skills',
      word: 'attention to detail',
      fr: 'rigueur / sens du détail',
      definition: 'The ability to work carefully and accurately.',
      example: 'Attention to detail is essential when reviewing contracts.'
    },
    {
      category: 'CV soft skills',
      word: 'analytical thinking',
      fr: 'esprit d’analyse',
      definition: 'The ability to study information logically and identify key points.',
      example: 'My analytical thinking helps me assess risks and find practical solutions.'
    }
  ];

  const upgrades = [
    {
      before: 'Advice to operational staff and assistance for monitoring operations and risk prevention.',
      better: 'Provided advice to operational teams and supported the monitoring of operations and risk prevention.',
      pro: 'Advised operational teams on real estate law, project monitoring and risk prevention.'
    },
    {
      before: 'Drafting and negotiation of contracts: VEFA, BEFA, reservation contract...',
      better: 'Drafted and negotiated contracts, including off-plan sales, off-plan leases and reservation agreements.',
      pro: 'Drafted and negotiated real estate development contracts, including off-plan sale agreements, off-plan leases, reservation agreements and project development contracts.'
    },
    {
      before: 'Validation of advertising tools: leaflets, brochure, website, panels.',
      better: 'Reviewed and approved marketing materials, including leaflets, brochures, websites and signage.',
      pro: 'Reviewed and approved marketing materials for property development projects, ensuring legal and regulatory compliance.'
    },
    {
      before: 'Relations with clients, developers, social landlords, institutional owners, notaries...',
      better: 'Liaised with clients, developers, social landlords, institutional owners, notaries and technical teams.',
      pro: 'Liaised with a wide range of stakeholders, including private clients, property developers, social housing providers, institutional owners, notaries, elected officials and technical teams.'
    },
    {
      before: 'Building valuation study with sale proposal.',
      better: 'Prepared building valuation studies and sale proposals.',
      pro: 'Prepared property valuation studies and sale proposals to support asset disposal and commercial strategy.'
    },
    {
      before: 'Team composed by a sales manager junior, an assistant and an apprentice.',
      better: 'Managed a team composed of a junior sales manager, an assistant and an apprentice.',
      pro: 'Coordinated a small sales team, including a junior sales manager, an assistant and an apprentice.'
    }
  ];

  const speakingPrompts = [
    {
      title: 'Professional profile',
      question: 'Introduce your profile to a recruiter in 45 seconds.',
      cues: ['legal + commercial', '24 years', 'property sector', 'Netherlands'],
      model: 'I am a real estate legal and commercial professional with over twenty-four years of experience in the French property sector. I have worked in legal departments for major property developers and I also have sales management experience. I am now looking for a new professional opportunity in the Netherlands.'
    },
    {
      title: 'Legal experience',
      question: 'Explain your legal experience in simple professional English.',
      cues: ['contracts', 'risk prevention', 'operational teams', 'legal documents'],
      model: 'My legal experience includes advising operational teams, drafting and negotiating contracts, reviewing legal documents and helping prevent risks during property development operations.'
    },
    {
      title: 'Commercial experience',
      question: 'Explain your sales management experience.',
      cues: ['sales manager', 'clients', 'negotiation', 'annual budget'],
      model: 'As a sales manager, I worked with different types of clients, organised property sales, took part in negotiations and was responsible for an annual sales budget of approximately one million euros.'
    },
    {
      title: 'Why the Netherlands?',
      question: 'Explain why you want to work in the Netherlands.',
      cues: ['Amsterdam', 'new challenge', 'international setting', 'real estate agency'],
      model: 'I would like to work in the Netherlands because I am looking for a new professional challenge in an international environment. I would like to use my real estate experience in or around Amsterdam, ideally in a real estate agency or a property-related legal role.'
    },
    {
      title: 'Technical term',
      question: 'Explain “off-plan lease” to a client.',
      cues: ['lease', 'before completion', 'commercial premises', 'ready for occupation'],
      model: 'An off-plan lease is a lease signed before the premises are completed. It is often used for commercial property under construction. The lease generally starts when the premises are completed and ready for occupation.'
    }
  ];

  function init() {
    bindScroll();
    bindVoice();
    renderWarmups();
    renderVocab();
    renderUpgrades();
    bindChoices();
    bindInputs();
    bindReveal();
    bindSpeechButtons();
    bindTimer();
    bindNotes();
    bindUtilityButtons();
    showPrompt(0);
  }

  function bindScroll() {
    $$('[data-scroll]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = $(btn.dataset.scroll);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function bindVoice() {
    const select = $('#voiceSelect');
    select.addEventListener('change', () => {
      state.accent = select.value;
      pickVoice();
    });
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = pickVoice;
      pickVoice();
    }
  }

  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = speechSynthesis.getVoices();
    state.voice = voices.find(v => v.lang === state.accent) || voices.find(v => v.lang?.startsWith(state.accent.split('-')[0])) || voices[0] || null;
  }

  function speak(text) {
    if (!('speechSynthesis' in window) || !text) return;
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').trim());
    utter.lang = state.accent;
    if (state.voice) utter.voice = state.voice;
    utter.rate = 0.9;
    speechSynthesis.speak(utter);
  }

  function bindSpeechButtons(root = document) {
    $$('.speak-btn', root).forEach(btn => {
      if (btn.dataset.bound === 'yes') return;
      btn.dataset.bound = 'yes';
      btn.addEventListener('click', () => {
        if (btn.dataset.say) speak(btn.dataset.say);
        else if (btn.id === 'speakPromptModel') speak($('#promptModel').textContent);
        else speak(btn.closest('article, .model-box, .vocab-card')?.innerText || '');
      });
    });
    $('#pauseSpeech')?.addEventListener('click', () => speechSynthesis?.cancel());
  }

  function renderWarmups() {
    const container = $('#warmupCards');
    container.innerHTML = warmups.map((item, idx) => `
      <article class="warm-card">
        <p class="eyebrow">Speaking card ${idx + 1}</p>
        <h3>${item.title}</h3>
        <p><strong>Question:</strong> ${item.question}</p>
        <div class="cue-list">${item.cues.map(c => `<span>${c}</span>`).join('')}</div>
        <button class="reveal-btn">Show model</button>
        <div class="hidden-content">
          <p>${item.model}</p>
          <button class="speak-btn" data-say="${escapeAttr(item.model)}">🔊 Listen</button>
        </div>
      </article>
    `).join('');
    bindReveal(container);
    bindSpeechButtons(container);
  }

  function renderVocab() {
    const select = $('#categorySelect');
    const search = $('#vocabSearch');
    const categories = ['All categories', ...new Set(vocab.map(v => v.category))];
    select.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
    const render = () => {
      const cat = select.value;
      const q = search.value.toLowerCase().trim();
      const filtered = vocab.filter(v => (cat === 'All categories' || v.category === cat) && [v.word, v.fr, v.definition, v.example].join(' ').toLowerCase().includes(q));
      $('#vocabGrid').innerHTML = filtered.map(v => `
        <article class="vocab-card">
          <div class="vocab-word"><strong>${v.word}</strong><button class="speak-btn" data-say="${escapeAttr(v.example)}">🔊</button></div>
          <span class="fr">FR: ${v.fr}</span>
          <small>${v.category}</small>
          <p><strong>Definition:</strong> ${v.definition}</p>
          <p><strong>Example:</strong> ${v.example}</p>
        </article>
      `).join('') || '<p>No vocabulary found.</p>';
      bindSpeechButtons($('#vocabGrid'));
    };
    select.addEventListener('change', render);
    search.addEventListener('input', render);
    render();
  }

  function renderUpgrades() {
    const container = $('#upgradeList');
    container.innerHTML = upgrades.map((u, idx) => `
      <article class="upgrade-card">
        <p class="eyebrow">Upgrade ${idx + 1}</p>
        <div class="before-better-pro">
          <div class="bbp-box">
            <h4>Current French-style idea</h4>
            <p>${u.before}</p>
          </div>
          <div class="bbp-box">
            <h4>Clearer English</h4>
            <p>${u.better}</p>
          </div>
          <div class="bbp-box pro">
            <h4>Professional CV version</h4>
            <p>${u.pro}</p>
            <button class="speak-btn" data-say="${escapeAttr(u.pro)}">🔊 Listen</button>
          </div>
        </div>
      </article>
    `).join('');
    bindSpeechButtons(container);
  }

  function bindChoices() {
    $$('.practice-box').forEach((box, boxIndex) => {
      $$('.choice', box).forEach(btn => {
        btn.addEventListener('click', () => {
          if (box.dataset.done === 'yes') return;
          const ok = btn.dataset.correct === 'true';
          $$('.choice', box).forEach(b => b.disabled = true);
          btn.classList.add(ok ? 'correct' : 'wrong');
          const fb = $('.feedback', box);
          if (ok) {
            fb.textContent = 'Excellent — this sounds natural and professional.';
            fb.className = 'feedback good';
            addScore(box, boxIndex);
          } else {
            fb.textContent = 'Good try. Choose the option that sounds most natural in international professional English.';
            fb.className = 'feedback try';
            const correct = $('.choice[data-correct="true"]', box);
            correct?.classList.add('correct');
          }
          box.dataset.done = 'yes';
        });
      });
    });
  }

  function bindInputs() {
    $$('.check-inputs').forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        const box = btn.closest('.practice-box');
        if (box.dataset.done === 'yes') return;
        const inputs = $$('.inline-input', box);
        let ok = true;
        inputs.forEach(input => {
          const accepted = input.dataset.answer.split('|').map(x => normalise(x));
          const value = normalise(input.value);
          const isOk = accepted.includes(value);
          input.style.borderColor = isOk ? 'rgba(16,124,65,.55)' : 'rgba(180,35,24,.55)';
          input.style.background = isOk ? '#e8f8ee' : '#ffebe8';
          if (!isOk) ok = false;
        });
        const fb = $('.feedback', box);
        if (ok) {
          fb.textContent = 'Perfect — this sentence is recruiter-friendly.';
          fb.className = 'feedback good';
          box.dataset.done = 'yes';
          addScore(box, `input-${idx}`);
        } else {
          fb.textContent = 'Almost. Check the model and try again.';
          fb.className = 'feedback try';
        }
      });
    });
  }

  function bindReveal(root = document) {
    $$('.reveal-btn', root).forEach(btn => {
      if (btn.dataset.bound === 'yes') return;
      btn.dataset.bound = 'yes';
      btn.addEventListener('click', () => {
        const content = btn.parentElement.querySelector('.hidden-content');
        if (!content) return;
        content.classList.toggle('open');
        btn.textContent = content.classList.contains('open') ? 'Hide model' : 'Show model response';
      });
    });
  }

  function addScore(box, key) {
    const id = box.id || key || Math.random().toString(36).slice(2);
    if (state.answered.has(id)) return;
    state.answered.add(id);
    state.score = Math.min(100, state.score + Number(box.dataset.points || 10));
    $('#scoreTotal').textContent = state.score;
  }

  function bindTimer() {
    const display = $('#timerDisplay');
    const render = () => {
      const m = String(Math.floor(state.timer.seconds / 60)).padStart(2, '0');
      const s = String(state.timer.seconds % 60).padStart(2, '0');
      display.textContent = `${m}:${s}`;
    };
    $('#startTimer').addEventListener('click', () => {
      clearInterval(state.timer.interval);
      if (state.timer.seconds <= 0) state.timer.seconds = 60;
      state.timer.interval = setInterval(() => {
        state.timer.seconds -= 1;
        render();
        if (state.timer.seconds <= 0) {
          clearInterval(state.timer.interval);
          display.textContent = 'Done!';
        }
      }, 1000);
    });
    $('#stopTimer').addEventListener('click', () => {
      clearInterval(state.timer.interval);
      state.timer.seconds = 60;
      render();
    });
    render();
  }

  function showPrompt(index) {
    const p = speakingPrompts[index % speakingPrompts.length];
    state.promptIndex = index % speakingPrompts.length;
    $('#promptTitle').textContent = p.title;
    $('#promptQuestion').textContent = p.question;
    $('#promptCues').innerHTML = p.cues.map(c => `<span>${c}</span>`).join('');
    $('#promptModel').textContent = p.model;
    const hidden = $('#speakingCard .hidden-content');
    hidden.classList.remove('open');
    $('#speakingCard .reveal-btn').textContent = 'Show model response';
  }

  $('#newPrompt').addEventListener('click', () => showPrompt(state.promptIndex + 1));

  function bindNotes() {
    const notes = $('#notes');
    notes.value = localStorage.getItem('isabelle_cv_upgrade_notes') || '';
    $('#saveNotes').addEventListener('click', () => {
      localStorage.setItem('isabelle_cv_upgrade_notes', notes.value);
      $('#noteStatus').textContent = 'Saved ✓';
      setTimeout(() => $('#noteStatus').textContent = '', 1800);
    });
  }

  function bindUtilityButtons() {
    $('#printBtn').addEventListener('click', () => window.print());
    $('#resetBtn').addEventListener('click', () => {
      if (!confirm('Reset score and answers?')) return;
      state.score = 0;
      state.answered.clear();
      $('#scoreTotal').textContent = '0';
      $$('.practice-box').forEach(box => {
        delete box.dataset.done;
        $$('.choice', box).forEach(b => { b.disabled = false; b.classList.remove('correct', 'wrong'); });
        $$('.inline-input', box).forEach(i => { i.value = ''; i.removeAttribute('style'); });
        const fb = $('.feedback', box);
        if (fb) { fb.textContent = ''; fb.className = 'feedback'; }
      });
    });
  }

  function normalise(str) {
    return String(str || '')
      .toLowerCase()
      .replace(/[’']/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeAttr(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
