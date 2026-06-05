(function(){
  "use strict";

  var selectedVoice = "en-US";
  var voices = [];
  var currentModel = "a2";
  var selectedMood = "";

  var $ = function(sel){ return document.querySelector(sel); };
  var $$ = function(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  var vocab = [
    {cat:"routine", icon:"⏰", en:"wake up", fr:"se réveiller", def:"To stop sleeping.", ex:"I usually wake up at 7 o’clock."},
    {cat:"routine", icon:"🛏️", en:"get up", fr:"se lever", def:"To leave your bed.", ex:"I get up after I wake up."},
    {cat:"routine", icon:"☕", en:"have breakfast", fr:"prendre le petit-déjeuner", def:"To eat in the morning.", ex:"I have breakfast in the morning."},
    {cat:"routine", icon:"🚪", en:"leave home", fr:"partir de la maison", def:"To go out of your house.", ex:"I leave home at 7:45."},
    {cat:"routine", icon:"🚗", en:"go to work", fr:"aller au travail", def:"To travel to your workplace.", ex:"I go to work by car."},
    {cat:"routine", icon:"🏁", en:"start work", fr:"commencer le travail", def:"To begin your working day.", ex:"I start work at 8 or 9."},
    {cat:"routine", icon:"✅", en:"finish work", fr:"finir le travail", def:"To end your working day.", ex:"I finish work at 4 p.m."},
    {cat:"routine", icon:"🏠", en:"come home", fr:"rentrer à la maison", def:"To return home.", ex:"I come home after work."},
    {cat:"routine", icon:"🍽️", en:"cook dinner", fr:"préparer le dîner", def:"To prepare the evening meal.", ex:"I sometimes cook dinner in the evening."},
    {cat:"routine", icon:"🌙", en:"go to bed", fr:"aller se coucher", def:"To go to sleep.", ex:"I usually go to bed at 10:30."},

    {cat:"work", icon:"💻", en:"use a computer", fr:"utiliser un ordinateur", def:"To work with a computer.", ex:"At work, I use a computer."},
    {cat:"work", icon:"📧", en:"answer emails", fr:"répondre aux e-mails", def:"To reply to messages.", ex:"I answer emails every morning."},
    {cat:"work", icon:"🤝", en:"help people", fr:"aider les gens", def:"To give support or information.", ex:"I help people at work."},
    {cat:"work", icon:"📞", en:"answer the phone", fr:"répondre au téléphone", def:"To pick up and speak on the phone.", ex:"I sometimes answer the phone."},
    {cat:"work", icon:"🗓️", en:"have a meeting", fr:"avoir une réunion", def:"To meet people for work.", ex:"We have a meeting on Monday."},
    {cat:"work", icon:"☕", en:"have a break", fr:"faire une pause", def:"To stop working for a short time.", ex:"I have a break at lunchtime."},
    {cat:"work", icon:"🔥", en:"be busy", fr:"être occupée", def:"To have many things to do.", ex:"I am busy this week."},
    {cat:"work", icon:"🕘", en:"be on time", fr:"être à l’heure", def:"To arrive at the correct time.", ex:"I try to be on time."},
    {cat:"work", icon:"👥", en:"colleague", fr:"collègue", def:"A person you work with.", ex:"My colleague is very kind."},
    {cat:"work", icon:"📋", en:"schedule", fr:"emploi du temps / planning", def:"A plan with times and activities.", ex:"My schedule is busy today."},

    {cat:"time", icon:"🌅", en:"in the morning", fr:"le matin", def:"During the first part of the day.", ex:"I have breakfast in the morning."},
    {cat:"time", icon:"☀️", en:"in the afternoon", fr:"l’après-midi", def:"After midday and before evening.", ex:"I finish work in the afternoon."},
    {cat:"time", icon:"🌆", en:"in the evening", fr:"le soir", def:"The later part of the day.", ex:"I relax in the evening."},
    {cat:"time", icon:"🕗", en:"at 8 o’clock", fr:"à 8 heures", def:"A precise time.", ex:"I start work at 8 o’clock."},
    {cat:"time", icon:"📅", en:"on Monday", fr:"lundi", def:"Use on with days.", ex:"I have a meeting on Monday."},
    {cat:"time", icon:"🔁", en:"every day", fr:"tous les jours", def:"Each day.", ex:"I drink coffee every day."},
    {cat:"time", icon:"🏡", en:"at the weekend", fr:"le week-end", def:"On Saturday and Sunday.", ex:"At the weekend, I visit my family."},
    {cat:"time", icon:"➡️", en:"after work", fr:"après le travail", def:"When the working day is finished.", ex:"After work, I often relax."},
    {cat:"time", icon:"⬅️", en:"before work", fr:"avant le travail", def:"Before the working day starts.", ex:"Before work, I have breakfast."},
    {cat:"time", icon:"✌️", en:"twice a week", fr:"deux fois par semaine", def:"Two times in one week.", ex:"I go for a walk twice a week."},

    {cat:"frequency", icon:"💯", en:"always", fr:"toujours", def:"100% of the time.", ex:"I always brush my teeth."},
    {cat:"frequency", icon:"🌟", en:"usually", fr:"habituellement / généralement", def:"Most of the time.", ex:"I usually start work at 8."},
    {cat:"frequency", icon:"👍", en:"often", fr:"souvent", def:"Many times.", ex:"I often relax after work."},
    {cat:"frequency", icon:"🌤️", en:"sometimes", fr:"parfois", def:"Not always, but from time to time.", ex:"I sometimes go shopping after work."},
    {cat:"frequency", icon:"🌙", en:"rarely", fr:"rarement", def:"Not often.", ex:"I rarely work on Sunday."},
    {cat:"frequency", icon:"🚫", en:"never", fr:"jamais", def:"0% of the time.", ex:"I never drink coffee at night."},

    {cat:"freeTime", icon:"🚶", en:"go for a walk", fr:"faire une promenade", def:"To walk for pleasure.", ex:"I go for a walk with my dog."},
    {cat:"freeTime", icon:"📺", en:"watch TV", fr:"regarder la télé", def:"To look at television programmes.", ex:"I sometimes watch TV after work."},
    {cat:"freeTime", icon:"📖", en:"read", fr:"lire", def:"To look at and understand words in a book or text.", ex:"I like reading in the evening."},
    {cat:"freeTime", icon:"🧑‍🍳", en:"cook", fr:"cuisiner", def:"To prepare food.", ex:"I like cooking at the weekend."},
    {cat:"freeTime", icon:"👨‍👩‍👧", en:"visit family", fr:"rendre visite à la famille", def:"To go and see family members.", ex:"I visit family on Sunday."},
    {cat:"freeTime", icon:"🛍️", en:"go shopping", fr:"faire les magasins / les courses", def:"To buy things.", ex:"I sometimes go shopping after work."},
    {cat:"freeTime", icon:"✈️", en:"travel", fr:"voyager", def:"To go to another place or country.", ex:"I want to travel with more confidence."},
    {cat:"freeTime", icon:"🛋️", en:"rest", fr:"se reposer", def:"To relax and not work.", ex:"I need to rest this weekend."},
    {cat:"freeTime", icon:"💛", en:"spend time with", fr:"passer du temps avec", def:"To be with someone for a period of time.", ex:"I like spending time with my family."},

    {cat:"connectors", icon:"1️⃣", en:"first", fr:"d’abord", def:"Use it for the first action.", ex:"First, I have breakfast."},
    {cat:"connectors", icon:"➡️", en:"then", fr:"ensuite", def:"Use it for the next action.", ex:"Then, I go to work."},
    {cat:"connectors", icon:"🔜", en:"after that", fr:"après cela", def:"Use it for another action later.", ex:"After that, I answer emails."},
    {cat:"connectors", icon:"💬", en:"because", fr:"parce que", def:"Use it to give a reason.", ex:"I learn English because I want to travel."},
    {cat:"connectors", icon:"↔️", en:"but", fr:"mais", def:"Use it to show contrast.", ex:"My week is simple, but sometimes it is busy."},
    {cat:"connectors", icon:"✨", en:"so", fr:"donc / alors", def:"Use it to show a result.", ex:"I am tired, so I rest."},
    {cat:"connectors", icon:"➕", en:"also", fr:"aussi", def:"Use it to add information.", ex:"I also like walking."},

    {cat:"questions", icon:"⏱️", en:"What time…?", fr:"À quelle heure… ?", def:"Ask for an hour.", ex:"What time do you start work?"},
    {cat:"questions", icon:"📍", en:"Where…?", fr:"Où… ?", def:"Ask for a place.", ex:"Where do you work?"},
    {cat:"questions", icon:"📅", en:"When…?", fr:"Quand… ?", def:"Ask for a time or day.", ex:"When do you go shopping?"},
    {cat:"questions", icon:"🔁", en:"How often…?", fr:"À quelle fréquence… ?", def:"Ask about frequency.", ex:"How often do you go for a walk?"},
    {cat:"questions", icon:"❓", en:"Why…?", fr:"Pourquoi… ?", def:"Ask for a reason.", ex:"Why are you learning English?"},
    {cat:"questions", icon:"⏳", en:"How long…?", fr:"Combien de temps… ?", def:"Ask about duration.", ex:"How long is your break?"},
    {cat:"questions", icon:"✅", en:"Do you…?", fr:"Est-ce que vous… ?", def:"Start a yes/no question.", ex:"Do you work every day?"},

    {cat:"survival", icon:"🔁", en:"Can you repeat, please?", fr:"Pouvez-vous répéter, s’il vous plaît ?", def:"Use it when you need to hear again.", ex:"Sorry, can you repeat, please?"},
    {cat:"survival", icon:"🐢", en:"Can you speak more slowly, please?", fr:"Pouvez-vous parler plus lentement ?", def:"Use it when the person speaks too fast.", ex:"Can you speak more slowly, please?"},
    {cat:"survival", icon:"⏳", en:"Let me think.", fr:"Laissez-moi réfléchir.", def:"Use it to take time.", ex:"That’s a good question. Let me think."},
    {cat:"survival", icon:"🤔", en:"I’m not sure.", fr:"Je ne suis pas sûre.", def:"Use it when you are uncertain.", ex:"I’m not sure, but I think it is at 8."},
    {cat:"survival", icon:"🧩", en:"I don’t understand this word.", fr:"Je ne comprends pas ce mot.", def:"Use it when one word is difficult.", ex:"I don’t understand this word. Can you explain?"},
    {cat:"survival", icon:"🙏", en:"Could you help me, please?", fr:"Pourriez-vous m’aider, s’il vous plaît ?", def:"Use it to ask for help politely.", ex:"Could you help me, please?"}
  ];

  var questionData = {
    work:[
      "What time do you start work?",
      "What time do you finish work?",
      "Do you work every day?",
      "What do you usually do at work?",
      "Are you busy this week?"
    ],
    time:[
      "What do you do in the morning?",
      "What do you do in the evening?",
      "What do you do at the weekend?",
      "When do you go shopping?",
      "What time do you go to bed?"
    ],
    freeTime:[
      "What do you like doing after work?",
      "Do you like walking?",
      "What do you do with your family?",
      "Do you prefer quiet weekends or busy weekends?",
      "What do you like doing at home?"
    ],
    frequency:[
      "How often do you go shopping?",
      "How often do you watch TV?",
      "How often do you go for a walk?",
      "Do you always have breakfast?",
      "Do you sometimes work at the weekend?"
    ],
    why:[
      "Why are you learning English?",
      "Why do you want to practise speaking?",
      "Why is English useful for travel?",
      "Why do you want to feel more confident?",
      "Why is repetition important?"
    ]
  };

  var models = {
    a2:"My week is simple. I usually start work at 8 or 9. I finish work at 4 p.m. After work, I usually relax at home. At the weekend, I like walking and spending time with my family.",
    a2plus:"During the week, I usually start work at 8 or 9 and I finish at about 4 p.m. After work, I sometimes go shopping or relax at home. At the weekend, I like spending time with my family because it is important for me.",
    b1minus:"My routine is quite regular during the week. I usually start work in the morning and finish in the afternoon. After work, I try to relax, but sometimes I have things to do at home. At the weekend, I enjoy quiet activities, family time and sometimes short trips."
  };

  var oralQuestions = [
    "Tell me about your morning routine.",
    "What time do you start and finish work?",
    "What do you usually do after work?",
    "What do you like doing at the weekend?",
    "How often do you go shopping?",
    "Why are you learning English?",
    "Is your week usually busy or quiet?",
    "What do you do when you are tired?",
    "Do you prefer working in the morning or in the afternoon?",
    "Tell me three things you do every week."
  ];

  function init(){
    var warning = $("#jsWarning");
    if(warning){ warning.style.display = "none"; }

    setupVoices();
    renderVocab();
    renderQuestions();
    renderModel();
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
    return String(str || "")
      .toLowerCase()
      .replace(/[’']/g,"'")
      .replace(/[.,!?]/g,"")
      .replace(/\s+/g," ")
      .trim();
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

      var orderHintBtn = e.target.closest("[data-order-hint]");
      if(orderHintBtn){
        showInlineHint(orderHintBtn);
        return;
      }

      var checkBtn = e.target.closest("[data-check-selects]");
      if(checkBtn){
        checkSelectQuiz(checkBtn.getAttribute("data-check-selects"), checkBtn.getAttribute("data-feedback"));
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

    $$("#moodChips .selectable").forEach(function(btn){
      btn.addEventListener("click", function(){
        selectedMood = btn.getAttribute("data-mood");
        $$("#moodChips .selectable").forEach(function(b){ b.classList.remove("selected"); });
        btn.classList.add("selected");
      });
    });

    var makeMoodSentence = $("#makeMoodSentence");
    if(makeMoodSentence){
      makeMoodSentence.addEventListener("click", function(){
        var mood = selectedMood || "motivated";
        var text = "Today, I feel " + mood + ", but I am ready to practise English step by step.";
        var box = $("#moodSentence");
        if(box){
          box.innerHTML = escapeHtml(text) + " <button class='listen-btn small' type='button' data-say='" + escapeAttr(text) + "'>▶ Listen</button>";
        }
      });
    }

    var cat = $("#vocabCategory");
    if(cat){ cat.addEventListener("change", renderVocab); }
    var search = $("#vocabSearch");
    if(search){ search.addEventListener("input", renderVocab); }

    var questionType = $("#questionType");
    if(questionType){ questionType.addEventListener("change", renderQuestions); }

    var checkOrder = $("#checkOrder");
    if(checkOrder){ checkOrder.addEventListener("click", checkOrderQuiz); }
    var showOrderAnswers = $("#showOrderAnswers");
    if(showOrderAnswers){ showOrderAnswers.addEventListener("click", showOrderAnswersList); }

    var toggleTranscript = $("#toggleTranscript");
    if(toggleTranscript){
      toggleTranscript.addEventListener("click", function(){
        var box = $("#transcriptBox");
        if(box){
          box.classList.toggle("show");
          toggleTranscript.textContent = box.classList.contains("show") ? "Hide transcript" : "Show transcript";
        }
      });
    }

    $$(".tab-btn").forEach(function(btn){
      btn.addEventListener("click", function(){
        currentModel = btn.getAttribute("data-model") || "a2";
        $$(".tab-btn").forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        renderModel();
      });
    });

    var listenModel = $("#listenModel");
    if(listenModel){ listenModel.addEventListener("click", function(){ speak(models[currentModel]); }); }

    var randomQuestion = $("#randomQuestion");
    if(randomQuestion){ randomQuestion.addEventListener("click", newRandomQuestion); }

    var generateWriting = $("#generateWriting");
    if(generateWriting){ generateWriting.addEventListener("click", generateWritingText); }
    var copyWriting = $("#copyWriting");
    if(copyWriting){ copyWriting.addEventListener("click", copyWritingText); }
    var listenWriting = $("#listenWriting");
    if(listenWriting){ listenWriting.addEventListener("click", function(){ var t = $("#writingOutput"); speak(t ? t.value : ""); }); }
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"]/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]; });
  }
  function escapeAttr(str){
    return String(str).replace(/[&<>'"]/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]; });
  }

  function renderVocab(){
    var catEl = $("#vocabCategory");
    var searchEl = $("#vocabSearch");
    var category = catEl ? catEl.value : "all";
    var q = searchEl ? normalize(searchEl.value) : "";
    var filtered = vocab.filter(function(item){
      var matchCategory = category === "all" || item.cat === category;
      var hay = normalize(item.en + " " + item.fr + " " + item.def + " " + item.ex);
      var matchSearch = !q || hay.indexOf(q) !== -1;
      return matchCategory && matchSearch;
    });
    var grid = $("#vocabGrid");
    var count = $("#vocabCount");
    if(count){ count.textContent = filtered.length + " vocabulary card" + (filtered.length > 1 ? "s" : "") + " shown"; }
    if(!grid){ return; }
    grid.innerHTML = filtered.map(function(item){
      var say = item.en + ". " + item.ex;
      return "<article class='vocab-card'>" +
        "<div class='vocab-head'><span class='vocab-icon'>" + item.icon + "</span><div><h3>" + escapeHtml(item.en) + "</h3><div class='vocab-fr'>" + escapeHtml(item.fr) + "</div></div></div>" +
        "<p><strong>Definition:</strong> " + escapeHtml(item.def) + "</p>" +
        "<p class='vocab-example'><strong>Example:</strong> " + escapeHtml(item.ex) + "</p>" +
        "<div class='vocab-actions'><button class='listen-btn small' type='button' data-vocab-say='" + escapeAttr(say) + "'>▶ Listen</button></div>" +
        "</article>";
    }).join("");
  }

  function checkSelectQuiz(containerSelector, feedbackSelector){
    var container = document.querySelector(containerSelector);
    var feedback = document.querySelector(feedbackSelector);
    if(!container || !feedback){ return; }
    var selects = Array.prototype.slice.call(container.querySelectorAll("select[data-answer]"));
    var score = 0;
    var missing = 0;
    selects.forEach(function(sel){
      var isCorrect = sel.value === sel.getAttribute("data-answer");
      sel.classList.remove("correct","incorrect");
      if(!sel.value){ missing += 1; }
      if(isCorrect){ score += 1; sel.classList.add("correct"); }
      else { sel.classList.add("incorrect"); }
    });
    feedback.classList.remove("success","warning","danger");
    if(score === selects.length){
      feedback.classList.add("success");
      feedback.textContent = "Excellent: " + score + "/" + selects.length + " correct. Great work!";
    } else if(missing > 0){
      feedback.classList.add("warning");
      feedback.textContent = score + "/" + selects.length + " correct. Complete all answers, then check again.";
    } else {
      feedback.classList.add("danger");
      feedback.textContent = score + "/" + selects.length + " correct. Look at the highlighted answers and try again.";
    }
  }

  function showInlineHint(btn){
    var parent = btn.closest(".order-item");
    if(!parent){ return; }
    var old = parent.querySelector(".inline-hint");
    if(old){ old.remove(); return; }
    var div = document.createElement("div");
    div.className = "hint-box show inline-hint";
    div.textContent = btn.getAttribute("data-order-hint");
    parent.appendChild(div);
  }

  function checkOrderQuiz(){
    var items = $$("#orderQuiz input[data-answer]");
    var feedback = $("#orderFeedback");
    var score = 0;
    items.forEach(function(input){
      var expected = normalize(input.getAttribute("data-answer"));
      var actual = normalize(input.value);
      input.classList.remove("correct","incorrect");
      if(actual && actual === expected){ score += 1; input.classList.add("correct"); }
      else { input.classList.add("incorrect"); }
    });
    if(!feedback){ return; }
    feedback.classList.remove("success","warning","danger");
    if(score === items.length){
      feedback.classList.add("success");
      feedback.textContent = "Perfect: " + score + "/" + items.length + ". Your word order is clear.";
    } else if(score >= 3){
      feedback.classList.add("warning");
      feedback.textContent = score + "/" + items.length + ". Very close. Check frequency position and time expressions.";
    } else {
      feedback.classList.add("danger");
      feedback.textContent = score + "/" + items.length + ". Use the pattern: Subject + frequency + verb + details + time.";
    }
  }

  function showOrderAnswersList(){
    var box = $("#orderAnswers");
    if(!box){ return; }
    if(box.innerHTML.trim()){
      box.innerHTML = "";
      return;
    }
    var answers = $$("#orderQuiz input[data-answer]").map(function(input, i){ return (i+1) + ". " + input.getAttribute("data-answer"); });
    box.innerHTML = "<strong>Model answers:</strong><br>" + answers.map(escapeHtml).join("<br>");
  }

  function renderQuestions(){
    var typeEl = $("#questionType");
    var bank = $("#questionBank");
    if(!typeEl || !bank){ return; }
    var type = typeEl.value;
    var questions = questionData[type] || questionData.work;
    bank.innerHTML = questions.map(function(q){
      return "<div class='question-card'><p>" + escapeHtml(q) + "</p><button class='listen-btn small' type='button' data-say='" + escapeAttr(q) + "'>▶</button></div>";
    }).join("");
  }

  function renderModel(){
    var out = $("#modelOutput");
    if(out){ out.textContent = models[currentModel]; }
  }

  function newRandomQuestion(){
    var box = $("#randomQuestionBox");
    var q = oralQuestions[Math.floor(Math.random() * oralQuestions.length)];
    if(box){
      box.innerHTML = "<strong>Question:</strong> " + escapeHtml(q) + " <button class='listen-btn small' type='button' data-say='" + escapeAttr(q) + "'>▶ Listen</button>";
    }
  }

  function generateWritingText(){
    var wake = valueOr("#wWake", "7 o’clock");
    var start = valueOr("#wStart", "8 or 9");
    var work = valueOr("#wWork", "use a computer and help people");
    var finish = valueOr("#wFinish", "4 p.m.");
    var after = valueOr("#wAfter", "relax at home");
    var weekend = valueOr("#wWeekend", "spending time with my family");
    var why = valueOr("#wWhy", "I want to travel with more confidence");
    var paragraph = "My week is simple, but sometimes it is busy. In the morning, I usually wake up at " + wake + ". I start work at " + start + ". At work, I " + trimPeriod(work) + ". I finish work at " + finish + ". After work, I often " + trimPeriod(after) + ". At the weekend, I like " + trimPeriod(weekend) + ". I am learning English because " + trimPeriod(why) + ".";
    var output = $("#writingOutput");
    if(output){ output.value = paragraph; }
  }

  function valueOr(selector, fallback){
    var el = $(selector);
    return el && el.value.trim() ? el.value.trim() : fallback;
  }

  function trimPeriod(text){
    return String(text || "").trim().replace(/[.!?]+$/g, "");
  }

  function copyWritingText(){
    var output = $("#writingOutput");
    if(!output || !output.value.trim()){
      generateWritingText();
    }
    output = $("#writingOutput");
    if(output){
      output.focus();
      output.select();
      try{
        document.execCommand("copy");
        alert("Paragraph copied.");
      }catch(err){
        alert("Please copy the paragraph manually.");
      }
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
