/* Possessives lesson JS
   - Quiz A: click MCQs with hint + explanation
   - Quiz B: select + check with explanation
   - Speech synthesis buttons (safe if unsupported)
   - 2 builders with robust grammar
*/
(function(){
  const root = document;

  // ---------------------------
  // Speech helpers
  // ---------------------------
  let currentUtterance = null;

  function canSpeak(){
    return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
  }
  function stopSpeech(){
    try{
      if (canSpeak()) window.speechSynthesis.cancel();
    }catch(e){}
    currentUtterance = null;
  }
  function speakText(text){
    if (!canSpeak()) return;
    stopSpeech();
    const u = new SpeechSynthesisUtterance(String(text || ""));
    u.rate = 1;
    currentUtterance = u;
    window.speechSynthesis.speak(u);
  }
  function pauseSpeech(){
    try{
      if (canSpeak()) window.speechSynthesis.pause();
    }catch(e){}
  }
  function resumeSpeech(){
    try{
      if (canSpeak()) window.speechSynthesis.resume();
    }catch(e){}
  }

  // hero listen
  const heroListen = root.getElementById("ps-hero-listen");
  const heroStop = root.getElementById("ps-hero-stop");
  const heroStory = root.getElementById("ps-hero-story");
  if (heroListen && heroStory) heroListen.addEventListener("click", ()=> speakText(heroStory.textContent));
  if (heroStop) heroStop.addEventListener("click", stopSpeech);

  // generic speak buttons for dialogues
  root.querySelectorAll("[data-speak]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const sel = btn.getAttribute("data-speak");
      const target = sel ? root.querySelector(sel) : null;
      if (target) speakText(target.textContent);
    });
  });
  root.querySelectorAll("[data-stop]").forEach(btn=> btn.addEventListener("click", stopSpeech));

  // ---------------------------
  // Quiz A: MCQ click
  // ---------------------------
  root.querySelectorAll(".ps-quiz[data-quiz]").forEach(quiz=>{
    const questions = Array.from(quiz.querySelectorAll(".ps-q"));
    const scoreEl = quiz.querySelector("[data-score]");
    const totalEl = quiz.querySelector("[data-total]");
    const finalEl = quiz.querySelector("[data-final]");
    const showBtn = quiz.querySelector("[data-show]");
    const resetBtn = quiz.querySelector("[data-reset]");

    let score = 0;
    const total = questions.length;
    if (totalEl) totalEl.textContent = String(total);
    if (scoreEl) scoreEl.textContent = "0";

    function lock(q){
      q.querySelectorAll(".ps-opt").forEach(b=> b.disabled = true);
      q.setAttribute("data-answered","1");
    }
    function unlock(q){
      q.querySelectorAll(".ps-opt").forEach(b=>{
        b.disabled = false;
      });
      const fb = q.querySelector(".ps-fb");
      if (fb){ fb.textContent = ""; fb.classList.remove("ps-ok","ps-no"); }
      q.removeAttribute("data-answered");
    }
    function setFb(q, ok){
      const fb = q.querySelector(".ps-fb");
      const hint = q.getAttribute("data-hint") || "";
      const explain = q.getAttribute("data-explain") || "";
      if (!fb) return;
      if (ok){
        fb.textContent = "✅ Correct! " + explain;
        fb.classList.add("ps-ok");
        fb.classList.remove("ps-no");
      } else {
        fb.textContent = "❌ Not quite. Hint: " + hint + " · " + explain;
        fb.classList.add("ps-no");
        fb.classList.remove("ps-ok");
      }
    }

    questions.forEach(q=>{
      const correct = (q.getAttribute("data-correct") || "").trim();
      q.querySelectorAll(".ps-opt").forEach(btn=>{
        btn.addEventListener("click", ()=>{
          if (q.getAttribute("data-answered")==="1") return;
          const choice = (btn.getAttribute("data-opt") || "").trim();
          const ok = choice === correct;
          if (ok) score += 1;
          if (scoreEl) scoreEl.textContent = String(score);
          setFb(q, ok);
          lock(q);
        });
      });
    });

    if (showBtn) showBtn.addEventListener("click", ()=>{
      if (!finalEl) return;
      finalEl.textContent = `You got ${score} out of ${total}.`;
    });

    if (resetBtn) resetBtn.addEventListener("click", ()=>{
      score = 0;
      if (scoreEl) scoreEl.textContent = "0";
      if (finalEl) finalEl.textContent = "";
      questions.forEach(unlock);
    });
  });

  // ---------------------------
  // Quiz B: select + check
  // ---------------------------
  root.querySelectorAll(".ps-checklist[data-checklist]").forEach(list=>{
    const items = Array.from(list.querySelectorAll(".ps-check"));
    const scoreEl = list.querySelector("[data-score]");
    const totalEl = list.querySelector("[data-total]");
    const finalEl = list.querySelector("[data-final]");
    const showBtn = list.querySelector("[data-show]");
    const resetBtn = list.querySelector("[data-reset]");

    let score = 0;
    const total = items.length;
    if (totalEl) totalEl.textContent = String(total);
    if (scoreEl) scoreEl.textContent = "0";

    function updateScore(){
      if (scoreEl) scoreEl.textContent = String(score);
    }

    items.forEach(item=>{
      const btn = item.querySelector("[data-check]");
      const select = item.querySelector("select");
      const fb = item.querySelector(".ps-fb");
      const answer = (item.getAttribute("data-answer") || "").trim();
      const explain = (item.getAttribute("data-explain") || "").trim();

      if (!btn || !select) return;

      btn.addEventListener("click", ()=>{
        if (item.getAttribute("data-checked")==="1") return;
        const choice = (select.value || "").trim();
        if (!choice){
          if (fb){
            fb.textContent = "Pick an option first 🙂";
            fb.classList.remove("ps-ok","ps-no");
          }
          return;
        }
        const ok = choice === answer;
        if (fb){
          fb.textContent = ok ? ("✅ Correct! " + explain) : ("❌ Not quite. " + explain);
          fb.classList.toggle("ps-ok", ok);
          fb.classList.toggle("ps-no", !ok);
        }
        item.setAttribute("data-checked","1");
        select.disabled = true;
        btn.disabled = true;
        if (ok) score += 1;
        updateScore();
      });
    });

    if (showBtn) showBtn.addEventListener("click", ()=>{
      if (finalEl) finalEl.textContent = `You got ${score} out of ${total}.`;
    });

    if (resetBtn) resetBtn.addEventListener("click", ()=>{
      score = 0;
      updateScore();
      if (finalEl) finalEl.textContent = "";
      items.forEach(item=>{
        const btn = item.querySelector("[data-check]");
        const select = item.querySelector("select");
        const fb = item.querySelector(".ps-fb");
        item.removeAttribute("data-checked");
        if (select){ select.disabled = false; select.value = ""; }
        if (btn){ btn.disabled = false; }
        if (fb){ fb.textContent = ""; fb.classList.remove("ps-ok","ps-no"); }
      });
    });
  });

  // ---------------------------
  // Builders
  // ---------------------------
  function cleanName(x, fallback){
    const v = String(x || "").trim();
    return v ? v : fallback;
  }

  function friendForms(pron){
    // pron is "she" | "he" | "they"
    if (pron === "he") return { subj:"he", adj:"his", pro:"his" };
    if (pron === "they") return { subj:"they", adj:"their", pro:"theirs" };
    return { subj:"she", adj:"her", pro:"hers" };
  }

  const itemMap = {
    phone: { noun:"phone", emoji:"📱" },
    passport: { noun:"passport", emoji:"🪪" },
    wallet: { noun:"wallet", emoji:"👛" },
    keys: { noun:"keys", emoji:"🔑" },
    backpack: { noun:"backpack", emoji:"🎒" },
    charger: { noun:"charger", emoji:"🔌" }
  };

  // Builder 1
  const b1Form = root.getElementById("ps-b1-form");
  const b1Out = root.getElementById("ps-b1-out");
  const b1Reset = root.getElementById("ps-b1-reset");

  function buildB1(){
    if (!b1Form || !b1Out) return;

    const fd = new FormData(b1Form);
    const you = cleanName(fd.get("you"), "Fabrice");
    const friend = cleanName(fd.get("friend"), "Sarah");
    const pron = String(fd.get("friendPron") || "she");
    const forms = friendForms(pron);

    const itemKey = String(fd.get("item") || "phone");
    const item = itemMap[itemKey] || itemMap.phone;

    const ownerChoice = String(fd.get("owner") || "mine");
    const place = String(fd.get("place") || "on the seat");

    // Decide ownership text
    let ownershipLine = "";
    let followUp = "";
    if (ownerChoice === "mine"){
      ownershipLine = "It’s mine.";
      followUp = `Clerk: Great. Can you unlock it for me?\n${you}: Yes, of course.`;
    } else if (ownerChoice === "my friend's"){
      ownershipLine = `It’s ${friend}’s.`;
      followUp = `Clerk: Okay. Is ${forms.adj} name on it?\n${you}: Yes. It’s ${forms.pro}.`;
    } else { // not mine
      ownershipLine = "It isn’t mine.";
      followUp = `Clerk: Do you know whose it is?\n${you}: Maybe it’s ${friend}’s. It could be ${forms.pro}.`;
    }

    const text =
`Clerk: Excuse me. We found a ${item.noun} ${place}.
Clerk: Whose ${item.noun} is this?
${you}: ${ownershipLine}
${followUp}

Narrator: ${you} checks the ${item.noun} ${item.emoji} and speaks clearly using possessives.`;

    b1Out.value = text;
  }

  if (b1Form) b1Form.addEventListener("submit", (e)=>{ e.preventDefault(); buildB1(); });
  if (b1Reset) b1Reset.addEventListener("click", ()=>{
    b1Form.reset();
    if (b1Out) b1Out.value = "";
    stopSpeech();
  });

  // Builder 1 listen controls
  const b1Listen = root.getElementById("ps-b1-listen");
  const b1Pause = root.getElementById("ps-b1-pause");
  const b1Resume = root.getElementById("ps-b1-resume");
  const b1Stop = root.getElementById("ps-b1-stop");
  if (b1Listen) b1Listen.addEventListener("click", ()=>{ if (b1Out && b1Out.value.trim()) speakText(b1Out.value); });
  if (b1Pause) b1Pause.addEventListener("click", pauseSpeech);
  if (b1Resume) b1Resume.addEventListener("click", resumeSpeech);
  if (b1Stop) b1Stop.addEventListener("click", stopSpeech);

  // Builder 2
  const b2Form = root.getElementById("ps-b2-form");
  const b2Out = root.getElementById("ps-b2-out");
  const b2Reset = root.getElementById("ps-b2-reset");
  const b2Listen = root.getElementById("ps-b2-listen");
  const b2Stop = root.getElementById("ps-b2-stop");

  const packMap = {
    charger: { noun:"charger", emoji:"🔌" },
    passport: { noun:"passport", emoji:"🪪" },
    keys: { noun:"keys", emoji:"🔑" },
    tickets: { noun:"tickets", emoji:"🎫" },
    jacket: { noun:"jacket", emoji:"🧥" },
    phone: { noun:"phone", emoji:"📱" },
    toiletries: { noun:"toiletries", emoji:"🧴" },
    wallet: { noun:"wallet", emoji:"👛" },
    backpack: { noun:"backpack", emoji:"🎒" },
    receipt: { noun:"receipt", emoji:"🧾" }
  };

  function buildB2(){
    if (!b2Form || !b2Out) return;
    const fd = new FormData(b2Form);
    const name = cleanName(fd.get("name"), "Mathieu");
    const withWho = String(fd.get("with") || "alone");
    const i1 = packMap[String(fd.get("i1") || "passport")] || packMap.passport;
    const i2 = packMap[String(fd.get("i2") || "phone")] || packMap.phone;
    const ticketsOwner = String(fd.get("ticketsOwner") || "our");
    const q = String(fd.get("q") || "Are these yours?");

    // Choose natural determiner for ticketsOwner
    const ticketsPhrase = ticketsOwner + " tickets";

    const text =
`${name}: I’m travelling ${withWho} this weekend.
${name}: I packed my ${i1.noun} ${i1.emoji} and my ${i2.noun} ${i2.emoji}.
${name}: I checked ${ticketsPhrase} 🎫 and put them in my bag.
${name}: Final question: “${q}”`;

    b2Out.value = text;
  }

  if (b2Form) b2Form.addEventListener("submit", (e)=>{ e.preventDefault(); buildB2(); });
  if (b2Reset) b2Reset.addEventListener("click", ()=>{
    b2Form.reset();
    if (b2Out) b2Out.value = "";
    stopSpeech();
  });

  if (b2Listen) b2Listen.addEventListener("click", ()=>{ if (b2Out && b2Out.value.trim()) speakText(b2Out.value); });
  if (b2Stop) b2Stop.addEventListener("click", stopSpeech);

})();