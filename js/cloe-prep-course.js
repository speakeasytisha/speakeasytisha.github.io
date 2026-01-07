(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const view = $("#cpView");
  const errBox = $("#cpError");
  const tabBtns = $$(".cp-tab");
  const accentSel = $("#cpAccent");
  const trackSel = $("#cpTrack");
  const levelSel = $("#cpLevel");

  // ---------- ERROR HANDLING ----------
  function showError(msg){
    errBox.hidden = false;
    errBox.innerHTML = `⚠️ <strong>JavaScript error</strong><br>${escapeHtml(msg)}`;
  }
  window.addEventListener("error", (e) => {
    showError(e?.message || "Unknown error");
  });

  // ---------- SETTINGS ----------
  const SETTINGS_KEY = "speakeasy_cloe_course_settings_v1";
  const PROGRESS_KEY = "speakeasy_cloe_course_progress_v1";

  function loadSettings(){
    try{
      const raw = localStorage.getItem(SETTINGS_KEY);
      if(!raw) return { accent:"us", track:"general", level:"auto" };
      const s = JSON.parse(raw);
      return { accent: s.accent || "us", track: s.track || "general", level: s.level || "auto" };
    }catch{
      return { accent:"us", track:"general", level:"auto" };
    }
  }
  function saveSettings(s){
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }

  function loadProgress(){
    try{
      const raw = localStorage.getItem(PROGRESS_KEY);
      if(!raw) return { mastery:{}, attempts:0, bestMock:null, streak:0 };
      const p = JSON.parse(raw);
      p.mastery = p.mastery || {};
      p.attempts = p.attempts || 0;
      p.streak = p.streak || 0;
      return p;
    }catch{
      return { mastery:{}, attempts:0, bestMock:null, streak:0 };
    }
  }
  function saveProgress(p){
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  }

  const settings = loadSettings();
  accentSel.value = settings.accent;
  trackSel.value = settings.track;
  levelSel.value = settings.level;

  accentSel.addEventListener("change", () => {
    settings.accent = accentSel.value;
    saveSettings(settings);
  });
  trackSel.addEventListener("change", () => {
    settings.track = trackSel.value;
    saveSettings(settings);
    // re-render current tab to adapt examples
    renderActiveTab();
  });
  levelSel.addEventListener("change", () => {
    settings.level = levelSel.value;
    saveSettings(settings);
  });

  // ---------- UTIL ----------
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;" }[m]));
  }
  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }

  // ---------- TEXT HELPERS ----------
  // Many prompts/text blocks are stored with escaped line breaks (\n). Convert them for display.
  function decodeNL(str){
    return String(str ?? "").replace(/\\n/g, "\n");
  }
  // Clean up spacing for punctuation so learners see natural English.
  function prettySentence(str){
    return decodeNL(str)
      .replace(/\s+/g, " ")
      .replace(/\s+([.,!?;:])/g, "$1")
      .trim();
  }
  // Normalize for comparisons (word order) — forgiving about punctuation spacing/case.
  function normalizeSentence(str){
    return prettySentence(str).toLowerCase();
  }

  function labelType(type){
    const t = String(type || "").toLowerCase();
    if(t === "mcq") return "MCQ";
    if(t === "cloze") return "CLOZE";
    if(t === "match") return "MATCH";
    if(t === "order") return "ORDER";
    if(t === "reading") return "TASK";
    if(t === "listening") return "TASK";
    return t ? t.toUpperCase() : "TASK";
  }

  function isPunctToken(tok){
    return /^[.,!?;:]$/.test(String(tok || "").trim());
  }
  // Shuffle word-order tokens so they are not already in the correct order.
  // Keep punctuation tokens at the end (., ?, !, etc.) so the task feels natural.
  function shuffleOrderTokens(tokens){
    const all = (tokens || []).slice();
    const punct = all.filter(isPunctToken);
    const words = all.filter(t => !isPunctToken(t));
    let sh = shuffle(words);
    // avoid returning the exact original order
    for(let k=0;k<8;k++){
      if(sh.join("|") !== words.join("|")) break;
      sh = shuffle(words);
    }
    return sh.concat(punct);
  }

  function pickUnique(pool, n, usedSet){
    const out = [];
    for(const item of shuffle(pool)){
      if(out.length >= n) break;
      if(!item || !item.id) continue;
      if(usedSet && usedSet.has(item.id)) continue;
      if(usedSet) usedSet.add(item.id);
      out.push(item);
    }
    return out;
  }

  // ---------- SPEECH (Listening) ----------
  let VOICES = [];
  function refreshVoices(){
    VOICES = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  }
  if(window.speechSynthesis){
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }

  function pickVoice(){
    const want = settings.accent === "uk" ? ["GB","UK","United Kingdom","English (UK)"] : ["US","United States","English (US)"];
    // Prefer English voices with matching region
    const candidates = VOICES.filter(v => (v.lang||"").toLowerCase().startsWith("en"));
    for(const w of want){
      const found = candidates.find(v => (v.name||"").includes(w) || (v.lang||"").includes(w));
      if(found) return found;
    }
    return candidates[0] || null;
  }

  function speak(text){
    if(!window.speechSynthesis) return { ok:false, reason:"Speech synthesis not supported on this browser." };
    const msg = new SpeechSynthesisUtterance(String(text));
    const v = pickVoice();
    if(v) msg.voice = v;
    msg.rate = 0.95;
    msg.pitch = 1.0;
    msg.lang = (v && v.lang) ? v.lang : (settings.accent === "uk" ? "en-GB" : "en-US");
    try{
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(msg);
      return { ok:true };
    }catch(e){
      return { ok:false, reason: e?.message || "Could not play audio." };
    }
  }

  // ---------- CONTENT: TRACK-SENSITIVE PROMPTS ----------
  function trackLabel(){
    switch(settings.track){
      case "hospitality": return "Hospitality";
      case "customer": return "Customer service";
      case "it": return "IT / Helpdesk";
      case "logistics": return "Logistics";
      default: return "General workplace";
    }
  }

  const US_UK_TERMS = [
    { id:"lift", us:"elevator", uk:"lift", icon:"🛗", note:"US: elevator · UK: lift" },
    { id:"parking", us:"parking lot", uk:"car park", icon:"🅿️", note:"US: parking lot · UK: car park" },
    { id:"line", us:"line", uk:"queue", icon:"👥", note:"US: line · UK: queue" },
    { id:"vacation", us:"vacation", uk:"holiday", icon:"🏖️", note:"US: vacation · UK: holiday" },
    { id:"chips", us:"chips", uk:"crisps", icon:"🥔", note:"US: chips · UK: crisps" },
    { id:"bathroom", us:"bathroom", uk:"toilet / loo", icon:"🚻", note:"US: bathroom · UK: toilet / loo" },
    { id:"resume", us:"résumé", uk:"CV", icon:"📄", note:"US: résumé · UK: CV" },
    { id:"apartment", us:"apartment", uk:"flat", icon:"🏠", note:"US: apartment · UK: flat" },
  ];

  // ---------- LESSONS (Grammar + Vocabulary) ----------
  const LESSONS = [
    {
      id:"modals-requests",
      icon:"🙏",
      type:"grammar",
      title:"Polite requests & modals (can/could/would)",
      summary:"Ask professionally without sounding rude.",
      explain:`<p><strong>Goal:</strong> sound polite and professional. In CLOE, you’ll often choose the best wording.</p>
      <ul class="cp-list">
        <li><strong>Can</strong> (neutral): <em>Can you send the file?</em></li>
        <li><strong>Could</strong> (more polite): <em>Could you send the file, please?</em></li>
        <li><strong>Would you mind + -ing</strong> (very polite): <em>Would you mind sending the file again?</em></li>
        <li><strong>I’d appreciate it if…</strong> (formal): <em>I’d appreciate it if you could confirm receipt.</em></li>
      </ul>
      <p class="cp-mini">Friendly tip: if you choose the “too direct” option by mistake — that’s normal. You’ll learn fast.</p>`,
      practice: [
        {id:"l1q1", type:"mcq", skill:"Grammar", prompt:"Choose the most polite option.", q:"You need the document again.", a:[
          "Send it again.",
          "Can you send it again?",
          "Could you send it again, please?",
          "You must send it again."
        ], correct:2, why:"<b>Could you… please</b> is polite and natural."},
        {id:"l1q2", type:"mcq", skill:"Grammar", prompt:"Choose the correct structure.", q:"Would you mind ____ the link?", a:["send","to send","sending","sent"], correct:2, why:"<b>Would you mind</b> + <b>-ing</b>."},
        {id:"l1q3", type:"cloze", skill:"Grammar", prompt:"Type ONE word.", q:"I’d appreciate it if you could ______ receipt of this email.", answer:"confirm", why:"Common email phrase: confirm receipt."},
        {id:"l1q4", type:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["Could","you","please","repeat","that","?"], target:"Could you please repeat that ?", why:"Modal + subject + please + base verb."}
      ]
    },
    {
      id:"time-place-prep",
      icon:"🧭",
      type:"grammar",
      title:"Prepositions (at/on/in/by) for time & deadlines",
      summary:"Deadlines and schedules are everywhere in professional English.",
      explain:`<ul class="cp-list">
        <li><strong>at</strong> 3 p.m. · <strong>on</strong> Monday · <strong>in</strong> July</li>
        <li><strong>by</strong> Friday = deadline (no later than)</li>
        <li><strong>until</strong> Friday = continues up to Friday</li>
      </ul>
      <p class="cp-mini">Support tip: if you confuse <b>by</b> and <b>until</b>, you’re not alone. We’ll practice it gently.</p>`,
      practice: [
        {id:"l2q1", type:"mcq", skill:"Grammar", prompt:"Choose the correct preposition.", q:"Please submit the form ____ Wednesday at noon.", a:["at","by","until","in"], correct:1, why:"Deadline → <b>by</b> Wednesday at noon."},
        {id:"l2q2", type:"mcq", skill:"Grammar", prompt:"Choose the correct preposition.", q:"Let’s meet ____ 10:30.", a:["at","on","in","to"], correct:0, why:"Times → <b>at</b> 10:30."},
        {id:"l2q3", type:"mcq", skill:"Grammar", prompt:"Choose the best meaning.", q:"I’m in meetings until 3 p.m.", a:[
          "The meetings finish no later than 3 p.m.",
          "The meetings continue up to 3 p.m."
        ], correct:1, why:"<b>Until</b> = continues up to that time."},
        {id:"l2q4", type:"cloze", skill:"Grammar", prompt:"Type ONE word.", q:"We need the final version ______ Friday.", answer:"by", why:"Deadline → by Friday."}
      ]
    },
    {
      id:"perf-vs-past",
      icon:"⏳",
      type:"grammar",
      title:"Present perfect vs past simple (professional updates)",
      summary:"Choose the tense that sounds natural in emails & calls.",
      explain:`<ul class="cp-list">
        <li><strong>Past simple</strong> (finished time): <em>I spoke to the client yesterday.</em></li>
        <li><strong>Present perfect</strong> (result/experience/unfinished time): <em>I’ve sent the invoice.</em> / <em>We’ve had an issue since Monday.</em></li>
        <li>With <strong>yet</strong>, <strong>already</strong>, <strong>just</strong> → present perfect is common.</li>
      </ul>`,
      practice: [
        {id:"l3q1", type:"mcq", skill:"Grammar", prompt:"Choose the best option.", q:"I ____ the report yesterday.", a:["have finished","finished","finish","am finishing"], correct:1, why:"Specific past time (yesterday) → past simple."},
        {id:"l3q2", type:"mcq", skill:"Grammar", prompt:"Choose the best option.", q:"I’ve ____ sent it. Please check your inbox.", a:["just","yesterday","last week","in 2024"], correct:0, why:"<b>Just</b> + present perfect = very recently."},
        {id:"l3q3", type:"mcq", skill:"Grammar", prompt:"Choose the best option.", q:"We haven’t received the payment ____.", a:["already","yet","just","still"], correct:1, why:"Negative + present perfect → <b>yet</b>."},
        {id:"l3q4", type:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["We","haven’t","received","it","yet","."], target:"We haven’t received it yet .", why:"<b>Yet</b> often goes at the end."}
      ]
    },
    {
      id:"email-essentials",
      icon:"📧",
      type:"vocab",
      title:"Email & meeting vocabulary (core CLOE)",
      summary:"High-frequency words that appear in workplace tasks.",
      explain:`<p>Focus on words that appear in short professional emails and notices.</p>`,
      vocab: [
        {id:"v-agenda", icon:"🗂️", term:"agenda", def:"list of topics for a meeting", ex:"Could you share the agenda for tomorrow?"},
        {id:"v-deadline", icon:"⏰", term:"deadline", def:"the latest time to finish something", ex:"The deadline is Friday at 5 p.m."},
        {id:"v-invoice", icon:"🧾", term:"invoice", def:"a bill for services/products", ex:"I’ve attached the invoice."},
        {id:"v-attach", icon:"📎", term:"attach", def:"add a file to an email", ex:"Please attach the document."},
        {id:"v-confirm", icon:"✅", term:"confirm", def:"say something is correct/true", ex:"Could you confirm receipt?"},
        {id:"v-reschedule", icon:"📆", term:"reschedule", def:"change the time/date", ex:"Can we reschedule to next week?"},
        {id:"v-delay", icon:"⛔", term:"delay", def:"something happens later than planned", ex:"I’m sorry for the delay."},
        {id:"v-availability", icon:"🟢", term:"availability", def:"when you are free", ex:"What’s your availability this week?"}
      ],
      practice: [
        {id:"l4q1", type:"match", skill:"Vocabulary", prompt:"Drag the words to the correct definitions.", pairs:[
          ["agenda","list of topics for a meeting"],
          ["deadline","latest time to finish something"],
          ["invoice","a bill for services/products"],
          ["reschedule","change the time/date"]
        ], why:"These are very common in workplace messages."},
        {id:"l4q2", type:"cloze", skill:"Vocabulary", prompt:"Type ONE word.", q:"Please ______ the file to your reply.", answer:"attach", why:"Attach = add a file."},
        {id:"l4q3", type:"mcq", skill:"Vocabulary", prompt:"Choose the best word.", q:"I’m sorry for the ____.", a:["agenda","delay","invoice","receipt"], correct:1, why:"Delay = later than planned."}
      ]
    },
    {
      id:"us-uk-terms",
      icon:"🌍",
      type:"vocab",
      title:"US vs UK everyday terms (useful for listening)",
      summary:"You’ll understand both accents and both word choices.",
      explain:`<p>In CLOE, you may hear a British or American accent. Knowing these pairs helps a lot.</p>`,
      vocabPairs: US_UK_TERMS,
      practice: [
        {id:"l5q1", type:"mcq", skill:"Vocabulary", prompt:"Choose the UK word.", q:"US: elevator → UK:", a:["lift","line","car park","bathroom"], correct:0, why:"UK: lift."},
        {id:"l5q2", type:"mcq", skill:"Vocabulary", prompt:"Choose the US word.", q:"UK: car park → US:", a:["parking lot","queue","flat","CV"], correct:0, why:"US: parking lot."},
        {id:"l5q3", type:"match", skill:"Vocabulary", prompt:"Match US words to UK words.", pairs:[
          ["vacation","holiday"],
          ["line","queue"],
          ["apartment","flat"],
          ["résumé","CV"]
        ], why:"Same meaning, different word choice."}
      ]
    }
  ];

  // ---------- PRACTICE LAB BANK (unique IDs) ----------
  const BANK = [
    // Grammar / polite requests
    {id:"g1", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the most professional option.", q:"You need the client’s email address.", a:["Give me your email.","Could you share your email address, please?","You have to give your email.","Tell me your email now."], correct:1, why:"Polite request: <b>Could you… please?</b>"},
    {id:"g2", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the correct structure.", q:"I’m looking forward to ____ from you.", a:["hear","hearing","to hear","heard"], correct:1, why:"Looking forward to + <b>-ing</b>."},
    {id:"g3", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the correct preposition.", q:"Please reply ____ this email.", a:["to","for","by","at"], correct:0, why:"Reply <b>to</b> an email."},
    {id:"g4", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the correct option.", q:"We need the signed document ____ Friday.", a:["until","by","in","at"], correct:1, why:"Deadline → <b>by</b> Friday."},
    {id:"g5", type:"cloze", focus:"grammar", skill:"Grammar", prompt:"Type ONE word.", q:"Would you mind ______ the report again?", answer:"sending", why:"Would you mind + <b>-ing</b>."},
    {id:"g6", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["I’d","like","to","reschedule","our","meeting","."], target:"I’d like to reschedule our meeting .", why:"I’d like to + verb."},
    {id:"g7", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the best option.", q:"Would you mind ____ that again?", a:["say","to say","saying","said"], correct:2, why:"Would you mind + <b>-ing</b>."},
    {id:"g8", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the best option.", q:"Could you ____ me your availability?", a:["send","sending","to send","sent"], correct:0, why:"Could you + base verb."},
    {id:"g9", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the correct tense.", q:"We ____ your message this morning.", a:["receive","received","have received","are receiving"], correct:2, why:"Result now (we have it) → present perfect is natural."},
    {id:"g10", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the correct tense.", q:"I ____ the client yesterday.", a:["have called","called","call","am calling"], correct:1, why:"Finished time (yesterday) → past simple."},
    {id:"g11", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the best option.", q:"We’ve been in contact ____ Monday.", a:["for","since","by","until"], correct:1, why:"Start point → <b>since</b>."},
    {id:"g12", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the best option.", q:"I’ll be away ____ two days.", a:["since","for","by","at"], correct:1, why:"Duration → <b>for</b>."},
    {id:"g13", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the correct article.", q:"Could you send me ____ invoice, please? (first mention)", a:["a","an","the","—"], correct:1, why:"<b>Invoice</b> starts with a vowel sound (/ɪ/), so we use <b>an</b> for first mention."},
    {id:"g14", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the correct article.", q:"I’ve reviewed ____ invoice you sent yesterday.", a:["a","an","the","—"], correct:2, why:"Specific (the one you sent) → <b>the</b>."},
    {id:"g15", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the best option.", q:"Could you give me ____ information about the schedule?", a:["an","some","a","the"], correct:1, why:"Information is uncountable → <b>some</b>."},
    {id:"g16", type:"cloze", focus:"grammar", skill:"Grammar", prompt:"Type ONE word.", q:"I’m afraid I can’t make it ____ 3 p.m.", answer:"until", why:"Until = up to that time."},
    {id:"g17", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the best connector.", q:"We’re running late; ____, the call will start at 10:15.", a:["however","therefore","although","because"], correct:1, why:"Therefore = as a result."},
    {id:"g18", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the best connector.", q:"____ the file is large, it may take longer to upload.", a:["Because","However","Therefore","Meanwhile"], correct:0, why:"Because introduces the reason."},
    {id:"g19", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the best option.", q:"If you ____ any questions, please let me know.", a:["have","had","will have","are having"], correct:0, why:"Zero conditional in polite instructions → present simple."},
    {id:"g20", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the best option.", q:"If you could send it today, that ____ great.", a:["is","was","would be","will be"], correct:2, why:"Polite conditional → would be."},

    // Reading tasks (emails, notices, short workplace texts)
    {id:"r1", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
      text:"Subject: Schedule change\\n\\nHi,\\nToday’s call is moved to 11:00. Please join 5 minutes early.\\n\\nThanks.", 
      q:"What time is the call now?", a:["10:00","11:00","11:30","12:00"], correct:1, why:"It says moved to 11:00."},
    {id:"r2", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
      text:"Notice\\n\\nFire drill at 2:00 p.m. Use the stairs. Do not use the lift/elevator.",
      q:"What should you use?", a:["Lift/elevator","Stairs","Reception","Parking lot"], correct:1, why:"Use the stairs."},
    {id:"r3", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
      text:"Subject: Delivery update\\n\\nDue to a delay at customs, the shipment will arrive Friday morning.",
      q:"When will it arrive?", a:["Thursday","Friday morning","Friday evening","Next week"], correct:1, why:"Friday morning."},
    {id:"r4", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
      text:"Subject: Invoice attached\\n\\nHello,\\nPlease find the invoice attached. Payment is due by 31 January.\\n\\nBest regards,",
      q:"When is payment due?", a:["Today","31 January","Next Friday","No date given"], correct:1, why:"It says due by 31 January."},
    {id:"r5", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
      text:"Subject: Meeting minutes\\n\\nAction items:\\n1) Update the client by Wednesday.\\n2) Confirm the delivery date.\\n3) Share the revised quote.",
      q:"What must be done by Wednesday?", a:["Confirm delivery date","Update the client","Share the revised quote","Cancel the meeting"], correct:1, why:"Item 1: Update the client by Wednesday."},
    {id:"r6", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
      text:"Subject: Out of office\\n\\nI’m out of the office today. For urgent matters, please contact Marie Dupont.",
      q:"What should you do for urgent matters?", a:["Wait until tomorrow","Contact Marie Dupont","Send a parcel","Book a room"], correct:1, why:"It says contact Marie Dupont."},
    {id:"r7", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
      text:"Subject: Technical check\\n\\nPlease test your webcam and microphone before the oral interview. Join 10 minutes early.",
      q:"When should you join?", a:["Exactly on time","10 minutes early","After the interview","Tomorrow morning"], correct:1, why:"Join 10 minutes early."},
    {id:"r8", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
      text:"Notice\\n\\nThe parking lot is full. Please use the overflow car park across the street.",
      q:"Where should you park?", a:["In the full parking lot","In the overflow car park across the street","In the lobby","On the roof"], correct:1, why:"Use the overflow car park across the street."},

    // Listening tasks (speech synthesis)
    {id:"l1", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
      audio:"Hello, the meeting starts in ten minutes in Room D on the fourth floor.",
      q:"Where is the meeting?", a:["Room B, 2nd floor","Room D, 4th floor","Reception","Online"], correct:1, why:"Room D on the fourth floor."},
    {id:"l2", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
      audio:"Please submit your expense report by Friday at five p.m.",
      q:"What is the deadline?", a:["Friday 5 p.m.","Friday morning","Thursday 5 p.m.","No deadline"], correct:0, why:"Friday at five p.m."},
    {id:"l3", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
      audio:"Could you spell your email address slowly, letter by letter?",
      q:"What do they ask you to do?", a:["Pay by card","Spell your email","Confirm the invoice","Go to the lobby"], correct:1, why:"Spell your email address."},
    {id:"l4", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
      audio:"The webinar has been postponed to next Tuesday at two p.m.",
      q:"When is the webinar now?", a:["Today at 2 p.m.","Next Tuesday at 2 p.m.","Next Tuesday at 4 p.m.","Tomorrow at 2 p.m."], correct:1, why:"Postponed to next Tuesday at two p.m."},
    {id:"l5", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
      audio:"Please take the elevator to the sixth floor, then turn left.",
      q:"What should you do after the elevator?", a:["Turn right","Turn left","Go downstairs","Wait in the lobby"], correct:1, why:"Then turn left."},
    {id:"l6", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
      audio:"If you have any questions, feel free to contact me by email.",
      q:"How should you contact them?", a:["By email","By post","In person only","No contact allowed"], correct:0, why:"Contact me by email."},

    // Vocabulary (mixed)
    {id:"v1", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"A list of meeting topics is an ____.", a:["agenda","invoice","deadline","delay"], correct:0, why:"Agenda = topics list."},
    {id:"v2", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"A bill for services is an ____.", a:["agenda","invoice","queue","badge"], correct:1, why:"Invoice = bill."},
    {id:"v3", type:"cloze", focus:"vocab", skill:"Vocabulary", prompt:"Type ONE word.", q:"Please ______ receipt of this message.", answer:"confirm", why:"Confirm receipt = acknowledge you received it."},
    {id:"v4", type:"match", focus:"vocab", skill:"Vocabulary", prompt:"Drag the words to the correct definitions.", pairs:[
      ["deadline","latest time to finish"],
      ["delay","later than planned"],
      ["reschedule","change date/time"],
      ["attach","add a file to an email"]
    ], why:"High-frequency workplace vocabulary."},
    {id:"v5", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"To answer a message is to ____.", a:["reply","delay","approve","postpone"], correct:0, why:"Reply = answer."},
    {id:"v6", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"A “follow‑up” email is sent to ____.", a:["repeat/continue the topic","end a contract","cancel a meeting","book a hotel"], correct:0, why:"Follow‑up = continue/check progress."},
    {id:"v7", type:"cloze", focus:"vocab", skill:"Vocabulary", prompt:"Type ONE word.", q:"Can you send me a quick ______ on this issue?", answer:"update", why:"Update = latest information."},
    {id:"v8", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"If something is “urgent,” it is ____.", a:["very important now","optional","late","expensive"], correct:0, why:"Urgent = needs quick action."},
    {id:"v9", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"“Please advise” means “Please ____.”", a:["tell me what to do","pay now","stop","ignore"], correct:0, why:"Advise = recommend/tell what to do."},

    // Word order (core)
    {id:"o1", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["Could","you","please","confirm","receipt","?"], target:"Could you please confirm receipt ?", why:"Polite request pattern."},
    {id:"o2", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["We","need","it","by","Friday","."], target:"We need it by Friday .", why:"Deadline with by Friday."},
    {id:"o3", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["I’m","afraid","we’re","running","late","."], target:"I’m afraid we’re running late .", why:"Natural professional phrasing."},
    {id:"o4", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["Please","find","the","file","attached","."], target:"Please find the file attached .", why:"Common email phrase."},
    {id:"o5", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["Can","we","move","it","to","next","week","?"], target:"Can we move it to next week ?", why:"Simple rescheduling question."}
,
    {id:"o6", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["I","am","writing","to","confirm","our","appointment","tomorrow","."], target:"I am writing to confirm our appointment tomorrow.", why:"Common confirmation sentence."},
    {id:"o7", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["Could","you","please","send","the","updated","quote","?"], target:"Could you please send the updated quote?", why:"Polite request + object."},
    {id:"o8", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["Thank","you","for","your","email","."], target:"Thank you for your email.", why:"Short professional reply opener."},
    {id:"o9", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["I","have","attached","the","signed","contract","."], target:"I have attached the signed contract.", why:"Present perfect for a recent action relevant now."},
    {id:"o10", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["We","received","your","payment","yesterday","."], target:"We received your payment yesterday.", why:"Past simple with a finished time (yesterday)."},
    {id:"o11", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["Please","let","me","know","if","you","have","any","questions","."], target:"Please let me know if you have any questions.", why:"Helpful closing line."},
    {id:"o12", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["Would","it","be","possible","to","postpone","the","delivery","?"], target:"Would it be possible to postpone the delivery?", why:"Very polite request."},
    {id:"o13", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["I","will","get","back","to","you","by","end","of","day","."], target:"I will get back to you by end of day.", why:"Promise with a deadline."},
    {id:"o14", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["Sorry","for","the","inconvenience","caused","."], target:"Sorry for the inconvenience caused.", why:"Simple apology."},
    {id:"o15", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["Can","you","join","the","call","at","3","p.m.","?"], target:"Can you join the call at 3 p.m.?", why:"Meeting coordination sentence."},
  ];

  // ---------- MINI MOCK MIX (uses BANK + track add-ons) ----------
  const TRACK_ADDONS = {
    general: [
      {id:"tg1", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
        text:"Subject: Access approved\\n\\nYour request is approved. Please enable MFA by 5 p.m. today.",
        q:"What must you do?", a:["Enable MFA by 5 p.m.","Disable MFA","Ask again next week","Do nothing"], correct:0, why:"Enable MFA by 5 p.m."},
      {id:"tg2", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"A short online presentation is a ____.", a:["webinar","receipt","queue","wardrobe"], correct:0, why:"Webinar = online seminar."},
      {id:"tg3", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
        audio:"Please send the updated document by end of day.", q:"When is the deadline?", a:["End of day","Next week","No deadline","Tomorrow morning"], correct:0, why:"By end of day."}
    ],

    hospitality: [
      {id:"th1", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
        text:"Front Desk Note\\n\\nGuest requests a late check‑out at 2 p.m. Please confirm availability.",
        q:"What is the guest asking for?", a:["Late check‑out","Extra towels","Room service","Airport taxi"], correct:0, why:"Late check‑out at 2 p.m."},
      {id:"th2", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the most polite option.", q:"You want to ask for the guest’s ID.", a:["Give me your ID.","Could I see your ID, please?","You must show ID.","Show ID now."], correct:1, why:"Could I see… please? is polite."},
      {id:"th3", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
        audio:"Good evening. Your room is on the third floor, opposite the lift.", q:"Where is the room?", a:["Third floor, opposite the lift","Second floor, near reception","Ground floor, near the bar","Fourth floor, next to the stairs"], correct:0, why:"Third floor, opposite the lift."},
      {id:"th4", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"A guest can ask for “extra towels” at the ____.", a:["front desk","warehouse","customs","parking meter"], correct:0, why:"Front desk = reception."},
      {id:"th5", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
        text:"Subject: Restaurant booking\n\nYour table is confirmed for 7:30 p.m. Please arrive 10 minutes early.",
        q:"What time is the reservation?", a:["7:30 p.m.","6:30 p.m.","8:30 p.m.","7:00 p.m."], correct:0, why:"Confirmed for 7:30 p.m."},
      {id:"th6", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
        audio:"Housekeeping can bring extra towels in ten minutes.",
        q:"When will housekeeping arrive?", a:["In 10 minutes","In 1 hour","Tomorrow morning","Right now"], correct:0, why:"In ten minutes."},
      {id:"th7", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"A hotel extra like breakfast or Wi‑Fi is an ____.", a:["amenity","invoice","shipment","bug"], correct:0, why:"Amenity = extra service/facility."},
      {id:"th8", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the most polite option.", q:"____ I see your passport, please?", a:["Can","May","Do","Will"], correct:1, why:"<b>May I…?</b> is very polite."},
      {id:"th9", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["Would","you","like","a","wake‑up","call","at","6","a.m.","?"], target:"Would you like a wake‑up call at 6 a.m.?", why:"Offer + service + time."},
      {id:"th10", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
        text:"Front Desk Note\n\nPlease prepare an invoice for room 214: two nights + minibar.",
        q:"What do you need to prepare?", a:["An invoice","A room key","A new password","A delivery label"], correct:0, why:"Prepare an invoice."},
      {id:"th11", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
        audio:"Breakfast is served from six to ten in the restaurant on the ground floor.",
        q:"Where is breakfast served?", a:["In the restaurant on the ground floor","In the lobby","In the gym","In the parking lot"], correct:0, why:"Restaurant on the ground floor."},
      {id:"th12", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"A request to leave later than normal is a late ____.", a:["check‑out","check‑in","shipment","refund"], correct:0, why:"Late check‑out = leaving later."},

    ],

    customer: [
      {id:"tc1", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
        text:"Subject: Complaint\\n\\nHello, my order arrived damaged. Could you advise the next steps?\\nThanks.",
        q:"What does the customer want?", a:["A new password","Advice on next steps","A meeting invite","A holiday request"], correct:1, why:"They ask for next steps."},
      {id:"tc2", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the best reply.", q:"“Could you advise the next steps?”", a:[
        "No.",
        "Yes.",
        "Of course. Could you share a photo of the damage, please?",
        "I don’t care."
      ], correct:2, why:"Professional + helpful + polite request."},
      {id:"tc3", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"A “refund” is when the company ____ the money.", a:["returns","borrows","prints","forgets"], correct:0, why:"Refund = return money."},
      {id:"tc4", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["We","apologise","for","the","inconvenience","."], target:"We apologise for the inconvenience .", why:"Common customer-service sentence."},
      {id:"tc5", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
        audio:"I’m sorry about the issue. We can offer a refund or a replacement.",
        q:"What are the options offered?", a:["Refund or replacement","Free holiday","New password","Later delivery only"], correct:0, why:"Refund or replacement."},
      {id:"tc6", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
        text:"Subject: Return label\n\nWe have created a prepaid return label. Please print it and attach it to the box.",
        q:"What should you do with the label?", a:["Print it and attach it to the box","Delete it","Send it to HR","Pay again"], correct:0, why:"Print + attach."},
      {id:"tc7", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"A new item sent to replace the old one is a ____.", a:["replacement","delay","amenity","minutes"], correct:0, why:"Replacement = new item instead."},
      {id:"tc8", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the best reply.", q:"“Could you provide your order number?”", a:["Sure — it’s 78451.","No.","I don’t care.","Maybe later."], correct:0, why:"Professional + cooperative answer."},
      {id:"tc9", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["We","apologize","for","the","delay","."], target:"We apologize for the delay.", why:"Standard customer-service apology."},
      {id:"tc10", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
        text:"Chat\n\nAgent: I can look into this now.\nCustomer: Thank you.\nAgent: Please share a photo of the damage.",
        q:"What does the agent ask for?", a:["A photo","A refund immediately","A meeting","A room key"], correct:0, why:"A photo of the damage."},
      {id:"tc11", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"A guarantee that a product will work is a ____.", a:["warranty","queue","invoice","lift"], correct:0, why:"Warranty = guarantee."},
      {id:"tc12", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
        audio:"Please allow three to five business days for the refund to appear on your account.",
        q:"How long can the refund take?", a:["3–5 business days","3–5 minutes","One month","Same day always"], correct:0, why:"Three to five business days."},

    ],

    it: [
      {id:"ti1", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
        audio:"Hello, this is IT. Please restart your laptop and try the Wi‑Fi again.",
        q:"What is the first instruction?", a:["Buy a new laptop","Restart the laptop","Call HR","Ignore Wi‑Fi"], correct:1, why:"Restart first."},
      {id:"ti2", type:"cloze", focus:"vocab", skill:"Vocabulary", prompt:"Type ONE word.", q:"If it still fails, please ______ us back.", answer:"call", why:"Call us back = contact again by phone."},
      {id:"ti3", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
        text:"IT Ticket\\n\\nIssue: Password reset\\nAction: Send a reset link to the user.",
        q:"What should you send?", a:["A reset link","An invoice","A room key","A schedule"], correct:0, why:"Send a reset link."},
      {id:"ti4", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"A “bug” is a ____.", a:["software problem","meeting agenda","hotel room","parking lot"], correct:0, why:"Bug = software problem."},
      {id:"ti5", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
        text:"Subject: System outage\n\nWe are investigating a Teams outage. Next update at 2 p.m.",
        q:"When is the next update?", a:["2 p.m.","Tomorrow","5 p.m.","No update"], correct:0, why:"Next update at 2 p.m."},
      {id:"ti6", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
        audio:"Please clear your browser cache and restart the application.",
        q:"What should you do first?", a:["Clear the browser cache","Buy a new PC","Call the client","Ignore it"], correct:0, why:"Clear the cache first."},
      {id:"ti7", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"A temporary loss of service is an ____.", a:["outage","amenity","refund","invoice"], correct:0, why:"Outage = service is down."},
      {id:"ti8", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the best option.", q:"We ____ resolved the issue. You can try again now.", a:["have","has","had","having"], correct:0, why:"Present perfect: action completed, result now."},
      {id:"ti9", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["Please","reset","your","password","using","this","link","."], target:"Please reset your password using this link.", why:"Clear IT instruction."},
      {id:"ti10", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
        text:"IT Ticket\n\nUser cannot connect to VPN. Please confirm their username and location.",
        q:"What information do you need?", a:["Username and location","Room number","Delivery date","Invoice total"], correct:0, why:"Username + location."},
      {id:"ti11", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"To put software on a computer is to ____ it.", a:["install","invoice","ship","refund"], correct:0, why:"Install software."},
      {id:"ti12", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
        audio:"Your password expires today. Please change it before five p.m.",
        q:"When must you change the password?", a:["Before 5 p.m.","Before 5 a.m.","Next week","No deadline"], correct:0, why:"Before five p.m."},

    ],

    logistics: [
      {id:"tl1", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
        text:"Subject: Shipment delay\\n\\nDue to a delay at customs, the shipment will arrive Friday morning.\\nPlease update the client.",
        q:"What should you do?", a:["Cancel the shipment","Update the client","Ignore the message","Send it back"], correct:1, why:"Update the client."},
      {id:"tl2", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"A later arrival is a ____.", a:["deadline","delay","agenda","queue"], correct:1, why:"Delay = later than planned."},
      {id:"tl3", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
        text:"Warehouse note\\n\\nPlease label all boxes and store them on shelf B12.",
        q:"Where should you store the boxes?", a:["Shelf B12","Reception","Room D","Online"], correct:0, why:"On shelf B12."},
      {id:"tl4", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
        audio:"The delivery is scheduled for Monday at nine a.m. Please be ready to unload.",
        q:"When is the delivery scheduled?", a:["Monday 9 a.m.","Tuesday 9 a.m.","Monday 9 p.m.","Friday 9 a.m."], correct:0, why:"Monday at nine a.m."},
      {id:"tl5", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"A large flat platform used to move boxes is a ____.", a:["pallet","amenity","bug","warranty"], correct:0, why:"Pallet for shipping/storage."},
      {id:"tl6", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
        text:"Subject: Packing list missing\n\nThe pallet arrived but the packing list is missing. Please send it ASAP.",
        q:"What document is missing?", a:["The packing list","The room key","The contract","The menu"], correct:0, why:"Packing list is missing."},
      {id:"tl7", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
        audio:"The pickup is scheduled for Thursday at two p.m. Please be ready at the warehouse gate.",
        q:"When is the pickup scheduled?", a:["Thursday 2 p.m.","Wednesday 2 p.m.","Thursday 2 a.m.","Friday 2 p.m."], correct:0, why:"Thursday at 2 p.m."},
      {id:"tl8", type:"mcq", focus:"grammar", skill:"Grammar", prompt:"Choose the best option.", q:"The goods ____ shipped yesterday.", a:["were","was","is","are"], correct:0, why:"Plural goods → <b>were shipped</b> (passive)."},
      {id:"tl9", type:"order", focus:"order", skill:"Word order", prompt:"Put the words in order.", tokens:["Please","confirm","the","delivery","address","."], target:"Please confirm the delivery address.", why:"Logistics confirmation sentence."},
      {id:"tl10", type:"mcq", focus:"vocab", skill:"Vocabulary", prompt:"Choose the best word.", q:"The process of checking goods at the border is customs ____.", a:["clearance","holiday","queue","minutes"], correct:0, why:"Customs clearance."},
      {id:"tl11", type:"reading", focus:"reading", skill:"Reading", prompt:"Read and choose the best answer.",
        text:"Warehouse note\n\nPlease move the damaged boxes to the returns area and report the quantity.",
        q:"Where should you move the damaged boxes?", a:["To the returns area","To the lobby","To the client","To the lift"], correct:0, why:"Move to returns area."},
      {id:"tl12", type:"listening", focus:"listening", skill:"Listening", prompt:"Listen and choose the best answer. (2 listens max)",
        audio:"The container will arrive at the port on Monday morning. Please arrange transport to the warehouse.",
        q:"What should you arrange?", a:["Transport to the warehouse","A hotel booking","A refund","A password reset"], correct:0, why:"Arrange transport."},

    ]
  };

  // ---------- UI: TABS ----------
  let activeTab = "path";
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      activeTab = btn.dataset.tab;
      renderActiveTab();
    });
  });

  function renderActiveTab(){
    try{
      errBox.hidden = true;
      errBox.textContent = "";
      if(activeTab === "path") return renderLessonPath();
      if(activeTab === "lab") return renderPracticeLab();
      if(activeTab === "mock") return renderMiniMock();
      if(activeTab === "progress") return renderProgress();
    }catch(e){
      showError(e?.message || "Render error");
    }
  }

  // ---------- LESSON PATH ----------
  function renderLessonPath(){
    const prog = loadProgress();
    const grammar = LESSONS.filter(x => x.type === "grammar");
    const vocab = LESSONS.filter(x => x.type === "vocab");

    view.innerHTML = `
      <div class="cp-grid">
        <div class="cp-col-8">
          <div class="cp-card">
            <div class="cp-kicker">🧩 Your supportive learning path</div>
            <h2>Start with confidence</h2>
            <p>
              Choose a lesson. Each lesson gives a clear explanation, examples, and a short practice set.
              You can always retry — and you’ll never see the same question twice in one session.
            </p>
            <div class="cp-actions">
              <button class="cp-btn primary" id="cpWarmup">✨ Warm‑up check (10 questions)</button>
              <button class="cp-btn" id="cpQuickVocab">🗃️ Quick vocab review</button>
            </div>
            <div class="cp-divider"></div>
            <div id="cpLessonArea"></div>
          </div>
        </div>

        <div class="cp-col-4">
          <div class="cp-card">
            <div class="cp-kicker">📌 Today’s settings</div>
            <h3>Track: ${escapeHtml(trackLabel())}</h3>
            <div class="cp-badges">
              <span class="cp-badge">Accent: ${settings.accent.toUpperCase()}</span>
              <span class="cp-badge">Level: ${settings.level.toUpperCase()}</span>
              <span class="cp-badge">Mode: Gentle + explained</span>
            </div>
            <div class="cp-divider"></div>
            <h3>Grammar lessons</h3>
            <div class="cp-actions">
              ${grammar.map(m => `<button class="cp-btn" data-open="${m.id}">${m.icon} ${escapeHtml(m.title)}</button>`).join("")}
            </div>
            <div class="cp-divider"></div>
            <h3>Vocabulary lessons</h3>
            <div class="cp-actions">
              ${vocab.map(m => `<button class="cp-btn" data-open="${m.id}">${m.icon} ${escapeHtml(m.title)}</button>`).join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    $("#cpWarmup").addEventListener("click", () => startSession({
      mode:"warmup",
      title:"Warm‑up check (10 questions)",
      subtitle:"A friendly diagnostic — it’s okay to miss some. We’ll use it to guide your next steps.",
      pool: buildMockPool(true),
      n: 10
    }, $("#cpLessonArea")));

    $("#cpQuickVocab").addEventListener("click", () => openQuickVocab($("#cpLessonArea")));

    $$(".cp-btn[data-open]").forEach(btn => {
      btn.addEventListener("click", () => openLesson(btn.dataset.open, $("#cpLessonArea")));
    });

    // If Twemoji is present, render icons nicely
    try{
      if(window.twemoji) window.twemoji.parse(document.body);
    }catch{}
  }

  function openQuickVocab(mount){
    const rows = US_UK_TERMS.map(t => `
      <div class="cp-slot">
        <div>
          <strong>${t.icon} ${escapeHtml(t.us)} / ${escapeHtml(t.uk)}</strong>
          <div class="cp-mini">${escapeHtml(t.note)}</div>
        </div>
        <div class="cp-actions">
          <button class="cp-btn" data-say="${escapeHtml(t.us)}">🔊 US</button>
          <button class="cp-btn" data-say="${escapeHtml(t.uk)}">🔊 UK</button>
        </div>
      </div>
    `).join("");

    mount.innerHTML = `
      <div class="cp-card" style="margin-top:1rem;">
        <div class="cp-kicker">🗃️ Quick vocab review</div>
        <h3>US vs UK words (fast confidence boost)</h3>
        <p class="cp-mini">These are quick wins that improve listening comprehension immediately.</p>
        <div class="cp-divider"></div>
        <div style="display:grid; gap:.65rem;">${rows}</div>
      </div>
    `;

    $$("[data-say]", mount).forEach(b => {
      b.addEventListener("click", () => {
        const txt = b.getAttribute("data-say") || "";
        const res = speak(txt);
        if(!res.ok){
          alert(res.reason);
        }
      });
    });
  }

  function openLesson(lessonId, mount){
    const lesson = LESSONS.find(x => x.id === lessonId);
    if(!lesson) return;

    const prog = loadProgress();
    const m = prog.mastery[lesson.id] || { correct:0, total:0 };
    const pct = m.total ? Math.round((m.correct/m.total)*100) : 0;

    const vocabBlock = lesson.vocab ? `
      <div class="cp-divider"></div>
      <h3>Vocabulary list</h3>
      <div style="display:grid; gap:.6rem;">
        ${lesson.vocab.map(v => `
          <div class="cp-slot">
            <div>
              <strong>${v.icon} ${escapeHtml(v.term)}</strong>
              <div class="cp-mini">${escapeHtml(v.def)}<br><em>${escapeHtml(v.ex)}</em></div>
            </div>
            <button class="cp-btn" data-say="${escapeHtml(v.term)}">🔊 Listen</button>
          </div>
        `).join("")}
      </div>
    ` : "";

    const pairBlock = lesson.vocabPairs ? `
      <div class="cp-divider"></div>
      <h3>US / UK pairs</h3>
      <div style="display:grid; gap:.6rem;">
        ${lesson.vocabPairs.map(v => `
          <div class="cp-slot">
            <div>
              <strong>${v.icon} ${escapeHtml(v.us)} / ${escapeHtml(v.uk)}</strong>
              <div class="cp-mini">${escapeHtml(v.note)}</div>
            </div>
            <div class="cp-actions">
              <button class="cp-btn" data-say="${escapeHtml(v.us)}">🔊 US</button>
              <button class="cp-btn" data-say="${escapeHtml(v.uk)}">🔊 UK</button>
            </div>
          </div>
        `).join("")}
      </div>
    ` : "";

    mount.innerHTML = `
      <div class="cp-card" style="margin-top:1rem;">
        <div class="cp-kicker">${lesson.icon} Lesson</div>
        <h3>${escapeHtml(lesson.title)}</h3>
        <p>${escapeHtml(lesson.summary)}</p>

        <div class="cp-progress">
          <div class="cp-mini"><strong>Mastery</strong>: ${pct}%</div>
          <div class="cp-bar" aria-label="Lesson mastery progress"><span style="width:${pct}%"></span></div>
        </div>

        <div class="cp-divider"></div>
        <div>${lesson.explain}</div>
        ${vocabBlock}
        ${pairBlock}

        <div class="cp-divider"></div>
        <div class="cp-actions">
          <button class="cp-btn primary" id="cpStartLessonPractice">✅ Practice this lesson</button>
          <button class="cp-btn" id="cpStartFlash">🃏 Flashcards (vocab)</button>
          <button class="cp-btn ghost" id="cpCloseLesson">Close</button>
        </div>

        <div id="cpLessonPractice"></div>
      </div>
    `;

    // Speak buttons in vocab blocks
    $$("[data-say]", mount).forEach(btn => {
      btn.addEventListener("click", () => {
        const txt = btn.getAttribute("data-say") || "";
        const res = speak(txt);
        if(!res.ok) alert(res.reason);
      });
    });

    $("#cpCloseLesson").addEventListener("click", () => mount.innerHTML = "");
    $("#cpStartFlash").addEventListener("click", () => {
      const list = [];
      if(lesson.vocab){
        for(const v of lesson.vocab){
          list.push({front:`${v.icon} ${v.term}`, back:`${v.def}<br><em>${escapeHtml(v.ex)}</em>`, say:v.term, id:v.id});
        }
      }
      if(lesson.vocabPairs){
        for(const v of lesson.vocabPairs){
          list.push({front:`${v.icon} ${v.us}`, back:`UK: <strong>${escapeHtml(v.uk)}</strong><br><span class="cp-mini">${escapeHtml(v.note)}</span>`, say:v.us, id:v.id+"-us"});
          list.push({front:`${v.icon} ${v.uk}`, back:`US: <strong>${escapeHtml(v.us)}</strong><br><span class="cp-mini">${escapeHtml(v.note)}</span>`, say:v.uk, id:v.id+"-uk"});
        }
      }
      if(!list.length){
        $("#cpLessonPractice").innerHTML = `<div class="cp-feedback">No flashcards for this lesson (grammar lesson). Try the Practice Lab for more.</div>`;
        return;
      }
      renderFlashcards(list, $("#cpLessonPractice"));
    });

    $("#cpStartLessonPractice").addEventListener("click", () => {
      const practice = lesson.practice || [];
      if(!practice.length){
        $("#cpLessonPractice").innerHTML = `<div class="cp-feedback">No practice items were found for this lesson.</div>`;
        return;
      }
      startSession({
        mode:"lesson",
        lessonId: lesson.id,
        title:`Practice: ${lesson.title}`,
        subtitle:"Small set, explained. Take your time.",
        pool: practice,
        n: practice.length,
        gentle:true
      }, $("#cpLessonPractice"));
    });

    try{ if(window.twemoji) window.twemoji.parse(mount); }catch{}
  }

  // ---------- PRACTICE LAB ----------
  function renderPracticeLab(){
    view.innerHTML = `
      <div class="cp-grid">
        <div class="cp-col-8">
          <div class="cp-card">
            <div class="cp-kicker">🧪 Practice Lab</div>
            <h2>Target one skill at a time</h2>
            <p>Choose a focus, then practice in short sets. The trainer avoids repeats in the same session.</p>

            <div class="cp-divider"></div>

            <div class="cp-grid">
              <div class="cp-col-4">
                <label class="cp-mini"><strong>Focus</strong></label>
                <select id="labFocus" class="cp-input" style="margin-top:.35rem;">
                  <option value="mix">Realistic mix</option>
                  <option value="grammar">Grammar</option>
                  <option value="vocab">Vocabulary</option>
                  <option value="reading">Reading</option>
                  <option value="listening">Listening</option>
                  <option value="order">Word order</option>
                </select>
              </div>
              <div class="cp-col-4">
                <label class="cp-mini"><strong>Length</strong></label>
                <select id="labLen" class="cp-input" style="margin-top:.35rem;">
                  <option value="6">6 questions</option>
                  <option value="10" selected>10 questions</option>
                  <option value="15">15 questions</option>
                </select>
              </div>
              <div class="cp-col-4">
                <label class="cp-mini"><strong>Help</strong></label>
                <select id="labHelp" class="cp-input" style="margin-top:.35rem;">
                  <option value="gentle" selected>Gentle (hints + explanations)</option>
                  <option value="exam">Exam-ish (less help)</option>
                </select>
              </div>
            </div>

            <div class="cp-actions" style="margin-top:1rem;">
              <button class="cp-btn primary" id="labStart">Start practice</button>
              <button class="cp-btn" id="labFlash">Flashcards (US/UK + email)</button>
            </div>

            <div id="labArea" style="margin-top:1rem;"></div>
          </div>
        </div>

        <div class="cp-col-4">
          <div class="cp-card">
            <div class="cp-kicker">🧩 Realistic subjects</div>
            <h3>What you’ll see</h3>
            <ul class="cp-list">
              <li>Short emails & notices</li>
              <li>Polite requests & scheduling</li>
              <li>Deadlines, delays, meeting updates</li>
              <li>Listening prompts (2 plays)</li>
            </ul>
            <div class="cp-divider"></div>
            <h3>Track: ${escapeHtml(trackLabel())}</h3>
            <p class="cp-mini">We sprinkle a few track‑specific scenarios inside the “mix” mode.</p>
          </div>
        </div>
      </div>
    `;

    $("#labStart").addEventListener("click", () => {
      const focus = $("#labFocus").value;
      const n = parseInt($("#labLen").value, 10);
      const gentle = $("#labHelp").value === "gentle";
      const pool = buildMockPool(false, focus);

      startSession({
        mode:"lab",
        title:`Practice Lab: ${focus === "mix" ? "Realistic mix" : focus}`,
        subtitle: gentle ? "You’ll get hints + explanations. Keep going — confidence grows fast." : "Less help, more exam‑like. You can switch back anytime.",
        pool,
        n,
        gentle
      }, $("#labArea"));
    });

    $("#labFlash").addEventListener("click", () => {
      const deck = [];
      // Combine core email vocab + US/UK pairs
      const emailLesson = LESSONS.find(x => x.id === "email-essentials");
      if(emailLesson?.vocab){
        for(const v of emailLesson.vocab){
          deck.push({id:v.id, front:`${v.icon} ${v.term}`, back:`${v.def}<br><em>${escapeHtml(v.ex)}</em>`, say:v.term});
        }
      }
      for(const p of US_UK_TERMS){
        deck.push({id:p.id+"-us", front:`${p.icon} ${p.us}`, back:`UK: <strong>${escapeHtml(p.uk)}</strong><br><span class="cp-mini">${escapeHtml(p.note)}</span>`, say:p.us});
        deck.push({id:p.id+"-uk", front:`${p.icon} ${p.uk}`, back:`US: <strong>${escapeHtml(p.us)}</strong><br><span class="cp-mini">${escapeHtml(p.note)}</span>`, say:p.uk});
      }
      renderFlashcards(deck, $("#labArea"));
    });

    try{ if(window.twemoji) window.twemoji.parse(view); }catch{}
  }

  // ---------- MINI MOCK ----------
  function renderMiniMock(){
    view.innerHTML = `
      <div class="cp-grid">
        <div class="cp-col-8">
          <div class="cp-card">
            <div class="cp-kicker">⏱️ Mini Mock Exam</div>
            <h2>Realistic, but not discouraging</h2>
            <p>
              This is a supportive simulation: realistic question types, clear explanations, and a gentle tone.
              You can run it as a timed mock or a calm practice.
            </p>

            <div class="cp-divider"></div>

            <div class="cp-grid">
              <div class="cp-col-4">
                <label class="cp-mini"><strong>Questions</strong></label>
                <select id="mockLen" class="cp-input" style="margin-top:.35rem;">
                  <option value="10">10 (quick)</option>
                  <option value="20" selected>20 (standard)</option>
                  <option value="30">30 (challenge)</option>
                </select>
              </div>
              <div class="cp-col-4">
                <label class="cp-mini"><strong>Pace</strong></label>
                <select id="mockPace" class="cp-input" style="margin-top:.35rem;">
                  <option value="calm" selected>Calm (no timer pressure)</option>
                  <option value="timed">Timed (gentle timer)</option>
                </select>
              </div>
              <div class="cp-col-4">
                <label class="cp-mini"><strong>Mix</strong></label>
                <select id="mockMix" class="cp-input" style="margin-top:.35rem;">
                  <option value="mix" selected>Realistic mix</option>
                  <option value="reading">More reading</option>
                  <option value="listening">More listening</option>
                  <option value="grammar">More grammar</option>
                </select>
              </div>
            </div>

            <div class="cp-actions" style="margin-top:1rem;">
              <button class="cp-btn primary" id="mockStart">Start mini mock</button>
              <button class="cp-btn" id="mockTips">How to stay confident</button>
            </div>

            <div id="mockArea" style="margin-top:1rem;"></div>
          </div>
        </div>

        <div class="cp-col-4">
          <div class="cp-card">
            <div class="cp-kicker">🎯 Track: ${escapeHtml(trackLabel())}</div>
            <h3>Realistic contexts</h3>
            <ul class="cp-list">
              <li>Scheduling & deadlines</li>
              <li>Short notices & emails</li>
              <li>Service situations (your track)</li>
              <li>Listening instructions</li>
            </ul>
            <div class="cp-divider"></div>
            <h3>Accent</h3>
            <p class="cp-mini">Listening uses the accent you chose at the top (US/UK).</p>
          </div>
        </div>
      </div>
    `;

    $("#mockTips").addEventListener("click", () => {
      $("#mockArea").innerHTML = `
        <div class="cp-feedback cp-hint">
          <strong>You won’t be discouraged here — promise.</strong><br>
          • If you miss a question, read the explanation and take one “quick win” from it.<br>
          • Aim for steady improvement, not perfection.<br>
          • Listening: play twice, then decide. Don’t overthink.<br>
          • If you feel stuck, switch to <em>Practice Lab</em> for focused practice.
        </div>
      `;
    });

    $("#mockStart").addEventListener("click", () => {
      const n = parseInt($("#mockLen").value, 10);
      const pace = $("#mockPace").value;
      const mix = $("#mockMix").value;

      const pool = buildMockPool(true, mix);

      startSession({
        mode:"mock",
        title:`Mini Mock Exam (${n} questions)`,
        subtitle: pace === "timed" ? "Timed mode: gentle pressure, like the real thing — but still supportive." : "Calm mode: take your time and build confidence.",
        pool,
        n,
        gentle: true,
        timed: pace === "timed"
      }, $("#mockArea"));
    });

    try{ if(window.twemoji) window.twemoji.parse(view); }catch{}
  }

  // ---------- PROGRESS ----------
  function renderProgress(){
    const p = loadProgress();
    const masteryEntries = Object.entries(p.mastery || {});
    const best = p.bestMock ? `<div class="cp-badge">Best mock: ${p.bestMock.score}% (${p.bestMock.date})</div>` : `<div class="cp-badge">Best mock: —</div>`;

    view.innerHTML = `
      <div class="cp-grid">
        <div class="cp-col-8">
          <div class="cp-card">
            <div class="cp-kicker">📈 Your progress</div>
            <h2>Small wins matter</h2>
            <p>Progress is saved on this device (localStorage). You can reset any time.</p>

            <div class="cp-badges">
              <div class="cp-badge">Attempts: ${p.attempts || 0}</div>
              ${best}
              <div class="cp-badge">Confidence streak: ${p.streak || 0}</div>
            </div>

            <div class="cp-divider"></div>
            <h3>Lesson mastery</h3>
            <div id="cpMasteryList" style="display:grid; gap:.6rem;"></div>

            <div class="cp-divider"></div>
            <div class="cp-actions">
              <button class="cp-btn warn" id="cpReset">Reset progress</button>
              <button class="cp-btn" id="cpGoPath">Go to Lesson Path</button>
            </div>
          </div>
        </div>

        <div class="cp-col-4">
          <div class="cp-card">
            <div class="cp-kicker">💡 Next steps</div>
            <h3>Suggested routine</h3>
            <ul class="cp-list">
              <li>Warm‑up check (10 questions)</li>
              <li>One grammar lesson + practice</li>
              <li>One vocab deck (flashcards)</li>
              <li>Mini mock (10 or 20)</li>
            </ul>
            <p class="cp-mini">Keep sessions short. Short + consistent beats long + rare.</p>
          </div>
        </div>
      </div>
    `;

    const list = $("#cpMasteryList");
    if(!masteryEntries.length){
      list.innerHTML = `<div class="cp-feedback">No mastery data yet. Start a lesson to see progress here.</div>`;
    }else{
      const blocks = LESSONS.map(ls => {
        const m = p.mastery[ls.id] || { correct:0, total:0 };
        const pct = m.total ? Math.round((m.correct/m.total)*100) : 0;
        return `
          <div class="cp-slot">
            <div>
              <strong>${ls.icon} ${escapeHtml(ls.title)}</strong>
              <div class="cp-mini">Mastery: ${pct}% (${m.correct}/${m.total})</div>
            </div>
            <div class="cp-bar" style="max-width:240px;"><span style="width:${pct}%"></span></div>
          </div>
        `;
      }).join("");
      list.innerHTML = blocks;
    }

    $("#cpReset").addEventListener("click", () => {
      if(confirm("Reset progress on this device?")){
        localStorage.removeItem(PROGRESS_KEY);
        renderProgress();
      }
    });
    $("#cpGoPath").addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("is-active"));
      tabBtns[0].classList.add("is-active");
      activeTab = "path";
      renderActiveTab();
    });

    try{ if(window.twemoji) window.twemoji.parse(view); }catch{}
  }

  // ---------- SESSION ENGINE ----------
  function buildMockPool(includeTrackAddons, focus="mix"){
    const base = BANK.slice();
    const add = includeTrackAddons ? (TRACK_ADDONS[settings.track] || []) : [];
    const poolAll = base.concat(add);

    if(focus === "mix") return poolAll;

    // Strict focus: only return items from the selected category
    return poolAll.filter(x => x.focus === focus);
  }

  function startSession(opts, mount){
    const used = new Set();
    // Choose unique IDs from pool; if pool includes duplicates (weights), unique selection handles it.
    const chosen = pickUnique(opts.pool, opts.n, used);

    if(chosen.length < opts.n){
      // top up with anything unique from pool
      const more = pickUnique(opts.pool, opts.n - chosen.length, used);
      chosen.push(...more);
    }

    const state = {
      title: opts.title || "Session",
      subtitle: opts.subtitle || "",
      mode: opts.mode || "lab",
      lessonId: opts.lessonId || null,
      gentle: !!opts.gentle,
      timed: !!opts.timed,
      startTime: Date.now(),
      idx: 0,
      score: 0,
      correct: 0,
      wrong: 0,
      answers: [],
      chosen
    };

    renderSession(state, mount);
  }

  function renderSession(state, mount){
    const total = state.chosen.length;
    const q = state.chosen[state.idx];

    const pct = Math.round((state.idx/total)*100);

    mount.innerHTML = `
      <div class="cp-card" style="margin-top:1rem;">
        <div class="cp-kicker">📘 ${escapeHtml(state.title)}</div>
        <p class="cp-mini">${escapeHtml(state.subtitle)}</p>

        <div class="cp-progress">
          <div class="cp-mini"><strong>Progress</strong>: ${state.idx+1}/${total} · <strong>Score</strong>: ${state.score}</div>
          <div class="cp-bar" aria-label="Session progress"><span style="width:${pct}%"></span></div>
        </div>

        <div class="cp-divider"></div>

        <div id="cpQ"></div>

        <div class="cp-actions" style="margin-top:1rem;">
          <button class="cp-btn" id="cpSkip">Skip</button>
          <button class="cp-btn" id="cpHint">Hint</button>
          <button class="cp-btn good" id="cpNext" disabled>Next</button>
          <button class="cp-btn ghost" id="cpStop">Stop</button>
        </div>

        <div id="cpMeta" class="cp-mini cp-meta" style="margin-top:.5rem;"></div>
      </div>
    `;

    const qWrap = $("#cpQ", mount);
    renderQuestion(q, qWrap, state);

    const nextBtn = $("#cpNext", mount);
    const hintBtn = $("#cpHint", mount);
    const skipBtn = $("#cpSkip", mount);
    const stopBtn = $("#cpStop", mount);

    hintBtn.addEventListener("click", () => showHint(qWrap, q));
    skipBtn.addEventListener("click", () => {
      recordAnswer(state, q, false, true);
      goNext(state, mount);
    });
    stopBtn.addEventListener("click", () => {
      mount.innerHTML = `<div class="cp-feedback">Session stopped. You can start a new one anytime — no worries.</div>`;
    });
    nextBtn.addEventListener("click", () => goNext(state, mount));

    // Timer meta (gentle)
    if(state.timed){
      const meta = $("#cpMeta", mount);
      const timer = setInterval(() => {
        if(!document.body.contains(meta)){ clearInterval(timer); return; }
        const elapsed = Math.floor((Date.now() - state.startTime)/1000);
        meta.textContent = `⏱️ Timer: ${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,"0")} · Tip: steady pace, no panic.`;
      }, 500);
    }

    try{ if(window.twemoji) window.twemoji.parse(mount); }catch{}
  }

  function goNext(state, mount){
    if(state.idx < state.chosen.length - 1){
      state.idx += 1;
      renderSession(state, mount);
    }else{
      renderResults(state, mount);
    }
  }

  function recordAnswer(state, q, isCorrect, skipped=false){
    state.answers.push({ id:q.id, correct:isCorrect, skipped, focus:q.focus, type:q.type });
    if(!skipped){
      if(isCorrect){
        state.correct += 1;
        state.score += 1;
      }else{
        state.wrong += 1;
      }
    }
  }

  function renderResults(state, mount){
    const total = state.chosen.length;
    const answered = state.correct + state.wrong;
    const pct = answered ? Math.round((state.correct/answered)*100) : 0;

    // Save progress
    const prog = loadProgress();
    prog.attempts = (prog.attempts || 0) + 1;

    // Gentle streak: +1 if >=60% on answered items
    if(pct >= 60) prog.streak = (prog.streak || 0) + 1;
    else prog.streak = 0;

    // Best mock record
    if(state.mode === "mock"){
      const now = new Date();
      const stamp = now.toLocaleDateString(undefined, { year:"numeric", month:"short", day:"numeric" });
      if(!prog.bestMock || pct > prog.bestMock.score){
        prog.bestMock = { score:pct, date: stamp };
      }
    }

    // Lesson mastery update
    if(state.lessonId){
      const m = prog.mastery[state.lessonId] || { correct:0, total:0 };
      // Only count non-skipped
      for(const a of state.answers){
        if(a.skipped) continue;
        m.total += 1;
        if(a.correct) m.correct += 1;
      }
      prog.mastery[state.lessonId] = m;
    }

    saveProgress(prog);

    // Find weak areas
    const byFocus = {};
    for(const a of state.answers){
      if(a.skipped) continue;
      const k = a.focus || "mix";
      byFocus[k] = byFocus[k] || { correct:0, total:0 };
      byFocus[k].total += 1;
      if(a.correct) byFocus[k].correct += 1;
    }
    const focusLines = Object.entries(byFocus).map(([k,v]) => {
      const p = v.total ? Math.round((v.correct/v.total)*100) : 0;
      const label = k === "vocab" ? "Vocabulary" : k.charAt(0).toUpperCase()+k.slice(1);
      return `<li><strong>${escapeHtml(label)}</strong>: ${p}%</li>`;
    }).join("");

    const encouragement = pct >= 80
      ? "Excellent — you’re ready for harder sets."
      : pct >= 60
        ? "Good progress — you’re building real exam confidence."
        : "Totally okay — this just shows what to review next. You’re on track.";

    mount.innerHTML = `
      <div class="cp-card" style="margin-top:1rem;">
        <div class="cp-kicker">🏁 Results</div>
        <h3>${escapeHtml(encouragement)}</h3>

        <div class="cp-badges">
          <span class="cp-badge">Correct: ${state.correct}</span>
          <span class="cp-badge">Wrong: ${state.wrong}</span>
          <span class="cp-badge">Skipped: ${total - answered}</span>
          <span class="cp-badge">Score: ${pct}%</span>
        </div>

        <div class="cp-divider"></div>
        <h3>Skill snapshot</h3>
        <ul class="cp-list">${focusLines || "<li>No data</li>"}</ul>

        <div class="cp-divider"></div>
        <div class="cp-actions">
          <button class="cp-btn primary" id="cpReviewWeak">🔁 Review weak points</button>
          <button class="cp-btn" id="cpNewMix">✨ New realistic mix</button>
          <button class="cp-btn" id="cpToPath">🗺️ Lesson Path</button>
        </div>

        <div id="cpWeakArea" style="margin-top:1rem;"></div>
      </div>
    `;

    $("#cpToPath", mount).addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("is-active"));
      tabBtns[0].classList.add("is-active");
      activeTab = "path";
      renderActiveTab();
    });

    $("#cpNewMix", mount).addEventListener("click", () => {
      // start a short mix in-place
      startSession({
        mode:"lab",
        title:"New realistic mix (10)",
        subtitle:"Fresh questions, no repeats in this run.",
        pool: buildMockPool(true, "mix"),
        n: 10,
        gentle:true
      }, mount);
    });

    $("#cpReviewWeak", mount).addEventListener("click", () => {
      const weak = state.answers
        .filter(a => !a.skipped && !a.correct)
        .slice(0, 8)
        .map(a => a.id);

      if(!weak.length){
        $("#cpWeakArea", mount).innerHTML = `<div class="cp-feedback">Nothing to review — you got everything correct. Nice!</div>`;
        return;
      }

      // Create a review pool from BANK + addons by id
      const pool = buildMockPool(true, "mix");
      const reviewItems = weak.map(id => pool.find(x => x.id === id)).filter(Boolean);

      $("#cpWeakArea", mount).innerHTML = `<div class="cp-feedback cp-hint"><strong>Review mode</strong>: we’ll retry your missed questions with full explanations.</div>`;
      startSession({
        mode:"review",
        title:"Review mode (missed questions)",
        subtitle:"Take it slow. Understanding is the goal.",
        pool: reviewItems,
        n: reviewItems.length,
        gentle:true
      }, $("#cpWeakArea", mount));
    });

    try{ if(window.twemoji) window.twemoji.parse(mount); }catch{}
  }

  // ---------- QUESTION RENDERERS ----------
  function enableNext(mount){
    const next = $("#cpNext", mount.closest(".cp-card"));
    if(next) next.disabled = false;
  }

  function showHint(mount, q){
    const existing = $(".cp-feedback.cp-hint", mount);
    if(existing) return;

    let hint = "Look for the most polite / most professional option.";
    if(q.type === "cloze") hint = "Think: what single word is most common in emails here?";
    if(q.type === "reading") hint = "Scan for times, dates, or key words (deadline, moved, arrive…).";
    if(q.type === "listening") hint = "Play twice max. Focus on numbers, times, and locations.";
    if(q.type === "order") hint = "Start with the modal/subject, then the main verb.";

    const box = document.createElement("div");
    box.className = "cp-feedback cp-hint";
    box.innerHTML = `💡 <strong>Hint</strong>: ${hint}`;
    mount.appendChild(box);
  }

  function renderQuestion(q, mount, state){
    mount.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "cp-q";
    const tLabel = labelType(q.type);
    wrap.innerHTML = `
      <div class="cp-mini"><strong>${escapeHtml(q.skill || "Task")}</strong> · ${escapeHtml(tLabel)}</div>
      <h3>${escapeHtml(q.q || q.title || "Question")}</h3>
      <p class="cp-prompt">${q.prompt ? q.prompt : ""}</p>
    `;
    mount.appendChild(wrap);

    // Replace title for reading/listening/order/match
    const h3 = $("h3", wrap);
    if(q.type === "reading"){
      h3.textContent = q.q || "Reading question";
      const text = document.createElement("div");
      text.className = "cp-reading";
      text.textContent = decodeNL(q.text || "");
      wrap.insertBefore(text, h3);
    }
    if(q.type === "listening"){
      h3.textContent = q.q || "Listening question";
      const info = document.createElement("div");
      info.className = "cp-feedback";
      info.innerHTML = `🎧 <strong>Listening</strong>: you can play the audio <strong>2 times</strong>.`;
      wrap.insertBefore(info, h3);

      const playRow = document.createElement("div");
      playRow.className = "cp-actions";
      let playsLeft = 2;

      const playBtn = document.createElement("button");
      playBtn.className = "cp-btn primary";
      playBtn.type = "button";
      playBtn.textContent = "▶️ Play";

      const plays = document.createElement("div");
      plays.className = "cp-mini";
      plays.style.alignSelf = "center";
      plays.textContent = `Plays left: ${playsLeft}`;

      playBtn.addEventListener("click", () => {
        if(playsLeft <= 0) return;
        playsLeft -= 1;
        plays.textContent = `Plays left: ${playsLeft}`;
        const res = speak(q.audio || "");
        if(!res.ok){
          alert(res.reason);
          playsLeft += 1;
          plays.textContent = `Plays left: ${playsLeft}`;
        }
        if(playsLeft <= 0){
          playBtn.disabled = true;
        }
      });

      playRow.appendChild(playBtn);
      playRow.appendChild(plays);
      wrap.insertBefore(playRow, h3);
    }

    if(q.type === "mcq" || q.type === "reading" || q.type === "listening"){
      renderMCQ(q, wrap, state);
      return;
    }
    if(q.type === "cloze"){
      renderCloze(q, wrap, state);
      return;
    }
    if(q.type === "order"){
      renderOrder(q, wrap, state);
      return;
    }
    if(q.type === "match"){
      renderMatch(q, wrap, state);
      return;
    }

    const fb = document.createElement("div");
    fb.className = "cp-feedback";
    fb.innerHTML = `This question type isn’t supported yet.`;
    wrap.appendChild(fb);
    enableNext(mount);
  }

  function renderMCQ(q, wrap, state){
    const choices = document.createElement("div");
    choices.className = "cp-choices";

    q.a.forEach((opt, idx) => {
      const b = document.createElement("button");
      b.className = "cp-choice";
      b.type = "button";
      b.innerHTML = escapeHtml(opt);
      b.addEventListener("click", () => {
        // lock
        $$(".cp-choice", choices).forEach(x => x.disabled = true);

        const correct = idx === q.correct;
        b.classList.add(correct ? "is-correct" : "is-wrong");
        if(!correct){
          const rightBtn = $$(".cp-choice", choices)[q.correct];
          if(rightBtn) rightBtn.classList.add("is-correct");
        }

        recordAnswer(state, q, correct, false);

        const fb = document.createElement("div");
        fb.className = "cp-feedback";
        const tone = correct ? "✅ Nice!" : "🧭 Almost — but you’re learning the rule.";
        fb.innerHTML = `<strong>${tone}</strong><br>${q.why || ""}`;
        wrap.appendChild(fb);

        enableNext(wrap);
      });
      choices.appendChild(b);
    });

    wrap.appendChild(choices);
  }

  function renderCloze(q, wrap, state){
    const row = document.createElement("div");
    row.className = "cp-actions";

    const inp = document.createElement("input");
    inp.className = "cp-input";
    inp.placeholder = "Type your answer…";
    inp.autocomplete = "off";
    inp.spellcheck = false;

    const check = document.createElement("button");
    check.className = "cp-btn primary";
    check.type = "button";
    check.textContent = "Check";

    row.appendChild(inp);
    row.appendChild(check);
    wrap.appendChild(row);

    const question = document.createElement("div");
    question.className = "cp-reading";
    question.textContent = q.q || "";
    wrap.insertBefore(question, row);

    check.addEventListener("click", () => {
      const user = (inp.value || "").trim().toLowerCase();
      const ans = String(q.answer || "").trim().toLowerCase();
      const ok = user === ans;

      inp.disabled = true;
      check.disabled = true;

      recordAnswer(state, q, ok, false);

      const fb = document.createElement("div");
      fb.className = "cp-feedback";
      if(ok){
        fb.innerHTML = `✅ <strong>Correct.</strong> ${q.why || ""}`;
      }else{
        fb.innerHTML = `🧭 <strong>Not this time.</strong> Correct answer: <strong>${escapeHtml(q.answer)}</strong><br>${q.why || ""}`;
      }
      wrap.appendChild(fb);
      enableNext(wrap);
    });

    inp.addEventListener("keydown", (e) => {
      if(e.key === "Enter") check.click();
    });
  }

  function renderOrder(q, wrap, state){
    const target = (q.target || "").trim();

    const tiles = document.createElement("div");
    tiles.className = "cp-tiles";

    const slot = document.createElement("div");
    slot.className = "cp-slot";
    slot.innerHTML = `<div><strong>Build the sentence</strong><div class="cp-mini">Drag words into a logical order.</div></div><div class="cp-drop" id="orderDrop">Drop here</div>`;

    const drop = $("#orderDrop", slot);
    const built = [];

    function updateDrop(){
      drop.textContent = built.length ? prettySentence(built.join(" ")) : "Drop here";
      drop.classList.toggle("filled", built.length>0);
    }
    updateDrop();

    // Drag tokens
    const toks = shuffleOrderTokens(q.tokens || []);
    toks.forEach(tok => {
      const t = document.createElement("div");
      t.className = "cp-tile";
      t.textContent = tok;
      t.draggable = true;
      t.addEventListener("dragstart", (ev) => {
        ev.dataTransfer.setData("text/plain", tok);
      });
      tiles.appendChild(t);
    });

    drop.addEventListener("dragover", (ev) => ev.preventDefault());
    drop.addEventListener("drop", (ev) => {
      ev.preventDefault();
      const tok = ev.dataTransfer.getData("text/plain");
      if(!tok) return;
      built.push(tok);
      updateDrop();
    });

    const actions = document.createElement("div");
    actions.className = "cp-actions";
    const reset = document.createElement("button");
    reset.className = "cp-btn";
    reset.type = "button";
    reset.textContent = "Reset";
    const check = document.createElement("button");
    check.className = "cp-btn primary";
    check.type = "button";
    check.textContent = "Check";
    actions.appendChild(reset);
    actions.appendChild(check);

    reset.addEventListener("click", () => {
      built.length = 0;
      updateDrop();
      drop.classList.remove("good","bad");
      const fb = $(".cp-feedback", wrap);
      if(fb) fb.remove();
    });

    check.addEventListener("click", () => {
      // Normalize spaces
      const user = built.join(" ");
      const ok = normalizeSentence(user) === normalizeSentence(target);

      recordAnswer(state, q, ok, false);

      drop.classList.add(ok ? "good" : "bad");

      const fb = document.createElement("div");
      fb.className = "cp-feedback";
      fb.innerHTML = ok
        ? `✅ <strong>Great.</strong> ${q.why || ""}`
        : `🧭 <strong>Keep going.</strong> One correct option is:<br><strong>${escapeHtml(prettySentence(target))}</strong><br>${q.why || ""}`;
      wrap.appendChild(fb);
      enableNext(wrap);
      check.disabled = true;
    });

    wrap.appendChild(tiles);
    wrap.appendChild(slot);
    wrap.appendChild(actions);

    const prompt = $(".cp-prompt", wrap);
    if(prompt) prompt.textContent = q.prompt || "Put the words in order.";
  }

  function renderMatch(q, wrap, state){
    // pairs: [term, definition]
    const pairs = (q.pairs || []).slice(0, 6);
    const terms = shuffle(pairs.map(p => p[0]));
    const defs = pairs.map(p => p[1]);

    const drag = document.createElement("div");
    drag.className = "cp-drag";

    const tiles = document.createElement("div");
    tiles.className = "cp-tiles";
    terms.forEach(term => {
      const t = document.createElement("div");
      t.className = "cp-tile";
      t.textContent = term;
      t.draggable = true;
      t.addEventListener("dragstart", (ev) => {
        ev.dataTransfer.setData("text/plain", term);
      });
      tiles.appendChild(t);
    });

    const slotsWrap = document.createElement("div");
    slotsWrap.style.display = "grid";
    slotsWrap.style.gap = ".6rem";

    const placed = {}; // def -> term
    defs.forEach(def => {
      const row = document.createElement("div");
      row.className = "cp-slot";
      row.innerHTML = `<div><strong>${escapeHtml(def)}</strong></div><div class="cp-drop" data-def="${escapeHtml(def)}">Drop</div>`;
      const drop = $(".cp-drop", row);
      drop.addEventListener("dragover", (ev) => ev.preventDefault());
      drop.addEventListener("drop", (ev) => {
        ev.preventDefault();
        const term = ev.dataTransfer.getData("text/plain");
        if(!term) return;
        placed[def] = term;
        drop.textContent = term;
        drop.classList.add("filled");
      });
      slotsWrap.appendChild(row);
    });

    drag.appendChild(tiles);
    drag.appendChild(slotsWrap);
    wrap.appendChild(drag);

    const actions = document.createElement("div");
    actions.className = "cp-actions";
    const reset = document.createElement("button");
    reset.className = "cp-btn";
    reset.type = "button";
    reset.textContent = "Reset";
    const check = document.createElement("button");
    check.className = "cp-btn primary";
    check.type = "button";
    check.textContent = "Check";
    actions.appendChild(reset);
    actions.appendChild(check);
    wrap.appendChild(actions);

    reset.addEventListener("click", () => {
      for(const k of Object.keys(placed)) delete placed[k];
      $$("[data-def]", wrap).forEach(d => {
        d.textContent = "Drop";
        d.classList.remove("filled","good","bad");
      });
      const fb = $(".cp-feedback", wrap);
      if(fb) fb.remove();
      check.disabled = false;
    });

    check.addEventListener("click", () => {
      let correct = 0;
      defs.forEach(def => {
        const term = placed[def];
        const pair = pairs.find(p => p[1] === def);
        const ok = term && pair && term === pair[0];
        const drop = $(`[data-def="${cssEscape(def)}"]`, wrap);
        if(drop){
          drop.classList.add(ok ? "good" : "bad");
        }
        if(ok) correct += 1;
      });

      const okAll = correct === defs.length;

      recordAnswer(state, q, okAll, false);

      const fb = document.createElement("div");
      fb.className = "cp-feedback";
      fb.innerHTML = okAll
        ? `✅ <strong>Perfect match!</strong> ${q.why || ""}`
        : `🧭 <strong>Good effort.</strong> You matched ${correct}/${defs.length}. Check the highlighted ones and try again.`;
      wrap.appendChild(fb);
      enableNext(wrap);
      check.disabled = true;
    });
  }

  function cssEscape(s){
    // minimal escape for attribute selectors
    return String(s).replace(/"/g, '\\"');
  }

  // ---------- FLASHCARDS ----------
  function renderFlashcards(deck, mount){
    const cards = deck.slice();
    let idx = 0;
    let known = 0;
    let unsure = 0;
    const order = shuffle(cards);

    mount.innerHTML = `
      <div class="cp-card" style="margin-top:1rem;">
        <div class="cp-kicker">🃏 Flashcards</div>
        <h3>Quick wins for confidence</h3>
        <p class="cp-mini">Flip the card. Use “I know it” / “Not sure” to track your confidence.</p>

        <div class="cp-divider"></div>

        <div id="fcCard" class="cp-q"></div>

        <div class="cp-actions" style="margin-top:1rem;">
          <button class="cp-btn" id="fcFlip">Flip</button>
          <button class="cp-btn primary" id="fcListen">🔊 Listen</button>
          <button class="cp-btn good" id="fcKnow">I know it</button>
          <button class="cp-btn warn" id="fcUnsure">Not sure</button>
          <button class="cp-btn ghost" id="fcStop">Stop</button>
        </div>

        <div class="cp-badges" style="margin-top:.75rem;">
          <span class="cp-badge" id="fcCount">1/${order.length}</span>
          <span class="cp-badge" id="fcKnown">Known: 0</span>
          <span class="cp-badge" id="fcUns">Not sure: 0</span>
        </div>
      </div>
    `;

    const cardEl = $("#fcCard", mount);
    let showingBack = false;

    function render(){
      const c = order[idx];
      if(!c){
        mount.innerHTML = `<div class="cp-feedback">No flashcards found.</div>`;
        return;
      }
      const face = showingBack ? c.back : c.front;
      cardEl.innerHTML = `
        <div class="cp-mini"><strong>Card</strong></div>
        <h3>${showingBack ? "Answer" : "Prompt"}</h3>
        <div class="cp-reading" style="margin:0;">${face}</div>
      `;
      $("#fcCount", mount).textContent = `${idx+1}/${order.length}`;
      $("#fcKnown", mount).textContent = `Known: ${known}`;
      $("#fcUns", mount).textContent = `Not sure: ${unsure}`;
    }

    function next(){
      showingBack = false;
      idx += 1;
      if(idx >= order.length){
        mount.innerHTML = `
          <div class="cp-card" style="margin-top:1rem;">
            <div class="cp-kicker">🏁 Flashcards complete</div>
            <h3>Nice work.</h3>
            <div class="cp-badges">
              <span class="cp-badge">Known: ${known}</span>
              <span class="cp-badge">Not sure: ${unsure}</span>
            </div>
            <div class="cp-divider"></div>
            <div class="cp-actions">
              <button class="cp-btn primary" id="fcAgain">Run again (shuffle)</button>
            </div>
          </div>
        `;
        $("#fcAgain", mount).addEventListener("click", () => renderFlashcards(deck, mount));
        return;
      }
      render();
    }

    $("#fcFlip", mount).addEventListener("click", () => {
      showingBack = !showingBack;
      render();
    });
    $("#fcListen", mount).addEventListener("click", () => {
      const c = order[idx];
      const txt = c?.say || "";
      const res = speak(txt);
      if(!res.ok) alert(res.reason);
    });
    $("#fcKnow", mount).addEventListener("click", () => { known += 1; next(); });
    $("#fcUnsure", mount).addEventListener("click", () => { unsure += 1; next(); });
    $("#fcStop", mount).addEventListener("click", () => { mount.innerHTML = `<div class="cp-feedback">Flashcards stopped. Come back anytime.</div>`; });

    render();
    try{ if(window.twemoji) window.twemoji.parse(mount); }catch{}
  }

  // ---------- INIT ----------
  renderActiveTab();
})();