/* ==========================================================
   Canada Hotel Check‑in Masterclass · SpeakEasyTisha
   Standalone JS (no external libraries)
   ========================================================== */

(() => {
  "use strict";

  // ---------- Global score tracking ----------
  const scoreEl = document.getElementById("scoreValue");
  const doneEl = document.getElementById("doneValue");
  const totalEl = document.getElementById("totalValue");
  let score = 0;
  let done = 0;
  let total = 0;

  function addScore(points) {
    score += points;
    scoreEl.textContent = String(score);
  }
  function markDone() {
    done += 1;
    doneEl.textContent = String(done);
  }
  function setTotal(n) {
    total = n;
    totalEl.textContent = String(total);
  }

  // ---------- Speech synthesis ----------
  const voiceSelect = document.getElementById("voiceSelect");
  const testVoicesBtn = document.getElementById("testVoicesBtn");
  const stopSpeechBtn = document.getElementById("stopSpeechBtn");

  let voices = [];
  let lastUtterances = [];

  function loadVoices() {
    voices = window.speechSynthesis?.getVoices?.() || [];
  }
  loadVoices();
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => loadVoices();
  }

  function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }
  function pickVoice(langPref) {
    if (!voices.length) return null;
    const want = (langPref || "auto").toLowerCase();
    const english = voices.filter(v => (v.lang || "").toLowerCase().startsWith("en"));
    if (!english.length) return voices[0];

    if (want === "auto") {
      const pref = ["en-ca", "en-us", "en-gb"];
      for (const p of pref) {
        const found = english.find(v => (v.lang || "").toLowerCase().startsWith(p));
        if (found) return found;
      }
      return english[0];
    }

    const exact = english.find(v => (v.lang || "").toLowerCase() === want);
    if (exact) return exact;

    const partial = english.find(v => (v.lang || "").toLowerCase().startsWith(want));
    if (partial) return partial;

    return english[0];
  }

  function stopSpeech() {
    try { window.speechSynthesis?.cancel?.(); } catch {}
    lastUtterances = [];
  }

  function speak(text, opts = {}) {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }
    stopSpeech();
    const u = new SpeechSynthesisUtterance(String(text || ""));
    const voice = pickVoice(voiceSelect?.value || "auto");
    if (voice) u.voice = voice;
    u.rate = clamp(opts.rate ?? 1.0, 0.7, 1.2);
    u.pitch = clamp(opts.pitch ?? 1.0, 0.6, 1.4);
    u.volume = clamp(opts.volume ?? 1.0, 0.0, 1.0);
    lastUtterances = [u];
    window.speechSynthesis.speak(u);
  }

  function speakSequence(lines, opts = {}) {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    stopSpeech();
    const voice = pickVoice(voiceSelect?.value || "auto");
    const utterances = (lines || []).map((line, idx) => {
      const u = new SpeechSynthesisUtterance(String(line || ""));
      if (voice) u.voice = voice;
      u.rate = clamp(opts.rate ?? 1.0, 0.7, 1.2);
      u.pitch = clamp((opts.pitch ?? 1.0) + (opts.pitchJitter ? ((idx % 2 === 0) ? -0.07 : 0.07) : 0), 0.6, 1.4);
      u.volume = clamp(opts.volume ?? 1.0, 0.0, 1.0);
      return u;
    });

    lastUtterances = utterances;
    for (let i = 0; i < utterances.length - 1; i++) {
      utterances[i].onend = () => window.speechSynthesis.speak(utterances[i + 1]);
    }
    window.speechSynthesis.speak(utterances[0]);
  }

  testVoicesBtn?.addEventListener("click", () => {
    speak("Hello! This is your selected accent for the hotel lesson. Could you confirm your reservation, please?", { rate: 1.0, pitch: 1.0 });
  });
  stopSpeechBtn?.addEventListener("click", stopSpeech);

  // ---------- Helpers ----------
  function $(sel, root = document) { return root.querySelector(sel); }
  function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function normalize(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .replace(/[’']/g, "'")
      .replace(/[^a-z0-9@._\-\s']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
  function cssEscape(s) { return String(s).replace(/"/g, '\\"'); }
  function shuffle(arr) {
    const a = Array.from(arr || []);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ==========================================================
  // Data
  // ==========================================================
  const VOCAB = {
    lobby: [
      { icon:"🚪", word:"entrance", fr:"entrée", ex:"The entrance is on the left side of the building." },
      { icon:"🛎️", word:"bell desk", fr:"bagagiste / service bagages", ex:"You can leave your luggage at the bell desk." },
      { icon:"🧳", word:"luggage", fr:"bagages", ex:"Could you store my luggage for a few hours?" },
      { icon:"🛋️", word:"lounge", fr:"salon / lounge", ex:"The lounge is perfect for a quick coffee." },
      { icon:"🧾", word:"voucher", fr:"bon / justificatif", ex:"Please keep your voucher for breakfast." },
      { icon:"🗺️", word:"concierge", fr:"concierge", ex:"The concierge can book tours and restaurants." },
      { icon:"🧼", word:"sanitiser", fr:"gel hydroalcoolique", ex:"There is hand sanitiser near the entrance." },
      { icon:"📍", word:"meeting point", fr:"point de rendez‑vous", ex:"Let’s meet at the meeting point by the fireplace." },
      { icon:"🔥", word:"fireplace", fr:"cheminée", ex:"The fireplace is a cosy place to sit." }
    ],
    reception: [
      { icon:"🛎️", word:"front desk", fr:"réception", ex:"Go to the front desk to check in." },
      { icon:"🧾", word:"reservation", fr:"réservation", ex:"I have a reservation under Taylor." },
      { icon:"🪪", word:"ID / identification", fr:"pièce d’identité", ex:"May I see your ID, please?" },
      { icon:"💳", word:"deposit", fr:"caution", ex:"There is a deposit for incidentals." },
      { icon:"🔑", word:"key card", fr:"carte‑clé", ex:"Your key card also activates the elevator." },
      { icon:"🧾", word:"invoice / receipt", fr:"facture / reçu", ex:"Could you email me the invoice, please?" },
      { icon:"⏰", word:"check‑in / check‑out", fr:"arrivée / départ", ex:"Check‑out is at 11 a.m." },
      { icon:"🛏️", word:"room type", fr:"type de chambre", ex:"Is it a double room or a twin room?" },
      { icon:"🧊", word:"incidentals", fr:"extras", ex:"Incidentals include minibar and room service." }
    ],
    room: [
      { icon:"🛏️", word:"bed / bedding", fr:"lit / literie", ex:"Could I have extra bedding, please?" },
      { icon:"🧺", word:"sheets", fr:"draps", ex:"The sheets feel very soft." },
      { icon:"🛌", word:"pillow", fr:"oreiller", ex:"Could I get an extra pillow?" },
      { icon:"🧥", word:"blanket", fr:"couverture", ex:"A blanket is available in the closet." },
      { icon:"🪑", word:"chair", fr:"chaise", ex:"The chair is next to the desk." },
      { icon:"🖥️", word:"desk", fr:"bureau", ex:"I need a desk to work tonight." },
      { icon:"📺", word:"TV / remote", fr:"télé / télécommande", ex:"The remote doesn’t work." },
      { icon:"🪟", word:"curtains", fr:"rideaux", ex:"Could you show me how to close the curtains?" },
      { icon:"🧳", word:"closet", fr:"placard", ex:"There’s a safe in the closet." }
    ],
    bathroom: [
      { icon:"🚿", word:"shower", fr:"douche", ex:"The shower pressure is great." },
      { icon:"🛁", word:"bathtub", fr:"baignoire", ex:"Is there a bathtub in this room?" },
      { icon:"🚰", word:"sink", fr:"lavabo", ex:"The sink is leaking slightly." },
      { icon:"🧴", word:"toiletries", fr:"produits d’accueil", ex:"Toiletries are provided." },
      { icon:"🧻", word:"tissue / toilet paper", fr:"mouchoirs / papier toilette", ex:"Could you bring more toilet paper?" },
      { icon:"🪥", word:"toothbrush", fr:"brosse à dents", ex:"Do you have a spare toothbrush?" },
      { icon:"🧼", word:"soap", fr:"savon", ex:"The soap smells great." },
      { icon:"🪞", word:"mirror", fr:"miroir", ex:"There’s a mirror above the sink." },
      { icon:"🧺", word:"towels", fr:"serviettes", ex:"Could we get two more towels?" }
    ],
    amenities: [
      { icon:"📶", word:"Wi‑Fi", fr:"Wi‑Fi", ex:"What’s the Wi‑Fi password?" },
      { icon:"🏊", word:"pool", fr:"piscine", ex:"Is the pool open late?" },
      { icon:"🏋️", word:"gym / fitness centre", fr:"salle de sport", ex:"The gym opens at 6 a.m." },
      { icon:"🧖", word:"spa", fr:"spa", ex:"Can I book a spa treatment?" },
      { icon:"🍽️", word:"restaurant", fr:"restaurant", ex:"Could you recommend the restaurant?" },
      { icon:"☕", word:"breakfast buffet", fr:"buffet petit‑déjeuner", ex:"Breakfast buffet is on the ground floor." },
      { icon:"🧺", word:"laundry service", fr:"pressing / blanchisserie", ex:"Is laundry service available today?" },
      { icon:"🚌", word:"shuttle", fr:"navette", ex:"Is there a shuttle to the airport?" },
      { icon:"🅿️", word:"parking", fr:"parking", ex:"Is parking included?" }
    ],
    floors: [
      { icon:"🛗", word:"elevator / lift", fr:"ascenseur", ex:"Take the elevator to the 6th floor." },
      { icon:"🪜", word:"stairs", fr:"escaliers", ex:"The stairs are next to the elevator." },
      { icon:"➡️", word:"corridor / hallway", fr:"couloir", ex:"Your room is at the end of the corridor." },
      { icon:"🚪", word:"door", fr:"porte", ex:"It’s the third door on the right." },
      { icon:"🧭", word:"opposite", fr:"en face de", ex:"The lounge is opposite the front desk." },
      { icon:"🧭", word:"next to", fr:"à côté de", ex:"The ice machine is next to the elevator." },
      { icon:"🧭", word:"on the left / on the right", fr:"à gauche / à droite", ex:"Turn left, then right." },
      { icon:"🧭", word:"across from", fr:"en face de", ex:"The restrooms are across from the bar." },
      { icon:"🧭", word:"between", fr:"entre", ex:"The restaurant is between reception and the elevator." }
    ]
  };

  function mkVocabQuiz(vocabKey, words) {
    const list = VOCAB[vocabKey] || [];
    return words.map((targetWord) => {
      const target = list.find(x => x.word === targetWord);
      const others = shuffle(list.filter(x => x.word !== targetWord)).slice(0, 2);
      const choices = shuffle([
        { t: `${target?.icon || "❓"} ${targetWord}`, ok: true, why: `Correct: ${targetWord} = ${target?.fr || ""}.` },
        ...others.map(o => ({ t: `${o.icon} ${o.word}`, ok: false, why: `That one is “${o.word}”.` }))
      ]);
      return { q: `Which word matches: “${target?.fr || "—"}”?`, choices };
    });
  }

  const QUIZZES = {
    warmup: [
      {
        q: "A guest arrives at 8:30 p.m. What’s the most natural greeting at reception?",
        choices: [
          { t:"Good evening. Welcome! How may I help you?", ok:true, why:"Polite + professional; perfect at night." },
          { t:"Good night. What do you want?", ok:false, why:"“Good night” is for leaving/sleeping, and the tone is rude." },
          { t:"Hey! You okay?", ok:false, why:"Too informal for a hotel front desk." }
        ]
      },
      {
        q: "You want a quiet room. Which request is best?",
        choices: [
          { t:"Give me a quiet room.", ok:false, why:"Sounds demanding." },
          { t:"Could I have a quiet room away from the elevator, if possible?", ok:true, why:"Polite + specific + realistic." },
          { t:"I want no noise.", ok:false, why:"Unnatural phrasing." }
        ]
      }
    ],
    vocab_lobby: mkVocabQuiz("lobby", ["concierge","entrance","luggage","fireplace"]),
    vocab_reception: mkVocabQuiz("reception", ["key card","deposit","invoice / receipt","reservation"]),
    vocab_room: mkVocabQuiz("room", ["curtains","sheets","desk","TV / remote"]),
    vocab_bathroom: mkVocabQuiz("bathroom", ["toiletries","towels","sink","toothbrush"]),
    vocab_amenities: mkVocabQuiz("amenities", ["shuttle","breakfast buffet","Wi‑Fi","laundry service"]),
    vocab_floors: mkVocabQuiz("floors", ["opposite","between","corridor / hallway","elevator / lift"]),
    modals_upgrade: [
      {
        q: "Upgrade this line: “I want late checkout.”",
        choices: [
          { t:"Would it be possible to have a late checkout, please?", ok:true, why:"Excellent: polite and standard hotel English." },
          { t:"Can you late check out me?", ok:false, why:"Wrong structure." },
          { t:"Late checkout now.", ok:false, why:"Too blunt/unnatural." }
        ]
      },
      {
        q: "Reception asks for ID. Which is most professional?",
        choices: [
          { t:"Show me your ID.", ok:false, why:"Too direct." },
          { t:"May I see your ID, please?", ok:true, why:"Formal + polite." },
          { t:"ID?", ok:false, why:"Too short." }
        ]
      },
      {
        q: "A guest asks about Wi‑Fi. Best answer?",
        choices: [
          { t:"You should connect to ‘FBS‑Guest’ and enter this password.", ok:true, why:"Clear and helpful." },
          { t:"Connect internet.", ok:false, why:"Missing grammar." },
          { t:"No Wi‑Fi.", ok:false, why:"Not appropriate." }
        ]
      },
      {
        q: "A guest wants advice for dinner. Choose the best.",
        choices: [
          { t:"You should try our restaurant. It’s very popular.", ok:true, why:"Natural advice with “should”." },
          { t:"You could must go restaurant.", ok:false, why:"Incorrect modal combination." },
          { t:"Go restaurant.", ok:false, why:"Too abrupt." }
        ]
      }
    ],
    prepositions_mcq: [
      {
        q: "Choose the best sentence:",
        choices: [
          { t:"The elevator is next of the reception.", ok:false, why:"Should be “next to”." },
          { t:"The elevator is next to reception.", ok:true, why:"Correct." },
          { t:"The elevator is next at reception.", ok:false, why:"Incorrect preposition." }
        ]
      },
      {
        q: "“Opposite” means…",
        choices: [
          { t:"directly across from", ok:true, why:"Exactly." },
          { t:"behind", ok:false, why:"No." },
          { t:"under", ok:false, why:"No." }
        ]
      },
      {
        q: "Choose the most natural direction:",
        choices: [
          { t:"Turn left, then it’s the third door on your right.", ok:true, why:"Natural + very common." },
          { t:"Go lefting and righting.", ok:false, why:"Incorrect form." },
          { t:"You will see door third.", ok:false, why:"Unnatural." }
        ]
      }
    ],
    email_spelling: [
      {
        q: "In email addresses, we usually say “.” as…",
        choices: [
          { t:"point", ok:false, why:"French influence. In English email, we say “dot”." },
          { t:"dot", ok:true, why:"Correct." },
          { t:"spot", ok:false, why:"No." }
        ]
      },
      {
        q: "The symbol “@” is said…",
        choices: [
          { t:"at", ok:true, why:"Correct." },
          { t:"arobase", ok:false, why:"French word; in English we say “at”." },
          { t:"around", ok:false, why:"No." }
        ]
      }
    ],
    reading_mcq: [
      {
        q: "Why is the guest asked to reply?",
        choices: [
          { t:"To confirm arrival time and request the invoice.", ok:true, why:"Those are the two actions requested." },
          { t:"To cancel the reservation.", ok:false, why:"No, cancellation is not mentioned." },
          { t:"To book a spa treatment.", ok:false, why:"Not requested." }
        ]
      },
      {
        q: "What is included in the resort fee?",
        choices: [
          { t:"Wi‑Fi and pool access", ok:true, why:"Both are listed." },
          { t:"Free parking for everyone", ok:false, why:"Parking is not listed as free." },
          { t:"A free room upgrade", ok:false, why:"Not stated." }
        ]
      },
      {
        q: "What time is check‑out?",
        choices: [
          { t:"11:00 a.m.", ok:true, why:"Clearly stated." },
          { t:"12:00 p.m.", ok:false, why:"Not stated." },
          { t:"10:00 a.m.", ok:false, why:"Not stated." }
        ]
      }
    ],
    final_challenge: [
      {
        q: "Problem 1: Your key card doesn’t open the door. What’s the best line at reception?",
        choices: [
          { t:"My key is broken. Fix it.", ok:false, why:"Too direct." },
          { t:"Hi—sorry to bother you. My key card doesn’t seem to work. Could you re‑encode it, please?", ok:true, why:"Polite + clear request." },
          { t:"Door no open.", ok:false, why:"Not grammatical." }
        ]
      },
      {
        q: "Problem 2: The room is noisy. Best request?",
        choices: [
          { t:"It’s too noisy. I demand another room now.", ok:false, why:"Overly aggressive." },
          { t:"Would it be possible to move to a quieter room, if available?", ok:true, why:"Professional + realistic." },
          { t:"I don’t like sound.", ok:false, why:"Unnatural." }
        ]
      },
      {
        q: "Problem 3: You’ll arrive after midnight. Best email subject line?",
        choices: [
          { t:"Late arrival – reservation confirmation", ok:true, why:"Clear and professional." },
          { t:"HEY", ok:false, why:"Too informal." },
          { t:"Important!", ok:false, why:"Vague." }
        ]
      }
    ]
  };

  const DIRECTIONS_LINES = [
    "The elevators are straight ahead, next to the front desk.",
    "Take the elevator to the sixth floor, then turn left.",
    "Your room is the third door on the right, opposite the ice machine.",
    "The restaurant is across from the lounge, near the fireplace.",
    "The pool is at the end of the hallway, behind the spa."
  ];

  const PREP_DND = {
    tokens: ["next to", "opposite", "between", "across from", "at the end of", "near"],
    items: [
      { id:"p1", sentence:"The elevator is ____ reception (spot B relative to A).", answer:"next to" },
      { id:"p2", sentence:"The restaurant is ____ the elevator (spot C relative to B).", answer:"across from" },
      { id:"p3", sentence:"The restrooms are ____ the restaurant (spot E relative to C).", answer:"near" },
      { id:"p4", sentence:"The pool is ____ reception and the restaurant (spot D relative to A & C).", answer:"between" },
      { id:"p5", sentence:"The ice machine is ____ the pool (spot F relative to D).", answer:"opposite" },
      { id:"p6", sentence:"Your room is ____ the hallway.", answer:"at the end of" }
    ]
  };

  const DICTATION_GROUPS = [
    {
      key: "room_numbers",
      title: "Room numbers (hotel style)",
      subtitle: "Tip: 1207 → “twelve oh seven”. 507 → “five oh seven”.",
      items: [
        { say: "Your room is twelve oh seven.", accept: ["your room is 1207", "your room is twelve oh seven", "room 1207", "room is 1207"] },
        { say: "You’re in room five oh seven, on the fifth floor.", accept: ["youre in room 507 on the fifth floor","you're in room 507 on the fifth floor","in room 507 on the fifth floor"] },
        { say: "The spa is on the second floor, room two fifteen.", accept: ["the spa is on the second floor room 215", "the spa is on the second floor, room 215"] }
      ]
    },
    {
      key: "dates_times",
      title: "Dates + times (arrival / checkout)",
      subtitle: "Listen carefully for prepositions: on / at / from…",
      items: [
        { say: "Your reservation starts on March twenty‑first.", accept: ["your reservation starts on march 21st","your reservation starts on march twenty first","your reservation starts on march twenty-first"] },
        { say: "Check‑out is at eleven a.m.", accept: ["check-out is at 11 am","checkout is at 11 am","check out is at eleven am","check-out is at eleven am"] },
        { say: "Breakfast is served from seven to ten thirty.", accept: ["breakfast is served from 7 to 10 30","breakfast is served from seven to ten thirty","breakfast is served from seven to ten thirty am"] }
      ]
    },
    {
      key: "prices",
      title: "Prices + money",
      subtitle: "Say it naturally: “one hundred and fifty dollars”, “forty‑five dollars per night”.",
      items: [
        { say: "There is a one hundred and fifty dollar deposit for incidentals.", accept: ["there is a 150 dollar deposit for incidentals","there is a one hundred and fifty dollar deposit for incidentals","a 150 dollar deposit for incidentals"] },
        { say: "Parking is forty‑five dollars per night.", accept: ["parking is 45 dollars per night","parking is forty-five dollars per night","parking is forty five dollars per night"] },
        { say: "The upgrade is an extra twenty dollars a night.", accept: ["the upgrade is an extra $20 a night","the upgrade is an extra 20 dollars a night","the upgrade is an extra twenty dollars a night"] }
      ]
    },
    {
      key: "percentages",
      title: "Discounts + percentages",
      subtitle: "Listen for “percent”.",
      items: [
        { say: "You get a ten percent discount with a membership.", accept: ["you get a 10 percent discount with a membership","you get a ten percent discount with a membership"] },
        { say: "Service charge is fifteen percent.", accept: ["service charge is 15 percent","service charge is fifteen percent"] }
      ]
    },
    {
      key: "phone_numbers",
      title: "Phone numbers (international style)",
      subtitle: "Tip: 403‑555‑0189 → “four oh three, five five five, oh one eight nine”.",
      items: [
        { say: "If you need anything, dial four zero three, five five five, zero one eight nine.", accept: ["if you need anything dial 403 555 0189","if you need anything, dial 403 555 0189","dial 403 555 0189"] },
        { say: "My phone number is six one two, five five five, zero one two zero.", accept: ["my phone number is 612 555 0120","my phone number is six one two five five five zero one two zero"] }
      ]
    }
  ];

  const READING_MESSAGE = {
    from: "frontdesk@banffsprings.example",
    subject: "Your stay: arrival details & invoice request",
    body: [
      "Dear Guest,",
      "We’re looking forward to welcoming you to the Fairmont Banff Springs.",
      "Check‑in begins at 4:00 p.m. and check‑out is at 11:00 a.m.",
      "A resort fee includes Wi‑Fi access and pool facilities. If you need an invoice for work, please reply with your billing details.",
      "If you expect to arrive after 10:00 p.m., please let us know so we can keep your reservation active.",
      "Kind regards,",
      "Front Desk Team"
    ]
  };

  const EMAIL_MODELS = {
    late: `Subject: Late arrival – reservation confirmation

Dear Front Desk Team,

I hope you’re well. I’m writing to let you know that my arrival will be later than expected this evening (around 12:30 a.m.). 
Could you please confirm that my reservation will be kept active?

Thank you very much for your help.

Kind regards,
[Your name]
[Reservation name / dates]`,

    quiet: `Subject: Room request – quiet room if available

Dear Front Desk Team,

I hope you’re doing well. If possible, could I request a quiet room away from the elevator and ice machine?
I would really appreciate it.

Thank you for your assistance, and I look forward to my stay.

Kind regards,
[Your name]
[Dates of stay]`,

    issue: `Subject: Assistance needed – room issue

Dear Front Desk Team,

I’m currently staying in room [number]. Unfortunately, I’m having an issue with [the key card / the air conditioning / noise].
Would it be possible to send someone to help, or advise me on the next steps?

Thank you in advance.

Kind regards,
[Your name]
[Room number]`,

    invoice: `Subject: Invoice request (billing details)

Dear Front Desk Team,

I hope you’re well. Could you please email me an invoice/receipt for my stay?
The billing details are:

Company name:
Address:
VAT / reference (if applicable):

Thank you very much.

Kind regards,
[Your name]
[Dates of stay]`
  };

  // ==========================================================
  // Tabs
  // ==========================================================
  const tabs = $all(".tab");
  tabs.forEach(btn => btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("is-active"));
    $all(".tabpane").forEach(p => p.classList.remove("is-active"));
    btn.classList.add("is-active");
    const key = btn.dataset.tab;
    const pane = document.getElementById(`tab-${key}`);
    if (pane) pane.classList.add("is-active");
  }));

  // ==========================================================
  // Vocab cards
  // ==========================================================
  $all("[data-vocab]").forEach(el => {
    const key = el.dataset.vocab;
    const items = VOCAB[key] || [];
    el.innerHTML = items.map((it) => `
      <div class="vcard" role="button" tabindex="0">
        <div class="vcard__top">
          <div class="vcard__icon" aria-hidden="true">${it.icon}</div>
          <div>
            <div class="vcard__word">${escapeHtml(it.word)}</div>
            <div class="vcard__hint">${escapeHtml(it.fr)}</div>
          </div>
        </div>
        <div class="vcard__reveal">
          <div><strong>Example:</strong> ${escapeHtml(it.ex)}</div>
          <div class="muted" style="margin-top:.35rem;">Tip: click again to hide.</div>
        </div>
      </div>
    `).join("");

    $all(".vcard", el).forEach(card => {
      card.addEventListener("click", () => card.classList.toggle("is-open"));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });
  });

  // Speak examples
  document.getElementById("speakExamplesBtn")?.addEventListener("click", () => {
    speakSequence([
      "Could you check if breakfast is included, please?",
      "Would it be possible to get a quiet room away from the elevator?",
      "May I see your ID, please?",
      "You should keep your key card away from magnets."
    ], { rate: 1.0, pitch: 1.0, pitchJitter: true });
  });

  // Speak list
  const speakList = document.getElementById("directionsSpeakList");
  if (speakList) {
    speakList.innerHTML = DIRECTIONS_LINES.map((t) => `
      <div class="speakitem" role="button" tabindex="0">🔊 ${escapeHtml(t)}</div>
    `).join("");
    $all(".speakitem", speakList).forEach(item => {
      item.addEventListener("click", () => speak(item.textContent.replace(/^🔊\s*/, "")));
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); item.click(); }
      });
    });
  }

  // ==========================================================
  // Roleplay builder
  // ==========================================================
  const roleplayOutput = document.getElementById("roleplayOutput");
  const buildRoleplayBtn = document.getElementById("buildRoleplayBtn");

  function getRPValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
  }

  function buildRoleplay() {
    const g1 = getRPValue("rpGreeting");
    const r1 = getRPValue("rpReservation");
    const r2 = getRPValue("rpIdPay");
    const r3 = getRPValue("rpRequest");
    const r4 = getRPValue("rpDirections");

    const lines = [
      { who:"Reception", text:g1 },
      { who:"Guest", text:r1 },
      { who:"Reception", text:"Great, thank you. Could I see your ID and a card for the deposit, please?" },
      { who:"Guest", text:r2 },
      { who:"Reception", text:"Perfect. You’re all set. Here are your key cards." },
      { who:"Guest", text:r3 },
      { who:"Reception", text:"Absolutely. I’ll do my best to arrange that." },
      { who:"Reception", text:`Directions: ${r4}` },
      { who:"Guest", text:"Thank you very much!" },
      { who:"Reception", text:"You’re welcome. Enjoy your stay!" }
    ];

    if (roleplayOutput) {
      roleplayOutput.innerHTML = lines.map((l) => `
        <div class="line">
          <span class="badge ${l.who === "Guest" ? "badge--alt": ""}">${escapeHtml(l.who)}</span>
          <span>${escapeHtml(l.text)}</span>
        </div>
      `).join("");
      roleplayOutput.dataset.lines = JSON.stringify(lines);
    }

    if (!buildRoleplayBtn.dataset.done) {
      buildRoleplayBtn.dataset.done = "1";
      addScore(2);
      markDone();
    }
  }

  document.getElementById("buildRoleplayBtn")?.addEventListener("click", buildRoleplay);
  document.getElementById("resetRoleplayBtn")?.addEventListener("click", () => {
    if (roleplayOutput) {
      roleplayOutput.innerHTML = `<p class="muted">Click <strong>Build dialogue</strong> to generate your role‑play.</p>`;
      roleplayOutput.dataset.lines = "";
    }
  });

  function getRoleplayLines(filterWho = null) {
    try {
      const raw = roleplayOutput?.dataset?.lines || "";
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return filterWho ? parsed.filter(x => x.who === filterWho).map(x => x.text) : parsed.map(x => x.text);
    } catch { return []; }
  }

  document.getElementById("playRoleplayBtn")?.addEventListener("click", () => {
    if (!getRoleplayLines().length) buildRoleplay();
    speakSequence(getRoleplayLines(), { rate: 1.0, pitch: 1.0, pitchJitter: true });
  });
  document.getElementById("playReceptionBtn")?.addEventListener("click", () => {
    if (!getRoleplayLines().length) buildRoleplay();
    speakSequence(getRoleplayLines("Reception"), { rate: 1.0, pitch: 0.95 });
  });
  document.getElementById("playGuestBtn")?.addEventListener("click", () => {
    if (!getRoleplayLines().length) buildRoleplay();
    speakSequence(getRoleplayLines("Guest"), { rate: 1.0, pitch: 1.05 });
  });

  // ==========================================================
  // Email spelling
  // ==========================================================
  const emailInput = document.getElementById("emailInput");
  const emailOutput = document.getElementById("emailOutput");

  function emailToSpoken(email) {
    const e = String(email || "").trim();
    if (!e) return "";
    return e.split("").map(ch => {
      if (ch === "@") return " at ";
      if (ch === ".") return " dot ";
      if (ch === "_") return " underscore ";
      if (ch === "-") return " dash ";
      return ch;
    }).join("").replace(/\s+/g, " ").trim();
  }

  document.getElementById("spellEmailBtn")?.addEventListener("click", () => {
    const spoken = emailToSpoken(emailInput?.value || "");
    emailOutput.textContent = spoken || "Type an email and click “Convert”.";
    if (spoken && !document.getElementById("spellEmailBtn").dataset.done) {
      document.getElementById("spellEmailBtn").dataset.done = "1";
      addScore(2);
      markDone();
    }
  });

  document.getElementById("speakEmailBtn")?.addEventListener("click", () => {
    const t = (emailOutput?.textContent || "").trim();
    if (!t || t === "Type an email and click “Convert”.") {
      speak("Please type your email address, then click convert.");
      return;
    }
    speak(t, { rate: 0.95, pitch: 1.0 });
  });

  // ==========================================================
  // Reading text
  // ==========================================================
  const readingText = document.getElementById("readingText");
  if (readingText) {
    readingText.innerHTML = `
      <p class="mono"><strong>From:</strong> ${escapeHtml(READING_MESSAGE.from)}<br/>
      <strong>Subject:</strong> ${escapeHtml(READING_MESSAGE.subject)}</p>
      ${READING_MESSAGE.body.map(line => `<p>${escapeHtml(line)}</p>`).join("")}
    `;
  }

  // Email writing: checklist + model answers
  const emailScenario = document.getElementById("emailScenario");
  const emailDraft = document.getElementById("emailDraft");
  const emailChecklist = document.getElementById("emailChecklist");
  const emailModel = document.getElementById("emailModel");

  function computeChecklist(text) {
    const t = normalize(text);
    const items = [
      { label:"Has a greeting (Dear / Hello)", ok: /(dear|hello)/.test(t) },
      { label:"Explains the purpose clearly (request / inform / ask)", ok: /(writing|let you know|request|would it be possible|could you|can you|i am writing)/.test(t) },
      { label:"Includes key details (dates, room number, arrival time, etc.)", ok: /(room|date|night|arrive|arrival|reservation|check)/.test(t) },
      { label:"Polite closing (thank you / kind regards)", ok: /(thank you|thanks|kind regards|best regards|sincerely)/.test(t) },
      { label:"No overly direct/impolite wording (avoid: give me / i demand)", ok: !/(give me|i demand|now\!|fix it)/.test(t) }
    ];
    return items;
  }

  document.getElementById("emailChecklistBtn")?.addEventListener("click", () => {
    const items = computeChecklist(emailDraft?.value || "");
    const okCount = items.filter(x => x.ok).length;
    emailChecklist.innerHTML = `
      <strong>Checklist results:</strong> ${okCount}/${items.length}
      <ul>
        ${items.map(x => `<li>${x.ok ? "✅" : "⚠️"} ${escapeHtml(x.label)}</li>`).join("")}
      </ul>
      <div class="muted" style="margin-top:.35rem;">
        Tip: short + polite + specific details = high quality.
      </div>
    `;
    const btn = document.getElementById("emailChecklistBtn");
    if (!btn.dataset.done) { btn.dataset.done = "1"; addScore(2); markDone(); }
  });

  document.getElementById("showModelBtn")?.addEventListener("click", () => {
    const key = emailScenario?.value || "late";
    emailModel.hidden = false;
    emailModel.innerHTML = `<pre>${escapeHtml(EMAIL_MODELS[key] || EMAIL_MODELS.late)}</pre>`;
  });
  document.getElementById("hideModelBtn")?.addEventListener("click", () => { emailModel.hidden = true; });

  // ==========================================================
  // Dictation builder
  // ==========================================================
  const dictationRoot = document.getElementById("dictationRoot");
  if (dictationRoot) {
    dictationRoot.innerHTML = DICTATION_GROUPS.map((g) => `
      <div class="dgroup" data-dgroup="${escapeHtml(g.key)}">
        <div class="dgroup__head">
          <div>
            <h3 class="dtitle">🎧 ${escapeHtml(g.title)}</h3>
            <div class="dsubtitle">${escapeHtml(g.subtitle || "")}</div>
          </div>
          <div class="smallBtns">
            <button class="btn btn--primary" type="button" data-dplay="${escapeHtml(g.key)}">▶ Play</button>
            <button class="btn btn--ghost" type="button" data-dreplay="${escapeHtml(g.key)}">↻ Replay</button>
            <button class="btn btn--ghost" type="button" data-dshow="${escapeHtml(g.key)}">👀 Show answer</button>
          </div>
        </div>

        <div class="drow">
          <input class="dinput" type="text" placeholder="Type what you hear…" aria-label="Dictation input" />
          <button class="btn btn--primary" type="button" data-dcheck="${escapeHtml(g.key)}">Check</button>
        </div>

        <div class="dfeedback" aria-live="polite"></div>
        <div class="muted" style="margin-top:.55rem;">
          Tip: If you’re unsure, replay once. Then check. The goal is <strong>progress</strong>, not perfection.
        </div>
      </div>
    `).join("");
  }

  const dictationState = {}; // groupKey -> { idx, lastText }

  function dictationNext(groupKey) {
    const g = DICTATION_GROUPS.find(x => x.key === groupKey);
    if (!g) return null;
    const st = dictationState[groupKey] || { idx: 0, lastText: "" };
    const item = g.items[st.idx % g.items.length];
    dictationState[groupKey] = { idx: (st.idx + 1) % g.items.length, lastText: item.say };
    return item;
  }
  function dictationCurrent(groupKey) {
    const g = DICTATION_GROUPS.find(x => x.key === groupKey);
    if (!g) return null;
    const st = dictationState[groupKey];
    if (!st || !st.lastText) return null;
    return g.items.find(i => i.say === st.lastText) || null;
  }

  function similarity(a, b) {
    const A = new Set(String(a).split(" ").filter(Boolean));
    const B = new Set(String(b).split(" ").filter(Boolean));
    if (!A.size || !B.size) return 0;
    let inter = 0;
    for (const x of A) if (B.has(x)) inter++;
    return inter / Math.max(A.size, B.size);
  }

  function checkDictation(groupKey, typed) {
    const item = dictationCurrent(groupKey);
    if (!item) return { ok:false, msg:"Click Play first." };
    const t = normalize(typed);
    if (!t) return { ok:false, msg:"Type your answer first." };

    const accepted = (item.accept || []).some(acc => normalize(acc) === t);
    if (accepted) return { ok:true, msg:"✅ Correct!" };

    const target = normalize(item.accept?.[0] || item.say);
    const sim = similarity(t, target);
    if (sim > 0.82) return { ok:true, msg:"✅ Almost perfect (accepted)." };
    return { ok:false, msg:"❌ Not quite. Try again (focus on numbers + small words like “at/on/from”)." };
  }

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;

    const playKey = t.getAttribute("data-dplay");
    const replayKey = t.getAttribute("data-dreplay");
    const checkKey = t.getAttribute("data-dcheck");
    const showKey = t.getAttribute("data-dshow");

    if (playKey) {
      const item = dictationNext(playKey);
      if (!item) return;
      const groupEl = t.closest(".dgroup");
      const input = $(".dinput", groupEl);
      const fb = $(".dfeedback", groupEl);
      if (input) input.value = "";
      if (fb) fb.textContent = "Listening…";
      speak(item.say, { rate: 0.95, pitch: 1.0 });
      return;
    }
    if (replayKey) {
      const item = dictationCurrent(replayKey) || dictationNext(replayKey);
      if (!item) return;
      const groupEl = t.closest(".dgroup");
      const fb = $(".dfeedback", groupEl);
      if (fb) fb.textContent = "Listening again…";
      speak(item.say, { rate: 0.95, pitch: 1.0 });
      return;
    }
    if (showKey) {
      const item = dictationCurrent(showKey);
      const groupEl = t.closest(".dgroup");
      const fb = $(".dfeedback", groupEl);
      if (!item) { if (fb) fb.textContent = "Click Play first."; return; }
      if (fb) fb.innerHTML = `Answer: <span class="mono">${escapeHtml(item.accept?.[0] || item.say)}</span>`;
      return;
    }
    if (checkKey) {
      const groupEl = t.closest(".dgroup");
      const input = $(".dinput", groupEl);
      const fb = $(".dfeedback", groupEl);
      const res = checkDictation(checkKey, input?.value || "");
      if (fb) fb.innerHTML = res.ok ? `<span class="badgeOk">${escapeHtml(res.msg)}</span>` : `<span class="badgeNo">${escapeHtml(res.msg)}</span>`;
      if (res.ok) {
        const key = `done_${checkKey}`;
        if (!dictationState[key]) { dictationState[key] = true; addScore(2); markDone(); }
      }
      return;
    }
  });

  // ==========================================================
  // Prepositions DnD (mobile friendly)
  // ==========================================================
  const prepTokensEl = document.getElementById("prepTokens");
  const prepDropsEl = document.getElementById("prepDrops");
  const checkPrepBtn = document.getElementById("checkPrepBtn");
  const resetPrepBtn = document.getElementById("resetPrepBtn");
  const prepFeedback = document.getElementById("prepFeedback");

  let selectedToken = null;
  let dragTokenText = null;

  function renderPrep() {
    if (!prepTokensEl || !prepDropsEl) return;

    prepTokensEl.innerHTML = PREP_DND.tokens.map(t => `
      <div class="token" draggable="true" data-token="${escapeHtml(t)}">${escapeHtml(t)}</div>
    `).join("");

    prepDropsEl.innerHTML = PREP_DND.items.map(item => `
      <div class="drop" data-drop="${escapeHtml(item.id)}" data-answer="${escapeHtml(item.answer)}">
        <div class="drop__row">
          <span>${escapeHtml(item.sentence.split("____")[0])}</span>
          <span class="blank" data-blank="${escapeHtml(item.id)}">(drop here)</span>
          <span>${escapeHtml(item.sentence.split("____")[1] || "")}</span>
        </div>
      </div>
    `).join("");

    selectedToken = null;
    dragTokenText = null;
  }
  renderPrep();

  function clearTokenSelection() {
    selectedToken = null;
    $all(".token", prepTokensEl).forEach(t => t.classList.remove("is-selected"));
  }
  prepTokensEl?.addEventListener("click", (e) => {
    const tok = e.target.closest(".token");
    if (!tok) return;
    clearTokenSelection();
    selectedToken = tok;
    tok.classList.add("is-selected");
  });
  prepDropsEl?.addEventListener("click", (e) => {
    const blank = e.target.closest(".blank");
    if (!blank || !selectedToken) return;
    const text = selectedToken.getAttribute("data-token");
    blank.textContent = text;
    blank.dataset.value = text;
    blank.classList.add("has-token");
    clearTokenSelection();
  });

  document.addEventListener("dragstart", (e) => {
    const tok = e.target?.closest?.(".token");
    if (!tok) return;
    dragTokenText = tok.getAttribute("data-token");
    try { e.dataTransfer.setData("text/plain", dragTokenText || ""); } catch {}
  });
  document.addEventListener("dragover", (e) => {
    const blank = e.target?.closest?.(".blank");
    if (!blank) return;
    e.preventDefault();
  });
  document.addEventListener("drop", (e) => {
    const blank = e.target?.closest?.(".blank");
    if (!blank) return;
    e.preventDefault();
    const text = dragTokenText || (e.dataTransfer ? e.dataTransfer.getData("text/plain") : "");
    if (!text) return;
    blank.textContent = text;
    blank.dataset.value = text;
    blank.classList.add("has-token");
    dragTokenText = null;
  });

  function checkPrepositions() {
    if (!prepDropsEl) return;
    let correct = 0;
    PREP_DND.items.forEach(item => {
      const drop = prepDropsEl.querySelector(`.drop[data-drop="${cssEscape(item.id)}"]`);
      const blank = prepDropsEl.querySelector(`.blank[data-blank="${cssEscape(item.id)}"]`);
      const val = (blank?.dataset?.value || "").trim();
      drop?.classList.remove("is-correct","is-wrong");
      if (val && normalize(val) === normalize(item.answer)) { correct++; drop?.classList.add("is-correct"); }
      else { drop?.classList.add("is-wrong"); }
    });
    if (prepFeedback) prepFeedback.textContent = `Prepositions: ${correct}/${PREP_DND.items.length} correct.`;
    if (correct === PREP_DND.items.length && !checkPrepBtn.dataset.done) { checkPrepBtn.dataset.done="1"; addScore(3); markDone(); }
  }
  function resetPrepositions() {
    renderPrep();
    if (prepFeedback) prepFeedback.textContent = "";
    $all(".drop", prepDropsEl).forEach(d => d.classList.remove("is-correct","is-wrong"));
  }
  checkPrepBtn?.addEventListener("click", checkPrepositions);
  resetPrepBtn?.addEventListener("click", resetPrepositions);

  // ==========================================================
  // Quizzes render
  // ==========================================================
  function renderQuestion(quizKey, q, qi) {
    const id = `${quizKey}__${qi}`;
    return `
      <div class="q" data-qid="${escapeHtml(id)}" data-quiz="${escapeHtml(quizKey)}">
        <p class="q__prompt">${escapeHtml(q.q)}</p>
        <div class="choices" role="group" aria-label="Choices">
          ${(q.choices || []).map((c, ci) => `
            <button class="choice" type="button"
              data-choice="${escapeHtml(id)}:${ci}"
              data-ok="${c.ok ? "1" : "0"}"
              data-why="${escapeHtml(c.why || "")}">
              ${escapeHtml(c.t)}
            </button>
          `).join("")}
        </div>
        <div class="feedback" aria-live="polite"></div>
      </div>
    `;
  }

  const quizState = {};

  function resetQuiz(quizKey) {
    const roots = $all(`[data-quiz="${cssEscape(quizKey)}"]`);
    roots.forEach(root => {
      const data = QUIZZES[quizKey] || [];
      root.innerHTML = data.map((q, qi) => renderQuestion(quizKey, q, qi)).join("") + `
        <div class="metaRow">
          <span>🧠 Tip: Read the explanation—this is where you improve fastest.</span>
          <button class="reset" type="button" data-reset="${escapeHtml(quizKey)}">Reset</button>
        </div>
      `;
    });
    quizState[quizKey] = { answered: new Set(), completed: false };
  }

  function renderAllQuizzes() {
    const quizEls = $all("[data-quiz]");
    quizEls.forEach((root) => {
      const key = root.dataset.quiz;
      resetQuiz(key);
    });

    const units = quizEls.length + 1 + 1 + DICTATION_GROUPS.length + 1 + 1;
    setTotal(units);
  }
  renderAllQuizzes();

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".choice");
    if (btn) {
      const qEl = btn.closest(".q");
      const quizKey = qEl?.getAttribute("data-quiz");
      const qid = qEl?.getAttribute("data-qid");
      if (!quizKey || !qid) return;

      const st = quizState[quizKey] || { answered: new Set(), completed: false };
      if (st.answered.has(qid)) return;

      const ok = btn.getAttribute("data-ok") === "1";
      const why = btn.getAttribute("data-why") || "";

      $all(".choice", qEl).forEach(b => b.disabled = true);
      btn.classList.add(ok ? "is-correct" : "is-wrong");
      const fb = $(".feedback", qEl);
      if (fb) fb.textContent = (ok ? "✅ Correct. " : "❌ Not quite. ") + why;

      st.answered.add(qid);
      quizState[quizKey] = st;
      if (ok) addScore(1);

      const totalQs = (QUIZZES[quizKey] || []).length;
      if (!st.completed && st.answered.size === totalQs) {
        st.completed = true;
        quizState[quizKey] = st;
        markDone();
        addScore(1);
      }
      return;
    }

    const resetBtn = e.target.closest("[data-reset]");
    if (resetBtn) {
      const key = resetBtn.getAttribute("data-reset");
      if (key) resetQuiz(key);
      return;
    }
  });

})();
