window.__SPEAKEASY_APP_LOADED = true;
/* SpeakEasyTisha • Renting a Home (MA & NH)
   Complete interactive lesson (touch-friendly)
   - Language toggle EN/FR
   - US/UK speechSynthesis
   - Drag OR Tap mode for matching
   - Reorder (with drag + up/down fallback)
   - Fill-in with word bank
   - Sentence builder
   - Dialogue practice
   - Reading checks
   - Global score top+bottom + localStorage
*/
(function(){
  "use strict";

  /* -----------------------------
     Helpers
  ----------------------------- */
  const $ = (id)=>document.getElementById(id);
  const qs = (sel,root=document)=>root.querySelector(sel);
  const qsa = (sel,root=document)=>Array.from(root.querySelectorAll(sel));
  const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
  const esc = (s)=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));

  /* -----------------------------
     Settings + storage
  ----------------------------- */
  const STORE_KEY = "seTisha_renting_ma_nh_v1";
  const state = {
    lang: "en",            // en|fr
    voice: "US",           // US|UK
    mode: "drag",          // drag|tap
    score: 0,
    streak: 0,
    checklist: {},
    mcqPolite: null,
    matchFees: {},
    fillDates: {},
    builder: {picked: []},
    letterParts: null,
    dialogueIndex: 0,
    reading: {}
  };

  function load(){
    try{
      const raw = localStorage.getItem(STORE_KEY);
      if(!raw) return;
      const saved = JSON.parse(raw);
      Object.assign(state, saved);
    }catch(e){/* ignore */}
  }
  function save(){
    try{
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
      const sb = $("savedBadge");
      if(sb){
        sb.textContent = state.lang==="fr" ? "Sauvé ✓" : "Saved ✓";
        sb.classList.remove("pulse");
        void sb.offsetWidth;
        sb.classList.add("pulse");
      }
    }catch(e){/* ignore */}
  }

  function setScore(delta, reason){
    if(delta===0) return;
    state.score = Math.max(0, state.score + delta);
    state.streak = delta>0 ? (state.streak+1) : 0;
    updateScoreUI();
    save();
    return reason;
  }
  function updateScoreUI(){
    const s = state.score;
    const st = state.streak;
    const t1 = $("scoreBadge"), t2=$("scoreBadgeBottom");
    const k1 = $("streakBadge"), k2=$("streakBadgeBottom");
    if(t1) t1.textContent = (state.lang==="fr"?"Score : ":"Score: ") + s;
    if(t2) t2.textContent = (state.lang==="fr"?"Score : ":"Score: ") + s;
    if(k1) k1.textContent = (state.lang==="fr"?"Série : ":"Streak: ") + st;
    if(k2) k2.textContent = (state.lang==="fr"?"Série : ":"Streak: ") + st;
  }

  
  /* -----------------------------
     Speech (US/UK) — robust Safari/Chrome
  ----------------------------- */
  var TTS = {
    voices: [],
    unlocked: false,
    statusEl: null,

    init: function () {
      this.statusEl = document.getElementById('ttsStatus') || null;
      this.warmup();
      // show a helpful message for local file testing
      if (typeof window.isSecureContext !== 'undefined' && !window.isSecureContext) {
        this.setStatus('Voice: disabled on file:// — open via https (GitHub) or localhost');
      }
      // unlock on first user gesture (helps iOS)
      var self = this;
      var once = function(){
        try { self.unlock(); } catch(e) {}
        window.removeEventListener('pointerdown', once, true);
        window.removeEventListener('touchstart', once, true);
        window.removeEventListener('mousedown', once, true);
      };
      window.addEventListener('pointerdown', once, true);
      window.addEventListener('touchstart', once, true);
      window.addEventListener('mousedown', once, true);
    },

    setStatus: function (msg) {
      if (this.statusEl) this.statusEl.textContent = msg;
    },

    warmup: function () {
      if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
        this.setStatus('Voice: not supported');
        return;
      }
      try { window.speechSynthesis.getVoices(); } catch(e) {}
      this.voices = window.speechSynthesis.getVoices() || [];
      this.setStatus(this.voices.length ? ('Voice: ready (' + this.voices.length + ')') : 'Voice: loading…');
      var self = this;
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = function(){
          self.voices = window.speechSynthesis.getVoices() || [];
          self.setStatus(self.voices.length ? ('Voice: ready (' + self.voices.length + ')') : 'Voice: loading…');
        };
      }
    },

    pick: function (lang) {
      var voices = (this.voices && this.voices.length) ? this.voices : (window.speechSynthesis ? window.speechSynthesis.getVoices() : []);
      if (!voices || !voices.length) return null;
      var lower = String(lang || '').toLowerCase();
      for (var i=0;i<voices.length;i++) {
        if (String(voices[i].lang || '').toLowerCase() === lower) return voices[i];
      }
      var pref = lower.split('-')[0];
      for (var j=0;j<voices.length;j++) {
        var vl = String(voices[j].lang || '').toLowerCase();
        if (vl.indexOf(pref) === 0) return voices[j];
      }
      return voices[0];
    },

    unlock: function(){
      if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') return;
      if (this.unlocked) return;
      try {
        var warm = new SpeechSynthesisUtterance(' ');
        warm.volume = 0;
        window.speechSynthesis.speak(warm);
        // cancel after scheduling to avoid a "stuck" queue
        try { window.speechSynthesis.cancel(); } catch(e) {}
        this.unlocked = true;
      } catch(e2) {}
    },

    speak: function (text, lang) {
      if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') return;
      var say = String(text || '').trim();
      if (!say) return;

      this.unlock();

      // iOS/Safari sometimes needs resume()
      try { window.speechSynthesis.resume(); } catch(e) {}

      var u = new SpeechSynthesisUtterance(say);
      u.lang = lang || 'en-US';
      u.rate = 0.95;

      var v = this.pick(u.lang);
      if (v) u.voice = v;

      var self = this;
      u.onstart = function(){ self.setStatus('Voice: speaking…'); };
      u.onend = function(){ self.warmup(); };
      u.onerror = function(){ self.setStatus('Voice: error — check device mute/volume'); };

      // Avoid canceling right before speak unless needed (can kill first utterance on Safari)
      try {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
        }
      } catch(e3) {}

      window.speechSynthesis.speak(u);
    }
  };

  function speak(text){
    var locale = (state && state.voice === 'UK') ? 'en-GB' : 'en-US';
    TTS.speak(text, locale);
  }

  /* -----------------------------
     Content (EN/FR)
  ----------------------------- */
  const i18n = {
    en: {
      title: "Renting a Home in MA & NH (for a French family moving to the USA)",
      lead: "Step-by-step setup, key vocabulary, polite communication, dates & times, and realistic rental scenarios. Everything here works with drag OR tap so it’s iPad-friendly.",
      disclaimerTitle: "Note",
      disclaimer: "This is educational language practice, not legal advice. Rules can change and local policies vary.",
      fastFactsTitle: "Fast facts (MA vs NH)",
      fastFactsFoot: "(Always verify the latest rules for your city/town.)",
      stepsTitle: "1) Step-by-step guide (checklist)",
      stepsIntro: "Tap each phase to reveal tasks. Your progress saves automatically.",
      toolsTitle: "2) Tools & safety",
      docsTitle: "Documents you may need",
      scamsTitle: "Avoid scams",
      timeTitle: "Dates & time quick reference",
      dateFormat: "US date format",
      dateExample: "Example: 02/01/2026 = February 1, 2026",
      timeFormat: "Time format",
      timeExample: "You’ll see 12-hour time a lot in the US.",
      prepositions: "Prepositions",
      prepoExample: "Useful for scheduling viewings.",
      microLessonTitle: "Mini lesson: polite renting phrases",
      microLessonIntro: "Use softeners to sound friendly and professional.",
      vocabTitle: "3) Vocabulary flashcards (with icons + audio)",
      category: "Category",
      grammarTitle: "4) Grammar you need for renting",
      practiceTitle: "5) Practice zone (interactive exercises)",
      practiceIntro: "Each activity gives hints + instant feedback + points.",
      mcqPolite: "Choose the most polite option",
      mcqPoliteInstr: "Select the best sentence for a landlord/agent email.",
      matchFees: "Match the money terms",
      matchFeesInstr: "Drag or tap a term onto the correct meaning.",
      fillDates: "Fill in: dates & time",
      fillDatesInstr: "Use the word bank. Example: “on Tuesday”, “at 4 p.m.”",
      sentenceBuilder: "Sentence builder (word order)",
      sentenceBuilderInstr: "Tap words to build the sentence in order.",
      writingTitle: "6) Writing: rental emails & letters",
      letterParts: "Parts of an email (reorder)",
      letterPartsInstr: "Drag to reorder (or use ↑ ↓ buttons). Then check.",
      emailBuilder: "Email builder (copy/paste)",
      emailBuilderInstr: "Choose a scenario, fill your details, and generate a polished email.",
      scenario: "Scenario",
      name: "Name",
      phone: "Phone",
      moveIn: "Move-in date",
      budget: "Budget",
      location: "Area",
      questions: "Your questions (optional)",
      dialogueTitle: "7) Dialogue practice (realistic scenarios)",
      dialogueIntro: "Choose the best next line. You can listen to each line.",
      readingTitle: "Reading: sample listing",
      wrapTitle: "Wrap-up",
      wrapText: "Repeat activities until you can write and speak confidently with landlords, property managers, and brokers.",
      startChecklist: "Start the checklist",
      testVoice: "Test voice",
      print: "Print",
      reset: "Reset",
      check: "Check",
      hint: "Hint",
      copied: "Copied ✓",
      tryAgain: "Try again.",
      correct: "Correct!",
    },
    fr: {
      title: "Louer un logement au Massachusetts & au New Hampshire (famille française qui s’installe aux USA)",
      lead: "Guide étape par étape, vocabulaire clé, communication polie, dates & heures, et scénarios réalistes. Tout fonctionne en mode glisser OU tapoter (iPad-friendly).",
      disclaimerTitle: "Note",
      disclaimer: "Ceci est une leçon de langue, pas un conseil juridique. Les règles peuvent évoluer et varier selon la ville.",
      fastFactsTitle: "Infos rapides (MA vs NH)",
      fastFactsFoot: "(Vérifiez toujours les règles de votre ville.)",
      stepsTitle: "1) Guide étape par étape (checklist)",
      stepsIntro: "Touchez chaque phase pour voir les tâches. Votre progression est enregistrée.",
      toolsTitle: "2) Outils & sécurité",
      docsTitle: "Documents possibles",
      scamsTitle: "Éviter les arnaques",
      timeTitle: "Mémo : dates & heures",
      dateFormat: "Format de date US",
      dateExample: "Exemple : 02/01/2026 = 1er février 2026",
      timeFormat: "Format de l’heure",
      timeExample: "Aux USA, on voit souvent le format 12h.",
      prepositions: "Prépositions",
      prepoExample: "Utile pour prendre rendez-vous.",
      microLessonTitle: "Mini-leçon : formules polies",
      microLessonIntro: "Utilisez des atténuateurs pour être poli et professionnel.",
      vocabTitle: "3) Cartes de vocabulaire (icônes + audio)",
      category: "Catégorie",
      grammarTitle: "4) Grammaire utile pour louer",
      practiceTitle: "5) Zone d’entraînement (exercices)",
      practiceIntro: "Chaque activité donne des indices + feedback + points.",
      mcqPolite: "Choisissez l’option la plus polie",
      mcqPoliteInstr: "Sélectionnez la meilleure phrase pour un email pro.",
      matchFees: "Associez les termes d’argent",
      matchFeesInstr: "Glissez ou tapotez un terme sur la bonne définition.",
      fillDates: "Complétez : dates & heures",
      fillDatesInstr: "Utilisez la banque de mots. Exemple : “on Tuesday”, “at 4 p.m.”",
      sentenceBuilder: "Constructeur de phrase (ordre des mots)",
      sentenceBuilderInstr: "Tapotez les mots pour construire la phrase dans le bon ordre.",
      writingTitle: "6) Écriture : emails & lettres",
      letterParts: "Parties d’un email (remettre en ordre)",
      letterPartsInstr: "Glissez pour réorganiser (ou ↑ ↓). Puis vérifiez.",
      emailBuilder: "Générateur d’email (copier/coller)",
      emailBuilderInstr: "Choisissez un scénario, remplissez vos infos et générez un email propre.",
      scenario: "Scénario",
      name: "Nom",
      phone: "Téléphone",
      moveIn: "Date d’entrée",
      budget: "Budget",
      location: "Zone",
      questions: "Vos questions (optionnel)",
      dialogueTitle: "7) Dialogue (scénarios réalistes)",
      dialogueIntro: "Choisissez la meilleure réplique suivante. Vous pouvez écouter chaque ligne.",
      readingTitle: "Lecture : annonce type",
      wrapTitle: "Conclusion",
      wrapText: "Refaites les activités jusqu’à être à l’aise à l’écrit et à l’oral.",
      startChecklist: "Démarrer la checklist",
      testVoice: "Tester la voix",
      print: "Imprimer",
      reset: "Réinitialiser",
      check: "Vérifier",
      hint: "Indice",
      copied: "Copié ✓",
      tryAgain: "Réessayez.",
      correct: "Correct !",
    }
  };

  /* -----------------------------
     Up-to-date facts (embedded as language content)
     NOTE: facts reflect public sources:
     - MA security deposit and last month's rent guidance (Mass.gov)
     - MA broker fees FAQ effective Aug 1 2025 (Mass.gov)
     - NH security deposit cap (RSA 540-A:6)
  ----------------------------- */
  const fastFacts = {
    en: [
      "MA: Security deposit is capped at 1 month’s rent (rules for receipts, condition statement, and how it’s held).",
      "NH: Security deposit is capped at 1 month’s rent or $100 (whichever is greater).",
      "MA: As of Aug 1, 2025, broker fees can only be charged to the person who hired the broker.",
      "US: Pre-1978 rentals require lead-based paint disclosure + pamphlet.",
    ],
    fr: [
      "MA : Le dépôt de garantie est plafonné à 1 mois de loyer (reçus, état des lieux, conservation).",
      "NH : Le dépôt de garantie est plafonné à 1 mois de loyer ou 100 $ (le montant le plus élevé).",
      "MA : Depuis le 1er août 2025, les frais d’agence ne peuvent être facturés qu’à la personne qui a mandaté l’agent.",
      "USA : Les logements d’avant 1978 exigent une information ‘lead paint’ + brochure.",
    ]
  };

  const docsList = {
    en: [
      "Photo ID (passport), and sometimes a US ID later",
      "Proof of income (pay stubs / work contract / offer letter)",
      "Bank statements (sometimes)",
      "Rental history + landlord references",
      "Credit report (or alternative screening for newcomers)",
      "Guarantor/co-signer info (if requested)",
      "Pet records (vaccines), if you have pets",
    ],
    fr: [
      "Pièce d’identité (passeport), et parfois un ID US ensuite",
      "Justificatifs de revenus (fiches de paie / contrat / promesse d’embauche)",
      "Relevés bancaires (parfois)",
      "Historique de location + références d’anciens propriétaires",
      "Rapport de crédit (ou alternative pour nouveaux arrivants)",
      "Garant / co-signer (si demandé)",
      "Documents pour animaux (vaccins), si besoin",
    ]
  };

  const scamsList = {
    en: [
      "Never wire money to “hold” a unit without verified identity and a signed agreement.",
      "Be cautious if the price is “too good”.",
      "Confirm ownership/agency and viewing access before paying anything.",
      "Keep copies of receipts and emails.",
    ],
    fr: [
      "Ne faites pas de virement pour “réserver” sans identité vérifiée et accord signé.",
      "Méfiez-vous si le prix est “trop beau”.",
      "Vérifiez le propriétaire/l’agence et la visite avant de payer.",
      "Gardez une trace (reçus, emails).",
    ]
  };

  const politePhrases = {
    en: [
      {t:"Could you please confirm…?", ex:"Could you please confirm whether heat is included?"},
      {t:"Would it be possible to…?", ex:"Would it be possible to schedule a viewing on Tuesday at 4 p.m.?"},
      {t:"Would you mind…?", ex:"Would you mind sending the application requirements?"},
      {t:"I was wondering if…", ex:"I was wondering if the building has parking."},
      {t:"Thank you for your time.", ex:"Thank you for your time and help."}
    ],
    fr: [
      {t:"Could you please…?", ex:"Could you please confirm if heating is included?"},
      {t:"Would it be possible to…?", ex:"Would it be possible to schedule a viewing on Tuesday at 4 p.m.?"},
      {t:"Would you mind…?", ex:"Would you mind sending the application requirements?"},
      {t:"I was wondering if…", ex:"I was wondering if the building has parking."},
      {t:"Thank you for your time.", ex:"Thank you for your time and help."}
    ]
  };

  /* -----------------------------
     Vocabulary deck
  ----------------------------- */
  const vocab = [
    // People
    {cat:"People", icon:"🧑‍💼", term:"landlord", fr:"propriétaire", def:"The person who owns the property and rents it to tenants."},
    {cat:"People", icon:"🏢", term:"property manager", fr:"gestionnaire", def:"The person/company that manages the building for the owner."},
    {cat:"People", icon:"🧑‍💻", term:"tenant", fr:"locataire", def:"The person who rents and lives in the home."},
    {cat:"People", icon:"🧑‍💼", term:"broker / agent", fr:"agent immobilier", def:"A licensed professional who helps rent or show properties."},
    {cat:"People", icon:"🧾", term:"guarantor / co-signer", fr:"garant", def:"Someone who agrees to pay if the tenant cannot."},

    // Money
    {cat:"Money", icon:"💵", term:"rent", fr:"loyer", def:"Monthly payment to live in a property."},
    {cat:"Money", icon:"🛡️", term:"security deposit", fr:"dépôt de garantie", def:"Money held to cover damage or unpaid rent (rules vary by state)."},
    {cat:"Money", icon:"🧾", term:"last month’s rent", fr:"dernier mois", def:"Prepaid rent for the final month (common in some markets)."},
    {cat:"Money", icon:"🧲", term:"holding deposit", fr:"dépôt de réservation", def:"Money to reserve a unit while paperwork is completed (get it in writing)."},
    {cat:"Money", icon:"🏷️", term:"broker fee", fr:"frais d’agence", def:"Fee for brokerage services (who pays depends on who hired the broker)."},

    // Home types
    {cat:"Home", icon:"🏠", term:"single-family house", fr:"maison individuelle", def:"One home for one household."},
    {cat:"Home", icon:"🏘️", term:"townhouse", fr:"maison en rangée", def:"A house attached to others on the sides."},
    {cat:"Home", icon:"🏢", term:"apartment", fr:"appartement", def:"A unit inside a larger building."},
    {cat:"Home", icon:"🏡", term:"condo", fr:"copropriété (condo)", def:"A unit owned individually; often managed by an association."},

    // Utilities
    {cat:"Utilities", icon:"⚡", term:"electricity", fr:"électricité", def:"Power for lights, appliances, sometimes heat."},
    {cat:"Utilities", icon:"🔥", term:"gas", fr:"gaz", def:"Fuel used for cooking or heating in some homes."},
    {cat:"Utilities", icon:"🛢️", term:"oil heat", fr:"chauffage au fioul", def:"Heating system common in parts of New England."},
    {cat:"Utilities", icon:"💧", term:"water / sewer", fr:"eau / assainissement", def:"Water and wastewater service (sometimes included)."},
    {cat:"Utilities", icon:"📶", term:"internet", fr:"internet", def:"Home internet service (often set up by the tenant)."},

    // Lease & condition
    {cat:"Lease", icon:"📄", term:"lease", fr:"bail", def:"A legal contract for renting (term, rent, rules)."},
    {cat:"Lease", icon:"🗓️", term:"lease term", fr:"durée du bail", def:"How long the lease lasts (12 months, month-to-month, etc.)."},
    {cat:"Lease", icon:"🔧", term:"maintenance request", fr:"demande de réparation", def:"A message/report asking for repairs."},
    {cat:"Lease", icon:"🧼", term:"wear and tear", fr:"usure normale", def:"Normal aging of the unit, not tenant-caused damage."},
    {cat:"Lease", icon:"📸", term:"move-in checklist", fr:"état des lieux", def:"A list of condition items at move-in (photos recommended)."},

    // Searching
    {cat:"Search", icon:"🧭", term:"commute", fr:"trajet domicile-travail", def:"The travel time to work/school."},
    {cat:"Search", icon:"🚗", term:"parking", fr:"parking", def:"A space for a car (may cost extra)."},
    {cat:"Search", icon:"🐶", term:"pet policy", fr:"règles animaux", def:"Rules about pets (allowed, fees, restrictions)."},
    {cat:"Search", icon:"🧊", term:"included utilities", fr:"charges incluses", def:"Utilities included in rent (ask which ones)."},
  ];

  function getCategories(){
    const set = new Set(vocab.map(v=>v.cat));
    return ["All", ...Array.from(set)];
  }

  /* -----------------------------
     Steps checklist
  ----------------------------- */
  const steps = {
    pre: {
      en: [
        {t:"Choose your target area", n:"Schools + commute + budget: MA (Boston area often higher) vs NH (often lower)."},
        {t:"Prepare documents", n:"Passport, proof of income, references, and a short intro message."},
        {t:"Plan temporary housing", n:"Book 2–4 weeks if possible while you visit apartments."},
        {t:"Learn US date/time formats", n:"MM/DD/YYYY and a.m./p.m. for appointments."},
      ],
      fr: [
        {t:"Choisir une zone", n:"Écoles + trajet + budget : MA (souvent plus cher) vs NH (souvent moins cher)."},
        {t:"Préparer les documents", n:"Passeport, preuves de revenus, références, petit message de présentation."},
        {t:"Prévoir un logement temporaire", n:"Idéalement 2–4 semaines pour faire des visites."},
        {t:"Apprendre les formats US", n:"MM/DD/YYYY et a.m./p.m. pour les rendez-vous."},
      ]
    },
    search: {
      en: [
        {t:"Make a short ‘renter profile’", n:"Who you are, move-in date, job, budget, pets, non-smoker."},
        {t:"Ask the right questions", n:"What’s included? Parking? Laundry? Heating type?"},
        {t:"Schedule viewings", n:"Use polite emails; confirm time zone and address."},
        {t:"Compare listings", n:"Use comparatives: cheaper, closer, bigger, quieter."},
      ],
      fr: [
        {t:"Créer un ‘profil locataire’", n:"Qui vous êtes, date d’entrée, travail, budget, animaux, non-fumeur."},
        {t:"Poser les bonnes questions", n:"Charges incluses ? Parking ? Laverie ? Type de chauffage ?"},
        {t:"Planifier des visites", n:"Emails polis; confirmer l’heure et l’adresse."},
        {t:"Comparer les annonces", n:"Comparatifs : moins cher, plus proche, plus grand, plus calme."},
      ]
    },
    apply: {
      en: [
        {t:"Apply quickly (hot markets)", n:"Have PDFs ready; reply fast and politely."},
        {t:"Understand screening", n:"Credit/background checks are common; ask about options for newcomers."},
        {t:"Clarify money terms", n:"Rent + deposits/fees. Get receipts and written terms."},
        {t:"Avoid pressure scams", n:"If they rush you to pay without documents, step back."},
      ],
      fr: [
        {t:"Candidater vite (marché tendu)", n:"Avoir les PDFs prêts; répondre rapidement et poliment."},
        {t:"Comprendre la sélection", n:"Vérifications fréquentes; demander des alternatives pour nouveaux arrivants."},
        {t:"Clarifier les montants", n:"Loyer + dépôts/frais. Exiger un écrit et un reçu."},
        {t:"Éviter la pression", n:"Si on vous pousse à payer sans documents, prudence."},
      ]
    },
    lease: {
      en: [
        {t:"Read the lease carefully", n:"Term, rent due date, late fees, repairs, pets, subletting."},
        {t:"Confirm move-in costs", n:"Ask for a written breakdown (rent, deposit, etc.)."},
        {t:"Check required disclosures", n:"Lead paint (older homes), and safety info (varies)."},
        {t:"Get everything in writing", n:"Rules, promises, included utilities."},
      ],
      fr: [
        {t:"Lire le bail attentivement", n:"Durée, date de paiement, pénalités, réparations, animaux, sous-location."},
        {t:"Confirmer les coûts d’entrée", n:"Demander un détail écrit (loyer, dépôt, etc.)."},
        {t:"Vérifier les documents obligatoires", n:"Lead paint (anciens logements), sécurité (selon cas)."},
        {t:"Tout obtenir par écrit", n:"Règles, promesses, charges incluses."},
      ]
    },
    move: {
      en: [
        {t:"Do a walk-through", n:"Use a move-in checklist; take photos/videos."},
        {t:"Set up utilities", n:"Electric, gas/oil, internet — ask what you must open in your name."},
        {t:"Change address", n:"USPS mail forwarding + update schools/bank/insurance."},
        {t:"Confirm maintenance process", n:"How to report issues; emergency contacts."},
      ],
      fr: [
        {t:"Faire un état des lieux", n:"Checklist + photos/vidéos."},
        {t:"Ouvrir les services", n:"Électricité, gaz/fioul, internet — voir ce qui est à votre nom."},
        {t:"Changer d’adresse", n:"USPS + écoles/banque/assurance."},
        {t:"Processus de réparation", n:"Comment signaler; contacts d’urgence."},
      ]
    },
    after: {
      en: [
        {t:"Pay rent on time", n:"Set reminders; confirm accepted payment methods."},
        {t:"Keep records", n:"Lease, receipts, emails, photos."},
        {t:"Write polite repair emails", n:"Describe the issue, impact, and your availability."},
        {t:"Plan renewal early", n:"Ask 60–90 days before lease end (depends on contract)."},
      ],
      fr: [
        {t:"Payer à temps", n:"Rappels; vérifier les moyens de paiement."},
        {t:"Garder des preuves", n:"Bail, reçus, emails, photos."},
        {t:"Emails polis pour réparations", n:"Décrire le problème, l’impact, vos disponibilités."},
        {t:"Anticiper le renouvellement", n:"Demander 60–90 jours avant la fin (selon bail)."},
      ]
    }
  };

  /* -----------------------------
     Grammar blocks
  ----------------------------- */
  const grammar = {
    politeRules: {
      en: [
        "Use Could/Would to sound softer: ‘Could you…?’ ‘Would it be possible to…?’",
        "Add ‘please’ and a friendly closing: ‘Thank you for your time.’",
        "Use indirect questions: ‘I was wondering if…’",
        "Avoid commands: prefer questions and requests."
      ],
      fr: [
        "Utilisez Could/Would pour être plus doux : ‘Could you…?’ ‘Would it be possible to…?’",
        "Ajoutez ‘please’ et une formule de fin : ‘Thank you for your time.’",
        "Utilisez des questions indirectes : ‘I was wondering if…’",
        "Évitez l’impératif : privilégiez demandes et questions."
      ]
    },
    dateRules: {
      en: [
        "Use on + day/date: on Monday, on February 1st",
        "Use at + time: at 4 p.m., at 9:30 a.m.",
        "Use in + month/year: in March, in 2026",
        "US dates often use MM/DD/YYYY."
      ],
      fr: [
        "on + jour/date : on Monday, on February 1st",
        "at + heure : at 4 p.m., at 9:30 a.m.",
        "in + mois/année : in March, in 2026",
        "Aux USA : format MM/DD/YYYY très fréquent."
      ]
    },
    questionRules: {
      en: [
        "Use Do you…? for routines/policies: Do you allow pets?",
        "Use Is… included? for utilities: Is heat included?",
        "Use How much…? for costs: How much is the security deposit?",
        "Use When/Where/What time…? for appointments."
      ],
      fr: [
        "Do you…? pour politiques : Do you allow pets?",
        "Is… included? pour charges : Is heat included?",
        "How much…? pour coûts : How much is the security deposit?",
        "When/Where/What time…? pour rendez-vous."
      ]
    },
    compRules: {
      en: [
        "Short adjectives: add -er: cheaper, smaller, closer",
        "Long adjectives: use more/less: more expensive, less convenient",
        "Use than to compare: This apartment is cheaper than that one."
      ],
      fr: [
        "Adjectifs courts : -er : cheaper, smaller, closer",
        "Adjectifs longs : more/less : more expensive, less convenient",
        "Utilisez than : This apartment is cheaper than that one."
      ]
    },
    modalRules: {
      en: [
        "must / have to = obligation: You must pay rent by the 1st.",
        "can = permission/ability: You can pay online.",
        "allowed to = permission (rules): You are allowed to have one cat.",
        "not allowed to = prohibited: You are not allowed to smoke."
      ],
      fr: [
        "must / have to = obligation : You must pay rent by the 1st.",
        "can = permission/capacité : You can pay online.",
        "allowed to = autorisé : You are allowed to have one cat.",
        "not allowed to = interdit : You are not allowed to smoke."
      ]
    }
  };

  const examples = {
    polite: [
      {en:"Could you please confirm whether heat is included?", fr:"Pouvez-vous confirmer si le chauffage est inclus ?"},
      {en:"Would it be possible to schedule a viewing on Tuesday at 4 p.m.?", fr:"Serait-il possible de planifier une visite mardi à 16h ?"},
      {en:"I was wondering if the unit has parking.", fr:"Je me demandais si le logement a un parking."}
    ],
    dates: [
      {en:"We are available on Thursday, February 5th.", fr:"Nous sommes disponibles jeudi 5 février."},
      {en:"Can we visit at 9:30 a.m.?", fr:"Peut-on visiter à 9h30 ?"},
      {en:"We plan to move in in March 2026.", fr:"Nous prévoyons d’emménager en mars 2026."}
    ],
    questions: [
      {en:"Do you allow pets?", fr:"Acceptez-vous les animaux ?"},
      {en:"Is water included in the rent?", fr:"L’eau est-elle incluse dans le loyer ?"},
      {en:"How much is the security deposit?", fr:"Quel est le montant du dépôt de garantie ?"}
    ],
    comparatives: [
      {en:"This unit is cheaper than the one downtown.", fr:"Ce logement est moins cher que celui du centre-ville."},
      {en:"Apartment A is more convenient than Apartment B.", fr:"L’appartement A est plus pratique que l’appartement B."}
    ],
    modals: [
      {en:"You must give 24 hours’ notice before entering (often).", fr:"Souvent : obligation de prévenir 24h avant d’entrer."},
      {en:"You are not allowed to smoke in the building.", fr:"Il est interdit de fumer dans l’immeuble."}
    ]
  };

  /* -----------------------------
     Exercises data
  ----------------------------- */
  const mcqPoliteQ = {
    en: {
      q: "You want to schedule a viewing. Which is best?",
      options: [
        {t:"Send me the address and the time.", ok:false, why:"Sounds like a command."},
        {t:"Could you please share the address and confirm the time?", ok:true, why:"Polite request + clear."},
        {t:"I want to visit tomorrow. OK?", ok:false, why:"Too informal and unclear."},
      ],
      hint: "Use Could/Would + please + a clear question."
    },
    fr: {
      q: "Vous voulez planifier une visite. Quelle phrase est la meilleure ?",
      options: [
        {t:"Send me the address and the time.", ok:false, why:"Trop direct (ordre)."},
        {t:"Could you please share the address and confirm the time?", ok:true, why:"Poli + clair."},
        {t:"I want to visit tomorrow. OK?", ok:false, why:"Trop familier et vague."},
      ],
      hint: "Utilisez Could/Would + please + une question claire."
    }
  };

  const matchFeesPairs = {
    en: [
      ["security deposit", "Money held to cover damage/unpaid rent (state rules apply)."],
      ["last month’s rent", "Prepaid rent for the final month of the lease."],
      ["broker fee", "Payment for brokerage services (who pays depends on who hired)."],
      ["holding deposit", "Money to reserve a unit while paperwork is completed."],
    ],
    fr: [
      ["security deposit", "Somme pour couvrir dégâts/impayés (règles selon l’État)."],
      ["last month’s rent", "Loyer payé d’avance pour le dernier mois."],
      ["broker fee", "Frais d’agence (qui paie dépend du mandat)."],
      ["holding deposit", "Somme pour réserver le logement pendant le dossier."],
    ]
  };

  const fillDatesData = {
    en: {
      bank: ["on Monday","on February 1st","at 4 p.m.","in March","9:30 a.m.","on Tuesday"],
      items: [
        {s:"We can visit ___ .", a:"on Tuesday"},
        {s:"Is the viewing ___ ?", a:"at 4 p.m."},
        {s:"Our move-in date is ___ .", a:"on February 1st"},
        {s:"We plan to move ___ 2026.", a:"in March"},
      ],
      hint: "Days/dates use on. Times use at. Months use in."
    },
    fr: {
      bank: ["on Monday","on February 1st","at 4 p.m.","in March","9:30 a.m.","on Tuesday"],
      items: [
        {s:"We can visit ___ .", a:"on Tuesday"},
        {s:"Is the viewing ___ ?", a:"at 4 p.m."},
        {s:"Our move-in date is ___ .", a:"on February 1st"},
        {s:"We plan to move ___ 2026.", a:"in March"},
      ],
      hint: "Jour/date = on. Heure = at. Mois = in."
    }
  };

  const builderData = {
    en: {
      target:"Would it be possible to schedule a viewing on Thursday at 9:30 a.m.?",
      words:["Would","it","be","possible","to","schedule","a","viewing","on","Thursday","at","9:30","a.m.?"],
      hint:"Start with ‘Would it be possible…’." 
    },
    fr: {
      target:"Would it be possible to schedule a viewing on Thursday at 9:30 a.m.?",
      words:["Would","it","be","possible","to","schedule","a","viewing","on","Thursday","at","9:30","a.m.?"],
      hint:"Commencez par ‘Would it be possible…’." 
    }
  };

  const letterPartsData = {
    en: {
      correct:["Subject line","Greeting","Short introduction","Key questions","Availability","Polite closing","Signature"],
      hint:"Start with Subject + Greeting. End with Closing + Signature."
    },
    fr: {
      correct:["Subject line","Greeting","Short introduction","Key questions","Availability","Polite closing","Signature"],
      hint:"Commencez par Subject + Greeting. Terminez par Closing + Signature."
    }
  };

  const emailScenarios = {
    en: [
      {id:"viewing", label:"Request a viewing (first contact)"},
      {id:"questions", label:"Ask questions about utilities + pets"},
      {id:"application", label:"Follow up after applying"},
      {id:"repairs", label:"Report a repair issue (after move-in)"},
    ],
    fr: [
      {id:"viewing", label:"Demander une visite (1er contact)"},
      {id:"questions", label:"Questions charges + animaux"},
      {id:"application", label:"Relancer après candidature"},
      {id:"repairs", label:"Signaler une réparation (après emménagement)"},
    ]
  };

  function buildEmailTemplate(scn, f){
    const name = f.name || (state.lang==="fr"?"Marie Dupont":"Marie Dupont");
    const phone = f.phone || "+33 …";
    const movein = f.movein || "02/01/2026";
    const budget = f.budget || "$2,800/month";
    const area = f.area || "Cambridge, MA";
    const extra = f.questions || "pets, parking, utilities";

    const subject = {
      viewing: `Viewing request • ${area} • move-in ${movein}`,
      questions: `Questions about the rental • ${area}`,
      application: `Follow-up on my application • ${area}`,
      repairs: `Maintenance request • ${area} • (tenant)`
    }[scn] || `Rental inquiry • ${area}`;

    const greeting = "Hello,\n\n";
    const closing = "\n\nThank you for your time.\nBest regards,\n" + name + "\n" + phone;

    let body = "";
    if(scn==="viewing"){
      body = `My name is ${name}. My family and I are moving to the US and we are looking for a rental in ${area}.\n\nWould it be possible to schedule a viewing? Our target move-in date is ${movein}. Our budget is about ${budget}.\n\nCould you please confirm the address and the best available times?`;
    } else if(scn==="questions"){
      body = `I am interested in the rental in ${area}. Could you please confirm a few details?\n\n• Which utilities are included in the rent?\n• What type of heating is used (gas/oil/electric)?\n• What is the pet policy?\n• Is parking available, and is there an additional fee?\n\nWe are aiming for a move-in around ${movein}.`;
      if(extra && extra.trim()) body += `\n\nOther questions: ${extra}.`;
    } else if(scn==="application"){
      body = `I applied for the rental in ${area} and wanted to follow up.\n\nCould you please let me know the next steps and the expected timeline? If you need any additional documents, I can send them right away.\n\nThank you again for your help.`;
    } else if(scn==="repairs"){
      body = `I am writing to report an issue in the unit.\n\nProblem: __________________________\nLocation: __________________________\nWhen it started: ____________________\nImpact (safety/noise/water): _________\n\nCould you please let me know when maintenance can come? I am available on ______ at ______.`;
    }

    return `Subject: ${subject}\n\n${greeting}${body}${closing}`;
  }

  /* -----------------------------
     Dialogue
  ----------------------------- */
  const dialogueScript = {
    en: [
      {
        who:"Agent",
        text:"Hi! Thanks for your message. When would you like to see the apartment?",
        choices:[
          {t:"Tomorrow. Send address.", ok:false, why:"Too direct."},
          {t:"Would it be possible to visit on Tuesday at 4 p.m.?", ok:true, why:"Polite and specific."},
          {t:"I don’t know.", ok:false, why:"Not helpful."}
        ]
      },
      {
        who:"Agent",
        text:"Tuesday at 4 p.m. works. Do you have any questions before the visit?",
        choices:[
          {t:"Is heat included in the rent?", ok:true, why:"Good key question."},
          {t:"Give me the lease now.", ok:false, why:"Not realistic."},
          {t:"No questions.", ok:false, why:"You should confirm basics."}
        ]
      },
      {
        who:"Agent",
        text:"Heat is not included. The heating is oil. Anything else?",
        choices:[
          {t:"Thank you. Is parking available, and is there an extra fee?", ok:true, why:"Polite follow-up."},
          {t:"That’s expensive!", ok:false, why:"Rude."},
          {t:"Ok.", ok:false, why:"Too short; ask about parking/laundry."}
        ]
      }
    ],
    fr: [
      {
        who:"Agent",
        text:"Bonjour ! Merci pour votre message. Quand souhaitez-vous visiter l’appartement ?",
        choices:[
          {t:"Tomorrow. Send address.", ok:false, why:"Trop direct."},
          {t:"Would it be possible to visit on Tuesday at 4 p.m.?", ok:true, why:"Poli et précis."},
          {t:"I don’t know.", ok:false, why:"Pas utile."}
        ]
      },
      {
        who:"Agent",
        text:"Mardi à 16h, c’est possible. Des questions avant la visite ?",
        choices:[
          {t:"Is heat included in the rent?", ok:true, why:"Bonne question."},
          {t:"Give me the lease now.", ok:false, why:"Pas réaliste."},
          {t:"No questions.", ok:false, why:"Mieux vaut confirmer l’essentiel."}
        ]
      },
      {
        who:"Agent",
        text:"Le chauffage n’est pas inclus. C’est un chauffage au fioul. Autre chose ?",
        choices:[
          {t:"Thank you. Is parking available, and is there an extra fee?", ok:true, why:"Relance polie."},
          {t:"That’s expensive!", ok:false, why:"Impoli."},
          {t:"Ok.", ok:false, why:"Trop court."}
        ]
      }
    ]
  };

  /* -----------------------------
     Reading
  ----------------------------- */
  const readingData = {
    en: {
      listing:
        "New Listing — 2BR Apartment (Somerville, MA)\n\n"+
        "Rent: $3,200/month\n"+
        "Move-in: 02/01/2026\n"+
        "Included: water + trash\n"+
        "Not included: electricity + heat (oil)\n"+
        "Pets: one cat allowed\n"+
        "Parking: available for $150/month\n"+
        "Laundry: in-building\n",
      qs:[
        {id:"q1", t:"Heat is included.", a:false},
        {id:"q2", t:"Water is included.", a:true},
        {id:"q3", t:"Parking is free.", a:false},
      ]
    },
    fr: {
      listing:
        "Annonce — Appartement 2 chambres (Somerville, MA)\n\n"+
        "Loyer : 3 200 $/mois\n"+
        "Entrée : 02/01/2026\n"+
        "Inclus : eau + ordures\n"+
        "Non inclus : électricité + chauffage (fioul)\n"+
        "Animaux : 1 chat autorisé\n"+
        "Parking : 150 $/mois\n"+
        "Laverie : dans l’immeuble\n",
      qs:[
        {id:"q1", t:"Heat is included.", a:false},
        {id:"q2", t:"Water is included.", a:true},
        {id:"q3", t:"Parking is free.", a:false},
      ]
    }
  };

  /* -----------------------------
     UI hydration
  ----------------------------- */
  function setText(){
    const T = i18n[state.lang];
    $("t_title").textContent = T.title;
    $("t_lead").textContent = T.lead;
    $("t_disclaimerTitle").textContent = T.disclaimerTitle;
    $("t_disclaimer").textContent = T.disclaimer;
    $("t_fastFactsTitle").textContent = T.fastFactsTitle;
    $("t_fastFactsFoot").textContent = T.fastFactsFoot;
    $("t_stepsTitle").textContent = T.stepsTitle;
    $("t_stepsIntro").textContent = T.stepsIntro;
    $("t_toolsTitle").textContent = T.toolsTitle;
    $("t_docsTitle").textContent = T.docsTitle;
    $("t_scamsTitle").textContent = T.scamsTitle;
    $("t_timeTitle").textContent = T.timeTitle;
    $("t_dateFormat").textContent = T.dateFormat;
    $("t_dateExample").textContent = T.dateExample;
    $("t_timeFormat").textContent = T.timeFormat;
    $("t_timeExample").textContent = T.timeExample;
    $("t_prepositions").textContent = T.prepositions;
    $("t_prepoExample").textContent = T.prepoExample;
    $("t_microLessonTitle").textContent = T.microLessonTitle;
    $("t_microLessonIntro").textContent = T.microLessonIntro;
    $("t_vocabTitle").textContent = T.vocabTitle;
    $("t_category").textContent = T.category;
    $("t_grammarTitle").textContent = T.grammarTitle;
    $("t_practiceTitle").textContent = T.practiceTitle;
    $("t_practiceIntro").textContent = T.practiceIntro;
    $("t_mcqPolite").textContent = T.mcqPolite;
    $("t_mcqPoliteInstr").textContent = T.mcqPoliteInstr;
    $("t_matchFees").textContent = T.matchFees;
    $("t_matchFeesInstr").textContent = T.matchFeesInstr;
    $("t_fillDates").textContent = T.fillDates;
    $("t_fillDatesInstr").textContent = T.fillDatesInstr;
    $("t_sentenceBuilder").textContent = T.sentenceBuilder;
    $("t_sentenceBuilderInstr").textContent = T.sentenceBuilderInstr;
    $("t_writingTitle").textContent = T.writingTitle;
    $("t_letterParts").textContent = T.letterParts;
    $("t_letterPartsInstr").textContent = T.letterPartsInstr;
    $("t_emailBuilder").textContent = T.emailBuilder;
    $("t_emailBuilderInstr").textContent = T.emailBuilderInstr;
    $("t_scenario").textContent = T.scenario;
    $("t_name").textContent = T.name;
    $("t_phone").textContent = T.phone;
    $("t_moveIn").textContent = T.moveIn;
    $("t_budget").textContent = T.budget;
    $("t_location").textContent = T.location;
    $("t_questions").textContent = T.questions;
    $("t_dialogueTitle").textContent = T.dialogueTitle;
    $("t_dialogueIntro").textContent = T.dialogueIntro;
    $("t_readingTitle").textContent = T.readingTitle;
    $("t_wrapTitle").textContent = T.wrapTitle;
    $("t_wrapText").textContent = T.wrapText;

    // buttons
    $("btnQuickStart").textContent = T.startChecklist;
    $("btnTestVoice").textContent = T.testVoice;
    $("btnPrint").textContent = T.print;
    $("btnResetAll").textContent = T.reset;

    // tabs labels (keep in EN for clarity? we'll localize lightly)
    $("tab_pre").textContent = state.lang==="fr"?"Avant départ":"Pre-arrival";
    $("tab_search").textContent = state.lang==="fr"?"Recherche":"Search";
    $("tab_apply").textContent = state.lang==="fr"?"Candidature":"Apply";
    $("tab_lease").textContent = state.lang==="fr"?"Bail":"Lease";
    $("tab_move").textContent = state.lang==="fr"?"Emménagement":"Move-in";
    $("tab_after").textContent = state.lang==="fr"?"Après":"After";

    // static lists
    renderFastFacts();
    renderDocsScams();
    renderPolitePhraseBox();

    // grammar lists/examples
    renderGrammar();

    // exercises
    renderMcqPolite(true);
    renderMatchFees(true);
    renderFillDates(true);
    renderBuilder(true);
    renderLetterParts(true);
    renderEmailScenarioOptions();
    renderDialogue(true);
    renderReading(true);

    updateScoreUI();
  }

  function renderFastFacts(){
    const ul = $("fastFacts");
    ul.innerHTML = "";
    fastFacts[state.lang].forEach(s=>{
      const li = document.createElement("li");
      li.textContent = s;
      ul.appendChild(li);
    });
  }

  function renderDocsScams(){
    const dl = $("docsList");
    const sl = $("scamsList");
    dl.innerHTML = "";
    sl.innerHTML = "";
    docsList[state.lang].forEach(s=>{const li=document.createElement("li"); li.textContent=s; dl.appendChild(li);});
    scamsList[state.lang].forEach(s=>{const li=document.createElement("li"); li.textContent=s; sl.appendChild(li);});
  }

  function renderPolitePhraseBox(){
    const box = $("phraseBox");
    box.innerHTML = "";
    politePhrases[state.lang].forEach(p=>{
      const div = document.createElement("div");
      div.className = "phrase";
      div.innerHTML = `
        <div>
          <div class="mono">${esc(p.t)}</div>
          <div class="phrase__text">${esc(p.ex)}</div>
        </div>
        <div class="phrase__actions">
          <button class="btn btn--ghost" type="button" aria-label="Listen">🔊</button>
        </div>
      `;
      qs("button", div).addEventListener("click", ()=>speak(p.ex));
      box.appendChild(div);
    });
  }

  function renderGrammar(){
    // rules
    fillBullets("politeRules", grammar.politeRules[state.lang]);
    fillBullets("dateRules", grammar.dateRules[state.lang]);
    fillBullets("questionRules", grammar.questionRules[state.lang]);
    fillBullets("compRules", grammar.compRules[state.lang]);
    fillBullets("modalRules", grammar.modalRules[state.lang]);

    renderExampleList("politeExamples", examples.polite);
    renderExampleList("dateExamples", examples.dates);
    renderExampleList("questionExamples", examples.questions);
    renderExampleList("compExamples", examples.comparatives);
    renderExampleList("modalExamples", examples.modals);
  }

  function fillBullets(id, items){
    const ul = $(id);
    ul.innerHTML = "";
    items.forEach(s=>{
      const li = document.createElement("li");
      li.textContent = s;
      ul.appendChild(li);
    });
  }

  function renderExampleList(id, arr){
    const box = $(id);
    box.innerHTML = "";
    arr.forEach(o=>{
      const div = document.createElement("div");
      div.className = "example";
      div.innerHTML = `
        <div class="example__text">${esc(o.en)}<div class="mini">${esc(o.fr)}</div></div>
        <button class="btn btn--ghost" type="button">🔊</button>
      `;
      qs("button", div).addEventListener("click", ()=>speak(o.en));
      box.appendChild(div);
    });
  }

  /* -----------------------------
     Checklist
  ----------------------------- */
  let activeStep = "pre";

  function setActiveTab(key){
    activeStep = key;
    const ids = ["pre","search","apply","lease","move","after"];
    ids.forEach(k=>{
      const tab = $("tab_"+k);
      tab.setAttribute("aria-selected", k===key ? "true":"false");
    });
    $("stepsPanel").setAttribute("aria-labelledby", "tab_"+key);
    renderChecklistPanel();
  }

  function renderChecklistPanel(){
    const data = steps[activeStep][state.lang];
    const panel = $("stepsPanel");
    panel.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.className = "checklist";

    data.forEach((item, idx)=>{
      const key = activeStep + ":" + idx;
      const checked = !!state.checklist[key];
      const row = document.createElement("label");
      row.className = "task";
      row.innerHTML = `
        <input type="checkbox" ${checked?"checked":""} />
        <div class="task__text">
          <div class="task__title">${esc(item.t)}</div>
          <div class="task__note">${esc(item.n)}</div>
        </div>
      `;
      qs("input", row).addEventListener("change", (e)=>{
        state.checklist[key] = e.target.checked;
        if(e.target.checked) setScore(1, "checklist");
        save();
      });
      wrap.appendChild(row);
    });

    panel.appendChild(wrap);
  }

  function exportChecklist(){
    const lines = [];
    const langLabel = state.lang==="fr"?"Checklist (FR)":"Checklist (EN)";
    lines.push(langLabel + " — Renting MA/NH");
    ["pre","search","apply","lease","move","after"].forEach(stepKey=>{
      const title = {
        pre: state.lang==="fr"?"Avant départ":"Pre-arrival",
        search: state.lang==="fr"?"Recherche":"Search",
        apply: state.lang==="fr"?"Candidature":"Apply",
        lease: state.lang==="fr"?"Bail":"Lease",
        move: state.lang==="fr"?"Emménagement":"Move-in",
        after: state.lang==="fr"?"Après":"After",
      }[stepKey];
      lines.push("\n"+title+":");
      steps[stepKey][state.lang].forEach((it, idx)=>{
        const key = stepKey+":"+idx;
        const mark = state.checklist[key] ? "[x]" : "[ ]";
        lines.push(`${mark} ${it.t} — ${it.n}`);
      });
    });

    const txt = lines.join("\n");
    navigator.clipboard?.writeText(txt).then(()=>{
      showMsg("checklistMsg", i18n[state.lang].copied, true);
    }).catch(()=>{
      showMsg("checklistMsg", txt, true);
    });
  }

  function resetChecklist(){
    state.checklist = {};
    save();
    renderChecklistPanel();
    showMsg("checklistMsg", state.lang==="fr"?"Checklist réinitialisée.":"Checklist reset.", true);
  }

  /* -----------------------------
     Flashcards
  ----------------------------- */
  let deck = [];
  let deckIndex = 0;
  let flipped = false;

  function buildDeck(){
    const cat = $("vocabCategory").value || "All";
    deck = (cat==="All") ? vocab.slice() : vocab.filter(v=>v.cat===cat);
    if(!deck.length) deck = vocab.slice();
    deckIndex = clamp(deckIndex, 0, deck.length-1);
    flipped = false;
    updateFlash();
  }

  function updateFlash(){
    const card = $("flashCard");
    card.classList.toggle("is-flipped", flipped);

    const item = deck[deckIndex];
    $("flashFront").innerHTML = `
      <div class="fcTop">
        <div class="fcIcon" aria-hidden="true">${esc(item.icon)}</div>
        <div class="fcLang">${esc(item.cat)}</div>
      </div>
      <div class="fcTerm">${esc(item.term)}</div>
      <div class="fcSub">${esc(item.fr)}</div>
      <div class="mini">Tap to flip</div>
    `;
    $("flashBack").innerHTML = `
      <div class="fcTop">
        <div class="fcIcon" aria-hidden="true">📌</div>
        <div class="fcLang">EN / FR</div>
      </div>
      <div class="fcDef"><strong>${esc(item.term)}</strong> — ${esc(item.def)}</div>
      <div class="fcSub"><strong>${esc(item.fr)}</strong> — ${esc(frenchHelp(item))}</div>
      <div class="mini">Tap to flip</div>
    `;

    $("flashMeta").textContent = `Card ${deckIndex+1} / ${deck.length}`;
  }

  function frenchHelp(item){
    // short FR helper definitions (simple)
    const map = {
      "landlord":"Personne qui possède le logement et le loue.",
      "property manager":"Personne/société qui gère l’immeuble.",
      "tenant":"Personne qui loue et habite le logement.",
      "broker / agent":"Professionnel qui fait visiter et loue.",
      "guarantor / co-signer":"Garant : s’engage à payer si besoin.",
      "rent":"Paiement mensuel du logement.",
      "security deposit":"Somme pour couvrir dégâts/impayés (règles).",
      "last month’s rent":"Loyer payé d’avance pour le dernier mois.",
      "holding deposit":"Somme pour réserver (écrit recommandé).",
      "broker fee":"Frais de l’agent immobilier (selon mandat).",
      "single-family house":"Maison pour un seul foyer.",
      "townhouse":"Maison mitoyenne en rangée.",
      "apartment":"Logement dans un immeuble.",
      "condo":"Appartement en copropriété.",
      "electricity":"Énergie électrique.",
      "gas":"Gaz (cuisine/chauffage).",
      "oil heat":"Chauffage au fioul.",
      "water / sewer":"Eau et assainissement.",
      "internet":"Connexion internet.",
      "lease":"Contrat de location.",
      "lease term":"Durée du contrat.",
      "maintenance request":"Demande de réparation.",
      "wear and tear":"Usure normale.",
      "move-in checklist":"État des lieux / checklist d’entrée.",
      "commute":"Temps de trajet.",
      "parking":"Place de stationnement.",
      "pet policy":"Règles concernant les animaux.",
      "included utilities":"Charges incluses.",
    };
    return map[item.term] || "Définition en français (aide).";
  }

  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }

  /* -----------------------------
     Exercise: MCQ
  ----------------------------- */
  function renderMcqPolite(reset){
    const box = $("mcqPolite");
    const data = mcqPoliteQ[state.lang];
    box.innerHTML = `
      <div class="mono">${esc(data.q)}</div>
      <div class="choices" role="radiogroup" aria-label="MCQ">
        ${data.options.map((o,idx)=>`<label class="choice"><input type="radio" name="mcqPolite" value="${idx}" ${state.mcqPolite===idx?"checked":""}/> ${esc(o.t)}</label>`).join("")}
      </div>
    `;
    if(reset){
      // nothing
    }
  }

  function checkMcqPolite(){
    const data = mcqPoliteQ[state.lang];
    const picked = qs('input[name="mcqPolite"]:checked');
    if(!picked){
      showMsg("msgMcqPolite", state.lang==="fr"?"Choisissez une réponse.":"Pick an answer.", false);
      return;
    }
    const idx = Number(picked.value);
    state.mcqPolite = idx;
    const opt = data.options[idx];
    if(opt.ok){
      setScore(3, "mcq");
      showMsg("msgMcqPolite", i18n[state.lang].correct + " " + opt.why, true);
    } else {
      setScore(-1, "mcq");
      showMsg("msgMcqPolite", (state.lang==="fr"?"Pas tout à fait. ":"Not quite. ") + opt.why, false);
    }
    save();
  }

  function hintMcqPolite(){
    showMsg("msgMcqPolite", mcqPoliteQ[state.lang].hint, true, true);
  }

  function resetMcqPolite(){
    state.mcqPolite = null;
    qsa('input[name="mcqPolite"]').forEach(i=>i.checked=false);
    showMsg("msgMcqPolite", "", true, true);
    save();
  }

  /* -----------------------------
     Exercise: Matching (drag/tap)
  ----------------------------- */
  let matchFees = null;

  function renderMatchFees(reset){
    const pairs = matchFeesPairs[state.lang];
    const cont = $("matchFees");
    cont.innerHTML = "";

    // init state if needed
    if(reset || !state.matchFees || !Object.keys(state.matchFees).length){
      state.matchFees = {}; // targetIndex -> tileText
    }

    const tiles = pairs.map(p=>p[0]);
    const shuffled = shuffle(tiles.slice());

    const tilesWrap = document.createElement("div");
    tilesWrap.className = "match__tiles";

    shuffled.forEach(t=>{
      const el = document.createElement("div");
      el.className = "tile";
      el.textContent = t;
      el.setAttribute("draggable", state.mode==="drag"?"true":"false");
      el.dataset.tile = t;
      tilesWrap.appendChild(el);
    });

    const targetsWrap = document.createElement("div");
    targetsWrap.className = "match__targets";

    pairs.forEach((p, idx)=>{
      const target = document.createElement("div");
      target.className = "target";
      target.dataset.idx = String(idx);
      const placed = state.matchFees[idx] || "";
      target.innerHTML = `
        <div class="target__label">${esc(p[1])}</div>
        <div class="target__slot">${placed?esc(placed):"—"}</div>
      `;
      targetsWrap.appendChild(target);
    });

    cont.appendChild(tilesWrap);
    cont.appendChild(targetsWrap);

    setupDragTapMatching(cont, state.matchFees);
  }

  function setupDragTapMatching(root, mapping){
    const tiles = qsa('.tile', root);
    const targets = qsa('.target', root);

    let pickedTile = null;

    function clearPicked(){
      tiles.forEach(t=>t.classList.remove('is-picked'));
      pickedTile = null;
    }

    function place(tileText, targetIdx){
      // remove this tile from any other target
      Object.keys(mapping).forEach(k=>{
        if(mapping[k]===tileText) delete mapping[k];
      });
      mapping[targetIdx] = tileText;
      // update UI
      targets.forEach(t=>{
        const idx = t.dataset.idx;
        const slot = qs('.target__slot', t);
        slot.textContent = mapping[idx] || "—";
      });
      save();
    }

    // drag mode
    tiles.forEach(tile=>{
      tile.setAttribute('draggable', state.mode==="drag"?"true":"false");
      tile.addEventListener('dragstart', (e)=>{
        if(state.mode!=="drag") return;
        e.dataTransfer.setData('text/plain', tile.dataset.tile);
      });
      tile.addEventListener('click', ()=>{
        if(state.mode!=="tap") return;
        if(pickedTile===tile){ clearPicked(); return; }
        clearPicked();
        pickedTile = tile;
        tile.classList.add('is-picked');
      });
    });

    targets.forEach(t=>{
      t.addEventListener('dragover', (e)=>{
        if(state.mode!=="drag") return;
        e.preventDefault();
      });
      t.addEventListener('drop', (e)=>{
        if(state.mode!=="drag") return;
        e.preventDefault();
        const tileText = e.dataTransfer.getData('text/plain');
        place(tileText, t.dataset.idx);
      });
      t.addEventListener('click', ()=>{
        if(state.mode!=="tap") return;
        if(!pickedTile) return;
        place(pickedTile.dataset.tile, t.dataset.idx);
        clearPicked();
      });
    });
  }

  function checkMatchFees(){
    const pairs = matchFeesPairs[state.lang];
    const mapping = state.matchFees || {};
    let correct = 0;
    pairs.forEach((p, idx)=>{
      if(mapping[idx] === p[0]) correct++;
    });
    if(correct === pairs.length){
      setScore(4, "match");
      showMsg("msgMatchFees", (state.lang==="fr"?"Parfait !":"Perfect!") + ` (${correct}/${pairs.length})`, true);
    } else {
      setScore(-1, "match");
      showMsg("msgMatchFees", (state.lang==="fr"?"Pas encore : ":"Not yet: ") + `${correct}/${pairs.length}`, false);
    }
    save();
  }

  function hintMatchFees(){
    const hint = state.lang==="fr" ? "Astuce : security deposit = argent conservé ; broker fee = frais pour l’agent." : "Hint: security deposit = held money; broker fee = agent services.";
    showMsg("msgMatchFees", hint, true, true);
  }

  function resetMatchFees(){
    state.matchFees = {};
    renderMatchFees(true);
    showMsg("msgMatchFees", "", true, true);
    save();
  }

  /* -----------------------------
     Exercise: Fill-in (word bank)
  ----------------------------- */
  let activeBlank = null;

  function renderFillDates(reset){
    const data = fillDatesData[state.lang];
    const bank = $("bankDates");
    const fill = $("fillDates");
    bank.innerHTML = "";
    fill.innerHTML = "";

    if(reset || !state.fillDates) state.fillDates = {};

    data.bank.forEach(w=>{
      const b = document.createElement("div");
      b.className = "pillWord";
      b.textContent = w;
      b.addEventListener("click", ()=>{
        if(activeBlank){
          const id = activeBlank.dataset.id;
          state.fillDates[id] = w;
          activeBlank.textContent = w;
          activeBlank.classList.remove("is-active");
          activeBlank = null;
          save();
        }
      });
      bank.appendChild(b);
    });

    data.items.forEach((it, idx)=>{
      const row = document.createElement("div");
      row.className = "sentence";
      const id = "d"+idx;
      const val = state.fillDates[id] || "";
      row.innerHTML = `${esc(it.s).replace("___", `<span class="blank" data-id="${id}">${val?esc(val):"___"}</span>`)}`;
      fill.appendChild(row);
    });

    qsa(".blank", fill).forEach(b=>{
      b.addEventListener("click", ()=>{
        qsa(".blank", fill).forEach(x=>x.classList.remove("is-active"));
        activeBlank = b;
        b.classList.add("is-active");
      });
    });
  }

  function checkFillDates(){
    const data = fillDatesData[state.lang];
    let ok = 0;
    data.items.forEach((it, idx)=>{
      const id = "d"+idx;
      if((state.fillDates[id]||"") === it.a) ok++;
    });
    if(ok === data.items.length){
      setScore(4, "fill");
      showMsg("msgFillDates", (state.lang==="fr"?"Super !":"Great!") + ` (${ok}/${data.items.length})`, true);
    } else {
      setScore(-1, "fill");
      showMsg("msgFillDates", (state.lang==="fr"?"Encore un effort : ":"Almost: ") + `${ok}/${data.items.length}`, false);
    }
    save();
  }

  function hintFillDates(){
    showMsg("msgFillDates", fillDatesData[state.lang].hint, true, true);
  }

  function resetFillDates(){
    state.fillDates = {};
    renderFillDates(true);
    showMsg("msgFillDates", "", true, true);
    save();
  }

  /* -----------------------------
     Exercise: Sentence builder
  ----------------------------- */
  function renderBuilder(reset){
    const data = builderData[state.lang];
    const cont = $("builder");
    cont.innerHTML = "";

    if(reset || !state.builder) state.builder = {picked: []};

    const bank = document.createElement("div");
    bank.className = "builder__bank";

    const answer = document.createElement("div");
    answer.className = "builder__answer slot";

    // bank words are words not already picked, plus picked? keep simple: full reset each render
    const picked = state.builder.picked || [];
    const remaining = data.words.filter(w=>!picked.includes(w) || countIn(picked,w) < countIn(data.words,w));

    // show picked as clickable to remove
    picked.forEach((w, idx)=>{
      const p = document.createElement("div");
      p.className = "pillWord";
      p.textContent = w;
      p.title = state.lang==="fr"?"Retirer":"Remove";
      p.addEventListener("click", ()=>{
        state.builder.picked.splice(idx,1);
        renderBuilder(false);
        save();
      });
      answer.appendChild(p);
    });

    remaining.forEach(w=>{
      const b = document.createElement("div");
      b.className = "pillWord";
      b.textContent = w;
      b.addEventListener("click", ()=>{
        state.builder.picked.push(w);
        renderBuilder(false);
        save();
      });
      bank.appendChild(b);
    });

    cont.appendChild(bank);
    cont.appendChild(answer);

    const info = document.createElement("div");
    info.className = "mini";
    info.textContent = state.lang==="fr" ? "Astuce : cliquez sur un mot dans la réponse pour le retirer." : "Tip: click a word in the answer to remove it.";
    cont.appendChild(info);
  }

  function countIn(arr, val){
    return arr.reduce((n,x)=>n+(x===val?1:0),0);
  }

  function checkBuilder(){
    const data = builderData[state.lang];
    const s = (state.builder.picked||[]).join(" ").replace(/\s+/g," ").trim();
    if(s === data.target){
      setScore(4, "builder");
      showMsg("msgBuilder", i18n[state.lang].correct, true);
    } else {
      setScore(-1, "builder");
      showMsg("msgBuilder", (state.lang==="fr"?"Pas encore. ":"Not yet. ") + (state.lang==="fr"?"Relisez l’ordre des mots.":"Check the word order."), false);
    }
    save();
  }

  function hintBuilder(){
    showMsg("msgBuilder", builderData[state.lang].hint, true, true);
  }

  function resetBuilder(){
    state.builder = {picked: []};
    renderBuilder(true);
    showMsg("msgBuilder", "", true, true);
    save();
  }

  /* -----------------------------
     Exercise: Letter parts reorder
  ----------------------------- */
  function renderLetterParts(reset){
    const box = $("letterParts");
    const data = letterPartsData[state.lang];
    if(reset || !Array.isArray(state.letterParts)){
      // start shuffled
      state.letterParts = shuffle(data.correct.slice());
    }

    box.innerHTML = "";
    const list = document.createElement("div");
    list.className = "partList";

    state.letterParts.forEach((txt, idx)=>{
      const row = document.createElement("div");
      row.className = "part";
      row.setAttribute("draggable", state.mode==="drag"?"true":"false");
      row.dataset.idx = String(idx);
      row.innerHTML = `
        <div class="part__drag" aria-hidden="true">☰</div>
        <div class="part__text">${esc(txt)}</div>
        <div class="part__btns">
          <button class="iconBtn" type="button" data-act="up" aria-label="Move up">↑</button>
          <button class="iconBtn" type="button" data-act="down" aria-label="Move down">↓</button>
        </div>
      `;
      // up/down
      qsa(".iconBtn", row).forEach(btn=>{
        btn.addEventListener("click", ()=>{
          const act = btn.dataset.act;
          movePart(idx, act==="up"?-1:1);
        });
      });
      // drag
      row.addEventListener("dragstart", (e)=>{
        if(state.mode!=="drag") return;
        e.dataTransfer.setData("text/plain", String(idx));
      });
      row.addEventListener("dragover", (e)=>{
        if(state.mode!=="drag") return;
        e.preventDefault();
      });
      row.addEventListener("drop", (e)=>{
        if(state.mode!=="drag") return;
        e.preventDefault();
        const from = Number(e.dataTransfer.getData("text/plain"));
        const to = idx;
        reorderParts(from, to);
      });

      list.appendChild(row);
    });

    box.appendChild(list);
  }

  function movePart(idx, delta){
    const arr = state.letterParts;
    const j = idx + delta;
    if(j<0 || j>=arr.length) return;
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    renderLetterParts(false);
    save();
  }

  function reorderParts(from, to){
    const arr = state.letterParts;
    const item = arr.splice(from,1)[0];
    arr.splice(to,0,item);
    renderLetterParts(false);
    save();
  }

  function checkLetterParts(){
    const correct = letterPartsData[state.lang].correct;
    const ok = state.letterParts.every((x,i)=>x===correct[i]);
    if(ok){
      setScore(4, "parts");
      showMsg("msgLetterParts", i18n[state.lang].correct, true);
    } else {
      setScore(-1, "parts");
      showMsg("msgLetterParts", i18n[state.lang].tryAgain, false);
    }
    save();
  }

  function hintLetterParts(){
    showMsg("msgLetterParts", letterPartsData[state.lang].hint, true, true);
  }

  function resetLetterParts(){
    state.letterParts = null;
    renderLetterParts(true);
    showMsg("msgLetterParts", "", true, true);
    save();
  }

  /* -----------------------------
     Email builder
  ----------------------------- */
  function renderEmailScenarioOptions(){
    const sel = $("emailScenario");
    sel.innerHTML = "";
    emailScenarios[state.lang].forEach(s=>{
      const o = document.createElement("option");
      o.value = s.id;
      o.textContent = s.label;
      sel.appendChild(o);
    });
  }

  function generateEmail(){
    const scn = $("emailScenario").value;
    const text = buildEmailTemplate(scn, {
      name: $("f_name").value.trim(),
      phone: $("f_phone").value.trim(),
      movein: $("f_movein").value.trim(),
      budget: $("f_budget").value.trim(),
      area: $("f_area").value.trim(),
      questions: $("f_questions").value.trim(),
    });
    $("emailOutput").value = text;
    showMsg("msgEmail", state.lang==="fr"?"Email généré.":"Email generated.", true, true);
    setScore(1, "email");
    save();
  }

  function copyEmail(){
    const txt = $("emailOutput").value;
    if(!txt.trim()) return;
    navigator.clipboard?.writeText(txt).then(()=>{
      showMsg("msgEmail", i18n[state.lang].copied, true);
    }).catch(()=>{
      showMsg("msgEmail", txt, true);
    });
  }

  function speakEmail(){
    const txt = $("emailOutput").value;
    if(!txt.trim()) return;
    // read only body (skip Subject line)
    const body = txt.split(/\n\n/).slice(1).join("\n\n");
    speak(body);
  }

  /* -----------------------------
     Dialogue
  ----------------------------- */
  function renderDialogue(reset){
    if(reset) state.dialogueIndex = 0;
    const box = $("dialogue");
    const arr = dialogueScript[state.lang];
    const i = state.dialogueIndex;
    box.innerHTML = "";

    const step = arr[i];
    if(!step){
      box.innerHTML = `<div class="line"><div class="line__who">✅</div><div class="line__text">${state.lang==="fr"?"Dialogue terminé.":"Dialogue complete."}</div></div>`;
      return;
    }

    const line = document.createElement("div");
    line.className = "line";
    line.innerHTML = `
      <div class="line__who">${esc(step.who)}</div>
      <div class="line__text">${esc(step.text)}</div>
      <div class="row row--tight"><button class="btn btn--ghost" type="button">🔊 Listen</button></div>
    `;
    qs("button", line).addEventListener("click", ()=>speak(step.text));

    const choices = document.createElement("div");
    choices.className = "choices";
    step.choices.forEach(ch=>{
      const b = document.createElement("button");
      b.className = "choice";
      b.type = "button";
      b.textContent = ch.t;
      b.addEventListener("click", ()=>{
        if(ch.ok){
          setScore(2, "dialogue");
          showMsg("msgDialogue", (state.lang==="fr"?"Bien ! ":"Good! ")+ch.why, true);
          state.dialogueIndex++;
          save();
          renderDialogue(false);
        } else {
          setScore(-1, "dialogue");
          showMsg("msgDialogue", (state.lang==="fr"?"Non. ":"No. ")+ch.why, false);
          save();
        }
      });
      choices.appendChild(b);
    });

    box.appendChild(line);
    box.appendChild(choices);
  }

  function nextDialogue(){
    state.dialogueIndex++;
    save();
    renderDialogue(false);
  }

  function resetDialogue(){
    state.dialogueIndex = 0;
    save();
    renderDialogue(true);
    showMsg("msgDialogue", "", true, true);
  }

  /* -----------------------------
     Reading
  ----------------------------- */
  function renderReading(reset){
    const data = readingData[state.lang];
    const box = $("reading");
    box.innerHTML = "";

    if(reset || !state.reading) state.reading = {};

    const pre = document.createElement("pre");
    pre.className = "mono";
    pre.textContent = data.listing;
    box.appendChild(pre);

    data.qs.forEach(q=>{
      const div = document.createElement("div");
      div.className = "q";
      const val = state.reading[q.id];
      div.innerHTML = `
        <div>${esc(q.t)}</div>
        <label class="choice"><input type="radio" name="${q.id}" value="true" ${val===true?"checked":""}/> True</label>
        <label class="choice"><input type="radio" name="${q.id}" value="false" ${val===false?"checked":""}/> False</label>
      `;
      qsa("input", div).forEach(inp=>{
        inp.addEventListener("change", ()=>{
          state.reading[q.id] = (inp.value==="true");
          save();
        });
      });
      box.appendChild(div);
    });
  }

  function checkReading(){
    const data = readingData[state.lang];
    let ok = 0;
    data.qs.forEach(q=>{
      if(state.reading[q.id] === q.a) ok++;
    });
    if(ok === data.qs.length){
      setScore(3, "reading");
      showMsg("msgReading", (state.lang==="fr"?"Bien joué !":"Well done!") + ` (${ok}/${data.qs.length})`, true);
    } else {
      setScore(-1, "reading");
      showMsg("msgReading", (state.lang==="fr"?"Vérifiez les détails dans l’annonce. ":"Check the listing details. ") + `(${ok}/${data.qs.length})`, false);
    }
    save();
  }

  function resetReading(){
    state.reading = {};
    renderReading(true);
    showMsg("msgReading", "", true, true);
    save();
  }

  /* -----------------------------
     Messages
  ----------------------------- */
  function showMsg(id, text, good, quiet){
    const el = $(id);
    if(!el) return;
    el.textContent = text;
    el.classList.remove("good","bad");
    if(!text){
      return;
    }
    if(quiet){
      // keep neutral color
      return;
    }
    el.classList.add(good?"good":"bad");
  }

  /* -----------------------------
     Accordion
  ----------------------------- */
  function setupAccordion(){
    qsa(".acc").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const expanded = btn.getAttribute("aria-expanded") === "true";
        const panelId = btn.getAttribute("aria-controls");
        const panel = $(panelId);
        btn.setAttribute("aria-expanded", expanded?"false":"true");
        if(panel){
          panel.hidden = expanded;
        }
      });
    });
  }

  /* -----------------------------
     Language/voice/mode toggles
  ----------------------------- */
  function setLang(lang){
    state.lang = lang;
    $("langEn").setAttribute("aria-pressed", lang==="en"?"true":"false");
    $("langFr").setAttribute("aria-pressed", lang==="fr"?"true":"false");
    setText();
    save();
  }

  function setVoice(v){
    state.voice = v;
    $("voiceUS").setAttribute("aria-pressed", v==="US"?"true":"false");
    $("voiceUK").setAttribute("aria-pressed", v==="UK"?"true":"false");
    save();
  }

  function setMode(m){
    state.mode = m;
    $("modeDrag").setAttribute("aria-pressed", m==="drag"?"true":"false");
    $("modeTap").setAttribute("aria-pressed", m==="tap"?"true":"false");
    // re-render drag-dependent exercises
    renderMatchFees(false);
    renderLetterParts(false);
    save();
  }

  function resetAll(){
    state.score = 0;
    state.streak = 0;
    state.checklist = {};
    state.mcqPolite = null;
    state.matchFees = {};
    state.fillDates = {};
    state.builder = {picked: []};
    state.letterParts = null;
    state.dialogueIndex = 0;
    state.reading = {};

    updateScoreUI();
    renderChecklistPanel();
    renderMcqPolite(true);
    renderMatchFees(true);
    renderFillDates(true);
    renderBuilder(true);
    renderLetterParts(true);
    renderDialogue(true);
    renderReading(true);

    showMsg("msgMcqPolite", "", true, true);
    showMsg("msgMatchFees", "", true, true);
    showMsg("msgFillDates", "", true, true);
    showMsg("msgBuilder", "", true, true);
    showMsg("msgLetterParts", "", true, true);
    showMsg("msgDialogue", "", true, true);
    showMsg("msgReading", "", true, true);
    showMsg("checklistMsg", state.lang==="fr"?"Tout a été réinitialisé.":"Everything has been reset.", true, true);

    save();
  }

  /* -----------------------------
     Init
  ----------------------------- */
  function init(){
    load();

    // set defaults for touch devices
    const isTouch = ("ontouchstart" in window) || navigator.maxTouchPoints>0;
    if(isTouch && !localStorage.getItem(STORE_KEY)){
      state.mode = "tap";
    }

    TTS.init();

    // category dropdown
    const catSel = $("vocabCategory");
    catSel.innerHTML = "";
    getCategories().forEach(c=>{
      const o = document.createElement("option");
      o.value = c;
      o.textContent = c;
      catSel.appendChild(o);
    });

    // apply toggles
    $("langEn").addEventListener("click", ()=>setLang("en"));
    $("langFr").addEventListener("click", ()=>setLang("fr"));
    $("voiceUS").addEventListener("click", ()=>setVoice("US"));
    $("voiceUK").addEventListener("click", ()=>setVoice("UK"));
    $("modeDrag").addEventListener("click", ()=>setMode("drag"));
    $("modeTap").addEventListener("click", ()=>setMode("tap"));

    // buttons
    $("btnResetAll").addEventListener("click", resetAll);
    $("btnTestVoice").addEventListener("click", ()=>{
      const t = state.lang==="fr"?"Testing voice. Would it be possible to schedule a viewing on Tuesday at 4 p.m.?":"Testing voice. Would it be possible to schedule a viewing on Tuesday at 4 p.m.?";
      speak(t);
    });
    $("btnPrint").addEventListener("click", ()=>window.print());
    $("btnQuickStart").addEventListener("click", ()=>{
      location.hash = "#steps";
    });

    // tabs
    $("tab_pre").addEventListener("click", ()=>setActiveTab("pre"));
    $("tab_search").addEventListener("click", ()=>setActiveTab("search"));
    $("tab_apply").addEventListener("click", ()=>setActiveTab("apply"));
    $("tab_lease").addEventListener("click", ()=>setActiveTab("lease"));
    $("tab_move").addEventListener("click", ()=>setActiveTab("move"));
    $("tab_after").addEventListener("click", ()=>setActiveTab("after"));

    // checklist export/reset
    $("btnExportChecklist").addEventListener("click", exportChecklist);
    $("btnResetChecklist").addEventListener("click", resetChecklist);

    // flashcard controls
    $("flashCard").addEventListener("click", ()=>{flipped=!flipped; updateFlash();});
    $("flashCard").addEventListener("keydown", (e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); flipped=!flipped; updateFlash(); }});
    $("btnFlip").addEventListener("click", ()=>{flipped=!flipped; updateFlash();});
    $("btnPrev").addEventListener("click", ()=>{deckIndex = (deckIndex-1+deck.length)%deck.length; flipped=false; updateFlash();});
    $("btnNext").addEventListener("click", ()=>{deckIndex = (deckIndex+1)%deck.length; flipped=false; updateFlash();});
    $("btnVocabShuffle").addEventListener("click", ()=>{deck = shuffle(deck); deckIndex=0; flipped=false; updateFlash(); setScore(1,"shuffle");});
    $("btnSpeakFront").addEventListener("click", ()=>{const it=deck[deckIndex]; speak(it.term);});
    $("btnSpeakBack").addEventListener("click", ()=>{const it=deck[deckIndex]; speak(it.def);});
    catSel.addEventListener("change", ()=>{deckIndex=0; buildDeck();});

    // practice buttons
    $("btnCheckMcqPolite").addEventListener("click", checkMcqPolite);
    $("btnHintMcqPolite").addEventListener("click", hintMcqPolite);
    $("btnResetMcqPolite").addEventListener("click", resetMcqPolite);

    $("btnCheckMatchFees").addEventListener("click", checkMatchFees);
    $("btnHintMatchFees").addEventListener("click", hintMatchFees);
    $("btnResetMatchFees").addEventListener("click", resetMatchFees);

    $("btnCheckFillDates").addEventListener("click", checkFillDates);
    $("btnHintFillDates").addEventListener("click", hintFillDates);
    $("btnResetFillDates").addEventListener("click", resetFillDates);

    $("btnCheckBuilder").addEventListener("click", checkBuilder);
    $("btnHintBuilder").addEventListener("click", hintBuilder);
    $("btnResetBuilder").addEventListener("click", resetBuilder);

    $("btnCheckLetterParts").addEventListener("click", checkLetterParts);
    $("btnHintLetterParts").addEventListener("click", hintLetterParts);
    $("btnResetLetterParts").addEventListener("click", resetLetterParts);

    $("btnBuildEmail").addEventListener("click", generateEmail);
    $("btnCopyEmail").addEventListener("click", copyEmail);
    $("btnSpeakEmail").addEventListener("click", speakEmail);

    $("btnNextDialogue").addEventListener("click", nextDialogue);
    $("btnResetDialogue").addEventListener("click", resetDialogue);

    $("btnCheckReading").addEventListener("click", checkReading);
    $("btnResetReading").addEventListener("click", resetReading);

    setupAccordion();

    // set toggle UI
    $("langEn").setAttribute("aria-pressed", state.lang==="en"?"true":"false");
    $("langFr").setAttribute("aria-pressed", state.lang==="fr"?"true":"false");
    $("voiceUS").setAttribute("aria-pressed", state.voice==="US"?"true":"false");
    $("voiceUK").setAttribute("aria-pressed", state.voice==="UK"?"true":"false");
    $("modeDrag").setAttribute("aria-pressed", state.mode==="drag"?"true":"false");
    $("modeTap").setAttribute("aria-pressed", state.mode==="tap"?"true":"false");

    // initial render
    setText();
    setActiveTab(activeStep);
    buildDeck();

    updateScoreUI();
    save();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
