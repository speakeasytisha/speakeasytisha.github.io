/* SpeakEasyTisha — CLOE Frankie Oral Mock (Last Lesson)
   Put this file in: /js/cloe-frankie-oral-last-lesson.js
*/
(function(){
  "use strict";
  var DATA = {"meta": {"title": "🎤 Frankie — CLOE Oral Mock (Last Lesson)", "version": "v1"}, "connectors": ["First of all,", "In addition,", "Also,", "However,", "That said,", "For example,", "Overall,", "To sum up,"], "scenarios": [{"id": "intro-60", "cat": "About you", "title": "Self‑introduction (60s)", "prompt": "Please introduce yourself: where you are from, where you live, and one or two personal details.", "context": "Keep it clear and structured. Aim for calm, simple English.", "recommended": 60, "plan": ["1) Start (name + where you’re from).", "2) Location (where you live + prepositions: in / near / north of…).", "3) 2 personal details (family / pet / hobbies).", "4) Closing + one question back."], "model": ["Hello, my name is Frankie. I’m from northern France.", "I live near Lille, in the north of France. It’s close to Belgium, and I really enjoy the calm environment.", "I have three grown children, and we also have a female dog. In my free time, I like drawing and painting, especially landscapes and flowers, and I enjoy going for walks and listening to zen music.", "Overall, I’m friendly and organised. Could you tell me what the first topic will be today?"], "followUps": ["Why do you like living near Lille?", "What do you enjoy painting the most?", "What do you usually do at the weekend?", "Do you prefer the city or the countryside? Why?"], "vocab": [{"icon": "🧭", "en": "in the north of", "fr": "dans le nord de", "def": "preposition phrase for location", "ex": "I live in the north of France."}, {"icon": "📍", "en": "near", "fr": "près de", "def": "close to a place", "ex": "I live near Lille."}, {"icon": "🖼️", "en": "landscape", "fr": "paysage", "def": "a view of nature (mountains, fields, sea)", "ex": "I like painting landscapes."}, {"icon": "🎨", "en": "to draw / to paint", "fr": "dessiner / peindre", "def": "to create art with a pencil or paint", "ex": "I draw portraits and paint flowers."}, {"icon": "🐶", "en": "a female dog", "fr": "une chienne", "def": "a dog (female)", "ex": "We have a female dog."}, {"icon": "🎵", "en": "relaxing / zen music", "fr": "musique relaxante / zen", "def": "calm music that helps you relax", "ex": "I listen to zen music in the evening."}, {"icon": "🚶", "en": "to go for a walk", "fr": "aller se promener", "def": "to walk for pleasure", "ex": "I go for walks after work."}], "builderBlocks": ["Hello, my name is Frankie. I’m from northern France.", "I live near Lille, in the north of France.", "It’s close to Belgium, and I enjoy the calm environment.", "I have three grown children and we have a female dog.", "In my free time, I like drawing and painting (landscapes, flowers, portraits).", "I also enjoy going for walks and listening to zen music.", "Overall, I’m friendly and organised.", "Could you tell me what the first topic will be today?"], "fill": {"template": "Hello, my name is Frankie. I’m {from} northern France.\n\nI live {near} Lille, {region} the north {of} France. It’s close {to} Belgium.\n\nIn my free time, I like drawing and painting {especially} landscapes and flowers. Overall, I’m happy to practise.", "blanks": {"from": {"opts": ["from", "in", "at"], "a": "from"}, "near": {"opts": ["near", "on", "under"], "a": "near"}, "region": {"opts": ["in", "at", "to"], "a": "in"}, "of": {"opts": ["of", "off", "for"], "a": "of"}, "to": {"opts": ["to", "too", "two"], "a": "to"}, "especially": {"opts": ["especially", "special", "specially"], "a": "especially"}}}, "builderEasyBlocks": ["Hello, my name is Frankie. I’m from northern France.", "I live near Lille, in the north of France, close to Belgium.", "In my free time, I like drawing and painting, and I enjoy going for walks and listening to zen music.", "Overall, I’m happy to practise. Could you tell me the first topic today?"]}, {"id": "work-90", "cat": "Work (CARSAT)", "title": "Describe your job + responsibilities (75–90s)", "prompt": "Tell me about your job at CARSAT (French Social Security). What do you do, and what skills do you use?", "context": "Use: I work for / I work at… • I’m responsible for… • I deal with… • I work with…", "recommended": 75, "plan": ["1) Direct answer: where you work + your role.", "2) Task 1 + detail (documents / files).", "3) Task 2 + detail (partners / communication).", "4) Skills (organisation, communication, accuracy).", "5) Closing + one question back."], "model": ["I work for CARSAT, which is part of the French Social Security system. I work in administration, and I help manage files and documents.", "First of all, I check information, organise documents, and make sure files are complete and accurate. For example, if a document is missing, I contact the right person and follow up politely.", "In addition, I work with different partners, so communication is important. I need to explain what we need, confirm deadlines, and keep a professional tone.", "Overall, I use organisation and attention to detail every day. Could you please tell me what kind of situation you would like me to handle now?"], "followUps": ["What do you like about your job?", "What is the most challenging part of your work?", "How do you handle stress or pressure at work?", "What do you do when a file is incomplete?"], "vocab": [{"icon": "🏢", "en": "to work for / to work at", "fr": "travailler pour / travailler à", "def": "two common ways to say where you work", "ex": "I work for CARSAT. / I work at CARSAT."}, {"icon": "🗂️", "en": "a file", "fr": "un dossier", "def": "a set of documents about one case", "ex": "This file is incomplete."}, {"icon": "📄", "en": "documents", "fr": "des documents", "def": "papers / forms / files", "ex": "I check documents every day."}, {"icon": "✅", "en": "to make sure", "fr": "s’assurer que", "def": "to check that something is correct", "ex": "I make sure the information is accurate."}, {"icon": "🤝", "en": "a partner", "fr": "un partenaire", "def": "an organisation/person you work with", "ex": "I work with different partners."}, {"icon": "📞", "en": "to follow up", "fr": "relancer / faire un suivi", "def": "to contact again to get an update", "ex": "I follow up by email."}, {"icon": "🧩", "en": "to be responsible for", "fr": "être responsable de", "def": "to have the duty to do something", "ex": "I’m responsible for managing files."}, {"icon": "🎯", "en": "attention to detail", "fr": "sens du détail / rigueur", "def": "being careful and accurate", "ex": "My job requires attention to detail."}], "builderBlocks": ["I work for CARSAT, part of the French Social Security system.", "I work in administration and help manage files and documents.", "First of all, I check information and make sure files are complete and accurate.", "For example, if a document is missing, I contact the right person and follow up politely.", "In addition, I work with different partners, so communication is important.", "I confirm deadlines and keep a professional tone.", "Overall, I use organisation and attention to detail every day.", "Could you tell me what situation you would like me to handle now?"], "fill": {"template": "I work {forAt} CARSAT. I work in {dept}, and I’m responsible {for} managing {files}.\n\nFirst of all, I {check} information and make sure documents are {accurate}. In addition, I work {with} different partners.\n\nOverall, organisation and attention to detail are very important.", "blanks": {"forAt": {"opts": ["for", "four", "from"], "a": "for"}, "dept": {"opts": ["administration", "admiration", "administrator"], "a": "administration"}, "for": {"opts": ["for", "of", "to"], "a": "for"}, "files": {"opts": ["files", "fills", "fails"], "a": "files"}, "check": {"opts": ["check", "choose", "change"], "a": "check"}, "accurate": {"opts": ["accurate", "accusing", "account"], "a": "accurate"}, "with": {"opts": ["with", "witch", "wish"], "a": "with"}}}, "builderEasyBlocks": ["I work for CARSAT, part of the French Social Security system, in administration.", "First of all, I manage files and documents and make sure everything is complete and accurate.", "In addition, I work with different partners, so I communicate politely and follow up when needed.", "Overall, organisation and attention to detail are key. What situation would you like me to handle now?"]}, {"id": "where-live-60", "cat": "Where you live", "title": "Location + directions (60s)", "prompt": "Explain where you live and describe the area. Give one comparison (city vs countryside).", "context": "Use location phrases: in / near / north of / close to… + comparatives.", "recommended": 60, "plan": ["1) Where you live (near Lille, north of France).", "2) Describe the area (quiet, convenient, green…).", "3) Comparison (more/less + adjective).", "4) Closing + question back."], "model": ["I live near Lille, in the north of France, and it’s also close to Belgium.", "The area is quite convenient because there are shops and services nearby, but it can also be calm depending on the neighbourhood.", "Compared to a big city centre, it’s usually less noisy and more comfortable for daily life. That said, the city is more lively for culture and restaurants.", "Overall, it’s a good balance. Do you prefer living in a city or in a quieter area?"], "followUps": ["What do you like doing in Lille?", "Is your area good for public transport?", "What is a good place to visit near your home?"], "vocab": [{"icon": "🗺️", "en": "close to", "fr": "proche de", "def": "near a place", "ex": "It’s close to Belgium."}, {"icon": "🔊", "en": "noisy", "fr": "bruyant", "def": "with a lot of noise", "ex": "City centres can be noisy."}, {"icon": "😌", "en": "quiet / calm", "fr": "calme", "def": "not noisy; peaceful", "ex": "My neighbourhood is quiet."}, {"icon": "🛍️", "en": "shops and services", "fr": "commerces et services", "def": "places you need for daily life", "ex": "There are shops and services nearby."}, {"icon": "📊", "en": "less … than / more … than", "fr": "moins … que / plus … que", "def": "comparative structure", "ex": "It’s less noisy than the city centre."}, {"icon": "⚖️", "en": "a good balance", "fr": "un bon équilibre", "def": "a mix of two good things", "ex": "It’s a good balance: calm and convenient."}], "builderBlocks": ["I live near Lille, in the north of France, close to Belgium.", "The area is convenient because there are shops and services nearby.", "It can also be calm depending on the neighbourhood.", "Compared to the city centre, it’s usually less noisy and more comfortable.", "That said, the city is more lively for culture and restaurants.", "Overall, it’s a good balance.", "Do you prefer living in a city or in a quieter area?", "Why?"], "fill": {"template": "I live {near} Lille, {in} the north {of} France. It’s close {to} Belgium.\n\nCompared to the city centre, it’s usually {less} noisy and {more} comfortable.\n\nOverall, it’s a good balance.", "blanks": {"near": {"opts": ["near", "next", "net"], "a": "near"}, "in": {"opts": ["in", "on", "at"], "a": "in"}, "of": {"opts": ["of", "off", "for"], "a": "of"}, "to": {"opts": ["to", "too", "two"], "a": "to"}, "less": {"opts": ["less", "least", "more"], "a": "less"}, "more": {"opts": ["more", "most", "much"], "a": "more"}}}, "builderEasyBlocks": ["I live near Lille, in the north of France, close to Belgium.", "The area is convenient but can also be calm depending on the neighbourhood.", "Compared to the city centre, it’s less noisy and more comfortable, but the city is more lively.", "Overall, it’s a good balance. Do you prefer living in a city or a quieter area?"]}]};

  function $(sel, root){ return (root||document).querySelector(sel); }
  function $all(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }
  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
  function shuffle(arr){
    var a = arr.slice();
    for(var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }

  var LS = {
    get: function(k, fb){ try{ var v=localStorage.getItem(k); return v===null?fb:JSON.parse(v); }catch(e){ return fb; } },
    set: function(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} },
    del: function(k){ try{ localStorage.removeItem(k); }catch(e){} }
  };

  var KEY = "se_frankie_oral_last_v1";

  var state = LS.get(KEY, {
    scenarioId: DATA.scenarios[0].id,
    score: 0,
    done: { timer:false, builder:false, fill:false, vocab:false, checklist:false },
    notes: "",
    finalOral: "",
    checks: [false,false,false,false,false]
  });

  function setScore(n){
    n = clamp(parseInt(n,10) || 0, 0, 60);
    state.score = n;
    LS.set(KEY,state);
    $("#scoreTop").textContent = String(n);
    $("#scoreBottom").textContent = String(n);
  }
  function addScore(d){
    setScore(Math.max(0,(state.score||0)+d));
  }

  function countDone(){
    var c=0;
    Object.keys(state.done).forEach(function(k){ if(state.done[k]) c++; });
    $("#doneTop").textContent=String(c);
    $("#doneBottom").textContent=String(c);
    $("#doneMax").textContent="5";
    $("#doneMaxBottom").textContent="5";
  }

  // Speech
  var accentSel = $("#accent");
  var speechSupported = ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);

  function stopSpeech(){
    if(!speechSupported) return;
    try{ window.speechSynthesis.cancel(); }catch(e){}
  }

  function pickVoice(lang){
    if(!speechSupported) return null;
    var voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    if(!voices || !voices.length) return null;
    var exact = voices.filter(function(v){ return (v.lang||"").toLowerCase()===lang.toLowerCase(); });
    if(exact.length) return exact[0];
    var base = lang.toLowerCase().slice(0,2);
    var partial = voices.filter(function(v){ return (v.lang||"").toLowerCase().indexOf(base)===0; });
    return partial.length ? partial[0] : voices[0];
  }

  function speak(text){
    if(!speechSupported){ alert("Text-to-speech not available in this browser."); return; }
    stopSpeech();
    var u = new SpeechSynthesisUtterance(String(text||""));
    var lang = accentSel ? accentSel.value : "en-GB";
    u.lang = lang;
    u.rate = 0.98;
    u.pitch = 1.0;
    var v = pickVoice(lang);
    if(v) u.voice = v;
    window.speechSynthesis.speak(u);
  }

  if(speechSupported && window.speechSynthesis){
    window.speechSynthesis.onvoiceschanged = function(){};
  }

  $("#btnStopSpeech").addEventListener("click", stopSpeech);

  // Navigation scroll
  $all("[data-scroll]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var t = btn.getAttribute("data-scroll");
      var el = $(t);
      if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
    });
  });

  $("#btnPrint").addEventListener("click", function(){ window.print(); });

  $("#btnResetAll").addEventListener("click", function(){
    stopSpeech();
    LS.del(KEY);
    location.reload();
  });

  // Connector bank
  var bank = $("#connectorBank");
  DATA.connectors.forEach(function(p){
    var b=document.createElement("button");
    b.type="button";
    b.textContent=p;
    b.addEventListener("click", function(){ speak(p); });
    bank.appendChild(b);
  });

  $("#btnListenPerfect").addEventListener("click", function(){
    speak("Direct answer. First of all. For example. In addition. Overall. Polite closing. One question back.");
  });

  function getScenario(){
    return DATA.scenarios.find(function(s){ return s.id===state.scenarioId; }) || DATA.scenarios[0];
  }

  // Scenario select (with optgroups)
  var scenarioSelect = $("#scenarioSelect");
  function initScenarioSelect(){
    scenarioSelect.innerHTML="";
    var cats = {};
    DATA.scenarios.forEach(function(s){
      if(!cats[s.cat]) cats[s.cat]=[];
      cats[s.cat].push(s);
    });
    Object.keys(cats).forEach(function(cat){
      var og=document.createElement("optgroup");
      og.label=cat;
      cats[cat].forEach(function(s){
        var o=document.createElement("option");
        o.value=s.id;
        o.textContent=s.title;
        og.appendChild(o);
      });
      scenarioSelect.appendChild(og);
    });
    scenarioSelect.value = state.scenarioId;
    scenarioSelect.addEventListener("change", function(){
      state.scenarioId = scenarioSelect.value;
      // reset topic-dependent exercises (but keep score)
      state.done.timer = false;
      state.done.builder = false;
      state.done.fill = false;
      LS.set(KEY,state);
      renderScenario(true);
      initBuilder(true);
      renderFill();
      renderVocab(); // update filter highlight if needed
      countDone();
    });
  }

  // Model / plan
  var modelVisible = false;
  $("#btnToggleModel").addEventListener("click", function(){
    modelVisible = !modelVisible;
    $("#modelBox").hidden = !modelVisible;
  });

  // Follow-up practice
  var followVisible = false;
  $("#btnToggleFollowModel").addEventListener("click", function(){
    followVisible = !followVisible;
    $("#followModel").hidden = !followVisible;
  });

  function newFollow(){
    var s=getScenario();
    var q = s.followUps[Math.floor(Math.random()*s.followUps.length)];
    $("#followQ").textContent = q;
    // sample reply: short 2-step
    var sample = "I would say: " + "In my opinion, " + " " +
      "First of all, " + " " + "For example, " + " " + "Overall, " +
      "That’s why. What do you think?";
    // Better: derive from scenario
    var short = "Sample reply:\n" +
      "• Direct answer (1 sentence).\n" +
      "• One detail + one example.\n" +
      "• Short closing.\n\n" +
      "Example:\n" +
      "In my opinion, " + q.replace(/\?$/,".") + " " +
      "First of all, I can explain briefly. For example, I can give one concrete detail. Overall, that’s my view.";
    $("#followModel").textContent = short;
    $("#followModel").hidden = true;
    followVisible = false;
  }

  $("#btnNewFollow").addEventListener("click", newFollow);
  $("#btnListenFollow").addEventListener("click", function(){ speak($("#followQ").textContent || ""); });

  // Timer
  var timerId=null;
  var baseSec=60, remain=60;

  function stopTimer(){
    if(timerId){ clearInterval(timerId); timerId=null; }
  }
  function setTimer(sec){
    baseSec=sec;
    remain=sec;
    $("#timerNum").textContent=String(sec);
  }
  function startTimer(){
    stopTimer();
    remain=baseSec;
    $("#timerNum").textContent=String(remain);
    $("#timerFeedback").className="feedback";
    $("#timerFeedback").textContent="Speak calmly. Use the 3-step structure.";
    timerId=setInterval(function(){
      remain -= 1;
      $("#timerNum").textContent=String(Math.max(0,remain));
      if(remain<=0){
        stopTimer();
        $("#timerFeedback").className="feedback good";
        $("#timerFeedback").textContent="✅ Time. Finish with a polite closing + a question back.";
        speak("Time. Finish with a polite closing and a question back.");
      }
    },1000);
  }

  $("#btnStartTimer").addEventListener("click", startTimer);
  $("#btnStopTimer").addEventListener("click", stopTimer);
  $("#btnResetTimer").addEventListener("click", function(){
    stopTimer();
    setTimer(baseSec);
    $("#timerFeedback").className="feedback";
    $("#timerFeedback").textContent="Reset.";
  });

  function setChipActive(id){
    $all(".chipbtn").forEach(function(b){ b.classList.remove("is-on"); });
    var el=$(id);
    if(el) el.classList.add("is-on");
  }

  $("#btnSet45").addEventListener("click", function(){ setChipActive("#btnSet45"); setTimer(45); });
  $("#btnSet60").addEventListener("click", function(){ setChipActive("#btnSet60"); setTimer(60); });
  $("#btnSet90").addEventListener("click", function(){ setChipActive("#btnSet90"); setTimer(90); });

  $("#btnDoneSpoke").addEventListener("click", function(){
    if(!state.done.timer){
      state.done.timer=true;
      addScore(10);
      LS.set(KEY,state);
      countDone();
      $("#timerFeedback").className="feedback good";
      $("#timerFeedback").textContent="Nice. +10 points. Now answer a follow-up question.";
    }else{
      $("#timerFeedback").className="feedback";
      $("#timerFeedback").textContent="Already counted. Try another scenario.";
    }
  });

  // Notes
  var notesBox=$("#notesBox");
  notesBox.value = state.notes || "";
  notesBox.addEventListener("input", function(){
    state.notes = notesBox.value;
    LS.set(KEY,state);
  });

  $("#btnCopyNotes").addEventListener("click", function(){
    copyToClipboard(notesBox.value || "");
  });

  function copyToClipboard(text){
    var t=String(text||"");
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(function(){ alert("Copied!"); })
        .catch(function(){ fallbackCopy(t); });
    }else{
      fallbackCopy(t);
    }
  }
  function fallbackCopy(t){
    var ta=document.createElement("textarea");
    ta.value=t;
    ta.style.position="fixed";
    ta.style.left="-9999px";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try{ document.execCommand("copy"); alert("Copied!"); }
    catch(e){ alert("Copy failed."); }
    document.body.removeChild(ta);
  }

  // Render scenario
  function renderScenario(applyRecommended){
    var s=getScenario();
    $("#promptText").textContent=s.prompt;
    $("#contextText").textContent=s.context;

    $("#modelText").textContent = s.model.join(" ");
    var plan=$("#planList"); plan.innerHTML="";
    s.plan.forEach(function(line){
      var li=document.createElement("li");
      li.textContent=line;
      plan.appendChild(li);
    });

    $("#btnListenPrompt").onclick=function(){ speak(s.prompt); };
    $("#btnListenModel").onclick=function(){ speak(s.model.join(" ")); };
    $("#btnCopyModel").onclick=function(){ copyToClipboard(s.model.join(" ")); };

    // recommended time
    var rec = s.recommended || 60;
    $("#recommendedTimeVal").textContent=String(rec);
    $("#recommendedTime").title="Suggested answer length for this scenario";
    if(applyRecommended){
      // choose closest chip
      if(rec<=45){ setChipActive("#btnSet45"); setTimer(45); }
      else if(rec>=90){ setChipActive("#btnSet90"); setTimer(90); }
      else { setChipActive("#btnSet60"); setTimer(60); }
    }
    // follow-up
    newFollow();
  }

  // Fill-in
  function renderFill(){
    var s=getScenario();
    if(!s.fill || !s.fill.template || !s.fill.blanks){
      $("#fillBox").innerHTML = "No fill‑in available for this scenario.";
      $("#fillFeedback").className="feedback warn";
      $("#fillFeedback").textContent="Please choose another scenario.";
      return;
    }
    var tpl = s.fill.template;
    var blanks = s.fill.blanks;

    function esc(text){
      return String(text).replace(/[&<>"']/g, function(m){
        return ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" })[m];
      });
    }

    // Make line breaks visible
    var html = esc(tpl).replace(/\n/g, "<br>");

    // Replace {key} placeholders with <select>
    html = html.replace(/\{([a-zA-Z0-9_]+)\}/g, function(_, key){
      if(!blanks[key]) return "{"+key+"}";
      var opts = blanks[key].opts.map(function(o){
        return "<option value='"+esc(o)+"'>"+esc(o)+"</option>";
      }).join("");
      return "<select data-b='"+esc(key)+"'><option value=''>— choose —</option>"+opts+"</select>";
    });

    $("#fillBox").innerHTML = html;
    $("#fillBox").__blanks = blanks;

    $("#fillFeedback").className="feedback";
    $("#fillFeedback").textContent="Choose the best options, then click Check.";
  }

