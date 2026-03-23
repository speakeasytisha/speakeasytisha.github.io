(function () {
  'use strict';

  const state = {
    score: 0,
    total: 0,
    scored: new WeakSet(),
    selectedToken: null,
    focusedDropzone: null,
    selectedSeqToken: null,
    aeiSequence: []
  };

  const scoreValue = document.getElementById('scoreValue');
  const scoreTotal = document.getElementById('scoreTotal');
  const progressBar = document.getElementById('progressBar');

  function updateScore() {
    scoreValue.textContent = String(state.score);
    scoreTotal.textContent = String(state.total);
    const percent = state.total ? Math.round((state.score / state.total) * 100) : 0;
    progressBar.style.width = percent + '%';
  }

  function registerPoints(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      state.total += Number(el.dataset.points || 0);
    });
    updateScore();
  }

  function addPointsOnce(el) {
    if (!state.scored.has(el)) {
      state.scored.add(el);
      state.score += Number(el.dataset.points || 0);
      updateScore();
    }
  }

  function setFeedback(node, text, type) {
    if (!node) {
      return;
    }
    node.textContent = text;
    node.classList.remove('good', 'bad');
    if (type) {
      node.classList.add(type);
    }
  }

  function shuffleArray(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function initModal() {
    const modal = document.getElementById('howToModal');
    const openBtn = document.getElementById('howToBtn');
    const closeBtn = document.getElementById('closeModalBtn');

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }

    function openModal() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  function initPrint() {
    document.getElementById('printBtn').addEventListener('click', function () {
      window.print();
    });
  }

  function initVocab() {
    document.querySelectorAll('.vocab-card').forEach((card) => {
      const front = card.querySelector('.front');
      const back = card.querySelector('.back');
      const term = card.dataset.term;
      const def = card.dataset.def;
      const tip = card.dataset.tip;
      let open = false;

      card.addEventListener('click', function () {
        open = !open;
        card.classList.toggle('is-open', open);
        if (open) {
          back.innerHTML = '<strong>' + term + '</strong><br>' + def + '<br><span>💡 ' + tip + '</span>';
          front.style.opacity = '0.95';
        } else {
          back.textContent = '';
          front.style.opacity = '1';
        }
      });
    });
  }

  function genericChoiceInit(selector, correctMsg, wrongMsg) {
    document.querySelectorAll(selector).forEach((card) => {
      const answer = card.dataset.answer;
      const feedback = card.querySelector('.feedback');
      const buttons = Array.from(card.querySelectorAll('button[data-choice]'));

      buttons.forEach((btn) => {
        btn.addEventListener('click', function () {
          const choice = btn.dataset.choice;

          buttons.forEach((b) => {
            b.disabled = true;
            b.classList.remove('correct', 'wrong');
          });

          const goodBtn = buttons.find((b) => b.dataset.choice === answer);
          if (goodBtn) {
            goodBtn.classList.add('correct');
          }

          if (choice === answer) {
            btn.classList.add('correct');
            setFeedback(feedback, correctMsg, 'good');
            addPointsOnce(card);
          } else {
            btn.classList.add('wrong');
            setFeedback(feedback, wrongMsg, 'bad');
          }
        });
      });
    });
  }

  function wireToken(token) {
    token.addEventListener('dragstart', function () {
      state.selectedToken = token;
      token.classList.remove('selected');
    });

    token.addEventListener('click', function () {
      document.querySelectorAll('.token').forEach((t) => t.classList.remove('selected'));
      state.selectedToken = token;
      token.classList.add('selected');
    });
  }

  function clearFocusedZones() {
    document.querySelectorAll('.dropzone').forEach((zone) => zone.classList.remove('focused'));
  }

  function moveTokenToZone(token, zone) {
    if (!token || !zone) {
      return;
    }
    if (token.dataset.group && zone.dataset.group && token.dataset.group !== zone.dataset.group) {
      return;
    }
    const items = zone.querySelector('.drop-items');
    if (items) {
      items.appendChild(token);
      token.classList.remove('selected');
    }
  }

  function initDropzones() {
    document.querySelectorAll('.token').forEach(wireToken);

    document.querySelectorAll('.dropzone').forEach((zone) => {
      zone.addEventListener('dragover', function (event) {
        event.preventDefault();
        zone.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', function () {
        zone.classList.remove('drag-over');
      });

      zone.addEventListener('drop', function (event) {
        event.preventDefault();
        zone.classList.remove('drag-over');
        moveTokenToZone(state.selectedToken, zone);
      });

      zone.addEventListener('click', function () {
        clearFocusedZones();
        zone.classList.add('focused');
        state.focusedDropzone = zone;
        if (state.selectedToken) {
          moveTokenToZone(state.selectedToken, zone);
        }
      });
    });
  }

  function resetBank(bankId, entries) {
    const bank = document.getElementById(bankId);
    bank.innerHTML = '';
    entries.forEach((entry) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'token';
      button.draggable = true;
      button.dataset.category = entry.category;
      button.dataset.group = entry.group;
      button.textContent = entry.label;
      bank.appendChild(button);
      wireToken(button);
    });
  }

  function clearZones(selector) {
    document.querySelectorAll(selector).forEach((zone) => {
      const items = zone.querySelector('.drop-items');
      if (items) {
        items.innerHTML = '';
      }
      zone.classList.remove('focused');
    });
  }

  const instancesEntries = [
    { label: 'dire bonjour à table', category: 'famille', group: 'instances' },
    { label: "respecter un emploi du temps", category: 'ecole', group: 'instances' },
    { label: "adopter les codes d'un groupe d'amis", category: 'pairs', group: 'instances' },
    { label: "apprendre l'esprit d'équipe au sport", category: 'loisirs', group: 'instances' },
    { label: 'participer à un rituel collectif', category: 'religion', group: 'instances' },
    { label: "découvrir d'autres habitudes en voyage", category: 'voyages', group: 'instances' }
  ];

  function initInstancesExercise() {
    const feedback = document.getElementById('instancesFeedback');
    const checkBtn = document.getElementById('checkInstancesBtn');
    const shuffleBtn = document.getElementById('shuffleInstancesBtn');
    const resetBtn = document.getElementById('resetInstancesBtn');
    const panel = document.getElementById('instancesBank').closest('.panel') || document.body;
    panel.dataset.points = '2';

    function evaluate() {
      const tokens = Array.from(document.querySelectorAll('#instancesBank .token, .zone-grid .dropzone .token'));
      let allPlaced = true;
      let allCorrect = true;

      tokens.forEach((token) => {
        token.classList.remove('correct', 'wrong');
        const zone = token.closest('.dropzone');
        if (!zone) {
          allPlaced = false;
          allCorrect = false;
          return;
        }
        if (zone.dataset.category === token.dataset.category) {
          token.classList.add('correct');
        } else {
          token.classList.add('wrong');
          allCorrect = false;
        }
      });

      if (!allPlaced) {
        setFeedback(feedback, "❌ Il manque encore des étiquettes à placer.", 'bad');
        return;
      }

      if (allCorrect) {
        setFeedback(feedback, "✅ Très bien ! Tu as bien identifié les instances de socialisation.", 'good');
        if (!panel.dataset.awarded) {
          panel.dataset.awarded = 'yes';
          state.score += 2;
          updateScore();
        }
      } else {
        setFeedback(feedback, "❌ Certaines étiquettes sont mal placées. Regarde les rouges.", 'bad');
      }
    }

    function fullReset(shuffle) {
      clearZones('.zone-grid .dropzone');
      const entries = shuffle ? shuffleArray(instancesEntries) : instancesEntries;
      resetBank('instancesBank', entries);
      setFeedback(feedback, '', null);
      state.selectedToken = null;
    }

    shuffleBtn.addEventListener('click', function () {
      fullReset(true);
    });

    resetBtn.addEventListener('click', function () {
      fullReset(false);
    });

    checkBtn.addEventListener('click', evaluate);
  }

  function initAeiSequence() {
    const tokens = Array.from(document.querySelectorAll('.seq-token'));
    const target = document.getElementById('aeiTarget');
    const addBtn = document.getElementById('addAeiBtn');
    const checkBtn = document.getElementById('checkAeiBtn');
    const resetBtn = document.getElementById('resetAeiBtn');
    const feedback = document.getElementById('aeiFeedback');
    const card = document.getElementById('aeiTarget').closest('.panel');
    card.dataset.points = '2';

    tokens.forEach((token) => {
      token.addEventListener('click', function () {
        tokens.forEach((t) => t.classList.remove('selected'));
        token.classList.add('selected');
        state.selectedSeqToken = token;
      });
    });

    function renderSequence() {
      target.innerHTML = '';
      if (!state.aeiSequence.length) {
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        placeholder.textContent = "Sélectionne une étiquette puis ajoute-la ici dans le bon ordre.";
        target.appendChild(placeholder);
        return;
      }

      state.aeiSequence.forEach((label) => {
        const chip = document.createElement('div');
        chip.className = 'sequence-chip';
        chip.textContent = label;
        target.appendChild(chip);
      });
    }

    addBtn.addEventListener('click', function () {
      if (!state.selectedSeqToken) {
        setFeedback(feedback, "Choisis d'abord une étiquette.", 'bad');
        return;
      }
      const label = state.selectedSeqToken.textContent.trim();
      if (state.aeiSequence.length >= 3) {
        setFeedback(feedback, "Tu as déjà placé les trois étapes.", 'bad');
        return;
      }
      state.aeiSequence.push(label);
      renderSequence();
      setFeedback(feedback, '', null);
    });

    checkBtn.addEventListener('click', function () {
      const goodOrder = ['Affirmer', 'Expliquer', 'Illustrer'];
      const chips = Array.from(target.querySelectorAll('.sequence-chip'));
      let ok = state.aeiSequence.length === goodOrder.length;

      chips.forEach((chip, index) => {
        chip.classList.remove('correct', 'wrong');
        if (state.aeiSequence[index] === goodOrder[index]) {
          chip.classList.add('correct');
        } else {
          chip.classList.add('wrong');
          ok = false;
        }
      });

      if (!ok) {
        setFeedback(feedback, "❌ Ce n'est pas encore le bon ordre. Pense : j'affirme, j'explique, puis j'illustre.", 'bad');
        return;
      }

      setFeedback(feedback, "✅ Parfait ! AEI = Affirmer, Expliquer, Illustrer.", 'good');
      if (!card.dataset.awarded) {
        card.dataset.awarded = 'yes';
        state.score += 2;
        updateScore();
      }
    });

    resetBtn.addEventListener('click', function () {
      state.aeiSequence = [];
      state.selectedSeqToken = null;
      tokens.forEach((t) => t.classList.remove('selected'));
      renderSequence();
      setFeedback(feedback, '', null);
    });

    renderSequence();
  }

  const mindEntries = [
    { label: 'socialisation primaire', category: 'etapes', group: 'mind' },
    { label: 'socialisation secondaire', category: 'etapes', group: 'mind' },
    { label: 'injonction', category: 'mecanismes', group: 'mind' },
    { label: 'imitation', category: 'mecanismes', group: 'mind' },
    { label: 'interaction', category: 'mecanismes', group: 'mind' },
    { label: 'famille', category: 'instances', group: 'mind' },
    { label: 'école', category: 'instances', group: 'mind' },
    { label: 'amis / pairs', category: 'instances', group: 'mind' },
    { label: 'loisirs', category: 'instances', group: 'mind' },
    { label: 'religion', category: 'instances', group: 'mind' },
    { label: 'capital économique', category: 'milieux', group: 'mind' },
    { label: 'capital culturel', category: 'milieux', group: 'mind' },
    { label: 'capital social', category: 'milieux', group: 'mind' },
    { label: 'stéréotypes', category: 'genre', group: 'mind' },
    { label: 'genre', category: 'genre', group: 'mind' },
    { label: 'sexe', category: 'genre', group: 'mind' },
    { label: 'socialisation genrée', category: 'genre', group: 'mind' }
  ];

  function initMindmapExercise() {
    const feedback = document.getElementById('mindFeedback');
    const shuffleBtn = document.getElementById('shuffleMindBtn');
    const resetBtn = document.getElementById('resetMindBtn');
    const checkBtn = document.getElementById('checkMindBtn');
    const panel = document.getElementById('mindBank').closest('.panel');
    panel.dataset.points = '4';

    function evaluate() {
      const tokens = Array.from(document.querySelectorAll('#mindBank .token, .mindmap-panel .mind-branch .token'));
      let allPlaced = true;
      let allCorrect = true;

      tokens.forEach((token) => {
        token.classList.remove('correct', 'wrong');
        const zone = token.closest('.mind-branch');
        if (!zone) {
          allPlaced = false;
          allCorrect = false;
          return;
        }
        if (zone.dataset.category === token.dataset.category) {
          token.classList.add('correct');
        } else {
          token.classList.add('wrong');
          allCorrect = false;
        }
      });

      if (!allPlaced) {
        setFeedback(feedback, "❌ Ta carte mentale n'est pas encore complète.", 'bad');
        return;
      }

      if (allCorrect) {
        setFeedback(feedback, "✅ Super ! La carte mentale du chapitre est correctement remplie.", 'good');
        if (!panel.dataset.awarded) {
          panel.dataset.awarded = 'yes';
          state.score += 4;
          updateScore();
        }
      } else {
        setFeedback(feedback, "❌ Certaines notions ne sont pas sur la bonne branche. Regarde les étiquettes rouges.", 'bad');
      }
    }

    function fullReset(shuffle) {
      clearZones('.mindmap-panel .mind-branch');
      const entries = shuffle ? shuffleArray(mindEntries) : mindEntries;
      resetBank('mindBank', entries);
      setFeedback(feedback, '', null);
      state.selectedToken = null;
    }

    shuffleBtn.addEventListener('click', function () {
      fullReset(true);
    });

    resetBtn.addEventListener('click', function () {
      fullReset(false);
    });

    checkBtn.addEventListener('click', evaluate);
  }

  function initWritingBox() {
    const area = document.getElementById('miniWrite');
    const copyBtn = document.getElementById('copyWriteBtn');
    const clearBtn = document.getElementById('clearWriteBtn');

    copyBtn.addEventListener('click', function () {
      area.select();
      try {
        document.execCommand('copy');
        copyBtn.textContent = '✅ Copié';
        window.setTimeout(function () {
          copyBtn.textContent = '📋 Copier';
        }, 1200);
      } catch (err) {
        copyBtn.textContent = 'Copie manuelle';
      }
    });

    clearBtn.addEventListener('click', function () {
      area.value = '';
    });
  }

  function initResetAll() {
    document.getElementById('resetAllBtn').addEventListener('click', function () {
      window.location.reload();
    });
  }

  function init() {
    registerPoints('.mcq, .scenario-card, .genre-card');
    state.total += 2 + 2 + 4;
    updateScore();

    initModal();
    initPrint();
    initVocab();

    genericChoiceInit(
      '.mcq',
      "✅ Bravo ! C'est correct.",
      "❌ Ce n'est pas correct. Relis le cours et repère le mot-clé."
    );

    genericChoiceInit(
      '.scenario-card',
      "✅ Bien vu ! Tu as choisi le bon mécanisme.",
      "❌ Pas tout à fait. Reprends l'astuce : injonction = on impose, imitation = on reproduit, interaction = on ajuste avec les autres."
    );

    genericChoiceInit(
      '.genre-card',
      "✅ Exact ! Tu as choisi la bonne notion.",
      "❌ Pas tout à fait. Pense : sexe = biologique, genre = social, socialisation genrée = apprentissage différencié."
    );

    initDropzones();
    initInstancesExercise();
    initAeiSequence();
    initMindmapExercise();
    initWritingBox();
    initResetAll();
  }

  init();
}());
