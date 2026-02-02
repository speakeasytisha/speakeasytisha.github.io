/* SpeakEasyTisha — People Profiles Match (offline-friendly, touch-friendly) */
(function(){
  "use strict";

  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c];});}
  function norm(s){ return String(s||"").trim().toLowerCase().replace(/\s+/g," "); }
  function shuffle(arr){
    var a = arr.slice();
    for(var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }

  /* ------------------- Data -------------------
     Note: Profiles are simplified and intended for language practice.
     They focus on public roles and widely known public facts. No photos.
  */
  var PEOPLE = [
    {
      id:"greta",
      name:"Greta Thunberg",
      cat:"Activism 🌍",
      tagline:"Climate activist",
      easy:[
        "This person is a young Swedish activist. She is often seen with long hair in braids.",
        "Professionally, she speaks at international events and encourages people to reduce pollution.",
        "She is usually described as determined, direct, and serious."
      ],
      pro:[
        "This Swedish activist, who became widely known as a teenager, is often pictured with long hair in braids.",
        "She campaigns for climate action and has addressed global leaders, emphasizing urgency and responsibility.",
        "People often describe her as focused and persistent; however, her style can feel very direct."
      ],
      hint:"Country + topic: Sweden + climate action."
    },
    {
      id:"malala",
      name:"Malala Yousafzai",
      cat:"Education 📚",
      tagline:"Education advocate",
      easy:[
        "This person is a Pakistani education advocate. She has dark hair and is often seen with a warm smile.",
        "Professionally, she speaks about girls’ education and human rights around the world.",
        "She is often described as brave, thoughtful, and inspiring."
      ],
      pro:[
        "This education advocate from Pakistan, who speaks about girls’ schooling worldwide, is often seen with dark hair and a calm expression.",
        "She works through speeches and foundations, and she highlights equal access to education.",
        "She is often described as courageous and reflective, while still staying polite and clear."
      ],
      hint:"Topic clue: girls’ education."
    },
    {
      id:"serena",
      name:"Serena Williams",
      cat:"Sport 🎾",
      tagline:"Tennis champion",
      easy:[
        "This person is an American tennis champion. She is athletic and strong, with a confident posture.",
        "Professionally, she won many major tennis tournaments and competed at the highest level for years.",
        "She is often described as competitive, resilient, and ambitious."
      ],
      pro:[
        "This American tennis champion, who dominated the sport for many seasons, is known for strength, speed, and a confident presence.",
        "Her career includes many major titles, and she is also active in business and philanthropy.",
        "She is often described as fiercely competitive; however, she also presents a positive public image."
      ],
      hint:"Sport clue: tennis."
    },
    {
      id:"messi",
      name:"Lionel Messi",
      cat:"Sport ⚽",
      tagline:"Football star",
      easy:[
        "This person is a famous football (soccer) player from Argentina. He is usually seen with short dark hair and a calm face.",
        "Professionally, he is known for amazing dribbling and scoring goals for top clubs and his national team.",
        "He is often described as humble, focused, and hardworking."
      ],
      pro:[
        "This Argentine football star, who is widely praised for close control and quick decisions, is often seen with short dark hair.",
        "He has played for elite clubs and is recognized for creating and scoring goals.",
        "He is often described as modest and concentrated, whereas his playing style is extremely creative."
      ],
      hint:"Country + sport: Argentina + football."
    },
    {
      id:"swift",
      name:"Taylor Swift",
      cat:"Music 🎤",
      tagline:"Singer-songwriter",
      easy:[
        "This person is an American singer-songwriter. She is often described as tall, with light hair.",
        "Professionally, she writes songs and performs in large concerts around the world.",
        "She is often described as creative, hardworking, and detail‑oriented."
      ],
      pro:[
        "This American singer-songwriter, who is known for writing personal lyrics, is often described as tall with light hair.",
        "She releases albums, performs worldwide tours, and manages a high-profile public career.",
        "She is often described as ambitious and meticulous; in addition, she is known for strong storytelling."
      ],
      hint:"Clue: songwriting + storytelling."
    },
    {
      id:"oprah",
      name:"Oprah Winfrey",
      cat:"Media 🎙️",
      tagline:"TV host & producer",
      easy:[
        "This person is a famous American TV host and producer. She often has a friendly, warm smile.",
        "Professionally, she interviews people, tells stories, and runs media projects.",
        "She is often described as empathetic, confident, and charismatic."
      ],
      pro:[
        "This American media leader, who became famous through talk shows and interviews, is often recognized by a warm smile.",
        "She produces content and builds projects that focus on stories, conversation, and public interest.",
        "She is often described as charismatic and empathetic; moreover, she is known for strong communication."
      ],
      hint:"Clue: talk show + interviews."
    },
    {
      id:"obama",
      name:"Barack Obama",
      cat:"Politics 🏛️",
      tagline:"Former U.S. President",
      easy:[
        "This person is a well-known American politician. He is tall, with short dark hair and a calm expression.",
        "Professionally, he led the United States as president and often speaks in public events.",
        "He is often described as calm, articulate, and thoughtful."
      ],
      pro:[
        "This American politician, who served as U.S. president, is often described as tall with short dark hair and a composed manner.",
        "He gives speeches, writes, and works on public initiatives through organizations and public life.",
        "He is often described as articulate and reflective; however, opinions about his leadership can vary."
      ],
      hint:"Clue: U.S. president."
    },
    {
      id:"merkel",
      name:"Angela Merkel",
      cat:"Politics 🇩🇪",
      tagline:"German leader",
      easy:[
        "This person is a German political leader. She is often seen with short light hair.",
        "Professionally, she led Germany for many years and was known for her careful, practical style.",
        "She is often described as analytical, calm, and pragmatic."
      ],
      pro:[
        "This German leader, who is often associated with a cautious, pragmatic approach, is frequently pictured with short light hair.",
        "She worked in European and global politics for many years, often focusing on stability and negotiation.",
        "She is often described as analytical and reserved, while still being highly influential."
      ],
      hint:"Clue: Germany + long leadership."
    },
    {
      id:"curie",
      name:"Marie Curie",
      cat:"Science 🔬",
      tagline:"Scientist (historical)",
      easy:[
        "This person is a famous scientist from history. She is often shown in old photos with dark hair tied back.",
        "Professionally, she worked on radioactivity and helped change modern science.",
        "She is often described as curious, dedicated, and hardworking."
      ],
      pro:[
        "This historical scientist, who is linked to groundbreaking research on radioactivity, is usually pictured in early 20th‑century photos with dark hair tied back.",
        "She spent years doing careful experiments and is remembered for scientific perseverance.",
        "She is often described as exceptionally dedicated; in addition, her work influenced medicine and physics."
      ],
      hint:"Clue: radioactivity."
    },
    {
      id:"musk",
      name:"Elon Musk",
      cat:"Business 🚀",
      tagline:"Entrepreneur",
      easy:[
        "This person is a business leader. He is often seen with short hair and a serious look.",
        "Professionally, he is connected to technology and space-related projects.",
        "He is often described as ambitious, intense, and innovative."
      ],
      pro:[
        "This entrepreneur, who is strongly associated with technology and space-related projects, is often seen with short hair and a serious expression.",
        "He leads companies and publicly discusses future-focused ideas, from engineering to transportation.",
        "He is often described as bold and driven; however, public opinions about his style and decisions can differ."
      ],
      hint:"Clue: space + technology companies."
    }
  ];

  var VOCAB = [
    // Appearance
    {k:"tall", fr:"grand(e)", ex:"He is tall.", tip:"Use BE + adjective." , icon:"📏"},
    {k:"short", fr:"petit(e)", ex:"She is short.", tip:"BE + adjective.", icon:"📏"},
    {k:"average height", fr:"taille moyenne", ex:"He is of average height.", tip:"Useful neutral description.", icon:"📏"},
    {k:"slim", fr:"mince", ex:"She is slim.", tip:"BE + adjective.", icon:"👗"},
    {k:"athletic", fr:"sportif/ve", ex:"He has an athletic build.", tip:"HAVE + noun phrase.", icon:"🏃"},
    {k:"curly hair", fr:"cheveux bouclés", ex:"She has curly hair.", tip:"HAVE + noun.", icon:"🌀"},
    {k:"straight hair", fr:"cheveux raides", ex:"He has straight hair.", tip:"HAVE + noun.", icon:"🧑"},
    {k:"blonde hair", fr:"cheveux blonds", ex:"She has blonde hair.", tip:"HAVE + noun.", icon:"🌾"},
    {k:"dark hair", fr:"cheveux foncés", ex:"He has dark hair.", tip:"HAVE + noun.", icon:"🌑"},
    {k:"wears glasses", fr:"porte des lunettes", ex:"She wears glasses.", tip:"Use PRESENT SIMPLE.", icon:"👓"},
    // Personality
    {k:"reliable", fr:"fiable", ex:"He is reliable.", tip:"Great for work.", icon:"✅"},
    {k:"friendly", fr:"sympa / aimable", ex:"She is friendly.", tip:"Work + daily life.", icon:"🙂"},
    {k:"reserved", fr:"réservé(e)", ex:"He seems reserved.", tip:"Use SEEM.", icon:"🤫"},
    {k:"confident", fr:"confiant(e)", ex:"She sounds confident.", tip:"Use SOUND.", icon:"💪"},
    {k:"curious", fr:"curieux/se", ex:"He is curious.", tip:"Often used in interviews.", icon:"🧠"},
    {k:"determined", fr:"déterminé(e)", ex:"She is determined.", tip:"Common in motivation.", icon:"🎯"},
    {k:"ambitious", fr:"ambitieux/se", ex:"He is ambitious.", tip:"Work contexts.", icon:"🚀"},
    {k:"calm", fr:"calme", ex:"She stays calm under pressure.", tip:"Present simple.", icon:"🧘"},
    {k:"empathetic", fr:"empathique", ex:"He is empathetic.", tip:"Customer service.", icon:"💛"},
    {k:"detail‑oriented", fr:"minutieux/se", ex:"She is detail‑oriented.", tip:"Job interviews.", icon:"🔎"},
    // Work language
    {k:"leads a team", fr:"dirige une équipe", ex:"He leads a team.", tip:"Present simple.", icon:"👥"},
    {k:"works in technology", fr:"travaille dans la tech", ex:"She works in technology.", tip:"Present simple.", icon:"💻"},
    {k:"speaks in public", fr:"parle en public", ex:"He speaks in public.", tip:"Present simple.", icon:"🎤"},
    {k:"runs a company", fr:"dirige une entreprise", ex:"She runs a company.", tip:"Present simple.", icon:"🏢"},
    {k:"is known for…", fr:"est connu(e) pour…", ex:"He is known for his creativity.", tip:"Passive structure.", icon:"⭐"},
    // Connectors
    {k:"however", fr:"cependant", ex:"However, she stays polite.", tip:"Connector.", icon:"🔗"},
    {k:"although", fr:"bien que", ex:"Although he is busy, he helps.", tip:"Subordinator.", icon:"🔗"},
    {k:"whereas", fr:"tandis que", ex:"He is quiet, whereas she is talkative.", tip:"Contrast.", icon:"🔗"},
    {k:"in addition", fr:"en plus", ex:"In addition, she speaks French.", tip:"Add info.", icon:"➕"}
  ];

  /* ------------------- Speech (TTS) ------------------- */
  var lastUtter = null;
  function stopVoice(){
    try{ window.speechSynthesis.cancel(); }catch(e){}
    lastUtter = null;
  }
  function pickVoice(langPref){
    var voices = [];
    try{ voices = window.speechSynthesis.getVoices() || []; }catch(e){ voices = []; }
    if(!voices.length) return null;

    if(langPref && langPref !== "auto"){
      // Prefer exact match, then startsWith
      for(var i=0;i<voices.length;i++){
        if((voices[i].lang||"") === langPref) return voices[i];
      }
      for(var j=0;j<voices.length;j++){
        if((voices[j].lang||"").toLowerCase().indexOf(langPref.toLowerCase()) === 0) return voices[j];
      }
    }

    // Auto: prefer English voices
    for(var k=0;k<voices.length;k++){
      if((voices[k].lang||"").toLowerCase().indexOf("en") === 0) return voices[k];
    }
    return voices[0] || null;
  }
  function speak(text){
    stopVoice();
    if(!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

    var u = new SpeechSynthesisUtterance(text);
    var accent = $("accentSel").value;
    var v = pickVoice(accent);
    if(v) u.voice = v;
    u.rate = parseFloat($("speedRange").value || "1") || 1;
    u.pitch = 1;
    u.volume = 1;
    lastUtter = u;
    try{ window.speechSynthesis.speak(u); }catch(e){}
  }

  function toParagraphs(lines){
    return lines.map(function(s){ return "<p>"+esc(s)+"</p>"; }).join("");
  }

  /* ------------------- Matching state ------------------- */
  var order = [];
  var idx = 0;
  var score = 0;
  var streak = 0;
  var revealedAll = false;

  function setScoreUI(){
    $("scoreNow").textContent = String(score);
    $("streakNow").textContent = String(streak);
    $("progNow").textContent = String(Math.min(idx, order.length));
    $("progTotal").textContent = String(order.length);
    var pct = order.length ? Math.round((Math.min(idx, order.length) / order.length) * 100) : 0;
    $("progFill").style.width = pct + "%";
  }

  function currentPerson(){
    var id = order[idx];
    for(var i=0;i<PEOPLE.length;i++) if(PEOPLE[i].id===id) return PEOPLE[i];
    return PEOPLE[0];
  }

  function makeChoiceButtons(targetId){
    var choices = shuffle(PEOPLE).slice(0,6);
    // Ensure target included
    var hasTarget = choices.some(function(p){ return p.id===targetId; });
    if(!hasTarget){
      choices[0] = PEOPLE.find(function(p){ return p.id===targetId; }) || PEOPLE[0];
      choices = shuffle(choices);
    }

    var grid = $("choiceGrid");
    grid.innerHTML = "";
    choices.forEach(function(p){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.setAttribute("data-id", p.id);
      b.innerHTML = "<div>"+esc(p.name)+"<br><small>"+esc(p.tagline)+"</small></div><div aria-hidden='true'>➜</div>";
      b.addEventListener("click", function(){ chooseAnswer(p.id); });
      grid.appendChild(b);
    });
  }

  function showList(){
    var box = $("listBox");
    var open = !box.hidden;
    if(open){ box.hidden = true; return; }
    var html = "<div class='tiny muted'>All people in this lesson:</div>";
    PEOPLE.forEach(function(p){
      html += "<div class='row'><div><strong>"+esc(p.name)+"</strong> <span class='tag'>"+esc(p.tagline)+"</span></div><div class='tag'>"+esc(p.cat)+"</div></div>";
    });
    box.innerHTML = html;
    box.hidden = false;
  }

  function renderProfile(){
    $("matchFeedback").className = "feedback";
    $("matchFeedback").textContent = "";
    $("hintBox").hidden = true;
    $("hintBox").textContent = "";
    $("listBox").hidden = true;

    if(idx >= order.length){
      $("profileCat").textContent = "Done ✅";
      $("profileLevel").textContent = "";
      $("profileText").innerHTML = "<p><strong>Great work!</strong> You finished all profiles.</p><p>Now go to the Grammar section and do 2–3 workouts, then generate your own profile.</p>";
      $("choiceGrid").innerHTML = "<div class='muted'>No more questions. Use ♻️ Reset or 🔀 Shuffle.</div>";
      setScoreUI();
      return;
    }

    var p = currentPerson();
    var level = $("levelSel").value;
    var lines = (level === "pro") ? p.pro : p.easy;

    $("profileTag").textContent = "Profile " + (idx+1);
    $("profileCat").textContent = p.cat;
    $("profileLevel").textContent = (level === "pro") ? "Pro (B1–B2)" : "Everyday (A2–B1)";
    $("profileText").innerHTML = toParagraphs(lines);

    makeChoiceButtons(p.id);
    applyReveal();
    setScoreUI();

    if($("ttsAuto").checked){
      speak(lines.join(" "));
    }
  }

  function clearChoiceStyles(){
    var btns = $("choiceGrid").querySelectorAll(".choice");
    for(var i=0;i<btns.length;i++){
      btns[i].classList.remove("correct","wrong");
      btns[i].disabled = false;
    }
  }

  function lockChoices(){
    var btns = $("choiceGrid").querySelectorAll(".choice");
    for(var i=0;i<btns.length;i++) btns[i].disabled = true;
  }

  function chooseAnswer(chosenId){
    if(idx >= order.length) return;

    clearChoiceStyles();

    var p = currentPerson();
    var ok = chosenId === p.id;

    var btns = $("choiceGrid").querySelectorAll(".choice");
    for(var i=0;i<btns.length;i++){
      var id = btns[i].getAttribute("data-id");
      if(id === chosenId) btns[i].classList.add(ok ? "correct" : "wrong");
      if(id === p.id) btns[i].classList.add("correct");
    }

    if(ok){
      score += 10;
      streak += 1;
      $("matchFeedback").className = "feedback good";
      $("matchFeedback").innerHTML = "✅ Correct! <strong>"+esc(p.name)+"</strong> — "+esc(p.tagline)+".";
    }else{
      score = Math.max(0, score - 3);
      streak = 0;
      $("matchFeedback").className = "feedback bad";
      $("matchFeedback").innerHTML = "❌ Not this time. The correct answer is <strong>"+esc(p.name)+"</strong>.";
    }
    setScoreUI();
    lockChoices();
  }

  function safeScrollToMatch(){
    try{
      var y = $("match").getBoundingClientRect().top + window.scrollY - 90;
      try{ window.scrollTo({top: y, behavior: "smooth"}); }
      catch(err){ window.scrollTo(0, y); }
    }catch(e){}
  }

  function nextProfile(){
    if(idx < order.length) idx += 1;
    renderProfile();
    safeScrollToMatch();
  }

  function skipProfile(){
    streak = 0;
    idx += 1;
    renderProfile();
  }

  function hint(){
    if(idx >= order.length) return;
    var p = currentPerson();
    $("hintBox").hidden = false;
    $("hintBox").textContent = "Hint: " + p.hint;
  }

  function explainClues(){
    if(idx >= order.length) return;
    var p = currentPerson();
    var level = $("levelSel").value;
    var lines = (level === "pro") ? p.pro : p.easy;

    var exp = [];
    exp.push("Clue types to notice:");
    exp.push("• Nationality / country");
    exp.push("• Field (politics, sport, science, media…)");
    exp.push("• Typical public images (e.g., braids, short light hair)");
    exp.push("• Key actions (leads, campaigns, writes, performs)");
    exp.push("");
    exp.push("For this profile: " + p.hint);
    exp.push("Grammar highlight: look for BE vs HAVE, and connectors like however/although/whereas.");
    $("matchFeedback").className = "feedback";
    $("matchFeedback").innerHTML = "<div style='white-space:pre-wrap'>"+esc(exp.join("\n"))+"</div>";
  }

  function applyReveal(){
    if(!revealedAll) return;
    if(idx >= order.length) return;
    var p = currentPerson();
    var btns = $("choiceGrid").querySelectorAll(".choice");
    for(var i=0;i<btns.length;i++){
      if(btns[i].getAttribute("data-id") === p.id){
        btns[i].classList.add("correct");
        break;
      }
    }
    $("matchFeedback").className = "feedback";
    $("matchFeedback").innerHTML = "👀 <strong>Reveal mode ON</strong> — Answer: <strong>"+esc(p.name)+"</strong>.";
  }

  function revealAnswers(){
    revealedAll = !revealedAll;
    if(revealedAll){
      applyReveal();
    }else{
      $("matchFeedback").className = "feedback";
      $("matchFeedback").textContent = "✅ Reveal mode OFF — keep guessing!";
      renderProfile();
    }
  }

  function resetAll(){
    stopVoice();
    score = 0;
    streak = 0;
    idx = 0;
    revealedAll = false;
    order = PEOPLE.map(function(p){ return p.id; });
    renderProfile();
    buildVocab();
    buildGrammar();
  }

  function shuffleAll(){
    stopVoice();
    order = shuffle(PEOPLE.map(function(p){ return p.id; }));
    idx = 0;
    streak = 0;
    renderProfile();
  }

  /* ------------------- Vocab flashcards ------------------- */
  function vocabCard(v){
    var el = document.createElement("div");
    el.className = "flash";
    el.setAttribute("tabindex","0");
    el.setAttribute("role","button");
    el.setAttribute("aria-label", v.k + " flashcard");

    var flipped = false;

    function render(){
      var front = "<div class='flash__top'><div class='flash__icon'>"+esc(v.icon||"💬")+"</div><div class='mini' data-act='speak' title='Listen'>🔊</div></div>"+
                  "<div class='flash__title'>"+esc(v.k)+"</div>"+
                  "<div class='flash__sub'>FR: "+esc(v.fr)+"</div>";

      var back = "<div class='flash__top'><div class='flash__icon'>"+esc(v.icon||"💬")+"</div><div class='mini' data-act='speak' title='Listen'>🔊</div></div>"+
                 "<div class='flash__title'>Example</div>"+
                 "<div class='flash__back'>"+esc(v.ex)+"</div>"+
                 "<div class='flash__sub'>Tip: "+esc(v.tip)+"</div>";

      el.innerHTML = flipped ? back : front;

      var speakBtn = el.querySelector("[data-act='speak']");
      if(speakBtn){
        speakBtn.addEventListener("click", function(ev){
          ev.stopPropagation();
          speak(v.k + ". " + v.ex);
        });
      }
    }

    el.addEventListener("click", function(){ flipped = !flipped; render(); });
    el.addEventListener("keydown", function(e){
      if(e.key==="Enter" || e.key===" "){ e.preventDefault(); flipped = !flipped; render(); }
    });

    render();
    return el;
  }

  function buildVocab(){
    var q = norm($("vocabSearch").value || "");
    var grid = $("vocabGrid");
    grid.innerHTML = "";
    var list = VOCAB.slice();
    if(q){
      list = list.filter(function(v){
        return norm(v.k).indexOf(q)>=0 || norm(v.fr).indexOf(q)>=0 || norm(v.ex).indexOf(q)>=0;
      });
    }
    list.forEach(function(v){ grid.appendChild(vocabCard(v)); });
  }

  /* ------------------- Grammar accordion + exercises ------------------- */
  function mkPanel(title, subtitle, innerHTML){
    var p = document.createElement("div");
    p.className = "panel";
    var head = document.createElement("button");
    head.type = "button";
    head.className = "panel__head";
    head.innerHTML = "<div>"+esc(title)+"</div><span>"+esc(subtitle||"")+"</span><div aria-hidden='true'>▾</div>";
    var body = document.createElement("div");
    body.className = "panel__body";
    body.innerHTML = innerHTML;

    head.addEventListener("click", function(){
      var open = p.classList.contains("open");
      var all = document.querySelectorAll(".panel");
      for(var i=0;i<all.length;i++) all[i].classList.remove("open");
      if(!open) p.classList.add("open");
    });

    p.appendChild(head);
    p.appendChild(body);
    return p;
  }

  function mcq(id, prompt, options, answer, explain){
    var html = "<div class='q' id='"+esc(id)+"'>"+
      "<div class='q__prompt'>"+esc(prompt)+"</div>"+
      "<div class='q__row'>"+
        options.map(function(o,i){
          return "<button class='pillbtn' type='button' data-i='"+i+"'>"+esc(o)+"</button>";
        }).join("")+
      "</div>"+
      "<div class='q__row'><div class='q__status' aria-live='polite'></div></div>"+
      "<div class='tiny muted'>"+esc(explain||"")+"</div>"+
    "</div>";
    return html;
  }

  function attachMCQ(rootId, answerIdx){
    var root = $(rootId);
    if(!root) return;
    var btns = root.querySelectorAll("button.pillbtn");
    var status = root.querySelector(".q__status");
    function set(msg, good){
      status.textContent = msg;
      status.style.color = good ? "rgba(52,211,153,0.95)" : "rgba(251,113,133,0.95)";
    }
    for(var i=0;i<btns.length;i++){
      (function(i){
        btns[i].addEventListener("click", function(){
          if(i===answerIdx) set("✅ Correct", true);
          else set("❌ Try again", false);
        });
      })(i);
    }
  }

  function gap(id, prompt, answer, hintText){
    return "<div class='q' id='"+esc(id)+"'>"+
      "<div class='q__prompt'>"+esc(prompt)+"</div>"+
      "<div class='q__row'>"+
        "<input class='input' type='text' placeholder='Type your answer…' />"+
        "<button class='btn btn--ghost' type='button' data-act='check'>Check</button>"+
        "<button class='btn btn--ghost' type='button' data-act='hint'>Hint</button>"+
      "</div>"+
      "<div class='q__row'><div class='q__status' aria-live='polite'></div></div>"+
      "<div class='tiny muted' data-hint style='display:none'></div>"+
    "</div>";
  }

  function attachGap(rootId, answer, hintText){
    var root = $(rootId);
    if(!root) return;
    var input = root.querySelector("input");
    var check = root.querySelector("[data-act='check']");
    var hint = root.querySelector("[data-act='hint']");
    var status = root.querySelector(".q__status");
    var hintBox = root.querySelector("[data-hint]");
    function set(msg, good){
      status.textContent = msg;
      status.style.color = good ? "rgba(52,211,153,0.95)" : "rgba(251,113,133,0.95)";
    }
    check.addEventListener("click", function(){
      var ok = norm(input.value) === norm(answer);
      if(ok) set("✅ Correct", true);
      else set("❌ Not quite", false);
    });
    hint.addEventListener("click", function(){
      hintBox.style.display = "block";
      hintBox.textContent = hintText || ("Answer: " + answer);
    });
  }

  function builder(id, prompt, words, solution, tip){
    var chips = words.map(function(w){ return "<div class='wordchip' data-w='"+esc(w)+"'>"+esc(w)+"</div>"; }).join("");
    return "<div class='q' id='"+esc(id)+"'>"+
      "<div class='q__prompt'>"+esc(prompt)+"</div>"+
      "<div class='wordbank'>"+chips+"</div>"+
      "<div class='buildline' data-line aria-live='polite'></div>"+
      "<div class='q__row'>"+
        "<button class='btn btn--ghost' type='button' data-act='check'>Check</button>"+
        "<button class='btn btn--ghost' type='button' data-act='reset'>Reset</button>"+
      "</div>"+
      "<div class='q__row'><div class='q__status' aria-live='polite'></div></div>"+
      "<div class='tiny muted'>"+esc(tip||"")+"</div>"+
    "</div>";
  }

  function attachBuilder(rootId, solution){
    var root = $(rootId);
    if(!root) return;
    var chips = root.querySelectorAll(".wordchip");
    var line = root.querySelector("[data-line]");
    var status = root.querySelector(".q__status");
    var check = root.querySelector("[data-act='check']");
    var reset = root.querySelector("[data-act='reset']");

    var built = [];
    function render(){
      line.textContent = built.join(" ");
      for(var i=0;i<chips.length;i++){
        var w = chips[i].getAttribute("data-w");
        chips[i].classList.toggle("used", built.indexOf(w) >= 0);
      }
    }
    for(var i=0;i<chips.length;i++){
      (function(i){
        chips[i].addEventListener("click", function(){
          var w = chips[i].getAttribute("data-w");
          // allow duplicates (e.g., "is") by not blocking identical token? simplest: still allow, but mark used is not perfect.
          built.push(w);
          render();
        });
      })(i);
    }

    check.addEventListener("click", function(){
      var ok = norm(built.join(" ")) === norm(solution);
      status.textContent = ok ? "✅ Correct" : "❌ Try again";
      status.style.color = ok ? "rgba(52,211,153,0.95)" : "rgba(251,113,133,0.95)";
    });

    reset.addEventListener("click", function(){
      built = [];
      status.textContent = "";
      render();
    });

    render();
  }

  function buildGrammar(){
    var acc = $("grammarAcc");
    acc.innerHTML = "";

    var p1 = mkPanel("1) BE vs HAVE (appearance)",
      "He is tall / He has blue eyes",
      "<p><strong>Use BE</strong> for adjectives: <em>She is friendly.</em> <br><strong>Use HAVE</strong> for features: <em>He has curly hair.</em></p>"+
      mcq("g_behave_1","Choose the correct sentence:","She is curly hair.","She has curly hair.","She is has curly hair.", 1, "Hair = noun ➜ HAVE.")+
      gap("g_behave_2","Complete: He ___ glasses (present simple).","wears","Tip: for clothes/accessories use PRESENT SIMPLE: wear(s).")+
      builder("g_behave_3","Build the sentence:","has|He|a|friendly|smile".split("|"),"He has a friendly smile","Smile = noun ➜ HAVE.")
    );

    var p2 = mkPanel("2) What does she look like? / What is she like?",
      "Look = appearance • Like = personality",
      "<p><strong>Look like</strong> = appearance. <strong>Be like</strong> = personality. <br>Example: <em>What does he look like?</em> He is tall. He has short hair. <br><em>What is he like?</em> He is calm and reliable.</p>"+
      mcq("g_like_1","Which question is about personality?","What does she look like?","What is she like?","What does she like?", 1, "Personality = What is she like?")+
      gap("g_like_2","Complete: What does he ____ like? (appearance)","look","Look like = appearance.")
    );

    var p3 = mkPanel("3) Present simple for professional profile",
      "He leads / She works / They run",
      "<p>Use the <strong>present simple</strong> to describe work, routines, facts.</p>"+
      mcq("g_ps_1","Choose the best option: She ____ in technology.","work","works","is work", 1, "3rd person singular ➜ works")+
      gap("g_ps_2","Rewrite using present simple: She (to lead) a team.","leads a team","Lead ➜ leads")
    );

    var p4 = mkPanel("4) Relative clauses: who / that / which",
      "a person who… • a project that…",
      "<p>Use <strong>who</strong> for people and <strong>which/that</strong> for things. <br>Example: <em>She is a leader who focuses on negotiation.</em></p>"+
      mcq("g_rel_1","Choose the correct sentence:","A scientist which changed science.","A scientist who changed science.","A scientist who it changed science.", 1, "People ➜ who")+
      builder("g_rel_2","Build the sentence:","who|campaigns|for|climate|action|She|is|an|activist".split("|"),"She is an activist who campaigns for climate action","Relative clause adds detail.")
    );

    var p5 = mkPanel("5) Connectors for contrast and addition",
      "however / although / whereas / in addition",
      "<p>Connectors make your description sound natural and professional.</p>"+
      mcq("g_con_1","Choose the best connector: ___ he is busy, he helps his team.","However","Although","In addition", 1, "Although = concession (A, but B).")+
      gap("g_con_2","Complete: She is quiet, ____ her work is very influential.","whereas","Whereas = contrast between two clauses.")
    );

    var p6 = mkPanel("6) Polite follow-up questions",
      "What does he do? • What is she known for?",
      "<p>Use these in meetings or networking:</p>"+
      "<ul>"+
        "<li><strong>What does he do?</strong> (job)</li>"+
        "<li><strong>What is she known for?</strong> (reputation)</li>"+
        "<li><strong>How would you describe them?</strong> (opinion)</li>"+
      "</ul>"+
      builder("g_q_1","Build the question:","does|What|she|do".split("|"),"What does she do","Question order: What + does + subject + base verb.")
    );

    acc.appendChild(p1);
    acc.appendChild(p2);
    acc.appendChild(p3);
    acc.appendChild(p4);
    acc.appendChild(p5);
    acc.appendChild(p6);

    // Attach handlers after injection
    attachMCQ("g_behave_1", 1);
    attachGap("g_behave_2", "wears", "Use present simple: wear(s).");
    attachBuilder("g_behave_3", "He has a friendly smile");

    attachMCQ("g_like_1", 1);
    attachGap("g_like_2", "look", "Look like = appearance.");

    attachMCQ("g_ps_1", 1);
    attachGap("g_ps_2", "leads a team", "Lead → leads.");

    attachMCQ("g_rel_1", 1);
    attachBuilder("g_rel_2", "She is an activist who campaigns for climate action");

    attachMCQ("g_con_1", 1);
    attachGap("g_con_2", "whereas", "Whereas contrasts two clauses.");

    attachBuilder("g_q_1", "What does she do");
  }

  /* ------------------- Create paragraph ------------------- */
  function pronMap(p){
    if(p==="he") return {sub:"He", obj:"him", pos:"his"};
    if(p==="they") return {sub:"They", obj:"them", pos:"their"};
    return {sub:"She", obj:"her", pos:"her"};
  }

  function smartJoin(words){
    return words.filter(function(x){ return norm(x)!==""; }).join(", ").replace(/,\s*,/g,", ");
  }

  function generate(){
    var pron = $("yourPron").value;
    var pm = pronMap(pron);
    var role = $("yourRole").value.trim() || "professional";
    var look = $("yourLook").value.trim();
    var traits = $("yourTraits").value.trim();
    var facts = $("yourFacts").value.trim();

    var looks = look ? smartJoin(look.split(/[,;]+/)) : "easy to recognize";
    var pers = traits ? smartJoin(traits.split(/[,;]+/)) : "friendly and reliable";

    // Connector choice based on difficulty
    var level = $("levelSel").value;
    var con1 = (level==="pro") ? "However" : "Also";
    var con2 = (level==="pro") ? "In addition" : "And";

    var s = [];
    s.push(pm.sub + " is a " + role + " who works with people and projects.");
    s.push(pm.sub + " is " + pers + ", and " + pm.sub.toLowerCase() + " tries to communicate clearly.");
    s.push(pm.sub + " looks " + looks + ".");
    if(facts){
      s.push(con1 + ", " + pm.sub.toLowerCase() + " " + facts.replace(/^[A-Z]/, function(m){ return m.toLowerCase(); }) + ".");
    }
    s.push(con2 + ", " + pm.sub.toLowerCase() + " enjoys learning and improving every day.");

    var out = s.join(" ");
    $("genOut").textContent = out;
    return out;
  }

  function copyText(t){
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(t);
        return;
      }
    }catch(e){}
    // fallback
    var ta = document.createElement("textarea");
    ta.value = t;
    document.body.appendChild(ta);
    ta.select();
    try{ document.execCommand("copy"); }catch(e){}
    document.body.removeChild(ta);
  }

  /* ------------------- Events ------------------- */
  function init(){
    // Some browsers load voices async
    if("speechSynthesis" in window){
      try{ window.speechSynthesis.onvoiceschanged = function(){}; }catch(e){}
    }

    order = PEOPLE.map(function(p){ return p.id; });
    $("progTotal").textContent = String(order.length);
    renderProfile();
    buildVocab();
    buildGrammar();

    $("btnRead").addEventListener("click", function(){
      if(idx>=order.length) return;
      var p = currentPerson();
      var level = $("levelSel").value;
      var lines = (level==="pro") ? p.pro : p.easy;
      speak(lines.join(" "));
    });

    $("btnRepeat").addEventListener("click", function(){
      if(idx>=order.length) return;
      var p = currentPerson();
      var level = $("levelSel").value;
      var lines = (level==="pro") ? p.pro : p.easy;
      speak(lines.join(" "));
    });

    $("btnNext").addEventListener("click", nextProfile);
    $("btnSkip").addEventListener("click", skipProfile);
    $("btnHint").addEventListener("click", hint);
    $("btnExplain").addEventListener("click", explainClues);
    $("btnShowList").addEventListener("click", showList);

    $("btnRevealAll").addEventListener("click", revealAnswers);
    $("btnResetAll").addEventListener("click", resetAll);
    $("btnShuffleAll").addEventListener("click", shuffleAll);

    $("vocabSearch").addEventListener("input", buildVocab);
    $("btnVocabShuffle").addEventListener("click", function(){
      VOCAB = shuffle(VOCAB);
      buildVocab();
    });

    $("levelSel").addEventListener("change", function(){
      // Update generated paragraph connectors + matching text
      renderProfile();
    });

    $("btnGenerate").addEventListener("click", function(){
      var t = generate();
      // optional auto speak? no
    });
    $("btnSpeakGen").addEventListener("click", function(){
      var t = $("genOut").textContent;
      if(t && t.indexOf("appear here")<0) speak(t);
    });
    $("btnCopyGen").addEventListener("click", function(){
      var t = $("genOut").textContent;
      if(t && t.indexOf("appear here")<0) copyText(t);
    });

    $("btnStopVoice").addEventListener("click", stopVoice);
    $("btnPrint").addEventListener("click", function(){ stopVoice(); window.print(); });

    // Keyboard support: N for next, H for hint
    document.addEventListener("keydown", function(e){
      if(e.target && (e.target.tagName==="INPUT" || e.target.tagName==="TEXTAREA" || e.target.tagName==="SELECT")) return;
      if(e.key==="n" || e.key==="N") nextProfile();
      if(e.key==="h" || e.key==="H") hint();
      if(e.key==="s" || e.key==="S") stopVoice();
    });
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", init);
  else init();

})();