(() => {
  "use strict";

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function shuffle(arr){
    const a = arr.slice();
    for (let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, (c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }

  // -------------------------
  // Score (per scenario run)
  // -------------------------
  const Score = (() => {
    const awarded = new Set();
    let score = 0;
    let max = 0;

    function setMax(n){
      max = n;
      $("#scoreMax").textContent = String(n);
      render();
    }
    function render(){ $("#scoreNow").textContent = String(score); }
    function reset(){ awarded.clear(); score = 0; render(); }
    function awardOnce(key, points=1){
      if (awarded.has(key)) return false;
      awarded.add(key);
      score += points;
      render();
      return true;
    }
    function setSectionScore(elNow, elMax, now, mx){
      elNow.textContent = String(now);
      elMax.textContent = String(mx);
    }
    return { setMax, reset, awardOnce, setSectionScore };
  })();

  // -------------------------
  // Speech (US/UK)
  // -------------------------
  const Speaker = (() => {
    let accent = "US";
    let voices = [];

    function loadVoices(){
      try{ voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; }
      catch(e){ voices = []; }
    }
    function pickVoice(){
      if (!voices || !voices.length) return null;
      const wanted = accent === "UK" ? ["en-GB","en_GB"] : ["en-US","en_US"];
      const v = voices.find(v => wanted.some(p => (v.lang || "").startsWith(p)));
      return v || voices.find(v => (v.lang||"").startsWith("en")) || voices[0] || null;
    }
    function setAccent(a){
      accent = a === "UK" ? "UK" : "US";
      $("#accentLabel").textContent = accent === "UK" ? "British" : "American";
    }
    function stop(){
      if (!("speechSynthesis" in window)) return;
      try{ speechSynthesis.cancel(); }catch(e){}
    }
    function say(text){
      if (!("speechSynthesis" in window)) { alert("Audio is not supported in this browser."); return; }
      stop();
      loadVoices();
      const u = new SpeechSynthesisUtterance(String(text));
      const v = pickVoice();
      if (v) u.voice = v;
      u.rate = 1.0;
      u.pitch = 1.0;
      u.lang = accent === "UK" ? "en-GB" : "en-US";
      speechSynthesis.speak(u);
    }
    if ("speechSynthesis" in window){
      loadVoices();
      speechSynthesis.onvoiceschanged = () => loadVoices();
    }
    return { setAccent, say, stop };
  })();

  function isTouchDevice(){
    return ("ontouchstart" in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  }

  // -------------------------
  // Scenarios (realistic VTEST)
  // -------------------------
  const SCENARIOS = {
    reschedule: {
      id: "reschedule",
      icon: "🔁",
      title: "Reschedule a meeting",
      focus: "Apology + request + availability",
      desc: "Move a scheduled meeting to a later date and keep a professional tone.",
      tips: ["Sorry for the inconvenience", "Could we reschedule…?", "Let me know your availability"],
      patternExample: "“I’m sorry for the inconvenience, but would it be possible to reschedule our meeting? Could you please share your availability next week?”",
      phrases: [
        "I’m writing regarding our scheduled meeting.",
        "Would it be possible to reschedule to a later date?",
        "Could you please let me know your availability?"
      ],
      vocab: [
        { id:"v1", icon:"📅", word:"scheduled meeting", def:"a meeting planned for a specific time", ex:"We have a scheduled meeting on Tuesday at 10 a.m." },
        { id:"v2", icon:"🔁", word:"reschedule", def:"to change the date or time of an appointment/meeting", ex:"Could we reschedule our meeting to next week?" },
        { id:"v3", icon:"⏳", word:"postpone", def:"to delay something to a later time", ex:"I’d like to postpone the meeting until Friday." },
        { id:"v4", icon:"🕒", word:"availability", def:"the times when someone is free", ex:"Please let me know your availability next week." },
        { id:"v5", icon:"🙏", word:"inconvenience", def:"a problem or extra trouble for someone", ex:"Sorry for the inconvenience." },
        { id:"v6", icon:"📌", word:"follow up on", def:"to contact again to get an update", ex:"I’m writing to follow up on our previous email." },
        { id:"v7", icon:"⚡", word:"urgent issue", def:"a problem that needs attention immediately", ex:"I need to handle an urgent issue before we meet." },
        { id:"v8", icon:"⬆️", word:"escalate", def:"to pass a problem to a higher level/person", ex:"I need to escalate this matter to my manager." },
        { id:"v9", icon:"👔", word:"manager", def:"a person responsible for a team/department", ex:"I’ll discuss this with my manager today." },
        { id:"v10", icon:"✅", word:"confirm", def:"to say something is correct / final", ex:"Could you confirm the new time, please?" },
        { id:"v11", icon:"📨", word:"regarding", def:"about / concerning", ex:"I’m writing regarding our meeting next week." },
        { id:"v12", icon:"🤝", word:"thank you for your understanding", def:"polite sentence when you ask for a change", ex:"Thank you for your understanding." }
      ],
      quickfire: [
        { prompt:"Ask politely to reschedule.", options:["Move it.","Could we reschedule our meeting to a later date?","Change it now.","I want another date."], answer:1, why:"Polite and clear." },
        { prompt:"Ask for the other person’s free times.", options:["Tell me when you are free.","Could you please let me know your availability?","Send me your agenda.","When are you free? ASAP."], answer:1, why:"Most professional." },
        { prompt:"Apologize for changing plans.", options:["Sorry.","I’m sorry for the inconvenience.","It’s not my fault.","You must accept."], answer:1, why:"Correct tone." },
        { prompt:"Neutral reason:", options:["I have a complaint.","I need to handle an urgent issue first.","I’m bored.","I don’t want to come."], answer:1, why:"Neutral and professional." }
      ],
      readingTitle: "Student email (rescheduling)",
      emailText:
`Subject: request to postpone our meeting

Dear Frank,

I hope you are well.

I am writing to follow up regarding our scheduled meeting. Sorry for the inconvenience, but I would like to ask if we could please postpone it to a later date.

The reason is that I have a complaint that needs to be escalated to the manager, and I would like to address this matter properly before our meeting.

Could you please let me know your availability ?

Thank you for your understanding.

Best regards,
Mathieu N. Tandu`,
      readingQs: [
        { id:"r1", prompt:"Why does Mathieu want to postpone the meeting?", options:["He is on holiday.","He wants to address a complaint before the meeting.","He forgot the date."], answer:1, why:"He says he needs to escalate a complaint and address it before the meeting." },
        { id:"r2", prompt:"What does he ask Frank to do?", options:["Send a contract.","Let him know his availability.","Call the manager."], answer:1, why:"He asks for Frank’s availability." },
        { id:"r3", prompt:"Is the tone polite?", options:["Yes, mostly.","No, rude.","Not sure."], answer:0, why:"It is polite and structured." },
        { id:"r4", prompt:"Which small punctuation issue is in the email?", options:["A comma is missing.","Space before the question mark.","No subject line."], answer:1, why:"He writes “availability ?” with a space." }
      ],
      dictTitle: "Play → type the numbers only (time/date/minutes)",
      dictItems: [
        { id:"d1", text:"Let’s meet on Thursday at 3:15.", answer:"3:15", transcript:"Let’s meet on Thursday at 3:15." },
        { id:"d2", text:"Could we move it to January 19?", answer:"19", transcript:"Could we move it to January 19?" },
        { id:"d3", text:"I need 20 minutes before the call.", answer:"20", transcript:"I need 20 minutes before the call." },
        { id:"d4", text:"Please confirm at 10:30.", answer:"10:30", transcript:"Please confirm at 10:30." },
        { id:"d5", text:"I can join at 2 p.m.", answer:"2", transcript:"I can join at 2 p.m." }
      ],
      ddTitle: "Lines bank (rescheduling)",
      ddLines: [
        { id:"l1", text:"Subject: Request to reschedule our meeting" },
        { id:"l2", text:"Dear Frank," },
        { id:"l3", text:"I hope you are doing well." },
        { id:"l4", text:"I’m sorry for the inconvenience, but would it be possible to reschedule our meeting to a later date?" },
        { id:"l5", text:"I need to handle an urgent issue and discuss it with my manager first." },
        { id:"l6", text:"Could you please let me know your availability next week?" },
        { id:"l7", text:"Thank you for your understanding." },
        { id:"l8", text:"Best regards," },
        { id:"l9", text:"Mathieu N. Tandu" }
      ],
      ddOrder: ["l1","l2","l3","l4","l5","l6","l7","l8","l9"],
      fbTitle: "Dropdown builder (rescheduling)",
      fillBlanks: [
        { id:"f1", before:"I’m writing ", after:" our scheduled meeting.", options:["regarding","because","for"], correct:"regarding" },
        { id:"f2", before:"I’m sorry for the inconvenience, but ", after:" possible to reschedule?", options:["would it be","is it","can it be"], correct:"would it be" },
        { id:"f3", before:"I need to handle an ", after:" issue before we meet.", options:["urgent","funny","tiny"], correct:"urgent" },
        { id:"f4", before:"Could you please let me know your ", after:" next week?", options:["availability","homework","contract"], correct:"availability" }
      ],
      sbTitle: "Build the key phrase (rescheduling)",
      sbTarget: ["I’m","writing","to","follow","up","on","our","scheduled","meeting","."],
      speakingPrompts: [
        "You need to reschedule a meeting with a client because you have an urgent issue. Speak politely and propose a new time.",
        "You are late for a call. Apologize and ask if you can start 15 minutes later.",
        "You need to move a meeting to next week. Ask for availability and confirm the new date."
      ],
      wTaskTitle: "Task: Reschedule politely",
      wTaskText: "Write an email to reschedule a meeting. Aim for 8–12 lines (apology + request + reason + availability).",
      wModel:
`Subject: Request to reschedule our meeting

Dear Frank,

I hope you are doing well.

I’m writing about our scheduled meeting. I’m sorry for the inconvenience, but would it be possible to reschedule to a later date?

I need to handle an urgent issue and discuss it with my manager first. Could you please let me know your availability next week?

Thank you for your understanding.

Best regards,
Mathieu N. Tandu`
    },

    confirm: {
      id: "confirm",
      icon: "✅",
      title: "Confirm an appointment",
      focus: "Confirmation + date/time + polite question",
      desc: "Confirm an appointment time/date (professional, short, clear).",
      tips: ["I’m writing to confirm…", "Does this time still work?", "Kind regards"],
      patternExample: "“I’m writing to confirm my appointment on Monday at 2:30 p.m. Could you please confirm that this time still works for you?”",
      phrases: [
        "I’m writing to confirm my appointment on …",
        "Could you please confirm that this time still works for you?",
        "Thank you in advance."
      ],
      vocab: [
        { id:"v1", icon:"🗓️", word:"appointment", def:"a meeting arranged for a specific time", ex:"I have an appointment on Monday at 2:30 p.m." },
        { id:"v2", icon:"✅", word:"confirm", def:"to say something is correct/final", ex:"Could you confirm the appointment time, please?" },
        { id:"v3", icon:"🕒", word:"time slot", def:"a specific available time", ex:"Is the 2:30 time slot still available?" },
        { id:"v4", icon:"📍", word:"office", def:"a workplace location (clinic/company office)", ex:"I will come to your office on Monday." },
        { id:"v5", icon:"📌", word:"still works", def:"is still OK / suitable", ex:"Does Tuesday at 10 a.m. still work for you?" },
        { id:"v6", icon:"🙏", word:"thank you in advance", def:"polite phrase when asking for a confirmation", ex:"Thank you in advance for your reply." },
        { id:"v7", icon:"✉️", word:"regarding", def:"about / concerning", ex:"I’m writing regarding my appointment." },
        { id:"v8", icon:"🔎", word:"details", def:"important information", ex:"Could you confirm the details, please?" },
        { id:"v9", icon:"⏱️", word:"arrive early", def:"come before the scheduled time", ex:"I will arrive 10 minutes early." },
        { id:"v10", icon:"📞", word:"reach you", def:"contact you successfully", ex:"If I can’t reach you, I will email you." },
        { id:"v11", icon:"🤝", word:"kind regards", def:"polite closing in emails", ex:"Kind regards, Mathieu." },
        { id:"v12", icon:"📩", word:"reply", def:"an answer to an email/message", ex:"Thank you for your reply." }
      ],
      quickfire: [
        { prompt:"Confirm politely.", options:["Confirm it.","I’m writing to confirm my appointment.","I confirm.","Make it confirmed."], answer:1, why:"Clear and natural." },
        { prompt:"Ask if the time is still OK.", options:["Is it okay?","Could you please confirm that this time still works for you?","Do you accept?","It’s fine, yes?"], answer:1, why:"Most professional." },
        { prompt:"Polite close:", options:["Bye","See you.","Kind regards,","Thanks, bye."], answer:2, why:"Standard business close." },
        { prompt:"Add a polite extra line:", options:["Answer now.","Thank you in advance.","It’s urgent.","Don’t be late."], answer:1, why:"Polite and common." }
      ],
      readingTitle: "Email (confirmation)",
      emailText:
`Subject: Confirmation of my appointment

Dear Ms Parker,

I hope you are doing well.

I’m writing to confirm my appointment on Monday 15 January at 2:30 p.m. at your office. Could you please confirm that this time still works for you?

Thank you in advance.

Kind regards,
Mathieu N. Tandu`,
      readingQs: [
        { id:"r1", prompt:"What is the purpose of the email?", options:["To complain","To confirm an appointment","To cancel a reservation"], answer:1, why:"He is confirming an appointment." },
        { id:"r2", prompt:"When is the appointment?", options:["Monday 15 January at 2:30 p.m.","Friday at 7 p.m.","Tuesday at 10 a.m."], answer:0, why:"The email states Monday 15 January at 2:30 p.m." },
        { id:"r3", prompt:"What does Mathieu ask Ms Parker to do?", options:["Send a contract","Confirm the time still works","Change the location"], answer:1, why:"He asks her to confirm the time still works." },
        { id:"r4", prompt:"Which close is used?", options:["Best regards","Kind regards","Sincerely yours"], answer:1, why:"He uses “Kind regards”." }
      ],
      dictTitle: "Play → type the numbers only (date/time/minutes)",
      dictItems: [
        { id:"d1", text:"My appointment is on the 15th.", answer:"15", transcript:"My appointment is on the 15th." },
        { id:"d2", text:"It’s at 2:30 p.m.", answer:"2:30", transcript:"It’s at 2:30 p.m." },
        { id:"d3", text:"Please arrive 10 minutes early.", answer:"10", transcript:"Please arrive 10 minutes early." },
        { id:"d4", text:"Could you confirm at 9:00?", answer:"9:00", transcript:"Could you confirm at 9:00?" },
        { id:"d5", text:"The meeting lasts 30 minutes.", answer:"30", transcript:"The meeting lasts 30 minutes." }
      ],
      ddTitle: "Lines bank (confirmation)",
      ddLines: [
        { id:"l1", text:"Subject: Confirmation of my appointment" },
        { id:"l2", text:"Dear Ms Parker," },
        { id:"l3", text:"I hope you are doing well." },
        { id:"l4", text:"I’m writing to confirm my appointment on Monday 15 January at 2:30 p.m." },
        { id:"l5", text:"Could you please confirm that this time still works for you?" },
        { id:"l6", text:"Thank you in advance." },
        { id:"l7", text:"Kind regards," },
        { id:"l8", text:"Mathieu N. Tandu" },
        { id:"l9", text:"" } // empty line slot to keep 9 slots (matches scoring system)
      ],
      ddOrder: ["l1","l2","l3","l4","l5","l6","l7","l8","l9"],
      fbTitle: "Dropdown builder (confirmation)",
      fillBlanks: [
        { id:"f1", before:"I’m writing to ", after:" my appointment.", options:["confirm","cancel","forget"], correct:"confirm" },
        { id:"f2", before:"My appointment is on Monday 15 January at ", after:".", options:["2:30 p.m.","2:30 a.m.","12:30 p.m."], correct:"2:30 p.m." },
        { id:"f3", before:"Could you please confirm that this time still ", after:" for you?", options:["works","walks","makes"], correct:"works" },
        { id:"f4", before:"Thank you ", after:".", options:["in advance","with advance","for advance"], correct:"in advance" }
      ],
      sbTitle: "Build the key phrase (confirmation)",
      sbTarget: ["I’m","writing","to","confirm","my","appointment","for","Monday","at","2:30","p.m.","."],
      speakingPrompts: [
        "Call to confirm your appointment for Monday at 2:30. Ask politely if the time still works.",
        "You received a confirmation email. Reply to confirm and say you will arrive 10 minutes early.",
        "Confirm an appointment and ask where to go (office/desk/floor)."
      ],
      wTaskTitle: "Task: Confirm your appointment",
      wTaskText: "Write an email to confirm an appointment. Include date + time + a polite confirmation question.",
      wModel:
`Subject: Confirmation of my appointment

Dear Ms Parker,

I hope you are doing well.

I’m writing to confirm my appointment on Monday 15 January at 2:30 p.m. Could you please confirm that this time still works for you?

Thank you in advance.

Kind regards,
Mathieu N. Tandu`
    },

    appointment: {
      id: "appointment",
      icon: "📅",
      title: "Schedule an appointment",
      focus: "Request + propose options + availability",
      desc: "Ask for an appointment (phone/email) and propose two time options.",
      tips: ["Would it be possible…?", "I’m available…", "Please let me know"],
      patternExample: "“Would it be possible to schedule an appointment next week? I’m available on Tuesday at 10:00 or Thursday at 3:00.”",
      phrases: [
        "Would it be possible to schedule an appointment…?",
        "I’m available on … at …",
        "Please let me know what works best."
      ],
      vocab: [
        { id:"v1", icon:"📅", word:"schedule (a meeting)", def:"to plan a time/date", ex:"Could we schedule a meeting next week?" },
        { id:"v2", icon:"🗓️", word:"appointment", def:"a meeting arranged for a specific time", ex:"I’d like to book an appointment." },
        { id:"v3", icon:"📞", word:"reach", def:"contact someone", ex:"You can reach me by email or phone." },
        { id:"v4", icon:"🕒", word:"available", def:"free / not busy", ex:"I’m available on Tuesday morning." },
        { id:"v5", icon:"🔁", word:"alternative", def:"another option", ex:"Do you have an alternative time?" },
        { id:"v6", icon:"🧾", word:"reference number", def:"an ID number for a file/request", ex:"My reference number is 274." },
        { id:"v7", icon:"📍", word:"location", def:"where something is", ex:"Could you confirm the location?" },
        { id:"v8", icon:"⏱️", word:"duration", def:"how long something lasts", ex:"What is the duration of the appointment?" },
        { id:"v9", icon:"✉️", word:"as soon as possible", def:"very quickly", ex:"Could you reply as soon as possible?" },
        { id:"v10", icon:"🤝", word:"thank you for your help", def:"polite phrase", ex:"Thank you for your help with this request." },
        { id:"v11", icon:"🧠", word:"purpose", def:"reason / objective", ex:"The purpose is to discuss my request." },
        { id:"v12", icon:"✅", word:"confirm", def:"to say something is correct/final", ex:"Please confirm the date and time." }
      ],
      quickfire: [
        { prompt:"Request politely:", options:["I want an appointment.","Would it be possible to schedule an appointment?","Give me an appointment.","Make an appointment now."], answer:1, why:"Best tone." },
        { prompt:"Propose options:", options:["Any time is fine.","I’m available Tuesday at 10:00 or Thursday at 3:00.","I can’t.","You choose."], answer:1, why:"Gives two clear options." },
        { prompt:"Ask what time works:", options:["Choose.","Please let me know what works best for you.","Do it.","You decide quickly."], answer:1, why:"Polite." },
        { prompt:"Close:", options:["Bye","Best regards,","See you","Thanks bye"], answer:1, why:"Business close." }
      ],
      readingTitle: "Email (scheduling an appointment)",
      emailText:
`Subject: Request for an appointment

Dear Mr Johnson,

I hope you are doing well.

I’m writing to request an appointment to discuss my account. Would it be possible to meet next week?

I’m available on Tuesday at 10:00 or Thursday at 3:00. If these times do not work, I am happy to consider an alternative.

Please let me know what works best for you.

Best regards,
Mathieu N. Tandu`,
      readingQs: [
        { id:"r1", prompt:"What does Mathieu want?", options:["To schedule an appointment","To cancel an order","To confirm a reservation"], answer:0, why:"He requests an appointment." },
        { id:"r2", prompt:"Which times does he propose?", options:["Tuesday 10:00 and Thursday 3:00","Monday 2:30 and Friday 7:00","Wednesday 9:00 and Sunday 8:00"], answer:0, why:"He proposes Tuesday 10:00 or Thursday 3:00." },
        { id:"r3", prompt:"If these times do not work, what does he say?", options:["He will cancel.","He can consider an alternative.","He refuses to change."], answer:1, why:"He is flexible." },
        { id:"r4", prompt:"How is the email closed?", options:["Kind regards","Best regards","Sincerely yours"], answer:1, why:"He uses Best regards." }
      ],
      dictTitle: "Play → type the numbers only (time/date/duration)",
      dictItems: [
        { id:"d1", text:"I’m available on Tuesday at 10:00.", answer:"10:00", transcript:"I’m available on Tuesday at 10:00." },
        { id:"d2", text:"Thursday at 3:00 also works.", answer:"3:00", transcript:"Thursday at 3:00 also works." },
        { id:"d3", text:"The appointment lasts 45 minutes.", answer:"45", transcript:"The appointment lasts 45 minutes." },
        { id:"d4", text:"My reference number is 274.", answer:"274", transcript:"My reference number is 274." },
        { id:"d5", text:"Could we meet on the 22nd?", answer:"22", transcript:"Could we meet on the 22nd?" }
      ],
      ddTitle: "Lines bank (schedule an appointment)",
      ddLines: [
        { id:"l1", text:"Subject: Request for an appointment" },
        { id:"l2", text:"Dear Mr Johnson," },
        { id:"l3", text:"I hope you are doing well." },
        { id:"l4", text:"I’m writing to request an appointment to discuss my account." },
        { id:"l5", text:"Would it be possible to meet next week?" },
        { id:"l6", text:"I’m available on Tuesday at 10:00 or Thursday at 3:00." },
        { id:"l7", text:"Please let me know what works best for you." },
        { id:"l8", text:"Best regards," },
        { id:"l9", text:"Mathieu N. Tandu" }
      ],
      ddOrder: ["l1","l2","l3","l4","l5","l6","l7","l8","l9"],
      fbTitle: "Dropdown builder (appointment request)",
      fillBlanks: [
        { id:"f1", before:"I’m writing to request an ", after:".", options:["appointment","apartment","appointmentss"], correct:"appointment" },
        { id:"f2", before:"Would it be possible to ", after:" next week?", options:["meet","eat","met"], correct:"meet" },
        { id:"f3", before:"I’m available on Tuesday at 10:00 or Thursday at ", after:".", options:["3:00","13:00","30:00"], correct:"3:00" },
        { id:"f4", before:"Please let me know what works ", after:" for you.", options:["best","better","good"], correct:"best" }
      ],
      sbTitle: "Build the key phrase (request)",
      sbTarget: ["Would","it","be","possible","to","schedule","an","appointment","next","week","?"],
      speakingPrompts: [
        "Call to request an appointment. Propose two options and ask what works best.",
        "Leave a voicemail asking for an appointment and give your phone number clearly.",
        "Request an appointment by email and ask about the duration."
      ],
      wTaskTitle: "Task: Request an appointment",
      wTaskText: "Write an email requesting an appointment. Propose two time options and ask what works best.",
      wModel:
`Subject: Request for an appointment

Dear Mr Johnson,

I hope you are doing well.

I’m writing to request an appointment to discuss my account. Would it be possible to meet next week?

I’m available on Tuesday at 10:00 or Thursday at 3:00. If these times do not work, I am happy to consider an alternative.

Please let me know what works best for you.

Best regards,
Mathieu N. Tandu`
    },

    reservation: {
      id: "reservation",
      icon: "🍽️",
      title: "Make a reservation",
      focus: "People + date/time + confirmation",
      desc: "Make a reservation (restaurant / hotel) with key details and a polite confirmation request.",
      tips: ["I’d like to make a reservation…", "for two", "Could you confirm…?"],
      patternExample: "“I’d like to make a reservation for two on Friday at 7 p.m. Could you please confirm the booking?”",
      phrases: [
        "I’d like to make a reservation for …",
        "Do you have availability on … at …?",
        "Could you please confirm the booking?"
      ],
      vocab: [
        { id:"v1", icon:"📌", word:"reservation", def:"a booking for a service/table/room", ex:"I’d like to make a reservation for Friday." },
        { id:"v2", icon:"🍽️", word:"table for two", def:"a table booked for two people", ex:"Could I reserve a table for two?" },
        { id:"v3", icon:"🕒", word:"available", def:"free / open", ex:"Is 7 p.m. available?" },
        { id:"v4", icon:"📅", word:"date", def:"the day/month/year", ex:"What date would you like?" },
        { id:"v5", icon:"⏱️", word:"time", def:"hour/minutes", ex:"What time would you like to book?" },
        { id:"v6", icon:"👥", word:"party", def:"group of people", ex:"How many people are in your party?" },
        { id:"v7", icon:"📞", word:"by phone", def:"using the telephone", ex:"I’d like to book by phone." },
        { id:"v8", icon:"✉️", word:"confirm the booking", def:"make the reservation official", ex:"Could you confirm the booking by email?" },
        { id:"v9", icon:"🧾", word:"deposit", def:"money paid in advance", ex:"Is a deposit required?" },
        { id:"v10", icon:"🍷", word:"special request", def:"extra requirement (diet/occasion)", ex:"I have a special request: a quiet table." },
        { id:"v11", icon:"🎉", word:"occasion", def:"a special event", ex:"It’s for a birthday occasion." },
        { id:"v12", icon:"📍", word:"address", def:"where a place is located", ex:"Could you confirm the address, please?" }
      ],
      quickfire: [
        { prompt:"Make the reservation:", options:["Reserve me.","I’d like to make a reservation for two.","I take a table.","Give me a table."], answer:1, why:"Natural and polite." },
        { prompt:"Ask if 7 p.m. is free:", options:["Is 7 p.m. available?","7 is free?","You have 7?","I want 7."], answer:0, why:"Correct form." },
        { prompt:"Add a special request politely:", options:["Quiet table.","Could I request a quiet table, please?","You must give me quiet.","No noise."], answer:1, why:"Polite request." },
        { prompt:"Confirm:", options:["Confirm it.","Could you please confirm the booking by email?","Send it now.","Make it done."], answer:1, why:"Professional." }
      ],
      readingTitle: "Email (reservation request)",
      emailText:
`Subject: Reservation request

Dear Reservations Team,

I hope you are doing well.

I’d like to make a reservation for two people on Friday 24 January at 7:00 p.m. Could you please let me know if you have availability?

If possible, I would appreciate a quiet table.

Could you please confirm the booking by email?

Thank you very much.

Kind regards,
Mathieu N. Tandu`,
      readingQs: [
        { id:"r1", prompt:"How many people is the reservation for?", options:["Two","Four","One"], answer:0, why:"It says “for two people”." },
        { id:"r2", prompt:"When is the reservation requested?", options:["Friday 24 January at 7:00 p.m.","Monday at 2:30 p.m.","Tuesday at 10:00"], answer:0, why:"Friday 24 January at 7:00 p.m." },
        { id:"r3", prompt:"What special request does Mathieu make?", options:["A window seat","A quiet table","A free drink"], answer:1, why:"He asks for a quiet table." },
        { id:"r4", prompt:"What does he ask the team to do?", options:["Confirm the booking by email","Cancel a meeting","Send a complaint"], answer:0, why:"He asks for email confirmation." }
      ],
      dictTitle: "Play → type the numbers only (people/time/date)",
      dictItems: [
        { id:"d1", text:"A table for two, please.", answer:"2", transcript:"A table for two, please." },
        { id:"d2", text:"Friday the 24th.", answer:"24", transcript:"Friday the 24th." },
        { id:"d3", text:"At 7:00 p.m.", answer:"7:00", transcript:"At 7:00 p.m." },
        { id:"d4", text:"A deposit of 50 euros is required.", answer:"50", transcript:"A deposit of 50 euros is required." },
        { id:"d5", text:"We will arrive at 6:45.", answer:"6:45", transcript:"We will arrive at 6:45." }
      ],
      ddTitle: "Lines bank (reservation)",
      ddLines: [
        { id:"l1", text:"Subject: Reservation request" },
        { id:"l2", text:"Dear Reservations Team," },
        { id:"l3", text:"I hope you are doing well." },
        { id:"l4", text:"I’d like to make a reservation for two people on Friday 24 January at 7:00 p.m." },
        { id:"l5", text:"Could you please let me know if you have availability?" },
        { id:"l6", text:"If possible, I would appreciate a quiet table." },
        { id:"l7", text:"Could you please confirm the booking by email?" },
        { id:"l8", text:"Kind regards," },
        { id:"l9", text:"Mathieu N. Tandu" }
      ],
      ddOrder: ["l1","l2","l3","l4","l5","l6","l7","l8","l9"],
      fbTitle: "Dropdown builder (reservation)",
      fillBlanks: [
        { id:"f1", before:"I’d like to make a ", after:".", options:["reservation","reservationing","reserve"], correct:"reservation" },
        { id:"f2", before:"A table for ", after:" people, please.", options:["two","to","too"], correct:"two" },
        { id:"f3", before:"Do you have availability on Friday 24 January at ", after:"?", options:["7:00 p.m.","7:00 a.m.","17:00 p.m."], correct:"7:00 p.m." },
        { id:"f4", before:"Could you please confirm the ", after:" by email?", options:["booking","looking","cooking"], correct:"booking" }
      ],
      sbTitle: "Build the key phrase (reservation)",
      sbTarget: ["I’d","like","to","make","a","reservation","for","two","on","Friday","at","7:00","p.m.","."],
      speakingPrompts: [
        "Call a restaurant to make a reservation for two on Friday at 7 p.m. Ask if it’s available.",
        "You made a reservation. Call to confirm the booking and ask about a deposit.",
        "Request a quiet table and confirm the address."
      ],
      wTaskTitle: "Task: Make a reservation",
      wTaskText: "Write an email to make a reservation. Include people + date + time + a confirmation request.",
      wModel:
`Subject: Reservation request

Dear Reservations Team,

I hope you are doing well.

I’d like to make a reservation for two people on Friday 24 January at 7:00 p.m. Could you please let me know if you have availability?

If possible, I would appreciate a quiet table.

Could you please confirm the booking by email?

Thank you very much.

Kind regards,
Mathieu N. Tandu`
    }
  };

  // -------------------------
  // Generic grammar MCQ (works for all scenarios)
  // -------------------------
  const grammarQs = [
    { id:"g1", prompt:"Which is the most professional?", options:["Can you change the meeting?","Could we reschedule our meeting to a later date?","Change the meeting please."], answer:1, why:"“Could we reschedule…?” is polite and natural." },
    { id:"g2", prompt:"Choose the best neutral sentence.", options:["I have a complaint.","I need to handle an urgent issue first.","I’m bored."], answer:1, why:"Neutral and professional." },
    { id:"g3", prompt:"Fix the punctuation:", options:["Could you let me know your availability ?","Could you let me know your availability?","Could you let me know your availability !"], answer:1, why:"No space before ? in English." },
    { id:"g4", prompt:"Choose the best follow-up phrase.", options:["I am writing to follow up regarding our meeting.","I am writing to follow up on our meeting.","I am writing for follow up our meeting."], answer:1, why:"Use “follow up on” (or “regarding”, but not both)." }
  ];

  // -------------------------
  // MCQ builder
  // -------------------------
  function buildMCQ(host, questions, scoreNowEl, scoreMaxEl, prefixKey){
    host.innerHTML = "";
    let now = 0;
    const max = questions.length;
    Score.setSectionScore(scoreNowEl, scoreMaxEl, now, max);

    questions.forEach((q, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "q";
      wrap.innerHTML = `
        <div class="prompt">${idx+1}. ${escapeHtml(q.prompt)}</div>
        <div class="choices"></div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const choices = $(".choices", wrap);
      const fb = $(".feedback", wrap);

      q.options.forEach((opt, oi) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "choiceBtn";
        b.textContent = opt;
        b.addEventListener("click", () => {
          const ok = oi === q.answer;
          fb.classList.remove("hidden","ok","no");
          fb.classList.add(ok ? "ok" : "no");
          fb.textContent = (ok ? "✅ Correct. " : "❌ Not quite. ") + q.why;
          if (ok){
            const got = Score.awardOnce(`${prefixKey}:${q.id}`, 1);
            if (got){
              now += 1;
              Score.setSectionScore(scoreNowEl, scoreMaxEl, now, max);
            }
          }
        });
        choices.appendChild(b);
      });

      host.appendChild(wrap);
    });
  }

  // -------------------------
  // Scenario state
  // -------------------------
  let scenario = SCENARIOS.reschedule;

  let currentVocab = [];
  let currentDictItems = [];
  let currentQuickfire = [];
  let ddLines = [];
  let ddOrder = [];
  let fillBlanks = [];
  let sbTargetTokens = [];
  let sbBankTokens = [];
  let speakingPrompts = [];

  // -------------------------
  // Flashcards
  // -------------------------
  function buildFlashcards(){
    const grid = $("#flashGrid");
    grid.innerHTML = "";
    currentVocab.forEach((v) => {
      const card = document.createElement("div");
      card.className = "flash";
      card.innerHTML = `
        <div class="flash__inner" tabindex="0" role="button" aria-label="Flashcard: ${escapeHtml(v.word)}">
          <div class="flash__face flash__front">
            <div class="flash__top">
              <div class="flash__word"><span class="flash__icon">${v.icon}</span> ${escapeHtml(v.word)}</div>
              <button class="flash__btn" type="button" data-say="front">🔊</button>
            </div>
            <div class="muted">Tap to flip</div>
            <div class="flash__btns">
              <button class="flash__btn" type="button" data-flip>Flip</button>
            </div>
          </div>

          <div class="flash__face flash__back">
            <div class="flash__top">
              <div class="flash__word">${escapeHtml(v.word)}</div>
              <button class="flash__btn" type="button" data-say="back">🔊</button>
            </div>
            <div class="flash__def">${escapeHtml(v.def)}</div>
            <div class="flash__ex"><strong>Example:</strong> ${escapeHtml(v.ex)}</div>
            <div class="flash__btns">
              <button class="flash__btn" type="button" data-flip>Flip</button>
            </div>
          </div>
        </div>
      `;

      const inner = $(".flash__inner", card);
      const flipBtns = $$("[data-flip]", card);
      const sayFront = $("[data-say='front']", card);
      const sayBack = $("[data-say='back']", card);

      function toggleFlip(){ card.classList.toggle("is-flipped"); }

      inner.addEventListener("click", (e) => {
        if ((e.target instanceof Element) && e.target.closest("[data-say]")) return;
        if ((e.target instanceof Element) && e.target.closest("[data-flip]")) return;
        toggleFlip();
      });
      inner.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") toggleFlip();
      });
      flipBtns.forEach(b => b.addEventListener("click", (e) => { e.stopPropagation(); toggleFlip(); }));

      sayFront.addEventListener("click", (e) => { e.stopPropagation(); Speaker.say(`${v.word}.`); });
      sayBack.addEventListener("click", (e) => { e.stopPropagation(); Speaker.say(`${v.word}. ${v.def}. Example: ${v.ex}`); });

      grid.appendChild(card);
    });
  }

  // -------------------------
  // Timed game 1 (vocab)
  // -------------------------
  let gameTimer = null;
  let gameTimeLeft = 60;
  let gamePts = 0;
  let currentGameItem = null;

  function gameRender(){
    $("#gameTime").textContent = String(gameTimeLeft);
    $("#gamePts").textContent = String(gamePts);
  }
  function gamePickNext(){
    if (!currentVocab.length) return;
    const item = currentVocab[Math.floor(Math.random()*currentVocab.length)];
    currentGameItem = item;
    $("#gamePrompt").textContent = item.def;

    const pool = shuffle(currentVocab.filter(v => v.id !== item.id)).slice(0,3);
    const options = shuffle([item, ...pool]);

    const host = $("#gameChoices");
    host.innerHTML = "";
    options.forEach(opt => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choiceBtn";
      b.textContent = `${opt.icon} ${opt.word}`;
      b.addEventListener("click", () => gameChoose(opt.id === item.id));
      host.appendChild(b);
    });
    $("#gameFb").classList.add("hidden");
  }
  function gameChoose(ok){
    const fb = $("#gameFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add(ok ? "ok" : "no");
    fb.textContent = ok ? "✅ Great!" : `❌ Correct: ${currentGameItem.icon} ${currentGameItem.word}`;
    if (ok){ gamePts += 1; gameRender(); }
    setTimeout(() => { if (gameTimer) gamePickNext(); }, 420);
  }
  function gameStart(){
    if (gameTimer) return;
    gameTimeLeft = 60;
    gamePts = 0;
    gameRender();
    gamePickNext();
    gameTimer = setInterval(() => {
      gameTimeLeft -= 1;
      gameRender();
      if (gameTimeLeft <= 0) gameStop(true);
    }, 1000);
  }
  function gameStop(finished=false){
    if (!gameTimer) return;
    clearInterval(gameTimer);
    gameTimer = null;
    const fb = $("#gameFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add("ok");
    fb.textContent = finished ? `⏱️ Time! You scored ${gamePts} point(s).` : "Stopped.";
  }
  function gameReset(){
    if (gameTimer) gameStop(false);
    gameTimeLeft = 60; gamePts = 0;
    gameRender();
    $("#gamePrompt").textContent = "Press Start.";
    $("#gameChoices").innerHTML = "";
    $("#gameFb").classList.add("hidden");
  }

  // -------------------------
  // Timed game 2 (polite quickfire)
  // -------------------------
  let qfTimer = null;
  let qfTimeLeft = 45;
  let qfPts = 0;
  let qfItem = null;

  function qfRender(){
    $("#qfTime").textContent = String(qfTimeLeft);
    $("#qfPts").textContent = String(qfPts);
  }
  function qfPickNext(){
    if (!currentQuickfire.length) return;
    qfItem = currentQuickfire[Math.floor(Math.random()*currentQuickfire.length)];
    $("#qfPrompt").textContent = qfItem.prompt;

    const host = $("#qfChoices");
    host.innerHTML = "";
    qfItem.options.forEach((opt, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choiceBtn";
      b.textContent = opt;
      b.addEventListener("click", () => qfChoose(i === qfItem.answer));
      host.appendChild(b);
    });
    $("#qfFb").classList.add("hidden");
  }
  function qfChoose(ok){
    const fb = $("#qfFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add(ok ? "ok" : "no");
    fb.textContent = ok ? "✅ Nice!" : `❌ Best answer: ${qfItem.options[qfItem.answer]} — ${qfItem.why}`;
    if (ok){ qfPts += 1; qfRender(); }
    setTimeout(() => { if (qfTimer) qfPickNext(); }, 420);
  }
  function qfStart(){
    if (qfTimer) return;
    qfTimeLeft = 45;
    qfPts = 0;
    qfRender();
    qfPickNext();
    qfTimer = setInterval(() => {
      qfTimeLeft -= 1;
      qfRender();
      if (qfTimeLeft <= 0) qfStop(true);
    }, 1000);
  }
  function qfStop(finished=false){
    if (!qfTimer) return;
    clearInterval(qfTimer);
    qfTimer = null;
    const fb = $("#qfFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add("ok");
    fb.textContent = finished ? `⏱️ Time! You scored ${qfPts} point(s).` : "Stopped.";
  }
  function qfReset(){
    if (qfTimer) qfStop(false);
    qfTimeLeft = 45; qfPts = 0;
    qfRender();
    $("#qfPrompt").textContent = "Press Start.";
    $("#qfChoices").innerHTML = "";
    $("#qfFb").classList.add("hidden");
  }

  function stopAllGames(){
    if (gameTimer) gameStop(false);
    if (qfTimer) qfStop(false);
  }

  // -------------------------
  // Dictation (numbers only)
  // -------------------------
  let dict = null;

  function dictPick(){
    if (!currentDictItems.length) return;
    dict = currentDictItems[Math.floor(Math.random()*currentDictItems.length)];
    $("#dPrompt").textContent = "Ready. Press Play.";
    $("#dTranscript").textContent = "";
    $("#dInput").value = "";
    $("#dFb").classList.add("hidden");
  }
  function dictPlay(){ if (!dict) dictPick(); $("#dPrompt").textContent = "Listening…"; Speaker.say(dict.text); }
  function dictStop(){ Speaker.stop(); $("#dPrompt").textContent = "Stopped."; }
  function dictCheck(){
    if (!dict) return;
    const val = ($("#dInput").value || "").trim();
    const ok = val === dict.answer;
    const fb = $("#dFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add(ok ? "ok" : "no");
    fb.textContent = ok ? "✅ Correct!" : `❌ Answer: ${dict.answer}`;
    $("#dTranscript").textContent = dict.transcript;
    if (ok && Score.awardOnce(`dict:${scenario.id}:${dict.id}`, 1)){
      $("#dScore").textContent = String(parseInt($("#dScore").textContent,10)+1);
    }
  }
  function dictReset(){ $("#dScore").textContent = "0"; dictPick(); }

  // -------------------------
  // Drag & drop email builder (with tap mode)
  // -------------------------
  let ddSelected = null;

  function ddClearSelection(){
    ddSelected = null;
    $$(".ddItem").forEach(x => x.classList.remove("is-selected"));
    $$(".ddSlot").forEach(s => s.classList.remove("is-target"));
  }

  function fillSlot(slot, id){
    const line = ddLines.find(l => l.id === id);
    if (!line) return;
    $(".ddSlot__text", slot).textContent = line.text;
    slot.dataset.value = id;
    $(".ddSlot__ph", slot).style.opacity = "0.25";
  }

  function clearSlot(slot){
    $(".ddSlot__text", slot).textContent = "";
    slot.dataset.value = "";
    $(".ddSlot__ph", slot).style.opacity = "1";
  }

  function ddBuild(){
    $("#ddBank").innerHTML = "";
    $("#ddSlots").innerHTML = "";
    $("#ddFb").classList.add("hidden");
    ddSelected = null;

    // keep empty lines draggable but visible (for scenarios that include them)
    const lines = shuffle(ddLines);
    lines.forEach(line => {
      const d = document.createElement("div");
      d.className = "ddItem";
      d.textContent = line.text || "— (empty line)";
      d.draggable = true;
      d.dataset.id = line.id;

      d.addEventListener("dragstart", (e) => {
        if (e.dataTransfer){
          e.dataTransfer.setData("text/plain", line.id);
          e.dataTransfer.effectAllowed = "move";
        }
      });

      d.addEventListener("click", () => {
        if (ddSelected === line.id){
          ddClearSelection();
          return;
        }
        ddSelected = line.id;
        $$(".ddItem").forEach(x => x.classList.remove("is-selected"));
        d.classList.add("is-selected");
        $$(".ddSlot").forEach(s => s.classList.add("is-target"));
      });

      $("#ddBank").appendChild(d);
    });

    ddOrder.forEach((slotId, idx) => {
      const slot = document.createElement("div");
      slot.className = "ddSlot";
      slot.dataset.pos = String(idx);
      slot.dataset.expect = slotId;
      slot.dataset.value = "";
      slot.innerHTML = `<div class="ddSlot__ph">Slot ${idx+1}</div><div class="ddSlot__text"></div><button class="ddSlot__x" type="button" title="Clear">✕</button>`;

      $(".ddSlot__x", slot).addEventListener("click", (e) => { e.stopPropagation(); clearSlot(slot); });

      slot.addEventListener("dragover", (e) => { e.preventDefault(); slot.classList.add("is-target"); });
      slot.addEventListener("dragleave", () => slot.classList.remove("is-target"));
      slot.addEventListener("drop", (e) => {
        e.preventDefault();
        slot.classList.remove("is-target");
        const id = (e.dataTransfer ? e.dataTransfer.getData("text/plain") : "") || "";
        if (!id) return;
        fillSlot(slot, id);
        ddClearSelection();
      });

      slot.addEventListener("click", () => {
        if (ddSelected){
          fillSlot(slot, ddSelected);
          ddClearSelection();
          return;
        }
        clearSlot(slot);
      });

      $("#ddSlots").appendChild(slot);
    });
  }

  function ddCheck(){
    const slots = $$(".ddSlot");
    let correct = 0;

    slots.forEach((s, idx) => {
      const ok = (s.dataset.value||"") === (s.dataset.expect||"");
      if (ok) correct += 1;
      if (ok) Score.awardOnce(`dd:${scenario.id}:${idx}`, 1);
    });

    $("#ddScore").textContent = String(correct);

    const fb = $("#ddFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add(correct === slots.length ? "ok" : "no");
    fb.textContent = correct === slots.length
      ? "✅ Perfect email structure!"
      : `❌ ${correct}/${slots.length} correct. Tip: Subject → greeting → context → request/details → question → thanks → closing → name.`;
  }

  // -------------------------
  // Fill blanks
  // -------------------------
  function fbBuild(){
    const host = $("#fbText");
    host.innerHTML = "";
    $("#fbFb").classList.add("hidden");

    fillBlanks.forEach((b) => {
      const sel = document.createElement("select");
      sel.className = "select";
      sel.dataset.correct = b.correct;
      sel.innerHTML = `<option value="" selected>Choose…</option>` + b.options.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join("");
      host.appendChild(document.createTextNode(b.before));
      host.appendChild(sel);
      host.appendChild(document.createTextNode(b.after + " "));
    });
  }

  function fbCheck(){
    const sels = $$(".select", $("#fbText"));
    let correct = 0;
    sels.forEach((s, idx) => {
      const ok = (s.value||"") === (s.dataset.correct||"");
      if (ok){ correct += 1; Score.awardOnce(`fb:${scenario.id}:${idx}`, 1); }
    });
    $("#fbScore").textContent = String(correct);
    const fb = $("#fbFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add(correct === sels.length ? "ok" : "no");
    fb.textContent = correct === sels.length ? "✅ Great choices!" : `❌ ${correct}/${sels.length}. Review the most natural options.`;
  }

  function fbReset(){ $("#fbScore").textContent = "0"; fbBuild(); $("#fbFb").classList.add("hidden"); }

  // -------------------------
  // Sentence builder (tap mode)
  // -------------------------
  let sbSelectedToken = null;

  function sbClearSel(){
    sbSelectedToken = null;
    $$(".token").forEach(x => x.classList.remove("is-selected"));
    $$(".blank").forEach(b => b.classList.remove("is-target"));
  }

  function sbBuild(){
    sbSelectedToken = null;
    $("#sbFb").classList.add("hidden");
    const line = $("#sbLine");
    const bank = $("#sbBank");
    line.innerHTML = "";
    bank.innerHTML = "";

    sbTargetTokens.forEach((_, idx) => {
      const blank = document.createElement("div");
      blank.className = "blank";
      blank.dataset.pos = String(idx);
      blank.dataset.value = "";
      blank.textContent = "_____";

      blank.addEventListener("dragover", (e) => { e.preventDefault(); blank.classList.add("is-target"); });
      blank.addEventListener("dragleave", () => blank.classList.remove("is-target"));
      blank.addEventListener("drop", (e) => {
        e.preventDefault();
        blank.classList.remove("is-target");
        const token = (e.dataTransfer ? e.dataTransfer.getData("text/plain") : "") || "";
        if (!token) return;
        blank.textContent = token;
        blank.dataset.value = token;
        sbClearSel();
      });

      blank.addEventListener("click", () => {
        if (sbSelectedToken){
          blank.textContent = sbSelectedToken;
          blank.dataset.value = sbSelectedToken;
          sbClearSel();
          return;
        }
        blank.textContent = "_____";
        blank.dataset.value = "";
      });

      line.appendChild(blank);
    });

    sbBankTokens.forEach((t) => {
      const tok = document.createElement("div");
      tok.className = "token";
      tok.textContent = t;
      tok.draggable = true;

      tok.addEventListener("dragstart", (e) => {
        if (e.dataTransfer){
          e.dataTransfer.setData("text/plain", t);
          e.dataTransfer.effectAllowed = "copy";
        }
      });

      tok.addEventListener("click", () => {
        if (sbSelectedToken === t){ sbClearSel(); return; }
        sbSelectedToken = t;
        $$(".token").forEach(x => x.classList.remove("is-selected"));
        tok.classList.add("is-selected");
        $$(".blank").forEach(b => b.classList.add("is-target"));
      });

      bank.appendChild(tok);
    });
  }

  function sbCheck(){
    const blanks = $$(".blank", $("#sbLine"));
    const vals = blanks.map(b => (b.dataset.value || "").trim());
    const ok = vals.join("|") === sbTargetTokens.join("|");
    const fb = $("#sbFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add(ok ? "ok" : "no");
    fb.textContent = ok ? "✅ Perfect sentence!" : "❌ Not yet. Tip: check articles and fixed expressions.";
    if (ok) Score.awardOnce(`sb:${scenario.id}:ok`, 2);
    $("#sbScore").textContent = ok ? "2" : "0";
  }

  function sbReset(){ $("#sbScore").textContent = "0"; sbBuild(); }

  // -------------------------
  // Speaking timers
  // -------------------------
  let prepT = null;
  let speakT = null;
  let prepLeft = 15;
  let speakLeft = 60;

  function spRender(){ $("#prepNow").textContent = String(prepLeft); $("#speakNow").textContent = String(speakLeft); }
  function spReset(){
    if (prepT) clearInterval(prepT);
    if (speakT) clearInterval(speakT);
    prepT = null; speakT = null;
    prepLeft = 15; speakLeft = 60;
    spRender();
    $("#spFb").classList.add("hidden");
  }
  function spPick(){
    if (!speakingPrompts.length) return;
    $("#spPrompt").textContent = speakingPrompts[Math.floor(Math.random()*speakingPrompts.length)];
  }
  function spStart(){
    spReset();
    const fb = $("#spFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add("ok");
    fb.textContent = "✅ Prep time started. Think of your structure.";
    prepT = setInterval(() => {
      prepLeft -= 1;
      spRender();
      if (prepLeft <= 0){
        clearInterval(prepT);
        prepT = null;
        fb.textContent = "🗣️ Speaking time! Start talking.";
        speakT = setInterval(() => {
          speakLeft -= 1;
          spRender();
          if (speakLeft <= 0){
            clearInterval(speakT);
            speakT = null;
            fb.textContent = "⏱️ Stop. Repeat once, improving clarity.";
            Score.awardOnce(`speaking:${scenario.id}:done`, 1);
          }
        }, 1000);
      }
    }, 1000);
  }

  // -------------------------
  // Recording (safe)
  // -------------------------
  let mediaRecorder = null;
  let recChunks = [];
  let recStream = null;
  let recMime = "";

  async function recStart(){
    const fb = $("#recFb");
    fb.classList.add("hidden");
    fb.classList.remove("ok","no");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      fb.classList.remove("hidden"); fb.classList.add("no");
      fb.textContent = "Recording is not supported in this browser/device.";
      return;
    }
    if (!("MediaRecorder" in window)){
      fb.classList.remove("hidden"); fb.classList.add("no");
      fb.textContent = "Recording is not supported here. Practise speaking without recording.";
      return;
    }

    try{
      recStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }catch(e){
      fb.classList.remove("hidden"); fb.classList.add("no");
      fb.textContent = "Microphone access was not granted.";
      return;
    }

    recMime = "";
    const tryTypes = ["audio/webm;codecs=opus","audio/webm","audio/mp4","audio/aac"];
    if (typeof MediaRecorder.isTypeSupported === "function"){
      for (const t of tryTypes){
        if (MediaRecorder.isTypeSupported(t)){ recMime = t; break; }
      }
    }

    try{
      mediaRecorder = recMime ? new MediaRecorder(recStream, { mimeType: recMime }) : new MediaRecorder(recStream);
    }catch(e){
      fb.classList.remove("hidden"); fb.classList.add("no");
      fb.textContent = "Recording is not supported on this browser (MediaRecorder).";
      recStream.getTracks().forEach(t => t.stop());
      recStream = null;
      return;
    }

    recChunks = [];
    mediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size) recChunks.push(e.data); };
    mediaRecorder.onstop = () => {
      const type = recMime || "audio/webm";
      const blob = new Blob(recChunks, { type });
      const url = URL.createObjectURL(blob);
      const audio = $("#recAudio");
      audio.src = url;
      audio.classList.remove("hidden");
      const dl = $("#recDl");
      dl.href = url;
      dl.download = (type.includes("mp4") || type.includes("aac")) ? "speaking-practice.m4a" : "speaking-practice.webm";
      dl.classList.remove("hidden");
      Score.awardOnce(`recording:${scenario.id}:done`, 1);
    };

    mediaRecorder.start();
    fb.classList.remove("hidden");
    fb.classList.add("ok");
    fb.textContent = "✅ Recording…";
  }

  function recStop(){
    if (mediaRecorder && mediaRecorder.state !== "inactive"){
      mediaRecorder.stop();
    }
    if (recStream){
      recStream.getTracks().forEach(t => t.stop());
      recStream = null;
    }
  }

  function recClear(){
    recStop();
    $("#recAudio").classList.add("hidden");
    $("#recDl").classList.add("hidden");
    $("#recAudio").src = "";
    $("#recDl").removeAttribute("href");
    $("#recFb").classList.add("hidden");
  }

  // -------------------------
  // Writing (scenario checklist)
  // -------------------------
  function wReset(){
    $("#wText").value = "";
    $("#wFb").classList.add("hidden");

    const items = ["cPurpose","cDetails","cPolite","cClose","cClarity"];
    items.forEach(id => {
      const el = $("#"+id);
      const label = el.textContent.replace(/^⬜\s*|^✅\s*/,"");
      el.textContent = "⬜ " + label;
    });
  }

  function wListen(){
    const t = ($("#wText").value || "").trim();
    if (!t){ alert("Write something first."); return; }
    Speaker.say(t);
  }

  function wCheck(){
    const raw = ($("#wText").value || "");
    const t = raw.toLowerCase();

    const fb = $("#wFb");
    fb.classList.remove("hidden","ok","no");

    // common checks across scenarios
    const hasPurpose = /(writing|would it be possible|i’d like|i am writing|request|confirm|reschedul|postpon|reservation|appointment)/.test(t);
    const hasDetails = /(\d{1,2}:\d{2}|\b\d{1,4}\b|monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december|people|for two|party)/.test(t);
    const hasPolite  = /(could|would|please|thank you|thank you in advance|kind regards|best regards)/.test(t);
    const hasClose   = /(best regards|kind regards|sincerely|thank you)/.test(t);
    const concise    = raw.trim().split(/\n+/).length >= 5; // at least 5 lines

    const checks = [
      ["cPurpose", hasPurpose],
      ["cDetails", hasDetails],
      ["cPolite", hasPolite],
      ["cClose", hasClose],
      ["cClarity", concise]
    ];
    let okCount = 0;
    checks.forEach(([id, ok]) => {
      const el = $("#"+id);
      const label = el.textContent.replace(/^⬜\s*|^✅\s*/,"");
      el.textContent = (ok ? "✅ " : "⬜ ") + label;
      if (ok) okCount += 1;
    });

    fb.classList.add(okCount >= 4 ? "ok" : "no");
    fb.textContent = okCount >= 4 ? "✅ Good! Keep it short and clear." : "❌ Add missing elements from the checklist.";
    if (okCount >= 4) Score.awardOnce(`writing:${scenario.id}:check`, 2);
  }

  // -------------------------
  // Scenario UI render
  // -------------------------
  function renderScenarioUI(){
    $("#scenarioIcon").textContent = scenario.icon;
    $("#scenarioTitle").textContent = scenario.title;
    $("#scenarioFocus").textContent = scenario.focus;
    $("#scenarioDesc").textContent = scenario.desc;

    const tipsHost = $("#scenarioTips");
    tipsHost.innerHTML = "";
    scenario.tips.forEach(t => {
      const chip = document.createElement("span");
      chip.className = "tipchip";
      chip.textContent = "✨ " + t;
      tipsHost.appendChild(chip);
    });

    $("#scenarioPatternExample").textContent = scenario.patternExample;

    const phrasesHost = $("#scenarioPhrases");
    phrasesHost.innerHTML = "<ul class='list'>" + scenario.phrases.map(p => `<li>${escapeHtml(p)}</li>`).join("") + "</ul>";

    // Reading
    $("#readingTitle").textContent = scenario.readingTitle;
    $("#scenarioEmail").textContent = scenario.emailText;

    // Dict / DD / FB / SB titles
    $("#dictTitle").textContent = scenario.dictTitle;
    $("#ddTitle").textContent = scenario.ddTitle;
    $("#fbTitle").textContent = scenario.fbTitle;
    $("#sbTitle").textContent = scenario.sbTitle;

    // Writing model / task
    $("#wTaskTitle").textContent = scenario.wTaskTitle;
    $("#wTaskText").textContent = scenario.wTaskText;
    $("#wModel").textContent = scenario.wModel;
  }

  function loadScenario(id){
    stopAllGames();
    Speaker.stop();

    scenario = SCENARIOS[id] || SCENARIOS.reschedule;

    // update scenario-bound data
    currentVocab = scenario.vocab.slice();
    currentDictItems = scenario.dictItems.slice();
    currentQuickfire = scenario.quickfire.slice();
    ddLines = scenario.ddLines.slice();
    ddOrder = scenario.ddOrder.slice();
    fillBlanks = scenario.fillBlanks.slice();
    sbTargetTokens = scenario.sbTarget.slice();
    sbBankTokens = shuffle(scenario.sbTarget.slice());
    speakingPrompts = scenario.speakingPrompts.slice();

    // reset scoring
    Score.reset();
    // Max score remains consistent: grammar 4 + reading 4 + dict 5 + dd 9 + fb 4 + sb 2 + speaking 1 + recording 1 + writing 2 = 32
    Score.setMax(32);

    // Render UI text
    renderScenarioUI();

    // Flashcards + games
    buildFlashcards();
    gameReset();
    qfReset();

    // Grammar quiz (static)
    $("#grammarQuiz").innerHTML = "";
    buildMCQ($("#grammarQuiz"), grammarQs, $("#gScore"), $("#gMax"), `g:${scenario.id}`);
    $("#gScore").textContent = "0";

    // Reading quiz (scenario)
    $("#readingQuiz").innerHTML = "";
    buildMCQ($("#readingQuiz"), scenario.readingQs, $("#rScore"), $("#rMax"), `r:${scenario.id}`);
    $("#rScore").textContent = "0";

    // Dictation
    $("#dScore").textContent = "0";
    $("#dMax").textContent = String(currentDictItems.length);
    dict = null;
    dictPick();

    // Email builder
    $("#ddScore").textContent = "0";
    $("#ddMax").textContent = String(ddOrder.length);
    ddBuild();

    // Fill blanks
    $("#fbScore").textContent = "0";
    $("#fbMax").textContent = String(fillBlanks.length);
    fbBuild();

    // Sentence builder
    $("#sbScore").textContent = "0";
    $("#sbMax").textContent = "2";
    sbBuild();

    // Speaking
    spPick();
    spReset();

    // Recording / Writing
    recClear();
    wReset();
  }

  // -------------------------
  // Init
  // -------------------------
  function init(){
    if (isTouchDevice()){
      $("#ipadBox").classList.remove("hidden");
    }

    Speaker.setAccent("US");
    $("#accentUS").addEventListener("click", () => Speaker.setAccent("US"));
    $("#accentUK").addEventListener("click", () => Speaker.setAccent("UK"));
    $("#btnStopAudio").addEventListener("click", () => Speaker.stop());

    // Scenario dropdown
    const sel = $("#scenarioSelect");
    sel.innerHTML = "";
    Object.values(SCENARIOS).forEach(sc => {
      const o = document.createElement("option");
      o.value = sc.id;
      o.textContent = `${sc.icon} ${sc.title}`;
      sel.appendChild(o);
    });
    sel.addEventListener("change", () => loadScenario(sel.value));

    // Buttons (static handlers)
    $("#fcShuffle").addEventListener("click", () => { currentVocab = shuffle(currentVocab); buildFlashcards(); });
    $("#fcReset").addEventListener("click", () => { currentVocab = scenario.vocab.slice(); buildFlashcards(); });

    $("#allStopGames").addEventListener("click", stopAllGames);

    $("#gameStart").addEventListener("click", gameStart);
    $("#gameStop").addEventListener("click", () => gameStop(false));
    $("#gameReset").addEventListener("click", gameReset);

    $("#qfStart").addEventListener("click", qfStart);
    $("#qfStop").addEventListener("click", () => qfStop(false));
    $("#qfReset").addEventListener("click", qfReset);

    $("#gReset").addEventListener("click", () => {
      $("#grammarQuiz").innerHTML = "";
      buildMCQ($("#grammarQuiz"), grammarQs, $("#gScore"), $("#gMax"), `g:${scenario.id}`);
      $("#gScore").textContent = "0";
    });

    $("#rReset").addEventListener("click", () => {
      $("#readingQuiz").innerHTML = "";
      buildMCQ($("#readingQuiz"), scenario.readingQs, $("#rScore"), $("#rMax"), `r:${scenario.id}`);
      $("#rScore").textContent = "0";
    });

    $("#readListen").addEventListener("click", () => Speaker.say($("#scenarioEmail").textContent));

    // Dictation controls
    $("#dPlay").addEventListener("click", dictPlay);
    $("#dStop").addEventListener("click", dictStop);
    $("#dNew").addEventListener("click", dictPick);
    $("#dCheck").addEventListener("click", dictCheck);
    $("#dReset").addEventListener("click", dictReset);

    // Email builder controls
    $("#ddReset").addEventListener("click", () => { $("#ddScore").textContent = "0"; ddBuild(); });
    $("#ddCheck").addEventListener("click", ddCheck);

    // Fill blanks controls
    $("#fbReset").addEventListener("click", fbReset);
    $("#fbCheck").addEventListener("click", fbCheck);

    // Sentence builder controls
    $("#sbReset").addEventListener("click", sbReset);
    $("#sbCheck").addEventListener("click", sbCheck);

    // Speaking controls
    $("#spStart").addEventListener("click", spStart);
    $("#spNew").addEventListener("click", () => { spPick(); spReset(); });
    $("#spReset").addEventListener("click", spReset);

    // Recording
    $("#recStart").addEventListener("click", recStart);
    $("#recStop").addEventListener("click", recStop);
    $("#recClear").addEventListener("click", recClear);

    // Writing
    $("#wReset").addEventListener("click", wReset);
    $("#wListen").addEventListener("click", wListen);
    $("#wCheck").addEventListener("click", wCheck);

    // Reset all (keeps same scenario)
    $("#resetAll").addEventListener("click", () => loadScenario($("#scenarioSelect").value || scenario.id));

    // load default
    sel.value = "reschedule";
    loadScenario("reschedule");
  }

  document.addEventListener("DOMContentLoaded", init);
})();