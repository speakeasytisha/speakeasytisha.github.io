(() => {
  "use strict";
  const LS_KEY = "set_wedding_preparatifs_sabine_addon_v1";
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const state = loadState();

  function loadState(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(raw){
        const obj = JSON.parse(raw);
        return {
          level: obj.level || "A2",
          fr: obj.fr !== false,
          vocabFilter: obj.vocabFilter || "all",
          vocabQuery: obj.vocabQuery || "",
          progress: obj.progress || {},
        };
      }
    }catch(e){}
    return { level:"A2", fr:true, vocabFilter:"all", vocabQuery:"", progress:{} };
  }
  function saveState(){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(e){}
    const el = $("#saveState");
    if(el){
      el.textContent = "Saved ✓";
      el.style.opacity = "1";
      setTimeout(() => { el.style.opacity = ".75"; }, 900);
    }
  }

  function setFR(on){
    state.fr = !!on;
    $("#frState").textContent = state.fr ? "ON" : "OFF";
    $("#toggleFR").setAttribute("aria-pressed", state.fr ? "true" : "false");
    $$(".fr").forEach(el => { el.style.display = state.fr ? "" : "none"; });
    saveState();
  }

  function speak(text){
    try{
      if(!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.98;
      const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
      const prefer = ["en-US","en-GB","en_GB","en_US"];
      let v = null;
      for(const tag of prefer){
        v = voices.find(x => (x.lang||"").toLowerCase() === tag.toLowerCase());
        if(v) break;
      }
      if(!v) v = voices.find(x => (x.lang||"").toLowerCase().startsWith("en"));
      if(v) u.voice = v;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }

  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }
  function normalize(s){ return (s||"").toLowerCase().replace(/\s+/g," ").trim(); }
  function escapeHTML(s){
    return (s||"").replace(/[&<>"']/g, (c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
  }
  function cssEscape(s){
    return (window.CSS && CSS.escape) ? CSS.escape(s) : s.replace(/[^a-zA-Z0-9_\-]/g, "\\$&");
  }

  const tenseCards = [
    { title:"Present simple", tag:"routine",
      en:"I contact clients every day. I confirm details and update the checklist.",
      fr:"Je contacte les clients tous les jours. Je confirme les détails et je mets à jour la checklist."
    },
    { title:"Present continuous", tag:"now",
      en:"I’m preparing the mood board right now. We’re finalising the table plan this week.",
      fr:"Je prépare la planche d’inspiration maintenant. On finalise le plan de table cette semaine."
    },
    { title:"Future (going to / will)", tag:"next",
      en:"I’m going to send the timeline tomorrow. I’ll call you back this afternoon.",
      fr:"Je vais envoyer le planning demain. Je vous rappelle cet après‑midi."
    }
  ];

  const warmups = {
    routine: { en:"I usually answer client emails in the morning.", fr:"Je réponds généralement aux emails clients le matin." },
    now: { en:"I’m currently working on the decoration plan and the florist order.", fr:"Je travaille en ce moment sur le plan déco et la commande fleurs." },
    next: { en:"I’m going to confirm the schedule with the venue tomorrow.", fr:"Je vais confirmer le planning avec le lieu demain." }
  };

  const vocab = [
    {cat:"clients", icon:"🤝", en:"client", fr:"client(e)", ex:"I call the client to confirm the plan."},
    {cat:"clients", icon:"📞", en:"to call back", fr:"rappeler", ex:"I’ll call you back this afternoon."},
    {cat:"clients", icon:"✉️", en:"to reply", fr:"répondre", ex:"I reply to emails quickly."},
    {cat:"clients", icon:"🗓️", en:"appointment", fr:"rendez‑vous", ex:"We have an appointment on Tuesday."},
    {cat:"clients", icon:"📝", en:"request", fr:"demande", ex:"I receive a request from a couple."},
    {cat:"clients", icon:"💬", en:"to discuss", fr:"discuter", ex:"We discuss the budget and priorities."},
    {cat:"clients", icon:"✅", en:"to confirm", fr:"confirmer", ex:"I confirm the venue visit."},
    {cat:"clients", icon:"🧘", en:"peace of mind", fr:"sérénité", ex:"My goal is peace of mind for clients."},
    {cat:"design", icon:"🎨", en:"mood board", fr:"planche d’inspiration", ex:"I’m creating a mood board."},
    {cat:"design", icon:"🌸", en:"floral arrangement", fr:"composition florale", ex:"The floral arrangement matches the theme."},
    {cat:"design", icon:"💐", en:"bouquet", fr:"bouquet", ex:"I’m designing the bridal bouquet."},
    {cat:"design", icon:"🕯️", en:"atmosphere", fr:"ambiance", ex:"I create an elegant atmosphere."},
    {cat:"design", icon:"🪑", en:"seating plan", fr:"plan de table", ex:"I’m updating the seating plan."},
    {cat:"design", icon:"🏷️", en:"place card", fr:"marque‑place", ex:"I print place cards."},
    {cat:"design", icon:"✨", en:"details", fr:"détails", ex:"I check every detail."},
    {cat:"design", icon:"🧵", en:"custom", fr:"sur‑mesure", ex:"We make a custom design."},
    {cat:"logistics", icon:"📍", en:"venue", fr:"lieu", ex:"I visit the venue with the couple."},
    {cat:"logistics", icon:"🚚", en:"delivery", fr:"livraison", ex:"The rental items arrive by delivery."},
    {cat:"logistics", icon:"🧰", en:"to set up", fr:"installer / mettre en place", ex:"We set up the ceremony area."},
    {cat:"logistics", icon:"🧾", en:"invoice", fr:"facture", ex:"I send an invoice to the client."},
    {cat:"logistics", icon:"💶", en:"budget", fr:"budget", ex:"We stay within the budget."},
    {cat:"logistics", icon:"⏱️", en:"timeline", fr:"planning / déroulé", ex:"I’m going to send the timeline."},
    {cat:"logistics", icon:"🧑‍🍳", en:"caterer", fr:"traiteur", ex:"I call the caterer to confirm timing."},
    {cat:"logistics", icon:"🎧", en:"DJ / sound", fr:"DJ / sono", ex:"We confirm the DJ’s schedule."},
    {cat:"dayof", icon:"🎉", en:"rehearsal", fr:"répétition", ex:"We do a rehearsal the day before."},
    {cat:"dayof", icon:"👰", en:"bride", fr:"mariée", ex:"The bride arrives at 2 PM."},
    {cat:"dayof", icon:"🤵", en:"groom", fr:"marié", ex:"The groom greets guests."},
    {cat:"dayof", icon:"📸", en:"photographer", fr:"photographe", ex:"I coordinate with the photographer."},
    {cat:"dayof", icon:"🧑‍🤝‍🧑", en:"guests", fr:"invités", ex:"Guests take their seats."},
    {cat:"dayof", icon:"🔁", en:"to coordinate", fr:"coordonner", ex:"I coordinate all suppliers."},
    {cat:"dayof", icon:"🧯", en:"backup plan", fr:"plan B", ex:"We have a backup plan for rain."},
    {cat:"dayof", icon:"🌧️", en:"rain plan", fr:"plan pluie", ex:"The rain plan is ready."},
  ];

  const decisionItems = [
    {icon:"📅", en:"Weekly routine", fr:"Routine hebdo", tense:"present simple", ex:"I meet suppliers every Friday."},
    {icon:"📞", en:"Right now / today", fr:"Maintenant / aujourd’hui", tense:"present continuous", ex:"I’m calling the florist right now."},
    {icon:"✉️", en:"Next step / plan", fr:"Prochaine étape", tense:"going to", ex:"I’m going to send the quote tomorrow."},
    {icon:"🤝", en:"Quick promise", fr:"Promesse rapide", tense:"will", ex:"I’ll email you the details tonight."},
    {icon:"🗓️", en:"Fixed schedule", fr:"Horaire fixe", tense:"present simple", ex:"The meeting starts at 10 AM."},
    {icon:"🛠️", en:"Temporary project", fr:"Projet temporaire", tense:"present continuous", ex:"We’re working on a new concept this month."},
    {icon:"🎯", en:"Client plan", fr:"Plan client", tense:"going to", ex:"We’re going to choose the colors next week."},
    {icon:"🧯", en:"Offer / help", fr:"Offre / aide", tense:"will", ex:"I’ll help you with the seating plan."},
  ];

  const tensePickerBank = [
    { stemEN:"Right now, I ___ the seating plan.", stemFR:"En ce moment, je ___ le plan de table.",
      correct:"present continuous",
      whyEN:"“Right now” → action in progress → present continuous (am/is/are + -ing).",
      whyFR:"“En ce moment” → action en cours → présent continu (am/is/are + -ing).",
      hintEN:"Look for “right now / today / at the moment”.",
      hintFR:"Cherche “en ce moment / aujourd’hui”."
    },
    { stemEN:"Every morning, I ___ client emails.", stemFR:"Chaque matin, je ___ les emails clients.",
      correct:"present simple",
      whyEN:"“Every morning” → routine → present simple.",
      whyFR:"“Chaque matin” → routine → présent simple.",
      hintEN:"Look for “every / usually / often”.",
      hintFR:"Cherche “chaque / souvent”."
    },
    { stemEN:"Tomorrow, I ___ send the final timeline.", stemFR:"Demain, je ___ envoyer le planning final.",
      correct:"future",
      whyEN:"“Tomorrow” + plan → future (going to).",
      whyFR:"“Demain” + plan → futur (going to).",
      hintEN:"“Tomorrow / next week” = future.",
      hintFR:"“Demain / la semaine prochaine” = futur."
    },
    { stemEN:"I can’t talk now, but I ___ call you back.", stemFR:"Je ne peux pas parler maintenant, mais je ___ vous rappeler.",
      correct:"future",
      whyEN:"Instant promise → “will”.",
      whyFR:"Promesse rapide → “will”.",
      hintEN:"Quick promise → will.",
      hintFR:"Promesse rapide → will."
    },
    { stemEN:"This week, we ___ working with a new caterer.", stemFR:"Cette semaine, nous ___ avec un nouveau traiteur.",
      correct:"present continuous",
      whyEN:"Temporary situation “this week” → present continuous.",
      whyFR:"Situation temporaire “cette semaine” → présent continu.",
      hintEN:"Temporary time period → continuous.",
      hintFR:"Période temporaire → continu."
    }
  ];

  const gapBank = [
    { en:"I usually {v1} clients in the morning.", fr:"Je {v1} généralement les clients le matin.",
      blanks:[ {key:"v1", choices:["call","am calling","am going to call"], ans:"call", why:"Routine → present simple."} ]
    },
    { en:"Right now, I {v1} the decoration plan.", fr:"En ce moment, je {v1} le plan déco.",
      blanks:[ {key:"v1", choices:["prepare","am preparing","will prepare"], ans:"am preparing", why:"Now → present continuous."} ]
    },
    { en:"Tomorrow, I {v1} the venue to confirm the schedule.", fr:"Demain, je {v1} le lieu pour confirmer le planning.",
      blanks:[ {key:"v1", choices:["call","am calling","am going to call"], ans:"am going to call", why:"Plan → going to."} ]
    },
    { en:"She {v1} the couple and {v2} calm.", fr:"Elle {v1} le couple et {v2} calme.",
      blanks:[
        {key:"v1", choices:["supports","support","is supporting"], ans:"supports", why:"She → present simple + -s."},
        {key:"v2", choices:["stays","stay","is staying"], ans:"stays", why:"Routine/quality → present simple + -s."}
      ]
    }
  ];

  const checklistCorrect = [
    "Collect client preferences and budget",
    "Confirm venue visit date and time",
    "Create mood board + color palette",
    "Contact suppliers (caterer / DJ / photographer)",
    "Update timeline and send next steps"
  ];

  const dialogueSteps = [
    { botEN:"Hello, this is Sabine from Cérémonie Story. How are you today?", botFR:"Bonjour, c’est Sabine de Cérémonie Story. Comment allez-vous aujourd’hui ?",
      opts:[
        {t:"Hi Sabine, I’m fine, thank you.", ok:true, why:"Polite greeting + simple response."},
        {t:"I’m doing tomorrow.", ok:false, why:"Wrong meaning."},
        {t:"Fine. Venue.", ok:false, why:"Too short / unclear."},
      ],
      hintEN:"Start with a friendly greeting + ‘I’m fine, thank you’.",
      hintFR:"Commence avec une phrase polie : « I’m fine, thank you »."
    },
    { botEN:"Great. I’m calling about your wedding preparations. Is this a good time?", botFR:"Super. Je vous appelle à propos des préparatifs. Est-ce un bon moment ?",
      opts:[
        {t:"Yes, it’s a good time.", ok:true, why:"Correct: short + clear."},
        {t:"Yes, I’m good time.", ok:false, why:"Grammar: missing ‘a’."},
        {t:"No, I’m call you.", ok:false, why:"Wrong structure."},
      ],
      hintEN:"Use: ‘Yes, it’s a good time.’ / ‘Sorry, I can’t talk right now.’",
      hintFR:"Utilise : « Yes, it’s a good time. »"
    },
    { botEN:"Perfect. I’m currently working on the decoration plan. What style do you prefer?", botFR:"Parfait. Je travaille en ce moment sur le plan déco. Quel style préférez-vous ?",
      opts:[
        {t:"We like an elegant and natural style.", ok:true, why:"Good adjectives + simple sentence."},
        {t:"We are like elegant.", ok:false, why:"Use ‘We like…’ not ‘We are like…’"},
        {t:"We prefering elegant.", ok:false, why:"Verb form incorrect."},
      ],
      hintEN:"Use: ‘We like… / We prefer…’",
      hintFR:"Utilise : « We like… / We prefer… »"
    },
    { botEN:"Thank you. Next, I’m going to send you a short checklist. When do you want the venue visit?", botFR:"Merci. Ensuite, je vais vous envoyer une checklist. Quand voulez-vous la visite du lieu ?",
      opts:[
        {t:"Next Tuesday at 10 AM works for us.", ok:true, why:"Clear time + works for us."},
        {t:"Tuesday 10 works.", ok:false, why:"Too informal/unclear for A2."},
        {t:"We want yesterday.", ok:false, why:"Time mismatch."},
      ],
      hintEN:"Use day + time (AM/PM) + ‘works for us’.",
      hintFR:"Jour + heure (AM/PM) + « works for us »."
    },
    { botEN:"Great. I’ll confirm with the venue and I’ll email you today. Anything else?", botFR:"Super. Je confirme avec le lieu et je vous email aujourd’hui. Autre chose ?",
      opts:[
        {t:"Yes, please. Can you help us with the seating plan?", ok:true, why:"Polite request + can you…"},
        {t:"You help me seating plan.", ok:false, why:"Missing auxiliary + articles."},
        {t:"No, I am tomorrow.", ok:false, why:"Wrong meaning."},
      ],
      hintEN:"Ask with: ‘Can you…?’",
      hintFR:"Demande avec : « Can you…? »"
    }
  ];

  const emailBlocks = [
    { lblEN:"Greeting", lblFR:"Salutation",
      lines:[
        {t:"Hello, thank you for your time today.", ok:true},
        {t:"Hi, wedding now.", ok:false},
        {t:"Thanks you time.", ok:false},
      ]
    },
    { lblEN:"What I'm doing now (continuous)", lblFR:"En ce moment (continu)",
      lines:[
        {t:"I’m currently preparing your decoration plan and mood board.", ok:true},
        {t:"I prepare now your decoration.", ok:false},
        {t:"I’m going prepare your mood board.", ok:false},
      ]
    },
    { lblEN:"Routine (simple)", lblFR:"Routine (simple)",
      lines:[
        {t:"I reply to emails every morning and I confirm details with suppliers.", ok:true},
        {t:"I am replying every morning now.", ok:false},
        {t:"I replies emails.", ok:false},
      ]
    },
    { lblEN:"Next step (future)", lblFR:"Prochaine étape (futur)",
      lines:[
        {t:"I’m going to send the checklist tomorrow, and I’ll confirm the venue visit.", ok:true},
        {t:"I sending tomorrow.", ok:false},
        {t:"I’m go to send tomorrow checklist.", ok:false},
      ]
    },
    { lblEN:"Closing", lblFR:"Formule de fin",
      lines:[
        {t:"Have a lovely day. Best regards, Sabine", ok:true},
        {t:"Bye bye.", ok:false},
        {t:"Regards, I.", ok:false},
      ]
    }
  ];

  const builderOptions = {
    greeting:{
      A1:["Hello, my name is Sabine.","Hello, I’m Sabine."],
      A2:["Hello, I’m Sabine, your wedding planner.","Hello, this is Sabine, your wedding planner & designer."],
      B1:["Hello, I’m Sabine, your wedding planner & designer at Cérémonie Story."]
    },
    routine:{
      A1:["I answer emails every morning.","I call clients every day."],
      A2:["I reply to client emails every morning and I confirm details with suppliers.","I organise appointments and I update the checklist every day."],
      B1:["I coordinate suppliers, manage appointments, and update the timeline to keep everything smooth."]
    },
    now:{
      A1:["I’m working on the decoration plan.","I’m preparing your checklist."],
      A2:["I’m currently preparing the mood board and the seating plan.","I’m working on the decoration plan and the florist order this week."],
      B1:["I’m currently finalising the design concept and coordinating deliveries for the reception setup."]
    },
    next:{
      A1:["I’m going to call you tomorrow.","I’m going to send the plan tomorrow."],
      A2:["I’m going to send the timeline tomorrow, and I’ll confirm the venue visit.","Next week, I’m going to contact the caterer and the DJ."],
      B1:["I’m going to send you the updated timeline tomorrow, and I’ll confirm all supplier timings before the venue walkthrough."]
    },
    close:{
      A1:["Thank you. Have a nice day.","Thank you. Bye."],
      A2:["Thank you. Please message me if you have any questions.","Thank you. I’m here if you need anything."],
      B1:["Thank you — I’m here to support you at every step. Feel free to message me anytime."]
    }
  };

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const times = ["9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:30 PM","5:00 PM"];
  const tasks = [
    {en:"call the couple", fr:"appeler le couple"},
    {en:"reply to emails", fr:"répondre aux emails"},
    {en:"meet the florist", fr:"rencontrer la fleuriste"},
    {en:"update the timeline", fr:"mettre à jour le planning"},
    {en:"prepare the seating plan", fr:"préparer le plan de table"},
    {en:"confirm the venue visit", fr:"confirmer la visite du lieu"},
  ];
  const whQuestions = [
    {en:"What time is the meeting?", fr:"À quelle heure est la réunion ?"},
    {en:"When do we visit the venue?", fr:"Quand visite‑t‑on le lieu ?"},
    {en:"Where do we meet?", fr:"Où se retrouve‑t‑on ?"},
    {en:"How do we pay the deposit?", fr:"Comment paie‑t‑on l’acompte ?"},
    {en:"Who do we contact for the DJ?", fr:"Qui contacte‑t‑on pour le DJ ?"},
    {en:"Do you confirm the schedule today?", fr:"Vous confirmez le planning aujourd’hui ?"},
  ];

  // ---------- init UI ----------
  function init(){
    $("#levelSelect").value = state.level;
    $("#levelSelect").addEventListener("change", (e)=>{ state.level = e.target.value; saveState(); renderAll(); });

    $("#toggleFR").addEventListener("click", ()=> setFR(!state.fr));
    $("#btnReset").addEventListener("click", ()=>{ localStorage.removeItem(LS_KEY); location.reload(); });

    $$(".tab").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        $$(".tab").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        const tab = btn.getAttribute("data-tab");
        $$(".panel").forEach(p=>p.classList.remove("show"));
        $("#tab-"+tab).classList.add("show");
        window.scrollTo({top:0, behavior:"smooth"});
      });
    });

    $$(".btn[data-warm]").forEach(b=>b.addEventListener("click", ()=>{
      const key = b.getAttribute("data-warm");
      const m = warmups[key];
      const out = $("#warmOut");
      out.innerHTML = `<div><b>Model:</b> ${m.en}</div>` + (state.fr ? `<div class="small">${m.fr}</div>` : "");
      out.dataset.lastSpeak = m.en;
      saveState();
    }));
    $("#btnWarmSpeak").addEventListener("click", ()=> speak($("#warmOut").dataset.lastSpeak || warmups.routine.en));

    $$(".segBtn").forEach(b=>b.addEventListener("click", ()=>{
      $$(".segBtn").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      state.vocabFilter = b.getAttribute("data-vfilter");
      saveState();
      renderVocab();
    }));
    $("#vocabSearch").value = state.vocabQuery;
    $("#vocabSearch").addEventListener("input", (e)=>{ state.vocabQuery = (e.target.value||"").trim(); saveState(); renderVocab(); });

    $("#btnTenseMore").addEventListener("click", newTensePickerQuestion);
    $("#btnTenseWhy").addEventListener("click", ()=>{
      const fb = $("#tenseFeedback");
      const why = fb.dataset.why || "";
      if(why) fb.textContent = why;
    });

    $("#btnGapNew").addEventListener("click", ()=> renderGaps(true));
    $("#btnGapHint").addEventListener("click", ()=>{
      $("#gapFeedback").className = "feedback";
      $("#gapFeedback").textContent = gapHint();
    });

    $("#btnOrderReset").addEventListener("click", ()=> initOrder(true));
    $("#btnOrderHint").addEventListener("click", ()=>{
      const fb=$("#orderFeedback"); fb.className="feedback"; fb.textContent = orderHint();
    });
    $("#btnOrderCheck").addEventListener("click", checkOrder);

    $("#dlgHint").addEventListener("click", showDialogueHint);
    $("#dlgListen").addEventListener("click", ()=> speak($("#dlgBot").dataset.lastSpeak || ""));
    $("#dlgRestart").addEventListener("click", startDialogue);

    $("#emailCopy").addEventListener("click", ()=> copyText(currentEmailText()));
    $("#emailListen").addEventListener("click", ()=> speak(currentEmailText()));
    $("#emailReset").addEventListener("click", ()=>{ state.progress.email = {}; saveState(); renderEmailBuilder(); });

    $("#txtCopy").addEventListener("click", ()=> copyText(currentBuiltText()));
    $("#txtListen").addEventListener("click", ()=> speak(currentBuiltText()));
    $("#txtModel").addEventListener("click", showTextModel);

    $$(".upgradeBox .btn[data-up]").forEach(b=>b.addEventListener("click", ()=>{
      const lvl=b.getAttribute("data-up");
      $("#upgradeOut").textContent = buildUpgrade(lvl);
      $("#upgradeOut").dataset.lastSpeak = $("#upgradeOut").textContent;
    }));
    $("#upListen").addEventListener("click", ()=> speak($("#upgradeOut").dataset.lastSpeak || ""));

    $("#plGenerate").addEventListener("click", generatePlanner);
    $("#plHint").addEventListener("click", ()=>{
      $("#plannerOut").innerHTML = `<div><b>Hint:</b> Routine → present simple • Now → present continuous • Next → going to / will</div>` +
        (state.fr ? `<div class="small">Indice : Routine → présent simple • Maintenant → continu • Prochaine étape → going to / will</div>` : "");
    });
    $("#plListen").addEventListener("click", ()=> speak($("#plannerOut").dataset.lastSpeak || ""));

    renderAll();
    setFR(state.fr);
  }

  function renderAll(){
    renderTenseCards();
    renderVocab();
    renderDecision();
    newTensePickerQuestion();
    renderGaps(false);
    initOrder(false);
    startDialogue();
    renderEmailBuilder();
    renderTextBuilder();
    renderPlannerSelects();
    renderWHBank();
    if(!$("#upgradeOut").textContent.trim()){
      $("#upgradeOut").textContent = buildUpgrade(state.level);
      $("#upgradeOut").dataset.lastSpeak = $("#upgradeOut").textContent;
    }
  }

  function renderTenseCards(){
    const root = $("#tenseCards");
    root.innerHTML = "";
    tenseCards.forEach(c=>{
      const el=document.createElement("div");
      el.className="tenseCard";
      el.innerHTML = `
        <div class="tenseCardTop"><h4>${c.title}</h4><span class="tag">${c.tag}</span></div>
        <p>${c.en}</p>
        ${state.fr ? `<p class="fr" style="display:block">${c.fr}</p>` : `<p class="fr" style="display:none">${c.fr}</p>`}
      `;
      root.appendChild(el);
    });
  }

  function renderVocab(){
    $$(".segBtn").forEach(b=>b.classList.toggle("active", b.getAttribute("data-vfilter") === state.vocabFilter));
    const q = (state.vocabQuery||"").toLowerCase();
    const items = vocab.filter(v=>{
      const okCat = state.vocabFilter==="all" || v.cat===state.vocabFilter;
      const okQ = !q || v.en.toLowerCase().includes(q) || v.fr.toLowerCase().includes(q) || (v.ex||"").toLowerCase().includes(q);
      return okCat && okQ;
    });
    const root=$("#vocabGrid");
    root.innerHTML="";
    items.forEach(v=>{
      const card=document.createElement("button");
      card.type="button";
      card.className="vocabCard";
      card.setAttribute("aria-expanded","false");
      card.innerHTML = `
        <div class="vocabTop">
          <div class="vocabIcon" aria-hidden="true">${v.icon}</div>
          <div class="vocabCat">${v.cat}</div>
        </div>
        <div class="vocabWord">${v.en}</div>
        <div class="vocabMean">
          <div><b>FR:</b> ${v.fr}</div>
          <div style="margin-top:6px"><b>Ex:</b> ${v.ex}</div>
        </div>
      `;
      card.addEventListener("click", ()=>{
        const open = card.classList.toggle("open");
        card.setAttribute("aria-expanded", open ? "true" : "false");
        card.querySelector(".vocabMean").style.display = open ? "block" : "none";
      });
      root.appendChild(card);
    });
  }

  function renderDecision(){
    const root=$("#decisionGrid");
    root.innerHTML="";
    decisionItems.forEach(d=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="decisionBtn";
      b.innerHTML = `<div style="font-weight:1000">${d.icon} ${d.en}</div>` + (state.fr ? `<div class="small" style="margin-top:4px;color:rgba(25,25,25,.7);font-weight:800">${d.fr}</div>` : "");
      b.addEventListener("click", ()=>{
        const out=$("#decisionOut");
        out.innerHTML = `<div><b>Best tense:</b> ${d.tense}</div><div style="margin-top:6px"><b>Example:</b> ${d.ex}</div>` +
          (state.fr ? `<div class="small" style="margin-top:6px"><b>FR:</b> ${d.fr}</div>` : "");
        out.dataset.lastSpeak = d.ex;
      });
      root.appendChild(b);
    });
    $("#decisionOut").innerHTML = `<div class="small">${state.fr ? "Clique sur une situation pour voir le bon temps + un exemple." : "Tap a situation to see the best tense + an example."}</div>`;
  }

  // ---- Tense picker ----
  let tensePickerQ=null;
  function newTensePickerQuestion(){
    tensePickerQ = tensePickerBank[Math.floor(Math.random()*tensePickerBank.length)];
    const root=$("#tensePicker");
    root.innerHTML="";
    const stem=document.createElement("div");
    stem.className="qStem";
    stem.innerHTML = `${tensePickerQ.stemEN}` + (state.fr ? `<div class="small" style="margin-top:6px;color:rgba(25,25,25,.72)">${tensePickerQ.stemFR}</div>` : "");
    root.appendChild(stem);

    const opts=document.createElement("div");
    opts.className="qOpts";
    ["present simple","present continuous","future"].forEach(name=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="opt";
      b.textContent=name;
      b.addEventListener("click", ()=>{
        $$(".opt", opts).forEach(x=>x.classList.remove("good","bad"));
        const ok = normalize(name)===normalize(tensePickerQ.correct);
        b.classList.add(ok ? "good" : "bad");
        const fb=$("#tenseFeedback");
        fb.className="feedback " + (ok ? "good" : "bad");
        fb.dataset.why = state.fr ? tensePickerQ.whyFR : tensePickerQ.whyEN;
        fb.textContent = ok
          ? (state.fr ? "✅ Correct ! " : "✅ Correct! ") + (state.fr ? tensePickerQ.whyFR : tensePickerQ.whyEN)
          : (state.fr ? "❌ Pas encore. " : "❌ Not yet. ") + (state.fr ? tensePickerQ.hintFR : tensePickerQ.hintEN);
      });
      opts.appendChild(b);
    });
    root.appendChild(opts);

    const fb=$("#tenseFeedback");
    fb.className="feedback";
    fb.textContent = state.fr ? "Choisis le bon temps." : "Choose the best tense.";
    fb.dataset.why="";
  }

  // ---- Gaps ----
  let gapSet=null;
  function renderGaps(reshuffle){
    if(!gapSet || reshuffle) gapSet = shuffle(gapBank).slice(0,3);
    const root=$("#gapList");
    root.innerHTML="";
    gapSet.forEach((g, idx)=>{
      const item=document.createElement("div");
      item.className="gapItem";
      item.innerHTML = `
        <div class="line">${templateWithSelects(g.en, g.blanks, idx)}</div>
        ${state.fr ? `<div class="line fr" style="display:block;margin-top:6px">${templateWithSelects(g.fr, g.blanks, idx, true)}</div>` : `<div class="line fr" style="display:none;margin-top:6px">${templateWithSelects(g.fr, g.blanks, idx, true)}</div>`}
      `;
      root.appendChild(item);
    });

    $$("select[data-gap]", root).forEach(sel=>{
      sel.addEventListener("change", ()=> checkAllGaps(true));
    });

    $("#gapFeedback").className="feedback";
    $("#gapFeedback").textContent = state.fr ? "Choisis les bonnes formes." : "Choose the correct forms.";

    // Restore values async
    setTimeout(()=>{
      $$("select[data-gap]").forEach(sel=>{
        const key=sel.dataset.key;
        const saved=(((state.progress||{}).gaps||{})[key]) || "";
        if(saved) sel.value = saved;
      });
      checkAllGaps(false);
    }, 0);
  }

  function templateWithSelects(tpl, blanks, idx, isFr=false){
    let out=tpl;
    blanks.forEach((b, bi)=>{
      const key = `g${idx}_${b.key}_${bi}`;
      const opts = b.choices.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
      const sel = `<select data-gap="1" data-key="${escapeHTML(key)}" data-ans="${escapeHTML(b.ans)}" aria-label="blank">
        <option value="">…</option>${opts}
      </select>`;
      out = out.replace(`{${b.key}}`, sel);
    });
    return out;
  }

  function checkAllGaps(showFeedback){
    const sels = $$("select[data-gap]");
    let okCount=0;
    sels.forEach(sel=>{
      const val=sel.value||"";
      const ans=sel.dataset.ans||"";
      const key=sel.dataset.key||"";
      state.progress.gaps = state.progress.gaps || {};
      state.progress.gaps[key]=val;
      const ok = val && normalize(val)===normalize(ans);
      if(ok) okCount++;
      sel.style.borderColor = val ? (ok ? "rgba(127,142,99,.65)" : "rgba(190,78,78,.45)") : "rgba(0,0,0,.10)";
    });
    saveState();
    if(showFeedback){
      const fb=$("#gapFeedback");
      const total=sels.length;
      if(okCount===total){
        fb.className="feedback good";
        fb.textContent = state.fr ? `✅ Parfait ! (${okCount}/${total})` : `✅ Perfect! (${okCount}/${total})`;
      }else{
        fb.className="feedback";
        fb.textContent = state.fr ? `Progress: ${okCount}/${total}. Astuce : every day / right now / tomorrow.` : `Progress: ${okCount}/${total}. Tip: every day / right now / tomorrow.`;
      }
    }
  }

  function gapHint(){
    return state.fr
      ? "Indice : every day / usually → présent simple • right now / today → présent continu • tomorrow / next → futur."
      : "Hint: every day / usually → present simple • right now / today → present continuous • tomorrow / next → future.";
  }

  // ---- Order game ----
  let orderBankArr=[], orderChosen=[];
  function initOrder(reset){
    orderChosen=[];
    orderBankArr = shuffle(checklistCorrect);
    renderOrder();
    const fb=$("#orderFeedback");
    fb.className="feedback";
    fb.textContent = state.fr ? "Construis la timeline, puis clique ✅ Check." : "Build the timeline, then tap ✅ Check.";
    if(reset) saveState();
  }
  function renderOrder(){
    const bank=$("#orderBank"), out=$("#orderOut");
    bank.innerHTML=""; out.innerHTML="";
    orderBankArr.forEach(step=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="stepBtn";
      b.textContent=step;
      b.disabled = orderChosen.includes(step);
      b.addEventListener("click", ()=>{
        if(orderChosen.includes(step)) return;
        orderChosen.push(step);
        renderOrder();
      });
      bank.appendChild(b);
    });
    orderChosen.forEach(step=>{
      const li=document.createElement("li");
      li.textContent=step;
      out.appendChild(li);
    });
  }
  function orderHint(){
    return state.fr
      ? "Indice : 1) préférences/budget → 2) visite du lieu → 3) mood board → 4) prestataires → 5) timeline."
      : "Hint: 1) preferences/budget → 2) venue visit → 3) mood board → 4) suppliers → 5) timeline.";
  }
  function checkOrder(){
    const fb=$("#orderFeedback");
    if(orderChosen.length < checklistCorrect.length){
      fb.className="feedback bad";
      fb.textContent = state.fr ? "❌ Ajoute toutes les étapes avant de vérifier." : "❌ Add all steps before checking.";
      return;
    }
    const ok = orderChosen.every((s,i)=> s===checklistCorrect[i]);
    fb.className = "feedback " + (ok ? "good" : "bad");
    fb.textContent = ok ? (state.fr ? "✅ Bravo ! Timeline correcte." : "✅ Great! Correct timeline.")
                        : (state.fr ? "❌ Pas encore. Essaie l’indice." : "❌ Not yet. Try the hint.");
  }

  // ---- Dialogue ----
  let dlgIndex=0;
  function startDialogue(){ dlgIndex=0; renderDialogue(); }
  function renderDialogue(){
    const step = dialogueSteps[dlgIndex];
    const bot=$("#dlgBot");
    bot.textContent = step.botEN + (state.fr ? `\n(${step.botFR})` : "");
    bot.dataset.lastSpeak = step.botEN;
    const opts=$("#dlgOpts");
    opts.innerHTML="";
    shuffle(step.opts).forEach(o=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="opt";
      b.textContent=o.t;
      b.addEventListener("click", ()=>{
        $$(".opt", opts).forEach(x=>x.classList.remove("good","bad"));
        b.classList.add(o.ok ? "good" : "bad");
        const fb=$("#dlgFeedback");
        fb.className = "feedback " + (o.ok ? "good" : "bad");
        fb.textContent = (o.ok ? (state.fr ? "✅ Correct. " : "✅ Correct. ") : (state.fr ? "❌ Not quite. " : "❌ Not quite. ")) + o.why;
        if(o.ok){
          dlgIndex++;
          if(dlgIndex >= dialogueSteps.length){
            setTimeout(()=>{ fb.className="feedback good"; fb.textContent = state.fr ? "🎉 Dialogue complete !" : "🎉 Dialogue complete!"; }, 350);
          }else{
            setTimeout(renderDialogue, 420);
          }
        }
      });
      opts.appendChild(b);
    });
    const fb=$("#dlgFeedback");
    fb.className="feedback";
    fb.textContent = state.fr ? "Choisis la meilleure réponse." : "Choose the best reply.";
  }
  function showDialogueHint(){
    const step = dialogueSteps[dlgIndex];
    const fb=$("#dlgFeedback");
    fb.className="feedback";
    fb.textContent = state.fr ? step.hintFR : step.hintEN;
  }

  // ---- Email builder ----
  function renderEmailBuilder(){
    const root=$("#emailBuilder");
    root.innerHTML="";
    state.progress.email = state.progress.email || {};
    emailBlocks.forEach((blk,i)=>{
      const row=document.createElement("div");
      row.className="emailRow";
      row.innerHTML = `<div class="lbl">${blk.lblEN}${state.fr ? ` <span class="small">(${blk.lblFR})</span>` : ""}</div><div class="opts"></div>`;
      const opts=$(".opts", row);
      blk.lines.forEach((ln,j)=>{
        const chip=document.createElement("button");
        chip.type="button";
        chip.className="smallOpt";
        chip.textContent=ln.t;
        const key=`b${i}`;
        if(state.progress.email[key]===j) chip.classList.add("active");
        chip.addEventListener("click", ()=>{
          state.progress.email[key]=j;
          saveState();
          renderEmailBuilder();
          checkEmail(true);
        });
        opts.appendChild(chip);
      });
      root.appendChild(row);
    });

    const preview=document.createElement("div");
    preview.className="emailPreview";
    preview.id="emailPreview";
    preview.textContent = currentEmailText() || (state.fr ? "Choisis une phrase par bloc." : "Choose one sentence per block.");
    root.appendChild(preview);
    checkEmail(false);
  }
  function currentEmailText(){
    const picks=state.progress.email||{};
    const lines=[];
    for(let i=0;i<emailBlocks.length;i++){
      const idx=picks[`b${i}`];
      if(typeof idx!=="number") return "";
      lines.push(emailBlocks[i].lines[idx].t);
    }
    return lines.join("\n");
  }
  function checkEmail(show){
    const text=currentEmailText();
    if($("#emailPreview")) $("#emailPreview").textContent = text || (state.fr ? "Choisis une phrase par bloc." : "Choose one sentence per block.");
    const picks=state.progress.email||{};
    let ok=true;
    for(let i=0;i<emailBlocks.length;i++){
      const idx=picks[`b${i}`];
      if(typeof idx!=="number"){ ok=false; break; }
      if(!emailBlocks[i].lines[idx].ok) ok=false;
    }
    if(show){
      const fb=$("#emailFeedback");
      if(!text){
        fb.className="feedback";
        fb.textContent = state.fr ? "Construis l’email." : "Build the email.";
        return;
      }
      fb.className = "feedback " + (ok ? "good" : "bad");
      fb.textContent = ok ? (state.fr ? "✅ Email pro et correct." : "✅ Professional and correct.")
                          : (state.fr ? "❌ Une ligne est incorrecte. Change une option." : "❌ One line is incorrect. Switch an option.");
    }
  }

  // ---- Text builder ----
  function optionsForField(key, level){
    const levels=["A1","A2","B1"];
    const idx=levels.indexOf(level);
    const acc=[];
    for(let i=0;i<=Math.max(0,idx);i++){
      const lvl=levels[i];
      (builderOptions[key][lvl]||[]).forEach(x=>acc.push(x));
    }
    return Array.from(new Set(acc));
  }
  function renderTextBuilder(){
    const root=$("#textBuilder");
    root.innerHTML="";
    state.progress.text = state.progress.text || {};
    const fields=[
      {key:"greeting", en:"Greeting", fr:"Salutation"},
      {key:"routine", en:"Routine (present simple)", fr:"Routine (présent simple)"},
      {key:"now", en:"Now (present continuous)", fr:"En ce moment (continu)"},
      {key:"next", en:"Next step (future)", fr:"Prochaine étape (futur)"},
      {key:"close", en:"Closing", fr:"Formule de fin"},
    ];
    fields.forEach(f=>{
      const wrap=document.createElement("label");
      wrap.className="field";
      wrap.innerHTML = `<span class="fieldLbl">${f.en}${state.fr ? ` (${f.fr})` : ""}</span>`;
      const sel=document.createElement("select");
      sel.id=`txt_${f.key}`;
      const opts=optionsForField(f.key, state.level);
      sel.innerHTML = `<option value="">— choose —</option>` + opts.map(o=>`<option value="${escapeHTML(o)}">${escapeHTML(o)}</option>`).join("");
      sel.value = state.progress.text[f.key] || "";
      sel.addEventListener("change", ()=>{
        state.progress.text[f.key]=sel.value;
        saveState();
        updateTextFeedback();
      });
      wrap.appendChild(sel);
      root.appendChild(wrap);
    });
    updateTextFeedback();
  }
  function currentBuiltText(){
    const t=state.progress.text||{};
    const parts=["greeting","routine","now","next","close"].map(k=>(t[k]||"").trim()).filter(Boolean);
    return parts.join(" ");
  }
  function updateTextFeedback(){
    const fb=$("#txtFeedback");
    const txt=currentBuiltText();
    if(!txt){
      fb.className="feedback";
      fb.textContent = state.fr ? "Choisis 5 éléments pour générer ton paragraphe." : "Choose 5 items to generate your paragraph.";
      return;
    }
    const hasSimple = /usually|every|often|always|reply|call|organise|coordinate|update/i.test(txt);
    const hasCont = /\bI'?m\b.*\b\w+ing\b/i.test(txt) || /\bWe'?re\b.*\b\w+ing\b/i.test(txt);
    const hasFuture = /\bgoing to\b|\bI'?ll\b|\bwill\b/i.test(txt);
    const ok = hasSimple && hasCont && hasFuture;
    fb.className = "feedback " + (ok ? "good" : "");
    fb.textContent = ok ? (state.fr ? "✅ Super ! 3 temps présents." : "✅ Great! You used all 3 tenses.")
                        : (state.fr ? "⚠️ Ajoute routine + en cours + futur." : "⚠️ Add routine + now + future.");
  }
  function buildUpgrade(lvl){
    const pick=(key, level)=> (builderOptions[key][level] && builderOptions[key][level][0]) ? builderOptions[key][level][0] : "";
    return [pick("greeting",lvl),pick("routine",lvl),pick("now",lvl),pick("next",lvl),pick("close",lvl)].filter(Boolean).join(" ");
  }
  function showTextModel(){
    $("#txtFeedback").className="feedback";
    $("#txtFeedback").textContent = "Model:\n" + buildUpgrade(state.level);
  }

  // ---- Planner ----
  function renderPlannerSelects(){
    $("#plTime").innerHTML = times.map(t=>`<option value="${escapeHTML(t)}">${escapeHTML(t)}</option>`).join("");
    $("#plDay").innerHTML = days.map(d=>`<option value="${escapeHTML(d)}">${escapeHTML(d)}</option>`).join("");
    $("#plTask").innerHTML = tasks.map((t,i)=>`<option value="${i}">${escapeHTML(t.en)}${state.fr ? ` — ${escapeHTML(t.fr)}` : ""}</option>`).join("");
  }
  function ingVerb(phrase){
    const parts=phrase.split(" ");
    const v=parts[0].toLowerCase();
    let ing=v;
    if(v.endsWith("e") && !v.endsWith("ee")) ing = v.slice(0,-1)+"ing";
    else if(v.endsWith("y")) ing = v.slice(0,-1)+"ying";
    else if(v.endsWith("t")) ing = v + "ting";
    else ing = v+"ing";
    parts[0]=ing;
    return parts.join(" ");
  }
  function generatePlanner(){
    const time=$("#plTime").value;
    const day=$("#plDay").value;
    const task=tasks[parseInt($("#plTask").value,10)] || tasks[0];
    const mode=$("#plMode").value;
    let sentence="", question="";
    if(mode==="routine"){
      sentence = `On ${day}s, I ${task.en} at ${time}.`;
      question = `What time do you usually ${task.en}?`;
    }else if(mode==="now"){
      sentence = `Today, I’m ${ingVerb(task.en)}.`;
      question = `What are you doing today?`;
    }else{
      sentence = `Next, I’m going to ${task.en} on ${day} at ${time}. I’ll confirm by email.`;
      question = `When are you going to ${task.en}?`;
    }
    const out=$("#plannerOut");
    out.innerHTML = `<div><b>Sentence:</b> ${sentence}</div><div class="q"><b>Client question:</b> ${question}</div>` +
      (state.fr ? `<div class="small" style="margin-top:8px"><b>FR:</b> Réponds à la question en 1 phrase.</div>` : "");
    out.dataset.lastSpeak = sentence + " " + question;
  }

  // ---- WH bank ----
  function renderWHBank(){
    const root=$("#whBank");
    root.innerHTML="";
    whQuestions.forEach(q=>{
      const el=document.createElement("div");
      el.className="gapItem";
      el.innerHTML = `<div class="line">${q.en}</div>` + (state.fr ? `<div class="line fr" style="display:block;margin-top:6px">${q.fr}</div>` : "") +
        `<div class="btnRow" style="margin-top:10px"><button class="btn ghost">🔊 Listen</button></div>`;
      $("button", el).addEventListener("click", ()=> speak(q.en));
      root.appendChild(el);
    });
  }

  // ---- Copy helper ----
  function copyText(text){
    if(!text) return;
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(()=> toast(state.fr ? "Copié ✓" : "Copied ✓")).catch(()=> fallbackCopy(text));
    }else fallbackCopy(text);
  }
  function fallbackCopy(text){
    const ta=document.createElement("textarea");
    ta.value=text;
    document.body.appendChild(ta);
    ta.select();
    try{ document.execCommand("copy"); toast(state.fr ? "Copié ✓" : "Copied ✓"); }catch(e){}
    document.body.removeChild(ta);
  }
  function toast(msg){
    const el=document.createElement("div");
    el.textContent=msg;
    el.style.position="fixed";
    el.style.left="50%";
    el.style.bottom="16px";
    el.style.transform="translateX(-50%)";
    el.style.padding="10px 12px";
    el.style.borderRadius="999px";
    el.style.background="rgba(255,255,255,.92)";
    el.style.border="1px solid rgba(179,139,63,.28)";
    el.style.boxShadow="0 16px 30px rgba(0,0,0,.10)";
    el.style.fontWeight="900";
    el.style.zIndex="999";
    document.body.appendChild(el);
    setTimeout(()=>{ el.style.opacity="0"; el.style.transition="opacity .35s"; }, 900);
    setTimeout(()=>{ el.remove(); }, 1400);
  }

  // Voices init
  if("speechSynthesis" in window){
    window.speechSynthesis.onvoiceschanged = ()=>{};
  }
  init();
})();