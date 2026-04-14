/* SpeakEasyTisha — Myriam Hobbies Essay Booster
   No external libraries • touch-friendly • Mac/iPad Safari compatible */
(() => {
  'use strict';

  // Loader flag (used by HTML to detect missing JS)
  try{ window.__SE_MyriamHobbiesBoosterLoaded = true; }catch(e){}


  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const pad2 = (n) => String(n).padStart(2,'0');
  const fmtTime = (sec) => `${pad2(Math.floor(sec/60))}:${pad2(sec%60)}`;
  const shuffle = (arr) => {
    const a = Array.isArray(arr) ? arr.slice() : [];
    for (let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  };
  const escapeHtml = (s) => (s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  const showErr = (msg) => {
    const box = document.getElementById('errBox');
    if(!box) return;
    box.hidden = false;
    box.textContent = '⚠️ ' + msg;
  };
  window.addEventListener('error', (e) => {
    try{
      const msg = (e && e.message) ? e.message : String(e);
      const where = (e && (e.filename || e.lineno || e.colno)) ? `\n${e.filename || ''}:${e.lineno || ''}:${e.colno || ''}` : '';
      const st = (e && e.error && e.error.stack) ? `\n${e.error.stack}` : '';
      showErr(msg + where + st);
    }catch(_){}
  });
  window.addEventListener('unhandledrejection', (e) => {
    try{ showErr((e && e.reason) ? String(e.reason) : 'Unhandled promise rejection'); }catch(_){}
  });
  const safeOn = (id, ev, fn) => {
    const el = document.getElementById(id);
    if(!el){ showErr('Missing element: #' + id); return; }
    el.addEventListener(ev, (evt) => { try{ fn(evt); }catch(err){ showErr(String(err)); } });
  };

  const toast = (msg) => {
    let el = $('#toast');
    if(!el){
      el = document.createElement('div');
      el.id = 'toast';
      el.style.position = 'fixed';
      el.style.left = '16px';
      el.style.bottom = '16px';
      el.style.padding = '10px 12px';
      el.style.background = 'rgba(0,0,0,.72)';
      el.style.border = '1px solid rgba(255,255,255,.14)';
      el.style.borderRadius = '14px';
      el.style.color = 'white';
      el.style.zIndex = '9999';
      el.style.maxWidth = '80vw';
      el.style.boxShadow = '0 14px 30px rgba(0,0,0,.35)';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.display = 'block';
    if(toast._t) clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.style.display = 'none'; }, 1700);
  };

  const copyToClipboard = async (txt, okMsg) => {
    try{ await navigator.clipboard.writeText(txt); toast(okMsg || 'Copied.'); }
    catch(e){ toast('Copy blocked. Select and copy manually.'); }
  };

  const state = {
    level: 'A2',
    fr: false,
    accent: 'US',
    rate: 1.0,
    score: { correct: 0, total: 0 },
    timers: { write:null, sp:null },
    flash: { open:false, idx:0, flipped:false, list:[] }
  };

  const PREF_KEY = 'se_myrim_hobbies_booster_v1';
  const loadPrefs = () => {
    try{
      const raw = localStorage.getItem(PREF_KEY);
      if(!raw) return;
      const p = JSON.parse(raw);
      if(p && typeof p === 'object'){
        if(['A2','B1','B2'].includes(p.level)) state.level = p.level;
        state.fr = !!p.fr;
        if(['US','UK'].includes(p.accent)) state.accent = p.accent;
        if(typeof p.rate === 'number') state.rate = clamp(p.rate, 0.7, 1.25);
      }
    }catch(e){}
  };
  const savePrefs = () => {
    try{
      localStorage.setItem(PREF_KEY, JSON.stringify({
        level: state.level, fr: state.fr, accent: state.accent, rate: state.rate
      }));
    }catch(e){}
  };

  let voices = [];
  const loadVoices = () => {
    try{ voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }
    catch(e){ voices = []; }
  };
  const pickVoice = () => {
    if(!voices || !voices.length) return null;
    const wants = state.accent === 'UK' ? ['en-GB','United Kingdom','UK'] : ['en-US','United States','US'];
    const v = voices.find(x => wants.some(w => (x.lang||'').includes(w) || (x.name||'').includes(w)));
    return v || voices.find(x => (x.lang||'').startsWith('en')) || voices[0];
  };
  const speak = (text) => {
    if(!('speechSynthesis' in window) || !text) return;
    try{
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = state.rate;
      const v = pickVoice();
      if(v) u.voice = v;
      window.speechSynthesis.speak(u);
    }catch(e){}
  };

  const updateScoreUI = () => {
    $('#scorePill').textContent = `${state.score.correct} / ${state.score.total}`;
    const acc = state.score.total ? Math.round((state.score.correct/state.score.total)*100) : 0;
    $('#acc').textContent = `${acc}%`;
  };
  const addScore = (ok) => {
    state.score.total += 1;
    if(ok) state.score.correct += 1;
    updateScoreUI();
  };
  const resetScore = () => {
    state.score.correct = 0;
    state.score.total = 0;
    updateScoreUI();
  };

  const stopTimer = (t) => { if(t) clearInterval(t); return null; };
  const startCountdown = (seconds, onTick, onDone) => {
    let r = seconds;
    onTick(r);
    const t = setInterval(() => {
      r -= 1;
      onTick(r);
      if(r <= 0){
        clearInterval(t);
        onDone && onDone();
      }
    }, 1000);
    return t;
  };

  const upgradeChips = [
    {en:"When I have free time, I…", fr:"Quand j’ai du temps libre, je…"},
    {en:"One reason I like it is that…", fr:"Une raison est que…"},
    {en:"It helps me to…", fr:"Ça m’aide à…"},
    {en:"For example,…", fr:"Par exemple,…"},
    {en:"However,…", fr:"Cependant,…"},
    {en:"Compared to…, …", fr:"Comparé à…, …"},
    {en:"Overall, I would say that…", fr:"Globalement, je dirais que…"},
  ];

  const vocab = [
    {cat:"Walking", icon:"🚶", en:"go for a walk", fr:"aller se promener", def:"walk for pleasure", ex:"I go for a walk every morning."},
    {cat:"Walking", icon:"🥾", en:"a hiking trail", fr:"un sentier de randonnée", def:"path in nature", ex:"We follow a hiking trail in the countryside."},
    {cat:"Walking", icon:"🌿", en:"fresh air", fr:"air frais", def:"clean outdoor air", ex:"Walking in fresh air helps me relax."},
    {cat:"Walking", icon:"🧘", en:"clear my mind", fr:"vider mon esprit", def:"feel calmer", ex:"A long walk helps me clear my mind."},
    {cat:"Walking", icon:"💪", en:"stay fit", fr:"rester en forme", def:"keep healthy", ex:"Walking helps me stay fit."},
    {cat:"Motorcycle", icon:"🏍️", en:"go for a ride", fr:"faire une balade", def:"ride for fun", ex:"We go for a ride on Sundays."},
    {cat:"Motorcycle", icon:"🪖", en:"wear a helmet", fr:"porter un casque", def:"protect your head", ex:"You must wear a helmet."},
    {cat:"Motorcycle", icon:"🗺️", en:"a scenic route", fr:"un itinéraire panoramique", def:"beautiful road", ex:"We choose a scenic route by the coast."},
    {cat:"Motorcycle", icon:"🛑", en:"stop for a break", fr:"faire une pause", def:"pause during a trip", ex:"We stop for a break and a coffee."},
    {cat:"Arts & crafts", icon:"🎨", en:"do arts and crafts", fr:"faire des activités manuelles", def:"make creative things", ex:"I do arts and crafts with my grandchildren."},
    {cat:"Arts & crafts", icon:"🧵", en:"knitting", fr:"tricot", def:"making fabric with yarn", ex:"Knitting is relaxing for me."},
    {cat:"Arts & crafts", icon:"✂️", en:"materials", fr:"matériel", def:"things you use to create", ex:"I buy materials like glue and scissors."},
    {cat:"Arts & crafts", icon:"🖌️", en:"paint", fr:"peindre", def:"put color on paper/canvas", ex:"I like to paint simple landscapes."},
    {cat:"Cooking", icon:"🍳", en:"cook a meal", fr:"cuisiner un repas", def:"prepare food", ex:"I cook a meal for my family."},
    {cat:"Cooking", icon:"📖", en:"a recipe", fr:"une recette", def:"instructions for cooking", ex:"I follow a recipe when I bake."},
    {cat:"Cooking", icon:"🧂", en:"season food", fr:"assaisonner", def:"add salt/spices", ex:"I season food with herbs."},
    {cat:"Cooking", icon:"🍽️", en:"eat out", fr:"manger au restaurant", def:"eat in a restaurant", ex:"We eat out on special occasions."},
    {cat:"Family", icon:"👶", en:"take care of my grandchildren", fr:"m’occuper de mes petits-enfants", def:"look after", ex:"I take care of my grandchildren twice a week."},
    {cat:"Family", icon:"📚", en:"help with homework", fr:"aider aux devoirs", def:"support school work", ex:"I help them with homework."},
    {cat:"Family", icon:"❤️", en:"spend time with my children", fr:"passer du temps avec mes enfants", def:"be together", ex:"I enjoy spending time with my children."},
    {cat:"Travel", icon:"✈️", en:"travel for pleasure", fr:"voyager pour le plaisir", def:"travel as a hobby", ex:"I travel for pleasure, not for work."},
    {cat:"Travel", icon:"🏨", en:"book accommodation", fr:"réserver un logement", def:"reserve a place to stay", ex:"I book accommodation online."},
    {cat:"Travel", icon:"🧭", en:"explore a new place", fr:"explorer un nouvel endroit", def:"discover", ex:"I love exploring a new place."},
    {cat:"Travel", icon:"🎟️", en:"a guided tour", fr:"une visite guidée", def:"tour with a guide", ex:"We join a guided tour in a museum."}
  ];

  const lessonText = {
    A2:`ACCURACY RULES (A2+)\n1) Articles:\n- a / an = first time (a restaurant, an email)\n- the = specific (the restaurant we like)\n- no article = general (I like cooking)\n\n2) Verb patterns:\n- I like / I love / I enjoy + V-ing (I enjoy walking)\n- I would like + to + verb (I would like to travel)\n\n3) One idea = one sentence.\nShort sentences = fewer mistakes.`,
    B1:`ACCURACY RULES (B1)\n1) Articles:\n- Use “the” when it’s clear which one.\n- Use “a/an” when it’s one example.\n\n2) Verb patterns:\n- enjoy + V-ing / prefer + V-ing / would like + to\n- Use frequency: usually / often / twice a week\n\n3) Sentence control:\nUse connectors: First / Then / However / Overall.`,
    B2:`ACCURACY RULES (B2)\n1) Precise wording:\n- progress faster / make faster progress\n- convenient / time-saving / personalised\n\n2) Structure:\nTopic sentence → 2 reasons → example → contrast → conclusion\n\n3) Safer B2 verbs:\nprefer / appreciate / recommend / improve / relax / focus`
  };

  const mistakeRules = [
    {re:/\binformations\b/ig, msg:"“Information” is uncountable (no -s).", fr:"“Information” est indénombrable (pas de -s)."},
    {re:/\badvices\b/ig, msg:"“Advice” is uncountable (no -s).", fr:"“Advice” est indénombrable."},
    {re:/\bI am agree\b/ig, msg:"Say: “I agree” (not *I am agree).", fr:"Dire : “I agree”."},
    {re:/\bI prefere\b/ig, msg:"Spelling: “I prefer”.", fr:"Orthographe : “I prefer”."},
    {re:/\bteatcher\b/ig, msg:"Spelling: “teacher”.", fr:"Orthographe : “teacher”."},
    {re:/\bprofessionnal\b/ig, msg:"Spelling: “professional”.", fr:"Orthographe : “professional”."},
    {re:/\bpersonnal\b/ig, msg:"Spelling: “personal”.", fr:"Orthographe : “personal”."},
    {re:/\brecomman(d|t)ed\b/ig, msg:"Spelling: “recommended”.", fr:"Orthographe : “recommended”."},
    {re:/\bprogress are\b/ig, msg:"Say: “my progress is…” or “I progress faster”.", fr:"Dire : “my progress is…” / “I progress…”."}
  ];

  const accQuizBank = [
    {q:"Choose the correct sentence:", options:["I enjoy to walk.","I enjoy walking.","I enjoy walk."], a:1, why:"enjoy + V-ing"},
    {q:"Choose the correct article:", options:["I go to restaurant on Saturday.","I go to a restaurant on Saturday.","I go to the restaurant on Saturday (general)."], a:1, why:"a restaurant = one example"},
    {q:"Choose the best word:", options:["I make progress faster.","My progress are faster.","My progress is faster."], a:2, why:"progress → progress is"},
    {q:"Choose the correct form:", options:["I would like travelling more.","I would like to travel more.","I would like travel more."], a:1, why:"would like + to + verb"},
    {q:"Pick the best connector (contrast): The walk was nice. ___ it was very cold.", options:["For example,","However,","First,"], a:1, why:"However = contrast"},
    {q:"Pick the best connector (result): We missed the train. ___ we arrived late.", options:["As a result,","However,","For example,"], a:0, why:"As a result = consequence"}
  ];

  const fixBank = [
    {bad:"I enjoy to cook and I go to restaurant with my husband.", good:"I enjoy cooking, and I go to a restaurant with my husband."},
    {bad:"During my career, I benefited from a personnal training account.", good:"During my career, I benefited from a personal training account."},
    {bad:"I prefere online lessons because progress are faster.", good:"I prefer online lessons because I make faster progress."},
    {bad:"We go for ride on his motorcycle and we wear helmet.", good:"We go for a ride on his motorcycle, and we wear a helmet."},
    {bad:"I like take care of my grandchildren two time per week.", good:"I like taking care of my grandchildren twice a week."}
  ];

  const structBank = [
    {en:"When I have free time, I…", fr:"Quand j’ai du temps libre, je…"},
    {en:"I really enjoy + V-ing…", fr:"J’aime beaucoup + V-ing…"},
    {en:"One reason I like it is that…", fr:"Une raison est que…"},
    {en:"It helps me (to)…", fr:"Ça m’aide à…"},
    {en:"Compared to…, …", fr:"Comparé à…, …"},
    {en:"Another advantage is…", fr:"Un autre avantage est…"},
    {en:"For example,…", fr:"Par exemple,…"},
    {en:"However,…", fr:"Cependant,…"},
    {en:"Overall, I would say that…", fr:"Globalement, je dirais que…"},
  ];

  const structExamples = {
    A2:`Examples (A2+)\nWhen I have free time, I go for a walk.\nI really enjoy cooking for my family.\nOne reason I like walking is that it helps me relax.\nFor example, I walk in the countryside on Sundays.\nOverall, I would say that my hobbies make me happy.`,
    B1:`Examples (B1)\nWhen I have free time, I go for a walk or do arts and crafts.\nOne reason I like walking is that it helps me clear my mind.\nCompared to cooking, walking is easier and needs no preparation.\nFor example, I follow a hiking trail near my home.\nOverall, I would say that my hobbies help me stay balanced.`,
    B2:`Examples (B2)\nWhen I have free time, I enjoy walking because it helps me stay fit and clear my mind.\nCompared to cooking, walking is more spontaneous and less time-consuming.\nFor example, my husband and I choose a scenic route and stop for a break.\nHowever, I also appreciate quiet activities such as knitting or painting.\nOverall, I would say that my hobbies keep me active, creative, and connected to my family.`
  };

  const comparePairs = [
    {id:"walk_vs_bike", a:"walking", b:"riding on my husband’s motorcycle"},
    {id:"craft_vs_cook", a:"arts and crafts", b:"cooking"},
    {id:"travel_vs_home", a:"travelling", b:"spending time at home with family"},
    {id:"walk_vs_rest", a:"walking", b:"eating out at restaurants"}
  ];
  const cmpChips = [
    {en:"… is more relaxing than …", fr:"… est plus relaxant que …"},
    {en:"… is safer than …", fr:"… est plus sûr que …"},
    {en:"… is cheaper than …", fr:"… est moins cher que …"},
    {en:"… is more convenient than …", fr:"… est plus pratique que …"},
    {en:"Both … and … are enjoyable, but …", fr:"Les deux…, mais …"},
  ];
  const cmpModels = {
    walk_vs_bike:{A2:"Walking is more relaxing than riding on my husband’s motorcycle. Walking is slower and I can breathe fresh air. Riding is exciting, but it can be noisy and cold.",B1:"Walking is more relaxing than riding on my husband’s motorcycle because it is calm and easy. However, riding is exciting and we can discover new places quickly. Both are enjoyable, but walking helps me clear my mind.",B2:"Walking is more relaxing than riding on my husband’s motorcycle because it is calm and gives me time to think. However, motorcycle rides are exciting and allow us to follow a scenic route and explore more. Overall, both hobbies are enjoyable, but walking helps me recharge."},
    craft_vs_cook:{A2:"Arts and crafts are calmer than cooking. When I do crafts, I can sit and relax. Cooking is good too, but it needs more time and preparation.",B1:"Arts and crafts are more relaxing than cooking because they are quiet and creative. However, cooking is useful because I can share meals with my family. Both hobbies are enjoyable, but crafts help me focus.",B2:"Arts and crafts are more relaxing than cooking because I can focus on one small project and disconnect. However, cooking is rewarding because I can share a meal with my family. Overall, both hobbies help me feel happy and productive."},
    travel_vs_home:{A2:"Travelling is more exciting than staying at home. I like to explore a new place. But staying at home is good because I can take care of my grandchildren.",B1:"Travelling is more exciting than staying at home because I discover new places and cultures. However, staying at home is important because I can spend time with my children and grandchildren.",B2:"Travelling is more exciting than staying at home because it allows me to explore new places and try new things. However, spending time at home with my family is just as important because it keeps me connected and happy. Overall, I try to balance both."},
    walk_vs_rest:{A2:"Walking is healthier than eating out. Walking helps me stay fit. Eating out is nice too, but it can be expensive.",B1:"Walking is healthier than eating out because it helps me stay fit and clear my mind. However, eating out is enjoyable because I can try new dishes with my husband.",B2:"Walking is healthier than eating out because it keeps me active and improves my mood. However, eating out is a pleasure because it’s a social moment and a chance to try new dishes. Overall, I enjoy both, but I choose walking more often."}
  };

  const connBank = [
    {en:"First,", fr:"D’abord,"},{en:"Then,", fr:"Ensuite,"},{en:"After that,", fr:"Après ça,"},{en:"Moreover,", fr:"De plus,"},{en:"However,", fr:"Cependant,"},{en:"For example,", fr:"Par exemple,"},{en:"As a result,", fr:"Par conséquent,"},{en:"Finally,", fr:"Enfin,"},{en:"Overall,", fr:"Globalement,"}
  ];
  const connQuizBank = [
    {q:"Choose a connector for a result: I was annoyed. ___ I went for a walk.", options:["However,","As a result,","For example,"], a:1, why:"As a result = consequence"},
    {q:"Choose a connector for contrast: I like travelling. ___ I also enjoy staying home.", options:["However,","First,","As a result,"], a:0, why:"However = contrast"},
    {q:"Choose a connector for an example: I enjoy cooking. ___ I try new recipes.", options:["For example,","Finally,","However,"], a:0, why:"For example introduces an example"},
    {q:"Choose a sequencing word: ___, we put on our helmets, and we start the ride.", options:["First,","As a result,","Overall,"], a:0, why:"First = first step"}
  ];
  const connMiniPara = {
    A2:"First, I go for a walk in the countryside. Then, I come home and cook a meal. For example, I follow a simple recipe. Overall, these hobbies help me relax.",
    B1:"First, I go for a walk to get fresh air. Then, I do arts and crafts at home. For example, I enjoy knitting because it helps me focus. However, I also like eating out sometimes. Overall, my hobbies give me balance.",
    B2:"First, I go for a walk to clear my mind and stay fit. Then, I spend time cooking or doing crafts. For example, I like trying a new recipe, especially when my family visits. However, when the weather is good, my husband and I prefer a motorcycle ride on a scenic route. Overall, my hobbies keep me active, creative, and connected."
  };

  const subjectBank = {
    inviteRestaurant:["Invitation — dinner at a restaurant this weekend","Would you like to join us for dinner on [DAY]?","Dinner invitation — please confirm"],
    dayTrip:["Trip plan — day trip itinerary for [CITY]","Weekend plan — walking + motorcycle ride","Ideas for a day out — schedule and details"],
    hobbyParagraph:["My hobbies and why I enjoy them","How I spend my free time","Hobbies that keep me active and happy"],
    compareHobbies:["Walking vs motorcycle rides — my preferences","Two hobbies I enjoy — comparison","Relaxing vs exciting hobbies — my opinion"],
    storyWeekend:["A perfect weekend — my routine and hobbies","Weekend story — what I did and why I liked it","A day with my family — story and feelings"]
  };

  const writingTasks = [
    {id:"hobbyParagraph",title:"Paragraph — my hobbies (125+ words)",prompt:"Write a short text about your hobbies. Mention at least 4 hobbies (walking, motorcycle rides, arts/crafts, cooking/restaurants, family, travel). Explain why you like them. Use 2 connectors and 1 example.",lines:["When I have free time, I…","I really enjoy + V-ing…","One reason I like it is that…","For example,…","However,…","Overall,…"],template:"When I have free time, I…\nOne reason I like it is that…\nFor example,…\nHowever,…\nOverall, I would say that…",models:{A2:"When I have free time, I enjoy simple hobbies that make me happy. First, I go for a walk because it helps me stay fit and clear my mind. For example, I walk in the countryside on Sunday morning and I breathe fresh air.\n\nI also like cooking for my family. I follow a recipe and I season food with herbs. Sometimes, my husband and I eat out in a restaurant because it is relaxing and we can try new dishes. In addition, I do arts and crafts like knitting. It is calm and it helps me focus.\n\nFinally, I take care of my grandchildren and I spend time with my children. Overall, my hobbies give me energy and good memories.",B1:"In my free time, I enjoy hobbies that keep me active, creative, and close to my family. First, I go for a walk because it helps me stay fit and clear my mind. For example, I follow a hiking trail near my home and I enjoy the fresh air.\n\nI also like riding on my husband’s motorcycle. We choose a scenic route and stop for a break, which makes the ride enjoyable. Moreover, I enjoy cooking for my family and trying new recipes. Sometimes, we eat out at a restaurant for a special occasion.\n\nIn addition, I do arts and crafts such as knitting, and I take care of my grandchildren twice a week. Overall, these hobbies help me relax and feel happy.",B2:"I enjoy a variety of hobbies that help me stay active, creative, and connected to my family. First, I go for a walk whenever I have free time because it helps me clear my mind and stay fit. For example, I like following a hiking trail in the countryside, especially when the weather is good.\n\nCompared to walking, riding on my husband’s motorcycle is more exciting. We often choose a scenic route and stop for a break, which makes the experience feel like a mini-trip. Moreover, I enjoy cooking and trying new recipes, and we sometimes eat out at a restaurant to discover local cuisine.\n\nI also appreciate quiet activities such as arts and crafts, and I love taking care of my grandchildren and spending time with my children. Overall, my hobbies give me balance: they relax me, keep me motivated, and create meaningful memories."}},
    {id:"compareHobbies",title:"Opinion paragraph — walking vs motorcycle rides (125+ words)",prompt:"Compare walking and riding on your husband’s motorcycle. Explain which one is more relaxing, which one is more exciting, and why. Use at least 3 comparatives and 2 connectors.",lines:["Walking is more … than …","However,…","On the one hand,… On the other hand,…","For example,…","Overall,…"],template:"On the one hand, …\nOn the other hand, …\nFor example, …\nOverall, …",models:{A2:"Walking is more relaxing than riding on my husband’s motorcycle. When I walk, I can go slowly and I can breathe fresh air. It is also safer and quieter. For example, I walk in the countryside and I clear my mind.\n\nHowever, riding a motorcycle is more exciting than walking because we can go farther and see many places. We choose a scenic route and stop for a break. It is fun, but sometimes it is cold or noisy.\n\nOverall, I like both hobbies. Walking helps me relax and stay fit, and motorcycle rides help me feel free and happy.",B1:"Walking is more relaxing than riding on my husband’s motorcycle because it is calm and easy. I can go at my own pace and enjoy fresh air. For example, I like following a hiking trail and listening to nature.\n\nHowever, motorcycle rides are more exciting and faster than walking. On the one hand, walking helps me clear my mind and stay fit. On the other hand, riding allows us to discover new places quickly and enjoy a scenic route together.\n\nOverall, both hobbies are enjoyable, but I choose walking when I want to relax and I choose motorcycle rides when I want adventure.",B2:"Walking is more relaxing than riding on my husband’s motorcycle because it is calm, quiet, and less stressful. I can go at my own pace, breathe fresh air, and truly clear my mind. For example, a long walk on a hiking trail helps me recharge after a busy week.\n\nHowever, motorcycle rides are more exciting and more adventurous than walking. On the one hand, walking is safer and more predictable. On the other hand, riding offers freedom: we can follow a scenic route, stop for a break, and explore a new place in a short time.\n\nOverall, I enjoy both. Walking is my best option for relaxation, while motorcycle rides are perfect when I want excitement and quality time with my husband."}},
    {id:"inviteRestaurant",title:"Email — invite a friend to a restaurant (125+ words)",prompt:"Write an email to a friend to invite them to a restaurant. Include day/time, place, reason (celebration or just spending time), and ask them to confirm. Add one polite suggestion (dietary needs).",lines:["Subject: Invitation — dinner on…","I hope you are well.","Would you like to…?","How about…?","Please let me know…","Looking forward to…"],template:"Subject: Invitation — dinner on [DAY]\n\nDear [NAME],\n\nI hope you are well. …",models:{A2:"Subject: Invitation — dinner on Saturday evening\n\nDear [NAME],\n\nI hope you are well. I’m writing because I would like to invite you to dinner. Would you like to go to a restaurant with me on Saturday evening?\n\nI was thinking about meeting at 7:30 pm at [RESTAURANT NAME]. It is a nice place and the food is very good. We can talk, relax, and enjoy the evening.\n\nPlease let me know if you are free. If you have any dietary needs (vegetarian or allergies), tell me and I can choose a good option.\n\nThank you and I hope you can come. Looking forward to your reply.\n\nBest regards,\n[NAME]",B1:"Subject: Invitation — dinner on Saturday at 7:30 pm\n\nDear [NAME],\n\nI hope you’re doing well. I’m writing to invite you to dinner because I would love to spend some time together. Would you like to go to a restaurant with me on Saturday at 7:30 pm?\n\nI suggest [RESTAURANT NAME], which has a friendly atmosphere and good food. We can enjoy a nice meal and catch up.\n\nPlease let me know if you are available. Also, if you have any dietary requirements (vegetarian or allergies), tell me and I will make sure we choose the right place.\n\nThank you in advance. I look forward to your reply.\n\nKind regards,\n[NAME]",B2:"Subject: Dinner invitation — Saturday at 7:30 pm\n\nDear [NAME],\n\nI hope you’re doing well. I’m writing to invite you to dinner on Saturday evening because I would really enjoy spending time together. Would you be available at around 7:30 pm?\n\nI was thinking of [RESTAURANT NAME]. It has a pleasant atmosphere, and the menu looks great. We could enjoy a relaxed evening and catch up properly.\n\nPlease let me know if this time works for you. Also, if you have any dietary requirements (vegetarian options or allergies), tell me in advance and I will take that into account when we book.\n\nThank you in advance for your reply. I’m looking forward to seeing you.\n\nKind regards,\n[NAME]"}},
    {id:"dayTrip",title:"Plan — a perfect day trip (125+ words)",prompt:"Write a short plan for a day trip with your husband: morning activity (walking), afternoon (motorcycle ride), evening (restaurant). Use sequencing words: first, then, after that, finally.",lines:["First,…","Then,…","After that,…","Finally,…","Overall,…"],template:"First,…\nThen,…\nAfter that,…\nFinally,…\nOverall,…",models:{A2:"First, we will go for a walk in the morning because the weather is nice and we want fresh air. We will follow a trail near the countryside and we will take pictures. Then, we will go home for a short break and drink coffee.\n\nAfter that, in the afternoon, we will go for a ride on my husband’s motorcycle. We will wear a helmet and choose a scenic route. We will stop for a break in a small village.\n\nFinally, in the evening, we will go to a restaurant. We will try a local dish and relax. Overall, this day trip is simple, but it makes us very happy.",B1:"First, we will start the day with a walk in the countryside because it helps us relax and enjoy fresh air. We will follow a hiking trail and take our time. Then, we will have lunch at home or in a small café.\n\nAfter that, in the afternoon, we plan to go for a motorcycle ride. We will wear our helmets, choose a scenic route, and stop for a break to enjoy the view. This part is more exciting than walking, and it feels like a mini-adventure.\n\nFinally, in the evening, we will book a table at a restaurant to try local cuisine. Overall, it is the perfect day because it combines nature, adventure, and a nice meal.",B2:"First, we will begin the day with a peaceful walk in the countryside to get fresh air and clear our minds. We will follow a hiking trail, enjoy the landscape, and take photos. Then, we will have lunch in a small café and relax for a moment.\n\nAfter that, in the afternoon, we will go for a motorcycle ride. We will wear our helmets, choose a scenic route, and stop for a break in a charming village. Compared to walking, this activity is more exciting and allows us to explore more places in less time.\n\nFinally, in the evening, we will eat out at a restaurant and try local cuisine. Overall, this day trip is perfect because it combines calm moments, adventure, and quality time together."}},
    {id:"storyWeekend",title:"Story — a weekend with family + hobbies (125+ words)",prompt:"Write a short story about your weekend. Include family time (grandchildren), one hobby (craft/cooking), and one outdoor activity. Use: first, then, however, as a result, finally.",lines:["First,…","Then,…","However,…","As a result,…","Finally,…"],template:"First,… Then,… However,… As a result,… Finally,…",models:{A2:"First, on Saturday morning, I took care of my grandchildren. We played games and I helped them with homework. Then, we did arts and crafts together. For example, we made a small card with paper and glue.\n\nHowever, in the afternoon, the weather was not very good, and it started to rain. As a result, we stayed at home and I cooked a meal for everyone. I followed a recipe and we ate together.\n\nFinally, on Sunday, the weather was better, so I went for a walk with my husband. We enjoyed fresh air and we felt relaxed. Overall, it was a busy weekend, but I was happy.",B1:"First, on Saturday morning, I took care of my grandchildren. We played, and I helped them with homework. Then, we did arts and crafts together, which was fun and relaxing.\n\nHowever, in the afternoon, it started to rain. As a result, we stayed at home and I cooked a meal for the family. I tried a new recipe and everyone enjoyed it. Later, we watched a film and had a calm evening.\n\nFinally, on Sunday morning, the weather improved, so my husband and I went for a walk to get fresh air. Overall, it was a perfect weekend because it included family time, creativity, and a little outdoor activity.",B2:"First, on Saturday morning, I took care of my grandchildren and we enjoyed spending time together. We played games, and I helped them with homework. Then, we did arts and crafts: for example, we made a small card using paper, glue, and coloured pens.\n\nHowever, in the afternoon, it started raining heavily, so our outdoor plan changed. As a result, we stayed at home and I cooked a meal for the whole family. I tried a new recipe, and it was a lovely moment because everyone sat together and talked.\n\nFinally, on Sunday, the weather improved, so my husband and I went for a long walk in the countryside to clear our minds. Overall, it was a busy weekend, but it was exactly what I enjoy: family time, creativity, and simple pleasures."}}
  ];

  const proofChecklist = [
    "✅ Articles: a/an/the/— (general vs specific)",
    "✅ Verb pattern: enjoy + V-ing ; would like + to + verb",
    "✅ Subject-verb agreement: my hobbies are / my progress is",
    "✅ 2 connectors + 1 example (For example, …)",
    "✅ 1 idea per sentence (short & clear)",
    "✅ End with a clear conclusion sentence"
  ];

  const speakingPrompts = [
    {id:"sp_hobbies",title:"Talk about your hobbies (60s)",prompt:"Describe your hobbies and explain why you like them. Mention walking, motorcycle rides, and one quiet hobby. Use one example and one connector.",builder:[["Intro","In my free time, I enjoy several hobbies."],["Reason 1","Walking helps me…"],["Reason 2","Motorcycle rides with my husband are…"],["Example","For example,…"],["Close","Overall, these hobbies…"]],models:{A2:"In my free time, I enjoy several hobbies. First, I go for a walk because it helps me stay fit and clear my mind. For example, I walk in the countryside on Sundays. I also like riding on my husband’s motorcycle because it is exciting and we choose a scenic route. In addition, I enjoy cooking and arts and crafts. Overall, my hobbies help me relax and feel happy.",B1:"In my free time, I enjoy hobbies that keep me active and relaxed. Walking helps me stay fit and clear my mind. For example, I follow a hiking trail near my home. I also enjoy motorcycle rides with my husband because they are exciting and we can discover new places. Moreover, I like cooking for my family and doing crafts. Overall, these hobbies give me balance and good memories.",B2:"In my free time, I enjoy hobbies that keep me active, creative, and connected to my family. Walking helps me clear my mind and stay fit, especially in the countryside. For example, I enjoy following a hiking trail and breathing fresh air. Compared to walking, motorcycle rides with my husband are more exciting and feel like a mini-trip because we choose a scenic route and stop for a break. Overall, these hobbies help me recharge and stay positive."}},
    {id:"sp_compare",title:"Compare two hobbies (60s)",prompt:"Compare walking and cooking. Which one is more relaxing? Which one is more practical? Give one example.",builder:[["Intro","I enjoy both…, but they are different."],["Compare","Walking is more… than…"],["Compare","Cooking is more… than…"],["Example","For example,…"],["Close","Overall,…"]],models:{A2:"I enjoy both walking and cooking, but they are different. Walking is more relaxing than cooking because I can breathe fresh air and clear my mind. Cooking is more practical than walking because I prepare food for my family. For example, I cook a meal and follow a recipe. Overall, I like both hobbies.",B1:"I enjoy both walking and cooking, but they give me different feelings. Walking is more relaxing because it helps me clear my mind. Cooking is more practical because it is useful for my family. For example, I enjoy trying a new recipe on the weekend. Overall, I think walking is best for relaxation and cooking is best for sharing.",B2:"I enjoy both walking and cooking, but they are relaxing in different ways. Walking is more relaxing because it disconnects me from daily tasks and helps me clear my mind. Cooking is more practical because it allows me to take care of my family and share a meal. For example, I enjoy trying a new recipe when my children visit. Overall, walking is ideal for recharging, while cooking is ideal for connection."}}
  ];

  const fluencyChips = [
    {en:"Let me think…", fr:"Laissez-moi réfléchir…"},
    {en:"In my opinion,…", fr:"À mon avis,…"},
    {en:"For example,…", fr:"Par exemple,…"},
    {en:"That’s why…", fr:"C’est pourquoi…"},
    {en:"What I like most is…", fr:"Ce que j’aime le plus, c’est…"},
    {en:"To be honest,…", fr:"Honnêtement,…"},
    {en:"Overall,…", fr:"Globalement,…"},
  ];

  const roleplays = [
    {id:"rp_restaurant",title:"Restaurant booking (phone)",you:"Hello, I’d like to book a table for two people for Saturday at 7:30 pm, please.",teacher:"Of course. Could you confirm your name and whether you have any dietary requirements?"},
    {id:"rp_hotel",title:"Hotel request (phone)",you:"Hello, could you please confirm if breakfast and Wi-Fi are included in the price?",teacher:"Yes, breakfast and Wi-Fi are included. Would you like a quiet room away from the street?"},
    {id:"rp_tour",title:"Tour information (phone)",you:"Hi, I’m calling to ask about the meeting point and duration of the guided tour.",teacher:"Sure. The meeting point is in front of the museum at 10:00, and the tour lasts about two hours."}
  ];

  const feedbackStems = [
    {en:"Great structure. Now shorten sentences to reduce mistakes.", fr:"Bonne structure. Raccourcis les phrases."},
    {en:"Add 2 connectors and 1 example to reach the next level.", fr:"Ajoute 2 connecteurs et 1 exemple."},
    {en:"Check articles (a/the/—) and verb patterns (enjoy + V-ing).", fr:"Vérifie articles et verbes (enjoy + V-ing)."},
    {en:"Upgrade 2 words: problem→issue, tell me→let me know.", fr:"Améliore 2 mots : problem→issue, tell me→let me know."}
  ];

  const setFR = (on) => {
    state.fr = !!on;
    $('#frToggle').setAttribute('aria-pressed', state.fr ? 'true' : 'false');
    $('#frToggle').textContent = state.fr ? 'On' : 'Off';
    $$('.frOnly').forEach(el => el.style.display = state.fr ? 'block' : 'none');
    renderUpgradeChips();
    renderVocab();
    renderStructChips();
    renderCmpChips();
    renderConnChips();
    renderFluencyChips();
    renderLesson();
    renderFeedback();
    renderProof();
  };

  const setLevel = (lvl) => {
    state.level = lvl;
    $$('.segBtn[data-level]').forEach(b => b.classList.toggle('isOn', b.dataset.level === lvl));
    renderLesson();
    renderWriting();
    renderModelEmail();
    renderStructModel();
    renderCmpModel();
    renderConnExample();
    renderSpeakingPrompt();
    savePrefs();
  };

  const setAccent = (acc) => {
    state.accent = acc;
    $$('.segBtn[data-accent]').forEach(b => b.classList.toggle('isOn', b.dataset.accent === acc));
    savePrefs();
  };

  const renderUpgradeChips = () => {
    const host = $('#upgradeChips');
    host.innerHTML = '';
    upgradeChips.forEach(c => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.innerHTML = `${escapeHtml(c.en)}${state.fr ? `<span class="sub">${escapeHtml(c.fr)}</span>` : ''}`;
      b.addEventListener('click', () => speak(c.en.replace('…','')));
      host.appendChild(b);
    });
  };

  const cats = (() => ['All'].concat(Array.from(new Set(vocab.map(v => v.cat))).sort()))();
  const fillVocabCats = () => {
    const sel = $('#vCat');
    sel.innerHTML = '';
    cats.forEach(c => {
      const o = document.createElement('option');
      o.value = c;
      o.textContent = c;
      sel.appendChild(o);
    });
    sel.value = 'All';
  };
  const getVocabFiltered = () => {
    const cat = $('#vCat').value;
    const q = ($('#vSearch').value || '').trim().toLowerCase();
    return vocab.filter(v => (cat === 'All' || v.cat === cat) &&
      (!q || v.en.toLowerCase().includes(q) || (v.fr||'').toLowerCase().includes(q) || (v.def||'').toLowerCase().includes(q)));
  };
  const renderVocab = () => {
    const list = getVocabFiltered();
    const chipsHost = $('#vChips');
    chipsHost.innerHTML = '';
    list.forEach(item => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.innerHTML = `${escapeHtml(item.icon + " " + item.en)}${state.fr ? `<span class="sub">${escapeHtml(item.fr)}</span>` : ''}`;
      b.addEventListener('click', () => speak(item.en));
      chipsHost.appendChild(b);
    });
    $('#vList').innerHTML = list.map(it => `
      <div class="panel" style="margin-bottom:10px;">
        <div class="miniTitle">${escapeHtml(it.cat)}</div>
        <div style="font-weight:950;">${escapeHtml(it.icon)} ${escapeHtml(it.en)} ${state.fr ? `<span class="muted">— ${escapeHtml(it.fr)}</span>` : ''}</div>
        <div class="tiny muted" style="margin-top:6px; line-height:1.5;"><strong>Definition:</strong> ${escapeHtml(it.def)}</div>
        <div class="tiny muted" style="margin-top:6px; line-height:1.5;"><strong>Example:</strong> ${escapeHtml(it.ex)}</div>
        <div class="actionsRow mt10">
          <button class="pill ghost" type="button" data-copy="${escapeHtml(it.en)}">Copy</button>
          <button class="pill" type="button" data-say="${escapeHtml(it.en)}">▶ Say</button>
        </div>
      </div>
    `).join('') || `<div class="tiny muted">No items found.</div>`;
    $$('button[data-copy]', $('#vList')).forEach(b => b.addEventListener('click', () => copyToClipboard(b.dataset.copy, 'Copied.')));
    $$('button[data-say]', $('#vList')).forEach(b => b.addEventListener('click', () => speak(b.dataset.say)));
  };
  const shuffleVocab = () => {
    const s = shuffle(vocab);
    vocab.length = 0;
    s.forEach(x => vocab.push(x));
    renderVocab();
  };

  const flashOpen = () => {
    const list = getVocabFiltered();
    state.flash.list = list.length ? list : vocab.slice();
    state.flash.idx = 0;
    state.flash.flipped = false;
    $('#flashModal').hidden = false;
    renderFlashCard();
  };
  const flashClose = () => { const m = $('#flashModal'); if(m) m.hidden = true; };
  const renderFlashCard = () => {
    const list = state.flash.list || [];
    const item = list[state.flash.idx] || list[0];
    if(!item){ $('#flashCard').textContent = "No cards."; return; }
    const front = `${item.icon} ${item.en}`;
    const back = `${item.fr ? item.fr + "\n\n" : ""}${item.ex}`;
    $('#flashCard').textContent = state.flash.flipped ? back : front;
  };
  const flashFlip = () => { state.flash.flipped = !state.flash.flipped; renderFlashCard(); const item=(state.flash.list||[])[state.flash.idx]; if(item) speak(item.en); };
  const flashNext = () => { const list=state.flash.list||[]; if(!list.length) return; state.flash.idx=(state.flash.idx+1)%list.length; state.flash.flipped=false; renderFlashCard(); };
  const flashPrev = () => { const list=state.flash.list||[]; if(!list.length) return; state.flash.idx=(state.flash.idx-1+list.length)%list.length; state.flash.flipped=false; renderFlashCard(); };

  const renderLesson = () => { $('#miniLesson').textContent = lessonText[state.level] || ''; };

  const renderMistakes = (text='') => {
    const box = $('#mistakeBox');
    const t = (text || '').trim();
    if(!t){ box.innerHTML = `<div class="tiny muted">Paste your text (in writing box) to see a quick checklist.</div>`; return; }
    const hits = [];
    mistakeRules.forEach(rule => { rule.re.lastIndex = 0; if(rule.re.test(t)) hits.push(rule); });
    if(!hits.length){ box.innerHTML = `<div class="tiny muted">✅ No common patterns detected in this list.</div>`; return; }
    box.innerHTML = `<div class="tiny muted">Things to check:</div><ul class="bullets mt10">${hits.map(h => `<li>${escapeHtml(h.msg)}${state.fr && h.fr ? ` <span class="frOnly" style="display:inline;">(${escapeHtml(h.fr)})</span>` : ''}</li>`).join('')}</ul>`;
  };

  const renderMCQ = (host, qObj) => {
    host.innerHTML = '';
    const q = document.createElement('div');
    q.className = 'prompt';
    q.innerHTML = `<div class="miniTitle">Question</div><div class="promptText">${escapeHtml(qObj.q)}</div>`;
    host.appendChild(q);
    const opts = document.createElement('div');
    opts.className = 'chips mt10';
    qObj.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent = opt;
      b.addEventListener('click', () => {
        const ok = i === qObj.a;
        addScore(ok);
        $$('.chip', opts).forEach(x => x.disabled = true);
        b.style.background = ok ? 'rgba(80,255,140,.18)' : 'rgba(255,100,120,.18)';
        const why = document.createElement('div');
        why.className = 'tiny muted mt10';
        why.textContent = (ok ? '✅ Correct. ' : '❌ Not quite. ') + (qObj.why || '');
        host.appendChild(why);
        speak(opt.replace('…',''));
      });
      opts.appendChild(b);
    });
    host.appendChild(opts);
  };
  const newAccQuiz = () => renderMCQ($('#accQuiz'), shuffle(accQuizBank)[0]);

  let fixIdx = 0;
  const loadFix = (idx=null) => {
    if(idx === null) fixIdx = (fixIdx + 1) % fixBank.length;
    else fixIdx = idx % fixBank.length;
    const item = fixBank[fixIdx];
    $('#fixPrompt').textContent = "Fix this: " + item.bad;
    $('#fixInput').value = '';
    $('#fixFeedback').textContent = '';
  };
  const norm = (s) => (s||'').trim().replace(/\s+/g,' ').toLowerCase();
  const fixCheck = () => {
    const item = fixBank[fixIdx];
    const ans = norm($('#fixInput').value);
    const good = norm(item.good);
    const out = $('#fixFeedback');
    if(!ans){ out.textContent = "Write your corrected sentence first."; return; }
    const ok = ans === good;
    addScore(ok);
    out.textContent = ok ? "✅ Great! That’s correct." : ("❌ Not exactly.\nModel: " + item.good);
  };
  const fixShow = () => { const item = fixBank[fixIdx]; $('#fixFeedback').textContent = "Model: " + item.good; };

  const renderStructChips = () => {
    const host = $('#structChips');
    host.innerHTML = '';
    structBank.forEach(c => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.innerHTML = `${escapeHtml(c.en)}${state.fr ? `<span class="sub">${escapeHtml(c.fr)}</span>` : ''}`;
      b.addEventListener('click', () => {
        speak(c.en.replace('…',''));
        const ta = $('#structOut');
        ta.value = (ta.value ? (ta.value + "\n") : '') + c.en.replace('…','');
        ta.focus();
      });
      host.appendChild(b);
    });
  };
  const renderStructModel = () => { $('#structOut').value = structExamples[state.level] || ''; };

  const fillCmpPairs = () => {
    const sel = $('#cmpPair');
    sel.innerHTML = '';
    comparePairs.forEach(p => {
      const o = document.createElement('option');
      o.value = p.id;
      o.textContent = `${p.a} vs ${p.b}`;
      sel.appendChild(o);
    });
    sel.value = comparePairs[0].id;
  };
  const currentCmp = () => comparePairs.find(p => p.id === $('#cmpPair').value) || comparePairs[0];
  const renderCmpChips = () => {
    const host = $('#cmpChips');
    host.innerHTML = '';
    cmpChips.forEach(c => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.innerHTML = `${escapeHtml(c.en)}${state.fr ? `<span class="sub">${escapeHtml(c.fr)}</span>` : ''}`;
      b.addEventListener('click', () => {
        speak(c.en.replace('…',''));
        const ta = $('#cmpOut');
        ta.value = (ta.value ? (ta.value + "\n") : '') + c.en.replace('…','');
        ta.focus();
      });
      host.appendChild(b);
    });
  };
  const renderCmpModel = () => {
    const p = currentCmp();
    const txt = (cmpModels[p.id] && cmpModels[p.id][state.level]) ? cmpModels[p.id][state.level] : '';
    $('#cmpModelOut').textContent = txt || '—';
  };

  const renderConnChips = () => {
    const host = $('#connChips');
    host.innerHTML = '';
    connBank.forEach(c => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.innerHTML = `${escapeHtml(c.en)}${state.fr ? `<span class="sub">${escapeHtml(c.fr)}</span>` : ''}`;
      b.addEventListener('click', () => {
        speak(c.en.replace(',',''));
        const ta = $('#connOut');
        ta.value = (ta.value ? (ta.value + " ") : '') + c.en;
        ta.focus();
      });
      host.appendChild(b);
    });
  };
  const renderConnExample = () => { $('#connExampleOut').textContent = connMiniPara[state.level] || ''; };
  const newConnQuiz = () => renderMCQ($('#connQuiz'), shuffle(connQuizBank)[0]);

  const fillWriteTask = () => {
    const sel = $('#writeTask');
    sel.innerHTML = '';
    writingTasks.forEach(t => {
      const o = document.createElement('option');
      o.value = t.id;
      o.textContent = t.title;
      sel.appendChild(o);
    });
    sel.value = writingTasks[0].id;
  };
  const currentWriteTask = () => {
    const id = $('#writeTask').value;
    return writingTasks.find(t => t.id === id) || writingTasks[0];
  };
  const updateWordCount = () => {
    const txt = ($('#studentText').value || '').trim();
    const words = txt ? txt.split(/\s+/).filter(Boolean).length : 0;
    $('#wordCount').textContent = String(words);
    renderMistakes(txt);
  };
  const renderWriting = () => {
    const t = currentWriteTask();
    $('#writePrompt').textContent = t.prompt;
    const host = $('#writeLines');
    host.innerHTML = '';
    (t.lines || []).forEach(line => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.textContent = line;
      b.addEventListener('click', () => {
        speak(line.replace('…',''));
        const ta = $('#studentText');
        ta.value = (ta.value ? (ta.value + "\n") : '') + line.replace('…','');
        ta.focus();
        updateWordCount();
      });
      host.appendChild(b);
    });
  };
  const writeListen = () => speak(currentWriteTask().prompt);
  const copyTemplate = () => copyToClipboard(currentWriteTask().template || '', '✅ Template copied.');
  const showModelWrite = () => {
    const t = currentWriteTask();
    const model = (t.models && t.models[state.level]) ? t.models[state.level] : '';
    const ta = $('#studentText');
    ta.value = ta.value.trim() ? (ta.value.trim() + "\n\n---\nMODEL (" + state.level + ")\n" + model) : model;
    ta.focus();
    updateWordCount();
  };
  const writeStart = () => {
    state.timers.write = stopTimer(state.timers.write);
    state.timers.write = startCountdown(15*60, (r) => { $('#writeTimer').textContent = fmtTime(r); },
      () => { $('#writeTimer').textContent = '00:00'; toast('Time! Quick proofread: articles + verbs + connectors.'); });
  };
  const writeStop = () => { state.timers.write = stopTimer(state.timers.write); $('#writeTimer').textContent='00:00'; };

  const fillModelScenario = () => {
    const sel = $('#modelScenario');
    sel.innerHTML = '';
    writingTasks.forEach(t => {
      const o = document.createElement('option');
      o.value = t.id;
      o.textContent = t.title;
      sel.appendChild(o);
    });
    sel.value = writingTasks[0].id;
  };
  const getModelTask = () => {
    const id = $('#modelScenario').value;
    return writingTasks.find(t => t.id === id) || writingTasks[0];
  };
  const showSubjects = () => {
    const t = getModelTask();
    const lines = subjectBank[t.id] || [];
    $('#subjectOut').textContent = lines.length ? lines.map(x => `• ${x}`).join('\n') : '—';
  };
  const renderModelEmail = () => {
    const t = getModelTask();
    const txt = (t.models && t.models[state.level]) ? t.models[state.level] : '';
    $('#modelEmailOut').textContent = txt || '—';
  };
  const renderProof = () => {
    $('#proofBox').innerHTML = `<ul class="bullets">${proofChecklist.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`;
  };

  const fillSpPrompts = () => {
    const sel = $('#spPrompt');
    sel.innerHTML = '';
    speakingPrompts.forEach(p => {
      const o = document.createElement('option');
      o.value = p.id;
      o.textContent = p.title;
      sel.appendChild(o);
    });
    sel.value = speakingPrompts[0].id;
  };
  const currentSp = () => speakingPrompts.find(p => p.id === $('#spPrompt').value) || speakingPrompts[0];
  const renderSpeakingPrompt = () => {
    const p = currentSp();
    $('#spPromptText').textContent = p.prompt;
    const host = $('#spBuilder');
    host.innerHTML = '';
    (p.builder || []).forEach(row => {
      const div = document.createElement('div');
      div.className = 'builderRow';
      div.innerHTML = `<div class="bLbl">${escapeHtml(row[0])}</div><div class="bBox">${escapeHtml(row[1])}</div>`;
      host.appendChild(div);
    });
    $('#spModelOut').textContent = (p.models && p.models[state.level]) ? p.models[state.level] : '';
  };
  const spListen = () => speak(currentSp().prompt);
  const spShowModel = () => { $('#spModelOut').textContent = currentSp().models[state.level] || ''; };
  const spSayModel = () => speak($('#spModelOut').textContent || '');
  const spStart = () => {
    state.timers.sp = stopTimer(state.timers.sp);
    state.timers.sp = startCountdown(60, (r) => { $('#spTimer').textContent = fmtTime(r); },
      () => { $('#spTimer').textContent='00:00'; toast('Time! Repeat with 2 connectors + 1 example.'); });
  };
  const spStop = () => { state.timers.sp = stopTimer(state.timers.sp); $('#spTimer').textContent='00:00'; };

  const renderFluencyChips = () => {
    const host = $('#fluencyChips');
    host.innerHTML = '';
    fluencyChips.forEach(c => {
      const b = document.createElement('button');
      b.type='button';
      b.className='chip';
      b.innerHTML = `${escapeHtml(c.en)}${state.fr ? `<span class="sub">${escapeHtml(c.fr)}</span>` : ''}`;
      b.addEventListener('click', () => speak(c.en.replace('…','')));
      host.appendChild(b);
    });
  };

  const fillRoleplays = () => {
    const sel = $('#rpScenario');
    sel.innerHTML = '';
    roleplays.forEach(r => {
      const o = document.createElement('option');
      o.value = r.id;
      o.textContent = r.title;
      sel.appendChild(o);
    });
    sel.value = roleplays[0].id;
  };
  const currentRp = () => roleplays.find(r => r.id === $('#rpScenario').value) || roleplays[0];
  const renderRoleplay = () => {
    const r = currentRp();
    $('#rpYou').textContent = r.you;
    $('#rpTeacher').textContent = r.teacher;
  };

  const tokenizeWords = (s) => {
    const clean = (s || '').replace(/\s+/g,' ').trim();
    return clean ? clean.split(' ') : [];
  };
  const lcsMatrix = (a, b) => {
    const n=a.length, m=b.length;
    const limit = 520;
    if(n>limit || m>limit) return null;
    const table = Array.from({length:n+1}, () => new Uint16Array(m+1));
    for(let i=1;i<=n;i++){
      for(let j=1;j<=m;j++){
        if(a[i-1] === b[j-1]) table[i][j] = table[i-1][j-1] + 1;
        else table[i][j] = Math.max(table[i-1][j], table[i][j-1]);
      }
    }
    return table;
  };
  const buildDiff = (a, b, table) => {
    let i=a.length, j=b.length;
    const out=[];
    while(i>0 && j>0){
      if(a[i-1] === b[j-1]){ out.push({t:'same', w:a[i-1]}); i--; j--; }
      else if(table[i-1][j] >= table[i][j-1]){ out.push({t:'del', w:a[i-1]}); i--; }
      else{ out.push({t:'add', w:b[j-1]}); j--; }
    }
    while(i>0){ out.push({t:'del', w:a[i-1]}); i--; }
    while(j>0){ out.push({t:'add', w:b[j-1]}); j--; }
    out.reverse();
    const merged=[];
    out.forEach(x => {
      const last = merged[merged.length-1];
      if(last && last.t === x.t) last.w += ' ' + x.w;
      else merged.push({t:x.t, w:x.w});
    });
    return merged;
  };
  const compareTexts = () => {
    const a = tokenizeWords($('#diffStudent').value);
    const b = tokenizeWords($('#diffTeacher').value);
    const out = $('#diffOut');
    if(!b.length){ out.innerHTML = `<div class="tiny muted">Paste a corrected/higher-level version to compare.</div>`; return; }
    const table = lcsMatrix(a, b);
    if(!table){
      out.innerHTML = `<div class="tiny muted">Text is long. Showing teacher version only.</div><div class="panel mt10"><div class="miniTitle">Teacher</div><div class="model">${escapeHtml($('#diffTeacher').value)}</div></div>`;
      return;
    }
    const diff = buildDiff(a, b, table);
    out.innerHTML = diff.map(seg => `<span class="${seg.t}">${escapeHtml(seg.w)}</span>`).join(' ') || `<div class="tiny muted">No differences detected.</div>`;
  };

  const renderFeedback = () => {
    const box = $('#feedbackBox');
    box.innerHTML = feedbackStems.map(x => `
      <div class="panel" style="margin-bottom:10px;">
        <div class="miniTitle">Feedback</div>
        <div style="font-weight:950;">${escapeHtml(x.en)}</div>
        ${state.fr ? `<div class="tiny muted frOnly" style="display:block; margin-top:6px;">${escapeHtml(x.fr)}</div>` : ''}
        <div class="actionsRow mt10">
          <button class="pill ghost" type="button" data-copy="${escapeHtml(x.en)}">Copy</button>
          <button class="pill" type="button" data-say="${escapeHtml(x.en)}">▶ Say</button>
        </div>
      </div>
    `).join('');
    $$('button[data-copy]', box).forEach(b => b.addEventListener('click', () => copyToClipboard(b.dataset.copy, 'Copied.')));
    $$('button[data-say]', box).forEach(b => b.addEventListener('click', () => speak(b.dataset.say)));
  };

  const resetAll = () => {
    state.timers.write = stopTimer(state.timers.write);
    state.timers.sp = stopTimer(state.timers.sp);
    $('#writeTimer').textContent='00:00';
    $('#spTimer').textContent='00:00';
    $('#studentText').value='';
    $('#structOut').value='';
    $('#cmpOut').value='';
    $('#connOut').value='';
    $('#connExampleOut').textContent='';
    $('#diffStudent').value='';
    $('#diffTeacher').value='';
    $('#diffOut').innerHTML='';
    $('#fixInput').value='';
    $('#fixFeedback').textContent='';
    updateWordCount();
    renderMistakes('');
    toast('Reset done.');
  };

  const newSet = () => {
    newAccQuiz();
    newConnQuiz();
    shuffleVocab();
    loadFix(null);
    toast('✨ New set ready.');
  };

  const init = () => {
    loadPrefs();
    loadVoices();
    if('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;

    const ok = document.getElementById('jsOk');
    if(ok) ok.textContent = 'JS: ready ✅';

    $$('.segBtn[data-level]').forEach(b => b.classList.toggle('isOn', b.dataset.level === state.level));
    $$('.segBtn[data-accent]').forEach(b => b.classList.toggle('isOn', b.dataset.accent === state.accent));
    $('#rate').value = String(state.rate);

    fillVocabCats();
    fillCmpPairs();
    fillWriteTask();
    fillModelScenario();
    fillSpPrompts();
    fillRoleplays();

    updateScoreUI();
    setFR(state.fr);
    setLevel(state.level);
    setAccent(state.accent);

    renderUpgradeChips();
    renderVocab();
    renderLesson();
    renderStructChips();
    renderCmpChips();
    renderCmpModel();
    renderConnChips();
    renderConnExample();
    renderWriting();
    showSubjects();
    renderModelEmail();
    renderProof();
    renderSpeakingPrompt();
    renderFluencyChips();
    renderRoleplay();
    renderFeedback();
    newAccQuiz();
    newConnQuiz();
    loadFix(0);
    renderMistakes('');

    $$('.segBtn[data-level]').forEach(b => b.addEventListener('click', () => setLevel(b.dataset.level)));
    $$('.segBtn[data-accent]').forEach(b => b.addEventListener('click', () => setAccent(b.dataset.accent)));
    safeOn('rate','input', (e) => { state.rate = parseFloat(e.target.value); savePrefs(); });
    safeOn('frToggle','click', () => { setFR(!state.fr); savePrefs(); });

    safeOn('printBtn','click', () => window.print());
    safeOn('resetScore','click', resetScore);
    safeOn('resetAllBtn','click', resetAll);
    safeOn('newSetBtn','click', newSet);

    safeOn('vCat','change', renderVocab);
    safeOn('vSearch','input', renderVocab);
    safeOn('vShuffle','click', shuffleVocab);
    safeOn('vFlash','click', flashOpen);
    safeOn('flashClose','click', flashClose);
    safeOn('flashFlip','click', flashFlip);
    safeOn('flashNext','click', flashNext);
    safeOn('flashPrev','click', flashPrev);
    safeOn('flashCard','click', flashFlip);
    // Extra close methods: click outside modal card, or press ESC
    try{
      const modal = document.getElementById('flashModal');
      if(modal){
        modal.addEventListener('click', (ev) => { if(ev.target === modal) flashClose(); });
      }
      document.addEventListener('keydown', (ev) => {
        if(ev.key === 'Escape'){
          const m = document.getElementById('flashModal');
          if(m && !m.hidden) flashClose();
        }
      });
    }catch(e){}

    safeOn('copyLesson','click', () => copyToClipboard($('#miniLesson').textContent || '', '✅ Rules copied.'));
    safeOn('sayLesson','click', () => speak($('#miniLesson').textContent || ''));

    safeOn('newAccQuiz','click', newAccQuiz);

    safeOn('fixCheck','click', fixCheck);
    safeOn('fixShow','click', fixShow);
    safeOn('fixNew','click', () => loadFix(null));

    safeOn('structClear','click', () => { $('#structOut').value=''; });
    safeOn('structModel','click', renderStructModel);
    safeOn('structSay','click', () => speak($('#structOut').value || ''));

    safeOn('cmpPair','change', () => { renderCmpModel(); });
    safeOn('cmpClear','click', () => { $('#cmpOut').value=''; $('#cmpModelOut').textContent=''; });
    safeOn('cmpModel','click', renderCmpModel);

    safeOn('connClear','click', () => { $('#connOut').value=''; });
    safeOn('connExample','click', renderConnExample);
    safeOn('newConnQuiz','click', newConnQuiz);

    safeOn('writeTask','change', () => { renderWriting(); });
    safeOn('write15','click', writeStart);
    safeOn('writeStop','click', writeStop);
    safeOn('writeListen','click', writeListen);
    safeOn('studentText','input', updateWordCount);
    safeOn('clearStudent','click', () => { $('#studentText').value=''; updateWordCount(); });
    safeOn('copyTemplate','click', copyTemplate);
    safeOn('showModelWrite','click', showModelWrite);

    safeOn('modelScenario','change', () => { showSubjects(); renderModelEmail(); });
    safeOn('showSubjects','click', showSubjects);
    safeOn('copySubjects','click', () => copyToClipboard($('#subjectOut').textContent || '', '✅ Copied.'));
    safeOn('showModelEmail','click', renderModelEmail);
    safeOn('copyModelEmail','click', () => copyToClipboard($('#modelEmailOut').textContent || '', '✅ Copied.'));
    safeOn('sayModelEmail','click', () => speak($('#modelEmailOut').textContent || ''));

    safeOn('spPrompt','change', renderSpeakingPrompt);
    safeOn('sp60','click', spStart);
    safeOn('spStop','click', spStop);
    safeOn('spListen','click', spListen);
    safeOn('spShowModel','click', spShowModel);
    safeOn('spSayModel','click', spSayModel);

    safeOn('rpScenario','change', renderRoleplay);
    safeOn('rpSayYou','click', () => speak($('#rpYou').textContent || ''));
    safeOn('rpSayTeacher','click', () => speak($('#rpTeacher').textContent || ''));
    safeOn('rpNew','click', () => {
      const sel = $('#rpScenario');
      sel.selectedIndex = Math.floor(Math.random()*sel.options.length);
      renderRoleplay();
    });

    safeOn('useWritingBox','click', () => { $('#diffStudent').value = $('#studentText').value || ''; });
    safeOn('clearDiffStudent','click', () => { $('#diffStudent').value=''; });
    safeOn('clearDiffTeacher','click', () => { $('#diffTeacher').value=''; });
    safeOn('compareBtn','click', compareTexts);
  };

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();