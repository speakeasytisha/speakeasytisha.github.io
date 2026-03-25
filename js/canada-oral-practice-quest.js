/* SpeakEasyTisha — Canada Oral Practice Quest
   Build: 20260324-122314
*/
(() => {
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  const JS_STATUS = $("#jsStatus");
  const DEBUG = $("#debugBox");
  function logDebug(msg){
    try {
      if(!DEBUG) return;
      DEBUG.classList.remove("hidden");
      DEBUG.textContent += `\n${msg}`;
    } catch(e) {}
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
      .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
      .replaceAll('"',"&quot;").replaceAll("'","&#039;");
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
    for(let i=a.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function attachTap(el, handler){
    if(!el) return;
    const h=(e)=>{ try{ handler(e); }catch(err){ console.error(err); logDebug("handler error: " + String(err)); } };
    el.addEventListener("click", h);
    el.addEventListener("pointerup", h);
    el.addEventListener("touchend", h, {passive:true});
  }
  function safeOn(sel, evt, handler){
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
    key:"copq_autoAudio",
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

  const SCENARIOS = [
    {
      key:"hotel_smalltalk",
      title:"🏨 Hotel lobby small talk + help",
      level:"A1+",
      goal:"Introduce yourself, make small talk, and ask a simple question at the hotel.",
      context:[
        {ico:"👋", t:"You meet a staff member in the hotel lobby."},
        {ico:"🪪", t:"You present yourself (name, nationality, where you live)."},
        {ico:"❓", t:"You ask a simple question (breakfast time / directions / Wi‑Fi)."},
      ],
      guide:[
        {q:"Teacher asks:", a:"Learner can answer:"},
        {q:"“Hi! Where are you from?”", a:"“I’m from France. I’m French.”"},
        {q:"“What do you do for work?”", a:"“I work in administration.” (or “I work in …”)"},
        {q:"“How long are you staying?”", a:"“We are staying for one week.”"},
        {q:"“Can I help you?”", a:"“Yes, please. What time is breakfast?”"},
      ],
      phrases:["Hi, I’m…","I’m from…","I live in…","I work in…","We are staying for…","What time is…?","Could you help me, please?"],
      roleplay:[
        {who:"Staff", side:"a", say:"Hello! Welcome. How can I help you?"},
        {who:"Learner", side:"b", say:"(Your turn)", model:"Hi. Could you help me, please?"},
        {who:"Staff", side:"a", say:"Of course. What is your name?"},
        {who:"Learner", side:"b", say:"(Your turn)", model:"My name is Alex."},
        {who:"Staff", side:"a", say:"Nice to meet you. Where are you from?"},
        {who:"Learner", side:"b", say:"(Your turn)", model:"I’m from France. I’m French."},
        {who:"Staff", side:"a", say:"Great. Enjoy your stay!"},
        {who:"Learner", side:"b", say:"(Your turn)", model:"Thank you very much."},
      ],
      drills:[
        {set:"smalltalk", say:"Where are you from?", prompt:"Choose the best reply.", choices:["I’m from France.","I from France.","From France I am."], answer:0, hint:"Use: I’m from + country."},
        {set:"hotel", say:"What time is breakfast?", prompt:"Choose the best reply.", choices:["Breakfast is from 7 to 10.","Turn left at the bank.","Two tickets, please."], answer:0, hint:"Time answer."},
      ],
      buildTasks:[
        {key:"b1", title:"Ask about breakfast time", target:"What time is breakfast, please?",
          tokens:["What","time","is","breakfast,","please?"]},
        {key:"b2", title:"Present yourself", target:"I’m from France. I live near Paris.",
          tokens:["I’m","from","France.","I","live","near","Paris."]},
      ]
    },
    {
      key:"museum_tickets",
      title:"🏛️ Museum tickets (city day)",
      level:"A1+",
      goal:"Buy tickets and ask about opening hours politely.",
      context:[
        {ico:"🎫", t:"You buy two tickets at the museum."},
        {ico:"🕒", t:"You ask the opening hours."},
        {ico:"💳", t:"You ask if you can pay by card."},
      ],
      guide:[
        {q:"Teacher asks:", a:"Learner can answer:"},
        {q:"“How many tickets?”", a:"“Two tickets, please.”"},
        {q:"“What would you like?”", a:"“I’d like two tickets, please.”"},
        {q:"“Any questions?”", a:"“What are the opening hours?”"},
        {q:"“Cash or card?”", a:"“Can I pay by card?”"},
      ],
      phrases:["Two tickets, please.","I’d like…","What are the opening hours?","Can I pay by card?","Thank you."],
      roleplay:[
        {who:"Staff", side:"a", say:"Hello! How can I help you?"},
        {who:"Learner", side:"b", say:"(Your turn)", model:"Hi. I’d like two tickets, please."},
        {who:"Staff", side:"a", say:"Of course. Any questions?"},
        {who:"Learner", side:"b", say:"(Your turn)", model:"Yes. What are the opening hours?"},
        {who:"Staff", side:"a", say:"We are open from 10 am to 6 pm."},
        {who:"Learner", side:"b", say:"(Your turn)", model:"Perfect. Can I pay by card?"},
      ],
      drills:[
        {set:"tickets", say:"Two tickets, please.", prompt:"Choose the best reply.", choices:["Of course. That’s 20 dollars.","Go straight.","It’s sunny."], answer:0, hint:"Ticket reply = price."},
        {set:"tickets", say:"What are the opening hours?", prompt:"Choose the best reply.", choices:["We are open from 10 am to 6 pm.","Turn left at the corner.","There are mountains."], answer:0, hint:"Hours = time."},
      ],
      buildTasks:[
        {key:"b1", title:"Buy tickets politely", target:"I’d like two tickets, please.",
          tokens:["I’d","like","two","tickets,","please."]},
        {key:"b2", title:"Ask about hours", target:"What are the opening hours?",
          tokens:["What","are","the","opening","hours?"]},
      ]
    },
    {
      key:"directions_city",
      title:"🧭 Ask directions downtown",
      level:"A1+",
      goal:"Ask for directions and understand simple steps.",
      context:[
        {ico:"📍", t:"You want a restaurant downtown."},
        {ico:"⬆️", t:"You hear simple directions (go straight / turn left)."},
        {ico:"🧭", t:"You use prepositions (next to / across from)."},
      ],
      guide:[
        {q:"Teacher asks:", a:"Learner can answer:"},
        {q:"“Can I help you?”", a:"“Yes, please. How do I get to…?”"},
        {q:"“Any questions?”", a:"“Could you repeat, please?” / “More slowly, please.”"},
      ],
      phrases:["Where is…?","How do I get to…?","Go straight.","Turn left/right.","It’s next to…","across from…","Could you repeat, please?"],
      roleplay:[
        {who:"Local", side:"a", say:"Hello. Can I help you?"},
        {who:"Learner", side:"b", say:"(Your turn)", model:"Yes, please. How do I get to a good restaurant downtown?"},
        {who:"Local", side:"a", say:"Go straight and turn right at the corner."},
        {who:"Learner", side:"b", say:"(Your turn)", model:"Thank you. Could you repeat, please?"},
        {who:"Local", side:"a", say:"Go straight. Then turn right."},
        {who:"Learner", side:"b", say:"(Your turn)", model:"Thank you very much."},
      ],
      drills:[
        {set:"directions", say:"How do I get to the restaurant?", prompt:"Choose the best reply.", choices:["Go straight and turn left.","Two tickets, please.","It starts at 10 am."], answer:0, hint:"Directions use go/turn."},
        {set:"directions", say:"Could you repeat, please?", prompt:"Choose the best reply.", choices:["Of course. Go straight, then turn right.","It is sunny today.","That’s 20 dollars."], answer:0, hint:"Repeat → say again."},
      ],
      buildTasks:[
        {key:"b1", title:"Build directions", target:"Go straight and turn left at the corner.",
          tokens:["Go","straight","and","turn","left","at","the","corner."]},
        {key:"b2", title:"Build location", target:"The café is next to the hotel.",
          tokens:["The","café","is","next","to","the","hotel."]},
      ]
    },
    {
      key:"transit_ticket",
      title:"🚇 Transit: buy a ticket + times",
      level:"A1+",
      goal:"Buy a transit ticket and ask about the next train time.",
      context:[
        {ico:"🎫", t:"You need a ticket."},
        {ico:"⏰", t:"You ask: “When is the next train?”"},
        {ico:"🔁", t:"You ask for repetition if needed."},
      ],
      guide:[
        {q:"Teacher asks:", a:"Learner can answer:"},
        {q:"“Where are you going?”", a:"“Downtown, please.”"},
        {q:"“One ticket?”", a:"“Yes. One ticket, please.”"},
        {q:"“Any questions?”", a:"“When is the next train?”"},
      ],
      phrases:["One ticket, please.","Downtown, please.","When is the next train?","Can I pay by card?","More slowly, please."],
      roleplay:[
        {who:"Staff", side:"a", say:"Hello. Where are you going?"},
        {who:"Learner", side:"b", say:"(Your turn)", model:"Downtown, please."},
        {who:"Staff", side:"a", say:"One ticket?"},
        {who:"Learner", side:"b", say:"(Your turn)", model:"Yes. One ticket, please."},
        {who:"Staff", side:"a", say:"The next train is in 5 minutes."},
        {who:"Learner", side:"b", say:"(Your turn)", model:"Great. Thank you very much."},
      ],
      drills:[
        {set:"transit", say:"Where are you going?", prompt:"Choose the best reply.", choices:["Downtown, please.","Two tickets, please.","Go straight."], answer:0, hint:"Destination reply."},
        {set:"transit", say:"When is the next train?", prompt:"Choose the best reply.", choices:["In five minutes.","Across from the park.","It’s 20 dollars."], answer:0, hint:"Time answer."},
      ],
      buildTasks:[
        {key:"b1", title:"Buy a ticket", target:"One ticket, please.",
          tokens:["One","ticket,","please."]},
        {key:"b2", title:"Ask about next train", target:"When is the next train?",
          tokens:["When","is","the","next","train?"]},
      ]
    },
    {
      key:"tour_hike",
      title:"🏔️ Tour + easy hike + safety",
      level:"A1+",
      goal:"Book a tour, ask the meeting point, and use simple safety language.",
      context:[
        {ico:"🎟️", t:"You book a scenic tour."},
        {ico:"📍", t:"You ask the meeting point."},
        {ico:"🧯", t:"You follow safety rules (stay on the path, water)."},
      ],
      guide:[
        {q:"Teacher asks:", a:"Learner can answer:"},
        {q:"“What would you like?”", a:"“I’d like to book a tour, please.”"},
        {q:"“Any questions?”", a:"“What is the meeting point?”"},
        {q:"“Do you need anything?”", a:"“Yes. We need water.”"},
      ],
      phrases:["I’d like to book a tour, please.","What is the meeting point?","Is it safe today?","We need water.","We will stay on the path."],
      roleplay:[
        {who:"Staff", side:"a", say:"Hello. How can I help you?"},
        {who:"Learner", side:"b", say:"(Your turn)", model:"Hi. I’d like to book a scenic tour, please."},
        {who:"Staff", side:"a", say:"Certainly. It starts at 10 am."},
        {who:"Learner", side:"b", say:"(Your turn)", model:"Great. What is the meeting point?"},
        {who:"Staff", side:"a", say:"The meeting point is at the visitor center."},
        {who:"Learner", side:"b", say:"(Your turn)", model:"Thank you. Is it safe today?"},
      ],
      drills:[
        {set:"nature", say:"What is the meeting point?", prompt:"Choose the best reply.", choices:["At the visitor center.","Turn left at the corner.","Two tickets, please."], answer:0, hint:"Meeting point = place."},
        {set:"nature", say:"Is it safe today?", prompt:"Choose the best reply.", choices:["Yes, but stay on the path.","It is 20 dollars.","Downtown, please."], answer:0, hint:"Safety advice."},
      ],
      buildTasks:[
        {key:"b1", title:"Ask meeting point", target:"What is the meeting point?",
          tokens:["What","is","the","meeting","point?"]},
        {key:"b2", title:"Safety sentence", target:"We will stay on the path.",
          tokens:["We","will","stay","on","the","path."]},
      ]
    },
  ];

  const DRILL_SETS = [
    {key:"smalltalk", label:"👋 Small talk"},
    {key:"hotel", label:"🏨 Hotel help"},
    {key:"tickets", label:"🎫 Tickets"},
    {key:"directions", label:"🧭 Directions"},
    {key:"transit", label:"🚇 Transit"},
    {key:"nature", label:"🏔️ Nature + safety"},
  ];

  const ALL_DRILLS = (() => {
    const out=[];
    SCENARIOS.forEach(s => (s.drills||[]).forEach(d => out.push({...d, sid:s.key})));
    return out;
  })();

  const ALL_TASKS = (() => {
    const out=[];
    SCENARIOS.forEach(s => (s.buildTasks||[]).forEach(t => out.push({...t, sid:s.key, scenarioTitle:s.title})));
    return out;
  })();

  let state = {
    scenario: SCENARIOS[0],
    rpIndex: 0,
    timerEnabled: false,
    role: "teacher",
    prepTimer: null,
    speakTimer: null
  };

  function currentScenario() { return state.scenario; }

  function renderScenarioSelect() {
    const sel=$("#scenarioSelect"); if(!sel) return;
    sel.innerHTML="";
    SCENARIOS.forEach(s => {
      const o=document.createElement("option");
      o.value=s.key; o.textContent=s.title;
      sel.appendChild(o);
    });
    sel.value=SCENARIOS[0].key;
  }

  function renderScenario() {
    const s=currentScenario();
    $("#scTitle").textContent=s.title;
    $("#scLevel").textContent=s.level || "A1+";

    const info=$("#scInfo");
    info.innerHTML="";
    const goal=document.createElement("div");
    goal.className="line";
    goal.innerHTML=`<div class="ico">🎯</div><div><strong>Goal:</strong> ${escapeHtml(s.goal)}</div>`;
    info.appendChild(goal);
    (s.context||[]).forEach(x => {
      const row=document.createElement("div");
      row.className="line";
      row.innerHTML=`<div class="ico">${x.ico}</div><div>${escapeHtml(x.t)}</div>`;
      info.appendChild(row);
    });

    const guide=$("#scGuide");
    guide.innerHTML="";
    (s.guide||[]).forEach((g, i) => {
      const row=document.createElement("div");
      row.className="line";
      row.innerHTML=`<div class="ico">${i===0 ? "🗣️" : "💬"}</div><div><strong>${escapeHtml(g.q)}</strong><br/><span class="muted">${escapeHtml(g.a)}</span></div>`;
      guide.appendChild(row);
    });

    clearRoleplay();
    $("#rpTitle").textContent = "Role‑play: " + s.title;
    renderBuildTaskSelect();
  }

  function clearRoleplay() {
    const stream=$("#rpStream");
    if(stream) stream.innerHTML="";
    state.rpIndex=0;
    $("#modelBox").textContent="Click “Show model reply” when needed.";
    $("#rpHintBox").classList.add("hidden");
  }

  function stopTimers() {
    if(state.prepTimer) { clearInterval(state.prepTimer); state.prepTimer=null; }
    if(state.speakTimer) { clearInterval(state.speakTimer); state.speakTimer=null; }
  }

  function startPrepTimer(seconds) {
    stopTimers();
    let t=seconds;
    $("#prepTime").textContent=String(t);
    state.prepTimer=setInterval(() => {
      t--;
      $("#prepTime").textContent=String(Math.max(0,t));
      if(t<=0) {
        clearInterval(state.prepTimer); state.prepTimer=null;
        if(state.timerEnabled) startSpeakTimer(30);
      }
    }, 1000);
  }
  function startSpeakTimer(seconds) {
    if(state.speakTimer) { clearInterval(state.speakTimer); state.speakTimer=null; }
    let t=seconds;
    $("#speakTime").textContent=String(t);
    state.speakTimer=setInterval(() => {
      t--;
      $("#speakTime").textContent=String(Math.max(0,t));
      if(t<=0) {
        clearInterval(state.speakTimer); state.speakTimer=null;
      }
    }, 1000);
  }

  function addBubble(line) {
    const stream=$("#rpStream"); if(!stream) return;
    const b=document.createElement("div");
    b.className="bubble " + (line.side==="a" ? "a" : "b");
    const whoIcon = line.side==="a" ? "🟦" : "🟩";
    b.innerHTML = `
      <div class="who">${whoIcon} ${escapeHtml(line.who)}</div>
      <div class="txt">${escapeHtml(line.say)}</div>
      <div class="tools">
        <button class="toolmini" type="button">🔊</button>
        <button class="toolmini" type="button">↺ Repeat</button>
      </div>
    `;
    const tools=$$(".toolmini", b);
    attachTap(tools[0], (e)=>{ e.stopPropagation(); if(line.say && line.say!=="(Your turn)") Speech.say(line.say); });
    attachTap(tools[1], (e)=>{ e.stopPropagation(); if(line.say && line.say!=="(Your turn)") Speech.say(line.say); });
    stream.appendChild(b);
    stream.scrollTop=stream.scrollHeight;

    const shouldAuto = Auto.enabled && (
      (state.role==="teacher" && line.side==="a") ||
      (state.role==="learner" && line.side==="b")
    );
    if(shouldAuto && line.say && line.say!=="(Your turn)") Speech.say(line.say);
  }

  function stepRoleplay() {
    const s=currentScenario();
    const lines=s.roleplay||[];
    if(state.rpIndex >= lines.length) return false;
    const line=lines[state.rpIndex];
    addBubble(line);

    if(line.side==="b") {
      $("#modelBox").textContent = line.model ? line.model : "—";
      if(state.timerEnabled) startPrepTimer(15);
    } else {
      $("#modelBox").textContent = "Click “Show model reply” when needed.";
    }

    state.rpIndex++;
    return true;
  }

  function playRoleplay() {
    clearRoleplay();
    stepRoleplay();
  }

  function showModelReply() {
    const s=currentScenario();
    const idx=Math.max(0, state.rpIndex-1);
    for(let i=idx;i>=0;i--) {
      const l=(s.roleplay||[])[i];
      if(l && l.side==="b") {
        $("#modelBox").textContent = l.model || "—";
        if(l.model) Speech.say(l.model);
        Score.award("rp:model:"+s.key+":"+i, 1);
        return;
      }
    }
  }

  function showRoleplayHints() {
    const s=currentScenario();
    const box=$("#rpHintBox"); if(!box) return;
    box.classList.remove("hidden","ok","no"); box.classList.add("ok");
    box.innerHTML="💡 Useful phrases:<br/>" + (s.phrases||[]).map(p => "• " + escapeHtml(p)).join("<br/>");
  }

  function listenAllRoleplay() {
    const s=currentScenario();
    const txt=(s.roleplay||[]).map(l => (l.say==="(Your turn)" && l.model) ? l.model : (l.say==="(Your turn)" ? "" : l.say)).join(" ");
    Speech.say(txt);
  }

  function renderDrillSetSelect() {
    const sel=$("#drillSet"); if(!sel) return;
    sel.innerHTML="";
    DRILL_SETS.forEach(s => {
      const o=document.createElement("option");
      o.value=s.key; o.textContent=s.label;
      sel.appendChild(o);
    });
    sel.value="smalltalk";
  }

  let drillState={ item:null };
  function pickDrill() {
    const set=$("#drillSet")?.value || "smalltalk";
    const pool=ALL_DRILLS.filter(d => d.set===set);
    if(pool.length===0) return null;
    return pool[Math.floor(Math.random()*pool.length)];
  }

  function buildDrill() {
    const host=$("#drillHost"); if(!host) return;
    const it=pickDrill();
    drillState.item=it;
    if(!it) {
      host.innerHTML="<p class='muted'>No drills in this set yet.</p>";
      return;
    }
    host.innerHTML=`
      <div class="line">
        <div class="ico">🎯</div>
        <div>
          <div style="font-weight:1100;">${escapeHtml(it.prompt)}</div>
          <div class="muted"><strong>Prompt:</strong> “${escapeHtml(it.say)}”</div>
        </div>
      </div>
      <div class="smallrow" style="margin-top:.55rem;">
        <button class="iconbtn" type="button" id="btnDrillPlay">🔊 Listen</button>
        <button class="hintbtn" type="button" id="btnDrillHint">💡 Hint</button>
      </div>
      <div class="choices" id="drillChoices"></div>
      <div class="feedback hidden" id="drillFb"></div>
    `;
    const fb=$("#drillFb");
    attachTap($("#btnDrillPlay"), () => Speech.say(it.say));
    attachTap($("#btnDrillHint"), () => {
      fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
      fb.innerHTML=`💡 <strong>Hint:</strong> ${escapeHtml(it.hint||"")}`;
    });

    const choices=$("#drillChoices");
    it.choices.forEach((c, i) => {
      const row=document.createElement("label");
      row.className="choice";
      row.innerHTML=`<input type="radio" name="drill"/><div>${escapeHtml(c)}</div>`;
      attachTap(row, () => {
        const ok=(i===it.answer);
        fb.classList.remove("hidden","ok","no");
        fb.classList.add(ok ? "ok":"no");
        fb.innerHTML = ok ? "✅ Correct!" : `❌ Not quite. Best: <strong>${escapeHtml(it.choices[it.answer])}</strong>`;
        if(ok) Score.award(`drill:${it.set}:${it.sid}:${it.say}`, 1);
      });
      choices.appendChild(row);
    });
  }

  // Builder
  function makeToken(text) {
    const t=document.createElement("div");
    t.className="token";
    t.textContent=text;
    t.draggable=true;
    t.addEventListener("dragstart", () => { window.__dragToken=t; });
    return t;
  }

  function buildWordOrder(host, task) {
    if(!host) return { reset(){}, getBuilt(){return "";}, clear(){} };
    host.innerHTML="";
    const bank=document.createElement("div");
    bank.className="bank";
    const zone=document.createElement("div");
    zone.className="dropzone";
    const wrap=document.createElement("div");
    wrap.className="builder";
    wrap.appendChild(bank);
    wrap.appendChild(zone);
    host.appendChild(wrap);

    const idMap=new Map();
    const toks=shuffle(task.tokens).map((txt, iTok) => {
      const t=makeToken(txt);
      t.dataset.role="bank";
      t.dataset.tid=`${task.key}-t${iTok}`;
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
        t.classList.add("is-used");
        t.draggable=false;
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

        if(cont===bank && dragged.dataset.role==="zone") {
          const sid=dragged.dataset.sourceTid;
          dragged.remove();
          const orig=idMap.get(sid);
          if(orig) { orig.classList.remove("is-used"); orig.draggable=true; }
          return;
        }
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
          dragged.classList.add("is-used");
          dragged.draggable=false;
          return;
        }
        if(cont===zone && dragged.dataset.role==="zone") {
          if(targetTok && targetTok.parentElement===zone && targetTok!==dragged) zone.insertBefore(dragged, targetTok);
          else zone.appendChild(dragged);
        }
      });
    });

    function clear() {
      $$(".token", zone).forEach(z => {
        const sid=z.dataset.sourceTid;
        z.remove();
        const orig=idMap.get(sid);
        if(orig) { orig.classList.remove("is-used"); orig.draggable=true; }
      });
      $$(".token", bank).forEach(b => { b.classList.remove("is-used"); b.draggable=true; });
    }

    return {
      getBuilt() {
        return $$(".token", zone).map(t => t.textContent.trim()).join(" ")
          .replace(/\s+/g," ").trim().replace(/\s+([,?.!])/g,"$1");
      },
      clear,
      reset: clear
    };
  }

  let buildAPI=null;
  function renderBuildTaskSelect() {
    const sel=$("#buildTask"); if(!sel) return;
    const s=currentScenario();
    const tasks=ALL_TASKS.filter(t => t.sid===s.key);
    sel.innerHTML="";
    tasks.forEach((t, idx) => {
      const o=document.createElement("option");
      o.value=t.key;
      o.textContent = `${idx+1}) ${t.title}`;
      sel.appendChild(o);
    });
    if(tasks.length===0) {
      const o=document.createElement("option");
      o.value=""; o.textContent="No tasks";
      sel.appendChild(o);
    }
    sel.value = tasks[0]?.key || "";
    initBuilder();
  }

  function selectedTask() {
    const s=currentScenario();
    const key=$("#buildTask")?.value || "";
    return ALL_TASKS.find(t => t.sid===s.key && t.key===key) || null;
  }

  function initBuilder() {
    const host=$("#builderHost");
    const fb=$("#buildFb");
    if(fb) fb.classList.add("hidden");
    const task=selectedTask();
    if(!task) {
      if(host) host.innerHTML="<p class='muted'>No builder tasks in this scenario.</p>";
      buildAPI=null;
      return;
    }
    buildAPI=buildWordOrder(host, task);
  }

  function checkBuilder() {
    const fb=$("#buildFb"); if(!fb) return;
    const task=selectedTask(); if(!task || !buildAPI) return;
    const built=buildAPI.getBuilt();
    const ok=normalize(built)===normalize(task.target);
    fb.classList.remove("hidden","ok","no");
    fb.classList.add(ok ? "ok":"no");
    fb.innerHTML = ok
      ? `✅ Correct! Now say it aloud: <strong>${escapeHtml(task.target)}</strong>`
      : `❌ Not yet. You wrote: “${escapeHtml(built || "—")}”<br/>💡 Tip: tap tokens in order.`;
    if(ok) Score.award(`build:${task.sid}:${task.key}`, 2);
  }

  function resetAll() {
    Speech.stop();
    Score.reset();
    stopTimers();
    Auto.enabled=false;
    Auto.save();
    syncAuto();
    setVoice("en-US");

    $("#scenarioSelect").value=SCENARIOS[0].key;
    state.scenario=SCENARIOS[0];
    renderScenario();

    $("#drillSet").value="smalltalk";
    buildDrill();

    $("#top")?.scrollIntoView({behavior:"smooth"});
  }

  function init() {
    Auto.load();
    syncAuto();
    setVoice("en-US");

    if(JS_STATUS) JS_STATUS.textContent="JS: ✅ loaded";

    safeOn("#voiceUS","click", () => setVoice("en-US"));
    safeOn("#voiceUK","click", () => setVoice("en-GB"));
    safeOn("#autoOff","click", () => setAuto(false));
    safeOn("#autoOn","click", () => setAuto(true));
    safeOn("#btnPause","click", () => Speech.pause());
    safeOn("#btnResume","click", () => Speech.resume());
    safeOn("#btnStop","click", () => Speech.stop());
    safeOn("#btnStart","click", () => $("#sec1")?.scrollIntoView({behavior:"smooth"}));
    safeOn("#btnHow","click", () => {
      alert("How to use (teacher + learner):\n\n1) Choose a scenario.\n2) Teacher reads the blue lines; learner answers the green lines.\n3) Use 'Show model reply' only when needed.\n4) Do quick drills and builder tasks for extra practice.\n\nNo slang — polite + normal.");
    });

    renderScenarioSelect();
    state.scenario=SCENARIOS[0];
    renderScenario();

    safeOn("#scenarioSelect","change", (e) => {
      const key=e.target.value;
      const sc=SCENARIOS.find(s => s.key===key) || SCENARIOS[0];
      state.scenario=sc;
      renderScenario();
      buildDrill();
    });
    safeOn("#btnScenarioSpeak","click", () => Speech.say(currentScenario().goal));
    safeOn("#btnGuideSpeak","click", () => {
      const s=currentScenario();
      Speech.say(s.guide?.slice(1).map(x => `${x.q} ${x.a}`).join(" ") || s.goal);
    });
    safeOn("#btnScenarioReset","click", () => renderScenario());

    safeOn("#roleTeacher","click", () => {
      state.role="teacher";
      $("#roleTeacher").classList.add("is-on"); $("#roleLearner").classList.remove("is-on");
      $("#roleTeacher").setAttribute("aria-pressed","true"); $("#roleLearner").setAttribute("aria-pressed","false");
    });
    safeOn("#roleLearner","click", () => {
      state.role="learner";
      $("#roleLearner").classList.add("is-on"); $("#roleTeacher").classList.remove("is-on");
      $("#roleLearner").setAttribute("aria-pressed","true"); $("#roleTeacher").setAttribute("aria-pressed","false");
    });
    safeOn("#timerOff","click", () => {
      state.timerEnabled=false;
      $("#timerOff").classList.add("is-on"); $("#timerOn").classList.remove("is-on");
      $("#timerOff").setAttribute("aria-pressed","true"); $("#timerOn").setAttribute("aria-pressed","false");
      stopTimers();
    });
    safeOn("#timerOn","click", () => {
      state.timerEnabled=true;
      $("#timerOn").classList.add("is-on"); $("#timerOff").classList.remove("is-on");
      $("#timerOn").setAttribute("aria-pressed","true"); $("#timerOff").setAttribute("aria-pressed","false");
    });

    safeOn("#btnRPStart","click", () => playRoleplay());
    safeOn("#btnRPStep","click", () => stepRoleplay());
    safeOn("#btnRPClear","click", () => clearRoleplay());
    safeOn("#btnRPModel","click", () => showModelReply());
    safeOn("#btnRPHint","click", () => showRoleplayHints());
    safeOn("#btnRPListenAll","click", () => listenAllRoleplay());
    safeOn("#btnPrep","click", () => startPrepTimer(15));
    safeOn("#btnSpeakTimer","click", () => startSpeakTimer(30));

    renderDrillSetSelect();
    buildDrill();
    safeOn("#btnNewDrill","click", () => buildDrill());
    safeOn("#btnDrillReset","click", () => buildDrill());
    safeOn("#btnDrillSpeak","click", () => { if(drillState.item) Speech.say(drillState.item.say); });
    safeOn("#drillSet","change", () => buildDrill());

    safeOn("#buildTask","change", () => initBuilder());
    safeOn("#btnBuildReset","click", () => initBuilder());
    safeOn("#btnBuildCheck","click", () => checkBuilder());
    safeOn("#btnBuildSpeakModel","click", () => {
      const task=selectedTask();
      if(task) Speech.say(task.target);
    });

    safeOn("#btnResetAll","click", () => {
      if(!confirm("Reset ALL activities and score?")) return;
      resetAll();
    });

    Score.setMax(40);
  }

  init();
})();
