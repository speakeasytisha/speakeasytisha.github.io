/* SpeakEasyTisha — Hotel → City Quest (A1+)
   Fully interactive: icons vocab + MCQ + sorting + word order builder + listening + fill blanks
   + essentials picker + dialogues + dictation + some/any + menu reading + order builder + spinner.
   iPad/Mac friendly: drag OR tap alternative. US/UK speech toggle. Instant feedback + hints + score.
*/
(() => {
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));



  function safeEl(sel, root=document){
    try{ return (root || document).querySelector(sel); }catch(e){ return null; }
  }
  function safeOn(sel, evt, handler, root=document){
    const el = safeEl(sel, root);
    if(!el){
      console.warn("safeOn: missing element", sel);
      return;
    }
    el.addEventListener(evt, handler);
  }

  function escapeHtml(s){
    return String(s ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
  function normalize(s){
    return String(s ?? "")
      .replace(/[’']/g,"'")
      .replace(/\s+/g," ")
      .trim()
      .toLowerCase();
  }
  function shuffle(arr){
    const a = (arr || []).slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function attachTap(el, handler){
    if(!el) return;
    const h = (e) => { try{ handler(e); }catch(err){} };
    el.addEventListener('click', h);
    el.addEventListener('pointerup', h);
    el.addEventListener('touchend', h, {passive:true});
  }

  function scrambleBank(bank, avoidSeq){
    const base = (bank || []).slice();
    const avoid = (avoidSeq || []).map(normalize);
    const isBad = (arr) => {
      const a = arr.map(normalize);
      const n = Math.min(a.length, avoid.length);
      let samePrefix = true;
      for(let i=0;i<n;i++){
        if(a[i] !== avoid[i]) { samePrefix = false; break; }
      }
      return samePrefix;
    };
    for(let tries=0; tries<40; tries++){
      const s = shuffle(base);
      if(!isBad(s)) return s;
    }
    return base.reverse();
  }

  // ---------- Speech ----------
  const Speech = {
    mode: "en-US",
    voices: [],
    getVoices(){
      this.voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      return this.voices;
    },
    pickVoice(){
      const voices = this.getVoices();
      const lang = this.mode.toLowerCase();
      let v = voices.find(x => (x.lang||"").toLowerCase() === lang);
      if(!v) v = voices.find(x => (x.lang||"").toLowerCase().startsWith(lang));
      if(!v) v = voices.find(x => (x.lang||"").toLowerCase().startsWith("en"));
      return v || null;
    },
    stop(){ try{ window.speechSynthesis?.cancel(); }catch(e){} },
    pause(){ try{ window.speechSynthesis?.pause(); }catch(e){} },
    resume(){ try{ window.speechSynthesis?.resume(); }catch(e){} },
    say(text){
      if(!window.speechSynthesis) return;
      try{
        if(window.speechSynthesis.speaking || window.speechSynthesis.pending){
          window.speechSynthesis.cancel();
        }
      }catch(e){}
      const u = new SpeechSynthesisUtterance(String(text || ""));
      const v = this.pickVoice();
      if(v) u.voice = v;
      u.lang = this.mode;
      u.rate = 0.98;
      u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    }
  };
  if(window.speechSynthesis){
    window.speechSynthesis.onvoiceschanged = () => Speech.getVoices();
  }

  function setVoice(mode){
    Speech.mode = mode;
    const us = $("#voiceUS"), uk = $("#voiceUK");
    if(mode === "en-US"){
      us.classList.add("is-on"); uk.classList.remove("is-on");
      us.setAttribute("aria-pressed","true"); uk.setAttribute("aria-pressed","false");
    }else{
      uk.classList.add("is-on"); us.classList.remove("is-on");
      uk.setAttribute("aria-pressed","true"); us.setAttribute("aria-pressed","false");
    }
  }

  $("#voiceUS").addEventListener("click", () => setVoice("en-US"));
  $("#voiceUK").addEventListener("click", () => setVoice("en-GB"));
  $("#btnPause").addEventListener("click", () => Speech.pause());
  $("#btnResume").addEventListener("click", () => Speech.resume());
  $("#btnStop").addEventListener("click", () => Speech.stop());

  $("#btnStart").addEventListener("click", () => $("#sec1")?.scrollIntoView({behavior:"smooth"}));
  $("#btnHow").addEventListener("click", () => {
    alert(
      "How it works:\n\n" +
      "• Choose US/UK voice at the top.\n" +
      "• Tap 🔊 to listen.\n" +
      "• Every question gives instant feedback.\n" +
      "• Drag games also work by tap.\n" +
      "• Use Reset if needed."
    );
  });

  // ---------- Score ----------
  const Score = {
    now: 0,
    max: 0,
    awarded: new Set(),
    setMax(n){ this.max = n; updateScore(); updateProgress(); },
    award(key, pts=1){
      if(this.awarded.has(key)) return;
      this.awarded.add(key);
      this.now += pts;
      updateScore(); updateProgress();
    },
    reset(){
      this.now = 0;
      this.awarded.clear();
      updateScore(); updateProgress();
    }
  };

  function updateScore(){
    $("#scoreNow").textContent = String(Score.now);
    $("#scoreMax").textContent = String(Score.max);
  }
  function updateProgress(){
    const pct = Score.max ? Math.round((Score.now / Score.max) * 100) : 0;
    $("#progressBar").style.width = `${Math.max(0, Math.min(100, pct))}%`;
  }

  // ---------- Components ----------
  function makeMCQ(host, questions, awardPrefix){
    host.innerHTML = "";
    const resets = [];

    questions.forEach((q, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "q";
      wrap.innerHTML = `
        <div class="q__prompt">${idx+1}. ${escapeHtml(q.prompt)}</div>
        <div class="smallrow">
          ${q.say ? `<button class="iconbtn" type="button" data-play="1">🔊 Listen</button>` : ""}
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
        </div>
        <div class="choices"></div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const choices = $(".choices", wrap);
      const fb = $(".feedback", wrap);

      if(q.say){
        $("[data-play]", wrap).addEventListener("click", () => Speech.say(q.say));
      }
      $("[data-hint]", wrap).addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML = `💡 <strong>Hint:</strong> ${escapeHtml(q.hint || "")}`;
      });

      q.choices.forEach((c, i) => {
        const row = document.createElement("label");
        row.className = "choice";
        row.innerHTML = `<input type="radio" name="${q.key}" /><div>${escapeHtml(c)}</div>`;
        attachTap(row, () => {
          const ok = i === q.answer;
          fb.classList.remove("hidden","ok","no");
          fb.classList.add(ok ? "ok" : "no");
          fb.innerHTML = ok
            ? `✅ Correct! <span class="muted">${escapeHtml(q.explain || "")}</span>`
            : `❌ Not quite. <strong>Answer:</strong> ${escapeHtml(q.choices[q.answer])}. <span class="muted">${escapeHtml(q.explain || "")}</span>`;
          if(ok) Score.award(`${awardPrefix}:${q.key}`, 1);
        });
        choices.appendChild(row);
      });

      resets.push(() => {
        $$("input[type=radio]", wrap).forEach(x => x.checked = false);
        fb.classList.add("hidden");
      });
      host.appendChild(wrap);
    });

    return { reset(){ resets.forEach(fn => fn()); } };
  }

  function makeToken(text){
    const t = document.createElement("div");
    t.className = "token";
    t.textContent = text;
    t.draggable = true;
    t.addEventListener("dragstart", (ev) => {
      window.__dragToken = t;
      try{
        ev.dataTransfer.setData("text/plain", t.textContent || "");
        ev.dataTransfer.effectAllowed = "move";
      }catch(e){}
    });
    return t;
  }

  function buildWordOrder(host, items, awardPrefix){
    host.innerHTML = "";
    const resets = [];

    function markBankUsed(tok, used){
      if(used){
        tok.classList.add("is-used");
        tok.draggable = false;
      }else{
        tok.classList.remove("is-used");
        tok.draggable = true;
      }
    }

    function attachDnD(tok){
      tok.addEventListener("dragstart", (ev) => {
        window.__dragToken = tok;
        try{
          ev.dataTransfer.setData("text/plain", tok.textContent || "");
          ev.dataTransfer.effectAllowed = "move";
        }catch(e){}
      });
    }

    items.forEach((it, idx) => {
      const block = document.createElement("div");
      block.className = "q";
      block.innerHTML = `
        <div class="q__prompt">${idx+1}. ${escapeHtml(it.title)}</div>
        <div class="smallrow">
          <button class="iconbtn" type="button" data-play="1">🔊 Listen</button>
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
          <button class="btn" type="button" data-check="1">✅ Check</button>
          <button class="btn btn--ghost" type="button" data-clear="1">↺ Clear</button>
        </div>
        <div class="builder">
          <div class="bank" aria-label="Word bank"></div>
          <div class="dropzone" aria-label="Build sentence here"></div>
        </div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;

      const bank = $(".bank", block);
      const zone = $(".dropzone", block);
      const fb = $(".feedback", block);

      const tidToBank = new Map();
      const toks = shuffle(it.tokens).map((txt, iTok) => {
        const t = makeToken(txt);
        t.dataset.role = "bank";
        t.dataset.tid = `${it.key}-t${iTok}`;
        tidToBank.set(t.dataset.tid, t);
        attachDnD(t);
        t.addEventListener("click", () => {
          if(t.classList.contains("is-used")) return;
          const c = t.cloneNode(true);
          c.dataset.role = "zone";
          c.dataset.sourceTid = t.dataset.tid;
          c.classList.remove("is-used","good","bad");
          c.draggable = true;
          attachDnD(c);
          c.addEventListener("click", (e) => {
            e.stopPropagation();
            const sid = c.dataset.sourceTid;
            c.remove();
            markBankUsed(tidToBank.get(sid), false);
          });
          zone.appendChild(c);
          markBankUsed(t, true);
        });
        return t;
      });
      toks.forEach(t => bank.appendChild(t));

      [bank, zone].forEach(cont => {
        cont.addEventListener("dragover", (e) => { e.preventDefault(); cont.classList.add("is-over"); });
        cont.addEventListener("dragleave", () => cont.classList.remove("is-over"));
        cont.addEventListener("drop", (e) => {
          e.preventDefault();
          cont.classList.remove("is-over");
          const dragged = window.__dragToken;
          if(!dragged) return;

          const targetTok = e.target.closest(".token");

          if(cont === bank && dragged.dataset.role === "zone"){
            const sid = dragged.dataset.sourceTid;
            dragged.remove();
            markBankUsed(tidToBank.get(sid), false);
            return;
          }
          if(cont === zone && dragged.dataset.role === "bank"){
            if(dragged.classList.contains("is-used")) return;
            const c = dragged.cloneNode(true);
            c.dataset.role = "zone";
            c.dataset.sourceTid = dragged.dataset.tid;
            c.classList.remove("is-used","good","bad");
            c.draggable = true;
            attachDnD(c);
            c.addEventListener("click", (e2) => {
              e2.stopPropagation();
              const sid = c.dataset.sourceTid;
              c.remove();
              markBankUsed(tidToBank.get(sid), false);
            });

            if(targetTok && targetTok.parentElement === zone) zone.insertBefore(c, targetTok);
            else zone.appendChild(c);

            markBankUsed(dragged, true);
            return;
          }
          if(cont === zone && dragged.dataset.role === "zone"){
            if(targetTok && targetTok.parentElement === zone && targetTok !== dragged) zone.insertBefore(dragged, targetTok);
            else zone.appendChild(dragged);
          }
        });
      });

      $("[data-play]", block).addEventListener("click", () => Speech.say(it.target));
      $("[data-hint]", block).addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML = `💡 <strong>Hint:</strong> ${escapeHtml(it.hint || "")}`;
      });

      $("[data-check]", block).addEventListener("click", () => {
        const built = $$(".token", zone).map(t => t.textContent.trim()).join(" ").replace(/\s+/g," ").trim()
          .replace(/\s+([,?.!])/g,"$1");
        const ok = normalize(built) === normalize(it.target);
        fb.classList.remove("hidden","ok","no");
        fb.classList.add(ok ? "ok" : "no");
        fb.textContent = ok ? "✅ Perfect!" : `❌ Not yet. You wrote: “${built || "—"}”`;
        if(ok) Score.award(`${awardPrefix}:${it.key}`, 2);
      });

      $("[data-clear]", block).addEventListener("click", () => {
        $$(".token", zone).forEach(z => {
          const sid = z.dataset.sourceTid;
          z.remove();
          markBankUsed(tidToBank.get(sid), false);
        });
        fb.classList.add("hidden");
      });

      resets.push(() => {
        $$(".token", zone).forEach(z => {
          const sid = z.dataset.sourceTid;
          z.remove();
          markBankUsed(tidToBank.get(sid), false);
        });
        fb.classList.add("hidden");
      });

      host.appendChild(block);
    });

    return { reset(){ resets.forEach(fn => fn()); } };
  }

  function buildSort(host, categories, items, awardPrefix){
    host.innerHTML = "";

    const bank = document.createElement("div");
    bank.className = "bank";

    const grid = document.createElement("div");
    grid.className = "placegrid";

    const fb = document.createElement("div");
    fb.className = "feedback hidden";

    host.appendChild(bank);
    host.appendChild(grid);
    host.appendChild(fb);

    let selected = null;

    function setFb(ok, text){
      fb.classList.remove("hidden","ok","no");
      fb.classList.add(ok ? "ok" : "no");
      fb.textContent = text;
    }

    function attachDnD(tok){
      tok.addEventListener("dragstart", (ev) => {
        window.__dragToken = tok;
        try{
          ev.dataTransfer.setData("text/plain", tok.textContent || "");
          ev.dataTransfer.effectAllowed = "move";
        }catch(e){}
      });
    }

    function makeSortToken(it){
      const t = makeToken(it.label);
      t.dataset.cat = it.cat;
      t.dataset.id = it.id;
      attachDnD(t);
      t.addEventListener("click", () => {
        $$(".token", host).forEach(x => x.classList.remove("is-over"));
        t.classList.add("is-over");
        selected = t;
      });
      return t;
    }

    function checkToken(tok, catName){
      if(!tok) return;
      const ok = normalize(tok.dataset.cat) === normalize(catName);
      tok.classList.remove("good","bad");
      tok.classList.add(ok ? "good" : "bad");
      if(ok){
        Score.award(`${awardPrefix}:${tok.dataset.id}`, 1);
        setFb(true, "✅ Correct!");
      }else{
        const hint = items.find(x => x.id === tok.dataset.id)?.hint || "Try again.";
        setFb(false, `❌ Not quite. Hint: ${hint}`);
      }
    }

    categories.forEach(cat => {
      const box = document.createElement("div");
      box.className = "placebox";
      box.innerHTML = `
        <div class="placebox__head">
          <div class="placebox__t">${cat.icon} ${escapeHtml(cat.name)}</div>
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
        </div>
        <div class="placebox__desc">${escapeHtml(cat.desc)}</div>
        <div class="dropzone" data-zone="1" style="margin-top:.55rem;"></div>
      `;
      const zone = $("[data-zone]", box);

      zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("is-over"); });
      zone.addEventListener("dragleave", () => zone.classList.remove("is-over"));
      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.classList.remove("is-over");
        const tok = window.__dragToken;
        if(tok) zone.appendChild(tok);
        checkToken(tok, cat.name);
      });

      box.addEventListener("click", (e) => {
        if(e.target.closest("button")) return;
        if(!selected) return;
        zone.appendChild(selected);
        checkToken(selected, cat.name);
        selected.classList.remove("is-over");
        selected = null;
      });

      $("[data-hint]", box).addEventListener("click", (e) => {
        e.stopPropagation();
        setFb(false, `💡 Hint: ${cat.hint || "Think of phrases that fit."}`);
      });

      grid.appendChild(box);
    });

    bank.addEventListener("dragover", (e) => { e.preventDefault(); bank.classList.add("is-over"); });
    bank.addEventListener("dragleave", () => bank.classList.remove("is-over"));
    bank.addEventListener("drop", (e) => {
      e.preventDefault();
      bank.classList.remove("is-over");
      const tok = window.__dragToken;
      if(tok) bank.appendChild(tok);
    });

    shuffle(items).map(makeSortToken).forEach(t => bank.appendChild(t));

    return {
      reset(){
        fb.classList.add("hidden");
        selected = null;
        $$(".token", host).forEach(t => {
          t.classList.remove("good","bad","is-over");
          bank.appendChild(t);
        });
      }
    };
  }

  function buildFill(host, data, awardPrefix){
    host.innerHTML = "";

    const solutionSeq = [];
    (data.items || []).forEach(it => {
      const blanks = (String(it.txt || "").split("____").length - 1);
      const exp = String(it.ans || "").split(" ");
      for(let i=0;i<Math.max(1, blanks); i++){
        solutionSeq.push(exp[i] || exp[0] || "");
      }
    });

    const bank = document.createElement("div");
    bank.className = "bank";
    const body = document.createElement("div");
    const fb = document.createElement("div");
    fb.className = "feedback hidden";

    host.appendChild(bank);
    host.appendChild(body);
    host.appendChild(fb);

    let selectedWord = null;

    function setFb(ok, html){
      fb.classList.remove("hidden","ok","no");
      fb.classList.add(ok ? "ok" : "no");
      fb.innerHTML = html;
    }

    function renderBank(){
      bank.innerHTML = "";
      scrambleBank(data.bank, solutionSeq).forEach(w => {
        const t = document.createElement("div");
        t.className = "token";
        t.textContent = w;
        t.addEventListener("click", () => {
          $$(".token", bank).forEach(x => x.classList.remove("is-over"));
          t.classList.add("is-over");
          selectedWord = w;
        });
        bank.appendChild(t);
      });
    }

    function renderItems(){
      body.innerHTML = "";
      (data.items || []).forEach((it, idx) => {
        const wrap = document.createElement("div");
        wrap.className = "q";
        const parts = String(it.txt || "").split("____");
        const blanks = parts.length - 1;
        const expected = String(it.ans || "").split(" ");

        let html = "";
        for(let i=0;i<parts.length;i++){
          html += escapeHtml(parts[i]);
          if(i < blanks){
            html += ` <span class="blank" role="button" tabindex="0" data-id="${escapeHtml(it.id)}" data-bi="${i}">____</span> `;
          }
        }

        wrap.innerHTML = `
          <div class="q__prompt">${idx+1}. ${html}</div>
          <div class="smallrow">
            <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
            <button class="iconbtn" type="button" data-say="1">🔊 Listen</button>
          </div>
        `;

        $("[data-hint]", wrap).addEventListener("click", () => {
          setFb(false, `💡 <strong>Hint:</strong> ${escapeHtml(it.hint || "")}`);
        });
        $("[data-say]", wrap).addEventListener("click", () => {
          Speech.say(String(it.say || it.txt).replaceAll("____","blank"));
        });

        $$(".blank", wrap).forEach((b, bi) => {
          const place = () => {
            if(!selectedWord){
              setFb(false, "❌ Pick a word from the bank first.");
              return;
            }
            b.textContent = selectedWord;
            const want = expected[bi] || expected[0];
            const ok = normalize(selectedWord) === normalize(want);
            b.style.borderStyle = "solid";
            b.style.borderColor = ok ? "rgba(28,154,85,.45)" : "rgba(209,74,86,.45)";
            if(ok){
              Score.award(`${awardPrefix}:${it.id}:${bi}`, 1);
              setFb(true, "✅ Correct!");
            }else{
              setFb(false, `❌ Not quite. <strong>Hint:</strong> ${escapeHtml(it.hint || "")}`);
            }
          };
          b.addEventListener("click", place);
          b.addEventListener("keydown", (e) => {
            if(e.key === "Enter" || e.key === " "){
              e.preventDefault();
              place();
            }
          });
        });

        body.appendChild(wrap);
      });
    }

    renderBank();
    renderItems();

    return {
      reset(){
        selectedWord = null;
        fb.classList.add("hidden");
        renderBank();
        renderItems();
      }
    };
  }

  function buildListening(host, items, awardPrefix){
    host.innerHTML = "";
    const resets = [];
    items.forEach((it, idx) => {
      const block = document.createElement("div");
      block.className = "q";
      block.innerHTML = `
        <div class="q__prompt">${idx+1}. <span class="pillTag">${escapeHtml(it.role)}</span> ${escapeHtml(it.prompt)}</div>
        <div class="smallrow">
          <button class="iconbtn" type="button" data-play="1">🔊 Play</button>
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
        </div>
        <div class="choices"></div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const fb = $(".feedback", block);
      const choices = $(".choices", block);

      $("[data-play]", block).addEventListener("click", () => Speech.say(it.say || it.prompt));
      $("[data-hint]", block).addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML = `💡 <strong>Hint:</strong> ${escapeHtml(it.hint || "")}`;
      });

      it.choices.forEach((c, i) => {
        const row = document.createElement("label");
        row.className = "choice";
        row.innerHTML = `<input type="radio" name="${it.key}" /><div>${escapeHtml(c)}</div>`;
        attachTap(row, () => {
          const ok = i === it.answer;
          fb.classList.remove("hidden","ok","no");
          fb.classList.add(ok ? "ok" : "no");
          fb.innerHTML = ok
            ? `✅ Correct! <span class="muted">${escapeHtml(it.explain || "")}</span>`
            : `❌ Not quite. <strong>Best:</strong> ${escapeHtml(it.choices[it.answer])}. <span class="muted">${escapeHtml(it.explain || "")}</span>`;
          if(ok) Score.award(`${awardPrefix}:${it.key}`, 1);
        });
        choices.appendChild(row);
      });

      resets.push(() => {
        $$("input[type=radio]", block).forEach(x => x.checked = false);
        fb.classList.add("hidden");
      });
      host.appendChild(block);
    });
    return { reset(){ resets.forEach(fn => fn()); } };
  }

  function buildDictation(host, items, awardPrefix){
    host.innerHTML = "";
    const resets = [];
    items.forEach((it, idx) => {
      const row = document.createElement("div");
      row.className = "q";
      row.innerHTML = `
        <div class="q__prompt">${idx+1}. ${escapeHtml(it.label)}</div>
        <div class="smallrow">
          <button class="iconbtn" type="button" data-play="1">🔊 Play</button>
          <input class="input" data-in="1" placeholder="${escapeHtml(it.placeholder || "Type digits")}" style="max-width:220px;" />
          <button class="btn" type="button" data-check="1">✅ Check</button>
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
        </div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const fb = $(".feedback", row);
      const inp = $("[data-in]", row);

      $("[data-play]", row).addEventListener("click", () => Speech.say(it.say));
      $("[data-hint]", row).addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML = "💡 Hint: type numbers only. Example: 3.50 → 350 or 3.50 is ok.";
      });

      $("[data-check]", row).addEventListener("click", () => {
        const raw = String(inp.value || "").trim();
        const digits = raw.replace(/[^0-9]/g,"");
        const ok = digits === it.expectedDigits;
        fb.classList.remove("hidden","ok","no");
        fb.classList.add(ok ? "ok" : "no");
        fb.innerHTML = ok ? "✅ Correct!" : `❌ Not quite. <strong>Answer:</strong> ${escapeHtml(it.expectedPretty)}`;
        if(ok) Score.award(`${awardPrefix}:${it.key}`, 1);
      });

      resets.push(() => { inp.value=""; fb.classList.add("hidden"); });
      host.appendChild(row);
    });
    return { reset(){ resets.forEach(fn => fn()); } };
  }

  function buildEssentials(host, items, requiredIds, awardKey){
    host.innerHTML = "";
    const fb = document.createElement("div");
    fb.className = "feedback hidden";
    const grid = document.createElement("div");
    grid.className = "picker";
    const tools = document.createElement("div");
    tools.className = "smallrow";
    tools.style.marginTop = ".65rem";
    tools.innerHTML = `
      <button class="btn" type="button" data-check="1">✅ Check my list</button>
      <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
      <span class="pillTag" id="pickedCount">0 / 6 selected</span>
    `;
    host.appendChild(grid);
    host.appendChild(tools);
    host.appendChild(fb);

    const picked = new Set();

    function updateCount(){
      $("#pickedCount").textContent = `${picked.size} / 6 selected`;
    }

    items.forEach(it => {
      const c = document.createElement("div");
      c.className = "pick";
      c.dataset.id = it.id;
      c.innerHTML = `<div class="pico">${it.icon}</div><div class="ptxt">${escapeHtml(it.label)}</div>`;
      c.addEventListener("click", () => {
        if(picked.has(it.id)){
          picked.delete(it.id);
          c.classList.remove("is-on");
        }else{
          picked.add(it.id);
          c.classList.add("is-on");
        }
        updateCount();
      });
      grid.appendChild(c);
    });
    updateCount();

    function setFb(ok, html){
      fb.classList.remove("hidden","ok","no");
      fb.classList.add(ok ? "ok" : "no");
      fb.innerHTML = html;
    }

    $("[data-hint]", tools).addEventListener("click", () => {
      setFb(false, "💡 Hint: choose simple essentials: water + bread + fruit + eggs + milk + salad.");
    });

    $("[data-check]", tools).addEventListener("click", () => {
      if(picked.size !== 6){
        setFb(false, "❌ Please select exactly <strong>6</strong> items.");
        return;
      }
      const req = new Set(requiredIds);
      let good = 0;
      picked.forEach(id => { if(req.has(id)) good++; });

      if(good >= 5){
        setFb(true, `✅ Great list! You chose <strong>${good}/6</strong> essentials.`);
        Score.award(awardKey, 3);
      }else{
        setFb(false, `❌ Not bad, but try again. You chose <strong>${good}/6</strong> essentials. Use the hint.`);
      }
    });

    return {
      reset(){
        picked.clear();
        $$(".pick", grid).forEach(x => x.classList.remove("is-on"));
        updateCount();
        fb.classList.add("hidden");
      }
    };
  }

  function buildSpinner(host, scenarios, awardPrefix){
    host.innerHTML = "";
    const fb = document.createElement("div");
    fb.className = "feedback hidden";
    const top = document.createElement("div");
    top.className = "smallrow";
    top.innerHTML = `
      <button class="btn" type="button" id="btnSpin">🎲 Spin</button>
      <button class="hintbtn" type="button" id="btnSpinHint">💡 Hint</button>
      <button class="iconbtn" type="button" id="btnSpinListen">🔊 Listen</button>
      <span class="pillTag" id="spinTitle">Spin for a situation…</span>
    `;

    const box = document.createElement("div");
    box.className = "q";
    host.appendChild(top);
    host.appendChild(box);
    host.appendChild(fb);

    let current = null;

    function setFb(ok, html){
      fb.classList.remove("hidden","ok","no");
      fb.classList.add(ok ? "ok" : "no");
      fb.innerHTML = html;
    }

    function renderScenario(s){
      current = s;
      $("#spinTitle").textContent = s.title;
      box.innerHTML = `
        <div class="q__prompt">${escapeHtml(s.prompt)}</div>
        <div class="two" style="margin-top:.55rem;">
          <div>
            <div class="badge">1) The problem</div>
            <div id="probChoices"></div>
          </div>
          <div>
            <div class="badge">2) The request</div>
            <div id="reqChoices"></div>
          </div>
        </div>
      `;

      const prob = $("#probChoices", box);
      const req = $("#reqChoices", box);

      const makeChoice = (parent, name, list, correctIndex, keyPart) => {
        parent.innerHTML = "";
        list.forEach((txt, i) => {
          const row = document.createElement("label");
          row.className = "choice";
          row.innerHTML = `<input type="radio" name="${name}" /><div>${escapeHtml(txt)}</div>`;
          attachTap(row, () => {
            const ok = i === correctIndex;
            setFb(ok, ok ? "✅ Good choice!" : `❌ Try again. (Hint: be polite + clear.)`);
            if(ok) Score.award(`${awardPrefix}:${s.key}:${keyPart}`, 1);
          });
          parent.appendChild(row);
        });
      };

      makeChoice(prob, `prob_${s.key}`, s.problemChoices, s.problemAnswer, "prob");
      makeChoice(req, `req_${s.key}`, s.requestChoices, s.requestAnswer, "req");
    }

    $("#btnSpin").addEventListener("click", () => {
      const s = scenarios[Math.floor(Math.random()*scenarios.length)];
      renderScenario(s);
      fb.classList.add("hidden");
    });

    $("#btnSpinHint").addEventListener("click", () => {
      setFb(false, "💡 Hint: Use polite English: Excuse me / Could I…? / Could you… please?");
    });

    $("#btnSpinListen").addEventListener("click", () => {
      if(!current) return;
      Speech.say(`${current.prompt} Problem: ${current.problemChoices[current.problemAnswer]}. Request: ${current.requestChoices[current.requestAnswer]}.`);
    });

    return {
      reset(){
        current = null;
        $("#spinTitle").textContent = "Spin for a situation…";
        box.innerHTML = "";
        fb.classList.add("hidden");
      }
    };
  }

  function buildOral(host, prompts, awardPrefix){
    host.innerHTML = "";
    const resets = [];
    prompts.forEach((p, idx) => {
      const row = document.createElement("div");
      row.className = "q";
      row.innerHTML = `
        <div class="q__prompt">${idx+1}. Listen & repeat</div>
        <div class="muted">${escapeHtml(p.text)}</div>
        <div class="smallrow" style="margin-top:.55rem;">
          <button class="iconbtn" type="button" data-play="1">🔊 Listen</button>
          <button class="btn" type="button" data-said="1">✅ I said it</button>
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
        </div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const fb = $(".feedback", row);
      $("[data-play]", row).addEventListener("click", () => Speech.say(p.text));
      $("[data-hint]", row).addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.textContent = "💡 Hint: Slow → normal speed. Smile for friendly intonation.";
      });
      $("[data-said]", row).addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("ok");
        fb.textContent = "✅ Great! Self-check done.";
        Score.award(`${awardPrefix}:${p.key}`, 1);
      });
      resets.push(() => fb.classList.add("hidden"));
      host.appendChild(row);
    });
    return { reset(){ resets.forEach(fn => fn()); } };
  }

  // ---------- Data ----------
  const vocab = [
    {set:'transit', icon:'🎫', word:'ticket', def:'a paper/card to travel', ex:'One ticket to downtown, please.'},
    {set:'transit', icon:'🚉', word:'station', def:'place for trains/metro', ex:'Where is the station?'},
    {set:'transit', icon:'🧾', word:'receipt', def:'proof of payment', ex:'Can I have a receipt, please?'},
    {set:'transit', icon:'🛑', word:'stop', def:'a place where a bus/metro stops', ex:'Get off at the next stop.'},
    {set:'transit', icon:'🔁', word:'transfer', def:'change lines', ex:'Transfer at Central Station.'},
    {set:'transit', icon:'🧭', word:'platform', def:'the area where you wait for the train', ex:'Platform 2, please.'},
    {set:'transit', icon:'⏱️', word:'schedule', def:'times for trains/buses', ex:'What’s the schedule?'},
    {set:'transit', icon:'🚇', word:'metro', def:'underground train', ex:'Take the metro.'},
    {set:'directions', icon:'⬅️', word:'turn left', def:'go to the left', ex:'Turn left at the corner.'},
    {set:'directions', icon:'➡️', word:'turn right', def:'go to the right', ex:'Turn right after the bank.'},
    {set:'directions', icon:'⬆️', word:'go straight', def:'do not turn left/right', ex:'Go straight for 2 minutes.'},
    {set:'directions', icon:'📍', word:'near', def:'close', ex:'The store is near the hotel.'},
    {set:'directions', icon:'↔️', word:'between', def:'in the middle of two places', ex:'It’s between the café and the bank.'},
    {set:'directions', icon:'🧲', word:'next to', def:'beside', ex:'It’s next to the pharmacy.'},
    {set:'directions', icon:'🪞', word:'across from', def:'on the opposite side', ex:'It’s across from the park.'},
    {set:'directions', icon:'🔦', word:'traffic lights', def:'red/yellow/green lights', ex:'Turn left at the traffic lights.'},
    {set:'directions', icon:'🧱', word:'corner', def:'where two streets meet', ex:'At the corner, turn right.'},
    {set:'directions', icon:'🦶', word:'cross the street', def:'go to the other side', ex:'Cross the street carefully.'},
    {set:'directions', icon:'🧭', word:'past', def:'go beyond', ex:'Go past the hotel.'},
    {set:'grocery', icon:'💧', word:'water', def:'drink', ex:'I’d like a bottle of water.'},
    {set:'grocery', icon:'🍞', word:'bread', def:'food made from flour', ex:'Do you have bread?'},
    {set:'grocery', icon:'🥚', word:'eggs', def:'food from chickens', ex:'I need six eggs.'},
    {set:'grocery', icon:'🍌', word:'fruit', def:'apples, bananas, etc.', ex:'Where is the fruit section?'},
    {set:'grocery', icon:'🥛', word:'milk', def:'dairy drink', ex:'Any milk, please?'},
    {set:'grocery', icon:'🧀', word:'cheese', def:'dairy food', ex:'Where is the cheese?'},
    {set:'grocery', icon:'🥬', word:'vegetables', def:'carrots, salad, etc.', ex:'I need vegetables.'},
    {set:'grocery', icon:'🛒', word:'basket', def:'small carrier in a store', ex:'Do you have a basket?'},
    {set:'grocery', icon:'🧴', word:'soap', def:'to wash hands/body', ex:'Where is the soap?'},
    {set:'grocery', icon:'💳', word:'card', def:'bank card for payment', ex:'By card, please.'},
    {set:'cafe', icon:'☕', word:'coffee', def:'hot drink', ex:'A small coffee, please.'},
    {set:'cafe', icon:'🫖', word:'tea', def:'hot drink', ex:'Can I have a tea?'},
    {set:'cafe', icon:'🥐', word:'croissant', def:'French pastry', ex:'One croissant, please.'},
    {set:'cafe', icon:'🥤', word:'to go', def:'take away', ex:'To go, please.'},
    {set:'cafe', icon:'🪑', word:'for here', def:'eat/drink at the café', ex:'For here, please.'},
    {set:'cafe', icon:'🍰', word:'cake', def:'sweet dessert', ex:'One piece of cake, please.'},
    {set:'cafe', icon:'🧾', word:'bill / check', def:'paper with the price', ex:'Can I have the check, please?'}
  ];

  const prepMCQ = [
    { key:"p1", prompt:"The grocery store is ____ the hotel (close).", choices:["near","between","across from"], answer:0, explain:"Near = close.", hint:"Near = close." },
    { key:"p2", prompt:"The bank is ____ the café and the pharmacy.", choices:["between","near","under"], answer:0, explain:"Between A and B.", hint:"A + B → between." },
    { key:"p3", prompt:"The metro entrance is ____ the street (other side).", choices:["across from","inside","behind"], answer:0, explain:"Across from = opposite side.", hint:"Opposite side." },
    { key:"p4", prompt:"The ticket machine is ____ the station door (side).", choices:["next to","between","under"], answer:0, explain:"Next to = beside.", hint:"Beside." },
    { key:"p5", prompt:"The café is ____ the corner (very close).", choices:["near","left","down"], answer:0, explain:"Near = close.", hint:"Near." },
  ];

  const sortCategories = [
    { name:"near", icon:"📍", desc:"close (not far)", hint:"Close = near." },
    { name:"next to", icon:"🧲", desc:"beside", hint:"Beside = next to." },
    { name:"across from", icon:"↔️", desc:"opposite side", hint:"Opposite = across from." },
    { name:"between", icon:"↔️", desc:"in the middle of two", hint:"A and B → between." },
  ];

  const sortItems = [
    {id:'s1', label:'The café is close to the hotel.', cat:'near', hint:'close → near'},
    {id:'s2', label:'The ATM is beside the entrance.', cat:'next to', hint:'beside → next to'},
    {id:'s3', label:'The station is on the other side of the street.', cat:'across from', hint:'other side → across from'},
    {id:'s4', label:'The pharmacy is in the middle of the bank and the café.', cat:'between', hint:'middle of A and B → between'},
    {id:'s5', label:'The ticket office is beside the stairs.', cat:'next to', hint:'beside → next to'},
    {id:'s6', label:'The supermarket is close.', cat:'near', hint:'close → near'},
    {id:'s7', label:'The hotel is opposite the park.', cat:'across from', hint:'opposite → across from'},
    {id:'s8', label:'The bus stop is in the middle of the museum and the hotel.', cat:'between', hint:'middle → between'},
    {id:'s9', label:'The café is beside the bakery.', cat:'next to', hint:'beside → next to'},
    {id:'s10', label:'The metro entrance is opposite the bank.', cat:'across from', hint:'opposite → across from'},
    {id:'s11', label:'The grocery store is close to here.', cat:'near', hint:'close → near'},
    {id:'s12', label:'The pharmacy is in the middle of the hotel and the park.', cat:'between', hint:'middle → between'}
  ];

  const builderItems = [
    {key:'b1', title:'Ask for directions', target:'Excuse me, where is the grocery store, please?', tokens:'[\'Excuse\', \'me,\', \'where\', \'is\', \'the\', \'grocery\', \'store,\', \'please?\']', hint:'Start with: Excuse me,'},
    {key:'b2', title:'Give directions (simple)', target:'Go straight and turn right at the bank.', tokens:'[\'Go\', \'straight\', \'and\', \'turn\', \'right\', \'at\', \'the\', \'bank.\']', hint:'Action + landmark.'},
    {key:'b3', title:'Ask for a ticket', target:'One ticket to downtown, please.', tokens:'[\'One\', \'ticket\', \'to\', \'downtown,\', \'please.\']', hint:'One ticket to…'},
    {key:'b4', title:'Give directions (with connector)', target:'First, go straight. Then, turn left at the traffic lights.', tokens:'[\'First,\', \'go\', \'straight.\', \'Then,\', \'turn\', \'left\', \'at\', \'the\', \'traffic\', \'lights.\']', hint:'Use: First… Then…'},
    {key:'b5', title:'Ask if it is close', target:'Is the metro station near here, please?', tokens:'[\'Is\', \'the\', \'metro\', \'station\', \'near\', \'here,\', \'please?\']', hint:'Is the… near here?'},
    {key:'b6', title:'Give directions (between)', target:'It is between the café and the pharmacy.', tokens:'[\'It\', \'is\', \'between\', \'the\', \'café\', \'and\', \'the\', \'pharmacy.\']', hint:'Between A and B.'}
  ];

  const transitListening = [
    { key:"t1", role:"Clerk", prompt:"Hello. Where are you going today?",
      say:"Hello. Where are you going today?", choices:["To downtown, please.","I am ticket.","Yes."], answer:0,
      explain:"Say your destination.", hint:"Say: To downtown, please." },
    { key:"t2", role:"Clerk", prompt:"One-way or return?",
      say:"One way or return?", choices:["Return, please.","Yes ticket.","Go straight."], answer:0,
      explain:"Return = two trips.", hint:"Choose: Return, please." },
    { key:"t3", role:"Clerk", prompt:"That’s 4 dollars. Cash or card?",
      say:"That's four dollars. Cash or card?", choices:["By card, please.","I am four.","No."], answer:0,
      explain:"Say how you pay.", hint:"Say: By card, please." },
    { key:"t4", role:"Clerk", prompt:"Here is your ticket. Platform 2.",
      say:"Here is your ticket. Platform two.", choices:["Thank you very much.","Platform? No.","Ticket is station."], answer:0,
      explain:"Polite thanks.", hint:"Say: Thank you." }
  ];

  const transitFill = {
    bank: ["ticket", "downtown", "return", "card", "platform", "two", "receipt", "one-way", "cash"],
    items: [
      { id:"tf1", txt:"One ____ to ____, please.", ans:"ticket downtown", hint:"Buy + destination", say:"One ticket to downtown, please." },
      { id:"tf2", txt:"____ or ____?", ans:"one-way return", hint:"Two options", say:"One way or return?" },
      { id:"tf3", txt:"Cash or ____?", ans:"card", hint:"Payment method", say:"Cash or card?" },
      { id:"tf4", txt:"Platform ____.", ans:"two", hint:"A number (listen).", say:"Platform two." },
    ]
  };

  const essentials = [
    {id:"e1", icon:"💧", label:"water"}, {id:"e2", icon:"🍞", label:"bread"}, {id:"e3", icon:"🍌", label:"fruit"},
    {id:"e4", icon:"🥚", label:"eggs"}, {id:"e5", icon:"🥛", label:"milk"}, {id:"e6", icon:"🧀", label:"cheese"},
    {id:"e7", icon:"🥗", label:"salad"}, {id:"e8", icon:"🍫", label:"chocolate"}, {id:"e9", icon:"🍗", label:"chicken"},
    {id:"e10", icon:"🍪", label:"cookies"}, {id:"e11", icon:"🍚", label:"rice"}, {id:"e12", icon:"🧃", label:"juice"},
  ];
  const essentialRequired = ["e1","e2","e3","e4","e5","e7"];

  const storeDialogue = [
    { key:"sd1", role:"Cashier", prompt:"Hello! Do you need a bag?", say:"Hello! Do you need a bag?",
      choices:["Yes, please.","Bag? No words.","I am bag."], answer:0, explain:"Simple polite yes.", hint:"Say: Yes, please." },
    { key:"sd2", role:"Cashier", prompt:"Do you have a loyalty card?", say:"Do you have a loyalty card?",
      choices:["No, I don’t.","Yes, I am card.","Card is good."], answer:0, explain:"A1+ polite answer.", hint:"No, I don't." },
    { key:"sd3", role:"Cashier", prompt:"That’s 12.50. Cash or card?", say:"That's twelve fifty. Cash or card?",
      choices:["By card, please.","Twelve is good.","No."], answer:0, explain:"Payment phrase.", hint:"By card, please." },
    { key:"sd4", role:"Cashier", prompt:"Would you like a receipt?", say:"Would you like a receipt?",
      choices:["Yes, please.","Receipt is ticket.","I like."], answer:0, explain:"Polite yes.", hint:"Yes, please." }
  ];

  const prices = [
    { key:"pr1", label:"Price 1", say:"That is three dollars fifty.", expectedDigits:"350", expectedPretty:"$3.50", placeholder:"3.50 or 350" },
    { key:"pr2", label:"Price 2", say:"That is eight dollars.", expectedDigits:"8", expectedPretty:"$8", placeholder:"8" },
    { key:"pr3", label:"Price 3", say:"That is twelve fifty.", expectedDigits:"1250", expectedPretty:"$12.50", placeholder:"12.50 or 1250" },
    { key:"pr4", label:"Price 4", say:"That is one dollar ninety nine.", expectedDigits:"199", expectedPretty:"$1.99", placeholder:"1.99 or 199" },
  ];

  const someAny = [
    { key:"sa1", prompt:"I’d like ____ water, please.", choices:["some","any"], answer:0, explain:"In positive requests: some water.", hint:"Positive request → some." },
    { key:"sa2", prompt:"Do you have ____ milk?", choices:["some","any"], answer:1, explain:"Questions often use any.", hint:"Question → any." },
    { key:"sa3", prompt:"I don’t have ____ cash.", choices:["some","any"], answer:1, explain:"Negative often uses any.", hint:"Negative → any." },
    { key:"sa4", prompt:"Can I have ____ bread, please?", choices:["some","any"], answer:0, explain:"Polite request → some.", hint:"Request → some." },
    { key:"sa5", prompt:"Do you have ____ eggs?", choices:["some","any"], answer:1, explain:"Question → any.", hint:"Question → any." },
  ];

  const menuLines = [
    { ico:"☕", txt:"Coffee — $2.50 (small) / $3.50 (large)" },
    { ico:"🫖", txt:"Tea — $2.20" },
    { ico:"🥐", txt:"Croissant — $2.80" },
    { ico:"🥪", txt:"Chicken sandwich — $7.90" },
    { ico:"⭐", txt:"Special: combo (coffee + croissant) — $4.90" }
  ];

  const menuMCQ = [
    { key:"m1", prompt:"How much is a tea?", choices:["$2.20","$2.80","$3.50"], answer:0, explain:"Tea is $2.20.", hint:"Look at the tea line." },
    { key:"m2", prompt:"What is the special combo?", choices:["Tea + sandwich","Coffee + croissant","Coffee + tea"], answer:1, explain:"Combo = coffee + croissant.", hint:"Special line." },
    { key:"m3", prompt:"How much is a chicken sandwich?", choices:["$7.90","$4.90","$2.50"], answer:0, explain:"Sandwich is $7.90.", hint:"Sandwich line." },
    { key:"m4", prompt:"Large coffee price?", choices:["$3.50","$2.50","$2.20"], answer:0, explain:"Large coffee is $3.50.", hint:"Coffee line." },
  ];

  const cafeListening = [
    { key:"c1", role:"Barista", prompt:"For here or to go?", say:"For here or to go?",
      choices:["To go, please.","I go straight.","Ticket, please."], answer:0, explain:"To go = take away.", hint:"Say: To go, please." },
    { key:"c2", role:"Barista", prompt:"Anything else?", say:"Anything else?",
      choices:["That’s all, thank you.","Yes ticket.","Else is good."], answer:0, explain:"End politely.", hint:"That’s all, thank you." }
  ];

  const orderBuilder = [
    { key:"ob1", title:"Build your order", target:"Can I have a small coffee to go, please?",
      tokens:["Can","I","have","a","small","coffee","to","go,","please?"], hint:"Start with: Can I have…" }
  ];

  const spinnerScenarios = [
    { key:'sp1', title:'Lost', prompt:'You are lost. You need the metro station.', problemChoices:['Excuse me, I’m lost.', 'I am station.', 'Lost yes.'], problemAnswer:0, requestChoices:['Where is the metro station, please?', 'Give me station.', 'Station now.'], requestAnswer:0 },
    { key:'sp2', title:'Wrong item', prompt:'You bought the wrong item. You need help.', problemChoices:['Excuse me, this is wrong.', 'Wrong, wrong.', 'I wrong.'], problemAnswer:0, requestChoices:['Can I exchange it, please?', 'Exchange now.', 'No.'], requestAnswer:0 },
    { key:'sp3', title:'Need water', prompt:'You need water at the store.', problemChoices:['Excuse me, I need water.', 'Water is me.', 'Need is.'], problemAnswer:0, requestChoices:['Where is the water, please?', 'Water where.', 'Go water.'], requestAnswer:0 },
    { key:'sp4', title:'Noisy café', prompt:'The café is noisy. You want to sit elsewhere.', problemChoices:['Excuse me, it’s very noisy.', 'Noisy yes.', 'I am noisy.'], problemAnswer:0, requestChoices:['Can I sit over there, please?', 'Sit now.', 'There sit.'], requestAnswer:0 },
    { key:'sp5', title:'Bus help', prompt:'You are on the bus. You want to get off at the museum.', problemChoices:['Excuse me, I’m not sure.', 'Bus is museum.', 'I am stop.'], problemAnswer:0, requestChoices:['Is this stop the museum, please?', 'Museum stop now.', 'I stop.'], requestAnswer:0 },
    { key:'sp6', title:'Paying', prompt:'You want to pay by card at the store.', problemChoices:['Excuse me, I’d like to pay.', 'Pay card.', 'I am money.'], problemAnswer:0, requestChoices:['Can I pay by card, please?', 'Card now.', 'Pay yes.'], requestAnswer:0 },
    { key:'sp7', title:'Hotel directions', prompt:'You want to go back to the hotel.', problemChoices:['Excuse me, I need the hotel.', 'Hotel is me.', 'Need hotel yes.'], problemAnswer:0, requestChoices:['How do I get to the hotel, please?', 'Hotel now.', 'Go hotel.'], requestAnswer:0 },
    { key:'sp8', title:'To go', prompt:'At the café, you want your drink to go.', problemChoices:['Excuse me, I’m in a hurry.', 'Hurry yes.', 'I am go.'], problemAnswer:0, requestChoices:['To go, please.', 'Go now.', 'Ticket go.'], requestAnswer:0 }
  ];

  const oralPrompts = [
    {key:'o1', text:'Excuse me, where is the grocery store, please?'},
    {key:'o2', text:'One ticket to downtown, please.'},
    {key:'o3', text:'Could you help me, please?'},
    {key:'o4', text:'To go, please.'},
    {key:'o5', text:'That’s all, thank you.'},
    {key:'o6', text:'Go straight, then turn left at the traffic lights.'},
    {key:'o7', text:'It is across from the park.'},
    {key:'o8', text:'It is between the café and the bank.'}
  ];

  // ---------- Vocab cards ----------
  function renderFlashcards(shuffleMode=false){
    const set = $("#vocabSet").value;
    let list = vocab.slice();
    if(set !== "all") list = list.filter(v => v.set === set);
    if(shuffleMode) list = shuffle(list);

    const host = $("#flashcards");
    host.innerHTML = "";
    list.forEach(v => {
      const card = document.createElement("div");
      card.className = "flashcard";
      card.innerHTML = `
        <div class="flashcard__face flashcard__front">
          <div class="fcTop">
            <div class="fcIcon">${v.icon}</div>
            <div class="fcTag">#${escapeHtml(v.set)}</div>
          </div>
          <div class="fcWord">${escapeHtml(v.word)}</div>
          <div class="muted tiny">Click to flip ➜</div>
          <div class="fcBtns">
            <button class="iconbtn" type="button" data-say="${escapeHtml(v.word)}">🔊 Word</button>
          </div>
        </div>
        <div class="flashcard__face flashcard__back">
          <div class="badge">Meaning</div>
          <div><strong>${escapeHtml(v.def)}</strong></div>
          <div class="badge" style="margin-top:.45rem;">Example</div>
          <div>${escapeHtml(v.ex)}</div>
          <div class="fcBtns" style="margin-top:.55rem;">
            <button class="iconbtn" type="button" data-say="${escapeHtml(v.def)}">🔊 Meaning</button>
            <button class="iconbtn" type="button" data-say="${escapeHtml(v.ex)}">🔊 Example</button>
            <button class="iconbtn" type="button" data-back="1">↩ Front</button>
          </div>
        </div>
      `;
      card.addEventListener("click", (e) => {
        const t = e.target;
        if(t && (t.tagName === "BUTTON" || t.closest("button"))) return;
        card.classList.toggle("is-flipped");
      });
      $$("button[data-say]", card).forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          Speech.say(btn.getAttribute("data-say"));
        });
      });
      $("button[data-back]", card)?.addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.remove("is-flipped");
      });
      host.appendChild(card);
    });
  }

  function buildVocabQuiz(){
    const host = $("#vocabQuizHost");
    host.innerHTML = "";
    const pool = shuffle(vocab).slice(0, 8);

    pool.forEach((it, idx) => {
      const wrong = shuffle(vocab.filter(x => x.word !== it.word)).slice(0, 2).map(x => x.def);
      const choices = shuffle([it.def, ...wrong]);

      const q = document.createElement("div");
      q.className = "q";
      q.innerHTML = `
        <div class="q__prompt">${it.icon} What does “${escapeHtml(it.word)}” mean?</div>
        <div class="smallrow">
          <button class="iconbtn" type="button" data-play="1">🔊 Word</button>
          <button class="hintbtn" type="button" data-hint="1">💡 Hint</button>
        </div>
        <div class="choices"></div>
        <div class="feedback hidden" aria-live="polite"></div>
      `;
      const fb = $(".feedback", q);
      const ch = $(".choices", q);

      $("[data-play]", q).addEventListener("click", () => Speech.say(it.word));
      $("[data-hint]", q).addEventListener("click", () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML = `💡 <strong>Hint:</strong> Example: ${escapeHtml(it.ex)}`;
      });

      choices.forEach(c => {
        const row = document.createElement("div");
        row.className = "choice";
        row.innerHTML = `<input type="radio" name="vq${idx}" /><div>${escapeHtml(c)}</div>`;
        attachTap(row, () => {
          const ok = c === it.def;
          fb.classList.remove("hidden","ok","no");
          fb.classList.add(ok ? "ok" : "no");
          fb.innerHTML = ok ? "✅ Correct!" : `❌ Answer: ${escapeHtml(it.def)}`;
          if(ok) Score.award(`vocabQuiz:${idx}`, 1);
        });
        ch.appendChild(row);
      });

      host.appendChild(q);
    });
  }

  function showQuiz(on){
    const panel = $("#vocabQuizPanel");
    if(on) panel.classList.remove("hidden");
    else panel.classList.add("hidden");
  }

  // ---------- Menu ----------
  function renderMenu(){
    const card = $("#menuCard");
    card.innerHTML = menuLines.map(l => `
      <div class="line">
        <div class="ico">${l.ico}</div>
        <div>${escapeHtml(l.txt)}</div>
      </div>
    `).join("");
  }

  safeOn("#btnMenuListen", "click", () => {
    if(!window.speechSynthesis){
      alert('Audio is not available in this browser. Try Safari/Chrome on desktop, or check iOS speech settings.');
      return;
    }
    const text = menuLines.map(l => l.txt).join(" ");
    Speech.say(text);
  });


  // Global speak buttons (for explanations / grammar cards)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-speak]");
    if(!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const t = btn.getAttribute("data-speak");
    if(t) Speech.say(t);
  });

  function safeBuild(sel, builder, ...args){
    const host = safeEl(sel);
    if(!host){
      console.warn('Missing host:', sel);
      return { reset(){/*noop*/} };
    }
    try{ return builder(host, ...args); }
    catch(e){ console.error('Build failed for', sel, e); return { reset(){/*noop*/} }; }
  }

  // ---------- Init ----------
  setVoice("en-US");
  renderFlashcards(false);
  renderMenu();

  safeOn("#vocabSet", "change", () => renderFlashcards(false));
  safeOn("#btnVocabShuffle", "click", () => renderFlashcards(true));
  safeOn("#btnVocabQuiz", "click", () => {
    showQuiz(true);
    buildVocabQuiz();
    $("#vocabQuizPanel").scrollIntoView({behavior:"smooth"});
  });
  safeOn("#btnVocabQuizReset", "click", () => buildVocabQuiz());

  const prepAPI = safeBuild("#prepMCQHost", makeMCQ, prepMCQ, "prep");
  const sortAPI = safeBuild("#sortHost", buildSort, sortCategories, sortItems, "sort");
  const builderAPI = safeBuild("#builderHost", buildWordOrder, builderItems, "builder");

  const transitListenAPI = safeBuild("#transitListenHost", buildListening, transitListening, "transitListen");
  const transitFillAPI = safeBuild("#transitFillHost", buildFill, transitFill, "transitFill");

  const essentialsAPI = safeBuild("#essentialsHost", buildEssentials, essentials, essentialRequired, "essentials:done");
  const storeDialogueAPI = safeBuild("#storeDialogueHost", buildListening, storeDialogue, "storeDialogue");
  const pricesAPI = safeBuild("#pricesHost", buildDictation, prices, "prices");
  const someAnyAPI = safeBuild("#someAnyHost", makeMCQ, someAny, "someAny");

  const menuMCQAPI = safeBuild("#menuMCQHost", makeMCQ, menuMCQ, "menuMCQ");
  const cafeListenAPI = safeBuild("#cafeListenHost", buildListening, cafeListening, "cafeListen");
  const orderBuilderAPI = safeBuild("#orderBuilderHost", buildWordOrder, orderBuilder, "orderBuilder");

  const spinnerAPI = safeBuild("#spinnerHost", buildSpinner, spinnerScenarios, "spinner");
  const oralAPI = safeBuild("#oralHost", buildOral, oralPrompts, "oral");

  safeOn("#btnPrepReset", "click", () => prepAPI.reset());
  safeOn("#btnSortReset", "click", () => sortAPI.reset());
  safeOn("#btnBuilderReset", "click", () => builderAPI.reset());

  safeOn("#btnTransitListenReset", "click", () => transitListenAPI.reset());
  safeOn("#btnTransitFillReset", "click", () => transitFillAPI.reset());

  safeOn("#btnEssentialsReset", "click", () => essentialsAPI.reset());
  safeOn("#btnStoreDialogueReset", "click", () => storeDialogueAPI.reset());
  safeOn("#btnPricesReset", "click", () => pricesAPI.reset());
  safeOn("#btnSomeAnyReset", "click", () => someAnyAPI.reset());

  safeOn("#btnMenuMCQReset", "click", () => menuMCQAPI.reset());
  safeOn("#btnCafeListenReset", "click", () => cafeListenAPI.reset());
  safeOn("#btnOrderBuilderReset", "click", () => orderBuilderAPI.reset());

  safeOn("#btnSpinnerReset", "click", () => spinnerAPI.reset());
  safeOn("#btnOralReset", "click", () => oralAPI.reset());

  safeOn("#btnResetAll", "click", () => {
    if(!confirm("Reset ALL activities and score?")) return;
    Speech.stop();
    Score.reset();

    showQuiz(false);
    renderFlashcards(false);

    prepAPI.reset(); sortAPI.reset(); builderAPI.reset();
    transitListenAPI.reset(); transitFillAPI.reset();
    essentialsAPI.reset(); storeDialogueAPI.reset(); pricesAPI.reset(); someAnyAPI.reset();
    menuMCQAPI.reset(); cafeListenAPI.reset(); orderBuilderAPI.reset();
    spinnerAPI.reset(); oralAPI.reset();

    $("#top")?.scrollIntoView({behavior:"smooth"});
  });

  function countBlanks(fillObj){
    let n = 0;
    (fillObj.items || []).forEach(it => {
      n += (String(it.txt || "").split("____").length - 1);
    });
    return n;
  }

  const max =
    8 +
    prepMCQ.length +
    sortItems.length +
    (builderItems.length * 2) +
    transitListening.length +
    countBlanks(transitFill) +
    3 +
    storeDialogue.length +
    prices.length +
    someAny.length +
    menuMCQ.length +
    cafeListening.length +
    (orderBuilder.length * 2) +
    (spinnerScenarios.length * 2) +
    oralPrompts.length;

  Score.setMax(max);
})();
