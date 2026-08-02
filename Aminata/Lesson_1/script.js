"use strict";

const STORAGE_KEY = "aminata-lesson-1-v1";
const state = {
  score: {},
  completed: {},
  startedAt: Date.now(),
  recordings: {},
  activeTimers: {},
  saved: {}
};

const vocabData = {
  experience: [
    { en: "to welcome and assist passengers", fr: "accueillir et accompagner les passagers", def: "To receive passengers and provide the help they need.", ex: "I welcome and assist passengers throughout the flight." },
    { en: "to apply safety procedures", fr: "appliquer les procédures de sécurité", def: "To follow and implement required safety rules.", ex: "I apply safety procedures carefully and consistently." },
    { en: "to coordinate with the ground team", fr: "coordonner avec l’équipe au sol", def: "To exchange information and organize actions with airport colleagues.", ex: "I coordinate with the ground team before boarding." },
    { en: "to handle unexpected situations", fr: "gérer les situations imprévues", def: "To react appropriately when something unplanned happens.", ex: "I remain calm when I handle unexpected situations." },
    { en: "to ensure passenger comfort", fr: "veiller au confort des passagers", def: "To make sure passengers feel comfortable and cared for.", ex: "I ensure passenger comfort without compromising safety." },
    { en: "to work in a multicultural team", fr: "travailler dans une équipe multiculturelle", def: "To cooperate with colleagues from different backgrounds.", ex: "I enjoy working in a multicultural team." }
  ],
  service: [
    { en: "attentive service", fr: "un service attentionné", def: "Service that notices and responds to individual needs.", ex: "Business Class passengers expect attentive service." },
    { en: "to anticipate a passenger’s needs", fr: "anticiper les besoins d’un passager", def: "To notice a likely need before the passenger asks.", ex: "I try to anticipate each passenger’s needs." },
    { en: "to recommend a suitable option", fr: "recommander une option adaptée", def: "To advise a choice based on preferences or restrictions.", ex: "I can recommend a suitable meal or beverage." },
    { en: "dietary requirements", fr: "besoins ou restrictions alimentaires", def: "Food needs linked to health, religion or preference.", ex: "I always confirm dietary requirements before serving." },
    { en: "a refined presentation", fr: "une présentation soignée", def: "An elegant and carefully arranged appearance.", ex: "Premium service requires a refined presentation." },
    { en: "discreet and personalized care", fr: "une attention discrète et personnalisée", def: "Individual assistance provided without being intrusive.", ex: "Private aviation demands discreet and personalized care." }
  ],
  safety: [
    { en: "to remain composed", fr: "rester maître de soi", def: "To stay calm and controlled under pressure.", ex: "I remain composed during turbulence or medical incidents." },
    { en: "to reassure a passenger", fr: "rassurer un passager", def: "To help someone feel calmer and safer.", ex: "I explain the situation clearly to reassure the passenger." },
    { en: "to assess the situation", fr: "évaluer la situation", def: "To examine facts before deciding what to do.", ex: "First, I assess the situation and identify the priority." },
    { en: "to follow the chain of command", fr: "respecter la chaîne de commandement", def: "To communicate and act according to the operational hierarchy.", ex: "In an emergency, I follow the chain of command." },
    { en: "to give clear instructions", fr: "donner des consignes claires", def: "To explain what must be done in simple, direct language.", ex: "Cabin crew must give clear instructions." },
    { en: "to de-escalate a conflict", fr: "désamorcer un conflit", def: "To reduce tension and prevent a disagreement from worsening.", ex: "I use a calm tone to de-escalate a conflict." }
  ],
  strengths: [
    { en: "service-oriented", fr: "orienté(e) service", def: "Focused on providing a high-quality customer experience.", ex: "I am naturally service-oriented." },
    { en: "adaptable", fr: "adaptable", def: "Able to adjust quickly to a new situation.", ex: "I am adaptable when schedules or passenger needs change." },
    { en: "reliable", fr: "fiable", def: "Consistently responsible and dependable.", ex: "My colleagues know that I am reliable." },
    { en: "detail-conscious", fr: "attentif/attentive aux détails", def: "Careful about small but important details.", ex: "Premium service requires a detail-conscious approach." },
    { en: "reassuring", fr: "rassurant(e)", def: "Able to make people feel calm and confident.", ex: "My communication style is calm and reassuring." },
    { en: "resilient", fr: "résilient(e)", def: "Able to recover and continue performing under pressure.", ex: "A flight attendant needs to be resilient." }
  ],
  connectors: [
    { en: "Throughout my career…", fr: "Tout au long de ma carrière…", def: "Introduces experience developed over time.", ex: "Throughout my career, I have worked with international passengers." },
    { en: "In addition to…", fr: "En plus de…", def: "Adds another relevant point.", ex: "In addition to cabin service, I have airport experience." },
    { en: "One example of this is…", fr: "Un exemple de cela est…", def: "Introduces evidence for a statement.", ex: "One example of this is my work in Business Class." },
    { en: "As a result…", fr: "Par conséquent…", def: "Introduces a consequence.", ex: "As a result, I can adapt quickly to different passenger profiles." },
    { en: "What I particularly value is…", fr: "Ce que j’apprécie particulièrement, c’est…", def: "Highlights a personal professional value.", ex: "What I particularly value is creating a reassuring experience." },
    { en: "This experience has taught me to…", fr: "Cette expérience m’a appris à…", def: "Connects past experience to a current skill.", ex: "This experience has taught me to remain calm under pressure." }
  ]
};

const vocabQuizData = [
  { q: "Which expression best replaces ‘help passengers’ in a professional profile?", options: ["to look at passengers", "to welcome and assist passengers", "to make passengers"], answer: "to welcome and assist passengers" },
  { q: "Which quality means you can adjust quickly when plans change?", options: ["adaptable", "decorative", "regular"], answer: "adaptable" },
  { q: "Which expression is best for calming a worried traveler?", options: ["to command a traveler", "to de-escalate the menu", "to reassure a passenger"], answer: "to reassure a passenger" },
  { q: "Which phrase introduces evidence?", options: ["One example of this is…", "At the same yesterday…", "Because after that…"], answer: "One example of this is…" },
  { q: "Which expression is suitable for Business Class or private aviation?", options: ["quick food work", "discreet and personalized care", "normal client thing"], answer: "discreet and personalized care" },
  { q: "Which verb means reducing tension in a disagreement?", options: ["to de-escalate a conflict", "to elevate a passenger", "to remove a service"], answer: "to de-escalate a conflict" }
];

