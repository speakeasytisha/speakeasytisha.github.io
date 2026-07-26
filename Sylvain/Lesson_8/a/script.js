const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

const activities = {
  mirror: {
    title: "Exercise 1 · Tense mirror: choose the correct structure",
    intro: "The subject stays similar. Choose the sentence that matches the meaning.",
    items: [
      {level:"easy", q:"Routine: every month", options:["I travel for work every month.","I am travelling for work every month.","I was travelling for work every month."], correct:"I travel for work every month.", hint:"Every month = routine.", exp:"Use the present simple for routines."},
      {level:"easy", q:"Happening now", options:["I prepare an order now.","I am preparing an order now.","I prepared an order now."], correct:"I am preparing an order now.", hint:"Now = action in progress.", exp:"Use am / is / are + verb-ing."},
      {level:"medium", q:"Finished past action: yesterday", options:["I have prepared the order yesterday.","I was preparing the order yesterday.","I prepared the order yesterday."], correct:"I prepared the order yesterday.", hint:"Yesterday = finished past time.", exp:"Use past simple with finished past time."},
      {level:"medium", q:"Life experience, no exact date", options:["I have prepared many airline orders.","I prepared many airline orders yesterday.","I am preparing many airline orders."], correct:"I have prepared many airline orders.", hint:"Experience until now = present perfect.", exp:"Use have/has + past participle for experience."},
      {level:"hard", q:"Long action interrupted by a short action", options:["I was checking the labels when the client called.","I checked the labels when the client was calling.","I have checked the labels when the client called."], correct:"I was checking the labels when the client called.", hint:"Long action = was checking. Short action = called.", exp:"Use past continuous for the background action and past simple for the interruption."},
      {level:"hard", q:"General preference", options:["I am liking travelling.","I like travelling.","I was liking travelling."], correct:"I like travelling.", hint:"Like is usually a state verb. It is not normally continuous here.", exp:"I like travelling = present simple + gerund."}
    ]
  },
  articles1: {
    title: "Exercise 2 · Articles: a, an, the or nothing",
    intro: "Choose the correct article. Ø means no article.",
    items: [
      {level:"easy", q:"I received ___ order this morning.", options:["an","a","the","Ø"], correct:"an", hint:"Order begins with a vowel sound.", exp:"Use an for first mention before a vowel sound."},
      {level:"easy", q:"___ order is for three passengers. We already know which order.", options:["The","A","An","Ø"], correct:"The", hint:"Second mention or specific.", exp:"Use the when the noun is specific or already known."},
      {level:"easy", q:"Food safety is ___ important part of your work.", options:["a","the","an","Ø"], correct:"an", hint:"Important begins with a vowel sound and this means one part.", exp:"Use an before a vowel sound: an important part."},
      {level:"medium", q:"___ food safety is essential in airline catering.", options:["Ø","The","A","An"], correct:"Ø", hint:"Food safety in general.", exp:"Use no article with a general uncountable noun."},
      {level:"medium", q:"You speak ___ English with airline clients.", options:["Ø","the","an","a"], correct:"Ø", hint:"Languages normally take no article.", exp:"Use no article before languages in general."},
      {level:"medium", q:"We are moving to ___ Lisbon.", options:["Ø","the","a","an"], correct:"Ø", hint:"Cities normally take no article.", exp:"Use no article with most city names."},
      {level:"medium", q:"We are moving to ___ Portugal.", options:["Ø","the","a","an"], correct:"Ø", hint:"Single-name countries normally take no article.", exp:"Use no article with most countries: Portugal, France, Spain."},
      {level:"medium", q:"The client is in ___ United Kingdom.", options:["the","Ø","a","an"], correct:"the", hint:"Kingdom is a common/group word.", exp:"Use the with the United Kingdom."},
      {level:"hard", q:"You worked with clients from ___ United States and ___ France.", options:["the / Ø","Ø / the","the / the","Ø / Ø"], correct:"the / Ø", hint:"United States takes the; France takes no article.", exp:"Use the United States, but France with no article."},
      {level:"hard", q:"This is ___ best option for the delivery.", options:["the","a","an","Ø"], correct:"the", hint:"Superlatives usually use the.", exp:"Use the with superlatives: the best, the most important."},
      {level:"hard", q:"This is ___ first order for tomorrow morning.", options:["the","a","an","Ø"], correct:"the", hint:"Ordinals usually use the.", exp:"Use the with ordinals: the first, the second."}
    ]
  },
  articles2: {
    title: "Exercise 3 · Article traps in realistic sentences",
    intro: "Choose the best sentence.",
    items: [
      {level:"easy", q:"First mention + second mention", options:["There is a hotel near the airport. The hotel is excellent.","There is the hotel near the airport. A hotel is excellent.","There is hotel near airport. The hotel is excellent."], correct:"There is a hotel near the airport. The hotel is excellent.", hint:"First mention = a. Second mention = the.", exp:"This is the classic a → the sequence."},
      {level:"medium", q:"General plural", options:["Airlines need clear labels.","The airlines need clear labels.","An airlines need clear labels."], correct:"Airlines need clear labels.", hint:"All airlines in general.", exp:"Use no article for general plural nouns."},
      {level:"medium", q:"Specific place now", options:["I am at airport now.","I am at the airport now.","I am to the airport now."], correct:"I am at the airport now.", hint:"You are located there now.", exp:"Use at for location and the when the place is known."},
      {level:"hard", q:"Meals", options:["I have breakfast at 7, but the breakfast yesterday was late.","I have the breakfast at 7, but breakfast yesterday was late.","I have a breakfast at 7, but a breakfast yesterday was late."], correct:"I have breakfast at 7, but the breakfast yesterday was late.", hint:"Meals in general often take no article; a specific meal can use the.", exp:"No article for normal meals, the for a specific meal already identified by context."}
    ]
  },
  pronouns1: {
    title: "Exercise 4 · I, me or myself",
    intro: "Choose the correct pronoun.",
    items: [
      {level:"easy", q:"___ prepared the order this morning.", options:["I","Me","Myself"], correct:"I", hint:"The person does the action.", exp:"Use I as the subject."},
      {level:"easy", q:"The client called ___.", options:["me","I","myself"], correct:"me", hint:"The action goes to the person.", exp:"Use me as the object."},
      {level:"easy", q:"I introduced ___ to the client.", options:["myself","me","I"], correct:"myself", hint:"Same person: I introduced I/me?", exp:"Use myself when the subject and object are the same person."},
      {level:"medium", q:"My daughter and ___ are moving to Lisbon.", options:["I","me","myself"], correct:"I", hint:"Both people are the subject.", exp:"Use I in a compound subject."},
      {level:"medium", q:"The client invited my daughter and ___.", options:["me","I","myself"], correct:"me", hint:"Both people receive the action.", exp:"Use me in a compound object."},
      {level:"medium", q:"The airline sent the details to ___.", options:["me","I","myself"], correct:"me", hint:"After to, use the object form.", exp:"Use me after a preposition: to me, with me, for me."},
      {level:"medium", q:"___ am checking the labels now.", options:["I","Me","Myself"], correct:"I", hint:"Before am, you need the subject.", exp:"Use I as the subject before the verb."},
      {level:"medium", q:"I prepared the order ___ because the team was busy.", options:["myself","me","I"], correct:"myself", hint:"Here it means alone / without help.", exp:"Use myself for emphasis: I did it myself."},
      {level:"hard", q:"Choose the sentence where myself is used correctly.", options:["I checked the order myself.","Myself checked the order.","The client called myself."], correct:"I checked the order myself.", hint:"Myself cannot replace I or me.", exp:"Use myself for emphasis after a complete sentence: I checked it myself."},
      {level:"hard", q:"Choose the most professional sentence.", options:["My daughter and I visited the house.","Me and my daughter visited the house.","Myself and my daughter visited the house."], correct:"My daughter and I visited the house.", hint:"Professional English: other person first + I as subject.", exp:"Use My daughter and I for the subject."},
      {level:"hard", q:"Choose the correct sentence.", options:["They sent us the order and we confirmed it ourselves.","They sent we the order and us confirmed it ourselves.","They sent ourselves the order and we confirmed it."], correct:"They sent us the order and we confirmed it ourselves.", hint:"After send, use an object pronoun.", exp:"Us is the object of sent; ourselves emphasizes we did the confirmation."}
    ]
  },
  pronouns2: {
    title: "Exercise 5 · Correct the mistake",
    intro: "Type the corrected sentence. Capital letters and punctuation are not important.",
    type:"typed",
    items: [
      {level:"medium", q:"Correct: Me and my daughter are moving to Lisbon.", answers:["My daughter and I are moving to Lisbon"], hint:"The people are the subject.", exp:"Use My daughter and I as a professional subject."},
      {level:"medium", q:"Correct: The client called my daughter and I.", answers:["The client called my daughter and me"], hint:"After called, use an object pronoun.", exp:"Use me as an object."},
      {level:"hard", q:"Correct: They contacted I yesterday.", answers:["They contacted me yesterday"], hint:"After contacted, use the object form.", exp:"I becomes me after a verb."},
      {level:"hard", q:"Correct: I prepared the order me.", answers:["I prepared the order myself"], hint:"Here it means alone / without help.", exp:"Use myself for emphasis or reflexive meaning."},
      {level:"hard", q:"Correct: The airline sent the confirmation to I.", answers:["The airline sent the confirmation to me"], hint:"After to, use the object form.", exp:"Use me after a preposition: to me."},
      {level:"hard", q:"Correct: Myself and my daughter are visiting a house.", answers:["My daughter and I are visiting a house"], hint:"The two people are the subject; professional order = other person first.", exp:"Use My daughter and I as the subject."}
    ]
  },
  pastcont1: {
    title: "Exercise 6 · Past continuous basics",
    intro: "Choose the correct structure.",
    items: [
      {level:"easy", q:"Yesterday at 10, I ___ an order.", options:["was preparing","prepared","am preparing"], correct:"was preparing", hint:"At that moment in the past = action in progress.", exp:"Use was/were + verb-ing."},
      {level:"easy", q:"We ___ the labels when the client called.", options:["were checking","checked","are checking"], correct:"were checking", hint:"Long action + interruption.", exp:"Use were checking for the action in progress."},
      {level:"medium", q:"Question form", options:["Were you driving when she called?","Did you were driving when she called?","Were you drove when she called?"], correct:"Were you driving when she called?", hint:"Move was/were before the subject.", exp:"Past continuous question: Was/Were + subject + verb-ing?"},
      {level:"medium", q:"Negative form", options:["I was not working at the restaurant yesterday afternoon.","I did not was working at the restaurant yesterday afternoon.","I was not worked at the restaurant yesterday afternoon."], correct:"I was not working at the restaurant yesterday afternoon.", hint:"No did with was/were.", exp:"Use was/were not + verb-ing."},
      {level:"hard", q:"Past continuous + past simple", options:["While I was preparing the order, the phone rang.","While I prepared the order, the phone was ringing suddenly.","While I am preparing the order, the phone rang."], correct:"While I was preparing the order, the phone rang.", hint:"While often introduces the long action.", exp:"Past continuous for the long action, past simple for the short event."},
      {level:"hard", q:"Choose the correct meaning: I was preparing the order when she called.", options:["The preparation was in progress when she called.","I finished preparing before she called.","I prepare orders every day."], correct:"The preparation was in progress when she called.", hint:"Was preparing = action in progress.", exp:"Past continuous shows the action was happening at that moment."}
    ]
  },
  pastcont2: {
    title: "Exercise 7 · Same subject transformations",
    intro: "Type the correct sentence with the words given.",
    type:"typed",
    items: [
      {level:"easy", q:"now / I / prepare / an order", answers:["I am preparing an order now"], hint:"Now = present continuous.", exp:"I am preparing an order now."},
      {level:"medium", q:"yesterday / I / prepare / an order", answers:["I prepared an order yesterday"], hint:"Yesterday = past simple.", exp:"I prepared an order yesterday."},
      {level:"medium", q:"yesterday at 10 / I / prepare / an order", answers:["I was preparing an order yesterday at 10"], hint:"At that moment in the past = past continuous.", exp:"I was preparing an order yesterday at 10."},
      {level:"hard", q:"I / prepare / order / when / wife / call", answers:["I was preparing the order when my wife called","I was preparing an order when my wife called"], hint:"Long action = was preparing. Short action = called.", exp:"I was preparing the order when my wife called."}
    ]
  },
  integrated1: {
    title: "Exercise 8 · Integrated precision challenge",
    intro: "Articles, pronouns and tenses are mixed together now.",
    items: [
      {level:"easy", q:"Choose the best sentence.", options:["I received an order. The order is for three passengers.","I received the order. A order is for three passengers.","I received order. The order is for three passengers."], correct:"I received an order. The order is for three passengers.", hint:"First mention, then second mention.", exp:"Use an order first, then the order."},
      {level:"easy", q:"Choose the best sentence.", options:["My daughter and I are visiting a house tomorrow.","My daughter and me are visiting a house tomorrow.","Me and my daughter are visiting the house tomorrow."], correct:"My daughter and I are visiting a house tomorrow.", hint:"Compound subject.", exp:"Use My daughter and I as the subject."},
      {level:"medium", q:"Choose the correct sequence.", options:["Yesterday, they sent us the order, and today we are checking the labels.","Yesterday, they send us the order, and today we checked the labels now.","Yesterday, they sent we the order, and today us are checking the labels."], correct:"Yesterday, they sent us the order, and today we are checking the labels.", hint:"Yesterday = past simple. Today now = present continuous.", exp:"Sent us is correct; are checking shows the action in progress now."},
      {level:"medium", q:"Choose the sentence with correct articles.", options:["Food safety is the most important detail.","The food safety is a most important detail.","A food safety is most important detail."], correct:"Food safety is the most important detail.", hint:"General uncountable + superlative.", exp:"No article with general food safety; the with most important."},
      {level:"hard", q:"Choose the best professional sentence.", options:["While I was preparing the order, the client called me to confirm the delivery point at the airport.","While I prepared an order, the client called I to confirm a delivery point to the airport.","While I was prepared the order, the client called myself to confirm delivery point."], correct:"While I was preparing the order, the client called me to confirm the delivery point at the airport.", hint:"Check tense, pronoun, article and preposition.", exp:"This sentence combines past continuous, object pronoun, the for specific point, and at for location."},
      {level:"hard", q:"Choose the correct sentence.", options:["I have prepared many orders, but this order is the most difficult this week.","I have prepared much orders, but this order is a most difficult this week.","I have preparing many orders, but this order is most difficult this week."], correct:"I have prepared many orders, but this order is the most difficult this week.", hint:"Many with plural countable nouns; the with superlative.", exp:"Many orders + the most difficult."}
    ]
  }
};

