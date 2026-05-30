/* SpeakEasyTisha — English 360° Exam Topics Add‑On
   No external libraries • tap-friendly • Mac/iPad Safari compatible */
(() => {
  'use strict';

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const pad2 = (n) => String(n).padStart(2,'0');
  const fmtTime = (sec) => `${pad2(Math.floor(sec/60))}:${pad2(sec%60)}`;
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  };
  const escapeHtml = (s) => (s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const toast = (msg) => {
    let el = $('#toast');
    if(!el){
      el = document.createElement('div');
      el.id = 'toast';
      el.style.position = 'fixed';
      el.style.left = '16px';
      el.style.bottom = '16px';
      el.style.padding = '10px 12px';
      el.style.background = 'rgba(0,0,0,.72)';
      el.style.border = '1px solid rgba(255,255,255,.14)';
      el.style.borderRadius = '14px';
      el.style.color = 'white';
      el.style.zIndex = '9999';
      el.style.maxWidth = '80vw';
      el.style.boxShadow = '0 14px 30px rgba(0,0,0,.35)';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.display = 'block';
    if(toast._t) clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.style.display = 'none'; }, 1600);
  };

  const showErr = (msg) => {
  const box = document.getElementById('errBox');
  if(!box) return;
  box.hidden = false;
  box.textContent = '⚠️ ' + msg;
};
window.addEventListener('error', (e) => {
  try{ showErr((e && e.message) ? e.message : String(e)); }catch(_){}
});
window.addEventListener('unhandledrejection', (e) => {
  try{ showErr((e && e.reason) ? String(e.reason) : 'Unhandled promise rejection'); }catch(_){}
});

const safeOn = (id, ev, fn) => {
  const el = document.getElementById(id);
  if(!el) { showErr('Missing element: #' + id); return; }
  el.addEventListener(ev, (evt) => { try{ fn(evt); }catch(err){ showErr(String(err)); } });
};

const state = {
    level: 'A2',
    fr: false,
    accent: 'US',
    rate: 1.0,
    score: { correct: 0, total: 0 },
    timers: { speak:null, prod:null, write:null },
    speak: { scenarioId: null, idx: 0 },
    prod: { promptId: null },
  };

  const PREF_KEY = 'se_english360_exam_topics_addon_v1';
  const loadPrefs = () => {
    try{
      const raw = localStorage.getItem(PREF_KEY);
      if(!raw) return;
      const p = JSON.parse(raw);
      if(p && typeof p === 'object'){
        if(['A2','B1','B2'].includes(p.level)) state.level = p.level;
        state.fr = !!p.fr;
        if(['US','UK'].includes(p.accent)) state.accent = p.accent;
        if(typeof p.rate === 'number') state.rate = clamp(p.rate, 0.7, 1.25);
      }
    }catch(e){ /* ignore */ }
  };
  const savePrefs = () => {
    try{
      localStorage.setItem(PREF_KEY, JSON.stringify({
        level: state.level, fr: state.fr, accent: state.accent, rate: state.rate
      }));
    }catch(e){ /* ignore */ }
  };

  // ---------- TTS ----------
  let voices = [];
  const loadVoices = () => {
    try{ voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }
    catch(e){ voices = []; }
  };
  const pickVoice = () => {
    if(!voices || !voices.length) return null;
    const wants = state.accent === 'UK' ? ['en-GB','United Kingdom','UK'] : ['en-US','United States','US'];
    const v = voices.find(x => wants.some(w => (x.lang||'').includes(w) || (x.name||'').includes(w)));
    return v || voices.find(x => (x.lang||'').startsWith('en')) || voices[0];
  };
  const speak = (text) => {
    if(!('speechSynthesis' in window) || !text) return;
    try{
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = state.rate;
      const v = pickVoice();
      if(v) u.voice = v;
      window.speechSynthesis.speak(u);
    }catch(e){ /* ignore */ }
  };

  // ---------- Score ----------
  const updateScoreUI = () => {
    $('#scorePill').textContent = `${state.score.correct} / ${state.score.total}`;
    const acc = state.score.total ? Math.round((state.score.correct/state.score.total)*100) : 0;
    $('#acc').textContent = `${acc}%`;
  };
  const addScore = (ok) => {
    state.score.total += 1;
    if(ok) state.score.correct += 1;
    updateScoreUI();
  };
  const resetScore = () => {
    state.score.correct = 0;
    state.score.total = 0;
    updateScoreUI();
  };

  // ---------- FR toggle ----------
  const setFR = (on) => {
    state.fr = !!on;
    $('#frToggle').setAttribute('aria-pressed', state.fr ? 'true' : 'false');
    $('#frToggle').textContent = state.fr ? 'On' : 'Off';
    $$('.frOnly').forEach(el => el.style.display = state.fr ? 'block' : 'none');
    renderQuickChips();
    renderTopicCards();
    renderOpenCloseChips();
    renderUpgradeChips();
    renderConnectors();
    renderWriting();
    renderSpeaking();
    renderProduction();
    renderDetailsBox();
    renderExample();
    renderConnQuiz();
    renderMiniQuiz();
    renderMistakes();

    // JS loaded indicator (helps debugging if paths are wrong)
    const ok = document.getElementById('jsOk');
    if(ok) ok.textContent = 'JS: ready ✅ (v3)';

  };

  const setLevel = (lvl) => {
    state.level = lvl;
    $$('.segBtn[data-level]').forEach(b => b.classList.toggle('isOn', b.dataset.level === lvl));
    renderWriting();
    renderExample();
    renderSpeaking();
    renderProduction();
    savePrefs();
  };

  const setAccent = (acc) => {
    state.accent = acc;
    $$('.segBtn[data-accent]').forEach(b => b.classList.toggle('isOn', b.dataset.accent === acc));
    savePrefs();
  };

  // ---------- Timers ----------
  const stopTimer = (t) => { if(t) clearInterval(t); return null; };
  const startCountdown = (seconds, onTick, onDone) => {
    let r = seconds;
    onTick(r);
    const t = setInterval(() => {
      r -= 1;
      onTick(r);
      if(r <= 0){
        clearInterval(t);
        onDone && onDone();
      }
    }, 1000);
    return t;
  };

  // ---------- Data ----------
  const quickChips = [
    {en:"I’m writing regarding…", fr:"Je vous écris au sujet de…"},
    {en:"Could you please confirm…?", fr:"Pourriez-vous confirmer… ?"},
    {en:"Just to clarify…", fr:"Juste pour clarifier…"},
    {en:"Would it be possible to…?", fr:"Serait-il possible de… ?"},
    {en:"Please let me know the next steps.", fr:"Merci de me dire la suite."},
    {en:"Thank you in advance for your help.", fr:"Merci d’avance pour votre aide."},
  ];

  const topicCards = [
    {t:"Request information / specifications", b:"Ask for price, what’s included, times, accessibility, and confirmation by email.", fr:"Demander prix, inclusions, horaires, accessibilité, confirmation."},
    {t:"Reschedule / change dates", b:"Explain the reason briefly, propose new dates, ask for options.", fr:"Expliquer la raison, proposer de nouvelles dates, demander des options."},
    {t:"Complaint + solution", b:"Describe the issue, what you tried, request a fix / room change / discount.", fr:"Décrire le problème, ce que vous avez essayé, demander solution."},
    {t:"Follow‑up / reminder", b:"No answer? Write a short polite reminder and repeat your request.", fr:"Pas de réponse ? Relance courte et polie."},
    {t:"Confirmation / final details", b:"Confirm dates, arrival time, and 1 special request. Ask one final question.", fr:"Confirmer dates, heure d’arrivée, 1 demande. Poser 1 dernière question."},
    {t:"Apology + correction", b:"Apologize for a mistake (wrong date/name) and request a change politely.", fr:"S’excuser d’une erreur (date/nom) et demander un changement poliment."},
    {t:"Lost item / luggage", b:"Give date, place, description, contact, ask for a reference number.", fr:"Date, lieu, description, contact, numéro de dossier."},
    {t:"Short story / timeline", b:"Use connectors: first, then, however, as a result, finally.", fr:"Connecteurs : d’abord, ensuite, cependant, par conséquent, enfin."},
  ];

  const openings = [
    {en:"Dear Sir or Madam,", fr:"Madame, Monsieur,"},
    {en:"Dear Reservations Team,", fr:"Chère équipe Réservations,"},
    {en:"Dear Customer Service Team,", fr:"Chère équipe Service Client,"},
    {en:"Hello,", fr:"Bonjour,"},
  ];
  const closings = [
    {en:"Kind regards,", fr:"Cordialement,"},
    {en:"Best regards,", fr:"Bien cordialement,"},
    {en:"Sincerely,", fr:"Sincèrement,"},
    {en:"Thank you for your help.", fr:"Merci pour votre aide."},
  ];

  // Writing tasks: typical categories
  const writingTasks = [
    {
      id:"hotelInfo",
      title:"Email — request hotel information/specifications (125+ words)",
      prompt:"Write an email to a hotel to request details before booking. Include dates, number of nights, total price (with taxes), what is included (breakfast/Wi‑Fi/parking), and one special request (quiet room or accessibility). Ask for confirmation by email.",
      lines:[
        "Subject: Request for information — reservation from ___ to ___",
        "I’m writing to ask for information about…",
        "Could you please confirm availability and total price (including taxes)?",
        "Could you also tell me what is included in the rate?",
        "If possible, I would like…",
        "Please confirm by email. Thank you in advance."
      ],
      template:
`Subject: Request for information — reservation from [DATE] to [DATE]

Dear Reservations Team,

I’m writing to request information before booking a room from [DATE] to [DATE] for [NUMBER] nights. Could you please confirm availability and the total price, including taxes and any extra fees?

Could you also tell me what is included in the rate (breakfast, Wi‑Fi, parking)? If possible, I would like a quiet room / step‑free access.

Please confirm by email. Thank you in advance for your help.

Kind regards,
[NAME]`,
      models:{
        A2:
`Subject: Request for information — reservation May 4–10, 2026

Dear Reservations Team,

I’m writing about a reservation from May 4 to May 10, 2026. Could you please confirm availability and the total price, including taxes?

Could you also tell me what is included in the price (breakfast, Wi‑Fi, parking)? If possible, I would like a quiet room.

Please confirm by email. Thank you in advance for your help.

Kind regards,
[NAME]`,
        B1:
`Subject: Inquiry — availability and rate for May 4–10, 2026

Dear Reservations Team,

I’m writing to request information before booking a room from May 4 to May 10, 2026 for six nights. Could you please confirm availability and the total price, including taxes and any extra fees?

Could you also clarify what is included in the rate (breakfast, Wi‑Fi, parking)? If possible, I would prefer a quiet room away from the elevator.

Please confirm by email. Thank you in advance for your help.

Best regards,
[NAME]`,
        B2:
`Subject: Request for information and inclusions — reservation May 4–10, 2026

Dear Reservations Team,

I’m writing regarding a potential reservation from May 4 to May 10, 2026. Before confirming, could you please provide the total price for the stay, including taxes and any additional fees (for example, parking fees or city tax)?

Could you also clarify what is included in the rate (breakfast, Wi‑Fi, and any other services)? If possible, I’d appreciate a quiet room not facing the street. Please confirm by email at your earliest convenience.

Thank you in advance for your assistance.

Kind regards,
[NAME]`
      }
    },
    {
      id:"followup",
      title:"Email — follow‑up / reminder (no reply) (125+ words)",
      prompt:"Write a polite follow‑up email because you have not received a reply. Repeat your request briefly and ask for an update. Include your dates and reference if you have one.",
      lines:[
        "Subject: Follow‑up — request for information (reservation ___)",
        "I’m writing to follow up on my previous email…",
        "Could you please confirm…?",
        "I would appreciate an update…",
        "Thank you for your help."
      ],
      template:
`Subject: Follow‑up — request for information (reservation [DATE]–[DATE])

Dear [TEAM],

I’m writing to follow up on my previous email sent on [DATE]. I have not received a reply yet, and I would appreciate an update.

I would like to book a room from [DATE] to [DATE] for [NUMBER] nights. Could you please confirm availability and the total price, including taxes? Could you also confirm what is included in the rate (breakfast, Wi‑Fi, parking)?

Thank you in advance for your help. I look forward to your reply.

Kind regards,
[NAME]`,
      models:{
        A2:
`Subject: Follow‑up — request for information (May 4–10, 2026)

Dear Team,

I’m writing to follow up on my previous email. I have not received a reply yet.

I would like to book a room from May 4 to May 10, 2026. Could you please confirm availability and the total price, including taxes? Could you also tell me what is included in the price (breakfast, Wi‑Fi, parking)?

Thank you in advance for your help. Please reply by email.

Kind regards,
[NAME]`,
        B1:
`Subject: Follow‑up — request for information (reservation May 4–10, 2026)

Dear Reservations Team,

I’m writing to follow up on my email sent earlier this week, as I have not received a reply yet. I would appreciate an update.

I would like to book a room from May 4 to May 10, 2026 for six nights. Could you please confirm availability and the total price including taxes? Could you also clarify what is included in the rate (breakfast, Wi‑Fi, parking)?

Thank you in advance for your help. I look forward to your reply.

Best regards,
[NAME]`,
        B2:
`Subject: Follow‑up — request for information (reservation May 4–10, 2026)

Dear Reservations Team,

I’m writing to follow up on my previous message, as I have not yet received a response. I would be grateful if you could provide an update.

I’m interested in booking a room from May 4 to May 10, 2026. Could you please confirm availability, the total price including taxes, and any additional fees? In addition, could you clarify what is included in the rate (breakfast, Wi‑Fi, parking, and other services)?

Thank you in advance for your assistance. I look forward to hearing from you.

Kind regards,
[NAME]`
      }
    },
    {
      id:"reschedule",
      title:"Email — reschedule due to delay/change (125+ words)",
      prompt:"Write an email to change your booking because of a delay or change of plans. Include your booking reference, original dates, new dates, and ask for options if not available.",
      lines:[
        "Subject: Request to reschedule — booking ___",
        "I’m writing regarding my reservation…",
        "Unfortunately, …",
        "Would it be possible to change to…?",
        "Please confirm by email."
      ],
      template:
`Subject: Request to reschedule — booking [REF]

Dear [TEAM],

I’m writing regarding my booking reference [REF]. Unfortunately, due to a delay/change of plans, I will not be able to arrive on the original dates.

Would it be possible to reschedule my reservation from [OLD DATES] to [NEW DATES]? If those dates are not available, could you please let me know what options you can offer (alternative dates or cancellation policy)?

Thank you in advance for your help. Please confirm by email.

Kind regards,
[NAME]`,
      models:{
        A2:
`Subject: Request to reschedule — booking [REF]

Dear Team,

I’m writing about my reservation from May 4 to May 10, 2026. Unfortunately, we cannot come on these dates.

Would it be possible to change the dates to May 12 to May 14, 2026? If it is not possible, could you tell me the other options, please?

Thank you in advance for your help. Please confirm by email.

Kind regards,
[NAME]`,
        B1:
`Subject: Request to reschedule — booking [REF]

Dear Customer Service Team,

I’m writing regarding my booking reference [REF]. Unfortunately, due to a change in our travel plans, we will not be able to stay on the original dates (May 4–10, 2026).

Would it be possible to reschedule the reservation to May 12–14, 2026? If those dates are not available, could you please let me know the alternative options you can offer?

Thank you in advance for your help. Please confirm by email.

Best regards,
[NAME]`,
        B2:
`Subject: Reschedule request — booking [REF] (May 4–10, 2026)

Dear Customer Service Team,

I’m writing regarding booking reference [REF]. Unfortunately, due to a change in our travel plans, we will not be able to stay from May 4 to May 10, 2026.

Would it be possible to reschedule our reservation to May 12 to May 14, 2026? If rescheduling is not available, could you please advise on alternative dates and your cancellation/modification policy?

Thank you in advance for your assistance. I look forward to your reply.

Kind regards,
[NAME]`
      }
    },
    {
      id:"complaint",
      title:"Email — complaint + solution request (125+ words)",
      prompt:"Write a polite complaint email about a problem (noise, broken shower, incorrect bill). Explain what happened, what you tried, and request a solution (fix/room change/discount).",
      lines:[
        "Subject: Issue with room ___ — request for assistance",
        "I’m writing to report an issue…",
        "Unfortunately, …",
        "Could you please…?",
        "Thank you for your help."
      ],
      template:
`Subject: Issue with room [NUMBER] — request for assistance

Dear [TEAM],

I’m writing to report an issue with my room ([NUMBER]). Unfortunately, [PROBLEM] happened on [DATE/TIME], and I was unable to [RESULT]. I tried [WHAT YOU TRIED], but it did not solve the problem.

Could you please send someone to fix it? If it can’t be fixed quickly, would it be possible to change rooms? If neither option is possible, I would appreciate a discount for the inconvenience.

Thank you in advance for your help. Please let me know the next steps.

Kind regards,
[NAME]`,
      models:{
        A2:
`Subject: Issue with room 203 — request for help

Dear Team,

I’m writing to report a problem with my room 203. Last night it was very noisy and I could not sleep. I tried to close the window, but it was still noisy.

Could you please help me? If possible, I would like to change rooms. If not, could you offer a discount?

Thank you in advance for your help. Please reply by email.

Kind regards,
[NAME]`,
        B1:
`Subject: Issue with room 203 — request for assistance

Dear Team,

I’m writing to report an issue with my room (203). Unfortunately, there was a lot of street noise last night, and I couldn’t sleep. I tried closing the window and using earplugs, but it didn’t solve the problem.

Could you please check the issue? If it can’t be fixed quickly, would it be possible to change rooms? If not, I would appreciate a discount for the inconvenience.

Thank you in advance for your help. Please let me know what you can do.

Best regards,
[NAME]`,
        B2:
`Subject: Issue with room 203 — request for assistance

Dear Front Desk Team,

I’m writing to report an issue with my room (203). Unfortunately, there was significant noise last night and I was unable to sleep. I tried closing the windows and using earplugs, but the problem continued.

Could you please investigate the situation? If it cannot be resolved quickly, would it be possible to move to a quieter room? If a room change is not available, I would appreciate a gesture of goodwill such as a discount, given the inconvenience.

Thank you in advance for your assistance. I look forward to your reply.

Kind regards,
[NAME]`
      }
    },
    {
      id:"lost",
      title:"Email — lost item / lost luggage inquiry (125+ words)",
      prompt:"Write an email about a lost item or missing luggage. Include date, place, description (size/color/brand), reference if you have it, contact details. Ask for a reference number and next steps.",
      lines:[
        "Subject: Lost item inquiry — ___ on ___",
        "I’m writing regarding a lost item…",
        "It was last seen…",
        "It is described as…",
        "Could you provide a reference number?",
        "Please let me know the next steps."
      ],
      template:
`Subject: Lost item inquiry — [ITEM] on [DATE]

Dear [Lost and Found / Customer Service Team],

I’m writing regarding a lost item / missing luggage. I last saw it on [DATE] at [PLACE] (for example, the lobby / baggage belt / train).

The item is described as follows: [SIZE], [COLOR], [BRAND], with [DISTINCTIVE DETAIL]. If needed, my booking/flight reference is [REF].

Could you please check if the item has been found? If possible, could you provide a reference number for my request and let me know the next steps?

You can reach me at [PHONE] or [EMAIL]. Thank you in advance for your help.

Kind regards,
[NAME]`,
      models:{
        A2:
`Subject: Lost item inquiry — suitcase on 5 May

Dear Team,

I’m writing because my luggage is missing. I last saw it on 5 May at the airport baggage belt. It is a medium black suitcase with a red tag.

Could you please check if it has been found? Could you give me a reference number, please?

You can contact me by email or phone. Thank you in advance for your help.

Kind regards,
[NAME]`,
        B1:
`Subject: Lost item inquiry — suitcase on 5 May

Dear Lost and Found Team,

I’m writing because my luggage is missing. I last saw it on 5 May at the baggage belt at the airport. It is a medium black suitcase with a red tag and a name label.

Could you please check if it has been found? If possible, could you provide a reference number and tell me the next steps?

You can contact me by email or phone. Thank you in advance for your help.

Best regards,
[NAME]`,
        B2:
`Subject: Lost luggage inquiry — 5 May (reference request)

Dear Lost and Found Team,

I’m writing regarding missing luggage that did not arrive on 5 May. I last saw it at the airport baggage belt, and it has not appeared since.

The suitcase is a medium black hard-shell case with a red tag and a name label. If needed, my flight/booking reference is [REF].

Could you please check whether it has been found and provide a reference number for my request? I would also appreciate your guidance on the next steps and expected timeline.

You can reach me at [PHONE] or [EMAIL]. Thank you in advance for your assistance.

Kind regards,
[NAME]`
      }
    },
    {
      id:"story",
      title:"Story — travel mishap timeline (125+ words)",
      prompt:"Write a short story about a travel problem you solved. Use a clear timeline: first → then → after that → however → finally. Use at least 5 connectors.",
      lines:[
        "First, …",
        "Then, …",
        "After that, …",
        "However, …",
        "Finally, …"
      ],
      template:
`First, I arrived at the station early because I wanted to be on time. Then I realized my phone battery was almost empty, and I needed my ticket on my phone. After that, I asked a staff member for help and found a charging point. However, the train started boarding earlier than expected, so I had to hurry. Finally, I managed to show my ticket and board the train. As a result, I learned to stay calm and always carry a charger.`,
      models:{
        A2:
`First, I went to the train station for my holiday. Then I saw that my train was cancelled. I was worried because I had a hotel reservation. After that, I went to the information desk and asked for another train. However, the next train was later and I had to wait. Finally, the staff changed my ticket and I arrived in the evening. As a result, I was tired but relieved.`,
        B1:
`First, I arrived at the station early because I didn’t want to miss my train. Then I saw on the screen that my train was cancelled. I felt stressed because I had a hotel reservation. After that, I went to the information desk and asked for an alternative. However, the next option had a connection, so I needed to move quickly. Finally, I boarded a later train and arrived a few hours late, but everything worked out.`,
        B2:
`First, I arrived at the station early because I wanted a smooth start to my trip. Then I noticed on the departures board that my train had been cancelled due to a technical issue. After that, I went straight to the information desk and asked about the fastest alternative. However, the suggested route included a short connection, so I needed to change platforms quickly. Finally, I boarded the replacement train and arrived a few hours late, but I avoided losing my hotel booking. As a result, the rest of the trip was saved.`
      }
    },
  ];

  // Email library selector maps to writing tasks
  const exampleIds = writingTasks.map(t => t.id);

  // Mini quiz for writing micro-skills
  const miniQuizBank = [
    {
      q:"Choose the BEST apology line for a mistake in dates.",
      options:[
        "I am agree, it is my fault.",
        "I’m sorry for the confusion, but I noticed a mistake in my booking.",
        "You made a mistake.",
        "I want change now."
      ],
      a:1,
      why:"Polite apology + clear reason."
    },
    {
      q:"Choose the BEST subject line for asking a hotel for inclusions and price.",
      options:[
        "Hi!!! Need room now",
        "Request for information — reservation May 4–10, 2026",
        "Question",
        "Hotel"
      ],
      a:1,
      why:"Clear purpose + dates."
    },
    {
      q:"Choose the BEST opening for a formal email.",
      options:["Hey guys,","Dear Reservations Team,","Yo,","Hi friend,"],
      a:1,
      why:"Professional greeting."
    },
    {
      q:"Choose the BEST polite request line.",
      options:["Send me the details.","Could you please confirm what is included in the rate?","Details now.","I want details."],
      a:1,
      why:"Could you + please is safe and polite."
    },
    {
      q:"Choose the BEST closing for a formal email.",
      options:["Bye!","Kind regards,","See ya!","XOXO"],
      a:1,
      why:"Standard polite closing."
    },
  ];

  // Mistake scan
  const mistakeRules = [
    {re:/\binformations\b/ig, msg:"“Information” is uncountable (no -s).", fr:"“Information” est indénombrable (pas de -s)."},
    {re:/\badvices\b/ig, msg:"“Advice” is uncountable (no -s).", fr:"“Advice” est indénombrable."},
    {re:/\bI am agree\b/ig, msg:"Say: “I agree” (not *I am agree).", fr:"Dire : “I agree”."},
    {re:/\bdepend of\b/ig, msg:"Say: “depend on”.", fr:"Dire : “depend on”."},
    {re:/\bexplain me\b/ig, msg:"Say: “explain to me”.", fr:"Dire : “explain to me”."},
    {re:/\bI look forward to hear\b/ig, msg:"Say: “I look forward to hearing…”.", fr:"Dire : “I look forward to hearing…”."},
  ];

  // Speaking interaction scenarios (typical themes, travel/hospitality)
  const speakScenarios = [
    {
      id:"hotel",
      title:"Hotel — booking + special request",
      questions:[
        "Good afternoon. How can I help you?",
        "What dates would you like to book, and how many nights?",
        "Would you like to know what is included in the rate?",
        "Do you have any special requests (quiet room, accessibility)?",
        "Could you confirm your email address for the details?",
        "Is there anything else you would like to ask?"
      ],
      phrases:["I’d like to book…","Could you please confirm…?","What is included…?","If possible, …","Just to clarify…","Thank you in advance."],
      models:{
        A2:"Hello. I’d like to book from May 4 to May 10. Could you confirm the total price and what is included, please? If possible, I would like a quiet room. Thank you.",
        B1:"Good afternoon. I’d like to book from May 4 to May 10. Could you please confirm the total price including taxes and tell me what is included (breakfast, Wi‑Fi, parking)? If possible, I would prefer a quiet room. Thank you.",
        B2:"Good afternoon. I’m calling about a booking from May 4 to May 10. Could you confirm the total price including taxes and any additional fees, and clarify what is included in the rate? If possible, I’d appreciate a quiet room away from the elevator. Thank you in advance."
      }
    },
    {
      id:"tour",
      title:"Tour — ask for specifications",
      questions:[
        "Hello. Which tour are you interested in?",
        "What date would you like to book?",
        "What details do you need before booking?",
        "Do you need accessibility or special assistance?",
        "Would you like the information by email?",
        "Would you like to book now?"
      ],
      phrases:["I’m interested in…","Could you provide the details?","How long does it last?","What is included?","Is it accessible?","Please email me."],
      models:{
        A2:"Hello. I’m interested in the city tour on Saturday. Could you tell me how long it is and what is included? Is it accessible? Please send details by email. Thank you.",
        B1:"Hi. I’m interested in the city tour on Saturday. Could you provide the specifications: duration, meeting point, language, and what is included? I also need to check accessibility. Please send the details by email. Thank you.",
        B2:"Hello. I’m interested in the city tour on Saturday. Could you provide the specifications—duration, meeting point, language options, inclusions, and cancellation policy? I’d also like to confirm accessibility. Please email the details. Thank you in advance."
      }
    },
    {
      id:"delay",
      title:"Transport — delay + reschedule",
      questions:[
        "Hello. What seems to be the problem?",
        "Can you tell me your booking reference?",
        "How long is the delay?",
        "What new dates do you prefer?",
        "Would you like to know your options (change/refund)?",
        "Could I confirm your email address?"
      ],
      phrases:["My train/flight is delayed.","My booking reference is…","Would it be possible to…?","If not, what are the options?","Please confirm by email.","Thank you for your help."],
      models:{
        A2:"Hello. My train is delayed. My booking reference is AB123. Would it be possible to change my reservation to May 12–14? If not, what are the options? Thank you.",
        B1:"Hi. My booking reference is AB123 and my train is delayed. I’d like to reschedule to May 12–14. If that’s not possible, could you let me know the options? Please send details by email. Thank you.",
        B2:"Hello. My booking reference is AB123, and my train has been delayed. I’d like to reschedule my reservation to May 12–14. If those dates are not available, could you advise the alternatives and your cancellation/modification policy? Please confirm by email. Thank you."
      }
    },
    {
      id:"complaint",
      title:"Hotel — complaint + solution",
      questions:[
        "Hello. How can I help you today?",
        "What is the issue with your room?",
        "When did it happen?",
        "What have you tried already?",
        "What solution would you prefer?",
        "Could you confirm your room number and name?"
      ],
      phrases:["There is an issue with…","Unfortunately, …","I tried…","Could someone fix it, please?","Could I change rooms?","Thank you."],
      models:{
        A2:"Hello. There is a problem with my room. It was noisy last night. I tried to close the window but it was still noisy. Could I change rooms, please? Thank you.",
        B1:"Hi. I’m calling about an issue with my room. There was a lot of noise last night and I couldn’t sleep. I tried closing the window and using earplugs. Could you move me to a quieter room, please? Thank you.",
        B2:"Hello. I’m calling about an issue with my room. Unfortunately, there was significant noise last night and I was unable to sleep. I tried closing the windows and using earplugs, but it didn’t help. Could you move me to a quieter room or offer a solution? Thank you."
      }
    },
    ,
    {
      id:"confirm",
      title:"Hotel — confirm booking + final question",
      questions:[
        "Hello. How can I help you today?",
        "Could you confirm your booking reference and dates?",
        "What time do you expect to arrive?",
        "Do you have any special requests?",
        "Do you have one final question before arrival?",
        "Would you like a confirmation by email?"
      ],
      phrases:["I’m calling to confirm…","My booking reference is…","I expect to arrive at…","If possible, I would like…","One final question: …","Thank you in advance."],
      models:{
        A2:"Hello. I’m calling to confirm my reservation. My booking reference is AB123. I expect to arrive at 6 pm. If possible, I would like a quiet room. One final question: is late check‑in possible? Thank you.",
        B1:"Good afternoon. I’m calling to confirm my reservation (AB123) from May 4 to May 10. I expect to arrive around 6 pm. If possible, I would prefer a quiet room. One final question: could you confirm your late check‑in policy? Thank you.",
        B2:"Good afternoon. I’m calling to confirm my reservation (AB123) and to ask one final question. I expect to arrive around 6 pm, and I’d appreciate a quiet room if possible. Could you please confirm the late check‑in procedure in case our arrival is delayed? Thank you in advance."
      }
    },
    {
      id:"apology",
      title:"Customer service — apologize and request a correction",
      questions:[
        "Hello. How can I help you?",
        "What is your booking reference?",
        "What is the mistake in the booking?",
        "What correction do you need?",
        "If we cannot change it, what would you like to do?",
        "Would you like confirmation by email?"
      ],
      phrases:["I’m sorry for the confusion…","I made a mistake with…","Could you please update…?","Would it be possible to…?","If not, what options are available?","Thank you for your help."],
      models:{
        A2:"Hello. I’m sorry for the confusion. My booking reference is AB123. I made a mistake with the dates. Could you please change it to May 12–14? If not, what options are available? Thank you.",
        B1:"Hi. I’m sorry for the confusion. My booking reference is AB123. I accidentally entered the wrong dates. Could you please update it to May 12–14? If it’s not possible, could you tell me the options? Thank you.",
        B2:"Hello. I’m sorry for the confusion. My booking reference is AB123, and I noticed an error in the dates. Could you please update the reservation to May 12–14? If changing the dates isn’t possible, could you advise on the alternatives and your policy? Thank you."
      }
    }
  ];

  // Speaking production prompts
  const prodPrompts = [
    {
      id:"specs",
      title:"Explain what you need before booking (1 minute)",
      text:"You want to book a hotel or tour. Explain what details you need before booking: total price, what is included, times/meeting point, accessibility, and confirmation by email.",
      builder:[
        ["Purpose","Before booking, I’d like to confirm a few details."],
        ["Price","Could you confirm the total price, including taxes?"],
        ["Inclusions","Could you tell me what is included (breakfast/Wi‑Fi/parking)?"],
        ["Accessibility","I’d also like to confirm accessibility / special requests."],
        ["Close","Please send the details by email. Thank you in advance."]
      ],
      models:{
        A2:"Before booking, I’d like to confirm a few details. Could you confirm the total price, including taxes? Could you tell me what is included, like breakfast, Wi‑Fi, and parking? If possible, I would like a quiet room. Please send the details by email. Thank you.",
        B1:"Before booking, I’d like to confirm a few details. Could you please confirm the total price including taxes and any extra fees? Could you also clarify what is included in the rate (breakfast, Wi‑Fi, parking)? In addition, I’d like to confirm a quiet room or accessibility. Please send the details by email. Thank you in advance.",
        B2:"Before confirming my booking, I’d like to clarify a few points. Could you confirm the total price including taxes and any additional fees, and specify what is included in the rate (breakfast, Wi‑Fi, parking, and other services)? If possible, I’d appreciate a quiet room and I’d like to confirm accessibility. Please email the details at your earliest convenience. Thank you in advance."
      }
    },
    {
      id:"mishap",
      title:"Tell a short travel mishap story (1 minute)",
      text:"Tell a short story about a travel problem you solved. Use 5 connectors (first, then, however, as a result, finally).",
      builder:[
        ["Start","First… Then…"],
        ["Problem","However, there was an issue…"],
        ["Action","So I… For example…"],
        ["Result","As a result…"],
        ["Close","Finally…"]
      ],
      models:{
        A2:"First, I went to the station. Then I saw my train was cancelled. However, I asked the staff for help. As a result, they changed my ticket to another train. Finally, I arrived late but I arrived.",
        B1:"First, I arrived at the station early. Then I saw that my train was cancelled. However, I went to the information desk and asked for an alternative. As a result, they changed my ticket and explained the new platform. Finally, I arrived a few hours late, but everything worked out.",
        B2:"First, I arrived early because I wanted to avoid problems. Then I noticed my train had been cancelled. However, I went straight to the information desk and asked about the fastest alternative. As a result, I changed my ticket to a different route and confirmed the platform. Finally, I arrived later than planned, but I saved the trip by staying calm and asking clear questions."
      }
    },
    {
      id:"complain",
      title:"Explain a polite complaint (1 minute)",
      text:"Describe a problem at a hotel (noise or broken shower). Explain what happened, what you tried, and what solution you request. Keep it polite.",
      builder:[
        ["Issue","Unfortunately, there was an issue with…"],
        ["When","It happened last night / this morning…"],
        ["Tried","I tried… but…"],
        ["Request","Could you please… / Would it be possible to…"],
        ["Close","Thank you for your help."]
      ],
      models:{
        A2:"Unfortunately, there was a problem with my room. It was very noisy last night. I tried to close the window, but it was still noisy. Could I change rooms, please? Thank you for your help.",
        B1:"Unfortunately, there was an issue with my room last night. There was a lot of street noise and I couldn’t sleep. I tried closing the window and using earplugs, but it didn’t help. Could you move me to a quieter room, please? Thank you.",
        B2:"Unfortunately, there was an issue with my room last night, as there was significant street noise and I was unable to sleep. I tried closing the windows and using earplugs, but the problem continued. Could you move me to a quieter room, or offer an alternative solution? Thank you in advance for your help."
      }
    },
  ];

  // Connector bank + quiz
  const connectors = [
    {en:"First,", fr:"D’abord,"},
    {en:"Then,", fr:"Ensuite,"},
    {en:"After that,", fr:"Après ça,"},
    {en:"However,", fr:"Cependant,"},
    {en:"For example,", fr:"Par exemple,"},
    {en:"Because", fr:"Parce que"},
    {en:"As a result,", fr:"Par conséquent,"},
    {en:"Finally,", fr:"Enfin,"},
    {en:"In addition,", fr:"De plus,"},
    {en:"Overall,", fr:"Globalement,"},
  ];

  const connQuizBank = [
    {q:"Choose the best connector for a result: I missed my train. ___ I arrived late.", options:["For example,","As a result,","However,","First,"], a:1, why:"As a result shows consequence."},
    {q:"Choose the best connector for contrast: The hotel was nice. ___ the room was noisy.", options:["Finally,","However,","Because","Then,"], a:1, why:"However shows contrast."},
    {q:"Choose the best connector for an example: I asked about inclusions. ___ I asked about parking.", options:["For example,","As a result,","Finally,","However,"], a:0, why:"For example introduces an example."},
  ];

  // Generator details
  const genScenarios = [
    {id:"hotelInfo", name:"Hotel — request info/specs"},
    {id:"confirm", name:"Confirmation — final details"},
    {id:"apology", name:"Apology — correction/change"},
    {id:"followup", name:"Hotel — follow‑up reminder"},
    {id:"reschedule", name:"Reschedule — change dates"},
    {id:"complaint", name:"Complaint — request solution"},
    {id:"lost", name:"Lost item / luggage"},
  ];

  
  const subjectBank = {
    hotelInfo: [
      "Request for information — reservation [DATE]–[DATE]",
      "Inquiry: availability and rate for [DATE]–[DATE]",
      "Questions before booking — inclusions and total price"
    ],
    confirm: [
      "Confirmation — reservation [REF] ([DATE]–[DATE])",
      "Confirming booking details — reference [REF]",
      "Final details before arrival — reservation [REF]"
    ],
    followup: [
      "Follow‑up — request for information (reservation [DATE]–[DATE])",
      "Reminder: inquiry about reservation [DATE]–[DATE]",
      "Follow‑up request — availability and inclusions"
    ],
    reschedule: [
      "Request to reschedule — booking [REF]",
      "Change of dates — reservation [REF]",
      "Update requested — new dates for booking [REF]"
    ],
    complaint: [
      "Issue with room [NUMBER] — request for assistance",
      "Complaint — request for solution (room [NUMBER])",
      "Request for resolution — stay [DATE]–[DATE]"
    ],
    lost: [
      "Lost item inquiry — [ITEM] on [DATE]",
      "Lost luggage — request for assistance / reference",
      "Follow‑up: lost and found — details attached"
    ],
    apology: [
      "Apology — correction request (booking [REF])",
      "Correction needed — booking [REF]",
      "Update request — corrected dates/details (ref. [REF])"
    ],
    story: [
      "Travel incident report — timeline and outcome",
      "Travel story — what happened and how it was solved",
      "Trip summary — problem and solution"
    ]
  };

  const upgradeChips = [
    {en:"I’m writing regarding…", fr:"Je vous écris au sujet de…"},
    {en:"Before confirming, could you please…", fr:"Avant de confirmer, pourriez-vous…"},
    {en:"Could you clarify what is included in the rate?", fr:"Pouvez-vous préciser ce qui est inclus ?"},
    {en:"If possible, I’d appreciate…", fr:"Si possible, j’apprécierais…"},
    {en:"Could you confirm the total price, including taxes and any fees?", fr:"Pouvez-vous confirmer le prix total, taxes et frais inclus ?"},
    {en:"Please let me know the next steps / expected timeline.", fr:"Merci de me dire la suite / le délai."},
    {en:"I look forward to your reply.", fr:"Dans l’attente de votre réponse."}
  ];
const sample = {
    hotels:["Seaview Hotel","Riverside Inn","Grand Plaza","Lakeside Resort"],
    cities:["Dublin","Edinburgh","Barcelona","Lisbon","London"],
    items:["black suitcase","blue backpack","wallet","phone","jacket"],
    refs:["AB123","ZX908","H45K2","RES-7712","BK-2041"],
    names:["Alex Martin","S. Dupont","M. Lambert","J. Kelly","T. Brown"],
  };

  // ---------- Rendering ----------
  const renderQuickChips = () => {
    const host = $('#quickChips');
    host.innerHTML = '';
    quickChips.forEach(c => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.innerHTML = `${escapeHtml(c.en)}${state.fr ? `<span class="sub">${escapeHtml(c.fr)}</span>` : ''}`;
      b.addEventListener('click', () => speak(c.en));
      host.appendChild(b);
    });
  };

  const renderTopicCards = () => {
    const host = $('#topicCards');
    host.innerHTML = '';
    topicCards.forEach(x => {
      const div = document.createElement('div');
      div.className = 'panel';
      div.innerHTML = `
        <div class="miniTitle">Topic</div>
        <div style="font-weight:900;">${escapeHtml(x.t)}</div>
        <div class="tiny muted" style="margin-top:6px; line-height:1.55;">${escapeHtml(x.b)}</div>
        ${state.fr ? `<div class="tiny muted frOnly" style="display:block; margin-top:8px; line-height:1.55;">${escapeHtml(x.fr)}</div>` : ''}
      `;
      host.appendChild(div);
    });
  };

  const renderOpenCloseChips = () => {
    const oHost = $('#openingChips');
    const cHost = $('#closingChips');
    oHost.innerHTML = '';
    cHost.innerHTML = '';
    openings.forEach(x => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.innerHTML = `${escapeHtml(x.en)}${state.fr ? `<span class="sub">${escapeHtml(x.fr)}</span>` : ''}`;
      b.addEventListener('click', () => speak(x.en));
      oHost.appendChild(b);
    });
    closings.forEach(x => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.innerHTML = `${escapeHtml(x.en)}${state.fr ? `<span class="sub">${escapeHtml(x.fr)}</span>` : ''}`;
      b.addEventListener('click', () => speak(x.en));
      cHost.appendChild(b);
    });
  };

  // Writing
  const fillWriteSelector = () => {
    const sel = $('#writeTask');
    sel.innerHTML = '';
    writingTasks.forEach(t => {
      const o = document.createElement('option');
      o.value = t.id;
      o.textContent = t.title;
      sel.appendChild(o);
    });
    sel.value = writingTasks[0].id;
  };
  const currentWriteTask = () => writingTasks.find(t => t.id === $('#writeTask').value) || writingTasks[0];

  const updateWordCount = () => {
    const txt = ($('#studentText').value || '').trim();
    const words = txt ? txt.split(/\s+/).filter(Boolean).length : 0;
    $('#wordCount').textContent = String(words);
  };

  const renderMistakes = () => {
    const box = $('#mistakeBox');
    const text = ($('#studentText').value || '');
    if(!text.trim()){
      box.innerHTML = `<div class="tiny muted">Write some text to see a quick checklist.</div>`;
      return;
    }
    const hits = [];
    mistakeRules.forEach(rule => {
      rule.re.lastIndex = 0;
      if(rule.re.test(text)) hits.push(rule);
    });
    if(!hits.length){
      box.innerHTML = `<div class="tiny muted">✅ No common patterns detected in this list.</div>`;
      return;
    }
    box.innerHTML = `
      <div class="tiny muted">Possible issues to check:</div>
      <ul class="bullets mt10">
        ${hits.map(h => `<li>${escapeHtml(h.msg)}${state.fr && h.fr ? ` <span class="frOnly" style="display:inline;">(${escapeHtml(h.fr)})</span>` : ''}</li>`).join('')}
      </ul>
    `;
  };

  const renderWriting = () => {
    const t = currentWriteTask();
    $('#writePrompt').textContent = t.prompt;

    const host = $('#writeLines');
    host.innerHTML = '';
    (t.lines || []).forEach(line => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent = line;
      b.addEventListener('click', () => {
        speak(line);
        const ta = $('#studentText');
        ta.value = (ta.value ? (ta.value + "\n") : '') + line;
        ta.focus();
        updateWordCount();
        renderMistakes();

    // JS loaded indicator (helps debugging if paths are wrong)
    const ok = document.getElementById('jsOk');
    if(ok) ok.textContent = 'JS: ready ✅ (v3)';

      });
      host.appendChild(b);
    });

    fillExampleSelector();
    renderExample();
    renderMistakes();

    // JS loaded indicator (helps debugging if paths are wrong)
    const ok = document.getElementById('jsOk');
    if(ok) ok.textContent = 'JS: ready ✅ (v3)';

  };

  const copyToClipboard = async (txt, okMsg) => {
    try{ await navigator.clipboard.writeText(txt); toast(okMsg || 'Copied.'); }
    catch(e){ toast('Copy blocked. Select and copy manually.'); }
  };

  // Write timer
  const writeStart = () => {
    state.timers.write = stopTimer(state.timers.write);
    state.timers.write = startCountdown(15*60, (r) => { $('#writeTimer').textContent = fmtTime(r); },
      () => { $('#writeTimer').textContent = '00:00'; toast('Time! Quick proofread (articles + prepositions).'); });
  };
  const writeStop = () => {
    state.timers.write = stopTimer(state.timers.write);
    $('#writeTimer').textContent = '00:00';
  };

  const writeListen = () => speak(currentWriteTask().prompt);
  const clearStudent = () => { $('#studentText').value=''; updateWordCount(); renderMistakes();

    // JS loaded indicator (helps debugging if paths are wrong)
    const ok = document.getElementById('jsOk');
    if(ok) ok.textContent = 'JS: ready ✅ (v3)';
 };

  const copyTemplate = () => {
    const t = currentWriteTask();
    copyToClipboard(t.template || '', '✅ Template copied.');
  };
  const showModelWrite = () => {
    const t = currentWriteTask();
    const model = (t.models && t.models[state.level]) ? t.models[state.level] : '';
    const ta = $('#studentText');
    ta.value = ta.value.trim() ? (ta.value.trim() + "\n\n---\nMODEL (" + state.level + ")\n" + model) : model;
    ta.focus();
    updateWordCount();
    renderMistakes();

    // JS loaded indicator (helps debugging if paths are wrong)
    const ok = document.getElementById('jsOk');
    if(ok) ok.textContent = 'JS: ready ✅ (v3)';

  };

  // Mini quiz
  const renderMCQ = (host, qObj) => {
    host.innerHTML = '';
    const q = document.createElement('div');
    q.className = 'prompt';
    q.innerHTML = `<div class="miniTitle">Quick check</div><div class="promptText">${escapeHtml(qObj.q)}</div>`;
    host.appendChild(q);

    const opts = document.createElement('div');
    opts.className = 'chips mt10';
    qObj.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent = opt;
      b.addEventListener('click', () => {
        const ok = i === qObj.a;
        addScore(ok);
        $$('.chip', opts).forEach(x => x.disabled = true);
        b.style.background = ok ? 'rgba(80,255,140,.18)' : 'rgba(255,100,120,.18)';
        const why = document.createElement('div');
        why.className = 'tiny muted mt10';
        why.textContent = (ok ? '✅ Correct. ' : '❌ Not quite. ') + (qObj.why || '');
        host.appendChild(why);
      });
      opts.appendChild(b);
    });
    host.appendChild(opts);
  };

  const renderMiniQuiz = () => {
    const q = shuffle(miniQuizBank)[0];
    renderMCQ($('#miniQuiz'), q);
  };

  // Example library
  const fillExampleSelector = () => {
    const sel = $('#emailExample');
    const current = sel.value || '';
    sel.innerHTML = '';
    exampleIds.forEach(id => {
      const task = writingTasks.find(t => t.id === id);
      if(!task) return;
      const o = document.createElement('option');
      o.value = id;
      o.textContent = task.title.replace(' (125+ words)','').replace('(125+ words)','');
      sel.appendChild(o);
    });
    sel.value = current && exampleIds.includes(current) ? current : writingTasks[0].id;
  };

  const selectedExample = () => writingTasks.find(t => t.id === $('#emailExample').value) || writingTasks[0];

  
  // --- Model Email tools (Section 2) ---
  const fillModelScenario = () => {
    const sel = document.getElementById('modelScenario');
    if(!sel) return;
    const current = sel.value || '';
    sel.innerHTML = '';
    (writingTasks || []).forEach(t => {
      const o = document.createElement('option');
      o.value = t.id;
      o.textContent = t.title.replace(' (125+ words)','').replace('(125+ words)','');
      sel.appendChild(o);
    });
    sel.value = current && (writingTasks || []).some(t => t.id === current) ? current : (writingTasks[0] ? writingTasks[0].id : '');
  };

  const renderUpgradeChips = () => {
    const host = document.getElementById('upgradeChips');
    if(!host) return;
    host.innerHTML = '';
    (upgradeChips || []).forEach(c => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.innerHTML = `${escapeHtml(c.en)}${state.fr ? `<span class="sub">${escapeHtml(c.fr)}</span>` : ''}`;
      b.addEventListener('click', () => speak(c.en));
      host.appendChild(b);
    });
  };

  const getModelTask = () => {
    const sel = document.getElementById('modelScenario');
    const id = sel ? sel.value : '';
    return (writingTasks || []).find(t => t.id === id) || writingTasks[0];
  };

  const showSubjects = () => {
    const t = getModelTask();
    const lines = (subjectBank && subjectBank[t.id]) ? subjectBank[t.id] : [];
    const out = document.getElementById('subjectOut');
    if(out) out.textContent = lines.length ? lines.map(x => `• ${x}`).join('\n') : '—';
  };

  const copySubjects = () => {
    const out = document.getElementById('subjectOut');
    if(!out) return;
    const txt = out.textContent || '';
    if(txt.trim()) copyToClipboard(txt, '✅ Subjects copied.');
  };

  const showModelEmail = () => {
    const t = getModelTask();
    const out = document.getElementById('modelEmailOut');
    if(!out) return;
    const txt = (t.models && t.models[state.level]) ? t.models[state.level] : '';
    out.textContent = txt || '—';
  };

  const copyModelEmail = () => {
    const out = document.getElementById('modelEmailOut');
    if(!out) return;
    const txt = out.textContent || '';
    if(txt.trim()) copyToClipboard(txt, '✅ Model email copied.');
  };

  const sayModelEmail = () => {
    const out = document.getElementById('modelEmailOut');
    if(!out) return;
    const txt = out.textContent || '';
    speak(txt);
  };