const tenseQuizData = [
  { q: "I usually ___ passengers in both French and English.", options: ["am welcoming", "welcome", "welcomes"], answer: "welcome", why: "A regular professional responsibility uses the present simple." },
  { q: "At the moment, I ___ for the LILATE.", options: ["prepare", "am preparing", "prepares"], answer: "am preparing", why: "A current temporary project uses the present continuous." },
  { q: "Safety always ___ my first priority.", options: ["is being", "are", "is"], answer: "is", why: "A general principle or state uses the present simple." },
  { q: "My English ___ because I practice every day.", options: ["is improving", "improves now", "improve"], answer: "is improving", why: "A change in progress uses the present continuous." },
  { q: "I ___ how important clear communication is.", options: ["am understanding", "understand", "understands"], answer: "understand", why: "Understand is usually a state verb, so use the present simple." },
  { q: "This week, I ___ my professional introduction.", options: ["am refining", "refine always", "refines"], answer: "am refining", why: "This week describes a temporary current activity." },
  { q: "A cabin-crew member ___ calm in an emergency.", options: ["stay", "is staying always", "stays"], answer: "stays", why: "This is a general professional expectation; third person singular takes -s." },
  { q: "I ___ a cabin-crew position because I want to return to flying.", options: ["am currently applying for", "currently apply now for", "applies for"], answer: "am currently applying for", why: "A current application process uses the present continuous." },
  { q: "I ___ working with international passengers.", options: ["am preferring", "prefer", "prefers"], answer: "prefer", why: "Prefer is usually a state verb." },
  { q: "Today, the purser ___ the new service procedure.", options: ["explains every day", "is explaining", "explain"], answer: "is explaining", why: "The action is happening today in a specific temporary situation." },
  { q: "I often ___ dietary requirements before serving a meal.", options: ["confirm", "am confirming often", "confirms"], answer: "confirm", why: "Often signals a repeated action, but meaning is more important than the keyword." },
  { q: "Right now, I ___ more confident about speaking English.", options: ["feel", "am feeling", "feels"], answer: "am feeling", why: "Feel can be continuous when describing a temporary current condition." }
];

const wordOrderSentences = [
  ["I", "have", "extensive", "experience", "in", "premium", "cabin", "service."],
  ["I", "am", "currently", "preparing", "for", "the", "LILATE."],
  ["Safety", "and", "passenger", "care", "are", "my", "main", "priorities."],
  ["This", "experience", "has", "taught", "me", "to", "remain", "calm", "under", "pressure."]
];

const listeningData = [
  {
    id: "listen1",
    tag: "Cabin briefing",
    title: "A special-meal update",
    text: "Good morning, team. We have one last-minute passenger update in Business Class. Seat four A has a severe nut allergy, so please do not serve the standard dessert. The alternative fruit plate is in the forward galley and must remain covered until service. Please confirm the passenger's identity before presenting the meal.",
    questions: [
      { q: "Where is the passenger seated?", options: ["14A", "4A", "4C"], answer: "4A" },
      { q: "What must not be served?", options: ["The standard dessert", "The fruit plate", "The main course"], answer: "The standard dessert" },
      { q: "What should the crew confirm?", options: ["The flight time", "The menu price", "The passenger's identity"], answer: "The passenger's identity" }
    ]
  },
  {
    id: "listen2",
    tag: "Passenger interaction",
    title: "A worried passenger",
    text: "Excuse me, I have a connecting flight to Montreal and we are already twenty minutes late. The connection is scheduled to depart at six forty-five from gate K thirty-two. Could you please check whether I will have enough time and tell me what I should do when we land?",
    questions: [
      { q: "Where is the passenger traveling next?", options: ["Miami", "Montreal", "Milan"], answer: "Montreal" },
      { q: "What is the departure time?", options: ["6:15", "6:45", "7:45"], answer: "6:45" },
      { q: "What does the passenger need?", options: ["A meal recommendation", "Help with the connection", "A seat change"], answer: "Help with the connection" }
    ]
  },
  {
    id: "listen3",
    tag: "Recruitment",
    title: "Experience under pressure",
    text: "Could you tell me about a situation in which you had to remain calm under pressure? Please explain what happened, what action you took, how you communicated with the passenger or the team, and what the final result was.",
    questions: [
      { q: "What type of example is requested?", options: ["A holiday story", "A stressful professional situation", "A menu description"], answer: "A stressful professional situation" },
      { q: "How many main elements should the answer include?", options: ["Situation, action, communication and result", "Only the final result", "Name, age and address"], answer: "Situation, action, communication and result" },
      { q: "What should the candidate demonstrate?", options: ["Calm professional behavior", "Fast reading", "Perfect spelling"], answer: "Calm professional behavior" }
    ]
  }
];

