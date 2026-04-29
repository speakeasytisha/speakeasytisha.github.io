(() => {
  "use strict";

  const vocabCards = [
    {
      icon: "🕌",
      word: "fue",
      definition: "Forma del pretérito indefinido del verbo ser o ir.",
      translation: "fut / a été",
      example: "Al principio, la Giralda fue un minarete."
    },
    {
      icon: "🏗️",
      word: "se construyó",
      definition: "Fue creada o edificada en un momento del pasado.",
      translation: "fut construite / a été construite",
      example: "La torre se construyó a finales del siglo XII."
    },
    {
      icon: "🔊",
      word: "sirvió",
      definition: "Tuvo una función o utilidad en el pasado.",
      translation: "servit / a servi",
      example: "La torre sirvió para llamar a los fieles a la oración."
    },
    {
      icon: "🛡️",
      word: "se conservó",
      definition: "No fue destruida; se mantuvo en buen estado.",
      translation: "fut conservée / a été conservée",
      example: "Después de la conquista, la torre se conservó."
    },
    {
      icon: "🎨",
      word: "añadió",
      definition: "Puso una cosa nueva sobre algo que ya existía.",
      translation: "ajouta / a ajouté",
      example: "Hernán Ruiz añadió la parte superior renacentista."
    },
    {
      icon: "🔔",
      word: "se convirtió en",
      definition: "Cambió y llegó a ser otra cosa.",
      translation: "devint / est devenue",
      example: "La antigua torre islámica se convirtió en campanario."
    },
    {
      icon: "📍",
      word: "se levantó",
      definition: "Se construyó o se elevó en un lugar.",
      translation: "fut élevée / a été élevée",
      example: "La Giralda se levantó en Sevilla."
    },
    {
      icon: "👀",
      word: "atrajo",
      definition: "Hizo que la gente quisiera venir o mirar.",
      translation: "attira / a attiré",
      example: "La Giralda atrajo a muchos visitantes."
    },
    {
      icon: "🤝",
      word: "unió",
      definition: "Juntó varias cosas diferentes.",
      translation: "unit / a uni",
      example: "La Giralda unió varias culturas."
    },
    {
      icon: "⭐",
      word: "llegó a ser",
      definition: "Con el tiempo, se transformó en algo importante.",
      translation: "devint / a fini par devenir",
      example: "La Giralda llegó a ser un símbolo de Sevilla."
    },
    {
      icon: "⛪",
      word: "el campanario",
      definition: "La torre donde están las campanas.",
      translation: "le clocher",
      example: "La Giralda se convirtió en el campanario de la Catedral."
    },
    {
      icon: "🕌",
      word: "el minarete",
      definition: "Torre de una mezquita desde donde se llamaba a la oración.",
      translation: "le minaret",
      example: "La Giralda fue el minarete de una gran mezquita."
    },
    {
      icon: "🕌",
      word: "la mezquita",
      definition: "Edificio religioso musulmán.",
      translation: "la mosquée",
      example: "La torre formó parte de una mezquita."
    },
    {
      icon: "🏛️",
      word: "almohade",
      definition: "Relacionado con una dinastía musulmana del norte de África y al-Ándalus.",
      translation: "almohade",
      example: "La torre se construyó durante la época almohade."
    },
    {
      icon: "🎨",
      word: "renacentista",
      definition: "Relacionado con el arte del Renacimiento.",
      translation: "Renaissance",
      example: "En el siglo XVI, se añadió una parte renacentista."
    },
    {
      icon: "↗️",
      word: "las rampas",
      definition: "Caminos inclinados para subir poco a poco.",
      translation: "les rampes",
      example: "Sus rampas interiores hicieron la torre diferente."
    },
    {
      icon: "🔷",
      word: "motivos geométricos",
      definition: "Decoraciones con formas como líneas, rombos o círculos.",
      translation: "motifs géométriques",
      example: "Sus motivos geométricos decoraron la torre."
    },
    {
      icon: "🕰️",
      word: "siglo XII",
      definition: "El siglo doce; en historia se escribe con números romanos.",
      translation: "le XIIe siècle",
      example: "La Giralda se construyó a finales del siglo XII."
    },
    {
      icon: "🕰️",
      word: "siglo XVI",
      definition: "El siglo dieciséis; en historia se escribe con números romanos.",
      translation: "le XVIe siècle",
      example: "En el siglo XVI, Hernán Ruiz añadió la parte superior."
    }
  ];

  const quizQuestions = [
    {
      question: "¿Dónde se levantó la Giralda?",
      options: ["En Sevilla", "En Madrid", "En Barcelona"],
      answer: "En Sevilla"
    },
    {
      question: "¿Qué fue la Giralda al principio?",
      options: ["Un minarete", "Un palacio", "Un teatro"],
      answer: "Un minarete"
    },
    {
      question: "¿En qué siglo se construyó la parte principal?",
      options: ["Siglo XII", "Siglo XVI", "Siglo XX"],
      answer: "Siglo XII"
    },
    {
      question: "¿Qué pasó en 1248?",
      options: ["Los cristianos conquistaron Sevilla", "La torre desapareció", "Se abrió un aeropuerto"],
      answer: "Los cristianos conquistaron Sevilla"
    },
    {
      question: "¿Quién añadió la parte superior renacentista?",
      options: ["Hernán Ruiz", "Pablo Picasso", "Miguel de Cervantes"],
      answer: "Hernán Ruiz"
    },
    {
      question: "¿Por qué llegó a ser especial la Giralda?",
      options: ["Porque unió culturas y estilos", "Porque fue de plástico", "Porque fue subterránea"],
      answer: "Porque unió culturas y estilos"
    }
  ];

  const preteriteQuestions = [
    {
      sentence: "Al principio, la Giralda ____ un minarete.",
      options: ["fue", "es", "será"],
      answer: "fue"
    },
    {
      sentence: "La torre ____ a finales del siglo XII.",
      options: ["se construyó", "se construye", "se construirá"],
      answer: "se construyó"
    },
    {
      sentence: "La torre ____ para llamar a la oración.",
      options: ["sirvió", "sirve", "servirá"],
      answer: "sirvió"
    },
    {
      sentence: "Después de la conquista, la torre ____.",
      options: ["se conservó", "se conserva", "se conservará"],
      answer: "se conservó"
    },
    {
      sentence: "Hernán Ruiz ____ una parte renacentista.",
      options: ["añadió", "añade", "añadirá"],
      answer: "añadió"
    },
    {
      sentence: "La torre ____ en campanario cristiano.",
      options: ["se convirtió", "se convierte", "se convertirá"],
      answer: "se convirtió"
    }
  ];

  const vocabQuiz = [
    { word: "fue", answer: "fut / a été", options: ["fut / a été", "sera", "est maintenant"] },
    { word: "se construyó", answer: "fut construite", options: ["fut construite", "fut vendue", "fut fermée"] },
    { word: "sirvió", answer: "servit / a servi", options: ["servit / a servi", "acheta", "regarda"] },
    { word: "se conservó", answer: "fut conservée", options: ["fut conservée", "fut perdue", "fut cassée"] },
    { word: "añadió", answer: "ajouta / a ajouté", options: ["ajouta / a ajouté", "enleva", "oublia"] },
    { word: "se convirtió en", answer: "devint / est devenue", options: ["devint / est devenue", "resta exactement", "tomba"] }
  ];

  const sentenceQuestions = [
    {
      sentence: "La Giralda se levantó en ____.",
      options: ["Sevilla", "Valencia", "Bilbao"],
      answer: "Sevilla"
    },
    {
      sentence: "Al principio, la Giralda fue un ____.",
      options: ["minarete", "cine", "puerto"],
      answer: "minarete"
    },
    {
      sentence: "En el siglo XVI, se añadió una parte de estilo ____.",
      options: ["renacentista", "futurista", "industrial"],
      answer: "renacentista"
    },
    {
      sentence: "La Giralda unió el arte islámico y la historia ____.",
      options: ["cristiana", "japonesa", "vikinga"],
      answer: "cristiana"
    },
    {
      sentence: "La Giralda llegó a ser un ____ de Sevilla.",
      options: ["símbolo", "problema", "restaurante"],
      answer: "símbolo"
    }
  ];

  const towerFacts = {
    base: "La base fue almohade y recordó la antigua mezquita de Sevilla.",
    ramps: "Dentro de la torre hubo rampas amplias. Permitieron subir de manera progresiva.",
    bells: "Más tarde, la torre se convirtió en un campanario de la Catedral.",
    giraldillo: "Arriba se colocó el Giraldillo, una estatua que dio nombre a la torre."
  };

  const scoreState = {
    score: 0,
    max: quizQuestions.length + preteriteQuestions.length + vocabQuiz.length + sentenceQuestions.length + 2,
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
      .replace(/1248/g, "mil doscientos cuarenta y ocho")
      .trim();
  }

  function loadVoices() {
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }

  function getSpanishVoice() {
    if (!voices.length) loadVoices();
    const preferredNames = /(Mónica|Monica|Jorge|Lucía|Lucia|Marisol|Diego|Spanish|España|Español)/i;
    const esSpainByName = voices.find(v => /es[-_]ES/i.test(v.lang) && preferredNames.test(v.name));
    const esSpain = voices.find(v => /es[-_]ES/i.test(v.lang));
    const anySpanish = voices.find(v => /^es/i.test(v.lang));
    return esSpainByName || esSpain || anySpanish || null;
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

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
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
          ${item.options.map(option => `<button type="button" data-answer="${escapeHtml(option)}">${option}</button>`).join("")}
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
          qsa("button[data-answer]", card).forEach(btn => btn.classList.remove("correct", "wrong"));
          optionButton.classList.add(isCorrect ? "correct" : "wrong");
          feedback.className = `feedback ${isCorrect ? "good" : "bad"}`;
          feedback.textContent = isCorrect ? "✅ ¡Correcto!" : "❌ Casi. Mira otra vez el texto.";
          if (isCorrect) addPoint(`quiz-${qIndex}`);
        });
      });
    });
  }

  function renderSelectExercise(areaId, questions, keyPrefix) {
    const area = qs(areaId);
    if (!area) return;
    area.innerHTML = questions.map((item, index) => `
      <article class="sentence-card" data-index="${index}">
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
      const index = Number(card.dataset.index);
      const select = qs("select", card);
      const feedback = qs(".feedback", card);
      qs(".checkSentenceBtn", card).addEventListener("click", () => {
        const ok = select.value === questions[index].answer;
        feedback.className = `feedback ${ok ? "good" : "bad"}`;
        feedback.textContent = ok ? "✅ ¡Correcto!" : "❌ Prueba otra vez.";
        select.style.borderColor = ok ? "#2f7358" : "#bf5b34";
        if (ok) addPoint(`${keyPrefix}-${index}`);
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

  function initRomanPractice() {
    qsa(".checkSelectBtn").forEach((button, index) => {
      button.addEventListener("click", () => {
        const row = button.closest(".question-row");
        const select = qs("select", row);
        const feedback = qs(".feedback", row);
        const ok = select.value === select.dataset.answer;
        feedback.className = `feedback ${ok ? "good" : "bad"}`;
        feedback.textContent = ok ? "✅ Correcto" : "❌ Inténtalo otra vez";
        select.style.borderColor = ok ? "#2f7358" : "#bf5b34";
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
        qs("#builderChange").value,
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
      qsa(".quiz-options button").forEach(btn => btn.classList.remove("correct", "wrong"));
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
    renderSelectExercise("#preteriteArea", preteriteQuestions, "preterite");
    renderVocabQuiz();
    renderSelectExercise("#sentenceArea", sentenceQuestions, "sentence");
    initRomanPractice();
    initTabs();
    initBuilder();
    initReset();
  });
})();
