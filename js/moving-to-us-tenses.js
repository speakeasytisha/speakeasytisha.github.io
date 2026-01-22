/* SpeakEasyTisha — Moving to the USA tenses lesson
   Present Simple vs Present Continuous + Present Continuous for Future + Present Perfect.
   Touch-friendly: every drag activity also has TAP MODE. Instant feedback + hints. Global score + US/UK TTS.
*/
(function(){
  "use strict";

  /* ---------------------------
     Helpers
  ----------------------------*/
  function $(id){ return document.getElementById(id); }
  function esc(s){
    return String(s).replace(/[&<>"]/g, function(c){
      return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" })[c];
    });
  }
  function norm(s){ return String(s||"").trim().toLowerCase(); }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function isTouch(){
    return (("ontouchstart" in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints>0));
  }
  function toText(el){
    return (el && (el.innerText || el.textContent) || "").trim();
  }

  /* ---------------------------
     Persistent state (localStorage)
  ----------------------------*/
  var KEY = "SET_TENSES_US_MOVE_V1";
  var state = {
    accent: "US",
    fr: false,
    score: 0,
    solved: {} // ids => true
  };

  function load(){
    try{
      var raw = localStorage.getItem(KEY);
      if(raw){
        var obj = JSON.parse(raw);
        if(obj && typeof obj==="object"){
          state.accent = (obj.accent==="UK") ? "UK" : "US";
          state.fr = !!obj.fr;
          state.score = (typeof obj.score==="number") ? obj.score : 0;
          state.solved = obj.solved && typeof obj.solved==="object" ? obj.solved : {};
        }
      }
    }catch(e){}
  }
  function save(){
    try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){}
  }

  function setScore(n){
    state.score = clamp(n, 0, 999999);
    $("scoreTop").textContent = String(state.score);
    $("scoreBottom").textContent = String(state.score);
    save();
  }
  function addScore(delta){
    setScore(state.score + delta);
  }

  /* ---------------------------
     Accent + French help toggles
  ----------------------------*/
  function syncAccentUI(){
    var us = $("accentUS"), uk = $("accentUK");
    us.setAttribute("aria-pressed", state.accent==="US" ? "true":"false");
    uk.setAttribute("aria-pressed", state.accent==="UK" ? "true":"false");
  }
  function syncFrUI(){
    var off = $("frOff"), on = $("frOn");
    off.setAttribute("aria-pressed", state.fr ? "false":"true");
    on.setAttribute("aria-pressed", state.fr ? "true":"false");
    document.body.classList.toggle("frOn", state.fr);
  }

  /* ---------------------------
     Speech synthesis (US/UK)
  ----------------------------*/
  var voices = [];
  var voiceReady = false;

  function pickVoice(){
    if(!voices || !voices.length) return null;
    var want = (state.accent==="UK") ? ["en-GB","en_GB","English (United Kingdom)","British"] : ["en-US","en_US","English (United States)","American"];
    // Prefer specific locale
    for(var i=0;i<want.length;i++){
      for(var j=0;j<voices.length;j++){
        var v = voices[j];
        var lang = (v.lang||"");
        var name = (v.name||"");
        if(lang.indexOf(want[i])===0) return v;
        if(name.toLowerCase().indexOf(want[i].toLowerCase())>=0) return v;
      }
    }
    // fallback: any English
    for(var k=0;k<voices.length;k++){
      if((voices[k].lang||"").toLowerCase().indexOf("en")===0) return voices[k];
    }
    return voices[0] || null;
  }

  function refreshVoices(){
    try{
      voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      voiceReady = !!(voices && voices.length);
      $("voiceStatus").textContent = voiceReady ? ("Voice: " + (pickVoice() ? pickVoice().name : "ready")) : "Voice: loading…";
    }catch(e){
      $("voiceStatus").textContent = "Voice: unavailable";
    }
  }

  function speak(text){
    if(!window.speechSynthesis){ return; }
    try{
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      var v = pickVoice();
      if(v) u.voice = v;
      // Slightly slower to help learners
      u.rate = 0.95;
      u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }

  /* ---------------------------
     Flashcards
  ----------------------------*/
  var flashData = {
    moving: [
      { icon:"🏠", front:"move in", back:"Start living in a new home.\nExample: We move in on Saturday.\nFR: emménager" },
      { icon:"📦", front:"pack", back:"Put items in boxes to move.\nExample: I’m packing the kitchen right now.\nFR: faire ses cartons" },
      { icon:"🧾", front:"lease", back:"A rental contract for an apartment/house.\nExample: We signed the lease yesterday.\nFR: bail" },
      { icon:"🗝️", front:"keys", back:"The keys to your home.\nExample: We’ve just received the keys.\nFR: les clés" }
    ],
    school: [
      { icon:"🚌", front:"school bus", back:"A bus that takes children to school.\nExample: The bus arrives at 7:55.\nFR: bus scolaire" },
      { icon:"📝", front:"enroll / register", back:"Officially sign up a child for school.\nExample: We’re enrolling our daughter this week.\nFR: inscrire" },
      { icon:"📅", front:"schedule", back:"Plan a time/meeting.\nExample: I’m scheduling an appointment.\nFR: planifier / fixer" },
      { icon:"🎒", front:"drop off / pick up", back:"Bring your child to school / collect your child.\nExample: I drop them off at 8:10.\nFR: déposer / récupérer" }
    ],
    appointments: [
      { icon:"🏥", front:"appointment", back:"A planned meeting with a doctor/school.\nExample: We’re meeting the pediatrician tomorrow.\nFR: rendez-vous" },
      { icon:"📄", front:"fill out a form", back:"Complete a document with information.\nExample: I’m filling out the health form.\nFR: remplir un formulaire" },
      { icon:"📨", front:"email", back:"Send a message by email.\nExample: I’ll email the registrar now.\nFR: envoyer un mail" },
      { icon:"☎️", front:"call", back:"Phone someone.\nExample: I’m calling the school office.\nFR: appeler" }
    ]
  };

  var fc = { theme:"moving", idx:0, order:[] };

  function shuffle(arr){
    var a = arr.slice();
    for(var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }

  function fcBuildOrder(){
    var n = flashData[fc.theme].length;
    fc.order = [];
    for(var i=0;i<n;i++) fc.order.push(i);
  }

  function fcRender(){
    var list = flashData[fc.theme];
    if(!list || !list.length) return;
    fc.idx = clamp(fc.idx, 0, list.length-1);
    var card = list[fc.order[fc.idx]];
    $("fcFront").innerHTML = '<div class="fcTop"><div class="fcIcon" aria-hidden="true">'+esc(card.icon)+'</div><div class="fcWord">'+esc(card.front)+'</div></div><div class="fcSub muted">Tap to flip</div>';
    var back = card.back;
    if(!state.fr){
      // remove FR line for non-FR mode
      back = back.replace(/\nFR:.*$/m, "");
    }
    $("fcBack").innerHTML = '<div class="fcSub">'+esc(back)+'</div><div class="fcSub muted" style="margin-top:10px;">Tap to flip back</div>';
    $("flashcard").classList.remove("is-flipped");
  }

  function fcNext(){ fc.idx++; if(fc.idx>=fc.order.length) fc.idx=0; fcRender(); }
  function fcPrev(){ fc.idx--; if(fc.idx<0) fc.idx=fc.order.length-1; fcRender(); }
  function fcShuffle(){
    fc.order = shuffle(fc.order);
    fc.idx = 0;
    fcRender();
  }

  /* ---------------------------
     MCQ builder (retry until correct)
  ----------------------------*/
  function renderMCQ(targetId, questions, pointsEach){
    var host = $(targetId);
    if(!host) return;

    host.innerHTML = "";

    questions.forEach(function(q, qi){
      var qid = targetId + "__" + qi;
      var solved = !!state.solved[qid];

      var box = document.createElement("div");
      box.className = "q";
      box.setAttribute("data-qid", qid);

      var prompt = document.createElement("div");
      prompt.className = "q__prompt";
      prompt.innerHTML = esc(q.prompt);
      box.appendChild(prompt);

      if(q.meta){
        var meta = document.createElement("div");
        meta.className = "q__meta";
        meta.textContent = q.meta;
        box.appendChild(meta);
      }

      var opts = document.createElement("div");
      opts.className = "q__opts";

      q.options.forEach(function(optText, oi){
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "opt";
        btn.innerHTML = esc(optText);
        btn.disabled = solved;
        btn.addEventListener("click", function(){
          if(state.solved[qid]) return;

          var correct = (oi === q.answer);
          var fb = box.querySelector(".q__fb");
          if(correct){
            box.classList.remove("bad");
            box.classList.add("ok");
            fb.innerHTML =
              '<div class="fbTitle">✅ Correct</div>' +
              '<div class="fbText">' + esc(q.explain || "Nice!") + '</div>';
            // award only once
            state.solved[qid] = true;
            save();
            addScore(pointsEach);

            // disable all options
            var all = box.querySelectorAll(".opt");
            for(var k=0;k<all.length;k++) all[k].disabled = true;
          }else{
            box.classList.remove("ok");
            box.classList.add("bad");
            var hint = q.hint ? ('<div class="fbText"><strong>Hint:</strong> '+esc(q.hint)+'</div>') : "";
            fb.innerHTML =
              '<div class="fbTitle">❌ Not quite</div>' +
              hint +
              '<div class="fbText">'+ esc(q.explainWrong || "Try again.") +'</div>';
          }
        });
        opts.appendChild(btn);
      });
      box.appendChild(opts);

      var fbWrap = document.createElement("div");
      fbWrap.className = "q__fb";
      fbWrap.setAttribute("aria-live","polite");
      if(solved){
        box.classList.add("ok");
        fbWrap.innerHTML = '<div class="fbTitle">✅ Completed</div><div class="fbText">'+esc(q.explain || "Good job!")+'</div>';
      }
      box.appendChild(fbWrap);

      host.appendChild(box);
    });
  }

  /* ---------------------------
     Sentence builder (drag or tap)
  ----------------------------*/
  function renderBuilders(targetId, items, pointsEach){
    var host = $(targetId);
    if(!host) return;
    host.innerHTML = "";

    items.forEach(function(it, idx){
      var bid = targetId + "__" + idx;
      var solved = !!state.solved[bid];

      var box = document.createElement("div");
      box.className = "builder";
      box.setAttribute("data-bid", bid);

      var row = document.createElement("div");
      row.className = "builder__row";
      row.innerHTML = '<div><strong>'+esc(it.title)+'</strong><div class="tiny muted">'+esc(it.subtitle || "On touch: tap a tile → tap the sentence box. On desktop: drag & drop.")+'</div></div>';
      box.appendChild(row);

      var drop = document.createElement("div");
      drop.className = "dropzone";
      drop.setAttribute("role","group");
      drop.setAttribute("aria-label","Sentence box");
      drop.innerHTML = '<div class="dropzone__text">Sentence:</div><div class="dropzone__built"></div>';
      box.appendChild(drop);

      var built = drop.querySelector(".dropzone__built");

      var bank = document.createElement("div");
      bank.className = "tilebank";
      box.appendChild(bank);

      var selectedTile = null;

      function makeTile(word){
        var t = document.createElement("div");
        t.className = "tile";
        t.setAttribute("tabindex","0");
        t.textContent = word;

        // drag support
        t.draggable = true;
        t.addEventListener("dragstart", function(e){
          e.dataTransfer.setData("text/plain", word);
          e.dataTransfer.effectAllowed = "move";
          selectedTile = t;
          markSelected();
        });

        // tap support
        t.addEventListener("click", function(){
          selectedTile = (selectedTile===t) ? null : t;
          markSelected();
        });
        t.addEventListener("keydown", function(e){
          if(e.key==="Enter" || e.key===" "){
            e.preventDefault();
            selectedTile = (selectedTile===t) ? null : t;
            markSelected();
          }
        });

        return t;
      }

      function markSelected(){
        var tiles = bank.querySelectorAll(".tile");
        for(var i=0;i<tiles.length;i++){
          tiles[i].classList.toggle("is-selected", tiles[i]===selectedTile);
        }
      }

      function addBuilt(word){
        // remove from bank
        var tiles = bank.querySelectorAll(".tile");
        for(var i=0;i<tiles.length;i++){
          if(tiles[i].textContent===word){
            bank.removeChild(tiles[i]);
            break;
          }
        }
        // add to built area
        var bt = document.createElement("span");
        bt.className = "builtTile";
        bt.textContent = word;
        bt.title = "Tap to remove";
        bt.addEventListener("click", function(){
          // put back to bank (at end)
          bank.appendChild(makeTile(word));
          built.removeChild(bt);
          selectedTile = null;
          markSelected();
        });
        built.appendChild(bt);
        selectedTile = null;
        markSelected();
      }

      // Drop zone: drag & drop
      drop.addEventListener("dragover", function(e){
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });
      drop.addEventListener("drop", function(e){
        e.preventDefault();
        if(state.solved[bid]) return;
        var word = e.dataTransfer.getData("text/plain");
        if(word) addBuilt(word);
      });

      // Tap mode: tap drop zone to place selected tile
      drop.addEventListener("click", function(){
        if(state.solved[bid]) return;
        if(selectedTile){
          addBuilt(selectedTile.textContent);
        }
      });

      // Fill initial bank
      it.tiles.forEach(function(w){ bank.appendChild(makeTile(w)); });

      // Actions
      var actions = document.createElement("div");
      actions.className = "builder__actions";
      actions.innerHTML = '' +
        '<button class="btn btn--ghost" type="button">Hint</button>' +
        '<button class="btn" type="button">✅ Check</button>' +
        '<button class="btn btn--ghost" type="button">↺ Reset</button>' +
        '<button class="btn btn--ghost" type="button">Listen</button>';
      box.appendChild(actions);

      var btnHint = actions.querySelectorAll("button")[0];
      var btnCheck = actions.querySelectorAll("button")[1];
      var btnReset = actions.querySelectorAll("button")[2];
      var btnListen = actions.querySelectorAll("button")[3];

      var fb = document.createElement("div");
      fb.className = "feedback";
      fb.style.display = "none";
      fb.setAttribute("aria-live","polite");
      box.appendChild(fb);

      function currentSentence(){
        var parts = [];
        var kids = built.querySelectorAll(".builtTile");
        for(var i=0;i<kids.length;i++) parts.push(kids[i].textContent);
        return parts.join(" ").replace(/\s+/g," ").trim();
      }

      function reset(){
        // move built back to bank
        var kids = Array.prototype.slice.call(built.querySelectorAll(".builtTile"));
        kids.forEach(function(bt){
          var w = bt.textContent;
          built.removeChild(bt);
          bank.appendChild(makeTile(w));
        });
        // make sure bank has original set (in case of duplicates)
        selectedTile = null;
        markSelected();
        fb.style.display = "none";
        fb.classList.remove("ok","bad");
        fb.textContent = "";
      }

      btnHint.addEventListener("click", function(){
        fb.style.display = "block";
        fb.classList.remove("ok","bad");
        fb.innerHTML = "<strong>Hint:</strong> " + esc(it.hint || "Look for the auxiliary (do/does or am/is/are).");
      });

      btnListen.addEventListener("click", function(){
        var s = currentSentence();
        if(!s) s = it.answer.join(" ");
        speak(s);
      });

      btnReset.addEventListener("click", function(){
        reset();
      });

      btnCheck.addEventListener("click", function(){
        if(state.solved[bid]) return;
        var got = currentSentence();
        var want = it.answer.join(" ").trim();
        var ok = norm(got) === norm(want);

        fb.style.display = "block";
        if(ok){
          fb.classList.remove("bad");
          fb.classList.add("ok");
          fb.innerHTML = "<strong>✅ Correct</strong><div class='tiny muted' style='margin-top:6px;'>" + esc(it.explain || "Great.") + "</div>";
          state.solved[bid] = true;
          save();
          addScore(pointsEach);

          // lock: disable dragging and clicking
          var allTiles = box.querySelectorAll(".tile");
          for(var i=0;i<allTiles.length;i++){
            allTiles[i].draggable = false;
            allTiles[i].style.opacity = ".6";
          }
          btnCheck.disabled = true;
        }else{
          fb.classList.remove("ok");
          fb.classList.add("bad");
          fb.innerHTML = "<strong>❌ Not quite</strong><div class='tiny muted' style='margin-top:6px;'>Try again. Tip: include the auxiliary and the subject in the right place.</div>";
        }
      });

      if(solved){
        // show solved sentence
        fb.style.display = "block";
        fb.classList.add("ok");
        fb.innerHTML = "<strong>✅ Completed</strong><div class='tiny muted' style='margin-top:6px;'>" + esc(it.answer.join(" ")) + "</div>";
        // build sentence visually
        it.answer.forEach(function(w){
          addBuilt(w);
        });
        // lock
        btnCheck.disabled = true;
        btnHint.disabled = true;
        btnReset.disabled = true;
      }

      host.appendChild(box);
    });
  }

  /* ---------------------------
     Fill-in (select) builder
  ----------------------------*/
  function renderFills(targetId, items, pointsEach){
    var host = $(targetId);
    if(!host) return;
    host.innerHTML = "";

    items.forEach(function(it, idx){
      var fid = targetId + "__" + idx;
      var solved = !!state.solved[fid];

      var box = document.createElement("div");
      box.className = "fill";
      box.setAttribute("data-fid", fid);

      var line = document.createElement("div");
      line.className = "fillLine";
      line.innerHTML = esc(it.before) + " ";

      var sel = document.createElement("select");
      sel.className = "select inlineSelect";
      sel.setAttribute("aria-label","Choose an option");
      it.options.forEach(function(o, oi){
        var opt = document.createElement("option");
        opt.value = String(oi);
        opt.textContent = o;
        sel.appendChild(opt);
      });
      sel.disabled = solved;
      line.appendChild(sel);

      var after = document.createElement("span");
      after.textContent = " " + it.after;
      line.appendChild(after);

      box.appendChild(line);

      var actions = document.createElement("div");
      actions.className = "builder__actions";
      actions.innerHTML = '' +
        '<button class="btn btn--ghost" type="button">Hint</button>' +
        '<button class="btn" type="button">✅ Check</button>' +
        '<button class="btn btn--ghost" type="button">↺ Reset</button>';
      box.appendChild(actions);

      var btnHint = actions.querySelectorAll("button")[0];
      var btnCheck = actions.querySelectorAll("button")[1];
      var btnReset = actions.querySelectorAll("button")[2];

      var fb = document.createElement("div");
      fb.className = "feedback";
      fb.style.display = "none";
      fb.setAttribute("aria-live","polite");
      box.appendChild(fb);

      function reset(){
        sel.selectedIndex = 0;
        fb.style.display = "none";
        fb.classList.remove("ok","bad");
        fb.textContent = "";
      }

      btnHint.addEventListener("click", function(){
        fb.style.display = "block";
        fb.classList.remove("ok","bad");
        fb.innerHTML = "<strong>Hint:</strong> " + esc(it.hint || "");
      });

      btnReset.addEventListener("click", reset);

      btnCheck.addEventListener("click", function(){
        if(state.solved[fid]) return;
        var ok = sel.selectedIndex === it.answer;
        fb.style.display = "block";
        if(ok){
          fb.classList.remove("bad");
          fb.classList.add("ok");
          fb.innerHTML = "<strong>✅ Correct</strong><div class='tiny muted' style='margin-top:6px;'>" + esc(it.explain || "") + "</div>";
          state.solved[fid] = true;
          save();
          addScore(pointsEach);
          sel.disabled = true;
          btnCheck.disabled = true;
        }else{
          fb.classList.remove("ok");
          fb.classList.add("bad");
          fb.innerHTML = "<strong>❌ Not quite</strong><div class='tiny muted' style='margin-top:6px;'>Try another option.</div>";
        }
      });

      if(solved){
        sel.selectedIndex = it.answer;
        fb.style.display = "block";
        fb.classList.add("ok");
        fb.innerHTML = "<strong>✅ Completed</strong><div class='tiny muted' style='margin-top:6px;'>" + esc(it.explain || "") + "</div>";
        sel.disabled = true;
        btnCheck.disabled = true;
      }

      host.appendChild(box);
    });
  }

  /* ---------------------------
     Self-check tool (simple heuristics)
  ----------------------------*/
  function runSelfCheck(){
    var s = ($("selfCheckInput").value || "").trim();
    var out = $("selfCheckOut");
    out.classList.remove("ok","bad");
    out.innerHTML = "";
    if(!s){
      out.textContent = "Type a sentence first.";
      return;
    }

    var low = s.toLowerCase();
    var warnings = [];
    var suggestions = [];

    // "I am here since" / "I live ... for 10 years"
    if(/\b(i|we|you|he|she|they)\s+am\s+here\s+since\b/.test(low) || /\b(i|we|you|he|she|they)\s+is\s+here\s+since\b/.test(low)){
      warnings.push('You used “am/is here since…”. English usually uses present perfect: “I have been here since …”.');
      suggestions.push('✅ I have been here since 2020.');
    }
    if(/\b(i|we|you|he|she|they)\s+(live|work|know|study)\s+in\b.*\b(for|since)\b.*\byears?\b/.test(low)){
      warnings.push('With “for/since + duration”, English often prefers present perfect: “I have lived/worked/known…”.');
      suggestions.push('✅ I have lived here for 5 years.');
    }

    // present perfect + finished time marker
    if(/\b(yesterday|last\s+week|last\s+year|in\s+\d{4})\b/.test(low) && /\b(have|has)\b/.test(low)){
      warnings.push('You used present perfect with a finished time expression (yesterday / last week / in 2019). Use past simple instead.');
      suggestions.push('✅ Yesterday, we met the principal.');
    }

    // since/for swap
    if(/\bsince\s+\d+\s+(years?|months?|weeks?)\b/.test(low)){
      warnings.push('“Since” is usually followed by a starting point (since 2020, since Monday). For a duration, use “for”.');
      suggestions.push('✅ I have lived here for 3 years.');
    }
    if(/\bfor\s+(20\d{2}|19\d{2}|\w+day|\w+month|\w+year)\b/.test(low) && /\bfor\s+2020\b/.test(low)){
      warnings.push('“For” is for duration; “since” is for a starting point (since 2020).');
      suggestions.push('✅ I have lived here since 2020.');
    }

    if(!warnings.length){
      out.classList.add("ok");
      out.innerHTML = "<strong>✅ Looks OK</strong><div class='tiny muted' style='margin-top:6px;'>No obvious French-native tense warning detected.</div>";
      return;
    }

    out.classList.add("bad");
    out.innerHTML = "<strong>⚠️ Possible tense issue</strong><ul style='margin:8px 0 0; padding-left:18px; color:inherit;'>";
    warnings.forEach(function(w){ out.innerHTML += "<li>"+esc(w)+"</li>"; });
    out.innerHTML += "</ul>";
    if(suggestions.length){
      out.innerHTML += "<div class='tiny muted' style='margin-top:10px;'><strong>Try:</strong><br/>" + suggestions.map(esc).join("<br/>") + "</div>";
    }
  }

  /* ---------------------------
     Builder generator (background)
  ----------------------------*/
  function buildIntro(){
    var name = ($("b_name").value || "I").trim();
    var from = ($("b_from").value || "France").trim();
    var years = ($("b_years_fr").value || "").trim();
    var job = ($("b_job").value || "a professional").trim();
    var kids = ($("b_kids").value || "three children").trim();
    var to = ($("b_to").value || "the US").trim();
    var arrival = ($("b_arrival").value || "").trim();
    var plan = ($("b_plan").value || "").trim();

    var you = (name.toLowerCase()==="i") ? "I" : name;
    var isI = (you === "I");
    var subj = isI ? "I" : you;

    var lines = [];
    // Present perfect for duration
    if(years){
      lines.push(subj + " " + (isI ? "have" : "has") + " lived in France for " + years + " years.");
    }else{
      lines.push(subj + " " + (isI ? "have" : "has") + " lived in France for several years.");
    }
    // Background + now
    lines.push((isI ? "I’m" : (subj + " is")) + " " + job + ".");
    lines.push((isI ? "I’m" : (subj + " is")) + " moving to " + to + " with my children (" + kids + ").");
    // Present continuous for arrangement (if given)
    if(plan){
      // make it "We’re ..." if looks like verb phrase
      var p = plan;
      var start = p.split(" ")[0].toLowerCase();
      var lead = "We’re ";
      // if user wrote "meet..." etc, keep
      if(/^to\b/.test(start)) lead = "We’re ";
      lines.push(lead + p.replace(/^\s*(we are|we're|i am|i'm|we’re)\s+/i,"") + ".");
    }else{
      lines.push("We’re getting organized this week: schools, housing, and appointments.");
    }
    // Routine (present simple)
    lines.push("Right now, we are preparing paperwork, and we check emails every day.");
    // Arrival detail
    if(arrival){
      lines.push("We’re arriving " + arrival + ".");
    }

    var out = lines.join("\n");

    $("builderOut").textContent = out;

    // Explanation
    var exp = [];
    exp.push("• Present perfect: “have lived” connects the past to now (how long).");
    exp.push("• Present simple: “we check emails every day” = routine.");
    exp.push("• Present continuous: “we’re getting organized / we’re arriving …” = current temporary action or arranged future plan.");
    $("builderExplain").textContent = exp.join("\n");

    return out;
  }

  function copyText(text){
    try{
      navigator.clipboard.writeText(text);
    }catch(e){
      // fallback
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  }

  /* ---------------------------
     Practice dialogue generator
  ----------------------------*/
  function buildDialogue(){
    var scenario = $("p_scenario").value;
    var name = ($("p_name").value || "I").trim();
    var city = ($("p_city").value || "your town").trim();
    var plan = ($("p_plan").value || "").trim();
    var who = (name.toLowerCase()==="i") ? "I" : name;

    var lines = [];
    function add(s){ lines.push(s); }

    if(scenario==="school"){
      add("School Office: Good morning, " + city + " Public Schools. How can I help you?");
      add(who + ": Hi — we’re moving from France and we’re enrolling our children.");
      if(plan){
        add(who + ": We’re " + plan.replace(/^\s*(we are|we're|we’re)\s+/i,"") + ".");
      }else{
        add(who + ": We’re hoping to schedule an enrollment appointment for next week.");
      }
      add("School Office: Of course. Do you have proof of residency and immunization records?");
      add(who + ": We have the documents, and we’re gathering the rest right now. Could you please email me the checklist?");
      add("School Office: Absolutely.");
    }else if(scenario==="doctor"){
      add("Clinic: Hello, " + city + " Pediatrics. How can we help?");
      add(who + ": Hi, I’m looking for a pediatrician for my children.");
      add(who + ": We’ve just moved to the area, and we need a first appointment.");
      if(plan){
        add(who + ": We’re " + plan.replace(/^\s*(we are|we're|we’re)\s+/i,"") + ".");
      }else{
        add(who + ": We’re available on Tuesday or Wednesday morning.");
      }
      add("Clinic: Great — can I take your name and phone number?");
      add(who + ": Yes. Also, do you accept new patients?");
    }else if(scenario==="housing"){
      add("Landlord: Hi! Thanks for your interest in the apartment.");
      add(who + ": Thank you. We’re moving to " + city + " with our children.");
      add(who + ": We’ve reviewed the listing, and we’d like to ask a few questions.");
      add("Landlord: Sure. When are you planning to move in?");
      if(plan){
        add(who + ": We’re " + plan.replace(/^\s*(we are|we're|we’re)\s+/i,"") + ".");
      }else{
        add(who + ": We’re moving in next month.");
      }
      add("Landlord: Great. Do you have proof of income and references?");
      add(who + ": Yes, we do.");
    }else if(scenario==="neighbor"){
      add("Neighbor: Hi! Welcome to the neighborhood.");
      add(who + ": Thank you! We’ve just moved in.");
      add(who + ": My kids go to school nearby, and we’re still learning how everything works here.");
      add("Neighbor: If you need anything, just let me know.");
      if(plan){
        add(who + ": Thanks — we’re " + plan.replace(/^\s*(we are|we're|we’re)\s+/i,"") + ", so we’re a bit busy this week.");
      }else{
        add(who + ": Thanks — we’re getting settled this week, so we’re a bit busy.");
      }
      add("Neighbor: Totally understandable!");
    }else{ // dmv
      add("DMV Clerk: Next, please. How can I help you today?");
      add(who + ": Hi. I’m applying for a driver’s license.");
      add(who + ": I’ve brought my documents, and I’m filling out the form right now.");
      add("DMV Clerk: Great. Are you taking the written test today?");
      add(who + ": If possible, yes. Otherwise, I’ll schedule an appointment.");
    }

    var txt = lines.join("\n");
    $("practiceOut").textContent = txt;
    return txt;
  }

  /* ---------------------------
     Reset
  ----------------------------*/
  function resetAll(){
    state.score = 0;
    state.solved = {};
    save();
    setScore(0);

    // reset inputs
    ["selfCheckInput","b_name","b_from","b_years_fr","b_job","b_kids","b_to","b_arrival","b_plan","p_name","p_city","p_plan"].forEach(function(id){
      var el = $(id);
      if(el) el.value = "";
    });
    $("selfCheckOut").textContent = "";
    $("builderOut").textContent = "Fill the form and click “Generate intro”.";
    $("builderExplain").textContent = "After generating, you’ll see a quick breakdown of why each tense is used.";
    $("practiceOut").textContent = "Choose a scenario and click “Generate dialogue”.";

    // re-render exercises
    initExercises();
  }

  /* ---------------------------
     Data: exercises
  ----------------------------*/
  var Q_PSPC = [
    {
      prompt: "Every morning, I ____ the kids to school at 8:10.",
      options: ["take", "am taking"],
      answer: 0,
      hint: "Routine / habit = present simple.",
      explain: "Present simple for routines: “Every morning, I take the kids…”."
    },
    {
      prompt: "Shh — the baby ____ right now.",
      options: ["sleeps", "is sleeping"],
      answer: 1,
      hint: "Right now = present continuous.",
      explain: "Present continuous for actions happening now."
    },
    {
      prompt: "We usually ____ dinner at 6:30, but today we ____ earlier.",
      options: ["eat / are eating", "are eating / eat"],
      answer: 0,
      hint: "Usually = routine; today = temporary.",
      explain: "Present simple for “usually”, present continuous for “today”."
    },
    {
      prompt: "I can’t talk — I ____ out the school forms.",
      options: ["fill", "am filling"],
      answer: 1,
      hint: "Action in progress = continuous.",
      explain: "Present continuous: “I’m filling out…”."
    },
    {
      prompt: "My husband ____ in IT (this is his job).",
      options: ["works", "is working"],
      answer: 0,
      hint: "Job = general fact.",
      explain: "Present simple for permanent situation / job."
    },
    {
      prompt: "This month, we ____ with my sister until we find a house.",
      options: ["stay", "are staying"],
      answer: 1,
      hint: "Temporary situation (this month).",
      explain: "Present continuous for temporary arrangements."
    },
    {
      prompt: "The school office ____ at 8:00 a.m. (official schedule).",
      options: ["opens", "is opening"],
      answer: 0,
      hint: "Timetable = present simple.",
      explain: "Present simple for schedules/timetables."
    },
    {
      prompt: "Look! The kids ____ their backpacks.",
      options: ["carry", "are carrying"],
      answer: 1,
      hint: "Look! = right now.",
      explain: "Present continuous: “are carrying”."
    },
    {
      prompt: "I ____ French, but I ____ English every day.",
      options: ["speak / am practicing", "am speaking / practice"],
      answer: 0,
      hint: "Skill/fact vs current effort.",
      explain: "Present simple for ability; present continuous for a current temporary effort."
    },
    {
      prompt: "Our neighbors ____ very friendly.",
      options: ["are", "are being"],
      answer: 0,
      hint: "State verb “be” for general description.",
      explain: "Use “are” for a general description. “are being” changes the meaning (temporary behavior)."
    }
  ];

  var Q_STATE = [
    { prompt:"I ____ a new pediatrician. (need)", options:["need","am needing"], answer:0,
      hint:"State verbs are usually not continuous.", explain:"Say: “I need…”"
    },
    { prompt:"She ____ the address. (know)", options:["knows","is knowing"], answer:0,
      hint:"Know is a state verb.", explain:"Say: “She knows…”"
    },
    { prompt:"I ____ this school policy. (understand)", options:["understand","am understanding"], answer:0,
      hint:"Understand is usually not continuous.", explain:"Say: “I understand…”"
    },
    { prompt:"We ____ that the teacher is helpful. (believe)", options:["believe","are believing"], answer:0,
      hint:"Believe is usually not continuous.", explain:"Say: “We believe…”"
    }
  ];

  var BUILD_PSPC = [
    {
      title: "Builder 1",
      subtitle: "Ask about a routine (present simple)",
      tiles: ["What","time","do","the","kids","start","school","?"],
      answer: ["What","time","do","the","kids","start","school","?"],
      hint: "Use do + subject + base verb for present simple questions.",
      explain: "Present simple question with do: What time do the kids start school?"
    },
    {
      title: "Builder 2",
      subtitle: "Ask what’s happening now (present continuous)",
      tiles: ["What","are","you","doing","right","now","?"],
      answer: ["What","are","you","doing","right","now","?"],
      hint: "Use am/is/are + verb-ing.",
      explain: "Present continuous question: What are you doing right now?"
    },
    {
      title: "Builder 3",
      subtitle: "Ask about temporary plans (present continuous)",
      tiles: ["Are","you","meeting","the","teacher","tomorrow","?"],
      answer: ["Are","you","meeting","the","teacher","tomorrow","?"],
      hint: "Present continuous can describe arranged plans (with a future time).",
      explain: "Arranged plan: Are you meeting the teacher tomorrow?"
    }
  ];

  var Q_FUTURE = [
    {
      prompt: "We ____ the school counselor on Tuesday. (arranged appointment)",
      options: ["meet", "are meeting", "will meet", "are going to meet"],
      answer: 1,
      hint: "Arranged plan + future time → present continuous.",
      explain: "“We’re meeting…” sounds like a planned appointment."
    },
    {
      prompt: "The flight ____ at 7:10 p.m. (timetable)",
      options: ["leaves", "is leaving", "will leave", "is going to leave"],
      answer: 0,
      hint: "Timetable = present simple.",
      explain: "Use present simple for official schedules: “The flight leaves…”."
    },
    {
      prompt: "I forgot the form — I ____ email the school right now.",
      options: ["am emailing", "will", "am going to", "email"],
      answer: 1,
      hint: "Decision now = will.",
      explain: "Spontaneous decision: “I’ll email…”."
    },
    {
      prompt: "Look at those clouds — it ____ rain.",
      options: ["is going to", "is raining", "rains", "will"],
      answer: 0,
      hint: "Evidence = going to.",
      explain: "Strong evidence: “It’s going to rain.”"
    },
    {
      prompt: "This weekend, we ____ furniture. (intention/plan)",
      options: ["buy", "are buying", "are going to buy", "will buy"],
      answer: 2,
      hint: "Intention = going to.",
      explain: "Going to expresses intention/plan: “We’re going to buy…”."
    },
    {
      prompt: "Sorry, I can’t on Friday — I ____ the kids to the doctor.",
      options: ["take", "am taking", "will take", "am going to take"],
      answer: 1,
      hint: "Arranged plan with a time/day → continuous.",
      explain: "Planned appointment: “I’m taking the kids…”."
    }
  ];

  var F_FUTURE = [
    {
      before: "We",
      after: "the landlord tomorrow at 3:00 p.m.",
      options: ["meet", "are meeting", "will meet"],
      answer: 1,
      hint: "Planned appointment tomorrow.",
      explain: "Present continuous for arranged plans."
    },
    {
      before: "The school year",
      after: "in September.",
      options: ["starts", "is starting", "will start"],
      answer: 0,
      hint: "Official schedule/timetable.",
      explain: "Present simple for timetables."
    },
    {
      before: "I think I",
      after: "call the office now.",
      options: ["am", "will", "am going to"],
      answer: 1,
      hint: "Decision now.",
      explain: "Use “will” for a decision made now."
    },
    {
      before: "This afternoon, we’re",
      after: "the boxes into the car.",
      options: ["putting", "put", "will put"],
      answer: 0,
      hint: "Action in progress/temporary.",
      explain: "Present continuous: “we’re putting…”."
    }
  ];

  var Q_PP_VS_PAST = [
    {
      prompt: "This week, we ____ two schools. (unfinished time)",
      options: ["visited", "have visited"],
      answer: 1,
      hint: "This week = unfinished time (still in progress).",
      explain: "Present perfect: “This week, we have visited…”."
    },
    {
      prompt: "Yesterday, we ____ the principal. (finished time)",
      options: ["met", "have met"],
      answer: 0,
      hint: "Yesterday = finished time.",
      explain: "Past simple with yesterday."
    },
    {
      prompt: "I ____ in France for 20 years. (still true now)",
      options: ["lived", "have lived"],
      answer: 1,
      hint: "For + duration (still true) → present perfect.",
      explain: "Present perfect for a situation continuing to now."
    },
    {
      prompt: "In 2018, we ____ in Lyon. (finished time)",
      options: ["lived", "have lived"],
      answer: 0,
      hint: "In 2018 = finished period.",
      explain: "Past simple for finished time."
    },
    {
      prompt: "I ____ to Boston before. (experience)",
      options: ["went", "have been"],
      answer: 1,
      hint: "Experience (no specific past time).",
      explain: "Present perfect: “I have been to Boston…”."
    },
    {
      prompt: "We ____ just ____ the keys. (recent result)",
      options: ["have / received", "did / receive"],
      answer: 0,
      hint: "Just + result now → present perfect.",
      explain: "Present perfect: “We have just received…”."
    }
  ];

  var Q_FIX = [
    {
      prompt: "❌ I am here since 2020.",
      options: ["I have been here since 2020.", "I am here from 2020.", "I was here since 2020."],
      answer: 0,
      hint: "Since + starting point + still true → present perfect.",
      explain: "Use present perfect: have been."
    },
    {
      prompt: "❌ Yesterday, we have met the teacher.",
      options: ["Yesterday, we met the teacher.", "Yesterday, we have met the teacher.", "Yesterday, we meet the teacher."],
      answer: 0,
      hint: "Yesterday = finished time → past simple.",
      explain: "Past simple with finished time."
    },
    {
      prompt: "❌ I live in France for 20 years.",
      options: ["I have lived in France for 20 years.", "I live in France since 20 years.", "I lived in France for 20 years (still true)."],
      answer: 0,
      hint: "For + duration, still true → present perfect.",
      explain: "Present perfect is the natural correction here."
    },
    {
      prompt: "❌ I know her since three years.",
      options: ["I have known her for three years.", "I know her for three years.", "I have known her since three years."],
      answer: 0,
      hint: "Since + starting point, for + duration.",
      explain: "Known is a state verb; present perfect fits."
    }
  ];

  var Q_QUICK = [
    {
      prompt: "Choose the best line to say at the school office:",
      options: [
        "I am here since two months, I want register my child.",
        "I have been here for two months, and I’d like to enroll my child.",
        "I was here since two months and I enroll my child."
      ],
      answer: 1,
      hint: "Have been for + duration; enroll = verb.",
      explain: "Natural + polite + correct tenses."
    },
    {
      prompt: "Choose the best line for an arranged plan:",
      options: [
        "We meet the counselor tomorrow at 10.",
        "We are meeting the counselor tomorrow at 10.",
        "We will meeting the counselor tomorrow at 10."
      ],
      answer: 1,
      hint: "Arranged appointment + time/day.",
      explain: "Present continuous is most natural for arranged plans."
    },
    {
      prompt: "Choose the best line for a timetable:",
      options: [
        "The bus is arriving at 7:55 every day.",
        "The bus arrives at 7:55 every day.",
        "The bus will arrives at 7:55 every day."
      ],
      answer: 1,
      hint: "Regular schedule.",
      explain: "Present simple for timetables/routines."
    },
    {
      prompt: "Choose the best line for “right now”:",
      options: [
        "I fill out the form now.",
        "I am filling out the form right now.",
        "I am fill out the form right now."
      ],
      answer: 1,
      hint: "Am/is/are + verb-ing.",
      explain: "Present continuous for action in progress."
    }
  ];

  function initExercises(){
    renderMCQ("mcq_pspc", Q_PSPC, 2);
    renderMCQ("mcq_stateverbs", Q_STATE, 2);
    renderBuilders("builder_pspc", BUILD_PSPC, 5);
    renderMCQ("mcq_future", Q_FUTURE, 2);
    renderFills("fill_future", F_FUTURE, 2);
    renderMCQ("mcq_pp_vs_past", Q_PP_VS_PAST, 2);
    renderMCQ("mcq_fix_mistake", Q_FIX, 2);
    renderMCQ("mcq_quickcheck", Q_QUICK, 2);
  }

  /* ---------------------------
     Wire up UI
  ----------------------------*/
  function init(){
    load();
    setScore(state.score);
    syncAccentUI();
    syncFrUI();

    // Voice init
    refreshVoices();
    if(window.speechSynthesis){
      window.speechSynthesis.onvoiceschanged = function(){
        refreshVoices();
      };
      setTimeout(refreshVoices, 300);
      setTimeout(refreshVoices, 1200);
    }else{
      $("voiceStatus").textContent = "Voice: unavailable";
    }

    $("accentUS").addEventListener("click", function(){
      state.accent = "US"; save(); syncAccentUI(); refreshVoices();
    });
    $("accentUK").addEventListener("click", function(){
      state.accent = "UK"; save(); syncAccentUI(); refreshVoices();
    });

    $("frOff").addEventListener("click", function(){
      state.fr = false; save(); syncFrUI(); fcRender();
    });
    $("frOn").addEventListener("click", function(){
      state.fr = true; save(); syncFrUI(); fcRender();
    });

    $("btnTestVoice").addEventListener("click", function(){
      speak("Hello! This is your " + (state.accent==="UK" ? "British" : "American") + " voice. Let’s practice English together.");
    });

    // Print
    function doPrint(){ window.print(); }
    $("btnPrint").addEventListener("click", doPrint);
    $("btnPrint2").addEventListener("click", doPrint);

    // Reset
    $("btnResetAll").addEventListener("click", resetAll);
    $("btnResetAll2").addEventListener("click", resetAll);

    // Flashcards
    $("fcTheme").addEventListener("change", function(){
      fc.theme = $("fcTheme").value;
      fcBuildOrder();
      fc.idx = 0;
      fcRender();
    });
    $("fcShuffle").addEventListener("click", fcShuffle);
    $("fcNext").addEventListener("click", fcNext);
    $("fcPrev").addEventListener("click", fcPrev);
    $("fcListen").addEventListener("click", function(){
      var list = flashData[fc.theme];
      if(!list || !list.length) return;
      var card = list[fc.order[fc.idx]];
      speak(card.front + ". " + (card.back.split("\n")[0]));
    });
    var flashcard = $("flashcard");
    flashcard.addEventListener("click", function(){
      flashcard.classList.toggle("is-flipped");
    });
    flashcard.addEventListener("keydown", function(e){
      if(e.key==="Enter" || e.key===" "){
        e.preventDefault();
        flashcard.classList.toggle("is-flipped");
      }
    });

    fc.theme = $("fcTheme").value;
    fcBuildOrder();
    fcRender();

    // Section summary TTS buttons
    document.addEventListener("click", function(e){
      var t = e.target;
      if(t && t.matches && t.matches("[data-tts]")){
        var id = t.getAttribute("data-tts");
        var el = $(id);
        if(el) speak(toText(el));
      }
    });

    // Background builder
    $("btnBuild").addEventListener("click", function(){
      var txt = buildIntro();
      // score a small reward once per reset? keep it simple: no score here.
      $("builderOut").scrollIntoView({behavior: isTouch() ? "auto" : "smooth", block:"nearest"});
    });
    $("btnBuildCopy").addEventListener("click", function(){
      copyText($("builderOut").textContent || "");
    });
    $("btnBuildListen").addEventListener("click", function(){
      speak($("builderOut").textContent || "");
    });
    $("btnBuildReset").addEventListener("click", function(){
      ["b_name","b_from","b_years_fr","b_job","b_kids","b_to","b_arrival","b_plan"].forEach(function(id){ if($(id)) $(id).value=""; });
      $("builderOut").textContent = "Fill the form and click “Generate intro”.";
      $("builderExplain").textContent = "After generating, you’ll see a quick breakdown of why each tense is used.";
    });

    // Practice kit
    $("btnPractice").addEventListener("click", function(){
      var txt = buildDialogue();
      $("practiceOut").scrollIntoView({behavior: isTouch() ? "auto" : "smooth", block:"nearest"});
    });
    $("btnPracticeCopy").addEventListener("click", function(){ copyText($("practiceOut").textContent || ""); });
    $("btnPracticeListen").addEventListener("click", function(){ speak($("practiceOut").textContent || ""); });
    $("btnPracticeReset").addEventListener("click", function(){
      ["p_name","p_city","p_plan"].forEach(function(id){ if($(id)) $(id).value=""; });
      $("practiceOut").textContent = "Choose a scenario and click “Generate dialogue”.";
    });

    // Self-check
    $("btnSelfCheck").addEventListener("click", runSelfCheck);
    $("btnSelfCheckClear").addEventListener("click", function(){
      $("selfCheckInput").value = "";
      $("selfCheckOut").textContent = "";
      $("selfCheckOut").classList.remove("ok","bad");
    });
    $("selfCheckInput").addEventListener("keydown", function(e){
      if(e.key==="Enter"){
        e.preventDefault();
        runSelfCheck();
      }
    });

    // Exercises
    initExercises();
  }

  // expose for reset
  window.__initExercises = initExercises;

  init();
})();