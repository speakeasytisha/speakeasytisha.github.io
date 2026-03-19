(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
  const STORE_KEY = 'SET_future_toolkit_family_youth_animals_A2_v1';

  function deepClone(o){return JSON.parse(JSON.stringify(o));}
  function norm(s){return String(s||'').trim().toLowerCase().replace(/\s+/g,' ');}
  function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function shuffle(arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

  const DEFAULT_STATE={score:0,streak:0,accent:'US',speed:'normal',hints:true,level:'A2',solved:{}};
  let state=loadState();

  function loadState(){
    try{
      const raw=localStorage.getItem(STORE_KEY);
      if(!raw) return deepClone(DEFAULT_STATE);
      const p=JSON.parse(raw);
      return {...deepClone(DEFAULT_STATE),...p,solved:p.solved||{}};
    }catch(e){return deepClone(DEFAULT_STATE);}
  }
  function saveState(){localStorage.setItem(STORE_KEY,JSON.stringify(state));}
  function setHint(t){const el=$('#hintBox'); if(el) el.textContent=t;}

  // Speech
  let voiceCache=[];
  function refreshVoices(){voiceCache=('speechSynthesis'in window)?speechSynthesis.getVoices():[];}
  if('speechSynthesis'in window){refreshVoices();speechSynthesis.onvoiceschanged=refreshVoices;}
  function pickVoice(){
    const want=state.accent==='UK'?['en-GB','en_GB']:['en-US','en_US'];
    return (voiceCache||[]).find(v=>want.includes(v.lang))||(voiceCache||[]).find(v=>(v.lang||'').toLowerCase().startsWith('en'))||null;
  }
  function speak(text){
    if(!('speechSynthesis'in window))return;
    try{
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(text);
      const v=pickVoice();
      if(v) u.voice=v;
      u.rate=(state.speed==='slow')?0.78:0.95;
      speechSynthesis.speak(u);
    }catch(e){}
  }
  function stopSpeak(){if('speechSynthesis'in window) speechSynthesis.cancel();}

  // Score
  let TOTAL=0;
  function markSolved(id,pts=1){
    if(state.solved[id]) return false;
    state.solved[id]=true;
    state.score+=pts;
    state.streak+=1;
    saveState();
    updateHud();
    return true;
  }
  function markWrong(){state.streak=0;saveState();updateHud();}
  function updateHud(){
    const s=$('#scoreNow'), t=$('#scoreTotal'), st=$('#streakNow'), pp=$('#progressPct'), pb=$('#progressBar');
    if(s) s.textContent=String(state.score);
    if(st) st.textContent=String(state.streak);
    if(t) t.textContent=String(TOTAL);
    const pct=TOTAL?Math.round((state.score/TOTAL)*100):0;
    if(pp) pp.textContent=pct+'%';
    if(pb) pb.style.width=clamp(pct,0,100)+'%';
  }

  function applyPrefs(){
    const set=(id,on)=>{const el=$(id); if(el) el.classList.toggle('is-active',!!on);};
    set('#accentUS',state.accent==='US'); set('#accentUK',state.accent==='UK');
    set('#speedNormal',state.speed==='normal'); set('#speedSlow',state.speed==='slow');
    set('#hintsOn',!!state.hints); set('#hintsOff',!state.hints);
    const ls=$('#levelSelect'); if(ls) ls.value=state.level;
    document.body.dataset.level = state.level;
  }

  function hookTopbar(){
    $('#btnPrint')?.addEventListener('click',()=>window.print());
    $('#btnResetAll')?.addEventListener('click',()=>{
      if(!confirm('Reset ALL progress for this lesson?')) return;
      localStorage.removeItem(STORE_KEY);
      location.reload();
    });

    $('#btnResetPractice')?.addEventListener('click',()=>{
      if(!confirm('Reset Practice + Dialogue + Ensemble (to try again)?')) return;
      resetPractice();
    });

    $('#accentUS')?.addEventListener('click',()=>{state.accent='US';saveState();applyPrefs();setHint('Accent set to US.');});
    $('#accentUK')?.addEventListener('click',()=>{state.accent='UK';saveState();applyPrefs();setHint('Accent set to UK.');});
    $('#speedNormal')?.addEventListener('click',()=>{state.speed='normal';saveState();applyPrefs();setHint('Speed: normal.');});
    $('#speedSlow')?.addEventListener('click',()=>{state.speed='slow';saveState();applyPrefs();setHint('Speed: slow.');});
    $('#hintsOn')?.addEventListener('click',()=>{state.hints=true;saveState();applyPrefs();setHint('Hints ON.');});
    $('#hintsOff')?.addEventListener('click',()=>{state.hints=false;saveState();applyPrefs();setHint('Hints OFF.');});

    $('#levelSelect')?.addEventListener('change',(e)=>{
      state.level = e.target.value;
      saveState();
      applyPrefs();
      setHint('Level set. Try Ensemble after the Practice Zone.');
    });

    // Listen buttons (no auto)
    document.addEventListener('click',(e)=>{
      const b=e.target.closest('.speakBtn');
      if(!b) return;
      const t=b.dataset.say||'';
      if(t) speak(t);
    });

    $('#btnStopSpeak')?.addEventListener('click',stopSpeak);
  }

  // Data injected
  const VOCAB=[{"cat": "Family & travel", "icon": "👨‍👩‍👧‍👦", "en": "my son", "fr": "mon fils", "def": "your male child", "ex": "My son lives in Denmark."}, {"cat": "Family & travel", "icon": "💍", "en": "wife", "fr": "épouse", "def": "a married woman", "ex": "His wife is German."}, {"cat": "Family & travel", "icon": "👩‍🦰", "en": "daughter-in-law", "fr": "belle-fille", "def": "your son’s wife", "ex": "My daughter-in-law is very welcoming."}, {"cat": "Family & travel", "icon": "DK", "en": "Denmark", "fr": "le Danemark", "def": "a country in Northern Europe", "ex": "They live in Denmark."}, {"cat": "Family & travel", "icon": "🏙️", "en": "Copenhagen", "fr": "Copenhague", "def": "the capital city of Denmark", "ex": "We’re flying to Copenhagen."}, {"cat": "Family & travel", "icon": "✈️", "en": "flight", "fr": "vol", "def": "a trip by plane", "ex": "My flight is on Friday."}, {"cat": "Family & travel", "icon": "🎟️", "en": "ticket", "fr": "billet", "def": "a pass for travel", "ex": "I’ll buy the tickets online."}, {"cat": "Family & travel", "icon": "🧳", "en": "to visit", "fr": "rendre visite", "def": "to go see someone", "ex": "I’m going to visit them in July."}, {"cat": "Family & travel", "icon": "📆", "en": "next month", "fr": "le mois prochain", "def": "the month after this month", "ex": "I’m going next month."}, {"cat": "Family & travel", "icon": "🕒", "en": "in July", "fr": "en juillet", "def": "during the month of July", "ex": "We’re travelling in July."}, {"cat": "Family & travel", "icon": "📌", "en": "on Saturday", "fr": "samedi", "def": "on a day", "ex": "I’m meeting them on Saturday."}, {"cat": "Family & travel", "icon": "⏰", "en": "at 3 pm", "fr": "à 15h", "def": "at a specific time", "ex": "Let’s call at 3 pm."}, {"cat": "Youth support", "icon": "🧑‍⚖️", "en": "to assist the judge", "fr": "assister le juge", "def": "to support the judge with information or follow‑up", "ex": "I may assist the judge with a report."}, {"cat": "Youth support", "icon": "📝", "en": "assessment", "fr": "évaluation", "def": "a careful evaluation", "ex": "I write an assessment after the meeting."}, {"cat": "Youth support", "icon": "📋", "en": "case file", "fr": "dossier", "def": "documents about one situation", "ex": "I read the case file before court."}, {"cat": "Youth support", "icon": "👂", "en": "to listen carefully", "fr": "écouter attentivement", "def": "to listen with attention", "ex": "I listen carefully to the young person."}, {"cat": "Youth support", "icon": "🤝", "en": "support plan", "fr": "plan d’accompagnement", "def": "plan to help someone progress", "ex": "We create a support plan together."}, {"cat": "Youth support", "icon": "🏛️", "en": "court hearing", "fr": "audience", "def": "a meeting in court", "ex": "The court hearing is next week."}, {"cat": "Youth support", "icon": "📅", "en": "follow‑up appointment", "fr": "rendez‑vous de suivi", "def": "a later meeting to check progress", "ex": "I have a follow‑up appointment on Tuesday."}, {"cat": "Youth support", "icon": "🌱", "en": "progress", "fr": "progrès", "def": "improvement over time", "ex": "We focus on progress, step by step."}, {"cat": "Youth support", "icon": "🛡️", "en": "to protect", "fr": "protéger", "def": "to keep someone safe", "ex": "The goal is to protect the child."}, {"cat": "Youth support", "icon": "💬", "en": "to encourage", "fr": "encourager", "def": "to give support and confidence", "ex": "I encourage them to keep going."}, {"cat": "Animal rescue", "icon": "🐿️", "en": "squirrel", "fr": "écureuil", "def": "a small wild animal with a bushy tail", "ex": "We treated a squirrel today."}, {"cat": "Animal rescue", "icon": "🦫", "en": "groundhog", "fr": "marmotte / siffleux", "def": "a large burrowing rodent", "ex": "A groundhog needs a check‑up."}, {"cat": "Animal rescue", "icon": "🦔", "en": "hedgehog", "fr": "hérisson", "def": "a small animal with spines", "ex": "We helped an injured hedgehog."}, {"cat": "Animal rescue", "icon": "🐦", "en": "injured bird", "fr": "oiseau blessé", "def": "a bird that is hurt", "ex": "We received an injured bird."}, {"cat": "Animal rescue", "icon": "🩺", "en": "vet clinic", "fr": "cabinet vétérinaire", "def": "a place where a vet treats animals", "ex": "I volunteer at a vet clinic."}, {"cat": "Animal rescue", "icon": "🧼", "en": "to clean a wound", "fr": "nettoyer une plaie", "def": "to clean an injury", "ex": "We clean the wound carefully."}, {"cat": "Animal rescue", "icon": "💊", "en": "medicine", "fr": "médicament", "def": "a treatment", "ex": "The vet gives medicine."}, {"cat": "Animal rescue", "icon": "🧤", "en": "gloves", "fr": "gants", "def": "hand protection", "ex": "I wear gloves to stay safe."}, {"cat": "Animal rescue", "icon": "🧺", "en": "carrier", "fr": "cage de transport", "def": "a box to transport an animal", "ex": "Put the animal in a carrier."}, {"cat": "Animal rescue", "icon": "🏥", "en": "to treat", "fr": "soigner", "def": "to give medical care", "ex": "We treat small animals gently."}, {"cat": "Useful words", "icon": "⭐", "en": "rewarding", "fr": "gratifiant", "def": "giving satisfaction", "ex": "This work is rewarding."}, {"cat": "Useful words", "icon": "🧠", "en": "challenging", "fr": "difficile / exigeant", "def": "not easy", "ex": "It can be challenging."}, {"cat": "Useful words", "icon": "💡", "en": "to improve", "fr": "améliorer", "def": "to get better", "ex": "I want to improve my English."}, {"cat": "Useful words", "icon": "🧩", "en": "responsibility", "fr": "responsabilité", "def": "a duty you must do", "ex": "I have a lot of responsibility."}, {"cat": "Useful words", "icon": "📣", "en": "clear communication", "fr": "communication claire", "def": "easy to understand communication", "ex": "Clear communication is important."}, {"cat": "Useful words", "icon": "🧷", "en": "step by step", "fr": "petit à petit", "def": "little by little", "ex": "I learn step by step."}];
  const MCQ_GOING=[{"q": "Plan (intention):", "opts": ["I’m going to visit in July.", "I will going to visit in July.", "I’m going visit in July."], "a": "I’m going to visit in July.", "hint": "am/is/are + going to + base verb", "why": "Use going to for plans: I’m going to visit."}, {"q": "Negative (plan):", "opts": ["I’m not going to stay long.", "I don’t going to stay long.", "I’m not going stay long."], "a": "I’m not going to stay long.", "hint": "not goes after am/is/are", "why": "I’m not going to + verb."}, {"q": "Question (plan):", "opts": ["Are you going to call your son?", "Do you going to call your son?", "Are you going call your son?"], "a": "Are you going to call your son?", "hint": "Are + subject + going to + verb", "why": "Question form: Are you going to…?"}];
  const MCQ_WILL=[{"q": "Decision now:", "opts": ["OK, I’ll call him now.", "OK, I’m going to call him yesterday.", "OK, I’ll to call him now."], "a": "OK, I’ll call him now.", "hint": "will + base verb", "why": "Quick decision: I’ll call him now."}, {"q": "Offer help:", "opts": ["I’ll send you the details.", "I’m going to sent you the details.", "I will sending you the details."], "a": "I’ll send you the details.", "hint": "will + base verb", "why": "Offer: I’ll send… (no -ing)."}, {"q": "Prediction:", "opts": ["It will be cold in Denmark.", "It will cold in Denmark.", "It is be cold in Denmark."], "a": "It will be cold in Denmark.", "hint": "will + be + adjective", "why": "Prediction: will + be."}];
  const MCQ_ARR=[{"q": "Arrangement with date:", "opts": ["I’m meeting them on Saturday.", "I meet them on Saturday (arranged).", "I will meeting them on Saturday."], "a": "I’m meeting them on Saturday.", "hint": "present continuous + time", "why": "Arranged event: I’m meeting them on Saturday."}, {"q": "Arrangement (schedule):", "opts": ["I’m volunteering at the vet clinic on Tuesday.", "I volunteer at the vet clinic on Tuesday (arranged).", "I’m going volunteer at the vet clinic on Tuesday."], "a": "I’m volunteering at the vet clinic on Tuesday.", "hint": "am/is/are + verb‑ing", "why": "For a booked plan: I’m volunteering…"}, {"q": "Correct question:", "opts": ["What time are you leaving?", "What time you are leaving?", "What time do you leaving?"], "a": "What time are you leaving?", "hint": "are + subject + verb‑ing", "why": "Present continuous question form."}];
  const MCQ_TIME=[{"q": "After / when rule:", "opts": ["When I arrive, I’ll call you.", "When I will arrive, I’ll call you.", "When I arrive, I will calling you."], "a": "When I arrive, I’ll call you.", "hint": "No will after when", "why": "Time clause uses present: arrive."}, {"q": "Before rule:", "opts": ["Before I go to court, I read the file.", "Before I will go to court, I read the file.", "Before I go to court, I will reading the file."], "a": "Before I go to court, I read the file.", "hint": "present after before", "why": "Use present after before/after/when."}, {"q": "Until rule:", "opts": ["I’ll stay until the meeting ends.", "I’ll stay until the meeting will end.", "I’ll stay until the meeting ending."], "a": "I’ll stay until the meeting ends.", "hint": "present after until", "why": "After until, use present: ends."}];
  const MCQ_MIGHT=[{"q": "Possibility:", "opts": ["I might write the report tonight.", "I will might write the report tonight.", "I’m might write the report tonight."], "a": "I might write the report tonight.", "hint": "might + base verb", "why": "Might expresses possibility: might write."}, {"q": "Possibility (negative):", "opts": ["I might not have time tomorrow.", "I don’t might have time tomorrow.", "I might not to have time tomorrow."], "a": "I might not have time tomorrow.", "hint": "might not + verb", "why": "Negative: might not + verb."}, {"q": "Choose the best:", "opts": ["We may meet at 3 pm.", "We are may meet at 3 pm.", "We may meeting at 3 pm."], "a": "We may meet at 3 pm.", "hint": "may + base verb", "why": "May + base verb (meet)."}];

  const PRACTICE_MCQ=[{"q": "Choose the best plan (family):", "opts": ["I’m going to visit my son next month.", "I’m going visit my son next month.", "I will going to visit my son next month."], "a": "I’m going to visit my son next month.", "hint": "going to + verb", "why": "Planned intention: I’m going to visit…"}, {"q": "Offer help (travel):", "opts": ["I’ll book the flight tonight.", "I’ll to book the flight tonight.", "I’m book the flight tonight."], "a": "I’ll book the flight tonight.", "hint": "will + base verb", "why": "Offer/decision: I’ll book…"}, {"q": "Arrangement (volunteer):", "opts": ["I’m volunteering at the vet clinic on Tuesday.", "I volunteer at the vet clinic on Tuesday (arranged).", "I’m going to volunteering at the vet clinic."], "a": "I’m volunteering at the vet clinic on Tuesday.", "hint": "present continuous arrangement", "why": "Booked schedule: I’m volunteering…"}, {"q": "Time clause:", "opts": ["When I finish, I’ll send the report.", "When I will finish, I’ll send the report.", "When I finish, I’ll sending the report."], "a": "When I finish, I’ll send the report.", "hint": "no will after when", "why": "Finish is present in the clause."}, {"q": "Possessive adjective:", "opts": ["Their home is in Denmark.", "There home is in Denmark.", "They home is in Denmark."], "a": "Their home is in Denmark.", "hint": "their + noun", "why": "Their = belongs to them."}, {"q": "’s possession:", "opts": ["my son’s wife", "my sons wife", "my son wife’s"], "a": "my son’s wife", "hint": "person + ’s", "why": "Use ’s for people: my son’s wife."}, {"q": "Preposition (month):", "opts": ["in July", "on July", "at July"], "a": "in July", "hint": "months → in", "why": "In July."}, {"q": "Preposition (day):", "opts": ["on Saturday", "in Saturday", "at Saturday"], "a": "on Saturday", "hint": "days → on", "why": "On Saturday."}, {"q": "Preposition (time):", "opts": ["at 3 pm", "in 3 pm", "on 3 pm"], "a": "at 3 pm", "hint": "time → at", "why": "At 3 pm."}, {"q": "Verb + preposition:", "opts": ["I volunteer at a vet clinic.", "I volunteer on a vet clinic.", "I volunteer to a vet clinic."], "a": "I volunteer at a vet clinic.", "hint": "volunteer at a place", "why": "At = place."}, {"q": "Possibility:", "opts": ["I might have a meeting tomorrow.", "I will might have a meeting tomorrow.", "I might to have a meeting tomorrow."], "a": "I might have a meeting tomorrow.", "hint": "might + base", "why": "Might + have."}, {"q": "Correct question:", "opts": ["Are you going to work with juveniles?", "Do you going to work with juveniles?", "Are you going work with juveniles?"], "a": "Are you going to work with juveniles?", "hint": "Are + going to", "why": "Are you going to…?"}];
  const FIB=[{"id": "fib1", "sent": "I’m going to ____ my son next month.", "a": "visit", "hint": "going to + base verb"}, {"id": "fib2", "sent": "OK, I’ll ____ the tickets tonight.", "a": "book", "hint": "will + base verb"}, {"id": "fib3", "sent": "I’m meeting them ____ Saturday.", "a": "on", "hint": "days → on"}, {"id": "fib4", "sent": "We’re flying ____ July.", "a": "in", "hint": "months → in"}, {"id": "fib5", "sent": "Let’s call ____ 3 pm.", "a": "at", "hint": "time → at"}, {"id": "fib6", "sent": "This is my ____ wife (daughter‑in‑law).", "a": "son’s", "hint": "person + ’s"}, {"id": "fib7", "sent": "When I ____ , I’ll text you.", "a": "arrive", "hint": "present after when"}, {"id": "fib8", "sent": "I volunteer ____ a vet clinic.", "a": "at", "hint": "place → at"}];
  const DND=[{"t": "going to", "cat": "future"}, {"t": "will", "cat": "future"}, {"t": "might", "cat": "future"}, {"t": "I’m meeting", "cat": "future"}, {"t": "next week", "cat": "time"}, {"t": "next month", "cat": "time"}, {"t": "in July", "cat": "time"}, {"t": "on Saturday", "cat": "time"}, {"t": "at 3 pm", "cat": "time"}, {"t": "my", "cat": "poss"}, {"t": "their", "cat": "poss"}, {"t": "my son’s", "cat": "poss"}, {"t": "her", "cat": "poss"}, {"t": "at the vet clinic", "cat": "place"}, {"t": "in Denmark", "cat": "place"}, {"t": "at court", "cat": "place"}, {"t": "to Copenhageni", "cat": "place"}];
  const DIALOGUES={"family": [{"npc": "So… when are you going to visit your son again?", "choices": ["I’m going to visit next month. 🧳", "I will going to visit next month.", "I’m going visit next month."], "correct": 0, "hint": "Plan → going to", "why": "Use going to for a planned intention."}, {"npc": "Great! How long are you going to stay?", "choices": ["I’m going to stay for one week.", "I’m going to stay on one week.", "I will staying for one week."], "correct": 0, "hint": "for + duration", "why": "Duration uses for: for one week."}, {"npc": "What time are you leaving?", "choices": ["I’m leaving at 7 am.", "I leave in 7 am.", "I’m leaving on 7 am."], "correct": 0, "hint": "clock time → at", "why": "At 7 am is correct."}, {"npc": "Can you call me when you arrive?", "choices": ["Yes. When I arrive, I’ll call you.", "Yes. When I will arrive, I’ll call you.", "Yes. When I arrive, I’ll calling you."], "correct": 0, "hint": "No will after when", "why": "Time clause uses present: arrive."}, {"npc": "Will you stay at their home or in a hotel?", "choices": ["I’m staying at their home. It’s easier.", "I’m staying to their home.", "I’m staying on their home."], "correct": 0, "hint": "stay at + place", "why": "At their home = natural."}, {"npc": "Perfect. What will you do first?", "choices": ["I’ll have dinner with them.", "I’ll to have dinner with them.", "I’m have dinner with them."], "correct": 0, "hint": "will + base verb", "why": "Will + have (base)."}], "animals": [{"npc": "What are you doing tomorrow at the vet clinic?", "choices": ["I’m volunteering at the vet clinic in the morning. 🩺", "I volunteer at the vet clinic in the morning (arranged).", "I’m going volunteer at the vet clinic."], "correct": 0, "hint": "Arrangement → present continuous", "why": "Use present continuous for a scheduled plan."}, {"npc": "What small animals do you treat?", "choices": ["We often treat squirrels and injured birds.", "We often treat squirrel and injured bird.", "We often treating squirrels and injured birds."], "correct": 0, "hint": "plural nouns", "why": "General statement: squirrels, birds."}, {"npc": "What will you do first when an animal arrives?", "choices": ["I’ll check the animal and call the vet.", "I’ll checking the animal and call the vet.", "I’m going check the animal and call the vet."], "correct": 0, "hint": "will + base", "why": "Decision/action: I’ll check…"}, {"npc": "What do you wear for safety?", "choices": ["I wear gloves to stay safe.", "I wear glove to stay safe.", "I wearing gloves to stay safe."], "correct": 0, "hint": "plural gloves", "why": "Gloves is plural."}, {"npc": "How do you transport the animal?", "choices": ["We put it in a carrier.", "We put it on a carrier.", "We put it to a carrier."], "correct": 0, "hint": "in a container", "why": "In a carrier = inside."}, {"npc": "Is it difficult sometimes?", "choices": ["Yes, it can be challenging, but it’s rewarding.", "Yes, it can be challenge, but it’s reward.", "Yes, it can be challenging, but it’s reward."], "correct": 0, "hint": "adjectives", "why": "challenging / rewarding are adjectives."}], "youth": [{"npc": "What is your role with young people?", "choices": ["I do assessments and follow‑ups to support progress. 🌱", "I do assessment and follow‑ups to support progress.", "I’m do assessments and follow‑ups."], "correct": 0, "hint": "plural / correct verb", "why": "Assessments (plural) and follow‑ups."}, {"npc": "Do you have a meeting next week?", "choices": ["Yes, I might have a meeting at court next week.", "Yes, I will might have a meeting next week.", "Yes, I might to have a meeting next week."], "correct": 0, "hint": "might + base", "why": "Might + have (base verb)."}, {"npc": "What do you do before a hearing?", "choices": ["Before I go to court, I read the case file.", "Before I will go to court, I read the case file.", "Before I go to court, I will reading the file."], "correct": 0, "hint": "present after before", "why": "Time clause uses present after before."}, {"npc": "What will you write after the meeting?", "choices": ["I’ll write a short assessment report.", "I’ll writing a short assessment report.", "I’ll to write a short assessment report."], "correct": 0, "hint": "will + base", "why": "Will + write."}, {"npc": "How do you speak to the young person?", "choices": ["I listen carefully and I encourage them.", "I listen careful and I encourage them.", "I listen carefully and I encourage."], "correct": 0, "hint": "adverb carefully", "why": "Carefully is an adverb."}, {"npc": "What is the goal?", "choices": ["The goal is to protect the child and support progress.", "The goal is protect the child and support progress.", "The goal is to protect the child and support progresses."], "correct": 0, "hint": "to + verb", "why": "To protect / to support."}]};
  const ENSEMBLE_CHECKS=[{"key": "goingTo", "label": "✅ at least 1 “going to” plan", "pattern": "\\bgoing to\\b"}, {"key": "will", "label": "✅ at least 1 “will” decision/offer", "pattern": "\\bI'll\\b|\\bI will\\b|\\bwill\\b"}, {"key": "arrangement", "label": "✅ 1 arrangement (I’m meeting / I’m volunteering)", "pattern": "\\bI'm meeting\\b|\\bI’m meeting\\b|\\bI'm volunteering\\b|\\bI’m volunteering\\b"}, {"key": "timeClause", "label": "✅ 1 time clause (When/After/Before/Until + present)", "pattern": "\\bWhen I\\b|\\bAfter I\\b|\\bBefore I\\b|\\bUntil\\b"}, {"key": "poss", "label": "✅ 1 possessive (my son’s / their / my)", "pattern": "son’s|their|my "}, {"key": "preps", "label": "✅ 2 prepositions (in/on/at/to/from/with)", "pattern": "\\b(in|on|at|to|from|with)\\b"}];

  // Generic MCQ renderer
  function renderMCQ(rootSel, bank, prefix){
    const root=$(rootSel); if(!root) return;
    root.innerHTML=bank.map((q,i)=>{
      const id=`${prefix}_${i+1}`;
      const opts=shuffle(q.opts);
      return `
        <div class="qItem" data-id="${esc(id)}" data-answer="${esc(q.a)}">
          <div class="qQ">${esc(q.q)}</div>
          <div class="opts">${opts.map(o=>`<button class="opt" type="button" data-choice="${esc(o)}">${esc(o)}</button>`).join('')}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
            <button class="btn btn--ghost hintBtn" type="button" data-hint="${esc(q.hint||'Think about form + meaning.')}">Hint</button>
            <button class="btn btn--ghost whyBtn" type="button">Why?</button>
          </div>
          <div class="fb" aria-live="polite"></div>
          <div class="explain" aria-live="polite">${esc(q.why||'')}</div>
        </div>
      `;
    }).join('');

    // restore solved
    $$('.qItem',root).forEach(it=>{
      const id=it.dataset.id;
      if(state.solved[id]){
        it.querySelectorAll('.opt').forEach(b=>b.disabled=true);
        const fb=it.querySelector('.fb'); fb.textContent='✅ Already solved'; fb.className='fb good';
      }
    });

    root.addEventListener('click',(e)=>{
      const it=e.target.closest('.qItem'); if(!it) return;
      const id=it.dataset.id, fb=it.querySelector('.fb'), ex=it.querySelector('.explain');
      const opt=e.target.closest('.opt'), hint=e.target.closest('.hintBtn'), why=e.target.closest('.whyBtn');

      if(why){ ex.classList.toggle('is-on'); return; }
      if(hint){
        if(!state.hints){ setHint('Hints are OFF.'); fb.textContent='Hints are OFF.'; fb.className='fb'; return; }
        const h=hint.dataset.hint||'';
        setHint(h);
        fb.textContent='💡 '+h;
        fb.className='fb';
        return;
      }
      if(!opt) return;

      const already=!!state.solved[id];
      const ans=it.dataset.answer, ch=opt.dataset.choice;

      if(ch===ans){
        opt.classList.add('is-right');
        fb.textContent = already ? '✅ Correct (practice mode)' : '✅ Correct!';
        fb.className='fb good';
        it.querySelectorAll('.opt').forEach(b=>b.disabled=true);
        if(ex.textContent.trim()) ex.classList.add('is-on');
        if(!already) markSolved(id,1);
      }else{
        opt.classList.add('is-wrong');
        fb.textContent='❌ Not yet. Try again.';
        fb.className='fb bad';
        markWrong();
      }
    });
  }

  // Coaches (select)
  function renderCoach(rootSel, rows, prefix){
    const root=$(rootSel); if(!root) return;
    root.innerHTML=rows.map((r,i)=>{
      const id=`${prefix}_${i+1}`;
      return `
        <div class="coachRow" data-id="${esc(id)}">
          <div class="sent">${esc(r.before)} <strong>___</strong> ${esc(r.after)}</div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <select data-answer="${esc(r.a)}" aria-label="Choose answer">
              <option value="">—</option>
              ${r.opts.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join('')}
            </select>
            <button class="btn btn--ghost hintBtn" type="button" data-hint="${esc(r.hint)}">Hint</button>
            <div class="fb" aria-live="polite"></div>
          </div>
        </div>
      `;
    }).join('');

    // restore solved
    $$('.coachRow',root).forEach(row=>{
      const id=row.dataset.id;
      const sel=row.querySelector('select');
      const fb=row.querySelector('.fb');
      if(state.solved[id]){
        const ans=sel.dataset.answer || sel.getAttribute('data-answer');
        sel.value=ans;
        sel.disabled=true;
        sel.classList.add('is-right');
        fb.textContent='✅ Correct';
        fb.className='fb good';
      }
    });

    root.addEventListener('click',(e)=>{
      const row=e.target.closest('.coachRow'); if(!row) return;
      const fb=row.querySelector('.fb');
      const hint=e.target.closest('.hintBtn');
      if(!hint) return;
      if(!state.hints){ setHint('Hints are OFF.'); fb.textContent='Hints are OFF.'; fb.className='fb'; return; }
      const h=hint.dataset.hint||''; setHint(h); fb.textContent='💡 '+h; fb.className='fb';
    });

    root.addEventListener('change',(e)=>{
      const sel=e.target.closest('select');
      const row=e.target.closest('.coachRow');
      if(!sel||!row) return;
      const id=row.dataset.id;
      const ans=sel.dataset.answer||sel.getAttribute('data-answer')||sel.parentElement?.dataset?.answer;
      const expected=sel.getAttribute('data-answer') || sel.dataset.answer || row.querySelector('select')?.getAttribute('data-answer') || row.querySelector('select')?.dataset?.answer || '';
      const correct = expected || ans;
      const fb=row.querySelector('.fb');
      const choice=sel.value;
      if(!choice){
        sel.classList.remove('is-right','is-wrong');
        fb.textContent='';
        fb.className='fb';
        return;
      }
      if(choice===correct){
        sel.classList.remove('is-wrong');
        sel.classList.add('is-right');
        sel.disabled=true;
        fb.textContent='✅ Correct!';
        fb.className='fb good';
        markSolved(id,1);
      }else{
        sel.classList.add('is-wrong');
        fb.textContent='❌ Not yet.';
        fb.className='fb bad';
        markWrong();
      }
    });
  }

  // Vocabulary
  function renderVocab(){
    const tabs=$('#vTabs'), grid=$('#vocabGrid'), search=$('#vSearch');
    if(!tabs||!grid||!search) return;

    const cats=['All',...Array.from(new Set(VOCAB.map(v=>v.cat)))];
    tabs.innerHTML=cats.map((c,i)=>`<button class="tab ${i===0?'is-active':''}" type="button" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
    let active='All';

    function getFiltered(){
      const q=norm(search.value||'');
      return VOCAB
        .filter(v=>active==='All'||v.cat===active)
        .filter(v=>!q || norm(v.en).includes(q) || norm(v.fr).includes(q) || norm(v.def).includes(q) || norm(v.ex||'').includes(q));
    }

    function show(){
      const items=getFiltered();
      grid.innerHTML=items.map((v,idx)=>`
        <button class="vcard" type="button" data-en="${esc(v.en)}" aria-label="Vocab card ${idx+1}">
          <div class="vcard__top">
            <div class="vcard__icon" aria-hidden="true">${v.icon}</div>
            <div class="vcard__term">${esc(v.en)}</div>
          </div>
          <div class="vcard__meta"><span class="tag">${esc(v.cat)}</span> • FR: <strong>${esc(v.fr)}</strong> • tap to flip</div>
          <div class="vcard__def">
            <div><strong>FR:</strong> ${esc(v.fr)}</div>
            <div><strong>Meaning:</strong> ${esc(v.def)}</div>
            <div style="margin-top:6px;"><strong>Example:</strong> ${esc(v.ex||'')}</div>
            <div style="margin-top:8px;color:rgba(247,248,251,.78)"><span class="badge">Tip</span> Tap again to hide.</div>
          </div>
        </button>
      `).join('');
    }

    show();

    tabs.addEventListener('click',(e)=>{
      const b=e.target.closest('.tab'); if(!b) return;
      $$('.tab',tabs).forEach(x=>x.classList.remove('is-active'));
      b.classList.add('is-active');
      active=b.dataset.cat;
      show();
    });
    search.addEventListener('input',show);

    grid.addEventListener('click',(e)=>{
      const c=e.target.closest('.vcard'); if(!c) return;
      c.classList.toggle('is-flipped');
      speak(c.dataset.en);
    });

    $('#btnVocabListen')?.addEventListener('click',()=>{
      const items=getFiltered().slice(0,18);
      if(!items.length){ setHint('No vocab matches.'); return; }
      speak(items.map(v=>`${v.en}. ${v.def}.`).join(' '));
    });
  }

  // Dialogue
  let dlgKey='family', dlgIndex=0, dlgWhyOpen=false;
  function curDlg(){ return DIALOGUES[dlgKey]||[]; }

  function renderDialogue(){
    const steps=curDlg(); const step=steps[dlgIndex]; if(!step) return;
    $('#dlgCount').textContent=`${dlgIndex+1} / ${steps.length}`;
    const sid=`dlg_${dlgKey}_${dlgIndex+1}`;
    $('#dlgMode').textContent = state.solved[sid] ? 'Practice' : 'Scoring';

    $('#dlgNpc').innerHTML=`<div class="dlgLine">${esc(step.npc)}</div>`;
    $('#dlgChoices').innerHTML=step.choices.map((c,i)=>`<button class="choice" type="button" data-i="${i}">${esc(c)}</button>`).join('');
    $('#dlgFb').textContent=''; $('#dlgFb').className='fb';
    $('#dlgExplain').textContent=step.why||'';
    $('#dlgExplain').className='explain'+(dlgWhyOpen?' is-on':'');
  }
  function advanceDialogue(){ const steps=curDlg(); dlgIndex=Math.min(steps.length-1, dlgIndex+1); dlgWhyOpen=false; renderDialogue(); }
  function restartDialogue(){ dlgIndex=0; dlgWhyOpen=false; renderDialogue(); setHint('Dialogue restarted.'); }

  function hookDialogue(){
    $('#dlgScenario')?.addEventListener('change',(e)=>{ dlgKey=e.target.value; restartDialogue(); });
    $('#btnDlgListen')?.addEventListener('click',()=>{ const s=curDlg()[dlgIndex]; speak(s.npc); });
    $('#btnDlgHint')?.addEventListener('click',()=>{
      const s=curDlg()[dlgIndex]; const fb=$('#dlgFb');
      if(!state.hints){ setHint('Hints are OFF.'); fb.textContent='Hints are OFF.'; fb.className='fb'; return; }
      setHint(s.hint||'Choose the most natural reply.');
      fb.textContent='💡 '+(s.hint||'');
      fb.className='fb';
    });
    $('#btnDlgWhy')?.addEventListener('click',()=>{ dlgWhyOpen=!dlgWhyOpen; $('#dlgExplain')?.classList.toggle('is-on'); });
    $('#btnDlgRestart')?.addEventListener('click',restartDialogue);

    $('#dlgChoices')?.addEventListener('click',(e)=>{
      const b=e.target.closest('.choice'); if(!b) return;
      const s=curDlg()[dlgIndex];
      const idx=Number(b.dataset.i);
      const fb=$('#dlgFb');
      const sid=`dlg_${dlgKey}_${dlgIndex+1}`;
      const already=!!state.solved[sid];

      if(idx===s.correct){
        b.classList.add('is-right');
        fb.textContent = already ? '✅ Correct (practice mode). Next!' : '✅ Correct! Next line unlocked.';
        fb.className='fb good';
        if(!already) markSolved(sid,1);
        setTimeout(advanceDialogue,650);
      }else{
        b.classList.add('is-wrong');
        fb.textContent='❌ Not quite. Try another reply.';
        fb.className='fb bad';
        markWrong();
      }
    });
  }

  // Fill in the blank
  function renderFIB(){
    const root=$('#fibBox'); if(!root) return;
    root.innerHTML = FIB.map(item=>`
      <div class="fibRow" data-id="${esc(item.id)}">
        <div class="fibSent">${esc(item.sent).replace('____', `<span class="blank"><input autocomplete="off" data-answer="${esc(item.a)}" /></span>`)}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center;">
          <button class="btn btn--ghost hintBtn" type="button" data-hint="${esc(item.hint)}">Hint</button>
          <div class="fb" aria-live="polite"></div>
        </div>
      </div>
    `).join('');

    // restore solved
    $$('.fibRow',root).forEach(row=>{
      const id=row.dataset.id;
      const inp=row.querySelector('input[data-answer]');
      const fb=row.querySelector('.fb');
      if(state.solved[id]){
        inp.value = inp.dataset.answer;
        inp.disabled=true;
        inp.classList.add('is-right');
        fb.textContent='✅ Correct';
        fb.className='fb good';
      }
    });

    root.addEventListener('click',(e)=>{
      const row=e.target.closest('.fibRow'); if(!row) return;
      const hint=e.target.closest('.hintBtn'); if(!hint) return;
      const fb=row.querySelector('.fb');
      if(!state.hints){ setHint('Hints are OFF.'); fb.textContent='Hints are OFF.'; fb.className='fb'; return; }
      const h=hint.dataset.hint||''; setHint(h); fb.textContent='💡 '+h; fb.className='fb';
    });

    root.addEventListener('input',(e)=>{
      const inp=e.target.closest('input[data-answer]'); if(!inp) return;
      const row=e.target.closest('.fibRow'); if(!row) return;
      const id=row.dataset.id;
      const fb=row.querySelector('.fb');
      const ans=norm(inp.dataset.answer);
      const val=norm(inp.value);

      if(val===ans){
        inp.classList.remove('is-wrong');
        inp.classList.add('is-right');
        inp.disabled=true;
        fb.textContent='✅ Correct!';
        fb.className='fb good';
        markSolved(id,1);
        speak(inp.dataset.answer);
        return;
      }
      if(val.length>=Math.max(3,ans.length)){
        inp.classList.add('is-wrong');
        fb.textContent='❌ Not yet.';
        fb.className='fb bad';
        markWrong();
      }else{
        inp.classList.remove('is-wrong','is-right');
        fb.textContent='';
        fb.className='fb';
      }
    });
  }

  // DnD + tap mode
  let selectedToken=null;
  function dndFeedback(msg,kind=''){
    const box=$('#dndFeedback'); if(!box) return;
    box.textContent=msg;
    box.style.color = (kind==='good') ? 'rgba(52,211,153,.95)' : (kind==='bad' ? 'rgba(251,113,133,.95)' : 'rgba(247,248,251,.78)');
  }

  function renderDnD(){
    const bank=$('#tokenBank'); if(!bank) return;
    const zones={
      future: document.querySelector('.zone__drop[data-cat="future"]'),
      time: document.querySelector('.zone__drop[data-cat="time"]'),
      poss: document.querySelector('.zone__drop[data-cat="poss"]'),
      place: document.querySelector('.zone__drop[data-cat="place"]')
    };
    bank.innerHTML='';
    Object.values(zones).forEach(z=>z && (z.innerHTML=''));

    const items = DND.map((x,idx)=>({ id:`dnd_${idx+1}`, t:x.t, cat:x.cat }));
    const view = shuffle(items);

    view.forEach(item=>{
      const solved = !!state.solved[item.id];
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='token' + (solved ? ' is-locked' : '');
      btn.draggable=!solved;
      btn.dataset.id=item.id;
      btn.dataset.cat=item.cat;
      btn.dataset.text=item.t;
      btn.textContent=item.t;

      if(solved && zones[item.cat]) zones[item.cat].appendChild(btn);
      else bank.appendChild(btn);
    });
  }

  function lockToken(tok){
    tok.classList.add('is-locked');
    tok.disabled=true;
    tok.draggable=false;
    tok.classList.remove('is-selected');
    selectedToken=null;
  }

  function handleTokenToZone(tok, cat, zoneEl){
    const correct=tok.dataset.cat;
    const id=tok.dataset.id;
    const drop=zoneEl.querySelector('.zone__drop'); if(!drop) return;

    if(cat===correct){
      drop.appendChild(tok);
      lockToken(tok);
      zoneEl.classList.add('is-hot');
      setTimeout(()=>zoneEl.classList.remove('is-hot'),240);
      dndFeedback(`✅ Correct: “${tok.dataset.text}” → ${cat}`,'good');
      markSolved(id,1);
      speak(tok.dataset.text);
    }else{
      zoneEl.classList.add('is-bad');
      setTimeout(()=>zoneEl.classList.remove('is-bad'),330);
      dndFeedback('❌ Not correct. Try another box.','bad');
      markWrong();
      if(state.hints) setHint('DnD tip: Future form / Time phrase / Possessive / Place.');
    }
  }

  function attachDnD(){
    const bank=$('#tokenBank'); if(!bank) return;

    bank.addEventListener('dragstart',(e)=>{
      const tok=e.target.closest('.token');
      if(!tok || tok.classList.contains('is-locked')) return;
      e.dataTransfer.setData('text/plain', tok.dataset.id);
      e.dataTransfer.effectAllowed='move';
    });

    $$('.zone').forEach(zone=>{
      const drop=zone.querySelector('.zone__drop'); if(!drop) return;
      const cat=drop.dataset.cat;

      zone.addEventListener('dragover',(e)=>{ e.preventDefault(); zone.classList.add('is-hot'); });
      zone.addEventListener('dragleave',()=>zone.classList.remove('is-hot'));
      zone.addEventListener('drop',(e)=>{
        e.preventDefault(); zone.classList.remove('is-hot');
        const id=e.dataTransfer.getData('text/plain');
        const tok=document.querySelector(`.token[data-id="${CSS.escape(id)}"]`);
        if(!tok) return;
        handleTokenToZone(tok, cat, zone);
      });

      // tap mode
      zone.addEventListener('click',()=>{ if(!selectedToken) return; handleTokenToZone(selectedToken, cat, zone); });
      zone.addEventListener('keydown',(ev)=>{
        if(ev.key==='Enter' || ev.key===' '){
          ev.preventDefault();
          if(!selectedToken) return;
          handleTokenToZone(selectedToken, cat, zone);
        }
      });
    });

    bank.addEventListener('click',(e)=>{
      const tok=e.target.closest('.token');
      if(!tok || tok.classList.contains('is-locked')) return;

      if(selectedToken && selectedToken!==tok) selectedToken.classList.remove('is-selected');

      if(tok.classList.contains('is-selected')){
        tok.classList.remove('is-selected');
        selectedToken=null;
        dndFeedback('Tap mode: tap a token → then tap a box.');
      }else{
        tok.classList.add('is-selected');
        selectedToken=tok;
        dndFeedback(`Selected: “${tok.dataset.text}” → now tap a box.`);
      }
    });
  }

  // Ensemble pre‑check MCQ (short)
  function renderEnsemblePrep(){
    const bank=[
      {q:'Choose the best (plan):', opts:['I’m going to visit my son next month.','I’ll visit my son next month (decision now).','I’m visit my son next month.'], a:'I’m going to visit my son next month.', hint:'going to = plan', why:'Planned intention: going to.'},
      {q:'Choose the best (offer):', opts:['Don’t worry — I’ll call you when I arrive.','Don’t worry — I’m going to call you when I will arrive.','Don’t worry — I’ll calling you when I arrive.'], a:'Don’t worry — I’ll call you when I arrive.', hint:'will + base; no will after when', why:'Will in main clause; present in time clause.'},
      {q:'Choose the best (arrangement):', opts:['I’m volunteering at the vet clinic on Tuesday.','I volunteer at the vet clinic on Tuesday (arranged).','I’m going to volunteering at the vet clinic.'], a:'I’m volunteering at the vet clinic on Tuesday.', hint:'present continuous arrangement', why:'Use present continuous for scheduled plan.'},
      {q:'Choose the best (prepositions):', opts:['We’re flying to Copenhageni in July.','We’re flying at Copenhageni on July.','We’re flying to Copenhageni at July.'], a:'We’re flying to Copenhageni in July.', hint:'to + destination; in + month', why:'Correct prepositions.'},
    ];
    renderMCQ('#mcqEnsemblePrep', bank, 'ensprep');
  }

  // Ensemble builder + checklist
  function buildEnsembleText(){
    const fam=$('#ensFamily')?.value||'';
    const ani=$('#ensAnimals')?.value||'';
    const youth=$('#ensYouth')?.value||'';
    const conn=$('#ensConnect')?.value||'';

    let intro='';
    if(state.level==='B1'){
      intro='Here is a clear overview of my plans and my roles. ';
    }else if(state.level==='A2plus'){
      intro='Here is my plan and what I do. ';
    }else{
      intro='Here is my plan. ';
    }

    let connectorLine='';
    if(conn.includes('First')) connectorLine='First, I talk about my family. Then, I talk about my volunteer work. After that, I explain my youth support role. Finally, I share my goal.';
    else if(conn.includes('Also')) connectorLine='Also, I want to communicate clearly. In addition, I practise step by step. However, sometimes it is challenging. Overall, it is rewarding.';
    else connectorLine='Because this matters, I practise regularly. So I can communicate better. That’s why I work step by step.';

    const feelings = (state.level==='A2') ? 'It can be challenging, but it is rewarding.' : 'It can be challenging, but it is truly rewarding, and it helps me grow.';

    const out=[intro, fam, ani, youth, feelings, connectorLine].join(' ').replace(/\s+/g,' ').trim();
    $('#ensOut').textContent=out;
    return out;
  }

  function renderEnsembleChecklist(text){
    const box=$('#ensChecklist'); if(!box) return;
    const t=text||'';
    const checks = ENSEMBLE_CHECKS.map(c=>{
      const ok = new RegExp(c.pattern, 'i').test(t);
      return {ok, label:c.label};
    });

    // Preps count rule (2+)
    const prepMatches = (t.match(/\b(in|on|at|to|from|with)\b/gi)||[]).length;
    checks.forEach(x=>{
      if(x.label.includes('2 prepositions')) x.ok = prepMatches>=2;
    });

    box.innerHTML = checks.map(ch=>`
      <div class="chk ${ch.ok?'ok':'bad'}">
        <div class="dot" aria-hidden="true"></div>
        <div>${esc(ch.label)} ${ch.ok?'<small>OK</small>':'<small>Missing — add it</small>'}</div>
      </div>
    `).join('');

    const allOk = checks.every(c=>c.ok);
    const id='ensemble_check';
    if(allOk){
      setHint('✅ Ensemble checklist complete! Great. Copy it or use it for speaking.');
      markSolved(id,3);
    }else{
      setHint('Some checklist items are missing. Edit your text by adding a missing tool.');
    }
  }

  function hookEnsemble(){
    $('#btnEnsBuild')?.addEventListener('click',()=>{
      const t=buildEnsembleText();
      // building alone counts 1
      markSolved('ensemble_built',1);
      setHint('Built. Now click Check to validate the checklist.');
    });
    $('#btnEnsListen')?.addEventListener('click',()=>{
      const t=$('#ensOut')?.textContent.trim();
      if(!t){ setHint('Build your ensemble first.'); return; }
      speak(t);
    });
    $('#btnEnsCheck')?.addEventListener('click',()=>{
      const t=$('#ensOut')?.textContent.trim();
      if(!t){ setHint('Build your ensemble first.'); return; }
      renderEnsembleChecklist(t);
    });
    $('#btnEnsCopy')?.addEventListener('click', async ()=>{
      const t=$('#ensOut')?.textContent.trim();
      if(!t){ setHint('Build your ensemble first.'); return; }
      try{ await navigator.clipboard.writeText(t); setHint('Copied!'); }
      catch(e){ setHint('Copy failed. Select and copy manually.'); }
    });
  }

  // CLOE prompts + timer + writing
  const SPEAK_PROMPTS=[
    'Describe your next visit to Denmark. Include: going to + will + in/on/at + a possessive.',
    'Explain your two volunteer roles. Include: arrangements (I’m volunteering…) and one time clause (When/After/Before…).',
    'Give a clear plan for next week. Include: one offer (I’ll…) and one possibility (might).',
    'Tell a short story: family plan + animal rescue shift + youth support meeting. Use connectors: first, then, after that, finally.'
  ];
  const WRITE_MODEL=[
    "I’m going to visit my son in Denmark next month.",
    "I’m volunteering at the vet clinic on Tuesday.",
    "I’ll book the tickets tonight and I’ll call when I arrive.",
    "Before I go to court, I read the case file.",
    "My son’s wife is German, and their home is in Denmark.",
    "We’re flying to Copenhagen in July, and we’ll meet at 3 pm.",
    "It can be challenging, but it’s rewarding.",
    "Overall, I want clear communication and real conversations."
  ];

  function hookCLOE(){
    $('#btnNewPrompt')?.addEventListener('click',()=>{
      const p=SPEAK_PROMPTS[Math.floor(Math.random()*SPEAK_PROMPTS.length)];
      $('#speakPrompt').textContent=p;
      setHint('Speaking tip: plan (going to) + decision (will) + time clause + prepositions.');
    });
    $('#btnPromptListen')?.addEventListener('click',()=>speak($('#speakPrompt')?.textContent||''));

    // timer
    let timer=null; let seconds=60;
    const readout=$('#timerReadout');
    function renderTime(){
      if(!readout) return;
      const mm=String(Math.floor(seconds/60)).padStart(2,'0');
      const ss=String(seconds%60).padStart(2,'0');
      readout.textContent=`${mm}:${ss}`;
    }
    renderTime();

    $('#btnTimer')?.addEventListener('click',()=>{
      if(timer) return;
      seconds=60; renderTime();
      timer=setInterval(()=>{
        seconds-=1; renderTime();
        if(seconds<=0){ clearInterval(timer); timer=null; speak('Time. Please stop.'); }
      },1000);
    });
    $('#btnTimerStop')?.addEventListener('click',()=>{
      if(timer){ clearInterval(timer); timer=null; }
      seconds=60; renderTime();
    });

    // writing model
    $('#btnWriteModel')?.addEventListener('click',()=>{
      for(let i=1;i<=8;i++){
        const el=$('#w'+i); if(el) el.value = WRITE_MODEL[i-1]||'';
      }
      const out=WRITE_MODEL.join(' ');
      $('#writeOut').textContent=out;
      speak(out);
      setHint('Model inserted. Personalize 2–3 details.');
    });

    $('#btnWriteCheck')?.addEventListener('click',()=>{
      const vals=[];
      for(let i=1;i<=8;i++){
        const v=($('#w'+i)?.value||'').trim();
        if(v) vals.push(v);
      }
      const out=vals.join(' ');
      $('#writeOut').textContent=out;

      let gained=0;
      for(let i=1;i<=8;i++){
        const val=($('#w'+i)?.value||'').trim();
        if(val.split(/\s+/).filter(Boolean).length>=3){
          if(markSolved('write_'+i,1)) gained+=1;
        }
      }

      const fb=$('#writeFb');
      if(!fb) return;
      if(out.length<120){
        fb.textContent='❌ Too short. Add more details (time, place, connectors).';
        fb.className='fb bad';
        markWrong();
        return;
      }
      fb.textContent = gained ? `✅ Checked. +${gained} point(s).` : '✅ Checked. Already counted.';
      fb.className='fb good';
      speak(out);
    });

    $('#btnWriteCopy')?.addEventListener('click', async ()=>{
      const txt=$('#writeOut')?.textContent.trim();
      if(!txt){ setHint('Write first, then click Check.'); return; }
      try{ await navigator.clipboard.writeText(txt); setHint('Copied!'); }
      catch(e){ setHint('Copy failed.'); }
    });
  }

  // Practice reset
  function resetPractice(){
    const keep={};
    Object.keys(state.solved||{}).forEach(k=>{
      const reset = k.startsWith('prac_') || k.startsWith('ensprep_') || k.startsWith('fib') || k.startsWith('dnd_') ||
                    k.startsWith('dlg_') || k.startsWith('ensemble_') || k.startsWith('write_') ||
                    k.startsWith('coach_');
      if(!reset) keep[k]=true;
    });
    state.solved=keep;
    state.score=Object.keys(state.solved).length;
    state.streak=0;
    saveState();
    location.hash='#practice';
    location.reload();
  }

  function computeTotal(){
    const mcq=document.querySelectorAll('.qItem').length;
    const fib=document.querySelectorAll('.fibRow').length;
    const coach=document.querySelectorAll('.coachRow').length;
    const dnd=DND.length;
    const dlg=Object.values(DIALOGUES).reduce((a,x)=>a+(x?x.length:0),0);
    const ensemble=4; // built + check + copy not counted; check is 3 pts, built 1 pt (still 4 total)
    const writing=8;
    return mcq+fib+coach+dnd+dlg+ensemble+writing;
  }

  function init(){
    hookTopbar();
    applyPrefs();

    // Render MCQs
    renderMCQ('#mcqGoing', MCQ_GOING, 'go');
    renderMCQ('#mcqWill', MCQ_WILL, 'will');
    renderMCQ('#mcqArr', MCQ_ARR, 'arr');
    renderMCQ('#mcqTime', MCQ_TIME, 'time');
    renderMCQ('#mcqMight', MCQ_MIGHT, 'might');

    renderMCQ('#mcqPractice', PRACTICE_MCQ, 'prac');
    renderEnsemblePrep();

    // Coaches
    renderCoach('#coachPoss', [
      {before:'This is', after:'home.', opts:['my','their','his'], a:'their', hint:'Home of two people = their.'},
      {before:'She is', after:'wife (daughter‑in‑law).', opts:['my son’s','my sons','my son'], a:'my son’s', hint:"Person + ’s."},
      {before:'I talk to', after:'judge.', opts:['the','my','their'], a:'the', hint:'We say “the judge”.'},
    ], 'coachPoss');

    renderCoach('#coachPreps', [
      {before:'We’re travelling', after:'July.', opts:['in','on','at'], a:'in', hint:'Months → in.'},
      {before:'I’m meeting them', after:'Saturday.', opts:['in','on','at'], a:'on', hint:'Days → on.'},
      {before:'Let’s call', after:'3 pm.', opts:['in','on','at'], a:'at', hint:'Clock time → at.'},
      {before:'I’m going', after:'Denmark.', opts:['to','from','with'], a:'to', hint:'Destination → to.'},
      {before:'I volunteer', after:'the vet clinic.', opts:['at','in','on'], a:'at', hint:'Place → at.'},
    ], 'coachPrep');

    // Vocab
    renderVocab();

    // Dialogue
    dlgKey='family'; dlgIndex=0; dlgWhyOpen=false;
    renderDialogue();
    hookDialogue();

    // FIB
    renderFIB();

    // DnD
    renderDnD();
    attachDnD();
    dndFeedback('Tap mode: tap a token → then tap a box.');

    // Ensemble
    hookEnsemble();
    renderEnsembleChecklist($('#ensOut')?.textContent||'');

    // CLOE
    hookCLOE();

    // Total
    TOTAL=computeTotal();
    updateHud();
    setHint('Start with section 2 (Future rules) → then Dialogue → then Practice → then Ensemble.');
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();