/* SpeakEasyTisha — English 360° Email + Speaking Masterclass
   No external libraries • tap-friendly • Mac/iPad Safari compatible */
(() => {
  'use strict';

  // ---------- Helpers ----------
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

  // ---------- State ----------
  const state = {
    level: 'A2',
    fr: false,
    accent: 'US',
    rate: 1.0,
    score: { correct: 0, total: 0 },
    timers: { speak:null, prod:null, write:null, session:null },
    speak: { scenarioId:null, idx:0 },
  };

  const PREF_KEY = 'se_english360_miriam_email_speaking_v1';
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
    renderExamCards();
    renderOpenCloseChips();
    renderPhraseBank();
    renderSkeleton();
    renderWriting();
    renderMistakes();
    renderFeedbackStems();
  };

  // ---------- Level & Accent ----------
  const setLevel = (lvl) => {
    state.level = lvl;
    $$('.segBtn[data-level]').forEach(b => b.classList.toggle('isOn', b.dataset.level === lvl));
    renderSkeletonModel();
    renderWriting();
    renderSpeaking();
    renderExampleEmail();
    savePrefs();
  };
  const setAccent = (acc) => {
    state.accent = acc;
    $$('.segBtn[data-accent]').forEach(b => b.classList.toggle('isOn', b.dataset.accent === acc));
    savePrefs();
  };

  // ---------- Timer helpers ----------
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
  const examCards = [
    {
      title: "Speaking — Interaction",
      time: "6 questions • 30–60s each",
      bullets: [
        "Interview / conversation style",
        "No preparation: answer directly",
        "Recorded with your microphone"
      ],
      fr: [
        "Style entretien / conversation",
        "Sans préparation : répondre directement",
        "Réponses enregistrées au micro"
      ]
    },
    {
      title: "Speaking — Production",
      time: "2 questions • 1 minute",
      bullets: [
        "Short monologue",
        "Clear structure: purpose → details → close",
        "Correct grammar beats complexity"
      ],
      fr: [
        "Mini monologue",
        "Structure claire : objectif → détails → conclusion",
        "Justesse > complexité"
      ]
    },
    {
      title: "Writing",
      time: "2 situations • 125 words each",
      bullets: [
        "Reply to an email OR describe a situation",
        "Story from an image / set of images (possible)",
        "Structure + clarity + vocabulary"
      ],
      fr: [
        "Répondre à un email OU décrire une situation",
        "Histoire à partir d’images (possible)",
        "Structure + clarté + vocabulaire"
      ]
    },
    {
      title: "Grammar/Reading/Listening",
      time: "MCQ + gap-fill + drag/drop (varies)",
      bullets: [
        "Algorithm scoring",
        "Focus on meaning + accuracy",
        "Don’t overthink—choose the clearest answer"
      ],
      fr: [
        "Score automatique",
        "Sens + précision",
        "Choisir la réponse la plus claire"
      ]
    }
  ];

  const quickChips = [
    {en:"I’m writing to ask for information about…", fr:"Je vous écris pour demander des informations sur…"},
    {en:"Could you please confirm…?", fr:"Pourriez-vous confirmer… ?"},
    {en:"Just to clarify…", fr:"Juste pour clarifier…"},
    {en:"Would it be possible to…?", fr:"Serait-il possible de… ?"},
    {en:"Thank you in advance for your help.", fr:"Merci d’avance pour votre aide."},
    {en:"I look forward to your reply.", fr:"Dans l’attente de votre réponse."}
  ];

  const subjectSituations = [
    {id:"hotelInfo", name:"Hotel — request information/specifications"},
    {id:"tourInfo", name:"Tour — request specifications"},
    {id:"reschedule", name:"Change / reschedule due to delay"},
    {id:"complaint", name:"Hotel — polite complaint + solution"},
    {id:"lost", name:"Lost item / lost luggage inquiry"}
  ];

  const subjectGenerators = {
    hotelInfo: [
      "Request for information — reservation from [DATE] to [DATE]",
      "Inquiry: availability and rate for [DATE]–[DATE]",
      "Question about booking — details and inclusions"
    ],
    tourInfo: [
      "Request for tour details — [TOUR NAME] on [DATE]",
      "Inquiry about [TOUR NAME] — specifications and accessibility",
      "Questions before booking — duration, meeting point, inclusions"
    ],
    reschedule: [
      "Request to reschedule — booking [REF] / dates",
      "Change of plans due to delay — request for options",
      "Update requested — new date/time for reservation"
    ],
    complaint: [
      "Issue with room [NUMBER] — request for assistance",
      "Complaint — noise/broken item and request for solution",
      "Request for resolution — room [NUMBER], stay [DATE]–[DATE]"
    ],
    lost: [
      "Lost item inquiry — [ITEM] on [DATE]",
      "Lost luggage — request for assistance / reference number",
      "Follow-up: lost and found — details attached"
    ]
  };

  const openings = [
    {en:"Dear Sir or Madam,", fr:"Madame, Monsieur,"},
    {en:"Dear Reservations Team,", fr:"Chère équipe Réservations,"},
    {en:"Hello,", fr:"Bonjour,"},
    {en:"Dear Customer Service Team,", fr:"Chère équipe Service Client,"},
    {en:"To whom it may concern,", fr:"À qui de droit,"}
  ];

  const closings = [
    {en:"Kind regards,", fr:"Cordialement,"},
    {en:"Best regards,", fr:"Bien cordialement,"},
    {en:"Sincerely,", fr:"Sincèrement,"},
    {en:"Thank you for your help.", fr:"Merci pour votre aide."},
    {en:"Yours faithfully,", fr:"Veuillez agréer… (très formel)"}
  ];

  const phraseBank = [
    {cat:"Requests", en:"Could you please confirm the total price, including taxes?", fr:"Pouvez-vous confirmer le prix total, taxes comprises ?", ex:"Could you please confirm the total price, including taxes and fees?"},
    {cat:"Requests", en:"Would it be possible to change the date to…?", fr:"Serait-il possible de changer la date pour… ?", ex:"Would it be possible to change the date to Friday?"},
    {cat:"Requests", en:"Could you provide the specifications (times, inclusions, accessibility)?", fr:"Pouvez-vous fournir les spécifications (horaires, inclusions, accessibilité) ?", ex:"Could you provide the specifications, including meeting point and duration?"},
    {cat:"Requests", en:"Please let me know whether breakfast is included.", fr:"Merci de me dire si le petit-déjeuner est inclus.", ex:"Please let me know whether breakfast is included in the rate."},
    {cat:"Details", en:"I would like to book a room from [DATE] to [DATE] for [NUMBER] nights.", fr:"Je voudrais réserver une chambre du [DATE] au [DATE] pour [NUMBER] nuits.", ex:"I would like to book a room from May 12 to May 14 for two nights."},
    {cat:"Details", en:"I have a reservation under the name…", fr:"J’ai une réservation au nom de…", ex:"I have a reservation under the name Martin."},
    {cat:"Details", en:"If possible, I would prefer a quiet room.", fr:"Si possible, je préférerais une chambre calme.", ex:"If possible, I would prefer a quiet room away from the elevator."},
    {cat:"Details", en:"I may have limited mobility, so step-free access would be helpful.", fr:"J’ai une mobilité réduite, donc un accès sans marche serait utile.", ex:"I may have limited mobility, so step-free access would be helpful."},
    {cat:"Complaints", en:"I’m writing to report an issue with my room.", fr:"Je vous écris pour signaler un problème avec ma chambre.", ex:"I’m writing to report an issue with my room (noise / broken shower)."},
    {cat:"Complaints", en:"Unfortunately, I was unable to sleep due to the noise.", fr:"Malheureusement, je n’ai pas pu dormir à cause du bruit.", ex:"Unfortunately, I was unable to sleep due to the noise from the street."},
    {cat:"Complaints", en:"Could someone come to fix it, please?", fr:"Quelqu’un pourrait-il venir réparer, s’il vous plaît ?", ex:"Could someone come to fix the shower, please?"},
    {cat:"Complaints", en:"If it can’t be fixed quickly, would it be possible to change rooms?", fr:"Si ce n’est pas réparé rapidement, peut-on changer de chambre ?", ex:"If it can’t be fixed quickly, would it be possible to change rooms?"},
    {cat:"Closings", en:"Thank you in advance for your assistance.", fr:"Merci d’avance pour votre aide.", ex:"Thank you in advance for your assistance. I look forward to your reply."},
    {cat:"Closings", en:"I look forward to your reply.", fr:"Dans l’attente de votre réponse.", ex:"I look forward to your reply."},
    {cat:"Closings", en:"Please confirm by email at your earliest convenience.", fr:"Merci de confirmer par email dès que possible.", ex:"Please confirm by email at your earliest convenience."},
    {cat:"Connectors", en:"First, … / Then, … / Finally, …", fr:"D’abord… / Ensuite… / Enfin…", ex:"First, I arrived early. Then I… Finally, I solved the issue."},
    {cat:"Connectors", en:"However, …", fr:"Cependant…", ex:"However, the room was noisy."},
    {cat:"Connectors", en:"For example, …", fr:"Par exemple…", ex:"For example, the shower did not work."},
    {cat:"Connectors", en:"As a result, …", fr:"Par conséquent…", ex:"As a result, I arrived late."}
  ];

  const feedbackStems = [
    {en:"Great structure. Now shorten sentences to reduce mistakes.", fr:"Bonne structure. Maintenant, raccourcir les phrases."},
    {en:"Add one clear request line (Could you… please?).", fr:"Ajouter une demande claire (Could you… please?)."},
    {en:"Improve clarity: 1 idea per sentence.", fr:"Améliorer la clarté : 1 idée par phrase."},
    {en:"Upgrade 2 words (problem→issue, tell me→let me know).", fr:"Améliorer 2 mots (problem→issue, tell me→let me know)."},
    {en:"Check articles and prepositions (a/the, in/on/at).", fr:"Vérifier articles et prépositions (a/the, in/on/at)."}
  ];

  const subjectQuizBank = [
    {
      scen:"You want hotel specifications before booking (dates, inclusions, quiet room).",
      options:["Hi!!! Need room now","Request for information — reservation from May 12 to May 14","Reservation","Hello dear, question"],
      a:1,
      why:"Clear purpose + dates. Professional and easy to scan."
    },
    {
      scen:"Your flight is delayed and you want to change your booking date.",
      options:["Change of plans due to delay — request for options","OMG problem","Delay delay delay","Hi, I want"],
      a:0,
      why:"States reason + request. Neutral tone."
    },
    {
      scen:"You had a noisy room. You want a solution (fix / room change / discount).",
      options:["Complaint — noise and request for solution","You are wrong","Bad hotel","Hello, noise"],
      a:0,
      why:"Professional. Mentions issue + action."
    }
  ];

  const openQuizBank = [
    {scen:"Email to a hotel (formal).", options:["Hey guys,","Dear Reservations Team,","Yo,","Hi friend,"], a:1, why:"Professional greeting."},
    {scen:"Email to customer service (formal).", options:["To whom it may concern,","Salut,","Hi bro,","Hello there!!!"], a:0, why:"Formal and safe."}
  ];

  const closeQuizBank = [
    {scen:"Formal email: asking for a confirmation by email.", options:["Bye!","Kind regards,","See ya!","XOXO"], a:1, why:"Standard polite closing."},
    {scen:"Polite closing after a complaint.", options:["You must fix it.","Thank you for your help.","Do it now.","Bad service."], a:1, why:"Polite tone even in complaints."}
  ];

  const skeletonScenarios = [
    {id:"hotelInfo", title:"Hotel — request specifications"},
    {id:"tourInfo", title:"Tour — request specifications"},
    {id:"reschedule", title:"Reschedule due to delay"},
    {id:"complaint", title:"Hotel — polite complaint"},
    {id:"lost", title:"Lost item / luggage"}
  ];

  const skeletonChips = [
    "Subject: Request for information — reservation from ___ to ___",
    "Dear ___,",
    "I’m writing to ask for information about…",
    "Could you please confirm your availability and the total price, including taxes?",
    "Could you also tell me what is included (breakfast, Wi‑Fi, parking)?",
    "If possible, I would like a quiet room.",
    "Would it be possible to change the date to…?",
    "Could someone come to fix it, please?",
    "If it can’t be fixed quickly, would it be possible to change rooms?",
    "Please confirm by email. Thank you in advance for your help.",
    "Kind regards,",
    "[Your name]"
  ];

  const skeletonModels = {
    A2:
`Subject: Request for information — reservation from [DATE] to [DATE]

Dear Sir or Madam,

I would like to book a room from [DATE] to [DATE] for [NUMBER] nights. Could you please confirm availability and the total price, including taxes?

Is breakfast included? Is Wi‑Fi included? If possible, I would like a quiet room. I also need step‑free access.

Please confirm by email. Thank you in advance for your help.

Kind regards,
[Your name]`,
    B1:
`Subject: Inquiry — availability and rate for [DATE]–[DATE]

Dear Reservations Team,

I’m writing to request information before booking a room from [DATE] to [DATE] for [NUMBER] nights. Could you please confirm your availability and the total price per night, including taxes and any extra charges?

Could you also tell me what is included in the rate (breakfast, Wi‑Fi, parking)? If possible, I would prefer a quiet room, not facing the street. I would also like to confirm accessibility (step‑free access / elevator).

Please confirm by email. Thank you in advance for your help.

Best regards,
[Your name]`,
    B2:
`Subject: Request for information — reservation from [DATE] to [DATE]

Dear Reservations Team,

I’m writing to request details before confirming a reservation from [DATE] to [DATE] for [NUMBER] nights. Could you please confirm availability and the total price per night, including taxes and any additional fees (for example, parking or city tax)?

Could you also clarify what is included in the rate (breakfast, Wi‑Fi, and any other services)? If possible, I’d appreciate a quiet room away from the elevator and not facing the street. Finally, I would like to confirm accessibility (step‑free access and elevator), as I may have limited mobility.

Please send the specifications and confirmation by email at your earliest convenience. Thank you in advance for your assistance.

Sincerely,
[Your name]`
  };

  const writingTasks = [
    {
      id:"hotelInfo",
      title:"Email — request hotel specifications (125+ words)",
      prompt:"Write an email to a hotel to request specifications before booking. Include: dates, number of nights, total price (with taxes), what is included (breakfast/Wi‑Fi), a quiet room request, and accessibility needs. Ask them to confirm by email.",
      lines:["Subject: Request for information — reservation from ___ to ___","I’m writing to ask for information about…","Could you please confirm…?","Could you also tell me what is included…?","If possible, I would prefer…","Thank you in advance for your help."],
      template:
`Subject: Request for information — reservation from [DATE] to [DATE]

Dear [NAME/TEAM],

I’m writing to request information before booking a room from [DATE] to [DATE] for [NUMBER] nights. Could you please confirm your availability and the total price per night, including taxes and any extra charges?

Could you also tell me what is included in the rate (breakfast, Wi‑Fi, parking)? If possible, I would prefer a quiet room, not facing the street. In addition, I would like to confirm accessibility (step‑free access / elevator) because [REASON].

Please send the specifications and confirmation by email. Thank you in advance for your help.

Kind regards,
[NAME]`,
      models: {
        A2:
`Subject: Request for information — reservation from 12 to 14 May

Dear Sir or Madam,

I would like to book a room from 12 to 14 May for two nights. Could you please confirm availability and the total price per night, including taxes?

Is breakfast included? Is Wi‑Fi included? If possible, I would like a quiet room, not facing the street. I also need step‑free access because I have a knee problem.

Could you please send me the details by email? Thank you in advance for your help.

Kind regards,
Miriam`,
        B1:
`Subject: Inquiry — availability and rate for 12–14 May

Dear Reservations Team,

I’m writing to request information before booking a room from 12 to 14 May for two nights. Could you please confirm your availability and the total price per night, including taxes?

Could you also tell me what is included in the rate (breakfast and Wi‑Fi)? If possible, I would prefer a quiet room, not facing the street. In addition, I would like to confirm accessibility (step‑free access / elevator).

Please send the specifications and confirmation by email. Thank you in advance for your help.

Best regards,
Miriam`,
        B2:
`Subject: Request for information — reservation from 12 to 14 May

Dear Reservations Team,

I’m writing to request details before confirming a reservation from 12 to 14 May for two nights. Could you please confirm availability and the total price per night, including taxes and any additional fees (for example, parking or city tax)?

Could you also clarify what is included in the rate (breakfast, Wi‑Fi, and any other services)? If possible, I’d appreciate a quiet room away from the elevator and not facing the street. Finally, I would like to confirm accessibility (step‑free access and elevator), as I may have limited mobility.

Please send the specifications and confirmation by email at your earliest convenience. Thank you in advance for your assistance.

Sincerely,
Miriam`
      }
    },
    {
      id:"tourInfo",
      title:"Email — ask a tour operator for specifications (125+ words)",
      prompt:"Write an email to a tour operator. Ask for specifications: duration, meeting point, language, what is included, accessibility, and refund policy. Ask them to send the details by email.",
      lines:["Subject: Request for tour details — ___ tour on ___","I’m interested in booking…","Could you confirm duration + meeting point?","What is included?","Is it accessible?","Thank you in advance…"],
      template:
`Subject: Request for tour details — [TOUR NAME] on [DATE]

Dear [NAME/TEAM],

I’m interested in booking the [TOUR NAME] tour on [DATE], and I would like to confirm a few details before I book. Could you please tell me the duration of the tour, the meeting point, and the language options?

Could you also clarify what is included in the price (tickets, guide, transport)? In addition, I would like to know whether the tour is suitable for someone with limited mobility and whether there are any stairs.

Finally, could you confirm your refund and cancellation policy? Please send the specifications by email. Thank you in advance for your help.

Kind regards,
[NAME]`,
      models:{
        A2:
`Subject: Request for tour details — city tour on Saturday

Dear Team,

I’m interested in the city tour on Saturday. Could you tell me how long it is and where we meet? Is it in English?

What is included in the price? I also need to know if it is accessible because I have limited mobility. Could you also tell me the cancellation policy?

Please send me the details by email. Thank you in advance.

Kind regards,
Miriam`,
        B1:
`Subject: Request for tour details — city tour on Saturday

Dear Team,

I’m interested in booking the city tour on Saturday, and I’d like to confirm a few details before I book. Could you tell me the duration, the meeting point, and the language options?

Could you also clarify what is included in the price? In addition, I’d like to know if the tour is suitable for someone with limited mobility. Finally, could you confirm your cancellation and refund policy?

Please send the specifications by email. Thank you in advance for your help.

Best regards,
Miriam`,
        B2:
`Subject: Request for tour details — city tour on Saturday

Dear Customer Service Team,

I’m interested in booking the city tour on Saturday and would like to confirm a few details before proceeding. Could you please confirm the tour duration, meeting point, start time, and available language options?

Could you also clarify what is included in the price (guide, tickets, transport)? In addition, I would like to confirm accessibility, as I may have limited mobility—are there stairs or long walking sections?

Finally, could you confirm your cancellation and refund policy? Please send the specifications by email at your earliest convenience. Thank you in advance for your assistance.

Sincerely,
Miriam`
      }
    },
    {
      id:"reschedule",
      title:"Email — reschedule due to delay (125+ words)",
      prompt:"Write an email to change a booking because your flight/train is delayed. Include: booking reference, new date/time, and ask for options. Stay polite and clear.",
      lines:["Subject: Request to reschedule — booking ___","My flight/train has been delayed…","I would like to change…","Could you confirm the options?","Thank you for your help."],
      template:
`Subject: Request to reschedule — booking [REF]

Dear [NAME/TEAM],

I’m writing regarding my booking reference [REF]. Unfortunately, my flight/train has been delayed, and I will not be able to arrive at the original time.

Would it be possible to reschedule the booking to [NEW DATE/TIME]? If this is not possible, could you please let me know what alternative options you can offer (later check‑in, change of date, or refund policy)?

Please confirm the next steps by email. Thank you in advance for your help.

Kind regards,
[NAME]`,
      models:{
        A2:
`Subject: Request to reschedule — booking AB123

Dear Team,

I’m writing about my booking reference AB123. My flight is delayed, so I cannot arrive at the original time.

Would it be possible to change my booking to tomorrow, 10 am? If it is not possible, could you tell me the other options, please?

Please confirm by email. Thank you in advance for your help.

Kind regards,
Miriam`,
        B1:
`Subject: Request to reschedule — booking AB123

Dear Customer Service Team,

I’m writing regarding my booking reference AB123. Unfortunately, my flight has been delayed, and I will not be able to arrive at the original time.

Would it be possible to reschedule the booking to tomorrow at 10 am? If this is not possible, could you please let me know what alternative options you can offer (later check‑in or change of date)?

Please confirm the next steps by email. Thank you in advance for your help.

Best regards,
Miriam`,
        B2:
`Subject: Change of plans due to delay — request for options (booking AB123)

Dear Customer Service Team,

I’m writing regarding my booking reference AB123. Unfortunately, my flight has been delayed by several hours, and I will not be able to arrive at the originally scheduled time.

Would it be possible to reschedule my booking to tomorrow at 10 am? If rescheduling is not available, could you please advise on the alternatives you can offer (late check‑in, change of date, or applicable refund policy)?

Please confirm the best solution by email at your earliest convenience. Thank you in advance for your assistance.

Sincerely,
Miriam`
      }
    },
    {
      id:"complaint",
      title:"Email — polite complaint + solution (125+ words)",
      prompt:"Write an email to a hotel to report a problem (noise or broken shower). Explain what happened, what you already tried, and what you want as a solution (fix / room change / discount). Stay polite.",
      lines:["Subject: Issue with room ___ — request for assistance","I’m writing to report an issue with…","I tried… but…","Could you please…?","Thank you for your help."],
      template:
`Subject: Issue with room [NUMBER] — request for assistance

Dear [NAME/TEAM],

I’m writing to report an issue with my room ([NUMBER]). Last night, there was significant noise from [SOURCE], and I was unable to sleep. I also tried to close the windows and use earplugs, but it didn’t solve the problem.

Could you please send someone to check the issue? If it can’t be fixed quickly, would it be possible to change rooms? If neither option is possible, I would appreciate a discount for the inconvenience.

Thank you in advance for your help. Please let me know what you can do.

Kind regards,
[NAME]`,
      models:{
        A2:
`Subject: Issue with room 203 — request for help

Dear Team,

I’m writing to report a problem with my room 203. Last night it was very noisy and I could not sleep. I tried to close the window but it was still noisy.

Could you please help me? If possible, I would like to change rooms. If not, could you offer a discount?

Thank you for your help.

Kind regards,
Miriam`,
        B1:
`Subject: Issue with room 203 — request for assistance

Dear Team,

I’m writing to report an issue with my room (203). Last night there was a lot of noise from the street, and I couldn’t sleep. I tried to close the window and use earplugs, but it didn’t solve the problem.

Could you please send someone to check the issue? If it can’t be fixed quickly, would it be possible to change rooms? If not, I would appreciate a discount for the inconvenience.

Thank you in advance for your help.

Best regards,
Miriam`,
        B2:
`Subject: Issue with room 203 — request for assistance

Dear Front Desk Team,

I’m writing to report an issue with my room (203). Unfortunately, there was significant street noise last night, and I was unable to sleep. I tried closing the windows and using earplugs, but the problem continued.

Could you please investigate the situation? If it cannot be resolved quickly, would it be possible to move to a quieter room? If a room change is not available, I would appreciate a gesture of goodwill, such as a discount, given the inconvenience.

Thank you in advance for your assistance. I look forward to your reply.

Sincerely,
Miriam`
      }
    },
    {
      id:"story",
      title:"Story — travel mishap (image-style task) (125+ words)",
      prompt:"Write a short story about a travel mishap (missing a train / lost luggage / wrong hotel). Use a clear timeline: first → then → after that → finally. Use 5 connectors.",
      lines:["First, …","Then, …","After that, …","However, …","Finally, …"],
      template:
`First, I arrived at the station early because I wanted to be on time. Then I realized my phone battery was almost empty, and I needed my ticket on my phone. After that, I asked a staff member for help and found a charging point. However, the train started boarding earlier than expected, so I had to hurry. Finally, I managed to show my ticket and board the train. As a result, I learned to stay calm and always carry a charger.`,
      models:{
        A2:
`First, I went to the train station for my holiday. Then I saw that my train was cancelled. I was worried because I had a hotel reservation. After that, I went to the information desk and asked for another train. However, the next train was later and I had to wait. Finally, the staff changed my ticket and I arrived in the evening. As a result, I was tired but relieved. Next time, I will check the schedule early and keep a plan B.`,
        B1:
`First, I arrived at the station early because I didn’t want to miss my train. Then I saw on the screen that my train was cancelled. I felt stressed because I had a hotel reservation. After that, I went to the information desk and asked for an alternative. However, the next option had a connection, so I needed to move quickly. Finally, I boarded a later train and arrived a few hours late, but everything worked out. For example, I called the hotel to explain the situation. As a result, they kept my room.`,
        B2:
`First, I arrived at the station early because I wanted a smooth start to my trip. Then I noticed on the departures board that my train had been cancelled due to a technical issue. After that, I went straight to the information desk and asked about the fastest alternative. However, the suggested route included a short connection, so I needed to change platforms quickly. Finally, I boarded the replacement train and arrived a few hours late, but I avoided losing my hotel booking. For example, I emailed the hotel immediately to request a late check‑in. As a result, the staff confirmed everything by email, and the rest of the trip was saved.`
      }
    }
  ];

  const exampleEmailIds = ["hotelInfo","tourInfo","reschedule","complaint","story"];

  const mistakeRules = [
    {re:/\binformations\b/ig, msg:"“Information” is uncountable (no -s).", fr:"“Information” est indénombrable (pas de -s)."},
    {re:/\badvices\b/ig, msg:"“Advice” is uncountable (no -s).", fr:"“Advice” est indénombrable."},
    {re:/\bI am agree\b/ig, msg:"Say: “I agree” (not *I am agree).", fr:"Dire : “I agree”."},
    {re:/\bdepend of\b/ig, msg:"Say: “depend on”.", fr:"Dire : “depend on”."},
    {re:/\bexplain me\b/ig, msg:"Say: “explain to me”.", fr:"Dire : “explain to me”."},
    {re:/\bI look forward to hear\b/ig, msg:"Say: “I look forward to hearing…”.", fr:"Dire : “I look forward to hearing…”."}
  ];

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
    {en:"Overall,", fr:"Globalement,"}
  ];

  const speakScenarios = [
    {
      id:"hotel",
      title:"Hotel — check-in + request specifications",
      questions:[
        "Good afternoon. How can I help you today?",
        "Could you confirm your booking dates and number of nights?",
        "Do you have any special requests (quiet room, accessibility)?",
        "Would you like breakfast included?",
        "Could you confirm the total price including taxes?",
        "Is there anything else you need before your arrival?"
      ],
      models:{
        A2:"Hello. I have a reservation for two nights. Could you confirm the total price, including taxes? If possible, I would like a quiet room. I also need step‑free access. Thank you.",
        B1:"Good afternoon. I have a reservation for two nights. Could you please confirm the total price including taxes and tell me what is included (breakfast and Wi‑Fi)? If possible, I would prefer a quiet room and step‑free access. Thank you.",
        B2:"Good afternoon. I’m calling about my reservation for two nights. Could you confirm the total amount including taxes and any extra charges, and clarify what’s included in the rate? If possible, I’d appreciate a quiet room away from the elevator and step‑free access. Thank you in advance."
      }
    },
    {
      id:"tour",
      title:"Tour operator — request specifications",
      questions:[
        "Hello, how can I help you?",
        "Which tour are you interested in and on what date?",
        "What details do you need before booking?",
        "Do you need accessibility or special assistance?",
        "Would you like the information by email?",
        "Would you like to book now or ask more questions?"
      ],
      models:{
        A2:"Hello. I’m interested in the city tour on Saturday. Could you tell me how long it is and where we meet? What is included? I need accessibility. Please send details by email. Thank you.",
        B1:"Hi. I’m interested in the city tour on Saturday. Could you provide the specifications: duration, meeting point, language, and what is included? I also need to check accessibility. Please send the details by email. Thank you.",
        B2:"Hello. I’m interested in the city tour on Saturday. Could you provide the specifications—duration, meeting point, language options, what’s included, and your cancellation policy? I’d also like to confirm accessibility. Please send the details by email. Thank you in advance."
      }
    },
    {
      id:"delay",
      title:"Transport — delay + reschedule",
      questions:[
        "Hello. What seems to be the problem?",
        "Can you tell me your booking reference?",
        "How long is the delay?",
        "What new date or time do you prefer?",
        "Would you like options (late check-in, change of date, refund)?",
        "Could I confirm your email address to send the new details?"
      ],
      models:{
        A2:"Hello. My train is delayed. My booking reference is AB123. I would like to change to tomorrow at 10 am. Could you tell me my options, please? Thank you.",
        B1:"Hi. My booking reference is AB123 and my train is delayed. I’d like to reschedule to tomorrow at 10 am. If it’s not possible, could you let me know the options? Please send details by email. Thank you.",
        B2:"Hello. My booking reference is AB123, and my train has been delayed. I’d like to reschedule to tomorrow at 10 am. If that’s not possible, could you advise the alternatives—late check‑in, change of date, or refund policy? Please confirm by email. Thank you."
      }
    },
    {
      id:"complaint",
      title:"Hotel — polite complaint + solution",
      questions:[
        "Hello. How can I help you?",
        "What is the problem with your room?",
        "When did it happen?",
        "What have you tried already?",
        "What solution would you prefer?",
        "Could you confirm your room number and name?"
      ],
      models:{
        A2:"Hello. There is a problem with my room. It was noisy last night. I tried to close the window but it was still noisy. Could I change rooms, please? Thank you.",
        B1:"Hi. I’m calling about an issue with my room. There was a lot of noise last night and I couldn’t sleep. I tried to close the window and use earplugs. Could you move me to a quieter room, please? Thank you.",
        B2:"Hello. I’m calling about an issue with my room. Unfortunately, there was significant noise last night and I was unable to sleep. I tried closing the window and using earplugs, but it didn’t help. Could you move me to a quieter room, or offer a solution? Thank you."
      }
    }
  ];

  const prodPrompts = [
    {
      id:"specs",
      title:"Explain what you need before booking (1 minute)",
      text:"You want to book a hotel or tour. Explain what specifications you need: prices, what is included, times, accessibility, and how you want the information sent to you.",
      builder:[
        ["Purpose","Before booking, I’d like to confirm a few details."],
        ["Specs","Could you tell me the total price and what is included?"],
        ["Times","I also need to confirm check‑in/check‑out times (or meeting point/time)."],
        ["Accessibility","Finally, could you confirm accessibility (step‑free access)?"],
        ["Close","Please send the details by email. Thank you in advance."]
      ]
    },
    {
      id:"mishap",
      title:"Tell a short travel mishap story (1 minute)",
      text:"Tell a short story about a travel problem you solved. Use 5 connectors (first, then, however, for example, finally).",
      builder:[
        ["Start","First, I… Then I…"],
        ["Problem","However, there was an issue with…"],
        ["Action","So I… For example, I…"],
        ["Result","As a result, …"],
        ["Close","Finally, … and everything worked out."]
      ]
    }
  ];

  const callScripts = [
    {
      title:"Phone call — hotel booking + specs",
      lines:[
        "Hello, I’d like to make a reservation, please.",
        "Could you tell me if you have availability from ___ to ___?",
        "What is the total price per night, including taxes?",
        "Is breakfast included? Is Wi‑Fi included?",
        "If possible, I’d like a quiet room. Is that available?",
        "Could you confirm everything by email? Thank you."
      ]
    },
    {
      title:"Phone call — tour inquiry",
      lines:[
        "Hello, I’m interested in the ___ tour on ___.",
        "Could you provide the specifications: duration, meeting point, and language?",
        "What is included in the price?",
        "Is it suitable for someone with limited mobility?",
        "Could you send the details by email, please? Thank you in advance."
      ]
    },
    {
      title:"Phone call — polite complaint",
      lines:[
        "Hello, I’m calling about a problem with my room.",
        "There is an issue with ___.",
        "Could someone come to fix it, please?",
        "If it can’t be fixed quickly, would it be possible to change rooms?",
        "Thank you for your help."
      ]
    }
  ];

  const connQuizBank = [
    {q:"Choose the best connector for a result: I missed my train. ___ I arrived late.", options:["For example,","As a result,","However,","First,"], a:1, why:"As a result shows consequence."},
    {q:"Choose the best connector for contrast: The hotel was nice. ___ the room was noisy.", options:["Finally,","However,","Because","Then,"], a:1, why:"However shows contrast."},
    {q:"Choose the best connector for an example: I asked for specifications. ___ I asked about accessibility.", options:["For example,","As a result,","Finally,","However,"], a:0, why:"For example introduces an example."}
  ];

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

  const renderExamCards = () => {
    const host = $('#examCards');
    host.innerHTML = '';
    examCards.forEach(card => {
      const div = document.createElement('div');
      div.className = 'panel';
      div.innerHTML = `
        <div class="miniTitle">${escapeHtml(card.time)}</div>
        <h3 class="h3">${escapeHtml(card.title)}</h3>
        <ul class="bullets">
          ${card.bullets.map(x => `<li>${escapeHtml(x)}</li>`).join('')}
        </ul>
        ${state.fr ? `<div class="frOnly" style="display:block;"><ul class="bullets">${card.fr.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></div>` : ''}
      `;
      host.appendChild(div);
    });
  };

  const fillSubjectSituations = () => {
    const sel = $('#subjectSituation');
    sel.innerHTML = '';
    subjectSituations.forEach(s => {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.name;
      sel.appendChild(o);
    });
    sel.value = 'hotelInfo';
  };

  const buildSubjects = () => {
    const id = $('#subjectSituation').value;
    const lines = subjectGenerators[id] || [];
    $('#subjectOut').textContent = lines.map(x => `• ${x}`).join('\n') || '—';
  };

  const copyText = async (txt, okMsg) => {
    try{ await navigator.clipboard.writeText(txt); toast(okMsg || 'Copied.'); }
    catch(e){ toast('Copy blocked. Select and copy manually.'); }
  };

  const copySubjects = () => {
    const txt = $('#subjectOut').textContent || '';
    if(txt.trim()) copyText(txt, '✅ Subjects copied.');
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

  // Phrase bank
  const phraseCats = (() => Array.from(new Set(phraseBank.map(x => x.cat))).sort())();
  const setupPhraseCats = () => {
    const sel = $('#phraseCat');
    phraseCats.forEach(c => {
      const o = document.createElement('option');
      o.value = c;
      o.textContent = c;
      sel.appendChild(o);
    });
  };
  const getPhraseFiltered = () => {
    const cat = $('#phraseCat').value;
    const q = ($('#phraseSearch').value || '').trim().toLowerCase();
    return phraseBank.filter(p => (cat === 'all' || p.cat === cat) &&
      (!q || p.en.toLowerCase().includes(q) || (p.fr||'').toLowerCase().includes(q)));
  };
  const renderPhraseBank = () => {
    const list = getPhraseFiltered();
    const chipsHost = $('#phraseChips');
    chipsHost.innerHTML = '';
    list.forEach(item => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.innerHTML = `${escapeHtml(item.en)}${state.fr ? `<span class="sub">${escapeHtml(item.fr)}</span>` : ''}`;
      b.addEventListener('click', () => speak(item.en));
      chipsHost.appendChild(b);
    });
    $('#phraseList').innerHTML = list.map(it => `
      <div class="panel" style="margin-bottom:10px;">
        <div class="miniTitle">${escapeHtml(it.cat)}</div>
        <div style="font-weight:900;">${escapeHtml(it.en)} ${state.fr ? `<span class="muted">— ${escapeHtml(it.fr)}</span>` : ''}</div>
        <div class="tiny muted" style="margin-top:6px; line-height:1.5;">Example: ${escapeHtml(it.ex)}</div>
      </div>
    `).join('') || `<div class="tiny muted">No items found.</div>`;
  };
  const shufflePhraseBank = () => {
    const shuffled = shuffle(phraseBank);
    phraseBank.length = 0;
    shuffled.forEach(x => phraseBank.push(x));
    renderPhraseBank();
  };

  // MCQ renderer
  const renderMCQ = (host, qObj) => {
    host.innerHTML = '';
    const q = document.createElement('div');
    q.className = 'prompt';
    q.innerHTML = `<div class="miniTitle">Scenario</div><div class="promptText">${escapeHtml(qObj.scen || qObj.q)}</div>`;
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

  const newSubjectQuiz = () => renderMCQ($('#subjectQuiz'), shuffle(subjectQuizBank)[0]);
  const newOpenQuiz = () => renderMCQ($('#openCloseQuiz'), shuffle(openQuizBank)[0]);
  const newCloseQuiz = () => renderMCQ($('#openCloseQuiz'), shuffle(closeQuizBank)[0]);

  // Skeleton builder
  const fillSkeletonScenarios = () => {
    const sel = $('#skeletonScenario');
    sel.innerHTML = '';
    skeletonScenarios.forEach(s => {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.title;
      sel.appendChild(o);
    });
    sel.value = 'hotelInfo';
  };

  const renderSkeleton = () => {
    const host = $('#skeletonChips');
    host.innerHTML = '';
    skeletonChips.forEach(line => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent = line;
      b.addEventListener('click', () => {
        speak(line.replace(/\[.*?\]/g,''));
        const ta = $('#skeletonText');
        ta.value = (ta.value ? (ta.value + "\n") : '') + line;
        ta.focus();
      });
      host.appendChild(b);
    });
    renderSkeletonModel();
  };

  const renderSkeletonModel = () => {
    $('#skeletonModelBox').textContent = skeletonModels[state.level] || '';
  };

  const insertSkeletonModel = () => {
    $('#skeletonText').value = skeletonModels[state.level] || '';
    $('#skeletonMsg').textContent = 'Model inserted.';
  };

  const clearSkeleton = () => {
    $('#skeletonText').value = '';
    $('#skeletonMsg').textContent = '';
  };

  const skeletonCheck = () => {
    const txt = ($('#skeletonText').value || '').toLowerCase();
    const required = [
      {k:'subject:', msg:'Add a Subject line (Subject: …).'},
      {k:'dear', msg:'Add a greeting (Dear …).'},
      {k:"i'm writing", msg:'Add a purpose line (I’m writing to…).'},
      {k:'could you', msg:'Add a request using “Could you…?” or “Would it be possible…?”'},
      {k:'thank', msg:'Add a polite closing (Thank you…).'},
      {k:'regards', msg:'Add a closing line (Kind regards / Best regards).'},
    ];
    const missing = required.filter(r => !txt.includes(r.k)).map(r => r.msg);
    if(!missing.length){
      addScore(true);
      $('#skeletonMsg').textContent = '✅ Great skeleton! Clear structure + polite tone.';
    }else{
      addScore(false);
      $('#skeletonMsg').textContent = '❌ Missing: ' + missing.join(' ');
    }
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
    sel.value = 'hotelInfo';
  };
  const currentWriteTask = () => writingTasks.find(t => t.id === $('#writeTask').value) || writingTasks[0];

  const renderWriting = () => {
    const t = currentWriteTask();
    $('#writePrompt').textContent = t.prompt;
    const host = $('#writeLines');
    host.innerHTML = '';
    t.lines.forEach(l => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent = l;
      b.addEventListener('click', () => {
        speak(l);
        const ta = $('#studentText');
        ta.value = (ta.value ? (ta.value + "\n") : '') + l;
        ta.focus();
        updateWordCount();
        renderMistakes();
      });
      host.appendChild(b);
    });
    fillEmailExample();
    renderExampleEmail();
    renderMistakes();
  };

  const updateWordCount = () => {
    const text = ($('#studentText').value || '').trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
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

  const writeListen = () => speak(currentWriteTask().prompt);

  const writeStart = () => {
    state.timers.write = stopTimer(state.timers.write);
    state.timers.write = startCountdown(15*60, (r) => { $('#writeTimer').textContent = fmtTime(r); },
      () => { $('#writeTimer').textContent = '00:00'; toast('Time! Quick proofread (articles + prepositions).'); });
  };
  const writeStop = () => {
    state.timers.write = stopTimer(state.timers.write);
    $('#writeTimer').textContent = '00:00';
  };
  const showModelWrite = () => {
    const t = currentWriteTask();
    const model = (t.models && t.models[state.level]) ? t.models[state.level] : '';
    const ta = $('#studentText');
    ta.value = ta.value.trim() ? (ta.value.trim() + "\n\n---\nMODEL (" + state.level + ")\n" + model) : model;
    ta.focus();
    updateWordCount();
    renderMistakes();
  };
  const copyTemplate = () => copyText(currentWriteTask().template || '', '✅ Template copied.');

  // Example library
  const fillEmailExample = () => {
    const sel = $('#emailExample');
    const current = sel.value || '';
    sel.innerHTML = '';
    exampleEmailIds.forEach(id => {
      const task = writingTasks.find(t => t.id === id);
      if(!task) return;
      const o = document.createElement('option');
      o.value = id;
      o.textContent = task.title.replace(' (125+ words)','');
      sel.appendChild(o);
    });
    sel.value = current && exampleEmailIds.includes(current) ? current : 'hotelInfo';
  };
  const getSelectedExample = () => writingTasks.find(t => t.id === $('#emailExample').value) || writingTasks[0];
  const renderExampleEmail = () => {
    const t = getSelectedExample();
    const txt = (t.models && t.models[state.level]) ? t.models[state.level] : '';
    $('#exampleOut').textContent = txt || '—';
  };
  const copyExampleEmail = () => {
    const txt = $('#exampleOut').textContent || '';
    if(txt.trim()) copyText(txt, '✅ Example copied.');
  };
  const sayExampleEmail = () => speak($('#exampleOut').textContent || '');

  // Speaking
  const fillSpeakSelector = () => {
    const sel = $('#speakScenario');
    sel.innerHTML = '';
    speakScenarios.forEach(s => {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.title;
      sel.appendChild(o);
    });
    sel.value = speakScenarios[0].id;
    state.speak.scenarioId = sel.value;
    state.speak.idx = 0;
  };

  const renderConnectors = () => {
    const host = $('#connectorChips');
    host.innerHTML = '';
    connectors.forEach(c => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.innerHTML = `${escapeHtml(c.en)}${state.fr ? `<span class="sub">${escapeHtml(c.fr)}</span>` : ''}`;
      b.addEventListener('click', () => {
        speak(c.en.replace(',',''));
        const ta = $('#speakNotes');
        ta.value = (ta.value ? (ta.value + ' ') : '') + c.en;
        ta.focus();
      });
      host.appendChild(b);
    });
  };

  const currentSpeakScenario = () => speakScenarios.find(s => s.id === state.speak.scenarioId) || speakScenarios[0];

  const renderSpeaking = () => {
    const scen = currentSpeakScenario();
    const q = scen.questions[state.speak.idx] || scen.questions[0];
    $('#speakQ').textContent = q;
    $('#speakCount').textContent = `${state.speak.idx} / 6`;
    $('#speakModel').textContent = (scen.models && scen.models[state.level]) ? scen.models[state.level] : '';
  };

  const speakStart = () => {
    state.timers.speak = stopTimer(state.timers.speak);
    state.timers.speak = startCountdown(45, (r) => { $('#speakTimer').textContent = fmtTime(r); },
      () => { $('#speakTimer').textContent = '00:00'; toast('Stop. Now repeat with 2 connectors.'); });
  };
  const speakStop = () => { state.timers.speak = stopTimer(state.timers.speak); $('#speakTimer').textContent='00:00'; };
  const speakListenPrompt = () => speak($('#speakQ').textContent || '');
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

  // Production
  const fillProdSelector = () => {
    const sel = $('#prodPrompt');
    sel.innerHTML = '';
    prodPrompts.forEach(p => {
      const o = document.createElement('option');
      o.value = p.id;
      o.textContent = p.title;
      sel.appendChild(o);
    });
    sel.value = prodPrompts[0].id;
  };
  const renderProd = () => {
    const id = $('#prodPrompt').value;
    const p = prodPrompts.find(x => x.id === id) || prodPrompts[0];
    $('#prodText').textContent = p.text;
    const host = $('#prodBuilder');
    host.innerHTML = '';
    p.builder.forEach(row => {
      const div = document.createElement('div');
      div.className = 'builderRow';
      div.innerHTML = `<div class="bLbl">${escapeHtml(row[0])}</div><div class="bBox">${escapeHtml(row[1])}</div>`;
      host.appendChild(div);
    });
  };
  const prodStart = () => {
    state.timers.prod = stopTimer(state.timers.prod);
    state.timers.prod = startCountdown(60, (r) => { $('#prodTimer').textContent = fmtTime(r); },
      () => { $('#prodTimer').textContent='00:00'; toast('Time. Add a strong closing line.'); });
  };
  const prodStop = () => { state.timers.prod = stopTimer(state.timers.prod); $('#prodTimer').textContent='00:00'; };
  const prodListen = () => speak($('#prodText').textContent || '');

  // Call scripts
  const renderCallScripts = () => {
    const host = $('#callScripts');
    host.innerHTML = '';
    callScripts.forEach(s => {
      const div = document.createElement('div');
      div.className = 'panel';
      div.style.marginBottom = '10px';
      div.innerHTML = `
        <div class="miniTitle">Script</div>
        <div style="font-weight:900;">${escapeHtml(s.title)}</div>
        <ol class="steps" style="margin-top:8px;">
          ${s.lines.map(l => `<li>${escapeHtml(l)}</li>`).join('')}
        </ol>
        <div class="actionsRow mt10">
          <button class="pill" type="button" data-say="${escapeHtml(s.lines.join(' '))}">▶ Say script</button>
        </div>
      `;
      host.appendChild(div);
    });
    $$('button[data-say]', host).forEach(b => b.addEventListener('click', () => speak(b.dataset.say)));
  };

  // Connector quiz
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

  // Teacher diff (word-level)
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
    const a = tokenizeWords($('#studentForDiff').value || $('#studentText').value || '');
    const b = tokenizeWords($('#teacherText').value);
    const out = $('#diffOut');
    if(!b.length){
      out.innerHTML = `<div class="tiny muted">Paste a corrected version (teacher) to compare.</div>`;
      return;
    }
    const table = lcsMatrix(a, b);
    if(!table){
      out.innerHTML = `<div class="tiny muted">Text is long. Showing side-by-side.</div>
        <div class="grid2 mt10">
          <div class="panel"><div class="miniTitle">Student</div><div class="model">${escapeHtml((a||[]).join(' '))}</div></div>
          <div class="panel"><div class="miniTitle">Teacher</div><div class="model">${escapeHtml($('#teacherText').value)}</div></div>
        </div>`;
      return;
    }
    const diff = buildDiff(a, b, table);
    out.innerHTML = diff.map(seg => `<span class="${seg.t}">${escapeHtml(seg.w)}</span>`).join(' ') || `<div class="tiny muted">No differences detected.</div>`;
  };
  const clearDiff = () => {
    $('#studentForDiff').value = '';
    $('#teacherText').value = '';
    $('#diffOut').innerHTML = '';
  };

  const renderFeedbackStems = () => {
    const host = $('#feedbackStems');
    host.innerHTML = '';
    feedbackStems.forEach(x => {
      const div = document.createElement('div');
      div.className = 'panel';
      div.style.marginBottom = '10px';
      div.innerHTML = `
        <div class="miniTitle">Feedback</div>
        <div style="font-weight:900;">${escapeHtml(x.en)}</div>
        ${state.fr ? `<div class="tiny muted frOnly" style="display:block; margin-top:6px;">${escapeHtml(x.fr)}</div>` : ''}
        <div class="actionsRow mt10">
          <button class="pill ghost" type="button" data-copy="${escapeHtml(x.en)}">Copy</button>
          <button class="pill" type="button" data-say="${escapeHtml(x.en)}">▶ Say</button>
        </div>
      `;
      host.appendChild(div);
    });
    $$('button[data-copy]', host).forEach(b => b.addEventListener('click', () => copyText(b.dataset.copy, 'Copied.')));
    $$('button[data-say]', host).forEach(b => b.addEventListener('click', () => speak(b.dataset.say)));
  };

  // Session timer
  const sessionSteps = [
    {t:0, msg:"0–10 min: Email toolkit (subjects, openings, closings)."},
    {t:10*60, msg:"10–35 min: Email practice + write 125+ words."},
    {t:35*60, msg:"35–55 min: Speaking (interaction + production)."},
    {t:55*60, msg:"55–60 min: Wrap-up (3 phrases + 1 template + 1 improved answer)."},
  ];
  const updateSessionHint = (remaining) => {
    const elapsed = 60*60 - remaining;
    let current = sessionSteps[0].msg;
    for(let i=sessionSteps.length-1;i>=0;i--){
      if(elapsed >= sessionSteps[i].t){ current = sessionSteps[i].msg; break; }
    }
    $('#sessionHint').textContent = current;
  };
  const startSession = () => {
    state.timers.session = stopTimer(state.timers.session);
    $('#sessionTimer').textContent = "60:00";
    updateSessionHint(60*60);
    state.timers.session = startCountdown(60*60, (r) => {
      $('#sessionTimer').textContent = fmtTime(r);
      updateSessionHint(r);
      if(r === 35*60) toast("Switch to Speaking section (35–55 min).");
      if(r === 55*60) toast("Wrap-up time (last 5 minutes).");
    }, () => { toast("Session complete! Great work."); $('#sessionTimer').textContent = "00:00"; });
  };
  const stopSession = () => {
    state.timers.session = stopTimer(state.timers.session);
    $('#sessionHint').textContent = "";
  };

  // Reset
  const resetAll = () => {
    state.timers.speak = stopTimer(state.timers.speak);
    state.timers.prod = stopTimer(state.timers.prod);
    state.timers.write = stopTimer(state.timers.write);
    $('#speakTimer').textContent = '00:00';
    $('#prodTimer').textContent = '00:00';
    $('#writeTimer').textContent = '00:00';
    $('#speakNotes').value = '';
    $('#studentText').value = '';
    $('#skeletonText').value = '';
    updateWordCount();
    renderMistakes();
    newSubjectQuiz();
    newOpenQuiz();
    renderConnQuiz();
    toast('Reset done.');
  };
  const newSet = () => { newSubjectQuiz(); newOpenQuiz(); renderConnQuiz(); toast('✨ New set ready.'); };

  // ---------- Init ----------
  const init = () => {
    loadPrefs();
    loadVoices();
    if('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;

    updateScoreUI();

    fillSubjectSituations();
    setupPhraseCats();
    fillSkeletonScenarios();
    fillWriteSelector();
    fillSpeakSelector();
    fillProdSelector();
    renderProd();
    renderCallScripts();

    setLevel(state.level);
    setFR(state.fr);
    setAccent(state.accent);
    $('#rate').value = String(state.rate);

    renderQuickChips();
    renderExamCards();
    renderOpenCloseChips();
    renderPhraseBank();
    renderSkeleton();
    renderWriting();
    renderConnectors();
    renderSpeaking();
    renderExampleEmail();
    renderFeedbackStems();

    newSubjectQuiz();
    newOpenQuiz();
    renderConnQuiz();

    // controls
    $$('.segBtn[data-level]').forEach(b => b.addEventListener('click', () => setLevel(b.dataset.level)));
    $$('.segBtn[data-accent]').forEach(b => b.addEventListener('click', () => setAccent(b.dataset.accent)));
    $('#rate').addEventListener('input', (e) => { state.rate = parseFloat(e.target.value); savePrefs(); });
    $('#frToggle').addEventListener('click', () => { setFR(!state.fr); savePrefs(); });

    $('#printBtn').addEventListener('click', () => window.print());
    $('#resetScore').addEventListener('click', resetScore);
    $('#resetAllBtn').addEventListener('click', resetAll);
    $('#newSetBtn').addEventListener('click', newSet);

    // session
    $('#sessionStart').addEventListener('click', startSession);
    $('#sessionStop').addEventListener('click', stopSession);

    // subject builder
    $('#buildSubject').addEventListener('click', buildSubjects);
    $('#copySubjects').addEventListener('click', copySubjects);

    // phrase bank
    $('#phraseCat').addEventListener('change', renderPhraseBank);
    $('#phraseSearch').addEventListener('input', renderPhraseBank);
    $('#phraseShuffle').addEventListener('click', shufflePhraseBank);

    // quizzes
    $('#newSubjectQuiz').addEventListener('click', newSubjectQuiz);
    $('#newOpenQuiz').addEventListener('click', newOpenQuiz);
    $('#newCloseQuiz').addEventListener('click', newCloseQuiz);

    // skeleton
    $('#skeletonClear').addEventListener('click', clearSkeleton);
    $('#skeletonCheck').addEventListener('click', skeletonCheck);
    $('#skeletonModel').addEventListener('click', insertSkeletonModel);
    $('#skA2').addEventListener('click', () => setLevel('A2'));
    $('#skB1').addEventListener('click', () => setLevel('B1'));
    $('#skB2').addEventListener('click', () => setLevel('B2'));

    // writing
    $('#writeTask').addEventListener('change', renderWriting);
    $('#write15').addEventListener('click', writeStart);
    $('#writeStop').addEventListener('click', writeStop);
    $('#writeListen').addEventListener('click', writeListen);
    $('#studentText').addEventListener('input', () => { updateWordCount(); renderMistakes(); });
    $('#clearStudent').addEventListener('click', () => { $('#studentText').value=''; updateWordCount(); renderMistakes(); });
    $('#showModelWrite').addEventListener('click', showModelWrite);
    $('#copyTemplate').addEventListener('click', copyTemplate);

    // examples
    $('#emailExample').addEventListener('change', renderExampleEmail);
    $('#showExample').addEventListener('click', renderExampleEmail);
    $('#copyExample').addEventListener('click', copyExampleEmail);
    $('#sayExample').addEventListener('click', sayExampleEmail);

    // speaking
    $('#speakScenario').addEventListener('change', (e) => {
      state.speak.scenarioId = e.target.value;
      state.speak.idx = 0;
      renderSpeaking();
    });
    $('#speakStart').addEventListener('click', speakStart);
    $('#speakStop').addEventListener('click', speakStop);
    $('#speakListen').addEventListener('click', speakListenPrompt);
    $('#speakNext').addEventListener('click', speakNext);
    $('#showSA2').addEventListener('click', () => showSpeakModel('A2'));
    $('#showSB1').addEventListener('click', () => showSpeakModel('B1'));
    $('#showSB2').addEventListener('click', () => showSpeakModel('B2'));

    // production
    $('#prodPrompt').addEventListener('change', renderProd);
    $('#prod60').addEventListener('click', prodStart);
    $('#prodStop').addEventListener('click', prodStop);
    $('#prodListen').addEventListener('click', prodListen);

    // connector quiz
    $('#newConnQuiz').addEventListener('click', renderConnQuiz);

    // teacher diff
    $('#compareBtn').addEventListener('click', compareTexts);
    $('#clearDiff').addEventListener('click', clearDiff);
  };

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();