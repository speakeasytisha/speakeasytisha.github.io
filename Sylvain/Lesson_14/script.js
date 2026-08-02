/* ===========================================================
   SPEAK EASY TISHA — Sylvain · VTEST Mock Exam · script.js
   Instant feedback on every exercise (QCM, fill-in, drag & drop)
   =========================================================== */

(function(){
  "use strict";

  /* ---------------- STATE ---------------- */
  const sections = ["0","1","2","3","4","5","6"];
  let currentIndex = 0;
  let examSecondsLeft = 45 * 60;
  let examTimerInterval = null;

  const audioTexts = {
    l1: "Coordinator: Hi Sylvain, quick change for Thursday. Instead of one hundred eighty trays, we now need two hundred forty, the flight's been upgraded to a bigger aircraft. Sylvain: OK, two hundred forty trays, no problem. Same pickup time? Coordinator: Yes, still six thirty in the morning, the van will be at your kitchen. Sylvain: Understood, I'll have it ready.",
    l2: "Agent: So the apartment has three bedrooms, it's near the sea, and it's about ten minutes from the international school. Sylvain: That sounds perfect for my daughters. Is it far from the centre? Agent: Not at all, fifteen minutes by car. Would you like to visit it next week, maybe Tuesday? Sylvain: Yes, Tuesday works well for me.",
    l3: "Hi Sylvain, it's Claire. We loved the meal you cooked for us in June, so we'd like to book you again. It's my husband's birthday, and we're expecting around twenty guests this time. Could you call me back when you have a moment? Thank you!"
  };
  const playsLeft = { l1: 2, l2: 2, l3: 2 };
  const accentChoice = { l1: "en-GB", l2: "en-GB", l3: "en-GB" };
  let availableVoices = [];

  const speakingConfig = {
    s1: { prep: 30, respond: 60 },
    s2: { prep: 30, respond: 90 },
    s3: { prep: 60, respond: 120 }
  };
  const recordings = {};
  let activeStream = null;
  let currentDragChip = null;
  let selectedBankChip = null;

  /* ---------------- INIT ---------------- */
  document.addEventListener("DOMContentLoaded", init);

  function init(){
    loadVoices();
    if ("speechSynthesis" in window){
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    document.getElementById("startExamBtn").addEventListener("click", startExam);
    document.querySelectorAll("[data-next-section]").forEach(btn=>{
      btn.addEventListener("click", ()=> goToIndex(currentIndex+1));
    });
    document.getElementById("finishExamBtn").addEventListener("click", finishExam);
    document.getElementById("restartExamBtn").addEventListener("click", ()=> location.reload());

    setupListening();
    setupWordCounters();
    setupSpeaking();
    setupInstantMcq();
    setupInstantText();
    setupDndBuckets();
    setupWordOrder();
    updateProgress();
  }

  function loadVoices(){
    availableVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }

  /* ---------------- NAVIGATION ---------------- */
  function startExam(){
    startExamTimer();
    goToIndex(1);
  }

  function goToIndex(idx){
    if (idx < 0 || idx >= sections.length) return;
    document.getElementById("section-"+sections[currentIndex]).classList.remove("active");
    currentIndex = idx;
    document.getElementById("section-"+sections[currentIndex]).classList.add("active");
    window.scrollTo({top:0, behavior:"smooth"});
    updateProgress();
  }

  function updateProgress(){
    const pct = Math.round((currentIndex/(sections.length-1))*100);
    document.getElementById("progressFill").style.width = pct + "%";
    document.querySelectorAll(".progress-step").forEach(step=>{
      const stepIdx = parseInt(step.dataset.step,10);
      step.classList.remove("active","done");
      if (stepIdx === currentIndex) step.classList.add("active");
      else if (stepIdx < currentIndex) step.classList.add("done");
    });
  }

  /* ---------------- EXAM TIMER ---------------- */
  function startExamTimer(){
    const el = document.getElementById("examTimer");
    examTimerInterval = setInterval(()=>{
      examSecondsLeft--;
      if (examSecondsLeft <= 0){
        clearInterval(examTimerInterval);
        examSecondsLeft = 0;
        finishExam();
        return;
      }
      const m = Math.floor(examSecondsLeft/60);
      const s = examSecondsLeft%60;
      el.textContent = String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
      el.classList.toggle("low-time", examSecondsLeft <= 300);
    },1000);
  }

  /* ---------------- SHARED FEEDBACK HELPERS ---------------- */
  function flashShake(el){
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
    setTimeout(()=> el.classList.remove("shake"), 500);
  }

  function showFeedbackBadge(block, isCorrect, customText){
    let badge = block.querySelector("[data-feedback]");
    if (!badge){
      badge = block.querySelector(".q-feedback");
    }
    if (!badge){
      badge = document.createElement("span");
      badge.className = "q-feedback";
      const qText = block.querySelector(".q-text");
      if (qText) qText.insertAdjacentElement("afterend", badge);
      else block.appendChild(badge);
    }
    badge.style.display = "inline-flex";
    badge.classList.remove("is-correct","is-incorrect");
    badge.classList.add(isCorrect ? "is-correct" : "is-incorrect");
    badge.textContent = customText || (isCorrect ? "✅ Correct!" : "❌ Try again");
  }

  /* ---------------- INSTANT MCQ (Listening / Reading / Grammar B-C) ---------------- */
  function setupInstantMcq(){
    const selector = '#section-1 [data-question], #section-2 [data-question], #section-3 [data-question][data-type="mcq"]';
    document.querySelectorAll(selector).forEach(block=>{
      block.querySelectorAll('input[type="radio"]').forEach(radio=>{
        radio.addEventListener("change", ()=> gradeMcqBlock(block));
      });
    });
  }

  function gradeMcqBlock(block){
    if (block.dataset.result === "correct") return;
    const checked = block.querySelector('input[type="radio"]:checked');
    if (!checked) return;
    const expected = block.dataset.correct;
    const isCorrect = checked.value === expected;

    block.querySelectorAll(".option").forEach(opt=>{
      const input = opt.querySelector("input");
      opt.classList.remove("wrong-answer","correct-answer");
      if (isCorrect && input.value === expected) opt.classList.add("correct-answer");
      if (!isCorrect && input === checked) opt.classList.add("wrong-answer");
    });

    if (isCorrect){
      block.dataset.result = "correct";
      block.querySelectorAll('input[type="radio"]').forEach(r=> r.disabled = true);
      block.querySelectorAll(".option").forEach(o=> o.classList.add("locked"));
      showFeedbackBadge(block, true);
    } else {
      block.dataset.result = "incorrect";
      const optEl = checked.closest(".option");
      if (optEl) flashShake(optEl);
      showFeedbackBadge(block, false, "❌ Not quite — try another option");
    }
  }

  /* ---------------- INSTANT FILL-IN-THE-BLANK (Grammar A/D/E/F) ---------------- */
  function setupInstantText(){
    document.querySelectorAll('#section-3 [data-question][data-type="text"]').forEach(block=>{
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "check-btn";
      btn.textContent = "Check";
      block.appendChild(btn);
      btn.addEventListener("click", ()=> gradeTextBlock(block));

      block.querySelectorAll("[data-blank]").forEach(inp=>{
        inp.addEventListener("keydown", e=>{
          if (e.key === "Enter"){ e.preventDefault(); gradeTextBlock(block); }
        });
        inp.addEventListener("input", ()=>{
          if (block.dataset.result === "correct") return;
          inp.classList.remove("correct","incorrect");
        });
      });
    });
  }

  function gradeTextBlock(block){
    if (block.dataset.result === "correct") return;
    const inputs = block.querySelectorAll("[data-blank]");
    let allCorrect = true;
    const expectedParts = [];
    inputs.forEach(inp=>{
      const expected = (inp.dataset.correct || "").trim().toLowerCase();
      const given = inp.value.trim().toLowerCase();
      const isRight = given === expected && given !== "";
      expectedParts.push(inp.dataset.correct);
      inp.classList.remove("correct","incorrect");
      if (isRight){
        inp.classList.add("correct");
      } else {
        inp.classList.add("incorrect");
        allCorrect = false;
        flashShake(inp);
      }
    });

    if (allCorrect){
      block.dataset.result = "correct";
      inputs.forEach(inp=> inp.disabled = true);
      const btn = block.querySelector(".check-btn");
      if (btn){ btn.disabled = true; btn.textContent = "✓ Done"; }
      showFeedbackBadge(block, true);
    } else {
      block.dataset.result = "incorrect";
      showFeedbackBadge(block, false, "❌ Not quite — correct answer: \"" + expectedParts.join(" / ") + "\"");
    }
  }

  /* ---------------- WORD COUNTERS ---------------- */
  function setupWordCounters(){
    bindCounter("write1","count1",40);
    bindCounter("write2","count2",150);
  }
  function bindCounter(areaId, countId, min){
    const area = document.getElementById(areaId);
    const count = document.getElementById(countId);
    if (!area || !count) return;
    area.addEventListener("input", ()=>{
      const words = area.value.trim().split(/\s+/).filter(Boolean).length;
      count.textContent = words;
      count.classList.toggle("under", words < min);
      count.classList.toggle("ok", words >= min);
    });
  }

  /* ---------------- LISTENING (TTS) ---------------- */
  function setupListening(){
    document.querySelectorAll("[data-audio-btn]").forEach(btn=>{
      btn.addEventListener("click", ()=> playListening(btn));
    });
    document.querySelectorAll("[data-accent-group]").forEach(group=>{
      const id = group.dataset.accentGroup;
      group.querySelectorAll("button").forEach(b=>{
        b.addEventListener("click", ()=>{
          group.querySelectorAll("button").forEach(x=>x.classList.remove("active"));
          b.classList.add("active");
          accentChoice[id] = b.dataset.accent;
        });
      });
    });
  }

  function playListening(btn){
    const id = btn.dataset.audioId;
    if (playsLeft[id] <= 0) return;
    if (!("speechSynthesis" in window)){
      alert("Your browser does not support audio playback for this exercise. Please try Chrome or Edge.");
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(audioTexts[id]);
    const lang = accentChoice[id] || "en-GB";
    utter.lang = lang;
    utter.rate = 0.92;
    const voice = availableVoices.find(v=>v.lang === lang) ||
                  availableVoices.find(v=>v.lang && v.lang.startsWith(lang.slice(0,2)));
    if (voice) utter.voice = voice;

    btn.classList.add("playing");
    btn.textContent = "❚❚";
    utter.onend = ()=>{
      btn.classList.remove("playing");
      btn.textContent = "▶";
      playsLeft[id]--;
      const counter = document.querySelector(`[data-plays-left="${id}"]`);
      if (counter) counter.textContent = playsLeft[id];
      if (playsLeft[id] <= 0) btn.disabled = true;
    };
    window.speechSynthesis.speak(utter);
  }

  /* ---------------- DRAG & DROP · BUCKET SORT (Grammar G) ---------------- */
  function setupDndBuckets(){
    const chips = document.querySelectorAll('.dnd-chip[data-chip]');
    const buckets = document.querySelectorAll('.dnd-bucket[data-bucket]');

    chips.forEach(chip=>{
      chip.addEventListener("dragstart", ()=>{
        currentDragChip = chip;
        chip.classList.add("dragging");
      });
      chip.addEventListener("dragend", ()=> chip.classList.remove("dragging"));
      chip.addEventListener("click", ()=>{
        if (chip.classList.contains("placed")) return;
        document.querySelectorAll(".dnd-chip.selected").forEach(c=>c.classList.remove("selected"));
        chip.classList.add("selected");
        selectedBankChip = chip;
      });
    });

    buckets.forEach(bucket=>{
      bucket.addEventListener("dragover", e=>{ e.preventDefault(); bucket.classList.add("drag-over"); });
      bucket.addEventListener("dragleave", ()=> bucket.classList.remove("drag-over"));
      bucket.addEventListener("drop", e=>{
        e.preventDefault();
        bucket.classList.remove("drag-over");
        if (currentDragChip){ placeChipInBucket(currentDragChip, bucket); currentDragChip = null; }
      });
      bucket.addEventListener("click", ()=>{
        if (selectedBankChip){ placeChipInBucket(selectedBankChip, bucket); selectedBankChip = null; }
      });
    });
  }

  function placeChipInBucket(chip, bucket){
    if (chip.classList.contains("placed")) return;
    chip.classList.remove("selected");
    const isCorrect = chip.dataset.answer === bucket.dataset.bucket;
    const label = document.createElement("span");
    label.className = "dnd-placed-chip " + (isCorrect ? "is-correct" : "is-incorrect");
    label.textContent = chip.textContent + (isCorrect ? " ✅" : " ❌");
    bucket.querySelector(".bucket-items").appendChild(label);

    if (isCorrect){
      chip.dataset.result = "correct";
      chip.classList.add("placed");
      chip.setAttribute("draggable","false");
    } else {
      flashShake(bucket);
      setTimeout(()=> label.remove(), 900);
    }
  }

  /* ---------------- DRAG & DROP · WORD ORDER (Grammar H) ---------------- */
  function setupWordOrder(){
    document.querySelectorAll("[data-wordorder]").forEach(block=>{
      const answer = block.dataset.answer.split("|");
      const slotsContainer = block.querySelector("[data-slots]");
      const bankContainer = block.querySelector("[data-bank]");
      const shuffled = shuffleArray(answer.slice());

      answer.forEach(()=>{
        const slot = document.createElement("div");
        slot.className = "dnd-slot";
        slot.dataset.filled = "false";
        slot.addEventListener("dragover", e=> e.preventDefault());
        slot.addEventListener("drop", e=>{
          e.preventDefault();
          if (currentDragChip) placeWordInSlot(currentDragChip, slot);
          currentDragChip = null;
        });
        slot.addEventListener("click", ()=>{
          if (block.dataset.result === "correct") return;
          if (slot.dataset.filled === "true") returnWordToBank(slot);
        });
        slotsContainer.appendChild(slot);
      });

      shuffled.forEach(word=>{
        const chip = document.createElement("div");
        chip.className = "dnd-chip";
        chip.draggable = true;
        chip.textContent = word;
        chip.dataset.word = word;
        chip.addEventListener("dragstart", ()=>{ currentDragChip = chip; chip.classList.add("dragging"); });
        chip.addEventListener("dragend", ()=> chip.classList.remove("dragging"));
        chip.addEventListener("click", ()=>{
          if (chip.classList.contains("placed")) return;
          const firstEmpty = Array.from(slotsContainer.children).find(s=> s.dataset.filled !== "true");
          if (firstEmpty) placeWordInSlot(chip, firstEmpty);
        });
        bankContainer.appendChild(chip);
      });

      const checkBtn = block.querySelector("[data-check-order]");
      checkBtn.addEventListener("click", ()=> checkWordOrder(block, answer));
    });
  }

  function placeWordInSlot(chip, slot){
    if (slot.dataset.filled === "true" || chip.classList.contains("placed")) return;
    slot.textContent = chip.textContent;
    slot.dataset.filled = "true";
    slot.dataset.word = chip.dataset.word;
    slot.classList.add("filled");
    slot.classList.remove("is-correct","is-incorrect");
    slot._chipRef = chip;
    chip.classList.add("placed");
    chip.style.display = "none";
  }

  function returnWordToBank(slot){
    const chip = slot._chipRef;
    if (chip){ chip.classList.remove("placed"); chip.style.display = ""; }
    slot.textContent = "";
    slot.dataset.filled = "false";
    slot.classList.remove("filled","is-correct","is-incorrect");
    slot._chipRef = null;
  }

  function checkWordOrder(block, answer){
    const slots = Array.from(block.querySelectorAll("[data-slots] .dnd-slot"));
    const allFilled = slots.every(s=> s.dataset.filled === "true");
    if (!allFilled){
      showFeedbackBadge(block, false, "Fill in all the boxes first");
      return;
    }
    let allCorrect = true;
    slots.forEach((slot,i)=>{
      slot.classList.remove("is-correct","is-incorrect");
      const isRight = slot.dataset.word === answer[i];
      slot.classList.add(isRight ? "is-correct" : "is-incorrect");
      if (!isRight){ allCorrect = false; flashShake(slot); }
    });

    if (allCorrect){
      block.dataset.result = "correct";
      showFeedbackBadge(block, true);
      block.querySelectorAll(".dnd-chip").forEach(c=> c.style.pointerEvents = "none");
      block.querySelectorAll("[data-slots] .dnd-slot").forEach(s=> s.style.pointerEvents = "none");
      const checkBtn = block.querySelector("[data-check-order]");
      if (checkBtn){ checkBtn.disabled = true; checkBtn.textContent = "✓ Done"; }
    } else {
      block.dataset.result = "incorrect";
      showFeedbackBadge(block, false, "❌ Not quite — rearrange the words and check again");
    }
  }

  function shuffleArray(arr){
    for (let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ---------------- SPEAKING / RECORDING ---------------- */
  function setupSpeaking(){
    document.querySelectorAll("[data-rec-btn]").forEach(btn=>{
      btn.addEventListener("click", ()=> beginSpeakingFlow(btn));
    });
    document.querySelectorAll("[data-rec-download]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const card = btn.closest("[data-speak-card]");
        const id = card.querySelector("[data-rec-btn]").dataset.recId;
        const rec = recordings[id];
        if (!rec) return;
        const a = document.createElement("a");
        a.href = rec.url;
        a.download = `sylvain-vtest-${id}.webm`;
        a.click();
      });
    });
    document.querySelectorAll("[data-rec-redo]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const card = btn.closest("[data-speak-card]");
        const recBtn = card.querySelector("[data-rec-btn]");
        const playback = card.querySelector("[data-rec-playback]");
        const controls = card.querySelector("[data-rec-controls]");
        playback.classList.add("hidden");
        controls.classList.add("hidden");
        recBtn.classList.remove("hidden");
        recBtn.disabled = false;
        card.querySelector("[data-rec-status]").textContent = "Tap to begin again.";
      });
    });
  }

  async function beginSpeakingFlow(btn){
    const id = btn.dataset.recId;
    const card = btn.closest("[data-speak-card]");
    const status = card.querySelector("[data-rec-status]");
    const timerRing = card.querySelector("[data-speak-timer]");
    const timerDisplay = timerRing.querySelector("[data-timer-display]");
    const cfg = speakingConfig[id];

    btn.disabled = true;

    try{
      if (!activeStream){
        activeStream = await navigator.mediaDevices.getUserMedia({audio:true});
      }
    }catch(err){
      status.textContent = "Microphone access was not granted. Please allow microphone access to record your answer.";
      btn.disabled = false;
      return;
    }

    let prepLeft = cfg.prep;
    status.textContent = "Preparing your answer...";
    timerDisplay.textContent = "Prep: "+prepLeft+"s";
    timerRing.classList.remove("urgent");
    await countdown(prepLeft, (left)=>{ timerDisplay.textContent = "Prep: "+left+"s"; });

    const chunks = [];
    let recorder;
    try{
      recorder = new MediaRecorder(activeStream);
    }catch(err){
      status.textContent = "Recording is not supported in this browser.";
      btn.disabled = false;
      return;
    }
    recorder.ondataavailable = e=>{ if (e.data.size>0) chunks.push(e.data); };

    let stoppedEarly = false;
    btn.classList.add("recording");
    btn.textContent = "■";
    btn.disabled = false;
    status.textContent = "Recording... tap the button again to stop early.";
    timerRing.classList.add("urgent");

    const stopHandler = ()=>{
      if (!stoppedEarly){
        stoppedEarly = true;
        recorder.stop();
      }
    };
    btn.addEventListener("click", stopHandler, {once:true});

    recorder.start();
    let respLeft = cfg.respond;
    await countdown(respLeft, (left)=>{ timerDisplay.textContent = "Recording: "+left+"s"; }, ()=>stoppedEarly);
    if (!stoppedEarly){
      stoppedEarly = true;
      try{ recorder.stop(); }catch(e){}
    }

    await new Promise(resolve=>{ recorder.onstop = resolve; });

    const blob = new Blob(chunks, {type:"audio/webm"});
    const url = URL.createObjectURL(blob);
    recordings[id] = {blob, url};

    btn.classList.remove("recording");
    btn.classList.add("hidden");
    timerRing.classList.remove("urgent");
    timerDisplay.textContent = "Done";
    status.textContent = "Recording saved. Listen back below, or record again.";

    const playback = card.querySelector("[data-rec-playback]");
    playback.src = url;
    playback.classList.remove("hidden");
    card.querySelector("[data-rec-controls]").classList.remove("hidden");
  }

  function countdown(seconds, onTick, stopCheck){
    return new Promise(resolve=>{
      let left = seconds;
      onTick(left);
      const iv = setInterval(()=>{
        left--;
        if (stopCheck && stopCheck()){
          clearInterval(iv);
          resolve();
          return;
        }
        if (left <= 0){
          clearInterval(iv);
          resolve();
          return;
        }
        onTick(left);
      },1000);
    });
  }

  /* ---------------- FINISH & RESULTS ---------------- */
  function finishExam(){
    if (examTimerInterval) clearInterval(examTimerInterval);
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const listening = tally('#section-1 [data-question]');
    const reading = tally('#section-2 [data-question]');
    const grammarMcqText = tally('#section-3 [data-question]');
    const wordOrder = tally('#section-3 [data-wordorder]');
    const dndChips = tally('#section-3 .dnd-chip[data-chip]');

    const useOfEnglish = {
      correct: grammarMcqText.correct + wordOrder.correct + dndChips.correct,
      total: grammarMcqText.total + wordOrder.total + dndChips.total
    };

    const objectiveCorrect = listening.correct + reading.correct + useOfEnglish.correct;
    const objectiveTotal = listening.total + reading.total + useOfEnglish.total;
    const overallPct = objectiveTotal ? Math.round((objectiveCorrect/objectiveTotal)*100) : 0;

    renderScoreHero(overallPct);
    renderSkillBreakdown(listening, reading, useOfEnglish);
    renderReview("#reviewListening", '#section-1 [data-question]');
    renderReview("#reviewReading", '#section-2 [data-question]');
    renderReview("#reviewGrammar", '#section-3 [data-question], #section-3 [data-wordorder]');
    renderWritingReview();
    renderSpeakingReview();

    goToIndex(6);
  }

  function tally(selector){
    const els = document.querySelectorAll(selector);
    let correct = 0;
    els.forEach(el=>{ if (el.dataset.result === "correct") correct++; });
    return {correct, total: els.length};
  }

  function renderScoreHero(pct){
    const circle = document.getElementById("scoreCircle");
    const circumference = 452;
    const offset = circumference - (pct/100)*circumference;
    circle.style.strokeDashoffset = offset;
    document.getElementById("scorePercent").textContent = pct + "%";

    const msgEl = document.getElementById("scoreMessage");
    let msg;
    if (pct >= 80) msg = "Excellent work — this is a very solid B1.1 performance on the objective sections. Now compare your Writing and Speaking with the model answers you saw in each task.";
    else if (pct >= 65) msg = "Good result — you're on track for B1.1. Look at the review below to see exactly where to focus next.";
    else if (pct >= 50) msg = "A fair result — you're getting there. The review below shows exactly which structures to revise before your real VTEST.";
    else msg = "This is useful information, not a final verdict — the review below will show you precisely what to work on with Tisha before test day.";
    msgEl.textContent = msg;
  }

  function renderSkillBreakdown(listening, reading, useOfEnglish){
    const container = document.getElementById("skillBreakdown");
    const skills = [
      {name:"Listening", res: listening},
      {name:"Reading", res: reading},
      {name:"Use of English", res: useOfEnglish}
    ];
    container.innerHTML = skills.map(s=>{
      const pct = s.res.total ? Math.round((s.res.correct/s.res.total)*100) : 0;
      return `<div class="skill-row">
        <div class="skill-name">${s.name}</div>
        <div class="skill-bar-track"><div class="skill-bar-fill" style="width:${pct}%"></div></div>
        <div class="skill-pct">${s.res.correct}/${s.res.total}</div>
      </div>`;
    }).join("") +
    `<div class="skill-row" style="opacity:.8;">
        <div class="skill-name">Writing</div>
        <div class="skill-bar-track"><div class="skill-bar-fill" style="width:100%; background:var(--gold);"></div></div>
        <div class="skill-pct">Review ↓</div>
      </div>
      <div class="skill-row" style="opacity:.8;">
        <div class="skill-name">Speaking</div>
        <div class="skill-bar-track"><div class="skill-bar-fill" style="width:100%; background:var(--gold);"></div></div>
        <div class="skill-pct">Review ↓</div>
      </div>`;
  }

  function renderReview(containerSelector, itemSelector){
    const container = document.querySelector(containerSelector);
    const blocks = document.querySelectorAll(itemSelector);
    container.innerHTML = Array.from(blocks).map(block=>{
      const isCorrect = block.dataset.result === "correct";
      const cls = isCorrect ? "correct" : "incorrect";
      const icon = isCorrect ? '<span class="fb-icon fb-correct">✅</span>' : '<span class="fb-icon fb-incorrect">❌</span>';
      const qTextEl = block.querySelector(".q-text");
      const questionText = qTextEl ? qTextEl.textContent.replace(/^\d+/,"").trim() : "Exercise";
      return `<div class="review-item ${cls}">
        <div>${icon} ${questionText}</div>
      </div>`;
    }).join("");
  }

  function renderWritingReview(){
    const container = document.getElementById("reviewWriting");
    const w1 = document.getElementById("write1").value.trim();
    const w2 = document.getElementById("write2").value.trim();
    const wc1 = w1 ? w1.split(/\s+/).filter(Boolean).length : 0;
    const wc2 = w2 ? w2.split(/\s+/).filter(Boolean).length : 0;
    container.innerHTML = `
      <div class="review-item ${wc1>=40 ? "correct":"incorrect"}">
        <div><strong>Task 1 — Image description</strong> (${wc1} words, minimum 40)</div>
        <div class="review-answer">${w1 ? escapeHtml(w1) : "<em>No answer written.</em>"}</div>
      </div>
      <div class="review-item ${wc2>=150 ? "correct":"incorrect"}">
        <div><strong>Task 2 — Opinion essay</strong> (${wc2} words, minimum 150)</div>
        <div class="review-answer">${w2 ? escapeHtml(w2) : "<em>No answer written.</em>"}</div>
      </div>
      <p class="small-note">Compare your answers with the B1 model answers shown in Part 4, and go through them together with Tisha at your next session.</p>
    `;
  }

  function renderSpeakingReview(){
    const container = document.getElementById("reviewSpeaking");
    const labels = {s1:"Task 1 — Image description", s2:"Task 2 — Opinion", s3:"Task 3 — Long turn"};
    let html = "";
    ["s1","s2","s3"].forEach(id=>{
      const rec = recordings[id];
      if (rec){
        html += `<div class="review-item correct">
          <div><strong>${labels[id]}</strong> — recorded ✅</div>
          <audio class="playback" controls src="${rec.url}"></audio>
        </div>`;
      } else {
        html += `<div class="review-item incorrect">
          <div><strong>${labels[id]}</strong> — not recorded</div>
        </div>`;
      }
    });
    html += `<p class="small-note">Listen back to your recordings with Tisha and compare your fluency and structure to the model answers shown in each task.</p>`;
    container.innerHTML = html;
  }

  function escapeHtml(str){
    return str.replace(/[&<>"']/g, m=>({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[m]));
  }

})();
