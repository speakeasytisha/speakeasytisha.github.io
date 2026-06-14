
(() => {
  'use strict';
  window.__E360Loaded = true;

  const $ = (s, r) => (r||document).querySelector(s);
  const $$ = (s, r) => Array.from((r||document).querySelectorAll(s));
  const pad2 = n => (n<10?'0'+n:''+n);
  const fmt = s => pad2(Math.floor(s/60))+':'+pad2(s%60);

  const state = {
    mode: 'practice',
    teacher: false,
    level: 'A2',
    accent: 'US',
    rate: 1,
    timer: null,
    promptVisible: false,
    current: null,
  };

  const scenarios = [{"id": "rev_selfintro", "tag": "Review", "title": "Introduce yourself (retired / where you live / past job)", "prompt": "You are speaking to an examiner. Introduce yourself: who you are, where you live, what you did before retiring, and one personal detail.", "plan": ["Greeting", "Name + age", "Where you live", "Past job", "Personal detail", "Close"], "models": {"A2": "Hello. My name is Myriam. I am retired. I live in a small village near Strasbourg. Before retiring, I worked in technical support. In my free time, I enjoy walking and cooking. Thank you.", "B1": "Hello. My name is Myriam and I’m retired. I live in a small village near Strasbourg. Before retiring, I worked in technical support, helping users solve computer problems. In my free time, I enjoy walking and spending time with my family. Thank you.", "B2": "Hello. My name is Myriam and I’ve been retired for a few years. I live in a quiet village near Strasbourg. Before retiring, I worked in technical support, which required patience and clear communication. Nowadays, I enjoy walking in nature, travelling, and spending time with my family. Thank you."}}, {"id": "rev_hobbies", "tag": "Review", "title": "Talk about a hobby + compare two activities", "prompt": "Tell me about a hobby you enjoy. Explain why you like it, give an example, compare it with another activity, and finish with your opinion.", "plan": ["Topic", "Reason", "Example", "Comparison", "Conclusion"], "models": {"A2": "When I have free time, I enjoy walking because it helps me relax. For example, I walk in the countryside on Sundays. Compared to cooking, walking is easier. Overall, it makes me happy.", "B1": "When I have free time, I enjoy walking because it helps me stay fit and clear my mind. For example, I like walking in the forest and enjoying the scenery. Compared to cooking, walking is easier and more relaxing because it does not require much preparation. Overall, it helps me feel balanced.", "B2": "When I have free time, I especially enjoy walking because it helps me stay fit and clear my mind. For example, I like walking in the forest, enjoying the scenery, and looking for places where I might find mushrooms or blueberries. Compared to cooking, walking is more spontaneous and relaxing because it doesn’t require much preparation. However, I also enjoy creative activities, as they let me use my imagination. Overall, my hobbies keep me active, creative, and connected to simple pleasures."}}, {"id": "rev_online_learning", "tag": "Review", "title": "Opinion: online vs face-to-face learning", "prompt": "Is online learning better than face-to-face learning? Give your opinion, 2 reasons, and a short conclusion.", "plan": ["Opinion", "Reason 1", "Reason 2", "However", "Conclusion"], "models": {"A2": "In my opinion, online learning is better for me. It saves time because I don’t travel. Also, I feel comfortable at home. Overall, I think I learn faster online.", "B1": "In my opinion, online learning is better for me because it saves time and is flexible. I can learn from home and practise more often. However, face-to-face classes can be more social. Overall, online learning works best for me.", "B2": "In my opinion, online learning can be more effective, especially for adults. First, it saves time and offers flexibility, which helps you stay consistent. In addition, one-to-one lessons provide personalised feedback. However, face-to-face learning can be more social and motivating. Overall, the best choice depends on the learner, but online learning works very well for me."}}, {"id": "rev_hotel_complaint", "tag": "Review", "title": "Hotel: noisy room complaint (polite)", "prompt": "You are staying in a hotel. Your room is noisy. Explain the problem and ask for a solution politely.", "plan": ["Greeting", "Problem", "Request", "Preference", "Thank you"], "models": {"A2": "Hello. My room is noisy. I can’t sleep. Could I change rooms, please? If possible, I would like a quiet room. Thank you.", "B1": "Hello, my room is very noisy at night because of the street. Would it be possible to change rooms? If possible, I’d like a quieter room away from the street. Thank you.", "B2": "Hello, I’m calling because my room is extremely noisy at night due to street traffic. Would it be possible to move to a quieter room, ideally away from the street and the elevator? Thank you for your help."}}, {"id": "new_train_cancel", "tag": "New", "title": "Train cancelled: ask for options + refund", "prompt": "Your train is cancelled. Speak to staff: explain your situation, ask for the next options, and ask about a refund or exchange.", "plan": ["Excuse me", "Explain cancellation", "Ask options", "Ask refund/exchange", "Close"], "models": {"A2": "Excuse me. My train is cancelled. What can I do? Is there another train today? Can I have a refund, please?", "B1": "Excuse me, my train was cancelled. Could you tell me what my options are? Is there another train later today? Also, could you explain the refund or exchange policy, please?", "B2": "Excuse me, I’ve just been informed that my train has been cancelled. Could you please tell me what my options are—another train, a different route, or an exchange? And could you also explain whether I’m entitled to a refund?"}}, {"id": "new_pharmacy", "tag": "New", "title": "Pharmacy: ask for advice (cold / allergy)", "prompt": "You are in a pharmacy. You have a cold and a mild allergy. Ask for advice and ask how to take the medicine.", "plan": ["Greeting", "Symptoms", "Allergy", "Ask advice", "How to take it", "Close"], "models": {"A2": "Hello. I have a cold. I have a headache and a sore throat. I am allergic to peanuts. What do you recommend? How many times a day should I take it?", "B1": "Hello, I have a cold with a sore throat and a headache. I also have a mild allergy, so I need something safe. Could you recommend something and tell me how to take it, please?", "B2": "Hello, I think I’m coming down with a cold—sore throat, headache, and a blocked nose. I also have an allergy, so I need to be careful. Could you recommend something suitable and explain the dosage and any precautions?"}}, {"id": "new_tourist_office", "tag": "New", "title": "Tourist office: ask for recommendations + prices", "prompt": "You are visiting a city. Ask at a tourist office for 2 recommendations, opening hours, and ticket prices.", "plan": ["Greeting", "Ask recommendations", "Ask hours", "Ask prices", "Close"], "models": {"A2": "Hello. I am visiting the city. What are two good places to visit? What time does it open? How much is a ticket? Thank you.", "B1": "Hello. I’m visiting the city for two days. Could you recommend two places to visit? Could you also tell me the opening hours and ticket prices, please?", "B2": "Hello, I’m visiting the city for a short stay. Could you recommend two must-see places? I’d also like to know the opening hours and ticket prices, and whether I need to book in advance."}}, {"id": "new_lost_property", "tag": "New", "title": "Lost property: left phone in taxi", "prompt": "You left your phone in a taxi. Call the company and explain what happened. Ask what to do next.", "plan": ["Greeting", "Explain loss", "Describe taxi/time", "Request help", "Contact details", "Close"], "models": {"A2": "Hello. I lost my phone in a taxi. It was today at 3 pm. The taxi was black. Can you help me, please? What should I do?", "B1": "Hello, I think I left my phone in a taxi today around 3 pm. Could you help me locate it? I can describe the taxi and the route. What are the next steps, please?", "B2": "Hello, I’m calling because I believe I left my phone in one of your taxis today around 3 pm. Could you help me check whether it has been found? I can provide the pick-up and drop-off locations and any details you need."}}, {"id": "new_restaurant_issue", "tag": "New", "title": "Restaurant: allergy + wrong dish", "prompt": "At a restaurant, your dish contains nuts (you are allergic). Explain and ask for a replacement politely.", "plan": ["Excuse me", "Explain allergy", "Problem", "Request replacement", "Thank you"], "models": {"A2": "Excuse me. I am allergic to nuts. This dish has nuts. Could you change it, please? Thank you.", "B1": "Excuse me, I have a nut allergy and I think this dish contains nuts. Could you please replace it with something without nuts? Thank you.", "B2": "Excuse me, I have a nut allergy and I’m concerned that this dish contains nuts. Would it be possible to replace it with a nut-free option? Thank you for your help."}}, {"id": "new_check_in_problem", "tag": "New", "title": "Airport: boarding pass / check-in problem", "prompt": "At the airport, your boarding pass doesn’t work. Explain the problem and ask for help.", "plan": ["Greeting", "Explain problem", "Ask help", "Provide details", "Close"], "models": {"A2": "Hello. My boarding pass doesn’t work. The machine says error. Can you help me, please?", "B1": "Hello, my boarding pass isn’t scanning at the gate. Could you help me, please? My flight is to Tenerife and boarding is soon.", "B2": "Hello, my boarding pass isn’t scanning at the gate and I’m not sure why. Could you please check my booking and reissue the pass if needed? Boarding is starting soon."}}, {"id": "rev_shopping_exchange", "tag": "Review", "title": "Shopping: exchange / refund (with receipt)", "prompt": "You bought a jacket but it doesn’t fit. Speak to the assistant: explain and ask for an exchange or refund.", "plan": ["Greeting", "Explain problem", "Request exchange/refund", "Ask conditions", "Close"], "models": {"A2": "Hello. This jacket doesn’t fit. Can I exchange it, please? I have the receipt. Thank you.", "B1": "Hello, I bought this jacket but it doesn’t fit. Could I exchange it for another size, please? I have the receipt. What is your policy?", "B2": "Hello, I bought this jacket yesterday but it doesn’t fit. Would it be possible to exchange it for another size? I have the receipt. Could you confirm your exchange and refund policy, please?"}}, {"id": "rev_directions", "tag": "Review", "title": "Directions: ask how to get to a place", "prompt": "You are in a city. Ask someone how to get to the train station. Ask about the best way and how long it takes.", "plan": ["Excuse me", "Ask direction", "Ask best way", "Ask time", "Thank you"], "models": {"A2": "Excuse me, how can I go to the train station? Is it far? How long does it take? Thank you.", "B1": "Excuse me, could you tell me how to get to the train station, please? What is the best way? About how long does it take?", "B2": "Excuse me, could you tell me the best way to get to the train station, please? Is it walkable, or should I take a bus? How long does it usually take?"}}, {"id": "rev_car_rental", "tag": "Review", "title": "Car rental: pick-up + ask about insurance", "prompt": "You are picking up a rental car. Ask about insurance, fuel policy, and what to do if there is a problem.", "plan": ["Greeting", "Confirm booking", "Ask insurance", "Ask fuel policy", "Ask what if problem", "Close"], "models": {"A2": "Hello. I have a reservation for a car. Is insurance included? What is the fuel policy? What do I do if there is a problem? Thank you.", "B1": "Hello, I’m here to pick up my rental car. Could you tell me if insurance is included? What is the fuel policy? And what should I do if I have a problem on the road?", "B2": "Hello, I’m here to pick up my rental car. Could you confirm what insurance is included and explain the fuel policy? Also, if I have a breakdown or an issue, what is the procedure and who should I contact?"}}, {"id": "rev_reservation_call", "tag": "Review", "title": "Phone call: confirm a reservation + ask specifications", "prompt": "Call a hotel to confirm your reservation and ask what is included and if you can have a quiet room.", "plan": ["Greeting", "Confirm reservation", "Ask what is included", "Request quiet room", "Close"], "models": {"A2": "Hello. I would like to confirm my reservation. Is breakfast included? Can I have a quiet room, please? Thank you.", "B1": "Hello, I’m calling to confirm my reservation. Could you confirm what is included in the rate, such as breakfast and Wi‑Fi? If possible, I would like a quiet room. Thank you.", "B2": "Hello, I’m calling to confirm my reservation. Could you please confirm what is included in the rate and whether there are any additional fees? Also, if possible, I’d appreciate a quiet room away from the street. Thank you."}}];

  const production = [{"id": "prod_story", "tag": "New", "title": "Tell a travel story (problem → solution → ending)", "prompt": "Tell a short travel story: something went wrong, what you did, and how it ended.", "plan": ["Context (where/when)", "Problem", "Action", "Result", "Feeling/lesson"], "models": {"A2": "Last year, I travelled with my husband. We missed the train because we arrived late. We asked staff for help and took the next train. In the end, everything was fine and we were relieved.", "B1": "Last year, my husband and I were travelling and we missed our train because the station was very busy. We spoke to staff, exchanged our tickets, and took the next train. We arrived later, but we stayed calm and solved the problem.", "B2": "Last year, my husband and I were travelling when we missed our train due to a platform change. We asked the staff for alternatives, exchanged our tickets, and took a later train via another city. Although we arrived late, we managed the situation calmly, and it reminded me that staying organised makes travel much easier."}}, {"id": "prod_values", "tag": "Review", "title": "Talk about important values (family, children)", "prompt": "Talk for one minute: the values that are important to you and what you tried to pass on to your children.", "plan": ["Value 1 + example", "Value 2 + example", "How you pass it on", "Conclusion"], "models": {"A2": "It is important to be kind and respectful. I try to help my family and be patient. I also want my children to be honest. Overall, these values are very important for me.", "B1": "For me, important values are respect, honesty, and hard work. I tried to show my children these values by being a good example and supporting them. Overall, I think values help a family stay strong.", "B2": "For me, respect, honesty, and responsibility are essential values. I tried to pass them on to my children by setting a good example and encouraging them to be independent and considerate. Overall, I believe values shape who we are and how we treat others."}}];
  const all = scenarios.concat(production.map(x => ({...x, isProduction:true})));

  const reviewLinks = [{"title": "- Lire : Comprend des textes narratifs simples ou des informations pratiques comme des con", "url": "https://speakeasytisha.github.io/movies-lesson", "cat": "Culture & discussion"}, {"title": "- Prendre part à une conversation : Discute de manière simple sur des sujets d’intérêt per", "url": "https://speakeasytisha.github.io/newsflash_v2.html", "cat": "Culture & discussion"}, {"title": "- S'exprimer oralement en continu : Raconte des événements passés en liant des phrases cla", "url": "https://speakeasytisha.github.io/newsflash-pro-v2", "cat": "Culture & discussion"}, {"title": "thèmes familiers.\" Learn how to talk about TV series: genres, characters, episodes, plot t", "url": "https://speakeasytisha.github.io/tv-series-lesson", "cat": "Culture & discussion"}, {"title": "🏁 Final: write + speak your review", "url": "https://speakeasytisha.github.io/entertainment-final-wrapup", "cat": "Culture & discussion"}, {"title": ", Practice exam (midterm simulation), Part 3 • Speaking, Email bank (extra practice), Real", "url": "https://speakeasytisha.github.io/english360-myriam-midterm-review-v5.html", "cat": "Exam prep hubs"}, {"title": "ENGLISH 360°", "url": "https://speakeasytisha.github.io/english360-travel-exam-success-hub.html", "cat": "Exam prep hubs"}, {"title": "English 360° Realistic Mock Exam v3", "url": "https://speakeasytisha.github.io/english360-myriam-realistic-mock-exam-v3.html", "cat": "Exam simulation"}, {"title": "\"", "url": "https://speakeasytisha.github.io/english360-myriam-hopes-dreams-conditionals-v2.html", "cat": "Other"}, {"title": ", Practice exam (midterm simulation), Part 3 • Speaking, Email bank (extra practice), Real", "url": "https://speakeasytisha.github.io/english360-myriam-conditional-choice-values-addon.html", "cat": "Other"}, {"title": "- Esst capable de rédiger des textes courts plus structurés (e-mails, petites histoires, d", "url": "https://docs.google.com/document/d/16a6cDhldMUKpUv_BOtFxP-0FuILcUGoq/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "cat": "Other"}, {"title": "- Esst capable de rédiger des textes courts plus structurés (e-mails, petites histoires, d", "url": "https://docs.google.com/presentation/d/13tP9l0g9zVtSIVnK01Qx_15mN5F7CNGG/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "cat": "Other"}, {"title": "- Esst capable de rédiger des textes courts plus structurés (e-mails, petites histoires, d", "url": "https://docs.google.com/presentation/d/18hMNoUH6WlcjSPmIINsRq1kxbub_6L3I/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "cat": "Other"}, {"title": "- Lire : Est capable de comprendre des textes plus détaillés (articles courts, dialogues s", "url": "https://sites.google.com/view/speakeasytisha/theme/thanksgiving?authuser=0", "cat": "Other"}, {"title": "- Lire : Est capable de comprendre des textes plus détaillés (articles courts, dialogues s", "url": "https://speakeasytisha.github.io/myriam-reading.html", "cat": "Other"}, {"title": "- Prendre part à une conversation : Discute de manière simple sur des sujets d’intérêt per", "url": "https://speakeasytisha.github.io/english360-myriam-dream-usa-to-die-for-places-v2.html", "cat": "Other"}, {"title": "- Rédige un texte court et structuré sur un sujet familier.\" Introduce yourself: Write ess", "url": "https://docs.google.com/document/d/1lS4cuppy3dP0gdaft0J4vujwKTPdi_U4/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "cat": "Other"}, {"title": "- Rédige un texte court et structuré sur un sujet familier.\" VOCABULARY • CONNECTORS • GUI", "url": "https://drive.google.com/file/d/1aMkgBlKllyH2cBQx1eo3vIiyuTfuXDel/view?usp=sharing", "cat": "Other"}, {"title": "- Rédige un texte court et structuré sur un sujet familier.\" clear steps: idea → plan → se", "url": "https://docs.google.com/document/d/1LZLM-LKAQJ3bDr7ZMBjckNG9O88DSud9/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "cat": "Other"}, {"title": "-ED: /t/ /d/ /ɪd/ (worked, played, wanted)\"", "url": "https://speakeasytisha.github.io/like-to-vs-like-doing", "cat": "Other"}, {"title": "ENGLISH 360°", "url": "https://speakeasytisha.github.io/english-360-next-step-pack2.html", "cat": "Other"}, {"title": "ENGLISH 360°", "url": "https://speakeasytisha.github.io/english-360-prep.html", "cat": "Other"}, {"title": "Introduction", "url": "https://docs.google.com/presentation/d/16wN3gX5CTXnX95Q6oyS3rBiMDfaIce7J/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true", "cat": "Other"}, {"title": "Sentence Builder + mini test → earn Key #3\"", "url": "https://speakeasytisha.github.io/professions-fun-titles", "cat": "Other"}, {"title": "Talk about your values, what you learned from your parents, and what you want to pass down", "url": "https://docs.google.com/document/d/12NxBncHbA38i-TIjVJULqyJPcpcHb4BegblJ52XZicM/edit?usp=sharing\"", "cat": "Other"}, {"title": "Talk about your values, what you learned from your parents, and what you want to pass down", "url": "https://speakeasytisha.github.io/english360-myriam-values-life-lesson-v3.html", "cat": "Other"}, {"title": "Travel vocabulary + itinerary builder\"", "url": "https://speakeasytisha.github.io/english360-myriam-anniversary-honeymoon-lesson.html", "cat": "Other"}, {"title": "complexes.\" Check-in, room description, there is/there are, prepositions of place, present", "url": "https://docs.google.com/presentation/d/1J00yboy0pY6MsedJL_CN4W1aa0jx_Vo9/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true", "cat": "Other"}, {"title": "complexes.\" Grammar, Dialogue, Role Play, Vocabulary, Pronunciation", "url": "https://docs.google.com/presentation/d/17aCbbGUk17nmmBQtcZEKMh8BHOeYDvQx/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "cat": "Other"}, {"title": "complexes.\" Grammar, Dialogue, Role Play, Vocabulary, Pronunciation,Reading comprehension", "url": "https://docs.google.com/presentation/d/1eHXjEAasdu82kMtD9wf2N2sJO8317abk/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true", "cat": "Other"}, {"title": "https://cdn.filestackcontent.com/0ohOL122S1S9TLOdIsdc", "url": "https://cdn.filestackcontent.com/0ohOL122S1S9TLOdIsdc", "cat": "Other"}, {"title": "personnelles.\" Vocabulary, Comprehension, Comparison", "url": "https://docs.google.com/presentation/d/15rFwsI5_OabNY4Fe2S6UtWqL5SZc1HId/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "cat": "Other"}, {"title": "plus d’aisance.\" Grammar, Dialogue, Role Play, Vocabulary, Pronunciation,Reading comprehen", "url": "https://docs.google.com/presentation/d/1-QToJfWoRhO9azoeDacgCnRCk3tYu_-O/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "cat": "Other"}, {"title": "🏁 Final: write + speak your review", "url": "https://speakeasytisha.github.io/famous-people-describe.html", "cat": "Other"}, {"title": "🏁 Final: write + speak your review", "url": "https://speakeasytisha.github.io/people-profile-match", "cat": "Other"}, {"title": "-ED: /t/ /d/ /ɪd/ (worked, played, wanted)\"", "url": "https://speakeasytisha.github.io/pronunciation-sounds-masterclass#sEs", "cat": "Pronunciation & numbers"}, {"title": "Numbers-Masterclass", "url": "https://speakeasytisha.github.io/numbers-masterclass-addon", "cat": "Pronunciation & numbers"}, {"title": "NY Trip Planner", "url": "https://speakeasytisha.github.io/nyc-trip-planner-compare.html", "cat": "Travel & daily life"}, {"title": "Shopping Spree", "url": "https://speakeasytisha.github.io/shopping-spree-followup-stores", "cat": "Travel & daily life"}, {"title": "plus d’aisance.\" vocabulary, grammar, exercises, dialogues, role-play", "url": "https://sites.google.com/view/speakeasytisha/theme/restaurant-of-the-year?authuser=0", "cat": "Travel & daily life"}, {"title": "✅ Complete listening + speaking practice\"", "url": "https://speakeasytisha.github.io/cooking-quest.html", "cat": "Travel & daily life"}, {"title": "✅ Sound warm (not too direct) in English\"", "url": "https://speakeasytisha.github.io/valentines-day-sweet-notes.html", "cat": "Travel & daily life"}, {"title": "✅ Understand UK/US differences\"", "url": "https://speakeasytisha.github.io/shopping-spree", "cat": "Travel & daily life"}, {"title": "✅ write + send New Year wishes (cards, texts, emails)\"", "url": "https://speakeasytisha.github.io/new-year.html", "cat": "Travel & daily life"}, {"title": "- Rédige un texte court et structuré sur un sujet familier.\" clear steps: idea → plan → se", "url": "https://speakeasytisha.github.io/english-360-essay-booster", "cat": "Writing"}, {"title": "Writing ENGLISH 360°", "url": "https://speakeasytisha.github.io/english360-miriam-email-speaking-masterclass.html", "cat": "Writing"}, {"title": "https://cdn.filestackcontent.com/0ohOL122S1S9TLOdIsdc", "url": "https://speakeasytisha.github.io/english360-myriam-hobbies-essay-booster-v2.html", "cat": "Writing"}];

  // TTS
  const tts = { voices: [] };
  const loadVoices = () => { try { tts.voices = speechSynthesis.getVoices(); } catch(e){ tts.voices=[]; } };
  const pickVoice = () => {
    const v = tts.voices || [];
    if(!v.length) return null;
    const wants = state.accent === 'UK' ? ['en-GB','United Kingdom','UK'] : ['en-US','United States','US'];
    for(const x of v){
      for(const w of wants){
        if((x.lang||'').includes(w) || (x.name||'').includes(w)) return x;
      }
    }
    for(const x of v) if((x.lang||'').startsWith('en')) return x;
    return v[0];
  };
  const speak = (text) => {
    if(!('speechSynthesis' in window) || !text) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = state.rate;
      const v = pickVoice(); if(v) u.voice=v;
      speechSynthesis.speak(u);
    } catch(e){}
  };

  // Mode / toggles
  const isPractice = () => state.mode === 'practice' || state.teacher;

  const setMode = (m) => {
    state.mode = m;
    $$('.segBtn[data-mode]').forEach(b => b.classList.toggle('on', b.dataset.mode===m));
    // In exam mode hide prompt by default; in practice show prompt
    setPromptVisible(isPractice());
  };
  const setTeacher = (on) => {
    state.teacher = !!on;
    const b = $('#teacherToggle');
    b.textContent = 'Teacher mode: ' + (state.teacher ? 'On' : 'Off');
    b.setAttribute('aria-pressed', state.teacher?'true':'false');
    setPromptVisible(isPractice());
  };
  const setLevel = (lvl) => {
    state.level = lvl;
    $$('.segBtn[data-level]').forEach(b => b.classList.toggle('on', b.dataset.level===lvl));
    $('#modelBox').textContent = '—';
  };
  const setAccent = (acc) => {
    state.accent = acc;
    $$('.segBtn[data-accent]').forEach(b => b.classList.toggle('on', b.dataset.accent===acc));
  };

  // Timer
  const startTimer = (sec) => {
    if(state.timer) clearInterval(state.timer);
    let left = sec;
    $('#tClock').textContent = fmt(left);
    state.timer = setInterval(() => {
      left--;
      $('#tClock').textContent = fmt(Math.max(0,left));
      if(left<=0){ clearInterval(state.timer); state.timer=null; }
    }, 1000);
  };
  const stopTimer = () => {
    if(state.timer) clearInterval(state.timer);
    state.timer=null;
    $('#tClock').textContent='00:00';
  };

  // Prompt visibility
  const setPromptVisible = (visible) => {
    state.promptVisible = !!visible;
    const ph = $('#promptPlaceholder');
    const txt = $('#promptText');
    const btn = $('#promptToggle');
    if(state.promptVisible){
      ph.style.display='none';
      txt.style.display='block';
      btn.textContent='Hide prompt';
    } else {
      ph.style.display='block';
      txt.style.display='none';
      btn.textContent='Show prompt';
    }
  };

  // Notes persistence per scenario
  const LSKEY='e360_oral_notes_v1';
  const loadNotes = () => {
    try { return JSON.parse(localStorage.getItem(LSKEY) || '{}'); } catch(e){ return {}; }
  };
  const saveNotes = (obj) => {
    try { localStorage.setItem(LSKEY, JSON.stringify(obj)); } catch(e){}
  };

  // Rubric
  const rubricItems = [
    'Polite opener',
    'Clear problem/goal',
    'Clear request',
    'One connector',
    'Polite closing'
  ];
  const renderRubric = () => {
    const host = $('#rubric');
    host.innerHTML='';
    rubricItems.forEach((t,idx)=>{
      const id='rb_'+idx;
      const row=document.createElement('label');
      row.className='kitem';
      row.innerHTML = `<input type="checkbox" id="${id}"> <div><div style="font-weight:950">${t}</div><div class="tiny muted">Check if you used it</div></div>`;
      host.appendChild(row);
    });
    updateRubricScore();
    host.addEventListener('change', updateRubricScore);
  };
  const updateRubricScore = () => {
    const checks = $$('#rubric input[type="checkbox"]');
    const score = checks.filter(c=>c.checked).length;
    $('#rubricScore').textContent = String(score);
  };
  const resetRubric = () => {
    $$('#rubric input[type="checkbox"]').forEach(c=>c.checked=false);
    updateRubricScore();
  };

  // Scenario rendering
  const setScenario = (id) => {
    const s = all.find(x=>x.id===id) || all[0];
    state.current = s;
    $('#promptText').textContent = s.prompt;
    $('#modelBox').textContent = '—';

    // Chips
    const chips = $('#planChips');
    chips.innerHTML='';
    s.plan.forEach(p=>{
      const b=document.createElement('button');
      b.type='button'; b.className='chip'; b.textContent=p;
      b.addEventListener('click', ()=>{
        const ta=$('#notes');
        ta.value = (ta.value ? ta.value + "\n" : "") + p + ": ";
        persistNotes();
      });
      chips.appendChild(b);
    });

    // restore notes
    const store = loadNotes();
    $('#notes').value = store[s.id] || '';
    setPromptVisible(isPractice());
    resetRubric();
  };

  const persistNotes = () => {
    const store = loadNotes();
    if(state.current) store[state.current.id] = $('#notes').value;
    saveNotes(store);
  };

  const showModel = () => {
    if(!state.current) return;
    $('#modelBox').textContent = state.current.models[state.level];
  };

  // Scenario bank
  const renderBank = () => {
    const f = $('#bankFilter').value;
    const q = ($('#bankSearch').value||'').toLowerCase().trim();
    const list = all.filter(s=>{
      const tag = s.isProduction ? 'Production' : (s.tag||'');
      if(f!=='All' && tag!==f) return false;
      const hay = (s.title+' '+s.prompt+' '+tag).toLowerCase();
      if(q && !hay.includes(q)) return false;
      return true;
    });
    const out = list.map(s=>{
      const tag = s.isProduction ? 'Production' : s.tag;
      return `• [${tag}] ${s.title}\n  → ${
        s.prompt.length>140 ? s.prompt.slice(0,140)+'…' : s.prompt
      }\n  (Select it in the dropdown above to practise.)`;
    }).join('\n\n');
    $('#bankList').textContent = out || 'No matches.';
  };

  // Phrase bank
  const reqLines = [
    'Could you please…?',
    'Would it be possible to…?',
    'Could you confirm…?',
    'I would like to…',
    'I’d appreciate it if you could…',
    'Could you tell me…?'
  ];
  const connLines = [
    'because / since',
    'however / on the other hand',
    'in addition / moreover',
    'for example / for instance',
    'as a result / therefore',
    'overall / in conclusion'
  ];

  const addToNotes = (lines) => {
    const ta=$('#notes');
    ta.value = (ta.value ? ta.value + "\n" : "") + lines.join("\n");
    persistNotes();
  };

  // Review links
  const cats = Array.from(new Set(reviewLinks.map(x=>x.cat))).sort((a,b)=>a.localeCompare(b));
  const fillLinkCats = () => {
    const sel=$('#linkCat');
    sel.innerHTML = ['All',...cats].map(c=>`<option value="${c}">${c}</option>`).join('');
  };
  const renderLinks = () => {
    const cat=$('#linkCat').value;
    const q=($('#linkSearch').value||'').toLowerCase().trim();
    const list = reviewLinks.filter(x=>{
      if(cat!=='All' && x.cat!==cat) return false;
      const hay=(x.title+' '+x.url+' '+x.cat).toLowerCase();
      if(q && !hay.includes(q)) return false;
      return true;
    }).slice(0,24); // keep light
    const grid=$('#linkGrid');
    grid.innerHTML='';
    list.forEach(x=>{
      const d=document.createElement('div');
      d.className='linkCard';
      d.innerHTML = `<div class="t">${x.title||'Lesson'}</div><div class="c">${x.cat}</div><a class="pill ghost" href="${x.url}" target="_blank" rel="noopener">Open</a>`;
      grid.appendChild(d);
    });
    if(reviewLinks.length>24){
      const hint=document.createElement('div');
      hint.className='tiny muted mt10';
      hint.textContent='Showing 24 results. Use search to find a specific lesson.';
      grid.appendChild(hint);
    }
  };

  const buildIntro = () => {
    // Kept general in-page (no citations in page)
    $('#oralIntroBox').textContent =
`English 360° exam (typical structure):

1) Listening
2) Reading
3) Language Use (grammar/vocab)
4) Speaking — Interaction (short answers)
5) Speaking — Production (1 minute)
6) Writing (2 tasks)

Oral timing:
• Interaction: 30–60 seconds per question
• Production: 1 minute

How it is graded:
• Speaking & writing: evaluated by an English assessor
• Other sections: auto-scored

How to score higher:
1) Be clear + organised
2) Use polite requests
3) Add connectors
4) Add one detail (date/price/preference)
5) Finish politely`;
  };

  const init = () => {
    $('#jsOk').textContent='JS: ready ✅';

    loadVoices();
    if('speechSynthesis' in window) speechSynthesis.onvoiceschanged = loadVoices;

    // toolbar
    $$('.segBtn[data-mode]').forEach(b=>b.addEventListener('click', ()=>setMode(b.dataset.mode)));
    $$('.segBtn[data-level]').forEach(b=>b.addEventListener('click', ()=>setLevel(b.dataset.level)));
    $$('.segBtn[data-accent]').forEach(b=>b.addEventListener('click', ()=>setAccent(b.dataset.accent)));
    $('#rate').addEventListener('input', e=>state.rate=parseFloat(e.target.value||'1'));
    $('#teacherToggle').addEventListener('click', ()=>setTeacher(!state.teacher));

    // dropdown
    const sel=$('#scSel');
    sel.innerHTML = all.map(s=>`<option value="${s.id}">[${s.isProduction?'Production':s.tag}] ${s.title}</option>`).join('');
    sel.addEventListener('change', ()=>setScenario(sel.value));
    setScenario(all[0].id);

    // prompt controls
    $('#promptToggle').addEventListener('click', ()=>setPromptVisible(!state.promptVisible));
    $('#promptRead').addEventListener('click', ()=>speak($('#promptText').textContent));

    // timers
    $('#t45').addEventListener('click', ()=>startTimer(45));
    $('#t60').addEventListener('click', ()=>startTimer(60));
    $('#t90').addEventListener('click', ()=>startTimer(90));
    $('#tStop').addEventListener('click', stopTimer);

    // notes
    $('#notes').addEventListener('input', persistNotes);
    $('#copyNotes').addEventListener('click', async ()=>{ try{ await navigator.clipboard.writeText($('#notes').value); }catch(e){} });
    $('#clearNotes').addEventListener('click', ()=>{ $('#notes').value=''; persistNotes(); });

    // model
    $('#modelBtn').addEventListener('click', showModel);
    $('#modelRead').addEventListener('click', ()=>speak($('#modelBox').textContent==='—'?'':$('#modelBox').textContent));
    $('#copyModel').addEventListener('click', async ()=>{ try{ await navigator.clipboard.writeText($('#modelBox').textContent); }catch(e){} });

    // rubric
    renderRubric();
    $('#rubricReset').addEventListener('click', resetRubric);

    // intro
    buildIntro();
    $('#introRead').addEventListener('click', ()=>speak($('#oralIntroBox').textContent));

    // bank
    $('#bankFilter').addEventListener('change', renderBank);
    $('#bankSearch').addEventListener('input', renderBank);
    $('#bankReset').addEventListener('click', ()=>{ $('#bankFilter').value='All'; $('#bankSearch').value=''; renderBank(); });
    renderBank();

    // phrase bank
    $('#phraseRequests').textContent = reqLines.map(x=>'• '+x).join('\n');
    $('#phraseConnectors').textContent = connLines.map(x=>'• '+x).join('\n');
    $('#addReq').addEventListener('click', ()=>addToNotes(reqLines));
    $('#addConn').addEventListener('click', ()=>addToNotes(connLines));

    // links
    fillLinkCats();
    $('#linkCat').addEventListener('change', renderLinks);
    $('#linkSearch').addEventListener('input', renderLinks);
    $('#linkReset').addEventListener('click', ()=>{ $('#linkCat').value='All'; $('#linkSearch').value=''; renderLinks(); });
    renderLinks();

    // defaults
    setMode('practice');
    setTeacher(false);
    setLevel('A2');
    setAccent('US');
  };

  window.addEventListener('error', (e) => {
    const box=$('#errBox'); if(box){ box.hidden=false; box.textContent='⚠️ ' + (e && e.message ? e.message : 'Error'); }
  });

  document.addEventListener('DOMContentLoaded', init);
})();
