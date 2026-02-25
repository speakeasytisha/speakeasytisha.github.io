/* SpeakEasyTisha • US Health Care for French Expats
   - Tap friendly (no required drag)
   - Instant feedback + score
   - Optional TTS with accent toggle
*/
(function(){
  "use strict";

  // ---------- Helpers ----------
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const clamp = (n,min,max)=>Math.max(min,Math.min(max,n));
  const norm = (s)=>String(s||"").trim().toLowerCase().replace(/\s+/g," ");
  const escapeHtml = (s)=>String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  // ---------- Score ----------
  const score = { now:0, total:0, seen:new Set() };
  const setScore = ()=>{
    $("#scoreNow").textContent = String(score.now);
    $("#scoreTotal").textContent = String(score.total);
  };
  const bumpTotal = (key)=>{
    if(score.seen.has(key)) return;
    score.seen.add(key);
    score.total += 1;
    setScore();
  };
  const bumpCorrect = (key)=>{
    if(score.seen.has(key + "::correct")) return;
    score.seen.add(key + "::correct");
    score.now += 1;
    setScore();
  };

  // ---------- TTS ----------
  let ttsAccent = "en-US";
  let ttsRate = 1.0;

  const speak = (text)=>{
    try{
      if(!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = ttsAccent;
      u.rate = ttsRate;

      // Try to pick a matching voice (best effort)
      const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
      if(voices && voices.length){
        const v = voices.find(v => (v.lang||"").toLowerCase().startsWith(ttsAccent.toLowerCase()));
        if(v) u.voice = v;
      }
      window.speechSynthesis.speak(u);
    }catch(e){}
  };
  const stopSpeak = ()=>{ try{ if("speechSynthesis" in window) window.speechSynthesis.cancel(); }catch(e){} };

  $$(".pill[data-accent]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      $$(".pill[data-accent]").forEach(b=>b.classList.remove("is-on"));
      btn.classList.add("is-on");
      ttsAccent = btn.getAttribute("data-accent") || "en-US";
    });
  });
  $("#speed").addEventListener("input", (e)=>{
    ttsRate = parseFloat(e.target.value || "1");
    $("#speedVal").textContent = ttsRate.toFixed(2) + "×";
  });
  $("#ttsTest").addEventListener("click", ()=> speak("Hi! This is your lesson voice. You can switch accents and speed."));
  $("#ttsStop").addEventListener("click", stopSpeak);

  // Safari sometimes loads voices async
  if("speechSynthesis" in window){
    window.speechSynthesis.onvoiceschanged = ()=>{};
  }

  // ---------- Timer ----------
  let timerId = null;
  let remaining = 60*60; // seconds
  const renderTimer = ()=>{
    const mm = String(Math.floor(remaining/60)).padStart(2,"0");
    const ss = String(remaining%60).padStart(2,"0");
    $("#timerDisplay").textContent = "⏳ " + mm + ":" + ss;
  };
  const resetTimer = ()=>{
    if(timerId) clearInterval(timerId);
    timerId = null;
    remaining = 60*60;
    renderTimer();
  };
  $("#startTimer").addEventListener("click", ()=>{
    if(timerId) return;
    timerId = setInterval(()=>{
      remaining = Math.max(0, remaining-1);
      renderTimer();
      if(remaining<=0){ clearInterval(timerId); timerId=null; }
    }, 1000);
  });
  $("#resetTimer").addEventListener("click", resetTimer);
  renderTimer();

  // ---------- Global reset ----------
  const resetAll = ()=>{
    stopSpeak();
    resetTimer();
    score.now = 0; score.total = 0; score.seen = new Set();
    setScore();
    // reinit
    initMyths(true);
    renderVocab("all", true);
    newVocabQcm();
    newCfeQuiz();
    renderGlossary();
    newSortSet();
    setupBuilder($("#order1"), ORDER_SENTENCES[0]);
    renderCompare();
    setScenario("kids");
    renderCompGaps(true);
    renderModalGaps(true);
    newOopQcm();
    newEob();
    newCall();
    newEr();
    newSuper();
    newUpgrade();
    $("#finalOut").textContent = "Click “Generate script”.";
    $("#hrEmail").textContent = "Click “Generate script” first.";
  };
  $("#resetAll").addEventListener("click", resetAll);

  // ---------- Key lines listen ----------
  const KEY_LINES = [
    "Are you in-network?",
    "Do I need a referral to see a specialist?",
    "What's my deductible and out-of-pocket maximum?",
    "Is this covered, and what will I pay?",
    "Can you send me an itemized bill?"
  ];
  $("#listenKey").addEventListener("click", ()=> speak(KEY_LINES.join(" ... ")));
  $("#listenCheat").addEventListener("click", ()=> speak(KEY_LINES.join(" ... ")));

  // ---------- Warm-up myths ----------
  const MYTHS = [
    { t:"In the U.S., an emergency room visit can lead to a very large bill, even if you have insurance.", a:true, h:"Insurance helps, but you can still pay deductible/coinsurance, and out-of-network issues can happen." },
    { t:"A deductible is the amount you pay every month to keep your insurance active.", a:false, h:"That’s the premium. Deductible is what you pay before your plan starts sharing costs." },
    { t:"An HMO usually won’t cover out-of-network care (except emergencies).", a:true, h:"The network is a big deal in HMOs." },
    { t:"If something is ‘covered,’ it always means it is free.", a:false, h:"Covered means ‘eligible under the plan rules.’ You may still pay copay/coinsurance." },
    { t:"You should always check if a doctor, lab, and hospital are in-network before non-emergency care.", a:true, h:"A common billing surprise: the hospital is in-network, but a provider inside is not." },
    { t:"Out-of-pocket maximum includes premiums.", a:false, h:"Premiums usually do not count toward out-of-pocket maximum." }
  ];
  let mythIndex = -1;

  const initMyths = (silent)=>{
    mythIndex = -1;
    $("#mythText").textContent = "Click “New”.";
    $("#mythFeedback").textContent = "";
    $("#mythHint").textContent = "";
    $$(".choice", $("#warmup")).forEach(b=>b.classList.remove("is-correct","is-wrong"));
    if(!silent) speak("Warm up. Myth buster.");
  };
  const newMyth = ()=>{
    mythIndex = (mythIndex + 1) % MYTHS.length;
    const m = MYTHS[mythIndex];
    $("#mythText").textContent = m.t;
    $("#mythFeedback").textContent = "";
    $("#mythFeedback").className = "feedback";
    $("#mythHint").textContent = "";
    $$(".choice", $("#warmup")).forEach(b=>b.classList.remove("is-correct","is-wrong"));
    bumpTotal("myth:" + mythIndex);
  };
  const hintMyth = ()=>{
    if(mythIndex<0) return;
    $("#mythHint").textContent = "Hint: " + MYTHS[mythIndex].h;
  };
  const listenMyth = ()=>{
    if(mythIndex<0) return;
    speak(MYTHS[mythIndex].t);
  };

  $("[data-action='new-myth']").addEventListener("click", newMyth);
  $("[data-action='hint-myth']").addEventListener("click", hintMyth);
  $("[data-action='listen-myth']").addEventListener("click", listenMyth);

  $$(".choice", $("#warmup")).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      if(mythIndex<0) return;
      const pick = btn.getAttribute("data-choice")==="true";
      const m = MYTHS[mythIndex];
      const fb = $("#mythFeedback");
      const ok = (pick === m.a);
      $$(".choice", $("#warmup")).forEach(b=>b.classList.remove("is-correct","is-wrong"));
      btn.classList.add(ok ? "is-correct":"is-wrong");
      fb.className = "feedback " + (ok ? "ok":"bad");
      fb.textContent = ok ? "✅ Correct." : "❌ Not quite.";
      if(ok) bumpCorrect("myth:" + mythIndex);
    });
  });

  // ---------- Vocabulary ----------
  const VOCAB = [
    {emoji:"🧾", term:"coverage", theme:"plan", def:"The benefits your plan pays for (under its rules).", fr:"garanties / prise en charge"},
    {emoji:"💳", term:"premium", theme:"money", def:"The monthly amount you pay to keep insurance active.", fr:"cotisation mensuelle"},
    {emoji:"🧱", term:"deductible", theme:"money", def:"What you pay before the plan starts sharing costs.", fr:"franchise"},
    {emoji:"🪙", term:"copay", theme:"money", def:"A fixed amount you pay for a service (ex: $30 visit).", fr:"forfait / ticket modérateur (approx.)"},
    {emoji:"📉", term:"coinsurance", theme:"money", def:"A percentage you pay after the deductible (ex: 20%).", fr:"coassurance"},
    {emoji:"🛑", term:"out-of-pocket maximum", theme:"money", def:"The most you pay in a year for covered in-network care.", fr:"plafond annuel (OOP max)"},
    {emoji:"🧭", term:"in-network", theme:"network", def:"Doctors/hospitals that have a contract with your plan.", fr:"dans le réseau"},
    {emoji:"🚫", term:"out-of-network", theme:"network", def:"Providers not contracted with your plan (often costs more).", fr:"hors réseau"},
    {emoji:"👩‍⚕️", term:"primary care doctor (PCP)", theme:"network", def:"Your main doctor (often gatekeeper in HMOs).", fr:"médecin traitant (proche idée)"},
    {emoji:"🧑‍🔬", term:"specialist", theme:"network", def:"A doctor for a specific area (derm, cardio, etc.).", fr:"spécialiste"},
    {emoji:"📝", term:"referral", theme:"paperwork", def:"Permission from your primary doctor to see a specialist.", fr:"lettre d’orientation"},
    {emoji:"✅", term:"prior authorization", theme:"paperwork", def:"Plan approval before a test/treatment is covered.", fr:"accord préalable"},
    {emoji:"📄", term:"claim", theme:"paperwork", def:"A request to the insurer to pay/reimburse.", fr:"demande de remboursement"},
    {emoji:"📬", term:"EOB (Explanation of Benefits)", theme:"paperwork", def:"A statement showing what the plan paid and what you may owe.", fr:"décompte"},
    {emoji:"🏥", term:"urgent care", theme:"plan", def:"Walk-in clinic for non-life-threatening problems.", fr:"soins non urgences vitales"},
    {emoji:"🚑", term:"emergency room (ER)", theme:"plan", def:"Hospital emergency department for severe/life-threatening issues.", fr:"urgences hospitalières"},
    {emoji:"💊", term:"prescription", theme:"plan", def:"Doctor’s order for medication.", fr:"ordonnance"},
    {emoji:"🏷️", term:"generic drug", theme:"plan", def:"Same active ingredient, usually cheaper.", fr:"générique"},
    {emoji:"🧿", term:"deductible met", theme:"money", def:"You already paid the deductible for the year.", fr:"franchise atteinte"},
    {emoji:"🧠", term:"preventive care", theme:"plan", def:"Checkups/vaccines often covered before deductible (plan rules).", fr:"prévention"},
    {emoji:"🧾", term:"itemized bill", theme:"paperwork", def:"A detailed bill listing each charge.", fr:"facture détaillée"},
    {emoji:"🏷️", term:"allowed amount", theme:"money", def:"The price your plan accepts for a service (negotiated).", fr:"tarif négocié"},
    {emoji:"👨‍👩‍👧‍👦", term:"family plan", theme:"plan", def:"One policy covering spouse/children.", fr:"contrat famille"},
    {emoji:"🧳", term:"coverage start date", theme:"plan", def:"When insurance begins (very important after a move).", fr:"date de début de couverture"},
    {emoji:"📅", term:"open enrollment / special enrollment", theme:"paperwork", def:"Periods when you can sign up or change plans.", fr:"période d’inscription"}
  ];

  let vocabTheme = "all";
  const vocabWrap = $("#vocabCards");
  const frHelp = $("#frHelp");

  function renderVocab(theme, silent){
    vocabTheme = theme || "all";
    const list = VOCAB.filter(v=> theme==="all" ? true : v.theme===theme);
    vocabWrap.innerHTML = "";
    list.forEach((v, idx)=>{
      const card = document.createElement("button");
      card.type = "button";
      card.className = "vcard";
      card.setAttribute("data-term", v.term);
      card.innerHTML = `
        <div class="vcard__top">
          <div class="vcard__emoji">${v.emoji}</div>
          <div class="vcard__tag">${escapeHtml(v.theme)}</div>
        </div>
        <div class="vcard__word">${escapeHtml(v.term)}</div>
        <div class="vcard__def">${escapeHtml(v.def)}</div>
        <div class="vcard__fr" style="display:none">${escapeHtml(v.fr)}</div>
      `;
      card.addEventListener("click", ()=>{
        card.classList.toggle("is-back");
      });
      vocabWrap.appendChild(card);
    });

    // show/hide French help
    updateFrHelp();

    if(!silent) speak("Vocabulary flashcards. Tap to flip.");
  }

  function updateFrHelp(){
    const show = frHelp.checked;
    $$(".vcard__fr", vocabWrap).forEach(el=>{
      el.style.display = show ? "block" : "none";
    });
  }
  frHelp.addEventListener("change", updateFrHelp);

  $("[data-vtheme='all']").addEventListener("click", ()=>renderVocab("all"));
  $("[data-vtheme='plan']").addEventListener("click", ()=>renderVocab("plan"));
  $("[data-vtheme='money']").addEventListener("click", ()=>renderVocab("money"));
  $("[data-vtheme='network']").addEventListener("click", ()=>renderVocab("network"));
  $("[data-vtheme='paperwork']").addEventListener("click", ()=>renderVocab("paperwork"));

  $("#shuffleVocab").addEventListener("click", ()=>{
    // simple shuffle by re-rendering with randomized order
    const list = VOCAB.filter(v=> vocabTheme==="all" ? true : v.theme===vocabTheme);
    for(let i=list.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    vocabWrap.innerHTML = "";
    list.forEach(v=>{
      const card = document.createElement("button");
      card.type="button";
      card.className="vcard";
      card.innerHTML = `
        <div class="vcard__top">
          <div class="vcard__emoji">${v.emoji}</div>
          <div class="vcard__tag">${escapeHtml(v.theme)}</div>
        </div>
        <div class="vcard__word">${escapeHtml(v.term)}</div>
        <div class="vcard__def">${escapeHtml(v.def)}</div>
        <div class="vcard__fr" style="display:${frHelp.checked?'block':'none'}">${escapeHtml(v.fr)}</div>
      `;
      card.addEventListener("click", ()=>card.classList.toggle("is-back"));
      vocabWrap.appendChild(card);
    });
  });

  $("#listenVocab").addEventListener("click", ()=>{
    const list = VOCAB.slice();
    for(let i=list.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    const pick = list.slice(0,8).map(v=> `${v.term}. ${v.def}`);
    speak(pick.join(" ... "));
  });

  // Vocab QCM
  const VOCAB_QCM_BANK = [
    { q:"Premium", opts:["A monthly amount you pay to keep insurance active","A percentage you pay after your deductible","A detailed hospital bill"], a:0, hint:"Premium = monthly payment." },
    { q:"Deductible", opts:["The limit of your network","What you pay before insurance shares costs","A letter from your doctor"], a:1, hint:"Deductible comes first." },
    { q:"In-network", opts:["Covered only during travel","Contracted providers (usually cheaper)","A drug name"], a:1, hint:"Network = contracted doctors." },
    { q:"EOB", opts:["A bill you must pay immediately","A statement explaining what the plan paid","A vaccine record"], a:1, hint:"EOB is informational." },
    { q:"Referral", opts:["Permission to see a specialist","Insurance card","A tax document"], a:0, hint:"Common in HMOs." }
  ];
  let vocabQ = null;

  const renderQcm = (wrap, item, keyPrefix, hintBox)=>{
    wrap.innerHTML = "";
    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `
      <div class="item__q">${escapeHtml(item.q)}</div>
      <div class="item__opts"></div>
      <div class="feedback" style="margin-top:10px"></div>
    `;
    const optsWrap = $(".item__opts", el);
    const fb = $(".feedback", el);
    item.opts.forEach((opt, i)=>{
      const b = document.createElement("button");
      b.type="button";
      b.className="choice";
      b.textContent = opt;
      b.addEventListener("click", ()=>{
        bumpTotal(keyPrefix);
        const ok = i===item.a;
        $$(".choice", optsWrap).forEach(x=>x.classList.remove("is-correct","is-wrong"));
        b.classList.add(ok ? "is-correct":"is-wrong");
        fb.className = "feedback " + (ok ? "ok":"bad");
        fb.textContent = ok ? "✅ Correct." : "❌ Not quite.";
        if(ok) bumpCorrect(keyPrefix);
      });
      optsWrap.appendChild(b);
    });
    wrap.appendChild(el);
    hintBox.textContent = "";
  };

  function newVocabQcm(){
    vocabQ = VOCAB_QCM_BANK[Math.floor(Math.random()*VOCAB_QCM_BANK.length)];
    renderQcm($("#vocabQcm"), vocabQ, "vocabqcm:" + vocabQ.q, $("#vocabQcmHint"));
  }
  $("#newVocabQcm").addEventListener("click", newVocabQcm);
  $("#hintVocabQcm").addEventListener("click", ()=>{
    if(!vocabQ) return;
    $("#vocabQcmHint").textContent = "Hint: " + vocabQ.hint;
  });

  // ---------- CFE scenario generator ----------
  $("#genCfeLine").addEventListener("click", ()=>{
    const start = $("#startCoverage").value;
    const worry = $("#bigWorry").value;
    const dbl = $("#doubleCover").checked;

    const parts = [];
    // modals & nuance
    if(start==="immediately") parts.push("If your employer plan starts right away, you might not need CFE for day‑to‑day U.S. care.");
    if(start==="1month") parts.push("If coverage starts after one month, you may want temporary protection, because a single ER visit can be expensive.");
    if(start==="3months") parts.push("If coverage starts after three months, you should plan a bridge solution, because the risk window is long.");
    if(start==="unknown") parts.push("If the start date is unclear, you should verify it with HR and avoid being uninsured.");

    if(worry==="er") parts.push("For emergencies, you can’t predict costs, so you should focus on strong emergency coverage and a clear network.");
    if(worry==="pregnancy") parts.push("For maternity, you have to check waiting periods, in‑network hospitals, and what prenatal care is covered.");
    if(worry==="chronic") parts.push("For a chronic condition, a PPO may be more flexible, but it can be more expensive.");
    if(worry==="kids") parts.push("For kids’ routine care, an HMO can be cheaper if your pediatrician is in‑network.");
    if(worry==="france") parts.push("If you’ll return to France soon, continuity with the French system may matter more.");

    if(dbl) parts.push("Double coverage can sound safer, but you should compare costs and reimbursement rules carefully.");

    const line = parts.join(" ");
    $("#cfeLine").textContent = line || "Pick options and try again.";
    speak(line);
  });

  $("[data-action='listen-cfe']").addEventListener("click", ()=>{
    speak("The CFE is optional coverage for French people living abroad. It can help with continuity, but reimbursement is often based on French rates, so U.S. bills can still be high. Always verify details with the insurer.");
  });

  // CFE quiz
  const CFE_QUIZ = [
    { q:"CFE reimbursements are often based on…", opts:["U.S. hospital list prices","French social security style rates","Whatever the hospital charges"], a:1, hint:"Think: ‘French base logic’." },
    { q:"If your U.S. bill is high, CFE alone may…", opts:["Still leave a large amount to pay","Always cover everything","Automatically negotiate the price"], a:0, hint:"U.S. prices can be much higher than French reference rates." },
    { q:"To get reimbursed, you may need…", opts:["Itemized bills and a claim","Only your passport","Nothing at all"], a:0, hint:"Paperwork matters." },
    { q:"When you get an employer plan in the U.S., you should…", opts:["Ignore networks","Check if doctors/hospitals are in-network","Assume it covers everything everywhere"], a:1, hint:"Network first." }
  ];
  let cfeQ = null;

  function newCfeQuiz(){
    cfeQ = CFE_QUIZ[Math.floor(Math.random()*CFE_QUIZ.length)];
    renderQcm($("#cfeQuiz"), cfeQ, "cfeq:" + cfeQ.q, $("#cfeQuizHint"));
  }
  $("#newCfeQuiz").addEventListener("click", newCfeQuiz);
  $("#hintCfeQuiz").addEventListener("click", ()=>{ if(cfeQ) $("#cfeQuizHint").textContent = "Hint: " + cfeQ.hint; });

  // ---------- Glossary ----------
  const GLOSS = [
    { term:"premium", def:"Monthly payment to keep the plan.", trap:"FR trap: not ‘prime’ = it’s your monthly cost." },
    { term:"deductible", def:"Amount you pay before the plan shares costs (many services).", trap:"FR: ‘franchise’." },
    { term:"copay", def:"Fixed fee for a visit or prescription (plan rules).", trap:"FR: not exactly ‘ticket modérateur’, but similar idea." },
    { term:"coinsurance", def:"Percentage you pay after the deductible (example: 20%).", trap:"It’s not a second deductible; it’s a percentage share." },
    { term:"out-of-pocket maximum", def:"The most you pay in a year for covered in-network care.", trap:"Premiums typically don’t count." },
    { term:"in-network", def:"Contracted providers (usually cheaper).", trap:"Always check the doctor, lab, and hospital." },
    { term:"out-of-network", def:"Not contracted (often costs more, sometimes not covered).", trap:"Can lead to surprise bills." },
    { term:"referral", def:"Permission from your primary doctor to see a specialist.", trap:"Common in HMOs." },
    { term:"prior authorization", def:"Plan approval required before some services are covered.", trap:"Ask: ‘Do we need prior authorization?’" }
  ];

  function renderGlossary(){
    const wrap = $("#glossary");
    wrap.innerHTML = "";
    GLOSS.forEach((g, i)=>{
      const el = document.createElement("div");
      el.className="gloss";
      el.innerHTML = `
        <div class="gloss__top">
          <div class="gloss__term">${escapeHtml(g.term)}</div>
          <button class="gloss__btn" type="button" aria-expanded="false">Show</button>
        </div>
        <div class="gloss__def" style="display:none">${escapeHtml(g.def)}</div>
        <div class="gloss__trap" style="display:none">🇫🇷 ${escapeHtml(g.trap)}</div>
      `;
      const btn = $(".gloss__btn", el);
      const def = $(".gloss__def", el);
      const trap = $(".gloss__trap", el);
      btn.addEventListener("click", ()=>{
        const open = def.style.display === "none";
        def.style.display = open ? "block" : "none";
        trap.style.display = open ? "block" : "none";
        btn.textContent = open ? "Hide" : "Show";
        btn.setAttribute("aria-expanded", open ? "true":"false");
      });
      el.addEventListener("dblclick", ()=> speak(g.term + ". " + g.def));
      wrap.appendChild(el);
    });
  }

  // ---------- Sorting game (tap-to-sort) ----------
  const SORT_BANKS = [
    [
      {t:"premium", bin:"monthly"},
      {t:"deductible", bin:"care"},
      {t:"copay", bin:"care"},
      {t:"claim", bin:"paperwork"},
      {t:"EOB", bin:"paperwork"},
      {t:"in-network", bin:"paperwork"}
    ],
    [
      {t:"coinsurance", bin:"care"},
      {t:"out-of-pocket max", bin:"care"},
      {t:"prior authorization", bin:"paperwork"},
      {t:"referral", bin:"paperwork"},
      {t:"premium", bin:"monthly"},
      {t:"coverage start date", bin:"paperwork"}
    ]
  ];
  let sortSet = null;
  let selectedChip = null;

  function makeChip(label){
    const b = document.createElement("button");
    b.type="button";
    b.className="chipx";
    b.textContent = label;
    b.addEventListener("click", ()=>{
      $$(".chipx").forEach(x=>x.classList.remove("is-selected"));
      selectedChip = b;
      b.classList.add("is-selected");
    });
    return b;
  }

  function clearBins(){
    $("#sortBank").innerHTML = "";
    $("#binMonthly").innerHTML = "";
    $("#binCare").innerHTML = "";
    $("#binPaper").innerHTML = "";
    selectedChip = null;
  }

  function newSortSet(){
    clearBins();
    sortSet = SORT_BANKS[Math.floor(Math.random()*SORT_BANKS.length)].map(x=>({ ...x }));
    // Shuffle
    for(let i=sortSet.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [sortSet[i], sortSet[j]] = [sortSet[j], sortSet[i]];
    }
    sortSet.forEach((it, idx)=>{
      const c = makeChip(it.t);
      c.dataset.correctBin = it.bin;
      c.dataset.id = String(idx);
      $("#sortBank").appendChild(c);
      bumpTotal("sort:" + idx);
    });
    $("#sortFeedback").textContent = "";
    $("#sortFeedback").className = "feedback";
  }

  function placeChip(bin){
    if(!selectedChip) return;
    const target = bin==="monthly" ? $("#binMonthly") : bin==="care" ? $("#binCare") : $("#binPaper");
    target.appendChild(selectedChip);
    selectedChip.classList.remove("is-selected");
    selectedChip = null;
  }

  $$(".bin").forEach(bin=>{
    bin.addEventListener("click", ()=> placeChip(bin.getAttribute("data-bin")));
  });

  $("#newSort").addEventListener("click", newSortSet);
  $("#resetSort").addEventListener("click", newSortSet);

  $("#checkSort").addEventListener("click", ()=>{
    const all = $$(".chipx", document);
    let ok = 0;
    all.forEach(ch=>{
      const corr = ch.dataset.correctBin;
      const parent = ch.parentElement && ch.parentElement.id;
      const inMonthly = parent==="binMonthly";
      const inCare = parent==="binCare";
      const inPaper = parent==="binPaper";
      const good = (corr==="monthly" && inMonthly) || (corr==="care" && inCare) || (corr==="paperwork" && inPaper);
      if(good){
        ok += 1;
        bumpCorrect("sort:" + (ch.dataset.id||"x"));
      }
    });
    const fb = $("#sortFeedback");
    fb.className = "feedback " + (ok===all.length ? "ok":"bad");
    fb.textContent = (ok===all.length)
      ? "✅ Perfect. In the U.S., money words + paperwork words matter."
      : `❌ ${ok}/${all.length} correct. Tip: premium is monthly. Referral/claims/EOB are paperwork.`;
  });

  // ---------- Sentence order builder ----------
  const ORDER_SENTENCES = [
    {
      text:"You should check if your doctor is in-network before you book the appointment.",
      hint:"Start with 'You should…' then 'check if…' then 'before you…'."
    }
  ];

  function setupBuilder(root, item){
    const bank = $(".builder__bank", root);
    const out = $(".builder__out", root);
    const fb = $("[data-bfb]", root);
    const hintBox = $("[data-bhintbox]", root);

    bank.innerHTML=""; out.innerHTML="";
    fb.textContent=""; fb.className="feedback";
    hintBox.textContent="";

    const words = item.text.replace(/\./g,"").split(" ");
    // shuffle
    const pool = words.slice();
    for(let i=pool.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    pool.forEach(w=>{
      const b = document.createElement("button");
      b.type="button";
      b.className="word";
      b.textContent=w;
      b.addEventListener("click", ()=>{
        b.classList.add("is-used");
        const outWord = document.createElement("button");
        outWord.type="button";
        outWord.className="word";
        outWord.textContent=w;
        outWord.addEventListener("click", ()=>{
          outWord.remove();
          b.classList.remove("is-used");
        });
        out.appendChild(outWord);
      });
      bank.appendChild(b);
    });

    const key = "builder:" + item.text;
    bumpTotal(key);

    $("[data-bcheck]", root).onclick = ()=>{
      const built = $$(".word", out).map(x=>x.textContent).join(" ").trim() + ".";
      const ok = norm(built) === norm(item.text);
      fb.className = "feedback " + (ok ? "ok":"bad");
      fb.textContent = ok ? "✅ Correct." : "❌ Not quite. Tap words to remove and try again.";
      if(ok) bumpCorrect(key);
    };
    $("[data-breset]", root).onclick = ()=> setupBuilder(root, item);
    $("[data-blisten]", root).onclick = ()=> speak(item.text);
    $("[data-bhint]", root).onclick = ()=>{ hintBox.textContent = "Hint: " + item.hint; };
  }

  // ---------- HMO vs PPO compare ----------
  function renderCompare(){
    const wrap = $("#compareCards");
    wrap.innerHTML = `
      <div class="compare__card">
        <div class="compare__title">HMO <span>often cheaper</span></div>
        <ul>
          <li>Usually needs a <strong>primary care doctor</strong> and <strong>referrals</strong>.</li>
          <li>Mostly <strong>in‑network</strong> only (except emergencies).</li>
          <li>Good if you want a clear system and lower monthly cost.</li>
        </ul>
      </div>
      <div class="compare__card">
        <div class="compare__title">PPO <span>more flexible</span></div>
        <ul>
          <li>Often <strong>no referral</strong> needed for specialists.</li>
          <li>Can include <strong>out‑of‑network</strong> coverage (usually costs more).</li>
          <li>Good if you travel or want more choice of doctors.</li>
        </ul>
      </div>
    `;
  }
  $("#listenHmoPpo").addEventListener("click", ()=>{
    speak("H M O plans are often cheaper but have more rules: primary care doctor, referrals, and mostly in-network only. P P O plans are usually more flexible and may cover out-of-network care, but they can be more expensive.");
  });

  // Scenarios
  const SCENARIOS = {
    kids:{
      text:"You have two kids. You want a pediatrician, vaccines, and routine visits. Budget matters.",
      best:"hmo",
      model:"An HMO might be cheaper than a PPO for routine care, so you should choose it if your pediatrician is in‑network."
    },
    specialist:{
      text:"You need a specialist quickly (dermatologist/cardiologist). You don’t want to wait for referrals.",
      best:"ppo",
      model:"A PPO is usually more flexible than an HMO, so you might prefer it because you can often see a specialist without a referral."
    },
    travel:{
      text:"You travel a lot (out of state). You want more provider choice.",
      best:"ppo",
      model:"A PPO can be better for travel because it may cover more out‑of‑network care, but you should check costs carefully."
    },
    budget:{
      text:"Money is tight. You want the lowest monthly payment possible.",
      best:"hmo",
      model:"An HMO is often the most affordable option monthly, so you should start there, then compare deductible and network access."
    }
  };
  let scnKey = "kids";

  function setScenario(key){
    scnKey = key;
    $("#scnText").textContent = SCENARIOS[key].text;
    $("#scnFeedback").textContent = "";
    $("#scnFeedback").className = "feedback";
    $("#scnModel").textContent = "—";
    bumpTotal("scn:" + key);
  }
  $$("#hmo-ppo [data-scn]").forEach(btn=>{
    btn.addEventListener("click", ()=> setScenario(btn.getAttribute("data-scn")));
  });

  function choosePlan(pick){
    const scn = SCENARIOS[scnKey];
    const ok = pick === scn.best;
    const fb = $("#scnFeedback");
    fb.className = "feedback " + (ok ? "ok":"bad");
    fb.textContent = ok ? "✅ Good choice for this scenario." : "❌ Not the best fit here (based on typical HMO/PPO rules).";
    if(ok) bumpCorrect("scn:" + scnKey);
    $("#scnModel").textContent = scn.model;
  }
  $("#pickHmo").addEventListener("click", ()=> choosePlan("hmo"));
  $("#pickPpo").addEventListener("click", ()=> choosePlan("ppo"));

  // Comparatives gaps
  const COMP_GAPS = [
    { line:"A PPO is usually ____ flexible than an HMO.", a:"more" },
    { line:"An HMO is often ____ than a PPO (monthly premium).", a:"cheaper" },
    { line:"Out‑of‑network care is usually ____ expensive.", a:"more" },
    { line:"The ER is often the ____ expensive option.", a:"most" },
    { line:"Generic drugs are usually ____ than brand‑name drugs.", a:"cheaper" },
    { line:"Good → ____ → the best.", a:"better" }
  ];

  function renderGapItems(wrap, items, keyPrefix){
    wrap.innerHTML = "";
    items.forEach((g, idx)=>{
      const el = document.createElement("div");
      el.className="gap";
      el.innerHTML = `
        <div class="gap__line">${escapeHtml(g.line.replace("____","______"))}</div>
        <input type="text" inputmode="text" placeholder="Type your answer" aria-label="Gap ${idx+1}" />
        <div class="minirow">
          <span class="tag" data-tag>—</span>
          <button class="btn btn--ghost" data-check type="button">Check</button>
          <button class="btn btn--ghost" data-listen type="button">Listen</button>
        </div>
      `;
      const inp = $("input", el);
      const tag = $("[data-tag]", el);
      const key = keyPrefix + ":" + idx;
      bumpTotal(key);
      $("[data-check]", el).addEventListener("click", ()=>{
        const ok = norm(inp.value) === norm(g.a);
        tag.className = "tag " + (ok ? "ok":"bad");
        tag.textContent = ok ? "✅ Correct" : `❌ Answer: ${g.a}`;
        if(ok) bumpCorrect(key);
      });
      $("[data-listen]", el).addEventListener("click", ()=> speak(g.line.replace("____", g.a)));
      wrap.appendChild(el);
    });
  }

  function renderCompGaps(silent){
    renderGapItems($("#compGaps"), COMP_GAPS, "comp");
    if(!silent) speak("Comparatives drill. Type the missing word.");
  }
  $("#resetComp").addEventListener("click", ()=> renderCompGaps());
  $("#showComp").addEventListener("click", ()=>{
    $$("#compGaps .gap").forEach((el, idx)=>{
      const tag = $("[data-tag]", el);
      tag.className="tag ok";
      tag.textContent="✅ " + COMP_GAPS[idx].a;
      $("input", el).value = COMP_GAPS[idx].a;
      bumpCorrect("comp:" + idx);
    });
  });

  // ---------- Cost simulator ----------
  $("#calcCost").addEventListener("click", ()=>{
    const deductible = Math.max(0, parseFloat($("#deductible").value || "0"));
    const coins = clamp(parseFloat($("#coins").value || "0"), 0, 100) / 100;
    const oop = Math.max(0, parseFloat($("#oop").value || "0"));
    const bill = Math.max(0, parseFloat($("#bill").value || "0"));
    const met = $("#alreadyMetDed").checked;

    let remainingDed = met ? 0 : deductible;
    let youPay = 0;

    // Pay deductible first
    const payDed = Math.min(bill, remainingDed);
    youPay += payDed;
    remainingDed -= payDed;

    // Remaining bill after deductible
    const rem = Math.max(0, bill - payDed);

    // Coinsurance share
    youPay += rem * coins;

    // Apply out-of-pocket max cap
    youPay = Math.min(youPay, oop);

    const planPays = Math.max(0, bill - youPay);

    $("#costOut").innerHTML = `
      <strong>Your estimated share:</strong> $${youPay.toFixed(0)}<br/>
      <strong>Plan share (approx.):</strong> $${planPays.toFixed(0)}<br/>
      <span class="muted small">Logic: deductible → coinsurance → capped by OOP max (simplified).</span>
    `;
    speak(`Estimated out of pocket: ${youPay.toFixed(0)} dollars.`);
  });

  // OOP QCM (what counts)
  const OOP_QCM = [
    { q:"Out‑of‑pocket maximum usually includes…", opts:["Deductible + copays + coinsurance","Monthly premiums","Airline tickets"], a:0, hint:"Premiums typically don’t count." },
    { q:"After you reach your out‑of‑pocket maximum (covered in‑network care)…", opts:["The plan pays 100% for covered services","You start paying double","Nothing changes"], a:0, hint:"That’s the point of the max." },
    { q:"If you go out‑of‑network…", opts:["Costs can be higher and may not count the same way","It’s always cheaper","It’s identical"], a:0, hint:"Network rules matter." }
  ];
  let oopQ = null;
  function newOopQcm(){
    oopQ = OOP_QCM[Math.floor(Math.random()*OOP_QCM.length)];
    renderQcm($("#oopQcm"), oopQ, "oopq:" + oopQ.q, $("#oopHint"));
  }
  $("#newOopQcm").addEventListener("click", newOopQcm);
  $("#hintOopQcm").addEventListener("click", ()=>{ if(oopQ) $("#oopHint").textContent = "Hint: " + oopQ.hint; });

  // EOB quiz
  const EOBS = [
    { q:"EOB says: ‘Allowed amount: $200. Plan paid: $160. You may owe: $40.’ What does it mean?",
      opts:["You should pay $40 (if it’s not already paid)","You owe $200 immediately","The plan refused everything"],
      a:0, hint:"Allowed amount is the negotiated basis." },
    { q:"EOB says: ‘This service is not covered.’ What should you do?",
      opts:["Call the insurer and ask why / appeal if appropriate","Ignore it forever","Pay without questions"],
      a:0, hint:"Ask: Is there a code issue? Prior authorization? Network?" }
  ];
  let eobQ = null;
  function newEob(){
    eobQ = EOBS[Math.floor(Math.random()*EOBS.length)];
    renderQcm($("#eobQuiz"), eobQ, "eob:" + eobQ.q, $("#eobHint"));
  }
  $("#newEob").addEventListener("click", newEob);
  $("#hintEob").addEventListener("click", ()=>{ if(eobQ) $("#eobHint").textContent = "Hint: " + eobQ.hint; });

  // ---------- Dialogues ----------
  const CALL_FLOW = [
    {
      step:"Receptionist: Good morning, Maple Clinic. How can I help you?",
      choices:[
        {t:"Hello. I’m a new patient. I’d like to make an appointment, please.", ok:true, hint:"Polite + clear."},
        {t:"I want doctor now.", ok:false, hint:"Too direct."},
        {t:"Give me your prices.", ok:false, hint:"Not step 1."}
      ],
      model:"Hello. I’m a new patient. I’d like to make an appointment, please."
    },
    {
      step:"Receptionist: Sure. Do you have insurance?",
      choices:[
        {t:"Yes. I’m covered through my spouse’s employer plan.", ok:true, hint:"Realistic expat context."},
        {t:"No. France pays.", ok:false, hint:"Not how it works in the U.S."},
        {t:"I don’t know. Maybe.", ok:false, hint:"Be specific."}
      ],
      model:"Yes. I’m covered through my spouse’s employer plan."
    },
    {
      step:"Receptionist: Great. What is the reason for the visit?",
      choices:[
        {t:"It’s not an emergency. I need a checkup and a prescription refill.", ok:true, hint:"Uses useful vocabulary."},
        {t:"I’m dying.", ok:false, hint:"Then you’d go to ER."},
        {t:"I will explain later.", ok:false, hint:"Give a reason."}
      ],
      model:"It’s not an emergency. I need a checkup and a prescription refill."
    },
    {
      step:"Receptionist: Do you know if we’re in-network with your plan?",
      choices:[
        {t:"I’m not sure. Could you tell me, or should I call my insurer?", ok:true, hint:"Modals + polite."},
        {t:"It doesn’t matter.", ok:false, hint:"It matters a lot."},
        {t:"Network is stupid.", ok:false, hint:"Avoid negative tone."}
      ],
      model:"I’m not sure. Could you tell me, or should I call my insurer?"
    }
  ];
  let callIdx = -1;
  function renderCall(){
    const s = CALL_FLOW[callIdx];
    $("#callStep").textContent = s.step;
    const wrap = $("#callChoices");
    wrap.innerHTML="";
    s.choices.forEach((c, i)=>{
      const b = document.createElement("button");
      b.type="button";
      b.className="choice";
      b.textContent = c.t;
      b.addEventListener("click", ()=>{
        bumpTotal("call:" + callIdx);
        const ok = !!c.ok;
        $$(".choice", wrap).forEach(x=>x.classList.remove("is-correct","is-wrong"));
        b.classList.add(ok ? "is-correct":"is-wrong");
        $("#callFb").className = "feedback " + (ok ? "ok":"bad");
        $("#callFb").textContent = ok ? "✅ Nice." : "❌ Not the best line.";
        if(ok) bumpCorrect("call:" + callIdx);
      });
      wrap.appendChild(b);
    });
    $("#callFb").textContent = "";
    $("#callFb").className = "feedback";
  }
  function newCall(){
    callIdx = 0;
    renderCall();
  }
  $("#startCall").addEventListener("click", newCall);
  $("#nextCall").addEventListener("click", ()=>{
    if(callIdx<0) return;
    callIdx = (callIdx + 1) % CALL_FLOW.length;
    renderCall();
  });
  $("#listenCall").addEventListener("click", ()=>{
    if(callIdx<0) return;
    const s = CALL_FLOW[callIdx];
    speak(s.step + " ... " + s.model);
  });
  $("#hintCall").addEventListener("click", ()=>{
    if(callIdx<0) return;
    const s = CALL_FLOW[callIdx];
    const best = s.choices.find(x=>x.ok);
    $("#callFb").className="feedback";
    $("#callFb").textContent = "Hint: " + (best ? best.hint : "Choose the polite, clear option.");
  });

  // ER vs Urgent care quiz
  const ER_CASES = [
    { q:"You have chest pain and trouble breathing.", a:"er", hint:"Life-threatening: ER.", model:"You should go to the ER, because it could be serious and urgent care may not be equipped." },
    { q:"Your child has a mild earache and a fever, but is stable.", a:"urgent", hint:"Often urgent care first.", model:"Urgent care might be cheaper than the ER for a stable problem, but you should monitor symptoms." },
    { q:"You cut your finger; it’s bleeding but controllable.", a:"urgent", hint:"Often urgent care first.", model:"Urgent care can be faster and less expensive than the ER for minor injuries." }
  ];
  let erCase = null;

  function newEr(){
    erCase = ER_CASES[Math.floor(Math.random()*ER_CASES.length)];
    const wrap = $("#erQuiz");
    wrap.innerHTML = "";
    const el = document.createElement("div");
    el.className="item";
    el.innerHTML = `
      <div class="item__q">${escapeHtml(erCase.q)}</div>
      <div class="item__opts"></div>
      <div class="feedback" style="margin-top:10px"></div>
      <div class="output" style="margin-top:10px; display:none"></div>
    `;
    const opts = $(".item__opts", el);
    const fb = $(".feedback", el);
    const out = $(".output", el);

    const choices = [
      {k:"er", t:"Go to the ER"},
      {k:"urgent", t:"Go to urgent care"},
      {k:"call", t:"Call nurse line / insurer first (if not severe)"}
    ];

    choices.forEach(c=>{
      const b = document.createElement("button");
      b.type="button";
      b.className="choice";
      b.textContent = c.t;
      b.addEventListener("click", ()=>{
        bumpTotal("er:" + erCase.q);
        const ok = c.k===erCase.a || (c.k==="call" && erCase.a==="urgent");
        $$(".choice", opts).forEach(x=>x.classList.remove("is-correct","is-wrong"));
        b.classList.add(ok ? "is-correct":"is-wrong");
        fb.className="feedback " + (ok ? "ok":"bad");
        fb.textContent = ok ? "✅ Good." : "❌ Not the best first choice.";
        if(ok) bumpCorrect("er:" + erCase.q);
        out.style.display="block";
        out.textContent = erCase.model;
      });
      opts.appendChild(b);
    });

    $("#erHint").textContent = "";
  }

  $("#newEr").addEventListener("click", newEr);
  $("#hintEr").addEventListener("click", ()=>{ if(erCase) $("#erHint").textContent = "Hint: " + erCase.hint; });
  $("#listenEr").addEventListener("click", ()=>{ if(erCase) speak(erCase.model); });

  // ---------- Grammar: superlatives QCM ----------
  const SUPER_QCM = [
    { q:"Choose the best sentence:", opts:[
      "The ER is the most expensive option.",
      "The ER is more expensive option.",
      "The ER is expensive than urgent care."
    ], a:0, hint:"Superlative = the most + adjective."},
    { q:"Choose the best sentence:", opts:[
      "A PPO is more flexible than an HMO.",
      "A PPO is the flexible than an HMO.",
      "A PPO is flexibler than an HMO."
    ], a:0, hint:"More + adjective + than."},
    { q:"Choose the best sentence:", opts:[
      "Generic drugs are usually cheaper than brand-name drugs.",
      "Generic drugs are cheapest than brand-name drugs.",
      "Generic drugs are more cheap than brand-name drugs."
    ], a:0, hint:"Cheaper = -er."}
  ];
  let superQ = null;
  function newSuper(){
    superQ = SUPER_QCM[Math.floor(Math.random()*SUPER_QCM.length)];
    renderQcm($("#superQcm"), superQ, "super:" + superQ.q, $("#superHint"));
  }
  $("#newSuper").addEventListener("click", newSuper);
  $("#hintSuper").addEventListener("click", ()=>{ if(superQ) $("#superHint").textContent = "Hint: " + superQ.hint; });

  // Modals gaps
  const MODAL_GAPS = [
    { line:"You ____ check if the doctor is in-network before you book.", a:"should" },
    { line:"For some tests, you ____ get prior authorization.", a:"have to" },
    { line:"I ____ see a specialist without a referral on my PPO.", a:"can" },
    { line:"We ____ have to pay the deductible before coverage starts.", a:"might" }
  ];
  function renderModalGaps(silent){
    renderGapItems($("#modalGaps"), MODAL_GAPS, "modal");
    if(!silent) speak("Modals practice.");
  }
  $("#resetModals").addEventListener("click", ()=> renderModalGaps());
  $("#revealModals").addEventListener("click", ()=>{
    $$("#modalGaps .gap").forEach((el, idx)=>{
      const tag = $("[data-tag]", el);
      tag.className="tag ok";
      tag.textContent="✅ " + MODAL_GAPS[idx].a;
      $("input", el).value = MODAL_GAPS[idx].a;
      bumpCorrect("modal:" + idx);
    });
  });

  // Upgrade direct -> polite
  const UPGRADES = [
    { raw:"I want an appointment tomorrow.", target:"Could I get an appointment for tomorrow, if possible?", hint:"Use Could I…? + if possible." },
    { raw:"Give me the price.", target:"Could you tell me the estimated cost, please?", hint:"Ask politely: Could you tell me…?" },
    { raw:"I need specialist now.", target:"Do I need a referral to see a specialist, or can I book directly?", hint:"Use: Do I need… or can I…?" }
  ];
  let up = null;

  function newUpgrade(){
    up = UPGRADES[Math.floor(Math.random()*UPGRADES.length)];
    const wrap = $("#upgrade");
    wrap.innerHTML = "";
    const el = document.createElement("div");
    el.className="item";
    el.innerHTML = `
      <div class="badge">Direct version (too strong)</div>
      <div class="item__q">${escapeHtml(up.raw)}</div>
      <div class="badge" style="margin-top:10px">Type a polite upgrade</div>
      <input id="upInp" type="text" style="width:100%; margin-top:10px; min-height:44px; padding:10px 12px; border-radius:14px; border:1px solid rgba(255,255,255,.18); background: rgba(0,0,0,.22); color: var(--text);" placeholder="Type your polite version" />
      <div class="row" style="margin-top:10px">
        <button class="btn" id="upCheck" type="button">✅ Check</button>
        <button class="btn btn--ghost" id="upReveal" type="button">Reveal</button>
      </div>
      <div class="feedback" id="upFb"></div>
    `;
    wrap.appendChild(el);
    $("#upgradeHint").textContent = "";
    bumpTotal("upgrade:" + up.raw);

    $("#upCheck").addEventListener("click", ()=>{
      const val = norm($("#upInp").value);
      const ok = val.includes("could") || val.includes("can you") || val.includes("please");
      const fb = $("#upFb");
      fb.className = "feedback " + (ok ? "ok":"bad");
      fb.textContent = ok ? "✅ Sounds polite. Compare with the model below." : "❌ Try adding: could/can you/please/if possible.";
      if(ok) bumpCorrect("upgrade:" + up.raw);
    });
    $("#upReveal").addEventListener("click", ()=>{
      $("#upInp").value = up.target;
      $("#upFb").className = "feedback ok";
      $("#upFb").textContent = "✅ Model: " + up.target;
      bumpCorrect("upgrade:" + up.raw);
    });
  }
  $("#newUpgrade").addEventListener("click", newUpgrade);
  $("#hintUpgrade").addEventListener("click", ()=>{ if(up) $("#upgradeHint").textContent = "Hint: " + up.hint; });
  $("#listenUpgrade").addEventListener("click", ()=>{ if(up) speak(up.target); });

  // ---------- Final mission ----------
  function finalScript(data){
    const name = data.name || "We";
    const city = data.city || "our new city";
    const mode = data.mode || "slow";
    const plan = data.plan || "not-sure";
    const scn = data.scn || "first-week";

    const pace = mode==="slow" ? "Let me explain clearly." : "Here’s the situation.";
    const planLine =
      plan==="hmo" ? "We’re leaning toward an HMO because it’s often cheaper, but we have to follow the network rules."
      : plan==="ppo" ? "We’re leaning toward a PPO because it’s more flexible, but it might be more expensive."
      : "We’re comparing an HMO and a PPO, and we need to understand which one is the best fit.";

    const scnLines = {
      "first-week":"We just moved, so we should find a primary care doctor and check if the clinic is in-network.",
      "kids":"We have kids, so we should pick a plan with an in-network pediatrician and clear preventive care coverage.",
      "pregnancy":"We’re planning a pregnancy, so we have to check in-network hospitals and what prenatal care is covered.",
      "chronic":"We have a chronic condition, so we might need specialists, and a PPO can be better for access.",
      "budget":"Budget is tight, so we should compare premiums, deductibles, and the out-of-pocket maximum carefully."
    };

    const question = "Could you confirm our deductible, out-of-pocket maximum, and whether referrals are required for specialists?";
    const closing = "Thank you — we really appreciate your help.";

    return `${pace} My name is ${name} and we’re in ${city}. ${scnLines[scn] || scnLines["first-week"]} ${planLine} We want the most predictable costs, and we don’t want surprise out-of-network bills. ${question} ${closing}`;
  }

  function hrEmailTemplate(data){
    const name = data.name || "Claire & Julien";
    const city = data.city || "Boston, MA";
    const scn = data.scn || "first-week";
    const plan = data.plan || "not-sure";
    const bullets = [
      "Start date of coverage (for spouse + dependents)",
      "Network: PCP and specialists (referral requirements)",
      "Deductible, coinsurance, copays, and out-of-pocket maximum",
      "How prescriptions are covered (generic vs brand)",
      "Any prior authorization requirements"
    ];
    return `Subject: Questions about our health coverage (new arrival)\n\nHello,\n\nMy name is ${name}. We recently moved to ${city} and we’re enrolling in the employer health plan. Our situation: ${scn}. We are currently considering: ${plan}.\n\nCould you please confirm:\n- ${bullets.join("\n- ")}\n\nThank you very much for your help.\n\nBest regards,\n${name}`;
  }

  $("#genFinal").addEventListener("click", ()=>{
    const data = {
      name: $("#fName").value.trim(),
      city: $("#fCity").value.trim(),
      scn: $("#fScenario").value,
      plan: $("#fPlan").value,
      mode: $("#fMode").value
    };
    const script = finalScript(data);
    $("#finalOut").textContent = script;
    $("#hrEmail").textContent = hrEmailTemplate(data);
    speak(script);
    bumpTotal("final");
    bumpCorrect("final"); // treat as completion
  });
  $("#listenFinal").addEventListener("click", ()=> speak($("#finalOut").textContent || "Generate the script first."));
  $("#copyFinal").addEventListener("click", async ()=>{
    const t = $("#finalOut").textContent || "";
    try{
      await navigator.clipboard.writeText(t);
      $("#finalOut").insertAdjacentHTML("beforeend", "\n\n✅ Copied.");
    }catch(e){
      $("#finalOut").insertAdjacentHTML("beforeend", "\n\n(Clipboard not available — copy manually.)");
    }
  });

  // ---------- Print ----------
  $("#printCheat").addEventListener("click", ()=> window.print());
  $("#listenCheat").addEventListener("click", ()=> speak($("#cheat").innerText));

  // ---------- Initial render ----------
  function init(){
    setScore();
    initMyths(true);
    renderVocab("all", true);
    newVocabQcm();
    newCfeQuiz();
    renderGlossary();
    newSortSet();
    setupBuilder($("#order1"), ORDER_SENTENCES[0]);
    renderCompare();
    setScenario("kids");
    renderCompGaps(true);
    renderModalGaps(true);
    newOopQcm();
    newEob();
    newSuper();
    newUpgrade();
    // Default call is not started.
    // Default ER quiz
    newEr();
  }

  init();

})();
