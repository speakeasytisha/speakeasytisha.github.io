(() => {
  'use strict';
  window.__MidtermLoaded = true;

  const lessonLinks = [{"title": "Resource", "type": "Slides", "url": "https://docs.google.com/presentation/d/16wN3gX5CTXnX95Q6oyS3rBiMDfaIce7J/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true", "tags": []}, {"title": "Grammar, Dialogue, Role Play, Vocabulary, Pronunciation", "type": "Slides", "url": "https://docs.google.com/presentation/d/17aCbbGUk17nmmBQtcZEKMh8BHOeYDvQx/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "tags": ["Grammar", "Dialogue", "Role Play", "Vocabulary", "Pronunciation"]}, {"title": "Vocabulary, Comprehension, Comparison", "type": "Slides", "url": "https://docs.google.com/presentation/d/15rFwsI5_OabNY4Fe2S6UtWqL5SZc1HId/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "tags": ["Vocabulary", "Comprehension", "Comparison"]}, {"title": "Grammar, Dialogue, Role Play, Vocabulary, Pronunciation,Reading comprehension", "type": "Slides", "url": "https://docs.google.com/presentation/d/1eHXjEAasdu82kMtD9wf2N2sJO8317abk/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true", "tags": ["Grammar", "Dialogue", "Role Play", "Vocabulary", "Pronunciation", "Reading comprehension"]}, {"title": "Grammar, Dialogue, Role Play, Vocabulary, Pronunciation,Reading comprehension", "type": "Slides", "url": "https://docs.google.com/presentation/d/1-QToJfWoRhO9azoeDacgCnRCk3tYu_-O/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "tags": ["Grammar", "Dialogue", "Role Play", "Vocabulary", "Pronunciation", "Reading comprehension"]}, {"title": "Check-in, room description, there is/there are, prepositions of place, present simple, future simple, issues with the room", "type": "Slides", "url": "https://docs.google.com/presentation/d/1J00yboy0pY6MsedJL_CN4W1aa0jx_Vo9/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true", "tags": ["Check-in", "room description", "there is", "there are", "prepositions of place", "present simple", "future simple", "issues with the room"]}, {"title": "Dialogue, Check-out, Past Simple, Exercises, Adjectives, Transition words, writing task", "type": "Slides", "url": "https://docs.google.com/presentation/d/18hMNoUH6WlcjSPmIINsRq1kxbub_6L3I/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "tags": ["Dialogue", "Check-out", "Past Simple", "Exercises", "Adjectives", "Transition words", "writing task"]}, {"title": "Dialogue, Check-out, Past Simple, Exercises, Adjectives, Transition words, writing task", "type": "Slides", "url": "https://docs.google.com/presentation/d/13tP9l0g9zVtSIVnK01Qx_15mN5F7CNGG/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "tags": ["Dialogue", "Check-out", "Past Simple", "Exercises", "Adjectives", "Transition words", "writing task"]}, {"title": "vocabulary, grammar, exercises, dialogues, role-play", "type": "Site", "url": "https://sites.google.com/view/speakeasytisha/theme/restaurant-of-the-year?authuser=0", "tags": ["vocabulary", "grammar", "exercises", "dialogues", "role-play"]}, {"title": "vocabulary, reading comprehension, recipes, meals", "type": "Site", "url": "https://sites.google.com/view/speakeasytisha/theme/thanksgiving?authuser=0", "tags": ["vocabulary", "reading comprehension", "recipes", "meals"]}, {"title": "Reading exercises, discussions", "type": "Lesson page", "url": "https://speakeasytisha.github.io/myriam-reading.html", "tags": ["Reading exercises", "discussions", "Reading"]}, {"title": "Exercises, dialogue, writing, speaking", "type": "Lesson page", "url": "https://speakeasytisha.github.io/english-360-prep.html", "tags": ["Exercises", "dialogue", "writing", "speaking"]}, {"title": "✅ write + send New Year wishes (cards, texts, emails)", "type": "Lesson page", "url": "https://speakeasytisha.github.io/new-year.html", "tags": ["✅ write + send New Year wishes (cards", "texts", "emails)"]}, {"title": "✅ Understand UK/US differences", "type": "Lesson page", "url": "https://speakeasytisha.github.io/shopping-spree", "tags": ["✅ Understand UK", "US differences"]}, {"title": "✅ Ask about sizes, fit, materials, price, and delivery✅ Use polite requests (Could I…? Would you mind…?)✅ Use verbs used in shops (try on, fit, suit, exchange…)✅ Compare options (cheaper, more comfortable, bigger…)✅ Understand UK/US vocabulary differences", "type": "Lesson page", "url": "https://speakeasytisha.github.io/shopping-spree-followup-stores", "tags": ["✅ Ask about sizes", "fit", "materials", "price", "fit", "suit", "exchange…)✅ Compare options (cheaper", "more comfortable"]}, {"title": "✅ Complete listening + speaking practice", "type": "Lesson page", "url": "https://speakeasytisha.github.io/cooking-quest.html", "tags": ["✅ Complete listening + speaking practice"]}, {"title": "History, genres, filmmaking, Universal Studios, and a French vs American cinema comparison — with vocabulary flashcards, grammar practice (connectors + comparatives + superlatives), and interactive exercises.", "type": "Lesson page", "url": "https://speakeasytisha.github.io/movies-lesson", "tags": ["History", "genres", "filmmaking", "Universal Studios", "and interactive exercises."]}, {"title": "Learn how to talk about TV series: genres, characters, episodes, plot twists, and why a show works. Practice present perfect vs past simple, connectors, comparatives & superlatives, and recommendation language", "type": "Lesson page", "url": "https://speakeasytisha.github.io/tv-series-lesson", "tags": ["characters", "episodes", "plot twists", "connectors", "comparatives & superlatives", "and recommendation language"]}, {"title": "🏁 Final: write + speak your review", "type": "Lesson page", "url": "https://speakeasytisha.github.io/people-profile-match", "tags": ["🏁 Final: write + speak your review"]}, {"title": "ED: /t/ /d/ /ɪd/ (worked, played, wanted)", "type": "Lesson page", "url": "https://speakeasytisha.github.io/pronunciation-sounds-masterclass#sEs", "tags": ["ED:", "t", "d", "ɪd", "(worked", "played", "wanted)", "Pronunciation"]}, {"title": "numbers-masterclass: phone numbers, room numbers, codes, emails, names, addresses, and cash", "type": "Lesson page", "url": "https://speakeasytisha.github.io/numbers-masterclass-addon", "tags": ["numbers-masterclass: phone numbers", "room numbers", "codes", "emails", "names", "addresses", "and cash"]}, {"title": "build a simple itinerary, and practise requests, suggestions, obligation, and polite disagreement — with NYC‑specific vocabulary and “New York vibe” language.", "type": "Lesson page", "url": "https://speakeasytisha.github.io/nyc-trip-planner-compare.html", "tags": ["build a simple itinerary", "and practise requests", "suggestions", "obligation"]}, {"title": "✅ Sound warm (not too direct) in English", "type": "Lesson page", "url": "https://speakeasytisha.github.io/valentines-day-sweet-notes.html", "tags": ["✅ Sound warm (not too direct) in English"]}, {"title": "Listening → Reading → Grammar → Speaking → Writing. Focus spécial : Speaking + Writing (structure + richesse + vocab pro).", "type": "Lesson page", "url": "https://speakeasytisha.github.io/english-360-next-step-pack2.html", "tags": []}, {"title": "Sentence Builder + mini test → earn Key #3", "type": "Lesson page", "url": "https://speakeasytisha.github.io/professions-fun-titles", "tags": []}, {"title": "Current events, vocabulary, and the timeline tenses (Present / Past / Past Continuous)", "type": "Lesson page", "url": "https://speakeasytisha.github.io/newsflash_v2.html", "tags": ["Current events", "vocabulary", "and the timeline tenses (Present", "Past", "Past Continuous)"]}, {"title": "Listening • Reading • Grammar • Speaking • Writing", "type": "Lesson page", "url": "https://speakeasytisha.github.io/english360-travel-exam-success-hub.html", "tags": []}, {"title": "Read the News. Analyse It. React Like a Journalist. Grammar focus, Speaking , Turn a headline into a full sentence, Grammar lab, React, discuss, debate, Write like a journalist", "type": "Lesson page", "url": "https://speakeasytisha.github.io/newsflash-pro-v2", "tags": ["Speaking", "Turn a headline into a full sentence", "Grammar lab", "React", "discuss", "debate", "Write like a journalist"]}, {"title": "Write emails Email 1 — Request for information (hotel), Email 2 — Reschedule (change dates),", "type": "Lesson page", "url": "https://speakeasytisha.github.io/english360-miriam-email-speaking-masterclass.html", "tags": ["Email 2 — Reschedule (change dates)", "Speaking"]}, {"title": "Write essay: tips, vocabulary, connectors, sequencing, tenses", "type": "Doc", "url": "https://docs.google.com/document/d/16a6cDhldMUKpUv_BOtFxP-0FuILcUGoq/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "tags": ["Write essay: tips", "vocabulary", "connectors", "sequencing", "tenses"]}, {"title": "Introduce yourself: Write essay: tips, vocabulary, connectors, sequencing, tenses", "type": "Doc", "url": "https://docs.google.com/document/d/1lS4cuppy3dP0gdaft0J4vujwKTPdi_U4/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "tags": ["Introduce yourself: Write essay: tips", "vocabulary", "connectors", "sequencing", "tenses"]}, {"title": "clear steps: idea → plan → sentence → paragraph → full essay", "type": "Doc", "url": "https://docs.google.com/document/d/1LZLM-LKAQJ3bDr7ZMBjckNG9O88DSud9/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "tags": []}, {"title": "VOCABULARY • CONNECTORS • GUIDED WRITING FRAME • 3 MODEL VERSIONS, Is online learning better than face-to-face learning?", "type": "Other", "url": "https://drive.google.com/file/d/1aMkgBlKllyH2cBQx1eo3vIiyuTfuXDel/view?usp=sharing", "tags": []}, {"title": "1) Vocabulary, 2) Accuracy booster (articles + verbs + prepositions), 3) Sentence builder (control + variety), 4) Sequencing + connectors (make it flow), 5) Writing tasks (exam-style) — hobbies + travel life, 6) Speaking (60 seconds)", "type": "Other", "url": "https://cdn.filestackcontent.com/0ohOL122S1S9TLOdIsdc", "tags": ["1) Vocabulary", "3) Sentence builder (control + variety)", "6) Speaking (60 seconds)"]}, {"title": "Travel vocabulary + itinerary builder", "type": "Lesson page", "url": "https://speakeasytisha.github.io/english360-myriam-anniversary-honeymoon-lesson.html", "tags": ["Travel vocabulary + itinerary builder"]}, {"title": "vocabulary, and builddescribing an image clearly (and speadescribing an image clearly (and speaking/writing about it). You will explore real places, learn matching vocabulary, and buildking/writing about it).", "type": "Lesson page", "url": "https://speakeasytisha.github.io/english360-myriam-dream-usa-to-die-for-places-v2.html", "tags": ["vocabulary", "learn matching vocabulary", "and buildking", "writing about it)."]}, {"title": ", 6) Writing (mini text)", "type": "Lesson page", "url": "https://speakeasytisha.github.io/english360-myriam-hopes-dreams-conditionals-v2.html", "tags": ["6) Writing (mini text)"]}, {"title": "Talk about your values, what you learned from your parents, and what you want to pass down to your children. You’ll practise useful “exam‑safe” structures.", "type": "Doc", "url": "https://docs.google.com/document/d/12NxBncHbA38i-TIjVJULqyJPcpcHb4BegblJ52XZicM/edit?usp=sharing\"", "tags": ["Talk about your values", "what you learned from your parents"]}];
const linkTypes = ["All", "Doc", "Lesson page", "Other", "Site", "Slides"];
const linkTags = ["All", "(worked", "1) Vocabulary", "3) Sentence builder (control + variety)", "6) Speaking (60 seconds)", "6) Writing (mini text)", "addresses", "Adjectives", "and buildking", "and cash", "and interactive exercises.", "and practise requests", "and recommendation language", "and the timeline tenses (Present", "build a simple itinerary", "characters", "Check-in", "Check-out", "codes", "comparatives & superlatives", "Comparison", "Comprehension", "connectors", "Current events", "d", "debate", "Dialogue", "dialogue", "dialogues", "discuss", "discussions", "ED:", "Email 2 — Reschedule (change dates)", "emails", "emails)", "episodes", "exchange…)✅ Compare options (cheaper", "exercises", "Exercises", "filmmaking", "fit", "future simple", "genres", "grammar", "Grammar", "Grammar lab", "History", "Introduce yourself: Write essay: tips", "issues with the room", "learn matching vocabulary", "materials", "meals", "more comfortable", "names", "numbers-masterclass: phone numbers", "obligation", "Past", "Past Continuous)", "Past Simple", "played", "plot twists", "prepositions of place", "present simple", "price", "Pronunciation", "React", "Reading", "reading comprehension", "Reading comprehension", "Reading exercises", "recipes", "Role Play", "role-play", "room description", "room numbers", "sequencing", "speaking", "Speaking", "suggestions", "suit", "t", "Talk about your values", "tenses", "texts", "there are", "there is", "Transition words", "Travel vocabulary + itinerary builder", "Turn a headline into a full sentence", "Universal Studios", "US differences", "Vocabulary", "vocabulary", "wanted)", "what you learned from your parents", "Write essay: tips", "Write like a journalist", "writing", "writing about it).", "writing task", "ɪd", "✅ Ask about sizes", "✅ Complete listening + speaking practice", "✅ Sound warm (not too direct) in English", "✅ Understand UK", "✅ write + send New Year wishes (cards", "🏁 Final: write + speak your review"];

const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const pad2 = n => String(n).padStart(2,'0');
  const fmt = s => `${pad2(Math.floor(s/60))}:${pad2(s%60)}`;
  const shuffle = (arr) => { const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; };
  const norm = (s) => (s||'').toLowerCase().replace(/[^\w\s’'-]/g,' ').replace(/\s+/g,' ').trim();
  const wordCount = (t) => (t||'').trim().split(/\s+/).filter(Boolean).length;

  // TTS
  const tts = { voices:[], accent:'US', rate:1 };
  const loadVoices = () => { try{ tts.voices = speechSynthesis.getVoices(); }catch(e){ tts.voices=[]; } };
  const pickVoice = () => {
    const v = tts.voices || [];
    if(!v.length) return null;
    const wants = tts.accent==='UK' ? ['en-GB','United Kingdom','UK'] : ['en-US','United States','US'];
    return v.find(x => wants.some(w => (x.lang||'').includes(w) || (x.name||'').includes(w)))
      || v.find(x => (x.lang||'').startsWith('en'))
      || v[0];
  };
  const speak = (text) => {
    if(!('speechSynthesis' in window) || !text) return;
    try{
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = tts.rate;
      const v = pickVoice(); if(v) u.voice = v;
      speechSynthesis.speak(u);
    }catch(e){}
  };

  // Score
  const score = { ok:0, total:0 };
  const updateScore = () => {
    $('#scorePill').textContent = `${score.ok} / ${score.total}`;
    $('#acc').textContent = score.total ? `${Math.round(score.ok/score.total*100)}%` : '0%';
  };
  const addScore = (ok) => { score.total++; if(ok) score.ok++; updateScore(); };
  const resetScore = () => { score.ok=0; score.total=0; updateScore(); };

  // Timers
  const timers = {};
  const startTimer = (key, seconds, outEl) => {
    if(timers[key]) clearInterval(timers[key]);
    let left = seconds;
    outEl.textContent = fmt(left);
    timers[key] = setInterval(()=> {
      left--;
      outEl.textContent = fmt(Math.max(0,left));
      if(left<=0){ clearInterval(timers[key]); timers[key]=null; }
    },1000);
  };
  const stopTimer = (key, outEl) => {
    if(timers[key]) clearInterval(timers[key]);
    timers[key]=null;
    outEl.textContent="00:00";
  };

  // State
  const state = { level:'A2', showFR:true, mcq:null, mcqChoice:null, fix:null, currentCond:null, currentRead:null, currentGram:null, gramChoice:null, currentV:null };

  const setLevel = (lvl) => {
    state.level=lvl;
    $$('.segBtn[data-level]').forEach(b=>b.classList.toggle('on', b.dataset.level===lvl));
    $('#sitModel').textContent='—';
    $('#spModel').textContent='—';
    $('#wrModel').textContent='—';
  };
  const setFR = (on) => {
    state.showFR=!!on;
    $('#frToggle').textContent = state.showFR ? 'On' : 'Off';
    $('#frToggle').setAttribute('aria-pressed', state.showFR ? 'true':'false');
    renderVocab();
  };
  const setAccent = (acc) => {
    tts.accent=acc;
    $$('.segBtn[data-accent]').forEach(b=>b.classList.toggle('on', b.dataset.accent===acc));
  };

  // Review blocks
  const tenseMap = [
    "✅ Past Simple: yesterday / last week (finished past)",
    "  I checked out yesterday. We visited New York.",
    "",
    "✅ Past Continuous: was/were + -ing (background / interruption)",
    "  I was waiting at reception when the taxi arrived.",
    "",
    "✅ Present Perfect: have/has + past participle (experience / result now)",
    "  I have been to London. I have lost my luggage.",
    "",
    "✅ Present Simple: habits / facts",
    "  I usually travel in spring.",
    "",
    "✅ Future: going to (plan) / will (prediction)",
    "  I'm going to book a room. It will rain tomorrow."
  ].join("\n");

  const tenseChips = [
    {t:"Past Simple", ex:"Yesterday, I arrived late."},
    {t:"Present Perfect", ex:"I have never tried sushi."},
    {t:"Going to", ex:"I’m going to visit my grandchildren."},
    {t:"Will", ex:"I think it will be expensive."},
    {t:"Past Continuous", ex:"I was driving when it started raining."}
  ];

  const condMap = [
    "✅ Real future: If + present, will + verb",
    "  If I have time, I will practise my English.",
    "",
    "✅ Dream / imaginary: If + past, would + verb",
    "  If I spoke English better, I would visit the USA.",
    "",
    "Exam‑safe: If I were you, I would…"
  ].join("\n");

  const condPrompts = [
    {q:"Tonight is busy, but maybe you have time later. Make a real plan.", a:"If I have time tonight, I will practise my English."},
    {q:"Imagine your English is perfect. What would you do?", a:"If I spoke English perfectly, I would travel around the USA."},
    {q:"Imagine you win the lottery. What would you do?", a:"If I won the lottery, I would travel more often."}
  ];

  // Travel situations
  const situations = [
    {id:"hotel_info", label:"Hotel: ask for information", prompt:"You want to book a room. Ask for availability, total price (taxes), and what is included (breakfast, Wi‑Fi).", models:{
      A2:"Could you confirm availability and the total price including taxes? Is breakfast included? Thank you.",
      B1:"Could you confirm the total price per night including taxes and what is included (breakfast, Wi‑Fi)? Thank you in advance.",
      B2:"Could you confirm the total rate including taxes and any extra fees, and clarify what is included (breakfast, Wi‑Fi)? Many thanks."
    }},
    {id:"restaurant", label:"Restaurant: order & complain", prompt:"Order politely and complain politely about a problem.", models:{
      A2:"Could I have the chicken salad, please? Sorry, my soup is cold. Could you warm it up, please?",
      B1:"Could I have the chicken salad, please? Excuse me, my soup is cold. Could you heat it up or change it, please?",
      B2:"Could I have the chicken salad, please? Excuse me, my soup is cold. Would it be possible to heat it up or replace it?"
    }},
    {id:"shopping", label:"Shopping: sizes & returns", prompt:"Ask for size/material and exchange policy. Compare two options.", models:{
      A2:"Do you have this in size M? Can I exchange it if it doesn’t fit?",
      B1:"If it doesn’t fit, can I exchange it or get a refund? This one is cheaper, but the other one is more comfortable.",
      B2:"If it doesn’t fit, could I exchange it or get a refund? This one is cheaper; however, the other one looks more comfortable."
    }},
    {id:"directions", label:"Directions", prompt:"Ask for directions using next to / across from / turn left / go straight.", models:{
      A2:"Excuse me, where is the pharmacy? Go straight, then turn left. It’s next to the bank.",
      B1:"Excuse me, could you tell me where the pharmacy is? Go straight, then take the first left. It’s next to the bank.",
      B2:"Excuse me, could you tell me how to get to the pharmacy? Go straight ahead, take the first left, and it’ll be on your right."
    }}
  ];

  // Vocabulary
  const vocab = [{"id": "reservation", "cat": "Hotel", "icon": "🏨", "en": "reservation", "fr": "réservation", "def": "a booking", "ex": "I would like to confirm my reservation."}, {"id": "availability", "cat": "Hotel", "icon": "🛏️", "en": "availability", "fr": "disponibilité", "def": "if a room is free", "ex": "Could you confirm availability?"}, {"id": "rate", "cat": "Hotel", "icon": "💶", "en": "rate", "fr": "tarif", "def": "price per night", "ex": "What is the rate per night?"}, {"id": "taxes", "cat": "Hotel", "icon": "🧾", "en": "taxes", "fr": "taxes", "def": "extra money added to the price", "ex": "Is the price including taxes?"}, {"id": "city_tax", "cat": "Hotel", "icon": "🏙️", "en": "city tax", "fr": "taxe de séjour", "def": "local tourist tax", "ex": "Is there a city tax?"}, {"id": "check_in", "cat": "Hotel", "icon": "🕒", "en": "check-in", "fr": "arrivée", "def": "time you can enter the room", "ex": "What time is check-in?"}, {"id": "check_out", "cat": "Hotel", "icon": "🕚", "en": "check-out", "fr": "départ", "def": "time you must leave the room", "ex": "What time is check-out?"}, {"id": "included", "cat": "Hotel", "icon": "✅", "en": "included", "fr": "inclus", "def": "part of the price", "ex": "Is breakfast included?"}, {"id": "quiet_room", "cat": "Hotel", "icon": "🤫", "en": "quiet room", "fr": "chambre calme", "def": "not noisy", "ex": "If possible, I would like a quiet room."}, {"id": "upgrade", "cat": "Hotel", "icon": "⬆️", "en": "upgrade", "fr": "surclassement", "def": "a better room", "ex": "Is an upgrade possible?"}, {"id": "cancel", "cat": "Hotel", "icon": "🗓️", "en": "cancel", "fr": "annuler", "def": "stop a reservation", "ex": "Can I cancel my reservation?"}, {"id": "reschedule", "cat": "Hotel", "icon": "🔁", "en": "reschedule", "fr": "reprogrammer", "def": "change dates", "ex": "Could we reschedule our reservation?"}, {"id": "boarding_pass", "cat": "Airport", "icon": "🎫", "en": "boarding pass", "fr": "carte d’embarquement", "def": "ticket to board the plane", "ex": "I can’t find my boarding pass."}, {"id": "gate", "cat": "Airport", "icon": "🚪", "en": "gate", "fr": "porte", "def": "where you board", "ex": "Which gate is it?"}, {"id": "carry_on", "cat": "Airport", "icon": "🧳", "en": "carry-on bag", "fr": "bagage cabine", "def": "bag you take on the plane", "ex": "Is my carry-on bag allowed?"}, {"id": "checked_bag", "cat": "Airport", "icon": "🧳", "en": "checked baggage", "fr": "bagage en soute", "def": "bag checked in", "ex": "My checked baggage is missing."}, {"id": "baggage_claim", "cat": "Airport", "icon": "🧳", "en": "baggage claim", "fr": "retrait bagages", "def": "area to collect bags", "ex": "Where is baggage claim?"}, {"id": "lost_luggage", "cat": "Airport", "icon": "❗", "en": "lost luggage", "fr": "bagage perdu", "def": "missing bag", "ex": "I need to report lost luggage."}, {"id": "deliver", "cat": "Airport", "icon": "🚚", "en": "deliver", "fr": "livrer", "def": "bring to a place", "ex": "Could you deliver it to my hotel?"}, {"id": "menu", "cat": "Restaurant", "icon": "📋", "en": "menu", "fr": "menu", "def": "list of dishes", "ex": "Could we see the menu, please?"}, {"id": "bill", "cat": "Restaurant", "icon": "💳", "en": "bill / check", "fr": "addition", "def": "paper with the price", "ex": "Could we have the bill, please?"}, {"id": "allergy", "cat": "Restaurant", "icon": "⚠️", "en": "allergy", "fr": "allergie", "def": "bad reaction to food", "ex": "I have a nut allergy."}, {"id": "ingredient", "cat": "Restaurant", "icon": "🥗", "en": "ingredient", "fr": "ingrédient", "def": "part of a recipe", "ex": "Does it contain nuts?"}, {"id": "overcooked", "cat": "Restaurant", "icon": "🔥", "en": "overcooked", "fr": "trop cuit", "def": "cooked too much", "ex": "The steak is overcooked."}, {"id": "cold", "cat": "Restaurant", "icon": "🥣", "en": "cold", "fr": "froid", "def": "not hot", "ex": "Sorry, my soup is cold."}, {"id": "replace", "cat": "Restaurant", "icon": "🔁", "en": "replace", "fr": "remplacer", "def": "give a new one", "ex": "Could you replace it, please?"}, {"id": "size", "cat": "Shopping", "icon": "📏", "en": "size", "fr": "taille", "def": "how big it is", "ex": "Do you have this in size M?"}, {"id": "fit", "cat": "Shopping", "icon": "🧥", "en": "fit", "fr": "aller", "def": "be the right size", "ex": "It doesn’t fit me."}, {"id": "exchange", "cat": "Shopping", "icon": "🔁", "en": "exchange", "fr": "échanger", "def": "change for another item", "ex": "Can I exchange it?"}, {"id": "refund", "cat": "Shopping", "icon": "💶", "en": "refund", "fr": "remboursement", "def": "money returned", "ex": "Can I get a refund?"}, {"id": "receipt", "cat": "Shopping", "icon": "🧾", "en": "receipt", "fr": "ticket de caisse", "def": "proof you paid", "ex": "Do you need the receipt?"}, {"id": "discount", "cat": "Shopping", "icon": "🏷️", "en": "discount", "fr": "réduction", "def": "lower price", "ex": "Is there a discount?"}, {"id": "aisle", "cat": "Shopping", "icon": "🛒", "en": "aisle", "fr": "rayon", "def": "walkway in a store", "ex": "Where is the pasta aisle?"}, {"id": "directions", "cat": "Directions", "icon": "🧭", "en": "directions", "fr": "directions", "def": "how to go somewhere", "ex": "Could you give me directions?"}, {"id": "go_straight", "cat": "Directions", "icon": "⬆️", "en": "go straight", "fr": "aller tout droit", "def": "continue forward", "ex": "Go straight for two blocks."}, {"id": "turn_left", "cat": "Directions", "icon": "⬅️", "en": "turn left", "fr": "tourner à gauche", "def": "change direction left", "ex": "Turn left at the corner."}, {"id": "turn_right", "cat": "Directions", "icon": "➡️", "en": "turn right", "fr": "tourner à droite", "def": "change direction right", "ex": "Turn right after the bank."}, {"id": "next_to", "cat": "Directions", "icon": "🧭", "en": "next to", "fr": "à côté de", "def": "beside", "ex": "It’s next to the bank."}, {"id": "across", "cat": "Directions", "icon": "🧭", "en": "across from", "fr": "en face de", "def": "opposite", "ex": "It’s across from the café."}, {"id": "corner", "cat": "Directions", "icon": "📍", "en": "at the corner", "fr": "au coin", "def": "where two streets meet", "ex": "It’s at the corner of Main Street."}, {"id": "because", "cat": "Connectors", "icon": "🔗", "en": "because", "fr": "parce que", "def": "gives a reason", "ex": "I like it because it’s quiet."}, {"id": "however", "cat": "Connectors", "icon": "🔗", "en": "however", "fr": "cependant", "def": "contrast", "ex": "It’s expensive; however, it’s comfortable."}, {"id": "in_addition", "cat": "Connectors", "icon": "🔗", "en": "in addition", "fr": "en plus", "def": "adds information", "ex": "In addition, breakfast is included."}, {"id": "overall", "cat": "Connectors", "icon": "🔗", "en": "overall", "fr": "globalement", "def": "in general / conclusion", "ex": "Overall, we were satisfied."}, {"id": "for_example", "cat": "Connectors", "icon": "🔗", "en": "for example", "fr": "par exemple", "def": "gives an example", "ex": "For example, I practise twice a week."}, {"id": "so_that", "cat": "Connectors", "icon": "🔗", "en": "so that", "fr": "afin que", "def": "purpose", "ex": "I study so that I can improve."}, {"id": "honest", "cat": "Values", "icon": "🧭", "en": "honest", "fr": "honnête", "def": "telling the truth", "ex": "It’s important to be honest."}, {"id": "kind", "cat": "Values", "icon": "💛", "en": "kind", "fr": "gentil(le)", "def": "nice and helpful", "ex": "I try to be kind to others."}, {"id": "patient", "cat": "Values", "icon": "🧘", "en": "patient", "fr": "patient(e)", "def": "able to wait calmly", "ex": "I need to be patient."}, {"id": "respectful", "cat": "Values", "icon": "🤝", "en": "respectful", "fr": "respectueux(se)", "def": "showing respect", "ex": "I have always tried to be respectful."}, {"id": "hardworking", "cat": "Values", "icon": "💪", "en": "hardworking", "fr": "travailleur(se)", "def": "working hard", "ex": "It’s important to be hardworking."}, {"id": "responsible", "cat": "Values", "icon": "✅", "en": "responsible", "fr": "responsable", "def": "reliable and careful", "ex": "I want to be responsible."}];
  const vocabCats = ["All", ...Array.from(new Set(vocab.map(v=>v.cat))).sort((a,b)=>a.localeCompare(b))];

  // Diagnostic banks
  const mcqBank = [
    {q:"___ I have time, I will practise my English.", opts:["If","When","Although"], a:"If", tip:"Real possibility: If + present, will."},
    {q:"If I ___ the lottery, I would travel more.", opts:["win","won","winning"], a:"won", tip:"Dream: If + past, would + verb."},
    {q:"I ___ to New York last year.", opts:["go","went","have been"], a:"went", tip:"Last year → past simple."},
    {q:"I ___ to London. (experience)", opts:["went","have been","was"], a:"have been", tip:"Experience → present perfect."},
    {q:"It’s important to ___ respectful.", opts:["be","being","to"], a:"be", tip:"It’s important to be + adjective."}
  ];
  const fixBank = [
    {bad:"If I will have time, I will practise.", good:"If I have time, I will practise.", why:"No WILL in the IF clause."},
    {bad:"If I would be rich, I would travel.", good:"If I were rich, I would travel.", why:"2nd conditional uses IF + past (were)."},
    {bad:"It’s important be respectful.", good:"It’s important to be respectful.", why:"Add TO BE."},
    {bad:"I have been to Paris yesterday.", good:"I went to Paris yesterday.", why:"Yesterday → past simple."}
  ];

  // Reading + Grammar
  const readingTexts = [
    {
      id:"r1",
      text:"Last weekend, Myriam stayed in a small hotel near the sea. The room was clean, but it was noisy at night because the street was busy. The receptionist offered a quieter room for the second night. Myriam was happy because breakfast was included and the staff were friendly.",
      qs:[
        {q:"What was the room like?", answers:["clean"], hint:"Look for: The room was …"},
        {q:"Why was it noisy at night?", answers:["because the street was busy","the street was busy"], hint:"Look for the word 'because'."},
        {q:"What did the receptionist offer?", answers:["a quieter room","quieter room"], hint:"Look for: offered …"}
      ]
    },
    {
      id:"r2",
      text:"Sebastien loves boating. If he lived near the sea, he would buy a small house and go out on the water every weekend. For now, he travels to the coast when he has time. He says it’s important to be patient because dreams take time.",
      qs:[
        {q:"What would Sebastien buy if he lived near the sea?", answers:["a small house","small house"], hint:"Look for: he would buy …"},
        {q:"How often would he go out on the water?", answers:["every weekend","each weekend"], hint:"Look for: every …"},
        {q:"What does he do for now?", answers:["he travels to the coast","travel to the coast","travels to the coast"], hint:"Look for: For now, …"}
      ]
    },
    {
      id:"r3",
      text:"Before her retirement, Myriam used her personal training account to improve her English. She chose online lessons because they saved time and allowed her to practise speaking one‑to‑one. She feels she has made progress and she is happy with the training.",
      qs:[
        {q:"What did Myriam use to improve her English?", answers:["personal training account","training account"], hint:"Look for: used her … account"},
        {q:"Why did she choose online lessons?", answers:["they saved time","save time","because they saved time"], hint:"Look for: because they …"},
        {q:"How does she feel about the training?", answers:["happy","she is happy","she is happy with the training"], hint:"Look for: she is … with the training"}
      ]
    }
  ];

  const gramBank = [
    {q:"Choose the best sentence:", opts:["If I will have time, I will call you.","If I have time, I will call you.","If I would have time, I call you."], a:1, tip:"If + present, will + verb."},
    {q:"Choose the best sentence:", opts:["If I spoke English better, I will visit the USA.","If I spoke English better, I would visit the USA.","If I speak English better, I would visit the USA."], a:1, tip:"Dream: If + past, would + verb."},
    {q:"Choose the best sentence:", opts:["I went to London. I have been there.","I have been to London. I went there last year.","I have went to London last year."], a:1, tip:"Present perfect + past simple time marker."}
  ];

  // Speaking + Writing
  const spPrompts = [
    {id:"sp_hotel", label:"Hotel problem", prompt:"You are travelling. Describe a problem at a hotel and ask for a solution.", models:{
      A2:"Hello. My room is noisy. Could I change rooms, please? If possible, I would like a quiet room. Thank you.",
      B1:"Hello, my room is very noisy at night. Would it be possible to change rooms? If possible, I’d like a quiet room away from the street.",
      B2:"Hello, I’m calling because my room is very noisy at night. Would it be possible to move to a quieter room, ideally away from the street? Thank you for your help."
    }},
    {id:"sp_luggage", label:"Lost luggage", prompt:"Your luggage didn’t arrive. Explain the situation and ask what happens next.", models:{
      A2:"Hello. My luggage is lost. It was on flight 567. Can you help me, please? Can you send it to my hotel?",
      B1:"Hello, my luggage didn’t arrive from flight 567. Could you tell me what I should do next? Could it be delivered to my hotel?",
      B2:"Hello, my luggage did not arrive from flight 567. Could you explain the next steps and whether it can be delivered to my hotel as soon as possible?"
    }},
    {id:"sp_restaurant", label:"Restaurant complaint", prompt:"You are in a restaurant. Order politely, then complain politely about a problem.", models:{
      A2:"Could I have the chicken salad, please? Excuse me, my soup is cold. Could you warm it up, please?",
      B1:"Could I have the chicken salad, please? Excuse me, my soup is cold. Could you heat it up or change it, please?",
      B2:"Could I have the chicken salad, please? Excuse me, my soup is cold. Would it be possible to heat it up or replace it?"
    }},
    {id:"sp_directions", label:"Asking for directions", prompt:"Ask for directions to a place and repeat the instructions.", models:{
      A2:"Excuse me, where is the pharmacy? Go straight, then turn left. It’s next to the bank.",
      B1:"Excuse me, could you tell me where the pharmacy is? Go straight, then take the first left. It’s next to the bank.",
      B2:"Excuse me, could you tell me how to get to the pharmacy? Go straight ahead, take the first left, and it’ll be on your right."
    }},
    {id:"sp_opinion", label:"Opinion (online learning)", prompt:"Give your opinion: Is online learning better than face‑to‑face learning? Give 2 reasons.", models:{
      A2:"In my opinion, online learning is better for me. It saves time and I can learn at home. Overall, it is a good solution.",
      B1:"In my opinion, online learning is better for me because it saves time and is flexible. Also, one‑to‑one lessons help me speak more. Overall, I progress faster.",
      B2:"In my opinion, online learning can be more effective, especially for adults. It saves time and offers flexibility. In addition, one‑to‑one lessons give personalised feedback. However, face‑to‑face learning can be more social. Overall, it depends on the learner."
    }}
  ];

  const wrTasks = [{"id": "wr_email_info", "label": "Email: hotel information", "prompt": "Write an email to a hotel asking for availability, total price (taxes), and what is included. (8–12 lines)", "models": {"A2": "Subject: Request for information\n\nDear Reservations Team,\nI would like to book a double room from May 4 to May 6.\nCould you please confirm availability and the total price including taxes?\nIs breakfast included? Is Wi‑Fi included?\nPlease confirm by email.\nThank you in advance.\nKind regards,\nMyriam", "B1": "Subject: Request for information — reservation May 4–6\n\nDear Reservations Team,\nI’m writing to ask about availability for a double room from May 4 to May 6.\nCould you confirm the total price per night including taxes and any extra fees?\nCould you also tell me what is included in the rate (breakfast, Wi‑Fi, parking)?\nIf possible, I would like a quiet room.\nThank you in advance.\nKind regards,\nMyriam", "B2": "Subject: Request for information — reservation May 4–6\n\nDear Reservations Team,\nI’m writing to request details before confirming a reservation for a double room from May 4 to May 6.\nCould you please confirm availability and the total rate including taxes and any additional fees (e.g., city tax)?\nCould you also clarify what is included (breakfast, Wi‑Fi, and any other services)?\nIf possible, I’d appreciate a quiet room away from the street.\nMany thanks.\nSincerely,\nMyriam"}}, {"id": "wr_email_reschedule", "label": "Email: change dates", "prompt": "Write an email to change your reservation dates. Explain briefly and ask for confirmation.", "models": {"A2": "Subject: Change of reservation dates\n\nDear Reservations Team,\nI would like to change my reservation.\nI can’t come from May 4 to May 10.\nCould I change the dates to May 12 to May 14?\nPlease confirm by email.\nThank you.\nKind regards,\nMyriam", "B1": "Subject: Request to reschedule reservation\n\nDear Reservations Team,\nI’m writing to ask if it is possible to change my reservation dates.\nUnfortunately, we are unable to come from May 4 to May 10.\nWould it be possible to move the booking to May 12–14?\nPlease confirm by email.\nThank you in advance.\nKind regards,\nMyriam", "B2": "Subject: Request to reschedule reservation (May 4–10)\n\nDear Reservations Team,\nI’m writing regarding our reservation from May 4 to May 10. Unfortunately, we are no longer able to travel on those dates.\nWould it be possible to reschedule the booking to May 12–14 (two nights)?\nPlease let me know if there are any price differences or conditions.\nThank you for your assistance.\nSincerely,\nMyriam"}}, {"id": "wr_email_complaint", "label": "Email: complaint (noise)", "prompt": "Write an email complaining about a noisy room and one service issue. Ask for a solution/compensation.", "models": {"A2": "Subject: Noise complaint\n\nTo whom it may concern,\nI’m writing because our room was very noisy.\nWe couldn’t sleep because of the street noise.\nAlso, the fitness centre was not included.\nCould you help me, please?\nThank you.\nKind regards,\nMyriam", "B1": "Subject: Complaint — noisy room\n\nTo whom it may concern,\nI’m writing to complain about the noise in our room during our stay.\nWe were unable to sleep because the street was very noisy.\nIn addition, we were told the fitness centre was included, but it was not.\nCould you please propose a solution or compensation?\nThank you in advance.\nKind regards,\nMyriam", "B2": "Subject: Complaint — noisy room and service issue\n\nTo whom it may concern,\nI’m writing to raise a complaint regarding our stay. Unfortunately, our room was extremely noisy due to street traffic, and we were unable to sleep.\nIn addition, we were told the fitness centre was included in the rate, but it was not.\nCould you please review the situation and propose appropriate compensation?\nThank you for your assistance.\nSincerely,\nMyriam"}}, {"id": "wr_email_luggage", "label": "Email: lost luggage", "prompt": "Write an email to the airline about lost luggage. Include flight number/date and request delivery.", "models": {"A2": "Subject: Lost luggage\n\nTo whom it may concern,\nMy luggage was lost on flight 567 on May 4.\nCould you please tell me what to do?\nCan you send my luggage to my hotel?\nYou can contact me at 06 00 00 00 00.\nThank you.\nBest regards,\nMyriam", "B1": "Subject: Lost luggage — flight 567 (May 4)\n\nTo whom it may concern,\nI’m writing to report that my luggage did not arrive from flight 567 on May 4.\nCould you please confirm if it has been found and explain the next steps?\nIf possible, could it be delivered to my hotel as soon as possible?\nYou can reach me at 06 00 00 00 00.\nThank you in advance.\nKind regards,\nMyriam", "B2": "Subject: Lost luggage — flight 567 (May 4)\n\nTo whom it may concern,\nI’m writing to report missing luggage from flight 567 on May 4. The bag did not arrive at baggage claim.\nCould you please confirm whether it has been located and provide an estimated delivery time?\nIf possible, I would appreciate delivery to my hotel as soon as possible.\nI can be reached at 06 00 00 00 00.\nThank you for your assistance.\nSincerely,\nMyriam"}}, {"id": "wr_email_restaurant", "label": "Email: restaurant reservation", "prompt": "Write an email to reserve a table and ask about a special request (allergy / wheelchair / birthday).", "models": {"A2": "Subject: Table reservation\n\nHello,\nI would like to reserve a table for 2 people on Saturday at 7:30 pm.\nIs it possible to have a quiet table?\nI have a nut allergy.\nThank you.\nKind regards,\nMyriam", "B1": "Subject: Table reservation (Saturday)\n\nHello,\nI’m writing to book a table for two on Saturday at 7:30 pm.\nCould you please confirm availability?\nIf possible, I’d like a quiet table.\nAlso, I have a nut allergy.\nThank you in advance.\nKind regards,\nMyriam", "B2": "Subject: Table reservation request (Saturday 7:30 pm)\n\nHello,\nI’d like to reserve a table for two people on Saturday at 7:30 pm.\nCould you please confirm availability? If possible, we’d appreciate a quiet table.\nAdditionally, I have a nut allergy—could you please advise if suitable options are available?\nMany thanks.\nSincerely,\nMyriam"}}, {"id": "wr_email_refund", "label": "Email: refund / exchange", "prompt": "Write an email requesting a refund or exchange. Include date, item, and reason.", "models": {"A2": "Subject: Refund request\n\nHello,\nI bought a jacket yesterday, but it doesn’t fit.\nCan I exchange it or get a refund?\nI have the receipt.\nThank you.\nKind regards,\nMyriam", "B1": "Subject: Refund / exchange request\n\nHello,\nI’m writing about a jacket I bought yesterday.\nUnfortunately, it doesn’t fit me.\nCould you tell me if I can exchange it for a different size or get a refund?\nI can provide the receipt.\nThank you in advance.\nKind regards,\nMyriam", "B2": "Subject: Refund or exchange request\n\nHello,\nI’m writing regarding a jacket I purchased yesterday. Unfortunately, it does not fit.\nCould you please confirm whether an exchange for a different size is possible, or whether I can request a refund?\nI have the receipt and can provide any reference details.\nThank you for your assistance.\nSincerely,\nMyriam"}}, {"id": "wr_email_directions", "label": "Email: ask for directions", "prompt": "Write an email asking how to get to a hotel/venue from the airport or train station. Ask about transport options.", "models": {"A2": "Subject: How to get to your hotel\n\nHello,\nHow can I get to your hotel from the airport?\nIs there a bus or a taxi?\nHow long does it take?\nThank you.\nKind regards,\nMyriam", "B1": "Subject: Directions from the airport\n\nHello,\nI’m writing to ask how to get to your hotel from the airport.\nCould you tell me the best transport option (bus, train, taxi) and the approximate time?\nThank you in advance.\nKind regards,\nMyriam", "B2": "Subject: Directions and transport options\n\nHello,\nI’m writing to ask for directions from the airport to your hotel.\nCould you please recommend the best transport option (public transport or taxi) and provide an approximate travel time?\nIf you have any useful information (stops, schedules), I would appreciate it.\nMany thanks.\nSincerely,\nMyriam"}}, {"id": "wr_opinion", "label": "Mini opinion", "prompt": "Write 8–12 lines: Is online learning better than face‑to‑face learning? Give your opinion + 2 reasons + a conclusion.", "models": {"A2": "In my opinion, online learning is better for me. It saves time because I don’t travel. Also, I can learn at home and feel relaxed. I think I progress faster. Overall, online learning is a good solution.", "B1": "In my opinion, online learning is better for me because it saves time and is flexible. I don’t need to travel, and I can plan lessons easily. Also, I feel more comfortable speaking one‑to‑one. Overall, it helps me progress faster.", "B2": "In my opinion, online learning can be more effective than face‑to‑face learning, especially for adults. First, it saves time and offers flexibility, which makes it easier to stay consistent. In addition, one‑to‑one lessons allow personalised feedback and faster progress. However, face‑to‑face learning can be more social. Overall, the best choice depends on the learner, but online learning works very well for me."}}];

  // Teacher compare
  const stats = (txt) => {
    const t = (txt||'').trim();
    const ws = t ? t.split(/\s+/).filter(Boolean) : [];
    const ss = t ? t.split(/[.!?]+/).map(x=>x.trim()).filter(Boolean) : [];
    const uniq = new Set(ws.map(w=>w.toLowerCase().replace(/[^\w’-]/g,''))).size;
    const connectors = ["because","however","overall","for example","in addition","so that","first","then"];
    const connCount = connectors.reduce((acc,c)=> acc + (norm(t).includes(c) ? 1 : 0), 0);
    return {w:ws.length, s:ss.length, avg:ss.length ? (ws.length/ss.length) : 0, u:uniq, c:connCount};
  };
  const compare = () => {
    const a=stats($('#tStudent').value);
    const b=stats($('#tCorrected').value);
    const c=stats($('#tHigher').value);
    $('#tOut').textContent = [
      `Student: Words ${a.w} | Sentences ${a.s} | Avg ${a.avg.toFixed(1)} | Unique ${a.u} | Connectors ${a.c}`,
      `Corrected: Words ${b.w} | Sentences ${b.s} | Avg ${b.avg.toFixed(1)} | Unique ${b.u} | Connectors ${b.c}`,
      `Higher: Words ${c.w} | Sentences ${c.s} | Avg ${c.avg.toFixed(1)} | Unique ${c.u} | Connectors ${c.c}`,
      "",
      "Teacher focus:",
      "• Add 1 connector (however / in addition / overall)",
      "• Add 1 example (For example, …)",
      "• Check: If + past → would, and Past Simple vs Present Perfect"
    ].join("\n");
  };

  // Modal
  const overlay = () => $('#modalOverlay');
  const openV = (v) => {
    state.currentV=v;
    $('#mIcon').textContent=v.icon;
    $('#mEn').textContent=v.en;
    $('#mFr').textContent=v.fr;
    $('#mFr').style.display = state.showFR ? 'block':'none';
    $('#mDef').textContent = 'Definition: ' + v.def;
    $('#mEx').textContent = 'Example: ' + v.ex;
    overlay().hidden=false;
    $('#modalClose').focus();
  };
  const closeV = () => { overlay().hidden=true; state.currentV=null; };

  // Render tense chips
  const renderTenseChips = () => {
    const host=$('#tenseChips'); host.innerHTML='';
    tenseChips.forEach(x=>{
      const b=document.createElement('button'); b.type='button'; b.className='chip';
      b.textContent = `${x.t}: ${x.ex}`;
      b.onclick=()=>speak(x.ex);
      host.appendChild(b);
    });
  };

  // Vocab
  const fillVcats = () => { $('#vCat').innerHTML = vocabCats.map(c=>`<option value="${c}">${c}</option>`).join(''); $('#vCat').value='All'; };
  const vocabFiltered = () => {
    const cat = $('#vCat').value;
    const q = ($('#vSearch').value||'').trim().toLowerCase();
    return vocab.filter(v=>cat==='All'||v.cat===cat).filter(v=>!q || v.en.toLowerCase().includes(q) || v.fr.toLowerCase().includes(q) || v.def.toLowerCase().includes(q));
  };
  const renderVocab = () => {
    const grid=$('#vGrid'); grid.innerHTML='';
    vocabFiltered().forEach(v=>{
      const card=document.createElement('button'); card.type='button'; card.className='vCard';
      card.innerHTML = `<div class="vTop"><div class="vIcon">${v.icon}</div><div><div class="vEn">${v.en}</div><div class="vFr" style="display:${state.showFR?'block':'none'}">${v.fr}</div></div><div class="vCat"><div class="vTag">${v.cat}</div></div></div><div class="tiny muted">${v.def}</div>`;
      card.onclick=()=>openV(v);
      grid.appendChild(card);
    });
  };

  // Situations
  const fillSituations = () => { $('#sitSel').innerHTML = situations.map(s=>`<option value="${s.id}">${s.label}</option>`).join(''); $('#sitSel').value=situations[0].id; renderSituation(); };
  const curSit = () => situations.find(s=>s.id===$('#sitSel').value) || situations[0];
  const renderSituation = () => { $('#sitPrompt').textContent = curSit().prompt; $('#sitModel').textContent='—'; };
  const showSituationModel = () => { $('#sitModel').textContent = curSit().models[state.level]; };

  // MCQ
  const renderMCQ = () => {
    state.mcq = shuffle(mcqBank)[0];
    state.mcqChoice=null;
    $('#mcqQ').textContent = state.mcq.q;
    $('#mcqFb').textContent='';
    const host=$('#mcqOpts'); host.innerHTML='';
    shuffle(state.mcq.opts).forEach(opt=>{
      const b=document.createElement('button'); b.type='button'; b.className='pill'; b.textContent=opt;
      b.onclick=()=>{ state.mcqChoice=opt; $$('#mcqOpts .pill').forEach(x=>x.classList.remove('on')); b.classList.add('on'); };
      host.appendChild(b);
    });
  };
  const checkMCQ = () => {
    if(!state.mcqChoice){ $('#mcqFb').textContent='Choose an option first.'; return; }
    const ok = state.mcqChoice===state.mcq.a;
    addScore(ok);
    $('#mcqFb').textContent = ok ? '✅ Correct!' : `❌ Answer: ${state.mcq.a}\nTip: ${state.mcq.tip}`;
  };

  // Fix
  const renderFix = () => {
    state.fix = shuffle(fixBank)[0];
    $('#fixQ').textContent = 'Fix this sentence:\n' + state.fix.bad;
    $('#fixBox').value='';
    $('#fixFb').textContent='';
  };
  const checkFix = () => {
    const user = norm($('#fixBox').value);
    if(!user){ $('#fixFb').textContent='Write your corrected sentence first.'; return; }
    const ok = user===norm(state.fix.good);
    addScore(ok);
    $('#fixFb').textContent = ok ? '✅ Perfect!' : `❌ Correct: ${state.fix.good}\nWhy: ${state.fix.why}`;
  };

  // Conditionals prompt
  const newCondPrompt = () => {
    state.currentCond = shuffle(condPrompts)[0];
    $('#condPrompt').textContent = state.currentCond.q + "\nModel: " + state.currentCond.a;
  };

  // Reading
  const renderReading = () => {
    state.currentRead = shuffle(readingTexts)[0];
    $('#readText').textContent = state.currentRead.text;
    $('#readFb').textContent='';
    const host=$('#readQs'); host.innerHTML='';
    state.currentRead.qs.forEach((x,i)=>{
      const row=document.createElement('div');
      row.className='mt10';
      row.innerHTML = `
        <div class="row" style="justify-content:space-between">
          <div class="tiny muted">${i+1}) ${x.q}</div>
          <div class="row">
            <span class="pill mono markPill" id="readMark-${i}">—</span>
            <button class="pill ghost" type="button" data-hint="${i}">Hint</button>
          </div>
        </div>
        <input class="input mt6" data-r="${i}" placeholder="Your answer…">
        <div class="tiny muted mt6" id="hint-${i}" style="display:none"></div>
      `;
      host.appendChild(row);
    });

    host.querySelectorAll('button[data-hint]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const i=parseInt(btn.getAttribute('data-hint'),10);
        const hintEl = $('#hint-'+i);
        const hint = state.currentRead.qs[i].hint || "Look for key words in the text.";
        hintEl.textContent = "💡 " + hint;
        hintEl.style.display = (hintEl.style.display === 'none') ? 'block' : 'none';
      });
    });
  };

  const checkReading = () => () => {
    const inputs = $$('#readQs input');
    let ok=0;
    inputs.forEach(inp=>{
      const i=parseInt(inp.dataset.r,10);
      const ans = norm(inp.value);
      const target = norm(state.currentRead.qs[i].a);
      const good = ans && (ans===target || ans.includes(target) || target.includes(ans));
      inp.style.borderColor = good ? 'rgba(120,255,170,.55)' : 'rgba(255,120,120,.55)';
      if(good) ok++;
    });
    addScore(ok===inputs.length);
    $('#readFb').textContent = `Result: ${ok}/${inputs.length}.`;
  };

  // Grammar
  const renderGram = () => {
    state.currentGram = shuffle(gramBank)[0];
    state.gramChoice=null;
    $('#gramQ').textContent = state.currentGram.q;
    $('#gramFb').textContent='';
    const host=$('#gramOpts'); host.innerHTML='';
    state.currentGram.opts.forEach((opt,idx)=>{
      const b=document.createElement('button'); b.type='button'; b.className='pill'; b.textContent=opt;
      b.onclick=()=>{ state.gramChoice=idx; $$('#gramOpts .pill').forEach(x=>x.classList.remove('on')); b.classList.add('on'); };
      host.appendChild(b);
    });
  };
  const checkGram = () => {
    if(state.gramChoice===null){ $('#gramFb').textContent='Choose an option first.'; return; }
    const ok = state.gramChoice===state.currentGram.a;
    addScore(ok);
    $('#gramFb').textContent = ok ? '✅ Correct!' : `❌ Correct option: ${state.currentGram.a+1}\nTip: ${state.currentGram.tip}`;
  };

  // Speaking
  const fillSpeaking = () => { $('#spSel').innerHTML = spPrompts.map(p=>`<option value="${p.id}">${p.label}</option>`).join(''); $('#spSel').value=spPrompts[0].id; renderSp(); };
  const curSp = () => spPrompts.find(p=>p.id===$('#spSel').value) || spPrompts[0];
  const renderSp = () => { $('#spPrompt').textContent = curSp().prompt; $('#spModel').textContent='—'; $('#spNotes').value=''; };
  const showSpModel = () => { $('#spModel').textContent = curSp().models[state.level]; };

  // Writing
  const fillWriting = () => { $('#wrSel').innerHTML = wrTasks.map(t=>`<option value="${t.id}">${t.label}</option>`).join(''); $('#wrSel').value=wrTasks[0].id; renderWr(); };
  const curWr = () => wrTasks.find(t=>t.id===$('#wrSel').value) || wrTasks[0];
  const renderWr = () => { $('#wrPrompt').textContent = curWr().prompt; $('#wrModel').textContent='—'; $('#wrBox').value=''; $('#wrWords').textContent='0'; };
  const showWrModel = () => { $('#wrModel').textContent = curWr().models[state.level]; };

  const newSet = () => {
    renderMCQ();
    renderFix();
    newCondPrompt();
    renderReading();
    renderGram();
    renderSp();
    renderWr();
    renderSituation();
  };

  const resetAll = () => {
    stopTimer('exam',$('#examClock'));
    stopTimer('sp',$('#spClock'));
    stopTimer('wr',$('#wrClock'));
    $('#spNotes').value='';
    $('#wrBox').value='';
    $('#wrWords').textContent='0';
    $('#tStudent').value=''; $('#tCorrected').value=''; $('#tHigher').value=''; $('#tOut').textContent='';
    $('#sitModel').textContent='—';
    $('#spModel').textContent='—';
    $('#wrModel').textContent='—';
    resetScore();
    newSet();
  };

  
  // Lesson links rendering
  const fillLinkFilters = () => {
    const typeSel = $('#linkType'); if(!typeSel) return;
    typeSel.innerHTML = linkTypes.map(t=>`<option value="${t}">${t}</option>`).join('');
    typeSel.value = 'All';

    const tagSel = $('#linkTag');
    tagSel.innerHTML = linkTags.map(t=>`<option value="${t}">${t}</option>`).join('');
    tagSel.value = 'All';
  };

  const matchLink = (item, type, tag, q) => {
    const text = (item.title + " " + item.url + " " + (item.tags||[]).join(" ")).toLowerCase();
    if(type !== 'All' && item.type !== type) return false;
    if(tag !== 'All' && !(item.tags||[]).some(t => t.toLowerCase() === tag.toLowerCase())) return false;
    if(q && !text.includes(q)) return false;
    return true;
  };

  const renderLinks = () => {
    const list = $('#linkList'); if(!list) return;
    const type = $('#linkType').value;
    const tag  = $('#linkTag').value;
    const q    = ($('#linkSearch').value || '').trim().toLowerCase();

    const filtered = lessonLinks.filter(it => matchLink(it, type, tag, q));
    $('#linkCount').textContent = `${filtered.length} link(s)`;

    list.innerHTML = '';
    filtered.forEach((it, idx) => {
      const div = document.createElement('div');
      div.className = 'linkItem';
      const tags = (it.tags||[]).slice(0,8);
      div.innerHTML = `
        <div class="linkLeft">
          <div class="linkTitle">${idx+1}. ${escapeHtml(it.title)}</div>
          <div class="linkMeta">${escapeHtml(it.type)}</div>
          <div class="linkBadges">${tags.map(t=>`<span class="badge">${escapeHtml(t)}</span>`).join('')}</div>
          <div class="linkUrl">${escapeHtml(it.url)}</div>
        </div>
        <div class="linkActions">
          <a class="pill" href="${it.url}" target="_blank" rel="noopener">Open</a>
          <button class="pill ghost" type="button" data-copy="${idx}">Copy</button>
        </div>
      `;
      list.appendChild(div);
    });

    list.querySelectorAll('button[data-copy]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const i = parseInt(btn.getAttribute('data-copy'), 10);
        const u = (filtered[i] && filtered[i].url) ? filtered[i].url : '';
        try{ await navigator.clipboard.writeText(u); btn.textContent='Copied ✓'; setTimeout(()=>btn.textContent='Copy', 900);}catch(e){}
      });
    });
  };

  // tiny HTML escape (links list only)
  const escapeHtml = (s) => {
    const str = String(s || '');
    return str
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }

  // Email bank (extra)
  const emailBank = [
    {id:"eb_hotel_info", label:"Hotel: request information", prompt:"Write to a hotel: availability + price incl. taxes + what is included + quiet room request.", models: (function(){ var t = wrTasks.find(function(x){return x.id==="wr_email_info";}); return t ? t.models : {A2:"—",B1:"—",B2:"—"}; })()},
    {id:"eb_change_dates", label:"Hotel: change dates", prompt:"Write to change your reservation dates and ask for confirmation.", models: (function(){ var t = wrTasks.find(function(x){return x.id==="wr_email_reschedule";}); return t ? t.models : {A2:"—",B1:"—",B2:"—"}; })()},
    {id:"eb_complaint", label:"Hotel: complaint", prompt:"Write a complaint (noise + one service issue) and ask for compensation.", models: (function(){ var t = wrTasks.find(function(x){return x.id==="wr_email_complaint";}); return t ? t.models : {A2:"—",B1:"—",B2:"—"}; })()},
    {id:"eb_luggage", label:"Airline: lost luggage", prompt:"Write to the airline: flight number/date + request delivery to hotel.", models: (function(){ var t = wrTasks.find(function(x){return x.id==="wr_email_luggage";}); return t ? t.models : {A2:"—",B1:"—",B2:"—"}; })()},
    {id:"eb_restaurant", label:"Restaurant: reservation", prompt:"Write to reserve a table and add a special request (allergy).", models: (function(){ var t = wrTasks.find(function(x){return x.id==="wr_email_restaurant";}); return t ? t.models : {A2:"—",B1:"—",B2:"—"}; })()},
    {id:"eb_refund", label:"Shop: refund / exchange", prompt:"Write to request a refund or exchange. Mention receipt.", models: (function(){ var t = wrTasks.find(function(x){return x.id==="wr_email_refund";}); return t ? t.models : {A2:"—",B1:"—",B2:"—"}; })()}
  ];

  const fillEmailBank = () => {
    const sel = $('#ebSel'); if(!sel) return;
    sel.innerHTML = emailBank.map(e=>`<option value="${e.id}">${e.label}</option>`).join('');
    sel.value = emailBank[0].id;
    renderEmailBank();
  };

  const currentEmailBank = () => emailBank.find(e=>e.id === $('#ebSel').value) || emailBank[0];

  const renderEmailBank = () => {
    const cur = currentEmailBank();
    $('#ebPrompt').textContent = cur.prompt;
    $('#ebModel').textContent = '—';
  };

  const showEmailBankModel = () => {
    const cur = currentEmailBank();
    $('#ebModel').textContent = cur.models[state.level];
  };

