(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    try {
      initLesson();
    } catch (err) {
      console.error('Sabine v2 JS error:', err);
    }
  });

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function shuffle(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function speak(text) {
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      var utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    } catch (err) {
      console.warn('Speech unavailable:', err);
    }
  }

  var state = {
    frOn: true,
    level: '1',
    step: '1',
    current: {}
  };

  var prepVocab = [
    { type: 'time', en: 'at 3 PM', fr: 'à 15h' },
    { type: 'time', en: 'on Friday', fr: 'le vendredi' },
    { type: 'time', en: 'in June', fr: 'en juin' },
    { type: 'time', en: 'at noon', fr: 'à midi' },
    { type: 'place', en: 'at the venue', fr: 'au lieu de réception' },
    { type: 'place', en: 'in the ballroom', fr: 'dans la salle de bal' },
    { type: 'place', en: 'on the terrace', fr: 'sur la terrasse' },
    { type: 'place', en: 'at the entrance', fr: 'à l’entrée' },
    { type: 'movement', en: 'go to the florist', fr: 'aller chez le fleuriste' },
    { type: 'movement', en: 'come from the hotel', fr: 'venir de l’hôtel' },
    { type: 'movement', en: 'walk into the room', fr: 'entrer dans la salle' },
    { type: 'movement', en: 'step out of the car', fr: 'sortir de la voiture' }
  ];

  var compVocab = [
    { type: 'price', en: 'cheaper than', fr: 'moins cher que' },
    { type: 'price', en: 'more expensive than', fr: 'plus cher que' },
    { type: 'distance', en: 'closer than', fr: 'plus proche que' },
    { type: 'distance', en: 'farther than', fr: 'plus loin que' },
    { type: 'style', en: 'more elegant than', fr: 'plus élégant que' },
    { type: 'style', en: 'prettier than', fr: 'plus joli que' },
    { type: 'quality', en: 'better than', fr: 'meilleur que' },
    { type: 'quality', en: 'worse than', fr: 'moins bon que / pire que' }
  ];

  var supVocab = [
    { type: 'price', en: 'the cheapest', fr: 'le moins cher' },
    { type: 'price', en: 'the most expensive', fr: 'le plus cher' },
    { type: 'style', en: 'the prettiest', fr: 'le plus joli' },
    { type: 'style', en: 'the most elegant', fr: 'le plus élégant' },
    { type: 'quality', en: 'the best', fr: 'le meilleur' },
    { type: 'quality', en: 'the worst', fr: 'le pire' }
  ];

  var prepQcmData = [
    {
      prompt: 'The ceremony starts ___ 3 PM.',
      answer: 'at',
      options: ['at', 'on', 'in'],
      hint: 'Use this for an exact time.',
      vocab: ['ceremony = cérémonie', 'starts = commence']
    },
    {
      prompt: 'The wedding is ___ Friday.',
      answer: 'on',
      options: ['on', 'at', 'in'],
      hint: 'Use this for a day.',
      vocab: ['wedding = mariage', 'Friday = vendredi']
    },
    {
      prompt: 'The reception is ___ June.',
      answer: 'in',
      options: ['in', 'on', 'at'],
      hint: 'Use this for a month.',
      vocab: ['reception = réception', 'June = juin']
    },
    {
      prompt: 'The guests are waiting ___ the ballroom.',
      answer: 'in',
      options: ['in', 'on', 'at'],
      hint: 'Think: inside the room.',
      vocab: ['guests = invités', 'ballroom = salle de bal']
    },
    {
      prompt: 'The planner is waiting ___ the venue entrance.',
      answer: 'at',
      options: ['at', 'in', 'on'],
      hint: 'Think: exact place / point.',
      vocab: ['planner = organisatrice', 'entrance = entrée']
    },
    {
      prompt: 'The flowers are ___ the table.',
      answer: 'on',
      options: ['on', 'at', 'in'],
      hint: 'Think: surface.',
      vocab: ['flowers = fleurs', 'table = table']
    }
  ];

  var prepFillData = [
    {
      prompt: 'The couple arrives ___ the hotel at noon.',
      answer: 'at',
      options: ['at', 'on', 'in'],
      vocab: ['couple = couple', 'arrives = arrive']
    },
    {
      prompt: 'The dinner is ___ Saturday evening.',
      answer: 'on',
      options: ['on', 'at', 'in'],
      vocab: ['dinner = dîner', 'Saturday evening = samedi soir']
    },
    {
      prompt: 'The event takes place ___ 2026.',
      answer: 'in',
      options: ['in', 'on', 'at'],
      vocab: ['event = événement', 'takes place = a lieu']
    },
    {
      prompt: 'The photographer walks ___ the room.',
      answer: 'into',
      options: ['into', 'on', 'at'],
      vocab: ['photographer = photographe', 'walks = entre / marche']
    }
  ];

  var prepMixData = [
    {
      prompt: 'The guests arrive ___ the venue ___ 6 PM.',
      answer: 'at | at',
      parts: ['at', 'in', 'on'],
      vocab: ['guests = invités', 'venue = lieu']
    },
    {
      prompt: 'The cocktail is ___ the terrace ___ Friday.',
      answer: 'on | on',
      parts: ['on', 'at', 'in'],
      vocab: ['cocktail = cocktail', 'terrace = terrasse']
    },
    {
      prompt: 'The planner goes ___ the florist ___ the morning.',
      answer: 'to | in',
      parts: ['to', 'from', 'into', 'in', 'on', 'at'],
      vocab: ['planner = organisatrice', 'florist = fleuriste']
    }
  ];

  var compShortQcm = [
    {
      prompt: 'This package is ___ than the first one.',
      answer: 'cheaper',
      options: ['cheaper', 'more cheap', 'cheapest'],
      hint: 'Short adjective: add -er.',
      vocab: ['package = formule', 'first one = première']
    },
    {
      prompt: 'The blue room is ___ than the gold room.',
      answer: 'smaller',
      options: ['smaller', 'more small', 'smallest'],
      hint: 'Short adjective: add -er.',
      vocab: ['room = salle', 'blue = bleue']
    },
    {
      prompt: 'This option is ___ than the last one.',
      answer: 'faster',
      options: ['faster', 'more fast', 'fastest'],
      hint: 'Use comparative, not superlative.',
      vocab: ['option = option', 'last one = dernière']
    }
  ];

  var compShortFill = [
    {
      prompt: 'The hotel is ___ than the guesthouse. (quiet)',
      answer: 'quieter',
      options: ['quieter', 'more quiet', 'quietest'],
      vocab: ['hotel = hôtel', 'guesthouse = maison d’hôtes']
    },
    {
      prompt: 'The first menu is ___ than the second. (light)',
      answer: 'lighter',
      options: ['lighter', 'more light', 'lightest'],
      vocab: ['menu = menu', 'light = léger']
    },
    {
      prompt: 'The garden is ___ than the terrace. (wide)',
      answer: 'wider',
      options: ['wider', 'more wide', 'widest'],
      vocab: ['garden = jardin', 'wide = large']
    }
  ];

  var compLongQcm = [
    {
      prompt: 'The gold decoration is ___ than the silver decoration.',
      answer: 'more elegant',
      options: ['more elegant', 'eleganter', 'the most elegant'],
      hint: 'Long adjective: use more + adjective.',
      vocab: ['decoration = décoration', 'silver = argenté']
    },
    {
      prompt: 'This room is ___ than the other one.',
      answer: 'more comfortable',
      options: ['comfortabler', 'more comfortable', 'the most comfortable'],
      hint: 'Long adjective → more + adjective.',
      vocab: ['comfortable = confortable', 'other one = autre']
    },
    {
      prompt: 'The evening plan is ___ than the morning plan.',
      answer: 'more practical',
      options: ['practicaler', 'more practical', 'most practical'],
      hint: 'Comparative, not superlative.',
      vocab: ['evening = soir', 'practical = pratique']
    }
  ];

  var compLongFill = [
    {
      prompt: 'This style is ___ than that style. (romantic)',
      answer: 'more romantic',
      options: ['more romantic', 'romanticer', 'the most romantic'],
      vocab: ['style = style', 'romantic = romantique']
    },
    {
      prompt: 'The second proposal is ___ than the first. (professional)',
      answer: 'more professional',
      options: ['professionaler', 'more professional', 'the most professional'],
      vocab: ['proposal = proposition', 'professional = professionnel']
    },
    {
      prompt: 'The outdoor ceremony is ___ than the indoor one. (stressful)',
      answer: 'more stressful',
      options: ['more stressful', 'stressfuller', 'most stressful'],
      vocab: ['outdoor = en extérieur', 'stressful = stressant']
    }
  ];

  var compIrregQcm = [
    {
      prompt: 'This caterer is ___ than the last one.',
      answer: 'better',
      options: ['better', 'gooder', 'best'],
      hint: 'good → better',
      vocab: ['caterer = traiteur', 'last one = précédent']
    },
    {
      prompt: 'That route is ___ than this one.',
      answer: 'worse',
      options: ['worse', 'badder', 'worst'],
      hint: 'bad → worse',
      vocab: ['route = trajet', 'this one = celui-ci']
    },
    {
      prompt: 'The church is ___ than the town hall.',
      answer: 'farther',
      options: ['farther', 'more far', 'farthest'],
      hint: 'far → farther/further',
      vocab: ['church = église', 'town hall = mairie']
    }
  ];

  var compIrregFill = [
    {
      prompt: 'The first supplier is ___ than the second. (good)',
      answer: 'better',
      options: ['better', 'gooder', 'best'],
      vocab: ['supplier = fournisseur', 'first = premier']
    },
    {
      prompt: 'This timing is ___ than yesterday’s. (bad)',
      answer: 'worse',
      options: ['worse', 'badder', 'worst'],
      vocab: ['timing = horaire', 'yesterday’s = celui d’hier']
    },
    {
      prompt: 'The second venue is ___ than the first. (far)',
      answer: 'farther',
      options: ['farther', 'farrer', 'farthest'],
      vocab: ['second venue = deuxième lieu', 'first = premier']
    }
  ];

  var supShortQcm = [
    {
      prompt: 'This is ___ option on the list.',
      answer: 'the cheapest',
      options: ['the cheapest', 'cheaper', 'the most cheap'],
      hint: 'Short adjective: the + -est.',
      vocab: ['option = option', 'list = liste']
    },
    {
      prompt: 'It is ___ room in the hotel.',
      answer: 'the biggest',
      options: ['the biggest', 'bigger', 'the most big'],
      hint: 'Choose the top one in a group.',
      vocab: ['room = chambre / salle', 'biggest = la plus grande']
    },
    {
      prompt: 'That is ___ path to the venue.',
      answer: 'the shortest',
      options: ['the shortest', 'shorter', 'the most short'],
      hint: 'Use superlative.',
      vocab: ['path = chemin', 'shortest = le plus court']
    }
  ];

  var supShortFill = [
    {
      prompt: 'This is ___ table in the room. (small)',
      answer: 'the smallest',
      options: ['the smallest', 'smaller', 'the most small'],
      vocab: ['table = table', 'room = salle']
    },
    {
      prompt: 'It is ___ dress here. (light)',
      answer: 'the lightest',
      options: ['the lightest', 'lighter', 'the most light'],
      vocab: ['dress = robe', 'light = léger']
    },
    {
      prompt: 'This is ___ way to finish fast. (quick)',
      answer: 'the quickest',
      options: ['the quickest', 'quicker', 'the most quick'],
      vocab: ['way = façon', 'finish fast = finir vite']
    }
  ];

  var supLongQcm = [
    {
      prompt: 'This is ___ decoration for an elegant wedding.',
      answer: 'the most elegant',
      options: ['the most elegant', 'more elegant', 'elegantest'],
      hint: 'Long adjective: the most + adjective.',
      vocab: ['decoration = décoration', 'elegant wedding = mariage élégant']
    },
    {
      prompt: 'That is ___ solution for a large family.',
      answer: 'the most practical',
      options: ['practicalest', 'the most practical', 'more practical'],
      hint: 'We are choosing the top option.',
      vocab: ['solution = solution', 'large family = grande famille']
    },
    {
      prompt: 'This is ___ theme of the three.',
      answer: 'the most romantic',
      options: ['the most romantic', 'more romantic', 'romanticest'],
      hint: 'Long adjective → the most.',
      vocab: ['theme = thème', 'of the three = des trois']
    }
  ];

  var supLongFill = [
    {
      prompt: 'This is ___ package for beginners. (comfortable)',
      answer: 'the most comfortable',
      options: ['the most comfortable', 'more comfortable', 'comfortableest'],
      vocab: ['package = formule', 'beginners = débutants']
    },
    {
      prompt: 'That is ___ choice for this budget. (reasonable)',
      answer: 'the most reasonable',
      options: ['the most reasonable', 'more reasonable', 'reasonableest'],
      vocab: ['choice = choix', 'budget = budget']
    },
    {
      prompt: 'This looks like ___ answer. (professional)',
      answer: 'the most professional',
      options: ['professionalest', 'more professional', 'the most professional'],
      vocab: ['answer = réponse', 'professional = professionnel']
    }
  ];

  var supIrregQcm = [
    {
      prompt: 'This is ___ option for quality.',
      answer: 'the best',
      options: ['the best', 'the goodest', 'better'],
      hint: 'good → the best',
      vocab: ['quality = qualité', 'option = option']
    },
    {
      prompt: 'That is ___ time for traffic.',
      answer: 'the worst',
      options: ['the worst', 'the baddest', 'worse'],
      hint: 'bad → the worst',
      vocab: ['traffic = circulation', 'time = moment']
    }
  ];

  var supIrregFill = [
    {
      prompt: 'This is ___ day to travel. (bad)',
      answer: 'the worst',
      options: ['the worst', 'worse', 'the baddest'],
      vocab: ['day = jour', 'travel = voyager']
    },
    {
      prompt: 'This is ___ supplier of all. (good)',
      answer: 'the best',
      options: ['the best', 'better', 'the goodest'],
      vocab: ['supplier = fournisseur', 'of all = de tous']
    }
  ];

  function initLesson() {
    addRuntimeStyles();
    bindGlobalControls();
    bindOpenButtons();
    renderVocab('prepVocabType', 'prepVocab', prepVocab);
    renderVocab('compVocabType', 'compVocab', compVocab);
    renderVocab('supVocabType', 'supVocab', supVocab);

    createQcmExercise({
      key: 'prepQcm', data: prepQcmData,
      promptId: 'prepQcmPrompt', optsId: 'prepQcmOpts', fbId: 'prepQcmFb',
      newId: 'prepQcmNew', hintId: 'prepQcmHint', miniId: 'prepMini1'
    });
    createSelectExercise({
      key: 'prepFill', data: prepFillData,
      promptId: 'prepFillPrompt', selectId: 'prepFillSel', fbId: 'prepFillFb',
      newId: 'prepFillNew', checkId: 'prepFillCheck', miniId: 'prepMini2'
    });
    createDualSelectExercise({
      key: 'prepMix', data: prepMixData,
      promptId: 'prepMixPrompt', selectId: 'prepMixSel', fbId: 'prepMixFb',
      newId: 'prepMixNew', checkId: 'prepMixCheck', miniId: 'prepMini3'
    });

    createQcmExercise({
      key: 'compQ1', data: compShortQcm,
      promptId: 'compQ1Prompt', optsId: 'compQ1Opts', fbId: 'compQ1Fb',
      newId: 'compQ1New', hintId: 'compQ1Hint', miniId: 'compMiniA'
    });
    createSelectExercise({
      key: 'compF1', data: compShortFill,
      promptId: 'compF1Prompt', selectId: 'compF1Sel', fbId: 'compF1Fb',
      newId: 'compF1New', checkId: 'compF1Check', miniId: 'compMiniA'
    });

    createQcmExercise({
      key: 'compQ2', data: compLongQcm,
      promptId: 'compQ2Prompt', optsId: 'compQ2Opts', fbId: 'compQ2Fb',
      newId: 'compQ2New', hintId: 'compQ2Hint', miniId: 'compMiniB'
    });
    createSelectExercise({
      key: 'compF2', data: compLongFill,
      promptId: 'compF2Prompt', selectId: 'compF2Sel', fbId: 'compF2Fb',
      newId: 'compF2New', checkId: 'compF2Check', miniId: 'compMiniB'
    });

    createQcmExercise({
      key: 'compQ3', data: compIrregQcm,
      promptId: 'compQ3Prompt', optsId: 'compQ3Opts', fbId: 'compQ3Fb',
      newId: 'compQ3New', hintId: 'compQ3Hint', miniId: 'compMiniC'
    });
    createSelectExercise({
      key: 'compF3', data: compIrregFill,
      promptId: 'compF3Prompt', selectId: 'compF3Sel', fbId: 'compF3Fb',
      newId: 'compF3New', checkId: 'compF3Check', miniId: 'compMiniC'
    });

    createQcmExercise({
      key: 'supQ1', data: supShortQcm,
      promptId: 'supQ1Prompt', optsId: 'supQ1Opts', fbId: 'supQ1Fb',
      newId: 'supQ1New', hintId: 'supQ1Hint', miniId: 'supMiniA'
    });
    createSelectExercise({
      key: 'supF1', data: supShortFill,
      promptId: 'supF1Prompt', selectId: 'supF1Sel', fbId: 'supF1Fb',
      newId: 'supF1New', checkId: 'supF1Check', miniId: 'supMiniA'
    });

    createQcmExercise({
      key: 'supQ2', data: supLongQcm,
      promptId: 'supQ2Prompt', optsId: 'supQ2Opts', fbId: 'supQ2Fb',
      newId: 'supQ2New', hintId: 'supQ2Hint', miniId: 'supMiniB'
    });
    createSelectExercise({
      key: 'supF2', data: supLongFill,
      promptId: 'supF2Prompt', selectId: 'supF2Sel', fbId: 'supF2Fb',
      newId: 'supF2New', checkId: 'supF2Check', miniId: 'supMiniB'
    });

    createQcmExercise({
      key: 'supQ3', data: supIrregQcm,
      promptId: 'supQ3Prompt', optsId: 'supQ3Opts', fbId: 'supQ3Fb',
      newId: 'supQ3New', hintId: 'supQ3Hint', miniId: 'supMiniC'
    });
    createSelectExercise({
      key: 'supF3', data: supIrregFill,
      promptId: 'supF3Prompt', selectId: 'supF3Sel', fbId: 'supF3Fb',
      newId: 'supF3New', checkId: 'supF3Check', miniId: 'supMiniC'
    });

    applyFR();
    applyLevel();
    applyStep();
  }

  function addRuntimeStyles() {
    if ($('#sabine-runtime-styles')) return;
    var style = document.createElement('style');
    style.id = 'sabine-runtime-styles';
    style.textContent = [
      '.is-hidden{display:none !important;}',
      '.optBtn{display:inline-flex;align-items:center;justify-content:center;padding:10px 14px;border-radius:999px;border:1px solid rgba(0,0,0,.12);background:#fff;cursor:pointer;margin:0 8px 8px 0;font:inherit;}',
      '.optBtn:hover{transform:translateY(-1px);}',
      '.optBtn.ok{background:#dcfce7;border-color:#22c55e;}',
      '.optBtn.no{background:#fee2e2;border-color:#ef4444;}',
      '.vocabItem{border:1px solid rgba(0,0,0,.08);border-radius:16px;padding:10px 12px;background:rgba(255,255,255,.7);}',
      '.vocabTop{display:flex;justify-content:space-between;gap:10px;align-items:center;}',
      '.vocabType{font-size:.78rem;opacity:.75;}',
      '.vocabEn{font-weight:700;}',
      '.vocabFr{margin-top:4px;opacity:.9;}',
      '.listenBtn{border:0;border-radius:999px;padding:6px 10px;cursor:pointer;font:inherit;}',
      '.fb.ok{color:#166534;font-weight:700;}',
      '.fb.no{color:#991b1b;font-weight:700;}',
      '.flashBox{outline:2px solid rgba(0,0,0,.12);outline-offset:4px;border-radius:16px;}',
      '.dualSelects{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}',
      '.miniVocab ul{margin:8px 0 0 18px;padding:0;}',
      '.miniVocab li{margin:3px 0;}'
    ].join('');
    document.head.appendChild(style);
  }

  function bindGlobalControls() {
    var levelSel = $('#levelSel');
    var stepSel = $('#stepSel');
    var frBtn = $('#frBtn');
    var frState = $('#frState');
    var printBtn = $('#printBtn');
    var resetBtn = $('#resetBtn');

    if (levelSel) {
      levelSel.addEventListener('change', function () {
        state.level = levelSel.value;
        applyLevel();
      });
    }

    if (stepSel) {
      stepSel.addEventListener('change', function () {
        state.step = stepSel.value;
        applyStep();
      });
    }

    if (frBtn) {
      frBtn.addEventListener('click', function () {
        state.frOn = !state.frOn;
        frBtn.setAttribute('aria-pressed', state.frOn ? 'true' : 'false');
        if (frState) frState.textContent = state.frOn ? 'ON' : 'OFF';
        applyFR();
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', function () {
        window.print();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        window.location.reload();
      });
    }
  }

  function bindOpenButtons() {
    $$('[data-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = $(btn.getAttribute('data-open'));
        if (!target) return;
        target.classList.add('flashBox');
        window.setTimeout(function () {
          target.classList.remove('flashBox');
        }, 1000);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function applyFR() {
    $$('.fr').forEach(function (el) {
      el.classList.toggle('is-hidden', !state.frOn);
    });
  }

  function applyLevel() {
    var level = state.level;
    $$('[data-level]').forEach(function (el) {
      var need = parseInt(el.getAttribute('data-level'), 10) || 1;
      var show = level === 'all' || parseInt(level, 10) >= need;
      el.classList.toggle('is-hidden', !show);
    });
  }

  function applyStep() {
    var step = state.step;
    $$('.step').forEach(function (el) {
      var currentStep = el.getAttribute('data-step');
      var show = step === 'all' || step === currentStep;
      el.classList.toggle('is-hidden', !show);
    });
  }

  function renderVocab(filterId, wrapId, list) {
    var filter = $('#' + filterId);
    var wrap = $('#' + wrapId);
    if (!wrap) return;

    function paint() {
      var type = filter ? filter.value : 'all';
      var shown = list.filter(function (item) {
        return type === 'all' || item.type === type;
      });
      wrap.innerHTML = shown.map(function (item) {
        return [
          '<div class=\"vocabItem\">',
          '  <div class=\"vocabTop\">',
          '    <div>',
          '      <div class=\"vocabEn\">' + escapeHtml(item.en) + '</div>',
          '      <div class=\"vocabType\">' + escapeHtml(item.type) + '</div>',
          '    </div>',
          '    <button class=\"listenBtn\" type=\"button\" data-say=\"' + escapeHtml(item.en) + '\">🔊 Listen</button>',
          '  </div>',
          '  <div class=\"vocabFr fr\">' + escapeHtml(item.fr) + '</div>',
          '</div>'
        ].join('');
      }).join('');
      $$('[data-say]', wrap).forEach(function (btn) {
        btn.addEventListener('click', function () {
          speak(btn.getAttribute('data-say'));
        });
      });
      applyFR();
    }

    if (filter) {
      filter.addEventListener('change', paint);
    }
    paint();
  }

  function miniVocabHtml(items) {
    return [
      '<div><strong>Quick vocab</strong></div>',
      '<ul>',
      items.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join(''),
      '</ul>'
    ].join('');
  }

  function createQcmExercise(cfg) {
    var promptEl = $('#' + cfg.promptId);
    var optsEl = $('#' + cfg.optsId);
    var fbEl = $('#' + cfg.fbId);
    var newBtn = $('#' + cfg.newId);
    var hintBtn = $('#' + cfg.hintId);
    var miniEl = $('#' + cfg.miniId);
    if (!promptEl || !optsEl || !fbEl) return;

    function loadOne() {
      var item = sample(cfg.data);
      state.current[cfg.key] = item;
      promptEl.textContent = item.prompt;
      if (miniEl) miniEl.innerHTML = miniVocabHtml(item.vocab || []);
      fbEl.className = 'fb';
      fbEl.textContent = '';
      optsEl.innerHTML = shuffle(item.options).map(function (opt) {
        return '<button type=\"button\" class=\"optBtn\" data-value=\"' + escapeHtml(opt) + '\">' + escapeHtml(opt) + '</button>';
      }).join('');
      $$('.optBtn', optsEl).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var chosen = btn.getAttribute('data-value');
          var ok = chosen === item.answer;
          $$('.optBtn', optsEl).forEach(function (b) {
            var v = b.getAttribute('data-value');
            b.classList.remove('ok', 'no');
            if (v === item.answer) b.classList.add('ok');
            if (v === chosen && !ok) b.classList.add('no');
          });
          fbEl.className = 'fb ' + (ok ? 'ok' : 'no');
          fbEl.textContent = ok ? 'Correct!' : 'Not yet. Correct answer: ' + item.answer;
        });
      });
    }

    if (newBtn) newBtn.addEventListener('click', loadOne);
    if (hintBtn) {
      hintBtn.addEventListener('click', function () {
        var item = state.current[cfg.key];
        if (!item) return;
        fbEl.className = 'fb';
        fbEl.textContent = 'Hint: ' + item.hint;
      });
    }
    loadOne();
  }

  function createSelectExercise(cfg) {
    var promptEl = $('#' + cfg.promptId);
    var selectEl = $('#' + cfg.selectId);
    var fbEl = $('#' + cfg.fbId);
    var newBtn = $('#' + cfg.newId);
    var checkBtn = $('#' + cfg.checkId);
    var miniEl = $('#' + cfg.miniId);
    if (!promptEl || !selectEl || !fbEl) return;

    function loadOne() {
      var item = sample(cfg.data);
      state.current[cfg.key] = item;
      promptEl.textContent = item.prompt;
      if (miniEl) miniEl.innerHTML = miniVocabHtml(item.vocab || []);
      fbEl.className = 'fb';
      fbEl.textContent = '';
      selectEl.innerHTML = ['<option value=\"\">Choose…</option>'].concat(shuffle(item.options).map(function (opt) {
        return '<option value=\"' + escapeHtml(opt) + '\">' + escapeHtml(opt) + '</option>';
      })).join('');
    }

    if (checkBtn) {
      checkBtn.addEventListener('click', function () {
        var item = state.current[cfg.key];
        if (!item) return;
        var chosen = selectEl.value;
        if (!chosen) {
          fbEl.className = 'fb no';
          fbEl.textContent = 'Choose an answer first.';
          return;
        }
        var ok = chosen === item.answer;
        fbEl.className = 'fb ' + (ok ? 'ok' : 'no');
        fbEl.textContent = ok ? 'Correct!' : 'Not yet. Correct answer: ' + item.answer;
      });
    }
    if (newBtn) newBtn.addEventListener('click', loadOne);
    loadOne();
  }

  function createDualSelectExercise(cfg) {
    var promptEl = $('#' + cfg.promptId);
    var selectWrap = $('#' + cfg.selectId);
    var fbEl = $('#' + cfg.fbId);
    var newBtn = $('#' + cfg.newId);
    var checkBtn = $('#' + cfg.checkId);
    var miniEl = $('#' + cfg.miniId);
    if (!promptEl || !selectWrap || !fbEl) return;

    function selectHtml(options, suffix) {
      return [
        '<select class=\"select\" data-dual=\"' + suffix + '\">',
        '<option value=\"\">Choose…</option>',
        shuffle(options).map(function (opt) {
          return '<option value=\"' + escapeHtml(opt) + '\">' + escapeHtml(opt) + '</option>';
        }).join(''),
        '</select>'
      ].join('');
    }

    function loadOne() {
      var item = sample(cfg.data);
      state.current[cfg.key] = item;
      promptEl.textContent = item.prompt;
      if (miniEl) miniEl.innerHTML = miniVocabHtml(item.vocab || []);
      fbEl.className = 'fb';
      fbEl.textContent = '';
      selectWrap.className = 'dualSelects';
      selectWrap.innerHTML = selectHtml(item.parts, '1') + selectHtml(item.parts, '2');
    }

    if (checkBtn) {
      checkBtn.addEventListener('click', function () {
        var item = state.current[cfg.key];
        if (!item) return;
        var sels = $$('select', selectWrap);
        if (sels.length < 2) return;
        var a = sels[0].value;
        var b = sels[1].value;
        if (!a || !b) {
          fbEl.className = 'fb no';
          fbEl.textContent = 'Choose both answers first.';
          return;
        }
        var answer = item.answer.split('|').map(function (x) { return x.trim(); });
        var ok = a === answer[0] && b === answer[1];
        fbEl.className = 'fb ' + (ok ? 'ok' : 'no');
        fbEl.textContent = ok ? 'Correct!' : 'Not yet. Correct answer: ' + answer[0] + ' / ' + answer[1];
      });
    }
    if (newBtn) newBtn.addEventListener('click', loadOne);
    loadOne();
  }
})();