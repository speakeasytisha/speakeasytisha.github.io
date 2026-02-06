/* SpeakEasyTisha — Biggest French Mistakes in English (A2/B2/Mixed)
   Tap-friendly, iPad Safari safe, instant feedback, hints, score, timer, US/UK TTS.
*/
(function(){
  "use strict";

  function $(id){ return document.getElementById(id); }
  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function shuffle(arr){
    var a = arr.slice();
    for(var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }
  function norm(s){
    return String(s||"")
      .toLowerCase()
      .replace(/\s+/g," ")
      .replace(/[“”]/g,'"')
      .replace(/[’]/g,"'")
      .trim();
  }

  // -------------------- state --------------------
  var state = {
    level: "A2",       // A2 | B2 | MIX
    accent: "en-US",
    rate: 1,
    scoreNow: 0,
    scoreTotal: 0,
    diagAnswered: {},
    falseAnswered: {},
    boss: { on:false, i:0, streak:0, qs:[], q:null }
  };

  function setScore(addNow, addTotal){
    if(addNow) state.scoreNow += addNow;
    if(addTotal) state.scoreTotal += addTotal;
    $("scoreNow").textContent = String(state.scoreNow);
    $("scoreTotal").textContent = String(state.scoreTotal);
  }

  // -------------------- speech --------------------
  var voiceReady = false;

  function getVoices(){
    return window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }
  function pickVoice(lang){
    var vs = getVoices();
    if(!vs || !vs.length) return null;
    for(var i=0;i<vs.length;i++){ if(vs[i].lang === lang) return vs[i]; }
    for(var j=0;j<vs.length;j++){
      if((vs[j].lang||"").toLowerCase().indexOf(lang.toLowerCase())===0) return vs[j];
    }
    for(var k=0;k<vs.length;k++){
      if((vs[k].lang||"").toLowerCase().indexOf("en")===0) return vs[k];
    }
    return vs[0] || null;
  }

  function stopSpeak(){
    try{ window.speechSynthesis.cancel(); }catch(e){}
  }
  function speak(text, opts){
    if(!window.speechSynthesis) return;
    stopSpeak();
    var u = new SpeechSynthesisUtterance(String(text));
    u.lang = state.accent;
    u.rate = clamp(state.rate, 0.6, 1.4);
    if(opts && typeof opts.rate==="number") u.rate = clamp(opts.rate, 0.6, 1.4);
    var v = pickVoice(state.accent);
    if(v) u.voice = v;
    window.speechSynthesis.speak(u);
  }
  function ensureVoiceWarmed(){
    if(voiceReady) return;
    voiceReady = true;
    speak("Ready.", {rate:1});
  }

  // -------------------- timer --------------------
  var timer = { total: 15*60, left: 15*60, t:null };
  function fmt(sec){
    var m=Math.floor(sec/60), s=sec%60;
    return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  }
  function renderTimer(){ $("time").textContent = fmt(timer.left); }
  function resetTimer(){
    if(timer.t){ clearInterval(timer.t); timer.t=null; }
    timer.left = timer.total;
    renderTimer();
  }
  function startTimer(seconds){
    if(timer.t){ clearInterval(timer.t); timer.t=null; }
    timer.total = seconds; timer.left = seconds;
    renderTimer();
    timer.t = setInterval(function(){
      timer.left = Math.max(0, timer.left-1);
      renderTimer();
      if(timer.left<=0){
        clearInterval(timer.t); timer.t=null;
        speak("Time. Great work.");
      }
    }, 1000);
  }

  // -------------------- LEVEL CONTENT --------------------
  var PLAN_A2 = [
    { t:"A2 Focus: the 8 mistakes that block understanding", b:"Age (I am 40), agree (I agree), actually (right now), since/for, go to/at, uncountables (information/advice), look forward to + -ing, basic chunks (take a photo)." },
    { t:"A2 Trick: stop translating word-for-word", b:"Instead of French logic, learn ready-to-use English chunks: ‘I agree’, ‘I’m looking forward to…’, ‘I’ve been… for…’." },
    { t:"A2 Rhythm: sound more fluent fast", b:"Stress key words and reduce weak words (to, the, for). It helps listeners understand you immediately." }
  ];

  var PLAN_B2 = [
    { t:"B2 Focus: ‘sounds correct’ but is still wrong", b:"Gerund/infinitive patterns, advanced collocations, article choices, prepositions (depend on), register (formal vs natural), and subtle tense meaning." },
    { t:"B2 Trick: upgrade to natural collocations", b:"Use native chunks: ‘make a decision’, ‘do some research’, ‘raise an issue’, ‘take responsibility’." },
    { t:"B2 Precision: meaning shifts", b:"B2 errors often don’t sound ‘bad’, but they change meaning or register (and can sound too French or too direct)." }
  ];

  // Diagnostic sets (10 each)
  var DIAG_A2 = [
    { id:"a1", q:"I am agree with you.", choices:["I agree with you.","I am agree with you."], a:"I agree with you.", hint:"Agree is a verb: I agree."},
    { id:"a2", q:"Actually, I live in Nantes. (meaning: actuellement)", choices:["Right now, I live in Nantes.","Actually, I live in Nantes."], a:"Right now, I live in Nantes.", hint:"Actually = en fait. Right now/currently = actuellement."},
    { id:"a3", q:"I have 50 years.", choices:["I am 50.","I have 50 years."], a:"I am 50.", hint:"Age uses BE in English."},
    { id:"a4", q:"I work here since 2022.", choices:["I've worked here since 2022.","I work here since 2022."], a:"I've worked here since 2022.", hint:"Since + start point → Present Perfect (still true)."},
    { id:"a5", q:"I look forward to meet you.", choices:["I look forward to meeting you.","I look forward to meet you."], a:"I look forward to meeting you.", hint:"To here is a preposition → -ing."},
    { id:"a6", q:"He explained me the problem.", choices:["He explained the problem to me.","He explained me the problem."], a:"He explained the problem to me.", hint:"Explain + something + to someone."},
    { id:"a7", q:"We will see us tomorrow.", choices:["We’ll see each other tomorrow.","We will see us tomorrow."], a:"We’ll see each other tomorrow.", hint:"Each other = l’un l’autre."},
    { id:"a8", q:"I did a photo.", choices:["I took a photo.","I did a photo."], a:"I took a photo.", hint:"Take a photo, do homework, make a cake."},
    { id:"a9", q:"I’m going at the office.", choices:["I’m going to the office.","I’m going at the office."], a:"I’m going to the office.", hint:"Go to = destination."},
    { id:"a10", q:"I have many informations.", choices:["I have a lot of information.","I have many informations."], a:"I have a lot of information.", hint:"Information is uncountable."}
  ];

  var DIAG_B2 = [
    { id:"b1", q:"I suggest you to do it.", choices:["I suggest you do it.","I suggest you to do it.","I suggest doing it."], a:"I suggest you do it.", hint:"Suggest + clause OR suggest + -ing (no ‘to’)."},
    { id:"b2", q:"I’m used to work late.", choices:["I’m used to working late.","I’m used to work late."], a:"I’m used to working late.", hint:"Used to + -ing (to = preposition)."},
    { id:"b3", q:"He insisted to pay.", choices:["He insisted on paying.","He insisted to pay."], a:"He insisted on paying.", hint:"Insist on + -ing."},
    { id:"b4", q:"We discussed about the issue.", choices:["We discussed the issue.","We discussed about the issue."], a:"We discussed the issue.", hint:"Discuss already includes ‘about’."},
    { id:"b5", q:"It depends of the context.", choices:["It depends on the context.","It depends of the context."], a:"It depends on the context.", hint:"Depend on (not of)."},
    { id:"b6", q:"I’m boring in meetings.", choices:["I’m bored in meetings.","I’m boring in meetings."], a:"I’m bored in meetings.", hint:"Bored = how you feel. Boring = what you are to others."},
    { id:"b7", q:"I did researches.", choices:["I did some research.","I did researches."], a:"I did some research.", hint:"Research is usually uncountable."},
    { id:"b8", q:"I have a good level in English.", choices:["I have a good level of English.","I have a good level in English."], a:"I have a good level of English.", hint:"Level of (or: My English level is good)."},
    { id:"b9", q:"I’m here since Monday.", choices:["I’ve been here since Monday.","I’m here since Monday."], a:"I’ve been here since Monday.", hint:"Since + still true → Present Perfect (been)."},
    { id:"b10", q:"On the other hand (used as ‘also’).", choices:["Also / Besides, …","On the other hand, …"], a:"Also / Besides, …", hint:"On the other hand introduces contrast (two sides)."}
  ];

  // Mistake cards (we’ll display up to 12)
  var MISTAKES_A2 = [
    { tag:"Grammar", title:"I am agree", fr:"Je suis d’accord.", en:"✅ I agree. / I agree with you.", why:"Agree is a verb in English.", tip:"Drop ‘am’. Just: I agree." },
    { tag:"Vocabulary", title:"Actually ≠ actuellement", fr:"Actuellement, je suis fatigué(e).", en:"✅ Right now / Currently, I’m tired.", why:"Actually = en fait (correction).", tip:"Use actually to correct: ‘Actually, I can’t.’" },
    { tag:"Grammar", title:"I have 30 years", fr:"J’ai 30 ans.", en:"✅ I’m 30.", why:"Age uses BE.", tip:"I’m + age." },
    { tag:"Tenses", title:"Since/For + Present Perfect", fr:"Je travaille ici depuis 2022.", en:"✅ I’ve worked here since 2022.", why:"Started then, still true now.", tip:"Since + start; For + duration." },
    { tag:"Chunks", title:"Look forward to + -ing", fr:"Au plaisir de te rencontrer.", en:"✅ I’m looking forward to meeting you.", why:"To = preposition → -ing.", tip:"To seeing you / to hearing from you." },
    { tag:"Prepositions", title:"Go to vs at", fr:"Je vais au bureau / Je suis au bureau.", en:"✅ I’m going to the office / I’m at the office.", why:"To = destination; at = location.", tip:"to (movement) vs at (place)." },
    { tag:"Chunks", title:"Take/Do/Make", fr:"Je fais une photo.", en:"✅ I take a photo.", why:"English uses set chunks.", tip:"Take a photo • Do homework • Make a cake." },
    { tag:"Pronouns", title:"See us / each other", fr:"On se voit demain.", en:"✅ We’ll see each other tomorrow.", why:"Each other = l’un l’autre.", tip:"each other / one another." },
    { tag:"Uncountable", title:"Informations / advices", fr:"J’ai des infos / des conseils.", en:"✅ some information / some advice", why:"Uncountable in English.", tip:"a piece of advice; some information." },
    { tag:"Word order", title:"Adverb placement", fr:"Je souvent fais ça.", en:"✅ I often do that.", why:"Often before main verb.", tip:"I usually / I often / I always + verb." },
    { tag:"Prepositions", title:"Married to (not with)", fr:"Je suis mariée avec…", en:"✅ I’m married to…", why:"Fixed preposition.", tip:"Married to; engaged to." },
    { tag:"Vocabulary", title:"Assist ≠ attend", fr:"J’assiste à une réunion.", en:"✅ I attend a meeting.", why:"Assist = help; attend = be present.", tip:"Attend a meeting; assist someone." }
  ];

  var MISTAKES_B2 = [
    { tag:"Grammar", title:"Suggest you to…", fr:"Je te suggère de…", en:"✅ I suggest you do it. / I suggest doing it.", why:"No ‘to’ after suggest.", tip:"Suggest + clause OR + -ing." },
    { tag:"Grammar", title:"Used to + -ing", fr:"Je suis habitué(e) à…", en:"✅ I’m used to working late.", why:"To = preposition.", tip:"used to + noun/-ing." },
    { tag:"Prepositions", title:"Depend on (not of)", fr:"Ça dépend de…", en:"✅ It depends on…", why:"Fixed preposition.", tip:"depend on; rely on." },
    { tag:"Collocations", title:"Do research (uncountable)", fr:"J’ai fait des recherches.", en:"✅ I did some research.", why:"Research usually uncountable.", tip:"some research; a study; findings." },
    { tag:"Register", title:"On the other hand (wrong use)", fr:"D’un autre côté (= aussi)", en:"✅ Also / Besides / In addition, …", why:"‘On the other hand’ = contrast.", tip:"Use it only with two sides." },
    { tag:"Grammar", title:"Discuss (no ‘about’)", fr:"Discuter de…", en:"✅ We discussed the issue.", why:"Discuss already contains ‘about’.", tip:"Talk about; discuss something." },
    { tag:"Meaning", title:"Bored vs boring", fr:"Je m’ennuie.", en:"✅ I’m bored.", why:"Bored = feeling; boring = causing boredom.", tip:"I’m bored / It’s boring." },
    { tag:"Precision", title:"I’m here since Monday", fr:"Je suis ici depuis lundi.", en:"✅ I’ve been here since Monday.", why:"Since + still true → Present Perfect.", tip:"I’ve been… since/for." },
    { tag:"Collocations", title:"Raise an issue / bring up", fr:"Soulever un problème.", en:"✅ raise an issue / bring it up", why:"More natural business English.", tip:"raise, address, resolve an issue." },
    { tag:"Articles", title:"In the morning / at night", fr:"Le matin / la nuit", en:"✅ in the morning / at night", why:"Common fixed patterns.", tip:"in the afternoon; at noon; at night." },
    { tag:"Vocabulary", title:"Eventually ≠ éventuellement", fr:"Éventuellement, on peut…", en:"✅ Possibly / If needed, we can…", why:"Eventually = finally (after time).", tip:"Possibly/Maybe/If necessary." },
    { tag:"Precision", title:"My English is not very good (polite) vs I’m bad", fr:"Je suis nul(le)…", en:"✅ My English isn’t great yet.", why:"More natural + confident tone.", tip:"not great yet / still learning." }
  ];

  // Fix-it sets (10 each)
  var FIX_A2 = [
    { bad:"I am agree with this idea.", good:["I agree with this idea.","I agree with the idea."], hint:"Agree = verb (no ‘am’)."},
    { bad:"Actually, I’m tired. (meaning: actuellement)", good:["Right now, I'm tired.","Currently, I'm tired.","At the moment, I'm tired."], hint:"Actually = en fait. Use right now/currently."},
    { bad:"I have 32 years.", good:["I'm 32.","I am 32."], hint:"Age uses BE: I’m 32."},
    { bad:"I work here since 2021.", good:["I've worked here since 2021.","I have worked here since 2021.","I've been working here since 2021.","I have been working here since 2021."], hint:"Since + still true → Present Perfect."},
    { bad:"I look forward to meet you tomorrow.", good:["I look forward to meeting you tomorrow.","I'm looking forward to meeting you tomorrow."], hint:"Look forward to + -ing."},
    { bad:"He explained me the rules.", good:["He explained the rules to me.","He explained it to me."], hint:"Explain + thing + to someone."},
    { bad:"We will see us next week.", good:["We'll see each other next week.","We will see each other next week."], hint:"Each other = l’un l’autre."},
    { bad:"I did a photo of the hotel.", good:["I took a photo of the hotel.","I took a picture of the hotel."], hint:"Take a photo/picture."},
    { bad:"I’m going at the station.", good:["I'm going to the station.","I am going to the station."], hint:"To = destination."},
    { bad:"I have many informations.", good:["I have a lot of information.","I have some information.","I have lots of information."], hint:"Information is uncountable."}
  ];

  var FIX_B2 = [
    { bad:"I suggest you to call him.", good:["I suggest you call him.","I suggest calling him."], hint:"Suggest + clause OR + -ing (no ‘to’)."},
    { bad:"We discussed about the contract.", good:["We discussed the contract."], hint:"Discuss + object (no ‘about’)."},
    { bad:"It depends of the supplier.", good:["It depends on the supplier."], hint:"Depend ON."},
    { bad:"I’m used to work late.", good:["I'm used to working late.","I am used to working late."], hint:"Used to + -ing."},
    { bad:"He insisted to pay.", good:["He insisted on paying."], hint:"Insist on + -ing."},
    { bad:"I did researches before the meeting.", good:["I did some research before the meeting."], hint:"Research usually uncountable."},
    { bad:"On the other hand, we can also try option B. (meaning: aussi)", good:["Also, we can try option B.","In addition, we can try option B.","Besides, we can try option B."], hint:"On the other hand = contrast."},
    { bad:"I’m boring in meetings.", good:["I'm bored in meetings."], hint:"Bored (feeling) vs boring (cause)."},
    { bad:"I’m here since Monday.", good:["I've been here since Monday.","I have been here since Monday."], hint:"Since + still true → Present Perfect (been)."},
    { bad:"Eventually, we can change the plan. (meaning: éventuellement)", good:["Possibly, we can change the plan.","If needed, we can change the plan.","If necessary, we can change the plan."], hint:"Eventually = finally (after time)."}
  ];

  // False friends sets
  var FALSE_A2 = [
    { id:"fa1", q:"Actually means…", choices:["en fait","actuellement"], a:"en fait", hint:"Actually = in fact / en fait." },
    { id:"fa2", q:"Eventually means…", choices:["finalement","éventuellement"], a:"finalement", hint:"Eventually = finally (after time)." },
    { id:"fa3", q:"Library means…", choices:["bibliothèque","librairie"], a:"bibliothèque", hint:"Bookstore = bookshop." },
    { id:"fa4", q:"To attend means…", choices:["assister à","attendre"], a:"assister à", hint:"Wait = attendre." },
    { id:"fa5", q:"To assist means…", choices:["aider","assister à (être présent)"], a:"aider", hint:"Assist = help. Attend = assister à." },
    { id:"fa6", q:"Sympathetic is…", choices:["compatissant","sympa"], a:"compatissant", hint:"Nice/friendly = sympa." },
    { id:"fa7", q:"Sensible is…", choices:["raisonnable","émotif"], a:"raisonnable", hint:"Sensitive = émotif." },
    { id:"fa8", q:"Demand means…", choices:["exiger","demander"], a:"exiger", hint:"Ask = demander." }
  ];

  var FALSE_B2 = [
    { id:"fb1", q:"Comprehensive means…", choices:["complet / détaillé","compréhensif"], a:"complet / détaillé", hint:"Compréhensif = understanding." },
    { id:"fb2", q:"To resume means…", choices:["reprendre","résumer"], a:"reprendre", hint:"Summary = résumé; to summarize = résumer." },
    { id:"fb3", q:"To argue means…", choices:["se disputer / se quereller","argumenter calmement"], a:"se disputer / se quereller", hint:"Argue = often conflict. Discuss/debate = calmer." },
    { id:"fb4", q:"A delay is…", choices:["un retard","un délai"], a:"un retard", hint:"Time limit/period = time frame / deadline." },
    { id:"fb5", q:"To control means…", choices:["contrôler / vérifier","contrôler (= diriger)"], a:"contrôler / vérifier", hint:"Control often = manage; but in many contexts: check/verify." },
    { id:"fb6", q:"To assist means…", choices:["aider","assister à"], a:"aider", hint:"Assist = help; attend = be present." },
    { id:"fb7", q:"Eventually means…", choices:["finalement","éventuellement"], a:"finalement", hint:"Possibly/If needed = éventuellement." },
    { id:"fb8", q:"To realize means…", choices:["se rendre compte","réaliser (créer)"], a:"se rendre compte", hint:"Create/make = create/produce; realize = notice/understand." }
  ];

  // Speaking prompts
  var SPEAK_A2 = [
    { p:"Correct a misunderstanding politely (use ‘actually’ correctly).", model:"Actually, I meant next week, not tomorrow." },
    { p:"Say how long you’ve been doing something (since/for + Present Perfect).", model:"I've been learning English for two years." },
    { p:"Make a simple professional request.", model:"Could you send me the information, please?" },
    { p:"Use ‘look forward to’ correctly.", model:"I'm looking forward to meeting you." }
  ];

  var SPEAK_B2 = [
    { p:"Make a diplomatic correction (soft tone).", model:"Actually, I think we may need a bit more time to confirm." },
    { p:"Raise an issue + propose a solution (natural collocations).", model:"I'd like to raise an issue about delivery times and suggest a quick check-in call." },
    { p:"Contrast correctly (use ‘on the other hand’ properly).", model:"This option is cheaper. On the other hand, it's riskier for quality." },
    { p:"Use -ing patterns (used to / insist on / suggest).", model:"I'm used to working under pressure, and I suggest doing a short pilot first." }
  ];

  // Boss fight (12 each)
  function buildBossA2(){
    var qs = [
      { prompt:"Choose the correct sentence:", say:"I agree with you.", choices:["I am agree with you.","I agree with you.","I’m agree with you."], a:"I agree with you." },
      { prompt:"Meaning: actuellement", say:"Right now, I'm working.", choices:["Actually, I'm working.","Right now, I'm working.","Eventually, I'm working."], a:"Right now, I'm working." },
      { prompt:"Pick the correct chunk:", say:"I’m looking forward to meeting you.", choices:["…to meet you.","…to meeting you.","…to met you."], a:"…to meeting you." },
      { prompt:"Since vs For:", say:"since 2022", choices:["for 2022","since 2022","since 3 years"], a:"since 2022" },
      { prompt:"Uncountable:", say:"information", choices:["informations","information","information(s)"], a:"information" },
      { prompt:"Preposition:", say:"I’m going ___ the office.", choices:["at","to","in"], a:"to" },
      { prompt:"Ask/Explain:", say:"He explained it ___ me.", choices:["to","at","for"], a:"to" },
      { prompt:"Make/Do/Take:", say:"I ___ a photo.", choices:["do","take","make"], a:"take" },
      { prompt:"Each other:", say:"We’ll see ___ tomorrow.", choices:["us","each other","ourselves"], a:"each other" },
      { prompt:"Attend:", say:"I attended a meeting.", choices:["J’ai attendu…","J’ai assisté à…","J’ai demandé…"], a:"J’ai assisté à…" },
      { prompt:"Age:", say:"I’m 40.", choices:["I have 40 years.","I’m 40.","I’m having 40."], a:"I’m 40." },
      { prompt:"Actually means…", say:"Actually", choices:["en fait","actuellement","finalement"], a:"en fait" }
    ];
    return shuffle(qs).slice(0,12);
  }

  function buildBossB2(){
    var qs = [
      { prompt:"Choose the natural option:", say:"I suggest…", choices:["I suggest you to do it.","I suggest you do it.","I suggest you for doing it."], a:"I suggest you do it." },
      { prompt:"Correct form:", say:"I’m used to…", choices:["work late","working late","to work late"], a:"working late" },
      { prompt:"Correct preposition:", say:"It depends ___ the context.", choices:["of","on","from"], a:"on" },
      { prompt:"Correct structure:", say:"We discussed…", choices:["about the issue","the issue","to the issue"], a:"the issue" },
      { prompt:"Meaning:", say:"I’m bored.", choices:["Je suis ennuyeux(se).","Je m’ennuie.","Je suis motivé(e)."], a:"Je m’ennuie." },
      { prompt:"Research:", say:"I did…", choices:["researches","some research","a researches"], a:"some research" },
      { prompt:"Contrast:", say:"This is cheaper. ___ it’s riskier.", choices:["Also,","On the other hand,","Besides, (same meaning)"], a:"On the other hand," },
      { prompt:"Insist:", say:"He insisted ___ paying.", choices:["to","on","for"], a:"on" },
      { prompt:"Eventually (FR: éventuellement):", say:"…we can change the plan.", choices:["Possibly,","Eventually,","Actually,"], a:"Possibly," },
      { prompt:"Since still true:", say:"I’ve been here ___ Monday.", choices:["for","since","during"], a:"since" },
      { prompt:"Good level:", say:"I have a good level ___ English.", choices:["in","of","at"], a:"of" },
      { prompt:"On the other hand means…", say:"On the other hand", choices:["contrast","also","example"], a:"contrast" }
    ];
    return shuffle(qs).slice(0,12);
  }

  // -------------------- selectors based on level --------------------
  function getPlan(){
    if(state.level==="B2") return PLAN_B2;
    if(state.level==="MIX") return PLAN_A2.concat(PLAN_B2);
    return PLAN_A2;
  }
  function getDiag(){
    if(state.level==="B2") return DIAG_B2;
    if(state.level==="MIX") return shuffle(DIAG_A2.concat(DIAG_B2)).slice(0,10);
    return DIAG_A2;
  }
  function getMistakes(){
    var all = (state.level==="B2") ? MISTAKES_B2
            : (state.level==="MIX") ? MISTAKES_A2.concat(MISTAKES_B2)
            : MISTAKES_A2;
    return shuffle(all).slice(0,12);
  }
  function getFix(){
    if(state.level==="B2") return FIX_B2;
    if(state.level==="MIX") return shuffle(FIX_A2.concat(FIX_B2)).slice(0,12);
    return FIX_A2;
  }
  function getFalse(){
    if(state.level==="B2") return FALSE_B2;
    if(state.level==="MIX") return shuffle(FALSE_A2.concat(FALSE_B2)).slice(0,8);
    return FALSE_A2;
  }
  function getSpeak(){
    if(state.level==="B2") return SPEAK_B2;
    if(state.level==="MIX") return SPEAK_A2.concat(SPEAK_B2);
    return SPEAK_A2;
  }
  function buildBoss(){
    if(state.level==="B2") return buildBossB2();
    if(state.level==="MIX") return shuffle(buildBossA2().concat(buildBossB2())).slice(0,12);
    return buildBossA2();
  }

  // -------------------- render helpers --------------------
  function setFeedback(id, text, kind){
    var el = $(id);
    if(!el) return;
    el.className = "feedback" + (kind ? (" "+kind) : "");
    el.textContent = text;
  }

  function renderAccordion(){
    var PLAN = getPlan();
    var box = $("planAcc");
    box.innerHTML = "";
    for(var i=0;i<PLAN.length;i++){
      (function(item){
        var w = document.createElement("div");
        w.className = "acc";
        w.innerHTML =
          '<button type="button" class="acc__btn">'+item.t+'</button>' +
          '<div class="acc__body">'+item.b+'</div>';
        w.querySelector(".acc__btn").addEventListener("click", function(){
          w.classList.toggle("is-open");
        });
        box.appendChild(w);
      })(PLAN[i]);
    }
  }

  function renderQuiz(list, rootId, answeredMap, feedbackId){
    var root = $(rootId);
    root.innerHTML = "";

    for(var i=0;i<list.length;i++){
      (function(q, idx){
        var card = document.createElement("div");
        card.className = "q";
        card.setAttribute("data-id", q.id || ("q"+idx));

        var meta =
          '<div class="q__top">' +
            '<div><div class="q__title">'+(idx+1)+') '+q.q+'</div></div>' +
            '<div class="q__meta">' +
              '<button type="button" class="btn btn--ghost btnHint">💡 Hint</button>' +
              '<button type="button" class="btn btn--ghost btnSay">🔊</button>' +
            '</div>' +
          '</div>';

        var choices = document.createElement("div");
        choices.className = "q__choices";

        for(var c=0;c<q.choices.length;c++){
          (function(ch){
            var b = document.createElement("button");
            b.type = "button";
            b.className = "choice";
            b.textContent = ch;

            b.addEventListener("click", function(){
              ensureVoiceWarmed();
              var id = card.getAttribute("data-id");
              if(answeredMap[id]) return;

              answeredMap[id] = true;
              setScore(0,1);

              var ok = (ch === q.a);
              if(ok){
                b.classList.add("is-right");
                setScore(1,0);
                setFeedback(feedbackId, "✅ Correct: " + q.a, "good");
                speak("Correct.", {rate:1});
              } else {
                b.classList.add("is-wrong");
                var all = choices.querySelectorAll(".choice");
                for(var k=0;k<all.length;k++){
                  if(all[k].textContent === q.a) all[k].classList.add("is-right");
                }
                setFeedback(feedbackId, "❌ Not quite. Correct: " + q.a + " • " + q.hint, "bad");
                speak("Not quite.", {rate:1});
              }
            });

            choices.appendChild(b);
          })(q.choices[c]);
        }

        card.innerHTML = meta;
        card.appendChild(choices);

        var hint = document.createElement("div");
        hint.className = "hint";
        hint.textContent = q.hint;
        card.appendChild(hint);

        card.querySelector(".btnHint").addEventListener("click", function(){
          card.classList.toggle("is-showhint");
        });
        card.querySelector(".btnSay").addEventListener("click", function(){
          ensureVoiceWarmed();
          speak(q.a, {rate: state.rate});
        });

        root.appendChild(card);
      })(list[i], i);
    }
  }

  function renderMistakeCards(){
    var box = $("mistakeCards");
    box.innerHTML = "";
    var list = getMistakes();

    for(var i=0;i<list.length;i++){
      (function(m){
        var d = document.createElement("div");
        d.className = "cardx";
        d.innerHTML =
          '<div class="badge">💥 <span>'+m.tag+'</span></div>' +
          '<div class="cardx__title">'+m.title+'</div>' +
          '<div class="kv"><b>FR:</b> '+m.fr+'</div>' +
          '<div class="kv"><b>EN:</b> '+m.en+'</div>' +
          '<div class="kv"><b>Why:</b> '+m.why+'</div>' +
          '<div class="kv"><b>Tip:</b> '+m.tip+'</div>' +
          '<div class="cardx__btns">' +
            '<button type="button" class="btn btn--ghost btnSayFR">🔊 FR</button>' +
            '<button type="button" class="btn btn--ghost btnSayEN">🔊 EN</button>' +
          '</div>';
        d.querySelector(".btnSayFR").addEventListener("click", function(){
          ensureVoiceWarmed();
          speak(m.fr, {rate: state.rate});
        });
        d.querySelector(".btnSayEN").addEventListener("click", function(){
          ensureVoiceWarmed();
          speak(m.en.replace("✅ ",""), {rate: state.rate});
        });
        box.appendChild(d);
      })(list[i]);
    }
  }

  function renderFix(){
    var FIX = getFix();
    var box = $("fixList");
    box.innerHTML = "";

    for(var i=0;i<FIX.length;i++){
      (function(item, idx){
        var w = document.createElement("div");
        w.className = "fix";
        w.innerHTML =
          '<div class="fix__row">' +
            '<div class="fix__bad">'+(idx+1)+') ❌ '+item.bad+'</div>' +
            '<div class="fix__tools">' +
              '<button type="button" class="btn btn--ghost btnHint">💡 Hint</button>' +
              '<button type="button" class="btn btn--ghost btnShow">👀 Show</button>' +
              '<button type="button" class="btn btn--ghost btnSay">🔊</button>' +
              '<button type="button" class="btn btn--ghost btnCheck">✅ Check</button>' +
            '</div>' +
          '</div>' +
          '<div class="fix__mini muted">Type the corrected sentence:</div>' +
          '<input class="input" type="text" inputmode="text" autocomplete="off" spellcheck="false" />' +
          '<div class="fix__out" aria-live="polite">—</div>';

        var input = w.querySelector(".input");
        var out = w.querySelector(".fix__out");

        w.querySelector(".btnHint").addEventListener("click", function(){
          setFeedback("fixFeedback", "💡 " + item.hint, null);
        });
        w.querySelector(".btnShow").addEventListener("click", function(){
          input.value = item.good[0];
          setFeedback("fixFeedback", "Shown. Now say it out loud with rhythm.", null);
        });
        w.querySelector(".btnSay").addEventListener("click", function(){
          ensureVoiceWarmed();
          speak(item.good[0], {rate: state.rate});
        });

        function checkOne(){
          var v = norm(input.value);
          setScore(0,1);
          var ok = false;
          for(var k=0;k<item.good.length;k++){
            if(norm(item.good[k]) === v){ ok = true; break; }
          }
          if(ok){
            setScore(1,0);
            out.className = "fix__out good";
            out.textContent = "✅ Correct. Nice!";
          } else {
            out.className = "fix__out bad";
            out.textContent = "❌ Try again. Hint: " + item.hint + " | Example: " + item.good[0];
          }
          return ok;
        }

        w.querySelector(".btnCheck").addEventListener("click", function(){
          ensureVoiceWarmed();
          var ok = checkOne();
          speak(ok ? "Correct." : "Try again.", {rate: 1});
        });

        input.addEventListener("keydown", function(e){
          if(e.key === "Enter"){
            e.preventDefault();
            w.querySelector(".btnCheck").click();
          }
        });

        box.appendChild(w);
      })(FIX[i], i);
    }
  }

  function checkAllFix(){
    var FIX = getFix();
    var fixes = $("fixList").querySelectorAll(".fix");
    var okCount = 0;

    for(var i=0;i<fixes.length;i++){
      var w = fixes[i];
      var input = w.querySelector(".input");
      var out = w.querySelector(".fix__out");
      var item = FIX[i];

      var v = norm(input.value);
      setScore(0,1);

      var ok = false;
      for(var k=0;k<item.good.length;k++){
        if(norm(item.good[k]) === v){ ok=true; break; }
      }

      if(ok){
        setScore(1,0);
        out.className = "fix__out good";
        out.textContent = "✅ Correct.";
        okCount++;
      } else {
        out.className = "fix__out bad";
        out.textContent = "❌ " + item.good[0];
      }
    }

    setFeedback("fixFeedback", "Fix-it results: " + okCount + "/" + FIX.length + " correct.", okCount === FIX.length ? "good" : null);
  }

  function renderSpeak(){
    var SPEAK = getSpeak();
    var box = $("speakList");
    box.innerHTML = "";
    for(var i=0;i<SPEAK.length;i++){
      (function(s, idx){
        var d = document.createElement("div");
        d.className = "sp";
        d.innerHTML =
          '<div class="sp__prompt">'+(idx+1)+') '+s.p+'</div>' +
          '<div class="btnrow">' +
            '<button type="button" class="btn btn--ghost btnModel">Model</button>' +
            '<button type="button" class="btn btn--ghost btnSay">🔊 Listen</button>' +
          '</div>' +
          '<div class="sp__model" style="display:none"></div>';

        var model = d.querySelector(".sp__model");
        d.querySelector(".btnModel").addEventListener("click", function(){
          model.style.display = (model.style.display === "none") ? "block" : "none";
          model.textContent = s.model;
        });
        d.querySelector(".btnSay").addEventListener("click", function(){
          ensureVoiceWarmed();
          speak(s.model, {rate: state.rate});
        });

        box.appendChild(d);
      })(SPEAK[i], i);
    }
  }

  function renderCheat(){
    var el = $("cheatContent");
    var lvl = state.level;

    if(lvl==="A2"){
      el.innerHTML =
        '<h3>A2 Cheat Sheet</h3>' +
        '<ul>' +
          '<li><b>I am agree</b> → <b>I agree</b></li>' +
          '<li><b>Actually</b> = en fait • <b>Right now/Currently</b> = actuellement</li>' +
          '<li><b>I have 50 years</b> → <b>I am 50</b></li>' +
          '<li><b>since</b> + start point • <b>for</b> + duration</li>' +
          '<li><b>information/advice</b> uncountable: some information, some advice</li>' +
          '<li><b>look forward to</b> + <b>-ing</b></li>' +
          '<li><b>go to</b> (destination) • <b>at</b> (location)</li>' +
          '<li><b>take</b> a photo • <b>do</b> homework • <b>make</b> a cake</li>' +
        '</ul>';
    } else if(lvl==="B2"){
      el.innerHTML =
        '<h3>B2 Cheat Sheet</h3>' +
        '<ul>' +
          '<li><b>suggest</b>: I suggest you do it / I suggest doing it (no “to”)</li>' +
          '<li><b>used to</b> + -ing: I’m used to working…</li>' +
          '<li><b>depend on</b> (not of) • <b>discuss</b> (no about)</li>' +
          '<li><b>research</b> uncountable: do some research</li>' +
          '<li><b>bored</b> (feeling) vs <b>boring</b> (cause)</li>' +
          '<li><b>on the other hand</b> = contrast (not “also”)</li>' +
          '<li><b>collocations</b>: raise an issue / bring it up / take responsibility</li>' +
        '</ul>';
    } else {
      el.innerHTML =
        '<h3>Mixed Cheat Sheet (A2 + B2)</h3>' +
        '<p class="muted">Use A2 core fixes + B2 natural upgrades.</p>' +
        '<ul>' +
          '<li>A2: I agree • Right now • I’m 30 • since/for • uncountables</li>' +
          '<li>B2: suggest + clause/-ing • used to + -ing • depend on • discuss (no about)</li>' +
          '<li>B2: research uncountable • bored/boring • “on the other hand” = contrast</li>' +
        '</ul>';
    }
  }

  // -------------------- boss fight --------------------
  function resetBoss(){
    state.boss.on = false;
    state.boss.i = 0;
    state.boss.streak = 0;
    state.boss.qs = [];
    state.boss.q = null;
    $("bossNum").textContent = "1";
    $("bossStreak").textContent = "0";
    $("bossPrompt").textContent = "Press Start.";
    $("bossChoices").innerHTML = "";
    setFeedback("bossFeedback", "Tip: listen once, answer fast.", null);
  }

  function startBoss(){
    ensureVoiceWarmed();
    state.boss.on = true;
    state.boss.i = 0;
    state.boss.streak = 0;
    state.boss.qs = buildBoss();
    nextBoss();
  }

  function nextBoss(){
    if(!state.boss.on) return;

    if(state.boss.i >= 12){
      setFeedback("bossFeedback", "🏁 Done! Final streak: " + state.boss.streak, "good");
      speak("Boss fight complete.", {rate:1});
      state.boss.on = false;
      return;
    }

    state.boss.q = state.boss.qs[state.boss.i];
    $("bossNum").textContent = String(state.boss.i + 1);
    $("bossStreak").textContent = String(state.boss.streak);
    $("bossPrompt").textContent = state.boss.q.prompt + "  (" + state.boss.q.say + ")";

    var choices = shuffle(state.boss.q.choices);
    var box = $("bossChoices");
    box.innerHTML = "";

    for(var i=0;i<choices.length;i++){
      (function(ch){
        var b = document.createElement("button");
        b.type = "button";
        b.className = "choiceBtn";
        b.textContent = ch;
        b.addEventListener("click", function(){ answerBoss(ch); });
        box.appendChild(b);
      })(choices[i]);
    }

    setFeedback("bossFeedback", "Go! 🔥", null);
  }

  function listenBoss(){
    if(!state.boss.q) return;
    ensureVoiceWarmed();
    speak(state.boss.q.say, {rate: state.rate});
  }

  function answerBoss(choice){
    if(!state.boss.q) return;

    setScore(0,1);
    var ok = (choice === state.boss.q.a);

    if(ok){
      state.boss.streak += 1;
      setScore(1,0);
      setFeedback("bossFeedback", "✅ Correct! Streak: " + state.boss.streak, "good");
      speak("Correct.", {rate:1});
    } else {
      state.boss.streak = 0;
      setFeedback("bossFeedback", "❌ Correct: " + state.boss.q.a, "bad");
      speak("Not quite.", {rate:1});
    }

    state.boss.i += 1;
    nextBoss();
  }

  function skipBoss(){
    if(!state.boss.on) return;
    state.boss.i += 1;
    nextBoss();
  }

  // -------------------- actions --------------------
  function renderAll(){
    // reset per-section answer locks so it’s fresh after level switch
    state.diagAnswered = {};
    state.falseAnswered = {};
    resetBoss();

    renderAccordion();
    renderQuiz(getDiag(), "diagQuiz", state.diagAnswered, "diagFeedback");
    renderMistakeCards();
    renderFix();
    renderQuiz(getFalse(), "falseQuiz", state.falseAnswered, "falseFeedback");
    renderSpeak();
    renderCheat();

    setFeedback("diagFeedback", "Level: " + state.level + " — start the diagnostic.", null);
    setFeedback("falseFeedback", "Level: " + state.level + " — pick an answer.", null);
    setFeedback("fixFeedback", "Level: " + state.level + " — type the corrections.", null);
  }

  function bindHeader(){
    // Handle both accent + level seg buttons
    var segBtns = document.querySelectorAll(".seg__btn");
    for(var i=0;i<segBtns.length;i++){
      (function(btn){
        btn.addEventListener("click", function(){
          if(btn.getAttribute("data-accent")){
            // accent group
            var aBtns = document.querySelectorAll('.seg__btn[data-accent]');
            for(var k=0;k<aBtns.length;k++) aBtns[k].classList.remove("is-on");
            btn.classList.add("is-on");
            state.accent = btn.getAttribute("data-accent") || "en-US";
            ensureVoiceWarmed();
            return;
          }
          if(btn.getAttribute("data-level")){
            // level group
            var lBtns = document.querySelectorAll('.seg__btn[data-level]');
            for(var j=0;j<lBtns.length;j++) lBtns[j].classList.remove("is-on");
            btn.classList.add("is-on");
            state.level = btn.getAttribute("data-level") || "A2";
            renderAll();
            speak("Level " + (state.level==="MIX" ? "mixed" : state.level) + ".", {rate:1});
          }
        });
      })(segBtns[i]);
    }

    $("rate").addEventListener("input", function(){
      state.rate = parseFloat($("rate").value) || 1;
      $("rateVal").textContent = state.rate.toFixed(2) + "×";
    });

    $("testVoice").addEventListener("click", function(){
      ensureVoiceWarmed();
      speak("Test voice. Ready to practice.", {rate: state.rate});
    });
    $("stopVoice").addEventListener("click", stopSpeak);

    $("start15").addEventListener("click", function(){ startTimer(15*60); });
    $("start8").addEventListener("click", function(){ startTimer(8*60); });
    $("resetTimer").addEventListener("click", resetTimer);
  }

  function init(){
    if(window.speechSynthesis){
      window.speechSynthesis.onvoiceschanged = function(){};
      getVoices();
    }

    bindHeader();

    // Buttons
    $("diagReset").addEventListener("click", function(){
      state.diagAnswered = {};
      renderQuiz(getDiag(), "diagQuiz", state.diagAnswered, "diagFeedback");
      setFeedback("diagFeedback", "Reset done.", null);
    });
    $("diagReview").addEventListener("click", function(){
      setFeedback("diagFeedback", "Review: correct answers are highlighted in green after you answer.", null);
    });

    $("mistakesShuffle").addEventListener("click", renderMistakeCards);
    $("mistakesSpeak").addEventListener("click", function(){
      ensureVoiceWarmed();
      var list = getMistakes().slice(0,6).map(function(m){ return m.en.replace("✅ ",""); });
      speak(list.join(" ... "), {rate: state.rate});
    });

    $("fixReset").addEventListener("click", function(){
      renderFix();
      setFeedback("fixFeedback", "Reset done.", null);
    });
    $("fixScore").addEventListener("click", checkAllFix);

    $("falseReset").addEventListener("click", function(){
      state.falseAnswered = {};
      renderQuiz(getFalse(), "falseQuiz", state.falseAnswered, "falseFeedback");
      setFeedback("falseFeedback", "Reset done.", null);
    });

    $("bossStart").addEventListener("click", startBoss);
    $("bossListen").addEventListener("click", listenBoss);
    $("bossSkip").addEventListener("click", skipBoss);

    $("printBtn").addEventListener("click", function(){ window.print(); });

    resetTimer();
    renderAll();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
