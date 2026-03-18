/* SpeakEasyTisha — Canada City + Nature Quest
   Build: 20260318-095425
*/
(() => {
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  const JS_STATUS = $("#jsStatus");
  const DEBUG = $("#debugBox");
  function logDebug(msg){ try{ if(!DEBUG) return; DEBUG.classList.remove("hidden"); DEBUG.textContent += `\n${msg}`; }catch(e){} }
  window.addEventListener("error", (e) => {
    if(JS_STATUS) JS_STATUS.textContent = "JS: ❌ error";
    logDebug(`[Error] ${e.message} @ ${e.filename}:${e.lineno}`);
  });
  window.addEventListener("unhandledrejection", (e) => {
    if(JS_STATUS) JS_STATUS.textContent = "JS: ❌ promise";
    logDebug(`[Promise] ${String(e.reason)}`);
  });

  function escapeHtml(s){ return String(s ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
  function normalize(s){ return String(s ?? "").replace(/[’']/g,"'").replace(/\s+/g," ").trim().toLowerCase(); }
  function shuffle(arr){ const a=(arr||[]).slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  function attachTap(el, handler){ if(!el) return; const h=(e)=>{ try{ handler(e); }catch(err){ console.error(err); } }; el.addEventListener("click",h); el.addEventListener("pointerup",h); el.addEventListener("touchend",h,{passive:true}); }
  function safeOn(sel, evt, handler){ const el=$(sel); if(!el) return; el.addEventListener(evt, handler); }

  // Speech
  const Speech = {
    mode:"en-US",
    rate:0.97,
    getVoices(){ try{ return window.speechSynthesis?.getVoices?.() || []; }catch(e){ return []; } },
    pickVoice(){ const v=this.getVoices(); const lang=this.mode.toLowerCase(); let best=v.find(x => (x.lang||"").toLowerCase()===lang); if(!best) best=v.find(x => (x.lang||"").toLowerCase().startsWith(lang)); if(!best) best=v.find(x => (x.lang||"").toLowerCase().startsWith("en")); return best||null; },
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

  const Auto={ key:"ccnq_auto", enabled:false, load(){ this.enabled=(localStorage.getItem(this.key)==="1"); }, save(){ localStorage.setItem(this.key,this.enabled?"1":"0"); } };
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
  safeOn("#btnHow","click", () => alert("Use City Day + Nature Day. Practice tickets, directions, tours, and safety. No slang. Auto audio OFF by default."));

  // Score
  const Score={ now:0, max:0, awarded:new Set(),
    setMax(n){ this.max=n; updScore(); updProgress(); },
    award(key, pts=1){ if(this.awarded.has(key)) return; this.awarded.add(key); this.now += pts; updScore(); updProgress(); },
    reset(){ this.now=0; this.awarded.clear(); updScore(); updProgress(); }
  };
  function updScore(){ $("#scoreNow") && ($("#scoreNow").textContent=String(Score.now)); $("#scoreMax") && ($("#scoreMax").textContent=String(Score.max)); }
  function updProgress(){ const bar=$("#progressBar"); if(!bar) return; const pct=Score.max ? Math.round((Score.now/Score.max)*100) : 0; bar.style.width=`${Math.max(0,Math.min(100,pct))}%`; }

  // Data
  const CITY_READING=[
    {ico:"🏙️", t:"Today is a city day in Montréal. In the morning, they visit a museum in the old town."},
    {ico:"🎫", t:"They buy two tickets at the entrance. The staff explains the price and the opening hours."},
    {ico:"🧭", t:"After the museum, they ask for directions to a nice restaurant downtown."},
    {ico:"🍽️", t:"In the evening, they book a table for two. They order politely and ask for the check."},
    {ico:"✅", t:"It is a simple plan: museum → directions → restaurant. The day is cultural and relaxing."},
  ];
  const NATURE_READING=[
    {ico:"🏔️", t:"Today is a nature day near Banff. In the morning, they check the weather forecast."},
    {ico:"🚶", t:"They choose an easy hike with a lake viewpoint. They bring water, a light jacket, and sunscreen."},
    {ico:"🎟️", t:"They book a scenic tour for 10 am. The guide explains the meeting point and the time."},
    {ico:"🧯", t:"They follow safety rules: stay on the path, keep a safe distance from wildlife, and carry a phone."},
    {ico:"✅", t:"It is a safe plan: forecast → pack → tour → hike. The day is scenic and memorable."},
  ];
  const CITY_Q=[
    {key:"c1", prompt:"What do they visit in the morning?", choices:["A museum","A mountain","A lake"], answer:0, hint:"Old town + culture.", explain:"They visit a museum."},
    {key:"c2", prompt:"What do they ask for after the museum?", choices:["Directions to a restaurant","A hiking map","A tent"], answer:0, hint:"City day → directions.", explain:"They ask for directions."},
    {key:"c3", prompt:"How many people for the table?", choices:["Two","Three","Five"], answer:0, hint:"Table for two.", explain:"Two people."},
  ];
  const NATURE_Q=[
    {key:"n1", prompt:"What do they check first?", choices:["The weather forecast","The museum price","The metro line"], answer:0, hint:"Nature day starts with weather.", explain:"Forecast first."},
    {key:"n2", prompt:"What do they choose?", choices:["An easy hike","A nightclub","A shopping mall"], answer:0, hint:"Lake viewpoint.", explain:"Easy hike."},
    {key:"n3", prompt:"What time is the tour?", choices:["10 am","7 pm","5 am"], answer:0, hint:"It starts at 10.", explain:"10 am."},
  ];

  const VOCAB_SETS=[
    {key:"city", label:"🏙️ City vocabulary"},
    {key:"nature", label:"🏔️ Nature vocabulary"},
    {key:"tickets", label:"🎫 Tickets + times"},
    {key:"directions", label:"🧭 Directions + prepositions"},
    {key:"polite", label:"🙏 Polite requests (no slang)"},
  ];
  const VOCAB=[
    {set:"city", icon:"🏛️", word:"museum", fr:"musée", def:"place to see art/history", ex:"We are visiting a museum."},
    {set:"city", icon:"🏙️", word:"downtown", fr:"centre-ville", def:"city center", ex:"We are staying downtown."},
    {set:"city", icon:"🍽️", word:"reservation", fr:"réservation", def:"booking", ex:"I have a reservation for two."},
    {set:"city", icon:"🧾", word:"the check", fr:"l’addition", def:"bill at a restaurant", ex:"Could I have the check, please?"},
    {set:"city", icon:"🕒", word:"opening hours", fr:"horaires d’ouverture", def:"when a place is open", ex:"What are the opening hours?"},
    {set:"nature", icon:"🏔️", word:"mountains", fr:"montagnes", def:"high land", ex:"The mountains are beautiful."},
    {set:"nature", icon:"🏞️", word:"lake", fr:"lac", def:"large water area", ex:"We want to see a lake."},
    {set:"nature", icon:"🚶", word:"hike", fr:"randonnée", def:"walk in nature", ex:"We are doing an easy hike."},
    {set:"nature", icon:"🧴", word:"sunscreen", fr:"crème solaire", def:"sun protection", ex:"Don’t forget sunscreen."},
    {set:"nature", icon:"🦌", word:"wildlife", fr:"faune", def:"animals in nature", ex:"Keep a safe distance from wildlife."},
    {set:"tickets", icon:"🎫", word:"ticket", fr:"billet", def:"entry pass", ex:"Two tickets, please."},
    {set:"tickets", icon:"⏰", word:"at 10 am", fr:"à 10h", def:"time", ex:"It starts at 10 am."},
    {set:"tickets", icon:"📍", word:"meeting point", fr:"point de rendez-vous", def:"place to meet", ex:"What is the meeting point?"},
    {set:"tickets", icon:"💳", word:"pay by card", fr:"payer par carte", def:"use a bank card", ex:"Can I pay by card?"},
    {set:"tickets", icon:"📅", word:"available", fr:"disponible", def:"free / possible", ex:"Is it available on Friday?"},
    {set:"directions", icon:"🧭", word:"next to", fr:"à côté de", def:"beside", ex:"It is next to the bank."},
    {set:"directions", icon:"🪞", word:"across from", fr:"en face de", def:"opposite", ex:"It is across from the park."},
    {set:"directions", icon:"↔️", word:"between", fr:"entre", def:"in the middle of two places", ex:"It is between the café and the hotel."},
    {set:"directions", icon:"⬆️", word:"go straight", fr:"aller tout droit", def:"do not turn", ex:"Go straight for two minutes."},
    {set:"directions", icon:"⬅️", word:"turn left", fr:"tourner à gauche", def:"left turn", ex:"Turn left at the corner."},
    {set:"polite", icon:"🙏", word:"Could you…?", fr:"Pourriez-vous… ?", def:"polite request", ex:"Could you help me, please?"},
    {set:"polite", icon:"✅", word:"I’d like…", fr:"J’aimerais…", def:"polite want", ex:"I’d like two tickets, please."},
    {set:"polite", icon:"🔁", word:"Could you repeat?", fr:"Pouvez-vous répéter ?", def:"ask again", ex:"Could you repeat, please?"},
    {set:"polite", icon:"🐢", word:"more slowly", fr:"plus lentement", def:"slower", ex:"More slowly, please."},
    {set:"polite", icon:"🤝", word:"Thank you very much.", fr:"Merci beaucoup.", def:"polite thanks", ex:"Thank you very much."},
  ];

  const GRAMMAR_LINES=[
    {ico:"🧠", text:"There is / There are: There is a museum downtown. There are mountains near Banff."},
    {ico:"✅", text:"Affirmative: There is… / There are…"},
    {ico:"❌", text:"Negative: There isn’t… / There aren’t…"},
    {ico:"❓", text:"Question: Is there…? / Are there…? (Is there a tour today?)"},
    {ico:"📍", text:"Prepositions: next to, across from, between, near. (The café is next to the hotel.)"},
    {ico:"📈", text:"Comparatives: cheaper than / more scenic than. (Banff is more scenic than Ottawa.)"},
    {ico:"🙏", text:"Polite requests: Could I have…? Could you…? I’d like… (no slang)."},
  ];
  const GRAM_SUM="There is/are for places. Prepositions for directions. Comparatives for choices. Polite requests for tickets, tours, and restaurants.";

  const GRAM_MCQ=[
    {key:"g1", prompt:"Choose the correct sentence:", choices:["There is a museum downtown.","There are a museum downtown.","There is museums downtown."], answer:0, hint:"Singular → there is.", explain:"Museum is singular."},
    {key:"g2", prompt:"Choose the correct question:", choices:["Are there mountains near Banff?","Is there mountains near Banff?","Are mountains there near Banff?"], answer:0, hint:"Plural → Are there…?", explain:"Mountains = plural."},
    {key:"g3", prompt:"Choose the correct preposition:", choices:["The café is next to the hotel.","The café is next the hotel.","The café is next on the hotel."], answer:0, hint:"next to", explain:"Correct."},
    {key:"g4", prompt:"Choose the correct comparative:", choices:["Banff is more scenic than Ottawa.","Banff is scenicest than Ottawa.","Banff is the more scenic than Ottawa."], answer:0, hint:"more + adjective + than", explain:"Correct."},
  ];
  const GRAM_FILL=[
    {key:"gf1", prompt:"Choose the correct form:", sentence:"There ___ two tickets. (plural)", options:["are","is","isn't"], answer:"are", hint:"Plural → are."},
    {key:"gf2", prompt:"Choose the correct negative:", sentence:"There ___ a tour today. (not)", options:["isn't","aren't","don't"], answer:"isn't", hint:"Singular → isn't."},
    {key:"gf3", prompt:"Choose the best preposition:", sentence:"The museum is ___ the park. (opposite)", options:["across from","between","next"], answer:"across from", hint:"Opposite = across from."},
    {key:"gf4", prompt:"Choose the best comparative:", sentence:"Montréal is ___ than Banff. (cheap)", options:["cheaper","more cheap","cheapest"], answer:"cheaper", hint:"cheap → cheaper."},
  ];

  const CITY_MUSEUM=[
    {key:"m1", say:"Two tickets, please.", prompt:"Choose the best reply.", choices:["Of course. That’s 20 dollars.","Go straight.","It’s sunny."], answer:0, hint:"Ticket reply = price.", explain:"Price answer."},
    {key:"m2", say:"What are the opening hours?", prompt:"Choose the best reply.", choices:["We are open from 10 am to 6 pm.","Turn left at the bank.","Take sunscreen."], answer:0, hint:"Hours = time.", explain:"Time answer."},
    {key:"m3", say:"Can I pay by card?", prompt:"Choose the best reply.", choices:["Yes, you can pay by card.","There are mountains.","Between the café."], answer:0, hint:"Yes + can.", explain:"Correct."},
  ];

  const REST_BOOK=[
    {key:"r1", say:"I’d like to book a table for two, please.", prompt:"Choose the best reply.", choices:["Yes, of course. For what time?","Go straight for two minutes.","It is more scenic."], answer:0, hint:"Restaurant asks time.", explain:"Correct."},
    {key:"r2", say:"For 7 pm, please.", prompt:"Choose the best reply.", choices:["Perfect. What is your name?","Turn right after the bank.","It starts at 10."], answer:0, hint:"Name question.", explain:"Correct."},
    {key:"r3", say:"Could I have the check, please?", prompt:"Choose the best reply.", choices:["Yes, of course. Here you are.","It is across from the park.","There are two lakes."], answer:0, hint:"Check = bill.", explain:"Correct."},
  ];

  const TOUR_BOOK=[
    {key:"t1", say:"I’d like to book a scenic tour, please.", prompt:"Choose the best reply.", choices:["Certainly. It starts at 10 am.","Go to the museum.","It is cheaper."], answer:0, hint:"Tour reply = time.", explain:"Correct."},
    {key:"t2", say:"What is the meeting point?", prompt:"Choose the best reply.", choices:["The meeting point is at the visitor center.","Turn left at the corner.","It’s sunny."], answer:0, hint:"Meeting point = place.", explain:"Correct."},
    {key:"t3", say:"Is it available tomorrow?", prompt:"Choose the best reply.", choices:["Yes, it is available tomorrow.","There are mountains tomorrow.","Go straight tomorrow."], answer:0, hint:"Available = yes/no.", explain:"Correct."},
  ];

  const SAFE_CHECK_ITEMS=[
    {key:"s1", label:"I check the forecast.", ok:true},
    {key:"s2", label:"I bring water.", ok:true},
    {key:"s3", label:"I bring a light jacket.", ok:true},
    {key:"s4", label:"I stay on the path.", ok:true},
    {key:"s5", label:"I keep a safe distance from wildlife.", ok:true},
    {key:"s6", label:"I leave my passport on the trail.", ok:false},
  ];

  const DIR_BUILDER=[
    {key:"d1", title:"Build directions", target:"Go straight and turn left at the corner.", tokens:["Go","straight","and","turn","left","at","the","corner."], hint:"Go straight + turn left/right."},
    {key:"d2", title:"Build location", target:"The museum is across from the park.", tokens:["The","museum","is","across","from","the","park."], hint:"across from / next to / between."},
  ];

  const DIALOGUES=[
    {key:"museum", title:"🏛️ Museum tickets (city)", hintPhrases:["Two tickets, please.","What are the opening hours?","Can I pay by card?","Thank you very much."], lines:[
      {who:"Staff", side:"a", say:"Hello! How can I help you?"},
      {who:"Visitor", side:"b", say:"Hi. Two tickets, please."},
      {who:"Staff", side:"a", say:"Of course. That’s 20 dollars."},
      {who:"Visitor", side:"b", say:"Great. What are the opening hours?"},
      {who:"Staff", side:"a", say:"We are open from 10 am to 6 pm."},
      {who:"Visitor", side:"b", say:"Perfect. Can I pay by card?"},
      {who:"Staff", side:"a", say:"Yes, you can pay by card."},
    ]},
    {key:"hike", title:"🏔️ Hike advice (nature)", hintPhrases:["Is there an easy hike?","Is it safe today?","Keep a safe distance.","Thank you for your help."], lines:[
      {who:"Ranger", side:"a", say:"Hello. How can I help you today?"},
      {who:"Traveler", side:"b", say:"Hi. Is there an easy hike with a lake viewpoint?"},
      {who:"Ranger", side:"a", say:"Yes. This trail is easy. Please stay on the path."},
      {who:"Traveler", side:"b", say:"Thank you. Is it safe today?"},
      {who:"Ranger", side:"a", say:"Yes, but please keep a safe distance from wildlife."},
      {who:"Traveler", side:"b", say:"Of course. Thank you for your help."},
    ]},
    {key:"restaurant", title:"🍽️ Restaurant booking (city)", hintPhrases:["I’d like to book a table for two.","For 7 pm, please.","My name is…","Thank you."], lines:[
      {who:"Host", side:"a", say:"Good evening. How can I help you?"},
      {who:"Guest", side:"b", say:"Hello. I’d like to book a table for two, please."},
      {who:"Host", side:"a", say:"Of course. For what time?"},
      {who:"Guest", side:"b", say:"For 7 pm, please."},
      {who:"Host", side:"a", say:"Perfect. What is your name?"},
      {who:"Guest", side:"b", say:"My name is Alex."},
    ]},
  ];

  const LISTEN=[
    {key:"l1", say:"Are there mountains near Banff?", prompt:"Choose the best reply.", choices:["Yes, there are mountains near Banff.","Yes, there is mountains near Banff.","Yes, mountains are."], answer:0, hint:"Plural → there are.", explain:"Correct."},
    {key:"l2", say:"What is the meeting point?", prompt:"Choose the best reply.", choices:["The meeting point is at the visitor center.","Go straight.","It is cheaper."], answer:0, hint:"Meeting point = place.", explain:"Correct."},
    {key:"l3", say:"The café is next to the hotel.", prompt:"Choose the best reply.", choices:["Thank you.","Mountains.","Ten am."], answer:0, hint:"Polite reply.", explain:"Correct."},
    {key:"l4", say:"Could I have the check, please?", prompt:"Choose the best reply.", choices:["Yes, of course. Here you are.","Across from the park.","There are two lakes."], answer:0, hint:"Restaurant reply.", explain:"Correct."},
  ];

  const IT_CITIES=["Montréal","Quebec City","Toronto","Ottawa"];
  const IT_NATURE=["Banff","Vancouver area","Niagara Falls (short nature)"];
  const IT_OTHER=["Montréal","Quebec City","Toronto","Ottawa"];

  function makeMCQ(host, questions, awardPrefix, listen=true){
    host.innerHTML="";
    const resets=[];
    questions.forEach((q, idx) => {
      const wrap=document.createElement("div");
      wrap.className="q";
      wrap.innerHTML=`
        <div class="q__prompt">${idx+1}. ${escapeHtml(q.prompt)}</div>
        <div class="smallrow">
          ${listen ? `<button class="iconbtn" type="button" data-play="1">🔊 Listen</button>` : ``}
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
        </div>
        <div class="choices"></div>
        <div class="feedback hidden"></div>
      `;
      const fb=$(".feedback", wrap);
      const choices=$(".choices", wrap);

      if(listen && q.say) attachTap($("[data-play]", wrap), () => Speech.say(q.say));
      attachTap($("[data-hint]", wrap), () => {
        fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
        fb.innerHTML=`💡 <strong>Hint:</strong> ${escapeHtml(q.hint||"")}`;
      });
      q.choices.forEach((c,i) => {
        const row=document.createElement("label");
        row.className="choice";
        row.innerHTML=`<input type="radio" name="${awardPrefix}-${q.key}"/><div>${escapeHtml(c)}</div>`;
        attachTap(row, () => {
          const ok=(i===q.answer);
          fb.classList.remove("hidden","ok","no"); fb.classList.add(ok ? "ok":"no");
          fb.innerHTML = ok ? `✅ Correct! <span class="muted">${escapeHtml(q.explain||"")}</span>`
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
        fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
        fb.innerHTML=`💡 <strong>Hint:</strong> ${escapeHtml(it.hint||"")}`;
      });

      sel.addEventListener("change", () => {
        const val=sel.value; if(!val) return;
        const ok=normalize(val)===normalize(it.answer);
        fb.classList.remove("hidden","ok","no"); fb.classList.add(ok ? "ok":"no");
        fb.innerHTML = ok ? "✅ Correct!" : `❌ Not quite. Answer: <strong>${escapeHtml(it.answer)}</strong>`;
        if(ok) Score.award(`${awardPrefix}:${it.key}`, 1);
      });

      resets.push(() => { sel.value=""; fb.classList.add("hidden"); });
      host.appendChild(row);
    });
    return { reset(){ resets.forEach(fn => fn()); } };
  }

  function makeToken(text){
    const t=document.createElement("div");
    t.className="token";
    t.textContent=text;
    t.draggable=true;
    t.addEventListener("dragstart", () => { window.__dragToken=t; });
    return t;
  }

  function buildWordOrder(host, items, awardPrefix){
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
            if(orig){ orig.classList.remove("is-used"); orig.draggable=true; }
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

          if(cont===bank && dragged.dataset.role==="zone"){
            const sid=dragged.dataset.sourceTid;
            dragged.remove();
            const orig=idMap.get(sid);
            if(orig){ orig.classList.remove("is-used"); orig.draggable=true; }
            return;
          }
          if(cont===zone && dragged.dataset.role==="bank"){
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
              if(orig){ orig.classList.remove("is-used"); orig.draggable=true; }
            });
            if(targetTok && targetTok.parentElement===zone) zone.insertBefore(c, targetTok);
            else zone.appendChild(c);
            dragged.classList.add("is-used"); dragged.draggable=false;
            return;
          }
          if(cont===zone && dragged.dataset.role==="zone"){
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
        fb.classList.remove("hidden","ok","no"); fb.classList.add(ok ? "ok":"no");
        fb.textContent = ok ? "✅ Perfect!" : `❌ Not yet. You wrote: “${built || "—"}”`;
        if(ok) Score.award(`${awardPrefix}:${it.key}`, 2);
      });
      attachTap($("[data-clear]", block), () => {
        $$(".token", zone).forEach(z => {
          const sid=z.dataset.sourceTid;
          z.remove();
          const orig=idMap.get(sid);
          if(orig){ orig.classList.remove("is-used"); orig.draggable=true; }
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

  // Vocab UI
  function renderVocabSetSelect(){
    const sel=$("#vocabSet"); if(!sel) return;
    sel.innerHTML="";
    VOCAB_SETS.forEach(s => { const o=document.createElement("option"); o.value=s.key; o.textContent=s.label; sel.appendChild(o); });
    sel.value="city";
  }
  function vocabForSet(k){ return VOCAB.filter(v => v.set===k); }
  function renderFlashcards(shuf=false){
    const grid=$("#vocabGrid"); if(!grid) return;
    const setKey=$("#vocabSet")?.value || "city";
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
  let vocabQuizState={ q:null };
  function buildVocabQuiz(){
    const host=$("#vocabQuizHost"); if(!host) return;
    const setKey=$("#vocabSet")?.value || "city";
    const list=vocabForSet(setKey);
    if(list.length < 4){ host.innerHTML="<p class='muted'>Not enough words for a quiz.</p>"; return; }
    const q=list[Math.floor(Math.random()*list.length)];
    const opts=shuffle([q, ...shuffle(list.filter(x=>x.word!==q.word)).slice(0,3)]);
    vocabQuizState={ q };
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
        fb.classList.remove("hidden","ok","no"); fb.classList.add(ok ? "ok":"no");
        fb.innerHTML = ok ? `✅ Correct! Example: “${escapeHtml(q.ex)}”`
                          : `❌ Not quite. Answer: <strong>${escapeHtml(q.word)}</strong>. Example: “${escapeHtml(q.ex)}”`;
        if(ok) Score.award(`vocab:${setKey}:${q.word}`, 1);
      });
      choices.appendChild(row);
    });
  }

  // Reading UI
  let mode="city";
  let readingAPI=null;
  function renderReading(){
    const host=$("#readingHost"); if(!host) return;
    host.innerHTML="";
    const lines=(mode==="city") ? CITY_READING : NATURE_READING;
    lines.forEach(l => {
      const row=document.createElement("div");
      row.className="line";
      row.innerHTML=`<div class="ico">${l.ico}</div><div>${escapeHtml(l.t)}</div>`;
      host.appendChild(row);
    });
  }
  function setMode(newMode){
    mode=newMode;
    const c=$("#dayCity"), n=$("#dayNature"), tag=$("#readTag");
    if(mode==="city"){
      c.classList.add("is-on"); n.classList.remove("is-on");
      c.setAttribute("aria-pressed","true"); n.setAttribute("aria-pressed","false");
      tag.textContent="City Day";
    }else{
      n.classList.add("is-on"); c.classList.remove("is-on");
      n.setAttribute("aria-pressed","true"); c.setAttribute("aria-pressed","false");
      tag.textContent="Nature Day";
    }
    renderReading();
    readingAPI = makeMCQ($("#readingQuizHost"), mode==="city" ? CITY_Q : NATURE_Q, "read", false);
  }

  function renderLesson(hostSel, lines){
    const host=$(hostSel); if(!host) return;
    host.innerHTML="";
    lines.forEach(l => {
      const row=document.createElement("div");
      row.className="line";
      row.innerHTML=`<div class="ico">${l.ico}</div><div>${escapeHtml(l.text)}</div>`;
      host.appendChild(row);
    });
  }

  // Safety checklist
  function renderSafety(){
    const host=$("#safeHost"); if(!host) return;
    host.innerHTML="";
    SAFE_CHECK_ITEMS.forEach(it => {
      const row=document.createElement("label");
      row.className="choice";
      row.innerHTML=`<input type="checkbox" data-ok="${it.ok ? "1":"0"}"/><div>${escapeHtml(it.label)}</div>`;
      host.appendChild(row);
    });
    const btn=document.createElement("button");
    btn.className="btn";
    btn.type="button";
    btn.textContent="✅ Check safety";
    host.appendChild(btn);

    const fb=document.createElement("div");
    fb.className="feedback hidden";
    host.appendChild(fb);

    attachTap(btn, () => {
      const cbs=$$("input[type=checkbox]", host);
      let correct=0, total=cbs.length;
      cbs.forEach(cb => {
        const should=cb.dataset.ok==="1";
        const is=cb.checked;
        if((should && is) || (!should && !is)) correct++;
      });
      fb.classList.remove("hidden","ok","no");
      if(correct===total){
        fb.classList.add("ok"); fb.textContent=`✅ Excellent! ${correct}/${total}.`;
        Score.award("safe:perfect", 4);
      }else{
        fb.classList.add("no"); fb.textContent=`❌ ${correct}/${total}. Tip: do NOT select “leave my passport on the trail.”`;
        Score.award("safe:try", 1);
      }
    });
  }

  // Dialogues
  let dlgState={ key:DIALOGUES[0].key, idx:0, timer:null, role:"b" };
  function renderDlgSelect(){
    const sel=$("#dlgSelect"); if(!sel) return;
    sel.innerHTML="";
    DIALOGUES.forEach(d => { const o=document.createElement("option"); o.value=d.key; o.textContent=d.title; sel.appendChild(o); });
    sel.value=dlgState.key;
  }
  function currentDialogue(){ return DIALOGUES.find(d=>d.key===dlgState.key) || DIALOGUES[0]; }
  function setDlgTitle(){ const h=$("#dlgTitle"); if(h) h.textContent=currentDialogue().title; }
  function clearChat(){
    const stream=$("#chatStream"); if(stream) stream.innerHTML="";
    $("#dlgHintBox")?.classList.add("hidden");
    dlgState.idx=0;
    if(dlgState.timer) clearInterval(dlgState.timer);
    dlgState.timer=null;
  }
  function addBubble(line){
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
    attachTap(tools[0], (e)=>{ e.stopPropagation(); Speech.say(line.say); });
    attachTap(tools[1], (e)=>{ e.stopPropagation(); Speech.say(line.say); });
    stream.appendChild(b);
    stream.scrollTop=stream.scrollHeight;
    if(Auto.enabled && line.side !== dlgState.role) Speech.say(line.say);
  }
  function stepDialogue(){
    const d=currentDialogue();
    if(dlgState.idx >= d.lines.length) return false;
    addBubble(d.lines[dlgState.idx]);
    dlgState.idx++;
    return true;
  }
  function playDialogue(){
    if(dlgState.timer) clearInterval(dlgState.timer);
    dlgState.timer=setInterval(()=>{ const ok=stepDialogue(); if(!ok){ clearInterval(dlgState.timer); dlgState.timer=null; } }, 1400);
  }
  function listenAllDialogue(){ Speech.say(currentDialogue().lines.map(x=>x.say).join(" ")); }
  function showDlgHints(){
    const d=currentDialogue();
    const box=$("#dlgHintBox"); if(!box) return;
    box.classList.remove("hidden","ok","no"); box.classList.add("ok");
    box.innerHTML="💡 Useful phrases:<br/>" + d.hintPhrases.map(p => `• ${escapeHtml(p)}`).join("<br/>");
  }
  function setPracticeRole(side){
    dlgState.role=side;
    const a=$("#roleA"), b=$("#roleB");
    if(!a||!b) return;
    if(side==="a"){
      a.classList.add("is-on"); b.classList.remove("is-on");
      a.setAttribute("aria-pressed","true"); b.setAttribute("aria-pressed","false");
    }else{
      b.classList.add("is-on"); a.classList.remove("is-on");
      b.setAttribute("aria-pressed","true"); a.setAttribute("aria-pressed","false");
    }
  }

  // Itinerary
  function renderItSelects(){
    const city=$("#itCity"), nat=$("#itNature"), other=$("#itOther");
    if(!city||!nat||!other) return;
    city.innerHTML=IT_CITIES.map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");
    nat.innerHTML=IT_NATURE.map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");
    other.innerHTML=IT_OTHER.map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");
    city.value="Montréal"; nat.value="Banff"; other.value="Toronto";
  }
  function buildItineraryText(){
    const city=$("#itCity")?.value || "Montréal";
    const nat=$("#itNature")?.value || "Banff";
    const month=$("#itMonth")?.value || "in July";
    const tr=$("#itTransport")?.value || "by plane";
    const cAct=$("#itCityAct")?.value || "visit a museum";
    const nAct=$("#itNatAct")?.value || "do an easy hike";
    const comp=$("#itCompare")?.value || "more relaxing than";
    const other=$("#itOther")?.value || "Toronto";
    return `Two-day plan ${month}:
` +
      `Day 1 (City): We are going to travel ${tr} and stay in ${city}. In the morning, we will ${cAct}. In the evening, we will book a restaurant.
` +
      `Day 2 (Nature): We are going to go near ${nat}. There are mountains and lakes. We will ${nAct}. We will check the forecast and bring water.
` +
      `Comparison: ${city} is ${comp} ${other} for us; however, ${nat} is more scenic.
` +
      `Polite request: Could you recommend an easy activity, please?`;
  }
  function renderChecklist(text){
    const host=$("#itChecklist"); if(!host) return false;
    const checks=[
      {label:"Future (going to / will)", test:/going to|we will/i},
      {label:"There is/are", test:/there are|there is/i},
      {label:"Weather / safety", test:/forecast|water|sunscreen|jacket/i},
      {label:"Connector (however)", test:/however/i},
      {label:"Comparison (than / more)", test:/than|more /i},
      {label:"Polite request (Could)", test:/could you|could i/i},
    ];
    host.innerHTML="";
    checks.forEach(c=>{
      const ok=c.test.test(text);
      const div=document.createElement("div");
      div.className="checkitem " + (ok ? "ok":"no");
      div.textContent=(ok ? "✅ ":"❌ ") + c.label;
      host.appendChild(div);
    });
    return checks.every(c=>c.test.test(text));
  }

  // Init
  let gramMCQ=null, gramFill=null, museumAPI=null, restAPI=null, tourAPI=null, dirAPI=null, listenAPI=null;

  function init(){
    Auto.load(); syncAuto(); setVoice("en-US");
    if(JS_STATUS) JS_STATUS.textContent="JS: ✅ loaded";

    safeOn("#dayCity","click", () => setMode("city"));
    safeOn("#dayNature","click", () => setMode("nature"));
    safeOn("#btnReadSpeak","click", () => {
      const lines=(mode==="city")?CITY_READING:NATURE_READING;
      Speech.say(lines.map(x=>x.t).join(" "));
    });
    safeOn("#btnReadReset","click", () => readingAPI?.reset());

    renderReading();
    readingAPI = makeMCQ($("#readingQuizHost"), CITY_Q, "read", false);

    renderVocabSetSelect();
    renderFlashcards(false);
    buildVocabQuiz();
    safeOn("#vocabSet","change", () => { renderFlashcards(false); buildVocabQuiz(); });
    safeOn("#btnVocabShuffle","click", () => renderFlashcards(true));
    safeOn("#btnVocabQuiz","click", () => buildVocabQuiz());
    safeOn("#btnVocabQuizReset","click", () => buildVocabQuiz());
    safeOn("#btnVocabQuizSpeak","click", () => { if(!vocabQuizState.q) return; Speech.say(`${vocabQuizState.q.word}. ${vocabQuizState.q.ex}`); });

    renderLesson("#gramLesson", GRAMMAR_LINES);
    gramMCQ = makeMCQ($("#gramMCQHost"), GRAM_MCQ, "gram", false);
    gramFill = buildFill($("#gramFillHost"), GRAM_FILL, "gramFill");
    safeOn("#btnGramSpeak","click", () => Speech.say(GRAM_SUM));
    safeOn("#btnGramReset","click", () => { gramMCQ.reset(); gramFill.reset(); });

    museumAPI = makeMCQ($("#museumHost"), CITY_MUSEUM, "museum", true);
    restAPI = makeMCQ($("#restHost"), REST_BOOK, "rest", true);
    safeOn("#btnMuseumReset","click", () => museumAPI.reset());
    safeOn("#btnRestReset","click", () => restAPI.reset());

    dirAPI = buildWordOrder($("#dirBuilderHost"), DIR_BUILDER, "dir");
    safeOn("#btnDirReset","click", () => dirAPI.reset());

    tourAPI = makeMCQ($("#tourHost"), TOUR_BOOK, "tour", true);
    safeOn("#btnTourReset","click", () => tourAPI.reset());
    renderSafety();
    safeOn("#btnSafeReset","click", () => renderSafety());

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

    listenAPI = makeMCQ($("#listenHost"), LISTEN, "listen", true);
    safeOn("#btnListenReset","click", () => listenAPI.reset());

    renderItSelects();
    safeOn("#btnItBuild","click", () => {
      const out=$("#itOutput"); if(!out) return;
      out.value=buildItineraryText();
      renderChecklist(out.value);
    });
    safeOn("#btnItHint","click", () => {
      const fb=$("#itFb"); if(!fb) return;
      fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
      fb.innerHTML="💡 Include: will/going to + there are + forecast + however + comparison + could you…";
    });
    safeOn("#btnItCheck","click", () => {
      const out=$("#itOutput"); const fb=$("#itFb");
      if(!out||!fb) return;
      const okAll=renderChecklist(out.value||"");
      fb.classList.remove("hidden","ok","no");
      if(okAll){ fb.classList.add("ok"); fb.textContent="✅ Excellent 2-day plan!"; Score.award("itinerary:complete", 6); }
      else { fb.classList.add("no"); fb.textContent="❌ Not yet. Add the missing parts (see checklist)."; }
    });
    safeOn("#btnItSpeak","click", () => Speech.say(($("#itOutput")?.value || "").replaceAll("\n"," ")));
    safeOn("#btnItCopy","click", async () => { try{ await navigator.clipboard.writeText($("#itOutput")?.value || ""); }catch(e){} });
    safeOn("#btnItReset","click", () => { $("#itOutput").value=""; $("#itChecklist").innerHTML=""; $("#itFb").classList.add("hidden"); });

    safeOn("#btnResetAll","click", () => {
      if(!confirm("Reset ALL activities and score?")) return;
      Speech.stop();
      Score.reset();
      setMode("city");
      $("#vocabSet").value="city";
      renderFlashcards(false);
      buildVocabQuiz();
      gramMCQ.reset(); gramFill.reset();
      museumAPI.reset(); restAPI.reset();
      dirAPI.reset();
      tourAPI.reset();
      renderSafety();
      listenAPI.reset();
      dlgState.key=DIALOGUES[0].key;
      $("#dlgSelect").value=dlgState.key;
      setDlgTitle(); clearChat(); setPracticeRole("b");
      $("#itOutput").value=""; $("#itChecklist").innerHTML=""; $("#itFb").classList.add("hidden");
      $("#top")?.scrollIntoView({behavior:"smooth"});
    });

    const max = (CITY_Q.length + NATURE_Q.length) + 12 + GRAM_MCQ.length + GRAM_FILL.length + CITY_MUSEUM.length + REST_BOOK.length + TOUR_BOOK.length + 4 + (DIR_BUILDER.length*2) + LISTEN.length + 6;
    Score.setMax(max);
  }

  // Wire global controls
  safeOn("#autoOff","click", () => setAuto(false));
  safeOn("#autoOn","click", () => setAuto(true));

  init();
})();
