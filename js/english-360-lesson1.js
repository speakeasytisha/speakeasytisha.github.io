/* English 360° Lesson 1 — Skills Booster
   - Score + progress
   - TTS (US/UK)
   - Listening/Reading QCM with check + reset
   - Drag&Drop email completion
   - Grammar items with instant check + lock
   - Speaking timers + recording + self-score
   - Writing word count + download/copy + self-score
   - Mini mock + CECRL estimate

   Works on GitHub Pages (https) and modern browsers.
*/

(() => {
  "use strict";

  // -----------------------
  // Helpers
  // -----------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function escapeHTML(str) {
    return (str || "").replace(/[&<>"']/g, (m) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[m]));
  }

  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  function formatTime(totalSeconds){
    const s = Math.max(0, Math.floor(totalSeconds));
    const mm = String(Math.floor(s/60)).padStart(2,"0");
    const ss = String(s%60).padStart(2,"0");
    return `${mm}:${ss}`;
  }

  // -----------------------
  // Global state (score/progress)
  // -----------------------
  const state = {
    name: "",
    voice: "us", // us|uk
    globalScore: 0,
    completedKeys: new Set(), // completion tokens
    awardedKeys: new Set(),   // prevent double points
  };

  // Define what counts as “progress”
  const PROGRESS_KEYS = [
    "vocabQuizDone",
    "listA_done",
    "listB_done",
    "readA_done",
    "readB_done",
    "dnd_done",
    "grammar_done",
    "speaking_selfscore",
    "prod_done",
    "email_selfscore",
    "story_selfscore",
    "mock_done",
  ];

  function setCompleted(key){
    if(!state.completedKeys.has(key)){
      state.completedKeys.add(key);
      updateProgressUI();
    }
  }

  function award(key, points){
    if(state.awardedKeys.has(key)) return;
    state.awardedKeys.add(key);
    state.globalScore += points;
    updateProgressUI();
  }

  function updateProgressUI(){
    $("#globalScore").textContent = String(state.globalScore);

    const done = PROGRESS_KEYS.filter(k => state.completedKeys.has(k)).length;
    const pct = Math.round((done / PROGRESS_KEYS.length) * 100);
    $("#progressPct").textContent = `${pct}%`;
    $("#progressBar").style.width = `${pct}%`;
  }

  // -----------------------
  // LocalStorage
  // -----------------------
  function loadLocal(){
    try{
      state.name = localStorage.getItem("e360_name") || "";
      const v = localStorage.getItem("e360_voice") || "us";
      state.voice = (v === "uk") ? "uk" : "us";
      const score = Number(localStorage.getItem("e360_l1_score") || "0");
      state.globalScore = Number.isFinite(score) ? score : 0;

      const doneRaw = localStorage.getItem("e360_l1_done");
      if(doneRaw){
        const arr = JSON.parse(doneRaw);
        if(Array.isArray(arr)){
          arr.forEach(k => state.completedKeys.add(String(k)));
        }
      }
      const awardedRaw = localStorage.getItem("e360_l1_awarded");
      if(awardedRaw){
        const arr = JSON.parse(awardedRaw);
        if(Array.isArray(arr)){
          arr.forEach(k => state.awardedKeys.add(String(k)));
        }
      }
    }catch(_){}
  }

  function saveLocal(){
    try{
      localStorage.setItem("e360_name", state.name);
      localStorage.setItem("e360_voice", state.voice);
      localStorage.setItem("e360_l1_score", String(state.globalScore));
      localStorage.setItem("e360_l1_done", JSON.stringify(Array.from(state.completedKeys)));
      localStorage.setItem("e360_l1_awarded", JSON.stringify(Array.from(state.awardedKeys)));
    }catch(_){}
  }

  // -----------------------
  // TTS (US/UK)
  // -----------------------
  let voices = [];
  function loadVoices(){
    if(!("speechSynthesis" in window)) return;
    voices = speechSynthesis.getVoices() || [];
  }
  if("speechSynthesis" in window){
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  function pickVoice(accent){
    if(!voices || voices.length === 0) return null;
    const want = accent === "uk" ? "en-GB" : "en-US";
    let v = voices.find(x => (x.lang||"").toLowerCase() === want.toLowerCase());
    if(v) return v;
    v = voices.find(x => (x.lang||"").toLowerCase().includes(want.toLowerCase()));
    if(v) return v;
    v = voices.find(x => (x.lang||"").toLowerCase().startsWith("en"));
    return v || null;
  }

  function speak(text, accent = state.voice){
    if(!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(accent);
    if(v) u.voice = v;
    u.rate = accent === "uk" ? 0.98 : 1.0;
    speechSynthesis.speak(u);
  }

  function stopSpeak(){
    if(!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
  }

  function setVoice(v){
    state.voice = (v === "uk") ? "uk" : "us";
    $("#voiceUS").classList.toggle("is-active", state.voice === "us");
    $("#voiceUK").classList.toggle("is-active", state.voice === "uk");
    saveLocal();
  }

  // -----------------------
  // Simple timer utility
  // -----------------------
  function makeTimer(displayEl, secondsDefault){
    let seconds = secondsDefault;
    let interval = null;

    function render(){ displayEl.textContent = formatTime(seconds); }

    function start(){
      if(interval) return;
      interval = setInterval(() => {
        seconds -= 1;
        render();
        if(seconds <= 0){
          stop();
        }
      }, 1000);
    }

    function stop(){
      if(interval){ clearInterval(interval); interval = null; }
    }

    function reset(){
      stop();
      seconds = secondsDefault;
      render();
    }

    render();
    return { start, stop, reset, set:(s)=>{seconds=s;render();}, get:()=>seconds };
  }

  // -----------------------
  // QCM renderer (with check/reset)
  // -----------------------
  function renderQcm(mount, questions){
    mount.innerHTML = questions.map((q, qi) => `
      <div class="q" data-qid="${escapeHTML(q.id)}">
        <p class="q-title">${qi+1}) ${escapeHTML(q.prompt)}</p>
        <div class="opts">
          ${q.options.map((opt) => `
            <label class="opt">
              <input type="radio" name="${escapeHTML(q.id)}" value="${escapeHTML(opt)}"/>
              <span>${escapeHTML(opt)}</span>
            </label>
          `).join("")}
        </div>
      </div>
    `).join("");
  }

  function resetQcmStyles(mount){
    $$(".opt", mount).forEach(o => o.classList.remove("good","bad"));
  }

  function checkQcm(mount, questions){
    resetQcmStyles(mount);
    let correct = 0;
    let answered = 0;

    questions.forEach(q => {
      const chosen = $(`input[name="${CSS.escape(q.id)}"]:checked`, mount);
      if(chosen) answered++;
      const val = chosen ? chosen.value : "";

      const labels = $$(`.q[data-qid="${CSS.escape(q.id)}"] .opt`, mount);
      labels.forEach(lb => {
        const input = $("input", lb);
        const isCorrect = input.value === q.answer;
        if(isCorrect) lb.classList.add("good");
        if(chosen && input.value === val && !isCorrect) lb.classList.add("bad");
      });

      if(chosen && val === q.answer) correct++;
    });

    return { correct, total: questions.length, answered };
  }

  // -----------------------
  // 0) VOCAB (flashcards + quiz)
  // -----------------------
  const vocab = {
    meetings: [
      { e:"📅", w:"agenda", d:"the plan for a meeting", ex:"Let’s follow the agenda." },
      { e:"🧑‍💼", w:"attendee", d:"a person who attends", ex:"All attendees must confirm." },
      { e:"📝", w:"minutes", d:"official notes of a meeting", ex:"Please send the minutes." },
      { e:"⏳", w:"deadline", d:"latest time to finish", ex:"The deadline is Friday." },
      { e:"📌", w:"action item", d:"task assigned after a meeting", ex:"My action item is to call IT." },
      { e:"🔁", w:"follow up", d:"to contact again later", ex:"I’ll follow up tomorrow." },
      { e:"🎯", w:"objective", d:"goal / purpose", ex:"The objective is clear." },
      { e:"🗣️", w:"take the floor", d:"start speaking", ex:"Can I take the floor?" },
    ],
    customer: [
      { e:"🤝", w:"customer complaint", d:"when a client is unhappy", ex:"We handled the complaint quickly." },
      { e:"🧾", w:"invoice", d:"bill for payment", ex:"The invoice is missing a reference." },
      { e:"💳", w:"refund", d:"money returned", ex:"We issued a refund." },
      { e:"🧠", w:"clarify", d:"make clear", ex:"Could you clarify the request?" },
      { e:"🗓️", w:"reschedule", d:"change to another time", ex:"Can we reschedule?" },
      { e:"✅", w:"confirm", d:"say it is true", ex:"I can confirm the booking." },
      { e:"📞", w:"reach you", d:"contact you", ex:"I couldn’t reach you yesterday." },
      { e:"🧩", w:"resolve", d:"solve a problem", ex:"We resolved the issue." },
    ],
    email: [
      { e:"✉️", w:"subject line", d:"email title", ex:"Use a clear subject line." },
      { e:"🙏", w:"thank you in advance", d:"polite phrase (use sparingly)", ex:"Thank you in advance." },
      { e:"📎", w:"attachment", d:"file attached", ex:"Please find the attachment." },
      { e:"🧾", w:"reference number", d:"ID code", ex:"What is the reference number?" },
      { e:"🧑‍💻", w:"get back to you", d:"reply later", ex:"I’ll get back to you shortly." },
      { e:"🕊️", w:"kind regards", d:"standard closing", ex:"Kind regards," },
      { e:"📍", w:"in regards to", d:"about", ex:"In regards to your request…" },
      { e:"📅", w:"calendar invite", d:"meeting invitation", ex:"I’ll send a calendar invite." },
    ],
    it: [
      { e:"💻", w:"system is down", d:"not working", ex:"The system is down." },
      { e:"🔐", w:"access", d:"permission to use", ex:"I don’t have access." },
      { e:"🧩", w:"bug", d:"software problem", ex:"We found a bug." },
      { e:"🔁", w:"restart", d:"turn off/on", ex:"Restart the computer." },
      { e:"🧰", w:"workaround", d:"temporary solution", ex:"We used a workaround." },
      { e:"🧾", w:"ticket", d:"support request", ex:"I opened a ticket." },
      { e:"⚠️", w:"outage", d:"service interruption", ex:"There was an outage." },
      { e:"🧑‍🔧", w:"IT support", d:"help desk", ex:"Contact IT support." },
    ],
    logistics: [
      { e:"📦", w:"shipment", d:"delivery of goods", ex:"The shipment arrived late." },
      { e:"🚚", w:"deliver", d:"bring goods", ex:"We’ll deliver tomorrow." },
      { e:"📉", w:"shortage", d:"not enough quantity", ex:"There is a shortage." },
      { e:"📍", w:"warehouse", d:"storage building", ex:"Send it to the warehouse." },
      { e:"🧾", w:"delivery note", d:"document with delivery details", ex:"Please send the delivery note." },
      { e:"🔢", w:"quantity", d:"how many", ex:"The quantity is wrong." },
      { e:"🧯", w:"urgent", d:"needs action quickly", ex:"This is urgent." },
      { e:"🗓️", w:"ETA", d:"estimated time of arrival", ex:"What’s the ETA?" },
    ]
  };

  let activeVocab = "meetings";

  function renderFlashcards(){
    const mount = $("#flashcards");
    const items = vocab[activeVocab] || [];
    mount.innerHTML = items.map((it) => `
      <div class="flash" tabindex="0" role="button" aria-label="Flashcard ${escapeHTML(it.w)}" data-word="${escapeHTML(it.w)}" data-ex="${escapeHTML(it.ex)}">
        <div class="flash-inner">
          <div class="face front">
            <div class="emoji">${it.e}</div>
            <div>
              <div class="word">${escapeHTML(it.w)}</div>
              <div class="tag">Click to flip</div>
              <div class="smallrow">
                <button class="btn btn-ghost" data-listen="us" type="button">Listen US</button>
                <button class="btn btn-ghost" data-listen="uk" type="button">Listen UK</button>
              </div>
            </div>
          </div>

          <div class="face back">
            <div><strong>Meaning:</strong> ${escapeHTML(it.d)}</div>
            <div class="ex"><strong>Example:</strong> ${escapeHTML(it.ex)}</div>
            <div class="smallrow">
              <button class="btn btn-ghost" data-listen="us" type="button">Listen US</button>
              <button class="btn btn-ghost" data-listen="uk" type="button">Listen UK</button>
            </div>
          </div>
        </div>
      </div>
    `).join("");

    $$(".flash", mount).forEach(card => {
      card.addEventListener("click", (e) => {
        const t = e.target;
        if(t && t.matches && t.matches("button")) return; // don't flip on button
        card.classList.toggle("is-flipped");
      });
      card.addEventListener("keydown", (e) => {
        if(e.key === "Enter" || e.key === " "){
          e.preventDefault();
          card.classList.toggle("is-flipped");
        }
      });
    });

    $$("[data-listen]", mount).forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const accent = btn.getAttribute("data-listen") || state.voice;
        const card = btn.closest(".flash");
        const w = card?.getAttribute("data-word") || "";
        const ex = card?.getAttribute("data-ex") || "";
        speak(`${w}. Example: ${ex}`, accent);
      });
    });
  }

  function bindVocabTabs(){
    $$(".tab").forEach(tab => {
      tab.addEventListener("click", () => {
        $$(".tab").forEach(t => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        activeVocab = tab.getAttribute("data-tab");
        renderFlashcards();
        renderVocabQuiz(); // refresh quiz with category
      });
    });
  }

  function buildVocabQuizPool(){
    const all = Object.values(vocab).flat();
    // pick 10 items: 6 from active + 4 random
    const active = (vocab[activeVocab] || []).slice();
    const others = all.filter(x => !active.includes(x));
    const chosen = shuffle(active).slice(0,6).concat(shuffle(others).slice(0,4));
    return shuffle(chosen).slice(0,10);
  }

  function renderVocabQuiz(){
    const mount = $("#vocabQuiz");
    const pool = buildVocabQuizPool();

    const questions = pool.map((it, idx) => {
      const distractors = shuffle(Object.values(vocab).flat().filter(x => x !== it)).slice(0,3).map(x => x.d);
      const options = shuffle([it.d, ...distractors]);
      return {
        id: `vq_${idx}`,
        prompt: `${it.e} ${it.w}`,
        options,
        answer: it.d
      };
    });

    renderQcm(mount, questions);
    $("#vocabQuizScore").textContent = "Score: 0/0";

    // instant feedback
    mount.addEventListener("change", (e) => {
      const input = e.target;
      if(!input || input.type !== "radio") return;

      const qId = input.name;
      const q = questions.find(x => x.id === qId);
      if(!q) return;

      const qWrap = $(`.q[data-qid="${CSS.escape(qId)}"]`, mount);
      if(!qWrap) return;

      // prevent repeated scoring after correct
      const alreadyCorrect = qWrap.getAttribute("data-locked") === "1";
      if(alreadyCorrect) return;

      // mark
      $$(".opt", qWrap).forEach(lb => lb.classList.remove("good","bad"));
      $$(".opt", qWrap).forEach(lb => {
        const val = $("input", lb).value;
        if(val === q.answer) lb.classList.add("good");
        if(val === input.value && val !== q.answer) lb.classList.add("bad");
      });

      if(input.value === q.answer){
        qWrap.setAttribute("data-locked","1");
        award(`vocabQuiz:${qId}`, 1); // 1 point per correct
      }
      const checked = checkQcm(mount, questions);
      $("#vocabQuizScore").textContent = `Score: ${checked.correct}/${checked.total}`;
      if(checked.correct === checked.total){
        setCompleted("vocabQuizDone");
        award("vocabQuizDonePts", 5); // completion bonus
        saveLocal();
      }
    }, { once:false });
  }

  function resetVocabQuiz(){
    // remove awards for vocab quiz
    Array.from(state.awardedKeys).forEach(k => { if(k.startsWith("vocabQuiz:") || k==="vocabQuizDonePts") state.awardedKeys.delete(k); });
    state.completedKeys.delete("vocabQuizDone");
    renderVocabQuiz();
    updateProgressUI();
    saveLocal();
  }

  // -----------------------
  // 1) LISTENING data
  // -----------------------
  const listeningQ = {
    listA: [
      { id:"la1", prompt:"What is the main problem?", options:["Wrong quantity delivered","Invoice missing","Damaged product","Late meeting"], answer:"Wrong quantity delivered" },
      { id:"la2", prompt:"How many units were ordered?", options:["35","50","15","65"], answer:"50" },
      { id:"la3", prompt:"What does Dana ask for?", options:["A refund today","Confirm delivery of remaining units","A discount","A room upgrade"], answer:"Confirm delivery of remaining units" },
      { id:"la4", prompt:"Who needs the updated document?", options:["Warehouse team","HR","Legal team","Marketing"], answer:"Warehouse team" },
    ],
    listB: [
      { id:"lb1", prompt:"When does the policy start?", options:["Today","Next Monday","Next Friday","Tomorrow"], answer:"Next Monday" },
      { id:"lb2", prompt:"What must visitors do?", options:["Wear a badge","Bring their own laptop","Pay a fee","Call IT"], answer:"Wear a badge" },
      { id:"lb3", prompt:"If you invite a guest, you should…", options:["Meet them at the entrance","Let them walk in alone","Send them to the warehouse","Cancel the invite"], answer:"Meet them at the entrance" },
      { id:"lb4", prompt:"Who does the policy apply to?", options:["Employees only","Contractors as well","Only VIP visitors","Only suppliers"], answer:"Contractors as well" },
    ]
  };

  // -----------------------
  // 2) READING data
  // -----------------------
  const readingQ = {
    readA: [
      { id:"ra1", prompt:"Why is Morgan writing?", options:["To ask for the PO number","To cancel the invoice","To complain about delivery","To invite Alex to a meeting"], answer:"To ask for the PO number" },
      { id:"ra2", prompt:"What is missing?", options:["Purchase order number","Signature","VAT number","Delivery address"], answer:"Purchase order number" },
      { id:"ra3", prompt:"When do they need it?", options:["Today only","This week","Next month","No deadline"], answer:"This week" },
      { id:"ra4", prompt:"Tone of the email:", options:["Aggressive","Professional and polite","Informal and funny","Angry"], answer:"Professional and polite" },
    ],
    readB: [
      { id:"rb1", prompt:"What improved?", options:["Ticket resolution time","Meeting length","Delivery cost","Holiday planning"], answer:"Ticket resolution time" },
      { id:"rb2", prompt:"What was the key change?", options:["Clarifying ownership","Hiring more people","Buying new laptops","Changing salaries"], answer:"Clarifying ownership" },
      { id:"rb3", prompt:"What will they test next month?", options:["A new template","A new office","A new supplier","A new car"], answer:"A new template" },
    ],
    storyQ: [
      { id:"sq1", prompt:"Choose the best sentence:", options:[
        "While I arrived, the system crashed.",
        "I was arriving when the system crashes.",
        "I arrived when the system crashed, and people were waiting for updates.",
        "I arrive and the system was down."
      ], answer:"I arrived when the system crashed, and people were waiting for updates." }
    ]
  };

  // -----------------------
  // Reusable binders for blocks + qcm blocks
  // -----------------------
  function setupAudioBlocks(){
    $$("[data-audio]").forEach(block => {
      const script = $("[data-script]", block)?.textContent?.trim() || "";
      const playBtn = $("[data-play]", block);
      const checkBtn = $("[data-check]", block);
      const resetBtn = $("[data-reset]", block);
      const scoreline = $("[data-scoreline]", block);

      const qcmMount = $(`[data-qcm]`, block);
      const qcmKey = qcmMount.getAttribute("data-qcm"); // listA/listB/readA/readB/storyQ

      // timers inside listening blocks only (button label countdown)
      const timerStartBtn = $("[data-timer-start]", block);
      const timerResetBtn = $("[data-timer-reset]", block);
      const defaultSeconds = qcmKey === "listA" ? 50 : (qcmKey === "listB" ? 40 : 0);

      if(timerStartBtn && timerResetBtn){
        let seconds = defaultSeconds;
        let interval = null;

        const renderBtn = () => { timerStartBtn.textContent = `⏱️ ${formatTime(seconds)} Start`; };
        renderBtn();

        timerStartBtn.addEventListener("click", () => {
          if(interval) return;
          interval = setInterval(() => {
            seconds -= 1;
            if(seconds <= 0){
              seconds = 0;
              clearInterval(interval); interval = null;
            }
            renderBtn();
          }, 1000);
        });

        timerResetBtn.addEventListener("click", () => {
          if(interval){ clearInterval(interval); interval = null; }
          seconds = defaultSeconds;
          renderBtn();
        });
      }

      const data = listeningQ[qcmKey] || readingQ[qcmKey] || [];
      renderQcm(qcmMount, data);

      playBtn?.addEventListener("click", () => {
        speak(script, state.voice);
      });

      checkBtn?.addEventListener("click", () => {
        const { correct, total, answered } = checkQcm(qcmMount, data);
        scoreline.textContent = `Score: ${correct}/${total}`;
        const completionKey = `${qcmKey}_done`;
        if(answered === total){
          setCompleted(completionKey);
          award(`${completionKey}:pts`, correct); // 1 point per correct item
        }
        saveLocal();
      });

      resetBtn?.addEventListener("click", () => {
        $$(`input[type="radio"]`, qcmMount).forEach(i => i.checked = false);
        resetQcmStyles(qcmMount);
        scoreline.textContent = "Score: 0/0";

        const completionKey = `${qcmKey}_done`;
        state.completedKeys.delete(completionKey);
        Array.from(state.awardedKeys).forEach(k => {
          if(k.startsWith(`${completionKey}:pts`)) state.awardedKeys.delete(k);
        });
        updateProgressUI();
        saveLocal();
      });
    });

    // Reading blocks use same attributes but without data-audio.
    $$("[data-qcm]").forEach(mount => {
      // already rendered above for audio blocks; for non-audio blocks in reading/writing, they are inside .qcm with data-qcm and their parent has buttons.
      // Nothing to do here.
    });
  }

  // Setup reading/writing QCM sections (they are not inside data-audio blocks except storyQ is)
  function setupNonAudioQcms(){
    // find containers with .qcm[data-qcm] that are NOT inside [data-audio]
    $$(".qcm[data-qcm]").forEach(qcmMount => {
      if(qcmMount.closest("[data-audio]")) return; // already handled
      const key = qcmMount.getAttribute("data-qcm");
      const data = readingQ[key] || listeningQ[key] || [];
      renderQcm(qcmMount, data);

      const block = qcmMount.closest(".mini") || qcmMount.closest(".card") || document;
      const checkBtn = $("[data-check]", block);
      const resetBtn = $("[data-reset]", block);
      const scoreline = $("[data-scoreline]", block);

      if(!checkBtn || !resetBtn || !scoreline) return;

      checkBtn.addEventListener("click", () => {
        const { correct, total, answered } = checkQcm(qcmMount, data);
        scoreline.textContent = `Score: ${correct}/${total}`;
        const completionKey = `${key}_done`;
        if(answered === total){
          setCompleted(completionKey);
          award(`${completionKey}:pts`, correct);
        }
        saveLocal();
      });

      resetBtn.addEventListener("click", () => {
        $$(`input[type="radio"]`, qcmMount).forEach(i => i.checked = false);
        resetQcmStyles(qcmMount);
        scoreline.textContent = "Score: 0/0";
        const completionKey = `${key}_done`;
        state.completedKeys.delete(completionKey);
        Array.from(state.awardedKeys).forEach(k => {
          if(k.startsWith(`${completionKey}:pts`)) state.awardedKeys.delete(k);
        });
        updateProgressUI();
        saveLocal();
      });
    });
  }

  // -----------------------
  // 2) DnD email task
  // -----------------------
  const dndPhrases = [
    { text:"I can confirm", slot:"1" },
    { text:"Would", slot:"2" },
    { text:"we can offer", slot:"3" },
    { text:"Kind regards,", slot:"4" },
  ];

  function setupDnD(){
    const bank = $("#emailBank");
    const slots = $$("[data-slot]");
    const feedback = $("#dndFeedback");
    const scoreEl = $("#dndScore");

    function clearSlot(slotEl){
      slotEl.textContent = `[${slotEl.getAttribute("data-slot")}]`;
      slotEl.classList.remove("filled","good","bad","over");
      slotEl.removeAttribute("data-value");
    }

    function renderBank(){
      bank.innerHTML = "";
      shuffle(dndPhrases).forEach((p) => {
        const chip = document.createElement("div");
        chip.className = "chipdrag";
        chip.textContent = p.text;
        chip.setAttribute("draggable","true");
        chip.dataset.slot = p.slot;
        chip.dataset.value = p.text;
        bank.appendChild(chip);
      });
    }

    let dragged = null;

    function bindChips(){
      $$(".chipdrag", bank).forEach(chip => {
        chip.addEventListener("dragstart", () => { dragged = chip; });
      });
    }

    function bindSlots(){
      slots.forEach(slot => {
        slot.addEventListener("dragover", (e) => { e.preventDefault(); slot.classList.add("over"); });
        slot.addEventListener("dragleave", () => slot.classList.remove("over"));
        slot.addEventListener("drop", (e) => {
          e.preventDefault();
          slot.classList.remove("over");
          if(!dragged) return;

          // if slot already filled, return existing text to bank
          const prev = slot.getAttribute("data-value");
          if(prev){
            const back = document.createElement("div");
            back.className = "chipdrag";
            back.textContent = prev;
            back.setAttribute("draggable","true");
            const match = dndPhrases.find(x => x.text === prev);
            back.dataset.slot = match ? match.slot : "";
            back.dataset.value = prev;
            bank.appendChild(back);
          }

          slot.textContent = dragged.dataset.value;
          slot.setAttribute("data-value", dragged.dataset.value);
          slot.classList.add("filled");
          dragged.remove();
          dragged = null;

          bindChips();
        });
      });

      bank.addEventListener("dragover", (e) => e.preventDefault());
      bank.addEventListener("drop", (e) => {
        e.preventDefault();
        if(!dragged) return;
        bank.appendChild(dragged);
        dragged = null;
        bindChips();
      });
    }

    function reset(){
      renderBank();
      slots.forEach(clearSlot);
      feedback.textContent = "";
      feedback.classList.remove("good","bad");
      scoreEl.textContent = "Score: 0/4";
      state.completedKeys.delete("dnd_done");
      state.awardedKeys.delete("dnd_done:pts");
      updateProgressUI();
      saveLocal();
      bindChips();
    }

    $("#dndCheck")?.addEventListener("click", () => {
      let correct = 0;
      slots.forEach(slot => {
        slot.classList.remove("good","bad");
        const slotId = slot.getAttribute("data-slot");
        const val = slot.getAttribute("data-value") || "";
        const expected = dndPhrases.find(p => p.slot === slotId)?.text || "";

        if(val && val === expected){
          slot.classList.add("good");
          correct++;
        }else{
          slot.classList.add("bad");
        }
      });

      scoreEl.textContent = `Score: ${correct}/4`;
      const allFilled = slots.every(s => (s.getAttribute("data-value")||"").trim().length>0);

      if(allFilled){
        setCompleted("dnd_done");
        award("dnd_done:pts", correct); // 1 pt per correct
      }

      feedback.classList.remove("good","bad");
      if(correct === 4){
        feedback.classList.add("good");
        feedback.textContent = "✅ Parfait ! Email très professionnel.";
      }else{
        feedback.classList.add("bad");
        feedback.textContent = "❌ Pas encore. Vérifie les emplacements puis recommence.";
      }
      saveLocal();
    });

    $("#dndReset")?.addEventListener("click", reset);

    // init
    renderBank();
    bindSlots();
    reset();
  }

  // -----------------------
  // 3) GRAMMAR items
  // -----------------------
  const grammarItems = [
    { id:"g1", prompt:"I ________ (already / send) the updated invoice. (résultat maintenant)", options:["past simple","present perfect","past continuous"], answer:"present perfect", explain:"Résultat maintenant + already → present perfect." },
    { id:"g2", prompt:"Last year, we ________ the process and reduced delays. (temps terminé)", options:["improved","have improved","are improving"], answer:"improved", explain:"Last year = past simple." },
    { id:"g3", prompt:"The meeting is ___ November.", options:["on","at","in"], answer:"in", explain:"Months → in November." },
    { id:"g4", prompt:"The call is ___ 3 p.m.", options:["on","at","in"], answer:"at", explain:"Time → at 3 p.m." },
    { id:"g5", prompt:"We will meet ___ Monday morning.", options:["on","at","in"], answer:"on", explain:"Days → on Monday." },
    { id:"g6", prompt:"Identify the error: “It depends of the supplier’s availability.”", options:["no error","error: depends of","error: availability"], answer:"error: depends of", explain:"Correct: depends on." },
    { id:"g7", prompt:"Don’t worry, I ___ call IT for you. (décision spontanée)", options:["am going to","will","do"], answer:"will", explain:"Instant decision → will." },
    { id:"g8", prompt:"We’re ___ a client at 10:30 tomorrow. (arrangement)", options:["meet","meeting","met"], answer:"meeting", explain:"Arrangement certain → present continuous." },
    { id:"g9", prompt:"Choose the best: “Could you ___ the file again?”", options:["send","to send","sending"], answer:"send", explain:"Could you + base verb." },
    { id:"g10", prompt:"Choose the best: “Please let me know ___ you prefer.”", options:["what","which","who"], answer:"which", explain:"Which option you prefer." },
    { id:"g11", prompt:"Correct collocation: “We need to ___ the issue quickly.”", options:["resolve","do","make"], answer:"resolve", explain:"Resolve an issue." },
    { id:"g12", prompt:"Choose: “I’ve ___ opened a ticket.”", options:["already","yesterday","last week"], answer:"already", explain:"Already often with present perfect." },
  ];

  function renderGrammar(){
    const mount = $("#grammarItems");
    mount.innerHTML = grammarItems.map((it, idx) => `
      <div class="q" data-gid="${escapeHTML(it.id)}">
        <p class="q-title">${idx+1}) ${escapeHTML(it.prompt)}</p>
        <div class="opts">
          ${it.options.map(opt => `
            <label class="opt">
              <input type="radio" name="${escapeHTML(it.id)}" value="${escapeHTML(opt)}" />
              <span>${escapeHTML(opt)}</span>
            </label>
          `).join("")}
        </div>
        <div class="feedback tiny muted" data-gfb></div>
      </div>
    `).join("");

    // instant check + lock on correct
    mount.addEventListener("change", (e) => {
      const input = e.target;
      if(!input || input.type !== "radio") return;

      const id = input.name;
      const item = grammarItems.find(x => x.id === id);
      if(!item) return;

      const wrap = $(`.q[data-gid="${CSS.escape(id)}"]`, mount);
      if(!wrap) return;

      if(wrap.getAttribute("data-locked") === "1") return;

      const chosen = input.value;
      const ok = chosen === item.answer;

      const labels = $$(".opt", wrap);
      labels.forEach(lb => lb.classList.remove("good","bad"));
      labels.forEach(lb => {
        const val = $("input", lb).value;
        if(val === item.answer) lb.classList.add("good");
        if(val === chosen && val !== item.answer) lb.classList.add("bad");
      });

      const fb = $("[data-gfb]", wrap);
      fb.classList.remove("good","bad");

      if(ok){
        wrap.setAttribute("data-locked","1");
        fb.classList.add("good");
        fb.textContent = `✅ Correct. +1 pt`;
        award(`grammar:${id}`, 1);
      }else{
        fb.classList.add("bad");
        fb.textContent = `❌ ${item.explain}`;
      }

      updateGrammarScore();
      if(getGrammarCorrectCount() === grammarItems.length){
        setCompleted("grammar_done");
        award("grammar_done:bonus", 4); // completion bonus
      }
      saveLocal();
    }, { once:false });

    updateGrammarScore();
  }

  function getGrammarCorrectCount(){
    return grammarItems.filter(it => state.awardedKeys.has(`grammar:${it.id}`)).length;
  }

  function updateGrammarScore(){
    const correct = getGrammarCorrectCount();
    $("#grammarScore").textContent = `Score: ${correct}/${grammarItems.length}`;
  }

  function resetGrammar(){
    grammarItems.forEach(it => state.awardedKeys.delete(`grammar:${it.id}`));
    state.awardedKeys.delete("grammar_done:bonus");
    state.completedKeys.delete("grammar_done");
    renderGrammar();
    updateProgressUI();
    saveLocal();
  }

  // -----------------------
  // Speaking: plan generator + timers + recording + self-score
  // -----------------------
  const speakingPlans = {
    noise: {
      neutral: [
        "1) Apologise and show empathy.",
        "2) Ask 2 clarification questions (room number, time, source of noise).",
        "3) Offer 2 solutions (change room / send staff / quiet hours).",
        "4) Confirm next step and timing."
      ],
      warm: [
        "1) Apologise sincerely: “I’m really sorry about the noise.”",
        "2) Clarify: “Which room are you in?” / “When did it start?”",
        "3) Solutions: move rooms / speak to neighbours / offer late check-out.",
        "4) Next step: “I’ll call you back in 10 minutes with an update.”"
      ],
      firm: [
        "1) Apologise and acknowledge.",
        "2) Clarify details quickly.",
        "3) Solutions: security check + room change if needed.",
        "4) Confirm: “We’ll enforce quiet hours immediately.”"
      ]
    },
    lateReport: {
      neutral: [
        "1) Context: report due today.",
        "2) Ask status + blocker.",
        "3) Offer help + set new clear deadline.",
        "4) Confirm next step (send by email / shared folder)."
      ],
      warm: [
        "1) Polite check-in: “Just a quick follow-up…”",
        "2) Ask what’s blocking progress.",
        "3) Offer help and agree a realistic deadline.",
        "4) Confirm: “Could you send a draft by 4 p.m.?”"
      ],
      firm: [
        "1) State urgency and impact.",
        "2) Ask for exact delivery time.",
        "3) Offer support but set a non-negotiable deadline.",
        "4) Confirm escalation if needed."
      ]
    },
    supplierDelay: {
      neutral: [
        "1) Explain the situation (delivery delayed).",
        "2) Ask for updated ETA + reason.",
        "3) Offer alternatives (partial shipment / different carrier).",
        "4) Confirm document update (delivery note / email confirmation)."
      ],
      warm: [
        "1) Professional + calm.",
        "2) Ask ETA and what can be done today.",
        "3) Offer options and focus on solution.",
        "4) Confirm next step and contact person."
      ],
      firm: [
        "1) State impact on operations.",
        "2) Ask for immediate confirmation.",
        "3) Request corrective action + written update.",
        "4) Confirm escalation route."
      ]
    },
    itDown: {
      neutral: [
        "1) Acknowledge issue and apologise.",
        "2) Clarify scope (who is affected, since when).",
        "3) Solutions: workaround + IT ticket + update schedule.",
        "4) Confirm next update time."
      ],
      warm: [
        "1) Empathy: “I understand this is frustrating.”",
        "2) Clarify: “Are all teams affected?”",
        "3) Solutions: manual process + IT support.",
        "4) Next step: “I’ll update you in 15 minutes.”"
      ],
      firm: [
        "1) Acknowledge and take ownership.",
        "2) Confirm impact quickly.",
        "3) Immediate workaround and escalation.",
        "4) Provide clear update cadence."
      ]
    }
  };

  let speakTimer, prodTimer, writeTimer, mockTimer;
  let recorder = null;
  let recordedChunks = [];
  let recordedBlobUrl = null;

  function setupSpeaking(){
    speakTimer = makeTimer($("#speakTimer"), 45);
    prodTimer = makeTimer($("#prodTimer"), 60);
    writeTimer = makeTimer($("#writeTimer"), 8*60);
    mockTimer = makeTimer($("#mockTimer"), 7*60);

    $("#speakStartTimer").addEventListener("click", () => speakTimer.start());
    $("#speakResetTimer").addEventListener("click", () => speakTimer.reset());
    $("#prodStartTimer").addEventListener("click", () => prodTimer.start());
    $("#prodResetTimer").addEventListener("click", () => prodTimer.reset());
    $("#writeStartTimer").addEventListener("click", () => writeTimer.start());
    $("#writeResetTimer").addEventListener("click", () => writeTimer.reset());
    $("#mockStartTimer").addEventListener("click", () => mockTimer.start());
    $("#mockResetTimer").addEventListener("click", () => mockTimer.reset());

    // Speaking plan
    $("#genSpeakingPlan").addEventListener("click", () => {
      const scenario = $("#speakScenario").value;
      const tone = $("#speakTone").value;

      const lines = speakingPlans[scenario]?.[tone] || [];
      const plan = `Goal: be structured and professional.\n\n${lines.map((l,i)=>`${i+1}. ${l}`).join("\n")}\n\nStarter phrases:\n- “Thanks for letting us know.”\n- “Could you please confirm…?”\n- “Here are two options…”\n- “I’ll follow up by …”`;
      $("#speakingPlan").textContent = plan;
      award("speaking_plan_gen", 1);
      saveLocal();
    });

    $("#speakListenPlan").addEventListener("click", () => {
      speak($("#speakingPlan").textContent || "", state.voice);
    });

    // Production prompts
    $("#genProdPrompts").addEventListener("click", () => {
      const topic = $("#prodTopic").value;
      const prompts = ({
        role: [
          "Situation: What is your role and main responsibilities?",
          "Action: What do you do daily/weekly?",
          "Result: What impact do you create?",
          "Lesson: What are you improving this year?"
        ],
        problem: [
          "Situation: Describe a problem in a project.",
          "Action: What did you do first? Who did you contact?",
          "Result: What changed? Any metric?",
          "Lesson: What will you do next time?"
        ],
        opinion: [
          "Situation: Describe a tool/service you use at work.",
          "Action: What features are helpful?",
          "Result: What improved (time, quality, cost)?",
          "Lesson: Recommendation + next step."
        ]
      })[topic] || [];

      const text = `Use this structure:\n${prompts.map((p,i)=>`${i+1}) ${p}`).join("\n")}\n\nUseful connectors: First, Then, However, As a result, Overall.`;
      $("#prodPrompts").textContent = text;
      award("prod_prompts_gen", 1);
      saveLocal();
    });

    $("#prodListenPrompts").addEventListener("click", () => {
      speak($("#prodPrompts").textContent || "", state.voice);
    });

    // Mark production done
    $("#prodDone").addEventListener("click", () => {
      const fb = $("#prodFeedback");
      fb.classList.remove("good","bad");
      fb.classList.add("good");
      fb.textContent = "✅ Super. Note: vise 4 étapes + 2 connecteurs.";
      setCompleted("prod_done");
      award("prod_done:pts", 2);
      saveLocal();
    });

    $("#prodReset").addEventListener("click", () => {
      $("#prodPrompts").textContent = "Clique “Générer prompts”.";
      $("#prodFeedback").textContent = "";
      $("#prodFeedback").classList.remove("good","bad");
      state.completedKeys.delete("prod_done");
      state.awardedKeys.delete("prod_done:pts");
      updateProgressUI();
      saveLocal();
    });

    // Recording
    $("#recStart").addEventListener("click", async () => {
      const fb = $("#speakFeedback");
      fb.textContent = "";
      fb.classList.remove("good","bad");

      if(!navigator.mediaDevices?.getUserMedia){
        fb.classList.add("bad");
        fb.textContent = "❌ Micro non disponible sur ce navigateur.";
        return;
      }

      try{
        const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
        recordedChunks = [];
        recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (e) => {
          if(e.data && e.data.size > 0) recordedChunks.push(e.data);
        };

        recorder.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          const blob = new Blob(recordedChunks, { type: "audio/webm" });
          if(recordedBlobUrl) URL.revokeObjectURL(recordedBlobUrl);
          recordedBlobUrl = URL.createObjectURL(blob);
          $("#recDownload").disabled = false;
          award("speaking_recorded", 1);
          saveLocal();
        };

        recorder.start();
        $("#recStart").disabled = true;
        $("#recStop").disabled = false;
      }catch(err){
        fb.classList.add("bad");
        fb.textContent = "❌ Permission micro refusée.";
      }
    });

    $("#recStop").addEventListener("click", () => {
      if(recorder && recorder.state !== "inactive"){
        recorder.stop();
      }
      $("#recStart").disabled = false;
      $("#recStop").disabled = true;
    });

    $("#recDownload").addEventListener("click", () => {
      if(!recordedBlobUrl) return;
      const a = document.createElement("a");
      a.href = recordedBlobUrl;
      a.download = "english-360-speaking.webm";
      document.body.appendChild(a);
      a.click();
      a.remove();
      award("speaking_download", 1);
      saveLocal();
    });

    // Self-score speaking checklist
    $("#speakSelfScore").addEventListener("click", () => {
      const checks = $$("[data-speak-check]");
      const done = checks.filter(c => c.checked).length;
      const fb = $("#speakFeedback");
      fb.classList.remove("good","bad");

      if(done >= 3){
        fb.classList.add("good");
        fb.textContent = `✅ Bon niveau (checklist: ${done}/4).`;
        setCompleted("speaking_selfscore");
        award("speaking_selfscore:pts", done); // 3-4 points
      }else{
        fb.classList.add("bad");
        fb.textContent = `❌ À améliorer (checklist: ${done}/4). Ajoute empathie + 2 solutions.`;
      }
      saveLocal();
    });

    $("#speakResetAll").addEventListener("click", () => {
      $("#speakingPlan").textContent = "Clique “Générer un plan”.";
      speakTimer.reset();
      $$("[data-speak-check]").forEach(c => c.checked = false);
      $("#speakFeedback").textContent = "";
      $("#speakFeedback").classList.remove("good","bad");
      state.completedKeys.delete("speaking_selfscore");
      state.awardedKeys.delete("speaking_selfscore:pts");
      updateProgressUI();
      saveLocal();
    });
  }

  // -----------------------
  // Writing: word counts + download/copy + self-score
  // -----------------------
  function wordCount(s){
    return (s || "").trim().length ? (s.trim().match(/\S+/g) || []).length : 0;
  }

  function downloadText(filename, text){
    const blob = new Blob([text], { type:"text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 500);
  }

  async function copyText(text){
    try{
      await navigator.clipboard.writeText(text);
      return true;
    }catch(_){
      return false;
    }
  }

  function setupWriting(){
    const emailDraft = $("#emailDraft");
    const storyDraft = $("#storyDraft");

    const updateEmailWords = () => $("#emailWords").textContent = String(wordCount(emailDraft.value));
    const updateStoryWords = () => $("#storyWords").textContent = String(wordCount(storyDraft.value));

    emailDraft.addEventListener("input", updateEmailWords);
    storyDraft.addEventListener("input", updateStoryWords);
    updateEmailWords(); updateStoryWords();

    $("#emailCopy").addEventListener("click", async () => {
      const ok = await copyText(emailDraft.value || "");
      if(ok) award("email_copy", 1);
      saveLocal();
    });

    $("#emailDownload").addEventListener("click", () => {
      downloadText("english-360-email.txt", emailDraft.value || "");
      award("email_download", 1);
      saveLocal();
    });

    $("#emailModelCopy").addEventListener("click", async () => {
      const ok = await copyText($("#emailModel").textContent || "");
      if(ok) award("email_model_copy", 1);
      saveLocal();
    });

    $("#emailModelListen").addEventListener("click", () => {
      speak($("#emailModel").textContent || "", state.voice);
    });

    $("#emailSelfScore").addEventListener("click", () => {
      const checks = $$("[data-write-check]");
      const done = checks.filter(c => c.checked).length;
      const fb = $("#emailFeedback");
      fb.classList.remove("good","bad");

      const wc = wordCount(emailDraft.value || "");
      const hasTwoOptions = /\b(friday|tuesday|monday|thursday|wednesday)\b/i.test(emailDraft.value) && /\b(at|pm|am)\b/i.test(emailDraft.value);
      const hasClosing = /(kind regards|best regards)/i.test(emailDraft.value);

      let bonus = 0;
      if(wc >= 70) bonus += 1;
      if(hasTwoOptions) bonus += 1;
      if(hasClosing) bonus += 1;

      if(done >= 4){
        fb.classList.add("good");
        fb.textContent = `✅ Bon email (checklist: ${done}/5). Bonus clarté: +${bonus}`;
        setCompleted("email_selfscore");
        award("email_selfscore:pts", done + bonus);
      }else{
        fb.classList.add("bad");
        fb.textContent = `❌ Complète la structure (checklist: ${done}/5). Ajoute 2 créneaux + question.`;
      }
      saveLocal();
    });

    $("#emailReset").addEventListener("click", () => {
      emailDraft.value = "";
      updateEmailWords();
      $$("[data-write-check]").forEach(c => c.checked = false);
      $("#emailFeedback").textContent = "";
      $("#emailFeedback").classList.remove("good","bad");
      state.completedKeys.delete("email_selfscore");
      state.awardedKeys.delete("email_selfscore:pts");
      updateProgressUI();
      saveLocal();
    });

    $("#storyCopy").addEventListener("click", async () => {
      const ok = await copyText(storyDraft.value || "");
      if(ok) award("story_copy", 1);
      saveLocal();
    });

    $("#storyDownload").addEventListener("click", () => {
      downloadText("english-360-story.txt", storyDraft.value || "");
      award("story_download", 1);
      saveLocal();
    });

    $("#storySelfScore").addEventListener("click", () => {
      const fb = $("#storyFeedback");
      fb.classList.remove("good","bad");

      const text = storyDraft.value || "";
      const wc = wordCount(text);

      const hasPast = /\b(arrived|informed|called|opened|fixed|updated|reported)\b/i.test(text);
      const hasImpact = /\b(delayed|impact|affected|customers|team|priority)\b/i.test(text);
      const hasAction = /\b(i|we)\s+(called|informed|reported|created|opened|sent|updated|checked)\b/i.test(text);

      let score = 0;
      if(wc >= 60) score++;
      if(hasPast) score++;
      if(hasImpact) score++;
      if(hasAction) score++;

      if(score >= 3){
        fb.classList.add("good");
        fb.textContent = `✅ Good story (criteria: ${score}/4).`;
        setCompleted("story_selfscore");
        award("story_selfscore:pts", score);
      }else{
        fb.classList.add("bad");
        fb.textContent = `❌ Add details (criteria: ${score}/4). Use past simple + impact + action.`;
      }
      saveLocal();
    });

    $("#storyReset").addEventListener("click", () => {
      storyDraft.value = "";
      updateStoryWords();
      $("#storyFeedback").textContent = "";
      $("#storyFeedback").classList.remove("good","bad");
      state.completedKeys.delete("story_selfscore");
      state.awardedKeys.delete("story_selfscore:pts");
      updateProgressUI();
      saveLocal();
    });
  }

  // -----------------------
  // Mini mock (12 Q)
  // -----------------------
  const mockQ = [
    { id:"m1", prompt:"Choose the best: “I ___ send you the report now.” (decision now)", options:["will","am going to","sent"], answer:"will", skill:"Grammar" },
    { id:"m2", prompt:"Preposition: “The meeting is ___ Monday.”", options:["on","in","at"], answer:"on", skill:"Grammar" },
    { id:"m3", prompt:"Email phrase: “I’ll ___ to you tomorrow.”", options:["get back","get return","go back"], answer:"get back", skill:"Reading" },
    { id:"m4", prompt:"Listening skill: what does “ETA” mean?", options:["Estimated time of arrival","Extra time allowed","Emergency technical alert"], answer:"Estimated time of arrival", skill:"Listening" },
    { id:"m5", prompt:"Present perfect trigger:", options:["already","last year","yesterday"], answer:"already", skill:"Grammar" },
    { id:"m6", prompt:"Professional closing:", options:["Kind regards,","See ya!","Bye bye"], answer:"Kind regards,", skill:"Writing" },
    { id:"m7", prompt:"Past simple marker:", options:["in 2025","already","ever"], answer:"in 2025", skill:"Grammar" },
    { id:"m8", prompt:"Best meaning: “workaround”", options:["temporary solution","holiday plan","final decision"], answer:"temporary solution", skill:"Reading" },
    { id:"m9", prompt:"Which is most polite?", options:["Could you resend the invoice?","Resend the invoice.","You must resend it."], answer:"Could you resend the invoice?", skill:"Writing" },
    { id:"m10", prompt:"Choose: “We’re meeting a client tomorrow.” This is…", options:["an arrangement","a past event","a prediction"], answer:"an arrangement", skill:"Grammar" },
    { id:"m11", prompt:"Customer service: “complaint” is…", options:["a customer is unhappy","a calendar invite","a shipment"], answer:"a customer is unhappy", skill:"Listening" },
    { id:"m12", prompt:"Best verb: “resolve an ___”", options:["issue","meeting","regards"], answer:"issue", skill:"Grammar" },
  ];

  function renderMock(){
    const mount = $("#mockQuiz");
    renderQcm(mount, mockQ);
    $("#mockScore").textContent = "Score: 0/12";
    $("#mockResult").textContent = "";
  }

  function scoreToCEFR(pct){
    if(pct <= 30) return "A1";
    if(pct <= 50) return "A2";
    if(pct <= 65) return "B1";
    if(pct <= 80) return "B2";
    if(pct <= 90) return "C1";
    return "C2";
  }

  function setupMock(){
    renderMock();

    $("#mockCheck").addEventListener("click", () => {
      const mount = $("#mockQuiz");
      const { correct, total, answered } = checkQcm(mount, mockQ);
      $("#mockScore").textContent = `Score: ${correct}/${total}`;

      // skill breakdown
      const bySkill = {};
      mockQ.forEach(q => {
        const chosen = $(`input[name="${CSS.escape(q.id)}"]:checked`, mount)?.value || "";
        if(!bySkill[q.skill]) bySkill[q.skill] = { c:0, t:0 };
        bySkill[q.skill].t += 1;
        if(chosen && chosen === q.answer) bySkill[q.skill].c += 1;
      });

      if(answered === total){
        setCompleted("mock_done");
        award("mock_done:pts", correct); // 1 pt per correct
      }

      const pct = total ? Math.round((correct/total)*100) : 0;
      const cefr = scoreToCEFR(pct);

      const breakdown = Object.entries(bySkill).map(([k,v]) => {
        const p = v.t ? Math.round((v.c/v.t)*100) : 0;
        return `• ${k}: ${v.c}/${v.t} (${p}%)`;
      }).join("\n");

      $("#mockResult").innerHTML = `
        <strong>Résultat indicatif:</strong> ${pct}% → <strong>${cefr}</strong><br/><br/>
        <pre style="margin:0;white-space:pre-wrap;line-height:1.45;color:rgba(18,32,40,.72)">${escapeHTML(breakdown)}</pre>
        <div style="margin-top:.6rem;color:rgba(18,32,40,.72)">
          Conseil: si une compétence est plus faible, refais la section correspondante (format court = vitesse + précision).
        </div>
      `;

      saveLocal();
    });

    $("#mockReset").addEventListener("click", () => {
      const mount = $("#mockQuiz");
      $$(`input[type="radio"]`, mount).forEach(i => i.checked = false);
      resetQcmStyles(mount);
      $("#mockScore").textContent = "Score: 0/12";
      $("#mockResult").textContent = "";
      state.completedKeys.delete("mock_done");
      state.awardedKeys.delete("mock_done:pts");
      updateProgressUI();
      saveLocal();
    });
  }

  // -----------------------
  // Buttons: Save name / reset all
  // -----------------------
  function setupTopControls(){
    $("#studentName").value = state.name;

    $("#saveName").addEventListener("click", () => {
      state.name = ($("#studentName").value || "").trim();
      saveLocal();
      award("name_saved", 1);
    });

    $("#resetAll").addEventListener("click", () => {
      stopSpeak();
      try{
        localStorage.removeItem("e360_l1_score");
        localStorage.removeItem("e360_l1_done");
        localStorage.removeItem("e360_l1_awarded");
      }catch(_){}

      state.globalScore = 0;
      state.completedKeys.clear();
      state.awardedKeys.clear();
      updateProgressUI();

      location.reload();
    });

    $("#voiceUS").addEventListener("click", () => setVoice("us"));
    $("#voiceUK").addEventListener("click", () => setVoice("uk"));
    $("#stopAudio").addEventListener("click", stopSpeak);
  }

  function setupVocabButtons(){
    $("#shuffleCards").addEventListener("click", () => {
      vocab[activeVocab] = shuffle(vocab[activeVocab] || []);
      renderFlashcards();
      award("vocab_shuffled", 1);
      saveLocal();
    });

    $("#resetVocab").addEventListener("click", () => {
      renderFlashcards();
    });

    $("#resetVocabQuiz").addEventListener("click", resetVocabQuiz);
  }

  // -----------------------
  // Init
  // -----------------------
  function init(){
    loadLocal();
    setupTopControls();
    setVoice(state.voice);

    renderFlashcards();
    bindVocabTabs();
    renderVocabQuiz();
    setupVocabButtons();

    setupAudioBlocks();
    setupNonAudioQcms();

    setupDnD();

    renderGrammar();
    $("#grammarReset").addEventListener("click", resetGrammar);

    setupSpeaking();
    setupWriting();
    setupMock();

    updateProgressUI();
    saveLocal();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
