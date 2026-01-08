/* SpeakEasyTisha — Canada Hotel Intro (Banff + Québec)
   Fully interactive, beginner-friendly, US/UK speechSynthesis.
*/

(() => {
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  // ---------------------------
  // Voice / speech
  // ---------------------------
  const Speech = {
    mode: "en-US", // or en-GB
    utter: null,
    voices: [],
    getVoices(){
      this.voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      return this.voices;
    },
    pickVoice(){
      const voices = this.getVoices();
      const langPref = this.mode;
      // prefer exact match, then startsWith
      let v = voices.find(x => (x.lang || "").toLowerCase() === langPref.toLowerCase());
      if(!v) v = voices.find(x => (x.lang || "").toLowerCase().startsWith(langPref.toLowerCase()));
      if(!v){
        // fallback: any English voice
        v = voices.find(x => (x.lang || "").toLowerCase().startsWith("en"));
      }
      return v || null;
    },
    stop(){
      try{ window.speechSynthesis?.cancel(); }catch(e){}
      this.utter = null;
    },
    pause(){
      try{ window.speechSynthesis?.pause(); }catch(e){}
    },
    resume(){
      try{ window.speechSynthesis?.resume(); }catch(e){}
    },
    say(text){
      if(!window.speechSynthesis) return;
      this.stop();
      const u = new SpeechSynthesisUtterance(String(text || ""));
      const v = this.pickVoice();
      if(v) u.voice = v;
      u.lang = this.mode;
      u.rate = 0.98;
      u.pitch = 1.0;
      this.utter = u;
      window.speechSynthesis.speak(u);
    },
    sayLines(lines){
      // Speak multiple lines safely
      const text = (lines || []).join(" ");
      this.say(text);
    }
  };

  // On some browsers, voices load async
  if (window.speechSynthesis){
    window.speechSynthesis.onvoiceschanged = () => Speech.getVoices();
  }

  // ---------------------------
  // Score
  // ---------------------------
  const Score = {
    now: 0,
    max: 0,
    awarded: new Set(),
    setMax(n){
      this.max = n;
      updateScore();
    },
    award(key, pts=1){
      if(this.awarded.has(key)) return;
      this.awarded.add(key);
      this.now += pts;
      updateScore();
      updateProgress();
    },
    reset(){
      this.now = 0;
      this.awarded.clear();
      updateScore();
      updateProgress();
    }
  };

  function updateScore(){
    $("#scoreNow").textContent = String(Score.now);
    $("#scoreMax").textContent = String(Score.max);
  }

  // Progress: based on awarded / max
  function updateProgress(){
    const pct = Score.max ? Math.round((Score.now / Score.max) * 100) : 0;
    $("#progressBar").style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }

  // ---------------------------
  // Data
  // ---------------------------
  const vocab = [
    // basics
    {group:"basics", icon:"🏨", word:"hotel", def:"a place where you pay to sleep", ex:"We stay at a hotel for two nights."},
    {group:"basics", icon:"🛎️", word:"reception", def:"the front desk area", ex:"The reception is near the entrance."},
    {group:"basics", icon:"🧳", word:"check-in", def:"when you arrive and get your key", ex:"Check-in is at 4:00 p.m."},
    {group:"basics", icon:"🧾", word:"receipt", def:"a paper or email proof of payment", ex:"Could I have a receipt, please?"},
    {group:"basics", icon:"💳", word:"credit card", def:"a card to pay", ex:"I’ll pay by credit card."},
    {group:"basics", icon:"🔑", word:"key card", def:"a card that opens your room", ex:"Here is your key card."},

    // rooms
    {group:"rooms", icon:"🛏️", word:"room", def:"a private space to sleep", ex:"We have a room on the 5th floor."},
    {group:"rooms", icon:"🛋️", word:"suite", def:"a bigger room with a sitting area", ex:"The suite has a living room."},
    {group:"rooms", icon:"🌄", word:"view", def:"what you can see from the window", ex:"I’d like a room with a view."},
    {group:"rooms", icon:"🧼", word:"amenities", def:"useful things or services for guests", ex:"The hotel has great amenities."},
    {group:"rooms", icon:"🥐", word:"breakfast included", def:"breakfast is part of the price", ex:"Is breakfast included?"},
    {group:"rooms", icon:"🛁", word:"bathroom", def:"room with a shower or bath", ex:"The bathroom is clean and bright."},

    // services
    {group:"services", icon:"🧖", word:"spa", def:"place to relax (massage, sauna, etc.)", ex:"Let’s go to the spa after skiing."},
    {group:"services", icon:"🏊", word:"pool", def:"a place to swim", ex:"The hotel has an indoor pool."},
    {group:"services", icon:"🏋️", word:"gym", def:"place to exercise", ex:"The gym is open in the morning."},
    {group:"services", icon:"🍽️", word:"restaurant", def:"place to eat", ex:"The restaurant is on the ground floor."},
    {group:"services", icon:"🧑‍💼", word:"concierge", def:"a person who helps guests", ex:"The concierge can book a taxi."},
    {group:"services", icon:"🚗", word:"parking", def:"place to leave your car", ex:"Is parking available?"},

    // people & titles
    {group:"people", icon:"👔", word:"Mr.", def:"title for a man (formal)", ex:"Good evening, Mr. Smith."},
    {group:"people", icon:"👒", word:"Mrs.", def:"title for a married woman (traditional)", ex:"Mrs. Brown is our guest."},
    {group:"people", icon:"👩‍💼", word:"Ms.", def:"title for a woman (safe choice)", ex:"Thank you, Ms. Johnson."},
    {group:"people", icon:"🙋‍♂️", word:"Sir", def:"polite way to address a man", ex:"Excuse me, sir."},
    {group:"people", icon:"🙋‍♀️", word:"Ma’am", def:"polite way to address a woman", ex:"Yes, ma’am."},

    // booking & time
    {group:"booking", icon:"📞", word:"reserve / book", def:"to keep a room for you", ex:"I’d like to book a room."},
    {group:"booking", icon:"📅", word:"availability", def:"if rooms are free on a date", ex:"Do you have availability on Friday?"},
    {group:"booking", icon:"⏰", word:"arrival time", def:"the time you arrive", ex:"My arrival time is 18:30."},
    {group:"booking", icon:"🕓", word:"check-out", def:"when you leave and return the key", ex:"Check-out is at noon."},
    {group:"booking", icon:"🗓️", word:"nights", def:"how many nights you stay", ex:"We stay for three nights."},
  ];

  const banffReadingLines = [
    {ico:"📍", txt:"Fairmont Banff Springs is in Banff, Alberta (address: 405 Spray Avenue)."},
    {ico:"🏔️", txt:"It is inside Banff National Park, near the town of Banff."},
    {ico:"🏰", txt:"It is a historic luxury resort, known as the “Castle in the Rockies”."},
    {ico:"🛏️", txt:"It offers rooms and suites. Some rooms have mountain views."},
    {ico:"🧖", txt:"Popular amenities include restaurants and a spa (and many outdoor activities nearby)."},
    {ico:"💰", txt:"Price range changes by season. A common estimate is about $443–$1,330 per night for a standard room."}
  ];

  const frontenacReadingLines = [
    {ico:"📍", txt:"Fairmont Le Château Frontenac is in Québec City (address: 1 Rue des Carrières)."},
    {ico:"🏰", txt:"It is located in Old Québec, inside the historic walls (a UNESCO World Heritage area)."},
    {ico:"🛏️", txt:"It has 610 guest rooms and suites, with views of Old Québec or the St. Lawrence River."},
    {ico:"🏊", txt:"It has an indoor pool area (plus relaxing features like steam/sauna in some wellness areas)."},
    {ico:"🍽️", txt:"You can enjoy restaurants, a bar, and room service."},
    {ico:"💰", txt:"Prices change by dates. A common estimate is about $270–$888 per night for a standard room."}
  ];

  // Reading quiz (MCQ)
  const readingQuiz = [
    {
      key:"rq1",
      prompt:"Which hotel is in Banff National Park?",
      choices:["Château Frontenac", "Banff Springs", "Both hotels"],
      answer:1,
      explain:"Banff Springs is in Banff National Park (Alberta)."
    },
    {
      key:"rq2",
      prompt:"Which hotel is in Old Québec (historic walls)?",
      choices:["Château Frontenac", "Banff Springs", "Neither"],
      answer:0,
      explain:"Château Frontenac is in Old Québec."
    },
    {
      key:"rq3",
      prompt:"Which hotel is called the “Castle in the Rockies”?",
      choices:["Banff Springs", "Château Frontenac", "Both"],
      answer:0,
      explain:"Banff Springs is known as the “Castle in the Rockies.”"
    },
    {
      key:"rq4",
      prompt:"What can you do at both hotels?",
      choices:["Eat at restaurants", "Ski inside the lobby", "Sleep in a tent"],
      answer:0,
      explain:"Both hotels have restaurants."
    },
    {
      key:"rq5",
      prompt:"What word means: “rooms are free on a date”?",
      choices:["receipt", "availability", "parking"],
      answer:1,
      explain:"Availability = rooms are available/free."
    },
  ];

  const roomTypeLines = [
    {ico:"🛏️", txt:"<span class='k'>Standard Room</span>: a comfortable basic room."},
    {ico:"✨", txt:"<span class='k'>Deluxe Room</span>: a larger room (more space)."},
    {ico:"🌄", txt:"<span class='k'>View Room</span>: a room with a special view (mountain / river / city)."},
    {ico:"🛋️", txt:"<span class='k'>Suite</span>: a bigger room with a sitting area (sometimes two rooms)."},
    {ico:"👑", txt:"<span class='k'>Fairmont Gold</span>: extra comfort + private lounge access (premium)."},
  ];

  const roomQuiz = [
    {
      key:"rm1",
      prompt:"You want a romantic trip and a beautiful window view.",
      choices:["Standard Room","View Room","Parking"],
      answer:1,
      explain:"A View Room is best for a special view."
    },
    {
      key:"rm2",
      prompt:"You want more space to relax and sit (maybe a living area).",
      choices:["Suite","Standard Room","Check-out"],
      answer:0,
      explain:"A Suite gives you more space."
    },
    {
      key:"rm3",
      prompt:"You want a simple room for one night (basic and comfortable).",
      choices:["Standard Room","Fairmont Gold","Spa"],
      answer:0,
      explain:"Standard Room = basic and comfortable."
    },
    {
      key:"rm4",
      prompt:"You want a premium experience and extra comfort.",
      choices:["Deluxe Room","Fairmont Gold","Key card"],
      answer:1,
      explain:"Fairmont Gold is premium."
    }
  ];

  const phoneLessonLines = [
    {ico:"✅", txt:"Use <span class='k'>polite requests</span>: <span class='k'>Could I…?</span> <span class='k'>May I…?</span> <span class='k'>I’d like to…</span>"},
    {ico:"📞", txt:"Present continuous (now): <span class='k'>I’m calling to book a room.</span>"},
    {ico:"🗓️", txt:"Present simple (facts): <span class='k'>Check-in is at 4 p.m.</span> <span class='k'>Breakfast is included.</span>"},
    {ico:"🛏️", txt:"Useful words: <span class='k'>room</span>, <span class='k'>suite</span>, <span class='k'>view</span>, <span class='k'>availability</span>, <span class='k'>nights</span>."},
    {ico:"💳", txt:"Payment: <span class='k'>credit card</span>, <span class='k'>deposit</span>, <span class='k'>receipt</span>."},
  ];

  const titlesLines = [
    {ico:"👔", txt:"<span class='k'>Mr.</span> = formal title for a man (Mr. Smith)."},
    {ico:"👒", txt:"<span class='k'>Mrs.</span> = traditional title for a married woman (Mrs. Brown)."},
    {ico:"👩‍💼", txt:"<span class='k'>Ms.</span> = safe title for a woman (marriage not important)."},
    {ico:"🙋‍♂️", txt:"<span class='k'>Sir</span> = polite address to a man (in service situations)."},
    {ico:"🙋‍♀️", txt:"<span class='k'>Ma’am</span> = polite address to a woman (in service situations)."},
    {ico:"⭐", txt:"Tip: If you are not sure, use <span class='k'>Hello</span> + the person’s last name, or just <span class='k'>Hello</span> politely."},
  ];

  const phoneFill = [
    { key:"pf1", prompt:"Hello. I’d like to ____ a room, please.", choices:["book","books","booking"], answer:0, explain:"I’d like to + base verb: book." },
    { key:"pf2", prompt:"Do you have ____ for Friday night?", choices:["availability","available","avails"], answer:0, explain:"Availability = rooms free." },
    { key:"pf3", prompt:"Could I have a room ____ a view?", choices:["with","by","in"], answer:0, explain:"a room with a view." },
    { key:"pf4", prompt:"I’m ____ to book two nights.", choices:["calling","call","called"], answer:0, explain:"Present continuous for now: I'm calling." },
    { key:"pf5", prompt:"May I ____ the price, please?", choices:["know","knowing","knew"], answer:0, explain:"May I + base verb: know." },
  ];

  const sentenceBuild = {
    key:"sb1",
    target:"I’d like to book a room for two nights.",
    tokens:["I’d","like","to","book","a","room","for","two","nights."]
  };

  const dictations = [
    { key:"d1", label:"Arrival time", say:"Your arrival time is one eight three zero.", expectedDigits:"1830", hint:"Type: 18:30 or 1830" },
    { key:"d2", label:"Nights", say:"You stay for two nights. Type the number two.", expectedDigits:"2", hint:"Type: 2" },
    { key:"d3", label:"Room number", say:"Your room number is three one seven.", expectedDigits:"317", hint:"Type: 317" },
    { key:"d4", label:"Check-out time", say:"Check out at twelve.", expectedDigits:"12", hint:"Type: 12" },
    { key:"d5", label:"Phone (Québec example)", say:"The number is four one eight six nine two three eight six one.", expectedDigits:"4186923861", hint:"Type digits only" },
  ];

  const places = [
    { id:"p1", label:"🛎️ Reception desk", place:"Entrance / Lobby" },
    { id:"p2", label:"🧳 Luggage", place:"Reception desk" },
    { id:"p3", label:"🍽️ Restaurant", place:"Ground floor" },
    { id:"p4", label:"🏊 Pool / Spa", place:"Wellness area" },
    { id:"p5", label:"🏋️ Gym", place:"Wellness area" },
    { id:"p6", label:"🛗 Elevator", place:"Lobby" },
  ];

  const placeBoxes = [
    { name:"Entrance / Lobby", icon:"🚪", desc:"Main entrance area (big open space)." },
    { name:"Reception desk", icon:"🛎️", desc:"Front desk to check in and ask for help." },
    { name:"Ground floor", icon:"⬇️", desc:"Floor 0 / street level (often the restaurant)." },
    { name:"Wellness area", icon:"🧖", desc:"Pool / spa / gym area." },
    { name:"Lobby", icon:"🛗", desc:"Elevators are usually in the lobby." }
  ];

  const prepositionsQuiz = [
    { key:"pr1", prompt:"The elevator is ____ the reception desk.", choices:["next to","on","under"], answer:0, explain:"Elevator next to reception is common." },
    { key:"pr2", prompt:"The restaurant is ____ the ground floor.", choices:["on","behind","between"], answer:0, explain:"We say: on the ground floor." },
    { key:"pr3", prompt:"Please wait ____ the lobby.", choices:["in","at","between"], answer:0, explain:"Wait in the lobby." },
    { key:"pr4", prompt:"Your room is ____ the 5th floor.", choices:["on","in front of","under"], answer:0, explain:"Rooms are on a floor." },
    { key:"pr5", prompt:"The check-in desk is ____ the entrance.", choices:["near","under","inside of"], answer:0, explain:"Near = close to." },
  ];

  const hotelMapLines = [
    {ico:"🚪", txt:"The <span class='k'>entrance</span> is the main door. The <span class='k'>lobby</span> is the big open area when you enter."},
    {ico:"🛎️", txt:"The <span class='k'>reception desk</span> is <span class='k'>in the lobby</span>, usually <span class='k'>near the entrance</span>."},
    {ico:"🛗", txt:"The <span class='k'>elevator</span> is usually <span class='k'>next to</span> reception (in the lobby)."},
    {ico:"🧳", txt:"Your <span class='k'>luggage</span> can stay <span class='k'>at the reception desk</span> (luggage storage)."},
    {ico:"🍽️", txt:"The <span class='k'>restaurant</span> is often <span class='k'>on the ground floor</span>."},
    {ico:"🧖", txt:"The <span class='k'>pool</span>, <span class='k'>spa</span>, and <span class='k'>gym</span> are in the <span class='k'>wellness area</span>."}
  ];


  const dialogueSteps = [
    {
      key:"dg1",
      staff:"🛎️ Receptionist: Good evening! Welcome. How may I help you?",
      question:"Choose your reply:",
      choices:[
        {txt:"Polite: Good evening. I have a reservation under Ms. Martin.", ok:true, explain:"Great! Polite + clear."},
        {txt:"Casual: Hey. I’m here.", ok:false, explain:"Too vague. Use a greeting + reservation name."}
      ]
    },
    {
      key:"dg2",
      staff:"🛎️ Receptionist: May I see your ID, please?",
      question:"Choose your reply:",
      choices:[
        {txt:"Polite: Yes, of course. Here you are.", ok:true, explain:"Perfect polite answer."},
        {txt:"Casual: Yeah. Take it.", ok:false, explain:"Sounds rude. Try 'Here you are'."}
      ]
    },
    {
      key:"dg3",
      staff:"🛎️ Receptionist: What time will you arrive tomorrow?",
      question:"Choose your reply:",
      choices:[
        {txt:"Polite: Around 18:30. Thank you for your help.", ok:true, explain:"Great. Clear time + thanks."},
        {txt:"Casual: Late.", ok:false, explain:"Not clear. Give a time."}
      ]
    },
    {
      key:"dg4",
      staff:"🛎️ Receptionist: Here is your key card. The elevator is next to reception.",
      question:"Choose your reply:",
      choices:[
        {txt:"Polite: Thank you. Could you repeat that, please?", ok:true, explain:"Good polite request."},
        {txt:"Casual: What?", ok:false, explain:"Try 'Could you repeat that, please?'"}
      ]
    }
  ];

  
  const oralPrompts = [
    { key:"o1", text:"Good evening. I have a reservation under Ms. Martin." },
    { key:"o2", text:"I’d like to book a room for two nights, please." },
    { key:"o3", text:"Could I have a room with a view, if possible?" }
  ];


  const checkinFill = [
    { key:"cf1", prompt:"Good evening. I have a ____ under Ms. Martin.", choices:["reservation","reservations","reserve"], answer:0, explain:"a reservation" },
    { key:"cf2", prompt:"Could I have a room ____ a view, please?", choices:["with","at","of"], answer:0, explain:"with a view" },
    { key:"cf3", prompt:"I’ll pay by ____ card.", choices:["credit","credits","credited"], answer:0, explain:"credit card" },
    { key:"cf4", prompt:"Where is the ____?", choices:["elevator","elevate","elevation"], answer:0, explain:"elevator" },
  ];

  // ---------------------------
  // Render helpers
  // ---------------------------
  function renderReading(el, lines){
    el.innerHTML = lines.map(l => `
      <div class="line">
        <div class="ico">${l.ico}</div>
        <div>${l.txt}</div>
      </div>
    `).join("");
  }

  function plainTextFromReading(lines){
    return lines.map(l => l.txt.replace(/<[^>]*>/g, "")).join(" ");
  }

  function makeQuiz(host, questions, opts={}){
    const {
      onReset = () => {},
      awardPrefix = "q",
    } = opts;

    host.innerHTML = "";
    questions.forEach((q, idx) => {
      const qEl = document.createElement("div");
      qEl.className = "q";
      qEl.innerHTML = `
        <div class="q__prompt">${idx+1}. ${q.prompt}</div>
        <div class="choices"></div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const choicesEl = $(".choices", qEl);
      const fb = $(".feedback", qEl);

      q.choices.forEach((c, i) => {
        const row = document.createElement("label");
        row.className = "choice";
        row.innerHTML = `
          <input type="radio" name="${q.key}" value="${i}" />
          <div>${c}</div>
        `;
        row.addEventListener("click", () => {
          const picked = i;
          const correct = picked === q.answer;
          fb.classList.remove("hidden", "ok", "no");
          fb.classList.add(correct ? "ok" : "no");
          fb.innerHTML = correct
            ? `✅ Correct! <span class="muted">${q.explain || ""}</span>`
            : `❌ Not quite. <strong>Answer:</strong> ${q.choices[q.answer]}. <span class="muted">${q.explain || ""}</span>`;

          if(correct) Score.award(`${awardPrefix}:${q.key}`, 1);
        });
        choicesEl.appendChild(row);
      });

      host.appendChild(qEl);
    });

    return {
      reset(){
        $$("input[type=radio]", host).forEach(i => i.checked = false);
        $$(".feedback", host).forEach(f => f.classList.add("hidden"));
        onReset();
      }
    };
  }

  // Flashcards
  function renderFlashcards(){
    const host = $("#flashcards");
    const groupSel = $("#vocabGroup").value;
    let list = vocab.slice();
    if(groupSel !== "all") list = list.filter(v => v.group === groupSel);

    host.innerHTML = "";
    list.forEach((v, idx) => {
      const card = document.createElement("div");
      card.className = "flashcard";
      card.dataset.word = v.word;
      card.innerHTML = `
        <div class="flashcard__face flashcard__front">
          <div class="fcTop">
            <div class="fcIcon">${v.icon}</div>
            <div class="fcGroup">#${v.group}</div>
          </div>
          <div class="fcWord">${v.word}</div>
          <div class="muted tiny">Click to flip ➜</div>
          <div class="fcBtns">
            <button class="iconbtn" type="button" data-say="${escapeHtml(v.word)}">🔊 Word</button>
          </div>
        </div>

        <div class="flashcard__face flashcard__back">
          <div class="badge">Meaning</div>
          <div class="fcDef">${v.def}</div>
          <div class="badge">Example</div>
          <div class="fcEx">${v.ex}</div>
          <div class="fcBtns">
            <button class="iconbtn" type="button" data-say="${escapeHtml(v.def)}">🔊 Meaning</button>
            <button class="iconbtn" type="button" data-say="${escapeHtml(v.ex)}">🔊 Example</button>
            <button class="iconbtn" type="button" data-back="1">↩ Front</button>
          </div>
        </div>
      `;

      card.addEventListener("click", (e) => {
        const t = e.target;
        if(t && (t.tagName === "BUTTON" || t.closest("button"))) return;
        card.classList.toggle("is-flipped");
      });

      $$("button[data-say]", card).forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          Speech.say(btn.getAttribute("data-say"));
        });
      });
      const backBtn = $("button[data-back]", card);
      backBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.remove("is-flipped");
      });

      host.appendChild(card);
    });
  }

  // Mini vocab quiz
  function buildVocabMiniQuiz(){
    const host = $("#vocabMiniQuizHost");
    host.innerHTML = "";
    // pick 6 random
    const pool = shuffle(vocab.slice()).slice(0, 6);
    pool.forEach((item, idx) => {
      const wrong = shuffle(vocab.filter(v => v.word !== item.word)).slice(0, 2).map(v => v.def);
      const choices = shuffle([item.def, ...wrong]);
      const q = {
        key:`vm${idx+1}`,
        prompt:`${item.icon} What does “${item.word}” mean?`,
        choices,
        answer: choices.indexOf(item.def),
        explain: `Example: ${item.ex}`
      };
      const qEl = document.createElement("div");
      qEl.className = "q";
      qEl.innerHTML = `
        <div class="q__prompt">${q.prompt}</div>
        <div class="choices"></div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const choicesEl = $(".choices", qEl);
      const fb = $(".feedback", qEl);

      q.choices.forEach((c, i) => {
        const row = document.createElement("label");
        row.className = "choice";
        row.innerHTML = `<input type="radio" name="${q.key}" /><div>${escapeHtml(c)}</div>`;
        row.addEventListener("click", () => {
          const correct = i === q.answer;
          fb.classList.remove("hidden", "ok", "no");
          fb.classList.add(correct ? "ok" : "no");
          fb.innerHTML = correct
            ? `✅ Correct! <span class="muted">${escapeHtml(q.explain)}</span>`
            : `❌ Not quite. <strong>Answer:</strong> ${escapeHtml(q.choices[q.answer])}. <span class="muted">${escapeHtml(q.explain)}</span>`;
          if(correct) Score.award(`vocabMini:${q.key}`, 1);
        });
        choicesEl.appendChild(row);
      });

      host.appendChild(qEl);
    });
  }

  // Sentence builder (drag OR click)
  function buildSentenceBuilder(host){
    host.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "builder";

    const bank = document.createElement("div");
    bank.className = "bank";
    bank.setAttribute("aria-label","Word bank");

    const zone = document.createElement("div");
    zone.className = "dropzone";
    zone.setAttribute("aria-label","Build sentence here");

    const actions = document.createElement("div");
    actions.className = "smallrow";
    actions.innerHTML = `
      <button class="btn" type="button" data-check="1">✅ Check</button>
      <button class="btn btn--ghost" type="button" data-clear="1">🧹 Clear</button>
      <div class="muted tiny">Target: <span class="kbd">${sentenceBuild.target}</span></div>
    `;

    const fb = document.createElement("div");
    fb.className = "feedback hidden";

    wrap.appendChild(bank);
    wrap.appendChild(zone);
    wrap.appendChild(actions);
    wrap.appendChild(fb);
    host.appendChild(wrap);

    const tokens = sentenceBuild.tokens.map(t => makeToken(t));
    tokens.forEach(t => bank.appendChild(t));

    // drag logic
    initDragZone(bank, zone);
    initDragZone(zone, bank);

    // click fallback
    function moveToken(tok, to){
      to.appendChild(tok);
    }
    bank.addEventListener("click", (e) => {
      const tok = e.target.closest(".token");
      if(!tok) return;
      moveToken(tok, zone);
    });
    zone.addEventListener("click", (e) => {
      const tok = e.target.closest(".token");
      if(!tok) return;
      moveToken(tok, bank);
    });

    // check
    $('[data-check]', actions).addEventListener("click", () => {
      const built = $$(".token", zone).map(t => t.textContent.trim()).join(" ").replace(/\s+/g," ").trim();
      const target = sentenceBuild.target.replace(/\s+/g," ").trim();
      const ok = normalize(built) === normalize(target);

      fb.classList.remove("hidden","ok","no");
      fb.classList.add(ok ? "ok" : "no");
      fb.textContent = ok
        ? "✅ Perfect! Great sentence."
        : `❌ Not yet. Your sentence: “${built || "—"}”`;
      if(ok) Score.award(`sentence:${sentenceBuild.key}`, 2);
    });

    $('[data-clear]', actions).addEventListener("click", () => {
      // move all to bank
      $$(".token", zone).forEach(t => bank.appendChild(t));
      fb.classList.add("hidden");
    });

    return {
      reset(){
        $$(".token", zone).forEach(t => bank.appendChild(t));
        fb.classList.add("hidden");
      }
    };
  }

  function makeToken(text){
    const t = document.createElement("div");
    t.className = "token";
    t.draggable = true;
    t.textContent = text;
    t.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", text);
      e.dataTransfer.effectAllowed = "move";
      t.classList.add("is-dragging");
      setTimeout(()=>t.classList.remove("is-dragging"), 0);
      // store element id reference
      t.dataset.dragId = String(Math.random()).slice(2);
      e.dataTransfer.setData("application/x-token-id", t.dataset.dragId);
      window.__dragToken = t;
    });
    return t;
  }

  function initDragZone(a, b){
    // a can drop from b and vice versa
    [a,b].forEach(zone => {
      zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        zone.classList.add("is-over");
      });
      zone.addEventListener("dragleave", () => zone.classList.remove("is-over"));
      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.classList.remove("is-over");
        const tok = window.__dragToken;
        if(tok) zone.appendChild(tok);
      });
    });
  }

  function normalize(s){
    return String(s || "")
      .replace(/[’']/g,"'")
      .replace(/\s+/g," ")
      .trim()
      .toLowerCase();
  }

  function escapeHtml(s){
    return String(s || "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function shuffle(arr){
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Dictation
  function buildDictation(host){
    host.innerHTML = "";
    dictations.forEach((d, idx) => {
      const row = document.createElement("div");
      row.className = "q";
      row.innerHTML = `
        <div class="q__prompt">${idx+1}. ${d.label}</div>
        <div class="smallrow">
          <button class="btn btn--ghost" type="button" data-play="1">🔊 Play</button>
          <input class="input" data-in="1" placeholder="${d.hint}" style="max-width:260px;" />
          <button class="btn" type="button" data-check="1">✅ Check</button>
        </div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const play = $('[data-play]', row);
      const inp = $('[data-in]', row);
      const check = $('[data-check]', row);
      const fb = $(".feedback", row);

      play.addEventListener("click", () => Speech.say(d.say));
      check.addEventListener("click", () => {
        const digits = String(inp.value || "").replace(/\D/g,"");
        const ok = digits === d.expectedDigits;
        fb.classList.remove("hidden","ok","no");
        fb.classList.add(ok ? "ok" : "no");
        fb.innerHTML = ok
          ? "✅ Correct!"
          : `❌ Not quite. <strong>Answer:</strong> ${d.expectedDigits}`;
        if(ok) Score.award(`dict:${d.key}`, 1);
      });

      host.appendChild(row);
    });
  }

  // Place match (drag OR click)
  function buildPlaceMatch(host){
    host.innerHTML = "";

    const bank = document.createElement("div");
    bank.className = "bank";
    bank.setAttribute("aria-label","Items");

    const grid = document.createElement("div");
    grid.className = "placegrid";

    const fb = document.createElement("div");
    fb.className = "feedback hidden";

    // clickable selection
    let selectedToken = null;

    // tokens
    const tokens = places.map(p => {
      const t = makeToken(p.label);
      t.dataset.place = p.place;
      t.dataset.pid = p.id;
      return t;
    });
    tokens.forEach(t => bank.appendChild(t));

    // boxes
    const boxes = {};
    placeBoxes.forEach(bx => {
      const el = document.createElement("div");
      el.className = "placebox";
      el.innerHTML = `
        <div class="placebox__t">${bx.icon} ${bx.name}</div>
        <div class="placebox__desc">${bx.desc || ""}</div>
        <div class="placebox__drop" data-drop="${bx.name}" aria-label="Drop zone ${bx.name}"></div>
      `;
      const drop = $(".placebox__drop", el);
      boxes[bx.name] = drop;
      grid.appendChild(el);

      // click-to-place
      drop.addEventListener("click", () => {
        if(!selectedToken) return;
        drop.appendChild(selectedToken);
        selectedToken = null;
      });

      // drag drop
      drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("is-over"); });
      drop.addEventListener("dragleave", () => drop.classList.remove("is-over"));
      drop.addEventListener("drop", (e) => {
        e.preventDefault();
        drop.classList.remove("is-over");
        const tok = window.__dragToken;
        if(tok) drop.appendChild(tok);
      });
    });

    host.appendChild(bank);
    host.appendChild(grid);

    const actions = document.createElement("div");
    actions.className = "smallrow";
    actions.style.marginTop = ".6rem";
    actions.innerHTML = `
      <button class="btn" type="button" data-check="1">✅ Check</button>
      <button class="btn btn--ghost" type="button" data-clear="1">↺ Reset</button>
    `;
    host.appendChild(actions);
    host.appendChild(fb);

    // click select
    bank.addEventListener("click", (e) => {
      const tok = e.target.closest(".token");
      if(!tok) return;
      selectedToken = tok;
      // subtle highlight
      $$(".token", host).forEach(t => t.style.outline = "");
      tok.style.outline = "3px solid rgba(24,167,166,.28)";
    });

    host.addEventListener("click", (e) => {
      // clear outline if clicked elsewhere
      if(!e.target.closest(".token")) {
        $$(".token", host).forEach(t => t.style.outline = "");
      }
    });

    $('[data-check]', actions).addEventListener("click", () => {
      let okCount = 0;
      tokens.forEach(t => {
        const parentDrop = t.parentElement;
        const target = t.dataset.place;
        if(parentDrop && parentDrop.dataset && parentDrop.dataset.drop === target) okCount++;
      });

      const perfect = okCount === tokens.length;
      fb.classList.remove("hidden","ok","no");
      fb.classList.add(perfect ? "ok" : "no");
      fb.textContent = perfect
        ? "✅ Perfect! Great job."
        : `❌ You have ${okCount}/${tokens.length} correct. Try again.`;

      if(perfect) Score.award("placeMatch:perfect", 2);
    });

    $('[data-clear]', actions).addEventListener("click", () => {
      tokens.forEach(t => bank.appendChild(t));
      fb.classList.add("hidden");
      selectedToken = null;
      $$(".token", host).forEach(t => t.style.outline = "");
    });

    // allow drag back to bank
    bank.addEventListener("dragover", (e) => { e.preventDefault(); bank.classList.add("is-over"); });
    bank.addEventListener("dragleave", () => bank.classList.remove("is-over"));
    bank.addEventListener("drop", (e) => {
      e.preventDefault();
      bank.classList.remove("is-over");
      const tok = window.__dragToken;
      if(tok) bank.appendChild(tok);
    });

    return {
      reset(){
        tokens.forEach(t => bank.appendChild(t));
        fb.classList.add("hidden");
        selectedToken = null;
        $$(".token", host).forEach(t => t.style.outline = "");
      }
    };
  }

  // Email builder
  function buildEmail(){
    const name = ($("#emName").value || "Your Name").trim();
    const hotel = $("#emHotel").value;
    const date = ($("#emDate").value || "your arrival date").trim();
    const time = $("#emTime").value;
    const tone = $("#emTone").value;

    const greeting = tone === "polite"
      ? "Dear Front Desk Team,"
      : "Hello,";

    const body = tone === "polite"
      ? `I hope you are well. My name is ${name}, and I have a reservation at ${hotel}. I would like to confirm my arrival on ${date} at around ${time}. Thank you very much for your help.`
      : `I have a reservation at ${hotel}. I will arrive on ${date} at ${time}. Thank you.`;

    const closing = tone === "polite"
      ? `Kind regards,\n${name}`
      : `Thanks,\n${name}`;

    return `${greeting}\n\n${body}\n\n${closing}`;
  }

  // ---------------------------
  // Confetti
  // ---------------------------
  function confettiBurst(){
    const host = $("#confetti");
    host.innerHTML = "";
    const n = 90;
    for(let i=0;i<n;i++){
      const p = document.createElement("i");
      p.style.left = Math.random()*100 + "vw";
      p.style.animationDelay = (Math.random()*0.2) + "s";
      p.style.transform = `translateY(-10px) rotate(${Math.random()*360}deg)`;
      // random bright-ish colors without hardcoding a palette
      const hue = Math.floor(Math.random()*360);
      p.style.background = `hsl(${hue} 85% 55%)`;
      host.appendChild(p);
    }
    setTimeout(()=>host.innerHTML="", 1600);
  }

  // ---------------------------
  // Init + wiring
  // ---------------------------
  let quizReadAPI, quizRoomAPI, quizPhoneFillAPI, quizPrepAPI, quizCheckinFillAPI;
  let sentenceAPI, placeAPI;

  function computeMaxScore(){
    // scoring:
    // vocab mini quiz: 6
    // reading quiz: 5
    // room quiz: 4
    // phone fill: 5
    // sentence builder: 2 (award 2 pts)
    // email builder: 1 (build email gives 1)
    // dictations: 5
    // place match perfect: 2
    // prepositions: 5
    // dialogue: 4 (one per step)
    // check-in fill: 4
    const max = 6 + 5 + 4 + 5 + 2 + 1 + 5 + 2 + 5 + 4 + 4 + 3;
    Score.setMax(max);
  }

  function init(){
    computeMaxScore();

    // voice toggle
    $("#voiceUS").addEventListener("click", () => setVoice("en-US"));
    $("#voiceUK").addEventListener("click", () => setVoice("en-GB"));

    $("#btnPause").addEventListener("click", () => Speech.pause());
    $("#btnResume").addEventListener("click", () => Speech.resume());
    $("#btnStop").addEventListener("click", () => Speech.stop());

    $("#btnResetAll").addEventListener("click", () => resetAll());

    // start tour
    $("#btnStartTour").addEventListener("click", () => {
      document.getElementById("sec1").scrollIntoView({behavior:"smooth"});
    });

    // modal
    $("#btnHowTo").addEventListener("click", () => openModal(true));
    $("#modalClose").addEventListener("click", () => openModal(false));
    $("#modalOk").addEventListener("click", () => openModal(false));
    $("#modal").addEventListener("click", (e) => {
      if(e.target.id === "modal") openModal(false);
    });

    // render reading
    renderReading($("#banffReading"), banffReadingLines);
    renderReading($("#frontenacReading"), frontenacReadingLines);
    renderReading($("#roomTypeText"), roomTypeLines);
    renderReading($("#phoneLessonText"), phoneLessonLines);
    renderReading($("#titlesText"), titlesLines);
    const hm = $("#hotelMapText");
    if(hm) renderReading(hm, hotelMapLines);

    // read aloud buttons
    $$("button[data-say]").forEach(btn => {
      btn.addEventListener("click", () => Speech.say(btn.getAttribute("data-say")));
    });
    $$("button[data-say]").forEach(btn => {}); // keep

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    // "listen" buttons that point to element ids
    $$("button[data-say]").forEach(()=>{});
    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});
    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});
    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    // element listen buttons (data-say="elementId")
    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    // Better: buttons with data-say="elementId" are handled separately below
    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    $$("button[data-say]").forEach(()=>{});

    // Listen buttons with data-say=elementId
    $$("button[data-say]").forEach(btn => {
      const v = btn.getAttribute("data-say");
      // If there's an element with that id, read its innerText instead
      const el = document.getElementById(v);
      if(el){
        btn.addEventListener("click", () => Speech.say(el.innerText));
      }
    });

    // Flashcards
    $("#vocabGroup").addEventListener("change", () => renderFlashcards());
    $("#btnVocabShuffle").addEventListener("click", () => {
      shuffle(vocab);
      renderFlashcards();
    });
    $("#btnVocabMiniQuiz").addEventListener("click", () => {
      $("#vocabMiniQuiz").classList.toggle("hidden");
      buildVocabMiniQuiz();
    });
    $("#btnVocabMiniReset").addEventListener("click", () => {
      buildVocabMiniQuiz();
    });

    renderFlashcards();

    // Reading quiz
    quizReadAPI = makeQuiz($("#readQuizHost"), readingQuiz, {awardPrefix:"read"});
    $("#btnReadQuizReset").addEventListener("click", () => quizReadAPI.reset());

    // Room quiz
    quizRoomAPI = makeQuiz($("#roomQuizHost"), roomQuiz, {awardPrefix:"room"});
    $("#btnRoomQuizReset").addEventListener("click", () => quizRoomAPI.reset());

    // Booking summary
    $("#btnMakeSummary").addEventListener("click", () => {
      const hotel = $("#bkHotel").value;
      const room = $("#bkRoom").value;
      const guests = $("#bkGuests").value;
      const nights = $("#bkNights").value;
      const time = $("#bkTime").value;
      const out = `✅ Booking summary:\n• Hotel: ${hotel}\n• Room: ${room}\n• Guests: ${guests}\n• Nights: ${nights}\n• Arrival time: ${time}\n\nTip: You can say: “I’m arriving at ${time}.”`;
      $("#bookingSummary").textContent = out;
    });
    $("#btnSummaryReset").addEventListener("click", () => {
      $("#bookingSummary").textContent = "";
    });
    $("#btnBookingListen").addEventListener("click", () => {
      const txt = $("#bookingSummary").textContent.trim() || "Please build your booking summary first.";
      Speech.say(txt);
    });

    // Phone fill
    quizPhoneFillAPI = makeQuiz($("#phoneFillHost"), phoneFill, {awardPrefix:"phone"});
    $("#btnPhoneFillReset").addEventListener("click", () => quizPhoneFillAPI.reset());

    // Sentence builder
    sentenceAPI = buildSentenceBuilder($("#sentenceBuildHost"));
    $("#btnSentenceBuildReset").addEventListener("click", () => sentenceAPI.reset());

    // Oral practice (safe wiring)
    const oralHost = $("#oralHost");
    const oralReset = $("#btnOralReset");
    if (oralHost) buildOral(oralHost);
    if (oralHost && oralReset) oralReset.addEventListener("click", () => buildOral(oralHost));

    // Email builder
    $("#btnBuildEmail").addEventListener("click", () => {
      const msg = buildEmail();
      $("#emailOut").textContent = msg;
      // award 1 point once when they build a non-empty email with a name
      const name = ($("#emName").value || "").trim();
      if(name.length >= 2) Score.award("email:built", 1);
    });
    $("#btnEmailReset").addEventListener("click", () => {
      $("#emName").value = "";
      $("#emDate").value = "";
      $("#emTime").value = "18:30";
      $("#emTone").value = "polite";
      $("#emailOut").textContent = "";
    });
    $("#btnEmailListen").addEventListener("click", () => {
      const t = $("#emailOut").textContent.trim() || "Please build your email first.";
      Speech.say(t);
    });

    // Dictation
    buildDictation($("#dictationHost"));
    $("#btnDictReset").addEventListener("click", () => {
      buildDictation($("#dictationHost"));
    });

    // Place match
    placeAPI = buildPlaceMatch($("#placeMatchHost"));
    $("#btnPlaceMatchReset").addEventListener("click", () => placeAPI.reset());

    // Prepositions
    quizPrepAPI = makeQuiz($("#prepositionsHost"), prepositionsQuiz, {awardPrefix:"prep"});
    $("#btnPrepReset").addEventListener("click", () => quizPrepAPI.reset());

    // Dialogue
    buildDialogue($("#dialogueHost"));
    $("#btnDialogueReset").addEventListener("click", () => buildDialogue($("#dialogueHost")));

    // Check-in fill
    quizCheckinFillAPI = makeQuiz($("#checkinFillHost"), checkinFill, {awardPrefix:"checkin"});
    $("#btnCheckinFillReset").addEventListener("click", () => quizCheckinFillAPI.reset());

    // Celebrate
    $("#btnCelebrate").addEventListener("click", () => {
      const pct = Score.max ? Math.round((Score.now/Score.max)*100) : 0;
      const msg = pct >= 90
        ? `🌟 Amazing! You scored ${Score.now}/${Score.max} (${pct}%).`
        : `🎉 Great work! You scored ${Score.now}/${Score.max} (${pct}%). Try again to improve!`;
      $("#finalMsg").textContent = msg;
      confettiBurst();
    });

    // Fix: any button with data-say="elementId" should listen to that element
    $$("button[data-say]").forEach(btn => {
      const v = btn.getAttribute("data-say");
      const el = document.getElementById(v);
      if(el){
        btn.addEventListener("click", () => Speech.say(el.innerText));
      }
    });

    // Direct listen buttons for reading sections already use data-say="banffReading" etc (handled above)
    // Extra: Listen to room type text already works.

    updateProgress();
  }


  function buildOral(host){
    host.innerHTML = "";
    oralPrompts.forEach((p, idx) => {
      const row = document.createElement("div");
      row.className = "q";
      row.innerHTML = `
        <div class="q__prompt">${idx+1}. ${escapeHtml(p.text)}</div>
        <div class="smallrow">
          <button class="btn btn--ghost" type="button" data-play="1">🔊 Listen</button>
          <button class="btn" type="button" data-done="1">🗣️ I said it</button>
        </div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const play = $('[data-play]', row);
      const done = $('[data-done]', row);
      const fb = $(".feedback", row);

      play.addEventListener("click", () => Speech.say(p.text));
      done.addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("ok");
        fb.textContent = "✅ Great! (Now say it again with confidence.)";
        Score.award(`oral:${p.key}`, 1);
      });

      host.appendChild(row);
    });
  }


  function buildDialogue(host){
    host.innerHTML = "";
    dialogueSteps.forEach((step, idx) => {
      const card = document.createElement("div");
      card.className = "q";
      card.innerHTML = `
        <div class="q__prompt">${idx+1}. ${escapeHtml(step.staff)}</div>
        <div class="smallrow" style="margin-bottom:.35rem;">
          <button class="btn btn--ghost" type="button" data-play="1">🔊 Listen</button>
          <span class="muted tiny">${escapeHtml(step.question)}</span>
        </div>
        <div class="choices"></div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const play = $('[data-play]', card);
      const choicesEl = $(".choices", card);
      const fb = $(".feedback", card);

      play.addEventListener("click", () => Speech.say(step.staff));

      step.choices.forEach((c, i) => {
        const row = document.createElement("div");
        row.className = "choice";
        row.innerHTML = `<div>${escapeHtml(c.txt)}</div>`;
        row.addEventListener("click", () => {
          fb.classList.remove("hidden","ok","no");
          fb.classList.add(c.ok ? "ok" : "no");
          fb.innerHTML = c.ok
            ? `✅ Great choice! <span class="muted">${escapeHtml(c.explain)}</span>`
            : `❌ Try a more polite/clear answer. <span class="muted">${escapeHtml(c.explain)}</span>`;
          if(c.ok) Score.award(`dlg:${step.key}`, 1);
        });
        choicesEl.appendChild(row);
      });

      host.appendChild(card);
    });
  }

  function setVoice(lang){
    Speech.mode = lang;
    const us = $("#voiceUS");
    const uk = $("#voiceUK");
    const isUS = lang === "en-US";
    us.classList.toggle("is-on", isUS);
    uk.classList.toggle("is-on", !isUS);
    us.setAttribute("aria-pressed", String(isUS));
    uk.setAttribute("aria-pressed", String(!isUS));
  }

  function openModal(show){
    $("#modal").classList.toggle("hidden", !show);
  }

  function resetAll(){
    Speech.stop();
    Score.reset();

    // reset quizzes
    quizReadAPI?.reset();
    quizRoomAPI?.reset();
    quizPhoneFillAPI?.reset();
    quizPrepAPI?.reset();
    quizCheckinFillAPI?.reset();

    // reset builders
    sentenceAPI?.reset();
    placeAPI?.reset();

    // email + summaries + dictation
    $("#bookingSummary").textContent = "";
    $("#emailOut").textContent = "";
    $("#emName").value = "";
    $("#emDate").value = "";
    $("#emTime").value = "18:30";
    $("#emTone").value = "polite";

    buildDictation($("#dictationHost"));
    buildDialogue($("#dialogueHost"));
    const oralHost2 = $("#oralHost");
    if (oralHost2) buildOral(oralHost2);

    // close mini quiz
    $("#vocabMiniQuiz").classList.add("hidden");

    $("#finalMsg").textContent = "When you finish, click “Celebrate!” 🎉";
  }

  // ---------------------------
  // Boot
  // ---------------------------
  document.addEventListener("DOMContentLoaded", init);
})();
