(function(){
  'use strict';
  function $(sel,root){ return (root||document).querySelector(sel); }
  function $all(sel,root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function norm(s){ return String(s||'').trim().toLowerCase().replace(/\s+/g,' '); }
  function shuffle(arr){ var a=arr.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  function esc(s){ return String(s).replace(/[&<>"']/g,function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); }); }

  var STORE='SET_past_simple_masterclass_v1';
  var state=load() || {score:0, solved:{}, accent:'US', speed:'normal', hints:true};

  var MODEL_STORIES={"safari": {"title": "🦁 Model true story — Safari (Africa)", "en": ["Last year, my husband and I travelled to Africa.", "First, we arrived at the lodge in the afternoon.", "Then, we met our guide and learned the safety rules.", "After that, we drove in a safari jeep and we saw elephants near the river.", "Finally, we watched the sunset and returned to the camp. It was scary sometimes, but it was amazing."], "fr": ["L’année dernière, mon mari et moi avons voyagé en Afrique.", "D’abord, nous sommes arrivés au lodge dans l’après‑midi.", "Ensuite, nous avons rencontré notre guide et appris les règles de sécurité.", "Après ça, nous avons roulé en 4x4 et vu des éléphants près de la rivière.", "Enfin, nous avons regardé le coucher de soleil et sommes retournés au camp. C’était parfois effrayant, mais incroyable."], "vocab": [["🚙 safari jeep", "4x4 de safari"], ["🧭 guide", "guide"], ["🛑 safety rules", "règles de sécurité"], ["🌅 sunset", "coucher de soleil"], ["🐘 elephant", "éléphant"]], "mini": [{"q": "When did the story happen?", "a": "Last year", "opts": ["Last year", "Today", "Tomorrow"]}, {"q": "What did they see near the river?", "a": "Elephants", "opts": ["Elephants", "Hedgehogs", "Judges"]}, {"q": "Which connector starts the sequence?", "a": "First", "opts": ["First", "Because", "However"]}]}, "vet": {"title": "🐿️ Model true story — Vet clinic (small animals)", "en": ["Yesterday, an injured bird arrived at the vet clinic.", "First, I wore gloves and prepared a carrier.", "Then, the vet checked the animal and I cleaned the wound.", "After that, we put a bandage on and we fed it slowly.", "Finally, we planned a follow-up. We didn’t panic, and we stayed calm."], "fr": ["Hier, un oiseau blessé est arrivé au cabinet vétérinaire.", "D’abord, j’ai porté des gants et préparé une cage de transport.", "Ensuite, le vétérinaire a examiné l’animal et j’ai nettoyé la plaie.", "Après ça, nous avons mis un bandage et nous l’avons nourri doucement.", "Enfin, nous avons prévu un suivi. Nous n’avons pas paniqué, et nous sommes restés calmes."], "vocab": [["🧤 gloves", "gants"], ["🧺 carrier", "cage de transport"], ["🧼 wound", "plaie"], ["🩹 bandage", "bandage"], ["🥣 feed", "nourrir"]], "mini": [{"q": "What arrived yesterday?", "a": "An injured bird", "opts": ["An injured bird", "A zebra", "A case file"]}, {"q": "What did she wear?", "a": "Gloves", "opts": ["Gloves", "Binoculars", "A uniform"]}, {"q": "What didn’t they do?", "a": "panic", "opts": ["panic", "plan", "feed"]}]}, "youth": {"title": "🧑‍⚖️ Model true story — Youth support (assessor)", "en": ["Last week, I worked on a youth support case.", "First, I read the case file and prepared questions.", "Then, I met the young person and listened carefully.", "After that, I wrote a short report for the judge, so the team understood the situation.", "Finally, we scheduled a follow-up meeting. Progress takes time."], "fr": ["La semaine dernière, j’ai travaillé sur un dossier d’accompagnement de jeunes.", "D’abord, j’ai lu le dossier et préparé des questions.", "Ensuite, j’ai rencontré le jeune et j’ai écouté attentivement.", "Après ça, j’ai rédigé un court rapport pour le juge, donc l’équipe a compris la situation.", "Enfin, nous avons planifié un rendez‑vous de suivi. Les progrès prennent du temps."], "vocab": [["📋 case file", "dossier"], ["🧾 report", "rapport"], ["🧑‍⚖️ judge", "juge"], ["📅 follow‑up", "suivi"], ["🌱 progress", "progrès"]], "mini": [{"q": "What did she read first?", "a": "The case file", "opts": ["The case file", "The menu", "The map"]}, {"q": "Who received the report?", "a": "The judge", "opts": ["The judge", "The guide", "The squirrel"]}, {"q": "What did they schedule?", "a": "A follow-up meeting", "opts": ["A follow-up meeting", "A safari jeep", "A bandage"]}]}};
  var CONNECTORS=[{"icon": "1️⃣", "en": "First,", "fr": "D’abord,"}, {"icon": "2️⃣", "en": "Then,", "fr": "Ensuite,"}, {"icon": "➡️", "en": "After that,", "fr": "Après ça,"}, {"icon": "🏁", "en": "Finally,", "fr": "Enfin,"}, {"icon": "⚖️", "en": "But", "fr": "Mais"}, {"icon": "💡", "en": "Because", "fr": "Parce que"}, {"icon": "➡️", "en": "So", "fr": "Donc"}];
  var TENSES=[{"key": "present_simple", "icon": "🟦", "title": "Present simple (routine)", "fr": "Présent simple (habitudes)", "form": "I work / I don’t work / Do you work?", "use": "habits, facts, routines", "keywords": "often, usually, every week", "examples": ["I volunteer at a vet clinic every week.", "I help small animals.", "I usually write a short report."], "quiz": [{"q": "Routine:", "opts": ["I volunteer every week.", "I am volunteer every week.", "I volunteering every week."], "a": "I volunteer every week.", "hint": "routine → base verb"}, {"q": "Negative:", "opts": ["I don’t work on Sundays.", "I doesn’t work on Sundays.", "I not work on Sundays."], "a": "I don’t work on Sundays.", "hint": "don’t + base verb"}, {"q": "Question:", "opts": ["Do you help young people?", "Are you help young people?", "Do you helps young people?"], "a": "Do you help young people?", "hint": "Do + base verb"}, {"q": "He/She:", "opts": ["She helps small animals.", "She help small animals.", "She is help small animals."], "a": "She helps small animals.", "hint": "she + verb+s"}]}, {"key": "past_simple", "icon": "🟧", "title": "Past simple (finished past)", "fr": "Prétérit (passé terminé)", "form": "I visited / I didn’t visit / Did you visit?", "use": "finished past event", "keywords": "yesterday, last week, last year, in 2024", "examples": ["Last year, we went on a safari.", "We saw elephants.", "We didn’t see a rhino."], "quiz": [{"q": "Finished time:", "opts": ["We visited Africa last year.", "We have visited Africa last year.", "We visit Africa last year."], "a": "We visited Africa last year.", "hint": "last year → past simple"}, {"q": "Question:", "opts": ["Did you see lions?", "Did you saw lions?", "Do you saw lions?"], "a": "Did you see lions?", "hint": "Did + base verb"}, {"q": "Negative:", "opts": ["I didn’t go to court.", "I don’t went to court.", "I didn’t went to court."], "a": "I didn’t go to court.", "hint": "didn’t + base"}, {"q": "Yesterday:", "opts": ["Yesterday, I helped an injured bird.", "Yesterday, I have helped an injured bird.", "Yesterday, I help an injured bird."], "a": "Yesterday, I helped an injured bird.", "hint": "yesterday → past simple"}]}, {"key": "past_cont", "icon": "🟪", "title": "Past continuous (background)", "fr": "Passé continu (action en cours)", "form": "I was working / I wasn’t working / Were you working?", "use": "background action, action in progress", "keywords": "while, when (background)", "examples": ["While we were driving, we saw zebras.", "I was taking photos when a lion appeared.", "They were waiting while I was writing notes."], "quiz": [{"q": "Form:", "opts": ["I was taking notes.", "I was take notes.", "I were taking notes."], "a": "I was taking notes.", "hint": "was + -ing"}, {"q": "While + background:", "opts": ["While I was writing, the judge asked questions.", "While I wrote, the judge asked questions (background).", "While I was write, the judge asked questions."], "a": "While I was writing, the judge asked questions.", "hint": "was/were + -ing"}, {"q": "Negative:", "opts": ["I wasn’t sleeping.", "I didn’t sleeping.", "I wasn’t sleep."], "a": "I wasn’t sleeping.", "hint": "wasn’t + -ing"}, {"q": "Question:", "opts": ["Were they listening?", "Did they listening?", "Were they listen?"], "a": "Were they listening?", "hint": "Were + -ing"}]}, {"key": "present_perf", "icon": "🟩", "title": "Present perfect (experience / recent)", "fr": "Present perfect (expérience / récent)", "form": "I have helped / I haven’t helped / Have you helped?", "use": "experience, recent update (no finished time)", "keywords": "already, yet, just, ever, never, recently, lately", "examples": ["I’ve met my daughter‑in‑law.", "I’ve already sent a message.", "I haven’t visited Denmark yet."], "quiz": [{"q": "No finished time:", "opts": ["I’ve met her twice.", "I met her twice yesterday.", "I have meet her twice."], "a": "I’ve met her twice.", "hint": "have + past participle"}, {"q": "Just (recent):", "opts": ["I’ve just arrived.", "I’ve just arrive.", "I just have arrived."], "a": "I’ve just arrived.", "hint": "just + present perfect"}, {"q": "Ever:", "opts": ["Have you ever worked with animals?", "Did you ever worked with animals?", "Have you ever work with animals?"], "a": "Have you ever worked with animals?", "hint": "Have you ever + pp"}, {"q": "Yet (question):", "opts": ["Have you finished yet?", "Did you finished yet?", "Have you finish yet?"], "a": "Have you finished yet?", "hint": "Have + pp + yet"}]}, {"key": "future", "icon": "🟨", "title": "Future (plan + arrangement)", "fr": "Futur (plan + rendez‑vous)", "form": "going to / will / present continuous", "use": "plans, arrangements, decisions, offers", "keywords": "tomorrow, next week, on Saturday, at 3 pm", "examples": ["I’m going to call you this weekend.", "I’m meeting you on Friday at 6.", "I’ll send you the photos later."], "quiz": [{"q": "Plan:", "opts": ["I’m going to visit Denmark next month.", "I’m go to visit Denmark next month.", "I will going to visit Denmark next month."], "a": "I’m going to visit Denmark next month.", "hint": "am/is/are going to"}, {"q": "Decision now:", "opts": ["I’ll call you now.", "I’m going to call you now (decision).", "I calling you now."], "a": "I’ll call you now.", "hint": "decision now → will"}, {"q": "Arrangement:", "opts": ["I’m meeting you on Friday at 6.", "I meet you in Friday at 6.", "I’m meeting you in Friday at 6."], "a": "I’m meeting you on Friday at 6.", "hint": "on day / at time"}, {"q": "Offer:", "opts": ["I’ll help you.", "I’m going to help you (offer).", "I helping you."], "a": "I’ll help you.", "hint": "offer → will"}]}];
  var IRREGULARS=[{"base": "be", "past": "was/were", "fr": "être"}, {"base": "go", "past": "went", "fr": "aller"}, {"base": "come", "past": "came", "fr": "venir"}, {"base": "do", "past": "did", "fr": "faire"}, {"base": "have", "past": "had", "fr": "avoir"}, {"base": "make", "past": "made", "fr": "faire / fabriquer"}, {"base": "get", "past": "got", "fr": "obtenir / recevoir"}, {"base": "meet", "past": "met", "fr": "rencontrer"}, {"base": "see", "past": "saw", "fr": "voir"}, {"base": "take", "past": "took", "fr": "prendre"}, {"base": "give", "past": "gave", "fr": "donner"}, {"base": "find", "past": "found", "fr": "trouver"}, {"base": "think", "past": "thought", "fr": "penser"}, {"base": "say", "past": "said", "fr": "dire"}, {"base": "tell", "past": "told", "fr": "raconter / dire"}, {"base": "feel", "past": "felt", "fr": "ressentir"}, {"base": "leave", "past": "left", "fr": "partir / quitter"}, {"base": "bring", "past": "brought", "fr": "apporter"}, {"base": "buy", "past": "bought", "fr": "acheter"}, {"base": "write", "past": "wrote", "fr": "écrire"}, {"base": "eat", "past": "ate", "fr": "manger"}, {"base": "drink", "past": "drank", "fr": "boire"}, {"base": "sleep", "past": "slept", "fr": "dormir"}, {"base": "wear", "past": "wore", "fr": "porter (vêtement)"}, {"base": "read", "past": "read", "fr": "lire"}];
  var IRR_MCQ=[{"q": "Past of “think” (penser):", "opts": ["went", "thought", "felt"], "a": "thought", "hint": "Irregular verb (memorise it).", "why": "think → thought"}, {"q": "Past of “say” (dire):", "opts": ["said", "felt", "got"], "a": "said", "hint": "Irregular verb (memorise it).", "why": "say → said"}, {"q": "Past of “read” (lire):", "opts": ["left", "made", "read"], "a": "read", "hint": "Irregular verb (memorise it).", "why": "read → read"}, {"q": "Past of “be” (être):", "opts": ["drank", "was/were", "went"], "a": "was/were", "hint": "Irregular verb (memorise it).", "why": "be → was/were"}, {"q": "Past of “find” (trouver):", "opts": ["found", "made", "read"], "a": "found", "hint": "Irregular verb (memorise it).", "why": "find → found"}, {"q": "Past of “go” (aller):", "opts": ["went", "wore", "gave"], "a": "went", "hint": "Irregular verb (memorise it).", "why": "go → went"}, {"q": "Past of “buy” (acheter):", "opts": ["had", "was/were", "bought"], "a": "bought", "hint": "Irregular verb (memorise it).", "why": "buy → bought"}, {"q": "Past of “meet” (rencontrer):", "opts": ["met", "had", "thought"], "a": "met", "hint": "Irregular verb (memorise it).", "why": "meet → met"}, {"q": "Past of “eat” (manger):", "opts": ["brought", "ate", "slept"], "a": "ate", "hint": "Irregular verb (memorise it).", "why": "eat → ate"}, {"q": "Past of “wear” (porter (vêtement)):", "opts": ["ate", "wore", "felt"], "a": "wore", "hint": "Irregular verb (memorise it).", "why": "wear → wore"}, {"q": "Past of “come” (venir):", "opts": ["wore", "came", "went"], "a": "came", "hint": "Irregular verb (memorise it).", "why": "come → came"}, {"q": "Past of “make” (faire / fabriquer):", "opts": ["thought", "took", "made"], "a": "made", "hint": "Irregular verb (memorise it).", "why": "make → made"}, {"q": "Past of “write” (écrire):", "opts": ["brought", "wrote", "bought"], "a": "wrote", "hint": "Irregular verb (memorise it).", "why": "write → wrote"}, {"q": "Past of “feel” (ressentir):", "opts": ["felt", "left", "did"], "a": "felt", "hint": "Irregular verb (memorise it).", "why": "feel → felt"}, {"q": "Past of “see” (voir):", "opts": ["saw", "wrote", "drank"], "a": "saw", "hint": "Irregular verb (memorise it).", "why": "see → saw"}];
  var VOCAB=[{"cat": "Time words", "icon": "🕒", "en": "yesterday", "fr": "hier", "def": "Time marker for past simple", "ex": "Yesterday, I visited my son."}, {"cat": "Time words", "icon": "📅", "en": "last week / last month / last year", "fr": "la semaine dernière / le mois dernier / l’année dernière", "def": "Time marker for past simple", "ex": "Last week, we had a meeting."}, {"cat": "Time words", "icon": "🗓️", "en": "in 2024 / in May", "fr": "en 2024 / en mai", "def": "Time marker for past simple", "ex": "In May, we travelled."}, {"cat": "Time words", "icon": "⏰", "en": "two days ago", "fr": "il y a deux jours", "def": "Time marker for past simple", "ex": "Two days ago, I worked."}, {"cat": "Time words", "icon": "🌙", "en": "last night", "fr": "hier soir", "def": "Time marker for past simple", "ex": "Last night, I watched a film."}, {"cat": "Time words", "icon": "📌", "en": "on Monday", "fr": "lundi", "def": "Time marker for past simple", "ex": "On Monday, I called you."}, {"cat": "Story verbs", "icon": "✈️", "en": "to travel", "fr": "voyager", "def": "to go to another place", "ex": "We travelled to Africa last year."}, {"cat": "Story verbs", "icon": "🦁", "en": "to see", "fr": "voir", "def": "to notice with your eyes", "ex": "We saw lions on safari."}, {"cat": "Story verbs", "icon": "📸", "en": "to take photos", "fr": "prendre des photos", "def": "to take pictures", "ex": "I took photos of elephants."}, {"cat": "Story verbs", "icon": "🩺", "en": "to treat", "fr": "soigner", "def": "to give medical care", "ex": "We treated an injured bird."}, {"cat": "Story verbs", "icon": "🧤", "en": "to wear gloves", "fr": "porter des gants", "def": "to put gloves on your hands", "ex": "I wore gloves for safety."}, {"cat": "Story verbs", "icon": "📝", "en": "to write a report", "fr": "rédiger un rapport", "def": "to write an official text", "ex": "I wrote a short report last week."}, {"cat": "Story verbs", "icon": "🏛️", "en": "to attend a hearing", "fr": "assister à une audience", "def": "to go to a court hearing", "ex": "I attended a court hearing last month."}, {"cat": "Story verbs", "icon": "📞", "en": "to call", "fr": "appeler", "def": "to phone someone", "ex": "I called my daughter‑in‑law yesterday."}, {"cat": "Story verbs", "icon": "🤝", "en": "to support", "fr": "accompagner", "def": "to help someone", "ex": "I supported a young person last week."}];
  var MCQ=[{"q": "Choose the correct past simple: Yesterday, I ____ my daughter‑in‑law.", "opts": ["called", "call", "calling"], "a": "called", "hint": "yesterday → past simple", "why": "Finished time (yesterday) → past simple: called."}, {"q": "Choose the correct negative: I ____ go to the clinic yesterday.", "opts": ["didn't", "don't", "doesn't"], "a": "didn't", "hint": "past negative uses didn't", "why": "Past negative = didn’t + base verb."}, {"q": "Choose the correct form: She ____ a report last week.", "opts": ["wrote", "write", "written"], "a": "wrote", "hint": "write → wrote (past)", "why": "Past simple: write → wrote."}, {"q": "Question form: ____ you visit Denmark last year?", "opts": ["Did", "Do", "Have"], "a": "Did", "hint": "past question uses Did", "why": "Past questions: Did + subject + base verb."}, {"q": "Choose the correct verb: We ____ lions on safari.", "opts": ["saw", "see", "seen"], "a": "saw", "hint": "see → saw", "why": "Past simple: see → saw."}, {"q": "Spelling: stop → ____", "opts": ["stopped", "stoped", "stopping"], "a": "stopped", "hint": "double consonant", "why": "One syllable CVC → double last consonant: stopped."}, {"q": "Spelling: study → ____", "opts": ["studied", "studyed", "studys"], "a": "studied", "hint": "y → ied", "why": "Consonant + y → ied: studied."}, {"q": "Spelling: arrive → ____", "opts": ["arrived", "arriveed", "arriving"], "a": "arrived", "hint": "e + d", "why": "Verb ends in e → add d: arrived."}, {"q": "Choose the correct sentence:", "opts": ["Last night, we watched a film.", "Last night, we watch a film.", "Last night, we have watched a film."], "a": "Last night, we watched a film.", "hint": "last night → past simple", "why": "Finished time = past simple."}, {"q": "Choose the best time marker for past simple:", "opts": ["in 2024", "today", "right now"], "a": "in 2024", "hint": "finished time", "why": "Past simple uses finished time (in 2024)."}, {"q": "Choose the correct question: ____ she call you yesterday?", "opts": ["Did", "Do", "Was"], "a": "Did", "hint": "Did + base verb", "why": "Past question uses Did."}, {"q": "Choose the correct short answer: Did you go? — Yes, I ____.", "opts": ["did", "do", "have"], "a": "did", "hint": "short answer: did", "why": "Short answers for past simple use did."}, {"q": "Choose the correct negative: They ____ see a rhino.", "opts": ["didn't", "weren't", "haven't"], "a": "didn't", "hint": "didn't + base", "why": "didn’t + base verb."}, {"q": "Choose the correct verb: We ____ at the lodge at 5 pm.", "opts": ["arrived", "arrive", "have arrived"], "a": "arrived", "hint": "finished time", "why": "Past simple: arrived."}, {"q": "Choose the correct verb: I ____ notes while the judge spoke.", "opts": ["took", "take", "taken"], "a": "took", "hint": "take → took", "why": "Past simple: take → took."}, {"q": "Choose the correct: Two days ago, I ____ an injured bird.", "opts": ["treated", "treat", "have treated"], "a": "treated", "hint": "two days ago → past simple", "why": "Finished time → treated."}, {"q": "Choose the correct connector for a story start: ____ we arrived at the camp.", "opts": ["First,", "Because", "However,"], "a": "First,", "hint": "sequencing connector", "why": "First starts a story."}, {"q": "Choose the correct: We were tired, ____ we went home.", "opts": ["so", "while", "yet"], "a": "so", "hint": "result connector", "why": "So shows result."}, {"q": "Choose the correct: It was scary, ____ exciting.", "opts": ["but", "because", "after"], "a": "but", "hint": "contrast", "why": "But shows contrast."}, {"q": "Choose the correct: ____ Monday, I attended a hearing.", "opts": ["On", "In", "At"], "a": "On", "hint": "on + day", "why": "On Monday."}];
  var FIB=[{"id": "fib1", "sent": "Yesterday, I ____ (call) my daughter‑in‑law.", "a": "called", "hint": "call → called"}, {"id": "fib2", "sent": "Last year, we ____ (go) on a safari.", "a": "went", "hint": "go → went"}, {"id": "fib3", "sent": "We ____ (see) elephants near the river.", "a": "saw", "hint": "see → saw"}, {"id": "fib4", "sent": "I ____ (not / go) to court last week.", "a": "didn't go", "hint": "didn't + base verb"}, {"id": "fib5", "sent": "____ you ____ (visit) Denmark in 2024?", "a": "Did you visit", "hint": "Did + subject + base verb"}, {"id": "fib6", "sent": "She ____ (write) a report yesterday.", "a": "wrote", "hint": "write → wrote"}, {"id": "fib7", "sent": "We ____ (stop) the car and took photos.", "a": "stopped", "hint": "stop → stopped (double consonant)"}, {"id": "fib8", "sent": "He ____ (study) English last month.", "a": "studied", "hint": "study → studied"}, {"id": "fib9", "sent": "They ____ (arrive) at the lodge at 6 pm.", "a": "arrived", "hint": "arrive → arrived"}, {"id": "fib10", "sent": "We ____ (not / see) a rhino.", "a": "didn't see", "hint": "didn't + base verb"}, {"id": "fib11", "sent": "I ____ (take) notes during the meeting.", "a": "took", "hint": "take → took"}, {"id": "fib12", "sent": "Last night, I ____ (watch) a film.", "a": "watched", "hint": "watch → watched"}, {"id": "fib13", "sent": "The vet ____ (give) medicine.", "a": "gave", "hint": "give → gave"}, {"id": "fib14", "sent": "We ____ (feel) happy after the trip.", "a": "felt", "hint": "feel → felt"}, {"id": "fib15", "sent": "I ____ (meet) the guide on Monday.", "a": "met", "hint": "meet → met"}];
  var STORIES=[{"id": "story1", "title": "🦁 Safari day (Africa)", "hint": "Use First/Then/After that/Finally", "target": ["First, we arrived at the lodge.", "Then, we got into the safari jeep.", "After that, we saw elephants near the river.", "Finally, we watched the sunset and returned to the camp."]}, {"id": "story2", "title": "🐿️ Vet clinic day (small animals)", "hint": "Use time markers + past verbs", "target": ["Yesterday, an injured bird arrived at the clinic.", "Then, I put on gloves and prepared a carrier.", "After that, we cleaned the wound and put a bandage on.", "Finally, we fed the bird slowly and planned a follow-up."]}, {"id": "story3", "title": "🧑‍⚖️ Youth support meeting", "hint": "Add one negative (didn't)", "target": ["Last week, I read the case file.", "Then, I met the young person and listened carefully.", "After that, I wrote a short report for the judge.", "Finally, we scheduled a follow-up meeting."]}, {"id": "story4", "title": "🇩🇰 Catching up (Denmark)", "hint": "Ask one question with Did…?", "target": ["Yesterday, I called my daughter‑in‑law.", "Then, I asked: Did you enjoy Denmark?", "After that, I shared a story about Africa.", "Finally, we planned the next call."]}];
  var BUILD_SENTENCES=[{"id": "bs1", "hint": "Time + past verb + object", "tokens": ["Yesterday,", "I", "called", "my", "daughter‑in‑law."], "target": "Yesterday, I called my daughter‑in‑law."}, {"id": "bs2", "hint": "Did + subject + base verb", "tokens": ["Did", "you", "visit", "Denmark", "last", "year?"], "target": "Did you visit Denmark last year?"}, {"id": "bs3", "hint": "didn't + base verb", "tokens": ["We", "didn't", "see", "a", "rhino", "last", "week."], "target": "We didn't see a rhino last week."}, {"id": "bs4", "hint": "Irregular past: go → went", "tokens": ["Last", "year,", "we", "went", "on", "a", "safari."], "target": "Last year, we went on a safari."}, {"id": "bs5", "hint": "Connector story line", "tokens": ["First,", "we", "arrived", "at", "the", "lodge."], "target": "First, we arrived at the lodge."}, {"id": "bs6", "hint": "Contrast", "tokens": ["It", "was", "scary,", "but", "exciting."], "target": "It was scary, but exciting."}];
  var ROLEPLAYS={"safari": {"title": "🦁 Roleplay: Safari story (past simple)", "steps": [{"t": "Tell me one sentence about your trip (last year).", "targets": ["last year"], "model": "Last year, we went on a safari in Africa."}, {"t": "What happened first? Use First.", "targets": ["First,"], "model": "First, we arrived at the lodge."}, {"t": "Then what did you do? Use Then.", "targets": ["Then,"], "model": "Then, we got into the safari jeep."}, {"t": "What animals did you see? Use saw.", "targets": ["saw"], "model": "We saw elephants and zebras."}, {"t": "Give a negative sentence: you didn’t see a rhino.", "targets": ["didn't"], "model": "We didn't see a rhino."}, {"t": "Finish with Finally.", "targets": ["Finally,"], "model": "Finally, we watched the sunset and returned to the camp."}], "phrases": ["Last year…", "Yesterday…", "First / Then / After that / Finally", "Did you…?", "We didn’t…"]}, "vet": {"title": "🐿️ Roleplay: Vet clinic (yesterday)", "steps": [{"t": "What happened yesterday at the clinic?", "targets": ["yesterday"], "model": "Yesterday, an injured bird arrived at the clinic."}, {"t": "What did you do first? (gloves)", "targets": ["First,", "gloves"], "model": "First, I wore gloves for safety."}, {"t": "Then what did you do? (carrier)", "targets": ["Then,", "carrier"], "model": "Then, I prepared a carrier."}, {"t": "What treatment did you do? (cleaned / bandage)", "targets": ["cleaned", "bandage"], "model": "We cleaned the wound and put a bandage on."}, {"t": "Did you give food? Use fed.", "targets": ["fed"], "model": "Yes, we fed the bird slowly."}, {"t": "Finish with Finally.", "targets": ["Finally,"], "model": "Finally, we planned a follow-up and release."}], "phrases": ["Yesterday…", "First / Then / After that / Finally", "I wore gloves.", "We cleaned the wound.", "We fed it slowly."]}, "youth": {"title": "🧑‍⚖️ Roleplay: Youth support (last week)", "steps": [{"t": "What did you do last week?", "targets": ["last week"], "model": "Last week, I read the case file."}, {"t": "Then what happened? Use met.", "targets": ["Then,", "met"], "model": "Then, I met the young person."}, {"t": "Did you attend a hearing? (Did + base)", "targets": ["Did"], "model": "Did you attend a hearing last month?"}, {"t": "Give a negative: you didn’t go to court yesterday.", "targets": ["didn't"], "model": "I didn't go to court yesterday."}, {"t": "What did you write? (report)", "targets": ["report"], "model": "I wrote a short report for the judge."}, {"t": "Finish with Finally.", "targets": ["Finally,"], "model": "Finally, we scheduled a follow-up meeting."}], "phrases": ["Last week…", "Did you…?", "I didn’t…", "I wrote a report.", "We scheduled a follow-up."]}};
  var WRITING_TASKS=[{"id": "w1", "title": "🦁 True story: Safari day (A2+)", "subject": "Write a short story about a safari day.", "steps": ["Use 4 connectors: First/Then/After that/Finally", "Use 5 past verbs (went/saw/arrived/took/watched)", "Add 1 feeling with but", "Add 1 time marker (last year / yesterday / in 2024)"], "model": "Last year, we went on a safari in Africa. First, we arrived at the lodge and met the guide. Then, we got into the safari jeep. After that, we saw elephants near the river and took photos. Finally, we watched the sunset and returned to the camp. It was scary sometimes, but it was amazing.", "checks": [{"label": "Time marker (yesterday/last/in 2024)", "re": "\\b(yesterday|last|in 20\\d{2})\\b"}, {"label": "Sequencing connectors (first/then/after/finally)", "re": "\\b(first|then|after that|finally)\\b"}, {"label": "At least 4 past verbs", "re": "\\b(went|saw|arrived|took|watched|visited|called|wrote|met|gave|felt|stopped|fed|cleaned)\\b"}, {"label": "Contrast (but)", "re": "\\bbut\\b"}]}, {"id": "w2", "title": "🐿️ True story: Vet clinic (yesterday)", "subject": "Write what you did at the clinic yesterday.", "steps": ["Start with Yesterday", "Use First/Then/After that/Finally", "Use 5 rescue words (gloves, carrier, wound, bandage, fed)", "Add 1 negative sentence (didn't)"], "model": "Yesterday, an injured bird arrived at the clinic. First, I wore gloves and prepared a carrier. Then, we cleaned the wound and put a bandage on. After that, we fed the bird slowly. Finally, we planned a follow-up. We didn't panic, and we stayed calm.", "checks": [{"label": "Yesterday", "re": "\\byesterday\\b"}, {"label": "Connectors (first/then/after/finally)", "re": "\\b(first|then|after that|finally)\\b"}, {"label": "Rescue words (gloves/carrier/wound/bandage/fed)", "re": "\\b(gloves|carrier|wound|bandage|fed)\\b"}, {"label": "Negative (didn't)", "re": "\\bdidn't\\b"}]}, {"id": "w3", "title": "🧑‍⚖️ True story: Youth support (last week)", "subject": "Write a short summary of last week.", "steps": ["Use Last week / On Monday", "Use 4 past verbs (read/met/wrote/scheduled)", "Add 1 question with Did…?", "Add 1 connector (because/so)"], "model": "Last week, I read the case file and met the young person. On Monday, I listened carefully and took notes. I wrote a short report for the judge, so the team understood the situation. Did you attend a court hearing last month? Finally, we scheduled a follow-up meeting.", "checks": [{"label": "Time marker (last/on)", "re": "\\b(last|on)\\b"}, {"label": "Past verbs (read/met/wrote/scheduled)", "re": "\\b(read|met|wrote|scheduled|took|listened)\\b"}, {"label": "Question (Did)", "re": "\\bDid\\b"}, {"label": "Connector (because/so)", "re": "\\b(because|so)\\b"}]}];

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
      if(!confirm('Reset practice sections (MCQ/FIB/Story/Builder/Dialogue/Writing)?')) return;
      // keep only model stories/vocab flips - but easiest: clear solved keys with prefixes
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

    document.body.addEventListener('click', function(e){
      var b=e.target.closest('.speakBtn');
      if(!b) return;
      var t=b.getAttribute('data-say')||'';
      if(t) speak(t);
    });
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
    renderModel('safari');
  }

  // ---------- Irregular table ----------
  function renderIrregularTable(){
    var root=$('#irrTable');
    var head='<div class="irrRow head"><div>Base</div><div>Past</div><div>FR</div></div>';
    var rows=IRREGULARS.map(function(v){
      return '<div class="irrRow"><div><strong>'+esc(v.base)+'</strong></div><div>'+esc(v.past)+'</div><div><span class="muted">'+esc(v.fr)+'</span></div></div>';
    }).join('');
    root.innerHTML=head+rows;
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
  function renderMCQ(rootId, bank, prefix){
    var root=$(rootId);
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

  // ---------- Story order (drag/tap) ----------
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
              '<div class="slotText">Tap/drag the correct sentence here…</div>'+
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

      // check completion
      var allDone=true;
      $all('.slotText',$('#storySlots')).forEach(function(st){
        if(st.textContent.indexOf('Tap/drag')===0) allDone=false;
      });
      if(allDone){
        fb.textContent='🎉 Story complete!';
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
    // shuffle tokens but not already in correct order
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
    var t=norm(text);
    for(var i=0;i<targets.length;i++){
      var key=norm(targets[i]);
      if(key==='past simple'){
        // accept common past markers or -ed
        if(!(/\b(yesterday|last|in 20\d{2})\b/.test(t) || /\b\w+ed\b/.test(t))) return false;
        continue;
      }
      if(t.indexOf(key)===-1) return false;
    }
    return true;
  }

  function makeVariations(model){
    var v=[];
    v.push(model.replace(/\bI wore\b/g,'I used').replace(/\bprepared\b/g,'got ready')); // very light variations
    v.push(model.replace(/\bThen,\b/g,'After that,'));
    v.push(model.replace(/\bFinally,\b/g,'In the end,'));
    // de-dupe
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
    q += IRR_MCQ.length;
    q += BUILD_SENTENCES.length * 2; // builder gives 2 points each
    // story slots
    for(var i=0;i<STORIES.length;i++) q += STORIES[i].target.length;
    // roleplay steps
    var rp=0; for(var k in ROLEPLAYS){ if(ROLEPLAYS.hasOwnProperty(k)) rp += ROLEPLAYS[k].steps.length; }
    q += rp;
    // writing tasks (3 points each)
    q += WRITING_TASKS.length * 3;
    // model story mini quizzes (3 each)
    q += 3*3;
    return q;
  }

  // ---------- Irregular MCQ ----------
  function initIrregularTrainer(){
    renderMCQ('#mcqIrregular', IRR_MCQ, 'mcq_irr');
  }

  // ---------- Boot ----------
  function init(){
    initTop();
    initModelStories();

    renderIrregularTable();
    initIrregularTrainer();

    renderMCQ('#mcqMain', MCQ, 'mcq_main');
    renderFIB();
    initStories();
    initBuilder();
    initRoleplays();
    initWriting();
    renderVocab();

    totalPoints = computeTotal();
    updateHud();
    setHint('Tip: Read a model story first, then do MCQ + Fill‑in.');
  }

  document.addEventListener('DOMContentLoaded', init);
})();