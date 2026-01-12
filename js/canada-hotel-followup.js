/* SpeakEasyTisha — Canada Hotel Follow-up (Day 2)
   Fully interactive, beginner-friendly, US/UK speechSynthesis.
   Includes: vocab flashcards + mini-quiz + grammar MCQ + word order +
   fill-in (word bank) + listening comprehension + dictation +
   prepositions + drag/click matching + checkout reading (MCQ + TF) +
   roleplay + oral practice. Instant feedback + hints + global score.
*/

(() => {
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  // ---------------------------
  // Voice / speech
  // ---------------------------
  const Speech = {
    mode: "en-US", // or en-GB
    utter: null,
    voices: [],
    getVoices(){
      this.voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      return this.voices;
    },
    pickVoice(){
      const voices = this.getVoices();
      const langPref = this.mode;
      let v = voices.find(x => (x.lang || "").toLowerCase() === langPref.toLowerCase());
      if(!v) v = voices.find(x => (x.lang || "").toLowerCase().startsWith(langPref.toLowerCase()));
      if(!v) v = voices.find(x => (x.lang || "").toLowerCase().startsWith("en"));
      return v || null;
    },
    stop(){
      try{ window.speechSynthesis?.cancel(); }catch(e){}
      this.utter = null;
    },
    pause(){ try{ window.speechSynthesis?.pause(); }catch(e){} },
    resume(){ try{ window.speechSynthesis?.resume(); }catch(e){} },
    say(text){
      if(!window.speechSynthesis) return;
      this.stop();
      const u = new SpeechSynthesisUtterance(String(text || ""));
      const v = this.pickVoice();
      if(v) u.voice = v;
      u.lang = this.mode;
      u.rate = 0.98;
      u.pitch = 1.0;
      this.utter = u;
      window.speechSynthesis.speak(u);
    },
    sayLines(lines){
      const text = (lines || []).join(" ");
      this.say(text);
    }
  };

  if (window.speechSynthesis){
    window.speechSynthesis.onvoiceschanged = () => Speech.getVoices();
  }

  // ---------------------------
  // Score
  // ---------------------------
  const Score = {
    now: 0,
    max: 0,
    awarded: new Set(),
    setMax(n){
      this.max = n;
      updateScore();
    },
    award(key, pts=1){
      if(this.awarded.has(key)) return;
      this.awarded.add(key);
      this.now += pts;
      updateScore();
      updateProgress();
    },
    reset(){
      this.now = 0;
      this.awarded.clear();
      updateScore();
      updateProgress();
    }
  };

  function updateScore(){
    $("#scoreNow").textContent = String(Score.now);
    $("#scoreMax").textContent = String(Score.max);
  }

  function updateProgress(){
    const pct = Score.max ? Math.round((Score.now / Score.max) * 100) : 0;
    $("#progressBar").style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }

  // ---------------------------
  // Helpers
  // ---------------------------
  function escapeHtml(s){
    return String(s || "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
  function normalize(s){
    return String(s || "")
      .replace(/[’']/g,"'")
      .replace(/\s+/g," ")
      .trim()
      .toLowerCase();
  }
  function shuffle(arr){
    const a = arr.slice();
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------------------------
  // UI Controls
  // ---------------------------
  function setVoice(mode){
    Speech.mode = mode;
    const us = $("#voiceUS"), uk = $("#voiceUK");
    if(mode === "en-US"){
      us.classList.add("is-on"); uk.classList.remove("is-on");
      us.setAttribute("aria-pressed","true"); uk.setAttribute("aria-pressed","false");
    }else{
      uk.classList.add("is-on"); us.classList.remove("is-on");
      uk.setAttribute("aria-pressed","true"); us.setAttribute("aria-pressed","false");
    }
  }

  $("#voiceUS").addEventListener("click", () => setVoice("en-US"));
  $("#voiceUK").addEventListener("click", () => setVoice("en-GB"));

  $("#btnPause").addEventListener("click", () => Speech.pause());
  $("#btnResume").addEventListener("click", () => Speech.resume());
  $("#btnStop").addEventListener("click", () => Speech.stop());

  $("#btnStartTour").addEventListener("click", () => {
    document.querySelector("#sec1")?.scrollIntoView({behavior:"smooth", block:"start"});
  });
  $("#btnHowTo").addEventListener("click", () => {
    alert(
      "How it works:\n\n" +
      "• Choose US/UK voice at the top.\n" +
      "• Click 🔊 to listen.\n" +
      "• You get instant feedback for every answer.\n" +
      "• Use Hint if you are stuck.\n" +
      "• Drag activities also work by clicking tokens."
    );
  });

  // ---------------------------
  // Data
  // ---------------------------
  const vocab = [
    // Check-in
    {group:"checkin", icon:"🛎️", word:"front desk", def:"the place where you check in and ask for help", ex:"The front desk is in the lobby."},
    {group:"checkin", icon:"🪪", word:"ID", def:"an identity card or passport", ex:"May I see your ID, please?"},
    {group:"checkin", icon:"💳", word:"deposit", def:"money you pay first (temporary hold)", ex:"We need a deposit by card."},
    {group:"checkin", icon:"🔑", word:"key card", def:"a card that opens your room", ex:"Here is your key card."},
    {group:"checkin", icon:"🧳", word:"luggage storage", def:"a place to keep bags before check-in/after checkout", ex:"Can you store our luggage?"},
    {group:"checkin", icon:"🕓", word:"early check-in", def:"check in earlier than the normal time", ex:"Is early check-in possible?"},

    // Directions
    {group:"directions", icon:"🛗", word:"elevator", def:"a lift that goes up/down", ex:"The elevator is next to reception."},
    {group:"directions", icon:"🧭", word:"across from", def:"on the other side", ex:"The café is across from the bar."},
    {group:"directions", icon:"↔️", word:"between", def:"in the middle of two things", ex:"The ATM is between the shop and the desk."},
    {group:"directions", icon:"➡️", word:"turn left / right", def:"change direction", ex:"Turn left at the elevators."},
    {group:"directions", icon:"🧖", word:"wellness area", def:"pool/spa/gym area", ex:"The wellness area is on level -1."},
    {group:"directions", icon:"🚪", word:"entrance", def:"the main door to enter", ex:"The entrance is on the ground floor."},

    // Problems
    {group:"problems", icon:"🔊", word:"noisy", def:"too loud", ex:"The room is noisy at night."},
    {group:"problems", icon:"🧊", word:"air conditioning", def:"system that cools the room", ex:"The air conditioning isn’t working."},
    {group:"problems", icon:"🧻", word:"towels", def:"cloths to dry your body", ex:"Could we have more towels, please?"},
    {group:"problems", icon:"🧼", word:"housekeeping", def:"cleaning service", ex:"Housekeeping comes in the morning."},
    {group:"problems", icon:"🧾", word:"charge", def:"an amount of money on your bill", ex:"There is a wrong charge on my bill."},
    {group:"problems", icon:"🛠️", word:"maintenance", def:"repair service", ex:"Can you send maintenance, please?"},

    // Check-out
    {group:"checkout", icon:"🧾", word:"invoice / bill", def:"the list of what you must pay", ex:"Could I see the bill, please?"},
    {group:"checkout", icon:"⏳", word:"late check-out", def:"leave later than the normal time", ex:"Is late check-out available?"},
    {group:"checkout", icon:"💰", word:"refund", def:"money back", ex:"Could I get a refund for this charge?"},
    {group:"checkout", icon:"✅", word:"confirm", def:"to check and say it is correct", ex:"Can you confirm the total amount?"},
    {group:"checkout", icon:"🧳", word:"porter", def:"person who helps with luggage", ex:"A porter can help with your bags."},
    {group:"checkout", icon:"👋", word:"Have a nice stay", def:"a polite phrase to the guest", ex:"Thank you. Have a nice stay!"}
  ];

  const politeLessonLines = [
    {ico:"⭐", txt:"Use <span class='k'>Could I…?</span> or <span class='k'>Could you…?</span> for polite requests."},
    {ico:"✅", txt:"Use <span class='k'>May I…?</span> for very polite / formal requests."},
    {ico:"💬", txt:"Use <span class='k'>Would you mind…?</span> for extra politeness (advanced)."},
    {ico:"🙏", txt:"Add <span class='k'>please</span> + <span class='k'>thank you</span>."},
    {ico:"📞", txt:"Examples: <span class='k'>Could I have a room with a view, please?</span> / <span class='k'>May I see the bill, please?</span>"}
  ];

  const tenseLessonLines = [
    {ico:"🗓️", txt:"<span class='k'>Past simple</span> (finished): <span class='k'>I booked</span> a room yesterday."},
    {ico:"✅", txt:"<span class='k'>Present perfect</span> (connection to now): <span class='k'>I have booked</span> a room (and it matters now)."},
    {ico:"📍", txt:"<span class='k'>Present simple</span> (facts): Check-in <span class='k'>is</span> at 4 p.m."},
    {ico:"⏳", txt:"<span class='k'>Present continuous</span> (now): <span class='k'>I’m calling</span> to confirm my arrival."},
    {ico:"🔮", txt:"<span class='k'>Future</span>: <span class='k'>I’m going to arrive</span> at 18:30."}
  ];

  // MCQ format: {key, prompt, choices[], answer, explain, hint, say?}
  const politeMCQ = [
    {
      key:"pl1",
      prompt:"Choose the most polite request at the front desk:",
      choices:["Give me my key card.","Could I have my key card, please?","I want my key card now."],
      answer:1,
      explain:"Use 'Could I… please?' for polite requests.",
      hint:"Look for: Could I… + please."
    },
    {
      key:"pl2",
      prompt:"Choose the best phrase to ask for help:",
      choices:["Help me.","Can you help me?","Could you help me, please?"],
      answer:2,
      explain:"'Could you… please?' sounds more polite than 'Can you…?'",
      hint:"The most polite option usually uses 'Could you… please?'"
    },
    {
      key:"pl3",
      prompt:"You want to store luggage. Choose the best line:",
      choices:["Store my bags.","May we leave our luggage here, please?","Bags here."],
      answer:1,
      explain:"'May we… please?' is very polite.",
      hint:"Use 'May we… please?'"
    },
    {
      key:"pl4",
      prompt:"You don’t understand. Choose the best line:",
      choices:["What?","Sorry, could you repeat that, please?","Repeat."],
      answer:1,
      explain:"Apology + 'could you… please?'",
      hint:"Start with 'Sorry…'"
    },
    {
      key:"pl5",
      prompt:"You want late check-out. Choose the best line:",
      choices:["Late check-out.","Could we request a late check-out, please?","We leave late."],
      answer:1,
      explain:"'Could we request…' is polite and clear.",
      hint:"Look for polite request + specific service."
    },
    {
      key:"pl6",
      prompt:"You want the bill. Choose the best line:",
      choices:["Give me the bill.","May I see the bill, please?","Bill."],
      answer:1,
      explain:"'May I… please?' is very polite.",
      hint:"Look for 'May I… please?'"
    }
  ];

  const tenseMCQ = [
    {
      key:"ts1",
      prompt:"Choose the best tense: “I ____ a room yesterday.”",
      choices:["have booked","booked","am booking"],
      answer:1,
      explain:"Yesterday = finished time → past simple: booked.",
      hint:"Yesterday → past simple."
    },
    {
      key:"ts2",
      prompt:"Choose the best tense: “I ____ to confirm my arrival time now.”",
      choices:["call","am calling","called"],
      answer:1,
      explain:"Now = action in progress → present continuous: am calling.",
      hint:"Now → present continuous."
    },
    {
      key:"ts3",
      prompt:"Choose the best tense: “Check-in ____ at 4 p.m.”",
      choices:["is","was","has been"],
      answer:0,
      explain:"A fact/schedule → present simple: is.",
      hint:"Facts/schedules → present simple."
    },
    {
      key:"ts4",
      prompt:"Choose the best tense: “I ____ already ____ online (and I want to check the details).”",
      choices:["have / paid","paid / have","am / paying"],
      answer:0,
      explain:"Present perfect is common for actions with a result now: have paid.",
      hint:"Result now → present perfect."
    },
    {
      key:"ts5",
      prompt:"Choose the best tense: “We ____ going to arrive at 18:30.”",
      choices:["are","is","were"],
      answer:0,
      explain:"We are going to… (future plan).",
      hint:"We + are."
    },
    {
      key:"ts6",
      prompt:"Choose the best tense: “I ____ booked a room (and I have the confirmation email).”",
      choices:["have","has","did"],
      answer:0,
      explain:"I have booked (present perfect).",
      hint:"Present perfect: have + past participle."
    }
  ];

  // Word order builders (multiple)
  const wordOrder = [
    {
      key:"wo1",
      title:"Front desk request",
      target:"Could I have a room with a view, please?",
      tokens:["Could","I","have","a","room","with","a","view,","please?"],
      hint:"Start with: Could I…"
    },
    {
      key:"wo2",
      title:"Asking for directions",
      target:"Excuse me. Where is the elevator, please?",
      tokens:["Excuse","me.","Where","is","the","elevator,","please?"],
      hint:"Start with: Excuse me."
    },
    {
      key:"wo3",
      title:"Checkout question",
      target:"Could you confirm the total amount, please?",
      tokens:["Could","you","confirm","the","total","amount,","please?"],
      hint:"Could you + verb + object."
    }
  ];

  // Check-in listening: choose best reply
  const checkinListening = [
    {
      key:"cl1",
      staff:"Good evening! Welcome to the hotel. How may I help you?",
      say:"Good evening! Welcome to the hotel. How may I help you?",
      choices:[
        "Hey. Room.",
        "Good evening. I have a reservation under Ms. Martin.",
        "I want key."
      ],
      answer:1,
      explain:"Greeting + reservation name = perfect.",
      hint:"Say: I have a reservation under …"
    },
    {
      key:"cl2",
      staff:"May I see your ID, please?",
      say:"May I see your I D, please?",
      choices:[
        "Yes, of course. Here you are.",
        "No.",
        "Take it."
      ],
      answer:0,
      explain:"Polite, simple, correct.",
      hint:"Use: Yes, of course. Here you are."
    },
    {
      key:"cl3",
      staff:"We need a deposit by card. Is that okay?",
      say:"We need a deposit by card. Is that okay?",
      choices:[
        "Yes, that’s fine. I’ll pay by card.",
        "I pay cash only. Bye.",
        "Deposit? No deposit."
      ],
      answer:0,
      explain:"A clear polite agreement.",
      hint:"Agree politely."
    },
    {
      key:"cl4",
      staff:"Your room is on the 7th floor. The elevator is next to reception.",
      say:"Your room is on the seventh floor. The elevator is next to reception.",
      choices:[
        "Thanks. Could you repeat that, please?",
        "What?",
        "No."
      ],
      answer:0,
      explain:"Polite request for repetition.",
      hint:"Use: Could you repeat that, please?"
    },
    {
      key:"cl5",
      staff:"Breakfast is from 7 to 10 a.m. Would you like a wake-up call?",
      say:"Breakfast is from seven to ten A M. Would you like a wake up call?",
      choices:[
        "Yes, please. At 6:30.",
        "Wake-up? No words.",
        "I am breakfast."
      ],
      answer:0,
      explain:"Polite + specific time.",
      hint:"Say: Yes, please. At…"
    }
  ];

  // Check-in fill (word bank)
  const checkinFill = {
    key:"cf",
    bank: ["reservation", "ID", "deposit", "key card", "elevator", "lobby", "7th", "receipt"],
    items: [
      { id:"cf1", txt:"Good evening. I have a ____ under Ms. Martin.", ans:"reservation", hint:"You made it online or by phone." },
      { id:"cf2", txt:"Here is my ____ (passport).", ans:"ID", hint:"Identity document." },
      { id:"cf3", txt:"Yes, the ____ by card is fine.", ans:"deposit", hint:"Temporary hold." },
      { id:"cf4", txt:"Thank you. Is this my ____?", ans:"key card", hint:"It opens the room." },
      { id:"cf5", txt:"Where is the ____?", ans:"elevator", hint:"It goes up and down." },
      { id:"cf6", txt:"We wait in the ____.", ans:"lobby", hint:"Big open area near entrance." }
    ]
  };

  // Dictation numbers
  const dictations = [
    { key:"d1", label:"Room number", say:"Your room number is three one seven.", expectedDigits:"317", hint:"Type: 317" },
    { key:"d2", label:"Arrival time", say:"Your arrival time is one eight three zero.", expectedDigits:"1830", hint:"Type: 18:30 or 1830" },
    { key:"d3", label:"Deposit amount", say:"The deposit is two hundred dollars.", expectedDigits:"200", hint:"Type: 200" },
    { key:"d4", label:"Checkout time", say:"Check out at twelve.", expectedDigits:"12", hint:"Type: 12" }
  ];

  // Map lesson lines
  const mapLessonLines = [
    {ico:"🚪", txt:"The <span class='k'>entrance</span> is the main door. The <span class='k'>lobby</span> is the big open area when you enter."},
    {ico:"🛎️", txt:"The <span class='k'>front desk</span> is <span class='k'>in the lobby</span>, usually <span class='k'>near the entrance</span>."},
    {ico:"🛗", txt:"The <span class='k'>elevator</span> is often <span class='k'>next to</span> the front desk."},
    {ico:"🍽️", txt:"The <span class='k'>restaurant</span> is often <span class='k'>on</span> the ground floor."},
    {ico:"🧖", txt:"The <span class='k'>spa</span> and <span class='k'>pool</span> are sometimes <span class='k'>downstairs</span> (level -1)."}
  ];

  const prepMCQ = [
    { key:"pr1", prompt:"The elevator is ____ the front desk.", choices:["next to","under","inside"], answer:0, explain:"Next to = close on the side.", hint:"Think: beside." },
    { key:"pr2", prompt:"The restaurant is ____ the ground floor.", choices:["on","in","between"], answer:0, explain:"We say: on the ground floor.", hint:"Floors: on." },
    { key:"pr3", prompt:"Please wait ____ the lobby.", choices:["in","on","across"], answer:0, explain:"Wait in a room/space: in.", hint:"Inside a space → in." },
    { key:"pr4", prompt:"The café is ____ the bar (other side).", choices:["across from","under","between"], answer:0, explain:"Across from = opposite side.", hint:"Opposite." },
    { key:"pr5", prompt:"The ATM is ____ the shop and the desk.", choices:["between","behind","under"], answer:0, explain:"Between A and B.", hint:"A + B → between." }
  ];

  // Place matching
  const places = [
    { id:"p1", label:"🛎️ Front desk", loc:"Lobby", hint:"You check in there." },
    { id:"p2", label:"🧳 Luggage storage", loc:"Front desk", hint:"Ask at the desk." },
    { id:"p3", label:"🍽️ Restaurant", loc:"Ground floor", hint:"Often floor 0." },
    { id:"p4", label:"🏊 Pool / Spa", loc:"Wellness area", hint:"Relax + swim." },
    { id:"p5", label:"🏋️ Gym", loc:"Wellness area", hint:"Exercise." },
    { id:"p6", label:"🛗 Elevator", loc:"Lobby", hint:"Often near the desk." }
  ];

  const placeBoxes = [
    { name:"Lobby", icon:"🏛️", desc:"Main open area when you enter." },
    { name:"Front desk", icon:"🛎️", desc:"Reception / help / questions." },
    { name:"Ground floor", icon:"⬇️", desc:"Floor 0 / street level." },
    { name:"Wellness area", icon:"🧖", desc:"Pool / spa / gym." }
  ];

  const imperativeMCQ = [
    { key:"im1", prompt:"Choose the best direction sentence:", choices:["You go left.","Turn left at the elevator.","Left you now."], answer:1, explain:"Imperative: Turn + direction.", hint:"Imperative starts with a verb." },
    { key:"im2", prompt:"Choose the best sentence:", choices:["Go straight, then take the elevator.","You straight go.","Straight to go."], answer:0, explain:"Imperative: Go + adverb.", hint:"Go + straight." },
    { key:"im3", prompt:"Choose the best sentence:", choices:["Take the second door on the right.","You take second door.","Second door take."], answer:0, explain:"Take + object.", hint:"Start with 'Take'." },
    { key:"im4", prompt:"Choose the best sentence:", choices:["Please wait in the lobby.","Wait lobby please you.","In lobby please."], answer:0, explain:"Polite imperative + place.", hint:"Please + verb." },
    { key:"im5", prompt:"Choose the best sentence:", choices:["Follow me, please.","Me follow.","Follow please me you."], answer:0, explain:"Follow + object.", hint:"Start with 'Follow'." }
  ];

  // Problems listening (staff reply)
  const problemListening = [
    {
      key:"pb1",
      speaker:"Guest:",
      say:"Hi. My room is very noisy. Could I change rooms, please?",
      text:"Hi. My room is very noisy. Could I change rooms, please?",
      choices:[
        "Noisy? Okay.",
        "I’m sorry about that. Let me check availability for a quieter room.",
        "Go away."
      ],
      answer:1,
      explain:"Apology + action + solution is professional.",
      hint:"Start with: I’m sorry about that…"
    },
    {
      key:"pb2",
      speaker:"Guest:",
      say:"Hello. The air conditioning isn’t working. Could you send someone?",
      text:"Hello. The air conditioning isn’t working. Could you send someone?",
      choices:[
        "Sure. I’ll send maintenance right away.",
        "Air conditioning? No.",
        "It’s not my problem."
      ],
      answer:0,
      explain:"Offer help and a clear action.",
      hint:"Say: I’ll send maintenance…"
    },
    {
      key:"pb3",
      speaker:"Guest:",
      say:"Excuse me. Could we have extra towels, please?",
      text:"Excuse me. Could we have extra towels, please?",
      choices:[
        "Yes, of course. I’ll ask housekeeping to bring towels.",
        "Towels? Tomorrow.",
        "No."
      ],
      answer:0,
      explain:"Confirm + action.",
      hint:"Yes, of course + housekeeping."
    },
    {
      key:"pb4",
      speaker:"Guest:",
      say:"IUBL: I think there is a wrong charge on my bill.",
      text:"I think there is a wrong charge on my bill.",
      choices:[
        "Let’s review it together. Which charge looks wrong?",
        "Charges are charges.",
        "Pay now."
      ],
      answer:0,
      explain:"Review + question = best service.",
      hint:"Offer to review and ask which item."
    },
    {
      key:"pb5",
      speaker:"Guest:",
      say:"Could we request a late check-out, please?",
      text:"Could we request a late check-out, please?",
      choices:[
        "Let me check availability. What time would you like?",
        "No.",
        "Check-out now!"
      ],
      answer:0,
      explain:"Check availability + ask details.",
      hint:"Ask: What time…?"
    }
  ];

  // Email fill (word bank)
  const emailFill = {
    key:"ef",
    bank: ["Dear", "reservation", "noisy", "change", "thank", "sincerely", "room", "possible"],
    items: [
      { id:"ef1", txt:"____ Front Desk,", ans:"Dear", hint:"Start an email politely." },
      { id:"ef2", txt:"I have a ____ for tonight under Ms. Martin.", ans:"reservation", hint:"Booking." },
      { id:"ef3", txt:"My ____ is very ____.", ans:"room noisy", hint:"Two words: place + problem." },
      { id:"ef4", txt:"Is it ____ to ____ rooms?", ans:"possible change", hint:"Ask politely if you can change." },
      { id:"ef5", txt:"____ you for your help.", ans:"thank", hint:"Polite ending." },
      { id:"ef6", txt:"____,", ans:"sincerely", hint:"Formal sign-off." }
    ]
  };

  // Checkout reading
  const checkoutReadingLines = [
    {ico:"🛎️", txt:"Receptionist: Good morning. Are you checking out today?"},
    {ico:"🙂", txt:"Guest: Yes, please. Could I see the bill?"},
    {ico:"🧾", txt:"Receptionist: Of course. Here is your invoice. Please check the charges."},
    {ico:"🔎", txt:"Guest: I see a minibar charge, but we didn’t use the minibar."},
    {ico:"✅", txt:"Receptionist: I’m sorry about that. I will remove that charge."},
    {ico:"💳", txt:"Guest: Thank you. I’ll pay by card, please."},
    {ico:"👋", txt:"Receptionist: Great. Here is your receipt. Have a safe trip!"}
  ];

  const checkoutMCQ = [
    { key:"co1", prompt:"What does the guest ask for?", choices:["A key card","The bill / invoice","A towel"], answer:1, explain:"Guest: Could I see the bill?", hint:"Look at line 2." },
    { key:"co2", prompt:"What problem is on the bill?", choices:["Wrong minibar charge","Wrong room number","Broken elevator"], answer:0, explain:"They didn’t use the minibar.", hint:"Minibar charge." },
    { key:"co3", prompt:"What does the receptionist do?", choices:["Removes the charge","Adds a new charge","Refuses to help"], answer:0, explain:"I will remove that charge.", hint:"Remove = delete." },
    { key:"co4", prompt:"How does the guest pay?", choices:["By card","By cash","By check"], answer:0, explain:"I’ll pay by card.", hint:"Pay by card." }
  ];

  const checkoutTF = [
    { key:"ct1", prompt:"The guest used the minibar.", answer:false, explain:"They didn’t use it.", hint:"They said: we didn’t use the minibar." },
    { key:"ct2", prompt:"The receptionist removes the wrong charge.", answer:true, explain:"Yes: I will remove that charge.", hint:"Remove." },
    { key:"ct3", prompt:"The guest pays by cash.", answer:false, explain:"They pay by card.", hint:"Pay by card." }
  ];

  const checkoutOrder = [
    {
      key:"oc1",
      title:"Asking to review the bill",
      target:"Could we review the bill together, please?",
      tokens:["Could","we","review","the","bill","together,","please?"],
      hint:"Could we + verb…"
    },
    {
      key:"oc2",
      title:"Explaining a wrong charge",
      target:"I see a minibar charge, but we didn’t use the minibar.",
      tokens:["I","see","a","minibar","charge,","but","we","didn’t","use","the","minibar."],
      hint:"I see… but…"
    }
  ];

  // Final role-play (choices)
  const roleplaySteps = [
    {
      key:"rp1",
      title:"Check-in",
      staff:"Receptionist: Welcome! Do you have a reservation?",
      say:"Welcome! Do you have a reservation?",
      choices:[
        {txt:"Yes. I have a reservation under Ms. Martin.", ok:true, explain:"Clear + polite."},
        {txt:"Reservation? Maybe.", ok:false, explain:"Be clear: Yes, I have a reservation under…"}
      ]
    },
    {
      key:"rp2",
      title:"ID",
      staff:"Receptionist: May I see your ID, please?",
      say:"May I see your I D, please?",
      choices:[
        {txt:"Yes, of course. Here you are.", ok:true, explain:"Perfect polite answer."},
        {txt:"Take it.", ok:false, explain:"Sounds rude. Use: Here you are."}
      ]
    },
    {
      key:"rp3",
      title:"Directions",
      staff:"Receptionist: The elevators are next to the front desk.",
      say:"The elevators are next to the front desk.",
      choices:[
        {txt:"Thank you. Where is the restaurant, please?", ok:true, explain:"Good follow-up question."},
        {txt:"Okay.", ok:false, explain:"Ask a useful question to practice."}
      ]
    },
    {
      key:"rp4",
      title:"Problem",
      staff:"Guest: My room is noisy at night.",
      say:"My room is noisy at night.",
      choices:[
        {txt:"I’m sorry about that. Let me check another room.", ok:true, explain:"Apology + solution."},
        {txt:"Noisy? Not my problem.", ok:false, explain:"Always apologize + help."}
      ]
    },
    {
      key:"rp5",
      title:"Checkout",
      staff:"Guest: Could I see the bill, please?",
      say:"Could I see the bill, please?",
      choices:[
        {txt:"Of course. Here is your invoice.", ok:true, explain:"Professional response."},
        {txt:"No.", ok:false, explain:"You must help politely."}
      ]
    },
    {
      key:"rp6",
      title:"Goodbye",
      staff:"Receptionist: Here is your receipt. Have a safe trip!",
      say:"Here is your receipt. Have a safe trip!",
      choices:[
        {txt:"Thank you very much. Have a nice day!", ok:true, explain:"Polite and friendly."},
        {txt:"Bye.", ok:false, explain:"Add thanks + polite goodbye."}
      ]
    }
  ];

  // Oral practice (self-check)
  const oralPrompts = [
    { key:"o1", text:"Good evening. I have a reservation under Ms. Martin." },
    { key:"o2", text:"Could I have a room with a view, please?" },
    { key:"o3", text:"Excuse me. Where is the elevator, please?" },
    { key:"o4", text:"I’m sorry, but my room is noisy. Could I change rooms, please?" },
    { key:"o5", text:"Could we review the bill together, please?" }
  ];

  // ---------------------------
  // Render helpers
  // ---------------------------
  function renderReading(el, lines){
    el.innerHTML = lines.map(l => `
      <div class="line">
        <div class="ico">${l.ico}</div>
        <div>${l.txt}</div>
      </div>
    `).join("");
  }
  function plainTextFromReading(lines){
    return lines.map(l => String(l.txt).replace(/<[^>]*>/g,"")).join(" ");
  }

  function makeMCQ(host, questions, opts={}){
    const { awardPrefix="mcq", pts=1 } = opts;
    host.innerHTML = "";

    questions.forEach((q, idx) => {
      const qEl = document.createElement("div");
      qEl.className = "q";
      qEl.innerHTML = `
        <div class="q__prompt">${idx+1}. ${escapeHtml(q.prompt)}</div>
        <div class="smallrow">
          ${q.say ? `<button class="btn btn--ghost" type="button" data-say="1">🔊 Listen</button>` : ""}
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
        </div>
        <div class="choices"></div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const choicesEl = $(".choices", qEl);
      const fb = $(".feedback", qEl);

      if(q.say){
        $("[data-say]", qEl).addEventListener("click", () => Speech.say(q.say));
      }
      $("[data-hint]", qEl).addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML = `💡 <strong>Hint:</strong> ${escapeHtml(q.hint || "")}`;
      });

      q.choices.forEach((c, i) => {
        const row = document.createElement("label");
        row.className = "choice";
        row.innerHTML = `
          <input type="radio" name="${q.key}" value="${i}" />
          <div>${escapeHtml(c)}</div>
        `;
        row.addEventListener("click", () => {
          const correct = i === q.answer;
          fb.classList.remove("hidden","ok","no");
          fb.classList.add(correct ? "ok" : "no");
          fb.innerHTML = correct
            ? `✅ Correct! <span class="muted">${escapeHtml(q.explain || "")}</span>`
            : `❌ Not quite. <strong>Answer:</strong> ${escapeHtml(q.choices[q.answer])}. <span class="muted">${escapeHtml(q.explain || "")}</span>`;
          if(correct) Score.award(`${awardPrefix}:${q.key}`, pts);
        });
        choicesEl.appendChild(row);
      });

      host.appendChild(qEl);
    });

    return {
      reset(){
        $$("input[type=radio]", host).forEach(i => i.checked = false);
        $$(".feedback", host).forEach(f => f.classList.add("hidden"));
      }
    };
  }

  // ---------------------------
  // Flashcards
  // ---------------------------
  function renderFlashcards(){
    const host = $("#flashcards");
    const groupSel = $("#vocabGroup").value;
    let list = vocab.slice();
    if(groupSel !== "all") list = list.filter(v => v.group === groupSel);

    host.innerHTML = "";
    list.forEach((v) => {
      const card = document.createElement("div");
      card.className = "flashcard";
      card.innerHTML = `
        <div class="flashcard__face flashcard__front">
          <div class="fcTop">
            <div class="fcIcon">${v.icon}</div>
            <div class="fcGroup">#${v.group}</div>
          </div>
          <div class="fcWord">${escapeHtml(v.word)}</div>
          <div class="muted tiny">Click to flip ➜</div>
          <div class="fcBtns">
            <button class="iconbtn" type="button" data-say="${escapeHtml(v.word)}">🔊 Word</button>
          </div>
        </div>

        <div class="flashcard__face flashcard__back">
          <div class="badge">Meaning</div>
          <div class="fcDef">${escapeHtml(v.def)}</div>
          <div class="badge">Example</div>
          <div class="fcEx">${escapeHtml(v.ex)}</div>
          <div class="fcBtns">
            <button class="iconbtn" type="button" data-say="${escapeHtml(v.def)}">🔊 Meaning</button>
            <button class="iconbtn" type="button" data-say="${escapeHtml(v.ex)}">🔊 Example</button>
            <button class="iconbtn" type="button" data-back="1">↩ Front</button>
          </div>
        </div>
      `;

      card.addEventListener("click", (e) => {
        const t = e.target;
        if(t && (t.tagName === "BUTTON" || t.closest("button"))) return;
        card.classList.toggle("is-flipped");
      });

      $$("button[data-say]", card).forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          Speech.say(btn.getAttribute("data-say"));
        });
      });

      const backBtn = $("button[data-back]", card);
      backBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.remove("is-flipped");
      });

      host.appendChild(card);
    });
  }

  function buildVocabMiniQuiz(){
    const host = $("#vocabMiniQuizHost");
    host.innerHTML = "";
    const pool = shuffle(vocab.slice()).slice(0, 8);

    pool.forEach((item, idx) => {
      const wrong = shuffle(vocab.filter(v => v.word !== item.word)).slice(0, 2).map(v => v.def);
      const choices = shuffle([item.def, ...wrong]);

      const qEl = document.createElement("div");
      qEl.className = "q";
      qEl.innerHTML = `
        <div class="q__prompt">${item.icon} What does “${escapeHtml(item.word)}” mean?</div>
        <div class="smallrow">
          <button class="btn btn--ghost" type="button" data-say="1">🔊 Word</button>
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
        </div>
        <div class="choices"></div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;

      const choicesEl = $(".choices", qEl);
      const fb = $(".feedback", qEl);

      $("[data-say]", qEl).addEventListener("click", () => Speech.say(item.word));
      $("[data-hint]", qEl).addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML = `💡 <strong>Hint:</strong> Example: ${escapeHtml(item.ex)}`;
      });

      choices.forEach((c, i) => {
        const row = document.createElement("label");
        row.className = "choice";
        row.innerHTML = `<input type="radio" name="vm${idx}" /><div>${escapeHtml(c)}</div>`;
        row.addEventListener("click", () => {
          const correct = c === item.def;
          fb.classList.remove("hidden","ok","no");
          fb.classList.add(correct ? "ok" : "no");
          fb.innerHTML = correct
            ? `✅ Correct! <span class="muted">Example: ${escapeHtml(item.ex)}</span>`
            : `❌ Not quite. <strong>Answer:</strong> ${escapeHtml(item.def)}. <span class="muted">Example: ${escapeHtml(item.ex)}</span>`;
          if(correct) Score.award(`vocabMini:vm${idx}`, 1);
        });
        choicesEl.appendChild(row);
      });

      host.appendChild(qEl);
    });
  }

  // ---------------------------
  // Word order builder (multi)
  // ---------------------------
  function makeToken(text){
    const t = document.createElement("div");
    t.className = "token";
    t.draggable = true;
    t.textContent = text;
    t.addEventListener("dragstart", () => {
      t.classList.add("is-dragging");
      window.__dragToken = t;
      setTimeout(()=>t.classList.remove("is-dragging"), 0);
    });
    return t;
  }

  function initDragZone(zone){
    zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("is-over"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("is-over"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("is-over");
      const tok = window.__dragToken;
      if(tok) zone.appendChild(tok);
    });
  }

  function buildWordOrder(host, items, awardPrefix){
    host.innerHTML = "";
    const api = { resetAll(){} };

    const resets = [];

    items.forEach((it, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "q";
      wrap.innerHTML = `
        <div class="stepHead">
          <div class="stepTitle">${idx+1}. ${escapeHtml(it.title)}</div>
          <div class="smallrow">
            <button class="btn btn--ghost" type="button" data-say="1">🔊 Listen</button>
            <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
            <button class="btn" type="button" data-check="1">✅ Check</button>
            <button class="btn btn--ghost" type="button" data-clear="1">↺ Clear</button>
          </div>
        </div>
        <div class="muted tiny">Target: <span class="kbd">${escapeHtml(it.target)}</span></div>
        <div class="builder">
          <div class="bank" aria-label="Word bank"></div>
          <div class="dropzone" aria-label="Build sentence here"></div>
        </div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const bank = $(".bank", wrap);
      const zone = $(".dropzone", wrap);
      const fb = $(".feedback", wrap);

      initDragZone(bank);
      initDragZone(zone);

      const tokens = shuffle(it.tokens).map(makeToken);
      tokens.forEach(t => bank.appendChild(t));

      // click fallback
      bank.addEventListener("click", (e) => {
        const tok = e.target.closest(".token");
        if(!tok) return;
        zone.appendChild(tok);
      });
      zone.addEventListener("click", (e) => {
        const tok = e.target.closest(".token");
        if(!tok) return;
        bank.appendChild(tok);
      });

      $("[data-say]", wrap).addEventListener("click", () => Speech.say(it.target));
      $("[data-hint]", wrap).addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML = `💡 <strong>Hint:</strong> ${escapeHtml(it.hint || "")}`;
      });

      $("[data-check]", wrap).addEventListener("click", () => {
        const built = $$(".token", zone).map(t => t.textContent.trim()).join(" ").replace(/\s+/g," ").trim()
          .replace(/\s+([,?.!])/g,"$1");
        const ok = normalize(built) === normalize(it.target);
        fb.classList.remove("hidden","ok","no");
        fb.classList.add(ok ? "ok" : "no");
        fb.textContent = ok ? "✅ Perfect!" : `❌ Not yet. Your sentence: “${built || "—"}”`;
        if(ok) Score.award(`${awardPrefix}:${it.key}`, 2);
      });

      $("[data-clear]", wrap).addEventListener("click", () => {
        $$(".token", zone).forEach(t => bank.appendChild(t));
        fb.classList.add("hidden");
      });

      resets.push(() => {
        $$(".token", zone).forEach(t => bank.appendChild(t));
        fb.classList.add("hidden");
      });

      host.appendChild(wrap);
    });

    api.resetAll = () => resets.forEach(fn => fn());
    return api;
  }

  // ---------------------------
  // Fill-in-the-blanks (word bank)
  // ---------------------------
  function buildFill(host, data, awardPrefix){
    host.innerHTML = "";

    const bankWrap = document.createElement("div");
    bankWrap.className = "bank";
    const sentWrap = document.createElement("div");
    sentWrap.className = "builder";

    const fb = document.createElement("div");
    fb.className = "feedback hidden";

    host.appendChild(bankWrap);
    host.appendChild(sentWrap);
    host.appendChild(fb);

    let selectedWord = null;
    let selectedTokenEl = null;

    function setHint(text){
      fb.classList.remove("hidden","ok","no");
      fb.classList.add("no");
      fb.innerHTML = `💡 <strong>Hint:</strong> ${escapeHtml(text || "")}`;
    }
    function setOK(text){
      fb.classList.remove("hidden","ok","no");
      fb.classList.add("ok");
      fb.textContent = text || "✅ Correct!";
    }
    function setNO(text){
      fb.classList.remove("hidden","ok","no");
      fb.classList.add("no");
      fb.textContent = text || "❌ Not quite.";
    }

    function makeBank(){
      bankWrap.innerHTML = "";
      shuffle(data.bank).forEach(w => {
        const t = document.createElement("div");
        t.className = "token";
        t.textContent = w;
        t.addEventListener("click", () => {
          $$(".token", bankWrap).forEach(x => x.classList.remove("is-over"));
          t.classList.add("is-over");
          selectedWord = w;
          selectedTokenEl = t;
        });
        bankWrap.appendChild(t);
      });
    }

    function renderSentences(){
      sentWrap.innerHTML = "";
      data.items.forEach((it) => {
        const row = document.createElement("div");
        row.className = "listenBlock";
        // allow multi blanks via splitting on ____
        const parts = it.txt.split("____");
        const blanksCount = parts.length - 1;

        // expected answers may be multiple words separated by space (e.g., "room noisy")
        const expected = String(it.ans).split(" ");

        let html = "";
        for(let i=0;i<parts.length;i++){
          html += escapeHtml(parts[i]);
          if(i < blanksCount){
            html += ` <span class="blank" role="button" tabindex="0" data-id="${escapeHtml(it.id)}" data-bi="${i}">____</span> `;
          }
        }

        row.innerHTML = `
          <div class="listenTop">
            <div>
              <div class="listenLine">${html}</div>
              <div class="listenMeta"><span class="pillTag">Hint</span> ${escapeHtml(it.hint || "")}</div>
            </div>
            <div class="smallrow">
              <button class="btn btn--ghost" type="button" data-hint="1">💡 Hint</button>
              <button class="btn btn--ghost" type="button" data-say="1">🔊 Listen</button>
            </div>
          </div>
        `;

        $("[data-hint]", row).addEventListener("click", () => setHint(it.hint));
        $("[data-say]", row).addEventListener("click", () => Speech.say(it.txt.replaceAll("____","blank")));

        // attach blank behaviors
        const blanks = $$(".blank", row);
        blanks.forEach((b, bi) => {
          function place(){
            if(!selectedWord) { setNO("Pick a word from the bank first."); return; }
            b.textContent = selectedWord;
            b.classList.add("filled");
            b.classList.remove("is-on");

            // check immediately for this blank
            const want = expected[bi] || expected[0];
            const ok = normalize(selectedWord) === normalize(want);
            if(ok){
              b.style.borderColor = "rgba(28,154,85,.45)";
              Score.award(`${awardPrefix}:${it.id}:${bi}`, 1);
              setOK("✅ Correct!");
            }else{
              b.style.borderColor = "rgba(209,74,86,.45)";
              setNO(`❌ Not quite. Try another word. Hint: ${it.hint}`);
            }
          }

          b.addEventListener("click", () => place());
          b.addEventListener("keydown", (e) => {
            if(e.key === "Enter" || e.key === " "){
              e.preventDefault();
              place();
            }
          });
        });

        sentWrap.appendChild(row);
      });
    }

    makeBank();
    renderSentences();

    return {
      reset(){
        fb.classList.add("hidden");
        selectedWord = null;
        selectedTokenEl = null;
        makeBank();
        renderSentences();
      }
    };
  }

  // ---------------------------
  // Listening MCQ blocks
  // ---------------------------
  function buildListeningMCQ(host, items, awardPrefix){
    host.innerHTML = "";
    const resets = [];

    items.forEach((it, idx) => {
      const block = document.createElement("div");
      block.className = "listenBlock";
      block.innerHTML = `
        <div class="listenTop">
          <div>
            <div class="listenLine"><span class="pillTag">${escapeHtml(it.speaker || "Receptionist")}</span> ${escapeHtml(it.staff || it.text || "")}</div>
            <div class="listenMeta">Tip: click 🔊, then choose the best answer.</div>
          </div>
          <div class="smallrow">
            <button class="btn btn--ghost" type="button" data-play="1">🔊 Play</button>
            <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
          </div>
        </div>
        <div class="choices"></div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;

      const fb = $(".feedback", block);
      const choicesEl = $(".choices", block);

      $("[data-play]", block).addEventListener("click", () => Speech.say(it.say || it.staff || it.text));
      $("[data-hint]", block).addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML = `💡 <strong>Hint:</strong> ${escapeHtml(it.hint || "")}`;
      });

      it.choices.forEach((c, i) => {
        const row = document.createElement("label");
        row.className = "choice";
        row.innerHTML = `<input type="radio" name="${it.key}" /><div>${escapeHtml(c)}</div>`;
        row.addEventListener("click", () => {
          const correct = i === it.answer;
          fb.classList.remove("hidden","ok","no");
          fb.classList.add(correct ? "ok" : "no");
          fb.innerHTML = correct
            ? `✅ Correct! <span class="muted">${escapeHtml(it.explain || "")}</span>`
            : `❌ Not quite. <strong>Best answer:</strong> ${escapeHtml(it.choices[it.answer])}. <span class="muted">${escapeHtml(it.explain || "")}</span>`;
          if(correct) Score.award(`${awardPrefix}:${it.key}`, 1);
        });
        choicesEl.appendChild(row);
      });

      resets.push(() => {
        $$("input[type=radio]", block).forEach(x => x.checked = false);
        fb.classList.add("hidden");
      });

      host.appendChild(block);
    });

    return { reset(){ resets.forEach(fn => fn()); } };
  }

  // ---------------------------
  // Dictation
  // ---------------------------
  function buildDictation(host){
    host.innerHTML = "";
    const resets = [];

    dictations.forEach((d, idx) => {
      const row = document.createElement("div");
      row.className = "q";
      row.innerHTML = `
        <div class="q__prompt">${idx+1}. ${escapeHtml(d.label)}</div>
        <div class="smallrow">
          <button class="btn btn--ghost" type="button" data-play="1">🔊 Play</button>
          <input class="input" data-in="1" placeholder="${escapeHtml(d.hint)}" style="max-width:260px;" />
          <button class="btn" type="button" data-check="1">✅ Check</button>
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
        </div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;

      const play = $("[data-play]", row);
      const inp = $("[data-in]", row);
      const check = $("[data-check]", row);
      const hint = $("[data-hint]", row);
      const fb = $(".feedback", row);

      play.addEventListener("click", () => Speech.say(d.say));
      hint.addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML = `💡 <strong>Hint:</strong> Type digits only (no letters).`;
      });

      check.addEventListener("click", () => {
        const digits = String(inp.value || "").replace(/\D/g,"");
        const ok = digits === d.expectedDigits;
        fb.classList.remove("hidden","ok","no");
        fb.classList.add(ok ? "ok" : "no");
        fb.innerHTML = ok
          ? "✅ Correct!"
          : `❌ Not quite. <strong>Answer:</strong> ${escapeHtml(d.expectedDigits)}`;
        if(ok) Score.award(`dict:${d.key}`, 1);
      });

      resets.push(() => { inp.value=""; fb.classList.add("hidden"); });
      host.appendChild(row);
    });

    return { reset(){ resets.forEach(fn => fn()); } };
  }

  // ---------------------------
  // Place match (drag OR click)
  // ---------------------------
  function buildPlaceMatch(host){
    host.innerHTML = "";

    const bank = document.createElement("div");
    bank.className = "bank";
    bank.setAttribute("aria-label","Places");

    const grid = document.createElement("div");
    grid.className = "placegrid";

    const fb = document.createElement("div");
    fb.className = "feedback hidden";

    host.appendChild(bank);
    host.appendChild(grid);
    host.appendChild(fb);

    let selectedTok = null;

    function setFb(ok, text){
      fb.classList.remove("hidden","ok","no");
      fb.classList.add(ok ? "ok" : "no");
      fb.textContent = text;
    }

    function makePlaceToken(p){
      const t = makeToken(p.label);
      t.dataset.loc = p.loc;
      t.dataset.id = p.id;
      t.title = p.hint || "";
      t.addEventListener("click", () => {
        // select
        $$(".token", host).forEach(x => x.classList.remove("is-over"));
        t.classList.add("is-over");
        selectedTok = t;
      });
      return t;
    }

    // init boxes
    const boxEls = {};
    placeBoxes.forEach(bx => {
      const box = document.createElement("div");
      box.className = "placebox";
      box.dataset.name = bx.name;
      box.innerHTML = `
        <div class="placebox__head">
          <div class="placebox__t">${bx.icon} ${escapeHtml(bx.name)}</div>
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
        </div>
        <div class="placebox__desc">${escapeHtml(bx.desc)}</div>
        <div class="bank" style="margin-top:.55rem; min-height:52px;" data-zone="1" aria-label="${escapeHtml(bx.name)} zone"></div>
      `;

      const zone = $("[data-zone]", box);

      // drag over
      zone.addEventListener("dragover", (e) => { e.preventDefault(); box.classList.add("is-over"); });
      zone.addEventListener("dragleave", () => box.classList.remove("is-over"));
      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        box.classList.remove("is-over");
        const tok = window.__dragToken;
        if(tok) zone.appendChild(tok);
        checkToken(tok, bx.name);
      });

      // click fallback: click box to place selected token
      box.addEventListener("click", (e) => {
        if(e.target.closest("button")) return;
        if(!selectedTok) return;
        zone.appendChild(selectedTok);
        checkToken(selectedTok, bx.name);
        selectedTok.classList.remove("is-over");
        selectedTok = null;
      });

      // hint button for box
      $("[data-hint]", box).addEventListener("click", (e) => {
        e.stopPropagation();
        setFb(false, `💡 Hint: Think of what you usually find in: ${bx.name}.`);
      });

      grid.appendChild(box);
      boxEls[bx.name] = box;
    });

    // bank tokens
    const tokens = shuffle(places).map(makePlaceToken);
    tokens.forEach(t => bank.appendChild(t));

    // Make bank drop zones too
    initDragZone(bank);
    // But also allow moving tokens back to bank by clicking zone content
    bank.addEventListener("click", (e) => {
      const tok = e.target.closest(".token");
      if(!tok) return;
      // if clicked in bank, just select; selection already handled by token click
    });

    function checkToken(tok, boxName){
      if(!tok) return;
      const want = tok.dataset.loc;
      const ok = normalize(want) === normalize(boxName);
      tok.classList.remove("good","bad");
      tok.classList.add(ok ? "good" : "bad");

      if(ok){
        Score.award(`place:${tok.dataset.id}`, 1);
        setFb(true, "✅ Correct place!");
      }else{
        const hint = places.find(p => p.id === tok.dataset.id)?.hint || "Try again.";
        setFb(false, `❌ Not quite. Hint: ${hint}`);
      }
    }

    return {
      reset(){
        fb.classList.add("hidden");
        // move all tokens back to bank
        $$(".token", host).forEach(t => { t.classList.remove("good","bad","is-over"); bank.appendChild(t); });
        selectedTok = null;
      }
    };
  }

  // ---------------------------
  // True/False builder
  // ---------------------------
  function buildTrueFalse(host, items, awardPrefix){
    host.innerHTML = "";
    const resets = [];
    items.forEach((it, idx) => {
      const q = document.createElement("div");
      q.className = "q";
      q.innerHTML = `
        <div class="q__prompt">${idx+1}. ${escapeHtml(it.prompt)}</div>
        <div class="smallrow">
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
          <button class="btn btn--ghost" type="button" data-true="1">True</button>
          <button class="btn btn--ghost" type="button" data-false="1">False</button>
        </div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const fb = $(".feedback", q);

      $("[data-hint]", q).addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML = `💡 <strong>Hint:</strong> ${escapeHtml(it.hint || "")}`;
      });

      function answer(val){
        const correct = val === it.answer;
        fb.classList.remove("hidden","ok","no");
        fb.classList.add(correct ? "ok" : "no");
        fb.innerHTML = correct
          ? `✅ Correct! <span class="muted">${escapeHtml(it.explain || "")}</span>`
          : `❌ Not quite. <strong>Answer:</strong> ${it.answer ? "True" : "False"}. <span class="muted">${escapeHtml(it.explain || "")}</span>`;
        if(correct) Score.award(`${awardPrefix}:${it.key}`, 1);
      }

      $("[data-true]", q).addEventListener("click", () => answer(true));
      $("[data-false]", q).addEventListener("click", () => answer(false));

      resets.push(() => fb.classList.add("hidden"));
      host.appendChild(q);
    });

    return { reset(){ resets.forEach(fn => fn()); } };
  }

  // ---------------------------
  // Dialogue choices (single-step blocks)
  // ---------------------------
  function buildChoiceSteps(host, steps, awardPrefix){
    host.innerHTML = "";
    const resets = [];

    steps.forEach((st, idx) => {
      const block = document.createElement("div");
      block.className = "stepCard";
      block.innerHTML = `
        <div class="stepHead">
          <div class="stepTitle">${idx+1}. ${escapeHtml(st.title || "Step")}</div>
          <div class="smallrow">
            <button class="btn btn--ghost" type="button" data-play="1">🔊 Listen</button>
            <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
          </div>
        </div>
        <div class="listenMeta">${escapeHtml(st.staff || "")}</div>
        <div class="choices" style="margin-top:.55rem;"></div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;

      const fb = $(".feedback", block);
      const choicesEl = $(".choices", block);

      $("[data-play]", block).addEventListener("click", () => Speech.say(st.say || st.staff));
      $("[data-hint]", block).addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML = `💡 <strong>Hint:</strong> Choose the most polite + clear option.`;
      });

      st.choices.forEach((c) => {
        const row = document.createElement("div");
        row.className = "choice";
        row.style.cursor = "pointer";
        row.innerHTML = `<div style="font-weight:900;">${escapeHtml(c.txt)}</div>`;
        row.addEventListener("click", () => {
          fb.classList.remove("hidden","ok","no");
          fb.classList.add(c.ok ? "ok" : "no");
          fb.innerHTML = c.ok
            ? `✅ Correct! <span class="muted">${escapeHtml(c.explain || "")}</span>`
            : `❌ Try this instead: <strong>${escapeHtml(st.choices.find(x=>x.ok)?.txt || "")}</strong>. <span class="muted">${escapeHtml(c.explain || "")}</span>`;
          if(c.ok) Score.award(`${awardPrefix}:${st.key}`, 1);
        });
        choicesEl.appendChild(row);
      });

      resets.push(() => fb.classList.add("hidden"));
      host.appendChild(block);
    });

    return { reset(){ resets.forEach(fn => fn()); } };
  }

  // ---------------------------
  // Oral practice (self-check)
  // ---------------------------
  function buildOral(host){
    host.innerHTML = "";
    const resets = [];

    oralPrompts.forEach((p, idx) => {
      const row = document.createElement("div");
      row.className = "q";
      row.innerHTML = `
        <div class="q__prompt">${idx+1}. Listen & repeat</div>
        <div class="listenMeta">${escapeHtml(p.text)}</div>
        <div class="smallrow" style="margin-top:.55rem;">
          <button class="btn btn--ghost" type="button" data-play="1">🔊 Listen</button>
          <button class="btn" type="button" data-said="1">✅ I said it</button>
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
        </div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const fb = $(".feedback", row);

      $("[data-play]", row).addEventListener("click", () => Speech.say(p.text));
      $("[data-hint]", row).addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML = "💡 Hint: Say it slowly, then faster. Focus on polite intonation.";
      });
      $("[data-said]", row).addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("ok");
        fb.textContent = "✅ Great! (Self-check completed)";
        Score.award(`oral:${p.key}`, 1);
      });

      resets.push(() => fb.classList.add("hidden"));
      host.appendChild(row);
    });

    return { reset(){ resets.forEach(fn => fn()); } };
  }

  // ---------------------------
  // Init text blocks
  // ---------------------------
  renderReading($("#politeLesson"), politeLessonLines);
  renderReading($("#tenseLesson"), tenseLessonLines);
  renderReading($("#mapLesson"), mapLessonLines);
  renderReading($("#checkoutReading"), checkoutReadingLines);

  // Listen buttons that target reading blocks by id
  $$("button[data-say]").forEach(btn => {
    const id = btn.getAttribute("data-say");
    btn.addEventListener("click", () => {
      const el = document.getElementById(id);
      if(!el) return;
      Speech.say(el.textContent);
    });
  });

  // ---------------------------
  // Build activities
  // ---------------------------
  let politeQuizAPI = makeMCQ($("#politeQuizHost"), politeMCQ, {awardPrefix:"polite", pts:1});
  let tenseQuizAPI = makeMCQ($("#tenseQuizHost"), tenseMCQ, {awardPrefix:"tense", pts:1});
  let wordOrderAPI = buildWordOrder($("#wordOrderHost"), wordOrder, "wordOrder");

  let checkinListenAPI = buildListeningMCQ($("#checkinListenHost"), checkinListening, "checkinListen");
  let checkinFillAPI = buildFill($("#checkinFillHost"), checkinFill, "checkinFill");
  let dialogueAPI = buildChoiceSteps($("#dialogueHost"), [
    { key:"dg1", title:"Greeting + reservation", staff:"Receptionist: Good evening! How may I help you?", say:"Good evening! How may I help you?",
      choices:[
        {txt:"Good evening. I have a reservation under Ms. Martin.", ok:true, explain:"Perfect."},
        {txt:"Room.", ok:false, explain:"Too short. Use a full polite sentence."}
      ]},
    { key:"dg2", title:"ID request", staff:"Receptionist: May I see your ID, please?", say:"May I see your I D, please?",
      choices:[
        {txt:"Yes, of course. Here you are.", ok:true, explain:"Perfect."},
        {txt:"Take it.", ok:false, explain:"Sounds rude. Use: Here you are."}
      ]},
    { key:"dg3", title:"Deposit", staff:"Receptionist: We need a deposit by card. Is that okay?", say:"We need a deposit by card. Is that okay?",
      choices:[
        {txt:"Yes, that’s fine. I’ll pay by card.", ok:true, explain:"Clear + polite."},
        {txt:"No deposit.", ok:false, explain:"If you refuse, explain politely."}
      ]},
    { key:"dg4", title:"Key card", staff:"Receptionist: Here is your key card.", say:"Here is your key card.",
      choices:[
        {txt:"Thank you very much.", ok:true, explain:"Nice polite thanks."},
        {txt:"Okay.", ok:false, explain:"Add thanks."}
      ]},
    { key:"dg5", title:"Directions", staff:"Receptionist: The elevator is next to the front desk.", say:"The elevator is next to the front desk.",
      choices:[
        {txt:"Thank you. Could you repeat that, please?", ok:true, explain:"Great polite request."},
        {txt:"What?", ok:false, explain:"Too direct. Use: Could you repeat that, please?"}
      ]}
  ], "dialogue");

  let dictAPI = buildDictation($("#dictHost"));

  let prepAPI = makeMCQ($("#prepQuizHost"), prepMCQ, {awardPrefix:"prep", pts:1});
  let placeAPI = buildPlaceMatch($("#placeMatchHost"));
  let impAPI = makeMCQ($("#impQuizHost"), imperativeMCQ, {awardPrefix:"imp", pts:1});

  let problemListenAPI = buildListeningMCQ($("#problemListenHost"), problemListening, "problemListen");
  let emailFillAPI = buildFill($("#emailFillHost"), emailFill, "emailFill");

  let checkoutMCQAPI = makeMCQ($("#checkoutMCQHost"), checkoutMCQ, {awardPrefix:"checkoutMCQ", pts:1});
  let checkoutTFAPI = buildTrueFalse($("#checkoutTFHost"), checkoutTF, "checkoutTF");
  let checkoutOrderAPI = buildWordOrder($("#checkoutOrderHost"), checkoutOrder, "checkoutOrder");

  let roleplayAPI = buildChoiceSteps($("#roleplayHost"), roleplaySteps, "roleplay");
  let oralAPI = buildOral($("#oralHost"));

  // ---------------------------
  // Vocab controls
  // ---------------------------
  function showMiniQuiz(on){
    const panel = $("#vocabMiniQuiz");
    if(on) panel.classList.remove("hidden");
    else panel.classList.add("hidden");
  }

  $("#vocabGroup").addEventListener("change", () => renderFlashcards());
  $("#btnVocabShuffle").addEventListener("click", () => {
    // shuffle the underlying list for variety
    // (we keep vocab in place; re-render already changes order by current array)
    // We'll render by shuffling in render: easiest is to temporarily shuffle display:
    const groupSel = $("#vocabGroup").value;
    let list = vocab.slice();
    if(groupSel !== "all") list = list.filter(v => v.group === groupSel);
    const host = $("#flashcards");
    host.innerHTML = "";
    shuffle(list).forEach(v => {
      const card = document.createElement("div");
      card.className = "flashcard";
      card.innerHTML = `
        <div class="flashcard__face flashcard__front">
          <div class="fcTop">
            <div class="fcIcon">${v.icon}</div>
            <div class="fcGroup">#${v.group}</div>
          </div>
          <div class="fcWord">${escapeHtml(v.word)}</div>
          <div class="muted tiny">Click to flip ➜</div>
          <div class="fcBtns">
            <button class="iconbtn" type="button" data-say="${escapeHtml(v.word)}">🔊 Word</button>
          </div>
        </div>
        <div class="flashcard__face flashcard__back">
          <div class="badge">Meaning</div>
          <div class="fcDef">${escapeHtml(v.def)}</div>
          <div class="badge">Example</div>
          <div class="fcEx">${escapeHtml(v.ex)}</div>
          <div class="fcBtns">
            <button class="iconbtn" type="button" data-say="${escapeHtml(v.def)}">🔊 Meaning</button>
            <button class="iconbtn" type="button" data-say="${escapeHtml(v.ex)}">🔊 Example</button>
            <button class="iconbtn" type="button" data-back="1">↩ Front</button>
          </div>
        </div>
      `;
      card.addEventListener("click", (e) => {
        const t = e.target;
        if(t && (t.tagName === "BUTTON" || t.closest("button"))) return;
        card.classList.toggle("is-flipped");
      });
      $$("button[data-say]", card).forEach(btn => {
        btn.addEventListener("click", (e) => { e.stopPropagation(); Speech.say(btn.getAttribute("data-say")); });
      });
      $("button[data-back]", card)?.addEventListener("click", (e) => { e.stopPropagation(); card.classList.remove("is-flipped"); });
      host.appendChild(card);
    });
  });

  $("#btnVocabMiniQuiz").addEventListener("click", () => {
    showMiniQuiz(true);
    buildVocabMiniQuiz();
    $("#vocabMiniQuiz").scrollIntoView({behavior:"smooth", block:"start"});
  });
  $("#btnVocabMiniReset").addEventListener("click", () => buildVocabMiniQuiz());

  // ---------------------------
  // Reset buttons (section-level)
  // ---------------------------
  $("#btnPoliteReset").addEventListener("click", () => politeQuizAPI.reset());
  $("#btnTenseReset").addEventListener("click", () => tenseQuizAPI.reset());
  $("#btnWordOrderReset").addEventListener("click", () => wordOrderAPI.resetAll());

  $("#btnCheckinListenReset").addEventListener("click", () => checkinListenAPI.reset());
  $("#btnCheckinFillReset").addEventListener("click", () => checkinFillAPI.reset());
  $("#btnDialogueReset").addEventListener("click", () => dialogueAPI.reset());
  $("#btnDictReset").addEventListener("click", () => dictAPI.reset());

  $("#btnPrepReset").addEventListener("click", () => prepAPI.reset());
  $("#btnPlaceReset").addEventListener("click", () => placeAPI.reset());
  $("#btnImpReset").addEventListener("click", () => impAPI.reset());

  $("#btnProblemListenReset").addEventListener("click", () => problemListenAPI.reset());
  $("#btnEmailFillReset").addEventListener("click", () => emailFillAPI.reset());

  $("#btnCheckoutMCQReset").addEventListener("click", () => checkoutMCQAPI.reset());
  $("#btnCheckoutTFReset").addEventListener("click", () => checkoutTFAPI.reset());
  $("#btnCheckoutOrderReset").addEventListener("click", () => checkoutOrderAPI.resetAll());

  $("#btnRoleplayReset").addEventListener("click", () => roleplayAPI.reset());
  $("#btnOralReset").addEventListener("click", () => oralAPI.reset());

  // ---------------------------
  // Reset all
  // ---------------------------
  $("#btnResetAll").addEventListener("click", () => {
    if(!confirm("Reset ALL activities and score?")) return;
    Speech.stop();
    Score.reset();

    showMiniQuiz(false);
    renderFlashcards();

    politeQuizAPI.reset();
    tenseQuizAPI.reset();
    wordOrderAPI.resetAll();

    checkinListenAPI.reset();
    checkinFillAPI.reset();
    dialogueAPI.reset();
    dictAPI.reset();

    prepAPI.reset();
    placeAPI.reset();
    impAPI.reset();

    problemListenAPI.reset();
    emailFillAPI.reset();

    checkoutMCQAPI.reset();
    checkoutTFAPI.reset();
    checkoutOrderAPI.resetAll();

    roleplayAPI.reset();
    oralAPI.reset();

    document.querySelector("#top")?.scrollIntoView({behavior:"smooth", block:"start"});
  });

  // ---------------------------
  // Score max (roughly 1 hour content)
  // ---------------------------
  function computeMax(){
    // vocab mini: 8
    // polite MCQ: 6
    // tense MCQ: 6
    // word order: 3 * 2 = 6
    // checkin listening: 5
    // checkin fill: 6 blanks (+ one has 2 blanks? no) = 6
    // dialogue: 5
    // dictation: 4
    // prepositions: 5
    // place match: 6
    // imperatives: 5
    // problem listening: 5
    // email fill: ef3 has 2 blanks => each blank can award 1 (we coded per blank index) so count blanks:
    //   ef1..ef6: ef3 has 2 blanks -> total blanks 7
    // checkout MCQ: 4
    // checkout TF: 3
    // checkout order: 2 * 2 = 4
    // roleplay: 6
    // oral self-check: 5
    const max =
      8 + 6 + 6 + 6 + 5 + 6 + 5 + 4 + 5 + 6 + 5 + 5 + 7 + 4 + 3 + 4 + 6 + 5;
    return max;
  }
  Score.setMax(computeMax());

  // ---------------------------
  // Initial render
  // ---------------------------
  setVoice("en-US");
  renderFlashcards();
  updateScore();
  updateProgress();

})();
