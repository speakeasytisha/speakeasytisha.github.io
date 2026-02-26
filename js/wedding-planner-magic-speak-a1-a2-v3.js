(() => {
  "use strict";

  // ===== helpers =====
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const clean = (s) => String(s || "").trim().replace(/\s+/g," ");
  const shuffle = (arr) => {
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  };
  const CLONE = (obj) => {
    try{
      if(typeof window !== "undefined" && typeof window.structuredClone === "function"){
        return window.structuredClone(obj);
      }
    }catch(e){}
    return JSON.parse(JSON.stringify(obj));
  };
  function lsGet(key){ try{ return localStorage.getItem(key); }catch(e){ return null; } }
  function lsSet(key, val){ try{ localStorage.setItem(key, val); }catch(e){} }
  function lsDel(key){ try{ localStorage.removeItem(key); }catch(e){} }

  const ERR = $("#errPanel");
  const NOTICE = $("#notice");
  function showNotice(msg){
    if(!NOTICE) return;
    NOTICE.textContent = msg;
    NOTICE.style.display = "block";
    try{
      NOTICE.animate([{transform:"translateY(-2px)"},{transform:"translateY(0px)"}], {duration:220, easing:"ease-out"});
    }catch(e){}
  }
  function hideNotice(){
    if(!NOTICE) return;
    NOTICE.style.display = "none";
    NOTICE.textContent = "";
  }

  function showErr(msg){
    if(!ERR) return;
    ERR.textContent = "⚠️ " + msg;
    ERR.classList.add("is-on");
    showNotice("⚠️ A script error happened. See the red box at the bottom.");
  }
  window.addEventListener("error", (e) => {
    showErr((e && e.message) ? e.message : "A script error happened.");
  });

  function toast(el, msg, mode=""){
    if(!el) return;
    el.className = "feedback" + (mode ? (" " + mode) : "");
    el.textContent = msg;
  }

  function on(id, ev, fn){
    const el = typeof id === "string" ? $("#"+id) : id;
    if(!el) return;
    el.addEventListener(ev, fn);
  }

  // ===== speech synthesis (US/UK) =====
  let ACCENT="US";
  let LEVEL="A1";
  let FRHELP=true;
  let voices=[], voiceUS=null, voiceUK=null;
  let speechRate = 0.95;

  function refreshVoices(){
    if(!window.speechSynthesis) return;
    voices = speechSynthesis.getVoices();
    const pick = (lang) => voices.find(v => (v.lang||"").toLowerCase().startsWith(lang));
    voiceUS = pick("en-us") || pick("en") || null;
    voiceUK = pick("en-gb") || pick("en") || null;
  }
  function speak(text, rateOverride=null){
    if(!window.speechSynthesis) return;
    const t = clean(text);
    if(!t) return;
    const u = new SpeechSynthesisUtterance(t);
    u.lang = (ACCENT==="UK") ? "en-GB" : "en-US";
    u.voice = (ACCENT==="UK" ? (voiceUK||voiceUS) : (voiceUS||voiceUK)) || null;
    u.rate = (rateOverride!==null) ? rateOverride : speechRate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }
  if(window.speechSynthesis){
    refreshVoices();
    speechSynthesis.onvoiceschanged = refreshVoices;
  }

  // ===== state =====
  const LS="set_wedding_planner_magic_a1a2_v3";
  const DEFAULT_STATE = {
    level: "A1",
    accent: "US",
    frhelp: true,
    keys: {k1:false,k2:false,k3:false,k4:false,k5:false},
    profile: { name:"", role:"wedding planner", workplace:"a wedding venue", traits:["organized"], goal:"plan weddings" },
    stats: { vocabScore:0, questionsOk:0, roleplayDone:false, shadowDone:0, freestyleDone:false, meter:3 },
    vcat:"core"
  };

  function loadState(){
    try{
      const raw = lsGet(LS);
      if(!raw) return CLONE(DEFAULT_STATE);
      const data = JSON.parse(raw);
      const st = CLONE(DEFAULT_STATE);
      return {
        ...st,
        ...data,
        keys: { ...st.keys, ...(data.keys||{}) },
        profile: { ...st.profile, ...(data.profile||{}) },
        stats: { ...st.stats, ...(data.stats||{}) }
      };
    }catch(e){
      return CLONE(DEFAULT_STATE);
    }
  }
  let STATE = loadState();

  function saveState(){
    STATE.level = LEVEL;
    STATE.accent = ACCENT;
    STATE.frhelp = FRHELP;
    lsSet(LS, JSON.stringify(STATE));
  }

  // ===== tabs + locks =====
  function setTab(tab){
    $$(".tab").forEach(b => b.classList.toggle("is-active", b.dataset.tab===tab));
    $$(".panel").forEach(p => p.classList.toggle("is-active", p.id === ("tab-"+tab)));
    window.scrollTo({top:0, behavior:"smooth"});
  }

  function lockReason(tab){
    if(tab==="start" || tab==="key1") return "";
    if(tab==="key2") return "Finish Key 1 first (score 4/5 + Claim Key 1).";
    if(tab==="key3") return "Finish Key 2 first (score 4/5 + Claim Key 2).";
    if(tab==="key4") return "Finish Key 3 first (3 mission questions + Claim Key 3).";
    if(tab==="key5") return "Finish Key 4 first (complete a role-play + Claim Key 4).";
    return "";
  }

  function isLocked(tab){
    if(tab==="start" || tab==="key1") return false;
    if(tab==="key2") return !STATE.keys.k1;
    if(tab==="key3") return !STATE.keys.k2;
    if(tab==="key4") return !STATE.keys.k3;
    if(tab==="key5") return !STATE.keys.k4;
    return false;
  }

  function decorateTabs(){
    $$(".tab").forEach(btn => {
      const t = btn.dataset.tab;
      const locked = isLocked(t);
      btn.classList.toggle("is-locked", locked);
      // add lock emoji once
      const has = btn.querySelector(".lock");
      if(locked && !has){
        const s=document.createElement("span");
        s.className="lock";
        s.textContent="🔒";
        btn.appendChild(s);
      }
      if(!locked && has){ has.remove(); }
    });
  }

  $$(".tab").forEach(btn => btn.addEventListener("click", () => {
    const t = btn.dataset.tab;
    if(isLocked(t)){
      showNotice("🔒 Locked: " + lockReason(t));
      speak("Complete the previous key first.");
      return;
    }
    hideNotice();
    setTab(t);
  }));

  // ===== controls =====
  on("btnPrint","click", () => window.print());
  on("btnStart","click", () => { hideNotice(); setTab("start"); });
  on("btnReset","click", () => {
    lsDel(LS);
    STATE = CLONE(DEFAULT_STATE);
    applyState();
    toast($("#profileFb"), "Reset done.", "ok");
    showNotice("Reset done ✅ Start again at section 0.");
  });
  on("btnModel","click", () => speak(modelIntro()));
  on("btnUnlockAll","click", () => {
    STATE.keys = {k1:true,k2:true,k3:true,k4:true,k5:true};
    STATE.stats.vocabScore = 5;
    STATE.stats.questionsOk = 3;
    STATE.stats.roleplayDone = true;
    STATE.stats.shadowDone = Math.max(STATE.stats.shadowDone||0, 2);
    STATE.stats.freestyleDone = true;
    updateProgress();
    decorateTabs();
    saveState();
    showNotice("Teacher unlock ✅ All keys are open for testing.");
  });

  on("accentUS","click", () => setAccent("US"));
  on("accentUK","click", () => setAccent("UK"));
  function setAccent(a){
    ACCENT=a;
    $("#accentUS")?.classList.toggle("is-active", a==="US");
    $("#accentUK")?.classList.toggle("is-active", a==="UK");
    saveState();
  }

  on("lvlA1","click", () => setLevel("A1"));
  on("lvlA2","click", () => setLevel("A2"));
  function setLevel(l){
    LEVEL=l;
    $("#lvlA1")?.classList.toggle("is-active", l==="A1");
    $("#lvlA2")?.classList.toggle("is-active", l==="A2");
    speechRate = (LEVEL==="A1") ? 0.92 : 0.98;
    renderAll();
    saveState();
    showNotice("Level set to " + LEVEL + ".");
  }

  on("btnFrench","click", () => {
    FRHELP = !FRHELP;
    $("#btnFrench")?.setAttribute("aria-pressed", FRHELP ? "true" : "false");
    if($("#btnFrench")) $("#btnFrench").textContent = FRHELP ? "🇫🇷 FR help: ON" : "🇫🇷 FR help: OFF";
    toggleFRHelp();
    saveState();
    showNotice(FRHELP ? "FR help ON." : "FR help OFF.");
  });

  // ===== data =====
  const ROLE_OPTS = ["wedding planner","event planner","wedding coordinator","wedding designer"];
  const WORKPLACE_OPTS = ["a wedding venue","a château","Château de Pourtalès","a hotel","a garden venue","a wedding planning agency","a small business"];
  const TRAITS = ["organized","calm","friendly","creative","reliable","patient","professional","warm","flexible","detail-oriented","positive"];
  const GOALS = ["plan weddings","organize schedules","help clients feel calm","coordinate vendors","create a beautiful ceremony"];
  const PANIC = [
    "Could you repeat that, please?",
    "Sorry, I don’t understand.",
    "Could you speak more slowly, please?",
    "Let me check and call you back.",
    "One moment, please.",
    "Thank you — that’s clear."
  ];

  const WH = [
    {en:"What", fr:"Quoi / Quel(le)", ex:"What time is the ceremony?"},
    {en:"When", fr:"Quand", ex:"When is the meeting?"},
    {en:"Where", fr:"Où", ex:"Where is the venue?"},
    {en:"Who", fr:"Qui", ex:"Who is the contact person?"},
    {en:"How", fr:"Comment", ex:"How do we get there?"},
    {en:"How many", fr:"Combien (pluriel)", ex:"How many guests are there?"},
    {en:"How much", fr:"Combien (prix)", ex:"How much is the deposit?"}
  ];

  const VOCAB = {
    core: [
      {i:"💍", en:"wedding", fr:"mariage", ex:"I plan a wedding."},
      {i:"🗓️", en:"schedule", fr:"planning", ex:"I send the schedule."},
      {i:"📍", en:"venue", fr:"lieu", ex:"The venue is beautiful."},
      {i:"📞", en:"appointment", fr:"rendez-vous", ex:"I book an appointment."},
      {i:"💌", en:"email", fr:"email", ex:"I send an email."},
      {i:"✅", en:"confirm", fr:"confirmer", ex:"I confirm the time."},
      {i:"🧾", en:"budget", fr:"budget", ex:"We check the budget."},
      {i:"🧠", en:"detail", fr:"détail", ex:"I check the details."}
    ],
    venue: [
      {i:"🏰", en:"château", fr:"château", ex:"The château is the venue."},
      {i:"🏨", en:"hotel", fr:"hôtel", ex:"The hotel has rooms."},
      {i:"🌿", en:"garden", fr:"jardin", ex:"The ceremony is in the garden."},
      {i:"🪑", en:"chairs", fr:"chaises", ex:"We arrange the chairs."},
      {i:"🍽️", en:"dinner", fr:"dîner", ex:"Dinner is at 7:00 PM."},
      {i:"🎶", en:"music", fr:"musique", ex:"Music starts after dinner."},
      {i:"🕯️", en:"decor", fr:"décoration", ex:"The decor is elegant."},
      {i:"🌸", en:"flowers", fr:"fleurs", ex:"We choose flowers."}
    ],
    people: [
      {i:"👰", en:"bride", fr:"mariée", ex:"The bride is happy."},
      {i:"🤵", en:"groom", fr:"marié", ex:"The groom arrives at 3:00 PM."},
      {i:"🧑‍🍳", en:"caterer", fr:"traiteur", ex:"I call the caterer."},
      {i:"📸", en:"photographer", fr:"photographe", ex:"The photographer is on time."},
      {i:"🎤", en:"officiant", fr:"officiant(e)", ex:"The officiant speaks clearly."},
      {i:"👥", en:"guests", fr:"invités", ex:"We welcome guests."},
      {i:"🧑‍💼", en:"contact person", fr:"contact", ex:"Who is the contact person?"},
      {i:"🚚", en:"vendor", fr:"prestataire", ex:"I coordinate vendors."}
    ],
    actions: [
      {i:"📝", en:"plan", fr:"planifier", ex:"I plan the ceremony."},
      {i:"🧩", en:"organize", fr:"organiser", ex:"I organize the day."},
      {i:"📲", en:"call", fr:"appeler", ex:"I call the venue."},
      {i:"📩", en:"send", fr:"envoyer", ex:"I send a message."},
      {i:"📅", en:"book", fr:"réserver", ex:"I book a visit."},
      {i:"🔁", en:"change", fr:"changer", ex:"I change the schedule."},
      {i:"🧾", en:"sign up for", fr:"s’inscrire à", ex:"I sign up for a session."},
      {i:"🧷", en:"prepare", fr:"préparer", ex:"I prepare the checklist."}
    ]
  };

  // ===== mini lesson models =====
  function article(noun){
    const n = clean(noun || "");
    if(!n) return "a professional";
    if(/^an?\s+/i.test(n)) return n;
    const word = n.split(/\s+/)[0].toLowerCase();
    const anExceptions = new Set(["hour","honest","honor"]);
    const aExceptions = new Set(["university","unicorn","user","euro","one"]);
    if(anExceptions.has(word)) return "an " + n;
    if(aExceptions.has(word)) return "a " + n;
    const vowels="aeiou";
    return (vowels.includes(word[0]) ? "an " : "a ") + n;
  }

  function modelA1Text(){
    const p = STATE.profile;
    const name = p.name ? p.name : "…";
    return `Hello, I’m ${name}. I’m a wedding planner. I work at a wedding venue. I plan weddings. I send schedules.`;
  }
  function modelA2Text(){
    const p = STATE.profile;
    const name = p.name ? p.name : "…";
    return `Hello, I’m ${name}. I’m ${article(p.role)}. I work at ${p.workplace}. I organize schedules, coordinate vendors, and I help clients feel calm.`;
  }

  async function copyText(t, fbEl){
    try{
      await navigator.clipboard.writeText(t);
      toast(fbEl, "Copied!", "ok");
    }catch(e){
      toast(fbEl, t, "");
    }
  }

  // ===== profile =====
  function fillSelect(sel, arr, value){
    if(!sel) return;
    sel.innerHTML = arr.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
    if(value && arr.includes(value)) sel.value = value;
  }

  function renderProfile(){
    $("#pName").value = STATE.profile.name || "";
    fillSelect($("#pRole"), ROLE_OPTS, STATE.profile.role);
    fillSelect($("#pWorkplace"), WORKPLACE_OPTS, STATE.profile.workplace);
    fillSelect($("#pGoal"), GOALS, STATE.profile.goal);

    // trait chips (max 3)
    const picked = new Set(STATE.profile.traits || []);
    $("#traitChips").innerHTML = TRAITS.map(t => `
      <button class="chipBtn ${picked.has(t) ? "is-on":""}" type="button" data-trait="${esc(t)}">${esc(t)}</button>
    `).join("");

    $("#traitChips").onclick = (e) => {
      const b = e.target.closest("button[data-trait]");
      if(!b) return;
      const t = b.dataset.trait;
      const cur = new Set(STATE.profile.traits || []);
      if(cur.has(t)){ cur.delete(t); }
      else{
        if(cur.size>=3){
          toast($("#profileFb"), "Max 3 traits.", "bad");
          showNotice("Max 3 traits.");
          return;
        }
        cur.add(t);
      }
      STATE.profile.traits = Array.from(cur);
      renderProfile();
      renderMiniLesson();
      saveState();
    };
  }

  function joinList(a){
    const items = a.filter(Boolean);
    if(items.length===0) return "";
    if(items.length===1) return items[0];
    if(items.length===2) return items[0] + " and " + items[1];
    return items.slice(0,-1).join(", ") + ", and " + items[items.length-1];
  }

  function profileSentence(){
    const p = STATE.profile;
    const name = p.name ? p.name : "…";
    const traits = (p.traits || []).slice(0,3);
    const traitText = traits.length ? ("I’m " + joinList(traits) + ".") : "";
    return clean(`Hello, I’m ${name}. I’m ${article(p.role)}. I work at ${p.workplace}. ${traitText} My goal is to ${p.goal}.`);
  }

  on("saveProfile","click", () => {
    STATE.profile.name = clean($("#pName").value);
    STATE.profile.role = $("#pRole").value;
    STATE.profile.workplace = $("#pWorkplace").value;
    STATE.profile.goal = $("#pGoal").value;
    if(!STATE.profile.traits || !STATE.profile.traits.length) STATE.profile.traits = ["organized"];
    toast($("#profileFb"), "Saved ✅ Now go to Key 1 and learn the vocabulary.", "ok");
    showNotice("Profile saved ✅ Go to Key 1.");
    renderMiniLesson();
    saveState();
    updateProgress();
    decorateTabs();
  });

  on("listenProfile","click", () => speak(profileSentence()));
  on("panicBtn","click", () => {
    const line = PANIC[Math.floor(Math.random()*PANIC.length)];
    $("#safeSentence").textContent = line;
    speak(line);
  });

  // ===== safe sentence + meter =====
  on("safeNew","click", () => {
    const line = PANIC[Math.floor(Math.random()*PANIC.length)];
    $("#safeSentence").textContent = line;
    showNotice("New safe sentence ✅");
  });
  on("safeListen","click", () => speak($("#safeSentence").textContent));

  function renderMeter(){
    const cur = STATE.stats.meter || 3;
    $("#meter").innerHTML = [1,2,3,4,5].map(n => `
      <div class="mDot ${n<=cur ? "is-on":""}" role="button" tabindex="0" data-n="${n}">${n}</div>
    `).join("");
    toast($("#meterFb"), `Now: ${cur}/5. (Tap again after Key 5.)`, "");
    $("#meter").onclick = (e) => {
      const d = e.target.closest(".mDot[data-n]");
      if(!d) return;
      STATE.stats.meter = Number(d.dataset.n);
      renderMeter();
      saveState();
    };
  }

  // ===== mini lesson rendering =====
  function renderMiniLesson(){
    $("#modelA1").textContent = modelA1Text() + (FRHELP ? "  •  FR: Bonjour, je m’appelle … . Je suis wedding planner. Je travaille dans un lieu de mariage. Je planifie. J’envoie des plannings." : "");
    $("#modelA2").textContent = modelA2Text() + (FRHELP ? "  •  FR: Je suis … . Je suis organisatrice. Je travaille à … . J’organise le planning et je coordonne les prestataires." : "");
    toggleFRHelp($("#modelA1"));
    toggleFRHelp($("#modelA2"));
  }
  on("listenA1","click", () => speak(modelA1Text()));
  on("listenA2","click", () => speak(modelA2Text()));
  on("copyA1","click", () => copyText(modelA1Text(), $("#profileFb")));
  on("copyA2","click", () => copyText(modelA2Text(), $("#profileFb")));
  on("listen3Q","click", () => speak("What time is the ceremony? When is the meeting? Where is the venue?"));

  function modelIntro(){ return (LEVEL==="A1") ? modelA1Text() : modelA2Text(); }

  // ===== KEY 1 vocab =====
  const vcatBtns = $$(".chip[data-vcat]");
  vcatBtns.forEach(b => b.addEventListener("click", () => {
    vcatBtns.forEach(x => x.classList.remove("is-active"));
    b.classList.add("is-active");
    STATE.vcat = b.dataset.vcat;
    renderVocab();
    renderVQuiz(true);
    saveState();
  }));
  on("vMix","click", () => { renderVocab(); renderVQuiz(true); showNotice("New mix ✅"); });

  function vocabLimit(){ return (LEVEL==="A1") ? 8 : 12; }

  function renderVocab(){
    const list = (VOCAB[STATE.vcat] || VOCAB.core).slice();
    const picked = shuffle(list).slice(0, Math.min(vocabLimit(), list.length));
    $("#vgrid").innerHTML = picked.map(v => `
      <div class="vcard" role="button" tabindex="0" data-say="${esc(v.en)}">
        <div class="vicon" aria-hidden="true">${esc(v.i)}</div>
        <div class="vtxt">
          <b>${esc(v.en)}</b>
          <div class="frline fr">${esc(v.fr)}</div>
          <div class="ex">${esc(v.ex)}</div>
        </div>
      </div>
    `).join("");
    $("#vgrid").onclick = (e) => {
      const c = e.target.closest(".vcard[data-say]");
      if(c){ speak(c.dataset.say); }
    };
    toggleFRHelp($("#vgrid"));
  }

  // vocab quiz (fixed: clue always has WORD, not only emoji)
  let vSet=[], vPick=[];
  function renderVQuiz(newSet=false){
    if(newSet){
      const pool = [].concat(VOCAB.core, VOCAB.venue, VOCAB.people, VOCAB.actions);
      vSet = shuffle(pool).slice(0,5);
      vPick = new Array(vSet.length).fill(null);
    }

    $("#vQuiz").innerHTML = vSet.map((q,i)=>{
      // options: A1 = English options. A2 = French options.
      const optsPool = shuffle([q].concat(shuffle(vSet.filter((_,j)=>j!==i)).slice(0,2)));
      const opts = shuffle(optsPool).map(x => (LEVEL==="A1" ? x.en : x.fr));
      const answer = (LEVEL==="A1" ? q.en : q.fr);
      const correctIndex = opts.indexOf(answer);
      q._a = correctIndex;

      const clueTag = (LEVEL==="A1") ? "CLUE FR" : "CLUE EN";
      const clueTxt = (LEVEL==="A1") ? q.fr : q.en;
      const prompt = (LEVEL==="A1") ? "Choose the English word:" : "Choose the French meaning:";
      const hint = (LEVEL==="A1") ? q.ex : q.ex;

      return `
        <div class="qItem" data-i="${i}">
          <div class="qStem">
            ${i+1}. ${esc(prompt)}
            <div class="qClue">
              <span class="tag">${esc(clueTag)}</span>
              <span class="clueTxt">${esc(clueTxt)}</span>
              <span aria-hidden="true">${esc(q.i)}</span>
            </div>
            <div class="muted small" style="margin-top:6px">${esc(hint)}</div>
          </div>
          <div class="qOpts">
            ${opts.map((o,j)=>`<div class="opt ${vPick[i]===j?'is-selected':''}" role="button" tabindex="0" data-j="${j}">${esc(o)}</div>`).join("")}
          </div>
        </div>
      `;
    }).join("");

    $("#vQuiz").onclick = (e) => {
      const opt = e.target.closest(".opt[data-j]");
      if(!opt) return;
      const item = e.target.closest(".qItem");
      if(!item) return;
      const i = Number(item.dataset.i);
      const j = Number(opt.dataset.j);
      vPick[i]=j;
      $$(".qItem[data-i='"+i+"'] .opt", $("#vQuiz")).forEach(o => o.classList.toggle("is-selected", o===opt));
    };
    toast($("#vFb"), "Pick 1 answer per question → then ✅ Check.", "");
  }

  on("vNew","click", () => renderVQuiz(true));
  on("vHint","click", () => toast($("#vFb"), "Hint: Tap the vocab cards first. Then translate the clue.", ""));
  on("vListen","click", () => speak(vSet.map(x => x.en).join(", ")));

  on("vCheck","click", () => {
    if(vPick.some(x => x===null)){
      toast($("#vFb"), "Answer all 5 first.", "bad");
      showNotice("Answer all 5 first.");
      return;
    }
    let ok=0;
    $$(".qItem", $("#vQuiz")).forEach((item,i)=>{
      const a = vSet[i]._a;
      const pick = vPick[i];
      $$(".opt", item).forEach((o,j)=>{
        o.classList.remove("is-right","is-wrong");
        if(j===a) o.classList.add("is-right");
        else if(j===pick && j!==a) o.classList.add("is-wrong");
      });
      if(pick===a) ok++;
    });
    STATE.stats.vocabScore = ok;
    toast($("#vFb"), `Score: ${ok}/5. You need 4/5 to unlock Key 1.`, ok>=4 ? "ok" : "bad");
    showNotice(`Vocab score: ${ok}/5.`);
    saveState();
  });

  function blinkKey(id){
    const el = $("#"+id);
    if(!el) return;
    el.classList.add("is-on");
    try{
      if(typeof el.animate === "function"){
        el.animate([{transform:"scale(1)"},{transform:"scale(1.06)"},{transform:"scale(1)"}], {duration:420, easing:"ease-out"});
      }
    }catch(e){}
  }

  on("unlock2","click", () => {
    if((STATE.stats.vocabScore||0) < 4){
      toast($("#vFb"), "Need 4/5 to unlock. Tap New and try again.", "bad");
      showNotice("Need 4/5 on the vocab quiz.");
      speak("Try again.");
      return;
    }
    STATE.keys.k1 = true;
    blinkKey("k1");
    toast($("#vFb"), "Key 1 collected ✅ Key 2 unlocked!", "ok");
    showNotice("Key 1 collected ✅ Key 2 unlocked!");
    updateProgress();
    decorateTabs();
    saveState();
    setTab("key2");
  });

  // a/an quiz + detailed support
  let anSet=[], anPick=[];
  function renderAnQuiz(newSet=false){
    const items = [
      {stem:"I’m ___ event planner.", a:"an"},
      {stem:"I’m ___ wedding planner.", a:"a"},
      {stem:"I’m ___ officiant.", a:"an"},
      {stem:"I’m ___ coordinator.", a:"a"},
      {stem:"I’m ___ organizer.", a:"an"},
      {stem:"It’s ___ hour meeting.", a:"an"},
      {stem:"It’s ___ university venue.", a:"a"}
    ];
    if(newSet){
      anSet = shuffle(items).slice(0,5);
      anPick = new Array(anSet.length).fill(null);
    }
    $("#anQuiz").innerHTML = anSet.map((q,i)=>`
      <div class="qItem" data-i="${i}">
        <div class="qStem">${i+1}. ${esc(q.stem)}</div>
        <div class="qOpts">
          ${["a","an"].map((o,j)=>`<div class="opt ${anPick[i]===j?'is-selected':''}" role="button" tabindex="0" data-j="${j}">${o}</div>`).join("")}
        </div>
      </div>
    `).join("");
    $("#anQuiz").onclick = (e) => {
      const opt = e.target.closest(".opt[data-j]");
      if(!opt) return;
      const item = e.target.closest(".qItem");
      const i = Number(item.dataset.i);
      const j = Number(opt.dataset.j);
      anPick[i]=j;
      $$(".qItem[data-i='"+i+"'] .opt", $("#anQuiz")).forEach(o => o.classList.toggle("is-selected", o===opt));
    };
    toast($("#anFb"), "Choose a/an, then Check.", "");
  }

  on("anNew","click", () => renderAnQuiz(true));
  on("anHint","click", () => {
    toast($("#anFb"), "Hint: listen to the FIRST SOUND. Vowel sound → an. Consonant sound → a.", "");
    showNotice("A/An hint: listen to the first SOUND.");
  });
  on("anListenExamples","click", () => speak("an event. an hour. a wedding. a university. a one-day event. a European venue."));
  on("anCheat","click", () => {
    const s = "I’m an event planner. I work at a university venue for a one-day event.";
    toast($("#anCheatFb"), s, "ok");
    speak(s);
  });

  on("anCheck","click", () => {
    if(anPick.some(x => x===null)){
      toast($("#anFb"), "Answer all first.", "bad"); showNotice("Answer all first."); return;
    }
    let ok=0;
    $$(".qItem", $("#anQuiz")).forEach((item,i)=>{
      const correct = (anSet[i].a === "a") ? 0 : 1;
      const pick = anPick[i];
      $$(".opt", item).forEach((o,j)=>{
        o.classList.remove("is-right","is-wrong");
        if(j===correct) o.classList.add("is-right");
        else if(j===pick && j!==correct) o.classList.add("is-wrong");
      });
      if(pick===correct) ok++;
    });
    toast($("#anFb"), `Score: ${ok}/${anSet.length}.`, ok>=4 ? "ok" : "bad");
    showNotice(`A/An score: ${ok}/${anSet.length}.`);
  });

  // ===== KEY 2 schedules =====
  function builderRow(label, id, options){
    return `
      <div class="field">
        <label for="${esc(id)}">${esc(label)}</label>
        <select id="${esc(id)}">
          ${options.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join("")}
        </select>
      </div>
    `;
  }

  const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const HOURS = ["9","10","11","12","1","2","3","4","5","6","7"];
  const MINS = ["00","15","30","45"];
  const AMPM = ["AM","PM"];

  function renderTimeBuilder(){
    $("#timeBuilder").innerHTML = `
      <div class="bRow">
        ${builderRow("Day", "tbDay", DAYS)}
        ${builderRow("Hour", "tbHour", HOURS)}
      </div>
      <div class="bRow">
        ${builderRow("Minutes", "tbMin", MINS)}
        ${builderRow("AM / PM", "tbAmPm", AMPM)}
      </div>
      <div class="bRow">
        ${builderRow("Action", "tbAct", ["meeting with clients","venue visit","phone call","menu tasting","decor check","schedule review"])}
        ${builderRow("Place", "tbPlace", WORKPLACE_OPTS)}
      </div>
      <div class="bOut" id="tbOut">—</div>
    `;

    ["tbDay","tbHour","tbMin","tbAmPm","tbAct","tbPlace"].forEach(id => on(id,"change", updateTimeOut));
    updateTimeOut();
  }

  function updateTimeOut(){
    const day = $("#tbDay").value;
    const h = $("#tbHour").value;
    const m = $("#tbMin").value;
    const ap = $("#tbAmPm").value;
    const act = $("#tbAct").value;
    const place = $("#tbPlace").value;
    const s = clean(`${day} at ${h}:${m} ${ap}: ${act} at ${place}.`);
    $("#tbOut").textContent = s;
    toast($("#timeFb"), "Built ✅", "ok");
    saveState();
  }

  on("timeListen","click", () => speak($("#tbOut").textContent));
  on("timeCopy","click", async () => {
    const t = $("#tbOut").textContent;
    try{ await navigator.clipboard.writeText(t); toast($("#timeFb"), "Copied!", "ok"); }
    catch(e){ toast($("#timeFb"), t, ""); }
  });

  // time quiz
  let timeSet=[], timePick=[];
  function timeStr(h,m,ap){ return `${h}:${m} ${ap}`; }
  function renderTimeQuiz(newSet=false){
    if(newSet){
      const items = [
        {stem:"The meeting is at …", a: timeStr("10","30","AM"), opts:[timeStr("10","30","AM"), timeStr("10","30","PM"), timeStr("11","30","AM")]},
        {stem:"The venue visit is at …", a: timeStr("3","15","PM"), opts:[timeStr("3","15","PM"), timeStr("3","15","AM"), timeStr("2","15","PM")]},
        {stem:"Dinner is at …", a: timeStr("7","00","PM"), opts:[timeStr("7","00","PM"), timeStr("7","00","AM"), timeStr("6","00","PM")]},
        {stem:"The phone call is at …", a: timeStr("9","45","AM"), opts:[timeStr("9","45","AM"), timeStr("9","45","PM"), timeStr("10","45","AM")]},
        {stem:"The ceremony starts at …", a: timeStr("2","00","PM"), opts:[timeStr("2","00","PM"), timeStr("12","00","PM"), timeStr("2","00","AM")]}
      ];
      timeSet = shuffle(items).slice(0,5);
      timePick = new Array(timeSet.length).fill(null);
    }
    $("#timeQuiz").innerHTML = timeSet.map((q,i)=>{
      const opts = shuffle(q.opts);
      q._opts = opts;
      q._a = opts.indexOf(q.a);
      return `
        <div class="qItem" data-i="${i}">
          <div class="qStem">${i+1}. ${esc(q.stem)}</div>
          <div class="qOpts">
            ${opts.map((o,j)=>`<div class="opt ${timePick[i]===j?'is-selected':''}" role="button" tabindex="0" data-j="${j}">${esc(o)}</div>`).join("")}
          </div>
        </div>
      `;
    }).join("");
    $("#timeQuiz").onclick = (e) => {
      const opt = e.target.closest(".opt[data-j]");
      if(!opt) return;
      const item = e.target.closest(".qItem");
      const i = Number(item.dataset.i);
      const j = Number(opt.dataset.j);
      timePick[i]=j;
      $$(".qItem[data-i='"+i+"'] .opt", $("#timeQuiz")).forEach(o => o.classList.toggle("is-selected", o===opt));
    };
    toast($("#timeQuizFb"), "Choose, then Check.", "");
  }

  on("timeNew","click", () => renderTimeQuiz(true));
  on("timeCheck","click", () => {
    if(timePick.some(x=>x===null)){
      toast($("#timeQuizFb"), "Answer all first.", "bad"); showNotice("Answer all first."); return;
    }
    let ok=0;
    $$(".qItem", $("#timeQuiz")).forEach((item,i)=>{
      const a = timeSet[i]._a;
      const pick = timePick[i];
      $$(".opt", item).forEach((o,j)=>{
        o.classList.remove("is-right","is-wrong");
        if(j===a) o.classList.add("is-right");
        else if(j===pick && j!==a) o.classList.add("is-wrong");
      });
      if(pick===a) ok++;
    });
    toast($("#timeQuizFb"), `Score: ${ok}/5.`, ok>=4 ? "ok" : "bad");
    showNotice(`Time score: ${ok}/5.`);
    saveState();
  });

  // present simple quiz
  let planSet=[], planPick=[];
  function renderPlanQuiz(newSet=false){
    const itemsA1 = [
      {stem:"Choose the best sentence:", opts:["I plan weddings.","I planning weddings."], a:0},
      {stem:"Choose the best sentence:", opts:["I send the schedule.","I sends the schedule."], a:0},
      {stem:"Choose the best sentence:", opts:["I meet clients.","I am meet clients."], a:0},
      {stem:"Choose the best sentence:", opts:["I book a visit.","I book visit."], a:0},
      {stem:"Choose the best sentence:", opts:["I confirm the time.","I confirm time."], a:0}
    ];
    const itemsA2 = [
      {stem:"Choose the best sentence:", opts:["I confirm details by email.","I confirm details by emails."], a:0},
      {stem:"Choose the best sentence:", opts:["I call the venue and book an appointment.","I call the venue and booking an appointment."], a:0},
      {stem:"Choose the best sentence:", opts:["I organize the day and coordinate vendors.","I organize the day and coordinates vendors."], a:0},
      {stem:"Choose the best sentence:", opts:["I send a schedule to the clients.","I send schedule to clients."], a:0},
      {stem:"Choose the best sentence:", opts:["I check the budget and the timeline.","I check budget and timeline."], a:0}
    ];
    const pool = (LEVEL==="A1") ? itemsA1 : itemsA2;
    if(newSet){
      planSet = shuffle(pool).slice(0,5);
      planPick = new Array(planSet.length).fill(null);
    }
    $("#planQuiz").innerHTML = planSet.map((q,i)=>`
      <div class="qItem" data-i="${i}">
        <div class="qStem">${i+1}. ${esc(q.stem)}</div>
        <div class="qOpts">
          ${q.opts.map((o,j)=>`<div class="opt ${planPick[i]===j?'is-selected':''}" role="button" tabindex="0" data-j="${j}">${esc(o)}</div>`).join("")}
        </div>
      </div>
    `).join("");
    $("#planQuiz").onclick = (e) => {
      const opt = e.target.closest(".opt[data-j]");
      if(!opt) return;
      const item = e.target.closest(".qItem");
      const i = Number(item.dataset.i);
      const j = Number(opt.dataset.j);
      planPick[i]=j;
      $$(".qItem[data-i='"+i+"'] .opt", $("#planQuiz")).forEach(o => o.classList.toggle("is-selected", o===opt));
    };
    toast($("#planFb"), "Choose, then Check.", "");
  }

  on("planNew","click", () => renderPlanQuiz(true));
  on("planHint","click", () => {
    toast($("#planFb"), "Hint: Present simple = I plan / I send / I meet.", "");
    showNotice("Present simple hint: I plan / I send / I meet.");
  });
  on("planCheck","click", () => {
    if(planPick.some(x=>x===null)){
      toast($("#planFb"), "Answer all first.", "bad"); showNotice("Answer all first."); return;
    }
    let ok=0;
    $$(".qItem", $("#planQuiz")).forEach((item,i)=>{
      const pick = planPick[i];
      const a = planSet[i].a;
      $$(".opt", item).forEach((o,j)=>{
        o.classList.remove("is-right","is-wrong");
        if(j===a) o.classList.add("is-right");
        else if(j===pick && j!==a) o.classList.add("is-wrong");
      });
      if(pick===a) ok++;
    });
    toast($("#planFb"), `Score: ${ok}/5.`, ok>=4 ? "ok" : "bad");
    showNotice(`Present simple score: ${ok}/5.`);
    saveState();
  });

  on("unlock3","click", () => {
    const timeOk = ($("#timeQuizFb")?.className || "").includes("ok");
    const planOk = ($("#planFb")?.className || "").includes("ok");
    if(!timeOk && !planOk){
      toast($("#planFb"), "Need 4/5 on one drill to unlock.", "bad");
      showNotice("Need 4/5 on one drill.");
      speak("Try again.");
      return;
    }
    STATE.keys.k2 = true;
    blinkKey("k2");
    toast($("#planFb"), "Key 2 collected ✅ Key 3 unlocked!", "ok");
    showNotice("Key 2 collected ✅ Key 3 unlocked!");
    updateProgress();
    decorateTabs();
    saveState();
    setTab("key3");
  });

  // ===== KEY 3 WH + question builder =====
  function renderWH(){
    $("#whGrid").innerHTML = WH.map(w => `
      <div class="whCard" role="button" tabindex="0" data-say="${esc(w.ex)}">
        <div class="whTop">
          <div class="whEn">${esc(w.en)}</div>
          <div class="muted small">tap</div>
        </div>
        <div class="whFr fr">${esc(w.fr)}</div>
        <div class="whEx">${esc(w.ex)}</div>
      </div>
    `).join("");
    $("#whGrid").onclick = (e) => {
      const c = e.target.closest(".whCard[data-say]");
      if(c) speak(c.dataset.say);
    };
    toggleFRHelp($("#whGrid"));
  }

  const QB = {
    wh: ["What time","When","Where","Who","How many","How much"],
    rest: [
      "is the ceremony",
      "is the meeting",
      "is the venue",
      "is the contact person",
      "guests are there",
      "is the deposit"
    ],
    fr: {
      "What time": "À quelle heure",
      "When": "Quand",
      "Where": "Où",
      "Who": "Qui",
      "How many": "Combien (pluriel)",
      "How much": "Combien (prix)"
    }
  };

  let qTarget = "";
  function renderQBuilder(){
    const box = $("#qBuilder");
    box.innerHTML = `
      <div class="bRow">
        ${builderRow("WH", "qWh", QB.wh)}
        ${builderRow("Rest", "qRest", QB.rest)}
      </div>
      <div class="bOut" id="qOut">—</div>
      <div class="fr small" id="qFrLine"></div>
    `;
    on("qWh","change", () => updateQOut(false));
    on("qRest","change", () => updateQOut(false));
    updateQOut(true);
  }

  function updateQOut(newTarget){
    const wh = $("#qWh").value;
    const rest = $("#qRest").value;
    const out = `${wh} ${rest}?`;
    $("#qOut").textContent = out;
    $("#qFrLine").textContent = FRHELP ? (`FR: ${QB.fr[wh] || ""}…`) : "";
    if(newTarget){
      const targets = [
        "What time is the ceremony?",
        "When is the meeting?",
        "Where is the venue?",
        "Who is the contact person?",
        "How many guests are there?",
        "How much is the deposit?"
      ];
      qTarget = targets[Math.floor(Math.random()*targets.length)];
      toast($("#qFb"), `Mission: build → “${qTarget}”`, "");
    }
    saveState();
  }

  on("qListen","click", () => speak($("#qOut").textContent));
  on("qHint","click", () => {
    toast($("#qFb"), "Hint: Start with WH. Then is/are. Example: What time is the meeting?", "");
    showNotice("WH hint: start with WH → is/are.");
  });
  on("qCheck","click", () => {
    const out = clean($("#qOut").textContent);
    if(out === clean(qTarget)){
      STATE.stats.questionsOk = (STATE.stats.questionsOk||0) + 1;
      toast($("#qFb"), `Correct ✅ (${STATE.stats.questionsOk}/3)`, "ok");
      showNotice(`Correct ✅ (${STATE.stats.questionsOk}/3)`);
      speak("Good.");
      updateQOut(true);
    } else {
      toast($("#qFb"), "Not yet. Match the mission sentence exactly.", "bad");
      showNotice("Not yet. Match the mission sentence.");
    }
    saveState();
  });

  on("unlock4","click", () => {
    if((STATE.stats.questionsOk||0) < 3){
      toast($("#qFb"), "Need 3 correct questions.", "bad");
      showNotice("Need 3 correct questions.");
      speak("Try again.");
      return;
    }
    STATE.keys.k3 = true;
    blinkKey("k3");
    toast($("#qFb"), "Key 3 collected ✅ Key 4 unlocked!", "ok");
    showNotice("Key 3 collected ✅ Key 4 unlocked!");
    updateProgress();
    decorateTabs();
    saveState();
    setTab("key4");
  });

  // ===== KEY 4 dialogues =====
  function makeDialogue(containerSelector, title, steps){
    const box = $(containerSelector);
    if(!box) return null;

    let idx = 0;
    let done = false;

    function render(){
      const visible = steps.slice(0, idx+1);
      const step = steps[idx];
      const progress = `${Math.min(idx+1, steps.length)}/${steps.length}`;

      box.innerHTML = `
        <div class="dTop"><div class="dTitle">${esc(title)}</div><div class="muted small">${progress}</div></div>
        <div class="dBody">
          ${visible.map(s => `
            <div class="line ${s.who==='You' ? 'you' : ''}">
              <div class="who">${esc(s.who)}</div>
              <div class="txt">${esc(s.txt)}</div>
              ${FRHELP && s.fr ? `<div class="fr small">FR: ${esc(s.fr)}</div>` : ``}
            </div>
          `).join("")}

          ${(!done && step && step.choices) ? `
            <div class="choiceBox">
              <div class="muted small">Choose your line:</div>
              <div class="qOpts">
                ${step.choices.map((c,i)=>`<div class="opt" role="button" tabindex="0" data-choice="${i}">${esc(c.txt)}</div>`).join("")}
              </div>
            </div>
          ` : ``}
        </div>
        ${(!done) ? `
          <div class="dControls">
            ${(!step?.choices && idx < steps.length-1) ? `<button class="btn btn--ghost" type="button" data-continue="1">▶ Continue</button>` : ``}
            <span class="muted small">${step?.choices ? "Tap a line above." : (idx < steps.length-1 ? "Tap Continue to reveal the next line." : "Finish!")}</span>
          </div>
        ` : ``}
      `;
      toggleFRHelp(box);

      const fb = (containerSelector==="#dlg1") ? $("#dlg1Fb") : $("#dlg2Fb");
      if(done) toast(fb, "Finished ✅", "ok");
      else if(step?.choices) toast(fb, "Choose your line.", "");
      else toast(fb, "Tap Continue.", "");
    }

    function continueLine(){
      if(done) return;
      if(idx < steps.length-1){
        idx++;
        render();
      } else {
        done = true;
        render();
      }
    }

    function choose(i){
      const step = steps[idx];
      if(!step || !step.choices) return;
      const picked = step.choices[i];
      const fb = (containerSelector==="#dlg1") ? $("#dlg1Fb") : $("#dlg2Fb");

      if(picked.ok){
        steps[idx] = {who:"You", txt:picked.txt, fr:picked.fr || ""};

        if(idx >= steps.length-1){
          done = true;
          STATE.stats.roleplayDone = true;
          toast(fb, "Finished ✅ You can claim Key 4.", "ok");
          showNotice("Role-play finished ✅ Claim Key 4.");
          saveState();
          render();
          return;
        }

        idx++;
        if(idx >= steps.length) {
          done = true;
          STATE.stats.roleplayDone = true;
          saveState();
        }
        toast(fb, "Good ✅", "ok");
        render();
      } else {
        toast(fb, "Not this line. Tap Hint.", "bad");
        showNotice("Not this line. Tap Hint.");
      }
    }

    box.addEventListener("click", (e) => {
      const c = e.target.closest(".opt[data-choice]");
      if(c){ choose(Number(c.dataset.choice)); return; }
      const cont = e.target.closest("[data-continue]");
      if(cont){ continueLine(); return; }
    });

    function hint(){
      const fb = (containerSelector==="#dlg1") ? $("#dlg1Fb") : $("#dlg2Fb");
      toast(fb, "Hint: be polite + say your name + your reason.", "");
      showNotice("Dialogue hint: polite + name + reason.");
      speak("Be polite. Say your name. Say why you are calling.");
    }

    function listen(){
      const txt = steps.map(s => `${s.who}: ${s.txt}`).join(" ");
      speak(txt);
    }

    function reset(){
      idx = 0; done = false;
      steps = JSON.parse(box.dataset.template);
      render();
      const fb = (containerSelector==="#dlg1") ? $("#dlg1Fb") : $("#dlg2Fb");
      toast(fb, "Reset.", "");
      showNotice("Dialogue reset.");
    }

    box.dataset.template = JSON.stringify(steps);
    render();
    return {hint, listen, reset};
  }

  const dlg1Steps = [
    {who:"Client", txt:"Hello! Nice to meet you.", fr:"Bonjour ! Enchanté(e)."},
    {who:"You", choices:[
      {txt:"Hello! I’m … . I’m your wedding planner.", fr:"Bonjour ! Je suis … . Je suis votre wedding planner.", ok:true},
      {txt:"I wedding planner.", fr:"Je wedding planner.", ok:false},
      {txt:"Meet you.", fr:"Enchanté.", ok:false}
    ]},
    {who:"Client", txt:"We are excited. The venue is a château.", fr:"On est très contents. Le lieu est un château."},
    {who:"You", choices:[
      {txt:"Great. What time is the ceremony?", fr:"Super. À quelle heure est la cérémonie ?", ok:true},
      {txt:"Great. You ceremony time?", fr:"Super. Vous cérémonie heure ?", ok:false},
      {txt:"Great. I am time.", fr:"Super. Je suis heure.", ok:false}
    ]},
    {who:"Client", txt:"It is at 2:00 PM.", fr:"C’est à 14h (2:00 PM)."},
    {who:"You", choices:[
      {txt:"Perfect. I confirm the schedule by email.", fr:"Parfait. Je confirme le planning par email.", ok:true},
      {txt:"Perfect. I confirming schedule.", fr:"Parfait. Je confirmant planning.", ok:false},
      {txt:"Perfect. Email schedule?", fr:"Parfait. Email planning ?", ok:false}
    ]},
    {who:"Client", txt:"Thank you!", fr:"Merci !"}
  ];

  const dlg2Steps = [
    {who:"Reception", txt:"Good morning, Château reception.", fr:"Bonjour, réception du château."},
    {who:"You", choices:[
      {txt:"Hello. My name is … . I’m calling to book a venue visit.", fr:"Bonjour. Je m’appelle … . J’appelle pour réserver une visite du lieu.", ok:true},
      {txt:"Hello. I call book.", fr:"Bonjour. J'appelle réserver.", ok:false},
      {txt:"Hello. Visit please.", fr:"Bonjour. Visite s'il vous plaît.", ok:false}
    ]},
    {who:"Reception", txt:"Sure. What day works for you?", fr:"Bien sûr. Quel jour vous convient ?"},
    {who:"You", choices:[
      {txt:"Tuesday at 10:30 AM, please.", fr:"Mardi à 10h30, s’il vous plaît.", ok:true},
      {txt:"Tuesday ten thirty.", fr:"Mardi dix trente.", ok:false},
      {txt:"At Tuesday 10:30.", fr:"À mardi 10h30.", ok:false}
    ]},
    {who:"Reception", txt:"That works. See you then.", fr:"C’est possible. À bientôt."},
    {who:"You", choices:[
      {txt:"Thank you. See you Tuesday.", fr:"Merci. À mardi.", ok:true},
      {txt:"Thanks you.", fr:"Merci.", ok:false},
      {txt:"See you at.", fr:"À.", ok:false}
    ]}
  ];

  let D1=null, D2=null;
  function renderDialogues(){
    D1 = makeDialogue("#dlg1","First meeting", CLONE(dlg1Steps));
    D2 = makeDialogue("#dlg2","Phone call", CLONE(dlg2Steps));
    on("dlg1Hint","click", () => D1?.hint());
    on("dlg1Listen","click", () => D1?.listen());
    on("dlg1Reset","click", () => D1?.reset());
    on("dlg2Hint","click", () => D2?.hint());
    on("dlg2Listen","click", () => D2?.listen());
    on("dlg2Reset","click", () => D2?.reset());
  }

  on("unlock5","click", () => {
    if(!STATE.stats.roleplayDone){
      toast($("#dlg2Fb"), "Finish one role‑play first.", "bad");
      showNotice("Finish one role-play first.");
      speak("Finish one role-play.");
      return;
    }
    STATE.keys.k4 = true;
    blinkKey("k4");
    toast($("#dlg2Fb"), "Key 4 collected ✅ Key 5 unlocked!", "ok");
    showNotice("Key 4 collected ✅ Key 5 unlocked!");
    updateProgress();
    decorateTabs();
    saveState();
    setTab("key5");
  });

  // ===== KEY 5 speaking =====
  const SHADOW_LINES = {
    A1: [
      "Hello, I’m your wedding planner.",
      "I work at a wedding venue.",
      "What time is the ceremony?",
      "I confirm the schedule by email.",
      "Thank you. See you soon."
    ],
    A2: [
      "Hello, my name is … . I’m calling to book a venue visit.",
      "I organize the schedule and coordinate vendors.",
      "Could you repeat that, please?",
      "I’m preparing the checklist this week.",
      "I send a clear plan so clients feel calm."
    ]
  };

  let shadowIdx = 0;
  let slowMode = false;

  function renderShadow(){
    const lines = (LEVEL==="A1") ? SHADOW_LINES.A1 : SHADOW_LINES.A2;
    const line = lines[shadowIdx % lines.length];
    $("#shadowBox").innerHTML = `<div class="shadowLine">${esc(line)}</div>`;
    toast($("#shadowFb"), "Tap Play, repeat, then tap “I did it”.", "");
  }

  on("shadowPlay","click", () => speak($("#shadowBox").textContent, slowMode ? 0.85 : speechRate));
  on("shadowSlow","click", () => {
    slowMode = !slowMode;
    $("#shadowSlow").textContent = slowMode ? "🐇 Normal" : "🐢 Slow";
    showNotice(slowMode ? "Slow mode ON." : "Slow mode OFF.");
  });
  on("shadowNext","click", () => { shadowIdx++; renderShadow(); });
  on("shadowDone","click", () => {
    STATE.stats.shadowDone = (STATE.stats.shadowDone||0) + 1;
    toast($("#shadowFb"), `Nice ✅ Shadow lines done: ${STATE.stats.shadowDone}`, "ok");
    showNotice(`Shadow lines done: ${STATE.stats.shadowDone}`);
    saveState();
  });

  // freestyle timer + prompts
  const PROMPTS = [
    {en:"Introduce yourself as a wedding planner.", fr:"Présente-toi en tant que wedding planner."},
    {en:"Say the schedule for a meeting (day + time + place).", fr:"Dis le planning pour un rendez-vous."},
    {en:"Ask 2 client questions (What time…? When…?).", fr:"Pose 2 questions au client."},
    {en:"Book an appointment on the phone (polite).", fr:"Réserve un rendez-vous au téléphone."},
    {en:"Describe what you do (present simple).", fr:"Explique ton métier (présent simple)."}
  ];
  let prompt = PROMPTS[0];
  let timer=null;
  let remaining=20;

  function setClock(sec){
    const m = String(Math.floor(sec/60)).padStart(2,"0");
    const s = String(sec%60).padStart(2,"0");
    $("#clock").textContent = `${m}:${s}`;
  }
  function stopTimer(){
    if(timer){ clearInterval(timer); timer=null; }
  }
  function startTimer(sec){
    stopTimer();
    remaining=sec;
    setClock(remaining);
    showNotice("Timer started ✅ Speak until it ends.");
    timer = setInterval(() => {
      remaining--;
      setClock(Math.max(0,remaining));
      if(remaining<=0){
        stopTimer();
        STATE.stats.freestyleDone = true;
        toast($("#finishFb"), "Freestyle done ✅", "ok");
        showNotice("Freestyle done ✅ Now finish Key 5.");
        speak("Time.");
        saveState();
      }
    }, 1000);
  }
  on("t20","click", () => startTimer(20));
  on("t40","click", () => startTimer(40));
  on("tStop","click", () => { stopTimer(); showNotice("Timer stopped."); });

  function renderPrompt(newOne){
    if(newOne) prompt = PROMPTS[Math.floor(Math.random()*PROMPTS.length)];
    $("#promptCard").textContent = prompt.en + (FRHELP ? ("  •  FR: " + prompt.fr) : "");
    toggleFRHelp($("#promptCard"));
  }
  on("promptNew","click", () => { renderPrompt(true); showNotice("New prompt ✅"); });
  on("promptListen","click", () => speak(prompt.en));

  on("finishJourney","click", () => {
    const shadowOk = (STATE.stats.shadowDone||0) >= 2;
    const freeOk = !!STATE.stats.freestyleDone;
    if(!shadowOk || !freeOk){
      toast($("#finishFb"), "Do 2 shadow lines + 1 freestyle timer first.", "bad");
      showNotice("Need 2 shadow lines + 1 freestyle timer.");
      speak("Almost. Two shadow lines and one timer.");
      return;
    }
    STATE.keys.k5 = true;
    blinkKey("k5");
    toast($("#finishFb"), "🌟 You did it! Key 5 collected. A1 → A2 unlocked!", "ok");
    showNotice("🌟 Key 5 collected! Repeat with A2 for fluency.");
    updateProgress();
    decorateTabs();
    saveState();
  });

  // ===== progress UI =====
  function updateProgress(){
    const keys = STATE.keys;
    const done = [keys.k1,keys.k2,keys.k3,keys.k4,keys.k5].filter(Boolean).length;
    $("#keysPct").textContent = `${done}/5`;
    $("#barFill").style.width = `${Math.round((done/5)*100)}%`;
    $("#k1").classList.toggle("is-on", keys.k1);
    $("#k2").classList.toggle("is-on", keys.k2);
    $("#k3").classList.toggle("is-on", keys.k3);
    $("#k4").classList.toggle("is-on", keys.k4);
    $("#k5").classList.toggle("is-on", keys.k5);

    const hint = (done===0) ? "Start at section 0, save your profile, then do Key 1." :
                 (done===1) ? "Now build schedules in Key 2." :
                 (done===2) ? "Now build WH questions in Key 3." :
                 (done===3) ? "Now finish a role‑play in Key 4." :
                 (done===4) ? "Now do Shadow + Freestyle in Key 5." :
                 "You’re done — repeat with A2 for fluency.";
    $("#progressHint").textContent = hint;
  }

  function toggleFRHelp(root=document){
    const nodes = $$(".fr", root);
    nodes.forEach(n => n.style.display = FRHELP ? "" : "none");
  }

  // ===== KEY 2 & 3 builderRow is used in multiple places =====

  // ===== render all =====
  function renderAll(){
    $("#accentUS")?.classList.toggle("is-active", ACCENT==="US");
    $("#accentUK")?.classList.toggle("is-active", ACCENT==="UK");
    $("#lvlA1")?.classList.toggle("is-active", LEVEL==="A1");
    $("#lvlA2")?.classList.toggle("is-active", LEVEL==="A2");

    $("#btnFrench")?.setAttribute("aria-pressed", FRHELP ? "true" : "false");
    if($("#btnFrench")) $("#btnFrench").textContent = FRHELP ? "🇫🇷 FR help: ON" : "🇫🇷 FR help: OFF";

    renderProfile();
    renderMiniLesson();
    renderMeter();

    renderVocab();
    renderVQuiz(true);
    renderAnQuiz(true);

    renderTimeBuilder();
    renderTimeQuiz(true);
    renderPlanQuiz(true);

    renderWH();
    renderQBuilder();
    renderDialogues();

    renderShadow();
    renderPrompt(false);

    updateProgress();
    decorateTabs();
    toggleFRHelp(document);
  }

  function applyState(){
    LEVEL = STATE.level || "A1";
    ACCENT = STATE.accent || "US";
    FRHELP = (STATE.frhelp !== false);
    speechRate = (LEVEL==="A1") ? 0.92 : 0.98;

    vcatBtns.forEach(x => x.classList.toggle("is-active", x.dataset.vcat === (STATE.vcat || "core")));
    renderAll();
    setTab("start");
    hideNotice();
  }

  // Init
  try{ applyState(); }catch(e){ console.error(e); showErr(e.message || "Init error"); }

})();