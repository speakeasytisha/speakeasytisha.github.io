(function(){
  'use strict';

  function $(sel, root){ return (root || document).querySelector(sel); }
  function $all(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function norm(s){ return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim(); }
  function shuffle(arr){
    var a = arr.slice();
    for(var i=a.length-1; i>0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(m){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]);
    });
  }

  var STORE = 'SET_writing_tense_workout_v6';
  var state = load() || {score:0, solved:{}, accent:'US', speed:'normal', hints:true};

  var VOCAB = [{"cat": "Culture & plans", "icon": "🖼️", "en": "exhibition", "fr": "exposition", "def": "a public show of art", "ex": "I’m visiting an exhibition tomorrow."}, {"cat": "Culture & plans", "icon": "🍽️", "en": "to have lunch", "fr": "déjeuner", "def": "eat lunch", "ex": "We’re having lunch at a restaurant."}, {"cat": "Culture & plans", "icon": "📅", "en": "appointment", "fr": "rendez-vous", "def": "a planned meeting", "ex": "I have an appointment at 3:30 p.m."}, {"cat": "Culture & plans", "icon": "🗓️", "en": "to schedule", "fr": "planifier", "def": "arrange a time/date", "ex": "I scheduled a follow‑up meeting."}, {"cat": "Conversation", "icon": "✨", "en": "just", "fr": "venir de", "def": "very recently", "ex": "I’ve just finished my email."}, {"cat": "Conversation", "icon": "✅", "en": "already", "fr": "déjà", "def": "earlier than expected", "ex": "I’ve already booked the tickets."}, {"cat": "Conversation", "icon": "⏳", "en": "yet", "fr": "encore (négatif/question)", "def": "until now", "ex": "I haven’t been there yet."}, {"cat": "Conversation", "icon": "🧭", "en": "since / for", "fr": "depuis / pendant", "def": "duration until now", "ex": "I’ve volunteered for two years."}, {"cat": "Conversation", "icon": "👋", "en": "to keep in touch", "fr": "rester en contact", "def": "stay connected", "ex": "We keep in touch by phone."}, {"cat": "Support work", "icon": "📝", "en": "report", "fr": "rapport", "def": "official written document", "ex": "I wrote a short report."}, {"cat": "Support work", "icon": "🤝", "en": "follow‑up", "fr": "suivi", "def": "check progress later", "ex": "We planned a follow‑up."}, {"cat": "Support work", "icon": "🧠", "en": "to encourage", "fr": "encourager", "def": "help someone feel confident", "ex": "I encouraged him to continue."}, {"cat": "Animals", "icon": "🐿️", "en": "squirrel", "fr": "écureuil", "def": "small animal with a bushy tail", "ex": "A squirrel arrived at the clinic."}, {"cat": "Animals", "icon": "🦫", "en": "groundhog", "fr": "marmotte", "def": "a large squirrel‑like animal", "ex": "We treated a groundhog."}, {"cat": "Animals", "icon": "🩺", "en": "to check an animal", "fr": "examiner un animal", "def": "look carefully to evaluate health", "ex": "The vet checked the animal."}, {"cat": "Animals", "icon": "🧼", "en": "to clean a wound", "fr": "nettoyer une plaie", "def": "wash and disinfect", "ex": "I was cleaning a wound."}, {"cat": "Safari", "icon": "🦁", "en": "lion", "fr": "lion", "def": "large wild cat", "ex": "A lion appeared near the road."}, {"cat": "Safari", "icon": "🦓", "en": "zebra", "fr": "zèbre", "def": "animal with black and white stripes", "ex": "We saw zebras while we were driving."}, {"cat": "Safari", "icon": "📸", "en": "to take photos", "fr": "prendre des photos", "def": "take pictures", "ex": "I was taking photos when it started raining."}, {"cat": "Safari", "icon": "🌅", "en": "sunset", "fr": "coucher du soleil", "def": "time when the sun goes down", "ex": "We watched the sunset."}];
  var GRAMMAR = [{"key": "present_simple", "icon": "📌", "title": "Present simple (routine / facts)", "fr": "présent simple", "rule": "Use for routines, habits, facts.", "form": "I/you/we/they + base • he/she/it + base+s • do/does for questions • don’t/doesn’t for negatives", "examples": ["I work in the morning.", "He speaks English.", "Do you travel often?", "I don’t work on Sundays."], "quiz": [{"q": "Choose: He ____ English.", "opts": ["speaks", "speak", "speaking"], "a": "speaks", "hint": "he/she/it + -s", "why": "3rd person singular adds -s."}, {"q": "Negative: I ____ work on Sundays.", "opts": ["don’t", "doesn’t", "am not"], "a": "don’t", "hint": "I don’t + base", "why": "Present simple negative: don’t + base."}, {"q": "Question: ____ you travel often?", "opts": ["Do", "Are", "Did"], "a": "Do", "hint": "Do + subject", "why": "Present simple questions use do/does."}]}, {"key": "present_cont", "icon": "🎬", "title": "Present continuous (now / arrangement)", "fr": "présent continu", "rule": "Use for actions happening now or fixed arrangements.", "form": "am/is/are + verb‑ing", "examples": ["I’m studying now.", "We’re meeting tomorrow at 3:30.", "She isn’t working today.", "Are you listening?"], "quiz": [{"q": "Choose: We ____ meeting tomorrow.", "opts": ["are", "do", "were"], "a": "are", "hint": "are + -ing", "why": "Present continuous uses am/is/are + -ing."}, {"q": "Negative: She ____ working today.", "opts": ["isn’t", "doesn’t", "didn’t"], "a": "isn’t", "hint": "isn’t + -ing", "why": "Present continuous negative: isn’t + -ing."}, {"q": "Question: ____ you listening?", "opts": ["Are", "Do", "Did"], "a": "Are", "hint": "Are you + -ing", "why": "Present continuous question: Are you + -ing?"}]}, {"key": "past_simple", "icon": "🕰️", "title": "Past simple (finished past)", "fr": "prétérit", "rule": "Use for finished actions in the past (yesterday/last week).", "form": "V2 (regular -ed / irregular) • did/didn’t + base", "examples": ["I visited a museum yesterday.", "We went on safari last year.", "Did you call? I didn’t call."], "quiz": [{"q": "Finished time: Yesterday, I ____ to Paris.", "opts": ["went", "go", "have gone"], "a": "went", "hint": "yesterday → past simple", "why": "Yesterday is finished → past simple."}, {"q": "Question: ____ you call?", "opts": ["Did", "Do", "Have"], "a": "Did", "hint": "Did + base", "why": "Past simple question: Did + base."}, {"q": "Negative: I ____ call.", "opts": ["didn’t", "don’t", "haven’t"], "a": "didn’t", "hint": "didn’t + base", "why": "Past simple negative: didn’t + base."}]}, {"key": "past_cont", "icon": "⏳", "title": "Past continuous (was/were + -ing)", "fr": "imparfait (idée)", "rule": "Use for an action in progress in the past. Often: while/when + past simple event.", "form": "was/were + verb‑ing", "examples": ["I was taking photos when it started raining.", "While we were driving, we saw zebras.", "Were you working at 10? I wasn’t."], "quiz": [{"q": "Choose: I ____ sleeping when the phone rang.", "opts": ["was", "did", "have"], "a": "was", "hint": "was + -ing", "why": "Past continuous uses was/were + -ing."}, {"q": "Connector for background:", "opts": ["While", "Tomorrow", "For"], "a": "While", "hint": "while = pendant que", "why": "While introduces the background action."}, {"q": "Event (past simple): The phone ____.", "opts": ["rang", "was ringing", "rings"], "a": "rang", "hint": "event in past simple", "why": "Rang is the completed event."}]}, {"key": "present_perf", "icon": "✨", "title": "Present perfect (updates / experience)", "fr": "present perfect", "rule": "Use for updates with no exact date, experience, and unfinished time (this week).", "form": "have/has + V3", "examples": ["I’ve been busy lately.", "I’ve already sent the email.", "Have you ever been on safari?", "I haven’t finished yet."], "quiz": [{"q": "Choose: I’ve ____ finished.", "opts": ["just", "yesterday", "ago"], "a": "just", "hint": "just + have + V3", "why": "Just = very recent, with present perfect."}, {"q": "Negative: I haven’t finished ____.", "opts": ["yet", "last year", "tomorrow"], "a": "yet", "hint": "yet in negatives", "why": "Yet = until now."}, {"q": "Experience question: ____ you ever been on safari?", "opts": ["Have", "Did", "Are"], "a": "Have", "hint": "Have you ever…", "why": "Ever questions use have/has."}]}, {"key": "future", "icon": "🔮", "title": "Future (plans / arrangements)", "fr": "futur", "rule": "Use going to (plan), present continuous (arrangement), will (decision).", "form": "am/is/are going to + verb • am/is/are + -ing • will + verb", "examples": ["I’m going to visit an exhibition tomorrow.", "I’m meeting a friend at 3:30.", "I’ll send a message tonight."], "quiz": [{"q": "Plan: I ____ going to visit Paris.", "opts": ["am", "do", "will"], "a": "am", "hint": "I am going to…", "why": "Going to uses am/is/are."}, {"q": "Arrangement: We ____ meeting tomorrow.", "opts": ["are", "do", "did"], "a": "are", "hint": "are + -ing", "why": "Arrangements use present continuous."}, {"q": "Decision now: I ____ help you.", "opts": ["will", "am going to", "am helping"], "a": "will", "hint": "offer/decision → will", "why": "Will is common for offers/decisions."}]}];
  var REWRITE = [{"id": "rw1", "icon": "🔮", "prompt": "Future plan: Tomorrow, I ____ (visit) an exhibition.", "answers": ["am going to visit", "am visiting"], "hint": "Plan/arrangement → going to OR present continuous."}, {"id": "rw2", "icon": "✨", "prompt": "Present perfect: I ____ (already / send) the message.", "answers": ["have already sent", "'ve already sent"], "hint": "have + V3 (sent)."}, {"id": "rw3", "icon": "⏳", "prompt": "Past continuous: At 10, I ____ (work).", "answers": ["was working"], "hint": "specific time → was/were + -ing."}, {"id": "rw4", "icon": "🕰️", "prompt": "Past simple: Yesterday, we ____ (go) to the museum.", "answers": ["went"], "hint": "yesterday → past simple, go → went."}, {"id": "rw5", "icon": "📌", "prompt": "Present routine: Usually, I ____ (keep) in touch by phone.", "answers": ["keep"], "hint": "I/you/we/they + base verb."}, {"id": "rw6", "icon": "🎬", "prompt": "Now: Right now, I ____ (study).", "answers": ["am studying", "'m studying"], "hint": "am/is/are + -ing."}];
  var TASKS = [{"id": "t_future_plan", "title": "🔮 Plan for tomorrow (future forms)", "scenario": "You are explaining your plan for tomorrow (culture + food + meeting).", "new_vocab": ["exhibition", "to have lunch", "appointment", "Afterwards", "In the evening", "to keep in touch"], "levels": [{"level": "A2.2 Guided", "steps": ["Use 4 connectors: Tomorrow / Afterwards / Then / In the evening", "Use 2 future forms: present continuous OR going to", "Include 1 place + 1 time (3:30 p.m.)", "Use at least 2 new vocabulary words"], "frame": ["Tomorrow, I’m ____ at ____ (place).", "Afterwards, I’m ____ (lunch/dinner).", "Then, I have ____ at ____ (time).", "In the evening, we’re ____ (go back home / relax)."], "model_v1": "Tomorrow, I’m visiting the Matisse exhibition at the Grand Palais in Paris. Afterwards, I’m having lunch at a restaurant. Then, I have an appointment at 3:30 p.m. In the evening, we’re going back home.", "model_v2": "Tomorrow, I’m going to Paris to visit the Matisse exhibition. Afterwards, I’m having lunch at a restaurant. Later, I’ve got an appointment at 3:30 p.m., and in the evening we’ll head back home. I’m really looking forward to it.", "checks": [{"label": "4 connectors (tomorrow/after/then/evening)", "re": "\\\\bTomorrow\\\\b.*\\\\bAfter(wards| that)\\\\b.*\\\\bThen\\\\b.*\\\\b(evening|In the evening)\\\\b"}, {"label": "Future form (going to / I’m -ing / will)", "re": "\\\\bgoing to\\\\b|\\\\bI['’]m\\\\s+\\\\w+ing\\\\b|\\\\bWe['’]re\\\\s+\\\\w+ing\\\\b|\\\\bwill\\\\b|\\\\bI['’]ll\\\\b"}, {"label": "Time (3:30)", "re": "\\\\b3[:. ]?30\\\\b"}, {"label": "2 new vocab words", "re_any": ["\\\\bexhibition\\\\b", "\\\\bhave lunch\\\\b", "\\\\bappointment\\\\b", "\\\\bAfterwards\\\\b", "\\\\bkeep in touch\\\\b"], "min": 2}]}, {"level": "A2+ Semi-guided", "steps": ["Write 4–6 sentences.", "Add 1 feeling sentence (excited / looking forward).", "Use at least 3 connectors (First / Afterwards / Later / Finally).", "Use at least 3 new vocabulary words."], "frame": [], "model_v1": "Tomorrow, I’m visiting an exhibition in Paris. Afterwards, I’m having lunch at a restaurant. Later, I have a meeting at 3:30 p.m. Finally, we’re going back home. I’m excited.", "model_v2": "Tomorrow, I’m going to Paris to visit an exhibition. Afterwards, I’m having lunch at a restaurant, and later I’ve got a meeting at 3:30 p.m. In the evening, we’ll head back home. I’m really looking forward to it.", "checks": [{"label": "At least 4 sentences (approx.)", "re": "[.!?].*[.!?].*[.!?].*[.!?]"}, {"label": "Feelings (excited/looking forward/happy)", "re": "\\\\b(excited|looking forward|happy|glad)\\\\b"}, {"label": "Connectors", "re": "\\\\b(First|Afterwards|Later|Finally|Then|In the evening)\\\\b"}, {"label": "3 new vocab words", "re_any": ["\\\\bexhibition\\\\b", "\\\\bhave lunch\\\\b", "\\\\bappointment\\\\b", "\\\\bschedule(d)?\\\\b", "\\\\bkeep in touch\\\\b"], "min": 3}]}, {"level": "Free CLOE speaking style", "steps": ["Write a 30–40 second speaking script (one paragraph).", "Use contractions (I’m / we’ll / I’ve got).", "Use one plan + one arrangement + one closing sentence."], "frame": [], "model_v1": "Tomorrow I’m going to Paris to visit an exhibition. Afterwards I’m having lunch at a restaurant. Then I’ve got an appointment at 3:30, and in the evening we’ll go back home.", "model_v2": "Tomorrow I’m going to Paris to visit the Matisse exhibition. Afterwards I’m having lunch at a restaurant, then I’ve got an appointment at 3:30, and in the evening we’ll head back home. I’m looking forward to it.", "checks": [{"label": "Contractions (I’m/we’ll/I’ve)", "re": "\\\\bI['’]m\\\\b|\\\\bwe['’]ll\\\\b|\\\\bI['’]ve\\\\b|\\\\bI['’]ve got\\\\b"}, {"label": "One plan + one arrangement", "re": "\\\\bgoing to\\\\b.*\\\\bI['’]m\\\\s+\\\\w+ing\\\\b|\\\\bI['’]m\\\\s+\\\\w+ing\\\\b.*\\\\bgoing to\\\\b"}, {"label": "Closing feeling", "re": "\\\\b(looking forward|excited|can’t wait)\\\\b"}]}]}, {"id": "t_present_perf_catchup", "title": "✨ Catching up (present perfect)", "scenario": "You are catching up with family. Share updates and ask questions.", "new_vocab": ["What have you been up to", "already", "yet", "just", "since/for", "to keep in touch"], "levels": [{"level": "A2.2 Guided", "steps": ["Use 3 present perfect sentences (I’ve + V3 / I’ve been + adj).", "Use already + yet OR just.", "Ask 2 questions (Have you… yet? / Have you ever…?)", "Use at least 2 new vocabulary words."], "frame": ["Hi! How have you been?", "I’ve been ____ lately.", "I’ve ____ (V3) ____.", "I’ve already ____ , but I haven’t ____ yet.", "Have you ____ yet?", "Have you ever ____?"], "model_v1": "Hi! How have you been? I’ve been busy lately. I’ve volunteered at a vet clinic. I’ve already sent some photos, but I haven’t visited Denmark yet. Have you visited Denmark yet? Have you ever been on safari?", "model_v2": "Hi! What have you been up to lately? I’ve been quite busy lately. I’ve already sent you a message, but I haven’t heard back yet. Have you ever been on safari? I’ve never seen a rhino. I’ve volunteered for two years. Talk soon!", "checks": [{"label": "Present perfect (I’ve/Have/has)", "re": "\\\\bI['’]ve\\\\b|\\\\bHave you\\\\b|\\\\bhas\\\\b"}, {"label": "already/yet/just", "re": "\\\\b(already|yet|just)\\\\b"}, {"label": "2 questions", "re": "\\\\?\\\\s*.*\\\\?"}, {"label": "2 new vocab words", "re_any": ["\\\\bWhat have you been up to\\\\b", "\\\\balready\\\\b", "\\\\byet\\\\b", "\\\\bjust\\\\b", "\\\\bkeep in touch\\\\b", "\\\\bfor\\\\b", "\\\\bsince\\\\b"], "min": 2}]}, {"level": "Free CLOE speaking style", "steps": ["Write one paragraph (30–40 seconds).", "Use 1 experience (I’ve been to… / I’ve never…).", "Use 1 update with already/yet."], "frame": [], "model_v1": "Hi! I’ve been busy lately. I’ve already worked a lot this week, but I haven’t finished everything yet. I’ve been to Africa before, and I’ve never seen a rhino. I’m looking forward to catching up soon.", "model_v2": "Hi! I’ve been quite busy lately. I’ve already sent a few messages, but I haven’t heard back yet. I’ve been to Africa before and I’ve never seen a rhino, but I’ve seen elephants. I’m looking forward to catching up soon.", "checks": [{"label": "Experience (been to/never)", "re": "\\\\b(I['’]ve been to|I['’]ve never)\\\\b"}, {"label": "already/yet", "re": "\\\\b(already|yet)\\\\b"}]}]}, {"id": "t_story_mix", "title": "📚 Story moment (past continuous + past simple)", "scenario": "Tell a short story: what was happening + what happened suddenly.", "new_vocab": ["while", "when", "to take photos", "to drive", "at that moment", "sunset"], "levels": [{"level": "A2.2 Guided", "steps": ["Use 2 past continuous sentences (was/were + -ing).", "Use when once (interruption).", "Use while once (background).", "Finish with 1 past simple event."], "frame": ["Last year / Yesterday at ____, I was ____ (‑ing).", "While we were ____, we ____ (past simple).", "I was ____ when ____ (past simple event).", "At that moment, I was ____.", "After that, we ____ (past simple)."], "model_v1": "Last year, we were driving slowly. While we were driving, we saw zebras. I was taking photos when a lion appeared. At that moment, my heart was beating fast. After that, we watched the sunset.", "model_v2": "Last year in Africa, we were driving slowly in the safari jeep. While we were driving, we saw zebras near the road. I was taking photos when a lion appeared. At that moment, my heart was beating fast, but I stayed quiet. After that, we watched the sunset.", "checks": [{"label": "Past continuous (was/were + ing)", "re": "\\\\b(was|were)\\\\b\\\\s+\\\\w+ing\\\\b"}, {"label": "while", "re": "\\\\bWhile\\\\b"}, {"label": "when", "re": "\\\\bwhen\\\\b"}, {"label": "Past simple event (appeared/saw/watched/rang/started)", "re": "\\\\b(appeared|saw|watched|rang|started)\\\\b"}]}, {"level": "Free CLOE speaking style", "steps": ["Write one paragraph (30–45 seconds).", "Use While + when + 1 feeling sentence (nervous/surprised)."], "frame": [], "model_v1": "Last year in Africa, we were driving slowly. While we were driving, we were looking for elephants. I was taking photos when a lion appeared. At that moment I was nervous, but I stayed quiet. After that, we watched the sunset.", "model_v2": "Last year in Africa, we were driving slowly through the safari park. While we were looking for elephants, we saw zebras near the road. I was taking photos when, suddenly, a lion appeared. At that moment, my heart was beating fast, but I stayed quiet so I could enjoy the moment. After that, we watched the sunset and went back to the camp.", "checks": [{"label": "While + when", "re": "\\\\bWhile\\\\b.*\\\\bwhen\\\\b|\\\\bwhen\\\\b.*\\\\bWhile\\\\b"}, {"label": "Feeling (nervous/surprised/stressed)", "re": "\\\\b(nervous|surprised|stressed|scared)\\\\b"}]}]}, {"id": "t_mix_all", "title": "🧠 Ensemble challenge (mix tenses)", "scenario": "Mix: past (one memory), present (routine), present perfect (update), future (plan).", "new_vocab": ["exhibition", "follow‑up", "already", "yet", "appointment", "to encourage"], "levels": [{"level": "A2.2 Guided", "steps": ["Write 6–8 sentences total.", "Include: 1 past simple sentence (yesterday/last year)", "Include: 1 past continuous sentence (was/were + ing)", "Include: 1 present perfect update (already/yet)", "Include: 1 future plan (going to / I’m -ing / will)"], "frame": ["Past: Yesterday / Last year, I ____ (past simple).", "Past (in progress): I was ____ when ____ (past simple).", "Update: I’ve already ____ , but I haven’t ____ yet.", "Future: Tomorrow, I’m going to ____ / I’m ____-ing.", "Closing: I’m looking forward to it."], model_v1: "Yesterday, I wrote a report. I was taking notes when a new question came up. I’ve already scheduled a follow-up, but I haven’t finished the report yet. Tomorrow, I’m visiting an exhibition and then I’ve got an appointment at 3:30. I’m looking forward to it.", model_v2: "Yesterday, I wrote a short report. While I was taking notes, a new question came up. I’ve already scheduled a follow-up, but I haven’t finished the report yet. Tomorrow, I’m visiting an exhibition, and then I’ve got an appointment at 3:30. I’m really looking forward to it because it will be a busy but interesting day.", "checks": [{"label": "Past simple marker (yesterday/last)", "re": "\\\\b(yesterday|last year|last week)\\\\b"}, {"label": "Past continuous (was/were + ing)", "re": "\\\\b(was|were)\\\\b\\\\s+\\\\w+ing\\\\b"}, {"label": "Present perfect (I’ve + already/yet)", "re": "\\\\bI['’]ve\\\\b.*\\\\b(already|yet)\\\\b"}, {"label": "Future (going to / I’m -ing / will)", "re": "\\\\bgoing to\\\\b|\\\\bI['’]m\\\\s+\\\\w+ing\\\\b|\\\\bwill\\\\b|\\\\bI['’]ll\\\\b"}]}]}];

  var totalPoints = 0;
  var curTask = null;
  var curLevel = null;

  function load(){
    try { return JSON.parse(localStorage.getItem(STORE) || ''); }
    catch(e){ return null; }
  }

  function save(){
    try { localStorage.setItem(STORE, JSON.stringify(state)); }
    catch(e){}
  }

  function setHint(t){
    var hb = $('#hintBox');
    if(hb) hb.textContent = t;
  }

  function updateHud(){
    var scoreNow = $('#scoreNow');
    var scoreTotal = $('#scoreTotal');
    var pPct = $('#pPct');
    var pBar = $('#pBar');

    if(scoreNow) scoreNow.textContent = String(state.score);
    if(scoreTotal) scoreTotal.textContent = String(totalPoints);

    var pct = totalPoints ? Math.round((state.score / totalPoints) * 100) : 0;
    if(pPct) pPct.textContent = pct + '%';
    if(pBar) pBar.style.width = Math.max(0, Math.min(100, pct)) + '%';
  }

  function markSolved(id, pts){
    if(state.solved[id]) return false;
    state.solved[id] = true;
    state.score += (pts || 1);
    save();
    updateHud();
    return true;
  }

  // Speech
  var voices = [];
  function refreshVoices(){
    try { voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }
    catch(e){ voices = []; }
  }

  if('speechSynthesis' in window){
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }

  function pickVoice(){
    var want = state.accent === 'UK' ? ['en-GB','en_GB'] : ['en-US','en_US'];
    for(var i=0; i<voices.length; i++){
      if(want.indexOf(voices[i].lang) >= 0) return voices[i];
    }
    for(var j=0; j<voices.length; j++){
      if((voices[j].lang || '').toLowerCase().indexOf('en') === 0) return voices[j];
    }
    return null;
  }

  function speak(text){
    if(!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text || ''));
      var v = pickVoice();
      if(v) u.voice = v;
      u.rate = state.speed === 'slow' ? 0.78 : 0.95;
      window.speechSynthesis.speak(u);
    } catch(e){}
  }

  function stopSpeak(){
    try { if('speechSynthesis' in window) window.speechSynthesis.cancel(); }
    catch(e){}
  }

  function setPill(id, on){
    var el = $(id);
    if(el) el.className = on ? 'pill is-active' : 'pill';
  }

  function initTop(){
    setPill('#accentUS', state.accent === 'US');
    setPill('#accentUK', state.accent === 'UK');
    setPill('#speedN', state.speed === 'normal');
    setPill('#speedS', state.speed === 'slow');
    setPill('#hOn', !!state.hints);
    setPill('#hOff', !state.hints);

    $('#accentUS').onclick = function(){ state.accent='US'; save(); initTop(); setHint('Accent: US'); };
    $('#accentUK').onclick = function(){ state.accent='UK'; save(); initTop(); setHint('Accent: UK'); };
    $('#speedN').onclick = function(){ state.speed='normal'; save(); initTop(); };
    $('#speedS').onclick = function(){ state.speed='slow'; save(); initTop(); };
    $('#hOn').onclick = function(){ state.hints=true; save(); initTop(); setHint('Hints ON'); };
    $('#hOff').onclick = function(){ state.hints=false; save(); initTop(); setHint('Hints OFF'); };

    $('#stopAudio').onclick = stopSpeak;
    $('#printBtn').onclick = function(){ window.print(); };

    $('#resetAll').onclick = function(){
      if(!confirm('Reset ALL progress for this page?')) return;
      localStorage.removeItem(STORE);
      location.reload();
    };

    $('#resetPractice').onclick = function(){
      if(!confirm('Reset practice sections?')) return;
      state.solved = {};
      state.score = 0;
      save();
      location.reload();
    };
  }

  // Vocabulary
  function buildTabs(rootId, items){
    var root = $(rootId);
    if(!root) return;

    var cats = ['All'];
    items.forEach(function(x){
      if(cats.indexOf(x.cat) === -1) cats.push(x.cat);
    });

    root.innerHTML = cats.map(function(c, idx){
      return '<button class="tab '+(idx===0?'is-active':'')+'" type="button" data-cat="'+esc(c)+'">'+esc(c)+'</button>';
    }).join('');
  }

  function activeCat(rootId){
    var root = $(rootId);
    var el = root ? root.querySelector('.tab.is-active') : null;
    return el ? el.getAttribute('data-cat') : 'All';
  }

  function renderVocab(){
    buildTabs('#vTabs', VOCAB);
    var grid = $('#vGrid');

    function doRender(){
      var cat = activeCat('#vTabs');
      var q = norm($('#vSearch').value);
      var out = [];

      VOCAB.forEach(function(v){
        if(cat !== 'All' && v.cat !== cat) return;

        if(q){
          var ok = norm(v.en).indexOf(q) >= 0 ||
                   norm(v.fr).indexOf(q) >= 0 ||
                   norm(v.def).indexOf(q) >= 0 ||
                   norm(v.ex).indexOf(q) >= 0;
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

      grid.innerHTML = out.join('');
    }

    doRender();

    $('#vTabs').onclick = function(e){
      var b = e.target.closest('.tab');
      if(!b) return;
      $all('.tab', $('#vTabs')).forEach(function(x){ x.classList.remove('is-active'); });
      b.classList.add('is-active');
      doRender();
    };

    $('#vSearch').oninput = doRender;

    grid.onclick = function(e){
      var c = e.target.closest('.flash');
      if(!c) return;
      c.classList.toggle('is-flipped');
      speak(c.getAttribute('data-say') || '');
    };

    $('#vClear').onclick = function(){
      $('#vSearch').value = '';
      $all('.tab', $('#vTabs')).forEach(function(x, i){ x.classList.toggle('is-active', i===0); });
      doRender();
    };

    $('#vListen').onclick = function(){
      var cat = activeCat('#vTabs');
      var q = norm($('#vSearch').value);
      var list = [];

      for(var i=0; i<VOCAB.length; i++){
        var v = VOCAB[i];
        if(cat !== 'All' && v.cat !== cat) continue;
        if(q && norm(v.en).indexOf(q) < 0 && norm(v.fr).indexOf(q) < 0) continue;
        list.push(v.en);
        if(list.length >= 16) break;
      }

      if(!list.length){
        setHint('No vocab matches.');
        return;
      }

      speak(list.join('. '));
    };
  }

  // Grammar MCQ
  function renderMCQ(rootSel, bank, prefix){
    var root = $(rootSel);

    root.innerHTML = bank.map(function(q, i){
      var id = prefix + '_' + (i + 1);
      var opts = shuffle(q.opts);

      return '<div class="qItem" data-id="'+esc(id)+'" data-a="'+esc(q.a)+'">'+
        '<div class="qQ">'+esc(q.q)+'</div>'+
        '<div class="opts">'+opts.map(function(o){ return '<button class="opt" type="button" data-c="'+esc(o)+'">'+esc(o)+'</button>'; }).join('')+'</div>'+
        '<div class="wBtns" style="margin-top:10px;">'+
          '<button class="btn btn--ghost hintBtn" type="button" data-h="'+esc(q.hint || '')+'">Hint</button>'+
          '<button class="btn btn--ghost whyBtn" type="button">Why?</button>'+
        '</div>'+
        '<div class="feedback" data-fb></div>'+
        '<div class="explain" data-ex>'+esc(q.why || '')+'</div>'+
      '</div>';
    }).join('');

    $all('.qItem', root).forEach(function(it){
      var id = it.getAttribute('data-id');
      if(state.solved[id]){
        $all('.opt', it).forEach(function(b){ b.disabled = true; });
        var fb = it.querySelector('[data-fb]');
        fb.className = 'feedback good';
        fb.textContent = '✅ Already solved';
      }
    });

    root.onclick = function(e){
      var it = e.target.closest('.qItem');
      if(!it) return;

      var id = it.getAttribute('data-id');
      var ans = it.getAttribute('data-a');
      var fb = it.querySelector('[data-fb]');
      var ex = it.querySelector('[data-ex]');
      var opt = e.target.closest('.opt');
      var hint = e.target.closest('.hintBtn');
      var why = e.target.closest('.whyBtn');

      if(why){
        ex.classList.toggle('is-on');
        return;
      }

      if(hint){
        if(!state.hints){
          fb.className = 'feedback';
          fb.textContent = 'Hints are OFF.';
          return;
        }
        var h = hint.getAttribute('data-h') || '';
        fb.className = 'feedback';
        fb.textContent = '💡 ' + h;
        setHint(h);
        return;
      }

      if(!opt) return;

      var ch = opt.getAttribute('data-c');

      if(ch === ans){
        opt.classList.add('is-right');
        fb.className = 'feedback good';
        fb.textContent = '✅ Correct!';
        $all('.opt', it).forEach(function(b){ b.disabled = true; });
        if((ex.textContent || '').trim()) ex.classList.add('is-on');
        if(!state.solved[id]) markSolved(id, 1);
        speak(ans);
      } else {
        opt.classList.add('is-wrong');
        fb.className = 'feedback bad';
        fb.textContent = '❌ Not yet. Try again.';
      }
    };
  }

  function renderGrammarTabs(){
    var root = $('#gTabs');

    root.innerHTML = GRAMMAR.map(function(c, i){
      return '<button class="tab '+(i===0?'is-active':'')+'" type="button" data-k="'+esc(c.key)+'">'+esc(c.icon)+' '+esc(c.title)+'</button>';
    }).join('');

    root.onclick = function(e){
      var b = e.target.closest('.tab');
      if(!b) return;
      $all('.tab', root).forEach(function(x){ x.classList.remove('is-active'); });
      b.classList.add('is-active');
      renderGrammarCard(b.getAttribute('data-k'));
    };

    renderGrammarCard(GRAMMAR[0].key);
  }

  function renderGrammarCard(key){
    var c = GRAMMAR[0];

    for(var i=0; i<GRAMMAR.length; i++){
      if(GRAMMAR[i].key === key){
        c = GRAMMAR[i];
        break;
      }
    }

    var panel = $('#gPanel');
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

    $('#gListen').onclick = function(){ speak(c.examples.join(' ')); };
    renderMCQ('#gQuiz', c.quiz, 'mcq_g_' + c.key);
  }

  // Rewrite warm-up
  function renderRewrite(){
    var root = $('#rwBox');
    var pool = [];

    REWRITE.forEach(function(x){
      x.answers.forEach(function(a){
        if(pool.indexOf(a) === -1) pool.push(a);
      });
    });

    root.innerHTML = REWRITE.map(function(item){
      var id = 'rw_' + item.id;
      var distract = shuffle(pool.filter(function(x){ return item.answers.indexOf(x) === -1; })).slice(0, 2);
      var choices = shuffle(item.answers.concat(distract));

      return '<div class="qItem" data-id="'+esc(id)+'">'+
        '<div class="qQ">'+esc(item.icon)+' '+esc(item.prompt)+'</div>'+
        '<div class="opts">'+choices.map(function(c){ return '<button class="opt tenseOpt" type="button" data-c="'+esc(c)+'">'+esc(c)+'</button>'; }).join('')+'</div>'+
        '<div class="wBtns" style="margin-top:10px;">'+
          '<button class="btn btn--ghost hintBtn" type="button" data-h="'+esc(item.hint)+'">Hint</button>'+
        '</div>'+
        '<div class="feedback" data-fb></div>'+
      '</div>';
    }).join('');

    $all('.qItem', root).forEach(function(it){
      var id = it.getAttribute('data-id');

      if(state.solved[id]){
        $all('.tenseOpt', it).forEach(function(b){ b.disabled = true; });
        var fb = it.querySelector('[data-fb]');
        fb.className = 'feedback good';
        fb.textContent = '✅ Solved';
      }
    });

    root.onclick = function(e){
      var it = e.target.closest('.qItem');
      if(!it) return;

      var id = it.getAttribute('data-id');
      var fb = it.querySelector('[data-fb]');
      var hint = e.target.closest('.hintBtn');

      var item = null;
      for(var i=0; i<REWRITE.length; i++){
        if('rw_' + REWRITE[i].id === id){
          item = REWRITE[i];
          break;
        }
      }

      if(!item) return;

      if(hint){
        if(!state.hints){
          fb.className = 'feedback';
          fb.textContent = 'Hints are OFF.';
          return;
        }
        var h = hint.getAttribute('data-h') || '';
        fb.className = 'feedback';
        fb.textContent = '💡 ' + h;
        setHint(h);
        return;
      }

      var opt = e.target.closest('.tenseOpt');
      if(!opt) return;

      var chosen = opt.getAttribute('data-c') || '';
      var ok = false;

      for(var j=0; j<item.answers.length; j++){
        var a = item.answers[j];
        if(norm(a.replace(/^'/,'')) === norm(chosen.replace(/^'/,''))){
          ok = true;
          break;
        }
      }

      if(ok){
        opt.classList.add('is-right');
        fb.className = 'feedback good';
        fb.textContent = '✅ Correct!';
        $all('.tenseOpt', it).forEach(function(b){ b.disabled = true; });
        if(!state.solved[id]) markSolved(id, 1);
        speak(chosen);
      } else {
        opt.classList.add('is-wrong');
        fb.className = 'feedback bad';
        fb.textContent = '❌ Not yet.';
      }
    };
  }

  // Writing Studio
  function setChips(rootId, words){
    var root = $(rootId);
    root.innerHTML = (words || []).map(function(w){
      return '<span class="chip">✨ '+esc(w)+'</span>';
    }).join('');
  }

  function getTaskById(id){
    for(var i=0; i<TASKS.length; i++){
      if(TASKS[i].id === id) return TASKS[i];
    }
    return TASKS[0];
  }

  function populateTaskSelect(){
    var sel = $('#taskSelect');
    sel.innerHTML = TASKS.map(function(t){
      return '<option value="'+esc(t.id)+'">'+esc(t.title)+'</option>';
    }).join('');
  }

  function populateLevelSelect(task, keepIndex){
    var sel = $('#levelSelect');
    sel.innerHTML = task.levels.map(function(l, idx){
      return '<option value="'+idx+'">'+esc(l.level)+'</option>';
    }).join('');

    if(typeof keepIndex === 'number' && task.levels[keepIndex]){
      sel.value = String(keepIndex);
    }
  }

  function getCurrentLevel(){
    var idx = parseInt($('#levelSelect').value || '0', 10);
    return curTask.levels[idx] || curTask.levels[0];
  }

  function updateCompareBoxes(){
    if(!curLevel) return;

    $('#basicBox').textContent = curLevel.model_v1 || '';
    $('#upgradeBox').textContent = curLevel.model_v2 || '';

    $('#whyList').innerHTML = [
      'The upgraded model follows the writing level selected in section 3.',
      'It keeps the same task and story/topic.',
      'It adds detail, smoother connectors and more natural wording.',
      'Use the model to improve your own paragraph step by step.'
    ].map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('');
  }

  function renderStudio(keepLevel){
    var taskId = $('#taskSelect').value;
    var oldIdx = parseInt($('#levelSelect').value || '0', 10);

    curTask = getTaskById(taskId);

    if(!keepLevel){
      oldIdx = 0;
    }

    populateLevelSelect(curTask, oldIdx);
    curLevel = getCurrentLevel();

    $('#taskScenario').textContent = 'Scenario: ' + curTask.scenario;
    $('#taskSteps').innerHTML = (curLevel.steps || []).map(function(s){
      return '<li>'+esc(s)+'</li>';
    }).join('') || '<li>Write your best version.</li>';

    $('#taskFrame').innerHTML = (curLevel.frame || []).map(function(s){
      return '<li>'+esc(s)+'</li>';
    }).join('') || '<li>— No frame for this level.</li>';

    setChips('#taskVocab', curTask.new_vocab);

    $('#wFb').className = 'feedback';
    $('#wFb').textContent = 'Write your text, then click Check.';
    $('#wChecklist').innerHTML = '';
    $('#wModelBox').textContent = 'Click a model button to reveal.';

    updateCompareBoxes();
  }

  function countRegexAny(text, patterns){
    var c = 0;

    for(var i=0; i<patterns.length; i++){
      try {
        var re = new RegExp(patterns[i], 'i');
        if(re.test(text)) c++;
      } catch(e){}
    }

    return c;
  }

  function checkWriting(){
    var txt = $('#wText').value.trim();
    var fb = $('#wFb');

    if(!curLevel){
      fb.className = 'feedback bad';
      fb.textContent = '❌ Choose a task and level first.';
      return;
    }

    if(!txt){
      fb.className = 'feedback bad';
      fb.textContent = '❌ Please write something first.';
      return;
    }

    var checks = curLevel.checks || [];
    var results = [];

    for(var i=0; i<checks.length; i++){
      var ch = checks[i];
      var ok = false;

      if(ch.re_any){
        ok = countRegexAny(txt, ch.re_any) >= (ch.min || 1);
      } else if(ch.re){
        try {
          ok = new RegExp(ch.re, 'i').test(txt);
        } catch(e){
          ok = false;
        }
      }

      results.push({label: ch.label, ok: ok});
    }

    if(!results.length){
      results.push({label:'Text written', ok:true});
    }

    $('#wChecklist').innerHTML = results.map(function(r){
      return '<div class="chk '+(r.ok?'ok':'bad')+'"><div class="dot"></div><div>'+esc(r.label)+' '+(r.ok?'<small>OK</small>':'<small>Missing</small>')+'</div></div>';
    }).join('');

    var allOk = true;
    for(var j=0; j<results.length; j++){
      if(!results[j].ok) allOk = false;
    }

    var id = 'write_' + curTask.id + '_' + curLevel.level.replace(/\s+/g, '_');

    if(allOk){
      fb.className = 'feedback good';
      fb.textContent = '✅ Great! Your text matches the goal. Now compare it with the simple model and upgraded model.';
      if(!state.solved[id]) markSolved(id, 3);
    } else {
      fb.className = 'feedback bad';
      fb.textContent = '❌ Not complete yet. Check the missing items and try again.';
    }
  }

  function initStudio(){
    populateTaskSelect();
    renderStudio(false);

    $('#taskSelect').onchange = function(){
      renderStudio(false);
    };

    $('#levelSelect').onchange = function(){
      curLevel = getCurrentLevel();

      $('#taskSteps').innerHTML = (curLevel.steps || []).map(function(s){
        return '<li>'+esc(s)+'</li>';
      }).join('') || '<li>Write your best version.</li>';

      $('#taskFrame').innerHTML = (curLevel.frame || []).map(function(s){
        return '<li>'+esc(s)+'</li>';
      }).join('') || '<li>— No frame for this level.</li>';

      $('#wFb').className = 'feedback';
      $('#wFb').textContent = 'Level changed. Write your text, then click Check.';
      $('#wChecklist').innerHTML = '';
      $('#wModelBox').textContent = 'Click a model button to reveal.';

      updateCompareBoxes();
    };

    $('#wCheck').onclick = checkWriting;

    $('#wHint').onclick = function(){
      var fb = $('#wFb');

      if(!state.hints){
        fb.className = 'feedback';
        fb.textContent = 'Hints are OFF.';
        return;
      }

      var tip = (curLevel.steps || []).slice(0, 3).join(' • ') || 'Use the frame and the new vocabulary.';
      fb.className = 'feedback';
      fb.textContent = '💡 ' + tip;
      setHint(tip);
    };

    $('#wModel1').onclick = function(){
      $('#wModelBox').textContent = curLevel.model_v1 || 'No simple model for this level.';
    };

    $('#wModel2').onclick = function(){
      $('#wModelBox').textContent = curLevel.model_v2 || 'No upgraded model for this level.';
    };

    $('#wListen').onclick = function(){
      var txt = $('#wText').value.trim();
      if(!txt){
        setHint('Write something first.');
        return;
      }
      speak(txt);
    };

    $('#wCopy').onclick = function(){
      var ta = $('#wText');
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy');
        setHint('Copied!');
      } catch(e){
        setHint('Copy failed.');
      }
    };

    $('#wReset').onclick = function(){
      if(!confirm('Reset your text for this task?')) return;
      $('#wText').value = '';
      $('#wFb').className = 'feedback';
      $('#wFb').textContent = 'Reset done. Write again.';
      $('#wChecklist').innerHTML = '';
      $('#wModelBox').textContent = 'Click a model button to reveal.';
    };

    $('#basicListen').onclick = function(){ speak($('#basicBox').textContent); };
    $('#upgradeListen').onclick = function(){ speak($('#upgradeBox').textContent); };
    $('#basicCopy').onclick = function(){ copyText($('#basicBox').textContent); };
    $('#upgradeCopy').onclick = function(){ copyText($('#upgradeBox').textContent); };

    function copyText(t){
      var temp = document.createElement('textarea');
      temp.value = t;
      document.body.appendChild(temp);
      temp.select();

      try {
        document.execCommand('copy');
        setHint('Copied!');
      } catch(e){
        setHint('Copy failed.');
      }

      document.body.removeChild(temp);
    }
  }

  function computeTotal(){
    var q = 0;
    q += REWRITE.length;

    for(var i=0; i<GRAMMAR.length; i++){
      q += GRAMMAR[i].quiz ? GRAMMAR[i].quiz.length : 0;
    }

    for(var t=0; t<TASKS.length; t++){
      q += TASKS[t].levels ? TASKS[t].levels.length * 3 : 0;
    }

    return q;
  }

  function init(){
    initTop();
    renderVocab();
    renderGrammarTabs();
    renderRewrite();
    initStudio();

    totalPoints = computeTotal();
    updateHud();

    setHint('Tip: choose a writing level, write, check, then compare with the model and upgraded model.');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
