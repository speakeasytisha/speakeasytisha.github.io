(() => {
  "use strict";

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const shuffle = (arr) => {
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function aOrAn(phrase){
    const w = String(phrase||"").trim();
    if(!w) return w;
    const first = w.replace(/^(a|an)\s+/i,"").trim();
    const ch = first[0]?.toLowerCase() || "";
    const vowel = ["a","e","i","o","u"].includes(ch);
    return (vowel ? "an " : "a ") + first;
  }

  // Speech
  let ACCENT = "US";
  let LEVEL = "A1";
  let voices = [];
  let voiceUS = null;
  let voiceUK = null;

  function refreshVoices(){
    if(!window.speechSynthesis) return;
    voices = speechSynthesis.getVoices();
    const pick = (lang, preferNames=[]) => {
      const list = voices.filter(v => (v.lang||"").toLowerCase().startsWith(lang.toLowerCase()));
      if(!list.length) return null;
      for(const nm of preferNames){
        const v = list.find(x => (x.name||"").toLowerCase().includes(nm.toLowerCase()));
        if(v) return v;
      }
      const notCompact = list.find(v => !/compact/i.test(v.name||""));
      return notCompact || list[0];
    };
    voiceUS = pick("en-us", ["samantha","ava","allison","alex","microsoft"]);
    voiceUK = pick("en-gb", ["daniel","serena","oliver","kate","microsoft"]);
  }

  function speak(text){
    if(!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = (LEVEL==="A1") ? 0.92 : 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;
    u.voice = (ACCENT==="UK" ? (voiceUK||voiceUS) : (voiceUS||voiceUK)) || null;
    u.lang = (ACCENT==="UK") ? "en-GB" : "en-US";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  if(window.speechSynthesis){
    refreshVoices();
    speechSynthesis.onvoiceschanged = refreshVoices;
  }

  // Tabs
  $$(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".tab").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const id = btn.dataset.tab;
      $$(".panel").forEach(p => p.classList.remove("is-active"));
      $("#tab-"+id).classList.add("is-active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Top actions
  $("#btnPrint").addEventListener("click", () => window.print());
  $("#accentUS").addEventListener("click", () => setAccent("US"));
  $("#accentUK").addEventListener("click", () => setAccent("UK"));
  function setAccent(a){
    ACCENT = a;
    $("#accentUS").classList.toggle("is-active", a==="US");
    $("#accentUK").classList.toggle("is-active", a==="UK");
  }

  $("#lvlA1").addEventListener("click", () => setLevel("A1"));
  $("#lvlA2").addEventListener("click", () => setLevel("A2"));
  function setLevel(l){
    LEVEL = l;
    $("#lvlA1").classList.toggle("is-active", l==="A1");
    $("#lvlA2").classList.toggle("is-active", l==="A2");
    renderWarmup();
    renderDialogsAll();
    newBoard();
    resetSentenceBuilder();
    newMission();
    newSubjects();
  }

  // Scenarios
  const SCENARIOS = [
    { id:"town", icon:"🧭", label:"New in town", tag:"New in town", nouns:["an appointment","a meeting","a class"], placeHints:["at the office","at the clinic","at the desk"] },
    { id:"hobby", icon:"🎯", label:"Free time & hobbies", tag:"Hobbies", nouns:["a class","a session","a lesson"], placeHints:["at the studio","at the club","online"] },
    { id:"vol", icon:"🤝", label:"Community volunteer", tag:"Volunteer", nouns:["a shift","a meeting","a visit"], placeHints:["at the community center","on site","at the shelter"] },
    { id:"event", icon:"💐", label:"Event planning", tag:"Event planning", nouns:["a meeting","a call","a visit"], placeHints:["at the venue","at the office","on site"] },
    { id:"animals", icon:"🐾", label:"Animals & care", tag:"Animals", nouns:["a visit","a check-up","a shift"], placeHints:["at the shelter","at the vet","on site"] },
    { id:"reserve", icon:"🍽️", label:"Reservations (restaurant / hotel)", tag:"Reservations", nouns:["a reservation","a table","a booking"], placeHints:["at the restaurant","at the hotel","at the front desk"] },
  ];
  let SCENARIO = SCENARIOS[0];

  const scenarioChips = $("#scenarioChips");
  function renderScenarioChips(){
    scenarioChips.innerHTML = SCENARIOS.map(s => `
      <button class="chip ${s.id===SCENARIO.id?'is-active':''}" type="button" data-id="${esc(s.id)}">
        ${esc(s.icon)} ${esc(s.label)}
      </button>
    `).join("");
  }
  renderScenarioChips();
  scenarioChips.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-id]");
    if(!b) return;
    const id = b.dataset.id;
    SCENARIO = SCENARIOS.find(x => x.id === id) || SCENARIO;
    renderScenarioChips();
    renderWarmup();
    renderDialogsAll();
    newMission();
    $("#homeFb").textContent = `Scenario set: ${SCENARIO.label}. Same grammar, different examples.`;
  });

  // Warmup
  const WARMUP_BASE = [
    "Hello! I'd like an appointment.",
    "I’d like to make a reservation.",
    "I’m available on Tuesday.",
    "I’m available at 2:30 PM.",
    "I’m not available on Friday.",
    "Does Thursday work for you?",
    "Can we change the time?",
    "Can we move it to next week?",
    "So it’s on Tuesday at 2:30 PM.",
    "Perfect. Thank you.",
    "What time is the meeting?"
  ];
  function scenarioWarmups(){
    const noun = SCENARIO.nouns[0];
    const place = SCENARIO.placeHints[0];
    return [
      `Hello! I’d like ${noun}.`,
      `Is it ${noun} ${place}?`,
      `I’m available on Wednesday morning.`,
      `I’m not available in the afternoon.`,
      `Does Monday work for you?`,
      `Can we reschedule?`,
      `Can we confirm the time, please?`,
      `So it’s on Thursday at 4:15 PM.`,
    ];
  }

  const warmupChips = $("#warmupChips");
  function renderWarmup(){
    const items = shuffle(WARMUP_BASE.concat(scenarioWarmups())).slice(0, 10);
    warmupChips.innerHTML = items.map(t => `<button class="chip" type="button" data-say="${esc(t)}">${esc(t)}</button>`).join("");
  }
  renderWarmup();
  warmupChips.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-say]");
    if(!b) return;
    speak(b.dataset.say);
  });
  $("#warmupNew").addEventListener("click", renderWarmup);

  const patterns = [
    {en:"I’m available on Tuesday at 2:30 PM.", fr:"Je suis disponible mardi à 14h30."},
    {en:"I’m not available on Friday.", fr:"Je ne suis pas disponible vendredi."},
    {en:"Does Thursday work for you?", fr:"Est-ce que jeudi vous convient ?"},
    {en:"Can we change the time?", fr:"Est-ce qu’on peut changer l’heure ?"},
    {en:"Can we move it to next week?", fr:"Est-ce qu’on peut le déplacer à la semaine prochaine ?"},
    {en:"So it’s on Monday at 9:00 AM.", fr:"Donc c’est lundi à 9h00."},
    {en:"Where is the office?", fr:"Où est le bureau ?"},
    {en:"How much is it?", fr:"C’est combien ? / Quel est le prix ?"},
    {en:"I’d like to make a reservation.", fr:"Je voudrais faire une réservation."},
    {en:"I’d like to sign up for a class.", fr:"Je voudrais m’inscrire à un cours."},
    {en:"I’d like to reserve a table for two.", fr:"Je voudrais réserver une table pour deux."},
  ];
  const patternTable = $("#patternTable");
  function renderPatternTable(){
    patternTable.innerHTML = patterns.map(p => `
      <tr>
        <td><strong>${esc(p.en)}</strong></td>
        <td>${esc(p.fr)}</td>
        <td><button class="sbtn" type="button" data-say="${esc(p.en)}">🔊</button></td>
      </tr>
    `).join("");
  }
  renderPatternTable();
  patternTable.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-say]");
    if(!b) return;
    speak(b.dataset.say);
  });

  $("#btnWarmupSpeak").addEventListener("click", () => {
    speak(`Warm-up. ${SCENARIO.label}. Repeat: I’m available on Tuesday at 2:30 PM. Does Thursday work for you?`);
  });
  $("#btnStart").addEventListener("click", () => $(`.tab[data-tab="vocab"]`).click());

  // WH table
  const WH = [
    {en:"What", fr:"quoi / que", ex:"What time is the meeting?"},
    {en:"When", fr:"quand", ex:"When do you meet?"},
    {en:"Where", fr:"où", ex:"Where is the office?"},
    {en:"Who", fr:"qui", ex:"Who do I ask?"},
    {en:"Why", fr:"pourquoi", ex:"Why do you call?"},
    {en:"How", fr:"comment", ex:"How do you get there?"},
    {en:"How much", fr:"combien (prix)", ex:"How much is it?"},
  ];
  const whTable = $("#whTable");
  function renderWHTable(){
    whTable.innerHTML = WH.map(w => `
      <tr>
        <td><strong>${esc(w.en)}</strong></td>
        <td>${esc(w.fr)}</td>
        <td>${esc(w.ex)}</td>
        <td><button class="sbtn" type="button" data-say="${esc(w.ex)}">🔊</button></td>
      </tr>
    `).join("");
  }
  renderWHTable();
  whTable.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-say]");
    if(!b) return;
    speak(b.dataset.say);
  });

  // Vocabulary items
  const vocabItems = [
    {cat:"core", icon:"📅", en:"appointment", fr:"rendez-vous", ex:"I have an appointment on Tuesday."},
    {cat:"core", icon:"🗓️", en:"schedule", fr:"planning", ex:"My schedule is busy."},
    {cat:"core", icon:"✅", en:"available", fr:"disponible", ex:"I’m available on Thursday."},
    {cat:"core", icon:"🚫", en:"not available", fr:"pas disponible", ex:"I’m not available in the afternoon."},
    {cat:"core", icon:"🪄", en:"book (an appointment)", fr:"prendre / réserver", ex:"I book an appointment."},
    {cat:"core", icon:"🔁", en:"reschedule", fr:"reprogrammer", ex:"Can we reschedule?"},
    {cat:"core", icon:"🧾", en:"confirm", fr:"confirmer", ex:"Can you confirm the time?"},
    {cat:"core", icon:"🍽️", en:"reservation", fr:"réservation", ex:"I have a reservation on Saturday."},
    {cat:"core", icon:"🪑", en:"reserve a table", fr:"réserver une table", ex:"I reserve a table for two."},
    {cat:"core", icon:"📝", en:"sign up for", fr:"s’inscrire à", ex:"I sign up for a class."},
    {cat:"core", icon:"❌", en:"cancel", fr:"annuler", ex:"I cancel the appointment."},
    {cat:"core", icon:"📍", en:"location / address", fr:"lieu / adresse", ex:"Where is the office?"},
    {cat:"core", icon:"📞", en:"call", fr:"appeler", ex:"I call the office."},
    {cat:"core", icon:"✉️", en:"email", fr:"email", ex:"I send an email."},

    {cat:"time", icon:"⏰", en:"What time is it?", fr:"Quelle heure est-il ?", ex:"What time is it?"},
    {cat:"time", icon:"🕘", en:"at 9:00 AM", fr:"à 9h00", ex:"The meeting is at 9:00 AM."},
    {cat:"time", icon:"🕝", en:"at 2:30 PM", fr:"à 14h30", ex:"I’m available at 2:30 PM."},
    {cat:"time", icon:"🌅", en:"in the morning", fr:"le matin", ex:"I’m available in the morning."},
    {cat:"time", icon:"🌤️", en:"in the afternoon", fr:"l’après-midi", ex:"I’m not available in the afternoon."},
    {cat:"time", icon:"🌙", en:"in the evening", fr:"le soir", ex:"I study in the evening."},
    {cat:"time", icon:"🗓️", en:"next week", fr:"la semaine prochaine", ex:"Can we move it to next week?"},
    {cat:"time", icon:"📆", en:"this week", fr:"cette semaine", ex:"This week is busy."},

    {cat:"questions", icon:"❓", en:"Does Tuesday work for you?", fr:"Est-ce que mardi vous convient ?", ex:"Does Tuesday work for you?"},
    {cat:"questions", icon:"❓", en:"What time is the meeting?", fr:"La réunion est à quelle heure ?", ex:"What time is the meeting?"},
    {cat:"questions", icon:"❓", en:"Where is the office?", fr:"Où est le bureau ?", ex:"Where is the office?"},
    {cat:"questions", icon:"❓", en:"How much is it?", fr:"C’est combien ?", ex:"How much is it?"},

    {cat:"polite", icon:"🤝", en:"please", fr:"s’il vous plaît", ex:"Can you confirm the time, please?"},
    {cat:"polite", icon:"🙏", en:"Thank you.", fr:"Merci.", ex:"Thank you very much."},
    {cat:"polite", icon:"😊", en:"Perfect.", fr:"Parfait.", ex:"Perfect. Thank you."},
    {cat:"polite", icon:"🧠", en:"Can you repeat, please?", fr:"Pouvez-vous répéter, s’il vous plaît ?", ex:"Can you repeat, please?"},
  ];

  const vocabGrid = $("#vocabGrid");
  const vocabSearch = $("#vocabSearch");
  const vocabCat = $("#vocabCat");
  let currentVocab = vocabItems.slice();

  $("#btnShuffleVocab").addEventListener("click", () => { currentVocab = shuffle(currentVocab); renderVocab(); });
  $("#btnResetVocab").addEventListener("click", () => { vocabSearch.value=""; vocabCat.value="all"; currentVocab=vocabItems.slice(); renderVocab(); });
  vocabSearch.addEventListener("input", renderVocab);
  vocabCat.addEventListener("change", renderVocab);

  function renderVocab(){
    const q = vocabSearch.value.trim().toLowerCase();
    const cat = vocabCat.value;
    let items = currentVocab.slice();
    if(cat !== "all") items = items.filter(v => v.cat === cat);
    if(q) items = items.filter(v => v.en.toLowerCase().includes(q) || v.fr.toLowerCase().includes(q) || (v.ex||"").toLowerCase().includes(q));
    vocabGrid.innerHTML = items.map(v => `
      <div class="vCard" tabindex="0" role="button" aria-label="Vocabulary card ${esc(v.en)}">
        <div class="vCard__tag">${esc(v.cat)}</div>
        <div class="vCard__icon" aria-hidden="true">${esc(v.icon)}</div>
        <div class="vCard__en">${esc(v.en)}</div>
        <div class="vCard__fr">${esc(v.fr)}</div>
        <div class="vCard__ex">${esc(v.ex || "")}</div>
        <div class="vCard__actions">
          <button class="sbtn" type="button" data-say="${esc(v.en)}">🔊 EN</button>
          <button class="sbtn" type="button" data-say="${esc(v.fr)}">🔊 FR</button>
        </div>
      </div>
    `).join("");

    $$(".vCard", vocabGrid).forEach(card => {
      const flip = () => {
        const enEl = $(".vCard__en", card);
        const frEl = $(".vCard__fr", card);
        const tmp = enEl.textContent;
        enEl.textContent = frEl.textContent;
        frEl.textContent = tmp;
      };
      card.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-say]");
        if(btn){ e.stopPropagation(); speak(btn.dataset.say); return; }
        flip();
      });
      card.addEventListener("keydown", (e) => {
        if(e.key === "Enter" || e.key === " "){ e.preventDefault(); flip(); }
      });
    });
  }
  renderVocab();

  // Dialog engine
  function mkSelect(options, answer){
    const opts = options.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join("");
    return `<select class="roleSel" data-answer="${esc(answer)}"><option value="">— choose —</option>${opts}</select>`;
  }
  function checkDialog(container){
    const sels = $$(".roleSel", container);
    let ok = 0;
    sels.forEach(sel => {
      const ans = sel.dataset.answer;
      const right = sel.value === ans;
      sel.classList.toggle("selOk", right);
      sel.classList.toggle("selBad", sel.value && !right);
      if(right) ok++;
    });
    return {ok, total: sels.length};
  }
  function hintDialog(container){
    const sels = $$(".roleSel", container);
    sels.forEach(sel => {
      const ans = sel.dataset.answer;
      if(LEVEL==="A1"){
        if(sel.nextElementSibling && sel.nextElementSibling.classList.contains("hintline")) return;
        const hint = document.createElement("div");
        hint.className = "hintline";
        hint.style.margin = "6px 0 0 6px";
        hint.style.color = "var(--muted)";
        hint.style.fontWeight = "900";
        hint.style.fontSize = "12px";
        hint.textContent = `Hint: ${ans}`;
        sel.insertAdjacentElement("afterend", hint);
      } else {
        sel.title = `Hint: starts with “${ans.trim()[0]}”`;
      }
    });
  }

  function makeDialogA(){
    const noun = SCENARIO.nouns[Math.floor(Math.random()*SCENARIO.nouns.length)];
    const place = SCENARIO.placeHints[Math.floor(Math.random()*SCENARIO.placeHints.length)];
    const name = shuffle(["Marie","Alex","Sam","Camille","Jordan"])[0];

    const actionMap = {
      town: ["book an appointment","ask for information"],
      hobby: ["sign up for a class","book a session"],
      vol: ["sign up for a shift","book a meeting"],
      event: ["book a meeting","confirm a visit"],
      animals: ["book a visit","ask for information"],
      reserve: ["make a reservation","reserve a table","book a room"]
    };
    const actions = actionMap[SCENARIO.id] || ["book an appointment","make a reservation","sign up for a class","ask for information"];
    const action = actions[Math.floor(Math.random()*actions.length)];

    const dayPool = (SCENARIO.id==="reserve")
      ? ["Thursday","Friday","Saturday","Sunday"]
      : ["Monday","Tuesday","Wednesday","Thursday","Friday"];

    const timePool = (SCENARIO.id==="reserve")
      ? ["at 6:00 PM","at 7:00 PM","at 8:00 PM","in the evening"]
      : ["at 9:00 AM","at 11:00 AM","at 2:30 PM","at 4:15 PM","in the morning","in the afternoon"];

    const day = shuffle(dayPool)[0];
    const time = shuffle(timePool)[0];

    const placeOptions = ["at the office","at the clinic","at the venue","online","at the restaurant","at the hotel","at the front desk", place];

    const lines = [
      {sp:"A", html:`Hello. This is ${mkSelect(["Marie","Alex","Sam","Camille","Jordan"], name)}.`},
      {sp:"A", html:`I'm calling to ${mkSelect(actions, action)}.`},
      {sp:"B", html:`Sure. What day works for you?`},
      {sp:"A", html:`I’m available on ${mkSelect(dayPool, day)} ${mkSelect(timePool, time)}.`},
      {sp:"B", html:`Great. Is it ${mkSelect(placeOptions, place)}?`},
      {sp:"A", html:`Yes. Perfect. Thank you.`},
    ];
    const speech = `A: Hello. This is ${name}. I'm calling to ${action}. B: Sure. What day works for you? A: I’m available on ${day} ${time}. B: Great. Is it ${place}? A: Yes. Perfect. Thank you.`;
    return {lines, speech, tag: SCENARIO.tag};
  }

  function makeDialogB(){
    const oldDay = shuffle(["Monday","Tuesday","Wednesday","Thursday","Friday"])[0];
    const oldTime = shuffle(["at 9:00 AM","at 11:00 AM","at 2:30 PM","at 4:15 PM","at 7:00 PM"])[0];
    const newDay = shuffle(["Tuesday","Wednesday","Thursday","Friday","Saturday"])[0];
    const newTime = shuffle(["at 9:00 AM","at 11:00 AM","at 2:30 PM","at 4:15 PM","at 7:00 PM","in the morning"])[0];
    const lines = [
      {sp:"A", html:`Hello. I have ${mkSelect(["an appointment","a meeting","a session"], SCENARIO.nouns[0])} on ${mkSelect(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], oldDay)} ${mkSelect(["at 9:00 AM","at 11:00 AM","at 2:30 PM","at 4:15 PM","at 7:00 PM"], oldTime)}.`},
      {sp:"A", html:`Can we ${mkSelect(["reschedule","cancel","repeat"], "reschedule")}?`},
      {sp:"B", html:`Yes. What day is good for you?`},
      {sp:"A", html:`${mkSelect(["Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], newDay)} ${mkSelect(["at 9:00 AM","at 11:00 AM","at 2:30 PM","at 4:15 PM","at 7:00 PM","in the morning"], newTime)} is good.`},
      {sp:"B", html:`Perfect. Thank you.`},
    ];
    const speech = `A: Hello. I have ${SCENARIO.nouns[0]} on ${oldDay} ${oldTime}. Can we reschedule? B: Yes. What day is good for you? A: ${newDay} ${newTime} is good. B: Perfect. Thank you.`;
    return {lines, speech, tag: SCENARIO.tag};
  }

  function makeDialogC(){
    const day = shuffle(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"])[0];
    const time = shuffle(["at 9:00 AM","at 11:00 AM","at 2:30 PM","at 4:15 PM","at 7:00 PM","in the morning","in the afternoon","in the evening"])[0];
    const place = SCENARIO.placeHints[0];
    const lines = [
      {sp:"B", html:`So it’s on ${mkSelect(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], day)} ${mkSelect(["at 9:00 AM","at 11:00 AM","at 2:30 PM","at 4:15 PM","at 7:00 PM","in the morning","in the afternoon","in the evening"], time)}.`},
      {sp:"B", html:`It’s ${mkSelect(["at the office","online", place], place)}.`},
      {sp:"A", html:`Perfect. ${mkSelect(["Thank you.","Why?","I don't know."], "Thank you.")}`},
      {sp:"A", html:`${mkSelect(["See you then.","See you yesterday.","See you tomorrow."], "See you then.")}`},
    ];
    const speech = `B: So it’s on ${day} ${time}. It’s ${place}. A: Perfect. Thank you. See you then.`;
    return {lines, speech, tag: SCENARIO.tag};
  }

  function renderDialog(container, model){
    container.innerHTML = model.lines.map(ln => `
      <div class="roleLine">
        <div class="roleSp">${esc(ln.sp)}</div>
        <div class="roleTx">${ln.html}</div>
      </div>
    `).join("");
  }

  const dlgAEl = $("#dlgA");
  const dlgBEl = $("#dlgB");
  const dlgCEl = $("#dlgC");
  let dlgA = null, dlgB = null, dlgC = null;

  function renderDialogsAll(){
    dlgA = makeDialogA();
    dlgB = makeDialogB();
    dlgC = makeDialogC();
    $("#dlgALabel").textContent = dlgA.tag;
    $("#dlgBLabel").textContent = dlgB.tag;
    $("#dlgCLabel").textContent = dlgC.tag;
    renderDialog(dlgAEl, dlgA);
    renderDialog(dlgBEl, dlgB);
    renderDialog(dlgCEl, dlgC);

    $("#dlgAFb").className = "feedback";
    $("#dlgBFb").className = "feedback";
    $("#dlgCFb").className = "feedback";
    $("#dlgAFb").textContent = "Choose the correct answers, then Check.";
    $("#dlgBFb").textContent = "Choose the correct answers, then Check.";
    $("#dlgCFb").textContent = "Choose the correct answers, then Check.";
  }
  renderDialogsAll();

  function bindDialog(prefix, containerEl, getModel){
    $(`#${prefix}Check`).addEventListener("click", () => {
      const r = checkDialog(containerEl);
      const fb = $(`#${prefix}Fb`);
      fb.className = (r.ok === r.total) ? "feedback ok" : "feedback bad";
      fb.textContent = `Score: ${r.ok}/${r.total}. ${r.ok===r.total ? "Great!" : "Fix the red ones."}`;
    });
    $(`#${prefix}Hint`).addEventListener("click", () => {
      hintDialog(containerEl);
      const fb = $(`#${prefix}Fb`);
      fb.className = "feedback";
      fb.textContent = (LEVEL==="A1") ? "Hint shown (answers displayed)." : "Hint shown (first letters).";
    });
    $(`#${prefix}Speak`).addEventListener("click", () => speak(getModel().speech));
    $(`#${prefix}New`).addEventListener("click", renderDialogsAll);
  }
  bindDialog("dlgA", dlgAEl, () => dlgA);
  bindDialog("dlgB", dlgBEl, () => dlgB);
  bindDialog("dlgC", dlgCEl, () => dlgC);

  // Time slots board
  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat"];
  const DAY_FULL = {Mon:"Monday", Tue:"Tuesday", Wed:"Wednesday", Thu:"Thursday", Fri:"Friday", Sat:"Saturday"};
  const SLOTS = ["9:00 AM","10:30 AM","2:00 PM","4:00 PM"];
  const slotBoard = $("#slotBoard");
  const slotFb = $("#slotFb");
  let board = {};
  let picked = null;

  function key(day, slot){ return `${day}|${slot}`; }

  function newBoard(){
    board = {};
    picked = null;
    const freeCount = (LEVEL==="A1") ? 10 : 8;
    const allKeys = [];
    DAYS.forEach(d => SLOTS.forEach(s => allKeys.push(key(d,s))));
    const freeKeys = new Set(shuffle(allKeys).slice(0, freeCount));
    allKeys.forEach(k => board[k] = freeKeys.has(k));
    renderBoard();
    slotFb.className = "feedback";
    slotFb.textContent = "Tap a green slot to choose it.";
  }

  function renderBoard(){
    const head = `<tr><th>Time</th>${DAYS.map(d=>`<th>${d}</th>`).join("")}</tr>`;
    const rows = SLOTS.map(slot => {
      const tds = DAYS.map(day => {
        const k = key(day,slot);
        const free = !!board[k];
        const isPicked = picked && picked.day===day && picked.slot===slot;
        const cls = `slotCell ${free?'is-free':'is-busy'} ${isPicked?'is-picked':''}`;
        return `<td tabindex="0" role="gridcell" data-day="${day}" data-slot="${slot}">
          <div class="${cls}" aria-label="${(free?'Available':'Busy')} ${DAY_FULL[day]} ${slot}">${slot}</div>
        </td>`;
      }).join("");
      return `<tr><th>${slot}</th>${tds}</tr>`;
    }).join("");
    slotBoard.innerHTML = `<table class="slotTable" aria-label="Availability table">${head}${rows}</table>`;
  }

  function pickSlot(day, slot){
    const k = key(day,slot);
    if(!board[k]){
      slotFb.className = "feedback bad";
      slotFb.textContent = "That slot is busy. Choose a green slot.";
      return;
    }
    picked = {day, slot};
    renderBoard();
    slotFb.className = "feedback ok";
    slotFb.textContent = `Picked: ${DAY_FULL[day]} at ${slot}. Now build a sentence.`;
    injectSlotChips();
  }

  slotBoard.addEventListener("click", (e) => {
    const td = e.target.closest("td[data-day]");
    if(!td) return;
    pickSlot(td.dataset.day, td.dataset.slot);
  });
  slotBoard.addEventListener("keydown", (e) => {
    if(e.key !== "Enter" && e.key !== " ") return;
    const td = e.target.closest("td[data-day]");
    if(!td) return;
    e.preventDefault();
    pickSlot(td.dataset.day, td.dataset.slot);
  });

  $("#slotNew").addEventListener("click", newBoard);
  $("#slotHint").addEventListener("click", () => {
    slotFb.className = "feedback";
    slotFb.textContent = (LEVEL==="A1")
      ? "Hint: Pick a green slot. Then say: I’m available on (day) at (time)."
      : "Hint: available + on + day + at + time.";
  });

  // Sentence builder
  const sentChips = $("#sentChips");
  const sentOut = $("#sentOut");
  const sentFb = $("#sentFb");
  let sent = [];

  function injectSlotChips(){
    const day = picked ? DAY_FULL[picked.day] : "Tuesday";
    const time = picked ? `at ${picked.slot}` : "at 2:30 PM";
    const base = ["I’m","available","not available","on",day,time,"in the morning","in the afternoon",".","?"];
    const extra = (LEVEL==="A2") ? ["Does",day,"work for you","?"] : ["please"];
    const chips = base.concat(extra);
    sentChips.innerHTML = chips.map(w => `<button class="chip" type="button" data-w="${esc(w)}">${esc(w)}</button>`).join("");
  }

  function resetSentenceBuilder(){
    sent = [];
    sentOut.textContent = "—";
    sentFb.className = "feedback";
    sentFb.textContent = "Tap chips to build a sentence.";
    injectSlotChips();
  }

  function normalizeSentence(words){
    return words.join(" ").replace(/\s+\./g,".").replace(/\s+\?/g,"?").replace(/\s+/g," ").trim();
  }

  function expectedSentence(){
    if(!picked) return "";
    const day = DAY_FULL[picked.day];
    const time = `at ${picked.slot}`;
    return `I’m available on ${day} ${time}.`;
  }

  sentChips.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-w]");
    if(!b) return;
    sent.push(b.dataset.w);
    sentOut.textContent = normalizeSentence(sent);
    sentFb.className = "feedback";
    sentFb.textContent = "Keep going…";
  });

  $("#sentClear").addEventListener("click", resetSentenceBuilder);
  $("#sentSpeak").addEventListener("click", () => {
    const s = normalizeSentence(sent);
    if(s && s !== "—") speak(s);
  });

  $("#sentCheck").addEventListener("click", () => {
    const s = normalizeSentence(sent);
    const exp = expectedSentence();
    if(!picked){
      sentFb.className = "feedback bad";
      sentFb.textContent = "Pick a green slot first.";
      return;
    }
    const ok = (s === exp) || (LEVEL==="A1" && s.startsWith(`I’m available on ${DAY_FULL[picked.day]}`) && s.includes(`at ${picked.slot}`));
    sentFb.className = ok ? "feedback ok" : "feedback bad";
    sentFb.textContent = ok ? "✅ Correct!" : `Try again. Model: “${exp}”`;
    if(ok) speak(exp);
  });

  // Missions
  const missionBox = $("#missionBox");
  const missionFb = $("#missionFb");
  let mission = null;
  let missionPick = null;

  function freeSlots(){
    const ks = [];
    DAYS.forEach(d => SLOTS.forEach(s => { if(board[key(d,s)]) ks.push(key(d,s)); }));
    return ks;
  }
  function keyToLabel(k){
    const [d,s] = k.split("|");
    return `${DAY_FULL[d]} ${s}`;
  }

  function newMission(){
    if(!Object.keys(board).length) newBoard();
    missionPick = null;
    const free = freeSlots();
    const busy = [];
    DAYS.forEach(d => SLOTS.forEach(s => { if(!board[key(d,s)]) busy.push(key(d,s)); }));

    const correct = free[Math.floor(Math.random()*free.length)] || key("Tue","2:00 PM");
    const [cd, cs] = correct.split("|");
    const isPM = /PM/i.test(cs);
    const pref = (Math.random()<0.5)
      ? `You prefer the ${isPM ? "afternoon" : "morning"}.`
      : `You prefer ${DAY_FULL[cd]}.`;

    const scenarioLine = `You need ${SCENARIO.nouns[0]}.`;
    const text = `${scenarioLine} ${pref} Choose the best available slot.`;
    const choices = shuffle([correct].concat(shuffle(free.filter(k=>k!==correct)).slice(0,2)).concat(shuffle(busy).slice(0,1))).slice(0,4);
    mission = {text, correctKey: correct, choices};
    renderMission();
    missionFb.className = "feedback";
    missionFb.textContent = "Tap one option, then Check.";
  }

  function renderMission(){
    missionBox.innerHTML = `
      <h4>Mission</h4>
      <p>${esc(mission.text)}</p>
      <div class="slotChoices">
        ${mission.choices.map(k => `<button class="choiceBtn" type="button" data-k="${esc(k)}">${esc(keyToLabel(k))}</button>`).join("")}
      </div>
    `;
  }

  missionBox.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-k]");
    if(!b) return;
    missionPick = b.dataset.k;
    $$(".choiceBtn", missionBox).forEach(x => x.classList.toggle("is-selected", x.dataset.k === missionPick));
  });

  $("#missionSpeak").addEventListener("click", () => speak(`Mission. ${mission.text}`));
  $("#missionNew").addEventListener("click", newMission);
  $("#missionHint").addEventListener("click", () => {
    missionFb.className = "feedback";
    missionFb.textContent = (LEVEL==="A1") ? "Hint: Choose an available (green) slot." : "Hint: available + match the preference.";
  });

  $("#missionCheck").addEventListener("click", () => {
    if(!missionPick){
      missionFb.className = "feedback bad";
      missionFb.textContent = "Pick an option first.";
      return;
    }
    const ok = missionPick === mission.correctKey;
    $$(".choiceBtn", missionBox).forEach(btn => {
      btn.classList.remove("is-right","is-wrong");
      if(btn.dataset.k === mission.correctKey) btn.classList.add("is-right");
      else if(btn.dataset.k === missionPick && !ok) btn.classList.add("is-wrong");
    });
    missionFb.className = ok ? "feedback ok" : "feedback bad";
    missionFb.textContent = ok ? "✅ Great choice!" : "Not quite. The green answer is best.";
    if(ok){
      const [d,s] = mission.correctKey.split("|");
      speak(`I’m available on ${DAY_FULL[d]} at ${s}.`);
    }
  });

  // Builder outputs
  const bName = $("#bName");
  const bRole = $("#bRole");
  const bPlace = $("#bPlace");
  const bGoal = $("#bGoal");
  const bDay = $("#bDay");
  const bTime = $("#bTime");

  const outA1 = $("#outA1");
  const outA2 = $("#outA2");
  const outQs = $("#outQs");
  const bFb = $("#bFb");

  function makeOutputs(){
    const name = bName.value.trim();
    const role = aOrAn(bRole.value);
    const place = bPlace.value.trim();
    const goal = bGoal.value;
    const day = bDay.value;
    const time = bTime.value;

    const A1 = [
      name ? `Hello, I’m ${name}.` : "Hello.",
      `I’m ${role}.`,
      place ? `I’m ${place}.` : "",
      `I want to ${goal}.`,
      `I’m available on ${day} ${time}.`,
      "Does this time work for you?"
    ].filter(Boolean).join(" ");

    const A2 = [
      name ? `Hello, my name is ${name}.` : "Hello.",
      `I’m ${role}, and I'm calling to ${goal}.`,
      place ? `I’m ${place}.` : "",
      `I’m available on ${day} ${time}. If needed, I’m also available another day.`,
      "Can you confirm the location and the price, please?"
    ].filter(Boolean).join(" ");

    const qs = [
      "• When is the appointment?",
      "• Where is the location?",
      "• What time is the meeting?",
      "• How much is it?",
      "• Can we reschedule if needed?"
    ].join("\n");

    outA1.textContent = A1;
    outA2.textContent = A2;
    outQs.textContent = qs;
    return {A1, A2, qs};
  }

  $("#bGenerate").addEventListener("click", () => {
    makeOutputs();
    bFb.className = "feedback ok";
    bFb.textContent = "✅ Generated! Tap 🔊 to listen or 📋 to copy.";
  });
  $("#bHint").addEventListener("click", () => {
    bFb.className = "feedback";
    bFb.textContent = "Tip: Keep it simple. Use: I’m available on… at… / Does this time work for you?";
  });

  $("#a1Speak").addEventListener("click", () => speak(outA1.textContent));
  $("#a2Speak").addEventListener("click", () => speak(outA2.textContent));
  $("#qSpeak").addEventListener("click", () => speak(outQs.textContent.replace(/[•\n]/g," ").trim()));
  $("#bSpeak").addEventListener("click", () => {
    const {A1, A2} = makeOutputs();
    speak(LEVEL==="A1" ? A1 : A2);
  });

  $("#bCopy").addEventListener("click", async () => {
    const {A1, A2, qs} = makeOutputs();
    const txt = `A1:\n${A1}\n\nA2:\n${A2}\n\nQuestions:\n${qs}`;
    try{
      await navigator.clipboard.writeText(txt);
      bFb.className = "feedback ok";
      bFb.textContent = "✅ Copied to clipboard.";
    } catch(e){
      const ta = document.createElement("textarea");
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      bFb.className = "feedback ok";
      bFb.textContent = "✅ Copied.";
    }
  });

  // Subject drill
  const subjDrill = $("#subjDrill");
  const subjFb = $("#subjFb");
  let subjItems = [];

  function newSubjects(){
    const pool = [
      {q:"You want to book an appointment.", a:"Appointment request"},
      {q:"You want to confirm a time.", a:"Confirmation of appointment time"},
      {q:"You want to change the date/time.", a:"Request to reschedule"},
      {q:"You ask for address / location.", a:"Question about location"},
    ];
    const answers = ["Appointment request","Confirmation of appointment time","Request to reschedule","Question about location",
      "Hello","My schedule","Important message","Thanks"];
    subjItems = shuffle(pool).slice(0, (LEVEL==="A1") ? 3 : 4).map(it => ({
      ...it,
      choices: shuffle([it.a].concat(shuffle(answers.filter(x=>x!==it.a)).slice(0,3))),
      pick: null
    }));
    renderSubjects();
    subjFb.className = "feedback";
    subjFb.textContent = "Tap the best subject line for each situation, then Check.";
  }

  function renderSubjects(){
    subjDrill.innerHTML = subjItems.map((it,i) => `
      <div class="builder" data-i="${i}">
        <div class="builder__label">${esc(it.q)}</div>
        <div class="chipline">
          ${it.choices.map(c => `
            <button class="choiceBtn ${it.pick===c?'is-selected':''}" type="button" data-c="${esc(c)}">${esc(c)}</button>
          `).join("")}
        </div>
      </div>
    `).join("");
  }

  subjDrill.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-c]");
    if(!b) return;
    const wrap = e.target.closest(".builder");
    const i = Number(wrap.dataset.i);
    subjItems[i].pick = b.dataset.c;
    renderSubjects();
  });

  $("#subjNew").addEventListener("click", newSubjects);
  $("#subjCheck").addEventListener("click", () => {
    let ok = 0;
    $$(".builder", subjDrill).forEach(w => {
      const i = Number(w.dataset.i);
      const it = subjItems[i];
      $$(".choiceBtn", w).forEach(btn => {
        btn.classList.remove("is-right","is-wrong");
        if(btn.dataset.c === it.a) btn.classList.add("is-right");
        else if(it.pick && btn.dataset.c === it.pick && it.pick !== it.a) btn.classList.add("is-wrong");
      });
      if(it.pick === it.a) ok++;
    });
    subjFb.className = (ok === subjItems.length) ? "feedback ok" : "feedback bad";
    subjFb.textContent = `Score: ${ok}/${subjItems.length}. ${ok===subjItems.length ? "Great!" : "Try again."}`;
  });

  // init
  newSubjects();
  newBoard();
  resetSentenceBuilder();
  newMission();

})();