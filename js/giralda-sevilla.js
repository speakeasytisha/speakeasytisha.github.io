(() => {
  "use strict";

  const vocabCards = [
    {
      icon: "📍",
      word: "se encuentra",
      definition: "Está situado o está ubicado en un lugar.",
      translation: "se trouve",
      example: "La Giralda se encuentra en el centro de Sevilla."
    },
    {
      icon: "⛪",
      word: "junto a",
      definition: "Muy cerca de algo.",
      translation: "à côté de",
      example: "La Giralda está junto a la Catedral."
    },
    {
      icon: "🔔",
      word: "el campanario",
      definition: "La torre donde están las campanas.",
      translation: "le clocher",
      example: "Hoy la Giralda es el campanario de la Catedral."
    },
    {
      icon: "🕌",
      word: "el minarete",
      definition: "Torre de una mezquita desde donde se llamaba a la oración.",
      translation: "le minaret",
      example: "Al principio, la Giralda fue un minarete."
    },
    {
      icon: "🕌",
      word: "la mezquita",
      definition: "Edificio religioso musulmán.",
      translation: "la mosquée",
      example: "La torre formaba parte de una gran mezquita."
    },
    {
      icon: "🏛️",
      word: "almohade",
      definition: "Relacionado con una dinastía musulmana del norte de África y al-Ándalus.",
      translation: "almohade",
      example: "La base de la torre es de época almohade."
    },
    {
      icon: "🛡️",
      word: "se conservó",
      definition: "No fue destruido; se mantuvo.",
      translation: "a été conservé(e)",
      example: "Después de la conquista cristiana, la torre se conservó."
    },
    {
      icon: "🎨",
      word: "renacentista",
      definition: "Relacionado con el arte del Renacimiento.",
      translation: "Renaissance",
      example: "La parte superior es de estilo renacentista."
    },
    {
      icon: "↗️",
      word: "las rampas",
      definition: "Caminos inclinados para subir poco a poco.",
      translation: "les rampes",
      example: "La Giralda tiene rampas interiores."
    },
    {
      icon: "🐎",
      word: "subir a caballo",
      definition: "Montar un caballo para llegar arriba.",
      translation: "monter à cheval",
      example: "Las rampas permitían subir a caballo."
    },
    {
      icon: "🤝",
      word: "la mezcla",
      definition: "La unión de varias cosas diferentes.",
      translation: "le mélange",
      example: "La Giralda muestra una mezcla de culturas."
    },
    {
      icon: "⭐",
      word: "el símbolo",
      definition: "Algo que representa una idea, una ciudad o una cultura.",
      translation: "le symbole",
      example: "La Giralda es un símbolo de Sevilla."
    },
    {
      icon: "👀",
      word: "atraer",
      definition: "Hacer que la gente quiera venir o mirar.",
      translation: "attirer",
      example: "La Giralda atrae a muchos visitantes."
    },
    {
      icon: "👥",
      word: "los visitantes",
      definition: "Personas que visitan un lugar.",
      translation: "les visiteurs",
      example: "Los visitantes admiran la belleza de la torre."
    },
    {
      icon: "🔷",
      word: "motivos geométricos",
      definition: "Decoraciones con formas como líneas, rombos o círculos.",
      translation: "motifs géométriques",
      example: "Sus motivos geométricos son muy elegantes."
    },
    {
      icon: "☀️",
      word: "el Giraldillo",
      definition: "La estatua que está en la parte más alta de la torre.",
      translation: "le Giraldillo",
      example: "El Giraldillo corona la Giralda."
    },
    {
      icon: "🕰️",
      word: "siglo XII",
      definition: "El siglo doce; en historia se escribe con números romanos.",
      translation: "le XIIe siècle",
      example: "La torre fue construida a finales del siglo XII."
    },
    {
      icon: "🕰️",
      word: "siglo XVI",
      definition: "El siglo dieciséis; en historia se escribe con números romanos.",
      translation: "le XVIe siècle",
      example: "En el siglo XVI, se añadió la parte superior."
    }
  ];

  const quizQuestions = [
    {
      question: "¿Dónde se encuentra la Giralda?",
      options: ["En Madrid", "En Sevilla", "En Granada"],
      answer: "En Sevilla"
    },
    {
      question: "¿Qué era la Giralda al principio?",
      options: ["Un palacio", "Un minarete", "Un teatro"],
      answer: "Un minarete"
    },
    {
      question: "¿A qué edificio pertenece hoy?",
      options: ["A la Catedral de Sevilla", "Al Alcázar", "A un museo moderno"],
      answer: "A la Catedral de Sevilla"
    },
    {
      question: "¿Qué siglo aparece para la construcción original?",
      options: ["Siglo XII", "Siglo XVI", "Siglo XX"],
      answer: "Siglo XII"
    },
    {
      question: "¿Qué añadió Hernán Ruiz?",
      options: ["Una parte renacentista", "Una playa", "Una estación de tren"],
      answer: "Una parte renacentista"
    },
    {
      question: "¿Por qué es especial la Giralda?",
      options: ["Porque mezcla culturas y estilos", "Porque es de plástico", "Porque es subterránea"],
      answer: "Porque mezcla culturas y estilos"
    }
  ];

  const vocabQuiz = [
    { word: "el campanario", answer: "le clocher", options: ["le clocher", "la plage", "le cheval"] },
    { word: "el minarete", answer: "le minaret", options: ["le minaret", "le musée", "la boutique"] },
    { word: "se conservó", answer: "a été conservé(e)", options: ["a été conservé(e)", "a été oublié(e)", "a été vendu(e)"] },
    { word: "las rampas", answer: "les rampes", options: ["les rampes", "les fenêtres", "les cloches"] },
    { word: "atraer", answer: "attirer", options: ["attirer", "fermer", "tomber"] },
    { word: "el símbolo", answer: "le symbole", options: ["le symbole", "le billet", "le repas"] }
  ];

  const sentenceQuestions = [
    {
      sentence: "La Giralda está ____ la Catedral de Sevilla.",
      options: ["junto a", "debajo de", "lejos de"],
      answer: "junto a"
    },
    {
      sentence: "Al principio, la Giralda fue un ____.",
      options: ["minarete", "cine", "puerto"],
      answer: "minarete"
    },
    {
      sentence: "En el siglo XVI, se añadió una parte de estilo ____.",
      options: ["renacentista", "futurista", "romano"],
      answer: "renacentista"
    },
    {
      sentence: "La Giralda es un ____ de Sevilla.",
      options: ["símbolo", "problema", "restaurante"],
      answer: "símbolo"
    },
    {
      sentence: "Sus arcos y motivos geométricos muestran una arquitectura ____.",
      options: ["original", "aburrida", "invisible"],
      answer: "original"
    }
  ];

  const towerFacts = {
    base: "La base de la Giralda es almohade. Nos recuerda la antigua mezquita de Sevilla.",
    ramps: "Dentro de la torre hay rampas. Eran tan amplias que se podía subir a caballo.",
    bells: "Hoy la Giralda es un campanario: sus campanas forman parte de la Catedral.",
    giraldillo: "Arriba está el Giraldillo, una estatua que gira con el viento y da nombre a la torre."
  };

  const scoreState = {
    score: 0,
    max: quizQuestions.length + vocabQuiz.length + sentenceQuestions.length + 2,
    completed: new Set()
  };

  let voices = [];

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function updateScore() {
    qsa(".scoreValue").forEach(el => { el.textContent = String(scoreState.score); });
    qsa(".scoreMax").forEach(el => { el.textContent = String(scoreState.max); });
  }

  function addPoint(key) {
    if (!scoreState.completed.has(key)) {
      scoreState.completed.add(key);
      scoreState.score += 1;
      updateScore();
    }
  }

  function resetScore() {
    scoreState.score = 0;
    scoreState.completed.clear();
    updateScore();
  }

  function cleanText(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .replace(/XII/g, "siglo doce")
      .replace(/XVI/g, "siglo dieciséis")
      .trim();
  }

  function loadVoices() {
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }

  function getSpanishVoice() {
    if (!voices.length) loadVoices();
    const preferred = voices.find(v => /es[-_]ES/i.test(v.lang));
    const anySpanish = voices.find(v => /^es/i.test(v.lang));
    return preferred || anySpanish || null;
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) {
      alert("Tu navegador no permite la lectura en voz alta.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText(text));
    utterance.lang = "es-ES";
    utterance.rate = Number(qs("#rateControl")?.value || 0.9);
    utterance.pitch = 1;
    const voice = getSpanishVoice();
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  function initAudio() {
    if ("speechSynthesis" in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    document.addEventListener("click", (event) => {
      const speakTargetBtn = event.target.closest("[data-speak-target]");
      const speakTextBtn = event.target.closest("[data-speak-text]");

      if (speakTargetBtn) {
        const target = qs(`#${speakTargetBtn.dataset.speakTarget}`);
        if (target) speak(target.innerText);
      }

      if (speakTextBtn) {
        speak(speakTextBtn.dataset.speakText);
      }
    });

    qs("#stopAudioBtn")?.addEventListener("click", stopSpeaking);
  }

  function initScrollButtons() {
    qsa("[data-scroll-to]").forEach(button => {
      button.addEventListener("click", () => {
        const target = qs(button.dataset.scrollTo);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function initFacts() {
    const output = qs("#factOutput");
    qsa(".fact-tile").forEach(tile => {
      tile.addEventListener("click", () => {
        output.textContent = tile.dataset.fact;
        speak(tile.dataset.fact);
      });
    });
  }

  function renderFlashcards(cards = vocabCards) {
    const grid = qs("#flashcardGrid");
    if (!grid) return;
    grid.innerHTML = cards.map((card, index) => `
      <article class="flashcard" data-card-index="${index}">
        <div class="flashcard-inner">
          <div class="flash-front">
            <div>
              <div class="flash-icon">${card.icon}</div>
              <div class="flash-word">${card.word}</div>
              <p class="flash-hint">Toca para ver la definición.</p>
            </div>
            <button class="mini-speak" type="button" data-speak-text="${escapeHtml(card.word)}">🔊</button>
          </div>
          <div class="flash-back">
            <div>
              <p><strong>Definición:</strong> ${card.definition}</p>
              <p><strong>Traducción:</strong> ${card.translation}</p>
              <p><strong>Ejemplo:</strong> ${card.example}</p>
            </div>
            <button class="mini-speak" type="button" data-speak-text="${escapeHtml(card.word + ". " + card.example)}">🔊</button>
          </div>
        </div>
      </article>
    `).join("");

    qsa(".flashcard", grid).forEach(card => {
      card.addEventListener("click", (event) => {
        if (event.target.closest(".mini-speak")) return;
        card.classList.toggle("flipped");
      });
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function initFlashcardControls() {
    qs("#shuffleCardsBtn")?.addEventListener("click", () => {
      renderFlashcards(shuffleArray(vocabCards));
    });
    qs("#resetCardsBtn")?.addEventListener("click", () => {
      renderFlashcards(vocabCards);
    });
  }

  function initTowerParts() {
    const output = qs("#towerPartOutput");
    qsa(".hotspot").forEach(button => {
      button.addEventListener("click", () => {
        const text = towerFacts[button.dataset.part];
        output.textContent = text;
        speak(text);
      });
    });
  }

  function renderQuiz() {
    const area = qs("#quizArea");
    if (!area) return;
    area.innerHTML = quizQuestions.map((item, qIndex) => `
      <article class="quiz-card" data-question="${qIndex}">
        <strong>${qIndex + 1}. ${item.question}</strong>
        <div class="quiz-options">
          ${item.options.map(option => `
            <button type="button" data-answer="${escapeHtml(option)}">${option}</button>
          `).join("")}
        </div>
        <p class="feedback" aria-live="polite"></p>
      </article>
    `).join("");

    qsa(".quiz-card", area).forEach(card => {
      const qIndex = Number(card.dataset.question);
      const correctAnswer = quizQuestions[qIndex].answer;
      const feedback = qs(".feedback", card);
      qsa("button[data-answer]", card).forEach(optionButton => {
        optionButton.addEventListener("click", () => {
          const isCorrect = optionButton.dataset.answer === correctAnswer;
          qsa("button[data-answer]", card).forEach(btn => {
            btn.classList.remove("correct", "wrong");
          });
          optionButton.classList.add(isCorrect ? "correct" : "wrong");
          feedback.className = `feedback ${isCorrect ? "good" : "bad"}`;
          feedback.textContent = isCorrect ? "✅ ¡Correcto!" : `❌ Casi. Mira otra vez el texto.`;
          if (isCorrect) addPoint(`quiz-${qIndex}`);
        });
      });
    });
  }

  function renderVocabQuiz() {
    const area = qs("#vocabQuizArea");
    if (!area) return;
    area.innerHTML = vocabQuiz.map((item, index) => `
      <div class="vocab-line">
        <strong>${item.word}</strong>
        <select data-vocab-index="${index}" aria-label="Traducción de ${escapeHtml(item.word)}">
          <option value="">Elige...</option>
          ${item.options.map(option => `<option value="${escapeHtml(option)}">${option}</option>`).join("")}
        </select>
      </div>
    `).join("");

    qs("#checkVocabQuizBtn")?.addEventListener("click", () => {
      let correct = 0;
      qsa("#vocabQuizArea select").forEach(select => {
        const index = Number(select.dataset.vocabIndex);
        const ok = select.value === vocabQuiz[index].answer;
        select.style.borderColor = ok ? "#2f7358" : "#bf5b34";
        if (ok) {
          correct += 1;
          addPoint(`vocab-${index}`);
        }
      });
      const feedback = qs("#vocabQuizFeedback");
      feedback.textContent = `Resultado: ${correct} / ${vocabQuiz.length}. ${correct === vocabQuiz.length ? "¡Excelente!" : "Puedes corregir y volver a comprobar."}`;
    });
  }

  function renderSentenceQuestions() {
    const area = qs("#sentenceArea");
    if (!area) return;
    area.innerHTML = sentenceQuestions.map((item, index) => `
      <article class="sentence-card" data-sentence="${index}">
        <p><strong>${index + 1}.</strong> ${item.sentence.replace("____", "<span class='blank'>____</span>")}</p>
        <select aria-label="Completar frase ${index + 1}">
          <option value="">Elige...</option>
          ${item.options.map(option => `<option value="${escapeHtml(option)}">${option}</option>`).join("")}
        </select>
        <button class="btn small checkSentenceBtn" type="button">Comprobar</button>
        <span class="feedback" aria-live="polite"></span>
      </article>
    `).join("");

    qsa(".sentence-card", area).forEach(card => {
      const index = Number(card.dataset.sentence);
      const select = qs("select", card);
      const feedback = qs(".feedback", card);
      qs(".checkSentenceBtn", card).addEventListener("click", () => {
        const ok = select.value === sentenceQuestions[index].answer;
        feedback.className = `feedback ${ok ? "good" : "bad"}`;
        feedback.textContent = ok ? "✅ ¡Correcto!" : "❌ Prueba otra vez.";
        select.style.borderColor = ok ? "#2f7358" : "#bf5b34";
        if (ok) addPoint(`sentence-${index}`);
      });
    });
  }

  function initRomanPractice() {
    qsa(".checkSelectBtn").forEach((button, index) => {
      button.addEventListener("click", () => {
        const row = button.closest(".question-row");
        const select = qs("select", row);
        const feedback = qs(".feedback", row);
        const ok = select.value === select.dataset.answer;
        feedback.className = `feedback ${ok ? "good" : "bad"}`;
        feedback.textContent = ok ? "✅ Correcto" : "❌ Inténtalo otra vez";
        if (ok) addPoint(`roman-${index}`);
      });
    });
  }

  function initTabs() {
    qsa(".tab").forEach(tab => {
      tab.addEventListener("click", () => {
        qsa(".tab").forEach(btn => {
          btn.classList.remove("active");
          btn.setAttribute("aria-selected", "false");
        });
        qsa(".tab-panel").forEach(panel => panel.classList.remove("active"));

        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        qs(`#${tab.dataset.tab}`)?.classList.add("active");
      });
    });
  }

  function initBuilder() {
    qs("#generatePresentationBtn")?.addEventListener("click", () => {
      const lines = [
        qs("#builderIntro").value,
        qs("#builderHistory").value,
        qs("#builderDifference").value,
        qs("#builderOpinion").value
      ];
      qs("#presentationOutput").textContent = lines.join("\n");
    });
  }

  function initReset() {
    qs("#resetAllBtn")?.addEventListener("click", () => {
      resetScore();

      qsa(".feedback").forEach(item => {
        item.textContent = "";
        item.className = "feedback";
      });
      qsa("select").forEach(select => {
        select.selectedIndex = 0;
        select.style.borderColor = "rgba(15,111,133,.28)";
      });
      qsa(".quiz-options button").forEach(btn => {
        btn.classList.remove("correct", "wrong");
      });
      qs("#vocabQuizFeedback").textContent = "";
      qs("#presentationOutput").textContent = "Tu presentación aparecerá aquí.";
      stopSpeaking();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateScore();
    initAudio();
    initScrollButtons();
    initFacts();
    renderFlashcards();
    initFlashcardControls();
    initTowerParts();
    renderQuiz();
    renderVocabQuiz();
    renderSentenceQuestions();
    initRomanPractice();
    initTabs();
    initBuilder();
    initReset();
  });
})();
