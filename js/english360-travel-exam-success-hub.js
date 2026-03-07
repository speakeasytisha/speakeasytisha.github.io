/* SpeakEasyTisha — English 360° Travel Success Hub
   No external libraries • tap-friendly • Mac/iPad Safari compatible */
(() => {
  'use strict';

  // ---------- Helpers ----------
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const pad2 = (n) => String(n).padStart(2,'0');
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  };
  const escapeHtml = (s) => (s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const nowISO = () => new Date().toISOString().slice(0,19);

  // ---------- State ----------
  const state = {
    level: 'A2',
    fr: false,
    accent: 'US',
    rate: 1.0,
    score: { correct: 0, total: 0 },
    speak: { scenarioId: null, idx: 0, timer: null, remaining: 0 },
    prod: { timer: null, remaining: 0 },
    write: { timer: null, remaining: 0 },
    match: { set: [], selectedWord: null, progress: 0 },
    order: { idx: 0, bank: [], build: [], done: 0 },
  };

  // Persist minimal prefs
  const PREF_KEY = 'se_english360_travel_prefs_v1';
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
        level: state.level, fr: state.fr, accent: state.accent, rate: state.rate, t: nowISO()
      }));
    }catch(e){ /* ignore */ }
  };

  // ---------- Data ----------
  const quickChips = [
    {en:"Could you please…?", fr:"Pourriez-vous… ?"},
    {en:"I’d like to confirm…", fr:"Je voudrais confirmer…"},
    {en:"Could you tell me if…", fr:"Pouvez-vous me dire si…"},
    {en:"Just to clarify…", fr:"Juste pour clarifier…"},
    {en:"Thank you for your help.", fr:"Merci pour votre aide."},
    {en:"Would it be possible to…?", fr:"Serait-il possible de… ?"},
  ];

  // Exam cards (we keep them generic; the exact platform may vary)
  const examCards = [
    {
      title: "Speaking — Interaction",
      time: "≈ 10 min",
      bullets: [
        "6 questions (often) — interview-style",
        "Answer spontaneously (≈ 30–60s)",
        "Recorded via microphone (depending on platform)"
      ],
      fr: [
        "≈ 6 questions — style entretien/conversation",
        "Réponse spontanée (≈ 30–60s)",
        "Réponses enregistrées via micro (selon plateforme)"
      ]
    },
    {
      title: "Speaking — Production",
      time: "≈ 5 min",
      bullets: [
        "2 prompts (often)",
        "Short monologue (≈ 1 min)",
        "Use clear structure"
      ],
      fr: [
        "≈ 2 sujets",
        "Mini monologue (≈ 1 min)",
        "Structure très claire"
      ]
    },
    {
      title: "Listening",
      time: "≈ 15 min",
      bullets: [
        "Multiple-choice (algorithm scoring)",
        "Gist + specific information",
        "Watch for distractors"
      ],
      fr: [
        "QCM (score automatique)",
        "Idée générale + détails",
        "Attention aux pièges"
      ]
    },
    {
      title: "Writing",
      time: "≈ 15 min",
      bullets: [
        "1–2 tasks (often)",
        "Minimum 125 words each task (common version)",
        "Email / response / story from images (possible)"
      ],
      fr: [
        "1–2 tâches (souvent)",
        "Minimum 125 mots (version fréquente)",
        "Email / réponse / histoire à partir d’images (possible)"
      ]
    },
    {
      title: "Reading",
      time: "≈ 15 min",
      bullets: [
        "Multiple-choice / gap fill",
        "Understand purpose + tone",
        "Scan for keywords"
      ],
      fr: [
        "QCM / texte à trous",
        "Comprendre objectif + ton",
        "Repérer les mots clés"
      ]
    },
    {
      title: "Grammar",
      time: "Mixed",
      bullets: [
        "Often included as MCQ / drag-drop fields",
        "Tenses, modals, prepositions",
        "Accuracy beats complexity"
      ],
      fr: [
        "Souvent intégré en QCM / champs à compléter",
        "Temps, modaux, prépositions",
        "La justesse > la complexité"
      ]
    },
  ];

  const techniqueCards = [
    {
      t: "Timer map",
      b: "Use 1 idea per sentence. If time is short: Answer + 2 details + close.",
      fr: "1 idée par phrase. Si le temps est court : Réponse + 2 détails + conclusion."
    },
    {
      t: "Safety grammar",
      b: "Prefer simple tenses done well. Avoid long sentences. Use commas, not “and and and”.",
      fr: "Privilégie les temps simples bien maîtrisés. Évite les phrases longues. Utilise des virgules."
    },
    {
      t: "Polite power",
      b: "Exam + travel: add one polite request line. It boosts tone and clarity.",
      fr: "Examen + voyage : ajoute une phrase polie. Cela améliore le ton et la clarté."
    },
    {
      t: "Clarify + confirm",
      b: "When unsure: ask a short question and confirm the next step.",
      fr: "Si tu n’es pas sûr(e) : pose une question courte et confirme la prochaine étape."
    },
    {
      t: "Vocabulary ladder",
      b: "Use 2 basic words + 1 “upgrade” (e.g., problem → issue / request → inquiry).",
      fr: "2 mots simples + 1 mot plus précis (problem → issue / request → inquiry)."
    },
    {
      t: "Micro-templates",
      b: "Email structure: Greeting → Purpose → Details → Request → Closing.",
      fr: "Structure email : Salutation → But → Détails → Demande → Formule de fin."
    },
  ];

  const safeKit = [
    {t:"I’d like to…", b:"I’d like to confirm my reservation for…", fr:"Je voudrais confirmer…"},
    {t:"I’m writing to…", b:"I’m writing to ask for more information about…", fr:"Je vous écris pour…"},
    {t:"There is/There are…", b:"There is an issue with… / There are two points…", fr:"Il y a…"},
    {t:"Could you…?", b:"Could you tell me if breakfast is included?", fr:"Pourriez-vous… ?"},
    {t:"I’m available…", b:"I’m available on Monday or Tuesday.", fr:"Je suis disponible…"},
    {t:"Thank you in advance.", b:"Thank you in advance for your help.", fr:"Merci d’avance."},
  ];

  const politeKit = [
    {t:"Would it be possible to…", b:"…change the date to Friday?", fr:"Serait-il possible de… ?"},
    {t:"Could you please confirm…", b:"…the total price and taxes?", fr:"Pouvez-vous confirmer… ?"},
    {t:"I would appreciate it if…", b:"…you could send me the details.", fr:"J’apprécierais si…"},
    {t:"Just to clarify…", b:"…is the room quiet (not facing the street)?", fr:"Juste pour clarifier…"},
    {t:"Could you provide…", b:"…specifications (size, accessibility, check-in time)?", fr:"Pouvez-vous fournir…"},
    {t:"If possible,", b:"…could we have a late check-out?", fr:"Si possible…"},
  ];

  const vocab = [
    // Booking & specs
    {cat:"Booking & specs", en:"reservation", fr:"réservation", ex:"I’d like to make a reservation for two nights."},
    {cat:"Booking & specs", en:"availability", fr:"disponibilité", ex:"Could you confirm availability for next weekend?"},
    {cat:"Booking & specs", en:"rate (per night)", fr:"tarif (par nuit)", ex:"What is the rate per night, including taxes?"},
    {cat:"Booking & specs", en:"deposit", fr:"acompte", ex:"Do you require a deposit?"},
    {cat:"Booking & specs", en:"cancellation policy", fr:"conditions d’annulation", ex:"What is your cancellation policy?"},
    {cat:"Booking & specs", en:"check-in / check-out", fr:"arrivée / départ", ex:"What time is check-in and check-out?"},
    {cat:"Booking & specs", en:"late check-out", fr:"départ tardif", ex:"Would late check-out be possible?"},
    {cat:"Booking & specs", en:"accessibility", fr:"accessibilité", ex:"Is the room accessible (step-free access)?"},
    {cat:"Booking & specs", en:"quiet room", fr:"chambre calme", ex:"Could I request a quiet room?"},
    {cat:"Booking & specs", en:"double bed / twin beds", fr:"lit double / lits jumeaux", ex:"Do you have twin beds available?"},
    {cat:"Booking & specs", en:"included", fr:"inclus", ex:"Is breakfast included?"},
    {cat:"Booking & specs", en:"extra charge", fr:"supplément", ex:"Is there an extra charge for parking?"},

    // Problems & solutions
    {cat:"Problems & solutions", en:"issue", fr:"problème", ex:"There is an issue with the air conditioning."},
    {cat:"Problems & solutions", en:"refund", fr:"remboursement", ex:"Could you offer a refund or a discount?"},
    {cat:"Problems & solutions", en:"delay", fr:"retard", ex:"My flight has a delay of two hours."},
    {cat:"Problems & solutions", en:"to reschedule", fr:"reprogrammer", ex:"Can we reschedule the tour to tomorrow?"},
    {cat:"Problems & solutions", en:"to replace", fr:"remplacer", ex:"Could you replace the room key?"},
    {cat:"Problems & solutions", en:"to fix", fr:"réparer", ex:"Could someone fix the shower, please?"},
    {cat:"Problems & solutions", en:"to apologize", fr:"s’excuser", ex:"I’d like to apologize for the inconvenience."},
    {cat:"Problems & solutions", en:"inconvenience", fr:"désagrément", ex:"Thank you for your help despite the inconvenience."},
    {cat:"Problems & solutions", en:"lost and found", fr:"objets trouvés", ex:"Is there a lost-and-found office?"},
    {cat:"Problems & solutions", en:"to complain", fr:"se plaindre", ex:"I’d like to complain about the noise."},

    // Transport & directions
    {cat:"Transport & directions", en:"platform", fr:"quai", ex:"Which platform does the train leave from?"},
    {cat:"Transport & directions", en:"connection", fr:"correspondance", ex:"Do I have a connection in London?"},
    {cat:"Transport & directions", en:"to board", fr:"embarquer", ex:"When can we board the plane?"},
    {cat:"Transport & directions", en:"gate", fr:"porte d’embarquement", ex:"Which gate is it?"},
    {cat:"Transport & directions", en:"to miss (a train/flight)", fr:"rater", ex:"I missed my train."},
    {cat:"Transport & directions", en:"directions", fr:"itinéraire", ex:"Could you give me directions to the museum?"},
    {cat:"Transport & directions", en:"turn left / right", fr:"tournez à gauche / droite", ex:"Turn left at the next traffic lights."},
    {cat:"Transport & directions", en:"how long does it take?", fr:"combien de temps ça prend ?", ex:"How long does it take to get there?"},

    // Food & health
    {cat:"Food & health", en:"allergy", fr:"allergie", ex:"I have a nut allergy."},
    {cat:"Food & health", en:"gluten-free", fr:"sans gluten", ex:"Do you have gluten-free options?"},
    {cat:"Food & health", en:"to recommend", fr:"recommander", ex:"Could you recommend a local dish?"},
    {cat:"Food & health", en:"prescription", fr:"ordonnance", ex:"I need a prescription refill."},
    {cat:"Food & health", en:"pharmacy", fr:"pharmacie", ex:"Is there a pharmacy nearby?"},

    // Polite interaction
    {cat:"Polite interaction", en:"Could you repeat that?", fr:"Pouvez-vous répéter ?", ex:"Sorry, could you repeat that more slowly?"},
    {cat:"Polite interaction", en:"I’m not sure I understood.", fr:"Je ne suis pas sûr(e) d’avoir compris.", ex:"I’m not sure I understood—do you mean…?"},
    {cat:"Polite interaction", en:"Just to confirm…", fr:"Juste pour confirmer…", ex:"Just to confirm, check-in is at 3 pm, right?"},
    {cat:"Polite interaction", en:"That sounds great.", fr:"Ça a l’air super.", ex:"That sounds great—let’s do that."},
    {cat:"Polite interaction", en:"I would prefer…", fr:"Je préférerais…", ex:"I would prefer a table by the window."},
  ];

  const grammarBank = [
    {
      q: "You want to be polite. Which is best?",
      options: ["Give me the price.", "Can you give me the price, please?", "You give me the price.", "Price?"],
      a: 1,
      why: "Polite modal + please. Short and clear.",
      fr: "Modal + please : poli et clair."
    },
    {
      q: "Choose the correct preposition: I’ll arrive ___ Friday.",
      options: ["in", "on", "at", "to"],
      a: 1,
      why: "Days → on (on Friday).",
      fr: "Jour → on (on Friday)."
    },
    {
      q: "Choose the correct: I’d like ___ a reservation.",
      options: ["make", "to make", "making", "made"],
      a: 1,
      why: "Would like + to + verb.",
      fr: "Would like + to + verbe."
    },
    {
      q: "Best option: The room ___ noisy last night.",
      options: ["is", "was", "were", "has"],
      a: 1,
      why: "Past event → Past Simple.",
      fr: "Événement passé → Past Simple."
    },
    {
      q: "Correct question form: ___ breakfast included?",
      options: ["Is", "Are", "Do", "Have"],
      a: 0,
      why: "Included is adjective/past participle → 'Is ... included?'",
      fr: "Forme correcte : Is … included ?"
    },
    {
      q: "Choose the best: I ___ in Paris for 20 years.",
      options: ["live", "lived", "have lived", "am living"],
      a: 2,
      why: "From past to now → Present Perfect (have lived).",
      fr: "Du passé jusqu’à maintenant → Present Perfect."
    },
    {
      q: "You need a polite request for specifications. Choose:",
      options: ["Send me the details.", "Could you provide the specifications, please?", "Specifications now.", "I want details."],
      a: 1,
      why: "Could you + verb + please is a safe polite pattern.",
      fr: "Could you… please : formule polie “sûre”."
    },
    {
      q: "Choose the correct: If it’s possible, ___ late check-out.",
      options: ["I would like", "I like", "I liked", "I am like"],
      a: 0,
      why: "Conditional politeness: I would like.",
      fr: "Politesse conditionnelle : I would like."
    },
    {
      q: "Correct: I’m looking forward ___ your reply.",
      options: ["to", "for", "at", "on"],
      a: 0,
      why: "Looking forward to + noun/gerund.",
      fr: "Looking forward to + nom/ing."
    },
    {
      q: "Choose: Could you tell me ___ the tour starts?",
      options: ["what time", "what", "when time", "how time"],
      a: 0,
      why: "Correct indirect question: what time.",
      fr: "Question indirecte : what time."
    },
  ];

  const wordBank = [
    {q:"Choose the best collocation: ___ a reservation", options:["do","make","take","play"], a:1, why:"We make a reservation."},
    {q:"Choose the best: The train ___ from platform 3", options:["leaves","leaves to","lefts","go"], a:0, why:"Train leaves from..." },
    {q:"Choose the best: Could you ___ the total price?", options:["confirm","confirmate","sure","secure"], a:0, why:"Confirm is the verb."},
    {q:"Choose the best: I’d like a ___ room (not facing the street)", options:["quite","quiet","quit","quitting"], a:1, why:"Quiet = not noisy."},
    {q:"Choose the best: I’m allergic ___ peanuts.", options:["to","with","at","for"], a:0, why:"Allergic to."},
    {q:"Choose the best: I missed my ___", options:["connection","connect","connecting","connected"], a:0, why:"Missed my connection."},
    {q:"Choose the best: Can we ___ the tour?", options:["reschedule","re-schedule it to","schedule again","shifted"], a:0, why:"Reschedule is natural."},
    {q:"Choose the best: I’d like to file a ___", options:["complaint","complain","complaining","complete"], a:0, why:"File a complaint."},
    {q:"Choose the best: Is breakfast ___?", options:["included","including","include","inclusion"], a:0, why:"Included."},
    {q:"Choose the best: Could you ___ me directions?", options:["give","give to","say","tell to"], a:0, why:"Give me directions."},
  ];

  const orderTasks = [
    {words:["Could","you","please","confirm","the","total","price","?"], answer:"Could you please confirm the total price ?"},
    {words:["I’d","like","to","change","my","reservation","to","Friday","."], answer:"I’d like to change my reservation to Friday ."},
    {words:["Just","to","clarify",",","is","breakfast","included","?"], answer:"Just to clarify , is breakfast included ?"},
    {words:["I","missed","my","connection","because","my","flight","was","delayed","."], answer:"I missed my connection because my flight was delayed ."},
    {words:["Would","it","be","possible","to","have","a","quiet","room","?"], answer:"Would it be possible to have a quiet room ?"},
    {words:["Thank","you","in","advance","for","your","help","."], answer:"Thank you in advance for your help ."},
  ];

  const speakScenarios = [
    {
      id:"hotel",
      title:"Hotel check-in + special request",
      questions:[
        "Good afternoon. How can I help you today?",
        "Could you confirm your booking details (name, dates, number of nights)?",
        "Do you have any special requests for your room?",
        "Can you tell me what time you expect to arrive?",
        "Would you like breakfast included? Any dietary restrictions?",
        "Is there anything else you need before check-in?"
      ],
      phrases:["I have a reservation under…","Could you confirm…?","I’d like to request…","Just to clarify…","If possible, …","Thank you for your help."],
      models:{
        A2:"Hello. I have a reservation under Martin. It is for two nights. Could you confirm the price, please? If possible, I would like a quiet room. I will arrive around 4 pm. Thank you.",
        B1:"Good afternoon. I have a reservation under Martin for two nights. Could you please confirm the total price including taxes? If possible, I’d like a quiet room, not facing the street. I’ll arrive around 4 pm. Thank you for your help.",
        B2:"Good afternoon. I’m checking in for a two-night stay under Martin. Could you confirm the total amount, including taxes and any extra charges? If possible, I’d appreciate a quiet room away from the elevator. I expect to arrive around 4 pm. Thanks in advance—please let me know if you need any further details."
      }
    },
    {
      id:"flight",
      title:"Airport — flight delay + rebooking",
      questions:[
        "Hello. What seems to be the problem today?",
        "Can you tell me your flight number and destination?",
        "How long is the delay? Have you received an email or message?",
        "Do you want to rebook or wait for this flight?",
        "Do you have checked luggage?",
        "Would you like me to confirm the new itinerary by email?"
      ],
      phrases:["My flight is delayed.","I’d like to rebook, please.","Do I have a connection?","Could you confirm by email?","I have checked luggage.","Thank you—this is very helpful."],
      models:{
        A2:"Hello. My flight is delayed. It is flight AF123 to Dublin. I would like to rebook, please. I have checked luggage. Could you confirm by email? Thank you.",
        B1:"Hi. My flight AF123 to Dublin is delayed. I’d like to rebook, please, because I have a connection. I also have checked luggage. Could you confirm the new itinerary by email? Thanks.",
        B2:"Hi there. My flight AF123 to Dublin has been delayed, and I’m worried about missing my connection. Could you help me rebook on the next available flight? I have checked luggage—will it transfer automatically? Please confirm the updated itinerary by email. Thank you."
      }
    },
    {
      id:"restaurant",
      title:"Restaurant — reservation + allergy",
      questions:[
        "Hello, how can I help you?",
        "What date and time would you like to book for?",
        "How many people will be in your party?",
        "Do you have any allergies or dietary requirements?",
        "Would you prefer indoor seating or a terrace table?",
        "Could you confirm your name and phone number?"
      ],
      phrases:["I’d like to book a table…","We are two/three/four.","I have an allergy to…","Could we sit…?","Just to confirm…","Thank you, see you then."],
      models:{
        A2:"Hello. I’d like to book a table for two at 7 pm. I have a nut allergy. Could we sit inside, please? My name is Martin. Thank you.",
        B1:"Hi. I’d like to reserve a table for two at 7 pm. I have a nut allergy, so could you confirm if you have safe options? We’d prefer indoor seating. My name is Martin. Thank you.",
        B2:"Good evening. I’d like to reserve a table for two at 7 pm. I have a nut allergy—could you confirm you can accommodate that safely? If possible, we’d prefer a quiet indoor table. My name is Martin, and my phone number is… Thanks, see you then."
      }
    },
    {
      id:"luggage",
      title:"Hotel/airport — lost luggage",
      questions:[
        "Hello. What can I do for you today?",
        "When and where did you last see your luggage?",
        "Can you describe the suitcase (size, color, brand)?",
        "Do you have any valuables or medication inside?",
        "Where can we contact you?",
        "Would you like a reference number for your claim?"
      ],
      phrases:["I can describe it…","It’s a medium black suitcase.","I last saw it…","Here is my contact information…","Could you give me a reference number?","Thank you for your help."],
      models:{
        A2:"Hello. I lost my luggage. I last saw it at the airport. It is a medium black suitcase. Here is my phone number. Could you give me a reference number? Thank you.",
        B1:"Hi. My suitcase is missing. I last saw it at the baggage belt in Dublin airport. It’s a medium black suitcase. Could you take my contact details and give me a reference number? Thank you.",
        B2:"Hi. My luggage didn’t arrive. I last saw it at the baggage belt in Dublin airport about 20 minutes ago. It’s a medium black suitcase with a red tag. Could you register a claim, take my contact details, and give me a reference number? Thank you for your help."
      }
    },
    {
      id:"tour",
      title:"Tour booking — request specifications",
      questions:[
        "Hello. How can I help you?",
        "Which tour are you interested in, and on what date?",
        "What information would you like to know before booking?",
        "Do you need accessibility or special assistance?",
        "Would you like a confirmation email with the details?",
        "Do you want to book now or ask a few more questions?"
      ],
      phrases:["I’m interested in…","Could you provide the details?","Is it suitable for…?","How long does it last?","What is included?","Thank you in advance."],
      models:{
        A2:"Hello. I’m interested in the city tour on Saturday. Could you provide the details, please? How long does it last and what is included? Thank you in advance.",
        B1:"Hi. I’m interested in the city tour on Saturday. Could you provide details like duration, meeting point, and what’s included? Also, is it suitable for people with limited mobility? Thank you.",
        B2:"Hello. I’m interested in the city tour on Saturday. Could you provide the specifications—duration, meeting point, language options, and what’s included in the price? Also, is it suitable for guests with limited mobility? Please send a confirmation email with the details. Thank you in advance."
      }
    }
  ];

  const prodPrompts = [
    {
      id:"plan",
      title:"Travel plans (future)",
      text:"Talk about a trip you would like to take soon. Where will you go, how will you get there, and what will you do? Give 3 reasons.",
      builder:[
        ["Plan","I’m planning to travel to ___ next ___. I will go by ___."],
        ["Activities","I’d like to ___, ___, and ___."],
        ["Reasons","First, ___. Second, ___. Finally, ___."],
        ["Close","That’s why this trip is important to me."],
      ],
      models:{
        A2:"I’m planning to travel to Italy next month. I will go by plane. I’d like to visit Rome, see museums, and try local food. First, I love history. Second, I want to relax. Finally, I want to practice English with tourists. That’s why this trip is important to me.",
        B1:"I’m planning to travel to Italy next month, and I’ll go by plane. I’d like to visit Rome, see museums, and try local food. I want this trip because I love history, I need a break, and I’d like to meet people and practice my English. That’s why I’m excited about it.",
        B2:"I’m planning a trip to Italy next month, and I’ll travel by plane. I’d like to spend a few days in Rome, visit museums, and explore local neighborhoods for food and culture. I want this trip because I enjoy history, I need a real change of pace, and I’d like to practice English in real situations. Overall, it’s a perfect mix of discovery and relaxation."
      }
    },
    {
      id:"problem",
      title:"Problem solved (past)",
      text:"Describe a travel problem you solved. What happened, what did you do, and what was the result?",
      builder:[
        ["Issue","Last ___, I had a problem with ___."],
        ["Action","I ___, then I ___."],
        ["Result","As a result, ___."],
        ["Lesson","Next time, I will ___."],
      ],
      models:{
        A2:"Last year, I had a problem with my train. It was cancelled. I asked the staff for help. Then I bought a new ticket. As a result, I arrived later but I arrived. Next time, I will check the schedule early.",
        B1:"Last year my train was cancelled, so I had to find another option. I went to the information desk, asked about alternatives, and changed my ticket. As a result, I arrived a bit late but everything worked out. Next time I’ll check messages earlier and have a backup plan.",
        B2:"Last year my train was cancelled at the last minute. I went straight to the information desk, asked about the fastest alternative, and changed my ticket to the next available route. As a result, I arrived a little late, but I avoided missing my hotel check-in. Next time, I’ll always check real-time updates and keep a backup option."
      }
    },
    {
      id:"specs",
      title:"Ask for specifications (hotel/tour)",
      text:"Explain what you need before booking: specifications, accessibility, times, what is included, and how you want the information sent to you.",
      builder:[
        ["Purpose","Before booking, I need to confirm a few details."],
        ["Specs","Could you tell me ___, ___, and ___?"],
        ["Accessibility","Also, I’d like to know if ___ is available."],
        ["Close","Please send the information by email. Thank you in advance."],
      ],
      models:{
        A2:"Before booking, I need to confirm a few details. Could you tell me the price, the check-in time, and what is included? I also want to know if the room is accessible. Please send the information by email. Thank you in advance.",
        B1:"Before booking, I need to confirm a few details. Could you tell me the total price, check-in time, and what’s included? I’d also like to know about accessibility and whether a quiet room is available. Please send the information by email. Thank you in advance.",
        B2:"Before booking, I’d like to confirm a few details. Could you tell me the total price including taxes, the check-in/check-out times, and exactly what’s included (breakfast, parking, Wi‑Fi)? I’d also like to confirm accessibility and the possibility of a quiet room. Please send the specifications by email. Thank you in advance."
      }
    },
  ];

  const callScripts = [
    {
      title:"Phone call — hotel booking + specs",
      lines:[
        "Hello, I’d like to make a reservation, please.",
        "Could you tell me if you have availability from ___ to ___?",
        "What is the total price per night, including taxes?",
        "Is breakfast included?",
        "If possible, I’d like a quiet room. Is that available?",
        "Could you confirm everything by email? Thank you."
      ]
    },
    {
      title:"Phone call — tour inquiry (request specifications)",
      lines:[
        "Hello, I’m interested in the ___ tour on ___.",
        "Could you provide the specifications: duration, meeting point, and language?",
        "What is included in the price?",
        "Is it suitable for someone with limited mobility?",
        "Could you send the details by email, please? Thank you in advance."
      ]
    },
    {
      title:"Phone call — reporting a problem (polite complaint)",
      lines:[
        "Hello, I’m calling about a problem with my room.",
        "There is an issue with ___.",
        "Could someone come to fix it, please?",
        "If it can’t be fixed quickly, would it be possible to change rooms?",
        "Thank you for your help."
      ]
    }
  ];

  const dialogues = [
    {
      ctx:"Hotel front desk",
      turns:[
        {s:"Reception", t:"Good afternoon. How can I help you?"},
        {s:"You", q:"Choose the best reply:", options:[
          "Give me a room.",
          "I have a reservation under Martin for two nights.",
          "Where is the restaurant?"
        ], a:1, why:"Start with your booking details."},
        {s:"Reception", t:"Great. Do you have any special requests?"},
        {s:"You", q:"Choose the best reply:", options:[
          "Yes, if possible, a quiet room away from the elevator.",
          "I want quiet.",
          "No. Quiet."
        ], a:0, why:"Polite + specific request."},
      ]
    },
    {
      ctx:"Tour company",
      turns:[
        {s:"Agent", t:"Hello, how can I help you?"},
        {s:"You", q:"Choose the best reply:", options:[
          "I want tour.",
          "I’m interested in the city tour. Could you provide details, please?",
          "City."
        ], a:1, why:"Clear purpose + polite request."},
        {s:"Agent", t:"Sure. What details do you need?"},
        {s:"You", q:"Choose the best reply:", options:[
          "How long is it and what is included?",
          "What included?",
          "Included?"
        ], a:0, why:"Full question with two key specifications."},
      ]
    },
    {
      ctx:"Airport desk",
      turns:[
        {s:"Staff", t:"Hello. How can I help you today?"},
        {s:"You", q:"Choose the best reply:", options:[
          "Flight problem.",
          "My flight is delayed and I might miss my connection. Could you help me rebook, please?",
          "Rebook me."
        ], a:1, why:"States issue + request politely."},
        {s:"Staff", t:"Okay. Do you have checked luggage?"},
        {s:"You", q:"Choose the best reply:", options:[
          "Yes, I do. Will it transfer automatically?",
          "Luggage yes.",
          "Maybe."
        ], a:0, why:"Answer + follow-up question."},
      ]
    },
  ];

  const writingTasks = [
    {
      id:"hotelInfo",
      title:"Email — request information/specifications (hotel)",
      prompt:"Write an email to a hotel to request specifications before booking. Include: dates, number of nights, total price (with taxes), what is included (breakfast/Wi‑Fi), a quiet room request, and accessibility needs. Ask them to confirm by email. (125+ words)",
      lines:[
        "Subject: Request for information — reservation from ___ to ___",
        "Dear ___,",
        "I’m writing to ask for information about…",
        "Could you please confirm…?",
        "If possible, I would like…",
        "Thank you in advance for your help.",
        "Kind regards,",
        "___"
      ],
      template:"Subject: Request for information — reservation from [DATE] to [DATE]\n\nDear [NAME/TEAM],\n\nI’m writing to request information before booking a room from [DATE] to [DATE] for [NUMBER] nights. Could you please confirm your availability and the total price per night, including taxes and any extra charges?\n\nCould you also tell me what is included in the rate (breakfast, Wi‑Fi, parking)? If possible, I would like a quiet room, not facing the street. In addition, I would like to confirm accessibility (step-free access / elevator) because [REASON].\n\nPlease send the specifications and confirmation by email. Thank you in advance for your help.\n\nKind regards,\n[NAME]",
      models:{
        A2:"Subject: Request for information — reservation from 12 to 14 May\n\nDear Sir or Madam,\n\nI would like to book a room from 12 to 14 May for two nights. Could you please confirm availability and the total price per night, including taxes?\n\nIs breakfast included? Is Wi‑Fi included? If possible, I would like a quiet room, not facing the street. I also need step-free access because I have a knee problem.\n\nCould you please send me the details by email? Thank you in advance for your help.\n\nKind regards,\nMarie Martin",
        B1:"Subject: Request for information — reservation from 12 to 14 May\n\nDear Team,\n\nI’m writing to ask for information before booking a room from 12 to 14 May for two nights. Could you please confirm your availability and the total price per night, including taxes?\n\nCould you also tell me what is included in the rate (breakfast and Wi‑Fi)? If possible, I’d like a quiet room, not facing the street. In addition, I would like to confirm accessibility (step-free access / elevator).\n\nPlease send the specifications and confirmation by email. Thank you in advance for your help.\n\nKind regards,\nMarie Martin",
        B2:"Subject: Request for information — reservation from 12 to 14 May\n\nDear Reservations Team,\n\nI’m writing to request details before confirming a reservation from 12 to 14 May for two nights. Could you please confirm availability and the total price per night, including taxes and any additional fees (for example, parking or city tax)?\n\nCould you also clarify what is included in the rate (breakfast, Wi‑Fi, and any other services)? If possible, I’d appreciate a quiet room away from the elevator and not facing the street. Finally, I would like to confirm accessibility (step-free access and elevator), as I may have limited mobility.\n\nPlease send the specifications and confirmation by email at your earliest convenience. Thank you in advance for your assistance.\n\nKind regards,\nMarie Martin"
      }
    },
    {
      id:"complaint",
      title:"Email — polite complaint + solution",
      prompt:"Write an email to a hotel to report a problem (noise or broken shower). Explain what happened, what you already tried, and what you want as a solution (fix / room change / discount). Stay polite and clear. (125+ words)",
      lines:[
        "Subject: Issue with room ___ — request for assistance",
        "Dear ___,",
        "I’m writing to report an issue with…",
        "I tried… but…",
        "Could you please…?",
        "Thank you for your help.",
        "Kind regards,",
        "___"
      ],
      template:"Subject: Issue with room [NUMBER] — request for assistance\n\nDear [NAME/TEAM],\n\nI’m writing to report an issue with my room ([NUMBER]). Last night, there was significant noise from [SOURCE], and I was unable to sleep. I also tried to close the windows and use earplugs, but it didn’t solve the problem.\n\nCould you please send someone to check the issue? If it can’t be fixed quickly, would it be possible to change rooms? If neither option is possible, I would appreciate a discount for the inconvenience.\n\nThank you in advance for your help. Please let me know what you can do.\n\nKind regards,\n[NAME]",
      models:{
        A2:"Subject: Issue with room 203 — request for help\n\nDear Team,\n\nI’m writing to report a problem with my room 203. Last night it was very noisy and I could not sleep. I tried to close the window but it was still noisy.\n\nCould you please help me? If possible, I would like to change rooms. If not, could you offer a discount?\n\nThank you for your help.\n\nKind regards,\nMarie Martin",
        B1:"Subject: Issue with room 203 — request for assistance\n\nDear Team,\n\nI’m writing to report an issue with my room (203). Last night there was a lot of noise from the street, and I couldn’t sleep. I tried to close the window and use earplugs, but it didn’t solve the problem.\n\nCould you please send someone to check the issue? If it can’t be fixed quickly, would it be possible to change rooms? If not, I would appreciate a discount for the inconvenience.\n\nThank you in advance for your help.\n\nKind regards,\nMarie Martin",
        B2:"Subject: Issue with room 203 — request for assistance\n\nDear Front Desk Team,\n\nI’m writing to report an issue with my room (203). Unfortunately, there was significant street noise last night, and I was unable to sleep. I tried closing the windows and using earplugs, but the problem continued.\n\nCould you please investigate the situation? If it cannot be resolved quickly, would it be possible to move to a quieter room? If a room change is not available, I would appreciate a gesture of goodwill, such as a discount, given the inconvenience.\n\nThank you in advance for your assistance. I look forward to your reply.\n\nKind regards,\nMarie Martin"
      }
    },
    {
      id:"story",
      title:"Story — travel mishap (image-style task)",
      prompt:"Write a short story about a travel mishap (missing a train / lost luggage / wrong hotel). Use a clear timeline: first → then → after that → finally. (125+ words)",
      lines:[
        "First,…",
        "Then,…",
        "After that,…",
        "Finally,…"
      ],
      template:"First, I arrived at the station early because I wanted to be on time. Then I realized I had left my ticket on my phone, and my phone battery was almost empty. After that, I asked a staff member for help and found a charging point. Finally, I managed to show my ticket and board the train. I was stressed, but I solved the problem by staying calm and asking for help.",
      models:{
        A2:"First, I went to the train station. I was happy because I was going on holiday. Then I saw that my train was cancelled. I was worried. After that, I went to the information desk and asked for another train. The staff helped me and changed my ticket. Finally, I took a later train and arrived in the evening. I was tired but relieved.",
        B1:"First, I arrived at the station early because I didn’t want to miss my train. Then I saw on the screen that my train was cancelled. I felt stressed because I had a hotel reservation. After that, I went to the information desk and asked for an alternative. The staff changed my ticket and explained the new platform. Finally, I boarded a later train and arrived a few hours late, but everything worked out.",
        B2:"First, I arrived at the station early because I wanted to be on time for my trip. Then I saw on the departures board that my train had been cancelled due to a technical issue. I felt stressed because I had a hotel reservation and a scheduled tour the next morning. After that, I went straight to the information desk, asked about the fastest alternative, and changed my ticket to a different route with one connection. Finally, I arrived a few hours late but avoided canceling my plans. The key was staying calm, asking clear questions, and confirming each step."
      }
    },
    {
      id:"tourEmail",
      title:"Email — ask a tour operator for specifications",
      prompt:"Write an email to a tour operator. Ask for specifications: duration, meeting point, language, what is included, accessibility, and refund policy. (125+ words)",
      lines:[
        "Subject: Request for tour details — ___ tour on ___",
        "Dear ___,",
        "I’m interested in…",
        "Could you confirm…?",
        "Thank you in advance…",
        "Kind regards,",
        "___"
      ],
      template:"Subject: Request for tour details — [TOUR NAME] on [DATE]\n\nDear [NAME/TEAM],\n\nI’m interested in booking the [TOUR NAME] tour on [DATE], and I would like to confirm a few details before I book. Could you please tell me the duration of the tour, the meeting point, and the language options?\n\nCould you also clarify what is included in the price (tickets, guide, transport)? In addition, I would like to know whether the tour is suitable for someone with limited mobility and whether there are any stairs.\n\nFinally, could you confirm your refund and cancellation policy? Please send the specifications by email. Thank you in advance for your help.\n\nKind regards,\n[NAME]",
      models:{
        A2:"Subject: Tour details — city tour on Saturday\n\nDear Team,\n\nI’m interested in the city tour on Saturday. Could you tell me how long it is and where we meet? Is it in English?\n\nWhat is included in the price? I also need to know if it is accessible because I have limited mobility. Could you also tell me the cancellation policy?\n\nPlease send me the details by email. Thank you in advance.\n\nKind regards,\nMarie Martin",
        B1:"Subject: Request for tour details — city tour on Saturday\n\nDear Team,\n\nI’m interested in booking the city tour on Saturday, and I’d like to confirm a few details before I book. Could you tell me the duration, the meeting point, and the language options?\n\nCould you also clarify what is included in the price? In addition, I’d like to know if the tour is suitable for someone with limited mobility. Finally, could you confirm your cancellation and refund policy?\n\nPlease send the specifications by email. Thank you in advance for your help.\n\nKind regards,\nMarie Martin",
        B2:"Subject: Request for tour details — city tour on Saturday\n\nDear Customer Service Team,\n\nI’m interested in booking the city tour on Saturday and would like to confirm a few details before proceeding. Could you please confirm the tour duration, meeting point, start time, and available language options?\n\nCould you also clarify what is included in the price (guide, tickets, transport)? In addition, I would like to confirm accessibility, as I may have limited mobility—are there stairs or long walking sections?\n\nFinally, could you confirm your cancellation and refund policy? Please send the specifications by email at your earliest convenience. Thank you in advance for your assistance.\n\nKind regards,\nMarie Martin"
      }
    },
  ];

  const feedbackStems = [
    {t:"Clarity", b:"Good structure. Now shorten sentences and remove repetition.", fr:"Bonne structure. Raccourcir les phrases et enlever les répétitions."},
    {t:"Grammar", b:"Watch articles and prepositions (a/the, in/on/at).", fr:"Attention aux articles et prépositions (a/the, in/on/at)."},
    {t:"Politeness", b:"Add one polite request line (Could you… please?).", fr:"Ajoute une phrase polie (Could you… please?)."},
    {t:"Vocabulary", b:"Replace basic words with one upgrade (problem→issue).", fr:"Remplacer 1 mot simple par 1 mot plus précis (problem→issue)."},
    {t:"Structure", b:"Add a clear closing request: Please confirm by email.", fr:"Ajouter une demande finale : Please confirm by email."},
  ];

  const upgradeList = [
    {t:"request → inquiry", b:"I have an inquiry about…", fr:"inquiry = demande"},
    {t:"problem → issue", b:"There is an issue with…", fr:"issue = problème"},
    {t:"tell me → let me know", b:"Please let me know if…", fr:"let me know = me dire"},
    {t:"because → due to", b:"due to a delay", fr:"due to = à cause de"},
    {t:"need → would appreciate", b:"I would appreciate a confirmation.", fr:"would appreciate = apprécierais"},
  ];

  const mistakeRules = [
    {re:/\binformations\b/ig, msg:"“Information” is uncountable (no -s).", fr:"“Information” est indénombrable (pas de -s)."},
    {re:/\badvices\b/ig, msg:"“Advice” is uncountable (no -s).", fr:"“Advice” est indénombrable."},
    {re:/\bI am agree\b/ig, msg:"Say: “I agree” (not *I am agree).", fr:"Dire : “I agree”."},
    {re:/\bdepend of\b/ig, msg:"Say: “depend on”.", fr:"Dire : “depend on”."},
    {re:/\bexplain me\b/ig, msg:"Say: “explain to me”.", fr:"Dire : “explain to me”."},
    {re:/\bI want to know if you can\b/ig, msg:"Upgrade: “Could you let me know whether…?”", fr:"Amélioration : “Could you let me know whether…?”"},
    {re:/\bsince [0-9]+ years\b/ig, msg:"Use “for X years” (since + date).", fr:"Utiliser “for X years” (since + date)."},
    {re:/\bI look forward to hear\b/ig, msg:"Say: “I look forward to hearing…”.", fr:"Dire : “I look forward to hearing…”."},
  ];

  // ---------- TTS ----------
  let voices = [];
  const loadVoices = () => {
    try{
      voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    }catch(e){ voices = []; }
  };
  const pickVoice = () => {
    if(!voices || !voices.length) return null;
    const acc = state.accent;
    const wants = acc === 'UK' ? ['en-GB','English (United Kingdom)','UK'] : ['en-US','English (United States)','US'];
    const match = voices.find(v => wants.some(w => (v.lang||'').includes(w) || (v.name||'').includes(w)));
    return match || voices.find(v => (v.lang||'').startsWith('en')) || voices[0];
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
  const addScore = (isCorrect) => {
    state.score.total += 1;
    if(isCorrect) state.score.correct += 1;
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
    // Inline FR fragments
    $$('.frInline').forEach(el => el.style.display = state.fr ? 'inline' : 'none');
    renderVocab(); // updates chips with FR line
    renderExam();
    renderCallScripts();
    renderKits();
    renderTechCards();
    renderWriting();
    renderMistakes();
  };

  // ---------- Level & accent ----------
  const setLevel = (lvl) => {
    state.level = lvl;
    $$('.segBtn[data-level]').forEach(b => b.classList.toggle('isOn', b.dataset.level === lvl));
    renderSpeaking();
    renderWriting();
    savePrefs();
  };
  const setAccent = (acc) => {
    state.accent = acc;
    $$('.segBtn[data-accent]').forEach(b => b.classList.toggle('isOn', b.dataset.accent === acc));
    savePrefs();
  };

  // ---------- Render blocks ----------
  const renderQuickChips = () => {
    const host = $('#quickChips');
    host.innerHTML = '';
    quickChips.forEach(c => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.innerHTML = `${escapeHtml(c.en)}${state.fr ? `<span class="sub">${escapeHtml(c.fr)}</span>` : ''}`;
      btn.addEventListener('click', () => speak(c.en));
      host.appendChild(btn);
    });
  };

  const renderExam = () => {
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

  const renderTechCards = () => {
    const host = $('#techCards');
    host.innerHTML = '';
    techniqueCards.forEach(c => {
      const div = document.createElement('div');
      div.className = 'panel';
      div.innerHTML = `
        <div class="miniTitle">Technique</div>
        <div class="h3">${escapeHtml(c.t)}</div>
        <div class="tiny muted" style="line-height:1.55;">${escapeHtml(c.b)}</div>
        ${state.fr ? `<div class="frOnly tiny muted" style="display:block; margin-top:8px; line-height:1.55;">${escapeHtml(c.fr)}</div>` : ''}
      `;
      host.appendChild(div);
    });
  };

  const kitItem = (x) => `
    <div class="kitItem">
      <div class="kTitle">${escapeHtml(x.t)}</div>
      <div class="kBody">${escapeHtml(x.b)}</div>
      ${state.fr && x.fr ? `<div class="kBody frOnly" style="display:block;">${escapeHtml(x.fr)}</div>` : ''}
    </div>
  `;
  const renderKits = () => {
    $('#safeKit').innerHTML = safeKit.map(kitItem).join('');
    $('#politeKit').innerHTML = politeKit.map(kitItem).join('');
    $('#feedbackStems').innerHTML = feedbackStems.map(kitItem).join('');
    $('#upgradeList').innerHTML = upgradeList.map(kitItem).join('');
  };

  // ---------- Vocabulary ----------
  const cats = (() => {
    const s = new Set(vocab.map(v => v.cat));
    return Array.from(s).sort();
  })();

  const setupVocabCats = () => {
    const sel = $('#vocabCat');
    cats.forEach(c => {
      const o = document.createElement('option');
      o.value = c;
      o.textContent = c;
      sel.appendChild(o);
    });
  };

  const getVocabFiltered = () => {
    const cat = $('#vocabCat').value;
    const q = ($('#vocabSearch').value || '').trim().toLowerCase();
    return vocab.filter(v => (cat === 'all' || v.cat === cat) &&
      (!q || v.en.toLowerCase().includes(q) || (v.fr||'').toLowerCase().includes(q)));
  };

  const renderVocab = () => {
    const list = getVocabFiltered();
    const chipsHost = $('#vocabChips');
    chipsHost.innerHTML = '';
    list.forEach(item => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.innerHTML = `${escapeHtml(item.en)}${state.fr ? `<span class="sub">${escapeHtml(item.fr)}</span>` : ''}`;
      b.addEventListener('click', () => speak(item.en));
      chipsHost.appendChild(b);
    });

    const listHost = $('#vocabList');
    const rows = list.map(it => `
      <div class="panel" style="margin-bottom:10px;">
        <div class="miniTitle">${escapeHtml(it.cat)}</div>
        <div style="font-weight:900;">${escapeHtml(it.en)} ${state.fr ? `<span class="muted">— ${escapeHtml(it.fr)}</span>` : ''}</div>
        <div class="tiny muted" style="margin-top:6px; line-height:1.5;">Example: ${escapeHtml(it.ex)}</div>
      </div>
    `).join('');
    listHost.innerHTML = rows || `<div class="tiny muted">No items found.</div>`;
  };

  // Matching game
  const newMatchSet = () => {
    const pick = shuffle(vocab).slice(0, 8);
    state.match.set = pick.map(x => ({...x, done:false}));
    state.match.selectedWord = null;
    state.match.progress = 0;
    $('#matchMsg').textContent = '';
    $('#matchProg').textContent = `0 / 8`;
    renderMatch();
  };

  const renderMatch = () => {
    const wordsHost = $('#matchWords');
    const catsHost = $('#matchCats');
    wordsHost.innerHTML = '';
    catsHost.innerHTML = '';

    const usedCats = Array.from(new Set(state.match.set.map(x => x.cat))).sort();
    // ensure 4 cats for gameplay (if fewer, add from global)
    while(usedCats.length < 4){
      const c = cats[Math.floor(Math.random()*cats.length)];
      if(!usedCats.includes(c)) usedCats.push(c);
    }
    const displayCats = shuffle(usedCats).slice(0,4);

    state.match.set.forEach((w, idx) => {
      const btn = document.createElement('button');
      btn.type='button';
      btn.className = 'wordBtn' + (w.done ? ' isOk':'') + ((state.match.selectedWord === idx) ? ' isSel':'');
      btn.textContent = w.en;
      btn.addEventListener('click', () => {
        if(w.done) return;
        state.match.selectedWord = idx;
        $$('.wordBtn').forEach(b => b.classList.remove('isSel'));
        btn.classList.add('isSel');
      });
      wordsHost.appendChild(btn);
    });

    displayCats.forEach(cat => {
      const btn = document.createElement('button');
      btn.type='button';
      btn.className = 'catBtn';
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        const i = state.match.selectedWord;
        if(i === null || i === undefined) return;
        const word = state.match.set[i];
        if(word.done) return;

        const ok = word.cat === cat;
        addScore(ok);
        const msg = ok ? '✅ Correct!' : `❌ Not this category. (${word.cat})`;
        $('#matchMsg').textContent = msg;
        if(ok){
          state.match.set[i].done = true;
          state.match.progress += 1;
          state.match.selectedWord = null;
          $('#matchProg').textContent = `${state.match.progress} / 8`;
          renderMatch();
          if(state.match.progress === 8){
            $('#matchMsg').textContent = '🎉 Great! New set?';
          }
        }else{
          // flash wrong
          const wordBtns = $$('.wordBtn');
          if(wordBtns[i]){
            wordBtns[i].classList.add('isBad');
            setTimeout(() => wordBtns[i].classList.remove('isBad'), 550);
          }
        }
      });
      catsHost.appendChild(btn);
    });
  };

  // ---------- Quizzes ----------
  const renderMCQ = (host, qObj, key) => {
    host.innerHTML = '';
    const q = document.createElement('div');
    q.className = 'prompt';
    q.innerHTML = `<div class="miniTitle">Question</div><div class="promptText">${escapeHtml(qObj.q)}</div>`;
    host.appendChild(q);

    const opts = document.createElement('div');
    opts.className = 'chips mt10';
    qObj.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.type='button';
      b.className = 'chip';
      b.textContent = opt;
      b.addEventListener('click', () => {
        const ok = i === qObj.a;
        addScore(ok);
        b.style.background = ok ? 'rgba(80,255,140,.18)' : 'rgba(255,100,120,.18)';
        // disable all
        $$('.chip', opts).forEach(x => x.disabled = true);
        const why = document.createElement('div');
        why.className = 'tiny muted mt10';
        why.innerHTML = `${ok ? '✅ Correct.' : '❌ Not quite.'} <strong>Why:</strong> ${escapeHtml(qObj.why || '')} ${state.fr && qObj.fr ? `<span class="frOnly" style="display:inline;">(${escapeHtml(qObj.fr)})</span>` : ''}`;
        host.appendChild(why);
      });
      opts.appendChild(b);
    });
    host.appendChild(opts);
  };

  let currentGrammar = null;
  let currentWord = null;

  const newGrammarQuiz = () => {
    currentGrammar = shuffle(grammarBank)[0];
    renderMCQ($('#grammarBox'), currentGrammar, 'g');
  };
  const newWordQuiz = () => {
    currentWord = shuffle(wordBank)[0];
    renderMCQ($('#wordBox'), currentWord, 'w');
  };

  // Sentence order
  const newOrderSet = () => {
    state.order.idx = 0;
    state.order.done = 0;
    $('#orderProg').textContent = `0 / ${orderTasks.length}`;
    loadOrderTask(0);
  };

  const loadOrderTask = (idx) => {
    const t = orderTasks[idx];
    state.order.bank = t.words.map((w, i) => ({w, i, used:false}));
    state.order.build = [];
    $('#orderMsg').textContent = '';
    renderOrder();
  };

  const renderOrder = () => {
    const bank = $('#orderBank');
    const build = $('#orderBuild');
    bank.innerHTML = '';
    build.innerHTML = '';

    state.order.bank.forEach((tok, idx) => {
      const b = document.createElement('button');
      b.type='button';
      b.className = 'orderToken' + (tok.used ? ' isUsed' : '');
      b.textContent = tok.w;
      b.disabled = tok.used;
      b.addEventListener('click', () => {
        tok.used = true;
        state.order.build.push(tok.w);
        renderOrder();
      });
      bank.appendChild(b);
    });

    state.order.build.forEach((w, i) => {
      const s = document.createElement('span');
      s.className = 'orderToken';
      s.textContent = w;
      build.appendChild(s);
    });
  };

  const orderUndo = () => {
    if(!state.order.build.length) return;
    const last = state.order.build.pop();
    // unuse first matching token
    const t = state.order.bank.find(x => x.w === last && x.used);
    if(t) t.used = false;
    renderOrder();
  };

  const orderCheck = () => {
    const target = orderTasks[state.order.idx].answer;
    const got = state.order.build.join(' ');
    const ok = got === target;
    addScore(ok);
    $('#orderMsg').textContent = ok ? '✅ Correct!' : '❌ Not yet. Try again or use Reveal.';
    if(ok){
      state.order.done += 1;
      $('#orderProg').textContent = `${state.order.done} / ${orderTasks.length}`;
      state.order.idx += 1;
      if(state.order.idx < orderTasks.length){
        setTimeout(() => loadOrderTask(state.order.idx), 500);
      }else{
        $('#orderMsg').textContent = '🎉 Finished! Click “New order” for a fresh run.';
      }
    }
  };

  const orderReveal = () => {
    const target = orderTasks[state.order.idx].answer;
    $('#orderMsg').textContent = `Answer: ${target}`;
  };

  // ---------- Speaking (interaction) ----------
  const fillSpeakingSelectors = () => {
    const sel = $('#speakScenario');
    sel.innerHTML = '';
    speakScenarios.forEach(s => {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.title;
      sel.appendChild(o);
    });
    state.speak.scenarioId = speakScenarios[0].id;
  };

  const renderSpeaking = () => {
    // scenario
    const scen = speakScenarios.find(s => s.id === state.speak.scenarioId) || speakScenarios[0];
    $('#speakQ').textContent = scen.questions[state.speak.idx] || '';
    $('#speakCount').textContent = `${state.speak.idx} / 6`;
    // phrases
    const ph = $('#speakPhrases');
    ph.innerHTML = '';
    scen.phrases.forEach(p => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent = p;
      b.addEventListener('click', () => {
        speak(p);
        const ta = $('#speakNotes');
        ta.value = (ta.value ? (ta.value + ' ') : '') + p;
        ta.focus();
      });
      ph.appendChild(b);
    });

    // model
    const model = scen.models[state.level] || '';
    $('#speakModel').textContent = model;
  };

  const speakNext = () => {
    const scen = speakScenarios.find(s => s.id === state.speak.scenarioId) || speakScenarios[0];
    state.speak.idx = Math.min(state.speak.idx + 1, scen.questions.length);
    if(state.speak.idx >= 6){
      $('#speakQ').textContent = "Done. Great job! Choose another scenario or restart.";
      $('#speakCount').textContent = `6 / 6`;
    }else{
      $('#speakQ').textContent = scen.questions[state.speak.idx];
      $('#speakCount').textContent = `${state.speak.idx} / 6`;
    }
  };

  const startCountdown = (which, seconds, onTick, onDone) => {
    let remaining = seconds;
    onTick(remaining);
    const timer = setInterval(() => {
      remaining -= 1;
      onTick(remaining);
      if(remaining <= 0){
        clearInterval(timer);
        onDone && onDone();
      }
    }, 1000);
    return timer;
  };

  const stopTimer = (timer) => { if(timer) clearInterval(timer); return null; };
  const fmtTime = (sec) => `${pad2(Math.floor(sec/60))}:${pad2(sec%60)}`;

  const speakStart = () => {
    const scen = speakScenarios.find(s => s.id === state.speak.scenarioId) || speakScenarios[0];
    if(state.speak.idx >= 6) state.speak.idx = 0;
    $('#speakQ').textContent = scen.questions[state.speak.idx];
    $('#speakCount').textContent = `${state.speak.idx} / 6`;
    // 45 sec by default
    state.speak.timer = stopTimer(state.speak.timer);
    state.speak.timer = startCountdown('speak', 45, (r) => { $('#speakTimer').textContent = fmtTime(r); },
      () => { $('#speakTimer').textContent = '00:00'; });
  };

  const speakStop = () => {
    state.speak.timer = stopTimer(state.speak.timer);
    $('#speakTimer').textContent = '00:00';
  };

  const speakListen = () => {
    const scen = speakScenarios.find(s => s.id === state.speak.scenarioId) || speakScenarios[0];
    const q = scen.questions[state.speak.idx] || scen.questions[0];
    speak(q);
  };

  // Model buttons
  const showSpeakModel = (lvl) => {
    const scen = speakScenarios.find(s => s.id === state.speak.scenarioId) || speakScenarios[0];
    $('#speakModel').textContent = scen.models[lvl] || '';
  };

  // ---------- Production (monologue) ----------
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
    // builder
    const host = $('#prodBuilder');
    host.innerHTML = '';
    p.builder.forEach(row => {
      const div = document.createElement('div');
      div.className = 'builderRow';
      div.innerHTML = `<div class="bLbl">${escapeHtml(row[0])}</div><div class="bBox">${escapeHtml(row[1])}</div>`;
      host.appendChild(div);
    });
  };

  const prodStart = (sec) => {
    state.prod.timer = stopTimer(state.prod.timer);
    state.prod.timer = startCountdown('prod', sec, (r) => { $('#prodTimer').textContent = fmtTime(r); },
      () => { $('#prodTimer').textContent = '00:00'; });
  };
  const prodStop = () => {
    state.prod.timer = stopTimer(state.prod.timer);
    $('#prodTimer').textContent = '00:00';
  };
  const prodListen = () => {
    const id = $('#prodPrompt').value;
    const p = prodPrompts.find(x => x.id === id) || prodPrompts[0];
    speak(p.text);
  };

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

  // Dialogue trainer
  let currentDialogue = null;
  const newDialogue = () => {
    currentDialogue = shuffle(dialogues)[0];
    renderDialogue();
  };
  const renderDialogue = () => {
    const host = $('#dialogueTrainer');
    host.innerHTML = '';
    if(!currentDialogue) return;
    const head = document.createElement('div');
    head.className = 'notice';
    head.innerHTML = `<div class="noticeTitle">${escapeHtml(currentDialogue.ctx)}</div>
                      <div class="noticeBody">Answer the “You” turns.</div>`;
    host.appendChild(head);

    currentDialogue.turns.forEach((turn, idx) => {
      const row = document.createElement('div');
      row.className = 'panel mt10';
      if(turn.t){
        row.innerHTML = `<div class="miniTitle">${escapeHtml(turn.s)}</div><div class="promptText">${escapeHtml(turn.t)}</div>`;
        host.appendChild(row);
      }else{
        row.innerHTML = `<div class="miniTitle">${escapeHtml(turn.s)}</div><div class="promptText">${escapeHtml(turn.q)}</div>`;
        const opts = document.createElement('div');
        opts.className = 'chips mt10';
        turn.options.forEach((op, i) => {
          const b = document.createElement('button');
          b.type='button';
          b.className='chip';
          b.textContent = op;
          b.addEventListener('click', () => {
            const ok = i === turn.a;
            addScore(ok);
            // disable all
            $$('.chip', opts).forEach(x => x.disabled = true);
            b.style.background = ok ? 'rgba(80,255,140,.18)' : 'rgba(255,100,120,.18)';
            const note = document.createElement('div');
            note.className = 'tiny muted mt10';
            note.textContent = (ok ? '✅ Correct. ' : '❌ Not quite. ') + turn.why;
            row.appendChild(note);
            speak(op);
          });
          opts.appendChild(b);
        });
        row.appendChild(opts);
        host.appendChild(row);
      }
    });
  };

  // ---------- Writing ----------
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

  const currentWriteTask = () => {
    const id = $('#writeTask').value;
    return writingTasks.find(t => t.id === id) || writingTasks[0];
  };

  const renderWriting = () => {
    const t = currentWriteTask();
    $('#writePrompt').textContent = t.prompt;

    // lines chips
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
    renderMistakes();
  };

  const updateWordCount = () => {
    const text = ($('#studentText').value || '').trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    $('#wordCount').textContent = String(words);
  };

  const writeListen = () => {
    const t = currentWriteTask();
    speak(t.prompt);
  };

  const writeStart = (sec) => {
    state.write.timer = stopTimer(state.write.timer);
    state.write.timer = startCountdown('write', sec, (r) => { $('#writeTimer').textContent = fmtTime(r); },
      () => { $('#writeTimer').textContent = '00:00'; });
  };
  const writeStop = () => {
    state.write.timer = stopTimer(state.write.timer);
    $('#writeTimer').textContent = '00:00';
  };

  const showModelWrite = () => {
    const t = currentWriteTask();
    const model = t.models[state.level] || '';
    const ta = $('#studentText');
    if(ta.value.trim()){
      ta.value = ta.value.trim() + "\n\n---\nMODEL (" + state.level + ")\n" + model;
    }else{
      ta.value = model;
    }
    ta.focus();
    updateWordCount();
    renderMistakes();
  };

  const copyTemplate = async () => {
    const t = currentWriteTask();
    const txt = t.template || '';
    try{
      await navigator.clipboard.writeText(txt);
      toast('✅ Template copied.');
    }catch(e){
      // fallback
      $('#studentText').value = txt;
      updateWordCount();
      toast('Template inserted into text box.');
    }
  };

  // Mistake scan
  const renderMistakes = () => {
    const box = $('#mistakeBox');
    const text = ($('#studentText').value || '');
    const hits = [];
    mistakeRules.forEach(rule => {
      rule.re.lastIndex = 0;
      if(rule.re.test(text)){
        hits.push(rule);
      }
    });

    if(!text.trim()){
      box.innerHTML = `<div class="tiny muted">Write some text to see a quick checklist.</div>`;
      return;
    }
    if(!hits.length){
      box.innerHTML = `<div class="tiny muted">✅ No common “French-speaker” patterns detected in this list.</div>`;
      return;
    }
    box.innerHTML = `
      <div class="tiny muted">Possible issues to check:</div>
      <ul class="bullets mt10">
        ${hits.map(h => `<li>${escapeHtml(h.msg)}${state.fr && h.fr ? ` <span class="frOnly" style="display:inline;">(${escapeHtml(h.fr)})</span>` : ''}</li>`).join('')}
      </ul>
    `;
  };

  // ---------- Teacher diff (word-level LCS) ----------
  const tokenizeWords = (s) => {
    const clean = (s || '').replace(/\s+/g,' ').trim();
    if(!clean) return [];
    return clean.split(' ');
  };

  const lcsMatrix = (a, b) => {
    // DP with rows (b) to reduce memory: O(n*m) but small sizes
    const n = a.length, m = b.length;
    const dp = new Array(m+1).fill(0);
    const prev = new Array(m+1).fill(0);
    // Keep backpointers cheaply by storing "choice" in a map of key->dir for reconstruction with limited size
    // For simplicity: compute full table of ints for up to 450 tokens
    const limit = 450;
    if(n > limit || m > limit) return null;

    const table = Array.from({length: n+1}, () => new Uint16Array(m+1));
    for(let i=1;i<=n;i++){
      for(let j=1;j<=m;j++){
        if(a[i-1] === b[j-1]) table[i][j] = table[i-1][j-1] + 1;
        else table[i][j] = Math.max(table[i-1][j], table[i][j-1]);
      }
    }
    return table;
  };

  const buildDiff = (a, b, table) => {
    let i = a.length, j = b.length;
    const out = [];
    while(i>0 && j>0){
      if(a[i-1] === b[j-1]){
        out.push({t:'same', w:a[i-1]});
        i--; j--;
      }else if(table[i-1][j] >= table[i][j-1]){
        out.push({t:'del', w:a[i-1]});
        i--;
      }else{
        out.push({t:'add', w:b[j-1]});
        j--;
      }
    }
    while(i>0){ out.push({t:'del', w:a[i-1]}); i--; }
    while(j>0){ out.push({t:'add', w:b[j-1]}); j--; }
    out.reverse();

    // Merge adjacent same/add/del runs
    const merged = [];
    out.forEach(x => {
      const last = merged[merged.length-1];
      if(last && last.t === x.t){
        last.w += ' ' + x.w;
      }else merged.push({t:x.t, w:x.w});
    });
    return merged;
  };

  const compareTexts = () => {
    const a = tokenizeWords($('#studentText').value);
    const b = tokenizeWords($('#teacherText').value);
    const out = $('#diffOut');

    if(!a.length && !b.length){
      out.innerHTML = `<div class="tiny muted">Paste texts to compare.</div>`;
      return;
    }
    if(!b.length){
      out.innerHTML = `<div class="tiny muted">Please paste a corrected version (teacher) to compare.</div>`;
      return;
    }

    const table = lcsMatrix(a, b);
    if(!table){
      // fallback for very long texts
      out.innerHTML = `<div class="tiny muted">Text is long. Showing side-by-side instead of word diff.</div>
        <div class="grid2 mt10">
          <div class="panel"><div class="miniTitle">Student</div><div class="model">${escapeHtml($('#studentText').value)}</div></div>
          <div class="panel"><div class="miniTitle">Teacher</div><div class="model">${escapeHtml($('#teacherText').value)}</div></div>
        </div>`;
      return;
    }

    const diff = buildDiff(a, b, table);
    const html = diff.map(seg => {
      const cls = seg.t;
      return `<span class="${cls}">${escapeHtml(seg.w)}</span>`;
    }).join(' ');

    out.innerHTML = html || `<div class="tiny muted">No differences detected.</div>`;
  };

  // ---------- Toast ----------
  let toastTimer = null;
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
    if(toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.style.display = 'none'; }, 1600);
  };

  // ---------- Reset ----------
  const resetAll = () => {
    speakStop(); prodStop(); writeStop();
    $('#speakNotes').value = '';
    $('#studentText').value = '';
    $('#teacherText').value = '';
    $('#diffOut').innerHTML = '';
    updateWordCount();
    renderMistakes();
    newMatchSet();
    newGrammarQuiz();
    newWordQuiz();
    newOrderSet();
    newDialogue();
    toast('Reset done.');
  };

  // ---------- Init ----------
  const init = () => {
    loadPrefs();

    // voice list
    loadVoices();
    if('speechSynthesis' in window){
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Render initial UI
    updateScoreUI();
    setupVocabCats();
    renderQuickChips();
    renderExam();
    renderTechCards();
    renderKits();

    // selectors
    fillSpeakingSelectors();
    fillProdSelector();
    fillWriteSelector();

    // apply prefs to UI
    setLevel(state.level);
    setFR(state.fr);
    setAccent(state.accent);
    $('#rate').value = String(state.rate);

    // events: level
    $$('.segBtn[data-level]').forEach(b => b.addEventListener('click', () => setLevel(b.dataset.level)));
    // fr
    $('#frToggle').addEventListener('click', () => { setFR(!state.fr); savePrefs(); });
    // accent
    $$('.segBtn[data-accent]').forEach(b => b.addEventListener('click', () => setAccent(b.dataset.accent)));
    // rate
    $('#rate').addEventListener('input', (e) => { state.rate = parseFloat(e.target.value); savePrefs(); });

    // print
    $('#printBtn').addEventListener('click', () => window.print());

    // score reset
    $('#resetScore').addEventListener('click', resetScore);

    // new set
    $('#newSetBtn').addEventListener('click', () => {
      newMatchSet();
      newGrammarQuiz();
      newWordQuiz();
      newOrderSet();
      newDialogue();
      // reset speaking to first q
      state.speak.idx = 0;
      renderSpeaking();
      toast('✨ New set ready.');
    });

    // reset all
    $('#resetAllBtn').addEventListener('click', resetAll);

    // quick say emergency
    $('#sayEmergency').addEventListener('click', () => speak("Sorry, could you repeat that more slowly, please?"));

    // vocab controls
    $('#vocabCat').addEventListener('change', renderVocab);
    $('#vocabSearch').addEventListener('input', renderVocab);
    $('#vocabShuffle').addEventListener('click', () => {
      // shuffle vocab array in-place for variety
      const shuffled = shuffle(vocab);
      vocab.length = 0;
      shuffled.forEach(x => vocab.push(x));
      renderVocab();
    });

    // matching
    $('#matchNew').addEventListener('click', newMatchSet);

    // quizzes
    $('#newGrammar').addEventListener('click', newGrammarQuiz);
    $('#newWord').addEventListener('click', newWordQuiz);
    $('#newOrder').addEventListener('click', newOrderSet);

    // order
    $('#orderUndo').addEventListener('click', orderUndo);
    $('#orderCheck').addEventListener('click', orderCheck);
    $('#orderReveal').addEventListener('click', orderReveal);

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
    $('#showA2').addEventListener('click', () => showSpeakModel('A2'));
    $('#showB1').addEventListener('click', () => showSpeakModel('B1'));
    $('#showB2').addEventListener('click', () => showSpeakModel('B2'));

    // production
    $('#prodPrompt').addEventListener('change', renderProd);
    $('#prod60').addEventListener('click', () => prodStart(60));
    $('#prod90').addEventListener('click', () => prodStart(90));
    $('#prodStop').addEventListener('click', prodStop);
    $('#prodListen').addEventListener('click', prodListen);

    // dialogues
    $('#dialogueNew').addEventListener('click', newDialogue);

    // writing
    $('#writeTask').addEventListener('change', renderWriting);
    $('#write15').addEventListener('click', () => writeStart(15*60));
    $('#writeStop').addEventListener('click', writeStop);
    $('#writeListen').addEventListener('click', writeListen);
    $('#studentText').addEventListener('input', () => { updateWordCount(); renderMistakes(); });
    $('#clearStudent').addEventListener('click', () => { $('#studentText').value=''; updateWordCount(); renderMistakes(); });
    $('#clearTeacher').addEventListener('click', () => { $('#teacherText').value=''; $('#diffOut').innerHTML=''; });
    $('#showModelWrite').addEventListener('click', showModelWrite);
    $('#copyTemplate').addEventListener('click', copyTemplate);

    // compare
    $('#compareBtn').addEventListener('click', compareTexts);

    // initial renders
    renderVocab();
    newMatchSet();
    newGrammarQuiz();
    newWordQuiz();
    newOrderSet();
    renderSpeaking();
    renderProd();
    renderCallScripts();
    newDialogue();
    renderWriting();
    updateWordCount();
    renderMistakes();
  };

  // ---------- Start ----------
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();