document.body.classList.add("ready");

const state = {
  lang: "en",
  voice: "en-GB",
  rate: 0.92,
  score: 0,
  possible: 0,
  completed: new Set(),
  selectedSortItem: null
};

const labels = {
  en: {
    french:"French", definition:"Definition", example:"Example", listen:"Listen",
    correct:"✅ Correct!", incorrect:"❌ Try again. Look at the rule above."
  },
  fr: {
    french:"Français", definition:"Définition", example:"Exemple", listen:"Écouter",
    correct:"✅ Correct !", incorrect:"❌ Réessayez. Regardez la règle au-dessus."
  }
};

const categories = [
  ["all","All categories"],
  ["syntax","Sentence building"],
  ["future","Future plans"],
  ["prepositions","Small words"],
  ["travel","Travel situations"],
  ["hotel","Hotel / preferences"]
];

const vocab = [
  {cat:"syntax", icon:"🧩", word:"subject", fr:"sujet", def:"The person or thing doing the action.", ex:"I travel by train."},
  {cat:"syntax", icon:"⚙️", word:"verb", fr:"verbe", def:"The action or state.", ex:"I travel by train."},
  {cat:"syntax", icon:"📦", word:"complement", fr:"complément", def:"Extra information after the verb.", ex:"I travel by train."},
  {cat:"syntax", icon:"⏰", word:"time expression", fr:"expression de temps", def:"Words that say when something happens.", ex:"I travel every summer."},
  {cat:"future", icon:"✈️", word:"going to", fr:"aller + verbe / projet", def:"Use it for future plans and intentions.", ex:"I am going to travel to Scotland."},
  {cat:"future", icon:"📅", word:"next year", fr:"l’année prochaine", def:"The year after this year.", ex:"I am going to visit London next year."},
  {cat:"future", icon:"🗺️", word:"plan", fr:"projet", def:"Something you intend to do.", ex:"My plan is to visit Edinburgh."},
  {cat:"prepositions", icon:"💬", word:"talk about", fr:"parler de", def:"Learn this as a block.", ex:"What are you talking about?"},
  {cat:"prepositions", icon:"🔎", word:"look for", fr:"chercher", def:"Try to find something.", ex:"What are you looking for?"},
  {cat:"prepositions", icon:"⏳", word:"wait for", fr:"attendre", def:"Stay until someone or something arrives.", ex:"Who are you waiting for?"},
  {cat:"prepositions", icon:"👥", word:"travel with", fr:"voyager avec", def:"Go somewhere with another person.", ex:"Who are you travelling with?"},
  {cat:"travel", icon:"🚆", word:"by train", fr:"en train", def:"The method of transport.", ex:"I usually travel by train."},
  {cat:"travel", icon:"⛴️", word:"by ferry", fr:"en ferry", def:"The method of transport.", ex:"I am going to travel by ferry."},
  {cat:"travel", icon:"🚕", word:"in a taxi", fr:"dans un taxi", def:"Inside a taxi.", ex:"I am in a taxi."},
  {cat:"travel", icon:"🚉", word:"at the station", fr:"à la gare", def:"At a travel place.", ex:"I am waiting at the station."},
  {cat:"hotel", icon:"🏨", word:"quiet hotel", fr:"hôtel calme", def:"A calm place to stay.", ex:"I am looking for a quiet hotel."},
  {cat:"hotel", icon:"📍", word:"near the station", fr:"près de la gare", def:"Not far from the station.", ex:"The hotel is near the station."},
  {cat:"hotel", icon:"🛏️", word:"comfortable room", fr:"chambre confortable", def:"A room that feels good and relaxing.", ex:"I would like a comfortable room."}
];

function t(key){ return labels[state.lang][key]; }

function speakText(text){
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = state.voice;
  utter.rate = state.rate;
  speechSynthesis.speak(utter);
}

