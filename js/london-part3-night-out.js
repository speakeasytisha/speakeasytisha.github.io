/* =========================================================
   London Part 3 – Night Out (Advanced)
   Interactive: matching, MCQ scoring, builders, TTS, timer
   ========================================================= */

(function () {
  "use strict";

  // ---------- Helpers ----------
  function $(sel, root = document) { return root.querySelector(sel); }
  function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function setHeroFromBodyData() {
    const img = document.body.getAttribute("data-hero-image");
    const hero = $(".se-hero");
    if (!hero || !img) return;
    hero.style.backgroundImage =
      "linear-gradient(135deg, rgba(15,23,42,.92), rgba(15,23,42,.65)), url('" + img.replace(/'/g, "%27") + "')";
    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";
  }

  // ---------- Matching (click-to-pair) ----------
  function initMatching(root) {
    if (!root) return;
    const items = $all(".match-item", root);
    const scoreEl = $("#" + root.dataset.scoreId);
    const noteEl = $("#matchNote");
    const resetBtn = $("[data-match-reset]", root);

    let selected = null;
    let correctPairs = 0;
    const totalPairs = 5;

    function setNote(msg) {
      if (noteEl) noteEl.textContent = msg || "";
    }

    function updateScore() {
      if (scoreEl) scoreEl.textContent = String(correctPairs);
    }

    function clearSelection() {
      if (selected) selected.classList.remove("is-selected");
      selected = null;
    }

    function lockPair(a, b) {
      a.classList.add("is-done", "is-correct");
      b.classList.add("is-done", "is-correct");
      a.disabled = true;
      b.disabled = true;
      correctPairs += 1;
      updateScore();
      setNote(correctPairs === totalPairs ? "Nice — all matched." : "Good. Keep going.");
    }

    function markWrong(a, b) {
      a.classList.add("is-wrong");
      b.classList.add("is-wrong");
      setTimeout(() => {
        a.classList.remove("is-wrong");
        b.classList.remove("is-wrong");
      }, 550);
      setNote("Not quite. Try again.");
    }

    items.forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("is-done")) return;

        if (!selected) {
          selected = btn;
          selected.classList.add("is-selected");
          setNote("Now pick the matching definition.");
          return;
        }

        if (selected === btn) {
          clearSelection();
          setNote("");
          return;
        }

        const key1 = selected.dataset.key;
        const key2 = btn.dataset.key;

        if (key1 && key2 && key1 === key2) {
          lockPair(selected, btn);
        } else {
          markWrong(selected, btn);
        }
        clearSelection();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        correctPairs = 0;
        updateScore();
        setNote("");
        items.forEach(btn => {
          btn.disabled = false;
          btn.classList.remove("is-selected", "is-done", "is-correct", "is-wrong");
        });
        selected = null;
      });
    }

    updateScore();
  }

  // ---------- MCQ blocks ----------
  function initMcq(root) {
    if (!root) return;

    const qs = $all(".mcq-q", root);
    const total = parseInt(root.dataset.total || String(qs.length), 10) || qs.length;

    const correctEl = $("#" + root.id + "-correct");
    const totalEl = $("#" + root.id + "-total");
    const finalEl = $("#" + root.id + "-final");

    let answered = new Set();
    let correctCount = 0;

    if (totalEl) totalEl.textContent = String(total);
    if (correctEl) correctEl.textContent = "0";

    function reset() {
      answered = new Set();
      correctCount = 0;
      if (correctEl) correctEl.textContent = "0";
      if (finalEl) finalEl.textContent = "";
      qs.forEach(q => {
        const fb = $(".mcq-fb", q);
        if (fb) {
          fb.textContent = "";
          fb.classList.remove("good", "bad");
        }
        $all("button[data-opt]", q).forEach(b => {
          b.disabled = false;
          b.classList.remove("is-correct", "is-wrong");
        });
      });
    }

    qs.forEach((q, idx) => {
      const correct = q.dataset.correct;
      const hint = q.dataset.hint || "";
      const buttons = $all("button[data-opt]", q);
      const fb = $(".mcq-fb", q);

      buttons.forEach(b => {
        b.addEventListener("click", () => {
          const key = root.id + ":" + idx;
          if (answered.has(key)) return;

          const opt = b.dataset.opt;
          const isCorrect = (opt === correct);

          if (isCorrect) {
            b.classList.add("is-correct");
            if (fb) {
              fb.textContent = "✅ Correct.";
              fb.classList.add("good");
              fb.classList.remove("bad");
            }
            correctCount += 1;
            if (correctEl) correctEl.textContent = String(correctCount);
          } else {
            b.classList.add("is-wrong");
            const rightBtn = buttons.find(x => x.dataset.opt === correct);
            if (rightBtn) rightBtn.classList.add("is-correct");
            if (fb) {
              fb.textContent = "❌ Not quite. " + (hint ? ("Hint: " + hint) : "");
              fb.classList.add("bad");
              fb.classList.remove("good");
            }
          }

          buttons.forEach(x => x.disabled = true);
          answered.add(key);
        });
      });
    });

    // Buttons targeting this quiz by selector
    $all("[data-show-score]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-show-score");
        if (!target || target !== ("#" + root.id)) return;
        if (finalEl) finalEl.textContent = "Score: " + correctCount + " / " + total + ".";
      });
    });

    $all("[data-reset]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-reset");
        if (!target || target !== ("#" + root.id)) return;
        reset();
      });
    });

    reset();
  }

  // ---------- Builders ----------
  function sanitizeName(name) {
    const n = (name || "").trim();
    if (!n) return "";
    return n.replace(/\s+/g, " ").replace(/[\r\n]+/g, " ").trim();
  }

  function initPlanBuilder() {
    const form = $("#planForm");
    const out = $("#planOut");
    const resetBtn = $("#planReset");
    if (!form || !out) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = sanitizeName(form.name.value);
      const area = form.area.value || "Soho";
      const vibe = form.vibe.value || "something cosy and not too loud";
      const time = form.time.value || "7:30";
      const money = form.money.value || "let’s just pay separately at the bar";
      const flex = form.flex.value || "and play it by ear afterwards";

      const opener = name ? (name + ":") : "Message:";
      const youLine = name ? (name + ":") : "You:";

      const text =
        opener + " Fancy a night out? I'm up for " + vibe + " — maybe around " + area + ".\n" +
        youLine + " Shall we meet at " + time + " outside the station? If we go early, we’ll actually get a table.\n" +
        youLine + " For money: " + money + ".\n" +
        youLine + " If the first place is packed, we can pop somewhere else " + flex + ".\n" +
        youLine + " What do you think?";

      out.value = text;
      out.classList.add("se-fade");
      setTimeout(() => out.classList.remove("se-fade"), 280);
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        form.reset();
        out.value = "";
      });
    }
  }

  function initPubBuilder() {
    const form = $("#pubForm");
    const out = $("#pubOut");
    const resetBtn = $("#pubReset");
    if (!form || !out) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const drink = form.drink.value || "a pint of lager";
      const friendDrink = form.friendDrink.value || "a gin and tonic";
      const problem = form.problem.value || "the music is a bit too loud";
      const tone = form.tone.value || "very polite and calm";

      const text =
        "Bartender: Hi there — what can I get you?\n" +
        "You: Could I have " + drink + ", please? And " + friendDrink + ", please.\n" +
        "Bartender: No worries. Anything else?\n" +
        "You: Not for now, thanks.\n" +
        "— (a few minutes later) —\n" +
        "You: Sorry — could I ask you something? I think " + problem + ".\n" +
        "You: I'm trying to be " + tone + ", but would you mind checking what you can do?\n" +
        "Bartender: Of course — let me have a look.\n" +
        "You: Thanks, I appreciate it.";

      out.value = text;
      out.classList.add("se-fade");
      setTimeout(() => out.classList.remove("se-fade"), 280);
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        form.reset();
        out.value = "";
      });
    }
  }

  // ---------- TTS (speechSynthesis) ----------
  function speakText(text) {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    stopSpeech();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  }

  function stopSpeech() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  function initTtsButtons() {
    $all("[data-tts]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tts");
        const el = target ? $(target) : null;
        const text = el && ("value" in el) ? el.value : (el ? el.textContent : "");
        if (!text || !text.trim()) return;
        speakText(text.trim());
      });
    });
    $all("[data-tts-stop]").forEach(btn => btn.addEventListener("click", stopSpeech));
    window.addEventListener("beforeunload", stopSpeech);
  }

  // ---------- Timer ----------
  function initTimers() {
    $all("[data-timer]").forEach(timer => {
      const timeEl = $("[data-time]", timer);
      const noteEl = $("[data-timer-note]", timer);
      const startBtn = $("[data-start]", timer);
      const pauseBtn = $("[data-pause]", timer);
      const resetBtn = $("[data-reset-timer]", timer);

      const totalSeconds = 90;
      let remaining = totalSeconds;
      let tick = null;

      function render() {
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        if (timeEl) timeEl.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
      }

      function setNote(msg) {
        if (noteEl) noteEl.textContent = msg || "";
      }

      function start() {
        if (tick) return;
        setNote("Speak now. Don’t stop to correct yourself.");
        tick = setInterval(() => {
          remaining = Math.max(0, remaining - 1);
          render();
          if (remaining === 0) {
            stop();
            setNote("Time! Quick reflection: Did you hedge politely? Did you give reasons?");
          }
        }, 1000);
      }

      function stop() {
        if (tick) clearInterval(tick);
        tick = null;
      }

      function reset() {
        stop();
        remaining = totalSeconds;
        render();
        setNote("");
      }

      if (startBtn) startBtn.addEventListener("click", start);
      if (pauseBtn) pauseBtn.addEventListener("click", stop);
      if (resetBtn) resetBtn.addEventListener("click", reset);

      render();
    });
  }

  // ---------- Init ----------
  setHeroFromBodyData();
  initMatching($("#match-vocab"));
  initMcq($("#mcq-grammar"));
  initMcq($("#mcq-reading"));
  initMcq($("#mcq-errors"));
  initPlanBuilder();
  initPubBuilder();
  initTtsButtons();
  initTimers();

})();