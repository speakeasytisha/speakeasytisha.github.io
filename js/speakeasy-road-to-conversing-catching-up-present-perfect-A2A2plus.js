(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
  const STORE_KEY = 'SET_road_to_conversing_catching_up_pp_A2_v1';

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
  function setHint(t){$('#hintBox').textContent=t;}

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
    $('#scoreNow').textContent=String(state.score);
    $('#streakNow').textContent=String(state.streak);
    $('#scoreTotal').textContent=String(TOTAL);
    const pct=TOTAL?Math.round((state.score/TOTAL)*100):0;
    $('#progressPct').textContent=pct+'%';
    $('#progressBar').style.width=clamp(pct,0,100)+'%';
  }

  function applyPrefs(){
    const set=(id,on)=>{const el=$(id); if(el) el.classList.toggle('is-active',!!on);};
    set('#accentUS',state.accent==='US'); set('#accentUK',state.accent==='UK');
    set('#speedNormal',state.speed==='normal'); set('#speedSlow',state.speed==='slow');
    set('#hintsOn',!!state.hints); set('#hintsOff',!state.hints);
    $('#levelSelect').value=state.level;
    document.body.dataset.level = state.level;
  }

  function hookTopbar(){
    $('#btnPrint').addEventListener('click',()=>window.print());
    $('#btnResetAll').addEventListener('click',()=>{
      if(!confirm('Reset ALL progress for this lesson?')) return;
      localStorage.removeItem(STORE_KEY);
      location.reload();
    });
    $('#btnResetPractice').addEventListener('click',()=>{
      if(!confirm('Reset Practice + Dialogue + Builder?')) return;
      resetPractice();
    });

    $('#accentUS').addEventListener('click',()=>{state.accent='US';saveState();applyPrefs();setHint('Accent set to US.');});
    $('#accentUK').addEventListener('click',()=>{state.accent='UK';saveState();applyPrefs();setHint('Accent set to UK.');});
    $('#speedNormal').addEventListener('click',()=>{state.speed='normal';saveState();applyPrefs();setHint('Speed: normal.');});
    $('#speedSlow').addEventListener('click',()=>{state.speed='slow';saveState();applyPrefs();setHint('Speed: slow.');});
    $('#hintsOn').addEventListener('click',()=>{state.hints=true;saveState();applyPrefs();setHint('Hints ON.');});
    $('#hintsOff').addEventListener('click',()=>{state.hints=false;saveState();applyPrefs();setHint('Hints OFF.');});

    $('#btnStopSpeak').addEventListener('click',stopSpeak);
    $('#btnVocabStop')?.addEventListener('click',stopSpeak);

    $('#levelSelect').addEventListener('change',(e)=>{
      state.level=e.target.value;
      saveState();
      applyPrefs();
      setHint('Level set. Continue with Dialogue or Builder.');
    });

    document.addEventListener('click',(e)=>{
      const b=e.target.closest('.speakBtn');
      if(!b) return;
      const t=b.dataset.say||'';
      if(t) speak(t);
    });
  }

  // Data injected
  const VOCAB=[{"cat": "Catching up basics", "icon": "👋", "en": "to catch up", "fr": "prendre des nouvelles / rattraper", "def": "to talk after some time and share updates", "ex": "Let’s catch up this weekend."}, {"cat": "Catching up basics", "icon": "💬", "en": "How have you been?", "fr": "Comment ça va ? / Comment tu vas ?", "def": "a friendly question to start catching up", "ex": "Hi! How have you been?"}, {"cat": "Catching up basics", "icon": "🙂", "en": "I’ve been busy", "fr": "J’ai été occupé(e)", "def": "I had many things to do recently", "ex": "I’ve been busy with work lately."}, {"cat": "Catching up basics", "icon": "🌤️", "en": "lately", "fr": "dernièrement", "def": "recently", "ex": "Lately, I’ve had a lot to do."}, {"cat": "Catching up basics", "icon": "📰", "en": "What’s new?", "fr": "Quoi de neuf ?", "def": "what has changed recently", "ex": "What’s new in your life?"}, {"cat": "Catching up basics", "icon": "🧡", "en": "That’s great to hear", "fr": "C’est super / Ça fait plaisir", "def": "a positive reaction", "ex": "That’s great to hear!"}, {"cat": "Catching up basics", "icon": "🤗", "en": "I’m happy for you", "fr": "Je suis contente pour toi", "def": "you feel happy about someone’s news", "ex": "I’m happy for you."}, {"cat": "Family & relationships", "icon": "👩‍🦰", "en": "daughter-in-law", "fr": "belle-fille", "def": "your son’s wife", "ex": "My daughter-in-law is German."}, {"cat": "Family & relationships", "icon": "💍", "en": "to get married", "fr": "se marier", "def": "to marry", "ex": "He has gotten married."}, {"cat": "Family & relationships", "icon": "👨‍👩‍👧‍👦", "en": "family dinner", "fr": "dîner de famille", "def": "a meal with family members", "ex": "We’ve had a family dinner."}, {"cat": "Family & relationships", "icon": "📞", "en": "to keep in touch", "fr": "rester en contact", "def": "to communicate regularly", "ex": "We keep in touch by phone."}, {"cat": "Family & relationships", "icon": "🧑‍🤝‍🧑", "en": "relatives", "fr": "des proches / des parents", "def": "family members", "ex": "I’ve visited my relatives."}, {"cat": "Life updates", "icon": "🏡", "en": "to move", "fr": "déménager", "def": "to change home", "ex": "They’ve moved to a new place."}, {"cat": "Life updates", "icon": "💼", "en": "to change jobs", "fr": "changer de travail", "def": "to start a new job", "ex": "She’s changed jobs recently."}, {"cat": "Life updates", "icon": "📚", "en": "to improve", "fr": "améliorer", "def": "to get better", "ex": "I’ve improved my English."}, {"cat": "Life updates", "icon": "🎯", "en": "goal", "fr": "objectif", "def": "something you want to achieve", "ex": "My goal is to converse easily."}, {"cat": "Life updates", "icon": "😅", "en": "a bit stressful", "fr": "un peu stressant", "def": "causing worry", "ex": "It’s been a bit stressful."}, {"cat": "Life updates", "icon": "⭐", "en": "exciting", "fr": "passionnant", "def": "very interesting and positive", "ex": "It’s been exciting."}, {"cat": "Travel & visits", "icon": "🇫🇮", "en": "Finland", "fr": "la Finlande", "def": "a country in Northern Europe", "ex": "My son lives in Finland."}, {"cat": "Travel & visits", "icon": "✈️", "en": "trip", "fr": "voyage", "def": "travel to another place", "ex": "I’ve planned a trip."}, {"cat": "Travel & visits", "icon": "🧳", "en": "to visit", "fr": "rendre visite", "def": "to go see someone", "ex": "I’ve visited them twice."}, {"cat": "Travel & visits", "icon": "🗓️", "en": "recently", "fr": "récemment", "def": "not long ago", "ex": "We’ve met recently."}, {"cat": "Travel & visits", "icon": "🕒", "en": "for / since", "fr": "depuis / pendant", "def": "to talk about duration or starting point", "ex": "I’ve lived in France for 20 years / since 2005."}, {"cat": "Present perfect keywords", "icon": "✅", "en": "already", "fr": "déjà", "def": "before now (earlier than expected)", "ex": "I’ve already sent the message."}, {"cat": "Present perfect keywords", "icon": "⏳", "en": "yet", "fr": "encore / déjà (dans une question)", "def": "until now (questions/negatives)", "ex": "Have you met her yet? I haven’t met her yet."}, {"cat": "Present perfect keywords", "icon": "⚡", "en": "just", "fr": "venir de", "def": "a very recent action", "ex": "I’ve just finished."}, {"cat": "Present perfect keywords", "icon": "📌", "en": "ever", "fr": "déjà (dans la vie)", "def": "at any time in your life", "ex": "Have you ever been to Finland?"}, {"cat": "Present perfect keywords", "icon": "🚫", "en": "never", "fr": "jamais", "def": "at no time in your life", "ex": "I’ve never tried that."}];
  const IRREG=[{"base": "be", "past": "was/were", "pp": "been", "fr": "être"}, {"base": "go", "past": "went", "pp": "gone", "fr": "aller"}, {"base": "come", "past": "came", "pp": "come", "fr": "venir"}, {"base": "do", "past": "did", "pp": "done", "fr": "faire"}, {"base": "have", "past": "had", "pp": "had", "fr": "avoir"}, {"base": "make", "past": "made", "pp": "made", "fr": "faire / fabriquer"}, {"base": "meet", "past": "met", "pp": "met", "fr": "rencontrer"}, {"base": "see", "past": "saw", "pp": "seen", "fr": "voir"}, {"base": "speak", "past": "spoke", "pp": "spoken", "fr": "parler"}, {"base": "take", "past": "took", "pp": "taken", "fr": "prendre"}, {"base": "write", "past": "wrote", "pp": "written", "fr": "écrire"}, {"base": "buy", "past": "bought", "pp": "bought", "fr": "acheter"}, {"base": "teach", "past": "taught", "pp": "taught", "fr": "enseigner"}, {"base": "tell", "past": "told", "pp": "told", "fr": "dire / raconter"}, {"base": "feel", "past": "felt", "pp": "felt", "fr": "ressentir"}];
  const MCQ_PP_FORM=[{"q": "Choose the correct present perfect:", "opts": ["I have visited Finland.", "I visited Finland (no time).", "I have visit Finland."], "a": "I have visited Finland.", "hint": "have/has + past participle", "why": "Present perfect = have/has + past participle."}, {"q": "Choose the correct negative:", "opts": ["I haven’t met her yet.", "I don’t have met her yet.", "I haven’t meet her yet."], "a": "I haven’t met her yet.", "hint": "haven’t + past participle", "why": "Negative: haven’t/hasn’t + past participle."}, {"q": "Choose the correct question:", "opts": ["Have you met her yet?", "Did you have met her yet?", "Have you meet her yet?"], "a": "Have you met her yet?", "hint": "Have/Has + subject + past participle", "why": "Question: Have you met…? (pp form)."}, {"q": "Choose the correct short answer:", "opts": ["Yes, I have.", "Yes, I am.", "Yes, I did."], "a": "Yes, I have.", "hint": "Short answer uses have/has", "why": "Present perfect short answer: Yes, I have."}];
  const MCQ_PP_USES=[{"q": "Life experience (ever):", "opts": ["Have you ever been to Finland?", "Did you ever be to Finland?", "Have you ever went to Finland?"], "a": "Have you ever been to Finland?", "hint": "been = past participle of be", "why": "Experience: Have you ever been…?"}, {"q": "Recent action (just):", "opts": ["I’ve just finished my report.", "I just finish my report.", "I’ve just finish my report."], "a": "I’ve just finished my report.", "hint": "have + past participle", "why": "Just + present perfect: I’ve just finished."}, {"q": "Unfinished time (today / this week):", "opts": ["I’ve made two calls today.", "I made two calls today (unfinished time).", "I’ve make two calls today."], "a": "I’ve made two calls today.", "hint": "today can be unfinished time", "why": "Today is not finished → present perfect is natural."}, {"q": "Result now:", "opts": ["I’ve lost my keys (I can’t find them now).", "I lost my keys yesterday.", "I’ve lose my keys."], "a": "I’ve lost my keys (I can’t find them now).", "hint": "result now", "why": "Present perfect focuses on result now."}];
  const MCQ_PP_VS_PAST=[{"q": "With a finished time (yesterday):", "opts": ["I visited them yesterday.", "I’ve visited them yesterday.", "I have visited them yesterday."], "a": "I visited them yesterday.", "hint": "yesterday → past simple", "why": "Finished time = past simple."}, {"q": "No time mentioned (catching up):", "opts": ["I’ve met her.", "I met her yesterday (no time).", "I meet her."], "a": "I’ve met her.", "hint": "no time → present perfect", "why": "Catching up often uses present perfect without a finished time."}, {"q": "Question with finished time:", "opts": ["Did you call her last week?", "Have you called her last week?", "Did you called her last week?"], "a": "Did you call her last week?", "hint": "Did + base verb", "why": "Past simple question: did + base verb."}, {"q": "Choose the best pair:", "opts": ["Have you seen her yet? / Yes, I have.", "Did you seen her yet? / Yes, I did.", "Have you saw her yet? / Yes, I have."], "a": "Have you seen her yet? / Yes, I have.", "hint": "seen = past participle", "why": "Seen is the past participle of see."}];
  const MCQ_FOR_SINCE=[{"q": "Choose the correct:", "opts": ["I’ve lived in France for 20 years.", "I live in France for 20 years.", "I’ve lived in France since 20 years."], "a": "I’ve lived in France for 20 years.", "hint": "for + duration", "why": "For + duration (20 years)."}, {"q": "Choose the correct:", "opts": ["I’ve known her since 2023.", "I’ve known her for 2023.", "I know her since 2023."], "a": "I’ve known her since 2023.", "hint": "since + starting point", "why": "Since + year/date."}, {"q": "Question:", "opts": ["How long have you lived in France?", "How long do you live in France?", "How long did you live in France?"], "a": "How long have you lived in France?", "hint": "How long + present perfect", "why": "For duration up to now: How long have you…?"}, {"q": "Negative:", "opts": ["I haven’t visited Finland yet.", "I didn’t visited Finland yet.", "I haven’t visit Finland yet."], "a": "I haven’t visited Finland yet.", "hint": "haven’t + past participle", "why": "Haven’t visited = correct pp negative."}];
  const MCQ_IRR=[{"q": "Past participle of “be” (être):", "opts": ["told", "been", "taught"], "a": "been", "hint": "Present perfect uses the past participle.", "why": "be → been (past participle)."}, {"q": "Past participle of “go” (aller):", "opts": ["done", "gone", "met"], "a": "gone", "hint": "Present perfect uses the past participle.", "why": "go → gone (past participle)."}, {"q": "Past participle of “come” (venir):", "opts": ["felt", "come", "met"], "a": "come", "hint": "Present perfect uses the past participle.", "why": "come → come (past participle)."}, {"q": "Past participle of “do” (faire):", "opts": ["been", "bought", "done"], "a": "done", "hint": "Present perfect uses the past participle.", "why": "do → done (past participle)."}, {"q": "Past participle of “have” (avoir):", "opts": ["been", "had", "seen"], "a": "had", "hint": "Present perfect uses the past participle.", "why": "have → had (past participle)."}, {"q": "Past participle of “make” (faire / fabriquer):", "opts": ["had", "bought", "made"], "a": "made", "hint": "Present perfect uses the past participle.", "why": "make → made (past participle)."}, {"q": "Past participle of “meet” (rencontrer):", "opts": ["seen", "spoken", "met"], "a": "met", "hint": "Present perfect uses the past participle.", "why": "meet → met (past participle)."}, {"q": "Past participle of “see” (voir):", "opts": ["taught", "spoken", "seen"], "a": "seen", "hint": "Present perfect uses the past participle.", "why": "see → seen (past participle)."}, {"q": "Past participle of “speak” (parler):", "opts": ["spoken", "seen", "come"], "a": "spoken", "hint": "Present perfect uses the past participle.", "why": "speak → spoken (past participle)."}, {"q": "Past participle of “take” (prendre):", "opts": ["taken", "done", "come"], "a": "taken", "hint": "Present perfect uses the past participle.", "why": "take → taken (past participle)."}, {"q": "Past participle of “write” (écrire):", "opts": ["made", "done", "written"], "a": "written", "hint": "Present perfect uses the past participle.", "why": "write → written (past participle)."}, {"q": "Past participle of “buy” (acheter):", "opts": ["bought", "had", "gone"], "a": "bought", "hint": "Present perfect uses the past participle.", "why": "buy → bought (past participle)."}, {"q": "Past participle of “teach” (enseigner):", "opts": ["met", "bought", "taught"], "a": "taught", "hint": "Present perfect uses the past participle.", "why": "teach → taught (past participle)."}, {"q": "Past participle of “tell” (dire / raconter):", "opts": ["told", "met", "come"], "a": "told", "hint": "Present perfect uses the past participle.", "why": "tell → told (past participle)."}, {"q": "Past participle of “feel” (ressentir):", "opts": ["taken", "felt", "made"], "a": "felt", "hint": "Present perfect uses the past participle.", "why": "feel → felt (past participle)."}];
  const PRACTICE_MCQ=[{"q": "Start (easy): choose the correct:", "opts": ["I’ve been busy lately.", "I’m been busy lately.", "I have busy lately."], "a": "I’ve been busy lately.", "hint": "been = past participle of be", "why": "I have been → I’ve been."}, {"q": "Ever question:", "opts": ["Have you ever met her?", "Did you ever met her?", "Have you ever meet her?"], "a": "Have you ever met her?", "hint": "Have + past participle", "why": "Met is participle & past."}, {"q": "Just:", "opts": ["I’ve just arrived.", "I just have arrived.", "I’ve just arrive."], "a": "I’ve just arrived.", "hint": "have + past participle", "why": "Arrived = past participle."}, {"q": "Yet (negative):", "opts": ["I haven’t called her yet.", "I don’t have called her yet.", "I haven’t call her yet."], "a": "I haven’t called her yet.", "hint": "haven’t + past participle", "why": "Called is participle."}, {"q": "Past simple (finished time):", "opts": ["I met her last year.", "I’ve met her last year.", "I have met her last year."], "a": "I met her last year.", "hint": "last year → past simple", "why": "Finished time → past."}, {"q": "Present perfect (no time):", "opts": ["I’ve met her and she’s very kind.", "I met her and she’s very kind (no time).", "I have meet her and she’s kind."], "a": "I’ve met her and she’s very kind.", "hint": "catching up → present perfect", "why": "No finished time: present perfect."}, {"q": "For/since:", "opts": ["I’ve lived in France since 2005.", "I’ve lived in France for 2005.", "I live in France since 2005."], "a": "I’ve lived in France since 2005.", "hint": "since + starting point", "why": "Since + year."}, {"q": "Question (past simple):", "opts": ["Did you call her yesterday?", "Have you called her yesterday?", "Did you called her yesterday?"], "a": "Did you call her yesterday?", "hint": "Did + base verb", "why": "Did + call."}, {"q": "Irregular participle:", "opts": ["I’ve written a message.", "I’ve wrote a message.", "I have write a message."], "a": "I’ve written a message.", "hint": "write → written", "why": "Past participle of write is written."}, {"q": "Irregular participle:", "opts": ["I’ve seen her photos.", "I’ve saw her photos.", "I have see her photos."], "a": "I’ve seen her photos.", "hint": "see → seen", "why": "Past participle of see is seen."}, {"q": "B1 stretch (hidden unless B1):", "opts": ["I’ve already booked the flight, so I’m ready.", "I already booked the flight, so I’m ready.", "I’ve already book the flight, so I’m ready."], "a": "I’ve already booked the flight, so I’m ready.", "hint": "already + present perfect", "why": "Already often uses present perfect."}, {"q": "B1 stretch (hidden unless B1):", "opts": ["I haven’t heard from them in a while.", "I didn’t heard from them in a while.", "I haven’t hear from them in a while."], "a": "I haven’t heard from them in a while.", "hint": "hear → heard", "why": "Past participle: heard."}];
  const FIB=[{"id": "fib1", "sent": "I have ____ busy lately.", "a": "been", "hint": "be → been"}, {"id": "fib2", "sent": "Have you ____ met her?", "a": "ever", "hint": "ever = at any time in your life"}, {"id": "fib3", "sent": "I’ve ____ finished my report.", "a": "just", "hint": "just = very recently"}, {"id": "fib4", "sent": "I haven’t met her ____ .", "a": "yet", "hint": "yet in negatives/questions"}, {"id": "fib5", "sent": "I’ve lived in France ____ 2005.", "a": "since", "hint": "since + starting point"}, {"id": "fib6", "sent": "I’ve lived in France ____ 20 years.", "a": "for", "hint": "for + duration"}, {"id": "fib7", "sent": "I’ve ____ her photos.", "a": "seen", "hint": "see → seen"}, {"id": "fib8", "sent": "I’ve ____ a message.", "a": "written", "hint": "write → written"}];
  const DIALOGUES={"call": [{"npc": "Hi! How have you been?", "choices": ["I’ve been busy lately, but I’m good. 😊", "I was busy lately, but I’m good.", "I have be busy lately."], "correct": 0, "hint": "I’ve been + adjective", "why": "Present perfect: I’ve been busy lately."}, {"npc": "Have you visited Finland recently?", "choices": ["Not yet, but I’ve planned a trip.", "No, I didn’t visited Finland yet.", "Not yet, but I planned a trip (no time)."], "correct": 0, "hint": "yet + present perfect", "why": "Not yet + present perfect: I’ve planned…"}, {"npc": "Have you met your daughter‑in‑law?", "choices": ["Yes, I have. I’ve met her twice.", "Yes, I met her twice (no time).", "Yes, I have met her yesterday."], "correct": 0, "hint": "No finished time → present perfect", "why": "I’ve met her twice (experience)."}, {"npc": "That’s nice! What is she like?", "choices": ["She’s very kind and welcoming.", "She very kind and welcoming.", "She’s kindly and welcoming."], "correct": 0, "hint": "be + adjective", "why": "Use adjectives after be: she’s kind."}, {"npc": "Great. Have you talked a lot in English?", "choices": ["A little. I want to improve and speak more.", "A little. I want improve and speak more.", "A little. I’ve want to improve and speak more."], "correct": 0, "hint": "want to + base verb", "why": "I want to improve."}, {"npc": "Perfect! When will you call again?", "choices": ["I’ll call again on Saturday at 3 pm.", "I call again on Saturday at 3 pm.", "I’ll call again in Saturday at 3 pm."], "correct": 0, "hint": "on day / at time", "why": "On Saturday, at 3 pm."}], "messages": [{"npc": "Have you sent her a message yet?", "choices": ["Yes, I’ve already sent one. ✅", "Yes, I already sent one.", "Yes, I’ve already send one."], "correct": 0, "hint": "already + present perfect", "why": "Already + present perfect: I’ve already sent."}, {"npc": "What did you write?", "choices": ["I wrote: “How have you been?”", "I have written: “How have you been?”", "I wrote: “How have you been?” yesterday (no time)."], "correct": 0, "hint": "past simple for a finished action", "why": "Past simple can describe a specific finished action."}, {"npc": "Have you ever tried voice messages?", "choices": ["No, I’ve never tried that.", "No, I never tried that (life experience).", "No, I haven’t try that."], "correct": 0, "hint": "never + present perfect", "why": "Never often uses present perfect for experience."}, {"npc": "It’s helpful. Have you heard her accent?", "choices": ["Yes, I have. I’ve listened carefully.", "Yes, I did. I listened carefully (no time).", "Yes, I have. I’ve listen carefully."], "correct": 0, "hint": "listened = past participle", "why": "I’ve listened carefully."}, {"npc": "Good. Have you practised irregular verbs?", "choices": ["A little. I’ve learned some irregular ones.", "A little. I learned some irregular ones yesterday (no time).", "A little. I’ve learn some irregular ones."], "correct": 0, "hint": "learned = regular participle", "why": "I’ve learned… is correct."}, {"npc": "Nice! Let’s practise together later.", "choices": ["Great idea! I’ll practise every day. 🌟", "Great idea! I’m practise every day.", "Great idea! I’ll practising every day."], "correct": 0, "hint": "will + base verb", "why": "I’ll practise (base)."}], "life": [{"npc": "What’s new with your volunteer work?", "choices": ["I’ve volunteered at a vet clinic and helped small animals.", "I volunteered at a vet clinic and help small animals (no time).", "I have volunteer at a vet clinic."], "correct": 0, "hint": "have + past participle", "why": "I’ve volunteered… (catching up)."}, {"npc": "What animals have you helped?", "choices": ["I’ve helped squirrels and injured birds.", "I’ve helped squirrel and injured bird.", "I helped squirrels and injured birds yesterday (no time)."], "correct": 0, "hint": "plural nouns", "why": "squirrels / birds plural."}, {"npc": "Have you worked with young people recently?", "choices": ["Yes, I have. I’ve done assessments and follow‑ups.", "Yes, I did. I’ve done assessments (mixed).", "Yes, I have. I’ve did assessments."], "correct": 0, "hint": "do → done", "why": "Past participle of do = done."}, {"npc": "How long have you done this role?", "choices": ["I’ve done it for a few months.", "I do it since a few months.", "I’ve done it since a few months."], "correct": 0, "hint": "for + duration", "why": "For + duration: for a few months."}, {"npc": "That’s impressive. Have you felt stressed?", "choices": ["Sometimes. It’s been a bit stressful.", "Sometimes. It has be a bit stressful.", "Sometimes. It’s being stressful."], "correct": 0, "hint": "It’s been + adjective", "why": "It’s been stressful (state)."}, {"npc": "Overall, how do you feel?", "choices": ["I feel motivated. I want to communicate clearly.", "I feel motivating. I want communicate clearly.", "I’m feel motivated. I want to communicate clearly."], "correct": 0, "hint": "feel + adjective", "why": "I feel motivated."}]};
  const BUILDER_BLOCKS=[{"cat": "Family", "txt": "My son lives in Finland, and he is married to a German woman."}, {"cat": "Family", "txt": "I’ve met my daughter-in-law, and she’s very kind."}, {"cat": "Family", "txt": "We’ve kept in touch by phone and messages."}, {"cat": "Travel", "txt": "I’ve planned a trip, but I haven’t visited Finland yet."}, {"cat": "Travel", "txt": "I’ve already looked at flights and tickets."}, {"cat": "Travel", "txt": "I’ll call again on Saturday at 3 pm."}, {"cat": "Volunteer", "txt": "I’ve volunteered at a vet clinic and helped small animals."}, {"cat": "Volunteer", "txt": "I’ve treated squirrels and injured birds, step by step."}, {"cat": "Volunteer", "txt": "I’ve also supported young people with assessments and follow-ups."}, {"cat": "Feelings", "txt": "It’s been challenging sometimes, but it’s rewarding."}, {"cat": "Feelings", "txt": "Overall, I feel motivated to improve my English."}];
  const ENSEMBLE_CHECKS=[{"label": "✅ 1 present perfect (I’ve / have / has + pp)", "pattern": "\\bI['’]ve\\b|\\bhas\\b|\\bhave\\b"}, {"label": "✅ 1 keyword (already / yet / just / ever / never)", "pattern": "\\b(already|yet|just|ever|never)\\b"}, {"label": "✅ 1 irregular past participle (been/gone/done/seen/written/met…)", "pattern": "\\b(been|gone|done|seen|written|met|spoken|taken|bought|taught|told|felt|come)\\b"}, {"label": "✅ 1 question in present perfect (Have you…?)", "pattern": "\\bHave you\\b"}, {"label": "✅ 1 past simple with finished time (yesterday/last…)", "pattern": "\\b(yesterday|last week|last month|last year)\\b"}, {"label": "✅ 2 prepositions (in/on/at/to/from/for/since)", "pattern": "\\b(in|on|at|to|from|for|since)\\b"}];

  // MCQ renderer with immediate feedback + why
  function renderMCQ(rootSel, bank, prefix, filterLevel=false){
    const root=$(rootSel); if(!root) return;
    const items = filterLevel ? bank.filter((q)=>{
      const t=(q.q||'') + ' ' + (q.why||'');
      if(t.toLowerCase().includes('b1 stretch')) return state.level==='B1';
      return true;
    }) : bank;

    root.innerHTML=items.map((q,i)=>{
      const id=`${prefix}_${i+1}`;
      const opts=shuffle(q.opts);
      const isB1 = (q.q||'').toLowerCase().includes('b1 stretch');
      return `
        <div class="qItem ${isB1?'lvlB1':''}" data-id="${esc(id)}" data-answer="${esc(q.a)}">
          <div class="qQ">${esc(q.q).replace('B1 stretch','B1 stretch 🌟')}</div>
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
        const h=hint.dataset.hint||''; setHint(h); fb.textContent='💡 '+h; fb.className='fb'; return;
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

  // Irregular table
  function renderIrregularTable(){
    const root=$('#irrTable'); if(!root) return;
    const head=`<div class="irrRow head"><div class="irrCell">Base</div><div class="irrCell">Past</div><div class="irrCell">Past participle</div><div class="irrCell">FR</div></div>`;
    const rows=IRREG.map(v=>`
      <div class="irrRow">
        <div class="irrCell">${esc(v.base)}</div>
        <div class="irrCell">${esc(v.past)}</div>
        <div class="irrCell">${esc(v.pp)} <small>(pp)</small></div>
        <div class="irrCell"><small>${esc(v.fr)}</small></div>
      </div>
    `).join('');
    root.innerHTML=head+rows;
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
  let dlgKey='call', dlgIndex=0, dlgWhyOpen=false;
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
    $('#dlgScenario').addEventListener('change',(e)=>{ dlgKey=e.target.value; restartDialogue(); });
    $('#btnDlgListen').addEventListener('click',()=>{ const s=curDlg()[dlgIndex]; speak(s.npc); });
    $('#btnDlgHint').addEventListener('click',()=>{
      const s=curDlg()[dlgIndex]; const fb=$('#dlgFb');
      if(!state.hints){ setHint('Hints are OFF.'); fb.textContent='Hints are OFF.'; fb.className='fb'; return; }
      setHint(s.hint||'Choose the most natural reply.');
      fb.textContent='💡 '+(s.hint||''); fb.className='fb';
    });
    $('#btnDlgWhy').addEventListener('click',()=>{ dlgWhyOpen=!dlgWhyOpen; $('#dlgExplain').classList.toggle('is-on'); });
    $('#btnDlgRestart').addEventListener('click',restartDialogue);

    $('#dlgChoices').addEventListener('click',(e)=>{
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

  // Irregular coach: select past participle in sentence
  function renderIrregularCoach(){
    const root=$('#irrCoach'); if(!root) return;
    const items=[
      {id:'ic1', before:"I’ve", verb:"see", after:"her photos.", a:"seen", opts:["saw","seen","seed"], hint:"see → seen"},
      {id:'ic2', before:"I’ve", verb:"write", after:"a message.", a:"written", opts:["wrote","written","write"], hint:"write → written"},
      {id:'ic3', before:"I’ve", verb:"do", after:"two calls today.", a:"done", opts:["did","done","do"], hint:"do → done"},
      {id:'ic4', before:"I’ve", verb:"be", after:"busy lately.", a:"been", opts:["was","been","be"], hint:"be → been"},
      {id:'ic5', before:"I’ve", verb:"meet", after:"her twice.", a:"met", opts:["meet","met","meeted"], hint:"meet → met"},
    ];
    root.innerHTML = items.map((it)=>{
      const id=`coach_${it.id}`;
      return `
        <div class="coachRow" data-id="${esc(id)}">
          <div class="sent">${esc(it.before)} <strong>___</strong> (${esc(it.verb)}) ${esc(it.after)}</div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <select data-answer="${esc(it.a)}">
              <option value="">—</option>
              ${it.opts.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join('')}
            </select>
            <button class="btn btn--ghost hintBtn" type="button" data-hint="${esc(it.hint)}">Hint</button>
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
        sel.value=sel.dataset.answer;
        sel.disabled=true;
        sel.classList.add('is-right');
        fb.textContent='✅ Correct';
        fb.className='fb good';
      }
    });

    root.addEventListener('click',(e)=>{
      const row=e.target.closest('.coachRow'); if(!row) return;
      const hint=e.target.closest('.hintBtn'); if(!hint) return;
      const fb=row.querySelector('.fb');
      if(!state.hints){ setHint('Hints are OFF.'); fb.textContent='Hints are OFF.'; fb.className='fb'; return; }
      const h=hint.dataset.hint||''; setHint(h); fb.textContent='💡 '+h; fb.className='fb';
    });

    root.addEventListener('change',(e)=>{
      const sel=e.target.closest('select'); if(!sel) return;
      const row=e.target.closest('.coachRow'); if(!row) return;
      const id=row.dataset.id;
      const fb=row.querySelector('.fb');
      const ans=sel.dataset.answer;
      const choice=sel.value;
      if(!choice){
        sel.classList.remove('is-right','is-wrong');
        fb.textContent=''; fb.className='fb';
        return;
      }
      if(choice===ans){
        sel.classList.remove('is-wrong');
        sel.classList.add('is-right');
        sel.disabled=true;
        fb.textContent='✅ Correct!';
        fb.className='fb good';
        markSolved(id,1);
        speak(choice);
      }else{
        sel.classList.add('is-wrong');
        fb.textContent='❌ Not yet.';
        fb.className='fb bad';
        markWrong();
      }
    });
  }

  // Builder blocks
  function renderBuilder(){
    const tabs=$('#bTabs'), grid=$('#bGrid');
    if(!tabs||!grid) return;

    const cats=['All',...Array.from(new Set(BUILDER_BLOCKS.map(b=>b.cat)))];
    tabs.innerHTML=cats.map((c,i)=>`<button class="tab ${i===0?'is-active':''}" type="button" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
    let active='All';

    function show(){
      const items=BUILDER_BLOCKS.filter(b=>active==='All'||b.cat===active);
      grid.innerHTML=items.map((b,idx)=>{
        const id=`blk_${active}_${idx}`.replace(/\s+/g,'_');
        return `
          <label class="block" data-id="${esc(id)}">
            <input type="checkbox" data-cat="${esc(b.cat)}" data-txt="${esc(b.txt)}"/>
            <div>
              <div class="meta">${esc(b.cat)}</div>
              <div class="txt">${esc(b.txt)}</div>
            </div>
          </label>
        `;
      }).join('');
    }

    show();

    tabs.addEventListener('click',(e)=>{
      const b=e.target.closest('.tab'); if(!b) return;
      $$('.tab',tabs).forEach(x=>x.classList.remove('is-active'));
      b.classList.add('is-active');
      active=b.dataset.cat;
      show();
    });

    grid.addEventListener('change',(e)=>{
      const cb=e.target.closest('input[type="checkbox"]'); if(!cb) return;
      const wrap=cb.closest('.block');
      wrap.classList.toggle('is-on', cb.checked);
    });

    $('#btnBuild').addEventListener('click',()=>{
      const checked=$$('#bGrid input[type="checkbox"]').filter(x=>x.checked).map(x=>x.dataset.txt);
      if(checked.length<3){
        setHint('Select at least 3 blocks (ideally 5–8).');
        return;
      }
      const addPast="Last week, I called and we talked for a few minutes.";
      const addQuestion="Have you been busy lately?";
      const out = (checked.join(' ') + ' ' + addQuestion + ' ' + addPast).replace(/\s+/g,' ').trim();
      $('#builderOut').textContent=out;
      markSolved('builder_built',1);
      setHint('Built! Now click Check to validate your checklist.');
    });

    $('#btnBuildListen').addEventListener('click',()=>{
      const t=$('#builderOut').textContent.trim();
      if(!t){ setHint('Build your text first.'); return; }
      speak(t);
    });

    $('#btnBuildCopy').addEventListener('click', async ()=>{
      const t=$('#builderOut').textContent.trim();
      if(!t){ setHint('Build your text first.'); return; }
      try{ await navigator.clipboard.writeText(t); setHint('Copied!'); }
      catch(e){ setHint('Copy failed. Select and copy manually.'); }
    });

    $('#btnBuildClear').addEventListener('click',()=>{
      $$('#bGrid input[type="checkbox"]').forEach(x=>x.checked=false);
      $$('#bGrid .block').forEach(b=>b.classList.remove('is-on'));
      $('#builderOut').textContent='';
      $('#builderChecklist').innerHTML='';
      setHint('Cleared.');
    });

    $('#btnBuildCheck').addEventListener('click',()=>{
      const t=$('#builderOut').textContent.trim();
      if(!t){ setHint('Build your text first.'); return; }
      renderChecklist(t);
    });
  }

  function renderChecklist(text){
    const box=$('#builderChecklist'); if(!box) return;
    const t=text||'';
    const checks = ENSEMBLE_CHECKS.map(c=>{
      const ok = new RegExp(c.pattern, 'i').test(t);
      return {ok, label:c.label};
    });

    // 2+ prepositions
    const prepMatches=(t.match(/\b(in|on|at|to|from|for|since)\b/gi)||[]).length;
    checks.forEach(ch=>{
      if(ch.label.includes('2 prepositions')) ch.ok = prepMatches>=2;
    });

    box.innerHTML = checks.map(ch=>`
      <div class="chk ${ch.ok?'ok':'bad'}">
        <div class="dot" aria-hidden="true"></div>
        <div>${esc(ch.label)} ${ch.ok?'<small>OK</small>':'<small>Missing — add it</small>'}</div>
      </div>
    `).join('');

    const allOk = checks.every(x=>x.ok);
    if(allOk){
      setHint('✅ Checklist complete! Great message.');
      markSolved('ensemble_ok',3);
    }else{
      setHint('Some items are missing. Add: Have you…? / last week / an irregular participle / etc.');
    }
  }

  // CLOE prompts + timer + writing
  const SPEAK_PROMPTS=[
    'Catching up call: give 4 updates using present perfect + ask 3 questions with “Have you…?”',
    'Talk about your family abroad: mention Finland + ask “Have you ever…?” + use already/yet.',
    'Give one update about volunteering and one about travel. Use two irregular participles (been/seen/written/done).',
    'Compare past vs present: say one thing you did last week (past simple) and one thing you’ve done recently (present perfect).'
  ];
  const WRITE_MODEL=[
    "Hi! How have you been?",
    "I’ve been busy lately, but I’m good.",
    "I’ve met my daughter-in-law, and she’s very kind.",
    "I haven’t visited Finland yet, but I’ve already planned a trip.",
    "I’ve seen her photos and I’ve written a short message.",
    "Have you been busy lately? Have you enjoyed Finland? Have you tried French food?",
    "Last week, I called and we talked for a few minutes.",
    "Take care! I’ll call again soon."
  ];

  function hookCLOE(){
    $('#btnNewPrompt').addEventListener('click',()=>{
      const p=SPEAK_PROMPTS[Math.floor(Math.random()*SPEAK_PROMPTS.length)];
      $('#speakPrompt').textContent=p;
      setHint('Speaking tip: short sentences + clear questions.');
    });
    $('#btnPromptListen').addEventListener('click',()=>speak($('#speakPrompt').textContent));

    // timer
    let timer=null; let seconds=60;
    function renderTime(){
      const mm=String(Math.floor(seconds/60)).padStart(2,'0');
      const ss=String(seconds%60).padStart(2,'0');
      $('#timerReadout').textContent=`${mm}:${ss}`;
    }
    renderTime();

    $('#btnTimer').addEventListener('click',()=>{
      if(timer) return;
      seconds=60; renderTime();
      timer=setInterval(()=>{
        seconds-=1; renderTime();
        if(seconds<=0){ clearInterval(timer); timer=null; speak('Time. Please stop.'); }
      },1000);
    });
    $('#btnTimerStop').addEventListener('click',()=>{
      if(timer){ clearInterval(timer); timer=null; }
      seconds=60; renderTime();
    });

    $('#btnWriteModel').addEventListener('click',()=>{
      for(let i=1;i<=8;i++){
        const el=$('#w'+i); if(el) el.value=WRITE_MODEL[i-1]||'';
      }
      const out=WRITE_MODEL.join(' ');
      $('#writeOut').textContent=out;
      speak(out);
      setHint('Model inserted. Personalize 2–3 details.');
    });

    $('#btnWriteCheck').addEventListener('click',()=>{
      const vals=[];
      for(let i=1;i<=8;i++){
        const v=($('#w'+i).value||'').trim();
        if(v) vals.push(v);
      }
      const out=vals.join(' ');
      $('#writeOut').textContent=out;

      let gained=0;
      for(let i=1;i<=8;i++){
        const val=($('#w'+i).value||'').trim();
        if(val.split(/\s+/).filter(Boolean).length>=3){
          if(markSolved('write_'+i,1)) gained+=1;
        }
      }

      const fb=$('#writeFb');
      if(out.length<140){
        fb.textContent='❌ Too short. Add questions + past time + 2 irregular participles.';
        fb.className='fb bad';
        markWrong();
        return;
      }
      fb.textContent = gained ? `✅ Checked. +${gained} point(s).` : '✅ Checked. Already counted.';
      fb.className='fb good';
      speak(out);
    });

    $('#btnWriteCopy').addEventListener('click', async ()=>{
      const txt=$('#writeOut').textContent.trim();
      if(!txt){ setHint('Write first, then click Check.'); return; }
      try{ await navigator.clipboard.writeText(txt); setHint('Copied!'); }
      catch(e){ setHint('Copy failed.'); }
    });
  }

  // Practice reset (clears dialogue/practice/builder)
  function resetPractice(){
    const keep={};
    Object.keys(state.solved||{}).forEach(k=>{
      const reset = k.startsWith('dlg_') || k.startsWith('prac_') || k.startsWith('fib') || k.startsWith('coach_') || k.startsWith('builder_') || k.startsWith('ensemble_') || k.startsWith('write_');
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
    const coach=document.querySelectorAll('#irrCoach .coachRow').length;
    const dlg=Object.values(DIALOGUES).reduce((a,x)=>a+(x?x.length:0),0);
    const builder=4;
    const writing=8;
    return mcq+fib+coach+dlg+builder+writing;
  }

  function init(){
    hookTopbar();
    applyPrefs();

    renderMCQ('#mcqPPForm', MCQ_PP_FORM, 'ppform');
    renderMCQ('#mcqPPUses', MCQ_PP_USES, 'ppuse');
    renderMCQ('#mcqPPvsPast', MCQ_PP_VS_PAST, 'ppvsp');
    renderMCQ('#mcqForSince', MCQ_FOR_SINCE, 'fors');
    renderIrregularTable();
    renderMCQ('#mcqIrregulars', MCQ_IRR, 'irr');

    renderVocab();

    dlgKey='call'; dlgIndex=0; dlgWhyOpen=false;
    renderDialogue();
    hookDialogue();

    renderMCQ('#mcqPractice', PRACTICE_MCQ, 'prac', true);
    renderFIB();
    renderIrregularCoach();
    renderBuilder();

    hookCLOE();

    TOTAL=computeTotal();
    updateHud();
    setHint('Start with Grammar (section 2), then Irregulars (section 3), then Dialogue, then Builder.');
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();