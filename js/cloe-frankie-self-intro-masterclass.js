/* SpeakEasyTisha — Frankie CLOE Self-Introduction Masterclass
   Put this file in: /js/cloe-frankie-self-intro-masterclass.js
*/
(function(){
  "use strict";

  var DATA = {"levels": [{"id": "A2", "label": "A2 (simple)", "desc": "Short, clear sentences. Present simple + likes."}, {"id": "B1", "label": "B1 (expand)", "desc": "Add details + reasons + 1 connector."}, {"id": "B2", "label": "B2 (confident)", "desc": "More natural phrasing + present perfect + transitions."}], "profileTemplates": {"A2": {"title": "A2 Self-Introduction", "text": "Hello, my name is {name}. I live near {city}, in {country}. {regionLine}\n\nI work in administration. I work for {workplace} as an administrative assistant.\n\nIn my free time, I like {likes}.\n\nI have visited {visited}.", "tips": [{"en": "Use present simple: I live / I work / I like.", "fr": "Pr\u00e9sent simple : I live / I work / I like."}, {"en": "Use: in + city/country. Example: in Nantes / in France.", "fr": "in + ville/pays : in Nantes / in France."}]}, "B1": {"title": "B1 Self-Introduction", "text": "Hello, my name is {name}. I currently live near {city}, {country}. {regionLine}\n\nI work in administration for {workplace}. My job is to help with documents, appointments, and customer requests.\n\nIn my free time, I enjoy {likes}. It helps me relax.\n\nI have visited {visited}, and I would like to travel more in the future.", "tips": [{"en": "Add 1 reason: because / so / to relax.", "fr": "Ajoute 1 raison : because / so / to relax."}, {"en": "Use \u2018currently\u2019 for now: I currently live\u2026", "fr": "\u2018currently\u2019 = en ce moment : I currently live\u2026"}]}, "B2": {"title": "B2 Self\u2011Introduction", "text": "Hello, my name is {name}. I\u2019m based near {city}, in {country}. {regionLine}\n\nI work in administration for {workplace}. I support clients by managing files, answering questions, and organising appointments. I also make sure procedures are followed.\n\nOutside of work, I\u2019m interested in {likes}. It\u2019s one of the best ways for me to disconnect.\n\nI\u2019ve visited {visited}. Overall, travelling helps me discover new cultures and practise my English.", "tips": [{"en": "Use present perfect for experience: I\u2019ve visited\u2026 / I\u2019ve been to\u2026", "fr": "Present perfect : I\u2019ve visited\u2026 / I\u2019ve been to\u2026"}, {"en": "Use transitions: overall, for example, to sum up.", "fr": "Transitions : overall, for example, to sum up."}]}}, "regionOptions": [{"id": "north", "en": "in the north of", "fr": "dans le nord de"}, {"id": "south", "en": "in the south of", "fr": "dans le sud de"}, {"id": "east", "en": "in the east of", "fr": "dans l\u2019est de"}, {"id": "west", "en": "in the west of", "fr": "dans l\u2019ouest de"}, {"id": "none", "en": "", "fr": ""}], "speakingScenarios": [{"id": "intro_basic", "title": "Introduce yourself (30\u201345s)", "recommended": 45, "prompt": "Please introduce yourself: where you live (near Lille), your job, and one thing you like doing.", "structure": [{"t": "1) Direct intro", "en": "Hello, my name is Frankie and I live in\u2026", "fr": "Bonjour, je m\u2019appelle Frankie et j\u2019habite\u2026"}, {"t": "2) Job + 2 tasks", "en": "I work in administration at\u2026 I help with\u2026", "fr": "Je travaille dans l\u2019administration\u2026"}, {"t": "3) Like + closing", "en": "In my free time, I like\u2026 To sum up\u2026", "fr": "Pendant mon temps libre\u2026 En r\u00e9sum\u00e9\u2026"}], "model": "Hello, my name is Frankie. I live near Lille, in France, in the north of France. I work in administration for CARSAT as an administrative assistant. I help with documents, appointments, and client requests, and I sometimes work with partner organisations. In my free time, I enjoy walking and discovering new places. To sum up, I\u2019m organised, helpful, and I like learning English."}, {"id": "carsat_explain", "title": "How to talk about CARSAT (45\u201360s)", "recommended": 60, "prompt": "Explain where you work (CARSAT) in simple English: what it is, who you help, and what you do.", "structure": [{"t": "1) Name the organisation", "en": "I work for CARSAT\u2026", "fr": "Je travaille pour la CARSAT\u2026"}, {"t": "2) Simple explanation", "en": "It\u2019s part of social security\u2026", "fr": "C\u2019est li\u00e9 \u00e0 la s\u00e9curit\u00e9 sociale\u2026"}, {"t": "3) Tasks + close", "en": "I manage files\u2026 To sum up\u2026", "fr": "Je g\u00e8re des dossiers\u2026 En r\u00e9sum\u00e9\u2026"}], "model": "I work for CARSAT. In simple terms, it\u2019s a social security organisation that deals with pensions and health at work. In my role, I handle files and documents, answer questions, and coordinate with different partners when needed. To sum up, I support people with administrative procedures and I make sure information is correct."}, {"id": "job_focus", "title": "Describe your job (45\u201360s)", "recommended": 60, "prompt": "Describe your job at CARSAT: what you do, who you work with (clients + partner organisations), and one example.", "structure": [{"t": "1) Role", "en": "I work as\u2026 at\u2026", "fr": "Je travaille comme\u2026"}, {"t": "2) Responsibilities", "en": "I handle\u2026 I manage\u2026 I organise\u2026", "fr": "Je g\u00e8re\u2026 j\u2019organise\u2026"}, {"t": "3) Example + close", "en": "For example\u2026 Overall\u2026", "fr": "Par exemple\u2026 Globalement\u2026"}], "model": "I work in administration for CARSAT, a social security organisation. In a typical day, I manage company documents and client files, answer questions, and organise appointments. I also work with different partner organisations to make sure information is complete and correct. For example, I might check a file, request a missing document, and update the system. Overall, my job requires organisation, clear communication, and attention to detail."}, {"id": "where_live", "title": "Where you live (45s)", "recommended": 45, "prompt": "Say where you live (near Lille) using city/country and one direction (north/south/east/west). Add one reason why you like it.", "structure": [{"t": "1) Location", "en": "I live in\u2026 in the west of\u2026", "fr": "J\u2019habite \u00e0\u2026 dans l\u2019ouest de\u2026"}, {"t": "2) Describe", "en": "It\u2019s\u2026 / There are\u2026", "fr": "C\u2019est\u2026 / Il y a\u2026"}, {"t": "3) Reason", "en": "I like it because\u2026", "fr": "J\u2019aime parce que\u2026"}], "model": "I live near Lille, in the north of France. It\u2019s a lively area and it\u2019s close to Belgium. There are many places to visit, and transport is convenient. I like it because it\u2019s practical, and I can travel easily from there."}, {"id": "travel_experience", "title": "Places you have visited (45\u201360s)", "recommended": 60, "prompt": "Talk about places you have visited before. Use \u2018I\u2019ve visited\u2019 or \u2018I\u2019ve been to\u2019 and one comparison.", "structure": [{"t": "1) Experience", "en": "I\u2019ve visited\u2026 / I\u2019ve been to\u2026", "fr": "J\u2019ai visit\u00e9\u2026"}, {"t": "2) Opinion", "en": "My favourite was\u2026 because\u2026", "fr": "Mon pr\u00e9f\u00e9r\u00e9\u2026"}, {"t": "3) Compare + close", "en": "It was more\u2026 than\u2026 To sum up\u2026", "fr": "Plus\u2026 que\u2026"}], "model": "I\u2019ve visited Ireland and a few cities in France. One of my favourite places was Ballynahinch because it was peaceful and surrounded by nature. It was more relaxing than a big city, and the scenery was beautiful. To sum up, I enjoy trips that are calm and close to nature."}], "vocab": [{"cat": "work", "icon": "\ud83d\uddc2\ufe0f", "word": "administration", "def": "office work (documents, organisation)", "fr": "administration"}, {"cat": "work", "icon": "\ud83e\uddfec", "word": "documents", "def": "official papers", "fr": "documents"}, {"cat": "work", "icon": "\ud83d\udcc5", "word": "appointment", "def": "a scheduled meeting", "fr": "rendez-vous"}, {"cat": "work", "icon": "\ud83d\udccc", "word": "to handle", "def": "to deal with / manage", "fr": "g\u00e9rer"}, {"cat": "work", "icon": "\ud83e\udef6", "word": "to assist", "def": "to help", "fr": "aider"}, {"cat": "location", "icon": "\ud83d\udccd", "word": "to be based in", "def": "to live/work in a place", "fr": "\u00eatre bas\u00e9(e) \u00e0"}, {"cat": "location", "icon": "\ud83e\udded", "word": "in the west of", "def": "west direction in a region/country", "fr": "dans l\u2019ouest de"}, {"cat": "location", "icon": "\ud83d\uddfa\ufe0f", "word": "near", "def": "close to", "fr": "pr\u00e8s de"}, {"cat": "location", "icon": "\u2194\ufe0f", "word": "next to", "def": "beside", "fr": "\u00e0 c\u00f4t\u00e9 de"}, {"cat": "location", "icon": "\ud83c\udf0a", "word": "the coast", "def": "area near the sea", "fr": "la c\u00f4te"}, {"cat": "hobbies", "icon": "\ud83d\udeb6", "word": "to go for a walk", "def": "to walk for pleasure", "fr": "aller se promener"}, {"cat": "hobbies", "icon": "\ud83c\udfac", "word": "movies", "def": "films", "fr": "films"}, {"cat": "hobbies", "icon": "\ud83d\udcf0", "word": "news", "def": "current events", "fr": "actualit\u00e9"}, {"cat": "hobbies", "icon": "\ud83c\udf7d\ufe0f", "word": "local food", "def": "traditional food from the area", "fr": "sp\u00e9cialit\u00e9s locales"}, {"cat": "hobbies", "icon": "\ud83d\udcda", "word": "to learn English", "def": "study and practise English", "fr": "apprendre l\u2019anglais"}, {"cat": "travel", "icon": "\u2708\ufe0f", "word": "flight", "def": "trip by plane", "fr": "vol"}, {"cat": "travel", "icon": "\ud83e\uddf3", "word": "luggage", "def": "bags you travel with", "fr": "bagages"}, {"cat": "travel", "icon": "\ud83c\udf9f\ufe0f", "word": "ticket", "def": "proof of travel/entry", "fr": "billet"}, {"cat": "travel", "icon": "\ud83c\udfe8", "word": "hotel", "def": "place to stay", "fr": "h\u00f4tel"}, {"cat": "travel", "icon": "\ud83c\udf3f", "word": "scenery", "def": "landscape / view", "fr": "paysage"}, {"cat": "work", "icon": "\ud83c\udfdb\ufe0f", "word": "CARSAT", "def": "French regional pension and occupational health organisation (social security)", "fr": "CARSAT"}, {"cat": "work", "icon": "\ud83d\udee1\ufe0f", "word": "social security", "def": "public system for pensions/benefits/health coverage", "fr": "s\u00e9curit\u00e9 sociale"}, {"cat": "work", "icon": "\ud83e\udd1d", "word": "partner organisation", "def": "an organisation you work with", "fr": "organisme partenaire"}, {"cat": "work", "icon": "\ud83c\udfe2", "word": "company document", "def": "official document for a company", "fr": "document d\u2019entreprise"}, {"cat": "work", "icon": "\ud83d\uddc3\ufe0f", "word": "file (case)", "def": "a set of documents about a client", "fr": "dossier"}, {"cat": "work", "icon": "\u2705", "word": "to process", "def": "to handle and complete a procedure", "fr": "traiter"}], "prepositionMini": [{"q": "I live ___ Lille. (city)", "a": "near", "opts": ["near", "in", "at"], "why": "near + city = close to (near Lille)."}, {"q": "I live ___ France. (country)", "a": "in", "opts": ["in", "on", "at"], "why": "Use in + country."}, {"q": "Lille is ___ the north of France.", "a": "in", "opts": ["in", "on", "at"], "why": "in the north of + country/region."}, {"q": "I work ___ CARSAT. (organisation)", "a": "for", "opts": ["for", "at", "in"], "why": "work for + organisation = your employer."}, {"q": "I work ___ administration. (field)", "a": "in", "opts": ["in", "on", "at"], "why": "work in + field/sector."}], "miniTest": [{"type": "mcq", "q": "Choose the correct sentence:", "opts": ["I live at Lille.", "I live near Lille.", "I live on Lille."], "a": 1, "why": "near + city = close to."}, {"type": "mcq", "q": "Choose the correct preposition: I work ___ CARSAT.", "opts": ["for", "in", "on"], "a": 0, "why": "Employer \u2192 work for CARSAT."}, {"type": "mcq", "q": "Choose the correct form:", "opts": ["I like watch movies.", "I like to watching movies.", "I like watching movies."], "a": 2, "why": "like + V\u2011ing is very natural."}, {"type": "drop", "q": "I\u2019ve ___ to Ireland. (experience)", "opts": ["been", "being", "go"], "a": "been", "why": "Present perfect: have been to."}, {"type": "drop", "q": "I\u2019m based ___ Lille. (location)", "opts": ["near", "in", "at"], "a": "near", "why": "based near + city = close to."}, {"type": "drop", "q": "Lille is ___ the north of France.", "opts": ["in", "on", "at"], "a": "in", "why": "in the north of + region/country."}]};

  function $(sel, root){ return (root||document).querySelector(sel); }
  function $all(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }
  function shuffle(arr){ var a=arr.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(m){ return ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" })[m]; }); }

  // Local storage
  var LS = {
    get: function(k, fb){ try{ var v=localStorage.getItem(k); return v===null?fb:JSON.parse(v); }catch(e){ return fb; } },
    set: function(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} },
    del: function(k){ try{ localStorage.removeItem(k); }catch(e){} }
  };
  var KEY = { state:"se_frankie_intro_state_v1", score:"se_frankie_intro_score_v1", notes:"se_frankie_intro_notes_v1" };
  var state = LS.get(KEY.state, { level:"B1", mastered:{}, awarded:{profile:false,preps:false,speaking:false,writing:false,builder:false,test:false}, builder:{pool:[],lane:[],correct:[]}, test:null });
  var scoreState = LS.get(KEY.score, {score:0});

  function setScore(n){
    scoreState.score = n;
    LS.set(KEY.score, scoreState);
    $("#scoreTop").textContent = String(n);
    $("#scoreBottom").textContent = String(n);
  }
  function addScore(d){ setScore(Math.max(0, (scoreState.score||0) + d)); }

  function bumpMasteredUI(){
    var keys = Object.keys(state.mastered||{}).filter(function(k){ return !!state.mastered[k]; });
    $("#masteredMax").textContent = String(DATA.speakingScenarios.length);
    $("#masteredCount").textContent = String(keys.length);
  }
  bumpMasteredUI();
  setScore(scoreState.score||0);

  // Speech
  var accentSel = $("#accent");
  var speechSupported = ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);
  function stopSpeech(){ if(!speechSupported) return; try{ window.speechSynthesis.cancel(); }catch(e){} }
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
    u.rate = 0.98; u.pitch = 1.0;
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

  // Toast
  function toast(msg){
    var t = document.createElement("div");
    t.textContent = msg;
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

  // Copy helpers
  function copyToClipboard(text){
    var t = String(text||"");
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(function(){ toast("Copied!"); }).catch(function(){ fallbackCopy(t); });
    }else{
      fallbackCopy(t);
    }
  }
  function fallbackCopy(t){
    var ta = document.createElement("textarea");
    ta.value = t;
    ta.style.position="fixed";
    ta.style.left="-9999px";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try{ document.execCommand("copy"); toast("Copied!"); }catch(e){ alert("Copy failed."); }
    document.body.removeChild(ta);
  }

  // Print + reset
  $("#btnPrint").addEventListener("click", function(){ window.print(); });
  $("#btnResetAll").addEventListener("click", function(){
    stopSpeech();
    LS.del(KEY.state); LS.del(KEY.score); LS.del(KEY.notes);
    state = { level:"B1", mastered:{}, awarded:{profile:false,preps:false,speaking:false,writing:false,builder:false,test:false}, builder:{pool:[],lane:[],correct:[]}, test:null };
    scoreState = {score:0};
    setScore(0);
    bumpMasteredUI();
    if($("#notesBox")) $("#notesBox").value="";
    initAll();
    toast("Reset done.");
  });

  // Starter bank
  var starters = ["Hello, my name is…","I live in…","I work in administration.","In my free time, I like…","I’ve visited…","To sum up,…"];
  var bank = $("#starterBank");
  if(bank){
    starters.forEach(function(p){
      var b=document.createElement("button");
      b.type="button";
      b.textContent=p;
      b.addEventListener("click", function(){ speak(p); });
      bank.appendChild(b);
    });
  }

  $("#btnJumpPractice").addEventListener("click", function(){
    $("#speaking").scrollIntoView({behavior:"smooth", block:"start"});
  });

  // Region select
  function initRegion(){
    var sel=$("#fRegion");
    sel.innerHTML="";
    DATA.regionOptions.forEach(function(r){
      var o=document.createElement("option");
      o.value=r.id;
      o.textContent = r.id==="none" ? "— no direction —" : (r.en + " " + ($("#fCountry").value||"your country"));
      sel.appendChild(o);
    });
    if(!sel.value) sel.value="north";
  }

  // Level tabs
  function renderLevelTabs(){
    var wrap=$("#levelTabs");
    wrap.innerHTML="";
    DATA.levels.forEach(function(l){
      var b=document.createElement("button");
      b.type="button";
      b.className="ltab" + (state.level===l.id ? " is-on" : "");
      b.textContent=l.label;
      b.title=l.desc;
      b.addEventListener("click", function(){
        state.level=l.id;
        LS.set(KEY.state,state);
        renderLevelTabs();
        renderProfile();
        initBuilderState(true);
      });
      wrap.appendChild(b);
    });
  }

  function regionLine(country){
    var sel=$("#fRegion");
    var r=DATA.regionOptions.find(function(x){ return x.id===sel.value; }) || DATA.regionOptions[4];
    if(!r.en) return "";
    return "I live " + r.en + " " + country + ".";
  }

  function applyTemplate(tpl, vars){
    return String(tpl||"").replace(/\{([^}]+)\}/g, function(_,k){
      return (vars[k]!==undefined ? vars[k] : "");
    });
  }

  function getProfileVars(){
    var name=$("#fName").value.trim() || "Frankie";
    var city=$("#fCity").value.trim() || "Lille";
    var country=$("#fCountry").value.trim() || "France";
    var workplace=$("#fWorkplace").value.trim() || "CARSAT";
    var job=$("#fJob").value.trim() || "administrative assistant";
    var likes=$("#fLikes").value.trim() || "walking";
    var visited=$("#fVisited").value.trim() || "Ireland";
    var rline = regionLine(country);
    return {name:name, city:city, country:country, workplace:workplace, job:job, likes:likes, visited:visited, regionLine:rline};
  }

  function renderProfile(){
    initRegion();
    var vars=getProfileVars();
    var tpl=DATA.profileTemplates[state.level];
    var text=applyTemplate(tpl.text, vars).replace(/\n\n\n+/g,"\n\n");
    $("#outTitle").textContent = tpl.title;
    $("#outText").textContent = text;

    var tipsBody=$("#tipsBody");
    tipsBody.innerHTML="";
    tpl.tips.forEach(function(t){
      var div=document.createElement("div");
      div.className="tip";
      div.innerHTML="<div><strong>"+escapeHtml(t.en)+"</strong></div><div class='fr'>FR: "+escapeHtml(t.fr)+"</div>";
      tipsBody.appendChild(div);
    });

    $("#profileFeedback").className="feedback";
    $("#profileFeedback").textContent = "Practice: read it once, then say it without looking (45 seconds).";
  }

  $("#btnShowTips").addEventListener("click", function(){
    var box=$("#tipsBox");
    box.hidden = !box.hidden;
  });
  $("#btnCopyProfile").addEventListener("click", function(){ copyToClipboard($("#outText").textContent); });
  $("#btnListenProfile").addEventListener("click", function(){ speak($("#outText").textContent); });
  $("#btnMarkProfile").addEventListener("click", function(){
    if(!state.awarded.profile){ addScore(5); state.awarded.profile=true; LS.set(KEY.state,state); }
    $("#profileFeedback").className="feedback good";
    $("#profileFeedback").textContent="✅ Great. Now do the speaking trainer (same content, more natural).";
  });

  ["fName","fCity","fCountry","fWorkplace","fJob","fLikes","fVisited"].forEach(function(id){
    var el=$("#"+id);
    if(!el) return;
    el.addEventListener("input", function(){ renderProfile(); renderWriting(); initBuilderState(true); });
  });
  $("#fRegion").addEventListener("change", function(){ renderProfile(); renderWriting(); initBuilderState(true); });

  $("#btnListenBest").addEventListener("click", function(){
    var v=getProfileVars();
    var line = "Hello, my name is "+v.name+". I’m based near "+v.city+", in "+v.country+". "+(v.regionLine||"")+" I work in administration for "+v.workplace+" as an "+v.job+". Outside of work, I’m interested in "+v.likes+". I’ve visited "+v.visited+". To sum up, I’m organised and I enjoy learning English.";
    speak(line);
  });

  // Prepositions mini
  var prepSet = DATA.prepositionMini.slice();
  function renderPreps(){
    var list=$("#prepList"); list.innerHTML="";
    prepSet.forEach(function(item){
      var line=document.createElement("div"); line.className="qline"; line.setAttribute("data-a", item.a);
      line.innerHTML="<div class='q'>"+escapeHtml(item.q)+"</div>";
      var sel=document.createElement("select");
      sel.innerHTML="<option value=''>— choose —</option>"+item.opts.map(function(o){ return "<option>"+escapeHtml(o)+"</option>"; }).join("");
      var why=document.createElement("div"); why.className="why"; why.textContent=item.why;
      line.appendChild(sel); line.appendChild(why);
      list.appendChild(line);
    });
    $("#prepFeedback").className="feedback";
    $("#prepFeedback").textContent="Choose answers, then click Check.";
  }
  renderPreps();
  $("#btnNewPreps").addEventListener("click", function(){ prepSet = shuffle(DATA.prepositionMini).slice(0,5); renderPreps(); });
  $("#btnResetPreps").addEventListener("click", renderPreps);
  $("#btnCheckPreps").addEventListener("click", function(){
    var lines=$all("#prepList .qline"); var ok=0;
    lines.forEach(function(line){
      var a=line.getAttribute("data-a");
      var sel=line.querySelector("select");
      var why=line.querySelector(".why");
      line.classList.remove("ok","no");
      if(sel.value && sel.value===a){ ok++; line.classList.add("ok"); } else line.classList.add("no");
      why.style.display="block";
    });
    $("#prepFeedback").className = ok===lines.length ? "feedback good" : "feedback warn";
    $("#prepFeedback").textContent = "Score: "+ok+" / "+lines.length+".";
    if(ok===lines.length && !state.awarded.preps){ addScore(6); state.awarded.preps=true; LS.set(KEY.state,state); }
  });

  // Speaking trainer
  var sSel=$("#sScenario");
  function initSpeaking(){
    sSel.innerHTML="";
    DATA.speakingScenarios.forEach(function(s){
      var o=document.createElement("option");
      o.value=s.id;
      o.textContent="🎤 " + s.title;
      sSel.appendChild(o);
    });
    if(!sSel.value) sSel.value = DATA.speakingScenarios[0].id;
  }
  initSpeaking();
  function getSpeakScenario(){
    var id=sSel.value;
    return DATA.speakingScenarios.find(function(s){ return s.id===id; }) || DATA.speakingScenarios[0];
  }

  // connectors
  var cBank=["First of all,","Also,","For example,","However,","Overall,","To sum up,"];
  var cb=$("#connectorBank");
  if(cb){
    cBank.forEach(function(p){
      var b=document.createElement("button");
      b.type="button";
      b.textContent=p;
      b.addEventListener("click", function(){ speak(p); });
      cb.appendChild(b);
    });
  }

  // speaking timer
  var speakTimerId=null, speakBase=45, speakRemain=45;
  function setSpeakTimer(sec){ speakBase=sec; speakRemain=sec; $("#sTimerNum").textContent=String(sec); }
  function stopSpeak(){ if(speakTimerId){ clearInterval(speakTimerId); speakTimerId=null; } }
  function startSpeak(){
    stopSpeak();
    speakRemain=speakBase;
    $("#sTimerNum").textContent=String(speakRemain);
    $("#sFeedback").className="feedback";
    $("#sFeedback").textContent="Speak calmly. Use the structure: intro → details → close.";
    speakTimerId=setInterval(function(){
      speakRemain-=1;
      $("#sTimerNum").textContent=String(Math.max(0,speakRemain));
      if(speakRemain<=0){
        stopSpeak();
        $("#sFeedback").className="feedback good";
        $("#sFeedback").textContent="✅ Time. Finish with a polite closing sentence.";
        speak("Time. Finish with a polite closing sentence.");
      }
    }, 1000);
  }
  $("#btnStartSpeak").addEventListener("click", startSpeak);
  $("#btnStopSpeak").addEventListener("click", stopSpeak);
  $("#btnResetSpeak").addEventListener("click", function(){ stopSpeak(); setSpeakTimer(speakBase); });

  function presetSpeak(btnId, sec){
    var b=$(btnId);
    if(!b) return;
    b.addEventListener("click", function(){
      $all("#speaking .chipbtn").forEach(function(x){ x.classList.remove("is-on"); });
      b.classList.add("is-on");
      setSpeakTimer(sec);
    });
  }
  presetSpeak("#sp30",30); presetSpeak("#sp45",45); presetSpeak("#sp60",60);
  setSpeakTimer(45);

  function renderSpeaking(){
    var s=getSpeakScenario();
    $("#sPrompt").textContent = s.prompt;

    var wrap=$("#sStruct"); wrap.innerHTML="";
    s.structure.forEach(function(st){
      var p=document.createElement("div");
      p.className="badge2";
      p.innerHTML="<strong>"+escapeHtml(st.t)+"</strong>";
      wrap.appendChild(p);
    });

    $("#sModel").textContent = s.model;
    $("#btnListenModel").onclick = function(){ speak(s.model); };
    $("#btnShowModel").onclick = function(){ $("#modelBox").hidden = !$("#modelBox").hidden; };

    $("#sFeedback").className="feedback";
    $("#sFeedback").textContent="Listen once, then speak without reading. Try both accents.";

    var rec = s.recommended || 45;
    $all("#speaking .chipbtn").forEach(function(x){ x.classList.remove("is-on"); });
    (rec===60?$("#sp60"):(rec===30?$("#sp30"):$("#sp45"))).classList.add("is-on");
    setSpeakTimer(rec);
  }
  sSel.addEventListener("change", renderSpeaking);

  $("#btnDoneSpeak").addEventListener("click", function(){
    var s=getSpeakScenario();
    if(!state.mastered[s.id]){
      state.mastered[s.id]=true;
      bumpMasteredUI();
      LS.set(KEY.state,state);
      addScore(5);
    }
    $("#sFeedback").className="feedback good";
    $("#sFeedback").textContent="✅ Great. Now try the same prompt with the other accent and add 1 connector.";
  });

  // Writing model + fill-in
  function renderWriting(){
    var vars=getProfileVars();
    var subject="Subject: Nice to meet you";
    var body="Hello,\n\nMy name is "+vars.name+" and I live near "+vars.city+", in "+vars.country+". "+(vars.regionLine?vars.regionLine:"")+"\n\nI work in administration for "+vars.workplace+" as an "+vars.job+". In my free time, I like "+vars.likes+".\n\nBest regards,\n"+vars.name;

    $("#emailModel").innerHTML="<div class='subj'>"+escapeHtml(subject)+"</div><pre>"+escapeHtml(body)+"</pre>";
    $("#emailTips").innerHTML="";
    [
      {en:"Keep it short: 5–8 lines.", fr:"Court : 5–8 lignes."},
      {en:"Use: I live near… / I work for… / I like…", fr:"Utilise : I live near… / I work for… / I like…"}
    ].forEach(function(t){
      var div=document.createElement("div");
      div.className="tip";
      div.innerHTML="<div><strong>"+escapeHtml(t.en)+"</strong></div><div class='fr'>FR: "+escapeHtml(t.fr)+"</div>";
      $("#emailTips").appendChild(div);
    });

    $("#btnCopyEmail").onclick=function(){ copyToClipboard(subject+"\n\n"+body); };
    $("#btnListenEmail").onclick=function(){ speak((subject+". "+body).replace(/\n/g," ")); };

    renderEmailFill(vars);
  }

  function renderEmailFill(vars){
    var fill = "Hello, my name is {b0}. I live {b1} "+escapeHtml(vars.city)+", {b2} "+escapeHtml(vars.country)+". I work {b3} "+escapeHtml(vars.workplace)+" as an {b4}.";
    var blanks = [
      {id:"b0", opts:[vars.name,"Frankie","Maria"], a: vars.name},
      {id:"b1", opts:["near","in","at"], a:"near"},
      {id:"b2", opts:["in","on","at"], a:"in"},
      {id:"b3", opts:["for","at","in"], a:"for"},
      {id:"b4", opts:[vars.job,"teacher","manager"], a: vars.job}
    ];
    var html=fill;
    blanks.forEach(function(b){
      var opts=b.opts.map(function(o){ return "<option value='"+escapeHtml(o)+"'>"+escapeHtml(o)+"</option>"; }).join("");
      var sel="<select data-blank='"+escapeHtml(b.id)+"'><option value=''>— choose —</option>"+opts+"</select>";
      html = html.replace("{"+b.id+"}", sel);
    });
    $("#emailFill").innerHTML=html;
    $("#emailFillFeedback").className="feedback";
    $("#emailFillFeedback").textContent="Fill the blanks, then click Check.";
    $("#emailFill").__blanks=blanks;
  }

  $("#btnResetEmailFill").addEventListener("click", function(){ renderWriting(); });
  $("#btnCheckEmailFill").addEventListener("click", function(){
    var blanks=$("#emailFill").__blanks || [];
    var ok=0,total=blanks.length;
    $all("select[data-blank]", $("#emailFill")).forEach(function(sel){
      var id=sel.getAttribute("data-blank");
      var b=blanks.find(function(x){ return x.id===id; });
      sel.classList.remove("ok","no");
      if(!sel.value){ sel.classList.add("no"); return; }
      if(sel.value===b.a){ ok++; sel.classList.add("ok"); } else sel.classList.add("no");
    });
    if(ok===total){
      $("#emailFillFeedback").className="feedback good";
      $("#emailFillFeedback").textContent="✅ Perfect.";
      if(!state.awarded.writing){ addScore(6); state.awarded.writing=true; LS.set(KEY.state,state); }
    }else{
      $("#emailFillFeedback").className="feedback warn";
      $("#emailFillFeedback").textContent="Correct: "+ok+"/"+total+". Fix red blanks.";
    }
  });

  // Builder blocks
  function buildBlocksFromProfile(){
    var v=getProfileVars();
    var blocks=[
      "Hello, my name is "+v.name+".",
      "I live near "+v.city+", in "+v.country+".",
      (v.regionLine||""),
      "I work in administration for "+v.workplace+" as an "+v.job+".",
      "In my free time, I like "+v.likes+".",
      "I’ve visited "+v.visited+".",
      "To sum up, I’m organised and I’m happy to speak English today."
    ].filter(function(x){ return x && x.trim().length>0; });
    return blocks;
  }

  function initBuilderState(force){
    var blocks=buildBlocksFromProfile();
    var correct=blocks.map(function(_,i){ return "p"+i; });
    var ids=correct.join("|");
    var saved=(state.builder.correct||[]).join("|");
    if(force || ids!==saved){
      state.builder.pool = shuffle(blocks.map(function(t,i){ return {id:"p"+i, text:t}; }));
      state.builder.lane = [];
      state.builder.correct = correct;
      LS.set(KEY.state,state);
    }
    renderBuilderUI();
  }

  function renderPoolBlock(it){
    var el=document.createElement("div");
    el.className="block";
    el.setAttribute("draggable","true");

    var left=document.createElement("div");
    var tx=document.createElement("div");
    tx.className="block__text";
    tx.textContent=it.text;
    left.appendChild(tx);

    var btns=document.createElement("div");
    btns.className="block__btns";

    var add=document.createElement("button");
    add.type="button";
    add.textContent="➕ Add";
    add.addEventListener("click", function(){ movePoolToLane(it.id); });

    var lis=document.createElement("button");
    lis.type="button";
    lis.textContent="🔊";
    lis.addEventListener("click", function(){ speak(it.text); });

    btns.appendChild(add); btns.appendChild(lis);
    el.appendChild(left); el.appendChild(btns);

    el.addEventListener("dragstart", function(e){
      try{ e.dataTransfer.setData("text/plain", it.id); e.dataTransfer.effectAllowed="move"; }catch(err){}
    });

    return el;
  }

  function renderLaneItem(it){
    var li=document.createElement("li");
    li.className="answeritem";
    li.setAttribute("data-id", it.id);

    var tx=document.createElement("div");
    tx.className="answeritem__text";
    tx.textContent=it.text;

    var btns=document.createElement("div");
    btns.className="answeritem__btns";

    var up=document.createElement("button"); up.type="button"; up.textContent="↑";
    up.addEventListener("click", function(){ moveInLane(it.id,-1); });

    var dn=document.createElement("button"); dn.type="button"; dn.textContent="↓";
    dn.addEventListener("click", function(){ moveInLane(it.id,+1); });

    var rm=document.createElement("button"); rm.type="button"; rm.textContent="✖";
    rm.addEventListener("click", function(){ moveLaneToPool(it.id); });

    btns.appendChild(up); btns.appendChild(dn); btns.appendChild(rm);

    li.appendChild(tx); li.appendChild(btns);

    li.addEventListener("dragover", function(e){ e.preventDefault(); });
    li.addEventListener("drop", function(e){
      e.preventDefault();
      var drag="";
      try{ drag=e.dataTransfer.getData("text/plain"); }catch(err){}
      if(drag) dropBefore(drag, it.id);
    });

    return li;
  }

  function renderBuilderUI(){
    var pool=$("#bPool"), lane=$("#bLane");
    pool.innerHTML=""; lane.innerHTML="";
    state.builder.pool.forEach(function(it){ pool.appendChild(renderPoolBlock(it)); });
    state.builder.lane.forEach(function(it){ lane.appendChild(renderLaneItem(it)); });
    $("#builderFeedback").className="feedback";
    $("#builderFeedback").textContent="Build the paragraph: intro → location → job → likes → travel → closing.";
  }

  function movePoolToLane(id){
    var idx=state.builder.pool.findIndex(function(x){ return x.id===id; });
    if(idx<0) return;
    state.builder.lane.push(state.builder.pool.splice(idx,1)[0]);
    LS.set(KEY.state,state);
    renderBuilderUI();
  }
  function moveLaneToPool(id){
    var idx=state.builder.lane.findIndex(function(x){ return x.id===id; });
    if(idx<0) return;
    state.builder.pool.push(state.builder.lane.splice(idx,1)[0]);
    LS.set(KEY.state,state);
    renderBuilderUI();
  }
  function moveInLane(id, d){
    var idx=state.builder.lane.findIndex(function(x){ return x.id===id; });
    if(idx<0) return;
    var n=idx+d;
    if(n<0||n>=state.builder.lane.length) return;
    var t=state.builder.lane[idx];
    state.builder.lane[idx]=state.builder.lane[n];
    state.builder.lane[n]=t;
    LS.set(KEY.state,state);
    renderBuilderUI();
  }
  function dropBefore(dragId, beforeId){
    var beforeIdx=state.builder.lane.findIndex(function(x){ return x.id===beforeId; });
    if(beforeIdx<0) return;

    var fromPool=state.builder.pool.findIndex(function(x){ return x.id===dragId; });
    var fromLane=state.builder.lane.findIndex(function(x){ return x.id===dragId; });
    var item=null;

    if(fromPool>=0) item=state.builder.pool.splice(fromPool,1)[0];
    else if(fromLane>=0){
      item=state.builder.lane.splice(fromLane,1)[0];
      beforeIdx=state.builder.lane.findIndex(function(x){ return x.id===beforeId; });
      if(beforeIdx<0) beforeIdx=state.builder.lane.length;
    }else return;

    state.builder.lane.splice(beforeIdx,0,item);
    LS.set(KEY.state,state);
    renderBuilderUI();
  }

  $("#bLane").addEventListener("dragover", function(e){ e.preventDefault(); });
  $("#bLane").addEventListener("drop", function(e){
    e.preventDefault();
    var id="";
    try{ id=e.dataTransfer.getData("text/plain"); }catch(err){}
    if(id) movePoolToLane(id);
  });

  function builderText(){ return state.builder.lane.map(function(x){ return x.text; }).join(" "); }

  $("#btnBuilderReset").addEventListener("click", function(){ initBuilderState(true); });
  $("#btnBuilderListen").addEventListener("click", function(){
    var t=builderText();
    if(!t.trim()) return toast("Add blocks first.");
    speak(t);
  });
  $("#btnBuilderCopy").addEventListener("click", function(){
    var t=builderText();
    if(!t.trim()) return toast("Add blocks first.");
    copyToClipboard(t);
  });
  $("#btnBuilderCheck").addEventListener("click", function(){
    var need=state.builder.correct.length;
    if(state.builder.lane.length!==need){
      $("#builderFeedback").className="feedback warn";
      $("#builderFeedback").textContent="Add all blocks first (tap ➕ Add).";
      return;
    }
    var ok=0;
    for(var i=0;i<need;i++) if(state.builder.lane[i].id===state.builder.correct[i]) ok++;
    if(ok===need){
      $("#builderFeedback").className="feedback good";
      $("#builderFeedback").textContent="✅ Perfect order.";
      if(!state.awarded.builder){ addScore(8); state.awarded.builder=true; LS.set(KEY.state,state); }
    }else{
      $("#builderFeedback").className="feedback warn";
      $("#builderFeedback").textContent="Correct positions: "+ok+" / "+need+". Use ↑ ↓ to adjust.";
    }
  });

  // Vocabulary flashcards
  var vocabFilter="all";
  var vocabList=DATA.vocab.slice();

  function renderFlashcards(list){
    var grid=$("#flashGrid"); grid.innerHTML="";
    list.forEach(function(v){
      var card=document.createElement("div");
      card.className="flash";
      card.tabIndex=0;

      var inner=document.createElement("div");
      inner.className="flash__inner";

      var front=document.createElement("div");
      front.className="flash__face flash__front";

      var ic=document.createElement("div"); ic.className="icon"; ic.textContent=v.icon||"🧠";
      var w=document.createElement("div"); w.className="word"; w.textContent=v.word;

      var actions=document.createElement("div"); actions.className="flash__actions";
      var listen=document.createElement("button"); listen.type="button"; listen.textContent="🔊 Listen";
      listen.addEventListener("click", function(e){ e.stopPropagation(); speak(v.word); });
      actions.appendChild(listen);

      front.appendChild(ic); front.appendChild(w); front.appendChild(actions);

      var back=document.createElement("div"); back.className="flash__face flash__back";
      back.innerHTML="<div><strong>Meaning</strong></div><div style='margin-top:6px'>"+escapeHtml(v.def)+"</div>"
        + "<div class='fr' style='margin-top:10px'><strong>FR:</strong> "+escapeHtml(v.fr||"—")+"</div>"
        + "<div class='tiny muted' style='margin-top:10px'>Tap to flip back</div>";

      inner.appendChild(front); inner.appendChild(back);
      card.appendChild(inner);

      function toggle(){ card.classList.toggle("is-flipped"); }
      card.addEventListener("click", toggle);
      card.addEventListener("keydown", function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); toggle(); } });

      grid.appendChild(card);
    });
  }

  function applyVFilter(){
    var list=vocabList.slice();
    if(vocabFilter!=="all") list=list.filter(function(v){ return v.cat===vocabFilter; });
    renderFlashcards(list);
  }
  applyVFilter();

  $all("[data-vfilter]").forEach(function(btn){
    btn.addEventListener("click", function(){
      $all("[data-vfilter]").forEach(function(x){ x.classList.remove("is-on"); });
      btn.classList.add("is-on");
      vocabFilter=btn.getAttribute("data-vfilter");
      applyVFilter();
    });
  });

  $("#btnShuffleVocab").addEventListener("click", function(){ vocabList=shuffle(vocabList); applyVFilter(); });

  // Mini test
  function newTest(){
    state.test = shuffle(DATA.miniTest).slice(0,4);
    LS.set(KEY.state,state);
    renderTest();
  }
  function renderTest(){
    var box=$("#testBox"); box.innerHTML="";
    var set = state.test || shuffle(DATA.miniTest).slice(0,4);
    state.test = set; LS.set(KEY.state,state);

    set.forEach(function(item, idx){
      var line=document.createElement("div"); line.className="qline"; line.setAttribute("data-idx", String(idx));
      line.innerHTML="<div class='q'>"+escapeHtml(item.q)+"</div>";

      if(item.type==="mcq"){
        var opts=document.createElement("div"); opts.className="options"; opts.style.marginTop="10px";
        item.opts.forEach(function(o, oi){
          var lab=document.createElement("label"); lab.className="opt";
          var r=document.createElement("input"); r.type="radio"; r.name="t"+idx; r.value=String(oi);
          var t=document.createElement("div"); t.textContent=o;
          lab.appendChild(r); lab.appendChild(t); opts.appendChild(lab);
        });
        line.appendChild(opts);
      }else{
        var sel=document.createElement("select");
        sel.innerHTML="<option value=''>— choose —</option>"+item.opts.map(function(o){ return "<option>"+escapeHtml(o)+"</option>"; }).join("");
        line.appendChild(sel);
      }

      var why=document.createElement("div"); why.className="why"; why.textContent=item.why;
      line.appendChild(why);
      box.appendChild(line);
    });

    $("#testFeedback").className="feedback";
    $("#testFeedback").textContent="Answer, then click Check.";
  }
  function checkTest(){
    var set=state.test||[];
    var lines=$all("#testBox .qline");
    var ok=0,total=set.length;

    lines.forEach(function(line){
      var idx=parseInt(line.getAttribute("data-idx"),10);
      var item=set[idx];
      line.classList.remove("ok","no");
      var why=line.querySelector(".why");

      if(item.type==="mcq"){
        var chosen=line.querySelector("input[type=radio]:checked");
        if(chosen && parseInt(chosen.value,10)===item.a){ ok++; line.classList.add("ok"); }
        else line.classList.add("no");
      }else{
        var sel=line.querySelector("select");
        if(sel && sel.value===item.a){ ok++; line.classList.add("ok"); }
        else line.classList.add("no");
      }
      why.style.display="block";
    });

    $("#testFeedback").className = ok===total ? "feedback good" : "feedback warn";
    $("#testFeedback").textContent = "Score: "+ok+" / "+total+".";
    if(ok===total && !state.awarded.test){ addScore(7); state.awarded.test=true; LS.set(KEY.state,state); }
  }
  $("#btnNewTest").addEventListener("click", newTest);
  $("#btnResetTest").addEventListener("click", renderTest);
  $("#btnCheckTest").addEventListener("click", checkTest);

  // Notes
  var notes=$("#notesBox");
  if(notes){
    notes.value = LS.get(KEY.notes, "");
    notes.addEventListener("input", function(){ LS.set(KEY.notes, notes.value); });
  }
  $("#btnCopyNotes").addEventListener("click", function(){ copyToClipboard(notes?notes.value:""); });

  function initAll(){
    renderLevelTabs();
    renderProfile();
    renderPreps();
    renderSpeaking();
    renderWriting();
    initBuilderState(true);
    renderTest();
  }

  initAll();
})();