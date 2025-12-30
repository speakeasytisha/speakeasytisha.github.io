/* Numbers Masterclass (UK/US)
   - Accent chooser (UK/US) with optional voice selection
   - MCQ engine
   - Drag or Tap match/build (mobile-friendly)
   - Dictation generators (years / phone / percent)
   - Pub dialogue builder + email builder
   - Speaking practice recording (MediaRecorder)
   - Final timed quiz
*/

(function(){
  "use strict";

  // ---------------------------
  // Header/footer includes
  // ---------------------------
  async function includeFragments(){
    const includes = document.querySelectorAll("[data-include]");
    for (const el of includes){
      const url = el.getAttribute("data-include");
      if (!url) continue;

      const candidates = [url];
      // fallback filenames (in case you renamed)
      if (url.endsWith("header.html")) candidates.push("./header.fixed.html");
      if (url.endsWith("footer.html")) candidates.push("./footer.fixed.html");

      let html = null;
      for (const u of candidates){
        try{
          const res = await fetch(u, {cache: "no-cache"});
          if (res.ok){
            html = await res.text();
            break;
          }
        }catch(_e){}
      }
      if (html !== null) el.innerHTML = html;
    }
  }

  
// ---------------------------
// Speech synthesis (British / American)
// ---------------------------
const synth = ("speechSynthesis" in window) ? window.speechSynthesis : null;

function stopSpeech(){
  if (!synth) return;
  try { synth.cancel(); } catch (e) {}
  state.speaking = false;
  if (ui.testVoice) ui.testVoice.textContent = "▶️ Test voice";
}

function canSpeak(){
  return !!(synth && ("SpeechSynthesisUtterance" in window));
}

function getVoicesSafe(){
  if (!synth) return [];
  try { return synth.getVoices() || []; } catch (e) { return []; }
}

function norm(s){ return String(s || "").toLowerCase(); }

function pickVoiceFor(lang, preferredURI){
  const voices = getVoicesSafe();
  if (!voices.length) return null;

  const want = norm(lang);
  const base = want.includes("-") ? want.split("-")[0] : want;
  const pref = norm(preferredURI);

  // 1) Exact / starts-with match (en-us, en-gb)
  let candidates = want ? voices.filter(v => norm(v.lang).startsWith(want)) : [];

  // 2) Base language fallback (en)
  if (!candidates.length && base) {
    candidates = voices.filter(v => norm(v.lang).startsWith(base));
  }

  // 3) Any English
  if (!candidates.length) {
    candidates = voices.filter(v => norm(v.lang).startsWith("en"));
  }

  // 4) Preferred URI/name if user selected one
  if (pref) {
    const byPref = candidates.find(v => norm(v.voiceURI).includes(pref) || norm(v.name).includes(pref));
    if (byPref) return byPref;
  }

  return candidates.find(v => v.default) || candidates[0] || voices[0];
}

function speak(text, opts = {}){
  if (!canSpeak()) return false;

  const t = String(text || "").trim();
  if (!t) return false;

  const utter = new SpeechSynthesisUtterance(t);

  const lang = opts.lang || state.accent || "en-US";
  utter.lang = lang;

  // Slow mode for learners
  const rate = opts.rate ?? (state.slow ? 0.9 : 1);
  const pitch = opts.pitch ?? 1;

  utter.rate = Number.isFinite(+rate) ? +rate : 1;
  utter.pitch = Number.isFinite(+pitch) ? +pitch : 1;

  const voice = pickVoiceFor(lang, opts.voiceURI ?? state.voiceURI);
  if (voice) utter.voice = voice;

  stopSpeech(); // clear queue

  // iOS/Safari sometimes needs a micro-delay after cancel()
  setTimeout(() => {
    try {
      state.speaking = true;
      synth.speak(utter);
      utter.onend = () => {
        state.speaking = false;
        if (ui.testVoice) ui.testVoice.textContent = "▶️ Test voice";
      };
    } catch (e) {
      state.speaking = false;
    }
  }, 0);

  return true;
}

function populateVoiceSelect(){
  if (!ui.voice) return;

  const voices = getVoicesSafe();
  const want = norm(state.accent);
  const base = want.includes("-") ? want.split("-")[0] : want;

  const options = voices
    .filter(v => !want || norm(v.lang).startsWith(want) || (base && norm(v.lang).startsWith(base)))
    .sort((a,b) => String(a.name || "").localeCompare(String(b.name || "")));

  ui.voice.innerHTML =
    '<option value="">Auto voice</option>' +
    options.map(v => `<option value="${v.voiceURI}">${v.name} (${v.lang})</option>`).join("");

  if (state.voiceURI) ui.voice.value = state.voiceURI;
}


    // Restore if still present
    if (current && sorted.some(v => v.voiceURI === current)) sel.value = current;
    else sel.value = state.voiceURI || "";
  }

  // Some browsers load voices asynchronously
  function initVoices(){
    populateVoiceSelect();
    if ("speechSynthesis" in window){
      window.speechSynthesis.onvoiceschanged = () => populateVoiceSelect();
      // also try once after a short tick
      setTimeout(populateVoiceSelect, 350);
      setTimeout(populateVoiceSelect, 900);
    }
  }

  // ---------------------------
  // MCQ engine
  // ---------------------------
  const scoreBuckets = new Map(); // key -> {correct, total}

  function getExplain(q){
    const uk = q.getAttribute("data-explain-uk") || "";
    const us = q.getAttribute("data-explain-us") || "";
    return (state.accent === "en-GB") ? uk : us;
  }

  function markMCQ(q, chosenOpt){
    const correct = (q.getAttribute("data-correct") || "").trim();
    const buttons = qsa("button[data-opt]", q);
    const fb = qs(".nm-feedback", q);
    if (!buttons.length || !fb) return;

    // prevent double scoring
    if (q.dataset.answered === "1") return;
    q.dataset.answered = "1";

    for (const b of buttons){
      b.disabled = true;
      const opt = b.getAttribute("data-opt");
      if (opt === correct) b.classList.add("is-correct");
      if (opt === chosenOpt && opt !== correct) b.classList.add("is-wrong");
    }

    const ok = chosenOpt === correct;
    const explain = getExplain(q);
    fb.classList.remove("good","bad");
    fb.classList.add(ok ? "good" : "bad");
    fb.textContent = ok ? `✅ Correct. ${explain}` : `❌ Not quite. ${explain}`;

    if (state.autoReadFeedback) speak(fb.textContent);

    // bucket scoring (by nearest scorebar target)
    const scoreElId = findClosestScoreId(q);
    if (scoreElId){
      const bucket = scoreBuckets.get(scoreElId);
      if (bucket){
        bucket.total += 0; // already set
        if (ok) bucket.correct += 1;
        updateScore(scoreElId);
      }
    }
  }

  function findClosestScoreId(el){
    // For this page, scorebars reference score-x ids via [data-reset="score-x"]
    const section = el.closest(".nm-card");
    if (!section) return null;
    const reset = qs("[data-reset]", section);
    if (!reset) return null;
    return reset.getAttribute("data-reset") || null;
  }

  function initMCQs(){
    // Initialize ALL scorebars present on the page (supports multiple sections)
    qsa("[data-reset]").forEach(btn => {
      const scoreId = btn.getAttribute("data-reset");
      if(!scoreId) return;

      const scope = btn.closest(".nm-card") || document;
      const scoreEl = scope.querySelector(`#${scoreId}`) || document.querySelector(`#${scoreId}`);
      const totalEl = scope.querySelector(`#${scoreId}-total`) || document.querySelector(`#${scoreId}-total`);
      if(!scoreEl || !totalEl) return;

      if(!scoreBuckets.has(scoreId)){
        const total = Number((totalEl.textContent || "0").trim()) || 0;
        scoreBuckets.set(scoreId, { correct: 0, total });
        updateScore(scoreId);
      }
    });

    qsa("[data-qtype='mcq']").forEach(qEl => {
      const opts = qsa("button.nm-opt", qEl);
      opts.forEach(btn => btn.addEventListener("click", () => markMCQ(qEl, btn)));
    });

    // Reset buttons (per score bucket)
    qsa("[data-reset]").forEach(btn => {
      btn.addEventListener("click", () => {
        const scoreId = btn.getAttribute("data-reset");
        if(scoreId) resetScore(scoreId);

        // Only reset questions inside the same card/section as the button
        const scope = btn.closest(".nm-card") || document;
        qsa("[data-qtype='mcq']", scope).forEach(qEl => {
          qsa("button.nm-opt", qEl).forEach(b => {
            b.disabled = false;
            b.classList.remove("is-correct","is-wrong");
          });
          const fb = qs(".nm-feedback", qEl);
          if(fb){ fb.textContent = ""; fb.classList.remove("is-ok","is-bad"); }
          qEl.classList.remove("is-answered");
        });
      });
    });
  }

  function initDragOrTap(){
    qsa(".nm-dd").forEach(dd => initDD(dd));
  }

  function initDD(dd){
    const tiles = qsa(".nm-dd-tile", dd);
    tiles.forEach((t) => t.setAttribute("draggable", "true"));
    const slots = qsa(".nm-dd-slot", dd);
    const result = qs(".nm-dd-result", dd);

    let picked = null; // for tap mode

    function clearPicked(){
      if (picked){
        picked.classList.remove("is-picked");
        picked = null;
      }
    }

    function place(tile, slot){
      const value = tile.getAttribute("data-value");
      if (!value) return;
      slot.dataset.placed = value;
      const chip = document.createElement("span");
      chip.className = "nm-dd-placed";
      chip.textContent = tile.textContent;

      // remove existing chip
      const existing = slot.querySelector(".nm-dd-placed");
      if (existing) existing.remove();
      slot.appendChild(chip);

      // visually "used"
      tile.disabled = true;
      tile.setAttribute("aria-disabled", "true");
      tile.style.opacity = "0.55";
      tile.style.cursor = "not-allowed";
      clearPicked();
    }

    // Tap-to-place
    tiles.forEach(t => {
      t.addEventListener("click", () => {
        if (t.disabled) return;
        if (picked === t){
          clearPicked();
          return;
        }
        clearPicked();
        picked = t;
        t.classList.add("is-picked");
      });

      // Desktop drag
      t.addEventListener("dragstart", (e) => {
        if (t.disabled) { e.preventDefault(); return; }
        e.dataTransfer.setData("text/plain", t.getAttribute("data-value") || "");
        e.dataTransfer.setData("text/label", t.textContent || "");
        requestAnimationFrame(() => t.classList.add("is-picked"));
      });
      t.addEventListener("dragend", () => t.classList.remove("is-picked"));
    });

    slots.forEach(s => {
      // Tap place
      s.addEventListener("click", () => {
        if (!picked) return;
        place(picked, s);
      });

      // Drag over
      s.addEventListener("dragover", (e) => { e.preventDefault(); s.classList.add("is-over"); });
      s.addEventListener("dragleave", () => s.classList.remove("is-over"));
      s.addEventListener("drop", (e) => {
        e.preventDefault();
        s.classList.remove("is-over");
        const value = e.dataTransfer.getData("text/plain");
        const label = e.dataTransfer.getData("text/label");
        if (!value) return;

        // find tile by value & label
        const tile = tiles.find(t => (t.getAttribute("data-value") === value) && (t.textContent === label));
        if (tile && !tile.disabled) place(tile, s);
      });
    });

    const checkBtn = dd.querySelector("[data-dd-check]");
    const resetBtn = dd.querySelector("[data-dd-reset]");
    const speakBtn = dd.querySelector("[data-dd-speak]");

    function check(){
      let correct = 0;
      let total = 0;
      slots.forEach(s => {
        total += 1;
        const accept = s.getAttribute("data-accept");
        const placed = s.dataset.placed || "";
        const ok = accept && placed === accept;
        if (ok) correct += 1;

        // lightweight visual
        s.style.borderStyle = "solid";
        s.style.borderColor = ok ? "rgba(34,197,94,0.85)" : "rgba(239,68,68,0.85)";
      });

      if (result){
        result.textContent = (correct === total)
          ? `✅ Perfect! ${correct}/${total}`
          : `🧩 ${correct}/${total} correct — adjust the tiles and try again.`;
      }
      if (state.autoReadFeedback && result) speak(result.textContent);
    }

    function reset(){
      // reset tiles
      tiles.forEach(t => {
        t.disabled = false;
        t.removeAttribute("aria-disabled");
        t.style.opacity = "";
        t.style.cursor = "";
        t.classList.remove("is-picked");
      });
      clearPicked();

      // reset slots
      slots.forEach(s => {
        delete s.dataset.placed;
        const chip = s.querySelector(".nm-dd-placed");
        if (chip) chip.remove();
        s.style.borderStyle = "dashed";
        s.style.borderColor = "";
        s.classList.remove("is-over");
      });

      if (result) result.textContent = "";
    }

    if (checkBtn) checkBtn.addEventListener("click", check);
    if (resetBtn) resetBtn.addEventListener("click", reset);

    if (speakBtn){
      speakBtn.addEventListener("click", () => {
        // build sentence from inline slots
        const words = slots.map(s => (s.dataset.placed ? slotTokenToSpeech(s.dataset.placed) : "")).filter(Boolean);
        if (!words.length) return;
        speak(words.join(" "));
      });
    }

    // helper: convert tokens to more natural speech
    function slotTokenToSpeech(token){
      // e.g., 4th -> fourth
      if (/^\d+th$/.test(token)) return token.replace("4th","fourth");
      if (token === "the") return "the";
      if (token === "of") return "of";
      return token;
    }
  }

  // ---------------------------
  // Dictation engine
  // ---------------------------
  function initDictations(){
    initDict("[data-dict-id=\"dict-beginner\"]", makeBeginnerItems());
    // The HTML identifies dictation blocks with data-dict-id, not id.
    // Example: <div class="nm-dict" data-dict-id="dict-years"> ...
    initDict('[data-dict-id="dict-years"]', makeYearItems());
    initDict('[data-dict-id="dict-phone"]', makePhoneItems());
    initDict('[data-dict-id="dict-percent"]', makePercentItems());
  }

  function initDict(selector, items){
    const root = document.querySelector(selector);
    if (!root) return;

    const listenBtn = root.querySelector(".nm-dict-listen");
    const input = root.querySelector("input");
    const checkBtn = root.querySelector("[data-dict-check]");
    const resetBtn = root.querySelector("[data-dict-reset]");
    const fb = root.querySelector(".nm-feedback");
    const scoreEl = root.querySelector(".nm-dict-score");
    const totalEl = root.querySelector(".nm-dict-total");

    let idx = 0;
    let score = 0;

    if (totalEl) totalEl.textContent = String(items.length);

    function current(){ return items[idx]; }

    function doListen(){
      const it = current();
      if (!it) return;
      speak(it.say);
    }

    function normalize(s){
      return (s || "").toString().trim().replace(/\s+/g,"").replace(/[()\-]/g,"");
    }

    function check(){
      const it = current();
      if (!it) return;

      const user = normalize(input.value);
      const good = normalize(it.answer);

      const ok = user === good;
      if (ok) score += 1;

      if (fb){
        fb.classList.remove("good","bad");
        fb.classList.add(ok ? "good" : "bad");
        fb.textContent = ok ? `✅ Correct: ${it.answer}` : `❌ Expected: ${it.answer}`;
      }
      if (state.autoReadFeedback && fb) speak(fb.textContent);

      idx += 1;
      input.value = "";

      if (scoreEl) scoreEl.textContent = String(score);

      if (idx >= items.length){
        if (listenBtn) listenBtn.disabled = true;
        if (checkBtn) checkBtn.disabled = true;
        if (fb) fb.textContent += " · Done!";
        return;
      }
    }

    function reset(){
      idx = 0;
      score = 0;
      if (scoreEl) scoreEl.textContent = "0";
      if (listenBtn) listenBtn.disabled = false;
      if (checkBtn) checkBtn.disabled = false;
      if (fb) { fb.textContent = ""; fb.classList.remove("good","bad"); }
      input.value = "";
    }

    listenBtn && listenBtn.addEventListener("click", doListen);
    checkBtn && checkBtn.addEventListener("click", check);
    resetBtn && resetBtn.addEventListener("click", reset);

    // enter key
    input && input.addEventListener("keydown", (e) => {
      if (e.key === "Enter"){
        e.preventDefault();
        check();
      }
    });
  }

  function makeBeginnerItems(){
    return [
      { say: "zero", answer: "0" },
      { say: "seven", answer: "7" },
      { say: "twelve", answer: "12" },
      { say: "nineteen", answer: "19" },
      { say: "twenty-one", answer: "21" },
      { say: "thirty", answer: "30" },
      { say: "forty-two", answer: "42" },
      { say: "one hundred", answer: "100" }
    ];
  }

  function makeYearItems(){
    return [
      { say: "twenty sixteen", answer: "2016" },
      { say: "nineteen ninety-eight", answer: "1998" },
      { say: (state.accent === "en-GB" ? "two thousand and five" : "two thousand five"), answer: "2005" },
      { say: "twenty ten", answer: "2010" },
      { say: "twenty twenty-four", answer: "2024" }
    ];
  }

  function makePhoneItems(){
    // Practice digits only (no spaces)
    const uk = { say: "zero two zero, seven nine four six, zero nine five eight", answer: "02079460958" };
    const us = { say: "two one two, five five five, zero one nine nine", answer: "2125550199" };
    const mixed = [
      { say: "zero seven, double five, one two, double nine", answer: "07551299" },
      { say: "one six, double zero, four two", answer: "160042" }
    ];
    return [uk, us, ...mixed];
  }

  function makePercentItems(){
    return [
      { say: "fifteen percent", answer: "15" },
      { say: "twenty five percent", answer: "25" },
      { say: "ten percent", answer: "10" },
      { say: "thirty percent", answer: "30" }
    ];
  }

  // ---------------------------
  // Builders
  // ---------------------------
  function initPubBuilder(){
    const drinks = qs("#pubDrinks");
    const pay = qs("#pubPay");
    const tone = qs("#pubTone");
    const out = qs("#pubOut");
    const gen = qs("#pubGenerate");
    const reset = qs("#pubReset");
    const listen = qs("#pubListen");

    if (!drinks || !pay || !tone || !out || !gen || !reset || !listen) return;

    function selectedMulti(select){
      return Array.from(select.selectedOptions).map(o => o.value);
    }

    function build(){
      const d = selectedMulti(drinks);
      const items = d.length ? d : ["two pints of lager"];
      const line1 = `Hi! Could I have ${joinNice(items)}?`;
      const line2 = pay.value;
      const line3 = tone.value;

      const bartender = `Sure — anything else?`;
      const customer2 = `That's all, ${line3}`;
      const done = `Here you go.`;

      out.value =
`👤 You: ${line1}
🧑‍🍳 Bartender: ${bartender}
👤 You: ${line2}
🧑‍🍳 Bartender: ${done}
👤 You: ${customer2}`;

      out.scrollTop = 0;
    }

    function doReset(){
      Array.from(drinks.options).forEach(o => o.selected = false);
      pay.selectedIndex = 0;
      tone.selectedIndex = 0;
      out.value = "";
    }

    gen.addEventListener("click", build);
    reset.addEventListener("click", doReset);
    listen.addEventListener("click", () => {
      if (!out.value.trim()) build();
      speak(stripEmoji(out.value));
    });
  }

  function initEmailBuilder(){
    const situation = qs("#emSituation");
    const name = qs("#emName");
    const date = qs("#emDate");
    const amount = qs("#emAmount");
    const ref = qs("#emRef");
    const tone = qs("#emTone");
    const out = qs("#emOut");
    const gen = qs("#emGenerate");
    const reset = qs("#emReset");
    const listen = qs("#emListen");
    const copy = qs("#emCopy");

    if (!situation || !name || !date || !amount || !ref || !tone || !out || !gen || !reset || !listen || !copy) return;

    function subjectLine(){
      const s = situation.value;
      if (s === "quote") return "Subject: Request for a quote";
      if (s === "confirm") return "Subject: Schedule confirmation";
      return "Subject: Invoice query";
    }

    function closing(sig){
      return `Kind regards,\n${sig || "—"}`;
    }

    function build(){
      const sig = (name.value || "").trim();
      const dt = (date.value || "").trim() || "[date]";
      const amt = (amount.value || "").trim() || "[amount]";
      const rf = (ref.value || "").trim() || "[reference]";
      const t = tone.value;

      let opener = "Hello,";
      let soften = "Thank you in advance for your help.";
      let firm = "Could you please confirm the next steps and timing?";

      if (t === "warm"){
        opener = "Hello,";
        soften = "Many thanks for your help.";
        firm = "If possible, could you get back to me at your earliest convenience?";
      } else if (t === "firm"){
        opener = "Hello,";
        soften = "Thank you for your attention to this matter.";
        firm = "Could you please confirm this today, if possible?";
      }

      let body = "";
      if (situation.value === "quote"){
        body =
`I’m writing to request a quote for the following service.\n\n• Preferred date: ${dt}\n• Estimated budget: ${amt}\n• Reference (if applicable): ${rf}\n\nCould you please confirm the total price, what is included, and the expected delivery timeline?\n\n${soften}\n${closing(sig)}`;
      } else if (situation.value === "confirm"){
        body =
`I’m writing to confirm our schedule.\n\n• Date: ${dt}\n• Budget / fees: ${amt}\n• Reference: ${rf}\n\nPlease let me know if anything needs to be updated.\n\n${soften}\n${closing(sig)}`;
      } else {
        body =
`I’m writing regarding invoice ${rf}.\n\nAccording to my records, the amount is ${amt}. Could you please confirm the details (dates, line items, and VAT, if applicable) and send an updated breakdown?\n\n${firm}\n${closing(sig)}`;
      }

      out.value = `${subjectLine()}\n\n${opener}\n\n${body}`;
      out.scrollTop = 0;
    }

    function doReset(){
      situation.selectedIndex = 0;
      name.value = "";
      date.value = "";
      amount.value = "";
      ref.value = "";
      tone.selectedIndex = 0;
      out.value = "";
    }

    gen.addEventListener("click", build);
    reset.addEventListener("click", doReset);
    listen.addEventListener("click", () => {
      if (!out.value.trim()) build();
      speak(out.value.replace(/^Subject:.*\n\n/, "").replace(/\n+/g, " "));
    });
    copy.addEventListener("click", async () => {
      try{
        await navigator.clipboard.writeText(out.value);
        copy.textContent = "✅ Copied";
        setTimeout(() => copy.textContent = "📋 Copy", 1100);
      }catch(_e){
        copy.textContent = "Copy failed";
        setTimeout(() => copy.textContent = "📋 Copy", 1100);
      }
    });
  }

  // ---------------------------
  // Recording (speaking practice)
  // ---------------------------
  function initRecording(){
    qsa("[data-speak], .nm-builder, .nm-email").forEach(root => attachRecorders(root));
    attachRecorders(document);
  }

  function attachRecorders(root){
    const startBtns = qsa("[data-rec-start]", root);
    startBtns.forEach(btn => {
      if (btn.dataset.bound === "1") return;
      btn.dataset.bound = "1";

      const container = btn.closest("[data-speak], .nm-builder, .nm-email, .nm-card, .nm-section") || btn.parentElement;
      const stopBtn = qs("[data-rec-stop]", container);
      const audio = qs("[data-rec-audio]", container);
      if (!stopBtn || !audio) return;

      let recorder = null;
      let chunks = [];

      async function start(){
        btn.disabled = true;
        stopBtn.disabled = false;
        chunks = [];

        try{
          const stream = await navigator.mediaDevices.getUserMedia({audio: true});
          recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
          recorder.onstop = () => {
            const blob = new Blob(chunks, {type: "audio/webm"});
            audio.src = URL.createObjectURL(blob);
            // stop tracks
            stream.getTracks().forEach(t => t.stop());
          };
          recorder.start();
        }catch(_e){
          btn.disabled = false;
          stopBtn.disabled = true;
          alert("Microphone access is blocked. Please allow microphone permissions to record.");
        }
      }

      function stop(){
        stopBtn.disabled = true;
        btn.disabled = false;
        if (recorder && recorder.state !== "inactive") recorder.stop();
      }

      btn.addEventListener("click", start);
      stopBtn.addEventListener("click", stop);
    });
  }

  // ---------------------------
  // Final timed quiz
  // ---------------------------
  const FINAL_SECONDS = 6 * 60;
  let finalTimer = null;
  let finalRemaining = FINAL_SECONDS;
  let finalScore = 0;
  let finalAnswered = 0;

  const finalBank = [
    { q: "🇬🇧 UK date order is usually…", a: ["month/day/year","day/month/year","year/month/day"], c: 1, say:"In the UK, date order is usually day, month, year." },
    { q: "£3.50 is most naturally said as… (UK)", a: ["three pounds fifty","three pounds and fifty pence","three point five zero"], c: 0, say:"Three pounds fifty." },
    { q: "“Quarter to eight” means…", a: ["7:45","8:15","7:15"], c: 0, say:"Quarter to eight means seven forty-five." },
    { q: "In phone numbers, 0 can be…", a: ["oh or zero","null only","none"], c: 0, say:"In phone numbers, zero can be oh or zero." },
    { q: "1999 is commonly…", a: ["nineteen ninety-nine","one thousand nine hundred ninety-nine","nineteen hundred ninety-nine"], c: 0, say:"Nineteen ninety-nine." },
    { q: "3.07 is…", a: ["three point zero seven","three comma seven","three and seven"], c: 0, say:"Three point zero seven." },
    { q: "A “round” in a UK pub is…", a: ["one person buys drinks for the group","a circular table","a discount"], c: 0, say:"A round means one person buys drinks for the group." },
    { q: "US style spoken: 04/12 is often…", a: ["April twelfth","the twelfth of April","the fourth of December"], c: 0, say:"April twelfth." },
    { q: "A “service charge” is…", a: ["a fee added to the bill","a train ticket","a discount"], c: 0, say:"A fee added to the bill." },
    { q: "“Two thousand and five” is most associated with…", a: ["UK","US","Australia only"], c: 0, say:"More common in the UK." },
    { q: "In emails, it’s best to…", a: ["use clear formatting for numbers","avoid numbers","write only in capitals"], c: 0, say:"Use clear formatting for numbers." },
    { q: "A “receipt” is…", a: ["proof of payment","a discount coupon","a timetable"], c: 0, say:"Proof of payment." }
  ];

  function initFinalQuiz(){
    const start = qs("#finalStart");
    const reset = qs("#finalReset");
    const qWrap = qs("#finalQs");
    const timeEl = qs("#finalTime");
    const scoreEl = qs("#finalScore");
    const end = qs("#finalEnd");
    const msg = qs("#finalMsg");
    const listen = qs("#finalListen");
    if (!start || !reset || !qWrap || !timeEl || !scoreEl || !end || !msg || !listen) return;

    function fmt(t){
      const m = String(Math.floor(t/60)).padStart(2,"0");
      const s = String(t%60).padStart(2,"0");
      return `${m}:${s}`;
    }

    function render(){
      qWrap.innerHTML = "";
      finalBank.forEach((item, i) => {
        const div = document.createElement("div");
        div.className = "nm-final-q";
        div.innerHTML = `
          <p class="nm-q-text">${i+1}. ${item.q}</p>
          <div class="nm-options">
            ${item.a.map((opt, idx) => `<button type="button" data-i="${i}" data-idx="${idx}">${opt}</button>`).join("")}
          </div>
          <p class="nm-feedback" aria-live="polite"></p>
        `;
        qWrap.appendChild(div);
      });

      qsa(".nm-final-q button[data-i]").forEach(btn => {
        btn.addEventListener("click", () => {
          const i = Number(btn.getAttribute("data-i"));
          const idx = Number(btn.getAttribute("data-idx"));
          const card = btn.closest(".nm-final-q");
          const fb = qs(".nm-feedback", card);
          if (!card || !fb) return;
          if (card.dataset.answered === "1") return;
          card.dataset.answered = "1";

          const item = finalBank[i];
          const ok = idx === item.c;
          if (ok) finalScore += 1;
          finalAnswered += 1;

          const all = qsa("button", card);
          all.forEach(b => b.disabled = true);
          all.forEach(b => {
            const j = Number(b.getAttribute("data-idx"));
            if (j === item.c) b.classList.add("is-correct");
            if (j === idx && !ok) b.classList.add("is-wrong");
          });

          fb.classList.remove("good","bad");
          fb.classList.add(ok ? "good" : "bad");
          fb.textContent = ok ? "✅ Correct." : "❌ Not quite.";
          if (state.autoReadFeedback) speak(item.say);

          scoreEl.textContent = String(finalScore);

          if (finalAnswered >= finalBank.length){
            finish();
          }
        });
      });
    }

    function tick(){
      finalRemaining -= 1;
      timeEl.textContent = fmt(finalRemaining);
      if (finalRemaining <= 0) finish();
    }

    function startQuiz(){
      stopSpeech();
      end.hidden = true;
      finalRemaining = FINAL_SECONDS;
      finalScore = 0;
      finalAnswered = 0;
      scoreEl.textContent = "0";
      timeEl.textContent = fmt(finalRemaining);

      render();

      if (finalTimer) clearInterval(finalTimer);
      finalTimer = setInterval(tick, 1000);
    }

    function finish(){
      if (finalTimer){ clearInterval(finalTimer); finalTimer = null; }
      // Disable remaining unanswered
      qsa(".nm-final-q").forEach(card => {
        qsa("button", card).forEach(b => b.disabled = true);
      });

      const percent = Math.round((finalScore / finalBank.length) * 100);
      const line = percent >= 85
        ? `Excellent! You scored ${finalScore}/12 (${percent}%).`
        : percent >= 65
          ? `Nice work — you scored ${finalScore}/12 (${percent}%).`
          : `Keep going — you scored ${finalScore}/12 (${percent}%).`;

      msg.textContent = line + " Review the sections you missed, then try again.";
      end.hidden = false;

      listen.onclick = () => speak(msg.textContent);
    }

    function resetQuiz(){
      if (finalTimer){ clearInterval(finalTimer); finalTimer = null; }
      finalRemaining = FINAL_SECONDS;
      finalScore = 0;
      finalAnswered = 0;
      scoreEl.textContent = "0";
      timeEl.textContent = "06:00";
      qWrap.innerHTML = "<p class='nm-muted'>Click “Start” to begin.</p>";
      end.hidden = true;
    }

    start.addEventListener("click", startQuiz);
    reset.addEventListener("click", resetQuiz);
    resetQuiz();
  }

  // ---------------------------
  // Helpers
  // ---------------------------
  function joinNice(items){
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0,-1).join(", ")}, and ${items[items.length-1]}`;
  }

  function stripEmoji(s){
    return (s || "").replace(/[👤🧑‍🍳🎓🚆🍺💷💵🪙💳🧾🎁📌👤📅💰🔎🙂✅📋🇬🇧🇺🇸⏱🎯🎉]/g, "").replace(/\s+/g, " ").trim();
  }

  // ---------------------------
  // Bind UI controls
  // ---------------------------
  function initControls(){
    ui.accent = qs("#nmAccent");
    ui.voice = qs("#nmVoice");
    ui.slow = qs("#nmSlow");
    ui.hints = qs("#nmShowHints");
    ui.autoRead = qs("#nmAutoReadFeedback");
    ui.testVoice = qs("#nmTestVoice");
    ui.stopVoice = qs("#nmStopVoice");
    ui.quickTest = qs("#nmQuickTestBtn");

    if (ui.accent){
      ui.accent.addEventListener("change", () => {
        state.accent = ui.accent.value;
        // update dictation items that depend on accent (years)
        initDictations(); // reinit (safe enough, small page)
      });
      state.accent = ui.accent.value;
    }

    if (ui.voice){
      ui.voice.addEventListener("change", () => {
        state.voiceURI = ui.voice.value;
      });
    }

    if (ui.slow){
      ui.slow.addEventListener("change", () => state.slow = ui.slow.checked);
    }

    if (ui.hints){
      ui.hints.addEventListener("change", () => {
        state.showHints = ui.hints.checked;
        qsa("[data-hint]").forEach(h => h.style.display = state.showHints ? "" : "none");
      });
      state.showHints = ui.hints.checked;
    }

    if (ui.autoRead){
      ui.autoRead.addEventListener("change", () => state.autoReadFeedback = ui.autoRead.checked);
      state.autoReadFeedback = ui.autoRead.checked;
    }

    if (ui.testVoice){
      ui.testVoice.addEventListener("click", () => speak("Hello! Let's practice numbers in English. Choose British or American accent."));
    }
    if (ui.stopVoice){
      ui.stopVoice.addEventListener("click", stopSpeech);
    }

    if (ui.quickTest){
      ui.quickTest.addEventListener("click", () => {
        const text = state.accent === "en-GB"
          ? "Quick warm-up. The date is the fourth of July. The price is three pounds fifty."
          : "Quick warm-up. The date is July fourth. The price is three fifty.";
        speak(text);
      });
    }

    // TTS buttons (generic)
    qsa(".nm-tts").forEach(btn => {
      const t = btn.getAttribute("data-tts");
      if (!t) return;
      btn.addEventListener("click", () => speak(t));
    });
  }

  // ---------------------------
  // Init
  // ---------------------------
  function initTTSDataButtons() {
  // Generic "Listen" buttons that carry their text in a data-tts attribute.
  // (Used across multiple sections like discounts, phone numbers, etc.)
  qsa("[data-tts]").forEach((el) => {
    if (el.__nmTtsBound) return;
    el.__nmTtsBound = true;
    el.addEventListener("click", () => {
      const txt = el.getAttribute("data-tts") || "";
      speak(txt);
    });
  });
}

async function init(){
    // Fragments are handled by /js/site-chrome.js

    initControls();
    initVoices();
  initTTSDataButtons();
    initMCQs();
    initDragOrTap();
    initDictations();
    initPubBuilder();
    initEmailBuilder();
    initRecording();
    initFinalQuiz();
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();