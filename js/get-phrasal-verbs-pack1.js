(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const state = {
    seed: Math.floor(Math.random()*1e9),
    level: "b1",
    accent: "US",
    fr: false,
    score: {c:0,t:0},
    timer: {id:null, t:0},
    step: "core",
    ruleKey: "basics",
    ruleMode: "learn",
    rpSpeakText: "",
    rpWriteText: ""
  };

  // ---------- helpers ----------
  function rand(){ const x=Math.sin(state.seed++)*10000; return x - Math.floor(x); }
  function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(rand()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  function norm(s){
    return String(s||"").trim().toLowerCase()
      .replace(/[’‘]/g,"'")
      .replace(/\s+/g," ")
      .replace(/[.!?]/g,"");
  }
  function escapeHTML(str){
    return (str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function mdLite(str){
    let s = escapeHTML(str || "");
    s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return s;
  }
  function addScore(c,t){
    state.score.c += c; state.score.t += t;
    $("#scoreTxt").textContent = `${state.score.c} / ${state.score.t}`;
    const pct = state.score.t ? Math.round((state.score.c/state.score.t)*100) : 0;
    $("#progressPct").textContent = `${pct}%`;
    $("#progressBar").style.width = `${pct}%`;
  }

  // ---------- TTS ----------
  function speechSupported(){ return ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window); }
  function stopSpeech(){ if(speechSupported()) try{ speechSynthesis.cancel(); }catch(e){} }
  function loadVoices(){ if(!speechSupported()) return []; return speechSynthesis.getVoices()||[]; }
  function pickVoice(accent){
    const vs = loadVoices(); if(!vs.length) return null;
    const want = accent==="UK" ? ["en-gb","en_gb"] : ["en-us","en_us"];
    const fb = accent==="UK" ? ["en","en-ie","en-au","en-ca","en-us"] : ["en","en-ca","en-au","en-gb"];
    const by = (arr)=>vs.find(v=>arr.some(x=>(v.lang||"").toLowerCase().includes(x)));
    return by(want) || by(fb) || vs[0];
  }
  function speak(text, rate=1.0){
    if(!speechSupported()){ alert("TTS not supported here. Please read aloud."); return; }
    stopSpeech();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(state.accent); if(v) u.voice=v;
    u.rate=rate; u.pitch=1; u.volume=1;
    speechSynthesis.speak(u);
  }
  if(speechSupported()){ loadVoices(); window.speechSynthesis.onvoiceschanged=()=>loadVoices(); }

  // ---------- timer ----------
  function fmt(sec){
    const m=String(Math.floor(sec/60)).padStart(2,"0");
    const s=String(sec%60).padStart(2,"0");
    return `${m}:${s}`;
  }
  function stopTimer(){
    if(state.timer.id) clearInterval(state.timer.id);
    state.timer.id=null; state.timer.t=0;
    $("#timerTxt").textContent="00:00";
  }
  function startTimer(seconds){
    stopTimer();
    state.timer.t=seconds;
    $("#timerTxt").textContent=fmt(state.timer.t);
    state.timer.id=setInterval(()=>{
      state.timer.t -= 1;
      $("#timerTxt").textContent=fmt(Math.max(0,state.timer.t));
      if(state.timer.t<=0){ clearInterval(state.timer.id); state.timer.id=null; }
    }, 1000);
  }

  // ---------- toggles ----------
  function toggleFR(on){
    state.fr = on;
    $("#frToggle").classList.toggle("is-on", state.fr);
    $("#frStatus").textContent = state.fr ? "FR help: ON" : "FR help: OFF";
    $$(".vCard").forEach(c=>c.classList.toggle("is-fr", state.fr));
    $$(".exCard").forEach(c=>c.classList.toggle("is-fr", state.fr));
  }
  function setLevel(lv){
    state.level = lv;
    $("#level").value = lv;
    renderRules();
    renderStep(state.step);
    renderRoleplay();
  }

  // ---------- Vocabulary ----------
  const VOCAB_CATS = ["All","Core meanings","Movement","Recovery & completion","Relationships","Coping & survival","Fixing & changes","Form (separable)","Advanced"];

  const VOCAB = [
    // Core meanings
    {cat:"Core meanings", en:"get up", fr:"se lever", meaning:"rise from bed; stand up", form:"get up / get up + object (separable)", sep:true, ex:"I get up at 6:30 on weekdays."},
    {cat:"Core meanings", en:"get over", fr:"se remettre de / surmonter", meaning:"recover from (a problem/emotion)", form:"get over + object (inseparable)", sep:false, ex:"She got over the disappointment quickly."},
    {cat:"Core meanings", en:"get by", fr:"s’en sortir", meaning:"manage with difficulty; survive", form:"get by (no object) / get by on + noun", sep:false, ex:"They get by on a small budget."},
    {cat:"Core meanings", en:"get along (with)", fr:"bien s’entendre (avec)", meaning:"have a good relationship", form:"get along with + person", sep:false, ex:"I get along with my colleagues."},

    // Movement
    {cat:"Movement", en:"get in / get into", fr:"entrer / monter (dans)", meaning:"enter (a place/vehicle)", form:"get in (vehicle) / get into + noun", sep:false, ex:"Please get into the car."},
    {cat:"Movement", en:"get out / get out of", fr:"sortir / descendre (de)", meaning:"leave a place/vehicle", form:"get out (vehicle) / get out of + noun", sep:false, ex:"We got out of the taxi."},
    {cat:"Movement", en:"get on / get off", fr:"monter / descendre (transport)", meaning:"board / leave a bus/train", form:"get on/off + bus/train", sep:false, ex:"She got on the train at 8:10."},
    {cat:"Movement", en:"get back", fr:"revenir / récupérer", meaning:"return; also: recover something", form:"get back (home) / get back + object (separable)", sep:true, ex:"I will get back to you tomorrow."},

    // Recovery & completion
    {cat:"Recovery & completion", en:"get through", fr:"traverser / surmonter / finir", meaning:"survive a difficult time; finish a task", form:"get through + noun", sep:false, ex:"We got through the meeting without issues."},
    {cat:"Recovery & completion", en:"get over it", fr:"passer à autre chose", meaning:"move on emotionally", form:"get over + it (inseparable)", sep:false, ex:"It was hard, but he got over it."},

    // Relationships
    {cat:"Relationships", en:"get on (with)", fr:"s’entendre (avec)", meaning:"have a relationship (UK also = get along)", form:"get on with + person", sep:false, ex:"Do you get on with your manager?"},
    {cat:"Relationships", en:"get together", fr:"se réunir", meaning:"meet socially", form:"get together (no object)", sep:false, ex:"We got together for dinner."},

    // Coping & survival
    {cat:"Coping & survival", en:"get by (without)", fr:"faire sans", meaning:"manage without something", form:"get by without + noun", sep:false, ex:"I can get by without coffee."},
    {cat:"Coping & survival", en:"get ahead", fr:"réussir / avancer", meaning:"make progress; succeed", form:"get ahead (no object)", sep:false, ex:"She works hard to get ahead."},

    // Fixing & changes
    {cat:"Fixing & changes", en:"get rid of", fr:"se débarrasser de", meaning:"remove; throw away", form:"get rid of + noun", sep:false, ex:"We need to get rid of old files."},
    {cat:"Fixing & changes", en:"get back to (someone)", fr:"revenir vers (qqn)", meaning:"reply later; contact again", form:"get back to + person", sep:false, ex:"I will get back to you by Friday."},
    {cat:"Fixing & changes", en:"get down", fr:"déprimer / descendre", meaning:"feel sad; also: get down from a place", form:"get down (no object)", sep:false, ex:"Do not let the news get you down."},

    // Form (separable)
    {cat:"Form (separable)", en:"get up (the children)", fr:"réveiller / lever (les enfants)", meaning:"wake someone up / make someone stand", form:"get + object + up (separable)", sep:true, ex:"I got the children up at 7:00."},
    {cat:"Form (separable)", en:"get it back", fr:"le récupérer", meaning:"recover something", form:"get + it + back (pronoun in the middle)", sep:true, ex:"I lost my card, but I got it back."},

    // Advanced
    {cat:"Advanced", en:"get away with", fr:"s’en tirer (sans conséquence)", meaning:"do something wrong without punishment", form:"get away with + noun/verb-ing", sep:false, ex:"He got away with being late."},
    {cat:"Advanced", en:"get into (a habit)", fr:"prendre (une habitude)", meaning:"start doing regularly", form:"get into + noun", sep:false, ex:"I got into running during the summer."}
  ];

  // ---------- Rules (tabs + learn/build/see) ----------
  const RULE_TABS = [
    {key:"basics", icon:"🧠", label:"Basics", tag:"What is it?"},
    {key:"meaning", icon:"⚡", label:"Meaning shifts", tag:"up/over/by…"},
    {key:"form", icon:"🧩", label:"Form & placement", tag:"separable?"},
    {key:"mini", icon:"✅", label:"Quick check", tag:"3 questions"}
  ];

  function rulesContent(){
    return {
      basics: {
        title: "What are phrasal verbs?",
        learn: [
          "A phrasal verb = **verb + particle** (preposition/adverb) → new meaning.",
          "**GET** is very common and changes meaning quickly: get up / get over / get by / get along…",
          "In exams and real life, use them for **natural, fluent** English (without slang)."
        ],
        chips: [
          {note:"structure", f:"verb + particle → meaning changes"},
          {note:"example", f:"get + up → wake/stand"},
          {note:"example", f:"get + over → recover"},
          {note:"example", f:"get + by → manage"}
        ],
        diagram:
`Think of the particle as a “direction”:
UP = rise / increase / wake
OVER = cross / recover
BY = survive / manage
ALONG/ON = relationship / progress
THROUGH = finish / survive`,
        examples: [
          {en:"I get up at 6:30.", fr:"Je me lève à 6h30."},
          {en:"She got over the stress.", fr:"Elle s’est remise du stress."},
          {en:"They get by on a small budget.", fr:"Ils s’en sortent avec un petit budget."},
          {en:"We get along very well.", fr:"On s’entend très bien."}
        ],
        mistakes: [
          "Do not translate word-for-word. Learn **meaning + example**.",
          "Use **professional contexts** (work, travel, health, family).",
          "Practice **one category at a time**, then mix."
        ]
      },

      meaning: {
        title: "Meaning changes “in a blink” (GET map)",
        learn: [
          "Small particles create **big meaning changes**.",
          "Learn them in families (movement, recovery, coping, relationships).",
          "Always learn **one key example sentence** with each verb."
        ],
        chips: [
          {note:"wake/stand", f:"get up"},
          {note:"recover", f:"get over"},
          {note:"manage", f:"get by (on/without)"},
          {note:"relationship", f:"get along / get on"},
          {note:"finish/survive", f:"get through"},
          {note:"remove", f:"get rid of"}
        ],
        diagram:
`FAST MEANING GUIDE:
get up = rise / wake up
get over = recover from
get by = manage (with difficulty)
get along/on = have a good relationship
get through = finish / survive a hard time
get rid of = remove / throw away`,
        examples: [
          {en:"I get by without a car.", fr:"Je m’en sors sans voiture."},
          {en:"We got through the paperwork.", fr:"On a terminé la paperasse."},
          {en:"She gets along with her team.", fr:"Elle s’entend bien avec son équipe."},
          {en:"Please get rid of old documents.", fr:"Merci de vous débarrasser des anciens documents."}
        ],
        mistakes: [
          "Avoid repeating the same example. Use **different situations**.",
          "Do not confuse **get by** (manage) with **get back** (return/reply).",
          "Do not confuse **get over** (recover) with **get through** (finish/survive)."
        ]
      },

      form: {
        title: "Form: separable vs inseparable (object placement)",
        learn: [
          "Some phrasal verbs are **separable**: object can go in the middle.",
          "Rule: if the object is a **pronoun** (it/him/her/them), it must go **in the middle**.",
          "Other phrasal verbs are **inseparable**: object stays after the verb."
        ],
        chips: [
          {note:"separable", f:"get **it** back (NOT: get back it)"},
          {note:"separable", f:"get the children up / get up the children"},
          {note:"inseparable", f:"get over **the problem**"},
          {note:"inseparable", f:"get rid of **old files**"}
        ],
        diagram:
`SEPARABLE:
get + object + particle
✅ get it back
✅ get the children up / get up the children

INSEPARABLE:
get + particle + object
✅ get over the problem
✅ get rid of old files`,
        examples: [
          {en:"I lost my phone but I got it back.", fr:"J’ai perdu mon téléphone, mais je l’ai récupéré."},
          {en:"He got over the mistake and moved on.", fr:"Il a surmonté l’erreur et il est passé à autre chose."},
          {en:"We need to get rid of outdated policies.", fr:"Nous devons nous débarrasser des règles obsolètes."},
          {en:"I got the children up early today.", fr:"J’ai levé/réveillé les enfants tôt aujourd’hui."}
        ],
        mistakes: [
          "Pronoun rule is essential: ✅ get **it** back / ❌ get back it",
          "Do not invent patterns. Check if a verb is separable.",
          "If unsure, choose a safer option: use a normal verb (recover/remove) in formal writing."
        ]
      },

      mini: {
        title: "Quick check (before practice)",
        learn: [
          "Do these 3 questions quickly.",
          "If you get 2/3 or 3/3, move to the practice steps."
        ],
        chips: [
          {note:"goal", f:"Accuracy before speed"},
          {note:"tip", f:"Think: meaning → form → example"}
        ],
        diagram:
`Mini rule:
Meaning first.
Then placement (separable?).
Then one perfect sentence.`,
        examples: [],
        mistakes: [
          "If you miss one question, re-read the chip rules once."
        ]
      }
    };
  }

  // ---------- Exercises ----------
  const EX = {
    core: {
      title: "Step 1 — Core GET verbs (meaning first)",
      minutes: "15–20 min",
      mcq: [
        {stem:"Choose the meaning: “get over a problem”", opts:["recover from it","leave a vehicle","remove it"], ans:0, why:"Get over = recover from."},
        {stem:"Choose the meaning: “get by on a small salary”", opts:["manage/survive","wake up early","meet socially"], ans:0, why:"Get by = manage/survive."},
        {stem:"Choose the best verb: “We ____ very well as colleagues.”", opts:["get along","get by","get off"], ans:0, why:"Get along = have a good relationship."},
        {stem:"Choose the best verb: “I ____ at 6:30 every day.”", opts:["get up","get over","get through"], ans:0, why:"Get up = rise from bed."},
        {stem:"Choose the best verb: “Please ____ the bus at the next stop.”", opts:["get off","get along","get by"], ans:0, why:"Get off = leave transport."}
      ],
      fill: [
        {stem:"After the accident, he finally ____ it. (recover)", opts:["got over","got by"], ans:"got over", why:"Recover from = get over."},
        {stem:"They can ____ without help. (manage)", opts:["get by","get up"], ans:"get by", why:"Manage = get by."},
        {stem:"I usually ____ at 7:00. (rise)", opts:["get up","get over"], ans:"get up", why:"Rise = get up."},
        {stem:"Do you ____ with your neighbours? (relationship)", opts:["get along","get through"], ans:"get along", why:"Relationship = get along."}
      ],
      particle: [
        {q:"I need to ____ this stress. (recover)", base:"get", opts:["over","by","up"], ans:"over", why:"Get over = recover."},
        {q:"We can ____ on this budget. (manage)", base:"get", opts:["by","over","off"], ans:"by", why:"Get by = manage."},
        {q:"Please ____ the train at the next stop. (leave transport)", base:"get", opts:["off","up","over"], ans:"off", why:"Get off = leave transport."}
      ],
      speaking: [
        "Daily life: Tell me what time you get up on weekdays and weekends.",
        "Work: Explain how you get by when you have a busy week.",
        "Relationships: Say who you get along with and why (in one sentence)."
      ]
    },

    placement: {
      title: "Step 2 — Form & object placement (separable vs inseparable)",
      minutes: "15–20 min",
      mcq: [
        {stem:"Which sentence is correct?", opts:["I got back it.","I got it back.","I got over it back."], ans:1, why:"Pronoun must be in the middle: get it back."},
        {stem:"Which is inseparable?", opts:["get over a problem","get the children up","get it back"], ans:0, why:"Get over + object is inseparable."},
        {stem:"Choose the correct option:", opts:["We got rid the old files of.","We got rid of the old files.","We got the old files rid of."], ans:1, why:"Correct form: get rid of + noun."},
        {stem:"Pick the correct pronoun placement:", opts:["I got up them.","I got them up.","I got over them up."], ans:1, why:"Separable: get them up."}
      ],
      fill: [
        {stem:"I lost my badge, but I got ____ back. (pronoun)", opts:["it","back it"], ans:"it", why:"get it back (pronoun in the middle)."},
        {stem:"We need to get rid of ____ documents. (noun)", opts:["old","rid"], ans:"old", why:"get rid of + noun."},
        {stem:"He got ____ the disappointment. (recover)", opts:["over","up"], ans:"over", why:"get over + noun."},
        {stem:"I got the kids ____ early. (separable)", opts:["up","over"], ans:"up", why:"get + object + up."}
      ],
      particle: [
        {q:"I will get ____ to you tomorrow. (reply)", base:"get", opts:["back","by","up"], ans:"back", why:"Get back to someone = reply later."},
        {q:"We need to get rid ____ old policies.", base:"get", opts:["of","by","over"], ans:"of", why:"Get rid of = remove."},
        {q:"He got ____ the illness quickly.", base:"get", opts:["over","off","up"], ans:"over", why:"Get over = recover."}
      ],
      speaking: [
        "Give two examples with pronouns: get it back / get them up.",
        "Explain the rule: where does the pronoun go (separable verbs)?",
        "Use “get rid of” in a professional sentence (not slang)."
      ]
    },

    advanced: {
      title: "Step 3 — Advanced GET (professional and fluent)",
      minutes: "15–20 min",
      mcq: [
        {stem:"Choose the meaning: “get through the report”", opts:["finish it","avoid it","replace it"], ans:0, why:"Get through = finish."},
        {stem:"Choose the meaning: “get rid of outdated rules”", opts:["remove them","recover from them","meet them"], ans:0, why:"Get rid of = remove."},
        {stem:"Choose the meaning: “get away with being late”", opts:["avoid consequences","become late","finish late"], ans:0, why:"Get away with = avoid consequences."},
        {stem:"Choose the best: “I got into running last year.”", opts:["started a habit","stopped a habit","paid for a habit"], ans:0, why:"Get into = start doing regularly."}
      ],
      fill: [
        {stem:"We finally got ____ the paperwork. (finish)", opts:["through","by"], ans:"through", why:"Get through = finish."},
        {stem:"He got away ____ it. (no consequences)", opts:["with","over"], ans:"with", why:"Get away with = avoid consequences."},
        {stem:"I got ____ cooking during the winter. (start habit)", opts:["into","off"], ans:"into", why:"Get into = start a habit."},
        {stem:"Let’s get rid ____ unnecessary steps. (remove)", opts:["of","by"], ans:"of", why:"Get rid of = remove."}
      ],
      particle: [
        {q:"We need to ____ through this quickly. (finish)", base:"get", opts:["through","over","up"], ans:"through", why:"Finish = get through."},
        {q:"He got away ____ it. (avoid consequences)", base:"get", opts:["with","by","over"], ans:"with", why:"Get away with = avoid consequences."},
        {q:"I got ____ a new hobby. (start habit)", base:"get", opts:["into","off","over"], ans:"into", why:"Get into = start."}
      ],
      speaking: [
        "Work: explain how you got through a difficult week.",
        "Home: say what you want to get rid of and why.",
        "Habits: say what habit you got into recently."
      ]
    },

    mixed: {
      title: "Step 4 — Mixed review (exam speed)",
      minutes: "15–20 min",
      mcq: [
        {stem:"Meaning: “get by”", opts:["manage","remove","board"], ans:0, why:"Get by = manage."},
        {stem:"Meaning: “get rid of”", opts:["remove","recover","meet"], ans:0, why:"Get rid of = remove."},
        {stem:"Meaning: “get along”", opts:["relationship","finish","return"], ans:0, why:"Get along = relationship."},
        {stem:"Correct pronoun placement:", opts:["I got back it.","I got it back."], ans:1, why:"get it back."},
        {stem:"Best choice: “We ____ the project on time.”", opts:["got through","got up"], ans:0, why:"Get through = finish."}
      ],
      fill: [
        {stem:"I do not always get ____ with my neighbour. (relationship)", opts:["along","by"], ans:"along", why:"Get along = relationship."},
        {stem:"We can get ____ on this budget. (manage)", opts:["by","over"], ans:"by", why:"Get by = manage."},
        {stem:"He got ____ the disappointment. (recover)", opts:["over","off"], ans:"over", why:"Get over = recover."},
        {stem:"Please get rid ____ those duplicates. (remove)", opts:["of","by"], ans:"of", why:"Get rid of = remove."}
      ],
      particle: [
        {q:"I will get ____ to you by Friday. (reply)", base:"get", opts:["back","up","over"], ans:"back", why:"Get back to = reply."},
        {q:"They got ____ without help. (manage)", base:"get", opts:["by","off","into"], ans:"by", why:"Get by = manage."},
        {q:"We need to get ____ old files. (remove)", base:"get", opts:["rid of","over","up"], ans:"rid of", why:"Get rid of = remove."}
      ],
      speaking: [
        "In 30 seconds, use 3 phrasal verbs with GET correctly.",
        "Explain one separable rule with an example.",
        "Make one professional email sentence with “get back to you”."
      ]
    }
  };

  // ---------- Role-play scenarios (professional English) ----------
  const ROLEPLAY = [
    {
      id:"work-update",
      title:"Work — update + next steps",
      prompt:"You need to update a colleague. Explain what you got through, what you need to get rid of, and when you will get back to them.",
      tips:["get through","get rid of","get back to"],
      speak:{
        a2:`Hello. I wanted to give you an update.
We got through the main tasks today.
We need to get rid of duplicate files.
I will get back to you tomorrow with the final details. Thank you.`,
        b1:`Hello. I wanted to give you a quick update.
We got through the main tasks today, and the report is almost finished.
Next, we need to get rid of duplicate files to keep the folder clean.
I will get back to you tomorrow with the final version. Thank you.`,
        b2:`Hello. I am calling to provide a brief update.
We got through the main tasks today, and the report is now in its final review stage.
Our next step is to get rid of duplicate files to ensure the documentation is consistent.
I will get back to you tomorrow with the final version and a clear timeline. Thank you.`
      },
      write:{
        a2:`Subject: Update

Hello,

We got through the main tasks today.
We need to get rid of duplicate files.
I will get back to you tomorrow with the final details.

Best regards,`,
        b1:`Subject: Update and next steps

Hello,

Here is a quick update: we got through the main tasks today, and the report is almost finished.
As a next step, we need to get rid of duplicate files to keep the folder clean.
I will get back to you tomorrow with the final version.

Best regards,`,
        b2:`Subject: Update and next steps — confirmation to follow

Hello,

I am writing to provide a brief update. We got through the main tasks today, and the report is now in its final review stage.
Our next step is to get rid of duplicate files to ensure the documentation is consistent.
I will get back to you tomorrow with the final version and a short timeline.

Kind regards,`
      }
    },

    {
      id:"schedule",
      title:"Scheduling — delay + apology",
      prompt:"You must apologize for a delay. Explain how you will get through the remaining tasks and when you will get back with confirmation.",
      tips:["get through","get back to","get over (a setback)"],
      speak:{
        a2:`Hello. I am sorry for the delay.
We had a setback, but we will get through the remaining tasks today.
I will get back to you by the end of the day to confirm. Thank you.`,
        b1:`Hello. I would like to apologize for the delay.
We experienced a setback, but we are on track to get through the remaining tasks today.
I will get back to you by the end of the day with confirmation. Thank you.`,
        b2:`Hello. Please accept my apologies for the delay.
We experienced a setback, but we are working to get through the remaining tasks today.
I will get back to you by the end of the day with confirmation and updated timings. Thank you.`
      },
      write:{
        a2:`Subject: Apology for the delay

Hello,

I am sorry for the delay.
We will get through the remaining tasks today.
I will get back to you by the end of the day to confirm.

Best regards,`,
        b1:`Subject: Apology and updated plan

Hello,

Please accept my apologies for the delay. We experienced a setback, but we are working to get through the remaining tasks today.
I will get back to you by the end of the day with confirmation.

Best regards,`,
        b2:`Subject: Apology for the delay — updated plan

Hello,

Please accept my apologies for the delay. We experienced a setback; however, we are working to get through the remaining tasks today.
I will get back to you by the end of the day with confirmation and updated timings.

Kind regards,`
      }
    },

    {
      id:"personal-habit",
      title:"Daily life — habits and coping",
      prompt:"Explain how you get up, how you get by during a busy period, and how you got over a difficult situation.",
      tips:["get up","get by","get over"],
      speak:{
        a2:`I usually get up at 7:00.
When I am busy, I get by with a simple routine.
Last year I had a difficult period, but I got over it.`,
        b1:`I usually get up around 7:00. When I have a busy period, I get by with a simple routine and clear priorities.
I also had a difficult situation last year, but I got over it and learned from it.`,
        b2:`I usually get up around 7:00. During busy periods, I get by by keeping a simple routine and prioritizing essential tasks.
I had a difficult situation last year, but I got over it by focusing on solutions and maintaining good habits.`
      },
      write:{
        a2:`Short paragraph:

I usually get up at 7:00. When I am busy, I get by with a simple routine. Last year I had a difficult period, but I got over it.`,
        b1:`Short paragraph:

I usually get up around 7:00. During busy periods, I get by with a simple routine and clear priorities. Last year I faced a difficult situation, but I got over it and learned from it.`,
        b2:`Short paragraph:

I usually get up around 7:00. During busy periods, I get by by keeping a simple routine and prioritizing essential tasks. Last year I faced a difficult situation, but I got over it by focusing on solutions and maintaining good habits.`
      }
    }
  ];

  // ---------- rendering: vocab ----------
  function insertAtCursor(el, text){
    el.focus();
    const start = (el.selectionStart != null) ? el.selectionStart : el.value.length;
    const end = (el.selectionEnd != null) ? el.selectionEnd : el.value.length;
    const v=el.value;
    el.value = v.slice(0,start) + text + v.slice(end);
    const pos=start+text.length;
    el.selectionStart = el.selectionEnd = pos;
  }

  function renderVocab(){
    const cat = $("#vCat").value;
    const q = norm($("#vSearch").value);
    const list = VOCAB.filter(v=>{
      const okCat = (cat==="All") || (v.cat===cat);
      const hay = `${v.en} ${v.meaning} ${v.form} ${v.fr} ${v.cat}`.toLowerCase();
      const okQ = !q || hay.includes(q);
      return okCat && okQ;
    });

    $("#vCount").textContent = `${list.length} item(s)`;
    const grid = $("#vGrid");
    grid.innerHTML = list.map(v=>{
      const sep = v.sep ? "Separable" : "Inseparable";
      return `
        <div class="vCard ${state.fr?'is-fr':''}">
          <div class="vTop">
            <div>
              <div class="vEN">${mdLite(`**${v.en}**`)} <span class="badge" style="margin-left:8px;">${sep}</span></div>
              <div class="vMeta">${escapeHTML(v.cat)} • ${escapeHTML(v.form)}</div>
            </div>
            <div class="row noPrint" style="justify-content:flex-end;">
              <button type="button" class="btn btn--tiny btn--ghost" data-say="${encodeURIComponent(v.ex)}">▶</button>
              <button type="button" class="btn btn--tiny" data-use="${encodeURIComponent(v.en)}">Use</button>
            </div>
          </div>
          <div class="vDef"><strong>Meaning:</strong> ${escapeHTML(v.meaning)}</div>
          <div class="vEx"><strong>Example:</strong> ${escapeHTML(v.ex)}</div>
          <div class="vFR">🇫🇷 <strong>FR:</strong> ${escapeHTML(v.fr)}</div>
        </div>
      `;
    }).join("");

    grid.onclick = (e)=>{
      const say = e.target.closest("button[data-say]");
      if(say){ speak(decodeURIComponent(say.dataset.say)); return; }
      const use = e.target.closest("button[data-use]");
      if(use){
        insertAtCursor($("#notes"), decodeURIComponent(use.dataset.use)+" ");
        $("#notesFb").className="fb good";
        $("#notesFb").textContent="✅ Inserted into your notes.";
      }
    };
  }

  // ---------- rendering: MCQ / fill / particle ----------
  function renderMCQ(container, items){
    container.innerHTML="";
    const answered=new Set();
    items.forEach((q,qi)=>{
      const el=document.createElement("div"); el.className="q";
      el.innerHTML=`<div class="qStem">${escapeHTML(q.stem)}</div><div class="opt"></div><div class="explain" hidden></div>`;
      const opt=$(".opt",el), exp=$(".explain",el);
      q.opts.forEach((lab,oi)=>{
        const b=document.createElement("button"); b.type="button"; b.className="choice"; b.textContent=lab;
        b.onclick=()=>{
          if(answered.has(qi)) return;
          answered.add(qi);
          addScore(0,1);
          const ok=(oi===q.ans);
          if(ok){ addScore(1,0); b.classList.add("is-correct"); }
          else{ b.classList.add("is-wrong"); $$(".choice",el)[q.ans].classList.add("is-correct"); }
          exp.hidden=false; exp.textContent=(ok?"✅ ":"❌ ")+q.why;
        };
        opt.appendChild(b);
      });
      container.appendChild(el);
    });
  }

  function renderFill(container, items){
    container.innerHTML = items.map((item, idx)=>{
      const opts = item.opts.map(x=>`<option value="${escapeHTML(x)}">${escapeHTML(x)}</option>`).join("");
      const id = `fill_${state.step}_${idx}`;
      return `
        <div class="panel">
          <div class="fillRow">
            <div class="muted">${escapeHTML(item.stem)}</div>
            <select class="select inpSmall" data-fill="${id}">
              <option value="">Choose…</option>
              ${opts}
            </select>
          </div>
          <div class="fb" data-fb="${id}" aria-live="polite">Tip: choose meaning first, then form.</div>
        </div>
      `;
    }).join("");

    $$('select[data-fill]', container).forEach(sel=>{
      sel.onchange=()=>{
        const parts=sel.dataset.fill.split("_");
        const idx=Number(parts[parts.length-1]);
        const item = items[idx];
        const fb = container.querySelector(`[data-fb="${sel.dataset.fill}"]`);
        addScore(0,1);
        const ok = sel.value === item.ans;
        sel.classList.remove("good","bad");
        if(ok){
          addScore(1,0);
          sel.classList.add("good");
          fb.className="fb good";
          fb.textContent="✅ Correct. " + item.why;
        }else{
          sel.classList.add("bad");
          fb.className="fb bad";
          fb.textContent="❌ Not quite. Hint: " + item.why;
        }
      };
    });
  }

  function renderParticle(container, items){
    container.innerHTML="";
    const done=new Set();
    items.forEach((it,i)=>{
      const el=document.createElement("div"); el.className="q";
      el.innerHTML=`
        <div class="qStem">${escapeHTML(it.q)}</div>
        <div class="opt"></div>
        <div class="explain" hidden></div>
      `;
      const opt=$(".opt",el), exp=$(".explain",el);
      it.opts.forEach(p=>{
        const b=document.createElement("button");
        b.type="button"; b.className="choice";
        b.textContent = `${it.base} ${p}`;
        b.onclick=()=>{
          if(done.has(i)) return;
          done.add(i);
          addScore(0,1);
          const ok = p === it.ans;
          if(ok){ addScore(1,0); b.classList.add("is-correct"); }
          else{
            b.classList.add("is-wrong");
            const right = $$("button.choice", opt).find(x=>x.textContent === `${it.base} ${it.ans}`);
            if(right) right.classList.add("is-correct");
          }
          exp.hidden=false;
          exp.textContent = (ok?"✅ ":"❌ ") + it.why;
        };
        opt.appendChild(b);
      });
      container.appendChild(el);
    });
  }

  function renderSpeakingPrompts(list){
    const items = shuffle(list).slice(0,3);
    $("#sPrompts").textContent = items.map(x=>`• ${x}`).join("\n");
  }

  // ---------- rules renderer (tabs + learn/build/see) ----------
  function renderRules(){
    const tabs = RULE_TABS;
    const nav = $("#rulesNav");

    if(nav){
      nav.innerHTML = tabs.map(t=>{
        const on = (t.key===state.ruleKey) ? " is-on" : "";
        return `<button type="button" class="ruleTab${on}" data-rule="${t.key}">
          <span aria-hidden="true">${t.icon}</span>
          <span>${t.label}</span>
          <span class="tag">${t.tag}</span>
        </button>`;
      }).join("");

      nav.onclick = (e)=>{
        const b = e.target.closest("button[data-rule]");
        if(!b) return;
        state.ruleKey = b.dataset.rule;
        state.ruleMode = "learn";
        renderRules();
      };
    }

    const C = rulesContent();
    const c = C[state.ruleKey];

    const modes = [
      {k:"learn", label:"Learn"},
      {k:"build", label:"Build"},
      {k:"see", label:"See examples"}
    ];

    const modeHTML = `
      <div class="modeSwitch noPrint">
        ${modes.map(m=>{
          const on = (state.ruleMode===m.k) ? " is-on" : "";
          return `<button type="button" class="modeBtn${on}" data-mode="${m.k}">${m.label}</button>`;
        }).join("")}
      </div>
    `;

    const chipsHTML = (c.chips||[]).map(x=>
      `<span class="chip"><b>${escapeHTML(x.note)}:</b> ${mdLite(x.f)}</span>`
    ).join("");

    const examplesHTML = (c.examples||[]).map(ex=>`
      <div class="exCard ${state.fr ? "is-fr":""}">
        <div class="exEN">${mdLite(ex.en)}</div>
        <div class="exFR">🇫🇷 ${mdLite(ex.fr)}</div>
      </div>
    `).join("");

    const mistakesHTML = (c.mistakes||[]).map(x=>`<li>${mdLite(x)}</li>`).join("");

    let mainBlock = "";
    if(state.ruleMode==="learn"){
      mainBlock = `
        <div class="model">${c.learn.map(x=>`• ${mdLite(x)}`).join("<br>")}</div>
        <div class="chipRow">${chipsHTML}</div>
        <div class="diagram">${mdLite(c.diagram)}</div>
      `;
    }else if(state.ruleMode==="build"){
      mainBlock = `
        <div class="chipRow">${chipsHTML}</div>
        <div class="diagram">${mdLite(c.diagram)}</div>
        <div class="muted small" style="margin-top:10px;"><strong>Teacher move:</strong> ask the learner to build 3 sentences using 3 different chips.</div>
      `;
    }else{
      mainBlock = `
        <div class="muted small"><strong>Varied examples (professional + daily life)</strong></div>
        <div class="exGrid">${examplesHTML || `<div class="muted">No examples in this tab.</div>`}</div>
      `;
    }

    $("#rulesBox").innerHTML = `
      <div class="panel panel--soft">
        <div class="panelTitle">${escapeHTML(c.title)} <span class="badge" style="margin-left:8px;">Mode: ${escapeHTML(state.ruleMode)}</span></div>
        ${modeHTML}

        <div class="ruleHero">
          <div>
            ${mainBlock}

            <div class="row noPrint" style="margin-top:12px;">
              <button type="button" class="btn btn--tiny" id="goCore">Go to Step 1</button>
              <button type="button" class="btn btn--tiny btn--ghost" id="listenRule">▶ Listen key examples</button>
            </div>
          </div>

          <div class="callout">
            <h4>Key reminders</h4>
            <ul>${mistakesHTML}</ul>
            <div class="muted small" style="margin-top:10px;">Write one “perfect sentence” per verb in the Notes box.</div>
          </div>
        </div>
      </div>
    `;

    // mode switch
    $("#rulesBox").querySelectorAll("button[data-mode]").forEach(b=>{
      b.onclick = ()=>{ state.ruleMode = b.dataset.mode; renderRules(); };
    });

    // buttons
    const goCore = $("#goCore");
    if(goCore) goCore.onclick = ()=>{ setStep("core"); location.hash="#practice"; };

    const listenRule = $("#listenRule");
    if(listenRule){
      const sayText = (c.examples||[]).map(x=>x.en).join(" ");
      listenRule.onclick = ()=> speak(sayText || "Phrasal verbs with get.", 1.0);
    }
  }

  // ---------- Step renderer ----------
  function setStep(step){
    state.step = step;
    $$(".stepBtn").forEach(b=>b.classList.toggle("is-on", b.dataset.step===step));
    renderStep(step);
  }

  function renderStep(step){
    const isRole = step === "roleplay";
    $("#practiceMain").hidden = isRole;
    $("#roleplayWrap").hidden = !isRole;

    if(isRole){
      $("#practiceTitle").textContent = "Step 5 — Role-play (speaking + writing)";
      $("#practiceTime").textContent = "15–20 min";
      renderRoleplay();
      return;
    }

    const ex = EX[step];
    $("#practiceTitle").textContent = ex.title;
    $("#practiceTime").textContent = ex.minutes;

    renderMCQ($("#mcqBox"), ex.mcq);
    renderFill($("#fillBox"), ex.fill);
    renderParticle($("#particleBox"), ex.particle);
    renderSpeakingPrompts(ex.speaking);

    // suggest vocab category
    if(step==="core") $("#vCat").value = "Core meanings";
    if(step==="placement") $("#vCat").value = "Form (separable)";
    if(step==="advanced") $("#vCat").value = "Advanced";
    if(step==="mixed") $("#vCat").value = "All";
    renderVocab();
  }

  // ---------- Roleplay renderer ----------
  function renderRoleplay(){
    const sel = $("#rpScenario");
    if(!sel) return;

    if(!sel.dataset.ready){
      sel.innerHTML = ROLEPLAY.map(r=>`<option value="${r.id}">${escapeHTML(r.title)}</option>`).join("");
      sel.dataset.ready="1";
    }

    const sc = ROLEPLAY.find(x=>x.id===sel.value) || ROLEPLAY[0];
    $("#rpPrompt").textContent = sc.prompt;
    $("#rpTips").textContent = sc.tips.map(x=>`• ${x}`).join("\n");

    const lv = state.level;
    state.rpSpeakText = sc.speak[lv] || sc.speak.b1;
    state.rpWriteText = sc.write[lv] || sc.write.b1;

    $("#rpSpeakModel").textContent = state.rpSpeakText;
    $("#rpWriteModel").textContent = state.rpWriteText;

    const speakBtn = $("#rpSpeakListen");
    const writeBtn = $("#rpWriteListen");
    if(speakBtn) speakBtn.onclick = ()=> speak(state.rpSpeakText, 1.0);
    if(writeBtn) writeBtn.onclick = ()=> speak(state.rpWriteText, 1.0);

    // tap order structure
    const steps = [
      "Greeting + context (why you are contacting).",
      "Key information + one GET verb (what happened / status).",
      "Clarify next step + second GET verb (action).",
      "Timing + “get back to you” (commitment).",
      "Polite closing."
    ];
    const expected = steps.slice();
    const shuffled = shuffle(expected);
    $("#rpProg").textContent = `0/${expected.length}`;
    const fb=$("#rpFb");
    fb.className="fb";
    fb.textContent = "Tap the steps in the best order.";

    const box=$("#rpOrder");
    box.innerHTML = "";
    let picked=[];
    shuffled.forEach(stepTxt=>{
      const b=document.createElement("button");
      b.type="button"; b.className="tapItem"; b.textContent=stepTxt;
      b.onclick=()=>{
        if(b.classList.contains("is-done")) return;
        const exp = expected[picked.length];
        addScore(0,1);
        if(stepTxt===exp){
          addScore(1,0);
          b.classList.add("is-done");
          picked.push(stepTxt);
          $("#rpProg").textContent = `${picked.length}/${expected.length}`;
          fb.className="fb good";
          fb.textContent = picked.length===expected.length ? "✅ Great. Now write your version below." : "✅ Good.";
        }else{
          fb.className="fb warn";
          fb.textContent = "⚠️ Think: greet → status → next step → timing → close.";
        }
      };
      box.appendChild(b);
    });
  }

  // ---------- wiring ----------
  function wire(){
    $("#accentUS").onclick=()=>{ state.accent="US"; $("#accentUS").setAttribute("aria-pressed","true"); $("#accentUK").setAttribute("aria-pressed","false"); };
    $("#accentUK").onclick=()=>{ state.accent="UK"; $("#accentUK").setAttribute("aria-pressed","true"); $("#accentUS").setAttribute("aria-pressed","false"); };

    $("#level").onchange=()=> setLevel($("#level").value);
    $("#frToggle").onclick=()=> { toggleFR(!state.fr); renderVocab(); renderRules(); };

    $("#printPage").onclick=()=>window.print();
    $("#resetAll").onclick=()=>location.reload();
    $("#listenNotes").onclick=()=> speak($("#notes").value || "Add your key sentences.", 1.0);

    $$(".stepBtn").forEach(b=> b.onclick=()=> setStep(b.dataset.step));

    $("#vCat").onchange=renderVocab;
    $("#vSearch").oninput=renderVocab;
    $("#vClear").onclick=()=>{ $("#vSearch").value=""; renderVocab(); };

    $("#rpScenario").onchange=renderRoleplay;

    $("#start3").onclick=()=>startTimer(180);
    $("#start5").onclick=()=>startTimer(300);
    $("#stopTimer").onclick=stopTimer;
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    state.level = $("#level").value;
    toggleFR(false);

    $("#vCat").innerHTML = VOCAB_CATS.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
    renderVocab();
    renderRules();
    setStep("core");
    renderRoleplay();
    wire();
  });

})();