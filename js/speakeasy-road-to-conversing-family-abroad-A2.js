/* SpeakEasy — On the Road to Conversing (A2→A2.2) */
(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const clamp = (n,a,b) => Math.max(a, Math.min(b,n));
  const STORE_KEY = 'SET_road_to_conversing_family_abroad_A2_v1';

  function deepClone(o){ return JSON.parse(JSON.stringify(o)); }
  function norm(s){ return String(s||'').trim().toLowerCase().replace(/\s+/g,' '); }
  function esc(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function shuffle(arr){ const a = arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

  const DEFAULT_STATE = { score:0, streak:0, accent:'US', hints:true, solved:{} };
  let state = loadState();

  function loadState(){
    try{
      const raw = localStorage.getItem(STORE_KEY);
      if(!raw) return deepClone(DEFAULT_STATE);
      const p = JSON.parse(raw);
      return { ...deepClone(DEFAULT_STATE), ...p, solved: p.solved || {} };
    }catch(e){ return deepClone(DEFAULT_STATE); }
  }
  function saveState(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

  function setHint(t){ $('#hintBox').textContent = t; }

  // Speech
  let voiceCache = [];
  function refreshVoices(){ voiceCache = ('speechSynthesis' in window) ? speechSynthesis.getVoices() : []; }
  if('speechSynthesis' in window){ refreshVoices(); speechSynthesis.onvoiceschanged = refreshVoices; }

  function pickVoice(){
    const want = state.accent === 'UK' ? ['en-GB','en_GB'] : ['en-US','en_US'];
    return (voiceCache||[]).find(v => want.includes(v.lang)) ||
           (voiceCache||[]).find(v => (v.lang||'').toLowerCase().startsWith('en')) ||
           null;
  }
  function speak(text){
    if(!('speechSynthesis' in window)) return;
    try{
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice();
      if(v) u.voice = v;
      u.rate = 0.95;
      speechSynthesis.speak(u);
    }catch(e){}
  }
  function stopSpeak(){ if('speechSynthesis' in window) speechSynthesis.cancel(); }

  // Score
  let TOTAL = 0;
  function markSolved(id, pts=1){
    if(state.solved[id]) return false;
    state.solved[id] = true;
    state.score += pts;
    state.streak += 1;
    saveState();
    updateHud();
    return true;
  }
  function markWrong(){ state.streak = 0; saveState(); updateHud(); }

  function updateHud(){
    $('#scoreNow').textContent = String(state.score);
    $('#streakNow').textContent = String(state.streak);
    $('#scoreTotal').textContent = String(TOTAL);
    const pct = TOTAL ? Math.round((state.score / TOTAL) * 100) : 0;
    $('#progressPct').textContent = pct + '%';
    $('#progressBar').style.width = clamp(pct,0,100) + '%';
  }

  function applyPrefs(){
    $('#accentUS').classList.toggle('is-active', state.accent==='US');
    $('#accentUK').classList.toggle('is-active', state.accent==='UK');
    $('#hintsOn').classList.toggle('is-active', !!state.hints);
    $('#hintsOff').classList.toggle('is-active', !state.hints);
  }

  function hookTopbar(){
    $('#btnPrint').addEventListener('click', () => window.print());
    $('#btnResetAll').addEventListener('click', () => {
      if(!confirm('Reset ALL progress for this lesson?')) return;
      localStorage.removeItem(STORE_KEY);
      location.reload();
    });

    $('#accentUS').addEventListener('click', () => { state.accent='US'; saveState(); applyPrefs(); setHint('Accent set to US.'); });
    $('#accentUK').addEventListener('click', () => { state.accent='UK'; saveState(); applyPrefs(); setHint('Accent set to UK.'); });
    $('#hintsOn').addEventListener('click', () => { state.hints=true; saveState(); applyPrefs(); setHint('Hints ON.'); });
    $('#hintsOff').addEventListener('click', () => { state.hints=false; saveState(); applyPrefs(); setHint('Hints OFF.'); });
  }

  // Injected data
  const VOCAB = [{"cat": "Family & relationships", "icon": "👨‍👩‍👧‍👦", "en": "family", "fr": "famille", "def": "parents and children (people related to you)", "ex": "My family lives in different countries."}, {"cat": "Family & relationships", "icon": "👦", "en": "son", "fr": "fils", "def": "your male child", "ex": "My son lives in Denmark."}, {"cat": "Family & relationships", "icon": "👩‍🦰", "en": "daughter-in-law", "fr": "belle-fille", "def": "your son’s wife", "ex": "My daughter-in-law is German."}, {"cat": "Family & relationships", "icon": "💍", "en": "married", "fr": "marié(e)", "def": "having a husband or wife", "ex": "He is married."}, {"cat": "Family & relationships", "icon": "🤝", "en": "get along", "fr": "bien s’entendre", "def": "have a good relationship", "ex": "We get along very well."}, {"cat": "Communication", "icon": "📞", "en": "call", "fr": "appeler", "def": "phone someone", "ex": "I call them every week."}, {"cat": "Communication", "icon": "📹", "en": "video call", "fr": "appel vidéo", "def": "call with video", "ex": "We have a video call on Sundays."}, {"cat": "Communication", "icon": "💬", "en": "text / message", "fr": "envoyer un message", "def": "send a short written message", "ex": "I text my son in the evening."}, {"cat": "Communication", "icon": "🗣️", "en": "keep in touch", "fr": "rester en contact", "def": "stay connected regularly", "ex": "We keep in touch often."}, {"cat": "Communication", "icon": "🔁", "en": "repeat, please", "fr": "répétez, s’il vous plaît", "def": "ask someone to say it again", "ex": "Sorry, can you repeat, please?"}, {"cat": "Travel & visits", "icon": "✈️", "en": "visit", "fr": "rendre visite", "def": "go to see someone for a time", "ex": "I visited them last year."}, {"cat": "Travel & visits", "icon": "🏠", "en": "stay with", "fr": "loger chez", "def": "sleep at someone’s home", "ex": "I stayed with them for a week."}, {"cat": "Travel & visits", "icon": "🧳", "en": "trip", "fr": "voyage", "def": "a journey", "ex": "The trip was long but nice."}, {"cat": "Travel & visits", "icon": "📍", "en": "meet at", "fr": "se retrouver à", "def": "arrange to see someone in a place", "ex": "We met at the station."}, {"cat": "Travel & visits", "icon": "🍽️", "en": "have dinner", "fr": "dîner", "def": "eat an evening meal", "ex": "We had dinner together."}, {"cat": "Feelings & reactions", "icon": "😊", "en": "happy", "fr": "content(e)", "def": "feeling good", "ex": "I felt happy."}, {"cat": "Feelings & reactions", "icon": "🌟", "en": "proud", "fr": "fier / fière", "def": "feeling positive about someone", "ex": "I’m proud of my son."}, {"cat": "Feelings & reactions", "icon": "🎉", "en": "excited", "fr": "enthousiaste", "def": "very happy and looking forward to something", "ex": "I’m excited to visit again."}, {"cat": "Feelings & reactions", "icon": "😟", "en": "worried", "fr": "inquiet / inquiète", "def": "concerned", "ex": "Sometimes I feel worried."}, {"cat": "Feelings & reactions", "icon": "🤗", "en": "miss someone", "fr": "quelqu’un me manque", "def": "feel sad because they are far", "ex": "I miss them."}, {"cat": "Conversation tools", "icon": "🧩", "en": "then", "fr": "puis", "def": "next in time", "ex": "We had coffee, then we walked."}, {"cat": "Conversation tools", "icon": "➡️", "en": "after that", "fr": "après ça", "def": "next step", "ex": "After that, we visited a museum."}, {"cat": "Conversation tools", "icon": "💡", "en": "because", "fr": "parce que", "def": "gives a reason", "ex": "I was happy because we talked a lot."}, {"cat": "Conversation tools", "icon": "🪄", "en": "overall", "fr": "globalement", "def": "in general, in conclusion", "ex": "Overall, it was a great trip."}, {"cat": "Conversation tools", "icon": "❓", "en": "How was it?", "fr": "C’était comment ?", "def": "ask about an experience", "ex": "How was it in Denmark?"}, {"cat": "Countries & culture", "icon": "🇩🇰", "en": "Denmark", "fr": "Danemark", "def": "a country in Northern Europe", "ex": "Denmark is colder than France."}, {"cat": "Countries & culture", "icon": "🇩🇪", "en": "German", "fr": "allemand(e)", "def": "from Germany", "ex": "She is German."}, {"cat": "Countries & culture", "icon": "🧊", "en": "cold", "fr": "froid", "def": "low temperature", "ex": "It was very cold."}, {"cat": "Countries & culture", "icon": "🌲", "en": "nature", "fr": "nature", "def": "trees, lakes, outdoors", "ex": "Denmark has beautiful nature."}, {"cat": "Countries & culture", "icon": "🍞", "en": "traditional food", "fr": "nourriture traditionnelle", "def": "typical food from a place", "ex": "We tried traditional food."}];
  const MCQ_G1 = [{"q": "Choose the correct past simple:", "opts": ["I visited my son last year.", "I visit my son last year.", "I visiting my son last year."], "a": "I visited my son last year.", "hint": "Past time → past verb.", "why": "Last year is past → visited."}, {"q": "Choose the correct irregular past:", "opts": ["We went to a café.", "We goed to a café.", "We go to a café yesterday."], "a": "We went to a café.", "hint": "go → went.", "why": "Irregular past: go → went."}, {"q": "Choose the correct sentence:", "opts": ["I met her in 2023.", "I meet her in 2023.", "I metted her in 2023."], "a": "I met her in 2023.", "hint": "meet → met.", "why": "Irregular: meet → met."}, {"q": "Choose the correct past:", "opts": ["We had dinner.", "We have dinner yesterday.", "We haved dinner."], "a": "We had dinner.", "hint": "have → had.", "why": "Irregular: have → had."}];
  const MCQ_G2 = [{"q": "Choose the correct negative:", "opts": ["I didn’t travel last month.", "I didn’t traveled last month.", "I not traveled last month."], "a": "I didn’t travel last month.", "hint": "didn’t + base verb.", "why": "Negative past: didn’t + base verb."}, {"q": "Choose the correct form:", "opts": ["She didn’t go.", "She didn’t went.", "She not went."], "a": "She didn’t go.", "hint": "didn’t + base verb.", "why": "After didn’t, use go (not went)."}, {"q": "Choose the best:", "opts": ["We didn’t meet them.", "We didn’t met them.", "We not meet them."], "a": "We didn’t meet them.", "hint": "didn’t + base verb.", "why": "Use meet (base) after didn’t."}, {"q": "Choose the best:", "opts": ["I didn’t call yesterday.", "I didn’t called yesterday.", "I not called yesterday."], "a": "I didn’t call yesterday.", "hint": "didn’t + base verb.", "why": "Call stays base after didn’t."}];
  const MCQ_G3 = [{"q": "Choose the correct question:", "opts": ["Did you visit them?", "Do you visited them?", "Visited you them?"], "a": "Did you visit them?", "hint": "Did + subject + base verb.", "why": "Past question uses did + base verb."}, {"q": "Choose the correct wh‑question:", "opts": ["Where did you go?", "Where you went?", "Where did you went?"], "a": "Where did you go?", "hint": "did + base verb.", "why": "Use go (base) after did."}, {"q": "Choose the best short answer:", "opts": ["Yes, I did.", "Yes, I visited.", "Yes, I do."], "a": "Yes, I did.", "hint": "Short answer = did.", "why": "Did-question → Yes, I did."}, {"q": "Choose the correct question:", "opts": ["How was it last week?", "How is it yesterday?", "How was it?"], "a": "How was it last week?", "hint": "Past time → was.", "why": "Last week is past → was."}];
  const MCQ_G4 = [{"q": "Pick the best time marker:", "opts": ["two days ago", "two days after", "two days next"], "a": "two days ago", "hint": "Ago = past.", "why": "Ago indicates past time."}, {"q": "Order words:", "opts": ["first → then → after that", "because → so → however", "happy → proud → worried"], "a": "first → then → after that", "hint": "Sequence.", "why": "These show order in a story."}, {"q": "Reason connector:", "opts": ["because", "between", "before"], "a": "because", "hint": "Reason word.", "why": "Because introduces the reason."}, {"q": "Contrast connector:", "opts": ["however", "therefore", "beside"], "a": "however", "hint": "Opposite idea.", "why": "However introduces contrast."}];
  const MCQ_VOCAB = [{"q": "What does “daughter-in-law” mean?", "opts": ["belle-fille", "beau-frère", "grand-mère"], "a": "belle-fille", "hint": "It’s your son’s wife.", "why": "Daughter‑in‑law = belle‑fille."}, {"q": "Choose the best: “We ___ in touch.”", "opts": ["keep", "keeps", "keeping"], "a": "keep", "hint": "we + base verb", "why": "We keep in touch."}, {"q": "What is “video call” in French?", "opts": ["appel vidéo", "carte postale", "appel perdu"], "a": "appel vidéo", "hint": "Call with video", "why": "Video call = appel vidéo."}, {"q": "Choose the best reaction:", "opts": ["That’s great!", "You are wrong!", "Never!"], "a": "That’s great!", "hint": "Friendly reaction", "why": "That’s great! keeps conversation friendly."}, {"q": "Choose the best connector:", "opts": ["because", "butter", "between"], "a": "because", "hint": "Reason word", "why": "Because introduces the reason."}, {"q": "“miss someone” means…", "opts": ["quelqu’un me manque", "je m’en fiche", "je rigole"], "a": "quelqu’un me manque", "hint": "Feeling when someone is far", "why": "Miss someone = quelqu’un me manque."}];
  const MCQ_PRACTICE = [{"q": "Choose the best sentence:", "opts": ["Last week, I called my son.", "Last week, I call my son.", "Last week, I calling my son."], "a": "Last week, I called my son.", "hint": "Past time marker", "why": "Last week → called."}, {"q": "Choose the correct negative:", "opts": ["I didn’t meet her.", "I didn’t met her.", "I not meet her."], "a": "I didn’t meet her.", "hint": "didn’t + base verb", "why": "Meet stays base after didn’t."}, {"q": "Choose the correct question:", "opts": ["Did you like Denmark?", "Did you liked Denmark?", "Do you liked Denmark?"], "a": "Did you like Denmark?", "hint": "Did + base verb", "why": "After did, use like (base)."}, {"q": "Choose the best connector:", "opts": ["Then we went to a museum.", "Then we goes to a museum.", "Then we going to a museum."], "a": "Then we went to a museum.", "hint": "Past story", "why": "Went is past."}, {"q": "Choose the best reaction:", "opts": ["Really? That’s interesting!", "Really? You are stupid!", "Really? No."], "a": "Really? That’s interesting!", "hint": "Friendly reaction", "why": "Friendly reactions keep a conversation going."}, {"q": "Choose the best:", "opts": ["I felt happy because we talked a lot.", "I feel happy because we talked a lot.", "I felt happy because we talk a lot."], "a": "I felt happy because we talked a lot.", "hint": "Past + past", "why": "Past story: felt + talked."}, {"q": "Choose the correct form:", "opts": ["Where did you stay?", "Where did you stayed?", "Where you stayed?"], "a": "Where did you stay?", "hint": "did + base verb", "why": "Stay stays base after did."}, {"q": "Choose the best:", "opts": ["After that, we had dinner.", "After that, we have dinner.", "After that, we haved dinner."], "a": "After that, we had dinner.", "hint": "have → had", "why": "Irregular past: had."}];
  const MCQ_FINAL = [{"q": "Choose the correct past:", "opts": ["I saw them last year.", "I see them last year.", "I seed them last year."], "a": "I saw them last year.", "hint": "see → saw", "why": "Irregular: see → saw."}, {"q": "Choose the best question:", "opts": ["What did you do?", "What you did?", "What did you did?"], "a": "What did you do?", "hint": "did + base verb", "why": "Use do (base) after did."}, {"q": "Choose the best connector:", "opts": ["because", "became", "becoming"], "a": "because", "hint": "Reason word", "why": "Because gives a reason."}, {"q": "Choose the correct negative:", "opts": ["We didn’t go.", "We didn’t went.", "We not went."], "a": "We didn’t go.", "hint": "didn’t + base", "why": "Go stays base after didn’t."}, {"q": "Choose the best reaction:", "opts": ["Oh no… Are you ok?", "Oh no… Shut up.", "Oh no… Never."], "a": "Oh no… Are you ok?", "hint": "Supportive", "why": "Supportive language helps conversation."}, {"q": "Choose the best:", "opts": ["Overall, it was a great trip.", "Overally, it was a great trip.", "Overall, it is a great trip last year."], "a": "Overall, it was a great trip.", "hint": "Overall + past", "why": "Past story: was."}, {"q": "Choose the correct wh-question:", "opts": ["When did you visit?", "When you visited?", "When did you visited?"], "a": "When did you visit?", "hint": "did + base", "why": "Visit stays base after did."}, {"q": "Choose the best sentence:", "opts": ["We met at the station.", "We meet at the station yesterday.", "We metted at the station."], "a": "We met at the station.", "hint": "meet → met", "why": "Irregular: met."}, {"q": "Choose the best:", "opts": ["I’m going to visit again soon.", "I going to visit again soon.", "I’m going visit again soon."], "a": "I’m going to visit again soon.", "hint": "am going to + verb", "why": "Future plan form."}, {"q": "Choose the correct form:", "opts": ["I didn’t call, but I texted.", "I didn’t called, but I text.", "I not call, but I texted."], "a": "I didn’t call, but I texted.", "hint": "didn’t + base", "why": "Call stays base after didn’t."}];
  const DIALOGUES = {"family": [{"npcWho": "Son", "npc": "Hi! How are you today?", "choices": ["I’m fine, thanks! How are you? 😊", "I am fine yesterday.", "I fine."], "correct": 0, "hint": "Use: I’m fine + question back.", "why": "Natural: I’m fine, thanks! How are you?"}, {"npcWho": "You", "npc": "(Your turn) Ask about life in Denmark.", "choices": ["How is life in Denmark? 🇫🇮", "How life Denmark?", "How is Denmark life yesterday?"], "correct": 0, "hint": "How is life in…?", "why": "Correct structure: How is life in Denmark?"}, {"npcWho": "Son", "npc": "It’s going well. What did you do last weekend?", "choices": ["I visited friends, then I stayed home.", "I visit friends, then I stay home.", "I visited friends and then I staying home."], "correct": 0, "hint": "Past simple: visited / stayed.", "why": "Past story needs past verbs."}, {"npcWho": "Son", "npc": "Did you travel recently?", "choices": ["No, I didn’t. I was busy.", "No, I didn’t traveled.", "No, I not."], "correct": 0, "hint": "Short answer: No, I didn’t.", "why": "Did-question → No, I didn’t."}, {"npcWho": "Son", "npc": "When did you visit us last time?", "choices": ["I visited you last year.", "I visited you last time last year.", "I did visited you last year."], "correct": 0, "hint": "Simple: I visited you last year.", "why": "Short, clear past sentence is best."}, {"npcWho": "Son", "npc": "How did you feel during the visit?", "choices": ["I felt happy because we had time together.", "I feel happy because we have time together.", "I felt happy because we had time together yesterday and tomorrow."], "correct": 0, "hint": "Past: felt + had.", "why": "Past story: felt / had."}, {"npcWho": "Son", "npc": "Great! What are your plans now?", "choices": ["I’m going to call you every week, and I’m going to visit again soon.", "I go to call you every week.", "I’m going call you every week."], "correct": 0, "hint": "going to + verb.", "why": "Future plan: I’m going to call / visit."}], "friend": [{"npcWho": "Friend", "npc": "Hi! Long time no see. How was your last trip?", "choices": ["It was great! The weather was cold, but beautiful. ❄️", "It is great last trip.", "It was great and is."], "correct": 0, "hint": "Past: was.", "why": "Past trip → was."}, {"npcWho": "Friend", "npc": "Where did you go?", "choices": ["I went to Denmark to see my son.", "I went in Denmark.", "I goed to Denmark."], "correct": 0, "hint": "go → went; to Denmark.", "why": "Went is correct; use to + place."}, {"npcWho": "Friend", "npc": "What did you do there?", "choices": ["First we had dinner, then we walked in town.", "First we have dinner, then we walk.", "First we had dinner, then we walking."], "correct": 0, "hint": "had / walked.", "why": "Past sequence: had → walked."}, {"npcWho": "Friend", "npc": "Did you meet his wife?", "choices": ["Yes, I did! She was very kind.", "Yes, I met.", "Yes, I do."], "correct": 0, "hint": "Yes, I did.", "why": "Did-question → Yes, I did."}, {"npcWho": "Friend", "npc": "What did you like the most?", "choices": ["I liked the nature the most. 🌲", "I like the nature the most last year.", "I liked most the nature."], "correct": 0, "hint": "I liked… the most.", "why": "Natural: I liked the nature the most."}, {"npcWho": "Friend", "npc": "Any advice for Denmark?", "choices": ["Bring warm clothes and try traditional food!", "Bring the warm clothes and you try food.", "Bring warm clothes and tried food."], "correct": 0, "hint": "Imperatives + base verbs.", "why": "Advice: Bring… Try…"}], "planning": [{"npcWho": "Son", "npc": "When are you coming to visit again?", "choices": ["I’m going to visit in the summer.", "I’m visit in the summer.", "I go to visit in the summer."], "correct": 0, "hint": "I’m going to visit…", "why": "Future plan: am going to + verb."}, {"npcWho": "Son", "npc": "How long will you stay?", "choices": ["I’m going to stay for one week.", "I’m stay for one week.", "I stayed for one week."], "correct": 0, "hint": "going to stay", "why": "Plan: I’m going to stay…"}, {"npcWho": "Son", "npc": "Do you want to stay with us?", "choices": ["Yes, I’d love to. Thank you!", "Yes, I want.", "Yes, I love."], "correct": 0, "hint": "I’d love to.", "why": "Polite: Yes, I’d love to."}, {"npcWho": "Son", "npc": "Do you need help booking flights?", "choices": ["Yes, please. Could you help me?", "Yes, you can help me.", "Yes, help me now."], "correct": 0, "hint": "Could you…?", "why": "Polite request: Could you help me?"}, {"npcWho": "Son", "npc": "Great. What time should we meet?", "choices": ["Let’s meet at the station at 3 pm.", "Let’s meet to the station.", "We meet at 3 pm station."], "correct": 0, "hint": "meet at + place + time.", "why": "Meet at the station at 3 pm."}, {"npcWho": "Son", "npc": "Perfect. Anything else?", "choices": ["That’s all for now. I’m excited! 🎉", "That’s all. I excited.", "For now that’s all excited."], "correct": 0, "hint": "I’m excited.", "why": "Use I’m + adjective: I’m excited."}]};
  const DND = [{"t": "last week", "cat": "time"}, {"t": "two days ago", "cat": "time"}, {"t": "in 2023", "cat": "time"}, {"t": "yesterday", "cat": "time"}, {"t": "first", "cat": "connectors"}, {"t": "then", "cat": "connectors"}, {"t": "after that", "cat": "connectors"}, {"t": "because", "cat": "connectors"}, {"t": "visited", "cat": "verbs"}, {"t": "went", "cat": "verbs"}, {"t": "met", "cat": "verbs"}, {"t": "had", "cat": "verbs"}, {"t": "happy", "cat": "feelings"}, {"t": "proud", "cat": "feelings"}, {"t": "excited", "cat": "feelings"}, {"t": "worried", "cat": "feelings"}];
  const BUILDER_ACTS = [{"id": "act1", "txt": "we had dinner 🍽️"}, {"id": "act2", "txt": "we walked in town 🚶"}, {"id": "act3", "txt": "we visited a museum 🏛️"}, {"id": "act4", "txt": "we met friends ☕"}, {"id": "act5", "txt": "we talked a lot 💬"}, {"id": "act6", "txt": "we stayed at home 🏠"}];
  const PROMPTS = ["Describe your personal situation and tell a short story about a recent visit or call.", "Tell a short story: where did you go, what did you do, and how did you feel?", "Talk about your family abroad: how do you keep in touch, and what are your plans?", "Ask 4 questions to continue a friendly conversation (use Did…? and Wh‑questions).", "Compare two places you know (use: colder than / better than / the most…)."];
  const WRITE_MODEL = ["My son lives in Denmark and he is married to a German woman.", "We keep in touch by phone and video calls.", "Last year, I visited them and I felt happy because we had time together.", "First we had dinner, then we walked in town.", "Overall, it was a great trip and I’m going to visit again soon."];

  // Vocab
  function renderVocab(){
    const tabs = $('#vTabs');
    const grid = $('#vocabGrid');
    const search = $('#vSearch');

    const cats = ['All', ...Array.from(new Set(VOCAB.map(v => v.cat)))];
    tabs.innerHTML = cats.map((c,i) => `<button class="tab ${i===0?'is-active':''}" type="button" data-cat="${esc(c)}">${esc(c)}</button>`).join('');

    let active = 'All';

    function show(cat, q){
      const query = norm(q||'');
      grid.innerHTML = VOCAB
        .filter(v => cat==='All' || v.cat===cat)
        .filter(v => !query || norm(v.en).includes(query) || norm(v.fr).includes(query) || norm(v.ex||'').includes(query))
        .map((v, idx) => `
          <button class="vcard" type="button" data-en="${esc(v.en)}" aria-label="Vocab card ${idx+1}">
            <div class="vcard__top">
              <div class="vcard__icon" aria-hidden="true">${v.icon}</div>
              <div class="vcard__term">${esc(v.en)}</div>
            </div>
            <div class="vcard__meta"><span class="tag">${esc(v.cat)}</span> • FR: <strong>${esc(v.fr)}</strong> • tap to flip</div>
            <div class="vcard__def">
              <div><strong>FR:</strong> ${esc(v.fr)}</div>
              <div><strong>Meaning:</strong> ${esc(v.def)}</div>
              ${v.ex ? `<div style="margin-top:6px;"><strong>Example:</strong> ${esc(v.ex)}</div>` : ''}
              <div style="margin-top:8px;color:rgba(247,248,251,.78)"><span class="kbd">Tip</span> Tap again to hide.</div>
            </div>
          </button>
        `).join('');
    }

    show(active, '');

    tabs.addEventListener('click', (e) => {
      const b = e.target.closest('.tab');
      if(!b) return;
      $$('.tab', tabs).forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      active = b.dataset.cat;
      show(active, search.value);
    });

    search.addEventListener('input', () => show(active, search.value));

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.vcard');
      if(!card) return;
      card.classList.toggle('is-flipped');
      speak(card.dataset.en);
    });

    $('#btnVocabListen').addEventListener('click', () => speak(VOCAB.map(v => `${v.en}. ${v.def}.`).join(' ')));
    $('#btnVocabStop').addEventListener('click', stopSpeak);
  }

  // MCQ (options shuffled so answer isn't always A)
  function renderMCQ(rootSel, bank, prefix){
    const root = $(rootSel);
    root.innerHTML = bank.map((q, i) => {
      const id = `${prefix}_${i+1}`;
      const opts = shuffle(q.opts);
      return `
        <div class="qItem" data-id="${esc(id)}" data-answer="${esc(q.a)}">
          <div class="qQ">${esc(q.q)}</div>
          <div class="opts">
            ${opts.map(opt => `<button class="opt" type="button" data-choice="${esc(opt)}">${esc(opt)}</button>`).join('')}
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;">
            <button class="btn btn--ghost hintBtn" type="button" data-hint="${esc(q.hint||'Think about grammar + meaning.')}">Hint</button>
            <button class="btn btn--ghost whyBtn" type="button">Why?</button>
            <button class="btn btn--ghost speakBtn" type="button" title="Listen">🔊 Listen</button>
          </div>
          <div class="fb" aria-live="polite"></div>
          <div class="explain" aria-live="polite">${esc(q.why||'')}</div>
        </div>
      `;
    }).join('');

    // restore solved
    $$('.qItem', root).forEach(item => {
      const id = item.dataset.id;
      if(state.solved[id]){
        item.querySelectorAll('.opt').forEach(b => b.disabled = true);
        const fb = item.querySelector('.fb');
        fb.textContent = '✅ Already solved';
        fb.className = 'fb good';
      }
    });

    root.addEventListener('click', (e) => {
      const item = e.target.closest('.qItem');
      if(!item) return;

      const id = item.dataset.id;
      const fb = item.querySelector('.fb');
      const ex = item.querySelector('.explain');

      const opt = e.target.closest('.opt');
      const hintBtn = e.target.closest('.hintBtn');
      const whyBtn = e.target.closest('.whyBtn');
      const speakBtn = e.target.closest('.speakBtn');

      if(speakBtn){ speak(item.querySelector('.qQ')?.textContent || ''); return; }
      if(whyBtn){ ex.classList.toggle('is-on'); return; }

      if(hintBtn){
        if(!state.hints){ setHint('Hints are OFF. Turn them on in the top bar.'); fb.textContent='Hints are OFF.'; fb.className='fb'; return; }
        const h = hintBtn.dataset.hint || '';
        setHint(h);
        fb.textContent = '💡 ' + h;
        fb.className = 'fb';
        return;
      }

      if(!opt) return;

      const already = !!state.solved[id];
      const answer = item.dataset.answer;
      const choice = opt.dataset.choice;

      if(choice === answer){
        opt.classList.add('is-right');
        fb.textContent = already ? '✅ Correct (practice mode)' : '✅ Correct!';
        fb.className = 'fb good';
        item.querySelectorAll('.opt').forEach(b => b.disabled = true);
        if(ex.textContent.trim()) ex.classList.add('is-on');
        if(!already) markSolved(id, 1);
      }else{
        opt.classList.add('is-wrong');
        fb.textContent = '❌ Not yet. Try again.';
        fb.className = 'fb bad';
        markWrong();
      }
    });
  }

  // FIB
  function hookFIB(){
    $$('input[data-answer]').forEach(inp => {
      const id = inp.dataset.id;
      const ans = inp.dataset.answer;
      const row = inp.closest('.fibRow');
      const fb = row ? row.querySelector('.fb') : null;
      const hintBtn = row ? row.querySelector('.hintBtn') : null;

      if(state.solved[id]){
        inp.value = ans;
        inp.disabled = true;
        inp.classList.add('is-right');
        if(fb){ fb.textContent='✅ Correct'; fb.className='fb good'; }
        return;
      }

      if(hintBtn){
        hintBtn.addEventListener('click', () => {
          if(!state.hints){ setHint('Hints are OFF. Turn them on in the top bar.'); if(fb){ fb.textContent='Hints are OFF.'; fb.className='fb'; } return; }
          const h = hintBtn.dataset.hint || '';
          setHint(h);
          if(fb){ fb.textContent='💡 ' + h; fb.className='fb'; }
        });
      }

      inp.addEventListener('input', () => {
        const v = norm(inp.value);
        const a = norm(ans);
        if(v === a){
          inp.classList.remove('is-wrong');
          inp.classList.add('is-right');
          inp.disabled = true;
          if(fb){ fb.textContent='✅ Correct!'; fb.className='fb good'; }
          markSolved(id, 1);
          return;
        }
        if(v.length >= Math.max(3, a.length)){
          inp.classList.add('is-wrong');
          if(fb){ fb.textContent='❌ Not quite. Try again.'; fb.className='fb bad'; }
          markWrong();
        }else{
          inp.classList.remove('is-wrong');
          inp.classList.remove('is-right');
          if(fb){ fb.textContent=''; fb.className='fb'; }
        }
      });
    });
  }

  // DnD + tap mode (tokens are shuffled)
  let selectedToken = null;

  function renderDnD(){
    const bank = $('#tokenBank');
    const shuffled = shuffle(DND);
    bank.innerHTML = shuffled.map((x, i) => {
      const id = `dnd_${i+1}`;
      const locked = !!state.solved[id];
      return `<button class="token ${locked?'is-locked':''}" type="button" draggable="${locked?'false':'true'}" data-id="${id}" data-cat="${esc(x.cat)}" data-text="${esc(x.t)}" ${locked?'disabled':''}>${esc(x.t)}</button>`;
    }).join('');
  }

  function dndFeedback(msg, kind=''){
    const box = $('#dndFeedback');
    box.textContent = msg;
    box.style.color = kind==='good' ? 'rgba(52,211,153,.95)' : (kind==='bad' ? 'rgba(251,113,133,.95)' : 'rgba(247,248,251,.78)');
  }

  function lockToken(tok){
    tok.classList.add('is-locked');
    tok.disabled = true;
    tok.draggable = false;
    tok.classList.remove('is-selected');
    selectedToken = null;
  }

  function handleTokenToZone(tok, cat, zoneEl){
    const correct = tok.dataset.cat;
    const id = tok.dataset.id;
    const drop = zoneEl.querySelector('.zone__drop');
    if(!drop) return;

    if(cat === correct){
      drop.appendChild(tok);
      lockToken(tok);
      zoneEl.classList.add('is-hot');
      setTimeout(() => zoneEl.classList.remove('is-hot'), 240);
      dndFeedback(`✅ Correct: “${tok.dataset.text}” → ${cat}`, 'good');
      if(!state.solved[id]) markSolved(id, 1);
      speak(tok.dataset.text);
    }else{
      zoneEl.classList.add('is-bad');
      setTimeout(() => zoneEl.classList.remove('is-bad'), 330);
      dndFeedback('❌ Not correct. Try another box.', 'bad');
      markWrong();
      if(state.hints) setHint('DnD hint: Time / Connector / Past verb / Feeling.');
    }
  }

  function attachDnD(){
    const bank = $('#tokenBank');

    bank.addEventListener('dragstart', (e) => {
      const tok = e.target.closest('.token');
      if(!tok || tok.disabled) return;
      e.dataTransfer.setData('text/plain', tok.dataset.id);
      e.dataTransfer.effectAllowed = 'move';
    });

    $$('.zone').forEach(zone => {
      const drop = zone.querySelector('.zone__drop');
      const cat = drop.dataset.cat;

      zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('is-hot'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('is-hot'));

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('is-hot');
        const id = e.dataTransfer.getData('text/plain');
        const tok = $$('.token').find(t => t.dataset.id === id);
        if(!tok) return;
        handleTokenToZone(tok, cat, zone);
      });

      zone.addEventListener('click', () => {
        if(!selectedToken) return;
        handleTokenToZone(selectedToken, cat, zone);
      });

      zone.addEventListener('keydown', (ev) => {
        if(ev.key==='Enter' || ev.key===' '){
          ev.preventDefault();
          if(!selectedToken) return;
          handleTokenToZone(selectedToken, cat, zone);
        }
      });
    });

    bank.addEventListener('click', (e) => {
      const tok = e.target.closest('.token');
      if(!tok || tok.disabled) return;

      if(selectedToken && selectedToken !== tok) selectedToken.classList.remove('is-selected');

      if(tok.classList.contains('is-selected')){
        tok.classList.remove('is-selected');
        selectedToken = null;
        dndFeedback('Tap mode: tap a token → then tap a box.');
      }else{
        tok.classList.add('is-selected');
        selectedToken = tok;
        dndFeedback(`Selected: “${tok.dataset.text}” → now tap a box.`);
      }
    });
  }

  // Dialogue Lab
  let dlgKey = 'family';
  let dlgIndex = 0;
  let dlgWhyOpen = false;

  function curDlg(){ return DIALOGUES[dlgKey] || []; }

  function renderDialogue(){
    const steps = curDlg();
    const step = steps[dlgIndex];
    if(!step) return;

    $('#dlgCount').textContent = `${dlgIndex+1} / ${steps.length}`;
    const sid = `dlg_${dlgKey}_${dlgIndex+1}`;
    $('#dlgMode').textContent = state.solved[sid] ? 'Practice' : 'Scoring';

    $('#dlgNpc').innerHTML = `<div class="dlgLine"><span class="who">${esc(step.npcWho)}:</span> ${esc(step.npc)}</div>`;
    $('#dlgChoices').innerHTML = step.choices.map((c,i) => `<button class="choice" type="button" data-i="${i}">${esc(c)}</button>`).join('');

    $('#dlgFb').textContent = '';
    $('#dlgFb').className = 'fb';

    $('#dlgExplain').textContent = step.why || '';
    $('#dlgExplain').className = 'explain' + (dlgWhyOpen ? ' is-on' : '');
  }

  function advanceDialogue(){
    const steps = curDlg();
    dlgIndex = Math.min(steps.length - 1, dlgIndex + 1);
    dlgWhyOpen = false;
    renderDialogue();
  }

  function restartDialogue(){
    dlgIndex = 0;
    dlgWhyOpen = false;
    renderDialogue();
    setHint('Dialogue restarted.');
  }

  function hookDialogue(){
    $('#dlgScenario').addEventListener('change', (e) => {
      dlgKey = e.target.value;
      restartDialogue();
    });

    $('#btnDlgListen').addEventListener('click', () => {
      const step = curDlg()[dlgIndex];
      speak(`${step.npcWho}. ${step.npc}`);
    });

    $('#btnDlgHint').addEventListener('click', () => {
      const step = curDlg()[dlgIndex];
      const fb = $('#dlgFb');
      if(!state.hints){ setHint('Hints are OFF.'); fb.textContent='Hints are OFF.'; fb.className='fb'; return; }
      setHint(step.hint || 'Choose the most natural English reply.');
      fb.textContent = '💡 ' + (step.hint || '');
      fb.className = 'fb';
    });

    $('#btnDlgWhy').addEventListener('click', () => {
      dlgWhyOpen = !dlgWhyOpen;
      $('#dlgExplain').classList.toggle('is-on');
    });

    $('#btnDlgRestart').addEventListener('click', restartDialogue);

    $('#dlgChoices').addEventListener('click', (e) => {
      const b = e.target.closest('.choice');
      if(!b) return;

      const step = curDlg()[dlgIndex];
      const idx = Number(b.dataset.i);
      const fb = $('#dlgFb');
      const sid = `dlg_${dlgKey}_${dlgIndex+1}`;
      const already = !!state.solved[sid];

      if(idx === step.correct){
        b.classList.add('is-right');
        fb.textContent = already ? '✅ Correct (practice mode). Next!' : '✅ Correct! Next line unlocked.';
        fb.className = 'fb good';
        if(!already) markSolved(sid, 1);
        setTimeout(advanceDialogue, 650);
      }else{
        b.classList.add('is-wrong');
        fb.textContent = '❌ Not quite. Try another reply.';
        fb.className = 'fb bad';
        markWrong();
      }
    });
  }

  // Builder
  function renderBuilderActs(){
    const box = $('#bActivities');
    box.innerHTML = BUILDER_ACTS.map(a => `
      <label class="pick">
        <input type="checkbox" data-act="${esc(a.txt)}" />
        <div>${esc(a.txt)}</div>
      </label>
    `).join('');
  }

  function buildText(){
    const level = $('#bLevel').value;
    const core = ($('#bCore').value || '').trim();
    const time = $('#bTime').value;
    const feel = $('#bFeel').value;
    const plan = $('#bPlan').value;

    const acts = $$('input[type="checkbox"][data-act]', $('#bActivities'))
      .filter(x => x.checked)
      .map(x => x.dataset.act)
      .slice(0,3);

    const actSentence = acts.length >= 2
      ? `First ${acts[0]}, then ${acts[1]}.`
      : (acts.length === 1 ? `First ${acts[0]}. Then we talked a lot.` : 'First we had dinner, then we walked in town.');

    const reasonLine = `I felt ${feel} because we spent time together.`;

    const A2 = [
      'Hi, I’d like to introduce myself.',
      core || 'My family lives abroad.',
      'We keep in touch by phone and video calls.',
      `The last time I visited was ${time}.`,
      actSentence,
      reasonLine,
      plan,
      'Overall, I’m motivated to improve my English.'
    ];

    const A2plus = [
      'Hi, I’d like to introduce myself clearly.',
      core || 'My family lives abroad.',
      'We keep in touch regularly, and we try to talk often.',
      `The last time I visited was ${time}, I had a great experience.`,
      actSentence + ' After that, we talked a lot.',
      reasonLine + ' However, sometimes I miss them.',
      plan + ' That’s why I practise English to communicate better.',
      'Overall, this helps me feel confident when I speak.'
    ];

    const out = (level === 'A2plus' ? A2plus : A2).join(' ');
    $('#builderOut').textContent = out;
    return out;
  }

  function hookBuilder(){
    $('#btnBuild').addEventListener('click', () => {
      buildText();
      setHint('Built! Now click Listen if you want audio.');
    });

    $('#btnBuildListen').addEventListener('click', () => {
      const txt = $('#builderOut').textContent.trim();
      if(!txt){ setHint('Build your text first.'); return; }
      speak(txt);
    });

    $('#btnBuildCopy').addEventListener('click', async () => {
      const txt = $('#builderOut').textContent.trim();
      if(!txt){ setHint('Build your text first.'); return; }
      try{ await navigator.clipboard.writeText(txt); setHint('Copied!'); }
      catch(e){ setHint('Copy failed. Select and copy manually.'); }
    });

    $('#btnBuildClear').addEventListener('click', () => {
      $('#builderOut').textContent = '';
      $$('input[type="checkbox"][data-act]', $('#bActivities')).forEach(x => x.checked = false);
      setHint('Cleared.');
    });
  }

  // CLOE
  function hookCLOE(){
    $('#btnNewPrompt').addEventListener('click', () => {
      const p = PROMPTS[Math.floor(Math.random()*PROMPTS.length)];
      $('#speakPrompt').textContent = p;
      setHint('Use structure: who → past story → feeling → plan → conclusion.');
    });

    $('#btnPromptListen').addEventListener('click', () => speak($('#speakPrompt').textContent));

    // timer
    let timer = null;
    let seconds = 60;
    function renderTime(){
      const mm = String(Math.floor(seconds/60)).padStart(2,'0');
      const ss = String(seconds%60).padStart(2,'0');
      $('#timerReadout').textContent = `${mm}:${ss}`;
    }
    renderTime();

    $('#btnTimer').addEventListener('click', () => {
      if(timer) return;
      seconds = 60;
      renderTime();
      timer = setInterval(() => {
        seconds -= 1;
        renderTime();
        if(seconds <= 0){
          clearInterval(timer); timer = null;
          speak('Time. Please stop.');
        }
      }, 1000);
    });

    $('#btnTimerStop').addEventListener('click', () => {
      if(timer){ clearInterval(timer); timer = null; }
      seconds = 60; renderTime();
    });

    // writing
    $('#btnWriteModel').addEventListener('click', () => {
      const inputs = [$('#w1'),$('#w2'),$('#w3'),$('#w4'),$('#w5'),$('#w6'),$('#w7'),$('#w8')];
      inputs.forEach((el,i) => el.value = WRITE_MODEL[i] || '');
      const out = WRITE_MODEL.filter(Boolean).join(' ');
      $('#writeOut').textContent = out;
      speak(out);
      setHint('Model inserted. Personalize 2–3 details.');
    });

    $('#btnWriteCheck').addEventListener('click', () => {
      const vals = [$('#w1').value,$('#w2').value,$('#w3').value,$('#w4').value,$('#w5').value,$('#w6').value,$('#w7').value,$('#w8').value]
        .map(v => (v||'').trim()).filter(Boolean);

      const out = vals.join(' ');
      $('#writeOut').textContent = out;

      let gained = 0;
      for(let i=1;i<=8;i++){
        const val = ($('#w'+i).value || '').trim();
        if(val.split(/\s+/).filter(Boolean).length >= 3){
          const id = 'write_' + i;
          if(markSolved(id, 1)) gained += 1;
        }
      }

      const fb = $('#writeFb');
      if(out.length < 60){
        fb.textContent = '❌ Too short. Add past story + feeling + plan.';
        fb.className = 'fb bad';
        markWrong();
        return;
      }
      fb.textContent = gained ? `✅ Checked. +${gained} point(s).` : '✅ Checked. Already counted.';
      fb.className = 'fb good';
      speak(out);
    });

    $('#btnWriteCopy').addEventListener('click', async () => {
      const txt = $('#writeOut').textContent.trim();
      if(!txt){ setHint('Write first, then click Check.'); return; }
      try{ await navigator.clipboard.writeText(txt); setHint('Copied!'); }
      catch(e){ setHint('Copy failed. Select and copy manually.'); }
    });
  }

  // Cheat
  function hookCheat(){
    $('#btnCheatCopy').addEventListener('click', async () => {
      try{ await navigator.clipboard.writeText($('#cheat').innerText.trim()); setHint('Cheat sheet copied.'); }
      catch(e){ setHint('Copy failed.'); }
    });
    $('#btnCheatListen').addEventListener('click', () => speak($('#cheat').innerText));
  }

  // Practice reset (practice + dialogue + DnD + FIB + writing)
  function resetPractice(){
    const keep = {};
    Object.keys(state.solved || {}).forEach(k => {
      const isPractice = k.startsWith('p_') || k.startsWith('fib') || k.startsWith('dnd_') || k.startsWith('dlg_') || k.startsWith('write_');
      if(!isPractice) keep[k] = true;
    });
    state.solved = keep;
    // score recompute (1 point per solved item)
    state.score = Object.keys(state.solved).length;
    state.streak = 0;
    saveState();
    location.hash = '#practice';
    location.reload();
  }

  function computeTotal(){
    const mcq = $$('.quiz .qItem').length;
    const fib = $$('input[data-answer]').length;
    const dnd = DND.length;
    const dlg = (DIALOGUES.family.length + DIALOGUES.friend.length + DIALOGUES.planning.length);
    const write = 8;
    return mcq + fib + dnd + dlg + write;
  }

  function init(){
    hookTopbar();
    applyPrefs();

    renderMCQ('#mcqG1', MCQ_G1, 'g1');
    renderMCQ('#mcqG2', MCQ_G2, 'g2');
    renderMCQ('#mcqG3', MCQ_G3, 'g3');
    renderMCQ('#mcqG4', MCQ_G4, 'g4');
    renderMCQ('#mcqVocab', MCQ_VOCAB, 'v');
    renderMCQ('#mcqPractice', MCQ_PRACTICE, 'p');
    renderMCQ('#mcqFinal', MCQ_FINAL, 'f');

    renderVocab();
    renderBuilderActs();

    // Dialogue
    dlgKey = 'family';
    dlgIndex = 0;
    renderDialogue();
    hookDialogue();

    hookFIB();
    renderDnD();
    attachDnD();
    dndFeedback('Tap mode: tap a token → then tap a box.');

    hookBuilder();
    hookCLOE();
    hookCheat();

    $('#btnResetPractice').addEventListener('click', () => {
      if(!confirm('Reset Practice + Dialogue scoring (to test again)?')) return;
      resetPractice();
    });

    TOTAL = computeTotal();
    updateHud();
    setHint('Start with Grammar (section 2), then Dialogue Lab, then Builder.');
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();