const speakingData = [
  {
    id: "speak1", tag: "Introduction", title: "Your professional journey", time: 75,
    prompt: "Introduce yourself and summarize your aviation experience. Explain what you are doing now and what position you are aiming for.",
    support: ["role + experience", "2 key responsibilities", "current preparation", "professional objective"],
    model: "I am an experienced flight attendant with more than ten years in aviation. I have worked in Economy and Business Class, airport services and corporate aviation. My main responsibilities have included passenger care, safety procedures and premium service. I am currently preparing for the LILATE and strengthening my English because my goal is to join Air France as cabin crew."
  },
  {
    id: "speak2", tag: "Passenger care", title: "Reassure and propose a solution", time: 60,
    prompt: "A Business Class passenger is disappointed because their preferred meal is no longer available. Respond professionally, show empathy and offer two alternatives.",
    support: ["acknowledge", "apologize", "offer alternatives", "confirm satisfaction"],
    model: "I am very sorry that your preferred meal is no longer available. I completely understand your disappointment. I can offer you the grilled fish, which is served with seasonal vegetables, or a vegetarian option with truffle risotto. I would also be pleased to recommend a suitable wine. Would either of those options appeal to you?"
  },
  {
    id: "speak3", tag: "Recruitment", title: "Give evidence of a strength", time: 75,
    prompt: "Choose one strength — calm, adaptability, attention to detail or teamwork — and support it with a real professional example.",
    support: ["state the strength", "describe the situation", "explain your action", "give the result"],
    model: "One of my main strengths is my ability to remain calm under pressure. During a flight, a passenger became unwell shortly before landing. I reassured the passenger, informed the purser and followed the required procedure while continuing to communicate clearly with the family. The situation remained controlled, and the medical team was ready when we arrived."
  }
];

function qs(selector, scope = document) { return scope.querySelector(selector); }
function qsa(selector, scope = document) { return [...scope.querySelectorAll(selector)]; }
function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function shuffleDifferent(items) {
  const original = [...items];
  let arr = shuffle(original);
  if (arr.length > 1 && arr.every((item, index) => item === original[index])) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}
function optionsWithVariedAnswer(item, index) {
  const wrong = shuffle(item.options.filter(option => option !== item.answer));
  const positions = [1, 2, 0, 2, 1, 0];
  const target = Math.min(positions[index % positions.length], wrong.length);
  wrong.splice(target, 0, item.answer);
  return wrong;
}
function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
function storageGet(key) { try { return window.localStorage.getItem(key); } catch { return null; } }
function storageSet(key, value) { try { window.localStorage.setItem(key, value); return true; } catch { return false; } }
function storageRemove(key) { try { window.localStorage.removeItem(key); return true; } catch { return false; } }
function showToast(message) {
  const toast = qs("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function downloadBlob(content, filename, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function speak(text) {
  if (!("speechSynthesis" in window)) return showToast("Text-to-speech is not supported in this browser.");
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = qs("#accentSelect").value;
  utterance.rate = .9;
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang === utterance.lang) || voices.find(v => v.lang.startsWith(utterance.lang.slice(0,2)));
  if (preferred) utterance.voice = preferred;
  speechSynthesis.speak(utterance);
}
function setScore(key, earned, total) {
  state.score[key] = { earned, total };
  saveState();
  updateDashboard();
}
function markCompleted(key, value = true) {
  state.completed[key] = value;
  saveState();
  updateDashboard();
}
function getTotals() {
  return Object.values(state.score).reduce((acc, item) => ({ earned: acc.earned + (item.earned || 0), total: acc.total + (item.total || 0) }), { earned: 0, total: 0 });
}
function updateDashboard() {
  const totalSections = qsa(".lesson-section[data-progress-key]").length;
  const sectionKeys = qsa(".lesson-section[data-progress-key]").map(el => el.dataset.progressKey);
  const completed = sectionKeys.filter(key => state.completed[key]).length;
  const percent = Math.round((completed / totalSections) * 100) || 0;
  const totals = getTotals();
  qs("#globalProgressText").textContent = `${percent}%`;
  qs("#globalProgressBar").style.width = `${percent}%`;
  qs("#scoreValue").textContent = totals.earned;
  qs("#scoreTotal").textContent = totals.total;
  qs("#reportScore").textContent = `${totals.earned} / ${totals.total}`;
  qs("#reportCompletion").textContent = `${percent}%`;
  qsa(".side-nav a[data-section]").forEach(link => link.classList.toggle("done", !!state.completed[link.dataset.section]));
  updateAutoCriteria();
  if (percent === 100 && !state.saved.celebrated) {
    state.saved.celebrated = true;
    launchConfetti();
  }
}
function saveState() {
  const formValues = {};
  qsa("input, textarea, select").forEach(el => {
    if (!el.id && !el.name && !el.dataset.plan && !el.dataset.rubric) return;
    const key = el.id || el.name || el.dataset.plan || el.dataset.rubric;
    if (el.type === "checkbox" || el.type === "radio") formValues[key] = el.checked;
    else if (el.type !== "file") formValues[key] = el.value;
  });
  state.saved.formValues = formValues;
  state.saved.showFr = document.body.classList.contains("show-fr");
  state.saved.focusMode = document.body.classList.contains("focus-mode");
  storageSet(STORAGE_KEY, JSON.stringify({ ...state, recordings: {} }));
}
function loadState() {
  const raw = storageGet(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed, { recordings: {}, activeTimers: {} });
    const values = state.saved?.formValues || {};
    qsa("input, textarea, select").forEach(el => {
      const key = el.id || el.name || el.dataset.plan || el.dataset.rubric;
      if (!(key in values)) return;
      if (el.type === "checkbox" || el.type === "radio") el.checked = !!values[key];
      else if (el.type !== "file") el.value = values[key];
    });
    document.body.classList.toggle("show-fr", !!state.saved?.showFr);
    document.body.classList.toggle("focus-mode", !!state.saved?.focusMode);
    qs("#translationToggle").setAttribute("aria-pressed", String(!!state.saved?.showFr));
    qs("#focusToggle").setAttribute("aria-pressed", String(!!state.saved?.focusMode));
  } catch (error) {
    console.warn("Could not load saved lesson state", error);
  }
}
function launchConfetti() {
  const layer = qs("#confettiLayer");
  const colors = ["#071b3a", "#1254a1", "#d7193f", "#ffffff"];
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * .7}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 3500);
  }
}

