/* SpeakEasyTisha — Canada Conversation Studio v2 (A1+ → A2)
   Adds full grammar lessons (tenses + comparatives) + exercises.
   Audio is NOT automatic by default (toggle Auto audio ON when needed).
*/
(() => {
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  const JS_STATUS = document.getElementById("jsStatus");
  if(JS_STATUS) JS_STATUS.textContent = "JS: ✅ loaded · FIX-20260318-003626";
  window.__ccsBuild = "FIX-20260318-003626";

  const DEBUG = document.getElementById("debugBox");
  function logDebug(msg){
    try{ if(!DEBUG) return; DEBUG.classList.remove("hidden"); DEBUG.textContent += `\n${msg}`; }catch(e){}
  }
  window.addEventListener("error", (e) => { logDebug(`[Error] ${e.message} @ ${e.filename}:${e.lineno}`); });
  window.addEventListener("unhandledrejection", (e) => { logDebug(`[Promise] ${String(e.reason)}`); });

  function escapeHtml(s){
    return String(s ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
  function normalize(s){
    return String(s ?? "")
      .replace(/[’']/g,"'")
      .replace(/\s+/g," ")
      .trim()
      .toLowerCase();
  }
  function shuffle(arr){
    const a = (arr || []).slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function attachTap(el, handler){
    if(!el) return;
    const h = (e) => { try{ handler(e); }catch(err){ console.error(err); } };
    el.addEventListener("click", h);
    el.addEventListener("pointerup", h);
    el.addEventListener("touchend", h, {passive:true});
  }
  function safeEl(sel, root=document){
    try{ return (root || document).querySelector(sel); }catch(e){ return null; }
  }
  function safeOn(sel, evt, handler, root=document){
    const el = safeEl(sel, root);
    if(!el) return;
    el.addEventListener(evt, handler);
  }

  // Speech
  const Speech = {
    mode:"en-US",
    rate:0.97,
    voices:[],
    getVoices(){ this.voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; return this.voices; },
    pickVoice(){
      const v = this.getVoices();
      const lang = this.mode.toLowerCase();
      let best = v.find(x => (x.lang||"").toLowerCase() === lang);
      if(!best) best = v.find(x => (x.lang||"").toLowerCase().startsWith(lang));
      if(!best) best = v.find(x => (x.lang||"").toLowerCase().startsWith("en"));
      return best || null;
    },
    stop(){ try{ window.speechSynthesis?.cancel(); }catch(e){} },
    pause(){ try{ window.speechSynthesis?.pause(); }catch(e){} },
    resume(){ try{ window.speechSynthesis?.resume(); }catch(e){} },
    say(text){
      if(!window.speechSynthesis) return;
      try{
        if(window.speechSynthesis.speaking || window.speechSynthesis.pending){
          window.speechSynthesis.cancel();
        }
      }catch(e){}
      const u = new SpeechSynthesisUtterance(String(text || ""));
      const voice = this.pickVoice();
      if(voice) u.voice = voice;
      u.lang = this.mode;
      u.rate = this.rate;
      u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    }
  };
  if(window.speechSynthesis){
    window.speechSynthesis.onvoiceschanged = () => Speech.getVoices();
  }

  const AudioMode = {
    auto:false,
    key:"ccs_autoAudio_v2",
    load(){ this.auto = (localStorage.getItem(this.key) === "1"); },
    save(){ localStorage.setItem(this.key, this.auto ? "1" : "0"); }
  };

  function setVoice(mode){
    Speech.mode = mode;
    const us=$("#voiceUS"), uk=$("#voiceUK");
    if(!us || !uk) return;
    if(mode==="en-US"){
      us.classList.add("is-on"); uk.classList.remove("is-on");
      us.setAttribute("aria-pressed","true"); uk.setAttribute("aria-pressed","false");
    }else{
      uk.classList.add("is-on"); us.classList.remove("is-on");
      uk.setAttribute("aria-pressed","true"); us.setAttribute("aria-pressed","false");
    }
  }
  function syncAutoButtons(){
    const off=$("#autoOff"), on=$("#autoOn");
    if(!off || !on) return;
    if(AudioMode.auto){
      on.classList.add("is-on"); off.classList.remove("is-on");
      on.setAttribute("aria-pressed","true"); off.setAttribute("aria-pressed","false");
    }else{
      off.classList.add("is-on"); on.classList.remove("is-on");
      off.setAttribute("aria-pressed","true"); on.setAttribute("aria-pressed","false");
    }
  }
  function setAutoAudio(v){
    AudioMode.auto=!!v;
    AudioMode.save();
    syncAutoButtons();
  }

  safeOn("#voiceUS","click", () => setVoice("en-US"));
  safeOn("#voiceUK","click", () => setVoice("en-GB"));
  safeOn("#autoOff","click", () => setAutoAudio(false));
  safeOn("#autoOn","click", () => setAutoAudio(true));
  safeOn("#btnPause","click", () => Speech.pause());
  safeOn("#btnResume","click", () => Speech.resume());
  safeOn("#btnStop","click", () => Speech.stop());
  safeOn("#btnGoVocab","click", () => $("#sec1")?.scrollIntoView({behavior:"smooth"}));
  safeOn("#btnHow","click", () => alert("Auto audio is OFF by default.\nClick 🔊 when you want audio.\nTurn Auto audio ON only when needed."));

  // Score
  const Score = {
    now:0, max:0, awarded:new Set(),
    setMax(n){ this.max=n; updateScore(); updateProgress(); },
    award(key, pts=1){
      if(this.awarded.has(key)) return;
      this.awarded.add(key);
      this.now += pts;
      updateScore(); updateProgress();
    },
    reset(){ this.now=0; this.awarded.clear(); updateScore(); updateProgress(); }
  };
  function updateScore(){
    const a=$("#scoreNow"), b=$("#scoreMax");
    if(a) a.textContent=String(Score.now);
    if(b) b.textContent=String(Score.max);
  }
  function updateProgress(){
    const bar=$("#progressBar");
    if(!bar) return;
    const pct = Score.max ? Math.round((Score.now/Score.max)*100) : 0;
    bar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  }

  // ---------- Data ----------
  const VOCAB_SETS = [
    {key:"hotel", label:"🏨 Hotel essentials"},
    {key:"tickets", label:"🎫 Tickets + transport"},
    {key:"directions", label:"🧭 Directions + location"},
    {key:"cafe", label:"☕ Café + restaurant"},
    {key:"opinions", label:"💬 Opinions + preferences"},
    {key:"problems", label:"🆘 Problems + solutions"}
  ];

  const VOCAB = [
    {set:"hotel", icon:"🛎️", word:"reservation", fr:"réservation", def:"a booking", ex:"I have a reservation for two nights."},
    {set:"hotel", icon:"🪪", word:"ID", fr:"pièce d’identité", def:"identity card/passport", ex:"May I see your ID, please?"},
    {set:"hotel", icon:"🔑", word:"key card", fr:"carte clé", def:"card to open your room", ex:"Here is your key card."},
    {set:"hotel", icon:"🕒", word:"check-in", fr:"enregistrement", def:"arrive and get your room", ex:"Check-in is at 3 pm."},
    {set:"hotel", icon:"🧳", word:"luggage", fr:"bagages", def:"suitcases and bags", ex:"Could you store our luggage, please?"},
    {set:"hotel", icon:"🧼", word:"towels", fr:"serviettes", def:"cloths to dry", ex:"Could we have extra towels, please?"},
    {set:"hotel", icon:"🧾", word:"receipt", fr:"reçu", def:"proof of payment", ex:"Can I have a receipt, please?"},
    {set:"hotel", icon:"📶", word:"Wi‑Fi password", fr:"mot de passe Wi‑Fi", def:"code to connect", ex:"What is the Wi‑Fi password?"},
    {set:"tickets", icon:"🚆", word:"train", fr:"train", def:"transport on rails", ex:"The train leaves at 10 am."},
    {set:"tickets", icon:"🚌", word:"bus", fr:"bus", def:"public transport vehicle", ex:"Where is the bus stop?"},
    {set:"tickets", icon:"🚇", word:"metro", fr:"métro", def:"underground train", ex:"Take the metro to downtown."},
    {set:"tickets", icon:"🎫", word:"one-way ticket", fr:"aller simple", def:"ticket for one trip", ex:"One one-way ticket, please."},
    {set:"tickets", icon:"🔁", word:"return ticket", fr:"aller-retour", def:"ticket for two trips", ex:"A return ticket to Niagara, please."},
    {set:"tickets", icon:"🧭", word:"platform", fr:"quai", def:"place to wait for a train", ex:"Which platform is it?"},
    {set:"tickets", icon:"⏱️", word:"schedule", fr:"horaires", def:"times for trains/buses", ex:"What is the schedule today?"},
    {set:"tickets", icon:"💳", word:"pay by card", fr:"payer par carte", def:"use a bank card", ex:"Can I pay by card?"},
    {set:"directions", icon:"⬆️", word:"go straight", fr:"aller tout droit", def:"do not turn", ex:"Go straight for two minutes."},
    {set:"directions", icon:"⬅️", word:"turn left", fr:"tourner à gauche", def:"go to the left", ex:"Turn left at the corner."},
    {set:"directions", icon:"➡️", word:"turn right", fr:"tourner à droite", def:"go to the right", ex:"Turn right after the bank."},
    {set:"directions", icon:"🦶", word:"cross the street", fr:"traverser la rue", def:"go to the other side", ex:"Cross the street carefully."},
    {set:"directions", icon:"🧲", word:"next to", fr:"à côté de", def:"beside", ex:"The café is next to the hotel."},
    {set:"directions", icon:"🪞", word:"across from", fr:"en face de", def:"opposite side", ex:"It is across from the park."},
    {set:"directions", icon:"↔️", word:"between", fr:"entre", def:"in the middle of two places", ex:"It is between the bank and the café."},
    {set:"directions", icon:"📍", word:"near", fr:"près de", def:"close", ex:"Is it near here?"},
    {set:"cafe", icon:"☕", word:"coffee", fr:"café", def:"hot drink", ex:"A coffee, please."},
    {set:"cafe", icon:"🫖", word:"tea", fr:"thé", def:"hot drink", ex:"Could I have a tea, please?"},
    {set:"cafe", icon:"🥐", word:"croissant", fr:"croissant", def:"pastry", ex:"Two croissants, please."},
    {set:"cafe", icon:"🥗", word:"salad", fr:"salade", def:"cold dish", ex:"I’d like a salad, please."},
    {set:"cafe", icon:"🥤", word:"to go", fr:"à emporter", def:"take away", ex:"To go, please."},
    {set:"cafe", icon:"🪑", word:"for here", fr:"sur place", def:"eat/drink here", ex:"For here, please."},
    {set:"cafe", icon:"🧾", word:"the bill / check", fr:"l’addition", def:"paper with the price", ex:"Can I have the check, please?"},
    {set:"cafe", icon:"🚰", word:"tap water", fr:"eau du robinet", def:"water from the tap", ex:"Could we have tap water, please?"},
    {set:"opinions", icon:"👍", word:"I prefer…", fr:"je préfère…", def:"I like one option more", ex:"I prefer Montréal because it feels cultural."},
    {set:"opinions", icon:"💡", word:"How about…?", fr:"Et si… ?", def:"make a suggestion", ex:"How about we go in July?"},
    {set:"opinions", icon:"✅", word:"That sounds good.", fr:"Ça me va.", def:"agree politely", ex:"That sounds good to me."},
    {set:"opinions", icon:"🟰", word:"I agree.", fr:"Je suis d’accord.", def:"same opinion", ex:"I agree with you."},
    {set:"opinions", icon:"🔁", word:"However,…", fr:"Cependant,…", def:"contrast", ex:"However, it can be expensive."},
    {set:"opinions", icon:"🔗", word:"because", fr:"parce que", def:"give a reason", ex:"…because it is relaxing."},
    {set:"opinions", icon:"📉", word:"cheaper", fr:"moins cher", def:"lower price", ex:"Ottawa is cheaper than Toronto."},
    {set:"opinions", icon:"🏆", word:"the best", fr:"le meilleur", def:"top choice", ex:"Banff is one of the best places."},
    {set:"problems", icon:"❓", word:"I’m not sure.", fr:"Je ne suis pas sûr(e).", def:"uncertain", ex:"I’m not sure. Could you repeat, please?"},
    {set:"problems", icon:"🗣️", word:"Could you repeat, please?", fr:"Pouvez-vous répéter ?", def:"ask again", ex:"Could you repeat, please?"},
    {set:"problems", icon:"🐢", word:"more slowly", fr:"plus lentement", def:"slower speed", ex:"More slowly, please."},
    {set:"problems", icon:"📍", word:"I’m lost.", fr:"Je suis perdu(e).", def:"do not know where you are", ex:"Excuse me, I’m lost."},
    {set:"problems", icon:"🔧", word:"It doesn’t work.", fr:"Ça ne marche pas.", def:"not functioning", ex:"The key card doesn’t work."},
    {set:"problems", icon:"🙏", word:"Could you help me, please?", fr:"Pouvez-vous m’aider ?", def:"ask for help", ex:"Could you help me, please?"}
  ];

  const READING_LINES = [
    {ico:"🧭", text:"Mark and Sophie want to visit Canada. They want a trip that is relaxing, but also interesting."},
    {ico:"🗺️", text:"They are thinking about Montréal and Banff. Montréal is in Quebec. It is a cultural city with great food and museums."},
    {ico:"🏔️", text:"Banff is in Alberta, in the west. It is famous for the Rocky Mountains and scenic lakes. You can hike in summer or ski in winter."},
    {ico:"💬", text:"Mark says, “How about we go in July, for one week?” Sophie agrees, but she asks about the budget."},
    {ico:"💳", text:"They compare prices. Montréal is often cheaper than Banff. However, Banff can feel more scenic and romantic."},
    {ico:"✅", text:"In the end, they choose Banff for four days and Montréal for three days. They book the hotel, buy train tickets, and plan the dates."}
  ];
  const READING_TEXT = READING_LINES.map(x => x.text).join(" ");

  const readingQuestions = [
    { key:"r1", prompt:"Where is Montréal?", choices:["It is in Quebec.","It is in Alberta.","It is in the Yukon."], answer:0, hint:"Look at the second line.", explain:"Montréal is in Quebec." },
    { key:"r2", prompt:"What can you do in Banff?", choices:["Hike in summer or ski in winter.","Visit the CN Tower.","Go whale watching in Halifax."], answer:0, hint:"Rocky Mountains activities.", explain:"Banff → hiking/skiing." },
    { key:"r3", prompt:"Why does Sophie ask about the budget?", choices:["Because she wants to compare prices.","Because she is lost.","Because she needs a key card."], answer:0, hint:"Budget = money / price.", explain:"They compare prices." },
    { key:"r4", prompt:"What do they decide in the end?", choices:["Banff 4 days + Montréal 3 days.","Only Banff for 7 days.","Only Montréal for 7 days."], answer:0, hint:"The last line.", explain:"They choose both." }
  ];

  const TENSE_LESSON_LINES = [
    {ico:"🧠", text:"Present Simple (routine/facts): I stay at hotels. / He likes Montréal."},
    {ico:"✅", text:"Affirmative: I/you/we/they + base verb. He/she/it + verb+s. (I visit. He visits.)"},
    {ico:"❌", text:"Negative: do not (don’t) + base verb. / does not (doesn’t) + base verb. (I don’t know. She doesn’t know.)"},
    {ico:"❓", text:"Question: Do/Does + subject + base verb? (Do you want a ticket? Does he prefer Banff?)"},
    {ico:"⏱️", text:"Present Continuous (now/temporary): I am checking in now. / We are staying downtown."},
    {ico:"✅", text:"Affirmative: am/is/are + verb‑ing. (I am waiting.)"},
    {ico:"❌", text:"Negative: am not / isn’t / aren’t + verb‑ing. (We aren’t leaving yet.)"},
    {ico:"❓", text:"Question: Am/Is/Are + subject + verb‑ing? (Are you looking for the metro?)"},
    {ico:"🗓️", text:"Going to (plan/intentions): We are going to visit Banff next week."},
    {ico:"✅", text:"Form: am/is/are going to + base verb. (She is going to book a hotel.)"},
    {ico:"❓", text:"Question: Am/Is/Are + subject + going to + base verb? (Are you going to pay by card?)"},
    {ico:"⚡", text:"Will (quick decision/offer): I will help you. / We’ll take the bus."},
    {ico:"❌", text:"Negative: will not (won’t) + base verb. (I won’t be late.)"},
    {ico:"❓", text:"Question: Will + subject + base verb? (Will you take the metro?)"}
  ];
  const TENSE_SUMMARY = "Core travel tenses: Present Simple for routine and facts, Present Continuous for now, Going to for plans, Will for quick decisions and offers. Practice affirmative, negative, and questions.";

  const COMP_LESSON_LINES = [
    {ico:"📈", text:"Comparative = compare 2 things: Vancouver is bigger than Ottawa."},
    {ico:"🧩", text:"Short adjective: add -er (cheap → cheaper). Use THAN. (cheaper than)."},
    {ico:"🧩", text:"Long adjective: use MORE + adjective (more scenic, more interesting)."},
    {ico:"🏆", text:"Superlative = the top choice: Banff is the most scenic place."},
    {ico:"🧩", text:"Short adjective: the + -est (cheap → the cheapest)."},
    {ico:"🧩", text:"Long adjective: the most + adjective (the most interesting)."},
    {ico:"⭐", text:"Irregular: good → better → the best. bad → worse → the worst."},
    {ico:"🗣️", text:"Polite travel frame: X is better than Y because… However, it is more expensive."}
  ];
  const COMP_SUMMARY = "Comparatives: -er or more + adjective + than. Superlatives: the -est or the most + adjective. Remember irregular forms: good/better/best, bad/worse/worst.";

  const tenseMCQ = [
    { key:"t1", prompt:"Choose the correct sentence (present continuous: now).",
      choices:["I am checking in now.","I check in now every day.","I checking in now."],
      answer:0, hint:"Use: am/is/are + verb-ing.", explain:"Now → present continuous." },
    { key:"t2", prompt:"Choose the correct sentence (present simple: routine).",
      choices:["He usually takes the metro.","He is usually taking the metro.","He take usually the metro."],
      answer:0, hint:"Routine → present simple.", explain:"Usually → present simple." },
    { key:"t3", prompt:"Choose the correct plan (going to).",
      choices:["We are going to visit Banff next week.","We will visiting Banff next week.","We go to visit Banff next week."],
      answer:0, hint:"Plan → am/is/are going to + verb.", explain:"Planned future → going to." },
    { key:"t4", prompt:"Choose the best offer (will).",
      choices:["I will help you with your luggage.","I am help you now.","I help you yesterday."],
      answer:0, hint:"Offer → will + base verb.", explain:"Offer/quick decision → will." }
  ];

  const tenseFill = [
    { key:"tf1", prompt:"Choose the best question:", sentence:"___ you want a return ticket?", options:["Do", "Does", "Are"], answer:"Do",
      hint:"Questions (present simple): Do/Does + subject + base verb." },
    { key:"tf2", prompt:"Choose the best negative:", sentence:"She ___ like crowded places.", options:["doesn't", "don't", "isn't"], answer:"doesn't",
      hint:"He/she/it → doesn't + base verb." },
    { key:"tf3", prompt:"Choose the best form (now):", sentence:"We ___ waiting for the bus.", options:["are", "do", "will"], answer:"are",
      hint:"Present continuous: are + verb-ing." },
    { key:"tf4", prompt:"Choose the best plan:", sentence:"They ___ going to book a hotel.", options:["are", "do", "is"], answer:"are",
      hint:"They → are going to + verb." }
  ];

  const compMCQ2 = [
    { key:"c1", prompt:"Choose the correct comparative.",
      choices:["Montréal is cheaper than Banff.","Montréal is the cheaper than Banff.","Montréal is more cheap than Banff."],
      answer:0, hint:"Cheap → cheaper (short adj).", explain:"Use cheaper than."},
    { key:"c2", prompt:"Choose the correct superlative.",
      choices:["Banff is one of the most scenic places in Canada.","Banff is the more scenic place in Canada.","Banff is scenicest place."],
      answer:0, hint:"Use: one of the most + adjective + plural noun.", explain:"Most scenic is correct."},
    { key:"c3", prompt:"Choose the irregular form.",
      choices:["good → better → the best","good → more good → the most good","good → gooder → the goodest"],
      answer:0, hint:"Irregular: good/better/best.", explain:"Irregular comparative."}
  ];

  const compFill = [
    { key:"cf1", prompt:"Fill the sentence:", sentence:"Banff is ___ scenic than Toronto.", options:["more", "most", "much"], answer:"more",
      hint:"Comparative: more + adjective + than." },
    { key:"cf2", prompt:"Fill the sentence:", sentence:"Niagara is one of the ___ famous places.", options:["most", "more", "much"], answer:"most",
      hint:"Superlative: one of the most + adjective." },
    { key:"cf3", prompt:"Fill the sentence:", sentence:"Ottawa is ___ than Toronto. (calm)", options:["calmer", "more calm", "calmest"], answer:"calmer",
      hint:"Short adjective: calm → calmer." }
  ];

  const compBuilderItems = [
    { key:"cb1", title:"Build a comparative sentence", target:"Banff is more scenic than Toronto.",
      tokens:["Banff","is","more","scenic","than","Toronto."], hint:"Use: more + adjective + than." },
    { key:"cb2", title:"Build a superlative sentence", target:"Quebec City is one of the most romantic places in Canada.",
      tokens:["Quebec","City","is","one","of","the","most","romantic","places","in","Canada."], hint:"Use: one of the most…" }
  ];

  const DIALOGUES = [
    { key:"hotel", title:"🏨 Hotel check‑in (Montréal)", hintPhrases:["I have a reservation for two nights.","Could we have extra towels, please?","What time is check‑out?","Could you store our luggage, please?"], lines:[
      {who:"Reception", side:"a", say:"Hello. Welcome. How can I help you today?"},
      {who:"Guest", side:"b", say:"Hello. I have a reservation for two nights."},
      {who:"Reception", side:"a", say:"Of course. May I see your ID, please?"},
      {who:"Guest", side:"b", say:"Yes, here you are."},
      {who:"Reception", side:"a", say:"Thank you. Here is your key card. Check-out is at 11 am."},
      {who:"Guest", side:"b", say:"Great. Could we have extra towels, please?"},
      {who:"Reception", side:"a", say:"Yes, certainly. We will send them to your room."},
      {who:"Guest", side:"b", say:"Thank you very much."}
    ]},
    { key:"ticket", title:"🎫 Buy a ticket (Toronto → Niagara)", hintPhrases:["A return ticket to Niagara, please.","What time is the next train?","Which platform is it?","Can I pay by card?"], lines:[
      {who:"Clerk", side:"a", say:"Hello. Where would you like to go?"},
      {who:"Traveler", side:"b", say:"A return ticket to Niagara Falls, please."},
      {who:"Clerk", side:"a", say:"Certainly. The next train leaves at 10 am."},
      {who:"Traveler", side:"b", say:"Great. Which platform is it?"},
      {who:"Clerk", side:"a", say:"Platform two. Would you like to pay by card?"},
      {who:"Traveler", side:"b", say:"Yes, by card, please."},
      {who:"Clerk", side:"a", say:"Here is your ticket and your receipt."}
    ]},
    { key:"directions", title:"🧭 Ask for directions (metro)", hintPhrases:["Excuse me, where is the metro station, please?","Go straight and turn left.","It is next to the bank.","Thank you. Have a nice day!"], lines:[
      {who:"You", side:"b", say:"Excuse me, where is the metro station, please?"},
      {who:"Local", side:"a", say:"Go straight and turn left at the traffic lights."},
      {who:"You", side:"b", say:"Is it far from here?"},
      {who:"Local", side:"a", say:"No, it is near here. It is next to the bank."},
      {who:"You", side:"b", say:"Thank you very much!"},
      {who:"Local", side:"a", say:"You’re welcome. Have a nice day!"}
    ]},
    { key:"cafe", title:"☕ Café order (polite)", hintPhrases:["Could I have a coffee, please?","For here, please. / To go, please.","Could we have tap water, please?","Can I have the check, please?"], lines:[
      {who:"Staff", side:"a", say:"Hello. What would you like?"},
      {who:"Customer", side:"b", say:"Could I have a coffee and a croissant, please?"},
      {who:"Staff", side:"a", say:"Of course. For here or to go?"},
      {who:"Customer", side:"b", say:"For here, please."},
      {who:"Staff", side:"a", say:"Certainly. Anything else?"},
      {who:"Customer", side:"b", say:"Could we have tap water, please?"},
      {who:"Staff", side:"a", say:"Yes, of course."},
      {who:"Customer", side:"b", say:"Thank you."}
    ]}
  ];

  const LISTEN_MISSIONS = [
    { key:"l1", prompt:"Listen. Choose the best reply.", say:"May I see your ID, please?", choices:["Yes, here you are.","I am ID.","Tomorrow is fine."], answer:0, hint:"Polite response to a request.", explain:"Give the ID politely." },
    { key:"l2", prompt:"Listen. Choose the best reply.", say:"Where would you like to go?", choices:["A return ticket to Niagara, please.","I go platform.","Because yes."], answer:0, hint:"Destination + ticket type.", explain:"Request the ticket." },
    { key:"l3", prompt:"Listen. Choose the best reply.", say:"Go straight and turn left at the traffic lights.", choices:["Thank you very much!","I am left.","For here, please."], answer:0, hint:"After directions, say thank you.", explain:"Polite thanks." },
    { key:"l4", prompt:"Listen. Choose the best reply.", say:"For here or to go?", choices:["For here, please.","Between the bank and the café.","At July."], answer:0, hint:"Choose: for here / to go.", explain:"Correct answer." }
  ];

  const SPEAK_BUILDER = [
    { key:"s1", title:"Ask politely (hotel)", target:"Could you store our luggage, please?", tokens:["Could","you","store","our","luggage,","please?"], hint:"Could you + verb… + please?" },
    { key:"s2", title:"Make a suggestion (trip)", target:"How about we go to Banff in July?", tokens:["How","about","we","go","to","Banff","in","July?"], hint:"How about we go to… in…?" },
    { key:"s3", title:"Compare politely", target:"Montréal is cheaper than Banff; however, Banff is more scenic.", tokens:["Montréal","is","cheaper","than","Banff;","however,","Banff","is","more","scenic."], hint:"Use: cheaper than… however…" }
  ];

  const DEBATE_LINES = [
    {ico:"🧩", text:"I think… / In my opinion…"},
    {ico:"✅", text:"I agree. / That sounds good to me."},
    {ico:"🔁", text:"However, … / On the other hand, …"},
    {ico:"🔗", text:"because / so / also"},
    {ico:"🏆", text:"better than / the best / more… than / less… than"},
    {ico:"🧭", text:"First… Then… After that… Finally…"}
  ];
  const DEBATE_TEXT = DEBATE_LINES.map(x => x.text).join(" ");

  const PLACES = [{label:"Montréal"},{label:"Banff"},{label:"Toronto"},{label:"Niagara Falls"},{label:"Quebec City"}];

  // ---------- Components ----------
  function makeMCQ(host, questions, awardPrefix){
    host.innerHTML = "";
    const resets=[];
    questions.forEach((q, idx) => {
      const wrap=document.createElement("div");
      wrap.className="q";
      wrap.innerHTML=`
        <div class="q__prompt">${idx+1}. ${escapeHtml(q.prompt)}</div>
        <div class="smallrow">
          ${q.say ? `<button class="iconbtn" type="button" data-play="1">🔊 Listen</button>` : ""}
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
        </div>
        <div class="choices"></div>
        <div class="feedback hidden"></div>
      `;
      const fb=$(".feedback", wrap);
      const choices=$(".choices", wrap);

      if(q.say){ attachTap($("[data-play]", wrap), () => Speech.say(q.say)); }
      attachTap($("[data-hint]", wrap), () => {
        fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
        fb.innerHTML=`💡 <strong>Hint:</strong> ${escapeHtml(q.hint || "")}`;
      });

      q.choices.forEach((c,i) => {
        const row=document.createElement("label");
        row.className="choice";
        row.innerHTML=`<input type="radio" name="${escapeHtml(q.key)}"/><div>${escapeHtml(c)}</div>`;
        attachTap(row, () => {
          const ok=i===q.answer;
          fb.classList.remove("hidden","ok","no"); fb.classList.add(ok ? "ok" : "no");
          fb.innerHTML = ok
            ? `✅ Correct! <span class="muted">${escapeHtml(q.explain || "")}</span>`
            : `❌ Not quite. <strong>Best:</strong> ${escapeHtml(q.choices[q.answer])}. <span class="muted">${escapeHtml(q.explain || "")}</span>`;
          if(ok) Score.award(`${awardPrefix}:${q.key}`, 1);
        });
        choices.appendChild(row);
      });

      resets.push(() => { $$("input[type=radio]", wrap).forEach(x => x.checked=false); fb.classList.add("hidden"); });
      host.appendChild(wrap);
    });
    return { reset(){ resets.forEach(fn => fn()); } };
  }

  function buildFill(host, items, awardPrefix){
    host.innerHTML="";
    const resets=[];
    items.forEach((it, idx) => {
      const row=document.createElement("div");
      row.className="fillrow";
      const opts=shuffle(it.options);
      row.innerHTML=`
        <div class="prompt"><strong>${idx+1}.</strong> ${escapeHtml(it.prompt)}<br/><span class="muted">${escapeHtml(it.sentence)}</span></div>
        <div>
          <select>
            <option value="">Choose…</option>
            ${opts.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join("")}
          </select>
          <div class="smallrow" style="margin-top:.35rem;">
            <button class="hintbtn" type="button">💡 Hint</button>
          </div>
        </div>
      `;
      const sel=$("select", row);
      const hintBtn=$(".hintbtn", row);
      const fb=document.createElement("div");
      fb.className="feedback hidden";
      row.appendChild(fb);

      attachTap(hintBtn, () => {
        fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
        fb.innerHTML=`💡 <strong>Hint:</strong> ${escapeHtml(it.hint || "")}`;
      });

      sel.addEventListener("change", () => {
        const val=sel.value;
        if(!val) return;
        const ok=normalize(val) === normalize(it.answer);
        fb.classList.remove("hidden","ok","no"); fb.classList.add(ok ? "ok" : "no");
        fb.innerHTML = ok ? "✅ Correct!" : `❌ Not quite. Answer: <strong>${escapeHtml(it.answer)}</strong>`;
        if(ok) Score.award(`${awardPrefix}:${it.key}`, 1);
      });

      resets.push(() => { sel.value=""; fb.classList.add("hidden"); });
      host.appendChild(row);
    });
    return { reset(){ resets.forEach(fn => fn()); } };
  }

  function makeToken(text){
    const t=document.createElement("div");
    t.className="token";
    t.textContent=text;
    t.draggable=true;
    t.addEventListener("dragstart", () => { window.__dragToken=t; });
    return t;
  }

  function buildWordOrder(host, items, awardPrefix){
    host.innerHTML="";
    const resets=[];
    function markBankUsed(tok, used){
      if(used){ tok.classList.add("is-used"); tok.draggable=false; }
      else { tok.classList.remove("is-used"); tok.draggable=true; }
    }
    function attachDnD(tok){ tok.addEventListener("dragstart", () => { window.__dragToken=tok; }); }

    items.forEach((it, idx) => {
      const block=document.createElement("div");
      block.className="q";
      block.innerHTML=`
        <div class="q__prompt">${idx+1}. ${escapeHtml(it.title)}</div>
        <div class="smallrow">
          <button class="iconbtn" type="button" data-play="1">🔊 Listen</button>
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
          <button class="btn" type="button" data-check="1">✅ Check</button>
          <button class="btn btn--ghost" type="button" data-clear="1">↺ Clear</button>
        </div>
        <div class="builder">
          <div class="bank"></div>
          <div class="dropzone"></div>
        </div>
        <div class="feedback hidden"></div>
      `;
      const bank=$(".bank", block);
      const zone=$(".dropzone", block);
      const fb=$(".feedback", block);

      const tidToBank=new Map();
      const toks=shuffle(it.tokens).map((txt, iTok) => {
        const t=makeToken(txt);
        t.dataset.role="bank";
        t.dataset.tid=`${it.key}-t${iTok}`;
        tidToBank.set(t.dataset.tid, t);
        attachDnD(t);

        attachTap(t, () => {
          if(t.classList.contains("is-used")) return;
          const c=t.cloneNode(true);
          c.dataset.role="zone";
          c.dataset.sourceTid=t.dataset.tid;
          c.classList.remove("is-used");
          c.draggable=true;
          attachDnD(c);

          attachTap(c, (e) => {
            e.stopPropagation();
            const sid=c.dataset.sourceTid;
            c.remove();
            markBankUsed(tidToBank.get(sid), false);
          });

          zone.appendChild(c);
          markBankUsed(t, true);
        });
        return t;
      });
      toks.forEach(t => bank.appendChild(t));

      [bank, zone].forEach(cont => {
        cont.addEventListener("dragover", (e) => { e.preventDefault(); cont.classList.add("is-over"); });
        cont.addEventListener("dragleave", () => cont.classList.remove("is-over"));
        cont.addEventListener("drop", (e) => {
          e.preventDefault();
          cont.classList.remove("is-over");
          const dragged=window.__dragToken;
          if(!dragged) return;
          const targetTok=e.target.closest(".token");

          if(cont===bank && dragged.dataset.role==="zone"){
            const sid=dragged.dataset.sourceTid;
            dragged.remove();
            markBankUsed(tidToBank.get(sid), false);
            return;
          }
          if(cont===zone && dragged.dataset.role==="bank"){
            if(dragged.classList.contains("is-used")) return;
            const c=dragged.cloneNode(true);
            c.dataset.role="zone";
            c.dataset.sourceTid=dragged.dataset.tid;
            c.classList.remove("is-used");
            c.draggable=true;
            attachDnD(c);

            attachTap(c, (e2) => {
              e2.stopPropagation();
              const sid=c.dataset.sourceTid;
              c.remove();
              markBankUsed(tidToBank.get(sid), false);
            });

            if(targetTok && targetTok.parentElement===zone) zone.insertBefore(c, targetTok);
            else zone.appendChild(c);
            markBankUsed(dragged, true);
            return;
          }
          if(cont===zone && dragged.dataset.role==="zone"){
            if(targetTok && targetTok.parentElement===zone && targetTok!==dragged) zone.insertBefore(dragged, targetTok);
            else zone.appendChild(dragged);
          }
        });
      });

      attachTap($("[data-play]", block), () => Speech.say(it.target));
      attachTap($("[data-hint]", block), () => {
        fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
        fb.innerHTML=`💡 <strong>Hint:</strong> ${escapeHtml(it.hint || "")}`;
      });
      attachTap($("[data-check]", block), () => {
        const built=$$(".token", zone).map(t => t.textContent.trim()).join(" ").replace(/\s+/g," ").trim().replace(/\s+([,?.!])/g,"$1");
        const ok=normalize(built)===normalize(it.target);
        fb.classList.remove("hidden","ok","no"); fb.classList.add(ok ? "ok" : "no");
        fb.textContent = ok ? "✅ Perfect!" : `❌ Not yet. You wrote: “${built || "—"}”`;
        if(ok) Score.award(`${awardPrefix}:${it.key}`, 2);
      });
      attachTap($("[data-clear]", block), () => {
        $$(".token", zone).forEach(z => { const sid=z.dataset.sourceTid; z.remove(); markBankUsed(tidToBank.get(sid), false); });
        fb.classList.add("hidden");
      });

      resets.push(() => {
        $$(".token", zone).forEach(z => { const sid=z.dataset.sourceTid; z.remove(); markBankUsed(tidToBank.get(sid), false); });
        fb.classList.add("hidden");
      });

      host.appendChild(block);
    });

    return { reset(){ resets.forEach(fn => fn()); } };
  }

  // ---------- Render helpers ----------
  function renderVocabSets(){
    const sel=$("#vocabSet"); if(!sel) return;
    sel.innerHTML="";
    VOCAB_SETS.forEach(s => {
      const o=document.createElement("option");
      o.value=s.key; o.textContent=s.label;
      sel.appendChild(o);
    });
    sel.value="hotel";
  }
  function vocabForSet(k){ return VOCAB.filter(v => v.set===k); }

  function renderFlashcards(shuffleIt=false){
    const grid=$("#vocabGrid"); if(!grid) return;
    const setKey=$("#vocabSet")?.value || "hotel";
    let list=vocabForSet(setKey);
    if(shuffleIt) list=shuffle(list);
    grid.innerHTML="";
    list.forEach(v => {
      const card=document.createElement("div");
      card.className="flashcard";
      card.innerHTML=`
        <div class="fcTop">
          <div class="fcIcon">${v.icon}</div>
          <div class="smallrow"><span class="pillTag badgeFR">FR: ${escapeHtml(v.fr)}</span></div>
        </div>
        <div class="fcWord">${escapeHtml(v.word)}</div>
        <div class="fcDef">${escapeHtml(v.def)}</div>
        <div class="fcEx">“${escapeHtml(v.ex)}”</div>
        <div class="fcBtns">
          <button class="iconbtn" type="button">🔊 Listen</button>
          <button class="hintbtn" type="button">📋 Copy example</button>
        </div>
      `;
      const btnSpeak=$$(".iconbtn", card)[0];
      const btnCopy=$$(".hintbtn", card)[0];
      attachTap(btnSpeak, () => Speech.say(`${v.word}. ${v.ex}`));
      attachTap(btnCopy, async () => { try{ await navigator.clipboard.writeText(v.ex); }catch(e){} });
      grid.appendChild(card);
    });
  }

  let vocabQuizState={ q:null };
  function buildVocabQuiz(){
    const host=$("#vocabQuizHost"); if(!host) return;
    const setKey=$("#vocabSet")?.value || "hotel";
    const list=vocabForSet(setKey);
    if(list.length < 4){ host.innerHTML="<p class='muted'>Not enough words for a quiz.</p>"; return; }
    const q=list[Math.floor(Math.random()*list.length)];
    const distract=shuffle(list.filter(x => x.word !== q.word)).slice(0,3);
    const opts=shuffle([q, ...distract]);
    vocabQuizState={ q };

    host.innerHTML=`
      <div class="line">
        <div class="ico">${q.icon}</div>
        <div>
          <div style="font-weight:1100;">What is the correct word?</div>
          <div class="muted">Definition: ${escapeHtml(q.def)} <span class="pillTag badgeFR">FR: ${escapeHtml(q.fr)}</span></div>
        </div>
      </div>
      <div class="choices"></div>
      <div class="feedback hidden"></div>
    `;
    const choices=$(".choices", host);
    const fb=$(".feedback", host);

    opts.forEach(o => {
      const row=document.createElement("label");
      row.className="choice";
      row.innerHTML=`<input type="radio" name="vq"/><div>${escapeHtml(o.word)}</div>`;
      attachTap(row, () => {
        const ok=o.word===q.word;
        fb.classList.remove("hidden","ok","no"); fb.classList.add(ok ? "ok" : "no");
        fb.innerHTML = ok
          ? `✅ Correct! Example: “${escapeHtml(q.ex)}”`
          : `❌ Not quite. Answer: <strong>${escapeHtml(q.word)}</strong>. Example: “${escapeHtml(q.ex)}”`;
        if(ok) Score.award(`vocab:${setKey}:${q.word}`, 1);
      });
      choices.appendChild(row);
    });
  }

  function renderReading(){
    const host=$("#readingText"); if(!host) return;
    host.innerHTML="";
    READING_LINES.forEach(l => {
      const row=document.createElement("div");
      row.className="line";
      row.innerHTML=`<div class="ico">${l.ico}</div><div>${escapeHtml(l.text)}</div>`;
      host.appendChild(row);
    });
  }

  function renderLesson(hostId, lines){
    const host=$(hostId); if(!host) return;
    host.innerHTML="";
    lines.forEach(l => {
      const row=document.createElement("div");
      row.className="line";
      row.innerHTML=`<div class="ico">${l.ico}</div><div>${escapeHtml(l.text)}</div>`;
      host.appendChild(row);
    });
  }

  // Dialogues
  let dlgState={ key:DIALOGUES[0]?.key || "hotel", idx:0, timer:null, role:"b" };
  function renderDlgSelect(){
    const sel=$("#dlgSelect"); if(!sel) return;
    sel.innerHTML="";
    DIALOGUES.forEach(d => {
      const o=document.createElement("option");
      o.value=d.key; o.textContent=d.title;
      sel.appendChild(o);
    });
    sel.value=dlgState.key;
  }
  function currentDialogue(){ return DIALOGUES.find(d => d.key===dlgState.key) || DIALOGUES[0]; }
  function setDlgTitle(){ const h=$("#dlgTitle"); const d=currentDialogue(); if(h) h.textContent=d.title; }
  function clearChat(){
    const stream=$("#chatStream"); if(stream) stream.innerHTML="";
    const hint=$("#dlgHintBox"); if(hint) hint.classList.add("hidden");
    dlgState.idx=0;
    if(dlgState.timer) clearInterval(dlgState.timer);
    dlgState.timer=null;
  }
  function addBubble(line){
    const stream=$("#chatStream"); if(!stream) return;
    const b=document.createElement("div");
    b.className="bubble " + (line.side==="a" ? "a" : "b");
    b.innerHTML=`
      <div class="who">${line.side==="a" ? "🟦" : "🟩"} ${escapeHtml(line.who)}</div>
      <div class="txt">${escapeHtml(line.say)}</div>
      <div class="tools">
        <button class="toolmini" type="button">🔊</button>
        <button class="toolmini" type="button">↺ Repeat</button>
      </div>
    `;
    const tools=$$(".toolmini", b);
    attachTap(tools[0], (e) => { e.stopPropagation(); Speech.say(line.say); });
    attachTap(tools[1], (e) => { e.stopPropagation(); Speech.say(line.say); });

    stream.appendChild(b);
    stream.scrollTop = stream.scrollHeight;

    if(AudioMode.auto && line.side !== dlgState.role){
      Speech.say(line.say);
    }
  }
  function stepDialogue(){
    const d=currentDialogue();
    if(dlgState.idx >= d.lines.length) return false;
    addBubble(d.lines[dlgState.idx]);
    dlgState.idx++;
    return true;
  }
  function playDialogue(){
    if(dlgState.timer) clearInterval(dlgState.timer);
    dlgState.timer=setInterval(() => {
      const ok=stepDialogue();
      if(!ok){ clearInterval(dlgState.timer); dlgState.timer=null; }
    }, 1400);
  }
  function listenAllDialogue(){ const d=currentDialogue(); Speech.say(d.lines.map(x => x.say).join(" ")); }
  function showDlgHints(){
    const d=currentDialogue();
    const box=$("#dlgHintBox"); if(!box) return;
    box.classList.remove("hidden","ok","no"); box.classList.add("ok");
    box.innerHTML="💡 Useful phrases:<br/>" + d.hintPhrases.map(p => `• ${escapeHtml(p)}`).join("<br/>");
  }
  function setPracticeRole(side){
    dlgState.role=side;
    const a=$("#roleA"), b=$("#roleB");
    if(a && b){
      if(side==="a"){
        a.classList.add("is-on"); b.classList.remove("is-on");
        a.setAttribute("aria-pressed","true"); b.setAttribute("aria-pressed","false");
      }else{
        b.classList.add("is-on"); a.classList.remove("is-on");
        b.setAttribute("aria-pressed","true"); a.setAttribute("aria-pressed","false");
      }
    }
  }

  // Debate + conversation
    function renderDebateBox(){
    const host=$("#debateBox"); if(!host) return;
    host.innerHTML="";
    DEBATE_LINES.forEach(l => {
      const row=document.createElement("div");
      row.className="line";
      row.innerHTML=`<div class="ico">${l.ico}</div><div><strong>${escapeHtml(l.text.split(" / ")[0])}</strong><br/><span class="muted">${escapeHtml(l.text)}</span></div>`;
      host.appendChild(row);
    });
  }
  function debateMission(){
    const fb=$("#debateFb"); if(!fb) return;
    fb.classList.remove("hidden","ok","no"); fb.classList.add("ok");
    fb.innerHTML="🎯 Mission: Say this out loud (then click again to score):<br/><br/>" +
      "“In my opinion, Banff is more scenic than Toronto; however, Montréal is cheaper.”<br/><br/>" +
      "<span class='muted'>Click 🎯 Mission again after you say it to earn points.</span>";
    if(!debateMission._armed){ debateMission._armed=true; return; }
    Score.award("debate:mission", 3);
    fb.innerHTML="✅ Great job! You used an opinion + a connector + a comparison.";
  }
  debateMission._armed=false;

  function renderPlaceSelects(){
    const a=$("#convPlace"), b=$("#convOther");
    if(!a || !b) return;
    a.innerHTML=""; b.innerHTML="";
    PLACES.forEach(p => {
      const o1=document.createElement("option"); o1.value=p.label; o1.textContent=p.label;
      const o2=document.createElement("option"); o2.value=p.label; o2.textContent=p.label;
      a.appendChild(o1); b.appendChild(o2);
    });
    a.value="Montréal"; b.value="Banff";
  }
  function buildConversationText(){
    const place=$("#convPlace")?.value || "Montréal";
    const date=$("#convDate")?.value || "on Friday";
    const time=$("#convTime")?.value || "at 2 pm";
    const style=$("#convStyle")?.value || "relaxing";
    const conn=$("#convConnector")?.value || "because";
    const comp=$("#convCompare")?.value || "better than";
    const other=$("#convOther")?.value || "Banff";
    return `A: How about we go to ${place} ${date}?\n` +
           `B: That sounds good. What time should we leave?\n` +
           `A: Let’s leave ${time}. I think it is a ${style} trip ${conn} it has a great atmosphere.\n` +
           `B: I agree. ${place} is ${comp} ${other} for us.`;
  }
  function renderConvChecklist(text){
    const host=$("#convChecklist"); if(!host) return false;
    const checks=[
      {label:"Suggestion (How about…?)", test:/how about/i},
      {label:"Time (at …)", test:/\bat\s+\d/i},
      {label:"Reason (because/however/also/so)", test:/\bbecause\b|\bhowever\b|\balso\b|\bso\b/i},
      {label:"Comparison (… than)", test:/\bthan\b/i}
    ];
    host.innerHTML="";
    checks.forEach(c => {
      const ok=c.test.test(text);
      const div=document.createElement("div");
      div.className="checkitem " + (ok ? "ok" : "no");
      div.textContent=(ok ? "✅ " : "❌ ") + c.label;
      host.appendChild(div);
    });
    return checks.every(c => c.test.test(text));
  }

  // ---------- Init ----------
  function init(){
    setVoice("en-US");
    AudioMode.load();
    syncAutoButtons();
    if(localStorage.getItem(AudioMode.key) === null) setAutoAudio(false);

    // Vocab
    renderVocabSets();
    renderFlashcards(false);
    buildVocabQuiz();
    safeOn("#vocabSet","change", () => { renderFlashcards(false); buildVocabQuiz(); });
    safeOn("#btnVocabShuffle","click", () => renderFlashcards(true));
    safeOn("#btnVocabQuiz","click", () => buildVocabQuiz());
    safeOn("#btnVocabQuizReset","click", () => buildVocabQuiz());
    safeOn("#btnVocabQuizSpeak","click", () => {
      if(!vocabQuizState.q) return;
      Speech.say(`${vocabQuizState.q.word}. ${vocabQuizState.q.ex}`);
    });

    // Reading
    renderReading();
    const readingAPI = makeMCQ($("#readingQuizHost"), readingQuestions, "read");
    safeOn("#btnReadQuizReset","click", () => readingAPI.reset());
    safeOn("#btnReadSpeak","click", () => Speech.say(READING_TEXT));
    safeOn("#btnReadSlow","click", () => { Speech.rate=0.86; });
    safeOn("#btnReadNormal","click", () => { Speech.rate=0.97; });

    // Grammar: tenses
    renderLesson("#tenseLesson", TENSE_LESSON_LINES);
    const tenseMCQAPI = makeMCQ($("#tenseMCQHost"), tenseMCQ, "tense");
    const tenseFillAPI = buildFill($("#tenseFillHost"), tenseFill, "tenseFill");
    safeOn("#btnTenseReset","click", () => { tenseMCQAPI.reset(); tenseFillAPI.reset(); });
    safeOn("#btnTenseSpeak","click", () => Speech.say(TENSE_SUMMARY));

    // Grammar: comparatives
    renderLesson("#compLesson", COMP_LESSON_LINES);
    const compMCQAPI = makeMCQ($("#compMCQ2Host"), compMCQ2, "comp2");
    const compFillAPI = buildFill($("#compFillHost"), compFill, "compFill");
    const compBuilderAPI = buildWordOrder($("#compBuilderHost"), compBuilderItems, "compBuild2");
    safeOn("#btnCompReset","click", () => { compMCQAPI.reset(); compFillAPI.reset(); compBuilderAPI.reset(); });
    safeOn("#btnCompSpeak","click", () => Speech.say(COMP_SUMMARY));

    // Dialogues
    renderDlgSelect();
    setDlgTitle();
    clearChat();
    setPracticeRole("b");
    safeOn("#dlgSelect","change", (e) => { dlgState.key=e.target.value; setDlgTitle(); clearChat(); });
    safeOn("#btnDlgPlay","click", () => playDialogue());
    safeOn("#btnDlgStep","click", () => stepDialogue());
    safeOn("#btnDlgClear","click", () => clearChat());
    safeOn("#btnDlgListenAll","click", () => listenAllDialogue());
    safeOn("#btnDlgHint","click", () => showDlgHints());
    safeOn("#roleA","click", () => setPracticeRole("a"));
    safeOn("#roleB","click", () => setPracticeRole("b"));

    // Listening missions
    const listenAPI = makeMCQ($("#listenHost"), LISTEN_MISSIONS, "listen");
    safeOn("#btnListenReset","click", () => listenAPI.reset());

    // Speaking builders
    const speakAPI = buildWordOrder($("#speakBuilderHost"), SPEAK_BUILDER, "speak");
    safeOn("#btnSpeakBuilderReset","click", () => speakAPI.reset());

    // Debate
    renderDebateBox();
    safeOn("#btnDebateSpeak","click", () => Speech.say(DEBATE_TEXT));
    safeOn("#btnDebateHint","click", () => {
      const fb=$("#debateFb"); if(!fb) return;
      fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
      fb.innerHTML="💡 Use this order: <strong>Opinion</strong> → <strong>Because</strong> → <strong>However</strong> → <strong>Comparison</strong>.";
    });
    safeOn("#btnDebateMission","click", () => debateMission());

    // Conversation builder
    renderPlaceSelects();
    safeOn("#btnConvBuild","click", () => {
      const out=$("#convOutput"); if(!out) return;
      out.value=buildConversationText();
      renderConvChecklist(out.value);
    });
    safeOn("#btnConvHint","click", () => {
      const fb=$("#convFb"); if(!fb) return;
      fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
      fb.innerHTML="💡 Build 4 lines: suggestion → question → plan with time → comparison.";
    });
    safeOn("#btnConvCheck","click", () => {
      const out=$("#convOutput"); const fb=$("#convFb");
      if(!out || !fb) return;
      const okAll=renderConvChecklist(out.value || "");
      fb.classList.remove("hidden","ok","no");
      if(okAll){ fb.classList.add("ok"); fb.textContent="✅ Excellent mini conversation!"; Score.award("conv:complete", 5); }
      else { fb.classList.add("no"); fb.textContent="❌ Not yet. Add the missing parts (see checklist)."; }
    });
    safeOn("#btnConvSpeak","click", () => Speech.say(($("#convOutput")?.value || "").replaceAll("\n"," ")));
    safeOn("#btnConvCopy","click", async () => { try{ await navigator.clipboard.writeText($("#convOutput")?.value || ""); }catch(e){} });
    safeOn("#btnConvReset","click", () => { const out=$("#convOutput"); if(out) out.value=""; const fb=$("#convFb"); if(fb) fb.classList.add("hidden"); const cl=$("#convChecklist"); if(cl) cl.innerHTML=""; });

    // Reset all
    safeOn("#btnResetAll","click", () => {
      if(!confirm("Reset ALL activities and score?")) return;
      Speech.stop();
      Score.reset();

      $("#vocabSet").value="hotel";
      renderFlashcards(false);
      buildVocabQuiz();

      readingAPI.reset();
      tenseMCQAPI.reset(); tenseFillAPI.reset();
      compMCQAPI.reset(); compFillAPI.reset(); compBuilderAPI.reset();

      dlgState.key="hotel";
      $("#dlgSelect").value="hotel";
      setDlgTitle(); clearChat(); setPracticeRole("b");

      listenAPI.reset();
      speakAPI.reset();

      debateMission._armed=false;
      const dFb=$("#debateFb"); if(dFb) dFb.classList.add("hidden");
      const out=$("#convOutput"); if(out) out.value="";
      const cfb=$("#convFb"); if(cfb) cfb.classList.add("hidden");
      const cl=$("#convChecklist"); if(cl) cl.innerHTML="";
      $("#top")?.scrollIntoView({behavior:"smooth"});
    });

    // Score max
    const max =
      20 +
      readingQuestions.length +
      tenseMCQ.length +
      tenseFill.length +
      compMCQ2.length +
      compFill.length +
      (compBuilderItems.length*2) +
      LISTEN_MISSIONS.length +
      (SPEAK_BUILDER.length*2) +
      3 + 5;
    Score.setMax(max);
  }

  

// Self-check helper (DevTools: __ccsSelfCheck())
window.__ccsSelfCheck = function(){
  const missing=[];
  ["vocabSet","vocabGrid","readingText","dlgSelect","listenHost","speakBuilderHost"].forEach(id=>{
    if(!document.getElementById(id)) missing.push(id);
  });
  return {
    build: window.__ccsBuild || "FIX-20260318-003626",
    autoAudio: (localStorage.getItem("ccs_autoAudio_v2") === "1"),
    missingIds: missing,
    speechSupported: !!window.speechSynthesis
  };
};

init();
})();