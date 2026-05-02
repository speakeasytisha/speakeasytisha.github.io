
(function(){
  'use strict';
  function $(sel,root){ return (root||document).querySelector(sel); }
  function $all(sel,root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function norm(s){ return String(s||'').trim().toLowerCase().replace(/\s+/g,' '); }
  function shuffle(arr){ var a=arr.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  function esc(s){ return String(s).replace(/[&<>"']/g,function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); }); }

  var STORE='SET_past_cont_masterclass_v1';
  var state=load() || {score:0, solved:{}, accent:'US', speed:'normal', hints:true};

  var MODEL_STORIES={"safari": {"title": "🦁 Model true story — Safari moment (past continuous)", "en": ["Last year in Africa, we were driving slowly in the safari jeep.", "While we were driving, we were looking for elephants.", "I was taking photos when a lion appeared near the road.", "At that moment, my heart was beating fast, but I stayed quiet.", "After that, we continued the safari and watched the sunset."], "fr": ["L’année dernière en Afrique, nous roulions lentement en 4x4.", "Pendant que nous roulions, nous cherchions des éléphants.", "Je prenais des photos quand un lion est apparu près de la route.", "À ce moment-là, mon cœur battait vite, mais je suis restée silencieuse.", "Après ça, nous avons continué le safari et regardé le coucher du soleil."], "vocab": [["were driving", "roulions"], ["while", "pendant que"], ["was taking photos", "prenais des photos"], ["appeared", "est apparu"], ["at that moment", "à ce moment-là"]], "mini": [{"q": "Which word introduces the background action?", "a": "While", "opts": ["While", "Yesterday", "Finally"]}, {"q": "Which form is past continuous?", "a": "was taking", "opts": ["took", "was taking", "have taken"]}, {"q": "What happened suddenly?", "a": "A lion appeared", "opts": ["A lion appeared", "They book a flight", "They met a judge"]}]}, "vet": {"title": "🐿️ Model true story — Vet clinic moment", "en": ["Yesterday at 10, I was working at the vet clinic.", "While the vet was checking the animal, I was cleaning the wound.", "I was preparing a carrier when the phone rang.", "At that moment, we were trying to stay calm.", "After that, we fed the animal and planned a follow-up."], "fr": ["Hier à 10h, je travaillais au cabinet vétérinaire.", "Pendant que le vétérinaire examinait l’animal, je nettoyais la plaie.", "Je préparais une cage de transport quand le téléphone a sonné.", "À ce moment-là, nous essayions de rester calmes.", "Après ça, nous avons nourri l’animal et prévu un suivi."], "vocab": [["was working", "travaillais"], ["was checking", "examinait"], ["was cleaning", "nettoyais"], ["phone rang", "a sonné"], ["stay calm", "rester calme"]], "mini": [{"q": "What time was it?", "a": "10", "opts": ["10", "yesterday", "next week"]}, {"q": "What was the vet doing?", "a": "checking the animal", "opts": ["checking the animal", "booking a flight", "watching a film"]}, {"q": "Which verb is correct: ring (past) = ?", "a": "rang", "opts": ["rang", "ringed", "rung"]}]}, "youth": {"title": "🧑‍⚖️ Model true story — Youth support meeting", "en": ["Last week, I was attending a meeting with the team.", "While the judge was speaking, I was taking notes.", "I was listening carefully when a new question came up.", "At that moment, we were thinking about a support plan.", "After that, I wrote a short report and we scheduled a follow-up."], "fr": ["La semaine dernière, j’assistais à une réunion avec l’équipe.", "Pendant que le juge parlait, je prenais des notes.", "J’écoutais attentivement quand une nouvelle question est arrivée.", "À ce moment-là, nous réfléchissions à un plan d’accompagnement.", "Après ça, j’ai rédigé un court rapport et nous avons planifié un suivi."], "vocab": [["was attending", "assistais"], ["was speaking", "parlait"], ["was taking notes", "prenais des notes"], ["came up", "est arrivée"], ["support plan", "plan d’accompagnement"]], "mini": [{"q": "Who was speaking?", "a": "the judge", "opts": ["the judge", "the guide", "the vet"]}, {"q": "Which is the interruption connector?", "a": "when", "opts": ["when", "while", "for"]}, {"q": "What did she do after that?", "a": "wrote a report", "opts": ["wrote a report", "went yesterday", "will go tomorrow"]}]}};
  var CARDS=[{"key": "form", "icon": "🧩", "title": "Form (how to build it)", "fr": "Forme (construction)", "rule": "Past continuous = was/were + verb‑ing.", "form": "I/he/she/it: was + V‑ing • you/we/they: were + V‑ing", "examples": ["I was working at 10.", "We were driving slowly.", "They weren’t listening."], "quiz": [{"q": "Choose the correct form:", "opts": ["I was working.", "I were working.", "I working was."], "a": "I was working.", "hint": "I = was", "why": "I + was + -ing."}, {"q": "Choose the correct form:", "opts": ["They were waiting.", "They was waiting.", "They waiting were."], "a": "They were waiting.", "hint": "they = were", "why": "They + were + -ing."}, {"q": "Negative:", "opts": ["I wasn’t sleeping.", "I didn’t sleeping.", "I wasn’t sleep."], "a": "I wasn’t sleeping.", "hint": "wasn’t + -ing", "why": "Negative uses wasn’t/weren’t + -ing."}, {"q": "Question:", "opts": ["Were you listening?", "Did you listening?", "Were you listen?"], "a": "Were you listening?", "hint": "Were + subject + -ing", "why": "Were you listening? is correct."}]}, {"key": "use1", "icon": "⏳", "title": "Background action (while)", "fr": "Action en cours (pendant que)", "rule": "Use past continuous for the background action in a story.", "form": "While + was/were + V‑ing, …", "examples": ["While we were driving, we saw zebras.", "While the vet was checking the animal, I was cleaning the wound."], "quiz": [{"q": "Choose the best: ____ we were driving, we saw zebras.", "opts": ["While", "Because", "Tomorrow"], "a": "While", "hint": "while = pendant que", "why": "While introduces the background action."}, {"q": "Choose the best background:", "opts": ["I was taking photos when it started raining.", "I took photos when it started raining.", "I have taken photos when it started raining."], "a": "I was taking photos when it started raining.", "hint": "background + interruption", "why": "Was taking = background action in progress."}, {"q": "Choose the correct: While he ____ , I was writing.", "opts": ["was speaking", "spoke", "speaks"], "a": "was speaking", "hint": "was + ing", "why": "Background action: was speaking."}, {"q": "Choose the best: While I was cooking, he ____ TV.", "opts": ["was watching", "watched", "watches"], "a": "was watching", "hint": "two ongoing actions", "why": "Two background actions can both use past continuous."}]}, {"key": "use2", "icon": "⚡", "title": "Interruption (when + past simple)", "fr": "Interruption (quand)", "rule": "Often: past continuous (background) + past simple (interrupt).", "form": "was/were + V‑ing … when + past simple", "examples": ["I was sleeping when the phone rang.", "We were driving when a lion appeared."], "quiz": [{"q": "Choose the correct: I was sleeping when my phone ____.", "opts": ["rang", "was ringing", "rings"], "a": "rang", "hint": "interrupt action = past simple", "why": "The interruption uses past simple: rang."}, {"q": "Choose the best: We ____ when we saw the lion.", "opts": ["were driving", "drove", "have driven"], "a": "were driving", "hint": "background action", "why": "Background action in progress: were driving."}, {"q": "Choose the correct pair:", "opts": ["was taking / appeared", "took / was appearing", "have taken / appeared"], "a": "was taking / appeared", "hint": "background + interrupt", "why": "Was taking (background) + appeared (interrupt)."}, {"q": "Choose the best connector for interruption:", "opts": ["when", "for", "since"], "a": "when", "hint": "when = interruption", "why": "When often marks the interrupting event."}]}, {"key": "use3", "icon": "🕰️", "title": "A specific time in the past", "fr": "Moment précis dans le passé", "rule": "Use it with a specific past time (yesterday at 5, at that moment).", "form": "At 5 p.m. / yesterday at… + was/were + V‑ing", "examples": ["Yesterday at 9, I was watching a film.", "At 5 p.m., we were talking."], "quiz": [{"q": "Choose: Yesterday at 9, I ____ a film.", "opts": ["was watching", "watched", "have watched"], "a": "was watching", "hint": "specific past time → was/were + ing", "why": "At a specific time, use past continuous."}, {"q": "Choose: At 5 p.m., we ____ the report.", "opts": ["were writing", "wrote", "have written"], "a": "were writing", "hint": "were + ing", "why": "We were writing at that time."}, {"q": "Negative: At 8, I ____ working.", "opts": ["wasn’t", "didn’t", "haven’t"], "a": "wasn’t", "hint": "wasn’t + ing", "why": "Negative past continuous uses wasn’t."}, {"q": "Question: At 10, ____ you driving?", "opts": ["were", "did", "have"], "a": "were", "hint": "were you + ing", "why": "Were you driving? is correct."}]}, {"key": "vs_simple", "icon": "⚖️", "title": "Past continuous vs past simple", "fr": "past continuous vs prétérit", "rule": "Past simple = event (finished). Past continuous = action in progress (background).", "form": "Event: V2 • Background: was/were + ing", "examples": ["We were driving when we saw a zebra.", "I was writing when the phone rang."], "quiz": [{"q": "Event (finished): The phone ____.", "opts": ["rang", "was ringing", "ring"], "a": "rang", "hint": "event = past simple", "why": "Rang is the event."}, {"q": "Background: I ____ when the phone rang.", "opts": ["was sleeping", "slept", "have slept"], "a": "was sleeping", "hint": "background = was/were + ing", "why": "Was sleeping is background."}, {"q": "Choose: While she was speaking, I ____ notes.", "opts": ["was taking", "took", "have taken"], "a": "was taking", "hint": "two ongoing actions", "why": "While + ongoing action → past continuous."}, {"q": "Choose: We ____ the story and then we left.", "opts": ["finished", "were finishing", "have finished"], "a": "finished", "hint": "sequence event", "why": "Finished is a completed event."}]}];
  var TIME_WORDS=[{"icon": "🕔", "en": "at 5 p.m. / at that moment", "fr": "à 17h / à ce moment-là", "ex": "At 5 p.m., I was calling you."}, {"icon": "📅", "en": "yesterday at…", "fr": "hier à…", "ex": "Yesterday at 10, we were driving."}, {"icon": "⏳", "en": "while", "fr": "pendant que", "ex": "While we were driving, we saw zebras."}, {"icon": "⚡", "en": "when", "fr": "quand / lorsque", "ex": "I was taking photos when a lion appeared."}, {"icon": "🕰️", "en": "all morning / all day", "fr": "toute la matinée / toute la journée", "ex": "I was working all morning."}, {"icon": "🌙", "en": "last night at…", "fr": "hier soir à…", "ex": "Last night at 9, I was watching a film."}];
  var ING_RULES=[{"rule": "Most verbs: add -ing", "ex": "work → working"}, {"rule": "Verb ends in -e: drop -e + ing", "ex": "make → making"}, {"rule": "1 syllable CVC: double last consonant", "ex": "run → running"}, {"rule": "Verb ends in -ie: change to -y + ing", "ex": "lie → lying"}];
  var VOCAB=[{"cat": "Time words", "icon": "🕔", "en": "at 5 p.m. / at that moment", "fr": "à 17h / à ce moment-là", "def": "past continuous time marker", "ex": "At 5 p.m., I was calling you."}, {"cat": "Time words", "icon": "📅", "en": "yesterday at…", "fr": "hier à…", "def": "past continuous time marker", "ex": "Yesterday at 10, we were driving."}, {"cat": "Time words", "icon": "⏳", "en": "while", "fr": "pendant que", "def": "past continuous time marker", "ex": "While we were driving, we saw zebras."}, {"cat": "Time words", "icon": "⚡", "en": "when", "fr": "quand / lorsque", "def": "past continuous time marker", "ex": "I was taking photos when a lion appeared."}, {"cat": "Time words", "icon": "🕰️", "en": "all morning / all day", "fr": "toute la matinée / toute la journée", "def": "past continuous time marker", "ex": "I was working all morning."}, {"cat": "Time words", "icon": "🌙", "en": "last night at…", "fr": "hier soir à…", "def": "past continuous time marker", "ex": "Last night at 9, I was watching a film."}, {"cat": "Grammar words", "icon": "⏳", "en": "while", "fr": "pendant que", "def": "introduces background action", "ex": "While I was cooking, he was studying."}, {"cat": "Grammar words", "icon": "⚡", "en": "when", "fr": "quand / lorsque", "def": "introduces the interruption", "ex": "I was sleeping when the phone rang."}, {"cat": "Grammar words", "icon": "❌", "en": "wasn’t / weren’t", "fr": "n’étais pas / n’étions pas", "def": "negative past continuous", "ex": "I wasn’t working at 8."}, {"cat": "Grammar words", "icon": "❓", "en": "Were you…?", "fr": "Tu étais en train de… ?", "def": "question form", "ex": "Were you waiting when I called?"}, {"cat": "Story verbs", "icon": "🚙", "en": "to drive", "fr": "conduire", "def": "to use a car", "ex": "We were driving when we saw zebras."}, {"cat": "Story verbs", "icon": "📸", "en": "to take photos", "fr": "prendre des photos", "def": "to take pictures", "ex": "I was taking photos when it started raining."}, {"cat": "Story verbs", "icon": "🦁", "en": "to appear", "fr": "apparaître", "def": "to come into view", "ex": "A lion appeared suddenly."}, {"cat": "Story verbs", "icon": "📞", "en": "to ring", "fr": "sonner", "def": "phone makes a sound", "ex": "My phone rang while I was sleeping."}, {"cat": "Story verbs", "icon": "📝", "en": "to take notes", "fr": "prendre des notes", "def": "write notes", "ex": "I was taking notes during the meeting."}, {"cat": "Story verbs", "icon": "🩺", "en": "to check", "fr": "examiner", "def": "look carefully", "ex": "The vet was checking the animal."}];
  var MCQ=[{"q": "Form: I ____ working at 10.", "opts": ["was", "were", "did"], "a": "was", "hint": "I = was", "why": "I was working."}, {"q": "Form: They ____ waiting.", "opts": ["were", "was", "have"], "a": "were", "hint": "they = were", "why": "They were waiting."}, {"q": "Negative: She ____ listening.", "opts": ["wasn't", "didn't", "hasn't"], "a": "wasn't", "hint": "wasn't + -ing", "why": "She wasn’t listening."}, {"q": "Question: ____ you driving at 5?", "opts": ["Were", "Did", "Have"], "a": "Were", "hint": "Were you + -ing", "why": "Were you driving…?"}, {"q": "Choose while/when: ____ we were driving, we saw zebras.", "opts": ["While", "When", "For"], "a": "While", "hint": "background", "why": "While introduces background action."}, {"q": "Choose while/when: I was taking photos ____ a lion appeared.", "opts": ["when", "while", "since"], "a": "when", "hint": "interruption", "why": "When marks the interrupting event."}, {"q": "Background: We ____ when it started raining.", "opts": ["were walking", "walked", "have walked"], "a": "were walking", "hint": "action in progress", "why": "Were walking = action in progress."}, {"q": "Event: It ____ suddenly.", "opts": ["started", "was starting", "have started"], "a": "started", "hint": "event in past simple", "why": "Started = completed event."}, {"q": "At that time: Yesterday at 9, I ____ a film.", "opts": ["was watching", "watched", "have watched"], "a": "was watching", "hint": "specific time", "why": "At 9 → was watching."}, {"q": "Two actions: While I was cooking, he ____ TV.", "opts": ["was watching", "watched", "watches"], "a": "was watching", "hint": "two ongoing actions", "why": "Both actions ongoing → past continuous."}, {"q": "Spelling: make →", "opts": ["making", "makeing", "makking"], "a": "making", "hint": "drop -e", "why": "Make → making."}, {"q": "Spelling: run →", "opts": ["running", "runing", "runnning"], "a": "running", "hint": "double consonant", "why": "Run → running."}, {"q": "Spelling: lie →", "opts": ["lying", "lieing", "lieying"], "a": "lying", "hint": "ie → y", "why": "Lie → lying."}, {"q": "Choose: I ____ sleeping when the phone rang.", "opts": ["was", "were", "did"], "a": "was", "hint": "I = was", "why": "I was sleeping."}, {"q": "Choose: The phone ____.", "opts": ["rang", "was ringing", "rings"], "a": "rang", "hint": "event", "why": "Rang is past simple event."}, {"q": "Choose: We ____ driving when we saw a lion.", "opts": ["were", "was", "did"], "a": "were", "hint": "we = were", "why": "We were driving."}, {"q": "Choose: He ____ not working.", "opts": ["was", "did", "have"], "a": "was", "hint": "was not", "why": "He was not working."}, {"q": "Choose: They ____ not listening.", "opts": ["were", "was", "did"], "a": "were", "hint": "were not", "why": "They were not listening."}, {"q": "Choose: At 10, ____ she working?", "opts": ["was", "did", "have"], "a": "was", "hint": "Was she…?", "why": "Was she working? is correct."}, {"q": "Choose: At 10, ____ they working?", "opts": ["were", "was", "did"], "a": "were", "hint": "Were they…?", "why": "Were they working? is correct."}, {"q": "Choose: While the vet ____ the animal, I was cleaning the wound.", "opts": ["was checking", "checked", "checks"], "a": "was checking", "hint": "background", "why": "Was checking = background action."}, {"q": "Choose: I was preparing a carrier when the phone ____.", "opts": ["rang", "was ringing", "rings"], "a": "rang", "hint": "event", "why": "Rang = interruption event."}, {"q": "Choose: Last week, I ____ a report (event).", "opts": ["wrote", "was writing", "have written"], "a": "wrote", "hint": "past simple event", "why": "Wrote = completed event."}, {"q": "Choose: Last week at 10, I ____ a report (in progress).", "opts": ["was writing", "wrote", "have written"], "a": "was writing", "hint": "in progress", "why": "At 10 → was writing."}];
  var FIB=[{"id": "fib1", "sent": "At 5 p.m., I ____ (work).", "a": "was working", "hint": "I was working"}, {"id": "fib2", "sent": "Yesterday at 9, we ____ (watch) a film.", "a": "were watching", "hint": "we were watching"}, {"id": "fib3", "sent": "While we ____ (drive), we saw zebras.", "a": "were driving", "hint": "were driving"}, {"id": "fib4", "sent": "I was taking photos when a lion ____ (appear).", "a": "appeared", "hint": "event past simple: appeared"}, {"id": "fib5", "sent": "The phone ____ (ring) while I was sleeping.", "a": "rang", "hint": "ring → rang"}, {"id": "fib6", "sent": "She ____ (not / listen).", "a": "wasn't listening", "hint": "wasn’t + -ing"}, {"id": "fib7", "sent": "They ____ (not / wait).", "a": "weren't waiting", "hint": "weren’t + -ing"}, {"id": "fib8", "sent": "____ you ____ (drive) at 10?", "a": "Were you driving", "hint": "Were you + -ing"}, {"id": "fib9", "sent": "At that moment, we ____ (try) to stay calm.", "a": "were trying", "hint": "were trying"}, {"id": "fib10", "sent": "While the vet ____ (check) the animal, I was cleaning the wound.", "a": "was checking", "hint": "was checking"}, {"id": "fib11", "sent": "I ____ (prepare) a carrier when the phone rang.", "a": "was preparing", "hint": "was preparing"}, {"id": "fib12", "sent": "Last night at 9, I ____ (study).", "a": "was studying", "hint": "was studying"}, {"id": "fib13", "sent": "We ____ (not / talk) at 8.", "a": "weren't talking", "hint": "weren’t talking"}, {"id": "fib14", "sent": "He ____ (run) when he fell.", "a": "was running", "hint": "was running"}, {"id": "fib15", "sent": "She was ____ (make) dinner.", "a": "making", "hint": "make → making"}, {"id": "fib16", "sent": "They were ____ (lie) on the grass.", "a": "lying", "hint": "lie → lying"}, {"id": "fib17", "sent": "I was ____ (write) notes.", "a": "writing", "hint": "write → writing"}, {"id": "fib18", "sent": "While the judge was speaking, I ____ (take) notes.", "a": "was taking", "hint": "was taking"}];
  var STORIES=[{"id": "story1", "title": "🦁 Safari moment (while/when)", "hint": "Background → event", "target": ["First, we were driving slowly in the safari jeep.", "While we were driving, we were looking for elephants.", "I was taking photos when a lion appeared.", "Finally, we watched the sunset and returned to the camp."]}, {"id": "story2", "title": "🐿️ Vet clinic moment (yesterday at…)", "hint": "Use a specific past time", "target": ["Yesterday at 10, I was working at the vet clinic.", "While the vet was checking the animal, I was cleaning the wound.", "I was preparing a carrier when the phone rang.", "After that, we fed the animal and planned a follow-up."]}, {"id": "story3", "title": "🧑‍⚖️ Meeting moment", "hint": "Two actions with while", "target": ["Last week, I was attending a meeting.", "While the judge was speaking, I was taking notes.", "I was listening carefully when a new question came up.", "After that, I wrote a short report."]}, {"id": "story4", "title": "📞 Phone moment", "hint": "Background + interruption", "target": ["Last night at 9, I was studying.", "I was writing notes when my phone rang.", "At that moment, I wasn’t sleeping — I was working!", "Finally, I called back."]}];
  var BUILD_SENTENCES=[{"id": "bs1", "hint": "specific time + was/were + ing", "tokens": ["Yesterday", "at", "9,", "I", "was", "watching", "a", "film."], "target": "Yesterday at 9, I was watching a film."}, {"id": "bs2", "hint": "while + background", "tokens": ["While", "we", "were", "driving,", "we", "saw", "zebras."], "target": "While we were driving, we saw zebras."}, {"id": "bs3", "hint": "when + interruption", "tokens": ["I", "was", "taking", "photos", "when", "a", "lion", "appeared."], "target": "I was taking photos when a lion appeared."}, {"id": "bs4", "hint": "negative", "tokens": ["She", "wasn't", "listening", "at", "10."], "target": "She wasn't listening at 10."}, {"id": "bs5", "hint": "question", "tokens": ["Were", "you", "driving", "at", "5?"], "target": "Were you driving at 5?"}, {"id": "bs6", "hint": "two actions", "tokens": ["While", "the", "vet", "was", "checking", "the", "animal,", "I", "was", "cleaning", "the", "wound."], "target": "While the vet was checking the animal, I was cleaning the wound."}];
  var ROLEPLAYS={"family": {"title": "📞 Roleplay: What were you doing? (phone call)", "steps": [{"t": "Ask: what were you doing at 9 last night?", "targets": ["were you"], "model": "What were you doing at 9 last night?"}, {"t": "Answer with past continuous (studying).", "targets": ["was"], "model": "I was studying at 9."}, {"t": "Use while: while I was studying, the phone rang.", "targets": ["while"], "model": "While I was studying, the phone rang."}, {"t": "Use when: I was writing when you called.", "targets": ["when"], "model": "I was writing when you called."}, {"t": "Make a negative: I wasn’t sleeping.", "targets": ["wasn’t"], "model": "I wasn’t sleeping. I was working."}, {"t": "Close with a friendly line.", "targets": ["was"], "model": "I was busy, but I’m free now."}], "phrases": ["What were you doing…?", "I was… / We were…", "While…, …", "… when …", "I wasn’t…"]}, "vet": {"title": "🐿️ Roleplay: Vet clinic moment (yesterday at 10)", "steps": [{"t": "Say what you were doing yesterday at 10.", "targets": ["yesterday"], "model": "Yesterday at 10, I was working at the vet clinic."}, {"t": "Use while: the vet was checking, you were cleaning.", "targets": ["while"], "model": "While the vet was checking the animal, I was cleaning the wound."}, {"t": "Use when: you were preparing a carrier when the phone rang.", "targets": ["when"], "model": "I was preparing a carrier when the phone rang."}, {"t": "Ask a question: Were you wearing gloves?", "targets": ["were"], "model": "Were you wearing gloves?"}, {"t": "Answer: Yes, I was / No, I wasn’t.", "targets": ["was"], "model": "Yes, I was."}, {"t": "Close: At that moment, we were staying calm.", "targets": ["were"], "model": "At that moment, we were staying calm."}], "phrases": ["Yesterday at…", "While…, …", "… when …", "Were you…?", "Yes, I was / No, I wasn’t"]}, "youth": {"title": "🧑‍⚖️ Roleplay: Meeting + notes (while)", "steps": [{"t": "Say what you were doing last week (meeting).", "targets": ["was"], "model": "Last week, I was attending a meeting."}, {"t": "Use while: the judge was speaking, you were taking notes.", "targets": ["while"], "model": "While the judge was speaking, I was taking notes."}, {"t": "Use when: you were listening when a question came up.", "targets": ["when"], "model": "I was listening carefully when a new question came up."}, {"t": "Ask: Were you feeling nervous?", "targets": ["were"], "model": "Were you feeling nervous?"}, {"t": "Answer with was/were + feeling.", "targets": ["was"], "model": "Yes, I was a little nervous."}, {"t": "Close with after that + event (past simple).", "targets": ["after that"], "model": "After that, I wrote a short report."}], "phrases": ["I was… / We were…", "While…, …", "… when …", "Were you…?", "After that, I wrote…"]}};
  var WRITING_TASKS=[{"id": "w1", "title": "🦁 Safari moment (while/when)", "subject": "Write a short story using past continuous + past simple.", "steps": ["Use 2 past continuous sentences (was/were + ing)", "Use while once", "Use when once (interruption)", "End with 1 past simple event"], "model": "Last year, we were driving slowly in the safari jeep. While we were driving, we were looking for elephants. I was taking photos when a lion appeared. After that, we watched the sunset.", "checks": [{"label": "Past continuous (was/were + ing)", "re": "\\b(was|were)\\b\\s+\\w+ing\\b"}, {"label": "While", "re": "\\bWhile\\b"}, {"label": "When", "re": "\\bwhen\\b"}, {"label": "Past simple event (appeared/watched/rang)", "re": "\\b(appeared|watched|rang|came)\\b"}]}, {"id": "w2", "title": "🐿️ Vet clinic moment (yesterday at…)", "subject": "Describe what was happening at the clinic.", "steps": ["Start with Yesterday at…", "Use 2 actions with while", "Add 1 interruption with when", "Add 1 negative (wasn’t/weren’t)"], "model": "Yesterday at 10, I was working at the vet clinic. While the vet was checking the animal, I was cleaning the wound. I was preparing a carrier when the phone rang. At that moment, we weren’t panicking — we were staying calm.", "checks": [{"label": "Yesterday at", "re": "\\bYesterday at\\b"}, {"label": "While", "re": "\\bWhile\\b"}, {"label": "When", "re": "\\bwhen\\b"}, {"label": "Negative (wasn’t/weren’t)", "re": "\\b(wasn['’]t|weren['’]t)\\b"}]}, {"id": "w3", "title": "🧑‍⚖️ Meeting moment (notes)", "subject": "Write what was happening in a meeting.", "steps": ["Use last week + past continuous", "Use while + two actions", "Use when + interruption", "Finish with after that + past simple"], "model": "Last week, I was attending a meeting. While the judge was speaking, I was taking notes. I was listening carefully when a new question came up. After that, I wrote a short report.", "checks": [{"label": "Last week", "re": "\\bLast week\\b"}, {"label": "While", "re": "\\bWhile\\b"}, {"label": "When", "re": "\\bwhen\\b"}, {"label": "After that + past simple", "re": "\\bAfter that\\b.*\\b(wrote|finished|sent)\\b"}]}];

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
      if(!confirm('Reset practice sections?')) return;
      var keep={};
      for(var k in state.solved){
        if(!/^mcq_|^fib|^story_|^bs_|^rp_|^write_|^ms_/.test(k)) keep[k]=true;
      }
      state.solved=keep;
      state.score=Object.keys(state.solved).length;
      save();
      location.reload();
    };
  }

  // ---------- Generic MCQ renderer ----------
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
        if(!state.hints){ fb.className='feedback'; fb.textContent='Hints are OFF.'; return; }
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
        fb.textContent='✅ Correct!';
        $all('.opt',it).forEach(function(b){ b.disabled=true; });
        if((ex.textContent||'').trim()) ex.classList.add('is-on');
        if(!state.solved[id]) markSolved(id,1);
        speak(ans);
      }else{
        opt.classList.add('is-wrong');
        fb.className='feedback bad';
        fb.textContent='❌ Not yet.';
      }
    };
  }

  // ---------- Model stories ----------
  function renderModel(key){
    var s=MODEL_STORIES[key];
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
          '<h3 class="h2" style="font-size:16px;margin:6px 0;">English story</h3>'+
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
        if(!state.solved['ms_'+qid]) markSolved('ms_'+qid,1);
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

  // ---------- Grammar cards ----------
  function renderGrammarTabs(){
    var root=$('#gTabs');
    root.innerHTML = CARDS.map(function(c,i){
      return '<button class="tab '+(i===0?'is-active':'')+'" type="button" data-k="'+esc(c.key)+'">'+esc(c.icon)+' '+esc(c.title)+'</button>';
    }).join('');
    root.onclick=function(e){
      var b=e.target.closest('.tab'); if(!b) return;
      $all('.tab',root).forEach(function(x){ x.classList.remove('is-active'); });
      b.classList.add('is-active');
      renderGrammarCard(b.getAttribute('data-k'));
    };
    renderGrammarCard(CARDS[0].key);
  }

  function renderGrammarCard(key){
    var c=CARDS[0];
    for(var i=0;i<CARDS.length;i++){ if(CARDS[i].key===key){ c=CARDS[i]; break; } }
    var panel=$('#gPanel');
    var ex = c.examples.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('');
    panel.innerHTML =
      '<div class="mini">'+
        '<h2 class="h2">'+esc(c.icon)+' '+esc(c.title)+' <span class="tag">'+esc(c.fr)+'</span></h2>'+
        '<div class="callout small"><strong>Rule:</strong> '+esc(c.rule)+'</div>'+
        '<div class="callout small"><strong>Form:</strong> '+esc(c.form)+'</div>'+
        '<h3 class="h2" style="font-size:16px;margin:10px 0 6px;">Examples</h3>'+
        '<ul class="list">'+ex+'</ul>'+
        '<div class="wBtns"><button class="btn btn--ghost" type="button" id="gListen">🔊 Listen examples</button></div>'+
        '<h3 class="h2" style="font-size:16px;margin:12px 0 6px;">Mini quiz</h3>'+
        '<div class="quiz" id="gQuiz"></div>'+
      '</div>';
    $('#gListen').onclick=function(){ speak(c.examples.join(' ')); };
    renderMCQ('#gQuiz', c.quiz, 'mcq_g_'+c.key);
  }

  function renderLists(){
    $('#timeList').innerHTML = TIME_WORDS.map(function(t){
      return '<li>'+esc(t.icon)+' <strong>'+esc(t.en)+'</strong> — <span class="tag">'+esc(t.fr)+'</span> • <span style="color:rgba(247,248,251,.78)">'+esc(t.ex)+'</span></li>';
    }).join('');
    $('#ingList').innerHTML = ING_RULES.map(function(r){
      return '<li><strong>'+esc(r.rule)+'</strong> — <span class="tag">'+esc(r.ex)+'</span></li>';
    }).join('');
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
      fb.className='feedback';
      fb.textContent='💡 '+h;
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
      }else if(val.length>=Math.max(3, ans.length)){
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
      return '<div class="slot" data-i="'+idx+'" tabindex="0"><div class="slotNum">'+(idx+1)+'</div><div class="slotText">Tap/drag the correct line here…</div></div>';
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
      if(!state.solved['story_'+story.id+'_'+(idx+1)]) markSolved('story_'+story.id+'_'+(idx+1),1);

      var allDone=true;
      $all('.slotText',$('#storySlots')).forEach(function(st){
        if(st.textContent.indexOf('Tap/drag')===0) allDone=false;
      });
      if(allDone){
        fb.textContent='🎉 Story complete! Read it aloud.';
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
  function loadBuilder(id){
    bsKey=id;
    bsPicked=[];
    var s=getBS();
    $('#bsHint').textContent='Hint: '+s.hint;
    $('#bsFb').className='feedback';
    $('#bsFb').textContent='Tap tiles to build the sentence.';
    renderBSBank();
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
        if(!state.solved['bs_'+s.id]) markSolved('bs_'+s.id,2);
        speak(target);
      }else{
        $('#bsFb').className='feedback bad';
        $('#bsFb').textContent='❌ Not correct yet.';
      }
    };
  }

  // ---------- Roleplays ----------
  var rpKey=null;
  var rpIdx=0;
  var showModel=false;

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
      if(t.indexOf(norm(targets[i]))===-1) return false;
    }
    return true;
  }

  function makeVariations(model){
    var v=[];
    v.push(model.replace(/\bI was\b/g,'I was really'));
    v.push(model.replace(/\bAt that moment\b/g,'At that moment'));
    v.push(model.replace(/\bWhile\b/g,'While'));
    // unique
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

  function initRoleplays(){
    var sel=$('#rpSelect');
    var keys=[];
    for(var k in ROLEPLAYS){ if(ROLEPLAYS.hasOwnProperty(k)) keys.push(k); }
    keys.sort();
    sel.innerHTML = keys.map(function(k){ return '<option value="'+esc(k)+'">'+esc(ROLEPLAYS[k].title)+'</option>'; }).join('');
    rpKey=sel.value || keys[0];

    sel.onchange=function(){ rpKey=sel.value; rpIdx=0; showModel=false; clearRP(); };

    $('#rpStart').onclick=function(){ rpIdx=0; showModel=false; renderRP(); };
    $('#rpNext').onclick=function(){
      var steps=ROLEPLAYS[rpKey].steps;
      rpIdx=Math.min(steps.length-1, rpIdx+1);
      showModel=false;
      renderRP();
    };
    $('#rpRestart').onclick=function(){ rpIdx=0; showModel=false; renderRP(); };
    $('#rpModel').onclick=function(){ showModel=!showModel; renderRP(); };
    $('#rpHint').onclick=function(){
      var step=ROLEPLAYS[rpKey].steps[rpIdx];
      $('#rpFb').className='feedback';
      $('#rpFb').textContent='💡 Targets: '+step.targets.join(' • ');
      setHint('Targets: '+step.targets.join(' • '));
    };
    $('#rpListen').onclick=function(){ speak(ROLEPLAYS[rpKey].steps[rpIdx].t); };

    clearRP();
  }

  // ---------- Writing ----------
  var wKey=null;
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
      if(!state.solved['write_'+t.id]) markSolved('write_'+t.id,3);
    }else{
      $('#wFb').className='feedback bad';
      $('#wFb').textContent='❌ Not complete yet. Add the missing items.';
    }
  }
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
      try{ document.execCommand('copy'); setHint('Copied!'); }catch(e){ setHint('Copy failed.'); }
    };
    $('#wHint').onclick=function(){
      var t=getTask();
      $('#wFb').className='feedback';
      $('#wFb').textContent='💡 Steps: '+t.steps.join(' | ');
    };
    $('#wCheck').onclick=checkWriting;
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

  function computeTotal(){
    var q=0;
    q += (MODEL_STORIES.safari.mini.length + MODEL_STORIES.vet.mini.length + MODEL_STORIES.youth.mini.length);
    for(var i=0;i<CARDS.length;i++) q += CARDS[i].quiz.length;
    q += MCQ.length;
    q += FIB.length;
    for(var j=0;j<STORIES.length;j++) q += STORIES[j].target.length;
    q += BUILD_SENTENCES.length*2;
    var rp=0; for(var k in ROLEPLAYS){ if(ROLEPLAYS.hasOwnProperty(k)) rp += ROLEPLAYS[k].steps.length; }
    q += rp;
    q += WRITING_TASKS.length*3;
    return q;
  }

  function init(){
    initTop();
    initModelStories();
    renderGrammarTabs();
    renderLists();

    renderMCQ('#mcqMain', MCQ, 'mcq_main');
    renderFIB();
    initStories();
    initBuilder();
    initRoleplays();
    initWriting();
    renderVocab();

    totalPoints = computeTotal();
    updateHud();
    setHint('Tip: model story → grammar card quizzes → practice.');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