function renderVocab(category = "experience") {
  const grid = qs("#vocabGrid");
  grid.innerHTML = vocabData[category].map((item, index) => `
    <article class="vocab-card">
      <button class="speak-button" type="button" data-vocab-speak="${index}" aria-label="Listen to ${escapeHtml(item.en)}">▶</button>
      <h3>${escapeHtml(item.en)}</h3>
      <p class="translation">${escapeHtml(item.fr)}</p>
      <p class="definition">${escapeHtml(item.def)}</p>
      <p class="example">${escapeHtml(item.ex)}</p>
    </article>`).join("");
  qsa("[data-vocab-speak]", grid).forEach(btn => btn.addEventListener("click", () => speak(vocabData[category][Number(btn.dataset.vocabSpeak)].ex)));
}
function renderChoiceQuiz(container, data, prefix) {
  container.innerHTML = data.map((item, index) => {
    const options = optionsWithVariedAnswer(item, index);
    return `<div class="quiz-item" data-index="${index}"><p>${index + 1}. ${escapeHtml(item.q)}</p><div class="quiz-options">${options.map((option, optionIndex) => `<label><input type="radio" name="${prefix}-${index}" value="${escapeHtml(option)}" /> <span>${escapeHtml(option)}</span></label>`).join("")}</div><small class="item-explanation"></small></div>`;
  }).join("");
  const resultEl = qs(`#${container.id}Result`);
  container.addEventListener("change", () => checkChoiceQuiz(container, data, prefix, resultEl));
}
function checkChoiceQuiz(container, data, scoreKey, resultEl) {
  let earned = 0;
  let answered = 0;
  qsa(".quiz-item", container).forEach((itemEl, index) => {
    const selected = qs("input:checked", itemEl);
    qsa("label", itemEl).forEach(label => label.classList.remove("correct-answer", "wrong-answer"));
    if (!selected) return;
    answered++;
    const correctInput = qsa("input", itemEl).find(input => input.value === data[index].answer);
    if (correctInput) correctInput.closest("label").classList.add("correct-answer");
    if (selected.value === data[index].answer) earned++;
    else selected.closest("label").classList.add("wrong-answer");
    const explanation = qs(".item-explanation", itemEl);
    if (explanation && data[index].why) explanation.textContent = data[index].why;
  });
  setScore(scoreKey, earned, data.length);
  resultEl.textContent = answered ? `${earned}/${answered} correct so far` : "";
  resultEl.style.color = answered && earned / answered >= .75 ? "var(--success)" : "var(--warning)";
  if (answered === data.length && earned / data.length >= .75) markCompleted(scoreKey === "tense" ? "grammar" : "vocabulary");
  if (answered === data.length && earned === data.length) launchConfetti();
}

function renderWordOrder() {
  const area = qs("#wordOrderArea");
  area.innerHTML = "";
  wordOrderSentences.forEach((tokens, index) => {
    const card = document.createElement("div");
    card.className = "word-order-card";
    card.dataset.index = index;
    card.innerHTML = `<p><strong>Sentence ${index + 1}</strong></p><div class="word-bank"></div><div class="sentence-build" aria-label="Built sentence"></div><p class="word-order-feedback"></p>`;
    const bank = qs(".word-bank", card);
    const build = qs(".sentence-build", card);
    shuffleDifferent(tokens.map((token, tokenIndex) => ({ token, tokenIndex }))).forEach(obj => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "word-token";
      btn.textContent = obj.token;
      btn.dataset.originalIndex = obj.tokenIndex;
      btn.addEventListener("click", () => {
        if (btn.parentElement === bank) { build.appendChild(btn); btn.classList.add("placed"); }
        else { bank.appendChild(btn); btn.classList.remove("placed"); }
        evaluateWordOrderCard(card, tokens);
      });
      bank.appendChild(btn);
    });
    area.appendChild(card);
  });
}
function evaluateWordOrderCard(card, correctTokens) {
  const built = qsa(".sentence-build .word-token", card).map(btn => btn.textContent);
  const feedback = qs(".word-order-feedback", card);
  if (built.length < correctTokens.length) { feedback.textContent = `${built.length}/${correctTokens.length} words placed`; feedback.style.color = "var(--muted)"; return; }
  const correct = built.join(" ") === correctTokens.join(" ");
  feedback.textContent = correct ? "Correct — excellent word order." : "Not quite. Click words to move them back and try again.";
  feedback.style.color = correct ? "var(--success)" : "var(--danger)";
  card.dataset.correct = String(correct);
  const earned = qsa(".word-order-card", qs("#wordOrderArea")).filter(el => el.dataset.correct === "true").length * 2;
  setScore("wordOrder", earned, wordOrderSentences.length * 2);
  if (earned === wordOrderSentences.length * 2) markCompleted("grammar");
}

function updateProfile() {
  const years = qs("#yearsExperience").value;
  const area = qs("#strongestArea").value;
  const quality = qs("#keyQuality").value;
  const project = qs("#currentProject").value;
  const goal = qs("#professionalGoal").value;
  const text = `I am an experienced flight attendant with ${years} in aviation. My background includes Economy and Business Class operations, airport services and corporate aviation. I have developed strong expertise in ${area}, and I am known for being ${quality}. I am currently ${project}. My goal is to ${goal}.`;
  qs("#generatedProfile").textContent = text;
  state.saved.profile = text;
  saveState();
}