function renderVocab(filter="all"){
  const grid = document.getElementById("vocabGrid");
  grid.innerHTML = "";
  vocab.filter(v => filter === "all" || v.cat === filter).forEach(v => {
    const card = document.createElement("article");
    card.className = "vocab-card";
    card.innerHTML = `
      <div class="icon">${v.icon}</div>
      <span class="tag">${categories.find(c=>c[0]===v.cat)[1]}</span>
      <h4>${v.word}</h4>
      <p><strong>${t("french")}:</strong> ${v.fr}</p>
      <p><strong>${t("definition")}:</strong> ${v.def}</p>
      <p><strong>${t("example")}:</strong> <em>${v.ex}</em></p>
      <button class="listen">${t("listen")}</button>
    `;
    card.querySelector(".listen").addEventListener("click", () => speakText(v.ex));
    grid.appendChild(card);
  });
}

function renderChips(){
  const row = document.getElementById("vocabChips");
  const current = document.getElementById("vocabCategory").value;
  row.innerHTML = "";
  categories.forEach(([value,label]) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (current === value ? " active" : "");
    btn.textContent = label;
    btn.addEventListener("click", () => {
      document.getElementById("vocabCategory").value = value;
      renderVocab(value);
      renderChips();
    });
    row.appendChild(btn);
  });
}

function setupQuizzes(){
  const quizzes = document.querySelectorAll(".quiz");
  quizzes.forEach((quiz, index) => {
    state.possible++;
    quiz.dataset.id = "q" + index;
    quiz.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const ok = btn.textContent.trim() === quiz.dataset.answer;
        const fb = quiz.querySelector(".feedback");
        if(ok){
          fb.textContent = t("correct");
          fb.className = "feedback correct";
          if(!state.completed.has(quiz.dataset.id)){
            state.completed.add(quiz.dataset.id);
            state.score++;
            updateScore();
          }
        }else{
          fb.textContent = t("incorrect");
          fb.className = "feedback incorrect";
        }
      });
    });
  });
  updateScore();
}

function updateScore(){
  document.getElementById("score").textContent = state.score;
  document.getElementById("possible").textContent = state.possible;
}

function setupBuilders(){
  document.querySelectorAll(".builder").forEach((builder, index) => {
    const target = builder.dataset.target;
    const originalWords = target.split(" ");
    const shuffled = [...originalWords].sort(() => Math.random() - 0.5);
    const answer = builder.querySelector(".builder-answer");
    const bank = builder.querySelector(".builder-bank");
    const fb = builder.querySelector(".feedback");
    let built = [];

    function render(){
      answer.textContent = built.join(" ");
    }

    shuffled.forEach(word => {
      const btn = document.createElement("button");
      btn.textContent = word;
      btn.addEventListener("click", () => {
        built.push(word);
        btn.disabled = true;
        render();
      });
      bank.appendChild(btn);
    });

    builder.querySelector(".reset-builder").addEventListener("click", () => {
      built = [];
      render();
      bank.querySelectorAll("button").forEach(b => b.disabled = false);
      fb.textContent = "";
      fb.className = "feedback";
    });

    builder.querySelector(".check-builder").addEventListener("click", () => {
      if(built.join(" ") === target){
        fb.textContent = t("correct");
        fb.className = "feedback correct";
      }else{
        fb.textContent = "❌ Check the order: Subject + verb block + information.";
        fb.className = "feedback incorrect";
      }
    });

    builder.querySelector(".listen-target").addEventListener("click", () => speakText(target));
  });
}

function setupSort(){
  const items = [
    ["I","subject"],["you","subject"],["travel","verb"],["am going to travel","verb"],["about","smallword"],
    ["for","smallword"],["next year","time"],["today","time"],["to Scotland","place"],["at the station","place"]
  ].sort(()=>Math.random() - 0.5);

  const bank = document.getElementById("sortBank");
  items.forEach(([word,type]) => {
    const el = document.createElement("div");
    el.className = "sort-item";
    el.draggable = true;
    el.textContent = word;
    el.dataset.type = type;
    el.addEventListener("dragstart", () => el.classList.add("dragging"));
    el.addEventListener("dragend", () => el.classList.remove("dragging"));
    el.addEventListener("click", () => {
      document.querySelectorAll(".sort-item").forEach(x => x.classList.remove("selected"));
      state.selectedSortItem = el;
      el.classList.add("selected");
    });
    bank.appendChild(el);
  });

  document.querySelectorAll(".dropzone").forEach(zone => {
    zone.addEventListener("dragover", e => e.preventDefault());
    zone.addEventListener("drop", e => {
      e.preventDefault();
      placeSortItem(document.querySelector(".dragging"), zone);
    });
    zone.addEventListener("click", () => {
      if(state.selectedSortItem) placeSortItem(state.selectedSortItem, zone);
    });
  });
}

