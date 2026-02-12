/* SpeakEasyTisha • Time, Dates, Numbers & Schedules (Present Simple)
   Tap-friendly, offline-friendly. No external libs.
*/
(() => {
  "use strict";

  // ---------- helpers ----------
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const onlyDigits = (s) => String(s||"").replace(/\D+/g,"");
  const toNum = (s) => {
    const t = String(s||"").trim().replace(",",".").replace(/[^\d.]/g,"");
    if(!t) return NaN;
    const n = Number(t);
    return Number.isFinite(n) ? n : NaN;
  };

  // ---------- state ----------
  let ACCENT = "US"; // US or UK
  let LEVEL = "A1";  // A1 or A2
  let voices = [];
  let voiceUS = null;
  let voiceUK = null;

  function refreshVoices(){
    voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    const pick = (lang, preferNames=[]) => {
      const exact = voices.filter(v => (v.lang||"").toLowerCase().startsWith(lang.toLowerCase()));
      if(!exact.length) return null;
      for (const nm of preferNames){
        const v = exact.find(vv => (vv.name||"").toLowerCase().includes(nm.toLowerCase()));
        if(v) return v;
      }
      // prefer non-compact voices when possible
      const notCompact = exact.find(v => !/compact/i.test(v.name||""));
      return notCompact || exact[0];
    };
    voiceUS = pick("en-us", ["samantha","ava","allison","alex","fred","tom","microsoft"]);
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

  // ---------- tabs ----------
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

  // ---------- top actions ----------
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
    // regen drills with level params
    newTimeQ();
    newDateQ();
    newNumber();
    newPhone();
    newPrice();
    newYear();
    newRole();
    newDoDoes();
    newWHMatch();
  }

  // ---------- data ----------
  const DAYS = [
    ["Monday","lundi"],["Tuesday","mardi"],["Wednesday","mercredi"],["Thursday","jeudi"],
    ["Friday","vendredi"],["Saturday","samedi"],["Sunday","dimanche"]
  ];
  const MONTHS = [
    ["January","janvier"],["February","février"],["March","mars"],["April","avril"],["May","mai"],["June","juin"],
    ["July","juillet"],["August","août"],["September","septembre"],["October","octobre"],["November","novembre"],["December","décembre"]
  ];
  const WH = [
    {en:"What", fr:"quoi / que", ex:"What time do you start?"},
    {en:"When", fr:"quand", ex:"When do you meet?"},
    {en:"Where", fr:"où", ex:"Where do you work?"},
    {en:"Who", fr:"qui", ex:"Who do you call?"},
    {en:"Why", fr:"pourquoi", ex:"Why do you study English?"},
    {en:"How", fr:"comment", ex:"How do you get there?"},
    {en:"Which", fr:"lequel / laquelle", ex:"Which day do you prefer?"},
    {en:"How much", fr:"combien (prix)", ex:"How much is it?"},
    {en:"How many", fr:"combien (quantité)", ex:"How many meetings do you have?"},
  ];

  const vocabItems = [
    // time
    {cat:"time", icon:"⏰", en:"What time is it?", fr:"Quelle heure est-il ?", ex:"What time is it? It’s 7:15."},
    {cat:"time", icon:"🕖", en:"It’s seven o’clock.", fr:"Il est sept heures.", ex:"It’s seven o’clock."},
    {cat:"time", icon:"🕧", en:"It’s half past seven.", fr:"Il est sept heures et demie.", ex:"It’s half past seven."},
    {cat:"time", icon:"🕗", en:"It’s quarter past eight.", fr:"Il est huit heures et quart.", ex:"It’s quarter past eight."},
    {cat:"time", icon:"🕚", en:"It’s quarter to eleven.", fr:"Il est onze heures moins le quart.", ex:"It’s quarter to eleven."},
    {cat:"time", icon:"📍", en:"at 7:30", fr:"à 7h30", ex:"I start at 7:30."},
    // days
    ...DAYS.map(d => ({cat:"days", icon:"📆", en:d[0], fr:d[1], ex:`On ${d[0]}, I work.`})),
    // months
    ...MONTHS.map(m => ({cat:"months", icon:"🗓️", en:m[0], fr:m[1], ex:`In ${m[0]}, I plan a trip.`})),
    // dates & ordinals
    {cat:"dates", icon:"📅", en:"the 1st (first)", fr:"le 1er", ex:"Today is the 1st."},
    {cat:"dates", icon:"📅", en:"the 2nd (second)", fr:"le 2", ex:"It’s the 2nd of March."},
    {cat:"dates", icon:"📅", en:"the 3rd (third)", fr:"le 3", ex:"My class is on the 3rd."},
    {cat:"dates", icon:"📅", en:"the 4th, 5th…", fr:"le 4, 5…", ex:"The meeting is on the 10th."},
    {cat:"dates", icon:"🇺🇸", en:"US date: February 10, 2026", fr:"format US: mois / jour / année", ex:"US: February 10, 2026."},
    {cat:"dates", icon:"🇬🇧", en:"UK date: 10 February 2026", fr:"format UK: jour / mois / année", ex:"UK: 10 February 2026."},
    // numbers & years
    {cat:"numbers", icon:"🔢", en:"zero → one hundred", fr:"zéro → cent", ex:"I count from 0 to 100."},
    {cat:"numbers", icon:"📆", en:"year (1998)", fr:"année (1998)", ex:"I work there since 2019."},
    {cat:"numbers", icon:"📞", en:"phone number", fr:"numéro de téléphone", ex:"My phone number is 555-123-9876."},
    {cat:"numbers", icon:"💲", en:"price", fr:"prix", ex:"It’s $12.50."},
    // planning & organizing
    {cat:"planning", icon:"🧩", en:"schedule (noun)", fr:"planning", ex:"My schedule is busy."},
    {cat:"planning", icon:"🗓️", en:"plan (verb)", fr:"planifier", ex:"I plan my week on Sunday."},
    {cat:"planning", icon:"✅", en:"organize", fr:"organiser", ex:"I organize my tasks every morning."},
    {cat:"planning", icon:"📌", en:"book a meeting", fr:"réserver / fixer un rendez-vous", ex:"I book a meeting for Tuesday."},
    {cat:"planning", icon:"🕒", en:"start / finish", fr:"commencer / finir", ex:"I start at 9 and I finish at 5."},
    {cat:"planning", icon:"🔁", en:"every day / every week", fr:"tous les jours / toutes les semaines", ex:"I study English every day."},
    // wh
    ...WH.map(w => ({cat:"wh", icon:"❓", en:w.en, fr:w.fr, ex:w.ex}))
  ];

  // ---------- WH table ----------
  function renderWHTable(){
    const tbody = $("#whTable");
    tbody.innerHTML = WH.map(w => `
      <tr>
        <td><strong>${esc(w.en)}</strong></td>
        <td>${esc(w.fr)}</td>
        <td>${esc(w.ex)}</td>
        <td><button class="sbtn" type="button" data-say="${esc(w.ex)}">🔊</button></td>
      </tr>
    `).join("");
    tbody.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-say]");
      if(!b) return;
      speak(b.dataset.say);
    });
  }
  renderWHTable();

  // ---------- vocab renderer ----------
  const vocabGrid = $("#vocabGrid");
  const vocabSearch = $("#vocabSearch");
  const vocabCat = $("#vocabCat");
  $("#btnShuffleVocab").addEventListener("click", () => {
    currentVocab = shuffle(currentVocab);
    renderVocab();
  });
  $("#btnResetVocab").addEventListener("click", () => {
    vocabSearch.value = "";
    vocabCat.value = "all";
    currentVocab = vocabItems.slice();
    renderVocab();
  });
  vocabSearch.addEventListener("input", renderVocab);
  vocabCat.addEventListener("change", renderVocab);

  let currentVocab = vocabItems.slice();

  function renderVocab(){
    const q = vocabSearch.value.trim().toLowerCase();
    const cat = vocabCat.value;

    let items = currentVocab.slice();
    if(cat !== "all") items = items.filter(v => v.cat === cat);
    if(q){
      items = items.filter(v =>
        v.en.toLowerCase().includes(q) ||
        v.fr.toLowerCase().includes(q) ||
        (v.ex||"").toLowerCase().includes(q)
      );
    }

    vocabGrid.innerHTML = items.map((v,i) => `
      <div class="vCard" tabindex="0" role="button" aria-label="Vocabulary card ${esc(v.en)}"
           data-i="${i}" data-flip="0">
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

    // card interactions (flip)
    $$(".vCard", vocabGrid).forEach(card => {
      const flip = () => {
        const isFlipped = card.dataset.flip === "1";
        card.dataset.flip = isFlipped ? "0" : "1";
        const en = $(".vCard__en", card);
        const fr = $(".vCard__fr", card);
        if(!isFlipped){
          en.textContent = card.querySelector(".vCard__fr").textContent;
          fr.textContent = card.querySelector(".vCard__en").textContent;
        } else {
          // re-render to restore original quickly
          renderVocab();
        }
      };

      card.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-say]");
        if(btn){
          e.stopPropagation();
          speak(btn.dataset.say);
          return;
        }
        flip();
      });
      card.addEventListener("keydown", (e) => {
        if(e.key === "Enter" || e.key === " "){
          e.preventDefault();
          flip();
        }
      });
    });
  }
  renderVocab();

  // ---------- chips ----------
  const scheduleChips = [
    "I start at 9:00.", "I finish at 5:00.",
    "I work on Monday.", "I study in the evening.",
    "I have a meeting at 2:30.", "I plan my week on Sunday."
  ];
  $("#timeChips").innerHTML = scheduleChips.map(t => `<button class="chip" type="button" data-say="${esc(t)}">${esc(t)}</button>`).join("");
  $("#timeChips").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-say]");
    if(!b) return;
    speak(b.dataset.say);
  });

  // ---------- Question builder ----------
  const buildTarget = "Where do you work on Monday?";
  const bankWords = ["Where","do","you","work","on","Monday","?"];
  const qBuildBank = $("#qBuildBank");
  const qBuildOut = $("#qBuildOut");
  const qBuildFb = $("#qBuildFb");
  let build = [];

  function renderBuilder(){
    qBuildBank.innerHTML = bankWords.map((w,idx) => {
      const used = build.includes(idx);
      return `<button class="word ${used?'is-used':''}" type="button" data-idx="${idx}" ${used?'disabled':''}>${esc(w)}</button>`;
    }).join("");
    qBuildOut.textContent = build.map(i => bankWords[i]).join(" ").replace(" ?", "?");
  }

  qBuildBank.addEventListener("click", (e) => {
    const b = e.target.closest("button.word");
    if(!b) return;
    const idx = Number(b.dataset.idx);
    build.push(idx);
    renderBuilder();
    qBuildFb.className = "feedback";
    qBuildFb.textContent = "Keep going…";
  });

  $("#qBuildClear").addEventListener("click", () => {
    build = [];
    qBuildFb.className = "feedback";
    qBuildFb.textContent = "Cleared.";
    renderBuilder();
  });

  $("#qBuildHint").addEventListener("click", () => {
    const hint = (LEVEL==="A1")
      ? "Hint: WH word + do/does + subject + verb + time/place."
      : "Hint: WH + do + subject + verb + time.";
    qBuildFb.className = "feedback";
    qBuildFb.textContent = hint;
  });

  $("#qBuildSpeak").addEventListener("click", () => speak(buildTarget));

  $("#qBuildCheck").addEventListener("click", () => {
    const s = qBuildOut.textContent.trim();
    if(s === buildTarget){
      qBuildFb.className = "feedback ok";
      qBuildFb.textContent = "✅ Correct!";
      speak(buildTarget);
    } else {
      qBuildFb.className = "feedback bad";
      qBuildFb.textContent = (LEVEL==="A1")
        ? `Not quite. Model: “${buildTarget}”`
        : "Not quite. Try again.";
    }
  });

  renderBuilder();
  qBuildFb.textContent = "Tap words to start.";

  // ---------- Do/Does drill ----------
  const doDoesWrap = $("#doDoesDrill");
  const doDoesFb = $("#doDoesFb");
  let doDoesItems = [];

  function newDoDoes(){
    const pool = [
      {q:"___ you start at 9:00?", a:"Do"},
      {q:"___ she work on Monday?", a:"Does"},
      {q:"___ they have a meeting today?", a:"Do"},
      {q:"___ he finish at 5:00?", a:"Does"},
      {q:"Where ___ you work?", a:"do"},
      {q:"When ___ she start?", a:"does"},
    ];
    doDoesItems = shuffle(pool).slice(0, (LEVEL==="A1") ? 4 : 5).map(x => ({...x, pick:null}));
    renderDoDoes();
    doDoesFb.className = "feedback";
    doDoesFb.textContent = "Tap an option for each question, then Check.";
  }

  function renderDoDoes(){
    doDoesWrap.innerHTML = doDoesItems.map((it,i) => `
      <div class="dRow" data-i="${i}">
        <div class="dRow__q">${esc(it.q)}</div>
        <div class="dRow__opts">
          ${["Do","Does","do","does"].filter((v,idx,arr)=>arr.indexOf(v)===idx).map(opt => `
            <button class="opt ${it.pick===opt?'is-selected':''}" type="button" data-opt="${esc(opt)}">${esc(opt)}</button>
          `).join("")}
        </div>
      </div>
    `).join("");
  }

  doDoesWrap.addEventListener("click", (e) => {
    const b = e.target.closest("button.opt");
    if(!b) return;
    const row = e.target.closest(".dRow");
    const i = Number(row.dataset.i);
    doDoesItems[i].pick = b.dataset.opt;
    renderDoDoes();
  });

  $("#doDoesHint").addEventListener("click", () => {
    doDoesFb.className = "feedback";
    doDoesFb.textContent = "Hint: Do = I/you/we/they. Does = he/she/it.";
  });

  $("#doDoesNew").addEventListener("click", newDoDoes);

  $("#doDoesCheck").addEventListener("click", () => {
    let ok = 0;
    $$(".dRow", doDoesWrap).forEach(row => {
      const i = Number(row.dataset.i);
      const it = doDoesItems[i];
      $$(".opt", row).forEach(btn => {
        btn.classList.remove("is-right","is-wrong");
        if(!it.pick) return;
        if(btn.dataset.opt === it.pick){
          btn.classList.add(it.pick.toLowerCase() === it.a.toLowerCase() ? "is-right" : "is-wrong");
        }
      });
      if(it.pick && it.pick.toLowerCase() === it.a.toLowerCase()) ok++;
    });
    doDoesFb.className = (ok === doDoesItems.length) ? "feedback ok" : "feedback bad";
    doDoesFb.textContent = `Score: ${ok}/${doDoesItems.length}. ${ok===doDoesItems.length ? "Great!" : "Try again."}`;
  });

  newDoDoes();

  // ---------- Time trainer ----------
  const timePrompt = $("#timePrompt");
  const timeOptions = $("#timeOptions");
  const timeFb = $("#timeFb");
  let timeAns = "";

  function pad2(n){ return String(n).padStart(2,"0"); }
  function timeToSpeech(h,m){
    // keep simple A1/A2: use "It's H:M" and add optional common forms
    const h12 = ((h+11)%12)+1;
    const ampm = (h<12) ? "a.m." : "p.m.";
    if(m === 0) return `It’s ${h12} o’clock.`;
    if(m === 15) return `It’s quarter past ${h12}.`;
    if(m === 30) return `It’s half past ${h12}.`;
    if(m === 45) return `It’s quarter to ${((h12)%12)+1}.`;
    // otherwise: "seven fifteen"
    return `It’s ${h12} ${m}.`;
  }
  function newTimeQ(){
    const step = (LEVEL==="A1") ? 15 : 5; // A1 easier
    const h = Math.floor(Math.random()*24);
    const m = step * Math.floor(Math.random()*(60/step));
    const digital = `${pad2(h)}:${pad2(m)}`;
    timePrompt.textContent = digital;

    const correct = timeToSpeech(h,m);
    timeAns = correct;
    const distract = () => {
      const dh = (h + (Math.random()>.5?1:-1) * (1+Math.floor(Math.random()*3)) + 24) % 24;
      const dm = (m + step * (Math.random()>.5?1:-1) * (1+Math.floor(Math.random()*2)) + 60) % 60;
      return timeToSpeech(dh,dm);
    };

    const opts = shuffle([correct, distract(), distract(), distract()]).slice(0,4);
    timeOptions.innerHTML = opts.map(t => `<button class="choice" type="button" data-v="${esc(t)}">${esc(t)}</button>`).join("");
    timeFb.className = "feedback";
    timeFb.textContent = "Tap the correct sentence.";
  }

  timeOptions.addEventListener("click", (e) => {
    const b = e.target.closest("button.choice");
    if(!b) return;
    const v = b.dataset.v;
    const right = v === timeAns;
    $$(".choice", timeOptions).forEach(btn => {
      btn.classList.remove("is-right","is-wrong");
      if(btn.dataset.v === timeAns) btn.classList.add("is-right");
      else if(btn === b && !right) btn.classList.add("is-wrong");
    });
    timeFb.className = right ? "feedback ok" : "feedback bad";
    timeFb.textContent = right ? "✅ Correct!" : "Not quite. Check the green answer.";
  });

  $("#timeNew").addEventListener("click", newTimeQ);
  $("#timeSpeak").addEventListener("click", () => speak(timeAns));
  $("#timeHint").addEventListener("click", () => {
    timeFb.className = "feedback";
    timeFb.textContent = (LEVEL==="A1")
      ? "Hint: 00 = o’clock • 15 = quarter past • 30 = half past • 45 = quarter to."
      : "Hint: quarter past / half past / quarter to.";
  });

  newTimeQ();

  // ---------- Date trainer ----------
  const datePrompt = $("#datePrompt");
  const dateOptions = $("#dateOptions");
  const dateFb = $("#dateFb");
  const dateUS = $("#dateUS");
  let dateAns = "";

  function ordinal(n){
    const s = ["th","st","nd","rd"];
    const v = n % 100;
    return n + (s[(v-20)%10] || s[v] || s[0]);
  }
  function dateToSpeech(d){
    // UK: "Monday, the 10th of February, 2026."
    const dayName = DAYS[(d.getDay()+6)%7][0]; // JS: Sun=0; map to Monday=0
    const day = d.getDate();
    const monthName = MONTHS[d.getMonth()][0];
    const year = d.getFullYear();
    if(dateUS.checked){
      return `${monthName} ${ordinal(day)}, ${year}.`;
    }
    return `${dayName}, the ${ordinal(day)} of ${monthName}, ${year}.`;
  }
  function dateToDisplay(d){
    const day = d.getDate();
    const monthName = MONTHS[d.getMonth()][0];
    const year = d.getFullYear();
    if(dateUS.checked) return `${monthName} ${day}, ${year}`;
    return `${day} ${monthName} ${year}`;
  }
  function newDateQ(){
    const year = 2026; // stable
    const m = Math.floor(Math.random()*12);
    const day = 1 + Math.floor(Math.random()*28);
    const d = new Date(year, m, day);
    datePrompt.textContent = dateToDisplay(d);
    const correct = dateToSpeech(d);
    dateAns = correct;

    const distract = () => {
      const dd = new Date(d);
      dd.setDate(d.getDate() + (Math.random()>.5?1:-1)*(1+Math.floor(Math.random()*3)));
      return dateToSpeech(dd);
    };
    const opts = shuffle([correct, distract(), distract(), distract()]).slice(0,4);
    dateOptions.innerHTML = opts.map(t => `<button class="choice" type="button" data-v="${esc(t)}">${esc(t)}</button>`).join("");
    dateFb.className = "feedback";
    dateFb.textContent = "Tap the correct spoken date.";
  }

  dateOptions.addEventListener("click", (e) => {
    const b = e.target.closest("button.choice");
    if(!b) return;
    const v = b.dataset.v;
    const right = v === dateAns;
    $$(".choice", dateOptions).forEach(btn => {
      btn.classList.remove("is-right","is-wrong");
      if(btn.dataset.v === dateAns) btn.classList.add("is-right");
      else if(btn === b && !right) btn.classList.add("is-wrong");
    });
    dateFb.className = right ? "feedback ok" : "feedback bad";
    dateFb.textContent = right ? "✅ Correct!" : "Not quite. Check the green answer.";
  });

  $("#dateNew").addEventListener("click", newDateQ);
  $("#dateSpeak").addEventListener("click", () => speak(dateAns));
  $("#dateHint").addEventListener("click", () => {
    dateFb.className = "feedback";
    dateFb.textContent = dateUS.checked
      ? "US hint: Month + ordinal day + year."
      : "UK hint: Day name + the ordinal + of + month + year.";
  });
  dateUS.addEventListener("change", newDateQ);

  newDateQ();

  // ---------- Numbers Lab: 0-100 dictation ----------
  let nCurrent = 0;
  const nInput = $("#nInput");
  const nFb = $("#nFb");
  const nReveal = $("#nReveal");

  const smallNums = ["zero","one","two","three","four","five","six","seven","eight","nine","ten",
    "eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
  const tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  function numToWords(n){
    n = Number(n);
    if(n < 20) return smallNums[n];
    if(n % 10 === 0) return tens[Math.floor(n/10)];
    return `${tens[Math.floor(n/10)]}-${smallNums[n%10]}`;
  }

  function newNumber(){
    const max = 100;
    nCurrent = Math.floor(Math.random()*(max+1));
    $("#nPrompt").textContent = (LEVEL==="A1") ? "Listen → type (0–100)" : "Dictation (0–100)";
    nInput.value = "";
    nReveal.textContent = "";
    nFb.className = "feedback";
    nFb.textContent = "Click 🔊 then type digits.";
  }
  function checkNumber(){
    const typed = Number(onlyDigits(nInput.value));
    const right = typed === nCurrent;
    nFb.className = right ? "feedback ok" : "feedback bad";
    nFb.textContent = right ? "✅ Correct!" : `Not quite. Try again.`;
    if(!right && LEVEL==="A1"){
      nReveal.textContent = `Hint: ${numToWords(nCurrent)}`;
    }
  }
  $("#nSpeak").addEventListener("click", () => speak(numToWords(nCurrent)));
  $("#nNew").addEventListener("click", newNumber);
  $("#nCheck").addEventListener("click", checkNumber);
  $("#nHint").addEventListener("click", () => {
    nReveal.textContent = `Words: ${numToWords(nCurrent)}`;
    nFb.className = "feedback";
    nFb.textContent = "Hint shown.";
  });

  newNumber();

  // ---------- Phone numbers drill ----------
  let phDigits = "";
  const phPrompt = $("#phPrompt");
  const phInput = $("#phInput");
  const phFb = $("#phFb");
  const phReveal = $("#phReveal");

  function formatPhone(digs){
    // US-style: 555-123-9876
    return `${digs.slice(0,3)}-${digs.slice(3,6)}-${digs.slice(6)}`;
  }
  function phoneToSpeech(digs){
    // say digit-by-digit (A1), group by 3-3-4 (A2)
    if(LEVEL==="A1"){
      return digs.split("").map(d => smallNums[Number(d)]).join(" ");
    }
    return `${digs.slice(0,3).split("").map(d=>smallNums[Number(d)]).join(" ")} | ${digs.slice(3,6).split("").map(d=>smallNums[Number(d)]).join(" ")} | ${digs.slice(6).split("").map(d=>smallNums[Number(d)]).join(" ")}`;
  }
  function newPhone(){
    phDigits = "";
    for(let i=0;i<10;i++) phDigits += String(Math.floor(Math.random()*10));
    phPrompt.textContent = (LEVEL==="A1") ? "Listen and type 10 digits" : "Phone number dictation";
    phInput.value = "";
    phReveal.textContent = "";
    phFb.className = "feedback";
    phFb.textContent = "Click 🔊 then type digits (spaces/dashes ok).";
  }
  function checkPhone(){
    const typed = onlyDigits(phInput.value);
    const right = typed === phDigits;
    phFb.className = right ? "feedback ok" : "feedback bad";
    phFb.textContent = right ? "✅ Correct!" : "Not quite. Check the hint or try again.";
    if(!right && LEVEL==="A1"){
      phReveal.textContent = `Hint: ${formatPhone(phDigits)}`;
    }
  }
  $("#phSpeak").addEventListener("click", () => speak(`My phone number is ${phoneToSpeech(phDigits)}.`));
  $("#phNew").addEventListener("click", newPhone);
  $("#phCheck").addEventListener("click", checkPhone);
  $("#phHint").addEventListener("click", () => {
    phReveal.textContent = `Model: ${formatPhone(phDigits)}`;
    phFb.className = "feedback";
    phFb.textContent = "Hint shown.";
  });
  newPhone();

  // ---------- Prices drill ----------
  let prValue = 0;
  const prPrompt = $("#prPrompt");
  const prInput = $("#prInput");
  const prFb = $("#prFb");
  const prReveal = $("#prReveal");
  const eurMode = $("#eurMode");

  function moneySpeech(v){
    const dollars = Math.floor(v);
    const cents = Math.round((v - dollars) * 100);
    const cur = eurMode.checked ? "euros" : "dollars";
    const centWord = eurMode.checked ? "cents" : "cents";
    // A1: explicit, A2: shorter alternative
    if(LEVEL==="A1"){
      if(cents === 0) return `${dollars} ${cur}.`;
      return `${dollars} ${cur} and ${cents} ${centWord}.`;
    }
    if(cents === 0) return `${dollars} ${cur}.`;
    return `${dollars} ${cents}.`; // "twelve fifty" style (approx)
  }
  function newPrice(){
    const dollars = 1 + Math.floor(Math.random()*99);
    const cents = [0, 25, 50, 75, 99][Math.floor(Math.random()*5)];
    prValue = dollars + cents/100;
    prPrompt.textContent = eurMode.checked ? "Price (€)" : "Price ($)";
    prInput.value = "";
    prReveal.textContent = "";
    prFb.className = "feedback";
    prFb.textContent = "Click 🔊 then type the price.";
  }
  function checkPrice(){
    const typed = toNum(prInput.value);
    const right = Math.abs(typed - prValue) < 0.001;
    prFb.className = right ? "feedback ok" : "feedback bad";
    prFb.textContent = right ? "✅ Correct!" : "Not quite. Try again.";
    if(!right && LEVEL==="A1"){
      prReveal.textContent = `Hint: ${prValue.toFixed(2)}`;
    }
  }
  $("#prSpeak").addEventListener("click", () => speak(`It’s ${moneySpeech(prValue)}`));
  $("#prNew").addEventListener("click", newPrice);
  $("#prCheck").addEventListener("click", checkPrice);
  $("#prHint").addEventListener("click", () => {
    prReveal.textContent = `Model: ${prValue.toFixed(2)}`;
    prFb.className = "feedback";
    prFb.textContent = "Hint shown.";
  });
  eurMode.addEventListener("change", newPrice);
  newPrice();

  // ---------- Years drill ----------
  let yr = 2000;
  const yrPrompt = $("#yrPrompt");
  const yrInput = $("#yrInput");
  const yrFb = $("#yrFb");
  const yrReveal = $("#yrReveal");

  function yearSpeech(y){
    // Simple, common patterns
    if(y === 2000) return "two thousand";
    if(y >= 2001 && y <= 2009) return `two thousand and ${smallNums[y-2000]}`;
    if(y >= 2010 && y <= 2019) return `twenty ${smallNums[y-2010]}`.replace("twenty zero","twenty ten");
    if(y >= 2020 && y <= 2029) return `twenty ${smallNums[y-2020]}`.replace("twenty zero","twenty twenty");
    if(y >= 1900 && y <= 1999){
      const a = Math.floor(y/100); // 19
      const b = y % 100;
      const bWords = (b < 20) ? smallNums[b] : (b%10===0 ? tens[Math.floor(b/10)] : `${tens[Math.floor(b/10)]}-${smallNums[b%10]}`);
      return `${smallNums[a]} ${bWords}`.replace("one nine","nineteen"); // fallback
    }
    return String(y);
  }
  function prettyYearSpeech(y){
    // safer: explicit "nineteen ninety-eight" for 19xx, "two thousand and five" for 2005
    if(y >= 1900 && y <= 1999){
      const b = y % 100;
      const bWords = (b < 20) ? smallNums[b] : (b%10===0 ? tens[Math.floor(b/10)] : `${tens[Math.floor(b/10)]}-${smallNums[b%10]}`);
      return `nineteen ${bWords}`;
    }
    if(y === 2000) return "two thousand";
    if(y >= 2001 && y <= 2009) return `two thousand and ${smallNums[y-2000]}`;
    if(y >= 2010 && y <= 2019) return `twenty ${smallNums[y-2010]}`.replace("twenty zero","twenty ten");
    if(y >= 2020 && y <= 2029) return `twenty ${smallNums[y-2020]}`.replace("twenty zero","twenty twenty");
    return String(y);
  }

  function newYear(){
    const min = 1980;
    const max = 2029;
    yr = min + Math.floor(Math.random()*(max-min+1));
    yrPrompt.textContent = (LEVEL==="A1") ? "Listen and type the year" : "Year dictation";
    yrInput.value = "";
    yrReveal.textContent = "";
    yrFb.className = "feedback";
    yrFb.textContent = "Click 🔊 then type digits.";
  }
  function checkYear(){
    const typed = Number(onlyDigits(yrInput.value));
    const right = typed === yr;
    yrFb.className = right ? "feedback ok" : "feedback bad";
    yrFb.textContent = right ? "✅ Correct!" : "Not quite. Try again.";
    if(!right && LEVEL==="A1"){
      yrReveal.textContent = `Hint: ${prettyYearSpeech(yr)}`;
    }
  }
  $("#yrSpeak").addEventListener("click", () => speak(prettyYearSpeech(yr)));
  $("#yrNew").addEventListener("click", newYear);
  $("#yrCheck").addEventListener("click", checkYear);
  $("#yrHint").addEventListener("click", () => {
    yrReveal.textContent = `Words: ${prettyYearSpeech(yr)}`;
    yrFb.className = "feedback";
    yrFb.textContent = "Hint shown.";
  });
  newYear();

  // ---------- Role-play dialogues ----------
  const roleWrap = $("#roleWrap");
  const roleFb = $("#roleFb");
  let roleModel = null; // {lines: [{speaker,text,blank?:{options,answer}}], hint, speech}

  function mkSelect(options, answer){
    const opts = options.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join("");
    return `<select class="roleSel" data-answer="${esc(answer)}"><option value="">— choose —</option>${opts}</select>`;
  }

  function newRole(){
    // scenario A: date today; scenario B: meeting time
    const today = new Date(2026, 1, 10); // Feb 10 2026 (stable)
    const dayName = DAYS[(today.getDay()+6)%7][0];
    const monthName = MONTHS[today.getMonth()][0];
    const dayOrd = ordinal(today.getDate());
    const timeChoices = ["at 9:00", "at 2:30", "at 4:15", "at 11:00"];
    const meetingTime = (LEVEL==="A1") ? "at 2:30" : timeChoices[Math.floor(Math.random()*timeChoices.length)];

    const pick = Math.random() < 0.5 ? "date" : "meeting";

    if(pick === "date"){
      roleModel = {
        hint: "Hint: Present simple question: What time is it? / What’s the date today?",
        speech: `A: Hello! What’s the date today? B: It’s ${dayName}, the ${dayOrd} of ${monthName}, 2026. A: Great, thank you!`,
        lines: [
          {sp:"A", html:`Hello! ${mkSelect(["What’s the date today?","When is the meeting?","Where do you work?"],"What’s the date today?")}`},
          {sp:"B", html:`It’s ${mkSelect([`${dayName}, the ${dayOrd} of ${monthName}, 2026`, `${dayName}, ${monthName} ${today.getDate()}, 2026`, `${today.getDate()} ${monthName} 2026`], `${dayName}, the ${dayOrd} of ${monthName}, 2026`)}`},
          {sp:"A", html:`Great, ${mkSelect(["thanks!","goodbye!","why?"],"thanks!")}`}
        ]
      };
    } else {
      roleModel = {
        hint: "Hint: Ask about a meeting: What time is the meeting? It’s at…",
        speech: `A: Hi! What time is the meeting? B: The meeting is ${meetingTime}. A: Perfect. Thank you.`,
        lines: [
          {sp:"A", html:`Hi! ${mkSelect(["What time is the meeting?","How many meetings do you have?","When do you sleep?"],"What time is the meeting?")}`},
          {sp:"B", html:`The meeting is ${mkSelect(["at 9:00", meetingTime, "at 6:45"], meetingTime)}.`},
          {sp:"A", html:`Perfect. ${mkSelect(["Thank you.","See you yesterday.","I don't know."],"Thank you.")}`}
        ]
      };
    }

    renderRole();
    roleFb.className = "feedback";
    roleFb.textContent = "Choose the correct answers, then Check.";
  }

  function renderRole(){
    roleWrap.innerHTML = roleModel.lines.map((ln,i) => `
      <div class="roleLine" data-i="${i}">
        <div class="roleSp">${esc(ln.sp)}</div>
        <div class="roleTx">${ln.html}</div>
      </div>
    `).join("");
  }

  $("#roleHint").addEventListener("click", () => {
    roleFb.className = "feedback";
    roleFb.textContent = roleModel.hint;
  });

  $("#roleSpeak").addEventListener("click", () => speak(roleModel.speech));
  $("#roleNew").addEventListener("click", newRole);

  $("#roleCheck").addEventListener("click", () => {
    const sels = $$(".roleSel", roleWrap);
    let ok = 0;
    sels.forEach(sel => {
      const ans = sel.dataset.answer;
      const right = sel.value === ans;
      sel.classList.toggle("selOk", right);
      sel.classList.toggle("selBad", sel.value && !right);
      if(right) ok++;
    });
    const total = sels.length;
    roleFb.className = (ok === total) ? "feedback ok" : "feedback bad";
    roleFb.textContent = `Score: ${ok}/${total}. ${ok===total ? "Great!" : "Fix the red ones."}`;
  });

  // style role selects via injected CSS classes (already in CSS? add minimal)
  const style = document.createElement("style");
  style.textContent = `
    .roleLine{ display:grid; grid-template-columns: 34px 1fr; gap: 10px; align-items: start; padding: 8px 0; }
    .roleSp{ font-weight: 1000; color: var(--teal); }
    .roleSel{ margin: 0 6px; padding: 8px 10px; border-radius: 14px; border:1px solid var(--border); font-weight: 900; background:#fff; }
    .roleSel:focus{ outline:none; box-shadow: var(--focus); }
    .roleSel.selOk{ border-color: rgba(34,197,94,.55); background: rgba(34,197,94,.10); }
    .roleSel.selBad{ border-color: rgba(239,68,68,.55); background: rgba(239,68,68,.10); }
  `;
  document.head.appendChild(style);

  newRole();

  // ---------- WH match mini-game ----------
  const whEN = $("#whEN");
  const whFR = $("#whFR");
  const whFb = $("#whFb");
  let whPairs = [];
  let pickEN = null;

  function newWHMatch(){
    whPairs = shuffle(WH).slice(0, (LEVEL==="A1") ? 5 : 6);
    pickEN = null;

    whEN.innerHTML = whPairs.map((w,i) => `<button class="mItem" type="button" data-side="en" data-i="${i}">${esc(w.en)}</button>`).join("");
    whFR.innerHTML = shuffle(whPairs.map((w,i)=>({fr:w.fr, i}))).map(x =>
      `<button class="mItem" type="button" data-side="fr" data-i="${x.i}">${esc(x.fr)}</button>`
    ).join("");

    whFb.className = "feedback";
    whFb.textContent = "Tap an English WH word, then tap the French translation.";
  }

  function markDone(i){
    const enBtn = $(`.mItem[data-side="en"][data-i="${i}"]`, whEN);
    const frBtn = $(`.mItem[data-side="fr"][data-i="${i}"]`, whFR);
    if(enBtn){ enBtn.classList.add("is-right","is-done"); enBtn.disabled = true; }
    if(frBtn){ frBtn.classList.add("is-right","is-done"); frBtn.disabled = true; }
  }

  function clearSelected(){
    $$(".mItem", whEN).forEach(b => b.classList.remove("is-selected"));
    $$(".mItem", whFR).forEach(b => b.classList.remove("is-selected"));
  }

  function allDone(){
    return $$(".mItem", whEN).every(b => b.disabled);
  }

  function onMatchClick(e){
    const btn = e.target.closest(".mItem");
    if(!btn) return;
    const side = btn.dataset.side;
    const i = Number(btn.dataset.i);

    if(side === "en"){
      pickEN = i;
      clearSelected();
      btn.classList.add("is-selected");
      whFb.className = "feedback";
      whFb.textContent = "Now tap the French translation.";
      return;
    }

    // side === fr
    if(pickEN === null){
      btn.classList.add("is-selected");
      whFb.className = "feedback";
      whFb.textContent = "First tap an English WH word.";
      return;
    }

    const right = i === pickEN;
    if(right){
      markDone(i);
      clearSelected();
      pickEN = null;
      whFb.className = "feedback ok";
      whFb.textContent = allDone() ? "✅ All matched!" : "✅ Correct!";
    } else {
      btn.classList.add("is-wrong");
      whFb.className = "feedback bad";
      whFb.textContent = "Not a match. Try again.";
      setTimeout(() => {
        btn.classList.remove("is-wrong");
      }, 600);
    }
  }

  whEN.addEventListener("click", onMatchClick);
  whFR.addEventListener("click", onMatchClick);

  $("#whNew").addEventListener("click", newWHMatch);
  $("#whHint").addEventListener("click", () => {
    const hint = (LEVEL==="A1")
      ? "Hint: What=quoi/que • When=quand • Where=où • Who=qui • Why=pourquoi • How=comment"
      : "Hint: Focus on WHAT/WHEN/WHERE/WHO/WHY/HOW.";
    whFb.className = "feedback";
    whFb.textContent = hint;
  });

  newWHMatch();

  // ---------- Planner ----------
  const actChips = $("#actChips");
  const plannerGrid = $("#plannerGrid");
  const customAct = $("#customAct");
  const schedText = $("#schedText");
  const schedQs = $("#schedQs");

  const SLOTS = ["Morning","Afternoon","Evening"];
  const DAYS2 = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  let activities = ["work", "study English", "have a meeting", "go shopping", "do sports", "cook dinner", "rest"];
  let selectedAct = activities[0];
  let plan = {}; // key: Day|Slot -> activity

  function renderActivities(){
    actChips.innerHTML = activities.map(a =>
      `<button class="chip ${a===selectedAct?'is-active':''}" type="button" data-act="${esc(a)}">${esc(a)}</button>`
    ).join("");
  }

  actChips.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]");
    if(!b) return;
    selectedAct = b.dataset.act;
    renderActivities();
  });

  $("#addAct").addEventListener("click", () => {
    const v = customAct.value.trim();
    if(!v) return;
    activities.unshift(v);
    selectedAct = v;
    customAct.value = "";
    renderActivities();
  });

  function cellKey(day, slot){ return `${day}|${slot}`; }

  function renderPlanner(){
    const header = `<tr><th>Time</th>${DAYS2.map(d=>`<th>${d}</th>`).join("")}</tr>`;
    const rows = SLOTS.map(slot => {
      const tds = DAYS2.map(day => {
        const key = cellKey(day,slot);
        const val = plan[key] || "";
        return `<td class="pCell" tabindex="0" role="gridcell" data-day="${day}" data-slot="${slot}">
          <div class="pText">${esc(val)}</div>
        </td>`;
      }).join("");
      return `<tr><th>${slot}</th>${tds}</tr>`;
    }).join("");

    plannerGrid.innerHTML = `<table class="pTable" aria-label="Weekly planner table">${header}${rows}</table>`;
  }

  plannerGrid.addEventListener("click", (e) => {
    const cell = e.target.closest(".pCell");
    if(!cell) return;
    const key = cellKey(cell.dataset.day, cell.dataset.slot);
    plan[key] = (plan[key] === selectedAct) ? "" : selectedAct;
    renderPlanner();
  });
  plannerGrid.addEventListener("keydown", (e) => {
    if(e.key !== "Enter" && e.key !== " ") return;
    const cell = e.target.closest(".pCell");
    if(!cell) return;
    e.preventDefault();
    const key = cellKey(cell.dataset.day, cell.dataset.slot);
    plan[key] = (plan[key] === selectedAct) ? "" : selectedAct;
    renderPlanner();
  });

  $("#plannerClear").addEventListener("click", () => {
    plan = {};
    renderPlanner();
    schedText.textContent = "Cleared.";
    schedQs.textContent = "—";
  });

  function sentenceFor(day, slot, act){
    const dayFull = ({
      Mon:"Monday", Tue:"Tuesday", Wed:"Wednesday", Thu:"Thursday", Fri:"Friday", Sat:"Saturday", Sun:"Sunday"
    })[day] || day;
    return `On ${dayFull} ${slot.toLowerCase()}, I ${act}.`;
  }

  $("#plannerGenerate").addEventListener("click", () => {
    const lines = [];
    for(const slot of SLOTS){
      for(const day of DAYS2){
        const key = cellKey(day,slot);
        const act = plan[key];
        if(act){
          const verbish = act.startsWith("have") || act.startsWith("go") || act.startsWith("do") || act.startsWith("cook") || act.startsWith("rest") ? act : act;
          lines.push(sentenceFor(day, slot, verbish));
        }
      }
    }
    const text = lines.length ? lines.join(" ") : "Add activities in the grid, then generate.";
    schedText.textContent = text;

    const qs = [
      "What do you do on Monday morning?",
      "When do you study English?",
      "Where do you work?",
      "How do you organize your week?"
    ];
    schedQs.textContent = "• " + qs.join("\n• ");
  });

  $("#schedSpeak").addEventListener("click", () => speak(schedText.textContent.replace(/\n/g," ")));
  $("#qsSpeak").addEventListener("click", () => speak(schedQs.textContent.replace(/[•\n]/g," ").trim()));

  $("#schedCopy").addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(schedText.textContent);
      $("#schedCopy").textContent = "✅ Copied";
      setTimeout(()=> $("#schedCopy").textContent = "📋 Copy", 1000);
    } catch(err){
      // fallback
      const ta = document.createElement("textarea");
      ta.value = schedText.textContent;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      $("#schedCopy").textContent = "✅ Copied";
      setTimeout(()=> $("#schedCopy").textContent = "📋 Copy", 1000);
    }
  });

  renderActivities();
  renderPlanner();

})();
