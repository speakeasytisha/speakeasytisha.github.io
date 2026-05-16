(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  let voiceLang = "en-US";
  let score = { ok: 0, total: 0 };
  let quizIndex = 0;
  let scenarioIndex = 0;
  let dialogueIndex = -1;
  let builderIndex = 0;
  let builderAnswer = [];
  let timerId = null;
  let voices = [];

  const warmups = [
    {
      q: "Why are you going to Canada?",
      simple: "I’m going to Canada for holidays.",
      upgrade: "I’m going to Canada for holidays because I’d like to discover new places and practise my English.",
      tip: "Add because + reason."
    },
    {
      q: "How long are you going to stay?",
      simple: "I’m going to stay for two weeks.",
      upgrade: "I’m going to stay for about two weeks, so I need to plan my visits carefully.",
      tip: "Add so + consequence."
    },
    {
      q: "What are you going to visit?",
      simple: "I’m going to visit cities and nature.",
      upgrade: "I’m going to visit a few cities, but I’d also like to see lakes, forests, and beautiful landscapes.",
      tip: "Use but also to add variety."
    },
    {
      q: "What will you do if you get lost?",
      simple: "I will ask for help.",
      upgrade: "If I get lost, I’ll stay calm and ask someone, ‘Could you help me, please?’",
      tip: "Use If + present, will + verb."
    }
  ];

  const vocab = [
    {cat:"Airport & border", icon:"🛂", term:"purpose of your visit", fr:"le but de votre visite", def:"The reason why you are entering a country.", ex:"The purpose of my visit is tourism."},
    {cat:"Airport & border", icon:"🧳", term:"to declare", fr:"déclarer", def:"To officially say what you are bringing into a country.", ex:"I don’t have anything to declare."},
    {cat:"Airport & border", icon:"📄", term:"travel documents", fr:"documents de voyage", def:"Passport, booking confirmations, travel authorization, insurance, or other papers.", ex:"I have prepared my travel documents."},
    {cat:"Airport & border", icon:"🧾", term:"booking confirmation", fr:"confirmation de réservation", def:"A document or email that proves you reserved something.", ex:"Here is my hotel booking confirmation."},
    {cat:"Hotel", icon:"🏨", term:"reservation", fr:"réservation", def:"A room, table, seat, or service booked before arrival.", ex:"I have a reservation under the name Martin."},
    {cat:"Hotel", icon:"🔑", term:"key card", fr:"carte d’accès", def:"A card used to open a hotel room door.", ex:"My key card doesn’t work."},
    {cat:"Hotel", icon:"🛎️", term:"front desk", fr:"réception", def:"The place in a hotel where guests check in and ask for help.", ex:"Could I speak to someone at the front desk?"},
    {cat:"Hotel", icon:"🧼", term:"housekeeping", fr:"service de ménage", def:"The hotel team that cleans rooms and changes towels.", ex:"Could we have housekeeping tomorrow morning?"},
    {cat:"Directions & transport", icon:"🚌", term:"bus stop", fr:"arrêt de bus", def:"The place where you wait for a bus.", ex:"Could you tell me where the nearest bus stop is?"},
    {cat:"Directions & transport", icon:"🚇", term:"platform", fr:"quai", def:"The place where you wait for a train or metro.", ex:"Which platform do I need for downtown?"},
    {cat:"Directions & transport", icon:"🗺️", term:"directions", fr:"itinéraire / indications", def:"Information that tells you how to get somewhere.", ex:"Could you give me directions to the museum?"},
    {cat:"Directions & transport", icon:"⏱️", term:"How long does it take?", fr:"Combien de temps ça prend ?", def:"A question used to ask about travel time.", ex:"How long does it take to get to the city centre?"},
    {cat:"Restaurant & money", icon:"🍽️", term:"bill / check", fr:"addition", def:"The paper showing what you need to pay.", ex:"Could we have the bill, please?"},
    {cat:"Restaurant & money", icon:"💳", term:"tip", fr:"pourboire", def:"Extra money for service in restaurants, taxis, hotels, or tours.", ex:"Is the tip included?"},
    {cat:"Restaurant & money", icon:"🥜", term:"allergy", fr:"allergie", def:"A health reaction to a food or ingredient.", ex:"I have a nut allergy. Does this dish contain nuts?"},
    {cat:"Restaurant & money", icon:"🧾", term:"sales tax", fr:"taxe de vente", def:"Extra tax often added at payment, depending on the province.", ex:"Is sales tax included in the price?"},
    {cat:"Weather & clothes", icon:"🌧️", term:"rainy", fr:"pluvieux", def:"With rain.", ex:"It looks rainy, so I’ll take a waterproof jacket."},
    {cat:"Weather & clothes", icon:"🧥", term:"layers", fr:"couches de vêtements", def:"Several clothes worn together so you can adapt to the weather.", ex:"I’ll wear layers because the weather can change."},
    {cat:"Weather & clothes", icon:"🌡️", term:"degrees Celsius", fr:"degrés Celsius", def:"The temperature scale used in Canada and Europe.", ex:"It will be about twelve degrees Celsius tomorrow."},
    {cat:"Weather & clothes", icon:"🥾", term:"comfortable shoes", fr:"chaussures confortables", def:"Shoes that are good for walking.", ex:"I need comfortable shoes for sightseeing."},
    {cat:"Sightseeing & help", icon:"🏞️", term:"national park", fr:"parc national", def:"A protected natural area with rules for visitors.", ex:"I’d like to visit a national park."},
    {cat:"Sightseeing & help", icon:"🎟️", term:"entrance fee", fr:"prix d’entrée", def:"The price to enter a place or attraction.", ex:"How much is the entrance fee?"},
    {cat:"Sightseeing & help", icon:"ℹ️", term:"tourist office", fr:"office de tourisme", def:"A place where visitors get maps, advice, and local information.", ex:"Could you recommend an easy walk from the tourist office?"},
    {cat:"Sightseeing & help", icon:"🚨", term:"emergency", fr:"urgence", def:"A serious situation that needs immediate help.", ex:"In an emergency, I need to call for help immediately."}
  ];

  const quizzes = [
    {prompt:"You want the hotel receptionist to help you.", options:["Could you help me, please?","You help me now?","I want help."], answer:0, hint:"Could you + verb is polite and correct."},
    {prompt:"You want to ask about travel time.", options:["How many time to downtown?","How long does it take to get downtown?","How much long is downtown?"], answer:1, hint:"Use: How long does it take to + verb?"},
    {prompt:"You explain a hotel problem.", options:["My key card doesn’t work, so could you check it?","My key card no work because check it.","Key card problem. You repair."], answer:0, hint:"Problem + so + polite request."},
    {prompt:"You speak about a plan.", options:["I going to visit a museum.","I’m going to visit a museum.","I have going visit a museum."], answer:1, hint:"Be going to = am/is/are + going to + verb."},
    {prompt:"You say something is already prepared.", options:["I have booked my flight.","I have book my flight.","I booked have my flight."], answer:0, hint:"Present perfect = have + past participle."},
    {prompt:"You ask about payment at a restaurant.", options:["Is the tip included?","The tip included it is?","Included tip yes?"], answer:0, hint:"Use: Is + noun + past participle/adjective?"},
    {prompt:"You need someone to repeat more slowly.", options:["Repeat slow.","Could you repeat that more slowly, please?","Can you again slow this?"], answer:1, hint:"Polite request + adverb: more slowly."},
    {prompt:"You give a longer answer about Canada.", options:["I like Canada.","I’m looking forward to Canada because I love nature and I want to practise English.","Canada good for me."], answer:1, hint:"Add feeling + because + reason."}
  ];

  const scenarios = [
    {
      title:"At the airport border desk",
      level:"A2",
      goal:"Answer simple border questions clearly: purpose, duration, accommodation, and what you are bringing.",
      language:["The purpose of my visit is tourism.","I’m going to stay for about two weeks.","I have a hotel reservation.","I don’t have anything to declare."],
      followups:["Where are you staying?","How long will you stay?","Are you travelling alone?","What are you planning to visit?"],
      lines:[
        {speaker:"Teacher / Border officer", text:"Good afternoon. What is the purpose of your visit?", model:"Good afternoon. The purpose of my visit is tourism. I’m going to visit Canada for holidays."},
        {speaker:"Learner / Traveller", text:"Answer with purpose + one detail.", model:"The purpose of my visit is tourism. I’m going to visit a few cities and enjoy the nature."},
        {speaker:"Teacher / Border officer", text:"How long are you going to stay in Canada?", model:"I’m going to stay for about two weeks."},
        {speaker:"Learner / Traveller", text:"Answer with duration + accommodation.", model:"I’m going to stay for about two weeks. I have a hotel reservation for the first part of my trip."},
        {speaker:"Teacher / Border officer", text:"Do you have anything to declare?", model:"No, I don’t have anything to declare."},
        {speaker:"Learner / Traveller", text:"Answer politely and calmly.", model:"No, I don’t have anything to declare. Here are my travel documents if you need them."}
      ]
    },
    {
      title:"Hotel check-in + small problem",
      level:"A2",
      goal:"Check in, confirm a reservation, and explain a simple room problem politely.",
      language:["I have a reservation under the name…","Could I check in, please?","My key card doesn’t work.","Would it be possible to change rooms?"],
      followups:["What name is the reservation under?","How many nights are you staying?","What is the problem with the room?","What solution would you like?"],
      lines:[
        {speaker:"Teacher / Receptionist", text:"Good evening. How can I help you?", model:"Good evening. I have a reservation under the name Martin."},
        {speaker:"Learner / Guest", text:"Check in and give your name.", model:"Good evening. I have a reservation under the name Martin. Could I check in, please?"},
        {speaker:"Teacher / Receptionist", text:"Of course. How many nights are you staying?", model:"I’m staying for three nights."},
        {speaker:"Learner / Guest", text:"Answer with duration.", model:"I’m staying for three nights, from Monday to Thursday."},
        {speaker:"Teacher / Receptionist", text:"Is everything okay with the room?", model:"Actually, there is a small problem."},
        {speaker:"Learner / Guest", text:"Explain the problem + ask for help.", model:"Actually, my key card doesn’t work, so could you check it for me, please?"}
      ]
    },
    {
      title:"Restaurant + tip question",
      level:"A2",
      goal:"Order, ask about ingredients, ask for the bill, and handle the tip politely.",
      language:["I’d like…","Does this dish contain…?","Could we have the bill, please?","Is the tip included?"],
      followups:["What would you like to order?","Do you have any allergies?","How was the food?","How would you ask about the tip?"],
      lines:[
        {speaker:"Teacher / Server", text:"Hi. Are you ready to order?", model:"Yes, I’d like the grilled salmon, please."},
        {speaker:"Learner / Customer", text:"Order politely.", model:"Yes, I’d like the grilled salmon, please. Could I also have some water?"},
        {speaker:"Teacher / Server", text:"Of course. Anything else?", model:"Could you tell me if this dish contains nuts?"},
        {speaker:"Learner / Customer", text:"Ask about ingredients or allergies.", model:"Could you tell me if this dish contains nuts? I have a nut allergy."},
        {speaker:"Teacher / Server", text:"How was everything?", model:"It was very good, thank you."},
        {speaker:"Learner / Customer", text:"Ask for the bill and tip information.", model:"It was very good, thank you. Could we have the bill, please? And is the tip included?"}
      ]
    },
    {
      title:"Tourist office + rainy day plan",
      level:"A2+",
      goal:"Ask for recommendations and change plans because of the weather.",
      language:["Could you recommend…?","It’s raining, so…","I’d prefer an indoor activity.","How far is it from here?"],
      followups:["What kind of activity do you prefer?","Do you want something indoors or outdoors?","How much time do you have?","How far are you ready to walk?"],
      lines:[
        {speaker:"Teacher / Tourist office", text:"Hello. What are you looking for today?", model:"Hello. It’s raining, so I’m looking for an indoor activity."},
        {speaker:"Learner / Traveller", text:"Explain the weather problem.", model:"Hello. It’s raining, so I’m looking for an indoor activity for this afternoon."},
        {speaker:"Teacher / Tourist office", text:"What kind of activity do you like?", model:"I like museums, local food, and easy walks."},
        {speaker:"Learner / Traveller", text:"Give preferences.", model:"I like museums and local food. I’d prefer something not too expensive."},
        {speaker:"Teacher / Tourist office", text:"There is a museum ten minutes from here.", model:"Great. How far is it exactly, and how much is the entrance fee?"},
        {speaker:"Learner / Traveller", text:"Ask distance + price.", model:"Great. How far is it from here, and how much is the entrance fee?"}
      ]
    },
    {
      title:"Getting lost + asking for directions",
      level:"A2",
      goal:"Stay calm, ask for directions, and confirm the route.",
      language:["Excuse me, I’m lost.","Could you tell me how to get to…?","Do I need to take a bus?","So I go straight, then turn left?"],
      followups:["Where do you want to go?","What landmark can you see?","Do you prefer walking or public transport?","Can you repeat the directions?"],
      lines:[
        {speaker:"Teacher / Local person", text:"Hi. Are you okay?", model:"Excuse me, I’m a bit lost."},
        {speaker:"Learner / Traveller", text:"Say you are lost + destination.", model:"Excuse me, I’m a bit lost. I’m trying to get to the train station."},
        {speaker:"Teacher / Local person", text:"Sure. It’s about fifteen minutes on foot.", model:"Thank you. Do I go straight ahead?"},
        {speaker:"Learner / Traveller", text:"Ask for clear directions.", model:"Thank you. Could you tell me how to get there from here?"},
        {speaker:"Teacher / Local person", text:"Go straight, then turn left after the café.", model:"So I go straight, then turn left after the café?"},
        {speaker:"Learner / Traveller", text:"Repeat to confirm.", model:"So I go straight, then turn left after the café. Thank you very much."}
      ]
    }
  ];

  const upgrades = [
    {q:"What are you going to do in Canada?", weak:"I visit Canada.", strong:"I’m going to visit Canada for holidays. I’d like to discover both cities and nature because I enjoy travelling and taking photos.", structure:"Plan → detail → reason"},
    {q:"Have you prepared everything?", weak:"Yes, I prepare.", strong:"I have booked my flight and my hotel, but I still need to check my travel documents and the weather.", structure:"Prepared things → not prepared yet"},
    {q:"What will you do if the hotel has a problem?", weak:"I say problem.", strong:"If there is a problem with the room, I’ll go to the front desk and say, ‘Could you help me, please?’", structure:"If + problem → action → exact sentence"},
    {q:"What kind of activities do you prefer?", weak:"I like visit.", strong:"I prefer cultural visits and easy walks. I’d also like to see beautiful landscapes if the weather is good.", structure:"Preference → extra detail → condition"},
    {q:"How will you ask for directions?", weak:"Where station?", strong:"I’ll say, ‘Excuse me, could you tell me how to get to the train station, please?’ Then I’ll repeat the directions to check.", structure:"Polite question → strategy"},
    {q:"What will you do in a restaurant?", weak:"I eat and pay.", strong:"I’ll order politely, ask about ingredients if necessary, and then ask, ‘Could we have the bill, please? Is the tip included?’", structure:"Sequence → useful phrase"}
  ];

  const builders = [
    {title:"Ask for directions", prompt:"Build a polite question to find the tourist office.", sentence:"Could you tell me how to get to the tourist office please"},
    {title:"Hotel problem", prompt:"Explain that the key card does not work.", sentence:"My key card does not work so could you check it please"},
    {title:"Restaurant bill", prompt:"Ask for the bill and ask about the tip.", sentence:"Could we have the bill please and is the tip included"},
    {title:"Rainy day plan", prompt:"Ask for an indoor recommendation because it is raining.", sentence:"It is raining so could you recommend an indoor activity"},
    {title:"Canada plans", prompt:"Say what you are going to do in Canada.", sentence:"I am going to visit Canada because I love nature and beautiful landscapes"},
    {title:"Travel preparation", prompt:"Say what you have prepared and what you still need to check.", sentence:"I have booked my flight but I still need to check my documents"}
  ];

  const fillLines = [
    {before:"Traveller: Good evening. I have a ", answer:"reservation", after:" under the name Martin.", choices:["reservation","direction","bill"]},
    {before:"Receptionist: Of course. How many nights are you ", answer:"staying", after:"?", choices:["staying","going","taking"]},
    {before:"Traveller: I’m staying for three nights. Also, my ", answer:"key card", after:" doesn’t work.", choices:["bill","key card","platform"]},
    {before:"Receptionist: I’m sorry about that. I can check it for you. Anything else?", answer:"", after:"", choices:[]},
    {before:"Traveller: Yes, could you ", answer:"recommend", after:" a good restaurant near the hotel?", choices:["recommend","declare","include"]},
    {before:"Receptionist: Of course. There is a nice restaurant around the corner.", answer:"", after:"", choices:[]},
    {before:"Traveller: Great. How long does it ", answer:"take", after:" to walk there?", choices:["take","make","stay"]}
  ];

  const chunks = [
    {title:"Polite opener", text:"Excuse me, could you help me, please?"},
    {title:"Repeat request", text:"Could you repeat that more slowly, please?"},
    {title:"Border answer", text:"The purpose of my visit is tourism."},
    {title:"Travel plan", text:"I’m going to visit cities and nature."},
    {title:"Prepared", text:"I have booked my flight and my hotel."},
    {title:"Problem + request", text:"My key card doesn’t work, so could you check it, please?"},
    {title:"Direction check", text:"So I go straight, then turn left after the café?"},
    {title:"Weather change", text:"It’s raining, so I’d prefer an indoor activity."},
    {title:"Closing sentence", text:"Thank you very much. That’s very helpful."}
  ];

  function escapeHTML(str){
    return String(str).replace(/[&<>'"]/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[s]));
  }

  function updateScore(){
    const el = $("#scoreText");
    if(el) el.textContent = `${score.ok} / ${score.total}`;
  }

  function addScore(ok){
    score.total += 1;
    if(ok) score.ok += 1;
    updateScore();
  }

  function loadVoices(){
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }

  function getVoice(lang){
    loadVoices();
    const exact = voices.find(v => v.lang === lang);
    if(exact) return exact;
    const close = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang.slice(0,2).toLowerCase()));
    return close || null;
  }

  function speak(text){
    if(!("speechSynthesis" in window)) return;
    const clean = String(text || "").replace(/\s+/g," ").trim();
    if(!clean) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = voiceLang;
    const selected = getVoice(voiceLang);
    if(selected) utter.voice = selected;
    utter.rate = 0.88;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }

  function shuffle(arr){
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function renderWarmups(){
    const grid = $("#warmupGrid");
    if(!grid) return;
    grid.innerHTML = warmups.map((w,i)=>`
      <article class="warm-card">
        <h3>${escapeHTML(w.q)}</h3>
        <div class="upgrade-line"><strong>First answer:</strong><br>${escapeHTML(w.simple)}</div>
        <div class="upgrade-line"><strong>Upgrade:</strong><br>${escapeHTML(w.upgrade)}</div>
        <p class="fr">Teacher tip: ${escapeHTML(w.tip)}</p>
        <div class="inline-actions">
          <button class="mini-listen" type="button" data-say="${escapeHTML(w.q + ' ' + w.upgrade)}">🔊 Listen</button>
          <button class="secondary warm-score" type="button" data-index="${i}">I can say it ✅</button>
        </div>
      </article>
    `).join("");
  }

  function renderVocabFilters(){
    const cats = ["All", ...Array.from(new Set(vocab.map(v=>v.cat)))];
    const row = $("#vocabFilters");
    if(!row) return;
    row.innerHTML = cats.map((c,i)=>`<button type="button" class="filter-chip ${i===0?'active':''}" data-cat="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join("");
  }

  function renderVocab(cat="All"){
    const grid = $("#vocabGrid");
    if(!grid) return;
    const list = cat === "All" ? vocab : vocab.filter(v => v.cat === cat);
    grid.innerHTML = list.map(v=>`
      <article class="vocab-card">
        <div class="icon" aria-hidden="true">${v.icon}</div>
        <span class="category">${escapeHTML(v.cat)}</span>
        <h3>${escapeHTML(v.term)}</h3>
        <p class="fr">FR: ${escapeHTML(v.fr)}</p>
        <p>${escapeHTML(v.def)}</p>
        <p class="example">${escapeHTML(v.ex)}</p>
        <button class="mini-listen" type="button" data-say="${escapeHTML(v.term + '. ' + v.ex)}">🔊 Listen</button>
      </article>
    `).join("");
  }

  function renderQuiz(){
    const q = quizzes[quizIndex % quizzes.length];
    const box = $("#quizBox");
    if(!box) return;
    box.innerHTML = `
      <div class="question">${escapeHTML(q.prompt)}</div>
      <div class="options">
        ${q.options.map((opt,i)=>`<button type="button" class="option-btn" data-option="${i}">${escapeHTML(opt)}</button>`).join("")}
      </div>
      <p class="feedback" id="quizFeedback"></p>
    `;
  }

  function renderScenarioSelect(){
    const select = $("#scenarioSelect");
    if(!select) return;
    select.innerHTML = scenarios.map((s,i)=>`<option value="${i}">${escapeHTML(s.title)}</option>`).join("");
  }

  function renderScenario(){
    const sc = scenarios[scenarioIndex];
    $("#scenarioLevel").textContent = sc.level;
    $("#scenarioTitle").textContent = sc.title;
    $("#scenarioGoal").textContent = sc.goal;
    $("#scenarioLanguage").innerHTML = sc.language.map(x=>`<li>${escapeHTML(x)}</li>`).join("");
    $("#scenarioFollowups").innerHTML = sc.followups.map(x=>`<li>${escapeHTML(x)}</li>`).join("");
    dialogueIndex = -1;
    $("#dialogueCard").className = "dialogue-card";
    $("#dialogueCard").innerHTML = `<span class="speaker">Ready</span><p>Click Start. Try without the model first.</p>`;
    $("#modelBox").classList.add("hidden");
    $("#modelBox").innerHTML = "";
  }

  function showDialogueLine(){
    const sc = scenarios[scenarioIndex];
    if(dialogueIndex < 0) dialogueIndex = 0;
    if(dialogueIndex >= sc.lines.length) dialogueIndex = 0;
    const line = sc.lines[dialogueIndex];
    const card = $("#dialogueCard");
    const isTeacher = line.speaker.toLowerCase().includes("teacher") || line.speaker.toLowerCase().includes("officer") || line.speaker.toLowerCase().includes("receptionist") || line.speaker.toLowerCase().includes("server");
    card.className = `dialogue-card ${isTeacher ? 'teacher' : 'learner'}`;
    card.innerHTML = `<span class="speaker">${escapeHTML(line.speaker)}</span><p>${escapeHTML(line.text)}</p><small>Line ${dialogueIndex+1} / ${sc.lines.length}</small>`;
    $("#modelBox").classList.add("hidden");
    $("#modelBox").innerHTML = "";
  }

  function renderUpgrades(){
    const grid = $("#upgradeGrid");
    if(!grid) return;
    grid.innerHTML = upgrades.map((u,i)=>`
      <article class="upgrade-card">
        <h3>${escapeHTML(u.q)}</h3>
        <div class="answer-compare">
          <div class="weak"><strong>Too short:</strong><br>${escapeHTML(u.weak)}</div>
          <div class="strong"><strong>Stronger:</strong><br>${escapeHTML(u.strong)}</div>
        </div>
        <p class="fr">Structure: ${escapeHTML(u.structure)}</p>
        <div class="inline-actions">
          <button class="mini-listen" type="button" data-say="${escapeHTML(u.strong)}">🔊 Listen</button>
          <button class="secondary upgrade-score" type="button" data-index="${i}">I can upgrade it ✅</button>
        </div>
      </article>
    `).join("");
  }

  function renderBuilderSelect(){
    const select = $("#builderSelect");
    if(!select) return;
    select.innerHTML = builders.map((b,i)=>`<option value="${i}">${escapeHTML(b.title)}</option>`).join("");
  }

  function renderBuilder(){
    const task = builders[builderIndex];
    builderAnswer = [];
    $("#builderPrompt").textContent = task.prompt;
    const words = shuffle(task.sentence.split(" "));
    $("#wordBank").innerHTML = words.map((word,i)=>`<button type="button" class="word-chip" data-word="${escapeHTML(word)}" data-id="${i}">${escapeHTML(word)}</button>`).join("");
    $("#answerZone").innerHTML = "";
    $("#builderFeedback").textContent = "";
    $("#builderFeedback").className = "feedback";
  }

  function updateAnswerZone(){
    $("#answerZone").innerHTML = builderAnswer.map(w=>`<span class="answer-chip">${escapeHTML(w)}</span>`).join("");
  }

  function renderFill(){
    const box = $("#fillBox");
    if(!box) return;
    box.innerHTML = fillLines.map((line,i)=>{
      if(!line.answer) return `<div class="fill-line">${escapeHTML(line.before)}</div>`;
      const opts = [`<option value="">Choose…</option>`, ...line.choices.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`)].join("");
      return `<div class="fill-line">${escapeHTML(line.before)} <select data-fill="${i}">${opts}</select> ${escapeHTML(line.after)}</div>`;
    }).join("");
  }

  function completedFillText(){
    return fillLines.map((line,i)=>{
      if(!line.answer) return line.before;
      const select = $(`[data-fill="${i}"]`);
      const val = select && select.value ? select.value : line.answer;
      return line.before + val + line.after;
    }).join(" ");
  }

  function renderChunks(){
    const grid = $("#chunkGrid");
    if(!grid) return;
    grid.innerHTML = chunks.map((c,i)=>`
      <article class="chunk-card">
        <h3>${escapeHTML(c.title)}</h3>
        <p class="chunk-text">${escapeHTML(c.text)}</p>
        <div class="inline-actions">
          <button class="mini-listen" type="button" data-say="${escapeHTML(c.text)}">🔊 Listen</button>
          <button class="secondary chunk-score" type="button" data-index="${i}">Clear ✅</button>
        </div>
      </article>
    `).join("");
  }

  function startTimer(seconds){
    clearInterval(timerId);
    let left = seconds;
    const display = $("#timerDisplay");
    display.textContent = `${left}s`;
    timerId = setInterval(()=>{
      left -= 1;
      display.textContent = `${left}s`;
      if(left <= 0){
        clearInterval(timerId);
        display.textContent = "Time!";
        speak("Time. Well done. Now answer one follow-up question.");
      }
    },1000);
  }

  function bindEvents(){
    document.addEventListener("click", (e)=>{
      const sayBtn = e.target.closest("[data-say]");
      if(sayBtn){ speak(sayBtn.getAttribute("data-say")); return; }

      const voiceBtn = e.target.closest("[data-voice]");
      if(voiceBtn){
        voiceLang = voiceBtn.getAttribute("data-voice");
        $$('[data-voice]').forEach(b=>b.classList.toggle('active', b === voiceBtn));
        speak(voiceLang === "en-US" ? "American English voice selected." : "British English voice selected.");
        return;
      }

      const filter = e.target.closest(".filter-chip");
      if(filter){
        $$(".filter-chip").forEach(b=>b.classList.remove("active"));
        filter.classList.add("active");
        renderVocab(filter.dataset.cat);
        return;
      }

      const option = e.target.closest(".option-btn");
      if(option){
        const q = quizzes[quizIndex % quizzes.length];
        const chosen = Number(option.dataset.option);
        const correct = chosen === q.answer;
        $$(".option-btn").forEach((b,i)=>{
          b.disabled = true;
          if(i === q.answer) b.classList.add("correct");
          if(i === chosen && !correct) b.classList.add("wrong");
        });
        const fb = $("#quizFeedback");
        fb.className = `feedback ${correct ? 'good' : 'bad'}`;
        fb.textContent = correct ? "Correct. Now say it aloud." : `Not yet. ${q.hint}`;
        addScore(correct);
        return;
      }

      const word = e.target.closest(".word-chip");
      if(word){
        builderAnswer.push(word.dataset.word);
        word.disabled = true;
        updateAnswerZone();
        return;
      }

      const simpleScore = e.target.closest(".warm-score,.upgrade-score,.chunk-score");
      if(simpleScore){
        simpleScore.disabled = true;
        simpleScore.textContent = "Scored ✅";
        addScore(true);
        return;
      }

      const timerBtn = e.target.closest("[data-timer]");
      if(timerBtn){ startTimer(Number(timerBtn.dataset.timer)); return; }
    });

    $("#pauseAudio")?.addEventListener("click", ()=>window.speechSynthesis?.pause());
    $("#resumeAudio")?.addEventListener("click", ()=>window.speechSynthesis?.resume());
    $("#stopAudio")?.addEventListener("click", ()=>window.speechSynthesis?.cancel());
    $("#resetAll")?.addEventListener("click", ()=>{
      score = {ok:0,total:0}; updateScore();
      renderWarmups(); renderVocabFilters(); renderVocab(); renderQuiz(); renderScenario(); renderUpgrades(); renderBuilder(); renderFill(); renderChunks();
      $$("button:disabled").forEach(b=>{ b.disabled=false; });
      speak("The lesson has been reset.");
    });

    $("#newQuiz")?.addEventListener("click", ()=>{ quizIndex = (quizIndex + 1) % quizzes.length; renderQuiz(); });
    $("#listenQuiz")?.addEventListener("click", ()=>{ const q = quizzes[quizIndex % quizzes.length]; speak(q.prompt); });

    $("#scenarioSelect")?.addEventListener("change", (e)=>{ scenarioIndex = Number(e.target.value); renderScenario(); });
    $("#listenScenario")?.addEventListener("click", ()=>{ const sc = scenarios[scenarioIndex]; speak(`${sc.title}. ${sc.goal}. Useful language: ${sc.language.join('. ')}`); });
    $("#resetScenario")?.addEventListener("click", renderScenario);
    $("#startRoleplay")?.addEventListener("click", ()=>{ dialogueIndex = 0; showDialogueLine(); });
    $("#nextLine")?.addEventListener("click", ()=>{ dialogueIndex += 1; showDialogueLine(); });
    $("#listenLine")?.addEventListener("click", ()=>{
      const sc = scenarios[scenarioIndex];
      const line = sc.lines[Math.max(0, dialogueIndex)];
      speak(line ? line.text : sc.goal);
    });
    $("#showModel")?.addEventListener("click", ()=>{
      const sc = scenarios[scenarioIndex];
      const line = sc.lines[Math.max(0, dialogueIndex)];
      if(!line) return;
      const box = $("#modelBox");
      box.classList.remove("hidden");
      box.innerHTML = `<strong>Model reply:</strong><p>${escapeHTML(line.model)}</p><button class="mini-listen" type="button" data-say="${escapeHTML(line.model)}">🔊 Listen model</button>`;
    });

    $("#builderSelect")?.addEventListener("change", (e)=>{ builderIndex = Number(e.target.value); renderBuilder(); });
    $("#resetBuilder")?.addEventListener("click", renderBuilder);
    $("#undoBuilder")?.addEventListener("click", ()=>{
      const last = builderAnswer.pop();
      if(last){
        const disabled = $$(".word-chip:disabled").reverse().find(b => b.dataset.word === last);
        if(disabled) disabled.disabled = false;
        updateAnswerZone();
      }
    });
    $("#checkBuilder")?.addEventListener("click", ()=>{
      const target = builders[builderIndex].sentence;
      const attempt = builderAnswer.join(" ");
      const ok = attempt === target;
      const fb = $("#builderFeedback");
      fb.className = `feedback ${ok ? 'good' : 'bad'}`;
      fb.textContent = ok ? "Correct. Now say it aloud with natural pauses." : `Not yet. Target: ${target}`;
      addScore(ok);
    });
    $("#listenBuilderModel")?.addEventListener("click", ()=>speak(builders[builderIndex].sentence));
    $("#speakMySentence")?.addEventListener("click", ()=>speak(builderAnswer.join(" ")));

    $("#checkFill")?.addEventListener("click", ()=>{
      let ok = true; let total = 0; let good = 0;
      fillLines.forEach((line,i)=>{
        if(!line.answer) return;
        total += 1;
        const select = $(`[data-fill="${i}"]`);
        const correct = select.value === line.answer;
        select.style.borderColor = correct ? "#4a9d63" : "#d26464";
        if(correct) good += 1; else ok = false;
      });
      const fb = $("#fillFeedback");
      fb.className = `feedback ${ok ? 'good' : 'bad'}`;
      fb.textContent = ok ? `Perfect: ${good}/${total}. Now read the dialogue aloud.` : `${good}/${total}. Check the red boxes, then try again.`;
      score.total += total; score.ok += good; updateScore();
    });
    $("#resetFill")?.addEventListener("click", ()=>{ renderFill(); $("#fillFeedback").textContent = ""; });
    $("#listenFill")?.addEventListener("click", ()=>speak(completedFillText()));

    $("#showFinalModels")?.addEventListener("click", ()=>$("#finalModels").classList.toggle("hidden"));
    $("#stopTimer")?.addEventListener("click", ()=>{ clearInterval(timerId); $("#timerDisplay").textContent = "Stopped"; });
  }

  function init(){
    if("speechSynthesis" in window){
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    renderWarmups();
    renderVocabFilters();
    renderVocab();
    renderQuiz();
    renderScenarioSelect();
    renderScenario();
    renderUpgrades();
    renderBuilderSelect();
    renderBuilder();
    renderFill();
    renderChunks();
    bindEvents();
    updateScore();
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
