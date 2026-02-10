/* SpeakEasyTisha • Ceremonie Story • Page 2 (Client Journey + Workplace) */
/* Tap-friendly, Safari-friendly, no drag & drop. */

(() => {
  "use strict";

  // ---------- Helpers ----------
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const shuffle = (arr) => {
    const a = arr.slice();
    for(let i=a.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  const aAn = (phrase) => {
    const w = String(phrase || "").trim().toLowerCase();
    if(!w) return "a";
    const first = w.replace(/^[^a-z]+/g, "");
    const anList = ["honest","hour","honor","heir"];
    const aList = ["university","unicorn","european","one","useful","user","ubiquitous"];
    for(const s of anList){ if(first.startsWith(s)) return "an"; }
    for(const s of aList){ if(first.startsWith(s)) return "a"; }
    return /^[aeiou]/.test(first) ? "an" : "a";
  };

  const setChipOn = (btnOn, group) => {
    group.forEach(b => {
      const on = (b === btnOn);
      b.classList.toggle("chip--on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  };

  // ---------- State ----------
  const state = {
    score: 0,
    checked: 0,
    accent: "US",
    frHelp: false,
    stepId: "discover",
    lvl: "A2",
    outLvl: "A2",
    orderBuild: [],
    dialogHints: 0
  };

  // ---------- UI refs ----------
  const scoreEl = $("#score");
  const checkedEl = $("#checked");
  const progressBar = $("#progressBar");

  const toggleFR = $("#toggleFR");
  const accentUS = $("#accentUS");
  const accentUK = $("#accentUK");
  const btnReset = $("#btnReset");
  const btnStart = $("#btnStart");

  // Stepper
  const stepList = $("#stepList");
  const stepTitle = $("#stepTitle");
  const stepText = $("#stepText");
  const btnSayStep = $("#btnSayStep");
  const phraseGrid = $("#phraseGrid");
  const kpiRow = $("#kpiRow");
  const lvlA2 = $("#lvlA2"), lvlB1 = $("#lvlB1"), lvlB2 = $("#lvlB2");

  // Ordering
  const orderPool = $("#orderPool");
  const orderBuild = $("#orderBuild");
  const btnOrderUndo = $("#btnOrderUndo");
  const btnOrderReset = $("#btnOrderReset");
  const btnOrderCheck = $("#btnOrderCheck");
  const orderFeedback = $("#orderFeedback");

  // Workplace
  const prepMatch = $("#prepMatch");
  const prepMCQ = $("#prepMCQ");

  // Dialogue
  const dialogReorder = $("#dialogReorder");
  const btnDialogShuffle = $("#btnDialogShuffle");
  const btnDialogCheck = $("#btnDialogCheck");
  const btnDialogHint = $("#btnDialogHint");
  const btnDialogSay = $("#btnDialogSay");
  const dialogFeedback = $("#dialogFeedback");
  const dialogHint = $("#dialogHint");
  const respMCQ = $("#respMCQ");

  // Builder
  const bName = $("#bName"), bTitle=$("#bTitle"), bTeam=$("#bTeam"), bCity=$("#bCity"), bVenue=$("#bVenue");
  const bMission = $("#bMission"), bGoal1=$("#bGoal1"), bGoal2=$("#bGoal2");
  const outA2 = $("#outA2"), outB1=$("#outB1"), outB2=$("#outB2");
  const btnBuild=$("#btnBuild"), btnCopy=$("#btnCopy"), btnSave=$("#btnSave"), btnSpeak=$("#btnSpeak");
  const outText=$("#outText"), saveMsg=$("#saveMsg");

  // Final
  const btnCelebrate=$("#btnCelebrate");
  const finalMsg=$("#finalMsg");

  // ---------- Speech ----------
  let voices = [];
  const loadVoices = () => { voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; };
  if(window.speechSynthesis){
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  const pickVoice = (accent) => {
    if(!voices || !voices.length) return null;
    const want = accent === "UK" ? ["en-GB", "en_GB"] : ["en-US", "en_US"];
    const v = voices.find(vv => want.some(w => (vv.lang||"").includes(w)));
    if(v) return v;
    // fallback any English
    return voices.find(vv => (vv.lang||"").startsWith("en")) || voices[0] || null;
  };

  const speak = (text) => {
    if(!window.speechSynthesis) return;
    try{
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice(state.accent);
      if(v) u.voice = v;
      u.rate = 0.98;
      u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    }catch(e){}
  };

  // Click-to-speak buttons (data-say)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-say]");
    if(!btn) return;
    const t = btn.getAttribute("data-say") || "";
    if(t.trim()) speak(t.trim());
  });

  // ---------- Scoring / progress ----------
  const bump = (delta=1) => {
    state.score += delta;
    scoreEl.textContent = String(state.score);
  };
  const checked = () => {
    state.checked += 1;
    checkedEl.textContent = String(state.checked);
    // 5 main blocks → progress in 20% increments
    const pct = clamp(Math.round((state.checked/10)*100), 0, 100);
    progressBar.style.width = pct + "%";
  };

  const resetAll = () => {
    state.score = 0; state.checked = 0;
    scoreEl.textContent = "0"; checkedEl.textContent = "0";
    progressBar.style.width = "0%";
    orderFeedback.textContent = "";
    dialogFeedback.textContent = "";
    finalMsg.textContent = "";
  };

  // ---------- FR help ----------
  const applyFR = () => {
    const frEls = $$(".fr");
    frEls.forEach(el => {
      const show = state.frHelp;
      el.classList.toggle("fr-hide", !show);
      if(show && el.dataset && el.dataset.fr){
        // keep English text, but allow tooltips by attribute if needed
        el.setAttribute("title", el.dataset.fr);
      }else{
        el.removeAttribute("title");
      }
    });
    toggleFR.setAttribute("aria-pressed", state.frHelp ? "true":"false");
    toggleFR.classList.toggle("chip--on", state.frHelp);
  };

  // ---------- Data ----------
  const steps = [
    {
      id:"discover", ico:"📞", title:"Discovery call",
      kpis:["Couple’s story","Budget & priorities","Date & venue ideas"],
      text:{
        A2:"We talk about your wedding and your ideas.",
        B1:"We discuss your story, your budget, and what is most important for you.",
        B2:"We clarify your vision and constraints, so we can design a clear plan and timeline."
      },
      phrases:[
        {k:"Useful question", v:"What style do you want — classic, modern, boho?"},
        {k:"Useful question", v:"What are your top 3 priorities?"},
        {k:"Useful phrase", v:"We take notes and propose the next steps."},
        {k:"Connector", v:"First, we learn your story."}
      ]
    },
    {
      id:"vision", ico:"🎨", title:"Vision + moodboard",
      kpis:["Theme & colors","Inspiration","Guest experience"],
      text:{
        A2:"We choose a theme and colors.",
        B1:"We create a moodboard and define the atmosphere of the day.",
        B2:"We translate your story into a coherent creative direction: visuals, tone, and guest experience."
      },
      phrases:[
        {k:"Key verb", v:"to design a concept"},
        {k:"Useful phrase", v:"We propose options that match your personality."},
        {k:"Connector", v:"Then, we define the theme and decor."},
        {k:"Tip", v:"Use adjectives: elegant, warm, romantic, minimal."}
      ]
    },
    {
      id:"venue", ico:"🏰", title:"Venue + logistics",
      kpis:["Visit the venue","Plan the spaces","Timing & access"],
      text:{
        A2:"We visit the venue and plan the day.",
        B1:"We check the spaces, the schedule, and practical details (parking, rain plan).",
        B2:"We coordinate logistics with the venue to ensure smooth timing and clear responsibilities."
      },
      phrases:[
        {k:"Place", v:"We work at the venue / on site."},
        {k:"Useful phrase", v:"We check the plan B in case of rain."},
        {k:"Connector", v:"After that, we validate the schedule."},
        {k:"Tip", v:"Use prepositions: in Strasbourg / at the château / on the day."}
      ]
    },
    {
      id:"ceremony", ico:"🕊️", title:"Ceremony script",
      kpis:["Write the story","Choose readings","Plan the music"],
      text:{
        A2:"We write the ceremony and choose music.",
        B1:"We prepare a ceremony that tells your story and fits your values.",
        B2:"We craft a personalised ceremony script, coordinating readings, music cues, and key moments."
      },
      phrases:[
        {k:"Mission", v:"Our mission is to create a meaningful moment."},
        {k:"Useful phrase", v:"We write a script and rehearse the timing."},
        {k:"Connector", v:"Next, we prepare the ceremony details."},
        {k:"Verb", v:"to officiate a ceremony"}
      ]
    },
    {
      id:"suppliers", ico:"🤝", title:"Suppliers + schedule",
      kpis:["Select suppliers","Confirm contracts","Create a run sheet"],
      text:{
        A2:"We contact suppliers and make a schedule.",
        B1:"We coordinate vendors (caterer, DJ, photographer) and confirm the timeline.",
        B2:"We manage supplier communication, contract checkpoints, and a detailed run sheet for the day."
      },
      phrases:[
        {k:"Responsibility", v:"We are responsible for coordination."},
        {k:"Useful phrase", v:"We confirm timings with each supplier."},
        {k:"Connector", v:"Then, we finalise the schedule."},
        {k:"Verb", v:"to coordinate vendors"}
      ]
    },
    {
      id:"dayof", ico:"🎉", title:"Wedding day coordination",
      kpis:["Be on site","Solve problems","Keep timing"],
      text:{
        A2:"On the day, we are on site and help everyone.",
        B1:"We manage timing, guide suppliers, and support the couple.",
        B2:"On the wedding day, we supervise operations, handle unexpected issues, and protect the couple’s experience."
      },
      phrases:[
        {k:"Place", v:"On the wedding day, we stay on site."},
        {k:"Useful phrase", v:"We keep everything on time."},
        {k:"Connector", v:"Finally, we coordinate the whole day."},
        {k:"Verb", v:"to troubleshoot quickly"}
      ]
    }
  ];

  // Workplace matching
  const matchPairs = [
    {left:"in", right:"Strasbourg / Alsace"},
    {left:"at", right:"the venue / the château"},
    {left:"on", right:"the wedding day"},
    {left:"across", right:"the region (Alsace)"},
    {left:"on site", right:"at the venue, in person"},
  ];

  const prepQuestions = [
    {q:"We work ___ Strasbourg.", a:"in", options:["in","at","on","to"]},
    {q:"We meet the couple ___ the château.", a:"at", options:["at","in","on","from"]},
    {q:"___ the wedding day, we coordinate everything.", a:"On", options:["On","In","At","With"]},
    {q:"We sometimes work ___ Alsace.", a:"across", options:["across","on","in","about"]},
  ];

  const respQuestions = [
    {q:"Choose the best sentence:", a:0, options:[
      "We are responsible for coordinating suppliers.",
      "We are responsible to coordinate suppliers.",
      "We are responsible at coordinating suppliers."
    ]},
    {q:"Choose the correct purpose:", a:1, options:[
      "Our mission is for create a calm day.",
      "Our mission is to create a calm day.",
      "Our mission is create a calm day."
    ]},
    {q:"Choose the best connector:", a:2, options:[
      "Finally, we discuss your story.",
      "Then, we celebrate the day.",
      "First, we learn your priorities."
    ]},
  ];

  const dialogTags = [
    "Greeting",
    "Needs",
    "Date + venue",
    "Venue details",
    "Mission",
    "Next steps?",
    "Process"
  ];

  const dialogCorrect = [
    "Planner: Hello! Thank you for contacting us. How can we help you?",
    "Client: Hi! We are planning a wedding and we need support.",
    "Planner: Great. First, tell me your date and your venue idea.",
    "Client: We’re thinking about the Château de Pourtalès in Strasbourg.",
    "Planner: Perfect. Our mission is to create a stress‑free day that tells your story.",
    "Client: What are the next steps?",
    "Planner: Then we propose a plan, coordinate suppliers, and prepare the ceremony details."
  ];

  let dialogCurrent = shuffle(dialogCorrect);

  // ---------- Render stepper ----------
  const renderStepList = () => {
    stepList.innerHTML = "";
    steps.forEach(s => {
      const b = document.createElement("button");
      b.className = "stepBtn";
      b.type = "button";
      b.dataset.step = s.id;
      b.setAttribute("aria-current", s.id === state.stepId ? "true":"false");
      b.innerHTML = `
        <span class="stepIco" aria-hidden="true">${s.ico}</span>
        <span class="stepMeta">
          <span class="t">${s.title}</span>
          <span class="s">${s.text.A2}</span>
        </span>`;
      b.addEventListener("click", () => {
        state.stepId = s.id;
        renderStepList();
        renderStepPanel();
      });
      stepList.appendChild(b);
    });
  };

  const renderStepPanel = () => {
    const s = steps.find(x => x.id === state.stepId) || steps[0];
    stepTitle.textContent = s.title;
    stepText.textContent = s.text[state.lvl];

    kpiRow.innerHTML = "";
    s.kpis.forEach(k => {
      const div = document.createElement("div");
      div.className = "mini";
      div.innerHTML = `<div class="mini__k">Key</div><div class="mini__v">${k}</div>`;
      kpiRow.appendChild(div);
    });

    phraseGrid.innerHTML = "";
    s.phrases.forEach(p => {
      const card = document.createElement("div");
      card.className = "phrase";
      card.innerHTML = `
        <p class="k">${p.k}</p>
        <p class="v">${p.v}</p>
        <div class="row">
          <button class="btn btn--ghost" type="button">🔊</button>
          <button class="btn" type="button">+1</button>
        </div>`;
      const [sayBtn, plusBtn] = $$(".btn", card);
      sayBtn.addEventListener("click", () => speak(p.v));
      plusBtn.addEventListener("click", () => { bump(1); checked(); plusBtn.disabled = true; plusBtn.textContent="✓"; });
      phraseGrid.appendChild(card);
    });
  };

  const setLvl = (lvl) => {
    state.lvl = lvl;
    setChipOn(lvl === "A2" ? lvlA2 : (lvl==="B1"?lvlB1:lvlB2), [lvlA2,lvlB1,lvlB2]);
    renderStepPanel();
  };

  // ---------- Ordering challenge ----------
  let orderPoolData = [];
  const renderOrder = () => {
    orderPool.innerHTML = "";
    orderBuild.innerHTML = "";

    orderPoolData.forEach((s) => {
      const b = document.createElement("button");
      b.className = "pickChip";
      b.type = "button";
      b.textContent = s.title;
      b.addEventListener("click", () => {
        state.orderBuild.push(s.id);
        orderPoolData = orderPoolData.filter(x => x.id !== s.id);
        renderOrder();
      });
      orderPool.appendChild(b);
    });

    state.orderBuild.forEach((id) => {
      const s = steps.find(x => x.id === id);
      const b = document.createElement("button");
      b.className = "pickChip";
      b.type = "button";
      b.setAttribute("aria-pressed","true");
      b.textContent = s ? s.title : id;
      b.title = "Tap to remove";
      b.addEventListener("click", () => {
        // remove this id (last occurrence)
        const idx = state.orderBuild.lastIndexOf(id);
        if(idx >= 0) state.orderBuild.splice(idx,1);
        if(s) orderPoolData.push(s);
        orderPoolData = shuffle(orderPoolData);
        renderOrder();
      });
      orderBuild.appendChild(b);
    });
  };

  const resetOrder = () => {
    orderPoolData = shuffle(steps.map(s => ({id:s.id, title:s.title})));
    state.orderBuild = [];
    orderFeedback.textContent = "";
    renderOrder();
  };

  const checkOrder = () => {
    const correct = steps.map(s => s.id);
    if(state.orderBuild.length !== correct.length){
      orderFeedback.textContent = "Add all steps before checking.";
      return;
    }
    const ok = state.orderBuild.every((id, i) => id === correct[i]);
    checked();
    if(ok){
      bump(5);
      orderFeedback.textContent = "✅ Perfect order!";
    }else{
      orderFeedback.textContent = "Not quite. Try again (hint: think first contact → creative → logistics → day-of).";
    }
  };

  // ---------- Matching (tap) ----------
  const renderMatch = (mount, pairs) => {
    mount.innerHTML = "";
    const left = shuffle(pairs.map(p => p.left));
    const right = shuffle(pairs.map(p => p.right));
    let selectedLeft = null;
    let matched = new Set();

    const wrap = document.createElement("div");
    wrap.className = "match";
    wrap.style.display = "grid";
    wrap.style.gridTemplateColumns = "1fr 1fr";
    wrap.style.gap = "10px";

    const colL = document.createElement("div");
    const colR = document.createElement("div");

    const makeBtn = (txt, side) => {
      const b = document.createElement("button");
      b.className = "option";
      b.type = "button";
      b.textContent = txt;
      b.dataset.side = side;
      b.addEventListener("click", () => {
        if(matched.has(txt)) return;
        if(side === "L"){
          selectedLeft = txt;
          $$(".option", colL).forEach(x => x.classList.toggle("selected", x.textContent === txt));
        }else{
          if(!selectedLeft) return;
          const pair = pairs.find(p => p.left === selectedLeft);
          checked();
          if(pair && pair.right === txt){
            bump(2);
            matched.add(selectedLeft);
            matched.add(txt);
            b.classList.add("good");
            const leftBtn = $$(".option", colL).find(x=>x.textContent===selectedLeft);
            if(leftBtn) leftBtn.classList.add("good");
            selectedLeft = null;
            $$(".option", colL).forEach(x => x.classList.remove("selected"));
          }else{
            b.classList.add("bad");
            setTimeout(()=>b.classList.remove("bad"), 420);
          }
        }
      });
      return b;
    };

    left.forEach(t => colL.appendChild(makeBtn(t,"L")));
    right.forEach(t => colR.appendChild(makeBtn(t,"R")));
    wrap.appendChild(colL); wrap.appendChild(colR);
    mount.appendChild(wrap);
  };

  // ---------- MCQ ----------
  const renderMCQ = (mount, questions) => {
    mount.innerHTML = "";
    questions.forEach((qq, idx) => {
      const box = document.createElement("div");
      box.className = "q";
      box.innerHTML = `<p class="q__prompt"><strong>${idx+1}.</strong> ${qq.q}</p>`;
      const opts = document.createElement("div");
      opts.className = "options";
      qq.options.forEach(opt => {
        const b = document.createElement("button");
        b.className = "option";
        b.type = "button";
        b.textContent = opt;
        b.addEventListener("click", () => {
          $$(".option", opts).forEach(x => x.disabled = true);
          checked();
          if(opt === qq.a){
            b.classList.add("good");
            bump(2);
          }else{
            b.classList.add("bad");
            const good = $$(".option", opts).find(x => x.textContent === qq.a);
            if(good) good.classList.add("good");
          }
        });
        opts.appendChild(b);
      });
      box.appendChild(opts);
      mount.appendChild(box);
    });
  };

  const renderMCQIndex = (mount, questions) => {
    mount.innerHTML = "";
    questions.forEach((qq, idx) => {
      const box = document.createElement("div");
      box.className = "q";
      box.innerHTML = `<p class="q__prompt"><strong>${idx+1}.</strong> ${qq.q}</p>`;
      const opts = document.createElement("div");
      opts.className = "options";
      qq.options.forEach((opt, j) => {
        const b = document.createElement("button");
        b.className = "option";
        b.type = "button";
        b.textContent = opt;
        b.addEventListener("click", () => {
          $$(".option", opts).forEach(x => x.disabled = true);
          checked();
          if(j === qq.a){
            b.classList.add("good");
            bump(2);
          }else{
            b.classList.add("bad");
            const good = $$(".option", opts)[qq.a];
            if(good) good.classList.add("good");
          }
        });
        opts.appendChild(b);
      });
      box.appendChild(opts);
      mount.appendChild(box);
    });
  };

  // ---------- Dialogue reorder ----------
  const renderDialog = () => {
    dialogReorder.innerHTML = "";
    dialogCurrent.forEach((line, i) => {
      const row = document.createElement("div");
      row.className = "reItem";
      row.innerHTML = `
        ${state.dialogHints>0 ? '<div class="hintTag">💡 ' + (dialogTags[i]||'Hint') + '</div>' : ''}<div class="reText">${line}</div>
        <div class="reBtns">
          <button class="smallBtn" type="button" aria-label="Move up">↑</button>
          <button class="smallBtn" type="button" aria-label="Move down">↓</button>
        </div>`;
      const [up, down] = $$(".smallBtn", row);
      up.disabled = (i===0);
      down.disabled = (i===dialogCurrent.length-1);
      up.addEventListener("click", () => {
        if(i<=0) return;
        [dialogCurrent[i-1], dialogCurrent[i]] = [dialogCurrent[i], dialogCurrent[i-1]];
        renderDialog();
      });
      down.addEventListener("click", () => {
        if(i>=dialogCurrent.length-1) return;
        [dialogCurrent[i+1], dialogCurrent[i]] = [dialogCurrent[i], dialogCurrent[i+1]];
        renderDialog();
      });
      dialogReorder.appendChild(row);
    });
  };


  const applyDialogMarking = () => {
    const rows = $$(".reItem", dialogReorder);
    rows.forEach((row, i) => {
      const ok = (dialogCurrent[i] === dialogCorrect[i]);
      row.classList.toggle("is-correct", ok);
      row.classList.toggle("is-wrong", !ok);
    });
  };

  const cycleDialogHint = () => {
    // 0: off, 1: label hints, 2: stronger hint text
    state.dialogHints = (state.dialogHints + 1) % 3;
    renderDialog();
    if(!dialogHint) return;
    if(state.dialogHints === 0){
      dialogHint.textContent = "";
    }else if(state.dialogHints === 1){
      dialogHint.textContent = "Hint: look at the 💡 labels on each line (Greeting → Needs → Venue → Mission → Next steps).";
    }else{
      dialogHint.textContent = "Stronger hint: 1 Greeting • 2 Needs • 3 Date/venue • 4 Venue • 5 Mission • 6 Next steps question • 7 Process answer.";
    }
  };

  const checkDialog = () => {
    const ok = dialogCurrent.every((l, i) => l === dialogCorrect[i]);
    checked();
    applyDialogMarking();
    if(ok){
      bump(6);
      dialogFeedback.textContent = "✅ Great! Now practise speaking.";
    }else{
      dialogFeedback.textContent = "Not yet. Tip: start with the Greeting, then the Client need, then Date+Venue, then Mission, then the Next steps question, then the Process answer.";
      if(dialogHint && state.dialogHints===0) dialogHint.textContent = "Click Hint 💡 if you want labels to guide the order.";
    }
  };

  const sayDialogue = () => {
    const text = dialogCurrent.join(" ");
    speak(text);
  };

  // ---------- Builder ----------
  const loadSaved = () => {
    try{
      const raw = localStorage.getItem("cs_journey_builder_v1");
      if(!raw) return;
      const d = JSON.parse(raw);
      bName.value = d.bName||"";
      bTitle.value = d.bTitle||"";
      bTeam.value = d.bTeam||"";
      bCity.value = d.bCity||"";
      bVenue.value = d.bVenue||"";
      bMission.value = d.bMission||"create";
      bGoal1.value = d.bGoal1||"";
      bGoal2.value = d.bGoal2||"";
      outText.value = d.outText||"";
      state.outLvl = d.outLvl||"A2";
      setChipOn(state.outLvl==="A2"?outA2:(state.outLvl==="B1"?outB1:outB2), [outA2,outB1,outB2]);
    }catch(e){}
  };

  const save = () => {
    try{
      const d = {
        bName: bName.value.trim(),
        bTitle: bTitle.value.trim(),
        bTeam: bTeam.value.trim(),
        bCity: bCity.value.trim(),
        bVenue: bVenue.value.trim(),
        bMission: bMission.value,
        bGoal1: bGoal1.value.trim(),
        bGoal2: bGoal2.value.trim(),
        outText: outText.value,
        outLvl: state.outLvl
      };
      localStorage.setItem("cs_journey_builder_v1", JSON.stringify(d));
      saveMsg.textContent = "Saved ✓";
      setTimeout(()=>saveMsg.textContent="", 1200);
      bump(1); checked();
    }catch(e){
      saveMsg.textContent = "Could not save";
    }
  };

  const buildPitch = () => {
    const name = bName.value.trim() || "I";
    const title = bTitle.value.trim() || "event coordinator";
    const team = bTeam.value.trim() || "our team";
    const city = bCity.value.trim() || "Strasbourg";
    const venue = bVenue.value.trim() || "the venue";
    const missionV = bMission.value || "create";
    const article = aAn(title);
    const g1 = bGoal1.value.trim() || "a calm day";
    const g2 = bGoal2.value.trim() || "a ceremony that tells your story";

    const A2 = `${name}, ${title}. I work in ${city}. We work at ${venue}. First, we talk about your ideas. Then we plan the day and the schedule. We coordinate suppliers. Finally, we are on site on the wedding day. Our mission is to ${missionV} ${g1} and ${g2}.`;

    const B1 = `Hi, I'm ${name}. I'm ${article} ${title} with ${team} in ${city}. We often work at venues like ${venue}. First, we learn your story and priorities. Then we define a theme and plan the schedule. After that, we coordinate suppliers and prepare the ceremony details. Finally, on the wedding day, we stay on site to manage timing. Our mission is to ${missionV} ${g1} and ${g2}, so you can enjoy every moment.`;

    const B2 = `Hello, my name is ${name}. I'm ${article} ${title} with ${team}, based in ${city}. We work on site at venues such as ${venue}. Our process starts with a discovery call to clarify your vision, constraints, and priorities. We then develop a creative direction (theme, moodboard, guest experience) and align logistics with the venue. Next, we coordinate suppliers and craft the ceremony details, including timing cues. On the wedding day, we supervise operations, handle unexpected issues, and protect the couple’s experience. Our mission is to ${missionV} ${g1} and ${g2} — with elegance, clarity, and calm coordination.`;

    let out = A2;
    if(state.outLvl === "B1") out = B1;
    if(state.outLvl === "B2") out = B2;

    outText.value = out;
    bump(2); checked();
  };

  const copyText = async () => {
    try{
      await navigator.clipboard.writeText(outText.value);
      saveMsg.textContent = "Copied ✓";
      setTimeout(()=>saveMsg.textContent="", 1200);
      bump(1);
    }catch(e){
      // fallback
      outText.select();
      document.execCommand("copy");
      saveMsg.textContent = "Copied ✓";
      setTimeout(()=>saveMsg.textContent="", 1200);
    }
  };

  // ---------- Events ----------
  toggleFR.addEventListener("click", () => {
    state.frHelp = !state.frHelp;
    applyFR();
  });

  accentUS.addEventListener("click", () => {
    state.accent = "US";
    setChipOn(accentUS, [accentUS, accentUK]);
  });
  accentUK.addEventListener("click", () => {
    state.accent = "UK";
    setChipOn(accentUK, [accentUS, accentUK]);
  });

  btnReset.addEventListener("click", resetAll);

  btnStart.addEventListener("click", () => {
    // jump to journey and select first step
    state.stepId = steps[0].id;
    renderStepList();
    renderStepPanel();
    location.hash = "#journey";
    speak("Let’s start with step one: discovery call.");
  });

  lvlA2.addEventListener("click", () => setLvl("A2"));
  lvlB1.addEventListener("click", () => setLvl("B1"));
  lvlB2.addEventListener("click", () => setLvl("B2"));

  btnSayStep.addEventListener("click", () => {
    const s = steps.find(x => x.id === state.stepId) || steps[0];
    speak(s.text[state.lvl]);
  });

  btnOrderUndo.addEventListener("click", () => {
    const id = state.orderBuild.pop();
    if(!id) return;
    const s = steps.find(x => x.id === id);
    if(s) orderPoolData.push({id:s.id, title:s.title});
    orderPoolData = shuffle(orderPoolData);
    renderOrder();
  });

  btnOrderReset.addEventListener("click", resetOrder);
  btnOrderCheck.addEventListener("click", checkOrder);

  btnDialogShuffle.addEventListener("click", () => {
    dialogCurrent = shuffle(dialogCorrect);
    dialogFeedback.textContent = "";
    renderDialog();
  });
  btnDialogCheck.addEventListener("click", checkDialog);
  btnDialogSay.addEventListener("click", sayDialogue);

  const setOutLvl = (lvl) => {
    state.outLvl = lvl;
    setChipOn(lvl==="A2"?outA2:(lvl==="B1"?outB1:outB2), [outA2,outB1,outB2]);
  };
  outA2.addEventListener("click", () => setOutLvl("A2"));
  outB1.addEventListener("click", () => setOutLvl("B1"));
  outB2.addEventListener("click", () => setOutLvl("B2"));

  btnBuild.addEventListener("click", buildPitch);
  btnCopy.addEventListener("click", copyText);
  btnSave.addEventListener("click", save);
  btnSpeak.addEventListener("click", () => speak(outText.value));

  btnCelebrate.addEventListener("click", () => {
    finalMsg.textContent = "✅ Done! Next: record yourself and try again faster with better connectors.";
    bump(3); checked();
    speak("Well done. You can now explain the process clearly.");
  });

  // ---------- Init ----------
  const init = () => {
    applyFR();
    setChipOn(accentUS, [accentUS, accentUK]);
    renderStepList();
    renderStepPanel();
    resetOrder();
    renderMatch(prepMatch, matchPairs);
    renderMCQ(prepMCQ, prepQuestions);
    renderDialog();
    renderMCQIndex(respMCQ, respQuestions);
    loadSaved();
  };

  init();
})();
