/* SpeakEasyTisha — NYC Trip Planner Compare
   Touch-friendly + US/UK speech synthesis
*/
(function(){
  "use strict";

  // ---------- Helpers ----------
  function $(id){ return document.getElementById(id); }
  function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }
  function escapeHtml(s){
    return String(s||"").replace(/[&<>"']/g,function(m){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]);
    });
  }

  function toast(msg){
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    t.style.position = "fixed";
    t.style.right = "14px";
    t.style.bottom = "14px";
    t.style.zIndex = 9999;
    t.style.maxWidth = "360px";
    t.style.border = "1px solid rgba(255,255,255,.18)";
    t.style.background = "rgba(0,0,0,.55)";
    t.style.backdropFilter = "blur(10px)";
    t.style.borderRadius = "16px";
    t.style.padding = "10px 12px";
    t.style.color = "rgba(244,246,255,.95)";
    t.style.fontWeight = 900;
    t.style.boxShadow = "0 18px 36px rgba(0,0,0,.35)";
    document.body.appendChild(t);
    setTimeout(function(){ t.style.opacity = "0"; t.style.transition = "opacity .35s ease"; }, 1800);
    setTimeout(function(){ if(t && t.parentNode) t.parentNode.removeChild(t); }, 2300);
  }

  // ---------- Speech ----------
  var voices = [];
  var accent = "us";

  function refreshVoices(){
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }
  if(window.speechSynthesis){
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }

  function pickVoice(){
    if(!voices || !voices.length) return null;
    // Prefer English voices; then bias US/UK.
    var en = voices.filter(function(v){
      return /en(-|_)?/i.test(v.lang || "") || /English/i.test(v.name || "");
    });
    var pool = en.length ? en : voices;

    function score(v){
      var n = (v.name||"").toLowerCase();
      var l = (v.lang||"").toLowerCase();
      var s = 0;
      if(accent === "us"){
        if(l.indexOf("en-us")>-1) s += 50;
        if(n.indexOf("us")>-1 || n.indexOf("american")>-1) s += 20;
      }else{
        if(l.indexOf("en-gb")>-1) s += 50;
        if(n.indexOf("uk")>-1 || n.indexOf("british")>-1) s += 20;
      }
      if(v.default) s += 10;
      return s;
    }
    pool.sort(function(a,b){ return score(b)-score(a); });
    return pool[0] || null;
  }

  function speak(text){
    if(!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    var v = pickVoice();
    if(v) u.voice = v;
    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;
    window.speechSynthesis.speak(u);
  }

  function speakSelection(){
    var sel = window.getSelection ? String(window.getSelection()) : "";
    if(sel && sel.trim().length > 0) speak(sel.trim());
    else toast("Select some text first 🙂");
  }

  // ---------- State / Score ----------
  var state = {
    solved: {},
    streak: 0
  };
  var KEY = "SET_NYC_TRIP_PLANNER_COMPARE_v1";

  function load(){
    try{
      var raw = localStorage.getItem(KEY);
      if(raw) state = Object.assign(state, JSON.parse(raw));
    }catch(e){}
  }
  function save(){
    try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){}
  }

  function normalizeMax(){
    // count activities (manual completions + each quiz item)
    var max = 0;
    max += 1; // start done
    max += 1; // places board check
    max += 1; // plan build
    max += 1; // vocab quiz
    max += 1; // NYC lines practice
    max += 2; // suggest
    max += 2; // obligation
    max += 2; // compare
    max += 1; // request builder
    max += 1; // verbs
    max += 1; // say quiz
    max += 1; // scenarios
    max += 1; // negotiate
    max += 1; // tone soften
    max += 1; // errors
    max += 1; // itinerary builder
    max += 1; // speak guided
    max += 1; // wrap quiz
    $("scoreMax").textContent = String(max);
    return max;
  }
  var MAX = 0;

  function countSolved(){
    var n = 0;
    Object.keys(state.solved||{}).forEach(function(k){
      if(state.solved[k]) n += 1;
    });
    return n;
  }

  function updateProgress(){
    var solved = countSolved();
    $("scoreNow").textContent = String(solved);
    $("streakNow").textContent = String(state.streak || 0);
    var pct = MAX ? Math.round((solved / MAX) * 100) : 0;
    pct = clamp(pct, 0, 100);
    $("pctProgress").textContent = pct + "%";
    $("barProgress").style.width = pct + "%";
  }

  function bumpStreak(){
    state.streak = (state.streak || 0) + 1;
  }

  function markSolved(key){
    if(state.solved[key]) return;
    state.solved[key] = true;
    bumpStreak();
    save();
    updateProgress();
  }

  function setHint(text){
    $("hintText").textContent = text;
  }

  function toggleHint(id, text, title){
    var box = $(id);
    if(!box) return;
    var t = box.querySelector(".t");
    if(t) t.textContent = text || "";
    box.hidden = !box.hidden;
    if(!box.hidden){
      setHint((title? (title + " — ") : "") + (text||""));
      toast("Hint shown 💡");
    }
  }

  function copyText(str){
    try{
      navigator.clipboard.writeText(str);
      toast("Copied ✅");
    }catch(e){
      // fallback
      var ta = document.createElement("textarea");
      ta.value = str;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      toast("Copied ✅");
    }
  }

  // ---------- Content ----------
  var nycGreatIdeas = [
    "it’s incredibly diverse (people + languages)",
    "you can walk everywhere (neighborhood vibes)",
    "there’s amazing food at every price",
    "art + museums + shows are world‑class",
    "iconic skyline views (day + night)",
    "parks + ‘pause moments’ in the middle of the city",
    "it feels alive 24/7 (energy + surprises)",
    "every neighborhood feels like a new mini‑city",
    "history + modern life in the same street",
    "it’s perfect for couples and friends: mix romance + fun"
  ];

  var places = [
    {id:"p1", name:"Central Park (walk + picnic)", bucket:"amazing",
      tags:["nature","views","budget","romantic","relax"],
      what:"A huge green break from the city: lakes, bridges, lawns, skyline peeks. It feels like you escaped NYC — while still being in the middle of it.",
      pros:["Calm + scenic (perfect reset)","Great photos and people‑watching","Cheap: walk, coffee, picnic"],
      cons:["Huge — don’t try to see everything"],
      tip:"Go early or late afternoon. Choose 2–3 iconic spots (Bethesda Terrace, Bow Bridge).",
      phrase:"Central Park is better than Times Square because it’s calmer."},

    {id:"p2", name:"The Met (Metropolitan Museum of Art)", bucket:"amazing",
      tags:["culture","rainy-day","classic"],
      what:"One of the world’s biggest museums. Egypt, paintings, armor, fashion… You’ll get a real ‘wow’ moment even if you pick only a few sections.",
      pros:["World‑class collections","Perfect rainy‑day plan","Quiet + impressive"],
      cons:["Museum fatigue if you try to do it all"],
      tip:"Pick a theme (Egypt / Impressionists / rooftop in season) and stop after 2–3 hours.",
      phrase:"The Met is worth it if you like art and history."},

    {id:"p3", name:"High Line + Chelsea Market", bucket:"amazing",
      tags:["views","food","walk","modern"],
      what:"An elevated park built on an old rail line: modern, artistic, and full of city views. Pair it with Chelsea Market for easy food choices.",
      pros:["Easy scenic walk","Cool modern NYC atmosphere","Food options in one place"],
      cons:["Can be busy on weekends"],
      tip:"Weekday morning is best. Walk one direction and end with lunch.",
      phrase:"Let’s do the High Line, then grab food nearby."},

    {id:"p4", name:"Brooklyn Bridge → DUMBO (early)", bucket:"amazing",
      tags:["views","classic","photo","walk"],
      what:"A classic bridge walk with skyline views. DUMBO has postcard streets, cafés, and waterfront spots — best in the morning for fewer crowds.",
      pros:["Iconic skyline","Great photos","Easy half‑day plan"],
      cons:["Crowded later in the day"],
      tip:"Start in Manhattan, end in Brooklyn for coffee; take the subway back.",
      phrase:"Let’s go early so we can avoid crowds."},

    {id:"p5", name:"Staten Island Ferry (free views)", bucket:"amazing",
      tags:["views","budget","easy"],
      what:"A simple ferry ride with big Lower Manhattan harbor views. It’s not fancy — but it’s one of the smartest ‘wow’ moments for free.",
      pros:["Free skyline views","Good break from walking","Easy and safe"],
      cons:["It’s a ferry ride, not an ‘activity’"],
      tip:"Stand outside if the weather’s okay — hold your phone.",
      phrase:"The ferry is free, so it’s a smart choice for views."},

    {id:"p6", name:"Greenwich Village + West Village", bucket:"amazing",
      tags:["neighborhood","food","romantic","walk"],
      what:"Charming streets, cafés, brownstones, little shops. This is ‘movie NYC’: calmer, beautiful, and perfect for strolling.",
      pros:["Relaxed vibe","Cute cafés and dinner spots","Great for couples"],
      cons:["Some restaurants are pricey"],
      tip:"Walk without a strict plan. Choose one dinner reservation.",
      phrase:"The Village feels more authentic than midtown."},

    {id:"p7", name:"Broadway show (choose one)", bucket:"depends",
      tags:["culture","night","classic"],
      what:"A big NYC experience: lights, talent, energy. Amazing — but tickets can be expensive and you’ll need to plan.",
      pros:["Unforgettable atmosphere","Perfect evening plan","Great for couples/friends"],
      cons:["Pricey; can be overhyped if you pick the wrong show"],
      tip:"Set a budget and choose ONE show. Book ahead or use official discount options.",
      phrase:"It’s more expensive, but the atmosphere is incredible."},

    {id:"p8", name:"Observation deck (choose ONE)", bucket:"depends",
      tags:["views","classic","photo"],
      what:"High‑rise viewpoint with spectacular skyline photos. Worth it once — but lines, crowds, and ticket price can be intense.",
      pros:["Wow views","Amazing sunset photos","Iconic NYC moment"],
      cons:["Crowded and expensive"],
      tip:"Pick one deck only. Go early or book a time slot.",
      phrase:"It’s worth it if we book a good time slot."},

    {id:"p9", name:"Statue of Liberty / Ellis Island", bucket:"depends",
      tags:["history","classic","boat"],
      what:"Powerful history and iconic symbolism. The downside is logistics: lines, time, and security checks.",
      pros:["Historic + meaningful","Great photos from the boat","Good half‑day activity"],
      cons:["Takes a lot of time"],
      tip:"If time is short, do ferry views instead and spend time in neighborhoods.",
      phrase:"It’s meaningful, but it takes most of the morning."},

    {id:"p10", name:"Times Square (15–20 min)", bucket:"depends",
      tags:["classic","night","photo"],
      what:"Bright screens, noise, crowds. It’s a quick ‘postcard’ moment — fun briefly, exhausting for hours.",
      pros:["Iconic lights at night","Quick photo stop","Central location"],
      cons:["Overcrowded; tourist pressure"],
      tip:"Short visit only, then walk 5–10 minutes away for better food.",
      phrase:"Times Square is exciting, but it’s too crowded for me."},

    {id:"p11", name:"Chain restaurants in Times Square", bucket:"tourist",
      tags:["food","tourist-trap"],
      what:"Big menus, big prices, average quality. You often pay for the location, not the food.",
      pros:["Predictable menu","Easy for groups"],
      cons:["Overpriced; crowded; rushed"],
      tip:"Walk a few blocks. Choose smaller places with shorter menus.",
      phrase:"Let’s skip tourist chains and find a local place instead."},

    {id:"p12", name:"Aggressive street sellers / fake deals", bucket:"tourist",
      tags:["safety","tourist-trap"],
      what:"Pressure tactics (tickets, ‘gifts’, photos) that turn into tip demands. Not worth the stress.",
      pros:["None that justify the risk"],
      cons:["Scam risk; uncomfortable"],
      tip:"Keep walking. Say: “No, thanks.” Buy from official sites/booths.",
      phrase:"I’d avoid street sellers because they can be dishonest."},

    {id:"p13", name:"Pedicab rides in tourist zones", bucket:"tourist",
      tags:["tourist-trap","budget"],
      what:"Looks fun, but prices can explode quickly. It’s often a tourist trap in crowded areas.",
      pros:["Fun photo moment (maybe)"],
      cons:["Very expensive; unclear pricing"],
      tip:"Ask the price clearly per minute before you sit down — or skip it.",
      phrase:"It can be fun; however, it’s often overpriced."}
  ];

  var allTags = (function(){
    var set = {};
    places.forEach(function(p){ (p.tags||[]).forEach(function(t){ set[t]=true; }); });
    return Object.keys(set).sort();
  })();

  var selectedTags = [];

  var vocab = [
    {term:"bodega", def:"a small neighborhood convenience store (snacks, drinks, sandwiches)", ex:"Let’s grab breakfast at a bodega."},
    {term:"stoop", def:"front steps of a building / brownstone", ex:"People sit on the stoop in the evening."},
    {term:"borough", def:"a big area of NYC (Manhattan, Brooklyn, Queens…)", ex:"Brooklyn is a borough."},
    {term:"uptown / downtown", def:"north / south directions in Manhattan", ex:"We’re going downtown to SoHo."},
    {term:"express / local", def:"fast subway train vs stops at every station", ex:"Take the express if you can."},
    {term:"(to) grab", def:"to get quickly (food/drink)", ex:"Can we grab a coffee?"}
  ];

  var nycLines = [
    {std:"Excuse me — could you help me find the subway?", ny:"Hey — can you help me find the subway?"},
    {std:"Can I have a coffee to go, please?", ny:"Can I get a coffee to go?"},
    {std:"We should go early because it gets crowded.", ny:"Let’s go early — it gets packed."},
    {std:"One drawback is that it’s expensive.", ny:"Downside: it’s pricey."},
    {std:"Overall, I think it’s worth it.", ny:"Overall? Totally worth it."}
  ];

  var verbItems = [
    {q:"You want to reserve a hotel room online. You ____ a room.", a:"book", distract:["rent","lend"]},
    {q:"You want to make an idea politely. You ____ going to Brooklyn early.", a:"suggest", distract:["propose","protest"]},
    {q:"You don’t fully agree. You ____ your opinion.", a:"hedge", distract:["hate","heat"]},
    {q:"You want to defend your point. You ____ your reasons.", a:"argue", distract:["arrive","agree"]},
    {q:"You want to accept a compromise. You ____ a deal.", a:"accept", distract:["attack","attach"]}
  ];

  var sayItems = [
    {q:"In a restaurant: ask for the bill politely.", a:"Could we have the check, please?"},
    {q:"At the hotel: ask if late check‑out is possible.", a:"Would it be possible to check out a bit later?"},
    {q:"On the subway: ask which direction to go.", a:"Does this train go downtown?"},
    {q:"Disagreement: you prefer a cheaper plan.", a:"I get your point, but I’d rather keep it budget‑friendly."}
  ];

  var errorItems = [
    {bad:"I propose you to go to Brooklyn.", good:"I suggest going to Brooklyn."},
    {bad:"I am agree with you.", good:"I agree with you."},
    {bad:"In the contrary, we should go there.", good:"On the contrary, we should go there."},
    {bad:"We are in New York since three days.", good:"We’ve been in New York for three days."},
    {bad:"We will take the metro.", good:"We’ll take the subway."}
  ];

  var phrases = [
    {title:"Compare (pros/cons)", list:[
      "On the one hand…, on the other hand…",
      "One advantage is that… / One drawback is that…",
      "X is better than Y because…",
      "It’s worth it if… / It’s not worth it if…"
    ]},
    {title:"Suggest + decide", list:[
      "How about + -ing?",
      "We could… / We might…",
      "Why don’t we…?",
      "Let’s + base verb."
    ]},
    {title:"Polite requests", list:[
      "Could you…?",
      "Would you mind + -ing…?",
      "Is it possible to…?",
      "Could we have…? / Can I get…?"
    ]},
    {title:"Disagree politely", list:[
      "I see what you mean, but…",
      "That’s a good point. However…",
      "I get your point. Still…",
      "Would you be okay with…?"
    ]}
  ];

  var speakPrompts = [
    {
      prompt:"What makes NYC so great? (30–45 seconds)",
      model:"NYC is great because it’s incredibly diverse and every neighborhood feels different. You can walk, explore, and try amazing food at every price. I also love the energy — there’s always something happening. Overall, it’s a city that surprises you.",
      hint:"Use: because / also / overall. Add 2 examples (food, neighborhoods, parks, shows)."
    },
    {
      prompt:"Compare two places (Central Park vs Times Square)",
      model:"Central Park is better than Times Square because it’s calmer and more relaxing. Times Square is exciting; however, it’s overcrowded and you can feel stressed. If you want photos, a short stop is enough. Overall, I’d spend more time in the park.",
      hint:"Use: better than / however / overall."
    },
    {
      prompt:"Make a compromise with your partner/friend",
      model:"I get your point — the observation deck is iconic. However, it’s expensive. What if we do the free ferry for views and spend the money on one nice dinner instead?",
      hint:"Use: I get your point / however / what if… instead?"
    },
    {
      prompt:"Polite request at the hotel + one extra question",
      model:"Hi! Would it be possible to check out a bit later tomorrow? Also, could you recommend a good local breakfast spot nearby?",
      hint:"Use: Would it be possible to…? Also, could you…?"
    }
  ];

  // ---------- Rendering ----------
  function renderNYCGreat(){
    var box = $("nycGreatChips");
    if(!box) return;
    box.innerHTML = "";
    nycGreatIdeas.forEach(function(t){
      var b = document.createElement("button");
      b.className = "chipBtn";
      b.type = "button";
      b.textContent = "➕ " + t;
      b.onclick = function(){
        var out = $("nycGreatOut");
        var cur = out.value.trim();
        if(cur.length === 0){
          out.value = "NYC is great because " + t + ".";
        }else{
          out.value = cur.replace(/\s*$/,"") + " Also, " + t + ".";
        }
        setHint("Build with: NYC is great because… Also… Overall…");
      };
      box.appendChild(b);
    });

    $("btnNYCGreatSpeak").onclick = function(){
      speak($("nycGreatOut").value || "NYC is great because it’s diverse and full of energy.");
      markSolved("nyc_great");
    };
    $("btnNYCGreatCopy").onclick = function(){ copyText($("nycGreatOut").value); };
  }

  function renderTagChips(){
    var box = $("tagChips");
    box.innerHTML = "";
    allTags.forEach(function(tag){
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = tag;
      b.onclick = function(){
        var idx = selectedTags.indexOf(tag);
        if(idx>-1){ selectedTags.splice(idx,1); b.classList.remove("active"); }
        else{
          if(selectedTags.length >= 4){ toast("Tip: choose 2–4 tags maximum"); return; }
          selectedTags.push(tag); b.classList.add("active");
        }
        renderPlacesBoard();
      };
      box.appendChild(b);
    });
  }

  function matchesFilters(p){
    var f = $("placeFilter").value;
    if(f !== "all" && p.bucket !== f) return false;
    if(selectedTags.length){
      for(var i=0;i<selectedTags.length;i++){
        if((p.tags||[]).indexOf(selectedTags[i]) === -1) return false;
      }
    }
    return true;
  }

  function bucketLabel(b){
    if(b==="amazing") return "⭐ To die for";
    if(b==="depends") return "⚠️ Depends";
    return "🧨 Tourist‑trappy";
  }

  function renderPlaceCard(p){
    var div = document.createElement("div");
    div.className = "place";
    div.setAttribute("data-id", p.id);

    div.innerHTML =
      '<div class="top">' +
        '<div class="name">'+escapeHtml(p.name)+'</div>' +
        '<span class="badge '+escapeHtml(p.bucket)+'">'+bucketLabel(p.bucket)+'</span>' +
      '</div>' +
      '<div class="desc">'+escapeHtml(p.what)+'</div>' +
      '<div class="tags">'+(p.tags||[]).map(function(t){ return '<span class="tag">'+escapeHtml(t)+'</span>'; }).join("")+'</div>' +
      '<div class="phrase"><span class="kbd">Say it</span> '+escapeHtml(p.phrase||"")+'</div>' +
      '<div class="actions">' +
        '<button class="btn btn--ghost" type="button" data-act="speak">🔊 Listen</button>' +
        '<button class="btn" type="button" data-act="add">➕ Add to plan</button>' +
        '<button class="btn btn--ghost" type="button" data-act="moveA">⭐</button>' +
        '<button class="btn btn--ghost" type="button" data-act="moveD">⚠️</button>' +
        '<button class="btn btn--ghost" type="button" data-act="moveT">🧨</button>' +
      '</div>' +
      '<details><summary>More details (pros/cons)</summary>' +
        '<div class="more">' +
          '<b>Pros:</b> '+escapeHtml((p.pros||[]).join(" • "))+'<br/>' +
          '<b>Cons:</b> '+escapeHtml((p.cons||[]).join(" • "))+'<br/>' +
          '<b>Tip:</b> '+escapeHtml(p.tip||"") +
        '</div>' +
      '</details>';

    div.addEventListener("click", function(e){
      var t = e.target;
      if(!t || !t.getAttribute) return;
      var act = t.getAttribute("data-act");
      if(!act) return;

      if(act === "speak"){
        speak(p.name + ". " + p.what + ". Pro tip: " + (p.tip||""));
        e.stopPropagation();
      }
      if(act === "add"){
        addToPlan(p.id);
        setHint("Now compare: One advantage is that… One drawback is that… Overall…");
        e.stopPropagation();
      }
      if(act === "moveA"){ movePlace(p.id, "amazing"); e.stopPropagation(); }
      if(act === "moveD"){ movePlace(p.id, "depends"); e.stopPropagation(); }
      if(act === "moveT"){ movePlace(p.id, "tourist"); e.stopPropagation(); }
    });

    return div;
  }

  function renderPlacesBoard(){
    var colA = $("colAmazing"), colD = $("colDepends"), colT = $("colTourist");
    colA.innerHTML = ""; colD.innerHTML = ""; colT.innerHTML = "";

    places.filter(matchesFilters).forEach(function(p){
      var card = renderPlaceCard(p);
      if(p.bucket==="amazing") colA.appendChild(card);
      if(p.bucket==="depends") colD.appendChild(card);
      if(p.bucket==="tourist") colT.appendChild(card);
    });
  }

  function movePlace(id, bucket){
    var p = places.find(function(x){ return x.id === id; });
    if(!p) return;
    p.bucket = bucket;
    renderPlacesBoard();
    toast("Moved ✅");
  }

  // ---------- Places board check + explanations ----------
  function buildExplainPanel(){
    function section(title, list){
      var items = list.map(function(p){
        var pros = (p.pros||[]).slice(0,3).map(function(x){ return "<li>"+escapeHtml(x)+"</li>"; }).join("");
        var cons = (p.cons||[]).slice(0,2).map(function(x){ return "<li>"+escapeHtml(x)+"</li>"; }).join("");
        return (
          "<div class='box' style='margin-top:10px;'>" +
            "<h3 style='margin:0 0 6px;'>"+escapeHtml(p.name)+"</h3>" +
            "<div class='small muted'>"+escapeHtml(p.what)+"</div>" +
            "<div class='small' style='margin-top:8px;'>" +
              "<span class='kbd'>Why here</span> "+escapeHtml(bucketLabel(p.bucket))+" — "+escapeHtml(p.phrase) +
            "</div>" +
            "<div class='grid2' style='margin-top:10px;'>" +
              "<div class='box'><b>Pros</b><ul>"+pros+"</ul></div>" +
              "<div class='box'><b>Cons</b><ul>"+cons+"</ul><div class='small muted2' style='margin-top:6px;'><b>Tip:</b> "+escapeHtml(p.tip||"")+"</div></div>" +
            "</div>" +
          "</div>"
        );
      }).join("");
      return "<div class='lessonBox'><h3 style='margin:0 0 8px;'>"+title+"</h3>"+items+"</div>";
    }

    var A = places.filter(function(p){ return p.bucket==="amazing"; });
    var D = places.filter(function(p){ return p.bucket==="depends"; });
    var T = places.filter(function(p){ return p.bucket==="tourist"; });

    var html = "";
    html += section("🟢 Why these are “to die for”", A);
    html += section("🟡 Why these are “depends”", D);
    html += section("🔴 Why these feel tourist‑trappy", T);

    html += "<div class='box' style='margin-top:12px;'>" +
      "<h3 style='margin:0 0 8px;'>Describe places like the UK lesson (templates)</h3>" +
      "<p class='small muted'>" +
      "1) <b>What it’s like</b>: It feels… / The vibe is… / It’s perfect for…<br/>" +
      "2) <b>Pros/cons</b>: One advantage is… / One drawback is…<br/>" +
      "3) <b>Compare</b>: X is better than Y because… / whereas… / however…<br/>" +
      "4) <b>Recommend</b>: If you like ___, you’ll love ___. / It’s worth it if…<br/>" +
      "</p>" +
      "</div>";

    return html;
  }

  // ---------- Plan builder ----------
  var plan = [];

  function addToPlan(id){
    if(plan.indexOf(id) > -1) return toast("Already in your plan 🙂");
    plan.push(id);
    renderPlan();
  }

  function removeFromPlan(id){
    plan = plan.filter(function(x){ return x !== id; });
    renderPlan();
  }

  function renderPlan(){
    var box = $("planList");
    box.innerHTML = "";
    if(plan.length === 0){
      box.innerHTML = "<div class='small muted2'>No places yet. Tap <b>➕ Add to plan</b> on a card.</div>";
      return;
    }

    plan.forEach(function(id){
      var p = places.find(function(x){ return x.id === id; });
      if(!p) return;
      var div = document.createElement("div");
      div.className = "planItem";
      div.innerHTML =
        "<div class='left'>" +
          "<div class='title'>"+escapeHtml(p.name)+"</div>" +
          "<div class='small muted2'>"+escapeHtml(bucketLabel(p.bucket))+" • "+escapeHtml((p.tags||[]).slice(0,3).join(", "))+"</div>" +
        "</div>" +
        "<button class='btn btn--ghost' type='button' data-rm='"+escapeHtml(p.id)+"'>✖</button>";

      div.addEventListener("click", function(e){
        var b = e.target;
        var rid = b && b.getAttribute ? b.getAttribute("data-rm") : null;
        if(rid){ removeFromPlan(rid); e.stopPropagation(); }
      });
      box.appendChild(div);
    });
  }

  function buildItineraryFromPlan(){
    var picks = plan.map(function(id){ return places.find(function(p){ return p.id===id; }); }).filter(Boolean);
    if(picks.length === 0){
      return "Pick 3–6 places first (use ➕ Add to plan), then build an itinerary.";
    }
    var days = Math.min(5, Math.max(3, picks.length));
    var blocks = [];
    blocks.push("NYC Trip Draft ("+days+" days) — partner/friend");
    blocks.push("");
    for(var d=1; d<=days; d++){
      var p = picks[(d-1) % picks.length];
      var alt = picks[(d) % picks.length];
      blocks.push("Day "+d+": " + p.name);
      blocks.push("• What it’s like: " + p.what);
      blocks.push("• One advantage is that " + (p.pros[0] || "it’s enjoyable") + ".");
      blocks.push("• One drawback is that " + (p.cons[0] || "it can be crowded") + ".");
      blocks.push("• Suggestion: How about " + alt.name + " afterwards?");
      blocks.push("");
    }
    blocks.push("Overall: I think this plan is balanced because we mix iconic views, culture, and relaxed neighborhood time.");
    return blocks.join("\n");
  }

  // ---------- NYC vocab + vibe ----------
  function renderVocab(){
    var grid = $("nycVocabGrid");
    grid.innerHTML = "";
    vocab.forEach(function(v){
      var div = document.createElement("div");
      div.className = "vocabCard";
      div.innerHTML =
        "<div class='term'>"+escapeHtml(v.term)+"</div>" +
        "<div class='def'>"+escapeHtml(v.def)+"</div>" +
        "<div class='ex'><span class='kbd'>Example</span> "+escapeHtml(v.ex)+"</div>" +
        "<div class='row'>" +
          "<button class='btn btn--ghost' type='button' data-say='1'>🔊 Listen</button>" +
          "<button class='btn btn--ghost' type='button' data-copy='1'>📋 Copy example</button>" +
        "</div>";
      div.addEventListener("click", function(e){
        var t = e.target;
        if(!t || !t.getAttribute) return;
        if(t.getAttribute("data-say")){
          speak(v.term + ". " + v.def + ". Example: " + v.ex);
        }
        if(t.getAttribute("data-copy")){
          copyText(v.ex);
        }
      });
      grid.appendChild(div);
    });

    $("btnVocabHint").onclick = function(){
      toggleHint("hintVocab",
        "NYC tip: a ‘bodega’ is very New York. Also: New Yorkers often say ‘Can I get…?’ and ‘to go’ instead of ‘take away’.",
        "NYC vibe");
    };

    $("btnVocabQuiz").onclick = function(){
      var box = $("vocabQuiz");
      box.hidden = !box.hidden;
      if(!box.hidden) renderVocabQuiz();
    };
  }

  function renderVocabQuiz(){
    var box = $("vocabQuiz");
    var q = [
      {p:"A small neighborhood store is a…", a:"bodega", d:["borough","stoop"]},
      {p:"Front steps of a brownstone are a…", a:"stoop", d:["express","grab"]},
      {p:"A fast subway train is…", a:"express", d:["local","uptown"]}
    ];
    var html = "<div class='small muted2'><b>Quick quiz</b> — click the right answer.</div>";
    q.forEach(function(it, idx){
      html += "<div class='q'><div class='q__prompt'>"+escapeHtml(it.p)+"</div>";
      var opts = [it.a].concat(it.d);
      opts.sort(function(){ return Math.random()-0.5; });
      html += "<div class='opts' data-qid='vocab_"+idx+"'>";
      opts.forEach(function(o){
        html += "<button class='opt' data-ans='"+(o===it.a?"right":"wrong")+"'>"+escapeHtml(o)+"</button>";
      });
      html += "</div><div class='fb' data-fb='vocab_"+idx+"'></div></div>";
    });
    box.innerHTML = html;
    bindOptionBlocks(box);
    markSolved("vocab_quiz");
  }

  function renderNYCLines(){
    var box = $("nycLines");
    box.innerHTML = "";
    nycLines.forEach(function(l){
      var div = document.createElement("div");
      div.className = "line";
      div.innerHTML =
        "<div class='std'>Standard: "+escapeHtml(l.std)+"</div>" +
        "<div class='ny'>NYC vibe: "+escapeHtml(l.ny)+"</div>";
      div.onclick = function(){
        speak(l.std + " … " + l.ny);
        setHint("Notice the shortcuts: can I have → can I get; downside; packed.");
      };
      box.appendChild(div);
    });

    $("btnNYCLineHint").onclick = function(){
      toggleHint("hintNYCLine",
        "Sound natural: shorten. Use strong words: packed, pricey, worth it. Smile in your voice. Don’t overdo slang.",
        "NYC rhythm");
    };

    $("btnNYCLinePractice").onclick = function(){
      $("nycScriptOut").value =
        "Hey! Can I get a coffee to go?\n" +
        "Let’s go early — it gets packed.\n" +
        "Downside: it’s pricey. Overall? Totally worth it.\n" +
        "Could you help me find the subway?";
      markSolved("nyc_lines");
      updateProgress();
    };

    $("btnNYCScriptSpeak").onclick = function(){ speak($("nycScriptOut").value); };
    $("btnNYCScriptCopy").onclick = function(){ copyText($("nycScriptOut").value); };
  }

  // ---------- Option quiz blocks ----------
  function bindOptionBlocks(root){
    var blocks = root.querySelectorAll(".opts");
    blocks.forEach(function(block){
      var qid = block.getAttribute("data-qid");
      var fb = root.querySelector("[data-fb='"+qid+"']");
      var opts = block.querySelectorAll(".opt");

      opts.forEach(function(btn){
        btn.onclick = function(){
          // lock if already solved
          if(state.solved[qid]) return;
          var right = btn.getAttribute("data-ans") === "right";
          opts.forEach(function(b){ b.classList.remove("good","bad"); });
          btn.classList.add(right ? "good" : "bad");

          if(fb){
            fb.className = "fb " + (right ? "good":"bad");
            fb.textContent = right ? "✅ Correct. Say it out loud once." : "❌ Try again. Read the hint if needed.";
          }
          setHint(right ? "Nice — now reuse this structure in your speaking." : "Look for the grammar pattern (e.g., suggest + -ing).");
          if(right){
            markSolved(qid);
          }else{
            state.streak = 0;
            save();
            updateProgress();
          }
        };
      });
    });
  }

  // ---------- Builder (tap-to-move words) ----------
  var builders = {
    req1: {
      words: ["Would","it","be","possible","to","check","out","a","bit","later","tomorrow","?"],
      answer: "Would it be possible to check out a bit later tomorrow ?",
      hint: "Use: Would it be possible to…? (very polite)",
      reveal: "Would it be possible to check out a bit later tomorrow?"
    }
  };

  function renderBuilder(id){
    var b = builders[id];
    var bank = $("bank_"+id);
    var out = $("out_"+id);
    bank.innerHTML = "";
    out.innerHTML = "";

    var shuffled = b.words.slice().sort(function(){ return Math.random()-0.5; });
    shuffled.forEach(function(w){
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "word";
      chip.textContent = w;
      chip.onclick = function(){
        out.appendChild(chip);
      };
      bank.appendChild(chip);
    });

    document.querySelector("[data-reset='"+id+"']").onclick = function(){
      renderBuilder(id);
      $("fb_"+id).textContent = "";
      $("hint_"+id).hidden = true;
    };

    document.querySelector("[data-hint='"+id+"']").onclick = function(){
      toggleHint("hint_"+id, b.hint, "Builder hint");
    };

    document.querySelector("[data-reveal='"+id+"']").onclick = function(){
      $("fb_"+id).className = "fb";
      $("fb_"+id).textContent = "👀 Model: " + b.reveal;
      setHint("Repeat the model, then personalize it.");
    };

    document.querySelector("[data-check='"+id+"']").onclick = function(){
      var built = Array.prototype.slice.call(out.querySelectorAll(".word")).map(function(x){ return x.textContent; }).join(" ");
      var target = b.answer;
      var ok = normalizeSentence(built) === normalizeSentence(target);
      $("fb_"+id).className = "fb " + (ok ? "good":"bad");
      $("fb_"+id).textContent = ok ? "✅ Great. That’s very polite." : "❌ Not quite. Try again or Reveal.";
      if(ok){
        speak(b.reveal);
        markSolved("builder_"+id);
      }else{
        state.streak = 0; save(); updateProgress();
      }
    };
  }

  function normalizeSentence(s){
    return String(s||"").toLowerCase().replace(/\s+/g," ").trim().replace(/\s\?/g,"?");
  }

  // ---------- Verb quiz ----------
  function renderVerbQuiz(){
    var box = $("verbQuiz");
    var html = "";
    verbItems.forEach(function(it, i){
      var opts = [it.a].concat(it.distract||[]);
      opts.sort(function(){ return Math.random()-0.5; });
      html += "<div class='q'><div class='q__prompt'>"+escapeHtml(it.q)+"</div>";
      html += "<div class='opts' data-qid='verb_"+i+"'>";
      opts.forEach(function(o){
        html += "<button class='opt' data-ans='"+(o===it.a?"right":"wrong")+"'>"+escapeHtml(o)+"</button>";
      });
      html += "</div><div class='fb' data-fb='verb_"+i+"'></div></div>";
    });
    box.innerHTML = html;
    bindOptionBlocks(box);
  }

  function renderVerbChips(){
    var box = $("verbChips");
    box.innerHTML = "";
    var list = ["book","reserve","suggest","prefer","avoid","recommend","argue","agree","disagree","compromise","decide","visit"];
    list.forEach(function(v){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chipBtn";
      b.textContent = v;
      b.onclick = function(){
        var out = $("verbSpeakOut");
        var s = out.value.trim();
        var line = "I " + v + "…";
        out.value = (s ? (s + "\n") : "") + line;
      };
      box.appendChild(b);
    });

    $("btnVerbSpeak").onclick = function(){ speak($("verbSpeakOut").value); markSolved("verb_speak"); };
    $("btnVerbCopy").onclick = function(){ copyText($("verbSpeakOut").value); };
  }

  // ---------- Situations ----------
  var scenarios = [
    {
      title:"Subway confusion (uptown/downtown)",
      text:"You’re in Manhattan. You need to go to Brooklyn Bridge. You’re not sure if the train goes downtown.",
      req:["Could you…?","Does this train go…?","We should… because…"],
      goal:"Ask for help politely + decide the right direction."
    },
    {
      title:"Hotel issue (too loud)",
      text:"Your room is noisy. You want to ask for a quieter room or earplugs.",
      req:["Would it be possible…?","I’m sorry to bother you, but…","Is there any chance…?"],
      goal:"Polite complaint + solution."
    },
    {
      title:"Restaurant decision (budget vs trendy)",
      text:"Your friend wants a trendy spot. You want something budget‑friendly but still good.",
      req:["I get your point, but…","One drawback is…","What if we… instead?"],
      goal:"Negotiate a compromise."
    },
    {
      title:"Tourist pressure (street seller)",
      text:"Someone offers a ‘special deal’ and tries to stop you. You want to leave politely and safely.",
      req:["No, thanks.","We’re all set.","Have a good day."],
      goal:"Refuse clearly without being rude."
    }
  ];

  function newScenario(){
    var s = scenarios[Math.floor(Math.random()*scenarios.length)];
    var html = "<h4>"+escapeHtml(s.title)+"</h4>" +
      "<div>"+escapeHtml(s.text)+"</div>" +
      "<div class='req'><div><b>Your goal:</b> "+escapeHtml(s.goal)+"</div>" +
      "<div style='margin-top:8px;'><b>Must use:</b> " + s.req.map(function(x){ return "<span class='kbd'>"+escapeHtml(x)+"</span>"; }).join(" ") + "</div></div>";
    $("scenarioOut").innerHTML = html;
    markSolved("scenario");
  }

  // “What would you say?” quiz
  function renderSayQuiz(){
    var box = $("sayQuiz");
    var html = "";
    sayItems.forEach(function(it, i){
      html += "<div class='q'><div class='q__prompt'>"+escapeHtml(it.q)+"</div>" +
        "<textarea class='ta' rows='2' id='say_"+i+"' placeholder='Type your answer…'></textarea>" +
        "<div class='row'>" +
          "<button class='btn' type='button' data-check='say_"+i+"'>✅ Check</button>" +
          "<button class='btn btn--ghost' type='button' data-model='"+escapeHtml(it.a)+"'>👀 Model</button>" +
          "<button class='btn btn--ghost' type='button' data-speak='say_"+i+"'>🔊 Speak</button>" +
        "</div>" +
        "<div class='fb' id='fb_say_"+i+"'></div></div>";
    });
    box.innerHTML = html;

    box.addEventListener("click", function(e){
      var t = e.target;
      if(!t || !t.getAttribute) return;
      var check = t.getAttribute("data-check");
      var model = t.getAttribute("data-model");
      var sp = t.getAttribute("data-speak");

      if(model){
        setHint("Model: " + model);
        toast("Model shown 👀");
        return;
      }
      if(sp){
        speak($(sp).value || "Could we have the check, please?");
        return;
      }
      if(check){
        var val = $(check).value.trim().toLowerCase();
        var idx = parseInt(check.split("_")[1],10);
        var target = sayItems[idx].a.toLowerCase();
        var ok = val && (val.indexOf("could")>-1 || val.indexOf("would")>-1 || val.indexOf("does")>-1 || val.indexOf("i get")>-1);
        var fb = $("fb_"+check);
        fb.className = "fb " + (ok ? "good":"bad");
        fb.textContent = ok ? "✅ Good. Now say it out loud once." : "❌ Try using a polite starter (Could you… / Would it be possible…?).";
        if(ok) markSolved("say_"+idx);
        else { state.streak=0; save(); updateProgress(); }
      }
    });
  }

  // ---------- Negotiate ----------
  var negSets = {
    deck: {
      A:["I get your point — the view is iconic.","I agree the view would be amazing.","You’re right, it’s a special experience."],
      B:["However, it’s expensive.","Still, the tickets cost a lot.","That said, it can be crowded."],
      C:["What if we do the free ferry for views and spend money on dinner instead?","How about we pick ONE deck and keep the rest budget‑friendly?","Could we go early to avoid crowds, then do a free walk later?"],
      model:"I get your point — the view is iconic. However, it’s expensive. What if we do the free ferry for views and spend money on dinner instead?"
    },
    broadway: {
      A:["I’d love to see a show too.","I get why Broadway is tempting.","That sounds fun."],
      B:["However, I’d rather not spend too much.","Still, we have to watch our budget.","That said, it might be too long after a full day."],
      C:["What if we choose one cheaper show and do free activities the other nights?","How about a discount ticket plus an early dinner?","Could we do a show only if we find tickets under $___?"],
      model:"That sounds fun. Still, we have to watch our budget. What if we choose one cheaper show and do free activities the other nights?"
    },
    museum: {
      A:["Museums are a great idea.","I love cultural days.","That’s a good plan."],
      B:["However, we’ve already done a lot of indoor stuff.","Still, the weather is nice.","That said, we might get museum fatigue."],
      C:["What if we do one museum in the morning and a park walk in the afternoon?","How about we pick one museum and keep the next day outdoors?","Could we do the museum only if it rains?"],
      model:"Museums are a great idea. However, we might get museum fatigue. What if we do one museum in the morning and a park walk in the afternoon?"
    }
  };

  function fillNeg(){
    var key = $("negTopic").value;
    var s = negSets[key];

    function fillSelect(el, arr){
      el.innerHTML = "";
      arr.forEach(function(x){
        var o = document.createElement("option");
        o.textContent = x;
        el.appendChild(o);
      });
    }
    fillSelect($("negA"), s.A);
    fillSelect($("negB"), s.B);
    fillSelect($("negC"), s.C);

    function updateOut(){
      $("negOut").value = $("negA").value + " " + $("negB").value + " " + $("negC").value;
    }
    $("negA").onchange = updateOut;
    $("negB").onchange = updateOut;
    $("negC").onchange = updateOut;
    updateOut();

    $("btnNegHint").onclick = function(){
      toggleHint("hintNeg", "Use: I get your point… However… What if we… instead?", "Negotiation");
    };
    $("btnNegReveal").onclick = function(){
      $("negOut").value = s.model;
      $("fbNeg").className = "fb good";
      $("fbNeg").textContent = "👀 Model inserted. Now personalize it!";
      setHint("Replace one detail (price, time, place).");
    };
    $("btnNegCheck").onclick = function(){
      var txt = $("negOut").value;
      var ok = /however|still|that said/i.test(txt) && /what if|how about|could we/i.test(txt);
      $("fbNeg").className = "fb " + (ok ? "good":"bad");
      $("fbNeg").textContent = ok ? "✅ Great compromise structure." : "❌ Add a softener (however/still) AND a compromise (what if/how about).";
      if(ok){ markSolved("neg"); speak(txt); }
      else { state.streak=0; save(); updateProgress(); }
    };
  }

  // Tone softener
  function softenTone(s){
    s = (s||"").trim();
    if(!s) return "";
    var starters = ["I see what you mean, but","I get your point; however,","Maybe we could","Would you be okay with"];
    var pick = starters[Math.floor(Math.random()*starters.length)];
    // If sentence ends with ".", keep punctuation
    s = s.replace(/[.!?]+$/,"").trim();
    return pick + " " + s.toLowerCase() + "?";
  }

  // ---------- Errors ----------
  function renderErrors(){
    var box = $("errorsBox");
    box.innerHTML = "";
    errorItems.forEach(function(it, idx){
      var div = document.createElement("div");
      div.className = "err";
      div.innerHTML =
        "<div class='badline'>❌ "+escapeHtml(it.bad)+"</div>" +
        "<input id='err_"+idx+"' placeholder='Type the correct sentence…' />" +
        "<div class='actions'>" +
          "<button class='btn' type='button' data-check='"+idx+"'>✅ Check</button>" +
          "<button class='btn btn--ghost' type='button' data-reveal='"+idx+"'>👀 Reveal</button>" +
          "<button class='btn btn--ghost' type='button' data-say='"+idx+"'>🔊 Listen</button>" +
        "</div>" +
        "<div class='fb' id='fb_err_"+idx+"'></div>";

      div.addEventListener("click", function(e){
        var t = e.target;
        if(!t || !t.getAttribute) return;
        var c = t.getAttribute("data-check");
        var r = t.getAttribute("data-reveal");
        var s = t.getAttribute("data-say");
        if(c !== null){
          var val = $("err_"+c).value.trim().toLowerCase();
          var target = it.good.toLowerCase();
          var ok = normalizeSentence(val) === normalizeSentence(target);
          var fb = $("fb_err_"+c);
          fb.className = "fb " + (ok ? "good":"bad");
          fb.textContent = ok ? "✅ Correct." : "❌ Not quite. Check the grammar pattern.";
          if(ok) markSolved("err_"+c);
          else { state.streak=0; save(); updateProgress(); }
        }
        if(r !== null){
          $("err_"+r).value = it.good;
          $("fb_err_"+r).className = "fb good";
          $("fb_err_"+r).textContent = "👀 Model inserted. Repeat it once.";
          setHint("Repeat the corrected sentence, then create your own example.");
        }
        if(s !== null){
          speak(it.good);
        }
      });

      box.appendChild(div);
    });
  }

  // ---------- Phrase bank ----------
  function renderPhrases(){
    var acc = $("phraseAcc");
    acc.innerHTML = "";
    phrases.forEach(function(group){
      var d = document.createElement("details");
      d.className = "acc";
      d.innerHTML = "<summary>"+escapeHtml(group.title)+"</summary><div class='accBody'></div>";
      var body = d.querySelector(".accBody");
      group.list.forEach(function(p){
        var row = document.createElement("div");
        row.className = "phrase";
        row.innerHTML =
          "<div class='txt'>"+escapeHtml(p)+"</div>" +
          "<div class='actions'>" +
            "<button class='btn btn--ghost' type='button' data-copy='1'>📋</button>" +
            "<button class='btn btn--ghost' type='button' data-say='1'>🔊</button>" +
          "</div>";
        row.addEventListener("click", function(e){
          var t = e.target;
          if(!t || !t.getAttribute) return;
          if(t.getAttribute("data-copy")) copyText(p);
          if(t.getAttribute("data-say")) speak(p);
          e.stopPropagation();
        });
        body.appendChild(row);
      });
      acc.appendChild(d);
    });
  }

  // ---------- Itinerary builder (standalone) ----------
  function buildItinerary(days, style, comp){
    days = parseInt(days,10) || 5;
    var intro = "NYC itinerary ("+days+" days) — " + comp + " • style: " + style;
    var blocks = [intro, ""];
    var pools = {
      "Balanced":["Central Park","The Met","High Line + Chelsea Market","Brooklyn Bridge + DUMBO","A neighborhood stroll (Village/SoHo)","Free ferry views"],
      "Romantic":["West Village stroll","Central Park picnic","Sunset views","Nice dinner","Brooklyn waterfront walk","Jazz bar (optional)"],
      "Nature + parks":["Central Park","High Line","Prospect Park (Brooklyn)","Roosevelt Island walk","Waterfront stroll","Picnic + coffee"],
      "Culture + museums":["The Met","MoMA (optional)","9/11 Memorial (serious)","NY Public Library + Grand Central","Broadway (one night)","Gallery stroll"],
      "Foodie":["Chelsea Market","Chinatown dumplings","Pizza slice crawl","Bagels + coffee","Food hall / market","Neighborhood dinner"],
      "Budget":["Free ferry views","Central Park","High Line","Brooklyn Bridge walk","Public library + Grand Central","Neighborhood strolling"]
    };
    var list = pools[style] || pools["Balanced"];
    for(var i=1;i<=days;i++){
      var a = list[(i-1) % list.length];
      var b = list[(i) % list.length];
      blocks.push("Day "+i+": "+a);
      blocks.push("• We could do "+a+" in the morning.");
      blocks.push("• Then, how about "+b+" afterwards?");
      blocks.push("• One advantage is that it’s enjoyable. One drawback is that it can be crowded.");
      blocks.push("");
    }
    blocks.push("Overall, I think this plan is great because it mixes iconic NYC moments with relaxed neighborhood time.");
    return blocks.join("\n");
  }

  // ---------- Speak guided ----------
  function renderSpeak(){
    var grid = $("speakGrid");
    grid.innerHTML = "";
    speakPrompts.forEach(function(sp, idx){
      var card = document.createElement("div");
      card.className = "speakCard";
      card.innerHTML =
        "<div class='prompt'>"+escapeHtml(sp.prompt)+"</div>" +
        "<div class='row'>" +
          "<button class='btn btn--ghost' type='button' data-model='1'>👀 Model answer</button>" +
          "<button class='btn btn--ghost' type='button' data-show='1'>📝 Show text</button>" +
          "<button class='btn btn--ghost' type='button' data-hint='1'>💡 Hint</button>" +
          "<button class='btn btn--ghost' type='button' data-speak='1'>🔊 Speak model</button>" +
        "</div>" +
        "<div class='model hidden' id='model_"+idx+"'></div>" +
        "<div class='answer'>" +
          "<textarea class='ta' rows='5' id='ans_"+idx+"' placeholder='Personalize here…'></textarea>" +
          "<div class='row'>" +
            "<button class='btn btn--ghost' type='button' data-copyans='"+idx+"'>📋 Copy</button>" +
            "<button class='btn btn--ghost' type='button' data-speakans='"+idx+"'>🔊 Speak</button>" +
          "</div>" +
        "</div>";

      card.querySelector("#model_"+idx).textContent = sp.model;

      card.addEventListener("click", function(e){
        var t = e.target;
        if(!t || !t.getAttribute) return;
        if(t.getAttribute("data-model")){
          var m = $("model_"+idx);
          m.classList.toggle("hidden");
          toast("Model toggled 👀");
          setHint("Model: " + sp.model);
        }
        if(t.getAttribute("data-show")){
          var m2 = $("model_"+idx);
          m2.classList.remove("hidden");
          toast("Text shown 📝");
        }
        if(t.getAttribute("data-hint")){
          setHint(sp.hint);
          toast("Hint set 💡");
        }
        if(t.getAttribute("data-speak")){
          speak(sp.model);
          markSolved("speak_model_"+idx);
        }
        var ca = t.getAttribute("data-copyans");
        if(ca !== null){
          copyText($("ans_"+idx).value);
        }
        var sa = t.getAttribute("data-speakans");
        if(sa !== null){
          speak($("ans_"+idx).value || sp.model);
          markSolved("speak_ans_"+idx);
        }
      });

      grid.appendChild(card);
    });

    // Mark section complete when any answer is spoken
    // (done implicitly by speak_ans keys)
  }

  // ---------- Wrap quiz ----------
  function renderWrap(){
    var box = $("wrapQuiz");
    var q = [
      {p:"Choose: I suggest ____ there early.", a:"going", d:["to go","go"]},
      {p:"Choose: You ____ smoke in the subway. (rule)", a:"mustn’t", d:["must","don’t have to"]},
      {p:"Choose connector: The ferry is free, ____ the deck is expensive.", a:"whereas", d:["therefore","because"]}
    ];
    var html = "";
    q.forEach(function(it, i){
      var opts = [it.a].concat(it.d);
      opts.sort(function(){ return Math.random()-0.5; });
      html += "<div class='q'><div class='q__prompt'>"+escapeHtml(it.p)+"</div>";
      html += "<div class='opts' data-qid='wrap_"+i+"'>";
      opts.forEach(function(o){
        html += "<button class='opt' data-ans='"+(o===it.a?"right":"wrong")+"'>"+escapeHtml(o)+"</button>";
      });
      html += "</div><div class='fb' data-fb='wrap_"+i+"'></div></div>";
    });
    box.innerHTML = html;
    bindOptionBlocks(box);
  }

  // ---------- Wire up buttons ----------
  function wire(){
    $("btnPrint").onclick = function(){ window.print(); };
    $("btnSpeakSelection").onclick = speakSelection;

    // Accent radios
    var radios = document.querySelectorAll("input[name='accent']");
    radios.forEach(function(r){
      r.onchange = function(){ accent = r.value; toast("Accent: " + (accent==="us"?"US":"UK")); };
    });

    $("btnReset").onclick = function(){
      if(!confirm("Reset progress for this lesson?")) return;
      state = { solved:{}, streak:0 };
      plan = [];
      selectedTags = [];
      save();
      renderAll();
      toast("Reset ✅");
    };

    $("btnStartHint").onclick = function(){
      toggleHint("hintStart",
        "Useful connectors: however, whereas, therefore, moreover, overall. Pros/cons: One advantage is… One drawback is…",
        "Start");
    };
    $("btnStartDone").onclick = function(){ markSolved("start_done"); };

    $("placeFilter").onchange = renderPlacesBoard;

    $("btnPlacesHint").onclick = function(){
      toggleHint("hintPlaces",
        "Compare in 3 steps: 1) What it’s like. 2) 2 pros + 1 con. 3) Decide: worth it / depends / skip.",
        "Places");
    };

    $("btnPlacesCheck").onclick = function(){
      $("placesExplain").innerHTML = buildExplainPanel();
      $("placesExplain").hidden = false;
      markSolved("places_checked");
      setHint("Read one profile and summarize: It feels… One advantage… One drawback… Overall…");
      toast("Explanation panel opened ✅");
    };

    $("btnPlanBuild").onclick = function(){
      $("planOut").value = buildItineraryFromPlan();
      markSolved("plan_build");
    };
    $("btnPlanSpeak").onclick = function(){ speak($("planOut").value); };
    $("btnPlanCopy").onclick = function(){ copyText($("planOut").value); };
    $("btnPlanClear").onclick = function(){ plan = []; renderPlan(); $("planOut").value = ""; };

    // Grammar hints + completions
    $("btnSuggestHint").onclick = function(){ toggleHint("hintSuggest","After suggest: use -ing. Also: How about + -ing?", "Suggest"); };
    $("btnSuggestDone").onclick = function(){ markSolved("suggest_done"); };
    $("btnObHint").onclick = function(){ toggleHint("hintOb","have to = obligation; mustn’t = prohibition; don’t have to = not necessary.", "Obligation"); };
    $("btnObDone").onclick = function(){ markSolved("ob_done"); };
    $("btnCompHint").onclick = function(){ toggleHint("hintComp","because = reason; whereas = contrast; however = contrast (new sentence).", "Compare"); };
    $("btnCompDone").onclick = function(){ markSolved("comp_done"); };

    // Verb section
    $("btnVerbHint").onclick = function(){ toggleHint("hintVerb","Suggest/Recommend/Prefer/Avoid are super useful for planning + debating.", "Verbs"); };
    $("btnVerbDone").onclick = function(){ markSolved("verbs_done"); };

    // Situations
    $("btnScenario").onclick = newScenario;
    $("btnScenarioHint").onclick = function(){ toggleHint("hintScenario","Required phrases: Could you…? Would it be possible…? I get your point, but… Overall…", "Situations"); };
    $("btnSayHint").onclick = function(){ toggleHint("hintSay","Start polite: Could you…? Would it be possible…? I get your point, but…", "Say it"); };
    $("btnSayDone").onclick = function(){ markSolved("say_done"); };

    // Negotiate + tone
    $("negTopic").onchange = fillNeg;

    $("btnToneHint").onclick = function(){ toggleHint("hintTone","Softeners: maybe, a bit, I feel, would you be okay with…?, I get your point…", "Tone"); };
    $("btnToneSoften").onclick = function(){
      $("toneOut").value = softenTone($("toneIn").value);
      markSolved("tone");
    };
    $("btnToneSpeak").onclick = function(){ speak($("toneOut").value); };
    $("btnToneCopy").onclick = function(){ copyText($("toneOut").value); };

    // Errors
    $("btnErrorsHint").onclick = function(){ toggleHint("hintErrors","Check: suggest + -ing, agree (no 'am'), on the contrary, for/since, subway (not metro).", "Errors"); };
    $("btnErrorsDone").onclick = function(){ markSolved("errors_done"); };

    // Itinerary builder
    $("btnItHint").onclick = function(){ toggleHint("hintIt","Use: We could… How about… One advantage is… Overall…", "Itinerary"); };
    $("btnItBuild").onclick = function(){
      $("itOut").value = buildItinerary($("itDays").value, $("itStyle").value, $("itComp").value);
      markSolved("it_build");
    };
    $("btnItCopy").onclick = function(){ copyText($("itOut").value); };
    $("btnItSpeak").onclick = function(){ speak($("itOut").value); };

    // Wrap
    $("btnWrapHint").onclick = function(){ toggleHint("hintWrap","Remember: suggest + -ing; mustn’t = prohibition; whereas = contrast.", "Wrap-up"); };
    $("btnWrapDone").onclick = function(){ markSolved("wrap_done"); };

    // Cheat sheet
    $("btnCheatCopy").onclick = function(){
      var text = "Compare: On the one hand…, on the other hand…\nPros/cons: One advantage is that… / One drawback is that…\nSuggest: How about + -ing? / We could… / Why don’t we…?\nObligation: have to / must / don’t have to / mustn’t\nPolite request: Could you…? / Would you mind + -ing? / Is it possible to…?\nConclusion: Overall, I think… because…";
      copyText(text);
    };
    $("btnCheatSpeak").onclick = function(){
      speak("On the one hand. On the other hand. One advantage is that. One drawback is that. How about going. We could. Why don't we. You have to. You mustn't. Could you. Would you mind. Overall, I think.");
    };
  }

  // ---------- Render all ----------
  function renderAll(){
    MAX = normalizeMax();
    renderNYCGreat();
    renderTagChips();
    renderPlacesBoard();
    renderPlan();

    renderVocab();
    renderNYCLines();

    // quizzes
    bindOptionBlocks(document);
    renderBuilder("req1");
    renderVerbQuiz();
    renderVerbChips();
    renderSayQuiz();
    renderErrors();
    renderPhrases();
    renderSpeak();
    renderWrap();

    fillNeg();

    updateProgress();
  }

  // ---------- Init ----------
  function init(){
    load();
    wire();
    renderAll();
    setHint("Start with Section 2: choose places, read the descriptions, then compare.");
  }

  document.addEventListener("DOMContentLoaded", init);
})();