function placeSortItem(item, zone){
  if(!item) return;
  const fb = document.getElementById("sortFeedback");
  if(item.dataset.type === zone.dataset.zone){
    zone.appendChild(item);
    item.classList.remove("selected");
    state.selectedSortItem = null;
    fb.textContent = t("correct");
    fb.className = "feedback correct";
  }else{
    fb.textContent = t("incorrect");
    fb.className = "feedback incorrect";
  }
}

const roleplays = [
  {
    title:"Future travel plans",
    question:"Travel Agent: Where are you going to travel next year?",
    response:"I am going to travel to Scotland next year.",
    model:"That sounds wonderful. Scotland is beautiful, historic and very interesting."
  },
  {
    title:"Small word at the end",
    question:"Travel Agent: What are you looking for in a hotel?",
    response:"I am looking for a quiet hotel near the station.",
    model:"Of course. A quiet hotel near the station is a practical choice."
  },
  {
    title:"Travel companion",
    question:"Travel Agent: Who are you going to travel with?",
    response:"I am going to travel with my family.",
    model:"Very nice. Travelling with family can be comfortable and reassuring."
  },
  {
    title:"Transport habits",
    question:"Travel Agent: How do you usually travel?",
    response:"I usually travel by train because it is relaxing.",
    model:"Excellent. That is clear, simple and natural."
  }
];

function renderRoleplays(){
  const container = document.getElementById("roleplayContainer");
  roleplays.forEach(r => {
    const card = document.createElement("article");
    card.className = "role-card";
    card.innerHTML = `
      <h3>${r.title}</h3>
      <div class="role-line"><strong>Question:</strong> ${r.question}</div>
      <button class="listenQ">Listen to question</button>
      <button class="showR">Show your response</button>
      <div class="role-line response hidden"><strong>Your response:</strong> ${r.response}<br><button class="listenR">Listen</button> <button class="showM">Show model answer</button></div>
      <div class="role-line modelLine hidden"><strong>Model answer:</strong> ${r.model}<br><button class="listenM">Listen</button></div>
    `;
    card.querySelector(".listenQ").addEventListener("click", () => speakText(r.question.replace(/^.*?: /,"")));
    card.querySelector(".showR").addEventListener("click", () => card.querySelector(".response").classList.remove("hidden"));
    card.querySelector(".listenR").addEventListener("click", () => speakText(r.response));
    card.querySelector(".showM").addEventListener("click", () => card.querySelector(".modelLine").classList.remove("hidden"));
    card.querySelector(".listenM").addEventListener("click", () => speakText(r.model));
    container.appendChild(card);
  });
}

function setupControls(){
  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => document.getElementById(btn.dataset.scroll).scrollIntoView({behavior:"smooth"}));
  });
  document.getElementById("languageMode").addEventListener("change", e => {
    state.lang = e.target.value;
    document.body.classList.toggle("lang-fr", state.lang === "fr");
    renderVocab(document.getElementById("vocabCategory").value);
  });
  document.getElementById("voiceMode").addEventListener("change", e => state.voice = e.target.value);
  document.getElementById("speedMode").addEventListener("change", e => state.rate = parseFloat(e.target.value));
  document.getElementById("vocabCategory").addEventListener("change", e => {
    renderVocab(e.target.value);
    renderChips();
  });
  document.getElementById("showModel").addEventListener("click", () => document.getElementById("modelAnswer").classList.toggle("hidden"));
  document.getElementById("listenModel").addEventListener("click", () => speakText("I usually travel by train because it is relaxing. Next year, I am going to travel to Scotland. I am looking for a quiet hotel near the station. I am going to travel with my family, and I would like to visit castles and beautiful landscapes."));
}

document.addEventListener("DOMContentLoaded", () => {
  setupControls();
  renderChips();
  renderVocab();
  setupQuizzes();
  setupBuilders();
  setupSort();
  renderRoleplays();
});
