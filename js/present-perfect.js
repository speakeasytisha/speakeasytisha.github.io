(function(){
  "use strict";

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // ====== SETTINGS ======
  const SETTINGS_KEY = "speakeasy_present_perfect_settings_v1";
  const state = {
    accent: "us",
    rate: 0.95,
    mode: "gentle"
  };

  const alertBox = $("#ppAlert");
  function showAlert(msg){
    if(!alertBox) return;
    alertBox.hidden = false;
    alertBox.innerHTML = msg;
  }
  function hideAlert(){
    if(!alertBox) return;
    alertBox.hidden = true;
    alertBox.textContent = "";
  }

  function loadSettings(){
    try{
      const raw = localStorage.getItem(SETTINGS_KEY);
      if(!raw) return;
      const s = JSON.parse(raw);
      if(s && typeof s === "object"){
        if(s.accent) state.accent = s.accent;
        if(s.rate) state.rate = Number(s.rate) || state.rate;
        if(s.mode) state.mode = s.mode;
      }
    }catch(_){}
  }
  function saveSettings(){
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ accent: state.accent, rate: state.rate, mode: state.mode }));
  }

  // ====== SPEECH (TTS) ======
  let VOICES = [];
  function refreshVoices(){
    if(!window.speechSynthesis) return;
    VOICES = speechSynthesis.getVoices() || [];
  }
  if(window.speechSynthesis){
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }

  function pickVoice(){
    const accent = state.accent;
    const langWanted = accent === "uk" ? ["en-GB","en_GB"] : ["en-US","en_US"];
    const english = VOICES.filter(v => String(v.lang || "").toLowerCase().startsWith("en"));
    // Try exact lang first
    for(const lw of langWanted){
      const found = english.find(v => String(v.lang).includes(lw));
      if(found) return found;
    }
    // Try name hints
    const want = accent === "uk" ? ["UK","United Kingdom","British"] : ["US","United States","American"];
    for(const w of want){
      const found = english.find(v => String(v.name || "").includes(w));
      if(found) return found;
    }
    return english[0] || VOICES[0] || null;
  }

  function speak(text){
    hideAlert();
    if(!window.speechSynthesis){
      showAlert("⚠️ Listening is not supported in this browser (speech synthesis missing).");
      return false;
    }
    try{
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      const v = pickVoice();
      if(v) u.voice = v;
      u.lang = v?.lang || (state.accent === "uk" ? "en-GB" : "en-US");
      u.rate = state.rate || 0.95;
      u.pitch = 1.0;
      speechSynthesis.speak(u);
      return true;
    }catch(e){
      showAlert("⚠️ Could not play audio: " + (e?.message || "unknown error"));
      return false;
    }
  }

  // ====== DATA ======
  const TIME_CARDS = [
    { icon:"🕒", term:"just", note:"very recently", ex:"I’ve <strong>just</strong> finished." },
    { icon:"✅", term:"already", note:"sooner than expected", ex:"She’s <strong>already</strong> sent it." },
    { icon:"⏳", term:"yet", note:"(negatives/questions) until now", ex:"I haven’t received it <strong>yet</strong>." },
    { icon:"📅", term:"since", note:"start point", ex:"We’ve worked here <strong>since</strong> 2023." },
    { icon:"⌛", term:"for", note:"duration", ex:"I’ve lived in France <strong>for</strong> 20 years." },
    { icon:"🌍", term:"ever / never", note:"experience", ex:"Have you <strong>ever</strong> travelled to Canada?" },
    { icon:"🟢", term:"so far", note:"up to now", ex:"So far, we’ve solved 3 issues." },
    { icon:"🗓️", term:"this week / today", note:"unfinished time", ex:"I’ve had two meetings <strong>today</strong>." },
    { icon:"🔁", term:"recently / lately", note:"in the near past", ex:"Have you spoken to him <strong>recently</strong>?" },
  ];

  const VOCAB_TOPICS = {
    core: [
      {icon:"✅", term:"finish", pp:"finished", def:"complete something", ex:"I’ve finished the report."},
      {icon:"📨", term:"send", pp:"sent", def:"deliver by email/message", ex:"She’s sent the invoice."},
      {icon:"📎", term:"attach", pp:"attached", def:"add a file", ex:"I’ve attached the document."},
      {icon:"📞", term:"call", pp:"called", def:"phone/contact", ex:"We’ve called the client."},
      {icon:"👀", term:"check", pp:"checked", def:"verify", ex:"Have you checked the schedule?"},
      {icon:"🧾", term:"pay", pp:"paid", def:"give money", ex:"They’ve paid already."},
      {icon:"🧠", term:"learn", pp:"learned/learnt", def:"gain knowledge (US/UK)", ex:"I’ve learnt a lot."},
      {icon:"🧹", term:"clean", pp:"cleaned", def:"make clean", ex:"We’ve cleaned the room."},
      {icon:"🧳", term:"pack", pp:"packed", def:"put items in a bag", ex:"I’ve packed my suitcase."},
      {icon:"🛠️", term:"fix", pp:"fixed", def:"repair/solve", ex:"IT has fixed the issue."},
    ],
    email: [
      {icon:"🗂️", term:"update", pp:"updated", def:"make current", ex:"I’ve updated the file."},
      {icon:"🗓️", term:"reschedule", pp:"rescheduled", def:"change time/date", ex:"We’ve rescheduled the meeting."},
      {icon:"🧾", term:"invoice", pp:"invoiced", def:"send a bill (verb)", ex:"They’ve invoiced us."},
      {icon:"✅", term:"confirm", pp:"confirmed", def:"say it is correct", ex:"I’ve confirmed receipt."},
      {icon:"📝", term:"sign", pp:"signed", def:"write your name", ex:"She’s signed the document."},
      {icon:"📨", term:"reply", pp:"replied", def:"answer an email", ex:"He hasn’t replied yet."},
      {icon:"📌", term:"deadline", pp:"—", def:"latest finish time", ex:"We haven’t met the deadline."},
      {icon:"⛔", term:"delay", pp:"delayed", def:"make late / be late", ex:"The shipment has been delayed."},
    ],
    hospitality: [
      {icon:"🛎️", term:"check in", pp:"checked in", def:"arrive and register", ex:"The guest has checked in."},
      {icon:"🧾", term:"book", pp:"booked", def:"reserve", ex:"They’ve booked a room."},
      {icon:"🧼", term:"replace", pp:"replaced", def:"put a new one", ex:"Housekeeping has replaced the towels."},
      {icon:"🪟", term:"request", pp:"requested", def:"ask for", ex:"The guest has requested extra pillows."},
      {icon:"🧳", term:"leave", pp:"left", def:"go away", ex:"They’ve left the luggage at reception."},
      {icon:"🧹", term:"tidy", pp:"tidied", def:"make neat", ex:"We’ve tidied the room."},
    ],
    it: [
      {icon:"🔐", term:"reset", pp:"reset", def:"set again", ex:"I’ve reset your password."},
      {icon:"🧩", term:"install", pp:"installed", def:"put software on", ex:"We’ve installed the update."},
      {icon:"📶", term:"connect", pp:"connected", def:"join network", ex:"Have you connected to Wi‑Fi?"},
      {icon:"🐞", term:"report", pp:"reported", def:"tell about a problem", ex:"Users have reported a bug."},
      {icon:"🛠️", term:"troubleshoot", pp:"troubleshot", def:"diagnose and fix", ex:"We’ve troubleshot the issue."},
    ],
    logistics: [
      {icon:"🚚", term:"deliver", pp:"delivered", def:"bring to destination", ex:"They’ve delivered the order."},
      {icon:"📦", term:"ship", pp:"shipped", def:"send goods", ex:"We’ve shipped the package."},
      {icon:"⛔", term:"delay", pp:"delayed", def:"be late", ex:"The shipment has been delayed."},
      {icon:"🧾", term:"track", pp:"tracked", def:"follow progress", ex:"I’ve tracked the parcel."},
      {icon:"✅", term:"arrive", pp:"arrived", def:"reach destination", ex:"It hasn’t arrived yet."},
    ]
  };

  const IRREGULARS = [
    {icon:"🚶", base:"go", pp:"gone", ex:"I’ve gone to the office."},
    {icon:"✍️", base:"write", pp:"written", ex:"She’s written an email."},
    {icon:"🍽️", base:"eat", pp:"eaten", ex:"They’ve eaten already."},
    {icon:"🗣️", base:"speak", pp:"spoken", ex:"I’ve spoken to the manager."},
    {icon:"👀", base:"see", pp:"seen", ex:"Have you seen my keys?"},
    {icon:"📦", base:"send", pp:"sent", ex:"I’ve sent the invoice."},
    {icon:"🤝", base:"meet", pp:"met", ex:"We’ve met before."},
    {icon:"📞", base:"do", pp:"done", ex:"I’ve done it."},
    {icon:"📚", base:"take", pp:"taken", ex:"He’s taken the train."},
    {icon:"💡", base:"make", pp:"made", ex:"She’s made a decision."},
    {icon:"🧹", base:"be", pp:"been", ex:"I’ve been busy."},
    {icon:"🏃", base:"run", pp:"run", ex:"I’ve run three times this week."},
  ];

  const MCQ_SETS = {
    tense: [
      {id:"t1", q:"I ____ the client yesterday.", a:["have called","called","have been calling","am calling"], correct:1, why:"Finished time (yesterday) → <strong>past simple</strong>."},
      {id:"t2", q:"We ____ two meetings today.", a:["have had","had","have","are having"], correct:0, why:"Unfinished time (today) → <strong>present perfect</strong> is natural."},
      {id:"t3", q:"She ____ in Paris since 2020.", a:["lived","has lived","is living","lives"], correct:1, why:"Since + start point continuing now → <strong>has lived</strong>."},
      {id:"t4", q:"I ____ my keys. I can’t find them now.", a:["lost","have lost","am losing","lose"], correct:1, why:"Result now (keys missing) → <strong>have lost</strong>."},
      {id:"t5", q:"He ____ the email yet.", a:["didn't send","hasn't sent","isn't sending","hasn't send"], correct:1, why:"Yet + negative → <strong>hasn't sent</strong>."},
      {id:"t6", q:"I ____ to Canada in 2019.", a:["have been","went","have gone","have went"], correct:1, why:"Finished time (in 2019) → past simple: <strong>went</strong>."},
      {id:"t7", q:"So far, we ____ three issues.", a:["fixed","have fixed","fix","are fixing"], correct:1, why:"So far → up to now → <strong>have fixed</strong>."},
      {id:"t8", q:"Have you ever ____ sushi?", a:["ate","eaten","eat","eating"], correct:1, why:"Ever + present perfect → past participle: <strong>eaten</strong>."},
    ],
    participles: [
      {id:"p1", q:"I’ve ____ the report. (finish)", a:["finish","finished","finishing","finishes"], correct:1, why:"Present perfect uses past participle: <strong>finished</strong>."},
      {id:"p2", q:"She’s ____ an email. (write)", a:["wrote","written","write","writing"], correct:1, why:"write → wrote → <strong>written</strong>."},
      {id:"p3", q:"They’ve ____ already. (eat)", a:["ate","eaten","eating","eat"], correct:1, why:"eat → ate → <strong>eaten</strong>."},
      {id:"p4", q:"We’ve ____ the client. (meet)", a:["meet","met","meeting","meeted"], correct:1, why:"meet → <strong>met</strong>."},
      {id:"p5", q:"He hasn’t ____ the file yet. (send)", a:["send","sent","sending","sended"], correct:1, why:"send → <strong>sent</strong>."},
      {id:"p6", q:"I’ve ____ busy today. (be)", a:["was","been","be","being"], correct:1, why:"be → was/were → <strong>been</strong>."},
      {id:"p7", q:"She’s ____ a decision. (make)", a:["made","make","making","maked"], correct:0, why:"make → <strong>made</strong>."},
      {id:"p8", q:"Have you ____ the invoice? (see)", a:["saw","seen","see","seeing"], correct:1, why:"see → saw → <strong>seen</strong>."},
    ],
    timewords: [
      {id:"w1", q:"I’ve ____ finished. (very recently)", a:["yet","just","since","for"], correct:1, why:"<strong>just</strong> = very recently."},
      {id:"w2", q:"She’s ____ sent it. (earlier than expected)", a:["already","yet","since","never"], correct:0, why:"<strong>already</strong> = sooner than expected."},
      {id:"w3", q:"I haven’t received it ____. (until now)", a:["already","yet","since","for"], correct:1, why:"Negative → <strong>yet</strong>."},
      {id:"w4", q:"I’ve worked here ____ 2023.", a:["for","since","already","yet"], correct:1, why:"Start point → <strong>since</strong>."},
      {id:"w5", q:"I’ve worked here ____ two years.", a:["for","since","yet","just"], correct:0, why:"Duration → <strong>for</strong>."},
      {id:"w6", q:"Have you ____ stayed in a 5-star hotel?", a:["never","ever","yet","since"], correct:1, why:"Experience question → <strong>ever</strong>."},
      {id:"w7", q:"So far, we’ve ____ 5 emails.", a:["send","sent","since","for"], correct:1, why:"Past participle <strong>sent</strong>."},
      {id:"w8", q:"I’ve been busy ____.", a:["yesterday","recently","last week","in 2020"], correct:1, why:"<strong>recently</strong> fits present perfect."},
    ],
    work: [
      {id:"c1", q:"Choose the best email sentence:", a:[
        "I sent it today already.",
        "I’ve already sent it today.",
        "I already send it today.",
        "I’ve sent it yesterday."
      ], correct:1, why:"Unfinished time (today) + already → <strong>I’ve already sent it today.</strong>"},
      {id:"c2", q:"Client follow-up:", a:[
        "Have you received my email yet?",
        "Did you received my email yet?",
        "Have you receive my email yesterday?",
        "Are you received my email?"
      ], correct:0, why:"Present perfect question + yet: <strong>Have you received… yet?</strong>"},
      {id:"c3", q:"Progress update:", a:[
        "We fixed three issues so far.",
        "We’ve fixed three issues so far.",
        "We’ve fix three issues so far.",
        "We fixed three issues yesterday so far."
      ], correct:1, why:"So far → present perfect: <strong>We’ve fixed…</strong>"},
      {id:"c4", q:"Delay notice:", a:[
        "The shipment has delayed.",
        "The shipment has been delayed.",
        "The shipment have delayed.",
        "The shipment delayed since Monday."
      ], correct:1, why:"Passive present perfect: <strong>has been delayed</strong>."},
      {id:"c5", q:"Meeting reschedule:", a:[
        "We have rescheduled it to next week.",
        "We rescheduled it since next week.",
        "We have reschedule it yesterday.",
        "We have been rescheduled it."
      ], correct:0, why:"Correct structure: <strong>have rescheduled</strong>."},
      {id:"c6", q:"Polite reminder:", a:[
        "I haven't received the signed document yet.",
        "I didn't received the signed document yet.",
        "I haven't receive the signed document already.",
        "I not received the signed document yet."
      ], correct:0, why:"Negative + yet: <strong>haven’t received … yet</strong>."},
      {id:"c7", q:"Experience:", a:[
        "I have worked with international clients.",
        "I worked with international clients yesterday.",
        "I have worked with international clients yesterday.",
        "I am worked with international clients."
      ], correct:0, why:"Experience without finished time → <strong>I have worked…</strong>"},
      {id:"c8", q:"Short answer:", a:[
        "Yes, I did.",
        "Yes, I have.",
        "Yes, I am.",
        "Yes, I was."
      ], correct:1, why:"Present perfect question → short answer: <strong>Yes, I have.</strong>"},
    ]
  };

  const CLOZE_SETS = {
    havehas: [
      {id:"h1", q:"I ____ (finish) the report.", answers:["have finished"], why:"I + have + past participle."},
      {id:"h2", q:"She ____ (send) the invoice.", answers:["has sent"], why:"She + has + past participle."},
      {id:"h3", q:"We ____ (not / receive) it yet.", answers:["haven't received","have not received"], why:"Negative: haven't/ have not + PP."},
      {id:"h4", q:"____ you ____ (check) the schedule?", answers:["have you checked"], why:"Question: Have + subject + PP."},
      {id:"h5", q:"He ____ (write) an email.", answers:["has written"], why:"write → written."},
      {id:"h6", q:"They ____ (book) a room.", answers:["have booked"], why:"Regular -ed: booked."},
      {id:"h7", q:"I ____ (be) busy today.", answers:["have been"], why:"be → been."},
      {id:"h8", q:"It ____ (not / arrive) yet.", answers:["hasn't arrived","has not arrived"], why:"It + has not + PP."},
    ],
    sincefor: [
      {id:"s1", q:"I’ve worked here ____ 2023.", answers:["since"], why:"Start point → since."},
      {id:"s2", q:"I’ve worked here ____ two years.", answers:["for"], why:"Duration → for."},
      {id:"s3", q:"She’s lived in France ____ 20 years.", answers:["for"], why:"Duration → for."},
      {id:"s4", q:"We’ve known each other ____ last summer.", answers:["since"], why:"Start time → since."},
      {id:"s5", q:"They’ve been in the meeting ____ 10 a.m.", answers:["since"], why:"Start time → since 10 a.m."},
      {id:"s6", q:"I’ve waited ____ 30 minutes.", answers:["for"], why:"Duration → for 30 minutes."},
      {id:"s7", q:"He’s had this job ____ 2019.", answers:["since"], why:"Start point → since."},
      {id:"s8", q:"We’ve used this system ____ a long time.", answers:["for"], why:"Duration → for."},
    ],
    yetalready: [
      {id:"y1", q:"I’ve ____ finished. (very recently)", answers:["just"], why:"Just = very recently."},
      {id:"y2", q:"She’s ____ sent it. (earlier than expected)", answers:["already"], why:"Already = sooner than expected."},
      {id:"y3", q:"I haven’t received it ____. (until now)", answers:["yet"], why:"Yet in negatives/questions."},
      {id:"y4", q:"Have you sent the email ____?", answers:["yet"], why:"Yet in questions."},
      {id:"y5", q:"We’ve ____ completed the first draft.", answers:["just"], why:"Just = a moment ago."},
      {id:"y6", q:"He hasn’t replied ____.", answers:["yet"], why:"Yet = until now."},
      {id:"y7", q:"They’ve ____ arrived.", answers:["just"], why:"Just = very recently."},
      {id:"y8", q:"I’ve ____ paid the invoice.", answers:["already"], why:"Already = done earlier than expected."},
    ]
  };

  const MATCH_POOL = [
    ["go","gone"],["write","written"],["eat","eaten"],["speak","spoken"],["see","seen"],["send","sent"],
    ["meet","met"],["do","done"],["take","taken"],["make","made"],["be","been"],["run","run"]
  ];

  const BUILD_SENTENCES = [
    { id:"b1", tokens:["I’ve","just","finished","the","report","."], target:"I’ve just finished the report .", why:"Just goes before the past participle."},
    { id:"b2", tokens:["Have","you","ever","worked","in","hospitality","?"], target:"Have you ever worked in hospitality ?", why:"Question: Have + subject + ever + PP."},
    { id:"b3", tokens:["She","hasn’t","received","it","yet","."], target:"She hasn’t received it yet .", why:"Yet usually goes at the end."},
    { id:"b4", tokens:["We’ve","worked","here","since","2023","."], target:"We’ve worked here since 2023 .", why:"Since + start point."},
    { id:"b5", tokens:["They’ve","already","sent","the","invoice","."], target:"They’ve already sent the invoice .", why:"Already often goes before the PP."},
    { id:"b6", tokens:["Has","he","called","you","today","?"], target:"Has he called you today ?", why:"Has + he + PP + unfinished time."},
  ];

  const ORAL_REPEAT = [
    { id:"o1", text:"I’ve just finished the report.", help:"Stress: JUST FIN-ished the re-PORT."},
    { id:"o2", text:"Have you ever worked with international clients?", help:"Linking: Have you / ever / worked…"},
    { id:"o3", text:"I haven’t received it yet.", help:"Haven’t = HAV-ənt (British) / HAV-ənt (US)."},
    { id:"o4", text:"We’ve had a delay since Monday.", help:"Since MON-day."},
    { id:"o5", text:"She’s already sent the invoice.", help:"AL-ready."},
    { id:"o6", text:"I’ve been very busy today.", help:"Been = BIN."},
  ];

  const ORAL_PROMPTS = [
    { id:"p1", icon:"📧", q:"Explain (in present perfect) what you have done today at work.", frames:[
      "I’ve answered…", "I’ve sent…", "I’ve had…", "I’ve completed…", "So far, I’ve…"
    ]},
    { id:"p2", icon:"🛎️", q:"Hospitality: Tell a colleague what has happened since the guest arrived.", frames:[
      "The guest has checked in…", "They’ve requested…", "Housekeeping has…", "We haven’t… yet"
    ]},
    { id:"p3", icon:"🛠️", q:"IT: Describe what you have tried to fix a problem (so far).", frames:[
      "I’ve restarted…", "I’ve checked…", "I’ve installed…", "So far, I haven’t…"
    ]},
    { id:"p4", icon:"🚚", q:"Logistics: Update a client about a delivery (delay, tracking, arrival).", frames:[
      "The shipment has been delayed…", "We’ve updated tracking…", "It hasn’t arrived yet…"
    ]},
  ];

  // ====== HELPERS ======
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"
    }[m]));
  }

  function normalize(str){
    return String(str)
      .toLowerCase()
      .replace(/[^\w\s’']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Levenshtein distance for oral similarity
  function levenshtein(a, b){
    a = normalize(a); b = normalize(b);
    const m = a.length, n = b.length;
    if(m === 0) return n;
    if(n === 0) return m;
    const dp = Array.from({length:m+1}, () => new Array(n+1).fill(0));
    for(let i=0;i<=m;i++) dp[i][0] = i;
    for(let j=0;j<=n;j++) dp[0][j] = j;
    for(let i=1;i<=m;i++){
      for(let j=1;j<=n;j++){
        const cost = a[i-1] === b[j-1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i-1][j] + 1,
          dp[i][j-1] + 1,
          dp[i-1][j-1] + cost
        );
      }
    }
    return dp[m][n];
  }

  function similarity(a, b){
    const na = normalize(a), nb = normalize(b);
    const maxLen = Math.max(na.length, nb.length) || 1;
    const dist = levenshtein(na, nb);
    return Math.max(0, Math.round((1 - dist / maxLen) * 100));
  }

  // ====== RENDER: TIME CARDS ======
  function renderTimeCards(){
    const mount = $("#ppTimeCards");
    if(!mount) return;
    mount.innerHTML = TIME_CARDS.map(c => `
      <div class="se-vocab-card">
        <div class="se-vocab-ico">${c.icon}</div>
        <div class="se-vocab-body">
          <p class="se-vocab-term">${escapeHtml(c.term)}</p>
          <p class="se-vocab-def">${escapeHtml(c.note)}</p>
          <p class="se-vocab-ex">${c.ex}</p>
          <div class="se-actions">
            <button class="se-btn" type="button" data-say="${escapeHtml(c.term)}">🔊 word</button>
            <button class="se-btn" type="button" data-say="${escapeHtml(c.ex.replace(/<[^>]*>/g,''))}">🔊 example</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  // ====== RENDER: VOCAB ======
  let currentVocabTopic = "core";
  function renderVocab(topic){
    const grid = $("#ppVocabGrid");
    if(!grid) return;
    const list = VOCAB_TOPICS[topic] || VOCAB_TOPICS.core;
    grid.innerHTML = list.map(v => `
      <article class="se-vocab-card">
        <div class="se-vocab-ico">${v.icon}</div>
        <div class="se-vocab-body">
          <p class="se-vocab-term">${escapeHtml(v.term)} <span class="se-mini">→ ${escapeHtml(v.pp)}</span></p>
          <p class="se-vocab-def">${escapeHtml(v.def)}</p>
          <p class="se-vocab-ex">${escapeHtml(v.ex)}</p>
          <div class="se-actions">
            <button class="se-btn se-btn--primary" type="button" data-say="${escapeHtml(v.term)}">🔊 word</button>
            <button class="se-btn" type="button" data-say="${escapeHtml(v.ex)}">🔊 example</button>
          </div>
        </div>
      </article>
    `).join("");
  }

  // ====== FLASHCARDS ======
  function renderFlashPlayer(deck, mount){
    if(!mount) return;
    const cards = shuffle(deck).slice(0, deck.length); // clone

    let idx = 0;
    let flipped = false;
    let known = 0;
    let unsure = 0;

    function current(){ return cards[idx]; }

    function draw(){
      const c = current();
      if(!c){
        mount.innerHTML = `<div class="se-feedback">No cards found.</div>`;
        return;
      }
      mount.innerHTML = `
        <div class="se-flash">
          <div class="se-qa__meta">
            <span class="se-badge">Card ${idx+1}/${cards.length}</span>
            <span class="se-badge">Known: ${known}</span>
            <span class="se-badge">Not sure: ${unsure}</span>
          </div>

          <div class="se-flash__card ${flipped ? "is-flipped" : ""}" id="ppFlashCard" role="button" tabindex="0" aria-label="Flashcard (click to flip)">
            <div class="se-flip">
              <div class="se-face">
                <div class="se-face__big">${c.front}</div>
                <div class="se-face__small se-mini">Click to flip</div>
              </div>
              <div class="se-face se-face--back">
                <div class="se-face__big">${c.back}</div>
                <div class="se-face__small se-mini">Click to flip</div>
              </div>
            </div>
          </div>

          <div class="se-actions">
            <button class="se-btn" type="button" id="ppFlashPrev">← Prev</button>
            <button class="se-btn se-btn--primary" type="button" id="ppFlashFlip">🔁 Flip</button>
            <button class="se-btn" type="button" id="ppFlashSpeak">🔊 Listen</button>
            <button class="se-btn" type="button" id="ppFlashNext">Next →</button>
          </div>

          <div class="se-actions">
            <button class="se-btn" type="button" id="ppFlashKnown">✅ I know it</button>
            <button class="se-btn" type="button" id="ppFlashUnsure">🧭 Not sure</button>
            <button class="se-btn" type="button" id="ppFlashShuffle">🔀 Shuffle</button>
          </div>
        </div>
      `;

      const cardEl = $("#ppFlashCard", mount);
      const flip = () => { flipped = !flipped; draw(); };

      cardEl.addEventListener("click", flip);
      cardEl.addEventListener("keydown", (e) => {
        if(e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
      });

      $("#ppFlashPrev", mount).addEventListener("click", () => { flipped = false; idx = (idx - 1 + cards.length) % cards.length; draw(); });
      $("#ppFlashNext", mount).addEventListener("click", () => { flipped = false; idx = (idx + 1) % cards.length; draw(); });
      $("#ppFlashFlip", mount).addEventListener("click", flip);
      $("#ppFlashSpeak", mount).addEventListener("click", () => {
        const txt = flipped ? c.speakBack : c.speakFront;
        speak(txt);
      });
      $("#ppFlashKnown", mount).addEventListener("click", () => { known += 1; flipped = false; idx = (idx + 1) % cards.length; draw(); });
      $("#ppFlashUnsure", mount).addEventListener("click", () => { unsure += 1; flipped = false; idx = (idx + 1) % cards.length; draw(); });
      $("#ppFlashShuffle", mount).addEventListener("click", () => {
        const reshuffled = shuffle(cards);
        cards.length = 0; cards.push(...reshuffled);
        idx = 0; flipped = false; draw();
      });
    }

    draw();
  }

  function deckIrregulars(){
    return IRREGULARS.map(v => ({
      front: `${v.icon} ${escapeHtml(v.base)}`,
      back: `${escapeHtml(v.pp)}<div class="se-mini">${escapeHtml(v.ex)}</div>`,
      speakFront: v.base,
      speakBack: v.ex
    }));
  }
  function deckTime(){
    return TIME_CARDS.map(c => ({
      front: `${c.icon} ${escapeHtml(c.term)}`,
      back: `${escapeHtml(c.note)}<div class="se-mini">${c.ex.replace(/<[^>]*>/g,'')}</div>`,
      speakFront: c.term,
      speakBack: c.ex.replace(/<[^>]*>/g,'')
    }));
  }
  function deckTopic(topic){
    const list = VOCAB_TOPICS[topic] || VOCAB_TOPICS.core;
    return list.map(v => ({
      front: `${v.icon} ${escapeHtml(v.term)}`,
      back: `${escapeHtml(v.pp)}<div class="se-mini">${escapeHtml(v.def)}<br><em>${escapeHtml(v.ex)}</em></div>`,
      speakFront: v.term,
      speakBack: v.ex
    }));
  }

  // ====== MCQ ENGINE ======
  function renderMCQSet(setKey){
    const mount = $("#ppMcqMount");
    if(!mount) return;

    const pool = (MCQ_SETS[setKey] || MCQ_SETS.tense).slice();
    const questions = shuffle(pool).slice(0, pool.length);

    let idx = 0;
    let score = 0;
    let done = false;

    function draw(){
      const q = questions[idx];
      const pct = Math.round((idx / questions.length) * 100);

      mount.innerHTML = `
        <div class="se-qa">
          <div class="se-qa__meta">
            <span class="se-badge">Question ${idx+1}/${questions.length}</span>
            <div class="se-progressbar"><span style="width:${pct}%"></span></div>
            <span class="se-badge">Score: ${score}</span>
          </div>

          <h3 class="se-h3" style="margin-top:.75rem;">${escapeHtml(q.q)}</h3>

          <div class="se-choices">
            ${q.a.map((opt, i) => `<button class="se-choice" type="button" data-i="${i}">${escapeHtml(opt)}</button>`).join("")}
          </div>

          <div class="se-row">
            <button class="se-btn" type="button" data-say="${escapeHtml(q.q)}">🔊 Listen question</button>
            <button class="se-btn" type="button" data-next ${done ? "disabled" : ""}>Next</button>
          </div>

          <div id="ppMcqFb"></div>
        </div>
      `;

      const fb = $("#ppMcqFb", mount);
      const choiceBtns = $$(".se-choice", mount);

      const sayBtn = $("[data-say]", mount);
      if(sayBtn) sayBtn.addEventListener("click", () => speak(sayBtn.getAttribute("data-say") || ""));

      choiceBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          if(done) return;
          const i = Number(btn.getAttribute("data-i"));
          const ok = i === q.correct;
          choiceBtns.forEach(b => b.disabled = true);

          btn.classList.add(ok ? "is-correct" : "is-wrong");
          if(!ok){
            const right = choiceBtns[q.correct];
            if(right) right.classList.add("is-correct");
          }

          if(ok) score += 1;

          if(state.mode === "exam"){
            fb.innerHTML = `<div class="se-feedback"><strong>${ok ? "✅ Correct." : "🧭 Not this time."}</strong></div>`;
          }else{
            fb.innerHTML = `<div class="se-feedback"><strong>${ok ? "✅ Nice." : "🧭 Almost — useful mistake."}</strong><br>${q.why}</div>`;
          }

          done = true;
          const nextBtn = $("[data-next]", mount);
          if(nextBtn) nextBtn.disabled = false;
        });
      });

      const nextBtn = $("[data-next]", mount);
      if(nextBtn){
        nextBtn.disabled = true;
        nextBtn.addEventListener("click", () => {
          done = false;
          if(idx < questions.length - 1){
            idx += 1;
            draw();
          }else{
            renderMCQResults();
          }
        });
      }
    }

    function renderMCQResults(){
      const pct = Math.round((score / questions.length) * 100);
      const msg = pct >= 80 ? "Excellent — your choices are very natural." : pct >= 60 ? "Good progress — keep practicing your weak spots." : "Totally okay — review the explanation and try again.";
      mount.innerHTML = `
        <div class="se-feedback">
          <strong>🏁 MCQ complete.</strong><br>
          Score: <strong>${score}/${questions.length}</strong> (${pct}%)<br>
          ${msg}
          <div class="se-actions" style="margin-top:.6rem;">
            <button class="se-btn se-btn--primary" type="button" id="ppMcqAgain">Try again (new order)</button>
          </div>
        </div>
      `;
      $("#ppMcqAgain", mount).addEventListener("click", () => renderMCQSet(setKey));
    }

    draw();
  }

  // ====== CLOZE ENGINE ======
  function renderClozeSet(setKey){
    const mount = $("#ppClozeMount");
    if(!mount) return;

    const items = shuffle((CLOZE_SETS[setKey] || CLOZE_SETS.havehas).slice());
    let idx = 0;
    let score = 0;

    function draw(){
      const it = items[idx];
      const pct = Math.round((idx / items.length) * 100);
      mount.innerHTML = `
        <div class="se-qa">
          <div class="se-qa__meta">
            <span class="se-badge">Item ${idx+1}/${items.length}</span>
            <div class="se-progressbar"><span style="width:${pct}%"></span></div>
            <span class="se-badge">Score: ${score}</span>
          </div>

          <h3 class="se-h3" style="margin-top:.75rem;">${escapeHtml(it.q)}</h3>

          <div class="se-row">
            <input class="se-input" id="ppClozeInp" placeholder="Type your answer…" autocomplete="off" spellcheck="false" />
            <button class="se-btn se-btn--primary" type="button" id="ppClozeCheck">Check</button>
            <button class="se-btn" type="button" id="ppClozeHint">Hint</button>
          </div>

          <div id="ppClozeFb"></div>
        </div>
      `;

      const inp = $("#ppClozeInp", mount);
      const fb = $("#ppClozeFb", mount);

      $("#ppClozeHint", mount).addEventListener("click", () => {
        if(state.mode === "exam"){
          fb.innerHTML = `<div class="se-feedback">Hint is disabled in Exam‑ish mode.</div>`;
          return;
        }
        fb.innerHTML = `<div class="se-feedback"><strong>Hint:</strong> Think about <em>have/has</em>, then the <em>past participle</em>. If you see <em>since/for</em>, decide start point vs duration.</div>`;
      });

      function check(){
        const user = normalize(inp.value || "");
        const answers = (it.answers || []).map(a => normalize(a));
        const ok = answers.includes(user);

        inp.disabled = true;
        $("#ppClozeCheck", mount).disabled = true;

        if(ok) score += 1;

        const correctText = it.answers[0];

        if(state.mode === "exam"){
          fb.innerHTML = `<div class="se-feedback"><strong>${ok ? "✅ Correct." : "🧭 Not this time."}</strong>${ok ? "" : `<br>Correct: <strong>${escapeHtml(correctText)}</strong>`}</div>`;
        }else{
          fb.innerHTML = `<div class="se-feedback"><strong>${ok ? "✅ Great." : "🧭 Almost — useful."}</strong>${ok ? "" : `<br>Correct: <strong>${escapeHtml(correctText)}</strong>`}<br>${it.why}</div>`;
        }

        const actions = document.createElement("div");
        actions.className = "se-actions";
        actions.innerHTML = `
          <button class="se-btn" type="button" id="ppClozeListen">🔊 Listen sentence</button>
          <button class="se-btn se-btn--primary" type="button" id="ppClozeNext">Next</button>
        `;
        fb.appendChild(actions);

        $("#ppClozeListen", mount).addEventListener("click", () => speak(it.q.replace(/\(.*?\)/g,"").replace("____", correctText)));
        $("#ppClozeNext", mount).addEventListener("click", () => {
          if(idx < items.length - 1){
            idx += 1;
            draw();
          }else{
            renderClozeResults();
          }
        });
      }

      $("#ppClozeCheck", mount).addEventListener("click", check);
      inp.addEventListener("keydown", (e) => { if(e.key === "Enter") check(); });
    }

    function renderClozeResults(){
      const pct = Math.round((score / items.length) * 100);
      const msg = pct >= 80 ? "Excellent accuracy." : pct >= 60 ? "Good — repeat the set once more for confidence." : "No stress — re‑do slowly and read the explanations.";
      mount.innerHTML = `
        <div class="se-feedback">
          <strong>🏁 Cloze complete.</strong><br>
          Score: <strong>${score}/${items.length}</strong> (${pct}%)<br>
          ${msg}
          <div class="se-actions" style="margin-top:.6rem;">
            <button class="se-btn se-btn--primary" type="button" id="ppClozeAgain">Try again (new order)</button>
          </div>
        </div>
      `;
      $("#ppClozeAgain", mount).addEventListener("click", () => renderClozeSet(setKey));
    }

    draw();
  }

  // ====== DRAG MATCH ======
  function renderMatch(){
    const mount = $("#ppMatchMount");
    if(!mount) return;

    // pick 6 pairs each time
    const pairs = shuffle(MATCH_POOL).slice(0, 6);
    const left = shuffle(pairs.map(p => p[0]));
    const right = pairs.map(p => p[1]);

    const placed = {}; // pp -> base
    mount.innerHTML = `
      <div class="se-dd">
        <div>
          <div class="se-tiles" id="ppMatchTiles">
            ${left.map(v => `<span class="se-tile" draggable="true" data-token="${escapeHtml(v)}">${escapeHtml(v)}</span>`).join("")}
          </div>
          <div class="se-actions" style="margin-top:.65rem;">
            <button class="se-btn" id="ppMatchReset" type="button">Reset</button>
            <button class="se-btn se-btn--primary" id="ppMatchCheck" type="button">Check</button>
          </div>
        </div>

        <div id="ppMatchSlots" style="display:grid; gap:.55rem;">
          ${right.map(pp => `
            <div class="se-drop" data-pp="${escapeHtml(pp)}">
              <div class="se-drop__label">${escapeHtml(pp)}</div>
              <div class="se-drop__slot" data-slot="${escapeHtml(pp)}">Drop verb</div>
            </div>
          `).join("")}
        </div>
      </div>
      <div id="ppMatchFb"></div>
    `;

    // drag logic
    const tiles = $$("#ppMatchTiles .se-tile", mount);
    tiles.forEach(t => {
      t.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", t.getAttribute("data-token") || "");
      });
    });

    const slots = $$("#ppMatchSlots .se-drop", mount);
    slots.forEach(drop => {
      drop.addEventListener("dragover", (e) => e.preventDefault());
      drop.addEventListener("drop", (e) => {
        e.preventDefault();
        const tok = e.dataTransfer.getData("text/plain");
        const pp = drop.getAttribute("data-pp");
        if(!tok || !pp) return;
        placed[pp] = tok;
        const slot = $(`[data-slot="${pp}"]`, mount);
        if(slot){
          slot.textContent = tok;
          slot.classList.add("filled");
          slot.classList.remove("good","bad");
        }
      });
    });

    $("#ppMatchReset", mount).addEventListener("click", () => {
      Object.keys(placed).forEach(k => delete placed[k]);
      $$("#ppMatchSlots .se-drop__slot", mount).forEach(s => {
        s.textContent = "Drop verb";
        s.classList.remove("filled","good","bad");
      });
      $("#ppMatchFb", mount).innerHTML = "";
    });

    $("#ppMatchCheck", mount).addEventListener("click", () => {
      let correct = 0;
      right.forEach(pp => {
        const chosen = placed[pp];
        const ok = pairs.some(p => p[0] === chosen && p[1] === pp);
        const slot = $(`[data-slot="${pp}"]`, mount);
        if(slot){
          slot.classList.add(ok ? "good" : "bad");
        }
        if(ok) correct += 1;
      });

      const all = correct === right.length;
      const fb = $("#ppMatchFb", mount);
      fb.innerHTML = `
        <div class="se-feedback">
          <strong>${all ? "✅ Perfect match!" : "🧭 Good effort."}</strong><br>
          You matched <strong>${correct}/${right.length}</strong>.
          ${all ? "" : "<br>Tip: irregular forms must be memorised (flashcards help!)."}
        </div>
      `;
    });
  }

  // ====== SENTENCE BUILDER ======
  function renderBuilder(){
    const mount = $("#ppBuildMount");
    if(!mount) return;

    let current = shuffle(BUILD_SENTENCES)[0];
    let built = [];

    function draw(){
      built = [];
      const tokens = shuffle(current.tokens);

      mount.innerHTML = `
        <div class="se-mini"><strong>Goal:</strong> ${escapeHtml(current.target.replace(/\s+/g," ").replace(" .",".").replace(" ?","?"))}</div>
        <div class="se-tiles" id="ppBuildTiles" style="margin-top:.55rem;">
          ${tokens.map(t => `<span class="se-tile" draggable="true" data-token="${escapeHtml(t)}">${escapeHtml(t)}</span>`).join("")}
        </div>

        <div class="se-drop" id="ppBuildDrop" style="margin-top:.7rem;">
          <div class="se-drop__label">Your sentence</div>
          <div class="se-drop__slot" id="ppBuildSlot">Drop words here</div>
        </div>

        <div class="se-actions" style="margin-top:.65rem;">
          <button class="se-btn" type="button" id="ppBuildReset">Reset</button>
          <button class="se-btn se-btn--primary" type="button" id="ppBuildCheck">Check</button>
          <button class="se-btn" type="button" id="ppBuildNew">New sentence</button>
          <button class="se-btn" type="button" id="ppBuildListen">🔊 Listen</button>
        </div>

        <div id="ppBuildFb"></div>
      `;

      const tiles = $$("#ppBuildTiles .se-tile", mount);
      tiles.forEach(t => {
        t.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", t.getAttribute("data-token") || "");
        });
      });

      const drop = $("#ppBuildDrop", mount);
      const slot = $("#ppBuildSlot", mount);

      drop.addEventListener("dragover", (e) => e.preventDefault());
      drop.addEventListener("drop", (e) => {
        e.preventDefault();
        const tok = e.dataTransfer.getData("text/plain");
        if(!tok) return;
        built.push(tok);
        slot.textContent = built.join(" ");
        slot.classList.add("filled");
        slot.classList.remove("good","bad");
      });

      $("#ppBuildReset", mount).addEventListener("click", () => {
        built = [];
        slot.textContent = "Drop words here";
        slot.classList.remove("filled","good","bad");
        $("#ppBuildFb", mount).innerHTML = "";
      });

      $("#ppBuildNew", mount).addEventListener("click", () => {
        current = shuffle(BUILD_SENTENCES)[0];
        draw();
      });

      $("#ppBuildListen", mount).addEventListener("click", () => speak(current.target.replace(" .",".").replace(" ?","?")));

      $("#ppBuildCheck", mount).addEventListener("click", () => {
        const user = built.join(" ").replace(/\s+/g," ").trim();
        const target = current.target.replace(/\s+/g," ").trim();
        const ok = user === target;

        slot.classList.add(ok ? "good" : "bad");
        const fb = $("#ppBuildFb", mount);

        fb.innerHTML = state.mode === "exam"
          ? `<div class="se-feedback"><strong>${ok ? "✅ Correct." : "🧭 Not this time."}</strong></div>`
          : `<div class="se-feedback"><strong>${ok ? "✅ Nice sentence!" : "🧭 Almost."}</strong><br>${ok ? "" : `One correct answer: <strong>${escapeHtml(target.replace(" .",".").replace(" ?","?"))}</strong><br>`}${current.why}</div>`;
      });
    }

    draw();
  }

  // ====== ORAL PRACTICE ======
  let rec = null;
  function getRecognizer(){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) return null;
    const r = new SR();
    r.lang = state.accent === "uk" ? "en-GB" : "en-US";
    r.interimResults = true;
    r.continuous = false;
    return r;
  }

  function renderOral(){
    const mount = $("#ppOralMount");
    if(!mount) return;

    let idx = 0;
    let listening = false;

    function draw(){
      const item = ORAL_REPEAT[idx];
      mount.innerHTML = `
        <div class="se-qa">
          <div class="se-qa__meta">
            <span class="se-badge">Sentence ${idx+1}/${ORAL_REPEAT.length}</span>
            <span class="se-badge">Accent: ${state.accent.toUpperCase()}</span>
          </div>

          <h3 class="se-h3" style="margin-top:.75rem;">${escapeHtml(item.text)}</h3>
          <div class="se-mini">💡 ${escapeHtml(item.help)}</div>

          <div class="se-actions" style="margin-top:.65rem;">
            <button class="se-btn se-btn--primary" id="ppOralListen" type="button">🔊 Listen</button>
            <button class="se-btn" id="ppOralSpeak" type="button">🎤 Speak</button>
            <button class="se-btn" id="ppOralPrev" type="button">← Prev</button>
            <button class="se-btn" id="ppOralNext" type="button">Next →</button>
          </div>

          <div id="ppOralFb"></div>
        </div>
      `;

      $("#ppOralListen", mount).addEventListener("click", () => speak(item.text));

      $("#ppOralPrev", mount).addEventListener("click", () => { idx = (idx - 1 + ORAL_REPEAT.length) % ORAL_REPEAT.length; draw(); });
      $("#ppOralNext", mount).addEventListener("click", () => { idx = (idx + 1) % ORAL_REPEAT.length; draw(); });

      $("#ppOralSpeak", mount).addEventListener("click", () => {
        const fb = $("#ppOralFb", mount);

        const recognizer = getRecognizer();
        if(!recognizer){
          fb.innerHTML = `<div class="se-feedback"><strong>Browser note:</strong> Speech recognition isn’t available here. You can still practice by repeating out loud after listening.</div>`;
          return;
        }

        if(listening) return;
        listening = true;

        let transcript = "";
        recognizer.onresult = (e) => {
          transcript = "";
          for(let i=0;i<e.results.length;i++){
            transcript += e.results[i][0].transcript;
          }
          const sim = similarity(transcript, item.text);
          fb.innerHTML = `
            <div class="se-feedback">
              <strong>Transcript</strong>: ${escapeHtml(transcript || "(listening…)")}<br>
              <strong>Closeness</strong>: ${sim}%<br>
              <span class="se-mini">${sim >= 80 ? "✅ Very close!" : sim >= 60 ? "🧭 Pretty close — try again slowly." : "💡 Try again: focus on 'have/has' and the participle."}</span>
            </div>
          `;
        };
        recognizer.onerror = (e) => {
          listening = false;
          fb.innerHTML = `<div class="se-feedback"><strong>Microphone / recognition issue:</strong> ${escapeHtml(e?.error || "unknown error")}</div>`;
        };
        recognizer.onend = () => { listening = false; };

        try{
          fb.innerHTML = `<div class="se-feedback">🎤 Listening… speak now (one sentence).</div>`;
          recognizer.start();
        }catch(err){
          listening = false;
          fb.innerHTML = `<div class="se-feedback"><strong>Could not start microphone.</strong> ${escapeHtml(err?.message || "")}</div>`;
        }
      });
    }

    draw();
  }

  function renderOralPrompts(){
    const mount = $("#ppPromptMount");
    if(!mount) return;

    mount.innerHTML = ORAL_PROMPTS.map(p => `
      <div class="se-panel" style="margin-bottom:.75rem;">
        <h3 class="se-h3">${p.icon} ${escapeHtml(p.q)}</h3>
        <div class="se-mini">Helpful sentence starters:</div>
        <ul class="se-bullets">
          ${p.frames.map(f => `<li>${escapeHtml(f)}</li>`).join("")}
        </ul>
        <div class="se-actions">
          <button class="se-btn se-btn--primary" type="button" data-say="${escapeHtml(p.frames.join(". "))}">🔊 Listen starters</button>
          <button class="se-btn" type="button" data-say="${escapeHtml(p.q)}">🔊 Listen prompt</button>
        </div>
      </div>
    `).join("");
  }

  // ====== MINI TEST ======
  function renderMiniTest(n){
    const mount = $("#ppMiniMount");
    if(!mount) return;

    // Build a mix: 60% MCQ (tense/time/work), 40% cloze (havehas/sincefor/yetalready)
    const mcqPool = [].concat(MCQ_SETS.tense, MCQ_SETS.timewords, MCQ_SETS.work).map(x => ({...x, kind:"mcq"}));
    const clozePool = [].concat(CLOZE_SETS.havehas, CLOZE_SETS.sincefor, CLOZE_SETS.yetalready).map(x => ({...x, kind:"cloze"}));
    const pickMcq = Math.max(1, Math.round(n * 0.6));
    const pickCloze = Math.max(1, n - pickMcq);

    const chosen = shuffle(mcqPool).slice(0, pickMcq).concat(shuffle(clozePool).slice(0, pickCloze));
    const items = shuffle(chosen);

    let idx = 0;
    let score = 0;

    function draw(){
      const it = items[idx];
      const pct = Math.round((idx / items.length) * 100);

      if(it.kind === "mcq"){
        mount.innerHTML = `
          <div class="se-qa">
            <div class="se-qa__meta">
              <span class="se-badge">Question ${idx+1}/${items.length}</span>
              <div class="se-progressbar"><span style="width:${pct}%"></span></div>
              <span class="se-badge">Score: ${score}</span>
            </div>

            <h3 class="se-h3" style="margin-top:.75rem;">${escapeHtml(it.q)}</h3>
            <div class="se-choices">
              ${it.a.map((opt,i) => `<button class="se-choice" type="button" data-i="${i}">${escapeHtml(opt)}</button>`).join("")}
            </div>

            <div id="ppMiniFb"></div>
          </div>
        `;

        const fb = $("#ppMiniFb", mount);
        const btns = $$(".se-choice", mount);
        btns.forEach(b => {
          b.addEventListener("click", () => {
            btns.forEach(x => x.disabled = true);
            const i = Number(b.getAttribute("data-i"));
            const ok = i === it.correct;
            if(ok) score += 1;
            b.classList.add(ok ? "is-correct" : "is-wrong");
            if(!ok){
              const right = btns[it.correct];
              if(right) right.classList.add("is-correct");
            }

            fb.innerHTML = state.mode === "exam"
              ? `<div class="se-feedback"><strong>${ok ? "✅ Correct." : "🧭 Not this time."}</strong></div>`
              : `<div class="se-feedback"><strong>${ok ? "✅ Nice." : "🧭 Useful mistake."}</strong><br>${it.why}</div>`;

            const next = document.createElement("div");
            next.className = "se-actions";
            next.innerHTML = `<button class="se-btn se-btn--primary" type="button" id="ppMiniNext">Next</button>`;
            fb.appendChild(next);

            $("#ppMiniNext", mount).addEventListener("click", () => {
              if(idx < items.length - 1){ idx += 1; draw(); }
              else results();
            });
          });
        });

      } else {
        // cloze
        mount.innerHTML = `
          <div class="se-qa">
            <div class="se-qa__meta">
              <span class="se-badge">Question ${idx+1}/${items.length}</span>
              <div class="se-progressbar"><span style="width:${pct}%"></span></div>
              <span class="se-badge">Score: ${score}</span>
            </div>

            <h3 class="se-h3" style="margin-top:.75rem;">${escapeHtml(it.q)}</h3>

            <div class="se-row">
              <input class="se-input" id="ppMiniInp" placeholder="Type your answer…" autocomplete="off" spellcheck="false" />
              <button class="se-btn se-btn--primary" type="button" id="ppMiniCheck">Check</button>
            </div>

            <div id="ppMiniFb"></div>
          </div>
        `;

        const inp = $("#ppMiniInp", mount);
        const fb = $("#ppMiniFb", mount);

        function check(){
          const user = normalize(inp.value || "");
          const answers = (it.answers || []).map(a => normalize(a));
          const ok = answers.includes(user);
          if(ok) score += 1;

          inp.disabled = true;
          $("#ppMiniCheck", mount).disabled = true;

          const correctText = it.answers[0];

          fb.innerHTML = state.mode === "exam"
            ? `<div class="se-feedback"><strong>${ok ? "✅ Correct." : "🧭 Not this time."}</strong>${ok ? "" : `<br>Correct: <strong>${escapeHtml(correctText)}</strong>`}</div>`
            : `<div class="se-feedback"><strong>${ok ? "✅ Great." : "🧭 Almost."}</strong>${ok ? "" : `<br>Correct: <strong>${escapeHtml(correctText)}</strong>`}<br>${it.why}</div>`;

          const actions = document.createElement("div");
          actions.className = "se-actions";
          actions.innerHTML = `<button class="se-btn se-btn--primary" type="button" id="ppMiniNext">Next</button>`;
          fb.appendChild(actions);

          $("#ppMiniNext", mount).addEventListener("click", () => {
            if(idx < items.length - 1){ idx += 1; draw(); }
            else results();
          });
        }

        $("#ppMiniCheck", mount).addEventListener("click", check);
        inp.addEventListener("keydown", (e) => { if(e.key === "Enter") check(); });
      }
    }

    function results(){
      const pct = Math.round((score / items.length) * 100);
      const msg = pct >= 80 ? "Excellent — you’re using present perfect naturally." :
                  pct >= 60 ? "Good — review one weak area and retry." :
                  "Totally okay — go back to flashcards + cloze, then try again.";
      mount.innerHTML = `
        <div class="se-feedback">
          <strong>🏁 Mini test complete.</strong><br>
          Score: <strong>${score}/${items.length}</strong> (${pct}%)<br>
          ${msg}
          <div class="se-actions" style="margin-top:.6rem;">
            <button class="se-btn se-btn--primary" type="button" id="ppMiniAgain">Try again (new mix)</button>
          </div>
        </div>
      `;
      $("#ppMiniAgain", mount).addEventListener("click", () => renderMiniTest(items.length));
    }

    draw();
  }

  // ====== EVENTS ======
  function bindGlobalTTS(){
    $$("[data-tts]").forEach(btn => {
      btn.addEventListener("click", () => speak(btn.getAttribute("data-tts") || ""));
    });

    document.addEventListener("click", (e) => {
      const t = e.target;
      if(!(t instanceof HTMLElement)) return;
      const say = t.getAttribute("data-say");
      if(!say) return;
      if(t.matches("button[data-say]")){
        speak(say);
      }
    });
  }

  function initControls(){
    loadSettings();
    const accentSel = $("#ppAccent");
    const speedSel = $("#ppSpeed");
    const modeSel = $("#ppMode");

    if(accentSel){
      accentSel.value = state.accent;
      accentSel.addEventListener("change", () => {
        state.accent = accentSel.value === "uk" ? "uk" : "us";
        saveSettings();
        // update recognizer language if used
        renderOral(); // re-render so it shows correct accent badge
      });
    }
    if(speedSel){
      speedSel.value = String(state.rate);
      speedSel.addEventListener("change", () => {
        state.rate = Number(speedSel.value) || 0.95;
        saveSettings();
      });
    }
    if(modeSel){
      modeSel.value = state.mode;
      modeSel.addEventListener("change", () => {
        state.mode = modeSel.value === "exam" ? "exam" : "gentle";
        saveSettings();
      });
    }

    const resetAll = $("#ppResetAll");
    if(resetAll){
      resetAll.addEventListener("click", () => {
        if(confirm("Reset this page (MCQ, cloze, mini test + flashcards state)?")){
          // We only reset UI mounts and settings; no heavy stored progress besides settings.
          localStorage.removeItem(SETTINGS_KEY);
          location.reload();
        }
      });
    }
  }

  function initFlashcards(){
    const mount = $("#ppFlashMount");
    if(!mount) return;

    // Default deck
    renderFlashPlayer(deckIrregulars(), mount);

    $$("[data-deck]").forEach(btn => {
      btn.addEventListener("click", () => {
        const d = btn.getAttribute("data-deck");
        if(d === "irregulars") return renderFlashPlayer(deckIrregulars(), mount);
        if(d === "time") return renderFlashPlayer(deckTime(), mount);
        // topic
        return renderFlashPlayer(deckTopic(d || "core"), mount);
      });
    });

    // Topic button in vocab section
    const startTopicFlash = $("#ppStartVocabFlash");
    if(startTopicFlash){
      startTopicFlash.addEventListener("click", () => {
        renderFlashPlayer(deckTopic(currentVocabTopic), mount);
        // jump
        const el = $("#flashcards");
        if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
      });
    }
  }

  function initMCQ(){
    const setSel = $("#ppMcqSet");
    const startBtn = $("#ppStartMcq");
    const resetBtn = $("#ppResetMcq");

    if(startBtn){
      startBtn.addEventListener("click", () => {
        const key = setSel ? setSel.value : "tense";
        renderMCQSet(key);
      });
    }
    if(resetBtn){
      resetBtn.addEventListener("click", () => {
        $("#ppMcqMount").innerHTML = "";
      });
    }
  }

  function initCloze(){
    const setSel = $("#ppClozeSet");
    const startBtn = $("#ppStartCloze");
    const resetBtn = $("#ppResetCloze");
    if(startBtn){
      startBtn.addEventListener("click", () => {
        const key = setSel ? setSel.value : "havehas";
        renderClozeSet(key);
      });
    }
    if(resetBtn){
      resetBtn.addEventListener("click", () => {
        $("#ppClozeMount").innerHTML = "";
      });
    }
  }

  function initVocab(){
    const sel = $("#ppVocabTopic");
    if(sel){
      currentVocabTopic = sel.value || "core";
      renderVocab(currentVocabTopic);
      sel.addEventListener("change", () => {
        currentVocabTopic = sel.value || "core";
        renderVocab(currentVocabTopic);
      });
    }else{
      renderVocab("core");
    }
  }

  function initDragDrop(){
    renderMatch();
    renderBuilder();
  }

  function initOral(){
    const start = $("#ppOralStart");
    const reset = $("#ppOralReset");
    if(start){
      start.addEventListener("click", () => {
        renderOral();
        renderOralPrompts();
      });
    }
    if(reset){
      reset.addEventListener("click", () => {
        $("#ppOralMount").innerHTML = "";
        $("#ppPromptMount").innerHTML = "";
      });
    }
    // pre-render prompt list (so it's not empty)
    renderOralPrompts();
  }

  function initMini(){
    const start = $("#ppStartMini");
    const reset = $("#ppResetMini");
    const lenSel = $("#ppMiniLen");
    if(start){
      start.addEventListener("click", () => {
        const n = Number(lenSel?.value || 12);
        renderMiniTest(n);
      });
    }
    if(reset){
      reset.addEventListener("click", () => {
        $("#ppMiniMount").innerHTML = "";
      });
    }
  }

  // ====== INIT ======
  try{
    initControls();
    bindGlobalTTS();
    renderTimeCards();
    initVocab();
    initFlashcards();
    initMCQ();
    initCloze();
    initDragDrop();
    initOral();
    initMini();
  }catch(e){
    showAlert("⚠️ JavaScript error: " + escapeHtml(e?.message || "unknown error"));
  }
})();