function shuffle(arr){
  const copy = [...arr];
  for(let i=copy.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [copy[i],copy[j]] = [copy[j],copy[i]];
  }
  return copy;
}

function normalise(str){
  return (str || "").toLowerCase().replace(/[’']/g,"'").replace(/[.,!?]/g,"").replace(/\s+/g," ").trim();
}

function renderActivities(){
  $$(".activity").forEach(container => {
    const key = container.dataset.activity;
    const activity = activities[key];
    if(!activity) return;
    container.innerHTML = `<h3>${activity.title}</h3><p>${activity.intro}</p>`;
    activity.items.forEach((item, idx) => {
      const card = document.createElement("article");
      card.className = `exercise-card ${item.level}`;
      const level = item.level || "practice";
      if(activity.type === "typed"){
        card.innerHTML = `
          <div class="exercise-top"><p class="question">${idx+1}. ${item.q}</p><span class="level-pill">${level}</span></div>
          <div class="input-row"><input class="typed-answer" type="text" placeholder="Type your answer"><button class="btn small check-typed">Check</button></div>
          <button class="btn small show-hint">Hint</button><button class="btn small reveal-answer">Show answer</button>
          <div class="hint">${item.hint}</div>
          <div class="answer-reveal">Model: ${item.answers[0]}</div>
          <div class="feedback"></div>`;
        const input = $(".typed-answer", card);
        const feedback = $(".feedback", card);
        $(".check-typed", card).addEventListener("click", () => {
          const user = normalise(input.value);
          const accepted = item.answers.map(normalise);
          if(accepted.includes(user)){
            feedback.textContent = `✅ Correct. ${item.exp}`;
            feedback.className = "feedback good";
          } else {
            feedback.textContent = "Almost. Check the hint or show the model answer.";
            feedback.className = "feedback bad";
          }
        });
      } else {
        const name = `${key}-${idx}-${Math.random().toString(36).slice(2)}`;
        const shuffled = shuffle(item.options);
        card.innerHTML = `
          <div class="exercise-top"><p class="question">${idx+1}. ${item.q}</p><span class="level-pill">${level}</span></div>
          <div class="options">
            ${shuffled.map(opt => `<label class="option"><input type="radio" name="${name}" value="${escapeHtml(opt)}"><span>${opt}</span></label>`).join("")}
          </div>
          <button class="btn small check-mc">Check</button><button class="btn small show-hint">Hint</button>
          <div class="hint">${item.hint}</div>
          <div class="feedback"></div>`;
        const feedback = $(".feedback", card);
        $(".check-mc", card).addEventListener("click", () => {
          const checked = $(`input[name="${name}"]:checked`, card);
          if(!checked){ feedback.textContent = "Choose an answer first."; feedback.className="feedback bad"; return; }
          if(checked.value === item.correct){
            feedback.textContent = `✅ Correct. ${item.exp}`;
            feedback.className = "feedback good";
          } else {
            feedback.textContent = `Try again. Hint: ${item.hint}`;
            feedback.className = "feedback bad";
          }
        });
      }
      $(".show-hint", card)?.addEventListener("click", () => $(".hint", card).classList.toggle("visible"));
      $(".reveal-answer", card)?.addEventListener("click", () => $(".answer-reveal", card).classList.toggle("visible"));
      container.appendChild(card);
    });
  });
}

function escapeHtml(str){
  return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function speakText(text){
  if(!('speechSynthesis' in window)) return alert("Speech synthesis is not available in this browser.");
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = $("#voiceAccent")?.value || "en-GB";
  utterance.rate = .9;
  window.speechSynthesis.speak(utterance);
}

function collectTextareas(){
  return [
    ["Articles mini writing", $("#articleWriting")?.value],
    ["Writing lab scenario 1", $("#writingOne")?.value]
  ].filter(([,v]) => v && v.trim()).map(([title, value]) => `${title}\n${value.trim()}`).join("\n\n---\n\n");
}

function downloadFile(filename, content){
  const blob = new Blob([content], {type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function evaluationText(){
  const checked = $$("#evaluation .checklist input:checked").map(input => input.parentElement.textContent.trim()).join("\n- ");
  return `Évaluation de la séance\nDate: ${$("#evalDate")?.value || ""}\nConfiance: ${$("#evalConfidence")?.value || ""}\nObjectifs compris: ${$("#evalObjectives")?.value || ""}\nExercices utiles: ${$("#evalExercises")?.value || ""}\n\nCompétences cochées:\n${checked ? "- " + checked : ""}\n\nCommentaires:\n${$("#evalComments")?.value || ""}`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderActivities();

  $("#toggleFrench")?.addEventListener("click", () => {
    document.body.classList.toggle("show-fr");
    $("#toggleFrench").textContent = document.body.classList.contains("show-fr") ? "Hide French help" : "Show French help";
  });

  $$("[data-scroll]").forEach(btn => btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.scroll);
    target?.scrollIntoView({behavior:"smooth"});
  }));

  $$('[data-model]').forEach(btn => btn.addEventListener('click', () => {
    const model = document.getElementById(btn.dataset.model);
    model?.classList.toggle('visible');
  }));

  $$('[data-speak]').forEach(btn => btn.addEventListener('click', () => speakText(btn.dataset.speak)));
  $$('.prompt').forEach(btn => btn.addEventListener('dblclick', () => speakText(btn.textContent.trim())));

  $("#downloadWriting")?.addEventListener("click", () => {
    const content = collectTextareas() || "No writing has been added yet.";
    downloadFile("writing-practice.txt", content);
  });
  $("#copyWriting")?.addEventListener("click", async () => {
    const content = collectTextareas() || "No writing has been added yet.";
    try{ await navigator.clipboard.writeText(content); alert("Writing copied."); } catch { alert("Copy not available in this browser."); }
  });
  $("#copyEvaluation")?.addEventListener("click", async () => {
    try{ await navigator.clipboard.writeText(evaluationText()); alert("Evaluation copied."); } catch { alert("Copy not available in this browser."); }
  });
  $("#downloadEvaluation")?.addEventListener("click", () => downloadFile("evaluation-seance.txt", evaluationText()));

  // Set today's date when possible.
  const date = $("#evalDate");
  if(date && !date.value){ date.value = new Date().toISOString().slice(0,10); }
});
