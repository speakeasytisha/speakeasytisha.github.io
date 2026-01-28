/* SpeakEasyTisha — USA Phone Setup — Practice Zone CORE
   Makes section 4 fully functional (polite quiz, matching, fill-in, sentence builder).
   iPad/Safari friendly: tap interactions only.
*/
(function(){
  "use strict";

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const norm = (s) => String(s||"").trim().toLowerCase().replace(/\s+/g," ");
  const shuffle = (arr) => {
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  };

  // ---- score ----
  const STORE_KEY = "se_usa_phone_practice_v1";
  let score = 0, streak = 0;

  function loadScore(){
    try{
      const raw = localStorage.getItem(STORE_KEY);
      if(!raw) return;
      const obj = JSON.parse(raw);
      if(typeof obj.score === "number") score = obj.score;
      if(typeof obj.streak === "number") streak = obj.streak;
    }catch(e){}
  }
  function saveScore(){
    try{ localStorage.setItem(STORE_KEY, JSON.stringify({score, streak})); }catch(e){}
    const saveEl = $("#saveVal");
    if(saveEl) saveEl.textContent = "Saved ✓";
  }
  function renderScore(){
    const s = $("#scoreVal"); if(s) s.textContent = String(score);
    const st = $("#streakVal"); if(st) st.textContent = String(streak);
  }
  function addPoints(ok, pts=1){
    if(ok){ score += pts; streak += 1; }
    else { streak = 0; }
    renderScore(); saveScore();
  }

  function setFeedback(el, ok, html){
    if(!el) return;
    el.classList.remove("ok","bad");
    if(ok === true) el.classList.add("ok");
    if(ok === false) el.classList.add("bad");
    el.innerHTML = html;
  }

  // =========================================================
  // 1) Polite quiz
  // =========================================================
  const politeData = shuffle([
    { prompt:"You are in a US phone store. What is the most polite sentence?",
      options:[
        "Give me a plan with unlimited data.",
        "Can you activate this SIM now?",
        "Could you help me choose a plan that fits my budget?",
        "I want the cheapest. Hurry up."
      ],
      correct:2,
      hint:"Use <strong>Could you…?</strong> for a polite request."
    },
    { prompt:"You want to keep your number when changing carriers. What do you say?",
      options:[
        "I need to port my number. What info do you need?",
        "Delete my number and give me a new one.",
        "My number is stuck. Fix it.",
        "I want to swap my phone number with my friend."
      ],
      correct:0,
      hint:"The key word is <strong>port</strong> (transfer your number)."
    },
    { prompt:"You are not sure your phone is unlocked. What do you ask?",
      options:[
        "Unlock it. Now.",
        "Is my phone compatible and unlocked?",
        "My phone is broken because of you.",
        "I don't care. Just make it work."
      ],
      correct:1,
      hint:"Try a calm question: <strong>Is my phone…?</strong>"
    },
    { prompt:"You want them to repeat slowly. What is best?",
      options:[
        "Say it again!",
        "Could you repeat that more slowly, please?",
        "Repeat. Repeat. Repeat.",
        "I'm lost. Whatever."
      ],
      correct:1,
      hint:"Add <strong>please</strong> + <strong>more slowly</strong>."
    }
  ]);

  let politeIdx = 0;
  let politePicked = null;

  function renderPolite(){
    const host = $("#politeQuiz");
    const fb = $("#politeFeedback");
    if(!host) return;

    host.innerHTML = "";
    politePicked = null;

    const q = politeData[politeIdx % politeData.length];

    const p = document.createElement("div");
    p.style.margin = "8px 0 10px";
    p.style.fontWeight = "850";
    p.textContent = q.prompt;
    host.appendChild(p);

    q.options.forEach((txt, i)=>{
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "matchItem";
      btn.style.width = "100%";
      btn.style.textAlign = "left";
      btn.dataset.idx = String(i);
      btn.textContent = txt;
      btn.addEventListener("click", ()=>{
        $$(".matchItem", host).forEach(b=>b.classList.remove("selected"));
        btn.classList.add("selected");
        politePicked = i;
        setFeedback(fb, null, "Selected: <strong>"+txt.replace(/</g,"&lt;")+"</strong>");
      });
      host.appendChild(btn);
    });

    setFeedback(fb, null, "Pick an answer, then click <strong>Check</strong>.");
    host.style.pointerEvents = "auto";
  }

  function bindPoliteButtons(){
    const check = $("#btnPoliteCheck");
    const hint = $("#btnPoliteHint");
    const reset = $("#btnPoliteReset");
    const fb = $("#politeFeedback");
    if(!check || !hint || !reset) return;

    check.addEventListener("click", ()=>{
      const q = politeData[politeIdx % politeData.length];
      if(politePicked === null){
        setFeedback(fb, false, "Choose an option first.");
        addPoints(false, 0);
        return;
      }
      const ok = (politePicked === q.correct);
      if(ok){
        setFeedback(fb, true, "✅ Correct! Great polite request.");
        addPoints(true, 2);
        politeIdx++;
        setTimeout(renderPolite, 450);
      } else {
        const right = q.options[q.correct];
        setFeedback(fb, false, "❌ Not quite. Best answer: <strong>"+right.replace(/</g,"&lt;")+"</strong>");
        addPoints(false, 0);
      }
    });

    hint.addEventListener("click", ()=>{
      const q = politeData[politeIdx % politeData.length];
      setFeedback(fb, null, "💡 Hint: "+q.hint);
    });

    reset.addEventListener("click", renderPolite);
  }

  // =========================================================
  // 2) Matching
  // =========================================================
  const matchPairsBase = [
    ["prepaid plan", "You pay first. No contract (often)."],
    ["postpaid plan", "You pay after. Often needs ID/credit check."],
    ["unlimited data", "No set data cap (may slow after a threshold)."],
    ["hotspot", "Share your phone's internet with other devices."],
    ["eSIM", "A digital SIM installed in the phone."],
    ["porting", "Transfer your number to a new provider."]
  ];

  let matchState = { selectedTerm:null, selectedDef:null, solved:new Set() };
  let matchPairs = [];

  function renderMatch(){
    const termsEl = $("#matchTerms");
    const defsEl = $("#matchDefs");
    const fb = $("#matchFeedback");
    if(!termsEl || !defsEl) return;

    matchPairs = shuffle(matchPairsBase).slice(0, 5);
    const terms = shuffle(matchPairs.map(p=>p[0]));
    const defs  = shuffle(matchPairs.map(p=>p[1]));

    matchState = { selectedTerm:null, selectedDef:null, solved:new Set() };

    termsEl.innerHTML = "";
    defsEl.innerHTML = "";
    setFeedback(fb, null, "Tap a <strong>term</strong>, then tap its <strong>meaning</strong>.");

    function tryMatch(){
      const t = matchState.selectedTerm;
      const d = matchState.selectedDef;
      if(!t || !d) return;

      const ok = matchPairs.some(p=>p[0]===t && p[1]===d);

      const tEl = $$(".matchItem", termsEl).find(x=>x.textContent===t);
      const dEl = $$(".matchItem", defsEl).find(x=>x.textContent===d);

      if(ok){
        if(tEl){ tEl.classList.add("matched"); tEl.classList.remove("selected"); }
        if(dEl){ dEl.classList.add("matched"); dEl.classList.remove("selected"); }
        matchState.solved.add("T:"+t);
        matchState.solved.add("D:"+d);
        matchState.selectedTerm = null;
        matchState.selectedDef = null;

        setFeedback(fb, true, "✅ Match!");
        addPoints(true, 1);

        if(matchState.solved.size === matchPairs.length*2){
          setFeedback(fb, true, "🎉 All matched! Click <strong>Reset</strong> for a new set.");
        }
      } else {
        if(tEl) tEl.classList.add("wrong");
        if(dEl) dEl.classList.add("wrong");
        setFeedback(fb, false, "❌ Not a match. Try again.");
        addPoints(false, 0);
        setTimeout(()=>{
          if(tEl) tEl.classList.remove("wrong","selected");
          if(dEl) dEl.classList.remove("wrong","selected");
          matchState.selectedTerm = null;
          matchState.selectedDef = null;
        }, 450);
      }
    }

    terms.forEach(t=>{
      const div = document.createElement("div");
      div.className = "matchItem";
      div.textContent = t;
      div.addEventListener("click", ()=>{
        if(matchState.solved.has("T:"+t)) return;
        $$(".matchItem", termsEl).forEach(x=>x.classList.remove("selected"));
        div.classList.add("selected");
        matchState.selectedTerm = t;
        tryMatch();
      });
      termsEl.appendChild(div);
    });

    defs.forEach(d=>{
      const div = document.createElement("div");
      div.className = "matchItem";
      div.textContent = d;
      div.addEventListener("click", ()=>{
        if(matchState.solved.has("D:"+d)) return;
        $$(".matchItem", defsEl).forEach(x=>x.classList.remove("selected"));
        div.classList.add("selected");
        matchState.selectedDef = d;
        tryMatch();
      });
      defsEl.appendChild(div);
    });
  }

  function bindMatchButtons(){
    const hint = $("#btnMatchHint");
    const reset = $("#btnMatchReset");
    const fb = $("#matchFeedback");
    const termsEl = $("#matchTerms");
    const defsEl = $("#matchDefs");
    if(!hint || !reset) return;

    hint.addEventListener("click", ()=>{
      if(!termsEl || !defsEl) return;
      const pair = matchPairs.find(p=>!matchState.solved.has("T:"+p[0]));
      if(!pair){ setFeedback(fb, null, "All matched already ✅"); return; }
      const tEl = $$(".matchItem", termsEl).find(x=>x.textContent===pair[0]);
      const dEl = $$(".matchItem", defsEl).find(x=>x.textContent===pair[1]);
      setFeedback(fb, null, "💡 Hint: look for <strong>"+pair[0].replace(/</g,"&lt;")+"</strong>.");
      if(tEl) tEl.classList.add("selected");
      if(dEl) dEl.classList.add("selected");
      setTimeout(()=>{
        if(tEl && !tEl.classList.contains("matched")) tEl.classList.remove("selected");
        if(dEl && !dEl.classList.contains("matched")) dEl.classList.remove("selected");
      }, 700);
    });

    reset.addEventListener("click", renderMatch);
  }

  // =========================================================
  // 3) Fill-in connectors
  // =========================================================
  const fillData = shuffle([
    { s:"____, choose a plan. ____, activate the SIM. ____, test calls and data.",
      options:["First","Then","After that","Finally"], answers:["First","Then","Finally"] },
    { s:"First, scan the QR code. ____, follow the on-screen steps.",
      options:["Then","Because","Although","Unless"], answers:["Then"] },
    { s:"Keep your old line active ____, you might lose your number during porting.",
      options:["otherwise","therefore","since","despite"], answers:["otherwise"] }
  ]);

  function renderFill(){
    const host = $("#fillIn");
    const fb = $("#fillFeedback");
    if(!host) return;

    host.innerHTML = "";
    setFeedback(fb, null, "Choose an option for each blank, then click <strong>Check</strong>.");

    const items = fillData.slice(0,2);

    items.forEach(item=>{
      const card = document.createElement("div");
      card.className = "task";
      card.style.alignItems = "center";

      const parts = item.s.split("____");
      const wrap = document.createElement("div");
      wrap.className = "task__text";
      wrap.style.width = "100%";

      wrap.appendChild(document.createTextNode(parts[0] || ""));
      for(let b=0;b<parts.length-1;b++){
        const sel = document.createElement("select");
        sel.className = "select";
        sel.style.maxWidth = "220px";
        sel.style.margin = "0 6px";
        sel.dataset.answer = (item.answers[b] || "");
        sel.innerHTML = '<option value="">— choose —</option>' + item.options.map(o=>'<option value="'+o+'">'+o+'</option>').join("");
        wrap.appendChild(sel);
        wrap.appendChild(document.createTextNode(parts[b+1] || ""));
      }

      card.appendChild(wrap);
      host.appendChild(card);
    });

    host.style.pointerEvents = "auto";
  }

  function bindFillButtons(){
    const check = $("#btnFillCheck");
    const hint = $("#btnFillHint");
    const reset = $("#btnFillReset");
    const fb = $("#fillFeedback");
    const host = $("#fillIn");
    if(!check || !hint || !reset || !host) return;

    check.addEventListener("click", ()=>{
      const sels = $$("select.select", host);
      if(!sels.length){ setFeedback(fb, false, "Nothing to check."); return; }

      let okAll = true;
      let anyEmpty = false;

      sels.forEach(sel=>{
        const ans = norm(sel.dataset.answer);
        const val = norm(sel.value);
        if(!val) anyEmpty = true;
        const ok = val && (val === ans);
        sel.style.borderColor = ok ? "rgba(22,163,74,.35)" : (val ? "rgba(220,38,38,.35)" : "");
        if(!ok) okAll = false;
      });

      if(anyEmpty){
        setFeedback(fb, false, "Fill all blanks first.");
        addPoints(false, 0);
        return;
      }

      if(okAll){
        setFeedback(fb, true, "✅ Perfect!");
        addPoints(true, 2);
      } else {
        setFeedback(fb, false, "❌ Not quite. Try again.");
        addPoints(false, 0);
      }
    });

    hint.addEventListener("click", ()=>{
      const sels = $$("select.select", host);
      const firstEmpty = sels.find(s=>!s.value);
      if(!firstEmpty){ setFeedback(fb, null, "No empty blanks left."); return; }
      firstEmpty.value = firstEmpty.dataset.answer || "";
      setFeedback(fb, null, "💡 Filled one blank for you.");
    });

    reset.addEventListener("click", renderFill);
  }

  // =========================================================
  // 4) Sentence builder
  // =========================================================
  const builderData = shuffle([
    { prompt:"Build: “Could you help me transfer my number?”", target:"Could you help me transfer my number?", words:["Could","you","help","me","transfer","my","number?"] },
    { prompt:"Build: “I need a prepaid plan with unlimited data.”", target:"I need a prepaid plan with unlimited data.", words:["I","need","a","prepaid","plan","with","unlimited","data."] },
    { prompt:"Build: “Is my phone unlocked and compatible?”", target:"Is my phone unlocked and compatible?", words:["Is","my","phone","unlocked","and","compatible?"] }
  ]);

  let builderIdx = 0;
  let builderAnswer = [];

  function renderBuilder(){
    const promptEl = $("#builderPrompt");
    const bankEl = $("#builderBank");
    const ansEl = $("#builderAnswer");
    const fb = $("#builderFeedback");
    if(!promptEl || !bankEl || !ansEl) return;

    const item = builderData[builderIdx % builderData.length];
    builderAnswer = [];

    promptEl.textContent = item.prompt;
    bankEl.innerHTML = "";
    ansEl.innerHTML = "";
    setFeedback(fb, null, "Tap words to build the sentence, then click <strong>Check</strong>.");

    const words = shuffle(item.words);
    words.forEach(w=>{
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "word";
      chip.textContent = w;
      chip.dataset.word = w;
      chip.addEventListener("click", ()=>{
        if(chip.classList.contains("used")) return;
        chip.classList.add("used");
        builderAnswer.push(w);
        renderAnswerChips();
      });
      bankEl.appendChild(chip);
    });

    function renderAnswerChips(){
      ansEl.innerHTML = "";
      builderAnswer.forEach((w, i)=>{
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "word inAnswer";
        chip.textContent = w;
        chip.title = "Tap to remove";
        chip.addEventListener("click", ()=>{
          builderAnswer.splice(i, 1);
          const bankWord = $$(".word", bankEl).find(b=>b.dataset.word === w && b.classList.contains("used"));
          if(bankWord) bankWord.classList.remove("used");
          renderAnswerChips();
        });
        ansEl.appendChild(chip);
      });
    }

    bankEl.style.pointerEvents = "auto";
    ansEl.style.pointerEvents = "auto";
  }

  function bindBuilderButtons(){
    const check = $("#btnBuilderCheck");
    const hint = $("#btnBuilderHint");
    const reset = $("#btnBuilderReset");
    const fb = $("#builderFeedback");
    const bankEl = $("#builderBank");
    if(!check || !hint || !reset || !bankEl) return;

    check.addEventListener("click", ()=>{
      const item = builderData[builderIdx % builderData.length];
      const built = builderAnswer.join(" ").replace(/\s+([?.!,])/g, "$1");
      const ok = norm(built) === norm(item.target);
      if(ok){
        setFeedback(fb, true, "✅ Perfect word order!");
        addPoints(true, 2);
        builderIdx++;
        setTimeout(renderBuilder, 500);
      } else {
        setFeedback(fb, false, "❌ Not quite. Try moving one word.");
        addPoints(false, 0);
      }
    });

    hint.addEventListener("click", ()=>{
      const item = builderData[builderIdx % builderData.length];
      const targetWords = item.target.split(" ").map(w=>w.trim()).filter(Boolean);
      const nextWord = targetWords[builderAnswer.length];
      if(!nextWord){ setFeedback(fb, null, "Nothing left to hint."); return; }
      const bankWord = $$(".word", bankEl).find(b=>norm(b.dataset.word) === norm(nextWord) && !b.classList.contains("used"));
      if(bankWord){ bankWord.click(); setFeedback(fb, null, "💡 Added one correct word."); }
      else { setFeedback(fb, null, "💡 Next word is: <strong>"+nextWord.replace(/</g,"&lt;")+"</strong>"); }
    });

    reset.addEventListener("click", renderBuilder);
  }

  // ---- init ----
  function init(){
    const practiceRoot = document.getElementById("practice");
    if(!practiceRoot) return;

    // only run if Practice Zone containers exist
    if(!$("#politeQuiz") || !$("#matchTerms") || !$("#fillIn") || !$("#builderBank")) return;

    practiceRoot.style.pointerEvents = "auto";

    loadScore();
    renderScore();

    renderPolite();
    renderMatch();
    renderFill();
    renderBuilder();

    bindPoliteButtons();
    bindMatchButtons();
    bindFillButtons();
    bindBuilderButtons();

    practiceRoot.dataset.practiceReady = "true";
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(); 