function renderListening() {
  const root = qs("#listeningActivities");
  root.innerHTML = listeningData.map(item => `
    <article class="listening-card" data-listening-id="${item.id}">
      <div class="listening-card-head"><div><span class="scenario-tag">${escapeHtml(item.tag)}</span><h3>${escapeHtml(item.title)}</h3></div><span class="points">3 points</span></div>
      <div class="audio-controls">
        <button class="button secondary small audio-play" type="button" data-play="${item.id}">▶ Listen</button>
        <button class="button ghost small" type="button" data-slow="${item.id}">0.8× practice</button>
        <button class="button ghost small" type="button" data-transcript="${item.id}">Show transcript</button>
      </div>
      <label><strong>Your notes</strong><textarea class="listening-note" data-listening-note="${item.id}" placeholder="Write keywords only…"></textarea></label>
      <div class="transcript" id="transcript-${item.id}">${escapeHtml(item.text)}</div>
      <div class="listening-questions">${item.questions.map((question, qIndex) => `<div class="listening-question" data-q-index="${qIndex}"><p>${qIndex + 1}. ${escapeHtml(question.q)}</p><div class="quiz-options">${optionsWithVariedAnswer(question, qIndex).map(option => `<label><input type="radio" name="${item.id}-q${qIndex}" value="${escapeHtml(option)}" /> <span>${escapeHtml(option)}</span></label>`).join("")}</div></div>`).join("")}</div>
      <div class="panel-actions"><button class="button primary small" type="button" data-check-listening="${item.id}">Check</button><span class="result-badge"></span></div>
    </article>`).join("");

  qsa("[data-play]", root).forEach(btn => btn.addEventListener("click", () => speak(listeningData.find(x => x.id === btn.dataset.play).text)));
  qsa("[data-slow]", root).forEach(btn => btn.addEventListener("click", () => {
    const item = listeningData.find(x => x.id === btn.dataset.slow);
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = qs("#accentSelect").value;
    utterance.rate = .75;
    speechSynthesis.speak(utterance);
  }));
  qsa("[data-transcript]", root).forEach(btn => btn.addEventListener("click", () => {
    const transcript = qs(`#transcript-${btn.dataset.transcript}`);
    transcript.classList.toggle("visible");
    btn.textContent = transcript.classList.contains("visible") ? "Hide transcript" : "Show transcript";
  }));
  qsa("[data-check-listening]", root).forEach(btn => btn.addEventListener("click", () => checkListening(btn.dataset.checkListening)));
  qsa(".listening-questions", root).forEach(questionsEl => questionsEl.addEventListener("change", () => checkListening(questionsEl.closest(".listening-card").dataset.listeningId)));
}
function checkListening(id) {
  const data = listeningData.find(x => x.id === id);
  const card = qs(`[data-listening-id="${id}"]`);
  let earned = 0;
  let answered = 0;
  qsa(".listening-question", card).forEach((qEl, index) => {
    const selected = qs("input:checked", qEl);
    qsa("label", qEl).forEach(label => label.classList.remove("correct-answer", "wrong-answer"));
    if (!selected) return;
    answered++;
    const correctInput = qsa("input", qEl).find(input => input.value === data.questions[index].answer);
    correctInput?.closest("label").classList.add("correct-answer");
    if (selected.value === data.questions[index].answer) earned++;
    else selected.closest("label").classList.add("wrong-answer");
  });
  qs(".result-badge", card).textContent = answered ? `${earned}/${answered} correct so far` : "";
  if (answered < data.questions.length) return;
  setScore(id, earned, data.questions.length);
  const allDone = listeningData.every(item => state.score[item.id]);
  if (allDone) markCompleted("listening");
}

function renderSpeaking() {
  const root = qs("#speakingMissions");
  root.innerHTML = speakingData.map(item => `
    <article class="speaking-card" data-speaking-id="${item.id}">
      <div class="speaking-card-head"><div><span class="scenario-tag">${escapeHtml(item.tag)}</span><h3>${escapeHtml(item.title)}</h3></div><span class="points">${item.time}s</span></div>
      <div class="speaking-prompt">${escapeHtml(item.prompt)}</div>
      <div class="prompt-support">${item.support.map(x => `<span>${escapeHtml(x)}</span>`).join("")}</div>
      <textarea class="speaking-notes" rows="3" data-speaking-note="${item.id}" placeholder="Prepare 3–5 keywords, not a complete script…"></textarea>
      <div class="record-row">
        <button class="button record small" type="button" data-record-start="${item.id}">● Record</button>
        <button class="button ghost small" type="button" data-record-stop="${item.id}" disabled>■ Stop</button>
        <button class="button ghost small" type="button" data-timer-only="${item.id}">Start ${item.time}s timer</button>
        <span class="record-status" id="status-${item.id}">Ready</span>
      </div>
      <audio id="audio-${item.id}" controls hidden></audio>
      <a class="button secondary small download-audio" id="download-${item.id}" href="#" download="aminata-${item.id}.webm" hidden>Download recording</a>
      <details class="model-box"><summary>Reveal a model answer after speaking</summary><div class="model-content"><button class="speak-button inline" type="button" data-model-speak="${item.id}">▶ Listen</button><p>${escapeHtml(item.model)}</p></div></details>
    </article>`).join("");

  qsa("[data-model-speak]", root).forEach(btn => btn.addEventListener("click", () => speak(speakingData.find(x => x.id === btn.dataset.modelSpeak).model)));
  qsa("[data-record-start]", root).forEach(btn => btn.addEventListener("click", () => startRecording(btn.dataset.recordStart)));
  qsa("[data-record-stop]", root).forEach(btn => btn.addEventListener("click", () => stopRecording(btn.dataset.recordStop)));
  qsa("[data-timer-only]", root).forEach(btn => btn.addEventListener("click", () => startSpeakingTimer(btn.dataset.timerOnly)));
}
async function startRecording(id) {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    qs("#recordingWarning").hidden = false;
    return showToast("Microphone recording is not available in this browser.");
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
      const url = URL.createObjectURL(blob);
      const audio = qs(`#audio-${id}`);
      const link = qs(`#download-${id}`);
      audio.src = url;
      audio.hidden = false;
      link.href = url;
      link.hidden = false;
      stream.getTracks().forEach(track => track.stop());
      qs(`#status-${id}`).textContent = "Recorded";
      markCompleted("speaking");
    };
    state.recordings[id] = { recorder, stream };
    recorder.start();
    const card = qs(`[data-speaking-id="${id}"]`);
    qs(`[data-record-start="${id}"]`, card).disabled = true;
    qs(`[data-record-stop="${id}"]`, card).disabled = false;
    qs(`#status-${id}`).textContent = "Recording…";
    startSpeakingTimer(id, true);
  } catch (error) {
    showToast("Microphone permission was not granted.");
  }
}
function stopRecording(id) {
  const recording = state.recordings[id];
  if (recording?.recorder?.state === "recording") recording.recorder.stop();
  clearInterval(state.activeTimers[id]);
  const card = qs(`[data-speaking-id="${id}"]`);
  qs(`[data-record-start="${id}"]`, card).disabled = false;
  qs(`[data-record-stop="${id}"]`, card).disabled = true;
}
function startSpeakingTimer(id, autoStop = false) {
  const item = speakingData.find(x => x.id === id);
  let seconds = item.time;
  const status = qs(`#status-${id}`);
  clearInterval(state.activeTimers[id]);
  status.textContent = formatTime(seconds);
  state.activeTimers[id] = setInterval(() => {
    seconds--;
    status.textContent = formatTime(Math.max(0, seconds));
    if (seconds <= 0) {
      clearInterval(state.activeTimers[id]);
      status.textContent = "Time";
      if (autoStop) stopRecording(id);
    }
  }, 1000);
}
function formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; }

