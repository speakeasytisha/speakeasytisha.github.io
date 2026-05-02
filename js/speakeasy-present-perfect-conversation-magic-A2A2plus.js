(function(){
  'use strict';
  function $(sel,root){ return (root||document).querySelector(sel); }
  function $all(sel,root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function norm(s){ return String(s||'').trim().toLowerCase().replace(/\s+/g,' '); }
  function shuffle(arr){ var a=arr.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  function esc(s){ return String(s).replace(/[&<>"']/g,function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); }); }

  var STORE='SET_pp_conversation_magic_v1';
  var state=load() || {score:0, solved:{}, accent:'US', speed:'normal', hints:true};

  var MODEL_CONVOS={"catchup": {"title": "🇩🇰 Model conversation — Catching up (why present perfect is MAGIC)", "en": ["A: Hi! How have you been?", "B: I’ve been busy lately, but I’m good.", "A: What have you been up to?", "B: I’ve volunteered at a vet clinic, and I’ve supported young people as an assessor.", "A: Wow! Have you visited Denmark yet?", "B: Not yet. I’ve already looked at flights.", "A: That’s great! Have you ever been on a safari?", "B: Yes! I’ve been on a safari in Africa. I’ve never seen a rhino, though!"], "fr": ["A : Salut ! Comment ça va ?", "B : J’ai été occupée dernièrement, mais ça va.", "A : Quoi de neuf ?", "B : J’ai fait du bénévolat au cabinet vétérinaire et j’ai accompagné des jeunes comme évaluatrice.", "A : Waouh ! Tu as déjà visité le Danemark ?", "B : Pas encore. J’ai déjà regardé les vols.", "A : Super ! Tu as déjà fait un safari ?", "B : Oui ! J’ai fait un safari en Afrique. Je n’ai jamais vu de rhinocéros, par contre !"], "magic": [["💬", "Catching up sounds natural", "You can share updates without a specific past date."], ["✨", "Recent news feels ‘alive’", "just / already / yet make your story real."], ["❓", "Great follow‑up questions", "Have you ever…? How long have you…?"]], "mini": [{"q": "Which word means “pas encore”?", "a": "yet", "opts": ["yet", "ever", "since"]}, {"q": "Which form is correct?", "a": "I’ve been busy lately.", "opts": ["I’m been busy lately.", "I’ve been busy lately.", "I have be busy lately."]}, {"q": "Which question asks about life experience?", "a": "Have you ever been on a safari?", "opts": ["Did you go yesterday?", "Have you ever been on a safari?", "Are you going tomorrow?"]}]}, "vet": {"title": "🐿️ Model conversation — Vet clinic update (recent + unfinished time)", "en": ["A: How has your week been?", "B: It’s been busy! I’ve treated two small animals this week.", "A: Really? What has happened?", "B: A squirrel has arrived, and we’ve cleaned a wound.", "A: Have you finished the follow‑up report yet?", "B: Not yet. I’ve just started it."], "fr": ["A : Ta semaine s’est bien passée ?", "B : Oui, j’ai été très occupée ! J’ai soigné deux petits animaux cette semaine.", "A : Ah bon ? Qu’est‑ce qui s’est passé ?", "B : Un écureuil est arrivé et nous avons nettoyé une plaie.", "A : Tu as fini le rapport de suivi ?", "B : Pas encore. Je viens juste de le commencer."], "mini": [{"q": "Which time phrase fits present perfect?", "a": "this week", "opts": ["this week", "yesterday", "last year"]}, {"q": "Choose the correct negative:", "a": "I haven’t finished yet.", "opts": ["I didn’t finished yet.", "I haven’t finished yet.", "I not finished yet."]}, {"q": "Which word means “à l’instant”?", "a": "just", "opts": ["just", "never", "for"]}]}, "youth": {"title": "🧑‍⚖️ Model conversation — Youth support (since/for + follow‑up)", "en": ["A: How long have you done this role?", "B: I’ve supported young people for two years.", "A: Have you written many reports?", "B: Yes, I’ve written several reports this month.", "A: Have you met the judge yet?", "B: Yes, I have. I’ve met the judge twice."], "fr": ["A : Depuis combien de temps tu fais ce rôle ?", "B : J’accompagne des jeunes depuis deux ans.", "A : Tu as rédigé beaucoup de rapports ?", "B : Oui, j’ai rédigé plusieurs rapports ce mois‑ci.", "A : Tu as déjà rencontré le juge ?", "B : Oui. Je l’ai rencontré deux fois."], "mini": [{"q": "Choose the best: I’ve done it ____ two years.", "a": "for", "opts": ["for", "since", "ago"]}, {"q": "Choose the best: I’ve lived here ____ 2004.", "a": "since", "opts": ["since", "for", "yesterday"]}, {"q": "Short answer: Have you met the judge? — Yes, I ____.", "a": "have", "opts": ["have", "did", "am"]}]}};
  var TIME_WORDS=[{"icon": "✨", "en": "just", "fr": "venir de (à l’instant)", "ex": "I’ve just finished my report."}, {"icon": "✅", "en": "already", "fr": "déjà", "ex": "I’ve already sent the message."}, {"icon": "⏳", "en": "yet", "fr": "encore (négatif/question)", "ex": "I haven’t visited Denmark yet."}, {"icon": "🌿", "en": "recently / lately", "fr": "récemment / dernièrement", "ex": "I’ve been very busy lately."}, {"icon": "❓", "en": "ever", "fr": "déjà (dans une question)", "ex": "Have you ever been on a safari?"}, {"icon": "🚫", "en": "never", "fr": "jamais", "ex": "I’ve never seen a rhino."}, {"icon": "🗓️", "en": "this week / today", "fr": "cette semaine / aujourd’hui", "ex": "I’ve had two meetings this week."}, {"icon": "🧭", "en": "since 2020", "fr": "depuis 2020", "ex": "I’ve lived in France since 2004."}, {"icon": "⏱️", "en": "for two years", "fr": "pendant deux ans", "ex": "I’ve volunteered for two years."}];
  var CARDS=[{"key": "form", "icon": "🧩", "title": "Form (how to build it)", "fr": "Forme (construction)", "rule": "Present perfect = have/has + past participle (V3).", "form": "I have / You have / We have / They have + V3 • He/She has + V3", "examples": ["I’ve visited Denmark.", "She’s written a report.", "We haven’t finished yet."], "quiz": [{"q": "Choose the correct form:", "opts": ["She has wrote a report.", "She has written a report.", "She have written a report."], "a": "She has written a report.", "hint": "has + V3", "why": "Past participle of write = written."}, {"q": "Choose the correct negative:", "opts": ["I haven’t finished yet.", "I didn’t finished yet.", "I not finished yet."], "a": "I haven’t finished yet.", "hint": "haven’t/hasn’t + V3", "why": "Negative present perfect uses haven’t/hasn’t."}, {"q": "Question: ____ you ever been on a safari?", "opts": ["Have", "Did", "Are"], "a": "Have", "hint": "Have + subject + V3", "why": "Have you ever been…?"}, {"q": "Short answer: Have you finished? — Yes, I ____.", "opts": ["have", "did", "am"], "a": "have", "hint": "Yes, I have", "why": "Short answers use have/has."}]}, {"key": "use1", "icon": "💬", "title": "Catching up (no exact date)", "fr": "Prendre des nouvelles (sans date)", "rule": "Use it for updates in conversation when the time is not finished or not important.", "form": "I’ve + V3 / I’ve been + adjective", "examples": ["I’ve been busy lately.", "I’ve volunteered at a vet clinic.", "I’ve supported young people recently."], "quiz": [{"q": "Choose the best:", "opts": ["I’ve been busy lately.", "I was busy lately.", "I’m busy lately yesterday."], "a": "I’ve been busy lately.", "hint": "lately → present perfect", "why": "Lately/recently → present perfect."}, {"q": "Choose the best: This month, I ____ two reports.", "opts": ["have written", "wrote", "write"], "a": "have written", "hint": "this month (unfinished)", "why": "Unfinished time (this month) → present perfect."}, {"q": "Choose the best question:", "opts": ["What have you been up to?", "What did you been up to?", "What are you been up to?"], "a": "What have you been up to?", "hint": "have you been", "why": "Catching up question uses present perfect."}, {"q": "Choose the best: I ____ met her yet.", "opts": ["haven’t", "didn’t", "don’t"], "a": "haven’t", "hint": "haven’t + V3", "why": "Not… yet → haven’t + V3."}]}, {"key": "use2", "icon": "✨", "title": "Just / already / yet (real conversation power)", "fr": "just / already / yet", "rule": "These words make your conversation sound natural and precise.", "form": "just (very recent) • already (earlier than expected) • yet (until now)", "examples": ["I’ve just finished my report.", "I’ve already sent the message.", "I haven’t visited Denmark yet."], "quiz": [{"q": "Very recent:", "opts": ["I’ve just arrived.", "I just arrived (no time).", "I’ve arrived yesterday."], "a": "I’ve just arrived.", "hint": "just + have/has + V3", "why": "Just → present perfect."}, {"q": "Already:", "opts": ["I’ve already booked the flight.", "I already booked the flight yesterday.", "I’ve already book the flight."], "a": "I’ve already booked the flight.", "hint": "booked = V3", "why": "Already + V3."}, {"q": "Yet (question):", "opts": ["Have you finished yet?", "Did you finished yet?", "Have you finish yet?"], "a": "Have you finished yet?", "hint": "Have + V3 + yet", "why": "Yet in questions uses present perfect."}, {"q": "Yet (negative):", "opts": ["I haven’t called yet.", "I didn’t called yet.", "I haven’t call yet."], "a": "I haven’t called yet.", "hint": "haven’t + V3", "why": "Negative with yet: haven’t + V3."}]}, {"key": "use3", "icon": "🧭", "title": "Since / for (how long?)", "fr": "since / for (durée)", "rule": "Use since/for to talk about duration until now. Ask: How long have you…?", "form": "since + point in time • for + duration", "examples": ["I’ve lived in France since 2004.", "I’ve volunteered for two years.", "How long have you worked there?"], "quiz": [{"q": "Choose: I’ve lived here ____ 2004.", "opts": ["since", "for", "ago"], "a": "since", "hint": "since + year", "why": "Since + starting point."}, {"q": "Choose: I’ve volunteered ____ two years.", "opts": ["for", "since", "yesterday"], "a": "for", "hint": "for + duration", "why": "For + duration."}, {"q": "Question: ____ long have you worked there?", "opts": ["How", "What", "When"], "a": "How", "hint": "How long…?", "why": "How long asks duration."}, {"q": "Choose the best: I’ve known her ____ 10 years.", "opts": ["for", "since", "in"], "a": "for", "hint": "duration", "why": "10 years = duration → for."}]}, {"key": "vs_past", "icon": "⚖️", "title": "Present perfect vs past simple", "fr": "present perfect vs prétérit", "rule": "Past simple = finished time (yesterday/last year). Present perfect = unfinished/unknown time (this week/recently).", "form": "Past: yesterday/last… → V2 • PP: this week/recently → have/has + V3", "examples": ["I went to Africa last year. ✅", "I’ve been to Africa (in my life). ✅", "I’ve been busy this week. ✅"], "quiz": [{"q": "Finished time: Yesterday, I ____ her.", "opts": ["called", "have called", "am calling"], "a": "called", "hint": "yesterday → past simple", "why": "Yesterday is finished time → past simple."}, {"q": "Unfinished time: This week, I ____ two reports.", "opts": ["have written", "wrote", "write"], "a": "have written", "hint": "this week → present perfect", "why": "This week is unfinished → present perfect."}, {"q": "Life experience:", "opts": ["I’ve been to Africa.", "I went to Africa (no time).", "I have went to Africa."], "a": "I’ve been to Africa.", "hint": "experience → have been", "why": "Experience uses present perfect."}, {"q": "Past simple question: ____ you go last year?", "opts": ["Did", "Have", "Are"], "a": "Did", "hint": "Did + base", "why": "Finished time uses past simple question (Did)."}]}];
  var PARTICIPLES=[{"base": "be", "pp": "been", "fr": "être"}, {"base": "go", "pp": "gone/been", "fr": "aller"}, {"base": "come", "pp": "come", "fr": "venir"}, {"base": "do", "pp": "done", "fr": "faire"}, {"base": "have", "pp": "had", "fr": "avoir"}, {"base": "make", "pp": "made", "fr": "faire / fabriquer"}, {"base": "get", "pp": "got/gotten", "fr": "obtenir"}, {"base": "meet", "pp": "met", "fr": "rencontrer"}, {"base": "see", "pp": "seen", "fr": "voir"}, {"base": "take", "pp": "taken", "fr": "prendre"}, {"base": "give", "pp": "given", "fr": "donner"}, {"base": "find", "pp": "found", "fr": "trouver"}, {"base": "think", "pp": "thought", "fr": "penser"}, {"base": "say", "pp": "said", "fr": "dire"}, {"base": "tell", "pp": "told", "fr": "raconter / dire"}, {"base": "feel", "pp": "felt", "fr": "ressentir"}, {"base": "leave", "pp": "left", "fr": "partir / quitter"}, {"base": "bring", "pp": "brought", "fr": "apporter"}, {"base": "buy", "pp": "bought", "fr": "acheter"}, {"base": "write", "pp": "written", "fr": "écrire"}, {"base": "eat", "pp": "eaten", "fr": "manger"}, {"base": "drink", "pp": "drunk", "fr": "boire"}, {"base": "sleep", "pp": "slept", "fr": "dormir"}, {"base": "wear", "pp": "worn", "fr": "porter (vêtement)"}, {"base": "read", "pp": "read", "fr": "lire"}];
  var V3_MCQ=[{"q": "Past participle (V3) of “go” (aller):", "opts": ["read", "gone/been", "seen"], "a": "gone/been", "hint": "Present perfect uses V3 (past participle).", "why": "go → gone/been"}, {"q": "Past participle (V3) of “sleep” (dormir):", "opts": ["slept", "said", "thought"], "a": "slept", "hint": "Present perfect uses V3 (past participle).", "why": "sleep → slept"}, {"q": "Past participle (V3) of “meet” (rencontrer):", "opts": ["met", "given", "slept"], "a": "met", "hint": "Present perfect uses V3 (past participle).", "why": "meet → met"}, {"q": "Past participle (V3) of “have” (avoir):", "opts": ["been", "had", "felt"], "a": "had", "hint": "Present perfect uses V3 (past participle).", "why": "have → had"}, {"q": "Past participle (V3) of “do” (faire):", "opts": ["bought", "given", "done"], "a": "done", "hint": "Present perfect uses V3 (past participle).", "why": "do → done"}, {"q": "Past participle (V3) of “come” (venir):", "opts": ["met", "taken", "come"], "a": "come", "hint": "Present perfect uses V3 (past participle).", "why": "come → come"}, {"q": "Past participle (V3) of “eat” (manger):", "opts": ["met", "found", "eaten"], "a": "eaten", "hint": "Present perfect uses V3 (past participle).", "why": "eat → eaten"}, {"q": "Past participle (V3) of “leave” (partir / quitter):", "opts": ["given", "taken", "left"], "a": "left", "hint": "Present perfect uses V3 (past participle).", "why": "leave → left"}, {"q": "Past participle (V3) of “wear” (porter (vêtement)):", "opts": ["worn", "brought", "slept"], "a": "worn", "hint": "Present perfect uses V3 (past participle).", "why": "wear → worn"}, {"q": "Past participle (V3) of “write” (écrire):", "opts": ["drunk", "made", "written"], "a": "written", "hint": "Present perfect uses V3 (past participle).", "why": "write → written"}, {"q": "Past participle (V3) of “bring” (apporter):", "opts": ["worn", "brought", "written"], "a": "brought", "hint": "Present perfect uses V3 (past participle).", "why": "bring → brought"}, {"q": "Past participle (V3) of “give” (donner):", "opts": ["given", "bought", "met"], "a": "given", "hint": "Present perfect uses V3 (past participle).", "why": "give → given"}];
  var VOCAB=[{"cat": "Conversation phrases", "icon": "👋", "en": "What have you been up to?", "fr": "Quoi de neuf ? / Qu’est-ce que tu as fait ?", "def": "friendly catching up question", "ex": "Hi! What have you been up to lately?"}, {"cat": "Conversation phrases", "icon": "💬", "en": "I’ve been busy lately.", "fr": "J’ai été occupée dernièrement.", "def": "catching up", "ex": "I’ve been busy lately, but I’m good."}, {"cat": "Conversation phrases", "icon": "🧡", "en": "That’s great to hear!", "fr": "Ça fait plaisir à entendre !", "def": "positive reaction", "ex": "That’s great to hear! Congratulations."}, {"cat": "Conversation phrases", "icon": "✅", "en": "I’ve already…", "fr": "J’ai déjà…", "def": "already = done before now", "ex": "I’ve already booked the flight."}, {"cat": "Conversation phrases", "icon": "⏳", "en": "I haven’t… yet.", "fr": "Je n’ai pas encore…", "def": "yet = not until now", "ex": "I haven’t visited Denmark yet."}, {"cat": "Conversation phrases", "icon": "✨", "en": "I’ve just…", "fr": "Je viens de…", "def": "just = very recent", "ex": "I’ve just finished my report."}, {"cat": "Conversation phrases", "icon": "❓", "en": "Have you ever…?", "fr": "Est-ce que tu as déjà… ?", "def": "life experience question", "ex": "Have you ever been on a safari?"}, {"cat": "Conversation phrases", "icon": "🚫", "en": "I’ve never…", "fr": "Je n’ai jamais…", "def": "life experience negative", "ex": "I’ve never seen a rhino."}, {"cat": "Conversation phrases", "icon": "🧭", "en": "since / for", "fr": "depuis / pendant", "def": "duration (unfinished time)", "ex": "I’ve lived here since 2004. / for 20 years."}, {"cat": "Conversation phrases", "icon": "🗣️", "en": "How long have you…?", "fr": "Depuis quand… ? / Ça fait combien de temps… ?", "def": "ask duration", "ex": "How long have you volunteered there?"}, {"cat": "Life topics", "icon": "🐿️", "en": "to volunteer at a vet clinic", "fr": "faire du bénévolat au cabinet vétérinaire", "def": "help at a vet clinic for free", "ex": "I’ve volunteered at a vet clinic for two years."}, {"cat": "Life topics", "icon": "🧑‍⚖️", "en": "to support young people", "fr": "accompagner des jeunes", "def": "help and follow progress", "ex": "I’ve supported young people recently."}, {"cat": "Life topics", "icon": "🦁", "en": "to go on a safari", "fr": "partir en safari", "def": "to travel to see wild animals", "ex": "I’ve been on a safari in Africa."}, {"cat": "Life topics", "icon": "📞", "en": "to keep in touch", "fr": "rester en contact", "def": "stay in contact", "ex": "We’ve kept in touch by phone."}, {"cat": "Life topics", "icon": "📩", "en": "to send a message", "fr": "envoyer un message", "def": "send a text/email", "ex": "I’ve already sent a message."}, {"cat": "Life topics", "icon": "📝", "en": "to write a report", "fr": "rédiger un rapport", "def": "write an official document", "ex": "I’ve written two reports this week."}, {"cat": "Time words", "icon": "✨", "en": "just", "fr": "venir de (à l’instant)", "def": "present perfect time word", "ex": "I’ve just finished my report."}, {"cat": "Time words", "icon": "✅", "en": "already", "fr": "déjà", "def": "present perfect time word", "ex": "I’ve already sent the message."}, {"cat": "Time words", "icon": "⏳", "en": "yet", "fr": "encore (négatif/question)", "def": "present perfect time word", "ex": "I haven’t visited Denmark yet."}, {"cat": "Time words", "icon": "🌿", "en": "recently / lately", "fr": "récemment / dernièrement", "def": "present perfect time word", "ex": "I’ve been very busy lately."}, {"cat": "Time words", "icon": "❓", "en": "ever", "fr": "déjà (dans une question)", "def": "present perfect time word", "ex": "Have you ever been on a safari?"}, {"cat": "Time words", "icon": "🚫", "en": "never", "fr": "jamais", "def": "present perfect time word", "ex": "I’ve never seen a rhino."}, {"cat": "Time words", "icon": "🗓️", "en": "this week / today", "fr": "cette semaine / aujourd’hui", "def": "present perfect time word", "ex": "I’ve had two meetings this week."}, {"cat": "Time words", "icon": "🧭", "en": "since 2020", "fr": "depuis 2020", "def": "present perfect time word", "ex": "I’ve lived in France since 2004."}, {"cat": "Time words", "icon": "⏱️", "en": "for two years", "fr": "pendant deux ans", "def": "present perfect time word", "ex": "I’ve volunteered for two years."}];
  var MCQ=[{"q": "Catching up: I ____ busy lately.", "opts": ["have been", "was", "am"], "a": "have been", "hint": "lately → present perfect", "why": "Lately/recently → present perfect."}, {"q": "Already: I’ve ____ sent the message.", "opts": ["already", "yesterday", "ago"], "a": "already", "hint": "already", "why": "Already fits present perfect."}, {"q": "Yet: I haven’t visited Denmark ____.", "opts": ["yet", "already", "since"], "a": "yet", "hint": "yet in negatives", "why": "Not… yet."}, {"q": "Just: I’ve just ____ my report.", "opts": ["finished", "finish", "finishing"], "a": "finished", "hint": "V3 after have", "why": "have/has + V3."}, {"q": "Ever question: ____ you ever been on a safari?", "opts": ["Have", "Did", "Are"], "a": "Have", "hint": "Have + subject + V3", "why": "Have you ever…"}, {"q": "Never: I’ve ____ seen a rhino.", "opts": ["never", "yet", "since"], "a": "never", "hint": "never", "why": "Never = at no time."}, {"q": "Since: I’ve lived here ____ 2004.", "opts": ["since", "for", "ago"], "a": "since", "hint": "since + year", "why": "Since + point in time."}, {"q": "For: I’ve volunteered ____ two years.", "opts": ["for", "since", "yesterday"], "a": "for", "hint": "for + duration", "why": "For + duration."}, {"q": "Choose the correct V3: write →", "opts": ["written", "wrote", "write"], "a": "written", "hint": "write → written", "why": "Past participle is written."}, {"q": "Choose the correct V3: see →", "opts": ["seen", "saw", "see"], "a": "seen", "hint": "see → seen", "why": "Past participle is seen."}, {"q": "Choose: She ____ finished yet.", "opts": ["hasn't", "haven't", "didn't"], "a": "hasn't", "hint": "she = has not", "why": "3rd person singular: hasn't."}, {"q": "Question: ____ she finished yet?", "opts": ["Has", "Have", "Did"], "a": "Has", "hint": "Has + she + V3", "why": "Has she finished yet?"}, {"q": "Short answer: Have you met her? — Yes, I ____.", "opts": ["have", "did", "am"], "a": "have", "hint": "Yes, I have", "why": "Short answers use have/has."}, {"q": "Choose the best: This month, I ____ three reports.", "opts": ["have written", "wrote", "write"], "a": "have written", "hint": "unfinished time", "why": "This month → present perfect."}, {"q": "Finished time: Last year, we ____ to Africa.", "opts": ["went", "have been", "go"], "a": "went", "hint": "last year → past simple", "why": "Finished time → past simple."}, {"q": "Experience: I’ve ____ to Africa.", "opts": ["been", "went", "was"], "a": "been", "hint": "have been", "why": "Experience uses have been."}, {"q": "Negative: I ____ met the judge yet.", "opts": ["haven't", "didn't", "don't"], "a": "haven't", "hint": "haven't + V3", "why": "Not… yet → haven’t + V3."}, {"q": "Choose: I’ve ____ two small animals this week.", "opts": ["treated", "treat", "treating"], "a": "treated", "hint": "V3", "why": "have + V3: treated."}, {"q": "Choose: How long ____ you volunteered there?", "opts": ["have", "did", "are"], "a": "have", "hint": "How long have you…", "why": "Present perfect question."}, {"q": "Choose: I’ve known her ____ ten years.", "opts": ["for", "since", "in"], "a": "for", "hint": "duration", "why": "Ten years = duration → for."}, {"q": "Choose: I’ve known her ____ 2015.", "opts": ["since", "for", "ago"], "a": "since", "hint": "since + year", "why": "Since + starting point."}, {"q": "Choose: We ____ just started.", "opts": ["have", "did", "are"], "a": "have", "hint": "have just started", "why": "Present perfect: have just + V3."}, {"q": "Choose: I’ve ____ busy today.", "opts": ["been", "was", "be"], "a": "been", "hint": "have been", "why": "have been."}, {"q": "Choose: Have you ____ finished?", "opts": ["already", "yesterday", "ago"], "a": "already", "hint": "already in questions", "why": "Already can be used in questions."}, {"q": "Choose: I ____ never visited Denmark.", "opts": ["have", "did", "am"], "a": "have", "hint": "have never", "why": "Present perfect negative experience."}, {"q": "Choose: She has ____ in France since 2004.", "opts": ["lived", "live", "living"], "a": "lived", "hint": "has + V3", "why": "has lived."}, {"q": "Choose the correct: I’ve met her ____ (two times).", "opts": ["twice", "two time", "two times already yesterday"], "a": "twice", "hint": "twice = two times", "why": "twice is correct."}];
  var FIB=[{"id": "fib1", "sent": "I’ve ____ (be) busy lately.", "a": "been", "hint": "be → been"}, {"id": "fib2", "sent": "She has ____ (write) a report this week.", "a": "written", "hint": "write → written"}, {"id": "fib3", "sent": "We haven’t ____ (finish) yet.", "a": "finished", "hint": "haven’t + V3"}, {"id": "fib4", "sent": "Have you ever ____ (go) on a safari?", "a": "been", "hint": "Have you ever been…"}, {"id": "fib5", "sent": "I’ve ____ (never) seen a rhino.", "a": "never", "hint": "never goes after have"}, {"id": "fib6", "sent": "I’ve already ____ (send) the message.", "a": "sent", "hint": "send → sent"}, {"id": "fib7", "sent": "I haven’t visited Denmark ____ .", "a": "yet", "hint": "yet in negatives"}, {"id": "fib8", "sent": "I’ve just ____ (start) the report.", "a": "started", "hint": "just + V3"}, {"id": "fib9", "sent": "How long ____ you worked there?", "a": "have", "hint": "How long have you…"}, {"id": "fib10", "sent": "I’ve lived here ____ 2004.", "a": "since", "hint": "since + year"}, {"id": "fib11", "sent": "I’ve volunteered ____ two years.", "a": "for", "hint": "for + duration"}, {"id": "fib12", "sent": "Has she finished ____ ?", "a": "yet", "hint": "yet in questions"}, {"id": "fib13", "sent": "Yes, I ____ (short answer). Have you finished?", "a": "have", "hint": "Yes, I have."}, {"id": "fib14", "sent": "No, she ____ (short answer). Has she finished?", "a": "hasn't", "hint": "No, she hasn’t."}, {"id": "fib15", "sent": "This month, I’ve ____ (meet) the judge twice.", "a": "met", "hint": "meet → met"}, {"id": "fib16", "sent": "Today, I’ve ____ (have) two meetings.", "a": "had", "hint": "have → had"}, {"id": "fib17", "sent": "I’ve ____ (take) photos of elephants.", "a": "taken", "hint": "take → taken"}, {"id": "fib18", "sent": "We’ve ____ (do) a follow-up meeting.", "a": "done", "hint": "do → done"}, {"id": "fib19", "sent": "I ____ not finished yet.", "a": "have", "hint": "I have not = I haven’t"}, {"id": "fib20", "sent": "She ____ not finished yet.", "a": "has", "hint": "She has not = She hasn’t"}];
  var CONVOS=[{"id": "c1", "title": "🇩🇰 Catching up (basic → amazing)", "hint": "Order the conversation logically.", "target": ["A: Hi! How have you been?", "B: I’ve been busy lately, but I’m good.", "A: What have you been up to?", "B: I’ve volunteered at a vet clinic, and I’ve supported young people recently.", "A: Have you visited Denmark yet?", "B: Not yet. I’ve already looked at flights."]}, {"id": "c2", "title": "🐿️ Vet update (this week)", "hint": "Use this week / just / yet.", "target": ["A: How has your week been?", "B: I’ve treated two small animals this week.", "A: Have you finished the report yet?", "B: Not yet. I’ve just started it."]}, {"id": "c3", "title": "🧑‍⚖️ Youth support (since/for)", "hint": "How long…? since/for", "target": ["A: How long have you done this role?", "B: I’ve supported young people for two years.", "A: Have you met the judge yet?", "B: Yes, I have. I’ve met the judge twice."]}, {"id": "c4", "title": "🦁 Safari experience (ever/never)", "hint": "Have you ever…? I’ve never…", "target": ["A: Have you ever been on a safari?", "B: Yes, I have. I’ve been on a safari in Africa.", "A: Have you ever seen a rhino?", "B: No, I haven’t. I’ve never seen a rhino."]}];
  var BUILD_SENTENCES=[{"id": "bs1", "hint": "have + V3 + time word", "tokens": ["I’ve", "already", "sent", "the", "message."], "target": "I’ve already sent the message."}, {"id": "bs2", "hint": "haven’t + V3 + yet", "tokens": ["I", "haven’t", "visited", "Denmark", "yet."], "target": "I haven’t visited Denmark yet."}, {"id": "bs3", "hint": "Have you ever + V3?", "tokens": ["Have", "you", "a", "ever", "been", "on", "safari?"], "target": "Have you ever been on a safari?"}, {"id": "bs4", "hint": "since + year", "tokens": ["I’ve", "lived", "here", "since", "2004."], "target": "I’ve lived here since 2004."}, {"id": "bs5", "hint": "for + duration", "tokens": ["I’ve", "volunteered", "for", "two", "years."], "target": "I’ve volunteered for two years."}, {"id": "bs6", "hint": "has + V3", "tokens": ["She", "has", "written", "a", "report", "this", "week."], "target": "She has written a report this week."}];
  var ROLEPLAYS={"family": {"title": "🇩🇰 Roleplay: Catching up with your daughter‑in‑law", "steps": [{"t": "Say you’ve been busy lately.", "targets": ["I’ve been", "lately"], "model": "I’ve been busy lately, but I’m good."}, {"t": "Share 2 updates (present perfect).", "targets": ["I’ve"], "model": "I’ve volunteered at a vet clinic and I’ve supported young people recently."}, {"t": "Ask: Have you… yet?", "targets": ["yet"], "model": "Have you visited Denmark yet?"}, {"t": "Answer with not yet + already.", "targets": ["Not yet", "already"], "model": "Not yet. I’ve already looked at flights."}, {"t": "Ask about experience with ever.", "targets": ["ever"], "model": "Have you ever been on a safari?"}, {"t": "Answer with never (optional).", "targets": ["never"], "model": "I’ve never seen a rhino, but I’ve seen elephants!"}], "phrases": ["How have you been?", "What have you been up to?", "Have you… yet?", "Not yet / already", "Have you ever…? / I’ve never…"]}, "vet": {"title": "🐿️ Roleplay: Vet clinic update (this week)", "steps": [{"t": "Say: this week you have treated two animals.", "targets": ["this week"], "model": "I’ve treated two small animals this week."}, {"t": "Say you’ve just started a report.", "targets": ["just"], "model": "I’ve just started the report."}, {"t": "Ask: Have you finished yet?", "targets": ["yet"], "model": "Have you finished yet?"}, {"t": "Answer: Not yet.", "targets": ["Not yet"], "model": "Not yet. I haven’t finished yet."}, {"t": "Use already: you’ve already sent a message.", "targets": ["already"], "model": "I’ve already sent an update message."}, {"t": "Close with a positive sentence.", "targets": ["great"], "model": "It’s been busy, but it’s been great!"}], "phrases": ["This week…", "I’ve just…", "Have you… yet?", "Not yet.", "I’ve already…"]}, "youth": {"title": "🧑‍⚖️ Roleplay: Youth support (since/for)", "steps": [{"t": "Say: you’ve supported young people for two years.", "targets": ["for"], "model": "I’ve supported young people for two years."}, {"t": "Say: you’ve lived in France since 2004.", "targets": ["since"], "model": "I’ve lived in France since 2004."}, {"t": "Ask: How long have you…?", "targets": ["How long"], "model": "How long have you done this role?"}, {"t": "Say: you’ve written reports this month.", "targets": ["this month"], "model": "I’ve written several reports this month."}, {"t": "Ask: Have you met the judge yet?", "targets": ["yet"], "model": "Have you met the judge yet?"}, {"t": "Answer: Yes, I have (twice).", "targets": ["have"], "model": "Yes, I have. I’ve met the judge twice."}], "phrases": ["How long have you…?", "since / for", "this month", "Have you… yet?", "Yes, I have."]}};
  var WRITING_TASKS=[{"id": "w1", "title": "🇩🇰 Message to your daughter‑in‑law (catching up)", "subject": "Write a short catching‑up message using present perfect.", "steps": ["Use 1: I’ve been + adjective (busy/good)", "Use 2 updates (I’ve + V3)", "Use already + yet", "Ask 2 questions (Have you… yet? / Have you ever…?)", "Close warmly"], "model": "Hi! How have you been? I’ve been busy lately, but I’m good. I’ve volunteered at a vet clinic and I’ve supported young people recently. I’ve already sent you some photos, but I haven’t visited Denmark yet. Have you visited Denmark yet? Have you ever been on a safari? Take care — talk soon!", "checks": [{"label": "I’ve been + adjective", "re": "\\bI['’]ve been\\b"}, {"label": "2 updates (I’ve + V3)", "re": "\\bI['’]ve\\b.*\\bI['’]ve\\b"}, {"label": "already + yet", "re": "\\balready\\b.*\\byet\\b|\\byet\\b.*\\balready\\b"}, {"label": "Questions (Have you)", "re": "\\bHave you\\b"}]}, {"id": "w2", "title": "🐿️ Vet clinic update (this week)", "subject": "Write a short update with just/already/yet.", "steps": ["Use this week / today", "Use just + already + yet", "Use 3 verbs: treated / cleaned / written (or similar)", "Finish with a feeling"], "model": "This week, I’ve treated two small animals at the vet clinic. I’ve just cleaned a wound, and I’ve already sent an update message. I haven’t finished the follow-up report yet. It’s been busy, but rewarding.", "checks": [{"label": "this week/today", "re": "\\b(this week|today)\\b"}, {"label": "just/already/yet", "re": "\\bjust\\b|\\balready\\b|\\byet\\b"}, {"label": "At least 2 V3 verbs", "re": "\\b(treated|cleaned|written|sent|met|had|taken|done)\\b"}]}, {"id": "w3", "title": "🧑‍⚖️ Describe your role (since/for)", "subject": "Explain how long you’ve done things (since/for).", "steps": ["Use since + year and for + duration", "Use How long have you…? once", "Use 2 present perfect sentences about work/volunteering", "End with a positive sentence about progress"], "model": "I’ve lived in France since 2004, and I’ve volunteered for two years. How long have you done your role? I’ve supported young people recently and I’ve written several reports this month. Progress takes time, but it’s possible.", "checks": [{"label": "since + year", "re": "\\bsince\\b\\s+\\d{4}\\b"}, {"label": "for + duration", "re": "\\bfor\\b\\s+\\w+"}, {"label": "How long question", "re": "\\bHow long\\b"}, {"label": "present perfect (I’ve / have / has)", "re": "\\bI['’]ve\\b|\\bhave\\b|\\bhas\\b"}]}];

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
      if(!confirm('Reset practice sections (MCQ/FIB/Convo/Builder/Dialogue/Writing/V3)?')) return;
      var keep={};
      for(var k in state.solved){
        if(!/^mcq_|^fib|^convo_|^bs_|^rp_|^write_|^v3_/.test(k)) keep[k]=true;
      }
      state.solved=keep;
      state.score=Object.keys(state.solved).length;
      save();
      location.hash='#practice';
      location.reload();
    };
  }

  // ---------- Model conversations ----------
  function renderModel(key){
    var s=MODEL_CONVOS[key];
    if(!s) return;
    var panel=$('#msPanel');

    var en = s.en.map(function(line){ return '<li>'+esc(line)+'</li>'; }).join('');
    var fr = s.fr.map(function(line){ return '<li>'+esc(line)+'</li>'; }).join('');
    var magic = (s.magic||[]).map(function(m){
      return '<li><strong>'+esc(m[0]+' '+m[1])+'</strong><br/><span class="tag">'+esc(m[2])+'</span></li>';
    }).join('');
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
          '<h3 class="h2" style="font-size:16px;margin:6px 0;">Why it sounds amazing</h3>'+
          (magic?('<ul class="list">'+magic+'</ul>'):'')+
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

  function initModel(){
    var tabs=$('#msTabs');
    tabs.onclick=function(e){
      var b=e.target.closest('.tab'); if(!b) return;
      $all('.tab',tabs).forEach(function(x){ x.classList.remove('is-active'); });
      b.classList.add('is-active');
      renderModel(b.getAttribute('data-ms'));
    };
    renderModel('catchup');
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
        '<div class="wBtns">'+
          '<button class="btn btn--ghost" type="button" id="gListen">🔊 Listen examples</button>'+
        '</div>'+
        '<h3 class="h2" style="font-size:16px;margin:12px 0 6px;">Mini quiz</h3>'+
        '<div class="quiz" id="gQuiz"></div>'+
      '</div>';
    $('#gListen').onclick=function(){ speak(c.examples.join(' ')); };
    renderMCQ('#gQuiz', c.quiz, 'mcq_g_'+c.key);
  }

  function renderTimeList(){
    $('#timeList').innerHTML = TIME_WORDS.map(function(t){
      return '<li>'+esc(t.icon)+' <strong>'+esc(t.en)+'</strong> — <span class="tag">'+esc(t.fr)+'</span> • <span style="color:rgba(247,248,251,.78)">'+esc(t.ex)+'</span></li>';
    }).join('');
  }

  // ---------- V3 table ----------
  function renderV3Table(){
    var root=$('#ppTable');
    var head='<div class="irrRow head"><div>Base</div><div>V3</div><div>FR</div></div>';
    var rows=PARTICIPLES.map(function(v){
      return '<div class="irrRow"><div><strong>'+esc(v.base)+'</strong></div><div>'+esc(v.pp)+'</div><div><span class="tag">'+esc(v.fr)+'</span></div></div>';
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

  // ---------- Conversation order (drag/tap) ----------
  var convoSelToken=null;
  var convo=null;

  function loadConvo(id){
    for(var i=0;i<CONVOS.length;i++){ if(CONVOS[i].id===id){ convo=CONVOS[i]; break; } }
    if(!convo) convo=CONVOS[0];
    $('#convoHint').textContent='Tip: '+convo.hint;
    $('#convoFb').className='feedback';
    $('#convoFb').textContent='Tap a token → tap a slot (or drag).';
    convoSelToken=null;
    renderConvoUI();
  }

  function renderConvoUI(){
    var bank=$('#convoBank');
    var slots=$('#convoSlots');
    var tokens=shuffle(convo.target);
    bank.innerHTML = tokens.map(function(t){ return '<button class="token" type="button" draggable="true" data-text="'+esc(t)+'">'+esc(t)+'</button>'; }).join('');
    slots.innerHTML = convo.target.map(function(_,idx){
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
      convoSelToken = tok.classList.contains('is-selected') ? tok : null;
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
        placeConvo(e.dataTransfer.getData('text/plain'), parseInt(slotEl.getAttribute('data-i'),10), slotEl);
      });
      slotEl.addEventListener('click', function(){
        if(!convoSelToken) return;
        placeConvo(convoSelToken.getAttribute('data-text'), parseInt(slotEl.getAttribute('data-i'),10), slotEl);
      });
      slotEl.addEventListener('keydown', function(ev){
        if((ev.key==='Enter'||ev.key===' ') && convoSelToken){
          ev.preventDefault();
          placeConvo(convoSelToken.getAttribute('data-text'), parseInt(slotEl.getAttribute('data-i'),10), slotEl);
        }
      });
    });
  }

  function placeConvo(text, idx, slotEl){
    var expected=convo.target[idx];
    var fb=$('#convoFb');
    if(text===expected){
      slotEl.querySelector('.slotText').textContent=text;
      slotEl.classList.add('is-hot');
      setTimeout(function(){ slotEl.classList.remove('is-hot'); },200);

      // lock token
      var bank=$('#convoBank');
      var toks=$all('.token',bank);
      for(var i=0;i<toks.length;i++){
        if(toks[i].getAttribute('data-text')===text){
          toks[i].classList.remove('is-selected');
          toks[i].classList.add('is-locked');
          toks[i].setAttribute('draggable','false');
          break;
        }
      }
      convoSelToken=null;

      fb.className='feedback good';
      fb.textContent='✅ Correct placement!';
      speak(text);
      markSolved('convo_'+convo.id+'_'+(idx+1),1);

      // completion check
      var allDone=true;
      $all('.slotText',$('#convoSlots')).forEach(function(st){
        if(st.textContent.indexOf('Tap/drag')===0) allDone=false;
      });
      if(allDone){
        fb.textContent='🎉 Conversation complete! Read it aloud.';
        speak(convo.target.join(' '));
      }
    }else{
      slotEl.classList.add('is-bad');
      setTimeout(function(){ slotEl.classList.remove('is-bad'); },300);
      fb.className='feedback bad';
      fb.textContent='❌ Not correct for this slot.';
    }
  }

  function initConvos(){
    var sel=$('#convoSelect');
    sel.innerHTML = CONVOS.map(function(s){ return '<option value="'+esc(s.id)+'">'+esc(s.title)+'</option>'; }).join('');
    sel.onchange=function(){ loadConvo(sel.value); };
    $('#convoReset').onclick=function(){ loadConvo(sel.value); };
    loadConvo(sel.value || CONVOS[0].id);
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
    v.push(model.replace(/\bI’ve\b/g,'I have').replace(/\bI’m\b/g,'I am'));
    v.push(model.replace(/\blately\b/g,'recently'));
    v.push(model.replace(/\bNot yet\b/g,'Not yet'));
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

  // ---------- Total points ----------
  function computeTotal(){
    var q=0;
    // model mini quizzes
    q += (MODEL_CONVOS.catchup.mini.length + MODEL_CONVOS.vet.mini.length + MODEL_CONVOS.youth.mini.length);
    // grammar quizzes
    for(var i=0;i<CARDS.length;i++) q += CARDS[i].quiz.length;
    q += V3_MCQ.length;
    q += MCQ.length;
    q += FIB.length;
    // convo order slots
    for(var j=0;j<CONVOS.length;j++) q += CONVOS[j].target.length;
    q += BUILD_SENTENCES.length*2;
    // roleplays
    var rp=0; for(var k in ROLEPLAYS){ if(ROLEPLAYS.hasOwnProperty(k)) rp += ROLEPLAYS[k].steps.length; }
    q += rp;
    q += WRITING_TASKS.length*3;
    return q;
  }

  // ---------- Init helpers ----------
  function initV3Trainer(){ renderMCQ('#mcqV3', V3_MCQ, 'v3'); }
  function initMCQ(){ renderMCQ('#mcqMain', MCQ, 'mcq_main'); }
  function initFIB(){ renderFIB(); }

  // ---------- Boot ----------
  function init(){
    initTop();
    initModel();
    renderGrammarTabs();
    renderTimeList();
    renderV3Table();
    initV3Trainer();
    initMCQ();
    initFIB();
    initConvos();
    initBuilder();
    initRoleplays();
    initWriting();
    renderVocab();

    totalPoints = computeTotal();
    updateHud();
    setHint('Tip: model conversation → grammar card quizzes → practice.');
  }

  document.addEventListener('DOMContentLoaded', init);
})();