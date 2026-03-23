(function () {
  'use strict';

  const state = {
    score: 0,
    total: 0,
    scored: new WeakSet(),
    selectedToken: null,
    focusedDropzone: null,
    sequence: []
  };

  const scoreValue = document.getElementById('scoreValue');
  const scoreTotal = document.getElementById('scoreTotal');
  const progressBar = document.getElementById('progressBar');

  function registerPoints(elements) {
    elements.forEach((el) => {
      const points = Number(el.dataset.points || 0);
      state.total += points;
    });
    updateScore();
  }

  function addPointsOnce(el) {
    const points = Number(el.dataset.points || 0);
    if (!state.scored.has(el) && points > 0) {
      state.scored.add(el);
      state.score += points;
      updateScore();
    }
  }

  function updateScore() {
    scoreValue.textContent = String(state.score);
    scoreTotal.textContent = String(state.total);
    const percent = state.total ? Math.round((state.score / state.total) * 100) : 0;
    progressBar.style.width = percent + '%';
  }

  function setFeedback(node, text, type) {
    node.textContent = text;
    node.classList.remove('good', 'bad');
    if (type) {
      node.classList.add(type);
    }
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
    const printBtn = document.getElementById('printBtn');
    printBtn.addEventListener('click', function () {
      window.print();
    });
  }

  function initVocab() {
    document.querySelectorAll('.vocab-card').forEach((card) => {
      const back = card.querySelector('.back');
      const term = card.dataset.term;
      const def = card.dataset.def;
      const tip = card.dataset.tip;
      let open = false;

      card.addEventListener('click', function () {
        open = !open;
        if (open) {
          back.innerHTML = '<strong>' + term + ' :</strong> ' + def + '<br><span>💡 ' + tip + '</span>';
        } else {
          back.textContent = '';
        }
      });
    });
  }

  function initMCQ() {
    document.querySelectorAll('.mcq').forEach((card) => {
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
            setFeedback(feedback, '✅ Bravo ! C’est correct. Garde en tête : la socialisation est un apprentissage de la vie en société.', 'good');
            addPointsOnce(card);
          } else {
            btn.classList.add('wrong');
            setFeedback(feedback, '❌ Ce n’est pas la bonne réponse. Lis bien le mot-clé : apprentissage social, pas quelque chose d’uniquement inné.', 'bad');
          }
        });
      });
    });
  }

  function initTrueFalse() {
    document.querySelectorAll('.truefalse').forEach((card) => {
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
            setFeedback(feedback, '✅ Exact. Continue comme ça.', 'good');
            addPointsOnce(card);
          } else {
            btn.classList.add('wrong');
            setFeedback(feedback, '❌ Faux. Reprends le cours : la socialisation commence dès la naissance et ne se réduit pas à l’inné.', 'bad');
          }
        });
      });
    });
  }

  function initGapFill() {
    const card = document.querySelector('.gap-card');
    if (!card) {
      return;
    }
    const selects = Array.from(card.querySelectorAll('select'));
    const feedback = card.querySelector('.aggregate-feedback');

    function evaluate() {
      let allChosen = true;
      let allCorrect = true;

      selects.forEach((select) => {
        const selected = select.value;
        const answer = select.dataset.answer;
        select.classList.remove('good', 'bad');

        if (!selected) {
          allChosen = false;
          allCorrect = false;
          return;
        }

        if (selected === answer) {
          select.classList.add('good');
        } else {
          select.classList.add('bad');
          allCorrect = false;
        }
      });

      if (!allChosen) {
        setFeedback(feedback, 'Complète chaque case.', null);
        return;
      }

      if (allCorrect) {
        setFeedback(feedback, '✅ Très bien ! Le texte est entièrement correct.', 'good');
        addPointsOnce(card);
      } else {
        setFeedback(feedback, '❌ Il y a encore une ou plusieurs erreurs. Les cases rouges sont à corriger.', 'bad');
      }
    }

    selects.forEach((select) => {
      select.addEventListener('change', evaluate);
    });
  }

  function createToken(label, category) {
    const token = document.createElement('button');
    token.type = 'button';
    token.className = 'token';
    token.draggable = true;
    token.dataset.label = label;
    token.dataset.category = category;
    token.textContent = label;
    wireToken(token);
    return token;
  }

  function wireToken(token) {
    token.addEventListener('dragstart', function () {
      token.classList.remove('selected');
      state.selectedToken = token;
    });

    token.addEventListener('click', function () {
      document.querySelectorAll('.token').forEach((t) => t.classList.remove('selected'));
      state.selectedToken = token;
      token.classList.add('selected');
    });
  }

  function moveTokenToZone(token, dropzone) {
    if (!token || !dropzone) {
      return;
    }
    const items = dropzone.querySelector('.drop-items');
    if (items) {
      items.appendChild(token);
      token.classList.remove('selected');
    }
  }

  function initSorting() {
    const card = document.querySelector('.sorting-card');
    const wordBank = document.getElementById('wordBank');
    const dropzones = Array.from(document.querySelectorAll('.dropzone'));
    const checkBtn = document.getElementById('checkSortBtn');
    const resetBtn = document.getElementById('resetSortBtn');
    const feedback = document.getElementById('sortingFeedback');

    document.querySelectorAll('.token').forEach(wireToken);

    dropzones.forEach((zone) => {
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
        dropzones.forEach((z) => z.classList.remove('focused'));
        zone.classList.add('focused');
        state.focusedDropzone = zone;
        if (state.selectedToken) {
          moveTokenToZone(state.selectedToken, zone);
        }
      });
    });

    checkBtn.addEventListener('click', function () {
      const allTokens = Array.from(card.querySelectorAll('.token'));
      let allPlaced = true;
      let allCorrect = true;

      allTokens.forEach((token) => {
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
        setFeedback(feedback, '❌ Il manque encore des étiquettes à placer.', 'bad');
        return;
      }

      if (allCorrect) {
        setFeedback(feedback, '✅ Excellent ! Tu as bien classé toutes les observations.', 'good');
        addPointsOnce(card);
      } else {
        setFeedback(feedback, '❌ Certaines étiquettes ne sont pas dans la bonne catégorie. Regarde les éléments en rouge.', 'bad');
      }
    });

    resetBtn.addEventListener('click', function () {
      const labels = [
        ['Proximité avec la nature', 'environnement'],
        ['Environnement urbain', 'environnement'],
        ['Contacts familiaux', 'relations'],
        ['Présence des adultes', 'relations'],
        ['Normes vestimentaires', 'modevie'],
        ['Alimentation', 'modevie'],
        ['Autonomie', 'modevie'],
        ['Contact avec les autres enfants', 'relations']
      ];
      wordBank.innerHTML = '';
      labels.forEach(([label, category]) => {
        wordBank.appendChild(createToken(label, category));
      });
      dropzones.forEach((zone) => {
        zone.classList.remove('focused', 'drag-over');
        zone.querySelector('.drop-items').innerHTML = '';
      });
      state.selectedToken = null;
      state.focusedDropzone = null;
      setFeedback(feedback, 'Place les étiquettes dans les bonnes catégories.', null);
    });
  }

  function initSequence() {
    const card = document.querySelector('.sequence-card');
    const bank = document.getElementById('sequenceBank');
    const output = document.getElementById('sequenceOutput');
    const feedback = document.getElementById('sequenceFeedback');
    const checkBtn = document.getElementById('checkSeqBtn');
    const resetBtn = document.getElementById('resetSeqBtn');
    const initialButtons = Array.from(bank.querySelectorAll('.seq-token')).map((btn) => ({
      text: btn.textContent,
      value: btn.dataset.value
    }));

    function renderSequence() {
      output.innerHTML = '';
      state.sequence.forEach((text) => {
        const li = document.createElement('li');
        li.textContent = text;
        output.appendChild(li);
      });
    }

    bank.addEventListener('click', function (event) {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.classList.contains('seq-token')) {
        return;
      }
      state.sequence.push(target.textContent || '');
      renderSequence();
      target.disabled = true;
      target.classList.add('correct');
    });

    checkBtn.addEventListener('click', function () {
      const expected = [
        'L’enfant naît dans une société',
        'L’enfant observe son entourage',
        'L’enfant apprend des règles et des comportements',
        'L’enfant intériorise des habitudes',
        'L’enfant construit sa personnalité'
      ];

      if (state.sequence.length !== expected.length) {
        setFeedback(feedback, '❌ Il faut sélectionner les 5 étapes.', 'bad');
        return;
      }

      const allCorrect = expected.every((text, index) => state.sequence[index] === text);
      if (allCorrect) {
        setFeedback(feedback, '✅ Très bien ! Tu as retrouvé l’ordre logique.', 'good');
        addPointsOnce(card);
      } else {
        setFeedback(feedback, '❌ Ce n’est pas encore le bon ordre. Pense : naissance → observation → apprentissage → intériorisation → personnalité.', 'bad');
      }
    });

    resetBtn.addEventListener('click', function () {
      state.sequence = [];
      renderSequence();
      bank.innerHTML = '';
      initialButtons.forEach((item) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'seq-token';
        btn.dataset.value = item.value;
        btn.textContent = item.text;
        bank.appendChild(btn);
      });
      setFeedback(feedback, 'Tape chaque étape dans l’ordre.', null);
    });
  }

  function initOpenQuestions() {
    document.querySelectorAll('.open-question').forEach((card) => {
      const btn = card.querySelector('.reveal-btn');
      const answer = card.querySelector('.model-answer');
      btn.addEventListener('click', function () {
        const isHidden = answer.hasAttribute('hidden');
        if (isHidden) {
          answer.removeAttribute('hidden');
          btn.textContent = 'Masquer la réponse';
        } else {
          answer.setAttribute('hidden', 'hidden');
          btn.textContent = 'Voir une réponse possible';
        }
      });
    });
  }

  function initResetAll() {
    const btn = document.getElementById('resetAllBtn');
    btn.addEventListener('click', function () {
      window.location.reload();
    });
  }

  registerPoints(Array.from(document.querySelectorAll('[data-points]')));
  initModal();
  initPrint();
  initVocab();
  initMCQ();
  initTrueFalse();
  initGapFill();
  initSorting();
  initSequence();
  initOpenQuestions();
  initResetAll();
}());
