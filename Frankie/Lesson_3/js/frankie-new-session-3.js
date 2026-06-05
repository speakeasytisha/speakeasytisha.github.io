(function(){
  "use strict";
  var $ = function(sel){ return document.querySelector(sel); };
  var $$ = function(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); };
  var selectedVoice = "en-US";
  var voices = [];
  var selectedGoal = "ask for help";

  var categoryLabels = {
    airport:"Airport",
    transport:"Transport",
    hotel:"Hotel",
    restaurant:"Restaurant / café",
    questions:"Useful questions",
    problems:"Problems and help",
    moneyTime:"Money and time",
    connectors:"Connectors"
  };

  var vocab = [
    {cat:"airport", icon:"🛫", en:"airport", fr:"aéroport", def:"A place where planes arrive and leave.", ex:"I am at the airport."},
    {cat:"airport", icon:"🎫", en:"boarding pass", fr:"carte d’embarquement", def:"The document you need to get on a plane.", ex:"Here is my boarding pass."},
    {cat:"airport", icon:"🧳", en:"luggage", fr:"bagages", def:"Your bags and suitcases.", ex:"I have one piece of luggage."},
    {cat:"airport", icon:"🚪", en:"gate", fr:"porte d’embarquement", def:"The place where you wait before boarding.", ex:"Where is gate 12, please?"},
    {cat:"airport", icon:"🛂", en:"passport control", fr:"contrôle des passeports", def:"The place where someone checks your passport.", ex:"Passport control is after security."},
    {cat:"airport", icon:"🔐", en:"security", fr:"sécurité", def:"The place where bags and people are checked.", ex:"Security is on the left."},
    {cat:"airport", icon:"📢", en:"announcement", fr:"annonce", def:"Information you hear in a public place.", ex:"I don’t understand the announcement."},
    {cat:"airport", icon:"⏰", en:"delay", fr:"retard", def:"When something is later than planned.", ex:"There is a delay."},

    {cat:"transport", icon:"🚕", en:"taxi rank", fr:"station de taxis", def:"The place where taxis wait.", ex:"Where is the taxi rank, please?"},
    {cat:"transport", icon:"🚌", en:"bus stop", fr:"arrêt de bus", def:"The place where the bus stops.", ex:"The bus stop is near the hotel."},
    {cat:"transport", icon:"🚉", en:"train station", fr:"gare", def:"A place where trains arrive and leave.", ex:"I need to go to the train station."},
    {cat:"transport", icon:"🎟️", en:"ticket", fr:"billet", def:"A document that lets you travel or enter somewhere.", ex:"I would like a ticket, please."},
    {cat:"transport", icon:"↩️", en:"return ticket", fr:"aller-retour", def:"A ticket to go and come back.", ex:"I would like a return ticket."},
    {cat:"transport", icon:"➡️", en:"one-way ticket", fr:"aller simple", def:"A ticket to go only one way.", ex:"I need a one-way ticket."},
    {cat:"transport", icon:"📍", en:"destination", fr:"destination", def:"The place you want to go to.", ex:"My destination is the hotel."},
    {cat:"transport", icon:"💶", en:"fare", fr:"tarif / prix du trajet", def:"The price for transport.", ex:"How much is the fare?"},

    {cat:"hotel", icon:"🏨", en:"hotel", fr:"hôtel", def:"A place where you sleep when you travel.", ex:"I have a reservation at the hotel."},
    {cat:"hotel", icon:"🛎️", en:"reception", fr:"réception", def:"The desk where you ask for help in a hotel.", ex:"Reception is open all day."},
    {cat:"hotel", icon:"✅", en:"check in", fr:"s’enregistrer / arriver à l’hôtel", def:"To arrive and give your information at a hotel.", ex:"I would like to check in, please."},
    {cat:"hotel", icon:"🚪", en:"room", fr:"chambre", def:"The place where you sleep in a hotel.", ex:"My room is on the second floor."},
    {cat:"hotel", icon:"🗝️", en:"key card", fr:"carte-clé", def:"A card to open your room door.", ex:"Here is your key card."},
    {cat:"hotel", icon:"📶", en:"Wi-Fi password", fr:"mot de passe Wi-Fi", def:"The code to use the Internet.", ex:"Can I have the Wi-Fi password, please?"},
    {cat:"hotel", icon:"☕", en:"breakfast", fr:"petit-déjeuner", def:"The first meal of the day.", ex:"What time is breakfast?"},
    {cat:"hotel", icon:"🔕", en:"quiet room", fr:"chambre calme", def:"A room with little noise.", ex:"I would like a quiet room, please."},

    {cat:"restaurant", icon:"🍽️", en:"menu", fr:"menu / carte", def:"The list of food and drinks.", ex:"Can I have the menu, please?"},
    {cat:"restaurant", icon:"💧", en:"still water", fr:"eau plate", def:"Water without bubbles.", ex:"I would like still water, please."},
    {cat:"restaurant", icon:"🫧", en:"sparkling water", fr:"eau gazeuse", def:"Water with bubbles.", ex:"Do you have sparkling water?"},
    {cat:"restaurant", icon:"🥗", en:"starter", fr:"entrée", def:"The first part of a meal.", ex:"I would like a salad as a starter."},
    {cat:"restaurant", icon:"🍗", en:"main course", fr:"plat principal", def:"The biggest part of a meal.", ex:"For the main course, I would like chicken."},
    {cat:"restaurant", icon:"🍰", en:"dessert", fr:"dessert", def:"Sweet food at the end of a meal.", ex:"Can I see the dessert menu?"},
    {cat:"restaurant", icon:"🧾", en:"bill", fr:"addition", def:"The paper with the price to pay.", ex:"Can I have the bill, please?"},
    {cat:"restaurant", icon:"💳", en:"pay by card", fr:"payer par carte", def:"To pay with a bank card.", ex:"Can I pay by card?"},

    {cat:"questions", icon:"🙏", en:"Could you help me, please?", fr:"Pourriez-vous m’aider, s’il vous plaît ?", def:"A polite way to ask for help.", ex:"Excuse me, could you help me, please?"},
    {cat:"questions", icon:"🔁", en:"Could you repeat, please?", fr:"Pourriez-vous répéter, s’il vous plaît ?", def:"Use it when you need to hear again.", ex:"Sorry, could you repeat, please?"},
    {cat:"questions", icon:"🐢", en:"Could you speak more slowly?", fr:"Pourriez-vous parler plus lentement ?", def:"Use it when the person speaks too fast.", ex:"Could you speak more slowly, please?"},
    {cat:"questions", icon:"📍", en:"Where is…?", fr:"Où est… ?", def:"Use it to ask for a place.", ex:"Where is the taxi rank, please?"},
    {cat:"questions", icon:"⏰", en:"What time is…?", fr:"À quelle heure est… ?", def:"Use it to ask for a time.", ex:"What time is breakfast?"},
    {cat:"questions", icon:"💶", en:"How much is it?", fr:"Combien ça coûte ?", def:"Use it to ask for the price.", ex:"How much is it, please?"},
    {cat:"questions", icon:"✅", en:"Can I…?", fr:"Puis-je… ? / Est-ce que je peux… ?", def:"Use it to ask permission or make a simple request.", ex:"Can I pay by card?"},
    {cat:"questions", icon:"💬", en:"Do you have…?", fr:"Avez-vous… ?", def:"Use it to ask if something is available.", ex:"Do you have a table for two?"},

    {cat:"problems", icon:"❌", en:"I don’t understand.", fr:"Je ne comprends pas.", def:"Use it when something is not clear.", ex:"Sorry, I don’t understand."},
    {cat:"problems", icon:"🧩", en:"I don’t understand this word.", fr:"Je ne comprends pas ce mot.", def:"Use it when one word is difficult.", ex:"I don’t understand this word. Can you explain?"},
    {cat:"problems", icon:"😟", en:"There is a problem.", fr:"Il y a un problème.", def:"Use it to explain a difficulty.", ex:"There is a problem with my room."},
    {cat:"problems", icon:"🔍", en:"I can’t find…", fr:"Je n’arrive pas à trouver…", def:"Use it when you are looking for something.", ex:"I can’t find my gate."},
    {cat:"problems", icon:"🕒", en:"I am late.", fr:"Je suis en retard.", def:"Use it when you are not on time.", ex:"I am late for my train."},
    {cat:"problems", icon:"😕", en:"I am lost.", fr:"Je suis perdue.", def:"Use it when you don’t know where you are.", ex:"Excuse me, I am lost."},
    {cat:"problems", icon:"⏳", en:"Let me think.", fr:"Laissez-moi réfléchir.", def:"Use it to take time before answering.", ex:"Let me think. I need a taxi."},
    {cat:"problems", icon:"🤔", en:"I’m not sure.", fr:"Je ne suis pas sûre.", def:"Use it when you are uncertain.", ex:"I’m not sure. Can you help me?"},

    {cat:"moneyTime", icon:"💶", en:"cash", fr:"espèces", def:"Money in coins or notes.", ex:"Can I pay in cash?"},
    {cat:"moneyTime", icon:"💳", en:"card", fr:"carte bancaire", def:"A bank card used to pay.", ex:"I would like to pay by card."},
    {cat:"moneyTime", icon:"🧾", en:"receipt", fr:"ticket de caisse / reçu", def:"A paper showing what you paid.", ex:"Can I have a receipt, please?"},
    {cat:"moneyTime", icon:"🕓", en:"at four p.m.", fr:"à 16h", def:"Use at for a precise time.", ex:"I arrive at four p.m."},
    {cat:"moneyTime", icon:"📅", en:"on Friday", fr:"vendredi", def:"Use on for days.", ex:"I arrive on Friday."},
    {cat:"moneyTime", icon:"🌅", en:"in the morning", fr:"le matin", def:"Use in for parts of the day.", ex:"I leave in the morning."},

    {cat:"connectors", icon:"1️⃣", en:"first", fr:"d’abord", def:"Use it for the first action.", ex:"First, I go to the airport."},
    {cat:"connectors", icon:"➡️", en:"then", fr:"ensuite", def:"Use it for the next action.", ex:"Then, I take a taxi."},
    {cat:"connectors", icon:"🔜", en:"after that", fr:"après cela", def:"Use it for another action later.", ex:"After that, I check in at the hotel."},
    {cat:"connectors", icon:"💬", en:"because", fr:"parce que", def:"Use it to give a reason.", ex:"I ask for help because I am lost."},
    {cat:"connectors", icon:"↔️", en:"but", fr:"mais", def:"Use it to show contrast.", ex:"I understand the sentence, but not the word."},
    {cat:"connectors", icon:"✨", en:"so", fr:"donc / alors", def:"Use it to show a result.", ex:"I am tired, so I take a taxi."}
  ];

  var models = {
    airport:[
      {tag:"ask for place", en:"Excuse me, where is gate 12, please?", fr:"Excusez-moi, où est la porte 12, s’il vous plaît ?"},
      {tag:"ask for help", en:"Could you help me, please? I can’t find my gate.", fr:"Pourriez-vous m’aider ? Je ne trouve pas ma porte."},
      {tag:"not understand", en:"Sorry, I don’t understand the announcement.", fr:"Désolée, je ne comprends pas l’annonce."},
      {tag:"delay", en:"Is there a delay?", fr:"Y a-t-il un retard ?"},
      {tag:"luggage", en:"Where can I collect my luggage?", fr:"Où puis-je récupérer mes bagages ?"},
      {tag:"repeat", en:"Could you repeat more slowly, please?", fr:"Pourriez-vous répéter plus lentement, s’il vous plaît ?"}
    ],
    taxi:[
      {tag:"destination", en:"I would like to go to this hotel, please.", fr:"Je voudrais aller à cet hôtel, s’il vous plaît."},
      {tag:"price", en:"How much is it to the city centre?", fr:"Combien coûte le trajet jusqu’au centre-ville ?"},
      {tag:"card", en:"Can I pay by card?", fr:"Puis-je payer par carte ?"},
      {tag:"address", en:"Here is the address.", fr:"Voici l’adresse."},
      {tag:"time", en:"How long does it take?", fr:"Combien de temps cela prend-il ?"},
      {tag:"thanks", en:"Thank you. Have a nice day.", fr:"Merci. Bonne journée."}
    ],
    hotel:[
      {tag:"check in", en:"Good afternoon. I would like to check in, please.", fr:"Bonjour. Je voudrais m’enregistrer, s’il vous plaît."},
      {tag:"reservation", en:"I have a reservation in the name of Dumarquez.", fr:"J’ai une réservation au nom de Dumarquez."},
      {tag:"request", en:"I would like a quiet room, please.", fr:"Je voudrais une chambre calme, s’il vous plaît."},
      {tag:"breakfast", en:"What time is breakfast?", fr:"À quelle heure est le petit-déjeuner ?"},
      {tag:"Wi-Fi", en:"Can I have the Wi-Fi password, please?", fr:"Puis-je avoir le mot de passe Wi-Fi, s’il vous plaît ?"},
      {tag:"problem", en:"There is a problem with my room.", fr:"Il y a un problème avec ma chambre."}
    ],
    restaurant:[
      {tag:"table", en:"Do you have a table for two, please?", fr:"Avez-vous une table pour deux, s’il vous plaît ?"},
      {tag:"menu", en:"Can I have the menu, please?", fr:"Puis-je avoir la carte, s’il vous plaît ?"},
      {tag:"order", en:"I would like the chicken, please.", fr:"Je voudrais le poulet, s’il vous plaît."},
      {tag:"water", en:"I would like still water, please.", fr:"Je voudrais de l’eau plate, s’il vous plaît."},
      {tag:"bill", en:"Can I have the bill, please?", fr:"Puis-je avoir l’addition, s’il vous plaît ?"},
      {tag:"pay", en:"Can I pay by card?", fr:"Puis-je payer par carte ?"}
    ],
    help:[
      {tag:"general", en:"Excuse me, could you help me, please?", fr:"Excusez-moi, pourriez-vous m’aider, s’il vous plaît ?"},
      {tag:"repeat", en:"Could you repeat, please?", fr:"Pourriez-vous répéter, s’il vous plaît ?"},
      {tag:"slowly", en:"Could you speak more slowly, please?", fr:"Pourriez-vous parler plus lentement, s’il vous plaît ?"},
      {tag:"word", en:"I don’t understand this word.", fr:"Je ne comprends pas ce mot."},
      {tag:"think", en:"Let me think, please.", fr:"Laissez-moi réfléchir, s’il vous plaît."},
      {tag:"confirm", en:"Do you mean the hotel is on the left?", fr:"Vous voulez dire que l’hôtel est à gauche ?"}
    ],
    problem:[
      {tag:"lost", en:"Excuse me, I am lost.", fr:"Excusez-moi, je suis perdue."},
      {tag:"find", en:"I can’t find the train station.", fr:"Je n’arrive pas à trouver la gare."},
      {tag:"room", en:"There is a problem with my room.", fr:"Il y a un problème avec ma chambre."},
      {tag:"late", en:"I am late for my train.", fr:"Je suis en retard pour mon train."},
      {tag:"not sure", en:"I’m not sure. Could you help me?", fr:"Je ne suis pas sûre. Pourriez-vous m’aider ?"},
      {tag:"solution", en:"What can I do?", fr:"Que puis-je faire ?"}
    ]
  };

  var meaningQuiz = [
    {situation:"You want a hotel room.", answer:"I would like a room, please.", options:["I would like a room, please.","I am a room, please.","I room please."]},
    {situation:"You need the person to say it again.", answer:"Could you repeat, please?", options:["Could you repeat, please?","Can I repeat you?","You repeat me?"]},
    {situation:"You want to pay with your bank card.", answer:"Can I pay by card?", options:["Can I pay by card?","Can I card pay?","I can by card pay?"]},
    {situation:"You are in a taxi and want to go to your hotel.", answer:"I would like to go to the hotel, please.", options:["I would like to go to the hotel, please.","I would like going hotel.","I am hotel go, please."]},
    {situation:"You don’t know where the gate is.", answer:"Where is gate 12, please?", options:["Where is gate 12, please?","What is gate 12, please?","Where gate 12 is, please?"]}
  ];

  var builders = [
    {prompt:"Ask for the menu.", answer:["Can I","have","the menu","please?"], options:[["Can I","I can","Do I"],["have","to have","having"],["the menu","menu the","a menu to"],["please?","thank?","sorry?"]]},
    {prompt:"Ask the person to help you.", answer:["Could you","help","me","please?"], options:[["Could you","You could","Do you"],["help","to help","helping"],["me","my","I"],["please?","sorry?","hello?"]]},
    {prompt:"Say that you have a reservation.", answer:["I","have","a reservation","in the name of Dumarquez."], options:[["I","Me","My"],["have","am","do"],["a reservation","reservation","the reserve"],["in the name of Dumarquez.","at name Dumarquez.","for name Dumarquez."]]},
    {prompt:"Say what you want in a restaurant.", answer:["I would like","still water","please.",""], options:[["I would like","I am like","I like to"],["still water","water still","a still"],["please.","sorry.","hello."],["","now","yes"]]},
    {prompt:"Ask for breakfast time.", answer:["What time","is","breakfast","?"], options:[["What time","When time","How time"],["is","are","do"],["breakfast","the breakfast","a breakfast"],["?","please","."]]}  
  ];

  var listeningQuiz = [
    {q:"Frankie wants to…", answer:"check in", options:["buy a ticket","check in","order dinner"]},
    {q:"The reservation is in the name of…", answer:"Dumarquez", options:["Dumarquez","Durand","Dubois"]},
    {q:"The room is on the…", answer:"second floor", options:["first floor","second floor","third floor"]},
    {q:"Breakfast is from…", answer:"7 to 10", options:["6 to 9","7 to 10","8 to 11"]},
    {q:"The Wi-Fi password is…", answer:"on the key card", options:["on the key card","on the menu","at the airport"]}
  ];

  var scenarios = {
    hotelCheckin:{
      title:"Hotel check-in",
      goal:"Check in and ask for useful information.",
      phrases:["I would like to check in, please.","I have a reservation in the name of Dumarquez.","What time is breakfast?","Can I have the Wi-Fi password, please?"],
      dialogue:[
        ["Receptionist","Good afternoon. How can I help you?"],
        ["Frankie","Good afternoon. I would like to check in, please."],
        ["Receptionist","Do you have a reservation?"],
        ["Frankie","Yes, I have a reservation in the name of Dumarquez."],
        ["Receptionist","Here is your key card."],
        ["Frankie","Thank you. What time is breakfast?"]
      ],
      prompts:["You arrive at the hotel.","Give your name.","Ask about breakfast.","Ask for Wi-Fi."]
    },
    taxi:{
      title:"Taxi to the hotel",
      goal:"Give your destination and check the price.",
      phrases:["I would like to go to this hotel, please.","Here is the address.","How much is it?","Can I pay by card?"],
      dialogue:[
        ["Driver","Hello. Where would you like to go?"],
        ["Frankie","Hello. I would like to go to this hotel, please."],
        ["Driver","Do you have the address?"],
        ["Frankie","Yes, here is the address."],
        ["Driver","No problem."],
        ["Frankie","Can I pay by card?"]
      ],
      prompts:["Say the destination.","Show the address.","Ask the price.","Ask to pay by card."]
    },
    restaurant:{
      title:"Ordering in a restaurant",
      goal:"Ask for the menu, order and ask for the bill.",
      phrases:["Can I have the menu, please?","I would like the chicken, please.","I would like still water, please.","Can I have the bill, please?"],
      dialogue:[
        ["Waiter","Good evening. Are you ready to order?"],
        ["Frankie","Can I have the menu, please?"],
        ["Waiter","Of course."],
        ["Frankie","Thank you. I would like the chicken and still water, please."],
        ["Waiter","Certainly."],
        ["Frankie","And can I have the bill, please?"]
      ],
      prompts:["Ask for the menu.","Order food.","Order a drink.","Ask for the bill."]
    },
    ticket:{
      title:"Buying a ticket",
      goal:"Buy a ticket and ask about time and price.",
      phrases:["I would like a ticket to the city centre, please.","A return ticket, please.","What time is the next train?","How much is it?"],
      dialogue:[
        ["Assistant","Hello. Can I help you?"],
        ["Frankie","Yes, I would like a ticket to the city centre, please."],
        ["Assistant","One-way or return?"],
        ["Frankie","A return ticket, please."],
        ["Assistant","The next train is at 10:15."],
        ["Frankie","Thank you. How much is it?"]
      ],
      prompts:["Ask for a ticket.","Choose one-way or return.","Ask for the next train.","Ask the price."]
    },
    lost:{
      title:"Asking for help when lost",
      goal:"Explain the problem and ask for simple directions.",
      phrases:["Excuse me, I am lost.","I can’t find the train station.","Could you help me, please?","Could you speak more slowly, please?"],
      dialogue:[
        ["Frankie","Excuse me, could you help me, please?"],
        ["Person","Yes, of course."],
        ["Frankie","I am lost. I can’t find the train station."],
        ["Person","Go straight on, then turn left."],
        ["Frankie","Sorry, could you speak more slowly, please?"],
        ["Person","Yes. Go straight on. Then turn left."]
      ],
      prompts:["Say you are lost.","Ask for help.","Say what you can’t find.","Ask the person to speak slowly."]
    }
  };

  function init(){
    var warning = $("#jsWarning");
    if(warning){ warning.style.display = "none"; }
    setupVoices();
    renderModels();
    renderVocab();
    renderMeaningQuiz();
    renderBuilders();
    renderListening();
    renderScenario();
    bindEvents();
  }

  function setupVoices(){
    if("speechSynthesis" in window){
      voices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = function(){ voices = window.speechSynthesis.getVoices(); };
    }
  }

  function getVoice(){
    if(!voices || !voices.length){ voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }
    var exact = voices.find(function(v){ return v.lang === selectedVoice; });
    if(exact){ return exact; }
    return voices.find(function(v){ return v.lang && v.lang.indexOf(selectedVoice.split("-")[0]) === 0; }) || null;
  }

  function speak(text){
    if(!("speechSynthesis" in window)){
      alert("Sorry, speech synthesis is not available in this browser.");
      return;
    }
    if(!text){ return; }
    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedVoice;
    utterance.rate = 0.82;
    utterance.pitch = 1;
    var voice = getVoice();
    if(voice){ utterance.voice = voice; }
    window.speechSynthesis.speak(utterance);
  }

  function normalize(str){
    return String(str || "").toLowerCase().replace(/[’']/g,"'").replace(/[.,!?]/g,"").replace(/\s+/g," ").trim();
  }

  function bindEvents(){
    document.addEventListener("click", function(e){
      var sayBtn = e.target.closest("[data-say]");
      if(sayBtn){ speak(sayBtn.getAttribute("data-say")); return; }

      var scrollBtn = e.target.closest("[data-scroll]");
      if(scrollBtn){
        var target = document.querySelector(scrollBtn.getAttribute("data-scroll"));
        if(target){ target.scrollIntoView({behavior:"smooth", block:"start"}); }
        return;
      }

      var hintBtn = e.target.closest("[data-hint]");
      if(hintBtn){
        var hint = document.querySelector(hintBtn.getAttribute("data-hint"));
        if(hint){ hint.classList.toggle("show"); }
        return;
      }

      var vocabSpeak = e.target.closest("[data-vocab-say]");
      if(vocabSpeak){ speak(vocabSpeak.getAttribute("data-vocab-say")); return; }
    });

    $$(".voice-btn").forEach(function(btn){
      btn.addEventListener("click", function(){
        selectedVoice = btn.getAttribute("data-voice") || "en-US";
        $$(".voice-btn").forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
      });
    });

    var stopVoice = $("#stopVoice");
    if(stopVoice){ stopVoice.addEventListener("click", function(){ if(window.speechSynthesis){ window.speechSynthesis.cancel(); } }); }

    var printBtn = $("#printBtn");
    if(printBtn){ printBtn.addEventListener("click", function(){ window.print(); }); }

    $$(".selectable").forEach(function(chip){
      chip.addEventListener("click", function(){
        $$("#goalChips .selectable").forEach(function(c){ c.classList.remove("selected"); });
        chip.classList.add("selected");
        selectedGoal = chip.getAttribute("data-goal") || "ask for help";
      });
    });

    var makeGoal = $("#makeGoalSentence");
    if(makeGoal){
      makeGoal.addEventListener("click", function(){
        var out = $("#goalSentence");
        var sentence = "Today, I want to practise how to " + selectedGoal + " in English. I can use simple model sentences.";
        out.innerHTML = "<strong>Model:</strong> " + sentence + " <button class='listen-btn compact' type='button' data-say='" + escapeAttr(sentence) + "'>▶ Listen</button>";
      });
    }

    var modelCategory = $("#modelCategory");
    if(modelCategory){ modelCategory.addEventListener("change", renderModels); }
    var vocabCategory = $("#vocabCategory");
    if(vocabCategory){ vocabCategory.addEventListener("change", renderVocab); }
    var vocabSearch = $("#vocabSearch");
    if(vocabSearch){ vocabSearch.addEventListener("input", renderVocab); }

    var checkMeaning = $("#checkMeaningQuiz");
    if(checkMeaning){ checkMeaning.addEventListener("click", checkMeaningQuiz); }
    var checkBuilders = $("#checkBuilders");
    if(checkBuilders){ checkBuilders.addEventListener("click", checkBuildersQuiz); }
    var showBuilderModels = $("#showBuilderModels");
    if(showBuilderModels){ showBuilderModels.addEventListener("click", showBuilderAnswers); }
    var checkDialogue = $("#checkDialogue");
    if(checkDialogue){ checkDialogue.addEventListener("click", checkDialogueQuiz); }
    var scenarioSelect = $("#scenarioSelect");
    if(scenarioSelect){ scenarioSelect.addEventListener("change", renderScenario); }
    var toggleTranscript = $("#toggleTranscript");
    if(toggleTranscript){ toggleTranscript.addEventListener("click", toggleTranscriptBox); }
    var checkListening = $("#checkListening");
    if(checkListening){ checkListening.addEventListener("click", checkListeningQuiz); }
    var buildHotelMessage = $("#buildHotelMessage");
    if(buildHotelMessage){ buildHotelMessage.addEventListener("click", buildMessage); }
  }

  function escapeHTML(str){
    return String(str || "").replace(/[&<>'"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;","\"":"&quot;"}[c]; });
  }
  function escapeAttr(str){ return escapeHTML(str).replace(/\n/g," "); }

  function renderModels(){
    var select = $("#modelCategory");
    var grid = $("#sentenceBank");
    if(!select || !grid){ return; }
    var key = select.value || "airport";
    grid.innerHTML = (models[key] || []).map(function(item){
      return "<article class='sentence-card'>"+
        "<span class='tag'>"+escapeHTML(item.tag)+"</span>"+
        "<div class='en'>"+escapeHTML(item.en)+"</div>"+
        "<div class='fr'>🇫🇷 "+escapeHTML(item.fr)+"</div>"+
        "<button class='listen-btn compact' type='button' data-say='"+escapeAttr(item.en)+"'>▶ Listen</button>"+
      "</article>";
    }).join("");
  }

  function renderVocab(){
    var cat = $("#vocabCategory") ? $("#vocabCategory").value : "all";
    var q = normalize($("#vocabSearch") ? $("#vocabSearch").value : "");
    var filtered = vocab.filter(function(item){
      var catOk = cat === "all" || item.cat === cat;
      var qOk = !q || normalize(item.en + " " + item.fr + " " + item.def + " " + item.ex).indexOf(q) !== -1;
      return catOk && qOk;
    });
    var count = $("#vocabCount");
    if(count){
      count.textContent = filtered.length + " vocabulary item" + (filtered.length > 1 ? "s" : "") + (cat !== "all" ? " · " + (categoryLabels[cat] || cat) : "");
    }
    var grid = $("#vocabGrid");
    if(!grid){ return; }
    if(!filtered.length){ grid.innerHTML = "<div class='result-box'>No vocabulary found. Try another category or search word.</div>"; return; }
    grid.innerHTML = filtered.map(function(item){
      return "<article class='vocab-card'>"+
        "<div class='vocab-icon' aria-hidden='true'>"+escapeHTML(item.icon)+"</div>"+
        "<div class='vocab-content'>"+
          "<div class='vocab-title'>"+escapeHTML(item.en)+"</div>"+
          "<div class='vocab-fr'>🇫🇷 "+escapeHTML(item.fr)+"</div>"+
          "<div class='vocab-def'>"+escapeHTML(item.def)+"</div>"+
          "<div class='vocab-ex'><strong>Example:</strong> "+escapeHTML(item.ex)+"</div>"+
          "<button class='listen-btn compact' type='button' data-vocab-say='"+escapeAttr(item.en + ". " + item.ex)+"'>▶ Listen</button>"+
        "</div>"+
      "</article>";
    }).join("");
  }

  function renderMeaningQuiz(){
    var box = $("#meaningQuiz");
    if(!box){ return; }
    box.innerHTML = meaningQuiz.map(function(item, idx){
      return "<div class='quiz-item' data-answer='"+escapeAttr(item.answer)+"'>"+
        "<p>"+(idx+1)+". "+escapeHTML(item.situation)+"</p>"+
        "<div class='option-row'>"+
          item.options.map(function(opt, optIdx){
            var id = "meaning_"+idx+"_"+optIdx;
            return "<label for='"+id+"'><input id='"+id+"' type='radio' name='meaning_"+idx+"' value='"+escapeAttr(opt)+"'> <span>"+escapeHTML(opt)+"</span></label>";
          }).join("")+
        "</div>"+
      "</div>";
    }).join("");
  }

  function checkMeaningQuiz(){
    var total = meaningQuiz.length;
    var score = 0;
    $$("#meaningQuiz .quiz-item").forEach(function(item){
      var answer = item.getAttribute("data-answer");
      var checked = item.querySelector("input:checked");
      if(checked && checked.value === answer){ score++; item.style.borderColor = "#9dd9b9"; }
      else{ item.style.borderColor = "#ffc4c4"; }
    });
    setFeedback("#meaningFeedback", score, total);
  }

  function renderBuilders(){
    var box = $("#sentenceBuilders");
    if(!box){ return; }
    box.innerHTML = builders.map(function(item, idx){
      return "<div class='builder-row' data-index='"+idx+"'>"+
        "<strong>"+(idx+1)+". "+escapeHTML(item.prompt)+"</strong>"+
        item.options.map(function(opts, partIdx){
          return "<select aria-label='Sentence part "+(partIdx+1)+" for item "+(idx+1)+"'>"+
            "<option value=''>Choose…</option>"+
            opts.map(function(opt){ return "<option value='"+escapeAttr(opt)+"'>"+escapeHTML(opt || "—")+"</option>"; }).join("")+
          "</select>";
        }).join("")+
      "</div>";
    }).join("");
  }

  function checkBuildersQuiz(){
    var score = 0;
    $$("#sentenceBuilders .builder-row").forEach(function(row){
      var idx = Number(row.getAttribute("data-index"));
      var selects = Array.prototype.slice.call(row.querySelectorAll("select"));
      var chosen = selects.map(function(s){ return s.value; });
      var expected = builders[idx].answer;
      var ok = chosen.every(function(val, i){ return val === expected[i]; });
      if(ok){ score++; row.style.borderColor = "#9dd9b9"; }
      else{ row.style.borderColor = "#ffc4c4"; }
    });
    setFeedback("#builderFeedback", score, builders.length);
  }

  function showBuilderAnswers(){
    var out = $("#builderFeedback");
    if(!out){ return; }
    out.className = "feedback";
    out.innerHTML = "<div class='builder-models'><strong>Model answers:</strong><ol>" + builders.map(function(item){
      return "<li>"+escapeHTML(item.answer.filter(Boolean).join(" ").replace(" ?", "?"))+"</li>";
    }).join("") + "</ol></div>";
  }

  function checkDialogueQuiz(){
    var total = $$(".dialog-select").length;
    var score = 0;
    $$(".dialog-select").forEach(function(sel){
      if(sel.value === sel.getAttribute("data-answer")){ score++; sel.style.borderColor = "#78c99d"; }
      else{ sel.style.borderColor = "#ee8b8b"; }
    });
    setFeedback("#dialogueFeedback", score, total);
  }

  function renderScenario(){
    var key = $("#scenarioSelect") ? $("#scenarioSelect").value : "hotelCheckin";
    var s = scenarios[key] || scenarios.hotelCheckin;
    var box = $("#scenarioCard");
    if(!box){ return; }
    var phrases = s.phrases.map(function(p){
      return "<div class='phrase-pill'><span>"+escapeHTML(p)+"</span><button class='listen-btn compact' type='button' data-say='"+escapeAttr(p)+"'>▶</button></div>";
    }).join("");
    var dialogueText = s.dialogue.map(function(line){ return line[0] + ": " + line[1]; }).join(" ");
    var dialogue = s.dialogue.map(function(line){ return "<p><strong>"+escapeHTML(line[0])+":</strong> "+escapeHTML(line[1])+"</p>"; }).join("");
    var prompts = s.prompts.map(function(p){ return "<div>✅ "+escapeHTML(p)+"</div>"; }).join("");
    box.innerHTML = "<div class='scenario-top'><div><h3>"+escapeHTML(s.title)+"</h3><p class='muted'>Use the phrases, then try the role-play with the teacher.</p></div><span class='scenario-goal'>"+escapeHTML(s.goal)+"</span></div>"+
      "<h3>Useful phrases</h3><div class='phrase-grid'>"+phrases+"</div>"+
      "<div class='dialogue-model'><h3>Model dialogue</h3>"+dialogue+"<button class='listen-btn compact' type='button' data-say='"+escapeAttr(dialogueText)+"'>▶ Listen to the dialogue</button></div>"+
      "<h3 style='margin-top:16px'>Speaking steps</h3><div class='roleplay-prompts'>"+prompts+"</div>";
  }

  function renderListening(){
    var box = $("#listeningQuiz");
    if(!box){ return; }
    box.innerHTML = listeningQuiz.map(function(item, idx){
      return "<div class='listening-item' data-answer='"+escapeAttr(item.answer)+"'>"+
        "<strong>"+(idx+1)+". "+escapeHTML(item.q)+"</strong>"+
        item.options.map(function(opt, optIdx){
          var id = "listen_"+idx+"_"+optIdx;
          return "<label for='"+id+"'><input id='"+id+"' type='radio' name='listen_"+idx+"' value='"+escapeAttr(opt)+"'> "+escapeHTML(opt)+"</label>";
        }).join("")+
      "</div>";
    }).join("");
  }

  function toggleTranscriptBox(){
    var box = $("#transcriptBox");
    var btn = $("#toggleTranscript");
    if(!box || !btn){ return; }
    box.classList.toggle("show");
    btn.textContent = box.classList.contains("show") ? "Hide transcript" : "Show transcript";
  }

  function checkListeningQuiz(){
    var score = 0;
    $$("#listeningQuiz .listening-item").forEach(function(item){
      var answer = item.getAttribute("data-answer");
      var checked = item.querySelector("input:checked");
      if(checked && checked.value === answer){ score++; item.style.borderColor = "#9dd9b9"; }
      else{ item.style.borderColor = "#ffc4c4"; }
    });
    setFeedback("#listeningFeedback", score, listeningQuiz.length);
  }

  function buildMessage(){
    var day = ($("#arrivalDay") && $("#arrivalDay").value.trim()) || "Friday";
    var time = ($("#arrivalTime") && $("#arrivalTime").value.trim()) || "4 p.m.";
    var req = ($("#hotelRequest") && $("#hotelRequest").value) || "a quiet room";
    var question = ($("#hotelQuestion") && $("#hotelQuestion").value) || "Can I have the Wi-Fi password?";
    var message = "Dear Sir or Madam,\n\n"+
      "I would like to confirm my reservation. I arrive on " + day + " at about " + time + ". I would like " + req + ", please. " + question + " Thank you for your help.\n\n"+
      "Kind regards,\nFrankie Dumarquez";
    var out = $("#hotelMessage");
    if(out){ out.value = message; }
  }

  function setFeedback(selector, score, total){
    var out = $(selector);
    if(!out){ return; }
    var cls = score === total ? "good" : (score >= Math.ceil(total/2) ? "try" : "bad");
    out.className = "feedback " + cls;
    if(score === total){
      out.innerHTML = "🎉 Excellent! " + score + "/" + total + " correct. Frankie can now practise saying the model sentences aloud.";
    }else if(score >= Math.ceil(total/2)){
      out.innerHTML = "👍 Good start: " + score + "/" + total + " correct. Check the model sentences and try again.";
    }else{
      out.innerHTML = "🌱 Keep going: " + score + "/" + total + " correct. Use the visible models and hints, then try again.";
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  }else{
    init();
  }
})();
