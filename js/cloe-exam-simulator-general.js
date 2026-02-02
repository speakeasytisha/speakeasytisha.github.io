/* SpeakEasyTisha — CLOE General Exam Simulator
   Instant feedback + hints, training/exam mode, touch-friendly reorder + matching,
   US/UK speech synthesis for listening, mini mock exam.
*/
(function(){
  "use strict";

  /* ---------------- Helpers ---------------- */
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
  const shuffle = (arr) => {
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const norm = (s) => String(s||"").trim().toLowerCase();
  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

  /* ---------------- Global state ---------------- */
  const state = {
    mode: "train",     // "train" | "exam"
    accent: "US",      // "US" | "UK"
    score: 0,
    mastered: new Set(),
    totalTasks: 0,
    listeningPlays: 0,
    voices: [],
    voiceUS: null,
    voiceUK: null,
    mock: null
  };

  function toast(msg){
    const t = $("#toast");
    if(!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._tm);
    toast._tm = setTimeout(()=>t.classList.remove("show"), 1600);
  }

  function setMode(mode){
    state.mode = mode;
    $("#modeTrain").classList.toggle("is-on", mode==="train");
    $("#modeExam").classList.toggle("is-on", mode==="exam");
    $("#modeHint").textContent =
      mode==="train"
        ? "Training shows hints + explanations. Exam hides hints (still shows right/wrong)."
        : "Exam mode: hints are hidden. Focus on speed + accuracy.";

    // Toggle hint visibility
    $$("[data-hint]").forEach(el=>{
      el.hidden = (state.mode==="exam");
    });
  }

  function setAccent(ac){
    state.accent = ac;
    $("#accentUS").classList.toggle("is-on", ac==="US");
    $("#accentUK").classList.toggle("is-on", ac==="UK");
    toast(`Accent set to ${ac}`);
  }

  function updateProgress(){
    const done = state.mastered.size;
    const total = state.totalTasks || 1;
    const pct = clamp(Math.round((done/total)*100),0,100);
    $("#progressBar").style.width = pct + "%";
    $("#scoreBox").textContent = `Score: ${state.score} • Mastered: ${done}`;
  }

  function markMastered(taskId, points){
    if(!state.mastered.has(taskId)){
      state.mastered.add(taskId);
      state.score += (points||1);
      updateProgress();
    }
  }

  function clearMastery(){
    state.score = 0;
    state.mastered = new Set();
    updateProgress();
  }

  /* ---------------- Voice (Web Speech API) ---------------- */
  function loadVoices(){
    try{
      state.voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
      // Heuristics for US/UK: pick English voices with en-US / en-GB
      state.voiceUS = state.voices.find(v => /en[-_]?US/i.test(v.lang)) || state.voices.find(v => /en/i.test(v.lang)) || null;
      state.voiceUK = state.voices.find(v => /en[-_]?GB/i.test(v.lang)) || state.voices.find(v => /en/i.test(v.lang)) || null;
    }catch(e){
      state.voices = [];
      state.voiceUS = null;
      state.voiceUK = null;
    }
  }

  async function speak(text){
    if(!window.speechSynthesis || !window.SpeechSynthesisUtterance){
      toast("Speech not supported on this device.");
      return;
    }
    // Some browsers need voices loaded after user gesture.
    loadVoices();

    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.97;
    u.pitch = 1.0;
    u.volume = 1.0;
    u.voice = (state.accent==="UK" ? state.voiceUK : state.voiceUS) || null;

    // Cancel queue to avoid overlap
    try{ speechSynthesis.cancel(); }catch(e){}

    return new Promise((resolve)=>{
      u.onend = resolve;
      u.onerror = resolve;
      speechSynthesis.speak(u);
    });
  }

  /* ---------------- Task data ---------------- */
  let UID = 0;
  const uid = (prefix="t") => `${prefix}-${++UID}`;

  // Task types:
  // mcq: options, answerIndex
  // gapSelect: prompt + options + answer
  // gapInput: prompt + answer + accept[] (optional)
  // reorder: tokens[] answerTokens[]
  // match: pairs [{left,right}] with tap-to-place
  const BANK = {
    warmup: [
      { type:"mcq", title:"Present simple", prompt:"She ____ to work every day.", options:["go","goes","going","gone"], answerIndex:1,
        hint:"Third person singular (he/she/it) usually takes -s / -es.", why:"Routine/habit → present simple. With 'she' → 'goes'." },
      { type:"gapSelect", title:"Preposition", prompt:"I’m good ____ math.", options:["in","at","on","to"], answer:"at",
        hint:"Use 'good at' for skills.", why:"Fixed expression: good at + noun/verb-ing." },
      { type:"mcq", title:"Polite request", prompt:"Choose the most polite option:", options:[
        "Give me the information.",
        "Can you give me the information, please?",
        "You must give me the information.",
        "I want the information."
      ], answerIndex:1, hint:"CLOE rewards polite, clear interaction.", why:"Polite modal + please is the best fit." },
      { type:"gapInput", title:"Time marker", prompt:"I haven’t seen him ____ Monday.", answer:"since",
        hint:"'Since' + starting point. 'For' + duration.", why:"Monday = starting point → since." },
      { type:"mcq", title:"Connector", prompt:"I was tired, ____ I finished my work.", options:["because","but","so","although"], answerIndex:2,
        hint:"Result (cause → effect) uses 'so'.", why:"Tired → result: finished work anyway? Actually here: tired, so I finished (simple cause→result)." },
      { type:"gapSelect", title:"Comparative", prompt:"This plan is ____ than the other one.", options:["cheap","cheaper","cheapest","more cheap"], answer:"cheaper",
        hint:"Short adjective → add -er.", why:"cheap → cheaper." }
    ],

    grammar: [
      { type:"mcq", title:"Present perfect", prompt:"I ____ this movie before.", options:["saw","have seen","see","am seeing"], answerIndex:1,
        hint:"Experience up to now → present perfect.", why:"'before' + life experience often uses present perfect." },
      { type:"mcq", title:"Past simple", prompt:"Yesterday, we ____ dinner at 7 pm.", options:["have","had","have had","are having"], answerIndex:1,
        hint:"Finished time marker (yesterday) → past simple.", why:"Specific finished past time → had." },
      { type:"gapSelect", title:"Future", prompt:"Don’t worry — I ____ you tomorrow.", options:["call","called","will call","have called"], answer:"will call",
        hint:"Promise/decision now → will.", why:"Spontaneous promise → will call." },
      { type:"mcq", title:"Modal obligation", prompt:"You ____ wear a seatbelt in the car.", options:["should","must","might","can"], answerIndex:1,
        hint:"Strong obligation / rule → must.", why:"Seatbelt is a rule → must." },
      { type:"mcq", title:"Modal advice", prompt:"You look tired. You ____ take a break.", options:["must","should","can’t","needn’t"], answerIndex:1,
        hint:"Advice → should.", why:"Recommendation → should." },
      { type:"gapSelect", title:"Question form", prompt:"____ you ever been to London?", options:["Do","Did","Have","Are"], answer:"Have",
        hint:"Present perfect question: Have/Has + past participle.", why:"Have you ever been… = experience." },
      { type:"mcq", title:"Articles", prompt:"I need ____ umbrella. It’s raining.", options:["a","an","the","—"], answerIndex:1,
        hint:"Umbrella begins with a vowel sound → an.", why:"an umbrella." },
      { type:"gapSelect", title:"Countable/uncountable", prompt:"How ____ money do you have?", options:["many","much","few","little"], answer:"much",
        hint:"Money is uncountable → much.", why:"How much money…?" },
      { type:"mcq", title:"Relative clause", prompt:"That’s the person ____ helped me.", options:["which","who","where","when"], answerIndex:1,
        hint:"People → who/that.", why:"Person = who helped me." },
      { type:"gapSelect", title:"Passive voice", prompt:"The window was ____ yesterday.", options:["break","broke","broken","breaking"], answer:"broken",
        hint:"Passive: was/were + past participle.", why:"was broken." },
      { type:"mcq", title:"Condition (1st)", prompt:"If it rains, we ____ inside.", options:["stay","stayed","will stay","have stayed"], answerIndex:2,
        hint:"If + present, then will + base verb.", why:"Real future possibility → will stay." },
      {
        type:"reorder",
        title:"Word order (question)",
        prompt:"Build the correct question:",
        tokens:["you","live","do","where","?"],
        answerTokens:["where","do","you","live","?"],
        hint:"Question word + do/does + subject + verb.",
        why:"Where do you live?"
      },
      {
        type:"reorder",
        title:"Word order (statement)",
        prompt:"Build the correct sentence:",
        tokens:["often","late","is","he"],
        answerTokens:["he","is","often","late"],
        hint:"Subject + verb + adverb (often) + complement.",
        why:"He is often late."
      },
      {
        type:"match",
        title:"Matching (connectors)",
        prompt:"Tap a connector, then tap the correct meaning.",
        pairs:[
          {left:"however", right:"contrast"},
          {left:"because", right:"reason"},
          {left:"therefore", right:"result"},
          {left:"although", right:"unexpected contrast"}
        ],
        hint:"Look for: reason / result / contrast.",
        why:"These are common CLOE connector types."
      }
    ],

    vocab: [
      { type:"mcq", title:"Everyday phrasal verb", prompt:"I need to ____ this form before I send it.", options:["fill out","turn on","give up","look after"], answerIndex:0,
        hint:"Forms → fill out.", why:"fill out a form." },
      { type:"gapSelect", title:"Useful adjective", prompt:"The instructions were very ____. I understood immediately.", options:["clear","confusing","late","weak"], answer:"clear",
        hint:"Positive meaning: easy to understand.", why:"Clear = easy to understand." },
      { type:"mcq", title:"Polite phrase", prompt:"Choose the best sentence:", options:[
        "I want to know where my package is.",
        "Could you please tell me where my package is?",
        "Tell me where my package is now.",
        "You must tell me."
      ], answerIndex:1,
        hint:"Could you please… is a strong polite request.",
        why:"Professional + polite → best choice." },
      { type:"gapInput", title:"Common expression", prompt:"I’m running ____ time. (I’m late.)", answer:"out of",
        hint:"Expression: run out of + noun.",
        why:"run out of time." },
      { type:"mcq", title:"Collocation", prompt:"We need to make a ____.", options:["decision","decide","deciding","decisive"], answerIndex:0,
        hint:"Make + noun: make a decision.",
        why:"Collocation: make a decision." },
      { type:"gapSelect", title:"Preposition", prompt:"I’m interested ____ learning Spanish.", options:["on","in","at","for"], answer:"in",
        hint:"Interested in + noun/verb-ing.",
        why:"Interested in learning…" },
      {
        type:"match",
        title:"Matching (daily life)",
        prompt:"Tap a word, then tap the correct definition.",
        pairs:[
          {left:"appointment", right:"a meeting time you book"},
          {left:"receipt", right:"proof of payment"},
          {left:"refund", right:"money returned to you"},
          {left:"queue", right:"a line of people"}
        ],
        hint:"Think: shopping / services / admin.",
        why:"These words show up often in general CLOE tasks."
      },
      {
        type:"reorder",
        title:"Natural email order",
        prompt:"Put the email parts in a natural order:",
        tokens:["Best regards,","Thank you for your help.","Could we reschedule to Friday?","Hi Alex,"],
        answerTokens:["Hi Alex,","Could we reschedule to Friday?","Thank you for your help.","Best regards,"],
        hint:"Greeting → request → thanks → closing.",
        why:"This is a standard polite email flow."
      }
    ],

    reading: {
      text:
`Subject: Change of plan for tomorrow

Hi,

Thanks for your message. Unfortunately, the appointment time has changed. The technician can’t come at 10:00 because of traffic delays. The new time is 14:30.

If you are not available, please reply before 12:00 and suggest two other times this week. We can also do the appointment by video call if you prefer.

Sorry for the inconvenience,
Customer Support`,
      questions: [
        { type:"mcq", title:"Main point", prompt:"Why is the appointment changing?", options:[
          "The customer cancelled it.",
          "The technician is delayed by traffic.",
          "The office is closed.",
          "The price changed."
        ], answerIndex:1, hint:"Look for the reason sentence.", why:"It says: traffic delays." },
        { type:"mcq", title:"Detail", prompt:"What is the new time?", options:["10:00","12:00","14:30","16:00"], answerIndex:2,
          hint:"New time is stated clearly.", why:"New time: 14:30." },
        { type:"mcq", title:"Action", prompt:"What should you do if you’re not available?", options:[
          "Call after 14:30.",
          "Reply before 12:00 and suggest two other times.",
          "Wait until next month.",
          "Go to the office."
        ], answerIndex:1, hint:"Find the instruction line.", why:"Reply before 12:00 + propose two times." },
        { type:"mcq", title:"Option", prompt:"What alternative does the company propose?", options:[
          "A discount coupon",
          "A video call appointment",
          "A free product",
          "A refund"
        ], answerIndex:1, hint:"Read the last part of the email.", why:"They offer video call." }
      ]
    },

    listening: {
      script:
`Hello, this is a quick update about your delivery. The driver will arrive between 6 and 7 p.m. today, not at 5. If you won’t be home, please leave a note at the entrance or call us before 4 p.m. Thanks.`,
      questions: [
        { type:"mcq", title:"Time window", prompt:"When will the driver arrive?", options:[
          "Between 5 and 6 p.m.",
          "Between 6 and 7 p.m.",
          "Before 4 p.m.",
          "Tomorrow morning"
        ], answerIndex:1, hint:"Listen for the time window.", why:"Between 6 and 7 p.m." },
        { type:"mcq", title:"Change", prompt:"What is NOT happening?", options:[
          "The delivery time changed.",
          "The delivery is later than expected.",
          "The delivery is cancelled.",
          "You can call before 4 p.m."
        ], answerIndex:2, hint:"Cancelled is never mentioned.", why:"It’s delayed, not cancelled." },
        { type:"mcq", title:"Instruction", prompt:"If you won’t be home, what should you do?", options:[
          "Do nothing.",
          "Leave a note or call before 4 p.m.",
          "Wait outside.",
          "Reschedule next week."
        ], answerIndex:1, hint:"Two options are given.", why:"Leave a note or call before 4." },
        { type:"gapSelect", title:"Listening grammar", prompt:"The driver will arrive ____ 6 and 7 p.m.", options:["from","between","since","during"], answer:"between",
          hint:"Use 'between' for two endpoints.", why:"between 6 and 7." }
      ]
    },

    speaking: [
      {
        title:"Step 1 — About you (60s)",
        prompt:"Introduce yourself briefly. Include: where you live, what you do, and one reason you’re learning English.",
        timer:60,
        model:
`Structure:
1) I live in…
2) I work/study…
3) I’m learning English because…
+ 1 detail (goal / travel / work / confidence).`
      },
      {
        title:"Step 2 — Role-play (90s)",
        prompt:"You bought something online, but the package is late. Call customer support politely: explain the problem, ask for an update, and confirm the next step.",
        timer:90,
        model:
`Context → issue → request → confirmation:
- I ordered… / It was due on…
- It hasn’t arrived yet.
- Could you please check the status?
- When should I expect it?
- Just to confirm, the next step is…`
      },
      {
        title:"Step 3 — Discussion (90s)",
        prompt:"Which is better: working from home or working in an office? Give 2 advantages and 1 disadvantage, and use connectors (however, because, therefore…).",
        timer:90,
        model:
`Opinion + reasons + contrast:
- In my opinion…
- First, … because…
- Also, …
- However, …
- Therefore, …`
      }
    ],

    writing: [
      {
        title:"Email (short, polite)",
        prompt:"Write a short email (4–6 lines): reschedule an appointment from Tuesday to Friday. Be polite and suggest a new time.",
        checklist:["greeting","polite request (could/would)","new day/time","thanks","closing"]
      },
      {
        title:"Opinion paragraph (6–8 lines)",
        prompt:"Write about your favorite way to relax. Use at least 2 connectors (because, however, therefore, although, so…).",
        checklist:["topic sentence","2 connectors","1 example","correct tense consistency","closing sentence"]
      }
    ]
  };

  /* ---------------- Rendering ---------------- */
  function taskShell({id, title, prompt, tag}){
    return `
      <article class="card task" data-taskid="${esc(id)}">
        <div class="task__head">
          <div>
            <div class="task__title">${esc(title || "Task")}</div>
            <div class="muted small">${esc(prompt || "")}</div>
          </div>
          <div class="task__meta">${esc(tag||"")}</div>
        </div>
        <div class="task__body"></div>
        <div class="feedback" hidden></div>
      </article>
    `;
  }

  function setFeedback(taskEl, ok, msg, hint, why){
    const fb = $(".feedback", taskEl);
    fb.hidden = false;
    fb.classList.toggle("good", !!ok);
    fb.classList.toggle("bad", !ok);

    const showHint = (state.mode==="train");
    let html = `<div><b>${ok ? "✅ Correct" : "❌ Not quite"}</b> — ${esc(msg||"")}</div>`;
    if(!ok && showHint && hint){
      html += `<div class="why" data-hint><b>Hint:</b> ${esc(hint)}</div>`;
    }
    if(ok && showHint && why){
      html += `<div class="why" data-hint><b>Why:</b> ${esc(why)}</div>`;
    }
    fb.innerHTML = html;
  }

  function lockTask(taskEl){
    taskEl.dataset.locked = "1";
    $$("button,input,select,textarea", taskEl).forEach(el=>{
      if(el.classList.contains("slot__btn")) return;
      el.disabled = true;
    });
    $$("[data-chip]", taskEl).forEach(ch=>ch.classList.add("good"));
  }

  function renderMCQ(item){
    const id = item._id;
    const opts = item.options.map((o,i)=>`
      <button class="opt" type="button" data-opt="${i}">${esc(o)}</button>
    `).join("");
    return `
      <div class="options">${opts}</div>
      <div class="row row--wrap" style="margin-top:10px;">
        <button class="btn btn--ghost" type="button" data-listen="${esc(item.prompt)}">🔊 Read question</button>
        <span class="badge">Instant feedback</span>
      </div>
    `;
  }

  function bindMCQ(taskEl, item){
    $$(".opt", taskEl).forEach(btn=>{
      btn.addEventListener("click", async ()=>{
        if(taskEl.dataset.locked==="1") return;
        $$(".opt", taskEl).forEach(b=>b.classList.remove("is-on"));
        btn.classList.add("is-on");
        const pick = Number(btn.dataset.opt);
        const ok = pick === item.answerIndex;
        setFeedback(taskEl, ok, ok ? "Good choice." : "Try again.", item.hint, item.why);
        if(ok){
          markMastered(item._id, 1);
          lockTask(taskEl);
        }
      });
    });

    const listenBtn = $("[data-listen]", taskEl);
    if(listenBtn){
      listenBtn.addEventListener("click", ()=> speak(item.prompt));
    }
  }

  function renderGapSelect(item){
    const id = item._id;
    const opts = shuffle(item.options).map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join("");
    return `
      <label class="field">
        <span>Choose the best word</span>
        <select class="select" data-select>
          <option value="" selected>— choose —</option>
          ${opts}
        </select>
      </label>
    `;
  }

  function bindGapSelect(taskEl, item){
    const sel = $("[data-select]", taskEl);
    sel.addEventListener("change", ()=>{
      if(taskEl.dataset.locked==="1") return;
      const pick = sel.value;
      const ok = norm(pick) === norm(item.answer);
      setFeedback(taskEl, ok, ok ? "Correct." : "Not correct.", item.hint, item.why);
      if(ok){
        markMastered(item._id, 1);
        lockTask(taskEl);
      }
    });
  }

  function renderGapInput(item){
    return `
      <label class="field">
        <span>Type your answer</span>
        <input class="input" data-input placeholder="Type here…" />
      </label>
      <div class="row row--wrap" style="margin-top:10px;">
        <button class="btn btn--primary" type="button" data-check>Check</button>
        <button class="btn" type="button" data-clear>Clear</button>
      </div>
    `;
  }

  function bindGapInput(taskEl, item){
    const input = $("[data-input]", taskEl);
    const check = $("[data-check]", taskEl);
    const clear = $("[data-clear]", taskEl);

    const accepted = new Set([norm(item.answer)].concat((item.accept||[]).map(norm)));

    check.addEventListener("click", ()=>{
      if(taskEl.dataset.locked==="1") return;
      const pick = norm(input.value);
      const ok = accepted.has(pick);
      setFeedback(taskEl, ok, ok ? "Correct." : "Not correct.", item.hint, item.why);
      if(ok){
        markMastered(item._id, 1);
        lockTask(taskEl);
      }
    });

    clear.addEventListener("click", ()=>{
      input.value = "";
      $(".feedback", taskEl).hidden = true;
    });
  }

  function renderReorder(item){
    const tokens = shuffle(item.tokens);
    const bank = tokens.map(t=>`<span class="chip" data-chip data-val="${esc(t)}">${esc(t)}</span>`).join("");
    return `
      <div class="muted small">Touch-friendly: tap chips to move. Tap a chip in the answer row to select it, then tap another to swap.</div>
      <div class="row row--wrap" style="margin-top:10px;">
        <div style="flex:1;">
          <div class="kicker">Bank (shuffled)</div>
          <div class="chips" data-bank>${bank}</div>
        </div>
        <div style="flex:1;">
          <div class="kicker">Your sentence</div>
          <div class="chips" data-answer aria-label="Answer area"></div>
        </div>
      </div>
      <div class="row row--wrap" style="margin-top:10px;">
        <button class="btn" type="button" data-reset>Reset</button>
      </div>
    `;
  }

  function bindReorder(taskEl, item){
    const bank = $("[data-bank]", taskEl);
    const ans = $("[data-answer]", taskEl);
    const reset = $("[data-reset]", taskEl);

    let selected = null; // selected chip in answer for swap

    function chips(el){ return $$("[data-chip]", el); }
    function clearSel(){
      selected = null;
      chips(ans).forEach(c=>c.classList.remove("is-picked"));
    }

    function validateIfComplete(){
      const vals = chips(ans).map(c=>c.dataset.val);
      if(vals.length !== item.answerTokens.length) return;
      const ok = vals.join(" ") === item.answerTokens.join(" ");
      setFeedback(taskEl, ok, ok ? "Perfect word order." : "Not quite — check the structure.", item.hint, item.why);
      if(ok){
        chips(ans).forEach(c=>c.classList.add("good"));
        markMastered(item._id, 2);
        lockTask(taskEl);
      }else{
        // highlight first mismatch
        for(let i=0;i<vals.length;i++){
          if(vals[i] !== item.answerTokens[i]){
            chips(ans)[i].classList.add("bad");
            break;
          }
        }
      }
    }

    bank.addEventListener("click", (e)=>{
      const chip = e.target.closest("[data-chip]");
      if(!chip || taskEl.dataset.locked==="1") return;
      chip.classList.remove("bad");
      ans.appendChild(chip);
      clearSel();
      validateIfComplete();
    });

    ans.addEventListener("click", (e)=>{
      const chip = e.target.closest("[data-chip]");
      if(!chip || taskEl.dataset.locked==="1") return;

      // If incomplete, allow removing back to bank by tapping
      if(chips(ans).length < item.answerTokens.length){
        bank.appendChild(chip);
        clearSel();
        $(".feedback", taskEl).hidden = true;
        return;
      }

      // Swap logic when full
      if(!selected){
        selected = chip;
        chip.classList.add("is-picked");
      }else if(selected === chip){
        clearSel();
      }else{
        const a = selected;
        const b = chip;
        const aNext = a.nextSibling;
        const bNext = b.nextSibling;

        const aParent = a.parentNode;
        const bParent = b.parentNode;

        // both in same parent (answer)
        if(aNext === b){
          aParent.insertBefore(b, a);
        }else if(bNext === a){
          aParent.insertBefore(a, b);
        }else{
          aParent.insertBefore(b, aNext);
          bParent.insertBefore(a, bNext);
        }
        clearSel();
        chips(ans).forEach(c=>c.classList.remove("bad"));
        validateIfComplete();
      }
    });

    reset.addEventListener("click", ()=>{
      if(taskEl.dataset.locked==="1") return;
      chips(ans).forEach(c=>bank.appendChild(c));
      chips(bank).forEach(c=>c.classList.remove("bad","good","is-picked"));
      $(".feedback", taskEl).hidden = true;
      clearSel();
    });
  }

  function renderMatch(item){
    // Tap a chip then tap target slot to place.
    const lefts = shuffle(item.pairs.map(p=>p.left));
    const rights = item.pairs.map(p=>p.right); // keep stable targets
    const chipsHtml = lefts.map(t=>`<span class="chip" data-chip data-val="${esc(t)}">${esc(t)}</span>`).join("");

    const targetsHtml = rights.map(r=>`
      <div class="target" data-target="${esc(r)}">
        <div class="muted"><b>${esc(r)}</b></div>
        <div class="slot" data-slot>
          <span class="slot__txt muted">tap a word → tap here</span>
          <button class="slot__btn" type="button" data-clear>×</button>
        </div>
      </div>
    `).join("");

    return `
      <div class="kicker">Words</div>
      <div class="chips" data-bank>${chipsHtml}</div>
      <div style="height:10px"></div>
      <div class="kicker">Targets</div>
      <div class="targets" data-targets>${targetsHtml}</div>
      <div class="row row--wrap" style="margin-top:10px;">
        <button class="btn" type="button" data-reset>Reset</button>
      </div>
    `;
  }

  function bindMatch(taskEl, item){
    const bank = $("[data-bank]", taskEl);
    const targets = $("[data-targets]", taskEl);
    const reset = $("[data-reset]", taskEl);

    const correctMap = new Map(item.pairs.map(p=>[p.right, p.left]));
    let picked = null;

    function clearPicked(){
      picked = null;
      $$("[data-chip]", bank).forEach(c=>c.classList.remove("is-picked"));
    }

    bank.addEventListener("click", (e)=>{
      const chip = e.target.closest("[data-chip]");
      if(!chip || taskEl.dataset.locked==="1") return;
      clearPicked();
      picked = chip;
      chip.classList.add("is-picked");
    });

    targets.addEventListener("click", (e)=>{
      const clearBtn = e.target.closest("[data-clear]");
      if(clearBtn){
        const slot = clearBtn.closest("[data-slot]");
        const t = clearBtn.closest("[data-target]");
        if(!slot || !t || taskEl.dataset.locked==="1") return;

        const existing = slot.dataset.val;
        if(existing){
          // return chip to bank
          const chip = document.createElement("span");
          chip.className = "chip";
          chip.dataset.chip = "";
          chip.dataset.val = existing;
          chip.textContent = existing;
          bank.appendChild(chip);
        }
        slot.dataset.val = "";
        slot.querySelector(".slot__txt").textContent = "tap a word → tap here";
        slot.querySelector(".slot__txt").classList.add("muted");
        $(".feedback", taskEl).hidden = true;
        clearPicked();
        return;
      }

      const target = e.target.closest("[data-target]");
      if(!target || !picked || taskEl.dataset.locked==="1") return;

      const slot = $("[data-slot]", target);
      const val = picked.dataset.val;

      // If slot already filled, return previous to bank
      const existing = slot.dataset.val;
      if(existing){
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.dataset.chip = "";
        chip.dataset.val = existing;
        chip.textContent = existing;
        bank.appendChild(chip);
      }

      slot.dataset.val = val;
      slot.querySelector(".slot__txt").textContent = val;
      slot.querySelector(".slot__txt").classList.remove("muted");
      picked.remove();
      clearPicked();

      // Validate if all slots filled
      const slots = $$("[data-slot]", targets);
      const done = slots.every(s=>!!s.dataset.val);
      if(!done) return;

      let ok = true;
      slots.forEach(s=>{
        const t = s.closest("[data-target]").dataset.target;
        const expected = correctMap.get(t);
        if(s.dataset.val !== expected) ok = false;
      });

      setFeedback(taskEl, ok, ok ? "All matches correct." : "Some matches are wrong.", item.hint, item.why);
      if(ok){
        markMastered(item._id, 2);
        lockTask(taskEl);
      }
    });

    reset.addEventListener("click", ()=>{
      if(taskEl.dataset.locked==="1") return;
      // clear all slots and rebuild bank
      bank.innerHTML = "";
      shuffle(item.pairs.map(p=>p.left)).forEach(t=>{
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.dataset.chip = "";
        chip.dataset.val = t;
        chip.textContent = t;
        bank.appendChild(chip);
      });
      $$("[data-slot]", targets).forEach(s=>{
        s.dataset.val = "";
        s.querySelector(".slot__txt").textContent = "tap a word → tap here";
        s.querySelector(".slot__txt").classList.add("muted");
      });
      $(".feedback", taskEl).hidden = true;
      clearPicked();
    });
  }

  function renderTask(item, tag){
    const id = item._id;
    const shell = taskShell({id, title:item.title, prompt:item.prompt, tag});
    const wrap = document.createElement("div");
    wrap.innerHTML = shell.trim();
    const taskEl = wrap.firstElementChild;
    const body = $(".task__body", taskEl);

    if(item.type==="mcq") body.innerHTML = renderMCQ(item);
    else if(item.type==="gapSelect") body.innerHTML = renderGapSelect(item);
    else if(item.type==="gapInput") body.innerHTML = renderGapInput(item);
    else if(item.type==="reorder") body.innerHTML = renderReorder(item);
    else if(item.type==="match") body.innerHTML = renderMatch(item);
    else body.innerHTML = `<div class="muted">Unknown task type.</div>`;

    return taskEl;
  }

  function bindTask(taskEl, item){
    if(item.type==="mcq") bindMCQ(taskEl, item);
    else if(item.type==="gapSelect") bindGapSelect(taskEl, item);
    else if(item.type==="gapInput") bindGapInput(taskEl, item);
    else if(item.type==="reorder") bindReorder(taskEl, item);
    else if(item.type==="match") bindMatch(taskEl, item);
  }

  function mountSection(containerSel, items, tag){
    const host = $(containerSel);
    host.innerHTML = "";
    items.forEach(item=>{
      item._id = item._id || uid("task");
      const el = renderTask(item, tag);
      host.appendChild(el);
      bindTask(el, item);
    });
  }

  /* ---------------- Speaking ---------------- */
  function renderSpeakingCard(item){
    const id = uid("spk");
    return `
      <article class="card task" data-taskid="${esc(id)}">
        <div class="task__head">
          <div>
            <div class="task__title">${esc(item.title)}</div>
            <div class="muted small">${esc(item.prompt)}</div>
          </div>
          <div class="badge">Timer: ${item.timer}s</div>
        </div>

        <div class="row row--wrap">
          <button class="btn btn--primary" type="button" data-start>Start</button>
          <button class="btn" type="button" data-stop disabled>Stop</button>
          <div class="timer" data-timer>00:00</div>
          <button class="btn btn--ghost" type="button" data-model>Show model outline</button>
        </div>

        <div class="result" data-modelbox hidden></div>

        <hr class="sep"/>

        <div class="kicker">Phrase bank (use in CLOE)</div>
        <div class="chips">
          <span class="chip">Just to clarify…</span>
          <span class="chip">Could you please…?</span>
          <span class="chip">In my opinion…</span>
          <span class="chip">However,…</span>
          <span class="chip">Therefore,…</span>
          <span class="chip">Let me summarise…</span>
          <span class="chip">The next step is…</span>
        </div>
      </article>
    `;
  }

  function bindSpeakingCard(card, item){
    const start = $("[data-start]", card);
    const stop = $("[data-stop]", card);
    const timerEl = $("[data-timer]", card);
    const modelBtn = $("[data-model]", card);
    const modelBox = $("[data-modelbox]", card);

    let t = item.timer;
    let running = false;
    let intv = null;

    function fmt(sec){
      const m = Math.floor(sec/60);
      const s = sec%60;
      return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
    }
    function update(){ timerEl.textContent = fmt(t); }

    update();

    start.addEventListener("click", ()=>{
      if(running) return;
      running = true;
      start.disabled = true;
      stop.disabled = false;
      t = item.timer;
      update();
      intv = setInterval(()=>{
        t--;
        update();
        if(t<=0){
          clearInterval(intv);
          running = false;
          start.disabled = false;
          stop.disabled = true;
          toast("Time! Try to finish with a clear closing sentence.");
        }
      },1000);
    });

    stop.addEventListener("click", ()=>{
      if(!running) return;
      clearInterval(intv);
      running = false;
      start.disabled = false;
      stop.disabled = true;
      toast("Stopped. Repeat once more with better connectors.");
    });

    modelBtn.addEventListener("click", ()=>{
      modelBox.hidden = !modelBox.hidden;
      modelBox.innerHTML = `<b>Model outline (not a script):</b><br/>${esc(item.model).replace(/\n/g,"<br/>")}`;
    });
  }

  function mountSpeaking(){
    const host = $("#speakingGrid");
    host.innerHTML = "";
    BANK.speaking.forEach(item=>{
      const wrap = document.createElement("div");
      wrap.innerHTML = renderSpeakingCard(item).trim();
      const card = wrap.firstElementChild;
      host.appendChild(card);
      bindSpeakingCard(card, item);
    });
  }

  /* ---------------- Writing ---------------- */
  function renderWritingCard(item){
    const id = uid("wrt");
    return `
      <article class="card task" data-taskid="${esc(id)}">
        <div class="task__head">
          <div>
            <div class="task__title">${esc(item.title)}</div>
            <div class="muted small">${esc(item.prompt)}</div>
          </div>
          <div class="badge">Checklist</div>
        </div>

        <textarea rows="8" class="input" data-area placeholder="Write here…"></textarea>

        <div class="row row--wrap" style="margin-top:10px;">
          <button class="btn btn--primary" type="button" data-check>Check</button>
          <button class="btn" type="button" data-clear>Clear</button>
        </div>

        <div class="result" data-report hidden></div>
      </article>
    `;
  }

  function bindWritingCard(card, item){
    const area = $("[data-area]", card);
    const check = $("[data-check]", card);
    const clear = $("[data-clear]", card);
    const report = $("[data-report]", card);

    const connectors = ["because","however","therefore","although","so","but","for example","in addition"];
    const polite = ["could you","would it be possible","please","thank you","thanks","best regards","kind regards"];

    function analyse(txt){
      const t = norm(txt);
      const hits = {
        connectors: connectors.filter(w => t.includes(w)),
        polite: polite.filter(w => t.includes(w))
      };
      return hits;
    }

    check.addEventListener("click", ()=>{
      const txt = area.value.trim();
      if(!txt){
        report.hidden = false;
        report.innerHTML = `<b>Write a draft first.</b> Then re-check.`;
        return;
      }
      const hits = analyse(txt);
      const lines = txt.split(/\n/).filter(Boolean).length;

      let html = `<b>Checklist report</b><br/>`;
      html += `• Lines: <b>${lines}</b><br/>`;
      html += `• Connectors found: <b>${hits.connectors.length}</b> (${hits.connectors.map(esc).join(", ") || "none"})<br/>`;
      html += `• Polite phrases found: <b>${hits.polite.length}</b> (${hits.polite.map(esc).join(", ") || "none"})<br/><br/>`;

      html += `<b>Your task checklist</b><br/>`;
      item.checklist.forEach(c=>{
        html += `• ${esc(c)}<br/>`;
      });

      html += `<br/><b>Upgrade tip</b><br/>Add one clarification sentence: “Just to confirm…” or “Could you please confirm…?”`;

      report.hidden = false;
      report.innerHTML = html;

      // Writing tasks grant mastery when they actually try
      const id = card.dataset.taskid;
      markMastered(id, 2);
    });

    clear.addEventListener("click", ()=>{
      area.value = "";
      report.hidden = true;
    });
  }

  function mountWriting(){
    const host = $("#writingGrid");
    host.innerHTML = "";
    BANK.writing.forEach(item=>{
      const wrap = document.createElement("div");
      wrap.innerHTML = renderWritingCard(item).trim();
      const card = wrap.firstElementChild;
      host.appendChild(card);
      bindWritingCard(card, item);
    });
  }

  /* ---------------- Listening section ---------------- */
  function mountListening(){
    const host = $("#listeningGrid");
    host.innerHTML = "";
    BANK.listening.questions.forEach(q=>{
      q._id = q._id || uid("lis");
      const el = renderTask(q, "Listening");
      host.appendChild(el);
      bindTask(el, q);
    });

    state.listeningPlays = 0;
    $("#listenCount").textContent = `Plays: ${state.listeningPlays}`;
    $("#listeningTip").textContent = (state.mode==="exam")
      ? "Exam mode: you have 2 plays. Use them carefully."
      : "Training mode: unlimited plays. Focus on key words (times, actions, instructions).";
  }

  async function handleListen(){
    const maxPlays = (state.mode==="exam") ? 2 : 999;
    if(state.listeningPlays >= maxPlays){
      toast("No more plays in Exam mode.");
      return;
    }
    state.listeningPlays++;
    $("#listenCount").textContent = `Plays: ${state.listeningPlays}`;
    await speak(BANK.listening.script);
  }

  /* ---------------- Reading section ---------------- */
  function mountReading(){
    $("#readingText").innerHTML = esc(BANK.reading.text).replace(/\n/g,"<br/>");
    const host = $("#readingGrid");
    host.innerHTML = "";
    BANK.reading.questions.forEach(q=>{
      q._id = q._id || uid("rd");
      const el = renderTask(q, "Reading");
      host.appendChild(el);
      bindTask(el, q);
    });
  }

  /* ---------------- Mini mock engine ---------------- */
  function buildMockPool(){
    // Pool from warmup + grammar + vocab + reading/listening style (no full blocks)
    const pool = [];
    BANK.warmup.forEach(x=>pool.push(Object.assign({}, x)));
    BANK.grammar.forEach(x=>pool.push(Object.assign({}, x)));
    BANK.vocab.forEach(x=>pool.push(Object.assign({}, x)));

    // Add a couple “reading style” and “listening style” items as standalone MCQ
    BANK.reading.questions.slice(0,2).forEach(x=>pool.push(Object.assign({}, x)));
    BANK.listening.questions.slice(0,2).forEach(x=>pool.push(Object.assign({}, x)));

    // Make sure IDs are unique inside mock
    pool.forEach(p=>{ p._mockId = uid("mk"); });
    return pool;
  }

  function renderMockQuestion(q){
    // Render into mock stage with same task renderer but without card wrapper
    const tmp = document.createElement("div");
    tmp.innerHTML = taskShell({id:q._mockId, title:q.title, prompt:q.prompt, tag:"Mock"}).trim();
    const el = tmp.firstElementChild;
    const body = $(".task__body", el);

    if(q.type==="mcq") body.innerHTML = renderMCQ(q);
    else if(q.type==="gapSelect") body.innerHTML = renderGapSelect(q);
    else if(q.type==="gapInput") body.innerHTML = renderGapInput(q);
    else if(q.type==="reorder") body.innerHTML = renderReorder(q);
    else if(q.type==="match") body.innerHTML = renderMatch(q);
    else body.innerHTML = `<div class="muted">Unsupported task in mock.</div>`;

    // Hide hint blocks in exam mode already handled by setMode. Here we bind and control next.
    bindTask(el, q);
    return el;
  }

  function startMock(){
    const count = Number($("#mockCount").value);
    const speed = $("#mockSpeed").value;
    const secsPerQ = (speed==="fast") ? 22 : 30;

    const pool = shuffle(buildMockPool()).slice(0, count);
    state.mock = {
      pool,
      idx: 0,
      score: 0,
      done: false,
      secsPerQ,
      remaining: secsPerQ,
      timer: null
    };

    $("#mockResult").hidden = true;
    $("#mockSkip").disabled = false;
    $("#mockNext").disabled = true;

    mountMockQuestion();
    startMockTimer();
  }

  function startMockTimer(){
    stopMockTimer();
    const m = state.mock;
    if(!m) return;
    m.remaining = m.secsPerQ;
    $("#mockTimer").textContent = fmtTime(m.remaining);

    m.timer = setInterval(()=>{
      m.remaining--;
      $("#mockTimer").textContent = fmtTime(m.remaining);
      if(m.remaining <= 0){
        toast("Time! Skipped.");
        mockSkip();
      }
    }, 1000);
  }

  function stopMockTimer(){
    const m = state.mock;
    if(m && m.timer){
      clearInterval(m.timer);
      m.timer = null;
    }
  }

  function fmtTime(sec){
    sec = Math.max(0, sec);
    const m = Math.floor(sec/60);
    const s = sec%60;
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  }

  function mountMockQuestion(){
    const m = state.mock;
    if(!m) return;

    const q = m.pool[m.idx];
    $("#mockMeta").textContent = `Question ${m.idx+1}/${m.pool.length} • Score ${m.score}`;
    const stage = $("#mockStage");
    stage.innerHTML = "";
    const el = renderMockQuestion(q);
    stage.appendChild(el);

    // In mock, enable Next only when correct OR user chooses to proceed.
    // We'll watch for lock state changes.
    const obs = new MutationObserver(()=>{
      const locked = el.dataset.locked==="1";
      $("#mockNext").disabled = !locked;
      if(locked){
        // reward mock score once when it locks
        if(!q._scored){
          q._scored = true;
          m.score += 1;
          $("#mockMeta").textContent = `Question ${m.idx+1}/${m.pool.length} • Score ${m.score}`;
        }
      }
    });
    obs.observe(el, {attributes:true, attributeFilter:["data-locked"]});
  }

  function mockNext(){
    const m = state.mock;
    if(!m) return;
    if(m.idx < m.pool.length-1){
      m.idx++;
      $("#mockNext").disabled = true;
      mountMockQuestion();
      startMockTimer();
    }else{
      finishMock();
    }
  }

  function mockSkip(){
    const m = state.mock;
    if(!m) return;
    if(m.idx < m.pool.length-1){
      m.idx++;
      $("#mockNext").disabled = true;
      mountMockQuestion();
      startMockTimer();
    }else{
      finishMock();
    }
  }

  function finishMock(){
    stopMockTimer();
    const m = state.mock;
    if(!m) return;

    $("#mockSkip").disabled = true;
    $("#mockNext").disabled = true;

    const pct = Math.round((m.score / m.pool.length) * 100);
    const result = $("#mockResult");
    result.hidden = false;
    result.innerHTML = `
      <b>✅ Simulation complete</b><br/>
      • Score: <b>${m.score}/${m.pool.length}</b> (${pct}%)<br/><br/>
      <b>Next priorities</b><br/>
      • Review wrong items: focus on <i>word order</i>, <i>connectors</i>, and <i>tenses</i>.<br/>
      • Repeat the mock in “Fast” mode to build reflexes.
    `;

    toast("Mock complete — great. Repeat once in Exam mode.");
  }

  function resetMock(){
    stopMockTimer();
    state.mock = null;
    $("#mockMeta").textContent = "Question 0/0 • Score 0";
    $("#mockTimer").textContent = "00:00";
    $("#mockStage").innerHTML = `<div class="muted">Tap “Start simulation” to begin.</div>`;
    $("#mockResult").hidden = true;
    $("#mockSkip").disabled = true;
    $("#mockNext").disabled = true;
  }

  /* ---------------- Init ---------------- */
  function initIds(){
    // Ensure every task has a stable id for mastery
    const addIds = (arr, prefix) => arr.forEach(x => { x._id = x._id || uid(prefix); });
    addIds(BANK.warmup, "w");
    addIds(BANK.grammar, "g");
    addIds(BANK.vocab, "v");
    BANK.reading.questions.forEach(x=>{ x._id = x._id || uid("r"); });
    BANK.listening.questions.forEach(x=>{ x._id = x._id || uid("l"); });
  }

  function mountAll(){
    initIds();

    mountSection("#warmupGrid", BANK.warmup, "Warm-up");
    mountSection("#grammarGrid", BANK.grammar, "Grammar");
    mountSection("#vocabGrid", BANK.vocab, "Vocab");
    mountReading();
    mountListening();
    mountSpeaking();
    mountWriting();

    // Total tasks for progress bar (exclude mock duplicates)
    const total =
      BANK.warmup.length +
      BANK.grammar.length +
      BANK.vocab.length +
      BANK.reading.questions.length +
      BANK.listening.questions.length +
      BANK.speaking.length +
      BANK.writing.length;

    state.totalTasks = total;
    updateProgress();
  }

  function resetAll(){
    // Re-shuffle and reset UI
    clearMastery();
    // Reset all tasks: easiest is remount sections
    mountAll();
    resetMock();
    toast("Reset complete.");
  }

  /* ---------------- Event wiring ---------------- */
  window.addEventListener("load", ()=>{
    loadVoices();
    if(window.speechSynthesis){
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    $("#modeTrain").addEventListener("click", ()=>{ setMode("train"); mountListening(); });
    $("#modeExam").addEventListener("click", ()=>{ setMode("exam"); mountListening(); });

    $("#accentUS").addEventListener("click", ()=> setAccent("US"));
    $("#accentUK").addEventListener("click", ()=> setAccent("UK"));

    $("#listenBtn").addEventListener("click", handleListen);

    $("#resetAll").addEventListener("click", resetAll);

    $("#startMock").addEventListener("click", startMock);
    $("#resetMock").addEventListener("click", resetMock);
    $("#mockNext").addEventListener("click", mockNext);
    $("#mockSkip").addEventListener("click", mockSkip);
    $("#printBtn").addEventListener("click", ()=> window.print());

    setMode("train");
    setAccent("US");
    mountAll();
    resetMock();
  });

})();
