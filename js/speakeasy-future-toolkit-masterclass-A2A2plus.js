(function(){
  'use strict';
  function $(sel,root){ return (root||document).querySelector(sel); }
  function $all(sel,root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function norm(s){ return String(s||'').trim().toLowerCase().replace(/\s+/g,' '); }
  function shuffle(arr){ var a=arr.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  function esc(s){ return String(s).replace(/[&<>"']/g,function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); }); }

  var STORE='SET_future_toolkit_masterclass_v1';
  var state=load() || {score:0, solved:{}, accent:'US', speed:'normal', hints:true};

  var MODEL_STORIES={"family": {"title": "🇩🇰 Model story — Plans to visit Denmark + keep in touch", "en": ["Next month, I’m going to visit Denmark.", "First, I’m going to book the flight this weekend.", "Then, I’m calling my daughter‑in‑law on Saturday at 3 p.m.", "After that, I’ll send photos tonight.", "Finally, I think it will be a great trip."], "fr": ["Le mois prochain, je vais visiter le Danemark.", "D’abord, je vais réserver le vol ce week‑end.", "Ensuite, j’appelle ma belle‑fille samedi à 15h.", "Après ça, j’enverrai les photos ce soir.", "Enfin, je pense que ce sera un super voyage."], "vocab": [["to book", "réserver"], ["on Saturday at 3", "samedi à 15h"], ["tonight", "ce soir"], ["next month", "le mois prochain"], ["great", "super"]], "mini": [{"q": "When is the trip?", "a": "Next month", "opts": ["Next month", "Yesterday", "Last year"]}, {"q": "Which form shows an arrangement?", "a": "I’m calling…", "opts": ["I’m calling…", "I’ll help…", "I’m going to visit…"]}, {"q": "Which word means “ce soir”?", "a": "tonight", "opts": ["tonight", "tomorrow", "next week"]}]}, "vet": {"title": "🐿️ Model story — Vet clinic plan (tomorrow)", "en": ["Tomorrow, I’m working at the vet clinic.", "First, I’m going to prepare gloves and a carrier.", "Then, I’m meeting the vet at 9 a.m.", "After that, I’ll send an update message to the team.", "Finally, we’re having a follow-up next week."], "fr": ["Demain, je travaille au cabinet vétérinaire.", "D’abord, je vais préparer des gants et une cage de transport.", "Ensuite, je rencontre le vétérinaire à 9h.", "Après ça, j’enverrai un message de mise à jour à l’équipe.", "Enfin, nous avons un suivi la semaine prochaine."], "vocab": [["gloves", "gants"], ["carrier", "cage de transport"], ["update message", "message de mise à jour"], ["follow-up", "suivi"], ["tomorrow", "demain"]], "mini": [{"q": "When is the work?", "a": "Tomorrow", "opts": ["Tomorrow", "Last month", "In 2024"]}, {"q": "Which form is a plan?", "a": "going to prepare", "opts": ["going to prepare", "am meeting", "will send"]}, {"q": "What is next week?", "a": "a follow-up", "opts": ["a follow-up", "a safari", "a timetable"]}]}, "youth": {"title": "🧑‍⚖️ Model story — Youth support schedule (next week)", "en": ["Next week, I’m meeting the team on Tuesday at 10.", "First, I’m going to read the case file.", "Then, I’ll write a short report tonight.", "After that, we’re scheduling a follow-up meeting.", "Finally, the hearing starts at 9."], "fr": ["La semaine prochaine, je rencontre l’équipe mardi à 10h.", "D’abord, je vais lire le dossier.", "Ensuite, j’écrirai un court rapport ce soir.", "Après ça, nous planifions un rendez-vous de suivi.", "Enfin, l’audience commence à 9h."], "vocab": [["case file", "dossier"], ["report", "rapport"], ["follow-up", "suivi"], ["hearing", "audience"], ["starts", "commence"]], "mini": [{"q": "Which sentence is a timetable?", "a": "The hearing starts at 9.", "opts": ["The hearing starts at 9.", "I’m going to read…", "I’ll write…"]}, {"q": "Which form is a decision/promise?", "a": "I’ll write…", "opts": ["I’ll write…", "I’m meeting…", "I’m going to read…"]}, {"q": "Which preposition is correct?", "a": "on Tuesday at 10", "opts": ["on Tuesday at 10", "in Tuesday in 10", "at Tuesday on 10"]}]}};
  var TIME_WORDS=[{"icon": "📅", "en": "tomorrow", "fr": "demain", "ex": "Tomorrow, I’m calling you."}, {"icon": "🗓️", "en": "next week / next month", "fr": "la semaine prochaine / le mois prochain", "ex": "Next week, I’m meeting the team."}, {"icon": "⏳", "en": "in two days / in three weeks", "fr": "dans deux jours / dans trois semaines", "ex": "In two days, I’m going to visit my friend."}, {"icon": "📌", "en": "on Friday", "fr": "vendredi", "ex": "On Friday, I’m meeting you."}, {"icon": "⏰", "en": "at 3 p.m.", "fr": "à 15h", "ex": "At 3 p.m., I’ll call you."}, {"icon": "🕘", "en": "this weekend", "fr": "ce week‑end", "ex": "This weekend, I’m going to practise."}, {"icon": "🌙", "en": "tonight", "fr": "ce soir", "ex": "Tonight, I’ll send the photos."}];
  var CONNECTORS=[{"icon": "1️⃣", "en": "First,", "fr": "D’abord,"}, {"icon": "2️⃣", "en": "Then,", "fr": "Ensuite,"}, {"icon": "➡️", "en": "After that,", "fr": "Après ça,"}, {"icon": "🏁", "en": "Finally,", "fr": "Enfin,"}, {"icon": "⚖️", "en": "But", "fr": "Mais"}, {"icon": "💡", "en": "Because", "fr": "Parce que"}, {"icon": "➡️", "en": "So", "fr": "Donc"}];
  var FUTURE_FORMS=[{"key": "going_to", "icon": "🟨", "title": "Be going to (plan / intention)", "fr": "Aller + infinitif (plan)", "rule": "Use for plans and intentions.", "form": "am/is/are + going to + base verb", "examples": ["I’m going to visit Denmark next month.", "She’s going to call her daughter‑in‑law tomorrow.", "We’re going to practise every day."], "quiz": [{"q": "Plan:", "opts": ["I’m going to call you tomorrow.", "I will going to call you tomorrow.", "I going to call you tomorrow."], "a": "I’m going to call you tomorrow.", "hint": "am/is/are + going to + verb", "why": "Plan → be going to."}, {"q": "Negative:", "opts": ["I’m not going to go.", "I don’t going to go.", "I not going to go."], "a": "I’m not going to go.", "hint": "am/is/are not going to", "why": "Negative: am not going to."}, {"q": "Question:", "opts": ["Are you going to visit Denmark?", "Do you going to visit Denmark?", "Is you going to visit Denmark?"], "a": "Are you going to visit Denmark?", "hint": "Are + you + going to", "why": "Question: Are you going to…?"}, {"q": "Short answer: Are you going to call? — Yes, I ____.", "opts": ["am", "do", "will"], "a": "am", "hint": "Short answers use am/are/is", "why": "Yes, I am."}]}, {"key": "will", "icon": "🟩", "title": "Will (decision now / offer / prediction)", "fr": "Will (décision / proposition)", "rule": "Use for decisions now, offers, promises, predictions.", "form": "will + base verb (I’ll = I will)", "examples": ["I’ll help you with your English.", "I’ll call you now.", "I think it will be great."], "quiz": [{"q": "Offer:", "opts": ["I’ll help you.", "I’m going to help you (offer).", "I helping you."], "a": "I’ll help you.", "hint": "offer → will", "why": "Offer/promise → will."}, {"q": "Decision now:", "opts": ["I’ll call you now.", "I’m going to call you now (decision).", "I call you now."], "a": "I’ll call you now.", "hint": "decision now → will", "why": "Decision now → will."}, {"q": "Negative:", "opts": ["I won’t be late.", "I don’t will be late.", "I not will be late."], "a": "I won’t be late.", "hint": "won’t = will not", "why": "Negative: won’t."}, {"q": "Question:", "opts": ["Will you call me later?", "Do you will call me later?", "Will you calling me later?"], "a": "Will you call me later?", "hint": "Will + subject + base", "why": "Will questions: Will you + base verb?"}]}, {"key": "present_cont", "icon": "🟦", "title": "Present continuous (arrangement)", "fr": "Présent continu (rendez‑vous)", "rule": "Use for fixed arrangements: date + time + place.", "form": "am/is/are + verb‑ing + time", "examples": ["I’m meeting the team on Tuesday at 10.", "We’re having a follow‑up next week.", "She’s visiting Denmark in July."], "quiz": [{"q": "Arrangement:", "opts": ["I’m meeting you on Friday at 6.", "I meet you on Friday at 6.", "I’ll meeting you on Friday at 6."], "a": "I’m meeting you on Friday at 6.", "hint": "am/is/are + -ing + time", "why": "Fixed arrangement → present continuous."}, {"q": "Question:", "opts": ["Are you meeting the team tomorrow?", "Do you meeting the team tomorrow?", "Are you meet the team tomorrow?"], "a": "Are you meeting the team tomorrow?", "hint": "Are + you + -ing", "why": "Question: Are you meeting…?"}, {"q": "Negative:", "opts": ["I’m not working tomorrow.", "I don’t working tomorrow.", "I’m not work tomorrow."], "a": "I’m not working tomorrow.", "hint": "am not + -ing", "why": "Negative: I’m not working."}, {"q": "Time prepositions:", "opts": ["on Friday at 3 p.m.", "in Friday at 3 p.m.", "on Friday in 3 p.m."], "a": "on Friday at 3 p.m.", "hint": "on day / at time", "why": "On + day, at + time."}]}, {"key": "present_simple_tt", "icon": "🟪", "title": "Present simple (timetable)", "fr": "Présent simple (horaire)", "rule": "Use for timetables / schedules (train leaves, class starts).", "form": "present simple + time", "examples": ["The train leaves at 8.", "The meeting starts at 10.", "The course finishes on Friday."], "quiz": [{"q": "Timetable:", "opts": ["The train leaves at 8.", "The train is leaving at 8 (timetable).", "The train will leaves at 8."], "a": "The train leaves at 8.", "hint": "timetable → present simple", "why": "Schedules often use present simple."}, {"q": "Question:", "opts": ["What time does it start?", "What time do it start?", "What time is it start?"], "a": "What time does it start?", "hint": "does + base", "why": "Present simple question uses does."}, {"q": "Negative:", "opts": ["The class doesn’t start at 9.", "The class don’t start at 9.", "The class doesn’t starts at 9."], "a": "The class doesn’t start at 9.", "hint": "doesn’t + base", "why": "Negative: doesn’t + base."}, {"q": "3rd person:", "opts": ["The meeting starts at 10.", "The meeting start at 10.", "The meeting is start at 10."], "a": "The meeting starts at 10.", "hint": "starts", "why": "3rd person singular adds -s."}]}];
  var VOCAB=[{"cat": "Time words", "icon": "📅", "en": "tomorrow", "fr": "demain", "def": "future time marker", "ex": "Tomorrow, I’m calling you."}, {"cat": "Time words", "icon": "🗓️", "en": "next week / next month", "fr": "la semaine prochaine / le mois prochain", "def": "future time marker", "ex": "Next week, I’m meeting the team."}, {"cat": "Time words", "icon": "⏳", "en": "in two days / in three weeks", "fr": "dans deux jours / dans trois semaines", "def": "future time marker", "ex": "In two days, I’m going to visit my friend."}, {"cat": "Time words", "icon": "📌", "en": "on Friday", "fr": "vendredi", "def": "future time marker", "ex": "On Friday, I’m meeting you."}, {"cat": "Time words", "icon": "⏰", "en": "at 3 p.m.", "fr": "à 15h", "def": "future time marker", "ex": "At 3 p.m., I’ll call you."}, {"cat": "Time words", "icon": "🕘", "en": "this weekend", "fr": "ce week‑end", "def": "future time marker", "ex": "This weekend, I’m going to practise."}, {"cat": "Time words", "icon": "🌙", "en": "tonight", "fr": "ce soir", "def": "future time marker", "ex": "Tonight, I’ll send the photos."}, {"cat": "Planning verbs", "icon": "📞", "en": "to call", "fr": "appeler", "def": "phone someone", "ex": "I’ll call you at 3 p.m."}, {"cat": "Planning verbs", "icon": "📩", "en": "to send", "fr": "envoyer", "def": "send a message/email", "ex": "I’ll send the photos tonight."}, {"cat": "Planning verbs", "icon": "🗓️", "en": "to schedule", "fr": "planifier", "def": "put on a calendar", "ex": "We’re scheduling a follow-up meeting."}, {"cat": "Planning verbs", "icon": "🤝", "en": "to meet", "fr": "rencontrer", "def": "see someone", "ex": "I’m meeting the team next week."}, {"cat": "Planning verbs", "icon": "✈️", "en": "to visit", "fr": "visiter / rendre visite", "def": "go to see a place/person", "ex": "I’m going to visit Denmark next month."}, {"cat": "Planning verbs", "icon": "🧳", "en": "to pack", "fr": "faire sa valise", "def": "prepare your luggage", "ex": "I’m packing tonight."}, {"cat": "Planning verbs", "icon": "🎟️", "en": "to book", "fr": "réserver", "def": "reserve tickets/hotel", "ex": "I’m going to book a flight."}, {"cat": "Planning verbs", "icon": "🧑‍⚖️", "en": "court hearing", "fr": "audience", "def": "a meeting in court", "ex": "I’m attending a hearing next month."}, {"cat": "Planning verbs", "icon": "🐿️", "en": "vet clinic", "fr": "cabinet vétérinaire", "def": "place where a vet works", "ex": "I’m working at the vet clinic tomorrow."}, {"cat": "Planning verbs", "icon": "🩺", "en": "to volunteer", "fr": "faire du bénévolat", "def": "work for free to help", "ex": "I’m going to volunteer on Saturday."}];
  var MCQ=[{"q": "Choose the best future: (plan) I ____ visit Denmark next month.", "opts": ["am going to", "will", "am visiting"], "a": "am going to", "hint": "plan → going to", "why": "Plan/intention → be going to."}, {"q": "Choose the best future: (arrangement) I ____ meeting the team on Tuesday at 10.", "opts": ["am", "will be", "am going to"], "a": "am", "hint": "present continuous: am meeting", "why": "Arrangement → present continuous (I’m meeting…)."}, {"q": "Choose the best future: (offer) Don’t worry, I ____ help you.", "opts": ["will", "am going to", "am helping"], "a": "will", "hint": "offer → will", "why": "Offer/promise → will."}, {"q": "Negative (going to): I ____ going to be late.", "opts": ["am not", "don't", "won't"], "a": "am not", "hint": "am not going to", "why": "Negative going to: am not going to."}, {"q": "Question (going to): ____ you going to call her tomorrow?", "opts": ["Are", "Do", "Will"], "a": "Are", "hint": "Are you going to…", "why": "Are + you + going to."}, {"q": "Question (will): ____ you call me later?", "opts": ["Will", "Do", "Are"], "a": "Will", "hint": "Will + subject + base", "why": "Will you call…"}, {"q": "Arrangement: She ____ visiting Denmark in July.", "opts": ["is", "will", "does"], "a": "is", "hint": "She is visiting", "why": "Arrangement → present continuous."}, {"q": "Timetable: The train ____ at 8.", "opts": ["leaves", "is leaving", "will leaves"], "a": "leaves", "hint": "timetable uses present simple", "why": "Schedule/timetable → present simple."}, {"q": "Time preposition: I’m meeting you ____ Friday ____ 3 p.m.", "opts": ["on / at", "in / on", "at / in"], "a": "on / at", "hint": "on day, at time", "why": "On Friday, at 3 p.m."}, {"q": "Choose: Tonight, I ____ send the photos.", "opts": ["will", "am", "am going"], "a": "will", "hint": "decision/promise", "why": "Simple promise/decision → will."}, {"q": "Choose: Next week, we ____ having a follow-up meeting.", "opts": ["are", "will", "do"], "a": "are", "hint": "are having", "why": "Arrangement: we’re having."}, {"q": "Choose: I think it ____ be great.", "opts": ["will", "am going to", "am"], "a": "will", "hint": "prediction", "why": "Prediction: will."}, {"q": "Short answer: Will you help? — Yes, I ____.", "opts": ["will", "am", "do"], "a": "will", "hint": "Yes, I will", "why": "Short answers with will: Yes, I will."}, {"q": "Short answer: Are you meeting her? — No, I ____.", "opts": ["am not", "won't", "don't"], "a": "am not", "hint": "No, I’m not", "why": "Present continuous short answer."}, {"q": "Choose: In two days, I ____ call you.", "opts": ["am going to", "am calling", "will"], "a": "am going to", "hint": "plan", "why": "Plan: going to."}, {"q": "Choose: This weekend, I ____ practise English.", "opts": ["am going to", "am practised", "will practised"], "a": "am going to", "hint": "going to + base", "why": "Going to + base verb."}, {"q": "Choose: What time ____ the meeting start?", "opts": ["does", "do", "is"], "a": "does", "hint": "present simple question", "why": "Timetable: does + base."}, {"q": "Choose: The class ____ on Friday.", "opts": ["finishes", "is finishing", "finish"], "a": "finishes", "hint": "3rd person -s", "why": "Present simple timetable: finishes."}, {"q": "Choose: I ____ not going to change the plan.", "opts": ["am", "will", "do"], "a": "am", "hint": "I am not going to", "why": "Am not going to."}, {"q": "Choose connector: ____ , we’re going to book the flight.", "opts": ["First", "Because", "However"], "a": "First", "hint": "sequencing", "why": "First to start a plan."}, {"q": "Choose connector: It’s expensive, ____ we will compare prices.", "opts": ["so", "while", "yet"], "a": "so", "hint": "result", "why": "So = result."}, {"q": "Choose: I ____ send you a message. (decision now)", "opts": ["will", "am going to", "am sending"], "a": "will", "hint": "decision now", "why": "Decision now → will."}, {"q": "Choose: I ____ seeing her tomorrow at 5. (arrangement)", "opts": ["am", "will", "do"], "a": "am", "hint": "am seeing", "why": "Arrangement → present continuous."}];
  var FIB=[{"id": "fib1", "sent": "Tomorrow, I ____ (call) you.", "a": "will call", "hint": "promise/decision → will call"}, {"id": "fib2", "sent": "Next week, I ____ (meet) the team.", "a": "am meeting", "hint": "arrangement → am meeting"}, {"id": "fib3", "sent": "I ____ (be) going to visit Denmark next month.", "a": "am", "hint": "I am going to…"}, {"id": "fib4", "sent": "She ____ (not) going to be late.", "a": "isn't", "hint": "She isn’t going to…"}, {"id": "fib5", "sent": "____ you going to book a flight?", "a": "Are", "hint": "Are you going to…?"}, {"id": "fib6", "sent": "I think it ____ (be) great.", "a": "will be", "hint": "prediction → will be"}, {"id": "fib7", "sent": "We ____ (have) a follow-up on Tuesday.", "a": "are having", "hint": "arrangement → are having"}, {"id": "fib8", "sent": "The train ____ (leave) at 8.", "a": "leaves", "hint": "timetable → present simple"}, {"id": "fib9", "sent": "I’m meeting you ____ Friday ____ 3 p.m.", "a": "on at", "hint": "on + day, at + time"}, {"id": "fib10", "sent": "I ____ not going to change the plan.", "a": "am", "hint": "I am not going to…"}, {"id": "fib11", "sent": "Don’t worry. I ____ help you.", "a": "will", "hint": "offer → will"}, {"id": "fib12", "sent": "Tonight, I ____ (send) the photos.", "a": "will send", "hint": "will + base verb"}, {"id": "fib13", "sent": "In two days, I ____ (visit) my friend.", "a": "am going to visit", "hint": "plan → going to visit"}, {"id": "fib14", "sent": "What time ____ the meeting start?", "a": "does", "hint": "does + base verb"}, {"id": "fib15", "sent": "The class ____ (finish) on Friday.", "a": "finishes", "hint": "3rd person -s"}, {"id": "fib16", "sent": "No, I ____ not meeting her tomorrow.", "a": "am", "hint": "No, I am not…"}, {"id": "fib17", "sent": "Yes, I ____ (short answer). Will you call?", "a": "will", "hint": "Yes, I will."}, {"id": "fib18", "sent": "We ____ going to practise this weekend.", "a": "are", "hint": "We are going to…"}];
  var STORIES=[{"id": "plan1", "title": "🇩🇰 Denmark trip plan", "hint": "First/Then/After that/Finally", "target": ["First, I’m going to book the flight.", "Then, I’m meeting my friend on Friday at 6.", "After that, I’ll pack my suitcase tonight.", "Finally, I’m going to visit Denmark next month."]}, {"id": "plan2", "title": "🐿️ Vet clinic plan", "hint": "Use arrangements + will/going to", "target": ["First, I’m working at the vet clinic tomorrow.", "Then, I’m going to prepare gloves and a carrier.", "After that, I’ll send an update message tonight.", "Finally, we’re having a follow-up next week."]}, {"id": "plan3", "title": "🧑‍⚖️ Youth support plan", "hint": "on/at + schedule", "target": ["First, I’m meeting the team on Tuesday at 10.", "Then, I’m going to read the case file.", "After that, I’ll write a short report.", "Finally, we’re scheduling a follow-up meeting."]}, {"id": "plan4", "title": "📞 Family call plan", "hint": "question + time", "target": ["First, I’m going to call you this weekend.", "Then, I’ll ask: Will you be free on Saturday?", "After that, I’m sending the photos tonight.", "Finally, we’re meeting online next week."]}];
  var BUILD_SENTENCES=[{"id": "bs1", "hint": "Plan (going to)", "tokens": ["I’m", "going", "to", "visit", "Denmark", "next", "month."], "target": "I’m going to visit Denmark next month."}, {"id": "bs2", "hint": "Arrangement (present continuous)", "tokens": ["I’m", "meeting", "the", "team", "on", "Tuesday", "at", "10."], "target": "I’m meeting the team on Tuesday at 10."}, {"id": "bs3", "hint": "Offer (will)", "tokens": ["I’ll", "help", "you", "with", "your", "English."], "target": "I’ll help you with your English."}, {"id": "bs4", "hint": "Question (going to)", "tokens": ["Are", "you", "going", "to", "call", "her", "tomorrow?"], "target": "Are you going to call her tomorrow?"}, {"id": "bs5", "hint": "Timetable", "tokens": ["The", "train", "leaves", "at", "8."], "target": "The train leaves at 8."}, {"id": "bs6", "hint": "Negative (going to)", "tokens": ["I’m", "not", "going", "to", "be", "late."], "target": "I’m not going to be late."}];
  var ROLEPLAYS={"family": {"title": "🇩🇰 Roleplay: Planning a call + Denmark visit", "steps": [{"t": "Make a plan: call this weekend (going to).", "targets": ["going to"], "model": "I’m going to call you this weekend."}, {"t": "Ask a question with will.", "targets": ["Will"], "model": "Will you be free on Saturday?"}, {"t": "Arrange a time (present continuous).", "targets": ["I’m"], "model": "I’m calling you on Saturday at 3 p.m."}, {"t": "Promise: send photos tonight (will).", "targets": ["I’ll"], "model": "I’ll send the photos tonight."}, {"t": "Plan: visit Denmark next month (going to).", "targets": ["going to"], "model": "I’m going to visit Denmark next month."}, {"t": "Finish: It will be great (prediction).", "targets": ["will"], "model": "It will be great!"}], "phrases": ["I’m going to…", "I’m meeting…", "I’ll…", "Will you…?", "On Friday / at 3 p.m."]}, "vet": {"title": "🐿️ Roleplay: Next shift at the vet clinic", "steps": [{"t": "Arrangement: you work tomorrow.", "targets": ["I’m"], "model": "I’m working at the vet clinic tomorrow."}, {"t": "Plan: prepare equipment (going to).", "targets": ["going to"], "model": "I’m going to prepare gloves and a carrier."}, {"t": "Ask: Are you meeting the vet?", "targets": ["Are"], "model": "Are you meeting the vet tomorrow?"}, {"t": "Offer help (will).", "targets": ["I’ll"], "model": "I’ll help you and take notes."}, {"t": "Plan follow-up next week (present continuous).", "targets": ["We’re"], "model": "We’re having a follow-up next week."}, {"t": "Finish with time: on/at.", "targets": ["on"], "model": "We’re meeting on Tuesday at 10."}], "phrases": ["Tomorrow…", "Next week…", "I’m going to…", "I’m working…", "We’re having…"]}, "youth": {"title": "🧑‍⚖️ Roleplay: Scheduling youth support tasks", "steps": [{"t": "Arrangement: meeting on Tuesday at 10.", "targets": ["on"], "model": "I’m meeting the team on Tuesday at 10."}, {"t": "Plan: read the case file (going to).", "targets": ["going to"], "model": "I’m going to read the case file."}, {"t": "Promise: write the report tonight (will).", "targets": ["I’ll"], "model": "I’ll write the report tonight."}, {"t": "Question: Will you attend the hearing?", "targets": ["Will"], "model": "Will you attend the hearing next month?"}, {"t": "Timetable: The hearing starts at 9.", "targets": ["starts"], "model": "The hearing starts at 9."}, {"t": "Finish: schedule follow-up (present continuous).", "targets": ["We’re"], "model": "We’re scheduling a follow-up meeting."}], "phrases": ["I’m meeting…", "I’m going to…", "I’ll…", "Will you…?", "The meeting starts at…"]}};
  var WRITING_TASKS=[{"id": "w1", "title": "🇩🇰 Message: plan a call + Denmark visit", "subject": "Write a short message with 3 future forms.", "steps": ["1 going to plan (visit/call)", "1 present continuous arrangement (meeting/calling + day+time)", "1 will promise/offer", "Include 2 time expressions (tomorrow/next week/on Friday/at 3 p.m.)"], "model": "Hi! I’m going to call you this weekend. I’m calling you on Saturday at 3 p.m. Is that OK? I’ll send the photos tonight. Next month, I’m going to visit Denmark, and I think it will be great!", "checks": [{"label": "Going to (plan)", "re": "\\bgoing to\\b"}, {"label": "Present continuous arrangement (I’m + -ing)", "re": "\\bI['’]m\\s+\\w+ing\\b"}, {"label": "Will (I’ll / will)", "re": "\\bI['’]ll\\b|\\bwill\\b"}, {"label": "Time expressions", "re": "\\b(tomorrow|next|on|at|tonight|weekend)\\b"}]}, {"id": "w2", "title": "🐿️ Plan: next vet clinic shift", "subject": "Write a plan for tomorrow + next week.", "steps": ["Start with Tomorrow", "Use 1 going to + 1 will + 1 present continuous", "Use 3 planning verbs (prepare / send / meet / schedule)", "Include on/at once"], "model": "Tomorrow, I’m working at the vet clinic. I’m going to prepare gloves and a carrier. I’ll send an update message tonight. Next week, we’re having a follow-up meeting on Tuesday at 10.", "checks": [{"label": "Tomorrow / next week", "re": "\\bTomorrow\\b|\\bnext week\\b"}, {"label": "Going to", "re": "\\bgoing to\\b"}, {"label": "Will", "re": "\\bI['’]ll\\b|\\bwill\\b"}, {"label": "Present continuous (we’re / I’m + ing)", "re": "\\bWe['’]re\\s+\\w+ing\\b|\\bI['’]m\\s+\\w+ing\\b"}]}, {"id": "w3", "title": "🧑‍⚖️ Plan: youth support week", "subject": "Write your schedule for the week.", "steps": ["Use 2 arrangements (I’m meeting / We’re scheduling)", "Use 1 timetable (starts/finishes)", "Use 1 will promise (I’ll write…)", "Include 2 time markers (on/at/next week)"], "model": "Next week, I’m meeting the team on Tuesday at 10. The hearing starts at 9. I’ll write a short report tonight. After that, we’re scheduling a follow-up meeting.", "checks": [{"label": "Arrangements (I’m/We’re + ing)", "re": "\\bI['’]m\\s+\\w+ing\\b|\\bWe['’]re\\s+\\w+ing\\b"}, {"label": "Timetable (starts/finishes/leaves)", "re": "\\b(starts|finishes|leaves)\\b"}, {"label": "Will", "re": "\\bI['’]ll\\b|\\bwill\\b"}, {"label": "Time markers (on/at/next)", "re": "\\b(on|at|next)\\b"}]}];

  var totalPoints=0;

  function load(){ try{ return JSON.parse(localStorage.getItem(STORE)||''); }catch(e){ return null; } }
  function save(){ localStorage.setItem(STORE, JSON.stringify(state)); }

  function setHint(t){ var hb=$('#hintBox'); if(hb) hb.textContent=t; }
  function updateHud(){
    $('#scoreNow').textContent=String(state.score);
    $('#scoreTotal').textContent=String(totalPoints);
    var pct= totalPoints? Math.round((state.score/totalPoints)*100):0;
    $('#pPct').textContent=pct+'%';
    $('#pBar').style.width = Math.max(0,Math.min(100,pct))+'%';
  }
  function markSolved(id, pts){
    if(state.solved[id]) return false;
    state.solved[id]=true;
    state.score += (pts||1);
    save(); updateHud();
    return true;
  }

  // Speech
  var voices=[];
  function refreshVoices(){ try{ voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }catch(e){ voices=[]; } }
  if('speechSynthesis' in window){ refreshVoices(); window.speechSynthesis.onvoiceschanged=refreshVoices; }
  function pickVoice(){
    var want = (state.accent==='UK')? ['en-GB','en_GB'] : ['en-US','en_US'];
    for(var i=0;i<voices.length;i++){ if(want.indexOf(voices[i].lang)>=0) return voices[i]; }
    for(var j=0;j<voices.length;j++){ if((voices[j].lang||'').toLowerCase().indexOf('en')===0) return voices[j]; }
    return null;
  }
  function speak(text){
    if(!('speechSynthesis' in window)) return;
    try{
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      var v = pickVoice();
      if(v) u.voice=v;
      u.rate = (state.speed==='slow') ? 0.78 : 0.95;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }
  function stopSpeak(){ try{ if('speechSynthesis' in window) window.speechSynthesis.cancel(); }catch(e){} }

  function setPill(id,on){ var el=$(id); if(!el) return; el.className = on ? 'pill is-active' : 'pill'; }
  function initTop(){
    setPill('#accentUS', state.accent==='US');
    setPill('#accentUK', state.accent==='UK');
    setPill('#speedN', state.speed==='normal');
    setPill('#speedS', state.speed==='slow');
    setPill('#hOn', !!state.hints);
    setPill('#hOff', !state.hints);

    $('#accentUS').onclick=function(){ state.accent='US'; save(); initTop(); setHint('Accent: US'); };
    $('#accentUK').onclick=function(){ state.accent='UK'; save(); initTop(); setHint('Accent: UK'); };
    $('#speedN').onclick=function(){ state.speed='normal'; save(); initTop(); };
    $('#speedS').onclick=function(){ state.speed='slow'; save(); initTop(); };
    $('#hOn').onclick=function(){ state.hints=true; save(); initTop(); setHint('Hints ON'); };
    $('#hOff').onclick=function(){ state.hints=false; save(); initTop(); setHint('Hints OFF'); };

    $('#stopAudio').onclick=stopSpeak;
    $('#printBtn').onclick=function(){ window.print(); };

    $('#resetAll').onclick=function(){
      if(!confirm('Reset ALL progress for this page?')) return;
      localStorage.removeItem(STORE);
      location.reload();
    };
    $('#resetPractice').onclick=function(){
      if(!confirm('Reset practice sections (MCQ/FIB/Plan/Builder/Dialogue/Writing)?')) return;
      var keep={};
      for(var k in state.solved){
        if(!/^mcq_|^fib|^story_|^bs_|^rp_|^write_/.test(k)) keep[k]=true;
      }
      state.solved=keep;
      state.score=Object.keys(state.solved).length;
      save();
      location.hash='#practice';
      location.reload();
    };
  }

  // ---------- Model stories ----------
  function renderModel(key){
    var s=MODEL_STORIES[key];
    if(!s) return;
    var panel=$('#msPanel');
    var en = s.en.map(function(line){ return '<li>'+esc(line)+'</li>'; }).join('');
    var fr = s.fr.map(function(line){ return '<li>'+esc(line)+'</li>'; }).join('');
    var vocab = s.vocab.map(function(v){ return '<li><strong>'+esc(v[0])+'</strong> → '+esc(v[1])+'</li>'; }).join('');
    var mini = s.mini.map(function(item,idx){
      var opts = item.opts.map(function(o){
        return '<button class="opt" type="button" data-msq="'+key+'_'+idx+'" data-a="'+esc(item.a)+'" data-c="'+esc(o)+'">'+esc(o)+'</button>';
      }).join('');
      return '<div class="qItem" data-msqid="'+key+'_'+idx+'">'+
               '<div class="qQ">'+esc(item.q)+'</div>'+
               '<div class="opts">'+opts+'</div>'+
               '<div class="feedback" data-fb></div>'+
             '</div>';
    }).join('');
    panel.innerHTML =
      '<h2 class="h2">'+esc(s.title)+'</h2>'+
      '<div class="grid2">'+
        '<div class="mini">'+
          '<h3 class="h2" style="font-size:16px;margin:6px 0;">English (read)</h3>'+
          '<ol class="list">'+en+'</ol>'+
          '<div class="wBtns">'+
            '<button class="btn btn--ghost" id="msListen" type="button">🔊 Listen</button>'+
            '<button class="btn btn--ghost" id="msToggle" type="button">🇫🇷 Show FR</button>'+
          '</div>'+
          '<div class="mini" id="msFR" style="display:none;margin-top:10px;">'+
            '<h3 class="h2" style="font-size:16px;margin:6px 0;">French (help)</h3>'+
            '<ol class="list">'+fr+'</ol>'+
          '</div>'+
        '</div>'+
        '<div class="mini">'+
          '<h3 class="h2" style="font-size:16px;margin:6px 0;">Key vocabulary</h3>'+
          '<ul class="list">'+vocab+'</ul>'+
          '<div class="callout small"><strong>Mini comprehension:</strong> Choose the correct answer.</div>'+
          '<div class="quiz" id="msMini">'+mini+'</div>'+
        '</div>'+
      '</div>';

    $('#msListen').onclick=function(){ speak(s.en.join(' ')); };
    $('#msToggle').onclick=function(){
      var box=$('#msFR');
      var on = box.style.display !== 'none';
      box.style.display = on ? 'none' : 'block';
      this.textContent = on ? '🇫🇷 Show FR' : '🇫🇷 Hide FR';
    };

    $('#msMini').onclick=function(e){
      var b=e.target.closest('.opt'); if(!b) return;
      var qid=b.getAttribute('data-msq');
      var ans=b.getAttribute('data-a');
      var ch=b.getAttribute('data-c');
      var wrap=document.querySelector('.qItem[data-msqid="'+qid+'"]');
      var fb=wrap.querySelector('[data-fb]');
      if(ch===ans){
        b.classList.add('is-right');
        fb.className='feedback good';
        fb.textContent='✅ Correct';
        $all('.opt',wrap).forEach(function(x){ x.disabled=true; });
        markSolved('ms_'+qid, 1);
      }else{
        b.classList.add('is-wrong');
        fb.className='feedback bad';
        fb.textContent='❌ Try again';
      }
    };
  }

  function initModelStories(){
    var tabs=$('#msTabs');
    tabs.onclick=function(e){
      var b=e.target.closest('.tab'); if(!b) return;
      $all('.tab',tabs).forEach(function(x){ x.classList.remove('is-active'); });
      b.classList.add('is-active');
      renderModel(b.getAttribute('data-ms'));
    };
    renderModel('family');
  }

  // ---------- Grammar cards ----------
  function renderGrammarTabs(){
    var root=$('#gTabs');
    root.innerHTML = FUTURE_FORMS.map(function(f,i){
      return '<button class="tab '+(i===0?'is-active':'')+'" type="button" data-k="'+esc(f.key)+'">'+esc(f.icon)+' '+esc(f.title)+'</button>';
    }).join('');
    root.onclick=function(e){
      var b=e.target.closest('.tab'); if(!b) return;
      $all('.tab',root).forEach(function(x){ x.classList.remove('is-active'); });
      b.classList.add('is-active');
      renderGrammarCard(b.getAttribute('data-k'));
    };
    renderGrammarCard(FUTURE_FORMS[0].key);
  }
  function renderGrammarCard(key){
    var f=FUTURE_FORMS[0];
    for(var i=0;i<FUTURE_FORMS.length;i++){ if(FUTURE_FORMS[i].key===key){ f=FUTURE_FORMS[i]; break; } }
    var panel=$('#gPanel');
    var ex = f.examples.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('');
    panel.innerHTML =
      '<div class="mini">'+
        '<h2 class="h2">'+esc(f.icon)+' '+esc(f.title)+' <span class="tag">'+esc(f.fr)+'</span></h2>'+
        '<div class="callout small"><strong>Rule:</strong> '+esc(f.rule)+'</div>'+
        '<div class="callout small"><strong>Form:</strong> '+esc(f.form)+'</div>'+
        '<h3 class="h2" style="font-size:16px;margin:10px 0 6px;">Examples</h3>'+
        '<ul class="list">'+ex+'</ul>'+
        '<div class="wBtns">'+
          '<button class="btn btn--ghost" type="button" id="gListen">🔊 Listen examples</button>'+
        '</div>'+
        '<h3 class="h2" style="font-size:16px;margin:12px 0 6px;">Mini quiz</h3>'+
        '<div class="quiz" id="gQuiz"></div>'+
      '</div>';
    $('#gListen').onclick=function(){ speak(f.examples.join(' ')); };
    renderMCQ('#gQuiz', f.quiz, 'mcq_g_'+f.key);
  }

  function renderQuickLists(){
    $('#timeList').innerHTML = TIME_WORDS.map(function(t){ return '<li>'+esc(t.icon)+' <strong>'+esc(t.en)+'</strong> — <span class="tag">'+esc(t.fr)+'</span></li>'; }).join('');
    $('#connList').innerHTML = CONNECTORS.map(function(c){ return '<li>'+esc(c.icon)+' <strong>'+esc(c.en)+'</strong> — <span class="tag">'+esc(c.fr)+'</span></li>'; }).join('');
  }

  // ---------- Vocab ----------
  function buildTabs(rootId, items){
    var root=$(rootId);
    var cats=['All'];
    items.forEach(function(x){ if(cats.indexOf(x.cat)===-1) cats.push(x.cat); });
    root.innerHTML = cats.map(function(c,idx){
      return '<button class="tab '+(idx===0?'is-active':'')+'" type="button" data-cat="'+esc(c)+'">'+esc(c)+'</button>';
    }).join('');
  }
  function activeCat(rootId){
    var root=$(rootId);
    var el=root ? root.querySelector('.tab.is-active') : null;
    return el ? el.getAttribute('data-cat') : 'All';
  }
  function renderVocab(){
    buildTabs('#vTabs', VOCAB);
    var grid=$('#vGrid');
    function doRender(){
      var cat=activeCat('#vTabs');
      var q=norm($('#vSearch').value);
      var out=[];
      VOCAB.forEach(function(v){
        if(cat!=='All' && v.cat!==cat) return;
        if(q){
          var ok = norm(v.en).indexOf(q)>=0 || norm(v.fr).indexOf(q)>=0 || norm(v.def).indexOf(q)>=0 || norm(v.ex).indexOf(q)>=0;
          if(!ok) return;
        }
        out.push(
          '<button class="flash" type="button" data-say="'+esc(v.en)+'">'+
            '<div class="flash__top"><div class="flash__icon">'+esc(v.icon)+'</div><div class="flash__term">'+esc(v.en)+'</div></div>'+
            '<div class="flash__meta"><span class="tag">'+esc(v.cat)+'</span> • FR: <strong>'+esc(v.fr)+'</strong> • click</div>'+
            '<div class="flash__def"><div><strong>FR:</strong> '+esc(v.fr)+'</div><div><strong>Meaning:</strong> '+esc(v.def)+'</div><div style="margin-top:6px;"><strong>Example:</strong> '+esc(v.ex)+'</div></div>'+
          '</button>'
        );
      });
      grid.innerHTML=out.join('');
    }
    doRender();

    $('#vTabs').onclick=function(e){
      var b=e.target.closest('.tab'); if(!b) return;
      $all('.tab',$('#vTabs')).forEach(function(x){ x.classList.remove('is-active'); });
      b.classList.add('is-active');
      doRender();
    };
    $('#vSearch').oninput=doRender;

    grid.onclick=function(e){
      var c=e.target.closest('.flash'); if(!c) return;
      c.classList.toggle('is-flipped');
      speak(c.getAttribute('data-say')||'');
    };

    $('#vClear').onclick=function(){ $('#vSearch').value=''; $all('.tab',$('#vTabs')).forEach(function(x,i){ x.classList.toggle('is-active', i===0); }); doRender(); };
    $('#vListen').onclick=function(){
      var cat=activeCat('#vTabs');
      var q=norm($('#vSearch').value);
      var list=[];
      for(var i=0;i<VOCAB.length;i++){
        var v=VOCAB[i];
        if(cat!=='All' && v.cat!==cat) continue;
        if(q && norm(v.en).indexOf(q)<0 && norm(v.fr).indexOf(q)<0) continue;
        list.push(v.en);
        if(list.length>=18) break;
      }
      if(!list.length){ setHint('No vocab matches.'); return; }
      speak(list.join('. '));
    };
  }

  // ---------- MCQ renderer ----------
  function renderMCQ(rootSel, bank, prefix){
    var root=$(rootSel);
    root.innerHTML = bank.map(function(q,i){
      var id=prefix+'_'+(i+1);
      var opts=shuffle(q.opts);
      return '<div class="qItem" data-id="'+esc(id)+'" data-a="'+esc(q.a)+'">'+
        '<div class="qQ">'+esc(q.q)+'</div>'+
        '<div class="opts">'+opts.map(function(o){ return '<button class="opt" type="button" data-c="'+esc(o)+'">'+esc(o)+'</button>'; }).join('')+'</div>'+
        '<div class="wBtns" style="margin-top:10px;">'+
          '<button class="btn btn--ghost hintBtn" type="button" data-h="'+esc(q.hint||'')+'">Hint</button>'+
          '<button class="btn btn--ghost whyBtn" type="button">Why?</button>'+
        '</div>'+
        '<div class="feedback" data-fb></div>'+
        '<div class="explain" data-ex>'+esc(q.why||'')+'</div>'+
      '</div>';
    }).join('');

    // restore solved
    $all('.qItem',root).forEach(function(it){
      var id=it.getAttribute('data-id');
      if(state.solved[id]){
        $all('.opt',it).forEach(function(b){ b.disabled=true; });
        var fb=it.querySelector('[data-fb]');
        fb.className='feedback good';
        fb.textContent='✅ Already solved';
      }
    });

    root.onclick=function(e){
      var it=e.target.closest('.qItem'); if(!it) return;
      var id=it.getAttribute('data-id');
      var ans=it.getAttribute('data-a');
      var fb=it.querySelector('[data-fb]');
      var ex=it.querySelector('[data-ex]');
      var opt=e.target.closest('.opt');
      var hint=e.target.closest('.hintBtn');
      var why=e.target.closest('.whyBtn');

      if(why){ ex.classList.toggle('is-on'); return; }
      if(hint){
        if(!state.hints){ fb.className='feedback'; fb.textContent='Hints are OFF.'; setHint('Hints OFF'); return; }
        var h=hint.getAttribute('data-h')||'';
        fb.className='feedback'; fb.textContent='💡 '+h;
        setHint(h);
        return;
      }
      if(!opt) return;
      var ch=opt.getAttribute('data-c');

      if(ch===ans){
        opt.classList.add('is-right');
        fb.className='feedback good';
        fb.textContent = state.solved[id] ? '✅ Correct (practice mode)' : '✅ Correct!';
        $all('.opt',it).forEach(function(b){ b.disabled=true; });
        if((ex.textContent||'').trim()) ex.classList.add('is-on');
        if(!state.solved[id]) markSolved(id,1);
        speak(ans);
      }else{
        opt.classList.add('is-wrong');
        fb.className='feedback bad';
        fb.textContent='❌ Not yet. Try again.';
      }
    };
  }

  // ---------- FIB ----------
  function renderFIB(){
    var root=$('#fibBox');
    root.innerHTML = FIB.map(function(item){
      var sent = item.sent.replace('____', '<span class="blank"><input data-a="'+esc(item.a)+'" placeholder="..." autocomplete="off"></span>');
      return '<div class="qItem" data-id="'+esc(item.id)+'">'+
        '<div class="qQ">'+sent+'</div>'+
        '<div class="wBtns" style="margin-top:10px;">'+
          '<button class="btn btn--ghost hintBtn" type="button" data-h="'+esc(item.hint)+'">Hint</button>'+
          '<div class="feedback" data-fb></div>'+
        '</div>'+
      '</div>';
    }).join('');

    // restore solved
    $all('.qItem',root).forEach(function(row){
      var id=row.getAttribute('data-id');
      if(state.solved[id]){
        var inp=row.querySelector('input');
        var fb=row.querySelector('[data-fb]');
        inp.value=inp.getAttribute('data-a');
        inp.disabled=true;
        fb.className='feedback good';
        fb.textContent='✅ Correct';
      }
    });

    root.onclick=function(e){
      var row=e.target.closest('.qItem'); if(!row) return;
      var hint=e.target.closest('.hintBtn'); if(!hint) return;
      var fb=row.querySelector('[data-fb]');
      if(!state.hints){ fb.className='feedback'; fb.textContent='Hints are OFF.'; return; }
      var h=hint.getAttribute('data-h')||'';
      fb.className='feedback'; fb.textContent='💡 '+h;
      setHint(h);
    };

    root.oninput=function(e){
      var inp=e.target.closest('input'); if(!inp) return;
      var row=inp.closest('.qItem');
      var id=row.getAttribute('data-id');
      var fb=row.querySelector('[data-fb]');
      var ans=norm(inp.getAttribute('data-a'));
      var val=norm(inp.value);
      if(val===ans){
        inp.disabled=true;
        fb.className='feedback good';
        fb.textContent='✅ Correct!';
        if(!state.solved[id]) markSolved(id,1);
        speak(inp.getAttribute('data-a'));
      }else if(val.length>=Math.max(3,ans.length)){
        fb.className='feedback bad';
        fb.textContent='❌ Not yet.';
      }else{
        fb.className='feedback';
        fb.textContent='';
      }
    };
  }

  // ---------- Plan order (drag/tap) ----------
  var storySelToken=null;
  var story=null;

  function loadStory(id){
    for(var i=0;i<STORIES.length;i++){ if(STORIES[i].id===id){ story=STORIES[i]; break; } }
    if(!story) story=STORIES[0];
    $('#storyHint').textContent='Tip: '+story.hint;
    $('#storyFb').className='feedback';
    $('#storyFb').textContent='Tap a token → tap a slot (or drag).';
    storySelToken=null;
    renderStoryUI();
  }

  function renderStoryUI(){
    var bank=$('#storyBank');
    var slots=$('#storySlots');
    var tokens=shuffle(story.target);
    bank.innerHTML = tokens.map(function(t){ return '<button class="token" type="button" draggable="true" data-text="'+esc(t)+'">'+esc(t)+'</button>'; }).join('');
    slots.innerHTML = story.target.map(function(_,idx){
      return '<div class="slot" data-i="'+idx+'" tabindex="0">'+
              '<div class="slotNum">'+(idx+1)+'</div>'+
              '<div class="slotText">Tap/drag the correct line here…</div>'+
             '</div>';
    }).join('');

    bank.onclick=function(e){
      var tok=e.target.closest('.token'); if(!tok) return;
      if(tok.classList.contains('is-locked')) return;
      $all('.token',bank).forEach(function(x){ if(x!==tok) x.classList.remove('is-selected'); });
      tok.classList.toggle('is-selected');
      storySelToken = tok.classList.contains('is-selected') ? tok : null;
    };

    bank.addEventListener('dragstart', function(e){
      var tok=e.target.closest('.token'); if(!tok || tok.classList.contains('is-locked')) return;
      e.dataTransfer.setData('text/plain', tok.getAttribute('data-text'));
      e.dataTransfer.effectAllowed='move';
    });

    $all('.slot',slots).forEach(function(slotEl){
      slotEl.addEventListener('dragover', function(e){ e.preventDefault(); slotEl.classList.add('is-hot'); });
      slotEl.addEventListener('dragleave', function(){ slotEl.classList.remove('is-hot'); });
      slotEl.addEventListener('drop', function(e){
        e.preventDefault(); slotEl.classList.remove('is-hot');
        placeStory(e.dataTransfer.getData('text/plain'), parseInt(slotEl.getAttribute('data-i'),10), slotEl);
      });
      slotEl.addEventListener('click', function(){
        if(!storySelToken) return;
        placeStory(storySelToken.getAttribute('data-text'), parseInt(slotEl.getAttribute('data-i'),10), slotEl);
      });
      slotEl.addEventListener('keydown', function(ev){
        if((ev.key==='Enter'||ev.key===' ') && storySelToken){
          ev.preventDefault();
          placeStory(storySelToken.getAttribute('data-text'), parseInt(slotEl.getAttribute('data-i'),10), slotEl);
        }
      });
    });
  }

  function placeStory(text, idx, slotEl){
    var expected=story.target[idx];
    var fb=$('#storyFb');
    if(text===expected){
      slotEl.querySelector('.slotText').textContent=text;
      slotEl.classList.add('is-hot');
      setTimeout(function(){ slotEl.classList.remove('is-hot'); },200);

      // lock token
      var bank=$('#storyBank');
      var toks=$all('.token',bank);
      for(var i=0;i<toks.length;i++){
        if(toks[i].getAttribute('data-text')===text){
          toks[i].classList.remove('is-selected');
          toks[i].classList.add('is-locked');
          toks[i].setAttribute('draggable','false');
          break;
        }
      }
      storySelToken=null;

      fb.className='feedback good';
      fb.textContent='✅ Correct placement!';
      speak(text);
      markSolved('story_'+story.id+'_'+(idx+1),1);

      // completion check
      var allDone=true;
      $all('.slotText',$('#storySlots')).forEach(function(st){
        if(st.textContent.indexOf('Tap/drag')===0) allDone=false;
      });
      if(allDone){
        fb.textContent='🎉 Plan complete! Read it aloud.';
        speak(story.target.join(' '));
      }
    }else{
      slotEl.classList.add('is-bad');
      setTimeout(function(){ slotEl.classList.remove('is-bad'); },300);
      fb.className='feedback bad';
      fb.textContent='❌ Not correct for this slot.';
    }
  }

  function initStories(){
    var sel=$('#storySelect');
    sel.innerHTML = STORIES.map(function(s){ return '<option value="'+esc(s.id)+'">'+esc(s.title)+'</option>'; }).join('');
    sel.onchange=function(){ loadStory(sel.value); };
    $('#storyReset').onclick=function(){ loadStory(sel.value); };
    loadStory(sel.value || STORIES[0].id);
  }

  // ---------- Sentence builder ----------
  var bsKey=null;
  var bsPicked=[];

  function loadBuilder(id){
    bsKey=id;
    bsPicked=[];
    var s=getBS();
    $('#bsHint').textContent='Hint: '+s.hint;
    $('#bsOut').textContent='';
    $('#bsFb').className='feedback'; $('#bsFb').textContent='Tap tiles to build the sentence.';
    renderBSBank();
  }
  function getBS(){
    for(var i=0;i<BUILD_SENTENCES.length;i++){ if(BUILD_SENTENCES[i].id===bsKey) return BUILD_SENTENCES[i]; }
    return BUILD_SENTENCES[0];
  }
  function renderBSBank(){
    var s=getBS();
    var bank=$('#bsBank');
    var tokens=shuffle(s.tokens);
    bank.innerHTML = tokens.map(function(t){
      var used = bsPicked.indexOf(t)>=0;
      return '<button class="token '+(used?'is-locked':'')+'" type="button" data-t="'+esc(t)+'">'+esc(t)+'</button>';
    }).join('');
    $('#bsOut').textContent = bsPicked.join(' ');
  }
  function initBuilder(){
    var sel=$('#bsSelect');
    sel.innerHTML = BUILD_SENTENCES.map(function(s){ return '<option value="'+esc(s.id)+'">'+esc(s.target)+'</option>'; }).join('');
    sel.onchange=function(){ loadBuilder(sel.value); };
    loadBuilder(sel.value || BUILD_SENTENCES[0].id);

    $('#bsBank').onclick=function(e){
      var b=e.target.closest('.token'); if(!b) return;
      if(b.classList.contains('is-locked')) return;
      bsPicked.push(b.getAttribute('data-t'));
      renderBSBank();
    };
    $('#bsUndo').onclick=function(){ bsPicked.pop(); renderBSBank(); };
    $('#bsClear').onclick=function(){ bsPicked=[]; renderBSBank(); $('#bsFb').className='feedback'; $('#bsFb').textContent='Cleared.'; };
    $('#bsCheck').onclick=function(){
      var s=getBS();
      var built = bsPicked.join(' ').replace(/\s+/g,' ').trim();
      var target = s.target.replace(/\s+/g,' ').trim();
      if(built===target){
        $('#bsFb').className='feedback good';
        $('#bsFb').textContent='✅ Perfect!';
        markSolved('bs_'+s.id,2);
        speak(target);
      }else{
        $('#bsFb').className='feedback bad';
        $('#bsFb').textContent='❌ Not correct yet. Use the hint and try again.';
      }
    };
  }

  // ---------- Roleplays ----------
  var rpKey=null;
  var rpIdx=0;
  var showModel=false;

  function initRoleplays(){
    var sel=$('#rpSelect');
    var keys=[];
    for(var k in ROLEPLAYS){ if(ROLEPLAYS.hasOwnProperty(k)) keys.push(k); }
    keys.sort();
    sel.innerHTML = keys.map(function(k){ return '<option value="'+esc(k)+'">'+esc(ROLEPLAYS[k].title)+'</option>'; }).join('');
    rpKey=sel.value || keys[0];
    sel.onchange=function(){ rpKey=sel.value; rpIdx=0; showModel=false; clearRP(); };

    $('#rpStart').onclick=function(){ rpIdx=0; showModel=false; renderRP(); };
    $('#rpNext').onclick=function(){ var steps=ROLEPLAYS[rpKey].steps; rpIdx=Math.min(steps.length-1, rpIdx+1); showModel=false; renderRP(); };
    $('#rpRestart').onclick=function(){ rpIdx=0; showModel=false; renderRP(); };
    $('#rpModel').onclick=function(){ showModel=!showModel; renderRP(); };
    $('#rpHint').onclick=function(){
      var step=ROLEPLAYS[rpKey].steps[rpIdx];
      $('#rpFb').className='feedback';
      $('#rpFb').textContent='💡 Targets: '+step.targets.join(' • ');
      setHint('Targets: '+step.targets.join(' • '));
    };
    $('#rpListen').onclick=function(){
      var step=ROLEPLAYS[rpKey].steps[rpIdx];
      speak(step.t);
    };

    clearRP();
  }

  function clearRP(){
    $('#rpTeacher').textContent='Choose a scenario and click Start.';
    $('#rpChoices').innerHTML='';
    $('#rpFb').className='feedback'; $('#rpFb').textContent='';
    $('#rpExplain').className='explain'; $('#rpExplain').textContent='';
    $('#rpCount').textContent='0 / 0';
    $('#rpPhraseBox').style.display='none';
  }

  function checkTargets(text, targets){
    var t=String(text||'');
    for(var i=0;i<targets.length;i++){
      if(t.indexOf(targets[i])===-1) return false;
    }
    return true;
  }

  function makeVariations(model){
    var v=[];
    v.push(model.replace(/\bI’m\b/g,'I am').replace(/\bWe’re\b/g,'We are').replace(/\bI’ll\b/g,'I will'));
    v.push(model.replace(/\btonight\b/g,'this evening'));
    v.push(model.replace(/\bnext week\b/g,'next month'));
    var out=[];
    for(var i=0;i<v.length;i++){ if(v[i]!==model && out.indexOf(v[i])===-1) out.push(v[i]); }
    return out;
  }

  function renderRP(){
    var rp=ROLEPLAYS[rpKey];
    var step=rp.steps[rpIdx];
    $('#rpTeacher').textContent=step.t;
    $('#rpCount').textContent=(rpIdx+1)+' / '+rp.steps.length;

    var opts=shuffle([step.model].concat(makeVariations(step.model))).slice(0,3);
    $('#rpChoices').innerHTML = opts.map(function(o){ return '<button class="choice" type="button" data-t="'+esc(o)+'">'+esc(o)+'</button>'; }).join('');

    $('#rpFb').className='feedback';
    $('#rpFb').textContent='Choose the best reply.';

    $('#rpExplain').className = 'explain'+(showModel?' is-on':'');
    $('#rpExplain').textContent = showModel ? ('Model: '+step.model) : 'Click Model if you need help.';

    // phrases
    $('#rpPhrases').innerHTML = rp.phrases.map(function(p){ return '<li>'+esc(p)+'</li>'; }).join('');
    $('#rpPhraseBox').style.display='block';

    $('#rpChoices').onclick=function(e){
      var b=e.target.closest('.choice'); if(!b) return;
      var txt=b.getAttribute('data-t')||'';
      var ok = checkTargets(txt, step.targets);
      if(ok){
        b.classList.add('is-right');
        $('#rpFb').className='feedback good';
        $('#rpFb').textContent='✅ Good! Next unlocked.';
        var sid='rp_'+rpKey+'_'+(rpIdx+1);
        if(!state.solved[sid]) markSolved(sid,1);
        speak(txt);
      }else{
        b.classList.add('is-wrong');
        $('#rpFb').className='feedback bad';
        $('#rpFb').textContent='❌ Try again. Use Hint.';
      }
    };
  }

  // ---------- Writing ----------
  var wKey=null;
  function initWriting(){
    var sel=$('#wSelect');
    sel.innerHTML = WRITING_TASKS.map(function(t){ return '<option value="'+esc(t.id)+'">'+esc(t.title)+'</option>'; }).join('');
    wKey=sel.value || WRITING_TASKS[0].id;
    sel.onchange=function(){ loadWriting(sel.value); };
    loadWriting(wKey);

    $('#wReset').onclick=function(){ loadWriting(wKey); };
    $('#wModel').onclick=function(){
      var box=$('#wModelBox');
      var t=getTask();
      if(box.getAttribute('data-on')==='1'){ box.setAttribute('data-on','0'); box.textContent='Click “Show model” to reveal.'; return; }
      box.setAttribute('data-on','1');
      box.textContent=t.model;
    };
    $('#wListen').onclick=function(){
      var txt=$('#wText').value.trim();
      if(!txt){ setHint('Write something first.'); return; }
      speak(txt);
    };
    $('#wCopy').onclick=function(){
      var ta=$('#wText'); ta.focus(); ta.select();
      try{ var ok=document.execCommand('copy'); setHint(ok?'Copied!':'Copy failed.'); }catch(e){ setHint('Copy failed.'); }
    };
    $('#wHint').onclick=function(){
      var t=getTask();
      $('#wFb').className='feedback';
      $('#wFb').textContent='💡 Steps: '+t.steps.join(' | ');
      setHint('Use: '+t.steps.slice(0,3).join(' • '));
    };
    $('#wCheck').onclick=checkWriting;
  }
  function getTask(){
    for(var i=0;i<WRITING_TASKS.length;i++){ if(WRITING_TASKS[i].id===wKey) return WRITING_TASKS[i]; }
    return WRITING_TASKS[0];
  }
  function loadWriting(id){
    wKey=id;
    var t=getTask();
    $('#wSubject').textContent='Subject: '+t.subject;
    $('#wSteps').innerHTML = t.steps.map(function(s){ return '<li>'+esc(s)+'</li>'; }).join('');
    $('#wText').value='';
    $('#wFb').className='feedback'; $('#wFb').textContent='Write your text, then click Check.';
    $('#wChecklist').innerHTML='';
    $('#wModelBox').setAttribute('data-on','0');
    $('#wModelBox').textContent='Click “Show model” to reveal.';
  }
  function checkWriting(){
    var t=getTask();
    var txt=$('#wText').value.trim();
    if(!txt){ $('#wFb').className='feedback bad'; $('#wFb').textContent='❌ Please write a text first.'; return; }

    var checks = t.checks.map(function(c){ return {label:c.label, ok: new RegExp(c.re,'i').test(txt)}; });

    $('#wChecklist').innerHTML = checks.map(function(ch){
      return '<div class="chk '+(ch.ok?'ok':'bad')+'"><div class="dot"></div><div>'+esc(ch.label)+' '+(ch.ok?'<small>OK</small>':'<small>Missing</small>')+'</div></div>';
    }).join('');

    var allOk=true; checks.forEach(function(x){ if(!x.ok) allOk=false; });
    if(allOk){
      $('#wFb').className='feedback good';
      $('#wFb').textContent='✅ Great! Checklist complete.';
      markSolved('write_'+t.id, 3);
    }else{
      $('#wFb').className='feedback bad';
      $('#wFb').textContent='❌ Not complete yet. Add the missing items.';
    }
  }

  // ---------- Count total points ----------
  function computeTotal(){
    var q = 0;
    q += MCQ.length;
    q += FIB.length;
    q += BUILD_SENTENCES.length * 2;
    for(var i=0;i<STORIES.length;i++) q += STORIES[i].target.length;
    var rp=0; for(var k in ROLEPLAYS){ if(ROLEPLAYS.hasOwnProperty(k)) rp += ROLEPLAYS[k].steps.length; }
    q += rp;
    q += WRITING_TASKS.length * 3;
    q += 3*3; // model mini quizzes: 3 each
    // grammar card quizzes total
    var g=0; for(var j=0;j<FUTURE_FORMS.length;j++) g += FUTURE_FORMS[j].quiz.length;
    q += g;
    return q;
  }

  // ---------- Boot ----------
  function init(){
    initTop();
    initModelStories();
    renderQuickLists();
    renderGrammarTabs();

    renderMCQ('#mcqMain', MCQ, 'mcq_main');
    renderFIB();
    initStories();
    initBuilder();
    initRoleplays();
    initWriting();
    renderVocab();

    totalPoints = computeTotal();
    updateHud();
    setHint('Tip: Model stories first, then Grammar card quizzes, then Practice.');
  }

  document.addEventListener('DOMContentLoaded', init);
})();