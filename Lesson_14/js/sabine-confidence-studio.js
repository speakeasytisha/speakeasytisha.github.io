(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const body = document.body;

  const vocab = [
    {cat:'people', icon:'👰', en:'client', fr:'client / cliente', ex:'I am meeting the client this afternoon.'},
    {cat:'people', icon:'🌸', en:'florist', fr:'fleuriste', ex:'I usually call the florist on Monday.'},
    {cat:'people', icon:'🍽️', en:'caterer', fr:'traiteur', ex:'The caterer is preparing the menu.'},
    {cat:'people', icon:'🏛️', en:'venue manager', fr:'responsable du lieu', ex:'I am writing to the venue manager.'},
    {cat:'people', icon:'🤝', en:'supplier', fr:'prestataire / fournisseur', ex:'I contacted the supplier yesterday.'},
    {cat:'places', icon:'💒', en:'venue', fr:'lieu de réception', ex:'The meeting is at the venue.'},
    {cat:'places', icon:'🪑', en:'welcome desk', fr:'table / espace d’accueil', ex:'They are setting up the welcome desk.'},
    {cat:'places', icon:'🎪', en:'booth / stand', fr:'stand', ex:'The stand was near the entrance.'},
    {cat:'places', icon:'🚪', en:'entrance', fr:'entrée', ex:'The guests are waiting at the entrance.'},
    {cat:'places', icon:'🏨', en:'hotel lobby', fr:'hall de l’hôtel', ex:'The meeting point is in the hotel lobby.'},
    {cat:'actions', icon:'🗂️', en:'organise', fr:'organiser', ex:'I organise weddings and events.'},
    {cat:'actions', icon:'📞', en:'contact', fr:'contacter', ex:'I am going to contact the supplier.'},
    {cat:'actions', icon:'✅', en:'confirm', fr:'confirmer', ex:'Could you confirm the final guest count?'},
    {cat:'actions', icon:'📝', en:'check', fr:'vérifier', ex:'I checked the schedule yesterday.'},
    {cat:'actions', icon:'📤', en:'send', fr:'envoyer', ex:'I am going to send the timeline tomorrow.'},
    {cat:'actions', icon:'🧾', en:'review', fr:'revoir / examiner', ex:'We reviewed the quotation this morning.'},
    {cat:'actions', icon:'🛠️', en:'set up', fr:'installer / mettre en place', ex:'They are setting up the welcome area now.'},
    {cat:'time', icon:'🗓️', en:'schedule', fr:'planning', ex:'I am updating the schedule now.'},
    {cat:'time', icon:'⏰', en:'timeline', fr:'chronologie / déroulé', ex:'I sent the timeline yesterday.'},
    {cat:'time', icon:'📍', en:'meeting point', fr:'point de rendez-vous', ex:'The meeting point is at the hotel lobby.'},
    {cat:'time', icon:'📅', en:'next step', fr:'prochaine étape', ex:'The next step is the client call.'},
    {cat:'time', icon:'👥', en:'guest count', fr:'nombre d’invités', ex:'Could you confirm the final guest count?'},
    {cat:'time', icon:'🚚', en:'delivery time', fr:'heure de livraison', ex:'The delivery time is at 10 a.m.'},
    {cat:'email', icon:'📧', en:'follow-up email', fr:'e-mail de suivi', ex:'I wrote a follow-up email after the meeting.'},
    {cat:'email', icon:'🙏', en:'thank you for your time', fr:'merci pour votre temps', ex:'Thank you for your time today.'},
    {cat:'email', icon:'❓', en:'Could you please…?', fr:'Pourriez-vous… ?', ex:'Could you please send the final capacity?'},
    {cat:'email', icon:'💬', en:'Best regards', fr:'Cordialement', ex:'Best regards, Sabine.'},
    {cat:'email', icon:'📌', en:'I am writing to…', fr:'Je vous écris pour…', ex:'I am writing to confirm the meeting details.'},
    {cat:'email', icon:'📎', en:'attached', fr:'ci-joint', ex:'Please find the updated file attached.'}
  ];

  const prepItems = [
    {q:'The venue meeting is ___ Tuesday at 3 p.m.', options:['in','on','at'], answer:'on'},
    {q:'The guests are waiting ___ the entrance.', options:['at','on','in'], answer:'at'},
    {q:'The ballroom is ___ the hotel.', options:['in','on','at'], answer:'in'},
    {q:'I sent the timeline ___ June 12.', options:['on','at','in'], answer:'on'},
    {q:'The supplier meeting is ___ 10 a.m.', options:['in','at','on'], answer:'at'}
  ];

  const tenseItems = [
    {q:'Usually (d’habitude), I ___ weddings and events.', options:['present simple','present continuous','be going to','past simple'], answer:'present simple'},
    {q:'Right now (en ce moment), I ___ the guest list.', options:['present simple','present continuous','be going to','past simple'], answer:'present continuous'},
    {q:'Tomorrow (demain), I ___ call the florist.', options:['present simple','present continuous','be going to','past simple'], answer:'be going to'},
    {q:'Last week (la semaine dernière), I ___ a salon in Paris.', options:['present simple','present continuous','be going to','past simple'], answer:'past simple'}
  ];

  const presentSimpleItems = [
    {
      label:'Present simple · affirmative · I',
      q:'Choose the correct sentence.',
      options:['I organise the guest list every week.','I am organising the guest list every week.','I organised the guest list every week.'],
      answer:'I organise the guest list every week.',
      explain:'Present simple affirmative = I + base verb.'
    },
    {
      label:'Present simple · negative · I',
      q:'Choose the correct sentence.',
      options:['I do not contact the venue on Sundays.','I am not contact the venue on Sundays.','I did not contact the venue on Sundays.'],
      answer:'I do not contact the venue on Sundays.',
      explain:'Present simple negative = I do not / don’t + base verb.'
    },
    {
      label:'Present simple · question · I',
      q:'Choose the correct sentence.',
      options:['Do I confirm the final number today?','Am I confirm the final number today?','Did I confirm the final number today?'],
      answer:'Do I confirm the final number today?',
      explain:'Present simple question = Do + I + base verb?'
    },
    {
      label:'Present simple · mixed pronoun',
      q:'Choose the correct sentence.',
      options:['They do not organise the delivery in June.','They are not organise the delivery in June.','Do they organising the delivery in June?'],
      answer:'They do not organise the delivery in June.',
      explain:'With they, use do / do not + base verb in the present simple.'
    }
  ];

  const presentContinuousItems = [
    {
      label:'Present continuous · affirmative · I',
      q:'Choose the correct sentence.',
      options:['I am checking the seating plan now.','I checking the seating plan now.','I check the seating plan now.'],
      answer:'I am checking the seating plan now.',
      explain:'Present continuous affirmative = I am + verb-ing.'
    },
    {
      label:'Present continuous · negative · I',
      q:'Choose the correct sentence.',
      options:['I am not preparing the contract now.','I do not preparing the contract now.','I not am preparing the contract now.'],
      answer:'I am not preparing the contract now.',
      explain:'Present continuous negative = I am not + verb-ing.'
    },
    {
      label:'Present continuous · question · I',
      q:'Choose the correct sentence.',
      options:['Am I calling the florist now?','Do I calling the florist now?','Am I call the florist now?'],
      answer:'Am I calling the florist now?',
      explain:'Present continuous question = Am + I + verb-ing?'
    },
    {
      label:'Present continuous · mixed pronoun',
      q:'Choose the correct sentence.',
      options:['He is checking the invoice now.','He checking the invoice now.','Does he checking the invoice now?'],
      answer:'He is checking the invoice now.',
      explain:'With he / she / it, use is + verb-ing in the present continuous.'
    }
  ];

  const goingToItems = [
    {
      label:'Be going to · affirmative · I',
      q:'Choose the correct sentence.',
      options:['I am going to contact the caterer tomorrow.','I going to contact the caterer tomorrow.','I am contact the caterer tomorrow.'],
      answer:'I am going to contact the caterer tomorrow.',
      explain:'Be going to = I am going to + base verb.'
    },
    {
      label:'Be going to · negative · I',
      q:'Choose the correct sentence.',
      options:['I am not going to send the quote today.','I do not going to send the quote today.','I am not go to send the quote today.'],
      answer:'I am not going to send the quote today.',
      explain:'Be going to negative = I am not going to + base verb.'
    },
    {
      label:'Be going to · question · I',
      q:'Choose the correct sentence.',
      options:['Am I going to meet the client tomorrow?','Do I going to meet the client tomorrow?','Am I go to meet the client tomorrow?'],
      answer:'Am I going to meet the client tomorrow?',
      explain:'Be going to question = Am + I + going to + base verb?'
    },
    {
      label:'Be going to · mixed pronoun',
      q:'Choose the correct sentence.',
      options:['You are going to call the client tomorrow.','You going to call the client tomorrow.','You are going call the client tomorrow.'],
      answer:'You are going to call the client tomorrow.',
      explain:'With you / we / they, use are going to + base verb.'
    }
  ];

  const pastSimpleItems = [
    {
      label:'Past simple · affirmative · I',
      q:'Choose the correct sentence.',
      options:['I organised the booth yesterday.','I did organise the booth yesterday.','I organise the booth yesterday.'],
      answer:'I organised the booth yesterday.',
      explain:'Past simple affirmative = I + past form.'
    },
    {
      label:'Past simple · negative · I',
      q:'Choose the correct sentence.',
      options:['I did not check the stand yesterday.','I did not checked the stand yesterday.','I was not check the stand yesterday.'],
      answer:'I did not check the stand yesterday.',
      explain:'Past simple negative = did not / didn’t + base verb.'
    },
    {
      label:'Past simple · question · I',
      q:'Choose the correct sentence.',
      options:['Did I call the venue yesterday?','Did I called the venue yesterday?','Was I call the venue yesterday?'],
      answer:'Did I call the venue yesterday?',
      explain:'Past simple question = Did + I + base verb?'
    },
    {
      label:'Past simple · mixed pronoun',
      q:'Choose the correct sentence.',
      options:['They organised the stand last week.','They organise the stand last week.','They did organised the stand last week.'],
      answer:'They organised the stand last week.',
      explain:'Past simple affirmative = subject + past form.'
    }
  ];

  const questionSets = [
    {
      id:'guest-count',
      label:'Confirm the guest count',
      chips:['Could','you','please','confirm','the','final','guest','count','?'],
      correct:'Could you please confirm the final guest count ?',
      fr:'Pourriez-vous confirmer le nombre final d’invités ?'
    },
    {
      id:'venue-time',
      label:'Ask about the venue meeting time',
      chips:['What','time','is','the','venue','meeting','?'],
      correct:'What time is the venue meeting ?',
      fr:'À quelle heure est la réunion au lieu ?'
    },
    {
      id:'supplier-call',
      label:'Ask to call later',
      chips:['Can','I','call','you','this','afternoon','?'],
      correct:'Can I call you this afternoon ?',
      fr:'Puis-je vous appeler cet après-midi ?'
    },
    {
      id:'delivery-time',
      label:'Ask about the delivery time',
      chips:['What','time','is','the','delivery','scheduled','for','?'],
      correct:'What time is the delivery scheduled for ?',
      fr:'À quelle heure la livraison est-elle prévue ?'
    }
  ];

  const scenarios = [
    {
      id:'venue',
      label:'Venue meeting',
      phone:'Hello, this is Sabine calling. I am calling about the venue meeting on Friday. Could you please confirm the room capacity?',
      meeting:'Good afternoon. Thank you for meeting with me today. I would like to review the ceremony space, the welcome area, and the schedule.',
      emailClient:'Dear Madam, Thank you for your time today. We reviewed the ceremony space and the welcome area.',
      emailReply:'Could you please send me the final room capacity by Friday? Best regards, Sabine.',
      model:'A safe route is: greeting → purpose → detail → question → polite closing.'
    },
    {
      id:'supplier',
      label:'Supplier follow-up',
      phone:'Hello, this is Sabine calling. I am following up about the flowers for next week. Are you going to send the final quote today?',
      meeting:'Hello, thank you for coming. Today, I would like to confirm the bouquet, the table flowers, and the delivery time.',
      emailClient:'Dear Sir, I am writing to follow up on our discussion about the flower order for the event.',
      emailReply:'Could you please confirm the delivery time and the final price? Thank you very much. Best regards, Sabine.',
      model:'Use short questions: Could you please confirm…? Are you going to send…?'
    },
    {
      id:'salon',
      label:'Paris salon follow-up',
      phone:'Hello, this is Sabine calling. I organised a salon in Paris last week, and I would like to continue our discussion.',
      meeting:'It was a pleasure to meet you at the salon in Paris. Today, I would like to talk about your project and the next steps.',
      emailClient:'Dear Madam, It was a pleasure to meet you at the salon in Paris last week.',
      emailReply:'Thank you for your interest. I am going to send you more information tomorrow. Best regards, Sabine.',
      model:'Past simple for the event, then be going to for the next step.'
    }
  ];


  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  let accent = 'UK';
  let voices = [];
  let activeQuestion = questionSets[0];
  let questionBuild = [];

  function qs(sel, root = document){ return root.querySelector(sel); }
  function qsa(sel, root = document){ return [...root.querySelectorAll(sel)]; }
  function showStatus(msg, good = false){
    const box = qs('#scsStatus');
    if (!box) return;
    box.hidden = false;
    box.className = 'scs-status' + (good ? ' good' : '');
    box.innerHTML = msg;
  }
  function clearStatus(){
    const box = qs('#scsStatus');
    if (!box) return;
    box.hidden = true;
    box.innerHTML = '';
    box.className = 'scs-status';
  }

  function loadVoices(){
    try { voices = ('speechSynthesis' in window && window.speechSynthesis.getVoices) ? (window.speechSynthesis.getVoices() || []) : []; }
    catch { voices = []; }
  }

  if ('speechSynthesis' in window) {
    loadVoices();
    try { window.speechSynthesis.onvoiceschanged = loadVoices; } catch {}
  }

  function speak(text){
    try {
      if (!('speechSynthesis' in window) || !text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = accent === 'UK' ? 'en-GB' : 'en-US';
      const v = voices.find(voice => voice.lang === u.lang) || voices.find(voice => (voice.lang || '').startsWith('en'));
      if (v) u.voice = v;
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    } catch {}
  }

  function renderVocab(filter = 'all'){
    const grid = qs('#vocabGrid');
    if (!grid) return;
    grid.innerHTML = '';
    vocab.filter(item => filter === 'all' || item.cat === filter).forEach(item => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'scs-vocab';
      card.innerHTML = `
        <div class="scs-vocab__inner">
          <div class="scs-vocab__face scs-vocab__face--front">
            <div class="scs-vocab__icon">${item.icon}</div>
            <div class="scs-vocab__word">${item.en}</div>
            <div class="scs-label-chip">${item.cat}</div>
            <div class="scs-vocab__example">${item.ex}</div>
          </div>
          <div class="scs-vocab__face scs-vocab__face--back">
            <div class="scs-vocab__icon">${item.icon}</div>
            <div class="scs-vocab__word">${item.fr}</div>
            <div class="scs-vocab__example">${item.ex}</div>
          </div>
        </div>`;
      card.addEventListener('click', () => card.classList.toggle('is-flipped'));
      grid.appendChild(card);
    });
  }

  function renderChoiceQuiz(containerId, items){
    const wrap = qs(containerId);
    if (!wrap) return;
    wrap.innerHTML = '';
    items.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'scs-qitem';
      div.dataset.index = index;
      div.innerHTML = `
        <div class="scs-qmeta">${item.label ? `<span class="scs-pill">${item.label}</span>` : ''}</div>
        <strong>${index + 1}. ${item.q}</strong>
        <div class="scs-options"></div>
        <div class="scs-itemfeedback" aria-live="polite"></div>`;
      const optWrap = qs('.scs-options', div);
      item.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'scs-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          qsa('.scs-option', optWrap).forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          div.dataset.choice = opt;
        });
        optWrap.appendChild(btn);
      });
      wrap.appendChild(div);
    });
  }

  function checkChoiceQuiz(containerId, items, feedbackId, retryText){
    let score = 0;
    items.forEach((item, index) => {
      const row = qs(`${containerId} .scs-qitem[data-index="${index}"]`);
      if (!row) return;
      const line = qs('.scs-itemfeedback', row);
      row.style.borderColor = '#e4daf7';
      if (line) line.className = 'scs-itemfeedback';
      if (row.dataset.choice === item.answer) {
        score += 1;
        row.style.borderColor = 'rgba(27,127,100,.35)';
        if (line) {
          line.classList.add('good');
          line.innerHTML = `✔ Correct. ${item.explain || ''}`;
        }
      } else {
        row.style.borderColor = 'rgba(186,51,84,.35)';
        if (line) {
          line.classList.add('bad');
          line.innerHTML = `✘ Model: <strong>${item.answer}</strong>. ${item.explain || ''}`;
        }
      }
    });
    const fb = qs(feedbackId);
    if (fb) {
      fb.className = 'scs-feedback ' + (score === items.length ? 'good' : 'bad');
      fb.innerHTML = score === items.length ? `Excellent! ${score}/${items.length} correct.` : `${score}/${items.length} correct. ${retryText}`;
    }
  }

  function renderQuestionSet(){
    const select = qs('#questionScenario');
    if (!select) return;
    select.innerHTML = questionSets.map(set => `<option value="${set.id}">${set.label}</option>`).join('');
    select.onchange = () => {
      activeQuestion = questionSets.find(set => set.id === select.value) || questionSets[0];
      resetQuestionBuilder();
    };
    activeQuestion = questionSets[0];
    select.value = activeQuestion.id;
    resetQuestionBuilder();
  }

  function resetQuestionBuilder(){
    questionBuild = [];
    const fb = qs('#questionFeedback');
    if (fb) { fb.textContent = ''; fb.className = 'scs-feedback'; }
    const out = qs('#questionOutput');
    if (out) out.textContent = 'Tap the parts to build your question.';
    const tr = qs('#questionTranslation');
    if (tr) tr.textContent = 'La traduction apparaîtra ici.';
    renderQuestionBank();
  }

  function renderQuestionBank(){
    const bank = qs('#questionBank');
    if (!bank) return;
    bank.innerHTML = '';
    shuffle(activeQuestion.chips).forEach((chip) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'scs-chip';
      btn.textContent = chip;
      btn.addEventListener('click', () => {
        if (btn.classList.contains('used')) return;
        questionBuild.push(chip);
        btn.classList.add('used');
        updateQuestionOutput();
      });
      bank.appendChild(btn);
    });
  }

  function updateQuestionOutput(){
    const out = qs('#questionOutput');
    if (out) out.textContent = questionBuild.join(' ') || 'Tap the parts to build your question.';
    const tr = qs('#questionTranslation');
    if (tr) tr.textContent = activeQuestion.fr;
  }

  function checkQuestion(){
    const built = questionBuild.join(' ').trim();
    const fb = qs('#questionFeedback');
    if (!fb) return;
    if (!built) {
      fb.className = 'scs-feedback bad';
      fb.textContent = 'Build the question first.';
      return;
    }
    if (built === activeQuestion.correct) {
      fb.className = 'scs-feedback good';
      fb.textContent = 'Great! This is a clear professional question.';
    } else {
      fb.className = 'scs-feedback bad';
      fb.innerHTML = `Try again. Model: <strong>${activeQuestion.correct}</strong>`;
    }
  }

  function renderScenarioTabs(){
    const tabs = qs('#scenarioTabs');
    if (!tabs) return;
    tabs.innerHTML = '';
    scenarios.forEach((scenario, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'scs-tab' + (index === 0 ? ' active' : '');
      btn.textContent = scenario.label;
      btn.addEventListener('click', () => {
        qsa('.scs-tab', tabs).forEach(tab => tab.classList.remove('active'));
        btn.classList.add('active');
        renderScenarioPanel(scenario);
      });
      tabs.appendChild(btn);
    });
    renderScenarioPanel(scenarios[0]);
  }

  function renderScenarioPanel(scenario){
    const panel = qs('#scenarioPanel');
    if (!panel) return;
    panel.innerHTML = `
      <article class="scs-panel">
        <h3>📞 Phone call</h3>
        <p>${scenario.phone}</p>
        <button class="scs-btn scs-btn--small scs-listen" type="button" data-listen="${scenario.phone.replace(/"/g, '&quot;')}">🔊 Listen</button>
      </article>
      <article class="scs-panel">
        <h3>🤝 Meeting</h3>
        <p>${scenario.meeting}</p>
        <button class="scs-btn scs-btn--small scs-listen" type="button" data-listen="${scenario.meeting.replace(/"/g, '&quot;')}">🔊 Listen</button>
      </article>
      <article class="scs-panel">
        <h3>📧 Email chunks</h3>
        <p><strong>Opening:</strong> ${scenario.emailClient}</p>
        <p><strong>Follow-up:</strong> ${scenario.emailReply}</p>
        <p class="scs-model">${scenario.model}</p>
      </article>`;
    wireListenButtons(panel);
  }

  function wireListenButtons(root = document){
    qsa('.scs-listen', root).forEach(btn => {
      if (btn.dataset.bound === 'yes') return;
      btn.dataset.bound = 'yes';
      btn.addEventListener('click', () => speak(btn.dataset.listen));
    });
  }

  function toggleFrench(){
    body.classList.toggle('fr-off');
    body.classList.toggle('fr-on');
    const btn = qs('#frToggle');
    if (btn) btn.textContent = body.classList.contains('fr-off') ? 'FR help: OFF' : 'FR help: ON';
  }

  function toggleAccent(){
    accent = accent === 'UK' ? 'US' : 'UK';
    body.dataset.accent = accent;
    const btn = qs('#accentToggle');
    if (btn) btn.textContent = `Voice: ${accent}`;
  }

  function resetPage(){
    body.classList.remove('fr-off');
    body.classList.add('fr-on');
    const frBtn = qs('#frToggle');
    if (frBtn) frBtn.textContent = 'FR help: ON';
    accent = 'UK';
    const accBtn = qs('#accentToggle');
    if (accBtn) accBtn.textContent = 'Voice: UK';
    const filter = qs('#vocabFilter');
    if (filter) filter.value = 'all';
    renderVocab('all');
    renderChoiceQuiz('#prepQuiz', prepItems);
    renderChoiceQuiz('#tenseQuiz', tenseItems);
    renderChoiceQuiz('#psQuiz', presentSimpleItems);
    renderChoiceQuiz('#pcQuiz', presentContinuousItems);
    renderChoiceQuiz('#gtQuiz', goingToItems);
    renderChoiceQuiz('#pastQuiz', pastSimpleItems);
    ['#prepFeedback','#tenseFeedback','#psFeedback','#pcFeedback','#gtFeedback','#pastFeedback'].forEach(id => {
      const el = qs(id);
      if (el) { el.textContent = ''; el.className = 'scs-feedback'; }
    });
    const scenarioSel = qs('#questionScenario');
    if (scenarioSel) scenarioSel.value = questionSets[0].id;
    activeQuestion = questionSets[0];
    resetQuestionBuilder();
    qsa('.model-toggle').forEach(btn => {
      const target = qs('#' + btn.dataset.target);
      btn.textContent = 'Show model answer';
      if (target) target.hidden = true;
    });
    renderScenarioTabs();
    clearStatus();
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function initModelToggles(){
    qsa('.model-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = qs('#' + btn.dataset.target);
        if (!target) return;
        const hidden = target.hidden;
        target.hidden = !hidden;
        btn.textContent = hidden ? 'Hide model answer' : 'Show model answer';
      });
    });
  }

  function bind(selector, eventName, handler){
    const node = qs(selector);
    if (node) node.addEventListener(eventName, handler);
  }

  function init(){
    try {
      clearStatus();
      renderVocab();
      renderChoiceQuiz('#prepQuiz', prepItems);
      renderChoiceQuiz('#tenseQuiz', tenseItems);
      renderChoiceQuiz('#psQuiz', presentSimpleItems);
      renderChoiceQuiz('#pcQuiz', presentContinuousItems);
      renderChoiceQuiz('#gtQuiz', goingToItems);
      renderChoiceQuiz('#pastQuiz', pastSimpleItems);
      renderQuestionSet();
      renderScenarioTabs();
      wireListenButtons();
      initModelToggles();

      bind('#vocabFilter', 'change', e => renderVocab(e.target.value));
      bind('#checkPrep', 'click', () => checkChoiceQuiz('#prepQuiz', prepItems, '#prepFeedback', 'Review the preposition guide, then try again.'));
      bind('#checkTense', 'click', () => checkChoiceQuiz('#tenseQuiz', tenseItems, '#tenseFeedback', 'Look at the English time marker and the French translation, then try again.'));
      bind('#checkPs', 'click', () => checkChoiceQuiz('#psQuiz', presentSimpleItems, '#psFeedback', 'Stay in the present simple only: do / do not + base verb.'));
      bind('#checkPc', 'click', () => checkChoiceQuiz('#pcQuiz', presentContinuousItems, '#pcFeedback', 'Stay in the present continuous only: am / is / are + verb-ing.'));
      bind('#checkGt', 'click', () => checkChoiceQuiz('#gtQuiz', goingToItems, '#gtFeedback', 'Stay in be going to only: am / is / are going to + base verb.'));
      bind('#checkPast', 'click', () => checkChoiceQuiz('#pastQuiz', pastSimpleItems, '#pastFeedback', 'Stay in the past simple only: past form, or did / didn’t + base verb.'));
      bind('#checkQuestion', 'click', checkQuestion);
      bind('#listenQuestion', 'click', () => speak(questionBuild.join(' ') || activeQuestion.correct));
      bind('#clearBuilder', 'click', resetQuestionBuilder);
      bind('#frToggle', 'click', toggleFrench);
      bind('#accentToggle', 'click', toggleAccent);
      bind('#printBtn', 'click', () => window.print());
      bind('#resetBtn', 'click', resetPage);
      showStatus('Interactive tools loaded.', true);
      setTimeout(clearStatus, 1200);
    } catch (err) {
      console.error(err);
      showStatus('A JavaScript error blocked the interactive parts. This fixed version now reports errors instead of failing silently.');
    }
  }

  window.addEventListener('error', (event) => {
    console.error(event.error || event.message);
    showStatus(`JavaScript error: ${event.message || 'Unknown error'}`);
  });

  document.addEventListener('DOMContentLoaded', init);
})();