function checkFill(){
    var blanks = $("#fillBox").__blanks || {};
    var sels = $all("select[data-b]", $("#fillBox"));
    var ok=0, total=sels.length;

    sels.forEach(function(sel){
      var k=sel.getAttribute("data-b");
      var a=blanks[k].a;
      sel.classList.remove("ok","no");
      if(!sel.value){ sel.classList.add("no"); return; }
      if(sel.value===a){ ok++; sel.classList.add("ok"); }
      else sel.classList.add("no");
    });

    if(ok===total){
      $("#fillFeedback").className="feedback good";
      $("#fillFeedback").textContent="✅ Perfect.";
      if(!state.done.fill){
        state.done.fill=true;
        addScore(10);
        LS.set(KEY,state);
        countDone();
      }
    }else{
      $("#fillFeedback").className="feedback warn";
      $("#fillFeedback").textContent="Correct: "+ok+" / "+total+".";
    }
  }

  $("#btnCheckFill").addEventListener("click", checkFill);
  $("#btnResetFill").addEventListener("click", renderFill);
  $("#btnListenFill").addEventListener("click", function(){
    var s=getScenario();
    // Build spoken text with current selections
    var text = s.fill.template;
    var sels = $all("select[data-b]", $("#fillBox"));
    sels.forEach(function(sel){
      var k=sel.getAttribute("data-b");
      var v = sel.value || "";
      text = text.replace("{"+k+"}", v);
    });
    speak(text.replace(/\n/g," "));
  });

  // Builder
  function initBuilder(forceReset){
    var s=getScenario();
    var levelSel = $("#builderLevel");
    var level = (levelSel && levelSel.value) ? levelSel.value : (state.builderLevel || "easy");
    state.builderLevel = level;
    LS.set(KEY,state);
    var correct = (level==="easy" && s.builderEasyBlocks) ? s.builderEasyBlocks.slice() : s.builderBlocks.slice();
    var b = state.builder;
    var key = correct.join("|");
    if(forceReset || !b || b.key !== key){
      b = { key:key, correct:correct, pool:shuffle(correct), lane:[] };
    }else{
      b.correct = correct;
    }
    state.builder = b;
    LS.set(KEY,state);
    renderBuilder();
    $("#builderFeedback").className="feedback";
    $("#builderFeedback").textContent="Easy mode: build 4 blocks (direct answer → details → closing).";
  }

  function renderPoolBlock(text){
    var el=document.createElement("div");
    el.className="block";
    el.setAttribute("draggable","true");

    var left=document.createElement("div");
    var tx=document.createElement("div"); tx.className="block__text"; tx.textContent=text;
    left.appendChild(tx);

    var btns=document.createElement("div");
    btns.className="block__btns";

    var addBtn=document.createElement("button");
    addBtn.type="button"; addBtn.textContent="➕ Add";
    addBtn.addEventListener("click", function(){ movePoolToLane(text); });

    var listenBtn=document.createElement("button");
    listenBtn.type="button"; listenBtn.textContent="🔊 Listen";
    listenBtn.addEventListener("click", function(){ speak(text); });

    btns.appendChild(addBtn);
    btns.appendChild(listenBtn);

    el.appendChild(left);
    el.appendChild(btns);

    el.addEventListener("dragstart", function(e){
      try{ e.dataTransfer.setData("text/plain", text); e.dataTransfer.effectAllowed="move"; }catch(err){}
    });

    return el;
  }

  function renderLaneItem(text){
    var li=document.createElement("li");
    li.className="answeritem";
    li.setAttribute("data-text", text);

    var tx=document.createElement("div");
    tx.className="answeritem__text";
    tx.textContent=text;

    var btns=document.createElement("div");
    btns.className="answeritem__btns";

    var up=document.createElement("button");
    up.type="button"; up.textContent="↑";
    up.addEventListener("click", function(){ moveInLane(text,-1); });

    var dn=document.createElement("button");
    dn.type="button"; dn.textContent="↓";
    dn.addEventListener("click", function(){ moveInLane(text, +1); });

    var rm=document.createElement("button");
    rm.type="button"; rm.textContent="✖";
    rm.addEventListener("click", function(){ moveLaneToPool(text); });

    btns.appendChild(up); btns.appendChild(dn); btns.appendChild(rm);

    li.appendChild(tx);
    li.appendChild(btns);

    li.addEventListener("dragover", function(e){ e.preventDefault(); });
    li.addEventListener("drop", function(e){
      e.preventDefault();
      var drag="";
      try{ drag=e.dataTransfer.getData("text/plain"); }catch(err){}
      if(drag) dropBefore(drag, text);
    });

    return li;
  }

  function renderBuilder(){
    var b=state.builder;
    var pool=$("#blockPool");
    var lane=$("#answerLane");
    pool.innerHTML=""; lane.innerHTML="";
    b.pool.forEach(function(t){ pool.appendChild(renderPoolBlock(t)); });
    b.lane.forEach(function(t){ lane.appendChild(renderLaneItem(t)); });
  }

  function movePoolToLane(text){
    var b=state.builder;
    var idx=b.pool.indexOf(text);
    if(idx<0) return;
    b.lane.push(b.pool.splice(idx,1)[0]);
    LS.set(KEY,state);
    renderBuilder();
  }
  function moveLaneToPool(text){
    var b=state.builder;
    var idx=b.lane.indexOf(text);
    if(idx<0) return;
    b.pool.push(b.lane.splice(idx,1)[0]);
    LS.set(KEY,state);
    renderBuilder();
  }
  function moveInLane(text, d){
    var b=state.builder;
    var idx=b.lane.indexOf(text);
    if(idx<0) return;
    var n=idx+d;
    if(n<0 || n>=b.lane.length) return;
    var tmp=b.lane[idx];
    b.lane[idx]=b.lane[n];
    b.lane[n]=tmp;
    LS.set(KEY,state);
    renderBuilder();
  }
  function dropBefore(dragText, beforeText){
    var b=state.builder;
    var beforeIdx=b.lane.indexOf(beforeText);
    if(beforeIdx<0) return;

    var fromPool=b.pool.indexOf(dragText);
    var fromLane=b.lane.indexOf(dragText);
    var item=null;

    if(fromPool>=0){
      item=b.pool.splice(fromPool,1)[0];
    }else if(fromLane>=0){
      item=b.lane.splice(fromLane,1)[0];
      beforeIdx=b.lane.indexOf(beforeText);
      if(beforeIdx<0) beforeIdx=b.lane.length;
    }else{
      return;
    }

    b.lane.splice(beforeIdx,0,item);
    LS.set(KEY,state);
    renderBuilder();
  }

  $("#answerLane").addEventListener("dragover", function(e){ e.preventDefault(); });
  $("#answerLane").addEventListener("drop", function(e){
    e.preventDefault();
    var drag="";
    try{ drag=e.dataTransfer.getData("text/plain"); }catch(err){}
    if(drag) movePoolToLane(drag);
  });

  $("#btnResetBuilder").addEventListener("click", function(){ initBuilder(true); });
  // Builder helpers
  var builderLevelSel = $("#builderLevel");
  if (builderLevelSel){
    builderLevelSel.value = state.builderLevel || builderLevelSel.value || "easy";
    builderLevelSel.addEventListener("change", function(){
      initBuilder(true);
      $("#builderFeedback").className="feedback";
      $("#builderFeedback").textContent="Builder updated. Use a direct answer, add details, and finish politely.";
    });
  }

  $("#btnShowBuilderOrder") && $("#btnShowBuilderOrder").addEventListener("click", function(){
    var b = state.builder;
    if (!b) return;
    b.lane = b.correct.slice();
    b.pool = [];
    LS.set(KEY,state);
    renderBuilder();
    $("#builderFeedback").className="feedback";
    $("#builderFeedback").textContent="Order shown. Read it aloud once, then press Reset to try again.";
  });


  $("#btnCheckBuilder").addEventListener("click", function(){
    var b=state.builder;
    var need=b.correct.length;
    if(b.lane.length!==need){
      $("#builderFeedback").className="feedback warn";
      $("#builderFeedback").textContent="Not finished: add all blocks (tap ➕ Add).";
      return;
    }
    var ok=0;
    for(var i=0;i<need;i++){ if(b.lane[i]===b.correct[i]) ok++; }

    if(ok===need){
      $("#builderFeedback").className="feedback good";
      $("#builderFeedback").textContent="✅ Perfect structure.";
      if(!state.done.builder){
        state.done.builder=true;
        addScore(15);
        LS.set(KEY,state);
        countDone();
      }
    }else{
      $("#builderFeedback").className="feedback warn";
      $("#builderFeedback").textContent="Correct positions: "+ok+" / "+need+". Use ↑ ↓ to adjust.";
    }
  });

  $("#btnListenBuilt").addEventListener("click", function(){
    var b=state.builder;
    var txt=(b.lane.length ? b.lane : b.correct).join(" ");
    speak(txt);
  });

  // Flashcards
  var vocabCat="all";
  function catForCard(card){
    return card.cat;
  }

  function allCards(){
    var cards=[];
    DATA.scenarios.forEach(function(s){
      s.vocab.forEach(function(v){
        cards.push({
          cat:s.cat,
          icon:v.icon,
          en:v.en,
          fr:v.fr,
          def:v.def,
          ex:v.ex
        });
      });
    });
    return cards;
  }

  var allV = allCards();

  function renderVocab(){
    var grid=$("#flashGrid");
    grid.innerHTML="";
    var list = allV.slice();

    if(vocabCat!=="all"){
      list = list.filter(function(c){ return c.cat===vocabCat; });
    }

    list.forEach(function(v){
      var card=document.createElement("div");
      card.className="flash";
      card.tabIndex=0;

      var inner=document.createElement("div");
      inner.className="flash__inner";

      var front=document.createElement("div");
      front.className="flash__face flash__front";
      front.innerHTML="<div class='icon'>"+escapeHtml(v.icon)+"</div>"+
        "<div class='word'>"+escapeHtml(v.en)+"</div>"+
        "<div class='fr'>FR: "+escapeHtml(v.fr)+"</div>";

      var act=document.createElement("div");
      act.className="flash__actions";

      var b1=document.createElement("button");
      b1.type="button"; b1.textContent="🔊 Word";
      b1.addEventListener("click", function(e){ e.stopPropagation(); speak(v.en); });

      var b2=document.createElement("button");
      b2.type="button"; b2.textContent="🔊 Example";
      b2.addEventListener("click", function(e){ e.stopPropagation(); speak(v.ex); });

      act.appendChild(b1); act.appendChild(b2);
      front.appendChild(act);

      var back=document.createElement("div");
      back.className="flash__face flash__back";
      back.innerHTML="<div><strong>Meaning</strong></div>"+
        "<div class='def' style='margin-top:6px'>"+escapeHtml(v.def)+"</div>"+
        "<div style='margin-top:10px'><strong>Example</strong></div>"+
        "<div class='ex' style='margin-top:6px'>"+escapeHtml(v.ex)+"</div>"+
        "<div class='tiny muted' style='margin-top:10px'>Tap to flip back</div>";

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);

      function toggle(){ card.classList.toggle("is-flipped"); }
      card.addEventListener("click", toggle);
      card.addEventListener("keydown", function(e){
        if(e.key==="Enter"||e.key===" "){ e.preventDefault(); toggle(); }
      });

      grid.appendChild(card);
    });

    if(!state.done.vocab && list.length){
      state.done.vocab=true;
      addScore(10);
      LS.set(KEY,state);
      countDone();
    }
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(m){
      return ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" })[m];
    });
  }

  $all("[data-vcat]").forEach(function(btn){
    btn.addEventListener("click", function(){
      $all("[data-vcat]").forEach(function(b){ b.classList.remove("is-on"); });
      btn.classList.add("is-on");
      vocabCat = btn.getAttribute("data-vcat");
      renderVocab();
    });
  });

  $("#btnShuffleVocab").addEventListener("click", function(){
    allV = shuffle(allV);
    renderVocab();
  });

  // Workshop
  var finalOral=$("#finalOral");
  finalOral.value = state.finalOral || "";
  finalOral.addEventListener("input", function(){
    state.finalOral = finalOral.value;
    LS.set(KEY,state);
  });

  $("#btnCopyFinalOral").addEventListener("click", function(){ copyToClipboard(finalOral.value||""); });
  $("#btnListenFinalOral").addEventListener("click", function(){ speak((finalOral.value||"").replace(/\n/g," ")); });

  // Checklist
  var checklistItems = [
    {t:"I answered directly.", d:"1 sentence answer first."},
    {t:"I gave 2 details.", d:"Tasks / reasons / information."},
    {t:"I gave 1 example.", d:"For example…"},
    {t:"I used 2 connectors.", d:"First of all, In addition, Overall…"},
    {t:"I asked 1 question back.", d:"Could you…? / Do you…?"}
  ];

  function renderChecklist(){
    var grid=$("#checkGrid");
    grid.innerHTML="";
    checklistItems.forEach(function(it, idx){
      var row=document.createElement("label");
      row.className="check";

      var cb=document.createElement("input");
      cb.type="checkbox";
      cb.checked = !!state.checks[idx];
      cb.addEventListener("change", function(){
        state.checks[idx]=cb.checked;
        LS.set(KEY,state);
      });

      var box=document.createElement("div");
      var t=document.createElement("div"); t.className="t"; t.textContent=it.t;
      var d=document.createElement("div"); d.className="d"; d.textContent=it.d;
      box.appendChild(t); box.appendChild(d);

      row.appendChild(cb);
      row.appendChild(box);
      grid.appendChild(row);
    });
  }

  $("#btnDoneChecklist").addEventListener("click", function(){
    var count = (state.checks||[]).filter(Boolean).length;
    if(count>=4){
      if(!state.done.checklist){
        state.done.checklist=true;
        addScore(15);
        LS.set(KEY,state);
        countDone();
      }
      alert("Checklist completed ✅");
    }else{
      alert("Try to tick at least 4 items.");
    }
  });

  // Init
  function init(){
    $("#maxTop").textContent="60";
    $("#maxBottom").textContent="60";
    setScore(state.score||0);
    countDone();

    initScenarioSelect();
    renderScenario(true);
    initBuilder(true);
    renderFill();
    renderVocab();
    renderChecklist();

    // If model was visible last time, keep it hidden (safer)
    $("#modelBox").hidden = true;
    modelVisible = false;
  }

  init();

})();