function setupFinalRecording() {
  let finalRecorder = null;
  let finalStream = null;
  let chunks = [];
  let timer = null;
  let seconds = 90;
  const display = qs("#finalTimer");
  const startCountdown = () => {
    clearInterval(timer); seconds = 90; display.textContent = formatTime(seconds);
    timer = setInterval(() => {
      seconds--; display.textContent = formatTime(Math.max(0, seconds));
      if (seconds <= 0) { clearInterval(timer); if (finalRecorder?.state === "recording") finalRecorder.stop(); }
    }, 1000);
  };
  qs("#finalTimerBtn").addEventListener("click", () => { startCountdown(); markCompleted("finalMission"); });
  qs("#finalRecordBtn").addEventListener("click", async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") return showToast("Recording is not available in this browser.");
    try {
      finalStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      finalRecorder = new MediaRecorder(finalStream);
      chunks = [];
      finalRecorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      finalRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: finalRecorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        qs("#finalAudio").src = url; qs("#finalAudio").hidden = false;
        qs("#finalDownload").href = url; qs("#finalDownload").hidden = false;
        finalStream.getTracks().forEach(t => t.stop());
        qs("#finalRecordBtn").disabled = false; qs("#finalStopBtn").disabled = true;
        clearInterval(timer); markCompleted("finalMission"); launchConfetti();
      };
      finalRecorder.start();
      qs("#finalRecordBtn").disabled = true; qs("#finalStopBtn").disabled = false;
      startCountdown();
    } catch { showToast("Microphone permission was not granted."); }
  });
  qs("#finalStopBtn").addEventListener("click", () => { if (finalRecorder?.state === "recording") finalRecorder.stop(); });
}

function countWords(text) { return text.trim() ? text.trim().split(/\s+/).length : 0; }
function setupWriting() {
  qsa("[data-writing-tab]").forEach(tab => tab.addEventListener("click", () => {
    qsa("[data-writing-tab]").forEach(t => { t.classList.toggle("active", t === tab); t.setAttribute("aria-selected", String(t === tab)); });
    qsa("[data-writing-panel]").forEach(panel => { panel.hidden = panel.dataset.writingPanel !== tab.dataset.writingTab; panel.classList.toggle("active", panel.dataset.writingPanel === tab.dataset.writingTab); });
  }));
  [["introWriting", "introWordCount"], ["emailWriting", "emailWordCount"]].forEach(([textId, countId]) => {
    const textarea = qs(`#${textId}`);
    const update = () => { qs(`#${countId}`).textContent = countWords(textarea.value); if (countWords(textarea.value) >= 60) markCompleted("writing"); saveState(); };
    textarea.addEventListener("input", update); update();
  });
  qsa("[data-copy-textarea]").forEach(btn => btn.addEventListener("click", async () => {
    const text = qs(`#${btn.dataset.copyTextarea}`).value;
    await navigator.clipboard.writeText(text); showToast("Text copied.");
  }));
  qsa("[data-download-textarea]").forEach(btn => btn.addEventListener("click", () => downloadBlob(qs(`#${btn.dataset.downloadTextarea}`).value, btn.dataset.filename)));
  qsa("[data-clear-textarea]").forEach(btn => btn.addEventListener("click", () => { if (confirm("Clear this text?")) { qs(`#${btn.dataset.clearTextarea}`).value = ""; qs(`#${btn.dataset.clearTextarea}`).dispatchEvent(new Event("input")); } }));
}

