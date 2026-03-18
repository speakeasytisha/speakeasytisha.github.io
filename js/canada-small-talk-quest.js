/* SpeakEasyTisha — Canada Small Talk Quest
   Build: 20260318-094612
*/
(() => {
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  const JS_STATUS = $("#jsStatus");
  const DEBUG = $("#debugBox");
  function logDebug(msg) {
    try { if(!DEBUG) return; DEBUG.classList.remove("hidden"); DEBUG.textContent += `\n${msg}`; } catch(e) {}
  }
  window.addEventListener("error", (e) => {
    if(JS_STATUS) JS_STATUS.textContent = "JS: ❌ error";
    logDebug(`[Error] ${e.message} @ ${e.filename}:${e.lineno}`);
  });
  window.addEventListener("unhandledrejection", (e) => {
    if(JS_STATUS) JS_STATUS.textContent = "JS: ❌ promise";
    logDebug(`[Promise] ${String(e.reason)}`);
  });

  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
      .replaceAll('"',"&quot;").replaceAll("'","&#039;");
  }
  function normalize(s) {
    return String(s ?? "").replace(/[’']/g,"'").replace(/\s+/g," ").trim().toLowerCase();
  }
  function shuffle(arr) {
    const a=(arr||[]).slice();
    for(let i=a.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function attachTap(el, handler) {
    if(!el) return;
    const h = (e) => { try { handler(e); } catch(err) { console.error(err); } };
    el.addEventListener("click", h);
    el.addEventListener("pointerup", h);
    el.addEventListener("touchend", h, {passive:true});
  }
  function safeOn(sel, evt, handler) {
    const el=$(sel);
    if(!el) return;
    el.addEventListener(evt, handler);
  }

  // Speech
  const Speech = {
    mode:"en-US",
    rate:0.97,
    getVoices(){ try{ return window.speechSynthesis?.getVoices?.() || []; }catch(e){ return []; } },
    pickVoice(){
      const v=this.getVoices();
      const lang=this.mode.toLowerCase();
      let best=v.find(x => (x.lang||"").toLowerCase()===lang);
      if(!best) best=v.find(x => (x.lang||"").toLowerCase().startsWith(lang));
      if(!best) best=v.find(x => (x.lang||"").toLowerCase().startsWith("en"));
      return best||null;
    },
    stop(){ try{ window.speechSynthesis?.cancel(); }catch(e){} },
    pause(){ try{ window.speechSynthesis?.pause(); }catch(e){} },
    resume(){ try{ window.speechSynthesis?.resume(); }catch(e){} },
    say(text){
      if(!window.speechSynthesis) return;
      try{ window.speechSynthesis.cancel(); }catch(e){}
      const u=new SpeechSynthesisUtterance(String(text||""));
      const voice=this.pickVoice(); if(voice) u.voice=voice;
      u.lang=this.mode; u.rate=this.rate; u.pitch=1.0;
      window.speechSynthesis.speak(u);
    }
  };
  if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged = () => Speech.getVoices();

  const Auto = {
    key:"cstq_autoAudio",
    enabled:false,
    load(){ this.enabled=(localStorage.getItem(this.key)==="1"); },
    save(){ localStorage.setItem(this.key, this.enabled ? "1":"0"); }
  };

  function setVoice(mode) {
    Speech.mode=mode;
    const us=$("#voiceUS"), uk=$("#voiceUK");
    if(!us||!uk) return;
    if(mode==="en-US") {
      us.classList.add("is-on"); uk.classList.remove("is-on");
      us.setAttribute("aria-pressed","true"); uk.setAttribute("aria-pressed","false");
    } else {
      uk.classList.add("is-on"); us.classList.remove("is-on");
      uk.setAttribute("aria-pressed","true"); us.setAttribute("aria-pressed","false");
    }
  }
  function syncAuto() {
    const off=$("#autoOff"), on=$("#autoOn");
    if(!off||!on) return;
    if(Auto.enabled) {
      on.classList.add("is-on"); off.classList.remove("is-on");
      on.setAttribute("aria-pressed","true"); off.setAttribute("aria-pressed","false");
    } else {
      off.classList.add("is-on"); on.classList.remove("is-on");
      off.setAttribute("aria-pressed","true"); on.setAttribute("aria-pressed","false");
    }
  }
  function setAuto(v) { Auto.enabled=!!v; Auto.save(); syncAuto(); }

  safeOn("#voiceUS","click", () => setVoice("en-US"));
  safeOn("#voiceUK","click", () => setVoice("en-GB"));
  safeOn("#autoOff","click", () => setAuto(false));
  safeOn("#autoOn","click", () => setAuto(true));
  safeOn("#btnPause","click", () => Speech.pause());
  safeOn("#btnResume","click", () => Speech.resume());
  safeOn("#btnStop","click", () => Speech.stop());
  safeOn("#btnStart","click", () => $("#sec1")?.scrollIntoView({behavior:"smooth"}));
  safeOn("#btnHow","click", () => {
    alert("How to use:\n\n• Auto audio OFF by default.\n• Click 🔊 when you want audio.\n• Practice: read → choose → build → speak.\n\nTip: Ask him to answer with 1–2 simple sentences.");
  });

  // Score
  const Score = {
    now:0, max:0, awarded:new Set(),
    setMax(n){ this.max=n; updateScore(); updateProgress(); },
    award(key, pts=1){ if(this.awarded.has(key)) return; this.awarded.add(key); this.now += pts; updateScore(); updateProgress(); },
    reset(){ this.now=0; this.awarded.clear(); updateScore(); updateProgress(); }
  };
  function updateScore() {
    $("#scoreNow") && ($("#scoreNow").textContent=String(Score.now));
    $("#scoreMax") && ($("#scoreMax").textContent=String(Score.max));
  }
  function updateProgress() {
    const bar=$("#progressBar"); if(!bar) return;
    const pct=Score.max ? Math.round((Score.now/Score.max)*100) : 0;
    bar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  }

  // ---------- Data ----------
  const TOOL_TOPICS = [
    {key:"intro", label:"👋 Introductions (name, nationality, where you live)"},
    {key:"work", label:"💼 Work (job, routine)"},
    {key:"trip", label:"🧳 Trip (plans, length, activities)"},
    {key:"weather", label:"🌦️ Weather (easy chat)"},
    {key:"polite", label:"🙏 Polite questions (no slang)"},
  ];

  const TOOL_PHRASES = [
    // intro
    {topic:"intro", icon:"👋", en:"Hi, I’m Alex. Nice to meet you.", fr:"Salut, je suis Alex. Ravi(e) de vous rencontrer.", note:"friendly + polite"},
    {topic:"intro", icon:"🪪", en:"I’m French. I live in Nantes.", fr:"Je suis français(e). J’habite à Nantes.", note:"nationality + city"},
    {topic:"intro", icon:"🗺️", en:"I’m from France, in the west.", fr:"Je viens de France, à l’ouest.", note:"from + region"},
    {topic:"intro", icon:"❓", en:"And you? Where are you from?", fr:"Et vous ? Vous venez d’où ?", note:"simple question"},
    {topic:"intro", icon:"😊", en:"It’s my first time in Canada.", fr:"C’est ma première fois au Canada.", note:"simple + natural"},
    // work
    {topic:"work", icon:"💼", en:"I work in administration.", fr:"Je travaille dans l’administration.", note:"present simple"},
    {topic:"work", icon:"🏢", en:"I work for a company in France.", fr:"Je travaille pour une entreprise en France.", note:"for + company"},
    {topic:"work", icon:"⏰", en:"I usually start work at 9 am.", fr:"Je commence généralement à 9h.", note:"usually + time"},
    {topic:"work", icon:"🧩", en:"What do you do for work?", fr:"Vous faites quoi comme travail ?", note:"polite small talk"},
    {topic:"work", icon:"✅", en:"I like my job. It’s interesting.", fr:"J’aime mon travail. C’est intéressant.", note:"simple opinion"},
    // trip
    {topic:"trip", icon:"🧳", en:"We are going to visit Montréal and Quebec City.", fr:"Nous allons visiter Montréal et Québec.", note:"going to"},
    {topic:"trip", icon:"📅", en:"We are staying for one week.", fr:"Nous restons une semaine.", note:"duration"},
    {topic:"trip", icon:"🏔️", en:"I’d like to see the mountains.", fr:"J’aimerais voir les montagnes.", note:"I’d like to"},
    {topic:"trip", icon:"🍽️", en:"We want to try local food.", fr:"Nous voulons goûter la cuisine locale.", note:"want to"},
    {topic:"trip", icon:"❓", en:"What places do you recommend?", fr:"Quels endroits recommandez-vous ?", note:"polite question"},
    // weather
    {topic:"weather", icon:"🌤️", en:"The weather is lovely today.", fr:"Il fait très beau aujourd’hui.", note:"common small talk"},
    {topic:"weather", icon:"🧥", en:"It’s a bit cool today.", fr:"Il fait un peu frais aujourd’hui.", note:"simple"},
    {topic:"weather", icon:"☔", en:"It looks like rain.", fr:"On dirait qu’il va pleuvoir.", note:"easy"},
    {topic:"weather", icon:"❄️", en:"Is it usually cold here in winter?", fr:"Est-ce qu’il fait froid ici en hiver ?", note:"question"},
    {topic:"weather", icon:"🌦️", en:"What is the forecast for tomorrow?", fr:"Quelle est la météo pour demain ?", note:"forecast"},
    // polite
    {topic:"polite", icon:"🙏", en:"Could you help me, please?", fr:"Pouvez-vous m’aider, s’il vous plaît ?", note:"polite request"},
    {topic:"polite", icon:"🔁", en:"Could you repeat, please?", fr:"Pouvez-vous répéter, s’il vous plaît ?", note:"clarification"},
    {topic:"polite", icon:"🐢", en:"More slowly, please.", fr:"Plus lentement, s’il vous plaît.", note:"speed"},
    {topic:"polite", icon:"🧾", en:"Could I have the bill, please?", fr:"Je peux avoir l’addition, s’il vous plaît ?", note:"restaurant"},
    {topic:"polite", icon:"🗺️", en:"Could you recommend a nice place to visit?", fr:"Pouvez-vous recommander un endroit à visiter ?", note:"polite question"},
  ];

  const TOOL_PRACTICE_BANK = {
    intro: [
      {key:"tp1", prompt:"Choose the best answer: “Where are you from?”", choices:["I’m from France.","I from France.","I am from the France."], answer:0, hint:"Use: I’m from + country."},
      {key:"tp2", prompt:"Choose the best question:", choices:["Where are you from?","Where you are from?","From where you are?"], answer:0, hint:"Question order: Where + are + you…"},
    ],
    work: [
      {key:"tp3", prompt:"Choose the correct sentence:", choices:["I work in administration.","I working in administration.","I works in administration."], answer:0, hint:"I + base verb (present simple)."},
      {key:"tp4", prompt:"Choose the best question:", choices:["What do you do for work?","What you do for work?","What do you for work?"], answer:0, hint:"Do-support question."},
    ],
    trip: [
      {key:"tp5", prompt:"Choose the correct plan:", choices:["We are going to visit Montréal.","We going to visit Montréal.","We are visit Montréal."], answer:0, hint:"am/is/are going to + verb."},
      {key:"tp6", prompt:"Choose the best sentence:", choices:["We are staying for one week.","We stay for one week now.","We staying for one week."], answer:0, hint:"Present continuous needs am/is/are."},
    ],
    weather: [
      {key:"tp7", prompt:"Choose the best small talk line:", choices:["The weather is lovely today.","Weather lovely today.","It lovely weather today."], answer:0, hint:"Use: The weather is…"},
      {key:"tp8", prompt:"Choose the best question:", choices:["What is the forecast for tomorrow?","What forecast tomorrow?","Forecast is what tomorrow?"], answer:0, hint:"What is the…"},
    ],
    polite: [
      {key:"tp9", prompt:"Choose the most polite sentence:", choices:["Could you help me, please?","Help me.","You help me now."], answer:0, hint:"Could you… please?"},
      {key:"tp10", prompt:"Choose the best clarification:", choices:["Could you repeat, please?","Repeat again.","You repeat now."], answer:0, hint:"Polite request."},
    ]
  };

  const VOCAB_SETS = [
    {key:"countries", label:"🌍 Countries & nationalities"},
    {key:"jobs", label:"💼 Jobs"},
    {key:"weather", label:"🌦️ Weather words"},
    {key:"travel", label:"🧳 Travel words"},
  ];

  const VOCAB = [
    // countries
    {set:"countries", icon:"🇫🇷", word:"French", fr:"français(e)", def:"from France", ex:"I’m French."},
    {set:"countries", icon:"🇺🇸", word:"American", fr:"américain(e)", def:"from the USA", ex:"I’m American."},
    {set:"countries", icon:"🇨🇦", word:"Canadian", fr:"canadien(ne)", def:"from Canada", ex:"He is Canadian."},
    {set:"countries", icon:"🇬🇧", word:"British", fr:"britannique", def:"from the UK", ex:"She is British."},
    {set:"countries", icon:"🗺️", word:"nationality", fr:"nationalité", def:"country identity", ex:"What is your nationality?"},
    {set:"countries", icon:"📍", word:"to be from", fr:"venir de", def:"origin", ex:"I’m from France."},
    // jobs
    {set:"jobs", icon:"🧑‍💼", word:"administrator", fr:"agent administratif / admin", def:"office job", ex:"I’m an administrator."},
    {set:"jobs", icon:"🧑‍🏫", word:"teacher", fr:"professeur", def:"teaches students", ex:"She is a teacher."},
    {set:"jobs", icon:"🧑‍🍳", word:"cook", fr:"cuisinier(ère)", def:"prepares food", ex:"He is a cook."},
    {set:"jobs", icon:"🧑‍🔧", word:"technician", fr:"technicien", def:"fixes/maintains", ex:"He is a technician."},
    {set:"jobs", icon:"🏢", word:"company", fr:"entreprise", def:"business", ex:"I work for a company."},
    {set:"jobs", icon:"⏰", word:"usually", fr:"généralement", def:"most of the time", ex:"I usually start at 9."},
    // weather
    {set:"weather", icon:"☀️", word:"sunny", fr:"ensoleillé", def:"with sun", ex:"It’s sunny today."},
    {set:"weather", icon:"☁️", word:"cloudy", fr:"nuageux", def:"with clouds", ex:"It’s cloudy today."},
    {set:"weather", icon:"🌧️", word:"rainy", fr:"pluvieux", def:"with rain", ex:"It’s rainy today."},
    {set:"weather", icon:"🌬️", word:"windy", fr:"venteux", def:"with wind", ex:"It’s windy today."},
    {set:"weather", icon:"🧊", word:"cold", fr:"froid", def:"low temperature", ex:"It’s cold today."},
    {set:"weather", icon:"🌡️", word:"forecast", fr:"prévisions météo", def:"weather prediction", ex:"What is the forecast?"},
    // travel
    {set:"travel", icon:"🧳", word:"trip", fr:"voyage", def:"travel journey", ex:"My trip is next summer."},
    {set:"travel", icon:"🏨", word:"hotel", fr:"hôtel", def:"place to stay", ex:"We are staying at a hotel."},
    {set:"travel", icon:"📅", word:"reservation", fr:"réservation", def:"booking", ex:"I have a reservation."},
    {set:"travel", icon:"🚇", word:"metro", fr:"métro", def:"underground train", ex:"Take the metro downtown."},
    {set:"travel", icon:"🎫", word:"ticket", fr:"billet", def:"travel pass", ex:"A ticket, please."},
    {set:"travel", icon:"📍", word:"downtown", fr:"centre-ville", def:"city center", ex:"We are staying downtown."},
  ];

  const GRAMMAR_LINES = [
    {ico:"🧠", text:"BE (identity): I am… / You are… / He is… / She is… / We are… / They are…"},
    {ico:"✅", text:"BE affirmative: I am French. / She is Canadian. / We are in Montréal."},
    {ico:"❌", text:"BE negative: I’m not British. / He isn’t tired. / We aren’t late."},
    {ico:"❓", text:"BE question: Are you American? / Is he Canadian? / Where are you from?"},
    {ico:"🧩", text:"Present Simple (routine): I work in administration. / I usually start at 9."},
    {ico:"✅", text:"Present simple affirmative: I/you/we/they work. He/she/it works."},
    {ico:"❌", text:"Present simple negative: I don’t work… / He doesn’t work…"},
    {ico:"❓", text:"Present simple question: Do you work…? / Does she work…?"},
    {ico:"🗓️", text:"Trip plan (simple): We are going to visit Canada next summer."},
    {ico:"🙏", text:"Polite small talk: Could you…? / Could I…? / I’d like to…"}
  ];
  const GRAMMAR_SUMMARY = "Use BE for identity (I am French). Use present simple for work and routines (I work… I usually…). Use Do/Does for questions. Use polite requests: Could you…? Could I…?";

  const GRAM_MCQ = [
    {key:"g1", prompt:"Choose the correct sentence:", choices:["I am French.","I are French.","I is French."], answer:0, hint:"I → am"},
    {key:"g2", prompt:"Choose the correct question:", choices:["Are you from France?","Is you from France?","Do you are from France?"], answer:0, hint:"BE question: Are you…?"},
    {key:"g3", prompt:"Choose the correct sentence:", choices:["I work in administration.","I works in administration.","I working in administration."], answer:0, hint:"I + base verb"},
    {key:"g4", prompt:"Choose the correct question:", choices:["What do you do for work?","What you do for work?","What does you do for work?"], answer:0, hint:"Do-support: do you…"},
  ];

  const GRAM_FILL = [
    {key:"gf1", prompt:"Choose the correct form:", sentence:"He ___ Canadian.", options:["is","are","am"], answer:"is", hint:"He/she/it → is"},
    {key:"gf2", prompt:"Choose the correct negative:", sentence:"I ___ British. (not)", options:["am not","isn't","aren't"], answer:"am not", hint:"I → am not"},
    {key:"gf3", prompt:"Choose the correct question word order:", sentence:"___ are you from?", options:["Where","What","When"], answer:"Where", hint:"Where are you from?"},
    {key:"gf4", prompt:"Choose the correct question:", sentence:"___ you work in a company?", options:["Do","Does","Are"], answer:"Do", hint:"Do + you + base verb"},
  ];

  const BUILDER_ITEMS = [
    {key:"b1", title:"Introduce yourself (polite)", target:"Hi, I’m Alex. I’m French. I live in Nantes.", tokens:["Hi,","I’m","Alex.","I’m","French.","I","live","in","Nantes."] , hint:"Name → nationality → city."},
    {key:"b2", title:"Small talk: weather", target:"The weather is lovely today. How about you?", tokens:["The","weather","is","lovely","today.","How","about","you?"] , hint:"Weather line + question."},
    {key:"b3", title:"Work small talk", target:"I work in administration. What do you do for work?", tokens:["I","work","in","administration.","What","do","you","do","for","work?"] , hint:"Work + question."},
    {key:"b4", title:"Trip plan (simple)", target:"We are going to visit Canada next summer.", tokens:["We","are","going","to","visit","Canada","next","summer."] , hint:"am/is/are going to + verb."},
  ];

  const WORK_OPTIONS = [
    "I work in administration.",
    "I work in logistics.",
    "I work in sales.",
    "I work in education.",
    "I work for a company in France."
  ];
  const TRIP_OPTIONS = [
    "I’m here on holiday.",
    "We are visiting Montréal for a few days.",
    "We are staying for one week.",
    "We are going to visit Quebec City too.",
    "I’d like to see the mountains."
  ];

  const DIALOGUES = [
    {
      key:"lobby",
      title:"🏨 Hotel lobby: friendly small talk",
      hintPhrases:["Hi, I’m…","Where are you from?","What do you do for work?","Enjoy your trip!"],
      lines:[
        {who:"Guest A", side:"a", say:"Hello! Nice to meet you. I’m Alex."},
        {who:"Guest B", side:"b", say:"Nice to meet you too. I’m Sam."},
        {who:"Guest A", side:"a", say:"Where are you from, Sam?"},
        {who:"Guest B", side:"b", say:"I’m from Canada. How about you?"},
        {who:"Guest A", side:"a", say:"I’m from France. I live in Nantes."},
        {who:"Guest B", side:"b", say:"That’s great. What do you do for work?"},
        {who:"Guest A", side:"a", say:"I work in administration."},
        {who:"Guest B", side:"b", say:"Enjoy your trip!"}
      ]
    },
    {
      key:"cafe",
      title:"☕ Café: weather + travel plans",
      hintPhrases:["The weather is lovely today.","Are you here on holiday?","We are staying for one week.","That sounds nice."],
      lines:[
        {who:"Local", side:"a", say:"Hello! The weather is lovely today."},
        {who:"Traveler", side:"b", say:"Yes, it’s sunny. It’s very nice."},
        {who:"Local", side:"a", say:"Are you here on holiday?"},
        {who:"Traveler", side:"b", say:"Yes, I’m here on holiday. We are staying for one week."},
        {who:"Local", side:"a", say:"That sounds nice. What places are you visiting?"},
        {who:"Traveler", side:"b", say:"We are visiting Montréal and Quebec City."},
      ]
    },
    {
      key:"tour",
      title:"🎟️ Tour desk: polite questions",
      hintPhrases:["Could you recommend a tour?","What time does it start?","Can I pay by card?","Thank you very much."],
      lines:[
        {who:"Staff", side:"a", say:"Hello. How can I help you?"},
        {who:"Traveler", side:"b", say:"Hi. Could you recommend a tour, please?"},
        {who:"Staff", side:"a", say:"Of course. This tour starts at 10 am."},
        {who:"Traveler", side:"b", say:"Great. What time does it finish?"},
        {who:"Staff", side:"a", say:"It finishes at 1 pm."},
        {who:"Traveler", side:"b", say:"Perfect. Can I pay by card?"},
        {who:"Staff", side:"a", say:"Yes, you can. Thank you."}
      ]
    }
  ];

  const LISTEN = [
    {key:"l1", say:"Where are you from?", prompt:"Choose the best reply.", choices:["I’m from France.","I from France.","From France I am."], answer:0, hint:"Use: I’m from…", explain:"Correct."},
    {key:"l2", say:"What do you do for work?", prompt:"Choose the best reply.", choices:["I work in administration.","I am work administration.","I working administration."], answer:0, hint:"Present simple: I work…", explain:"Correct."},
    {key:"l3", say:"The weather is lovely today.", prompt:"Choose the best reply.", choices:["Yes, it’s sunny.","I sunny today.","Weather lovely."], answer:0, hint:"Yes + short sentence.", explain:"Correct."},
    {key:"l4", say:"Are you here on holiday?", prompt:"Choose the best reply.", choices:["Yes, I’m here on holiday.","Yes, I here holiday.","Yes, I am on holiday are."], answer:0, hint:"Use: I’m here…", explain:"Correct."},
  ];

  const MINI = [
    {key:"m1", prompt:"Choose the correct sentence:", choices:["He is Canadian.","He are Canadian.","He am Canadian."], answer:0, hint:"He → is", explain:"Correct."},
    {key:"m2", prompt:"Choose the correct question:", choices:["Do you work in a company?","Are you work in a company?","Does you work in a company?"], answer:0, hint:"Do + you + base verb", explain:"Correct."},
    {key:"m3", prompt:"Choose the correct small talk line:", choices:["It’s a bit cool today.","It bit cool today.","Is a bit cool today."], answer:0, hint:"It’s + adjective", explain:"Correct."},
  ];

  // ---------- Components ----------
  function makeMCQ(host, questions, awardPrefix, includeListen=false) {
    host.innerHTML="";
    const resets=[];
    questions.forEach((q, idx) => {
      const wrap=document.createElement("div");
      wrap.className="q";
      wrap.innerHTML=`
        <div class="q__prompt">${idx+1}. ${escapeHtml(q.prompt)}</div>
        <div class="smallrow">
          ${includeListen || q.say ? `<button class="iconbtn" type="button" data-play="1">🔊 Listen</button>` : ""}
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
        </div>
        <div class="choices"></div>
        <div class="feedback hidden"></div>
      `;
      const fb=$(".feedback", wrap);
      const choices=$(".choices", wrap);

      if(q.say) attachTap($("[data-play]", wrap), () => Speech.say(q.say));
      attachTap($("[data-hint]", wrap), () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML=`💡 <strong>Hint:</strong> ${escapeHtml(q.hint||"")}`;
      });

      q.choices.forEach((c,i) => {
        const row=document.createElement("label");
        row.className="choice";
        row.innerHTML=`<input type="radio" name="${awardPrefix}-${q.key}"/><div>${escapeHtml(c)}</div>`;
        attachTap(row, () => {
          const ok=(i===q.answer);
          fb.classList.remove("hidden","ok","no");
          fb.classList.add(ok ? "ok":"no");
          fb.innerHTML = ok
            ? `✅ Correct! <span class="muted">${escapeHtml(q.explain||"")}</span>`
            : `❌ Not quite. <strong>Best:</strong> ${escapeHtml(q.choices[q.answer])}. <span class="muted">${escapeHtml(q.explain||"")}</span>`;
          if(ok) Score.award(`${awardPrefix}:${q.key}`, 1);
        });
        choices.appendChild(row);
      });

      resets.push(() => {
        $$("input[type=radio]", wrap).forEach(x => x.checked=false);
        fb.classList.add("hidden");
      });
      host.appendChild(wrap);
    });
    return { reset(){ resets.forEach(fn => fn()); } };
  }

  function buildFill(host, items, awardPrefix) {
    host.innerHTML="";
    const resets=[];
    items.forEach((it, idx) => {
      const row=document.createElement("div");
      row.className="line";
      const opts=shuffle(it.options);
      row.innerHTML=`
        <div class="ico">🧩</div>
        <div>
          <div style="font-weight:1100;">${idx+1}. ${escapeHtml(it.prompt)}</div>
          <div class="muted">${escapeHtml(it.sentence)}</div>
          <div class="smallrow" style="margin-top:.45rem;">
            <select class="select">
              <option value="">Choose…</option>
              ${opts.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join("")}
            </select>
            <button class="hintbtn" type="button">💡 Hint</button>
          </div>
          <div class="feedback hidden"></div>
        </div>
      `;
      const sel=$("select", row);
      const hintBtn=$(".hintbtn", row);
      const fb=$(".feedback", row);

      attachTap(hintBtn, () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML=`💡 <strong>Hint:</strong> ${escapeHtml(it.hint||"")}`;
      });

      sel.addEventListener("change", () => {
        const val=sel.value;
        if(!val) return;
        const ok=normalize(val)===normalize(it.answer);
        fb.classList.remove("hidden","ok","no");
        fb.classList.add(ok ? "ok":"no");
        fb.innerHTML = ok ? "✅ Correct!" : `❌ Not quite. Answer: <strong>${escapeHtml(it.answer)}</strong>`;
        if(ok) Score.award(`${awardPrefix}:${it.key}`, 1);
      });

      resets.push((sel, fb));
      host.appendChild(row);
    });
    return {
      reset(){
        $$("#gramFillHost select").forEach(s => s.value="");
        $$("#gramFillHost .feedback").forEach(f => f.classList.add("hidden"));
      }
    };
  }

  function makeToken(text) {
    const t=document.createElement("div");
    t.className="token";
    t.textContent=text;
    t.draggable=true;
    t.addEventListener("dragstart", () => { window.__dragToken=t; });
    return t;
  }

  function buildWordOrder(host, items, awardPrefix) {
    if(!host){
      logDebug("Builder host not found (#builderHost).");
      return { reset(){ /* noop */ } };
    }
    host.innerHTML="";
    const resets=[];
    items.forEach((it, idx) => {
      const block=document.createElement("div");
      block.className="q";
      block.innerHTML=`
        <div class="q__prompt">${idx+1}. ${escapeHtml(it.title)}</div>
        <div class="smallrow">
          <button class="iconbtn" type="button" data-play="1">🔊 Listen</button>
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
          <button class="btn" type="button" data-check="1">✅ Check</button>
          <button class="btn btn--ghost" type="button" data-clear="1">↺ Clear</button>
        </div>
        <div class="builder">
          <div class="bank"></div>
          <div class="dropzone"></div>
        </div>
        <div class="feedback hidden"></div>
      `;
      const bank=$(".bank", block);
      const zone=$(".dropzone", block);
      const fb=$(".feedback", block);

      const idMap=new Map();
      const toks=shuffle(it.tokens).map((txt, iTok) => {
        const t=makeToken(txt);
        t.dataset.role="bank";
        t.dataset.tid=`${it.key}-t${iTok}`;
        idMap.set(t.dataset.tid, t);

        attachTap(t, () => {
          if(t.classList.contains("is-used")) return;
          const c=t.cloneNode(true);
          c.dataset.role="zone";
          c.dataset.sourceTid=t.dataset.tid;
          c.classList.remove("is-used");
          c.draggable=true;
          c.addEventListener("dragstart", () => { window.__dragToken=c; });

          attachTap(c, (e) => {
            e.stopPropagation();
            const sid=c.dataset.sourceTid;
            c.remove();
            const orig=idMap.get(sid);
            if(orig) { orig.classList.remove("is-used"); orig.draggable=true; }
          });

          zone.appendChild(c);
          t.classList.add("is-used"); t.draggable=false;
        });

        return t;
      });
      toks.forEach(t => bank.appendChild(t));

      [bank, zone].forEach(cont => {
        cont.addEventListener("dragover", (e) => { e.preventDefault(); cont.classList.add("is-over"); });
        cont.addEventListener("dragleave", () => cont.classList.remove("is-over"));
        cont.addEventListener("drop", (e) => {
          e.preventDefault();
          cont.classList.remove("is-over");
          const dragged=window.__dragToken;
          if(!dragged) return;
          const targetTok=e.target.closest(".token");

          // zone -> bank (remove)
          if(cont===bank && dragged.dataset.role==="zone") {
            const sid=dragged.dataset.sourceTid;
            dragged.remove();
            const orig=idMap.get(sid);
            if(orig) { orig.classList.remove("is-used"); orig.draggable=true; }
            return;
          }
          // bank -> zone
          if(cont===zone && dragged.dataset.role==="bank") {
            if(dragged.classList.contains("is-used")) return;
            const c=dragged.cloneNode(true);
            c.dataset.role="zone";
            c.dataset.sourceTid=dragged.dataset.tid;
            c.classList.remove("is-used");
            c.draggable=true;
            c.addEventListener("dragstart", () => { window.__dragToken=c; });
            attachTap(c, (e2) => {
              e2.stopPropagation();
              const sid=c.dataset.sourceTid;
              c.remove();
              const orig=idMap.get(sid);
              if(orig) { orig.classList.remove("is-used"); orig.draggable=true; }
            });
            if(targetTok && targetTok.parentElement===zone) zone.insertBefore(c, targetTok);
            else zone.appendChild(c);
            dragged.classList.add("is-used"); dragged.draggable=false;
            return;
          }
          // zone -> zone reorder
          if(cont===zone && dragged.dataset.role==="zone") {
            if(targetTok && targetTok.parentElement===zone && targetTok!==dragged) zone.insertBefore(dragged, targetTok);
            else zone.appendChild(dragged);
          }
        });
      });

      attachTap($("[data-play]", block), () => Speech.say(it.target));
      attachTap($("[data-hint]", block), () => {
        fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
        fb.innerHTML=`💡 <strong>Hint:</strong> ${escapeHtml(it.hint||"")}`;
      });
      attachTap($("[data-check]", block), () => {
        const built=$$(".token", zone).map(t => t.textContent.trim()).join(" ").replace(/\s+/g," ").trim().replace(/\s+([,?.!])/g,"$1");
        const ok=normalize(built)===normalize(it.target);
        fb.classList.remove("hidden","ok","no");
        fb.classList.add(ok ? "ok":"no");
        fb.textContent = ok ? "✅ Perfect!" : `❌ Not yet. You wrote: “${built || "—"}”`;
        if(ok) Score.award(`${awardPrefix}:${it.key}`, 2);
      });
      attachTap($("[data-clear]", block), () => {
        $$(".token", zone).forEach(z => {
          const sid=z.dataset.sourceTid;
          z.remove();
          const orig=idMap.get(sid);
          if(orig) { orig.classList.remove("is-used"); orig.draggable=true; }
        });
        fb.classList.add("hidden");
      });

      resets.push(() => {
        $$(".token", zone).forEach(z => z.remove());
        $$(".token", bank).forEach(b => { b.classList.remove("is-used"); b.draggable=true; });
        fb.classList.add("hidden");
      });

      host.appendChild(block);
    });
    return { reset(){ resets.forEach(fn => fn()); } };
  }

  // Toolkit
  function renderToolTopicSelect() {
    const sel=$("#toolTopic"); if(!sel) return;
    sel.innerHTML="";
    TOOL_TOPICS.forEach(t => {
      const o=document.createElement("option");
      o.value=t.key; o.textContent=t.label;
      sel.appendChild(o);
    });
    sel.value="intro";
  }
  function toolForTopic(k) {
    return TOOL_PHRASES.filter(p => p.topic===k);
  }
  function renderToolCards(shuf=false) {
    const grid=$("#toolGrid"); if(!grid) return;
    const topic=$("#toolTopic")?.value || "intro";
    let list=toolForTopic(topic);
    if(shuf) list=shuffle(list);
    grid.innerHTML="";
    list.forEach(p => {
      const card=document.createElement("div");
      card.className="flashcard";
      card.innerHTML=`
        <div class="fcTop">
          <div class="fcIcon">${p.icon}</div>
          <div class="smallrow"><span class="pillTag">FR: ${escapeHtml(p.fr)}</span></div>
        </div>
        <div class="fcWord">${escapeHtml(p.en)}</div>
        <div class="fcDef">${escapeHtml(p.note)}</div>
        <div class="fcEx"><strong>Tip:</strong> ${escapeHtml(p.fr)}</div>
        <div class="fcBtns">
          <button class="iconbtn" type="button">🔊 Listen</button>
          <button class="hintbtn" type="button">📋 Copy</button>
        </div>
      `;
      const btnSpeak=$$(".iconbtn", card)[0];
      const btnCopy=$$(".hintbtn", card)[0];
      attachTap(btnSpeak, () => Speech.say(p.en));
      attachTap(btnCopy, async () => { try{ await navigator.clipboard.writeText(p.en); }catch(e){} });
      grid.appendChild(card);
    });
  }

  let toolPracticeState={ q:null };
  function buildToolPractice() {
    const host=$("#toolPracticeHost"); if(!host) return;
    const topic=$("#toolTopic")?.value || "intro";
    const bank=TOOL_PRACTICE_BANK[topic] || TOOL_PRACTICE_BANK.intro;
    const q=bank[Math.floor(Math.random()*bank.length)];
    toolPracticeState={q};
    host.innerHTML=`
      <div class="line">
        <div class="ico">🎯</div>
        <div>
          <div style="font-weight:1100;">${escapeHtml(q.prompt)}</div>
          <div class="muted">Choose one.</div>
        </div>
      </div>
      <div class="choices"></div>
      <div class="feedback hidden"></div>
    `;
    const choices=$(".choices", host);
    const fb=$(".feedback", host);

    q.choices.forEach((c,i) => {
      const row=document.createElement("label");
      row.className="choice";
      row.innerHTML=`<input type="radio" name="tp"/><div>${escapeHtml(c)}</div>`;
      attachTap(row, () => {
        const ok=(i===q.answer);
        fb.classList.remove("hidden","ok","no");
        fb.classList.add(ok ? "ok":"no");
        fb.innerHTML = ok ? "✅ Correct!" : `❌ Not quite. Best: <strong>${escapeHtml(q.choices[q.answer])}</strong>`;
        if(ok) Score.award(`tool:${topic}:${q.key}`, 1);
      });
      choices.appendChild(row);
    });
  }

  // Vocab
  function renderVocabSetSelect() {
    const sel=$("#vocabSet"); if(!sel) return;
    sel.innerHTML="";
    VOCAB_SETS.forEach(s => {
      const o=document.createElement("option");
      o.value=s.key; o.textContent=s.label;
      sel.appendChild(o);
    });
    sel.value="countries";
  }
  function vocabForSet(k) { return VOCAB.filter(v => v.set===k); }
  function renderFlashcards(shuf=false) {
    const grid=$("#vocabGrid"); if(!grid) return;
    const setKey=$("#vocabSet")?.value || "countries";
    let list=vocabForSet(setKey);
    if(shuf) list=shuffle(list);
    grid.innerHTML="";
    list.forEach(v => {
      const card=document.createElement("div");
      card.className="flashcard";
      card.innerHTML=`
        <div class="fcTop">
          <div class="fcIcon">${v.icon}</div>
          <div class="smallrow"><span class="pillTag">FR: ${escapeHtml(v.fr)}</span></div>
        </div>
        <div class="fcWord">${escapeHtml(v.word)}</div>
        <div class="fcDef">${escapeHtml(v.def)}</div>
        <div class="fcEx">“${escapeHtml(v.ex)}”</div>
        <div class="fcBtns">
          <button class="iconbtn" type="button">🔊 Listen</button>
          <button class="hintbtn" type="button">📋 Copy example</button>
        </div>
      `;
      const btnSpeak=$$(".iconbtn", card)[0];
      const btnCopy=$$(".hintbtn", card)[0];
      attachTap(btnSpeak, () => Speech.say(`${v.word}. ${v.ex}`));
      attachTap(btnCopy, async () => { try{ await navigator.clipboard.writeText(v.ex); }catch(e){} });
      grid.appendChild(card);
    });
  }

  let vocabQuizState={q:null};
  function buildVocabQuiz() {
    const host=$("#vocabQuizHost"); if(!host) return;
    const setKey=$("#vocabSet")?.value || "countries";
    const list=vocabForSet(setKey);
    if(list.length < 4) { host.innerHTML="<p class='muted'>Not enough words for a quiz.</p>"; return; }
    const q=list[Math.floor(Math.random()*list.length)];
    const opts=shuffle([q, ...shuffle(list.filter(x => x.word!==q.word)).slice(0,3)]);
    vocabQuizState={q};
    host.innerHTML=`
      <div class="line">
        <div class="ico">${q.icon}</div>
        <div>
          <div style="font-weight:1100;">What is the correct word?</div>
          <div class="muted">Definition: ${escapeHtml(q.def)} <span class="pillTag">FR: ${escapeHtml(q.fr)}</span></div>
        </div>
      </div>
      <div class="choices"></div>
      <div class="feedback hidden"></div>
    `;
    const choices=$(".choices", host);
    const fb=$(".feedback", host);

    opts.forEach(o => {
      const row=document.createElement("label");
      row.className="choice";
      row.innerHTML=`<input type="radio" name="vq"/><div>${escapeHtml(o.word)}</div>`;
      attachTap(row, () => {
        const ok=(o.word===q.word);
        fb.classList.remove("hidden","ok","no");
        fb.classList.add(ok ? "ok":"no");
        fb.innerHTML = ok ? `✅ Correct! Example: “${escapeHtml(q.ex)}”`
                          : `❌ Not quite. Answer: <strong>${escapeHtml(q.word)}</strong>. Example: “${escapeHtml(q.ex)}”`;
        if(ok) Score.award(`vocab:${setKey}:${q.word}`, 1);
      });
      choices.appendChild(row);
    });
  }

  // Grammar render
  function renderLesson(hostSel, lines) {
    const host=$(hostSel); if(!host) return;
    host.innerHTML="";
    lines.forEach(l => {
      const row=document.createElement("div");
      row.className="line";
      row.innerHTML=`<div class="ico">${l.ico}</div><div>${escapeHtml(l.text)}</div>`;
      host.appendChild(row);
    });
  }

  // Conversation builder
  function initConvOptions() {
    const w=$("#cWork");
    const t=$("#cTrip");
    if(w) {
      w.innerHTML = WORK_OPTIONS.map(x => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");
      w.value = WORK_OPTIONS[0];
    }
    if(t) {
      t.innerHTML = TRIP_OPTIONS.map(x => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");
      t.value = TRIP_OPTIONS[0];
    }
  }
  function buildConversationText() {
    const parts=[
      $("#cName")?.value || "Hi, I’m Alex.",
      $("#cNat")?.value || "I’m French.",
      $("#cLive")?.value || "I live in Nantes.",
      $("#cWork")?.value || "I work in administration.",
      $("#cTrip")?.value || "I’m here on holiday.",
      $("#cWeather")?.value || "The weather is lovely today.",
      $("#cQ")?.value || "How about you?"
    ];
    return `A: ${parts[0]}\nA: ${parts[1]} ${parts[2]}\nA: ${parts[3]}\nA: ${parts[4]}\nA: ${parts[5]} ${parts[6]}`;
  }
  function renderConvChecklist(text) {
    const host=$("#convChecklist"); if(!host) return false;
    const checks=[
      {label:"Name (I’m / My name is)", test:/\b(i’m|my name is)\b/i},
      {label:"Nationality or from (French / from)", test:/\b(french|american|from)\b/i},
      {label:"Live (I live in…)", test:/\bi live\b/i},
      {label:"Work (I work…)", test:/\bi work\b/i},
      {label:"Trip info (holiday / staying / going to)", test:/\bholiday\b|\bstaying\b|going to/i},
      {label:"Weather line", test:/\bweather\b|\bsunny\b|\bcool\b/i},
      {label:"Question (And you / How about you)", test:/and you\?|how about you\?|what about you\?/i},
    ];
    host.innerHTML="";
    checks.forEach(c => {
      const ok=c.test.test(text);
      const div=document.createElement("div");
      div.className="checkitem " + (ok ? "ok":"no");
      div.textContent=(ok ? "✅ " : "❌ ") + c.label;
      host.appendChild(div);
    });
    return checks.every(c => c.test.test(text));
  }

  // Dialogues
  let dlgState={ key:DIALOGUES[0].key, idx:0, timer:null, role:"b" };
  function renderDlgSelect() {
    const sel=$("#dlgSelect"); if(!sel) return;
    sel.innerHTML="";
    DIALOGUES.forEach(d => {
      const o=document.createElement("option");
      o.value=d.key; o.textContent=d.title;
      sel.appendChild(o);
    });
    sel.value=dlgState.key;
  }
  function currentDialogue() {
    return DIALOGUES.find(d => d.key===dlgState.key) || DIALOGUES[0];
  }
  function setDlgTitle() {
    const h=$("#dlgTitle"); const d=currentDialogue();
    if(h) h.textContent=d.title;
  }
  function clearChat() {
    const stream=$("#chatStream"); if(stream) stream.innerHTML="";
    const hint=$("#dlgHintBox"); if(hint) hint.classList.add("hidden");
    dlgState.idx=0;
    if(dlgState.timer) clearInterval(dlgState.timer);
    dlgState.timer=null;
  }
  function addBubble(line) {
    const stream=$("#chatStream"); if(!stream) return;
    const b=document.createElement("div");
    b.className="bubble " + (line.side==="a" ? "a" : "b");
    b.innerHTML=`
      <div class="who">${line.side==="a" ? "🟦" : "🟩"} ${escapeHtml(line.who)}</div>
      <div class="txt">${escapeHtml(line.say)}</div>
      <div class="tools">
        <button class="toolmini" type="button">🔊</button>
        <button class="toolmini" type="button">↺ Repeat</button>
      </div>
    `;
    const tools=$$(".toolmini", b);
    attachTap(tools[0], (e) => { e.stopPropagation(); Speech.say(line.say); });
    attachTap(tools[1], (e) => { e.stopPropagation(); Speech.say(line.say); });
    stream.appendChild(b);
    stream.scrollTop=stream.scrollHeight;

    if(Auto.enabled && line.side !== dlgState.role) Speech.say(line.say);
  }
  function stepDialogue() {
    const d=currentDialogue();
    if(dlgState.idx >= d.lines.length) return false;
    addBubble(d.lines[dlgState.idx]);
    dlgState.idx++;
    return true;
  }
  function playDialogue() {
    if(dlgState.timer) clearInterval(dlgState.timer);
    dlgState.timer=setInterval(() => {
      const ok=stepDialogue();
      if(!ok) { clearInterval(dlgState.timer); dlgState.timer=null; }
    }, 1400);
  }
  function listenAllDialogue() {
    const d=currentDialogue();
    Speech.say(d.lines.map(x => x.say).join(" "));
  }
  function showDlgHints() {
    const d=currentDialogue();
    const box=$("#dlgHintBox"); if(!box) return;
    box.classList.remove("hidden","ok","no"); box.classList.add("ok");
    box.innerHTML="💡 Useful phrases:<br/>" + d.hintPhrases.map(p => `• ${escapeHtml(p)}`).join("<br/>");
  }
  function setPracticeRole(side) {
    dlgState.role=side;
    const a=$("#roleA"), b=$("#roleB");
    if(!a||!b) return;
    if(side==="a") {
      a.classList.add("is-on"); b.classList.remove("is-on");
      a.setAttribute("aria-pressed","true"); b.setAttribute("aria-pressed","false");
    } else {
      b.classList.add("is-on"); a.classList.remove("is-on");
      b.setAttribute("aria-pressed","true"); a.setAttribute("aria-pressed","false");
    }
  }

  // Init
  function init() {
    Auto.load();
    syncAuto();
    setVoice("en-US");

    if(JS_STATUS) JS_STATUS.textContent = "JS: ✅ loaded";

    // Toolkit
    renderToolTopicSelect();
    renderToolCards(false);
    buildToolPractice();

    safeOn("#toolTopic","change", () => { renderToolCards(false); buildToolPractice(); });
    safeOn("#btnToolShuffle","click", () => renderToolCards(true));
    safeOn("#btnToolPractice","click", () => buildToolPractice());
    safeOn("#btnToolPracticeReset","click", () => buildToolPractice());
    safeOn("#btnToolSpeak","click", () => {
      const topic=$("#toolTopic")?.value || "intro";
      const list=toolForTopic(topic);
      Speech.say(list.map(x => x.en).join(" "));
    });

    // Vocab
    renderVocabSetSelect();
    renderFlashcards(false);
    buildVocabQuiz();
    safeOn("#vocabSet","change", () => { renderFlashcards(false); buildVocabQuiz(); });
    safeOn("#btnVocabShuffle","click", () => renderFlashcards(true));
    safeOn("#btnVocabQuiz","click", () => buildVocabQuiz());
    safeOn("#btnVocabQuizReset","click", () => buildVocabQuiz());
    safeOn("#btnVocabQuizSpeak","click", () => {
      if(!vocabQuizState.q) return;
      Speech.say(`${vocabQuizState.q.word}. ${vocabQuizState.q.ex}`);
    });

    // Grammar
    renderLesson("#gramLesson", GRAMMAR_LINES);
    const gramMCQAPI = makeMCQ($("#gramMCQHost"), GRAM_MCQ, "gram");
    const gramFillAPI = buildFill($("#gramFillHost"), GRAM_FILL, "gramFill");
    safeOn("#btnGramReset","click", () => { gramMCQAPI.reset(); gramFillAPI.reset(); });
    safeOn("#btnGramSpeak","click", () => Speech.say(GRAMMAR_SUMMARY));

    // Builder
    let builderAPI = { reset(){ /* noop */ } };
    try{
      builderAPI = buildWordOrder($("#builderHost"), BUILDER_ITEMS, "builder");
    }catch(e){
      logDebug("Builder init failed: " + (e && e.message ? e.message : String(e)));
    }
    safeOn("#btnBuildReset","click", () => { try{ builderAPI.reset(); }catch(e){ logDebug("Builder reset failed: " + String(e)); } });
// Conversation builder
    initConvOptions();
    safeOn("#btnConvBuild","click", () => {
      const out=$("#convOutput"); if(!out) return;
      out.value = buildConversationText();
      renderConvChecklist(out.value);
    });
    safeOn("#btnConvHint","click", () => {
      const fb=$("#convFb"); if(!fb) return;
      fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
      fb.innerHTML="💡 Try this order: name → nationality/from → where you live → work → trip plan → weather → question.";
    });
    safeOn("#btnConvCheck","click", () => {
      const out=$("#convOutput"); const fb=$("#convFb");
      if(!out||!fb) return;
      const okAll = renderConvChecklist(out.value || "");
      fb.classList.remove("hidden","ok","no");
      if(okAll) { fb.classList.add("ok"); fb.textContent="✅ Great small talk!"; Score.award("conv:complete", 5); }
      else { fb.classList.add("no"); fb.textContent="❌ Not yet. Add the missing parts (see checklist)."; }
    });
    safeOn("#btnConvSpeak","click", () => Speech.say(($("#convOutput")?.value || "").replaceAll("\n"," ")));
    safeOn("#btnConvCopy","click", async () => { try{ await navigator.clipboard.writeText($("#convOutput")?.value || ""); }catch(e){} });
    safeOn("#btnConvReset","click", () => {
      $("#convOutput") && ($("#convOutput").value="");
      $("#convChecklist") && ($("#convChecklist").innerHTML="");
      $("#convFb") && ($("#convFb").classList.add("hidden"));
    });

    // Dialogues
    renderDlgSelect();
    setDlgTitle();
    clearChat();
    setPracticeRole("b");
    safeOn("#dlgSelect","change", (e) => { dlgState.key=e.target.value; setDlgTitle(); clearChat(); });
    safeOn("#btnDlgPlay","click", () => playDialogue());
    safeOn("#btnDlgStep","click", () => stepDialogue());
    safeOn("#btnDlgClear","click", () => clearChat());
    safeOn("#btnDlgListenAll","click", () => listenAllDialogue());
    safeOn("#btnDlgHint","click", () => showDlgHints());
    safeOn("#roleA","click", () => setPracticeRole("a"));
    safeOn("#roleB","click", () => setPracticeRole("b"));

    // Listening + mini
    const listenAPI = makeMCQ($("#listenHost"), LISTEN, "listen", true);
    const miniAPI = makeMCQ($("#miniHost"), MINI, "mini");
    safeOn("#btnListenReset","click", () => listenAPI.reset());
    safeOn("#btnMiniReset","click", () => miniAPI.reset());

    // Reset all
    safeOn("#btnResetAll","click", () => {
      if(!confirm("Reset ALL activities and score?")) return;
      Speech.stop();
      Score.reset();

      $("#toolTopic").value="intro";
      renderToolCards(false);
      buildToolPractice();

      $("#vocabSet").value="countries";
      renderFlashcards(false);
      buildVocabQuiz();

      gramMCQAPI.reset();
      gramFillAPI.reset();

      builderAPI.reset();

      $("#convOutput").value="";
      $("#convChecklist").innerHTML="";
      $("#convFb").classList.add("hidden");

      dlgState.key=DIALOGUES[0].key;
      $("#dlgSelect").value=dlgState.key;
      setDlgTitle();
      clearChat();
      setPracticeRole("b");

      listenAPI.reset();
      miniAPI.reset();

      $("#top")?.scrollIntoView({behavior:"smooth"});
    });

    // Score max estimate
    const max =
      12 + // tool practice + quiz
      12 + // vocab
      GRAM_MCQ.length +
      GRAM_FILL.length +
      (BUILDER_ITEMS.length*2) +
      5 + // conversation complete
      LISTEN.length +
      MINI.length;
    Score.setMax(max);
  }

  init();
})();
