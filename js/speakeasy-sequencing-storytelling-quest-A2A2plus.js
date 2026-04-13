
(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const norm=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,' ');
  const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

  const CONNECTORS = [{"cat": "Sequencing", "icon": "1️⃣", "en": "First, ...", "fr": "D’abord, ...", "use": "start the story", "ex": "First, we arrived at the camp."}, {"cat": "Sequencing", "icon": "2️⃣", "en": "Then, ...", "fr": "Ensuite, ...", "use": "next step", "ex": "Then, we went on a safari drive."}, {"cat": "Sequencing", "icon": "➡️", "en": "After that, ...", "fr": "Après ça, ...", "use": "next event", "ex": "After that, we saw elephants."}, {"cat": "Sequencing", "icon": "⏳", "en": "Later, ...", "fr": "Plus tard, ...", "use": "later in time", "ex": "Later, we took photos."}, {"cat": "Sequencing", "icon": "⏱️", "en": "Meanwhile, ...", "fr": "Pendant ce temps, ...", "use": "two things at the same time", "ex": "Meanwhile, the guide explained the animals."}, {"cat": "Sequencing", "icon": "🏁", "en": "Finally, ...", "fr": "Enfin, ...", "use": "end of story", "ex": "Finally, we returned to the lodge."}, {"cat": "Time links", "icon": "🕒", "en": "When ...", "fr": "Quand ...", "use": "time clause", "ex": "When we arrived, it was hot."}, {"cat": "Time links", "icon": "⏳", "en": "While ...", "fr": "Pendant que ...", "use": "background action", "ex": "While we were driving, we saw a zebra."}, {"cat": "Time links", "icon": "✅", "en": "As soon as ...", "fr": "Dès que ...", "use": "immediately after", "ex": "As soon as I finished, I called you."}, {"cat": "Cause & effect", "icon": "💡", "en": "Because ...", "fr": "Parce que ...", "use": "give a reason", "ex": "Because it was late, we went home."}, {"cat": "Cause & effect", "icon": "➡️", "en": "So ...", "fr": "Donc ...", "use": "result", "ex": "So we changed the plan."}, {"cat": "Cause & effect", "icon": "🧾", "en": "That’s why ...", "fr": "C’est pourquoi ...", "use": "strong result", "ex": "That’s why I’m practising English."}, {"cat": "Contrast", "icon": "⚖️", "en": "But ...", "fr": "Mais ...", "use": "contrast (simple)", "ex": "It was scary, but exciting."}, {"cat": "Contrast", "icon": "🌧️", "en": "However, ...", "fr": "Cependant, ...", "use": "contrast (formal)", "ex": "However, the weather changed."}, {"cat": "Contrast", "icon": "🧩", "en": "Although ...", "fr": "Bien que ...", "use": "contrast clause", "ex": "Although I was tired, I continued."}, {"cat": "Adding", "icon": "➕", "en": "Also, ...", "fr": "Aussi, ...", "use": "add info", "ex": "Also, I volunteer at a vet clinic."}, {"cat": "Adding", "icon": "📌", "en": "In addition, ...", "fr": "De plus, ...", "use": "add info (formal)", "ex": "In addition, I write reports."}];
  const TENSES = [{"key": "present_simple", "icon": "🟦", "title": "Present simple (routine)", "fr": "Présent simple (habitudes)", "form": "I work / I don’t work / Do you work?", "use": "habits, facts, routines", "keywords": "often, usually, every week", "examples": ["I volunteer at a vet clinic every week.", "I help small animals.", "I write short notes after visits."], "quiz": [{"q": "Routine:", "opts": ["I volunteer at the clinic every week.", "I am volunteer at the clinic every week.", "I volunteering at the clinic every week."], "a": "I volunteer at the clinic every week.", "hint": "present simple = base verb", "why": "Routine → present simple."}, {"q": "Question:", "opts": ["Do you work with young people?", "Are you work with young people?", "Do you works with young people?"], "a": "Do you work with young people?", "hint": "Do + base verb", "why": "Question: Do you + base verb."}]}, {"key": "past_simple", "icon": "🟧", "title": "Past simple (finished past)", "fr": "Prétérit (passé terminé)", "form": "I visited / I didn’t visit / Did you visit?", "use": "finished past events", "keywords": "yesterday, last week, in 2024", "examples": ["Last year, we went on a safari.", "We saw lions and elephants.", "I met new people."], "quiz": [{"q": "Finished time:", "opts": ["We visited Africa last year.", "We have visited Africa last year.", "We visit Africa last year."], "a": "We visited Africa last year.", "hint": "last year → past simple", "why": "Finished time → past simple."}, {"q": "Negative:", "opts": ["We didn’t see a rhino.", "We don’t saw a rhino.", "We didn’t saw a rhino."], "a": "We didn’t see a rhino.", "hint": "didn’t + base verb", "why": "Negative past: didn’t + base verb."}]}, {"key": "past_cont", "icon": "🟪", "title": "Past continuous (background)", "fr": "Passé continu (action en cours)", "form": "I was working / I wasn’t working / Were you working?", "use": "background action, in progress", "keywords": "while, when (background)", "examples": ["While we were driving, we saw a giraffe.", "I was taking photos when the lion appeared."], "quiz": [{"q": "Background:", "opts": ["While we were driving, we saw zebras.", "While we drove, we were seeing zebras.", "While we were drive, we saw zebras."], "a": "While we were driving, we saw zebras.", "hint": "was/were + -ing", "why": "Background action uses past continuous."}, {"q": "Question:", "opts": ["Were you working yesterday afternoon?", "Did you working yesterday afternoon?", "Were you work yesterday afternoon?"], "a": "Were you working yesterday afternoon?", "hint": "Were + subject + -ing", "why": "Past continuous question: Were you + -ing."}]}, {"key": "present_perf", "icon": "🟩", "title": "Present perfect (experience / recent)", "fr": "Present perfect (expérience / récent)", "form": "I have volunteered / I haven’t volunteered / Have you volunteered?", "use": "life experience, recent updates (no finished time)", "keywords": "already, yet, just, ever, never, recently, lately", "examples": ["I’ve met my daughter‑in‑law.", "I’ve already sent a message.", "I haven’t visited Denmark yet."], "quiz": [{"q": "No finished time:", "opts": ["I’ve met her twice.", "I met her twice yesterday.", "I have meet her twice."], "a": "I’ve met her twice.", "hint": "have/has + past participle", "why": "Catching up → present perfect."}, {"q": "Yet (negative):", "opts": ["I haven’t visited Denmark yet.", "I didn’t visited Denmark yet.", "I haven’t visit Denmark yet."], "a": "I haven’t visited Denmark yet.", "hint": "haven’t + past participle", "why": "Yet in negative → present perfect."}]}, {"key": "future_plan", "icon": "🟨", "title": "Future (plan + arrangement)", "fr": "Futur (plan + rendez‑vous)", "form": "going to / will / present continuous", "use": "plans, arrangements, decisions", "keywords": "next week, tomorrow, on Saturday, at 3 pm", "examples": ["I’m going to call you this weekend.", "I’m meeting you on Saturday.", "I’ll send the photos tonight."], "quiz": [{"q": "Plan:", "opts": ["I’m going to call you this weekend.", "I will going to call you this weekend.", "I’m going call you this weekend."], "a": "I’m going to call you this weekend.", "hint": "am/is/are + going to + verb", "why": "Plan → going to."}, {"q": "Arrangement:", "opts": ["I’m meeting you on Saturday.", "I meet you on Saturday (arranged).", "I will meeting you on Saturday."], "a": "I’m meeting you on Saturday.", "hint": "present continuous + time", "why": "Arrangement → present continuous."}]}];
  const VOCAB = [{"cat": "Safari", "icon": "🦁", "en": "lion", "fr": "lion", "def": "a large wild cat", "ex": "We saw a lion near the road."}, {"cat": "Safari", "icon": "🐘", "en": "elephant", "fr": "éléphant", "def": "a very large animal with a trunk", "ex": "Elephants were walking slowly."}, {"cat": "Safari", "icon": "🦒", "en": "giraffe", "fr": "girafe", "def": "a tall animal with a long neck", "ex": "A giraffe was eating leaves."}, {"cat": "Safari", "icon": "🦓", "en": "zebra", "fr": "zèbre", "def": "an animal with black and white stripes", "ex": "Zebras were running together."}, {"cat": "Safari", "icon": "🦛", "en": "hippo", "fr": "hippopotame", "def": "a big animal that lives in water", "ex": "We watched hippos in the river."}, {"cat": "Safari", "icon": "🐊", "en": "crocodile", "fr": "crocodile", "def": "a large reptile", "ex": "A crocodile was resting on the bank."}, {"cat": "Safari", "icon": "🐆", "en": "leopard", "fr": "léopard", "def": "a wild cat with spots", "ex": "We were lucky: we saw a leopard."}, {"cat": "Safari", "icon": "🐃", "en": "buffalo", "fr": "buffle", "def": "a large wild animal", "ex": "Buffalo were near the water."}, {"cat": "Safari", "icon": "🚙", "en": "safari jeep", "fr": "4x4 de safari", "def": "a vehicle used on safari", "ex": "We drove in a safari jeep."}, {"cat": "Safari", "icon": "🧭", "en": "guide", "fr": "guide", "def": "a person who leads and explains", "ex": "Our guide explained the rules."}, {"cat": "Safari", "icon": "🌅", "en": "sunset", "fr": "coucher de soleil", "def": "the sun going down", "ex": "The sunset was beautiful."}, {"cat": "Safari", "icon": "🏕️", "en": "lodge / camp", "fr": "lodge / camp", "def": "a place to stay on safari", "ex": "We stayed in a lodge."}, {"cat": "Animal rescue", "icon": "🐿️", "en": "squirrel", "fr": "écureuil", "def": "a small wild animal with a bushy tail", "ex": "We treated a squirrel."}, {"cat": "Animal rescue", "icon": "🦔", "en": "hedgehog", "fr": "hérisson", "def": "a small animal with spines", "ex": "We helped an injured hedgehog."}, {"cat": "Animal rescue", "icon": "🐦", "en": "injured bird", "fr": "oiseau blessé", "def": "a bird that is hurt", "ex": "An injured bird arrived at the clinic."}, {"cat": "Animal rescue", "icon": "🧤", "en": "gloves", "fr": "gants", "def": "hand protection", "ex": "I wear gloves for safety."}, {"cat": "Animal rescue", "icon": "🩺", "en": "vet clinic", "fr": "cabinet vétérinaire", "def": "a place where a vet treats animals", "ex": "I volunteer at a vet clinic."}, {"cat": "Animal rescue", "icon": "🩹", "en": "bandage", "fr": "bandage", "def": "a covering for a wound", "ex": "We put a bandage on the paw."}, {"cat": "Animal rescue", "icon": "🧼", "en": "to clean a wound", "fr": "nettoyer une plaie", "def": "to clean an injury", "ex": "We cleaned the wound carefully."}, {"cat": "Animal rescue", "icon": "🥣", "en": "to feed", "fr": "nourrir", "def": "to give food", "ex": "We fed the animal slowly."}, {"cat": "Animal rescue", "icon": "🧺", "en": "carrier", "fr": "cage de transport", "def": "a box to transport an animal", "ex": "Put the animal in a carrier."}, {"cat": "Animal rescue", "icon": "🕊️", "en": "to release", "fr": "relâcher", "def": "to let an animal go back to nature", "ex": "We released it after recovery."}, {"cat": "Youth support", "icon": "🧑‍⚖️", "en": "judge", "fr": "juge", "def": "a person who decides in court", "ex": "The judge asked questions."}, {"cat": "Youth support", "icon": "🏛️", "en": "court hearing", "fr": "audience", "def": "a meeting in court", "ex": "I attended a court hearing."}, {"cat": "Youth support", "icon": "📋", "en": "case file", "fr": "dossier", "def": "documents about one situation", "ex": "I read the case file."}, {"cat": "Youth support", "icon": "📝", "en": "assessment", "fr": "évaluation", "def": "a careful evaluation", "ex": "I wrote an assessment report."}, {"cat": "Youth support", "icon": "🧾", "en": "report", "fr": "rapport", "def": "a written document", "ex": "I sent the report to the team."}, {"cat": "Youth support", "icon": "📅", "en": "follow‑up", "fr": "suivi", "def": "a later check meeting", "ex": "We planned a follow-up."}, {"cat": "Youth support", "icon": "🤝", "en": "support plan", "fr": "plan d’accompagnement", "def": "a plan to help progress", "ex": "We created a support plan."}, {"cat": "Youth support", "icon": "💬", "en": "to encourage", "fr": "encourager", "def": "to give support and confidence", "ex": "I encouraged the young person."}, {"cat": "Youth support", "icon": "🌱", "en": "progress", "fr": "progrès", "def": "improvement over time", "ex": "We focus on progress."}, {"cat": "Youth support", "icon": "🛡️", "en": "to protect", "fr": "protéger", "def": "to keep safe", "ex": "The goal is to protect the child."}];
  const MCQ_PRACTICE = [{"q": "____, we arrived at the lodge. Then, we unpacked our bags.", "opts": ["First", "Because", "However"], "a": "First", "hint": "Use a sequencing connector to start.", "why": "✅ Correct: First fits the meaning."}, {"q": "We were tired, ____ we went to bed early.", "opts": ["so", "although", "meanwhile"], "a": "so", "hint": "Result connector: so.", "why": "✅ Correct: so fits the meaning."}, {"q": "____ we were driving, we saw zebras.", "opts": ["While", "Finally", "So"], "a": "While", "hint": "Background time link: while.", "why": "✅ Correct: While fits the meaning."}, {"q": "I volunteer at a vet clinic. ____, I work with young people as an assessor.", "opts": ["Also", "Yesterday", "Yet"], "a": "Also", "hint": "Add info: also.", "why": "✅ Correct: Also fits the meaning."}, {"q": "It was scary, ____ exciting.", "opts": ["but", "because", "after"], "a": "but", "hint": "Contrast: but.", "why": "✅ Correct: but fits the meaning."}, {"q": "Choose the best tense:", "opts": ["Last year, we went on a safari.", "Last year, we have gone on a safari.", "Last year, we go on a safari."], "a": "Last year, we went on a safari.", "hint": "Finished time → past simple.", "why": "Form + meaning → correct choice."}, {"q": "Choose the best tense:", "opts": ["While we were driving, we saw a lion.", "While we drove, we were seeing a lion.", "While we were drive, we saw a lion."], "a": "While we were driving, we saw a lion.", "hint": "Background action → past continuous.", "why": "Form + meaning → correct choice."}, {"q": "Choose the best tense:", "opts": ["I’ve volunteered at a vet clinic.", "I volunteered at a vet clinic yesterday (no time).", "I have volunteer at a vet clinic."], "a": "I’ve volunteered at a vet clinic.", "hint": "Catching up → present perfect.", "why": "Form + meaning → correct choice."}, {"q": "Choose the best tense:", "opts": ["I’m going to call you this weekend.", "I will going to call you this weekend.", "I’m going call you this weekend."], "a": "I’m going to call you this weekend.", "hint": "Plan → going to.", "why": "Form + meaning → correct choice."}];
  const FIB = [{"id": "fib1", "sent": "First, we ____ (arrive) at the lodge.", "a": "arrived", "hint": "Past simple: arrive → arrived"}, {"id": "fib2", "sent": "While we ____ (drive), we saw a lion.", "a": "were driving", "hint": "Past continuous: were + -ing"}, {"id": "fib3", "sent": "I’ve ____ (meet) my daughter‑in‑law.", "a": "met", "hint": "meet → met (past participle)"}, {"id": "fib4", "sent": "I haven’t visited Denmark ____ .", "a": "yet", "hint": "yet = in negatives/questions"}, {"id": "fib5", "sent": "I volunteer at a vet clinic. ____, I support young people.", "a": "Also", "hint": "Add info connector: Also"}, {"id": "fib6", "sent": "It was late, ____ we went home.", "a": "so", "hint": "Result connector: so"}];
  const STORIES = [{"id": "story1", "title": "Safari day (Africa)", "target": ["First, we arrived at the lodge.", "Then, we got into the safari jeep.", "While we were driving, we saw zebras.", "After that, we saw elephants near the river.", "Finally, we watched the sunset and returned."], "hint": "Start → then → background (while) → after that → finally"}, {"id": "story2", "title": "Vet clinic shift (small animals)", "target": ["First, an injured bird arrived at the clinic.", "Then, I put on gloves and prepared a carrier.", "While the vet was checking the animal, I cleaned the wound.", "After that, we fed it slowly.", "Finally, we planned a follow-up and release."], "hint": "Use sequencing + one while sentence."}, {"id": "story3", "title": "Youth assessor follow-up", "target": ["First, I read the case file.", "Then, I met the young person and listened carefully.", "Meanwhile, the team discussed the support plan.", "After that, I wrote a short report.", "Finally, we scheduled a follow-up meeting."], "hint": "Include meanwhile for parallel actions."}];
  const ROLEPLAYS = {"catchup": {"title": "📞 Catching up with your daughter‑in‑law (Denmark)", "teacherRole": "Teacher (blue)", "learnerRole": "You (green)", "steps": [{"t": "Hi! It’s nice to hear your voice. How have you been?", "targets": ["I’ve been", "lately", "busy"], "model": "Hi! I’ve been busy lately, but I’m good. How have you been?"}, {"t": "What’s new in your life these days?", "targets": ["present perfect", "also", "because"], "model": "I’ve been volunteering at a vet clinic, and I’ve also supported young people as an assessor. I’m doing it because I want to help."}, {"t": "Have you visited Denmark yet?", "targets": ["yet", "not yet", "going to"], "model": "Not yet, but I’m going to visit soon. I’ve already looked at flights."}, {"t": "Tell me about your trip to Africa. What happened first?", "targets": ["First", "Then", "Finally"], "model": "First, we arrived at the lodge. Then, we went on a safari drive. Finally, we watched the sunset."}, {"t": "That sounds amazing! Can you ask me two questions?", "targets": ["Have you", "Have you"], "model": "Have you ever been to Africa? Have you visited Denmark before?"}, {"t": "Great. Let’s plan our next call. When will you call again?", "targets": ["on", "at", "will"], "model": "I’ll call again on Saturday at 3 pm. Is that OK for you?"}], "phrases": ["How have you been lately?", "That’s great to hear.", "First… Then… After that… Finally…", "Have you ever…? / Have you… yet?", "Let’s keep in touch."]}, "vet": {"title": "🐾 At the vet clinic — small animal rescue", "teacherRole": "Teacher (blue)", "learnerRole": "You (green)", "steps": [{"t": "Hello. What happened to the animal?", "targets": ["past simple", "because"], "model": "It fell from a tree, so it got injured. We brought it here because it needed help."}, {"t": "What do you do first when an animal arrives?", "targets": ["First", "present simple"], "model": "First, I put on gloves and prepare a carrier. Then, I call the vet."}, {"t": "What were you doing when the vet arrived?", "targets": ["was/were", "-ing", "while"], "model": "I was cleaning the wound while the vet was checking the animal."}, {"t": "Have you treated squirrels or hedgehogs before?", "targets": ["Have you", "present perfect", "ever"], "model": "Yes, I have. I’ve treated squirrels and I’ve helped an injured hedgehog."}, {"t": "How do you feel after a rescue?", "targets": ["but", "rewarding"], "model": "It can be stressful, but it’s very rewarding."}], "phrases": ["Let me explain step by step.", "First… Then… After that…", "We cleaned the wound and put a bandage on.", "It’s challenging, but rewarding."]}, "youth": {"title": "🧑‍⚖️ Youth support — assessor follow‑up", "teacherRole": "Teacher (blue)", "learnerRole": "You (green)", "steps": [{"t": "Can you explain your role in simple words?", "targets": ["present simple", "I help", "support plan"], "model": "I help young people by doing assessments and follow-ups. I work with a support plan to encourage progress."}, {"t": "What did you do before the court hearing?", "targets": ["past simple", "case file"], "model": "First, I read the case file. Then, I prepared questions for the meeting."}, {"t": "What were you doing during the meeting?", "targets": ["past continuous", "listening"], "model": "I was listening carefully and taking notes while the young person was speaking."}, {"t": "Have you written a report yet?", "targets": ["yet", "present perfect", "report"], "model": "Yes, I have. I’ve already written a short report, but I haven’t sent it yet."}, {"t": "Finish with a positive message about progress.", "targets": ["That’s why", "progress"], "model": "Progress takes time, and that’s why we do follow-ups and encouragement."}], "phrases": ["I do an assessment and write a report.", "We focus on safety and progress.", "We schedule a follow-up meeting."]}};
  const WRITING_TASKS = [{"id": "w1", "title": "💌 Message to your daughter‑in‑law (catching up)", "subject": "Say hello, share updates, and ask questions.", "steps": ["Greeting + How have you been?", "2 updates (present perfect): volunteering + assessor role", "1 keyword: already / yet / just / ever / never", "2 sequencing connectors: First / Then / Finally", "2 questions: Have you…?", "Friendly closing + plan (future)"], "model": "Hi! How have you been lately? I’ve been busy, but I’m good. I’ve volunteered at a vet clinic and I’ve also supported young people as an assessor. I’ve already written a short report this week, and I haven’t visited Denmark yet. First, I want to hear your news. Then, I can tell you about my last week. Finally, we can plan our next call. Have you been busy lately? Have you enjoyed Denmark? Take care! I’m going to call you this weekend.", "checks": [{"label": "Present perfect (I’ve / have / has)", "re": "\\bI['’]ve\\b|\\bhave\\b|\\bhas\\b"}, {"label": "1 keyword (already/yet/just/ever/never)", "re": "\\b(already|yet|just|ever|never)\\b"}, {"label": "2 sequencing connectors (first/then/after/finally)", "re": "\\b(first|then|after that|finally)\\b"}, {"label": "2 questions (Have you…?)", "re": "\\bHave you\\b"}, {"label": "1 future (going to / will / meeting)", "re": "\\bgoing to\\b|\\bI['’]ll\\b|\\bI will\\b|\\bI['’]m meeting\\b"}]}, {"id": "w2", "title": "🦁 Short story: one safari day (Africa)", "subject": "Tell a short story with sequencing + past tenses.", "steps": ["Start with First / Then / After that / Finally", "Use 2 past simple sentences (went/saw/visited)", "Use 1 past continuous (was/were + -ing) with while/when", "Add 1 feeling (exciting / scary / amazing) + but/however"], "model": "First, we arrived at the lodge in the afternoon. Then, we got into the safari jeep and drove into the park. While we were driving, we saw zebras and a giraffe near the road. After that, we watched elephants by the river. Finally, we returned to the camp at sunset. It was scary sometimes, but it was amazing.", "checks": [{"label": "Sequencing (first/then/after/finally)", "re": "\\b(first|then|after that|finally)\\b"}, {"label": "Past continuous (was/were + ing)", "re": "\\bwas\\b\\s+\\w+ing\\b|\\bwere\\b\\s+\\w+ing\\b"}, {"label": "Past simple (went/saw/visited/arrived/returned)", "re": "\\b(went|saw|visited|met|arrived|returned|drove|watched)\\b"}, {"label": "Contrast (but/however)", "re": "\\b(but|however)\\b"}]}, {"id": "w3", "title": "🐿️ Explain your vet clinic volunteering (step by step)", "subject": "Describe what you do with small animals.", "steps": ["Use present simple for routine (I volunteer / I help)", "Add sequencing: First / Then / After that / Finally", "Include 5 animal rescue words (gloves, carrier, wound, bandage, feed, release)", "Finish with a feeling (rewarding / challenging)"], "model": "I volunteer at a vet clinic and I help small animals. First, I put on gloves and prepare a carrier. Then, I listen to the vet and take notes. After that, I clean the wound and we put a bandage on. Finally, we feed the animal and plan a follow-up before we release it. It’s challenging sometimes, but it’s very rewarding.", "checks": [{"label": "Routine present (I volunteer / I help)", "re": "\\bI volunteer\\b|\\bI help\\b"}, {"label": "Sequencing connectors", "re": "\\b(first|then|after that|finally)\\b"}, {"label": "Rescue words (gloves/carrier/wound/bandage/feed/release)", "re": "\\b(gloves|carrier|wound|bandage|feed|release)\\b"}, {"label": "Feeling (rewarding/challenging)", "re": "\\b(rewarding|challenging)\\b"}]}, {"id": "w4", "title": "🧑‍⚖️ Describe your youth support role (assessment + follow-up)", "subject": "Explain your role and a typical sequence.", "steps": ["Use present simple for role (I do assessments / I write reports)", "Add 2 connectors (because/so/however)", "Add 4 youth support words (case file, report, follow-up, support plan, court hearing)", "End with progress encouragement (That’s why…)"], "model": "I support young people by doing assessments and follow-ups. First, I read the case file because I need to understand the situation. Then, I meet the young person and listen carefully. After that, I write a report and we prepare a support plan, so the child can make progress. Sometimes it is difficult. However, progress is possible, and that’s why we do follow-ups.", "checks": [{"label": "Role present (I support/I do/I write)", "re": "\\bI support\\b|\\bI do\\b|\\bI write\\b"}, {"label": "Connectors (because/so/however/that’s why)", "re": "\\b(because|so|however|that’s why)\\b"}, {"label": "Youth words (case file/report/follow-up/support plan/court)", "re": "\\b(case file|report|follow\\-up|support plan|court)\\b"}, {"label": "Encouragement (progress/that’s why)", "re": "\\b(progress|that’s why)\\b"}]}];
  const VOCAB_QUIZ = [{"q": "🧼 to clean a wound = ? (FR)", "opts": ["protéger", "évaluation", "nettoyer une plaie"], "a": "nettoyer une plaie", "hint": "Example: We cleaned the wound carefully.", "why": "✅ to clean a wound = nettoyer une plaie"}, {"q": "🦔 hedgehog = ? (FR)", "opts": ["juge", "zèbre", "hérisson"], "a": "hérisson", "hint": "Example: We helped an injured hedgehog.", "why": "✅ hedgehog = hérisson"}, {"q": "🧤 gloves = ? (FR)", "opts": ["oiseau blessé", "gants", "juge"], "a": "gants", "hint": "Example: I wear gloves for safety.", "why": "✅ gloves = gants"}, {"q": "🐊 crocodile = ? (FR)", "opts": ["crocodile", "bandage", "encourager"], "a": "crocodile", "hint": "Example: A crocodile was resting on the bank.", "why": "✅ crocodile = crocodile"}, {"q": "📝 assessment = ? (FR)", "opts": ["hérisson", "hippopotame", "évaluation"], "a": "évaluation", "hint": "Example: I wrote an assessment report.", "why": "✅ assessment = évaluation"}, {"q": "🐦 injured bird = ? (FR)", "opts": ["oiseau blessé", "buffle", "nourrir"], "a": "oiseau blessé", "hint": "Example: An injured bird arrived at the clinic.", "why": "✅ injured bird = oiseau blessé"}, {"q": "🧺 carrier = ? (FR)", "opts": ["zèbre", "cabinet vétérinaire", "cage de transport"], "a": "cage de transport", "hint": "Example: Put the animal in a carrier.", "why": "✅ carrier = cage de transport"}, {"q": "🦓 zebra = ? (FR)", "opts": ["audience", "zèbre", "4x4 de safari"], "a": "zèbre", "hint": "Example: Zebras were running together.", "why": "✅ zebra = zèbre"}, {"q": "🥣 to feed = ? (FR)", "opts": ["nourrir", "4x4 de safari", "cabinet vétérinaire"], "a": "nourrir", "hint": "Example: We fed the animal slowly.", "why": "✅ to feed = nourrir"}, {"q": "🌱 progress = ? (FR)", "opts": ["progrès", "gants", "suivi"], "a": "progrès", "hint": "Example: We focus on progress.", "why": "✅ progress = progrès"}];

  const STORE = 'SET_sequencing_storytelling_A2_v1';
  let state = load() || {score:0, solved:{}, voice:'US', autoAudio:true, speed:'normal'};
  let totalPoints = 0;

  function load(){ try{ return JSON.parse(localStorage.getItem(STORE)||''); }catch(e){ return null; } }
  function save(){ localStorage.setItem(STORE, JSON.stringify(state)); }

  function setHint(t){ $('#hintBox').textContent = t; }
  function markSolved(id, pts=1){
    if(state.solved[id]) return false;
    state.solved[id]=true;
    state.score += pts;
    save(); updateHUD();
    return true;
  }
  function resetAll(){
    if(!confirm('Reset everything for this lesson?')) return;
    localStorage.removeItem(STORE);
    location.reload();
  }

  function updateHUD(){
    $('#scoreNow').textContent = String(state.score);
    $('#scoreTotal').textContent = String(totalPoints);
    const pct = totalPoints ? Math.round((state.score/totalPoints)*100) : 0;
    $('#pPct').textContent = pct+'%';
    $('#pBar').style.width = clamp(pct,0,100)+'%';
  }

  // Speech
  let voiceCache=[];
  function refreshVoices(){ voiceCache = ('speechSynthesis' in window) ? speechSynthesis.getVoices() : []; }
  if('speechSynthesis' in window){ refreshVoices(); speechSynthesis.onvoiceschanged = refreshVoices; }
  function pickVoice(){
    const want = state.voice==='UK' ? ['en-GB','en_GB'] : ['en-US','en_US'];
    return voiceCache.find(v=>want.includes(v.lang)) || voiceCache.find(v=>(v.lang||'').toLowerCase().startsWith('en')) || null;
  }
  function speak(text){
    if(!('speechSynthesis' in window)) return;
    try{
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice();
      if(v) u.voice = v;
      u.rate = (state.speed==='slow') ? 0.78 : 0.95;
      speechSynthesis.speak(u);
    }catch(e){}
  }
  function stopSpeak(){ if('speechSynthesis' in window) speechSynthesis.cancel(); }

  // Top controls
  function initTop(){
    const set=(id,on)=>$(id).classList.toggle('is-active',!!on);
    set('#voiceUS', state.voice==='US'); set('#voiceUK', state.voice==='UK');
    set('#autoOn', !!state.autoAudio); set('#autoOff', !state.autoAudio);
    set('#speedN', state.speed==='normal'); set('#speedS', state.speed==='slow');

    $('#voiceUS').onclick=()=>{state.voice='US';save();initTop();setHint('Voice: US');};
    $('#voiceUK').onclick=()=>{state.voice='UK';save();initTop();setHint('Voice: UK');};
    $('#autoOn').onclick=()=>{state.autoAudio=true;save();initTop();setHint('Auto audio ON');};
    $('#autoOff').onclick=()=>{state.autoAudio=false;save();initTop();setHint('Auto audio OFF');};
    $('#speedN').onclick=()=>{state.speed='normal';save();initTop();};
    $('#speedS').onclick=()=>{state.speed='slow';save();initTop();};
    $('#stopAudio').onclick=stopSpeak;
    $('#resetAll').onclick=resetAll;
  }

  // Flash cards helpers
  function buildTabs(rootSel, items, key='cat'){
    const root=$(rootSel);
    const cats=['All', ...Array.from(new Set(items.map(x=>x[key])))];
    root.innerHTML = cats.map((c,i)=>`<button class="tab ${i===0?'is-active':''}" type="button" data-cat="${c}">${c}</button>`).join('');
  }
  function buildGrid(rootSel, items, filterFn){
    const root=$(rootSel);
    const list = items.filter(filterFn);
    root.innerHTML = list.map((x)=>`
      <button class="flash" type="button" data-say="${(x.en||'').replace(/"/g,'&quot;')}">
        <div class="flash__top">
          <div class="flash__icon" aria-hidden="true">${x.icon||'✨'}</div>
          <div class="flash__term">${x.en||''}</div>
        </div>
        <div class="flash__meta"><span class="tag">${x.cat||''}</span> • click to reveal</div>
        <div class="flash__def">
          <div><strong>FR:</strong> ${x.fr||''}</div>
          <div><strong>Use:</strong> ${x.use||x.def||''}</div>
          <div style="margin-top:6px;"><strong>Example:</strong> ${x.ex||''}</div>
        </div>
      </button>
    `).join('');
  }
  function attachFlip(rootSel){
    $(rootSel).addEventListener('click',(e)=>{
      const card=e.target.closest('.flash'); if(!card) return;
      card.classList.toggle('is-flipped');
      const say=card.dataset.say||'';
      if(say) speak(say);
    });
  }

  // MCQ
  function renderMCQ(rootSel, bank, prefix){
    const root=$(rootSel);
    root.innerHTML = bank.map((q,i)=>{
      const id=`${prefix}_${i+1}`;
      const opts=shuffle(q.opts);
      return `
        <div class="qItem" data-id="${id}" data-a="${q.a.replace(/"/g,'&quot;')}">
          <div class="qQ">${q.q}</div>
          <div class="opts">${opts.map(o=>`<button class="opt" type="button" data-c="${o.replace(/"/g,'&quot;')}">${o}</button>`).join('')}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
            <button class="btn btn--ghost hintBtn" type="button" data-h="${(q.hint||'').replace(/"/g,'&quot;')}">Hint</button>
            <button class="btn btn--ghost whyBtn" type="button">Why?</button>
          </div>
          <div class="feedback" data-fb></div>
          <div class="explain" data-ex>${q.why||''}</div>
        </div>
      `;
    }).join('');

    $$('.qItem',root).forEach(it=>{
      if(state.solved[it.dataset.id]){
        it.querySelectorAll('.opt').forEach(b=>b.disabled=true);
        const fb=it.querySelector('[data-fb]'); fb.textContent='✅ Already solved'; fb.classList.add('good');
      }
    });

    root.onclick=(e)=>{
      const it=e.target.closest('.qItem'); if(!it) return;
      const id=it.dataset.id;
      const fb=it.querySelector('[data-fb]');
      const ex=it.querySelector('[data-ex]');
      const opt=e.target.closest('.opt');
      const hint=e.target.closest('.hintBtn');
      const why=e.target.closest('.whyBtn');

      if(why){ ex.classList.toggle('is-on'); return; }
      if(hint){ fb.classList.remove('good','bad'); fb.textContent='💡 '+(hint.dataset.h||''); setHint(hint.dataset.h||''); return; }
      if(!opt) return;

      const ans=it.dataset.a;
      const choice=opt.dataset.c;
      if(choice===ans){
        opt.classList.add('is-right');
        fb.classList.remove('bad'); fb.classList.add('good');
        fb.textContent = state.solved[id] ? '✅ Correct (practice mode)' : '✅ Correct!';
        it.querySelectorAll('.opt').forEach(b=>b.disabled=true);
        if(ex.textContent.trim()) ex.classList.add('is-on');
        if(!state.solved[id]) markSolved(id,1);
        speak(ans);
      }else{
        opt.classList.add('is-wrong');
        fb.classList.remove('good'); fb.classList.add('bad');
        fb.textContent='❌ Not yet. Try again.';
      }
    };
  }

  // FIB
  function renderFIB(){
    const root=$('#fibBox');
    root.innerHTML = FIB.map(item=>`
      <div class="qItem" data-id="${item.id}">
        <div class="qQ">${item.sent.replace('____', `<span class="blank"><input data-a="${item.a}" placeholder="..." autocomplete="off"></span>`)}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
          <button class="btn btn--ghost hintBtn" type="button" data-h="${item.hint}">Hint</button>
          <div class="feedback" data-fb></div>
        </div>
      </div>
    `).join('');

    $$('.qItem',root).forEach(row=>{
      if(state.solved[row.dataset.id]){
        const inp=row.querySelector('input');
        const fb=row.querySelector('[data-fb]');
        inp.value=inp.dataset.a; inp.disabled=true;
        fb.textContent='✅ Correct'; fb.classList.add('good');
      }
    });

    root.addEventListener('click',(e)=>{
      const row=e.target.closest('.qItem'); if(!row) return;
      const hint=e.target.closest('.hintBtn'); if(!hint) return;
      const fb=row.querySelector('[data-fb]');
      fb.classList.remove('good','bad'); fb.textContent='💡 '+(hint.dataset.h||'');
      setHint(hint.dataset.h||'');
    });

    root.addEventListener('input',(e)=>{
      const inp=e.target.closest('input'); if(!inp) return;
      const row=e.target.closest('.qItem');
      const fb=row.querySelector('[data-fb]');
      const id=row.dataset.id;
      const ans=norm(inp.dataset.a);
      const val=norm(inp.value);
      if(val===ans){
        inp.disabled=true;
        fb.classList.remove('bad'); fb.classList.add('good');
        fb.textContent='✅ Correct!';
        if(!state.solved[id]) markSolved(id,1);
        speak(inp.dataset.a);
      }else if(val.length>=Math.max(3,ans.length)){
        fb.classList.remove('good'); fb.classList.add('bad');
        fb.textContent='❌ Not yet.';
      }else{
        fb.textContent=''; fb.classList.remove('good','bad');
      }
    });
  }

  // Story builder
  let selectedToken=null;
  let storyState=null;

  function renderStorySelect(){
    const sel=$('#storySelect');
    sel.innerHTML = STORIES.map(s=>`<option value="${s.id}">${s.title}</option>`).join('');
    sel.onchange=()=>loadStory(sel.value);
    $('#storyReset').onclick=()=>loadStory(sel.value);
    loadStory(sel.value || STORIES[0].id);
  }

  function loadStory(id){
    const s=STORIES.find(x=>x.id===id) || STORIES[0];
    storyState={id:s.id, target:s.target.slice(), placed:Array(s.target.length).fill(null)};
    $('#storyHint').textContent='Tip: '+s.hint;
    $('#storyFb').className='feedback';
    $('#storyFb').textContent='Tap a token → tap a slot (or drag).';
    selectedToken=null;
    renderStoryUI();
  }

  function renderStoryUI(){
    const bank=$('#storyBank');
    const slots=$('#storySlots');
    const target=storyState.target;
    const tokens=shuffle(target);

    bank.innerHTML = tokens.map(t=>`<button class="token" type="button" draggable="true" data-text="${t.replace(/"/g,'&quot;')}">${t}</button>`).join('');
    slots.innerHTML = target.map((_,i)=>`
      <div class="slot" data-i="${i}" tabindex="0">
        <div class="slotNum">${i+1}</div>
        <div class="slotText">Tap/drag the correct sentence here…</div>
      </div>
    `).join('');

    bank.onclick=(e)=>{
      const tok=e.target.closest('.token'); if(!tok) return;
      if(tok.classList.contains('is-locked')) return;
      if(selectedToken && selectedToken!==tok) selectedToken.classList.remove('is-selected');
      tok.classList.toggle('is-selected');
      selectedToken = tok.classList.contains('is-selected') ? tok : null;
    };

    bank.addEventListener('dragstart',(e)=>{
      const tok=e.target.closest('.token'); if(!tok) return;
      e.dataTransfer.setData('text/plain', tok.dataset.text);
      e.dataTransfer.effectAllowed='move';
    });

    $$('#storySlots .slot').forEach(slot=>{
      slot.addEventListener('dragover',(e)=>{e.preventDefault(); slot.classList.add('is-hot');});
      slot.addEventListener('dragleave',()=>slot.classList.remove('is-hot'));
      slot.addEventListener('drop',(e)=>{
        e.preventDefault(); slot.classList.remove('is-hot');
        placeStory(e.dataTransfer.getData('text/plain'), Number(slot.dataset.i), slot);
      });
      slot.addEventListener('click',()=>{
        if(!selectedToken) return;
        placeStory(selectedToken.dataset.text, Number(slot.dataset.i), slot);
      });
      slot.addEventListener('keydown',(ev)=>{
        if((ev.key==='Enter'||ev.key===' ') && selectedToken){
          ev.preventDefault();
          placeStory(selectedToken.dataset.text, Number(slot.dataset.i), slot);
        }
      });
    });
  }

  function placeStory(text, idx, slotEl){
    const expected = storyState.target[idx];
    const fb=$('#storyFb');
    if(text===expected){
      storyState.placed[idx]=text;
      slotEl.querySelector('.slotText').textContent=text;
      slotEl.classList.add('is-hot');
      setTimeout(()=>slotEl.classList.remove('is-hot'),200);

      const tok=$(`#storyBank .token[data-text="${CSS.escape(text)}"]`);
      if(tok){ tok.classList.remove('is-selected'); tok.classList.add('is-locked'); tok.setAttribute('draggable','false'); selectedToken=null; }

      fb.classList.remove('bad'); fb.classList.add('good');
      fb.textContent='✅ Correct placement!';
      speak(text);
      markSolved(`story_${storyState.id}_${idx+1}`,1);

      if(storyState.placed.every(Boolean)){
        fb.textContent='🎉 Story complete!';
        speak(storyState.placed.join(' '));
      }
    }else{
      slotEl.classList.add('is-bad');
      setTimeout(()=>slotEl.classList.remove('is-bad'),300);
      fb.classList.remove('good'); fb.classList.add('bad');
      fb.textContent='❌ Not correct for this slot.';
    }
  }

  // Tenses
  function initTenses(){
    const tabs=$('#tenseTabs');
    tabs.innerHTML = TENSES.map((t,i)=>`<button class="tab ${i===0?'is-active':''}" type="button" data-k="${t.key}">${t.icon} ${t.title}</button>`).join('');
    tabs.onclick=(e)=>{
      const b=e.target.closest('.tab'); if(!b) return;
      $$('#tenseTabs .tab').forEach(x=>x.classList.remove('is-active'));
      b.classList.add('is-active');
      renderTense(b.dataset.k);
    };
    renderTense(TENSES[0].key);
  }

  function renderTense(key){
    const t=TENSES.find(x=>x.key===key) || TENSES[0];
    $('#tensePanel').innerHTML = `
      <div class="mini">
        <h2 class="h2">${t.icon} ${t.title} <span class="tag">${t.fr}</span></h2>
        <div class="callout small">
          <div><strong>Form:</strong> ${t.form}</div>
          <div><strong>Use:</strong> ${t.use}</div>
          <div><strong>Keywords:</strong> ${t.keywords}</div>
        </div>
        <div class="grid2" style="margin-top:12px;">
          <div class="mini">
            <h3 class="h2" style="font-size:16px;margin:6px 0;">Examples</h3>
            <ul class="list">${t.examples.map(x=>`<li>${x}</li>`).join('')}</ul>
            <button class="btn btn--ghost" id="listenExamples" type="button">🔊 Listen examples</button>
          </div>
          <div class="mini">
            <h3 class="h2" style="font-size:16px;margin:6px 0;">Mini quiz</h3>
            <div class="quiz" id="tenseQuiz"></div>
          </div>
        </div>
      </div>
    `;
    $('#listenExamples').onclick=()=>speak(t.examples.join(' '));
    renderMCQ('#tenseQuiz', t.quiz, `tense_${t.key}`);
  }

  // Roleplays
  let rpKey=null, rpIdx=0, showModel=false, showPhrases=false;
  let prepTimer=null, speakTimer=null;

  function initRoleplays(){
    const sel=$('#rpSelect');
    const keys=Object.keys(ROLEPLAYS);
    sel.innerHTML = keys.map(k=>`<option value="${k}">${ROLEPLAYS[k].title}</option>`).join('');
    rpKey=sel.value||keys[0];
    sel.onchange=()=>{rpKey=sel.value; clearRoleplay();};

    $('#rpStart').onclick=()=>{rpIdx=0; showModel=false; showPhrases=false; renderRoleplay();};
    $('#rpNext').onclick=()=>{const steps=ROLEPLAYS[rpKey].steps; rpIdx=Math.min(steps.length-1,rpIdx+1); showModel=false; renderRoleplay();};
    $('#rpClear').onclick=clearRoleplay;
    $('#rpModel').onclick=()=>{showModel=!showModel; renderRoleplay();};
    $('#rpPhrases').onclick=()=>{showPhrases=!showPhrases; renderRoleplay();};
    $('#rpListenLine').onclick=()=>{const step=getStep(); if(step) speak(step.t);};
    $('#rpHint').onclick=()=>{const step=getStep(); if(!step) return; $('#rpFb').className='feedback'; $('#rpFb').textContent='💡 Targets: '+step.targets.join(' • '); setHint('Targets: '+step.targets.join(' • '));};
    $('#rpFreeListen').onclick=()=>{const txt=$('#rpFree').value.trim(); if(!txt){setHint('Type something first.'); return;} speak(txt);};
    $('#rpFreeClear').onclick=()=>{$('#rpFree').value='';};

    $('#prepBtn').onclick=()=>startTimer('prep',15,'prepTime');
    $('#speakBtn').onclick=()=>startTimer('speak',30,'speakTime');

    clearRoleplay();
  }

  function startTimer(kind, seconds, id){
    const el=$('#'+id);
    let rem=seconds; el.textContent=String(rem);
    if(kind==='prep' && prepTimer) clearInterval(prepTimer);
    if(kind==='speak' && speakTimer) clearInterval(speakTimer);
    const timer=setInterval(()=>{
      rem-=1; el.textContent=String(Math.max(0,rem));
      if(rem<=0){ clearInterval(timer); speak(kind==='prep'?'Go!':'Time.'); }
    },1000);
    if(kind==='prep') prepTimer=timer; else speakTimer=timer;
  }

  function clearRoleplay(){
    $('#rpTeacher').textContent='Choose a scenario and click Start.';
    $('#rpChoices').innerHTML='';
    $('#rpFb').textContent='';
    $('#rpExplain').textContent='';
    $('#rpCount').textContent='0 / 0';
    $('#rpMode').textContent='Ready';
    $('#rpPhrasesBox').style.display='none';
    $('#rpFree').value='';
  }

  function getStep(){
    if(!rpKey) return null;
    return ROLEPLAYS[rpKey].steps[rpIdx] || null;
  }

  function makeVariations(model){
    const v=[];
    v.push(model.replace(/\bI’ve\b/g,'I have').replace(/\bI’m\b/g,'I am'));
    v.push(model.replace(/\bvery\b/g,'really'));
    v.push(model.replace(/\bNot yet\b/g,'Not yet').replace(/\bI’m going to\b/g,'I am going to'));
    return Array.from(new Set(v)).filter(x=>x!==model);
  }

  function checkTargets(text, targets){
    const t=norm(text);
    return targets.every(trg=>{
      const key=norm(trg);
      if(key==='present perfect') return /\b(i['’]ve|have|has)\b/.test(t);
      if(key==='past simple') return /\b(last|yesterday|went|saw|visited|arrived|returned|watched)\b/.test(t);
      if(key==='past continuous') return /\bwas\b\s+\w+ing\b|\bwere\b\s+\w+ing\b/.test(t);
      if(key==='was/were') return /\bwas\b|\bwere\b/.test(t);
      if(key==='-ing') return /\b\w+ing\b/.test(t);
      return t.includes(key);
    });
  }

  function renderRoleplay(){
    const rp=ROLEPLAYS[rpKey];
    const steps=rp.steps;
    const step=steps[rpIdx];
    const sid=`rp_${rpKey}_${rpIdx+1}`;
    $('#rpCount').textContent=`${rpIdx+1} / ${steps.length}`;
    $('#rpMode').textContent = state.solved[sid] ? 'Practice' : 'Scoring';

    $('#rpTeacher').textContent=step.t;
    if(state.autoAudio) speak(step.t);

    const base=step.model;
    const opts=shuffle([base, ...makeVariations(base)]).slice(0,3);
    $('#rpChoices').innerHTML = opts.map(o=>`<button class="choice" type="button" data-t="${o.replace(/"/g,'&quot;')}">${o}</button>`).join('');

    $('#rpFb').className='feedback';
    $('#rpFb').textContent='Choose a reply (or type your own).';
    $('#rpExplain').className='explain'+(showModel?' is-on':'');
    $('#rpExplain').textContent = showModel ? ('Model: '+step.model) : 'Click “Show model reply” if you need help.';

    const box=$('#rpPhrasesBox');
    box.style.display = showPhrases ? 'block' : 'none';
    if(showPhrases){
      $('#rpPhraseList').innerHTML = rp.phrases.map(p=>`<li>${p}</li>`).join('');
    }

    $('#rpChoices').onclick=(e)=>{
      const b=e.target.closest('.choice'); if(!b) return;
      const txt=b.dataset.t||'';
      if(checkTargets(txt, step.targets)){
        b.classList.add('is-right');
        $('#rpFb').className='feedback good';
        $('#rpFb').textContent='✅ Good reply! Say it aloud, then click Next.';
        if(!state.solved[sid]) markSolved(sid,1);
        speak(txt);
      }else{
        b.classList.add('is-wrong');
        $('#rpFb').className='feedback bad';
        $('#rpFb').textContent='❌ Try a reply with the targets. Click Hint.';
      }
    };
  }

  // Writing
  let wKey=null;
  function initWriting(){
    const sel=$('#wSelect');
    sel.innerHTML = WRITING_TASKS.map(t=>`<option value="${t.id}">${t.title}</option>`).join('');
    wKey=sel.value||WRITING_TASKS[0].id;
    sel.onchange=()=>loadWriting(sel.value);
    loadWriting(wKey);

    $('#wReset').onclick=()=>loadWriting(wKey);
    $('#wModel').onclick=()=>{
      const box=$('#wModelBox');
      const task=getTask();
      if(box.dataset.on==='1'){ box.dataset.on='0'; box.textContent='Click “Show model text” to reveal.'; return; }
      box.dataset.on='1'; box.textContent=task.model;
    };
    $('#wListen').onclick=()=>{const txt=$('#wText').value.trim(); if(!txt){setHint('Write something first.'); return;} speak(txt);};
    $('#wCopy').onclick=async()=>{const txt=$('#wText').value.trim(); if(!txt){setHint('Write something first.'); return;} try{await navigator.clipboard.writeText(txt); setHint('Copied!');}catch(e){setHint('Copy failed.');}};
    $('#wHint').onclick=()=>{const task=getTask(); setHint('Use: '+task.steps.slice(0,3).join(' • ')); $('#wFb').className='feedback'; $('#wFb').textContent='💡 Steps: '+task.steps.join(' | ');};
    $('#wCheck').onclick=checkWriting;
  }
  function getTask(){ return WRITING_TASKS.find(t=>t.id===wKey) || WRITING_TASKS[0]; }
  function loadWriting(id){
    wKey=id;
    const task=getTask();
    $('#wSubject').textContent='Subject: '+task.subject;
    $('#wSteps').innerHTML = task.steps.map(s=>`<li>${s}</li>`).join('');
    $('#wText').value='';
    $('#wFb').className='feedback'; $('#wFb').textContent='Write your text, then click Check.';
    $('#wChecklist').innerHTML='';
    $('#wModelBox').dataset.on='0'; $('#wModelBox').textContent='Click “Show model text” to reveal.';
  }
  function checkWriting(){
    const task=getTask();
    const txt=$('#wText').value.trim();
    if(!txt){ $('#wFb').className='feedback bad'; $('#wFb').textContent='❌ Please write a text first.'; return; }
    const checks = task.checks.map(c=>({label:c.label, ok:new RegExp(c.re,'i').test(txt)}));
    const seqCount=(txt.match(/\b(first|then|after that|finally)\b/gi)||[]).length;
    checks.forEach(ch=>{ if(ch.label.includes('2 sequencing')) ch.ok = seqCount>=2; });

    $('#wChecklist').innerHTML = checks.map(ch=>`
      <div class="chk ${ch.ok?'ok':'bad'}"><div class="dot"></div><div>${ch.label} ${ch.ok?'<small>OK</small>':'<small>Missing</small>'}</div></div>
    `).join('');

    const allOk=checks.every(x=>x.ok);
    const wid=`write_${task.id}`;
    if(allOk){ $('#wFb').className='feedback good'; $('#wFb').textContent='✅ Great! Checklist complete.'; markSolved(wid,3); }
    else { $('#wFb').className='feedback bad'; $('#wFb').textContent='❌ Not complete yet. Add the missing items.'; }
  }

  // Connectors section
  function initConnectors(){
    buildTabs('#cTabs', CONNECTORS, 'cat');
    const search=$('#cSearch');
    const render=()=>{
      const q=norm(search.value);
      const active=$('#cTabs .tab.is-active')?.dataset.cat || 'All';
      buildGrid('#cGrid', CONNECTORS, (x)=>{
        const okCat = active==='All' || x.cat===active;
        const okQ = !q || norm(x.en).includes(q) || norm(x.fr).includes(q) || norm(x.use).includes(q);
        return okCat && okQ;
      });
    };
    render(); attachFlip('#cGrid');

    $('#cTabs').onclick=(e)=>{
      const b=e.target.closest('.tab'); if(!b) return;
      $$('#cTabs .tab').forEach((x)=>x.classList.remove('is-active'));
      b.classList.add('is-active');
      render();
    };
    search.oninput=render;

    $('#clearC').onclick=()=>{search.value=''; $$('#cTabs .tab').forEach((x,i)=>x.classList.toggle('is-active',i===0)); render();};
    $('#listenConnectors').onclick=()=>{
      const active=$('#cTabs .tab.is-active')?.dataset.cat || 'All';
      const q=norm(search.value);
      const list=CONNECTORS.filter(x=>(active==='All'||x.cat===active)).filter(x=>!q||norm(x.en).includes(q)||norm(x.fr).includes(q)).slice(0,16);
      if(!list.length){ setHint('No connector matches.'); return; }
      speak(list.map(x=>x.en).join(' '));
    };

    renderMCQ('#mcqConnectors', MCQ_PRACTICE.slice(0,5), 'connqc');
  }

  // Vocab section
  function initVocab(){
    buildTabs('#vTabs', VOCAB, 'cat');
    const search=$('#vSearch');
    const render=()=>{
      const q=norm(search.value);
      const active=$('#vTabs .tab.is-active')?.dataset.cat || 'All';
      buildGrid('#vGrid', VOCAB, (x)=>{
        const okCat=active==='All'||x.cat===active;
        const okQ=!q||norm(x.en).includes(q)||norm(x.fr).includes(q)||norm(x.def).includes(q)||norm(x.ex).includes(q);
        return okCat && okQ;
      });
    };
    render(); attachFlip('#vGrid');

    $('#vTabs').onclick=(e)=>{
      const b=e.target.closest('.tab'); if(!b) return;
      $$('#vTabs .tab').forEach(x=>x.classList.remove('is-active'));
      b.classList.add('is-active');
      render();
    };
    search.oninput=render;

    $('#clearV').onclick=()=>{search.value=''; $$('#vTabs .tab').forEach((x,i)=>x.classList.toggle('is-active',i===0)); render();};
    $('#listenVocab').onclick=()=>{
      const active=$('#vTabs .tab.is-active')?.dataset.cat || 'All';
      const q=norm(search.value);
      const list=VOCAB.filter(x=>(active==='All'||x.cat===active)).filter(x=>!q||norm(x.en).includes(q)||norm(x.fr).includes(q)).slice(0,18);
      if(!list.length){ setHint('No vocab matches.'); return; }
      speak(list.map(x=>x.en).join(' '));
    };

    renderMCQ('#mcqVocab', VOCAB_QUIZ, 'vqc');
  }

  function initPractice(){
    renderMCQ('#mcqPractice', MCQ_PRACTICE, 'prac');
    renderFIB();
    renderStorySelect();
  }

  function computeTotal(){
    const q = document.querySelectorAll('.qItem[data-id]').length;
    const fib = FIB.length;
    const story = STORIES.reduce((a,s)=>a+s.target.length,0);
    const rp = Object.keys(ROLEPLAYS).reduce((a,k)=>a+ROLEPLAYS[k].steps.length,0);
    const writing = WRITING_TASKS.length * 3;
    return q + fib + story + rp + writing;
  }

  function init(){
    initTop();
    initConnectors();
    initTenses();
    initPractice();
    initRoleplays();
    initWriting();
    initVocab();

    totalPoints = computeTotal();
    updateHUD();
    setHint('Go to Role‑plays to practise together step by step.');
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
