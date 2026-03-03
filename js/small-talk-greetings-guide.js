(() => {
  "use strict";
  const LS_KEY = "set_small_talk_greetings_v1";
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const state = loadState();

  function loadState(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(raw){
        const o = JSON.parse(raw);
        return {
          level: o.level || "A2",
          context: o.context || "work",
          fr: o.fr !== false,
          tab: o.tab || "guide",
          cat: o.cat || "all",
          query: o.query || "",
          fav: Array.isArray(o.fav) ? o.fav : [],
          dlg: o.dlg || {},
          phone: o.phone || {}
        };
      }
    }catch(e){}
    return { level:"A2", context:"work", fr:true, tab:"guide", cat:"all", query:"", fav:[], dlg:{}, phone:{} };
  }

  function saveState(){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(e){}
    const el = $("#saveState");
    if(el){
      el.textContent = "Saved ✓";
      el.style.opacity = "1";
      setTimeout(()=>{ el.style.opacity = ".75"; }, 900);
    }
  }

  function setFR(on){
    state.fr = !!on;
    $("#frState").textContent = state.fr ? "ON" : "OFF";
    $("#toggleFR").setAttribute("aria-pressed", state.fr ? "true" : "false");
    $$(".fr").forEach(el => el.style.display = state.fr ? "" : "none");
    saveState();
    // rerender phrase grids because they contain FR labels
    renderABC();
    renderRules();
    renderPrintable();
  }

  function speak(text){
    try{
      if(!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.98;
      const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
      const prefer = ["en-US","en-GB"];
      let v = null;
      for(const tag of prefer){
        v = voices.find(x => (x.lang||"").toLowerCase() === tag.toLowerCase());
        if(v) break;
      }
      if(!v) v = voices.find(x => (x.lang||"").toLowerCase().startsWith("en"));
      if(v) u.voice = v;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }

  function copyText(text){
    if(!text) return;
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(()=> toast(state.fr ? "Copié ✓" : "Copied ✓")).catch(()=> fallbackCopy(text));
    }else fallbackCopy(text);
  }
  function fallbackCopy(text){
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try{ document.execCommand("copy"); toast(state.fr ? "Copié ✓" : "Copied ✓"); }catch(e){}
    ta.remove();
  }
  function toast(msg){
    const el = document.createElement("div");
    el.textContent = msg;
    el.style.position = "fixed";
    el.style.left = "50%";
    el.style.bottom = "16px";
    el.style.transform = "translateX(-50%)";
    el.style.padding = "10px 12px";
    el.style.borderRadius = "999px";
    el.style.background = "rgba(255,255,255,.92)";
    el.style.border = "1px solid rgba(179,139,63,.28)";
    el.style.boxShadow = "0 16px 30px rgba(0,0,0,.10)";
    el.style.fontWeight = "900";
    el.style.zIndex = "999";
    document.body.appendChild(el);
    setTimeout(()=>{ el.style.opacity="0"; el.style.transition="opacity .35s"; }, 900);
    setTimeout(()=>{ el.remove(); }, 1400);
  }

  function normalize(s){ return (s||"").toLowerCase().replace(/\s+/g," ").trim(); }
  function escapeHTML(s){ return (s||"").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c])); }
  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }
  function pick(arr){
    if(!arr || !arr.length) return "";
    const v = arr[Math.floor(Math.random()*arr.length)];
    return Array.isArray(v) ? v : v;
  }

  // ---------- DATA ----------
  const contexts = {
    street: {icon:"🚶", title:"Street / casual", register:"casual", notesEN:"Short, friendly, no long introductions.", notesFR:"Court, sympa, pas de long discours."},
    phone:  {icon:"📞", title:"Phone call", register:"semi-formal", notesEN:"Say your name, reason, and check if it’s a good time.", notesFR:"Nom, raison, vérifier si c’est un bon moment."},
    work:   {icon:"💼", title:"Work", register:"semi-formal", notesEN:"Polite, clear, short. Avoid very personal topics.", notesFR:"Poli, clair, court. Éviter le trop personnel."},
    hotel:  {icon:"🏨", title:"Hotel / service", register:"formal", notesEN:"More formal: ‘Good morning’, ‘How may I help you?’", notesFR:"Plus formel : ‘Good morning’, ‘How may I help you?’"},
    friend: {icon:"🧑‍🤝‍🧑", title:"Friend", register:"casual", notesEN:"Relaxed: ‘Hey!’ ‘What’s up?’", notesFR:"Détendu : ‘Hey!’ ‘What’s up?’"}
  };

  const phraseBanks = {
    acknowledge: {
      street: {
        A1: [["Hi!", "Salut !"], ["Hello!", "Bonjour !"], ["Good morning!", "Bonjour (matin)"]],
        A2: [["Hi there!", "Salut !"], ["Hey — how’s it going?", "Salut, ça va ?"], ["Good to see you!", "Ravi de te voir !"]],
        B1: [["Hey! Fancy seeing you here.", "Tiens, quelle surprise."], ["Morning! How’s your day going so far?", "Comment se passe ta journée ?"]]
      },
      phone: {
        A1: [["Hello, this is ___ .", "Bonjour, c’est ___ ."], ["Hi, I’m calling about ___ .", "J’appelle au sujet de ___ ."]],
        A2: [["Hello, this is ___ speaking.", "Bonjour, ___ à l’appareil."], ["Hi, this is ___ . Is this a good time?", "Est-ce un bon moment ?"]],
        B1: [["Hello, this is ___ from ___. May I speak with ___?", "Puis-je parler à ___ ?"], ["Good morning, this is ___ . I’m calling regarding ___ .", "J’appelle concernant ___ ."]]
      },
      work: {
        A1: [["Good morning!", "Bonjour !"], ["Hi, how are you?", "Comment ça va ?"]],
        A2: [["Morning! How’s it going?", "Salut, ça va ?"], ["Hi! Nice to see you.", "Ravi(e) de te voir."]],
        B1: [["Good morning. How are you today?", "Comment allez-vous aujourd’hui ?"], ["Hi — how have you been?", "Comment vas-tu depuis ?"]]
      },
      hotel: {
        A1: [["Good morning.", "Bonjour."], ["Hello. How can I help?", "Comment puis-je aider ?"]],
        A2: [["Good afternoon. How may I help you?", "Comment puis-je vous aider ?"], ["Welcome. Do you have a reservation?", "Vous avez une réservation ?"]],
        B1: [["Good evening. How may I assist you today?", "Comment puis-je vous aider aujourd’hui ?"], ["Welcome. May I have your last name, please?", "Votre nom, s’il vous plaît ?"]]
      },
      friend: {
        A1: [["Hey!", "Salut !"], ["Hi!", "Coucou !"]],
        A2: [["Hey! What’s up?", "Quoi de neuf ?"], ["Hi! Long time no see!", "Ça fait longtemps !"]],
        B1: [["Hey! How have you been lately?", "Comment tu vas ces temps-ci ?"], ["Hi! It’s been a while — what’s new?", "Ça fait un moment — quoi de neuf ?"]]
      }
    },

    bridge: {
      street: {
        A1: [["Nice weather today.", "Il fait beau aujourd’hui."], ["It’s cold today.", "Il fait froid aujourd’hui."]],
        A2: [["Beautiful day, isn’t it?", "Belle journée, non ?"], ["Traffic is crazy today.", "Le trafic est dingue aujourd’hui."]],
        B1: [["Looks like spring is finally here.", "On dirait que le printemps arrive."], ["I heard the traffic is terrible this morning.", "J’ai entendu que le trafic est terrible."]]
      },
      phone: {
        A1: [["I’m calling about an appointment.", "J’appelle pour un rendez-vous."], ["I have a question.", "J’ai une question."]],
        A2: [["I’m calling to confirm our appointment.", "J’appelle pour confirmer le rendez-vous."], ["I’m calling about a reservation.", "J’appelle pour une réservation."]],
        B1: [["I’m calling to follow up on our last conversation.", "Je fais un suivi."], ["I’m calling regarding the schedule for next week.", "Concernant le planning."]]
      },
      work: {
        A1: [["How’s your day?", "Ta journée ?"], ["Busy today?", "Chargé aujourd’hui ?"]],
        A2: [["How’s work going?", "Comment ça se passe au travail ?"], ["Are you heading to a meeting?", "Tu vas à une réunion ?"]],
        B1: [["How’s everything going on your side?", "Comment ça va de ton côté ?"], ["How’s the project going this week?", "Comment avance le projet ?"]]
      },
      hotel: {
        A1: [["How was your trip?", "Bon voyage ?"], ["Do you need help with your bags?", "Besoin d’aide avec vos bagages ?"]],
        A2: [["Did you have a good flight?", "Bon vol ?"], ["Are you here for business or pleasure?", "Business ou vacances ?"]],
        B1: [["I hope you had a smooth journey.", "J’espère que le voyage s’est bien passé."], ["Let me know if you need anything during your stay.", "N’hésitez pas si besoin."]]
      },
      friend: {
        A1: [["How are you?", "Ça va ?"], ["How’s it going?", "Ça va ?"]],
        A2: [["How have you been?", "Comment tu vas depuis ?"], ["How was your weekend?", "Ton week-end ?"]],
        B1: [["What have you been up to recently?", "Qu’est-ce que tu as fait récemment ?"], ["How’s life treating you these days?", "Comment va la vie en ce moment ?"]]
      }
    },

    close: {
      street: {
        A1: [["Have a nice day!", "Bonne journée !"], ["See you!", "À bientôt !"]],
        A2: [["Take care!", "Prends soin de toi."], ["Good to see you — see you soon.", "Ravi de te voir — à bientôt."]],
        B1: [["Anyway, I’ll let you go — have a great day.", "Je te laisse — bonne journée."]]
      },
      phone: {
        A1: [["Thank you. Goodbye.", "Merci, au revoir."], ["See you then.", "À bientôt."]],
        A2: [["Thanks — see you on Tuesday.", "Merci — à mardi."], ["Great. I’ll confirm by email. Bye!", "Je confirme par email."]],
        B1: [["Perfect — I’ll send a quick confirmation email. Thanks for your time.", "Je vous envoie une confirmation."]]
      },
      work: {
        A1: [["See you later.", "À plus tard."], ["Have a good one.", "Bonne journée."]],
        A2: [["Catch you later.", "À tout à l’heure."], ["Good luck with your meeting!", "Bonne réunion !"]],
        B1: [["I’ll let you get back to it — talk soon.", "Je te laisse — à bientôt."]]
      },
      hotel: {
        A1: [["Enjoy your stay.", "Bon séjour."], ["Have a nice day.", "Bonne journée."]],
        A2: [["If you need anything, please let us know.", "Dites-nous si besoin."], ["Have a wonderful evening.", "Bonne soirée."]],
        B1: [["Please don’t hesitate to contact us if you need anything.", "N’hésitez pas à nous contacter."]]
      },
      friend: {
        A1: [["See you soon!", "À bientôt !"], ["Bye!", "Salut !"]],
        A2: [["Text me later!", "Envoie-moi un message !"], ["Talk soon!", "On se parle vite !"]],
        B1: [["Let’s catch up properly soon — message me.", "On se cale ça bientôt — écris-moi."]]
      }
    }
  };

  const vocab = [
    {id:"gm",cat:"greetings",icon:"☀️",en:"Good morning",fr:"Bonjour (matin)",ex:"Good morning! How are you today?"},
    {id:"ga",cat:"greetings",icon:"🌤️",en:"Good afternoon",fr:"Bonjour (après-midi)",ex:"Good afternoon. Do you have a reservation?"},
    {id:"ge",cat:"greetings",icon:"🌙",en:"Good evening",fr:"Bonsoir",ex:"Good evening. How may I help you?"},
    {id:"hi",cat:"greetings",icon:"👋",en:"Hi / Hello",fr:"Salut / Bonjour",ex:"Hi! Nice to see you."},
    {id:"hey",cat:"greetings",icon:"😄",en:"Hey",fr:"Salut (familier)",ex:"Hey! What’s up?"},
    {id:"nice",cat:"greetings",icon:"🤝",en:"Nice to meet you",fr:"Enchanté(e)",ex:"Nice to meet you — I’m Alex."},
    {id:"goodsee",cat:"greetings",icon:"✨",en:"Good to see you",fr:"Ravi de te voir",ex:"Good to see you! How’s work going?"},

    {id:"weather",cat:"smalltalk",icon:"🌦️",en:"How’s the weather?",fr:"Comment est la météo ?",ex:"How’s the weather where you are?"},
    {id:"niceout",cat:"smalltalk",icon:"🌞",en:"Nice day, isn’t it?",fr:"Belle journée, non ?",ex:"Nice day, isn’t it?"},
    {id:"traffic",cat:"smalltalk",icon:"🚗",en:"Traffic is heavy",fr:"Il y a du trafic",ex:"Traffic is heavy this morning."},
    {id:"weekend",cat:"smalltalk",icon:"🗓️",en:"How was your weekend?",fr:"Ton week-end ?",ex:"How was your weekend?"},
    {id:"plans",cat:"smalltalk",icon:"🧭",en:"Any plans for today?",fr:"Des plans pour aujourd’hui ?",ex:"Any plans for today?"},
    {id:"news",cat:"smalltalk",icon:"📰",en:"Did you hear the news?",fr:"Tu as entendu les infos ?",ex:"Did you hear the news about the storm?"},

    {id:"fine",cat:"responses",icon:"✅",en:"I’m good, thanks. And you?",fr:"Ça va, merci. Et toi ?",ex:"I’m good, thanks. And you?"},
    {id:"busy",cat:"responses",icon:"⏳",en:"Pretty busy lately.",fr:"Plutôt occupé(e) récemment.",ex:"Pretty busy lately — you?"},
    {id:"notbad",cat:"responses",icon:"🙂",en:"Not bad at all.",fr:"Pas mal du tout.",ex:"Not bad at all. How about you?"},
    {id:"cant",cat:"responses",icon:"⚡",en:"Can’t complain.",fr:"Je ne peux pas me plaindre.",ex:"Can’t complain. And you?"},
    {id:"tired",cat:"responses",icon:"😴",en:"A bit tired today.",fr:"Un peu fatigué(e) aujourd’hui.",ex:"A bit tired today, but okay."},

    {id:"thisis",cat:"phone",icon:"📞",en:"This is ___ speaking.",fr:"___ à l’appareil.",ex:"Hello, this is Maria speaking."},
    {id:"calling",cat:"phone",icon:"☎️",en:"I’m calling about…",fr:"J’appelle au sujet de…",ex:"I’m calling about a reservation."},
    {id:"goodtime",cat:"phone",icon:"⏱️",en:"Is this a good time?",fr:"Est-ce un bon moment ?",ex:"Is this a good time to talk?"},
    {id:"hold",cat:"phone",icon:"⏳",en:"Can you hold for a moment?",fr:"Pouvez-vous patienter ?",ex:"Can you hold for a moment, please?"},

    {id:"meeting",cat:"work",icon:"📅",en:"Are you heading to a meeting?",fr:"Tu vas à une réunion ?",ex:"Are you heading to a meeting now?"},
    {id:"project",cat:"work",icon:"🧩",en:"How’s the project going?",fr:"Comment avance le projet ?",ex:"How’s the project going this week?"},
    {id:"catch",cat:"work",icon:"🔁",en:"Let’s catch up.",fr:"On se fait un point.",ex:"Let’s catch up later this week."},

    {id:"help",cat:"hotel",icon:"🧾",en:"How may I help you?",fr:"Comment puis-je vous aider ?",ex:"How may I help you today?"},
    {id:"reservation",cat:"hotel",icon:"🛎️",en:"Do you have a reservation?",fr:"Vous avez une réservation ?",ex:"Do you have a reservation under your last name?"},
    {id:"enjoy",cat:"hotel",icon:"✨",en:"Enjoy your stay.",fr:"Bon séjour.",ex:"Enjoy your stay, and let us know if you need anything."}
  ];

  const doDont = [
    {d:"Do", en:"Smile, greet, and add one friendly line.", fr:"Sourire, dire bonjour, ajouter une phrase sympa."},
    {d:"Do", en:"Answer short + ask back (And you?).", fr:"Réponse courte + question retour (And you?)."},
    {d:"Do", en:"Use safe topics (weather, traffic, weekend, plans).", fr:"Sujets safe : météo, trafic, week-end, plans."},
    {d:"Don’t", en:"Overshare personal problems with strangers.", fr:"Ne pas raconter sa vie à un inconnu."},
    {d:"Don’t", en:"Translate French expressions literally.", fr:"Ne pas traduire mot à mot."},
    {d:"Don’t", en:"Force a conversation when someone is busy.", fr:"Ne pas insister si la personne est pressée."}
  ];

  const howAreYouList = [
    {en:"How are you? → short answer + ask back.", fr:"How are you? → réponse courte + question retour."},
    {en:"How have you been? → if you haven’t seen them for a while.", fr:"How have you been? → si ça fait longtemps."},
    {en:"How’s it going? / How are things? → casual.", fr:"How’s it going? / How are things? → familier."},
    {en:"And you? / How about you? → polite return question.", fr:"And you? / How about you? → question retour."}
  ];

  const questionForms = [
    {en:"Present simple: Do you work here? / Does she work here?", fr:"Présent simple : Do/Does + verbe."},
    {en:"Present continuous: Are you heading to a meeting?", fr:"Présent continu : Am/Is/Are + -ing."},
    {en:"Present perfect: Have you been busy lately?", fr:"Present perfect : Have/Has + V3."},
    {en:"Follow-up: What about you? / How about you?", fr:"Relance : What about you? / How about you?"}
  ];

  const dialogueBlocks = [
    { key:"open", lblEN:"Opening", lblFR:"Ouverture", lines:(ctx,lvl)=> phraseBanks.acknowledge[ctx][lvl].map(x=>x[0]) },
    { key:"bridge", lblEN:"Bridge (small talk)", lblFR:"Sujet", lines:(ctx,lvl)=> phraseBanks.bridge[ctx][lvl].map(x=>x[0]) },
    { key:"how", lblEN:"How are you line", lblFR:"Comment ça va", lines:(ctx,lvl)=> ({
      A1:["How are you?","How’s it going?"],
      A2:["How are you doing?","How’s it going today?","How have you been?"],
      B1:["How have you been lately?","How are things on your side?","How’s your day going so far?"]
    }[lvl]) },
    { key:"answer", lblEN:"Answer (short + friendly)", lblFR:"Réponse", lines:(ctx,lvl)=> ({
      A1:["I’m good, thanks. And you?","Fine, thanks. And you?","Good, thanks. How about you?"],
      A2:["Pretty good, thanks. And you?","Not bad at all. How about you?","A bit busy today, but good. And you?"],
      B1:["I’m doing well, thanks. How about you?","Pretty busy lately, but I’m good. And you?","Can’t complain — how are you doing?"]
    }[lvl]) },
    { key:"close", lblEN:"Close", lblFR:"Fin", lines:(ctx,lvl)=> phraseBanks.close[ctx][lvl].map(x=>x[0]) }
  ];

  const phoneBlocks = {
    opening:{
      A1:["Hello, this is ___ .","Hi, this is ___ ."],
      A2:["Hello, this is ___ speaking.","Hello, this is ___ from ___. "],
      B1:["Good morning, this is ___ from ___. May I speak with ___?"]
    },
    reason:{
      A1:["I’m calling about an appointment.","I’m calling about a reservation."],
      A2:["I’m calling to confirm our appointment.","I’m calling about your reservation and the schedule."],
      B1:["I’m calling to follow up and confirm the next steps for next week."]
    },
    check:{
      A1:["Is this a good time?","Can you talk now?"],
      A2:["Is this a good time to talk?","Do you have two minutes right now?"],
      B1:["Is now a good time, or would you prefer I call later?"]
    },
    next:{
      A1:["Thank you. Goodbye.","See you then. Bye."],
      A2:["Great — I’ll confirm by email. Thank you.","Perfect — see you on Tuesday. Thank you."],
      B1:["Perfect — I’ll send a quick confirmation email. Thanks for your time."]
    }
  };

  const roleCards = [
    {id:"weatherCard", title:"Weather small talk", prompt:"You meet someone. Talk about weather and ask a question.", starters:["Nice day, isn’t it?","It’s freezing today.","Looks like it’s going to rain."], follow:["How’s the weather where you are?","Do you like this kind of weather?","Did you walk or drive today?"]},
    {id:"trafficCard", title:"Traffic / commute", prompt:"You arrive at work. Mention traffic and ask back.", starters:["Traffic is crazy today.","The subway is packed this morning.","I’m a bit late — traffic is heavy."], follow:["How was your commute?","Did you have any delays?","Do you usually drive or take the train?"]},
    {id:"weekendCard", title:"Weekend plans", prompt:"Ask about weekend/plans.", starters:["How was your weekend?","Any plans for today?","Do you have plans for the weekend?"], follow:["Did you do anything fun?","Are you doing anything nice this weekend?","What do you usually do on weekends?"]},
    {id:"newsCard", title:"Local news (safe)", prompt:"Comment about local news (weather/transport/events).", starters:["Did you hear the news about the storm?","I saw an alert about traffic downtown.","There’s a big event in town this weekend."], follow:["Are you affected by it?","Do you want to go?","Have you heard anything else?"]},
    {id:"hotelCard", title:"Hotel guest greeting", prompt:"Greet a guest politely and ask a safe question.", starters:["Good afternoon. How may I help you?","Welcome. Do you have a reservation?","Good evening. How was your trip?"], follow:["May I have your last name, please?","Do you need help with your bags?","Are you here for business or pleasure?"]}
  ];

  const grammarDrills = [
    {stem:"You see a colleague right now. Choose the best sentence:", options:["I work on a project this week.","I’m working on a project this week.","I have work on a project this week."], ans:"I’m working on a project this week.", why:"Now/temporary → present continuous.", fr:"Maintenant/temporaire → présent continu.", hint:"Look for ‘this week / right now’."},
    {stem:"You talk about your routine. Choose the best sentence:", options:["I’m taking the train every day.","I take the train every day.","I have take the train every day."], ans:"I take the train every day.", why:"Habit → present simple.", fr:"Habitude → présent simple.", hint:"Routine words: usually, every day."},
    {stem:"You haven’t seen your friend for months. Choose the best question:", options:["How are you?","How have you been?","How do you do?"], ans:"How have you been?", why:"Since last time → present perfect.", fr:"Depuis la dernière fois → present perfect.", hint:"Long time no see → present perfect."},
    {stem:"Choose the best quick promise (offer):", options:["I’m going to call you back.","I’ll call you back.","I calling you back."], ans:"I’ll call you back.", why:"Quick promise/offer → will (I’ll).", fr:"Promesse/offre → will (I’ll).", hint:"Promise now → I’ll."},
    {stem:"Choose the best planned action:", options:["I’ll email you tomorrow.","I’m going to email you tomorrow.","I email you tomorrow."], ans:"I’m going to email you tomorrow.", why:"Plan → going to.", fr:"Plan → going to.", hint:"Plan already decided → going to."}
  ];

  const contextQuizBank = [
    {ctx:"work", situationEN:"You see your manager in the hallway at 9 AM.", situationFR:"Tu croises ton manager à 9h.", lvlMin:"A1",
      correct:"Good morning. How are you today?", distract:["Hey! What’s up?", "Yo!", "Good night!"], whyEN:"Work + manager → more formal greeting.", whyFR:"Travail + manager → plus formel."},
    {ctx:"street", situationEN:"You pass a neighbor on the street.", situationFR:"Tu croises un voisin dans la rue.", lvlMin:"A1",
      correct:"Hi there! Nice day, isn’t it?", distract:["Good evening. How may I assist you?", "May I have your last name, please?", "Hello, this is Maria speaking."], whyEN:"Street = casual, safe weather line.", whyFR:"Rue = casual + météo safe."},
    {ctx:"hotel", situationEN:"A guest arrives at reception at 7 PM.", situationFR:"Un client arrive à la réception à 19h.", lvlMin:"A1",
      correct:"Good evening. How may I help you?", distract:["Hey! What’s up?", "Yo, come in!", "See you later!"], whyEN:"Service context → polite/formal.", whyFR:"Service → poli/formel."},
    {ctx:"phone", situationEN:"You call to confirm an appointment.", situationFR:"Tu appelles pour confirmer un rendez-vous.", lvlMin:"A1",
      correct:"Hello, this is Alex speaking. Is this a good time?", distract:["Nice day, isn’t it?", "See you later!", "Good night."], whyEN:"Phone: name + check time.", whyFR:"Téléphone : nom + vérifier disponibilité."},
    {ctx:"friend", situationEN:"You see a friend you haven’t seen for months.", situationFR:"Tu vois un ami après plusieurs mois.", lvlMin:"A2",
      correct:"Hey! How have you been?", distract:["Good afternoon. Do you have a reservation?", "Hello, this is ___ speaking.", "Nice day, isn’t it?"], whyEN:"Long time → ‘How have you been?’", whyFR:"Longtemps → ‘How have you been?’"}
  ];

  const answerQuizBank = [
    {q:"How are you?", correct:"Pretty good, thanks. And you?", distract:["I am 35 years old.", "I’m from France.", "Yes, I am."], whyEN:"Short + friendly + ask back.", whyFR:"Court + sympa + question retour."},
    {q:"How’s it going?", correct:"Not bad at all. How about you?", distract:["I go to the office.", "It is a book.", "I’m agree."], whyEN:"Natural answer + return question.", whyFR:"Réponse naturelle + relance."},
    {q:"How have you been?", correct:"Pretty busy lately — and you?", distract:["I’m going to Tuesday.", "I assist to the meeting.", "I have 2 brothers."], whyEN:"Present perfect idea: lately/recently.", whyFR:"Idée de recent: lately."},
    {q:"What’s up?", correct:"Not much — just heading to work. You?", distract:["I’m fine thank you and you?", "I am an event.", "We are in delay."], whyEN:"Casual: ‘Not much’ works.", whyFR:"Casual : ‘Not much’."}
  ];

  const fillDialogs = [
    {id:"fd1", ctx:"work", level:"A1",
      lines:[["A:","Good morning! How","__","you?"],["B:","I’m good,","__",". And you?"],["A:","Pretty good. Busy today?"]],
      answers:["are","thanks"],
      hintEN:"Hint: ‘How ___ you?’ → are. ‘I’m good, ___’ → thanks.",
      hintFR:"Indice : ‘How ___ you?’ → are. ‘I’m good, ___’ → thanks."
    },
    {id:"fd2", ctx:"street", level:"A2",
      lines:[["A:","Hi there! Nice day,","__","it?"],["B:","Yeah, it’s great. How’s your day","__","?"],["A:","Good — just running errands."]],
      answers:["isn’t","going"],
      hintEN:"Hint: tag question: isn’t it? / How’s … going?",
      hintFR:"Indice : question tag : isn’t it? / How’s … going?"
    },
    {id:"fd3", ctx:"phone", level:"A2",
      lines:[["A:","Hello, this is Maria","__","."],["A:","I’m calling","__","an appointment."],["B:","Sure — go ahead."]],
      answers:["speaking","about"],
      hintEN:"Hint: ‘This is … speaking.’ / ‘calling about…’",
      hintFR:"Indice : ‘… speaking’ / ‘calling about’"
    }
  ];

  const tapOrderBank = [
    {id:"to1", ctx:"work", level:"A1",
      correct:["Morning! How’s it going?","Pretty good, thanks. And you?","Not bad — busy today.","Same here. See you later!"],
      hintEN:"Hint: start with a greeting. End with a closing.",
      hintFR:"Indice : on commence par la salutation, on termine par la fin."
    },
    {id:"to2", ctx:"hotel", level:"A2",
      correct:["Good evening. How may I help you?","Hi — I have a reservation under Martin.","Great. May I have your ID, please?","Of course. Here you go."],
      hintEN:"Hint: staff greets first. Guest gives reason second.",
      hintFR:"Indice : le staff commence. Le client explique ensuite."
    },
    {id:"to3", ctx:"friend", level:"A2",
      correct:["Hey! Long time no see!","I know! How have you been?","Pretty busy lately — you?","Same! Let’s catch up soon."],
      hintEN:"Hint: ‘long time’ → ‘How have you been?’",
      hintFR:"Indice : ‘long time’ → ‘How have you been?’"
    }
  ];

  // ---------- RENDER ----------
  function init(){
    $("#levelSelect").value = state.level;
    $("#contextSelect").value = state.context;

    $("#levelSelect").addEventListener("change", e=>{ state.level = e.target.value; saveState(); renderAll(); });
    $("#contextSelect").addEventListener("change", e=>{ state.context = e.target.value; saveState(); renderAll(); });

    $("#toggleFR").addEventListener("click", ()=> setFR(!state.fr));
    $("#btnPrint").addEventListener("click", ()=> window.print());
    $("#btnReset").addEventListener("click", ()=>{ localStorage.removeItem(LS_KEY); location.reload(); });

    // Tabs + jumps
    $$(".tab").forEach(btn => btn.addEventListener("click", ()=> openTab(btn.getAttribute("data-tab"))));
    $$("[data-jump]").forEach(b => b.addEventListener("click", ()=> openTab(b.getAttribute("data-jump"))));

    // Vocab controls
    $("#searchVocab").value = state.query;
    $("#searchVocab").addEventListener("input", e=>{ state.query = (e.target.value||"").trim(); saveState(); renderVocab(); });
    $$(".segBtn").forEach(b=> b.addEventListener("click", ()=>{
      $$(".segBtn").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      state.cat = b.getAttribute("data-cat");
      saveState();
      renderVocab();
    }));

    // Hero formula
    $("#formulaNew").addEventListener("click", ()=> newFormula());
    $("#formulaListen").addEventListener("click", ()=> speak($("#formulaFeedback").dataset.lastSpeak || ""));
    $("#formulaCopy").addEventListener("click", ()=> copyText($("#formulaFeedback").dataset.lastSpeak || ""));

    // Topic spinner
    $("#topicSpin").addEventListener("click", ()=> spinTopic());
    $("#topicListen").addEventListener("click", ()=> speak($("#topicOut").dataset.lastSpeak || ""));

    // Grammar drill
    $("#drillNew").addEventListener("click", ()=> newGrammarDrill());
    $("#drillHint").addEventListener("click", ()=> setFeedback("#drillFeedback","neutral", state.fr ? drillHintFR() : drillHintEN()));
    $("#drillListen").addEventListener("click", ()=> speak($("#drillFeedback").dataset.lastSpeak || ""));

    // Dialogue builder
    $("#dlgCopy").addEventListener("click", ()=> copyText(currentDialogueText()));
    $("#dlgListen").addEventListener("click", ()=> speak(currentDialogueText()));
    $("#dlgNew").addEventListener("click", ()=> randomDialogue());

    // Phone builder
    $("#phoneCopy").addEventListener("click", ()=> copyText(currentPhoneText()));
    $("#phoneListen").addEventListener("click", ()=> speak(currentPhoneText()));
    $("#phoneModel").addEventListener("click", ()=> showPhoneModel());

    // Role cards
    $("#roleListen").addEventListener("click", ()=> speak($("#roleOut").dataset.lastSpeak || ""));

    // Practice
    $("#cqNew").addEventListener("click", ()=> newContextQuiz());
    $("#cqHint").addEventListener("click", ()=> setFeedback("#cqFeedback","neutral", state.fr ? cqHintFR() : cqHintEN()));

    $("#aqNew").addEventListener("click", ()=> newAnswerQuiz());
    $("#aqHint").addEventListener("click", ()=> setFeedback("#aqFeedback","neutral", state.fr ? aqHintFR() : aqHintEN()));

    $("#fdNew").addEventListener("click", ()=> newFillDialog());
    $("#fdHint").addEventListener("click", ()=> setFeedback("#fdFeedback","neutral", currentFill ? (state.fr ? currentFill.hintFR : currentFill.hintEN) : (state.fr ? "Indice : regarde la structure." : "Hint: look at the structure.")));
    $("#fdReset").addEventListener("click", ()=> resetFillInputs());

    $("#toNew").addEventListener("click", ()=> newTapOrder());
    $("#toHint").addEventListener("click", ()=> setFeedback("#toFeedback","neutral", currentTO ? (state.fr ? currentTO.hintFR : currentTO.hintEN) : (state.fr ? "Indice : salut au début, fin à la fin." : "Hint: greeting first, closing last.")));
    $("#toReset").addEventListener("click", ()=> resetTapOrder());

    renderAll();
    setFR(state.fr);
    openTab(state.tab, true);
  }

  function openTab(name, silent){
    state.tab = name;
    saveState();
    $$(".tab").forEach(b=>b.classList.toggle("active", b.getAttribute("data-tab")===name));
    $$(".panel").forEach(p=>p.classList.remove("show"));
    $("#tab-"+name).classList.add("show");
    if(!silent) window.scrollTo({top:0, behavior:"smooth"});
  }

  function setFeedback(sel, mode, text){
    const fb = $(sel);
    fb.className = "feedback" + (mode==="good" ? " good" : mode==="bad" ? " bad" : "");
    fb.textContent = text;
  }

  // ---------- HERO FORMULA ----------
  function newFormula(){
    const ctx = state.context;
    const lvl = state.level;
    const A = pick(phraseBanks.acknowledge[ctx][lvl]);
    const B = pick(phraseBanks.bridge[ctx][lvl]);
    const C = pick(phraseBanks.close[ctx][lvl]);

    const formula = [
      {tag:"A", text:A[0], fr:A[1]},
      {tag:"B", text:B[0], fr:B[1]},
      {tag:"C", text:C[0], fr:C[1]}
    ];
    const box = $("#formulaBox");
    box.innerHTML = "";
    formula.forEach(x=>{
      const div = document.createElement("div");
      div.className = "mapItem";
      div.innerHTML = `<div class="mapTag">${x.tag}</div><div class="mapText">${escapeHTML(x.text)}${state.fr ? `<div class="small fr" style="display:block;margin-top:6px">FR: ${escapeHTML(x.fr)}</div>` : ""}</div>`;
      box.appendChild(div);
    });

    const last = formula.map(x=>x.text).join(" ");
    $("#formulaFeedback").dataset.lastSpeak = last;
    setFeedback("#formulaFeedback","neutral", state.fr ? "✅ Exemple prêt. Écoute, puis répète 3 fois." : "✅ Example ready. Listen, then repeat 3 times.");
  }

  // ---------- ABC grids ----------
  function renderABC(){
    renderPhraseGrid("#ackGrid", phraseBanks.acknowledge[state.context][state.level]);
    renderPhraseGrid("#bridgeGrid", phraseBanks.bridge[state.context][state.level]);
    renderPhraseGrid("#closeGrid", phraseBanks.close[state.context][state.level]);
  }
  function renderPhraseGrid(rootSel, pairs){
    const root = $(rootSel);
    root.innerHTML = "";
    pairs.forEach((p)=>{
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "phraseBtn";
      btn.innerHTML = `${escapeHTML(p[0])}${state.fr ? `<small class="fr" style="display:block">FR: ${escapeHTML(p[1])}</small>` : ""}`;
      btn.addEventListener("click", ()=>{
        $$(".phraseBtn", root).forEach(x=>x.classList.remove("active"));
        btn.classList.add("active");
      });
      root.appendChild(btn);
    });
  }

  function renderRules(){
    const c = contexts[state.context];
    const root = $("#contextRules");
    root.innerHTML = "";

    const blocks = [
      {t:"Register", en:`${c.icon} ${c.title} → ${c.register}`, fr:`${c.icon} ${c.title} → registre : ${c.register}`},
      {t:"Keep it short", en:c.notesEN, fr:c.notesFR},
      {t:"Safe bridges", en:"Weather, traffic, weekend, plans, local events.", fr:"Météo, trafic, week-end, plans, événements locaux."},
      {t:"Exit line", en:"If they look busy: ‘I’ll let you go.’", fr:"Si la personne est pressée : ‘I’ll let you go.’"}
    ];
    blocks.forEach(b=>{
      const div = document.createElement("div");
      div.className = "rule";
      div.innerHTML = `<div class="ruleTitle">${escapeHTML(b.t)}</div>
        <div class="ruleText">${escapeHTML(b.en)}${state.fr ? `<div class="small fr" style="display:block;margin-top:6px">FR: ${escapeHTML(b.fr)}</div>` : ""}</div>`;
      root.appendChild(div);
    });

    const dd = $("#doDont");
    dd.innerHTML = "";
    doDont.forEach(item=>{
      const li = document.createElement("li");
      li.innerHTML = `<b>${escapeHTML(item.d)}:</b> ${escapeHTML(item.en)}${state.fr ? ` <span class="fr" style="display:inline">(${escapeHTML(item.fr)})</span>` : ""}`;
      dd.appendChild(li);
    });

    const ha = $("#howAreYouList"); ha.innerHTML = "";
    howAreYouList.forEach(x=>{
      const li = document.createElement("li");
      li.innerHTML = `${escapeHTML(x.en)}${state.fr ? ` <span class="fr" style="display:inline">(${escapeHTML(x.fr)})</span>` : ""}`;
      ha.appendChild(li);
    });

    const qf = $("#questionForms"); qf.innerHTML = "";
    questionForms.forEach(x=>{
      const li = document.createElement("li");
      li.innerHTML = `${escapeHTML(x.en)}${state.fr ? ` <span class="fr" style="display:inline">(${escapeHTML(x.fr)})</span>` : ""}`;
      qf.appendChild(li);
    });
  }

  // ---------- TOPIC SPINNER ----------
  function spinTopic(){
    const pool = phraseBanks.bridge[state.context][state.level];
    const p = pick(pool);
    $("#topicOut").textContent = p[0] + (state.fr ? `\nFR: ${p[1]}` : "");
    $("#topicOut").dataset.lastSpeak = p[0];
  }

  // ---------- VOCAB ----------
  function isFav(id){ return state.fav.includes(id); }
  function toggleFav(id){
    if(isFav(id)) state.fav = state.fav.filter(x=>x!==id);
    else state.fav = state.fav.concat([id]);
    saveState();
    renderVocab();
  }

  function vocabAllowedByLevel(item){
    if(state.level==="A1"){
      return ["greetings","responses","smalltalk","hotel"].includes(item.cat) || ["thisis","calling","goodtime","meeting"].includes(item.id);
    }
    return true;
  }

  function renderVocab(){
    $$(".segBtn").forEach(b=>b.classList.toggle("active", b.getAttribute("data-cat")===state.cat));
    const q = normalize(state.query);
    const items = vocab.filter(v=>{
      if(!vocabAllowedByLevel(v)) return false;
      const catOk = state.cat==="all" || (state.cat==="fav" ? isFav(v.id) : v.cat===state.cat);
      const qOk = !q || normalize(v.en).includes(q) || normalize(v.fr).includes(q) || normalize(v.ex).includes(q);
      return catOk && qOk;
    });

    const root = $("#vocabGrid");
    root.innerHTML = "";
    items.forEach(v=>{
      const card = document.createElement("div");
      card.className = "vocabCard";
      card.setAttribute("role","button");
      card.setAttribute("tabindex","0");
      card.innerHTML = `
        <div class="vTop">
          <div class="vIcon" aria-hidden="true">${v.icon}</div>
          <div class="vCat">${escapeHTML(v.cat)}</div>
        </div>
        <div class="vWord">${escapeHTML(v.en)}</div>
        <div class="vMore">
          <div><b>FR:</b> ${escapeHTML(v.fr)}</div>
          <div style="margin-top:6px"><b>Ex:</b> ${escapeHTML(v.ex)}</div>
        </div>
        <button class="star ${isFav(v.id) ? "on" : ""}" aria-label="favorite">${isFav(v.id) ? "⭐" : "☆"}</button>
      `;
      const star = $(".star", card);
      star.addEventListener("click", (e)=>{ e.stopPropagation(); toggleFav(v.id); });
      const toggle = ()=> card.classList.toggle("open");
      card.addEventListener("click", toggle);
      card.addEventListener("keydown", (e)=>{ if(e.key==="Enter" || e.key===" "){ e.preventDefault(); toggle(); }});
      root.appendChild(card);
    });
    if(items.length===0){
      root.innerHTML = `<div class="card" style="grid-column:1/-1"><b>No results.</b> Try another category or search word.</div>`;
    }
  }

  // ---------- GRAMMAR DRILL ----------
  let currentDrill = null;
  function newGrammarDrill(){
    const pool = state.level==="A1" ? grammarDrills.slice(0,3) : grammarDrills;
    currentDrill = shuffle(pool)[0];

    const root = $("#grammarDrill");
    root.innerHTML = "";

    const stem = document.createElement("div");
    stem.className = "qStem";
    stem.textContent = currentDrill.stem;
    root.appendChild(stem);

    const opts = document.createElement("div");
    opts.className = "qOpts";
    currentDrill.options.forEach(o=>{
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      b.textContent = o;
      b.addEventListener("click", ()=>{
        $$(".opt", opts).forEach(x=>x.classList.remove("good","bad"));
        const ok = normalize(o) === normalize(currentDrill.ans);
        b.classList.add(ok ? "good" : "bad");
        const why = state.fr ? (currentDrill.why + " (" + currentDrill.fr + ")") : currentDrill.why;
        const msg = ok ? (state.fr ? "✅ Correct ! " : "✅ Correct! ") + why
                       : (state.fr ? "❌ Pas encore. " : "❌ Not yet. ") + (state.fr ? currentDrill.hint : currentDrill.hint);
        $("#drillFeedback").dataset.lastSpeak = currentDrill.ans;
        setFeedback("#drillFeedback", ok ? "good" : "bad", msg);
      });
      opts.appendChild(b);
    });
    root.appendChild(opts);

    $("#drillFeedback").dataset.lastSpeak = currentDrill.ans;
    setFeedback("#drillFeedback","neutral", state.fr ? "Choisis la meilleure option." : "Choose the best option.");
  }
  function drillHintEN(){ return "Hint: routine → present simple. now/temporary → -ing. long time → present perfect. promise now → I’ll. plan → going to."; }
  function drillHintFR(){ return "Indice : habitude → présent simple. maintenant → -ing. depuis longtemps → present perfect. promesse → I’ll. plan → going to."; }

  // ---------- DIALOGUE BUILDER ----------
  function renderDialogueBuilder(){
    const root = $("#dialogueBuilder");
    root.innerHTML = "";
    const ctx = state.context, lvl = state.level;
    state.dlg = state.dlg || {};

    dialogueBlocks.forEach(block=>{
      const wrap = document.createElement("label");
      wrap.className = "field";
      wrap.innerHTML = `<span class="fieldLbl">${block.lblEN}${state.fr ? ` (${block.lblFR})` : ""}</span>`;
      const sel = document.createElement("select");
      sel.id = "dlg_"+block.key;

      const lines = block.lines(ctx, lvl);
      const uniq = Array.from(new Set(lines));
      sel.innerHTML = `<option value="">— choose —</option>` + uniq.map(t=>`<option value="${escapeHTML(t)}">${escapeHTML(t)}</option>`).join("");
      sel.value = state.dlg[block.key] || "";
      sel.addEventListener("change", ()=>{
        state.dlg[block.key] = sel.value;
        saveState();
        updateDlgFeedback();
      });
      wrap.appendChild(sel);
      root.appendChild(wrap);
    });
    updateDlgFeedback();
  }

  function currentDialogueText(){
    const order = ["open","bridge","how","answer","close"];
    const parts = order.map(k => (state.dlg[k]||"").trim()).filter(Boolean);
    return parts.join("\n");
  }

  function updateDlgFeedback(){
    const txt = currentDialogueText();
    if(!txt){
      setFeedback("#dlgFeedback","neutral", state.fr ? "Choisis des blocs pour créer un mini‑dialogue (3–6 lignes)." : "Pick blocks to create a mini-dialogue (3–6 lines).");
      return;
    }
    const lines = txt.split("\n").filter(Boolean);
    setFeedback("#dlgFeedback", lines.length>=3 ? "good" : "neutral",
      lines.length>=3 ? (state.fr ? "✅ Dialogue prêt. Lis-le à voix haute." : "✅ Dialogue ready. Read it aloud.")
                      : (state.fr ? "⚠️ Ajoute au moins 3 lignes." : "⚠️ Add at least 3 lines."));
  }

  function randomDialogue(){
    const ctx = state.context, lvl = state.level;
    state.dlg = {};
    dialogueBlocks.forEach(block=>{
      const lines = block.lines(ctx, lvl);
      state.dlg[block.key] = lines[Math.floor(Math.random()*lines.length)];
    });
    saveState();
    renderDialogueBuilder();
  }

  // ---------- PHONE BUILDER ----------
  function renderPhoneBuilder(){
    const root = $("#phoneBuilder");
    root.innerHTML = "";
    const fields = [
      {key:"opening", lblEN:"Opening", lblFR:"Ouverture"},
      {key:"reason", lblEN:"Reason", lblFR:"Raison"},
      {key:"check", lblEN:"Check time", lblFR:"Bon moment ?"},
      {key:"next", lblEN:"Close", lblFR:"Fin"}
    ];
    state.phone = state.phone || {};

    const levels = ["A1","A2","B1"];
    const maxIdx = levels.indexOf(state.level);

    fields.forEach(f=>{
      const wrap = document.createElement("label");
      wrap.className = "field";
      wrap.innerHTML = `<span class="fieldLbl">${f.lblEN}${state.fr ? ` (${f.lblFR})` : ""}</span>`;
      const sel = document.createElement("select");
      sel.id = "ph_"+f.key;

      const opts = [];
      for(let i=0;i<=Math.max(0,maxIdx);i++){
        const lvl = levels[i];
        (phoneBlocks[f.key][lvl]||[]).forEach(x=>opts.push(x));
      }
      const uniq = Array.from(new Set(opts));
      sel.innerHTML = `<option value="">— choose —</option>` + uniq.map(o=>`<option value="${escapeHTML(o)}">${escapeHTML(o)}</option>`).join("");
      sel.value = state.phone[f.key] || "";
      sel.addEventListener("change", ()=>{
        state.phone[f.key] = sel.value;
        saveState();
        updatePhoneFeedback();
      });
      wrap.appendChild(sel);
      root.appendChild(wrap);
    });
    updatePhoneFeedback();
  }

  function currentPhoneText(){
    const p = state.phone || {};
    return ["opening","reason","check","next"].map(k=>(p[k]||"").trim()).filter(Boolean).join(" ");
  }

  function updatePhoneFeedback(){
    const txt = currentPhoneText();
    if(!txt){
      setFeedback("#phoneFeedback","neutral", state.fr ? "Choisis les 4 blocs pour un script d’appel pro." : "Pick the 4 blocks for a professional phone script.");
      return;
    }
    const ok = /\bthis is\b/i.test(txt) && /\bcalling\b/i.test(txt) && (/\bgood time\b/i.test(txt) || /\btwo minutes\b/i.test(txt));
    setFeedback("#phoneFeedback", ok ? "good" : "neutral",
      ok ? (state.fr ? "✅ Script complet (nom + raison + bon moment)." : "✅ Complete script (name + reason + check time).")
         : (state.fr ? "⚠️ Ajoute : ‘this is…’, ‘I’m calling…’, ‘good time?’" : "⚠️ Include: ‘this is…’, ‘I’m calling…’, ‘good time?’"));
  }

  function showPhoneModel(){
    const model = "Good morning, this is Alex from Green Hotel. I’m calling to confirm your reservation. Is this a good time to talk? Perfect — I’ll send a quick confirmation email. Thanks for your time.";
    setFeedback("#phoneFeedback","neutral", "Model:\n" + model);
  }

  // ---------- ROLE CARDS ----------
  function renderRoleCards(){
    const root = $("#roleGrid");
    root.innerHTML = "";
    const pool = roleCards.filter(c => state.context==="hotel" ? c.id==="hotelCard" : c.id!=="hotelCard");
    pool.forEach(card=>{
      const b = document.createElement("button");
      b.type = "button";
      b.className = "roleBtn";
      b.innerHTML = `<div style="font-weight:1000">${escapeHTML(card.title)}</div><div class="small">${escapeHTML(card.prompt)}</div>`;
      b.addEventListener("click", ()=>{
        const out = $("#roleOut");
        out.textContent =
          "Prompt: " + card.prompt + "\n\n" +
          "Starters:\n- " + card.starters.join("\n- ") + "\n\n" +
          "Follow‑ups:\n- " + card.follow.join("\n- ") +
          (state.fr ? "\n\nFR: Utilise 1 starter + 1 question." : "");
        out.dataset.lastSpeak = card.starters[0] + " " + card.follow[0];
      });
      root.appendChild(b);
    });
    const out = $("#roleOut");
    out.textContent = state.fr ? "Clique une carte, puis parle 20 secondes." : "Pick a card, then speak for 20 seconds.";
    out.dataset.lastSpeak = "";
  }

  // ---------- PRACTICE: Context quiz ----------
  let currentCQ = null;
  function newContextQuiz(){
    const levels = {A1:1,A2:2,B1:3};
    const eligible = contextQuizBank.filter(q => levels[state.level] >= levels[q.lvlMin]);
    const pool = eligible.filter(q => q.ctx===state.context);
    currentCQ = shuffle(pool.length ? pool : eligible)[0];

    const root = $("#contextQuiz");
    root.innerHTML = "";
    const stem = document.createElement("div");
    stem.className = "qStem";
    stem.innerHTML = `<div><b>Situation:</b> ${escapeHTML(currentCQ.situationEN)}</div>` +
      (state.fr ? `<div class="small fr" style="display:block;margin-top:6px"><b>FR:</b> ${escapeHTML(currentCQ.situationFR)}</div>` : "");
    root.appendChild(stem);

    const options = shuffle([currentCQ.correct].concat(currentCQ.distract));
    const opts = document.createElement("div");
    opts.className = "qOpts";
    options.forEach(o=>{
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      b.textContent = o;
      b.addEventListener("click", ()=>{
        $$(".opt", opts).forEach(x=>x.classList.remove("good","bad"));
        const ok = normalize(o) === normalize(currentCQ.correct);
        b.classList.add(ok ? "good" : "bad");
        const why = state.fr ? currentCQ.whyFR : currentCQ.whyEN;
        setFeedback("#cqFeedback", ok ? "good" : "bad",
          (ok ? (state.fr ? "✅ Correct ! " : "✅ Correct! ") : (state.fr ? "❌ Pas encore. " : "❌ Not yet. ")) + why);
      });
      opts.appendChild(b);
    });
    root.appendChild(opts);
    setFeedback("#cqFeedback","neutral", state.fr ? "Choisis la meilleure phrase." : "Choose the best line.");
  }
  function cqHintEN(){ return "Hint: match register (formal vs casual) + match context (phone needs name + reason)."; }
  function cqHintFR(){ return "Indice : registre (formel/familier) + contexte (téléphone = nom + raison)."; }

  // ---------- PRACTICE: Answer quiz ----------
  let currentAQ = null;
  function newAnswerQuiz(){
    currentAQ = shuffle(answerQuizBank)[0];
    const root = $("#answerQuiz");
    root.innerHTML = "";
    const stem = document.createElement("div");
    stem.className = "qStem";
    stem.innerHTML = `<div><b>Question:</b> ${escapeHTML(currentAQ.q)}</div>`;
    root.appendChild(stem);

    const options = shuffle([currentAQ.correct].concat(currentAQ.distract));
    const opts = document.createElement("div");
    opts.className = "qOpts";
    options.forEach(o=>{
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      b.textContent = o;
      b.addEventListener("click", ()=>{
        $$(".opt", opts).forEach(x=>x.classList.remove("good","bad"));
        const ok = normalize(o) === normalize(currentAQ.correct);
        b.classList.add(ok ? "good" : "bad");
        const why = state.fr ? currentAQ.whyFR : currentAQ.whyEN;
        setFeedback("#aqFeedback", ok ? "good" : "bad",
          (ok ? (state.fr ? "✅ Correct ! " : "✅ Correct! ") : (state.fr ? "❌ Pas encore. " : "❌ Not yet. ")) + why);
      });
      opts.appendChild(b);
    });
    root.appendChild(opts);
    setFeedback("#aqFeedback","neutral", state.fr ? "Réponse courte + relance." : "Short answer + ask back.");
  }
  function aqHintEN(){ return "Hint: 1) short answer 2) ‘thanks’ 3) return question (and you?)."; }
  function aqHintFR(){ return "Indice : 1) court 2) ‘thanks’ 3) question retour (and you?)."; }

  // ---------- PRACTICE: Fill dialog ----------
  let currentFill = null;
  function newFillDialog(){
    const levels = {A1:1,A2:2,B1:3};
    const eligible = fillDialogs.filter(d => levels[state.level] >= levels[d.level] && (d.ctx===state.context || state.context==="work"));
    currentFill = shuffle(eligible.length ? eligible : fillDialogs)[0];
    renderFillDialog();
  }

  function renderFillDialog(){
    const root = $("#fillDialog");
    root.innerHTML = "";
    const answers = currentFill.answers;
    let blankIndex = 0;

    currentFill.lines.forEach(parts=>{
      const row = document.createElement("div");
      row.className = "fillLine";
      row.innerHTML = `<code>${escapeHTML(parts[0])}</code>`;
      for(let i=1;i<parts.length;i++){
        if(parts[i] === "__"){
          const inp = document.createElement("input");
          inp.type = "text";
          inp.inputMode = "text";
          inp.autocomplete = "off";
          inp.spellcheck = false;
          inp.dataset.idx = String(blankIndex);
          inp.placeholder = "…";
          inp.addEventListener("input", ()=> checkFillInputs());
          row.appendChild(inp);
          blankIndex += 1;
        }else{
          const span = document.createElement("span");
          span.textContent = parts[i];
          row.appendChild(span);
        }
      }
      root.appendChild(row);
    });

    setFeedback("#fdFeedback","neutral", state.fr ? "Tape les mots manquants (correction immédiate)." : "Type the missing words (instant feedback).");
  }

  function resetFillInputs(){
    $$("#fillDialog input").forEach(i=>{ i.value=""; i.classList.remove("good","bad"); });
    setFeedback("#fdFeedback","neutral", state.fr ? "Recommence." : "Try again.");
  }

  function checkFillInputs(){
    if(!currentFill) return;
    const inputs = $$("#fillDialog input");
    let allFilled = true;
    let allOk = true;

    inputs.forEach(inp=>{
      const idx = parseInt(inp.dataset.idx, 10);
      const target = normalize(currentFill.answers[idx]);
      const val = normalize(inp.value);
      if(!val) allFilled = false;
      const ok = val && val === target;
      inp.classList.toggle("good", !!ok);
      inp.classList.toggle("bad", !!val && !ok);
      if(!ok) allOk = false;
    });

    if(!allFilled) return;

    if(allOk){
      setFeedback("#fdFeedback","good", state.fr ? "✅ Tout est correct ! Lis le dialogue à voix haute." : "✅ All correct! Read the dialogue aloud.");
    }else{
      setFeedback("#fdFeedback","bad", state.fr ? "❌ Il y a une erreur. Utilise Hint." : "❌ There is a mistake. Use Hint.");
    }
  }

  // ---------- PRACTICE: Tap order ----------
  let currentTO = null;
  let toProgress = [];
  function newTapOrder(){
    const levels = {A1:1,A2:2,B1:3};
    const eligible = tapOrderBank.filter(d => levels[state.level] >= levels[d.level] && (d.ctx===state.context || state.context==="work"));
    currentTO = shuffle(eligible.length ? eligible : tapOrderBank)[0];
    toProgress = [];
    renderTapOrder();
  }

  function renderTapOrder(){
    const root = $("#tapOrder");
    root.innerHTML = "";

    const box = document.createElement("div");
    box.className = "tapBox";

    const progress = document.createElement("div");
    progress.className = "tapProgress";
    progress.id = "toProgress";
    progress.textContent = state.fr ? "Progress: (clique les lignes)" : "Progress: (tap lines)";
    box.appendChild(progress);

    const choices = document.createElement("div");
    choices.className = "tapChoices";

    shuffle(currentTO.correct).forEach(line=>{
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tapBtn";
      b.textContent = line;
      b.addEventListener("click", ()=>{
        if(b.classList.contains("used")) return;
        const expected = currentTO.correct[toProgress.length];
        if(normalize(line) === normalize(expected)){
          b.classList.add("used");
          toProgress.push(line);
          updateTapProgress();
          if(toProgress.length === currentTO.correct.length){
            setFeedback("#toFeedback","good", state.fr ? "🎉 Bravo ! Dialogue correct." : "🎉 Great! Correct order.");
          }else{
            setFeedback("#toFeedback","good", state.fr ? "✅ Correct. Continue." : "✅ Correct. Keep going.");
          }
        }else{
          setFeedback("#toFeedback","bad", state.fr ? "❌ Pas encore. Essaie une autre ligne." : "❌ Not yet. Try another line.");
        }
      });
      choices.appendChild(b);
    });

    box.appendChild(choices);
    root.appendChild(box);

    setFeedback("#toFeedback","neutral", state.fr ? "Indice disponible avec Hint." : "Hint is available if you need it.");
    updateTapProgress();
  }

  function updateTapProgress(){
    const p = $("#toProgress");
    if(!p) return;
    p.textContent = toProgress.length ? toProgress.map(x=>"- "+x).join("\n") : (state.fr ? "Progress: (clique les lignes)" : "Progress: (tap lines)");
  }

  function resetTapOrder(){
    if(!currentTO) return;
    toProgress = [];
    renderTapOrder();
  }

  // ---------- PRINTABLE ----------
  function renderPrintable(){
    const ctx = contexts[state.context];
    const lvl = state.level;
    const A = phraseBanks.acknowledge[state.context][lvl].slice(0,3).map(p=>p[0]).join("\n- ");
    const B = phraseBanks.bridge[state.context][lvl].slice(0,3).map(p=>p[0]).join("\n- ");
    const C = phraseBanks.close[state.context][lvl].slice(0,3).map(p=>p[0]).join("\n- ");
    const phoneModel = "Hello, this is __ speaking. I’m calling about __. Is this a good time to talk? Great — I’ll confirm by email. Thank you.";

    $("#printArea").innerHTML = `
      <div class="printHead">
        <div>
          <div class="printTitle">Small Talk & Greetings — One‑Page Guide</div>
          <div class="printSub">Context: ${escapeHTML(ctx.title)} • Level: ${escapeHTML(state.level)}</div>
        </div>
        <div class="printTag">SpeakEasyTisha</div>
      </div>

      <div class="printCols">
        <div>
          <h3>ABC method</h3>
          <ul class="bullets">
            <li><b>A</b>cknowledge: greeting + name (if needed)</li>
            <li><b>B</b>ridge: safe topic (weather, traffic, weekend, plans)</li>
            <li><b>C</b>lose: ask back / exit politely</li>
          </ul>

          <h3>Top phrases (this context)</h3>
          <div class="monoBox"><b>Acknowledge</b>\n- ${escapeHTML(A)}\n\n<b>Bridge</b>\n- ${escapeHTML(B)}\n\n<b>Close</b>\n- ${escapeHTML(C)}</div>

          <h3>Safe topics</h3>
          <ul class="bullets">
            <li>weather</li>
            <li>traffic / commute</li>
            <li>weekend / plans</li>
            <li>local events</li>
          </ul>
        </div>

        <div>
          <h3>Fast grammar</h3>
          <ul class="bullets">
            <li><b>Present simple</b>: routine — I take the train every day.</li>
            <li><b>Present continuous</b>: now — I’m heading to a meeting.</li>
            <li><b>Present perfect</b>: since last time — I’ve been busy lately.</li>
          </ul>

          <h3>Best answers (How are you?)</h3>
          <div class="monoBox">Pretty good, thanks. And you?\nNot bad at all. How about you?\nCan’t complain — you?</div>

          <h3>Phone opening template</h3>
          <div class="monoBox">${escapeHTML(phoneModel)}</div>
        </div>
      </div>
    `;
  }

  // ---------- MAIN ----------
  function renderAll(){
    renderABC();
    renderRules();
    renderVocab();
    newFormula();
    spinTopic();
    renderDialogueBuilder();
    renderPhoneBuilder();
    renderRoleCards();
    newGrammarDrill();
    newContextQuiz();
    newAnswerQuiz();
    newFillDialog();
    newTapOrder();
    renderPrintable();
  }

  // Warm voices
  if("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = ()=>{};

  init();
})();