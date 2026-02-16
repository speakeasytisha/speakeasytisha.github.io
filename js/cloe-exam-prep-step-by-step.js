/* SpeakEasyTisha • CLOE Exam Prep (Step-by-Step)
   Vanilla JS — tap-friendly; progress saved in localStorage.
   Audio: uses SpeechSynthesis (en-US / en-GB). */

(function(){
  "use strict";

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const LS_KEY = "SET_CLOE_PREP_V1";

  const state = loadState();

  // ---------- Utilities ----------
  function uid(){ return "id_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16); }
  function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function toast(msg){
    const el = $("#toast");
    el.textContent = msg;
    el.style.display = "block";
    clearTimeout(el._t);
    el._t = setTimeout(()=>{ el.style.display="none"; }, 2600);
  }
  function esc(s){
    return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function saveState(){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(e){}
  }
  function loadState(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(raw) return JSON.parse(raw);
    }catch(e){}
    return {
      mode: "dark",
      frHelp: false,
      accent: "en-US",
      targetLevel: "auto",  // auto/A2/B1/B2
      timers: true,
      progress: {}, // key -> {done:boolean, score:number, tries:number, ts:number}
      diagnostic: null, // {score:number, level:"A2|B1|B2", focus:[...]}
      mockHistory: []
    };
  }
  function setProgress(key, patch){
    state.progress[key] = Object.assign({done:false, score:0, tries:0, ts:Date.now()}, state.progress[key]||{}, patch);
    saveState();
  }
  function getProgress(key){ return state.progress[key] || {done:false, score:0, tries:0, ts:0}; }

  function currentLevel(){
    if(state.targetLevel && state.targetLevel !== "auto") return state.targetLevel;
    if(state.diagnostic && state.diagnostic.level) return state.diagnostic.level;
    return "B1";
  }

  // ---------- Mode + toggles ----------
  function applyMode(){
    document.documentElement.setAttribute("data-mode", state.mode === "light" ? "light" : "dark");
    $("#btnToggleMode").setAttribute("aria-pressed", state.mode === "light" ? "true" : "false");
  }
  function applyFRHelp(){
    $$(".frhelp").forEach(el => el.style.display = state.frHelp ? "block" : "none");
    $("#btnToggleFR").setAttribute("aria-pressed", state.frHelp ? "true" : "false");
  }
  function applyAccent(){
    $("#selAccent").value = state.accent || "en-US";
  }
  function applyTimers(){
    $("#chkTimer").checked = !!state.timers;
  }
  function initTopbar(){
    applyMode(); applyFRHelp(); applyAccent(); applyTimers();
    $("#btnToggleMode").addEventListener("click", ()=>{
      state.mode = (state.mode === "light") ? "dark" : "light";
      applyMode(); saveState();
    });
    $("#btnToggleFR").addEventListener("click", ()=>{
      state.frHelp = !state.frHelp;
      applyFRHelp(); saveState();
      toast(state.frHelp ? "FR help enabled" : "FR help hidden");
    });
    $("#btnPrint").addEventListener("click", ()=> window.print());
    $("#selAccent").addEventListener("change", (e)=>{
      state.accent = e.target.value;
      saveState();
      toast("Accent set to " + state.accent);
    });
    $("#selLevel").addEventListener("change", (e)=>{
      state.targetLevel = e.target.value;
      saveState();
      renderPlan();
      toast("Target level: " + state.targetLevel);
    });
    $("#chkTimer").addEventListener("change", (e)=>{
      state.timers = !!e.target.checked;
      saveState();
      toast(state.timers ? "Timers ON" : "Timers OFF");
    });
    $("#btnResetProgress").addEventListener("click", ()=>{
      if(!confirm("Reset progress on this page?")) return;
      state.progress = {};
      state.diagnostic = null;
      state.mockHistory = [];
      state.targetLevel = "auto";
      saveState();
      renderAll();
      toast("Progress reset.");
    });
    $("#btnExportProgress").addEventListener("click", ()=>{
      const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cloe-prep-progress.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=>URL.revokeObjectURL(url), 1000);
      toast("Progress exported.");
    });

    $$("[data-jump]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const id = btn.getAttribute("data-jump");
        const el = $(id);
        if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
      });
    });

    $("#btnStartDiagnostic").addEventListener("click", ()=>{
      $("#s1").scrollIntoView({behavior:"smooth"});
      toast("Diagnostic: answer fast — don’t overthink.");
    });
  }

  // ---------- Nav ----------
  const navItems = [
    {id:"#s0", label:"Home"},
    {id:"#s1", label:"Diagnostic"},
    {id:"#s2", label:"Verb Tenses"},
    {id:"#s3", label:"Modals"},
    {id:"#s4", label:"Vocabulary"},
    {id:"#s5", label:"Expressions"},
    {id:"#s6", label:"Read & Listen"},
    {id:"#s7", label:"Mock Test"},
    {id:"#s8", label:"Oral Prep"},
  ];
  function renderNav(){
    const mount = $("#navLinks");
    mount.innerHTML = "";
    navItems.forEach(it=>{
      const b = document.createElement("button");
      b.className = "nav__link";
      b.type = "button";
      b.textContent = it.label;
      b.addEventListener("click", ()=>{
        const el = $(it.id);
        if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
      });
      mount.appendChild(b);
    });

    // highlight current section
    const sections = navItems.map(it => $(it.id)).filter(Boolean);
    const buttons = $$(".nav__link", mount);
    const obs = new IntersectionObserver((entries)=>{
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b)=>b.intersectionRatio - a.intersectionRatio)[0];
      if(!visible) return;
      const idx = sections.indexOf(visible.target);
      buttons.forEach((btn,i)=>btn.setAttribute("aria-current", i===idx ? "true" : "false"));
    }, {root:null, threshold:[0.25,0.45,0.6]});
    sections.forEach(s=>obs.observe(s));
  }

  // ---------- Speech helpers ----------
  function canSpeak(){ return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window; }
  function speak(text, lang){
    if(!canSpeak()){
      toast("Speech not supported on this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang || state.accent || "en-US";
    u.rate = 0.95;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  }

  // ---------- Question engine ----------
  // Supported types: mcq, gap, order, bank, tf
  function renderQuiz(mount, quiz){
    const qid = quiz.id || uid();
    const key = quiz.key || ("quiz_" + qid);
    const prog = getProgress(key);

    const wrap = document.createElement("div");
    wrap.className = "pane";
    wrap.innerHTML = `
      <div class="row row--between">
        <div>
          <div class="badge">🧩 ${esc(quiz.title || "Practice")}</div>
          <div class="small">${esc(quiz.subtitle || "CLOE-style tasks")}</div>
        </div>
        <div style="min-width:220px">
          <div class="small">Progress</div>
          <div class="progress" aria-label="Progress bar">
            <div class="progress__bar" style="width:${prog.done ? 100 : 0}%"></div>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="small muted frhelp">${esc(quiz.fr || "")}</div>
      <div class="qwrap"></div>
      <div class="divider"></div>
      <div class="row">
        <button class="btn btn--primary btnCheck" type="button">Check</button>
        <button class="btn btn--ghost btnRetry" type="button">Retry</button>
        <div class="small" style="margin-left:auto" aria-live="polite">
          <span class="stat"></span>
        </div>
      </div>
      <div class="feedback" style="display:none"></div>
    `;
    const qwrap = $(".qwrap", wrap);
    const feedback = $(".feedback", wrap);
    const stat = $(".stat", wrap);

    const rendered = quiz.items.map((q, idx) => renderQuestion(qwrap, q, idx+1));
    function setStat(){
      const p = getProgress(key);
      stat.textContent = p.done ? `✅ done • ${p.score}%` : `tries: ${p.tries || 0}`;
    }
    setStat();

    $(".btnRetry", wrap).addEventListener("click", ()=>{
      rendered.forEach(r => r.reset());
      feedback.style.display = "none";
      toast("Reset. Try again.");
    });

    $(".btnCheck", wrap).addEventListener("click", ()=>{
      let correct = 0;
      let total = rendered.length;
      rendered.forEach(r => { if(r.isCorrect()) correct++; });
      const score = Math.round((correct/total)*100);
      const prev = getProgress(key);
      setProgress(key, {done:true, score, tries:(prev.tries||0)+1});
      setStat();
      feedback.style.display = "block";
      feedback.className = "feedback " + (score>=80 ? "feedback--ok" : (score>=55 ? "" : "feedback--bad"));
      feedback.innerHTML = score>=80
        ? `<strong>Great!</strong> ${correct}/${total} correct. Move on.`
        : `<strong>Keep going.</strong> ${correct}/${total} correct. Retry once, then continue.`;
      $(".progress__bar", wrap).style.width = "100%";
      toast(`Score: ${score}%`);
      renderPlan(); // update plan after diagnostic etc.
    });

    mount.appendChild(wrap);
  }

  function renderQuestion(mount, q, num){
    const id = uid();
    const box = document.createElement("div");
    box.className = "q";
    box.innerHTML = `
      <div class="q__head">
        <div class="q__title">${num}. ${esc(q.prompt)}</div>
        <div class="q__meta">${esc(q.tag || "")}</div>
      </div>
      <div class="q__body"></div>
      <div class="feedback qfb" style="display:none" aria-live="polite"></div>
    `;
    const body = $(".q__body", box);
    const fb = $(".qfb", box);

    let api = null;
    let touched = false;

    function updateFeedback(force){
      if(!touched && !force){
        fb.style.display = "none";
        return;
      }
      fb.style.display = "block";

      const complete = api && typeof api.isComplete === "function" ? api.isComplete() : true;
      const ok = complete ? api.isCorrect() : false;

      if(!complete){
        fb.className = "feedback qfb";
        fb.innerHTML = `<strong>Keep going…</strong> ${esc(autoHint(q))}`;
        return;
      }

      fb.className = "feedback qfb " + (ok ? "feedback--ok" : "feedback--bad");
      if(ok){
        fb.innerHTML = `<strong>Correct.</strong> ${q.explain ? esc(q.explain) : ""}`;
      }else{
        const hint = autoHint(q);
        fb.innerHTML = `<strong>Not yet.</strong> ${hint ? esc(hint) : "Try again."}`;
      }
    }

    function onUserChange(){
      touched = true;
      updateFeedback(false);
    }

    if(q.type === "mcq"){
      api = renderMCQ(body, q, id, onUserChange);
    }else if(q.type === "tf"){
      api = renderMCQ(body, Object.assign({}, q, {choices:["True","False"], answer: q.answer ? "True" : "False"}), id, onUserChange);
    }else if(q.type === "gap"){
      api = renderGap(body, q, onUserChange);
    }else if(q.type === "order"){
      api = renderOrder(body, q, onUserChange);
    }else if(q.type === "bank"){
      api = renderBank(body, q, onUserChange);
    }else{
      body.innerHTML = `<div class="small">Unsupported question type.</div>`;
      api = { isCorrect: ()=>false, isComplete: ()=>true, reset: ()=>{} };
    }

    mount.appendChild(box);

    function isCorrect(){
      // Force feedback visible on module "Check"
      touched = true;
      updateFeedback(true);
      return api.isCorrect();
    }
    function reset(){
      api.reset();
      touched = false;
      fb.style.display = "none";
    }
    return {isCorrect, reset};
  }

  function renderMCQ(mount, q, id, onChange){
    const choices = q.choices || [];
    let selected = null;

    const stem = document.createElement("div");
    stem.className = "small";
    if(q.stem) stem.innerHTML = esc(q.stem);
    mount.appendChild(stem);

    const grid = document.createElement("div");
    grid.className = "q__choices";
    choices.forEach((c)=>{
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.textContent = c;
      btn.setAttribute("aria-pressed","false");
      btn.addEventListener("click", ()=>{
        selected = c;
        $$(".choice", grid).forEach(b=>b.setAttribute("aria-pressed","false"));
        btn.setAttribute("aria-pressed","true");
        if(typeof onChange === "function") onChange();
      });
      grid.appendChild(btn);
    });
    mount.appendChild(grid);

    return {
      isComplete: ()=> selected !== null,
      isCorrect: ()=> selected !== null && normText(selected) === normText(q.answer),
      reset: ()=>{
        selected = null;
        $$(".choice", grid).forEach(b=>b.setAttribute("aria-pressed","false"));
      }
    };
  }

  function normText(s){ return String(s).trim().replace(/\s+/g," ").toLowerCase(); }

  function autoHint(q){
    if(q.hint) return q.hint;
    if(q.explain) return q.explain;
    // Generic fallback hint
    const tag = (q.tag||"").toLowerCase();
    if(tag.includes("present perfect")) return "Tip: since/for/already/yet often use the present perfect.";
    if(tag.includes("past")) return "Tip: look for past time words (yesterday, last…, in 2020…).";
    if(tag.includes("continuous")) return "Tip: continuous = action in progress (now/at the moment).";
    if(tag.includes("future")) return "Tip: going to = plan; will = decision/promise; present continuous = arrangement.";
    if(tag.includes("modal")) return "Tip: modals change meaning (obligation/advice/possibility).";
    return "Tip: look for time words and the speaker’s intention (routine / now / finished / plan / obligation).";
  }

  function renderGap(mount, q, onChange){
    const p = document.createElement("div");
    p.className = "small";
    p.innerHTML = esc(q.stem || "");
    mount.appendChild(p);

    const input = document.createElement("input");
    input.className = "input";
    input.setAttribute("inputmode","text");
    input.placeholder = q.placeholder || "Type your answer…";
    input.addEventListener("input", ()=>{
      if(typeof onChange === "function") onChange();
    });
    mount.appendChild(input);

    if(q.hint){
      const hint = document.createElement("div");
      hint.className = "small muted";
      hint.textContent = q.hint;
      mount.appendChild(hint);
    }

    return {
      isComplete: ()=> normText(input.value).length > 0,
      isCorrect: ()=>{
        const a = normText(input.value);
        const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
        return answers.some(x => normText(x) === a);
      },
      reset: ()=>{ input.value=""; }
    };
  }

  function renderOrder(mount, q, onChange){
    // Tap words to build the sentence. No drag.
    const p = document.createElement("div");
    p.className = "small";
    p.innerHTML = esc(q.stem || "Tap the words to build the sentence:");
    mount.appendChild(p);

    const chosen = [];
    const rowSlots = document.createElement("div");
    rowSlots.className = "slotRow";
    mount.appendChild(rowSlots);

    const wordWrap = document.createElement("div");
    wordWrap.className = "words";
    mount.appendChild(wordWrap);

    const words = shuffle(q.words || []);
    words.forEach(w=>{
      const b = document.createElement("button");
      b.type="button";
      b.className="word";
      b.textContent = w;
      b.addEventListener("click", ()=>{
        if(b.getAttribute("aria-disabled")==="true") return;
        chosen.push(w);
        b.setAttribute("aria-disabled","true");
        renderSlots();
        if(typeof onChange === "function") onChange();
      });
      wordWrap.appendChild(b);
    });

    function renderSlots(){
      rowSlots.innerHTML = "";
      if(chosen.length===0){
        const s = document.createElement("div");
        s.className="small muted";
        s.textContent="Tap words below…";
        rowSlots.appendChild(s);
        return;
      }
      chosen.forEach((w, idx)=>{
        const slot = document.createElement("button");
        slot.type="button";
        slot.className="slot slot--filled";
        slot.textContent = w;
        slot.title = "Tap to remove";
        slot.addEventListener("click", ()=>{
          // remove this word, re-enable
          const removed = chosen.splice(idx,1)[0];
          $$(".word", wordWrap).forEach(btn=>{
            if(btn.textContent === removed && btn.getAttribute("aria-disabled")==="true"){
              // re-enable one matching
              btn.setAttribute("aria-disabled","false");
              return;
            }
          });
          renderSlots();
          if(typeof onChange === "function") onChange();
        });
        rowSlots.appendChild(slot);
      });
    }
    renderSlots();

    return {
      isComplete: ()=> chosen.length === (q.words || []).length,
      isCorrect: ()=>{
        const built = chosen.join(" ").replace(/\s+/g," ").trim();
        const ans = Array.isArray(q.answer) ? q.answer : [q.answer];
        return ans.some(a => normText(a) === normText(built));
      },
      reset: ()=>{
        chosen.splice(0, chosen.length);
        $$(".word", wordWrap).forEach(btn=>btn.setAttribute("aria-disabled","false"));
        renderSlots();
      }
    };
  }

  function renderBank(mount, q, onChange){
    // Tap a slot, then tap a word to fill it. No drag.
    const p = document.createElement("div");
    p.className = "small";
    p.innerHTML = esc(q.stem || "Complete the sentence with the word bank.");
    mount.appendChild(p);

    const slotRow = document.createElement("div");
    slotRow.className = "slotRow";
    mount.appendChild(slotRow);

    const wordsWrap = document.createElement("div");
    wordsWrap.className = "words";
    mount.appendChild(wordsWrap);

    const slots = (q.slots || []).map(()=>({value:""}));
    let activeSlot = -1;

    function renderSlots(){
      slotRow.innerHTML="";
      slots.forEach((s, idx)=>{
        const b = document.createElement("button");
        b.type="button";
        b.className = "slot" + (s.value ? " slot--filled" : "");
        b.textContent = s.value || "_____";
        b.setAttribute("aria-current", activeSlot===idx ? "true" : "false");
        b.addEventListener("click", ()=>{
          activeSlot = idx;
          renderSlots();
          if(typeof onChange === "function") onChange();
        });
        slotRow.appendChild(b);
      });
    }

    const bank = shuffle(q.bank || []);
    bank.forEach(w=>{
      const b = document.createElement("button");
      b.type="button";
      b.className="word";
      b.textContent = w;
      b.addEventListener("click", ()=>{
        if(activeSlot<0){
          toast("Tap a blank first.");
          return;
        }
        slots[activeSlot].value = w;
        activeSlot = -1;
        renderSlots();
        if(typeof onChange === "function") onChange();
      });
      wordsWrap.appendChild(b);
    });

    renderSlots();

    return {
      isComplete: ()=> slots.every(s=>normText(s.value).length>0),
      isCorrect: ()=>{
        const got = slots.map(s=>s.value);
        const ans = q.answer || [];
        if(got.length !== ans.length) return false;
        for(let i=0;i<ans.length;i++){
          if(normText(got[i]) !== normText(ans[i])) return false;
        }
        return true;
      },
      reset: ()=>{
        slots.forEach(s=>s.value="");
        activeSlot=-1;
        renderSlots();
      }
    };
  }

  // ---------- Data ----------
  const diagnosticQuiz = {
    key:"diag",
    title:"Diagnostic (12 questions)",
    subtitle:"Fast mixed questions (grammar + vocabulary)",
    fr:"FR: Réponds vite. Objectif = voir tes points faibles.",
    items:[
      {type:"mcq", prompt:"Choose the correct sentence.", tag:"Present Simple", choices:[
        "She go to work every day.",
        "She goes to work every day.",
        "She going to work every day."
      ], answer:"She goes to work every day.", explain:"He/She/It → verb + -s in Present Simple."},

      {type:"mcq", prompt:"Yesterday I ____ to a meeting.", tag:"Past Simple", choices:["go","went","gone"], answer:"went", explain:"Past simple of go = went."},

      {type:"gap", prompt:"Complete: I have ____ here since 2020.", tag:"Present Perfect", stem:"I have ____ here since 2020.", answer:["worked","been working"], hint:"since + start date → present perfect."},

      {type:"mcq", prompt:"Which is a polite request?", tag:"Politeness", choices:[
        "Give me the invoice.",
        "I want the invoice now.",
        "Could you send me the invoice, please?"
      ], answer:"Could you send me the invoice, please?", explain:"Could you… please? = polite request."},

      {type:"mcq", prompt:"Choose the best connector: I was late, ____ the train was cancelled.", tag:"Connectors", choices:["because","so","although"], answer:"because", explain:"because = reason."},

      {type:"bank", prompt:"Fill the blanks (word bank).", tag:"Future plan", stem:"Next week, I ____ ____ visit London.", slots:[1,1], bank:["am","are","is","going","to","will"], answer:["am","going"], explain:"I am going to… for a plan."},

      {type:"mcq", prompt:"Email: Choose the best opening.", tag:"Email", choices:[
        "Hey you!",
        "Dear Ms Taylor,",
        "Yo bro,"
      ], answer:"Dear Ms Taylor,", explain:"Formal opening for professional email."},

      {type:"order", prompt:"Put the words in order.", tag:"Word order", words:["please","help","me","Could","you","?"],
       answer:"Could you please help me ?", explain:"Could you please + base verb…?"},

      {type:"mcq", prompt:"Which word means 'a meeting planned for a specific time'?", tag:"Vocabulary", choices:["appointment","advice","engine"], answer:"appointment", explain:"appointment = rendez-vous."},

      {type:"gap", prompt:"Complete: I’m sorry ____ the delay.", tag:"Expression", stem:"I’m sorry ____ the delay.", answer:"for", explain:"Sorry for + noun."},

      {type:"mcq", prompt:"Choose: If I have time, I ____ call you.", tag:"1st conditional", choices:["will","would","am"], answer:"will", explain:"If + present, will + verb."},

      {type:"mcq", prompt:"Which is correct?", tag:"Prepositions of time", choices:[
        "at Monday",
        "on Monday",
        "in Monday"
      ], answer:"on Monday", explain:"on + days."},
    ]
  };

  const tenseModules = [
    {
      key:"tenses_ps_pc",
      title:"Present Simple vs Present Continuous",
      subtitle:"routines vs now / temporary",
      fr:"FR: Present simple = habitudes. Present continuous = maintenant / temporaire.",
      lesson:{
        bullets:[
          "Present Simple: routines, facts, schedules. (every day, usually, on Mondays)",
          "Present Continuous: now / today / temporary. (right now, this week)",
          "Common trap: *I am working every Monday* ❌ → *I work every Monday* ✅"
        ],
        examples:[
          ["I work every Monday.", "routine"],
          ["I’m working now.", "happening now"]
        ]
      },
      quiz:{
        title:"Practice: Present Simple vs Continuous",
        items:[
          {type:"mcq", prompt:"Right now, she ____ (work).", tag:"Now", choices:["works","is working","work"], answer:"is working", explain:"right now → continuous."},
          {type:"mcq", prompt:"Every Friday, we ____ a team meeting.", tag:"Routine", choices:["have","are having","has"], answer:"have", explain:"every Friday → present simple."},
          {type:"gap", prompt:"Complete (negative): He ____ (not / like) spicy food.", tag:"Negatives", stem:"He ____ spicy food.", answer:["doesn't like","does not like"], explain:"He/She/It → doesn't + base verb."},
          {type:"order", prompt:"Word order: question (Present Simple).", tag:"Questions", words:["you","Do","work","here","?"],
           answer:"Do you work here ?", explain:"Do + subject + base verb…?"},
          {type:"mcq", prompt:"This week, I ____ from home.", tag:"Temporary", choices:["work","am working","works"], answer:"am working", explain:"this week → temporary → continuous."},
          {type:"gap", prompt:"Complete: The train ____ at 8:15.", tag:"Schedule", stem:"The train ____ at 8:15.", answer:["leaves","departs"], explain:"Timetables → present simple."}
        ]
      }
    },
    {
      key:"tenses_past",
      title:"Past Simple vs Past Continuous",
      subtitle:"finished actions vs action in progress",
      fr:"FR: Past simple = action terminée. Past continuous = action en cours (at 8pm...).",
      lesson:{
        bullets:[
          "Past Simple: finished action (yesterday, last week, in 2021).",
          "Past Continuous: action in progress at a specific time (at 8pm, while…).",
          "Often together: Past Continuous (background) + Past Simple (interruption)."
        ],
        examples:[
          ["I emailed the client yesterday.", "finished"],
          ["I was emailing the client when you called.", "in progress + interruption"]
        ]
      },
      quiz:{
        title:"Practice: Past Simple vs Past Continuous",
        items:[
          {type:"mcq", prompt:"At 9 pm yesterday, I ____ (cook).", tag:"At + time", choices:["cooked","was cooking","cook"], answer:"was cooking", explain:"at 9 pm → continuous."},
          {type:"mcq", prompt:"I ____ to Paris last month.", tag:"Finished", choices:["go","went","was going"], answer:"went", explain:"last month → past simple."},
          {type:"mcq", prompt:"While she ____ , the phone rang.", tag:"While", choices:["worked","was working","is working"], answer:"was working", explain:"while + past continuous."},
          {type:"gap", prompt:"Complete: We ____ (not / see) him yesterday.", tag:"Negative", stem:"We ____ him yesterday.", answer:["didn't see","did not see"], explain:"didn't + base verb."},
          {type:"order", prompt:"Put in order.", tag:"Word order", words:["was","I","when","sleeping","you","called"],
           answer:"I was sleeping when you called", explain:"Past continuous + when + past simple."},
          {type:"gap", prompt:"Complete: She ____ (send) the report two hours ago.", tag:"Ago", stem:"She ____ the report two hours ago.", answer:["sent"], explain:"ago → past simple."},
        ]
      }
    },
    {
      key:"tenses_pp",
      title:"Present Perfect (vs Past Simple)",
      subtitle:"life experience / result now / unfinished time",
      fr:"FR: Present perfect = lien avec le présent (since/for/already/yet/ever).",
      lesson:{
        bullets:[
          "Present Perfect: experience (ever/never), result now (already/yet), unfinished time (today/this week) or since/for.",
          "Past Simple: finished time in the past (yesterday, in 2019).",
          "Common trap: *I have seen him yesterday* ❌ → *I saw him yesterday* ✅"
        ],
        examples:[
          ["I have already sent the email.", "result now"],
          ["I sent the email yesterday.", "finished time"]
        ]
      },
      quiz:{
        title:"Practice: Present Perfect vs Past Simple",
        items:[
          {type:"mcq", prompt:"I ____ this movie before. (experience)", tag:"Ever/Before", choices:["saw","have seen","see"], answer:"have seen", explain:"experience → present perfect."},
          {type:"mcq", prompt:"I ____ this morning at 7. (finished time)", tag:"Time", choices:["have woken up","woke up","wake up"], answer:"woke up", explain:"finished time → past simple."},
          {type:"gap", prompt:"Complete: She has ____ the invoice. (send)", tag:"Past participle", stem:"She has ____ the invoice.", answer:["sent"], explain:"send → sent."},
          {type:"mcq", prompt:"We ____ here since 2022.", tag:"Since", choices:["work","worked","have worked"], answer:"have worked", explain:"since → present perfect."},
          {type:"gap", prompt:"Complete: Have you ____ finished? (yet/already)", tag:"Yet/Already", stem:"Have you ____ finished?", answer:["already"], explain:"already in questions = earlier than expected."},
          {type:"mcq", prompt:"I ____ him last week.", tag:"Finished", choices:["have met","met","meet"], answer:"met", explain:"last week → past simple."},
        ]
      }
    },
    {
      key:"tenses_future",
      title:"Future: will / going to / present continuous",
      subtitle:"decision vs plan vs arrangement",
      fr:"FR: will = décision/prediction. going to = plan. present continuous = arrangement fixé.",
      lesson:{
        bullets:[
          "Will: decision now, promise, prediction. (I’ll call you.)",
          "Going to: plan/intention. (I’m going to visit a client.)",
          "Present Continuous: fixed arrangement (I’m meeting John at 3.)"
        ],
        examples:[
          ["I’ll email you now.", "decision now"],
          ["I’m going to travel next week.", "plan"],
          ["I’m having a meeting at 10 tomorrow.", "arrangement"]
        ]
      },
      quiz:{
        title:"Practice: Future forms",
        items:[
          {type:"mcq", prompt:"I’m cold. I ____ close the window. (decision now)", tag:"Will", choices:["will","am going to","am"], answer:"will", explain:"decision now → will."},
          {type:"mcq", prompt:"Next month, we ____ launch a new product. (plan)", tag:"Going to", choices:["are going to","will","are"], answer:"are going to", explain:"plan → going to."},
          {type:"mcq", prompt:"I ____ the client at 2 pm tomorrow. (arrangement)", tag:"Present continuous", choices:["meet","am meeting","will meet"], answer:"am meeting", explain:"fixed arrangement → present continuous."},
          {type:"gap", prompt:"Complete: Don’t worry — I ____ help you.", tag:"Promise", stem:"Don’t worry — I ____ help you.", answer:["will","I'll"], explain:"promise → will."},
          {type:"mcq", prompt:"Look at those clouds! It ____ rain.", tag:"Prediction with evidence", choices:["is going to","will","is"], answer:"is going to", explain:"evidence now → going to."},
          {type:"mcq", prompt:"The train ____ at 6:40.", tag:"Schedule", choices:["leaves","is leaving","will leave"], answer:"leaves", explain:"timetables → present simple."},
        ]
      }
    },
    {
      key:"tenses_cond",
      title:"Conditionals (Zero + First + Second)",
      subtitle:"facts, real future, hypothetical",
      fr:"FR: if + present → will. if + past → would (hypothèse).",
      lesson:{
        bullets:[
          "Zero conditional: If + present, present (facts). If you heat water, it boils.",
          "First conditional: If + present, will + verb (real future).",
          "Second conditional: If + past, would + verb (hypothetical)."
        ],
        examples:[
          ["If I’m late, I call you.", "real habit"],
          ["If I have time, I’ll call you.", "real future"],
          ["If I had more time, I would travel more.", "hypothetical"]
        ]
      },
      quiz:{
        title:"Practice: Conditionals",
        items:[
          {type:"mcq", prompt:"If I ____ time, I will call you.", tag:"1st conditional", choices:["have","had","will have"], answer:"have", explain:"If + present."},
          {type:"mcq", prompt:"If it rains, we ____ inside.", tag:"1st conditional", choices:["stay","will stay","would stay"], answer:"will stay", explain:"main clause → will."},
          {type:"mcq", prompt:"If I ____ you, I would accept.", tag:"2nd conditional", choices:["am","was","were"], answer:"were", explain:"formal: If I were you…"},
          {type:"gap", prompt:"Complete: If you heat ice, it ____ .", tag:"Zero", stem:"If you heat ice, it ____ .", answer:["melts"], explain:"facts → present simple."},
          {type:"mcq", prompt:"If we had the budget, we ____ hire more staff.", tag:"2nd conditional", choices:["will","would","are"], answer:"would", explain:"If + past, would + verb."},
          {type:"order", prompt:"Put in order.", tag:"Word order", words:["call","I","I'll","you","if","I","can"],
           answer:["I'll call you if I can","I will call you if I can"], explain:"will + verb, if + present."},
        ]
      }
    }
  ];

  const modalModule = {
    key:"modals",
    title:"Modals: ability • obligation • advice • permission",
    subtitle:"can / could / must / have to / should / may",
    fr:"FR: modaux = verbe + base verb (sans 'to'), sauf have to.",
    lesson:{
      bullets:[
        "can = ability/permission; could = polite request / past ability.",
        "must / have to = obligation (must = speaker / rules; have to = external).",
        "should = advice; may/might = possibility."
      ],
      examples:[
        ["Could you help me, please?", "polite request"],
        ["You have to wear a badge.", "external rule"],
        ["You should reply today.", "advice"]
      ]
    },
    quiz:{
      title:"Practice: Modals",
      items:[
        {type:"mcq", prompt:"Choose the best advice: You ____ check your spam folder.", tag:"Advice", choices:["must","should","may"], answer:"should", explain:"advice → should."},
        {type:"mcq", prompt:"Choose the polite request:", tag:"Politeness", choices:[
          "Open the window.",
          "Could you open the window, please?",
          "You open the window."
        ], answer:"Could you open the window, please?", explain:"Could you… please?"},
        {type:"mcq", prompt:"In our company, you ____ wear safety shoes. (rule)", tag:"Obligation", choices:["must","might","could"], answer:"must", explain:"rule/obligation → must."},
        {type:"gap", prompt:"Complete: I ____ to work late yesterday. (have to)", tag:"Past obligation", stem:"I ____ work late yesterday.", answer:["had to"], explain:"past of have to → had to."},
        {type:"mcq", prompt:"It’s 50/50. It ____ rain later.", tag:"Possibility", choices:["might","must","can"], answer:"might", explain:"possibility → might."},
        {type:"order", prompt:"Put in order.", tag:"Order", words:["you","May","ask","a","question","?"],
         answer:"May I ask a question ?", explain:"May I + verb…?"},
      ]
    }
  };

  const vocabSets = [
    {
      key:"v_meetings",
      title:"Meetings & Schedules",
      items:[
        {w:"appointment", fr:"rendez-vous", def:"a meeting planned for a specific time", ex:"I have an appointment at 3 pm."},
        {w:"agenda", fr:"ordre du jour", def:"the list of topics to discuss in a meeting", ex:"Let’s follow the agenda."},
        {w:"deadline", fr:"date limite", def:"the latest time to finish something", ex:"The deadline is Friday."},
        {w:"to postpone", fr:"reporter", def:"to move to a later time/date", ex:"We postponed the meeting to Monday."},
        {w:"minutes", fr:"compte rendu", def:"written summary of a meeting", ex:"I’ll send the minutes after the meeting."},
        {w:"to reschedule", fr:"reprogrammer", def:"to change the time/date of an appointment", ex:"Can we reschedule to 10 am?"}
      ]
    },
    {
      key:"v_email",
      title:"Email & Administration",
      items:[
        {w:"invoice", fr:"facture", def:"a document asking for payment", ex:"Could you send the invoice, please?"},
        {w:"attachment", fr:"pièce jointe", def:"a file added to an email", ex:"The attachment is in PDF format."},
        {w:"to confirm", fr:"confirmer", def:"to say something is true / approved", ex:"Please confirm the booking."},
        {w:"to request", fr:"demander", def:"to ask formally", ex:"I’m writing to request information."},
        {w:"to forward", fr:"transférer", def:"to send (an email) to another person", ex:"I forwarded your message to HR."},
        {w:"signature", fr:"signature", def:"the text block at the end of an email", ex:"Add your signature at the bottom."}
      ]
    },
    {
      key:"v_service",
      title:"Customer service & Problems",
      items:[
        {w:"to apologize", fr:"s'excuser", def:"to say sorry", ex:"We apologize for the inconvenience."},
        {w:"refund", fr:"remboursement", def:"money returned to a customer", ex:"You can request a refund."},
        {w:"complaint", fr:"réclamation", def:"a statement of dissatisfaction", ex:"We received a complaint about the noise."},
        {w:"maintenance", fr:"maintenance", def:"repairs and upkeep", ex:"Maintenance will fix it today."},
        {w:"to resolve", fr:"résoudre", def:"to solve a problem", ex:"We resolved the issue quickly."},
        {w:"out of order", fr:"hors service", def:"not working", ex:"The lift is out of order."}
      ]
    },
    {
      key:"v_travel",
      title:"Travel & Hospitality (your previous theme)",
      items:[
        {w:"check-in", fr:"enregistrement", def:"the process of arriving and registering", ex:"Check-in starts at 2 pm."},
        {w:"reservation", fr:"réservation", def:"a booking", ex:"I have a reservation under Dosière."},
        {w:"amenities", fr:"équipements / services", def:"extra features and services", ex:"The hotel offers many amenities."},
        {w:"single / double room", fr:"chambre simple / double", def:"room types", ex:"I’d like a double room, please."},
        {w:"to upgrade", fr:"surclasser", def:"to move to a better option", ex:"Can you upgrade my room?"},
        {w:"availability", fr:"disponibilité", def:"whether something is available", ex:"Do you have availability this weekend?"}
      ]
    },
    {
      key:"v_instructions",
      title:"Instructions & Safety",
      items:[
        {w:"to install", fr:"installer", def:"to put in place / set up", ex:"Please install the update."},
        {w:"to unplug", fr:"débrancher", def:"to disconnect from electricity", ex:"Unplug the device before cleaning."},
        {w:"warning", fr:"avertissement", def:"a message about danger", ex:"Read the warning label."},
        {w:"to comply", fr:"se conformer", def:"to follow rules", ex:"We must comply with the policy."},
        {w:"procedure", fr:"procédure", def:"a set of steps", ex:"Follow the procedure carefully."},
        {w:"to report", fr:"signaler", def:"to inform about something", ex:"Report the problem to your manager."}
      ]
    }
  ];

  const expressionsModule = {
    key:"expressions",
    title:"Ready-to-use expressions",
    subtitle:"emails • calls • meetings",
    fr:"FR: Apprends les 'chunks' (blocs) — ça fait gagner du temps à l’oral et à l’écrit.",
    chunks:[
      {en:"I’m writing to confirm…", fr:"Je vous écris pour confirmer…"},
      {en:"Could you please…?", fr:"Pourriez-vous… ?"},
      {en:"I’m afraid we can’t…", fr:"Je crains que nous ne puissions pas…"},
      {en:"We apologize for the inconvenience.", fr:"Nous nous excusons pour la gêne occasionnée."},
      {en:"As discussed, please find attached…", fr:"Comme convenu, veuillez trouver ci-joint…"},
      {en:"Would you mind…?", fr:"Est-ce que ça vous dérangerait de… ?"},
      {en:"Just to clarify…", fr:"Juste pour clarifier…"},
      {en:"Could you repeat that, please?", fr:"Pouvez-vous répéter, s’il vous plaît ?"},
    ],
    quiz:{
      title:"Practice: Choose the best expression",
      items:[
        {type:"mcq", prompt:"You need the client to repeat. Choose the best.", tag:"Phone", choices:[
          "Speak faster!",
          "Could you repeat that, please?",
          "I don’t care."
        ], answer:"Could you repeat that, please?", explain:"Polite request to repeat."},
        {type:"gap", prompt:"Complete: Please find ____ the signed contract.", tag:"Email", stem:"Please find ____ the signed contract.", answer:"attached", explain:"Common email chunk."},
        {type:"mcq", prompt:"You want to soften bad news. Choose.", tag:"Softening", choices:[
          "I’m afraid we can’t deliver today.",
          "We can't deliver today, bye.",
          "No delivery."
        ], answer:"I’m afraid we can’t deliver today.", explain:"I’m afraid… = polite softener."},
        {type:"mcq", prompt:"You refer to a previous talk. Choose.", tag:"Email", choices:[
          "As discussed, please find attached…",
          "I said it already!!!",
          "Like I told you."
        ], answer:"As discussed, please find attached…", explain:"Professional phrasing."},
        {type:"mcq", prompt:"Apologize professionally:", tag:"Apology", choices:[
          "Sorry. Whatever.",
          "We apologize for the inconvenience.",
          "It’s not my fault."
        ], answer:"We apologize for the inconvenience.", explain:"Standard apology."},
        {type:"order", prompt:"Word order.", tag:"Polite request", words:["mind","you","Would","opening","the","window","?"],
         answer:"Would you mind opening the window ?", explain:"Would you mind + -ing …?"},
      ]
    }
  };

  const readListenModule = {
    key:"readlisten",
    reading:[
      {
        title:"Reading 1: Email about a schedule change",
        text:
`Subject: Meeting rescheduled\n\nHello Ms Martin,\n\nDue to a last-minute client visit, we need to reschedule our meeting. Are you available on Thursday at 10:00? If that doesn’t work, please suggest another time.\n\nThank you,\nTisha`,
        questions:[
          {type:"mcq", prompt:"Why is the meeting rescheduled?", tag:"Detail", choices:[
            "Because of a client visit.",
            "Because of a holiday.",
            "Because of a flight delay."
          ], answer:"Because of a client visit.", explain:"It says: last-minute client visit."},
          {type:"mcq", prompt:"What does Tisha ask Ms Martin to do?", tag:"Inference", choices:[
            "Cancel the meeting forever.",
            "Confirm Thursday 10:00 or suggest another time.",
            "Send an invoice."
          ], answer:"Confirm Thursday 10:00 or suggest another time.", explain:"Available on Thursday? If not, suggest another time."},
          {type:"tf", prompt:"The tone is formal.", tag:"Tone", answer:true, explain:"Hello + Ms + polite phrasing."}
        ]
      },
      {
        title:"Reading 2: Short notice (workplace)",
        text:
`NOTICE: Maintenance\n\nOn Tuesday, the main elevator will be out of order from 9:00 to 12:00. Please use the stairs or the service elevator.\n\nThank you for your cooperation.`,
        questions:[
          {type:"mcq", prompt:"When is the main elevator not working?", tag:"Time", choices:[
            "Monday 9 to 12",
            "Tuesday 9 to 12",
            "Tuesday 12 to 9"
          ], answer:"Tuesday 9 to 12", explain:"It says Tuesday, 9:00 to 12:00."},
          {type:"mcq", prompt:"What should people do?", tag:"Instruction", choices:[
            "Use the stairs or service elevator.",
            "Call the police.",
            "Leave the building."
          ], answer:"Use the stairs or service elevator.", explain:"That’s the instruction."},
          {type:"gap", prompt:"Complete: The lift will be out of ____ .", tag:"Vocabulary", stem:"The lift will be out of ____ .", answer:"order", explain:"out of order = not working."}
        ]
      }
    ],
    listening:[
      {
        title:"Listening 1: Phone call (polite requests)",
        script:
`Reception: Good morning, Hotel Nikko. How can I help you?\nGuest: Hi. I’d like to confirm my reservation for next week.\nReception: Of course. Could you spell your last name, please?\nGuest: Yes — D O U T Y.\nReception: Thank you. Your booking is confirmed. Check-in is at 2 pm.\nGuest: Great. Could I request a quiet room?\nReception: Certainly.`,
        questions:[
          {type:"mcq", prompt:"What does the guest want first?", tag:"Main idea", choices:[
            "To cancel the reservation",
            "To confirm the reservation",
            "To complain about noise"
          ], answer:"To confirm the reservation", explain:"They say: I’d like to confirm my reservation."},
          {type:"mcq", prompt:"What time is check-in?", tag:"Detail", choices:["12 pm","2 pm","5 pm"], answer:"2 pm", explain:"Check-in is at 2 pm."},
          {type:"mcq", prompt:"What extra request does the guest make?", tag:"Detail", choices:[
            "A refund",
            "A quiet room",
            "A bigger bed"
          ], answer:"A quiet room", explain:"Could I request a quiet room?"}
        ]
      },
      {
        title:"Listening 2: Workplace update (future + obligation)",
        script:
`Manager: Quick update: tomorrow we’re switching to the new scheduling system.\nTeam member: Okay. What do we need to do?\nManager: You have to reset your password and confirm your availability for next week.\nTeam member: No problem. I’ll do it today.\nManager: Great. If you have any issues, call IT.`,
        questions:[
          {type:"mcq", prompt:"When are they switching systems?", tag:"Time", choices:["today","tomorrow","next month"], answer:"tomorrow", explain:"They say: tomorrow we’re switching…"},
          {type:"mcq", prompt:"What must the team do?", tag:"Tasks", choices:[
            "Buy new laptops",
            "Reset password and confirm availability",
            "Cancel meetings"
          ], answer:"Reset password and confirm availability", explain:"You have to reset… and confirm…"},
          {type:"mcq", prompt:"If there are issues, what should they do?", tag:"Instruction", choices:[
            "Call IT",
            "Ignore it",
            "Email the client"
          ], answer:"Call IT", explain:"call IT."}
        ]
      }
    ]
  };

  // Build a bank of mock questions for the mini mock test
  function buildMockBank(){
    const bank = [];
    function addMany(skill, items){
      items.forEach(q => bank.push(Object.assign({skill}, q)));
    }

    // from modules
    tenseModules.forEach(m => addMany("Grammar", m.quiz.items));
    addMany("Grammar", modalModule.quiz.items);
    addMany("Expressions", expressionsModule.quiz.items);

    // vocab (definitions)
    vocabSets.forEach(set=>{
      set.items.forEach(it=>{
        bank.push({
          skill:"Vocabulary",
          type:"mcq",
          prompt:`Choose the best meaning of "${it.w}".`,
          tag:set.title,
          choices: shuffle([it.fr, ...shuffle(set.items.filter(x=>x.w!==it.w).slice(0,2)).map(x=>x.fr)]),
          answer: it.fr,
          explain: `${it.w} = ${it.fr}.`
        });
      });
    });

    // reading/listening
    readListenModule.reading.forEach(r => addMany("Reading", r.questions));
    readListenModule.listening.forEach(l => addMany("Listening", l.questions));

    return bank;
  }

  // ---------- Rendering: Diagnostic ----------
  function renderDiagnostic(){
    const mount = $("#diagMount");
    mount.innerHTML = "";
    renderQuiz(mount, diagnosticQuiz);

    // after check, compute level
    // We'll infer from score once marked as done.
    // Hook into progress change by observing localStorage? We'll just compute each render.
    renderPlan();
  }

  function scoreToLevel(score){
    if(score >= 80) return "B2";
    if(score >= 60) return "B1";
    return "A2";
  }

  function renderPlan(){
    const mount = $("#planMount");
    if(!mount) return;
    mount.innerHTML = "";

    // infer diagnostic if done
    const diagProg = getProgress("diag");
    if(diagProg.done){
      const lvl = scoreToLevel(diagProg.score);
      const focus = buildFocusFromErrors(); // heuristic based on unfinished modules
      state.diagnostic = {score: diagProg.score, level:lvl, focus};
      saveState();
    }

    const lvl = currentLevel();
    const diag = state.diagnostic;

    const top = document.createElement("div");
    top.className="plan__item";
    top.innerHTML = `
      <h4>Recommended track: <span class="badge">Level ${esc(lvl)}</span></h4>
      <div class="small">Diagnostic score: <strong>${diag ? diag.score : "—"}%</strong></div>
      <div class="small muted frhelp">FR: Niveau recommandé d’après le mini test.</div>
    `;
    mount.appendChild(top);

    const list = document.createElement("div");
    list.className="plan__item";
    const steps = planStepsForLevel(lvl);
    list.innerHTML = `
      <h4>Your step-by-step plan</h4>
      <ul>${steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ul>
      <div class="small muted frhelp">FR: Fais les modules dans cet ordre (même si tu vas vite).</div>
    `;
    mount.appendChild(list);

    const focusBox = document.createElement("div");
    focusBox.className="plan__item";
    const focus = (diag && diag.focus && diag.focus.length) ? diag.focus : ["Verb tenses accuracy", "Polite requests", "Email chunks"];
    focusBox.innerHTML = `
      <h4>Focus points (this week)</h4>
      <ul>${focus.slice(0,6).map(s=>`<li>${esc(s)}</li>`).join("")}</ul>
    `;
    mount.appendChild(focusBox);
  }

  function planStepsForLevel(lvl){
    if(lvl==="A2"){
      return [
        "Verb tenses: Present Simple vs Continuous",
        "Past Simple basics (+ irregular verbs)",
        "Future: going to / will",
        "Modals: can / could / have to / should",
        "Core vocabulary: Email + Meetings + Customer service",
        "Mini mock test (repeat 2×)",
        "Oral prep: intro + simple role-play"
      ];
    }
    if(lvl==="B1"){
      return [
        "Verb tenses: Past Simple vs Past Continuous",
        "Present Perfect vs Past Simple (since/for/already/yet)",
        "Future: arrangements vs plans vs promises",
        "Conditionals: first (If + present, will…)",
        "Vocabulary: Workplace instructions + complaints",
        "Read & Listen (timed)",
        "Oral prep: role-play + discussion"
      ];
    }
    return [
      "Present Perfect mastery (difference + accuracy)",
      "Conditionals (1st + 2nd) + advanced connectors",
      "Modal nuance (have to vs must; might vs must)",
      "Professional email precision (tone + clarity)",
      "Read & Listen under time pressure",
      "Mini mock test (target ≥ 80%)",
      "Oral prep: develop answers with examples & opinions"
    ];
  }

  function buildFocusFromErrors(){
    // Simple heuristic: suggest modules not yet done or low score
    const focus = [];
    tenseModules.forEach(m=>{
      const p = getProgress(m.key);
      if(!p.done) focus.push(m.title);
      else if(p.score < 70) focus.push(`${m.title} (accuracy)`);
    });
    const mp = getProgress(modalModule.key);
    if(!mp.done || mp.score < 70) focus.push("Modals (must/have to/should)");
    const ep = getProgress(expressionsModule.key);
    if(!ep.done || ep.score < 70) focus.push("Email & expressions");
    return focus;
  }

  // ---------- Rendering: Tenses ----------
  function renderTenses(){
    const mount = $("#tensesMount");
    mount.innerHTML = "";

    const tabs = document.createElement("div");
    tabs.className = "tabs";
    mount.appendChild(tabs);

    const panel = document.createElement("div");
    mount.appendChild(panel);

    let active = 0;

    function renderActive(){
      panel.innerHTML = "";
      const m = tenseModules[active];
      const box = document.createElement("div");
      box.className = "pane";
      box.innerHTML = `
        <div class="row row--between">
          <div>
            <div class="badge">⏱️ ${esc(m.subtitle)}</div>
            <h3 style="margin:10px 0 0">${esc(m.title)}</h3>
            <div class="small muted frhelp">${esc(m.fr)}</div>
          </div>
          <div class="row">
            <button class="btn btn--ghost" type="button" id="btnSpeakEx">Listen examples</button>
            <button class="btn" type="button" id="btnJumpQuiz">Start practice</button>
          </div>
        </div>
        <div class="divider"></div>
        <div class="grid2">
          <div class="card">
            <h4 class="card__title">Mini lesson</h4>
            <ul class="steps">${m.lesson.bullets.map(b=>`<li>${esc(b)}</li>`).join("")}</ul>
          </div>
          <div class="card card--soft">
            <h4 class="card__title">Examples</h4>
            <table class="table" aria-label="Examples table">
              <thead><tr><th>Example</th><th>Why</th></tr></thead>
              <tbody>
                ${m.lesson.examples.map(e=>`<tr><td>${esc(e[0])}</td><td>${esc(e[1])}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>
        </div>
        <div class="divider"></div>
        <div id="quizMount"></div>
      `;
      panel.appendChild(box);

      $("#btnSpeakEx", box).addEventListener("click", ()=>{
        const lines = m.lesson.examples.map(e=>e[0]).join(" ");
        speak(lines, state.accent);
      });
      $("#btnJumpQuiz", box).addEventListener("click", ()=>{
        $("#quizMount", box).scrollIntoView({behavior:"smooth", block:"start"});
      });

      const qm = $("#quizMount", box);
      renderQuiz(qm, Object.assign({key:m.key, fr:m.fr, title:m.quiz.title, subtitle:"CLOE-style: MCQ, gap-fill, word order"}, m.quiz));
    }

    tenseModules.forEach((m, idx)=>{
      const b = document.createElement("button");
      b.type="button";
      b.className="tab";
      b.textContent = (idx+1) + ". " + m.title.split("(")[0].trim();
      b.setAttribute("aria-selected", idx===active ? "true" : "false");
      b.addEventListener("click", ()=>{
        active = idx;
        $$(".tab", tabs).forEach((t,i)=>t.setAttribute("aria-selected", i===active ? "true" : "false"));
        renderActive();
      });
      tabs.appendChild(b);
    });

    renderActive();
  }

  // ---------- Rendering: Modals ----------
  function renderModals(){
    const mount = $("#modalsMount");
    mount.innerHTML = "";

    const box = document.createElement("div");
    box.className = "pane";
    box.innerHTML = `
      <div class="row row--between">
        <div>
          <div class="badge">🧩 obligation • advice • permission</div>
          <h3 style="margin:10px 0 0">${esc(modalModule.title)}</h3>
          <div class="small muted frhelp">${esc(modalModule.fr)}</div>
        </div>
        <div class="row">
          <button class="btn btn--ghost" id="btnSpeakModals" type="button">Listen examples</button>
        </div>
      </div>
      <div class="divider"></div>
      <div class="grid2">
        <div class="card">
          <h4 class="card__title">Mini lesson</h4>
          <ul class="steps">${modalModule.lesson.bullets.map(b=>`<li>${esc(b)}</li>`).join("")}</ul>
        </div>
        <div class="card card--soft">
          <h4 class="card__title">Examples</h4>
          <table class="table">
            <thead><tr><th>Example</th><th>Use</th></tr></thead>
            <tbody>${modalModule.lesson.examples.map(e=>`<tr><td>${esc(e[0])}</td><td>${esc(e[1])}</td></tr>`).join("")}</tbody>
          </table>
        </div>
      </div>
      <div class="divider"></div>
      <div id="quizMount"></div>
    `;
    mount.appendChild(box);
    $("#btnSpeakModals", box).addEventListener("click", ()=>{
      speak(modalModule.lesson.examples.map(e=>e[0]).join(" "), state.accent);
    });
    renderQuiz($("#quizMount", box), Object.assign({key:modalModule.key, fr:modalModule.fr, title:modalModule.quiz.title, subtitle:"CLOE-style practice"}, modalModule.quiz));
  }

  // ---------- Vocabulary ----------
  function renderVocabulary(){
    const mount = $("#vocabMount");
    mount.innerHTML = "";

    const tabs = document.createElement("div");
    tabs.className = "tabs";
    mount.appendChild(tabs);

    const panel = document.createElement("div");
    mount.appendChild(panel);

    let active = 0;
    function renderSet(){
      panel.innerHTML = "";
      const set = vocabSets[active];

      const header = document.createElement("div");
      header.className="pane";
      header.innerHTML = `
        <div class="row row--between">
          <div>
            <div class="badge">📚 ${esc(set.title)}</div>
            <div class="small muted frhelp">FR: Clique pour voir la traduction + exemple.</div>
          </div>
          <div class="row">
            <button class="btn btn--ghost" type="button" id="btnSpeakSet">Listen all</button>
            <button class="btn" type="button" id="btnPracticeVocab">Practice</button>
          </div>
        </div>
        <div class="divider"></div>
        <div class="flashGrid" id="cards"></div>
        <div class="divider"></div>
        <div id="practice"></div>
      `;
      panel.appendChild(header);

      const cards = $("#cards", header);
      set.items.forEach(it=>{
        const c = document.createElement("div");
        c.className="flash";
        c.setAttribute("role","button");
        c.setAttribute("tabindex","0");
        c.setAttribute("aria-expanded","false");
        c.innerHTML = `
          <div class="flash__front">${esc(it.w)}</div>
          <div class="flash__back">
            <div><strong>FR:</strong> ${esc(it.fr)}</div>
            <div><strong>Meaning:</strong> ${esc(it.def)}</div>
            <div><strong>Example:</strong> ${esc(it.ex)}</div>
            <div class="row" style="margin-top:10px">
              <button class="btn btn--ghost btnListen" type="button">Listen</button>
            </div>
          </div>
        `;
        function toggle(){
          const on = c.getAttribute("aria-expanded")==="true";
          c.setAttribute("aria-expanded", on ? "false":"true");
        }
        c.addEventListener("click", (e)=>{
          // don't toggle when pressing inner button
          if(e.target && e.target.classList && e.target.classList.contains("btnListen")) return;
          toggle();
        });
        c.addEventListener("keydown", (e)=>{
          if(e.key==="Enter" || e.key===" "){ e.preventDefault(); toggle(); }
        });
        $(".btnListen", c).addEventListener("click", (e)=>{
          e.stopPropagation();
          speak(`${it.w}. ${it.ex}`, state.accent);
        });
        cards.appendChild(c);
      });

      $("#btnSpeakSet", header).addEventListener("click", ()=>{
        speak(set.items.map(it=>`${it.w}. ${it.ex}`).join(" "), state.accent);
      });

      $("#btnPracticeVocab", header).addEventListener("click", ()=>{
        $("#practice", header).scrollIntoView({behavior:"smooth", block:"start"});
        toast("Practice: choose the correct French meaning.");
      });

      // Practice: MCQ meanings (6 questions)
      const practiceQuiz = {
        key: set.key,
        title: "Vocab practice: meanings",
        subtitle: "Quick MCQ (CLOE style)",
        fr: "FR: Choisis la bonne traduction.",
        items: set.items.map(it=>{
          const distractors = shuffle(set.items.filter(x=>x.w!==it.w)).slice(0,2).map(x=>x.fr);
          return {
            type:"mcq",
            prompt:`"${it.w}" means…`,
            tag:set.title,
            choices: shuffle([it.fr, ...distractors]),
            answer: it.fr,
            explain: `${it.w} = ${it.fr}. Example: ${it.ex}`
          };
        })
      };
      renderQuiz($("#practice", header), practiceQuiz);
    }

    vocabSets.forEach((set, idx)=>{
      const b = document.createElement("button");
      b.type="button";
      b.className="tab";
      b.textContent = set.title;
      b.setAttribute("aria-selected", idx===active ? "true" : "false");
      b.addEventListener("click", ()=>{
        active=idx;
        $$(".tab", tabs).forEach((t,i)=>t.setAttribute("aria-selected", i===active ? "true":"false"));
        renderSet();
      });
      tabs.appendChild(b);
    });

    renderSet();
  }

  // ---------- Expressions ----------
  function renderExpressions(){
    const mount = $("#exprMount");
    mount.innerHTML = "";

    const box = document.createElement("div");
    box.className="pane";
    box.innerHTML = `
      <div class="row row--between">
        <div>
          <div class="badge">✉️ + ☎️</div>
          <h3 style="margin:10px 0 0">${esc(expressionsModule.title)}</h3>
          <div class="small muted">${esc(expressionsModule.subtitle || "")}</div>
          <div class="small muted frhelp">${esc(expressionsModule.fr)}</div>
        </div>
        <div class="row">
          <button class="btn btn--ghost" id="btnSpeakChunks" type="button">Listen chunks</button>
        </div>
      </div>
      <div class="divider"></div>
      <table class="table" aria-label="Expression chunks">
        <thead><tr><th>English chunk</th><th>French</th></tr></thead>
        <tbody>
          ${expressionsModule.chunks.map(c=>`<tr><td>${esc(c.en)}</td><td>${esc(c.fr)}</td></tr>`).join("")}
        </tbody>
      </table>
      <div class="divider"></div>
      <div id="quizMount"></div>
    `;
    mount.appendChild(box);
    $("#btnSpeakChunks", box).addEventListener("click", ()=>{
      speak(expressionsModule.chunks.map(c=>c.en).join(" "), state.accent);
    });
    renderQuiz($("#quizMount", box), Object.assign({key:expressionsModule.key, fr:expressionsModule.fr, title:expressionsModule.quiz.title, subtitle:"CLOE-style practice"}, expressionsModule.quiz));
  }

  // ---------- Reading + Listening ----------
  function renderReadListen(){
    const mount = $("#rlMount");
    mount.innerHTML = "";

    const outer = document.createElement("div");
    outer.className="pane";
    outer.innerHTML = `
      <div class="row row--between">
        <div>
          <div class="badge">📖 + 🔊</div>
          <h3 style="margin:10px 0 0">Short tasks (timed)</h3>
          <div class="small muted">Practice reading details + listening under time pressure.</div>
          <div class="small muted frhelp">FR: Lis/écoute une fois, puis réponds vite.</div>
        </div>
        <div class="row">
          <button class="btn btn--ghost" id="btnSpeakTip" type="button">Pronunciation tip</button>
        </div>
      </div>
      <div class="divider"></div>
      <div class="grid2">
        <div class="card" id="readCol">
          <h4 class="card__title">Reading</h4>
        </div>
        <div class="card" id="listenCol">
          <h4 class="card__title">Listening</h4>
        </div>
      </div>
    `;
    mount.appendChild(outer);
    $("#btnSpeakTip", outer).addEventListener("click", ()=>{
      speak("Remember: final S is often silent in French, but not in English. For example: works, needs, wants.", state.accent);
    });

    const readCol = $("#readCol", outer);
    readListenModule.reading.forEach((r, i)=>{
      const block = document.createElement("div");
      block.className="pane";
      block.innerHTML = `
        <div class="row row--between">
          <div><div class="badge">Reading ${i+1}</div><h5 style="margin:8px 0 0">${esc(r.title)}</h5></div>
          <div class="row"><button class="btn btn--ghost btnCopy" type="button">Copy text</button></div>
        </div>
        <div class="divider"></div>
        <pre class="small" style="white-space:pre-wrap; margin:0; padding:12px; border-radius:14px; border:1px solid var(--line); background: var(--panel2);">${esc(r.text)}</pre>
        <div class="divider"></div>
        <div class="quizMount"></div>
      `;
      $(".btnCopy", block).addEventListener("click", ()=>{
        navigator.clipboard?.writeText(r.text);
        toast("Copied.");
      });
      renderQuiz($(".quizMount", block), {key:`read_${i}`, title:`Reading quiz ${i+1}`, subtitle:"MCQ + T/F", items:r.questions, fr:"FR: Réponds aux questions."});
      readCol.appendChild(block);
    });

    const listenCol = $("#listenCol", outer);
    readListenModule.listening.forEach((l, i)=>{
      const block = document.createElement("div");
      block.className="pane";
      block.innerHTML = `
        <div class="row row--between">
          <div><div class="badge">Listening ${i+1}</div><h5 style="margin:8px 0 0">${esc(l.title)}</h5></div>
          <div class="row">
            <button class="btn btn--ghost btnListen" type="button">Listen</button>
            <button class="btn btn--ghost btnTranscript" type="button" aria-expanded="false">Transcript</button>
          </div>
        </div>
        <div class="divider"></div>
        <div class="transcript" style="display:none">
          <pre class="small" style="white-space:pre-wrap; margin:0; padding:12px; border-radius:14px; border:1px solid var(--line); background: var(--panel2);">${esc(l.script)}</pre>
          <div class="divider"></div>
        </div>
        <div class="quizMount"></div>
      `;
      $(".btnListen", block).addEventListener("click", ()=>{
        speak(l.script.replace(/\n/g," "), state.accent);
      });
      $(".btnTranscript", block).addEventListener("click", (e)=>{
        const btn = e.currentTarget;
        const isOpen = btn.getAttribute("aria-expanded")==="true";
        btn.setAttribute("aria-expanded", isOpen ? "false":"true");
        $(".transcript", block).style.display = isOpen ? "none" : "block";
      });
      renderQuiz($(".quizMount", block), {key:`listen_${i}`, title:`Listening quiz ${i+1}`, subtitle:"MCQ", items:l.questions, fr:"FR: Réponds aux questions."});
      listenCol.appendChild(block);
    });
  }

  // ---------- Mini mock test ----------
  function renderMock(){
    const mount = $("#mockMount");
    mount.innerHTML = "";

    const bank = buildMockBank();
    const MOCK_N = 20;

    const box = document.createElement("div");
    box.className="pane";
    box.innerHTML = `
      <div class="row row--between">
        <div>
          <div class="badge">🧪 timed practice</div>
          <h3 style="margin:10px 0 0">Mini mock test (${MOCK_N} questions)</h3>
          <div class="small muted">Questions are random each time. Results are stored.</div>
          <div class="small muted frhelp">FR: Refaire 2-3 fois pour voir ta progression.</div>
        </div>
        <div class="row">
          <button class="btn btn--primary" id="btnStart" type="button">Start</button>
          <button class="btn btn--ghost" id="btnHistory" type="button" aria-expanded="false">History</button>
        </div>
      </div>
      <div class="divider"></div>
      <div id="stage"></div>
      <div id="history" style="display:none"></div>
    `;
    mount.appendChild(box);

    const stage = $("#stage", box);
    const hist = $("#history", box);

    function renderHistory(){
      hist.innerHTML = "";
      const items = state.mockHistory || [];
      if(items.length===0){
        hist.innerHTML = `<div class="small muted">No attempts yet.</div>`;
        return;
      }
      const rows = items.slice().reverse().slice(0,8).map(it=>{
        const d = new Date(it.ts);
        return `<tr><td>${d.toLocaleString()}</td><td>${esc(it.level)}</td><td>${it.score}%</td><td>${esc(it.breakdown)}</td></tr>`;
      }).join("");
      hist.innerHTML = `
        <table class="table">
          <thead><tr><th>Date</th><th>Level</th><th>Score</th><th>Breakdown</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }
    renderHistory();

    $("#btnHistory", box).addEventListener("click", (e)=>{
      const btn = e.currentTarget;
      const open = btn.getAttribute("aria-expanded")==="true";
      btn.setAttribute("aria-expanded", open ? "false":"true");
      hist.style.display = open ? "none" : "block";
      if(!open) renderHistory();
    });

    $("#btnStart", box).addEventListener("click", ()=>{
      startMock();
    });

    function startMock(){
      const level = currentLevel();
      const pool = filterBankByLevel(bank, level);
      const chosen = shuffle(pool).slice(0, MOCK_N);
      let idx = 0;
      let correct = 0;
      const perSkill = {};
      let tLeft = 30; // per question default

      stage.innerHTML = "";
      const qBox = document.createElement("div");
      qBox.className="pane";
      stage.appendChild(qBox);

      function renderQ(){
        const q = chosen[idx];
        const skill = q.skill || "Mixed";
        const header = `
          <div class="row row--between">
            <div>
              <div class="badge">${esc(skill)}</div>
              <div class="small muted">Question ${idx+1}/${MOCK_N} • Level ${esc(level)}</div>
            </div>
            <div style="min-width:180px">
              <div class="small">Score: <strong>${correct}</strong> / ${idx}</div>
              <div class="small" id="timerLine" style="color:var(--muted)"></div>
            </div>
          </div>
          <div class="divider"></div>
        `;
        qBox.innerHTML = header;

        // render question standalone
        const qMount = document.createElement("div");
        qBox.appendChild(qMount);

        const rendered = renderQuestion(qMount, q, 1); // returns {isCorrect, reset}
        // override feedback: only show after submit
        $(".qfb", qMount).style.display = "none";

        const actions = document.createElement("div");
        actions.className="row";
        actions.style.marginTop="12px";
        actions.innerHTML = `
          <button class="btn btn--primary" type="button" id="btnSubmit">Submit</button>
          <button class="btn btn--ghost" type="button" id="btnSkip">Skip</button>
        `;
        qBox.appendChild(actions);

        let timer = null;
        function setTimerText(){
          const el = $("#timerLine", qBox);
          if(!state.timers){ el.textContent = "Timer: off"; return; }
          el.textContent = "Time left: " + tLeft + "s";
          if(tLeft<=8) el.style.color = "var(--warn)";
          if(tLeft<=4) el.style.color = "var(--danger)";
        }
        function startTimer(){
          tLeft = 30;
          setTimerText();
          if(!state.timers) return;
          timer = setInterval(()=>{
            tLeft--;
            setTimerText();
            if(tLeft<=0){
              clearInterval(timer);
              next(false, true);
            }
          }, 1000);
        }
        startTimer();

        $("#btnSubmit", actions).addEventListener("click", ()=>{
          const ok = rendered.isCorrect();
          next(ok, false);
        });
        $("#btnSkip", actions).addEventListener("click", ()=>{
          next(false, false, true);
        });

        function next(ok, timedOut, skipped){
          if(timer) clearInterval(timer);
          perSkill[skill] = perSkill[skill] || {c:0, t:0};
          perSkill[skill].t++;
          if(ok){ correct++; perSkill[skill].c++; }
          idx++;
          if(idx >= MOCK_N){
            finish();
          }else{
            renderQ();
          }
          if(timedOut) toast("Time! Next question.");
          if(skipped) toast("Skipped.");
        }
      }

      function finish(){
        const score = Math.round((correct/MOCK_N)*100);
        const breakdown = Object.keys(perSkill).map(k=>{
          const s = perSkill[k];
          return `${k}: ${s.c}/${s.t}`;
        }).join(" • ");

        state.mockHistory = state.mockHistory || [];
        state.mockHistory.push({ts:Date.now(), level, score, breakdown});
        saveState();

        qBox.innerHTML = `
          <div class="row row--between">
            <div>
              <div class="badge">✅ finished</div>
              <h4 style="margin:10px 0 0">Your score: ${score}%</h4>
              <div class="small muted">${esc(breakdown)}</div>
            </div>
            <div class="row">
              <button class="btn btn--primary" id="btnAgain" type="button">Try again</button>
              <button class="btn btn--ghost" id="btnToOral" type="button">Go to oral prep</button>
            </div>
          </div>
          <div class="divider"></div>
          <div class="feedback ${score>=80?"feedback--ok":(score>=55?"":"feedback--bad")}">
            ${score>=80
              ? "<strong>Nice!</strong> You’re in a strong position. Focus on your weakest skill from the breakdown."
              : "<strong>Keep training.</strong> Repeat the tenses and expressions modules, then redo the mock test."
            }
            <div class="small muted frhelp">FR: Objectif conseillé : ≥ 80% sur la simulation.</div>
          </div>
        `;
        $("#btnAgain", qBox).addEventListener("click", startMock);
        $("#btnToOral", qBox).addEventListener("click", ()=>$("#s8").scrollIntoView({behavior:"smooth"}));

        renderHistory();
      }

      renderQ();
    }

    function filterBankByLevel(bank, level){
      // rough: for A2 remove tricky advanced items (second conditional, etc.)
      if(level==="A2"){
        return bank.filter(q=>{
          const t = (q.tag||"") + " " + (q.prompt||"") + " " + (q.stem||"");
          const low = t.toLowerCase();
          if(low.includes("2nd conditional") || low.includes("second") || low.includes("were you")) return false;
          if(low.includes("already") && low.includes("yet")) return true; // ok
          return true;
        });
      }
      if(level==="B1"){
        return bank.filter(q=>{
          const low = ((q.tag||"") + " " + (q.prompt||"")).toLowerCase();
          // keep most; exclude nothing
          return true;
        });
      }
      return bank;
    }
  }

  // ---------- Oral prep ----------
  function renderOral(){
    const mount = $("#oralMount");
    mount.innerHTML = "";

    const box = document.createElement("div");
    box.className="pane";
    box.innerHTML = `
      <div class="row row--between">
        <div>
          <div class="badge">🎙️ intro • role-play • discussion</div>
          <h3 style="margin:10px 0 0">Oral prompt generator</h3>
          <div class="small muted">Click “New prompt” to generate a CLOE-style speaking task. Aim for 2–3 minutes per answer.</div>
          <div class="small muted frhelp">FR: Développe tes réponses : pourquoi + exemple + détail.</div>
        </div>
        <div class="row">
          <button class="btn btn--primary" id="btnNew" type="button">New prompt</button>
          <button class="btn btn--ghost" id="btnListenPrompt" type="button">Listen</button>
        </div>
      </div>
      <div class="divider"></div>

      <div class="grid2">
        <div class="card">
          <h4 class="card__title">Your prompt</h4>
          <div id="promptBox" class="small" style="line-height:1.6"></div>
          <div class="divider"></div>
          <div class="row">
            <button class="btn" id="btnTimer2" type="button">2:00 timer</button>
            <button class="btn" id="btnTimer3" type="button">3:00 timer</button>
            <button class="btn btn--ghost" id="btnStopTimer" type="button">Stop</button>
            <div class="badge" id="timerOut" style="margin-left:auto">Timer: 0:00</div>
          </div>
          <div class="small muted frhelp" style="margin-top:10px">FR: Structure: 1) answer 2) explain 3) give an example 4) conclude.</div>
        </div>

        <div class="card card--soft">
          <h4 class="card__title">Self-check (what the evaluator listens for)</h4>
          <ul class="steps">
            <li>Clear grammar & sentence structure</li>
            <li>Enough vocabulary for your topic</li>
            <li>Fluency: don’t stop too much</li>
            <li>Pronunciation & intonation</li>
            <li>Interaction: ask a question back</li>
          </ul>

          <div class="divider"></div>
          <div class="small">
            <strong>Mini trick:</strong> If you don’t understand, say:
            <em>“Sorry, could you repeat that, please?”</em>
          </div>

          <div class="divider"></div>
          <div class="small frhelp">
            <strong>FR:</strong> Si tu bloques: reformule, utilise des connecteurs (because, so, however), et pose une question.
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="card">
        <h4 class="card__title">Optional: record yourself (if supported)</h4>
        <div class="small muted">This uses your browser microphone. If it doesn’t work on iPad Safari, use the Voice Memos app instead.</div>
        <div class="small muted frhelp">FR: Si l’enregistrement ne marche pas, utilise Dictaphone sur iPhone/iPad.</div>

        <div class="row" style="margin-top:12px">
          <button class="btn btn--primary" id="recStart" type="button">Start recording</button>
          <button class="btn" id="recStop" type="button" disabled>Stop</button>
          <button class="btn btn--ghost" id="recClear" type="button" disabled>Clear</button>
          <div class="badge" id="recStatus" style="margin-left:auto">Idle</div>
        </div>
        <audio id="recPlayback" controls style="width:100%; margin-top:12px; display:none"></audio>
      </div>
    `;
    mount.appendChild(box);

    const promptBox = $("#promptBox", box);
    const prompts = makeOralPrompts();

    function newPrompt(){
      const p = prompts[Math.floor(Math.random()*prompts.length)];
      promptBox.innerHTML = `
        <strong>Part 1 (intro questions):</strong><br>${esc(p.intro)}<br><br>
        <strong>Part 2 (role-play):</strong><br>${esc(p.role)}<br><br>
        <strong>Part 3 (discussion):</strong><br>${esc(p.discuss)}<br>
      `;
      promptBox.dataset.raw = `Part 1: ${p.intro}. Part 2: ${p.role}. Part 3: ${p.discuss}.`;
      toast("New prompt generated.");
    }
    newPrompt();

    $("#btnNew", box).addEventListener("click", newPrompt);
    $("#btnListenPrompt", box).addEventListener("click", ()=>{
      speak(promptBox.dataset.raw || promptBox.textContent, state.accent);
    });

    // timer
    let timer = null;
    let t = 0;
    const out = $("#timerOut", box);
    function renderTimer(){
      const m = Math.floor(t/60);
      const s = String(t%60).padStart(2,"0");
      out.textContent = `Timer: ${m}:${s}`;
    }
    function startTimer(seconds){
      if(timer) clearInterval(timer);
      t = seconds;
      renderTimer();
      timer = setInterval(()=>{
        t--;
        renderTimer();
        if(t<=0){
          clearInterval(timer);
          timer=null;
          toast("Time!");
          speak("Time is up.", state.accent);
        }
      }, 1000);
    }
    $("#btnTimer2", box).addEventListener("click", ()=>startTimer(120));
    $("#btnTimer3", box).addEventListener("click", ()=>startTimer(180));
    $("#btnStopTimer", box).addEventListener("click", ()=>{
      if(timer) clearInterval(timer);
      timer=null;
      t=0; renderTimer();
    });
    renderTimer();

    // recorder
    const recStart = $("#recStart", box);
    const recStop = $("#recStop", box);
    const recClear = $("#recClear", box);
    const recStatus = $("#recStatus", box);
    const playback = $("#recPlayback", box);

    let mediaRecorder = null;
    let chunks = [];

    function setRecUI(status){
      recStatus.textContent = status;
    }

    async function startRec(){
      if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
        toast("Recording not supported here.");
        return;
      }
      try{
        const stream = await navigator.mediaDevices.getUserMedia({audio:true});
        const options = {};
        mediaRecorder = new MediaRecorder(stream, options);
        chunks = [];
        mediaRecorder.ondataavailable = (e)=>{ if(e.data && e.data.size>0) chunks.push(e.data); };
        mediaRecorder.onstop = ()=>{
          const blob = new Blob(chunks, {type: chunks[0]?.type || "audio/webm"});
          const url = URL.createObjectURL(blob);
          playback.src = url;
          playback.style.display = "block";
          recClear.disabled = false;
          // stop all tracks
          stream.getTracks().forEach(t=>t.stop());
        };
        mediaRecorder.start();
        setRecUI("Recording…");
        recStart.disabled = true;
        recStop.disabled = false;
        recClear.disabled = true;
      }catch(err){
        toast("Microphone permission denied.");
        setRecUI("Mic denied");
      }
    }

    function stopRec(){
      if(mediaRecorder && mediaRecorder.state !== "inactive"){
        mediaRecorder.stop();
        setRecUI("Recorded ✅");
        recStart.disabled = false;
        recStop.disabled = true;
      }
    }
    function clearRec(){
      playback.pause();
      playback.removeAttribute("src");
      playback.style.display="none";
      recClear.disabled = true;
      setRecUI("Idle");
    }

    recStart.addEventListener("click", startRec);
    recStop.addEventListener("click", stopRec);
    recClear.addEventListener("click", clearRec);
  }

  function makeOralPrompts(){
    const roles = [
      "You are calling a hotel to change your reservation dates. Ask politely and confirm the new dates.",
      "You are at reception. A guest complains about noise. Apologize and offer two solutions.",
      "You need to reschedule a meeting with a client. Suggest two options and confirm the final time.",
      "Your colleague forgot to attach a file. Ask them politely to resend it and confirm the deadline.",
      "You are onboarding a new employee. Explain two rules and answer one question.",
      "A customer wants a refund. Explain the procedure and propose an alternative.",
    ];
    const discusses = [
      "Discuss remote work: advantages and disadvantages. Give examples from your experience.",
      "Discuss customer service: what makes a good service in your opinion?",
      "Discuss time management at work: how do you organize your week?",
      "Discuss travel for work: do you prefer business trips or online meetings? Why?",
      "Discuss learning English for work: what helps you progress fastest?",
      "Discuss cultural differences in communication (email tone, directness, politeness).",
    ];
    const intros = [
      "Please introduce yourself and describe your job (tasks, responsibilities, schedule).",
      "Tell me about a typical day at work. What do you do first, then next?",
      "Describe a recent problem at work and how you solved it.",
      "Tell me about a project you are working on and your next steps.",
      "What are your strengths at work? What would you like to improve?",
    ];

    const out = [];
    for(let i=0;i<18;i++){
      out.push({
        intro: intros[i % intros.length],
        role: roles[(i*3) % roles.length],
        discuss: discusses[(i*5) % discusses.length]
      });
    }
    return shuffle(out);
  }

  // ---------- Render all ----------
  function renderAll(){
    renderNav();
    renderDiagnostic();
    renderTenses();
    renderModals();
    renderVocabulary();
    renderExpressions();
    renderReadListen();
    renderMock();
    renderOral();
    applyFRHelp();
  }

  // ---------- init ----------
  initTopbar();
  renderAll();

})();
