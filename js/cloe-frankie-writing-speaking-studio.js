/* SpeakEasyTisha — CLOE Frankie Writing + Oral Studio
   Put this file in: /js/cloe-frankie-writing-speaking-studio.js
*/
(function(){
  "use strict";
  var DATA = {"connectors": [{"t": "First of all,", "fr": "Tout d’abord,"}, {"t": "Then,", "fr": "Ensuite,"}, {"t": "After that,", "fr": "Après cela,"}, {"t": "Finally,", "fr": "Enfin,"}, {"t": "Overall,", "fr": "Globalement,"}, {"t": "To sum up,", "fr": "Pour résumer,"}, {"t": "For example,", "fr": "Par exemple,"}, {"t": "That said,", "fr": "Cela dit,"}], "phraseBank": {"greetings": [{"en": "Hello,", "fr": "Bonjour,"}, {"en": "Dear Sir or Madam,", "fr": "Madame, Monsieur,"}, {"en": "To whom it may concern,", "fr": "À qui de droit,"}, {"en": "Hi there,", "fr": "Bonjour,"}], "openers": [{"en": "I’m writing to…", "fr": "Je vous écris pour…"}, {"en": "I would like to…", "fr": "Je souhaiterais…"}, {"en": "I’m contacting you regarding…", "fr": "Je vous contacte au sujet de…"}], "requests": [{"en": "Could you please…?", "fr": "Pourriez-vous… ?"}, {"en": "Would it be possible to…?", "fr": "Serait-il possible de… ?"}, {"en": "Could you confirm…?", "fr": "Pourriez-vous confirmer… ?"}], "closings": [{"en": "Thank you in advance for your help.", "fr": "Merci d’avance pour votre aide."}, {"en": "I look forward to your reply.", "fr": "Dans l’attente de votre réponse."}, {"en": "Best regards,", "fr": "Cordialement,"}, {"en": "Kind regards,", "fr": "Bien cordialement,"}]}, "grammar": {"sequencing": {"rules": [{"en": "Use sequencing words to organise your ideas.", "fr": "Utilise des mots de liaison pour organiser tes idées."}, {"en": "Keep the order simple: First → Then → After that → Finally.", "fr": "Garde un ordre simple : First → Then → After that → Finally."}], "exercise": [{"q": "___, I checked the file. ___, I contacted the partner organisation. ___, I updated the system. ___, I confirmed the appointment.", "opts": ["First of all", "Then", "After that", "Finally"], "a": ["First of all", "Then", "After that", "Finally"]}]}, "comparatives": {"rules": [{"en": "Short adjective: quiet → quieter than", "fr": "Adjectif court : quiet → quieter than"}, {"en": "Long adjective: convenient → more convenient than", "fr": "Adjectif long : convenient → more convenient than"}, {"en": "Irregular: good → better / bad → worse", "fr": "Irrégulier : good → better / bad → worse"}], "exercise": [{"q": "A room with a courtyard view is usually ___ than a room on the street.", "opts": ["quieter", "more quiet", "quietest"], "a": "quieter"}, {"q": "The train is often ___ than driving in city traffic.", "opts": ["more convenient", "convenienter", "the most convenient"], "a": "more convenient"}, {"q": "This solution is ___ than the first one.", "opts": ["better", "gooder", "the best"], "a": "better"}]}, "superlatives": {"rules": [{"en": "Short adjective: quiet → the quietest", "fr": "Adjectif court : quiet → the quietest"}, {"en": "Long adjective: important → the most important", "fr": "Adjectif long : important → the most important"}, {"en": "Irregular: good → the best / bad → the worst", "fr": "Irrégulier : good → the best / bad → the worst"}], "exercise": [{"q": "For me, a quiet room is ___ part of the stay.", "opts": ["the most important", "more important", "importanter"], "a": "the most important"}, {"q": "This is ___ hotel I’ve stayed in this year.", "opts": ["the best", "better", "the goodest"], "a": "the best"}, {"q": "Noise was ___ problem during the trip.", "opts": ["the worst", "worse", "the baddest"], "a": "the worst"}]}}, "writingScenarios": [{"id": "w_hotel_booking", "title": "Hotel reservation + quiet room", "context": "You want to book a room for 2 nights and request a quiet room.", "task": "Write a short email to the hotel. Ask for availability, total price (taxes included), and a quiet room.", "model": {"subject": "Request for information — reservation (2 nights)", "body": "Dear Reservation Team,\n\nI would like to book a double room for two nights from May 4 to May 6, 2026.\n\nCould you please confirm your availability and the total price, including taxes?\nIf possible, I would like a quiet room.\n\nThank you in advance for your help.\n\nKind regards,\nFrankie"}, "blocks": ["Dear Reservation Team,", "I would like to book a double room for two nights from May 4 to May 6, 2026.", "Could you please confirm your availability and the total price, including taxes?", "If possible, I would like a quiet room.", "Thank you in advance for your help.", "Kind regards,", "Frankie"], "fill": {"template": "{greet}\n\nI would like to book a {room} room for {nights} nights from {fromDate} to {toDate}.\n\n{req1} confirm your availability and the total price, including taxes?\nIf possible, I would like a {adj} room.\n\n{close}\n\n{sign}", "blanks": {"greet": {"opts": ["Dear Reservation Team,", "To whom it may concern,", "Hello,"], "a": "Dear Reservation Team,"}, "room": {"opts": ["double", "single", "twin"], "a": "double"}, "nights": {"opts": ["1", "2", "3"], "a": "2"}, "fromDate": {"opts": ["May 4, 2026", "June 4, 2026", "May 14, 2026"], "a": "May 4, 2026"}, "toDate": {"opts": ["May 6, 2026", "May 8, 2026", "June 6, 2026"], "a": "May 6, 2026"}, "req1": {"opts": ["Could you please", "Would it be possible to", "Can you"], "a": "Could you please"}, "adj": {"opts": ["quiet", "cheaper", "bigger"], "a": "quiet"}, "close": {"opts": ["Thank you in advance for your help.", "I am angry about this.", "See you."], "a": "Thank you in advance for your help."}, "sign": {"opts": ["Kind regards,\nFrankie", "Best regards,\nFrankie", "Frankie"], "a": "Kind regards,\nFrankie"}}}, "vocab": [{"icon": "🏨", "en": "reservation", "fr": "réservation"}, {"icon": "🛏️", "en": "double room", "fr": "chambre double"}, {"icon": "🔇", "en": "quiet room", "fr": "chambre calme"}, {"icon": "💶", "en": "total price (taxes included)", "fr": "prix total (taxes incluses)"}, {"icon": "✅", "en": "availability", "fr": "disponibilité"}]}, {"id": "w_partner_doc", "title": "Request a missing document (partner organisation)", "context": "You need a company document from a partner organisation to complete a file.", "task": "Write a short email: explain what is missing, ask for the document, and give a deadline.", "model": {"subject": "Request — missing document for a file", "body": "Hello,\n\nI’m contacting you regarding a client file that is currently incomplete.\nCould you please send the missing company document (signed version) by Thursday evening?\n\nIf you need any details, I can provide the reference number.\n\nThank you in advance for your help.\n\nBest regards,\nFrankie"}, "blocks": ["Hello,", "I’m contacting you regarding a client file that is currently incomplete.", "Could you please send the missing company document (signed version) by Thursday evening?", "If you need any details, I can provide the reference number.", "Thank you in advance for your help.", "Best regards,", "Frankie"], "fill": {"template": "{greet}\n\nI’m contacting you regarding a {what} file that is currently {status}.\n{req} send the missing {doc} by {deadline}?\n\n{extra}\n\n{close}\n\n{sign}", "blanks": {"greet": {"opts": ["Hello,", "Hi there,", "Dear Sir or Madam,"], "a": "Hello,"}, "what": {"opts": ["client", "company", "travel"], "a": "client"}, "status": {"opts": ["incomplete", "perfect", "closed"], "a": "incomplete"}, "req": {"opts": ["Could you please", "Would it be possible to", "I demand you"], "a": "Could you please"}, "doc": {"opts": ["company document (signed version)", "movie ticket", "hotel key"], "a": "company document (signed version)"}, "deadline": {"opts": ["Thursday evening", "next month", "yesterday"], "a": "Thursday evening"}, "extra": {"opts": ["If you need any details, I can provide the reference number.", "This is your fault.", "No need to reply."], "a": "If you need any details, I can provide the reference number."}, "close": {"opts": ["Thank you in advance for your help.", "Bye.", "I’m not happy."], "a": "Thank you in advance for your help."}, "sign": {"opts": ["Best regards,\nFrankie", "Kind regards,\nFrankie", "Frankie"], "a": "Best regards,\nFrankie"}}}, "vocab": [{"icon": "🗃️", "en": "file (case)", "fr": "dossier"}, {"icon": "🏢", "en": "company document", "fr": "document d’entreprise"}, {"icon": "🤝", "en": "partner organisation", "fr": "organisme partenaire"}, {"icon": "⏰", "en": "deadline", "fr": "date limite"}, {"icon": "🔎", "en": "reference number", "fr": "numéro de référence"}]}, {"id": "w_complaint_noise", "title": "Complaint email (noise + solution)", "context": "A hotel room was noisy. You want a solution (room change / refund).", "task": "Write a polite complaint: explain the issue + impact + request a solution.", "model": {"subject": "Noise complaint — request for a solution", "body": "To whom it may concern,\n\nI’m writing to inform you that during my stay, my room was very noisy, and I was unable to sleep.\n\nI would appreciate it if you could propose a solution, such as a room change or a partial refund.\n\nThank you for your attention.\n\nKind regards,\nFrankie"}, "blocks": ["To whom it may concern,", "I’m writing to inform you that during my stay, my room was very noisy, and I was unable to sleep.", "I would appreciate it if you could propose a solution, such as a room change or a partial refund.", "Thank you for your attention.", "Kind regards,", "Frankie"], "fill": {"template": "{greet}\n\nI’m writing to inform you that during my stay, my room was {adj1}, and I was unable to {impact}.\n\n{req} propose a solution, such as {sol1} or {sol2}.\n\n{close}\n\n{sign}", "blanks": {"greet": {"opts": ["To whom it may concern,", "Dear Reservation Team,", "Hello,"], "a": "To whom it may concern,"}, "adj1": {"opts": ["very noisy", "very clean", "very big"], "a": "very noisy"}, "impact": {"opts": ["sleep", "work", "swim"], "a": "sleep"}, "req": {"opts": ["I would appreciate it if you could", "Could you please", "I want you to"], "a": "I would appreciate it if you could"}, "sol1": {"opts": ["a room change", "a free movie", "a bigger suitcase"], "a": "a room change"}, "sol2": {"opts": ["a partial refund", "a late checkout", "a new phone"], "a": "a partial refund"}, "close": {"opts": ["Thank you for your attention.", "See you later.", "No reply needed."], "a": "Thank you for your attention."}, "sign": {"opts": ["Kind regards,\nFrankie", "Best regards,\nFrankie", "Frankie"], "a": "Kind regards,\nFrankie"}}}, "vocab": [{"icon": "🔊", "en": "noisy", "fr": "bruyant"}, {"icon": "😴", "en": "unable to sleep", "fr": "incapable de dormir"}, {"icon": "🔁", "en": "room change", "fr": "changement de chambre"}, {"icon": "💳", "en": "partial refund", "fr": "remboursement partiel"}, {"icon": "🙏", "en": "I would appreciate it if…", "fr": "Je vous serais reconnaissant(e) si…"}]}], "oralScenarios": [{"id": "o_lost_luggage", "title": "Airport role-play — lost luggage", "recommended": 60, "prompt": "Your luggage didn’t arrive. Speak to the airline desk: explain, give details, ask what happens next.", "steps": [{"t": "1) Direct situation", "hint": "Say what happened + when."}, {"t": "2) Details", "hint": "Flight number, bag description, contact details."}, {"t": "3) Request + closing", "hint": "Ask about delivery/next steps + thank them."}], "model": "Hello. My luggage didn’t arrive after my flight, and I’d like to report it. My flight was from Dublin to Paris this afternoon. The suitcase is medium-sized and black with a red tag. Could you please tell me what the next steps are and when it might be delivered? Thank you for your help."}, {"id": "o_hotel_problem", "title": "Hotel role-play — room problem (noise)", "recommended": 45, "prompt": "Your room is too noisy. Speak to reception: explain, compare options, request a solution.", "steps": [{"t": "1) Direct complaint", "hint": "Explain the issue + impact."}, {"t": "2) Compare options", "hint": "Quieter room / different floor (comparatives)."}, {"t": "3) Request + polite close", "hint": "Ask for room change / solution + thank them."}], "model": "Hello. My room is very noisy, and I couldn’t sleep well. Would it be possible to move to a quieter room, maybe on a higher floor? That would be much better for me. If that’s not possible, could you suggest another solution? Thank you in advance."}, {"id": "o_work_explain", "title": "Work role-play — explain your job (CARSAT)", "recommended": 60, "prompt": "Introduce your job: where you work, who you help, and what you do (include one example).", "steps": [{"t": "1) Role + employer", "hint": "I work for CARSAT… (social security)."}, {"t": "2) Responsibilities", "hint": "2–3 tasks + partners."}, {"t": "3) Example + close", "hint": "For example… To sum up…"}], "model": "I work in administration for CARSAT, a social security organisation. I manage client files and company documents, answer questions, and organise appointments. I also coordinate with partner organisations when something is missing. For example, I might request a signed document and then update the file. To sum up, my job requires organisation and clear communication."}], "flashcards": [{"cat": "writing", "icon": "✍️", "en": "I’m writing to…", "fr": "Je vous écris pour…"}, {"cat": "writing", "icon": "📌", "en": "regarding", "fr": "au sujet de"}, {"cat": "writing", "icon": "🙏", "en": "Could you please…?", "fr": "Pourriez-vous… ?"}, {"cat": "writing", "icon": "✅", "en": "Could you confirm…?", "fr": "Pourriez-vous confirmer… ?"}, {"cat": "writing", "icon": "⏰", "en": "by Thursday evening", "fr": "d’ici jeudi soir"}, {"cat": "writing", "icon": "💬", "en": "I look forward to your reply.", "fr": "Dans l’attente de votre réponse."}, {"cat": "oral", "icon": "🗣️", "en": "next steps", "fr": "les prochaines étapes"}, {"cat": "oral", "icon": "🔁", "en": "room change", "fr": "changement de chambre"}, {"cat": "oral", "icon": "🔎", "en": "description", "fr": "description"}, {"cat": "oral", "icon": "📞", "en": "contact details", "fr": "coordonnées"}, {"cat": "grammar", "icon": "🔗", "en": "First of all / Then / Finally", "fr": "Tout d’abord / Ensuite / Enfin"}, {"cat": "grammar", "icon": "📈", "en": "quieter than", "fr": "plus calme que"}, {"cat": "grammar", "icon": "🏆", "en": "the most important", "fr": "le plus important"}]};

  function $(sel, root){ return (root||document).querySelector(sel); }
  function $all(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }
  function shuffle(arr){
    var a=arr.slice();
    for(var i=a.length-1;i>0;i--){
      var j=Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(m){
      return ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" })[m];
    });
  }

  var LS = {
    get: function(k, fb){ try{ var v=localStorage.getItem(k); return v===null?fb:JSON.parse(v); }catch(e){ return fb; } },
    set: function(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} },
    del: function(k){ try{ localStorage.removeItem(k); }catch(e){} }
  };

  var KEY = {
    state:"se_frankie_ws_state_v1",
    score:"se_frankie_ws_score_v1",
    notesO:"se_frankie_ws_oral_notes_v1",
    finalW:"se_frankie_ws_final_w_v1",
    finalO:"se_frankie_ws_final_o_v1"
  };

  var MAX_SCORE = 60;

  var state = LS.get(KEY.state, {
    wId: DATA.writingScenarios[0].id,
    oId: DATA.oralScenarios[0].id,
    gTab: "seq",
    wBuilder: null,
    completed: { seq:false, comp:false, sup:false, w1:false, w2:false, w3:false, o1:false, o2:false, o3:false }
  });

  var scoreState = LS.get(KEY.score, {score:0});

  function setScore(n){
    scoreState.score = n;
    LS.set(KEY.score, scoreState);
    $("#scoreTop").textContent = String(n);
    $("#scoreBottom").textContent = String(n);
  }
  function addScore(d){ setScore(Math.max(0, (scoreState.score||0) + d)); }

  function countCompleted(){
    var done = 0;
    Object.keys(state.completed).forEach(function(k){ if(state.completed[k]) done++; });
    $("#doneTop").textContent = String(done);
    $("#doneBottom").textContent = String(done);
    $("#doneMax").textContent = "6";
    $("#doneMaxBottom").textContent = "6";
  }

  function toast(msg){
    var t=document.createElement("div");
    t.textContent=msg;
    t.style.position="fixed";
    t.style.bottom="16px";
    t.style.left="50%";
    t.style.transform="translateX(-50%)";
    t.style.padding="10px 12px";
    t.style.borderRadius="14px";
    t.style.border="1px solid rgba(255,255,255,.14)";
    t.style.background="rgba(0,0,0,.55)";
    t.style.color="rgba(255,255,255,.92)";
    t.style.zIndex="9999";
    document.body.appendChild(t);
    setTimeout(function(){ try{ document.body.removeChild(t); }catch(e){} }, 1200);
  }

  function copyToClipboard(text){
    var t = String(text||"");
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(function(){ toast("Copied!"); })
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
    try{ document.execCommand("copy"); toast("Copied!"); }
    catch(e){ alert("Copy failed."); }
    document.body.removeChild(ta);
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
    var exact = voices.filter(function(v){ return (v.lang||"").toLowerCase() === lang.toLowerCase(); });
    if(exact.length) return exact[0];
    var base = lang.toLowerCase().slice(0,2);
    var partial = voices.filter(function(v){ return (v.lang||"").toLowerCase().indexOf(base)===0; });
    return partial.length ? partial[0] : voices[0];
  }
  function speak(text){
    if(!speechSupported){ alert("Text-to-speech not available."); return; }
    stopSpeech();
    var u = new SpeechSynthesisUtterance(String(text||""));
    var lang = accentSel ? accentSel.value : "en-GB";
    u.lang = lang;
    u.rate = 0.98;
    u.pitch = 1.0;
    var voice = pickVoice(lang);
    if(voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  }
  if(speechSupported && window.speechSynthesis) window.speechSynthesis.onvoiceschanged = function(){};
  $("#btnStopSpeech").addEventListener("click", stopSpeech);

  // Nav scroll
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
    LS.del(KEY.state); LS.del(KEY.score); LS.del(KEY.notesO); LS.del(KEY.finalW); LS.del(KEY.finalO);
    location.reload();
  });

  // Quick bank
  var quick = ["I’m writing to…","I’m contacting you regarding…","Could you please…?","I would appreciate it if you could…","To sum up,…"];
  var qb = $("#quickBank");
  quick.forEach(function(p){
    var b=document.createElement("button");
    b.type="button"; b.textContent=p;
    b.addEventListener("click", function(){ speak(p); });
    qb.appendChild(b);
  });
  $("#btnQuickListen").addEventListener("click", function(){
    speak("I’m writing to request information. Could you please confirm the details? Thank you in advance.");
  });

  // Grammar tabs
  function renderRules(targetEl, rules){
    targetEl.innerHTML = "<ul class='muted'>" + rules.map(function(r){
      return "<li><strong>"+escapeHtml(r.en)+"</strong><div class='tiny muted'>FR: "+escapeHtml(r.fr)+"</div></li>";
    }).join("") + "</ul>";
  }

  function setGTab(id){
    state.gTab = id;
    LS.set(KEY.state, state);
    $all(".tab").forEach(function(t){
      t.classList.toggle("is-on", t.getAttribute("data-gtab")===id);
    });
    $("#g_seq").hidden = id!=="seq";
    $("#g_comp").hidden = id!=="comp";
    $("#g_sup").hidden = id!=="sup";
  }
  $all(".tab").forEach(function(b){
    b.addEventListener("click", function(){ setGTab(b.getAttribute("data-gtab")); });
  });

  // Sequencing fill
  function renderSeq(){
    renderRules($("#seqRules"), DATA.grammar.sequencing.rules);
    var item = DATA.grammar.sequencing.exercise[0];
    var parts = item.q.split("___");
    var html = "";
    for(var i=0;i<parts.length;i++){
      html += escapeHtml(parts[i]);
      if(i < 4){
        html += "<select data-k='s"+i+"'><option value=''>— choose —</option>" +
          item.opts.map(function(o){ return "<option value='"+escapeHtml(o)+"'>"+escapeHtml(o)+"</option>"; }).join("") +
          "</select>";
      }
    }
    $("#seqExercise").innerHTML = html;
    $("#seqExercise").__a = item.a.slice();
    $("#seqFeedback").className = "feedback";
    $("#seqFeedback").textContent = "Choose sequencing words, then click Check.";
  }

  function checkSeq(){
    var a = $("#seqExercise").__a || [];
    var sels = $all("select[data-k]", $("#seqExercise"));
    var ok = 0;
    sels.forEach(function(sel, idx){
      sel.classList.remove("ok","no");
      if(!sel.value){ sel.classList.add("no"); return; }
      if(sel.value === a[idx]){ ok++; sel.classList.add("ok"); } else sel.classList.add("no");
    });
    if(ok === a.length){
      $("#seqFeedback").className="feedback good";
      $("#seqFeedback").textContent="✅ Perfect.";
      if(!state.completed.seq){ state.completed.seq=true; addScore(5); LS.set(KEY.state,state); countCompleted(); }
    }else{
      $("#seqFeedback").className="feedback warn";
      $("#seqFeedback").textContent="Correct: "+ok+" / "+a.length+".";
    }
  }
  $("#btnResetSeq").addEventListener("click", renderSeq);
  $("#btnCheckSeq").addEventListener("click", checkSeq);

  // MCQ helper
  function renderMCQ(list, targetSel){
    var box = $(targetSel);
    box.innerHTML = "";
    list.forEach(function(it){
      var line=document.createElement("div");
      line.className="qline";
      line.setAttribute("data-a", it.a);
      line.innerHTML = "<div class='q'>"+escapeHtml(it.q)+"</div>";
      var sel=document.createElement("select");
      sel.innerHTML = "<option value=''>— choose —</option>" + it.opts.map(function(o){
        return "<option value='"+escapeHtml(o)+"'>"+escapeHtml(o)+"</option>";
      }).join("");
      line.appendChild(sel);
      box.appendChild(line);
    });
  }

  function checkMCQ(targetSel, feedbackSel, doneKey){
    var lines = $all(targetSel+" .qline");
    var ok=0;
    lines.forEach(function(line){
      var a=line.getAttribute("data-a");
      var sel=line.querySelector("select");
      line.classList.remove("ok","no");
      if(sel.value && sel.value===a){ ok++; line.classList.add("ok"); } else line.classList.add("no");
    });
    var fb = $(feedbackSel);
    if(ok === lines.length){
      fb.className="feedback good";
      fb.textContent="✅ Perfect.";
      if(!state.completed[doneKey]){ state.completed[doneKey]=true; addScore(5); LS.set(KEY.state,state); countCompleted(); }
    }else{
      fb.className="feedback warn";
      fb.textContent="Correct: "+ok+" / "+lines.length+".";
    }
  }

  function renderComp(){
    renderRules($("#compRules"), DATA.grammar.comparatives.rules);
    renderMCQ(DATA.grammar.comparatives.exercise, "#compQuiz");
    $("#compFeedback").className="feedback";
    $("#compFeedback").textContent="Choose the best comparative form.";
  }
  function renderSup(){
    renderRules($("#supRules"), DATA.grammar.superlatives.rules);
    renderMCQ(DATA.grammar.superlatives.exercise, "#supQuiz");
    $("#supFeedback").className="feedback";
    $("#supFeedback").textContent="Choose the best superlative form.";
  }
  $("#btnResetComp").addEventListener("click", renderComp);
  $("#btnCheckComp").addEventListener("click", function(){ checkMCQ("#compQuiz", "#compFeedback", "comp"); });
  $("#btnResetSup").addEventListener("click", renderSup);
  $("#btnCheckSup").addEventListener("click", function(){ checkMCQ("#supQuiz", "#supFeedback", "sup"); });

  // Writing
  var wSel = $("#wSelect");
  function initWritingSelect(){
    wSel.innerHTML="";
    DATA.writingScenarios.forEach(function(s){
      var o=document.createElement("option");
      o.value=s.id;
      o.textContent="✍️ " + s.title;
      wSel.appendChild(o);
    });
    wSel.value = state.wId;
  }
  function getW(){
    return DATA.writingScenarios.find(function(s){ return s.id===wSel.value; }) || DATA.writingScenarios[0];
  }

  $("#btnShowWModel").addEventListener("click", function(){
    $("#wModelBox").hidden = !$("#wModelBox").hidden;
  });

  function initWBuilder(force){
    var s=getW();
    var correct=s.blocks.slice();
    var saved=state.wBuilder;
    var key=correct.join("|");
    var savedKey=saved && saved.correctKey ? saved.correctKey : "";
    if(force || !saved || savedKey!==key){
      saved = { correctKey:key, correct:correct, pool:shuffle(correct), lane:[] };
    }
    state.wBuilder=saved;
    LS.set(KEY.state, state);
    renderWBuilderUI();
  }

  function renderBlock(text){
    var el=document.createElement("div");
    el.className="block";
    el.setAttribute("draggable","true");

    var tx=document.createElement("div");
    tx.className="block__text";
    tx.textContent=text;

    var btns=document.createElement("div");
    btns.className="block__btns";

    var add=document.createElement("button");
    add.type="button";
    add.textContent="➕ Add";
    add.addEventListener("click", function(){ movePoolToLane(text); });

    var listen=document.createElement("button");
    listen.type="button";
    listen.textContent="🔊";
    listen.addEventListener("click", function(){ speak(text); });

    btns.appendChild(add);
    btns.appendChild(listen);

    el.appendChild(tx);
    el.appendChild(btns);

    el.addEventListener("dragstart", function(e){
      try{
        e.dataTransfer.setData("text/plain", text);
        e.dataTransfer.effectAllowed="move";
      }catch(err){}
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
    dn.addEventListener("click", function(){ moveInLane(text,+1); });

    var rm=document.createElement("button");
    rm.type="button"; rm.textContent="✖";
    rm.addEventListener("click", function(){ moveLaneToPool(text); });

    btns.appendChild(up);
    btns.appendChild(dn);
    btns.appendChild(rm);

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

  function renderWBuilderUI(){
    var b=state.wBuilder;
    var pool=$("#wPool"), lane=$("#wLane");
    pool.innerHTML=""; lane.innerHTML="";
    b.pool.forEach(function(t){ pool.appendChild(renderBlock(t)); });
    b.lane.forEach(function(t){ lane.appendChild(renderLaneItem(t)); });
    $("#wOrderFeedback").className="feedback";
    $("#wOrderFeedback").textContent="Build the email structure, then check the order.";
  }

  function movePoolToLane(text){
    var b=state.wBuilder;
    var idx=b.pool.indexOf(text);
    if(idx<0) return;
    b.lane.push(b.pool.splice(idx,1)[0]);
    LS.set(KEY.state, state);
    renderWBuilderUI();
  }

  function moveLaneToPool(text){
    var b=state.wBuilder;
    var idx=b.lane.indexOf(text);
    if(idx<0) return;
    b.pool.push(b.lane.splice(idx,1)[0]);
    LS.set(KEY.state, state);
    renderWBuilderUI();
  }

  function moveInLane(text, d){
    var b=state.wBuilder;
    var idx=b.lane.indexOf(text);
    if(idx<0) return;
    var n=idx+d;
    if(n<0 || n>=b.lane.length) return;
    var tmp=b.lane[idx];
    b.lane[idx]=b.lane[n];
    b.lane[n]=tmp;
    LS.set(KEY.state, state);
    renderWBuilderUI();
  }

  function dropBefore(dragText, beforeText){
    var b=state.wBuilder;
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
    LS.set(KEY.state, state);
    renderWBuilderUI();
  }

  $("#wLane").addEventListener("dragover", function(e){ e.preventDefault(); });
  $("#wLane").addEventListener("drop", function(e){
    e.preventDefault();
    var drag="";
    try{ drag=e.dataTransfer.getData("text/plain"); }catch(err){}
    if(drag) movePoolToLane(drag);
  });

  $("#btnResetWOrder").addEventListener("click", function(){ initWBuilder(true); });

  $("#btnCheckWOrder").addEventListener("click", function(){
    var b=state.wBuilder;
    var need=b.correct.length;
    if(b.lane.length!==need){
      $("#wOrderFeedback").className="feedback warn";
      $("#wOrderFeedback").textContent="Add all blocks first.";
      return;
    }
    var ok=0;
    for(var i=0;i<need;i++){ if(b.lane[i]===b.correct[i]) ok++; }
    if(ok===need){
      $("#wOrderFeedback").className="feedback good";
      $("#wOrderFeedback").textContent="✅ Perfect order.";
      var idx = DATA.writingScenarios.findIndex(function(s){ return s.id===getW().id; });
      var key = "w"+(idx+1);
      if(!state.completed[key]){
        state.completed[key]=true;
        addScore(8);
        LS.set(KEY.state,state);
        countCompleted();
      }
    }else{
      $("#wOrderFeedback").className="feedback warn";
      $("#wOrderFeedback").textContent="Correct positions: "+ok+" / "+need+". Use ↑ ↓ to adjust.";
    }
  });

  // Fill in
  function renderWFill(){
    var s=getW();
    var tpl=s.fill.template;
    var blanks=s.fill.blanks;

    var html = escapeHtml(tpl);
    Object.keys(blanks).forEach(function(k){
      var opts = blanks[k].opts.map(function(o){
        return "<option value='"+escapeHtml(o)+"'>"+escapeHtml(o).replace(/\n/g,"\\n")+"</option>";
      }).join("");
      var sel = "<select data-b='"+escapeHtml(k)+"'><option value=''>— choose —</option>"+opts+"</select>";
      html = html.replace(new RegExp("\\\\{"+k+"\\\\}","g"), sel);
    });

    $("#wFill").innerHTML = html;
    $("#wFill").__blanks = blanks;
    $("#wFillFeedback").className="feedback";
    $("#wFillFeedback").textContent="Fill the blanks, then click Check.";
  }

  function checkWFill(){
    var blanks=$("#wFill").__blanks || {};
    var sels=$all("select[data-b]", $("#wFill"));
    var ok=0, total=sels.length;
    sels.forEach(function(sel){
      var k=sel.getAttribute("data-b");
      var a=blanks[k].a;
      sel.classList.remove("ok","no");
      if(!sel.value){ sel.classList.add("no"); return; }
      if(sel.value===a){ ok++; sel.classList.add("ok"); } else sel.classList.add("no");
    });
    if(ok===total){
      $("#wFillFeedback").className="feedback good";
      $("#wFillFeedback").textContent="✅ Perfect.";
      addScore(2);
    }else{
      $("#wFillFeedback").className="feedback warn";
      $("#wFillFeedback").textContent="Correct: "+ok+" / "+total+".";
    }
  }

  $("#btnResetWFill").addEventListener("click", renderWFill);
  $("#btnCheckWFill").addEventListener("click", checkWFill);

  function checkEmailDraft(text){
    var t=String(text||"").trim();
    var score=0;
    var tips=[];
    if(t.length < 60) tips.push("Add more detail (aim for 5–8 lines)."); else score++;
    if(/\b(dear|hello|to whom|hi)\b/i.test(t)) score++; else tips.push("Add a greeting (Hello / Dear...).");
    if(/\b(i\s*(am|'m)\s+writing|i\s+would\s+like|i\s*(am|'m)\s+contacting)\b/i.test(t)) score++; else tips.push("Add a clear reason: “I’m writing to…”");
    if(/\b(could\s+you|would\s+it\s+be\s+possible|i\s+would\s+appreciate)\b/i.test(t)) score++; else tips.push("Add a polite request: “Could you please…?”");
    if(/\b(thank\s+you|thanks)\b/i.test(t)) score++; else tips.push("Add a thank-you line.");
    if(/\b(best\s+regards|kind\s+regards|regards)\b/i.test(t)) score++; else tips.push("Add a closing: Best regards / Kind regards.");
    return {score:score, tips:tips};
  }

  $("#btnCheckWDraft").addEventListener("click", function(){
    var res=checkEmailDraft($("#wDraft").value);
    if(res.score>=5){
      $("#wDraftFeedback").className="feedback good";
      $("#wDraftFeedback").textContent="✅ Strong structure. Next: add 1 connector (Overall / For example).";
      addScore(3);
    }else{
      $("#wDraftFeedback").className="feedback warn";
      $("#wDraftFeedback").textContent="Improve: "+res.tips.slice(0,3).join(" ");
    }
  });

  $("#btnCopyWDraft").addEventListener("click", function(){ copyToClipboard($("#wDraft").value); });
  $("#btnListenWDraft").addEventListener("click", function(){ speak($("#wDraft").value.replace(/\n/g," ")); });

  function renderWModel(){
    var s=getW();
    $("#wContext").textContent=s.context;
    $("#wTask").textContent=s.task;

    var box=$("#wModelBox");
    box.innerHTML="<div><strong>Subject:</strong> "+escapeHtml(s.model.subject)+"</div><pre style='margin:10px 0 0; white-space:pre-wrap'>"+escapeHtml(s.model.body)+"</pre>";

    $("#btnListenWModel").onclick = function(){ speak("Subject. "+s.model.subject+". "+s.model.body.replace(/\n/g," ")); };
    $("#btnCopyWModel").onclick = function(){ copyToClipboard("Subject: "+s.model.subject+"\n\n"+s.model.body); };

    var phrases=[]
      .concat(DATA.phraseBank.greetings.slice(0,2).map(function(x){return x.en;}))
      .concat(DATA.phraseBank.openers.slice(0,2).map(function(x){return x.en;}))
      .concat(DATA.phraseBank.requests.slice(0,2).map(function(x){return x.en;}))
      .concat(DATA.phraseBank.closings.slice(0,2).map(function(x){return x.en;}));

    var pb=$("#wPhraseBank");
    pb.innerHTML="";
    phrases.forEach(function(p){
      var b=document.createElement("button");
      b.type="button"; b.textContent=p;
      b.addEventListener("click", function(){ speak(p); });
      pb.appendChild(b);
    });

    var v=$("#wVocab");
    v.innerHTML="";
    s.vocab.forEach(function(it){
      var chip=document.createElement("div");
      chip.className="vocabchip";
      chip.innerHTML="<span>"+escapeHtml(it.icon)+"</span><span><strong>"+escapeHtml(it.en)+"</strong> <span class='muted'>("+escapeHtml(it.fr)+")</span></span>";
      v.appendChild(chip);
    });

    initWBuilder(true);
    renderWFill();

    $("#wDraftFeedback").className="feedback";
    $("#wDraftFeedback").textContent="Write your draft. Aim for: greeting → reason → request → details → closing.";
  }

  wSel.addEventListener("change", function(){
    state.wId=wSel.value;
    LS.set(KEY.state,state);
    renderWModel();
  });

  // Oral
  var oSel = $("#oSelect");
  function initOralSelect(){
    oSel.innerHTML="";
    DATA.oralScenarios.forEach(function(s){
      var o=document.createElement("option");
      o.value=s.id;
      o.textContent="🎤 " + s.title;
      oSel.appendChild(o);
    });
    oSel.value = state.oId;
  }
  function getO(){
    return DATA.oralScenarios.find(function(s){ return s.id===oSel.value; }) || DATA.oralScenarios[0];
  }

  $("#btnShowOModel").addEventListener("click", function(){ $("#oModelBox").hidden = !$("#oModelBox").hidden; });

  var oTimerId=null, oBase=45, oRemain=45;
  function stopOTimer(){ if(oTimerId){ clearInterval(oTimerId); oTimerId=null; } }
  function setOTimer(sec){ oBase=sec; oRemain=sec; $("#oTimerNum").textContent=String(sec); }
  function startOTimer(){
    stopOTimer();
    oRemain=oBase;
    $("#oTimerNum").textContent=String(oRemain);
    $("#oFeedback").className="feedback";
    $("#oFeedback").textContent="Speak calmly. Follow the 3 steps.";
    oTimerId=setInterval(function(){
      oRemain -= 1;
      $("#oTimerNum").textContent=String(Math.max(0,oRemain));
      if(oRemain<=0){
        stopOTimer();
        $("#oFeedback").className="feedback good";
        $("#oFeedback").textContent="✅ Time. Finish with a polite closing sentence.";
        speak("Time. Finish with a polite closing sentence.");
      }
    }, 1000);
  }

  function presetO(btnId, sec){
    var b=$(btnId);
    b.addEventListener("click", function(){
      $all("#oral .chipbtn").forEach(function(x){ x.classList.remove("is-on"); });
      b.classList.add("is-on");
      setOTimer(sec);
    });
  }
  presetO("#o30",30);
  presetO("#o45",45);
  presetO("#o60",60);

  $("#btnStartO").addEventListener("click", startOTimer);
  $("#btnStopO").addEventListener("click", stopOTimer);
  $("#btnResetO").addEventListener("click", function(){ stopOTimer(); setOTimer(oBase); });

  function renderOral(){
    var s=getO();
    $("#oPrompt").textContent=s.prompt;
    $("#oRec").innerHTML="⏱ Recommended: <strong>"+String(s.recommended||45)+"</strong>s";
    setOTimer(s.recommended||45);

    $all("#oral .chipbtn").forEach(function(x){ x.classList.remove("is-on"); });
    ((s.recommended||45)===60?$("#o60"):((s.recommended||45)===30?$("#o30"):$("#o45"))).classList.add("is-on");

    var plan=$("#oPlan");
    plan.innerHTML="";
    s.steps.forEach(function(st){
      var d=document.createElement("div");
      d.className="planstep";
      d.innerHTML="<div class='t'>"+escapeHtml(st.t)+"</div><div class='h'>"+escapeHtml(st.hint)+"</div>";
      plan.appendChild(d);
    });

    $("#oModelText").textContent=s.model;
    $("#btnListenOModel").onclick=function(){ speak(s.model); };
    $("#btnCopyOModel").onclick=function(){ copyToClipboard(s.model); };

    $("#oFeedback").className="feedback";
    $("#oFeedback").textContent="Listen once. Then speak without reading.";

    var cb=$("#oCompBank");
    cb.innerHTML="";
    ["quieter than","more convenient than","better than","the most important","the best","the worst"].forEach(function(p){
      var b=document.createElement("button");
      b.type="button"; b.textContent=p;
      b.addEventListener("click", function(){ speak(p); });
      cb.appendChild(b);
    });

    var ob=$("#oConnBank");
    ob.innerHTML="";
    DATA.connectors.slice(0,6).forEach(function(c){
      var b=document.createElement("button");
      b.type="button"; b.textContent=c.t;
      b.addEventListener("click", function(){ speak(c.t); });
      ob.appendChild(b);
    });

    $("#oNotes").value = LS.get(KEY.notesO, "");
  }

  oSel.addEventListener("change", function(){
    state.oId=oSel.value;
    LS.set(KEY.state,state);
    renderOral();
  });

  $("#btnDoneO").addEventListener("click", function(){
    var idx = DATA.oralScenarios.findIndex(function(s){ return s.id===getO().id; });
    var key = "o"+(idx+1);
    if(!state.completed[key]){
      state.completed[key]=true;
      addScore(8);
      LS.set(KEY.state,state);
      countCompleted();
    }
    $("#oFeedback").className="feedback good";
    $("#oFeedback").textContent="✅ Great. Now try the other accent and add 1 example (For example…).";
  });

  $("#oNotes").addEventListener("input", function(){ LS.set(KEY.notesO, $("#oNotes").value); });
  $("#btnCopyONotes").addEventListener("click", function(){ copyToClipboard($("#oNotes").value); });

  // Flashcards
  var flashCat="all";
  var flash = DATA.flashcards.slice();

  function renderFlash(){
    var list = flash.slice();
    if(flashCat!=="all") list = list.filter(function(x){ return x.cat===flashCat; });
    var grid=$("#flashGrid");
    grid.innerHTML="";
    list.forEach(function(v){
      var card=document.createElement("div");
      card.className="flash";
      card.tabIndex=0;

      var inner=document.createElement("div");
      inner.className="flash__inner";

      var front=document.createElement("div");
      front.className="flash__face flash__front";
      front.innerHTML="<div class='icon'>"+escapeHtml(v.icon)+"</div><div class='word'>"+escapeHtml(v.en)+"</div>";

      var act=document.createElement("div");
      act.className="flash__actions";
      var btn=document.createElement("button");
      btn.type="button";
      btn.textContent="🔊 Listen";
      btn.addEventListener("click", function(e){ e.stopPropagation(); speak(v.en); });
      act.appendChild(btn);
      front.appendChild(act);

      var back=document.createElement("div");
      back.className="flash__face flash__back";
      back.innerHTML="<div><strong>FR</strong></div><div class='fr' style='margin-top:6px'>"+escapeHtml(v.fr)+"</div><div class='tiny muted' style='margin-top:10px'>Tap to flip back</div>";

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);

      function toggle(){ card.classList.toggle("is-flipped"); }
      card.addEventListener("click", toggle);
      card.addEventListener("keydown", function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); toggle(); } });

      grid.appendChild(card);
    });
  }

  $all("[data-fcat]").forEach(function(btn){
    btn.addEventListener("click", function(){
      $all("[data-fcat]").forEach(function(x){ x.classList.remove("is-on"); });
      btn.classList.add("is-on");
      flashCat = btn.getAttribute("data-fcat");
      renderFlash();
    });
  });

  $("#btnShuffleFlash").addEventListener("click", function(){ flash = shuffle(flash); renderFlash(); });

  // Workshop
  $("#finalWriting").value = LS.get(KEY.finalW, "");
  $("#finalOral").value = LS.get(KEY.finalO, "");
  $("#finalWriting").addEventListener("input", function(){ LS.set(KEY.finalW, $("#finalWriting").value); });
  $("#finalOral").addEventListener("input", function(){ LS.set(KEY.finalO, $("#finalOral").value); });
  $("#btnCopyFinalW").addEventListener("click", function(){ copyToClipboard($("#finalWriting").value); });
  $("#btnListenFinalW").addEventListener("click", function(){ speak($("#finalWriting").value.replace(/\n/g," ")); });
  $("#btnCopyFinalO").addEventListener("click", function(){ copyToClipboard($("#finalOral").value); });
  $("#btnListenFinalO").addEventListener("click", function(){ speak($("#finalOral").value.replace(/\n/g," ")); });

  // ===== Email essentials: subject lines + greetings + closings =====
  function initEmailEssentials(){
    var purposeSel = $("#subjectPurpose");
    var topicSel = $("#subjectTopic");
    var detailEl = $("#subjectDetail");
    var outEl = $("#subjectOut");
    var greetBank = $("#greetBank");
    var closeBank = $("#closeBank");

    // only run if the section exists
    if (!purposeSel || !topicSel || !detailEl || !outEl || !greetBank || !closeBank) return;

    var SUBJECT_PURPOSES = [
      "Request for information",
      "Request",
      "Confirmation",
      "Follow-up",
      "Complaint",
      "Update"
    ];

    var SUBJECT_TOPICS = [
      "hotel reservation",
      "missing document",
      "appointment",
      "client file",
      "noise issue",
      "travel information"
    ];

    var GREETINGS = [
      "Dear Sir or Madam,",
      "To whom it may concern,",
      "Dear Reservation Team,",
      "Hello,",
      "Hi,",
      "Hi there,"
    ];

    var CLOSINGS = [
      "Thank you in advance for your help.",
      "Thank you for your attention.",
      "I look forward to your reply.",
      "Kind regards,",
      "Best regards,"
    ];

    function fillSelect(sel, items){
      sel.innerHTML = "";
      items.forEach(function(it){
        var o = document.createElement("option");
        o.value = it;
        o.textContent = it;
        sel.appendChild(o);
      });
    }

    function renderBank(el, items){
      el.innerHTML = "";
      items.forEach(function(t){
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = t;
        b.addEventListener("click", function(){ speak(t); });
        el.appendChild(b);
      });
    }

    function buildSubject(){
      var purpose = purposeSel.value || "Request";
      var topic = topicSel.value || "information";
      var detail = String(detailEl.value || "").trim();

      var out = purpose + " — " + topic;
      if (detail) out += " (" + detail + ")";
      outEl.textContent = out;
      return out;
    }

    // init UI
    fillSelect(purposeSel, SUBJECT_PURPOSES);
    fillSelect(topicSel, SUBJECT_TOPICS);
    if (!detailEl.value) detailEl.value = "May 4–6";
    purposeSel.value = "Request for information";
    topicSel.value = "hotel reservation";

    renderBank(greetBank, GREETINGS);
    renderBank(closeBank, CLOSINGS);
    buildSubject();

    var btnBuild = $("#btnBuildSubject");
    var btnCopy = $("#btnCopySubject");
    var btnListen = $("#btnListenSubject");

    if (btnBuild) btnBuild.addEventListener("click", buildSubject);
    if (btnCopy) btnCopy.addEventListener("click", function(){ copyToClipboard(buildSubject()); });
    if (btnListen) btnListen.addEventListener("click", function(){ speak(buildSubject()); });
  }



  function initAll(){
    $("#maxTop").textContent = String(MAX_SCORE);
    $("#maxBottom").textContent = String(MAX_SCORE);
    setScore(scoreState.score||0);
    countCompleted();

    initWritingSelect();
    initOralSelect();

    renderSeq();
    renderComp();
    renderSup();
    setGTab(state.gTab||"seq");

    renderWModel();
    renderOral();
    renderFlash();
  
    initEmailEssentials();
}

  initAll();
})();
