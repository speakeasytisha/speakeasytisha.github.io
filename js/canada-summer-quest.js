/* SpeakEasyTisha — Canada Summer Quest
   Build: 20260318-005907
   Touch-friendly: drag OR tap.
   Audio: speechSynthesis (manual by default).
*/
(() => {
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  const JS_STATUS = $("#jsStatus");
  const DEBUG = $("#debugBox");
  function logDebug(msg){
    try{ if(!DEBUG) return; DEBUG.classList.remove("hidden"); DEBUG.textContent += `\n${msg}`; }catch(e){}
  }
  window.addEventListener("error", (e) => {
    if(JS_STATUS) JS_STATUS.textContent = "JS: ❌ error";
    logDebug(`[Error] ${e.message} @ ${e.filename}:${e.lineno}`);
  });
  window.addEventListener("unhandledrejection", (e) => {
    if(JS_STATUS) JS_STATUS.textContent = "JS: ❌ promise";
    logDebug(`[Promise] ${String(e.reason)}`);
  });

  function escapeHtml(s){
    return String(s ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
  function normalize(s){
    return String(s ?? "")
      .replace(/[’']/g,"'")
      .replace(/\s+/g," ")
      .trim()
      .toLowerCase();
  }
  function shuffle(arr){
    const a=(arr||[]).slice();
    for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }
  function attachTap(el, handler){
    if(!el) return;
    const h = (e) => { try{ handler(e); }catch(err){ console.error(err); } };
    el.addEventListener("click", h);
    el.addEventListener("pointerup", h);
    el.addEventListener("touchend", h, {passive:true});
  }
  function safeOn(sel, evt, handler, root=document){
    const el = root.querySelector(sel);
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
      let best=v.find(x => (x.lang||"").toLowerCase() === lang);
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
      const voice=this.pickVoice();
      if(voice) u.voice=voice;
      u.lang=this.mode; u.rate=this.rate; u.pitch=1.0;
      window.speechSynthesis.speak(u);
    }
  };
  if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged = () => Speech.getVoices();

  // Auto audio
  const Auto = {
    key:"csq_autoAudio",
    enabled:false,
    load(){ this.enabled = (localStorage.getItem(this.key)==="1"); },
    save(){ localStorage.setItem(this.key, this.enabled ? "1":"0"); }
  };

  function setVoice(mode){
    Speech.mode=mode;
    const us=$("#voiceUS"), uk=$("#voiceUK");
    if(!us||!uk) return;
    if(mode==="en-US"){ us.classList.add("is-on"); uk.classList.remove("is-on"); us.setAttribute("aria-pressed","true"); uk.setAttribute("aria-pressed","false"); }
    else { uk.classList.add("is-on"); us.classList.remove("is-on"); uk.setAttribute("aria-pressed","true"); us.setAttribute("aria-pressed","false"); }
  }
  function syncAuto(){
    const off=$("#autoOff"), on=$("#autoOn");
    if(!off||!on) return;
    if(Auto.enabled){ on.classList.add("is-on"); off.classList.remove("is-on"); on.setAttribute("aria-pressed","true"); off.setAttribute("aria-pressed","false"); }
    else { off.classList.add("is-on"); on.classList.remove("is-on"); off.setAttribute("aria-pressed","true"); on.setAttribute("aria-pressed","false"); }
  }
  function setAuto(v){ Auto.enabled=!!v; Auto.save(); syncAuto(); }

  safeOn("#voiceUS","click", () => setVoice("en-US"));
  safeOn("#voiceUK","click", () => setVoice("en-GB"));
  safeOn("#autoOff","click", () => setAuto(false));
  safeOn("#autoOn","click", () => setAuto(true));
  safeOn("#btnPause","click", () => Speech.pause());
  safeOn("#btnResume","click", () => Speech.resume());
  safeOn("#btnStop","click", () => Speech.stop());
  safeOn("#btnStart","click", () => $("#sec1")?.scrollIntoView({behavior:"smooth"}));
  safeOn("#btnHow","click", () => {
    alert("How to use:\n\n• Auto audio is OFF by default.\n• Click 🔊 when you want audio.\n• Use the Quest in order: Discover → Vocab → Pack → Grammar → Itinerary → Dialogues → Listening.\n\nTip: Ask him to repeat each useful phrase out loud.");
  });

  // Score
  const Score = {
    now:0, max:0, awarded:new Set(),
    setMax(n){ this.max=n; updateScore(); updateProgress(); },
    award(key, pts=1){ if(this.awarded.has(key)) return; this.awarded.add(key); this.now += pts; updateScore(); updateProgress(); },
    reset(){ this.now=0; this.awarded.clear(); updateScore(); updateProgress(); }
  };
  function updateScore(){
    $("#scoreNow") && ($("#scoreNow").textContent=String(Score.now));
    $("#scoreMax") && ($("#scoreMax").textContent=String(Score.max));
  }
  function updateProgress(){
    const bar=$("#progressBar");
    if(!bar) return;
    const pct=Score.max ? Math.round((Score.now/Score.max)*100) : 0;
    bar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  }

  // ---------- Data ----------
  const DESTS = [
    {
      id:"montreal",
      icon:"🎷",
      title:"Montréal (Quebec)",
      sub:"City + culture + food",
      tags:["city","culture","romantic"],
      desc:[
        "Montréal is a bilingual city with a relaxed summer vibe. In July and August, the city has festivals, live music, and outdoor terraces.",
        "You can walk in Old Montréal, try local food, visit museums, and do a day trip to nearby nature.",
        "It is a great choice if you want culture, restaurants, and an easy city break."
      ]
    },
    {
      id:"quebeccity",
      icon:"🏰",
      title:"Quebec City (Quebec)",
      sub:"Historic + romantic",
      tags:["culture","romantic","city"],
      desc:[
        "Quebec City feels like a European-style old town with stone streets, views, and beautiful buildings.",
        "In summer, it is perfect for slow walks, scenic photos, and a relaxed schedule.",
        "It can feel very romantic and calm, especially in the evening."
      ]
    },
    {
      id:"banff",
      icon:"🏔️",
      title:"Banff (Alberta)",
      sub:"Mountains + lakes + nature",
      tags:["nature","scenic","romantic"],
      desc:[
        "Banff is famous for the Rocky Mountains and bright blue lakes. Summer is ideal for easy hikes, viewpoints, and wildlife spotting.",
        "You can take gondolas, visit Lake Louise, and enjoy fresh air and incredible landscapes.",
        "It can be more expensive, but it is one of the most scenic places in Canada."
      ]
    },
    {
      id:"vancouver",
      icon:"🌊",
      title:"Vancouver (British Columbia)",
      sub:"Coast + city + nature",
      tags:["city","nature","relaxing"],
      desc:[
        "Vancouver is a modern city near the ocean and mountains. In summer, the weather is often mild and pleasant.",
        "You can bike around Stanley Park, relax on beaches, and take day trips to islands or forests.",
        "It is a great balance: city comfort + easy nature."
      ]
    },
    {
      id:"niagara",
      icon:"💦",
      title:"Niagara Falls (Ontario)",
      sub:"Iconic + easy day trip",
      tags:["culture","budget","relaxing"],
      desc:[
        "Niagara Falls is one of the most famous attractions in Canada. It is great for a short visit or a day trip from Toronto.",
        "You can take a boat tour, walk near the viewpoints, and visit nearby towns and vineyards.",
        "It is touristy, but it is a fun experience and easy to understand on a trip plan."
      ]
    },
    {
      id:"ottawa",
      icon:"🏛️",
      title:"Ottawa (Ontario)",
      sub:"Capital + calm + museums",
      tags:["culture","budget","city"],
      desc:[
        "Ottawa is Canada’s capital. It is calmer than Toronto and great for museums, parks, and a relaxed schedule.",
        "In summer, you can walk by the river, see important buildings, and enjoy outdoor markets.",
        "It can be a budget-friendly city stop, with culture and good public transport."
      ]
    }
  ];

  const READ_CHECK = [
    {
      key:"rc1",
      prompt:"Which place is famous for the Rocky Mountains?",
      choices:["Banff","Ottawa","Niagara Falls"],
      answer:0,
      hint:"Look for mountains + lakes.",
      explain:"Banff is in the Rocky Mountains."
    },
    {
      key:"rc2",
      prompt:"Which place is a calm capital city with museums?",
      choices:["Ottawa","Vancouver","Banff"],
      answer:0,
      hint:"Capital + museums.",
      explain:"Ottawa is Canada’s capital."
    },
    {
      key:"rc3",
      prompt:"Which city is bilingual and has festivals in summer?",
      choices:["Montréal","Quebec City","Niagara Falls"],
      answer:0,
      hint:"Bilingual + festivals.",
      explain:"Montréal is bilingual with summer festivals."
    },
    {
      key:"rc4",
      prompt:"Which place is an easy day trip from Toronto?",
      choices:["Niagara Falls","Banff","Vancouver"],
      answer:0,
      hint:"Short trip near Toronto.",
      explain:"Niagara Falls is often a day trip from Toronto."
    },
  ];

  const VOCAB_SETS = [
    {key:"planning", label:"🗓️ Planning (dates + times)"},
    {key:"transport", label:"🚆 Transport"},
    {key:"summer", label:"🌤️ Summer + weather"},
    {key:"food", label:"🍽️ Food + restaurant"},
    {key:"help", label:"🧭 Asking for help"}
  ];

  const VOCAB = [
    // planning
    {set:"planning", icon:"📅", word:"next summer", fr:"l’été prochain", def:"in the summer of next year", ex:"We are going to visit Canada next summer."},
    {set:"planning", icon:"🗓️", word:"in July", fr:"en juillet", def:"during the month of July", ex:"We are going in July."},
    {set:"planning", icon:"⏰", word:"at 10 am", fr:"à 10h", def:"time in the morning", ex:"The train leaves at 10 am."},
    {set:"planning", icon:"🧾", word:"to book", fr:"réserver", def:"to reserve a place", ex:"I want to book a hotel."},
    {set:"planning", icon:"✅", word:"available", fr:"disponible", def:"free / not occupied", ex:"Is a double room available?"},
    // transport
    {set:"transport", icon:"✈️", word:"flight", fr:"vol", def:"trip by plane", ex:"Our flight is at 7 pm."},
    {set:"transport", icon:"🚆", word:"platform", fr:"quai", def:"place to board a train", ex:"Which platform is it?"},
    {set:"transport", icon:"🚌", word:"bus stop", fr:"arrêt de bus", def:"place where the bus stops", ex:"Where is the bus stop?"},
    {set:"transport", icon:"🗺️", word:"downtown", fr:"centre-ville", def:"city center", ex:"We are staying downtown."},
    {set:"transport", icon:"🎟️", word:"return ticket", fr:"aller-retour", def:"ticket for two trips", ex:"A return ticket, please."},
    // summer
    {set:"summer", icon:"🧴", word:"sunscreen", fr:"crème solaire", def:"cream to protect skin", ex:"Don’t forget sunscreen."},
    {set:"summer", icon:"🧢", word:"cap", fr:"casquette", def:"hat with a visor", ex:"I need a cap for the sun."},
    {set:"summer", icon:"🧥", word:"light jacket", fr:"veste légère", def:"thin jacket", ex:"Bring a light jacket for the evening."},
    {set:"summer", icon:"🌦️", word:"forecast", fr:"météo / prévisions", def:"weather prediction", ex:"What is the weather forecast?"},
    {set:"summer", icon:"🥾", word:"hike", fr:"randonnée", def:"walk in nature", ex:"We are going to hike near Banff."},
    // food
    {set:"food", icon:"📍", word:"reservation", fr:"réservation", def:"a booking", ex:"I have a reservation for two."},
    {set:"food", icon:"🥗", word:"menu", fr:"menu", def:"list of food and drinks", ex:"Could I see the menu, please?"},
    {set:"food", icon:"🚰", word:"tap water", fr:"eau du robinet", def:"water from the tap", ex:"Could we have tap water, please?"},
    {set:"food", icon:"🧾", word:"the check", fr:"l’addition", def:"bill in a restaurant", ex:"Can I have the check, please?"},
    {set:"food", icon:"🥡", word:"to go", fr:"à emporter", def:"take away", ex:"To go, please."},
    // help
    {set:"help", icon:"🙏", word:"Could you help me?", fr:"Pouvez-vous m’aider ?", def:"polite request for help", ex:"Could you help me, please?"},
    {set:"help", icon:"🔁", word:"Could you repeat?", fr:"Pouvez-vous répéter ?", def:"say again", ex:"Could you repeat, please?"},
    {set:"help", icon:"🐢", word:"more slowly", fr:"plus lentement", def:"slower", ex:"More slowly, please."},
    {set:"help", icon:"📍", word:"near here", fr:"près d’ici", def:"not far", ex:"Is it near here?"},
    {set:"help", icon:"🧭", word:"directions", fr:"directions", def:"how to go to a place", ex:"Can you give me directions?"}
  ];

  const GRAMMAR_LINES = [
    {ico:"🗓️", text:"Going to (plan): I am going to visit Montréal in July. / We are going to book a hotel."},
    {ico:"✅", text:"Affirmative: am/is/are going to + base verb. (She is going to buy a ticket.)"},
    {ico:"❌", text:"Negative: am not / isn’t / aren’t going to + verb. (We aren’t going to drive.)"},
    {ico:"❓", text:"Question: Am/Is/Are + subject + going to + verb? (Are you going to travel in August?)"},
    {ico:"⚡", text:"Will (offer / quick decision): I will help you. / We’ll take the bus."},
    {ico:"❌", text:"Negative: won’t + base verb. (I won’t be late.)"},
    {ico:"❓", text:"Question: Will + subject + base verb? (Will you pay by card?)"},
    {ico:"🙏", text:"Polite requests: Could I have…? / Could you…? / I’d like… (natural + polite)"},
    {ico:"🧩", text:"Useful frame: I’d like to + verb. (I’d like to book a tour.)"}
  ];
  const GRAMMAR_SUMMARY = "Future plans: going to. Quick decisions/offers: will. Polite requests: Could I…? Could you…? I’d like…";

  const GRAM_MCQ = [
    {key:"g1", prompt:"Choose the correct plan (going to).",
      choices:["We are going to visit Canada next summer.","We will visiting Canada next summer.","We going to visit Canada."],
      answer:0, hint:"Plan → am/is/are going to + verb.", explain:"Correct plan."},
    {key:"g2", prompt:"Choose the correct question (going to).",
      choices:["Are you going to book a hotel?","Do you going to book a hotel?","Are you book a hotel?"],
      answer:0, hint:"Are + subject + going to + verb?", explain:"Correct question."},
    {key:"g3", prompt:"Choose the best offer (will).",
      choices:["I will help you with your bags.","I am help you with your bags.","I helping you with your bags."],
      answer:0, hint:"Offer → will + base verb.", explain:"Correct offer."},
    {key:"g4", prompt:"Choose the most polite sentence.",
      choices:["Could you repeat, please?","Repeat.","You repeat now."],
      answer:0, hint:"Use Could you… please?", explain:"Polite request."},
  ];

  const GRAM_FILL = [
    {key:"gf1", prompt:"Fill the question:", sentence:"___ you going to travel in July?", options:["Are","Do","Will"], answer:"Are",
      hint:"Going to question starts with Am/Is/Are."},
    {key:"gf2", prompt:"Fill the negative:", sentence:"We ___ going to drive. (not)", options:["aren't","don't","won't"], answer:"aren't",
      hint:"We → aren’t going to + verb."},
    {key:"gf3", prompt:"Fill the offer:", sentence:"I ___ help you. (offer)", options:["will","am","do"], answer:"will",
      hint:"Offer/quick decision → will."},
    {key:"gf4", prompt:"Fill the polite request:", sentence:"___ I have the menu, please?", options:["Could","Do","Am"], answer:"Could",
      hint:"Polite request → Could I…?"},
  ];

  // Packing items
  const PACK_ITEMS = [
    {text:"passport", bag:"documents"}, {text:"flight ticket", bag:"documents"}, {text:"credit card", bag:"documents"}, {text:"hotel reservation", bag:"documents"},
    {text:"t-shirt", bag:"clothes"}, {text:"comfortable shoes", bag:"clothes"}, {text:"light jacket", bag:"clothes"}, {text:"swimsuit", bag:"clothes"},
    {text:"phone charger", bag:"tech"}, {text:"power adapter", bag:"tech"}, {text:"headphones", bag:"tech"}, {text:"camera", bag:"tech"},
    {text:"sunscreen", bag:"toiletries"}, {text:"toothbrush", bag:"toiletries"}, {text:"medicine", bag:"toiletries"}, {text:"hand sanitizer", bag:"toiletries"}
  ];

  const DIALOGUES = [
    {
      key:"info",
      title:"🧭 Tourist information: asking for ideas",
      hintPhrases:["Could you recommend a relaxing place?","How can we get there?","How much does it cost?","That sounds great. Thank you!"],
      lines:[
        {who:"Staff", side:"a", say:"Hello! How can I help you today?"},
        {who:"Traveler", side:"b", say:"Hi. Could you recommend a relaxing place near the city?"},
        {who:"Staff", side:"a", say:"Yes. You can visit a park and take a boat ride. It is very nice in summer."},
        {who:"Traveler", side:"b", say:"That sounds great. How can we get there?"},
        {who:"Staff", side:"a", say:"You can take the metro and then walk for five minutes."},
        {who:"Traveler", side:"b", say:"Perfect. Thank you very much!"}
      ]
    },
    {
      key:"tour",
      title:"🎟️ Booking a tour (time + date)",
      hintPhrases:["I’d like to book a tour.","Is it available on Friday?","What time does it start?","Can I pay by card?"],
      lines:[
        {who:"Clerk", side:"a", say:"Hello. What would you like to do?"},
        {who:"Traveler", side:"b", say:"Hi. I’d like to book a tour, please."},
        {who:"Clerk", side:"a", say:"Of course. Is it for this Friday or Saturday?"},
        {who:"Traveler", side:"b", say:"Friday, please. What time does it start?"},
        {who:"Clerk", side:"a", say:"It starts at 10 am. Would you like two tickets?"},
        {who:"Traveler", side:"b", say:"Yes, two tickets. Can I pay by card?"},
        {who:"Clerk", side:"a", say:"Yes, by card is fine."}
      ]
    },
    {
      key:"restaurant",
      title:"🍽️ Restaurant reservation (polite)",
      hintPhrases:["I have a reservation for two.","Could we have tap water, please?","Could I see the menu?","Can I have the check, please?"],
      lines:[
        {who:"Host", side:"a", say:"Good evening. Do you have a reservation?"},
        {who:"Guest", side:"b", say:"Yes, I have a reservation for two."},
        {who:"Host", side:"a", say:"Great. Please follow me. Here is your table."},
        {who:"Guest", side:"b", say:"Thank you. Could I see the menu, please?"},
        {who:"Host", side:"a", say:"Of course. Would you like water?"},
        {who:"Guest", side:"b", say:"Yes, could we have tap water, please?"}
      ]
    }
  ];

  const LISTEN = [
    {key:"l1", say:"Could you recommend a relaxing place near the city?", prompt:"Choose the best reply.",
      choices:["Yes. You can visit a park.","I recommend relax.","It is ticket."], answer:0, hint:"Staff answers with an idea.", explain:"A park is an idea."},
    {key:"l2", say:"What time does it start?", prompt:"Choose the best reply.",
      choices:["It starts at 10 am.","It start 10.","Start in July."], answer:0, hint:"Answer with a time.", explain:"10 am is correct."},
    {key:"l3", say:"Do you have a reservation?", prompt:"Choose the best reply.",
      choices:["Yes, I have a reservation for two.","I am reservation.","Reservation is good."], answer:0, hint:"Say yes + details.", explain:"Reservation for two."},
    {key:"l4", say:"For here or to go?", prompt:"Choose the best reply.",
      choices:["For here, please.","Go straight.","At 7 pm."], answer:0, hint:"Choose one option.", explain:"For here, please."}
  ];

  const MINI = [
    {key:"m1", prompt:"Choose the correct sentence:",
      choices:["We aren’t going to drive.","We don’t going to drive.","We not going to drive."], answer:0,
      hint:"Negative going to: aren’t/isn’t/am not.", explain:"Correct negative form."},
    {key:"m2", prompt:"Choose the correct comparative:",
      choices:["Banff is more scenic than Ottawa.","Banff is the more scenic than Ottawa.","Banff is scenicest than Ottawa."], answer:0,
      hint:"More + adjective + than.", explain:"Correct comparison."},
    {key:"m3", prompt:"Choose the most polite request:",
      choices:["Could I have the check, please?","Give me the check.","I want check now."], answer:0,
      hint:"Could I… please?", explain:"Polite request."},
  ];

  // ---------- UI Components ----------
  function makeMCQ(host, questions, awardPrefix, withAudio=false){
    host.innerHTML="";
    const resets=[];
    questions.forEach((q, idx) => {
      const wrap=document.createElement("div");
      wrap.className="q";
      wrap.innerHTML=`
        <div class="q__prompt">${idx+1}. ${escapeHtml(q.prompt)}</div>
        <div class="smallrow">
          ${(withAudio || q.say) ? `<button class="iconbtn" type="button" data-play="1">🔊 Listen</button>` : ""}
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
        fb.innerHTML = `💡 <strong>Hint:</strong> ${escapeHtml(q.hint||"")}`;
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

  function buildFill(host, items, awardPrefix){
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
            <select class="select" data-key="${it.key}">
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
        fb.innerHTML = `💡 <strong>Hint:</strong> ${escapeHtml(it.hint||"")}`;
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

      resets.push(() => { sel.value=""; fb.classList.add("hidden"); });
      host.appendChild(row);
    });
    return { reset(){ resets.forEach(fn => fn()); } };
  }

  // ---------- Destinations ----------
  const Fav = {
    key:"csq_favs",
    set:new Set(),
    load(){ try{ this.set=new Set(JSON.parse(localStorage.getItem(this.key)||"[]")); }catch(e){ this.set=new Set(); } },
    save(){ localStorage.setItem(this.key, JSON.stringify(Array.from(this.set))); },
    toggle(id){ if(this.set.has(id)) this.set.delete(id); else this.set.add(id); this.save(); },
    clear(){ this.set.clear(); this.save(); }
  };

  function renderFavCount(){
    const el=$("#favCount");
    if(el) el.textContent = `Favorites: ${Fav.set.size}`;
  }

  function renderDestinations(){
    const grid=$("#destGrid");
    if(!grid) return;
    const filter=$("#destFilter")?.value || "all";
    grid.innerHTML="";
    const list = (filter==="all") ? DESTS : DESTS.filter(d => d.tags.includes(filter));
    list.forEach(d => {
      const card=document.createElement("div");
      card.className="destCard";
      const isFav=Fav.set.has(d.id);
      card.innerHTML=`
        <button class="fav ${isFav ? "is-on":""}" type="button" aria-label="Favorite">⭐</button>
        <div class="destHead">
          <div>
            <div class="destTitle">${d.icon} ${escapeHtml(d.title)}</div>
            <div class="destSub">${escapeHtml(d.sub)}</div>
          </div>
          <div class="smallrow">
            <button class="iconbtn" type="button" data-say="1">🔊</button>
          </div>
        </div>

        <div class="tags">
          ${d.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
        </div>

        <div class="destP">
          ${escapeHtml(d.desc[0])}<br/><br/>
          ${escapeHtml(d.desc[1])}<br/><br/>
          ${escapeHtml(d.desc[2])}
        </div>

        <div class="destBtns">
          <button class="btn btn--ghost" type="button" data-mission="1">🎯 Mission</button>
          <button class="hintbtn" type="button" data-hint="1">💡 Useful phrases</button>
        </div>
        <div class="feedback hidden"></div>
      `;
      const favBtn=$(".fav", card);
      const speakBtn=$("[data-say]", card);
      const missionBtn=$("[data-mission]", card);
      const hintBtn=$("[data-hint]", card);
      const fb=$(".feedback", card);

      attachTap(favBtn, () => {
        Fav.toggle(d.id);
        favBtn.classList.toggle("is-on");
        renderFavCount();
      });

      attachTap(speakBtn, () => Speech.say(`${d.title}. ${d.desc.join(" ")}`));

      attachTap(hintBtn, () => {
        fb.classList.remove("hidden","ok","no"); fb.classList.add("ok");
        fb.innerHTML = "💡 Use these phrases:<br/>• I’d like to visit…<br/>• It sounds relaxing.<br/>• It is more scenic than…<br/>• How can we get there?";
      });

      attachTap(missionBtn, () => {
        fb.classList.remove("hidden","ok","no"); fb.classList.add("ok");
        fb.innerHTML = `🎯 Say this out loud: “I’d like to visit ${escapeHtml(d.title.split("(")[0].trim())} because it is ${escapeHtml(d.tags[0])}.”<br/><span class="muted">Click 🎯 again after you say it to earn points.</span>`;
        if(!missionBtn.__armed){ missionBtn.__armed=true; return; }
        Score.award(`dest:${d.id}`, 2);
        fb.innerHTML="✅ Great! You made a simple reason sentence.";
      });
      missionBtn.__armed=false;

      grid.appendChild(card);
    });
  }

  // ---------- Vocabulary ----------
  function renderVocabSetSelect(){
    const sel=$("#vocabSet");
    if(!sel) return;
    sel.innerHTML="";
    VOCAB_SETS.forEach(s => {
      const o=document.createElement("option");
      o.value=s.key; o.textContent=s.label;
      sel.appendChild(o);
    });
    sel.value="planning";
  }
  function vocabForSet(k){ return VOCAB.filter(v => v.set===k); }

  function renderFlashcards(shuf=false){
    const grid=$("#vocabGrid");
    if(!grid) return;
    const setKey=$("#vocabSet")?.value || "planning";
    let list=vocabForSet(setKey);
    if(shuf) list=shuffle(list);
    grid.innerHTML="";
    list.forEach(v => {
      const card=document.createElement("div");
      card.className="flashcard";
      card.innerHTML=`
        <div class="fcTop">
          <div class="fcIcon">${v.icon}</div>
          <div class="smallrow"><span class="pillTag badgeFR">FR: ${escapeHtml(v.fr)}</span></div>
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
  function buildVocabQuiz(){
    const host=$("#vocabQuizHost");
    if(!host) return;
    const setKey=$("#vocabSet")?.value || "planning";
    const list=vocabForSet(setKey);
    if(list.length < 4){ host.innerHTML="<p class='muted'>Not enough words for a quiz.</p>"; return; }
    const q=list[Math.floor(Math.random()*list.length)];
    const opts=shuffle([q, ...shuffle(list.filter(x => x.word!==q.word)).slice(0,3)]);
    vocabQuizState={q};

    host.innerHTML=`
      <div class="line">
        <div class="ico">${q.icon}</div>
        <div>
          <div style="font-weight:1100;">What is the correct word?</div>
          <div class="muted">Definition: ${escapeHtml(q.def)} <span class="pillTag badgeFR">FR: ${escapeHtml(q.fr)}</span></div>
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
        const ok=o.word===q.word;
        fb.classList.remove("hidden","ok","no");
        fb.classList.add(ok ? "ok":"no");
        fb.innerHTML = ok ? `✅ Correct! Example: “${escapeHtml(q.ex)}”`
                          : `❌ Not quite. Answer: <strong>${escapeHtml(q.word)}</strong>. Example: “${escapeHtml(q.ex)}”`;
        if(ok) Score.award(`vocab:${setKey}:${q.word}`, 1);
      });
      choices.appendChild(row);
    });
  }

  // ---------- Packing game ----------
  let lastZone = null;

  function makeToken(text) {
    const t=document.createElement("div");
    t.className="token";
    t.textContent=text;
    t.draggable=true;
    t.addEventListener("dragstart", () => { window.__dragToken=t; });
    return t;
  }

  function renderPacking(shuf=false) {
    const bank=$("#packBank");
    if(!bank) return;
    bank.innerHTML="";
    const items = shuf ? shuffle(PACK_ITEMS) : PACK_ITEMS.slice();
    items.forEach((it, idx) => {
      const t=makeToken(it.text);
      t.dataset.bag=it.bag;
      t.dataset.id=`p${idx}`;
      attachTap(t, () => {
        if(!lastZone) return;
        placeTokenClone(t, lastZone);
      });
      bank.appendChild(t);
    });
  }

  function placeTokenClone(bankTok, zoneEl, beforeTok=null) {
    if(bankTok.classList.contains("is-used")) return;
    const c=bankTok.cloneNode(true);
    c.dataset.role="zone";
    c.dataset.sourceId=bankTok.dataset.id;
    c.classList.remove("is-used");
    c.draggable=true;
    c.addEventListener("dragstart", () => { window.__dragToken=c; });
    attachTap(c, (e) => {
      e.stopPropagation();
      const sid=c.dataset.sourceId;
      c.remove();
      const orig = $(`#packBank .token[data-id="${sid}"]`);
      if(orig) orig.classList.remove("is-used"), orig.draggable=true;
    });
    if(beforeTok) zoneEl.insertBefore(c, beforeTok);
    else zoneEl.appendChild(c);
    bankTok.classList.add("is-used");
    bankTok.draggable=false;
  }

  function setupPackingDnD() {
    const bank=$("#packBank");
    const zones=$$(".dropzone[data-bag]");
    zones.forEach(z => {
      z.addEventListener("pointerdown", () => { lastZone=z; });
      z.addEventListener("dragover", (e) => { e.preventDefault(); z.classList.add("is-over"); });
      z.addEventListener("dragleave", () => z.classList.remove("is-over"));
      z.addEventListener("drop", (e) => {
        e.preventDefault();
        z.classList.remove("is-over");
        lastZone=z;
        const dragged=window.__dragToken;
        if(!dragged) return;
        const targetTok = e.target.closest(".token");

        // zone -> bank (remove)
        if(dragged.dataset.role==="zone" && e.currentTarget===bank) {
          const sid=dragged.dataset.sourceId;
          dragged.remove();
          const orig = $(`#packBank .token[data-id="${sid}"]`);
          if(orig) orig.classList.remove("is-used"), orig.draggable=true;
          return;
        }

        // bank -> zone
        if(dragged.parentElement===bank) {
          if(dragged.classList.contains("is-used")) return;
          placeTokenClone(dragged, z, (targetTok && targetTok.parentElement===z) ? targetTok : null);
          return;
        }

        // zone -> zone reorder/move
        if(dragged.dataset.role==="zone") {
          if(targetTok && targetTok.parentElement===z && targetTok!==dragged) z.insertBefore(dragged, targetTok);
          else z.appendChild(dragged);
        }
      });
    });
  }

  function resetPackingZones() {
    $$(".dropzone[data-bag] .token").forEach(t => t.remove());
    $$("#packBank .token").forEach(t => { t.classList.remove("is-used"); t.draggable=true; });
  }

  function checkPacking() {
    const fb=$("#packFb");
    if(!fb) return;
    let correct=0, total=0;
    $$(".dropzone[data-bag]").forEach(z => {
      const bag=z.dataset.bag;
      $$(".token", z).forEach(tok => {
        total++;
        if(tok.dataset.bag===bag) correct++;
      });
    });
    fb.classList.remove("hidden","ok","no");
    if(total===0) {
      fb.classList.add("no");
      fb.textContent="❌ Place some items first.";
      return;
    }
    if(correct===total) {
      fb.classList.add("ok");
      fb.textContent=`✅ Perfect! ${correct} / ${total} correct.`;
      Score.award("pack:perfect", 6);
    } else {
      fb.classList.add("no");
      fb.textContent=`❌ ${correct} / ${total} correct. Tip: move a wrong item by tapping it to remove.`;
      Score.award("pack:try", 1);
    }
  }

  // ---------- Grammar ----------
  function renderLesson(hostSel, lines) {
    const host=$(hostSel);
    if(!host) return;
    host.innerHTML="";
    lines.forEach(l => {
      const row=document.createElement("div");
      row.className="line";
      row.innerHTML=`<div class="ico">${l.ico}</div><div>${escapeHtml(l.text)}</div>`;
      host.appendChild(row);
    });
  }

  // ---------- Itinerary builder ----------
  function renderItSelects() {
    const a=$("#itPlace"), b=$("#itOther");
    if(!a||!b) return;
    a.innerHTML=""; b.innerHTML="";
    DESTS.forEach(d => {
      const name=d.title.split("(")[0].trim();
      const o1=document.createElement("option"); o1.value=name; o1.textContent=name;
      const o2=document.createElement("option"); o2.value=name; o2.textContent=name;
      a.appendChild(o1); b.appendChild(o2);
    });
    a.value="Montréal"; b.value="Banff";
  }

  function buildItineraryText() {
    const place=$("#itPlace")?.value || "Montréal";
    const month=$("#itMonth")?.value || "in July";
    const dur=$("#itDuration")?.value || "for one week";
    const tr=$("#itTransport")?.value || "by plane";
    const style=$("#itStyle")?.value || "relaxing";
    const comp=$("#itCompare")?.value || "better than";
    const other=$("#itOther")?.value || "Banff";

    return `Plan for next summer:\n` +
      `1) We are going to visit ${place} ${month} ${dur}.\n` +
      `2) We are going to travel ${tr} and book a hotel downtown.\n` +
      `3) I’d like a ${style} trip because I want to rest.\n` +
      `4) ${place} is ${comp} ${other} for us; however, we will compare prices.\n` +
      `5) Could you recommend a good restaurant, please?`;
  }

  function renderChecklist(text) {
    const host=$("#itChecklist"); if(!host) return false;
    const checks=[
      {label:"Going to plan", test:/going to/i},
      {label:"Time/month", test:/\bin\s+(june|july|august)\b/i},
      {label:"Polite request (Could / I'd like)", test:/\bcould\b|i['’]d like/i},
      {label:"Connector (however / because)", test:/\bhowever\b|\bbecause\b/i},
      {label:"Comparison (than)", test:/\bthan\b/i}
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

  // ---------- Dialogues ----------
  let dlgState={ key:DIALOGUES[0].key, idx:0, timer:null, role:"b" };
  function renderDlgSelect() {
    const sel=$("#dlgSelect"); if(!sel) return;
    sel.innerHTML="";
    DIALOGUES.forEach(d => {
      const o=document.createElement("option"); o.value=d.key; o.textContent=d.title;
      sel.appendChild(o);
    });
    sel.value=dlgState.key;
  }
  function currentDialogue() {
    return DIALOGUES.find(d => d.key===dlgState.key) || DIALOGUES[0];
  }
  function setDlgTitle() {
    const h=$("#dlgTitle");
    const d=currentDialogue();
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
    box.innerHTML = "💡 Useful phrases:<br/>" + d.hintPhrases.map(p => `• ${escapeHtml(p)}`).join("<br/>");
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

  // ---------- Init ----------
  function init() {
    Auto.load();
    syncAuto();
    setVoice("en-US");

    // Mark loaded
    if(JS_STATUS) JS_STATUS.textContent = "JS: ✅ loaded";
    // Discover
    Fav.load();
    renderFavCount();
    renderDestinations();
    safeOn("#destFilter","change", () => renderDestinations());
    safeOn("#btnDestReset","click", () => { if(confirm("Clear favorites?")) { Fav.clear(); renderFavCount(); renderDestinations(); } });

    const readAPI = makeMCQ($("#readCheckHost"), READ_CHECK, "read");
    safeOn("#btnReadReset","click", () => readAPI.reset());

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

    // Packing
    renderPacking(false);
    setupPackingDnD();
    safeOn("#btnPackShuffle","click", () => { resetPackingZones(); renderPacking(true); });
    safeOn("#btnPackReset","click", () => { resetPackingZones(); });
    safeOn("#btnPackCheck","click", () => checkPacking());

    // Grammar
    renderLesson("#grammarLesson", GRAMMAR_LINES);
    const gramMCQAPI = makeMCQ($("#gramMCQHost"), GRAM_MCQ, "gram");
    const gramFillAPI = buildFill($("#gramFillHost"), GRAM_FILL, "gramFill");
    safeOn("#btnGrammarReset","click", () => { gramMCQAPI.reset(); gramFillAPI.reset(); });
    safeOn("#btnGrammarSpeak","click", () => Speech.say(GRAMMAR_SUMMARY));

    // Itinerary
    renderItSelects();
    safeOn("#btnItBuild","click", () => {
      const out=$("#itOutput");
      if(!out) return;
      out.value = buildItineraryText();
      renderChecklist(out.value);
    });
    safeOn("#btnItHint","click", () => {
      const fb=$("#itFb");
      if(!fb) return;
      fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
      fb.innerHTML="💡 Include: going to + month + because/however + comparison + a polite request.";
    });
    safeOn("#btnItCheck","click", () => {
      const out=$("#itOutput"); const fb=$("#itFb");
      if(!out||!fb) return;
      const okAll=renderChecklist(out.value||"");
      fb.classList.remove("hidden","ok","no");
      if(okAll) { fb.classList.add("ok"); fb.textContent="✅ Great plan!"; Score.award("itinerary:complete", 6); }
      else { fb.classList.add("no"); fb.textContent="❌ Not yet. Add the missing parts (see checklist)."; }
    });
    safeOn("#btnItSpeak","click", () => Speech.say(($("#itOutput")?.value || "").replaceAll("\n"," ")));
    safeOn("#btnItCopy","click", async () => { try{ await navigator.clipboard.writeText($("#itOutput")?.value || ""); }catch(e){} });
    safeOn("#btnItReset","click", () => {
      $("#itOutput") && ($("#itOutput").value="");
      $("#itChecklist") && ($("#itChecklist").innerHTML="");
      $("#itFb") && ($("#itFb").classList.add("hidden"));
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

    // Listening + Mini
    const listenAPI = makeMCQ($("#listenHost"), LISTEN, "listen");
    const miniAPI = makeMCQ($("#miniHost"), MINI, "mini");
    safeOn("#btnListenReset","click", () => listenAPI.reset());
    safeOn("#btnMiniReset","click", () => miniAPI.reset());

    // Reset all
    safeOn("#btnResetAll","click", () => {
      if(!confirm("Reset ALL activities and score?")) return;
      Speech.stop();
      Score.reset();

      // Discover
      $("#destFilter").value="all";
      renderDestinations();
      readAPI.reset();

      // Vocab
      $("#vocabSet").value="planning";
      renderFlashcards(false);
      buildVocabQuiz();

      // Packing
      resetPackingZones();
      renderPacking(false);
      $("#packFb").classList.add("hidden");

      // Grammar
      gramMCQAPI.reset();
      gramFillAPI.reset();

      // Itinerary
      $("#itOutput").value="";
      $("#itChecklist").innerHTML="";
      $("#itFb").classList.add("hidden");

      // Dialogues
      dlgState.key=DIALOGUES[0].key;
      $("#dlgSelect").value=dlgState.key;
      setDlgTitle();
      clearChat();
      setPracticeRole("b");

      // Listening
      listenAPI.reset();
      miniAPI.reset();

      $("#top")?.scrollIntoView({behavior:"smooth"});
    });

    // Score max estimate
    const max =
      (READ_CHECK.length) +
      12 + // vocab variable awards (approx)
      6 + 1 + // packing
      GRAM_MCQ.length +
      GRAM_FILL.length +
      6 + // itinerary complete
      LISTEN.length +
      MINI.length +
      12; // destination missions possible (approx)
    Score.setMax(max);
  }

  init();
})();