function setupChecklists() {
  qsa("[data-checklist]").forEach(list => qsa("input[type=checkbox]", list).forEach((box, index) => {
    box.dataset.persistKey = `${list.dataset.checklist}-${index}`;
    box.name = box.dataset.persistKey;
    box.addEventListener("change", () => {
      const boxes = qsa("input[type=checkbox]", list);
      if (boxes.every(x => x.checked)) {
        if (list.dataset.checklist === "profileChecklist") markCompleted("profile");
        if (list.dataset.checklist === "writingChecklist") markCompleted("writing");
      }
      saveState();
    });
  }));
}
function setupRangeOutputs() {
  qsa('input[type="range"]').forEach(input => {
    const output = input.parentElement.querySelector("output");
    const update = () => { if (output) output.textContent = `${input.value}/5`; saveState(); };
    input.addEventListener("input", update); update();
  });
}
function updateAutoCriteria() {
  const totals = getTotals();
  const ratio = totals.total ? totals.earned / totals.total : 0;
  const criteria = [
    { label: "Professional vocabulary", status: state.score.vocab ? (state.score.vocab.earned / state.score.vocab.total >= .75 ? "Acquis" : "En cours") : "À réaliser" },
    { label: "Present simple / continuous", status: state.score.tense ? (state.score.tense.earned / state.score.tense.total >= .75 ? "Acquis" : "En cours") : "À réaliser" },
    { label: "Sentence structure", status: state.score.wordOrder ? (state.score.wordOrder.earned === state.score.wordOrder.total ? "Acquis" : "En cours") : "À réaliser" },
    { label: "Listening for key details", status: listeningData.every(x => state.score[x.id]) ? (listeningData.reduce((a,x) => a + state.score[x.id].earned,0) / 9 >= .75 ? "Acquis" : "En cours") : "À réaliser" },
    { label: "Overall interactive activities", status: totals.total ? (ratio >= .75 ? "Acquis" : "En cours") : "À réaliser" }
  ];
  const root = qs("#autoCriteria");
  if (!root) return;
  root.innerHTML = criteria.map(c => {
    const cls = c.status === "Acquis" ? "acquired" : c.status === "En cours" ? "progress" : "pending";
    return `<div class="auto-criterion"><span>${escapeHtml(c.label)}</span><span class="criterion-status ${cls}">${escapeHtml(c.status)}</span></div>`;
  }).join("");
}
function buildReportHtml() {
  const totals = getTotals();
  const completion = qs("#reportCompletion").textContent;
  const date = qs("#lessonDate").value || new Date().toISOString().slice(0,10);
  const satisfaction = ["satObjectives","satActivities","satConfidence","satPace"].map(id => qs(`#${id}`).value);
  const criteriaRows = qs("#autoCriteria").innerHTML;
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><title>Évaluation Qualiopi — Aminata Touré — Leçon 1</title><style>
  body{font-family:Arial,sans-serif;color:#17233a;margin:0;background:#eef3f9}main{max-width:900px;margin:25px auto;background:white;padding:35px;border-top:8px solid #d7193f;box-shadow:0 10px 35px #071b3a20}h1,h2{color:#071b3a}h1{font-family:Georgia,serif}.meta,.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.box{border:1px solid #dce4ef;border-radius:10px;padding:12px;margin:10px 0}.metric{background:#071b3a;color:white;padding:12px;border-radius:8px}.auto-criterion{display:flex;justify-content:space-between;padding:8px;border-bottom:1px solid #ddd}.criterion-status{font-weight:bold}.comment{white-space:pre-wrap;min-height:50px}@media print{body{background:white}main{box-shadow:none;margin:0;max-width:none}}</style></head><body><main>
  <p style="color:#d7193f;font-weight:bold;letter-spacing:.1em">CONNECT LEARNING · ÉVALUATION DES ACQUIS EN COURS DE FORMATION</p>
  <h1>Aminata Touré — Leçon 1</h1><h2>From Experience to Excellence</h2>
  <div class="meta"><div class="metric"><small>Date</small><br><strong>${escapeHtml(date)}</strong></div><div class="metric"><small>Durée</small><br><strong>${escapeHtml(qs("#actualDuration").value || "Non renseignée")}</strong></div><div class="metric"><small>Score interactif</small><br><strong>${totals.earned}/${totals.total}</strong></div><div class="metric"><small>Progression</small><br><strong>${escapeHtml(completion)}</strong></div></div>
  <div class="box"><h2>Indicateurs automatisés</h2>${criteriaRows}</div>
  <div class="grid"><div class="box"><h2>Validation formateur</h2><p>Expression orale : <strong>${escapeHtml(qs("#oralStatus").value)}</strong></p><p>Expression écrite : <strong>${escapeHtml(qs("#writingStatus").value)}</strong></p><p>Compréhension orale : <strong>${escapeHtml(qs("#listeningStatus").value)}</strong></p><p>Résultat global : <strong>${escapeHtml(qs("#overallStatus").value)}</strong></p></div>
  <div class="box"><h2>Satisfaction apprenante</h2><p>Objectifs clairs : ${satisfaction[0]}/5</p><p>Activités utiles : ${satisfaction[1]}/5</p><p>Confiance : ${satisfaction[2]}/5</p><p>Rythme : ${satisfaction[3]}/5</p></div></div>
  <div class="box"><h2>Commentaires de l’apprenante</h2><div class="comment">${escapeHtml(qs("#learnerComments").value || "—")}</div></div>
  <div class="box"><h2>Commentaires de la formatrice</h2><div class="comment">${escapeHtml(qs("#trainerComments").value || "—")}</div></div>
  <div class="box"><h2>Priorité de la prochaine séance</h2><div class="comment">${escapeHtml(qs("#nextPriority").value || "—")}</div></div>
  <div class="grid"><div class="box">Apprenante : <strong>${escapeHtml(qs("#learnerName").value)}</strong></div><div class="box">Formatrice : <strong>${escapeHtml(qs("#trainerName").value)}</strong></div></div>
  <p style="font-size:12px;color:#647089">Document généré depuis la page interactive de formation. Les résultats oraux et écrits restent soumis à la validation de la formatrice.</p>
  </main></body></html>`;
}
function buildPlainReport() {
  const totals = getTotals();
  return `ÉVALUATION QUALIOPI — AMINATA TOURÉ — LEÇON 1\n\nDate : ${qs("#lessonDate").value || "Non renseignée"}\nDurée : ${qs("#actualDuration").value || "Non renseignée"}\nScore interactif : ${totals.earned}/${totals.total}\nProgression : ${qs("#reportCompletion").textContent}\n\nExpression orale : ${qs("#oralStatus").value}\nExpression écrite : ${qs("#writingStatus").value}\nCompréhension orale : ${qs("#listeningStatus").value}\nRésultat global : ${qs("#overallStatus").value}\n\nCommentaires de l’apprenante :\n${qs("#learnerComments").value || "—"}\n\nCommentaires de la formatrice :\n${qs("#trainerComments").value || "—"}\n\nPriorité suivante :\n${qs("#nextPriority").value || "—"}\n\nApprenante : ${qs("#learnerName").value}\nFormatrice : ${qs("#trainerName").value}`;
}
function setupReports() {
  const today = new Date();
  qs("#reportDate").textContent = today.toLocaleDateString("fr-FR");
  if (!qs("#lessonDate").value) qs("#lessonDate").value = today.toISOString().slice(0,10);
  const elapsedMinutes = Math.max(1, Math.round((Date.now() - state.startedAt) / 60000));
  qs("#reportDuration").textContent = `${elapsedMinutes} min active`;
  qs("#downloadReportHtml").addEventListener("click", () => { downloadBlob(buildReportHtml(), "evaluation-qualiopi-aminata-lecon-1.html", "text/html"); markCompleted("qualiopi"); showToast("Evaluation HTML downloaded."); });
  qs("#copyReport").addEventListener("click", async () => { await navigator.clipboard.writeText(buildPlainReport()); markCompleted("qualiopi"); showToast("Evaluation copied."); });
  qs("#printReport").addEventListener("click", () => { document.body.classList.add("print-report-only"); window.print(); setTimeout(() => document.body.classList.remove("print-report-only"), 500); markCompleted("qualiopi"); });
  qs("#printLesson").addEventListener("click", () => { document.body.classList.remove("print-report-only"); window.print(); });
}

function setupNavigationObserver() {
  const links = qsa(".side-nav a[data-section]");
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) {
      links.forEach(link => link.classList.toggle("active", link.dataset.section === visible.target.id));
      if (visible.target.classList.contains("completed-on-view")) markCompleted(visible.target.dataset.progressKey);
    }
  }, { threshold: [0.2, 0.55] });
  qsa(".lesson-section").forEach(section => observer.observe(section));
}
function setupGeneralActions() {
  qs("#translationToggle").addEventListener("click", e => {
    const active = !document.body.classList.contains("show-fr"); document.body.classList.toggle("show-fr", active); e.currentTarget.setAttribute("aria-pressed", String(active)); saveState();
  });
  qs("#focusToggle").addEventListener("click", e => {
    const active = !document.body.classList.contains("focus-mode"); document.body.classList.toggle("focus-mode", active); e.currentTarget.setAttribute("aria-pressed", String(active)); saveState();
  });
  qs("#saveAllBtn").addEventListener("click", () => { saveState(); showToast("Progress saved in this browser."); });
  qs("#resumeBtn").addEventListener("click", () => {
    const firstIncomplete = qsa(".lesson-section[data-progress-key]").find(section => !state.completed[section.dataset.progressKey]);
    (firstIncomplete || qs("#briefing")).scrollIntoView({ behavior: "smooth" });
  });
  qsa("[data-speak-target]").forEach(btn => btn.addEventListener("click", () => speak(qs(`#${btn.dataset.speakTarget}`).textContent)));
  qs("#resetLesson").addEventListener("click", () => {
    if (!confirm("Reset all saved answers, scores and progress for this lesson?")) return;
    storageRemove(STORAGE_KEY); location.reload();
  });
  qsa("input, textarea, select").forEach(el => el.addEventListener("change", saveState));
  window.addEventListener("beforeunload", saveState);
}
function setupB2Check() {
  const list = qs('[data-question="b2-1"]');
  qsa("button", list).forEach(btn => btn.addEventListener("click", () => {
    qsa("button", list).forEach(b => b.classList.remove("selected", "correct", "incorrect"));
    btn.classList.add("selected");
    const correct = btn.dataset.choice === list.dataset.answer;
    btn.classList.add(correct ? "correct" : "incorrect");
    if (!correct) qsa("button", list).find(b => b.dataset.choice === list.dataset.answer).classList.add("correct");
    qs(".feedback", list.parentElement).textContent = correct ? "Exactly. The answer is developed, precise and linked to the role." : "The strongest answer develops the idea and shows professional evidence.";
    setScore("b2check", correct ? 1 : 0, 1); markCompleted("target");
  }));
}

function init() {
  renderVocab();
  renderChoiceQuiz(qs("#vocabQuiz"), vocabQuizData, "vocab");
  renderChoiceQuiz(qs("#tenseQuiz"), tenseQuizData, "tense");
  renderWordOrder();
  renderListening();
  renderSpeaking();
  setupChecklists();
  loadState();
  setupGeneralActions();
  setupB2Check();
  setupWriting();
  setupRangeOutputs();
  setupReports();
  setupFinalRecording();
  setupNavigationObserver();

  qs("#vocabCategory").addEventListener("change", e => renderVocab(e.target.value));
  qs("#listenVocabBtn").addEventListener("click", () => speak(vocabData[qs("#vocabCategory").value].map(x => `${x.en}. ${x.ex}`).join(" ")));
  qs("#checkVocabQuiz").addEventListener("click", () => checkChoiceQuiz(qs("#vocabQuiz"), vocabQuizData, "vocab", qs("#vocabQuizResult")));
  qs("#resetVocabQuiz").addEventListener("click", () => { renderChoiceQuiz(qs("#vocabQuiz"), vocabQuizData, "vocab"); qs("#vocabQuizResult").textContent = ""; });
  qs("#checkTenseQuiz").addEventListener("click", () => checkChoiceQuiz(qs("#tenseQuiz"), tenseQuizData, "tense", qs("#tenseQuizResult")));
  qs("#resetTenseQuiz").addEventListener("click", () => { renderChoiceQuiz(qs("#tenseQuiz"), tenseQuizData, "tense"); qs("#tenseQuizResult").textContent = ""; });
  qs("#resetWordOrder").addEventListener("click", renderWordOrder);
  qsa("#profileForm select").forEach(select => select.addEventListener("change", updateProfile));
  updateProfile();
  qs("#copyProfile").addEventListener("click", async () => { await navigator.clipboard.writeText(qs("#generatedProfile").textContent); showToast("Introduction copied."); });
  qs("#downloadProfile").addEventListener("click", () => downloadBlob(qs("#generatedProfile").textContent, "aminata-professional-introduction.txt"));

  // Restore dependent UI after values are loaded.
  qsa('input[type="range"]').forEach(input => input.dispatchEvent(new Event("input")));
  [["introWriting", "introWordCount"], ["emailWriting", "emailWordCount"]].forEach(([id]) => qs(`#${id}`).dispatchEvent(new Event("input")));
  updateDashboard();

  // Consider the vocabulary and grammar sections engaged after the learner interacts with them.
  qs("#vocabCategory").addEventListener("change", () => markCompleted("vocabulary"), { once: true });
  qs("#yearsExperience").addEventListener("change", () => markCompleted("profile"), { once: true });
  qsa("#debrief input, #debrief textarea").forEach(el => el.addEventListener("change", () => markCompleted("debrief"), { once: true }));
}

document.addEventListener("DOMContentLoaded", init);