const renderExample = () => {
    const t = selectedExample();
    const txt = (t.models && t.models[state.level]) ? t.models[state.level] : '';
    $('#exampleOut').textContent = txt || '—';
  };

  const copyExample = () => {
    const txt = $('#exampleOut').textContent || '';
    if(txt.trim()) copyToClipboard(txt, '✅ Example copied.');
  };
  const sayExample = () => {
    const txt = $('#exampleOut').textContent || '';
    speak(txt);
  };

  // Details generator
  const fillGenScenario = () => {
    const sel = $('#genScenario');
    sel.innerHTML = '';
    genScenarios.forEach(s => {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.name;
      sel.appendChild(o);
    });
    sel.value = genScenarios[0].id;
  };

  const rnd = (arr) => arr[Math.floor(Math.random()*arr.length)];
  const genDetails = () => {
    const scen = $('#genScenario').value;
    const hotel = rnd(sample.hotels);
    const city = rnd(sample.cities);
    const ref = rnd(sample.refs);
    const name = rnd(sample.names);
    const item = rnd(sample.items);
    const d1 = 4 + Math.floor(Math.random()*20);
    const d2 = d1 + 2 + Math.floor(Math.random()*5);
    const month = "May";
    const year = "2026";

    let out = `Name: ${name}\nReference: ${ref}\nCity: ${city}\nHotel/Company: ${hotel}\nDates: ${month} ${d1}–${month} ${d2}, ${year}`;
    if(scen === 'lost'){
      out += `\nLost item: ${item}\nDescription: medium / color / tag / label`;
    }
    if(scen === 'complaint'){
      out += `\nIssue: noise / broken shower / incorrect bill\nRequested solution: fix / room change / discount`;
    }
    if(scen === 'confirm'){
      out += `\nArrival time: 16:30 (example)\nSpecial request: quiet room / step‑free access\nFinal question: late check‑in? payment?`;
    }
    if(scen === 'apology'){
      out += `\nMistake: wrong dates / wrong name / wrong number of nights\nRequested change: new dates or correction`;
    }
    if(scen === 'followup'){
      out += `\nPrevious email date: ${month} ${d1-3}, ${year}`;
    }
    $('#detailOut').textContent = out;
  };

  const renderDetailsBox = () => {
    if(!$('#detailOut').textContent.trim()){
      $('#detailOut').textContent = "Click “Generate details” to get realistic dates + reference.";
    }
  };

  const copyDetails = () => {
    const txt = $('#detailOut').textContent || '';
    if(txt.trim()) copyToClipboard(txt, '✅ Details copied.');
  };

  // Speaking interaction
  const fillSpeakScenario = () => {
    const sel = $('#speakScenario');
    sel.innerHTML = '';
    speakScenarios.forEach(s => {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.title;
      sel.appendChild(o);
    });
    state.speak.scenarioId = speakScenarios[0].id;
    sel.value = state.speak.scenarioId;
    state.speak.idx = 0;
  };

  const currentSpeakScenario = () => speakScenarios.find(s => s.id === state.speak.scenarioId) || speakScenarios[0];

  const renderSpeakPhrases = () => {
    const scen = currentSpeakScenario();
    const host = $('#speakPhrases');
    host.innerHTML = '';
    (scen.phrases || []).forEach(p => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent = p;
      b.addEventListener('click', () => speak(p));
      host.appendChild(b);
    });
  };

  const renderSpeaking = () => {
    const scen = currentSpeakScenario();
    const q = scen.questions[state.speak.idx] || scen.questions[0];
    $('#speakQ').textContent = q;
    $('#speakCount').textContent = `${state.speak.idx} / 6`;
    $('#speakModel').textContent = (scen.models && scen.models[state.level]) ? scen.models[state.level] : '';
    renderSpeakPhrases();
  };

  const speakStart = () => {
    state.timers.speak = stopTimer(state.timers.speak);
    state.timers.speak = startCountdown(45, (r) => { $('#speakTimer').textContent = fmtTime(r); },
      () => { $('#speakTimer').textContent = '00:00'; toast('Stop. Repeat with 2 connectors.'); });
  };
  const speakStop = () => { state.timers.speak = stopTimer(state.timers.speak); $('#speakTimer').textContent='00:00'; };
  const speakListen = () => speak($('#speakQ').textContent || '');
  const speakNext = () => {
    state.speak.idx += 1;
    if(state.speak.idx >= 6){
      state.speak.idx = 6;
      $('#speakQ').textContent = "Done. Choose another scenario or restart.";
      $('#speakCount').textContent = "6 / 6";
      return;
    }
    renderSpeaking();
  };
  const showSpeakModel = (lvl) => {
    const scen = currentSpeakScenario();
    $('#speakModel').textContent = (scen.models && scen.models[lvl]) ? scen.models[lvl] : '';
  };

  // Speaking production
  const fillProdPrompt = () => {
    const sel = $('#prodPrompt');
    sel.innerHTML = '';
    prodPrompts.forEach(p => {
      const o = document.createElement('option');
      o.value = p.id;
      o.textContent = p.title;
      sel.appendChild(o);
    });
    state.prod.promptId = prodPrompts[0].id;
    sel.value = state.prod.promptId;
  };

  const currentProd = () => prodPrompts.find(p => p.id === $('#prodPrompt').value) || prodPrompts[0];

  const renderProduction = () => {
    const p = currentProd();
    $('#prodText').textContent = p.text;
    const host = $('#prodBuilder');
    host.innerHTML = '';
    (p.builder || []).forEach(row => {
      const div = document.createElement('div');
      div.className = 'builderRow';
      div.innerHTML = `<div class="bLbl">${escapeHtml(row[0])}</div><div class="bBox">${escapeHtml(row[1])}</div>`;
      host.appendChild(div);
    });
    $('#prodModel').textContent = (p.models && p.models[state.level]) ? p.models[state.level] : '';
  };

  const prodStart = () => {
    state.timers.prod = stopTimer(state.timers.prod);
    state.timers.prod = startCountdown(60, (r) => { $('#prodTimer').textContent = fmtTime(r); },
      () => { $('#prodTimer').textContent='00:00'; toast('Time. Add a strong closing line.'); });
  };
  const prodStop = () => { state.timers.prod = stopTimer(state.timers.prod); $('#prodTimer').textContent='00:00'; };
  const prodListen = () => speak($('#prodText').textContent || '');
  const showProdModel = (lvl) => {
    const p = currentProd();
    $('#prodModel').textContent = (p.models && p.models[lvl]) ? p.models[lvl] : '';
  };

  // Connectors
  const renderConnectors = () => {
    const host = $('#connectorChips');
    host.innerHTML = '';
    connectors.forEach(c => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.innerHTML = `${escapeHtml(c.en)}${state.fr ? `<span class="sub">${escapeHtml(c.fr)}</span>` : ''}`;
      b.addEventListener('click', () => speak(c.en.replace(',','')));
      host.appendChild(b);
    });
  };

  const renderConnQuiz = () => {
    const host = $('#connQuiz');
    const qObj = shuffle(connQuizBank)[0];
    host.innerHTML = '';
    const q = document.createElement('div');
    q.className = 'prompt';
    q.innerHTML = `<div class="miniTitle">Connector</div><div class="promptText">${escapeHtml(qObj.q)}</div>`;
    host.appendChild(q);

    const opts = document.createElement('div');
    opts.className = 'chips mt10';
    qObj.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent = opt;
      b.addEventListener('click', () => {
        const ok = i === qObj.a;
        addScore(ok);
        $$('.chip', opts).forEach(x => x.disabled = true);
        b.style.background = ok ? 'rgba(80,255,140,.18)' : 'rgba(255,100,120,.18)';
        const why = document.createElement('div');
        why.className = 'tiny muted mt10';
        why.textContent = (ok ? '✅ Correct. ' : '❌ Not quite. ') + qObj.why;
        host.appendChild(why);
        speak(opt.replace(',',''));
      });
      opts.appendChild(b);
    });
    host.appendChild(opts);
  };

  // Diff (Teacher compare) — LCS word-level
  const tokenizeWords = (s) => {
    const clean = (s || '').replace(/\s+/g,' ').trim();
    return clean ? clean.split(' ') : [];
  };
  const lcsMatrix = (a, b) => {
    const n=a.length, m=b.length;
    const limit = 450;
    if(n>limit || m>limit) return null;
    const table = Array.from({length:n+1}, () => new Uint16Array(m+1));
    for(let i=1;i<=n;i++){
      for(let j=1;j<=m;j++){
        if(a[i-1] === b[j-1]) table[i][j] = table[i-1][j-1] + 1;
        else table[i][j] = Math.max(table[i-1][j], table[i][j-1]);
      }
    }
    return table;
  };
  const buildDiff = (a, b, table) => {
    let i=a.length, j=b.length;
    const out=[];
    while(i>0 && j>0){
      if(a[i-1] === b[j-1]){ out.push({t:'same', w:a[i-1]}); i--; j--; }
      else if(table[i-1][j] >= table[i][j-1]){ out.push({t:'del', w:a[i-1]}); i--; }
      else{ out.push({t:'add', w:b[j-1]}); j--; }
    }
    while(i>0){ out.push({t:'del', w:a[i-1]}); i--; }
    while(j>0){ out.push({t:'add', w:b[j-1]}); j--; }
    out.reverse();
    const merged=[];
    out.forEach(x => {
      const last = merged[merged.length-1];
      if(last && last.t === x.t) last.w += ' ' + x.w;
      else merged.push({t:x.t, w:x.w});
    });
    return merged;
  };
  const compareTexts = () => {
    const a = tokenizeWords($('#diffStudent').value);
    const b = tokenizeWords($('#diffTeacher').value);
    const out = $('#diffOut');
    if(!b.length){
      out.innerHTML = `<div class="tiny muted">Paste a corrected version (teacher) to compare.</div>`;
      return;
    }
    const table = lcsMatrix(a, b);
    if(!table){
      out.innerHTML = `<div class="tiny muted">Text is long. Showing teacher version only.</div>
        <div class="panel mt10"><div class="miniTitle">Teacher</div><div class="model">${escapeHtml($('#diffTeacher').value)}</div></div>`;
      return;
    }
    const diff = buildDiff(a, b, table);
    out.innerHTML = diff.map(seg => `<span class="${seg.t}">${escapeHtml(seg.w)}</span>`).join(' ') || `<div class="tiny muted">No differences detected.</div>`;
  };

  const resetAll = () => {
    state.timers.speak = stopTimer(state.timers.speak);
    state.timers.prod = stopTimer(state.timers.prod);
    state.timers.write = stopTimer(state.timers.write);
    $('#speakTimer').textContent = '00:00';
    $('#prodTimer').textContent = '00:00';
    $('#writeTimer').textContent = '00:00';
    $('#studentText').value = '';
    $('#diffStudent').value = '';
    $('#diffTeacher').value = '';
    $('#diffOut').innerHTML = '';
    updateWordCount();
    renderMistakes();

    // JS loaded indicator (helps debugging if paths are wrong)
    const ok = document.getElementById('jsOk');
    if(ok) ok.textContent = 'JS: ready ✅ (v3)';

    renderMiniQuiz();
    renderConnQuiz();
    toast('Reset done.');
  };

  const newSet = () => {
    renderMiniQuiz();
    renderConnQuiz();
    genDetails();
    toast('✨ New set ready.');
  };

  // ---------- Init ----------
  const init = () => {
    loadPrefs();
    loadVoices();
    if('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;

    updateScoreUI();

    // apply prefs
    setLevel(state.level);
    setFR(state.fr);
    setAccent(state.accent);
    $('#rate').value = String(state.rate);

    // initial fill
    fillWriteSelector();
    fillExampleSelector();
    fillGenScenario();
    fillModelScenario();
    fillSpeakScenario();
    fillProdPrompt();

    // initial render
    renderQuickChips();
    renderTopicCards();
    renderOpenCloseChips();
    renderUpgradeChips();
    renderConnectors();
    renderWriting();
    renderMiniQuiz();
    renderConnQuiz();
    renderDetailsBox();
    genDetails();
    showSubjects();
    showModelEmail();
    renderSpeaking();
    renderProduction();
    renderExample();
    renderMistakes();

    // JS loaded indicator (helps debugging if paths are wrong)
    const ok = document.getElementById('jsOk');
    if(ok) ok.textContent = 'JS: ready ✅ (v3)';


    // events
    $$('.segBtn[data-level]').forEach(b => b.addEventListener('click', () => setLevel(b.dataset.level)));
    $$('.segBtn[data-accent]').forEach(b => b.addEventListener('click', () => setAccent(b.dataset.accent)));
    $('#rate').addEventListener('input', (e) => { state.rate = parseFloat(e.target.value); savePrefs(); });
    $('#frToggle').addEventListener('click', () => { setFR(!state.fr); savePrefs(); });

    $('#printBtn').addEventListener('click', () => window.print());
    $('#resetScore').addEventListener('click', resetScore);
    $('#resetAllBtn').addEventListener('click', resetAll);
    $('#newSetBtn').addEventListener('click', newSet);

    // writing
    $('#writeTask').addEventListener('change', renderWriting);
    $('#write15').addEventListener('click', writeStart);
    $('#writeStop').addEventListener('click', writeStop);
    $('#writeListen').addEventListener('click', writeListen);
    $('#studentText').addEventListener('input', () => { updateWordCount(); renderMistakes();

    // JS loaded indicator (helps debugging if paths are wrong)
    const ok = document.getElementById('jsOk');
    if(ok) ok.textContent = 'JS: ready ✅ (v3)';
 });
    $('#clearStudent').addEventListener('click', clearStudent);
    $('#copyTemplate').addEventListener('click', copyTemplate);
    $('#showModelWrite').addEventListener('click', showModelWrite);

    // mini quiz
    $('#newMiniQuiz').addEventListener('click', renderMiniQuiz);

    // example library
    $('#emailExample').addEventListener('change', renderExample);
    $('#showExample').addEventListener('click', renderExample);
    $('#copyExample').addEventListener('click', copyExample);
    $('#sayExample').addEventListener('click', sayExample);

    // generator
    // model email tools (Section 2)
    safeOn('modelScenario','change', () => { showSubjects(); showModelEmail(); });
    safeOn('showSubjects','click', showSubjects);
    safeOn('copySubjects','click', copySubjects);
    safeOn('showModelEmail','click', showModelEmail);
    safeOn('copyModelEmail','click', copyModelEmail);
    safeOn('sayModelEmail','click', sayModelEmail);

    safeOn('genScenario','change', genDetails);
    safeOn('genDetails','click', genDetails);
    safeOn('copyDetails','click', copyDetails);

    // speaking
    $('#speakScenario').addEventListener('change', (e) => {
      state.speak.scenarioId = e.target.value;
      state.speak.idx = 0;
      renderSpeaking();
    });
    $('#speakStart').addEventListener('click', speakStart);
    $('#speakStop').addEventListener('click', speakStop);
    $('#speakListen').addEventListener('click', speakListen);
    $('#speakNext').addEventListener('click', speakNext);
    $('#showSA2').addEventListener('click', () => showSpeakModel('A2'));
    $('#showSB1').addEventListener('click', () => showSpeakModel('B1'));
    $('#showSB2').addEventListener('click', () => showSpeakModel('B2'));

    // production
    $('#prodPrompt').addEventListener('change', renderProduction);
    $('#prod60').addEventListener('click', prodStart);
    $('#prodStop').addEventListener('click', prodStop);
    $('#prodListen').addEventListener('click', prodListen);
    $('#showPA2').addEventListener('click', () => showProdModel('A2'));
    $('#showPB1').addEventListener('click', () => showProdModel('B1'));
    $('#showPB2').addEventListener('click', () => showProdModel('B2'));

    // connectors quiz
    $('#newConnQuiz').addEventListener('click', renderConnQuiz);

    // compare
    $('#useCurrentDraft').addEventListener('click', () => { $('#diffStudent').value = $('#studentText').value || ''; });
    $('#clearDiffStudent').addEventListener('click', () => { $('#diffStudent').value = ''; });
    $('#clearDiffTeacher').addEventListener('click', () => { $('#diffTeacher').value = ''; });
    $('#compareBtn').addEventListener('click', compareTexts);
  };

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();