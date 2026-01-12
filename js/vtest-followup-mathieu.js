(() => {
  "use strict";

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function shuffle(arr){
    const a = arr.slice();
    for (let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, (c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }

  const Score = (() => {
    const awarded = new Set();
    let score = 0;
    let max = 0;

    function setMax(n){
      max = n;
      $("#scoreMax").textContent = String(n);
      render();
    }
    function render(){ $("#scoreNow").textContent = String(score); }
    function reset(){ awarded.clear(); score = 0; render(); }
    function awardOnce(key, points=1){
      if (awarded.has(key)) return false;
      awarded.add(key);
      score += points;
      render();
      return true;
    }
    function setSectionScore(elNow, elMax, now, mx){
      elNow.textContent = String(now);
      elMax.textContent = String(mx);
    }
    return { setMax, reset, awardOnce, setSectionScore };
  })();

  const Speaker = (() => {
    let accent = "US";
    let voices = [];

    function loadVoices(){
      try{ voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; }
      catch(e){ voices = []; }
    }
    function pickVoice(){
      if (!voices || !voices.length) return null;
      const wanted = accent === "UK" ? ["en-GB","en_GB"] : ["en-US","en_US"];
      const v = voices.find(v => wanted.some(p => (v.lang || "").startsWith(p)));
      return v || voices.find(v => (v.lang||"").startsWith("en")) || voices[0] || null;
    }
    function setAccent(a){
      accent = a === "UK" ? "UK" : "US";
      $("#accentLabel").textContent = accent === "UK" ? "British" : "American";
    }
    function stop(){
      if (!("speechSynthesis" in window)) return;
      try{ speechSynthesis.cancel(); }catch(e){}
    }
    function say(text){
      if (!("speechSynthesis" in window)) { alert("Audio is not supported in this browser."); return; }
      stop();
      loadVoices();
      const u = new SpeechSynthesisUtterance(String(text));
      const v = pickVoice();
      if (v) u.voice = v;
      u.rate = 1.0;
      u.pitch = 1.0;
      u.lang = accent === "UK" ? "en-GB" : "en-US";
      speechSynthesis.speak(u);
    }
    if ("speechSynthesis" in window){
      loadVoices();
      speechSynthesis.onvoiceschanged = () => loadVoices();
    }
    return { setAccent, say, stop };
  })();

  function isTouchDevice(){
    return ("ontouchstart" in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  }

  const vocab = [
    { id:"v1", icon:"📅", word:"scheduled meeting", def:"a meeting planned for a specific time", ex:"We have a scheduled meeting on Tuesday at 10 a.m." },
    { id:"v2", icon:"🔁", word:"reschedule", def:"to change the date or time of an appointment/meeting", ex:"Could we reschedule our meeting to next week?" },
    { id:"v3", icon:"⏳", word:"postpone", def:"to delay something to a later time", ex:"I’d like to postpone the meeting until Friday." },
    { id:"v4", icon:"🕒", word:"availability", def:"the times when someone is free", ex:"Please let me know your availability next week." },
    { id:"v5", icon:"🙏", word:"inconvenience", def:"a problem or extra trouble for someone", ex:"Sorry for the inconvenience." },
    { id:"v6", icon:"📌", word:"follow up on", def:"to contact again to get an update", ex:"I’m writing to follow up on our previous email." },
    { id:"v7", icon:"⚡", word:"urgent issue", def:"a problem that needs attention immediately", ex:"I need to handle an urgent issue before we meet." },
    { id:"v8", icon:"⬆️", word:"escalate", def:"to pass a problem to a higher level/person", ex:"I need to escalate this matter to my manager." },
    { id:"v9", icon:"👔", word:"manager", def:"a person responsible for a team/department", ex:"I’ll discuss this with my manager today." },
    { id:"v10", icon:"✅", word:"confirm", def:"to say something is correct / final", ex:"Could you confirm the new time, please?" },
    { id:"v11", icon:"📨", word:"regarding", def:"about / concerning", ex:"I’m writing regarding our meeting next week." },
    { id:"v12", icon:"🤝", word:"thank you for your understanding", def:"polite sentence when you ask for a change", ex:"Thank you for your understanding." }
  ];

  const grammarQs = [
    { id:"g1", prompt:"Which is the most professional?", options:["Can you change the meeting?","Could we reschedule our meeting to a later date?","Change the meeting please."], answer:1, why:"“Could we reschedule…?” is polite and natural." },
    { id:"g2", prompt:"Choose the best reason (neutral).", options:["I have a complaint.","I need to handle an urgent issue first.","I’m busy."], answer:1, why:"“urgent issue” is neutral and professional." },
    { id:"g3", prompt:"Fix the punctuation:", options:["Could you let me know your availability ?","Could you let me know your availability?","Could you let me know your availability !"], answer:1, why:"No space before ? in English." },
    { id:"g4", prompt:"Choose the best follow-up phrase.", options:["I am writing to follow up regarding our meeting.","I am writing to follow up on our meeting.","I am writing for follow up our meeting."], answer:1, why:"Use “follow up on” (or “regarding”, but not both)." }
  ];

  const readingQs = [
    { id:"r1", prompt:"Why does Mathieu want to postpone the meeting?", options:["He is on holiday.","He wants to address a complaint before the meeting.","He forgot the date."], answer:1, why:"He says he needs to escalate a complaint and address it before the meeting." },
    { id:"r2", prompt:"What does he ask Frank to do?", options:["Send a contract.","Let him know his availability.","Call the manager."], answer:1, why:"He asks for Frank’s availability." },
    { id:"r3", prompt:"Is the tone polite?", options:["Yes, mostly.","No, rude.","Not sure."], answer:0, why:"It is polite and structured." },
    { id:"r4", prompt:"Which small punctuation issue is in the email?", options:["A comma is missing.","Space before the question mark.","No subject line."], answer:1, why:"He writes “availability ?” with a space." }
  ];

  const dictItems = [
    { id:"d1", text:"Let’s meet on Thursday at 3:15.", answer:"3:15", transcript:"Let’s meet on Thursday at 3:15." },
    { id:"d2", text:"Could we move it to January 19?", answer:"19", transcript:"Could we move it to January 19?" },
    { id:"d3", text:"I need 20 minutes before the call.", answer:"20", transcript:"I need 20 minutes before the call." },
    { id:"d4", text:"Please confirm at 10:30.", answer:"10:30", transcript:"Please confirm at 10:30." },
    { id:"d5", text:"I can join at 2 p.m.", answer:"2", transcript:"I can join at 2 p.m." }
  ];

  const ddLines = [
    { id:"l1", text:"Subject: Request to reschedule our meeting" },
    { id:"l2", text:"Dear Frank," },
    { id:"l3", text:"I hope you are doing well." },
    { id:"l4", text:"I’m sorry for the inconvenience, but would it be possible to reschedule our meeting to a later date?" },
    { id:"l5", text:"I need to handle an urgent issue and discuss it with my manager first." },
    { id:"l6", text:"Could you please let me know your availability next week?" },
    { id:"l7", text:"Thank you for your understanding." },
    { id:"l8", text:"Best regards," },
    { id:"l9", text:"Mathieu N. Tandu" }
  ];
  const ddSlotOrder = ["l1","l2","l3","l4","l5","l6","l7","l8","l9"];

  const fillBlanks = [
    { id:"f1", before:"I’m writing ", after:" our scheduled meeting.", options:["regarding","because","for"], correct:"regarding" },
    { id:"f2", before:"I’m sorry for the inconvenience, but ", after:" possible to reschedule?", options:["would it be","is it","can it be"], correct:"would it be" },
    { id:"f3", before:"I need to handle an ", after:" issue before we meet.", options:["urgent","funny","tiny"], correct:"urgent" },
    { id:"f4", before:"Could you please let me know your ", after:" next week?", options:["availability","homework","contract"], correct:"availability" }
  ];

  const sbTargetTokens = ["I’m","writing","to","follow","up","on","our","scheduled","meeting","."];
  const sbBankTokens = shuffle(["writing","meeting","scheduled","follow","up","on","to","I’m","our","."]);

  const speakingPrompts = [
    "You need to reschedule a meeting with a client because you have an urgent issue. Speak politely and propose a new time.",
    "You are late for a call. Apologize and ask if you can start 15 minutes later.",
    "You need to move a meeting to next week. Ask for availability and confirm the new date."
  ];

  function buildMCQ(host, questions, scoreNowEl, scoreMaxEl, prefixKey){
    host.innerHTML = "";
    let now = 0;
    const max = questions.length;
    Score.setSectionScore(scoreNowEl, scoreMaxEl, now, max);

    questions.forEach((q, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "q";
      wrap.innerHTML = `
        <div class="prompt">${idx+1}. ${escapeHtml(q.prompt)}</div>
        <div class="choices"></div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const choices = $(".choices", wrap);
      const fb = $(".feedback", wrap);

      q.options.forEach((opt, oi) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "choiceBtn";
        b.textContent = opt;
        b.addEventListener("click", () => {
          const ok = oi === q.answer;
          fb.classList.remove("hidden","ok","no");
          fb.classList.add(ok ? "ok" : "no");
          fb.textContent = (ok ? "✅ Correct. " : "❌ Not quite. ") + q.why;
          if (ok){
            const got = Score.awardOnce(`${prefixKey}:${q.id}`, 1);
            if (got){
              now += 1;
              Score.setSectionScore(scoreNowEl, scoreMaxEl, now, max);
            }
          }
        });
        choices.appendChild(b);
      });

      host.appendChild(wrap);
    });

    return { reset(){ buildMCQ(host, questions, scoreNowEl, scoreMaxEl, prefixKey); } };
  }

  let currentVocab = vocab.slice();

  function buildFlashcards(){
    const grid = $("#flashGrid");
    grid.innerHTML = "";
    currentVocab.forEach((v) => {
      const card = document.createElement("div");
      card.className = "flash";
      card.innerHTML = `
        <div class="flash__inner" tabindex="0" role="button" aria-label="Flashcard: ${escapeHtml(v.word)}">
          <div class="flash__face flash__front">
            <div class="flash__top">
              <div class="flash__word"><span class="flash__icon">${v.icon}</span> ${escapeHtml(v.word)}</div>
              <button class="flash__btn" type="button" data-say="front">🔊</button>
            </div>
            <div class="muted">Tap to flip</div>
            <div class="flash__btns">
              <button class="flash__btn" type="button" data-flip>Flip</button>
            </div>
          </div>

          <div class="flash__face flash__back">
            <div class="flash__top">
              <div class="flash__word">${escapeHtml(v.word)}</div>
              <button class="flash__btn" type="button" data-say="back">🔊</button>
            </div>
            <div class="flash__def">${escapeHtml(v.def)}</div>
            <div class="flash__ex"><strong>Example:</strong> ${escapeHtml(v.ex)}</div>
            <div class="flash__btns">
              <button class="flash__btn" type="button" data-flip>Flip</button>
            </div>
          </div>
        </div>
      `;

      const inner = $(".flash__inner", card);
      const flipBtns = $$("[data-flip]", card);
      const sayFront = $("[data-say='front']", card);
      const sayBack = $("[data-say='back']", card);

      function toggleFlip(){ card.classList.toggle("is-flipped"); }

      inner.addEventListener("click", (e) => {
        if ((e.target instanceof Element) && e.target.closest("[data-say]")) return;
        if ((e.target instanceof Element) && e.target.closest("[data-flip]")) return;
        toggleFlip();
      });
      inner.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") toggleFlip();
      });
      flipBtns.forEach(b => b.addEventListener("click", (e) => { e.stopPropagation(); toggleFlip(); }));

      sayFront.addEventListener("click", (e) => { e.stopPropagation(); Speaker.say(`${v.word}.`); });
      sayBack.addEventListener("click", (e) => { e.stopPropagation(); Speaker.say(`${v.word}. ${v.def}. Example: ${v.ex}`); });

      grid.appendChild(card);
    });
  }

  // Timed game
  let gameTimer = null;
  let gameTimeLeft = 60;
  let gamePts = 0;
  let currentGameItem = null;

  function gameRender(){
    $("#gameTime").textContent = String(gameTimeLeft);
    $("#gamePts").textContent = String(gamePts);
  }
  function gamePickNext(){
    const item = currentVocab[Math.floor(Math.random()*currentVocab.length)];
    currentGameItem = item;
    $("#gamePrompt").textContent = item.def;

    const pool = shuffle(currentVocab.filter(v => v.id !== item.id)).slice(0,3);
    const options = shuffle([item, ...pool]);

    const host = $("#gameChoices");
    host.innerHTML = "";
    options.forEach(opt => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choiceBtn";
      b.textContent = `${opt.icon} ${opt.word}`;
      b.addEventListener("click", () => gameChoose(opt.id === item.id));
      host.appendChild(b);
    });
    $("#gameFb").classList.add("hidden");
  }
  function gameChoose(ok){
    const fb = $("#gameFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add(ok ? "ok" : "no");
    fb.textContent = ok ? "✅ Great!" : `❌ Correct: ${currentGameItem.icon} ${currentGameItem.word}`;
    if (ok){ gamePts += 1; gameRender(); }
    setTimeout(() => { if (gameTimer) gamePickNext(); }, 450);
  }
  function gameStart(){
    if (gameTimer) return;
    gameTimeLeft = 60;
    gamePts = 0;
    gameRender();
    gamePickNext();
    gameTimer = setInterval(() => {
      gameTimeLeft -= 1;
      gameRender();
      if (gameTimeLeft <= 0) gameStop(true);
    }, 1000);
  }
  function gameStop(finished=false){
    if (!gameTimer) return;
    clearInterval(gameTimer);
    gameTimer = null;
    const fb = $("#gameFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add("ok");
    fb.textContent = finished ? `⏱️ Time! You scored ${gamePts} point(s).` : "Stopped.";
  }
  function gameReset(){
    if (gameTimer) gameStop(false);
    gameTimeLeft = 60; gamePts = 0;
    gameRender();
    $("#gamePrompt").textContent = "Press Start.";
    $("#gameChoices").innerHTML = "";
    $("#gameFb").classList.add("hidden");
  }

  // Dictation
  let dict = null;
  function dictPick(){
    dict = dictItems[Math.floor(Math.random()*dictItems.length)];
    $("#dPrompt").textContent = "Ready. Press Play.";
    $("#dTranscript").textContent = "";
    $("#dInput").value = "";
    $("#dFb").classList.add("hidden");
  }
  function dictPlay(){ if (!dict) dictPick(); $("#dPrompt").textContent = "Listening…"; Speaker.say(dict.text); }
  function dictStop(){ Speaker.stop(); $("#dPrompt").textContent = "Stopped."; }
  function dictCheck(){
    if (!dict) return;
    const val = ($("#dInput").value || "").trim();
    const ok = val === dict.answer;
    const fb = $("#dFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add(ok ? "ok" : "no");
    fb.textContent = ok ? "✅ Correct!" : `❌ Answer: ${dict.answer}`;
    $("#dTranscript").textContent = dict.transcript;
    if (ok && Score.awardOnce(`dict:${dict.id}`, 1)){
      $("#dScore").textContent = String(parseInt($("#dScore").textContent,10)+1);
    }
  }
  function dictReset(){ $("#dScore").textContent = "0"; dictPick(); }

  // Email builder
  let ddSelected = null;

  function ddBuild(){
    $("#ddBank").innerHTML = "";
    $("#ddSlots").innerHTML = "";
    $("#ddFb").classList.add("hidden");
    ddSelected = null;

    const lines = shuffle(ddLines);
    lines.forEach(line => {
      const d = document.createElement("div");
      d.className = "ddItem";
      d.textContent = line.text;
      d.draggable = true;
      d.dataset.id = line.id;

      d.addEventListener("dragstart", (e) => {
        if (e.dataTransfer){
          e.dataTransfer.setData("text/plain", line.id);
          e.dataTransfer.effectAllowed = "move";
        }
      });

      d.addEventListener("click", () => {
        if (ddSelected === line.id){
          ddClearSelection();
          return;
        }
        ddSelected = line.id;
        $$(".ddItem").forEach(x => x.classList.remove("is-selected"));
        d.classList.add("is-selected");
        $$(".ddSlot").forEach(s => s.classList.add("is-target"));
      });

      $("#ddBank").appendChild(d);
    });

    ddSlotOrder.forEach((slotId, idx) => {
      const slot = document.createElement("div");
      slot.className = "ddSlot";
      slot.dataset.pos = String(idx);
      slot.dataset.expect = slotId;
      slot.dataset.value = "";
      slot.innerHTML = `<div class="ddSlot__ph">Slot ${idx+1}</div><div class="ddSlot__text"></div><button class="ddSlot__x" type="button" title="Clear">✕</button>`;

      $(".ddSlot__x", slot).addEventListener("click", (e) => { e.stopPropagation(); clearSlot(slot); });

      slot.addEventListener("dragover", (e) => { e.preventDefault(); slot.classList.add("is-target"); });
      slot.addEventListener("dragleave", () => slot.classList.remove("is-target"));
      slot.addEventListener("drop", (e) => {
        e.preventDefault();
        slot.classList.remove("is-target");
        const id = (e.dataTransfer ? e.dataTransfer.getData("text/plain") : "") || "";
        if (!id) return;
        fillSlot(slot, id);
        ddClearSelection();
      });

      slot.addEventListener("click", () => {
        if (ddSelected){
          fillSlot(slot, ddSelected);
          ddClearSelection();
          return;
        }
        clearSlot(slot);
      });

      $("#ddSlots").appendChild(slot);
    });
  }

  function ddClearSelection(){
    ddSelected = null;
    $$(".ddItem").forEach(x => x.classList.remove("is-selected"));
    $$(".ddSlot").forEach(s => s.classList.remove("is-target"));
  }
  function fillSlot(slot, id){
    const line = ddLines.find(l => l.id === id);
    if (!line) return;
    $(".ddSlot__text", slot).textContent = line.text;
    slot.dataset.value = id;
    $(".ddSlot__ph", slot).style.opacity = "0.25";
  }
  function clearSlot(slot){
    $(".ddSlot__text", slot).textContent = "";
    slot.dataset.value = "";
    $(".ddSlot__ph", slot).style.opacity = "1";
  }
  function ddCheck(){
    const slots = $$(".ddSlot");
    let correct = 0;
    slots.forEach(s => { if ((s.dataset.value||"") === (s.dataset.expect||"")) correct += 1; });

    const fb = $("#ddFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add(correct === slots.length ? "ok" : "no");
    fb.textContent = correct === slots.length
      ? "✅ Perfect email structure!"
      : `❌ ${correct}/${slots.length} correct. Tip: Subject → greeting → context → request → reason → question → thanks → closing → name.`;

    slots.forEach((s, idx) => {
      const ok = (s.dataset.value||"") === (s.dataset.expect||"");
      if (ok) Score.awardOnce(`dd:${idx}`, 1);
    });
    $("#ddScore").textContent = String(correct);
  }

  // Fill blanks
  function fbBuild(){
    const host = $("#fbText");
    host.innerHTML = "";
    $("#fbFb").classList.add("hidden");

    fillBlanks.forEach((b) => {
      const sel = document.createElement("select");
      sel.className = "select";
      sel.dataset.correct = b.correct;
      sel.innerHTML = `<option value="" selected>Choose…</option>` + b.options.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join("");
      host.appendChild(document.createTextNode(b.before));
      host.appendChild(sel);
      host.appendChild(document.createTextNode(b.after + " "));
    });
  }
  function fbCheck(){
    const sels = $$(".select", $("#fbText"));
    let correct = 0;
    sels.forEach((s, idx) => {
      const ok = (s.value||"") === (s.dataset.correct||"");
      if (ok){ correct += 1; Score.awardOnce(`fb:${idx}`, 1); }
    });
    $("#fbScore").textContent = String(correct);
    const fb = $("#fbFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add(correct === sels.length ? "ok" : "no");
    fb.textContent = correct === sels.length ? "✅ Great choices!" : `❌ ${correct}/${sels.length}. Review the most natural polite options.`;
  }
  function fbReset(){ $("#fbScore").textContent = "0"; fbBuild(); $("#fbFb").classList.add("hidden"); }

  // Sentence builder
  let sbSelectedToken = null;

  function sbBuild(){
    sbSelectedToken = null;
    $("#sbFb").classList.add("hidden");
    const line = $("#sbLine");
    const bank = $("#sbBank");
    line.innerHTML = "";
    bank.innerHTML = "";

    sbTargetTokens.forEach((_, idx) => {
      const blank = document.createElement("div");
      blank.className = "blank";
      blank.dataset.pos = String(idx);
      blank.dataset.value = "";
      blank.textContent = "_____";

      blank.addEventListener("dragover", (e) => { e.preventDefault(); blank.classList.add("is-target"); });
      blank.addEventListener("dragleave", () => blank.classList.remove("is-target"));
      blank.addEventListener("drop", (e) => {
        e.preventDefault();
        blank.classList.remove("is-target");
        const token = (e.dataTransfer ? e.dataTransfer.getData("text/plain") : "") || "";
        if (!token) return;
        blank.textContent = token;
        blank.dataset.value = token;
        sbClearSel();
      });

      blank.addEventListener("click", () => {
        if (sbSelectedToken){
          blank.textContent = sbSelectedToken;
          blank.dataset.value = sbSelectedToken;
          sbClearSel();
          return;
        }
        blank.textContent = "_____";
        blank.dataset.value = "";
      });

      line.appendChild(blank);
    });

    sbBankTokens.forEach((t) => {
      const tok = document.createElement("div");
      tok.className = "token";
      tok.textContent = t;
      tok.draggable = true;

      tok.addEventListener("dragstart", (e) => {
        if (e.dataTransfer){
          e.dataTransfer.setData("text/plain", t);
          e.dataTransfer.effectAllowed = "copy";
        }
      });

      tok.addEventListener("click", () => {
        if (sbSelectedToken === t){ sbClearSel(); return; }
        sbSelectedToken = t;
        $$(".token").forEach(x => x.classList.remove("is-selected"));
        tok.classList.add("is-selected");
        $$(".blank").forEach(b => b.classList.add("is-target"));
      });

      bank.appendChild(tok);
    });
  }

  function sbClearSel(){
    sbSelectedToken = null;
    $$(".token").forEach(x => x.classList.remove("is-selected"));
    $$(".blank").forEach(b => b.classList.remove("is-target"));
  }

  function sbCheck(){
    const blanks = $$(".blank", $("#sbLine"));
    const vals = blanks.map(b => (b.dataset.value || "").trim());
    const ok = vals.join("|") === sbTargetTokens.join("|");
    const fb = $("#sbFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add(ok ? "ok" : "no");
    fb.textContent = ok ? "✅ Perfect sentence!" : "❌ Not yet. Tip: “follow up on” is a fixed expression.";
    if (ok) Score.awardOnce("sb:ok", 2);
    $("#sbScore").textContent = ok ? "2" : "0";
  }
  function sbReset(){ $("#sbScore").textContent = "0"; sbBuild(); }

  // Speaking timers
  let prepT = null;
  let speakT = null;
  let prepLeft = 15;
  let speakLeft = 60;

  function spPick(){ $("#spPrompt").textContent = speakingPrompts[Math.floor(Math.random()*speakingPrompts.length)]; }
  function spRender(){ $("#prepNow").textContent = String(prepLeft); $("#speakNow").textContent = String(speakLeft); }
  function spReset(){
    if (prepT) clearInterval(prepT);
    if (speakT) clearInterval(speakT);
    prepT = null; speakT = null;
    prepLeft = 15; speakLeft = 60;
    spRender();
    $("#spFb").classList.add("hidden");
  }
  function spStart(){
    spReset();
    const fb = $("#spFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add("ok");
    fb.textContent = "✅ Prep time started. Think of your structure.";
    prepT = setInterval(() => {
      prepLeft -= 1;
      spRender();
      if (prepLeft <= 0){
        clearInterval(prepT);
        prepT = null;
        fb.textContent = "🗣️ Speaking time! Start talking.";
        speakT = setInterval(() => {
          speakLeft -= 1;
          spRender();
          if (speakLeft <= 0){
            clearInterval(speakT);
            speakT = null;
            fb.textContent = "⏱️ Stop. Repeat once, improving clarity.";
            Score.awardOnce("speaking:done", 1);
          }
        }, 1000);
      }
    }, 1000);
  }

  // Recording (safe)
  let mediaRecorder = null;
  let recChunks = [];
  let recStream = null;
  let recMime = "";

  async function recStart(){
    const fb = $("#recFb");
    fb.classList.add("hidden");
    fb.classList.remove("ok","no");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      fb.classList.remove("hidden");
      fb.classList.add("no");
      fb.textContent = "Recording is not supported in this browser/device.";
      return;
    }
    if (!("MediaRecorder" in window)){
      fb.classList.remove("hidden");
      fb.classList.add("no");
      fb.textContent = "Recording is not supported here. Practise speaking without recording.";
      return;
    }

    try{
      recStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }catch(e){
      fb.classList.remove("hidden");
      fb.classList.add("no");
      fb.textContent = "Microphone access was not granted.";
      return;
    }

    recMime = "";
    const tryTypes = ["audio/webm;codecs=opus","audio/webm","audio/mp4","audio/aac"];
    if (typeof MediaRecorder.isTypeSupported === "function"){
      for (const t of tryTypes){
        if (MediaRecorder.isTypeSupported(t)){ recMime = t; break; }
      }
    }

    try{
      mediaRecorder = recMime ? new MediaRecorder(recStream, { mimeType: recMime }) : new MediaRecorder(recStream);
    }catch(e){
      fb.classList.remove("hidden");
      fb.classList.add("no");
      fb.textContent = "Recording is not supported on this browser (MediaRecorder).";
      recStream.getTracks().forEach(t => t.stop());
      recStream = null;
      return;
    }

    recChunks = [];
    mediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size) recChunks.push(e.data); };
    mediaRecorder.onstop = () => {
      const type = recMime || "audio/webm";
      const blob = new Blob(recChunks, { type });
      const url = URL.createObjectURL(blob);
      const audio = $("#recAudio");
      audio.src = url;
      audio.classList.remove("hidden");
      const dl = $("#recDl");
      dl.href = url;
      dl.download = (type.includes("mp4") || type.includes("aac")) ? "speaking-practice.m4a" : "speaking-practice.webm";
      dl.classList.remove("hidden");
      Score.awardOnce("recording:done", 1);
    };

    mediaRecorder.start();
    fb.classList.remove("hidden");
    fb.classList.add("ok");
    fb.textContent = "✅ Recording…";
  }

  function recStop(){
    if (mediaRecorder && mediaRecorder.state !== "inactive"){
      mediaRecorder.stop();
    }
    if (recStream){
      recStream.getTracks().forEach(t => t.stop());
      recStream = null;
    }
  }

  function recClear(){
    recStop();
    $("#recAudio").classList.add("hidden");
    $("#recDl").classList.add("hidden");
    $("#recAudio").src = "";
    $("#recDl").removeAttribute("href");
    $("#recFb").classList.add("hidden");
  }

  // Writing
  function wReset(){
    $("#wText").value = "";
    $("#wFb").classList.add("hidden");
    const items = ["cApology","cRequest","cReason","cAvail","cClose"];
    items.forEach(id => {
      const el = $("#"+id);
      const label = el.textContent.replace(/^⬜\s*|^✅\s*/,"");
      el.textContent = "⬜ " + label;
    });
  }
  function wListen(){
    const t = ($("#wText").value || "").trim();
    if (!t){ alert("Write something first."); return; }
    Speaker.say(t);
  }
  function wCheck(){
    const t = ($("#wText").value || "").toLowerCase();
    const fb = $("#wFb");
    fb.classList.remove("hidden","ok","no");

    const hasApology = /(sorry|apolog)/.test(t);
    const hasRequest = /(reschedul|postpon|move.*meeting|change.*meeting)/.test(t);
    const hasReason  = /(because|need to|due to|urgent|issue|matter)/.test(t);
    const hasAvail   = /(availability|available|next week|tomorrow|monday|tuesday|wednesday|thursday|friday|\d{1,2}:\d{2})/.test(t);
    const hasClose   = /(best regards|kind regards|sincerely|thank you)/.test(t);

    const checks = [
      ["cApology", hasApology],
      ["cRequest", hasRequest],
      ["cReason", hasReason],
      ["cAvail", hasAvail],
      ["cClose", hasClose]
    ];
    let okCount = 0;
    checks.forEach(([id, ok]) => {
      const el = $("#"+id);
      const label = el.textContent.replace(/^⬜\s*|^✅\s*/,"");
      el.textContent = (ok ? "✅ " : "⬜ ") + label;
      if (ok) okCount += 1;
    });

    fb.classList.add(okCount >= 4 ? "ok" : "no");
    fb.textContent = okCount >= 4 ? "✅ Good! Improve clarity + keep it short." : "❌ Add the missing elements from the checklist.";
    if (okCount >= 4) Score.awardOnce("writing:check", 2);
  }

  function init(){
    if (isTouchDevice()){
      $("#ipadBox").classList.remove("hidden");
    }

    Speaker.setAccent("US");
    $("#accentUS").addEventListener("click", () => Speaker.setAccent("US"));
    $("#accentUK").addEventListener("click", () => Speaker.setAccent("UK"));
    $("#btnStopAudio").addEventListener("click", () => Speaker.stop());

    // Flashcards
    buildFlashcards();
    $("#fcShuffle").addEventListener("click", () => { currentVocab = shuffle(currentVocab); buildFlashcards(); });
    $("#fcReset").addEventListener("click", () => { currentVocab = vocab.slice(); buildFlashcards(); });

    // Game
    gameRender();
    $("#gameStart").addEventListener("click", gameStart);
    $("#gameStop").addEventListener("click", () => gameStop(false));
    $("#gameReset").addEventListener("click", gameReset);

    // Quizzes
    buildMCQ($("#grammarQuiz"), grammarQs, $("#gScore"), $("#gMax"), "g");
    $("#gReset").addEventListener("click", () => {
      $("#grammarQuiz").innerHTML = "";
      buildMCQ($("#grammarQuiz"), grammarQs, $("#gScore"), $("#gMax"), "g");
      $("#gScore").textContent = "0";
    });

    buildMCQ($("#readingQuiz"), readingQs, $("#rScore"), $("#rMax"), "r");
    $("#rReset").addEventListener("click", () => {
      $("#readingQuiz").innerHTML = "";
      buildMCQ($("#readingQuiz"), readingQs, $("#rScore"), $("#rMax"), "r");
      $("#rScore").textContent = "0";
    });

    $("#readListen").addEventListener("click", () => Speaker.say($("#mathieuEmail").textContent));

    // Dictation
    $("#dScore").textContent = "0";
    $("#dMax").textContent = String(dictItems.length);
    dictPick();
    $("#dPlay").addEventListener("click", dictPlay);
    $("#dStop").addEventListener("click", dictStop);
    $("#dNew").addEventListener("click", dictPick);
    $("#dCheck").addEventListener("click", dictCheck);
    $("#dReset").addEventListener("click", dictReset);

    // Email builder
    $("#ddScore").textContent = "0";
    $("#ddMax").textContent = String(ddSlotOrder.length);
    ddBuild();
    $("#ddReset").addEventListener("click", () => { $("#ddScore").textContent = "0"; ddBuild(); });
    $("#ddCheck").addEventListener("click", ddCheck);

    // Fill blanks
    $("#fbScore").textContent = "0";
    $("#fbMax").textContent = String(fillBlanks.length);
    fbBuild();
    $("#fbReset").addEventListener("click", fbReset);
    $("#fbCheck").addEventListener("click", fbCheck);

    // Sentence builder
    $("#sbScore").textContent = "0";
    $("#sbMax").textContent = "2";
    sbBuild();
    $("#sbReset").addEventListener("click", sbReset);
    $("#sbCheck").addEventListener("click", sbCheck);

    // Speaking
    spPick();
    spRender();
    $("#spStart").addEventListener("click", spStart);
    $("#spNew").addEventListener("click", () => { spPick(); spReset(); });
    $("#spReset").addEventListener("click", spReset);

    // Recording
    $("#recStart").addEventListener("click", recStart);
    $("#recStop").addEventListener("click", recStop);
    $("#recClear").addEventListener("click", recClear);

    // Writing
    $("#wReset").addEventListener("click", wReset);
    $("#wListen").addEventListener("click", wListen);
    $("#wCheck").addEventListener("click", wCheck);

    // Set global max score: 4 + 4 + 5 + 9 + 4 + 2 + 1 + 1 + 2 = 32
    Score.setMax(32);

    $("#resetAll").addEventListener("click", () => {
      Speaker.stop();
      Score.reset();
      Score.setMax(32);

      currentVocab = vocab.slice();
      buildFlashcards();
      gameReset();

      $("#grammarQuiz").innerHTML = "";
      buildMCQ($("#grammarQuiz"), grammarQs, $("#gScore"), $("#gMax"), "g");
      $("#readingQuiz").innerHTML = "";
      buildMCQ($("#readingQuiz"), readingQs, $("#rScore"), $("#rMax"), "r");

      dictReset();
      ddBuild();
      $("#ddScore").textContent = "0";

      fbReset();
      sbReset();

      spPick();
      spReset();

      recClear();
      wReset();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