const init = () => {
    $('#jsOk').textContent='JS: ready ✅';
    updateScore();
    loadVoices();
    if('speechSynthesis' in window) speechSynthesis.onvoiceschanged = loadVoices;

    $('#tenseMap').textContent = tenseMap;
    $('#condMap').textContent = condMap;
    renderTenseChips();

    // Controls
    $$('.segBtn[data-level]').forEach(b=>b.onclick=()=>setLevel(b.dataset.level));
    $$('.segBtn[data-accent]').forEach(b=>b.onclick=()=>setAccent(b.dataset.accent));
    $('#rate').oninput=(e)=>tts.rate=parseFloat(e.target.value||'1');
    $('#frToggle').onclick=()=>setFR(!state.showFR);
    $('#printBtn').onclick=()=>window.print();
    $('#newSetBtn').onclick=newSet;
    $('#resetAllBtn').onclick=resetAll;
    $('#resetScore').onclick=resetScore;

    // Exam clock
    $('#examStartBtn').onclick=()=>startTimer('exam',45*60,$('#examClock'));
    $('#examStopBtn').onclick=()=>stopTimer('exam',$('#examClock'));

    // Diagnostic
    renderMCQ();
    $('#mcqCheck').onclick=checkMCQ;
    $('#mcqNext').onclick=renderMCQ;
    $('#mcqSay').onclick=()=>speak($('#mcqQ').textContent);

    renderFix();
    $('#fixCheck').onclick=checkFix;
    $('#fixShow').onclick=()=>$('#fixFb').textContent=`Answer: ${state.fix.good}\nWhy: ${state.fix.why}`;
    $('#fixNext').onclick=renderFix;

    // Conditionals
    newCondPrompt();
    $('#condQuizBtn').onclick=newCondPrompt;
    $('#condSayBtn').onclick=()=>speak($('#condPrompt').textContent);

    // Situations
    fillSituations();
    $('#sitSel').onchange=renderSituation;
    $('#sitModelBtn').onclick=showSituationModel;
    $('#sitSayBtn').onclick=()=>speak($('#sitPrompt').textContent + ' ' + ($('#sitModel').textContent==='—'?'':$('#sitModel').textContent));

    // Vocab
    fillVcats();
    renderVocab();
    $('#vCat').onchange=renderVocab;
    $('#vSearch').oninput=renderVocab;
    $('#vReset').onclick=()=>{ $('#vCat').value='All'; $('#vSearch').value=''; renderVocab(); };

    // Modal
    const overlayEl = overlay();
    $('#modalClose').onclick=closeV;
    overlayEl.onclick=(e)=>{ if(e.target.id==='modalOverlay') closeV(); };
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape' && !overlayEl.hidden) closeV(); });
    $('#mSay').onclick=()=>{ if(state.currentV) speak(state.currentV.en); };
    $('#mAdd').onclick=()=>{ if(!state.currentV) return; const ta=$('#wrBox'); ta.value += (ta.value?'\n':'') + state.currentV.en; $('#wrWords').textContent=String(wordCount(ta.value)); };

    // Reading + grammar
    renderReading();
    $('#readCheck').onclick=checkReading;
    $('#readNew').onclick=renderReading;

    renderGram();
    $('#gramCheck').onclick=checkGram;
    $('#gramNew').onclick=renderGram;

    // Speaking
    fillSpeaking();
    $('#spSel').onchange=renderSp;
    $('#sp60').onclick=()=>startTimer('sp',60,$('#spClock'));
    $('#sp90').onclick=()=>startTimer('sp',90,$('#spClock'));
    $('#spStop').onclick=()=>stopTimer('sp',$('#spClock'));
    $('#spSay').onclick=()=>speak($('#spPrompt').textContent);
    $('#spModelBtn').onclick=showSpModel;
    $('#spModelSay').onclick=()=>speak($('#spModel').textContent);

    // Writing
    fillWriting();
    $('#wrSel').onchange=renderWr;
    $('#wr15').onclick=()=>startTimer('wr',15*60,$('#wrClock'));
    $('#wrStop').onclick=()=>stopTimer('wr',$('#wrClock'));
    $('#wrBox').oninput=()=>$('#wrWords').textContent=String(wordCount($('#wrBox').value));
    $('#wrSay').onclick=()=>speak($('#wrBox').value);
    $('#wrModelBtn').onclick=showWrModel;
    $('#wrCopyBtn').onclick=async()=>{ try{ await navigator.clipboard.writeText($('#wrBox').value);}catch(e){} };
    $('#wrClearBtn').onclick=()=>{ $('#wrBox').value=''; $('#wrWords').textContent='0'; $('#wrModel').textContent='—'; };

    // Teacher compare
    $('#tCompare').onclick=compare;
    $('#tClear').onclick=()=>{ $('#tStudent').value=''; $('#tCorrected').value=''; $('#tHigher').value=''; $('#tOut').textContent=''; };

    
    // Lesson links
    fillLinkFilters();
    renderLinks();
    if($('#linkType')) $('#linkType').addEventListener('change', renderLinks);
    if($('#linkTag')) $('#linkTag').addEventListener('change', renderLinks);
    if($('#linkSearch')) $('#linkSearch').addEventListener('input', renderLinks);
    if($('#linkReset')) $('#linkReset').addEventListener('click', () => {
      $('#linkType').value='All';
      $('#linkTag').value='All';
      $('#linkSearch').value='';
      renderLinks();
    });

fillEmailBank();
    if($('#ebSel')) $('#ebSel').addEventListener('change', renderEmailBank);
    if($('#ebModelBtn')) $('#ebModelBtn').addEventListener('click', showEmailBankModel);
    if($('#ebCopyBtn')) $('#ebCopyBtn').addEventListener('click', async () => { try{ await navigator.clipboard.writeText($('#ebModel').textContent==='—'?'':$('#ebModel').textContent);}catch(e){} });
    if($('#ebSayBtn')) $('#ebSayBtn').addEventListener('click', () => speak($('#ebModel').textContent==='—'?$('#ebPrompt').textContent:$('#ebModel').textContent));

    // Defaults
    setLevel('A2');
    setFR(true);
    setAccent('US');
  };

  window.addEventListener('error',(e)=>{
    const box=$('#errBox');
    if(box){ box.hidden=false; box.textContent='⚠️ ' + (e && e.message ? e.message : 'Error'); }
  });

  document.addEventListener('DOMContentLoaded', init);
})();