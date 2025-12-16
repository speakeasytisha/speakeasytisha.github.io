/* English 360° Prep – page JS */
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // -----------------------------
  // Safe localStorage helpers
  // -----------------------------
  const store = {
    get(key, fallback=""){
      try { return localStorage.getItem(key) ?? fallback; } catch(e){ return fallback; }
    },
    set(key, val){
      try { localStorage.setItem(key, val); } catch(e){}
    },
    remove(key){
      try { localStorage.removeItem(key); } catch(e){}
    }
  };

  // -----------------------------
  // Name + demo link
  // -----------------------------
  const nameInput = $("#e360Name");
  const saveNameBtn = $("#e360SaveName");
  const demoInput = $("#e360DemoLink");
  const saveDemoBtn = $("#e360SaveDemo");
  const openDemo = $("#e360OpenDemo");

  const savedName = store.get("e360_name","");
  if (savedName && nameInput) nameInput.value = savedName;

  const savedDemo = store.get("e360_demo","");
  if (demoInput) demoInput.value = savedDemo;
  if (openDemo) {
    openDemo.href = savedDemo || "#";
    openDemo.classList.toggle("is-disabled", !savedDemo);
  }

  if (saveNameBtn && nameInput){
    saveNameBtn.addEventListener("click", ()=>{
      store.set("e360_name", (nameInput.value||"").trim());
      flash(saveNameBtn, "✅");
    });
  }

  if (saveDemoBtn && demoInput){
    saveDemoBtn.addEventListener("click", ()=>{
      const url = (demoInput.value||"").trim();
      store.set("e360_demo", url);
      if (openDemo) openDemo.href = url || "#";
      flash(saveDemoBtn, "✅");
    });
  }

  // -----------------------------
  // Generic MCQ quiz engine
  // -----------------------------
  function initQuiz(container){
    const qs = $$(".e360-q", container);
    const scoreEl = $("[data-score]", container);
    const totalEl = $("[data-total]", container);
    const finalEl = $("[data-final]", container);
    const resetBtn = $("[data-reset]", container);
    const showBtn = $("[data-show-score]", container);

    let score = 0;
    const total = qs.length;
    if (totalEl) totalEl.textContent = String(total);
    if (scoreEl) scoreEl.textContent = "0";

    qs.forEach(q=>{
      const answer = q.getAttribute("data-answer");
      const explain = q.getAttribute("data-explain") || "";
      const fb = $(".e360-fb", q);

      $$(".e360-opts button", q).forEach(btn=>{
        btn.addEventListener("click", ()=>{
          if (q.getAttribute("data-answered")==="1") return;
          q.setAttribute("data-answered","1");

          const chosen = btn.getAttribute("data-opt");
          if (chosen === answer){
            score += 1;
            if (fb){
              fb.textContent = "✅ Correct. " + explain;
              fb.classList.add("e360-ok");
            }
          } else {
            if (fb){
              fb.textContent = "❌ Not quite. " + explain;
              fb.classList.add("e360-no");
            }
          }
          if (scoreEl) scoreEl.textContent = String(score);
          // disable options
          $$(".e360-opts button", q).forEach(b=>b.disabled=true);

          updateProgress();
        });
      });
    });

    function reset(){
      score = 0;
      if (scoreEl) scoreEl.textContent = "0";
      if (finalEl) finalEl.textContent = "";
      qs.forEach(q=>{
        q.removeAttribute("data-answered");
        const fb = $(".e360-fb", q);
        if (fb){ fb.textContent=""; fb.classList.remove("e360-ok","e360-no"); }
        $$(".e360-opts button", q).forEach(b=>b.disabled=false);
      });
      updateProgress();
    }

    if (resetBtn) resetBtn.addEventListener("click", reset);
    if (showBtn) showBtn.addEventListener("click", ()=>{
      if (finalEl) finalEl.textContent = `→ ${score}/${total}`;
    });

    return { getScore:()=>score, getTotal:()=>total, reset };
  }

  const quizBlocks = $$("[data-e360-quiz]");
  const quizzes = quizBlocks.map(initQuiz);

  // -----------------------------
  // Grammar (select + check)
  // -----------------------------
  function initGrammar(set){
    const items = $$(".e360-g", set);
    const scoreEl = $("[data-score]", set);
    const totalEl = $("[data-total]", set);
    const finalEl = $("[data-final]", set);
    const resetBtn = $("[data-reset]", set);
    const showBtn = $("[data-show-score]", set);

    let score = 0;
    const total = items.length;
    if (totalEl) totalEl.textContent = String(total);
    if (scoreEl) scoreEl.textContent = "0";

    items.forEach(item=>{
      const answer = item.getAttribute("data-answer");
      const explain = item.getAttribute("data-explain") || "";
      const sel = $("select", item);
      const check = $("[data-g-check]", item);
      const fb = $(".e360-fb", item);

      if (!sel || !check) return;

      check.addEventListener("click", ()=>{
        if (item.getAttribute("data-checked")==="1") return;
        const val = (sel.value||"").trim();
        if (!val){
          if (fb){ fb.textContent = "Choose an option first."; fb.classList.add("e360-no"); }
          return;
        }
        item.setAttribute("data-checked","1");
        if (val === answer){
          score += 1;
          if (fb){ fb.textContent = "✅ Correct. " + explain; fb.classList.add("e360-ok"); }
        } else {
          if (fb){ fb.textContent = "❌ Not quite. " + explain; fb.classList.add("e360-no"); }
        }
        sel.disabled = true;
        check.disabled = true;
        if (scoreEl) scoreEl.textContent = String(score);
        updateProgress();
      });
    });

    function reset(){
      score = 0;
      if (scoreEl) scoreEl.textContent = "0";
      if (finalEl) finalEl.textContent = "";
      items.forEach(item=>{
        item.removeAttribute("data-checked");
        const sel = $("select", item);
        const check = $("[data-g-check]", item);
        const fb = $(".e360-fb", item);
        if (sel){ sel.disabled=false; sel.value=""; }
        if (check){ check.disabled=false; }
        if (fb){ fb.textContent=""; fb.classList.remove("e360-ok","e360-no"); }
      });
      updateProgress();
    }

    if (resetBtn) resetBtn.addEventListener("click", reset);
    if (showBtn) showBtn.addEventListener("click", ()=>{
      if (finalEl) finalEl.textContent = `→ ${score}/${total}`;
    });

    return { getScore:()=>score, getTotal:()=>total, reset };
  }

  const grammarSets = $$("[data-grammar]");
  const grammars = grammarSets.map(initGrammar);

  // -----------------------------
  // Drag & Drop (email reply)
  // -----------------------------
  function initDnd(root){
    const chips = $$(".e360-chip", root);
    const drops = $$(".drop", root);
    const checkBtn = $("[data-dnd-check]", root);
    const resetBtn = $("[data-dnd-reset]", root);
    const scoreEl = $("[data-dnd-score]", root);
    const feedbackEl = $("[data-dnd-feedback]", root);

    // correct mapping
    const correct = {
      "1": "Thanks for your message.",
      "2": "I can confirm",
      "3": "Would Friday at 3 p.m. work for you?",
      "4": "If that doesn’t suit you,",
      "5": "Best regards,"
    };

    let draggingToken = null;
    chips.forEach(chip=>{
      chip.addEventListener("dragstart", (e)=>{
        draggingToken = chip.getAttribute("data-token");
        e.dataTransfer.setData("text/plain", draggingToken || "");
      });
    });

    drops.forEach(d=>{
      d.addEventListener("dragover", (e)=>{ e.preventDefault(); d.classList.add("over"); });
      d.addEventListener("dragleave", ()=> d.classList.remove("over"));
      d.addEventListener("drop", (e)=>{
        e.preventDefault();
        d.classList.remove("over");
        const token = e.dataTransfer.getData("text/plain") || draggingToken;
        if (!token) return;
        d.textContent = token;
        d.classList.add("filled");
        d.setAttribute("data-value", token);
      });
      // allow click to clear
      d.addEventListener("click", ()=>{
        d.textContent = "[" + d.getAttribute("data-blank") + "]";
        d.removeAttribute("data-value");
        d.classList.remove("filled");
      });
    });

    function check(){
      let score = 0;
      let filled = 0;
      drops.forEach(d=>{
        const blank = d.getAttribute("data-blank");
        const val = d.getAttribute("data-value");
        if (val) filled += 1;
        if (val && correct[blank] && val === correct[blank]) score += 1;
      });
      if (scoreEl) scoreEl.textContent = String(score);
      if (feedbackEl){
        if (filled < drops.length){
          feedbackEl.textContent = "Tip: fill all blanks (click a blank to clear it).";
        } else if (score === drops.length){
          feedbackEl.textContent = "✅ Excellent. Very natural professional phrasing.";
        } else {
          feedbackEl.textContent = "❗ Some blanks are not in the best position. Try again (click a blank to clear).";
        }
      }
      updateProgress();
    }

    function reset(){
      drops.forEach(d=>{
        d.textContent = "[" + d.getAttribute("data-blank") + "]";
        d.removeAttribute("data-value");
        d.classList.remove("filled","over");
      });
      if (scoreEl) scoreEl.textContent = "0";
      if (feedbackEl) feedbackEl.textContent = "";
      updateProgress();
    }

    if (checkBtn) checkBtn.addEventListener("click", check);
    if (resetBtn) resetBtn.addEventListener("click", reset);

    return { getScore:()=> Number(scoreEl ? scoreEl.textContent : 0), getTotal:()=>drops.length, reset };
  }

  const dndBlocks = $$("[data-dnd]");
  const dnds = dndBlocks.map(initDnd);

  // -----------------------------
  // Timers (simple countdown)
  // -----------------------------
  const timers = new Map(); // id -> state

  function formatTime(sec){
    const m = Math.floor(sec/60);
    const s = sec % 60;
    return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  }

  function initTimer(id, seconds){
    timers.set(id, { remaining: seconds, total: seconds, interval: null });
    const display = $(`[data-timer="${id}"]`);
    if (display) display.textContent = formatTime(seconds);
  }

  function startTimer(id){
    const state = timers.get(id);
    if (!state || state.interval) return;
    const display = $(`[data-timer="${id}"]`);
    state.interval = setInterval(()=>{
      state.remaining -= 1;
      if (display) display.textContent = formatTime(Math.max(0,state.remaining));
      if (state.remaining <= 0){
        clearInterval(state.interval);
        state.interval = null;
      }
    }, 1000);
  }

  function resetTimer(id){
    const state = timers.get(id);
    if (!state) return;
    if (state.interval){ clearInterval(state.interval); state.interval=null; }
    state.remaining = state.total;
    const display = $(`[data-timer="${id}"]`);
    if (display) display.textContent = formatTime(state.total);
  }

  // Setup listening timers
  initTimer("audA", 45);
  initTimer("audB", 35);

  $$("[data-timer-start]").forEach(btn=>{
    btn.addEventListener("click", ()=> startTimer(btn.getAttribute("data-timer-start")));
  });
  $$("[data-timer-reset]").forEach(btn=>{
    btn.addEventListener("click", ()=> resetTimer(btn.getAttribute("data-timer-reset")));
  });

  // Speaking + writing timers (separate)
  function makeSimpleTimer(displayEl, seconds){
    let remaining = seconds;
    let interval = null;
    function render(){ displayEl.textContent = formatTime(Math.max(0,remaining)); }
    function start(){
      if (interval) return;
      interval = setInterval(()=>{
        remaining -= 1;
        render();
        if (remaining <= 0){
          clearInterval(interval);
          interval = null;
        }
      }, 1000);
    }
    function reset(){
      if (interval){ clearInterval(interval); interval=null; }
      remaining = seconds;
      render();
    }
    render();
    return { start, reset };
  }

  // -----------------------------
  // TTS (listening simulation)
  // -----------------------------
  let currentUtterance = null;

  function speakText(text){
    stopTTS();
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    u.lang = "en-GB";
    currentUtterance = u;
    window.speechSynthesis.speak(u);
  }

  function stopTTS(){
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    currentUtterance = null;
  }

  $$("[data-tts-play]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-tts-play");
      const script = $(`[data-script="${id}"]`);
      if (script) speakText(script.textContent.trim());
    });
  });
  $$("[data-tts-stop]").forEach(btn=> btn.addEventListener("click", stopTTS));

  // -----------------------------
  // Speaking prompts + timers + recording
  // -----------------------------
  const speakScenario = $("#e360SpeakScenario");
  const speakPrompt = $("#e360SpeakPrompt");
  const speakTime = $("#e360SpeakTime");
  const speakStart = $("#e360SpeakStart");
  const speakReset = $("#e360SpeakReset");

  const prodTopic = $("#e360ProdTopic");
  const prodPrompt = $("#e360ProdPrompt");
  const prodTime = $("#e360ProdTime");
  const prodStart = $("#e360ProdStart");
  const prodReset = $("#e360ProdReset");

  if (speakScenario && speakPrompt) speakPrompt.textContent = speakScenario.value;
  if (prodTopic && prodPrompt) prodPrompt.textContent = prodTopic.value;

  if (speakScenario){
    speakScenario.addEventListener("change", ()=> speakPrompt.textContent = speakScenario.value);
  }
  if (prodTopic){
    prodTopic.addEventListener("change", ()=> prodPrompt.textContent = prodTopic.value);
  }

  const speakTimer = speakTime ? makeSimpleTimer(speakTime, 45) : null;
  const prodTimer = prodTime ? makeSimpleTimer(prodTime, 60) : null;

  if (speakStart && speakTimer) speakStart.addEventListener("click", speakTimer.start);
  if (speakReset && speakTimer) speakReset.addEventListener("click", speakTimer.reset);
  if (prodStart && prodTimer) prodStart.addEventListener("click", prodTimer.start);
  if (prodReset && prodTimer) prodReset.addEventListener("click", prodTimer.reset);

  // Recording (optional)
  const recStart = $("#e360RecStart");
  const recStop = $("#e360RecStop");
  const recAudio = $("#e360RecAudio");
  const recDl = $("#e360RecDownload");

  let mediaRecorder = null;
  let recChunks = [];

  async function startRecording(){
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Recording is not supported in this browser.");
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e)=> { if (e.data && e.data.size) recChunks.push(e.data); };
    mediaRecorder.onstop = ()=>{
      const blob = new Blob(recChunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      if (recAudio) recAudio.src = url;
      if (recDl){
        recDl.href = url;
        recDl.style.display = "inline-flex";
      }
      // stop tracks
      stream.getTracks().forEach(t=>t.stop());
    };
    mediaRecorder.start();
  }

  if (recStart && recStop){
    recStart.addEventListener("click", async ()=>{
      try{
        await startRecording();
        recStart.disabled = true;
        recStop.disabled = false;
      } catch(e){
        alert("Microphone permission was not granted.");
      }
    });
    recStop.addEventListener("click", ()=>{
      if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
      recStart.disabled = false;
      recStop.disabled = true;
    });
  }

  // -----------------------------
  // Writing timer + word count + modals
  // -----------------------------
  const writeTime = $("#e360WriteTime");
  const writeStart = $("#e360WriteStart");
  const writeReset = $("#e360WriteReset");
  const writeBox = $("#e360WriteBox");
  const wordCount = $("#e360WordCount");

  const writeChecklistBtn = $("#e360WriteChecklistBtn");
  const writeSampleBtn = $("#e360WriteSampleBtn");
  const writeCopyBtn = $("#e360WriteCopyBtn");

  const modalChecklist = $("#e360WriteChecklist");
  const modalSample = $("#e360WriteSample");

  const writeTimer = (writeTime ? makeSimpleTimer(writeTime, 8*60) : null);

  if (writeStart && writeTimer) writeStart.addEventListener("click", writeTimer.start);
  if (writeReset && writeTimer) writeReset.addEventListener("click", writeTimer.reset);

  function countWords(txt){
    const cleaned = (txt||"").trim();
    if (!cleaned) return 0;
    return cleaned.split(/\s+/).filter(Boolean).length;
  }
  if (writeBox && wordCount){
    writeBox.addEventListener("input", ()=>{
      wordCount.textContent = String(countWords(writeBox.value));
    });
  }

  function openModal(m){
    if (!m) return;
    m.setAttribute("aria-hidden","false");
  }
  function closeModal(m){
    if (!m) return;
    m.setAttribute("aria-hidden","true");
  }
  $$("[data-close]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const modal = btn.closest(".e360-modal");
      if (modal) closeModal(modal);
    });
  });
  [modalChecklist, modalSample].forEach(m=>{
    if (!m) return;
    m.addEventListener("click", (e)=>{
      if (e.target === m) closeModal(m);
    });
  });

  if (writeChecklistBtn) writeChecklistBtn.addEventListener("click", ()=> openModal(modalChecklist));
  if (writeSampleBtn) writeSampleBtn.addEventListener("click", ()=> openModal(modalSample));

  if (writeCopyBtn && writeBox){
    writeCopyBtn.addEventListener("click", async ()=>{
      try{
        await navigator.clipboard.writeText(writeBox.value || "");
        flash(writeCopyBtn, "✅");
      } catch(e){
        // fallback
        writeBox.select();
        document.execCommand("copy");
        flash(writeCopyBtn, "✅");
      }
    });
  }

  // -----------------------------
  // Reset All
  // -----------------------------
  const resetAllBtn = $("#e360ResetAll");
  if (resetAllBtn){
    resetAllBtn.addEventListener("click", ()=>{
      // stop audio/tts
      stopTTS();
      // reset timers
      resetTimer("audA"); resetTimer("audB");
      if (speakTimer) speakTimer.reset();
      if (prodTimer) prodTimer.reset();
      if (writeTimer) writeTimer.reset();
      // reset quizzes
      quizzes.forEach(q=>q.reset());
      grammars.forEach(g=>g.reset());
      dnds.forEach(d=>d.reset());
      // writing box
      if (writeBox) writeBox.value = "";
      if (wordCount) wordCount.textContent = "0";
      // recording
      if (recAudio) recAudio.removeAttribute("src");
      if (recDl) recDl.style.display = "none";
      updateProgress();
      flash(resetAllBtn, "✅");
    });
  }

  // -----------------------------
  // Progress calculation
  // -----------------------------
  const progressFill = $("#e360ProgressFill");
  const progressText = $("#e360ProgressText");

  function updateProgress(){
    // MCQ quizzes: count answered items
    let answered = 0;
    let total = 0;

    // MCQ
    quizBlocks.forEach(block=>{
      $$(".e360-q", block).forEach(q=>{
        total += 1;
        if (q.getAttribute("data-answered")==="1") answered += 1;
      });
    });

    // Grammar checked
    grammarSets.forEach(set=>{
      $$(".e360-g", set).forEach(it=>{
        total += 1;
        if (it.getAttribute("data-checked")==="1") answered += 1;
      });
    });

    // DnD blanks filled (counts as 1 task total)
    dndBlocks.forEach(dnd=>{
      total += 1;
      const blanks = $$(".drop", dnd);
      const filled = blanks.filter(b=>b.getAttribute("data-value")).length;
      if (filled === blanks.length) answered += 1;
    });

    const pct = total ? Math.round((answered/total)*100) : 0;
    if (progressFill) progressFill.style.width = pct + "%";
    if (progressText) progressText.textContent = pct + "%";
  }

  updateProgress();

  // -----------------------------
  // UI helper: flash button label
  // -----------------------------
  function flash(btn, mark="✅"){
    const original = btn.textContent;
    btn.textContent = mark + " " + original.replace(/^✅\s*/,"");
    setTimeout(()=> btn.textContent = original, 700);
  }
})();